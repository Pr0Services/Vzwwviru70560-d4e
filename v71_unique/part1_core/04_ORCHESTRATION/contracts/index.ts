/**
 * 📜 CHE·NU™ V71 — CONTRATS API CANONIQUES
 * 
 * Ces contrats définissent les endpoints et leurs réponses.
 * Frontend et Backend DOIVENT respecter ces contrats.
 */

import type { 
  SynapticIntent, 
  SynapticFeedback, 
  Checkpoint,
  Artifact,
  ApiResponse,
  HubState,
  Agent,
  Sphere 
} from '../types';

// ============================================================================
// ORCHESTRATOR API
// ============================================================================

export interface OrchestratorAPI {
  /**
   * POST /api/v2/nova/intent
   * Point d'entrée unique pour toutes les intentions
   * 
   * Réponses:
   * - 200: Success, exécution complète
   * - 423: Checkpoint bloquant, UI doit afficher approve/reject
   * - 403: Identity violation
   * - 500: Erreur serveur
   */
  processIntent(intent: SynapticIntent): Promise<ApiResponse<SynapticFeedback>>;
  
  /**
   * POST /api/v2/nova/checkpoint/{id}/resolve
   * Résout un checkpoint (approve/reject)
   */
  resolveCheckpoint(id: string, resolution: {
    action: 'approve' | 'reject';
    comment?: string;
    userId: string;
  }): Promise<ApiResponse<SynapticFeedback>>;
  
  /**
   * GET /api/v2/nova/checkpoint/{id}
   * Récupère les détails d'un checkpoint
   */
  getCheckpoint(id: string): Promise<ApiResponse<Checkpoint>>;
}

// ============================================================================
// LEDGER API
// ============================================================================

export interface LedgerAPI {
  /**
   * GET /api/v2/ledger/artifacts
   * Liste les artifacts (lecture seule)
   */
  queryArtifacts(query: {
    actorId?: string;
    identityId?: string;
    type?: string;
    action?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Artifact[]>>;
  
  /**
   * GET /api/v2/ledger/artifacts/{id}
   * Récupère un artifact par ID
   */
  getArtifact(id: string): Promise<ApiResponse<Artifact>>;
  
  /**
   * GET /api/v2/ledger/artifacts/{id}/chain
   * Récupère la chaîne causale d'un artifact
   */
  getArtifactChain(id: string): Promise<ApiResponse<Artifact[]>>;
}

// ============================================================================
// HUBS API
// ============================================================================

export interface HubsAPI {
  /**
   * GET /api/v2/hubs/state
   * Récupère l'état actuel des 3 hubs
   */
  getHubsState(): Promise<ApiResponse<HubState>>;
  
  /**
   * WS /api/v2/hubs/subscribe
   * S'abonne aux mises à jour en temps réel
   */
  subscribeToUpdates(callback: (state: Partial<HubState>) => void): () => void;
  
  /**
   * POST /api/v2/hubs/navigation/goto
   * Navigue vers une location
   */
  navigateTo(location: {
    sphereId: string;
    threadId?: string;
    path?: string;
  }): Promise<ApiResponse<void>>;
}

// ============================================================================
// AGENTS API
// ============================================================================

export interface AgentsAPI {
  /**
   * GET /api/v2/agents
   * Liste les agents disponibles
   */
  listAgents(filters?: {
    sphereId?: string;
    status?: string;
    type?: string;
  }): Promise<ApiResponse<Agent[]>>;
  
  /**
   * GET /api/v2/agents/{id}
   * Récupère un agent par ID
   */
  getAgent(id: string): Promise<ApiResponse<Agent>>;
  
  /**
   * POST /api/v2/agents/{id}/hire
   * Engage un agent (via synapse)
   */
  hireAgent(id: string, params: {
    sphereId: string;
    tokenBudget: number;
  }): Promise<ApiResponse<SynapticFeedback>>;
}

// ============================================================================
// SPHERES API
// ============================================================================

export interface SpheresAPI {
  /**
   * GET /api/v2/spheres
   * Liste les 9 sphères
   */
  listSpheres(): Promise<ApiResponse<Sphere[]>>;
  
  /**
   * GET /api/v2/spheres/{id}
   * Récupère une sphère par ID
   */
  getSphere(id: string): Promise<ApiResponse<Sphere>>;
  
  /**
   * GET /api/v2/spheres/{id}/threads
   * Liste les threads d'une sphère
   */
  getThreads(sphereId: string, params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Thread[]>>;
}

// ============================================================================
// THREAD TYPE (for Spheres API)
// ============================================================================

export interface Thread {
  id: string;
  title: string;
  sphereId: string;
  status: 'active' | 'archived' | 'draft';
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
}

// ============================================================================
// HTTP STATUS CODES CANONIQUES
// ============================================================================

export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Redirection
  NOT_MODIFIED: 304,
  
  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,           // Identity violation
  NOT_FOUND: 404,
  CONFLICT: 409,
  LOCKED: 423,              // ⚠️ CHECKPOINT BLOQUANT
  TOO_MANY_REQUESTS: 429,
  
  // Server Errors
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503, // Crisis mode
} as const;

// ============================================================================
// VALIDATION SCHEMAS (Zod-compatible)
// ============================================================================

export const VALIDATION_RULES = {
  intent: {
    id: { type: 'string', format: 'uuid' },
    type: { type: 'string', minLength: 1, maxLength: 100 },
    action: { type: 'string', minLength: 1, maxLength: 100 },
    payload: { type: 'object' },
  },
  
  checkpoint: {
    resolution: {
      action: { type: 'string', enum: ['approve', 'reject'] },
      comment: { type: 'string', maxLength: 1000, optional: true },
      userId: { type: 'string', format: 'uuid' },
    },
  },
} as const;
