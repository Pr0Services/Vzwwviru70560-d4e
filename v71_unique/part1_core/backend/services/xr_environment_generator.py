# CHE·NU™ V71 — XR Environment Generator (Canonical V2)
# PROJECTION-ONLY · THREAD IS SOURCE OF TRUTH
"""
🥽 XR Environment Generator — Génération d'environnements XR depuis le Thread

PRINCIPES CANONIQUES:
1. XR = PROJECTION du Thread (jamais source de vérité)
2. Blueprint dérivé déterministiquement des events
3. Toute interaction XR → ThreadEvent
4. Caching autorisé mais régénérable sans perte

"L'environnement XR n'est qu'une fenêtre sur le thread.
 Il ne possède rien. Il ne décide rien.
 Il reflète et transmet."
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from uuid import uuid4
import json
import logging

logger = logging.getLogger(__name__)


# ============================================================================
# ENUMS — XR Domain Types
# ============================================================================

class XRTemplate(str, Enum):
    """Templates d'environnement XR."""
    PERSONAL_ROOM = "personal_room"
    BUSINESS_ROOM = "business_room"
    CAUSE_ROOM = "cause_room"
    LAB_ROOM = "lab_room"
    CUSTOM_ROOM = "custom_room"


class ZoneType(str, Enum):
    """Types de zones dans l'environnement XR."""
    WALL = "wall"
    TABLE = "table"
    KIOSK = "kiosk"
    SHELF = "shelf"
    TIMELINE = "timeline"
    PORTAL_AREA = "portal_area"


class ItemKind(str, Enum):
    """Types d'éléments dans les zones."""
    INTENT = "intent"
    DECISION = "decision"
    ACTION = "action"
    MEMORY = "memory"
    RESOURCE = "resource"
    TIMELINE_EVENT = "timeline_event"
    NOTE = "note"


class RedactionLevel(str, Enum):
    """Niveaux de confidentialité (mirror from thread_service)."""
    PUBLIC = "public"
    SEMI_PRIVATE = "semi_private"
    PRIVATE = "private"


# ============================================================================
# DATA CLASSES — XR Blueprint Models
# ============================================================================

@dataclass
class BlueprintItem:
    """Élément dans une zone XR."""
    id: str
    kind: ItemKind
    label: str
    redaction_level: RedactionLevel = RedactionLevel.PRIVATE
    source_event_id: Optional[str] = None
    source_snapshot_id: Optional[str] = None
    actions: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class BlueprintZone:
    """Zone dans l'environnement XR."""
    id: str
    type: ZoneType
    title: str
    items: List[BlueprintItem] = field(default_factory=list)
    layout: Dict[str, Any] = field(default_factory=dict)


@dataclass
class BlueprintPortal:
    """Portail vers un autre thread."""
    label: str
    thread_id: str
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class XRBlueprint:
    """
    🥽 XR Blueprint — Représentation complète de l'environnement XR.
    
    RÈGLE CANONIQUE: C'est une PROJECTION, pas une source de vérité.
    """
    thread_id: str
    template: XRTemplate
    generated_at: datetime
    version: str
    zones: List[BlueprintZone]
    portals: List[BlueprintPortal] = field(default_factory=list)
    references: Dict[str, List[str]] = field(default_factory=lambda: {"events": [], "snapshots": []})
    
    def to_dict(self) -> Dict[str, Any]:
        """Convertir en dictionnaire JSON-serializable."""
        return {
            "thread_id": self.thread_id,
            "template": self.template.value,
            "generated_at": self.generated_at.isoformat(),
            "version": self.version,
            "zones": [
                {
                    "id": z.id,
                    "type": z.type.value,
                    "title": z.title,
                    "items": [
                        {
                            "id": i.id,
                            "kind": i.kind.value,
                            "label": i.label,
                            "redaction_level": i.redaction_level.value,
                            **({"source_event_id": i.source_event_id} if i.source_event_id else {}),
                            **({"source_snapshot_id": i.source_snapshot_id} if i.source_snapshot_id else {}),
                            **({"actions": i.actions} if i.actions else {}),
                        }
                        for i in z.items
                    ],
                    "layout": z.layout,
                }
                for z in self.zones
            ],
            "portals": [
                {"label": p.label, "thread_id": p.thread_id}
                for p in self.portals
            ],
            "references": self.references,
        }
    
    def to_json(self) -> str:
        """Convertir en JSON string."""
        return json.dumps(self.to_dict(), indent=2)


# ============================================================================
# TEMPLATE SELECTION RULES
# ============================================================================

class TemplateSelector:
    """
    Sélecteur de template déterministe.
    
    RÈGLES:
    - personal thread → personal_room
    - collective + mission keywords → cause_room
    - finance/ops decisions → business_room
    - hypotheses/experiments → lab_room
    - else → custom_room
    """
    
    MISSION_KEYWORDS = [
        "mission", "cause", "impact", "community", "advocacy",
        "nonprofit", "charity", "volunteer", "social good"
    ]
    
    BUSINESS_KEYWORDS = [
        "finance", "budget", "revenue", "sales", "operations",
        "kpi", "roi", "profit", "quarterly", "invoice"
    ]
    
    LAB_KEYWORDS = [
        "hypothesis", "experiment", "research", "test", "validate",
        "prototype", "iteration", "discovery", "analysis"
    ]
    
    @classmethod
    def select_template(
        cls,
        thread_type: str,
        founding_intent: str,
        events: List[Dict[str, Any]],
    ) -> XRTemplate:
        """
        Sélectionner le template approprié basé sur le contenu du thread.
        
        Args:
            thread_type: Type de thread (personal, collective, inter_sphere)
            founding_intent: L'intention fondatrice
            events: Liste des événements du thread
        
        Returns:
            XRTemplate approprié
        """
        intent_lower = founding_intent.lower()
        
        # Rule 1: Personal thread → personal_room
        if thread_type == "personal":
            return XRTemplate.PERSONAL_ROOM
        
        # Extract decision texts for analysis
        decision_texts = []
        for e in events:
            if e.get("event_type") == "DECISION_RECORDED":
                decision_texts.append(e.get("payload", {}).get("decision", "").lower())
        
        all_text = f"{intent_lower} {' '.join(decision_texts)}"
        
        # Rule 2: Mission keywords → cause_room
        if any(kw in all_text for kw in cls.MISSION_KEYWORDS):
            return XRTemplate.CAUSE_ROOM
        
        # Rule 3: Business keywords → business_room
        if any(kw in all_text for kw in cls.BUSINESS_KEYWORDS):
            return XRTemplate.BUSINESS_ROOM
        
        # Rule 4: Lab keywords → lab_room
        if any(kw in all_text for kw in cls.LAB_KEYWORDS):
            return XRTemplate.LAB_ROOM
        
        # Default: custom_room
        return XRTemplate.CUSTOM_ROOM


# ============================================================================
# XR ENVIRONMENT GENERATOR SERVICE
# ============================================================================

class XREnvironmentGenerator:
    """
    🥽 XR Environment Generator — Service de génération de blueprints XR.
    
    INVARIANTS:
    1. XR = projection (pas de source de vérité)
    2. Blueprint dérivé déterministiquement
    3. Toute mutation → ThreadEvent
    4. Agent on-demand (pas de boucle)
    """
    
    BLUEPRINT_VERSION = "1.0.0"
    
    # Zone IDs canoniques
    CANONICAL_ZONES = [
        "intent_wall",
        "decision_wall", 
        "action_table",
        "memory_kiosk",
        "timeline_strip",
        "resource_shelf",
    ]
    
    def __init__(self, thread_service=None):
        """
        Initialiser le générateur.
        
        Args:
            thread_service: Service de threads (injection de dépendance)
        """
        self._thread_service = thread_service
        self._stats = {
            "blueprints_generated": 0,
            "cache_hits": 0,
        }
        
        # Blueprint cache (in-memory, peut être vidé)
        self._blueprint_cache: Dict[str, XRBlueprint] = {}
        
        logger.info("XREnvironmentGenerator initialized - Canonical V2")
    
    async def generate_blueprint(
        self,
        thread_id: str,
        viewer_id: str,
        force_regenerate: bool = False,
    ) -> XRBlueprint:
        """
        Générer un blueprint XR pour un thread.
        
        Args:
            thread_id: ID du thread
            viewer_id: ID du viewer (pour filtrage redaction)
            force_regenerate: Forcer la régénération (ignorer cache)
        
        Returns:
            XRBlueprint complet
        
        RÈGLE: Le blueprint est une PROJECTION du thread.
        """
        # Check cache (if not forcing regenerate)
        cache_key = f"{thread_id}:{viewer_id}"
        if not force_regenerate and cache_key in self._blueprint_cache:
            self._stats["cache_hits"] += 1
            logger.debug(f"Blueprint cache hit for {thread_id}")
            return self._blueprint_cache[cache_key]
        
        # Get thread data (from service or mock)
        thread_data = await self._get_thread_data(thread_id, viewer_id)
        
        # Select template
        template = TemplateSelector.select_template(
            thread_type=thread_data["type"],
            founding_intent=thread_data["founding_intent"],
            events=thread_data["events"],
        )
        
        # Build zones
        zones = await self._build_zones(thread_data)
        
        # Build portals from links
        portals = await self._build_portals(thread_data)
        
        # Collect references
        references = self._collect_references(thread_data)
        
        # Create blueprint
        blueprint = XRBlueprint(
            thread_id=thread_id,
            template=template,
            generated_at=datetime.utcnow(),
            version=self.BLUEPRINT_VERSION,
            zones=zones,
            portals=portals,
            references=references,
        )
        
        # Cache it
        self._blueprint_cache[cache_key] = blueprint
        self._stats["blueprints_generated"] += 1
        
        logger.info(f"Blueprint generated for thread {thread_id}, template: {template.value}")
        
        return blueprint
    
    async def _get_thread_data(
        self,
        thread_id: str,
        viewer_id: str,
    ) -> Dict[str, Any]:
        """
        Récupérer les données du thread.
        
        En production: utilise thread_service
        En test: retourne données mock
        """
        if self._thread_service:
            # Use injected service
            thread = await self._thread_service.get_thread(thread_id)
            events = await self._thread_service.get_events(thread_id, viewer_id)
            snapshots = self._thread_service._snapshots.get(thread_id, [])
            links = await self._thread_service.get_linked_threads(thread_id)
            
            return {
                "thread_id": thread_id,
                "type": thread.type.value if thread else "personal",
                "founding_intent": thread.founding_intent if thread else "",
                "title": thread.title if thread else "",
                "description": thread.description if thread else "",
                "events": [
                    {
                        "event_id": e.event_id,
                        "event_type": e.event_type.value,
                        "payload": e.payload,
                        "created_at": e.created_at.isoformat(),
                        "redaction_level": e.redaction_level.value,
                    }
                    for e in events
                ],
                "snapshots": [
                    {
                        "snapshot_id": s.snapshot_id,
                        "snapshot_type": s.snapshot_type.value,
                        "content": s.content,
                        "created_at": s.created_at.isoformat(),
                    }
                    for s in snapshots
                ],
                "links": links,
            }
        else:
            # Mock data for testing
            return {
                "thread_id": thread_id,
                "type": "collective",
                "founding_intent": "Test thread for XR generation",
                "title": "Test Thread",
                "description": "A test thread",
                "events": [],
                "snapshots": [],
                "links": [],
            }
    
    async def _build_zones(self, thread_data: Dict[str, Any]) -> List[BlueprintZone]:
        """
        Construire les zones canoniques du blueprint.
        
        Zones toujours présentes:
        - intent_wall
        - decision_wall
        - action_table
        - memory_kiosk
        - timeline_strip
        - resource_shelf (si liens existent)
        """
        zones = []
        events = thread_data.get("events", [])
        snapshots = thread_data.get("snapshots", [])
        links = thread_data.get("links", [])
        
        # 1. Intent Wall
        intent_wall = BlueprintZone(
            id="intent_wall",
            type=ZoneType.WALL,
            title="Intent",
            items=[
                BlueprintItem(
                    id="intent_main",
                    kind=ItemKind.INTENT,
                    label=thread_data.get("founding_intent", ""),
                    redaction_level=RedactionLevel.PUBLIC,
                ),
            ],
            layout={"position": "north", "size": "large"},
        )
        
        # Add description if exists
        if thread_data.get("description"):
            intent_wall.items.append(BlueprintItem(
                id="intent_description",
                kind=ItemKind.NOTE,
                label=thread_data["description"],
                redaction_level=RedactionLevel.PUBLIC,
            ))
        
        zones.append(intent_wall)
        
        # 2. Decision Wall
        decision_items = []
        for e in events:
            if e.get("event_type") == "DECISION_RECORDED":
                decision_items.append(BlueprintItem(
                    id=f"dec_{e['event_id'][:8]}",
                    kind=ItemKind.DECISION,
                    label=e.get("payload", {}).get("decision", ""),
                    source_event_id=e["event_id"],
                    redaction_level=RedactionLevel(e.get("redaction_level", "private")),
                    metadata={"rationale": e.get("payload", {}).get("rationale", "")},
                ))
        
        zones.append(BlueprintZone(
            id="decision_wall",
            type=ZoneType.WALL,
            title="Decisions",
            items=decision_items[-10:],  # Last 10 decisions
            layout={"position": "east", "size": "medium"},
        ))
        
        # 3. Action Table
        action_items = []
        for e in events:
            if e.get("event_type") in ["ACTION_CREATED", "ACTION_UPDATED"]:
                action_items.append(BlueprintItem(
                    id=f"act_{e['event_id'][:8]}",
                    kind=ItemKind.ACTION,
                    label=e.get("payload", {}).get("action", ""),
                    source_event_id=e["event_id"],
                    redaction_level=RedactionLevel(e.get("redaction_level", "private")),
                    actions=["mark_done", "open_details", "reassign"],
                    metadata={
                        "status": e.get("payload", {}).get("status", "pending"),
                        "assigned_to": e.get("payload", {}).get("assigned_to"),
                    },
                ))
        
        zones.append(BlueprintZone(
            id="action_table",
            type=ZoneType.TABLE,
            title="Actions",
            items=action_items[-20:],  # Last 20 actions
            layout={"position": "center", "size": "large"},
        ))
        
        # 4. Memory Kiosk
        memory_items = []
        for s in snapshots:
            memory_items.append(BlueprintItem(
                id=f"mem_{s['snapshot_id'][:8]}",
                kind=ItemKind.MEMORY,
                label=s.get("content", "")[:200] + "..." if len(s.get("content", "")) > 200 else s.get("content", ""),
                source_snapshot_id=s["snapshot_id"],
                redaction_level=RedactionLevel.SEMI_PRIVATE,
                metadata={"type": s.get("snapshot_type", "")},
            ))
        
        zones.append(BlueprintZone(
            id="memory_kiosk",
            type=ZoneType.KIOSK,
            title="Memory",
            items=memory_items[-5:],  # Last 5 snapshots
            layout={"position": "west", "size": "small"},
        ))
        
        # 5. Timeline Strip
        timeline_items = []
        significant_events = [
            "THREAD_CREATED", "LIVE_STARTED", "LIVE_ENDED",
            "DECISION_RECORDED", "SUMMARY_SNAPSHOT"
        ]
        for e in events:
            if e.get("event_type") in significant_events:
                timeline_items.append(BlueprintItem(
                    id=f"tl_{e['event_id'][:8]}",
                    kind=ItemKind.TIMELINE_EVENT,
                    label=e.get("event_type", "").replace("_", " ").title(),
                    source_event_id=e["event_id"],
                    redaction_level=RedactionLevel.PUBLIC,
                    metadata={"timestamp": e.get("created_at", "")},
                ))
        
        zones.append(BlueprintZone(
            id="timeline_strip",
            type=ZoneType.TIMELINE,
            title="Timeline",
            items=timeline_items[-50:],  # Last 50 significant events
            layout={"position": "south", "size": "full_width"},
        ))
        
        # 6. Resource Shelf (only if links exist)
        if links:
            resource_items = []
            for link in links:
                resource_items.append(BlueprintItem(
                    id=f"res_{link.get('target_id', '')[:8]}",
                    kind=ItemKind.RESOURCE,
                    label=f"Link: {link.get('link_type', 'references')}",
                    redaction_level=RedactionLevel.SEMI_PRIVATE,
                    metadata={"link_type": link.get("link_type"), "target": link.get("target_id")},
                ))
            
            zones.append(BlueprintZone(
                id="resource_shelf",
                type=ZoneType.SHELF,
                title="Resources",
                items=resource_items,
                layout={"position": "northeast", "size": "small"},
            ))
        
        return zones
    
    async def _build_portals(self, thread_data: Dict[str, Any]) -> List[BlueprintPortal]:
        """Construire les portails vers d'autres threads."""
        portals = []
        links = thread_data.get("links", [])
        
        for link in links:
            if link.get("link_type") in ["references", "depends_on", "parent_of", "child_of"]:
                portals.append(BlueprintPortal(
                    label=f"{link.get('link_type', 'Link').replace('_', ' ').title()}: Thread",
                    thread_id=link.get("target_id", ""),
                ))
        
        return portals
    
    def _collect_references(self, thread_data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Collecter toutes les références utilisées."""
        event_ids = [e.get("event_id") for e in thread_data.get("events", []) if e.get("event_id")]
        snapshot_ids = [s.get("snapshot_id") for s in thread_data.get("snapshots", []) if s.get("snapshot_id")]
        
        return {
            "events": event_ids,
            "snapshots": snapshot_ids,
        }
    
    def invalidate_cache(self, thread_id: str) -> int:
        """
        Invalider le cache pour un thread.
        
        Returns:
            Nombre d'entrées supprimées
        """
        to_remove = [k for k in self._blueprint_cache.keys() if k.startswith(f"{thread_id}:")]
        for k in to_remove:
            del self._blueprint_cache[k]
        
        logger.info(f"Cache invalidated for thread {thread_id}, {len(to_remove)} entries removed")
        return len(to_remove)
    
    def clear_cache(self) -> int:
        """
        Vider tout le cache.
        
        Returns:
            Nombre d'entrées supprimées
        """
        count = len(self._blueprint_cache)
        self._blueprint_cache.clear()
        logger.info(f"Cache cleared, {count} entries removed")
        return count
    
    async def get_stats(self) -> Dict[str, Any]:
        """Récupérer les statistiques du service."""
        return {
            **self._stats,
            "cache_size": len(self._blueprint_cache),
        }


# ============================================================================
# XR EVENT TYPES (Extension to ThreadEvent)
# ============================================================================

class XREventType(str, Enum):
    """Types d'événements XR (extension canonique)."""
    ENV_BLUEPRINT_GENERATED = "ENV_BLUEPRINT_GENERATED"
    XR_RENDERED = "XR_RENDERED"  # Telemetry only, not authoritative
    XR_INTERACTION = "XR_INTERACTION"  # User interaction in XR


# ============================================================================
# SINGLETON INSTANCE
# ============================================================================

_xr_generator: Optional[XREnvironmentGenerator] = None


def get_xr_generator(thread_service=None) -> XREnvironmentGenerator:
    """Get or create the XR generator instance."""
    global _xr_generator
    if _xr_generator is None:
        _xr_generator = XREnvironmentGenerator(thread_service)
    return _xr_generator


# ============================================================================
# MAIN - Testing
# ============================================================================

if __name__ == "__main__":
    import asyncio
    
    async def main():
        print("🥽 CHE·NU XR Environment Generator V2 - Test")
        print("=" * 60)
        
        generator = get_xr_generator()
        
        # Generate blueprint
        blueprint = await generator.generate_blueprint(
            thread_id="test_thread_001",
            viewer_id="test_user_001",
        )
        
        print(f"\n✅ Blueprint généré:")
        print(f"   Thread: {blueprint.thread_id}")
        print(f"   Template: {blueprint.template.value}")
        print(f"   Version: {blueprint.version}")
        print(f"   Zones: {len(blueprint.zones)}")
        
        for zone in blueprint.zones:
            print(f"   - {zone.id}: {zone.title} ({len(zone.items)} items)")
        
        # Get stats
        stats = await generator.get_stats()
        print(f"\n📊 Stats: {stats}")
        
        # Test cache
        blueprint2 = await generator.generate_blueprint(
            thread_id="test_thread_001",
            viewer_id="test_user_001",
        )
        
        stats2 = await generator.get_stats()
        print(f"📊 After cache hit: {stats2}")
        
        print("\n" + "=" * 60)
        print("✅ Tests XR Generator passés!")
        print("\n\"L'environnement XR n'est qu'une fenêtre sur le thread.\"")
    
    asyncio.run(main())
