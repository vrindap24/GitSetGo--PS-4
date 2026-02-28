"""Insight API routes – AI-generated trend reports."""

from __future__ import annotations

import logging
from typing import Any, Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel

from app.agents.insight_agent import generate_branch_insights, generate_staff_insights

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------
class BranchInsightResponse(BaseModel):
    branch_id: str
    period_days: int
    summary: str
    insights: list[str] = []
    alerts: list[str] = []
    recommendations: list[str] = []


class StaffInsightResponse(BaseModel):
    branch_id: str
    period_days: int
    staff_insights: list[str] = []
    raw_data: Optional[dict[str, Any]] = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@router.get("/insights/branch", response_model=BranchInsightResponse)
async def branch_insights(
    branch_id: str = Query(..., description="Branch ID"),
    days: int = Query(7, ge=1, le=90, description="Look-back period in days"),
):
    """Get AI-generated insights for a branch.

    Returns natural-language trend analysis, alerts, and recommendations
    powered by the Insight Agent.
    """
    result = await generate_branch_insights(branch_id, days)
    return result


@router.get("/insights/staff", response_model=StaffInsightResponse)
async def staff_insights(
    branch_id: str = Query(..., description="Branch ID"),
    days: int = Query(7, ge=1, le=90, description="Look-back period in days"),
):
    """Get AI-generated staff performance insights for a branch."""
    result = await generate_staff_insights(branch_id, days)
    return result
