"""Response Agent – Generate multiple reply variants using Gemini AI.

Responsibilities:
- Polite reply
- Brand-tone reply
- Apology + compensation reply (when needed)
"""

from __future__ import annotations

import logging
from typing import Any

from app.services.ai_service import call_gemini_json

logger = logging.getLogger(__name__)

_RESPONSE_PROMPT = """You are a professional customer response writer for a restaurant/hospitality brand.

Generate 3 different reply variants for the following customer review.

Review Rating: {rating}/5
Sentiment: {sentiment_label}
Categories: {categories}
Review Text: "{review_text}"

Return a JSON object with EXACTLY these fields:

{{
  "polite_reply": "<a warm, professional, and polite response>",
  "brand_tone_reply": "<a response matching a trendy, modern restaurant brand voice — friendly, slightly casual, confident>",
  "apology_compensation_reply": "<a sincere apology with a concrete compensation offer like a complimentary meal, discount, or callback from manager>"
}}

RULES:
- Return ONLY valid JSON. No markdown, no explanation.
- All replies should address the specific issues mentioned in the review.
- polite_reply: formal, courteous, thanking the customer.
- brand_tone_reply: match the brand voice — warm but confident, use "we" language.
- apology_compensation_reply: only provide real compensation offers if sentiment is Negative or rating <= 2. Otherwise, still include a gracious response but skip the heavy compensation language.
- Keep each reply under 100 words.
"""


async def generate_responses(
    review_text: str,
    rating: int,
    sentiment_label: str,
    categories: list[str],
) -> dict[str, str]:
    """Generate 3 reply variants for a review.

    Args:
        review_text: The raw review text.
        rating: Star rating (1–5).
        sentiment_label: From sentiment agent ('Positive', 'Neutral', 'Negative').
        categories: From categorization agent.

    Returns:
        Dict with polite_reply, brand_tone_reply, apology_compensation_reply.
    """
    prompt = _RESPONSE_PROMPT.format(
        review_text=review_text,
        rating=rating,
        sentiment_label=sentiment_label,
        categories=", ".join(categories) if categories else "General",
    )
    result = await call_gemini_json(prompt)

    if not result:
        logger.warning("Response agent returned empty – using defaults.")
        return _default_responses()

    logger.info("Response agent generated 3 reply variants.")
    return {
        "polite_reply": result.get("polite_reply", _default_responses()["polite_reply"]),
        "brand_tone_reply": result.get("brand_tone_reply", _default_responses()["brand_tone_reply"]),
        "apology_compensation_reply": result.get("apology_compensation_reply", _default_responses()["apology_compensation_reply"]),
    }


def _default_responses() -> dict[str, str]:
    """Fallback responses when AI fails."""
    return {
        "polite_reply": "Thank you for your valuable feedback. We truly appreciate you taking the time to share your experience with us.",
        "brand_tone_reply": "Hey, thanks for sharing your thoughts with us! We're always working to give you the best experience possible.",
        "apology_compensation_reply": "We sincerely apologize for your experience. We'd love to make it right — please reach out to our manager for a complimentary visit.",
    }
