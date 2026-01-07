"""
============================================================================
CHE·NU™ V69 — API
============================================================================
Version: 1.0.0
Purpose: REST API and WebSocket streaming for CHE·NU platform
Principle: GOUVERNANCE > EXÉCUTION — Complete integration layer

The API provides:
- RESTful endpoints for all CHE·NU modules
- WebSocket streaming for real-time updates
- JWT/API key authentication
- OPA governance integration
- Rate limiting
- Complete audit logging

Endpoints:
- /api/v1/health - Health check
- /api/v1/auth - Authentication
- /api/v1/simulations - Simulation management
- /api/v1/scenarios - Scenario management
- /api/v1/agents - Agent management
- /api/v1/checkpoints - HITL checkpoints
- /api/v1/xr-packs - XR Pack generation
- /api/v1/causal - Causal inference
- /api/v1/audit - Audit logs
- /ws - WebSocket streaming

Usage:
    # Run with uvicorn
    uvicorn api:app --host 0.0.0.0 --port 8000
    
    # Or programmatically
    from api import create_app, get_settings
    
    app = create_app()
    
    # Custom settings
    from api.core.config import APISettings, Environment
    
    settings = APISettings(
        environment=Environment.PRODUCTION,
        debug=False,
        opa_enabled=True,
    )
    app = create_app(settings)
============================================================================
"""

# Core
from .core import (
    app,
    create_app,
    get_settings,
    APISettings,
    Environment,
    APIResponse,
    PaginatedResponse,
    ErrorResponse,
    APIError,
    NotFoundError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    GovernanceError,
    RateLimitError,
    RequestContext,
    API_TAGS,
)

# Endpoints
from .endpoints import (
    health_router,
    auth_router,
    simulations_router,
    scenarios_router,
    agents_router,
    checkpoints_router,
    xr_packs_router,
    causal_router,
    audit_router,
)

# WebSocket
from .websocket import (
    ws_router,
    manager,
    ConnectionManager,
    WSMessage,
    WSMessageType,
    emit_simulation_update,
    emit_agent_event,
    emit_checkpoint_created,
    emit_checkpoint_resolved,
    emit_xr_pack_ready,
)

# Middleware
from .middleware import (
    AuthenticationMiddleware,
    GovernanceMiddleware,
    RateLimitMiddleware,
    LoggingMiddleware,
    create_access_token,
    decode_access_token,
    get_current_user,
    get_request_context,
    require_role,
    require_permission,
)

__version__ = "1.0.0"

__all__ = [
    # Version
    "__version__",
    # App
    "app",
    "create_app",
    # Settings
    "get_settings",
    "APISettings",
    "Environment",
    # Responses
    "APIResponse",
    "PaginatedResponse",
    "ErrorResponse",
    # Errors
    "APIError",
    "NotFoundError",
    "ValidationError",
    "AuthenticationError",
    "AuthorizationError",
    "GovernanceError",
    "RateLimitError",
    # Context
    "RequestContext",
    "API_TAGS",
    # Routers
    "health_router",
    "auth_router",
    "simulations_router",
    "scenarios_router",
    "agents_router",
    "checkpoints_router",
    "xr_packs_router",
    "causal_router",
    "audit_router",
    "ws_router",
    # WebSocket
    "manager",
    "ConnectionManager",
    "WSMessage",
    "WSMessageType",
    "emit_simulation_update",
    "emit_agent_event",
    "emit_checkpoint_created",
    "emit_checkpoint_resolved",
    "emit_xr_pack_ready",
    # Middleware
    "AuthenticationMiddleware",
    "GovernanceMiddleware",
    "RateLimitMiddleware",
    "LoggingMiddleware",
    "create_access_token",
    "decode_access_token",
    "get_current_user",
    "get_request_context",
    "require_role",
    "require_permission",
]
