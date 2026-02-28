"""Insight Agent – Generate AI-powered trend reports using Gemini.

The "winner move" – this agent generates natural-language insights like:
  "Service complaints increased 18% at Andheri branch"
  "Staff Rahul mentioned 4 times in positive feedback"
  "Cleanliness trend declining past 2 weeks"
"""

from __future__ import annotations

import logging
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any

from app.firebase import get_db
from app.services.ai_service import call_gemini_json

logger = logging.getLogger(__name__)

_INSIGHT_PROMPT = """You are an AI business intelligence analyst for a restaurant chain.

Given the following aggregated review data for a branch over the past {days} days, generate actionable insights.

Branch Data:
- Total reviews: {total_reviews}
- Average rating: {avg_rating}
- Sentiment distribution: {sentiment_dist}
- Category distribution: {category_dist}
- Staff mentions: {staff_mentions}
- Recent negative themes: {negative_themes}
- Escalation count: {escalation_count}

Return a JSON object with EXACTLY these fields:

{{
  "summary": "<2–3 sentence executive summary of the branch's performance>",
  "insights": [
    "<insight 1 — trend, pattern, or actionable finding>",
    "<insight 2>",
    "<insight 3>",
    "<insight 4>",
    "<insight 5>"
  ],
  "alerts": [
    "<any urgent alerts that need immediate attention, or empty array if none>"
  ],
  "recommendations": [
    "<recommendation 1>",
    "<recommendation 2>",
    "<recommendation 3>"
  ]
}}

RULES:
- Return ONLY valid JSON. No markdown, no explanation.
- Insights should reference specific data points (percentages, names, trends).
- Alerts are only for urgent/critical issues.
- Recommendations should be concrete and actionable.
- If data is limited, acknowledge that in the summary.
"""


async def generate_branch_insights(
    branch_id: str,
    days: int = 7,
) -> dict[str, Any]:
    """Generate AI-powered insights for a branch.

    Args:
        branch_id: Branch document ID.
        days: Number of days to look back (default: 7).

    Returns:
        Dict with summary, insights, alerts, recommendations.
    """
    # Gather raw data from Firestore
    data = _aggregate_branch_data(branch_id, days)

    if data["total_reviews"] == 0:
        return {
            "branch_id": branch_id,
            "period_days": days,
            "summary": "No reviews found for this period.",
            "insights": [],
            "alerts": [],
            "recommendations": ["Encourage customers to leave reviews to build a feedback pipeline."],
        }

    prompt = _INSIGHT_PROMPT.format(
        days=days,
        total_reviews=data["total_reviews"],
        avg_rating=data["avg_rating"],
        sentiment_dist=data["sentiment_dist"],
        category_dist=data["category_dist"],
        staff_mentions=data["staff_mentions"],
        negative_themes=data["negative_themes"],
        escalation_count=data["escalation_count"],
    )

    result = await call_gemini_json(prompt)

    if not result:
        logger.warning("Insight agent returned empty – using basic stats.")
        return {
            "branch_id": branch_id,
            "period_days": days,
            "summary": f"Branch received {data['total_reviews']} reviews with avg rating {data['avg_rating']}.",
            "insights": [],
            "alerts": [],
            "recommendations": [],
        }

    result["branch_id"] = branch_id
    result["period_days"] = days
    logger.info("Generated insights for branch %s (%d day window).", branch_id, days)
    return result


async def generate_staff_insights(
    branch_id: str,
    days: int = 7,
) -> dict[str, Any]:
    """Generate staff-level insights for a branch.

    Args:
        branch_id: Branch document ID.
        days: Number of days to look back.

    Returns:
        Dict with staff performance trends.
    """
    data = _aggregate_staff_data(branch_id, days)

    if not data:
        return {
            "branch_id": branch_id,
            "period_days": days,
            "staff_insights": [],
        }

    staff_summary = []
    for name, stats in data.items():
        count = stats["count"]
        avg = round(stats["rating_sum"] / count, 1) if count else 0
        sentiments = dict(stats["sentiments"])
        staff_summary.append(
            f"{name}: {count} mentions, avg rating {avg}, sentiments: {sentiments}"
        )

    return {
        "branch_id": branch_id,
        "period_days": days,
        "staff_insights": staff_summary,
        "raw_data": {
            name: {
                "mention_count": stats["count"],
                "avg_rating": round(stats["rating_sum"] / stats["count"], 1) if stats["count"] else 0,
                "sentiment_breakdown": dict(stats["sentiments"]),
            }
            for name, stats in data.items()
        },
    }


# ---------------------------------------------------------------------------
# Internal aggregation helpers
# ---------------------------------------------------------------------------
def _aggregate_branch_data(branch_id: str, days: int) -> dict[str, Any]:
    """Aggregate review data for insight generation."""
    db = get_db()
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    reviews = (
        db.collection("reviews")
        .where("branch_id", "==", branch_id)
        .stream()
    )

    total = 0
    rating_sum = 0
    sentiment_counts: Counter[str] = Counter()
    category_counts: Counter[str] = Counter()
    staff_mentions: Counter[str] = Counter()
    negative_themes: list[str] = []
    escalation_count = 0

    for doc in reviews:
        data = doc.to_dict()
        ts = data.get("timestamp")

        # Filter by time window (if timestamp is available)
        if ts and hasattr(ts, "timestamp"):
            try:
                if ts < cutoff:
                    continue
            except TypeError:
                pass

        total += 1
        rating_sum += data.get("rating", 0)

        ai = data.get("ai_analysis")
        if ai:
            label = ai.get("sentiment_label", "Neutral")
            sentiment_counts[label] += 1

            for cat in ai.get("categories", []):
                category_counts[cat] += 1

            staff = ai.get("staff_mentioned")
            if staff:
                staff_mentions[staff] += 1

            if label == "Negative":
                negative_themes.extend(ai.get("categories", []))

        if data.get("escalation_id"):
            escalation_count += 1

    avg_rating = round(rating_sum / total, 2) if total else 0.0

    return {
        "total_reviews": total,
        "avg_rating": avg_rating,
        "sentiment_dist": dict(sentiment_counts),
        "category_dist": dict(category_counts),
        "staff_mentions": dict(staff_mentions),
        "negative_themes": list(set(negative_themes)),
        "escalation_count": escalation_count,
    }


def _aggregate_staff_data(
    branch_id: str,
    days: int,
) -> dict[str, dict[str, Any]]:
    """Aggregate staff-level data for insight generation."""
    db = get_db()
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    reviews = (
        db.collection("reviews")
        .where("branch_id", "==", branch_id)
        .stream()
    )

    staff_data: dict[str, dict[str, Any]] = defaultdict(
        lambda: {"rating_sum": 0, "count": 0, "sentiments": Counter()}
    )

    for doc in reviews:
        data = doc.to_dict()
        ai = data.get("ai_analysis")
        if not ai:
            continue

        staff = ai.get("staff_mentioned")
        if not staff:
            tagged = data.get("staff_tagged")
            if not tagged:
                continue
            staff = tagged

        ts = data.get("timestamp")
        if ts and hasattr(ts, "timestamp"):
            try:
                if ts < cutoff:
                    continue
            except TypeError:
                pass

        staff_data[staff]["rating_sum"] += data.get("rating", 0)
        staff_data[staff]["count"] += 1
        staff_data[staff]["sentiments"][ai.get("sentiment_label", "Neutral")] += 1

    return dict(staff_data)
