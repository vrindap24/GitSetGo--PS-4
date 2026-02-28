"""Risk scoring logic for reviews.

Base formula:
    risk_score = (5 - rating) * 15 + emotional_intensity * 10 + negative_keyword_weight
    Capped at 100.
"""

from __future__ import annotations

# Negative keywords and their weights
NEGATIVE_KEYWORDS: dict[str, int] = {
    "terrible": 15,
    "horrible": 15,
    "disgusting": 15,
    "worst": 15,
    "awful": 12,
    "unacceptable": 12,
    "rude": 10,
    "dirty": 10,
    "filthy": 10,
    "cold": 5,
    "slow": 5,
    "bad": 5,
    "poor": 5,
    "stale": 8,
    "rotten": 12,
    "overpriced": 7,
    "never again": 15,
    "food poisoning": 20,
    "sick": 10,
    "cockroach": 20,
    "insect": 15,
    "hair": 10,
}


def calculate_risk_score(
    rating: int,
    emotional_intensity: float,
    review_text: str,
) -> int:
    """Calculate a risk score for a review (0–100).

    Args:
        rating: Star rating (1–5).
        emotional_intensity: AI-detected emotional intensity (0–5).
        review_text: Raw review text for keyword analysis.

    Returns:
        Integer risk score capped at 100.
    """
    # Base rating component
    rating_component = (5 - rating) * 15

    # Emotional intensity component
    emotion_component = emotional_intensity * 10

    # Negative keyword component
    text_lower = review_text.lower()
    keyword_weight = sum(
        weight for keyword, weight in NEGATIVE_KEYWORDS.items() if keyword in text_lower
    )

    raw_score = rating_component + emotion_component + keyword_weight
    return min(int(raw_score), 100)
