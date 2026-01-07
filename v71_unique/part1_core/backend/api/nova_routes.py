"""
CHE·NU™ Nova Pipeline API Routes
REST API for Multi-Lane Cognitive Processing

CANON: GOUVERNANCE > EXÉCUTION
- HTTP 423 LOCKED for checkpoint pending
- HTTP 403 FORBIDDEN for identity violations

Endpoints:
- POST /nova/query - Execute query
- POST /nova/checkpoint/{id}/approve - Approve checkpoint
- POST /nova/checkpoint/{id}/reject - Reject checkpoint
- GET /nova/pipeline/{id}/status - Get pipeline status
- GET /nova/checkpoints - List pending checkpoints
- GET /nova/metrics - Get pipeline metrics

Author: CHE·NU Team
Version: 1.0.0
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Depends, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import logging

from ..services.nova_pipeline import (
    get_nova_pipeline_service,
    NovaPipelineService,
    NovaQuery,
    PipelineStatus,
    CheckpointType,
)

logger = logging.getLogger(__name__)

# Router
router = APIRouter(prefix="/nova", tags=["Nova Pipeline"])


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class NovaQueryRequest(BaseModel):
    """Request model for Nova query"""
    query: str = Field(..., min_length=1, max_length=10000, description="User query")
    identity_id: str = Field(..., min_length=1, description="User identity ID")
    sphere_id: Optional[str] = Field(None, description="Target sphere ID")
    context: Dict[str, Any] = Field(default_factory=dict, description="Additional context")
    options: Dict[str, Any] = Field(default_factory=dict, description="Query options")
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "What are my upcoming meetings?",
                "identity_id": "user_123",
                "sphere_id": "personal",
                "context": {"thread_id": "thread_456"},
                "options": {"require_approval": False}
            }
        }


class CheckpointApproveRequest(BaseModel):
    """Request to approve a checkpoint"""
    approver_id: str = Field(..., description="ID of the approving user")
    notes: Optional[str] = Field(None, max_length=1000, description="Approval notes")
    
    class Config:
        json_schema_extra = {
            "example": {
                "approver_id": "admin_user",
                "notes": "Approved after review"
            }
        }


class CheckpointRejectRequest(BaseModel):
    """Request to reject a checkpoint"""
    rejector_id: str = Field(..., description="ID of the rejecting user")
    reason: Optional[str] = Field(None, max_length=1000, description="Rejection reason")
    
    class Config:
        json_schema_extra = {
            "example": {
                "rejector_id": "admin_user",
                "reason": "Action not authorized at this time"
            }
        }


class LaneStatusResponse(BaseModel):
    """Status of a single lane"""
    lane_name: str
    status: str
    duration_ms: int
    error: Optional[str] = None


class CheckpointResponse(BaseModel):
    """Checkpoint information"""
    id: str
    type: str
    reason: str
    requires_approval: bool
    options: List[str]
    created_at: str
    expires_at: Optional[str] = None
    is_pending: bool
    resolution: Optional[str] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[str] = None


class PipelineMetrics(BaseModel):
    """Pipeline execution metrics"""
    total_tokens_used: int
    total_time_ms: int


class PipelineResponse(BaseModel):
    """Response for pipeline operations"""
    pipeline_id: str
    query_id: str
    status: str
    lanes: Dict[str, Optional[LaneStatusResponse]]
    result: Optional[Any] = None
    error: Optional[str] = None
    checkpoint: Optional[CheckpointResponse] = None
    metrics: PipelineMetrics


class PipelineStatusResponse(BaseModel):
    """Simplified pipeline status"""
    pipeline_id: str
    status: str
    has_checkpoint: bool
    checkpoint_id: Optional[str] = None
    error: Optional[str] = None
    created_at: Optional[str] = None
    completed_at: Optional[str] = None


class CheckpointListResponse(BaseModel):
    """List of checkpoints"""
    checkpoints: List[CheckpointResponse]
    total: int


class MetricsResponse(BaseModel):
    """Pipeline service metrics"""
    total_pipelines: int
    total_checkpoints: int
    total_approvals: int
    total_rejections: int
    pending_checkpoints: int
    active_pipelines: int


# =============================================================================
# CUSTOM HTTP 423 RESPONSE
# =============================================================================

class CheckpointPendingResponse(JSONResponse):
    """
    HTTP 423 LOCKED Response for checkpoint pending
    
    CANON: GOUVERNANCE > EXÉCUTION
    This response indicates the pipeline is blocked waiting for human approval.
    """
    
    def __init__(
        self,
        pipeline_id: str,
        checkpoint: CheckpointResponse,
        **kwargs
    ):
        content = {
            "detail": "Checkpoint pending approval",
            "pipeline_id": pipeline_id,
            "status": "checkpoint_pending",
            "checkpoint": checkpoint.model_dump(),
            "message": "This action requires human approval. Use the checkpoint approve/reject endpoints to continue."
        }
        super().__init__(
            content=content,
            status_code=status.HTTP_423_LOCKED,
            **kwargs
        )


# =============================================================================
# DEPENDENCIES
# =============================================================================

def get_service() -> NovaPipelineService:
    """Get Nova Pipeline service instance"""
    return get_nova_pipeline_service()


async def get_current_identity(request: Request) -> str:
    """
    Extract current identity from request
    In production, this would validate JWT and extract user ID
    """
    # Check Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        # Would validate JWT here
        pass
    
    # Check X-Identity-ID header (for testing)
    identity_id = request.headers.get("X-Identity-ID")
    if identity_id:
        return identity_id
    
    # Default to query parameter or body
    return None


# =============================================================================
# ROUTES
# =============================================================================

@router.post(
    "/query",
    response_model=PipelineResponse,
    responses={
        200: {"description": "Pipeline completed successfully"},
        423: {"description": "Checkpoint pending - requires human approval"},
        403: {"description": "Identity violation - access forbidden"},
        400: {"description": "Invalid request"},
        500: {"description": "Internal server error"},
    },
    summary="Execute Nova Query",
    description="""
Execute a query through the Nova Multi-Lane Pipeline.

The pipeline processes the query through 7 lanes:
- **Lane A**: Intent Analysis - Understand the query
- **Lane B**: Context Snapshot - Gather relevant context
- **Lane C**: Semantic Encoding - Encode for processing
- **Lane D**: Governance Check - Validate policies
- **Lane E**: Checkpoint - Block if approval needed
- **Lane F**: Execution - Run the action
- **Lane G**: Audit Trail - Log everything

**Response Codes:**
- `200 OK`: Pipeline completed successfully
- `423 LOCKED`: Checkpoint pending - action requires human approval
- `403 FORBIDDEN`: Identity violation detected
- `400 BAD REQUEST`: Invalid request parameters
"""
)
async def execute_query(
    request_data: NovaQueryRequest,
    service: NovaPipelineService = Depends(get_service),
):
    """Execute a Nova query through the multi-lane pipeline"""
    try:
        # Create Nova Query
        query = NovaQuery(
            query=request_data.query,
            identity_id=request_data.identity_id,
            sphere_id=request_data.sphere_id,
            context=request_data.context,
            options=request_data.options,
        )
        
        # Execute pipeline
        result = await service.execute_query(query)
        
        # Build response
        response = _build_pipeline_response(result)
        
        # Check for checkpoint pending (HTTP 423)
        if result.status == PipelineStatus.CHECKPOINT_PENDING:
            checkpoint_response = _build_checkpoint_response(result.checkpoint)
            return CheckpointPendingResponse(
                pipeline_id=result.pipeline_id,
                checkpoint=checkpoint_response,
            )
        
        # Check for identity violation (HTTP 403)
        if result.error and "cross-identity" in result.error.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "identity_violation",
                    "message": result.error,
                    "pipeline_id": result.pipeline_id,
                }
            )
        
        # Check for failure
        if result.status == PipelineStatus.FAILED:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "error": "pipeline_failed",
                    "message": result.error,
                    "pipeline_id": result.pipeline_id,
                }
            )
        
        return response
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Nova query failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post(
    "/checkpoint/{checkpoint_id}/approve",
    response_model=PipelineResponse,
    responses={
        200: {"description": "Checkpoint approved, pipeline completed"},
        404: {"description": "Checkpoint not found"},
        400: {"description": "Checkpoint not pending"},
    },
    summary="Approve Checkpoint",
    description="""
Approve a pending checkpoint to continue pipeline execution.

This endpoint is used to provide human approval for actions that were
blocked by the governance layer (HTTP 423 response).

After approval, the pipeline will continue execution from Lane F.
"""
)
async def approve_checkpoint(
    checkpoint_id: str,
    request_data: CheckpointApproveRequest,
    service: NovaPipelineService = Depends(get_service),
):
    """Approve a pending checkpoint"""
    try:
        result = await service.approve_checkpoint(
            checkpoint_id=checkpoint_id,
            approver_id=request_data.approver_id,
            notes=request_data.notes,
        )
        
        return _build_pipeline_response(result)
        
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Approve checkpoint failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post(
    "/checkpoint/{checkpoint_id}/reject",
    response_model=PipelineResponse,
    responses={
        200: {"description": "Checkpoint rejected, pipeline cancelled"},
        404: {"description": "Checkpoint not found"},
        400: {"description": "Checkpoint not pending"},
    },
    summary="Reject Checkpoint",
    description="""
Reject a pending checkpoint and cancel pipeline execution.

This endpoint is used to deny human approval for actions that were
blocked by the governance layer (HTTP 423 response).

After rejection, the pipeline will be marked as REJECTED and no
further execution will occur.
"""
)
async def reject_checkpoint(
    checkpoint_id: str,
    request_data: CheckpointRejectRequest,
    service: NovaPipelineService = Depends(get_service),
):
    """Reject a pending checkpoint"""
    try:
        result = await service.reject_checkpoint(
            checkpoint_id=checkpoint_id,
            rejector_id=request_data.rejector_id,
            reason=request_data.reason,
        )
        
        return _build_pipeline_response(result)
        
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Reject checkpoint failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get(
    "/pipeline/{pipeline_id}/status",
    response_model=PipelineStatusResponse,
    responses={
        200: {"description": "Pipeline status retrieved"},
        404: {"description": "Pipeline not found"},
    },
    summary="Get Pipeline Status",
    description="Get the current status of a pipeline by ID."
)
async def get_pipeline_status(
    pipeline_id: str,
    service: NovaPipelineService = Depends(get_service),
):
    """Get pipeline status by ID"""
    pipeline = service.get_pipeline(pipeline_id)
    
    if not pipeline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline not found: {pipeline_id}"
        )
    
    return PipelineStatusResponse(
        pipeline_id=pipeline.pipeline_id,
        status=pipeline.status.value,
        has_checkpoint=pipeline.checkpoint is not None,
        checkpoint_id=pipeline.checkpoint.id if pipeline.checkpoint else None,
        error=pipeline.error,
        created_at=pipeline.started_at.isoformat() if pipeline.started_at else None,
        completed_at=pipeline.completed_at.isoformat() if pipeline.completed_at else None,
    )


@router.get(
    "/pipeline/{pipeline_id}",
    response_model=PipelineResponse,
    responses={
        200: {"description": "Pipeline details retrieved"},
        404: {"description": "Pipeline not found"},
    },
    summary="Get Pipeline Details",
    description="Get full details of a pipeline including all lane results."
)
async def get_pipeline(
    pipeline_id: str,
    service: NovaPipelineService = Depends(get_service),
):
    """Get full pipeline details by ID"""
    pipeline = service.get_pipeline(pipeline_id)
    
    if not pipeline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline not found: {pipeline_id}"
        )
    
    return _build_pipeline_response(pipeline)


@router.get(
    "/checkpoints",
    response_model=CheckpointListResponse,
    summary="List Pending Checkpoints",
    description="Get all pending checkpoints, optionally filtered by identity."
)
async def list_checkpoints(
    identity_id: Optional[str] = None,
    service: NovaPipelineService = Depends(get_service),
):
    """List pending checkpoints"""
    checkpoints = service.get_pending_checkpoints(identity_id)
    
    checkpoint_responses = [
        _build_checkpoint_response(cp) for cp in checkpoints
    ]
    
    return CheckpointListResponse(
        checkpoints=checkpoint_responses,
        total=len(checkpoint_responses),
    )


@router.get(
    "/checkpoint/{checkpoint_id}",
    response_model=CheckpointResponse,
    responses={
        200: {"description": "Checkpoint details retrieved"},
        404: {"description": "Checkpoint not found"},
    },
    summary="Get Checkpoint Details",
    description="Get details of a specific checkpoint."
)
async def get_checkpoint(
    checkpoint_id: str,
    service: NovaPipelineService = Depends(get_service),
):
    """Get checkpoint details by ID"""
    checkpoint = service.get_checkpoint(checkpoint_id)
    
    if not checkpoint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Checkpoint not found: {checkpoint_id}"
        )
    
    return _build_checkpoint_response(checkpoint)


@router.get(
    "/metrics",
    response_model=MetricsResponse,
    summary="Get Pipeline Metrics",
    description="Get metrics about pipeline executions and checkpoints."
)
async def get_metrics(
    service: NovaPipelineService = Depends(get_service),
):
    """Get pipeline service metrics"""
    metrics = service.get_metrics()
    return MetricsResponse(**metrics)


@router.get(
    "/health",
    summary="Health Check",
    description="Check if the Nova Pipeline service is healthy."
)
async def health_check(
    service: NovaPipelineService = Depends(get_service),
):
    """Health check endpoint"""
    metrics = service.get_metrics()
    return {
        "status": "healthy",
        "service": "nova_pipeline",
        "metrics": metrics,
    }


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def _build_pipeline_response(result) -> PipelineResponse:
    """Build PipelineResponse from PipelineResult"""
    lanes = {}
    
    for lane_attr in ["lane_a_intent", "lane_b_context", "lane_c_encoding",
                      "lane_d_governance", "lane_e_checkpoint", "lane_f_execution",
                      "lane_g_audit"]:
        lane = getattr(result, lane_attr)
        if lane:
            lanes[lane_attr] = LaneStatusResponse(
                lane_name=lane.lane_name,
                status=lane.status.value,
                duration_ms=lane.duration_ms,
                error=lane.error,
            )
        else:
            lanes[lane_attr] = None
    
    checkpoint = None
    if result.checkpoint:
        checkpoint = _build_checkpoint_response(result.checkpoint)
    
    return PipelineResponse(
        pipeline_id=result.pipeline_id,
        query_id=result.query_id,
        status=result.status.value,
        lanes=lanes,
        result=result.result,
        error=result.error,
        checkpoint=checkpoint,
        metrics=PipelineMetrics(
            total_tokens_used=result.total_tokens_used,
            total_time_ms=result.total_time_ms,
        ),
    )


def _build_checkpoint_response(checkpoint) -> CheckpointResponse:
    """Build CheckpointResponse from Checkpoint"""
    return CheckpointResponse(
        id=checkpoint.id,
        type=checkpoint.checkpoint_type.value,
        reason=checkpoint.reason,
        requires_approval=checkpoint.requires_approval,
        options=checkpoint.options,
        created_at=checkpoint.created_at.isoformat(),
        expires_at=checkpoint.expires_at.isoformat() if checkpoint.expires_at else None,
        is_pending=checkpoint.is_pending,
        resolution=checkpoint.resolution,
        resolved_by=checkpoint.resolved_by,
        resolved_at=checkpoint.resolved_at.isoformat() if checkpoint.resolved_at else None,
    )


# =============================================================================
# WEBSOCKET ENDPOINT (for real-time updates)
# =============================================================================

from fastapi import WebSocket, WebSocketDisconnect
import json


class ConnectionManager:
    """Manage WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, identity_id: str):
        await websocket.accept()
        if identity_id not in self.active_connections:
            self.active_connections[identity_id] = []
        self.active_connections[identity_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, identity_id: str):
        if identity_id in self.active_connections:
            if websocket in self.active_connections[identity_id]:
                self.active_connections[identity_id].remove(websocket)
    
    async def send_to_identity(self, identity_id: str, message: dict):
        if identity_id in self.active_connections:
            for connection in self.active_connections[identity_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass


manager = ConnectionManager()


@router.websocket("/ws/{identity_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    identity_id: str,
    service: NovaPipelineService = Depends(get_service),
):
    """
    WebSocket endpoint for real-time pipeline updates
    
    Connect to receive events:
    - pipeline.start
    - lane.complete
    - checkpoint.pending
    - checkpoint.resolved
    - pipeline.complete
    - pipeline.failed
    """
    await manager.connect(websocket, identity_id)
    
    # Register event handlers
    async def on_pipeline_event(pipeline, *args):
        event_type = args[0] if args else "update"
        await manager.send_to_identity(identity_id, {
            "type": event_type,
            "pipeline_id": pipeline.pipeline_id,
            "status": pipeline.status.value,
            "checkpoint_id": pipeline.checkpoint.id if pipeline.checkpoint else None,
            "timestamp": datetime.utcnow().isoformat(),
        })
    
    # Register handlers
    for event in ["pipeline.start", "lane.complete", "checkpoint.pending",
                  "checkpoint.resolved", "pipeline.complete", "pipeline.failed"]:
        service.on(event, on_pipeline_event)
    
    try:
        while True:
            # Wait for messages from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle ping
            if message.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, identity_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, identity_id)
