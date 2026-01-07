"""
CHE·NU™ — Agent Professeur
Version: V1.0
Date: 2026-01-07

L'agent professeur existe pour éviter que le système s'améliore dans la mauvaise direction.
Il n'est pas continu, pas réactif. Il est intentionnel.

GOUVERNANCE > EXÉCUTION
"""

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from uuid import uuid4
import json


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS & TYPES
# ═══════════════════════════════════════════════════════════════════════════════

class EchecType(str, Enum):
    """Types d'échecs marquables par le Professeur"""
    COMPREHENSION_INTENTION = "comprehension_intention"
    STABILITE = "stabilite"
    RECUPERATION_CONTEXTE = "recuperation_contexte"
    JUGEMENT_CONFIANCE = "jugement_confiance"


class EchecSeverity(str, Enum):
    """Sévérité de l'échec"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RecadrageEntryType(str, Enum):
    """Types d'entrées dans le fichier de recadrage"""
    INTENTION_VALIDEE = "intention_validee"
    DECISION_EXPLICITE = "decision_explicite"
    AUTORISATION_DONNEE = "autorisation_donnee"
    STRUCTURE_FONCTIONNELLE = "structure_fonctionnelle"
    HYPOTHESE_CLOTUREE = "hypothese_cloturee"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class MarqueEchec:
    """Marque d'échec créée par le Professeur"""
    id: str = field(default_factory=lambda: str(uuid4()))
    timestamp: datetime = field(default_factory=datetime.utcnow)
    echec_type: EchecType = EchecType.COMPREHENSION_INTENTION
    severity: EchecSeverity = EchecSeverity.MEDIUM
    sphere_id: Optional[str] = None
    thread_id: Optional[str] = None
    description: str = ""
    symptoms: List[str] = field(default_factory=list)
    confusion_duration_minutes: int = 0
    reformulations_count: int = 0
    axe_amelioration: Optional[str] = None
    recadrage_suggested: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat(),
            "echec_type": self.echec_type.value,
            "severity": self.severity.value,
            "sphere_id": self.sphere_id,
            "thread_id": self.thread_id,
            "description": self.description,
            "symptoms": self.symptoms,
            "confusion_duration_minutes": self.confusion_duration_minutes,
            "reformulations_count": self.reformulations_count,
            "axe_amelioration": self.axe_amelioration,
            "recadrage_suggested": self.recadrage_suggested,
        }


@dataclass
class RecadrageEntry:
    """Entrée dans le fichier de recadrage"""
    id: str = field(default_factory=lambda: str(uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
    entry_type: RecadrageEntryType = RecadrageEntryType.INTENTION_VALIDEE
    content: str = ""
    context: str = ""
    sphere_id: Optional[str] = None
    source_echec_id: Optional[str] = None
    is_active: bool = True
    superseded_by: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat(),
            "entry_type": self.entry_type.value,
            "content": self.content,
            "context": self.context,
            "sphere_id": self.sphere_id,
            "source_echec_id": self.source_echec_id,
            "is_active": self.is_active,
            "superseded_by": self.superseded_by,
        }


@dataclass
class ProfesseurSession:
    """Session de revue du Professeur"""
    id: str = field(default_factory=lambda: str(uuid4()))
    started_at: datetime = field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    notes_promues_reviewed: List[str] = field(default_factory=list)
    echecs_precedents_reviewed: List[str] = field(default_factory=list)
    echecs_marques: List[MarqueEchec] = field(default_factory=list)
    recadrage_updates: List[RecadrageEntry] = field(default_factory=list)
    total_items_reviewed: int = 0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "started_at": self.started_at.isoformat(),
            "ended_at": self.ended_at.isoformat() if self.ended_at else None,
            "echecs_marques": [e.to_dict() for e in self.echecs_marques],
            "recadrage_updates": [r.to_dict() for r in self.recadrage_updates],
            "total_items_reviewed": self.total_items_reviewed,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# FICHIER DE RECADRAGE
# ═══════════════════════════════════════════════════════════════════════════════

class FichierRecadrage:
    """
    Fichier de Recadrage - permet au système de revenir à une 
    compréhension déjà stabilisée quand il dérive.
    
    CONTENU AUTORISÉ: Intentions validées, Décisions explicites, 
                      Autorisations données, Structures fonctionnelles
    CONTENU INTERDIT: Logs bruts, Conversations complètes, Hypothèses ouvertes
    """
    
    def __init__(self):
        self._entries: Dict[str, RecadrageEntry] = {}
        self._by_sphere: Dict[str, List[str]] = {}
    
    def add_entry(self, entry: RecadrageEntry) -> str:
        if len(entry.content) > 500:
            raise ValueError("Contenu trop long - pas de logs bruts")
        
        self._entries[entry.id] = entry
        
        if entry.sphere_id:
            if entry.sphere_id not in self._by_sphere:
                self._by_sphere[entry.sphere_id] = []
            self._by_sphere[entry.sphere_id].append(entry.id)
        
        return entry.id
    
    def get_active_for_sphere(self, sphere_id: str) -> List[RecadrageEntry]:
        entry_ids = self._by_sphere.get(sphere_id, [])
        return [self._entries[eid] for eid in entry_ids if self._entries[eid].is_active]
    
    def get_all_active(self) -> List[RecadrageEntry]:
        return [e for e in self._entries.values() if e.is_active]
    
    def export_for_orchestrator(self) -> str:
        active = self.get_all_active()
        lines = []
        for entry in active:
            prefix = {
                RecadrageEntryType.INTENTION_VALIDEE: "✓ INTENTION",
                RecadrageEntryType.DECISION_EXPLICITE: "✓ DÉCISION",
                RecadrageEntryType.AUTORISATION_DONNEE: "✓ AUTORISATION",
                RecadrageEntryType.STRUCTURE_FONCTIONNELLE: "✓ STRUCTURE",
                RecadrageEntryType.HYPOTHESE_CLOTUREE: "✓ CLÔTURÉ",
            }.get(entry.entry_type, "✓")
            lines.append(f"{prefix}: {entry.content}")
        return "\n".join(lines)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "entries": [e.to_dict() for e in self._entries.values()],
            "by_sphere": self._by_sphere,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# AGENT PROFESSEUR
# ═══════════════════════════════════════════════════════════════════════════════

class AgentProfesseur:
    """
    Agent Professeur CHE·NU™
    
    MISSION: Observer le système, marquer les échecs significatifs,
             empêcher la reconfirmation inutile, stabiliser ce qui a été compris.
    
    RÈGLE D'OR: Le professeur n'aide pas le système à aller plus vite.
                Il l'aide à ne pas se perdre.
    """
    
    def __init__(self):
        self.fichier_recadrage = FichierRecadrage()
        self._echecs_history: List[MarqueEchec] = []
        self._sessions: List[ProfesseurSession] = []
        self._current_session: Optional[ProfesseurSession] = None
    
    def start_review_session(self) -> ProfesseurSession:
        if self._current_session is not None:
            raise RuntimeError("Session déjà en cours")
        self._current_session = ProfesseurSession()
        return self._current_session
    
    def end_review_session(self) -> ProfesseurSession:
        if self._current_session is None:
            raise RuntimeError("Aucune session en cours")
        self._current_session.ended_at = datetime.utcnow()
        session = self._current_session
        self._sessions.append(session)
        self._current_session = None
        return session
    
    def analyze_intention_failure(
        self,
        thread_id: str,
        sphere_id: str,
        original_intent: str,
        interpretations: List[str],
        convergence_achieved: bool,
    ) -> Optional[MarqueEchec]:
        if self._current_session is None:
            raise RuntimeError("Pas de session active")
        
        if convergence_achieved or len(interpretations) < 2:
            return None
        
        echec = MarqueEchec(
            echec_type=EchecType.COMPREHENSION_INTENTION,
            severity=EchecSeverity.MEDIUM if len(interpretations) < 4 else EchecSeverity.HIGH,
            sphere_id=sphere_id,
            thread_id=thread_id,
            description=f"Intention '{original_intent[:50]}...' mal interprétée après {len(interpretations)} tentatives",
            symptoms=[f"Interprétation {i+1}: {interp[:100]}" for i, interp in enumerate(interpretations[:3])],
            reformulations_count=len(interpretations),
            axe_amelioration="Clarifier les patterns d'intention pour ce type de demande",
        )
        
        self._echecs_history.append(echec)
        self._current_session.echecs_marques.append(echec)
        return echec
    
    def analyze_stability_failure(
        self,
        thread_id: str,
        sphere_id: str,
        reconfirmations: List[Dict[str, Any]],
        decisions_oscillated: List[str],
    ) -> Optional[MarqueEchec]:
        if self._current_session is None:
            raise RuntimeError("Pas de session active")
        
        symptoms = []
        severity = EchecSeverity.LOW
        
        if len(reconfirmations) > 2:
            symptoms.append(f"{len(reconfirmations)} reconfirmations demandées")
            severity = EchecSeverity.MEDIUM
        
        if len(decisions_oscillated) > 0:
            symptoms.append(f"Oscillation sur: {', '.join(decisions_oscillated[:3])}")
            severity = EchecSeverity.HIGH
        
        if not symptoms:
            return None
        
        echec = MarqueEchec(
            echec_type=EchecType.STABILITE,
            severity=severity,
            sphere_id=sphere_id,
            thread_id=thread_id,
            description="Instabilité détectée: le système doute de décisions déjà validées",
            symptoms=symptoms,
            axe_amelioration="Renforcer le fichier de recadrage avec les décisions explicites",
            recadrage_suggested=True,
        )
        
        self._echecs_history.append(echec)
        self._current_session.echecs_marques.append(echec)
        return echec
    
    def analyze_context_recovery_failure(
        self,
        thread_id: str,
        sphere_id: str,
        context_lost_at: datetime,
        recovery_attempts: int,
        recovered: bool,
    ) -> Optional[MarqueEchec]:
        if self._current_session is None:
            raise RuntimeError("Pas de session active")
        
        if recovered and recovery_attempts <= 2:
            return None
        
        duration = (datetime.utcnow() - context_lost_at).total_seconds() / 60
        
        echec = MarqueEchec(
            echec_type=EchecType.RECUPERATION_CONTEXTE,
            severity=EchecSeverity.HIGH if not recovered else EchecSeverity.MEDIUM,
            sphere_id=sphere_id,
            thread_id=thread_id,
            description=f"Perte de contexte: {recovery_attempts} tentatives",
            symptoms=[f"Durée de confusion: {duration:.1f} minutes", f"Tentatives: {recovery_attempts}"],
            confusion_duration_minutes=int(duration),
            reformulations_count=recovery_attempts,
            axe_amelioration="Améliorer les points d'ancrage contextuels",
            recadrage_suggested=True,
        )
        
        self._echecs_history.append(echec)
        self._current_session.echecs_marques.append(echec)
        return echec
    
    def analyze_confidence_judgment_failure(
        self,
        thread_id: str,
        sphere_id: str,
        unnecessary_outsourcing: List[str],
        over_verifications: int,
        knew_but_doubted: List[str],
    ) -> Optional[MarqueEchec]:
        if self._current_session is None:
            raise RuntimeError("Pas de session active")
        
        symptoms = []
        if unnecessary_outsourcing:
            symptoms.append(f"Sous-traitance inutile: {', '.join(unnecessary_outsourcing[:3])}")
        if over_verifications > 3:
            symptoms.append(f"{over_verifications} vérifications excessives")
        if knew_but_doubted:
            symptoms.append(f"Doute injustifié sur: {', '.join(knew_but_doubted[:3])}")
        
        if not symptoms:
            return None
        
        echec = MarqueEchec(
            echec_type=EchecType.JUGEMENT_CONFIANCE,
            severity=EchecSeverity.MEDIUM,
            sphere_id=sphere_id,
            thread_id=thread_id,
            description="Le système manque de confiance en ses propres connaissances",
            symptoms=symptoms,
            axe_amelioration="Calibrer les seuils de confiance pour ce domaine",
        )
        
        self._echecs_history.append(echec)
        self._current_session.echecs_marques.append(echec)
        return echec
    
    def add_validated_intention(self, sphere_id: str, intention: str, context: str = "", source_echec_id: Optional[str] = None) -> RecadrageEntry:
        entry = RecadrageEntry(
            entry_type=RecadrageEntryType.INTENTION_VALIDEE,
            content=intention,
            context=context,
            sphere_id=sphere_id,
            source_echec_id=source_echec_id,
        )
        self.fichier_recadrage.add_entry(entry)
        if self._current_session:
            self._current_session.recadrage_updates.append(entry)
        return entry
    
    def add_explicit_decision(self, sphere_id: str, decision: str, context: str = "", source_echec_id: Optional[str] = None) -> RecadrageEntry:
        entry = RecadrageEntry(
            entry_type=RecadrageEntryType.DECISION_EXPLICITE,
            content=decision,
            context=context,
            sphere_id=sphere_id,
            source_echec_id=source_echec_id,
        )
        self.fichier_recadrage.add_entry(entry)
        if self._current_session:
            self._current_session.recadrage_updates.append(entry)
        return entry
    
    def add_given_authorization(self, sphere_id: str, authorization: str, context: str = "") -> RecadrageEntry:
        entry = RecadrageEntry(
            entry_type=RecadrageEntryType.AUTORISATION_DONNEE,
            content=authorization,
            context=context,
            sphere_id=sphere_id,
        )
        self.fichier_recadrage.add_entry(entry)
        if self._current_session:
            self._current_session.recadrage_updates.append(entry)
        return entry
    
    def get_echecs_by_type(self, echec_type: EchecType) -> List[MarqueEchec]:
        return [e for e in self._echecs_history if e.echec_type == echec_type]
    
    def get_echecs_by_sphere(self, sphere_id: str) -> List[MarqueEchec]:
        return [e for e in self._echecs_history if e.sphere_id == sphere_id]
    
    def get_recadrage_export(self) -> str:
        return self.fichier_recadrage.export_for_orchestrator()
    
    def get_stats(self) -> Dict[str, Any]:
        return {
            "total_echecs": len(self._echecs_history),
            "echecs_by_type": {t.value: len([e for e in self._echecs_history if e.echec_type == t]) for t in EchecType},
            "echecs_by_severity": {s.value: len([e for e in self._echecs_history if e.severity == s]) for s in EchecSeverity},
            "recadrage_entries": len(self.fichier_recadrage._entries),
            "sessions_completed": len(self._sessions),
        }


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def test_professeur():
    prof = AgentProfesseur()
    
    # Test 1: Pas de réponse directe
    assert not hasattr(prof, 'respond')
    print("✓ Test 1: Pas de réponse directe à l'utilisateur")
    
    # Test 2: Session requise
    try:
        prof.analyze_intention_failure("t1", "s1", "test", ["a", "b"], False)
        assert False
    except RuntimeError:
        pass
    print("✓ Test 2: Session requise pour analyser")
    
    # Test 3: Marquage d'échec
    prof.start_review_session()
    echec = prof.analyze_intention_failure("thread-123", "personal", "Créer un rapport", ["PDF", "Excel", "Texte"], False)
    assert echec is not None
    print("✓ Test 3: Marquage d'échec fonctionne")
    
    # Test 4: Fichier de recadrage
    prof.add_validated_intention("personal", "Rapport = PDF avec graphiques")
    export = prof.get_recadrage_export()
    assert "INTENTION" in export
    print("✓ Test 4: Fichier de recadrage fonctionne")
    
    # Test 5: Fin de session
    session = prof.end_review_session()
    assert session.ended_at is not None
    print("✓ Test 5: Session termine correctement")
    
    print("\n✅ Tous les tests passent!")


if __name__ == "__main__":
    test_professeur()
