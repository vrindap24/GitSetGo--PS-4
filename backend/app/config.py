"""Application settings loaded from environment variables."""

from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Central configuration for the application.

    All values are loaded from environment variables or a .env file.
    """

    # Firebase
    firebase_credentials_path: str = "./firebase-credentials.json"

    # Gemini AI
    gemini_api_key: str = ""

    # Escalation
    escalation_threshold: int = 70

    # Notification placeholders (replace with real API keys)
    whatsapp_api_key: str = ""
    sms_api_key: str = ""

    # CORS
    allowed_origins: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        """Parse comma-separated origins into a list."""
        return [origin.strip() for origin in self.allowed_origins.split(",")]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


@lru_cache
def get_settings() -> Settings:
    """Return cached Settings instance (singleton)."""
    return Settings()
