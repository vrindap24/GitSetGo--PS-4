"""Shared Gemini AI client utility.

All agents call ``call_gemini(prompt)`` instead of initializing their own client.
Includes structured error logging and graceful fallback on failure.
"""

from __future__ import annotations

import json
import logging
from typing import Any

import google.generativeai as genai

from app.config import get_settings
from app.utils.sanitize import sanitize_review_text

logger = logging.getLogger(__name__)

_model = None


def _get_model():
    """Lazily initialize and return the Gemini model."""
    global _model
    if _model is None:
        settings = get_settings()
        if not settings.gemini_api_key:
            logger.warning("GEMINI_API_KEY is not set – AI analysis will return defaults.")
            return None
        genai.configure(api_key=settings.gemini_api_key)
        _model = genai.GenerativeModel("gemini-2.0-flash")
        logger.info("Gemini AI model initialized.")
    return _model


async def call_gemini(prompt: str) -> str:
    """Send a prompt to Gemini and return the raw text response.

    Args:
        prompt: The full prompt string.

    Returns:
        Raw text from Gemini (stripped). Empty string on failure.
    """
    model = _get_model()
    if model is None:
        return ""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(
            "Gemini text call failed",
            extra={
                "error_type": type(e).__name__,
                "error_message": str(e),
                "prompt_length": len(prompt),
            },
        )
        return ""


async def call_gemini_json(prompt: str) -> dict[str, Any]:
    """Send a prompt to Gemini and parse the response as JSON.

    Handles markdown code fences that Gemini sometimes wraps JSON in.

    Args:
        prompt: The full prompt string (should ask for JSON output).

    Returns:
        Parsed dict. Returns empty dict on parse failure.
    """
    try:
        raw = await call_gemini(prompt)
        if not raw:
            logger.warning("Gemini returned empty response – using fallback.")
            return {}

        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
        if raw.endswith("```"):
            raw = raw[: raw.rfind("```")]
        raw = raw.strip()

        return json.loads(raw)

    except json.JSONDecodeError as e:
        logger.error(
            "Failed to parse Gemini JSON response",
            extra={
                "error_type": "JSONDecodeError",
                "error_message": str(e),
                "raw_response_preview": raw[:200] if raw else "",
            },
        )
        return {}
    except Exception as e:
        logger.error(
            "Gemini JSON call failed",
            extra={
                "error_type": type(e).__name__,
                "error_message": str(e),
            },
        )
        return {}
