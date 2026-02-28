"""Firestore document model for escalations."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


class EscalationModel:
    """Represents an escalation document in Firestore."""

    def __init__(
        self,
        review_id: str = "",
        branch_id: str = "",
        risk_score: int = 0,
        assigned_to: str = "",
        status: str = "Open",
        resolution_notes: str | None = None,
        created_at: datetime | None = None,
        resolved_at: datetime | None = None,
    ):
        self.review_id = review_id
        self.branch_id = branch_id
        self.risk_score = risk_score
        self.assigned_to = assigned_to
        self.status = status
        self.resolution_notes = resolution_notes
        self.created_at = created_at or datetime.now(timezone.utc)
        self.resolved_at = resolved_at

    def to_dict(self) -> dict[str, Any]:
        """Serialize to a Firestore-friendly dict."""
        return {
            "review_id": self.review_id,
            "branch_id": self.branch_id,
            "risk_score": self.risk_score,
            "assigned_to": self.assigned_to,
            "status": self.status,
            "resolution_notes": self.resolution_notes,
            "created_at": self.created_at,
            "resolved_at": self.resolved_at,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> EscalationModel:
        """Deserialize from a Firestore document dict."""
        return cls(
            review_id=data.get("review_id", ""),
            branch_id=data.get("branch_id", ""),
            risk_score=data.get("risk_score", 0),
            assigned_to=data.get("assigned_to", ""),
            status=data.get("status", "Open"),
            resolution_notes=data.get("resolution_notes"),
            created_at=data.get("created_at"),
            resolved_at=data.get("resolved_at"),
        )
