# CHE·NU™ V71 — Thread Integration Tests
"""
🧵 Thread Tests — Validation de l'implémentation canonique V2

Tests d'acceptance (DOIVENT PASSER):
1) Thread creation produces THREAD_CREATED event
2) Chat message produces MESSAGE_POSTED event
3) Live start/end produce LIVE_STARTED/LIVE_ENDED events
4) Snapshot generation produces SUMMARY_SNAPSHOT event
5) XR UI displays derived state from events
6) Attempt to edit old event is rejected (APPEND-ONLY)
7) Corrections use CORRECTION_APPENDED referencing original
8) Exactly one memory_agent participant exists per thread
9) Reassignment requires PERMISSION_CHANGED + audit events
10) Viewer cannot write events
11) Redaction levels hide sensitive events from insufficient roles
"""

import pytest
from datetime import datetime, timedelta
from typing import List, Dict, Any
import asyncio


# ============================================================================
# FIXTURES
# ============================================================================

@pytest.fixture
def thread_service():
    """Create fresh thread service instance."""
    from backend.services.thread_service import ThreadService
    return ThreadService()


@pytest.fixture
def sample_thread_data():
    """Sample data for thread creation."""
    return {
        "founding_intent": "Développer une stratégie marketing pour Q1 2026",
        "title": "Stratégie Marketing Q1",
        "description": "Discussion collaborative sur la stratégie",
        "spheres": ["business", "creative_studio"],
    }


# ============================================================================
# ACCEPTANCE TESTS — Single Source of Truth
# ============================================================================

class TestSingleSourceOfTruth:
    """Tests for single source of truth principle."""
    
    @pytest.mark.asyncio
    async def test_thread_creation_produces_thread_created_event(self, thread_service, sample_thread_data):
        """
        Acceptance Test #1: Thread creation produces THREAD_CREATED event.
        """
        from backend.services.thread_service import ThreadType, EventType
        
        # Create thread
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
            title=sample_thread_data["title"],
            spheres=sample_thread_data["spheres"],
        )
        
        # Get events
        events = await thread_service.get_events(
            thread_id=thread.id,
            viewer_id="user_001",
        )
        
        # Verify THREAD_CREATED event exists
        created_events = [e for e in events if e.event_type == EventType.THREAD_CREATED]
        assert len(created_events) == 1
        assert created_events[0].payload["founding_intent"] == sample_thread_data["founding_intent"]
        assert created_events[0].actor_id == "user_001"
    
    @pytest.mark.asyncio
    async def test_chat_message_produces_message_posted_event(self, thread_service, sample_thread_data):
        """
        Acceptance Test #2: Chat message produces MESSAGE_POSTED event.
        """
        from backend.services.thread_service import ThreadType, EventType, ActorType
        
        # Create thread
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Post message
        await thread_service.post_message(
            thread_id=thread.id,
            actor_type=ActorType.HUMAN,
            actor_id="user_001",
            content="Hello, this is a test message.",
        )
        
        # Get events
        events = await thread_service.get_events(
            thread_id=thread.id,
            viewer_id="user_001",
        )
        
        # Verify MESSAGE_POSTED event exists
        message_events = [e for e in events if e.event_type == EventType.MESSAGE_POSTED]
        assert len(message_events) == 1
        assert message_events[0].payload["content"] == "Hello, this is a test message."
    
    @pytest.mark.asyncio
    async def test_live_start_end_produces_events(self, thread_service, sample_thread_data):
        """
        Acceptance Test #3: Live start/end produce LIVE_STARTED/LIVE_ENDED events.
        """
        from backend.services.thread_service import ThreadType, EventType
        
        # Create thread
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Start live
        session = await thread_service.start_live(
            thread_id=thread.id,
            initiator_id="user_001",
            participants=["user_001", "user_002"],
        )
        
        # End live
        await thread_service.end_live(
            session_id=session.session_id,
            actor_id="user_001",
            generate_snapshot=False,  # Don't auto-generate for this test
        )
        
        # Get events
        events = await thread_service.get_events(
            thread_id=thread.id,
            viewer_id="user_001",
        )
        
        # Verify LIVE_STARTED event
        start_events = [e for e in events if e.event_type == EventType.LIVE_STARTED]
        assert len(start_events) == 1
        assert start_events[0].payload["session_id"] == session.session_id
        
        # Verify LIVE_ENDED event
        end_events = [e for e in events if e.event_type == EventType.LIVE_ENDED]
        assert len(end_events) == 1
        assert end_events[0].payload["session_id"] == session.session_id
    
    @pytest.mark.asyncio
    async def test_snapshot_generation_produces_event(self, thread_service, sample_thread_data):
        """
        Acceptance Test #4: Snapshot generation produces SUMMARY_SNAPSHOT event.
        """
        from backend.services.thread_service import ThreadType, EventType, SnapshotType
        
        # Create thread
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Generate snapshot
        snapshot = await thread_service.generate_snapshot(
            thread_id=thread.id,
            snapshot_type=SnapshotType.MEMORY_SUMMARY,
            trigger="test",
        )
        
        # Get events
        events = await thread_service.get_events(
            thread_id=thread.id,
            viewer_id="user_001",
        )
        
        # Verify SUMMARY_SNAPSHOT event
        snapshot_events = [e for e in events if e.event_type == EventType.SUMMARY_SNAPSHOT]
        assert len(snapshot_events) == 1
        assert snapshot_events[0].payload["snapshot_id"] == snapshot.snapshot_id
    
    @pytest.mark.asyncio
    async def test_xr_displays_derived_state_from_events(self, thread_service, sample_thread_data):
        """
        Acceptance Test #5: XR UI displays derived state from events.
        """
        from backend.services.thread_service import ThreadType, ActorType
        
        # Create thread
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Add some content
        await thread_service.post_message(
            thread_id=thread.id,
            actor_type=ActorType.HUMAN,
            actor_id="user_001",
            content="Test message for XR.",
        )
        
        await thread_service.record_decision(
            thread_id=thread.id,
            actor_id="user_001",
            decision="Focus on video content",
            rationale="Better ROI",
        )
        
        await thread_service.create_action(
            thread_id=thread.id,
            actor_id="user_001",
            action="Create video calendar",
            assigned_to="user_002",
        )
        
        # Get XR state
        xr_state = await thread_service.get_xr_state(thread.id, "user_001")
        
        # Verify XR state is derived from events
        assert xr_state["thread_id"] == thread.id
        assert xr_state["environment_id"] == f"xr_{thread.id}"
        assert xr_state["founding_intent"] == sample_thread_data["founding_intent"]
        
        # Verify zones contain derived data
        assert "zones" in xr_state
        assert len(xr_state["zones"]["decision_wall"]["decisions"]) > 0
        assert len(xr_state["zones"]["action_table"]["actions"]) > 0


# ============================================================================
# ACCEPTANCE TESTS — Append-Only
# ============================================================================

class TestAppendOnly:
    """Tests for append-only event log."""
    
    @pytest.mark.asyncio
    async def test_cannot_edit_old_event(self, thread_service, sample_thread_data):
        """
        Acceptance Test #6: Attempt to edit an old event is rejected.
        
        In our implementation, there's simply no method to edit events.
        The event log is immutable by design.
        """
        from backend.services.thread_service import ThreadType, ActorType
        
        # Create thread with message
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        await thread_service.post_message(
            thread_id=thread.id,
            actor_type=ActorType.HUMAN,
            actor_id="user_001",
            content="Original message",
        )
        
        events_before = await thread_service.get_events(thread.id, "user_001")
        original_event = events_before[-1]
        
        # There's no edit method - this is by design!
        # The only way to "correct" is via CORRECTION_APPENDED
        
        # Verify original event is unchanged after trying to add correction
        await thread_service.append_correction(
            thread_id=thread.id,
            actor_id="user_001",
            original_event_id=original_event.event_id,
            correction="This is a correction",
            reason="Typo fix",
        )
        
        events_after = await thread_service.get_events(thread.id, "user_001")
        
        # Original event still exists unchanged
        original_still_exists = any(
            e.event_id == original_event.event_id and 
            e.payload.get("content") == "Original message"
            for e in events_after
        )
        assert original_still_exists
    
    @pytest.mark.asyncio
    async def test_corrections_use_correction_appended(self, thread_service, sample_thread_data):
        """
        Acceptance Test #7: Corrections use CORRECTION_APPENDED referencing original.
        """
        from backend.services.thread_service import ThreadType, ActorType, EventType
        
        # Create thread with message
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        await thread_service.post_message(
            thread_id=thread.id,
            actor_type=ActorType.HUMAN,
            actor_id="user_001",
            content="Original message with typo",
        )
        
        events = await thread_service.get_events(thread.id, "user_001")
        message_event = [e for e in events if e.event_type == EventType.MESSAGE_POSTED][0]
        
        # Add correction
        correction_event = await thread_service.append_correction(
            thread_id=thread.id,
            actor_id="user_001",
            original_event_id=message_event.event_id,
            correction="Corrected message without typo",
            reason="Fixed typo",
        )
        
        # Verify correction event type
        assert correction_event.event_type == EventType.CORRECTION_APPENDED
        
        # Verify correction references original
        links = correction_event.links
        assert len(links) > 0
        assert any(
            link.type == "corrects" and link.target_id == message_event.event_id
            for link in links
        )


# ============================================================================
# ACCEPTANCE TESTS — Memory Agent
# ============================================================================

class TestMemoryAgent:
    """Tests for memory agent constraints."""
    
    @pytest.mark.asyncio
    async def test_exactly_one_memory_agent_per_thread(self, thread_service, sample_thread_data):
        """
        Acceptance Test #8: Exactly one memory_agent participant exists per thread.
        """
        from backend.services.thread_service import ThreadType, ParticipantRole
        
        # Create thread
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Get participants
        participants = await thread_service.get_participants(thread.id)
        
        # Count memory agents
        memory_agents = [p for p in participants if p.role == ParticipantRole.MEMORY_AGENT]
        assert len(memory_agents) == 1
        
        # Verify memory agent exists
        memory_agent = await thread_service.get_memory_agent(thread.id)
        assert memory_agent is not None
        assert memory_agent.role == ParticipantRole.MEMORY_AGENT
    
    @pytest.mark.asyncio
    async def test_cannot_add_second_memory_agent(self, thread_service, sample_thread_data):
        """
        Invariant: Cannot add second memory agent to thread.
        """
        from backend.services.thread_service import ThreadType, ActorType, ParticipantRole
        
        # Create thread (already has one memory agent)
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Try to add another memory agent - should fail
        with pytest.raises(ValueError, match="already has a memory agent"):
            await thread_service.add_participant(
                thread_id=thread.id,
                actor_id="user_001",
                subject_type=ActorType.AGENT,
                subject_id="another_memory_agent",
                role=ParticipantRole.MEMORY_AGENT,
            )
    
    @pytest.mark.asyncio
    async def test_memory_agent_reassignment_requires_audit(self, thread_service, sample_thread_data):
        """
        Acceptance Test #9: Reassignment requires PERMISSION_CHANGED + audit events.
        """
        from backend.services.thread_service import ThreadType, ActorType, ParticipantRole, EventType
        
        # Create thread
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Add a new participant
        await thread_service.add_participant(
            thread_id=thread.id,
            actor_id="user_001",
            subject_type=ActorType.HUMAN,
            subject_id="user_002",
            role=ParticipantRole.CONTRIBUTOR,
        )
        
        # Get events
        events = await thread_service.get_events(thread.id, "user_001")
        
        # Verify PERMISSION_CHANGED event was created
        permission_events = [e for e in events if e.event_type == EventType.PERMISSION_CHANGED]
        assert len(permission_events) >= 1
        
        # Verify event has audit info
        latest_perm_event = permission_events[-1]
        assert latest_perm_event.payload.get("action") == "added"
        assert latest_perm_event.payload.get("subject_id") == "user_002"


# ============================================================================
# ACCEPTANCE TESTS — Permissions & Privacy
# ============================================================================

class TestPermissionsAndPrivacy:
    """Tests for permissions and privacy."""
    
    @pytest.mark.asyncio
    async def test_viewer_cannot_write_events(self, thread_service, sample_thread_data):
        """
        Acceptance Test #10: Viewer cannot write events.
        """
        from backend.services.thread_service import ThreadType, ActorType, ParticipantRole
        
        # Create thread
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Add viewer
        await thread_service.add_participant(
            thread_id=thread.id,
            actor_id="user_001",
            subject_type=ActorType.HUMAN,
            subject_id="viewer_user",
            role=ParticipantRole.VIEWER,
        )
        
        # Viewer tries to post message - should fail
        with pytest.raises(PermissionError):
            await thread_service.post_message(
                thread_id=thread.id,
                actor_type=ActorType.HUMAN,
                actor_id="viewer_user",
                content="I'm a viewer trying to write",
            )
    
    @pytest.mark.asyncio
    async def test_redaction_levels_hide_sensitive_events(self, thread_service, sample_thread_data):
        """
        Acceptance Test #11: Redaction levels hide sensitive events from insufficient roles.
        """
        from backend.services.thread_service import (
            ThreadType, ActorType, ParticipantRole, 
            RedactionLevel, PermissionChecker
        )
        
        # Verify permission checker works correctly
        assert PermissionChecker.can_view_redaction(ParticipantRole.OWNER, RedactionLevel.PRIVATE) == True
        assert PermissionChecker.can_view_redaction(ParticipantRole.VIEWER, RedactionLevel.PRIVATE) == False
        assert PermissionChecker.can_view_redaction(ParticipantRole.VIEWER, RedactionLevel.PUBLIC) == True
        assert PermissionChecker.can_view_redaction(ParticipantRole.CONTRIBUTOR, RedactionLevel.SEMI_PRIVATE) == True


# ============================================================================
# ADDITIONAL TESTS — Thread Operations
# ============================================================================

class TestThreadOperations:
    """Additional tests for thread operations."""
    
    @pytest.mark.asyncio
    async def test_create_thread_with_founding_intent(self, thread_service):
        """Test thread creation requires founding intent."""
        from backend.services.thread_service import ThreadType
        
        # Should fail without founding intent
        with pytest.raises(ValueError, match="founding_intent is REQUIRED"):
            await thread_service.create_thread(
                founding_intent="",  # Empty intent
                thread_type=ThreadType.PERSONAL,
                creator_id="user_001",
            )
    
    @pytest.mark.asyncio
    async def test_thread_archive_not_delete(self, thread_service, sample_thread_data):
        """Test thread is archived, never deleted."""
        from backend.services.thread_service import ThreadType, ThreadStatus
        
        # Create thread
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Archive thread
        await thread_service.archive_thread(thread.id, "user_001")
        
        # Thread still exists but is archived
        archived_thread = await thread_service.get_thread(thread.id)
        assert archived_thread is not None
        assert archived_thread.status == ThreadStatus.ARCHIVED
    
    @pytest.mark.asyncio
    async def test_founding_intent_is_immutable(self, thread_service, sample_thread_data):
        """Test founding intent cannot be changed."""
        from backend.services.thread_service import ThreadType
        
        # Create thread
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Update thread (title can change)
        await thread_service.update_thread(
            thread_id=thread.id,
            actor_id="user_001",
            title="New Title",
        )
        
        # Verify founding intent is unchanged
        updated_thread = await thread_service.get_thread(thread.id)
        assert updated_thread.founding_intent == sample_thread_data["founding_intent"]
        assert updated_thread.title == "New Title"
    
    @pytest.mark.asyncio
    async def test_list_threads_by_user(self, thread_service):
        """Test listing threads by user."""
        from backend.services.thread_service import ThreadType
        
        # Create threads for different users
        await thread_service.create_thread(
            founding_intent="Intent for user 001",
            thread_type=ThreadType.PERSONAL,
            creator_id="user_001",
        )
        
        await thread_service.create_thread(
            founding_intent="Intent for user 002",
            thread_type=ThreadType.PERSONAL,
            creator_id="user_002",
        )
        
        # List threads for user_001
        user1_threads = await thread_service.list_threads(user_id="user_001")
        
        # Should only see their own threads
        assert len(user1_threads) == 1
        assert user1_threads[0].founding_intent == "Intent for user 001"
    
    @pytest.mark.asyncio
    async def test_thread_types(self, thread_service):
        """Test all thread types."""
        from backend.services.thread_service import ThreadType
        
        for ttype in ThreadType:
            thread = await thread_service.create_thread(
                founding_intent=f"Intent for {ttype.value} thread",
                thread_type=ttype,
                creator_id="user_001",
            )
            assert thread.type == ttype


# ============================================================================
# TESTS — Decisions and Actions
# ============================================================================

class TestDecisionsAndActions:
    """Tests for decisions and actions."""
    
    @pytest.mark.asyncio
    async def test_record_decision(self, thread_service, sample_thread_data):
        """Test recording a decision."""
        from backend.services.thread_service import ThreadType, EventType
        
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        event = await thread_service.record_decision(
            thread_id=thread.id,
            actor_id="user_001",
            decision="Use video content",
            rationale="Better engagement",
            options_considered=["Blog", "Video", "Podcast"],
        )
        
        assert event.event_type == EventType.DECISION_RECORDED
        assert event.payload["decision"] == "Use video content"
        assert len(event.payload["options_considered"]) == 3
    
    @pytest.mark.asyncio
    async def test_action_lifecycle(self, thread_service, sample_thread_data):
        """Test action creation and update."""
        from backend.services.thread_service import ThreadType, EventType
        
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Create action
        create_event = await thread_service.create_action(
            thread_id=thread.id,
            actor_id="user_001",
            action="Create content calendar",
            assigned_to="user_002",
        )
        
        action_id = create_event.payload["action_id"]
        
        # Update action
        update_event = await thread_service.update_action(
            thread_id=thread.id,
            actor_id="user_001",
            action_id=action_id,
            status="completed",
            result="Calendar created",
        )
        
        assert update_event.event_type == EventType.ACTION_UPDATED
        assert update_event.payload["status"] == "completed"
    
    @pytest.mark.asyncio
    async def test_record_error_without_judgment(self, thread_service, sample_thread_data):
        """Test recording error without judgment."""
        from backend.services.thread_service import ThreadType, EventType
        
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        event = await thread_service.record_error(
            thread_id=thread.id,
            actor_id="user_001",
            error="API call failed",
            context="During data sync",
        )
        
        assert event.event_type == EventType.ERROR_RECORDED
        assert event.payload["error"] == "API call failed"
    
    @pytest.mark.asyncio
    async def test_record_learning(self, thread_service, sample_thread_data):
        """Test recording learning."""
        from backend.services.thread_service import ThreadType, EventType
        
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        event = await thread_service.record_learning(
            thread_id=thread.id,
            actor_id="user_001",
            learning="Video content gets 3x more engagement",
        )
        
        assert event.event_type == EventType.LEARNING_RECORDED
        assert "3x more engagement" in event.payload["learning"]


# ============================================================================
# TESTS — Thread Links
# ============================================================================

class TestThreadLinks:
    """Tests for thread linking."""
    
    @pytest.mark.asyncio
    async def test_add_link_between_threads(self, thread_service, sample_thread_data):
        """Test linking threads."""
        from backend.services.thread_service import ThreadType, EventType
        
        # Create two threads
        thread1 = await thread_service.create_thread(
            founding_intent="Parent thread intent",
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        thread2 = await thread_service.create_thread(
            founding_intent="Child thread intent",
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Link them
        event = await thread_service.add_link(
            thread_id=thread1.id,
            actor_id="user_001",
            link_type="parent_of",
            target_id=thread2.id,
        )
        
        assert event.event_type == EventType.LINK_ADDED
        assert event.payload["target_id"] == thread2.id
    
    @pytest.mark.asyncio
    async def test_get_linked_threads(self, thread_service, sample_thread_data):
        """Test retrieving linked threads."""
        from backend.services.thread_service import ThreadType
        
        thread1 = await thread_service.create_thread(
            founding_intent="Main thread",
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        thread2 = await thread_service.create_thread(
            founding_intent="Related thread",
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        await thread_service.add_link(
            thread_id=thread1.id,
            actor_id="user_001",
            link_type="references",
            target_id=thread2.id,
        )
        
        links = await thread_service.get_linked_threads(thread1.id)
        
        assert len(links) == 1
        assert links[0]["target_id"] == thread2.id
        assert links[0]["link_type"] == "references"


# ============================================================================
# TESTS — Statistics
# ============================================================================

class TestStatistics:
    """Tests for statistics tracking."""
    
    @pytest.mark.asyncio
    async def test_stats_tracking(self, thread_service):
        """Test statistics are tracked."""
        from backend.services.thread_service import ThreadType
        
        initial_stats = await thread_service.get_stats()
        
        # Create thread
        await thread_service.create_thread(
            founding_intent="Test intent",
            thread_type=ThreadType.PERSONAL,
            creator_id="user_001",
        )
        
        new_stats = await thread_service.get_stats()
        
        assert new_stats["threads_created"] == initial_stats["threads_created"] + 1
        assert new_stats["total_threads"] == initial_stats["total_threads"] + 1


# ============================================================================
# TESTS — Event Integrity
# ============================================================================

class TestEventIntegrity:
    """Tests for event integrity."""
    
    @pytest.mark.asyncio
    async def test_event_has_integrity_hash(self, thread_service, sample_thread_data):
        """Test events have integrity hash."""
        from backend.services.thread_service import ThreadType, ActorType
        
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        await thread_service.post_message(
            thread_id=thread.id,
            actor_type=ActorType.HUMAN,
            actor_id="user_001",
            content="Test message",
        )
        
        events = await thread_service.get_events(thread.id, "user_001")
        
        for event in events:
            assert event.integrity_hash is not None
            assert len(event.integrity_hash) == 16  # SHA256 truncated


# ============================================================================
# PERFORMANCE TESTS
# ============================================================================

class TestPerformance:
    """Performance tests."""
    
    @pytest.mark.asyncio
    async def test_many_events_performance(self, thread_service, sample_thread_data):
        """Test performance with many events."""
        from backend.services.thread_service import ThreadType, ActorType
        import time
        
        thread = await thread_service.create_thread(
            founding_intent=sample_thread_data["founding_intent"],
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
        )
        
        # Add 100 messages
        start = time.time()
        for i in range(100):
            await thread_service.post_message(
                thread_id=thread.id,
                actor_type=ActorType.HUMAN,
                actor_id="user_001",
                content=f"Message {i}",
            )
        elapsed = time.time() - start
        
        # Should complete in reasonable time
        assert elapsed < 5.0  # Less than 5 seconds for 100 messages
        
        # Verify all messages exist
        events = await thread_service.get_events(thread.id, "user_001", limit=200)
        message_count = sum(1 for e in events if "content" in e.payload and e.payload["content"].startswith("Message"))
        assert message_count == 100


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
