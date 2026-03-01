"""Review API routes."""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query

from app.config import get_settings
from app.firebase import get_db
from app.models.review_model import ReviewModel
from app.schemas.review_schema import ReviewCreate, ReviewResponse
from app.services.review_processor import process_review
from app.utils.sanitize import sanitize_review_text

logger = logging.getLogger(__name__)
router = APIRouter()

_MAX_REVIEW_LENGTH = get_settings().max_review_length


@router.post("/reviews", response_model=ReviewResponse, status_code=201)
async def create_review(
    review: ReviewCreate,
    background_tasks: BackgroundTasks,
):
    """Submit a new review.

    Validates and sanitizes input, saves to Firestore with ``processed=False``,
    and triggers background AI processing.
    """
    db = get_db()

    # ── Server-side sanitization ─────────────────────────────────────────
    clean_text = sanitize_review_text(review.review_text, _MAX_REVIEW_LENGTH)

    if len(clean_text) < 3:
        raise HTTPException(
            status_code=400,
            detail="Review text is too short after sanitization (min 3 characters).",
        )

    model = ReviewModel(
        platform=review.platform.value,
        branch_id=review.branch_id,
        rating=review.rating,
        review_text=clean_text,
        reviewer_name=review.reviewer_name,
        staff_tagged=review.staff_tagged,
        categories=review.categories,
        processed=False,
    )

    _, doc_ref = db.collection("reviews").add(model.to_dict())
    review_id = doc_ref.id
    logger.info("Review created: %s – queuing AI processing.", review_id)

    # Trigger non-blocking background processing
    background_tasks.add_task(process_review, review_id)

    return ReviewResponse(
        id=review_id,
        platform=review.platform,
        branch_id=review.branch_id,
        rating=review.rating,
        review_text=clean_text,
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


@router.get("/test-whatsapp")
async def test_whatsapp():
    """Send a test WhatsApp message to verify the integration."""
    from app.services.whatsapp_service import send_whatsapp_alert

    settings = get_settings()

    if not settings.whatsapp_access_token or not settings.whatsapp_phone_number_id:
        return {
            "error": "WhatsApp not configured",
            "whatsapp_access_token_set": bool(settings.whatsapp_access_token),
            "whatsapp_phone_number_id_set": bool(settings.whatsapp_phone_number_id),
            "escalation_whatsapp_recipients": settings.escalation_whatsapp_recipients,
        }

    recipients = []
    if settings.escalation_whatsapp_recipients:
        recipients = [r.strip() for r in settings.escalation_whatsapp_recipients.split(",")]

    if not recipients:
        return {"error": "No recipients configured in ESCALATION_WHATSAPP_RECIPIENTS"}

    results = []
    for phone in recipients:
        result = await send_whatsapp_alert(
            phone_number_id=settings.whatsapp_phone_number_id,
            access_token=settings.whatsapp_access_token,
            to_phone=phone,
            review_text="TEST: This is a test escalation alert from Reflo. If you see this, WhatsApp integration is working!",
            branch_name="Powai Test Branch",
            rating=1,
            triggers=["Low rating: 1/5", "Keywords: disgusting, complaint"],
            priority="Critical",
        )
        results.append({"phone": phone, "result": result})

    return {"status": "sent", "recipients": results}
