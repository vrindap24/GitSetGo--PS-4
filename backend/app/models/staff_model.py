"""Firestore document model for staff members."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


class StaffModel:
    """Represents a staff document in Firestore."""

    def __init__(
        self,
        branch_id: str = "",
        staff_name: str = "",
        role: str = "",
        active_status: bool = True,
        created_at: datetime | None = None,
    ):
        self.branch_id = branch_id
        self.staff_name = staff_name
        self.role = role
        self.active_status = active_status
        self.created_at = created_at or datetime.now(timezone.utc)

    def to_dict(self) -> dict[str, Any]:
        """Serialize to a Firestore-friendly dict."""
        return {
            "branch_id": self.branch_id,
            "staff_name": self.staff_name,
            "role": self.role,
            "active_status": self.active_status,
            "created_at": self.created_at,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> StaffModel:
        """Deserialize from a Firestore document dict."""
        return cls(
            branch_id=data.get("branch_id", ""),
            staff_name=data.get("staff_name", ""),
            role=data.get("role", ""),
            active_status=data.get("active_status", True),
            created_at=data.get("created_at"),
        )
