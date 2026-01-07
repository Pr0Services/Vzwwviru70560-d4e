# CHE·NU v71 — CANONICAL MONOREPO

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    CHE·NU v71 — DIAGRAMME CANONIQUE                         ║
║                                                                              ║
║                     FRONTEND / BACKEND SÉPARATION                            ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

## 🧠 Diagramme Mental Global

```
UTILISATEUR
    │
    ▼
FRONTEND (Perception)
    │
    ▼
ORCHESTRATOR API (Frontière)
    │
    ▼
BACKEND (Réalité)
    │
    ▼
WORLDENGINE / AGENTS / ECONOMY
```

**👉 Le frontend ne parle jamais au monde réel**  
**👉 Le backend ne se soucie jamais de l'interface**

## 📁 Structure

```
che-nu/
├─ apps/
│  ├─ frontend/          # Perception & UI
│  │  └─ src/
│  │     ├─ app/         # AppShell, Router
│  │     ├─ hubs/        # Navigation, Communication, Execution
│  │     ├─ workspace/   # Tools, XR
│  │     ├─ synapse/     # SynapticContext (READ-ONLY)
│  │     ├─ api/         # orchestrator.client.ts (SEUL point de contact)
│  │     └─ ui/          # Components, Layouts
│  │
│  └─ backend/           # Réalité & Vérité
│     └─ src/
│        ├─ orchestrator/   # Authority Router, Intent Parser, Dispatch
│        ├─ core/           # WorldEngine, CausalEngine, FeedbackEngine
│        ├─ agents/         # Registry, Lifecycle, Execution
│        ├─ economy/        # Genesis, Equity, TrustScore
│        ├─ governance/     # OPA, Ethics, NovaKernel
│        ├─ api/            # HTTP routes
│        └─ storage/        # Artifacts, Snapshots, Logs
│
├─ packages/
│  ├─ shared-types/         # Types partagés
│  ├─ shared-protocols/     # Protocoles API
│  └─ synaptic-contracts/   # Contrats d'autorité
│
├─ canon/
│  ├─ CHE-NU/               # Canonical structure (00-09)
│  └─ docs/                 # Documentation
│
├─ infra/
│  ├─ docker/
│  ├─ k8s/
│  └─ deployment/
│
└─ Datasets/
```

## ❌ INTERDIT

- Frontend → WorldEngine
- Frontend → Agents
- Frontend → Economy
- Frontend → Causal logic

## ✅ AUTORISÉ

- Frontend → Orchestrator API (SEUL POINT)
- Backend → tout

## 🧪 Test Ultime

| Question | Réponse attendue |
|----------|------------------|
| Le frontend peut-il fonctionner avec un backend mocké ? | ✅ OUI |
| Le backend peut-il tourner sans frontend ? | ✅ OUI |
| Un agent peut-il être appelé sans passer par l'orchestrator ? | ❌ NON |
| Un écran connaît-il la logique métier ? | ❌ NON |

## 🚀 Démarrage

```bash
# Backend
cd apps/backend
pip install -r requirements.txt
python -m src.main

# Frontend
cd apps/frontend
npm install
npm run dev
```

---

**Version:** 71.0.0  
**Date:** 6 Janvier 2026  
**Status:** CANONICAL STRUCTURE
