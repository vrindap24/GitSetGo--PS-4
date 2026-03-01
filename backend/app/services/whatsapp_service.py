"""WhatsApp Cloud API integration for escalation notifications.

Uses Meta's WhatsApp Cloud API (free tier: 1,000 business-initiated messages/month).

Setup:
1. Go to https://developers.facebook.com → Create App → Business type
2. Add WhatsApp product → Get temporary access token
3. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in .env
4. Add recipient phone numbers in the WhatsApp sandbox

Env vars needed:
  WHATSAPP_ACCESS_TOKEN=your_access_token
  WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
"""

from __future__ import annotations

import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)

WHATSAPP_API_URL = "https://graph.facebook.com/v21.0"


async def send_whatsapp_alert(
    phone_number_id: str,
    access_token: str,
    to_phone: str,
    review_text: str,
    branch_name: str,
    rating: int,
    triggers: list[str],
    priority: str,
) -> dict[str, Any] | None:
    """Send a WhatsApp escalation alert to a branch manager.

    Args:
        phone_number_id: WhatsApp Business Phone Number ID from Meta.
        access_token: WhatsApp Cloud API access token.
        to_phone: Recipient phone number (with country code, e.g. '919876543210').
        review_text: The problematic review text.
        branch_name: Name of the branch.
        rating: Star rating of the review.
        triggers: List of escalation trigger reasons.
        priority: Escalation priority level.

    Returns:
        API response dict, or None if failed.
    """
    url = f"{WHATSAPP_API_URL}/{phone_number_id}/messages"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    # Format the alert message
    trigger_text = "\n".join(f"• {t}" for t in triggers)
    stars = "⭐" * rating + "☆" * (5 - rating)

    message_body = (
        f"🚨 *ESCALATION ALERT — {priority.upper()}*\n\n"
        f"📍 *Branch:* {branch_name}\n"
        f"⭐ *Rating:* {stars} ({rating}/5)\n\n"
        f"📝 *Review:*\n_{review_text[:300]}_\n\n"
        f"⚠️ *Triggers:*\n{trigger_text}\n\n"
        f"Please take immediate action. Reply 'ACK' to acknowledge."
    )

    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "text",
        "text": {"body": message_body},
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload, headers=headers)

            if response.status_code == 200:
                result = response.json()
                msg_id = result.get("messages", [{}])[0].get("id", "unknown")
                logger.info(
                    "✅ WhatsApp alert sent to %s (msg_id: %s) for branch %s",
                    to_phone, msg_id, branch_name,
                )
                return result
            else:
                logger.error(
                    "❌ WhatsApp API error %d: %s",
                    response.status_code, response.text,
                )
                return None
    except Exception as e:
        logger.error("❌ WhatsApp send failed: %s", e)
        return None


async def send_template_alert(
    phone_number_id: str,
    access_token: str,
    to_phone: str,
    template_name: str = "escalation_alert",
    language_code: str = "en",
    parameters: list[str] | None = None,
) -> dict[str, Any] | None:
    """Send a WhatsApp template message (for approved templates).

    Template messages can be sent outside the 24-hour window.
    You need to first create and get the template approved in Meta Business Suite.

    Args:
        phone_number_id: WhatsApp Business Phone Number ID.
        access_token: Cloud API access token.
        to_phone: Recipient phone number with country code.
        template_name: Approved template name.
        language_code: Template language code.
        parameters: Template body parameters.

    Returns:
        API response dict, or None if failed.
    """
    url = f"{WHATSAPP_API_URL}/{phone_number_id}/messages"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    components = []
    if parameters:
        components.append({
            "type": "body",
            "parameters": [
                {"type": "text", "text": p} for p in parameters
            ],
        })

    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "template",
        "template": {
            "name": template_name,
            "language": {"code": language_code},
            "components": components,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload, headers=headers)

            if response.status_code == 200:
                logger.info("✅ WhatsApp template '%s' sent to %s", template_name, to_phone)
                return response.json()
            else:
                logger.error("❌ WhatsApp template error: %s", response.text)
                return None
    except Exception as e:
        logger.error("❌ WhatsApp template send failed: %s", e)
        return None
