"""Branch API routes."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from app.firebase import get_db
from app.models.branch_model import BranchModel
from app.schemas.branch_schema import BranchCreate, BranchResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/branches", response_model=BranchResponse, status_code=201)
async def create_branch(branch: BranchCreate):
    """Create a new branch."""
    db = get_db()

    model = BranchModel(
        branch_name=branch.branch_name,
        location=branch.location,
        manager_name=branch.manager_name,
        manager_contact=branch.manager_contact,
    )

    _, doc_ref = db.collection("branches").add(model.to_dict())
    branch_id = doc_ref.id
    logger.info("Branch created: %s", branch_id)

    return BranchResponse(
        id=branch_id,
        branch_name=branch.branch_name,
        location=branch.location,
        manager_name=branch.manager_name,
        manager_contact=branch.manager_contact,
        created_at=model.created_at,
    )


@router.get("/branches", response_model=list[BranchResponse])
async def list_branches():
    """List all branches."""
    db = get_db()
    results: list[BranchResponse] = []

    for doc in db.collection("branches").stream():
        data = doc.to_dict()
        results.append(BranchResponse(id=doc.id, **data))

    return results


@router.get("/branches/{branch_id}", response_model=BranchResponse)
async def get_branch(branch_id: str):
    """Get a single branch by ID."""
    db = get_db()
    doc = db.collection("branches").document(branch_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Branch not found")

    data = doc.to_dict()
    return BranchResponse(id=doc.id, **data)
