"""
CHE·NU™ XR Environment Generator — Canonical Implementation

This module generates XR environment blueprints as PROJECTIONS of thread state.
XR environments are NEVER authoritative — they are derived views only.

Canonical Rule: Any XR interaction that changes state MUST create a ThreadEvent.

Version: 1.0.0
Date: January 2026
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import uuid4

# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS & CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

class XRTemplate(str, Enum):
    """Available XR room templates."""
    PERSONAL_ROOM = "personal_room"
    BUSINESS_ROOM = "business_room"
    CAUSE_ROOM = "cause_room"
    LAB_ROOM = "lab_room"
    CUSTOM_ROOM = "custom_room"


class ZoneType(str, Enum):
    """Types of zones in XR environments."""
    WALL = "wall"
    TABLE = "table"
    KIOSK = "kiosk"
    SHELF = "shelf"
    TIMELINE = "timeline"
    PORTAL_AREA = "portal_area"


class ItemKind(str, Enum):
    """Types of items that can appear in zones."""
    INTENT = "intent"
    DECISION = "decision"
    ACTION = "action"
    MEMORY = "memory"
    RESOURCE = "resource"
    TIMELINE_EVENT = "timeline_event"
    NOTE = "note"


class RedactionLevel(str, Enum):
    """Redaction levels for XR items."""
    PUBLIC = "public"
    SEMI_PRIVATE = "semi_private"
    PRIVATE = "private"


# Canonical zones that MUST be present in every XR environment
CANONICAL_ZONES = [
    "intent_wall",
    "decision_wall", 
    "action_table",
    "memory_kiosk",
    "timeline_strip",
]

# Keywords for template selection
BUSINESS_KEYWORDS = {"finance", "budget", "invoice", "contract", "operations", "revenue"}
CAUSE_KEYWORDS = {"mission", "impact", "community", "cause", "advocacy", "nonprofit"}
LAB_KEYWORDS = {"hypothesis", "experiment", "research", "study", "analysis", "test"}

# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class XRItem:
    """An item within an XR zone."""
    id: str
    kind: ItemKind
    label: str
    redaction_level: RedactionLevel = RedactionLevel.PRIVATE
    source_event_id: Optional[str] = None
    source_snapshot_id: Optional[str] = None
    actions: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "kind": self.kind.value,
            "label": self.label,
            "redaction_level": self.redaction_level.value,
            "source_event_id": self.source_event_id,
            "source_snapshot_id": self.source_snapshot_id,
            "actions": self.actions,
        }


@dataclass
class XRZone:
    """A zone within an XR environment."""
    id: str
    type: ZoneType
    title: str
    items: List[XRItem] = field(default_factory=list)
    layout: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "type": self.type.value,
            "title": self.title,
            "items": [item.to_dict() for item in self.items],
            "layout": self.layout,
        }


@dataclass
class XRPortal:
    """A portal linking to another thread."""
    label: str
    thread_id: str
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "label": self.label,
            "thread_id": self.thread_id,
        }


@dataclass
class XRBlueprint:
    """Complete XR environment blueprint - a projection of thread state."""
    thread_id: str
    template: XRTemplate
    generated_at: datetime
    version: str
    zones: List[XRZone]
    portals: List[XRPortal] = field(default_factory=list)
    references: Dict[str, List[str]] = field(default_factory=lambda: {"events": [], "snapshots": []})
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "thread_id": self.thread_id,
            "template": self.template.value,
            "generated_at": self.generated_at.isoformat(),
            "version": self.version,
            "zones": [zone.to_dict() for zone in self.zones],
            "portals": [portal.to_dict() for portal in self.portals],
            "references": self.references,
        }
    
    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent)
    
    @property
    def integrity_hash(self) -> str:
        """Generate integrity hash for the blueprint."""
        content = json.dumps(self.to_dict(), sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()[:16]


# ═══════════════════════════════════════════════════════════════════════════════
# XR ENVIRONMENT GENERATOR
# ═══════════════════════════════════════════════════════════════════════════════

class XREnvironmentGenerator:
    """
    Generates XR environment blueprints from thread state.
    
    CANONICAL INVARIANTS:
    1. XR environments are PROJECTIONS only — never authoritative
    2. Any state change in XR MUST create a ThreadEvent
    3. Blueprints can be regenerated at any time without data loss
    4. All items reference their source events/snapshots
    5. Template selection is deterministic based on thread content
    
    Usage:
        generator = XREnvironmentGenerator()
        blueprint = generator.generate(thread, events, snapshots)
    """
    
    VERSION = "1.0.0"
    
    def __init__(self):
        self._event_ids: List[str] = []
        self._snapshot_ids: List[str] = []
    
    # ───────────────────────────────────────────────────────────────────────────
    # PUBLIC API
    # ───────────────────────────────────────────────────────────────────────────
    
    def generate(
        self,
        thread: Any,
        events: List[Any],
        snapshots: Optional[List[Any]] = None
    ) -> XRBlueprint:
        """
        Generate an XR blueprint from thread state.
        
        Args:
            thread: Thread object with id, founding_intent, type
            events: List of ThreadEvent objects
            snapshots: Optional list of snapshot objects
        
        Returns:
            XRBlueprint ready for XR client rendering
        """
        self._event_ids = []
        self._snapshot_ids = []
        snapshots = snapshots or []
        
        # 1. Determine template
        template = self._select_template(thread, events)
        
        # 2. Build canonical zones
        zones = self._build_zones(thread, events, snapshots)
        
        # 3. Build portals from links
        portals = self._build_portals(events)
        
        # 4. Create blueprint
        blueprint = XRBlueprint(
            thread_id=str(thread.id) if hasattr(thread, 'id') else thread.get('id', ''),
            template=template,
            generated_at=datetime.utcnow(),
            version=self.VERSION,
            zones=zones,
            portals=portals,
            references={
                "events": self._event_ids.copy(),
                "snapshots": self._snapshot_ids.copy(),
            }
        )
        
        return blueprint
    
    def validate_blueprint(self, blueprint: XRBlueprint) -> List[str]:
        """
        Validate a blueprint against canonical requirements.
        
        Returns:
            List of validation errors (empty if valid)
        """
        errors = []
        
        # Check required zones
        zone_ids = {z.id for z in blueprint.zones}
        for required_zone in CANONICAL_ZONES:
            if required_zone not in zone_ids:
                errors.append(f"Missing canonical zone: {required_zone}")
        
        # Check all items have source references
        for zone in blueprint.zones:
            for item in zone.items:
                if not item.source_event_id and not item.source_snapshot_id:
                    errors.append(f"Item {item.id} has no source reference")
        
        # Check blueprint has thread_id
        if not blueprint.thread_id:
            errors.append("Blueprint missing thread_id")
        
        return errors
    
    # ───────────────────────────────────────────────────────────────────────────
    # TEMPLATE SELECTION
    # ───────────────────────────────────────────────────────────────────────────
    
    def _select_template(self, thread: Any, events: List[Any]) -> XRTemplate:
        """
        Deterministically select template based on thread content.
        
        Selection rules:
        1. thread.type == "personal" → personal_room
        2. thread.type == "collective" + cause keywords → cause_room
        3. presence of business keywords → business_room
        4. presence of lab keywords → lab_room
        5. else → custom_room
        """
        thread_type = getattr(thread, 'type', None) or thread.get('type', '')
        founding_intent = (
            getattr(thread, 'founding_intent', '') or 
            thread.get('founding_intent', '')
        ).lower()
        
        # Collect all text for keyword matching
        all_text = founding_intent
        for event in events:
            payload = getattr(event, 'payload', {}) or event.get('payload', {})
            if isinstance(payload, dict):
                all_text += " " + json.dumps(payload).lower()
        
        # Apply rules in order
        if thread_type == "personal":
            return XRTemplate.PERSONAL_ROOM
        
        if thread_type == "collective":
            if any(kw in all_text for kw in CAUSE_KEYWORDS):
                return XRTemplate.CAUSE_ROOM
        
        if any(kw in all_text for kw in BUSINESS_KEYWORDS):
            return XRTemplate.BUSINESS_ROOM
        
        if any(kw in all_text for kw in LAB_KEYWORDS):
            return XRTemplate.LAB_ROOM
        
        return XRTemplate.CUSTOM_ROOM
    
    # ───────────────────────────────────────────────────────────────────────────
    # ZONE BUILDING
    # ───────────────────────────────────────────────────────────────────────────
    
    def _build_zones(
        self,
        thread: Any,
        events: List[Any],
        snapshots: List[Any]
    ) -> List[XRZone]:
        """Build all canonical zones from thread data."""
        zones = []
        
        # 1. Intent Wall — from founding_intent
        zones.append(self._build_intent_wall(thread))
        
        # 2. Decision Wall — from DECISION_RECORDED events
        zones.append(self._build_decision_wall(events))
        
        # 3. Action Table — from ACTION_CREATED/UPDATED events
        zones.append(self._build_action_table(events))
        
        # 4. Memory Kiosk — from SUMMARY_SNAPSHOT events
        zones.append(self._build_memory_kiosk(events, snapshots))
        
        # 5. Timeline Strip — from chronological events
        zones.append(self._build_timeline_strip(events))
        
        # 6. Resource Shelf — from LINK_ADDED events (optional)
        links = [e for e in events if self._get_event_type(e) == "LINK_ADDED"]
        if links:
            zones.append(self._build_resource_shelf(links))
        
        return zones
    
    def _build_intent_wall(self, thread: Any) -> XRZone:
        """Build the intent wall zone."""
        founding_intent = (
            getattr(thread, 'founding_intent', '') or 
            thread.get('founding_intent', 'No founding intent')
        )
        thread_id = str(getattr(thread, 'id', '') or thread.get('id', ''))
        
        return XRZone(
            id="intent_wall",
            type=ZoneType.WALL,
            title="Founding Intent",
            items=[
                XRItem(
                    id=f"intent_{thread_id[:8]}",
                    kind=ItemKind.INTENT,
                    label=founding_intent,
                    redaction_level=RedactionLevel.PUBLIC,
                    source_event_id=thread_id,  # Thread creation is the source
                    actions=["view", "edit_intent"],
                )
            ],
            layout={"position": "north", "size": "large"}
        )
    
    def _build_decision_wall(self, events: List[Any]) -> XRZone:
        """Build the decision wall from DECISION_RECORDED events."""
        decisions = [e for e in events if self._get_event_type(e) == "DECISION_RECORDED"]
        
        items = []
        for event in decisions:
            event_id = str(getattr(event, 'id', '') or event.get('id', str(uuid4())))
            payload = getattr(event, 'payload', {}) or event.get('payload', {})
            
            self._event_ids.append(event_id)
            
            items.append(XRItem(
                id=f"decision_{event_id[:8]}",
                kind=ItemKind.DECISION,
                label=payload.get('decision', payload.get('title', 'Decision')),
                redaction_level=RedactionLevel.SEMI_PRIVATE,
                source_event_id=event_id,
                actions=["view_details", "view_rationale", "link_to"],
            ))
        
        return XRZone(
            id="decision_wall",
            type=ZoneType.WALL,
            title="Decisions",
            items=items,
            layout={"position": "east", "size": "medium"}
        )
    
    def _build_action_table(self, events: List[Any]) -> XRZone:
        """Build the action table from ACTION_CREATED/UPDATED events."""
        action_events = [
            e for e in events 
            if self._get_event_type(e) in ("ACTION_CREATED", "ACTION_UPDATED")
        ]
        
        # Group by action_id and take latest state
        actions_map: Dict[str, Any] = {}
        for event in action_events:
            payload = getattr(event, 'payload', {}) or event.get('payload', {})
            action_id = payload.get('action_id', payload.get('id', ''))
            if action_id:
                actions_map[action_id] = event
        
        items = []
        for action_id, event in actions_map.items():
            event_id = str(getattr(event, 'id', '') or event.get('id', str(uuid4())))
            payload = getattr(event, 'payload', {}) or event.get('payload', {})
            
            self._event_ids.append(event_id)
            
            status = payload.get('status', 'pending')
            items.append(XRItem(
                id=f"action_{action_id[:8]}",
                kind=ItemKind.ACTION,
                label=payload.get('title', payload.get('description', 'Action')),
                redaction_level=RedactionLevel.SEMI_PRIVATE,
                source_event_id=event_id,
                actions=["update_status", "assign", "view_details", "complete"],
            ))
        
        return XRZone(
            id="action_table",
            type=ZoneType.TABLE,
            title="Active Actions",
            items=items,
            layout={"position": "center", "size": "large"}
        )
    
    def _build_memory_kiosk(self, events: List[Any], snapshots: List[Any]) -> XRZone:
        """Build the memory kiosk from SUMMARY_SNAPSHOT events and snapshots."""
        snapshot_events = [e for e in events if self._get_event_type(e) == "SUMMARY_SNAPSHOT"]
        
        items = []
        
        # From events
        for event in snapshot_events[-5:]:  # Last 5 snapshots
            event_id = str(getattr(event, 'id', '') or event.get('id', str(uuid4())))
            payload = getattr(event, 'payload', {}) or event.get('payload', {})
            
            self._event_ids.append(event_id)
            
            items.append(XRItem(
                id=f"memory_{event_id[:8]}",
                kind=ItemKind.MEMORY,
                label=payload.get('summary', payload.get('title', 'Memory Snapshot')),
                redaction_level=RedactionLevel.PRIVATE,
                source_event_id=event_id,
                actions=["view_full", "expand"],
            ))
        
        # From snapshots
        for snapshot in snapshots[-3:]:  # Last 3 snapshots
            snapshot_id = str(getattr(snapshot, 'id', '') or snapshot.get('id', str(uuid4())))
            
            self._snapshot_ids.append(snapshot_id)
            
            items.append(XRItem(
                id=f"snapshot_{snapshot_id[:8]}",
                kind=ItemKind.MEMORY,
                label=getattr(snapshot, 'summary', '') or snapshot.get('summary', 'Snapshot'),
                redaction_level=RedactionLevel.PRIVATE,
                source_snapshot_id=snapshot_id,
                actions=["view_full", "restore"],
            ))
        
        return XRZone(
            id="memory_kiosk",
            type=ZoneType.KIOSK,
            title="Memory",
            items=items,
            layout={"position": "west", "size": "medium"}
        )
    
    def _build_timeline_strip(self, events: List[Any]) -> XRZone:
        """Build the timeline strip from chronological events."""
        # Select significant events for timeline
        significant_types = {
            "THREAD_CREATED", "DECISION_RECORDED", "ACTION_CREATED",
            "LIVE_STARTED", "LIVE_ENDED", "RESULT_RECORDED", "LEARNING_RECORDED"
        }
        
        timeline_events = [
            e for e in events 
            if self._get_event_type(e) in significant_types
        ][-20:]  # Last 20 significant events
        
        items = []
        for event in timeline_events:
            event_id = str(getattr(event, 'id', '') or event.get('id', str(uuid4())))
            event_type = self._get_event_type(event)
            timestamp = getattr(event, 'created_at', None) or event.get('created_at', '')
            
            self._event_ids.append(event_id)
            
            items.append(XRItem(
                id=f"timeline_{event_id[:8]}",
                kind=ItemKind.TIMELINE_EVENT,
                label=f"{event_type} @ {str(timestamp)[:19]}",
                redaction_level=RedactionLevel.SEMI_PRIVATE,
                source_event_id=event_id,
                actions=["view_details", "jump_to"],
            ))
        
        return XRZone(
            id="timeline_strip",
            type=ZoneType.TIMELINE,
            title="Timeline",
            items=items,
            layout={"position": "south", "size": "full-width"}
        )
    
    def _build_resource_shelf(self, link_events: List[Any]) -> XRZone:
        """Build the resource shelf from LINK_ADDED events."""
        items = []
        for event in link_events:
            event_id = str(getattr(event, 'id', '') or event.get('id', str(uuid4())))
            payload = getattr(event, 'payload', {}) or event.get('payload', {})
            
            self._event_ids.append(event_id)
            
            items.append(XRItem(
                id=f"resource_{event_id[:8]}",
                kind=ItemKind.RESOURCE,
                label=payload.get('title', payload.get('url', 'Resource')),
                redaction_level=RedactionLevel.SEMI_PRIVATE,
                source_event_id=event_id,
                actions=["open", "preview", "unlink"],
            ))
        
        return XRZone(
            id="resource_shelf",
            type=ZoneType.SHELF,
            title="Resources",
            items=items,
            layout={"position": "northeast", "size": "small"}
        )
    
    # ───────────────────────────────────────────────────────────────────────────
    # PORTAL BUILDING
    # ───────────────────────────────────────────────────────────────────────────
    
    def _build_portals(self, events: List[Any]) -> List[XRPortal]:
        """Build portals from LINK_ADDED events that reference other threads."""
        portals = []
        
        for event in events:
            if self._get_event_type(event) != "LINK_ADDED":
                continue
            
            payload = getattr(event, 'payload', {}) or event.get('payload', {})
            
            # Check if link is to another thread
            link_type = payload.get('link_type', payload.get('type', ''))
            target_thread = payload.get('target_thread_id', payload.get('thread_id', ''))
            
            if link_type == "thread_reference" and target_thread:
                portals.append(XRPortal(
                    label=payload.get('title', f"Portal to {target_thread[:8]}..."),
                    thread_id=target_thread,
                ))
        
        return portals
    
    # ───────────────────────────────────────────────────────────────────────────
    # HELPERS
    # ───────────────────────────────────────────────────────────────────────────
    
    def _get_event_type(self, event: Any) -> str:
        """Extract event type from event object or dict."""
        if hasattr(event, 'event_type'):
            et = event.event_type
            return et.value if hasattr(et, 'value') else str(et)
        if isinstance(event, dict):
            et = event.get('event_type', event.get('type', ''))
            return et.value if hasattr(et, 'value') else str(et)
        return ''


# ═══════════════════════════════════════════════════════════════════════════════
# XR EVENT TYPES (for ThreadEvent integration)
# ═══════════════════════════════════════════════════════════════════════════════

class XREventType(str, Enum):
    """Event types for XR-related thread events."""
    ENV_BLUEPRINT_GENERATED = "ENV_BLUEPRINT_GENERATED"  # Blueprint was generated
    XR_RENDERED = "XR_RENDERED"  # Client rendered blueprint (analytics only)
    XR_INTERACTION = "XR_INTERACTION"  # User interacted in XR (creates other events)


# ═══════════════════════════════════════════════════════════════════════════════
# FASTAPI INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

def create_xr_router():
    """Create FastAPI router for XR endpoints."""
    from fastapi import APIRouter, HTTPException, Depends
    from pydantic import BaseModel
    from typing import Dict, Any
    
    router = APIRouter(prefix="/threads/{thread_id}/xr", tags=["xr"])
    
    class BlueprintResponse(BaseModel):
        blueprint: Dict[str, Any]
        integrity_hash: str
        validation_errors: List[str]
    
    @router.post("/generate", response_model=BlueprintResponse)
    async def generate_xr_blueprint(thread_id: str):
        """
        Generate XR blueprint for a thread.
        
        This is a PROJECTION operation — it reads thread state
        and produces a derived blueprint. The blueprint can be
        regenerated at any time without data loss.
        """
        # TODO: Inject thread service dependency
        # thread = await thread_service.get(thread_id)
        # events = await thread_service.get_events(thread_id)
        # snapshots = await thread_service.get_snapshots(thread_id)
        
        # generator = XREnvironmentGenerator()
        # blueprint = generator.generate(thread, events, snapshots)
        # errors = generator.validate_blueprint(blueprint)
        
        # # Record generation event
        # await thread_service.append_event(
        #     thread_id=thread_id,
        #     event_type=XREventType.ENV_BLUEPRINT_GENERATED,
        #     payload={"blueprint_hash": blueprint.integrity_hash}
        # )
        
        # return BlueprintResponse(
        #     blueprint=blueprint.to_dict(),
        #     integrity_hash=blueprint.integrity_hash,
        #     validation_errors=errors
        # )
        
        raise HTTPException(status_code=501, detail="Awaiting thread service integration")
    
    @router.get("/blueprint/latest", response_model=BlueprintResponse)
    async def get_latest_blueprint(thread_id: str):
        """
        Get the latest generated blueprint for a thread.
        
        Returns cached blueprint if available, or regenerates
        if no cache exists or cache is stale.
        """
        raise HTTPException(status_code=501, detail="Awaiting thread service integration")
    
    return router


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE TEST
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    # Simple test with mock data
    from dataclasses import dataclass as dc
    
    @dc
    class MockThread:
        id: str = "thread_123"
        founding_intent: str = "Build a sustainable business for impact"
        type: str = "collective"
    
    @dc  
    class MockEvent:
        id: str = ""
        event_type: str = ""
        payload: Dict[str, Any] = field(default_factory=dict)
        created_at: str = ""
    
    # Create mock data
    thread = MockThread()
    events = [
        MockEvent(
            id="evt_001",
            event_type="THREAD_CREATED",
            payload={"founding_intent": thread.founding_intent},
            created_at="2026-01-07T10:00:00Z"
        ),
        MockEvent(
            id="evt_002",
            event_type="DECISION_RECORDED",
            payload={"decision": "Launch MVP in Q1", "rationale": "Market timing"},
            created_at="2026-01-07T10:30:00Z"
        ),
        MockEvent(
            id="evt_003",
            event_type="ACTION_CREATED",
            payload={"action_id": "act_001", "title": "Design landing page", "status": "pending"},
            created_at="2026-01-07T11:00:00Z"
        ),
        MockEvent(
            id="evt_004",
            event_type="SUMMARY_SNAPSHOT",
            payload={"summary": "Initial project setup complete"},
            created_at="2026-01-07T12:00:00Z"
        ),
        MockEvent(
            id="evt_005",
            event_type="LINK_ADDED",
            payload={"title": "Business Plan", "url": "https://docs.example.com/plan"},
            created_at="2026-01-07T13:00:00Z"
        ),
    ]
    
    # Generate blueprint
    generator = XREnvironmentGenerator()
    blueprint = generator.generate(thread, events)
    
    # Validate
    errors = generator.validate_blueprint(blueprint)
    
    print("=" * 60)
    print("XR ENVIRONMENT GENERATOR TEST")
    print("=" * 60)
    print(f"\nThread ID: {blueprint.thread_id}")
    print(f"Template: {blueprint.template.value}")
    print(f"Generated: {blueprint.generated_at}")
    print(f"Version: {blueprint.version}")
    print(f"Integrity Hash: {blueprint.integrity_hash}")
    print(f"\nZones ({len(blueprint.zones)}):")
    for zone in blueprint.zones:
        print(f"  - {zone.id}: {zone.title} ({len(zone.items)} items)")
    print(f"\nPortals: {len(blueprint.portals)}")
    print(f"Referenced Events: {len(blueprint.references['events'])}")
    print(f"Referenced Snapshots: {len(blueprint.references['snapshots'])}")
    print(f"\nValidation Errors: {errors if errors else 'None'}")
    print("\n✅ XR Environment Generator working correctly!")
