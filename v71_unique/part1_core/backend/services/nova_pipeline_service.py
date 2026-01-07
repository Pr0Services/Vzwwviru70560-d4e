"""
CHE·NU™ V72 - Nova Pipeline Service
Core Multi-Lane Pipeline orchestration with checkpoints and governance integration.

This service implements the 7-lane pipeline architecture:
- Lane A: Intent Analysis
- Lane B: Context Snapshot
- Lane C: Semantic Encoding
- Lane D: Governance Rules
- Lane E: Checkpoint Blocking (HTTP 423)
- Lane F: Execution
- Lane G: Audit & Token Tracking

Principle: GOVERNANCE > EXECUTION
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Callable, Union
from dataclasses import dataclass, field
from enum import Enum
from uuid import uuid4
import hashlib
import json

logger = logging.getLogger(__name__)


# =============================================================================
# ENUMS & CONSTANTS
# =============================================================================

class PipelineStatus(str, Enum):
    """Pipeline execution status."""
    PENDING = "pending"
    RUNNING = "running"
    CHECKPOINT_PENDING = "checkpoint_pending"
    CHECKPOINT_APPROVED = "checkpoint_approved"
    CHECKPOINT_REJECTED = "checkpoint_rejected"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    TIMEOUT = "timeout"


class LaneStatus(str, Enum):
    """Individual lane status."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


class CheckpointType(str, Enum):
    """Types of checkpoints that can block execution."""
    GOVERNANCE = "governance"           # Governance rule violation
    COST = "cost"                       # Cost threshold exceeded
    IDENTITY = "identity"               # Cross-identity access
    SENSITIVE = "sensitive"             # Sensitive data access
    DATA_MODIFICATION = "data_modification"  # Data mutation
    EXTERNAL_API = "external_api"       # External API call
    HIGH_RISK = "high_risk"             # High-risk operation
    CUSTOM = "custom"                   # Custom checkpoint


class CheckpointDecision(str, Enum):
    """User decision on checkpoint."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    TIMEOUT = "timeout"


class LaneType(str, Enum):
    """The 7 lanes of the Nova Pipeline."""
    LANE_A_INTENT = "lane_a_intent"
    LANE_B_CONTEXT = "lane_b_context"
    LANE_C_ENCODING = "lane_c_encoding"
    LANE_D_GOVERNANCE = "lane_d_governance"
    LANE_E_CHECKPOINT = "lane_e_checkpoint"
    LANE_F_EXECUTION = "lane_f_execution"
    LANE_G_AUDIT = "lane_g_audit"


# =============================================================================
# DATA CLASSES
# =============================================================================

@dataclass
class LaneResult:
    """Result from a single lane execution."""
    lane_type: LaneType
    status: LaneStatus
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_ms: Optional[int] = None
    data: Dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class Checkpoint:
    """Checkpoint that blocks pipeline execution until user decision."""
    id: str
    pipeline_id: str
    checkpoint_type: CheckpointType
    reason: str
    decision: CheckpointDecision
    created_at: datetime
    decided_at: Optional[datetime] = None
    decided_by: Optional[str] = None
    context: Dict[str, Any] = field(default_factory=dict)
    options: List[str] = field(default_factory=lambda: ["approve", "reject"])
    timeout_minutes: int = 30
    metadata: Dict[str, Any] = field(default_factory=dict)

    def is_expired(self) -> bool:
        """Check if checkpoint has expired."""
        if self.decision != CheckpointDecision.PENDING:
            return False
        expiry = self.created_at + timedelta(minutes=self.timeout_minutes)
        return datetime.utcnow() > expiry


@dataclass
class PipelineMetrics:
    """Metrics for pipeline execution."""
    total_time_ms: int = 0
    tokens_used: int = 0
    tokens_input: int = 0
    tokens_output: int = 0
    llm_calls: int = 0
    api_calls: int = 0
    data_size_bytes: int = 0
    cost_estimate: float = 0.0


@dataclass
class PipelineContext:
    """Context passed through pipeline lanes."""
    user_id: str
    identity_id: str
    query: str
    original_input: Dict[str, Any]
    intent: Optional[Dict[str, Any]] = None
    context_snapshot: Optional[Dict[str, Any]] = None
    encoded_data: Optional[Dict[str, Any]] = None
    governance_result: Optional[Dict[str, Any]] = None
    checkpoint: Optional[Checkpoint] = None
    execution_result: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class PipelineResult:
    """Final result of pipeline execution."""
    pipeline_id: str
    status: PipelineStatus
    started_at: datetime
    completed_at: Optional[datetime] = None
    lanes: Dict[str, LaneResult] = field(default_factory=dict)
    result: Optional[Any] = None
    checkpoint: Optional[Checkpoint] = None
    metrics: PipelineMetrics = field(default_factory=PipelineMetrics)
    error: Optional[str] = None
    audit_id: Optional[str] = None


# =============================================================================
# LANE EXECUTORS
# =============================================================================

class LaneExecutor:
    """Base class for lane executors."""
    
    def __init__(self, lane_type: LaneType):
        self.lane_type = lane_type
    
    async def execute(self, context: PipelineContext) -> LaneResult:
        """Execute the lane. Override in subclasses."""
        raise NotImplementedError


class IntentAnalysisLane(LaneExecutor):
    """Lane A: Analyze user intent from query."""
    
    def __init__(self):
        super().__init__(LaneType.LANE_A_INTENT)
    
    async def execute(self, context: PipelineContext) -> LaneResult:
        """Analyze the intent of the user's query."""
        started_at = datetime.utcnow()
        
        try:
            # Intent classification
            query_lower = context.query.lower()
            
            # Determine primary intent
            intent_type = "general"
            confidence = 0.8
            
            # Check for specific intent patterns
            intent_patterns = {
                "create": ["create", "make", "add", "new", "build"],
                "read": ["get", "fetch", "list", "show", "view", "find", "search"],
                "update": ["update", "modify", "change", "edit", "set"],
                "delete": ["delete", "remove", "clear", "drop"],
                "analyze": ["analyze", "report", "summarize", "compare", "statistics"],
                "export": ["export", "download", "extract"],
                "import": ["import", "upload", "load"],
                "auth": ["login", "logout", "authenticate", "authorize"],
                "admin": ["configure", "setup", "admin", "manage", "settings"],
            }
            
            for intent, keywords in intent_patterns.items():
                if any(kw in query_lower for kw in keywords):
                    intent_type = intent
                    confidence = 0.9
                    break
            
            # Determine required resources
            required_resources = []
            resource_patterns = {
                "user": ["user", "account", "profile"],
                "data": ["data", "record", "entry", "item"],
                "file": ["file", "document", "attachment"],
                "thread": ["thread", "conversation", "chat"],
                "dataspace": ["dataspace", "workspace", "space"],
                "agent": ["agent", "assistant", "bot"],
            }
            
            for resource, keywords in resource_patterns.items():
                if any(kw in query_lower for kw in keywords):
                    required_resources.append(resource)
            
            # Check for sensitive operations
            is_sensitive = any(word in query_lower for word in [
                "delete", "remove", "password", "secret", "private",
                "payment", "credit", "financial", "medical", "legal"
            ])
            
            # Check for data modification
            is_mutation = intent_type in ["create", "update", "delete", "import"]
            
            # Build intent data
            intent_data = {
                "intent_type": intent_type,
                "confidence": confidence,
                "required_resources": required_resources,
                "is_sensitive": is_sensitive,
                "is_mutation": is_mutation,
                "requires_checkpoint": is_sensitive or (is_mutation and intent_type == "delete"),
                "extracted_entities": self._extract_entities(context.query),
                "estimated_complexity": self._estimate_complexity(context.query),
            }
            
            context.intent = intent_data
            
            completed_at = datetime.utcnow()
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.COMPLETED,
                started_at=started_at,
                completed_at=completed_at,
                duration_ms=int((completed_at - started_at).total_seconds() * 1000),
                data=intent_data,
            )
            
        except Exception as e:
            logger.error(f"Intent analysis failed: {e}")
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.FAILED,
                started_at=started_at,
                completed_at=datetime.utcnow(),
                error=str(e),
            )
    
    def _extract_entities(self, query: str) -> List[Dict[str, str]]:
        """Extract entities from query."""
        entities = []
        # Simple entity extraction - in production, use NLP
        words = query.split()
        for word in words:
            if word.startswith("@"):
                entities.append({"type": "mention", "value": word[1:]})
            elif word.startswith("#"):
                entities.append({"type": "tag", "value": word[1:]})
            elif word.isupper() and len(word) > 2:
                entities.append({"type": "acronym", "value": word})
        return entities
    
    def _estimate_complexity(self, query: str) -> str:
        """Estimate query complexity."""
        word_count = len(query.split())
        if word_count < 5:
            return "low"
        elif word_count < 20:
            return "medium"
        else:
            return "high"


class ContextSnapshotLane(LaneExecutor):
    """Lane B: Create context snapshot for execution."""
    
    def __init__(self):
        super().__init__(LaneType.LANE_B_CONTEXT)
    
    async def execute(self, context: PipelineContext) -> LaneResult:
        """Create immutable context snapshot."""
        started_at = datetime.utcnow()
        
        try:
            # Build context snapshot
            snapshot = {
                "snapshot_id": str(uuid4()),
                "created_at": started_at.isoformat(),
                "user_id": context.user_id,
                "identity_id": context.identity_id,
                "query": context.query,
                "intent": context.intent,
                "session": {
                    "active": True,
                    "started_at": datetime.utcnow().isoformat(),
                },
                "environment": {
                    "platform": "che-nu",
                    "version": "V72",
                },
                "permissions": await self._get_user_permissions(context.user_id),
                "quotas": await self._get_user_quotas(context.user_id),
                "active_dataspaces": await self._get_active_dataspaces(context.user_id),
            }
            
            # Create immutable hash
            snapshot["snapshot_hash"] = hashlib.sha256(
                json.dumps(snapshot, sort_keys=True, default=str).encode()
            ).hexdigest()[:16]
            
            context.context_snapshot = snapshot
            
            completed_at = datetime.utcnow()
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.COMPLETED,
                started_at=started_at,
                completed_at=completed_at,
                duration_ms=int((completed_at - started_at).total_seconds() * 1000),
                data=snapshot,
            )
            
        except Exception as e:
            logger.error(f"Context snapshot failed: {e}")
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.FAILED,
                started_at=started_at,
                completed_at=datetime.utcnow(),
                error=str(e),
            )
    
    async def _get_user_permissions(self, user_id: str) -> Dict[str, bool]:
        """Get user permissions."""
        # In production, fetch from database
        return {
            "can_read": True,
            "can_write": True,
            "can_delete": False,  # Requires checkpoint
            "can_admin": False,
            "can_export": True,
        }
    
    async def _get_user_quotas(self, user_id: str) -> Dict[str, Any]:
        """Get user quotas."""
        return {
            "tokens_remaining": 100000,
            "api_calls_remaining": 1000,
            "storage_mb_remaining": 5000,
        }
    
    async def _get_active_dataspaces(self, user_id: str) -> List[str]:
        """Get user's active dataspaces."""
        return ["default", "personal", "work"]


class SemanticEncodingLane(LaneExecutor):
    """Lane C: Semantic encoding for AI processing."""
    
    def __init__(self):
        super().__init__(LaneType.LANE_C_ENCODING)
    
    async def execute(self, context: PipelineContext) -> LaneResult:
        """Create semantic encoding of the request."""
        started_at = datetime.utcnow()
        
        try:
            # Build semantic encoding
            encoding = {
                "encoding_id": str(uuid4()),
                "created_at": started_at.isoformat(),
                "query_tokens": self._tokenize(context.query),
                "query_embedding_ref": f"emb_{uuid4().hex[:8]}",  # Reference to embedding
                "semantic_tags": self._extract_semantic_tags(context.query),
                "domain_classification": self._classify_domain(context.query),
                "language": "en",
                "sentiment": self._analyze_sentiment(context.query),
                "formality": self._analyze_formality(context.query),
                "intent_confidence": context.intent.get("confidence", 0.0) if context.intent else 0.0,
            }
            
            context.encoded_data = encoding
            
            completed_at = datetime.utcnow()
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.COMPLETED,
                started_at=started_at,
                completed_at=completed_at,
                duration_ms=int((completed_at - started_at).total_seconds() * 1000),
                data=encoding,
            )
            
        except Exception as e:
            logger.error(f"Semantic encoding failed: {e}")
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.FAILED,
                started_at=started_at,
                completed_at=datetime.utcnow(),
                error=str(e),
            )
    
    def _tokenize(self, text: str) -> int:
        """Estimate token count."""
        # Simple estimation: ~4 chars per token
        return len(text) // 4 + 1
    
    def _extract_semantic_tags(self, text: str) -> List[str]:
        """Extract semantic tags from text."""
        tags = []
        text_lower = text.lower()
        
        tag_patterns = {
            "data": ["data", "database", "storage"],
            "ai": ["ai", "agent", "model", "llm"],
            "user": ["user", "account", "profile"],
            "security": ["secure", "auth", "permission"],
            "business": ["business", "company", "enterprise"],
            "personal": ["personal", "private", "my"],
        }
        
        for tag, keywords in tag_patterns.items():
            if any(kw in text_lower for kw in keywords):
                tags.append(tag)
        
        return tags
    
    def _classify_domain(self, text: str) -> str:
        """Classify the domain of the request."""
        text_lower = text.lower()
        
        domains = {
            "business": ["invoice", "client", "project", "team", "budget"],
            "personal": ["note", "task", "calendar", "reminder"],
            "creative": ["design", "image", "video", "audio"],
            "scholar": ["research", "paper", "citation", "study"],
            "social": ["post", "share", "follow", "message"],
        }
        
        for domain, keywords in domains.items():
            if any(kw in text_lower for kw in keywords):
                return domain
        
        return "general"
    
    def _analyze_sentiment(self, text: str) -> str:
        """Simple sentiment analysis."""
        positive_words = ["good", "great", "excellent", "happy", "please"]
        negative_words = ["bad", "wrong", "error", "problem", "issue"]
        
        text_lower = text.lower()
        pos_count = sum(1 for w in positive_words if w in text_lower)
        neg_count = sum(1 for w in negative_words if w in text_lower)
        
        if pos_count > neg_count:
            return "positive"
        elif neg_count > pos_count:
            return "negative"
        return "neutral"
    
    def _analyze_formality(self, text: str) -> str:
        """Analyze text formality."""
        informal_markers = ["hey", "hi", "yo", "gonna", "wanna", "pls"]
        formal_markers = ["please", "kindly", "would you", "could you"]
        
        text_lower = text.lower()
        informal = sum(1 for m in informal_markers if m in text_lower)
        formal = sum(1 for m in formal_markers if m in text_lower)
        
        if formal > informal:
            return "formal"
        elif informal > formal:
            return "informal"
        return "neutral"


class GovernanceRulesLane(LaneExecutor):
    """Lane D: Check governance rules and policies."""
    
    def __init__(self):
        super().__init__(LaneType.LANE_D_GOVERNANCE)
    
    async def execute(self, context: PipelineContext) -> LaneResult:
        """Check governance rules and determine if checkpoint needed."""
        started_at = datetime.utcnow()
        
        try:
            # Run governance checks
            checks = []
            checkpoint_required = False
            checkpoint_reasons = []
            
            # Check 1: Identity isolation
            identity_check = await self._check_identity_isolation(context)
            checks.append(identity_check)
            if not identity_check["passed"]:
                checkpoint_required = True
                checkpoint_reasons.append("Cross-identity access detected")
            
            # Check 2: Permission check
            permission_check = await self._check_permissions(context)
            checks.append(permission_check)
            if not permission_check["passed"]:
                checkpoint_required = True
                checkpoint_reasons.append("Insufficient permissions")
            
            # Check 3: Quota check
            quota_check = await self._check_quotas(context)
            checks.append(quota_check)
            if not quota_check["passed"]:
                checkpoint_required = True
                checkpoint_reasons.append("Quota exceeded")
            
            # Check 4: Sensitive operation check
            sensitive_check = await self._check_sensitive_operation(context)
            checks.append(sensitive_check)
            if not sensitive_check["passed"]:
                checkpoint_required = True
                checkpoint_reasons.append(sensitive_check.get("reason", "Sensitive operation"))
            
            # Check 5: Data modification check
            mutation_check = await self._check_data_mutation(context)
            checks.append(mutation_check)
            if not mutation_check["passed"]:
                checkpoint_required = True
                checkpoint_reasons.append("Data modification requires approval")
            
            # Check 6: Cost threshold check
            cost_check = await self._check_cost_threshold(context)
            checks.append(cost_check)
            if not cost_check["passed"]:
                checkpoint_required = True
                checkpoint_reasons.append("Operation exceeds cost threshold")
            
            # Build governance result
            governance_result = {
                "governance_id": str(uuid4()),
                "checked_at": started_at.isoformat(),
                "checks": checks,
                "all_passed": all(c["passed"] for c in checks),
                "checkpoint_required": checkpoint_required,
                "checkpoint_reasons": checkpoint_reasons,
                "checkpoint_type": self._determine_checkpoint_type(checks) if checkpoint_required else None,
                "risk_score": self._calculate_risk_score(checks),
            }
            
            context.governance_result = governance_result
            
            completed_at = datetime.utcnow()
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.COMPLETED,
                started_at=started_at,
                completed_at=completed_at,
                duration_ms=int((completed_at - started_at).total_seconds() * 1000),
                data=governance_result,
            )
            
        except Exception as e:
            logger.error(f"Governance check failed: {e}")
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.FAILED,
                started_at=started_at,
                completed_at=datetime.utcnow(),
                error=str(e),
            )
    
    async def _check_identity_isolation(self, context: PipelineContext) -> Dict[str, Any]:
        """Check for cross-identity access attempts."""
        # In production, check if user is accessing other user's data
        return {
            "check": "identity_isolation",
            "passed": True,  # Assume passed for now
            "details": "No cross-identity access detected",
        }
    
    async def _check_permissions(self, context: PipelineContext) -> Dict[str, Any]:
        """Check user permissions for the operation."""
        intent = context.intent or {}
        intent_type = intent.get("intent_type", "general")
        
        permissions = context.context_snapshot.get("permissions", {}) if context.context_snapshot else {}
        
        permission_map = {
            "create": "can_write",
            "update": "can_write",
            "delete": "can_delete",
            "read": "can_read",
            "admin": "can_admin",
            "export": "can_export",
        }
        
        required_permission = permission_map.get(intent_type, "can_read")
        has_permission = permissions.get(required_permission, False)
        
        return {
            "check": "permissions",
            "passed": has_permission,
            "required": required_permission,
            "details": f"Permission '{required_permission}': {'granted' if has_permission else 'denied'}",
        }
    
    async def _check_quotas(self, context: PipelineContext) -> Dict[str, Any]:
        """Check if user has remaining quota."""
        quotas = context.context_snapshot.get("quotas", {}) if context.context_snapshot else {}
        tokens_remaining = quotas.get("tokens_remaining", 0)
        
        return {
            "check": "quotas",
            "passed": tokens_remaining > 0,
            "remaining": tokens_remaining,
            "details": f"Tokens remaining: {tokens_remaining}",
        }
    
    async def _check_sensitive_operation(self, context: PipelineContext) -> Dict[str, Any]:
        """Check if operation involves sensitive data."""
        intent = context.intent or {}
        is_sensitive = intent.get("is_sensitive", False)
        
        return {
            "check": "sensitive_operation",
            "passed": not is_sensitive,
            "reason": "Sensitive data access detected" if is_sensitive else None,
            "details": "Operation involves sensitive data" if is_sensitive else "No sensitive data detected",
        }
    
    async def _check_data_mutation(self, context: PipelineContext) -> Dict[str, Any]:
        """Check if operation modifies data."""
        intent = context.intent or {}
        is_mutation = intent.get("is_mutation", False)
        intent_type = intent.get("intent_type", "general")
        
        # Delete operations always require checkpoint
        requires_checkpoint = is_mutation and intent_type == "delete"
        
        return {
            "check": "data_mutation",
            "passed": not requires_checkpoint,
            "is_mutation": is_mutation,
            "intent_type": intent_type,
            "details": f"Mutation type: {intent_type}" if is_mutation else "Read-only operation",
        }
    
    async def _check_cost_threshold(self, context: PipelineContext) -> Dict[str, Any]:
        """Check if operation exceeds cost threshold."""
        # Simple cost estimation based on query complexity
        encoding = context.encoded_data or {}
        token_estimate = encoding.get("query_tokens", 0) * 100  # Estimate response tokens
        
        # Threshold: 10000 tokens
        exceeds = token_estimate > 10000
        
        return {
            "check": "cost_threshold",
            "passed": not exceeds,
            "estimated_tokens": token_estimate,
            "threshold": 10000,
            "details": f"Estimated tokens: {token_estimate}",
        }
    
    def _determine_checkpoint_type(self, checks: List[Dict]) -> CheckpointType:
        """Determine the type of checkpoint based on failed checks."""
        for check in checks:
            if not check["passed"]:
                check_name = check.get("check", "")
                if check_name == "identity_isolation":
                    return CheckpointType.IDENTITY
                elif check_name == "sensitive_operation":
                    return CheckpointType.SENSITIVE
                elif check_name == "data_mutation":
                    return CheckpointType.DATA_MODIFICATION
                elif check_name == "cost_threshold":
                    return CheckpointType.COST
        return CheckpointType.GOVERNANCE
    
    def _calculate_risk_score(self, checks: List[Dict]) -> float:
        """Calculate overall risk score (0-1)."""
        if not checks:
            return 0.0
        
        failed = sum(1 for c in checks if not c["passed"])
        return failed / len(checks)


class CheckpointBlockingLane(LaneExecutor):
    """Lane E: Checkpoint blocking for human approval."""
    
    def __init__(self, checkpoint_store: Dict[str, Checkpoint]):
        super().__init__(LaneType.LANE_E_CHECKPOINT)
        self.checkpoint_store = checkpoint_store
    
    async def execute(self, context: PipelineContext) -> LaneResult:
        """Create checkpoint if required by governance."""
        started_at = datetime.utcnow()
        
        try:
            governance = context.governance_result or {}
            checkpoint_required = governance.get("checkpoint_required", False)
            
            if not checkpoint_required:
                # No checkpoint needed, proceed
                return LaneResult(
                    lane_type=self.lane_type,
                    status=LaneStatus.COMPLETED,
                    started_at=started_at,
                    completed_at=datetime.utcnow(),
                    duration_ms=1,
                    data={"checkpoint_required": False},
                )
            
            # Create checkpoint
            checkpoint = Checkpoint(
                id=str(uuid4()),
                pipeline_id=context.metadata.get("pipeline_id", "unknown"),
                checkpoint_type=governance.get("checkpoint_type", CheckpointType.GOVERNANCE),
                reason="; ".join(governance.get("checkpoint_reasons", ["Approval required"])),
                decision=CheckpointDecision.PENDING,
                created_at=datetime.utcnow(),
                context={
                    "user_id": context.user_id,
                    "identity_id": context.identity_id,
                    "query": context.query,
                    "intent": context.intent,
                    "risk_score": governance.get("risk_score", 0.0),
                },
                timeout_minutes=30,
            )
            
            # Store checkpoint
            self.checkpoint_store[checkpoint.id] = checkpoint
            context.checkpoint = checkpoint
            
            completed_at = datetime.utcnow()
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.COMPLETED,
                started_at=started_at,
                completed_at=completed_at,
                duration_ms=int((completed_at - started_at).total_seconds() * 1000),
                data={
                    "checkpoint_required": True,
                    "checkpoint_id": checkpoint.id,
                    "checkpoint_type": checkpoint.checkpoint_type.value,
                    "reason": checkpoint.reason,
                    "awaiting_decision": True,
                },
                metadata={"requires_http_423": True},
            )
            
        except Exception as e:
            logger.error(f"Checkpoint creation failed: {e}")
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.FAILED,
                started_at=started_at,
                completed_at=datetime.utcnow(),
                error=str(e),
            )


class ExecutionLane(LaneExecutor):
    """Lane F: Execute the operation."""
    
    def __init__(self, executors: Dict[str, Callable]):
        super().__init__(LaneType.LANE_F_EXECUTION)
        self.executors = executors
    
    async def execute(self, context: PipelineContext) -> LaneResult:
        """Execute the operation after checkpoint approval."""
        started_at = datetime.utcnow()
        
        try:
            # Check checkpoint status
            if context.checkpoint:
                if context.checkpoint.decision == CheckpointDecision.PENDING:
                    return LaneResult(
                        lane_type=self.lane_type,
                        status=LaneStatus.SKIPPED,
                        started_at=started_at,
                        completed_at=datetime.utcnow(),
                        data={"reason": "Awaiting checkpoint approval"},
                    )
                elif context.checkpoint.decision == CheckpointDecision.REJECTED:
                    return LaneResult(
                        lane_type=self.lane_type,
                        status=LaneStatus.SKIPPED,
                        started_at=started_at,
                        completed_at=datetime.utcnow(),
                        data={"reason": "Checkpoint rejected"},
                    )
            
            # Get intent type
            intent = context.intent or {}
            intent_type = intent.get("intent_type", "general")
            
            # Execute based on intent
            executor = self.executors.get(intent_type)
            if executor:
                result = await executor(context)
            else:
                # Default execution
                result = await self._default_execute(context)
            
            context.execution_result = result
            
            completed_at = datetime.utcnow()
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.COMPLETED,
                started_at=started_at,
                completed_at=completed_at,
                duration_ms=int((completed_at - started_at).total_seconds() * 1000),
                data=result,
            )
            
        except Exception as e:
            logger.error(f"Execution failed: {e}")
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.FAILED,
                started_at=started_at,
                completed_at=datetime.utcnow(),
                error=str(e),
            )
    
    async def _default_execute(self, context: PipelineContext) -> Dict[str, Any]:
        """Default execution handler."""
        return {
            "executed": True,
            "query": context.query,
            "intent": context.intent.get("intent_type") if context.intent else None,
            "message": "Operation completed successfully",
        }


class AuditLane(LaneExecutor):
    """Lane G: Audit logging and token tracking."""
    
    def __init__(self, audit_store: List[Dict]):
        super().__init__(LaneType.LANE_G_AUDIT)
        self.audit_store = audit_store
    
    async def execute(self, context: PipelineContext) -> LaneResult:
        """Create audit log entry."""
        started_at = datetime.utcnow()
        
        try:
            # Calculate metrics
            encoding = context.encoded_data or {}
            tokens_input = encoding.get("query_tokens", 0)
            tokens_output = tokens_input * 10  # Estimate
            
            # Create audit entry
            audit_entry = {
                "audit_id": str(uuid4()),
                "pipeline_id": context.metadata.get("pipeline_id"),
                "timestamp": started_at.isoformat(),
                "user_id": context.user_id,
                "identity_id": context.identity_id,
                "query": context.query,
                "intent": context.intent.get("intent_type") if context.intent else None,
                "checkpoint": {
                    "required": context.checkpoint is not None,
                    "checkpoint_id": context.checkpoint.id if context.checkpoint else None,
                    "decision": context.checkpoint.decision.value if context.checkpoint else None,
                } if context.checkpoint else None,
                "execution": {
                    "completed": context.execution_result is not None,
                },
                "metrics": {
                    "tokens_input": tokens_input,
                    "tokens_output": tokens_output,
                    "tokens_total": tokens_input + tokens_output,
                },
                "governance": {
                    "risk_score": context.governance_result.get("risk_score", 0.0) if context.governance_result else 0.0,
                },
            }
            
            # Store audit entry
            self.audit_store.append(audit_entry)
            
            completed_at = datetime.utcnow()
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.COMPLETED,
                started_at=started_at,
                completed_at=completed_at,
                duration_ms=int((completed_at - started_at).total_seconds() * 1000),
                data={
                    "audit_id": audit_entry["audit_id"],
                    "logged": True,
                    "tokens_tracked": tokens_input + tokens_output,
                },
            )
            
        except Exception as e:
            logger.error(f"Audit logging failed: {e}")
            return LaneResult(
                lane_type=self.lane_type,
                status=LaneStatus.FAILED,
                started_at=started_at,
                completed_at=datetime.utcnow(),
                error=str(e),
            )


# =============================================================================
# NOVA PIPELINE SERVICE
# =============================================================================

class NovaPipelineService:
    """
    Nova Pipeline Service - Core Multi-Lane Pipeline orchestration.
    
    Implements the 7-lane architecture with checkpoint blocking (HTTP 423)
    for human approval on sensitive operations.
    """
    
    def __init__(self):
        # Storage
        self.pipelines: Dict[str, PipelineResult] = {}
        self.checkpoints: Dict[str, Checkpoint] = {}
        self.audit_log: List[Dict] = []
        self.executors: Dict[str, Callable] = {}
        
        # Initialize lanes
        self.lane_a = IntentAnalysisLane()
        self.lane_b = ContextSnapshotLane()
        self.lane_c = SemanticEncodingLane()
        self.lane_d = GovernanceRulesLane()
        self.lane_e = CheckpointBlockingLane(self.checkpoints)
        self.lane_f = ExecutionLane(self.executors)
        self.lane_g = AuditLane(self.audit_log)
        
        logger.info("NovaPipelineService initialized")
    
    def register_executor(self, intent_type: str, executor: Callable) -> None:
        """Register an executor for an intent type."""
        self.executors[intent_type] = executor
        logger.info(f"Registered executor for intent: {intent_type}")
    
    async def execute_pipeline(
        self,
        query: str,
        user_id: str,
        identity_id: str,
        context: Optional[Dict[str, Any]] = None,
        options: Optional[Dict[str, Any]] = None,
    ) -> PipelineResult:
        """
        Execute the full 7-lane pipeline.
        
        Returns HTTP 423 equivalent if checkpoint pending.
        """
        pipeline_id = str(uuid4())
        started_at = datetime.utcnow()
        options = options or {}
        
        logger.info(f"Starting pipeline {pipeline_id} for user {user_id}")
        
        # Create pipeline context
        ctx = PipelineContext(
            user_id=user_id,
            identity_id=identity_id,
            query=query,
            original_input=context or {},
            metadata={"pipeline_id": pipeline_id},
        )
        
        # Initialize result
        result = PipelineResult(
            pipeline_id=pipeline_id,
            status=PipelineStatus.RUNNING,
            started_at=started_at,
        )
        self.pipelines[pipeline_id] = result
        
        try:
            # Lane A: Intent Analysis
            lane_a_result = await self.lane_a.execute(ctx)
            result.lanes[LaneType.LANE_A_INTENT.value] = lane_a_result
            if lane_a_result.status == LaneStatus.FAILED:
                return self._finalize_pipeline(result, PipelineStatus.FAILED, lane_a_result.error)
            
            # Lane B: Context Snapshot
            lane_b_result = await self.lane_b.execute(ctx)
            result.lanes[LaneType.LANE_B_CONTEXT.value] = lane_b_result
            if lane_b_result.status == LaneStatus.FAILED:
                return self._finalize_pipeline(result, PipelineStatus.FAILED, lane_b_result.error)
            
            # Lane C: Semantic Encoding
            lane_c_result = await self.lane_c.execute(ctx)
            result.lanes[LaneType.LANE_C_ENCODING.value] = lane_c_result
            if lane_c_result.status == LaneStatus.FAILED:
                return self._finalize_pipeline(result, PipelineStatus.FAILED, lane_c_result.error)
            
            # Lane D: Governance Rules
            lane_d_result = await self.lane_d.execute(ctx)
            result.lanes[LaneType.LANE_D_GOVERNANCE.value] = lane_d_result
            if lane_d_result.status == LaneStatus.FAILED:
                return self._finalize_pipeline(result, PipelineStatus.FAILED, lane_d_result.error)
            
            # Lane E: Checkpoint Blocking
            lane_e_result = await self.lane_e.execute(ctx)
            result.lanes[LaneType.LANE_E_CHECKPOINT.value] = lane_e_result
            
            # Check if checkpoint is pending - HTTP 423
            if lane_e_result.data.get("checkpoint_required") and lane_e_result.data.get("awaiting_decision"):
                result.status = PipelineStatus.CHECKPOINT_PENDING
                result.checkpoint = ctx.checkpoint
                logger.info(f"Pipeline {pipeline_id} awaiting checkpoint approval")
                return result
            
            # Lane F: Execution
            lane_f_result = await self.lane_f.execute(ctx)
            result.lanes[LaneType.LANE_F_EXECUTION.value] = lane_f_result
            if lane_f_result.status == LaneStatus.FAILED:
                return self._finalize_pipeline(result, PipelineStatus.FAILED, lane_f_result.error)
            
            # Lane G: Audit
            lane_g_result = await self.lane_g.execute(ctx)
            result.lanes[LaneType.LANE_G_AUDIT.value] = lane_g_result
            result.audit_id = lane_g_result.data.get("audit_id")
            
            # Set final result
            result.result = ctx.execution_result
            
            # Calculate metrics
            result.metrics = self._calculate_metrics(result)
            
            return self._finalize_pipeline(result, PipelineStatus.COMPLETED)
            
        except Exception as e:
            logger.error(f"Pipeline {pipeline_id} failed: {e}")
            return self._finalize_pipeline(result, PipelineStatus.FAILED, str(e))
    
    async def approve_checkpoint(
        self,
        checkpoint_id: str,
        user_id: str,
    ) -> PipelineResult:
        """Approve a checkpoint and continue pipeline execution."""
        checkpoint = self.checkpoints.get(checkpoint_id)
        if not checkpoint:
            raise ValueError(f"Checkpoint {checkpoint_id} not found")
        
        if checkpoint.decision != CheckpointDecision.PENDING:
            raise ValueError(f"Checkpoint {checkpoint_id} already decided: {checkpoint.decision}")
        
        if checkpoint.is_expired():
            checkpoint.decision = CheckpointDecision.TIMEOUT
            raise ValueError(f"Checkpoint {checkpoint_id} has expired")
        
        # Update checkpoint
        checkpoint.decision = CheckpointDecision.APPROVED
        checkpoint.decided_at = datetime.utcnow()
        checkpoint.decided_by = user_id
        
        logger.info(f"Checkpoint {checkpoint_id} approved by {user_id}")
        
        # Get pipeline
        pipeline = self.pipelines.get(checkpoint.pipeline_id)
        if not pipeline:
            raise ValueError(f"Pipeline {checkpoint.pipeline_id} not found")
        
        # Continue pipeline execution
        return await self._continue_pipeline_after_checkpoint(pipeline, checkpoint)
    
    async def reject_checkpoint(
        self,
        checkpoint_id: str,
        user_id: str,
        reason: Optional[str] = None,
    ) -> PipelineResult:
        """Reject a checkpoint and cancel pipeline."""
        checkpoint = self.checkpoints.get(checkpoint_id)
        if not checkpoint:
            raise ValueError(f"Checkpoint {checkpoint_id} not found")
        
        if checkpoint.decision != CheckpointDecision.PENDING:
            raise ValueError(f"Checkpoint {checkpoint_id} already decided: {checkpoint.decision}")
        
        # Update checkpoint
        checkpoint.decision = CheckpointDecision.REJECTED
        checkpoint.decided_at = datetime.utcnow()
        checkpoint.decided_by = user_id
        checkpoint.metadata["rejection_reason"] = reason
        
        logger.info(f"Checkpoint {checkpoint_id} rejected by {user_id}: {reason}")
        
        # Get and update pipeline
        pipeline = self.pipelines.get(checkpoint.pipeline_id)
        if pipeline:
            pipeline.status = PipelineStatus.CHECKPOINT_REJECTED
            pipeline.completed_at = datetime.utcnow()
            pipeline.checkpoint = checkpoint
        
        return pipeline
    
    async def _continue_pipeline_after_checkpoint(
        self,
        pipeline: PipelineResult,
        checkpoint: Checkpoint,
    ) -> PipelineResult:
        """Continue pipeline after checkpoint approval."""
        # Reconstruct context
        ctx = PipelineContext(
            user_id=checkpoint.context.get("user_id", ""),
            identity_id=checkpoint.context.get("identity_id", ""),
            query=checkpoint.context.get("query", ""),
            original_input={},
            intent=checkpoint.context.get("intent"),
            checkpoint=checkpoint,
            metadata={"pipeline_id": pipeline.pipeline_id},
        )
        
        # Update checkpoint status
        pipeline.status = PipelineStatus.CHECKPOINT_APPROVED
        
        # Continue with Lane F: Execution
        lane_f_result = await self.lane_f.execute(ctx)
        pipeline.lanes[LaneType.LANE_F_EXECUTION.value] = lane_f_result
        
        if lane_f_result.status == LaneStatus.FAILED:
            return self._finalize_pipeline(pipeline, PipelineStatus.FAILED, lane_f_result.error)
        
        # Lane G: Audit
        lane_g_result = await self.lane_g.execute(ctx)
        pipeline.lanes[LaneType.LANE_G_AUDIT.value] = lane_g_result
        pipeline.audit_id = lane_g_result.data.get("audit_id")
        
        # Set final result
        pipeline.result = ctx.execution_result
        pipeline.checkpoint = checkpoint
        
        # Calculate metrics
        pipeline.metrics = self._calculate_metrics(pipeline)
        
        return self._finalize_pipeline(pipeline, PipelineStatus.COMPLETED)
    
    def _finalize_pipeline(
        self,
        pipeline: PipelineResult,
        status: PipelineStatus,
        error: Optional[str] = None,
    ) -> PipelineResult:
        """Finalize pipeline with status and timing."""
        pipeline.status = status
        pipeline.completed_at = datetime.utcnow()
        pipeline.error = error
        
        if pipeline.started_at:
            pipeline.metrics.total_time_ms = int(
                (pipeline.completed_at - pipeline.started_at).total_seconds() * 1000
            )
        
        logger.info(f"Pipeline {pipeline.pipeline_id} finalized with status: {status}")
        return pipeline
    
    def _calculate_metrics(self, pipeline: PipelineResult) -> PipelineMetrics:
        """Calculate pipeline metrics."""
        metrics = PipelineMetrics()
        
        # Calculate total time
        if pipeline.started_at and pipeline.completed_at:
            metrics.total_time_ms = int(
                (pipeline.completed_at - pipeline.started_at).total_seconds() * 1000
            )
        
        # Get token info from encoding lane
        encoding_result = pipeline.lanes.get(LaneType.LANE_C_ENCODING.value)
        if encoding_result and encoding_result.data:
            metrics.tokens_input = encoding_result.data.get("query_tokens", 0)
            metrics.tokens_output = metrics.tokens_input * 10  # Estimate
            metrics.tokens_used = metrics.tokens_input + metrics.tokens_output
        
        # Count lanes as API calls
        metrics.api_calls = len([l for l in pipeline.lanes.values() if l.status == LaneStatus.COMPLETED])
        
        return metrics
    
    def get_pipeline_status(self, pipeline_id: str) -> Optional[PipelineResult]:
        """Get pipeline status."""
        return self.pipelines.get(pipeline_id)
    
    def get_checkpoint(self, checkpoint_id: str) -> Optional[Checkpoint]:
        """Get checkpoint by ID."""
        return self.checkpoints.get(checkpoint_id)
    
    def get_pending_checkpoints(self, user_id: Optional[str] = None) -> List[Checkpoint]:
        """Get all pending checkpoints, optionally filtered by user."""
        pending = [
            cp for cp in self.checkpoints.values()
            if cp.decision == CheckpointDecision.PENDING and not cp.is_expired()
        ]
        if user_id:
            pending = [cp for cp in pending if cp.context.get("user_id") == user_id]
        return pending
    
    def get_audit_log(
        self,
        user_id: Optional[str] = None,
        limit: int = 100,
    ) -> List[Dict]:
        """Get audit log entries."""
        entries = self.audit_log
        if user_id:
            entries = [e for e in entries if e.get("user_id") == user_id]
        return entries[-limit:]


# =============================================================================
# SERVICE INSTANCE
# =============================================================================

nova_pipeline_service = NovaPipelineService()


# =============================================================================
# EXAMPLE EXECUTORS
# =============================================================================

async def read_executor(context: PipelineContext) -> Dict[str, Any]:
    """Executor for read operations."""
    return {
        "operation": "read",
        "query": context.query,
        "data": {"message": "Data retrieved successfully"},
    }


async def create_executor(context: PipelineContext) -> Dict[str, Any]:
    """Executor for create operations."""
    return {
        "operation": "create",
        "query": context.query,
        "created_id": str(uuid4()),
        "message": "Resource created successfully",
    }


async def update_executor(context: PipelineContext) -> Dict[str, Any]:
    """Executor for update operations."""
    return {
        "operation": "update",
        "query": context.query,
        "message": "Resource updated successfully",
    }


async def delete_executor(context: PipelineContext) -> Dict[str, Any]:
    """Executor for delete operations."""
    return {
        "operation": "delete",
        "query": context.query,
        "message": "Resource deleted successfully",
    }


# Register default executors
nova_pipeline_service.register_executor("read", read_executor)
nova_pipeline_service.register_executor("create", create_executor)
nova_pipeline_service.register_executor("update", update_executor)
nova_pipeline_service.register_executor("delete", delete_executor)


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    # Service
    "NovaPipelineService",
    "nova_pipeline_service",
    # Enums
    "PipelineStatus",
    "LaneStatus",
    "CheckpointType",
    "CheckpointDecision",
    "LaneType",
    # Data classes
    "LaneResult",
    "Checkpoint",
    "PipelineMetrics",
    "PipelineContext",
    "PipelineResult",
    # Lane executors
    "LaneExecutor",
    "IntentAnalysisLane",
    "ContextSnapshotLane",
    "SemanticEncodingLane",
    "GovernanceRulesLane",
    "CheckpointBlockingLane",
    "ExecutionLane",
    "AuditLane",
]
