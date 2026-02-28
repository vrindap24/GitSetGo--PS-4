"""Staff API routes."""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Query

from app.firebase import get_db
from app.models.staff_model import StaffModel
from app.schemas.staff_schema import StaffCreate, StaffResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/staff", response_model=StaffResponse, status_code=201)
async def create_staff(staff: StaffCreate):
    """Add a new staff member."""
    db = get_db()

    model = StaffModel(
        branch_id=staff.branch_id,
        staff_name=staff.staff_name,
        role=staff.role,
        active_status=staff.active_status,
    )

    _, doc_ref = db.collection("staff").add(model.to_dict())
    staff_id = doc_ref.id
    logger.info("Staff created: %s", staff_id)

    return StaffResponse(
        id=staff_id,
        branch_id=staff.branch_id,
        staff_name=staff.staff_name,
        role=staff.role,
        active_status=staff.active_status,
        created_at=model.created_at,
    )


@router.get("/staff", response_model=list[StaffResponse])
async def list_staff(
    branch_id: Optional[str] = Query(None, description="Filter by branch"),
):
    """List staff members, optionally filtered by branch."""
    db = get_db()
    query = db.collection("staff")

    if branch_id:
        query = query.where("branch_id", "==", branch_id)

    results: list[StaffResponse] = []
    for doc in query.stream():
        data = doc.to_dict()
        results.append(StaffResponse(id=doc.id, **data))

    return results
