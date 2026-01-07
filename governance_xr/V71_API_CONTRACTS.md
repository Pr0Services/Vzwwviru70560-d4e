# 📋 CHE·NU™ V71 — API CONTRACTS

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    CONTRATS API V71 — RÉFÉRENCE                              ║
║                                                                              ║
║                Agent Alpha ↔ Agent Beta Synchronization                      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Date:** 6 Janvier 2026  
**Version:** V71.0.0  
**Status:** LOCKED — Ne pas modifier sans sync agents

---

## 🔐 AUTHENTICATION

### Headers Requis

```http
Authorization: Bearer <jwt_token>
X-Identity-ID: <user_identity_uuid>
X-Request-ID: <unique_request_uuid>
Content-Type: application/json
```

### Token Structure

```typescript
interface JWTPayload {
  sub: string;           // User ID
  identity_id: string;   // Identity UUID
  spheres: string[];     // Accessible spheres
  exp: number;           // Expiration timestamp
  iat: number;           // Issued at
}
```

---

## 🧠 SYNAPTIC API

### Base URL: `/api/v2/synaptic`

---

### POST /context/create

Créer un nouveau contexte synaptic.

**Request:**
```typescript
interface CreateContextRequest {
  task_id: string;
  sphere_id: string;
  user_id: string;
  location?: {
    anchor_id: string;
    coordinates?: { lat: number; lon: number };
    zone_type?: "personal" | "shared" | "public";
  };
  toolchain?: {
    tools: string[];
    agents: string[];
    max_parallel?: number;
  };
  channel?: {
    channel_id: string;
    channel_type: "direct" | "group" | "broadcast";
    encryption_level: "none" | "standard" | "quantum";
  };
  guards?: ("opa_required" | "identity_check" | "cost_limit" | "scope_enforce" | "audit_all")[];
  scope?: "private" | "cooperative" | "common";
  ttl_seconds?: number;  // Default: 300
}
```

**Response 201:**
```typescript
interface ContextResponse {
  id: string;           // UUID
  task_id: string;
  sphere_id: string;
  user_id: string;
  is_active: boolean;
  created_at: string;   // ISO8601
  expires_at: string;   // ISO8601
  location: LocationAnchor | null;
  toolchain: ToolchainConfig | null;
  channel: CommunicationChannel | null;
  guards: string[];
  scope: string;
  signature: string;
}
```

---

### GET /context/{context_id}

Récupérer un contexte existant.

**Response 200:**
```typescript
// Same as ContextResponse above
```

**Response 404:**
```typescript
interface ErrorResponse {
  error: "context_not_found";
  message: string;
}
```

---

### POST /switch

Effectuer un switch de contexte atomique sur les 3 hubs.

**Request:**
```typescript
interface SwitchRequest {
  context: CreateContextRequest;  // Nouveau contexte
}
```

**Response 200:**
```typescript
interface SwitchReport {
  status: "success" | "expired" | "failed" | "rollback";
  context_id: string;
  previous_context_id: string | null;
  hub_states: {
    communication: HubState;
    navigation: HubState;
    execution: HubState;
  };
  duration_ms: number;
  timestamp: string;
}

interface HubState {
  status: "active" | "inactive" | "error";
  data: Record<string, any>;
}
```

**Response 400:**
```typescript
interface ErrorResponse {
  error: "switch_failed";
  message: string;
  rollback_performed: boolean;
}
```

---

### GET /switch/dashboard

Données pour le dashboard synaptic.

**Response 200:**
```typescript
interface DashboardData {
  current_context: ContextResponse | null;
  communication: {
    status: string;
    channel_id: string | null;
    encryption: string;
    members_count: number;
  };
  navigation: {
    status: string;
    location: string | null;
    zone: string;
    coordinates: { lat: number; lon: number } | null;
  };
  execution: {
    status: string;
    workspace: string | null;
    active_tools: string[];
    active_agents: string[];
  };
  statistics: {
    total_switches: number;
    successful_switches: number;
    average_switch_time_ms: number;
  };
}
```

---

### GET /graph/summary

Résumé du graphe inter-modules.

**Response 200:**
```typescript
interface GraphSummary {
  total_edges: number;
  by_priority: {
    P0: number;
    P1: number;
    P2: number;
    P3: number;
  };
  active_edges: number;
  modules_connected: number;
}
```

---

### GET /graph/edges

Toutes les connexions du graphe.

**Query params:**
- `priority` (optional): "P0" | "P1" | "P2" | "P3"
- `source` (optional): Module ID

**Response 200:**
```typescript
interface EdgesResponse {
  edges: SynapticEdge[];
  total: number;
}

interface SynapticEdge {
  id: string;
  source: string;      // Module ID
  target: string;      // Module ID
  priority: "P0" | "P1" | "P2" | "P3";
  trigger: {
    event_type: string;
    conditions: Record<string, any>;
  };
  action: {
    action_type: string;
    parameters: Record<string, any>;
  };
  is_active: boolean;
  fire_count: number;
  last_fired: string | null;
}
```

---

### POST /graph/fire

Déclencher manuellement une edge.

**Request:**
```typescript
interface FireEdgeRequest {
  edge_id: string;
  payload: Record<string, any>;
}
```

**Response 200:**
```typescript
interface FireResult {
  success: boolean;
  edge_id: string;
  execution_time_ms: number;
  result: any;
}
```

---

### GET /graph/mermaid

Diagramme Mermaid du graphe.

**Response 200:**
```typescript
interface MermaidResponse {
  diagram: string;  // Mermaid syntax
}
```

---

### GET /yellowpages/entries

Toutes les entrées du registry.

**Response 200:**
```typescript
interface YellowPagesResponse {
  entries: YellowPageEntry[];
  total: number;
}

interface YellowPageEntry {
  need: string;           // NeedTag
  authority: string;      // ModuleID
  authority_available: boolean;
  fallback: string | null;
  guards: string[];       // GuardRequirement[]
  description: string;
}
```

---

### POST /yellowpages/route

Router un besoin vers l'autorité appropriée.

**Request:**
```typescript
interface RouteRequest {
  need: string;  // NeedTag
}
```

**Response 200:**
```typescript
interface RoutingDecision {
  need: string;
  routed_to: string;          // ModuleID
  used_fallback: boolean;
  fallback_reason: string | null;
  guards_applied: string[];
  reason: string;
  timestamp: string;
}
```

---

## ⚛️ QUANTUM API

### Base URL: `/api/v2/quantum`

---

### POST /compute

Exécuter une opération avec auto-routing.

**Request:**
```typescript
interface ComputeRequest {
  operation: "encryption" | "matrix_multiply" | "optimization" | 
             "simulation" | "data_process" | "search";
  priority: "survival" | "security" | "production" | "background";
  payload: Record<string, any>;
  constraints?: {
    max_latency_ms?: number;
    max_cost?: number;
    require_quantum?: boolean;
  };
}
```

**Response 200:**
```typescript
interface ComputeResult {
  request_id: string;
  status: "completed" | "failed" | "timeout";
  compute_used: "classical" | "photonic" | "quantum";
  result: any;
  latency_ms: number;
  cost: number;
  fallback_used: boolean;
}
```

---

### POST /compute/route

Obtenir décision de routing sans exécuter.

**Request:**
```typescript
// Same as ComputeRequest
```

**Response 200:**
```typescript
interface RoutingDecision {
  selected: "classical" | "photonic" | "quantum";
  reason: string;
  score: number;
  alternatives: {
    compute_type: string;
    score: number;
    available: boolean;
  }[];
  fallback_chain: string[];
}
```

---

### GET /capabilities

Capacités de tous les backends.

**Response 200:**
```typescript
interface CapabilitiesResponse {
  backends: {
    classical: ComputeCapability;
    photonic: ComputeCapability;
    quantum: ComputeCapability;
  };
}

interface ComputeCapability {
  is_available: boolean;
  latency_ms: number;
  throughput_ops: number;
  error_rate: number;
  cost_per_op: number;
  supported_operations: string[];
}
```

---

### POST /hub/operation

Exécuter opération spécifique à un hub.

**Request:**
```typescript
interface HubOperationRequest {
  hub: "communication" | "navigation" | "execution";
  operation: string;
  params: Record<string, any>;
}
```

**Response 200:**
```typescript
interface HubOperationResult {
  hub: string;
  operation: string;
  status: "completed" | "failed";
  result: any;
  duration_ms: number;
}
```

---

## 🔧 MULTITECH API

### Base URL: `/api/v2/multitech`

---

### GET /technologies

Toutes les technologies.

**Query params:**
- `category` (optional): "security" | "compute" | "communication" | "sensing" | "storage"
- `level` (optional): 0-4
- `phase` (optional): "phase_1_compatibility" | "phase_2_hybridation" | "phase_3_quantum"
- `available_only` (optional): boolean

**Response 200:**
```typescript
interface TechnologiesResponse {
  technologies: Technology[];
  total: number;
}

interface Technology {
  tech_id: string;
  name: string;
  category: string;
  level: number;
  phase: string;
  is_available: boolean;
  is_production_ready: boolean;
  dependencies: string[];
  fallback_to: string | null;
  description: string;
}
```

---

### POST /select

Sélectionner technologie avec application des règles.

**Request:**
```typescript
interface SelectRequest {
  tech_id: string;
}
```

**Response 200:**
```typescript
interface SelectResponse {
  requested: string;
  selected: string;
  fallback_used: boolean;
  rules_applied: string[];
  reason: string;
}
```

---

### GET /phase

Phase d'intégration actuelle.

**Response 200:**
```typescript
interface PhaseResponse {
  current_phase: "phase_1_compatibility" | "phase_2_hybridation" | "phase_3_quantum";
  phase_number: number;
  description: string;
  technologies_count: number;
}
```

---

### POST /phase/advance

Avancer à la phase suivante.

**Response 200:**
```typescript
interface AdvanceResponse {
  previous_phase: string;
  new_phase: string;
  is_final: boolean;
}
```

---

### GET /status

Status global d'intégration.

**Response 200:**
```typescript
interface IntegrationStatus {
  current_phase: string;
  total_technologies: number;
  available: number;
  production_ready: number;
  by_level: Record<string, number>;
  by_category: Record<string, number>;
}
```

---

## 🚀 NOVA API

### Base URL: `/api/v2/nova`

---

### POST /query

Exécuter query via Multi-Lane Pipeline.

**Request:**
```typescript
interface NovaRequest {
  query: string;
  identity_id: string;
  context?: {
    sphere_id?: string;
    task_id?: string;
    metadata?: Record<string, any>;
  };
  options?: {
    require_approval?: boolean;
    max_tokens?: number;
    timeout_ms?: number;
  };
}
```

**Response 200 (Completed):**
```typescript
interface NovaResponse {
  pipeline_id: string;
  status: "completed";
  result: any;
  lanes: {
    lane_a_intent: LaneResult;
    lane_b_context: LaneResult;
    lane_c_encoding: LaneResult;
    lane_d_governance: LaneResult;
    lane_e_checkpoint: LaneResult;
    lane_f_execution: LaneResult;
    lane_g_audit: LaneResult;
  };
  metrics: {
    total_time_ms: number;
    tokens_used: number;
    cost: number;
  };
}

interface LaneResult {
  status: "completed" | "skipped";
  duration_ms: number;
  output: any;
}
```

**Response 423 (Checkpoint Required):** ⚠️ CRITIQUE
```typescript
interface CheckpointResponse {
  pipeline_id: string;
  status: "checkpoint_pending";
  checkpoint: {
    id: string;
    type: "governance" | "cost" | "identity" | "sensitive";
    reason: string;
    requires_approval: boolean;
    options: ["approve", "reject"];
    details?: Record<string, any>;
  };
  partial_result?: any;
}
```

**Response 403 (Identity Violation):**
```typescript
interface IdentityViolationResponse {
  error: "identity_boundary_violation";
  message: string;
  request_identity: string;
  resource_identity: string;
}
```

---

### POST /checkpoint/{checkpoint_id}/approve

Approuver un checkpoint.

**Response 200:**
```typescript
interface ApproveResponse {
  checkpoint_id: string;
  status: "approved";
  pipeline_continued: boolean;
  // If pipeline_continued, result follows in WebSocket
}
```

---

### POST /checkpoint/{checkpoint_id}/reject

Rejeter un checkpoint.

**Request (optional):**
```typescript
interface RejectRequest {
  reason?: string;
}
```

**Response 200:**
```typescript
interface RejectResponse {
  checkpoint_id: string;
  status: "rejected";
  pipeline_stopped: boolean;
  audit_logged: boolean;
}
```

---

### GET /pipeline/{pipeline_id}/status

Status d'un pipeline.

**Response 200:**
```typescript
interface PipelineStatus {
  pipeline_id: string;
  status: "running" | "checkpoint_pending" | "completed" | "failed" | "rejected";
  current_lane: string | null;
  progress_percent: number;
  started_at: string;
  completed_at: string | null;
}
```

---

## 📡 WEBSOCKET EVENTS

### Connection: `ws://host/api/v2/nova/monitoring/ws/{user_id}`

### Event Types

```typescript
interface NovaEvent {
  type: EventType;
  pipeline_id: string;
  data: any;
  timestamp: string;  // ISO8601
}

type EventType = 
  | "pipeline.start"
  | "lane.complete"
  | "checkpoint.pending"  // ⚠️ CRITIQUE
  | "pipeline.complete"
  | "pipeline.failed"
  | "llm.call"
  | "alert.triggered";
```

### Event Details

**pipeline.start:**
```typescript
{
  type: "pipeline.start",
  pipeline_id: "uuid",
  data: {
    query: string;
    lanes: string[];
  },
  timestamp: "..."
}
```

**lane.complete:**
```typescript
{
  type: "lane.complete",
  pipeline_id: "uuid",
  data: {
    lane: "lane_a_intent" | "lane_b_context" | ...;
    duration_ms: number;
    output_preview: any;
  },
  timestamp: "..."
}
```

**checkpoint.pending:** ⚠️
```typescript
{
  type: "checkpoint.pending",
  pipeline_id: "uuid",
  data: {
    checkpoint_id: string;
    type: "governance" | "cost" | "identity" | "sensitive";
    reason: string;
  },
  timestamp: "..."
}
```

**pipeline.complete:**
```typescript
{
  type: "pipeline.complete",
  pipeline_id: "uuid",
  data: {
    result: any;
    total_time_ms: number;
    tokens_used: number;
  },
  timestamp: "..."
}
```

**alert.triggered:**
```typescript
{
  type: "alert.triggered",
  pipeline_id: "uuid",
  data: {
    alert_type: string;
    severity: "info" | "warning" | "error" | "critical";
    message: string;
  },
  timestamp: "..."
}
```

---

## 🔴 ERROR RESPONSES

### Standard Error Format

```typescript
interface ErrorResponse {
  error: string;       // Error code
  message: string;     // Human-readable message
  details?: any;       // Additional context
  timestamp: string;
  request_id: string;
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Identity violation |
| 404 | Not Found | Resource not found |
| 423 | Locked | Checkpoint required ⚠️ |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Error | Server error |

---

## ✅ VALIDATION RULES

### Required Fields

- All POST requests must have `Content-Type: application/json`
- All requests must have `Authorization` header
- `identity_id` must match token subject for protected resources

### Field Constraints

- UUID fields: Valid UUID v4 format
- Timestamps: ISO8601 format
- Enums: Must match exact values
- Arrays: Non-empty where required

---

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    "GOVERNANCE > EXECUTION"                                  ║
║                                                                              ║
║                 API Contracts V71 — LOCKED 🔒                                ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

© 2026 CHE·NU™
