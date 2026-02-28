"""Firestore document model for branches."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


class BranchModel:
    """Represents a branch document in Firestore."""

    def __init__(
        self,
        branch_name: str = "",
        location: str = "",
        manager_name: str = "",
        manager_contact: str = "",
        created_at: datetime | None = None,
    ):
        self.branch_name = branch_name
        self.location = location
        self.manager_name = manager_name
        self.manager_contact = manager_contact
        self.created_at = created_at or datetime.now(timezone.utc)

    def to_dict(self) -> dict[str, Any]:
        """Serialize to a Firestore-friendly dict."""
        return {
            "branch_name": self.branch_name,
            "location": self.location,
            "manager_name": self.manager_name,
            "manager_contact": self.manager_contact,
            "created_at": self.created_at,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> BranchModel:
        """Deserialize from a Firestore document dict."""
        return cls(
            branch_name=data.get("branch_name", ""),
            location=data.get("location", ""),
            manager_name=data.get("manager_name", ""),
            manager_contact=data.get("manager_contact", ""),
            created_at=data.get("created_at"),
        )
