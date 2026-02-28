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
