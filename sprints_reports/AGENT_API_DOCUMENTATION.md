# 📚 CHE·NU V71 — AGENT API DOCUMENTATION

## Guide pour l'ajout d'agents via API

---

## 1. VUE D'ENSEMBLE

Le système CHE·NU permet l'ajout dynamique d'agents via l'API REST.
Les agents sont organisés en 4 niveaux hiérarchiques:

| Niveau | Fréquence | Rôle | Quantité |
|--------|-----------|------|----------|
| L0 | 999Hz | System (NOVA) | 1 |
| L1 | 888Hz | Orchestrators | 9 |
| L2 | 555-666Hz | Specialists | ~200 |
| L3 | 444Hz | Assistants | ~80 |

---

## 2. ENDPOINTS AGENT API

### 2.1 Lister les agents

```http
GET /api/v1/agents
Authorization: Bearer <token>
```

**Query Parameters:**
- `sphere_id` (int, optional): Filtrer par sphère (1-9)
- `level` (int, optional): Filtrer par niveau (0-3)
- `frequency` (int, optional): Filtrer par fréquence
- `active` (bool, optional): Agents actifs seulement
- `limit` (int, default=100): Nombre max de résultats
- `offset` (int, default=0): Pagination

**Response:**
```json
{
  "agents": [
    {
      "id": "finance-personal",
      "name": "Personal Finance Agent",
      "level": 2,
      "sphere_id": 1,
      "frequency_hz": 555,
      "capabilities": ["budgeting", "expense_tracking", "savings"],
      "parent_id": "orch-personnel",
      "token_budget": 20000,
      "is_active": true
    }
  ],
  "total": 287,
  "limit": 100,
  "offset": 0
}
```

---

### 2.2 Créer un agent

```http
POST /api/v1/agents
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "custom-assistant",
  "name": "Custom Assistant",
  "level": 3,
  "sphere_id": 1,
  "frequency_hz": 444,
  "capabilities": ["custom_task_1", "custom_task_2"],
  "description": "A custom L3 assistant for personal tasks",
  "parent_id": "finance-personal",
  "token_budget": 15000
}
```

**Validation Rules:**
| Field | Rule |
|-------|------|
| `id` | Unique, lowercase, hyphen-separated |
| `level` | 0-3 (L3 pour custom agents) |
| `sphere_id` | 1-9 (valid sphere) |
| `frequency_hz` | Must match level (L3=444, L2=555-666) |
| `parent_id` | Must exist and be parent level (L2 for L3) |
| `token_budget` | 1000-100000 |

**Response (201 Created):**
```json
{
  "id": "custom-assistant",
  "name": "Custom Assistant",
  "created_at": "2026-01-10T15:30:00Z",
  "status": "active"
}
```

---

### 2.3 Mettre à jour un agent

```http
PATCH /api/v1/agents/{agent_id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (partial update):**
```json
{
  "name": "Updated Assistant Name",
  "token_budget": 25000,
  "is_active": false
}
```

**Immutable Fields:**
- `id`
- `level`
- `frequency_hz`

---

### 2.4 Supprimer un agent

```http
DELETE /api/v1/agents/{agent_id}
Authorization: Bearer <token>
```

**Restrictions:**
- Cannot delete L0 (NOVA) or L1 (Orchestrators)
- Cannot delete agents with active children
- Soft delete only (is_active = false)

---

### 2.5 Obtenir un agent

```http
GET /api/v1/agents/{agent_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "finance-personal",
  "name": "Personal Finance Agent",
  "level": 2,
  "sphere_id": 1,
  "frequency_hz": 555,
  "capabilities": ["budgeting", "expense_tracking", "savings"],
  "description": "L2 Specialist for personal finance management",
  "parent_id": "orch-personnel",
  "token_budget": 20000,
  "tokens_used_today": 3450,
  "is_active": true,
  "children": [
    {"id": "budget-assistant", "level": 3},
    {"id": "bill-reminder", "level": 3}
  ],
  "stats": {
    "sessions_today": 15,
    "avg_response_time_ms": 234,
    "success_rate": 0.97
  }
}
```

---

## 3. HIÉRARCHIE DES AGENTS

### 3.1 Structure

```
NOVA (L0, 999Hz)
├── orch-personnel (L1, 888Hz)
│   ├── finance-personal (L2, 555Hz)
│   │   ├── budget-assistant (L3, 444Hz)
│   │   └── bill-reminder (L3, 444Hz)
│   └── health-wellness (L2, 555Hz)
│       └── wellness-coach (L3, 444Hz)
└── orch-business (L1, 888Hz)
    └── ...
```

### 3.2 Règles de parenté

| Agent Level | Parent Level | Notes |
|-------------|--------------|-------|
| L1 | L0 | Tous les orchestrators ont NOVA comme parent |
| L2 | L1 | Specialists sont sous un orchestrator |
| L3 | L2 | Assistants sont sous un specialist |

---

## 4. FRÉQUENCES AT·OM

### 4.1 Channels disponibles

| Fréquence | Usage | Level |
|-----------|-------|-------|
| 111 Hz | Reserved | - |
| 222 Hz | Background tasks | - |
| 333 Hz | Scheduled jobs | - |
| 444 Hz | **Anchor** (L3 Assistants) | L3 |
| 555 Hz | L2 Specialists (primary) | L2 |
| 666 Hz | L2 Specialists (secondary) | L2 |
| 777 Hz | Reserved | - |
| 888 Hz | L1 Orchestrators | L1 |
| 999 Hz | L0 System (NOVA) | L0 |

### 4.2 Validation fréquence

```python
def validate_frequency(level: int, frequency: int) -> bool:
    rules = {
        0: [999],           # L0: 999Hz only
        1: [888],           # L1: 888Hz only
        2: [555, 666],      # L2: 555 or 666Hz
        3: [444],           # L3: 444Hz only (anchor)
    }
    return frequency in rules.get(level, [])
```

---

## 5. TOKEN BUDGETS

### 5.1 Limites par niveau

| Level | Default Budget | Max Budget |
|-------|---------------|------------|
| L0 | Unlimited | Unlimited |
| L1 | 100,000 | 500,000 |
| L2 | 25,000 | 100,000 |
| L3 | 10,000 | 50,000 |

### 5.2 Endpoint usage

```http
GET /api/v1/agents/{agent_id}/usage
Authorization: Bearer <token>
```

**Response:**
```json
{
  "agent_id": "finance-personal",
  "budget": 25000,
  "used_today": 12500,
  "used_this_hour": 2100,
  "remaining": 12500,
  "reset_at": "2026-01-11T00:00:00Z"
}
```

---

## 6. CAPABILITIES

### 6.1 Capabilities prédéfinies

```python
STANDARD_CAPABILITIES = {
    # Finance
    "budgeting", "expense_tracking", "savings", "invoicing",
    "accounting", "payroll", "tax_planning",
    
    # Communication
    "email", "chat", "notifications", "reminders",
    
    # Analysis
    "data_analysis", "reporting", "forecasting",
    
    # Creative
    "writing", "editing", "design", "media_production",
    
    # Organization
    "scheduling", "task_management", "project_planning",
}
```

### 6.2 Custom capabilities

Vous pouvez définir des capabilities custom:
```json
{
  "capabilities": ["custom:my_workflow", "custom:special_task"]
}
```

Prefix `custom:` requis pour éviter les conflits.

---

## 7. EXEMPLES D'UTILISATION

### 7.1 Créer un assistant personnalisé

```bash
curl -X POST https://api.chenu.io/api/v1/agents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "daily-standup-assistant",
    "name": "Daily Standup Assistant",
    "level": 3,
    "sphere_id": 2,
    "frequency_hz": 444,
    "capabilities": ["scheduling", "reminders", "reporting"],
    "description": "Helps organize daily standup meetings",
    "parent_id": "project-business",
    "token_budget": 15000
  }'
```

### 7.2 Lister les agents d'une sphère

```bash
curl -X GET "https://api.chenu.io/api/v1/agents?sphere_id=1&level=3" \
  -H "Authorization: Bearer $TOKEN"
```

### 7.3 Désactiver un agent

```bash
curl -X PATCH https://api.chenu.io/api/v1/agents/daily-standup-assistant \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

---

## 8. ERREURS COMMUNES

| Code | Message | Solution |
|------|---------|----------|
| 400 | Invalid frequency for level | Vérifier les règles de fréquence |
| 400 | Parent not found | Vérifier parent_id |
| 400 | Invalid parent level | L3 doit avoir parent L2 |
| 409 | Agent ID already exists | Choisir un ID unique |
| 422 | Token budget exceeds maximum | Réduire token_budget |

---

## 9. WEBHOOKS (Optionnel)

Vous pouvez être notifié des événements agent:

```http
POST /api/v1/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-server.com/webhook",
  "events": ["agent.created", "agent.updated", "agent.budget_warning"]
}
```

**Events disponibles:**
- `agent.created`
- `agent.updated`
- `agent.deactivated`
- `agent.budget_warning` (80% used)
- `agent.budget_exceeded`

---

**Document Version**: 1.0  
**Date**: 10 Janvier 2026  
**CHE·NU V71 — Zama Ready**
