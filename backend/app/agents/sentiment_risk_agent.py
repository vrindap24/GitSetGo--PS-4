"""Sentiment & Risk Agent – Classify sentiment and detect risk signals.

Responsibilities:
- Sentiment classification: Positive / Neutral / Negative
- Sentiment score: -1.0 to +1.0
- Detect intents: refund, legal threat, viral risk, repeat complaint
- Risk score calculation (delegates to risk_scoring utility)
"""

from __future__ import annotations

import logging
from typing import Any

from app.services.ai_service import call_gemini_json
from app.utils.risk_scoring import calculate_risk_score

logger = logging.getLogger(__name__)

_SENTIMENT_RISK_PROMPT = """You are a sentiment and risk analysis expert for a restaurant/hospitality business.

Analyze the following review and return a JSON object with EXACTLY these fields:

{{
  "sentiment_label": "Positive" | "Neutral" | "Negative",
  "sentiment_score": <float between -1.0 and 1.0>,
  "detected_intents": {{
    "refund_intent": <boolean>,
    "legal_threat": <boolean>,
    "viral_risk": <boolean>,
    "repeat_complaint": <boolean>
  }},
  "detected_intent_summary": "<one-line summary of the customer's main intent>"
}}

Review Rating: {rating}/5
Review Text: "{review_text}"

RULES:
- Return ONLY valid JSON. No markdown, no explanation.
- sentiment_score: -1.0 = extremely negative, 0.0 = neutral, +1.0 = extremely positive.
- refund_intent: true if customer hints at wanting money back or compensation.
- legal_threat: true if customer mentions lawyers, suing, legal action, consumer forum.
- viral_risk: true if customer threatens to post on social media, "going viral", or mentions influencer reach.
- repeat_complaint: true if customer says "again", "every time", "always happens", indicating a recurring issue.
"""


async def analyze_sentiment_and_risk(
    review_text: str,
    rating: int,
    emotional_intensity: float,
) -> dict[str, Any]:
    """Run sentiment analysis and risk scoring on a review.

    Args:
        review_text: The raw review text.
        rating: Star rating (1–5).
        emotional_intensity: From the categorization agent (0–5).

    Returns:
        Dict with sentiment_label, sentiment_score, risk_score,
        detected_intents, detected_intent_summary.
    """
    prompt = _SENTIMENT_RISK_PROMPT.format(review_text=review_text, rating=rating)
    result = await call_gemini_json(prompt)

    if not result:
        logger.warning("Sentiment & Risk agent returned empty – using defaults.")
        result = _default_sentiment()

    # Calculate risk score using the utility
    risk_score = calculate_risk_score(rating, emotional_intensity, review_text)

    output = {
        "sentiment_label": result.get("sentiment_label", "Neutral"),
        "sentiment_score": float(result.get("sentiment_score", 0.0)),
        "risk_score": risk_score,
        "detected_intents": result.get("detected_intents", {
            "refund_intent": False,
            "legal_threat": False,
            "viral_risk": False,
            "repeat_complaint": False,
        }),
        "detected_intent_summary": result.get("detected_intent_summary", ""),
    }

    logger.info(
        "Sentiment & Risk complete: sentiment=%s, risk=%d",
        output["sentiment_label"],
        risk_score,
    )
    return output


def _default_sentiment() -> dict[str, Any]:
    """Fallback defaults when AI fails."""
    return {
        "sentiment_label": "Neutral",
        "sentiment_score": 0.0,
        "detected_intents": {
            "refund_intent": False,
            "legal_threat": False,
            "viral_risk": False,
            "repeat_complaint": False,
        },
        "detected_intent_summary": "Unable to analyze",
    }
