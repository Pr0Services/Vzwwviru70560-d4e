"""
CHE·NU™ V72 - Pipeline Integration Tests
Comprehensive test suite for Nova Pipeline and Data Processing services.

Tests cover:
- Pipeline execution flows
- Checkpoint approval/rejection
- Data transformations
- Schema validation
- ETL jobs

Principle: GOVERNANCE > EXECUTION
"""

import pytest
import asyncio
from datetime import datetime, timedelta
from uuid import uuid4
import json

from ..services.nova_pipeline_service import (
    NovaPipelineService,
    nova_pipeline_service,
    PipelineStatus,
    LaneStatus,
    CheckpointType,
    CheckpointDecision,
    LaneType,
    PipelineContext,
    Checkpoint,
)
from ..services.data_processing_service import (
    DataProcessingService,
    data_processing_service,
    DataSourceType,
    TransformationType,
    ValidationLevel,
    ValidationStatus,
    ProcessingStatus,
)


# =============================================================================
# FIXTURES
# =============================================================================

@pytest.fixture
def pipeline_service():
    """Create a fresh pipeline service for testing."""
    return NovaPipelineService()


@pytest.fixture
def data_service():
    """Create a fresh data processing service for testing."""
    return DataProcessingService()


@pytest.fixture
def sample_user():
    """Sample user data."""
    return {
        "user_id": str(uuid4()),
        "identity_id": str(uuid4()),
    }


@pytest.fixture
def sample_data():
    """Sample data records for testing."""
    return [
        {"name": "John Doe", "email": "john@example.com", "age": 30, "active": True},
        {"name": "Jane Smith", "email": "jane@example.com", "age": 25, "active": True},
        {"name": "Bob Wilson", "email": "bob@example.com", "age": 35, "active": False},
    ]


# =============================================================================
# NOVA PIPELINE TESTS
# =============================================================================

class TestNovaPipeline:
    """Tests for Nova Pipeline service."""

    @pytest.mark.asyncio
    async def test_simple_query_execution(self, pipeline_service, sample_user):
        """Test simple query executes all lanes successfully."""
        result = await pipeline_service.execute_pipeline(
            query="Get all my tasks",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        assert result is not None
        assert result.pipeline_id is not None
        assert result.status == PipelineStatus.COMPLETED
        assert len(result.lanes) == 7  # All 7 lanes
        assert result.error is None

    @pytest.mark.asyncio
    async def test_all_lanes_complete(self, pipeline_service, sample_user):
        """Test all lanes complete successfully."""
        result = await pipeline_service.execute_pipeline(
            query="Show my recent documents",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        # Check each lane
        lane_types = [
            LaneType.LANE_A_INTENT,
            LaneType.LANE_B_CONTEXT,
            LaneType.LANE_C_ENCODING,
            LaneType.LANE_D_GOVERNANCE,
            LaneType.LANE_E_CHECKPOINT,
            LaneType.LANE_F_EXECUTION,
            LaneType.LANE_G_AUDIT,
        ]

        for lane_type in lane_types:
            assert lane_type.value in result.lanes
            lane = result.lanes[lane_type.value]
            assert lane.status in [LaneStatus.COMPLETED, LaneStatus.SKIPPED]

    @pytest.mark.asyncio
    async def test_intent_analysis_read(self, pipeline_service, sample_user):
        """Test intent analysis for read operations."""
        result = await pipeline_service.execute_pipeline(
            query="Get all users from the database",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        intent_lane = result.lanes.get(LaneType.LANE_A_INTENT.value)
        assert intent_lane is not None
        assert intent_lane.data.get("intent_type") == "read"
        assert intent_lane.data.get("is_mutation") is False

    @pytest.mark.asyncio
    async def test_intent_analysis_create(self, pipeline_service, sample_user):
        """Test intent analysis for create operations."""
        result = await pipeline_service.execute_pipeline(
            query="Create a new task for tomorrow",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        intent_lane = result.lanes.get(LaneType.LANE_A_INTENT.value)
        assert intent_lane is not None
        assert intent_lane.data.get("intent_type") == "create"
        assert intent_lane.data.get("is_mutation") is True

    @pytest.mark.asyncio
    async def test_intent_analysis_delete_requires_checkpoint(self, pipeline_service, sample_user):
        """Test delete operations trigger checkpoint."""
        result = await pipeline_service.execute_pipeline(
            query="Delete all my old files",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        # Delete operations should trigger checkpoint
        assert result.status == PipelineStatus.CHECKPOINT_PENDING
        assert result.checkpoint is not None
        assert result.checkpoint.decision == CheckpointDecision.PENDING

    @pytest.mark.asyncio
    async def test_sensitive_query_checkpoint(self, pipeline_service, sample_user):
        """Test sensitive queries trigger checkpoint."""
        result = await pipeline_service.execute_pipeline(
            query="Access my private medical records",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        intent_lane = result.lanes.get(LaneType.LANE_A_INTENT.value)
        assert intent_lane.data.get("is_sensitive") is True

    @pytest.mark.asyncio
    async def test_context_snapshot_creation(self, pipeline_service, sample_user):
        """Test context snapshot is created correctly."""
        result = await pipeline_service.execute_pipeline(
            query="Show my profile",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        context_lane = result.lanes.get(LaneType.LANE_B_CONTEXT.value)
        assert context_lane is not None
        assert "snapshot_id" in context_lane.data
        assert "snapshot_hash" in context_lane.data
        assert context_lane.data.get("user_id") == sample_user["user_id"]

    @pytest.mark.asyncio
    async def test_semantic_encoding(self, pipeline_service, sample_user):
        """Test semantic encoding is performed."""
        result = await pipeline_service.execute_pipeline(
            query="Analyze my business data and create a report",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        encoding_lane = result.lanes.get(LaneType.LANE_C_ENCODING.value)
        assert encoding_lane is not None
        assert "encoding_id" in encoding_lane.data
        assert "query_tokens" in encoding_lane.data
        assert "semantic_tags" in encoding_lane.data

    @pytest.mark.asyncio
    async def test_governance_checks(self, pipeline_service, sample_user):
        """Test governance checks are performed."""
        result = await pipeline_service.execute_pipeline(
            query="Show my tasks",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        governance_lane = result.lanes.get(LaneType.LANE_D_GOVERNANCE.value)
        assert governance_lane is not None
        assert "checks" in governance_lane.data
        assert len(governance_lane.data["checks"]) >= 5  # At least 5 checks

    @pytest.mark.asyncio
    async def test_audit_logging(self, pipeline_service, sample_user):
        """Test audit logging is performed."""
        result = await pipeline_service.execute_pipeline(
            query="Get my recent activity",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        audit_lane = result.lanes.get(LaneType.LANE_G_AUDIT.value)
        assert audit_lane is not None
        assert "audit_id" in audit_lane.data
        assert audit_lane.data.get("logged") is True

        # Check audit log
        audit_log = pipeline_service.get_audit_log(sample_user["user_id"])
        assert len(audit_log) > 0
        assert audit_log[-1]["pipeline_id"] == result.pipeline_id

    @pytest.mark.asyncio
    async def test_metrics_calculation(self, pipeline_service, sample_user):
        """Test metrics are calculated correctly."""
        result = await pipeline_service.execute_pipeline(
            query="Show all data",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        assert result.metrics is not None
        assert result.metrics.total_time_ms >= 0
        assert result.metrics.tokens_used >= 0
        assert result.metrics.api_calls >= 0

    @pytest.mark.asyncio
    async def test_checkpoint_approval(self, pipeline_service, sample_user):
        """Test checkpoint approval continues pipeline."""
        # Execute query that triggers checkpoint
        result = await pipeline_service.execute_pipeline(
            query="Delete my account data",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        assert result.status == PipelineStatus.CHECKPOINT_PENDING
        checkpoint_id = result.checkpoint.id

        # Approve checkpoint
        approved_result = await pipeline_service.approve_checkpoint(
            checkpoint_id=checkpoint_id,
            user_id=sample_user["user_id"],
        )

        assert approved_result.status == PipelineStatus.COMPLETED
        assert approved_result.checkpoint.decision == CheckpointDecision.APPROVED

    @pytest.mark.asyncio
    async def test_checkpoint_rejection(self, pipeline_service, sample_user):
        """Test checkpoint rejection cancels pipeline."""
        # Execute query that triggers checkpoint
        result = await pipeline_service.execute_pipeline(
            query="Remove all private data",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        assert result.status == PipelineStatus.CHECKPOINT_PENDING
        checkpoint_id = result.checkpoint.id

        # Reject checkpoint
        rejected_result = await pipeline_service.reject_checkpoint(
            checkpoint_id=checkpoint_id,
            user_id=sample_user["user_id"],
            reason="Changed my mind",
        )

        assert rejected_result.status == PipelineStatus.CHECKPOINT_REJECTED
        assert rejected_result.checkpoint.decision == CheckpointDecision.REJECTED

    @pytest.mark.asyncio
    async def test_get_pending_checkpoints(self, pipeline_service, sample_user):
        """Test getting pending checkpoints."""
        # Create checkpoint
        await pipeline_service.execute_pipeline(
            query="Delete all files permanently",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        pending = pipeline_service.get_pending_checkpoints(sample_user["user_id"])
        assert len(pending) > 0
        assert all(cp.decision == CheckpointDecision.PENDING for cp in pending)

    @pytest.mark.asyncio
    async def test_pipeline_status_retrieval(self, pipeline_service, sample_user):
        """Test pipeline status can be retrieved."""
        result = await pipeline_service.execute_pipeline(
            query="Show dashboard",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        status = pipeline_service.get_pipeline_status(result.pipeline_id)
        assert status is not None
        assert status.pipeline_id == result.pipeline_id
        assert status.status == result.status

    @pytest.mark.asyncio
    async def test_custom_executor_registration(self, pipeline_service, sample_user):
        """Test custom executor can be registered."""
        custom_result = {"custom": True, "data": "test"}

        async def custom_executor(context):
            return custom_result

        pipeline_service.register_executor("analyze", custom_executor)

        result = await pipeline_service.execute_pipeline(
            query="Analyze my data trends",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        assert result.status == PipelineStatus.COMPLETED
        assert result.result == custom_result


# =============================================================================
# DATA PROCESSING TESTS
# =============================================================================

class TestDataProcessing:
    """Tests for Data Processing service."""

    def test_create_schema(self, data_service):
        """Test schema creation."""
        schema = data_service.create_schema(
            name="TestSchema",
            version="1.0",
            fields=[
                {"name": "id", "type": "string", "required": True},
                {"name": "name", "type": "string", "required": True},
                {"name": "email", "type": "email", "required": True},
                {"name": "age", "type": "number", "min_value": 0, "max_value": 150},
            ],
            description="Test schema for validation",
        )

        assert schema is not None
        assert schema.schema_id is not None
        assert schema.name == "TestSchema"
        assert len(schema.fields) == 4

    def test_list_schemas(self, data_service):
        """Test schema listing."""
        # Create some schemas
        data_service.create_schema("Schema1", "1.0", [{"name": "id", "type": "string"}])
        data_service.create_schema("Schema2", "1.0", [{"name": "id", "type": "string"}])

        schemas = data_service.list_schemas()
        assert len(schemas) >= 2

    def test_validate_valid_data(self, data_service, sample_data):
        """Test validation of valid data."""
        schema = data_service.create_schema(
            name="UserSchema",
            version="1.0",
            fields=[
                {"name": "name", "type": "string", "required": True},
                {"name": "email", "type": "email", "required": True},
                {"name": "age", "type": "number", "min_value": 0},
                {"name": "active", "type": "boolean"},
            ],
        )

        result = data_service.validate_data(sample_data, schema.schema_id)

        assert result.status == ValidationStatus.VALID
        assert len(result.errors) == 0

    def test_validate_invalid_data(self, data_service):
        """Test validation of invalid data."""
        schema = data_service.create_schema(
            name="StrictSchema",
            version="1.0",
            fields=[
                {"name": "email", "type": "email", "required": True},
                {"name": "age", "type": "number", "min_value": 18},
            ],
        )

        invalid_data = [
            {"email": "not-an-email", "age": 15},  # Invalid email and age too low
            {"email": "valid@email.com", "age": "not-a-number"},  # Invalid age type
        ]

        result = data_service.validate_data(invalid_data, schema.schema_id)

        assert result.status == ValidationStatus.INVALID
        assert len(result.errors) > 0

    def test_validate_missing_required_field(self, data_service):
        """Test validation catches missing required fields."""
        schema = data_service.create_schema(
            name="RequiredFieldSchema",
            version="1.0",
            fields=[
                {"name": "id", "type": "string", "required": True},
                {"name": "name", "type": "string", "required": True},
            ],
        )

        data = [
            {"id": "1"},  # Missing name
            {"name": "Test"},  # Missing id
        ]

        result = data_service.validate_data(data, schema.schema_id)

        assert result.status == ValidationStatus.INVALID
        assert any("required" in e.rule for e in result.errors)

    def test_validate_pattern_matching(self, data_service):
        """Test pattern validation."""
        schema = data_service.create_schema(
            name="PatternSchema",
            version="1.0",
            fields=[
                {"name": "phone", "type": "string", "pattern": r"^\d{3}-\d{3}-\d{4}$"},
            ],
        )

        valid_data = [{"phone": "123-456-7890"}]
        invalid_data = [{"phone": "1234567890"}]

        valid_result = data_service.validate_data(valid_data, schema.schema_id)
        invalid_result = data_service.validate_data(invalid_data, schema.schema_id)

        assert valid_result.status == ValidationStatus.VALID
        assert invalid_result.status == ValidationStatus.INVALID

    def test_validate_enum_values(self, data_service):
        """Test enum validation."""
        schema = data_service.create_schema(
            name="EnumSchema",
            version="1.0",
            fields=[
                {"name": "status", "type": "string", "enum": ["active", "inactive", "pending"]},
            ],
        )

        valid_data = [{"status": "active"}]
        invalid_data = [{"status": "unknown"}]

        valid_result = data_service.validate_data(valid_data, schema.schema_id)
        invalid_result = data_service.validate_data(invalid_data, schema.schema_id)

        assert valid_result.status == ValidationStatus.VALID
        assert invalid_result.status == ValidationStatus.INVALID

    @pytest.mark.asyncio
    async def test_transform_map(self, data_service, sample_data):
        """Test map transformation."""
        transformations = [
            {
                "type": "map",
                "config": {
                    "mapping": {
                        "full_name": "name",
                        "email_address": "email",
                        "years": "age",
                    }
                }
            }
        ]

        result, steps = await data_service.transform(sample_data, transformations)

        assert len(result) == len(sample_data)
        assert all("full_name" in r for r in result)
        assert all("email_address" in r for r in result)
        assert len(steps) == 1
        assert steps[0].transformation_type == TransformationType.MAP

    @pytest.mark.asyncio
    async def test_transform_filter(self, data_service, sample_data):
        """Test filter transformation."""
        transformations = [
            {
                "type": "filter",
                "config": {
                    "conditions": [
                        {"field": "active", "operator": "eq", "value": True}
                    ]
                }
            }
        ]

        result, _ = await data_service.transform(sample_data, transformations)

        assert len(result) == 2  # Only active records
        assert all(r["active"] is True for r in result)

    @pytest.mark.asyncio
    async def test_transform_normalize(self, data_service):
        """Test normalize transformation."""
        data = [
            {"name": "  John Doe  ", "email": "JOHN@EXAMPLE.COM"},
            {"name": "  Jane Smith  ", "email": "JANE@EXAMPLE.COM"},
        ]

        transformations = [
            {
                "type": "normalize",
                "config": {
                    "normalizations": {
                        "name": {"type": "trim"},
                        "email": {"type": "lowercase"},
                    }
                }
            }
        ]

        result, _ = await data_service.transform(data, transformations)

        assert result[0]["name"] == "John Doe"
        assert result[0]["email"] == "john@example.com"

    @pytest.mark.asyncio
    async def test_transform_deduplicate(self, data_service):
        """Test deduplicate transformation."""
        data = [
            {"id": "1", "name": "John"},
            {"id": "1", "name": "John Duplicate"},
            {"id": "2", "name": "Jane"},
        ]

        transformations = [
            {
                "type": "deduplicate",
                "config": {"key_fields": ["id"]}
            }
        ]

        result, _ = await data_service.transform(data, transformations)

        assert len(result) == 2
        assert result[0]["name"] == "John"  # First occurrence kept

    @pytest.mark.asyncio
    async def test_transform_sort(self, data_service, sample_data):
        """Test sort transformation."""
        transformations = [
            {
                "type": "sort",
                "config": {
                    "fields": [{"field": "age", "order": "asc"}]
                }
            }
        ]

        result, _ = await data_service.transform(sample_data, transformations)

        ages = [r["age"] for r in result]
        assert ages == sorted(ages)

    @pytest.mark.asyncio
    async def test_transform_mask(self, data_service, sample_data):
        """Test mask transformation for sensitive data."""
        transformations = [
            {
                "type": "mask",
                "config": {
                    "fields": [
                        {"field": "email", "type": "email"}
                    ]
                }
            }
        ]

        result, _ = await data_service.transform(sample_data, transformations)

        # Email should be masked but keep domain
        assert "@example.com" in result[0]["email"]
        assert "*" in result[0]["email"]

    @pytest.mark.asyncio
    async def test_transform_aggregate(self, data_service):
        """Test aggregate transformation."""
        data = [
            {"category": "A", "value": 10},
            {"category": "A", "value": 20},
            {"category": "B", "value": 30},
        ]

        transformations = [
            {
                "type": "aggregate",
                "config": {
                    "group_by": ["category"],
                    "aggregations": [
                        {"field": "value", "function": "sum", "alias": "total"},
                        {"field": "value", "function": "count", "alias": "count"},
                    ]
                }
            }
        ]

        result, _ = await data_service.transform(data, transformations)

        assert len(result) == 2
        cat_a = next(r for r in result if r["category"] == "A")
        assert cat_a["total"] == 30
        assert cat_a["count"] == 2

    @pytest.mark.asyncio
    async def test_transform_flatten(self, data_service):
        """Test flatten transformation."""
        data = [
            {
                "name": "John",
                "address": {
                    "city": "New York",
                    "country": "USA"
                }
            }
        ]

        transformations = [
            {
                "type": "flatten",
                "config": {"separator": "."}
            }
        ]

        result, _ = await data_service.transform(data, transformations)

        assert "address.city" in result[0]
        assert "address.country" in result[0]
        assert result[0]["address.city"] == "New York"

    @pytest.mark.asyncio
    async def test_create_processing_job(self, data_service, sample_data):
        """Test processing job creation and execution."""
        schema = data_service.create_schema(
            name="JobSchema",
            version="1.0",
            fields=[
                {"name": "name", "type": "string", "required": True},
                {"name": "email", "type": "email", "required": True},
            ],
        )

        job = await data_service.create_job(
            source_type=DataSourceType.MEMORY,
            data=sample_data,
            transformations=[
                {"type": "normalize", "config": {"normalizations": {"name": {"type": "trim"}}}}
            ],
            schema_id=schema.schema_id,
        )

        assert job is not None
        assert job.job_id is not None
        assert job.status == ProcessingStatus.COMPLETED
        assert job.input_records == len(sample_data)
        assert job.output_records == len(sample_data)

    @pytest.mark.asyncio
    async def test_job_with_validation_errors(self, data_service):
        """Test job with validation errors."""
        schema = data_service.create_schema(
            name="StrictJobSchema",
            version="1.0",
            fields=[
                {"name": "email", "type": "email", "required": True},
            ],
        )

        invalid_data = [
            {"email": "not-an-email"},
            {"email": "also-invalid"},
        ]

        job = await data_service.create_job(
            source_type=DataSourceType.MEMORY,
            data=invalid_data,
            schema_id=schema.schema_id,
        )

        assert job.status == ProcessingStatus.COMPLETED
        assert job.validation_result is not None
        assert job.validation_result.status == ValidationStatus.INVALID
        assert job.error_records > 0

    def test_list_jobs(self, data_service):
        """Test job listing."""
        jobs = data_service.list_jobs()
        assert isinstance(jobs, list)

    def test_generate_sample_data(self, data_service):
        """Test sample data generation."""
        schema = data_service.create_schema(
            name="SampleSchema",
            version="1.0",
            fields=[
                {"name": "id", "type": "string"},
                {"name": "count", "type": "number"},
                {"name": "active", "type": "boolean"},
            ],
        )

        samples = data_service.generate_sample_data(schema.schema_id, count=5)

        assert len(samples) == 5
        assert all("id" in s for s in samples)
        assert all("count" in s for s in samples)
        assert all("active" in s for s in samples)

    def test_calculate_data_quality(self, data_service, sample_data):
        """Test data quality calculation."""
        schema = data_service.create_schema(
            name="QualitySchema",
            version="1.0",
            fields=[
                {"name": "name", "type": "string", "required": True},
                {"name": "email", "type": "email", "required": True},
                {"name": "age", "type": "number"},
                {"name": "active", "type": "boolean"},
            ],
        )

        quality = data_service.calculate_data_quality(sample_data, schema.schema_id)

        assert "total_records" in quality
        assert quality["total_records"] == len(sample_data)
        assert "completeness" in quality
        assert 0 <= quality["completeness"] <= 1
        assert "validity" in quality
        assert "fields" in quality


# =============================================================================
# INTEGRATION TESTS
# =============================================================================

class TestPipelineDataIntegration:
    """Integration tests combining pipeline and data processing."""

    @pytest.mark.asyncio
    async def test_pipeline_with_data_validation(
        self, pipeline_service, data_service, sample_user, sample_data
    ):
        """Test pipeline execution followed by data validation."""
        # Execute pipeline
        pipeline_result = await pipeline_service.execute_pipeline(
            query="Validate my user data",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        assert pipeline_result.status == PipelineStatus.COMPLETED

        # Create schema and validate
        schema = data_service.create_schema(
            name="IntegrationSchema",
            version="1.0",
            fields=[
                {"name": "name", "type": "string", "required": True},
                {"name": "email", "type": "email", "required": True},
            ],
        )

        validation = data_service.validate_data(sample_data, schema.schema_id)
        assert validation.status == ValidationStatus.VALID

    @pytest.mark.asyncio
    async def test_full_etl_flow(self, data_service, sample_data):
        """Test complete ETL flow: Extract, Transform, Validate, Load."""
        # Create schema
        schema = data_service.create_schema(
            name="ETLSchema",
            version="1.0",
            fields=[
                {"name": "full_name", "type": "string", "required": True},
                {"name": "contact_email", "type": "email", "required": True},
            ],
        )

        # Define transformations
        transformations = [
            {
                "type": "map",
                "config": {
                    "mapping": {
                        "full_name": "name",
                        "contact_email": "email",
                    }
                }
            },
            {
                "type": "normalize",
                "config": {
                    "normalizations": {
                        "full_name": {"type": "trim"},
                        "contact_email": {"type": "lowercase"},
                    }
                }
            },
        ]

        # Execute job
        job = await data_service.create_job(
            source_type=DataSourceType.MEMORY,
            data=sample_data,
            transformations=transformations,
            schema_id=schema.schema_id,
        )

        assert job.status == ProcessingStatus.COMPLETED
        assert job.input_records == len(sample_data)
        assert job.output_records == len(sample_data)
        assert len(job.transformation_steps) == 2


# =============================================================================
# PERFORMANCE TESTS
# =============================================================================

class TestPerformance:
    """Performance tests."""

    @pytest.mark.asyncio
    async def test_pipeline_performance(self, pipeline_service, sample_user):
        """Test pipeline execution performance."""
        import time

        start = time.time()
        result = await pipeline_service.execute_pipeline(
            query="Get all my data",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )
        duration = (time.time() - start) * 1000  # ms

        assert result.status == PipelineStatus.COMPLETED
        assert duration < 5000  # Should complete in under 5 seconds
        assert result.metrics.total_time_ms < 5000

    @pytest.mark.asyncio
    async def test_large_data_transformation(self, data_service):
        """Test transformation of large dataset."""
        # Generate large dataset
        large_data = [
            {"id": str(i), "name": f"User {i}", "value": i}
            for i in range(1000)
        ]

        transformations = [
            {"type": "filter", "config": {"conditions": [{"field": "value", "operator": "gt", "value": 500}]}},
            {"type": "sort", "config": {"fields": [{"field": "value", "order": "desc"}]}},
        ]

        import time
        start = time.time()
        result, _ = await data_service.transform(large_data, transformations)
        duration = time.time() - start

        assert len(result) == 499  # Values > 500
        assert duration < 5  # Should complete in under 5 seconds

    def test_large_data_validation(self, data_service):
        """Test validation of large dataset."""
        schema = data_service.create_schema(
            name="LargeDataSchema",
            version="1.0",
            fields=[
                {"name": "id", "type": "string", "required": True},
                {"name": "email", "type": "email", "required": True},
            ],
        )

        large_data = [
            {"id": str(i), "email": f"user{i}@example.com"}
            for i in range(1000)
        ]

        import time
        start = time.time()
        result = data_service.validate_data(large_data, schema.schema_id)
        duration = time.time() - start

        assert result.status == ValidationStatus.VALID
        assert duration < 5  # Should complete in under 5 seconds


# =============================================================================
# EDGE CASE TESTS
# =============================================================================

class TestEdgeCases:
    """Edge case tests."""

    @pytest.mark.asyncio
    async def test_empty_query(self, pipeline_service, sample_user):
        """Test handling of empty query."""
        result = await pipeline_service.execute_pipeline(
            query="",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        # Should still complete but with general intent
        assert result is not None

    def test_empty_data_validation(self, data_service):
        """Test validation of empty data."""
        schema = data_service.create_schema(
            name="EmptySchema",
            version="1.0",
            fields=[{"name": "id", "type": "string"}],
        )

        result = data_service.validate_data([], schema.schema_id)
        assert result.status == ValidationStatus.VALID

    def test_schema_not_found(self, data_service):
        """Test validation with non-existent schema."""
        result = data_service.validate_data(
            [{"id": "1"}],
            "non-existent-schema-id",
        )

        assert result.status == ValidationStatus.INVALID
        assert any("not found" in e.message.lower() for e in result.errors)

    @pytest.mark.asyncio
    async def test_checkpoint_already_decided(self, pipeline_service, sample_user):
        """Test approving already decided checkpoint."""
        # Create and approve checkpoint
        result = await pipeline_service.execute_pipeline(
            query="Delete everything",
            user_id=sample_user["user_id"],
            identity_id=sample_user["identity_id"],
        )

        checkpoint_id = result.checkpoint.id
        await pipeline_service.approve_checkpoint(checkpoint_id, sample_user["user_id"])

        # Try to approve again
        with pytest.raises(ValueError, match="already decided"):
            await pipeline_service.approve_checkpoint(checkpoint_id, sample_user["user_id"])

    @pytest.mark.asyncio
    async def test_checkpoint_not_found(self, pipeline_service, sample_user):
        """Test approving non-existent checkpoint."""
        with pytest.raises(ValueError, match="not found"):
            await pipeline_service.approve_checkpoint(
                "non-existent-checkpoint",
                sample_user["user_id"],
            )


# =============================================================================
# RUN TESTS
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
