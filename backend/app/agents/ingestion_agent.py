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
        "review_text": "Amazing food at Prasad Food Divine! The butter chicken was outstanding. Will definitely come back to this branch.",
        "timestamp": "2024-01-15T10:30:00Z",
    },
    {
        "reviewer_name": "Rahul Mehta",
        "rating": 2,
        "review_text": "Very slow service at Prasad Food Divine today. We waited 45 minutes for our order. The food was cold when it arrived.",
        "timestamp": "2024-01-16T19:00:00Z",
    },
    {
        "reviewer_name": "Ananya Patel",
        "rating": 4,
        "review_text": "Good ambience and tasty food at Prasad Food Divine Kalyan. Staff was friendly, especially Rahul who was very attentive.",
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
    """Pull reviews from Google Places API (New).

    Fetches real public reviews left by customers on Google Maps.
    Falls back to mock data when GOOGLE_PLACES_API_KEY is not configured.

    Args:
        branch_id: Branch to associate the reviews with.

    Returns:
        List of normalized review dicts.
    """
    from app.config import get_settings
    from app.services.google_places_service import fetch_place_reviews, transform_places_review

    settings = get_settings()

    # ── Real API path ────────────────────────────────────────────────────
    if settings.google_places_api_key and settings.google_place_ids:
        logger.info("🌐 Fetching REAL Google reviews for branch %s", branch_id)

        # Parse place_id:branch_id pairs, find the one for this branch
        place_id = None
        for pair in settings.google_place_ids.split(","):
            pair = pair.strip()
            if ":" in pair:
                pid, bid = pair.split(":", 1)
                if bid.strip() == branch_id:
                    place_id = pid.strip()
                    break
            else:
                # If no branch mapping, use first place_id for all branches
                place_id = pair.strip()
                break

        if place_id:
            raw_reviews = await fetch_place_reviews(
                settings.google_places_api_key, place_id
            )
            if raw_reviews:
                results = []
                for r in raw_reviews:
                    transformed = transform_places_review(r, branch_id)
                    results.append(normalize_review(transformed, "Google", branch_id))
                return results
            else:
                logger.warning("⚠️ No reviews returned from Places API, falling back to mock data")
        else:
            logger.warning("⚠️ No place_id mapped for branch %s, falling back to mock data", branch_id)

    # ── Mock fallback ────────────────────────────────────────────────────
    logger.info("🔶 [MOCK] Ingesting Google Reviews for branch %s", branch_id)
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
