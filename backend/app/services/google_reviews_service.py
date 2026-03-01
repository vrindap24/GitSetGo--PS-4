"""Google Business Profile Reviews integration.

Fetches reviews from Google Business Profile (Maps) and ingests them
into the Reflo AI pipeline for processing.

Requirements:
  1. Enable "Google Business Profile API" in Google Cloud Console
  2. Create OAuth2 credentials OR use service account
  3. Set env vars: GOOGLE_BUSINESS_ACCOUNT_ID, GOOGLE_BUSINESS_LOCATION_IDS

The Google Business Profile API uses the My Business API v4 for reviews:
  GET /v4/accounts/{accountId}/locations/{locationId}/reviews
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

import httpx

from app.config import get_settings
from app.firebase import get_db

logger = logging.getLogger(__name__)

GBP_API_BASE = "https://mybusiness.googleapis.com/v4"


async def fetch_google_reviews(
    access_token: str,
    account_id: str,
    location_id: str,
    page_size: int = 50,
) -> list[dict[str, Any]]:
    """Fetch reviews from a single Google Business Profile location.

    Args:
        access_token: OAuth2 access token for Google APIs.
        account_id: Google Business account ID.
        location_id: Google Business location/place ID.
        page_size: Number of reviews per page (max 50).

    Returns:
        List of review dicts from the API.
    """
    url = f"{GBP_API_BASE}/accounts/{account_id}/locations/{location_id}/reviews"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    }
    params = {"pageSize": page_size}

    all_reviews = []

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            while True:
                response = await client.get(url, headers=headers, params=params)

                if response.status_code != 200:
                    logger.error(
                        "❌ Google Business API error %d: %s",
                        response.status_code, response.text,
                    )
                    break

                data = response.json()
                reviews = data.get("reviews", [])
                all_reviews.extend(reviews)

                # Check for next page
                next_token = data.get("nextPageToken")
                if not next_token:
                    break
                params["pageToken"] = next_token

    except Exception as e:
        logger.error("❌ Google Business API fetch failed: %s", e)

    logger.info(
        "📥 Fetched %d Google reviews for location %s",
        len(all_reviews), location_id,
    )
    return all_reviews


def transform_google_review(review: dict[str, Any], branch_id: str) -> dict[str, Any]:
    """Transform a Google Business review into our internal format.

    Args:
        review: Raw review from Google Business API.
        branch_id: Internal branch ID to associate with.

    Returns:
        Dict matching our ReviewCreate schema.
    """
    # Google rating is "STAR_RATING" enum: ONE, TWO, THREE, FOUR, FIVE
    rating_map = {"ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5}
    star_rating = review.get("starRating", "THREE")
    rating = rating_map.get(star_rating, 3)

    # Reviewer name
    reviewer = review.get("reviewer", {})
    reviewer_name = reviewer.get("displayName", "Google User")

    # Review text (comment)
    review_text = review.get("comment", "")
    if not review_text:
        review_text = f"{rating}-star rating (no comment)"

    # Timestamp
    create_time = review.get("createTime", "")

    return {
        "platform": "Google",
        "branch_id": branch_id,
        "rating": rating,
        "review_text": review_text,
        "reviewer_name": reviewer_name,
        "source_id": review.get("reviewId", ""),
        "source_url": review.get("name", ""),
        "timestamp": create_time or datetime.now(timezone.utc).isoformat(),
    }


async def ingest_google_reviews(
    access_token: str,
    account_id: str,
    location_branch_map: dict[str, str],
) -> dict[str, Any]:
    """Fetch and ingest Google reviews for all mapped locations.

    Args:
        access_token: OAuth2 access token.
        account_id: Google Business account ID.
        location_branch_map: Mapping of Google location IDs to internal branch IDs.
            Example: {"locations/12345": "b1", "locations/67890": "b2"}

    Returns:
        Summary of ingestion results.
    """
    db = get_db()
    results = {
        "total_fetched": 0,
        "new_imported": 0,
        "already_exists": 0,
        "errors": 0,
        "locations": {},
    }

    for location_id, branch_id in location_branch_map.items():
        logger.info("📥 Fetching reviews for location %s → branch %s", location_id, branch_id)

        reviews = await fetch_google_reviews(access_token, account_id, location_id)
        results["total_fetched"] += len(reviews)
        loc_result = {"fetched": len(reviews), "imported": 0, "skipped": 0}

        for review in reviews:
            source_id = review.get("reviewId", "")

            # Check if already imported (avoid duplicates)
            existing = (
                db.collection("reviews")
                .where("platform", "==", "Google")
                .where("source_id", "==", source_id)
                .limit(1)
                .get()
            )

            if len(list(existing)) > 0:
                results["already_exists"] += 1
                loc_result["skipped"] += 1
                continue

            # Transform and save
            try:
                transformed = transform_google_review(review, branch_id)
                doc_ref = db.collection("reviews").add({
                    **transformed,
                    "processed": False,
                    "ai_analysis": None,
                    "escalation_id": None,
                })
                review_id = doc_ref[1].id

                # Trigger AI processing
                from app.services.review_processor import process_review
                import asyncio
                asyncio.create_task(process_review(review_id))

                results["new_imported"] += 1
                loc_result["imported"] += 1

            except Exception as e:
                logger.error("❌ Failed to import review %s: %s", source_id, e)
                results["errors"] += 1

        results["locations"][location_id] = loc_result

    logger.info(
        "✅ Google review ingestion complete: %d fetched, %d new, %d existing",
        results["total_fetched"],
        results["new_imported"],
        results["already_exists"],
    )
    return results
