"""Pydantic schemas for staff request / response validation."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class StaffCreate(BaseModel):
    """Schema for creating a new staff member."""

    branch_id: str = Field(..., min_length=1, description="Branch document ID")
    staff_name: str = Field(..., min_length=1, description="Staff member name")
    role: str = Field(..., min_length=1, description="Staff role / designation")
    active_status: bool = Field(True, description="Whether staff is currently active")


class StaffResponse(BaseModel):
    """Schema for returning a staff member."""

    id: str
    branch_id: str
    staff_name: str
    role: str
    active_status: bool
    credits: int = 0
    positive_mentions_count: int = 0
    current_rank: int = 0
    created_at: Optional[datetime] = None
