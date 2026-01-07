# 📡 CHE·NU V71 — API Reference

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                          API REFERENCE COMPLÈTE                              ║
║                              CHE·NU™ V71                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Base URL:** `https://api.che-nu.com/api/v2`  
**Version:** 71.0.0  
**Format:** JSON  
**Auth:** Bearer JWT

---

## 📋 Table des Matières

1. [Authentication](#1-authentication)
2. [Threads](#2-threads)
3. [Events](#3-events)
4. [Messages](#4-messages)
5. [Decisions](#5-decisions)
6. [Actions](#6-actions)
7. [Live Sessions](#7-live-sessions)
8. [XR Environment](#8-xr-environment)
9. [Nova Pipeline](#9-nova-pipeline)
10. [Error Codes](#10-error-codes)

---

## 1. Authentication

### POST /auth/register
Créer un nouveau compte.

```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

// Response 201
{
  "user_id": "usr_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2026-01-07T12:00:00Z"
}
```

### POST /auth/login
Authentification.

```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Response 200
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### POST /auth/refresh
Rafraîchir le token.

```json
// Request
{
  "refresh_token": "eyJ..."
}

// Response 200
{
  "access_token": "eyJ...",
  "expires_in": 3600
}
```

---

## 2. Threads

### POST /threads
Créer un thread.

```json
// Request
{
  "founding_intent": "Développer la feature X",  // REQUIS
  "title": "Feature X Development",
  "description": "Description optionnelle",
  "type": "collective",  // personal | collective | inter_sphere
  "sphere": "business"
}

// Response 201
{
  "thread_id": "thr_xyz789",
  "founding_intent": "Développer la feature X",
  "title": "Feature X Development",
  "type": "collective",
  "status": "active",
  "created_at": "2026-01-07T12:00:00Z",
  "owner_id": "usr_abc123"
}
```

### GET /threads/{thread_id}
Récupérer un thread.

```json
// Response 200
{
  "thread_id": "thr_xyz789",
  "founding_intent": "Développer la feature X",
  "title": "Feature X Development",
  "description": "...",
  "type": "collective",
  "status": "active",
  "created_at": "2026-01-07T12:00:00Z",
  "owner_id": "usr_abc123",
  "participants": [
    {"user_id": "usr_abc123", "role": "owner"},
    {"user_id": "usr_def456", "role": "member"}
  ],
  "stats": {
    "event_count": 42,
    "message_count": 30,
    "decision_count": 5,
    "action_count": 7
  }
}
```

### GET /threads
Lister les threads de l'utilisateur.

```json
// Query params: ?status=active&type=collective&limit=20&offset=0

// Response 200
{
  "threads": [...],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

### POST /threads/{thread_id}/archive
Archiver un thread (jamais supprimer).

```json
// Request
{
  "reason": "Projet terminé"
}

// Response 200
{
  "thread_id": "thr_xyz789",
  "status": "archived",
  "archived_at": "2026-01-07T12:00:00Z",
  "archived_by": "usr_abc123"
}
```

---

## 3. Events

### GET /threads/{thread_id}/events
Récupérer les événements (filtré par permission).

```json
// Query params: ?event_type=MESSAGE_POSTED&limit=50&offset=0

// Response 200
{
  "events": [
    {
      "event_id": "evt_001",
      "event_type": "MESSAGE_POSTED",
      "thread_id": "thr_xyz789",
      "actor_id": "usr_abc123",
      "actor_type": "human",
      "payload": {"content": "Hello!"},
      "redaction_level": "public",
      "created_at": "2026-01-07T12:00:00Z",
      "integrity_hash": "a1b2c3d4..."
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

---

## 4. Messages

### POST /threads/{thread_id}/messages
Poster un message.

```json
// Request
{
  "content": "Voici mon message",
  "redaction_level": "semi_private"  // public | semi_private | private
}

// Response 201
{
  "event_id": "evt_002",
  "event_type": "MESSAGE_POSTED",
  "content": "Voici mon message",
  "actor_id": "usr_abc123",
  "actor_type": "human",
  "created_at": "2026-01-07T12:00:00Z"
}
```

---

## 5. Decisions

### POST /threads/{thread_id}/decisions
Enregistrer une décision (HUMAN seulement).

```json
// Request
{
  "decision": "Utiliser Python/FastAPI",
  "rationale": "Expertise de l'équipe",
  "options_considered": [
    {"option": "Node.js", "rejected_reason": "Moins d'expérience"},
    {"option": "Go", "rejected_reason": "Courbe d'apprentissage"}
  ],
  "redaction_level": "semi_private"
}

// Response 201
{
  "event_id": "evt_003",
  "event_type": "DECISION_RECORDED",
  "decision": "Utiliser Python/FastAPI",
  "rationale": "Expertise de l'équipe",
  "actor_id": "usr_abc123",
  "actor_type": "human",  // TOUJOURS human pour decisions
  "created_at": "2026-01-07T12:00:00Z"
}
```

---

## 6. Actions

### POST /threads/{thread_id}/actions
Créer une action.

```json
// Request
{
  "action": "Implémenter l'API de threads",
  "assigned_to": "usr_def456",
  "due_date": "2026-01-15",
  "priority": "high"
}

// Response 201
{
  "event_id": "evt_004",
  "event_type": "ACTION_CREATED",
  "action_id": "act_001",
  "action": "Implémenter l'API de threads",
  "status": "pending",
  "assigned_to": "usr_def456",
  "created_at": "2026-01-07T12:00:00Z"
}
```

### PUT /threads/{thread_id}/actions/{action_id}
Mettre à jour une action.

```json
// Request
{
  "status": "completed",  // pending | in_progress | completed | cancelled
  "notes": "Terminé avec succès"
}

// Response 200
{
  "event_id": "evt_005",
  "event_type": "ACTION_UPDATED",
  "action_id": "act_001",
  "status": "completed",
  "updated_at": "2026-01-07T12:00:00Z"
}
```

---

## 7. Live Sessions

### POST /threads/{thread_id}/live/start
Démarrer une session live.

```json
// Request
{
  "topic": "Sprint Planning",
  "scheduled_duration": 60  // minutes
}

// Response 201
{
  "event_id": "evt_006",
  "event_type": "LIVE_STARTED",
  "session_id": "live_001",
  "topic": "Sprint Planning",
  "started_at": "2026-01-07T12:00:00Z"
}
```

### POST /threads/{thread_id}/live/end
Terminer une session live.

```json
// Request
{
  "session_id": "live_001",
  "summary": "Résumé de la session"
}

// Response 200
{
  "event_id": "evt_007",
  "event_type": "LIVE_ENDED",
  "session_id": "live_001",
  "duration_minutes": 45,
  "ended_at": "2026-01-07T12:45:00Z",
  "snapshot_id": "snap_001"  // Auto-generated snapshot
}
```

---

## 8. XR Environment

### POST /threads/{thread_id}/xr/generate
Générer un blueprint XR.

```json
// Request
{
  "force_regenerate": false
}

// Response 200
{
  "thread_id": "thr_xyz789",
  "template": "business_room",
  "generated_at": "2026-01-07T12:00:00Z",
  "version": "1.0.0",
  "zones": [
    {
      "id": "intent_wall",
      "type": "wall",
      "title": "Intent",
      "items": [...]
    },
    {
      "id": "decision_wall",
      "type": "wall",
      "title": "Decisions",
      "items": [...]
    },
    {
      "id": "action_table",
      "type": "table",
      "title": "Actions",
      "items": [...]
    }
  ],
  "portals": [...],
  "references": {
    "events": ["evt_001", "evt_002"],
    "snapshots": ["snap_001"]
  }
}
```

### GET /threads/{thread_id}/xr/blueprint/latest
Récupérer le dernier blueprint.

### DELETE /threads/{thread_id}/xr/cache
Invalider le cache XR.

---

## 9. Nova Pipeline

### POST /nova/query
Exécuter une requête Nova.

```json
// Request
{
  "query": "Analyser les décisions du thread",
  "thread_id": "thr_xyz789",
  "options": {
    "require_approval": true,
    "max_tokens": 1000
  }
}

// Response 200 (Success)
{
  "pipeline_id": "pipe_001",
  "status": "completed",
  "result": {...},
  "lanes": {
    "lane_a_intent": {...},
    "lane_b_context": {...},
    "lane_c_encoding": {...},
    "lane_d_governance": {...},
    "lane_e_checkpoint": {...},
    "lane_f_execution": {...},
    "lane_g_audit": {...}
  },
  "metrics": {
    "total_time_ms": 1234,
    "tokens_used": 500
  }
}

// Response 423 (Checkpoint Required)
{
  "pipeline_id": "pipe_001",
  "status": "checkpoint_pending",
  "checkpoint": {
    "id": "cp_001",
    "type": "governance",
    "reason": "Action sensible détectée",
    "requires_approval": true,
    "options": ["approve", "reject"]
  }
}
```

### POST /nova/checkpoint/{checkpoint_id}/approve
Approuver un checkpoint.

```json
// Response 200
{
  "checkpoint_id": "cp_001",
  "status": "approved",
  "pipeline_continues": true
}
```

### POST /nova/checkpoint/{checkpoint_id}/reject
Rejeter un checkpoint.

```json
// Request
{
  "reason": "Non approuvé pour raison X"
}

// Response 200
{
  "checkpoint_id": "cp_001",
  "status": "rejected",
  "pipeline_terminated": true
}
```

---

## 10. Error Codes

| Code | Name | Description |
|------|------|-------------|
| 400 | Bad Request | Requête malformée |
| 401 | Unauthorized | Token manquant/invalide |
| 403 | Forbidden | Permission refusée |
| 404 | Not Found | Ressource inexistante |
| 409 | Conflict | Conflit d'état |
| 422 | Unprocessable | Validation échouée |
| 423 | Locked | Checkpoint en attente |
| 429 | Too Many Requests | Rate limit atteint |
| 500 | Internal Error | Erreur serveur |

### Error Response Format

```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You don't have permission to perform this action",
    "details": {
      "required_role": "owner",
      "current_role": "viewer"
    }
  },
  "request_id": "req_abc123"
}
```

---

## 📊 Rate Limits

| Endpoint | Limit |
|----------|-------|
| Auth | 10/min |
| Threads | 100/min |
| Events | 200/min |
| Nova | 20/min |
| XR | 50/min |

---

## 🔐 Authentication

Toutes les requêtes (sauf /auth/*) requièrent:

```
Authorization: Bearer <access_token>
```

---

**© 2025-2026 CHE·NU™**  
**API Reference V71**
