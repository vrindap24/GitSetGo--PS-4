"""Escalation service – create and manage escalation documents."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from app.firebase import get_db
from app.models.escalation_model import EscalationModel

logger = logging.getLogger(__name__)

COLLECTION = "escalations"


def create_escalation(
    review_id: str,
    branch_id: str,
    risk_score: int,
    assigned_to: str = "",
) -> str:
    """Create a new escalation document in Firestore.

    Args:
        review_id: The review that triggered escalation.
        branch_id: Branch the review belongs to.
        risk_score: Calculated risk score.
        assigned_to: Person/role to assign (optional).

    Returns:
        The new escalation document ID.
    """
    db = get_db()

    model = EscalationModel(
        review_id=review_id,
        branch_id=branch_id,
        risk_score=risk_score,
        assigned_to=assigned_to,
        status="Open",
    )

    doc_ref = db.collection(COLLECTION).add(model.to_dict())
    escalation_id = doc_ref[1].id
    logger.info("Escalation created: %s for review %s", escalation_id, review_id)
    return escalation_id


def get_escalations(branch_id: str | None = None) -> list[dict[str, Any]]:
    """Retrieve escalations, optionally filtered by branch.

    Args:
        branch_id: If provided, filter by this branch.

    Returns:
        List of escalation dicts with document IDs.
    """
    db = get_db()
    query = db.collection(COLLECTION)

    if branch_id:
        query = query.where("branch_id", "==", branch_id)

    results = []
    for doc in query.stream():
        data = doc.to_dict()
        data["id"] = doc.id
        results.append(data)

    return results


def update_escalation(
    escalation_id: str,
    status: str | None = None,
    resolution_notes: str | None = None,
) -> dict[str, Any]:
    """Update an escalation's status and/or resolution notes.

    Args:
        escalation_id: Document ID of the escalation.
        status: New status ('Open', 'In Progress', 'Closed').
        resolution_notes: Optional notes about resolution.

    Returns:
        Updated escalation data.

    Raises:
        ValueError: If the escalation document is not found.
    """
    db = get_db()
    doc_ref = db.collection(COLLECTION).document(escalation_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise ValueError(f"Escalation {escalation_id} not found")

    updates: dict[str, Any] = {}
    if status is not None:
        updates["status"] = status
    if resolution_notes is not None:
        updates["resolution_notes"] = resolution_notes
    if status == "Closed":
        updates["resolved_at"] = datetime.now(timezone.utc)

    doc_ref.update(updates)
    logger.info("Escalation %s updated: %s", escalation_id, updates)

    updated = doc_ref.get().to_dict()
    updated["id"] = escalation_id
    return updated
