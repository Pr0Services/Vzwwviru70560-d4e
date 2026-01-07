"""
CHE·NU™ — Need Canon & Module Catalog
Version: V1.0
Date: 2026-01-07

Need Canon: Taxonomie stable et extensible des besoins humains/système
Module Catalog: Modules + dépendances + risques + coûts + mapping besoins

GOUVERNANCE > EXÉCUTION
"""

from __future__ import annotations
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional, List, Dict, Any, Set
import yaml


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class NeedCategory(str, Enum):
    ORGANIZE = "organize"
    COMMUNICATE = "communicate"
    REMEMBER = "remember"
    DECIDE = "decide"
    CREATE = "create"
    PROTECT = "protect"
    LEARN = "learn"
    AUTOMATE = "automate"
    COLLABORATE = "collaborate"


class ModuleStatus(str, Enum):
    PLANNED = "planned"
    IN_DEVELOPMENT = "in_development"
    BETA = "beta"
    STABLE = "stable"
    DEPRECATED = "deprecated"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ModuleActivationMode(str, Enum):
    AUTO = "auto"
    MANUAL = "manual"
    CHECKPOINT = "checkpoint"


# ═══════════════════════════════════════════════════════════════════════════════
# NEED CANON
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Need:
    id: str
    category: NeedCategory
    name_en: str
    name_fr: str
    description: str
    priority: int = 1
    frequency: str = "occasional"
    parent_id: Optional[str] = None
    related_needs: List[str] = field(default_factory=list)
    served_by_modules: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "category": self.category.value,
            "name_en": self.name_en,
            "name_fr": self.name_fr,
            "description": self.description,
            "priority": self.priority,
            "frequency": self.frequency,
            "parent_id": self.parent_id,
            "related_needs": self.related_needs,
            "served_by_modules": self.served_by_modules,
        }


class NeedCanon:
    """Canon des besoins humains/système."""
    
    def __init__(self):
        self._needs: Dict[str, Need] = {}
        self._by_category: Dict[NeedCategory, List[str]] = {c: [] for c in NeedCategory}
        self._initialize_core_needs()
    
    def _initialize_core_needs(self):
        core_needs = [
            Need("org-001", NeedCategory.ORGANIZE, "Track tasks", "Suivre mes tâches", "Keep track of what needs to be done", priority=5, frequency="constant"),
            Need("org-002", NeedCategory.ORGANIZE, "Manage projects", "Gérer mes projets", "Organize complex multi-step projects", priority=4, frequency="frequent"),
            Need("org-003", NeedCategory.ORGANIZE, "Schedule time", "Planifier mon temps", "Block time and manage calendar", priority=4, frequency="frequent"),
            Need("org-004", NeedCategory.ORGANIZE, "File documents", "Classer mes documents", "Organize and find documents easily", priority=3, frequency="frequent"),
            Need("com-001", NeedCategory.COMMUNICATE, "Draft messages", "Rédiger des messages", "Write clear emails and messages", priority=4, frequency="constant"),
            Need("com-002", NeedCategory.COMMUNICATE, "Summarize meetings", "Résumer les réunions", "Capture key points from discussions", priority=4, frequency="frequent"),
            Need("com-003", NeedCategory.COMMUNICATE, "Track conversations", "Suivre les conversations", "Remember conversation context", priority=3, frequency="frequent"),
            Need("rem-001", NeedCategory.REMEMBER, "Store preferences", "Retenir mes préférences", "Remember my preferences and habits", priority=4, frequency="constant"),
            Need("rem-002", NeedCategory.REMEMBER, "Track decisions", "Suivre les décisions", "Remember past decisions and rationale", priority=4, frequency="frequent"),
            Need("rem-003", NeedCategory.REMEMBER, "Capture ideas", "Capturer les idées", "Quick capture of thoughts and ideas", priority=3, frequency="frequent"),
            Need("dec-001", NeedCategory.DECIDE, "Compare options", "Comparer les options", "Analyze alternatives systematically", priority=4, frequency="frequent"),
            Need("dec-002", NeedCategory.DECIDE, "Track aging decisions", "Suivre les décisions vieillissantes", "Monitor decisions that need attention", priority=5, frequency="constant"),
            Need("dec-003", NeedCategory.DECIDE, "Get recommendations", "Obtenir des recommandations", "Receive personalized suggestions", priority=3, frequency="frequent"),
            Need("cre-001", NeedCategory.CREATE, "Generate content", "Générer du contenu", "Create documents, reports, presentations", priority=4, frequency="frequent"),
            Need("cre-002", NeedCategory.CREATE, "Edit and refine", "Éditer et améliorer", "Polish and improve existing content", priority=3, frequency="frequent"),
            Need("pro-001", NeedCategory.PROTECT, "Control data access", "Contrôler l'accès aux données", "Manage who sees what", priority=5, frequency="constant"),
            Need("pro-002", NeedCategory.PROTECT, "Audit actions", "Auditer les actions", "Track what the system does", priority=4, frequency="constant"),
            Need("pro-003", NeedCategory.PROTECT, "Verify identity", "Vérifier l'identité", "Ensure correct identity context", priority=5, frequency="constant"),
            Need("lea-001", NeedCategory.LEARN, "Track patterns", "Suivre les patterns", "Identify recurring behaviors", priority=3, frequency="frequent"),
            Need("lea-002", NeedCategory.LEARN, "Improve over time", "S'améliorer avec le temps", "Get better at predicting needs", priority=3, frequency="constant"),
            Need("aut-001", NeedCategory.AUTOMATE, "Batch operations", "Opérations en lot", "Process multiple items at once", priority=3, frequency="occasional"),
            Need("aut-002", NeedCategory.AUTOMATE, "Schedule actions", "Planifier des actions", "Set up recurring automated tasks", priority=3, frequency="occasional"),
            Need("col-001", NeedCategory.COLLABORATE, "Share context", "Partager le contexte", "Give others relevant background", priority=3, frequency="frequent"),
            Need("col-002", NeedCategory.COLLABORATE, "Coordinate tasks", "Coordonner les tâches", "Align work with team members", priority=3, frequency="frequent"),
        ]
        for need in core_needs:
            self.add_need(need)
    
    def add_need(self, need: Need) -> str:
        self._needs[need.id] = need
        self._by_category[need.category].append(need.id)
        return need.id
    
    def get_need(self, need_id: str) -> Optional[Need]:
        return self._needs.get(need_id)
    
    def get_by_category(self, category: NeedCategory) -> List[Need]:
        return [self._needs[nid] for nid in self._by_category.get(category, [])]
    
    def get_all(self) -> List[Need]:
        return list(self._needs.values())
    
    def to_yaml(self) -> str:
        return yaml.dump({"version": "1.0", "needs": [n.to_dict() for n in self._needs.values()]}, default_flow_style=False, allow_unicode=True)


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE CATALOG
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Module:
    id: str
    name: str
    description: str
    status: ModuleStatus = ModuleStatus.PLANNED
    version: str = "0.1.0"
    needs_served: List[str] = field(default_factory=list)
    dependencies: List[str] = field(default_factory=list)
    optional_dependencies: List[str] = field(default_factory=list)
    risk_level: RiskLevel = RiskLevel.LOW
    risk_description: str = ""
    estimated_cost: str = "low"
    activation_mode: ModuleActivationMode = ModuleActivationMode.MANUAL
    applicable_spheres: List[str] = field(default_factory=list)
    requires_checkpoint: bool = False
    checkpoint_reason: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "status": self.status.value,
            "version": self.version,
            "needs_served": self.needs_served,
            "dependencies": self.dependencies,
            "optional_dependencies": self.optional_dependencies,
            "risk_level": self.risk_level.value,
            "risk_description": self.risk_description,
            "estimated_cost": self.estimated_cost,
            "activation_mode": self.activation_mode.value,
            "applicable_spheres": self.applicable_spheres,
            "requires_checkpoint": self.requires_checkpoint,
            "checkpoint_reason": self.checkpoint_reason,
        }


class ModuleCatalog:
    """Catalogue des modules CHE·NU."""
    
    def __init__(self, need_canon: NeedCanon):
        self._modules: Dict[str, Module] = {}
        self._need_canon = need_canon
        self._initialize_core_modules()
    
    def _initialize_core_modules(self):
        core_modules = [
            Module("core.identity", "Identity Manager", "Gestion des identités et contextes", ModuleStatus.STABLE, "1.0.0", ["pro-003", "pro-001"], [], [], RiskLevel.CRITICAL, "Contrôle l'accès à toutes les données", "high", ModuleActivationMode.AUTO),
            Module("core.governance", "Governance Engine", "Moteur de gouvernance et checkpoints", ModuleStatus.STABLE, "1.0.0", ["pro-001", "pro-002"], [], [], RiskLevel.CRITICAL, "Contrôle toutes les actions sensibles", "high", ModuleActivationMode.AUTO),
            Module("core.nova", "Nova System Intelligence", "Intelligence système centrale", ModuleStatus.STABLE, "1.0.0", ["dec-003", "lea-002"], ["core.identity", "core.governance"], [], RiskLevel.HIGH, "", "high", ModuleActivationMode.AUTO),
            Module("threads.manager", "Thread Manager", "Gestion des threads et événements", ModuleStatus.STABLE, "1.0.0", ["org-002", "rem-002"], ["core.identity"], [], RiskLevel.MEDIUM, "", "medium", ModuleActivationMode.AUTO),
            Module("decisions.tracker", "Decision Tracker", "Suivi des décisions et aging", ModuleStatus.STABLE, "1.0.0", ["dec-001", "dec-002"], ["threads.manager"], [], RiskLevel.MEDIUM, "", "medium", ModuleActivationMode.AUTO),
            Module("agents.marketplace", "Agent Marketplace", "Catalogue et gestion des agents", ModuleStatus.STABLE, "1.0.0", ["aut-001", "dec-003"], ["core.governance"], [], RiskLevel.HIGH, "", "medium", ModuleActivationMode.MANUAL, [], True, "Embauche d'agents = action gouvernée"),
            Module("agents.stagiaire", "Stagiaire Agent", "Agent d'apprentissage qualitatif", ModuleStatus.BETA, "0.9.0", ["lea-001", "lea-002"], ["core.governance"], [], RiskLevel.LOW, "", "low", ModuleActivationMode.AUTO),
            Module("agents.professeur", "Professeur Agent", "Agent de stabilité et anti-dérive", ModuleStatus.BETA, "0.9.0", ["lea-002", "rem-002"], ["agents.stagiaire"], [], RiskLevel.LOW, "", "low", ModuleActivationMode.MANUAL),
            Module("meetings.manager", "Meeting Manager", "Gestion des réunions et compte-rendus", ModuleStatus.STABLE, "1.0.0", ["com-002", "org-003"], ["threads.manager"], [], RiskLevel.LOW, "", "low", ModuleActivationMode.MANUAL),
            Module("dataspace.files", "DataSpace Files", "Gestion des fichiers et documents", ModuleStatus.STABLE, "1.0.0", ["org-004", "rem-003"], ["core.identity"], [], RiskLevel.MEDIUM, "", "medium", ModuleActivationMode.AUTO),
            Module("xr.viewer", "XR Viewer", "Visualisation immersive (lecture seule)", ModuleStatus.BETA, "0.8.0", ["org-002"], ["core.identity"], [], RiskLevel.LOW, "READ-ONLY, pas d'écriture", "low", ModuleActivationMode.MANUAL),
            Module("integrations.external", "External Integrations", "Connexions aux services externes", ModuleStatus.BETA, "0.7.0", ["aut-001", "col-001"], ["core.governance"], [], RiskLevel.HIGH, "", "high", ModuleActivationMode.CHECKPOINT, [], True, "Accès externe = gouvernance stricte"),
        ]
        for module in core_modules:
            self.add_module(module)
    
    def add_module(self, module: Module) -> str:
        self._modules[module.id] = module
        for need_id in module.needs_served:
            need = self._need_canon.get_need(need_id)
            if need and module.id not in need.served_by_modules:
                need.served_by_modules.append(module.id)
        return module.id
    
    def get_module(self, module_id: str) -> Optional[Module]:
        return self._modules.get(module_id)
    
    def get_modules_for_need(self, need_id: str) -> List[Module]:
        return [m for m in self._modules.values() if need_id in m.needs_served]
    
    def get_dependencies(self, module_id: str, include_optional: bool = False) -> List[Module]:
        module = self.get_module(module_id)
        if not module:
            return []
        deps = [self._modules[d] for d in module.dependencies if d in self._modules]
        if include_optional:
            deps.extend([self._modules[d] for d in module.optional_dependencies if d in self._modules])
        return deps
    
    def get_dependency_tree(self, module_id: str) -> Dict[str, Any]:
        visited: Set[str] = set()
        def build_tree(mid: str) -> Dict[str, Any]:
            if mid in visited:
                return {"id": mid, "circular": True}
            visited.add(mid)
            module = self.get_module(mid)
            if not module:
                return {"id": mid, "missing": True}
            return {"id": mid, "name": module.name, "dependencies": [build_tree(d) for d in module.dependencies]}
        return build_tree(module_id)
    
    def get_all(self) -> List[Module]:
        return list(self._modules.values())
    
    def get_by_status(self, status: ModuleStatus) -> List[Module]:
        return [m for m in self._modules.values() if m.status == status]
    
    def get_high_risk(self) -> List[Module]:
        return [m for m in self._modules.values() if m.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]]
    
    def to_yaml(self) -> str:
        return yaml.dump({"version": "1.0", "modules": [m.to_dict() for m in self._modules.values()]}, default_flow_style=False, allow_unicode=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def test_canon_and_catalog():
    canon = NeedCanon()
    assert len(canon.get_all()) >= 20
    print("✓ Test 1: Need Canon initialisé")
    
    organize_needs = canon.get_by_category(NeedCategory.ORGANIZE)
    assert len(organize_needs) >= 4
    print("✓ Test 2: Catégories fonctionnent")
    
    catalog = ModuleCatalog(canon)
    assert len(catalog.get_all()) >= 10
    print("✓ Test 3: Module Catalog initialisé")
    
    modules = catalog.get_modules_for_need("dec-002")
    assert len(modules) >= 1
    print("✓ Test 4: Mapping besoin → modules")
    
    deps = catalog.get_dependencies("threads.manager")
    assert any(d.id == "core.identity" for d in deps)
    print("✓ Test 5: Dépendances fonctionnent")
    
    high_risk = catalog.get_high_risk()
    assert len(high_risk) >= 3
    print("✓ Test 6: Filtrage risque fonctionne")
    
    print("\n✅ Tous les tests passent!")


if __name__ == "__main__":
    test_canon_and_catalog()
