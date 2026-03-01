"""Ingestion API routes – Pull reviews from external platforms."""

from __future__ import annotations

import logging
from enum import Enum

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query

from app.agents.ingestion_agent import ingest_from_google, ingest_from_zomato
from app.firebase import get_db
from app.services.review_processor import process_review

logger = logging.getLogger(__name__)
router = APIRouter()


class IngestPlatform(str, Enum):
    GOOGLE = "google"
    ZOMATO = "zomato"


@router.post("/ingest/{platform}")
async def ingest_reviews(
    platform: IngestPlatform,
    background_tasks: BackgroundTasks,
    branch_id: str = Query(..., description="Branch ID to associate reviews with"),
):
    """Trigger review ingestion from an external platform.

    🔶 PLACEHOLDER: Returns mock data for hackathon demo.

    Ingested reviews are saved to Firestore and queued for AI processing.
    """
    # Select connector based on platform
    if platform == IngestPlatform.GOOGLE:
        reviews = await ingest_from_google(branch_id)
    elif platform == IngestPlatform.ZOMATO:
        reviews = await ingest_from_zomato(branch_id)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform}")

    if not reviews:
        return {"message": "No reviews found", "count": 0}

    # Save each review to Firestore and queue AI processing
    db = get_db()
    created_ids: list[str] = []

    for review_data in reviews:
        _, doc_ref = db.collection("reviews").add(review_data)
        review_id = doc_ref.id
        created_ids.append(review_id)
        background_tasks.add_task(process_review, review_id)

    logger.info(
        "Ingested %d reviews from %s for branch %s",
        len(created_ids), platform.value, branch_id,
    )

    return {
        "message": f"Ingested {len(created_ids)} reviews from {platform.value}",
        "count": len(created_ids),
        "review_ids": created_ids,
        "note": "🔶 Mock data used for hackathon demo",
    }


@router.post("/ingest/google-places")
async def ingest_google_places_reviews(
    background_tasks: BackgroundTasks,
    branch_id: str = Query(..., description="Branch ID to associate reviews with"),
    place_id: str = Query(None, description="Google Maps Place ID (overrides config)"),
):
    """Fetch real public reviews from Google Maps via Places API (New).

    Requires:
    - GOOGLE_PLACES_API_KEY set in .env (API key with Places API enabled)
    - Either pass `place_id` as query param or configure GOOGLE_PLACE_IDS in .env

    Each imported review goes through the full AI processing pipeline.
    """
    from app.config import get_settings
    from app.services.google_places_service import ingest_places_reviews

    settings = get_settings()

    api_key = settings.google_places_api_key
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="GOOGLE_PLACES_API_KEY is not set. Add it to your .env file.",
        )

    # Build place_id → branch_id mapping
    place_branch_map: dict[str, str] = {}

    if place_id:
        # Explicit place_id from query param
        place_branch_map[place_id] = branch_id
    elif settings.google_place_ids:
        # Parse from config: "ChIJxyz:b1,ChIJabc:b2"
        for pair in settings.google_place_ids.split(","):
            pair = pair.strip()
            if ":" in pair:
                pid, bid = pair.split(":", 1)
                place_branch_map[pid.strip()] = bid.strip()
            else:
                place_branch_map[pair.strip()] = branch_id
    else:
        raise HTTPException(
            status_code=400,
            detail="No place_id provided. Either pass ?place_id=ChIJ... or set GOOGLE_PLACE_IDS in .env.",
        )

    results = await ingest_places_reviews(api_key, place_branch_map)

    return {
        "message": "Google Places review ingestion complete",
        "results": results,
    }


@router.post("/ingest/google-business")
async def ingest_google_business_reviews(
    background_tasks: BackgroundTasks,
    access_token: str = Query(None, description="OAuth2 access token (or uses env)"),
    account_id: str = Query(None, description="Google Business Account ID (or uses env)"),
):
    """Fetch real reviews from Google Business Profile API and process them.

    Requires:
    - OAuth2 access token (from Google Cloud Console or passed as param)
    - Account ID and location mapping configured in .env

    Each imported review goes through the full 6-agent AI pipeline.
    """
    import json

    from app.config import get_settings
    from app.services.google_reviews_service import ingest_google_reviews

    settings = get_settings()

    token = access_token or ""
    acct_id = account_id or settings.google_business_account_id

    if not token:
        raise HTTPException(
            status_code=400,
            detail="access_token is required. Get it from Google Cloud Console OAuth2 playground.",
        )

    if not acct_id:
        raise HTTPException(
            status_code=400,
            detail="account_id is required. Set GOOGLE_BUSINESS_ACCOUNT_ID in .env or pass as param.",
        )

    # Parse location-to-branch mapping from config
    location_map_str = settings.google_business_location_map
    if not location_map_str:
        raise HTTPException(
            status_code=400,
            detail="GOOGLE_BUSINESS_LOCATION_MAP not configured. Set it in .env as JSON, e.g. "
                   '{"locations/123456": "b1", "locations/789012": "b2"}',
        )

    try:
        location_map = json.loads(location_map_str)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail="GOOGLE_BUSINESS_LOCATION_MAP is not valid JSON.",
        )

    results = await ingest_google_reviews(token, acct_id, location_map)

    return {
        "message": "Google Business review ingestion complete",
        "results": results,
    }
