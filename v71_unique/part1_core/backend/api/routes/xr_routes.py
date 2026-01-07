# CHE·NU™ V71 — XR Environment Routes (Canonical V2)
"""
🥽 API Routes pour XR Environment Generator

ENDPOINTS:
- POST /threads/{thread_id}/xr/generate - Générer blueprint
- GET /threads/{thread_id}/xr/blueprint/latest - Récupérer dernier blueprint
- DELETE /threads/{thread_id}/xr/cache - Invalider cache

RÈGLE CANONIQUE: XR = PROJECTION du Thread
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
from datetime import datetime

router = APIRouter(prefix="/threads/{thread_id}/xr", tags=["XR Environment"])


# ============================================================================
# SCHEMAS
# ============================================================================

class BlueprintItem(BaseModel):
    """Item dans une zone XR."""
    id: str
    kind: str
    label: str
    redaction_level: str = "private"
    source_event_id: Optional[str] = None
    source_snapshot_id: Optional[str] = None
    actions: List[str] = []


class BlueprintZone(BaseModel):
    """Zone dans l'environnement XR."""
    id: str
    type: str
    title: str
    items: List[BlueprintItem] = []
    layout: Dict[str, Any] = {}


class BlueprintPortal(BaseModel):
    """Portail vers autre thread."""
    label: str
    thread_id: str


class BlueprintResponse(BaseModel):
    """Réponse complète du blueprint."""
    thread_id: str
    template: str
    generated_at: datetime
    version: str
    zones: List[BlueprintZone]
    portals: List[BlueprintPortal] = []
    references: Dict[str, List[str]] = {"events": [], "snapshots": []}


class GenerateRequest(BaseModel):
    """Request pour générer un blueprint."""
    force_regenerate: bool = Field(default=False, description="Forcer régénération (ignorer cache)")


class CacheInvalidateResponse(BaseModel):
    """Réponse invalidation cache."""
    thread_id: str
    entries_removed: int
    message: str


class XRStatsResponse(BaseModel):
    """Statistiques XR Generator."""
    blueprints_generated: int
    cache_hits: int
    cache_size: int


# ============================================================================
# ROUTES
# ============================================================================

@router.post("/generate", response_model=BlueprintResponse, status_code=status.HTTP_200_OK)
async def generate_xr_blueprint(
    thread_id: str,
    request: GenerateRequest = GenerateRequest(),
    # user_id: str = Depends(get_current_user_id),  # À activer avec auth
):
    """
    🥽 Générer un blueprint XR pour un thread.
    
    RÈGLE: Le blueprint est une PROJECTION du thread, jamais une source de vérité.
    
    Args:
        thread_id: ID du thread
        request: Options de génération
    
    Returns:
        BlueprintResponse complet
    
    Raises:
        404: Thread non trouvé
        403: Accès non autorisé
    """
    from backend.services.xr_environment_generator import get_xr_generator
    from backend.services.thread_service_v2 import get_thread_service
    
    try:
        # Get services
        thread_service = get_thread_service()
        xr_generator = get_xr_generator(thread_service)
        
        # TODO: Replace with actual user_id from auth
        viewer_id = "system"
        
        # Generate blueprint
        blueprint = await xr_generator.generate_blueprint(
            thread_id=thread_id,
            viewer_id=viewer_id,
            force_regenerate=request.force_regenerate,
        )
        
        return BlueprintResponse(**blueprint.to_dict())
        
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Thread {thread_id} not found"
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Blueprint generation failed: {str(e)}"
        )


@router.get("/blueprint/latest", response_model=BlueprintResponse)
async def get_latest_blueprint(
    thread_id: str,
    # user_id: str = Depends(get_current_user_id),
):
    """
    📋 Récupérer le dernier blueprint généré.
    
    Args:
        thread_id: ID du thread
    
    Returns:
        Dernier BlueprintResponse ou 404
    """
    from backend.services.xr_environment_generator import get_xr_generator
    
    try:
        xr_generator = get_xr_generator()
        viewer_id = "system"  # TODO: from auth
        
        # Check cache first
        cache_key = f"{thread_id}:{viewer_id}"
        if cache_key in xr_generator._blueprint_cache:
            blueprint = xr_generator._blueprint_cache[cache_key]
            return BlueprintResponse(**blueprint.to_dict())
        
        # Generate if not cached
        blueprint = await xr_generator.generate_blueprint(
            thread_id=thread_id,
            viewer_id=viewer_id,
        )
        
        return BlueprintResponse(**blueprint.to_dict())
        
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No blueprint found for thread {thread_id}"
        )


@router.delete("/cache", response_model=CacheInvalidateResponse)
async def invalidate_xr_cache(
    thread_id: str,
    # user_id: str = Depends(get_current_user_id),
):
    """
    🗑️ Invalider le cache XR pour un thread.
    
    Utile après modifications majeures du thread.
    
    Args:
        thread_id: ID du thread
    
    Returns:
        Nombre d'entrées supprimées
    """
    from backend.services.xr_environment_generator import get_xr_generator
    
    xr_generator = get_xr_generator()
    entries_removed = xr_generator.invalidate_cache(thread_id)
    
    return CacheInvalidateResponse(
        thread_id=thread_id,
        entries_removed=entries_removed,
        message=f"Cache invalidated for thread {thread_id}"
    )


@router.get("/stats", response_model=XRStatsResponse)
async def get_xr_stats():
    """
    📊 Récupérer les statistiques du XR Generator.
    
    Returns:
        Statistiques du service
    """
    from backend.services.xr_environment_generator import get_xr_generator
    
    xr_generator = get_xr_generator()
    stats = await xr_generator.get_stats()
    
    return XRStatsResponse(**stats)


# ============================================================================
# WEBSOCKET (Future - Real-time XR updates)
# ============================================================================

# @router.websocket("/ws/{user_id}")
# async def xr_websocket(websocket: WebSocket, thread_id: str, user_id: str):
#     """WebSocket pour updates XR en temps réel."""
#     pass  # Future implementation
