"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                    CHE·NU™ V72 — FASTAPI BACKEND                             ║
║                                                                              ║
║  Main application entry point                                                ║
║  GOUVERNANCE > EXÉCUTION                                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time
from typing import Any

from app.api.v1 import router as api_v1_router
from app.core.config import settings
from app.core.database import engine, Base
from app.core.redis import redis_client
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.auth import AuthMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("chenu")

# ═══════════════════════════════════════════════════════════════════════════════
# LIFESPAN
# ═══════════════════════════════════════════════════════════════════════════════

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("🚀 Starting CHE·NU V72 API...")
    
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ Database tables created")
    
    # Test Redis connection
    try:
        await redis_client.ping()
        logger.info("✅ Redis connected")
    except Exception as e:
        logger.warning(f"⚠️ Redis connection failed: {e}")
    
    logger.info("✅ CHE·NU V72 API ready!")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down CHE·NU V72 API...")
    await redis_client.close()
    await engine.dispose()

# ═══════════════════════════════════════════════════════════════════════════════
# APP INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="CHE·NU™ V72 API",
    description="""
    Governed Intelligence Operating System API
    
    ## GOUVERNANCE > EXÉCUTION
    
    All sensitive actions require checkpoint approval.
    """,
    version="72.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ═══════════════════════════════════════════════════════════════════════════════
# MIDDLEWARE
# ═══════════════════════════════════════════════════════════════════════════════

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Rate limiting
app.add_middleware(RateLimitMiddleware)

# Request timing
@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"→ {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"← {request.method} {request.url.path} [{response.status_code}]")
    return response

# ═══════════════════════════════════════════════════════════════════════════════
# EXCEPTION HANDLERS
# ═══════════════════════════════════════════════════════════════════════════════

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.detail if isinstance(exc.detail, str) else "ERROR",
                "message": str(exc.detail),
            }
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An internal error occurred",
            }
        }
    )

# ═══════════════════════════════════════════════════════════════════════════════
# ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

# API v1 routes
app.include_router(api_v1_router, prefix="/api/v1")

# Health check
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "72.0.0",
        "service": "chenu-api"
    }

# Ready check (includes dependencies)
@app.get("/ready", tags=["Health"])
async def ready_check():
    """Readiness check including dependencies."""
    checks = {
        "api": True,
        "database": False,
        "redis": False,
    }
    
    # Check database
    try:
        async with engine.connect() as conn:
            await conn.execute("SELECT 1")
        checks["database"] = True
    except Exception:
        pass
    
    # Check Redis
    try:
        await redis_client.ping()
        checks["redis"] = True
    except Exception:
        pass
    
    all_healthy = all(checks.values())
    
    return JSONResponse(
        status_code=200 if all_healthy else 503,
        content={
            "status": "ready" if all_healthy else "degraded",
            "checks": checks
        }
    )

# Root
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint."""
    return {
        "name": "CHE·NU™ V72 API",
        "version": "72.0.0",
        "docs": "/docs",
        "health": "/health",
        "principle": "GOUVERNANCE > EXÉCUTION"
    }
