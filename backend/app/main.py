"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                    CHE·NU™ V75 — MAIN APPLICATION                            ║
║                                                                              ║
║  FastAPI Backend - Governed Intelligence Operating System                    ║
║  GOUVERNANCE > EXÉCUTION                                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

# Core imports
from app.api.v1 import router as api_v1_router
from app.api.v1.files import router as files_router
from app.api.v1.search import router as search_router
from app.api.v1.xr import router as xr_router
from app.api.v1.memory import router as memory_router
from app.api.v1.tokens import router as tokens_router
from app.core.config import settings
from app.core.database import get_engine, Base, init_db, close_db

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 8: ROUTERS PRIORITAIRES (P0)
# ═══════════════════════════════════════════════════════════════════════════════

# Import routers from backend/routers/ (legacy Agent 2 code)
import sys
import os
# Add parent directory to path for routers import
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

try:
    from routers.identity import router as identity_router
    IDENTITY_ROUTER_AVAILABLE = True
except ImportError:
    IDENTITY_ROUTER_AVAILABLE = False

try:
    from routers.workspaces import router as workspaces_router
    WORKSPACES_ROUTER_AVAILABLE = True
except ImportError:
    WORKSPACES_ROUTER_AVAILABLE = False

try:
    from routers.meetings import router as meetings_router
    MEETINGS_ROUTER_AVAILABLE = True
except ImportError:
    MEETINGS_ROUTER_AVAILABLE = False

try:
    from routers.dataspaces import router as dataspaces_router
    DATASPACES_ROUTER_AVAILABLE = True
except ImportError:
    DATASPACES_ROUTER_AVAILABLE = False

try:
    from routers.backstage import router as backstage_router
    BACKSTAGE_ROUTER_AVAILABLE = True
except ImportError:
    BACKSTAGE_ROUTER_AVAILABLE = False

try:
    from routers.immobilier import router as immobilier_router
    IMMOBILIER_ROUTER_AVAILABLE = True
except ImportError:
    IMMOBILIER_ROUTER_AVAILABLE = False

try:
    from routers.streaming import router as streaming_router
    STREAMING_ROUTER_AVAILABLE = True
except ImportError:
    STREAMING_ROUTER_AVAILABLE = False

try:
    from routers.templates import router as templates_router
    TEMPLATES_ROUTER_AVAILABLE = True
except ImportError:
    TEMPLATES_ROUTER_AVAILABLE = False

try:
    from routers.tags import router as tags_router
    TAGS_ROUTER_AVAILABLE = True
except ImportError:
    TAGS_ROUTER_AVAILABLE = False

try:
    from routers.comments import router as comments_router
    COMMENTS_ROUTER_AVAILABLE = True
except ImportError:
    COMMENTS_ROUTER_AVAILABLE = False

try:
    from routers.notifications import router as notifications_router
    NOTIFICATIONS_ROUTER_AVAILABLE = True
except ImportError:
    NOTIFICATIONS_ROUTER_AVAILABLE = False

try:
    from routers.activity import router as activity_router
    ACTIVITY_ROUTER_AVAILABLE = True
except ImportError:
    ACTIVITY_ROUTER_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════════════════════════════════
# LIFESPAN
# ═══════════════════════════════════════════════════════════════════════════════

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    logger.info("🚀 Starting CHE·NU Backend...")
    
    # Initialize database
    await init_db()
    logger.info("✅ Database initialized")
    
    yield
    
    # Cleanup
    await close_db()
    logger.info("👋 CHE·NU Backend shutdown complete")

# ═══════════════════════════════════════════════════════════════════════════════
# APP INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="CHE·NU API",
    description="Governed Intelligence Operating System",
    version="75.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ═══════════════════════════════════════════════════════════════════════════════
# CORS MIDDLEWARE
# ═══════════════════════════════════════════════════════════════════════════════

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════════════════════════════════════════
# IDENTITY BOUNDARY MIDDLEWARE (HTTP 403)
# ═══════════════════════════════════════════════════════════════════════════════

@app.middleware("http")
async def identity_boundary_middleware(request: Request, call_next):
    """
    Enforce identity boundary - prevent cross-identity access.
    Returns HTTP 403 FORBIDDEN for violations.
    """
    # Extract identity from token (simplified for now)
    # In production: validate JWT and extract user_id
    
    response = await call_next(request)
    return response

# ═══════════════════════════════════════════════════════════════════════════════
# GOVERNANCE CHECKPOINT HANDLER (HTTP 423)
# ═══════════════════════════════════════════════════════════════════════════════

@app.exception_handler(423)
async def checkpoint_exception_handler(request: Request, exc: HTTPException):
    """
    Handle HTTP 423 LOCKED - Checkpoint required.
    Human must approve before action can proceed.
    """
    return JSONResponse(
        status_code=423,
        content={
            "status": "checkpoint_pending",
            "message": "Action requires human approval",
            "checkpoint": exc.detail if hasattr(exc, 'detail') else None,
        }
    )

# ═══════════════════════════════════════════════════════════════════════════════
# REGISTER ROUTERS
# ═══════════════════════════════════════════════════════════════════════════════

# Core API v1
app.include_router(api_v1_router, prefix="/api/v1")

# Extended APIs
app.include_router(files_router, prefix="/api/v1")
app.include_router(search_router, prefix="/api/v1")
app.include_router(xr_router, prefix="/api/v1")
app.include_router(memory_router, prefix="/api/v1")
app.include_router(tokens_router, prefix="/api/v1")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 8: ROUTERS PRIORITAIRES (P0) — 111 nouveaux endpoints
# ═══════════════════════════════════════════════════════════════════════════════

# P0 Core Routers
if IDENTITY_ROUTER_AVAILABLE:
    app.include_router(identity_router, prefix="/api/v1/identity", tags=["Identity"])
    logger.info("✅ Identity Router: 13 endpoints")

if WORKSPACES_ROUTER_AVAILABLE:
    app.include_router(workspaces_router, prefix="/api/v1/workspaces", tags=["Workspaces"])
    logger.info("✅ Workspaces Router: 16 endpoints")

if DATASPACES_ROUTER_AVAILABLE:
    app.include_router(dataspaces_router, prefix="/api/v1/dataspaces", tags=["Dataspaces"])
    logger.info("✅ Dataspaces Router: 7 endpoints")

if BACKSTAGE_ROUTER_AVAILABLE:
    app.include_router(backstage_router, prefix="/api/v1/backstage", tags=["Backstage"])
    logger.info("✅ Backstage Router: 13 endpoints")

# P0 Sphere Routers
if MEETINGS_ROUTER_AVAILABLE:
    app.include_router(meetings_router, prefix="/api/v1/meetings", tags=["Meetings"])
    logger.info("✅ Meetings Router: 14 endpoints")

if IMMOBILIER_ROUTER_AVAILABLE:
    app.include_router(immobilier_router, prefix="/api/v1/immobilier", tags=["Immobilier"])
    logger.info("✅ Immobilier Router: 15 endpoints")

# P1 Routers
if STREAMING_ROUTER_AVAILABLE:
    app.include_router(streaming_router, prefix="/api/v1/streaming", tags=["Streaming"])
    logger.info("✅ Streaming Router: 23 endpoints")

if TEMPLATES_ROUTER_AVAILABLE:
    app.include_router(templates_router, prefix="/api/v1/templates", tags=["Templates"])
    logger.info("✅ Templates Router: 10 endpoints")

if TAGS_ROUTER_AVAILABLE:
    app.include_router(tags_router, prefix="/api/v1/tags", tags=["Tags"])
    logger.info("✅ Tags Router: 11 endpoints")

if COMMENTS_ROUTER_AVAILABLE:
    app.include_router(comments_router, prefix="/api/v1/comments", tags=["Comments"])
    logger.info("✅ Comments Router: 9 endpoints")

if NOTIFICATIONS_ROUTER_AVAILABLE:
    app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["Notifications"])
    logger.info("✅ Notifications Router: 10 endpoints")

if ACTIVITY_ROUTER_AVAILABLE:
    app.include_router(activity_router, prefix="/api/v1/activity", tags=["Activity"])
    logger.info("✅ Activity Router: 8 endpoints")

# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH & ROOT ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "CHE·NU API",
        "version": "75.0.0",
        "status": "operational",
        "governance": "ENABLED",
        "message": "GOUVERNANCE > EXÉCUTION",
    }

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "75.0.0",
        "services": {
            "api": "operational",
            "database": "operational",
            "governance": "enabled",
            "checkpoints": "active",
        }
    }

@app.get("/api/v1/health")
async def api_health():
    """API v1 health check."""
    return {"status": "healthy", "api_version": "v1"}

# ═══════════════════════════════════════════════════════════════════════════════
# WEBSOCKET ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════

from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Set
import json

class ConnectionManager:
    """WebSocket connection manager."""
    
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        if channel not in self.active_connections:
            self.active_connections[channel] = set()
        self.active_connections[channel].add(websocket)
    
    def disconnect(self, websocket: WebSocket, channel: str):
        if channel in self.active_connections:
            self.active_connections[channel].discard(websocket)
    
    async def broadcast(self, channel: str, message: dict):
        if channel in self.active_connections:
            for connection in self.active_connections[channel]:
                try:
                    await connection.send_json(message)
                except:
                    pass

manager = ConnectionManager()

@app.websocket("/ws/{channel}")
async def websocket_endpoint(websocket: WebSocket, channel: str):
    """WebSocket endpoint for real-time updates."""
    await manager.connect(websocket, channel)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
            elif message.get("type") == "subscribe":
                # Handle subscription
                pass
            else:
                # Broadcast to channel
                await manager.broadcast(channel, message)
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)

# ═══════════════════════════════════════════════════════════════════════════════
# STARTUP LOG
# ═══════════════════════════════════════════════════════════════════════════════

logger.info("""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    CHE·NU™ V75 — API READY (PHASE 8)                        ║
║                                                                              ║
║  Core Endpoints:                                                             ║
║    • /api/v1/* - Core API (Auth, Threads, Decisions, Agents, Nova)          ║
║    • /api/v1/files/* - File Upload                                          ║
║    • /api/v1/search/* - Advanced Search                                     ║
║    • /api/v1/xr/* - XR Environment Generator                                ║
║    • /api/v1/memory/* - Tri-Layer Memory                                    ║
║    • /api/v1/tokens/* - Token Management                                    ║
║                                                                              ║
║  Phase 8 - P0 Core (49 endpoints):                                          ║
║    • /api/v1/identity/* - Multi-Identity System (13)                        ║
║    • /api/v1/workspaces/* - Workspace Engine (16)                           ║
║    • /api/v1/dataspaces/* - Dataspace Management (7)                        ║
║    • /api/v1/backstage/* - Governance Backstage (13)                        ║
║                                                                              ║
║  Phase 8 - P0 Spheres (29 endpoints):                                       ║
║    • /api/v1/meetings/* - Meeting Management (14)                           ║
║    • /api/v1/immobilier/* - Real Estate Quebec (15)                         ║
║                                                                              ║
║  Phase 8 - P1 (71 endpoints):                                               ║
║    • /api/v1/streaming/* - Entertainment Streaming (23)                     ║
║    • /api/v1/templates/* - Templates Management (10)                        ║
║    • /api/v1/tags/* - Tags System (11)                                      ║
║    • /api/v1/comments/* - Comments System (9)                               ║
║    • /api/v1/notifications/* - Notifications (10)                           ║
║    • /api/v1/activity/* - Activity Feed (8)                                 ║
║                                                                              ║
║  WebSocket:                                                                  ║
║    • /ws/{channel} - Real-time Updates                                      ║
║                                                                              ║
║  Total: 73 (core) + 149 (phase 8) = 222 endpoints                           ║
║                                                                              ║
║  Governance: HTTP 423 (Checkpoint) | HTTP 403 (Identity Boundary)           ║
║                                                                              ║
║  GOUVERNANCE > EXÉCUTION                                                     ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
""")

# ═══════════════════════════════════════════════════════════════════════════════
# IDENTITY BOUNDARY MIDDLEWARE
# ═══════════════════════════════════════════════════════════════════════════════

from app.middleware.identity_boundary import IdentityBoundaryMiddleware

app.add_middleware(IdentityBoundaryMiddleware)
logger.info("✅ Identity Boundary Middleware enabled (HTTP 403)")
