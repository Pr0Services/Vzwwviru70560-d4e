"""
CHE·NU V71 - Agent Service
Complete agent system with lifecycle management, task execution, and governance.

Features:
- Agent registration and configuration
- Task assignment and execution
- Agent health monitoring
- Capability management
- Token budget tracking
- Audit logging
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set
from uuid import uuid4
import asyncio
import logging

logger = logging.getLogger(__name__)


# ============================================================================
# ENUMS
# ============================================================================

class AgentStatus(str, Enum):
    """Agent lifecycle status."""
    INITIALIZING = "initializing"
    IDLE = "idle"
    BUSY = "busy"
    PAUSED = "paused"
    ERROR = "error"
    TERMINATED = "terminated"


class AgentType(str, Enum):
    """Types of agents in the system."""
    ASSISTANT = "assistant"
    SPECIALIST = "specialist"
    COORDINATOR = "coordinator"
    MONITOR = "monitor"
    EXECUTOR = "executor"


class TaskStatus(str, Enum):
    """Task execution status."""
    PENDING = "pending"
    ASSIGNED = "assigned"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    TIMEOUT = "timeout"


class TaskPriority(str, Enum):
    """Task priority levels."""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"
    CRITICAL = "critical"


class CapabilityType(str, Enum):
    """Agent capability types."""
    TEXT_GENERATION = "text_generation"
    CODE_GENERATION = "code_generation"
    DATA_ANALYSIS = "data_analysis"
    IMAGE_PROCESSING = "image_processing"
    DOCUMENT_PROCESSING = "document_processing"
    WEB_SEARCH = "web_search"
    API_INTEGRATION = "api_integration"
    DATABASE_QUERY = "database_query"
    FILE_OPERATIONS = "file_operations"
    COMMUNICATION = "communication"


# ============================================================================
# DATA CLASSES
# ============================================================================

@dataclass
class AgentCapability:
    """Defines an agent's capability."""
    type: CapabilityType
    level: int  # 1-10 proficiency
    parameters: Dict[str, Any] = field(default_factory=dict)
    enabled: bool = True


@dataclass
class TokenBudget:
    """Token budget for an agent."""
    total: int
    used: int = 0
    reserved: int = 0
    reset_at: Optional[datetime] = None
    
    @property
    def available(self) -> int:
        return self.total - self.used - self.reserved
    
    @property
    def utilization(self) -> float:
        return self.used / self.total if self.total > 0 else 0.0


@dataclass
class AgentConfig:
    """Agent configuration."""
    agent_id: str
    name: str
    type: AgentType
    description: str = ""
    capabilities: List[AgentCapability] = field(default_factory=list)
    token_budget: TokenBudget = field(default_factory=lambda: TokenBudget(total=100000))
    max_concurrent_tasks: int = 5
    timeout_seconds: int = 300
    retry_attempts: int = 3
    sphere_scope: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class Agent:
    """Agent instance."""
    config: AgentConfig
    status: AgentStatus = AgentStatus.INITIALIZING
    current_tasks: List[str] = field(default_factory=list)
    completed_tasks: int = 0
    failed_tasks: int = 0
    total_tokens_used: int = 0
    last_active: Optional[datetime] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    error_message: Optional[str] = None
    
    @property
    def agent_id(self) -> str:
        return self.config.agent_id
    
    @property
    def is_available(self) -> bool:
        return (
            self.status in (AgentStatus.IDLE, AgentStatus.BUSY) and
            len(self.current_tasks) < self.config.max_concurrent_tasks
        )
    
    def has_capability(self, cap_type: CapabilityType, min_level: int = 1) -> bool:
        for cap in self.config.capabilities:
            if cap.type == cap_type and cap.enabled and cap.level >= min_level:
                return True
        return False


@dataclass
class TaskDefinition:
    """Task definition."""
    task_id: str
    name: str
    description: str
    required_capabilities: List[CapabilityType]
    input_data: Dict[str, Any]
    priority: TaskPriority = TaskPriority.NORMAL
    timeout_seconds: int = 300
    max_retries: int = 3
    estimated_tokens: int = 1000
    sphere: Optional[str] = None
    created_by: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class TaskExecution:
    """Task execution record."""
    task_id: str
    task: TaskDefinition
    agent_id: Optional[str] = None
    status: TaskStatus = TaskStatus.PENDING
    result: Optional[Any] = None
    error: Optional[str] = None
    tokens_used: int = 0
    retry_count: int = 0
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
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


@dataclass
class AgentHealthStatus:
    """Agent health status."""
    agent_id: str
    status: AgentStatus
    is_healthy: bool
    response_time_ms: int
    error_rate: float
    task_queue_size: int
    token_utilization: float
    last_heartbeat: datetime
    issues: List[str] = field(default_factory=list)


# ============================================================================
# AGENT SERVICE
# ============================================================================

class AgentService:
    """
    Manages agent lifecycle, task execution, and health monitoring.
    
    CHE·NU Principles:
    - Human sovereignty: All agent actions audited
    - Autonomy isolation: Agents operate in bounded scopes
    - Token governance: Budget enforcement
    """
    
    def __init__(self):
        self._agents: Dict[str, Agent] = {}
        self._tasks: Dict[str, TaskExecution] = {}
        self._task_queue: List[str] = []
        self._executors: Dict[CapabilityType, Callable] = {}
        self._agent_locks: Dict[str, asyncio.Lock] = {}
        
    # ========================================================================
    # AGENT MANAGEMENT
    # ========================================================================
    
    async def register_agent(self, config: AgentConfig) -> Agent:
        """Register a new agent."""
        if config.agent_id in self._agents:
            raise ValueError(f"Agent {config.agent_id} already exists")
        
        agent = Agent(config=config)
        agent.status = AgentStatus.IDLE
        agent.last_active = datetime.utcnow()
        
        self._agents[config.agent_id] = agent
        self._agent_locks[config.agent_id] = asyncio.Lock()
        
        logger.info(f"Agent registered: {config.agent_id} ({config.type.value})")
        return agent
    
    async def get_agent(self, agent_id: str) -> Optional[Agent]:
        """Get agent by ID."""
        return self._agents.get(agent_id)
    
    async def list_agents(
        self,
        status: Optional[AgentStatus] = None,
        agent_type: Optional[AgentType] = None,
        capability: Optional[CapabilityType] = None
    ) -> List[Agent]:
        """List agents with optional filters."""
        agents = list(self._agents.values())
        
        if status:
            agents = [a for a in agents if a.status == status]
        
        if agent_type:
            agents = [a for a in agents if a.config.type == agent_type]
        
        if capability:
            agents = [a for a in agents if a.has_capability(capability)]
        
        return agents
    
    async def update_agent_status(
        self,
        agent_id: str,
        status: AgentStatus,
        error_message: Optional[str] = None
    ) -> Agent:
        """Update agent status."""
        agent = self._agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        
        async with self._agent_locks[agent_id]:
            agent.status = status
            agent.error_message = error_message
            agent.last_active = datetime.utcnow()
        
        logger.info(f"Agent {agent_id} status updated to {status.value}")
        return agent
    
    async def pause_agent(self, agent_id: str) -> Agent:
        """Pause an agent."""
        return await self.update_agent_status(agent_id, AgentStatus.PAUSED)
    
    async def resume_agent(self, agent_id: str) -> Agent:
        """Resume a paused agent."""
        agent = self._agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        
        if agent.status != AgentStatus.PAUSED:
            raise ValueError(f"Agent {agent_id} is not paused")
        
        new_status = AgentStatus.BUSY if agent.current_tasks else AgentStatus.IDLE
        return await self.update_agent_status(agent_id, new_status)
    
    async def terminate_agent(self, agent_id: str) -> Agent:
        """Terminate an agent."""
        agent = self._agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        
        # Cancel all current tasks
        for task_id in agent.current_tasks:
            await self.cancel_task(task_id, "Agent terminated")
        
        return await self.update_agent_status(agent_id, AgentStatus.TERMINATED)
    
    async def add_capability(
        self,
        agent_id: str,
        capability: AgentCapability
    ) -> Agent:
        """Add capability to agent."""
        agent = self._agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        
        # Check if capability already exists
        for i, cap in enumerate(agent.config.capabilities):
            if cap.type == capability.type:
                agent.config.capabilities[i] = capability
                return agent
        
        agent.config.capabilities.append(capability)
        return agent
    
    async def remove_capability(
        self,
        agent_id: str,
        capability_type: CapabilityType
    ) -> Agent:
        """Remove capability from agent."""
        agent = self._agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        
        agent.config.capabilities = [
            c for c in agent.config.capabilities
            if c.type != capability_type
        ]
        return agent
    
    # ========================================================================
    # TASK MANAGEMENT
    # ========================================================================
    
    async def create_task(self, definition: TaskDefinition) -> TaskExecution:
        """Create a new task."""
        execution = TaskExecution(
            task_id=definition.task_id,
            task=definition
        )
        execution.add_audit("created", {
            "created_by": definition.created_by,
            "priority": definition.priority.value
        })
        
        self._tasks[definition.task_id] = execution
        self._task_queue.append(definition.task_id)
        
        # Sort queue by priority
        self._sort_task_queue()
        
        logger.info(f"Task created: {definition.task_id} (priority: {definition.priority.value})")
        return execution
    
    def _sort_task_queue(self):
        """Sort task queue by priority."""
        priority_order = {
            TaskPriority.CRITICAL: 0,
            TaskPriority.URGENT: 1,
            TaskPriority.HIGH: 2,
            TaskPriority.NORMAL: 3,
            TaskPriority.LOW: 4
        }
        
        self._task_queue.sort(
            key=lambda tid: priority_order.get(
                self._tasks[tid].task.priority, 3
            )
        )
    
    async def get_task(self, task_id: str) -> Optional[TaskExecution]:
        """Get task by ID."""
        return self._tasks.get(task_id)
    
    async def list_tasks(
        self,
        status: Optional[TaskStatus] = None,
        agent_id: Optional[str] = None,
        priority: Optional[TaskPriority] = None
    ) -> List[TaskExecution]:
        """List tasks with optional filters."""
        tasks = list(self._tasks.values())
        
        if status:
            tasks = [t for t in tasks if t.status == status]
        
        if agent_id:
            tasks = [t for t in tasks if t.agent_id == agent_id]
        
        if priority:
            tasks = [t for t in tasks if t.task.priority == priority]
        
        return tasks
    
    async def assign_task(
        self,
        task_id: str,
        agent_id: str
    ) -> TaskExecution:
        """Assign task to agent."""
        task = self._tasks.get(task_id)
        if not task:
            raise ValueError(f"Task {task_id} not found")
        
        agent = self._agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        
        if not agent.is_available:
            raise ValueError(f"Agent {agent_id} is not available")
        
        # Check capabilities
        for cap_type in task.task.required_capabilities:
            if not agent.has_capability(cap_type):
                raise ValueError(
                    f"Agent {agent_id} lacks capability: {cap_type.value}"
                )
        
        # Check token budget
        if agent.config.token_budget.available < task.task.estimated_tokens:
            raise ValueError(f"Agent {agent_id} has insufficient token budget")
        
        # Assign task
        async with self._agent_locks[agent_id]:
            task.agent_id = agent_id
            task.status = TaskStatus.ASSIGNED
            task.add_audit("assigned", {"agent_id": agent_id})
            
            agent.current_tasks.append(task_id)
            agent.status = AgentStatus.BUSY
            
            # Remove from queue
            if task_id in self._task_queue:
                self._task_queue.remove(task_id)
        
        logger.info(f"Task {task_id} assigned to agent {agent_id}")
        return task
    
    async def execute_task(self, task_id: str) -> TaskExecution:
        """Execute an assigned task."""
        task = self._tasks.get(task_id)
        if not task:
            raise ValueError(f"Task {task_id} not found")
        
        if task.status != TaskStatus.ASSIGNED:
            raise ValueError(f"Task {task_id} is not assigned (status: {task.status.value})")
        
        agent = self._agents.get(task.agent_id)
        if not agent:
            raise ValueError(f"Assigned agent not found")
        
        task.status = TaskStatus.RUNNING
        task.started_at = datetime.utcnow()
        task.add_audit("started", {})
        
        try:
            # Execute task based on capabilities
            result = await self._run_task_execution(task, agent)
            
            task.result = result
            task.status = TaskStatus.COMPLETED
            task.completed_at = datetime.utcnow()
            task.add_audit("completed", {"result_type": type(result).__name__})
            
            # Update agent stats
            async with self._agent_locks[agent.agent_id]:
                agent.completed_tasks += 1
                agent.total_tokens_used += task.tokens_used
                agent.config.token_budget.used += task.tokens_used
                
                if task_id in agent.current_tasks:
                    agent.current_tasks.remove(task_id)
                
                if not agent.current_tasks:
                    agent.status = AgentStatus.IDLE
            
            logger.info(f"Task {task_id} completed successfully")
            
        except Exception as e:
            task.error = str(e)
            task.status = TaskStatus.FAILED
            task.completed_at = datetime.utcnow()
            task.add_audit("failed", {"error": str(e)})
            
            async with self._agent_locks[agent.agent_id]:
                agent.failed_tasks += 1
                
                if task_id in agent.current_tasks:
                    agent.current_tasks.remove(task_id)
                
                if not agent.current_tasks:
                    agent.status = AgentStatus.IDLE
            
            logger.error(f"Task {task_id} failed: {e}")
        
        return task
    
    async def _run_task_execution(
        self,
        task: TaskExecution,
        agent: Agent
    ) -> Any:
        """Run actual task execution."""
        # Get executor for primary capability
        primary_cap = task.task.required_capabilities[0] if task.task.required_capabilities else None
        
        if primary_cap and primary_cap in self._executors:
            executor = self._executors[primary_cap]
            result = await executor(task.task.input_data, agent.config)
            task.tokens_used = task.task.estimated_tokens
            return result
        
        # Default execution - simulate work
        await asyncio.sleep(0.1)
        task.tokens_used = task.task.estimated_tokens
        
        return {
            "status": "completed",
            "task_id": task.task_id,
            "agent_id": agent.agent_id,
            "input": task.task.input_data,
            "message": "Task executed successfully"
        }
    
    async def cancel_task(
        self,
        task_id: str,
        reason: str = "Cancelled by user"
    ) -> TaskExecution:
        """Cancel a task."""
        task = self._tasks.get(task_id)
        if not task:
            raise ValueError(f"Task {task_id} not found")
        
        if task.status in (TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED):
            raise ValueError(f"Task {task_id} already finished")
        
        task.status = TaskStatus.CANCELLED
        task.error = reason
        task.completed_at = datetime.utcnow()
        task.add_audit("cancelled", {"reason": reason})
        
        # Update agent
        if task.agent_id:
            agent = self._agents.get(task.agent_id)
            if agent and task_id in agent.current_tasks:
                async with self._agent_locks[agent.agent_id]:
                    agent.current_tasks.remove(task_id)
                    if not agent.current_tasks:
                        agent.status = AgentStatus.IDLE
        
        # Remove from queue
        if task_id in self._task_queue:
            self._task_queue.remove(task_id)
        
        logger.info(f"Task {task_id} cancelled: {reason}")
        return task
    
    async def retry_task(self, task_id: str) -> TaskExecution:
        """Retry a failed task."""
        task = self._tasks.get(task_id)
        if not task:
            raise ValueError(f"Task {task_id} not found")
        
        if task.status != TaskStatus.FAILED:
            raise ValueError(f"Task {task_id} is not failed")
        
        if task.retry_count >= task.task.max_retries:
            raise ValueError(f"Task {task_id} has exceeded max retries")
        
        task.retry_count += 1
        task.status = TaskStatus.PENDING
        task.error = None
        task.started_at = None
        task.completed_at = None
        task.add_audit("retry", {"retry_count": task.retry_count})
        
        self._task_queue.append(task_id)
        self._sort_task_queue()
        
        logger.info(f"Task {task_id} scheduled for retry ({task.retry_count}/{task.task.max_retries})")
        return task
    
    # ========================================================================
    # TASK SCHEDULING
    # ========================================================================
    
    async def find_available_agent(
        self,
        required_capabilities: List[CapabilityType],
        estimated_tokens: int,
        sphere: Optional[str] = None
    ) -> Optional[Agent]:
        """Find an available agent matching requirements."""
        for agent in self._agents.values():
            if not agent.is_available:
                continue
            
            # Check capabilities
            has_all_caps = all(
                agent.has_capability(cap) for cap in required_capabilities
            )
            if not has_all_caps:
                continue
            
            # Check token budget
            if agent.config.token_budget.available < estimated_tokens:
                continue
            
            # Check sphere scope
            if sphere and agent.config.sphere_scope:
                if sphere not in agent.config.sphere_scope:
                    continue
            
            return agent
        
        return None
    
    async def auto_assign_pending_tasks(self) -> List[TaskExecution]:
        """Auto-assign pending tasks to available agents."""
        assigned = []
        
        for task_id in list(self._task_queue):
            task = self._tasks.get(task_id)
            if not task or task.status != TaskStatus.PENDING:
                continue
            
            agent = await self.find_available_agent(
                task.task.required_capabilities,
                task.task.estimated_tokens,
                task.task.sphere
            )
            
            if agent:
                try:
                    await self.assign_task(task_id, agent.agent_id)
                    assigned.append(task)
                except Exception as e:
                    logger.warning(f"Failed to assign task {task_id}: {e}")
        
        return assigned
    
    # ========================================================================
    # EXECUTOR REGISTRATION
    # ========================================================================
    
    def register_executor(
        self,
        capability: CapabilityType,
        executor: Callable
    ):
        """Register a task executor for a capability."""
        self._executors[capability] = executor
        logger.info(f"Executor registered for {capability.value}")
    
    def unregister_executor(self, capability: CapabilityType):
        """Unregister a task executor."""
        if capability in self._executors:
            del self._executors[capability]
    
    # ========================================================================
    # HEALTH MONITORING
    # ========================================================================
    
    async def get_agent_health(self, agent_id: str) -> AgentHealthStatus:
        """Get health status of an agent."""
        agent = self._agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        
        # Calculate error rate
        total_tasks = agent.completed_tasks + agent.failed_tasks
        error_rate = agent.failed_tasks / total_tasks if total_tasks > 0 else 0.0
        
        # Check for issues
        issues = []
        if agent.status == AgentStatus.ERROR:
            issues.append(f"Agent in error state: {agent.error_message}")
        if error_rate > 0.1:
            issues.append(f"High error rate: {error_rate:.1%}")
        if agent.config.token_budget.utilization > 0.9:
            issues.append(f"Token budget nearly exhausted: {agent.config.token_budget.utilization:.1%}")
        
        return AgentHealthStatus(
            agent_id=agent_id,
            status=agent.status,
            is_healthy=len(issues) == 0 and agent.status not in (AgentStatus.ERROR, AgentStatus.TERMINATED),
            response_time_ms=50,  # Simulated
            error_rate=error_rate,
            task_queue_size=len(agent.current_tasks),
            token_utilization=agent.config.token_budget.utilization,
            last_heartbeat=agent.last_active or datetime.utcnow(),
            issues=issues
        )
    
    async def get_all_health_status(self) -> Dict[str, AgentHealthStatus]:
        """Get health status of all agents."""
        health = {}
        for agent_id in self._agents:
            health[agent_id] = await self.get_agent_health(agent_id)
        return health
    
    # ========================================================================
    # TOKEN BUDGET MANAGEMENT
    # ========================================================================
    
    async def update_token_budget(
        self,
        agent_id: str,
        total: Optional[int] = None,
        reset: bool = False
    ) -> TokenBudget:
        """Update agent token budget."""
        agent = self._agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        
        if total is not None:
            agent.config.token_budget.total = total
        
        if reset:
            agent.config.token_budget.used = 0
            agent.config.token_budget.reserved = 0
            agent.config.token_budget.reset_at = datetime.utcnow()
        
        return agent.config.token_budget
    
    async def reserve_tokens(
        self,
        agent_id: str,
        amount: int
    ) -> bool:
        """Reserve tokens for upcoming task."""
        agent = self._agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        
        if agent.config.token_budget.available >= amount:
            agent.config.token_budget.reserved += amount
            return True
        return False
    
    async def release_reserved_tokens(
        self,
        agent_id: str,
        amount: int
    ):
        """Release reserved tokens."""
        agent = self._agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        
        agent.config.token_budget.reserved = max(
            0, agent.config.token_budget.reserved - amount
        )
    
    # ========================================================================
    # STATISTICS
    # ========================================================================
    
    async def get_statistics(self) -> Dict[str, Any]:
        """Get overall agent system statistics."""
        agents = list(self._agents.values())
        tasks = list(self._tasks.values())
        
        return {
            "agents": {
                "total": len(agents),
                "by_status": {
                    status.value: len([a for a in agents if a.status == status])
                    for status in AgentStatus
                },
                "by_type": {
                    agent_type.value: len([a for a in agents if a.config.type == agent_type])
                    for agent_type in AgentType
                },
                "available": len([a for a in agents if a.is_available])
            },
            "tasks": {
                "total": len(tasks),
                "by_status": {
                    status.value: len([t for t in tasks if t.status == status])
                    for status in TaskStatus
                },
                "queue_size": len(self._task_queue),
                "average_duration_ms": self._calculate_avg_duration(tasks)
            },
            "tokens": {
                "total_budget": sum(a.config.token_budget.total for a in agents),
                "total_used": sum(a.config.token_budget.used for a in agents),
                "total_available": sum(a.config.token_budget.available for a in agents)
            }
        }
    
    def _calculate_avg_duration(self, tasks: List[TaskExecution]) -> float:
        completed = [t for t in tasks if t.duration_ms is not None]
        if not completed:
            return 0.0
        return sum(t.duration_ms for t in completed) / len(completed)
