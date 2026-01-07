"""
CHE·NU V71 - Agent & Orchestration API Routes
REST API for agent management, task execution, and workflow orchestration.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel, Field
from uuid import uuid4

from ..services.agent_service import (
    AgentService, AgentConfig, AgentType, AgentStatus, AgentCapability,
    TaskDefinition, TaskPriority, TaskStatus, CapabilityType, TokenBudget
)
from ..services.orchestration_service import (
    OrchestrationService, WorkflowDefinition, WorkflowStep,
    WorkflowStatus, DelegationStrategy, CollaborationType
)


# ============================================================================
# ROUTER SETUP
# ============================================================================

router = APIRouter()

# Services (would be dependency injected in production)
_agent_service: Optional[AgentService] = None
_orchestration_service: Optional[OrchestrationService] = None


def get_agent_service() -> AgentService:
    global _agent_service
    if not _agent_service:
        _agent_service = AgentService()
    return _agent_service


def get_orchestration_service() -> OrchestrationService:
    global _orchestration_service
    if not _orchestration_service:
        _orchestration_service = OrchestrationService(get_agent_service())
    return _orchestration_service


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

# Agent Models
class CapabilityRequest(BaseModel):
    type: str
    level: int = Field(ge=1, le=10)
    parameters: Dict[str, Any] = {}
    enabled: bool = True


class TokenBudgetRequest(BaseModel):
    total: int = Field(gt=0)


class CreateAgentRequest(BaseModel):
    name: str = Field(min_length=1)
    type: str
    description: str = ""
    capabilities: List[CapabilityRequest] = []
    token_budget: int = 100000
    max_concurrent_tasks: int = Field(default=5, ge=1, le=20)
    timeout_seconds: int = Field(default=300, ge=30)
    sphere_scope: List[str] = []
    metadata: Dict[str, Any] = {}


class UpdateAgentStatusRequest(BaseModel):
    status: str
    error_message: Optional[str] = None


class AgentResponse(BaseModel):
    agent_id: str
    name: str
    type: str
    status: str
    capabilities: List[Dict[str, Any]]
    token_budget: Dict[str, Any]
    current_tasks: List[str]
    completed_tasks: int
    failed_tasks: int
    total_tokens_used: int
    is_available: bool
    created_at: str


# Task Models
class CreateTaskRequest(BaseModel):
    name: str = Field(min_length=1)
    description: str = ""
    required_capabilities: List[str] = []
    input_data: Dict[str, Any] = {}
    priority: str = "normal"
    timeout_seconds: int = Field(default=300, ge=30)
    max_retries: int = Field(default=3, ge=0)
    estimated_tokens: int = Field(default=1000, gt=0)
    sphere: Optional[str] = None
    created_by: str = ""


class TaskResponse(BaseModel):
    task_id: str
    name: str
    status: str
    priority: str
    agent_id: Optional[str]
    result: Optional[Any]
    error: Optional[str]
    tokens_used: int
    retry_count: int
    duration_ms: Optional[int]
    created_at: str


# Workflow Models
class WorkflowStepRequest(BaseModel):
    name: str
    description: str = ""
    required_capabilities: List[str] = []
    input_mapping: Dict[str, str] = {}
    output_key: str = ""
    depends_on: List[str] = []
    timeout_seconds: int = 300
    max_retries: int = 3


class CreateWorkflowRequest(BaseModel):
    name: str = Field(min_length=1)
    description: str = ""
    steps: List[WorkflowStepRequest] = []
    collaboration_type: str = "sequential"
    delegation_strategy: str = "best_fit"
    requires_approval: bool = True
    timeout_seconds: int = 3600
    max_parallel_steps: int = 5
    sphere: Optional[str] = None
    created_by: str = ""


class ExecuteWorkflowRequest(BaseModel):
    input_data: Dict[str, Any] = {}
    team_id: Optional[str] = None


class WorkflowResponse(BaseModel):
    execution_id: str
    name: str
    status: str
    progress: float
    steps: List[Dict[str, Any]]
    input_data: Dict[str, Any]
    output_data: Dict[str, Any]
    approved_by: Optional[str]
    error: Optional[str]
    duration_ms: Optional[int]
    created_at: str


# Team Models
class CreateTeamRequest(BaseModel):
    name: str = Field(min_length=1)
    agent_ids: List[str]
    lead_agent_id: Optional[str] = None
    delegation_strategy: str = "best_fit"
    sphere: Optional[str] = None
    created_by: str = ""


class TeamResponse(BaseModel):
    team_id: str
    name: str
    agent_ids: List[str]
    lead_agent_id: Optional[str]
    delegation_strategy: str
    created_at: str


# ============================================================================
# AGENT ENDPOINTS
# ============================================================================

@router.post("/agents", response_model=AgentResponse, tags=["Agents"])
async def create_agent(request: CreateAgentRequest):
    """Register a new agent."""
    service = get_agent_service()
    
    try:
        agent_type = AgentType(request.type)
    except ValueError:
        raise HTTPException(400, f"Invalid agent type: {request.type}")
    
    capabilities = []
    for cap in request.capabilities:
        try:
            cap_type = CapabilityType(cap.type)
            capabilities.append(AgentCapability(
                type=cap_type,
                level=cap.level,
                parameters=cap.parameters,
                enabled=cap.enabled
            ))
        except ValueError:
            raise HTTPException(400, f"Invalid capability type: {cap.type}")
    
    config = AgentConfig(
        agent_id=str(uuid4()),
        name=request.name,
        type=agent_type,
        description=request.description,
        capabilities=capabilities,
        token_budget=TokenBudget(total=request.token_budget),
        max_concurrent_tasks=request.max_concurrent_tasks,
        timeout_seconds=request.timeout_seconds,
        sphere_scope=request.sphere_scope,
        metadata=request.metadata
    )
    
    agent = await service.register_agent(config)
    return _format_agent_response(agent)


@router.get("/agents", response_model=List[AgentResponse], tags=["Agents"])
async def list_agents(
    status: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    capability: Optional[str] = Query(None)
):
    """List all agents with optional filters."""
    service = get_agent_service()
    
    status_filter = AgentStatus(status) if status else None
    type_filter = AgentType(type) if type else None
    cap_filter = CapabilityType(capability) if capability else None
    
    agents = await service.list_agents(status_filter, type_filter, cap_filter)
    return [_format_agent_response(a) for a in agents]


@router.get("/agents/{agent_id}", response_model=AgentResponse, tags=["Agents"])
async def get_agent(agent_id: str):
    """Get agent by ID."""
    service = get_agent_service()
    agent = await service.get_agent(agent_id)
    
    if not agent:
        raise HTTPException(404, f"Agent {agent_id} not found")
    
    return _format_agent_response(agent)


@router.put("/agents/{agent_id}/status", response_model=AgentResponse, tags=["Agents"])
async def update_agent_status(agent_id: str, request: UpdateAgentStatusRequest):
    """Update agent status."""
    service = get_agent_service()
    
    try:
        status = AgentStatus(request.status)
    except ValueError:
        raise HTTPException(400, f"Invalid status: {request.status}")
    
    try:
        agent = await service.update_agent_status(agent_id, status, request.error_message)
        return _format_agent_response(agent)
    except ValueError as e:
        raise HTTPException(404, str(e))


@router.post("/agents/{agent_id}/pause", response_model=AgentResponse, tags=["Agents"])
async def pause_agent(agent_id: str):
    """Pause an agent."""
    service = get_agent_service()
    try:
        agent = await service.pause_agent(agent_id)
        return _format_agent_response(agent)
    except ValueError as e:
        raise HTTPException(404, str(e))


@router.post("/agents/{agent_id}/resume", response_model=AgentResponse, tags=["Agents"])
async def resume_agent(agent_id: str):
    """Resume a paused agent."""
    service = get_agent_service()
    try:
        agent = await service.resume_agent(agent_id)
        return _format_agent_response(agent)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/agents/{agent_id}/terminate", response_model=AgentResponse, tags=["Agents"])
async def terminate_agent(agent_id: str):
    """Terminate an agent."""
    service = get_agent_service()
    try:
        agent = await service.terminate_agent(agent_id)
        return _format_agent_response(agent)
    except ValueError as e:
        raise HTTPException(404, str(e))


@router.post("/agents/{agent_id}/capabilities", response_model=AgentResponse, tags=["Agents"])
async def add_agent_capability(agent_id: str, request: CapabilityRequest):
    """Add capability to agent."""
    service = get_agent_service()
    
    try:
        cap_type = CapabilityType(request.type)
    except ValueError:
        raise HTTPException(400, f"Invalid capability type: {request.type}")
    
    capability = AgentCapability(
        type=cap_type,
        level=request.level,
        parameters=request.parameters,
        enabled=request.enabled
    )
    
    try:
        agent = await service.add_capability(agent_id, capability)
        return _format_agent_response(agent)
    except ValueError as e:
        raise HTTPException(404, str(e))


@router.get("/agents/{agent_id}/health", tags=["Agents"])
async def get_agent_health(agent_id: str):
    """Get agent health status."""
    service = get_agent_service()
    try:
        health = await service.get_agent_health(agent_id)
        return {
            "agent_id": health.agent_id,
            "status": health.status.value,
            "is_healthy": health.is_healthy,
            "response_time_ms": health.response_time_ms,
            "error_rate": health.error_rate,
            "task_queue_size": health.task_queue_size,
            "token_utilization": health.token_utilization,
            "last_heartbeat": health.last_heartbeat.isoformat(),
            "issues": health.issues
        }
    except ValueError as e:
        raise HTTPException(404, str(e))


@router.put("/agents/{agent_id}/token-budget", tags=["Agents"])
async def update_token_budget(
    agent_id: str,
    total: Optional[int] = Query(None),
    reset: bool = Query(False)
):
    """Update agent token budget."""
    service = get_agent_service()
    try:
        budget = await service.update_token_budget(agent_id, total, reset)
        return {
            "total": budget.total,
            "used": budget.used,
            "reserved": budget.reserved,
            "available": budget.available,
            "utilization": budget.utilization,
            "reset_at": budget.reset_at.isoformat() if budget.reset_at else None
        }
    except ValueError as e:
        raise HTTPException(404, str(e))


# ============================================================================
# TASK ENDPOINTS
# ============================================================================

@router.post("/tasks", response_model=TaskResponse, tags=["Tasks"])
async def create_task(request: CreateTaskRequest):
    """Create a new task."""
    service = get_agent_service()
    
    capabilities = []
    for cap in request.required_capabilities:
        try:
            capabilities.append(CapabilityType(cap))
        except ValueError:
            raise HTTPException(400, f"Invalid capability: {cap}")
    
    try:
        priority = TaskPriority(request.priority)
    except ValueError:
        raise HTTPException(400, f"Invalid priority: {request.priority}")
    
    definition = TaskDefinition(
        task_id=str(uuid4()),
        name=request.name,
        description=request.description,
        required_capabilities=capabilities,
        input_data=request.input_data,
        priority=priority,
        timeout_seconds=request.timeout_seconds,
        max_retries=request.max_retries,
        estimated_tokens=request.estimated_tokens,
        sphere=request.sphere,
        created_by=request.created_by
    )
    
    task = await service.create_task(definition)
    return _format_task_response(task)


@router.get("/tasks", response_model=List[TaskResponse], tags=["Tasks"])
async def list_tasks(
    status: Optional[str] = Query(None),
    agent_id: Optional[str] = Query(None),
    priority: Optional[str] = Query(None)
):
    """List all tasks with optional filters."""
    service = get_agent_service()
    
    status_filter = TaskStatus(status) if status else None
    priority_filter = TaskPriority(priority) if priority else None
    
    tasks = await service.list_tasks(status_filter, agent_id, priority_filter)
    return [_format_task_response(t) for t in tasks]


@router.get("/tasks/{task_id}", response_model=TaskResponse, tags=["Tasks"])
async def get_task(task_id: str):
    """Get task by ID."""
    service = get_agent_service()
    task = await service.get_task(task_id)
    
    if not task:
        raise HTTPException(404, f"Task {task_id} not found")
    
    return _format_task_response(task)


@router.post("/tasks/{task_id}/assign/{agent_id}", response_model=TaskResponse, tags=["Tasks"])
async def assign_task(task_id: str, agent_id: str):
    """Assign task to agent."""
    service = get_agent_service()
    try:
        task = await service.assign_task(task_id, agent_id)
        return _format_task_response(task)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/tasks/{task_id}/execute", response_model=TaskResponse, tags=["Tasks"])
async def execute_task(task_id: str):
    """Execute an assigned task."""
    service = get_agent_service()
    try:
        task = await service.execute_task(task_id)
        return _format_task_response(task)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/tasks/{task_id}/cancel", response_model=TaskResponse, tags=["Tasks"])
async def cancel_task(task_id: str, reason: str = Query("Cancelled by user")):
    """Cancel a task."""
    service = get_agent_service()
    try:
        task = await service.cancel_task(task_id, reason)
        return _format_task_response(task)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/tasks/{task_id}/retry", response_model=TaskResponse, tags=["Tasks"])
async def retry_task(task_id: str):
    """Retry a failed task."""
    service = get_agent_service()
    try:
        task = await service.retry_task(task_id)
        return _format_task_response(task)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/tasks/auto-assign", tags=["Tasks"])
async def auto_assign_tasks():
    """Auto-assign pending tasks to available agents."""
    service = get_agent_service()
    assigned = await service.auto_assign_pending_tasks()
    return {
        "assigned_count": len(assigned),
        "tasks": [_format_task_response(t) for t in assigned]
    }


# ============================================================================
# WORKFLOW ENDPOINTS
# ============================================================================

@router.post("/workflows", response_model=WorkflowResponse, tags=["Workflows"])
async def create_workflow(request: CreateWorkflowRequest, input_data: Dict[str, Any] = Body({})):
    """Create a new workflow."""
    service = get_orchestration_service()
    
    try:
        collab_type = CollaborationType(request.collaboration_type)
    except ValueError:
        raise HTTPException(400, f"Invalid collaboration type: {request.collaboration_type}")
    
    try:
        delegation_strategy = DelegationStrategy(request.delegation_strategy)
    except ValueError:
        raise HTTPException(400, f"Invalid delegation strategy: {request.delegation_strategy}")
    
    steps = []
    for i, step_req in enumerate(request.steps):
        capabilities = []
        for cap in step_req.required_capabilities:
            try:
                capabilities.append(CapabilityType(cap))
            except ValueError:
                raise HTTPException(400, f"Invalid capability: {cap}")
        
        steps.append(WorkflowStep(
            step_id=str(uuid4()),
            name=step_req.name,
            description=step_req.description,
            required_capabilities=capabilities,
            input_mapping=step_req.input_mapping,
            output_key=step_req.output_key,
            depends_on=step_req.depends_on,
            timeout_seconds=step_req.timeout_seconds,
            max_retries=step_req.max_retries
        ))
    
    # Update depends_on references to use generated IDs
    step_name_to_id = {s.name: s.step_id for s in steps}
    for step in steps:
        step.depends_on = [
            step_name_to_id.get(dep, dep) for dep in step.depends_on
        ]
    
    definition = WorkflowDefinition(
        workflow_id=str(uuid4()),
        name=request.name,
        description=request.description,
        steps=steps,
        collaboration_type=collab_type,
        delegation_strategy=delegation_strategy,
        requires_approval=request.requires_approval,
        timeout_seconds=request.timeout_seconds,
        max_parallel_steps=request.max_parallel_steps,
        sphere=request.sphere,
        created_by=request.created_by
    )
    
    execution = await service.create_workflow(definition, input_data)
    return _format_workflow_response(execution)


@router.get("/workflows", response_model=List[WorkflowResponse], tags=["Workflows"])
async def list_workflows(status: Optional[str] = Query(None)):
    """List all workflows with optional filter."""
    service = get_orchestration_service()
    
    status_filter = WorkflowStatus(status) if status else None
    workflows = await service.list_workflows(status_filter)
    return [_format_workflow_response(w) for w in workflows]


@router.get("/workflows/{execution_id}", response_model=WorkflowResponse, tags=["Workflows"])
async def get_workflow(execution_id: str):
    """Get workflow by ID."""
    service = get_orchestration_service()
    workflow = await service.get_workflow(execution_id)
    
    if not workflow:
        raise HTTPException(404, f"Workflow {execution_id} not found")
    
    return _format_workflow_response(workflow)


@router.post("/workflows/{execution_id}/submit", response_model=WorkflowResponse, tags=["Workflows"])
async def submit_workflow(execution_id: str):
    """Submit workflow for approval."""
    service = get_orchestration_service()
    try:
        workflow = await service.submit_for_approval(execution_id)
        return _format_workflow_response(workflow)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/workflows/{execution_id}/approve", response_model=WorkflowResponse, tags=["Workflows"])
async def approve_workflow(execution_id: str, approved_by: str = Query(...)):
    """Approve workflow for execution."""
    service = get_orchestration_service()
    try:
        workflow = await service.approve_workflow(execution_id, approved_by)
        return _format_workflow_response(workflow)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/workflows/{execution_id}/reject", response_model=WorkflowResponse, tags=["Workflows"])
async def reject_workflow(
    execution_id: str,
    rejected_by: str = Query(...),
    reason: str = Query(...)
):
    """Reject a workflow."""
    service = get_orchestration_service()
    try:
        workflow = await service.reject_workflow(execution_id, rejected_by, reason)
        return _format_workflow_response(workflow)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/workflows/{execution_id}/execute", response_model=WorkflowResponse, tags=["Workflows"])
async def execute_workflow(execution_id: str, request: ExecuteWorkflowRequest = Body(...)):
    """Execute an approved workflow."""
    service = get_orchestration_service()
    try:
        workflow = await service.execute_workflow(execution_id, request.team_id)
        return _format_workflow_response(workflow)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/workflows/{execution_id}/pause", response_model=WorkflowResponse, tags=["Workflows"])
async def pause_workflow(execution_id: str):
    """Pause a running workflow."""
    service = get_orchestration_service()
    try:
        workflow = await service.pause_workflow(execution_id)
        return _format_workflow_response(workflow)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/workflows/{execution_id}/resume", response_model=WorkflowResponse, tags=["Workflows"])
async def resume_workflow(execution_id: str):
    """Resume a paused workflow."""
    service = get_orchestration_service()
    try:
        workflow = await service.resume_workflow(execution_id)
        return _format_workflow_response(workflow)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/workflows/{execution_id}/cancel", response_model=WorkflowResponse, tags=["Workflows"])
async def cancel_workflow(execution_id: str, reason: str = Query("Cancelled by user")):
    """Cancel a workflow."""
    service = get_orchestration_service()
    try:
        workflow = await service.cancel_workflow(execution_id, reason)
        return _format_workflow_response(workflow)
    except ValueError as e:
        raise HTTPException(400, str(e))


# ============================================================================
# TEAM ENDPOINTS
# ============================================================================

@router.post("/teams", response_model=TeamResponse, tags=["Teams"])
async def create_team(request: CreateTeamRequest):
    """Create an agent team."""
    service = get_orchestration_service()
    
    try:
        delegation_strategy = DelegationStrategy(request.delegation_strategy)
    except ValueError:
        raise HTTPException(400, f"Invalid delegation strategy: {request.delegation_strategy}")
    
    try:
        team = await service.create_team(
            name=request.name,
            agent_ids=request.agent_ids,
            lead_agent_id=request.lead_agent_id,
            delegation_strategy=delegation_strategy,
            sphere=request.sphere,
            created_by=request.created_by
        )
        return _format_team_response(team)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.get("/teams", response_model=List[TeamResponse], tags=["Teams"])
async def list_teams():
    """List all teams."""
    service = get_orchestration_service()
    teams = await service.list_teams()
    return [_format_team_response(t) for t in teams]


@router.get("/teams/{team_id}", response_model=TeamResponse, tags=["Teams"])
async def get_team(team_id: str):
    """Get team by ID."""
    service = get_orchestration_service()
    team = await service.get_team(team_id)
    
    if not team:
        raise HTTPException(404, f"Team {team_id} not found")
    
    return _format_team_response(team)


@router.post("/teams/{team_id}/agents/{agent_id}", response_model=TeamResponse, tags=["Teams"])
async def add_agent_to_team(team_id: str, agent_id: str):
    """Add agent to team."""
    service = get_orchestration_service()
    try:
        team = await service.add_agent_to_team(team_id, agent_id)
        return _format_team_response(team)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.delete("/teams/{team_id}/agents/{agent_id}", response_model=TeamResponse, tags=["Teams"])
async def remove_agent_from_team(team_id: str, agent_id: str):
    """Remove agent from team."""
    service = get_orchestration_service()
    try:
        team = await service.remove_agent_from_team(team_id, agent_id)
        return _format_team_response(team)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.get("/teams/{team_id}/capabilities", tags=["Teams"])
async def get_team_capabilities(team_id: str):
    """Get capabilities available in a team."""
    service = get_orchestration_service()
    try:
        capabilities = await service.get_team_capabilities(team_id)
        return {
            cap.value: agent_ids
            for cap, agent_ids in capabilities.items()
        }
    except ValueError as e:
        raise HTTPException(404, str(e))


# ============================================================================
# STATISTICS ENDPOINTS
# ============================================================================

@router.get("/stats/agents", tags=["Statistics"])
async def get_agent_statistics():
    """Get agent system statistics."""
    service = get_agent_service()
    return await service.get_statistics()


@router.get("/stats/orchestration", tags=["Statistics"])
async def get_orchestration_statistics():
    """Get orchestration statistics."""
    service = get_orchestration_service()
    return await service.get_statistics()


@router.get("/stats/health", tags=["Statistics"])
async def get_all_health_status():
    """Get health status of all agents."""
    service = get_agent_service()
    health = await service.get_all_health_status()
    return {
        agent_id: {
            "status": h.status.value,
            "is_healthy": h.is_healthy,
            "error_rate": h.error_rate,
            "issues": h.issues
        }
        for agent_id, h in health.items()
    }


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def _format_agent_response(agent) -> AgentResponse:
    return AgentResponse(
        agent_id=agent.agent_id,
        name=agent.config.name,
        type=agent.config.type.value,
        status=agent.status.value,
        capabilities=[
            {
                "type": c.type.value,
                "level": c.level,
                "enabled": c.enabled
            }
            for c in agent.config.capabilities
        ],
        token_budget={
            "total": agent.config.token_budget.total,
            "used": agent.config.token_budget.used,
            "available": agent.config.token_budget.available,
            "utilization": agent.config.token_budget.utilization
        },
        current_tasks=agent.current_tasks,
        completed_tasks=agent.completed_tasks,
        failed_tasks=agent.failed_tasks,
        total_tokens_used=agent.total_tokens_used,
        is_available=agent.is_available,
        created_at=agent.created_at.isoformat()
    )


def _format_task_response(task) -> TaskResponse:
    return TaskResponse(
        task_id=task.task_id,
        name=task.task.name,
        status=task.status.value,
        priority=task.task.priority.value,
        agent_id=task.agent_id,
        result=task.result,
        error=task.error,
        tokens_used=task.tokens_used,
        retry_count=task.retry_count,
        duration_ms=task.duration_ms,
        created_at=task.created_at.isoformat()
    )


def _format_workflow_response(execution) -> WorkflowResponse:
    return WorkflowResponse(
        execution_id=execution.execution_id,
        name=execution.workflow.name,
        status=execution.status.value,
        progress=execution.progress,
        steps=[
            {
                "step_id": s.step_id,
                "name": s.name,
                "status": s.status.value,
                "agent_id": s.assigned_agent,
                "result": s.result,
                "error": s.error
            }
            for s in execution.workflow.steps
        ],
        input_data=execution.input_data,
        output_data=execution.output_data,
        approved_by=execution.approved_by,
        error=execution.error,
        duration_ms=execution.duration_ms,
        created_at=execution.created_at.isoformat()
    )


def _format_team_response(team) -> TeamResponse:
    return TeamResponse(
        team_id=team.team_id,
        name=team.name,
        agent_ids=team.agent_ids,
        lead_agent_id=team.lead_agent_id,
        delegation_strategy=team.delegation_strategy.value,
        created_at=team.created_at.isoformat()
    )
