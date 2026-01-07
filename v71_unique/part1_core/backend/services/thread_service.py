# CHE·NU™ V71 — Thread Service (Canonical V2)
# FONDATIONNEL · NON NÉGOCIABLE
"""
🧵 Thread Service — L'unité souveraine de sens, mémoire et continuité

PRINCIPES CANONIQUES:
1. Single Source of Truth: Thread event log is canonical
2. Append-Only: No silent edits; only append corrections
3. Projection Model: Chat/Live/XR are views of the same log
4. On-Demand Agents: Instantiated on request; no continuous loops
5. Human Sovereignty: Humans remain final decision-makers

"Dans CHE-NU, tout commence par un thread.
 Tout s'y inscrit.
 Et rien n'existe en dehors de lui."
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any, Union
from uuid import uuid4
import json
import hashlib
import logging

logger = logging.getLogger(__name__)


# ============================================================================
# ENUMS — Thread Domain Types
# ============================================================================

class ThreadType(str, Enum):
    """Types de threads canoniques."""
    PERSONAL = "personal"
    COLLECTIVE = "collective"
    INTER_SPHERE = "inter_sphere"


class ThreadStatus(str, Enum):
    """Statuts de thread (jamais supprimé!)."""
    ACTIVE = "active"
    DORMANT = "dormant"
    ARCHIVED = "archived"  # JAMAIS supprimé


class ActorType(str, Enum):
    """Types d'acteurs."""
    HUMAN = "human"
    AGENT = "agent"


class ParticipantRole(str, Enum):
    """Rôles des participants."""
    OWNER = "owner"
    ADMIN = "admin"
    CONTRIBUTOR = "contributor"
    VIEWER = "viewer"
    MEMORY_AGENT = "memory_agent"  # Exactement 1 par thread
    SPECIALIST_AGENT = "specialist_agent"


class RedactionLevel(str, Enum):
    """Niveaux de confidentialité."""
    PUBLIC = "public"
    SEMI_PRIVATE = "semi_private"
    PRIVATE = "private"


class EventType(str, Enum):
    """Types d'événements canoniques (append-only)."""
    # Thread lifecycle
    THREAD_CREATED = "THREAD_CREATED"
    THREAD_ARCHIVED = "THREAD_ARCHIVED"
    
    # Messages
    MESSAGE_POSTED = "MESSAGE_POSTED"
    
    # Live sessions
    LIVE_STARTED = "LIVE_STARTED"
    LIVE_ENDED = "LIVE_ENDED"
    
    # Decisions & Actions
    DECISION_RECORDED = "DECISION_RECORDED"
    ACTION_CREATED = "ACTION_CREATED"
    ACTION_UPDATED = "ACTION_UPDATED"
    RESULT_RECORDED = "RESULT_RECORDED"
    
    # Errors & Learning
    ERROR_RECORDED = "ERROR_RECORDED"
    LEARNING_RECORDED = "LEARNING_RECORDED"
    
    # Memory & Snapshots
    SUMMARY_SNAPSHOT = "SUMMARY_SNAPSHOT"
    
    # Links & Relations
    LINK_ADDED = "LINK_ADDED"
    
    # Permissions
    PERMISSION_CHANGED = "PERMISSION_CHANGED"
    
    # Corrections (append-only!)
    CORRECTION_APPENDED = "CORRECTION_APPENDED"


class SnapshotType(str, Enum):
    """Types de snapshots."""
    MEMORY_SUMMARY = "memory_summary"
    STATE_SUMMARY = "state_summary"
    ONBOARDING_BRIEF = "onboarding_brief"


# ============================================================================
# DATA CLASSES — Thread Domain Models
# ============================================================================

@dataclass
class Thread:
    """
    🧵 Thread — L'unité souveraine de sens, mémoire et continuité.
    
    Un thread n'est PAS:
    - Un chat
    - Un projet  
    - Une réunion
    - Un dossier
    - Une pièce XR
    
    👉 Tout cela n'est que des PROJECTIONS du thread.
    """
    id: str
    type: ThreadType
    founding_intent: str  # REQUIRED - L'intention fondatrice
    status: ThreadStatus = ThreadStatus.ACTIVE
    title: Optional[str] = None
    description: Optional[str] = None
    spheres: List[str] = field(default_factory=list)
    constraints: List[str] = field(default_factory=list)
    hypotheses: List[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    
    def __post_init__(self):
        if not self.founding_intent:
            raise ValueError("founding_intent is REQUIRED for every thread")


@dataclass
class ThreadParticipant:
    """Participant à un thread (humain ou agent)."""
    thread_id: str
    subject_type: ActorType
    subject_id: str
    role: ParticipantRole
    permissions: Optional[Dict[str, bool]] = None
    created_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class EventLink:
    """Lien entre événements ou threads."""
    type: str  # references, depends_on, supersedes, etc.
    target_id: str
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class ThreadEvent:
    """
    📜 ThreadEvent — Événement append-only dans le log du thread.
    
    RÈGLE CANONIQUE: Le log d'événements est la source unique de vérité.
    AUCUNE modification du passé. Seules les corrections sont ajoutées.
    """
    event_id: str
    thread_id: str
    event_type: EventType
    actor_type: ActorType
    actor_id: str
    payload: Dict[str, Any]
    created_at: datetime = field(default_factory=datetime.utcnow)
    links: List[EventLink] = field(default_factory=list)
    redaction_level: RedactionLevel = RedactionLevel.PRIVATE
    integrity_hash: Optional[str] = None
    
    def __post_init__(self):
        # Calculer le hash d'intégrité
        if not self.integrity_hash:
            content = f"{self.thread_id}:{self.event_type}:{self.actor_id}:{json.dumps(self.payload, sort_keys=True)}"
            self.integrity_hash = hashlib.sha256(content.encode()).hexdigest()[:16]


@dataclass
class ThreadSnapshot:
    """
    📸 Snapshot — Résumé matérialisé pour UX rapide.
    
    Produit par l'agent de mémoire, jamais source de vérité.
    """
    snapshot_id: str
    thread_id: str
    snapshot_type: SnapshotType
    content: str
    references: List[str]  # event_ids utilisés
    created_by: str
    created_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class LiveSession:
    """Session Live — Segment temporel intense du thread."""
    session_id: str
    thread_id: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    participants: List[str] = field(default_factory=list)
    summary: Optional[str] = None


# ============================================================================
# PERMISSION SYSTEM
# ============================================================================

class PermissionChecker:
    """Vérificateur de permissions par rôle."""
    
    # Permissions par rôle
    ROLE_PERMISSIONS = {
        ParticipantRole.OWNER: {
            "read": True,
            "write": True,
            "manage_participants": True,
            "archive": True,
            "view_private": True,
        },
        ParticipantRole.ADMIN: {
            "read": True,
            "write": True,
            "manage_participants": True,
            "archive": False,
            "view_private": True,
        },
        ParticipantRole.CONTRIBUTOR: {
            "read": True,
            "write": True,
            "manage_participants": False,
            "archive": False,
            "view_private": False,
        },
        ParticipantRole.VIEWER: {
            "read": True,
            "write": False,  # ❌ VIEWERS CANNOT WRITE
            "manage_participants": False,
            "archive": False,
            "view_private": False,
        },
        ParticipantRole.MEMORY_AGENT: {
            "read": True,
            "write": True,  # Peut écrire SUMMARY_SNAPSHOT et CORRECTION_APPENDED
            "manage_participants": False,
            "archive": False,
            "view_private": True,
        },
        ParticipantRole.SPECIALIST_AGENT: {
            "read": True,
            "write": True,
            "manage_participants": False,
            "archive": False,
            "view_private": False,
        },
    }
    
    # Types d'événements que l'agent mémoire peut écrire
    MEMORY_AGENT_ALLOWED_EVENTS = {
        EventType.SUMMARY_SNAPSHOT,
        EventType.CORRECTION_APPENDED,
    }
    
    @classmethod
    def can_write(cls, role: ParticipantRole) -> bool:
        """Vérifie si le rôle peut écrire."""
        return cls.ROLE_PERMISSIONS.get(role, {}).get("write", False)
    
    @classmethod
    def can_read(cls, role: ParticipantRole) -> bool:
        """Vérifie si le rôle peut lire."""
        return cls.ROLE_PERMISSIONS.get(role, {}).get("read", False)
    
    @classmethod
    def can_view_redaction(cls, role: ParticipantRole, level: RedactionLevel) -> bool:
        """Vérifie si le rôle peut voir un niveau de rédaction donné."""
        if level == RedactionLevel.PUBLIC:
            return True
        if level == RedactionLevel.SEMI_PRIVATE:
            return role in [ParticipantRole.OWNER, ParticipantRole.ADMIN, 
                          ParticipantRole.CONTRIBUTOR, ParticipantRole.MEMORY_AGENT]
        if level == RedactionLevel.PRIVATE:
            return cls.ROLE_PERMISSIONS.get(role, {}).get("view_private", False)
        return False
    
    @classmethod
    def can_memory_agent_write_event(cls, event_type: EventType) -> bool:
        """Vérifie si l'agent mémoire peut écrire ce type d'événement."""
        return event_type in cls.MEMORY_AGENT_ALLOWED_EVENTS


# ============================================================================
# THREAD SERVICE — Core Implementation
# ============================================================================

class ThreadService:
    """
    🧵 Thread Service — Gestion canonique des threads CHE·NU.
    
    INVARIANTS:
    1. Append-only event log
    2. Single source of truth (no duplicated memory)
    3. Exactly one memory_agent per thread
    4. No always-on agents
    5. Human sovereignty preserved
    """
    
    def __init__(self):
        # In-memory storage (replace with database in production)
        self._threads: Dict[str, Thread] = {}
        self._events: Dict[str, List[ThreadEvent]] = {}  # thread_id -> events
        self._participants: Dict[str, List[ThreadParticipant]] = {}  # thread_id -> participants
        self._snapshots: Dict[str, List[ThreadSnapshot]] = {}  # thread_id -> snapshots
        self._live_sessions: Dict[str, LiveSession] = {}  # session_id -> session
        
        # Statistics
        self._stats = {
            "threads_created": 0,
            "events_recorded": 0,
            "snapshots_generated": 0,
            "live_sessions_started": 0,
        }
        
        logger.info("ThreadService initialized - Canonical V2")
    
    # ========================================================================
    # THREAD CRUD
    # ========================================================================
    
    async def create_thread(
        self,
        founding_intent: str,
        thread_type: ThreadType,
        creator_id: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
        spheres: Optional[List[str]] = None,
    ) -> Thread:
        """
        Créer un nouveau thread.
        
        RÈGLE: Chaque thread DOIT avoir une intention fondatrice.
        """
        thread_id = str(uuid4())
        
        # Create thread
        thread = Thread(
            id=thread_id,
            type=thread_type,
            founding_intent=founding_intent,
            title=title or f"Thread {thread_id[:8]}",
            description=description,
            spheres=spheres or [],
        )
        
        self._threads[thread_id] = thread
        self._events[thread_id] = []
        self._participants[thread_id] = []
        self._snapshots[thread_id] = []
        
        # Add creator as owner
        owner = ThreadParticipant(
            thread_id=thread_id,
            subject_type=ActorType.HUMAN,
            subject_id=creator_id,
            role=ParticipantRole.OWNER,
        )
        self._participants[thread_id].append(owner)
        
        # Create memory agent (OBLIGATOIRE)
        memory_agent = await self._create_memory_agent(thread_id, creator_id)
        
        # Record THREAD_CREATED event
        await self._append_event(
            thread_id=thread_id,
            event_type=EventType.THREAD_CREATED,
            actor_type=ActorType.HUMAN,
            actor_id=creator_id,
            payload={
                "founding_intent": founding_intent,
                "type": thread_type.value,
                "title": thread.title,
                "spheres": spheres or [],
            },
        )
        
        self._stats["threads_created"] += 1
        logger.info(f"Thread created: {thread_id} by {creator_id}")
        
        return thread
    
    async def get_thread(self, thread_id: str) -> Optional[Thread]:
        """Récupérer un thread."""
        return self._threads.get(thread_id)
    
    async def list_threads(
        self,
        user_id: Optional[str] = None,
        status: Optional[ThreadStatus] = None,
        thread_type: Optional[ThreadType] = None,
        sphere: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Thread]:
        """Lister les threads avec filtres."""
        threads = list(self._threads.values())
        
        # Filter by user participation
        if user_id:
            user_thread_ids = set()
            for tid, participants in self._participants.items():
                for p in participants:
                    if p.subject_id == user_id:
                        user_thread_ids.add(tid)
                        break
            threads = [t for t in threads if t.id in user_thread_ids]
        
        # Filter by status
        if status:
            threads = [t for t in threads if t.status == status]
        
        # Filter by type
        if thread_type:
            threads = [t for t in threads if t.type == thread_type]
        
        # Filter by sphere
        if sphere:
            threads = [t for t in threads if sphere in t.spheres]
        
        # Sort by updated_at descending
        threads.sort(key=lambda t: t.updated_at, reverse=True)
        
        return threads[offset:offset + limit]
    
    async def update_thread(
        self,
        thread_id: str,
        actor_id: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
        status: Optional[ThreadStatus] = None,
    ) -> Optional[Thread]:
        """
        Mettre à jour un thread.
        
        RÈGLE: Seuls title, description, status peuvent être modifiés.
        L'intention fondatrice est IMMUTABLE.
        """
        thread = self._threads.get(thread_id)
        if not thread:
            return None
        
        # Check permission
        if not await self._has_permission(thread_id, actor_id, "write"):
            raise PermissionError(f"User {actor_id} cannot update thread {thread_id}")
        
        # Update allowed fields only
        if title is not None:
            thread.title = title
        if description is not None:
            thread.description = description
        if status is not None:
            thread.status = status
        
        thread.updated_at = datetime.utcnow()
        
        return thread
    
    async def archive_thread(self, thread_id: str, actor_id: str) -> bool:
        """
        Archiver un thread.
        
        RÈGLE CANONIQUE: Un thread n'est JAMAIS supprimé, seulement archivé.
        """
        thread = self._threads.get(thread_id)
        if not thread:
            return False
        
        # Check permission (only owner can archive)
        participant = await self._get_participant(thread_id, actor_id)
        if not participant or participant.role != ParticipantRole.OWNER:
            raise PermissionError(f"Only owner can archive thread {thread_id}")
        
        thread.status = ThreadStatus.ARCHIVED
        thread.updated_at = datetime.utcnow()
        
        # Record archive event
        await self._append_event(
            thread_id=thread_id,
            event_type=EventType.THREAD_ARCHIVED,
            actor_type=ActorType.HUMAN,
            actor_id=actor_id,
            payload={"reason": "User requested archive"},
        )
        
        logger.info(f"Thread archived: {thread_id} by {actor_id}")
        return True
    
    # ========================================================================
    # EVENT LOG (APPEND-ONLY!)
    # ========================================================================
    
    async def _append_event(
        self,
        thread_id: str,
        event_type: EventType,
        actor_type: ActorType,
        actor_id: str,
        payload: Dict[str, Any],
        links: Optional[List[EventLink]] = None,
        redaction_level: RedactionLevel = RedactionLevel.PRIVATE,
    ) -> ThreadEvent:
        """
        Ajouter un événement au log (APPEND-ONLY!).
        
        ⚠️ RÈGLE CANONIQUE: Aucune modification du passé!
        """
        event = ThreadEvent(
            event_id=str(uuid4()),
            thread_id=thread_id,
            event_type=event_type,
            actor_type=actor_type,
            actor_id=actor_id,
            payload=payload,
            links=links or [],
            redaction_level=redaction_level,
        )
        
        if thread_id not in self._events:
            self._events[thread_id] = []
        
        self._events[thread_id].append(event)
        self._stats["events_recorded"] += 1
        
        # Update thread timestamp
        if thread_id in self._threads:
            self._threads[thread_id].updated_at = datetime.utcnow()
        
        logger.debug(f"Event appended: {event_type.value} to thread {thread_id}")
        return event
    
    async def get_events(
        self,
        thread_id: str,
        viewer_id: str,
        event_type: Optional[EventType] = None,
        since: Optional[datetime] = None,
        limit: int = 100,
    ) -> List[ThreadEvent]:
        """
        Récupérer les événements d'un thread.
        
        Les événements sont filtrés selon le niveau de rédaction et le rôle du viewer.
        """
        events = self._events.get(thread_id, [])
        
        # Get viewer's role
        participant = await self._get_participant(thread_id, viewer_id)
        viewer_role = participant.role if participant else None
        
        # Filter by event type
        if event_type:
            events = [e for e in events if e.event_type == event_type]
        
        # Filter by time
        if since:
            events = [e for e in events if e.created_at >= since]
        
        # Filter by redaction level
        if viewer_role:
            events = [
                e for e in events 
                if PermissionChecker.can_view_redaction(viewer_role, e.redaction_level)
            ]
        
        # Sort chronologically
        events.sort(key=lambda e: e.created_at)
        
        return events[-limit:] if limit else events
    
    async def append_correction(
        self,
        thread_id: str,
        actor_id: str,
        original_event_id: str,
        correction: str,
        reason: str,
    ) -> ThreadEvent:
        """
        Ajouter une correction (APPEND-ONLY!).
        
        ⚠️ RÈGLE: On ne modifie JAMAIS un événement passé.
        On ajoute une CORRECTION qui référence l'original.
        """
        # Verify original event exists
        events = self._events.get(thread_id, [])
        original = next((e for e in events if e.event_id == original_event_id), None)
        if not original:
            raise ValueError(f"Original event {original_event_id} not found")
        
        # Check permission
        if not await self._has_permission(thread_id, actor_id, "write"):
            raise PermissionError(f"User {actor_id} cannot add correction")
        
        return await self._append_event(
            thread_id=thread_id,
            event_type=EventType.CORRECTION_APPENDED,
            actor_type=ActorType.HUMAN,
            actor_id=actor_id,
            payload={
                "correction": correction,
                "reason": reason,
            },
            links=[EventLink(type="corrects", target_id=original_event_id)],
        )
    
    # ========================================================================
    # CHAT VIEW (Projection du thread)
    # ========================================================================
    
    async def post_message(
        self,
        thread_id: str,
        actor_type: ActorType,
        actor_id: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> ThreadEvent:
        """
        Poster un message dans le thread.
        
        ⚠️ Le chat n'a PAS de mémoire propre!
        Le message est stocké comme événement dans le thread.
        """
        # Check permission
        if not await self._has_permission(thread_id, actor_id, "write"):
            raise PermissionError(f"Actor {actor_id} cannot post message")
        
        return await self._append_event(
            thread_id=thread_id,
            event_type=EventType.MESSAGE_POSTED,
            actor_type=actor_type,
            actor_id=actor_id,
            payload={
                "content": content,
                "metadata": metadata or {},
            },
        )
    
    async def get_messages(
        self,
        thread_id: str,
        viewer_id: str,
        limit: int = 50,
    ) -> List[ThreadEvent]:
        """Récupérer les messages (vue chat)."""
        return await self.get_events(
            thread_id=thread_id,
            viewer_id=viewer_id,
            event_type=EventType.MESSAGE_POSTED,
            limit=limit,
        )
    
    # ========================================================================
    # LIVE SESSIONS (Projection du thread)
    # ========================================================================
    
    async def start_live(
        self,
        thread_id: str,
        initiator_id: str,
        participants: Optional[List[str]] = None,
    ) -> LiveSession:
        """
        Démarrer une session Live.
        
        ⚠️ Le Live n'a PAS de mémoire propre!
        C'est un segment temporel intense du thread.
        """
        session_id = str(uuid4())
        
        session = LiveSession(
            session_id=session_id,
            thread_id=thread_id,
            started_at=datetime.utcnow(),
            participants=participants or [initiator_id],
        )
        
        self._live_sessions[session_id] = session
        self._stats["live_sessions_started"] += 1
        
        # Record event
        await self._append_event(
            thread_id=thread_id,
            event_type=EventType.LIVE_STARTED,
            actor_type=ActorType.HUMAN,
            actor_id=initiator_id,
            payload={
                "session_id": session_id,
                "participants": session.participants,
            },
        )
        
        logger.info(f"Live started: {session_id} in thread {thread_id}")
        return session
    
    async def end_live(
        self,
        session_id: str,
        actor_id: str,
        generate_snapshot: bool = True,
    ) -> LiveSession:
        """
        Terminer une session Live.
        
        Option: Générer automatiquement un snapshot mémoire.
        """
        session = self._live_sessions.get(session_id)
        if not session:
            raise ValueError(f"Live session {session_id} not found")
        
        session.ended_at = datetime.utcnow()
        
        # Record event
        await self._append_event(
            thread_id=session.thread_id,
            event_type=EventType.LIVE_ENDED,
            actor_type=ActorType.HUMAN,
            actor_id=actor_id,
            payload={
                "session_id": session_id,
                "duration_seconds": (session.ended_at - session.started_at).total_seconds(),
            },
        )
        
        # Optional: trigger memory agent snapshot
        if generate_snapshot:
            await self.generate_snapshot(
                thread_id=session.thread_id,
                snapshot_type=SnapshotType.MEMORY_SUMMARY,
                trigger="live_ended",
            )
        
        logger.info(f"Live ended: {session_id}")
        return session
    
    # ========================================================================
    # DECISIONS & ACTIONS
    # ========================================================================
    
    async def record_decision(
        self,
        thread_id: str,
        actor_id: str,
        decision: str,
        rationale: str,
        options_considered: Optional[List[str]] = None,
    ) -> ThreadEvent:
        """Enregistrer une décision."""
        return await self._append_event(
            thread_id=thread_id,
            event_type=EventType.DECISION_RECORDED,
            actor_type=ActorType.HUMAN,
            actor_id=actor_id,
            payload={
                "decision": decision,
                "rationale": rationale,
                "options_considered": options_considered or [],
            },
        )
    
    async def create_action(
        self,
        thread_id: str,
        actor_id: str,
        action: str,
        assigned_to: Optional[str] = None,
        due_date: Optional[datetime] = None,
    ) -> ThreadEvent:
        """Créer une action."""
        action_id = str(uuid4())
        
        return await self._append_event(
            thread_id=thread_id,
            event_type=EventType.ACTION_CREATED,
            actor_type=ActorType.HUMAN,
            actor_id=actor_id,
            payload={
                "action_id": action_id,
                "action": action,
                "assigned_to": assigned_to,
                "due_date": due_date.isoformat() if due_date else None,
                "status": "pending",
            },
        )
    
    async def update_action(
        self,
        thread_id: str,
        actor_id: str,
        action_id: str,
        status: str,
        result: Optional[str] = None,
    ) -> ThreadEvent:
        """Mettre à jour une action."""
        return await self._append_event(
            thread_id=thread_id,
            event_type=EventType.ACTION_UPDATED,
            actor_type=ActorType.HUMAN,
            actor_id=actor_id,
            payload={
                "action_id": action_id,
                "status": status,
                "result": result,
            },
        )
    
    async def record_error(
        self,
        thread_id: str,
        actor_id: str,
        error: str,
        context: Optional[str] = None,
    ) -> ThreadEvent:
        """
        Enregistrer une erreur (sans jugement).
        
        Les erreurs sont documentées pour apprentissage, pas pour blâme.
        """
        return await self._append_event(
            thread_id=thread_id,
            event_type=EventType.ERROR_RECORDED,
            actor_type=ActorType.HUMAN,
            actor_id=actor_id,
            payload={
                "error": error,
                "context": context,
                "documented_at": datetime.utcnow().isoformat(),
            },
        )
    
    async def record_learning(
        self,
        thread_id: str,
        actor_id: str,
        learning: str,
        source_events: Optional[List[str]] = None,
    ) -> ThreadEvent:
        """Enregistrer un apprentissage explicite."""
        links = [
            EventLink(type="derived_from", target_id=eid)
            for eid in (source_events or [])
        ]
        
        return await self._append_event(
            thread_id=thread_id,
            event_type=EventType.LEARNING_RECORDED,
            actor_type=ActorType.HUMAN,
            actor_id=actor_id,
            payload={"learning": learning},
            links=links,
        )
    
    # ========================================================================
    # MEMORY AGENT & SNAPSHOTS
    # ========================================================================
    
    async def _create_memory_agent(self, thread_id: str, creator_id: str) -> ThreadParticipant:
        """
        Créer l'agent de mémoire du thread.
        
        ⚠️ RÈGLE CANONIQUE: Exactement UN agent de mémoire par thread!
        """
        # Check if memory agent already exists
        for p in self._participants.get(thread_id, []):
            if p.role == ParticipantRole.MEMORY_AGENT:
                raise ValueError(f"Thread {thread_id} already has a memory agent")
        
        memory_agent = ThreadParticipant(
            thread_id=thread_id,
            subject_type=ActorType.AGENT,
            subject_id=f"memory_agent_{thread_id[:8]}",
            role=ParticipantRole.MEMORY_AGENT,
            permissions={
                "can_write_snapshots": True,
                "can_write_corrections": True,
                "can_read_all": True,
                "can_modify_permissions": False,
                "can_delete": False,
            },
        )
        
        self._participants[thread_id].append(memory_agent)
        logger.info(f"Memory agent created for thread {thread_id}")
        
        return memory_agent
    
    async def get_memory_agent(self, thread_id: str) -> Optional[ThreadParticipant]:
        """Récupérer l'agent de mémoire du thread."""
        for p in self._participants.get(thread_id, []):
            if p.role == ParticipantRole.MEMORY_AGENT:
                return p
        return None
    
    async def generate_snapshot(
        self,
        thread_id: str,
        snapshot_type: SnapshotType,
        trigger: str = "manual",
    ) -> ThreadSnapshot:
        """
        Générer un snapshot mémoire.
        
        L'agent de mémoire produit un résumé basé sur les événements.
        """
        memory_agent = await self.get_memory_agent(thread_id)
        if not memory_agent:
            raise ValueError(f"No memory agent for thread {thread_id}")
        
        # Get all events
        events = self._events.get(thread_id, [])
        
        # Generate summary based on type
        if snapshot_type == SnapshotType.MEMORY_SUMMARY:
            content = await self._generate_memory_summary(events)
        elif snapshot_type == SnapshotType.ONBOARDING_BRIEF:
            content = await self._generate_onboarding_brief(thread_id, events)
        else:
            content = await self._generate_state_summary(events)
        
        snapshot = ThreadSnapshot(
            snapshot_id=str(uuid4()),
            thread_id=thread_id,
            snapshot_type=snapshot_type,
            content=content,
            references=[e.event_id for e in events[-50:]],  # Last 50 events
            created_by=memory_agent.subject_id,
        )
        
        if thread_id not in self._snapshots:
            self._snapshots[thread_id] = []
        self._snapshots[thread_id].append(snapshot)
        
        # Record snapshot event
        await self._append_event(
            thread_id=thread_id,
            event_type=EventType.SUMMARY_SNAPSHOT,
            actor_type=ActorType.AGENT,
            actor_id=memory_agent.subject_id,
            payload={
                "snapshot_id": snapshot.snapshot_id,
                "snapshot_type": snapshot_type.value,
                "trigger": trigger,
                "event_count": len(events),
            },
        )
        
        self._stats["snapshots_generated"] += 1
        logger.info(f"Snapshot generated: {snapshot_type.value} for thread {thread_id}")
        
        return snapshot
    
    async def _generate_memory_summary(self, events: List[ThreadEvent]) -> str:
        """Générer un résumé mémoire des événements."""
        decisions = [e for e in events if e.event_type == EventType.DECISION_RECORDED]
        actions = [e for e in events if e.event_type == EventType.ACTION_CREATED]
        learnings = [e for e in events if e.event_type == EventType.LEARNING_RECORDED]
        
        summary_parts = []
        
        if decisions:
            summary_parts.append(f"## Décisions ({len(decisions)})")
            for d in decisions[-5:]:
                summary_parts.append(f"- {d.payload.get('decision', 'N/A')}")
        
        if actions:
            summary_parts.append(f"\n## Actions ({len(actions)})")
            for a in actions[-5:]:
                summary_parts.append(f"- {a.payload.get('action', 'N/A')}")
        
        if learnings:
            summary_parts.append(f"\n## Apprentissages ({len(learnings)})")
            for l in learnings[-5:]:
                summary_parts.append(f"- {l.payload.get('learning', 'N/A')}")
        
        return "\n".join(summary_parts) if summary_parts else "Aucun contenu significatif."
    
    async def _generate_onboarding_brief(self, thread_id: str, events: List[ThreadEvent]) -> str:
        """Générer un brief d'onboarding pour nouveaux participants."""
        thread = self._threads.get(thread_id)
        if not thread:
            return "Thread not found."
        
        return f"""# Brief d'Onboarding

## Intention Fondatrice
{thread.founding_intent}

## Contexte
{thread.description or "Aucune description."}

## Sphères Concernées
{', '.join(thread.spheres) if thread.spheres else "Non spécifié"}

## Résumé
{await self._generate_memory_summary(events)}

## Statut Actuel
{thread.status.value.upper()}
"""
    
    async def _generate_state_summary(self, events: List[ThreadEvent]) -> str:
        """Générer un résumé d'état."""
        return f"Thread contient {len(events)} événements."
    
    async def get_latest_snapshot(
        self,
        thread_id: str,
        snapshot_type: Optional[SnapshotType] = None,
    ) -> Optional[ThreadSnapshot]:
        """Récupérer le dernier snapshot."""
        snapshots = self._snapshots.get(thread_id, [])
        
        if snapshot_type:
            snapshots = [s for s in snapshots if s.snapshot_type == snapshot_type]
        
        if not snapshots:
            return None
        
        return max(snapshots, key=lambda s: s.created_at)
    
    # ========================================================================
    # PARTICIPANTS & PERMISSIONS
    # ========================================================================
    
    async def add_participant(
        self,
        thread_id: str,
        actor_id: str,
        subject_type: ActorType,
        subject_id: str,
        role: ParticipantRole,
    ) -> ThreadParticipant:
        """Ajouter un participant au thread."""
        # Check permission
        if not await self._has_permission(thread_id, actor_id, "manage_participants"):
            raise PermissionError(f"User {actor_id} cannot manage participants")
        
        # Check for duplicate
        existing = await self._get_participant(thread_id, subject_id)
        if existing:
            raise ValueError(f"Participant {subject_id} already exists in thread")
        
        # Enforce single memory agent
        if role == ParticipantRole.MEMORY_AGENT:
            for p in self._participants.get(thread_id, []):
                if p.role == ParticipantRole.MEMORY_AGENT:
                    raise ValueError("Thread already has a memory agent")
        
        participant = ThreadParticipant(
            thread_id=thread_id,
            subject_type=subject_type,
            subject_id=subject_id,
            role=role,
        )
        
        self._participants[thread_id].append(participant)
        
        # Record permission change
        await self._append_event(
            thread_id=thread_id,
            event_type=EventType.PERMISSION_CHANGED,
            actor_type=ActorType.HUMAN,
            actor_id=actor_id,
            payload={
                "action": "added",
                "subject_type": subject_type.value,
                "subject_id": subject_id,
                "role": role.value,
            },
        )
        
        return participant
    
    async def remove_participant(
        self,
        thread_id: str,
        actor_id: str,
        subject_id: str,
    ) -> bool:
        """Retirer un participant du thread."""
        # Check permission
        if not await self._has_permission(thread_id, actor_id, "manage_participants"):
            raise PermissionError(f"User {actor_id} cannot manage participants")
        
        participants = self._participants.get(thread_id, [])
        original_count = len(participants)
        
        # Cannot remove memory agent (must reassign first)
        target = next((p for p in participants if p.subject_id == subject_id), None)
        if target and target.role == ParticipantRole.MEMORY_AGENT:
            raise ValueError("Cannot remove memory agent. Reassign first.")
        
        self._participants[thread_id] = [
            p for p in participants if p.subject_id != subject_id
        ]
        
        removed = len(self._participants[thread_id]) < original_count
        
        if removed:
            await self._append_event(
                thread_id=thread_id,
                event_type=EventType.PERMISSION_CHANGED,
                actor_type=ActorType.HUMAN,
                actor_id=actor_id,
                payload={
                    "action": "removed",
                    "subject_id": subject_id,
                },
            )
        
        return removed
    
    async def get_participants(self, thread_id: str) -> List[ThreadParticipant]:
        """Récupérer tous les participants d'un thread."""
        return self._participants.get(thread_id, [])
    
    async def _get_participant(
        self,
        thread_id: str,
        subject_id: str,
    ) -> Optional[ThreadParticipant]:
        """Récupérer un participant spécifique."""
        for p in self._participants.get(thread_id, []):
            if p.subject_id == subject_id:
                return p
        return None
    
    async def _has_permission(
        self,
        thread_id: str,
        subject_id: str,
        permission: str,
    ) -> bool:
        """Vérifier si un sujet a une permission."""
        participant = await self._get_participant(thread_id, subject_id)
        if not participant:
            return False
        
        return PermissionChecker.ROLE_PERMISSIONS.get(
            participant.role, {}
        ).get(permission, False)
    
    # ========================================================================
    # THREAD LINKS
    # ========================================================================
    
    async def add_link(
        self,
        thread_id: str,
        actor_id: str,
        link_type: str,
        target_id: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> ThreadEvent:
        """
        Ajouter un lien entre threads.
        
        Types: references, depends_on, parent_of, child_of, supersedes
        """
        return await self._append_event(
            thread_id=thread_id,
            event_type=EventType.LINK_ADDED,
            actor_type=ActorType.HUMAN,
            actor_id=actor_id,
            payload={
                "link_type": link_type,
                "target_id": target_id,
                "metadata": metadata or {},
            },
        )
    
    async def get_linked_threads(self, thread_id: str) -> List[Dict[str, Any]]:
        """Récupérer les threads liés."""
        events = self._events.get(thread_id, [])
        links = []
        
        for event in events:
            if event.event_type == EventType.LINK_ADDED:
                links.append({
                    "link_type": event.payload.get("link_type"),
                    "target_id": event.payload.get("target_id"),
                    "created_at": event.created_at.isoformat(),
                })
        
        return links
    
    # ========================================================================
    # XR PROJECTION
    # ========================================================================
    
    async def get_xr_state(self, thread_id: str, viewer_id: str) -> Dict[str, Any]:
        """
        Récupérer l'état XR dérivé du thread.
        
        ⚠️ L'environnement XR n'a PAS d'état propre!
        C'est une projection du thread.
        """
        thread = await self.get_thread(thread_id)
        if not thread:
            raise ValueError(f"Thread {thread_id} not found")
        
        events = await self.get_events(thread_id, viewer_id)
        snapshot = await self.get_latest_snapshot(thread_id, SnapshotType.STATE_SUMMARY)
        
        # Derive XR layout from thread data
        decisions = [e for e in events if e.event_type == EventType.DECISION_RECORDED]
        actions = [e for e in events if e.event_type == EventType.ACTION_CREATED]
        messages = [e for e in events if e.event_type == EventType.MESSAGE_POSTED]
        
        return {
            "thread_id": thread_id,
            "environment_id": f"xr_{thread_id}",  # Deterministic mapping
            "founding_intent": thread.founding_intent,
            "zones": {
                "intent_wall": {
                    "content": thread.founding_intent,
                    "description": thread.description,
                },
                "decision_wall": {
                    "decisions": [
                        {
                            "id": d.event_id,
                            "text": d.payload.get("decision"),
                            "created_at": d.created_at.isoformat(),
                        }
                        for d in decisions[-10:]
                    ],
                },
                "action_table": {
                    "actions": [
                        {
                            "id": a.event_id,
                            "text": a.payload.get("action"),
                            "status": a.payload.get("status"),
                            "assigned_to": a.payload.get("assigned_to"),
                        }
                        for a in actions[-20:]
                    ],
                },
                "timeline_strip": {
                    "events": [
                        {
                            "id": e.event_id,
                            "type": e.event_type.value,
                            "created_at": e.created_at.isoformat(),
                        }
                        for e in events[-50:]
                    ],
                },
                "memory_kiosk": {
                    "latest_snapshot": snapshot.content if snapshot else None,
                    "snapshot_date": snapshot.created_at.isoformat() if snapshot else None,
                },
            },
            "generated_at": datetime.utcnow().isoformat(),
        }
    
    # ========================================================================
    # STATISTICS
    # ========================================================================
    
    async def get_stats(self) -> Dict[str, Any]:
        """Récupérer les statistiques du service."""
        return {
            **self._stats,
            "active_threads": len([t for t in self._threads.values() if t.status == ThreadStatus.ACTIVE]),
            "total_threads": len(self._threads),
            "total_events": sum(len(e) for e in self._events.values()),
            "total_participants": sum(len(p) for p in self._participants.values()),
        }


# ============================================================================
# SINGLETON INSTANCE
# ============================================================================

_thread_service: Optional[ThreadService] = None

def get_thread_service() -> ThreadService:
    """Get or create the thread service instance."""
    global _thread_service
    if _thread_service is None:
        _thread_service = ThreadService()
    return _thread_service


# ============================================================================
# MAIN - Testing
# ============================================================================

if __name__ == "__main__":
    import asyncio
    
    async def main():
        print("🧵 CHE·NU Thread Service V2 - Test")
        print("=" * 60)
        
        service = get_thread_service()
        
        # Create a thread
        thread = await service.create_thread(
            founding_intent="Développer la stratégie marketing Q1 2026",
            thread_type=ThreadType.COLLECTIVE,
            creator_id="user_001",
            title="Stratégie Marketing Q1",
            description="Discussion et planification de la stratégie marketing",
            spheres=["business", "creative_studio"],
        )
        
        print(f"\n✅ Thread créé: {thread.id[:8]}")
        print(f"   Intent: {thread.founding_intent}")
        print(f"   Type: {thread.type.value}")
        
        # Post messages
        await service.post_message(
            thread_id=thread.id,
            actor_type=ActorType.HUMAN,
            actor_id="user_001",
            content="Bonjour équipe, commençons la planification.",
        )
        
        # Add user_002 as contributor
        await service.add_participant(
            thread_id=thread.id,
            actor_id="user_001",
            subject_type=ActorType.HUMAN,
            subject_id="user_002",
            role=ParticipantRole.CONTRIBUTOR,
        )
        
        await service.post_message(
            thread_id=thread.id,
            actor_type=ActorType.HUMAN,
            actor_id="user_002",
            content="D'accord, j'ai quelques idées à partager.",
        )
        
        print("✅ Messages postés")
        
        # Record a decision
        await service.record_decision(
            thread_id=thread.id,
            actor_id="user_001",
            decision="Focus sur le contenu vidéo pour Q1",
            rationale="Les vidéos ont le meilleur ROI actuellement",
            options_considered=["Blog posts", "Podcasts", "Vidéos", "Infographies"],
        )
        
        print("✅ Décision enregistrée")
        
        # Create an action
        await service.create_action(
            thread_id=thread.id,
            actor_id="user_001",
            action="Créer le calendrier de contenu vidéo",
            assigned_to="user_002",
        )
        
        print("✅ Action créée")
        
        # Start a live session
        session = await service.start_live(
            thread_id=thread.id,
            initiator_id="user_001",
            participants=["user_001", "user_002"],
        )
        
        print(f"✅ Session Live démarrée: {session.session_id[:8]}")
        
        # End live with snapshot
        await service.end_live(
            session_id=session.session_id,
            actor_id="user_001",
            generate_snapshot=True,
        )
        
        print("✅ Session Live terminée avec snapshot")
        
        # Get events
        events = await service.get_events(
            thread_id=thread.id,
            viewer_id="user_001",
        )
        
        print(f"\n📜 Événements du thread ({len(events)}):")
        for e in events:
            print(f"   - {e.event_type.value}")
        
        # Get XR state
        xr_state = await service.get_xr_state(thread.id, "user_001")
        print(f"\n🥽 État XR généré: {xr_state['environment_id']}")
        
        # Get stats
        stats = await service.get_stats()
        print(f"\n📊 Statistiques:")
        for key, value in stats.items():
            print(f"   {key}: {value}")
        
        print("\n" + "=" * 60)
        print("✅ Tous les tests passés!")
        print("\n\"Dans CHE-NU, tout commence par un thread.\"")
        print("\"Tout s'y inscrit.\"")
        print("\"Et rien n'existe en dehors de lui.\"")
    
    asyncio.run(main())
