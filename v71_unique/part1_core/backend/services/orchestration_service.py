"""
CHE·NU V71 - Multi-Agent Orchestration Service
Coordinates multiple agents for complex tasks with governance controls.

Features:
- Workflow orchestration
- Agent team management
- Task delegation and routing
- Collaboration protocols
- Conflict resolution
- Progress tracking

CHE·NU Principle: Human coordinates multi-agent work, not AI.
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set, Tuple
from uuid import uuid4
import asyncio
import logging

from .agent_service import (
    AgentService, Agent, AgentConfig, AgentStatus, AgentType,
    TaskDefinition, TaskExecution, TaskStatus, TaskPriority,
    CapabilityType, AgentCapability, TokenBudget
)

logger = logging.getLogger(__name__)


# ============================================================================
# ENUMS
# ============================================================================

class WorkflowStatus(str, Enum):
    """Workflow execution status."""
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class StepStatus(str, Enum):
    """Workflow step status."""
    PENDING = "pending"
    READY = "ready"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


class DelegationStrategy(str, Enum):
    """Task delegation strategies."""
    ROUND_ROBIN = "round_robin"
    LEAST_BUSY = "least_busy"
    BEST_FIT = "best_fit"
    PRIORITY_BASED = "priority_based"
    CAPABILITY_MATCH = "capability_match"


class CollaborationType(str, Enum):
    """Types of agent collaboration."""
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    PIPELINE = "pipeline"
    VOTING = "voting"
    CONSENSUS = "consensus"


# ============================================================================
# DATA CLASSES
# ============================================================================

@dataclass
class WorkflowStep:
    """A step in a workflow."""
    step_id: str
    name: str
    description: str = ""
    required_capabilities: List[CapabilityType] = field(default_factory=list)
    input_mapping: Dict[str, str] = field(default_factory=dict)
    output_key: str = ""
    depends_on: List[str] = field(default_factory=list)
    timeout_seconds: int = 300
    retry_count: int = 0
    max_retries: int = 3
    status: StepStatus = StepStatus.PENDING
    assigned_agent: Optional[str] = None
    task_id: Optional[str] = None
    result: Optional[Any] = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


@dataclass
class WorkflowDefinition:
    """Defines a multi-agent workflow."""
    workflow_id: str
    name: str
    description: str = ""
    steps: List[WorkflowStep] = field(default_factory=list)
    collaboration_type: CollaborationType = CollaborationType.SEQUENTIAL
    delegation_strategy: DelegationStrategy = DelegationStrategy.BEST_FIT
    requires_approval: bool = True
    timeout_seconds: int = 3600
    max_parallel_steps: int = 5
    sphere: Optional[str] = None
    created_by: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkflowExecution:
    """Workflow execution instance."""
    execution_id: str
    workflow: WorkflowDefinition
    status: WorkflowStatus = WorkflowStatus.DRAFT
    input_data: Dict[str, Any] = field(default_factory=dict)
    output_data: Dict[str, Any] = field(default_factory=dict)
    step_results: Dict[str, Any] = field(default_factory=dict)
    assigned_agents: Dict[str, str] = field(default_factory=dict)
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    error: Optional[str] = None
    audit_log: List[Dict[str, Any]] = field(default_factory=list)
    
    @property
    def duration_ms(self) -> Optional[int]:
        if self.started_at and self.completed_at:
            return int((self.completed_at - self.started_at).total_seconds() * 1000)
        return None
    
    def add_audit(self, action: str, details: Dict[str, Any] = None):
        self.audit_log.append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "details": details or {}
        })
    
    def get_step(self, step_id: str) -> Optional[WorkflowStep]:
        for step in self.workflow.steps:
            if step.step_id == step_id:
                return step
        return None
    
    @property
    def progress(self) -> float:
        if not self.workflow.steps:
            return 0.0
        completed = sum(1 for s in self.workflow.steps if s.status == StepStatus.COMPLETED)
        return completed / len(self.workflow.steps)


@dataclass
class AgentTeam:
    """A team of agents working together."""
    team_id: str
    name: str
    description: str = ""
    agent_ids: List[str] = field(default_factory=list)
    lead_agent_id: Optional[str] = None
    delegation_strategy: DelegationStrategy = DelegationStrategy.BEST_FIT
    sphere: Optional[str] = None
    created_by: str = ""
    created_at: datetime = field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class DelegationResult:
    """Result of task delegation."""
    success: bool
    agent_id: Optional[str] = None
    task_id: Optional[str] = None
    reason: str = ""
    alternatives: List[str] = field(default_factory=list)


# ============================================================================
# ORCHESTRATION SERVICE
# ============================================================================

class OrchestrationService:
    """
    Orchestrates multi-agent workflows with human oversight.
    
    CHE·NU Principles:
    - Human sovereignty: Workflows require approval
    - No AI-to-AI orchestration without human oversight
    - Full audit trail of all coordination actions
    """
    
    def __init__(self, agent_service: AgentService):
        self._agent_service = agent_service
        self._workflows: Dict[str, WorkflowExecution] = {}
        self._teams: Dict[str, AgentTeam] = {}
        self._delegation_index: Dict[str, int] = {}  # For round-robin
        
    # ========================================================================
    # TEAM MANAGEMENT
    # ========================================================================
    
    async def create_team(
        self,
        name: str,
        agent_ids: List[str],
        lead_agent_id: Optional[str] = None,
        delegation_strategy: DelegationStrategy = DelegationStrategy.BEST_FIT,
        sphere: Optional[str] = None,
        created_by: str = ""
    ) -> AgentTeam:
        """Create an agent team."""
        # Validate agents exist
        for agent_id in agent_ids:
            agent = await self._agent_service.get_agent(agent_id)
            if not agent:
                raise ValueError(f"Agent {agent_id} not found")
        
        if lead_agent_id and lead_agent_id not in agent_ids:
            raise ValueError("Lead agent must be part of the team")
        
        team = AgentTeam(
            team_id=str(uuid4()),
            name=name,
            agent_ids=agent_ids,
            lead_agent_id=lead_agent_id,
            delegation_strategy=delegation_strategy,
            sphere=sphere,
            created_by=created_by
        )
        
        self._teams[team.team_id] = team
        logger.info(f"Team created: {team.team_id} with {len(agent_ids)} agents")
        return team
    
    async def get_team(self, team_id: str) -> Optional[AgentTeam]:
        """Get team by ID."""
        return self._teams.get(team_id)
    
    async def list_teams(self) -> List[AgentTeam]:
        """List all teams."""
        return list(self._teams.values())
    
    async def add_agent_to_team(self, team_id: str, agent_id: str) -> AgentTeam:
        """Add agent to team."""
        team = self._teams.get(team_id)
        if not team:
            raise ValueError(f"Team {team_id} not found")
        
        agent = await self._agent_service.get_agent(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        
        if agent_id not in team.agent_ids:
            team.agent_ids.append(agent_id)
        
        return team
    
    async def remove_agent_from_team(self, team_id: str, agent_id: str) -> AgentTeam:
        """Remove agent from team."""
        team = self._teams.get(team_id)
        if not team:
            raise ValueError(f"Team {team_id} not found")
        
        if agent_id in team.agent_ids:
            team.agent_ids.remove(agent_id)
        
        if team.lead_agent_id == agent_id:
            team.lead_agent_id = team.agent_ids[0] if team.agent_ids else None
        
        return team
    
    async def get_team_capabilities(self, team_id: str) -> Dict[CapabilityType, List[str]]:
        """Get capabilities available in a team."""
        team = self._teams.get(team_id)
        if not team:
            raise ValueError(f"Team {team_id} not found")
        
        capabilities: Dict[CapabilityType, List[str]] = {}
        
        for agent_id in team.agent_ids:
            agent = await self._agent_service.get_agent(agent_id)
            if agent:
                for cap in agent.config.capabilities:
                    if cap.enabled:
                        if cap.type not in capabilities:
                            capabilities[cap.type] = []
                        capabilities[cap.type].append(agent_id)
        
        return capabilities
    
    # ========================================================================
    # WORKFLOW MANAGEMENT
    # ========================================================================
    
    async def create_workflow(
        self,
        definition: WorkflowDefinition,
        input_data: Dict[str, Any]
    ) -> WorkflowExecution:
        """Create a workflow execution."""
        execution = WorkflowExecution(
            execution_id=str(uuid4()),
            workflow=definition,
            input_data=input_data,
            status=WorkflowStatus.DRAFT if definition.requires_approval else WorkflowStatus.APPROVED
        )
        execution.add_audit("created", {
            "workflow_name": definition.name,
            "created_by": definition.created_by
        })
        
        self._workflows[execution.execution_id] = execution
        logger.info(f"Workflow created: {execution.execution_id}")
        return execution
    
    async def get_workflow(self, execution_id: str) -> Optional[WorkflowExecution]:
        """Get workflow by ID."""
        return self._workflows.get(execution_id)
    
    async def list_workflows(
        self,
        status: Optional[WorkflowStatus] = None
    ) -> List[WorkflowExecution]:
        """List workflows with optional filter."""
        workflows = list(self._workflows.values())
        if status:
            workflows = [w for w in workflows if w.status == status]
        return workflows
    
    async def submit_for_approval(
        self,
        execution_id: str
    ) -> WorkflowExecution:
        """Submit workflow for human approval."""
        execution = self._workflows.get(execution_id)
        if not execution:
            raise ValueError(f"Workflow {execution_id} not found")
        
        if execution.status != WorkflowStatus.DRAFT:
            raise ValueError(f"Workflow must be in DRAFT status")
        
        execution.status = WorkflowStatus.PENDING_APPROVAL
        execution.add_audit("submitted_for_approval", {})
        
        logger.info(f"Workflow {execution_id} submitted for approval")
        return execution
    
    async def approve_workflow(
        self,
        execution_id: str,
        approved_by: str
    ) -> WorkflowExecution:
        """Approve a workflow for execution."""
        execution = self._workflows.get(execution_id)
        if not execution:
            raise ValueError(f"Workflow {execution_id} not found")
        
        if execution.status not in (WorkflowStatus.DRAFT, WorkflowStatus.PENDING_APPROVAL):
            raise ValueError(f"Workflow cannot be approved in {execution.status.value} status")
        
        execution.status = WorkflowStatus.APPROVED
        execution.approved_by = approved_by
        execution.approved_at = datetime.utcnow()
        execution.add_audit("approved", {"approved_by": approved_by})
        
        logger.info(f"Workflow {execution_id} approved by {approved_by}")
        return execution
    
    async def reject_workflow(
        self,
        execution_id: str,
        rejected_by: str,
        reason: str
    ) -> WorkflowExecution:
        """Reject a workflow."""
        execution = self._workflows.get(execution_id)
        if not execution:
            raise ValueError(f"Workflow {execution_id} not found")
        
        execution.status = WorkflowStatus.CANCELLED
        execution.error = f"Rejected by {rejected_by}: {reason}"
        execution.add_audit("rejected", {
            "rejected_by": rejected_by,
            "reason": reason
        })
        
        logger.info(f"Workflow {execution_id} rejected: {reason}")
        return execution
    
    # ========================================================================
    # WORKFLOW EXECUTION
    # ========================================================================
    
    async def execute_workflow(
        self,
        execution_id: str,
        team_id: Optional[str] = None
    ) -> WorkflowExecution:
        """Execute an approved workflow."""
        execution = self._workflows.get(execution_id)
        if not execution:
            raise ValueError(f"Workflow {execution_id} not found")
        
        if execution.status != WorkflowStatus.APPROVED:
            raise ValueError(f"Workflow must be approved to execute")
        
        execution.status = WorkflowStatus.RUNNING
        execution.started_at = datetime.utcnow()
        execution.add_audit("started", {"team_id": team_id})
        
        try:
            if execution.workflow.collaboration_type == CollaborationType.SEQUENTIAL:
                await self._execute_sequential(execution, team_id)
            elif execution.workflow.collaboration_type == CollaborationType.PARALLEL:
                await self._execute_parallel(execution, team_id)
            elif execution.workflow.collaboration_type == CollaborationType.PIPELINE:
                await self._execute_pipeline(execution, team_id)
            else:
                await self._execute_sequential(execution, team_id)
            
            execution.status = WorkflowStatus.COMPLETED
            execution.completed_at = datetime.utcnow()
            execution.add_audit("completed", {"duration_ms": execution.duration_ms})
            
            logger.info(f"Workflow {execution_id} completed successfully")
            
        except Exception as e:
            execution.status = WorkflowStatus.FAILED
            execution.completed_at = datetime.utcnow()
            execution.error = str(e)
            execution.add_audit("failed", {"error": str(e)})
            
            logger.error(f"Workflow {execution_id} failed: {e}")
        
        return execution
    
    async def _execute_sequential(
        self,
        execution: WorkflowExecution,
        team_id: Optional[str]
    ):
        """Execute steps sequentially."""
        for step in execution.workflow.steps:
            if step.status == StepStatus.COMPLETED:
                continue
            
            # Check dependencies
            if not self._are_dependencies_met(execution, step):
                step.status = StepStatus.SKIPPED
                step.error = "Dependencies not met"
                continue
            
            await self._execute_step(execution, step, team_id)
            
            if step.status == StepStatus.FAILED:
                raise Exception(f"Step {step.step_id} failed: {step.error}")
    
    async def _execute_parallel(
        self,
        execution: WorkflowExecution,
        team_id: Optional[str]
    ):
        """Execute independent steps in parallel."""
        # Group steps by dependency level
        levels = self._compute_dependency_levels(execution.workflow.steps)
        
        for level in sorted(levels.keys()):
            steps_at_level = levels[level]
            
            # Limit parallelism
            batch_size = execution.workflow.max_parallel_steps
            for i in range(0, len(steps_at_level), batch_size):
                batch = steps_at_level[i:i + batch_size]
                
                tasks = [
                    self._execute_step(execution, step, team_id)
                    for step in batch
                    if step.status != StepStatus.COMPLETED
                ]
                
                await asyncio.gather(*tasks)
            
            # Check for failures
            for step in steps_at_level:
                if step.status == StepStatus.FAILED:
                    raise Exception(f"Step {step.step_id} failed: {step.error}")
    
    async def _execute_pipeline(
        self,
        execution: WorkflowExecution,
        team_id: Optional[str]
    ):
        """Execute steps in pipeline fashion."""
        # Similar to sequential but with streaming data
        await self._execute_sequential(execution, team_id)
    
    def _compute_dependency_levels(
        self,
        steps: List[WorkflowStep]
    ) -> Dict[int, List[WorkflowStep]]:
        """Compute execution levels based on dependencies."""
        levels: Dict[int, List[WorkflowStep]] = {}
        step_levels: Dict[str, int] = {}
        
        # Steps with no dependencies are level 0
        for step in steps:
            if not step.depends_on:
                step_levels[step.step_id] = 0
        
        # Compute levels for dependent steps
        changed = True
        while changed:
            changed = False
            for step in steps:
                if step.step_id in step_levels:
                    continue
                
                deps_resolved = all(
                    dep_id in step_levels for dep_id in step.depends_on
                )
                if deps_resolved:
                    max_dep_level = max(
                        step_levels[dep_id] for dep_id in step.depends_on
                    )
                    step_levels[step.step_id] = max_dep_level + 1
                    changed = True
        
        # Group by level
        for step in steps:
            level = step_levels.get(step.step_id, 0)
            if level not in levels:
                levels[level] = []
            levels[level].append(step)
        
        return levels
    
    def _are_dependencies_met(
        self,
        execution: WorkflowExecution,
        step: WorkflowStep
    ) -> bool:
        """Check if step dependencies are met."""
        for dep_id in step.depends_on:
            dep_step = execution.get_step(dep_id)
            if not dep_step or dep_step.status != StepStatus.COMPLETED:
                return False
        return True
    
    async def _execute_step(
        self,
        execution: WorkflowExecution,
        step: WorkflowStep,
        team_id: Optional[str]
    ):
        """Execute a single workflow step."""
        step.status = StepStatus.RUNNING
        step.started_at = datetime.utcnow()
        
        try:
            # Build input data
            input_data = self._build_step_input(execution, step)
            
            # Delegate to agent
            delegation = await self._delegate_step(
                step, team_id, input_data, execution
            )
            
            if not delegation.success:
                raise Exception(f"Delegation failed: {delegation.reason}")
            
            step.assigned_agent = delegation.agent_id
            step.task_id = delegation.task_id
            execution.assigned_agents[step.step_id] = delegation.agent_id
            
            # Wait for task completion
            result = await self._wait_for_task(delegation.task_id)
            
            step.result = result
            step.status = StepStatus.COMPLETED
            step.completed_at = datetime.utcnow()
            
            # Store result
            if step.output_key:
                execution.step_results[step.output_key] = result
            
            execution.add_audit("step_completed", {
                "step_id": step.step_id,
                "agent_id": delegation.agent_id
            })
            
        except Exception as e:
            step.status = StepStatus.FAILED
            step.error = str(e)
            step.completed_at = datetime.utcnow()
            
            execution.add_audit("step_failed", {
                "step_id": step.step_id,
                "error": str(e)
            })
            
            # Retry if possible
            if step.retry_count < step.max_retries:
                step.retry_count += 1
                step.status = StepStatus.PENDING
                await self._execute_step(execution, step, team_id)
            else:
                raise
    
    def _build_step_input(
        self,
        execution: WorkflowExecution,
        step: WorkflowStep
    ) -> Dict[str, Any]:
        """Build input data for a step."""
        input_data = {}
        
        for target_key, source in step.input_mapping.items():
            if source.startswith("$input."):
                # From workflow input
                key = source[7:]
                input_data[target_key] = execution.input_data.get(key)
            elif source.startswith("$step."):
                # From previous step output
                parts = source[6:].split(".", 1)
                step_output_key = parts[0]
                input_data[target_key] = execution.step_results.get(step_output_key)
            else:
                # Literal value
                input_data[target_key] = source
        
        return input_data
    
    async def _delegate_step(
        self,
        step: WorkflowStep,
        team_id: Optional[str],
        input_data: Dict[str, Any],
        execution: WorkflowExecution
    ) -> DelegationResult:
        """Delegate step to an appropriate agent."""
        # Get candidate agents
        if team_id:
            team = self._teams.get(team_id)
            if not team:
                return DelegationResult(False, reason="Team not found")
            agent_ids = team.agent_ids
            strategy = team.delegation_strategy
        else:
            agents = await self._agent_service.list_agents()
            agent_ids = [a.agent_id for a in agents if a.is_available]
            strategy = execution.workflow.delegation_strategy
        
        # Find best agent
        agent_id = await self._select_agent(
            agent_ids, step.required_capabilities, strategy
        )
        
        if not agent_id:
            return DelegationResult(
                False,
                reason="No suitable agent available",
                alternatives=agent_ids[:5]
            )
        
        # Create and assign task
        task_def = TaskDefinition(
            task_id=str(uuid4()),
            name=f"Step: {step.name}",
            description=step.description,
            required_capabilities=step.required_capabilities,
            input_data=input_data,
            timeout_seconds=step.timeout_seconds,
            sphere=execution.workflow.sphere,
            created_by=execution.workflow.created_by
        )
        
        task = await self._agent_service.create_task(task_def)
        await self._agent_service.assign_task(task.task_id, agent_id)
        
        return DelegationResult(
            success=True,
            agent_id=agent_id,
            task_id=task.task_id
        )
    
    async def _select_agent(
        self,
        agent_ids: List[str],
        required_capabilities: List[CapabilityType],
        strategy: DelegationStrategy
    ) -> Optional[str]:
        """Select agent based on strategy."""
        # Filter by capability
        candidates = []
        for agent_id in agent_ids:
            agent = await self._agent_service.get_agent(agent_id)
            if not agent or not agent.is_available:
                continue
            
            has_caps = all(
                agent.has_capability(cap) for cap in required_capabilities
            )
            if has_caps:
                candidates.append(agent)
        
        if not candidates:
            return None
        
        if strategy == DelegationStrategy.ROUND_ROBIN:
            key = ",".join(sorted(a.agent_id for a in candidates))
            idx = self._delegation_index.get(key, 0)
            selected = candidates[idx % len(candidates)]
            self._delegation_index[key] = idx + 1
            return selected.agent_id
        
        elif strategy == DelegationStrategy.LEAST_BUSY:
            candidates.sort(key=lambda a: len(a.current_tasks))
            return candidates[0].agent_id
        
        elif strategy == DelegationStrategy.BEST_FIT:
            # Score by capability levels
            def score(agent):
                total = 0
                for cap in required_capabilities:
                    for agent_cap in agent.config.capabilities:
                        if agent_cap.type == cap:
                            total += agent_cap.level
                return total
            
            candidates.sort(key=score, reverse=True)
            return candidates[0].agent_id
        
        elif strategy == DelegationStrategy.CAPABILITY_MATCH:
            return candidates[0].agent_id
        
        else:
            return candidates[0].agent_id if candidates else None
    
    async def _wait_for_task(self, task_id: str) -> Any:
        """Wait for task completion."""
        task = await self._agent_service.get_task(task_id)
        if not task:
            raise ValueError(f"Task {task_id} not found")
        
        # Execute if assigned
        if task.status == TaskStatus.ASSIGNED:
            task = await self._agent_service.execute_task(task_id)
        
        # Wait for completion
        max_wait = 300  # 5 minutes
        waited = 0
        while task.status in (TaskStatus.PENDING, TaskStatus.ASSIGNED, TaskStatus.RUNNING):
            await asyncio.sleep(0.1)
            waited += 0.1
            if waited > max_wait:
                raise TimeoutError(f"Task {task_id} timed out")
            task = await self._agent_service.get_task(task_id)
        
        if task.status == TaskStatus.FAILED:
            raise Exception(f"Task failed: {task.error}")
        
        if task.status == TaskStatus.CANCELLED:
            raise Exception("Task was cancelled")
        
        return task.result
    
    # ========================================================================
    # WORKFLOW CONTROL
    # ========================================================================
    
    async def pause_workflow(self, execution_id: str) -> WorkflowExecution:
        """Pause a running workflow."""
        execution = self._workflows.get(execution_id)
        if not execution:
            raise ValueError(f"Workflow {execution_id} not found")
        
        if execution.status != WorkflowStatus.RUNNING:
            raise ValueError("Can only pause running workflows")
        
        execution.status = WorkflowStatus.PAUSED
        execution.add_audit("paused", {})
        
        return execution
    
    async def resume_workflow(self, execution_id: str) -> WorkflowExecution:
        """Resume a paused workflow."""
        execution = self._workflows.get(execution_id)
        if not execution:
            raise ValueError(f"Workflow {execution_id} not found")
        
        if execution.status != WorkflowStatus.PAUSED:
            raise ValueError("Can only resume paused workflows")
        
        execution.status = WorkflowStatus.RUNNING
        execution.add_audit("resumed", {})
        
        return execution
    
    async def cancel_workflow(
        self,
        execution_id: str,
        reason: str
    ) -> WorkflowExecution:
        """Cancel a workflow."""
        execution = self._workflows.get(execution_id)
        if not execution:
            raise ValueError(f"Workflow {execution_id} not found")
        
        if execution.status in (WorkflowStatus.COMPLETED, WorkflowStatus.CANCELLED):
            raise ValueError("Workflow already finished")
        
        execution.status = WorkflowStatus.CANCELLED
        execution.error = reason
        execution.completed_at = datetime.utcnow()
        execution.add_audit("cancelled", {"reason": reason})
        
        # Cancel running tasks
        for step in execution.workflow.steps:
            if step.task_id and step.status == StepStatus.RUNNING:
                try:
                    await self._agent_service.cancel_task(step.task_id, reason)
                except Exception:
                    pass
        
        return execution
    
    # ========================================================================
    # STATISTICS
    # ========================================================================
    
    async def get_statistics(self) -> Dict[str, Any]:
        """Get orchestration statistics."""
        workflows = list(self._workflows.values())
        teams = list(self._teams.values())
        
        completed_workflows = [w for w in workflows if w.status == WorkflowStatus.COMPLETED]
        
        return {
            "workflows": {
                "total": len(workflows),
                "by_status": {
                    status.value: len([w for w in workflows if w.status == status])
                    for status in WorkflowStatus
                },
                "average_duration_ms": (
                    sum(w.duration_ms or 0 for w in completed_workflows) / len(completed_workflows)
                    if completed_workflows else 0
                ),
                "completion_rate": len(completed_workflows) / len(workflows) if workflows else 0
            },
            "teams": {
                "total": len(teams),
                "total_agents": sum(len(t.agent_ids) for t in teams)
            }
        }
