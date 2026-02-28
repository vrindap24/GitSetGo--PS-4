"""Categorization Agent – Tag reviews using Gemini AI.

Responsibilities:
- Categorize into: Food, Service, Staff Behavior, Cleanliness, Ambience, Pricing
- Extract staff name if mentioned
- Detect urgency level
- Score emotional intensity (0–5)
"""

from __future__ import annotations

import logging
from typing import Any

from app.services.ai_service import call_gemini_json

logger = logging.getLogger(__name__)

_CATEGORIZATION_PROMPT = """You are a review categorization expert for a restaurant/hospitality business.

Analyze the following review and return a JSON object with EXACTLY these fields:

{{
  "categories": [<list of applicable categories ONLY from: "Food", "Service", "Staff Behavior", "Cleanliness", "Ambience", "Pricing">],
  "staff_mentioned": "<name of staff member mentioned, or null if none>",
  "urgency_level": "Low" | "Medium" | "High",
  "emotional_intensity": <float between 0.0 and 5.0>
}}

Review Rating: {rating}/5
Review Text: "{review_text}"

RULES:
- Return ONLY valid JSON. No markdown, no explanation.
- categories: use ONLY the exact strings listed above. A review can have multiple categories.
- staff_mentioned: extract any human name that appears to be a staff member. Return null if none.
- urgency_level: High = immediate attention needed, Medium = should address soon, Low = routine.
- emotional_intensity: 0 = very calm and factual, 5 = extremely emotional/angry/ecstatic.
"""


async def categorize(review_text: str, rating: int) -> dict[str, Any]:
    """Categorize a review using Gemini AI.

    Args:
        review_text: The raw review text.
        rating: Star rating (1–5).

    Returns:
        Dict with categories, staff_mentioned, urgency_level, emotional_intensity.
    """
    prompt = _CATEGORIZATION_PROMPT.format(review_text=review_text, rating=rating)
    result = await call_gemini_json(prompt)

    if not result:
        logger.warning("Categorization agent returned empty result – using defaults.")
        return _default()

    logger.info("Categorization complete: categories=%s", result.get("categories", []))
    return {
        "categories": result.get("categories", []),
        "staff_mentioned": result.get("staff_mentioned"),
        "urgency_level": result.get("urgency_level", "Low"),
        "emotional_intensity": float(result.get("emotional_intensity", 0.0)),
    }


def _default() -> dict[str, Any]:
    """Fallback defaults when AI fails."""
    return {
        "categories": [],
        "staff_mentioned": None,
        "urgency_level": "Low",
        "emotional_intensity": 0.0,
    }
