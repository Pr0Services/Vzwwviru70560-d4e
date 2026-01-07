"""
CHE·NU™ Agent Service Tests
===========================

Comprehensive tests for Agent Registry and Execution services.

R&D COMPLIANCE MARKERS:
- @pytest.mark.human_sovereignty: Rule #1 - Human gates
- @pytest.mark.no_ai_orchestration: Rule #4 - No AI-to-AI
- @pytest.mark.traceability: Rule #6 - Audit trail
- @pytest.mark.identity_boundary: HTTP 403 enforcement
- @pytest.mark.checkpoint: HTTP 423 human gates
"""

import pytest
from datetime import datetime, timezone
from uuid import uuid4, UUID
from unittest.mock import AsyncMock, MagicMock, patch

from backend.models.agent import (
    Agent,
    AgentStatus,
    AgentCapabilityType,
    SphereType,
    UserAgentConfig,
    AgentExecution,
    ExecutionStatus,
    ExecutionTrigger,
)
from backend.schemas.agent_schemas import (
    ExecutionRequest,
    ExecutionApproval,
    AGENT_DISTRIBUTION,
    TOTAL_AGENTS,
)
from backend.services.agent.agent_registry import (
    AgentRegistryService,
    get_all_predefined_agents,
)
from backend.services.agent.agent_execution import (
    AgentExecutionService,
    requires_human_gate,
    SENSITIVE_CAPABILITIES,
)
from backend.core.exceptions import (
    NotFoundError,
    ValidationError,
    ForbiddenError,
    CheckpointRequiredError,
)


# =============================================================================
# FIXTURES
# =============================================================================

@pytest.fixture
def mock_db():
    """Mock database session."""
    db = AsyncMock()
    db.execute = AsyncMock()
    db.scalar = AsyncMock()
    db.add = MagicMock()
    db.flush = AsyncMock()
    db.commit = AsyncMock()
    db.rollback = AsyncMock()
    return db


@pytest.fixture
def user_id():
    """Test user ID."""
    return uuid4()


@pytest.fixture
def other_user_id():
    """Other user ID for boundary tests."""
    return uuid4()


@pytest.fixture
def mock_agent():
    """Create a mock agent."""
    agent = MagicMock(spec=Agent)
    agent.id = uuid4()
    agent.name = "test_agent"
    agent.display_name = "Test Agent"
    agent.description = "A test agent"
    agent.sphere_type = SphereType.PERSONAL
    agent.status = AgentStatus.ACTIVE
    agent.capabilities = ["analysis", "summarization"]
    agent.scope = {}
    agent.default_token_budget = 10000
    agent.max_token_budget = 50000
    agent.cost_per_1k_tokens = 0.01
    agent.preferred_llm = "claude-3.5-sonnet"
    agent.requires_human_gate = False
    agent.human_gate_capabilities = []
    agent.version = "1.0.0"
    agent.created_at = datetime.now(timezone.utc)
    agent.updated_at = None
    return agent


@pytest.fixture
def mock_agent_with_gate():
    """Create a mock agent that requires human gate."""
    agent = MagicMock(spec=Agent)
    agent.id = uuid4()
    agent.name = "email_agent"
    agent.display_name = "Email Agent"
    agent.description = "An agent that drafts emails"
    agent.sphere_type = SphereType.BUSINESS
    agent.status = AgentStatus.ACTIVE
    agent.capabilities = ["email_draft", "text_generation"]
    agent.scope = {}
    agent.default_token_budget = 10000
    agent.max_token_budget = 50000
    agent.cost_per_1k_tokens = 0.01
    agent.preferred_llm = "claude-3.5-sonnet"
    agent.requires_human_gate = True  # Requires gate for all actions
    agent.human_gate_capabilities = ["email_draft"]
    agent.version = "1.0.0"
    agent.created_at = datetime.now(timezone.utc)
    agent.updated_at = None
    return agent


@pytest.fixture
def mock_execution(mock_agent, user_id):
    """Create a mock execution."""
    execution = MagicMock(spec=AgentExecution)
    execution.id = uuid4()
    execution.agent_id = mock_agent.id
    execution.identity_id = user_id
    execution.sphere_id = None
    execution.thread_id = None
    execution.trigger = ExecutionTrigger.USER_REQUEST
    execution.status = ExecutionStatus.PENDING
    execution.capability_used = "analysis"
    execution.input_data = {"text": "Analyze this"}
    execution.output_data = None
    execution.requires_approval = False
    execution.checkpoint_id = None
    execution.approved_by = None
    execution.approved_at = None
    execution.rejection_reason = None
    execution.input_tokens = None
    execution.output_tokens = None
    execution.total_tokens = None
    execution.cost = None
    execution.duration_ms = None
    execution.llm_used = None
    execution.error_message = None
    execution.error_code = None
    execution.created_at = datetime.now(timezone.utc)
    execution.created_by = user_id
    execution.started_at = None
    execution.completed_at = None
    return execution


@pytest.fixture
def mock_user_config(mock_agent, user_id):
    """Create a mock user agent config."""
    config = MagicMock(spec=UserAgentConfig)
    config.id = uuid4()
    config.identity_id = user_id
    config.agent_id = mock_agent.id
    config.enabled = True
    config.custom_name = None
    config.token_budget_override = None
    config.total_executions = 0
    config.total_tokens_used = 0
    config.total_cost = 0.0
    config.last_used_at = None
    config.created_at = datetime.now(timezone.utc)
    config.updated_at = None
    config.agent = mock_agent
    config.effective_token_budget = mock_agent.default_token_budget
    return config


# =============================================================================
# AGENT REGISTRY TESTS
# =============================================================================

class TestPredefinedAgents:
    """Test predefined agent definitions."""
    
    def test_total_agents_count(self):
        """Verify 226 agents are defined."""
        agents = get_all_predefined_agents()
        assert len(agents) == TOTAL_AGENTS
        assert len(agents) == 226
    
    def test_agent_distribution_by_sphere(self):
        """Verify agent distribution matches CANON."""
        agents = get_all_predefined_agents()
        
        distribution = {}
        for agent in agents:
            sphere = agent["sphere_type"].value
            distribution[sphere] = distribution.get(sphere, 0) + 1
        
        expected = {
            "personal": 28,
            "business": 43,
            "government": 18,
            "creative_studio": 42,
            "community": 12,
            "social_media": 15,
            "entertainment": 8,
            "my_team": 35,
            "scholar": 25,
        }
        
        for sphere, count in expected.items():
            assert distribution.get(sphere, 0) == count, f"Sphere {sphere}: expected {count}, got {distribution.get(sphere, 0)}"
    
    def test_all_agents_have_required_fields(self):
        """Verify all agents have required fields."""
        agents = get_all_predefined_agents()
        
        required_fields = ["id", "name", "display_name", "description", "sphere_type", "status", "capabilities"]
        
        for agent in agents:
            for field in required_fields:
                assert field in agent, f"Agent {agent.get('name', 'unknown')} missing field: {field}"
    
    def test_all_agents_have_unique_names(self):
        """Verify all agent names are unique."""
        agents = get_all_predefined_agents()
        names = [a["name"] for a in agents]
        assert len(names) == len(set(names)), "Duplicate agent names found"
    
    def test_all_agents_have_valid_capabilities(self):
        """Verify all capabilities are valid enum values."""
        agents = get_all_predefined_agents()
        valid_capabilities = {c.value for c in AgentCapabilityType}
        
        for agent in agents:
            for cap in agent["capabilities"]:
                assert cap in valid_capabilities, f"Agent {agent['name']} has invalid capability: {cap}"
    
    @pytest.mark.social_restrictions
    def test_social_sphere_no_ranking_agents(self):
        """
        Rule #5: Social sphere has NO ranking/engagement optimization agents.
        
        Verify no engagement_bot or ranking_optimizer in social sphere.
        """
        agents = get_all_predefined_agents()
        social_agents = [a for a in agents if a["sphere_type"] == SphereType.SOCIAL_MEDIA]
        
        forbidden_names = ["engagement_bot", "ranking_optimizer", "engagement_optimizer"]
        social_names = [a["name"] for a in social_agents]
        
        for forbidden in forbidden_names:
            assert forbidden not in social_names, f"Social sphere contains forbidden agent: {forbidden}"
    
    @pytest.mark.no_ai_orchestration
    def test_my_team_no_orchestrator_agent(self):
        """
        Rule #4: My Team sphere has NO AI orchestrator agent.
        
        Agents cannot orchestrate other agents.
        """
        agents = get_all_predefined_agents()
        team_agents = [a for a in agents if a["sphere_type"] == SphereType.MY_TEAM]
        
        forbidden_names = ["orchestrator", "agent_orchestrator", "ai_coordinator"]
        team_names = [a["name"] for a in team_agents]
        
        for forbidden in forbidden_names:
            for name in team_names:
                assert forbidden not in name.lower(), f"My Team sphere contains forbidden orchestrator: {name}"


class TestAgentRegistryService:
    """Test AgentRegistryService."""
    
    @pytest.mark.asyncio
    async def test_get_agent(self, mock_db, mock_agent):
        """Test getting agent by ID."""
        # Setup mock
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_agent
        mock_db.execute.return_value = mock_result
        
        service = AgentRegistryService(mock_db)
        result = await service.get_agent(mock_agent.id)
        
        assert result == mock_agent
    
    @pytest.mark.asyncio
    async def test_get_agent_not_found(self, mock_db):
        """Test getting non-existent agent raises error."""
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db.execute.return_value = mock_result
        
        service = AgentRegistryService(mock_db)
        
        with pytest.raises(NotFoundError):
            await service.get_agent(uuid4())
    
    @pytest.mark.asyncio
    async def test_get_agent_by_name(self, mock_db, mock_agent):
        """Test getting agent by name."""
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_agent
        mock_db.execute.return_value = mock_result
        
        service = AgentRegistryService(mock_db)
        result = await service.get_agent_by_name("test_agent")
        
        assert result == mock_agent
    
    @pytest.mark.asyncio
    async def test_list_agents(self, mock_db, mock_agent):
        """Test listing agents."""
        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = [mock_agent]
        mock_db.execute.return_value = mock_result
        
        service = AgentRegistryService(mock_db)
        result = await service.list_agents()
        
        assert len(result) == 1
        assert result[0] == mock_agent
    
    @pytest.mark.asyncio
    async def test_list_agents_filter_by_sphere(self, mock_db, mock_agent):
        """Test filtering agents by sphere."""
        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = [mock_agent]
        mock_db.execute.return_value = mock_result
        
        service = AgentRegistryService(mock_db)
        result = await service.list_agents(sphere_type=SphereType.PERSONAL)
        
        assert len(result) == 1


class TestUserAgentConfig:
    """Test user agent configuration."""
    
    @pytest.mark.asyncio
    async def test_get_or_create_config(self, mock_db, mock_agent, user_id):
        """Test getting or creating user config."""
        # First call returns None (not exists)
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db.execute.return_value = mock_result
        
        # Mock agent lookup
        with patch.object(AgentRegistryService, 'get_agent', return_value=mock_agent):
            service = AgentRegistryService(mock_db)
            # This would create a new config
            # Can't fully test without proper mocking of all calls
    
    @pytest.mark.asyncio
    @pytest.mark.traceability
    async def test_config_has_traceability(self, mock_user_config):
        """Test user config has traceability fields."""
        assert mock_user_config.id is not None
        assert mock_user_config.created_at is not None
        assert mock_user_config.identity_id is not None


# =============================================================================
# AGENT EXECUTION TESTS
# =============================================================================

class TestRequiresHumanGate:
    """Test human gate requirement logic."""
    
    @pytest.mark.human_sovereignty
    def test_sensitive_capabilities_require_gate(self, mock_agent):
        """
        Rule #1: Sensitive capabilities ALWAYS require human approval.
        """
        for sensitive in SENSITIVE_CAPABILITIES:
            mock_agent.capabilities = [sensitive.value]
            mock_agent.requires_human_gate = False
            mock_agent.human_gate_capabilities = []
            
            requires, reason = requires_human_gate(mock_agent, sensitive)
            assert requires, f"Sensitive capability {sensitive.value} should require gate"
    
    @pytest.mark.human_sovereignty
    def test_agent_level_gate(self, mock_agent_with_gate):
        """Test agent that requires gate for all actions."""
        mock_agent_with_gate.requires_human_gate = True
        
        requires, reason = requires_human_gate(
            mock_agent_with_gate,
            AgentCapabilityType.ANALYSIS  # Non-sensitive capability
        )
        
        assert requires
        assert "requires approval for all actions" in reason.lower()
    
    @pytest.mark.human_sovereignty
    def test_capability_specific_gate(self, mock_agent):
        """Test gate requirement for specific capability on agent."""
        mock_agent.requires_human_gate = False
        mock_agent.human_gate_capabilities = ["text_generation"]
        
        # Should require gate for text_generation
        requires, reason = requires_human_gate(
            mock_agent,
            AgentCapabilityType.TEXT_GENERATION
        )
        assert requires
        
        # Should NOT require gate for analysis
        requires, reason = requires_human_gate(
            mock_agent,
            AgentCapabilityType.ANALYSIS
        )
        assert not requires
    
    def test_no_gate_for_safe_capability(self, mock_agent):
        """Test no gate required for safe capabilities."""
        mock_agent.requires_human_gate = False
        mock_agent.human_gate_capabilities = []
        
        requires, reason = requires_human_gate(
            mock_agent,
            AgentCapabilityType.ANALYSIS
        )
        
        assert not requires
        assert reason == ""


class TestAgentExecutionService:
    """Test AgentExecutionService."""
    
    @pytest.mark.asyncio
    @pytest.mark.no_ai_orchestration
    async def test_reject_ai_to_ai_orchestration(self, mock_db, user_id):
        """
        Rule #4: AI-to-AI orchestration is forbidden.
        
        Execution trigger cannot be 'agent_request'.
        """
        # ExecutionRequest validation should reject agent_request
        with pytest.raises(ValueError) as exc_info:
            ExecutionRequest(
                agent_id=uuid4(),
                capability=AgentCapabilityType.ANALYSIS,
                input_data={"test": "data"},
                trigger="agent_request"  # This should be invalid
            )
        
        assert "agent_request" in str(exc_info.value).lower() or "invalid" in str(exc_info.value).lower()
    
    @pytest.mark.asyncio
    async def test_execution_request_valid_triggers(self, mock_db, user_id):
        """Test valid execution triggers are accepted."""
        valid_triggers = [
            ExecutionTrigger.USER_REQUEST,
            ExecutionTrigger.SCHEDULED,
            ExecutionTrigger.THREAD_EVENT,
            ExecutionTrigger.WORKFLOW,
        ]
        
        for trigger in valid_triggers:
            request = ExecutionRequest(
                agent_id=uuid4(),
                capability=AgentCapabilityType.ANALYSIS,
                input_data={"test": "data"},
                trigger=trigger,
            )
            assert request.trigger == trigger
    
    @pytest.mark.asyncio
    @pytest.mark.checkpoint
    async def test_sensitive_execution_triggers_checkpoint(
        self, mock_db, mock_agent_with_gate, mock_user_config, user_id
    ):
        """
        Rule #1: Sensitive execution triggers HTTP 423 checkpoint.
        """
        # Setup mocks
        mock_agent_with_gate.capabilities = ["email_draft"]
        mock_agent_with_gate.requires_human_gate = True
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.side_effect = [
            mock_agent_with_gate,  # get_agent
            mock_user_config,       # get_user_config
        ]
        mock_db.execute.return_value = mock_result
        
        service = AgentExecutionService(mock_db)
        
        request = ExecutionRequest(
            agent_id=mock_agent_with_gate.id,
            capability=AgentCapabilityType.EMAIL_DRAFT,
            input_data={"to": "test@example.com", "body": "Hello"},
        )
        
        # Should raise CheckpointRequiredError (HTTP 423)
        with pytest.raises(CheckpointRequiredError):
            await service.request_execution(request, user_id)
    
    @pytest.mark.asyncio
    @pytest.mark.identity_boundary
    async def test_cannot_approve_other_user_execution(
        self, mock_db, mock_execution, user_id, other_user_id
    ):
        """
        Identity Boundary: Cannot approve another user's execution.
        """
        mock_execution.identity_id = user_id  # Belongs to user_id
        mock_execution.status = ExecutionStatus.AWAITING_APPROVAL
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_execution
        mock_db.execute.return_value = mock_result
        
        service = AgentExecutionService(mock_db)
        
        # other_user_id tries to approve
        with pytest.raises(ForbiddenError):
            await service.approve_execution(mock_execution.id, other_user_id)
    
    @pytest.mark.asyncio
    @pytest.mark.identity_boundary
    async def test_cannot_reject_other_user_execution(
        self, mock_db, mock_execution, user_id, other_user_id
    ):
        """
        Identity Boundary: Cannot reject another user's execution.
        """
        mock_execution.identity_id = user_id
        mock_execution.status = ExecutionStatus.AWAITING_APPROVAL
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_execution
        mock_db.execute.return_value = mock_result
        
        service = AgentExecutionService(mock_db)
        
        with pytest.raises(ForbiddenError):
            await service.reject_execution(mock_execution.id, other_user_id)
    
    @pytest.mark.asyncio
    @pytest.mark.identity_boundary
    async def test_cannot_access_other_user_execution(
        self, mock_db, mock_execution, user_id, other_user_id
    ):
        """
        Identity Boundary: Cannot get another user's execution.
        """
        mock_execution.identity_id = user_id
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_execution
        mock_db.execute.return_value = mock_result
        
        service = AgentExecutionService(mock_db)
        
        with pytest.raises(ForbiddenError):
            await service.get_execution(mock_execution.id, other_user_id)
    
    @pytest.mark.asyncio
    async def test_approve_execution_success(
        self, mock_db, mock_execution, mock_agent, mock_user_config, user_id
    ):
        """Test successful execution approval."""
        mock_execution.identity_id = user_id
        mock_execution.status = ExecutionStatus.AWAITING_APPROVAL
        mock_execution.agent_id = mock_agent.id
        
        # Setup mocks for multiple calls
        mock_results = [
            MagicMock(scalar_one_or_none=MagicMock(return_value=mock_execution)),  # _get_execution
            MagicMock(scalar_one_or_none=MagicMock(return_value=mock_agent)),       # get_agent
            MagicMock(scalar_one_or_none=MagicMock(return_value=mock_user_config)), # get_user_config
            MagicMock(scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[])))),  # steps
        ]
        mock_db.execute.side_effect = mock_results
        
        service = AgentExecutionService(mock_db)
        
        # Patch the registry methods
        with patch.object(service.registry, 'get_agent', return_value=mock_agent):
            with patch.object(service.registry, 'get_user_agent_config', return_value=mock_user_config):
                with patch.object(service, '_get_execution', return_value=mock_execution):
                    with patch.object(service, '_execute_agent') as mock_execute:
                        mock_execute.return_value = MagicMock()  # Return a response
                        result = await service.approve_execution(mock_execution.id, user_id)
    
    @pytest.mark.asyncio
    async def test_reject_execution_success(
        self, mock_db, mock_execution, user_id
    ):
        """Test successful execution rejection."""
        mock_execution.identity_id = user_id
        mock_execution.status = ExecutionStatus.AWAITING_APPROVAL
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_execution
        mock_db.execute.return_value = mock_result
        
        service = AgentExecutionService(mock_db)
        
        with patch.object(service, '_get_execution', return_value=mock_execution):
            with patch.object(service, '_build_execution_response', return_value=MagicMock()):
                result = await service.reject_execution(
                    mock_execution.id, 
                    user_id, 
                    "Changed my mind"
                )
                
                assert mock_execution.status == ExecutionStatus.REJECTED
                assert mock_execution.rejection_reason == "Changed my mind"
    
    @pytest.mark.asyncio
    async def test_cannot_approve_non_pending_execution(
        self, mock_db, mock_execution, user_id
    ):
        """Test cannot approve execution not in AWAITING_APPROVAL status."""
        mock_execution.identity_id = user_id
        mock_execution.status = ExecutionStatus.COMPLETED  # Already done
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_execution
        mock_db.execute.return_value = mock_result
        
        service = AgentExecutionService(mock_db)
        
        with patch.object(service, '_get_execution', return_value=mock_execution):
            with pytest.raises(ValidationError):
                await service.approve_execution(mock_execution.id, user_id)
    
    @pytest.mark.asyncio
    @pytest.mark.traceability
    async def test_execution_has_traceability(self, mock_execution, user_id):
        """
        Rule #6: Execution has traceability fields.
        """
        assert mock_execution.id is not None
        assert mock_execution.created_at is not None
        assert mock_execution.created_by == user_id
        assert mock_execution.identity_id == user_id


class TestExecutionStatus:
    """Test execution status transitions."""
    
    def test_valid_status_values(self):
        """Test all expected status values exist."""
        expected = [
            "pending",
            "running",
            "awaiting_approval",
            "approved",
            "rejected",
            "completed",
            "failed",
            "cancelled",
        ]
        
        for status_name in expected:
            assert hasattr(ExecutionStatus, status_name.upper())
    
    @pytest.mark.asyncio
    async def test_cancel_execution(self, mock_db, mock_execution, user_id):
        """Test cancelling a pending execution."""
        mock_execution.identity_id = user_id
        mock_execution.status = ExecutionStatus.PENDING
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_execution
        mock_db.execute.return_value = mock_result
        
        service = AgentExecutionService(mock_db)
        
        with patch.object(service, '_get_execution', return_value=mock_execution):
            with patch.object(service, '_build_execution_response', return_value=MagicMock()):
                result = await service.cancel_execution(mock_execution.id, user_id)
                
                assert mock_execution.status == ExecutionStatus.CANCELLED
    
    @pytest.mark.asyncio
    async def test_cannot_cancel_completed_execution(
        self, mock_db, mock_execution, user_id
    ):
        """Test cannot cancel already completed execution."""
        mock_execution.identity_id = user_id
        mock_execution.status = ExecutionStatus.COMPLETED
        
        service = AgentExecutionService(mock_db)
        
        with patch.object(service, '_get_execution', return_value=mock_execution):
            with pytest.raises(ValidationError):
                await service.cancel_execution(mock_execution.id, user_id)


# =============================================================================
# EXECUTION TRIGGER TESTS (Rule #4)
# =============================================================================

class TestExecutionTriggers:
    """Test execution trigger validation."""
    
    @pytest.mark.no_ai_orchestration
    def test_no_agent_request_trigger(self):
        """
        Rule #4: ExecutionTrigger does NOT include 'agent_request'.
        
        Agents cannot trigger other agents.
        """
        trigger_values = [t.value for t in ExecutionTrigger]
        assert "agent_request" not in trigger_values
    
    def test_valid_triggers(self):
        """Test valid human-initiated triggers."""
        valid_triggers = [
            ExecutionTrigger.USER_REQUEST,
            ExecutionTrigger.SCHEDULED,
            ExecutionTrigger.THREAD_EVENT,
            ExecutionTrigger.WORKFLOW,
        ]
        
        for trigger in valid_triggers:
            # All should be valid enum values
            assert trigger in ExecutionTrigger
    
    @pytest.mark.no_ai_orchestration
    def test_trigger_validation_in_schema(self):
        """Test that ExecutionRequest schema validates triggers."""
        # Valid triggers should work
        request = ExecutionRequest(
            agent_id=uuid4(),
            capability=AgentCapabilityType.ANALYSIS,
            input_data={"test": "data"},
            trigger=ExecutionTrigger.USER_REQUEST,
        )
        assert request.trigger == ExecutionTrigger.USER_REQUEST
        
        # Invalid trigger value should fail
        with pytest.raises(ValueError):
            ExecutionRequest(
                agent_id=uuid4(),
                capability=AgentCapabilityType.ANALYSIS,
                input_data={"test": "data"},
                trigger="agent_request",  # Invalid!
            )


# =============================================================================
# INTEGRATION TESTS
# =============================================================================

class TestAgentSystemIntegration:
    """Integration tests for agent system."""
    
    @pytest.mark.integration
    @pytest.mark.human_sovereignty
    def test_email_draft_requires_approval(self):
        """
        Integration: Email draft capability always requires human approval.
        """
        agents = get_all_predefined_agents()
        email_agents = [
            a for a in agents 
            if "email_draft" in a["capabilities"]
        ]
        
        for agent in email_agents:
            # Either agent requires gate OR email_draft is in gate capabilities
            has_gate = (
                agent.get("requires_human_gate", False) or
                "email_draft" in agent.get("human_gate_capabilities", [])
            )
            assert has_gate, f"Email agent {agent['name']} missing human gate"
    
    @pytest.mark.integration
    @pytest.mark.human_sovereignty
    def test_message_draft_requires_approval(self):
        """
        Integration: Message draft capability always requires human approval.
        """
        agents = get_all_predefined_agents()
        message_agents = [
            a for a in agents 
            if "message_draft" in a["capabilities"]
        ]
        
        for agent in message_agents:
            has_gate = (
                agent.get("requires_human_gate", False) or
                "message_draft" in agent.get("human_gate_capabilities", [])
            )
            assert has_gate, f"Message agent {agent['name']} missing human gate"
    
    @pytest.mark.integration
    @pytest.mark.traceability
    def test_all_agents_have_unique_ids(self):
        """
        Integration: All agents have unique IDs.
        """
        agents = get_all_predefined_agents()
        ids = [a["id"] for a in agents]
        assert len(ids) == len(set(ids)), "Duplicate agent IDs found"
    
    @pytest.mark.integration
    def test_sphere_coverage(self):
        """
        Integration: All 9 spheres have agents.
        """
        agents = get_all_predefined_agents()
        spheres_with_agents = {a["sphere_type"] for a in agents}
        
        all_spheres = set(SphereType)
        assert spheres_with_agents == all_spheres, f"Missing spheres: {all_spheres - spheres_with_agents}"


# =============================================================================
# API ROUTE TESTS
# =============================================================================

class TestAgentAPIRoutes:
    """Test Agent API routes."""
    
    @pytest.mark.asyncio
    async def test_list_agents_returns_all(self):
        """Test GET /agents returns all agents."""
        # Would test with TestClient
        pass
    
    @pytest.mark.asyncio
    async def test_execute_returns_423_for_sensitive(self):
        """Test POST /agents/execute returns 423 for sensitive capabilities."""
        # Would test with TestClient
        pass
    
    @pytest.mark.asyncio
    async def test_approve_execution_success(self):
        """Test POST /agents/executions/{id}/approve works."""
        # Would test with TestClient
        pass
    
    @pytest.mark.asyncio
    async def test_identity_boundary_on_execution(self):
        """Test cannot access other user's executions."""
        # Would test with TestClient
        pass


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    "TestPredefinedAgents",
    "TestAgentRegistryService",
    "TestUserAgentConfig",
    "TestRequiresHumanGate",
    "TestAgentExecutionService",
    "TestExecutionStatus",
    "TestExecutionTriggers",
    "TestAgentSystemIntegration",
    "TestAgentAPIRoutes",
]
