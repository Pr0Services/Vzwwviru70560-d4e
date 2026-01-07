"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                    CHE·NU™ V72 — PYDANTIC SCHEMAS                            ║
║                                                                              ║
║  All API request/response models                                             ║
║  GOUVERNANCE > EXÉCUTION                                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Generic, TypeVar, Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

T = TypeVar("T")

# ═══════════════════════════════════════════════════════════════════════════════
# BASE MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class ApiResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""
    success: bool
    data: Optional[T] = None
    message: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None

class PaginationMeta(BaseModel):
    """Pagination metadata."""
    page: int
    limit: int
    total: int
    has_more: bool

# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class ThreadStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class MaturityLevel(str, Enum):
    SEED = "SEED"
    SPROUTING = "SPROUTING"
    GROWING = "GROWING"
    MATURE = "MATURE"
    RIPE = "RIPE"

class DecisionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    DEFERRED = "deferred"
    EXPIRED = "expired"

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AgingLevel(str, Enum):
    GREEN = "GREEN"
    YELLOW = "YELLOW"
    RED = "RED"
    BLINK = "BLINK"
    ARCHIVE = "ARCHIVE"

class CheckpointStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class SignalLevel(str, Enum):
    INFO = "info"
    ATTENTION = "attention"
    WARNING = "warning"
    CRITICAL = "critical"
    BLOCKED = "blocked"

class NotificationType(str, Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"
    CHECKPOINT = "checkpoint"
    DECISION = "decision"

class MessageRole(str, Enum):
    USER = "user"
    NOVA = "nova"
    SYSTEM = "system"

class SuggestionType(str, Enum):
    RECOMMENDATION = "recommendation"
    WARNING = "warning"
    INFO = "info"

class AuditEventType(str, Enum):
    CHECKPOINT = "checkpoint"
    DECISION = "decision"
    AGENT_ACTION = "agent_action"
    DATA_ACCESS = "data_access"
    CONFIG_CHANGE = "config_change"

# ═══════════════════════════════════════════════════════════════════════════════
# AUTH MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class UserPreferences(BaseModel):
    """User preferences."""
    theme: str = "dark"
    language: str = "fr"
    notifications_enabled: bool = True

class User(BaseModel):
    """User model."""
    id: str
    email: str
    username: str
    avatar_url: Optional[str] = None
    created_at: datetime
    preferences: Optional[UserPreferences] = None

class LoginRequest(BaseModel):
    """Login request."""
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    """Login response."""
    user: User
    access_token: str
    refresh_token: str
    expires_at: datetime

# ═══════════════════════════════════════════════════════════════════════════════
# SPHERE MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class SphereStats(BaseModel):
    """Sphere statistics."""
    threads_count: int = 0
    decisions_count: int = 0
    agents_count: int = 0
    files_count: int = 0
    meetings_count: int = 0

class Sphere(BaseModel):
    """Sphere model."""
    id: str
    name_fr: str
    name_en: str
    description_fr: str
    description_en: str
    icon: str
    color: str
    order: int
    stats: SphereStats = Field(default_factory=SphereStats)

# ═══════════════════════════════════════════════════════════════════════════════
# THREAD MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Thread(BaseModel):
    """Thread model."""
    id: str
    title: str
    founding_intent: str
    sphere_id: str
    status: str = "active"
    maturity_level: str = "SEED"
    maturity_score: int = 0
    events_count: int = 0
    decisions_count: int = 0
    created_at: datetime
    updated_at: datetime
    last_activity_at: datetime

class CreateThreadRequest(BaseModel):
    """Create thread request."""
    title: str = Field(..., min_length=3, max_length=200)
    founding_intent: str = Field(..., min_length=10, max_length=1000)
    sphere_id: str

class UpdateThreadRequest(BaseModel):
    """Update thread request."""
    title: Optional[str] = None
    status: Optional[str] = None

# ═══════════════════════════════════════════════════════════════════════════════
# DECISION MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class DecisionOption(BaseModel):
    """Decision option."""
    id: str
    label: str
    description: str
    pros: List[str] = []
    cons: List[str] = []
    estimated_impact: str = "medium"

class AISuggestion(BaseModel):
    """AI suggestion for decision."""
    id: str
    type: str  # recommendation, warning, info
    content: str
    confidence: float = Field(..., ge=0, le=1)
    source: str

class Decision(BaseModel):
    """Decision model."""
    id: str
    title: str
    description: str
    context: str
    sphere_id: str
    thread_id: Optional[str] = None
    status: str = "pending"
    priority: str = "medium"
    aging_level: str = "GREEN"
    aging_started_at: datetime
    deadline: Optional[datetime] = None
    options: List[DecisionOption] = []
    ai_suggestions: List[AISuggestion] = []
    created_at: datetime
    updated_at: datetime

class MakeDecisionRequest(BaseModel):
    """Make decision request."""
    decision_id: str
    selected_option_id: str
    notes: Optional[str] = None

class DecisionStats(BaseModel):
    """Decision statistics."""
    total: int
    by_aging: Dict[str, int]
    by_priority: Dict[str, int]

# ═══════════════════════════════════════════════════════════════════════════════
# AGENT MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Agent(BaseModel):
    """Agent model."""
    id: str
    name_fr: str
    name_en: str
    level: int = Field(..., ge=0, le=3)
    domain: str
    capabilities: List[str] = []
    description_fr: str
    description_en: str
    personality: str
    communication_style: str
    cost: int
    is_system: bool = False
    is_hired: bool = False
    hired_at: Optional[datetime] = None

class HireAgentRequest(BaseModel):
    """Hire agent request."""
    agent_id: str
    sphere_id: Optional[str] = None

class AgentSuggestion(BaseModel):
    """Agent suggestion."""
    agent_id: str
    reason: str
    relevance_score: float = Field(..., ge=0, le=1)

class AgentSuggestionContext(BaseModel):
    """Context for agent suggestions."""
    sphere_id: Optional[str] = None
    thread_id: Optional[str] = None
    task_description: Optional[str] = None

class AgentStats(BaseModel):
    """Agent statistics."""
    total: int
    hired: int
    by_level: Dict[int, int]
    by_domain: Dict[str, int]

# ═══════════════════════════════════════════════════════════════════════════════
# CHECKPOINT MODELS (GOVERNANCE)
# ═══════════════════════════════════════════════════════════════════════════════

class Checkpoint(BaseModel):
    """Checkpoint model."""
    id: str
    action_type: str
    description: str
    requested_by: str
    status: str = "pending"
    risk_level: str = "low"
    context: Optional[Dict[str, Any]] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None
    resolved_by: Optional[str] = None

class ResolveCheckpointRequest(BaseModel):
    """Resolve checkpoint request."""
    checkpoint_id: str
    action: str  # approve or reject
    notes: Optional[str] = None

# ═══════════════════════════════════════════════════════════════════════════════
# NOVA MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class NovaMessage(BaseModel):
    """Nova chat message."""
    id: str
    role: str  # user, nova, system
    content: str
    timestamp: datetime
    checkpoint: Optional[Checkpoint] = None

class NovaChatRequest(BaseModel):
    """Nova chat request."""
    message: str = Field(..., min_length=1, max_length=4000)
    context: Optional[Dict[str, str]] = None

class NovaChatResponse(BaseModel):
    """Nova chat response."""
    message: NovaMessage
    suggestions: List[AgentSuggestion] = []
    checkpoint: Optional[Checkpoint] = None

# ═══════════════════════════════════════════════════════════════════════════════
# GOVERNANCE MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class CheckpointMetrics(BaseModel):
    """Checkpoint metrics."""
    total: int
    pending: int
    approved: int
    rejected: int
    approval_rate: float
    avg_response_time_hours: float

class AgentMetrics(BaseModel):
    """Agent metrics."""
    total_hired: int
    active: int
    actions_today: int
    blocked_actions: int

class DecisionMetrics(BaseModel):
    """Decision metrics."""
    total_pending: int
    blink_count: int
    avg_aging_days: float

class DataMetrics(BaseModel):
    """Data metrics."""
    total_threads: int
    total_events: int
    data_points_protected: int

class GovernanceMetrics(BaseModel):
    """Complete governance metrics."""
    checkpoints: CheckpointMetrics
    agents: AgentMetrics
    decisions: DecisionMetrics
    data: DataMetrics

class GovernanceSignal(BaseModel):
    """Governance signal."""
    id: str
    level: str  # info, attention, warning, critical, blocked
    title: str
    description: str
    source: str
    timestamp: datetime
    resolved: bool = False

class AuditEvent(BaseModel):
    """Audit event."""
    id: str
    type: str  # checkpoint, decision, agent_action, data_access, config_change
    action: str
    actor: str
    target: Optional[str] = None
    sphere_id: Optional[str] = None
    details: Dict[str, Any] = {}
    timestamp: datetime

# ═══════════════════════════════════════════════════════════════════════════════
# NOTIFICATION MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class Notification(BaseModel):
    """Notification model."""
    id: str
    type: str  # info, success, warning, error, checkpoint, decision
    title: str
    message: str
    read: bool = False
    action_url: Optional[str] = None
    created_at: datetime

# ═══════════════════════════════════════════════════════════════════════════════
# SEARCH MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class SearchResults(BaseModel):
    """Search results."""
    threads: List[Thread] = []
    decisions: List[Decision] = []
    agents: List[Agent] = []
    files: List[Dict[str, Any]] = []

# ═══════════════════════════════════════════════════════════════════════════════
# DASHBOARD MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class DashboardStats(BaseModel):
    """Dashboard statistics."""
    decisions_pending: int
    threads_active: int
    agents_hired: int
    checkpoints_pending: int
    governance_score: int = Field(..., ge=0, le=100)
