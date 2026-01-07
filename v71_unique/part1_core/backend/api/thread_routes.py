# CHE·NU™ V71 — Thread API Routes (Canonical V2)
"""
🧵 Thread API — Routes pour gestion canonique des threads

API Endpoints per Thread V2 Tech Specs:
- POST   /threads                          → Create thread
- GET    /threads/{thread_id}              → Get thread
- PATCH  /threads/{thread_id}              → Update thread
- POST   /threads/{thread_id}/archive      → Archive thread
- GET    /threads/{thread_id}/events       → Get events
- POST   /threads/{thread_id}/events       → Append event
- POST   /threads/{thread_id}/chat/messages → Post message
- GET    /threads/{thread_id}/chat/messages → Get messages
- POST   /threads/{thread_id}/live/start   → Start live
- POST   /threads/{thread_id}/live/end     → End live
- GET    /threads/{thread_id}/snapshots/latest → Get latest snapshot
- POST   /threads/{thread_id}/snapshots/generate → Generate snapshot
- GET    /threads/{thread_id}/participants → Get participants
- POST   /threads/{thread_id}/participants → Add participant
- POST   /threads/{thread_id}/permissions/change → Change permissions
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

# Assuming FastAPI is used
# from fastapi import APIRouter, HTTPException, Depends, Query, Path, Body
# router = APIRouter(prefix="/api/v2/threads", tags=["Threads"])


# ============================================================================
# PYDANTIC MODELS - Request/Response Schemas
# ============================================================================

class ThreadTypeEnum(str, Enum):
    PERSONAL = "personal"
    COLLECTIVE = "collective"
    INTER_SPHERE = "inter_sphere"


class ThreadStatusEnum(str, Enum):
    ACTIVE = "active"
    DORMANT = "dormant"
    ARCHIVED = "archived"


class ActorTypeEnum(str, Enum):
    HUMAN = "human"
    AGENT = "agent"


class ParticipantRoleEnum(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    CONTRIBUTOR = "contributor"
    VIEWER = "viewer"
    MEMORY_AGENT = "memory_agent"
    SPECIALIST_AGENT = "specialist_agent"


class RedactionLevelEnum(str, Enum):
    PUBLIC = "public"
    SEMI_PRIVATE = "semi_private"
    PRIVATE = "private"


class SnapshotTypeEnum(str, Enum):
    MEMORY_SUMMARY = "memory_summary"
    STATE_SUMMARY = "state_summary"
    ONBOARDING_BRIEF = "onboarding_brief"


# ============================================================================
# REQUEST MODELS
# ============================================================================

class CreateThreadRequest(BaseModel):
    """Requête de création de thread."""
    founding_intent: str = Field(..., min_length=10, description="L'intention fondatrice (OBLIGATOIRE)")
    type: ThreadTypeEnum = Field(..., description="Type de thread")
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    spheres: Optional[List[str]] = Field(default_factory=list)
    constraints: Optional[List[str]] = Field(default_factory=list)
    hypotheses: Optional[List[str]] = Field(default_factory=list)

    class Config:
        json_schema_extra = {
            "example": {
                "founding_intent": "Développer la stratégie marketing Q1 2026 pour augmenter les leads de 30%",
                "type": "collective",
                "title": "Stratégie Marketing Q1 2026",
                "description": "Discussion collaborative sur la stratégie marketing",
                "spheres": ["business", "creative_studio"],
            }
        }


class UpdateThreadRequest(BaseModel):
    """Requête de mise à jour de thread."""
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    status: Optional[ThreadStatusEnum] = None


class PostMessageRequest(BaseModel):
    """Requête de post de message."""
    content: str = Field(..., min_length=1, max_length=10000)
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

    class Config:
        json_schema_extra = {
            "example": {
                "content": "Bonjour équipe, commençons la discussion.",
                "metadata": {"mentions": ["user_002"], "tags": ["important"]},
            }
        }


class AppendEventRequest(BaseModel):
    """Requête d'ajout d'événement."""
    event_type: str = Field(..., description="Type d'événement")
    payload: Dict[str, Any] = Field(..., description="Payload JSON")
    redaction_level: RedactionLevelEnum = RedactionLevelEnum.PRIVATE
    links: Optional[List[Dict[str, str]]] = Field(default_factory=list)


class RecordDecisionRequest(BaseModel):
    """Requête d'enregistrement de décision."""
    decision: str = Field(..., min_length=5)
    rationale: str = Field(..., min_length=10)
    options_considered: Optional[List[str]] = Field(default_factory=list)


class CreateActionRequest(BaseModel):
    """Requête de création d'action."""
    action: str = Field(..., min_length=5)
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None


class UpdateActionRequest(BaseModel):
    """Requête de mise à jour d'action."""
    action_id: str
    status: str = Field(..., description="pending | in_progress | completed | cancelled")
    result: Optional[str] = None


class RecordErrorRequest(BaseModel):
    """Requête d'enregistrement d'erreur."""
    error: str = Field(..., min_length=5)
    context: Optional[str] = None


class RecordLearningRequest(BaseModel):
    """Requête d'enregistrement d'apprentissage."""
    learning: str = Field(..., min_length=10)
    source_events: Optional[List[str]] = Field(default_factory=list)


class AppendCorrectionRequest(BaseModel):
    """Requête de correction (append-only!)."""
    original_event_id: str = Field(..., description="ID de l'événement original")
    correction: str = Field(..., min_length=5)
    reason: str = Field(..., min_length=10)


class StartLiveRequest(BaseModel):
    """Requête de démarrage de session Live."""
    participants: Optional[List[str]] = Field(default_factory=list)


class EndLiveRequest(BaseModel):
    """Requête de fin de session Live."""
    session_id: str
    generate_snapshot: bool = True


class GenerateSnapshotRequest(BaseModel):
    """Requête de génération de snapshot."""
    snapshot_type: SnapshotTypeEnum = SnapshotTypeEnum.MEMORY_SUMMARY
    trigger: str = "manual"


class AddParticipantRequest(BaseModel):
    """Requête d'ajout de participant."""
    subject_type: ActorTypeEnum
    subject_id: str
    role: ParticipantRoleEnum


class RemoveParticipantRequest(BaseModel):
    """Requête de retrait de participant."""
    subject_id: str


class ChangePermissionsRequest(BaseModel):
    """Requête de changement de permissions."""
    subject_id: str
    new_role: ParticipantRoleEnum


class AddLinkRequest(BaseModel):
    """Requête d'ajout de lien."""
    link_type: str = Field(..., description="references | depends_on | parent_of | child_of | supersedes")
    target_id: str
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


# ============================================================================
# RESPONSE MODELS
# ============================================================================

class ThreadResponse(BaseModel):
    """Réponse thread."""
    id: str
    type: ThreadTypeEnum
    founding_intent: str
    status: ThreadStatusEnum
    title: Optional[str]
    description: Optional[str]
    spheres: List[str]
    constraints: List[str]
    hypotheses: List[str]
    created_at: datetime
    updated_at: datetime


class EventResponse(BaseModel):
    """Réponse événement."""
    event_id: str
    thread_id: str
    event_type: str
    actor_type: ActorTypeEnum
    actor_id: str
    payload: Dict[str, Any]
    created_at: datetime
    redaction_level: RedactionLevelEnum
    integrity_hash: Optional[str]


class MessageResponse(BaseModel):
    """Réponse message."""
    event_id: str
    thread_id: str
    actor_type: ActorTypeEnum
    actor_id: str
    content: str
    metadata: Dict[str, Any]
    created_at: datetime


class LiveSessionResponse(BaseModel):
    """Réponse session Live."""
    session_id: str
    thread_id: str
    started_at: datetime
    ended_at: Optional[datetime]
    participants: List[str]
    summary: Optional[str]


class SnapshotResponse(BaseModel):
    """Réponse snapshot."""
    snapshot_id: str
    thread_id: str
    snapshot_type: SnapshotTypeEnum
    content: str
    references: List[str]
    created_by: str
    created_at: datetime


class ParticipantResponse(BaseModel):
    """Réponse participant."""
    thread_id: str
    subject_type: ActorTypeEnum
    subject_id: str
    role: ParticipantRoleEnum
    permissions: Optional[Dict[str, bool]]
    created_at: datetime


class XRStateResponse(BaseModel):
    """Réponse état XR."""
    thread_id: str
    environment_id: str
    founding_intent: str
    zones: Dict[str, Any]
    generated_at: str


class ThreadStatsResponse(BaseModel):
    """Réponse statistiques."""
    threads_created: int
    events_recorded: int
    snapshots_generated: int
    live_sessions_started: int
    active_threads: int
    total_threads: int
    total_events: int
    total_participants: int


class ErrorResponse(BaseModel):
    """Réponse erreur."""
    error: str
    detail: Optional[str] = None
    code: str = "error"


# ============================================================================
# API ROUTES IMPLEMENTATION (FastAPI Style)
# ============================================================================

"""
Below is the implementation assuming FastAPI. 
In production, uncomment the router and inject dependencies.
"""

# from fastapi import APIRouter, HTTPException, Depends, Query, Path, Body, status
# from .services.thread_service import get_thread_service, ThreadService, ThreadType, ThreadStatus
# 
# router = APIRouter(prefix="/api/v2/threads", tags=["Threads"])


class ThreadRoutes:
    """
    Thread API Routes handler.
    
    Usage with FastAPI:
    ```python
    from fastapi import APIRouter
    router = APIRouter()
    routes = ThreadRoutes()
    
    @router.post("/threads")
    async def create_thread(request: CreateThreadRequest):
        return await routes.create_thread(request, user_id="current_user")
    ```
    """
    
    def __init__(self):
        from .thread_service import get_thread_service
        self.service = get_thread_service()
    
    # ========================================================================
    # THREAD CRUD
    # ========================================================================
    
    async def create_thread(
        self,
        request: CreateThreadRequest,
        user_id: str,
    ) -> ThreadResponse:
        """
        POST /threads
        
        Créer un nouveau thread avec intention fondatrice.
        """
        from .thread_service import ThreadType
        
        thread = await self.service.create_thread(
            founding_intent=request.founding_intent,
            thread_type=ThreadType(request.type.value),
            creator_id=user_id,
            title=request.title,
            description=request.description,
            spheres=request.spheres,
        )
        
        return ThreadResponse(
            id=thread.id,
            type=ThreadTypeEnum(thread.type.value),
            founding_intent=thread.founding_intent,
            status=ThreadStatusEnum(thread.status.value),
            title=thread.title,
            description=thread.description,
            spheres=thread.spheres,
            constraints=thread.constraints,
            hypotheses=thread.hypotheses,
            created_at=thread.created_at,
            updated_at=thread.updated_at,
        )
    
    async def get_thread(
        self,
        thread_id: str,
        user_id: str,
    ) -> ThreadResponse:
        """
        GET /threads/{thread_id}
        
        Récupérer un thread par ID.
        """
        thread = await self.service.get_thread(thread_id)
        if not thread:
            raise ValueError(f"Thread {thread_id} not found")
        
        return ThreadResponse(
            id=thread.id,
            type=ThreadTypeEnum(thread.type.value),
            founding_intent=thread.founding_intent,
            status=ThreadStatusEnum(thread.status.value),
            title=thread.title,
            description=thread.description,
            spheres=thread.spheres,
            constraints=thread.constraints,
            hypotheses=thread.hypotheses,
            created_at=thread.created_at,
            updated_at=thread.updated_at,
        )
    
    async def list_threads(
        self,
        user_id: str,
        status: Optional[ThreadStatusEnum] = None,
        thread_type: Optional[ThreadTypeEnum] = None,
        sphere: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[ThreadResponse]:
        """
        GET /threads
        
        Lister les threads avec filtres.
        """
        from .thread_service import ThreadStatus, ThreadType
        
        threads = await self.service.list_threads(
            user_id=user_id,
            status=ThreadStatus(status.value) if status else None,
            thread_type=ThreadType(thread_type.value) if thread_type else None,
            sphere=sphere,
            limit=limit,
            offset=offset,
        )
        
        return [
            ThreadResponse(
                id=t.id,
                type=ThreadTypeEnum(t.type.value),
                founding_intent=t.founding_intent,
                status=ThreadStatusEnum(t.status.value),
                title=t.title,
                description=t.description,
                spheres=t.spheres,
                constraints=t.constraints,
                hypotheses=t.hypotheses,
                created_at=t.created_at,
                updated_at=t.updated_at,
            )
            for t in threads
        ]
    
    async def update_thread(
        self,
        thread_id: str,
        request: UpdateThreadRequest,
        user_id: str,
    ) -> ThreadResponse:
        """
        PATCH /threads/{thread_id}
        
        Mettre à jour un thread (title, description, status seulement).
        L'intention fondatrice est IMMUTABLE.
        """
        from .thread_service import ThreadStatus
        
        thread = await self.service.update_thread(
            thread_id=thread_id,
            actor_id=user_id,
            title=request.title,
            description=request.description,
            status=ThreadStatus(request.status.value) if request.status else None,
        )
        
        if not thread:
            raise ValueError(f"Thread {thread_id} not found")
        
        return ThreadResponse(
            id=thread.id,
            type=ThreadTypeEnum(thread.type.value),
            founding_intent=thread.founding_intent,
            status=ThreadStatusEnum(thread.status.value),
            title=thread.title,
            description=thread.description,
            spheres=thread.spheres,
            constraints=thread.constraints,
            hypotheses=thread.hypotheses,
            created_at=thread.created_at,
            updated_at=thread.updated_at,
        )
    
    async def archive_thread(
        self,
        thread_id: str,
        user_id: str,
    ) -> Dict[str, Any]:
        """
        POST /threads/{thread_id}/archive
        
        Archiver un thread (JAMAIS supprimé).
        """
        success = await self.service.archive_thread(thread_id, user_id)
        
        return {
            "success": success,
            "thread_id": thread_id,
            "status": "archived",
            "message": "Thread archived successfully. It will never be deleted.",
        }
    
    # ========================================================================
    # EVENTS (APPEND-ONLY!)
    # ========================================================================
    
    async def get_events(
        self,
        thread_id: str,
        user_id: str,
        event_type: Optional[str] = None,
        since: Optional[datetime] = None,
        limit: int = 100,
    ) -> List[EventResponse]:
        """
        GET /threads/{thread_id}/events
        
        Récupérer les événements du thread.
        """
        from .thread_service import EventType
        
        events = await self.service.get_events(
            thread_id=thread_id,
            viewer_id=user_id,
            event_type=EventType(event_type) if event_type else None,
            since=since,
            limit=limit,
        )
        
        return [
            EventResponse(
                event_id=e.event_id,
                thread_id=e.thread_id,
                event_type=e.event_type.value,
                actor_type=ActorTypeEnum(e.actor_type.value),
                actor_id=e.actor_id,
                payload=e.payload,
                created_at=e.created_at,
                redaction_level=RedactionLevelEnum(e.redaction_level.value),
                integrity_hash=e.integrity_hash,
            )
            for e in events
        ]
    
    async def append_correction(
        self,
        thread_id: str,
        request: AppendCorrectionRequest,
        user_id: str,
    ) -> EventResponse:
        """
        POST /threads/{thread_id}/corrections
        
        Ajouter une correction (APPEND-ONLY!).
        On ne modifie JAMAIS un événement passé.
        """
        event = await self.service.append_correction(
            thread_id=thread_id,
            actor_id=user_id,
            original_event_id=request.original_event_id,
            correction=request.correction,
            reason=request.reason,
        )
        
        return EventResponse(
            event_id=event.event_id,
            thread_id=event.thread_id,
            event_type=event.event_type.value,
            actor_type=ActorTypeEnum(event.actor_type.value),
            actor_id=event.actor_id,
            payload=event.payload,
            created_at=event.created_at,
            redaction_level=RedactionLevelEnum(event.redaction_level.value),
            integrity_hash=event.integrity_hash,
        )
    
    # ========================================================================
    # CHAT VIEW (Projection)
    # ========================================================================
    
    async def post_message(
        self,
        thread_id: str,
        request: PostMessageRequest,
        user_id: str,
    ) -> MessageResponse:
        """
        POST /threads/{thread_id}/chat/messages
        
        Poster un message dans le chat (écrit dans le thread).
        """
        from .thread_service import ActorType
        
        event = await self.service.post_message(
            thread_id=thread_id,
            actor_type=ActorType.HUMAN,
            actor_id=user_id,
            content=request.content,
            metadata=request.metadata,
        )
        
        return MessageResponse(
            event_id=event.event_id,
            thread_id=event.thread_id,
            actor_type=ActorTypeEnum(event.actor_type.value),
            actor_id=event.actor_id,
            content=event.payload.get("content", ""),
            metadata=event.payload.get("metadata", {}),
            created_at=event.created_at,
        )
    
    async def get_messages(
        self,
        thread_id: str,
        user_id: str,
        limit: int = 50,
    ) -> List[MessageResponse]:
        """
        GET /threads/{thread_id}/chat/messages
        
        Récupérer les messages du chat.
        """
        events = await self.service.get_messages(
            thread_id=thread_id,
            viewer_id=user_id,
            limit=limit,
        )
        
        return [
            MessageResponse(
                event_id=e.event_id,
                thread_id=e.thread_id,
                actor_type=ActorTypeEnum(e.actor_type.value),
                actor_id=e.actor_id,
                content=e.payload.get("content", ""),
                metadata=e.payload.get("metadata", {}),
                created_at=e.created_at,
            )
            for e in events
        ]
    
    # ========================================================================
    # DECISIONS & ACTIONS
    # ========================================================================
    
    async def record_decision(
        self,
        thread_id: str,
        request: RecordDecisionRequest,
        user_id: str,
    ) -> EventResponse:
        """
        POST /threads/{thread_id}/decisions
        
        Enregistrer une décision.
        """
        event = await self.service.record_decision(
            thread_id=thread_id,
            actor_id=user_id,
            decision=request.decision,
            rationale=request.rationale,
            options_considered=request.options_considered,
        )
        
        return EventResponse(
            event_id=event.event_id,
            thread_id=event.thread_id,
            event_type=event.event_type.value,
            actor_type=ActorTypeEnum(event.actor_type.value),
            actor_id=event.actor_id,
            payload=event.payload,
            created_at=event.created_at,
            redaction_level=RedactionLevelEnum(event.redaction_level.value),
            integrity_hash=event.integrity_hash,
        )
    
    async def create_action(
        self,
        thread_id: str,
        request: CreateActionRequest,
        user_id: str,
    ) -> EventResponse:
        """
        POST /threads/{thread_id}/actions
        
        Créer une action.
        """
        event = await self.service.create_action(
            thread_id=thread_id,
            actor_id=user_id,
            action=request.action,
            assigned_to=request.assigned_to,
            due_date=request.due_date,
        )
        
        return EventResponse(
            event_id=event.event_id,
            thread_id=event.thread_id,
            event_type=event.event_type.value,
            actor_type=ActorTypeEnum(event.actor_type.value),
            actor_id=event.actor_id,
            payload=event.payload,
            created_at=event.created_at,
            redaction_level=RedactionLevelEnum(event.redaction_level.value),
            integrity_hash=event.integrity_hash,
        )
    
    async def update_action(
        self,
        thread_id: str,
        request: UpdateActionRequest,
        user_id: str,
    ) -> EventResponse:
        """
        PUT /threads/{thread_id}/actions/{action_id}
        
        Mettre à jour une action.
        """
        event = await self.service.update_action(
            thread_id=thread_id,
            actor_id=user_id,
            action_id=request.action_id,
            status=request.status,
            result=request.result,
        )
        
        return EventResponse(
            event_id=event.event_id,
            thread_id=event.thread_id,
            event_type=event.event_type.value,
            actor_type=ActorTypeEnum(event.actor_type.value),
            actor_id=event.actor_id,
            payload=event.payload,
            created_at=event.created_at,
            redaction_level=RedactionLevelEnum(event.redaction_level.value),
            integrity_hash=event.integrity_hash,
        )
    
    async def record_error(
        self,
        thread_id: str,
        request: RecordErrorRequest,
        user_id: str,
    ) -> EventResponse:
        """
        POST /threads/{thread_id}/errors
        
        Enregistrer une erreur (sans jugement).
        """
        event = await self.service.record_error(
            thread_id=thread_id,
            actor_id=user_id,
            error=request.error,
            context=request.context,
        )
        
        return EventResponse(
            event_id=event.event_id,
            thread_id=event.thread_id,
            event_type=event.event_type.value,
            actor_type=ActorTypeEnum(event.actor_type.value),
            actor_id=event.actor_id,
            payload=event.payload,
            created_at=event.created_at,
            redaction_level=RedactionLevelEnum(event.redaction_level.value),
            integrity_hash=event.integrity_hash,
        )
    
    async def record_learning(
        self,
        thread_id: str,
        request: RecordLearningRequest,
        user_id: str,
    ) -> EventResponse:
        """
        POST /threads/{thread_id}/learnings
        
        Enregistrer un apprentissage explicite.
        """
        event = await self.service.record_learning(
            thread_id=thread_id,
            actor_id=user_id,
            learning=request.learning,
            source_events=request.source_events,
        )
        
        return EventResponse(
            event_id=event.event_id,
            thread_id=event.thread_id,
            event_type=event.event_type.value,
            actor_type=ActorTypeEnum(event.actor_type.value),
            actor_id=event.actor_id,
            payload=event.payload,
            created_at=event.created_at,
            redaction_level=RedactionLevelEnum(event.redaction_level.value),
            integrity_hash=event.integrity_hash,
        )
    
    # ========================================================================
    # LIVE SESSIONS (Projection)
    # ========================================================================
    
    async def start_live(
        self,
        thread_id: str,
        request: StartLiveRequest,
        user_id: str,
    ) -> LiveSessionResponse:
        """
        POST /threads/{thread_id}/live/start
        
        Démarrer une session Live.
        """
        session = await self.service.start_live(
            thread_id=thread_id,
            initiator_id=user_id,
            participants=request.participants,
        )
        
        return LiveSessionResponse(
            session_id=session.session_id,
            thread_id=session.thread_id,
            started_at=session.started_at,
            ended_at=session.ended_at,
            participants=session.participants,
            summary=session.summary,
        )
    
    async def end_live(
        self,
        thread_id: str,
        request: EndLiveRequest,
        user_id: str,
    ) -> LiveSessionResponse:
        """
        POST /threads/{thread_id}/live/end
        
        Terminer une session Live.
        """
        session = await self.service.end_live(
            session_id=request.session_id,
            actor_id=user_id,
            generate_snapshot=request.generate_snapshot,
        )
        
        return LiveSessionResponse(
            session_id=session.session_id,
            thread_id=session.thread_id,
            started_at=session.started_at,
            ended_at=session.ended_at,
            participants=session.participants,
            summary=session.summary,
        )
    
    # ========================================================================
    # SNAPSHOTS
    # ========================================================================
    
    async def get_latest_snapshot(
        self,
        thread_id: str,
        snapshot_type: Optional[SnapshotTypeEnum] = None,
    ) -> Optional[SnapshotResponse]:
        """
        GET /threads/{thread_id}/snapshots/latest
        
        Récupérer le dernier snapshot.
        """
        from .thread_service import SnapshotType
        
        snapshot = await self.service.get_latest_snapshot(
            thread_id=thread_id,
            snapshot_type=SnapshotType(snapshot_type.value) if snapshot_type else None,
        )
        
        if not snapshot:
            return None
        
        return SnapshotResponse(
            snapshot_id=snapshot.snapshot_id,
            thread_id=snapshot.thread_id,
            snapshot_type=SnapshotTypeEnum(snapshot.snapshot_type.value),
            content=snapshot.content,
            references=snapshot.references,
            created_by=snapshot.created_by,
            created_at=snapshot.created_at,
        )
    
    async def generate_snapshot(
        self,
        thread_id: str,
        request: GenerateSnapshotRequest,
    ) -> SnapshotResponse:
        """
        POST /threads/{thread_id}/snapshots/generate
        
        Générer un nouveau snapshot (via agent mémoire).
        """
        from .thread_service import SnapshotType
        
        snapshot = await self.service.generate_snapshot(
            thread_id=thread_id,
            snapshot_type=SnapshotType(request.snapshot_type.value),
            trigger=request.trigger,
        )
        
        return SnapshotResponse(
            snapshot_id=snapshot.snapshot_id,
            thread_id=snapshot.thread_id,
            snapshot_type=SnapshotTypeEnum(snapshot.snapshot_type.value),
            content=snapshot.content,
            references=snapshot.references,
            created_by=snapshot.created_by,
            created_at=snapshot.created_at,
        )
    
    # ========================================================================
    # PARTICIPANTS & PERMISSIONS
    # ========================================================================
    
    async def get_participants(
        self,
        thread_id: str,
    ) -> List[ParticipantResponse]:
        """
        GET /threads/{thread_id}/participants
        
        Récupérer les participants du thread.
        """
        participants = await self.service.get_participants(thread_id)
        
        return [
            ParticipantResponse(
                thread_id=p.thread_id,
                subject_type=ActorTypeEnum(p.subject_type.value),
                subject_id=p.subject_id,
                role=ParticipantRoleEnum(p.role.value),
                permissions=p.permissions,
                created_at=p.created_at,
            )
            for p in participants
        ]
    
    async def add_participant(
        self,
        thread_id: str,
        request: AddParticipantRequest,
        user_id: str,
    ) -> ParticipantResponse:
        """
        POST /threads/{thread_id}/participants
        
        Ajouter un participant au thread.
        """
        from .thread_service import ActorType, ParticipantRole
        
        participant = await self.service.add_participant(
            thread_id=thread_id,
            actor_id=user_id,
            subject_type=ActorType(request.subject_type.value),
            subject_id=request.subject_id,
            role=ParticipantRole(request.role.value),
        )
        
        return ParticipantResponse(
            thread_id=participant.thread_id,
            subject_type=ActorTypeEnum(participant.subject_type.value),
            subject_id=participant.subject_id,
            role=ParticipantRoleEnum(participant.role.value),
            permissions=participant.permissions,
            created_at=participant.created_at,
        )
    
    async def remove_participant(
        self,
        thread_id: str,
        request: RemoveParticipantRequest,
        user_id: str,
    ) -> Dict[str, Any]:
        """
        DELETE /threads/{thread_id}/participants/{subject_id}
        
        Retirer un participant du thread.
        """
        success = await self.service.remove_participant(
            thread_id=thread_id,
            actor_id=user_id,
            subject_id=request.subject_id,
        )
        
        return {
            "success": success,
            "thread_id": thread_id,
            "removed_subject_id": request.subject_id,
        }
    
    # ========================================================================
    # LINKS
    # ========================================================================
    
    async def add_link(
        self,
        thread_id: str,
        request: AddLinkRequest,
        user_id: str,
    ) -> EventResponse:
        """
        POST /threads/{thread_id}/links
        
        Ajouter un lien vers un autre thread.
        """
        event = await self.service.add_link(
            thread_id=thread_id,
            actor_id=user_id,
            link_type=request.link_type,
            target_id=request.target_id,
            metadata=request.metadata,
        )
        
        return EventResponse(
            event_id=event.event_id,
            thread_id=event.thread_id,
            event_type=event.event_type.value,
            actor_type=ActorTypeEnum(event.actor_type.value),
            actor_id=event.actor_id,
            payload=event.payload,
            created_at=event.created_at,
            redaction_level=RedactionLevelEnum(event.redaction_level.value),
            integrity_hash=event.integrity_hash,
        )
    
    async def get_linked_threads(
        self,
        thread_id: str,
    ) -> List[Dict[str, Any]]:
        """
        GET /threads/{thread_id}/links
        
        Récupérer les threads liés.
        """
        return await self.service.get_linked_threads(thread_id)
    
    # ========================================================================
    # XR PROJECTION
    # ========================================================================
    
    async def get_xr_state(
        self,
        thread_id: str,
        user_id: str,
    ) -> XRStateResponse:
        """
        GET /threads/{thread_id}/xr
        
        Récupérer l'état XR dérivé du thread.
        L'environnement XR n'a PAS d'état propre!
        """
        state = await self.service.get_xr_state(thread_id, user_id)
        
        return XRStateResponse(
            thread_id=state["thread_id"],
            environment_id=state["environment_id"],
            founding_intent=state["founding_intent"],
            zones=state["zones"],
            generated_at=state["generated_at"],
        )
    
    # ========================================================================
    # STATISTICS
    # ========================================================================
    
    async def get_stats(self) -> ThreadStatsResponse:
        """
        GET /threads/stats
        
        Récupérer les statistiques.
        """
        stats = await self.service.get_stats()
        
        return ThreadStatsResponse(**stats)


# ============================================================================
# FASTAPI ROUTER (Uncomment in production)
# ============================================================================

"""
# In your main.py or routes/__init__.py:

from fastapi import APIRouter, HTTPException, Depends, Query, Path, Body
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/api/v2/threads", tags=["Threads"])
routes = ThreadRoutes()

def get_current_user():
    # Implement your auth logic
    return "current_user_id"

@router.post("")
async def create_thread(
    request: CreateThreadRequest,
    user_id: str = Depends(get_current_user),
):
    try:
        return await routes.create_thread(request, user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{thread_id}")
async def get_thread(
    thread_id: str = Path(...),
    user_id: str = Depends(get_current_user),
):
    try:
        return await routes.get_thread(thread_id, user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# ... etc for all routes
"""
