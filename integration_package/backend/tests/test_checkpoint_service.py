"""
CHE·NU™ Checkpoint Service Tests
================================

Tests for governance checkpoints (HTTP 423 human gates).

R&D COMPLIANCE:
✅ Rule #1: Human Sovereignty - verify checkpoints block actions
✅ Rule #6: Traceability - verify audit logs created
"""

import pytest
from datetime import datetime, timedelta
from uuid import uuid4, UUID
from unittest.mock import AsyncMock, MagicMock, patch

from backend.services.governance.checkpoint_service import (
    CheckpointService,
    AuditService,
)
from backend.models.governance import (
    GovernanceCheckpoint,
    AuditLog,
    CheckpointType,
    CheckpointStatus,
    AuditAction,
    AuditResourceType,
)
from backend.core.exceptions import (
    NotFoundError,
    CheckpointRequiredError,
)


# =============================================================================
# FIXTURES
# =============================================================================

@pytest.fixture
def mock_db():
    """Create mock database session."""
    db = AsyncMock()
    db.add = MagicMock()
    db.flush = AsyncMock()
    db.commit = AsyncMock()
    db.execute = AsyncMock()
    return db


@pytest.fixture
def checkpoint_service(mock_db):
    """Create checkpoint service with mock db."""
    return CheckpointService(mock_db)


@pytest.fixture
def audit_service(mock_db):
    """Create audit service with mock db."""
    return AuditService(mock_db)


@pytest.fixture
def sample_identity_id():
    """Sample identity ID for tests."""
    return uuid4()


@pytest.fixture
def sample_thread_id():
    """Sample thread ID for tests."""
    return uuid4()


@pytest.fixture
def sample_checkpoint(sample_identity_id, sample_thread_id):
    """Create sample checkpoint."""
    return GovernanceCheckpoint(
        id=uuid4(),
        identity_id=sample_identity_id,
        thread_id=sample_thread_id,
        checkpoint_type=CheckpointType.SENSITIVE,
        reason="Test action requires approval",
        action_data={"action": "test_action", "data": {"key": "value"}},
        options=["approve", "reject"],
        status=CheckpointStatus.PENDING,
        expires_at=datetime.utcnow() + timedelta(hours=1),
        metadata={},
    )


# =============================================================================
# CHECKPOINT CREATION TESTS
# =============================================================================

class TestCheckpointCreation:
    """Tests for checkpoint creation."""
    
    @pytest.mark.asyncio
    async def test_create_checkpoint_basic(
        self,
        checkpoint_service,
        mock_db,
        sample_identity_id,
    ):
        """Test basic checkpoint creation."""
        result = await checkpoint_service.create_checkpoint(
            identity_id=sample_identity_id,
            checkpoint_type=CheckpointType.SENSITIVE,
            reason="Test reason",
            action_data={"test": "data"},
        )
        
        # Verify checkpoint was added to session
        mock_db.add.assert_called()
        mock_db.flush.assert_called()
        
        # Verify checkpoint properties
        assert result.identity_id == sample_identity_id
        assert result.checkpoint_type == CheckpointType.SENSITIVE
        assert result.reason == "Test reason"
        assert result.status == CheckpointStatus.PENDING
    
    @pytest.mark.asyncio
    async def test_create_checkpoint_with_thread(
        self,
        checkpoint_service,
        mock_db,
        sample_identity_id,
        sample_thread_id,
    ):
        """Test checkpoint creation with thread context."""
        result = await checkpoint_service.create_checkpoint(
            identity_id=sample_identity_id,
            checkpoint_type=CheckpointType.GOVERNANCE,
            reason="Thread action requires approval",
            action_data={"thread_id": str(sample_thread_id)},
            thread_id=sample_thread_id,
        )
        
        assert result.thread_id == sample_thread_id
    
    @pytest.mark.asyncio
    async def test_create_checkpoint_with_expiration(
        self,
        checkpoint_service,
        mock_db,
        sample_identity_id,
    ):
        """Test checkpoint with custom expiration."""
        result = await checkpoint_service.create_checkpoint(
            identity_id=sample_identity_id,
            checkpoint_type=CheckpointType.COST,
            reason="Budget approval needed",
            action_data={"amount": 1000},
            expires_in_minutes=30,
        )
        
        assert result.expires_at is not None
        assert result.expires_at > datetime.utcnow()
    
    @pytest.mark.asyncio
    async def test_create_checkpoint_with_custom_options(
        self,
        checkpoint_service,
        mock_db,
        sample_identity_id,
    ):
        """Test checkpoint with custom resolution options."""
        custom_options = ["approve", "reject", "defer", "escalate"]
        
        result = await checkpoint_service.create_checkpoint(
            identity_id=sample_identity_id,
            checkpoint_type=CheckpointType.GOVERNANCE,
            reason="Multiple options available",
            action_data={},
            options=custom_options,
        )
        
        assert result.options == custom_options


# =============================================================================
# CHECKPOINT RESOLUTION TESTS
# =============================================================================

class TestCheckpointResolution:
    """Tests for checkpoint approval/rejection."""
    
    @pytest.mark.asyncio
    async def test_approve_checkpoint(
        self,
        checkpoint_service,
        mock_db,
        sample_checkpoint,
        sample_identity_id,
    ):
        """Test checkpoint approval."""
        # Setup mock to return sample checkpoint
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_checkpoint
        mock_db.execute.return_value = mock_result
        
        result = await checkpoint_service.approve_checkpoint(
            checkpoint_id=sample_checkpoint.id,
            identity_id=sample_identity_id,
            reason="Looks good!",
        )
        
        assert result.status == CheckpointStatus.APPROVED
        assert result.resolution == "approve"
        assert result.resolution_reason == "Looks good!"
        assert result.resolved_by == sample_identity_id
        assert result.resolved_at is not None
    
    @pytest.mark.asyncio
    async def test_reject_checkpoint(
        self,
        checkpoint_service,
        mock_db,
        sample_checkpoint,
        sample_identity_id,
    ):
        """Test checkpoint rejection."""
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_checkpoint
        mock_db.execute.return_value = mock_result
        
        result = await checkpoint_service.reject_checkpoint(
            checkpoint_id=sample_checkpoint.id,
            identity_id=sample_identity_id,
            reason="Not appropriate",
        )
        
        assert result.status == CheckpointStatus.REJECTED
        assert result.resolution == "reject"
        assert result.resolution_reason == "Not appropriate"
    
    @pytest.mark.asyncio
    async def test_cannot_resolve_already_resolved(
        self,
        checkpoint_service,
        mock_db,
        sample_checkpoint,
        sample_identity_id,
    ):
        """Test that already-resolved checkpoints cannot be changed."""
        # Mark as already approved
        sample_checkpoint.status = CheckpointStatus.APPROVED
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_checkpoint
        mock_db.execute.return_value = mock_result
        
        with pytest.raises(Exception) as exc_info:
            await checkpoint_service.approve_checkpoint(
                checkpoint_id=sample_checkpoint.id,
                identity_id=sample_identity_id,
            )
        
        assert "already resolved" in str(exc_info.value).lower()


# =============================================================================
# IDENTITY BOUNDARY TESTS
# =============================================================================

class TestIdentityBoundary:
    """Tests for identity boundary enforcement."""
    
    @pytest.mark.asyncio
    async def test_cannot_access_other_identity_checkpoint(
        self,
        checkpoint_service,
        mock_db,
        sample_checkpoint,
    ):
        """Test that cross-identity access is forbidden."""
        different_identity = uuid4()
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_checkpoint
        mock_db.execute.return_value = mock_result
        
        with pytest.raises(Exception) as exc_info:
            await checkpoint_service.get_checkpoint(
                checkpoint_id=sample_checkpoint.id,
                identity_id=different_identity,  # Different identity!
            )
        
        assert "identity boundary" in str(exc_info.value).lower()
    
    @pytest.mark.asyncio
    async def test_cannot_approve_other_identity_checkpoint(
        self,
        checkpoint_service,
        mock_db,
        sample_checkpoint,
    ):
        """Test that cross-identity approval is forbidden."""
        different_identity = uuid4()
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_checkpoint
        mock_db.execute.return_value = mock_result
        
        with pytest.raises(Exception) as exc_info:
            await checkpoint_service.approve_checkpoint(
                checkpoint_id=sample_checkpoint.id,
                identity_id=different_identity,
            )
        
        assert "identity boundary" in str(exc_info.value).lower()


# =============================================================================
# CHECKPOINT EXPIRATION TESTS
# =============================================================================

class TestCheckpointExpiration:
    """Tests for checkpoint expiration."""
    
    def test_checkpoint_is_expired(self, sample_checkpoint):
        """Test expiration check when expired."""
        sample_checkpoint.expires_at = datetime.utcnow() - timedelta(hours=1)
        assert sample_checkpoint.is_expired is True
    
    def test_checkpoint_not_expired(self, sample_checkpoint):
        """Test expiration check when not expired."""
        sample_checkpoint.expires_at = datetime.utcnow() + timedelta(hours=1)
        assert sample_checkpoint.is_expired is False
    
    def test_checkpoint_no_expiration(self, sample_checkpoint):
        """Test checkpoint without expiration."""
        sample_checkpoint.expires_at = None
        assert sample_checkpoint.is_expired is False
    
    @pytest.mark.asyncio
    async def test_cannot_approve_expired_checkpoint(
        self,
        checkpoint_service,
        mock_db,
        sample_checkpoint,
        sample_identity_id,
    ):
        """Test that expired checkpoints cannot be approved."""
        sample_checkpoint.expires_at = datetime.utcnow() - timedelta(hours=1)
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_checkpoint
        mock_db.execute.return_value = mock_result
        
        with pytest.raises(Exception) as exc_info:
            await checkpoint_service.approve_checkpoint(
                checkpoint_id=sample_checkpoint.id,
                identity_id=sample_identity_id,
            )
        
        assert "expired" in str(exc_info.value).lower()


# =============================================================================
# AUDIT SERVICE TESTS
# =============================================================================

class TestAuditService:
    """Tests for audit logging."""
    
    @pytest.mark.asyncio
    async def test_create_audit_log(
        self,
        audit_service,
        mock_db,
        sample_identity_id,
    ):
        """Test audit log creation."""
        result = await audit_service.log(
            identity_id=sample_identity_id,
            action=AuditAction.CHECKPOINT_APPROVED,
            resource_type=AuditResourceType.CHECKPOINT,
            resource_id=uuid4(),
            details={"reason": "test"},
        )
        
        mock_db.add.assert_called()
        mock_db.flush.assert_called()
        
        assert result.identity_id == sample_identity_id
        assert result.action == AuditAction.CHECKPOINT_APPROVED
    
    @pytest.mark.asyncio
    async def test_audit_log_with_request_context(
        self,
        audit_service,
        mock_db,
        sample_identity_id,
    ):
        """Test audit log with IP and user agent."""
        result = await audit_service.log(
            identity_id=sample_identity_id,
            action=AuditAction.LOGIN,
            resource_type=AuditResourceType.SESSION,
            ip_address="192.168.1.1",
            user_agent="Mozilla/5.0 Test",
        )
        
        assert result.ip_address == "192.168.1.1"
        assert result.user_agent == "Mozilla/5.0 Test"
    
    @pytest.mark.asyncio
    async def test_system_audit_without_identity(
        self,
        audit_service,
        mock_db,
    ):
        """Test system audit log without identity."""
        result = await audit_service.log(
            identity_id=None,
            action=AuditAction.SYSTEM_ERROR,
            resource_type=AuditResourceType.SYSTEM,
            details={"error": "test error"},
        )
        
        assert result.identity_id is None
        assert result.action == AuditAction.SYSTEM_ERROR


# =============================================================================
# CHECKPOINT REQUIRED ERROR TESTS
# =============================================================================

class TestCheckpointRequiredError:
    """Tests for CheckpointRequiredError."""
    
    def test_raise_checkpoint_required(
        self,
        checkpoint_service,
        sample_checkpoint,
    ):
        """Test raising CheckpointRequiredError."""
        with pytest.raises(CheckpointRequiredError) as exc_info:
            checkpoint_service.raise_checkpoint_required(sample_checkpoint)
        
        error = exc_info.value
        assert error.checkpoint_id == sample_checkpoint.id
        assert error.checkpoint_type == sample_checkpoint.checkpoint_type
        assert error.status_code == 423
    
    def test_checkpoint_error_to_dict(self):
        """Test CheckpointRequiredError serialization."""
        error = CheckpointRequiredError(
            checkpoint_id="test-id",
            checkpoint_type="sensitive",
            reason="Test reason",
            options=["approve", "reject"],
        )
        
        result = error.to_dict()
        
        assert result["error"] == "CHECKPOINT_REQUIRED"
        assert result["details"]["checkpoint_id"] == "test-id"
        assert result["details"]["requires_approval"] is True


# =============================================================================
# LISTING TESTS
# =============================================================================

class TestCheckpointListing:
    """Tests for checkpoint listing."""
    
    @pytest.mark.asyncio
    async def test_list_pending_checkpoints(
        self,
        checkpoint_service,
        mock_db,
        sample_identity_id,
        sample_checkpoint,
    ):
        """Test listing pending checkpoints."""
        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = [sample_checkpoint]
        mock_db.execute.return_value = mock_result
        
        checkpoints = await checkpoint_service.list_pending_checkpoints(
            identity_id=sample_identity_id,
        )
        
        assert len(checkpoints) == 1
        assert checkpoints[0].status == CheckpointStatus.PENDING


# =============================================================================
# RUN TESTS
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
