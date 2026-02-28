"""Input sanitization utilities for review text and user input."""

from __future__ import annotations

import re

# Control characters (excluding newline, tab)
_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
_EXCESSIVE_WHITESPACE = re.compile(r"[ \t]{3,}")
_EXCESSIVE_NEWLINES = re.compile(r"\n{3,}")


def sanitize_review_text(text: str, max_length: int = 1000) -> str:
    """Sanitize review text before AI processing.

    Steps:
        1. Strip leading/trailing whitespace
        2. Remove control characters
        3. Collapse excessive whitespace
        4. Truncate to max_length

    Args:
        text: Raw review text from user.
        max_length: Maximum allowed length.

    Returns:
        Cleaned text string.
    """
    text = text.strip()
    text = _CONTROL_CHARS.sub("", text)
    text = _EXCESSIVE_WHITESPACE.sub("  ", text)
    text = _EXCESSIVE_NEWLINES.sub("\n\n", text)
    return text[:max_length]
