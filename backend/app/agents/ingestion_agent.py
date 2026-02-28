"""Ingestion Agent – Pull reviews from external platforms.

🔶 PLACEHOLDER: Google Reviews and Zomato connectors return MOCK DATA.
Replace with real API calls for production.

Internal submissions go through POST /reviews directly.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Mock data for hackathon demo
# ---------------------------------------------------------------------------
_MOCK_GOOGLE_REVIEWS: list[dict[str, Any]] = [
    {
        "reviewer_name": "Priya Sharma",
        "rating": 5,
        "review_text": "Amazing food and excellent service! The butter chicken was outstanding. Will definitely come back.",
        "timestamp": "2024-01-15T10:30:00Z",
    },
    {
        "reviewer_name": "Rahul Mehta",
        "rating": 2,
        "review_text": "Very slow service. We waited 45 minutes for our order. The food was cold when it arrived. Terrible experience.",
        "timestamp": "2024-01-16T19:00:00Z",
    },
    {
        "reviewer_name": "Ananya Patel",
        "rating": 4,
        "review_text": "Good ambience and tasty food. Staff was friendly, especially Rahul who was very attentive. Slightly overpriced though.",
        "timestamp": "2024-01-17T13:15:00Z",
    },
]

_MOCK_ZOMATO_REVIEWS: list[dict[str, Any]] = [
    {
        "reviewer_name": "FoodieExplorer",
        "rating": 1,
        "review_text": "Found a hair in my biryani. Disgusting! The manager didn't even apologize properly. Never again!",
        "timestamp": "2024-01-14T20:45:00Z",
    },
    {
        "reviewer_name": "TasteHunter",
        "rating": 3,
        "review_text": "Average food quality. Nothing special but not bad either. Cleanliness could be improved.",
        "timestamp": "2024-01-18T12:00:00Z",
    },
    {
        "reviewer_name": "MumbaiGourmet",
        "rating": 5,
        "review_text": "Best paneer tikka in the area! Staff behavior was exceptional. Loved the ambience too. Highly recommended!",
        "timestamp": "2024-01-19T18:30:00Z",
    },
]


def normalize_review(
    raw: dict[str, Any],
    platform: str,
    branch_id: str,
) -> dict[str, Any]:
    """Normalize a raw review from any platform into our standard schema.

    Args:
        raw: Raw review dict from the platform.
        platform: 'Google' | 'Zomato' | 'Internal'.
        branch_id: Target branch document ID.

    Returns:
        Normalized review dict ready for Firestore.
    """
    return {
        "platform": platform,
        "branch_id": branch_id,
        "rating": raw.get("rating", 3),
        "review_text": raw.get("review_text", ""),
        "reviewer_name": raw.get("reviewer_name"),
        "staff_tagged": None,
        "timestamp": datetime.now(timezone.utc),
        "processed": False,
        "ai_analysis": None,
        "escalation_id": None,
    }


async def ingest_from_google(branch_id: str) -> list[dict[str, Any]]:
    """Pull reviews from Google Reviews API.

    🔶 PLACEHOLDER – Returns mock data for hackathon.
    Replace with real Google Business Profile API integration.

    Args:
        branch_id: Branch to associate the reviews with.

    Returns:
        List of normalized review dicts.
    """
    logger.info("🔶 [MOCK] Ingesting Google Reviews for branch %s", branch_id)

    # TODO: Replace with real Google Business Profile API call
    # from google.oauth2 import service_account
    # credentials = service_account.Credentials.from_service_account_file(...)
    # response = requests.get(f"https://mybusiness.googleapis.com/v4/accounts/{account_id}/locations/{location_id}/reviews")

    return [
        normalize_review(r, "Google", branch_id) for r in _MOCK_GOOGLE_REVIEWS
    ]


async def ingest_from_zomato(branch_id: str) -> list[dict[str, Any]]:
    """Pull reviews from Zomato.

    🔶 PLACEHOLDER – Returns mock data for hackathon.
    Replace with real Zomato scraping logic or API.

    Args:
        branch_id: Branch to associate the reviews with.

    Returns:
        List of normalized review dicts.
    """
    logger.info("🔶 [MOCK] Ingesting Zomato Reviews for branch %s", branch_id)

    # TODO: Replace with real Zomato scraping/API
    # import httpx
    # async with httpx.AsyncClient() as client:
    #     response = await client.get(f"https://www.zomato.com/...")

    return [
        normalize_review(r, "Zomato", branch_id) for r in _MOCK_ZOMATO_REVIEWS
    ]
