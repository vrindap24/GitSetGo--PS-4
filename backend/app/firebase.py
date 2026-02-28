"""Firebase Admin SDK initialization and Firestore client.

Supports two credential modes:
  1. Local JSON file (FIREBASE_CREDENTIALS_PATH)
  2. Base64-encoded JSON string (GOOGLE_CREDENTIALS_JSON) for Render/cloud deployment
"""

from __future__ import annotations

import base64
import json
import logging
import tempfile

import firebase_admin
from firebase_admin import credentials, firestore

from app.config import get_settings

logger = logging.getLogger(__name__)

_db = None


def init_firebase() -> None:
    """Initialize Firebase Admin SDK using service account credentials.

    Tries GOOGLE_CREDENTIALS_JSON (base64) first, then falls back
    to FIREBASE_CREDENTIALS_PATH (local file).

    Raises:
        RuntimeError: If Firebase initialization fails.
    """
    global _db

    if _db is not None:
        return

    settings = get_settings()

    try:
        # Strategy 1: Base64-encoded JSON from environment (for Render/cloud)
        if settings.google_credentials_json:
            logger.info("Initializing Firebase from GOOGLE_CREDENTIALS_JSON env var.")
            decoded = base64.b64decode(settings.google_credentials_json)
            cred_dict = json.loads(decoded)
            cred = credentials.Certificate(cred_dict)
        else:
            # Strategy 2: Local file path
            logger.info("Initializing Firebase from file: %s", settings.firebase_credentials_path)
            cred = credentials.Certificate(settings.firebase_credentials_path)

        firebase_admin.initialize_app(cred)
        _db = firestore.client()
        logger.info("Firebase initialized successfully.")
    except Exception as e:
        logger.error("Failed to initialize Firebase: %s", e)
        raise RuntimeError(f"Firebase initialization failed: {e}") from e


def get_db() -> firestore.client:
    """Return the Firestore client instance.

    Raises:
        RuntimeError: If Firebase has not been initialized.
    """
    if _db is None:
        raise RuntimeError(
            "Firestore client is not initialized. Call init_firebase() first."
        )
    return _db
