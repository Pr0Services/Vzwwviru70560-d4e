"""
CHE·NU™ Nova Pipeline Service
Multi-Lane Cognitive Processing System

CANON: GOUVERNANCE > EXÉCUTION
- HTTP 423 for checkpoint blocking
- HTTP 403 for identity violations
- Human approval required for sensitive actions

The 7 Lanes:
A. Intent Analysis - Understand user query
B. Context Snapshot - Gather relevant context
C. Semantic Encoding - Encode for processing
D. Governance Rules - Check policies
E. Checkpoint - Block if approval needed
F. Execution - Run approved actions
G. Audit Trail - Log everything

Author: CHE·NU Team
Version: 1.0.0
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set, Union
from uuid import UUID, uuid4
import asyncio
import hashlib
import json
import logging
import re
import time

logger = logging.getLogger(__name__)


# =============================================================================
# ENUMS & CONSTANTS
# =============================================================================

class PipelineStatus(str, Enum):
    """Pipeline execution status"""
    PENDING = "pending"
    RUNNING = "running"
    CHECKPOINT_PENDING = "checkpoint_pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class LaneStatus(str, Enum):
    """Individual lane status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


class CheckpointType(str, Enum):
    """Types of checkpoints requiring human approval"""
    GOVERNANCE = "governance"           # Policy violation detected
    COST = "cost"                       # Token budget exceeded
    IDENTITY = "identity"               # Cross-identity access
    SENSITIVE = "sensitive"             # Sensitive action (delete, send)
    EXTERNAL = "external"               # External API call
    DATA_MODIFICATION = "data_modification"  # Data changes
    ESCALATION = "escalation"           # Action requires escalation


class IntentType(str, Enum):
    """Recognized intent types"""
    QUERY = "query"                     # Information retrieval
    CREATE = "create"                   # Create new data
    UPDATE = "update"                   # Modify existing data
    DELETE = "delete"                   # Remove data
    EXECUTE = "execute"                 # Run action
    ANALYZE = "analyze"                 # Analysis request
    GENERATE = "generate"               # Content generation
    COMMUNICATE = "communicate"         # External communication
    UNKNOWN = "unknown"                 # Unrecognized intent


class SensitivityLevel(str, Enum):
    """Data sensitivity levels"""
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    RESTRICTED = "restricted"
    TOP_SECRET = "top_secret"


# Sensitive action patterns requiring checkpoint
SENSITIVE_PATTERNS = {
    r"\bdelete\b": CheckpointType.DATA_MODIFICATION,
    r"\bremove\b": CheckpointType.DATA_MODIFICATION,
    r"\bsend\s+(email|message|notification)\b": CheckpointType.EXTERNAL,
    r"\bpublish\b": CheckpointType.EXTERNAL,
    r"\bexecute\b": CheckpointType.GOVERNANCE,
    r"\btransfer\b": CheckpointType.SENSITIVE,
    r"\bpay(ment)?\b": CheckpointType.SENSITIVE,
    r"\bshare\s+(with|to)\b": CheckpointType.IDENTITY,
}

# Default token budgets per action type
DEFAULT_TOKEN_BUDGETS = {
    IntentType.QUERY: 5000,
    IntentType.CREATE: 10000,
    IntentType.UPDATE: 8000,
    IntentType.DELETE: 2000,
    IntentType.EXECUTE: 15000,
    IntentType.ANALYZE: 20000,
    IntentType.GENERATE: 25000,
    IntentType.COMMUNICATE: 5000,
    IntentType.UNKNOWN: 3000,
}


# =============================================================================
# DATA MODELS
# =============================================================================

@dataclass
class NovaQuery:
    """Incoming query to Nova"""
    id: str = field(default_factory=lambda: str(uuid4()))
    query: str = ""
    identity_id: str = ""
    sphere_id: Optional[str] = None
    context: Dict[str, Any] = field(default_factory=dict)
    options: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)
    
    def __post_init__(self):
        if not self.query:
            raise ValueError("Query cannot be empty")
        if not self.identity_id:
            raise ValueError("Identity ID is required")


@dataclass
class IntentAnalysis:
    """Result of intent analysis (Lane A)"""
    intent_type: IntentType
    confidence: float
    entities: Dict[str, Any] = field(default_factory=dict)
    keywords: List[str] = field(default_factory=list)
    requires_action: bool = False
    estimated_tokens: int = 0
    sensitivity_level: SensitivityLevel = SensitivityLevel.INTERNAL
    detected_patterns: List[str] = field(default_factory=list)


@dataclass
class ContextSnapshot:
    """Context snapshot (Lane B)"""
    snapshot_id: str = field(default_factory=lambda: str(uuid4()))
    identity_context: Dict[str, Any] = field(default_factory=dict)
    sphere_context: Dict[str, Any] = field(default_factory=dict)
    thread_context: Dict[str, Any] = field(default_factory=dict)
    memory_context: Dict[str, Any] = field(default_factory=dict)
    relevant_data: List[Dict[str, Any]] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)
    is_immutable: bool = True


@dataclass
class SemanticEncoding:
    """Semantic encoding result (Lane C)"""
    encoding_id: str = field(default_factory=lambda: str(uuid4()))
    encoded_query: str = ""
    embedding_vector: List[float] = field(default_factory=list)
    semantic_tags: List[str] = field(default_factory=list)
    entity_links: Dict[str, str] = field(default_factory=dict)
    processed_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class GovernanceResult:
    """Governance check result (Lane D)"""
    passed: bool = True
    violations: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    applied_policies: List[str] = field(default_factory=list)
    token_budget_remaining: int = 0
    requires_checkpoint: bool = False
    checkpoint_type: Optional[CheckpointType] = None
    checkpoint_reason: Optional[str] = None


@dataclass
class Checkpoint:
    """Checkpoint requiring human approval (Lane E)"""
    id: str = field(default_factory=lambda: str(uuid4()))
    pipeline_id: str = ""
    checkpoint_type: CheckpointType = CheckpointType.GOVERNANCE
    reason: str = ""
    details: Dict[str, Any] = field(default_factory=dict)
    options: List[str] = field(default_factory=lambda: ["approve", "reject"])
    requires_approval: bool = True
    created_at: datetime = field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    resolved_by: Optional[str] = None
    resolution: Optional[str] = None  # "approved" or "rejected"
    
    def __post_init__(self):
        if not self.expires_at:
            # Default 24 hour expiry
            self.expires_at = self.created_at + timedelta(hours=24)
    
    @property
    def is_expired(self) -> bool:
        return datetime.utcnow() > self.expires_at if self.expires_at else False
    
    @property
    def is_pending(self) -> bool:
        return self.resolution is None and not self.is_expired


@dataclass
class ExecutionResult:
    """Execution result (Lane F)"""
    success: bool = False
    result: Any = None
    error: Optional[str] = None
    tokens_used: int = 0
    execution_time_ms: int = 0
    actions_taken: List[str] = field(default_factory=list)


@dataclass
class AuditEntry:
    """Audit trail entry (Lane G)"""
    id: str = field(default_factory=lambda: str(uuid4()))
    pipeline_id: str = ""
    identity_id: str = ""
    action: str = ""
    details: Dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "pipeline_id": self.pipeline_id,
            "identity_id": self.identity_id,
            "action": self.action,
            "details": self.details,
            "timestamp": self.timestamp.isoformat(),
            "ip_address": self.ip_address,
            "user_agent": self.user_agent,
        }


@dataclass
class LaneResult:
    """Result from a single lane"""
    lane_name: str
    status: LaneStatus = LaneStatus.PENDING
    data: Any = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_ms: int = 0
    
    def complete(self, data: Any = None, error: Optional[str] = None):
        self.completed_at = datetime.utcnow()
        if self.started_at:
            self.duration_ms = int((self.completed_at - self.started_at).total_seconds() * 1000)
        if error:
            self.status = LaneStatus.FAILED
            self.error = error
        else:
            self.status = LaneStatus.COMPLETED
            self.data = data


@dataclass
class PipelineResult:
    """Complete pipeline execution result"""
    pipeline_id: str = field(default_factory=lambda: str(uuid4()))
    query_id: str = ""
    status: PipelineStatus = PipelineStatus.PENDING
    
    # Lane results
    lane_a_intent: Optional[LaneResult] = None
    lane_b_context: Optional[LaneResult] = None
    lane_c_encoding: Optional[LaneResult] = None
    lane_d_governance: Optional[LaneResult] = None
    lane_e_checkpoint: Optional[LaneResult] = None
    lane_f_execution: Optional[LaneResult] = None
    lane_g_audit: Optional[LaneResult] = None
    
    # Final result
    result: Any = None
    error: Optional[str] = None
    
    # Checkpoint (if pending)
    checkpoint: Optional[Checkpoint] = None
    
    # Metrics
    total_tokens_used: int = 0
    total_time_ms: int = 0
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "pipeline_id": self.pipeline_id,
            "query_id": self.query_id,
            "status": self.status.value,
            "lanes": {
                "lane_a_intent": self._lane_to_dict(self.lane_a_intent),
                "lane_b_context": self._lane_to_dict(self.lane_b_context),
                "lane_c_encoding": self._lane_to_dict(self.lane_c_encoding),
                "lane_d_governance": self._lane_to_dict(self.lane_d_governance),
                "lane_e_checkpoint": self._lane_to_dict(self.lane_e_checkpoint),
                "lane_f_execution": self._lane_to_dict(self.lane_f_execution),
                "lane_g_audit": self._lane_to_dict(self.lane_g_audit),
            },
            "result": self.result,
            "error": self.error,
            "checkpoint": self._checkpoint_to_dict() if self.checkpoint else None,
            "metrics": {
                "total_tokens_used": self.total_tokens_used,
                "total_time_ms": self.total_time_ms,
            },
        }
    
    def _lane_to_dict(self, lane: Optional[LaneResult]) -> Optional[Dict]:
        if not lane:
            return None
        return {
            "lane_name": lane.lane_name,
            "status": lane.status.value,
            "duration_ms": lane.duration_ms,
            "error": lane.error,
        }
    
    def _checkpoint_to_dict(self) -> Dict[str, Any]:
        if not self.checkpoint:
            return {}
        return {
            "id": self.checkpoint.id,
            "type": self.checkpoint.checkpoint_type.value,
            "reason": self.checkpoint.reason,
            "requires_approval": self.checkpoint.requires_approval,
            "options": self.checkpoint.options,
            "expires_at": self.checkpoint.expires_at.isoformat() if self.checkpoint.expires_at else None,
        }


# =============================================================================
# NOVA PIPELINE SERVICE
# =============================================================================

class NovaPipelineService:
    """
    Nova Multi-Lane Pipeline Service
    
    Processes queries through 7 lanes with governance checkpoints.
    CANON: GOUVERNANCE > EXÉCUTION
    """
    
    def __init__(self):
        # Pipeline storage
        self._pipelines: Dict[str, PipelineResult] = {}
        self._checkpoints: Dict[str, Checkpoint] = {}
        
        # Metrics
        self._total_pipelines = 0
        self._total_checkpoints = 0
        self._total_approvals = 0
        self._total_rejections = 0
        
        # Configuration
        self._token_budgets = DEFAULT_TOKEN_BUDGETS.copy()
        self._checkpoint_timeout = timedelta(hours=24)
        
        # Event handlers
        self._event_handlers: Dict[str, List[Callable]] = {
            "pipeline.start": [],
            "lane.complete": [],
            "checkpoint.pending": [],
            "checkpoint.resolved": [],
            "pipeline.complete": [],
            "pipeline.failed": [],
        }
        
        logger.info("NovaPipelineService initialized")
    
    # =========================================================================
    # MAIN PIPELINE EXECUTION
    # =========================================================================
    
    async def execute_query(self, query: NovaQuery) -> PipelineResult:
        """
        Execute a query through the Nova pipeline
        
        Returns:
            PipelineResult with status:
            - COMPLETED: Execution finished successfully
            - CHECKPOINT_PENDING: Awaiting human approval (HTTP 423)
            - FAILED: Execution failed
        """
        # Initialize pipeline
        pipeline = PipelineResult(
            query_id=query.id,
            started_at=datetime.utcnow(),
        )
        self._pipelines[pipeline.pipeline_id] = pipeline
        self._total_pipelines += 1
        
        pipeline.status = PipelineStatus.RUNNING
        await self._emit_event("pipeline.start", pipeline)
        
        try:
            # Lane A: Intent Analysis
            pipeline.lane_a_intent = await self._execute_lane_a(query)
            await self._emit_event("lane.complete", pipeline, "lane_a")
            
            if pipeline.lane_a_intent.status == LaneStatus.FAILED:
                raise Exception(f"Lane A failed: {pipeline.lane_a_intent.error}")
            
            intent_analysis: IntentAnalysis = pipeline.lane_a_intent.data
            
            # Lane B: Context Snapshot
            pipeline.lane_b_context = await self._execute_lane_b(query, intent_analysis)
            await self._emit_event("lane.complete", pipeline, "lane_b")
            
            if pipeline.lane_b_context.status == LaneStatus.FAILED:
                raise Exception(f"Lane B failed: {pipeline.lane_b_context.error}")
            
            context_snapshot: ContextSnapshot = pipeline.lane_b_context.data
            
            # Lane C: Semantic Encoding
            pipeline.lane_c_encoding = await self._execute_lane_c(query, intent_analysis, context_snapshot)
            await self._emit_event("lane.complete", pipeline, "lane_c")
            
            if pipeline.lane_c_encoding.status == LaneStatus.FAILED:
                raise Exception(f"Lane C failed: {pipeline.lane_c_encoding.error}")
            
            # Lane D: Governance Check
            pipeline.lane_d_governance = await self._execute_lane_d(query, intent_analysis, context_snapshot)
            await self._emit_event("lane.complete", pipeline, "lane_d")
            
            if pipeline.lane_d_governance.status == LaneStatus.FAILED:
                raise Exception(f"Lane D failed: {pipeline.lane_d_governance.error}")
            
            governance_result: GovernanceResult = pipeline.lane_d_governance.data
            
            # Lane E: Checkpoint (if required)
            if governance_result.requires_checkpoint:
                pipeline.lane_e_checkpoint = await self._execute_lane_e(
                    pipeline, query, governance_result
                )
                await self._emit_event("lane.complete", pipeline, "lane_e")
                
                # If checkpoint is pending, return early
                if pipeline.lane_e_checkpoint.data and isinstance(pipeline.lane_e_checkpoint.data, Checkpoint):
                    checkpoint = pipeline.lane_e_checkpoint.data
                    if checkpoint.is_pending:
                        pipeline.status = PipelineStatus.CHECKPOINT_PENDING
                        pipeline.checkpoint = checkpoint
                        await self._emit_event("checkpoint.pending", pipeline)
                        return pipeline
            else:
                pipeline.lane_e_checkpoint = LaneResult(lane_name="lane_e_checkpoint")
                pipeline.lane_e_checkpoint.status = LaneStatus.SKIPPED
            
            # Lane F: Execution
            pipeline.lane_f_execution = await self._execute_lane_f(
                query, intent_analysis, context_snapshot
            )
            await self._emit_event("lane.complete", pipeline, "lane_f")
            
            if pipeline.lane_f_execution.status == LaneStatus.FAILED:
                raise Exception(f"Lane F failed: {pipeline.lane_f_execution.error}")
            
            execution_result: ExecutionResult = pipeline.lane_f_execution.data
            pipeline.result = execution_result.result
            pipeline.total_tokens_used = execution_result.tokens_used
            
            # Lane G: Audit
            pipeline.lane_g_audit = await self._execute_lane_g(pipeline, query)
            await self._emit_event("lane.complete", pipeline, "lane_g")
            
            # Complete pipeline
            pipeline.status = PipelineStatus.COMPLETED
            pipeline.completed_at = datetime.utcnow()
            pipeline.total_time_ms = int(
                (pipeline.completed_at - pipeline.started_at).total_seconds() * 1000
            )
            
            await self._emit_event("pipeline.complete", pipeline)
            
            return pipeline
            
        except Exception as e:
            logger.error(f"Pipeline failed: {e}")
            pipeline.status = PipelineStatus.FAILED
            pipeline.error = str(e)
            pipeline.completed_at = datetime.utcnow()
            if pipeline.started_at:
                pipeline.total_time_ms = int(
                    (pipeline.completed_at - pipeline.started_at).total_seconds() * 1000
                )
            
            await self._emit_event("pipeline.failed", pipeline)
            return pipeline
    
    # =========================================================================
    # LANE A: INTENT ANALYSIS
    # =========================================================================
    
    async def _execute_lane_a(self, query: NovaQuery) -> LaneResult:
        """
        Lane A: Analyze user intent
        
        Determines:
        - Intent type (query, create, update, delete, etc.)
        - Entities mentioned
        - Keywords
        - Estimated token usage
        - Sensitivity level
        """
        lane = LaneResult(lane_name="lane_a_intent")
        lane.started_at = datetime.utcnow()
        lane.status = LaneStatus.RUNNING
        
        try:
            text = query.query.lower()
            
            # Detect intent type
            intent_type = self._detect_intent_type(text)
            
            # Calculate confidence
            confidence = self._calculate_intent_confidence(text, intent_type)
            
            # Extract entities
            entities = self._extract_entities(query.query)
            
            # Extract keywords
            keywords = self._extract_keywords(query.query)
            
            # Detect sensitive patterns
            detected_patterns = []
            requires_action = False
            for pattern, checkpoint_type in SENSITIVE_PATTERNS.items():
                if re.search(pattern, text, re.IGNORECASE):
                    detected_patterns.append(pattern)
                    requires_action = True
            
            # Estimate tokens
            estimated_tokens = self._estimate_tokens(query.query, intent_type)
            
            # Determine sensitivity level
            sensitivity_level = self._determine_sensitivity(intent_type, detected_patterns)
            
            analysis = IntentAnalysis(
                intent_type=intent_type,
                confidence=confidence,
                entities=entities,
                keywords=keywords,
                requires_action=requires_action or intent_type not in [IntentType.QUERY, IntentType.ANALYZE],
                estimated_tokens=estimated_tokens,
                sensitivity_level=sensitivity_level,
                detected_patterns=detected_patterns,
            )
            
            lane.complete(data=analysis)
            logger.debug(f"Lane A complete: intent={intent_type.value}, confidence={confidence}")
            
        except Exception as e:
            lane.complete(error=str(e))
            logger.error(f"Lane A failed: {e}")
        
        return lane
    
    def _detect_intent_type(self, text: str) -> IntentType:
        """Detect the type of intent from query text"""
        # Priority order matters
        if any(word in text for word in ["delete", "remove", "destroy"]):
            return IntentType.DELETE
        if any(word in text for word in ["send", "publish", "post", "email", "notify"]):
            return IntentType.COMMUNICATE
        if any(word in text for word in ["execute", "run", "perform", "trigger"]):
            return IntentType.EXECUTE
        if any(word in text for word in ["create", "add", "new", "make"]):
            return IntentType.CREATE
        if any(word in text for word in ["update", "modify", "change", "edit"]):
            return IntentType.UPDATE
        if any(word in text for word in ["generate", "write", "compose", "draft"]):
            return IntentType.GENERATE
        if any(word in text for word in ["analyze", "examine", "review", "assess"]):
            return IntentType.ANALYZE
        if any(word in text for word in ["what", "how", "why", "where", "when", "who", "show", "list", "get", "find"]):
            return IntentType.QUERY
        return IntentType.UNKNOWN
    
    def _calculate_intent_confidence(self, text: str, intent_type: IntentType) -> float:
        """Calculate confidence score for detected intent"""
        if intent_type == IntentType.UNKNOWN:
            return 0.3
        
        # Base confidence
        confidence = 0.7
        
        # Boost for clear action words
        action_words = {
            IntentType.DELETE: ["delete", "remove"],
            IntentType.CREATE: ["create", "add", "new"],
            IntentType.UPDATE: ["update", "modify", "change"],
            IntentType.QUERY: ["what", "show", "list", "find"],
            IntentType.EXECUTE: ["execute", "run"],
            IntentType.GENERATE: ["generate", "write"],
            IntentType.COMMUNICATE: ["send", "email", "post"],
            IntentType.ANALYZE: ["analyze", "review"],
        }
        
        words = action_words.get(intent_type, [])
        for word in words:
            if word in text:
                confidence += 0.1
        
        return min(confidence, 0.99)
    
    def _extract_entities(self, text: str) -> Dict[str, Any]:
        """Extract entities from text"""
        entities = {}
        
        # Email pattern
        emails = re.findall(r'\b[\w.-]+@[\w.-]+\.\w+\b', text)
        if emails:
            entities["emails"] = emails
        
        # Date patterns
        dates = re.findall(r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b', text)
        if dates:
            entities["dates"] = dates
        
        # Numbers
        numbers = re.findall(r'\b\d+(?:\.\d+)?\b', text)
        if numbers:
            entities["numbers"] = numbers
        
        # Quoted strings
        quoted = re.findall(r'"([^"]*)"', text)
        if quoted:
            entities["quoted"] = quoted
        
        return entities
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text"""
        # Simple keyword extraction (would use NLP in production)
        stop_words = {"the", "a", "an", "is", "are", "was", "were", "be", "been", 
                      "being", "have", "has", "had", "do", "does", "did", "will",
                      "would", "could", "should", "may", "might", "must", "shall",
                      "can", "to", "of", "in", "for", "on", "with", "at", "by",
                      "from", "as", "into", "through", "during", "before", "after",
                      "above", "below", "between", "under", "again", "further",
                      "then", "once", "here", "there", "when", "where", "why",
                      "how", "all", "each", "few", "more", "most", "other", "some",
                      "such", "no", "nor", "not", "only", "own", "same", "so",
                      "than", "too", "very", "just", "and", "but", "if", "or",
                      "because", "until", "while", "this", "that", "these", "those",
                      "i", "me", "my", "myself", "we", "our", "you", "your", "he",
                      "him", "his", "she", "her", "it", "its", "they", "them", "what"}
        
        words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
        keywords = [w for w in words if w not in stop_words and len(w) > 2]
        
        # Remove duplicates while preserving order
        seen = set()
        unique = []
        for k in keywords:
            if k not in seen:
                seen.add(k)
                unique.append(k)
        
        return unique[:10]  # Top 10 keywords
    
    def _estimate_tokens(self, text: str, intent_type: IntentType) -> int:
        """Estimate token usage for query"""
        # Base tokens from text (rough estimate: 4 chars per token)
        base_tokens = len(text) // 4
        
        # Add budget based on intent type
        budget = self._token_budgets.get(intent_type, 5000)
        
        return base_tokens + budget
    
    def _determine_sensitivity(self, intent_type: IntentType, patterns: List[str]) -> SensitivityLevel:
        """Determine sensitivity level"""
        # High sensitivity intents
        if intent_type in [IntentType.DELETE, IntentType.COMMUNICATE]:
            return SensitivityLevel.CONFIDENTIAL
        
        # Check for sensitive patterns
        if any("pay" in p or "transfer" in p for p in patterns):
            return SensitivityLevel.RESTRICTED
        
        if any("delete" in p or "remove" in p for p in patterns):
            return SensitivityLevel.CONFIDENTIAL
        
        if intent_type in [IntentType.UPDATE, IntentType.EXECUTE]:
            return SensitivityLevel.INTERNAL
        
        return SensitivityLevel.INTERNAL
    
    # =========================================================================
    # LANE B: CONTEXT SNAPSHOT
    # =========================================================================
    
    async def _execute_lane_b(
        self, 
        query: NovaQuery, 
        intent: IntentAnalysis
    ) -> LaneResult:
        """
        Lane B: Create immutable context snapshot
        
        Gathers:
        - Identity context
        - Sphere context
        - Thread context
        - Memory context
        - Relevant data
        """
        lane = LaneResult(lane_name="lane_b_context")
        lane.started_at = datetime.utcnow()
        lane.status = LaneStatus.RUNNING
        
        try:
            snapshot = ContextSnapshot(
                identity_context={
                    "identity_id": query.identity_id,
                    "captured_at": datetime.utcnow().isoformat(),
                },
                sphere_context={
                    "sphere_id": query.sphere_id,
                    "active": True,
                } if query.sphere_id else {},
                thread_context=query.context.get("thread", {}),
                memory_context=query.context.get("memory", {}),
                relevant_data=[],
            )
            
            # Would fetch relevant data based on intent and entities
            # For now, include context data
            if query.context:
                for key, value in query.context.items():
                    if key not in ["thread", "memory"]:
                        snapshot.relevant_data.append({
                            "key": key,
                            "value": value,
                            "source": "query_context",
                        })
            
            lane.complete(data=snapshot)
            logger.debug(f"Lane B complete: snapshot_id={snapshot.snapshot_id}")
            
        except Exception as e:
            lane.complete(error=str(e))
            logger.error(f"Lane B failed: {e}")
        
        return lane
    
    # =========================================================================
    # LANE C: SEMANTIC ENCODING
    # =========================================================================
    
    async def _execute_lane_c(
        self,
        query: NovaQuery,
        intent: IntentAnalysis,
        context: ContextSnapshot
    ) -> LaneResult:
        """
        Lane C: Semantic encoding for processing
        
        Creates:
        - Encoded query
        - Embedding vector (placeholder)
        - Semantic tags
        - Entity links
        """
        lane = LaneResult(lane_name="lane_c_encoding")
        lane.started_at = datetime.utcnow()
        lane.status = LaneStatus.RUNNING
        
        try:
            # Create semantic encoding
            encoding = SemanticEncoding(
                encoded_query=self._encode_query(query.query, intent),
                embedding_vector=[],  # Would use embedding model in production
                semantic_tags=self._generate_semantic_tags(intent, context),
                entity_links=self._create_entity_links(intent.entities),
            )
            
            lane.complete(data=encoding)
            logger.debug(f"Lane C complete: encoding_id={encoding.encoding_id}")
            
        except Exception as e:
            lane.complete(error=str(e))
            logger.error(f"Lane C failed: {e}")
        
        return lane
    
    def _encode_query(self, query: str, intent: IntentAnalysis) -> str:
        """Encode query with intent information"""
        encoded = {
            "original": query,
            "intent": intent.intent_type.value,
            "keywords": intent.keywords,
            "action_required": intent.requires_action,
        }
        return json.dumps(encoded)
    
    def _generate_semantic_tags(self, intent: IntentAnalysis, context: ContextSnapshot) -> List[str]:
        """Generate semantic tags for the query"""
        tags = []
        
        # Intent-based tags
        tags.append(f"intent:{intent.intent_type.value}")
        tags.append(f"sensitivity:{intent.sensitivity_level.value}")
        
        # Action tags
        if intent.requires_action:
            tags.append("requires_action")
        
        # Context tags
        if context.sphere_context:
            tags.append(f"sphere:{context.sphere_context.get('sphere_id', 'unknown')}")
        
        # Keyword tags
        for keyword in intent.keywords[:3]:
            tags.append(f"keyword:{keyword}")
        
        return tags
    
    def _create_entity_links(self, entities: Dict[str, Any]) -> Dict[str, str]:
        """Create entity links for resolution"""
        links = {}
        
        for entity_type, values in entities.items():
            if isinstance(values, list):
                for i, value in enumerate(values):
                    links[f"{entity_type}_{i}"] = str(value)
            else:
                links[entity_type] = str(values)
        
        return links
    
    # =========================================================================
    # LANE D: GOVERNANCE CHECK
    # =========================================================================
    
    async def _execute_lane_d(
        self,
        query: NovaQuery,
        intent: IntentAnalysis,
        context: ContextSnapshot
    ) -> LaneResult:
        """
        Lane D: Governance and policy checks
        
        Validates:
        - Identity permissions
        - Sphere boundaries
        - Token budgets
        - Policy compliance
        - Sensitive action detection
        """
        lane = LaneResult(lane_name="lane_d_governance")
        lane.started_at = datetime.utcnow()
        lane.status = LaneStatus.RUNNING
        
        try:
            result = GovernanceResult()
            violations = []
            warnings = []
            applied_policies = []
            
            # Check 1: Identity isolation
            identity_check = self._check_identity_isolation(query, context)
            if not identity_check["passed"]:
                violations.append(identity_check["reason"])
                result.requires_checkpoint = True
                result.checkpoint_type = CheckpointType.IDENTITY
                result.checkpoint_reason = identity_check["reason"]
            applied_policies.append("identity_isolation")
            
            # Check 2: Token budget
            budget = self._token_budgets.get(intent.intent_type, 5000)
            if intent.estimated_tokens > budget * 1.5:  # 150% threshold
                result.requires_checkpoint = True
                result.checkpoint_type = CheckpointType.COST
                result.checkpoint_reason = f"Estimated tokens ({intent.estimated_tokens}) exceeds budget ({budget})"
                warnings.append(result.checkpoint_reason)
            result.token_budget_remaining = max(0, budget - intent.estimated_tokens)
            applied_policies.append("token_budget")
            
            # Check 3: Sensitive action detection
            if intent.detected_patterns:
                for pattern in intent.detected_patterns:
                    checkpoint_type = SENSITIVE_PATTERNS.get(pattern, CheckpointType.GOVERNANCE)
                    result.requires_checkpoint = True
                    result.checkpoint_type = checkpoint_type
                    result.checkpoint_reason = f"Sensitive pattern detected: {pattern}"
                    warnings.append(result.checkpoint_reason)
            applied_policies.append("sensitive_action_detection")
            
            # Check 4: Intent-based governance
            if intent.intent_type in [IntentType.DELETE, IntentType.COMMUNICATE, IntentType.EXECUTE]:
                result.requires_checkpoint = True
                if not result.checkpoint_type:
                    result.checkpoint_type = CheckpointType.SENSITIVE
                    result.checkpoint_reason = f"Action type '{intent.intent_type.value}' requires approval"
            applied_policies.append("intent_governance")
            
            # Check 5: Query options override
            if query.options.get("require_approval", False):
                result.requires_checkpoint = True
                if not result.checkpoint_type:
                    result.checkpoint_type = CheckpointType.GOVERNANCE
                    result.checkpoint_reason = "Explicit approval requested"
            applied_policies.append("explicit_approval_check")
            
            # Set final values
            result.passed = len(violations) == 0
            result.violations = violations
            result.warnings = warnings
            result.applied_policies = applied_policies
            
            lane.complete(data=result)
            logger.debug(f"Lane D complete: passed={result.passed}, checkpoint_required={result.requires_checkpoint}")
            
        except Exception as e:
            lane.complete(error=str(e))
            logger.error(f"Lane D failed: {e}")
        
        return lane
    
    def _check_identity_isolation(self, query: NovaQuery, context: ContextSnapshot) -> Dict[str, Any]:
        """Check identity isolation - no cross-identity access"""
        # Would integrate with identity service in production
        query_identity = query.identity_id
        context_identity = context.identity_context.get("identity_id")
        
        if context_identity and query_identity != context_identity:
            return {
                "passed": False,
                "reason": f"Cross-identity access detected: {query_identity} != {context_identity}"
            }
        
        return {"passed": True, "reason": None}
    
    # =========================================================================
    # LANE E: CHECKPOINT
    # =========================================================================
    
    async def _execute_lane_e(
        self,
        pipeline: PipelineResult,
        query: NovaQuery,
        governance: GovernanceResult
    ) -> LaneResult:
        """
        Lane E: Create checkpoint for human approval
        
        Creates blocking checkpoint that returns HTTP 423
        """
        lane = LaneResult(lane_name="lane_e_checkpoint")
        lane.started_at = datetime.utcnow()
        lane.status = LaneStatus.RUNNING
        
        try:
            checkpoint = Checkpoint(
                pipeline_id=pipeline.pipeline_id,
                checkpoint_type=governance.checkpoint_type or CheckpointType.GOVERNANCE,
                reason=governance.checkpoint_reason or "Approval required",
                details={
                    "query": query.query,
                    "identity_id": query.identity_id,
                    "violations": governance.violations,
                    "warnings": governance.warnings,
                },
                expires_at=datetime.utcnow() + self._checkpoint_timeout,
            )
            
            # Store checkpoint
            self._checkpoints[checkpoint.id] = checkpoint
            self._total_checkpoints += 1
            
            lane.complete(data=checkpoint)
            logger.info(f"Lane E: Checkpoint created: {checkpoint.id} ({checkpoint.checkpoint_type.value})")
            
        except Exception as e:
            lane.complete(error=str(e))
            logger.error(f"Lane E failed: {e}")
        
        return lane
    
    # =========================================================================
    # LANE F: EXECUTION
    # =========================================================================
    
    async def _execute_lane_f(
        self,
        query: NovaQuery,
        intent: IntentAnalysis,
        context: ContextSnapshot
    ) -> LaneResult:
        """
        Lane F: Execute the approved action
        
        Only runs after checkpoint approval (if checkpoint was required)
        """
        lane = LaneResult(lane_name="lane_f_execution")
        lane.started_at = datetime.utcnow()
        lane.status = LaneStatus.RUNNING
        
        try:
            start_time = time.time()
            
            # Execute based on intent type
            result = await self._execute_by_intent(query, intent, context)
            
            execution_time_ms = int((time.time() - start_time) * 1000)
            
            execution_result = ExecutionResult(
                success=True,
                result=result,
                tokens_used=intent.estimated_tokens,
                execution_time_ms=execution_time_ms,
                actions_taken=[f"Executed {intent.intent_type.value} action"],
            )
            
            lane.complete(data=execution_result)
            logger.debug(f"Lane F complete: success={execution_result.success}")
            
        except Exception as e:
            lane.complete(error=str(e))
            logger.error(f"Lane F failed: {e}")
        
        return lane
    
    async def _execute_by_intent(
        self,
        query: NovaQuery,
        intent: IntentAnalysis,
        context: ContextSnapshot
    ) -> Any:
        """Execute action based on intent type"""
        # In production, this would dispatch to appropriate services
        # For now, return mock results
        
        if intent.intent_type == IntentType.QUERY:
            return {
                "type": "query_result",
                "data": f"Results for: {query.query}",
                "count": 10,
            }
        
        elif intent.intent_type == IntentType.CREATE:
            return {
                "type": "create_result",
                "created_id": str(uuid4()),
                "message": "Resource created successfully",
            }
        
        elif intent.intent_type == IntentType.UPDATE:
            return {
                "type": "update_result",
                "updated": True,
                "message": "Resource updated successfully",
            }
        
        elif intent.intent_type == IntentType.DELETE:
            return {
                "type": "delete_result",
                "deleted": True,
                "message": "Resource deleted successfully",
            }
        
        elif intent.intent_type == IntentType.GENERATE:
            return {
                "type": "generation_result",
                "content": f"Generated content for: {query.query}",
            }
        
        elif intent.intent_type == IntentType.ANALYZE:
            return {
                "type": "analysis_result",
                "insights": ["Insight 1", "Insight 2", "Insight 3"],
            }
        
        elif intent.intent_type == IntentType.COMMUNICATE:
            return {
                "type": "communication_result",
                "sent": True,
                "message_id": str(uuid4()),
            }
        
        elif intent.intent_type == IntentType.EXECUTE:
            return {
                "type": "execution_result",
                "executed": True,
                "output": "Action executed successfully",
            }
        
        else:
            return {
                "type": "unknown_result",
                "query": query.query,
            }
    
    # =========================================================================
    # LANE G: AUDIT
    # =========================================================================
    
    async def _execute_lane_g(
        self,
        pipeline: PipelineResult,
        query: NovaQuery
    ) -> LaneResult:
        """
        Lane G: Create audit trail
        
        Logs all pipeline activity for compliance and debugging
        """
        lane = LaneResult(lane_name="lane_g_audit")
        lane.started_at = datetime.utcnow()
        lane.status = LaneStatus.RUNNING
        
        try:
            audit_entry = AuditEntry(
                pipeline_id=pipeline.pipeline_id,
                identity_id=query.identity_id,
                action="pipeline_execution",
                details={
                    "query_id": query.id,
                    "query": query.query[:100],  # Truncate for storage
                    "status": pipeline.status.value,
                    "tokens_used": pipeline.total_tokens_used,
                    "execution_time_ms": pipeline.total_time_ms,
                    "lanes": {
                        "a_intent": pipeline.lane_a_intent.status.value if pipeline.lane_a_intent else None,
                        "b_context": pipeline.lane_b_context.status.value if pipeline.lane_b_context else None,
                        "c_encoding": pipeline.lane_c_encoding.status.value if pipeline.lane_c_encoding else None,
                        "d_governance": pipeline.lane_d_governance.status.value if pipeline.lane_d_governance else None,
                        "e_checkpoint": pipeline.lane_e_checkpoint.status.value if pipeline.lane_e_checkpoint else None,
                        "f_execution": pipeline.lane_f_execution.status.value if pipeline.lane_f_execution else None,
                    },
                    "checkpoint_id": pipeline.checkpoint.id if pipeline.checkpoint else None,
                },
            )
            
            # Would persist to audit log in production
            logger.info(f"Audit: {audit_entry.to_dict()}")
            
            lane.complete(data=audit_entry)
            logger.debug(f"Lane G complete: audit_id={audit_entry.id}")
            
        except Exception as e:
            lane.complete(error=str(e))
            logger.error(f"Lane G failed: {e}")
        
        return lane
    
    # =========================================================================
    # CHECKPOINT RESOLUTION
    # =========================================================================
    
    async def approve_checkpoint(
        self,
        checkpoint_id: str,
        approver_id: str,
        notes: Optional[str] = None
    ) -> PipelineResult:
        """
        Approve a pending checkpoint and continue pipeline execution
        """
        checkpoint = self._checkpoints.get(checkpoint_id)
        if not checkpoint:
            raise ValueError(f"Checkpoint not found: {checkpoint_id}")
        
        if not checkpoint.is_pending:
            raise ValueError(f"Checkpoint is not pending: {checkpoint_id}")
        
        # Resolve checkpoint
        checkpoint.resolution = "approved"
        checkpoint.resolved_at = datetime.utcnow()
        checkpoint.resolved_by = approver_id
        
        self._total_approvals += 1
        
        # Get pipeline
        pipeline = self._pipelines.get(checkpoint.pipeline_id)
        if not pipeline:
            raise ValueError(f"Pipeline not found: {checkpoint.pipeline_id}")
        
        # Continue execution from Lane F
        pipeline.status = PipelineStatus.APPROVED
        await self._emit_event("checkpoint.resolved", pipeline, "approved")
        
        # Get stored context
        intent_analysis = pipeline.lane_a_intent.data if pipeline.lane_a_intent else None
        context_snapshot = pipeline.lane_b_context.data if pipeline.lane_b_context else None
        
        if not intent_analysis or not context_snapshot:
            pipeline.status = PipelineStatus.FAILED
            pipeline.error = "Missing context for resumed execution"
            return pipeline
        
        # Create query from pipeline
        query = NovaQuery(
            id=pipeline.query_id,
            query=checkpoint.details.get("query", ""),
            identity_id=checkpoint.details.get("identity_id", ""),
        )
        
        # Execute Lane F
        pipeline.lane_f_execution = await self._execute_lane_f(query, intent_analysis, context_snapshot)
        
        if pipeline.lane_f_execution.status == LaneStatus.FAILED:
            pipeline.status = PipelineStatus.FAILED
            pipeline.error = pipeline.lane_f_execution.error
            return pipeline
        
        execution_result = pipeline.lane_f_execution.data
        pipeline.result = execution_result.result
        pipeline.total_tokens_used = execution_result.tokens_used
        
        # Execute Lane G
        pipeline.lane_g_audit = await self._execute_lane_g(pipeline, query)
        
        # Complete pipeline
        pipeline.status = PipelineStatus.COMPLETED
        pipeline.completed_at = datetime.utcnow()
        if pipeline.started_at:
            pipeline.total_time_ms = int(
                (pipeline.completed_at - pipeline.started_at).total_seconds() * 1000
            )
        
        await self._emit_event("pipeline.complete", pipeline)
        
        return pipeline
    
    async def reject_checkpoint(
        self,
        checkpoint_id: str,
        rejector_id: str,
        reason: Optional[str] = None
    ) -> PipelineResult:
        """
        Reject a pending checkpoint and cancel pipeline
        """
        checkpoint = self._checkpoints.get(checkpoint_id)
        if not checkpoint:
            raise ValueError(f"Checkpoint not found: {checkpoint_id}")
        
        if not checkpoint.is_pending:
            raise ValueError(f"Checkpoint is not pending: {checkpoint_id}")
        
        # Resolve checkpoint
        checkpoint.resolution = "rejected"
        checkpoint.resolved_at = datetime.utcnow()
        checkpoint.resolved_by = rejector_id
        
        self._total_rejections += 1
        
        # Get pipeline
        pipeline = self._pipelines.get(checkpoint.pipeline_id)
        if not pipeline:
            raise ValueError(f"Pipeline not found: {checkpoint.pipeline_id}")
        
        # Mark as rejected
        pipeline.status = PipelineStatus.REJECTED
        pipeline.error = reason or "Checkpoint rejected by user"
        pipeline.completed_at = datetime.utcnow()
        if pipeline.started_at:
            pipeline.total_time_ms = int(
                (pipeline.completed_at - pipeline.started_at).total_seconds() * 1000
            )
        
        await self._emit_event("checkpoint.resolved", pipeline, "rejected")
        
        # Create audit entry for rejection
        audit_entry = AuditEntry(
            pipeline_id=pipeline.pipeline_id,
            identity_id=rejector_id,
            action="checkpoint_rejected",
            details={
                "checkpoint_id": checkpoint_id,
                "reason": reason,
            },
        )
        logger.info(f"Checkpoint rejected: {audit_entry.to_dict()}")
        
        return pipeline
    
    # =========================================================================
    # PIPELINE MANAGEMENT
    # =========================================================================
    
    def get_pipeline(self, pipeline_id: str) -> Optional[PipelineResult]:
        """Get pipeline by ID"""
        return self._pipelines.get(pipeline_id)
    
    def get_checkpoint(self, checkpoint_id: str) -> Optional[Checkpoint]:
        """Get checkpoint by ID"""
        return self._checkpoints.get(checkpoint_id)
    
    def get_pending_checkpoints(self, identity_id: Optional[str] = None) -> List[Checkpoint]:
        """Get all pending checkpoints, optionally filtered by identity"""
        pending = [
            cp for cp in self._checkpoints.values()
            if cp.is_pending
        ]
        
        if identity_id:
            pending = [
                cp for cp in pending
                if cp.details.get("identity_id") == identity_id
            ]
        
        return sorted(pending, key=lambda x: x.created_at, reverse=True)
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get pipeline metrics"""
        return {
            "total_pipelines": self._total_pipelines,
            "total_checkpoints": self._total_checkpoints,
            "total_approvals": self._total_approvals,
            "total_rejections": self._total_rejections,
            "pending_checkpoints": len([cp for cp in self._checkpoints.values() if cp.is_pending]),
            "active_pipelines": len([
                p for p in self._pipelines.values()
                if p.status in [PipelineStatus.RUNNING, PipelineStatus.CHECKPOINT_PENDING]
            ]),
        }
    
    # =========================================================================
    # EVENT HANDLING
    # =========================================================================
    
    def on(self, event: str, handler: Callable):
        """Register event handler"""
        if event in self._event_handlers:
            self._event_handlers[event].append(handler)
    
    async def _emit_event(self, event: str, pipeline: PipelineResult, *args):
        """Emit event to all handlers"""
        handlers = self._event_handlers.get(event, [])
        for handler in handlers:
            try:
                if asyncio.iscoroutinefunction(handler):
                    await handler(pipeline, *args)
                else:
                    handler(pipeline, *args)
            except Exception as e:
                logger.error(f"Event handler error for {event}: {e}")


# =============================================================================
# SINGLETON INSTANCE
# =============================================================================

_nova_pipeline_service: Optional[NovaPipelineService] = None


def get_nova_pipeline_service() -> NovaPipelineService:
    """Get or create Nova Pipeline service instance"""
    global _nova_pipeline_service
    if _nova_pipeline_service is None:
        _nova_pipeline_service = NovaPipelineService()
    return _nova_pipeline_service


# =============================================================================
# TEST/DEMO
# =============================================================================

async def demo():
    """Demo the Nova Pipeline"""
    service = get_nova_pipeline_service()
    
    # Test 1: Simple query (no checkpoint)
    print("\n=== Test 1: Simple Query ===")
    query1 = NovaQuery(
        query="What are my upcoming meetings?",
        identity_id="user_123",
        sphere_id="personal",
    )
    result1 = await service.execute_query(query1)
    print(f"Status: {result1.status.value}")
    print(f"Result: {result1.result}")
    
    # Test 2: Delete action (requires checkpoint)
    print("\n=== Test 2: Delete Action ===")
    query2 = NovaQuery(
        query="Delete all my old emails from last year",
        identity_id="user_123",
        sphere_id="personal",
    )
    result2 = await service.execute_query(query2)
    print(f"Status: {result2.status.value}")
    if result2.checkpoint:
        print(f"Checkpoint: {result2.checkpoint.id}")
        print(f"Type: {result2.checkpoint.checkpoint_type.value}")
        print(f"Reason: {result2.checkpoint.reason}")
        
        # Approve checkpoint
        print("\nApproving checkpoint...")
        result2 = await service.approve_checkpoint(
            result2.checkpoint.id,
            "admin_user"
        )
        print(f"After approval - Status: {result2.status.value}")
        print(f"Result: {result2.result}")
    
    # Metrics
    print("\n=== Metrics ===")
    print(service.get_metrics())


if __name__ == "__main__":
    asyncio.run(demo())
