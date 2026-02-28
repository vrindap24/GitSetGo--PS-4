"""Pydantic schemas for branch request / response validation."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class BranchCreate(BaseModel):
    """Schema for creating a new branch."""

    branch_name: str = Field(..., min_length=1, description="Name of the branch")
    location: str = Field(..., min_length=1, description="Branch location / address")
    manager_name: str = Field(..., min_length=1, description="Branch manager name")
    manager_contact: str = Field(..., min_length=1, description="Manager phone or email")
    lat: float = Field(0.0, description="Latitude")
    lng: float = Field(0.0, description="Longitude")


class BranchResponse(BaseModel):
    """Schema for returning a branch."""

    id: str
    branch_name: str
    location: str
    manager_name: str
    manager_contact: str
    lat: float
    lng: float
    created_at: Optional[datetime] = None
