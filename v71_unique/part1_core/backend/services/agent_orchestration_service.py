"""
============================================================================
CHE·NU™ V71 — MULTI-AGENT ORCHESTRATION SERVICE
============================================================================
Version: 1.0.0
Phase: 4 - Agent System & Multi-Agent Orchestration
Purpose: Orchestrate multiple agents with governance checkpoints
Principle: GOUVERNANCE > EXÉCUTION — Humans ALWAYS decide
============================================================================
"""

from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set, Tuple, Union
from pydantic import BaseModel, Field
import asyncio
import uuid
import logging
import hashlib
from collections import defaultdict

logger = logging.getLogger(__name__)


# ============================================================================
# ENUMS
# ============================================================================

class OrchestrationMode(str, Enum):
    """How agents work together"""
    SEQUENTIAL = "sequential"      # One after another
    PARALLEL = "parallel"          # All at once
    PIPELINE = "pipeline"          # Output flows to next
    COLLABORATIVE = "collaborative" # Agents share context
    COMPETITIVE = "competitive"    # Best result wins


class OrchestrationStatus(str, Enum):
    """Orchestration workflow status"""
    CREATED = "created"
    PLANNING = "planning"
    EXECUTING = "executing"
    CHECKPOINT = "checkpoint"
    WAITING_APPROVAL = "waiting_approval"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    TIMEOUT = "timeout"


class AgentRole(str, Enum):
    """Roles agents can play in orchestration"""
    COORDINATOR = "coordinator"    # Manages workflow
    EXECUTOR = "executor"          # Performs tasks
    VALIDATOR = "validator"        # Validates outputs
    REVIEWER = "reviewer"          # Reviews decisions
    AGGREGATOR = "aggregator"      # Combines results
    MONITOR = "monitor"            # Watches execution


class TaskDependencyType(str, Enum):
    """How tasks depend on each other"""
    NONE = "none"                  # Independent
    SEQUENTIAL = "sequential"      # Must complete first
    DATA = "data"                  # Needs data from prior
    APPROVAL = "approval"          # Needs approval from prior
    CONDITIONAL = "conditional"    # Based on prior result


class ConflictResolution(str, Enum):
    """How to resolve agent conflicts"""
    PRIORITY = "priority"          # Higher priority wins
    VOTING = "voting"              # Majority wins
    CONSENSUS = "consensus"        # All must agree
    HUMAN = "human"                # Human decides
    MERGE = "merge"                # Combine results


# ============================================================================
# MODELS
# ============================================================================

class AgentAssignment(BaseModel):
    """Assignment of an agent to an orchestration task"""
    
    assignment_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    agent_id: str
    role: AgentRole
    task_ids: List[str] = Field(default_factory=list)
    
    # Permissions for this assignment
    can_delegate: bool = False
    can_escalate: bool = True
    max_actions: int = 100
    
    # Status
    accepted: bool = False
    completed: bool = False
    
    # Results
    actions_performed: int = 0
    outputs: Dict[str, Any] = Field(default_factory=dict)
    
    # Timing
    assigned_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class OrchestrationTask(BaseModel):
    """A task within an orchestration workflow"""
    
    task_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    
    # Agent assignment
    assigned_agent_id: Optional[str] = None
    required_role: AgentRole = AgentRole.EXECUTOR
    
    # Dependencies
    dependencies: List[str] = Field(default_factory=list)  # Task IDs
    dependency_type: TaskDependencyType = TaskDependencyType.NONE
    
    # Execution
    input_data: Dict[str, Any] = Field(default_factory=dict)
    parameters: Dict[str, Any] = Field(default_factory=dict)
    
    # Governance
    requires_checkpoint: bool = False
    checkpoint_id: Optional[str] = None
    max_impact: float = 1.0
    
    # Status
    status: OrchestrationStatus = OrchestrationStatus.CREATED
    progress: float = 0.0
    
    # Results
    output_data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    timeout_seconds: int = 300


class OrchestrationCheckpoint(BaseModel):
    """Checkpoint requiring human approval in orchestration"""
    
    checkpoint_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    orchestration_id: str
    task_id: str
    
    # Context
    reason: str
    details: Dict[str, Any] = Field(default_factory=dict)
    
    # What needs approval
    pending_actions: List[Dict[str, Any]] = Field(default_factory=list)
    estimated_impact: float = 0.0
    
    # Options
    options: List[str] = Field(default_factory=lambda: ["approve", "reject", "modify"])
    
    # Status
    status: str = "pending"  # pending, approved, rejected, modified
    decision: Optional[str] = None
    decided_by: Optional[str] = None
    decided_at: Optional[datetime] = None
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime = Field(
        default_factory=lambda: datetime.utcnow() + timedelta(hours=1)
    )


class ConflictRecord(BaseModel):
    """Record of a conflict between agents"""
    
    conflict_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    orchestration_id: str
    
    # Conflicting agents
    agent_ids: List[str]
    
    # Conflict details
    conflict_type: str  # data, decision, resource, priority
    description: str
    conflicting_data: Dict[str, Any] = Field(default_factory=dict)
    
    # Resolution
    resolution_strategy: ConflictResolution = ConflictResolution.HUMAN
    resolved: bool = False
    resolution: Optional[Dict[str, Any]] = None
    resolved_by: Optional[str] = None
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None


class OrchestrationPlan(BaseModel):
    """Execution plan for orchestration"""
    
    plan_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    orchestration_id: str
    
    # Structure
    mode: OrchestrationMode
    tasks: List[OrchestrationTask]
    task_order: List[str]  # Task IDs in execution order
    
    # Agents
    assignments: List[AgentAssignment]
    
    # Dependencies as graph
    dependency_graph: Dict[str, List[str]] = Field(default_factory=dict)
    
    # Governance
    total_estimated_impact: float = 0.0
    requires_initial_approval: bool = True
    checkpoint_interval: int = 5  # Checkpoint every N tasks
    
    # Validation
    validated: bool = False
    validation_errors: List[str] = Field(default_factory=list)
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)
    estimated_duration_seconds: int = 0


class Orchestration(BaseModel):
    """Main orchestration workflow"""
    
    orchestration_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    
    # Owner
    user_id: str
    identity_id: str
    
    # Configuration
    mode: OrchestrationMode = OrchestrationMode.SEQUENTIAL
    conflict_resolution: ConflictResolution = ConflictResolution.HUMAN
    
    # Plan
    plan: Optional[OrchestrationPlan] = None
    
    # Agents
    agent_ids: List[str] = Field(default_factory=list)
    assignments: Dict[str, AgentAssignment] = Field(default_factory=dict)
    
    # Tasks
    tasks: Dict[str, OrchestrationTask] = Field(default_factory=dict)
    completed_tasks: List[str] = Field(default_factory=list)
    
    # Checkpoints
    checkpoints: List[OrchestrationCheckpoint] = Field(default_factory=list)
    pending_checkpoint_id: Optional[str] = None
    
    # Conflicts
    conflicts: List[ConflictRecord] = Field(default_factory=list)
    
    # Status
    status: OrchestrationStatus = OrchestrationStatus.CREATED
    progress: float = 0.0
    
    # Results
    final_result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    
    # Audit
    audit_trail: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    timeout_at: Optional[datetime] = None
    
    # Metrics
    total_actions: int = 0
    total_checkpoints: int = 0
    total_conflicts: int = 0


# ============================================================================
# AGENT RUNTIME
# ============================================================================

class AgentRuntime:
    """
    Runtime environment for agent execution.
    
    Manages:
    - Agent lifecycle
    - Action execution with governance
    - Communication between agents
    - Resource allocation
    """
    
    def __init__(self):
        self.agents: Dict[str, Dict[str, Any]] = {}
        self.contexts: Dict[str, Dict[str, Any]] = {}
        self.action_queue: asyncio.Queue = asyncio.Queue()
        self.results: Dict[str, Any] = {}
        self.locks: Dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)
        
    async def register_agent(
        self,
        agent_id: str,
        agent_type: str,
        capabilities: List[str],
        level: str = "L2"
    ) -> Dict[str, Any]:
        """Register an agent with the runtime"""
        agent_data = {
            "agent_id": agent_id,
            "agent_type": agent_type,
            "capabilities": capabilities,
            "level": level,
            "status": "idle",
            "registered_at": datetime.utcnow().isoformat(),
            "actions_performed": 0,
            "current_task": None
        }
        self.agents[agent_id] = agent_data
        
        logger.info(f"Agent registered: {agent_id} ({agent_type})")
        return agent_data
    
    async def get_agent(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Get agent by ID"""
        return self.agents.get(agent_id)
    
    async def execute_action(
        self,
        agent_id: str,
        action_type: str,
        target: str,
        parameters: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Execute an agent action with governance checks.
        
        Returns action result or checkpoint info if blocked.
        """
        agent = self.agents.get(agent_id)
        if not agent:
            return {"success": False, "error": "Agent not found"}
        
        action_id = str(uuid.uuid4())
        action = {
            "action_id": action_id,
            "agent_id": agent_id,
            "action_type": action_type,
            "target": target,
            "parameters": parameters,
            "context": context,
            "status": "executing",
            "started_at": datetime.utcnow().isoformat()
        }
        
        # Check if action requires checkpoint
        estimated_impact = self._estimate_impact(action_type, parameters)
        if estimated_impact > 0.5:  # Threshold
            checkpoint_id = str(uuid.uuid4())
            return {
                "success": False,
                "checkpoint_required": True,
                "checkpoint_id": checkpoint_id,
                "action": action,
                "estimated_impact": estimated_impact,
                "reason": f"Action {action_type} has impact {estimated_impact:.2f}"
            }
        
        # Execute action
        try:
            result = await self._perform_action(action)
            action["status"] = "completed"
            action["completed_at"] = datetime.utcnow().isoformat()
            action["result"] = result
            
            # Update agent stats
            agent["actions_performed"] += 1
            
            return {
                "success": True,
                "action_id": action_id,
                "result": result
            }
        except Exception as e:
            action["status"] = "failed"
            action["error"] = str(e)
            return {
                "success": False,
                "action_id": action_id,
                "error": str(e)
            }
    
    def _estimate_impact(self, action_type: str, parameters: Dict) -> float:
        """Estimate action impact for governance"""
        impact_weights = {
            "read": 0.1,
            "write": 0.4,
            "execute": 0.6,
            "delete": 0.8,
            "communicate": 0.3,
            "delegate": 0.5,
            "escalate": 0.7
        }
        
        base_impact = impact_weights.get(action_type, 0.5)
        
        # Adjust based on parameters
        if parameters.get("batch", False):
            base_impact *= 1.5
        if parameters.get("external", False):
            base_impact *= 1.3
        
        return min(base_impact, 1.0)
    
    async def _perform_action(self, action: Dict) -> Dict[str, Any]:
        """Actually perform the action (mock for now)"""
        # Simulate execution time
        await asyncio.sleep(0.01)
        
        return {
            "action_id": action["action_id"],
            "status": "executed",
            "output": f"Performed {action['action_type']} on {action['target']}"
        }
    
    async def send_message(
        self,
        from_agent_id: str,
        to_agent_id: str,
        message_type: str,
        content: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Send message between agents"""
        message_id = str(uuid.uuid4())
        message = {
            "message_id": message_id,
            "from_agent_id": from_agent_id,
            "to_agent_id": to_agent_id,
            "message_type": message_type,
            "content": content,
            "created_at": datetime.utcnow().isoformat(),
            "delivered": False
        }
        
        # Check recipient exists
        if to_agent_id not in self.agents:
            return {"success": False, "error": "Recipient agent not found"}
        
        # Queue message
        await self.action_queue.put(message)
        message["delivered"] = True
        
        return {
            "success": True,
            "message_id": message_id,
            "delivered": True
        }


# ============================================================================
# ORCHESTRATION SERVICE
# ============================================================================

class MultiAgentOrchestrationService:
    """
    Service for orchestrating multiple agents.
    
    Features:
    - Plan and execute multi-agent workflows
    - Manage task dependencies
    - Handle conflicts between agents
    - Enforce governance checkpoints
    - Track and audit all activities
    """
    
    def __init__(self):
        self.orchestrations: Dict[str, Orchestration] = {}
        self.runtime = AgentRuntime()
        self.checkpoints: Dict[str, OrchestrationCheckpoint] = {}
        self.event_handlers: Dict[str, List[Callable]] = defaultdict(list)
        
    # =========================================================================
    # ORCHESTRATION LIFECYCLE
    # =========================================================================
    
    async def create_orchestration(
        self,
        name: str,
        user_id: str,
        identity_id: str,
        mode: OrchestrationMode = OrchestrationMode.SEQUENTIAL,
        description: str = "",
        timeout_minutes: int = 60
    ) -> Orchestration:
        """Create a new orchestration workflow"""
        
        orchestration = Orchestration(
            name=name,
            description=description,
            user_id=user_id,
            identity_id=identity_id,
            mode=mode,
            timeout_at=datetime.utcnow() + timedelta(minutes=timeout_minutes)
        )
        
        self.orchestrations[orchestration.orchestration_id] = orchestration
        
        # Audit
        orchestration.audit_trail.append({
            "event": "created",
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "details": {"mode": mode.value}
        })
        
        await self._emit_event("orchestration.created", orchestration)
        
        logger.info(f"Orchestration created: {orchestration.orchestration_id}")
        return orchestration
    
    async def add_task(
        self,
        orchestration_id: str,
        name: str,
        description: str = "",
        input_data: Optional[Dict[str, Any]] = None,
        dependencies: Optional[List[str]] = None,
        dependency_type: TaskDependencyType = TaskDependencyType.NONE,
        requires_checkpoint: bool = False,
        max_impact: float = 1.0,
        parameters: Optional[Dict[str, Any]] = None
    ) -> OrchestrationTask:
        """Add a task to the orchestration"""
        
        orch = self.orchestrations.get(orchestration_id)
        if not orch:
            raise ValueError(f"Orchestration not found: {orchestration_id}")
        
        task = OrchestrationTask(
            name=name,
            description=description,
            input_data=input_data or {},
            dependencies=dependencies or [],
            dependency_type=dependency_type,
            requires_checkpoint=requires_checkpoint,
            max_impact=max_impact,
            parameters=parameters or {}
        )
        
        orch.tasks[task.task_id] = task
        
        # Audit
        orch.audit_trail.append({
            "event": "task_added",
            "task_id": task.task_id,
            "timestamp": datetime.utcnow().isoformat(),
            "details": {"name": name}
        })
        
        logger.info(f"Task added to orchestration {orchestration_id}: {task.task_id}")
        return task
    
    async def assign_agent(
        self,
        orchestration_id: str,
        agent_id: str,
        role: AgentRole,
        task_ids: Optional[List[str]] = None,
        can_delegate: bool = False,
        max_actions: int = 100
    ) -> AgentAssignment:
        """Assign an agent to the orchestration"""
        
        orch = self.orchestrations.get(orchestration_id)
        if not orch:
            raise ValueError(f"Orchestration not found: {orchestration_id}")
        
        assignment = AgentAssignment(
            agent_id=agent_id,
            role=role,
            task_ids=task_ids or [],
            can_delegate=can_delegate,
            max_actions=max_actions
        )
        
        orch.assignments[agent_id] = assignment
        orch.agent_ids.append(agent_id)
        
        # Update tasks with agent assignment
        for task_id in task_ids or []:
            if task_id in orch.tasks:
                orch.tasks[task_id].assigned_agent_id = agent_id
        
        # Audit
        orch.audit_trail.append({
            "event": "agent_assigned",
            "agent_id": agent_id,
            "role": role.value,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        logger.info(f"Agent {agent_id} assigned to orchestration {orchestration_id}")
        return assignment
    
    async def create_plan(
        self,
        orchestration_id: str
    ) -> OrchestrationPlan:
        """Create execution plan for the orchestration"""
        
        orch = self.orchestrations.get(orchestration_id)
        if not orch:
            raise ValueError(f"Orchestration not found: {orchestration_id}")
        
        orch.status = OrchestrationStatus.PLANNING
        
        # Build dependency graph
        dependency_graph = {}
        for task_id, task in orch.tasks.items():
            dependency_graph[task_id] = task.dependencies
        
        # Topological sort for execution order
        task_order = self._topological_sort(dependency_graph)
        
        # Validate plan
        validation_errors = self._validate_plan(orch, task_order)
        
        # Calculate total impact
        total_impact = sum(t.max_impact for t in orch.tasks.values())
        
        plan = OrchestrationPlan(
            orchestration_id=orchestration_id,
            mode=orch.mode,
            tasks=list(orch.tasks.values()),
            task_order=task_order,
            assignments=list(orch.assignments.values()),
            dependency_graph=dependency_graph,
            total_estimated_impact=total_impact,
            requires_initial_approval=total_impact > 0.5,
            validated=len(validation_errors) == 0,
            validation_errors=validation_errors
        )
        
        orch.plan = plan
        
        # Audit
        orch.audit_trail.append({
            "event": "plan_created",
            "timestamp": datetime.utcnow().isoformat(),
            "details": {
                "task_count": len(task_order),
                "total_impact": total_impact,
                "requires_approval": plan.requires_initial_approval
            }
        })
        
        return plan
    
    def _topological_sort(self, graph: Dict[str, List[str]]) -> List[str]:
        """Topological sort of task dependencies"""
        in_degree = defaultdict(int)
        for node in graph:
            in_degree[node]  # Initialize
            for dep in graph[node]:
                in_degree[node] += 1
        
        queue = [n for n in graph if in_degree[n] == 0]
        result = []
        
        while queue:
            node = queue.pop(0)
            result.append(node)
            
            for other in graph:
                if node in graph[other]:
                    in_degree[other] -= 1
                    if in_degree[other] == 0:
                        queue.append(other)
        
        return result
    
    def _validate_plan(
        self,
        orch: Orchestration,
        task_order: List[str]
    ) -> List[str]:
        """Validate the orchestration plan"""
        errors = []
        
        # Check all tasks have agents
        for task_id, task in orch.tasks.items():
            if not task.assigned_agent_id:
                errors.append(f"Task {task_id} has no assigned agent")
        
        # Check for circular dependencies
        if len(task_order) != len(orch.tasks):
            errors.append("Circular dependency detected in tasks")
        
        # Check dependencies exist
        for task_id, task in orch.tasks.items():
            for dep_id in task.dependencies:
                if dep_id not in orch.tasks:
                    errors.append(f"Task {task_id} depends on non-existent task {dep_id}")
        
        return errors
    
    # =========================================================================
    # EXECUTION
    # =========================================================================
    
    async def start_orchestration(
        self,
        orchestration_id: str,
        approved_by: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Start executing the orchestration.
        
        Returns checkpoint info if initial approval required.
        """
        
        orch = self.orchestrations.get(orchestration_id)
        if not orch:
            raise ValueError(f"Orchestration not found: {orchestration_id}")
        
        if not orch.plan:
            raise ValueError("Orchestration has no plan. Call create_plan first.")
        
        if orch.plan.validation_errors:
            raise ValueError(f"Plan has validation errors: {orch.plan.validation_errors}")
        
        # Check if initial approval required
        if orch.plan.requires_initial_approval and not approved_by:
            checkpoint = await self._create_checkpoint(
                orch,
                task_id="initial",
                reason="Orchestration requires initial approval due to high impact",
                details={
                    "total_impact": orch.plan.total_estimated_impact,
                    "task_count": len(orch.plan.tasks),
                    "agents": orch.agent_ids
                }
            )
            
            return {
                "status": "checkpoint",
                "checkpoint_id": checkpoint.checkpoint_id,
                "message": "Initial approval required",
                "checkpoint": checkpoint.model_dump()
            }
        
        # Start execution
        orch.status = OrchestrationStatus.EXECUTING
        orch.started_at = datetime.utcnow()
        
        # Audit
        orch.audit_trail.append({
            "event": "started",
            "timestamp": datetime.utcnow().isoformat(),
            "approved_by": approved_by
        })
        
        await self._emit_event("orchestration.started", orch)
        
        # Execute based on mode
        if orch.mode == OrchestrationMode.SEQUENTIAL:
            return await self._execute_sequential(orch)
        elif orch.mode == OrchestrationMode.PARALLEL:
            return await self._execute_parallel(orch)
        elif orch.mode == OrchestrationMode.PIPELINE:
            return await self._execute_pipeline(orch)
        elif orch.mode == OrchestrationMode.COLLABORATIVE:
            return await self._execute_collaborative(orch)
        elif orch.mode == OrchestrationMode.COMPETITIVE:
            return await self._execute_competitive(orch)
        else:
            return await self._execute_sequential(orch)
    
    async def _execute_sequential(self, orch: Orchestration) -> Dict[str, Any]:
        """Execute tasks sequentially"""
        
        for task_id in orch.plan.task_order:
            task = orch.tasks[task_id]
            
            # Check for checkpoint
            if task.requires_checkpoint:
                checkpoint = await self._create_checkpoint(
                    orch,
                    task_id=task_id,
                    reason=f"Task {task.name} requires approval",
                    details={"task": task.model_dump()}
                )
                
                orch.status = OrchestrationStatus.CHECKPOINT
                return {
                    "status": "checkpoint",
                    "checkpoint_id": checkpoint.checkpoint_id,
                    "task_id": task_id,
                    "progress": orch.progress
                }
            
            # Execute task
            result = await self._execute_task(orch, task)
            
            if not result.get("success"):
                orch.status = OrchestrationStatus.FAILED
                orch.error = result.get("error")
                return {
                    "status": "failed",
                    "task_id": task_id,
                    "error": result.get("error")
                }
            
            # Update progress
            orch.completed_tasks.append(task_id)
            orch.progress = len(orch.completed_tasks) / len(orch.tasks)
        
        # All tasks completed
        return await self._complete_orchestration(orch)
    
    async def _execute_parallel(self, orch: Orchestration) -> Dict[str, Any]:
        """Execute independent tasks in parallel"""
        
        # Group tasks by dependency level
        levels = self._group_by_dependency_level(orch)
        
        for level_tasks in levels:
            # Check for checkpoints
            checkpoint_tasks = [t for t in level_tasks if orch.tasks[t].requires_checkpoint]
            if checkpoint_tasks:
                checkpoint = await self._create_checkpoint(
                    orch,
                    task_id=checkpoint_tasks[0],
                    reason=f"Tasks at this level require approval",
                    details={"tasks": checkpoint_tasks}
                )
                
                orch.status = OrchestrationStatus.CHECKPOINT
                return {
                    "status": "checkpoint",
                    "checkpoint_id": checkpoint.checkpoint_id,
                    "tasks": checkpoint_tasks
                }
            
            # Execute tasks in parallel
            results = await asyncio.gather(*[
                self._execute_task(orch, orch.tasks[task_id])
                for task_id in level_tasks
            ], return_exceptions=True)
            
            # Check for failures
            for i, result in enumerate(results):
                task_id = level_tasks[i]
                if isinstance(result, Exception):
                    orch.status = OrchestrationStatus.FAILED
                    orch.error = str(result)
                    return {
                        "status": "failed",
                        "task_id": task_id,
                        "error": str(result)
                    }
                
                if not result.get("success"):
                    orch.status = OrchestrationStatus.FAILED
                    orch.error = result.get("error")
                    return {
                        "status": "failed",
                        "task_id": task_id,
                        "error": result.get("error")
                    }
                
                orch.completed_tasks.append(task_id)
            
            orch.progress = len(orch.completed_tasks) / len(orch.tasks)
        
        return await self._complete_orchestration(orch)
    
    async def _execute_pipeline(self, orch: Orchestration) -> Dict[str, Any]:
        """Execute tasks as a data pipeline"""
        
        pipeline_data = {}
        
        for task_id in orch.plan.task_order:
            task = orch.tasks[task_id]
            
            # Inject data from dependencies
            for dep_id in task.dependencies:
                if dep_id in pipeline_data:
                    task.input_data[f"from_{dep_id}"] = pipeline_data[dep_id]
            
            # Check for checkpoint
            if task.requires_checkpoint:
                checkpoint = await self._create_checkpoint(
                    orch,
                    task_id=task_id,
                    reason=f"Pipeline stage {task.name} requires approval",
                    details={"input_data": task.input_data}
                )
                
                orch.status = OrchestrationStatus.CHECKPOINT
                return {
                    "status": "checkpoint",
                    "checkpoint_id": checkpoint.checkpoint_id,
                    "task_id": task_id
                }
            
            # Execute task
            result = await self._execute_task(orch, task)
            
            if not result.get("success"):
                orch.status = OrchestrationStatus.FAILED
                return {
                    "status": "failed",
                    "task_id": task_id,
                    "error": result.get("error")
                }
            
            # Store output for next stage
            pipeline_data[task_id] = result.get("output")
            
            orch.completed_tasks.append(task_id)
            orch.progress = len(orch.completed_tasks) / len(orch.tasks)
        
        return await self._complete_orchestration(orch, {"pipeline_data": pipeline_data})
    
    async def _execute_collaborative(self, orch: Orchestration) -> Dict[str, Any]:
        """Execute tasks with shared context between agents"""
        
        shared_context = {
            "orchestration_id": orch.orchestration_id,
            "started_at": datetime.utcnow().isoformat(),
            "agents": orch.agent_ids,
            "data": {}
        }
        
        for task_id in orch.plan.task_order:
            task = orch.tasks[task_id]
            
            # Share context with task
            task.input_data["shared_context"] = shared_context
            
            # Execute task
            result = await self._execute_task(orch, task)
            
            if not result.get("success"):
                orch.status = OrchestrationStatus.FAILED
                return {
                    "status": "failed",
                    "task_id": task_id,
                    "error": result.get("error")
                }
            
            # Update shared context
            shared_context["data"][task_id] = result.get("output")
            
            orch.completed_tasks.append(task_id)
            orch.progress = len(orch.completed_tasks) / len(orch.tasks)
        
        return await self._complete_orchestration(orch, {"shared_context": shared_context})
    
    async def _execute_competitive(self, orch: Orchestration) -> Dict[str, Any]:
        """Execute tasks competitively and pick best result"""
        
        # Group tasks by objective
        task_groups = defaultdict(list)
        for task_id, task in orch.tasks.items():
            objective = task.parameters.get("objective", "default")
            task_groups[objective].append(task_id)
        
        best_results = {}
        
        for objective, task_ids in task_groups.items():
            # Execute all tasks for this objective
            results = await asyncio.gather(*[
                self._execute_task(orch, orch.tasks[task_id])
                for task_id in task_ids
            ], return_exceptions=True)
            
            # Filter successful results
            successful = []
            for i, result in enumerate(results):
                if not isinstance(result, Exception) and result.get("success"):
                    successful.append({
                        "task_id": task_ids[i],
                        "result": result,
                        "score": result.get("output", {}).get("score", 0)
                    })
            
            if successful:
                # Pick best result
                best = max(successful, key=lambda x: x["score"])
                best_results[objective] = best
                orch.completed_tasks.append(best["task_id"])
        
        orch.progress = 1.0
        return await self._complete_orchestration(orch, {"best_results": best_results})
    
    def _group_by_dependency_level(self, orch: Orchestration) -> List[List[str]]:
        """Group tasks by dependency level for parallel execution"""
        
        levels = []
        remaining = set(orch.tasks.keys())
        completed = set()
        
        while remaining:
            # Find tasks with all dependencies met
            ready = []
            for task_id in remaining:
                task = orch.tasks[task_id]
                if all(dep in completed for dep in task.dependencies):
                    ready.append(task_id)
            
            if not ready:
                # Circular dependency or error
                ready = list(remaining)[:1]
            
            levels.append(ready)
            for task_id in ready:
                remaining.remove(task_id)
                completed.add(task_id)
        
        return levels
    
    async def _execute_task(
        self,
        orch: Orchestration,
        task: OrchestrationTask
    ) -> Dict[str, Any]:
        """Execute a single task"""
        
        task.status = OrchestrationStatus.EXECUTING
        task.started_at = datetime.utcnow()
        
        agent_id = task.assigned_agent_id
        if not agent_id:
            return {"success": False, "error": "No agent assigned"}
        
        # Execute via runtime
        result = await self.runtime.execute_action(
            agent_id=agent_id,
            action_type="execute",
            target=task.name,
            parameters=task.parameters,
            context={
                "task_id": task.task_id,
                "orchestration_id": orch.orchestration_id,
                "input_data": task.input_data
            }
        )
        
        # Handle checkpoint requirement from runtime
        if result.get("checkpoint_required"):
            checkpoint = await self._create_checkpoint(
                orch,
                task_id=task.task_id,
                reason=result.get("reason", "Action requires approval"),
                details={"action": result.get("action")}
            )
            task.checkpoint_id = checkpoint.checkpoint_id
            task.status = OrchestrationStatus.CHECKPOINT
            
            return {
                "success": False,
                "checkpoint_required": True,
                "checkpoint_id": checkpoint.checkpoint_id
            }
        
        if result.get("success"):
            task.status = OrchestrationStatus.COMPLETED
            task.completed_at = datetime.utcnow()
            task.output_data = result.get("result")
            
            # Update metrics
            orch.total_actions += 1
            
            return {
                "success": True,
                "output": task.output_data
            }
        else:
            task.status = OrchestrationStatus.FAILED
            task.error = result.get("error")
            
            return {
                "success": False,
                "error": task.error
            }
    
    async def _complete_orchestration(
        self,
        orch: Orchestration,
        additional_results: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Mark orchestration as completed"""
        
        orch.status = OrchestrationStatus.COMPLETED
        orch.completed_at = datetime.utcnow()
        orch.progress = 1.0
        
        # Aggregate results
        orch.final_result = {
            "completed_tasks": orch.completed_tasks,
            "task_results": {
                task_id: orch.tasks[task_id].output_data
                for task_id in orch.completed_tasks
            },
            "metrics": {
                "total_actions": orch.total_actions,
                "total_checkpoints": orch.total_checkpoints,
                "total_conflicts": orch.total_conflicts,
                "duration_seconds": (
                    orch.completed_at - orch.started_at
                ).total_seconds() if orch.started_at else 0
            }
        }
        
        if additional_results:
            orch.final_result.update(additional_results)
        
        # Audit
        orch.audit_trail.append({
            "event": "completed",
            "timestamp": datetime.utcnow().isoformat(),
            "metrics": orch.final_result["metrics"]
        })
        
        await self._emit_event("orchestration.completed", orch)
        
        return {
            "status": "completed",
            "orchestration_id": orch.orchestration_id,
            "result": orch.final_result
        }
    
    # =========================================================================
    # CHECKPOINTS
    # =========================================================================
    
    async def _create_checkpoint(
        self,
        orch: Orchestration,
        task_id: str,
        reason: str,
        details: Dict[str, Any]
    ) -> OrchestrationCheckpoint:
        """Create a governance checkpoint"""
        
        checkpoint = OrchestrationCheckpoint(
            orchestration_id=orch.orchestration_id,
            task_id=task_id,
            reason=reason,
            details=details
        )
        
        self.checkpoints[checkpoint.checkpoint_id] = checkpoint
        orch.checkpoints.append(checkpoint)
        orch.pending_checkpoint_id = checkpoint.checkpoint_id
        orch.total_checkpoints += 1
        
        # Audit
        orch.audit_trail.append({
            "event": "checkpoint_created",
            "checkpoint_id": checkpoint.checkpoint_id,
            "task_id": task_id,
            "reason": reason,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        await self._emit_event("checkpoint.created", checkpoint)
        
        return checkpoint
    
    async def approve_checkpoint(
        self,
        checkpoint_id: str,
        user_id: str,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """Approve a checkpoint and continue execution"""
        
        checkpoint = self.checkpoints.get(checkpoint_id)
        if not checkpoint:
            raise ValueError(f"Checkpoint not found: {checkpoint_id}")
        
        if checkpoint.status != "pending":
            raise ValueError(f"Checkpoint already resolved: {checkpoint.status}")
        
        # Check expiry
        if datetime.utcnow() > checkpoint.expires_at:
            checkpoint.status = "expired"
            return {"success": False, "error": "Checkpoint expired"}
        
        # Approve
        checkpoint.status = "approved"
        checkpoint.decision = "approved"
        checkpoint.decided_by = user_id
        checkpoint.decided_at = datetime.utcnow()
        
        if notes:
            checkpoint.details["approval_notes"] = notes
        
        # Get orchestration
        orch = self.orchestrations.get(checkpoint.orchestration_id)
        if orch:
            orch.pending_checkpoint_id = None
            
            # Audit
            orch.audit_trail.append({
                "event": "checkpoint_approved",
                "checkpoint_id": checkpoint_id,
                "user_id": user_id,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            await self._emit_event("checkpoint.approved", checkpoint)
            
            # Resume execution
            return await self.resume_orchestration(checkpoint.orchestration_id, user_id)
        
        return {
            "success": True,
            "checkpoint_id": checkpoint_id,
            "status": "approved"
        }
    
    async def reject_checkpoint(
        self,
        checkpoint_id: str,
        user_id: str,
        reason: str
    ) -> Dict[str, Any]:
        """Reject a checkpoint and stop execution"""
        
        checkpoint = self.checkpoints.get(checkpoint_id)
        if not checkpoint:
            raise ValueError(f"Checkpoint not found: {checkpoint_id}")
        
        checkpoint.status = "rejected"
        checkpoint.decision = "rejected"
        checkpoint.decided_by = user_id
        checkpoint.decided_at = datetime.utcnow()
        checkpoint.details["rejection_reason"] = reason
        
        # Get orchestration
        orch = self.orchestrations.get(checkpoint.orchestration_id)
        if orch:
            orch.status = OrchestrationStatus.CANCELLED
            orch.error = f"Checkpoint rejected: {reason}"
            orch.pending_checkpoint_id = None
            
            # Audit
            orch.audit_trail.append({
                "event": "checkpoint_rejected",
                "checkpoint_id": checkpoint_id,
                "user_id": user_id,
                "reason": reason,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            await self._emit_event("checkpoint.rejected", checkpoint)
        
        return {
            "success": True,
            "checkpoint_id": checkpoint_id,
            "status": "rejected",
            "orchestration_cancelled": True
        }
    
    async def resume_orchestration(
        self,
        orchestration_id: str,
        approved_by: str
    ) -> Dict[str, Any]:
        """Resume orchestration after checkpoint approval"""
        
        orch = self.orchestrations.get(orchestration_id)
        if not orch:
            raise ValueError(f"Orchestration not found: {orchestration_id}")
        
        if orch.status != OrchestrationStatus.CHECKPOINT:
            return {"success": False, "error": f"Orchestration not at checkpoint: {orch.status}"}
        
        orch.status = OrchestrationStatus.EXECUTING
        
        # Continue from where we left off
        return await self.start_orchestration(orchestration_id, approved_by)
    
    # =========================================================================
    # CONFLICT RESOLUTION
    # =========================================================================
    
    async def report_conflict(
        self,
        orchestration_id: str,
        agent_ids: List[str],
        conflict_type: str,
        description: str,
        conflicting_data: Dict[str, Any]
    ) -> ConflictRecord:
        """Report a conflict between agents"""
        
        orch = self.orchestrations.get(orchestration_id)
        if not orch:
            raise ValueError(f"Orchestration not found: {orchestration_id}")
        
        conflict = ConflictRecord(
            orchestration_id=orchestration_id,
            agent_ids=agent_ids,
            conflict_type=conflict_type,
            description=description,
            conflicting_data=conflicting_data,
            resolution_strategy=orch.conflict_resolution
        )
        
        orch.conflicts.append(conflict)
        orch.total_conflicts += 1
        
        # Audit
        orch.audit_trail.append({
            "event": "conflict_reported",
            "conflict_id": conflict.conflict_id,
            "agents": agent_ids,
            "type": conflict_type,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        await self._emit_event("conflict.reported", conflict)
        
        # Auto-resolve if not HUMAN
        if orch.conflict_resolution != ConflictResolution.HUMAN:
            return await self._auto_resolve_conflict(orch, conflict)
        
        return conflict
    
    async def resolve_conflict(
        self,
        orchestration_id: str,
        conflict_id: str,
        resolution: Dict[str, Any],
        resolved_by: str
    ) -> ConflictRecord:
        """Manually resolve a conflict"""
        
        orch = self.orchestrations.get(orchestration_id)
        if not orch:
            raise ValueError(f"Orchestration not found: {orchestration_id}")
        
        conflict = next(
            (c for c in orch.conflicts if c.conflict_id == conflict_id),
            None
        )
        if not conflict:
            raise ValueError(f"Conflict not found: {conflict_id}")
        
        conflict.resolved = True
        conflict.resolution = resolution
        conflict.resolved_by = resolved_by
        conflict.resolved_at = datetime.utcnow()
        
        # Audit
        orch.audit_trail.append({
            "event": "conflict_resolved",
            "conflict_id": conflict_id,
            "resolved_by": resolved_by,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        await self._emit_event("conflict.resolved", conflict)
        
        return conflict
    
    async def _auto_resolve_conflict(
        self,
        orch: Orchestration,
        conflict: ConflictRecord
    ) -> ConflictRecord:
        """Automatically resolve conflict based on strategy"""
        
        resolution = {}
        
        if orch.conflict_resolution == ConflictResolution.PRIORITY:
            # Use highest priority agent's data
            resolution = {"winner": conflict.agent_ids[0], "data": conflict.conflicting_data.get(conflict.agent_ids[0])}
        
        elif orch.conflict_resolution == ConflictResolution.VOTING:
            # Simple majority (mock)
            resolution = {"method": "voting", "winner": conflict.agent_ids[0]}
        
        elif orch.conflict_resolution == ConflictResolution.MERGE:
            # Merge all data
            merged = {}
            for agent_data in conflict.conflicting_data.values():
                if isinstance(agent_data, dict):
                    merged.update(agent_data)
            resolution = {"merged_data": merged}
        
        conflict.resolved = True
        conflict.resolution = resolution
        conflict.resolved_by = "system"
        conflict.resolved_at = datetime.utcnow()
        
        return conflict
    
    # =========================================================================
    # QUERIES
    # =========================================================================
    
    async def get_orchestration(
        self,
        orchestration_id: str
    ) -> Optional[Orchestration]:
        """Get orchestration by ID"""
        return self.orchestrations.get(orchestration_id)
    
    async def get_orchestration_status(
        self,
        orchestration_id: str
    ) -> Dict[str, Any]:
        """Get orchestration status summary"""
        
        orch = self.orchestrations.get(orchestration_id)
        if not orch:
            raise ValueError(f"Orchestration not found: {orchestration_id}")
        
        return {
            "orchestration_id": orchestration_id,
            "name": orch.name,
            "status": orch.status.value,
            "progress": orch.progress,
            "completed_tasks": len(orch.completed_tasks),
            "total_tasks": len(orch.tasks),
            "pending_checkpoint": orch.pending_checkpoint_id,
            "unresolved_conflicts": len([c for c in orch.conflicts if not c.resolved]),
            "started_at": orch.started_at.isoformat() if orch.started_at else None,
            "metrics": {
                "total_actions": orch.total_actions,
                "total_checkpoints": orch.total_checkpoints,
                "total_conflicts": orch.total_conflicts
            }
        }
    
    async def list_orchestrations(
        self,
        user_id: str,
        status: Optional[OrchestrationStatus] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """List orchestrations for a user"""
        
        result = []
        for orch in self.orchestrations.values():
            if orch.user_id != user_id:
                continue
            if status and orch.status != status:
                continue
            
            result.append({
                "orchestration_id": orch.orchestration_id,
                "name": orch.name,
                "status": orch.status.value,
                "progress": orch.progress,
                "created_at": orch.created_at.isoformat()
            })
            
            if len(result) >= limit:
                break
        
        return result
    
    async def get_pending_checkpoints(
        self,
        orchestration_id: Optional[str] = None
    ) -> List[OrchestrationCheckpoint]:
        """Get pending checkpoints"""
        
        pending = []
        for checkpoint in self.checkpoints.values():
            if checkpoint.status != "pending":
                continue
            if orchestration_id and checkpoint.orchestration_id != orchestration_id:
                continue
            pending.append(checkpoint)
        
        return pending
    
    async def get_audit_trail(
        self,
        orchestration_id: str,
        event_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get audit trail for orchestration"""
        
        orch = self.orchestrations.get(orchestration_id)
        if not orch:
            raise ValueError(f"Orchestration not found: {orchestration_id}")
        
        if event_type:
            return [e for e in orch.audit_trail if e.get("event") == event_type]
        
        return orch.audit_trail
    
    # =========================================================================
    # EVENTS
    # =========================================================================
    
    def on_event(self, event_type: str, handler: Callable):
        """Register event handler"""
        self.event_handlers[event_type].append(handler)
    
    async def _emit_event(self, event_type: str, data: Any):
        """Emit event to handlers"""
        for handler in self.event_handlers.get(event_type, []):
            try:
                if asyncio.iscoroutinefunction(handler):
                    await handler(data)
                else:
                    handler(data)
            except Exception as e:
                logger.error(f"Event handler error: {e}")


# ============================================================================
# FACTORY
# ============================================================================

_service_instance: Optional[MultiAgentOrchestrationService] = None


def get_orchestration_service() -> MultiAgentOrchestrationService:
    """Get or create orchestration service instance"""
    global _service_instance
    if _service_instance is None:
        _service_instance = MultiAgentOrchestrationService()
    return _service_instance
