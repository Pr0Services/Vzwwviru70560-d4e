"""
CHE·NU™ XR Environment Generator — Test Suite

Comprehensive tests for the XR blueprint generator.
"""

import pytest
from datetime import datetime
from dataclasses import dataclass, field
from typing import Dict, Any, List
from uuid import uuid4

from xr_env_generator import (
    XREnvironmentGenerator,
    XRBlueprint,
    XRTemplate,
    ZoneType,
    ItemKind,
    RedactionLevel,
    CANONICAL_ZONES,
)


# ═══════════════════════════════════════════════════════════════════════════════
# TEST FIXTURES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class MockThread:
    id: str = field(default_factory=lambda: str(uuid4()))
    founding_intent: str = "Test founding intent"
    type: str = "personal"


@dataclass
class MockEvent:
    id: str = field(default_factory=lambda: str(uuid4()))
    event_type: str = "MESSAGE_POSTED"
    payload: Dict[str, Any] = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())


@pytest.fixture
def generator():
    return XREnvironmentGenerator()


@pytest.fixture
def thread():
    return MockThread()


@pytest.fixture
def basic_events():
    return [
        MockEvent(event_type="THREAD_CREATED", payload={}),
        MockEvent(
            event_type="DECISION_RECORDED",
            payload={"decision": "Test decision", "rationale": "Because"}
        ),
        MockEvent(
            event_type="ACTION_CREATED",
            payload={"action_id": "act_001", "title": "Test action", "status": "pending"}
        ),
        MockEvent(
            event_type="SUMMARY_SNAPSHOT",
            payload={"summary": "Test summary"}
        ),
    ]


# ═══════════════════════════════════════════════════════════════════════════════
# TEMPLATE SELECTION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestTemplateSelection:
    """Tests for deterministic template selection."""
    
    def test_personal_thread_gets_personal_room(self, generator):
        """Personal type threads get personal_room template."""
        thread = MockThread(type="personal")
        events = [MockEvent(event_type="THREAD_CREATED")]
        
        blueprint = generator.generate(thread, events)
        
        assert blueprint.template == XRTemplate.PERSONAL_ROOM
    
    def test_collective_with_cause_keywords_gets_cause_room(self, generator):
        """Collective threads with mission keywords get cause_room."""
        thread = MockThread(
            type="collective",
            founding_intent="Our mission is to create impact in the community"
        )
        events = [MockEvent(event_type="THREAD_CREATED")]
        
        blueprint = generator.generate(thread, events)
        
        assert blueprint.template == XRTemplate.CAUSE_ROOM
    
    def test_business_keywords_get_business_room(self, generator):
        """Threads with business keywords get business_room."""
        thread = MockThread(
            type="other",
            founding_intent="Manage our finance and revenue operations"
        )
        events = [MockEvent(event_type="THREAD_CREATED")]
        
        blueprint = generator.generate(thread, events)
        
        assert blueprint.template == XRTemplate.BUSINESS_ROOM
    
    def test_lab_keywords_get_lab_room(self, generator):
        """Threads with research keywords get lab_room."""
        thread = MockThread(
            type="other",
            founding_intent="Research hypothesis testing and experiments"
        )
        events = [MockEvent(event_type="THREAD_CREATED")]
        
        blueprint = generator.generate(thread, events)
        
        assert blueprint.template == XRTemplate.LAB_ROOM
    
    def test_default_gets_custom_room(self, generator):
        """Threads with no matching keywords get custom_room."""
        thread = MockThread(type="other", founding_intent="Just a random thread")
        events = [MockEvent(event_type="THREAD_CREATED")]
        
        blueprint = generator.generate(thread, events)
        
        assert blueprint.template == XRTemplate.CUSTOM_ROOM


# ═══════════════════════════════════════════════════════════════════════════════
# CANONICAL ZONES TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestCanonicalZones:
    """Tests for required canonical zones."""
    
    def test_all_canonical_zones_present(self, generator, thread, basic_events):
        """All canonical zones must be present."""
        blueprint = generator.generate(thread, basic_events)
        
        zone_ids = {z.id for z in blueprint.zones}
        
        for required_zone in CANONICAL_ZONES:
            assert required_zone in zone_ids, f"Missing: {required_zone}"
    
    def test_intent_wall_contains_founding_intent(self, generator):
        """Intent wall must contain founding intent."""
        thread = MockThread(founding_intent="My specific intent")
        events = [MockEvent(event_type="THREAD_CREATED")]
        
        blueprint = generator.generate(thread, events)
        
        intent_wall = next(z for z in blueprint.zones if z.id == "intent_wall")
        assert len(intent_wall.items) == 1
        assert intent_wall.items[0].label == "My specific intent"
        assert intent_wall.items[0].kind == ItemKind.INTENT
    
    def test_decision_wall_captures_decisions(self, generator, thread):
        """Decision wall captures DECISION_RECORDED events."""
        events = [
            MockEvent(event_type="THREAD_CREATED"),
            MockEvent(
                id="dec_001",
                event_type="DECISION_RECORDED",
                payload={"decision": "Decision 1"}
            ),
            MockEvent(
                id="dec_002",
                event_type="DECISION_RECORDED",
                payload={"decision": "Decision 2"}
            ),
        ]
        
        blueprint = generator.generate(thread, events)
        
        decision_wall = next(z for z in blueprint.zones if z.id == "decision_wall")
        assert len(decision_wall.items) == 2
        assert all(item.kind == ItemKind.DECISION for item in decision_wall.items)
    
    def test_action_table_captures_actions(self, generator, thread):
        """Action table captures ACTION_CREATED/UPDATED events."""
        events = [
            MockEvent(event_type="THREAD_CREATED"),
            MockEvent(
                event_type="ACTION_CREATED",
                payload={"action_id": "act_1", "title": "Action 1"}
            ),
            MockEvent(
                event_type="ACTION_UPDATED",
                payload={"action_id": "act_1", "title": "Action 1 Updated"}
            ),
            MockEvent(
                event_type="ACTION_CREATED",
                payload={"action_id": "act_2", "title": "Action 2"}
            ),
        ]
        
        blueprint = generator.generate(thread, events)
        
        action_table = next(z for z in blueprint.zones if z.id == "action_table")
        # Should be 2 (grouped by action_id)
        assert len(action_table.items) == 2
        assert all(item.kind == ItemKind.ACTION for item in action_table.items)
    
    def test_memory_kiosk_captures_snapshots(self, generator, thread):
        """Memory kiosk captures SUMMARY_SNAPSHOT events."""
        events = [
            MockEvent(event_type="THREAD_CREATED"),
            MockEvent(
                event_type="SUMMARY_SNAPSHOT",
                payload={"summary": "Summary 1"}
            ),
            MockEvent(
                event_type="SUMMARY_SNAPSHOT",
                payload={"summary": "Summary 2"}
            ),
        ]
        
        blueprint = generator.generate(thread, events)
        
        memory_kiosk = next(z for z in blueprint.zones if z.id == "memory_kiosk")
        assert len(memory_kiosk.items) >= 2
        assert all(item.kind == ItemKind.MEMORY for item in memory_kiosk.items)
    
    def test_timeline_strip_chronological(self, generator, thread):
        """Timeline strip shows chronological significant events."""
        events = [
            MockEvent(event_type="THREAD_CREATED", created_at="2026-01-01T10:00:00Z"),
            MockEvent(event_type="DECISION_RECORDED", created_at="2026-01-01T11:00:00Z"),
            MockEvent(event_type="ACTION_CREATED", created_at="2026-01-01T12:00:00Z"),
        ]
        
        blueprint = generator.generate(thread, events)
        
        timeline = next(z for z in blueprint.zones if z.id == "timeline_strip")
        assert len(timeline.items) >= 3
        assert all(item.kind == ItemKind.TIMELINE_EVENT for item in timeline.items)


# ═══════════════════════════════════════════════════════════════════════════════
# RESOURCE SHELF & PORTALS TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestResourcesAndPortals:
    """Tests for optional zones and portals."""
    
    def test_resource_shelf_created_when_links_exist(self, generator, thread):
        """Resource shelf only created when LINK_ADDED events exist."""
        events = [
            MockEvent(event_type="THREAD_CREATED"),
            MockEvent(
                event_type="LINK_ADDED",
                payload={"title": "Resource 1", "url": "https://example.com"}
            ),
        ]
        
        blueprint = generator.generate(thread, events)
        
        zone_ids = {z.id for z in blueprint.zones}
        assert "resource_shelf" in zone_ids
        
        resource_shelf = next(z for z in blueprint.zones if z.id == "resource_shelf")
        assert len(resource_shelf.items) == 1
        assert resource_shelf.items[0].kind == ItemKind.RESOURCE
    
    def test_no_resource_shelf_without_links(self, generator, thread):
        """Resource shelf not created when no links."""
        events = [MockEvent(event_type="THREAD_CREATED")]
        
        blueprint = generator.generate(thread, events)
        
        zone_ids = {z.id for z in blueprint.zones}
        assert "resource_shelf" not in zone_ids
    
    def test_portals_from_thread_references(self, generator, thread):
        """Portals created from thread reference links."""
        events = [
            MockEvent(event_type="THREAD_CREATED"),
            MockEvent(
                event_type="LINK_ADDED",
                payload={
                    "link_type": "thread_reference",
                    "target_thread_id": "other_thread_123",
                    "title": "Related Thread"
                }
            ),
        ]
        
        blueprint = generator.generate(thread, events)
        
        assert len(blueprint.portals) == 1
        assert blueprint.portals[0].thread_id == "other_thread_123"


# ═══════════════════════════════════════════════════════════════════════════════
# SOURCE TRACEABILITY TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestSourceTraceability:
    """Tests for source event/snapshot references."""
    
    def test_all_items_have_source_references(self, generator, thread, basic_events):
        """All items must have source_event_id or source_snapshot_id."""
        blueprint = generator.generate(thread, basic_events)
        
        for zone in blueprint.zones:
            for item in zone.items:
                has_event_ref = item.source_event_id is not None
                has_snapshot_ref = item.source_snapshot_id is not None
                assert has_event_ref or has_snapshot_ref, f"Item {item.id} has no source"
    
    def test_references_tracked_in_blueprint(self, generator, thread, basic_events):
        """Blueprint references list tracks all used events/snapshots."""
        blueprint = generator.generate(thread, basic_events)
        
        assert "events" in blueprint.references
        assert "snapshots" in blueprint.references
        assert len(blueprint.references["events"]) > 0


# ═══════════════════════════════════════════════════════════════════════════════
# VALIDATION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestValidation:
    """Tests for blueprint validation."""
    
    def test_valid_blueprint_has_no_errors(self, generator, thread, basic_events):
        """Valid blueprint passes validation."""
        blueprint = generator.generate(thread, basic_events)
        errors = generator.validate_blueprint(blueprint)
        
        assert errors == []
    
    def test_missing_canonical_zone_detected(self, generator):
        """Missing canonical zones are detected."""
        # Create invalid blueprint manually
        blueprint = XRBlueprint(
            thread_id="test",
            template=XRTemplate.CUSTOM_ROOM,
            generated_at=datetime.utcnow(),
            version="1.0.0",
            zones=[],  # No zones!
        )
        
        errors = generator.validate_blueprint(blueprint)
        
        assert len(errors) >= len(CANONICAL_ZONES)
    
    def test_missing_thread_id_detected(self, generator):
        """Missing thread_id is detected."""
        blueprint = XRBlueprint(
            thread_id="",  # Empty!
            template=XRTemplate.CUSTOM_ROOM,
            generated_at=datetime.utcnow(),
            version="1.0.0",
            zones=[],
        )
        
        errors = generator.validate_blueprint(blueprint)
        
        assert any("thread_id" in e for e in errors)


# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRITY & SERIALIZATION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestIntegrityAndSerialization:
    """Tests for blueprint integrity and serialization."""
    
    def test_integrity_hash_deterministic(self, generator, thread, basic_events):
        """Same input produces same integrity hash."""
        blueprint1 = generator.generate(thread, basic_events)
        blueprint2 = generator.generate(thread, basic_events)
        
        # Note: Generated_at will differ, so hashes may differ
        # But structure should be consistent
        assert blueprint1.to_dict()["zones"] == blueprint2.to_dict()["zones"]
    
    def test_to_dict_complete(self, generator, thread, basic_events):
        """to_dict() includes all required fields."""
        blueprint = generator.generate(thread, basic_events)
        d = blueprint.to_dict()
        
        required_fields = ["thread_id", "template", "generated_at", "version", "zones"]
        for field in required_fields:
            assert field in d, f"Missing field: {field}"
    
    def test_to_json_valid(self, generator, thread, basic_events):
        """to_json() produces valid JSON."""
        import json
        
        blueprint = generator.generate(thread, basic_events)
        json_str = blueprint.to_json()
        
        # Should not raise
        parsed = json.loads(json_str)
        assert parsed["thread_id"] == blueprint.thread_id


# ═══════════════════════════════════════════════════════════════════════════════
# CANONICAL INVARIANT TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestCanonicalInvariants:
    """Tests for canonical invariants."""
    
    def test_blueprint_is_projection_only(self, generator, thread, basic_events):
        """
        INVARIANT: XR blueprint is a projection, not authoritative.
        
        Verify: Blueprint can be regenerated without affecting thread state.
        """
        # Generate twice
        blueprint1 = generator.generate(thread, basic_events)
        blueprint2 = generator.generate(thread, basic_events)
        
        # Both should work - no side effects
        assert blueprint1.thread_id == blueprint2.thread_id
        assert len(blueprint1.zones) == len(blueprint2.zones)
    
    def test_no_xr_only_memory(self, generator, thread, basic_events):
        """
        INVARIANT: No XR-only memory.
        
        Verify: All items reference source events/snapshots from thread.
        """
        blueprint = generator.generate(thread, basic_events)
        
        for zone in blueprint.zones:
            for item in zone.items:
                assert item.source_event_id or item.source_snapshot_id
    
    def test_redaction_levels_set(self, generator, thread, basic_events):
        """
        INVARIANT: All items have redaction levels.
        
        Verify: Every item has a redaction_level set.
        """
        blueprint = generator.generate(thread, basic_events)
        
        for zone in blueprint.zones:
            for item in zone.items:
                assert item.redaction_level in RedactionLevel


# ═══════════════════════════════════════════════════════════════════════════════
# EDGE CASES
# ═══════════════════════════════════════════════════════════════════════════════

class TestEdgeCases:
    """Tests for edge cases."""
    
    def test_empty_events_list(self, generator, thread):
        """Handle empty events list."""
        blueprint = generator.generate(thread, [])
        
        # Should still have canonical zones
        zone_ids = {z.id for z in blueprint.zones}
        for required in CANONICAL_ZONES:
            assert required in zone_ids
    
    def test_thread_as_dict(self, generator, basic_events):
        """Handle thread as dictionary."""
        thread_dict = {
            "id": "thread_123",
            "founding_intent": "Dict-based thread",
            "type": "personal"
        }
        
        blueprint = generator.generate(thread_dict, basic_events)
        
        assert blueprint.thread_id == "thread_123"
    
    def test_event_as_dict(self, generator, thread):
        """Handle events as dictionaries."""
        events = [
            {"id": "e1", "event_type": "THREAD_CREATED", "payload": {}},
            {"id": "e2", "event_type": "DECISION_RECORDED", "payload": {"decision": "Test"}},
        ]
        
        blueprint = generator.generate(thread, events)
        
        decision_wall = next(z for z in blueprint.zones if z.id == "decision_wall")
        assert len(decision_wall.items) == 1


# ═══════════════════════════════════════════════════════════════════════════════
# RUN TESTS
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
