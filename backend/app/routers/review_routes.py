"""Review API routes."""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query

from app.firebase import get_db
from app.models.review_model import ReviewModel
from app.schemas.review_schema import ReviewCreate, ReviewResponse
from app.services.review_processor import process_review

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/reviews", response_model=ReviewResponse, status_code=201)
async def create_review(
    review: ReviewCreate,
    background_tasks: BackgroundTasks,
):
    """Submit a new review.

    Saves the review to Firestore with ``processed=False`` and triggers
    background AI processing.
    """
    db = get_db()

    model = ReviewModel(
        platform=review.platform.value,
        branch_id=review.branch_id,
        rating=review.rating,
        review_text=review.review_text,
        reviewer_name=review.reviewer_name,
        staff_tagged=review.staff_tagged,
        processed=False,
    )

    _, doc_ref = db.collection("reviews").add(model.to_dict())
    review_id = doc_ref.id
    logger.info("Review created: %s – queuing AI processing.", review_id)

    # Trigger background processing
    background_tasks.add_task(process_review, review_id)

    return ReviewResponse(
        id=review_id,
        platform=review.platform,
        branch_id=review.branch_id,
        rating=review.rating,
        review_text=review.review_text,
        reviewer_name=review.reviewer_name,
        staff_tagged=review.staff_tagged,
        timestamp=model.timestamp,
        processed=False,
    )


@router.get("/reviews", response_model=list[ReviewResponse])
async def list_reviews(
    branch_id: Optional[str] = Query(None, description="Filter by branch"),
    rating: Optional[int] = Query(None, ge=1, le=5, description="Filter by rating"),
    sentiment: Optional[str] = Query(None, description="Filter by sentiment label"),
    processed: Optional[bool] = Query(None, description="Filter by processed status"),
):
    """List reviews with optional filters."""
    db = get_db()
    query = db.collection("reviews")

    if branch_id:
        query = query.where("branch_id", "==", branch_id)
    if rating is not None:
        query = query.where("rating", "==", rating)
    if processed is not None:
        query = query.where("processed", "==", processed)

    results: list[ReviewResponse] = []
    for doc in query.stream():
        data = doc.to_dict()

        # Client-side filter for nested sentiment label
        if sentiment:
            ai = data.get("ai_analysis")
            if not ai or ai.get("sentiment_label") != sentiment:
                continue

        results.append(ReviewResponse(id=doc.id, **data))

    return results
