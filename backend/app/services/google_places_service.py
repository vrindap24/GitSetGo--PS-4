"""Google Places API (New) — Fetch public reviews by Place ID.

Uses the Place Details (New) endpoint to retrieve reviews that customers
have left on Google Maps.  Only requires an API key (no OAuth, no business
ownership).

Endpoint:
    GET https://places.googleapis.com/v1/places/{place_id}
    Headers: X-Goog-Api-Key, X-Goog-FieldMask
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

import httpx

from app.config import get_settings
from app.firebase import get_db

logger = logging.getLogger(__name__)

PLACES_API_BASE = "https://places.googleapis.com/v1/places"


# ---------------------------------------------------------------------------
# Fetch
# ---------------------------------------------------------------------------
async def fetch_place_reviews(
    api_key: str,
    place_id: str,
) -> list[dict[str, Any]]:
    """Fetch public reviews for a Google Maps place.

    Args:
        api_key: Google Cloud API key with Places API (New) enabled.
        place_id: Google Maps Place ID (e.g. ``ChIJ...``).

    Returns:
        List of review dicts from the API (max 5 per Google policy).
    """
    url = f"{PLACES_API_BASE}/{place_id}"
    headers = {
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": (
            "displayName,rating,userRatingCount,"
            "reviews.name,reviews.relativePublishTimeDescription,"
            "reviews.rating,reviews.text,reviews.originalText,"
            "reviews.authorAttribution,reviews.publishTime"
        ),
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, headers=headers)

            if response.status_code != 200:
                logger.error(
                    "❌ Google Places API error %d: %s",
                    response.status_code,
                    response.text,
                )
                return []

            data = response.json()
            reviews = data.get("reviews", [])

            place_name = data.get("displayName", {}).get("text", "Unknown")
            overall_rating = data.get("rating", "N/A")
            total_ratings = data.get("userRatingCount", 0)

            logger.info(
                "📥 Fetched %d reviews for '%s' (rating: %s, total: %d) [place_id=%s]",
                len(reviews),
                place_name,
                overall_rating,
                total_ratings,
                place_id,
            )
            return reviews

    except Exception as e:
        logger.error("❌ Google Places API fetch failed: %s", e)
        return []


# ---------------------------------------------------------------------------
# Transform
# ---------------------------------------------------------------------------
def transform_places_review(
    review: dict[str, Any],
    branch_id: str,
) -> dict[str, Any]:
    """Transform a Google Places review into our internal format.

    Args:
        review: Raw review from the Places API (New).
        branch_id: Internal branch ID to associate with.

    Returns:
        Dict matching our ReviewCreate schema.
    """
    # Rating (integer 1-5)
    rating = review.get("rating", 3)

    # Reviewer name
    author = review.get("authorAttribution", {})
    reviewer_name = author.get("displayName", "Google User")

    # Review text — prefer originalText, fall back to text
    original = review.get("originalText", {})
    text_obj = review.get("text", {})
    review_text = (
        original.get("text", "")
        or text_obj.get("text", "")
        or f"{rating}-star rating (no comment)"
    )

    # Timestamp
    publish_time = review.get("publishTime", "")

    # Unique source ID (review resource name)
    source_id = review.get("name", "")

    return {
        "platform": "Google",
        "branch_id": branch_id,
        "rating": rating,
        "review_text": review_text,
        "reviewer_name": reviewer_name,
        "source_id": source_id,
        "source_url": author.get("uri", ""),
        "timestamp": publish_time or datetime.now(timezone.utc).isoformat(),
    }


# ---------------------------------------------------------------------------
# Ingest
# ---------------------------------------------------------------------------
async def ingest_places_reviews(
    api_key: str,
    place_branch_map: dict[str, str],
) -> dict[str, Any]:
    """Fetch and ingest Google Places reviews for all configured places.

    Args:
        api_key: Google Cloud API key.
        place_branch_map: Mapping of Place IDs → internal branch IDs.
            Example: ``{"ChIJxyz": "b1", "ChIJabc": "b2"}``

    Returns:
        Summary of ingestion results.
    """
    db = get_db()
    results: dict[str, Any] = {
        "total_fetched": 0,
        "new_imported": 0,
        "already_exists": 0,
        "errors": 0,
        "places": {},
    }

    for place_id, branch_id in place_branch_map.items():
        logger.info(
            "📥 Fetching Google Places reviews for %s → branch %s",
            place_id,
            branch_id,
        )

        reviews = await fetch_place_reviews(api_key, place_id)
        results["total_fetched"] += len(reviews)
        place_result = {"fetched": len(reviews), "imported": 0, "skipped": 0}

        for review in reviews:
            source_id = review.get("name", "")

            # De-duplicate by source_id
            if source_id:
                existing = (
                    db.collection("reviews")
                    .where("platform", "==", "Google")
                    .where("source_id", "==", source_id)
                    .limit(1)
                    .get()
                )
                if len(list(existing)) > 0:
                    results["already_exists"] += 1
                    place_result["skipped"] += 1
                    continue

            # Transform and save
            try:
                transformed = transform_places_review(review, branch_id)
                _, doc_ref = db.collection("reviews").add(
                    {
                        **transformed,
                        "processed": False,
                        "ai_analysis": None,
                        "escalation_id": None,
                    }
                )
                review_id = doc_ref.id

                # Trigger AI processing in background
                from app.services.review_processor import process_review
                import asyncio

                asyncio.create_task(process_review(review_id))

                results["new_imported"] += 1
                place_result["imported"] += 1

            except Exception as e:
                logger.error("❌ Failed to import review %s: %s", source_id, e)
                results["errors"] += 1

        results["places"][place_id] = place_result

    logger.info(
        "✅ Google Places review ingestion complete: %d fetched, %d new, %d existing",
        results["total_fetched"],
        results["new_imported"],
        results["already_exists"],
    )
    return results
