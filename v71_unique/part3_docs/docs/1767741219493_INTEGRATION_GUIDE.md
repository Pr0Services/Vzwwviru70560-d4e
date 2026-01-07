# 🔗 CHE·NU™ V70 — INTÉGRATION COMPLÈTE FRONTEND ↔ BACKEND

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║              INTÉGRATION FRONTEND V68.6 ↔ BACKEND V69                        ║
║                                                                              ║
║                        GOUVERNANCE > EXÉCUTION                               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Date:** 6 janvier 2026  
**Frontend:** V68.6 (TypeScript, 0 erreurs)  
**Backend:** V69 (Python, 56,680 lignes)  
**Intégration:** V70 (11 services API, types complets)

---

## 📊 RÉSUMÉ

| Composant | Fichiers | Lignes | Status |
|-----------|----------|--------|--------|
| Frontend V68.6 | 2,582 | ~25,000 | ✅ Compilable |
| Backend V69 | 250 | 56,680 | ✅ Complet |
| Intégration | 14 | ~2,500 | ✅ CRÉÉ |
| **TOTAL** | **~2,850** | **~84,000** | ✅ |

---

## 🏗️ ARCHITECTURE D'INTÉGRATION

```
Frontend V68.6 (TypeScript)              Backend V69 (Python)
┌──────────────────────────┐             ┌──────────────────────────┐
│                          │             │                          │
│  src/services/api/       │   HTTP      │  api/endpoints/          │
│  ├── config.ts          ─┼────────────►├── routes.py             │
│  ├── http-client.ts     ─┼────────────►├── auth_router           │
│  ├── auth.service.ts    ─┼────────────►├── simulations_router    │
│  ├── simulations.ts     ─┼────────────►├── agents_router         │
│  ├── agents.service.ts  ─┼────────────►├── checkpoints_router    │
│  ├── checkpoints.ts     ─┼────────────►├── causal_router         │
│  ├── causal-engine.ts   ─┼────────────►├── xr_packs_router       │
│  ├── xr-packs.ts        ─┼────────────►├── audit_router          │
│  ├── audit.service.ts   ─┼────────────►└── health_router         │
│  ├── scenarios.ts        │             │                          │
│  ├── health.service.ts   │             │  api/websocket/          │
│  ├── websocket.ts       ─┼─WebSocket──►├── streaming.py          │
│  └── index.ts            │             │                          │
│                          │             └──────────────────────────┘
│  src/services/           │
│  ├── nova.constitution  ─┼─────► Uses simulations, checkpoints
│  └── governance.const   ─┼─────► Uses checkpoints, audit
│                          │
└──────────────────────────┘
```

---

## 📁 FICHIERS CRÉÉS

### Services API (11 fichiers)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `config.ts` | 120 | Configuration API centrale |
| `http-client.ts` | 180 | Client HTTP avec retry & auth |
| `auth.service.ts` | 90 | Authentification |
| `simulations.service.ts` | 120 | Nova Pipeline (simulations) |
| `scenarios.service.ts` | 100 | Gestion scénarios |
| `agents.service.ts` | 130 | Gestion agents |
| `checkpoints.service.ts` | 200 | **GOVERNANCE** (critique) |
| `causal-engine.service.ts` | 180 | Moteur causal |
| `xr-packs.service.ts` | 120 | Visualisation XR |
| `audit.service.ts` | 150 | Audit trail |
| `health.service.ts` | 50 | Health checks |
| `websocket.service.ts` | 200 | Real-time events |
| `index.ts` | 40 | Export centralisé |

### Types (1 fichier)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `api.types.ts` | 450 | Types TypeScript = modèles Pydantic |

### Services Constitution (2 fichiers)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `nova.constitution.service.ts` | 250 | Nova avec vraie API |
| `governance.constitution.service.ts` | 300 | Governance avec vraie API |

### Backend (1 fichier)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `cors_config.py` | 60 | Configuration CORS |

---

## 🔌 MAPPING ENDPOINTS

### Auth
| Frontend | Backend | Method |
|----------|---------|--------|
| `auth.login()` | `/api/v1/auth/login` | POST |
| `auth.logout()` | `/api/v1/auth/logout` | POST |
| `auth.refresh()` | `/api/v1/auth/refresh` | POST |
| `auth.me()` | `/api/v1/auth/me` | GET |

### Simulations (Nova)
| Frontend | Backend | Method |
|----------|---------|--------|
| `simulations.create()` | `/api/v1/simulations` | POST |
| `simulations.list()` | `/api/v1/simulations` | GET |
| `simulations.get(id)` | `/api/v1/simulations/{id}` | GET |
| `simulations.run(id)` | `/api/v1/simulations/{id}/run` | POST |
| `simulations.delete(id)` | `/api/v1/simulations/{id}` | DELETE |

### Agents
| Frontend | Backend | Method |
|----------|---------|--------|
| `agents.create()` | `/api/v1/agents` | POST |
| `agents.list()` | `/api/v1/agents` | GET |
| `agents.get(id)` | `/api/v1/agents/{id}` | GET |
| `agents.activate(id)` | `/api/v1/agents/{id}/activate` | POST |
| `agents.pause(id)` | `/api/v1/agents/{id}/pause` | POST |
| `agents.executeAction(id)` | `/api/v1/agents/{id}/actions` | POST |
| `agents.hierarchy()` | `/api/v1/agents/hierarchy` | GET |

### Checkpoints (GOVERNANCE)
| Frontend | Backend | Method |
|----------|---------|--------|
| `checkpoints.list()` | `/api/v1/checkpoints` | GET |
| `checkpoints.pending()` | `/api/v1/checkpoints/pending` | GET |
| `checkpoints.get(id)` | `/api/v1/checkpoints/{id}` | GET |
| `checkpoints.resolve(id)` | `/api/v1/checkpoints/{id}/resolve` | POST |

### Causal Engine
| Frontend | Backend | Method |
|----------|---------|--------|
| `causal.createDAG()` | `/api/v1/causal/dags` | POST |
| `causal.getDAG(id)` | `/api/v1/causal/dags/{id}` | GET |
| `causal.addNode(dagId)` | `/api/v1/causal/dags/{id}/nodes` | POST |
| `causal.addEdge(dagId)` | `/api/v1/causal/dags/{id}/edges` | POST |
| `causal.runInference()` | `/api/v1/causal/inference` | POST |

### XR Packs
| Frontend | Backend | Method |
|----------|---------|--------|
| `xr.generate()` | `/api/v1/xr-packs/generate` | POST |
| `xr.get(id)` | `/api/v1/xr-packs/{id}` | GET |
| `xr.manifest(id)` | `/api/v1/xr-packs/{id}/manifest` | GET |
| `xr.download(id)` | `/api/v1/xr-packs/{id}/download` | GET |

### Audit
| Frontend | Backend | Method |
|----------|---------|--------|
| `audit.events()` | `/api/v1/audit/events` | GET |
| `audit.report(simId)` | `/api/v1/audit/simulations/{id}/report` | GET |
| `audit.verify()` | `/api/v1/audit/verify` | POST |

### Health
| Frontend | Backend | Method |
|----------|---------|--------|
| `health.status()` | `/api/v1/health` | GET |
| `health.ready()` | `/api/v1/ready` | GET |
| `health.live()` | `/api/v1/live` | GET |

### WebSocket
| Frontend | Backend |
|----------|---------|
| `ws.connect(simId)` | `ws://host/ws/simulation/{id}` |

---

## 🔐 PRINCIPES CANON RESPECTÉS

### 1. GOUVERNANCE > EXÉCUTION
```typescript
// HTTP 423 = Checkpoint bloquant
if (error.status === 423) {
  this.setMode('checkpoint');
  // UI DOIT afficher modal approve/reject
}
```

### 2. XR = READ ONLY
```typescript
// Toutes les réponses XR ont read_only: true
if (!response.read_only) {
  console.warn('VIOLATION CANON: XR doit être read_only');
}
```

### 3. NO DISCRIMINATORY CAUSATION
```typescript
const BLOCKED_PATTERNS = [
  'race', 'gender', 'age', 'ethnicity', 'religion'
];

validateNotDiscriminatory(text: string): void {
  if (BLOCKED_PATTERNS.some(p => text.includes(p))) {
    throw new Error('GOVERNANCE VIOLATION');
  }
}
```

### 4. AUDIT TRAIL
```typescript
// Chaque action sensible est auditée
await auditService.verify({ event_id: eventId });
```

### 5. HITL CATEGORY C
```typescript
if (checkpoint.category === 'C') {
  // HITL OBLIGATOIRE - humain doit décider
  urgency = 'high';
}
```

---

## 🚀 UTILISATION

### 1. Configuration

```typescript
// .env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### 2. Import services

```typescript
import { api } from '@/services/api';

// Ou imports individuels
import { authService, checkpointsService } from '@/services/api';
```

### 3. Authentification

```typescript
// Login
const tokens = await api.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Get current user
const user = await api.auth.fetchCurrentUser();
```

### 4. Nova Pipeline

```typescript
import { NovaConstitutionService } from '@/services/nova.constitution.service';

// Initialize
NovaConstitutionService.init({
  onCheckpointPending: (cp) => showCheckpointModal(cp),
  onSimulationComplete: (sim) => showResults(sim),
});

// Query
const response = await NovaConstitutionService.query({
  message: "Analyze market trends",
});

// Handle checkpoint
if (response.checkpoint) {
  // Show modal, wait for user decision
  await NovaConstitutionService.approveCheckpoint(
    response.checkpoint.checkpoint_id,
    "Approved by analyst"
  );
}
```

### 5. Governance

```typescript
import { GovernanceConstitutionService } from '@/services/governance.constitution.service';

// Start polling for checkpoints
GovernanceConstitutionService.startPolling(5000);

// Handle checkpoint
await GovernanceConstitutionService.approve(checkpointId, "Approved");
// or
await GovernanceConstitutionService.reject(checkpointId, "Risk too high");
```

### 6. WebSocket

```typescript
import { webSocketService } from '@/services/api';

// Connect to simulation
webSocketService.connect(simulationId);

// Subscribe to events
webSocketService.onTick((tick) => {
  updateProgress(tick.tick / tick.total_ticks);
});

webSocketService.onCheckpointPending((checkpoint) => {
  showCheckpointModal(checkpoint);
});
```

---

## 📋 CHECKLIST DÉMARRAGE

### Backend V69

```bash
cd backend  # ou chenu_v69
pip install -r requirements.txt

# Ajouter CORS (copier cors_config.py)
# Dans main.py, ajouter:
# from api.cors_config import configure_cors
# configure_cors(app)

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend V68.6

```bash
cd frontend

# Copier les fichiers d'intégration
cp -r CHENU_INTEGRATION/frontend/src/services/api src/services/
cp -r CHENU_INTEGRATION/frontend/src/types src/
cp CHENU_INTEGRATION/frontend/src/services/*.constitution.service.ts src/services/

# Configurer .env
echo "VITE_API_URL=http://localhost:8000" > .env
echo "VITE_WS_URL=ws://localhost:8000/ws" >> .env

npm install
npm run dev
```

### Test connexion

```bash
# Test health
curl http://localhost:8000/api/v1/health

# Test auth
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

---

## 🎯 GOLDEN FLOWS

### GF-1: Auth → Login → Bureau
1. `auth.login()` → Token reçu
2. `auth.me()` → User info
3. Navigate to Bureau

### GF-2: Nova Query → Checkpoint → Execute
1. `NovaConstitutionService.query()` → Create simulation
2. `simulations.run()` → HTTP 423 (checkpoint)
3. UI shows checkpoint modal
4. User clicks Approve
5. `checkpoints.approve()` → Continue
6. `simulations.waitForCompletion()` → Result

### GF-3: Agent → Action → Audit
1. `agents.list()` → Get agents
2. `agents.executeAction()` → Execute (may checkpoint)
3. `audit.getByEntity('agent', agentId)` → Audit trail

---

## 📦 PACKAGE

Le package complet est disponible dans:
```
CHENU_INTEGRATION/
├── frontend/
│   └── src/
│       ├── services/api/     ← 11 services
│       ├── types/            ← Types API
│       └── services/*.constitution.service.ts
├── backend/
│   └── api/cors_config.py    ← CORS config
└── INTEGRATION_GUIDE.md      ← Cette documentation
```

---

**CHE·NU™** — Governed Intelligence Operating System  
*"GOUVERNANCE > EXÉCUTION"*
