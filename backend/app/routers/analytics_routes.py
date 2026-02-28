"""Analytics & Escalation API routes."""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.services import analytics_service, escalation_service

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Schemas for analytics responses (local to this router)
# ---------------------------------------------------------------------------
class BranchOverview(BaseModel):
    branch_id: str
    avg_rating: float
    total_reviews: int
    negative_percentage: float
    sentiment_distribution: dict[str, int]
    category_distribution: dict[str, int]


class BranchComparison(BaseModel):
    branch_id: str
    branch_name: str
    avg_rating: float
    total_reviews: int


class StaffPerformance(BaseModel):
    staff_id: str
    staff_name: str
    avg_rating: float
    total_tagged_reviews: int


class NetworkMapBranch(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    purityScore: int
    status: str


class MenuDish(BaseModel):
    name: str
    score: int
    mentions: int
    type: str
    trend: str


class EscalationUpdate(BaseModel):
    status: Optional[str] = None
    resolution_notes: Optional[str] = None


# ---------------------------------------------------------------------------
# Analytics endpoints
# ---------------------------------------------------------------------------
@router.get("/analytics/branch-overview", response_model=BranchOverview)
async def branch_overview(
    branch_id: str = Query(..., description="Branch ID to get overview for"),
):
    """Get analytics overview for a single branch."""
    return analytics_service.get_branch_overview(branch_id)


@router.get("/analytics/branch-comparison", response_model=list[BranchComparison])
async def branch_comparison():
    """Compare key metrics across all branches."""
    return analytics_service.get_branch_comparison()


@router.get("/analytics/staff-performance", response_model=list[StaffPerformance])
async def staff_performance(
    branch_id: str = Query(..., description="Branch ID"),
):
    """Get staff performance metrics for a branch."""
    return analytics_service.get_staff_performance(branch_id)


@router.get("/analytics/network-map", response_model=list[NetworkMapBranch])
async def network_map():
    """Get branch health data for global map visualization."""
    return analytics_service.get_network_map()


@router.get("/analytics/sentiment-categories")
async def sentiment_categories():
    """Get breakdown of sentiment per category."""
    return analytics_service.get_sentiment_categories()


@router.get("/analytics/menu-intelligence", response_model=list[MenuDish])
async def menu_intelligence():
    """Get dish-level sentiment analysis (Hero/Zero dishes)."""
    return analytics_service.get_menu_intelligence()


# ---------------------------------------------------------------------------
# Escalation endpoints
# ---------------------------------------------------------------------------
@router.get("/escalations")
async def list_escalations(
    branch_id: Optional[str] = Query(None, description="Filter by branch"),
):
    """List escalations, optionally filtered by branch."""
    return escalation_service.get_escalations(branch_id)


@router.patch("/escalations/{escalation_id}")
async def update_escalation(escalation_id: str, body: EscalationUpdate):
    """Update an escalation's status and/or resolution notes."""
    try:
        return escalation_service.update_escalation(
            escalation_id=escalation_id,
            status=body.status,
            resolution_notes=body.resolution_notes,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
