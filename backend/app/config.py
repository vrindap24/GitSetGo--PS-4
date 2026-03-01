"""Application settings loaded from environment variables."""

from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Central configuration for the application.

    All values are loaded from environment variables or a .env file.
    """

    # Firebase
    firebase_credentials_path: str = "./firebase-credentials.json"
    google_credentials_json: str = ""  # Base64-encoded JSON for Render deployment

    # Gemini AI
    gemini_api_key: str = ""

    # Escalation
    escalation_threshold: int = 70

    # API Key Protection
    internal_api_key: str = ""

    # Notification placeholders (replace with real API keys)
    whatsapp_api_key: str = ""  # Legacy field
    sms_api_key: str = ""

    # WhatsApp Cloud API (Meta)
    whatsapp_access_token: str = ""
    whatsapp_phone_number_id: str = ""
    escalation_whatsapp_recipients: str = ""  # Comma-separated phone numbers

    # CORS
    allowed_origins: str = "http://localhost:3000,http://localhost:5173,http://localhost:3001"

    # Google Business Profile API
    google_business_account_id: str = ""
    google_business_location_map: str = ""  # JSON: {"locations/123": "b1", "locations/456": "b2"}

    # Google Places API (New) — fetch public reviews from Google Maps
    google_places_api_key: str = ""
    # Comma-separated: "ChIJ...:b1" (place_id:branch_id pairs) - Add Prasad Food Divine Place IDs here
    google_place_ids: str = ""

    # Constants
    max_review_length: int = 1000

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
