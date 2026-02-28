"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.firebase import init_firebase
from app.routers import (
    analytics_routes,
    branch_routes,
    ingestion_routes,
    insight_routes,
    review_routes,
    staff_routes,
)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup."""
    settings = get_settings()
    logger.info("Starting ReviewSense backend …")

    # Initialize Firebase (will raise RuntimeError if credentials are missing)
    try:
        init_firebase()
    except RuntimeError:
        logger.warning(
            "Firebase init failed – running in LIMITED mode (no DB operations)."
        )

    yield  # application is running
    logger.info("Shutting down ReviewSense backend …")


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="ReviewSense API",
    description=(
        "AI-powered centralized review management backend. "
        "Collects reviews, runs Gemini AI analysis, auto-escalates critical issues, "
        "and serves analytics for dashboard visualization."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers – all under /api/v1
# ---------------------------------------------------------------------------
API_V1 = "/api/v1"

app.include_router(review_routes.router, prefix=API_V1, tags=["Reviews"])
app.include_router(branch_routes.router, prefix=API_V1, tags=["Branches"])
app.include_router(staff_routes.router, prefix=API_V1, tags=["Staff"])
app.include_router(analytics_routes.router, prefix=API_V1, tags=["Analytics"])
app.include_router(ingestion_routes.router, prefix=API_V1, tags=["Ingestion"])
app.include_router(insight_routes.router, prefix=API_V1, tags=["Insights"])


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["Health"])
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "version": "1.0.0"}
