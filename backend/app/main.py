"""FastAPI application entry point.

Includes:
  • API key middleware for write-endpoint protection
  • Global exception handler for consistent error responses
  • Dynamic CORS from environment variables
  • Health check endpoint
"""

import logging
import traceback
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

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
# API Key Middleware
# ---------------------------------------------------------------------------
class APIKeyMiddleware(BaseHTTPMiddleware):
    """Protect mutating endpoints with an API key.

    Rules:
      • Skip /health and /docs and /openapi.json and /redoc
      • Skip all GET requests (read-only)
      • Skip POST /api/v1/reviews (public review submission from PWA)
      • Require ``x-api-key`` header for all other write operations
      • If INTERNAL_API_KEY is empty, bypass all checks (dev mode)
    """

    async def dispatch(self, request: Request, call_next):
        settings = get_settings()

        # If no API key is configured, skip middleware (dev mode)
        if not settings.internal_api_key:
            return await call_next(request)

        path = request.url.path
        method = request.method.upper()

        # Always allow: health, docs, openapi
        if path in ("/health", "/docs", "/redoc", "/openapi.json"):
            return await call_next(request)

        # Allow all GET requests (read-only)
        if method == "GET":
            return await call_next(request)

        # Allow public review submission (PWA endpoint)
        if method == "POST" and path == "/api/v1/reviews":
            return await call_next(request)

        # All other write operations require API key
        api_key = request.headers.get("x-api-key", "")
        if api_key != settings.internal_api_key:
            logger.warning(
                "Unauthorized API access attempt: %s %s from %s",
                method, path, request.client.host if request.client else "unknown",
            )
            return JSONResponse(
                status_code=401,
                content={"success": False, "error": "Invalid or missing API key."},
            )

        return await call_next(request)


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup."""
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
# Middleware (order matters: last added = first executed)
# ---------------------------------------------------------------------------
settings = get_settings()

# CORS – dynamic from environment
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API key protection
app.add_middleware(APIKeyMiddleware)

# ---------------------------------------------------------------------------
# Global Exception Handlers
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all handler for unhandled exceptions.

    Returns a consistent JSON error response and logs the full traceback.
    """
    logger.error(
        "Unhandled exception on %s %s: %s",
        request.method,
        request.url.path,
        str(exc),
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "An internal server error occurred. Please try again later.",
        },
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
    """Simple health check endpoint – no dependencies."""
    return {"status": "ok", "service": "review-backend", "version": "v1"}
