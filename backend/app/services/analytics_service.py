"""Analytics service – aggregated metrics from Firestore."""

from __future__ import annotations

import logging
from collections import Counter, defaultdict
from typing import Any

from app.firebase import get_db

logger = logging.getLogger(__name__)


def get_branch_overview(branch_id: str) -> dict[str, Any]:
    """Calculate analytics overview for a single branch.

    Returns:
        Dict with avg_rating, total_reviews, negative_percentage,
        sentiment_distribution, and category_distribution.
    """
    db = get_db()
    reviews = (
        db.collection("reviews")
        .where("branch_id", "==", branch_id)
        .stream()
    )

    total = 0
    rating_sum = 0
    sentiment_counts: Counter[str] = Counter()
    category_counts: Counter[str] = Counter()

    for doc in reviews:
        data = doc.to_dict()
        total += 1
        rating_sum += data.get("rating", 0)

        ai = data.get("ai_analysis")
        if ai:
            label = ai.get("sentiment_label", "Neutral")
            sentiment_counts[label] += 1
            for cat in ai.get("categories", []):
                category_counts[cat] += 1

    avg_rating = round(rating_sum / total, 2) if total else 0.0
    negative_pct = (
        round(sentiment_counts.get("Negative", 0) / total * 100, 1) if total else 0.0
    )

    return {
        "branch_id": branch_id,
        "avg_rating": avg_rating,
        "total_reviews": total,
        "negative_percentage": negative_pct,
        "sentiment_distribution": dict(sentiment_counts),
        "category_distribution": dict(category_counts),
    }


def get_branch_comparison() -> list[dict[str, Any]]:
    """Compare key metrics across all branches.

    Returns:
        List of dicts with branch_id, branch_name, avg_rating, total_reviews.
    """
    db = get_db()

    # Gather all branches
    branches: dict[str, str] = {}
    for doc in db.collection("branches").stream():
        data = doc.to_dict()
        branches[doc.id] = data.get("branch_name", doc.id)

    # Aggregate reviews per branch
    branch_stats: dict[str, dict[str, Any]] = defaultdict(
        lambda: {"rating_sum": 0, "count": 0}
    )

    for doc in db.collection("reviews").stream():
        data = doc.to_dict()
        bid = data.get("branch_id", "")
        if bid:
            branch_stats[bid]["rating_sum"] += data.get("rating", 0)
            branch_stats[bid]["count"] += 1

    results = []
    for bid, stats in branch_stats.items():
        count = stats["count"]
        results.append(
            {
                "branch_id": bid,
                "branch_name": branches.get(bid, bid),
                "avg_rating": round(stats["rating_sum"] / count, 2) if count else 0.0,
                "total_reviews": count,
            }
        )

    return results


def get_staff_performance(branch_id: str) -> list[dict[str, Any]]:
    """Get staff performance metrics for a branch.

    Returns:
        List of dicts with staff_name, avg_rating, total_tagged_reviews.
    """
    db = get_db()
    reviews = (
        db.collection("reviews")
        .where("branch_id", "==", branch_id)
        .stream()
    )

    staff_data: dict[str, dict[str, Any]] = defaultdict(
        lambda: {"rating_sum": 0, "count": 0}
    )

    for doc in reviews:
        data = doc.to_dict()
        tagged = data.get("staff_tagged")
        if tagged:
            staff_data[tagged]["rating_sum"] += data.get("rating", 0)
            staff_data[tagged]["count"] += 1

    # Resolve staff names from staff collection
    staff_names: dict[str, str] = {}
    for doc in db.collection("staff").where("branch_id", "==", branch_id).stream():
        staff_names[doc.id] = doc.to_dict().get("staff_name", doc.id)

    results = []
    for staff_id, stats in staff_data.items():
        count = stats["count"]
        results.append(
            {
                "staff_id": staff_id,
                "staff_name": staff_names.get(staff_id, staff_id),
                "avg_rating": round(stats["rating_sum"] / count, 2) if count else 0.0,
                "total_tagged_reviews": count,
            }
        )

    return results
