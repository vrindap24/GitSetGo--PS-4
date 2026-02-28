"""Sentiment helper utilities."""

from __future__ import annotations


def sentiment_label_from_score(score: float) -> str:
    """Map a sentiment score (-1 to +1) to a label.

    Args:
        score: Float between -1.0 and 1.0.

    Returns:
        One of 'Positive', 'Neutral', or 'Negative'.
    """
    if score >= 0.25:
        return "Positive"
    elif score <= -0.25:
        return "Negative"
    return "Neutral"


def urgency_from_risk(risk_score: int) -> str:
    """Derive urgency level from a risk score (0–100).

    Args:
        risk_score: Integer between 0 and 100.

    Returns:
        One of 'Low', 'Medium', or 'High'.
    """
    if risk_score >= 70:
        return "High"
    elif risk_score >= 40:
        return "Medium"
    return "Low"
