"""Firestore document model for reviews."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


class AIAnalysis:
    """Nested AI analysis result stored inside a review document."""

    def __init__(
        self,
        sentiment_label: str = "Neutral",
        sentiment_score: float = 0.0,
        categories: list[str] | None = None,
        risk_score: int = 0,
        urgency_level: str = "Low",
        detected_intent: str = "",
        emotional_intensity: float = 0.0,
        response_suggestion: str = "",
        escalation_required: bool = False,
        # Agent-produced fields
        detected_intents: dict[str, bool] | None = None,
        staff_mentioned: str | None = None,
        polite_reply: str = "",
        brand_tone_reply: str = "",
        apology_compensation_reply: str = "",
        escalation_triggers: list[str] | None = None,
        escalation_priority: str = "None",
    ):
        self.sentiment_label = sentiment_label
        self.sentiment_score = sentiment_score
        self.categories = categories or []
        self.risk_score = risk_score
        self.urgency_level = urgency_level
        self.detected_intent = detected_intent
        self.emotional_intensity = emotional_intensity
        self.response_suggestion = response_suggestion
        self.escalation_required = escalation_required
        self.detected_intents = detected_intents or {}
        self.staff_mentioned = staff_mentioned
        self.polite_reply = polite_reply
        self.brand_tone_reply = brand_tone_reply
        self.apology_compensation_reply = apology_compensation_reply
        self.escalation_triggers = escalation_triggers or []
        self.escalation_priority = escalation_priority

    def to_dict(self) -> dict[str, Any]:
        return {
            "sentiment_label": self.sentiment_label,
            "sentiment_score": self.sentiment_score,
            "categories": self.categories,
            "risk_score": self.risk_score,
            "urgency_level": self.urgency_level,
            "detected_intent": self.detected_intent,
            "emotional_intensity": self.emotional_intensity,
            "response_suggestion": self.response_suggestion,
            "escalation_required": self.escalation_required,
            "detected_intents": self.detected_intents,
            "staff_mentioned": self.staff_mentioned,
            "polite_reply": self.polite_reply,
            "brand_tone_reply": self.brand_tone_reply,
            "apology_compensation_reply": self.apology_compensation_reply,
            "escalation_triggers": self.escalation_triggers,
            "escalation_priority": self.escalation_priority,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> AIAnalysis:
        return cls(**{k: v for k, v in data.items() if k in cls.__init__.__code__.co_varnames})


class ReviewModel:
    """Represents a review document in Firestore."""

    def __init__(
        self,
        platform: str = "Internal",
        branch_id: str = "",
        rating: int = 5,
        review_text: str = "",
        reviewer_name: str | None = None,
        staff_tagged: str | None = None,
        categories: list[str] | None = None,
        timestamp: datetime | None = None,
        processed: bool = False,
        ai_analysis: dict[str, Any] | None = None,
        escalation_id: str | None = None,
    ):
        self.platform = platform
        self.branch_id = branch_id
        self.rating = rating
        self.review_text = review_text
        self.reviewer_name = reviewer_name
        self.staff_tagged = staff_tagged
        self.categories = categories or []
        self.timestamp = timestamp or datetime.now(timezone.utc)
        self.processed = processed
        self.ai_analysis = ai_analysis
        self.escalation_id = escalation_id

    def to_dict(self) -> dict[str, Any]:
        """Serialize to a Firestore-friendly dict."""
        return {
            "platform": self.platform,
            "branch_id": self.branch_id,
            "rating": self.rating,
            "review_text": self.review_text,
            "reviewer_name": self.reviewer_name,
            "staff_tagged": self.staff_tagged,
            "categories": self.categories,
            "timestamp": self.timestamp,
            "processed": self.processed,
            "ai_analysis": self.ai_analysis,
            "escalation_id": self.escalation_id,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> ReviewModel:
        """Deserialize from a Firestore document dict."""
        return cls(
            platform=data.get("platform", "Internal"),
            branch_id=data.get("branch_id", ""),
            rating=data.get("rating", 5),
            review_text=data.get("review_text", ""),
            reviewer_name=data.get("reviewer_name"),
            staff_tagged=data.get("staff_tagged"),
            categories=data.get("categories", []),
            timestamp=data.get("timestamp"),
            processed=data.get("processed", False),
            ai_analysis=data.get("ai_analysis"),
            escalation_id=data.get("escalation_id"),
        )
