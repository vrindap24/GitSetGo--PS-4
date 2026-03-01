"""Background review processor – Agent orchestration pipeline.

Orchestrates the 4-agent analysis pipeline in sequence:
1. Categorization Agent → categories, staff, urgency, intensity
2. Sentiment & Risk Agent → sentiment, risk score, intents
3. Response Agent → 3 reply variants
4. Escalation Agent → evaluate + handle escalation
"""

from __future__ import annotations

import logging
from typing import Any

from app.agents import (
    categorization_agent,
    escalation_agent,
    response_agent,
    sentiment_risk_agent,
)
from app.config import get_settings
from app.firebase import get_db
from app.utils.sentiment_utils import urgency_from_risk

logger = logging.getLogger(__name__)


async def process_review(review_id: str) -> None:
    """Run the full agent pipeline for a single review.

    This function is designed to be called as a FastAPI BackgroundTask.

    Pipeline:
        1. Categorization Agent
        2. Sentiment & Risk Agent
        3. Response Agent
        4. Escalation Agent
        5. Update Firestore with combined results

    Args:
        review_id: Firestore document ID of the review to process.
    """
    db = get_db()
    settings = get_settings()
    doc_ref = db.collection("reviews").document(review_id)
    doc = doc_ref.get()

    if not doc.exists:
        logger.error("Review %s not found – skipping processing.", review_id)
        return

    data = doc.to_dict()
    review_text: str = data.get("review_text", "")
    rating: int = data.get("rating", 5)
    branch_id: str = data.get("branch_id", "")
    existing_categories: list[str] = data.get("categories", [])

    logger.info("🔄 Processing review %s through agent pipeline …", review_id)

    # ── Agent 1: Categorization ──────────────────────────────────────────
    logger.info("  🏷️  Agent 1: Categorization …")
    cat_result = await categorization_agent.categorize(review_text, rating)
    ai_categories = cat_result.get("categories", [])
    
    # Merge existing (user-submitted) categories with AI categories
    categories = list(set(existing_categories + ai_categories))
    
    staff_mentioned = cat_result.get("staff_mentioned")
    emotional_intensity = float(cat_result.get("emotional_intensity", 0.0))

    # ── Agent 2: Sentiment & Risk ────────────────────────────────────────
    logger.info("  📊 Agent 2: Sentiment & Risk …")
    sr_result = await sentiment_risk_agent.analyze_sentiment_and_risk(
        review_text, rating, emotional_intensity
    )
    sentiment_label = sr_result.get("sentiment_label", "Neutral")
    risk_score = sr_result.get("risk_score", 0)
    urgency_level = urgency_from_risk(risk_score)

    # ── Agent 3: Response ────────────────────────────────────────────────
    logger.info("  💬 Agent 3: Response …")
    resp_result = await response_agent.generate_responses(
        review_text, rating, sentiment_label, categories
    )

    # ── Agent 4: Escalation ──────────────────────────────────────────────
    logger.info("  🚨 Agent 4: Escalation …")
    esc_result = escalation_agent.evaluate_escalation(
        review_text, rating, risk_score
    )
    escalation_required = esc_result.get("escalation_required", False)

    # ── Build combined AI analysis ───────────────────────────────────────
    ai_analysis: dict[str, Any] = {
        # Categorization agent
        "categories": categories,
        "staff_mentioned": staff_mentioned,
        "emotional_intensity": emotional_intensity,
        # Sentiment & Risk agent
        "sentiment_label": sentiment_label,
        "sentiment_score": float(sr_result.get("sentiment_score", 0.0)),
        "risk_score": risk_score,
        "urgency_level": urgency_level,
        "detected_intent": sr_result.get("detected_intent_summary", ""),
        "detected_intents": sr_result.get("detected_intents", {}),
        # Response agent
        "response_suggestion": resp_result.get("polite_reply", ""),
        "polite_reply": resp_result.get("polite_reply", ""),
        "brand_tone_reply": resp_result.get("brand_tone_reply", ""),
        "apology_compensation_reply": resp_result.get("apology_compensation_reply", ""),
        # Escalation agent
        "escalation_required": escalation_required,
        "escalation_triggers": esc_result.get("triggers", []),
        "escalation_priority": esc_result.get("priority", "None"),
    }

    # ── Update Firestore ─────────────────────────────────────────────────
    update_data: dict[str, Any] = {
        "ai_analysis": ai_analysis,
        "processed": True,
    }

    escalation_id = None
    if escalation_required:
        escalation_id = await escalation_agent.handle_escalation(
            review_id=review_id,
            branch_id=branch_id,
            risk_score=risk_score,
            triggers=esc_result.get("triggers", []),
        )
        update_data["escalation_id"] = escalation_id

    doc_ref.update(update_data)
    logger.info(
        "✅ Review %s processed – risk=%d, sentiment=%s, escalation=%s",
        review_id,
        risk_score,
        sentiment_label,
        escalation_id or "none",
    )
