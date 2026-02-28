"""Shared Gemini AI client utility.

All agents call `call_gemini(prompt)` instead of initializing their own client.
"""

from __future__ import annotations

import json
import logging
from typing import Any

import google.generativeai as genai

from app.config import get_settings

logger = logging.getLogger(__name__)

_model = None


def _get_model():
    """Lazily initialize and return the Gemini model."""
    global _model
    if _model is None:
        settings = get_settings()
        genai.configure(api_key=settings.gemini_api_key)
        _model = genai.GenerativeModel("gemini-2.0-flash")
        logger.info("Gemini AI model initialized.")
    return _model


async def call_gemini(prompt: str) -> str:
    """Send a prompt to Gemini and return the raw text response.

    Args:
        prompt: The full prompt string.

    Returns:
        Raw text from Gemini (stripped).
    """
    model = _get_model()
    response = model.generate_content(prompt)
    return response.text.strip()


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

        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
        if raw.endswith("```"):
            raw = raw[: raw.rfind("```")]
        raw = raw.strip()

        return json.loads(raw)

    except json.JSONDecodeError as e:
        logger.error("Failed to parse Gemini response as JSON: %s", e)
        return {}
    except Exception as e:
        logger.error("Gemini call failed: %s", e)
        return {}
