"""
CHE·NU Thread Service Tests — CRITICAL

Tests for the CORE ENGINE of CHE·NU:
- APPEND-ONLY event sourcing
- Immutable founding_intent
- Causal ordering
- Identity boundary enforcement
- Checkpoint triggers (HTTP 423)
- Snapshot generation

R&D Compliance: ALL 7 RULES
"""

import pytest
from datetime import datetime, timedelta
from uuid import uuid4
from unittest.mock import AsyncMock, MagicMock, patch

from services.thread.thread_service import ThreadService
from core.exceptions import (
    AuthorizationError,
    ValidationError,
    NotFoundError,
    CheckpointRequiredError
)


# ============================================================================
# THREAD SERVICE INITIALIZATION
# ============================================================================

class TestThreadServiceInit:
    """Test ThreadService initialization."""
    
    def test_service_initialization(self, mock_db_session):
        """Test service initializes correctly."""
        service = ThreadService(mock_db_session)
        assert service is not None
        assert service.db == mock_db_session


# ============================================================================
# THREAD CREATION
# ============================================================================

class TestThreadCreation:
    """Test thread creation with proper constraints."""
    
    @pytest.fixture
    def thread_service(self, mock_db_session):
        return ThreadService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_create_thread_success(
        self, 
        thread_service, 
        mock_db_session,
        user_id,
        sphere_id
    ):
        """Test successful thread creation."""
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = None
        
        result = await thread_service.create_thread(
            identity_id=user_id,
            sphere_id=sphere_id,
            founding_intent="Start a new project to build an app",
            title="App Development Project"
        )
        
        mock_db_session.add.assert_called()
        mock_db_session.commit.assert_called()
    
    @pytest.mark.asyncio
    async def test_create_thread_requires_founding_intent(
        self, 
        thread_service, 
        mock_db_session,
        user_id,
        sphere_id
    ):
        """Test that founding_intent is required."""
        with pytest.raises(ValidationError):
            await thread_service.create_thread(
                identity_id=user_id,
                sphere_id=sphere_id,
                founding_intent="",  # Empty intent
                title="Test"
            )
    
    @pytest.mark.asyncio
    async def test_create_thread_has_traceability(
        self, 
        thread_service, 
        mock_db_session,
        user_id,
        sphere_id
    ):
        """Test thread creation includes traceability fields."""
        added_thread = None
        def capture_add(item):
            nonlocal added_thread
            added_thread = item
        mock_db_session.add.side_effect = capture_add
        
        await thread_service.create_thread(
            identity_id=user_id,
            sphere_id=sphere_id,
            founding_intent="Test intent",
            title="Test"
        )
        
        # Verify traceability
        assert added_thread is not None
        assert hasattr(added_thread, 'id')
        assert hasattr(added_thread, 'created_at')
        assert hasattr(added_thread, 'created_by')
    
    @pytest.mark.asyncio
    async def test_create_thread_emits_created_event(
        self, 
        thread_service, 
        mock_db_session,
        user_id,
        sphere_id
    ):
        """Test thread creation emits thread.created event."""
        events_added = []
        def capture_add(item):
            events_added.append(item)
        mock_db_session.add.side_effect = capture_add
        
        await thread_service.create_thread(
            identity_id=user_id,
            sphere_id=sphere_id,
            founding_intent="Test intent",
            title="Test"
        )
        
        # Should have thread + event
        assert len(events_added) >= 2
        
        # Find the event
        event = next((e for e in events_added if hasattr(e, 'event_type')), None)
        assert event is not None
        assert event.event_type == "thread.created"


# ============================================================================
# APPEND-ONLY EVENT SOURCING — CRITICAL
# ============================================================================

@pytest.mark.append_only
class TestAppendOnlyEventSourcing:
    """Test APPEND-ONLY event sourcing. Events are IMMUTABLE."""
    
    @pytest.fixture
    def thread_service(self, mock_db_session):
        return ThreadService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_events_are_append_only(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread,
        user_id
    ):
        """Test events can only be appended, never modified."""
        mock_thread.identity_id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        # Add an event
        await thread_service.append_event(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            event_type="note.added",
            payload={"content": "Test note"}
        )
        
        # Verify add was called (append)
        mock_db_session.add.assert_called()
        # Verify NO update/delete on events
        # (Events have no updated_at field by design)
    
    @pytest.mark.asyncio
    async def test_cannot_modify_event(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread_event
    ):
        """Test that modifying an event is not allowed."""
        with pytest.raises((AttributeError, ValidationError)):
            await thread_service.update_event(
                event_id=str(mock_thread_event.id),
                updates={"payload": {"content": "Modified!"}}
            )
    
    @pytest.mark.asyncio
    async def test_cannot_delete_event(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread_event
    ):
        """Test that deleting an event is not allowed."""
        with pytest.raises((AttributeError, ValidationError, CheckpointRequiredError)):
            await thread_service.delete_event(
                event_id=str(mock_thread_event.id)
            )
    
    @pytest.mark.asyncio
    async def test_event_sequence_numbers_are_sequential(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test event sequence numbers are strictly sequential."""
        mock_thread.identity_id = uuid4()
        mock_thread.event_count = 5
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        events_added = []
        def capture_add(item):
            events_added.append(item)
        mock_db_session.add.side_effect = capture_add
        
        # Add event
        await thread_service.append_event(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            event_type="note.added",
            payload={"content": "Test"}
        )
        
        # Verify sequence number
        event = next((e for e in events_added if hasattr(e, 'sequence_number')), None)
        assert event is not None
        assert event.sequence_number == mock_thread.event_count + 1


# ============================================================================
# FOUNDING INTENT IMMUTABILITY — CRITICAL
# ============================================================================

@pytest.mark.immutable
class TestFoundingIntentImmutability:
    """Test that founding_intent is FOREVER IMMUTABLE."""
    
    @pytest.fixture
    def thread_service(self, mock_db_session):
        return ThreadService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_founding_intent_cannot_be_changed(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test founding_intent cannot be modified after creation."""
        original_intent = "Original founding intent"
        mock_thread.founding_intent = original_intent
        mock_thread.identity_id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        with pytest.raises(ValidationError) as exc_info:
            await thread_service.update_thread(
                thread_id=str(mock_thread.id),
                identity_id=str(mock_thread.identity_id),
                updates={"founding_intent": "Changed intent!"}
            )
        
        assert "immutable" in str(exc_info.value).lower() or \
               "founding_intent" in str(exc_info.value).lower()
    
    @pytest.mark.asyncio
    async def test_current_intent_can_be_refined(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test current_intent can be refined while founding_intent stays fixed."""
        mock_thread.founding_intent = "Original founding intent"
        mock_thread.current_intent = "Current intent"
        mock_thread.identity_id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        await thread_service.update_thread(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            updates={"current_intent": "Refined current intent"}
        )
        
        # current_intent changed
        assert mock_thread.current_intent == "Refined current intent"
        # founding_intent unchanged
        assert mock_thread.founding_intent == "Original founding intent"
    
    @pytest.mark.asyncio
    async def test_refine_intent_emits_event(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test refining intent emits intent.refined event."""
        mock_thread.identity_id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        events_added = []
        def capture_add(item):
            events_added.append(item)
        mock_db_session.add.side_effect = capture_add
        
        await thread_service.refine_intent(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            new_intent="Refined intent"
        )
        
        # Find the event
        event = next((e for e in events_added if hasattr(e, 'event_type') and 
                     e.event_type == "intent.refined"), None)
        assert event is not None


# ============================================================================
# CAUSAL ORDERING
# ============================================================================

class TestCausalOrdering:
    """Test causal ordering of events."""
    
    @pytest.fixture
    def thread_service(self, mock_db_session):
        return ThreadService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_events_have_parent_reference(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test events reference their parent event."""
        mock_thread.identity_id = uuid4()
        mock_thread.event_count = 3
        
        # Mock previous event
        previous_event = MagicMock()
        previous_event.id = uuid4()
        previous_event.sequence_number = 3
        
        mock_db_session.execute.return_value.scalar_one_or_none.side_effect = [
            mock_thread,  # First call: get thread
            previous_event  # Second call: get last event
        ]
        
        events_added = []
        def capture_add(item):
            events_added.append(item)
        mock_db_session.add.side_effect = capture_add
        
        await thread_service.append_event(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            event_type="note.added",
            payload={"content": "Test"}
        )
        
        # Find the event and check parent_event_id
        event = next((e for e in events_added if hasattr(e, 'parent_event_id')), None)
        assert event is not None
        # Parent should be the previous event
        assert event.parent_event_id == previous_event.id
    
    @pytest.mark.asyncio
    async def test_first_event_has_no_parent(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test first event has no parent."""
        mock_thread.identity_id = uuid4()
        mock_thread.event_count = 0
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        events_added = []
        def capture_add(item):
            events_added.append(item)
        mock_db_session.add.side_effect = capture_add
        
        await thread_service.append_event(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            event_type="thread.created",
            payload={}
        )
        
        event = next((e for e in events_added if hasattr(e, 'parent_event_id')), None)
        assert event is not None
        assert event.parent_event_id is None  # First event


# ============================================================================
# IDENTITY BOUNDARY — CRITICAL
# ============================================================================

@pytest.mark.identity_boundary
class TestIdentityBoundary:
    """Test identity boundary enforcement."""
    
    @pytest.fixture
    def thread_service(self, mock_db_session):
        return ThreadService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_cannot_access_other_user_thread(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread,
        other_user_id
    ):
        """Test cannot access another user's thread."""
        mock_thread.identity_id = uuid4()  # Different from other_user_id
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        with pytest.raises((AuthorizationError, NotFoundError)):
            await thread_service.get_thread(
                thread_id=str(mock_thread.id),
                identity_id=other_user_id
            )
    
    @pytest.mark.asyncio
    async def test_cannot_append_event_to_other_user_thread(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread,
        other_user_id
    ):
        """Test cannot append event to another user's thread."""
        mock_thread.identity_id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        with pytest.raises((AuthorizationError, NotFoundError)):
            await thread_service.append_event(
                thread_id=str(mock_thread.id),
                identity_id=other_user_id,  # Different identity!
                event_type="note.added",
                payload={"content": "Hacked!"}
            )
    
    @pytest.mark.asyncio
    async def test_user_can_access_own_thread(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test user can access their own thread."""
        identity_id = uuid4()
        mock_thread.identity_id = identity_id
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        result = await thread_service.get_thread(
            thread_id=str(mock_thread.id),
            identity_id=str(identity_id)
        )
        
        assert result is not None
    
    @pytest.mark.asyncio
    async def test_list_threads_only_returns_own(
        self, 
        thread_service, 
        mock_db_session,
        user_id,
        sphere_id
    ):
        """Test list_threads only returns user's own threads."""
        user_uuid = uuid4()
        
        user_threads = [MagicMock(identity_id=user_uuid) for _ in range(5)]
        mock_db_session.execute.return_value.scalars.return_value.all.return_value = user_threads
        
        result = await thread_service.list_threads(
            identity_id=str(user_uuid),
            sphere_id=sphere_id
        )
        
        for thread in result:
            assert thread.identity_id == user_uuid


# ============================================================================
# CHECKPOINT TRIGGERS (HTTP 423)
# ============================================================================

@pytest.mark.checkpoint
class TestCheckpointTriggers:
    """Test checkpoint triggers for sensitive actions."""
    
    @pytest.fixture
    def thread_service(self, mock_db_session):
        return ThreadService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_archive_thread_triggers_checkpoint(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test archiving a thread triggers a checkpoint."""
        mock_thread.identity_id = uuid4()
        mock_thread.status = "active"
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        with pytest.raises(CheckpointRequiredError) as exc_info:
            await thread_service.archive_thread(
                thread_id=str(mock_thread.id),
                identity_id=str(mock_thread.identity_id)
            )
        
        # Verify checkpoint info
        checkpoint_info = exc_info.value.checkpoint_info
        assert checkpoint_info["type"] == "governance"
        assert checkpoint_info["status"] == "pending"
    
    @pytest.mark.asyncio
    async def test_delete_action_triggers_checkpoint(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test deleting an action triggers a checkpoint."""
        mock_thread.identity_id = uuid4()
        mock_action = MagicMock()
        mock_action.id = uuid4()
        mock_action.thread_id = mock_thread.id
        
        mock_db_session.execute.return_value.scalar_one_or_none.side_effect = [
            mock_action,
            mock_thread
        ]
        
        with pytest.raises(CheckpointRequiredError):
            await thread_service.delete_action(
                action_id=str(mock_action.id),
                identity_id=str(mock_thread.identity_id)
            )
    
    @pytest.mark.asyncio
    async def test_checkpoint_includes_action_data(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test checkpoint includes the pending action data."""
        mock_thread.identity_id = uuid4()
        mock_thread.status = "active"
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        with pytest.raises(CheckpointRequiredError) as exc_info:
            await thread_service.archive_thread(
                thread_id=str(mock_thread.id),
                identity_id=str(mock_thread.identity_id)
            )
        
        checkpoint_info = exc_info.value.checkpoint_info
        assert "action_data" in checkpoint_info
        assert checkpoint_info["action_data"]["action"] == "archive"


# ============================================================================
# DECISIONS
# ============================================================================

class TestDecisions:
    """Test decision recording in threads."""
    
    @pytest.fixture
    def thread_service(self, mock_db_session):
        return ThreadService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_record_decision(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test recording a decision."""
        mock_thread.identity_id = uuid4()
        mock_thread.decision_count = 0
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        await thread_service.record_decision(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            title="Choose tech stack",
            description="Selected React + FastAPI",
            rationale="Best for our use case",
            options_considered=["Vue", "React", "Angular"],
            chosen_option="React"
        )
        
        mock_db_session.add.assert_called()
        mock_db_session.commit.assert_called()
    
    @pytest.mark.asyncio
    async def test_decision_emits_event(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test decision recording emits event."""
        mock_thread.identity_id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        events_added = []
        def capture_add(item):
            events_added.append(item)
        mock_db_session.add.side_effect = capture_add
        
        await thread_service.record_decision(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            title="Test decision",
            description="Description",
            rationale="Rationale"
        )
        
        event = next((e for e in events_added if hasattr(e, 'event_type') and 
                     e.event_type == "decision.recorded"), None)
        assert event is not None
    
    @pytest.mark.asyncio
    async def test_supersede_decision(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test superseding an existing decision."""
        mock_thread.identity_id = uuid4()
        
        original_decision = MagicMock()
        original_decision.id = uuid4()
        original_decision.is_active = True
        
        mock_db_session.execute.return_value.scalar_one_or_none.side_effect = [
            mock_thread,
            original_decision
        ]
        
        await thread_service.record_decision(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            title="New decision",
            description="Supersedes previous",
            rationale="New information",
            supersedes_id=str(original_decision.id)
        )
        
        # Original should be deactivated
        assert original_decision.is_active == False


# ============================================================================
# ACTIONS
# ============================================================================

class TestActions:
    """Test action management in threads."""
    
    @pytest.fixture
    def thread_service(self, mock_db_session):
        return ThreadService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_create_action(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test creating an action."""
        mock_thread.identity_id = uuid4()
        mock_thread.action_count = 0
        mock_thread.pending_action_count = 0
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        await thread_service.create_action(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            title="Review PR #123",
            description="Need to review the pull request",
            priority="high"
        )
        
        mock_db_session.add.assert_called()
        assert mock_thread.action_count == 1
        assert mock_thread.pending_action_count == 1
    
    @pytest.mark.asyncio
    async def test_complete_action(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test completing an action."""
        mock_thread.identity_id = uuid4()
        mock_thread.pending_action_count = 3
        
        mock_action = MagicMock()
        mock_action.id = uuid4()
        mock_action.status = "pending"
        mock_action.thread = mock_thread
        
        mock_db_session.execute.return_value.scalar_one_or_none.side_effect = [
            mock_action,
            mock_thread
        ]
        
        await thread_service.complete_action(
            action_id=str(mock_action.id),
            identity_id=str(mock_thread.identity_id)
        )
        
        assert mock_action.status == "completed"
        assert mock_action.completed_at is not None
        assert mock_thread.pending_action_count == 2
    
    @pytest.mark.asyncio
    async def test_complete_action_emits_event(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test completing action emits event."""
        mock_thread.identity_id = uuid4()
        
        mock_action = MagicMock()
        mock_action.id = uuid4()
        mock_action.status = "pending"
        mock_action.thread = mock_thread
        
        mock_db_session.execute.return_value.scalar_one_or_none.side_effect = [
            mock_action,
            mock_thread
        ]
        
        events_added = []
        def capture_add(item):
            events_added.append(item)
        mock_db_session.add.side_effect = capture_add
        
        await thread_service.complete_action(
            action_id=str(mock_action.id),
            identity_id=str(mock_thread.identity_id)
        )
        
        event = next((e for e in events_added if hasattr(e, 'event_type') and 
                     e.event_type == "action.completed"), None)
        assert event is not None


# ============================================================================
# SNAPSHOTS
# ============================================================================

class TestSnapshots:
    """Test thread snapshot generation."""
    
    @pytest.fixture
    def thread_service(self, mock_db_session):
        return ThreadService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_create_snapshot(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test creating a thread snapshot."""
        mock_thread.identity_id = uuid4()
        mock_thread.event_count = 10
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        mock_db_session.execute.return_value.scalars.return_value.all.return_value = []
        
        await thread_service.create_snapshot(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            snapshot_type="summary"
        )
        
        mock_db_session.add.assert_called()
        mock_db_session.commit.assert_called()
    
    @pytest.mark.asyncio
    async def test_snapshot_captures_state(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test snapshot captures thread state."""
        mock_thread.identity_id = uuid4()
        mock_thread.founding_intent = "Test intent"
        mock_thread.current_intent = "Current"
        mock_thread.status = "active"
        
        mock_decisions = [MagicMock(title="Decision 1")]
        mock_actions = [MagicMock(title="Action 1", status="pending")]
        
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        snapshots_added = []
        def capture_add(item):
            snapshots_added.append(item)
        mock_db_session.add.side_effect = capture_add
        
        await thread_service.create_snapshot(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            snapshot_type="full"
        )
        
        snapshot = next((s for s in snapshots_added if hasattr(s, 'state')), None)
        assert snapshot is not None
        # Snapshot should capture state
        assert hasattr(snapshot, 'state')
    
    @pytest.mark.asyncio
    async def test_snapshot_emits_event(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test snapshot creation emits event."""
        mock_thread.identity_id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        events_added = []
        def capture_add(item):
            events_added.append(item)
        mock_db_session.add.side_effect = capture_add
        
        await thread_service.create_snapshot(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            snapshot_type="summary"
        )
        
        event = next((e for e in events_added if hasattr(e, 'event_type') and 
                     e.event_type == "summary.snapshot"), None)
        assert event is not None


# ============================================================================
# THREAD STATUS TRANSITIONS
# ============================================================================

class TestThreadStatusTransitions:
    """Test thread status transitions."""
    
    @pytest.fixture
    def thread_service(self, mock_db_session):
        return ThreadService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_pause_thread(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test pausing an active thread."""
        mock_thread.identity_id = uuid4()
        mock_thread.status = "active"
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        await thread_service.update_thread_status(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            new_status="paused"
        )
        
        assert mock_thread.status == "paused"
    
    @pytest.mark.asyncio
    async def test_resume_thread(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test resuming a paused thread."""
        mock_thread.identity_id = uuid4()
        mock_thread.status = "paused"
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        await thread_service.update_thread_status(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            new_status="active"
        )
        
        assert mock_thread.status == "active"
    
    @pytest.mark.asyncio
    async def test_complete_thread(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test completing a thread."""
        mock_thread.identity_id = uuid4()
        mock_thread.status = "active"
        mock_thread.pending_action_count = 0  # All actions complete
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        await thread_service.update_thread_status(
            thread_id=str(mock_thread.id),
            identity_id=str(mock_thread.identity_id),
            new_status="completed"
        )
        
        assert mock_thread.status == "completed"
    
    @pytest.mark.asyncio
    async def test_cannot_complete_with_pending_actions(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test cannot complete thread with pending actions."""
        mock_thread.identity_id = uuid4()
        mock_thread.status = "active"
        mock_thread.pending_action_count = 3  # Has pending actions
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        with pytest.raises(ValidationError):
            await thread_service.update_thread_status(
                thread_id=str(mock_thread.id),
                identity_id=str(mock_thread.identity_id),
                new_status="completed"
            )


# ============================================================================
# THREAD HIERARCHY
# ============================================================================

class TestThreadHierarchy:
    """Test thread parent-child relationships."""
    
    @pytest.fixture
    def thread_service(self, mock_db_session):
        return ThreadService(mock_db_session)
    
    @pytest.mark.asyncio
    async def test_create_child_thread(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread,
        user_id,
        sphere_id
    ):
        """Test creating a child thread."""
        parent_id = uuid4()
        mock_thread.id = parent_id
        mock_thread.identity_id = uuid4()
        mock_db_session.execute.return_value.scalar_one_or_none.return_value = mock_thread
        
        threads_added = []
        def capture_add(item):
            threads_added.append(item)
        mock_db_session.add.side_effect = capture_add
        
        await thread_service.create_thread(
            identity_id=str(mock_thread.identity_id),
            sphere_id=sphere_id,
            founding_intent="Child thread intent",
            title="Child Thread",
            parent_thread_id=str(parent_id)
        )
        
        child = next((t for t in threads_added if hasattr(t, 'parent_thread_id')), None)
        assert child is not None
        assert child.parent_thread_id == parent_id
    
    @pytest.mark.asyncio
    async def test_get_child_threads(
        self, 
        thread_service, 
        mock_db_session,
        mock_thread
    ):
        """Test getting child threads."""
        parent_id = uuid4()
        mock_thread.id = parent_id
        mock_thread.identity_id = uuid4()
        
        children = [MagicMock(parent_thread_id=parent_id) for _ in range(3)]
        mock_db_session.execute.return_value.scalars.return_value.all.return_value = children
        
        result = await thread_service.get_child_threads(
            thread_id=str(parent_id),
            identity_id=str(mock_thread.identity_id)
        )
        
        assert len(result) == 3


# ============================================================================
# TRACEABILITY TESTS
# ============================================================================

@pytest.mark.traceability
class TestTraceability:
    """Test traceability requirements."""
    
    def test_thread_has_all_traceability_fields(self, mock_thread):
        """Test thread has all required traceability fields."""
        assert mock_thread.id is not None
        assert mock_thread.created_at is not None
        assert mock_thread.created_by is not None
        assert mock_thread.identity_id is not None
    
    def test_event_has_all_traceability_fields(self, mock_thread_event):
        """Test event has all required traceability fields."""
        assert mock_thread_event.id is not None
        assert mock_thread_event.created_at is not None
        assert mock_thread_event.created_by is not None
        assert mock_thread_event.thread_id is not None
        assert mock_thread_event.sequence_number is not None
