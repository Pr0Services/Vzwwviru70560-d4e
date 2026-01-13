# 🔧 CHE·NU V71 — BACKEND VERIFICATION PLAN

## Phase: Day 1-2 (10-11 Janvier 2025)
## Objectif: Vérification backend pré-déploiement Zama

---

## 1. ÉTAT ACTUEL DU BACKEND

### 1.1 Statistiques (Audit Déc 2025)

| Métrique | Valeur | Status |
|----------|--------|--------|
| Fichiers Backend | 88 | ✅ |
| APIs REST | 6/6 | ✅ |
| Services métier | 6/6 | ✅ |
| Orchestration L0 | 6/6 | ✅ |
| Nova Intelligence | 849L | ✅ |
| WebSocket | Présent | ⚠️ À valider |

### 1.2 Actions Critiques Identifiées

| # | Action | Priorité | Status |
|---|--------|----------|--------|
| 1 | Corriger imports backend | P0 | 🔄 |
| 2 | Créer backend/app.py unifié | P0 | 🔄 |
| 3 | Configuration database | P0 | 🔄 |
| 4 | Valider WebSocket | P1 | 🔄 |
| 5 | JWT token generation | P1 | 🔄 |

---

## 2. SMOKE TESTS CHECKLIST

### 2.1 API Health Checks

```bash
# Test 1: Server startup
curl -s http://localhost:8000/health | jq

# Test 2: API version
curl -s http://localhost:8000/api/v1/version | jq

# Test 3: OpenAPI docs
curl -s http://localhost:8000/docs -o /dev/null -w "%{http_code}"

# Test 4: Database connectivity
curl -s http://localhost:8000/api/v1/health/db | jq
```

### 2.2 Authentication Flow

```bash
# Test 5: Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@chenu.io","password":"Test123!","name":"Test User"}'

# Test 6: Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@chenu.io","password":"Test123!"}'

# Test 7: Token refresh
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Authorization: Bearer $REFRESH_TOKEN"
```

### 2.3 Core Endpoints

```bash
# Test 8: List spheres
curl -s http://localhost:8000/api/v1/spheres \
  -H "Authorization: Bearer $TOKEN" | jq

# Test 9: Get agents
curl -s http://localhost:8000/api/v1/agents \
  -H "Authorization: Bearer $TOKEN" | jq

# Test 10: Create thread
curl -X POST http://localhost:8000/api/v1/threads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Thread","sphere_id":1}'
```

### 2.4 WebSocket Connection

```javascript
// Test 11: WebSocket connect
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: ACCESS_TOKEN
  }));
};
ws.onmessage = (event) => console.log('WS:', event.data);
```

### 2.5 AT·OM Integration

```bash
# Test 12: AT·OM heartbeat endpoint
curl -s http://localhost:8000/api/atom/heartbeat | jq

# Test 13: AT·OM status
curl -s http://localhost:8000/api/atom/status | jq

# Test 14: Agent resonance (secured)
curl -X POST http://localhost:8000/api/atom/resonance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"frequency":444,"phase":0}'
```

---

## 3. BACKEND STRUCTURE VERIFICATION

### 3.1 Required Files

```
backend/
├── app.py                    # Main entry point (P0)
├── api/
│   ├── main.py              # FastAPI app
│   ├── extended_api.py      # Extended routes
│   ├── oauth_endpoints.py   # OAuth (413L) ✅
│   └── routers/
│       ├── auth.py
│       ├── spheres.py
│       ├── agents.py
│       ├── threads.py
│       ├── conversations.py
│       └── atom.py          # AT·OM routes (NEW)
├── services/
│   ├── nova.py              # Nova Intelligence (849L) ✅
│   ├── orchestration.py     # L0 Orchestration ✅
│   └── atom_service.py      # AT·OM integration (NEW)
├── models/
│   └── *.py                 # SQLAlchemy models
├── schemas/
│   └── *.py                 # Pydantic schemas
├── config/
│   ├── settings.py
│   └── database.py
└── utils/
    ├── auth.py
    └── websocket.py
```

### 3.2 Import Verification Script

```python
#!/usr/bin/env python3
"""Backend import verification script"""

import sys
import importlib

REQUIRED_MODULES = [
    'fastapi',
    'uvicorn',
    'sqlalchemy',
    'pydantic',
    'python-jose',
    'passlib',
    'asyncpg',
    'redis',
    'websockets',
]

def verify_imports():
    errors = []
    for module in REQUIRED_MODULES:
        try:
            importlib.import_module(module.replace('-', '_'))
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            errors.append(module)
    
    return len(errors) == 0

if __name__ == "__main__":
    success = verify_imports()
    sys.exit(0 if success else 1)
```

---

## 4. DATABASE VERIFICATION

### 4.1 Schema Check

```sql
-- Verify core tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected tables:
-- users, spheres, agents, threads, conversations, 
-- messages, documents, notes, favorites, atom_resonance
```

### 4.2 Required Tables

| Table | Purpose | Status |
|-------|---------|--------|
| users | User accounts | 🔄 |
| spheres | 9 Spheres | 🔄 |
| agents | 287+ Agents | 🔄 |
| threads | Task threads | 🔄 |
| conversations | Chat history | 🔄 |
| messages | Individual messages | 🔄 |
| atom_resonance | AT·OM signal data | 🔄 NEW |
| atom_agents | Agent wave state | 🔄 NEW |

### 4.3 Migration Script

```bash
# Run Alembic migrations
cd backend
alembic upgrade head

# Verify migration status
alembic current
```

---

## 5. AT·OM INTEGRATION ENDPOINTS

### 5.1 New Routes Required

```python
# backend/api/routers/atom.py

from fastapi import APIRouter, Depends, HTTPException
from typing import Optional

router = APIRouter(prefix="/api/atom", tags=["AT·OM"])

@router.get("/status")
async def get_status():
    """AT·OM system status"""
    return {
        "status": "operational",
        "frequency": 444,
        "agents_active": 0,
        "kill_switch": False
    }

@router.get("/heartbeat")
async def heartbeat():
    """444Hz heartbeat endpoint"""
    return {
        "frequency": 444,
        "phase": get_current_phase(),
        "timestamp": datetime.utcnow().isoformat()
    }

@router.post("/resonance")
async def update_resonance(
    data: ResonancePayload,
    user = Depends(get_current_user)
):
    """Update agent resonance state"""
    # Validate frequency (111-999)
    if data.frequency % 111 != 0 or data.frequency > 999:
        raise HTTPException(400, "Invalid frequency")
    
    return {"status": "resonance_updated", "frequency": data.frequency}

@router.post("/killswitch")
async def activate_killswitch(
    seal: str = Header(..., alias="X-Architect-Seal"),
    reason: Optional[str] = "manual"
):
    """Emergency kill-switch (Architect only)"""
    if not verify_architect_seal(seal):
        raise HTTPException(403, "Invalid Architect seal")
    
    # Activate 432Hz dormancy
    return {"status": "dormant", "frequency": 432}

@router.post("/revive")
async def revive_system(
    seal: str = Header(..., alias="X-Architect-Seal")
):
    """Revive system from dormancy (Architect only)"""
    if not verify_architect_seal(seal):
        raise HTTPException(403, "Invalid Architect seal")
    
    return {"status": "operational", "frequency": 444}
```

### 5.2 WebSocket AT·OM Events

```python
# WebSocket event types for AT·OM
ATOM_EVENTS = [
    "atom:heartbeat",      # 444Hz pulse
    "atom:resonance",      # Frequency update
    "atom:agent_wave",     # Agent wave state
    "atom:cluster_update", # Cluster changes
    "atom:kill",           # Kill-switch activated
    "atom:revive",         # System revived
]
```

---

## 6. EXECUTION CHECKLIST

### Day 1 (Jan 10)

- [ ] Verify backend file structure
- [ ] Run import verification script
- [ ] Check database connectivity
- [ ] Create missing AT·OM routes
- [ ] Run smoke tests 1-7 (health, auth)

### Day 2 (Jan 11)

- [ ] Run smoke tests 8-14 (core, websocket, atom)
- [ ] Verify all 9 spheres in database
- [ ] Test WebSocket connection
- [ ] Validate JWT token flow
- [ ] Document any failures

---

## 7. SUCCESS CRITERIA

| Criteria | Target | Method |
|----------|--------|--------|
| API Health | 200 OK | curl /health |
| Auth Flow | JWT issued | Login test |
| Database | Connected | /health/db |
| WebSocket | Connected | ws://connect |
| AT·OM Heartbeat | 444Hz | /api/atom/heartbeat |
| Smoke Tests | 14/14 | Test suite |

---

## 8. ROLLBACK PLAN

Si les tests échouent:

1. **Database issues**: Rollback migrations `alembic downgrade -1`
2. **Import errors**: Check requirements.txt, reinstall deps
3. **WebSocket fails**: Verify uvicorn[standard] installed
4. **AT·OM errors**: Check AegisShield integration

---

**Document**: Backend Verification Plan V71  
**Date**: 2025-01-10  
**Next**: Agent Instantiation (Jan 12)
