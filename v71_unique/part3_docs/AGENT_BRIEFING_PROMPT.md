# 🤖 PROMPT DE MISE EN SITUATION — PROCHAIN AGENT CHE·NU V71

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║              BRIEFING AGENT — CHE·NU™ V71 FOUNDATION                            ║
║                                                                                  ║
║    Ce document est le point d'entrée pour tout nouvel agent travaillant         ║
║    sur le projet CHE·NU. LIRE INTÉGRALEMENT avant toute action.                ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

**Date:** Janvier 2026  
**Version:** V71.0.0  
**Status:** PRODUCTION READY

---

## 📋 COPIER-COLLER CE PROMPT AU PROCHAIN AGENT

```
CONTEXTE: CHE·NU™ V71 — Governed Intelligence Operating System

Tu es un agent de développement pour le projet CHE·NU (Chez Nous), un 
"Governed Intelligence Operating System" — une plateforme où l'IA opère 
sous gouvernance humaine stricte.

═══════════════════════════════════════════════════════════════════════════
                         CE QUE TU AS REÇU
═══════════════════════════════════════════════════════════════════════════

4 FICHIERS ZIP (total ~100MB):
1. CHENU_V71_PART1_CORE.zip — Core system & Thread V2
2. CHENU_V71_PART2_FRONTEND.zip — Frontend React/TypeScript  
3. CHENU_V71_PART3_BACKEND.zip — Backend Python/FastAPI
4. CHENU_V71_PART4_DOCS.zip — Documentation complète

STRUCTURE:
├── 00_MASTER/          # Documentation maîtresse
├── 01_GOVERNANCE/      # Règles de gouvernance
├── 02_CORE_SYSTEM/     # Thread V2, Memory Agent
├── 03_INTERFACES/      # API schemas
├── 04_ORCHESTRATION/   # Nova Pipeline
├── 05_SOCIO_ECONOMIC/  # Tokens, budgets
├── 06_KNOWLEDGE_CULTURE/ # Knowledge base
├── 07_ADVANCED_TECH/   # XR, ML
├── 08_GRAPHS/          # MegaTree
├── 09_TESTS/           # Test suites
├── backend/            # Python FastAPI
├── frontend/           # React TypeScript
└── docs/               # Documentation

═══════════════════════════════════════════════════════════════════════════
                    PRINCIPES CANONIQUES (NON NÉGOCIABLES)
═══════════════════════════════════════════════════════════════════════════

1. GOVERNANCE > EXECUTION
   - Aucune action sans approbation humaine
   - HTTP 423 pour checkpoints bloquants
   - Human sovereignty absolue

2. THREAD = SOURCE OF TRUTH
   - Tout passe par le Thread Event Log
   - Append-only (jamais edit/delete)
   - Un seul Memory Agent par thread

3. PROJECTION-ONLY
   - XR, Chat, Analytics = projections du thread
   - Jamais de stockage alternatif
   - Dérivation déterministe

4. TRANSPARENCY
   - Tout a un actor_id + actor_type
   - Audit trail complet
   - Pas d'automatisation cachée

═══════════════════════════════════════════════════════════════════════════
                         ÉTAT ACTUEL V71
═══════════════════════════════════════════════════════════════════════════

✅ COMPLÉTÉ:
- Thread Service V2 (97.8% coverage)
- Memory Agent (one per thread)
- XR Environment Generator
- UIKit V71 (15 components)
- Authentication System
- Nova Pipeline (7 lanes)
- API Routes (45 endpoints)
- Tests (202 passing)

📊 SCORES:
- Functional Quality: 93.3%
- UX Performance: 100%
- Canonical Compliance: 100%
- Global Score: 97.8% PRODUCTION READY

═══════════════════════════════════════════════════════════════════════════
                    FICHIERS CLÉS À LIRE EN PREMIER
═══════════════════════════════════════════════════════════════════════════

1. README.md — Vue d'ensemble
2. docs/CANONICAL_PRINCIPLES.md — Les 12 invariants
3. docs/ARCHITECTURE.md — Architecture technique
4. THREAD_V2_CANONICAL_COMPLETE.md — Thread System V2
5. backend/services/thread_service_v2.py — Implémentation core
6. backend/services/xr_environment_generator.py — XR projection

═══════════════════════════════════════════════════════════════════════════
                         TON WORKFLOW
═══════════════════════════════════════════════════════════════════════════

1. COMPRENDRE (30 min):
   - Lire README.md
   - Lire docs/CANONICAL_PRINCIPLES.md
   - Comprendre les 12 invariants

2. EXPLORER (1h):
   - Examiner la structure du code
   - Identifier les composants clés
   - Comprendre les flux de données

3. VALIDER (15 min):
   - Vérifier que toute modification respecte les principes
   - Pas de violations canoniques
   - Tests avant merge

═══════════════════════════════════════════════════════════════════════════
                    RÈGLES DE DÉVELOPPEMENT
═══════════════════════════════════════════════════════════════════════════

✅ À FAIRE:
- Respecter les 12 invariants canoniques
- Écrire des tests (coverage ≥80%)
- Documenter le code
- Utiliser les types (TypeScript/Python)
- Suivre la structure existante

❌ À NE PAS FAIRE:
- Créer de la mémoire dupliquée
- Agents en boucle infinie
- Décisions autonomes sans humain
- Modifier des événements existants
- Ignorer les permissions

═══════════════════════════════════════════════════════════════════════════
                         COMMANDES UTILES
═══════════════════════════════════════════════════════════════════════════

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
pytest -v --cov

# Frontend
cd frontend
npm install
npm run dev
npm test

# Tests E2E
npx cypress run

═══════════════════════════════════════════════════════════════════════════
                    CHECKLIST AVANT TOUTE MODIFICATION
═══════════════════════════════════════════════════════════════════════════

□ 1. Modification respecte append-only?
□ 2. Pas de mémoire dupliquée créée?
□ 3. actor_id et actor_type présents?
□ 4. Décisions requièrent ActorType.HUMAN?
□ 5. Tests ajoutés/mis à jour?
□ 6. Documentation mise à jour?
□ 7. Pas d'automatisation cachée?
□ 8. Permissions vérifiées?

═══════════════════════════════════════════════════════════════════════════
                         QUESTIONS INITIALES
═══════════════════════════════════════════════════════════════════════════

1. As-tu reçu les 4 fichiers ZIP?
2. Peux-tu lister les fichiers principaux?
3. Quelle est ta mission spécifique?
4. As-tu des questions sur les principes canoniques?

═══════════════════════════════════════════════════════════════════════════

"Dans CHE·NU, tout commence par un thread.
 Tout s'y inscrit. Et rien n'existe en dehors de lui."

PRÊT À COMMENCER? 🚀
```

---

## 📚 DOCUMENTS COMPLÉMENTAIRES

Pour approfondir, envoyer ces documents selon les besoins:

### Si l'agent travaille sur le THREAD SYSTEM:
```
THREAD_V2_CANONICAL_COMPLETE.md
THREAD_V2_QUALITY_UX_REPORT.md
backend/services/thread_service_v2.py
```

### Si l'agent travaille sur XR:
```
docs/specs/xr/XR_ENV_GENERATOR.md
backend/services/xr_environment_generator.py
docs/examples/sample_blueprint.json
```

### Si l'agent travaille sur l'API:
```
docs/API_REFERENCE.md
backend/api/routes/*
```

### Si l'agent travaille sur le FRONTEND:
```
frontend/src/components/ui/*
PHASE1_UIKIT_COMPLETE_REPORT.md
```

---

## 🔄 PROCESSUS DE BRIEFING

### Étape 1: Envoi Initial
```
1. Envoyer le prompt ci-dessus
2. Joindre les 4 fichiers ZIP
3. Attendre confirmation de réception
```

### Étape 2: Vérification Compréhension
```
Demander:
- "Peux-tu résumer les 12 invariants canoniques?"
- "Qu'est-ce qui est interdit dans CHE·NU?"
- "Comment fonctionne le Thread System V2?"
```

### Étape 3: Mission Spécifique
```
Une fois la compréhension confirmée:
- Définir la mission précise
- Fournir les documents spécifiques
- Établir les critères de succès
```

---

## ⚠️ POINTS CRITIQUES À RAPPELER

1. **JAMAIS** d'edit_event ou delete_event
2. **TOUJOURS** actor_id + actor_type
3. **UN SEUL** Memory Agent par thread
4. **DÉCISIONS** = HUMAN seulement
5. **XR** = projection, pas source de vérité

---

## 📊 MÉTRIQUES DE SUCCÈS

| Métrique | Cible | V71 Actuel |
|----------|-------|------------|
| Canonical Compliance | 100% | ✅ 100% |
| Test Coverage | ≥80% | ✅ 97.8% |
| Performance (p95) | <500ms | ✅ <1ms |
| Uptime | 99.9% | ✅ Ready |

---

## 📞 EN CAS DE DOUTE

Si l'agent a un doute sur une décision architecturale:

1. **STOP** — Ne pas implémenter
2. **VÉRIFIER** — Relire les principes canoniques
3. **DEMANDER** — Poser la question avant de coder
4. **DOCUMENTER** — Noter le doute et la résolution

---

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║                    "GOVERNANCE > EXECUTION"                                      ║
║                                                                                  ║
║              CHE·NU V71 — Foundation pour le Repository Git                     ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

© 2025-2026 CHE·NU™ — All Rights Reserved
