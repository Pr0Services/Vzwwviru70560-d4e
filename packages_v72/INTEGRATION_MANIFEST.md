# 📦 CHE·NU™ CANON & AGENTS INTEGRATION PACKAGE

**Version:** v1.0
**Date:** 2026-01-07
**Prepared for:** Agent Assembleur

---

## 🎯 CONTENU DU PACKAGE

Ce package contient les implémentations canoniques prêtes à l'intégration:

### 1. 👨‍🎓 AGENT STAGIAIRE
**Chemin:** `backend/agents/stagiaire/agent.py`
**Lignes:** ~450

Rôle: Agent d'apprentissage qualitatif
- Observe à la fin des conversations
- Crée des notes avec filtrage radical
- Gère le cooldown 15 minutes
- Propose des candidats à promotion

**Dépendances:**
- Aucune (standalone)

**À intégrer avec:**
- Thread system (pour context)
- Sphere system (pour routing)

---

### 2. 👨‍🏫 AGENT PROFESSEUR
**Chemin:** `backend/agents/professeur/agent.py`
**Lignes:** ~400

Rôle: Agent de stabilisation cognitive
- Marque les échecs structurants (4 types)
- Crée des fichiers de recentrage
- Applique le recentrage à l'orchestrateur

**Dépendances:**
- Agent Stagiaire (conceptuellement lié)

**À intégrer avec:**
- Orchestrateur principal
- Thread system

---

### 3. 📜 NEED CANON V1
**Chemin:** `backend/canon/need_canon.py`
**Lignes:** ~300

Contenu: Les 15 besoins fondamentaux
1. need.clarity
2. need.execution
3. need.memory
4. need.governance
5. need.safety
6. need.trust
7. need.learning
8. need.coordination
9. need.communication
10. need.discovery
11. need.organization
12. need.identity
13. need.presence
14. need.resilience
15. need.performance

**Principe:** "Needs are stable; implementations evolve."

---

### 4. 📚 MODULE CATALOG V1
**Chemin:** `backend/canon/module_catalog.py`
**Lignes:** ~500

Contenu: 15+ modules avec:
- needs_served
- dependencies
- activation_modes
- risk_profile
- cost_profile

**Règle:** "Modules without needs_served are NOT eligible for activation."

**Modules Core:**
- auth.core
- identity.boundary
- spheres.catalog
- bureau.sections
- threads.v2
- nova.pipeline

**Modules Governance:**
- governance.core
- governance.checkpoints
- governance.decisions

**Modules Agents:**
- agents.marketplace
- agents.hire
- agents.stagiaire
- agents.professeur

**Modules XR:**
- xr.viewer
- xr.artifacts

---

### 5. 🔄 SCENARIO LOCK SYSTEM
**Chemin:** `backend/canon/scenario_lock.py`
**Lignes:** ~550

Système de simulation:
- Factor Library (12 facteurs)
- Scenario Templates (2 templates)
- Simulation Runs

**Principe:** "We vary factors, not form."

**Templates inclus:**
- template.onboarding_30d.v1
- template.project_assisted_30d.v1

---

### 6. 📝 TYPES TYPESCRIPT
**Chemin:** `frontend/src/types/canon.ts`
**Lignes:** ~350

Types pour:
- Need Canon
- Module Catalog
- Stagiaire/Professeur
- Scenarios
- API Responses
- React Query keys

---

## 🗂️ STRUCTURE

```
INTEGRATION_READY/
├── backend/
│   ├── agents/
│   │   ├── stagiaire/
│   │   │   └── agent.py          # Agent Stagiaire complet
│   │   └── professeur/
│   │       └── agent.py          # Agent Professeur complet
│   └── canon/
│       ├── __init__.py           # Exports
│       ├── need_canon.py         # 15 besoins
│       ├── module_catalog.py     # 15+ modules
│       └── scenario_lock.py      # Simulation system
├── frontend/
│   └── src/
│       └── types/
│           └── canon.ts          # TypeScript types
├── docs/
│   ├── 01_PROFESSEUR_KIT/        # Specs originales
│   ├── 02_STAGIAIRE_KIT/         # Specs originales
│   └── 04_CANON_CATALOG/         # Specs originales
└── INTEGRATION_MANIFEST.md       # Ce fichier
```

---

## 📊 STATISTIQUES

| Composant | Fichier | Lignes | Status |
|-----------|---------|--------|--------|
| Stagiaire Agent | agent.py | ~450 | ✅ Production |
| Professeur Agent | agent.py | ~400 | ✅ Production |
| Need Canon | need_canon.py | ~300 | ✅ Production |
| Module Catalog | module_catalog.py | ~500 | ✅ Production |
| Scenario Lock | scenario_lock.py | ~550 | ✅ Production |
| TS Types | canon.ts | ~350 | ✅ Production |
| **TOTAL** | | **~2,550** | |

---

## 🔗 DÉPENDANCES À RÉSOUDRE

### Backend (Python)
```python
# requirements.txt additions
pyyaml>=6.0
pydantic>=2.0
```

### Frontend (TypeScript)
```json
// Aucune dépendance externe requise
// Utilise les types natifs TypeScript
```

---

## 🧪 TESTS À CRÉER

1. **Stagiaire Tests**
   - test_cooldown_mechanism
   - test_note_creation
   - test_radical_filtering
   - test_promotion_candidate

2. **Professeur Tests**
   - test_failure_detection_all_types
   - test_recentering_creation
   - test_recentering_application

3. **Canon Tests**
   - test_all_needs_valid
   - test_module_dependencies
   - test_module_needs_served

4. **Scenario Tests**
   - test_template_validation
   - test_factor_selection
   - test_run_advancement

---

## 🔌 INTÉGRATION AVEC V72

### 1. API Endpoints à ajouter
```python
# backend/app/api/v1/canon.py
GET  /api/v1/canon/needs           # Liste des besoins
GET  /api/v1/canon/modules         # Liste des modules
GET  /api/v1/canon/scenarios       # Templates de scénarios

# backend/app/api/v1/agents/stagiaire.py
POST /api/v1/agents/stagiaire/observe
GET  /api/v1/agents/stagiaire/notes
GET  /api/v1/agents/stagiaire/promotions

# backend/app/api/v1/agents/professeur.py
GET  /api/v1/agents/professeur/failures
POST /api/v1/agents/professeur/mark-failure
POST /api/v1/agents/professeur/recentering
```

### 2. Frontend Components à créer
```typescript
// Pages
<StagiaireNotesPage />
<ProfesseurDashboardPage />
<CanonExplorerPage />
<ScenarioRunnerPage />

// Components
<NeedCard need={need} />
<ModuleCard module={module} />
<FailureMarkerCard marker={marker} />
<RecenteringPanel file={file} />
```

---

## ✅ CHECKLIST ASSEMBLEUR

- [ ] Copier `backend/agents/` vers projet principal
- [ ] Copier `backend/canon/` vers projet principal
- [ ] Copier `frontend/src/types/canon.ts` vers projet principal
- [ ] Ajouter imports dans `__init__.py`
- [ ] Créer routes API
- [ ] Ajouter tests
- [ ] Mettre à jour documentation

---

## 🛡️ GOUVERNANCE

**GOUVERNANCE > EXÉCUTION**

- Les agents Stagiaire/Professeur sont PASSIFS (pas d'actions automatiques)
- Le Module Catalog requiert `needs_served` pour activation
- Le Scenario Lock ne permet PAS de modifier les templates
- Tous les modules `requires_governance=True` doivent émettre des events

---

*Préparé pour Agent Assembleur CHE·NU™*
*UNIFIER SANS DÉNATURER*
