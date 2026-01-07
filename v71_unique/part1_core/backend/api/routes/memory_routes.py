"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                    CHE·NU™ — TRI-LAYER MEMORY ROUTES                         ║
║                    API Endpoints for Memory Architecture                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

ENDPOINTS:
- /memory/hot/*    → L1 Mémoire Chaude
- /memory/warm/*   → L2 Mémoire Subjective
- /memory/cold/*   → L3 Mémoire Froide
- /memory/context/* → Context Loading
- /memory/archive/* → Archiving
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field

from .services.tri_layer_memory import (
    memory_service,
    MemoryLayer,
    ConversationScope,
    ConversationStatus,
    ColdEntryType,
    HypothesisStatus,
)

router = APIRouter(prefix="/memory", tags=["Memory"])


# ═══════════════════════════════════════════════════════════════════════════════
# SCHEMAS
# ═══════════════════════════════════════════════════════════════════════════════

class InitializeHotRequest(BaseModel):
    agent_id: str
    conversation_id: str
    max_tokens: int = 8000
    max_messages: int = 50


class AddMessageRequest(BaseModel):
    role: str  # user | assistant | system
    content: str
    token_count: int
    metadata: Optional[Dict[str, Any]] = None


class UpdateReasoningRequest(BaseModel):
    current_task: Optional[str] = None
    pending_actions: Optional[List[str]] = None
    active_hypotheses: Optional[List[str]] = None
    confidence_level: Optional[float] = None
    last_checkpoint_id: Optional[str] = None


class ObjectivesRequest(BaseModel):
    objectives: List[str]


class ConstraintsRequest(BaseModel):
    constraints: List[str]


class AddSummaryRequest(BaseModel):
    source_conversation_id: str
    content: str
    key_points: List[str]
    entities: Optional[List[str]] = []
    sentiment: str = "neutral"
    vector_embedding: Optional[List[float]] = None


class AddDecisionRequest(BaseModel):
    conversation_id: str
    decision: str
    intention: str
    context_snapshot: str


class AddHypothesisRequest(BaseModel):
    statement: str
    confidence: float
    supporting_evidence: Optional[List[str]] = []
    contradicting_evidence: Optional[List[str]] = []


class UpdateHypothesisRequest(BaseModel):
    confidence: Optional[float] = None
    status: Optional[str] = None
    supporting_evidence: Optional[List[str]] = None
    contradicting_evidence: Optional[List[str]] = None


class AddPreferenceRequest(BaseModel):
    category: str
    key: str
    value: Any
    confidence: float
    source_conversations: Optional[List[str]] = []


class SearchRequest(BaseModel):
    query: str
    limit: int = 10


class ColdAccessRequest(BaseModel):
    requester_id: str
    entry_id: str
    reason: str
    access_type: str = "reference"


class ArchiveConversationRequest(BaseModel):
    conversation_id: str
    generate_summary: bool = True
    extract_decisions: bool = True
    preserve_artifacts: bool = True


class LoadContextRequest(BaseModel):
    agent_id: str
    conversation_id: str
    load_from_warm: bool = True
    load_from_cold: bool = False
    relevance_threshold: float = 0.5
    max_summaries: int = 5
    max_decisions: int = 3
    semantic_query: Optional[str] = None


class CreateConversationRequest(BaseModel):
    owner: str
    scope: str = "general"
    sphere_id: Optional[str] = None
    thread_id: Optional[str] = None
    tags: Optional[List[str]] = []


# ═══════════════════════════════════════════════════════════════════════════════
# L1 — HOT MEMORY ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/hot/initialize")
async def initialize_hot_memory(request: InitializeHotRequest):
    """
    Initialise la mémoire chaude pour un agent.
    
    RÈGLES:
    - 1 mémoire chaude par agent
    - Taille strictement limitée
    - Volatile (non persistée)
    """
    try:
        from .services.tri_layer_memory import HotMemoryConfig
        
        config = HotMemoryConfig(
            max_tokens=request.max_tokens,
            max_messages=request.max_messages
        )
        
        hot_memory = memory_service.hot.initialize(
            request.agent_id,
            UUID(request.conversation_id),
            config
        )
        
        return {
            "status": "initialized",
            "agent_id": hot_memory.agent_id,
            "conversation_id": str(hot_memory.conversation_id),
            "max_tokens": hot_memory.config.max_tokens,
            "utilization": hot_memory.utilization
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/hot/{agent_id}")
async def get_hot_memory(agent_id: str):
    """Récupère la mémoire chaude d'un agent."""
    hot_memory = memory_service.hot.get(agent_id)
    
    if not hot_memory:
        raise HTTPException(status_code=404, detail=f"No hot memory for agent {agent_id}")
    
    return {
        "agent_id": hot_memory.agent_id,
        "conversation_id": str(hot_memory.conversation_id),
        "messages": [
            {
                "id": str(m.id),
                "role": m.role,
                "content": m.content,
                "timestamp": m.timestamp.isoformat(),
                "token_count": m.token_count
            }
            for m in hot_memory.messages
        ],
        "current_objectives": hot_memory.current_objectives,
        "active_constraints": hot_memory.active_constraints,
        "reasoning_state": {
            "current_task": hot_memory.reasoning_state.current_task,
            "pending_actions": hot_memory.reasoning_state.pending_actions,
            "confidence_level": hot_memory.reasoning_state.confidence_level
        },
        "token_count": hot_memory.token_count,
        "utilization": hot_memory.utilization,
        "created_at": hot_memory.created_at.isoformat(),
        "last_activity": hot_memory.last_activity.isoformat()
    }


@router.post("/hot/{agent_id}/message")
async def add_hot_message(agent_id: str, request: AddMessageRequest):
    """Ajoute un message à la mémoire chaude."""
    try:
        hot_memory = memory_service.hot.add_message(
            agent_id,
            request.role,
            request.content,
            request.token_count,
            request.metadata
        )
        
        return {
            "status": "added",
            "token_count": hot_memory.token_count,
            "utilization": hot_memory.utilization,
            "message_count": len(hot_memory.messages)
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/hot/{agent_id}/reasoning")
async def update_reasoning_state(agent_id: str, request: UpdateReasoningRequest):
    """Met à jour l'état de raisonnement."""
    try:
        updates = {k: v for k, v in request.dict().items() if v is not None}
        hot_memory = memory_service.hot.update_reasoning_state(agent_id, **updates)
        
        return {
            "status": "updated",
            "reasoning_state": {
                "current_task": hot_memory.reasoning_state.current_task,
                "pending_actions": hot_memory.reasoning_state.pending_actions,
                "confidence_level": hot_memory.reasoning_state.confidence_level
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/hot/{agent_id}/objectives")
async def set_objectives(agent_id: str, request: ObjectivesRequest):
    """Définit les objectifs immédiats."""
    try:
        hot_memory = memory_service.hot.set_objectives(agent_id, request.objectives)
        return {"status": "set", "objectives": hot_memory.current_objectives}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/hot/{agent_id}/constraints")
async def set_constraints(agent_id: str, request: ConstraintsRequest):
    """Définit les contraintes courantes."""
    try:
        hot_memory = memory_service.hot.set_constraints(agent_id, request.constraints)
        return {"status": "set", "constraints": hot_memory.active_constraints}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/hot/{agent_id}")
async def clear_hot_memory(agent_id: str):
    """Efface la mémoire chaude."""
    memory_service.hot.clear(agent_id)
    return {"status": "cleared", "agent_id": agent_id}


# ═══════════════════════════════════════════════════════════════════════════════
# L2 — WARM MEMORY ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/warm/{owner_id}")
async def get_warm_memory(owner_id: str):
    """Récupère la mémoire subjective d'un owner."""
    warm = memory_service.warm.get_or_create(owner_id)
    
    return {
        "owner_id": warm.owner_id,
        "summaries": [
            {
                "id": str(s.id),
                "content": s.content,
                "key_points": s.key_points,
                "relevance_score": s.relevance_score,
                "created_at": s.created_at.isoformat()
            }
            for s in warm.summaries[-20:]  # Last 20
        ],
        "decisions": [
            {
                "id": str(d.id),
                "decision": d.decision,
                "intention": d.intention,
                "created_at": d.created_at.isoformat()
            }
            for d in warm.decisions[-10:]  # Last 10
        ],
        "active_hypotheses": [
            {
                "id": str(h.id),
                "statement": h.statement,
                "confidence": h.confidence,
                "status": h.status.value
            }
            for h in warm.active_hypotheses if h.status == HypothesisStatus.ACTIVE
        ],
        "preferences": [
            {
                "category": p.category,
                "key": p.key,
                "value": p.value,
                "confidence": p.confidence
            }
            for p in warm.preferences
        ],
        "entry_count": warm.entry_count,
        "last_updated": warm.last_updated.isoformat()
    }


@router.post("/warm/{owner_id}/summaries")
async def add_summary(owner_id: str, request: AddSummaryRequest):
    """Ajoute un résumé sémantique."""
    summary = memory_service.warm.add_summary(
        owner_id,
        UUID(request.source_conversation_id),
        request.content,
        request.key_points,
        request.entities,
        request.sentiment,
        request.vector_embedding
    )
    
    return {
        "id": str(summary.id),
        "status": "added",
        "relevance_score": summary.relevance_score
    }


@router.post("/warm/{owner_id}/decisions")
async def add_decision(owner_id: str, request: AddDecisionRequest):
    """Ajoute une décision."""
    decision = memory_service.warm.add_decision(
        owner_id,
        UUID(request.conversation_id),
        request.decision,
        request.intention,
        request.context_snapshot
    )
    
    return {
        "id": str(decision.id),
        "status": "added"
    }


@router.post("/warm/{owner_id}/hypotheses")
async def add_hypothesis(owner_id: str, request: AddHypothesisRequest):
    """Ajoute une hypothèse."""
    hypothesis = memory_service.warm.add_hypothesis(
        owner_id,
        request.statement,
        request.confidence,
        request.supporting_evidence,
        request.contradicting_evidence
    )
    
    return {
        "id": str(hypothesis.id),
        "status": "added",
        "confidence": hypothesis.confidence
    }


@router.put("/warm/{owner_id}/hypotheses/{hypothesis_id}")
async def update_hypothesis(owner_id: str, hypothesis_id: str, request: UpdateHypothesisRequest):
    """Met à jour une hypothèse."""
    updates = {k: v for k, v in request.dict().items() if v is not None}
    
    if "status" in updates:
        updates["status"] = HypothesisStatus(updates["status"])
    
    hypothesis = memory_service.warm.update_hypothesis(
        owner_id,
        UUID(hypothesis_id),
        **updates
    )
    
    if not hypothesis:
        raise HTTPException(status_code=404, detail="Hypothesis not found")
    
    return {
        "id": str(hypothesis.id),
        "status": "updated",
        "confidence": hypothesis.confidence
    }


@router.post("/warm/{owner_id}/preferences")
async def add_preference(owner_id: str, request: AddPreferenceRequest):
    """Ajoute une préférence."""
    preference = memory_service.warm.add_preference(
        owner_id,
        request.category,
        request.key,
        request.value,
        request.confidence,
        request.source_conversations
    )
    
    return {
        "id": str(preference.id),
        "status": "added",
        "category": preference.category,
        "key": preference.key
    }


@router.get("/warm/{owner_id}/preferences")
async def get_preferences(owner_id: str, category: Optional[str] = None):
    """Récupère les préférences."""
    preferences = memory_service.warm.get_preferences(owner_id, category)
    
    return {
        "preferences": [
            {
                "id": str(p.id),
                "category": p.category,
                "key": p.key,
                "value": p.value,
                "confidence": p.confidence
            }
            for p in preferences
        ]
    }


@router.post("/warm/{owner_id}/search")
async def search_warm_memory(owner_id: str, request: SearchRequest):
    """Recherche sémantique dans la mémoire subjective."""
    summaries = memory_service.warm.search_summaries(owner_id, request.query, request.limit)
    
    return {
        "summaries": [
            {
                "id": str(s.id),
                "content": s.content,
                "key_points": s.key_points,
                "relevance_score": s.relevance_score
            }
            for s in summaries
        ]
    }


@router.post("/warm/{owner_id}/compress")
async def compress_warm_memory(owner_id: str):
    """Compresse la mémoire subjective."""
    memory_service.warm._compress(owner_id)
    warm = memory_service.warm.get_or_create(owner_id)
    
    return {
        "status": "compressed",
        "entry_count": warm.entry_count
    }


# ═══════════════════════════════════════════════════════════════════════════════
# L3 — COLD MEMORY ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/cold/archive")
async def archive_to_cold(
    entry_type: str,
    reference_id: str,
    storage_location: str,
    original_conversation_id: str,
    owner_id: str
):
    """
    Archive une entrée dans la mémoire froide.
    
    PROPRIÉTÉS:
    - IMMUABLE après création
    - Jamais chargée en contexte LLM
    - Source de vérité
    """
    entry = memory_service.cold.archive(
        ColdEntryType(entry_type),
        reference_id,
        storage_location,
        UUID(original_conversation_id),
        owner_id,
        datetime.utcnow()
    )
    
    return {
        "id": str(entry.id),
        "status": "archived",
        "checksum": entry.checksum
    }


@router.post("/cold/access")
async def request_cold_access(request: ColdAccessRequest):
    """
    Demande accès à une entrée froide.
    
    RETOURNE UNE RÉFÉRENCE, JAMAIS LE CONTENU BRUT.
    """
    reference = memory_service.cold.request_access(
        UUID(request.entry_id),
        request.requester_id,
        request.reason,
        request.access_type
    )
    
    if not reference:
        raise HTTPException(status_code=404, detail="Entry not found or access denied")
    
    return {
        "granted": True,
        "reference": {
            "entry_id": str(reference.entry_id),
            "summary": reference.summary,
            "relevance_score": reference.relevance_score,
            "access_url": reference.access_url,
            "expires_at": reference.expires_at.isoformat()
        }
    }


@router.get("/cold/{owner_id}")
async def list_cold_entries(
    owner_id: str,
    entry_type: Optional[str] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    limit: int = Query(default=100, le=500)
):
    """Liste les entrées archivées."""
    from_dt = datetime.fromisoformat(from_date) if from_date else None
    to_dt = datetime.fromisoformat(to_date) if to_date else None
    type_enum = ColdEntryType(entry_type) if entry_type else None
    
    entries = memory_service.cold.list_entries(
        owner_id,
        type_enum,
        from_dt,
        to_dt,
        limit
    )
    
    return {
        "entries": [
            {
                "id": str(e.id),
                "type": e.type.value,
                "archived_at": e.archived_at.isoformat(),
                "access_count": e.access_count
            }
            for e in entries
        ],
        "total": len(entries)
    }


@router.get("/cold/{entry_id}/verify")
async def verify_cold_integrity(entry_id: str):
    """Vérifie l'intégrité d'une entrée."""
    result = memory_service.cold.verify_integrity(UUID(entry_id))
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# CONTEXT LOADING ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/context/load")
async def load_context(request: LoadContextRequest):
    """
    Charge le contexte pertinent pour le raisonnement.
    
    FLUX COGNITIF:
    Mémoire Froide → [résumé] → Mémoire Subjective → [sélection] → Mémoire Chaude
    """
    # Get owner_id from agent_id (simplified - should lookup)
    owner_id = request.agent_id  # In real impl, lookup owner from agent
    
    context = memory_service.context.load_context(
        request.agent_id,
        owner_id,
        request.semantic_query,
        request.relevance_threshold,
        request.max_summaries,
        request.max_decisions,
        request.load_from_cold
    )
    
    return {
        "relevant_summaries": [
            {
                "id": str(s.id),
                "content": s.content,
                "key_points": s.key_points,
                "relevance_score": s.relevance_score
            }
            for s in context["relevant_summaries"]
        ],
        "relevant_decisions": [
            {
                "id": str(d.id),
                "decision": d.decision,
                "intention": d.intention
            }
            for d in context["relevant_decisions"]
        ],
        "active_hypotheses": [
            {
                "id": str(h.id),
                "statement": h.statement,
                "confidence": h.confidence
            }
            for h in context["active_hypotheses"]
        ],
        "applicable_preferences": [
            {
                "category": p.category,
                "key": p.key,
                "value": p.value
            }
            for p in context["applicable_preferences"]
        ],
        "cold_references": [
            {
                "entry_id": str(r.entry_id),
                "summary": r.summary
            }
            for r in context["cold_references"]
        ],
        "total_tokens_loaded": context["total_tokens_loaded"],
        "load_time_ms": context["load_time_ms"]
    }


@router.post("/context/preload")
async def preload_context(agent_id: str, sphere_id: Optional[str] = None):
    """Précharge le contexte pour une nouvelle conversation."""
    # Simplified preload
    context = memory_service.context.load_context(
        agent_id,
        agent_id,
        None,
        0.3,
        3,
        2,
        False
    )
    
    return {
        "status": "preloaded",
        "summaries_loaded": len(context["relevant_summaries"]),
        "decisions_loaded": len(context["relevant_decisions"])
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ARCHIVING ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/archive")
async def archive_conversation(request: ArchiveConversationRequest):
    """Archive une conversation complète."""
    try:
        result = memory_service.archiving.archive_conversation(
            UUID(request.conversation_id),
            request.generate_summary,
            request.extract_decisions,
            request.preserve_artifacts
        )
        
        return {
            "conversation_id": str(result.conversation_id),
            "archived_at": result.archived_at.isoformat(),
            "summary_id": str(result.summary_id) if result.summary_id else None,
            "cold_entry_id": str(result.cold_entry_id),
            "extracted_decisions": result.extracted_decisions,
            "compression_ratio": result.compression_ratio
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/archive/policy")
async def get_archiving_policy():
    """Récupère la politique d'archivage."""
    # Return default policy
    return {
        "auto_archive_after_minutes": 60,
        "auto_archive_on_token_limit": True,
        "archive_on_close": True,
        "generate_summary": True,
        "extract_decisions": True,
        "warm_retention_days": 90,
        "cold_retention_years": 7
    }


# ═══════════════════════════════════════════════════════════════════════════════
# CONVERSATION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/conversations")
async def create_conversation(request: CreateConversationRequest):
    """Crée une nouvelle conversation."""
    from .services.tri_layer_memory import Conversation
    
    conversation = Conversation(
        conversation_id=uuid4(),
        owner=request.owner,
        scope=ConversationScope(request.scope),
        status=ConversationStatus.ACTIVE,
        sphere_id=request.sphere_id,
        thread_id=request.thread_id,
        tags=request.tags or []
    )
    
    memory_service.archiving.register_conversation(conversation)
    
    return {
        "conversation_id": str(conversation.conversation_id),
        "owner": conversation.owner,
        "scope": conversation.scope.value,
        "status": conversation.status.value,
        "created_at": conversation.created_at.isoformat()
    }


@router.post("/conversations/{conversation_id}/close")
async def close_conversation(conversation_id: str):
    """Ferme une conversation."""
    # In real impl, update conversation status
    return {
        "conversation_id": conversation_id,
        "status": "closed",
        "closed_at": datetime.utcnow().isoformat()
    }


# ═══════════════════════════════════════════════════════════════════════════════
# SESSION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/session/initialize")
async def initialize_session(agent_id: str, owner_id: str, preload_context: bool = True):
    """
    Initialise une session agent complète.
    
    FLUX:
    1. Crée conversation
    2. Initialise mémoire chaude
    3. Charge contexte depuis mémoire subjective
    """
    result = memory_service.initialize_agent_session(
        agent_id,
        owner_id,
        preload_context=preload_context
    )
    
    return {
        "status": result["status"],
        "conversation_id": str(result["conversation_id"]),
        "hot_memory_initialized": result["hot_memory"] is not None,
        "context_loaded": result["loaded_context"] is not None
    }


@router.post("/session/end")
async def end_session(agent_id: str, archive: bool = True):
    """Termine une session agent."""
    result = memory_service.end_agent_session(agent_id, archive)
    
    return {
        "status": "ended",
        "archived": result is not None,
        "archive_result": {
            "compression_ratio": result.compression_ratio
        } if result else None
    }


# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH CHECK
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/health")
async def memory_health():
    """Health check for memory service."""
    return {
        "status": "healthy",
        "service": "tri-layer-memory",
        "version": "1.1",
        "layers": {
            "hot": "active",
            "warm": "active",
            "cold": "active"
        }
    }
