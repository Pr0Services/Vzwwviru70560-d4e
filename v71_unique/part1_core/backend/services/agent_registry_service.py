"""
============================================================================
CHE·NU™ V71 — AGENT REGISTRY SERVICE
============================================================================
Version: 1.0.0
Phase: 4 - Agent System & Multi-Agent Orchestration
Purpose: Central registry for agent management, discovery, and lifecycle
Principle: GOUVERNANCE > EXÉCUTION — All agents under governance control
============================================================================
"""

from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set
from pydantic import BaseModel, Field
import uuid
import logging
import asyncio
from collections import defaultdict

logger = logging.getLogger(__name__)


# ============================================================================
# ENUMS
# ============================================================================

class AgentLevel(str, Enum):
    """Agent hierarchy levels"""
    L0_SYSTEM = "L0"       # System/Infrastructure
    L1_ORCHESTRATOR = "L1"  # Orchestrator
    L2_SPECIALIST = "L2"    # Specialist
    L3_ASSISTANT = "L3"     # Assistant


class AgentCategory(str, Enum):
    """Agent functional categories"""
    SYSTEM = "system"
    DATA = "data"
    ANALYSIS = "analysis"
    CREATIVE = "creative"
    COMMUNICATION = "communication"
    GOVERNANCE = "governance"
    INTEGRATION = "integration"
    UTILITY = "utility"


class AgentStatus(str, Enum):
    """Agent lifecycle status"""
    REGISTERED = "registered"
    INITIALIZING = "initializing"
    IDLE = "idle"
    ACTIVE = "active"
    BUSY = "busy"
    PAUSED = "paused"
    SUSPENDED = "suspended"
    TERMINATED = "terminated"
    ERROR = "error"


class CapabilityType(str, Enum):
    """Types of agent capabilities"""
    READ = "read"
    WRITE = "write"
    EXECUTE = "execute"
    ANALYZE = "analyze"
    GENERATE = "generate"
    COMMUNICATE = "communicate"
    DELEGATE = "delegate"
    APPROVE = "approve"


# ============================================================================
# MODELS
# ============================================================================

class AgentCapability(BaseModel):
    """Defines a specific capability an agent has"""
    
    capability_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    
    # Type and scope
    capability_type: CapabilityType
    allowed_spheres: Set[str] = Field(default_factory=set)  # Empty = all
    allowed_slots: Set[str] = Field(default_factory=set)
    
    # Governance
    max_impact: float = 1.0
    requires_approval_above: float = 0.5
    requires_hitl: bool = False
    
    # Metadata
    version: str = "1.0.0"
    enabled: bool = True


class AgentMetrics(BaseModel):
    """Runtime metrics for an agent"""
    
    # Execution stats
    total_tasks: int = 0
    completed_tasks: int = 0
    failed_tasks: int = 0
    
    # Action stats
    total_actions: int = 0
    approved_actions: int = 0
    rejected_actions: int = 0
    
    # Checkpoint stats
    checkpoints_triggered: int = 0
    checkpoints_approved: int = 0
    checkpoints_rejected: int = 0
    
    # Performance
    avg_task_duration_ms: float = 0.0
    avg_action_duration_ms: float = 0.0
    
    # Resource usage
    tokens_consumed: int = 0
    api_calls_made: int = 0
    
    # Time tracking
    total_active_time_seconds: float = 0.0
    last_updated_at: datetime = Field(default_factory=datetime.utcnow)


class AgentConfig(BaseModel):
    """Configuration for an agent"""
    
    # Governance
    max_actions_per_task: int = 100
    max_concurrent_tasks: int = 5
    checkpoint_interval: int = 10
    auto_checkpoint_threshold: float = 0.5
    
    # Timeouts
    task_timeout_seconds: int = 300
    action_timeout_seconds: int = 60
    
    # Resources
    max_tokens_per_task: int = 10000
    max_api_calls_per_task: int = 50
    
    # Behavior
    allow_delegation: bool = True
    allow_escalation: bool = True
    require_task_approval: bool = False
    
    # Retry
    max_retries: int = 3
    retry_delay_seconds: int = 5


class RegisteredAgent(BaseModel):
    """An agent registered in the system"""
    
    agent_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    
    # Classification
    level: AgentLevel
    category: AgentCategory
    agent_type: str  # Specific type within category
    
    # Ownership
    tenant_id: Optional[str] = None
    owner_id: Optional[str] = None
    sphere: Optional[str] = None
    
    # Status
    status: AgentStatus = AgentStatus.REGISTERED
    
    # Capabilities
    capabilities: List[AgentCapability] = Field(default_factory=list)
    
    # Configuration
    config: AgentConfig = Field(default_factory=AgentConfig)
    
    # Metrics
    metrics: AgentMetrics = Field(default_factory=AgentMetrics)
    
    # Hierarchy
    parent_agent_id: Optional[str] = None
    child_agent_ids: List[str] = Field(default_factory=list)
    
    # Runtime
    current_task_id: Optional[str] = None
    active_tasks: List[str] = Field(default_factory=list)
    
    # Metadata
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    # Timestamps
    registered_at: datetime = Field(default_factory=datetime.utcnow)
    last_active_at: Optional[datetime] = None
    terminated_at: Optional[datetime] = None
    
    # Version
    version: str = "1.0.0"


class AgentTemplate(BaseModel):
    """Template for creating agents"""
    
    template_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    
    # Base configuration
    level: AgentLevel
    category: AgentCategory
    agent_type: str
    
    # Default capabilities
    capabilities: List[AgentCapability] = Field(default_factory=list)
    
    # Default config
    config: AgentConfig = Field(default_factory=AgentConfig)
    
    # Constraints
    required_spheres: List[str] = Field(default_factory=list)
    max_instances: int = 100
    
    # Metadata
    tags: List[str] = Field(default_factory=list)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Status
    enabled: bool = True


class AgentQuery(BaseModel):
    """Query parameters for finding agents"""
    
    level: Optional[AgentLevel] = None
    category: Optional[AgentCategory] = None
    agent_type: Optional[str] = None
    status: Optional[AgentStatus] = None
    sphere: Optional[str] = None
    tenant_id: Optional[str] = None
    capability_type: Optional[CapabilityType] = None
    tags: Optional[List[str]] = None
    
    # Pagination
    limit: int = 50
    offset: int = 0


# ============================================================================
# AGENT REGISTRY SERVICE
# ============================================================================

class AgentRegistryService:
    """
    Central registry for all agents in the system.
    
    Responsibilities:
    - Agent registration and lifecycle management
    - Agent discovery and querying
    - Capability management
    - Metrics tracking
    - Template management
    """
    
    def __init__(self):
        self.agents: Dict[str, RegisteredAgent] = {}
        self.templates: Dict[str, AgentTemplate] = {}
        self.by_type: Dict[str, List[str]] = defaultdict(list)
        self.by_sphere: Dict[str, List[str]] = defaultdict(list)
        self.by_category: Dict[str, List[str]] = defaultdict(list)
        self.by_tenant: Dict[str, List[str]] = defaultdict(list)
        self.locks: Dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)
        self.event_handlers: Dict[str, List[Callable]] = defaultdict(list)
        
        # Initialize built-in templates
        self._init_built_in_templates()
    
    def _init_built_in_templates(self):
        """Initialize built-in agent templates"""
        
        # Nova System Agent (L0)
        self.templates["nova_system"] = AgentTemplate(
            template_id="nova_system",
            name="Nova System Agent",
            description="Core system intelligence for CHE·NU",
            level=AgentLevel.L0_SYSTEM,
            category=AgentCategory.SYSTEM,
            agent_type="nova",
            capabilities=[
                AgentCapability(
                    name="system_orchestration",
                    capability_type=CapabilityType.EXECUTE,
                    max_impact=1.0,
                    requires_approval_above=0.7
                ),
                AgentCapability(
                    name="governance_enforcement",
                    capability_type=CapabilityType.APPROVE,
                    max_impact=1.0,
                    requires_hitl=True
                )
            ],
            config=AgentConfig(
                max_actions_per_task=1000,
                max_concurrent_tasks=50,
                require_task_approval=True
            )
        )
        
        # Data Analyst Agent (L2)
        self.templates["data_analyst"] = AgentTemplate(
            template_id="data_analyst",
            name="Data Analyst Agent",
            description="Analyzes and processes data",
            level=AgentLevel.L2_SPECIALIST,
            category=AgentCategory.DATA,
            agent_type="analyst",
            capabilities=[
                AgentCapability(
                    name="data_read",
                    capability_type=CapabilityType.READ,
                    max_impact=0.2
                ),
                AgentCapability(
                    name="data_analyze",
                    capability_type=CapabilityType.ANALYZE,
                    max_impact=0.4
                ),
                AgentCapability(
                    name="report_generate",
                    capability_type=CapabilityType.GENERATE,
                    max_impact=0.3
                )
            ]
        )
        
        # Content Creator Agent (L2)
        self.templates["content_creator"] = AgentTemplate(
            template_id="content_creator",
            name="Content Creator Agent",
            description="Creates and edits content",
            level=AgentLevel.L2_SPECIALIST,
            category=AgentCategory.CREATIVE,
            agent_type="creator",
            capabilities=[
                AgentCapability(
                    name="content_generate",
                    capability_type=CapabilityType.GENERATE,
                    max_impact=0.5,
                    requires_approval_above=0.3
                ),
                AgentCapability(
                    name="content_edit",
                    capability_type=CapabilityType.WRITE,
                    max_impact=0.4
                )
            ]
        )
        
        # Communication Agent (L3)
        self.templates["communicator"] = AgentTemplate(
            template_id="communicator",
            name="Communication Agent",
            description="Handles communication and messaging",
            level=AgentLevel.L3_ASSISTANT,
            category=AgentCategory.COMMUNICATION,
            agent_type="communicator",
            capabilities=[
                AgentCapability(
                    name="message_send",
                    capability_type=CapabilityType.COMMUNICATE,
                    max_impact=0.6,
                    requires_hitl=True
                ),
                AgentCapability(
                    name="message_draft",
                    capability_type=CapabilityType.GENERATE,
                    max_impact=0.2
                )
            ],
            config=AgentConfig(
                require_task_approval=True
            )
        )
        
        # Governance Agent (L1)
        self.templates["governance"] = AgentTemplate(
            template_id="governance",
            name="Governance Agent",
            description="Enforces governance rules and policies",
            level=AgentLevel.L1_ORCHESTRATOR,
            category=AgentCategory.GOVERNANCE,
            agent_type="governance",
            capabilities=[
                AgentCapability(
                    name="policy_enforce",
                    capability_type=CapabilityType.EXECUTE,
                    max_impact=0.8,
                    requires_hitl=True
                ),
                AgentCapability(
                    name="approval_grant",
                    capability_type=CapabilityType.APPROVE,
                    max_impact=1.0,
                    requires_hitl=True
                )
            ]
        )
    
    # =========================================================================
    # REGISTRATION
    # =========================================================================
    
    async def register_agent(
        self,
        name: str,
        level: AgentLevel,
        category: AgentCategory,
        agent_type: str,
        description: str = "",
        tenant_id: Optional[str] = None,
        owner_id: Optional[str] = None,
        sphere: Optional[str] = None,
        capabilities: Optional[List[AgentCapability]] = None,
        config: Optional[AgentConfig] = None,
        parent_agent_id: Optional[str] = None,
        tags: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> RegisteredAgent:
        """Register a new agent"""
        
        agent = RegisteredAgent(
            name=name,
            description=description,
            level=level,
            category=category,
            agent_type=agent_type,
            tenant_id=tenant_id,
            owner_id=owner_id,
            sphere=sphere,
            capabilities=capabilities or [],
            config=config or AgentConfig(),
            parent_agent_id=parent_agent_id,
            tags=tags or [],
            metadata=metadata or {}
        )
        
        # Store agent
        self.agents[agent.agent_id] = agent
        
        # Index by type, sphere, category, tenant
        self.by_type[agent_type].append(agent.agent_id)
        if sphere:
            self.by_sphere[sphere].append(agent.agent_id)
        self.by_category[category.value].append(agent.agent_id)
        if tenant_id:
            self.by_tenant[tenant_id].append(agent.agent_id)
        
        # Update parent if specified
        if parent_agent_id and parent_agent_id in self.agents:
            self.agents[parent_agent_id].child_agent_ids.append(agent.agent_id)
        
        await self._emit_event("agent.registered", agent)
        
        logger.info(f"Agent registered: {agent.agent_id} ({name})")
        return agent
    
    async def register_from_template(
        self,
        template_id: str,
        name: str,
        tenant_id: Optional[str] = None,
        owner_id: Optional[str] = None,
        sphere: Optional[str] = None,
        config_overrides: Optional[Dict[str, Any]] = None,
        additional_capabilities: Optional[List[AgentCapability]] = None
    ) -> RegisteredAgent:
        """Register an agent from a template"""
        
        template = self.templates.get(template_id)
        if not template:
            raise ValueError(f"Template not found: {template_id}")
        
        if not template.enabled:
            raise ValueError(f"Template is disabled: {template_id}")
        
        # Check instance limit
        existing = [a for a in self.agents.values() if a.agent_type == template.agent_type]
        if len(existing) >= template.max_instances:
            raise ValueError(f"Maximum instances reached for template: {template_id}")
        
        # Check required spheres
        if template.required_spheres and sphere not in template.required_spheres:
            raise ValueError(f"Sphere not allowed for template: {sphere}")
        
        # Build config
        config = template.config.model_copy()
        if config_overrides:
            for key, value in config_overrides.items():
                if hasattr(config, key):
                    setattr(config, key, value)
        
        # Build capabilities
        capabilities = template.capabilities.copy()
        if additional_capabilities:
            capabilities.extend(additional_capabilities)
        
        return await self.register_agent(
            name=name,
            level=template.level,
            category=template.category,
            agent_type=template.agent_type,
            description=template.description,
            tenant_id=tenant_id,
            owner_id=owner_id,
            sphere=sphere,
            capabilities=capabilities,
            config=config,
            tags=template.tags.copy()
        )
    
    async def unregister_agent(
        self,
        agent_id: str,
        reason: str = ""
    ) -> bool:
        """Unregister (terminate) an agent"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            return False
        
        # Update status
        agent.status = AgentStatus.TERMINATED
        agent.terminated_at = datetime.utcnow()
        
        # Remove from indices
        if agent.agent_type in self.by_type:
            if agent_id in self.by_type[agent.agent_type]:
                self.by_type[agent.agent_type].remove(agent_id)
        
        if agent.sphere and agent.sphere in self.by_sphere:
            if agent_id in self.by_sphere[agent.sphere]:
                self.by_sphere[agent.sphere].remove(agent_id)
        
        if agent.category.value in self.by_category:
            if agent_id in self.by_category[agent.category.value]:
                self.by_category[agent.category.value].remove(agent_id)
        
        if agent.tenant_id and agent.tenant_id in self.by_tenant:
            if agent_id in self.by_tenant[agent.tenant_id]:
                self.by_tenant[agent.tenant_id].remove(agent_id)
        
        # Update parent
        if agent.parent_agent_id and agent.parent_agent_id in self.agents:
            parent = self.agents[agent.parent_agent_id]
            if agent_id in parent.child_agent_ids:
                parent.child_agent_ids.remove(agent_id)
        
        await self._emit_event("agent.unregistered", {"agent_id": agent_id, "reason": reason})
        
        logger.info(f"Agent unregistered: {agent_id}")
        return True
    
    # =========================================================================
    # STATUS MANAGEMENT
    # =========================================================================
    
    async def update_status(
        self,
        agent_id: str,
        status: AgentStatus
    ) -> RegisteredAgent:
        """Update agent status"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {agent_id}")
        
        old_status = agent.status
        agent.status = status
        
        if status in [AgentStatus.ACTIVE, AgentStatus.BUSY]:
            agent.last_active_at = datetime.utcnow()
        
        await self._emit_event("agent.status_changed", {
            "agent_id": agent_id,
            "old_status": old_status.value,
            "new_status": status.value
        })
        
        return agent
    
    async def pause_agent(self, agent_id: str) -> RegisteredAgent:
        """Pause an agent"""
        return await self.update_status(agent_id, AgentStatus.PAUSED)
    
    async def resume_agent(self, agent_id: str) -> RegisteredAgent:
        """Resume a paused agent"""
        return await self.update_status(agent_id, AgentStatus.IDLE)
    
    async def suspend_agent(self, agent_id: str, reason: str = "") -> RegisteredAgent:
        """Suspend an agent (requires admin action to resume)"""
        agent = await self.update_status(agent_id, AgentStatus.SUSPENDED)
        agent.metadata["suspension_reason"] = reason
        agent.metadata["suspended_at"] = datetime.utcnow().isoformat()
        return agent
    
    # =========================================================================
    # CAPABILITY MANAGEMENT
    # =========================================================================
    
    async def add_capability(
        self,
        agent_id: str,
        capability: AgentCapability
    ) -> RegisteredAgent:
        """Add a capability to an agent"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {agent_id}")
        
        # Check for duplicate
        existing = next(
            (c for c in agent.capabilities if c.name == capability.name),
            None
        )
        if existing:
            raise ValueError(f"Capability already exists: {capability.name}")
        
        agent.capabilities.append(capability)
        
        await self._emit_event("agent.capability_added", {
            "agent_id": agent_id,
            "capability": capability.name
        })
        
        return agent
    
    async def remove_capability(
        self,
        agent_id: str,
        capability_name: str
    ) -> RegisteredAgent:
        """Remove a capability from an agent"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {agent_id}")
        
        agent.capabilities = [
            c for c in agent.capabilities if c.name != capability_name
        ]
        
        await self._emit_event("agent.capability_removed", {
            "agent_id": agent_id,
            "capability": capability_name
        })
        
        return agent
    
    async def update_capability(
        self,
        agent_id: str,
        capability_name: str,
        updates: Dict[str, Any]
    ) -> RegisteredAgent:
        """Update a capability"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {agent_id}")
        
        for cap in agent.capabilities:
            if cap.name == capability_name:
                for key, value in updates.items():
                    if hasattr(cap, key):
                        setattr(cap, key, value)
                break
        
        return agent
    
    def has_capability(
        self,
        agent_id: str,
        capability_type: CapabilityType,
        sphere: Optional[str] = None
    ) -> bool:
        """Check if agent has a capability"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            return False
        
        for cap in agent.capabilities:
            if cap.capability_type == capability_type and cap.enabled:
                if sphere:
                    if not cap.allowed_spheres or sphere in cap.allowed_spheres:
                        return True
                else:
                    return True
        
        return False
    
    # =========================================================================
    # METRICS
    # =========================================================================
    
    async def update_metrics(
        self,
        agent_id: str,
        metrics_update: Dict[str, Any]
    ) -> AgentMetrics:
        """Update agent metrics"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {agent_id}")
        
        for key, value in metrics_update.items():
            if hasattr(agent.metrics, key):
                current = getattr(agent.metrics, key)
                if isinstance(value, (int, float)) and isinstance(current, (int, float)):
                    setattr(agent.metrics, key, current + value)
                else:
                    setattr(agent.metrics, key, value)
        
        agent.metrics.last_updated_at = datetime.utcnow()
        
        return agent.metrics
    
    async def record_task_completion(
        self,
        agent_id: str,
        success: bool,
        duration_ms: float,
        tokens_used: int = 0,
        api_calls: int = 0
    ) -> AgentMetrics:
        """Record task completion for metrics"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {agent_id}")
        
        agent.metrics.total_tasks += 1
        if success:
            agent.metrics.completed_tasks += 1
        else:
            agent.metrics.failed_tasks += 1
        
        # Update average duration
        total = agent.metrics.total_tasks
        current_avg = agent.metrics.avg_task_duration_ms
        agent.metrics.avg_task_duration_ms = (
            (current_avg * (total - 1) + duration_ms) / total
        )
        
        agent.metrics.tokens_consumed += tokens_used
        agent.metrics.api_calls_made += api_calls
        agent.metrics.last_updated_at = datetime.utcnow()
        
        return agent.metrics
    
    async def record_action(
        self,
        agent_id: str,
        action_type: str,
        approved: bool,
        duration_ms: float
    ) -> AgentMetrics:
        """Record action for metrics"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {agent_id}")
        
        agent.metrics.total_actions += 1
        if approved:
            agent.metrics.approved_actions += 1
        else:
            agent.metrics.rejected_actions += 1
        
        # Update average duration
        total = agent.metrics.total_actions
        current_avg = agent.metrics.avg_action_duration_ms
        agent.metrics.avg_action_duration_ms = (
            (current_avg * (total - 1) + duration_ms) / total
        )
        
        agent.metrics.last_updated_at = datetime.utcnow()
        
        return agent.metrics
    
    async def record_checkpoint(
        self,
        agent_id: str,
        approved: bool
    ) -> AgentMetrics:
        """Record checkpoint for metrics"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {agent_id}")
        
        agent.metrics.checkpoints_triggered += 1
        if approved:
            agent.metrics.checkpoints_approved += 1
        else:
            agent.metrics.checkpoints_rejected += 1
        
        agent.metrics.last_updated_at = datetime.utcnow()
        
        return agent.metrics
    
    async def get_metrics(
        self,
        agent_id: str
    ) -> AgentMetrics:
        """Get agent metrics"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {agent_id}")
        
        return agent.metrics
    
    async def get_aggregate_metrics(
        self,
        tenant_id: Optional[str] = None,
        category: Optional[AgentCategory] = None
    ) -> Dict[str, Any]:
        """Get aggregate metrics across agents"""
        
        agents = list(self.agents.values())
        
        if tenant_id:
            agents = [a for a in agents if a.tenant_id == tenant_id]
        if category:
            agents = [a for a in agents if a.category == category]
        
        if not agents:
            return {}
        
        return {
            "agent_count": len(agents),
            "total_tasks": sum(a.metrics.total_tasks for a in agents),
            "completed_tasks": sum(a.metrics.completed_tasks for a in agents),
            "failed_tasks": sum(a.metrics.failed_tasks for a in agents),
            "total_actions": sum(a.metrics.total_actions for a in agents),
            "total_checkpoints": sum(a.metrics.checkpoints_triggered for a in agents),
            "tokens_consumed": sum(a.metrics.tokens_consumed for a in agents),
            "api_calls_made": sum(a.metrics.api_calls_made for a in agents),
            "avg_task_duration_ms": (
                sum(a.metrics.avg_task_duration_ms for a in agents) / len(agents)
            ),
            "success_rate": (
                sum(a.metrics.completed_tasks for a in agents) /
                max(sum(a.metrics.total_tasks for a in agents), 1)
            )
        }
    
    # =========================================================================
    # QUERIES
    # =========================================================================
    
    async def get_agent(self, agent_id: str) -> Optional[RegisteredAgent]:
        """Get agent by ID"""
        return self.agents.get(agent_id)
    
    async def find_agents(self, query: AgentQuery) -> List[RegisteredAgent]:
        """Find agents matching query"""
        
        results = list(self.agents.values())
        
        if query.level:
            results = [a for a in results if a.level == query.level]
        
        if query.category:
            results = [a for a in results if a.category == query.category]
        
        if query.agent_type:
            results = [a for a in results if a.agent_type == query.agent_type]
        
        if query.status:
            results = [a for a in results if a.status == query.status]
        
        if query.sphere:
            results = [a for a in results if a.sphere == query.sphere]
        
        if query.tenant_id:
            results = [a for a in results if a.tenant_id == query.tenant_id]
        
        if query.capability_type:
            results = [
                a for a in results
                if any(c.capability_type == query.capability_type for c in a.capabilities)
            ]
        
        if query.tags:
            results = [
                a for a in results
                if any(tag in a.tags for tag in query.tags)
            ]
        
        # Apply pagination
        start = query.offset
        end = start + query.limit
        
        return results[start:end]
    
    async def find_by_capability(
        self,
        capability_type: CapabilityType,
        sphere: Optional[str] = None,
        status: Optional[AgentStatus] = None
    ) -> List[RegisteredAgent]:
        """Find agents with a specific capability"""
        
        results = []
        
        for agent in self.agents.values():
            if status and agent.status != status:
                continue
            
            if self.has_capability(agent.agent_id, capability_type, sphere):
                results.append(agent)
        
        return results
    
    async def get_available_agents(
        self,
        category: Optional[AgentCategory] = None,
        sphere: Optional[str] = None
    ) -> List[RegisteredAgent]:
        """Get agents available for work"""
        
        available_statuses = [AgentStatus.IDLE, AgentStatus.ACTIVE]
        
        results = [
            a for a in self.agents.values()
            if a.status in available_statuses
        ]
        
        if category:
            results = [a for a in results if a.category == category]
        
        if sphere:
            results = [a for a in results if not a.sphere or a.sphere == sphere]
        
        return results
    
    async def get_agent_hierarchy(
        self,
        agent_id: str
    ) -> Dict[str, Any]:
        """Get agent hierarchy (parent and children)"""
        
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent not found: {agent_id}")
        
        parent = None
        if agent.parent_agent_id:
            parent = self.agents.get(agent.parent_agent_id)
        
        children = [
            self.agents.get(child_id)
            for child_id in agent.child_agent_ids
            if child_id in self.agents
        ]
        
        return {
            "agent": agent,
            "parent": parent,
            "children": children
        }
    
    # =========================================================================
    # TEMPLATES
    # =========================================================================
    
    async def create_template(
        self,
        name: str,
        level: AgentLevel,
        category: AgentCategory,
        agent_type: str,
        description: str = "",
        capabilities: Optional[List[AgentCapability]] = None,
        config: Optional[AgentConfig] = None,
        required_spheres: Optional[List[str]] = None,
        max_instances: int = 100
    ) -> AgentTemplate:
        """Create a new agent template"""
        
        template = AgentTemplate(
            name=name,
            description=description,
            level=level,
            category=category,
            agent_type=agent_type,
            capabilities=capabilities or [],
            config=config or AgentConfig(),
            required_spheres=required_spheres or [],
            max_instances=max_instances
        )
        
        self.templates[template.template_id] = template
        
        logger.info(f"Template created: {template.template_id} ({name})")
        return template
    
    async def get_template(self, template_id: str) -> Optional[AgentTemplate]:
        """Get template by ID"""
        return self.templates.get(template_id)
    
    async def list_templates(
        self,
        category: Optional[AgentCategory] = None,
        level: Optional[AgentLevel] = None
    ) -> List[AgentTemplate]:
        """List available templates"""
        
        templates = list(self.templates.values())
        
        if category:
            templates = [t for t in templates if t.category == category]
        if level:
            templates = [t for t in templates if t.level == level]
        
        return [t for t in templates if t.enabled]
    
    async def update_template(
        self,
        template_id: str,
        updates: Dict[str, Any]
    ) -> AgentTemplate:
        """Update a template"""
        
        template = self.templates.get(template_id)
        if not template:
            raise ValueError(f"Template not found: {template_id}")
        
        for key, value in updates.items():
            if hasattr(template, key):
                setattr(template, key, value)
        
        return template
    
    async def disable_template(self, template_id: str) -> AgentTemplate:
        """Disable a template"""
        return await self.update_template(template_id, {"enabled": False})
    
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
    
    # =========================================================================
    # STATISTICS
    # =========================================================================
    
    async def get_statistics(self) -> Dict[str, Any]:
        """Get registry statistics"""
        
        by_status = defaultdict(int)
        by_level = defaultdict(int)
        by_category = defaultdict(int)
        
        for agent in self.agents.values():
            by_status[agent.status.value] += 1
            by_level[agent.level.value] += 1
            by_category[agent.category.value] += 1
        
        return {
            "total_agents": len(self.agents),
            "total_templates": len(self.templates),
            "by_status": dict(by_status),
            "by_level": dict(by_level),
            "by_category": dict(by_category),
            "active_agents": by_status.get("active", 0) + by_status.get("busy", 0),
            "idle_agents": by_status.get("idle", 0)
        }


# ============================================================================
# FACTORY
# ============================================================================

_registry_instance: Optional[AgentRegistryService] = None


def get_agent_registry() -> AgentRegistryService:
    """Get or create agent registry instance"""
    global _registry_instance
    if _registry_instance is None:
        _registry_instance = AgentRegistryService()
    return _registry_instance
