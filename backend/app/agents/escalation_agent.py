"""Escalation Agent – Evaluate escalation triggers and notify managers.

Triggers:
- Rating ≤ 2
- Keywords: "manager", "complaint", "never again"
- Risk score > ESCALATION_THRESHOLD

🔶 PLACEHOLDER: WhatsApp and SMS notifications are mocked.
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from app.config import get_settings
from app.firebase import get_db
from app.services.escalation_service import create_escalation

logger = logging.getLogger(__name__)

# Keywords that trigger escalation
ESCALATION_KEYWORDS: list[str] = [
    "manager",
    "complaint",
    "never again",
    "legal",
    "lawyer",
    "sue",
    "consumer forum",
    "food poisoning",
    "health department",
    "unacceptable",
    "disgusting",
    "worst experience",
]


def evaluate_escalation(
    review_text: str,
    rating: int,
    risk_score: int,
) -> dict[str, Any]:
    """Determine whether a review requires escalation.

    Args:
        review_text: The raw review text.
        rating: Star rating (1–5).
        risk_score: Calculated risk score (0–100).

    Returns:
        Dict with escalation_required, triggers (list of reasons), priority.
    """
    settings = get_settings()
    triggers: list[str] = []

    # Check rating
    if rating <= 2:
        triggers.append(f"Low rating: {rating}/5")

    # Check risk score
    if risk_score > settings.escalation_threshold:
        triggers.append(f"High risk score: {risk_score}")

    # Check keywords
    text_lower = review_text.lower()
    matched_keywords = [kw for kw in ESCALATION_KEYWORDS if kw in text_lower]
    if matched_keywords:
        triggers.append(f"Keywords: {', '.join(matched_keywords)}")

    escalation_required = len(triggers) > 0

    # Priority based on number of triggers
    if len(triggers) >= 3:
        priority = "Critical"
    elif len(triggers) == 2:
        priority = "High"
    elif len(triggers) == 1:
        priority = "Medium"
    else:
        priority = "None"

    return {
        "escalation_required": escalation_required,
        "triggers": triggers,
        "priority": priority,
    }


async def handle_escalation(
    review_id: str,
    branch_id: str,
    risk_score: int,
    triggers: list[str],
) -> str | None:
    """Create an escalation ticket and attempt to notify the manager.

    Args:
        review_id: The review that triggered escalation.
        branch_id: Branch the review belongs to.
        risk_score: Calculated risk score.
        triggers: List of escalation trigger reasons.

    Returns:
        Escalation document ID, or None if no escalation was needed.
    """
    # Create escalation ticket
    escalation_id = create_escalation(
        review_id=review_id,
        branch_id=branch_id,
        risk_score=risk_score,
    )

    # Attempt to notify manager
    await _notify_manager(branch_id, review_id, triggers)

    return escalation_id


async def _notify_manager(
    branch_id: str,
    review_id: str,
    triggers: list[str],
) -> None:
    """Send notification to branch manager.

    Uses WhatsApp Cloud API when configured, otherwise logs to console.
    """
    settings = get_settings()

    # Try to get manager contact and review details from Firestore
    manager_contact = "Unknown"
    manager_name = "Manager"
    branch_name = branch_id
    review_text = ""
    rating = 0

    try:
        db = get_db()

        # Get branch info
        branch_doc = db.collection("branches").document(branch_id).get()
        if branch_doc.exists:
            data = branch_doc.to_dict()
            manager_contact = data.get("manager_contact", "Unknown")
            manager_name = data.get("manager_name", data.get("manager", "Manager"))
            branch_name = data.get("name", branch_id)

        # Get review info
        review_doc = db.collection("reviews").document(review_id).get()
        if review_doc.exists:
            r_data = review_doc.to_dict()
            review_text = r_data.get("review_text", "")
            rating = r_data.get("rating", 0)
    except Exception as e:
        logger.warning("Could not fetch details for notification: %s", e)

    # Determine priority
    priority = "High" if len(triggers) >= 2 else "Medium"
    if len(triggers) >= 3:
        priority = "Critical"

    # ── WhatsApp Cloud API ────────────────────────────────────────────
    if settings.whatsapp_access_token and settings.whatsapp_phone_number_id:
        from app.services.whatsapp_service import send_whatsapp_alert

        # Get recipients: explicit list or manager contact
        recipients = []
        if settings.escalation_whatsapp_recipients:
            recipients = [r.strip() for r in settings.escalation_whatsapp_recipients.split(",")]
        elif manager_contact != "Unknown":
            recipients = [manager_contact]

        for phone in recipients:
            await send_whatsapp_alert(
                phone_number_id=settings.whatsapp_phone_number_id,
                access_token=settings.whatsapp_access_token,
                to_phone=phone,
                review_text=review_text,
                branch_name=branch_name,
                rating=rating,
                triggers=triggers,
                priority=priority,
            )

        logger.info(
            "📱 WhatsApp escalation sent to %d recipients for review %s",
            len(recipients), review_id,
        )
    else:
        logger.info(
            "⚠️ WhatsApp not configured. Would notify %s (%s) about review %s – Triggers: %s. "
            "Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in .env to enable.",
            manager_name, manager_contact, review_id, ", ".join(triggers),
        )
