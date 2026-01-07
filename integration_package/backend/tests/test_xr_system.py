"""
TEST XR SYSTEM
==============

Comprehensive tests for XR Environment Generator.

Tests cover:
- Maturity computation
- Blueprint generation
- Template selection
- Zone construction
- Portals
- XR interactions
- R&D compliance

VERSION: 1.0.0
"""

import pytest
from uuid import uuid4
from datetime import datetime, timedelta
from typing import Dict, Any

from backend.schemas.xr_schemas import (
    # Enums
    RedactionLevel,
    ZoneType,
    ItemKind,
    XRTemplate,
    MaturityLevel,
    ThreadEntryMode,
    ViewerRole,
    ActionStatus,
    BlueprintItemAction,
    
    # Models
    BlueprintItem,
    BlueprintZone,
    ZoneLayout,
    ThreadPortal,
    BlueprintReferences,
    XRBlueprint,
    MaturitySignals,
    MaturityResult,
    EnvironmentEvolutionRule,
    XRInteractionContext,
    ActionUpdatePayload,
    ActionCreatePayload,
    NoteAddPayload,
    MessagePostPayload,
    ThreadLobbyData,
    XRPreflightData,
    ModeRecommendation,
    ThreadSummaryExcerpt,
    LiveSessionInfo,
)

from backend.services.xr.maturity_service import (
    MaturityScorer,
    MaturityService,
)

from backend.services.xr.xr_renderer_service import (
    BlueprintGenerator,
    XRRendererService,
)


# =============================================================================
# FIXTURES
# =============================================================================

@pytest.fixture
def maturity_service():
    """Fresh maturity service instance"""
    return MaturityService()


@pytest.fixture
def xr_renderer_service():
    """Fresh XR renderer service instance"""
    return XRRendererService()


@pytest.fixture
def blueprint_generator():
    """Blueprint generator with maturity service"""
    maturity_service = MaturityService()
    return BlueprintGenerator(maturity_service)


@pytest.fixture
def thread_id():
    """Test thread ID"""
    return str(uuid4())


@pytest.fixture
def user_id():
    """Test user ID"""
    return str(uuid4())


@pytest.fixture
def minimal_thread_state():
    """Minimal thread state (maturity 0)"""
    return {
        "thread_id": str(uuid4()),
        "founding_intent": "Start a new project",
        "thread_type": "personal",
        "created_at": datetime.utcnow().isoformat(),
        "owner_id": str(uuid4()),
        "decisions": [],
        "actions": [],
        "summaries": [],
        "links": [],
        "messages": [],
        "participants": [str(uuid4())],
        "referenced_event_ids": [],
        "referenced_snapshot_ids": [],
    }


@pytest.fixture
def mature_thread_state():
    """Mature thread state (maturity 4+)"""
    owner_id = str(uuid4())
    return {
        "thread_id": str(uuid4()),
        "founding_intent": "Build an enterprise application with multiple components",
        "thread_type": "business",
        "created_at": (datetime.utcnow() - timedelta(days=60)).isoformat(),
        "last_active": datetime.utcnow().isoformat(),
        "owner_id": owner_id,
        "decisions": [
            {"id": "d1", "title": "Use microservices architecture", "rationale": "Scalability", "event_id": "evt1"},
            {"id": "d2", "title": "Choose PostgreSQL", "rationale": "Reliability", "event_id": "evt2"},
            {"id": "d3", "title": "Implement API versioning", "rationale": "Backwards compatibility", "event_id": "evt3"},
        ],
        "actions": [
            {"id": "a1", "title": "Setup development environment", "status": "done", "assignee": owner_id, "event_id": "evt4"},
            {"id": "a2", "title": "Design database schema", "status": "done", "assignee": owner_id, "event_id": "evt5"},
            {"id": "a3", "title": "Implement auth service", "status": "doing", "assignee": owner_id, "event_id": "evt6"},
            {"id": "a4", "title": "Write API tests", "status": "todo", "assignee": owner_id, "event_id": "evt7"},
            {"id": "a5", "title": "Deploy to staging", "status": "todo", "event_id": "evt8"},
            {"id": "a6", "title": "Security audit", "status": "todo", "event_id": "evt9"},
            {"id": "a7", "title": "Performance testing", "status": "todo", "event_id": "evt10"},
        ],
        "summaries": [
            {"id": "s1", "excerpt": "Project kickoff and architecture decisions", "snapshot_id": "snap1"},
            {"id": "s2", "excerpt": "Development phase 1 complete", "snapshot_id": "snap2"},
        ],
        "links": [
            {"id": "l1", "url": "https://docs.example.com", "title": "Documentation"},
            {"id": "l2", "url": "https://github.com/example", "title": "Repository"},
            {"id": "l3", "url": "https://figma.com/file/example", "title": "Design"},
            {"id": "l4", "url": "https://jira.example.com", "title": "Project board"},
        ],
        "linked_threads": [
            {"thread_id": str(uuid4()), "label": "Frontend Project", "preview": "React-based UI"},
            {"thread_id": str(uuid4()), "label": "Infrastructure", "preview": "Kubernetes setup"},
            {"thread_id": str(uuid4()), "label": "Documentation", "preview": "API docs and guides"},
        ],
        "messages": [{"id": f"m{i}", "content": f"Message {i}"} for i in range(30)],
        "participants": [owner_id, str(uuid4()), str(uuid4()), str(uuid4())],
        "live_sessions": [
            {"id": "ls1", "started_at": (datetime.utcnow() - timedelta(days=30)).isoformat()}
        ],
        "referenced_event_ids": ["evt1", "evt2", "evt3", "evt4"],
        "referenced_snapshot_ids": ["snap1", "snap2"],
    }


@pytest.fixture
def event_counts_minimal():
    """Minimal event counts"""
    return {
        "MESSAGE_POSTED": 3,
    }


@pytest.fixture
def event_counts_mature():
    """Mature event counts"""
    return {
        "MESSAGE_POSTED": 50,
        "SUMMARY_SNAPSHOT": 3,
        "DECISION_RECORDED": 5,
        "ACTION_CREATED": 10,
        "ACTION_UPDATED": 5,
        "ACTION_COMPLETED": 5,
        "LIVE_STARTED": 2,
        "LIVE_ENDED": 2,
        "LINK_ADDED": 5,
        "THREAD_REFERENCED": 3,
        "LEARNING_RECORDED": 3,
        "CORRECTION_APPENDED": 2,
    }


# =============================================================================
# MATURITY SCORER TESTS
# =============================================================================

class TestMaturityScorer:
    """Test maturity scoring"""
    
    def test_compute_signals_minimal(self, event_counts_minimal):
        """Test signals from minimal events"""
        metadata = {"participant_count": 1, "created_at": datetime.utcnow().isoformat()}
        
        signals = MaturityScorer.compute_signals(event_counts_minimal, metadata)
        
        assert signals.has_summary is False
        assert signals.has_decisions is False
        assert signals.action_count == 0
        assert signals.participant_count == 1
        assert signals.has_live_segments is False
    
    def test_compute_signals_mature(self, event_counts_mature):
        """Test signals from mature events"""
        metadata = {
            "participant_count": 5,
            "created_at": (datetime.utcnow() - timedelta(days=60)).isoformat(),
            "last_active": datetime.utcnow().isoformat(),
            "portal_count": 3,
        }
        
        signals = MaturityScorer.compute_signals(event_counts_mature, metadata)
        
        assert signals.has_summary is True
        assert signals.has_decisions is True
        assert signals.action_count == 20  # 10 + 5 + 5
        assert signals.participant_count == 5
        assert signals.has_live_segments is True
    
    def test_compute_score_level_0(self, event_counts_minimal):
        """Test score computation for seed level"""
        metadata = {"participant_count": 1}
        signals = MaturityScorer.compute_signals(event_counts_minimal, metadata)
        
        score = MaturityScorer.compute_score(signals)
        level = MaturityScorer.score_to_level(score)
        
        assert level == MaturityLevel.SEED
    
    def test_compute_score_level_5(self, event_counts_mature):
        """Test score computation for ecosystem level"""
        metadata = {
            "participant_count": 5,
            "created_at": (datetime.utcnow() - timedelta(days=60)).isoformat(),
            "last_active": datetime.utcnow().isoformat(),
            "portal_count": 5,
        }
        signals = MaturityScorer.compute_signals(event_counts_mature, metadata)
        
        score = MaturityScorer.compute_score(signals)
        level = MaturityScorer.score_to_level(score)
        
        assert level == MaturityLevel.ECOSYSTEM or level == MaturityLevel.ORG
    
    def test_score_to_level_boundaries(self):
        """Test score-to-level boundary conditions"""
        assert MaturityScorer.score_to_level(0) == MaturityLevel.SEED
        assert MaturityScorer.score_to_level(10) == MaturityLevel.SEED
        assert MaturityScorer.score_to_level(20) == MaturityLevel.SPROUT
        assert MaturityScorer.score_to_level(40) == MaturityLevel.WORKSHOP
        assert MaturityScorer.score_to_level(60) == MaturityLevel.STUDIO
        assert MaturityScorer.score_to_level(80) == MaturityLevel.ORG
        assert MaturityScorer.score_to_level(100) == MaturityLevel.ECOSYSTEM


# =============================================================================
# MATURITY SERVICE TESTS
# =============================================================================

class TestMaturityService:
    """Test maturity service"""
    
    def test_init(self, maturity_service):
        """Test service initialization"""
        assert maturity_service is not None
    
    def test_get_zones_for_maturity_seed(self, maturity_service):
        """Test zones for seed maturity"""
        zones = maturity_service.get_zones_for_maturity(MaturityLevel.SEED)
        
        assert ZoneType.WALL in zones
        # Seed level has limited zones
        assert len(zones) <= 3
    
    def test_get_zones_for_maturity_ecosystem(self, maturity_service):
        """Test zones for ecosystem maturity"""
        zones = maturity_service.get_zones_for_maturity(MaturityLevel.ECOSYSTEM)
        
        assert ZoneType.WALL in zones
        assert ZoneType.TABLE in zones
        assert ZoneType.KIOSK in zones
        assert ZoneType.TIMELINE in zones
        assert ZoneType.SHELF in zones
    
    def test_evolution_rules_increase_maturity(self, maturity_service):
        """Test that evolution rules suggest improvements"""
        rules = maturity_service.get_evolution_rules(MaturityLevel.SEED)
        
        assert len(rules) > 0
        # Rules should suggest actions to increase maturity
        assert any(r.action for r in rules)
    
    def test_evolution_rules_format(self, maturity_service):
        """Test evolution rules format"""
        for level in MaturityLevel:
            rules = maturity_service.get_evolution_rules(level)
            for rule in rules:
                assert isinstance(rule, EnvironmentEvolutionRule)
                assert rule.action is not None


# =============================================================================
# BLUEPRINT GENERATOR TESTS
# =============================================================================

class TestBlueprintGenerator:
    """Test blueprint generation"""
    
    @pytest.mark.asyncio
    async def test_generate_minimal(self, blueprint_generator, thread_id, minimal_thread_state):
        """Test blueprint generation for minimal thread"""
        maturity = MaturityResult(
            level=MaturityLevel.SEED,
            score=10,
            signals=MaturitySignals(),
            badge="🌱"
        )
        
        blueprint = await blueprint_generator.generate(
            thread_id=thread_id,
            thread_state=minimal_thread_state,
            maturity=maturity,
            viewer_role=ViewerRole.OWNER
        )
        
        assert blueprint is not None
        assert blueprint.thread_id == thread_id
        assert blueprint.template == XRTemplate.PERSONAL_ROOM
        assert len(blueprint.zones) > 0
    
    @pytest.mark.asyncio
    async def test_generate_mature(self, blueprint_generator, thread_id, mature_thread_state):
        """Test blueprint generation for mature thread"""
        maturity = MaturityResult(
            level=MaturityLevel.STUDIO,
            score=70,
            signals=MaturitySignals(
                has_summary=True,
                has_decisions=True,
                action_count=10,
                participant_count=4,
                has_live_segments=True
            ),
            badge="🎬"
        )
        
        blueprint = await blueprint_generator.generate(
            thread_id=thread_id,
            thread_state=mature_thread_state,
            maturity=maturity,
            viewer_role=ViewerRole.OWNER
        )
        
        assert blueprint is not None
        assert blueprint.template == XRTemplate.BUSINESS_ROOM
        
        # Should have multiple zones
        zone_types = [z.type for z in blueprint.zones]
        assert ZoneType.WALL in zone_types
        assert ZoneType.TABLE in zone_types
    
    @pytest.mark.asyncio
    async def test_template_selection_personal(self, blueprint_generator, thread_id, minimal_thread_state):
        """Test personal template selection"""
        minimal_thread_state["thread_type"] = "personal"
        maturity = MaturityResult(level=MaturityLevel.SEED, score=10, signals=MaturitySignals())
        
        blueprint = await blueprint_generator.generate(
            thread_id, minimal_thread_state, maturity
        )
        
        assert blueprint.template == XRTemplate.PERSONAL_ROOM
    
    @pytest.mark.asyncio
    async def test_template_selection_business(self, blueprint_generator, thread_id, mature_thread_state):
        """Test business template selection"""
        mature_thread_state["thread_type"] = "business"
        maturity = MaturityResult(level=MaturityLevel.STUDIO, score=70, signals=MaturitySignals())
        
        blueprint = await blueprint_generator.generate(
            thread_id, mature_thread_state, maturity
        )
        
        assert blueprint.template == XRTemplate.BUSINESS_ROOM
    
    @pytest.mark.asyncio
    async def test_template_selection_research(self, blueprint_generator, thread_id, mature_thread_state):
        """Test lab template selection"""
        mature_thread_state["thread_type"] = "research"
        maturity = MaturityResult(level=MaturityLevel.STUDIO, score=70, signals=MaturitySignals())
        
        blueprint = await blueprint_generator.generate(
            thread_id, mature_thread_state, maturity
        )
        
        assert blueprint.template == XRTemplate.LAB_ROOM
    
    @pytest.mark.asyncio
    async def test_intent_zone_always_present(self, blueprint_generator, thread_id, minimal_thread_state):
        """Test that intent zone is always present"""
        maturity = MaturityResult(level=MaturityLevel.SEED, score=10, signals=MaturitySignals())
        
        blueprint = await blueprint_generator.generate(
            thread_id, minimal_thread_state, maturity
        )
        
        zone_ids = [z.id for z in blueprint.zones]
        assert "zone_intent" in zone_ids
    
    @pytest.mark.asyncio
    async def test_action_zone_has_items(self, blueprint_generator, thread_id, mature_thread_state):
        """Test action zone contains action items"""
        maturity = MaturityResult(
            level=MaturityLevel.STUDIO,
            score=70,
            signals=MaturitySignals(action_count=7)
        )
        
        blueprint = await blueprint_generator.generate(
            thread_id, mature_thread_state, maturity
        )
        
        action_zone = next((z for z in blueprint.zones if z.type == ZoneType.TABLE), None)
        assert action_zone is not None
        assert len(action_zone.items) > 0
    
    @pytest.mark.asyncio
    async def test_portals_generated(self, blueprint_generator, thread_id, mature_thread_state):
        """Test portals are generated for linked threads"""
        maturity = MaturityResult(level=MaturityLevel.STUDIO, score=70, signals=MaturitySignals())
        
        blueprint = await blueprint_generator.generate(
            thread_id, mature_thread_state, maturity
        )
        
        assert len(blueprint.portals) > 0
    
    @pytest.mark.asyncio
    async def test_viewer_role_affects_actions(self, blueprint_generator, thread_id, mature_thread_state):
        """Test that viewer role affects available actions"""
        maturity = MaturityResult(level=MaturityLevel.STUDIO, score=70, signals=MaturitySignals())
        
        # Owner has write actions
        owner_blueprint = await blueprint_generator.generate(
            thread_id, mature_thread_state, maturity, viewer_role=ViewerRole.OWNER
        )
        
        # Viewer has read-only
        viewer_blueprint = await blueprint_generator.generate(
            thread_id, mature_thread_state, maturity, viewer_role=ViewerRole.VIEWER
        )
        
        # Check action zone items
        owner_action_zone = next((z for z in owner_blueprint.zones if z.type == ZoneType.TABLE), None)
        viewer_action_zone = next((z for z in viewer_blueprint.zones if z.type == ZoneType.TABLE), None)
        
        if owner_action_zone and viewer_action_zone:
            owner_item = owner_action_zone.items[0] if owner_action_zone.items else None
            viewer_item = viewer_action_zone.items[0] if viewer_action_zone.items else None
            
            if owner_item and viewer_item:
                # Owner should have more actions
                assert len(owner_item.actions) >= len(viewer_item.actions)


# =============================================================================
# XR RENDERER SERVICE TESTS
# =============================================================================

class TestXRRendererService:
    """Test XR renderer service"""
    
    def test_init(self, xr_renderer_service):
        """Test service initialization"""
        assert xr_renderer_service is not None
        assert xr_renderer_service.maturity_service is not None
        assert xr_renderer_service.blueprint_generator is not None
    
    @pytest.mark.asyncio
    async def test_get_thread_lobby(self, xr_renderer_service, thread_id, minimal_thread_state):
        """Test getting thread lobby data"""
        lobby = await xr_renderer_service.get_thread_lobby(
            thread_id=thread_id,
            thread_state=minimal_thread_state,
            viewer_role=ViewerRole.VIEWER
        )
        
        assert lobby is not None
        assert isinstance(lobby, ThreadLobbyData)
        assert lobby.maturity is not None
        assert lobby.available_modes is not None
    
    @pytest.mark.asyncio
    async def test_preflight_check(self, xr_renderer_service, thread_id, mature_thread_state):
        """Test XR preflight check"""
        preflight = await xr_renderer_service.preflight_xr(
            thread_id=thread_id,
            thread_state=mature_thread_state,
            viewer_role=ViewerRole.OWNER
        )
        
        assert preflight is not None
        assert isinstance(preflight, XRPreflightData)
        assert preflight.xr_supported is not None
    
    @pytest.mark.asyncio
    async def test_get_blueprint(self, xr_renderer_service, thread_id, mature_thread_state):
        """Test getting XR blueprint"""
        blueprint = await xr_renderer_service.get_blueprint(
            thread_id=thread_id,
            thread_state=mature_thread_state,
            viewer_role=ViewerRole.OWNER
        )
        
        assert blueprint is not None
        assert isinstance(blueprint, XRBlueprint)
        assert blueprint.thread_id == thread_id
    
    @pytest.mark.asyncio
    async def test_compute_maturity(self, xr_renderer_service, thread_id, mature_thread_state):
        """Test maturity computation"""
        maturity = await xr_renderer_service.compute_maturity(
            thread_id=thread_id,
            thread_state=mature_thread_state
        )
        
        assert maturity is not None
        assert isinstance(maturity, MaturityResult)
        assert maturity.level is not None
        assert maturity.score >= 0
    
    @pytest.mark.asyncio
    async def test_mode_recommendations(self, xr_renderer_service, minimal_thread_state, mature_thread_state):
        """Test mode recommendations based on maturity"""
        # Minimal thread should recommend chat
        minimal_lobby = await xr_renderer_service.get_thread_lobby(
            thread_id=str(uuid4()),
            thread_state=minimal_thread_state,
            viewer_role=ViewerRole.OWNER
        )
        
        assert ThreadEntryMode.CHAT in minimal_lobby.available_modes
        
        # Mature thread should support XR
        mature_lobby = await xr_renderer_service.get_thread_lobby(
            thread_id=str(uuid4()),
            thread_state=mature_thread_state,
            viewer_role=ViewerRole.OWNER
        )
        
        assert ThreadEntryMode.XR in mature_lobby.available_modes or len(mature_lobby.available_modes) >= 2


# =============================================================================
# XR SCHEMA TESTS
# =============================================================================

class TestXRSchemas:
    """Test XR schema models"""
    
    def test_blueprint_item_creation(self):
        """Test BlueprintItem creation"""
        item = BlueprintItem(
            id="item_1",
            kind=ItemKind.ACTION,
            label="Test action",
            status=ActionStatus.TODO
        )
        
        assert item.id == "item_1"
        assert item.kind == ItemKind.ACTION
        assert item.status == ActionStatus.TODO
    
    def test_blueprint_zone_creation(self):
        """Test BlueprintZone creation"""
        items = [
            BlueprintItem(id="1", kind=ItemKind.ACTION, label="Action 1"),
            BlueprintItem(id="2", kind=ItemKind.ACTION, label="Action 2"),
        ]
        
        zone = BlueprintZone(
            id="zone_actions",
            type=ZoneType.TABLE,
            title="Actions",
            items=items
        )
        
        assert zone.id == "zone_actions"
        assert zone.type == ZoneType.TABLE
        assert len(zone.items) == 2
    
    def test_xr_blueprint_creation(self):
        """Test XRBlueprint creation"""
        zones = [
            BlueprintZone(id="z1", type=ZoneType.WALL, title="Intent"),
        ]
        portals = [
            ThreadPortal(label="Related", thread_id=str(uuid4())),
        ]
        
        blueprint = XRBlueprint(
            thread_id=str(uuid4()),
            template=XRTemplate.PERSONAL_ROOM,
            zones=zones,
            portals=portals
        )
        
        assert blueprint.thread_id is not None
        assert blueprint.template == XRTemplate.PERSONAL_ROOM
        assert len(blueprint.zones) == 1
        assert len(blueprint.portals) == 1
    
    def test_maturity_result_creation(self):
        """Test MaturityResult creation"""
        signals = MaturitySignals(
            has_summary=True,
            has_decisions=True,
            action_count=10
        )
        
        result = MaturityResult(
            level=MaturityLevel.WORKSHOP,
            score=45,
            signals=signals,
            badge="🔧"
        )
        
        assert result.level == MaturityLevel.WORKSHOP
        assert result.score == 45
        assert result.signals.has_summary is True
    
    def test_action_update_payload(self):
        """Test ActionUpdatePayload creation"""
        payload = ActionUpdatePayload(
            action_id="action_1",
            new_status=ActionStatus.DONE
        )
        
        assert payload.action_id == "action_1"
        assert payload.new_status == ActionStatus.DONE
    
    def test_note_add_payload(self):
        """Test NoteAddPayload creation"""
        payload = NoteAddPayload(
            target_item_id="action_1",
            note_content="This is a note"
        )
        
        assert payload.target_item_id == "action_1"
        assert payload.note_content == "This is a note"


# =============================================================================
# XR INTERACTION TESTS
# =============================================================================

class TestXRInteractions:
    """Test XR interaction handling"""
    
    @pytest.mark.asyncio
    async def test_action_status_change(self, xr_renderer_service, thread_id, mature_thread_state):
        """Test changing action status from XR"""
        context = XRInteractionContext(
            thread_id=thread_id,
            user_id=mature_thread_state["owner_id"],
            viewer_role=ViewerRole.OWNER,
            zone_id="zone_actions",
            item_id="a1"
        )
        
        payload = ActionUpdatePayload(
            action_id="a1",
            new_status=ActionStatus.DONE
        )
        
        # This should emit an event, not modify directly
        result = await xr_renderer_service.handle_action_update(
            context=context,
            payload=payload
        )
        
        # Result should indicate event was emitted
        assert result is not None
        assert "event_id" in result or result.get("status") == "pending"
    
    @pytest.mark.asyncio
    async def test_note_addition(self, xr_renderer_service, thread_id, mature_thread_state):
        """Test adding note from XR"""
        context = XRInteractionContext(
            thread_id=thread_id,
            user_id=mature_thread_state["owner_id"],
            viewer_role=ViewerRole.CONTRIBUTOR,
            zone_id="zone_actions",
            item_id="a1"
        )
        
        payload = NoteAddPayload(
            target_item_id="a1",
            note_content="Progress update: 50% complete"
        )
        
        result = await xr_renderer_service.handle_note_add(
            context=context,
            payload=payload
        )
        
        assert result is not None


# =============================================================================
# R&D COMPLIANCE TESTS
# =============================================================================

@pytest.mark.sphere_integrity
class TestRDComplianceRule3:
    """Test Rule #3: Sphere Integrity - XR is projection only"""
    
    def test_blueprint_is_derived(self, mature_thread_state):
        """Test that blueprint is derived from thread state"""
        # Blueprint should reference source data, not be source
        pass
    
    @pytest.mark.asyncio
    async def test_xr_does_not_modify_thread_directly(self, xr_renderer_service, thread_id, mature_thread_state):
        """Test that XR interactions emit events, not modify state"""
        context = XRInteractionContext(
            thread_id=thread_id,
            user_id=mature_thread_state["owner_id"],
            viewer_role=ViewerRole.OWNER,
            zone_id="zone_actions",
            item_id="a1"
        )
        
        payload = ActionUpdatePayload(action_id="a1", new_status=ActionStatus.DONE)
        
        # Should not return modified thread state
        result = await xr_renderer_service.handle_action_update(context, payload)
        
        # Result should be event-based, not state-based
        assert "new_thread_state" not in result


@pytest.mark.human_sovereignty
class TestRDComplianceRule1:
    """Test Rule #1: Human Sovereignty - Write interactions require human gates"""
    
    @pytest.mark.asyncio
    async def test_write_actions_emit_events(self, xr_renderer_service, thread_id, mature_thread_state):
        """Test that write actions emit events for human review"""
        context = XRInteractionContext(
            thread_id=thread_id,
            user_id=mature_thread_state["owner_id"],
            viewer_role=ViewerRole.OWNER,
            zone_id="zone_actions",
            item_id="a1"
        )
        
        payload = ActionCreatePayload(
            title="New action from XR",
            description="Created via spatial interaction"
        )
        
        result = await xr_renderer_service.handle_action_create(context, payload)
        
        # Result should include event or pending status
        assert result is not None


@pytest.mark.traceability
class TestRDComplianceRule6:
    """Test Rule #6: Module Traceability"""
    
    def test_blueprint_has_references(self, mature_thread_state):
        """Test that blueprint includes source references"""
        # References should link back to events/snapshots
        refs = BlueprintReferences(
            events=["evt1", "evt2"],
            snapshots=["snap1"]
        )
        
        assert len(refs.events) > 0
    
    @pytest.mark.asyncio
    async def test_blueprint_items_have_source_ids(self, blueprint_generator, thread_id, mature_thread_state):
        """Test that blueprint items reference source events"""
        maturity = MaturityResult(level=MaturityLevel.STUDIO, score=70, signals=MaturitySignals())
        
        blueprint = await blueprint_generator.generate(
            thread_id, mature_thread_state, maturity
        )
        
        # Check items have source references
        for zone in blueprint.zones:
            for item in zone.items:
                # Items should have source_event_id or source_snapshot_id
                has_source = item.source_event_id is not None or item.source_snapshot_id is not None
                # Not all items need sources (e.g., computed items)
                if item.kind in [ItemKind.DECISION, ItemKind.ACTION]:
                    assert has_source or item.metadata is not None


# =============================================================================
# ENUM TESTS
# =============================================================================

class TestEnums:
    """Test enum values"""
    
    def test_maturity_levels(self):
        """Test maturity level values"""
        assert MaturityLevel.SEED.value == 0
        assert MaturityLevel.SPROUT.value == 1
        assert MaturityLevel.WORKSHOP.value == 2
        assert MaturityLevel.STUDIO.value == 3
        assert MaturityLevel.ORG.value == 4
        assert MaturityLevel.ECOSYSTEM.value == 5
    
    def test_xr_templates(self):
        """Test XR template values"""
        assert XRTemplate.PERSONAL_ROOM.value == "personal_room"
        assert XRTemplate.BUSINESS_ROOM.value == "business_room"
        assert XRTemplate.CAUSE_ROOM.value == "cause_room"
        assert XRTemplate.LAB_ROOM.value == "lab_room"
    
    def test_zone_types(self):
        """Test zone type values"""
        assert ZoneType.WALL.value == "wall"
        assert ZoneType.TABLE.value == "table"
        assert ZoneType.KIOSK.value == "kiosk"
        assert ZoneType.SHELF.value == "shelf"
        assert ZoneType.TIMELINE.value == "timeline"
    
    def test_viewer_roles(self):
        """Test viewer role values"""
        assert ViewerRole.VIEWER.value == "viewer"
        assert ViewerRole.CONTRIBUTOR.value == "contributor"
        assert ViewerRole.ADMIN.value == "admin"
        assert ViewerRole.OWNER.value == "owner"
    
    def test_action_statuses(self):
        """Test action status values"""
        assert ActionStatus.TODO.value == "todo"
        assert ActionStatus.DOING.value == "doing"
        assert ActionStatus.DONE.value == "done"


# =============================================================================
# INTEGRATION TESTS
# =============================================================================

class TestXRIntegration:
    """Integration tests for XR system"""
    
    @pytest.mark.asyncio
    async def test_full_xr_flow(self, xr_renderer_service, mature_thread_state):
        """Test complete XR flow: lobby → preflight → blueprint"""
        thread_id = str(uuid4())
        viewer_role = ViewerRole.OWNER
        
        # 1. Get lobby
        lobby = await xr_renderer_service.get_thread_lobby(
            thread_id=thread_id,
            thread_state=mature_thread_state,
            viewer_role=viewer_role
        )
        assert lobby is not None
        assert lobby.maturity is not None
        
        # 2. Check XR support
        preflight = await xr_renderer_service.preflight_xr(
            thread_id=thread_id,
            thread_state=mature_thread_state,
            viewer_role=viewer_role
        )
        assert preflight is not None
        
        # 3. Get blueprint
        blueprint = await xr_renderer_service.get_blueprint(
            thread_id=thread_id,
            thread_state=mature_thread_state,
            viewer_role=viewer_role
        )
        assert blueprint is not None
        assert len(blueprint.zones) > 0
    
    @pytest.mark.asyncio
    async def test_maturity_affects_xr_complexity(self, xr_renderer_service, minimal_thread_state, mature_thread_state):
        """Test that maturity level affects XR complexity"""
        # Minimal thread
        minimal_blueprint = await xr_renderer_service.get_blueprint(
            thread_id=str(uuid4()),
            thread_state=minimal_thread_state,
            viewer_role=ViewerRole.OWNER
        )
        
        # Mature thread
        mature_blueprint = await xr_renderer_service.get_blueprint(
            thread_id=str(uuid4()),
            thread_state=mature_thread_state,
            viewer_role=ViewerRole.OWNER
        )
        
        # Mature should have more zones
        assert len(mature_blueprint.zones) >= len(minimal_blueprint.zones)
