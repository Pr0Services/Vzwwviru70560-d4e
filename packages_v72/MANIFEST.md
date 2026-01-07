# MANIFEST — Module Stagiaire
# CHE·NU™ Integration Package
# Date: 2026-01-07
# Version: V1.0

## 📦 MODULE OVERVIEW

| Propriété | Valeur |
|-----------|--------|
| Module ID | `agents.stagiaire` |
| Nom | Agent Stagiaire |
| Version | 1.0.0 |
| Status | BETA |
| Risque | LOW |
| Dépendances | `core.governance` |

## 🎯 MISSION

L'agent stagiaire n'existe pas pour répondre.
Il existe pour apprendre à mieux apprendre.

**Objectif unique:** Prioriser la qualité de l'apprentissage futur.
- Moins de notes, mais meilleures
- Moins de certitudes, plus de questions
- Moins de stockage, plus de sens

**Règle d'or:** Une note utile est une note écrite avec curiosité, pas avec certitude.

## 📁 STRUCTURE DES FICHIERS

```
stagiaire/
├── backend/
│   ├── agent_stagiaire.py       # 550+ lignes - Core implementation
│   └── api_routes.py            # Routes FastAPI (partagé)
├── frontend/
│   └── StagiaireComponents.tsx  # 500+ lignes - React components
├── schemas/
│   ├── stagiaire_note.schema.json
│   ├── promotion_candidate.schema.json
│   └── cooldown_state.schema.json
├── examples/
│   ├── example_stagiaire_note.json
│   └── example_promotion_candidate.json
└── docs/
    ├── 00_README.md
    ├── 01_CHARTE_AGENT_STAGIAIRE.md
    ├── 02_DEFINITION_BONNE_QUESTION.md
    ├── 03_LISTE_INFOS_A_COLLECTER.md
    ├── 04_CHARTE_SILENCE_ABSOLU.md
    ├── 05_PROMOTION_PAR_SPHERES.md
    ├── 06_ACTIVATION_FIN_CONVERSATION_15MIN.md
    └── 07_GUIDE_IMPLEMENTATION.md
```

## 📊 STATISTIQUES

| Type | Fichiers | Lignes |
|------|----------|--------|
| Backend Python | 2 | ~1,000 |
| Frontend TSX | 1 | ~500 |
| JSON Schemas | 3 | ~100 |
| Examples | 2 | ~30 |
| Documentation | 8 | ~300 |
| **TOTAL** | **16** | **~1,930** |

## 🔌 API ENDPOINTS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stagiaire/conversation/{id}/state` | État conversation |
| POST | `/stagiaire/conversation/{id}/transition/{state}` | Transition d'état |
| POST | `/stagiaire/review` | Revue de conversation |
| GET | `/stagiaire/notes` | Liste des notes |
| GET | `/stagiaire/promotion/candidates` | Candidates à promotion |
| POST | `/stagiaire/promotion` | Créer candidate |
| POST | `/stagiaire/promotion/{id}/approve` | Approuver |
| POST | `/stagiaire/promotion/{id}/reject` | Rejeter |
| GET | `/stagiaire/stats` | Statistiques |

## 🔄 MACHINE D'ÉTAT

```
HOT ──────► COOLING ──────► ENDED
 ▲            │                │
 │            │                ▼
 │            ▼          STAGIARY_REVIEW
 │           HOT               │
 │                            ┌┴┐
 │                            │ │
 │                 ┌──────────┘ └──────────┐
 │                 ▼                       ▼
 └──────────── COOLDOWN              (Note créée)
              (15 min)                    │
                                          ▼
                                         HOT
```

## 🧪 TESTS

```bash
cd backend
python -m agent_stagiaire
# Exécute test_stagiaire() avec 9 tests
```

Tests couverts:
- ✓ Pas d'activation à chaud
- ✓ Transitions HOT → COOLING → ENDED
- ✓ Activation stagiaire fonctionne
- ✓ SILENCE déclenche cooldown
- ✓ Cooldown empêche activation
- ✓ NOTE créée correctement
- ✓ Pas d'écriture en mémoire canonique
- ✓ Promotion en attente par défaut
- ✓ Stats correctes

## 🔗 INTÉGRATION

### Backend (FastAPI)
```python
from stagiaire.backend.agent_stagiaire import AgentStagiaire
from stagiaire.backend.api_routes import router_stagiaire

app.include_router(router_stagiaire, prefix="/api/v1")
```

### Frontend (React)
```tsx
import { 
  StagiaireDashboard, 
  StagiaireNoteCard,
  ConversationStateIndicator 
} from './stagiaire/frontend/StagiaireComponents';
```

## ⚠️ CE QUI RESTE MOCK/PLACEHOLDER

- Persistance en base de données (in-memory seulement)
- Détection automatique de fin de conversation
- Intégration UX avec conversation principale
- Notifications temps réel

## 🔐 GOUVERNANCE

- Le stagiaire ne parle JAMAIS à chaud
- Activation uniquement sur fin de conversation
- Cooldown 15 min après fausse alerte
- N'écrit JAMAIS en mémoire canonique (séparation stricte)
- Promotion nécessite processus de gouvernance séparé

## 📋 CHECKLIST D'INTÉGRATION

- [ ] Copier `backend/` vers `app/modules/stagiaire/`
- [ ] Copier `frontend/` vers `src/modules/stagiaire/`
- [ ] Copier `schemas/` vers `app/schemas/stagiaire/`
- [ ] Ajouter routes à FastAPI main
- [ ] Configurer base de données pour persistance
- [ ] Implémenter détection fin de conversation
- [ ] Intégrer avec UX conversation
- [ ] Tests E2E
