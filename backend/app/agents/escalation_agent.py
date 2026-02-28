"""Escalation Agent – Evaluate escalation triggers and notify managers.

Triggers:
- Rating ≤ 2
- Keywords: "manager", "complaint", "never again"
- Risk score > ESCALATION_THRESHOLD

🔶 PLACEHOLDER: WhatsApp and SMS notifications are mocked.
"""

from __future__ import annotations

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


def handle_escalation(
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
    _notify_manager(branch_id, review_id, triggers)

    return escalation_id


def _notify_manager(
    branch_id: str,
    review_id: str,
    triggers: list[str],
) -> None:
    """Send notification to branch manager.

    🔶 PLACEHOLDER – Currently logs to console.
    Replace with real WhatsApp/SMS API integration.
    """
    settings = get_settings()

    # Try to get manager contact from Firestore
    manager_contact = "Unknown"
    try:
        db = get_db()
        doc = db.collection("branches").document(branch_id).get()
        if doc.exists:
            data = doc.to_dict()
            manager_contact = data.get("manager_contact", "Unknown")
            manager_name = data.get("manager_name", "Manager")
        else:
            manager_name = "Manager"
    except Exception:
        manager_name = "Manager"

    # 🔶 PLACEHOLDER: WhatsApp notification
    if settings.whatsapp_api_key:
        # TODO: Replace with real WhatsApp Business API call
        # import httpx
        # async with httpx.AsyncClient() as client:
        #     await client.post("https://api.whatsapp.com/...", json={
        #         "to": manager_contact,
        #         "message": f"⚠️ Escalation alert for review {review_id}"
        #     })
        logger.info(
            "🔶 [PLACEHOLDER] Would send WhatsApp to %s (%s): Escalation for review %s – Triggers: %s",
            manager_name, manager_contact, review_id, ", ".join(triggers),
        )
    else:
        logger.info(
            "🔶 [MOCK] WhatsApp notification skipped (no API key). "
            "Would notify %s (%s) about review %s – Triggers: %s",
            manager_name, manager_contact, review_id, ", ".join(triggers),
        )

    # 🔶 PLACEHOLDER: SMS notification
    if settings.sms_api_key:
        # TODO: Replace with real Twilio SMS call
        # from twilio.rest import Client
        # client = Client(account_sid, auth_token)
        # client.messages.create(body=..., to=manager_contact, from_=...)
        logger.info(
            "🔶 [PLACEHOLDER] Would send SMS to %s: Escalation for review %s",
            manager_contact, review_id,
        )
    else:
        logger.info(
            "🔶 [MOCK] SMS notification skipped (no API key)."
        )
