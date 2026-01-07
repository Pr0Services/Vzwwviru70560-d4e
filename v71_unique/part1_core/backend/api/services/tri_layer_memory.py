"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                    CHE·NU™ — TRI-LAYER MEMORY SERVICE                        ║
║                    Backend Implementation — v1.1                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

ARCHITECTURE MÉMOIRE TRI-COUCHE:
- L1: Mémoire Chaude (HOT)   → Raisonnement actif, volatile
- L2: Mémoire Subjective (WARM) → Continuité, révisable  
- L3: Mémoire Froide (COLD)  → Archive immuable, traçable

PRINCIPE FONDAMENTAL:
"Aucune intelligence ne doit porter l'intégralité de son passé actif en mémoire."
Le contexte n'est JAMAIS empilé, il est ADRESSABLE.
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4
import hashlib
import json
import logging

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS & TYPES
# ═══════════════════════════════════════════════════════════════════════════════

class MemoryLayer(str, Enum):
    HOT = "hot"
    WARM = "warm"
    COLD = "cold"


class ConversationStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    FROZEN = "frozen"


class ConversationScope(str, Enum):
    GENERAL = "general"
    SPHERE = "sphere"
    TASK = "task"
    INCIDENT = "incident"


class MemoryContentType(str, Enum):
    MESSAGE = "message"
    DECISION = "decision"
    ARTIFACT = "artifact"
    SUMMARY = "summary"
    HYPOTHESIS = "hypothesis"
    PREFERENCE = "preference"
    MENTAL_MODEL = "mental_model"
    AUDIT_LOG = "audit_log"


class ColdEntryType(str, Enum):
    CONVERSATION_FULL = "conversation_full"
    ARTIFACT_VALIDATED = "artifact_validated"
    DECISION_FROZEN = "decision_frozen"
    AUDIT_LOG = "audit_log"
    SESSION_SNAPSHOT = "session_snapshot"


class TransformationType(str, Enum):
    NONE = "none"
    SUMMARIZE = "summarize"
    EXTRACT_DECISION = "extract_decision"
    ARCHIVE_FULL = "archive_full"


class HypothesisStatus(str, Enum):
    ACTIVE = "active"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"
    REVISED = "revised"


# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATIONS
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class HotMemoryConfig:
    """Configuration mémoire chaude"""
    max_tokens: int = 8000
    max_messages: int = 50
    ttl_seconds: int = 3600
    auto_archive_threshold: float = 0.8


@dataclass
class WarmMemoryConfig:
    """Configuration mémoire subjective"""
    max_entries: int = 1000
    compression_ratio: float = 0.1
    retention_days: int = 90
    revision_allowed: bool = True


@dataclass
class ColdMemoryConfig:
    """Configuration mémoire froide"""
    retention_years: int = 7
    encryption_required: bool = True
    immutable: bool = True  # TOUJOURS True
    audit_trail_required: bool = True


# ═══════════════════════════════════════════════════════════════════════════════
# DATA MODELS
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Conversation:
    """Unité de base: la conversation"""
    conversation_id: UUID
    owner: str  # agent_id | user_id
    scope: ConversationScope
    status: ConversationStatus
    linked_artifacts: List[str] = field(default_factory=list)
    summary_pointer: Optional[str] = None  # vector_ref
    created_at: datetime = field(default_factory=datetime.utcnow)
    closed_at: Optional[datetime] = None
    sphere_id: Optional[str] = None
    thread_id: Optional[str] = None
    parent_conversation_id: Optional[UUID] = None
    tags: List[str] = field(default_factory=list)
    token_count: int = 0


@dataclass
class HotMessage:
    """Message dans la mémoire chaude"""
    id: UUID
    role: str  # user | assistant | system
    content: str
    timestamp: datetime
    token_count: int
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ReasoningState:
    """État du raisonnement en cours"""
    current_task: Optional[str] = None
    pending_actions: List[str] = field(default_factory=list)
    active_hypotheses: List[str] = field(default_factory=list)
    confidence_level: float = 1.0
    last_checkpoint_id: Optional[str] = None


@dataclass
class HotMemory:
    """L1 — Mémoire Chaude d'un agent"""
    agent_id: str
    conversation_id: UUID
    messages: List[HotMessage] = field(default_factory=list)
    current_objectives: List[str] = field(default_factory=list)
    active_constraints: List[str] = field(default_factory=list)
    reasoning_state: ReasoningState = field(default_factory=ReasoningState)
    token_count: int = 0
    created_at: datetime = field(default_factory=datetime.utcnow)
    last_activity: datetime = field(default_factory=datetime.utcnow)
    config: HotMemoryConfig = field(default_factory=HotMemoryConfig)
    
    @property
    def utilization(self) -> float:
        """Pourcentage d'utilisation (0-1)"""
        return self.token_count / self.config.max_tokens if self.config.max_tokens > 0 else 0


@dataclass
class SemanticSummary:
    """Résumé sémantique d'une conversation"""
    id: UUID
    source_conversation_id: UUID
    content: str
    key_points: List[str] = field(default_factory=list)
    entities: List[str] = field(default_factory=list)
    sentiment: str = "neutral"  # positive | neutral | negative
    vector_embedding: Optional[List[float]] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    relevance_score: float = 1.0


@dataclass
class DecisionRecord:
    """Décision enregistrée"""
    id: UUID
    conversation_id: UUID
    decision: str
    intention: str
    context_snapshot: str
    outcome: Optional[str] = None  # success | failure | pending
    created_at: datetime = field(default_factory=datetime.utcnow)
    reviewed_at: Optional[datetime] = None


@dataclass
class Hypothesis:
    """Hypothèse active"""
    id: UUID
    statement: str
    confidence: float
    supporting_evidence: List[str] = field(default_factory=list)
    contradicting_evidence: List[str] = field(default_factory=list)
    status: HypothesisStatus = HypothesisStatus.ACTIVE
    created_at: datetime = field(default_factory=datetime.utcnow)
    last_evaluated: datetime = field(default_factory=datetime.utcnow)


@dataclass
class Preference:
    """Préférence apprise"""
    id: UUID
    category: str
    key: str
    value: Any
    confidence: float
    source_conversations: List[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)
    last_confirmed: datetime = field(default_factory=datetime.utcnow)


@dataclass
class MentalModel:
    """Modèle mental temporaire"""
    id: UUID
    name: str
    description: str
    assumptions: List[str] = field(default_factory=list)
    valid_until: Optional[datetime] = None
    applies_to: List[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class WarmMemory:
    """L2 — Mémoire Subjective d'un owner"""
    owner_id: str
    owner_type: str  # agent | user
    summaries: List[SemanticSummary] = field(default_factory=list)
    decisions: List[DecisionRecord] = field(default_factory=list)
    active_hypotheses: List[Hypothesis] = field(default_factory=list)
    preferences: List[Preference] = field(default_factory=list)
    mental_models: List[MentalModel] = field(default_factory=list)
    entry_count: int = 0
    last_updated: datetime = field(default_factory=datetime.utcnow)
    config: WarmMemoryConfig = field(default_factory=WarmMemoryConfig)


@dataclass
class ColdMemoryEntry:
    """Entrée dans la mémoire froide"""
    id: UUID
    type: ColdEntryType
    reference_id: str
    storage_location: str  # URI vers stockage
    original_conversation_id: UUID
    owner_id: str
    created_at: datetime
    archived_at: datetime = field(default_factory=datetime.utcnow)
    checksum: str = ""  # SHA-256
    signature: Optional[str] = None
    access_count: int = 0
    last_accessed: Optional[datetime] = None
    
    def __post_init__(self):
        if not self.checksum:
            self.checksum = self._compute_checksum()
    
    def _compute_checksum(self) -> str:
        """Calcule le checksum SHA-256"""
        data = f"{self.id}{self.reference_id}{self.original_conversation_id}{self.created_at}"
        return hashlib.sha256(data.encode()).hexdigest()


@dataclass
class ColdMemoryReference:
    """Référence à une entrée froide (jamais le contenu brut)"""
    entry_id: UUID
    summary: str
    relevance_score: float
    access_url: str
    expires_at: datetime


@dataclass
class ArchiveResult:
    """Résultat d'archivage"""
    conversation_id: UUID
    archived_at: datetime
    summary_id: Optional[UUID] = None
    cold_entry_id: UUID = field(default_factory=uuid4)
    extracted_decisions: List[str] = field(default_factory=list)
    original_tokens: int = 0
    summary_tokens: int = 0
    
    @property
    def compression_ratio(self) -> float:
        if self.original_tokens == 0:
            return 0
        return self.summary_tokens / self.original_tokens


# ═══════════════════════════════════════════════════════════════════════════════
# L1 — HOT MEMORY SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class HotMemoryService:
    """
    Service pour la mémoire chaude (L1)
    
    RÈGLES:
    - 1 mémoire chaude par agent
    - Taille strictement limitée
    - Jamais persistée brute
    - Détruite ou archivée à la fin d'un cycle
    
    SEULE COUCHE UTILISÉE POUR RAISONNER
    """
    
    def __init__(self):
        self._store: Dict[str, HotMemory] = {}
        self._archiving_service: Optional['ArchivingService'] = None
    
    def set_archiving_service(self, service: 'ArchivingService'):
        """Injection du service d'archivage"""
        self._archiving_service = service
    
    def initialize(
        self,
        agent_id: str,
        conversation_id: UUID,
        config: Optional[HotMemoryConfig] = None
    ) -> HotMemory:
        """Initialise la mémoire chaude pour un agent"""
        hot_memory = HotMemory(
            agent_id=agent_id,
            conversation_id=conversation_id,
            config=config or HotMemoryConfig()
        )
        self._store[agent_id] = hot_memory
        logger.info(f"[HotMemory] Initialized for agent {agent_id}")
        return hot_memory
    
    def get(self, agent_id: str) -> Optional[HotMemory]:
        """Récupère la mémoire chaude d'un agent"""
        return self._store.get(agent_id)
    
    def add_message(
        self,
        agent_id: str,
        role: str,
        content: str,
        token_count: int,
        metadata: Optional[Dict] = None
    ) -> HotMemory:
        """Ajoute un message à la mémoire chaude"""
        hot_memory = self.get(agent_id)
        if not hot_memory:
            raise ValueError(f"No hot memory for agent {agent_id}")
        
        message = HotMessage(
            id=uuid4(),
            role=role,
            content=content,
            timestamp=datetime.utcnow(),
            token_count=token_count,
            metadata=metadata or {}
        )
        
        # Vérifier limite tokens
        new_token_count = hot_memory.token_count + token_count
        if new_token_count > hot_memory.config.max_tokens:
            self._trigger_auto_archive(agent_id, hot_memory)
            # Après archivage, la mémoire est réinitialisée
            hot_memory = self.get(agent_id)
            if hot_memory:
                new_token_count = hot_memory.token_count + token_count
        
        # Ajouter message
        hot_memory.messages.append(message)
        hot_memory.token_count = new_token_count
        hot_memory.last_activity = datetime.utcnow()
        
        # Vérifier seuil warning
        utilization = hot_memory.utilization
        if utilization >= hot_memory.config.auto_archive_threshold:
            logger.warning(
                f"[HotMemory] Agent {agent_id} at {utilization*100:.1f}% capacity"
            )
        
        return hot_memory
    
    def update_reasoning_state(
        self,
        agent_id: str,
        **kwargs
    ) -> HotMemory:
        """Met à jour l'état de raisonnement"""
        hot_memory = self.get(agent_id)
        if not hot_memory:
            raise ValueError(f"No hot memory for agent {agent_id}")
        
        for key, value in kwargs.items():
            if hasattr(hot_memory.reasoning_state, key):
                setattr(hot_memory.reasoning_state, key, value)
        
        hot_memory.last_activity = datetime.utcnow()
        return hot_memory
    
    def set_objectives(self, agent_id: str, objectives: List[str]) -> HotMemory:
        """Définit les objectifs immédiats"""
        hot_memory = self.get(agent_id)
        if not hot_memory:
            raise ValueError(f"No hot memory for agent {agent_id}")
        
        hot_memory.current_objectives = objectives
        hot_memory.last_activity = datetime.utcnow()
        return hot_memory
    
    def set_constraints(self, agent_id: str, constraints: List[str]) -> HotMemory:
        """Définit les contraintes courantes"""
        hot_memory = self.get(agent_id)
        if not hot_memory:
            raise ValueError(f"No hot memory for agent {agent_id}")
        
        hot_memory.active_constraints = constraints
        hot_memory.last_activity = datetime.utcnow()
        return hot_memory
    
    def _trigger_auto_archive(self, agent_id: str, hot_memory: HotMemory):
        """Déclenche l'archivage automatique"""
        logger.info(f"[HotMemory] Auto-archiving for agent {agent_id}")
        
        if self._archiving_service:
            self._archiving_service.archive_conversation(
                hot_memory.conversation_id,
                generate_summary=True,
                extract_decisions=True
            )
        
        # Réinitialiser avec message système
        new_hot = self.initialize(
            agent_id,
            hot_memory.conversation_id,
            hot_memory.config
        )
        new_hot.messages.append(HotMessage(
            id=uuid4(),
            role="system",
            content="[Contexte précédent archivé. Résumé disponible dans la mémoire subjective.]",
            timestamp=datetime.utcnow(),
            token_count=20
        ))
        new_hot.token_count = 20
    
    def clear(self, agent_id: str):
        """Efface la mémoire chaude"""
        if agent_id in self._store:
            del self._store[agent_id]
            logger.info(f"[HotMemory] Cleared for agent {agent_id}")
    
    def get_utilization(self, agent_id: str) -> float:
        """Obtient le pourcentage d'utilisation"""
        hot_memory = self.get(agent_id)
        return hot_memory.utilization if hot_memory else 0


# ═══════════════════════════════════════════════════════════════════════════════
# L2 — WARM MEMORY SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class WarmMemoryService:
    """
    Service pour la mémoire subjective (L2)
    
    PROPRIÉTÉS:
    - Compressée
    - Synthétique
    - Révisable
    - Dépendante de l'agent/profil
    
    Deux agents peuvent avoir des mémoires subjectives différentes d'un même événement.
    """
    
    def __init__(self):
        self._store: Dict[str, WarmMemory] = {}
    
    def get_or_create(self, owner_id: str, owner_type: str = "user") -> WarmMemory:
        """Récupère ou crée la mémoire subjective"""
        if owner_id not in self._store:
            self._store[owner_id] = WarmMemory(
                owner_id=owner_id,
                owner_type=owner_type
            )
        return self._store[owner_id]
    
    def add_summary(
        self,
        owner_id: str,
        conversation_id: UUID,
        content: str,
        key_points: List[str],
        entities: List[str] = None,
        sentiment: str = "neutral",
        vector_embedding: List[float] = None
    ) -> SemanticSummary:
        """Ajoute un résumé sémantique"""
        warm = self.get_or_create(owner_id)
        
        summary = SemanticSummary(
            id=uuid4(),
            source_conversation_id=conversation_id,
            content=content,
            key_points=key_points,
            entities=entities or [],
            sentiment=sentiment,
            vector_embedding=vector_embedding
        )
        
        warm.summaries.append(summary)
        warm.entry_count += 1
        warm.last_updated = datetime.utcnow()
        
        # Vérifier limite et compresser si nécessaire
        if warm.entry_count > warm.config.max_entries:
            self._compress(owner_id)
        
        logger.info(f"[WarmMemory] Added summary for {owner_id}")
        return summary
    
    def add_decision(
        self,
        owner_id: str,
        conversation_id: UUID,
        decision: str,
        intention: str,
        context_snapshot: str
    ) -> DecisionRecord:
        """Ajoute une décision"""
        warm = self.get_or_create(owner_id)
        
        record = DecisionRecord(
            id=uuid4(),
            conversation_id=conversation_id,
            decision=decision,
            intention=intention,
            context_snapshot=context_snapshot
        )
        
        warm.decisions.append(record)
        warm.entry_count += 1
        warm.last_updated = datetime.utcnow()
        
        logger.info(f"[WarmMemory] Added decision for {owner_id}")
        return record
    
    def add_hypothesis(
        self,
        owner_id: str,
        statement: str,
        confidence: float,
        supporting_evidence: List[str] = None,
        contradicting_evidence: List[str] = None
    ) -> Hypothesis:
        """Ajoute une hypothèse"""
        warm = self.get_or_create(owner_id)
        
        hypothesis = Hypothesis(
            id=uuid4(),
            statement=statement,
            confidence=confidence,
            supporting_evidence=supporting_evidence or [],
            contradicting_evidence=contradicting_evidence or []
        )
        
        warm.active_hypotheses.append(hypothesis)
        warm.entry_count += 1
        warm.last_updated = datetime.utcnow()
        
        return hypothesis
    
    def update_hypothesis(
        self,
        owner_id: str,
        hypothesis_id: UUID,
        **kwargs
    ) -> Optional[Hypothesis]:
        """Met à jour une hypothèse"""
        warm = self.get_or_create(owner_id)
        
        for hyp in warm.active_hypotheses:
            if hyp.id == hypothesis_id:
                for key, value in kwargs.items():
                    if hasattr(hyp, key):
                        setattr(hyp, key, value)
                hyp.last_evaluated = datetime.utcnow()
                warm.last_updated = datetime.utcnow()
                return hyp
        
        return None
    
    def add_preference(
        self,
        owner_id: str,
        category: str,
        key: str,
        value: Any,
        confidence: float,
        source_conversations: List[str] = None
    ) -> Preference:
        """Ajoute une préférence"""
        warm = self.get_or_create(owner_id)
        
        # Vérifier si préférence existe déjà
        for pref in warm.preferences:
            if pref.category == category and pref.key == key:
                # Mettre à jour
                pref.value = value
                pref.confidence = confidence
                if source_conversations:
                    pref.source_conversations.extend(source_conversations)
                pref.last_confirmed = datetime.utcnow()
                warm.last_updated = datetime.utcnow()
                return pref
        
        # Nouvelle préférence
        preference = Preference(
            id=uuid4(),
            category=category,
            key=key,
            value=value,
            confidence=confidence,
            source_conversations=source_conversations or []
        )
        
        warm.preferences.append(preference)
        warm.entry_count += 1
        warm.last_updated = datetime.utcnow()
        
        return preference
    
    def get_preferences(
        self,
        owner_id: str,
        category: Optional[str] = None
    ) -> List[Preference]:
        """Récupère les préférences"""
        warm = self.get_or_create(owner_id)
        
        if category:
            return [p for p in warm.preferences if p.category == category]
        return warm.preferences
    
    def get_active_hypotheses(self, owner_id: str) -> List[Hypothesis]:
        """Récupère les hypothèses actives"""
        warm = self.get_or_create(owner_id)
        return [h for h in warm.active_hypotheses if h.status == HypothesisStatus.ACTIVE]
    
    def search_summaries(
        self,
        owner_id: str,
        query: str,
        limit: int = 10
    ) -> List[SemanticSummary]:
        """Recherche sémantique (simplifiée - sans embeddings)"""
        warm = self.get_or_create(owner_id)
        
        # Recherche simple par contenu (à remplacer par recherche vectorielle)
        query_lower = query.lower()
        scored = []
        
        for summary in warm.summaries:
            score = 0
            if query_lower in summary.content.lower():
                score += 0.5
            for kp in summary.key_points:
                if query_lower in kp.lower():
                    score += 0.3
            for entity in summary.entities:
                if query_lower in entity.lower():
                    score += 0.2
            
            if score > 0:
                scored.append((summary, score))
        
        scored.sort(key=lambda x: x[1], reverse=True)
        return [s[0] for s in scored[:limit]]
    
    def _compress(self, owner_id: str):
        """Compresse la mémoire subjective"""
        warm = self.get_or_create(owner_id)
        
        # Retirer les entrées les plus anciennes avec faible relevance
        if len(warm.summaries) > warm.config.max_entries // 2:
            warm.summaries.sort(key=lambda s: s.relevance_score, reverse=True)
            warm.summaries = warm.summaries[:warm.config.max_entries // 2]
        
        warm.entry_count = (
            len(warm.summaries) + 
            len(warm.decisions) + 
            len(warm.active_hypotheses) + 
            len(warm.preferences) +
            len(warm.mental_models)
        )
        
        logger.info(f"[WarmMemory] Compressed memory for {owner_id}")


# ═══════════════════════════════════════════════════════════════════════════════
# L3 — COLD MEMORY SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class ColdMemoryService:
    """
    Service pour la mémoire froide (L3)
    
    PROPRIÉTÉS:
    - Jamais chargée en contexte LLM
    - Accessible uniquement par référence
    - Non modifiable (IMMUABLE)
    - Juridiquement et causalement traçable
    
    C'est la SOURCE DE VÉRITÉ, jamais le moteur de raisonnement.
    """
    
    def __init__(self):
        self._store: Dict[UUID, ColdMemoryEntry] = {}
        self._access_log: List[Dict] = []
    
    def archive(
        self,
        entry_type: ColdEntryType,
        reference_id: str,
        storage_location: str,
        original_conversation_id: UUID,
        owner_id: str,
        created_at: datetime
    ) -> ColdMemoryEntry:
        """Archive une entrée (IMMUABLE après création)"""
        entry = ColdMemoryEntry(
            id=uuid4(),
            type=entry_type,
            reference_id=reference_id,
            storage_location=storage_location,
            original_conversation_id=original_conversation_id,
            owner_id=owner_id,
            created_at=created_at
        )
        
        self._store[entry.id] = entry
        logger.info(f"[ColdMemory] Archived entry {entry.id} type={entry_type.value}")
        
        return entry
    
    def request_access(
        self,
        entry_id: UUID,
        requester_id: str,
        reason: str,
        access_type: str = "reference"
    ) -> Optional[ColdMemoryReference]:
        """
        Demande accès à une entrée froide
        RETOURNE UNE RÉFÉRENCE, JAMAIS LE CONTENU BRUT
        """
        entry = self._store.get(entry_id)
        if not entry:
            logger.warning(f"[ColdMemory] Entry {entry_id} not found")
            return None
        
        # Log l'accès (audit trail)
        self._access_log.append({
            "entry_id": str(entry_id),
            "requester_id": requester_id,
            "reason": reason,
            "access_type": access_type,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Mettre à jour compteur d'accès
        entry.access_count += 1
        entry.last_accessed = datetime.utcnow()
        
        # Générer référence temporaire
        reference = ColdMemoryReference(
            entry_id=entry_id,
            summary=f"Archive de {entry.type.value} du {entry.created_at.isoformat()}",
            relevance_score=1.0,
            access_url=f"/cold-storage/{entry.storage_location}",
            expires_at=datetime.utcnow() + timedelta(hours=1)
        )
        
        logger.info(f"[ColdMemory] Access granted to {entry_id} for {requester_id}")
        return reference
    
    def list_entries(
        self,
        owner_id: str,
        entry_type: Optional[ColdEntryType] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None,
        limit: int = 100
    ) -> List[ColdMemoryEntry]:
        """Liste les entrées archivées"""
        entries = [e for e in self._store.values() if e.owner_id == owner_id]
        
        if entry_type:
            entries = [e for e in entries if e.type == entry_type]
        
        if from_date:
            entries = [e for e in entries if e.archived_at >= from_date]
        
        if to_date:
            entries = [e for e in entries if e.archived_at <= to_date]
        
        entries.sort(key=lambda e: e.archived_at, reverse=True)
        return entries[:limit]
    
    def verify_integrity(self, entry_id: UUID) -> Dict[str, Any]:
        """Vérifie l'intégrité d'une entrée"""
        entry = self._store.get(entry_id)
        if not entry:
            return {"valid": False, "error": "Entry not found"}
        
        expected_checksum = entry._compute_checksum()
        is_valid = entry.checksum == expected_checksum
        
        return {
            "valid": is_valid,
            "checksum": entry.checksum,
            "computed": expected_checksum
        }
    
    def get_audit_log(
        self,
        entry_id: Optional[UUID] = None,
        requester_id: Optional[str] = None
    ) -> List[Dict]:
        """Récupère le log d'audit"""
        logs = self._access_log
        
        if entry_id:
            logs = [l for l in logs if l["entry_id"] == str(entry_id)]
        
        if requester_id:
            logs = [l for l in logs if l["requester_id"] == requester_id]
        
        return logs


# ═══════════════════════════════════════════════════════════════════════════════
# ARCHIVING SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class ArchivingService:
    """Service d'archivage des conversations"""
    
    def __init__(
        self,
        warm_service: WarmMemoryService,
        cold_service: ColdMemoryService
    ):
        self.warm = warm_service
        self.cold = cold_service
        self._conversations: Dict[UUID, Conversation] = {}
    
    def register_conversation(self, conversation: Conversation):
        """Enregistre une conversation"""
        self._conversations[conversation.conversation_id] = conversation
    
    def archive_conversation(
        self,
        conversation_id: UUID,
        generate_summary: bool = True,
        extract_decisions: bool = True,
        preserve_artifacts: bool = True
    ) -> ArchiveResult:
        """Archive une conversation complète"""
        conversation = self._conversations.get(conversation_id)
        if not conversation:
            raise ValueError(f"Conversation {conversation_id} not found")
        
        result = ArchiveResult(
            conversation_id=conversation_id,
            archived_at=datetime.utcnow(),
            original_tokens=conversation.token_count
        )
        
        # 1. Générer résumé si demandé
        if generate_summary:
            summary = self._generate_summary(conversation)
            self.warm.add_summary(
                owner_id=conversation.owner,
                conversation_id=conversation_id,
                content=summary["content"],
                key_points=summary["key_points"],
                entities=summary.get("entities", []),
                sentiment=summary.get("sentiment", "neutral")
            )
            result.summary_tokens = len(summary["content"]) // 4  # Approximation
        
        # 2. Extraire décisions si demandé
        if extract_decisions:
            decisions = self._extract_decisions(conversation)
            for decision in decisions:
                self.warm.add_decision(
                    owner_id=conversation.owner,
                    conversation_id=conversation_id,
                    decision=decision["decision"],
                    intention=decision["intention"],
                    context_snapshot=decision["context"]
                )
                result.extracted_decisions.append(decision["decision"])
        
        # 3. Archiver dans mémoire froide
        cold_entry = self.cold.archive(
            entry_type=ColdEntryType.CONVERSATION_FULL,
            reference_id=str(conversation_id),
            storage_location=f"conversations/{conversation_id}.json",
            original_conversation_id=conversation_id,
            owner_id=conversation.owner,
            created_at=conversation.created_at
        )
        result.cold_entry_id = cold_entry.id
        
        # 4. Marquer conversation comme archivée
        conversation.status = ConversationStatus.ARCHIVED
        conversation.closed_at = datetime.utcnow()
        
        logger.info(f"[Archiving] Conversation {conversation_id} archived successfully")
        return result
    
    def _generate_summary(self, conversation: Conversation) -> Dict:
        """Génère un résumé sémantique (placeholder - à connecter à LLM)"""
        # TODO: Appeler LLM pour générer résumé
        return {
            "content": f"Résumé de la conversation {conversation.conversation_id}",
            "key_points": ["Point 1", "Point 2"],
            "entities": [],
            "sentiment": "neutral"
        }
    
    def _extract_decisions(self, conversation: Conversation) -> List[Dict]:
        """Extrait les décisions (placeholder - à connecter à LLM)"""
        # TODO: Appeler LLM pour extraire décisions
        return []


# ═══════════════════════════════════════════════════════════════════════════════
# CONTEXT LOADER SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class ContextLoaderService:
    """
    Service de chargement de contexte sélectif
    
    FLUX COGNITIF:
    Mémoire Froide → [résumé] → Mémoire Subjective → [sélection] → Mémoire Chaude
    """
    
    def __init__(
        self,
        warm_service: WarmMemoryService,
        cold_service: ColdMemoryService
    ):
        self.warm = warm_service
        self.cold = cold_service
    
    def load_context(
        self,
        agent_id: str,
        owner_id: str,
        semantic_query: Optional[str] = None,
        relevance_threshold: float = 0.5,
        max_summaries: int = 5,
        max_decisions: int = 3,
        include_cold_refs: bool = False
    ) -> Dict[str, Any]:
        """
        Charge le contexte pertinent pour le raisonnement
        
        RETOURNE:
        - Résumés pertinents (L2)
        - Décisions pertinentes (L2)
        - Hypothèses actives (L2)
        - Préférences applicables (L2)
        - Références froides optionnelles (L3 - jamais contenu brut)
        """
        start_time = datetime.utcnow()
        
        warm = self.warm.get_or_create(owner_id)
        
        # Sélectionner résumés pertinents
        if semantic_query:
            summaries = self.warm.search_summaries(owner_id, semantic_query, max_summaries)
        else:
            summaries = sorted(
                warm.summaries,
                key=lambda s: s.relevance_score,
                reverse=True
            )[:max_summaries]
        
        # Filtrer par seuil de pertinence
        summaries = [s for s in summaries if s.relevance_score >= relevance_threshold]
        
        # Sélectionner décisions récentes
        decisions = sorted(
            warm.decisions,
            key=lambda d: d.created_at,
            reverse=True
        )[:max_decisions]
        
        # Hypothèses actives
        hypotheses = self.warm.get_active_hypotheses(owner_id)
        
        # Préférences
        preferences = warm.preferences
        
        # Références froides (optionnel)
        cold_refs = []
        if include_cold_refs:
            entries = self.cold.list_entries(owner_id, limit=5)
            for entry in entries:
                ref = self.cold.request_access(
                    entry.id,
                    agent_id,
                    "Context loading"
                )
                if ref:
                    cold_refs.append(ref)
        
        load_time = (datetime.utcnow() - start_time).total_seconds() * 1000
        
        return {
            "relevant_summaries": summaries,
            "relevant_decisions": decisions,
            "active_hypotheses": hypotheses,
            "applicable_preferences": preferences,
            "cold_references": cold_refs,
            "total_tokens_loaded": sum(len(s.content) // 4 for s in summaries),
            "sources_consulted": len(summaries) + len(decisions),
            "load_time_ms": load_time
        }


# ═══════════════════════════════════════════════════════════════════════════════
# UNIFIED MEMORY SERVICE (Facade)
# ═══════════════════════════════════════════════════════════════════════════════

class TriLayerMemoryService:
    """
    Service unifié pour l'architecture mémoire tri-couche
    
    FAÇADE exposant:
    - hot: L1 Mémoire Chaude
    - warm: L2 Mémoire Subjective
    - cold: L3 Mémoire Froide
    - archiving: Service d'archivage
    - context: Chargement contexte
    """
    
    def __init__(self):
        self.hot = HotMemoryService()
        self.warm = WarmMemoryService()
        self.cold = ColdMemoryService()
        self.archiving = ArchivingService(self.warm, self.cold)
        self.context = ContextLoaderService(self.warm, self.cold)
        
        # Injection circulaire
        self.hot.set_archiving_service(self.archiving)
    
    def initialize_agent_session(
        self,
        agent_id: str,
        owner_id: str,
        conversation_id: Optional[UUID] = None,
        preload_context: bool = True
    ) -> Dict[str, Any]:
        """
        Initialise une session agent avec contexte chargé
        
        FLUX:
        1. Crée conversation
        2. Initialise mémoire chaude
        3. Charge contexte depuis mémoire subjective
        4. Retourne contexte prêt pour raisonnement
        """
        conv_id = conversation_id or uuid4()
        
        # Créer conversation
        conversation = Conversation(
            conversation_id=conv_id,
            owner=owner_id,
            scope=ConversationScope.GENERAL,
            status=ConversationStatus.ACTIVE
        )
        self.archiving.register_conversation(conversation)
        
        # Initialiser mémoire chaude
        hot_memory = self.hot.initialize(agent_id, conv_id)
        
        # Charger contexte si demandé
        loaded_context = None
        if preload_context:
            loaded_context = self.context.load_context(
                agent_id=agent_id,
                owner_id=owner_id,
                max_summaries=3,
                max_decisions=2
            )
        
        return {
            "conversation_id": conv_id,
            "hot_memory": hot_memory,
            "loaded_context": loaded_context,
            "status": "initialized"
        }
    
    def end_agent_session(
        self,
        agent_id: str,
        archive: bool = True
    ) -> Optional[ArchiveResult]:
        """
        Termine une session agent
        
        FLUX:
        1. Archive conversation si demandé
        2. Efface mémoire chaude
        """
        hot_memory = self.hot.get(agent_id)
        if not hot_memory:
            return None
        
        result = None
        if archive:
            result = self.archiving.archive_conversation(
                hot_memory.conversation_id,
                generate_summary=True,
                extract_decisions=True
            )
        
        self.hot.clear(agent_id)
        
        return result


# ═══════════════════════════════════════════════════════════════════════════════
# SINGLETON INSTANCE
# ═══════════════════════════════════════════════════════════════════════════════

memory_service = TriLayerMemoryService()
