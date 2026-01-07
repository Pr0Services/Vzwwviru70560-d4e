"""
CHE·NU™ Governance Checkpoint Service
Policy Engine and Checkpoint Management

CANON: GOUVERNANCE > EXÉCUTION
- No action without governance validation
- Human approval for sensitive operations
- Full audit trail

Author: CHE·NU Team
Version: 1.0.0
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set
from uuid import uuid4
import asyncio
import hashlib
import json
import logging
import re

logger = logging.getLogger(__name__)


# =============================================================================
# ENUMS
# =============================================================================

class PolicyType(str, Enum):
    """Types of governance policies"""
    IDENTITY_ISOLATION = "identity_isolation"
    SPHERE_BOUNDARY = "sphere_boundary"
    TOKEN_BUDGET = "token_budget"
    RATE_LIMIT = "rate_limit"
    DATA_SENSITIVITY = "data_sensitivity"
    ACTION_RESTRICTION = "action_restriction"
    TIME_RESTRICTION = "time_restriction"
    ROLE_BASED = "role_based"
    CUSTOM = "custom"


class PolicyAction(str, Enum):
    """Actions a policy can take"""
    ALLOW = "allow"
    DENY = "deny"
    CHECKPOINT = "checkpoint"
    LOG = "log"
    ESCALATE = "escalate"


class EscalationLevel(str, Enum):
    """Escalation levels for violations"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class CheckpointStatus(str, Enum):
    """Status of a checkpoint"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"
    ESCALATED = "escalated"


# =============================================================================
# DATA MODELS
# =============================================================================

@dataclass
class Policy:
    """A governance policy definition"""
    id: str = field(default_factory=lambda: str(uuid4()))
    name: str = ""
    description: str = ""
    policy_type: PolicyType = PolicyType.CUSTOM
    action: PolicyAction = PolicyAction.CHECKPOINT
    priority: int = 50  # 0-100, higher = more important
    enabled: bool = True
    
    # Conditions
    conditions: Dict[str, Any] = field(default_factory=dict)
    
    # Metadata
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    created_by: str = "system"
    
    def matches(self, context: Dict[str, Any]) -> bool:
        """Check if policy matches the given context"""
        if not self.enabled:
            return False
        
        for key, expected in self.conditions.items():
            actual = context.get(key)
            
            # Handle different comparison types
            if isinstance(expected, dict):
                op = expected.get("op", "eq")
                value = expected.get("value")
                
                if op == "eq" and actual != value:
                    return False
                elif op == "ne" and actual == value:
                    return False
                elif op == "gt" and not (actual and actual > value):
                    return False
                elif op == "gte" and not (actual and actual >= value):
                    return False
                elif op == "lt" and not (actual and actual < value):
                    return False
                elif op == "lte" and not (actual and actual <= value):
                    return False
                elif op == "in" and actual not in value:
                    return False
                elif op == "not_in" and actual in value:
                    return False
                elif op == "contains" and value not in str(actual):
                    return False
                elif op == "regex" and not re.match(value, str(actual)):
                    return False
            else:
                if actual != expected:
                    return False
        
        return True
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "policy_type": self.policy_type.value,
            "action": self.action.value,
            "priority": self.priority,
            "enabled": self.enabled,
            "conditions": self.conditions,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "created_by": self.created_by,
        }


@dataclass
class PolicyViolation:
    """A policy violation record"""
    id: str = field(default_factory=lambda: str(uuid4()))
    policy_id: str = ""
    policy_name: str = ""
    context: Dict[str, Any] = field(default_factory=dict)
    action_taken: PolicyAction = PolicyAction.DENY
    escalation_level: EscalationLevel = EscalationLevel.LOW
    message: str = ""
    timestamp: datetime = field(default_factory=datetime.utcnow)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "policy_id": self.policy_id,
            "policy_name": self.policy_name,
            "action_taken": self.action_taken.value,
            "escalation_level": self.escalation_level.value,
            "message": self.message,
            "timestamp": self.timestamp.isoformat(),
        }


@dataclass
class GovernanceCheckpoint:
    """A governance checkpoint requiring human approval"""
    id: str = field(default_factory=lambda: str(uuid4()))
    
    # References
    pipeline_id: str = ""
    policy_id: Optional[str] = None
    violation_id: Optional[str] = None
    
    # Checkpoint details
    checkpoint_type: str = "governance"
    reason: str = ""
    details: Dict[str, Any] = field(default_factory=dict)
    
    # Context
    identity_id: str = ""
    sphere_id: Optional[str] = None
    action_type: str = ""
    target_resource: Optional[str] = None
    
    # Approval
    requires_approval: bool = True
    approval_level: EscalationLevel = EscalationLevel.MEDIUM
    approvers: List[str] = field(default_factory=list)
    
    # Status
    status: CheckpointStatus = CheckpointStatus.PENDING
    resolution_notes: Optional[str] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    
    def __post_init__(self):
        if not self.expires_at:
            # Default expiry based on escalation level
            hours = {
                EscalationLevel.LOW: 72,
                EscalationLevel.MEDIUM: 24,
                EscalationLevel.HIGH: 4,
                EscalationLevel.CRITICAL: 1,
            }
            self.expires_at = self.created_at + timedelta(hours=hours.get(self.approval_level, 24))
    
    @property
    def is_expired(self) -> bool:
        return datetime.utcnow() > self.expires_at if self.expires_at else False
    
    @property
    def is_pending(self) -> bool:
        return self.status == CheckpointStatus.PENDING and not self.is_expired
    
    def approve(self, approver_id: str, notes: Optional[str] = None):
        """Approve the checkpoint"""
        if not self.is_pending:
            raise ValueError("Checkpoint is not pending")
        
        self.status = CheckpointStatus.APPROVED
        self.resolved_by = approver_id
        self.resolved_at = datetime.utcnow()
        self.resolution_notes = notes
    
    def reject(self, rejector_id: str, reason: Optional[str] = None):
        """Reject the checkpoint"""
        if not self.is_pending:
            raise ValueError("Checkpoint is not pending")
        
        self.status = CheckpointStatus.REJECTED
        self.resolved_by = rejector_id
        self.resolved_at = datetime.utcnow()
        self.resolution_notes = reason
    
    def escalate(self, escalator_id: str, reason: str):
        """Escalate the checkpoint to higher authority"""
        if not self.is_pending:
            raise ValueError("Checkpoint is not pending")
        
        self.status = CheckpointStatus.ESCALATED
        self.resolution_notes = f"Escalated by {escalator_id}: {reason}"
        
        # Increase approval level
        levels = list(EscalationLevel)
        current_idx = levels.index(self.approval_level)
        if current_idx < len(levels) - 1:
            self.approval_level = levels[current_idx + 1]
        
        # Reset status to pending at new level
        self.status = CheckpointStatus.PENDING
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "pipeline_id": self.pipeline_id,
            "policy_id": self.policy_id,
            "violation_id": self.violation_id,
            "checkpoint_type": self.checkpoint_type,
            "reason": self.reason,
            "details": self.details,
            "identity_id": self.identity_id,
            "sphere_id": self.sphere_id,
            "action_type": self.action_type,
            "target_resource": self.target_resource,
            "requires_approval": self.requires_approval,
            "approval_level": self.approval_level.value,
            "approvers": self.approvers,
            "status": self.status.value,
            "resolution_notes": self.resolution_notes,
            "resolved_by": self.resolved_by,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None,
            "created_at": self.created_at.isoformat(),
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
            "is_pending": self.is_pending,
            "is_expired": self.is_expired,
        }


@dataclass
class GovernanceContext:
    """Context for governance evaluation"""
    identity_id: str = ""
    sphere_id: Optional[str] = None
    action_type: str = ""
    target_resource: Optional[str] = None
    query: str = ""
    intent_type: Optional[str] = None
    sensitivity_level: Optional[str] = None
    estimated_tokens: int = 0
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "identity_id": self.identity_id,
            "sphere_id": self.sphere_id,
            "action_type": self.action_type,
            "target_resource": self.target_resource,
            "query": self.query,
            "intent_type": self.intent_type,
            "sensitivity_level": self.sensitivity_level,
            "estimated_tokens": self.estimated_tokens,
            **self.metadata,
        }


@dataclass
class GovernanceResult:
    """Result of governance evaluation"""
    allowed: bool = True
    requires_checkpoint: bool = False
    violations: List[PolicyViolation] = field(default_factory=list)
    applied_policies: List[str] = field(default_factory=list)
    checkpoint: Optional[GovernanceCheckpoint] = None
    message: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "allowed": self.allowed,
            "requires_checkpoint": self.requires_checkpoint,
            "violations": [v.to_dict() for v in self.violations],
            "applied_policies": self.applied_policies,
            "checkpoint": self.checkpoint.to_dict() if self.checkpoint else None,
            "message": self.message,
        }


# =============================================================================
# GOVERNANCE SERVICE
# =============================================================================

class GovernanceCheckpointService:
    """
    Governance Checkpoint Service
    
    Manages policies, evaluates governance rules, and handles checkpoints.
    CANON: GOUVERNANCE > EXÉCUTION
    """
    
    def __init__(self):
        # Policy storage
        self._policies: Dict[str, Policy] = {}
        self._checkpoints: Dict[str, GovernanceCheckpoint] = {}
        self._violations: List[PolicyViolation] = []
        
        # Metrics
        self._total_evaluations = 0
        self._total_checkpoints = 0
        self._total_violations = 0
        self._total_approvals = 0
        self._total_rejections = 0
        
        # Event handlers
        self._event_handlers: Dict[str, List[Callable]] = {
            "checkpoint.created": [],
            "checkpoint.approved": [],
            "checkpoint.rejected": [],
            "checkpoint.escalated": [],
            "checkpoint.expired": [],
            "violation.detected": [],
        }
        
        # Initialize default policies
        self._initialize_default_policies()
        
        logger.info("GovernanceCheckpointService initialized")
    
    def _initialize_default_policies(self):
        """Initialize built-in governance policies"""
        
        # Policy 1: Identity Isolation
        self.add_policy(Policy(
            name="identity_isolation",
            description="Prevent cross-identity data access",
            policy_type=PolicyType.IDENTITY_ISOLATION,
            action=PolicyAction.DENY,
            priority=100,
            conditions={"cross_identity": True},
        ))
        
        # Policy 2: Delete Action Checkpoint
        self.add_policy(Policy(
            name="delete_action_checkpoint",
            description="Require approval for delete actions",
            policy_type=PolicyType.ACTION_RESTRICTION,
            action=PolicyAction.CHECKPOINT,
            priority=90,
            conditions={"action_type": "delete"},
        ))
        
        # Policy 3: External Communication Checkpoint
        self.add_policy(Policy(
            name="external_communication_checkpoint",
            description="Require approval for external communications",
            policy_type=PolicyType.ACTION_RESTRICTION,
            action=PolicyAction.CHECKPOINT,
            priority=85,
            conditions={"action_type": "communicate"},
        ))
        
        # Policy 4: High Token Usage
        self.add_policy(Policy(
            name="high_token_usage",
            description="Checkpoint for high token usage",
            policy_type=PolicyType.TOKEN_BUDGET,
            action=PolicyAction.CHECKPOINT,
            priority=70,
            conditions={"estimated_tokens": {"op": "gt", "value": 20000}},
        ))
        
        # Policy 5: Sensitive Data Access
        self.add_policy(Policy(
            name="sensitive_data_access",
            description="Checkpoint for restricted data access",
            policy_type=PolicyType.DATA_SENSITIVITY,
            action=PolicyAction.CHECKPOINT,
            priority=95,
            conditions={"sensitivity_level": {"op": "in", "value": ["restricted", "top_secret"]}},
        ))
        
        # Policy 6: Financial Actions
        self.add_policy(Policy(
            name="financial_actions",
            description="Checkpoint for financial transactions",
            policy_type=PolicyType.ACTION_RESTRICTION,
            action=PolicyAction.CHECKPOINT,
            priority=92,
            conditions={"query": {"op": "regex", "value": r"(?i)(pay|transfer|send\s+money|transaction)"}},
        ))
        
        logger.info(f"Initialized {len(self._policies)} default policies")
    
    # =========================================================================
    # POLICY MANAGEMENT
    # =========================================================================
    
    def add_policy(self, policy: Policy) -> str:
        """Add a new policy"""
        self._policies[policy.id] = policy
        logger.debug(f"Added policy: {policy.name} ({policy.id})")
        return policy.id
    
    def update_policy(self, policy_id: str, updates: Dict[str, Any]) -> Policy:
        """Update an existing policy"""
        policy = self._policies.get(policy_id)
        if not policy:
            raise ValueError(f"Policy not found: {policy_id}")
        
        for key, value in updates.items():
            if hasattr(policy, key):
                setattr(policy, key, value)
        
        policy.updated_at = datetime.utcnow()
        return policy
    
    def delete_policy(self, policy_id: str) -> bool:
        """Delete a policy"""
        if policy_id in self._policies:
            del self._policies[policy_id]
            return True
        return False
    
    def get_policy(self, policy_id: str) -> Optional[Policy]:
        """Get a policy by ID"""
        return self._policies.get(policy_id)
    
    def list_policies(self, enabled_only: bool = False) -> List[Policy]:
        """List all policies"""
        policies = list(self._policies.values())
        if enabled_only:
            policies = [p for p in policies if p.enabled]
        return sorted(policies, key=lambda p: p.priority, reverse=True)
    
    # =========================================================================
    # GOVERNANCE EVALUATION
    # =========================================================================
    
    async def evaluate(self, context: GovernanceContext) -> GovernanceResult:
        """
        Evaluate governance rules for the given context
        
        CANON: All actions must pass governance evaluation
        """
        self._total_evaluations += 1
        result = GovernanceResult()
        context_dict = context.to_dict()
        
        # Check for cross-identity access
        if context.metadata.get("cross_identity"):
            violation = PolicyViolation(
                policy_id="identity_isolation",
                policy_name="identity_isolation",
                context=context_dict,
                action_taken=PolicyAction.DENY,
                escalation_level=EscalationLevel.CRITICAL,
                message="Cross-identity access is forbidden",
            )
            result.violations.append(violation)
            result.allowed = False
            result.message = "Identity isolation violation"
            self._violations.append(violation)
            self._total_violations += 1
            await self._emit_event("violation.detected", violation)
            return result
        
        # Evaluate all policies
        policies = self.list_policies(enabled_only=True)
        checkpoint_reasons = []
        
        for policy in policies:
            if policy.matches(context_dict):
                result.applied_policies.append(policy.name)
                
                if policy.action == PolicyAction.DENY:
                    violation = PolicyViolation(
                        policy_id=policy.id,
                        policy_name=policy.name,
                        context=context_dict,
                        action_taken=PolicyAction.DENY,
                        escalation_level=self._get_escalation_level(policy),
                        message=policy.description,
                    )
                    result.violations.append(violation)
                    result.allowed = False
                    self._violations.append(violation)
                    self._total_violations += 1
                    await self._emit_event("violation.detected", violation)
                
                elif policy.action == PolicyAction.CHECKPOINT:
                    result.requires_checkpoint = True
                    checkpoint_reasons.append(policy.description)
                
                elif policy.action == PolicyAction.ESCALATE:
                    result.requires_checkpoint = True
                    checkpoint_reasons.append(f"ESCALATE: {policy.description}")
        
        # Create checkpoint if required
        if result.requires_checkpoint and result.allowed:
            checkpoint = await self._create_checkpoint(
                context=context,
                reasons=checkpoint_reasons,
                violations=result.violations,
            )
            result.checkpoint = checkpoint
            result.message = f"Checkpoint required: {'; '.join(checkpoint_reasons)}"
        elif not result.allowed:
            result.message = f"Action denied: {result.violations[0].message if result.violations else 'Policy violation'}"
        else:
            result.message = "Action allowed"
        
        return result
    
    def _get_escalation_level(self, policy: Policy) -> EscalationLevel:
        """Determine escalation level based on policy"""
        if policy.priority >= 95:
            return EscalationLevel.CRITICAL
        elif policy.priority >= 85:
            return EscalationLevel.HIGH
        elif policy.priority >= 70:
            return EscalationLevel.MEDIUM
        return EscalationLevel.LOW
    
    async def _create_checkpoint(
        self,
        context: GovernanceContext,
        reasons: List[str],
        violations: List[PolicyViolation]
    ) -> GovernanceCheckpoint:
        """Create a governance checkpoint"""
        
        # Determine approval level from violations
        approval_level = EscalationLevel.MEDIUM
        if violations:
            highest = max(v.escalation_level for v in violations)
            approval_level = highest
        
        checkpoint = GovernanceCheckpoint(
            checkpoint_type="governance",
            reason="; ".join(reasons),
            details={
                "query": context.query[:500],  # Truncate
                "action_type": context.action_type,
                "intent_type": context.intent_type,
                "violations": [v.to_dict() for v in violations],
            },
            identity_id=context.identity_id,
            sphere_id=context.sphere_id,
            action_type=context.action_type,
            target_resource=context.target_resource,
            approval_level=approval_level,
        )
        
        self._checkpoints[checkpoint.id] = checkpoint
        self._total_checkpoints += 1
        
        await self._emit_event("checkpoint.created", checkpoint)
        logger.info(f"Created checkpoint: {checkpoint.id} ({checkpoint.reason[:50]}...)")
        
        return checkpoint
    
    # =========================================================================
    # CHECKPOINT MANAGEMENT
    # =========================================================================
    
    async def approve_checkpoint(
        self,
        checkpoint_id: str,
        approver_id: str,
        notes: Optional[str] = None
    ) -> GovernanceCheckpoint:
        """Approve a checkpoint"""
        checkpoint = self._checkpoints.get(checkpoint_id)
        if not checkpoint:
            raise ValueError(f"Checkpoint not found: {checkpoint_id}")
        
        checkpoint.approve(approver_id, notes)
        self._total_approvals += 1
        
        await self._emit_event("checkpoint.approved", checkpoint)
        logger.info(f"Checkpoint approved: {checkpoint_id} by {approver_id}")
        
        return checkpoint
    
    async def reject_checkpoint(
        self,
        checkpoint_id: str,
        rejector_id: str,
        reason: Optional[str] = None
    ) -> GovernanceCheckpoint:
        """Reject a checkpoint"""
        checkpoint = self._checkpoints.get(checkpoint_id)
        if not checkpoint:
            raise ValueError(f"Checkpoint not found: {checkpoint_id}")
        
        checkpoint.reject(rejector_id, reason)
        self._total_rejections += 1
        
        await self._emit_event("checkpoint.rejected", checkpoint)
        logger.info(f"Checkpoint rejected: {checkpoint_id} by {rejector_id}")
        
        return checkpoint
    
    async def escalate_checkpoint(
        self,
        checkpoint_id: str,
        escalator_id: str,
        reason: str
    ) -> GovernanceCheckpoint:
        """Escalate a checkpoint to higher authority"""
        checkpoint = self._checkpoints.get(checkpoint_id)
        if not checkpoint:
            raise ValueError(f"Checkpoint not found: {checkpoint_id}")
        
        checkpoint.escalate(escalator_id, reason)
        
        await self._emit_event("checkpoint.escalated", checkpoint)
        logger.info(f"Checkpoint escalated: {checkpoint_id} to {checkpoint.approval_level.value}")
        
        return checkpoint
    
    def get_checkpoint(self, checkpoint_id: str) -> Optional[GovernanceCheckpoint]:
        """Get a checkpoint by ID"""
        return self._checkpoints.get(checkpoint_id)
    
    def list_checkpoints(
        self,
        identity_id: Optional[str] = None,
        status: Optional[CheckpointStatus] = None,
        approval_level: Optional[EscalationLevel] = None
    ) -> List[GovernanceCheckpoint]:
        """List checkpoints with optional filters"""
        checkpoints = list(self._checkpoints.values())
        
        if identity_id:
            checkpoints = [c for c in checkpoints if c.identity_id == identity_id]
        
        if status:
            checkpoints = [c for c in checkpoints if c.status == status]
        
        if approval_level:
            checkpoints = [c for c in checkpoints if c.approval_level == approval_level]
        
        return sorted(checkpoints, key=lambda c: c.created_at, reverse=True)
    
    def get_pending_checkpoints(self, identity_id: Optional[str] = None) -> List[GovernanceCheckpoint]:
        """Get all pending checkpoints"""
        return [
            c for c in self.list_checkpoints(identity_id=identity_id)
            if c.is_pending
        ]
    
    # =========================================================================
    # AUDIT & METRICS
    # =========================================================================
    
    def get_violations(
        self,
        limit: int = 100,
        policy_id: Optional[str] = None
    ) -> List[PolicyViolation]:
        """Get recent violations"""
        violations = self._violations[-limit:]
        
        if policy_id:
            violations = [v for v in violations if v.policy_id == policy_id]
        
        return list(reversed(violations))
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get governance metrics"""
        return {
            "total_policies": len(self._policies),
            "enabled_policies": len([p for p in self._policies.values() if p.enabled]),
            "total_evaluations": self._total_evaluations,
            "total_checkpoints": self._total_checkpoints,
            "total_violations": self._total_violations,
            "total_approvals": self._total_approvals,
            "total_rejections": self._total_rejections,
            "pending_checkpoints": len(self.get_pending_checkpoints()),
            "approval_rate": (
                self._total_approvals / max(self._total_approvals + self._total_rejections, 1) * 100
            ),
        }
    
    # =========================================================================
    # EVENT HANDLING
    # =========================================================================
    
    def on(self, event: str, handler: Callable):
        """Register event handler"""
        if event in self._event_handlers:
            self._event_handlers[event].append(handler)
    
    async def _emit_event(self, event: str, data: Any):
        """Emit event to all handlers"""
        handlers = self._event_handlers.get(event, [])
        for handler in handlers:
            try:
                if asyncio.iscoroutinefunction(handler):
                    await handler(data)
                else:
                    handler(data)
            except Exception as e:
                logger.error(f"Event handler error for {event}: {e}")


# =============================================================================
# SINGLETON INSTANCE
# =============================================================================

_governance_service: Optional[GovernanceCheckpointService] = None


def get_governance_service() -> GovernanceCheckpointService:
    """Get or create Governance Checkpoint service instance"""
    global _governance_service
    if _governance_service is None:
        _governance_service = GovernanceCheckpointService()
    return _governance_service


# =============================================================================
# CONVENIENCE FUNCTIONS
# =============================================================================

async def check_governance(
    identity_id: str,
    action_type: str,
    query: str = "",
    sphere_id: Optional[str] = None,
    **kwargs
) -> GovernanceResult:
    """
    Quick governance check
    
    Usage:
        result = await check_governance(
            identity_id="user_123",
            action_type="delete",
            query="Delete all my old emails"
        )
        if not result.allowed:
            raise PermissionError(result.message)
        if result.requires_checkpoint:
            # Handle checkpoint
            pass
    """
    service = get_governance_service()
    
    context = GovernanceContext(
        identity_id=identity_id,
        action_type=action_type,
        query=query,
        sphere_id=sphere_id,
        metadata=kwargs,
    )
    
    return await service.evaluate(context)


# =============================================================================
# TEST/DEMO
# =============================================================================

async def demo():
    """Demo the Governance Checkpoint Service"""
    service = get_governance_service()
    
    # Test 1: Simple query (should pass)
    print("\n=== Test 1: Simple Query ===")
    context1 = GovernanceContext(
        identity_id="user_123",
        action_type="query",
        query="What are my meetings?",
    )
    result1 = await service.evaluate(context1)
    print(f"Allowed: {result1.allowed}")
    print(f"Requires checkpoint: {result1.requires_checkpoint}")
    print(f"Applied policies: {result1.applied_policies}")
    
    # Test 2: Delete action (should create checkpoint)
    print("\n=== Test 2: Delete Action ===")
    context2 = GovernanceContext(
        identity_id="user_123",
        action_type="delete",
        query="Delete all my old emails",
    )
    result2 = await service.evaluate(context2)
    print(f"Allowed: {result2.allowed}")
    print(f"Requires checkpoint: {result2.requires_checkpoint}")
    if result2.checkpoint:
        print(f"Checkpoint ID: {result2.checkpoint.id}")
        print(f"Reason: {result2.checkpoint.reason}")
        
        # Approve checkpoint
        await service.approve_checkpoint(result2.checkpoint.id, "admin_user", "Approved")
        print(f"Checkpoint approved!")
    
    # Test 3: Cross-identity access (should deny)
    print("\n=== Test 3: Cross-Identity Access ===")
    context3 = GovernanceContext(
        identity_id="user_123",
        action_type="query",
        query="Show me user_456's data",
        metadata={"cross_identity": True},
    )
    result3 = await service.evaluate(context3)
    print(f"Allowed: {result3.allowed}")
    print(f"Message: {result3.message}")
    
    # Metrics
    print("\n=== Metrics ===")
    print(service.get_metrics())


if __name__ == "__main__":
    asyncio.run(demo())
