"""
CHE·NU V71 - Agent System & Orchestration Integration Tests
Comprehensive tests for agent management, task execution, and workflow orchestration.
"""

import pytest
from datetime import datetime, timedelta
from uuid import uuid4
import asyncio

from backend.services.agent_service import (
    AgentService, AgentConfig, AgentType, AgentStatus, AgentCapability,
    TaskDefinition, TaskExecution, TaskPriority, TaskStatus, CapabilityType,
    TokenBudget, Agent
)
from backend.services.orchestration_service import (
    OrchestrationService, WorkflowDefinition, WorkflowStep,
    WorkflowStatus, StepStatus, DelegationStrategy, CollaborationType,
    AgentTeam
)


# ============================================================================
# FIXTURES
# ============================================================================

@pytest.fixture
def agent_service():
    """Fresh agent service for each test."""
    return AgentService()


@pytest.fixture
def orchestration_service(agent_service):
    """Orchestration service with agent service."""
    return OrchestrationService(agent_service)


@pytest.fixture
def sample_agent_config():
    """Sample agent configuration."""
    return AgentConfig(
        agent_id=str(uuid4()),
        name="Test Agent",
        type=AgentType.ASSISTANT,
        description="A test agent",
        capabilities=[
            AgentCapability(type=CapabilityType.TEXT_GENERATION, level=8),
            AgentCapability(type=CapabilityType.DATA_ANALYSIS, level=6),
        ],
        token_budget=TokenBudget(total=100000),
        max_concurrent_tasks=5,
        timeout_seconds=300,
        sphere_scope=["personal", "business"]
    )


@pytest.fixture
def sample_task_definition():
    """Sample task definition."""
    return TaskDefinition(
        task_id=str(uuid4()),
        name="Test Task",
        description="A test task",
        required_capabilities=[CapabilityType.TEXT_GENERATION],
        input_data={"prompt": "Generate a summary"},
        priority=TaskPriority.NORMAL,
        timeout_seconds=300,
        max_retries=3,
        estimated_tokens=1000,
        sphere="personal",
        created_by="test_user"
    )


@pytest.fixture
def sample_workflow_definition():
    """Sample workflow definition."""
    return WorkflowDefinition(
        workflow_id=str(uuid4()),
        name="Test Workflow",
        description="A test workflow",
        steps=[
            WorkflowStep(
                step_id="step_1",
                name="Step 1",
                description="First step",
                required_capabilities=[CapabilityType.TEXT_GENERATION],
                input_mapping={"data": "$input.data"},
                output_key="step1_result",
                timeout_seconds=60
            ),
            WorkflowStep(
                step_id="step_2",
                name="Step 2",
                description="Second step",
                required_capabilities=[CapabilityType.DATA_ANALYSIS],
                input_mapping={"data": "$step.step1_result"},
                output_key="step2_result",
                depends_on=["step_1"],
                timeout_seconds=60
            ),
        ],
        collaboration_type=CollaborationType.SEQUENTIAL,
        delegation_strategy=DelegationStrategy.BEST_FIT,
        requires_approval=True,
        timeout_seconds=3600,
        sphere="personal",
        created_by="test_user"
    )


# ============================================================================
# AGENT SERVICE TESTS
# ============================================================================

class TestAgentService:
    """Tests for AgentService."""

    @pytest.mark.asyncio
    async def test_register_agent(self, agent_service, sample_agent_config):
        """Test agent registration."""
        agent = await agent_service.register_agent(sample_agent_config)
        
        assert agent is not None
        assert agent.agent_id == sample_agent_config.agent_id
        assert agent.config.name == "Test Agent"
        assert agent.status == AgentStatus.IDLE
        assert agent.is_available is True

    @pytest.mark.asyncio
    async def test_register_duplicate_agent(self, agent_service, sample_agent_config):
        """Test registering duplicate agent fails."""
        await agent_service.register_agent(sample_agent_config)
        
        with pytest.raises(ValueError, match="already exists"):
            await agent_service.register_agent(sample_agent_config)

    @pytest.mark.asyncio
    async def test_get_agent(self, agent_service, sample_agent_config):
        """Test getting agent by ID."""
        await agent_service.register_agent(sample_agent_config)
        
        agent = await agent_service.get_agent(sample_agent_config.agent_id)
        assert agent is not None
        assert agent.config.name == "Test Agent"

    @pytest.mark.asyncio
    async def test_get_nonexistent_agent(self, agent_service):
        """Test getting nonexistent agent returns None."""
        agent = await agent_service.get_agent("nonexistent")
        assert agent is None

    @pytest.mark.asyncio
    async def test_list_agents(self, agent_service, sample_agent_config):
        """Test listing agents."""
        await agent_service.register_agent(sample_agent_config)
        
        # Create another agent
        config2 = AgentConfig(
            agent_id=str(uuid4()),
            name="Agent 2",
            type=AgentType.SPECIALIST,
            capabilities=[]
        )
        await agent_service.register_agent(config2)
        
        agents = await agent_service.list_agents()
        assert len(agents) == 2

    @pytest.mark.asyncio
    async def test_list_agents_with_filter(self, agent_service, sample_agent_config):
        """Test listing agents with filters."""
        await agent_service.register_agent(sample_agent_config)
        
        config2 = AgentConfig(
            agent_id=str(uuid4()),
            name="Agent 2",
            type=AgentType.SPECIALIST,
            capabilities=[]
        )
        await agent_service.register_agent(config2)
        
        # Filter by type
        agents = await agent_service.list_agents(agent_type=AgentType.ASSISTANT)
        assert len(agents) == 1
        assert agents[0].config.name == "Test Agent"

    @pytest.mark.asyncio
    async def test_update_agent_status(self, agent_service, sample_agent_config):
        """Test updating agent status."""
        await agent_service.register_agent(sample_agent_config)
        
        agent = await agent_service.update_agent_status(
            sample_agent_config.agent_id,
            AgentStatus.BUSY
        )
        assert agent.status == AgentStatus.BUSY

    @pytest.mark.asyncio
    async def test_pause_agent(self, agent_service, sample_agent_config):
        """Test pausing an agent."""
        await agent_service.register_agent(sample_agent_config)
        
        agent = await agent_service.pause_agent(sample_agent_config.agent_id)
        assert agent.status == AgentStatus.PAUSED
        assert agent.is_available is False

    @pytest.mark.asyncio
    async def test_resume_agent(self, agent_service, sample_agent_config):
        """Test resuming a paused agent."""
        await agent_service.register_agent(sample_agent_config)
        await agent_service.pause_agent(sample_agent_config.agent_id)
        
        agent = await agent_service.resume_agent(sample_agent_config.agent_id)
        assert agent.status == AgentStatus.IDLE

    @pytest.mark.asyncio
    async def test_terminate_agent(self, agent_service, sample_agent_config):
        """Test terminating an agent."""
        await agent_service.register_agent(sample_agent_config)
        
        agent = await agent_service.terminate_agent(sample_agent_config.agent_id)
        assert agent.status == AgentStatus.TERMINATED
        assert agent.is_available is False

    @pytest.mark.asyncio
    async def test_add_capability(self, agent_service, sample_agent_config):
        """Test adding capability to agent."""
        await agent_service.register_agent(sample_agent_config)
        
        new_cap = AgentCapability(
            type=CapabilityType.CODE_GENERATION,
            level=7
        )
        agent = await agent_service.add_capability(
            sample_agent_config.agent_id,
            new_cap
        )
        
        assert len(agent.config.capabilities) == 3
        assert agent.has_capability(CapabilityType.CODE_GENERATION)

    @pytest.mark.asyncio
    async def test_remove_capability(self, agent_service, sample_agent_config):
        """Test removing capability from agent."""
        await agent_service.register_agent(sample_agent_config)
        
        agent = await agent_service.remove_capability(
            sample_agent_config.agent_id,
            CapabilityType.DATA_ANALYSIS
        )
        
        assert len(agent.config.capabilities) == 1
        assert not agent.has_capability(CapabilityType.DATA_ANALYSIS)

    @pytest.mark.asyncio
    async def test_has_capability_with_level(self, agent_service, sample_agent_config):
        """Test capability check with minimum level."""
        agent = await agent_service.register_agent(sample_agent_config)
        
        # TEXT_GENERATION level is 8
        assert agent.has_capability(CapabilityType.TEXT_GENERATION, min_level=5)
        assert agent.has_capability(CapabilityType.TEXT_GENERATION, min_level=8)
        assert not agent.has_capability(CapabilityType.TEXT_GENERATION, min_level=9)


# ============================================================================
# TASK MANAGEMENT TESTS
# ============================================================================

class TestTaskManagement:
    """Tests for task management."""

    @pytest.mark.asyncio
    async def test_create_task(self, agent_service, sample_task_definition):
        """Test task creation."""
        task = await agent_service.create_task(sample_task_definition)
        
        assert task is not None
        assert task.task_id == sample_task_definition.task_id
        assert task.status == TaskStatus.PENDING
        assert len(task.audit_log) == 1
        assert task.audit_log[0]["action"] == "created"

    @pytest.mark.asyncio
    async def test_get_task(self, agent_service, sample_task_definition):
        """Test getting task by ID."""
        await agent_service.create_task(sample_task_definition)
        
        task = await agent_service.get_task(sample_task_definition.task_id)
        assert task is not None
        assert task.task.name == "Test Task"

    @pytest.mark.asyncio
    async def test_list_tasks(self, agent_service, sample_task_definition):
        """Test listing tasks."""
        await agent_service.create_task(sample_task_definition)
        
        task2_def = TaskDefinition(
            task_id=str(uuid4()),
            name="Task 2",
            description="Second task",
            required_capabilities=[],
            input_data={},
            priority=TaskPriority.HIGH,
            created_by="test_user"
        )
        await agent_service.create_task(task2_def)
        
        tasks = await agent_service.list_tasks()
        assert len(tasks) == 2

    @pytest.mark.asyncio
    async def test_list_tasks_by_priority(self, agent_service):
        """Test listing tasks filtered by priority."""
        for priority in [TaskPriority.LOW, TaskPriority.HIGH, TaskPriority.HIGH]:
            task_def = TaskDefinition(
                task_id=str(uuid4()),
                name=f"Task {priority.value}",
                description="",
                required_capabilities=[],
                input_data={},
                priority=priority,
                created_by="test_user"
            )
            await agent_service.create_task(task_def)
        
        high_priority = await agent_service.list_tasks(priority=TaskPriority.HIGH)
        assert len(high_priority) == 2

    @pytest.mark.asyncio
    async def test_assign_task(self, agent_service, sample_agent_config, sample_task_definition):
        """Test assigning task to agent."""
        await agent_service.register_agent(sample_agent_config)
        await agent_service.create_task(sample_task_definition)
        
        task = await agent_service.assign_task(
            sample_task_definition.task_id,
            sample_agent_config.agent_id
        )
        
        assert task.status == TaskStatus.ASSIGNED
        assert task.agent_id == sample_agent_config.agent_id

    @pytest.mark.asyncio
    async def test_assign_task_to_unavailable_agent(self, agent_service, sample_agent_config, sample_task_definition):
        """Test assigning task to unavailable agent fails."""
        await agent_service.register_agent(sample_agent_config)
        await agent_service.pause_agent(sample_agent_config.agent_id)
        await agent_service.create_task(sample_task_definition)
        
        with pytest.raises(ValueError, match="not available"):
            await agent_service.assign_task(
                sample_task_definition.task_id,
                sample_agent_config.agent_id
            )

    @pytest.mark.asyncio
    async def test_assign_task_missing_capability(self, agent_service, sample_task_definition):
        """Test assigning task when agent lacks capability."""
        config = AgentConfig(
            agent_id=str(uuid4()),
            name="Limited Agent",
            type=AgentType.ASSISTANT,
            capabilities=[]  # No capabilities
        )
        await agent_service.register_agent(config)
        await agent_service.create_task(sample_task_definition)
        
        with pytest.raises(ValueError, match="lacks capability"):
            await agent_service.assign_task(
                sample_task_definition.task_id,
                config.agent_id
            )

    @pytest.mark.asyncio
    async def test_execute_task(self, agent_service, sample_agent_config, sample_task_definition):
        """Test executing a task."""
        await agent_service.register_agent(sample_agent_config)
        await agent_service.create_task(sample_task_definition)
        await agent_service.assign_task(
            sample_task_definition.task_id,
            sample_agent_config.agent_id
        )
        
        task = await agent_service.execute_task(sample_task_definition.task_id)
        
        assert task.status == TaskStatus.COMPLETED
        assert task.result is not None
        assert task.tokens_used > 0
        assert task.duration_ms is not None

    @pytest.mark.asyncio
    async def test_cancel_task(self, agent_service, sample_task_definition):
        """Test cancelling a task."""
        await agent_service.create_task(sample_task_definition)
        
        task = await agent_service.cancel_task(
            sample_task_definition.task_id,
            "Test cancellation"
        )
        
        assert task.status == TaskStatus.CANCELLED
        assert "Test cancellation" in task.error

    @pytest.mark.asyncio
    async def test_retry_task(self, agent_service, sample_agent_config, sample_task_definition):
        """Test retrying a failed task."""
        await agent_service.register_agent(sample_agent_config)
        task = await agent_service.create_task(sample_task_definition)
        
        # Manually fail the task
        task.status = TaskStatus.FAILED
        task.error = "Test failure"
        
        retried = await agent_service.retry_task(sample_task_definition.task_id)
        
        assert retried.status == TaskStatus.PENDING
        assert retried.retry_count == 1
        assert retried.error is None

    @pytest.mark.asyncio
    async def test_auto_assign_pending_tasks(self, agent_service, sample_agent_config, sample_task_definition):
        """Test auto-assigning pending tasks."""
        await agent_service.register_agent(sample_agent_config)
        await agent_service.create_task(sample_task_definition)
        
        assigned = await agent_service.auto_assign_pending_tasks()
        
        assert len(assigned) == 1
        assert assigned[0].status == TaskStatus.ASSIGNED


# ============================================================================
# TOKEN BUDGET TESTS
# ============================================================================

class TestTokenBudget:
    """Tests for token budget management."""

    @pytest.mark.asyncio
    async def test_token_budget_tracking(self, agent_service, sample_agent_config, sample_task_definition):
        """Test token usage is tracked."""
        await agent_service.register_agent(sample_agent_config)
        await agent_service.create_task(sample_task_definition)
        await agent_service.assign_task(
            sample_task_definition.task_id,
            sample_agent_config.agent_id
        )
        await agent_service.execute_task(sample_task_definition.task_id)
        
        agent = await agent_service.get_agent(sample_agent_config.agent_id)
        assert agent.config.token_budget.used > 0
        assert agent.total_tokens_used > 0

    @pytest.mark.asyncio
    async def test_update_token_budget(self, agent_service, sample_agent_config):
        """Test updating token budget."""
        await agent_service.register_agent(sample_agent_config)
        
        budget = await agent_service.update_token_budget(
            sample_agent_config.agent_id,
            total=200000
        )
        
        assert budget.total == 200000

    @pytest.mark.asyncio
    async def test_reset_token_budget(self, agent_service, sample_agent_config):
        """Test resetting token budget."""
        await agent_service.register_agent(sample_agent_config)
        
        # Use some tokens
        agent = await agent_service.get_agent(sample_agent_config.agent_id)
        agent.config.token_budget.used = 50000
        
        budget = await agent_service.update_token_budget(
            sample_agent_config.agent_id,
            reset=True
        )
        
        assert budget.used == 0
        assert budget.reset_at is not None

    @pytest.mark.asyncio
    async def test_reserve_tokens(self, agent_service, sample_agent_config):
        """Test token reservation."""
        await agent_service.register_agent(sample_agent_config)
        
        success = await agent_service.reserve_tokens(
            sample_agent_config.agent_id,
            10000
        )
        
        assert success is True
        agent = await agent_service.get_agent(sample_agent_config.agent_id)
        assert agent.config.token_budget.reserved == 10000

    @pytest.mark.asyncio
    async def test_insufficient_tokens(self, agent_service, sample_agent_config):
        """Test reservation fails with insufficient tokens."""
        sample_agent_config.token_budget = TokenBudget(total=1000)
        await agent_service.register_agent(sample_agent_config)
        
        success = await agent_service.reserve_tokens(
            sample_agent_config.agent_id,
            5000
        )
        
        assert success is False


# ============================================================================
# AGENT HEALTH TESTS
# ============================================================================

class TestAgentHealth:
    """Tests for agent health monitoring."""

    @pytest.mark.asyncio
    async def test_get_agent_health(self, agent_service, sample_agent_config):
        """Test getting agent health status."""
        await agent_service.register_agent(sample_agent_config)
        
        health = await agent_service.get_agent_health(sample_agent_config.agent_id)
        
        assert health.agent_id == sample_agent_config.agent_id
        assert health.is_healthy is True
        assert health.error_rate == 0.0
        assert len(health.issues) == 0

    @pytest.mark.asyncio
    async def test_agent_health_with_errors(self, agent_service, sample_agent_config):
        """Test health reports issues for agent with errors."""
        await agent_service.register_agent(sample_agent_config)
        agent = await agent_service.get_agent(sample_agent_config.agent_id)
        agent.failed_tasks = 5
        agent.completed_tasks = 5  # 50% error rate
        
        health = await agent_service.get_agent_health(sample_agent_config.agent_id)
        
        assert health.error_rate == 0.5
        assert len(health.issues) > 0

    @pytest.mark.asyncio
    async def test_get_all_health_status(self, agent_service, sample_agent_config):
        """Test getting health for all agents."""
        await agent_service.register_agent(sample_agent_config)
        
        config2 = AgentConfig(
            agent_id=str(uuid4()),
            name="Agent 2",
            type=AgentType.SPECIALIST,
            capabilities=[]
        )
        await agent_service.register_agent(config2)
        
        health = await agent_service.get_all_health_status()
        
        assert len(health) == 2


# ============================================================================
# ORCHESTRATION SERVICE TESTS
# ============================================================================

class TestOrchestrationService:
    """Tests for OrchestrationService."""

    @pytest.mark.asyncio
    async def test_create_team(self, orchestration_service, agent_service, sample_agent_config):
        """Test creating an agent team."""
        await agent_service.register_agent(sample_agent_config)
        
        team = await orchestration_service.create_team(
            name="Test Team",
            agent_ids=[sample_agent_config.agent_id],
            delegation_strategy=DelegationStrategy.BEST_FIT,
            created_by="test_user"
        )
        
        assert team is not None
        assert team.name == "Test Team"
        assert len(team.agent_ids) == 1

    @pytest.mark.asyncio
    async def test_create_team_with_invalid_agent(self, orchestration_service):
        """Test creating team with invalid agent fails."""
        with pytest.raises(ValueError, match="not found"):
            await orchestration_service.create_team(
                name="Test Team",
                agent_ids=["nonexistent"],
                created_by="test_user"
            )

    @pytest.mark.asyncio
    async def test_add_agent_to_team(self, orchestration_service, agent_service, sample_agent_config):
        """Test adding agent to team."""
        await agent_service.register_agent(sample_agent_config)
        team = await orchestration_service.create_team(
            name="Test Team",
            agent_ids=[sample_agent_config.agent_id],
            created_by="test_user"
        )
        
        config2 = AgentConfig(
            agent_id=str(uuid4()),
            name="Agent 2",
            type=AgentType.SPECIALIST,
            capabilities=[]
        )
        await agent_service.register_agent(config2)
        
        team = await orchestration_service.add_agent_to_team(team.team_id, config2.agent_id)
        assert len(team.agent_ids) == 2

    @pytest.mark.asyncio
    async def test_remove_agent_from_team(self, orchestration_service, agent_service, sample_agent_config):
        """Test removing agent from team."""
        await agent_service.register_agent(sample_agent_config)
        team = await orchestration_service.create_team(
            name="Test Team",
            agent_ids=[sample_agent_config.agent_id],
            created_by="test_user"
        )
        
        team = await orchestration_service.remove_agent_from_team(
            team.team_id,
            sample_agent_config.agent_id
        )
        assert len(team.agent_ids) == 0

    @pytest.mark.asyncio
    async def test_get_team_capabilities(self, orchestration_service, agent_service, sample_agent_config):
        """Test getting team capabilities."""
        await agent_service.register_agent(sample_agent_config)
        team = await orchestration_service.create_team(
            name="Test Team",
            agent_ids=[sample_agent_config.agent_id],
            created_by="test_user"
        )
        
        capabilities = await orchestration_service.get_team_capabilities(team.team_id)
        
        assert CapabilityType.TEXT_GENERATION in capabilities
        assert sample_agent_config.agent_id in capabilities[CapabilityType.TEXT_GENERATION]


# ============================================================================
# WORKFLOW TESTS
# ============================================================================

class TestWorkflows:
    """Tests for workflow management."""

    @pytest.mark.asyncio
    async def test_create_workflow(self, orchestration_service, sample_workflow_definition):
        """Test workflow creation."""
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {"data": "test input"}
        )
        
        assert execution is not None
        assert execution.status == WorkflowStatus.DRAFT
        assert len(execution.workflow.steps) == 2

    @pytest.mark.asyncio
    async def test_create_workflow_no_approval(self, orchestration_service, sample_workflow_definition):
        """Test workflow without approval requirement."""
        sample_workflow_definition.requires_approval = False
        
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {}
        )
        
        assert execution.status == WorkflowStatus.APPROVED

    @pytest.mark.asyncio
    async def test_submit_for_approval(self, orchestration_service, sample_workflow_definition):
        """Test submitting workflow for approval."""
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {}
        )
        
        execution = await orchestration_service.submit_for_approval(execution.execution_id)
        assert execution.status == WorkflowStatus.PENDING_APPROVAL

    @pytest.mark.asyncio
    async def test_approve_workflow(self, orchestration_service, sample_workflow_definition):
        """Test approving a workflow."""
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {}
        )
        
        execution = await orchestration_service.approve_workflow(
            execution.execution_id,
            "admin_user"
        )
        
        assert execution.status == WorkflowStatus.APPROVED
        assert execution.approved_by == "admin_user"
        assert execution.approved_at is not None

    @pytest.mark.asyncio
    async def test_reject_workflow(self, orchestration_service, sample_workflow_definition):
        """Test rejecting a workflow."""
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {}
        )
        
        execution = await orchestration_service.reject_workflow(
            execution.execution_id,
            "admin_user",
            "Not needed"
        )
        
        assert execution.status == WorkflowStatus.CANCELLED
        assert "Not needed" in execution.error

    @pytest.mark.asyncio
    async def test_execute_workflow(self, orchestration_service, agent_service, sample_agent_config, sample_workflow_definition):
        """Test executing an approved workflow."""
        # Setup agent
        await agent_service.register_agent(sample_agent_config)
        
        # Create and approve workflow
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {"data": "test"}
        )
        await orchestration_service.approve_workflow(execution.execution_id, "admin")
        
        # Execute
        execution = await orchestration_service.execute_workflow(execution.execution_id)
        
        assert execution.status == WorkflowStatus.COMPLETED
        assert execution.progress == 1.0
        assert execution.duration_ms is not None

    @pytest.mark.asyncio
    async def test_workflow_step_dependencies(self, orchestration_service, agent_service, sample_agent_config, sample_workflow_definition):
        """Test workflow respects step dependencies."""
        await agent_service.register_agent(sample_agent_config)
        
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {"data": "test"}
        )
        await orchestration_service.approve_workflow(execution.execution_id, "admin")
        execution = await orchestration_service.execute_workflow(execution.execution_id)
        
        # Step 2 depends on step 1, should run after
        steps = execution.workflow.steps
        assert steps[0].completed_at is not None
        assert steps[1].completed_at is not None
        # Step 1 should complete before step 2 starts
        assert steps[0].completed_at <= steps[1].started_at

    @pytest.mark.asyncio
    async def test_pause_workflow(self, orchestration_service, agent_service, sample_agent_config, sample_workflow_definition):
        """Test pausing a workflow."""
        await agent_service.register_agent(sample_agent_config)
        
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {}
        )
        await orchestration_service.approve_workflow(execution.execution_id, "admin")
        
        # Manually set to running
        execution.status = WorkflowStatus.RUNNING
        
        execution = await orchestration_service.pause_workflow(execution.execution_id)
        assert execution.status == WorkflowStatus.PAUSED

    @pytest.mark.asyncio
    async def test_resume_workflow(self, orchestration_service, sample_workflow_definition):
        """Test resuming a paused workflow."""
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {}
        )
        execution.status = WorkflowStatus.PAUSED
        
        execution = await orchestration_service.resume_workflow(execution.execution_id)
        assert execution.status == WorkflowStatus.RUNNING

    @pytest.mark.asyncio
    async def test_cancel_workflow(self, orchestration_service, sample_workflow_definition):
        """Test cancelling a workflow."""
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {}
        )
        
        execution = await orchestration_service.cancel_workflow(
            execution.execution_id,
            "User requested"
        )
        
        assert execution.status == WorkflowStatus.CANCELLED
        assert "User requested" in execution.error


# ============================================================================
# DELEGATION STRATEGY TESTS
# ============================================================================

class TestDelegationStrategies:
    """Tests for delegation strategies."""

    @pytest.mark.asyncio
    async def test_round_robin_delegation(self, orchestration_service, agent_service):
        """Test round-robin delegation."""
        # Create multiple agents
        agents = []
        for i in range(3):
            config = AgentConfig(
                agent_id=str(uuid4()),
                name=f"Agent {i}",
                type=AgentType.ASSISTANT,
                capabilities=[AgentCapability(type=CapabilityType.TEXT_GENERATION, level=5)]
            )
            agent = await agent_service.register_agent(config)
            agents.append(agent)
        
        # Find agents multiple times
        selected = []
        for _ in range(6):
            agent = await orchestration_service._select_agent(
                [a.agent_id for a in agents],
                [CapabilityType.TEXT_GENERATION],
                DelegationStrategy.ROUND_ROBIN
            )
            selected.append(agent)
        
        # Should cycle through agents
        assert len(set(selected)) == 3

    @pytest.mark.asyncio
    async def test_least_busy_delegation(self, orchestration_service, agent_service):
        """Test least-busy delegation."""
        # Create agents with different task loads
        config1 = AgentConfig(
            agent_id=str(uuid4()),
            name="Busy Agent",
            type=AgentType.ASSISTANT,
            capabilities=[AgentCapability(type=CapabilityType.TEXT_GENERATION, level=5)]
        )
        agent1 = await agent_service.register_agent(config1)
        agent1.current_tasks = ["task1", "task2", "task3"]
        
        config2 = AgentConfig(
            agent_id=str(uuid4()),
            name="Free Agent",
            type=AgentType.ASSISTANT,
            capabilities=[AgentCapability(type=CapabilityType.TEXT_GENERATION, level=5)]
        )
        agent2 = await agent_service.register_agent(config2)
        
        selected = await orchestration_service._select_agent(
            [agent1.agent_id, agent2.agent_id],
            [CapabilityType.TEXT_GENERATION],
            DelegationStrategy.LEAST_BUSY
        )
        
        assert selected == agent2.agent_id

    @pytest.mark.asyncio
    async def test_best_fit_delegation(self, orchestration_service, agent_service):
        """Test best-fit delegation by capability level."""
        config1 = AgentConfig(
            agent_id=str(uuid4()),
            name="Low Skill",
            type=AgentType.ASSISTANT,
            capabilities=[AgentCapability(type=CapabilityType.TEXT_GENERATION, level=3)]
        )
        agent1 = await agent_service.register_agent(config1)
        
        config2 = AgentConfig(
            agent_id=str(uuid4()),
            name="High Skill",
            type=AgentType.ASSISTANT,
            capabilities=[AgentCapability(type=CapabilityType.TEXT_GENERATION, level=9)]
        )
        agent2 = await agent_service.register_agent(config2)
        
        selected = await orchestration_service._select_agent(
            [agent1.agent_id, agent2.agent_id],
            [CapabilityType.TEXT_GENERATION],
            DelegationStrategy.BEST_FIT
        )
        
        assert selected == agent2.agent_id


# ============================================================================
# STATISTICS TESTS
# ============================================================================

class TestStatistics:
    """Tests for statistics endpoints."""

    @pytest.mark.asyncio
    async def test_agent_statistics(self, agent_service, sample_agent_config, sample_task_definition):
        """Test agent statistics."""
        await agent_service.register_agent(sample_agent_config)
        await agent_service.create_task(sample_task_definition)
        
        stats = await agent_service.get_statistics()
        
        assert stats["agents"]["total"] == 1
        assert stats["tasks"]["total"] == 1
        assert stats["tokens"]["total_budget"] == 100000

    @pytest.mark.asyncio
    async def test_orchestration_statistics(self, orchestration_service, agent_service, sample_agent_config, sample_workflow_definition):
        """Test orchestration statistics."""
        await agent_service.register_agent(sample_agent_config)
        
        # Create and execute workflow
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {}
        )
        await orchestration_service.approve_workflow(execution.execution_id, "admin")
        await orchestration_service.execute_workflow(execution.execution_id)
        
        stats = await orchestration_service.get_statistics()
        
        assert stats["workflows"]["total"] == 1
        assert stats["workflows"]["by_status"]["completed"] == 1


# ============================================================================
# EDGE CASE TESTS
# ============================================================================

class TestEdgeCases:
    """Tests for edge cases."""

    @pytest.mark.asyncio
    async def test_execute_unassigned_task(self, agent_service, sample_task_definition):
        """Test executing unassigned task fails."""
        await agent_service.create_task(sample_task_definition)
        
        with pytest.raises(ValueError, match="not assigned"):
            await agent_service.execute_task(sample_task_definition.task_id)

    @pytest.mark.asyncio
    async def test_execute_unapproved_workflow(self, orchestration_service, sample_workflow_definition):
        """Test executing unapproved workflow fails."""
        execution = await orchestration_service.create_workflow(
            sample_workflow_definition,
            {}
        )
        
        with pytest.raises(ValueError, match="must be approved"):
            await orchestration_service.execute_workflow(execution.execution_id)

    @pytest.mark.asyncio
    async def test_cancel_completed_task(self, agent_service, sample_agent_config, sample_task_definition):
        """Test cancelling completed task fails."""
        await agent_service.register_agent(sample_agent_config)
        await agent_service.create_task(sample_task_definition)
        await agent_service.assign_task(
            sample_task_definition.task_id,
            sample_agent_config.agent_id
        )
        await agent_service.execute_task(sample_task_definition.task_id)
        
        with pytest.raises(ValueError, match="already finished"):
            await agent_service.cancel_task(sample_task_definition.task_id)

    @pytest.mark.asyncio
    async def test_retry_non_failed_task(self, agent_service, sample_task_definition):
        """Test retrying non-failed task fails."""
        await agent_service.create_task(sample_task_definition)
        
        with pytest.raises(ValueError, match="not failed"):
            await agent_service.retry_task(sample_task_definition.task_id)

    @pytest.mark.asyncio
    async def test_max_concurrent_tasks(self, agent_service, sample_agent_config):
        """Test agent respects max concurrent tasks."""
        sample_agent_config.max_concurrent_tasks = 2
        agent = await agent_service.register_agent(sample_agent_config)
        agent.current_tasks = ["task1", "task2"]
        
        assert agent.is_available is False


# ============================================================================
# PERFORMANCE TESTS
# ============================================================================

class TestPerformance:
    """Performance tests."""

    @pytest.mark.asyncio
    async def test_create_many_agents(self, agent_service):
        """Test creating many agents."""
        import time
        
        start = time.time()
        for i in range(100):
            config = AgentConfig(
                agent_id=str(uuid4()),
                name=f"Agent {i}",
                type=AgentType.ASSISTANT,
                capabilities=[]
            )
            await agent_service.register_agent(config)
        duration = time.time() - start
        
        assert duration < 5.0  # Should complete in under 5 seconds
        agents = await agent_service.list_agents()
        assert len(agents) == 100

    @pytest.mark.asyncio
    async def test_create_many_tasks(self, agent_service):
        """Test creating many tasks."""
        import time
        
        start = time.time()
        for i in range(100):
            task_def = TaskDefinition(
                task_id=str(uuid4()),
                name=f"Task {i}",
                description="",
                required_capabilities=[],
                input_data={},
                created_by="test_user"
            )
            await agent_service.create_task(task_def)
        duration = time.time() - start
        
        assert duration < 5.0
        tasks = await agent_service.list_tasks()
        assert len(tasks) == 100
