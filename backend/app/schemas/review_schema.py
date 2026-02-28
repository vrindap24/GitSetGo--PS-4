"""Pydantic schemas for review request / response validation."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------
class Platform(str, Enum):
    INTERNAL = "Internal"
    GOOGLE = "Google"
    ZOMATO = "Zomato"


class SentimentLabel(str, Enum):
    POSITIVE = "Positive"
    NEUTRAL = "Neutral"
    NEGATIVE = "Negative"


class UrgencyLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


# ---------------------------------------------------------------------------
# Nested schemas
# ---------------------------------------------------------------------------
class DetectedIntents(BaseModel):
    """Intent signals detected by the Sentiment & Risk Agent."""

    refund_intent: bool = False
    legal_threat: bool = False
    viral_risk: bool = False
    repeat_complaint: bool = False


class AIAnalysisResponse(BaseModel):
    """AI analysis result embedded in a review."""

    sentiment_label: SentimentLabel = SentimentLabel.NEUTRAL
    sentiment_score: float = Field(0.0, ge=-1.0, le=1.0)
    categories: list[str] = []
    risk_score: int = Field(0, ge=0, le=100)
    urgency_level: UrgencyLevel = UrgencyLevel.LOW
    detected_intent: str = ""
    emotional_intensity: float = Field(0.0, ge=0.0, le=5.0)
    response_suggestion: str = ""
    escalation_required: bool = False
    # Agent-produced fields
    detected_intents: Optional[DetectedIntents] = None
    staff_mentioned: Optional[str] = None
    polite_reply: str = ""
    brand_tone_reply: str = ""
    apology_compensation_reply: str = ""
    escalation_triggers: list[str] = []
    escalation_priority: str = "None"


# ---------------------------------------------------------------------------
# Request / Response
# ---------------------------------------------------------------------------
class ReviewCreate(BaseModel):
    """Schema for creating a new review."""

    platform: Platform = Platform.INTERNAL
    branch_id: str = Field(..., min_length=1, description="Branch document ID")
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    review_text: str = Field(
        ..., min_length=3, max_length=1000, description="Review content (3-1000 chars)"
    )
    reviewer_name: Optional[str] = Field(None, max_length=100)
    staff_tagged: Optional[str] = Field(None, min_length=1)

    model_config = {"json_schema_extra": {
        "examples": [
            {
                "platform": "Internal",
                "branch_id": "branch_001",
                "rating": 4,
                "review_text": "Great food and friendly staff!",
                "reviewer_name": "John Doe",
                "staff_tagged": "staff_042",
            }
        ]
    }}


class ReviewResponse(BaseModel):
    """Schema for returning a review."""

    id: str
    platform: Platform
    branch_id: str
    rating: int
    review_text: str
    reviewer_name: Optional[str] = None
    staff_tagged: Optional[str] = None
    timestamp: Optional[datetime] = None
    processed: bool = False
    ai_analysis: Optional[AIAnalysisResponse] = None
    escalation_id: Optional[str] = None
