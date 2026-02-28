"""Firebase Admin SDK initialization and Firestore client."""

import logging

import firebase_admin
from firebase_admin import credentials, firestore

from app.config import get_settings

logger = logging.getLogger(__name__)

_db = None


def init_firebase() -> None:
    """Initialize Firebase Admin SDK using service account credentials.

    Raises:
        RuntimeError: If Firebase initialization fails.
    """
    global _db

    if _db is not None:
        return

    settings = get_settings()

    try:
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
