"""
CHE·NU™ — Agent Stagiaire & Backlogs
Version: V1.0
Date: 2026-01-07

L'agent stagiaire n'existe pas pour répondre.
Il existe pour apprendre à mieux apprendre.

GOUVERNANCE > EXÉCUTION
"""

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Optional, List, Dict, Any
from uuid import uuid4


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class ConversationState(str, Enum):
    HOT = "hot"
    COOLING = "cooling"
    ENDED = "ended"
    STAGIARY_REVIEW = "stagiary_review"
    COOLDOWN = "cooldown"


class UserSignal(str, Enum):
    SILENT = "silent"
    REPHRASE = "rephrase"
    CORRECT = "correct"
    APPROVE = "approve"
    UNKNOWN = "unknown"


class LearningValue(str, Enum):
    LOW = "low"
    MEDIUM = "med"
    HIGH = "high"


class RecurrenceEstimate(str, Enum):
    LOW = "low"
    MEDIUM = "med"
    HIGH = "high"


class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "med"
    HIGH = "high"


class PromotionStatus(str, Enum):
    NONE = "none"
    CANDIDATE = "candidate"
    PROMOTED = "promoted"
    REJECTED = "rejected"


class ReviewDecision(str, Enum):
    SILENCE = "silence"
    NOTE = "note"
    QUESTION = "question"


class PromotionDecision(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class StagiaireNote:
    note_id: str = field(default_factory=lambda: str(uuid4()))
    timestamp: datetime = field(default_factory=datetime.utcnow)
    sphere: str = ""
    sector: Optional[str] = None
    intent_summary: str = ""
    ambiguities: List[str] = field(default_factory=list)
    outsourcing_used: bool = False
    outsourcing_reason: Optional[str] = None
    user_signal: UserSignal = UserSignal.UNKNOWN
    learning_value: LearningValue = LearningValue.MEDIUM
    recurrence_estimate: RecurrenceEstimate = RecurrenceEstimate.LOW
    priority: Priority = Priority.LOW
    question_candidate: Optional[str] = None
    promotion_status: PromotionStatus = PromotionStatus.NONE
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "note_id": self.note_id,
            "timestamp": self.timestamp.isoformat(),
            "sphere": self.sphere,
            "sector": self.sector,
            "intent_summary": self.intent_summary,
            "ambiguities": self.ambiguities,
            "outsourcing_used": self.outsourcing_used,
            "outsourcing_reason": self.outsourcing_reason,
            "user_signal": self.user_signal.value,
            "learning_value": self.learning_value.value,
            "recurrence_estimate": self.recurrence_estimate.value,
            "priority": self.priority.value,
            "question_candidate": self.question_candidate,
            "promotion_status": self.promotion_status.value,
        }


@dataclass
class PromotionCandidate:
    candidate_id: str = field(default_factory=lambda: str(uuid4()))
    note_ids: List[str] = field(default_factory=list)
    sphere: str = ""
    sector: Optional[str] = None
    pattern_title: str = ""
    pattern_description: str = ""
    evidence_count: int = 1
    promotion_decision: PromotionDecision = PromotionDecision.PENDING
    review_notes: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "candidate_id": self.candidate_id,
            "note_ids": self.note_ids,
            "sphere": self.sphere,
            "sector": self.sector,
            "pattern_title": self.pattern_title,
            "pattern_description": self.pattern_description,
            "evidence_count": self.evidence_count,
            "promotion_decision": self.promotion_decision.value,
            "review_notes": self.review_notes,
        }


@dataclass
class CooldownState:
    cooldown_until: Optional[datetime] = None
    last_review_result: Optional[ReviewDecision] = None
    
    def is_active(self) -> bool:
        if self.cooldown_until is None:
            return False
        return datetime.utcnow() < self.cooldown_until
    
    def activate(self, minutes: int = 15):
        self.cooldown_until = datetime.utcnow() + timedelta(minutes=minutes)
        self.last_review_result = ReviewDecision.SILENCE
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "cooldown_until": self.cooldown_until.isoformat() if self.cooldown_until else None,
            "last_review_result": self.last_review_result.value if self.last_review_result else None,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# MACHINE D'ÉTAT
# ═══════════════════════════════════════════════════════════════════════════════

class ConversationStateMachine:
    """Machine d'état pour le cycle de vie d'une conversation."""
    
    VALID_TRANSITIONS = {
        ConversationState.HOT: [ConversationState.COOLING],
        ConversationState.COOLING: [ConversationState.ENDED, ConversationState.HOT],
        ConversationState.ENDED: [ConversationState.STAGIARY_REVIEW],
        ConversationState.STAGIARY_REVIEW: [ConversationState.COOLDOWN, ConversationState.HOT],
        ConversationState.COOLDOWN: [ConversationState.HOT],
    }
    
    def __init__(self, conversation_id: str):
        self.conversation_id = conversation_id
        self.state = ConversationState.HOT
        self.state_history: List[Dict[str, Any]] = []
        self._log_transition(None, ConversationState.HOT, "init")
    
    def _log_transition(self, from_state, to_state, trigger):
        self.state_history.append({
            "timestamp": datetime.utcnow().isoformat(),
            "from": from_state.value if from_state else None,
            "to": to_state.value,
            "trigger": trigger,
        })
    
    def can_transition(self, to_state: ConversationState) -> bool:
        return to_state in self.VALID_TRANSITIONS.get(self.state, [])
    
    def transition(self, to_state: ConversationState, trigger: str = "manual") -> bool:
        if not self.can_transition(to_state):
            return False
        from_state = self.state
        self.state = to_state
        self._log_transition(from_state, to_state, trigger)
        return True
    
    def to_cooling(self) -> bool:
        return self.transition(ConversationState.COOLING, "response_complete")
    
    def to_ended(self) -> bool:
        return self.transition(ConversationState.ENDED, "inactivity_threshold")
    
    def to_stagiary_review(self) -> bool:
        return self.transition(ConversationState.STAGIARY_REVIEW, "stagiary_activation")
    
    def to_cooldown(self) -> bool:
        return self.transition(ConversationState.COOLDOWN, "silence_decision")
    
    def to_hot(self, trigger: str = "activity_detected") -> bool:
        if self.state in [ConversationState.COOLING, ConversationState.STAGIARY_REVIEW, ConversationState.COOLDOWN]:
            return self.transition(ConversationState.HOT, trigger)
        return False


# ═══════════════════════════════════════════════════════════════════════════════
# AGENT STAGIAIRE
# ═══════════════════════════════════════════════════════════════════════════════

class AgentStagiaire:
    """
    Agent Stagiaire CHE·NU™
    
    OBJECTIF UNIQUE: Prioriser la qualité de l'apprentissage futur.
    - Moins de notes, mais meilleures
    - Moins de certitudes, plus de questions
    - Moins de stockage, plus de sens
    
    RÈGLE: Une note utile est une note écrite avec curiosité, pas avec certitude.
    """
    
    COOLDOWN_MINUTES = 15
    
    def __init__(self):
        self._notes: Dict[str, StagiaireNote] = {}
        self._candidates: Dict[str, PromotionCandidate] = {}
        self._cooldowns: Dict[str, CooldownState] = {}
        self._state_machines: Dict[str, ConversationStateMachine] = {}
    
    def get_or_create_state_machine(self, conversation_id: str) -> ConversationStateMachine:
        if conversation_id not in self._state_machines:
            self._state_machines[conversation_id] = ConversationStateMachine(conversation_id)
        return self._state_machines[conversation_id]
    
    def get_cooldown_state(self, conversation_id: str) -> CooldownState:
        if conversation_id not in self._cooldowns:
            self._cooldowns[conversation_id] = CooldownState()
        return self._cooldowns[conversation_id]
    
    def is_cooldown_active(self, conversation_id: str) -> bool:
        return self.get_cooldown_state(conversation_id).is_active()
    
    def can_activate(self, conversation_id: str) -> bool:
        sm = self.get_or_create_state_machine(conversation_id)
        if sm.state != ConversationState.ENDED:
            return False
        if self.is_cooldown_active(conversation_id):
            return False
        return True
    
    def activate_review(self, conversation_id: str) -> bool:
        if not self.can_activate(conversation_id):
            return False
        sm = self.get_or_create_state_machine(conversation_id)
        return sm.to_stagiary_review()
    
    def review_conversation(
        self,
        conversation_id: str,
        sphere: str,
        sector: Optional[str],
        conversation_summary: Dict[str, Any],
    ) -> ReviewDecision:
        sm = self.get_or_create_state_machine(conversation_id)
        
        if sm.state != ConversationState.STAGIARY_REVIEW:
            raise RuntimeError("Stagiaire non activé pour cette conversation")
        
        analysis = self._analyze_conversation(conversation_summary)
        
        if not analysis["worth_noting"]:
            self.get_cooldown_state(conversation_id).activate(self.COOLDOWN_MINUTES)
            sm.to_cooldown()
            return ReviewDecision.SILENCE
        
        note = StagiaireNote(
            sphere=sphere,
            sector=sector,
            intent_summary=analysis["intent_summary"],
            ambiguities=analysis["ambiguities"],
            outsourcing_used=analysis["outsourcing_used"],
            outsourcing_reason=analysis.get("outsourcing_reason"),
            user_signal=analysis["user_signal"],
            learning_value=analysis["learning_value"],
            recurrence_estimate=analysis["recurrence_estimate"],
            priority=analysis["priority"],
            question_candidate=analysis.get("question_candidate"),
        )
        
        self._notes[note.note_id] = note
        sm.to_hot("note_created")
        
        if analysis.get("question_candidate"):
            return ReviewDecision.QUESTION
        return ReviewDecision.NOTE
    
    def _analyze_conversation(self, summary: Dict[str, Any]) -> Dict[str, Any]:
        result = {
            "worth_noting": False,
            "intent_summary": "",
            "ambiguities": [],
            "outsourcing_used": False,
            "outsourcing_reason": None,
            "user_signal": UserSignal.UNKNOWN,
            "learning_value": LearningValue.LOW,
            "recurrence_estimate": RecurrenceEstimate.LOW,
            "priority": Priority.LOW,
            "question_candidate": None,
        }
        
        intent = summary.get("intent", "")
        ambiguities = summary.get("ambiguities", [])
        user_reactions = summary.get("user_reactions", [])
        outsourcing = summary.get("outsourcing", {})
        is_new_pattern = summary.get("is_new_pattern", False)
        complexity = summary.get("complexity", "low")
        
        if not is_new_pattern and not ambiguities:
            return result
        if complexity == "trivial":
            return result
        
        result["worth_noting"] = True
        result["intent_summary"] = intent[:200]
        result["ambiguities"] = ambiguities[:3]
        
        if "correction" in user_reactions:
            result["user_signal"] = UserSignal.CORRECT
        elif "rephrase" in user_reactions:
            result["user_signal"] = UserSignal.REPHRASE
        elif "approval" in user_reactions:
            result["user_signal"] = UserSignal.APPROVE
        elif not user_reactions:
            result["user_signal"] = UserSignal.SILENT
        
        if outsourcing.get("used"):
            result["outsourcing_used"] = True
            result["outsourcing_reason"] = outsourcing.get("reason")
        
        if is_new_pattern:
            result["learning_value"] = LearningValue.HIGH
            result["recurrence_estimate"] = RecurrenceEstimate.MEDIUM
            result["priority"] = Priority.HIGH
        elif len(ambiguities) > 1:
            result["learning_value"] = LearningValue.MEDIUM
            result["priority"] = Priority.MEDIUM
        
        if summary.get("needs_clarification") and len(ambiguities) == 1:
            result["question_candidate"] = f"Clarification sur: {ambiguities[0]}"
        
        return result
    
    def get_promotion_candidates(self, sphere: str = None) -> List[StagiaireNote]:
        notes = list(self._notes.values())
        if sphere:
            notes = [n for n in notes if n.sphere == sphere]
        
        candidates = []
        for note in notes:
            if note.promotion_status != PromotionStatus.NONE:
                continue
            if note.learning_value == LearningValue.HIGH:
                candidates.append(note)
            elif note.recurrence_estimate in [RecurrenceEstimate.MEDIUM, RecurrenceEstimate.HIGH]:
                candidates.append(note)
        return candidates
    
    def create_promotion_candidate(self, note_ids: List[str], pattern_title: str, pattern_description: str) -> PromotionCandidate:
        notes = [self._notes[nid] for nid in note_ids if nid in self._notes]
        if not notes:
            raise ValueError("Aucune note valide")
        
        spheres = set(n.sphere for n in notes)
        if len(spheres) > 1:
            raise ValueError("Notes de sphères différentes")
        
        candidate = PromotionCandidate(
            note_ids=note_ids,
            sphere=notes[0].sphere,
            sector=notes[0].sector,
            pattern_title=pattern_title,
            pattern_description=pattern_description,
            evidence_count=len(notes),
        )
        
        for note in notes:
            note.promotion_status = PromotionStatus.CANDIDATE
        
        self._candidates[candidate.candidate_id] = candidate
        return candidate
    
    def approve_promotion(self, candidate_id: str, review_notes: str = "") -> bool:
        if candidate_id not in self._candidates:
            return False
        candidate = self._candidates[candidate_id]
        candidate.promotion_decision = PromotionDecision.APPROVED
        candidate.review_notes = review_notes
        for note_id in candidate.note_ids:
            if note_id in self._notes:
                self._notes[note_id].promotion_status = PromotionStatus.PROMOTED
        return True
    
    def reject_promotion(self, candidate_id: str, review_notes: str = "") -> bool:
        if candidate_id not in self._candidates:
            return False
        candidate = self._candidates[candidate_id]
        candidate.promotion_decision = PromotionDecision.REJECTED
        candidate.review_notes = review_notes
        for note_id in candidate.note_ids:
            if note_id in self._notes:
                self._notes[note_id].promotion_status = PromotionStatus.REJECTED
        return True
    
    def get_notes_by_sphere(self, sphere: str) -> List[StagiaireNote]:
        return [n for n in self._notes.values() if n.sphere == sphere]
    
    def get_stats(self) -> Dict[str, Any]:
        notes = list(self._notes.values())
        return {
            "total_notes": len(notes),
            "notes_by_learning_value": {v.value: len([n for n in notes if n.learning_value == v]) for v in LearningValue},
            "notes_by_promotion_status": {s.value: len([n for n in notes if n.promotion_status == s]) for s in PromotionStatus},
            "total_candidates": len(self._candidates),
            "active_cooldowns": len([c for c in self._cooldowns.values() if c.is_active()]),
        }


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def test_stagiaire():
    stagiaire = AgentStagiaire()
    conv_id = "conv-123"
    
    # Test 1: Pas d'activation à chaud
    sm = stagiaire.get_or_create_state_machine(conv_id)
    assert sm.state == ConversationState.HOT
    assert not stagiaire.can_activate(conv_id)
    print("✓ Test 1: Pas d'activation à chaud")
    
    # Test 2: Transitions
    assert sm.to_cooling()
    assert sm.to_ended()
    print("✓ Test 2: Transitions HOT → COOLING → ENDED")
    
    # Test 3: Activation
    assert stagiaire.can_activate(conv_id)
    assert stagiaire.activate_review(conv_id)
    print("✓ Test 3: Activation stagiaire fonctionne")
    
    # Test 4: SILENCE → cooldown
    decision = stagiaire.review_conversation(conv_id, "personal", None, {"intent": "trivial", "is_new_pattern": False, "complexity": "trivial"})
    assert decision == ReviewDecision.SILENCE
    assert stagiaire.is_cooldown_active(conv_id)
    print("✓ Test 4: SILENCE déclenche cooldown")
    
    # Test 5: NOTE creation
    conv_id2 = "conv-456"
    sm2 = stagiaire.get_or_create_state_machine(conv_id2)
    sm2.to_cooling()
    sm2.to_ended()
    stagiaire.activate_review(conv_id2)
    decision = stagiaire.review_conversation(conv_id2, "business", "construction", {"intent": "Nouveau workflow", "is_new_pattern": True, "complexity": "medium", "ambiguities": ["A", "B"], "user_reactions": ["approval"]})
    assert decision == ReviewDecision.NOTE
    print("✓ Test 5: NOTE créée correctement")
    
    # Test 6: Pas d'écriture canonique
    assert not hasattr(stagiaire, 'write_canonical')
    print("✓ Test 6: Pas d'écriture en mémoire canonique")
    
    print("\n✅ Tous les tests passent!")


if __name__ == "__main__":
    test_stagiaire()
