"""
CHE·NU™ V72 - Pipeline Routes
REST API endpoints for Nova Pipeline and Data Processing.

Implements:
- Nova Pipeline execution (HTTP 423 for checkpoints)
- Checkpoint approval/rejection
- Pipeline status and monitoring
- Data processing jobs
- Schema management
- Validation endpoints

Principle: GOVERNANCE > EXECUTION
"""

import logging
from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from pydantic import BaseModel, Field

from ..services.nova_pipeline_service import (
    nova_pipeline_service,
    PipelineStatus,
    PipelineResult,
    Checkpoint,
    CheckpointDecision,
    CheckpointType,
    LaneType,
)
from ..services.data_processing_service import (
    data_processing_service,
    DataSourceType,
    TransformationType,
    ValidationLevel,
    ProcessingStatus,
    DataSchema,
    ProcessingJob,
    ValidationResult,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/pipeline", tags=["Pipeline"])


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

# Nova Pipeline Models
class NovaQueryRequest(BaseModel):
    """Request to execute Nova pipeline query."""
    query: str = Field(..., min_length=1, max_length=10000, description="User query")
    identity_id: str = Field(..., description="User identity ID")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Additional context")
    options: Optional[Dict[str, Any]] = Field(default=None, description="Pipeline options")

    class Config:
        json_schema_extra = {
            "example": {
                "query": "Get all my tasks from this week",
                "identity_id": "identity_123",
                "context": {"dataspace": "personal"},
                "options": {"require_approval": False}
            }
        }


class CheckpointResponse(BaseModel):
    """Checkpoint information."""
    id: str
    pipeline_id: str
    checkpoint_type: str
    reason: str
    decision: str
    created_at: datetime
    decided_at: Optional[datetime]
    decided_by: Optional[str]
    options: List[str]
    timeout_minutes: int
    is_expired: bool

    class Config:
        from_attributes = True


class LaneResultResponse(BaseModel):
    """Lane execution result."""
    lane_type: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime]
    duration_ms: Optional[int]
    data: Dict[str, Any]
    error: Optional[str]


class PipelineMetricsResponse(BaseModel):
    """Pipeline metrics."""
    total_time_ms: int
    tokens_used: int
    tokens_input: int
    tokens_output: int
    llm_calls: int
    api_calls: int


class PipelineResponse(BaseModel):
    """Pipeline execution response."""
    pipeline_id: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime]
    lanes: Dict[str, LaneResultResponse]
    result: Optional[Any]
    checkpoint: Optional[CheckpointResponse]
    metrics: PipelineMetricsResponse
    error: Optional[str]
    audit_id: Optional[str]


class CheckpointApprovalRequest(BaseModel):
    """Request to approve/reject checkpoint."""
    user_id: str = Field(..., description="User approving/rejecting")
    reason: Optional[str] = Field(default=None, description="Reason for rejection")


# Data Processing Models
class SchemaFieldRequest(BaseModel):
    """Schema field definition."""
    name: str
    type: str = "string"
    required: bool = False
    nullable: bool = True
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    pattern: Optional[str] = None
    enum: Optional[List[Any]] = None
    default: Any = None
    description: Optional[str] = None


class CreateSchemaRequest(BaseModel):
    """Request to create a schema."""
    name: str = Field(..., min_length=1, max_length=100)
    version: str = Field(..., pattern=r"^\d+\.\d+(\.\d+)?$")
    fields: List[SchemaFieldRequest]
    description: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Product",
                "version": "1.0",
                "fields": [
                    {"name": "id", "type": "string", "required": True},
                    {"name": "name", "type": "string", "required": True, "min_length": 1},
                    {"name": "price", "type": "number", "required": True, "min_value": 0},
                    {"name": "active", "type": "boolean", "default": True}
                ],
                "description": "Product catalog schema"
            }
        }


class SchemaResponse(BaseModel):
    """Schema response."""
    schema_id: str
    name: str
    version: str
    fields: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    description: Optional[str]


class TransformationRequest(BaseModel):
    """Single transformation configuration."""
    type: str
    config: Dict[str, Any] = Field(default_factory=dict)


class ProcessJobRequest(BaseModel):
    """Request to process data."""
    source_type: str = "memory"
    data: List[Dict[str, Any]]
    transformations: Optional[List[TransformationRequest]] = None
    schema_id: Optional[str] = None
    validation_level: str = "normal"

    class Config:
        json_schema_extra = {
            "example": {
                "source_type": "memory",
                "data": [
                    {"name": "John", "email": "john@example.com", "age": 30},
                    {"name": "Jane", "email": "jane@example.com", "age": 25}
                ],
                "transformations": [
                    {"type": "normalize", "config": {"normalizations": {"name": {"type": "trim"}}}}
                ]
            }
        }


class ValidationRequest(BaseModel):
    """Request to validate data."""
    data: List[Dict[str, Any]]
    schema_id: str
    level: str = "normal"


class ValidationErrorResponse(BaseModel):
    """Validation error."""
    field: str
    message: str
    value: Any
    rule: str
    severity: str


class ValidationResponse(BaseModel):
    """Validation result."""
    status: str
    errors: List[ValidationErrorResponse]
    warnings: List[ValidationErrorResponse]
    validated_at: datetime
    metadata: Dict[str, Any]


class JobResponse(BaseModel):
    """Processing job response."""
    job_id: str
    source_type: str
    status: str
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    duration_ms: Optional[int]
    input_records: int
    output_records: int
    error_records: int
    validation_result: Optional[ValidationResponse]
    error: Optional[str]


# =============================================================================
# NOVA PIPELINE ENDPOINTS
# =============================================================================

@router.post(
    "/nova/query",
    response_model=PipelineResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Pipeline completed successfully"},
        423: {"description": "Checkpoint pending - approval required"},
        500: {"description": "Pipeline failed"},
    },
    summary="Execute Nova Pipeline Query",
    description="""
    Execute a query through the Nova Multi-Lane Pipeline.
    
    The pipeline processes the query through 7 lanes:
    - Lane A: Intent Analysis
    - Lane B: Context Snapshot
    - Lane C: Semantic Encoding
    - Lane D: Governance Rules
    - Lane E: Checkpoint Blocking
    - Lane F: Execution
    - Lane G: Audit & Token Tracking
    
    Returns HTTP 423 if a checkpoint requires user approval.
    """,
)
async def execute_nova_query(request: NovaQueryRequest):
    """Execute Nova pipeline query."""
    try:
        # Execute pipeline
        result = await nova_pipeline_service.execute_pipeline(
            query=request.query,
            user_id=request.identity_id,  # For now, using identity_id as user_id
            identity_id=request.identity_id,
            context=request.context,
            options=request.options,
        )
        
        # Convert to response
        response = _pipeline_to_response(result)
        
        # Check if checkpoint pending
        if result.status == PipelineStatus.CHECKPOINT_PENDING:
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail={
                    "message": "Checkpoint pending - approval required",
                    "pipeline_id": result.pipeline_id,
                    "checkpoint": _checkpoint_to_response(result.checkpoint) if result.checkpoint else None,
                },
            )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Pipeline execution failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pipeline execution failed: {str(e)}",
        )


@router.post(
    "/nova/checkpoint/{checkpoint_id}/approve",
    response_model=PipelineResponse,
    summary="Approve Checkpoint",
    description="Approve a pending checkpoint and continue pipeline execution.",
)
async def approve_checkpoint(
    checkpoint_id: str,
    request: CheckpointApprovalRequest,
):
    """Approve a checkpoint."""
    try:
        result = await nova_pipeline_service.approve_checkpoint(
            checkpoint_id=checkpoint_id,
            user_id=request.user_id,
        )
        return _pipeline_to_response(result)
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Checkpoint approval failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Checkpoint approval failed: {str(e)}",
        )


@router.post(
    "/nova/checkpoint/{checkpoint_id}/reject",
    response_model=PipelineResponse,
    summary="Reject Checkpoint",
    description="Reject a pending checkpoint and cancel pipeline execution.",
)
async def reject_checkpoint(
    checkpoint_id: str,
    request: CheckpointApprovalRequest,
):
    """Reject a checkpoint."""
    try:
        result = await nova_pipeline_service.reject_checkpoint(
            checkpoint_id=checkpoint_id,
            user_id=request.user_id,
            reason=request.reason,
        )
        return _pipeline_to_response(result)
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Checkpoint rejection failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Checkpoint rejection failed: {str(e)}",
        )


@router.get(
    "/nova/pipeline/{pipeline_id}/status",
    response_model=PipelineResponse,
    summary="Get Pipeline Status",
    description="Get the current status of a pipeline execution.",
)
async def get_pipeline_status(pipeline_id: str):
    """Get pipeline status."""
    result = nova_pipeline_service.get_pipeline_status(pipeline_id)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline {pipeline_id} not found",
        )
    
    return _pipeline_to_response(result)


@router.get(
    "/nova/checkpoints",
    response_model=List[CheckpointResponse],
    summary="List Pending Checkpoints",
    description="List all pending checkpoints, optionally filtered by user.",
)
async def list_pending_checkpoints(
    user_id: Optional[str] = Query(default=None, description="Filter by user ID"),
):
    """List pending checkpoints."""
    checkpoints = nova_pipeline_service.get_pending_checkpoints(user_id)
    return [_checkpoint_to_response(cp) for cp in checkpoints]


@router.get(
    "/nova/checkpoint/{checkpoint_id}",
    response_model=CheckpointResponse,
    summary="Get Checkpoint",
    description="Get checkpoint details by ID.",
)
async def get_checkpoint(checkpoint_id: str):
    """Get checkpoint by ID."""
    checkpoint = nova_pipeline_service.get_checkpoint(checkpoint_id)
    
    if not checkpoint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Checkpoint {checkpoint_id} not found",
        )
    
    return _checkpoint_to_response(checkpoint)


@router.get(
    "/nova/audit",
    response_model=List[Dict[str, Any]],
    summary="Get Audit Log",
    description="Get pipeline audit log entries.",
)
async def get_audit_log(
    user_id: Optional[str] = Query(default=None, description="Filter by user ID"),
    limit: int = Query(default=100, ge=1, le=1000, description="Maximum entries to return"),
):
    """Get audit log."""
    return nova_pipeline_service.get_audit_log(user_id, limit)


# =============================================================================
# DATA PROCESSING ENDPOINTS
# =============================================================================

@router.post(
    "/data/schemas",
    response_model=SchemaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Schema",
    description="Create a new data schema for validation.",
)
async def create_schema(request: CreateSchemaRequest):
    """Create a new schema."""
    try:
        schema = data_processing_service.create_schema(
            name=request.name,
            version=request.version,
            fields=[f.model_dump() for f in request.fields],
            description=request.description,
        )
        return _schema_to_response(schema)
        
    except Exception as e:
        logger.error(f"Schema creation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Schema creation failed: {str(e)}",
        )


@router.get(
    "/data/schemas",
    response_model=List[SchemaResponse],
    summary="List Schemas",
    description="List all available schemas.",
)
async def list_schemas():
    """List all schemas."""
    schemas = data_processing_service.list_schemas()
    return [_schema_to_response(s) for s in schemas]


@router.get(
    "/data/schemas/{schema_id}",
    response_model=SchemaResponse,
    summary="Get Schema",
    description="Get schema by ID.",
)
async def get_schema(schema_id: str):
    """Get schema by ID."""
    schema = data_processing_service.get_schema(schema_id)
    
    if not schema:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schema {schema_id} not found",
        )
    
    return _schema_to_response(schema)


@router.post(
    "/data/validate",
    response_model=ValidationResponse,
    summary="Validate Data",
    description="Validate data against a schema.",
)
async def validate_data(request: ValidationRequest):
    """Validate data against schema."""
    try:
        level = ValidationLevel(request.level)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid validation level: {request.level}",
        )
    
    try:
        result = data_processing_service.validate_data(
            data=request.data,
            schema_id=request.schema_id,
            level=level,
        )
        return _validation_to_response(result)
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/data/jobs",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Processing Job",
    description="Create and execute a data processing job with transformations.",
)
async def create_processing_job(request: ProcessJobRequest):
    """Create and execute processing job."""
    try:
        source_type = DataSourceType(request.source_type)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid source type: {request.source_type}",
        )
    
    try:
        validation_level = ValidationLevel(request.validation_level)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid validation level: {request.validation_level}",
        )
    
    transformations = None
    if request.transformations:
        transformations = [
            {"type": t.type, "config": t.config}
            for t in request.transformations
        ]
    
    try:
        job = await data_processing_service.create_job(
            source_type=source_type,
            data=request.data,
            transformations=transformations,
            schema_id=request.schema_id,
            validation_level=validation_level,
        )
        return _job_to_response(job)
        
    except Exception as e:
        logger.error(f"Job creation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Job creation failed: {str(e)}",
        )


@router.get(
    "/data/jobs",
    response_model=List[JobResponse],
    summary="List Jobs",
    description="List processing jobs with optional filtering.",
)
async def list_jobs(
    status_filter: Optional[str] = Query(default=None, alias="status", description="Filter by status"),
    limit: int = Query(default=100, ge=1, le=1000, description="Maximum jobs to return"),
):
    """List processing jobs."""
    job_status = None
    if status_filter:
        try:
            job_status = ProcessingStatus(status_filter)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status_filter}",
            )
    
    jobs = data_processing_service.list_jobs(status=job_status, limit=limit)
    return [_job_to_response(j) for j in jobs]


@router.get(
    "/data/jobs/{job_id}",
    response_model=JobResponse,
    summary="Get Job",
    description="Get processing job by ID.",
)
async def get_job(job_id: str):
    """Get job by ID."""
    job = data_processing_service.get_job(job_id)
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found",
        )
    
    return _job_to_response(job)


@router.get(
    "/data/quality/{schema_id}",
    summary="Calculate Data Quality",
    description="Calculate data quality metrics for given data.",
)
async def calculate_data_quality(
    schema_id: str,
    data: str = Query(..., description="JSON-encoded data array"),
):
    """Calculate data quality metrics."""
    import json
    
    try:
        data_list = json.loads(data)
        if not isinstance(data_list, list):
            raise ValueError("Data must be an array")
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON data",
        )
    
    try:
        metrics = data_processing_service.calculate_data_quality(
            data=data_list,
            schema_id=schema_id,
        )
        return metrics
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/data/sample/{schema_id}",
    summary="Generate Sample Data",
    description="Generate sample data based on schema.",
)
async def generate_sample_data(
    schema_id: str,
    count: int = Query(default=10, ge=1, le=1000, description="Number of samples"),
):
    """Generate sample data."""
    try:
        samples = data_processing_service.generate_sample_data(
            schema_id=schema_id,
            count=count,
        )
        return {"samples": samples}
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/data/transformations",
    summary="List Available Transformations",
    description="List all available transformation types.",
)
async def list_transformations():
    """List available transformations."""
    return {
        "transformations": [
            {
                "type": t.value,
                "description": _get_transformation_description(t),
            }
            for t in TransformationType
        ]
    }


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def _pipeline_to_response(result: PipelineResult) -> PipelineResponse:
    """Convert PipelineResult to response model."""
    return PipelineResponse(
        pipeline_id=result.pipeline_id,
        status=result.status.value,
        started_at=result.started_at,
        completed_at=result.completed_at,
        lanes={
            k: LaneResultResponse(
                lane_type=v.lane_type.value,
                status=v.status.value,
                started_at=v.started_at,
                completed_at=v.completed_at,
                duration_ms=v.duration_ms,
                data=v.data,
                error=v.error,
            )
            for k, v in result.lanes.items()
        },
        result=result.result,
        checkpoint=_checkpoint_to_response(result.checkpoint) if result.checkpoint else None,
        metrics=PipelineMetricsResponse(
            total_time_ms=result.metrics.total_time_ms,
            tokens_used=result.metrics.tokens_used,
            tokens_input=result.metrics.tokens_input,
            tokens_output=result.metrics.tokens_output,
            llm_calls=result.metrics.llm_calls,
            api_calls=result.metrics.api_calls,
        ),
        error=result.error,
        audit_id=result.audit_id,
    )


def _checkpoint_to_response(checkpoint: Checkpoint) -> CheckpointResponse:
    """Convert Checkpoint to response model."""
    return CheckpointResponse(
        id=checkpoint.id,
        pipeline_id=checkpoint.pipeline_id,
        checkpoint_type=checkpoint.checkpoint_type.value,
        reason=checkpoint.reason,
        decision=checkpoint.decision.value,
        created_at=checkpoint.created_at,
        decided_at=checkpoint.decided_at,
        decided_by=checkpoint.decided_by,
        options=checkpoint.options,
        timeout_minutes=checkpoint.timeout_minutes,
        is_expired=checkpoint.is_expired(),
    )


def _schema_to_response(schema: DataSchema) -> SchemaResponse:
    """Convert DataSchema to response model."""
    return SchemaResponse(
        schema_id=schema.schema_id,
        name=schema.name,
        version=schema.version,
        fields=[
            {
                "name": f.name,
                "type": f.field_type,
                "required": f.required,
                "nullable": f.nullable,
                "min_length": f.min_length,
                "max_length": f.max_length,
                "min_value": f.min_value,
                "max_value": f.max_value,
                "pattern": f.pattern,
                "enum": f.enum_values,
                "default": f.default,
                "description": f.description,
            }
            for f in schema.fields
        ],
        created_at=schema.created_at,
        updated_at=schema.updated_at,
        description=schema.description,
    )


def _validation_to_response(result: ValidationResult) -> ValidationResponse:
    """Convert ValidationResult to response model."""
    return ValidationResponse(
        status=result.status.value,
        errors=[
            ValidationErrorResponse(
                field=e.field,
                message=e.message,
                value=e.value,
                rule=e.rule,
                severity=e.severity,
            )
            for e in result.errors
        ],
        warnings=[
            ValidationErrorResponse(
                field=w.field,
                message=w.message,
                value=w.value,
                rule=w.rule,
                severity=w.severity,
            )
            for w in result.warnings
        ],
        validated_at=result.validated_at,
        metadata=result.metadata,
    )


def _job_to_response(job: ProcessingJob) -> JobResponse:
    """Convert ProcessingJob to response model."""
    return JobResponse(
        job_id=job.job_id,
        source_type=job.source_type.value,
        status=job.status.value,
        created_at=job.created_at,
        started_at=job.started_at,
        completed_at=job.completed_at,
        duration_ms=job.duration_ms,
        input_records=job.input_records,
        output_records=job.output_records,
        error_records=job.error_records,
        validation_result=_validation_to_response(job.validation_result) if job.validation_result else None,
        error=job.error,
    )


def _get_transformation_description(t: TransformationType) -> str:
    """Get description for transformation type."""
    descriptions = {
        TransformationType.MAP: "Map/rename fields from source to target",
        TransformationType.FILTER: "Filter records based on conditions",
        TransformationType.REDUCE: "Reduce records to single value",
        TransformationType.AGGREGATE: "Aggregate records with grouping",
        TransformationType.NORMALIZE: "Normalize field values (trim, case, etc.)",
        TransformationType.DENORMALIZE: "Expand normalized data",
        TransformationType.FLATTEN: "Flatten nested objects",
        TransformationType.NEST: "Nest flat fields into objects",
        TransformationType.MERGE: "Merge with additional data",
        TransformationType.SPLIT: "Split single record into multiple",
        TransformationType.SORT: "Sort records by fields",
        TransformationType.DEDUPLICATE: "Remove duplicate records",
        TransformationType.ENRICH: "Enrich with external data",
        TransformationType.MASK: "Mask sensitive fields",
        TransformationType.ENCRYPT: "Encrypt field values",
        TransformationType.DECRYPT: "Decrypt field values",
    }
    return descriptions.get(t, "Unknown transformation")


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = ["router"]
