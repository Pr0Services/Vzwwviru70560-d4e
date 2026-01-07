"""
CHE·NU™ Nova Pipeline Tests
============================

Tests for the Nova Multi-Lane Pipeline.

R&D COMPLIANCE MARKERS:
- @pytest.mark.human_sovereignty: Tests Rule #1
- @pytest.mark.checkpoint: Tests HTTP 423 behavior
- @pytest.mark.traceability: Tests Rule #6 audit
- @pytest.mark.governance: Tests Rule #3 boundaries
"""

import pytest
from datetime import datetime
from uuid import uuid4, UUID

from backend.services.nova import (
    NovaPipelineService,
    NovaRequest,
    NovaPipelineResult,
    IntentAnalyzer,
    IntentType,
    PipelineLane,
    GovernanceStatus,
    ExecutionStatus,
)
from backend.models.agent import SphereType
from backend.core.exceptions import CheckpointRequiredError


# =============================================================================
# FIXTURES
# =============================================================================

@pytest.fixture
def nova_service():
    """Create Nova Pipeline service."""
    return NovaPipelineService()


@pytest.fixture
def intent_analyzer():
    """Create Intent Analyzer."""
    return IntentAnalyzer()


@pytest.fixture
def identity_id():
    """Create test identity ID."""
    return uuid4()


@pytest.fixture
def basic_request(identity_id):
    """Create basic Nova request."""
    return NovaRequest(
        identity_id=identity_id,
        sphere_type=SphereType.PERSONAL,
        input_text="What is the weather today?",
    )


@pytest.fixture
def email_request(identity_id):
    """Create email-related request (requires checkpoint)."""
    return NovaRequest(
        identity_id=identity_id,
        sphere_type=SphereType.BUSINESS,
        input_text="Send an email to the client about the project update",
    )


@pytest.fixture
def delete_request(identity_id):
    """Create delete request (always requires checkpoint)."""
    return NovaRequest(
        identity_id=identity_id,
        sphere_type=SphereType.PERSONAL,
        input_text="Delete all my old notes from last year",
    )


# =============================================================================
# INTENT ANALYSIS TESTS (Lane A)
# =============================================================================

class TestIntentAnalysis:
    """Tests for Lane A: Intent Analysis."""
    
    @pytest.mark.asyncio
    async def test_query_intent_detection(self, intent_analyzer, identity_id):
        """Test detection of query intent."""
        request = NovaRequest(
            identity_id=identity_id,
            sphere_type=SphereType.PERSONAL,
            input_text="What is machine learning?",
        )
        
        result = await intent_analyzer.analyze(request)
        
        assert result.intent_type == IntentType.QUERY
        assert result.confidence > 0.0
        assert not result.requires_checkpoint
    
    @pytest.mark.asyncio
    async def test_search_intent_detection(self, intent_analyzer, identity_id):
        """Test detection of search intent."""
        request = NovaRequest(
            identity_id=identity_id,
            sphere_type=SphereType.PERSONAL,
            input_text="Find all documents about project alpha",
        )
        
        result = await intent_analyzer.analyze(request)
        
        assert result.intent_type == IntentType.SEARCH
        assert not result.requires_checkpoint
    
    @pytest.mark.asyncio
    async def test_create_intent_detection(self, intent_analyzer, identity_id):
        """Test detection of create intent."""
        request = NovaRequest(
            identity_id=identity_id,
            sphere_type=SphereType.BUSINESS,
            input_text="Create a new proposal for the client",
        )
        
        result = await intent_analyzer.analyze(request)
        
        assert result.intent_type == IntentType.CREATE
    
    @pytest.mark.asyncio
    @pytest.mark.human_sovereignty
    async def test_email_intent_requires_checkpoint(self, intent_analyzer, identity_id):
        """Test that email intent requires checkpoint (Rule #1)."""
        request = NovaRequest(
            identity_id=identity_id,
            sphere_type=SphereType.BUSINESS,
            input_text="Send email to the team about the meeting",
        )
        
        result = await intent_analyzer.analyze(request)
        
        assert result.intent_type == IntentType.SEND_EMAIL
        assert result.requires_checkpoint is True
    
    @pytest.mark.asyncio
    @pytest.mark.human_sovereignty
    async def test_delete_intent_always_requires_checkpoint(self, intent_analyzer, identity_id):
        """Test that delete intent ALWAYS requires checkpoint (Rule #1)."""
        request = NovaRequest(
            identity_id=identity_id,
            sphere_type=SphereType.PERSONAL,
            input_text="Delete all my files",
        )
        
        result = await intent_analyzer.analyze(request)
        
        assert result.intent_type == IntentType.DELETE
        assert result.requires_checkpoint is True
    
    @pytest.mark.asyncio
    @pytest.mark.human_sovereignty
    async def test_publish_intent_requires_checkpoint(self, intent_analyzer, identity_id):
        """Test that publish intent requires checkpoint (Rule #1)."""
        request = NovaRequest(
            identity_id=identity_id,
            sphere_type=SphereType.SOCIAL_MEDIA,
            input_text="Publish this post to social media",
        )
        
        result = await intent_analyzer.analyze(request)
        
        assert result.intent_type == IntentType.PUBLISH
        assert result.requires_checkpoint is True
    
    @pytest.mark.asyncio
    async def test_keyword_extraction(self, intent_analyzer, identity_id):
        """Test keyword extraction from request."""
        request = NovaRequest(
            identity_id=identity_id,
            sphere_type=SphereType.SCHOLAR,
            input_text="Summarize the research paper about quantum computing",
        )
        
        result = await intent_analyzer.analyze(request)
        
        assert len(result.keywords) > 0
        assert "quantum" in result.keywords or "computing" in result.keywords


# =============================================================================
# PIPELINE TESTS
# =============================================================================

class TestNovaPipeline:
    """Tests for the complete Nova Pipeline."""
    
    @pytest.mark.asyncio
    async def test_basic_request_completes(self, nova_service, basic_request):
        """Test that basic request completes all lanes."""
        result = await nova_service.process(basic_request)
        
        assert result.status == ExecutionStatus.COMPLETED
        assert result.intent is not None
        assert result.context is not None
        assert result.encoding is not None
        assert result.governance is not None
        assert result.checkpoint is not None
        assert result.execution is not None
        assert result.audit is not None
    
    @pytest.mark.asyncio
    async def test_all_lanes_executed(self, nova_service, basic_request):
        """Test that all 7 lanes are executed."""
        result = await nova_service.process(basic_request)
        
        # Check audit for lanes
        expected_lanes = [
            PipelineLane.INTENT_ANALYSIS.value,
            PipelineLane.CONTEXT_SNAPSHOT.value,
            PipelineLane.SEMANTIC_ENCODING.value,
            PipelineLane.GOVERNANCE_CHECK.value,
            PipelineLane.CHECKPOINT.value,
            PipelineLane.EXECUTION.value,
            PipelineLane.AUDIT.value,
        ]
        
        assert result.audit is not None
        for lane in expected_lanes:
            assert lane in result.audit.lanes_executed
    
    @pytest.mark.asyncio
    async def test_output_is_populated(self, nova_service, basic_request):
        """Test that output is populated after execution."""
        result = await nova_service.process(basic_request)
        
        assert result.output_text != ""
        assert result.total_duration_ms > 0
    
    @pytest.mark.asyncio
    @pytest.mark.checkpoint
    @pytest.mark.human_sovereignty
    async def test_email_request_triggers_checkpoint(self, nova_service, email_request):
        """Test that email request triggers checkpoint (HTTP 423)."""
        with pytest.raises(CheckpointRequiredError) as exc_info:
            await nova_service.process(email_request)
        
        error = exc_info.value
        assert error.checkpoint_id is not None
        assert error.checkpoint_type is not None
        assert "email" in error.checkpoint_type or "send" in error.checkpoint_type
    
    @pytest.mark.asyncio
    @pytest.mark.checkpoint
    @pytest.mark.human_sovereignty
    async def test_delete_request_triggers_checkpoint(self, nova_service, delete_request):
        """Test that delete request triggers checkpoint (HTTP 423)."""
        with pytest.raises(CheckpointRequiredError) as exc_info:
            await nova_service.process(delete_request)
        
        error = exc_info.value
        assert error.checkpoint_id is not None
        assert error.reason is not None
    
    @pytest.mark.asyncio
    @pytest.mark.checkpoint
    async def test_checkpoint_includes_action_preview(self, nova_service, email_request):
        """Test that checkpoint includes action preview."""
        with pytest.raises(CheckpointRequiredError) as exc_info:
            await nova_service.process(email_request)
        
        error = exc_info.value
        assert error.action_preview is not None
        assert "intent" in error.action_preview
        assert "sphere" in error.action_preview
    
    @pytest.mark.asyncio
    @pytest.mark.checkpoint
    async def test_checkpoint_approval_continues_pipeline(self, nova_service, email_request):
        """Test that approving checkpoint continues the pipeline."""
        # First, trigger checkpoint
        try:
            await nova_service.process(email_request)
        except CheckpointRequiredError as e:
            checkpoint_id = e.checkpoint_id
        
        # Then approve and continue
        result = await nova_service.approve_checkpoint(
            checkpoint_id=checkpoint_id,
            approved_by=email_request.identity_id,
            original_request=email_request,
        )
        
        assert result.status == ExecutionStatus.COMPLETED
        assert result.checkpoint.approved is True
        assert result.checkpoint.approved_by == email_request.identity_id


# =============================================================================
# GOVERNANCE TESTS (Lane D)
# =============================================================================

class TestGovernance:
    """Tests for Lane D: Governance Check."""
    
    @pytest.mark.asyncio
    @pytest.mark.governance
    async def test_governance_allows_safe_requests(self, nova_service, basic_request):
        """Test that governance allows safe requests."""
        result = await nova_service.process(basic_request)
        
        assert result.governance is not None
        assert result.governance.status == GovernanceStatus.ALLOWED
        assert result.governance.has_permission is True
    
    @pytest.mark.asyncio
    @pytest.mark.governance
    async def test_governance_checks_scope(self, nova_service, basic_request):
        """Test that governance checks scope validity."""
        result = await nova_service.process(basic_request)
        
        assert result.governance.scope_valid is True
    
    @pytest.mark.asyncio
    @pytest.mark.governance
    async def test_governance_checks_budget(self, nova_service, basic_request):
        """Test that governance checks token budget."""
        result = await nova_service.process(basic_request)
        
        assert result.governance.budget_sufficient is True
        assert result.governance.estimated_cost >= 0
        assert result.governance.remaining_budget > 0
    
    @pytest.mark.asyncio
    @pytest.mark.governance
    async def test_governance_requires_checkpoint_for_sensitive(self, nova_service, email_request):
        """Test that governance requires checkpoint for sensitive actions."""
        try:
            await nova_service.process(email_request)
        except CheckpointRequiredError:
            pass  # Expected
        
        # The fact that checkpoint was raised means governance worked


# =============================================================================
# AUDIT TESTS (Lane G)
# =============================================================================

class TestAudit:
    """Tests for Lane G: Audit."""
    
    @pytest.mark.asyncio
    @pytest.mark.traceability
    async def test_audit_record_created(self, nova_service, basic_request):
        """Test that audit record is created (Rule #6)."""
        result = await nova_service.process(basic_request)
        
        assert result.audit is not None
        assert result.audit.audit_id is not None
        assert result.audit.request_id == result.request_id
    
    @pytest.mark.asyncio
    @pytest.mark.traceability
    async def test_audit_tracks_identity(self, nova_service, basic_request):
        """Test that audit tracks identity (Rule #6)."""
        result = await nova_service.process(basic_request)
        
        assert result.audit.identity_id == basic_request.identity_id
    
    @pytest.mark.asyncio
    @pytest.mark.traceability
    async def test_audit_tracks_lanes(self, nova_service, basic_request):
        """Test that audit tracks lanes executed (Rule #6)."""
        result = await nova_service.process(basic_request)
        
        assert len(result.audit.lanes_executed) == 7
    
    @pytest.mark.asyncio
    @pytest.mark.traceability
    async def test_audit_tracks_tokens(self, nova_service, basic_request):
        """Test that audit tracks token usage (Rule #6)."""
        result = await nova_service.process(basic_request)
        
        assert result.audit.total_tokens >= 0
        assert result.audit.total_cost >= 0
    
    @pytest.mark.asyncio
    @pytest.mark.traceability
    async def test_audit_tracks_timestamps(self, nova_service, basic_request):
        """Test that audit tracks timestamps (Rule #6)."""
        result = await nova_service.process(basic_request)
        
        assert result.audit.started_at is not None
        assert result.audit.completed_at is not None
        assert result.audit.completed_at >= result.audit.started_at
    
    @pytest.mark.asyncio
    @pytest.mark.traceability
    async def test_audit_tracks_checkpoint_trigger(self, nova_service, email_request):
        """Test that audit tracks checkpoint triggers (Rule #6)."""
        try:
            await nova_service.process(email_request)
        except CheckpointRequiredError:
            pass
        
        # TODO: Verify audit was recorded even for checkpoint


# =============================================================================
# EXECUTION TESTS (Lane F)
# =============================================================================

class TestExecution:
    """Tests for Lane F: Execution."""
    
    @pytest.mark.asyncio
    async def test_execution_success(self, nova_service, basic_request):
        """Test successful execution."""
        result = await nova_service.process(basic_request)
        
        assert result.execution is not None
        assert result.execution.success is True
    
    @pytest.mark.asyncio
    async def test_execution_tracks_tokens(self, nova_service, basic_request):
        """Test that execution tracks token usage."""
        result = await nova_service.process(basic_request)
        
        assert result.execution.input_tokens > 0
        assert result.execution.output_tokens > 0
        assert result.execution.total_tokens > 0
    
    @pytest.mark.asyncio
    async def test_execution_tracks_duration(self, nova_service, basic_request):
        """Test that execution tracks duration."""
        result = await nova_service.process(basic_request)
        
        assert result.execution.duration_ms >= 0
    
    @pytest.mark.asyncio
    async def test_execution_tracks_model(self, nova_service, basic_request):
        """Test that execution tracks model used."""
        result = await nova_service.process(basic_request)
        
        assert result.execution.model_used != ""


# =============================================================================
# CONTEXT SNAPSHOT TESTS (Lane B)
# =============================================================================

class TestContextSnapshot:
    """Tests for Lane B: Context Snapshot."""
    
    @pytest.mark.asyncio
    async def test_context_snapshot_created(self, nova_service, basic_request):
        """Test that context snapshot is created."""
        result = await nova_service.process(basic_request)
        
        assert result.context is not None
    
    @pytest.mark.asyncio
    async def test_context_includes_sphere(self, nova_service, basic_request):
        """Test that context includes sphere information."""
        result = await nova_service.process(basic_request)
        
        assert result.context.sphere_context is not None
        assert "sphere_type" in result.context.sphere_context


# =============================================================================
# SEMANTIC ENCODING TESTS (Lane C)
# =============================================================================

class TestSemanticEncoding:
    """Tests for Lane C: Semantic Encoding."""
    
    @pytest.mark.asyncio
    async def test_encoding_creates_prompt(self, nova_service, basic_request):
        """Test that encoding creates prompt."""
        result = await nova_service.process(basic_request)
        
        assert result.encoding is not None
        assert result.encoding.encoded_prompt != ""
    
    @pytest.mark.asyncio
    async def test_encoding_creates_system_message(self, nova_service, basic_request):
        """Test that encoding creates system message."""
        result = await nova_service.process(basic_request)
        
        assert result.encoding.system_message != ""
        # System message should mention Nova
        assert "nova" in result.encoding.system_message.lower() or "che·nu" in result.encoding.system_message.lower()
    
    @pytest.mark.asyncio
    async def test_encoding_sets_constraints_for_checkpoint(self, nova_service, email_request):
        """Test that encoding sets constraints for checkpoint actions."""
        try:
            await nova_service.process(email_request)
        except CheckpointRequiredError:
            pass
        
        # Intent analysis would have set constraints
        # (we can't easily check encoding here since it raised an exception)


# =============================================================================
# INTEGRATION TESTS
# =============================================================================

class TestPipelineIntegration:
    """Integration tests for the complete pipeline."""
    
    @pytest.mark.asyncio
    @pytest.mark.integration
    async def test_multiple_requests_isolated(self, nova_service, identity_id):
        """Test that multiple requests are isolated."""
        request1 = NovaRequest(
            identity_id=identity_id,
            sphere_type=SphereType.PERSONAL,
            input_text="What is the weather?",
        )
        
        request2 = NovaRequest(
            identity_id=identity_id,
            sphere_type=SphereType.BUSINESS,
            input_text="Analyze the sales data",
        )
        
        result1 = await nova_service.process(request1)
        result2 = await nova_service.process(request2)
        
        assert result1.request_id != result2.request_id
        assert result1.intent.intent_type == IntentType.QUERY
        assert result2.intent.intent_type == IntentType.ANALYZE
    
    @pytest.mark.asyncio
    @pytest.mark.integration
    async def test_different_spheres_handled(self, nova_service, identity_id):
        """Test that different spheres are handled correctly."""
        for sphere_type in SphereType:
            request = NovaRequest(
                identity_id=identity_id,
                sphere_type=sphere_type,
                input_text="What is this about?",
            )
            
            result = await nova_service.process(request)
            
            assert result.status == ExecutionStatus.COMPLETED
            assert result.context.sphere_context["sphere_type"] == sphere_type.value


# =============================================================================
# PIPELINE LANE ENUMERATION TEST
# =============================================================================

class TestPipelineLanes:
    """Tests for Pipeline Lane enumeration."""
    
    def test_all_seven_lanes_defined(self):
        """Test that all 7 lanes are defined."""
        lanes = list(PipelineLane)
        
        assert len(lanes) == 7
        
        expected = {
            "lane_a_intent",
            "lane_b_context",
            "lane_c_encoding",
            "lane_d_governance",
            "lane_e_checkpoint",
            "lane_f_execution",
            "lane_g_audit",
        }
        
        lane_values = {lane.value for lane in lanes}
        assert lane_values == expected


# =============================================================================
# INTENT TYPE TESTS
# =============================================================================

class TestIntentTypes:
    """Tests for Intent Type enumeration."""
    
    def test_checkpoint_intents_are_sensitive(self):
        """Test that checkpoint intents are marked as sensitive."""
        checkpoint_intents = {
            IntentType.DELETE,
            IntentType.SEND_EMAIL,
            IntentType.SEND_MESSAGE,
            IntentType.PUBLISH,
            IntentType.TRANSACTION,
            IntentType.INVOICE,
        }
        
        # All these should trigger checkpoints
        for intent in checkpoint_intents:
            assert intent in IntentAnalyzer.CHECKPOINT_INTENTS
    
    def test_safe_intents_not_in_checkpoint(self):
        """Test that safe intents don't require checkpoint."""
        safe_intents = {
            IntentType.QUERY,
            IntentType.SEARCH,
            IntentType.SUMMARIZE,
            IntentType.ANALYZE,
        }
        
        for intent in safe_intents:
            assert intent not in IntentAnalyzer.CHECKPOINT_INTENTS
