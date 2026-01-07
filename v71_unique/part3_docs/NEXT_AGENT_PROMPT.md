# CHE·NU™ V71 — PROMPT DE MISE EN SITUATION POUR LE PROCHAIN AGENT

```
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                              ║
║                    🚀 BIENVENUE DANS LE PROJET CHE·NU™ V71 🚀                               ║
║                                                                                              ║
║                         GOVERNED INTELLIGENCE OPERATING SYSTEM                               ║
║                                                                                              ║
║                              "Chez Nous" — At Home with Your Data                            ║
║                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════╝
```

**Copier-coller ce prompt au prochain agent pour le briefer complètement.**

---

## 📋 CONTEXTE COMPLET

```
Tu es l'agent suivant sur le projet CHE·NU™ (Chez Nous), un Governed Intelligence 
Operating System créé par Jonathan (Jo). Tu prends la relève d'un travail 
substantiel qui a été complété sur la version V71.

CE QU'EST CHE·NU:
CHE·NU est un système d'exploitation pour intelligence gouvernée. 
Le principe fondamental est: "GOUVERNANCE > EXÉCUTION"
- Les humains prennent TOUTES les décisions
- Les agents proposent, les humains approuvent
- Aucune exécution autonome n'est permise

PHILOSOPHIE (Le Manifeste CHE·NU):
"Structure precedes intelligence."
"Visibility precedes power."
"Human accountability is non-negotiable."
"Systems guide decisions; humans decide."
"CHE·NU is built for decades, not trends."
```

---

## 🏗 ARCHITECTURE (FROZEN - NE PAS MODIFIER)

```
L'architecture est GELÉE. Ces éléments ne peuvent PAS être modifiés:

9 SPHÈRES (exactement):
1. Personal 🏠 — Vie personnelle
2. Business 💼 — Opérations professionnelles
3. Government 🏛 — Institutionnel et civique
4. Creative Studio 🎨 — Création de contenu
5. Community 👥 — Initiatives collectives
6. Social & Media 📱 — Présence publique
7. Entertainment 🎬 — Loisirs
8. My Team 🤝 — Coordination d'équipe
9. Scholar 📚 — Apprentissage et recherche

6 BUREAU SECTIONS par sphère:
1. QuickCapture — Capture rapide
2. ResumeWorkspace — Espace de travail principal
3. Threads — Fils de discussion
4. DataFiles — Fichiers de données
5. ActiveAgents — Agents actifs
6. Meetings — Réunions

COMPOSANTS CLÉS:
- Nova: Intelligence système (jamais hired, toujours disponible)
- User Orchestrator: Assistant personnel (hired par user)
- Agents spécialisés: Experts par domaine
- Threads: Unité atomique de sens (événements append-only)
```

---

## 🧵 SYSTÈME THREAD V2 (CORE)

```
Le Thread est LE concept central de CHE·NU:

"Dans CHE·NU, tout commence par un Thread. Tout s'y inscrit. 
Et rien n'existe en dehors de lui."

RÈGLES ABSOLUES DU THREAD:

1. FOUNDING_INTENT OBLIGATOIRE
   - Chaque thread DOIT avoir un founding_intent
   - Il définit pourquoi le thread existe
   - Il est IMMUTABLE

2. EVENT LOG APPEND-ONLY
   - Les événements ne sont JAMAIS modifiés
   - Les événements ne sont JAMAIS supprimés
   - Seule l'append est permis

3. SINGLE SOURCE OF TRUTH
   - Le thread EST la source de vérité
   - Chat, Live, XR = projections du thread
   - PAS de bases de données séparées

4. CORRECTIONS PAR LIENS
   - Pour corriger: CORRECTION_APPENDED event
   - Avec un lien vers l'événement original
   - L'original reste intact

5. UN SEUL MEMORY AGENT
   - Exactement 1 memory agent par thread
   - Créé automatiquement à l'initialisation
   - Limité à: SUMMARY_SNAPSHOT, CORRECTION_APPENDED

TYPES D'ÉVÉNEMENTS:
- THREAD_CREATED
- MESSAGE_POSTED
- DECISION_RECORDED
- ACTION_CREATED / ACTION_UPDATED
- LIVE_STARTED / LIVE_ENDED
- SUMMARY_SNAPSHOT
- LINK_ADDED
- CORRECTION_APPENDED
- ENV_BLUEPRINT_GENERATED
```

---

## 🏛 INVARIANTS CANONIQUES (ABSOLUS)

```
Ces règles sont ABSOLUES. Leur violation = compromission du système:

INV-T01: Single Source of Truth
→ Le Thread est la seule source de vérité

INV-T02: Append-Only Event Log
→ Événements jamais modifiés, jamais supprimés

INV-T03: Founding Intent Required
→ Chaque thread DOIT avoir un founding_intent

INV-A01: No Always-On Agents
→ Agents instantiés à la demande, jamais persistants

INV-A02: One Memory Agent Per Thread
→ Exactement un memory agent par thread

INV-A04: Agents Propose, Humans Decide
→ Aucune exécution autonome

INV-G01: Governance Before Execution
→ Toute action passe par la gouvernance

INV-G02: Checkpoints Block Execution
→ HTTP 423 = exécution DOIT s'arrêter

INV-I01: Identity Isolation
→ Aucun accès cross-identity (HTTP 403)

INV-X01: XR Is Projection Only
→ XR = vue dérivée, jamais authoritative
```

---

## 📦 CE QUE TU AS REÇU (4 ZIPs)

```
Le package V71 est divisé en 4 ZIPs de ~25-28MB chacun:

ZIP 1: CHENU_V71_PART1_CORE.zip (~27MB)
├── 00_MASTER/          — Documentation maître
├── 01_GOVERNANCE/      — Modules de gouvernance
├── 02_CORE_SYSTEM/     — Services core
├── backend/api/        — Routes API
├── backend/services/   — Services backend
└── README_FULL.md      — Documentation principale

ZIP 2: CHENU_V71_PART2_MODULES.zip (~26MB)
├── 03_INTERFACES/      — Adapteurs d'interface
├── 04_ORCHESTRATION/   — Nova & orchestration
├── 05_SOCIO_ECONOMIC/  — Modules économiques
├── backend/agents/     — Implémentations agents
├── backend/core/       — Modules core
└── backend/xr_generator/ — Générateur XR

ZIP 3: CHENU_V71_PART3_KNOWLEDGE.zip (~25MB)
├── 06_KNOWLEDGE_CULTURE/ — Systèmes de connaissance
├── 07_ADVANCED_TECH/   — Fonctionnalités avancées
├── 08_GRAPHS/          — Structures de graphes
├── backend/scholar/    — Modules scholar
├── backend/verticals/  — Verticaux métier
└── Datasets/           — Données d'exemple

ZIP 4: CHENU_V71_PART4_FRONTEND.zip (~28MB)
├── 09_TESTS/           — Suites de tests
├── frontend/           — Frontend React complet
├── cypress/            — Tests E2E
├── docs/               — Documentation complète
└── Rapports            — Tous les rapports de phase
```

---

## 📊 ÉTAT ACTUEL (V71 COMPLÉTÉ)

```
PHASES COMPLÉTÉES:

✅ Phase 1: UI Kit & Design System
   - 15+ composants atomiques
   - Thème CHE·NU (violet #8B5CF6)
   - Accessibilité WCAG 2.1 AA

✅ Phase 2: Authentification
   - JWT avec refresh tokens
   - Routes protégées
   - Sessions sécurisées

✅ Phase 3: Thread V2 System
   - Event log append-only
   - 15 types d'événements
   - Memory agent unique
   - Projections (Chat, XR, Timeline)

✅ Phase 4: Agent System
   - Framework d'agents
   - Token governor
   - Orchestration multi-lane
   - LLM Router (18 providers)

✅ Phase 5: Knowledge Base
   - Chunking intelligent
   - Recherche sémantique
   - Système de citations

✅ Phase 6: XR Generator
   - Blueprints XR
   - 5 templates (personal, business, cause, lab, custom)
   - 6 zones canoniques
   - Portails inter-threads

SCORES DE QUALITÉ:
- Tests fonctionnels: 93.3% (14/15)
- Performance UX: 100% (tous sub-ms)
- Conformité canonique: 100% (12/12 invariants)
- Score global: 97.8% ✅
```

---

## 🎯 PROCHAINES ÉTAPES SUGGÉRÉES

```
PHASE 7: Intégration Base de Données
- Remplacer in-memory par PostgreSQL
- Event sourcing avec snapshots
- Cache Redis pour XR state

PHASE 8: WebSocket Real-Time
- Events en temps réel
- Collaboration multi-utilisateurs
- Sync XR

PHASE 9: Tests E2E Complets
- Cypress pour tous les flows
- Tests de charge
- Tests de sécurité

PHASE 10: Déploiement
- CI/CD pipeline
- Environnements staging/production
- Monitoring & alerting
```

---

## 📁 STRUCTURE DES FICHIERS

```
CHENU_V71/
├── 00_MASTER/                    # Documentation maître
├── 01_GOVERNANCE/                # Gouvernance (identity, checkpoints, audit)
├── 02_CORE_SYSTEM/               # Core (thread_v2, agents, memory, tokens)
├── 03_INTERFACES/                # API, WebSocket, CLI
├── 04_ORCHESTRATION/             # Nova pipeline, LLM router
├── 05_SOCIO_ECONOMIC/            # Tokens, billing
├── 06_KNOWLEDGE_CULTURE/         # KB, search, citations
├── 07_ADVANCED_TECH/             # XR, ML, integrations
├── 08_GRAPHS/                    # Graphes relationnels
├── 09_TESTS/                     # Tests (unit, integration, canonical)
├── backend/                      # Python FastAPI backend
├── frontend/                     # React TypeScript frontend
├── docs/                         # Documentation
│   └── architecture/
│       └── CANONICAL_INVARIANTS.md  # ⚠️ LIRE EN PREMIER
├── Datasets/                     # Sample data
├── cypress/                      # E2E tests
├── README_FULL.md                # Documentation principale
├── QUICK_START.md                # Guide de démarrage rapide
├── CHANGELOG.md                  # Historique des versions
└── Les rapports de phase         # THREAD_V2_QUALITY_UX_REPORT.md, etc.
```

---

## ⚠️ RÈGLES ABSOLUES

```
EN TRAVAILLANT SUR CHE·NU, TU DOIS:

1. LIRE docs/architecture/CANONICAL_INVARIANTS.md EN PREMIER
   → Ces règles sont ABSOLUES et non-négociables

2. NE JAMAIS modifier l'architecture des 9 sphères
   → Elle est GELÉE

3. NE JAMAIS créer de bases de données séparées pour les vues
   → Thread = seule source de vérité

4. NE JAMAIS implémenter d'exécution autonome d'agents
   → Agents proposent, humains décident

5. NE JAMAIS permettre d'accès cross-identity
   → HTTP 403 obligatoire

6. TOUJOURS append-only pour les événements
   → Jamais modifier, jamais supprimer

7. TOUJOURS inclure actor_id et actor_type dans les événements
   → Aucune action anonyme

8. TOUJOURS passer par les checkpoints de gouvernance
   → HTTP 423 = exécution bloquée
```

---

## 🛠 TECH STACK

```
BACKEND:
- Python 3.11+
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

FRONTEND:
- React 18+
- TypeScript
- TailwindCSS
- Zustand (state management)
- React Query

DATABASES:
- PostgreSQL (primary)
- Redis (cache)
- Pinecone (vectors)

TESTING:
- pytest (backend)
- Jest (frontend)
- Cypress (E2E)

INFRASTRUCTURE:
- Docker
- GitHub Actions (CI/CD)
```

---

## 📞 QUESTIONS DE DÉPART

```
Avant de commencer, confirme:

1. As-tu bien reçu les 4 ZIPs?
2. As-tu lu CANONICAL_INVARIANTS.md?
3. Comprends-tu le concept de Thread comme seule source de vérité?
4. Comprends-tu le principe "Agents proposent, Humains décident"?
5. Quelle phase veux-tu attaquer?
```

---

## 🚀 POUR COMMENCER

```bash
# 1. Extraire les 4 ZIPs dans le même dossier
unzip CHENU_V71_PART1_CORE.zip -d CHENU_V71/
unzip CHENU_V71_PART2_MODULES.zip -d CHENU_V71/
unzip CHENU_V71_PART3_KNOWLEDGE.zip -d CHENU_V71/
unzip CHENU_V71_PART4_FRONTEND.zip -d CHENU_V71/

# 2. Lire la documentation
cat CHENU_V71/docs/architecture/CANONICAL_INVARIANTS.md
cat CHENU_V71/README_FULL.md

# 3. Vérifier la structure
ls -la CHENU_V71/

# 4. Démarrer le développement selon QUICK_START.md
```

---

```
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                              ║
║                              BONNE CHANCE! 🚀                                               ║
║                                                                                              ║
║          "Structure precedes intelligence. Governance precedes execution."                   ║
║                                                                                              ║
║                                   © 2026 CHE·NU™                                            ║
║                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════╝
```
