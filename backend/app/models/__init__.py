"""
CHE·NU™ Database Models
=======================

All SQLAlchemy models for the CHE·NU system.

CRITICAL:
- Import order matters for relationships
- All models must be imported for Alembic autogenerate
"""

from backend.core.database import Base
from backend.models.user import User, RefreshToken
from backend.models.sphere import (
    Sphere,
    BureauSection,
    QuickCapture,
    SphereType,
    BureauSectionType,
    QuickCaptureType,
    QuickCaptureStatus,
    SPHERE_METADATA,
    BUREAU_SECTION_METADATA,
)
from backend.models.thread import (
    Thread,
    ThreadEvent,
    ThreadDecision,
    ThreadAction,
    ThreadSnapshot,
    ThreadStatus,
    ThreadType,
    ThreadVisibility,
    ThreadEventType,
    ActionStatus,
    ActionPriority,
)
from backend.models.governance import (
    GovernanceCheckpoint,
    AuditLog,
    CheckpointType,
    CheckpointStatus,
    AuditAction,
    AuditResourceType,
)

__all__ = [
    # Base
    "Base",
    
    # User models
    "User",
    "RefreshToken",
    
    # Sphere models
    "Sphere",
    "BureauSection",
    "QuickCapture",
    "SphereType",
    "BureauSectionType",
    "QuickCaptureType",
    "QuickCaptureStatus",
    "SPHERE_METADATA",
    "BUREAU_SECTION_METADATA",
    
    # Thread models
    "Thread",
    "ThreadEvent",
    "ThreadDecision",
    "ThreadAction",
    "ThreadSnapshot",
    "ThreadStatus",
    "ThreadType",
    "ThreadVisibility",
    "ThreadEventType",
    "ActionStatus",
    "ActionPriority",
    
    # Governance models
    "GovernanceCheckpoint",
    "AuditLog",
    "CheckpointType",
    "CheckpointStatus",
    "AuditAction",
    "AuditResourceType",
]
