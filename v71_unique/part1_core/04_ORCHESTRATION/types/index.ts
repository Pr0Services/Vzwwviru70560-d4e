/**
 * 📋 CHE·NU™ V71 — TYPES CANONIQUES PARTAGÉS
 * 
 * Ces types sont utilisés par TOUS les modules.
 * Ils définissent les contrats entre Frontend ↔ Backend ↔ Core
 */

// ============================================================================
// SYNAPSE TYPES
// ============================================================================

/**
 * Les 5 types de synapses canoniques
 */
export type SynapseType = 
  | 'decisional'     // Checkpoint bloquant - HTTP 423
  | 'informational'  // Lecture seule - HTTP 200
  | 'executive'      // Action après approbation - HTTP 200/202
  | 'educational'    // Feedback sur échec - HTTP 200
  | 'crisis';        // Escalation urgente - HTTP 503

export interface SynapticIntent {
  id: string;
  type: string;
  action: string;
  payload: Record<string, unknown>;
  context: SynapticContext;
  priority: 'low' | 'normal' | 'high' | 'critical';
  timestamp: Date;
}

export interface SynapticContext {
  userId: string;
  identityId: string;
  sphereId: string;
  threadId?: string;
  sessionId: string;
  roles: string[];
  permissions: string[];
}

export interface SynapticFeedback {
  intentId: string;
  status: 'success' | 'denied' | 'checkpoint' | 'error' | 'pending';
  data: unknown;
  reason?: string;
  checkpointId?: string;
  nextActions?: string[];
  synapseType?: SynapseType;
}

// ============================================================================
// ORCHESTRATOR TYPES
// ============================================================================

export interface OrchestratorConfig {
  version: string;
  module: number;
  name: string;
  core: {
    opa: ModuleConfig;
    causal: ModuleConfig;
    worldengine: ModuleConfig;
    ledger: ModuleConfig;
  };
  society: {
    genesis: ModuleConfig;
    agora: ModuleConfig;
    university: ModuleConfig;
  };
  hubs: {
    communication: string;
    navigation: string;
    execution: string;
  };
}

export interface ModuleConfig {
  module: number;
  endpoint: string;
}

export interface RoutingDecision {
  target: string;
  requiresSimulation: boolean;
  priority?: number;
  metadata?: Record<string, unknown>;
}

export interface EscalationContext {
  intentId: string;
  reason: string;
  simulation: unknown;
  options: string[];
  urgency?: 'normal' | 'high' | 'critical';
}

// ============================================================================
// CHECKPOINT TYPES
// ============================================================================

export type CheckpointType = 
  | 'governance'   // Règle métier
  | 'cost'         // Budget dépassé
  | 'identity'     // Violation identité
  | 'sensitive'    // Action sensible
  | 'consensus';   // Nécessite accord

export interface Checkpoint {
  id: string;
  type: CheckpointType;
  intentId: string;
  reason: string;
  options: CheckpointOption[];
  expiresAt?: Date;
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: 'approved' | 'rejected' | 'expired';
}

export interface CheckpointOption {
  id: string;
  label: string;
  action: 'approve' | 'reject' | 'modify' | 'escalate';
  requiresComment?: boolean;
}

// ============================================================================
// ARTIFACT TYPES
// ============================================================================

export interface Artifact {
  id: string;
  type: string;
  action: string;
  actorId: string;
  identityId: string;
  timestamp: Date;
  inputHash: string;
  outputHash: string;
  parentArtifactId?: string;
  childArtifactIds: string[];
  metadata: Record<string, unknown>;
  synapseChain: string[];
}

// ============================================================================
// SPHERE TYPES
// ============================================================================

export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'creative'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'myteam'
  | 'scholar';

export interface Sphere {
  id: SphereId;
  name: string;
  icon: string;
  color: string;
  modules: string[];
  agents: string[];
}

// ============================================================================
// AGENT TYPES
// ============================================================================

export interface Agent {
  id: string;
  name: string;
  type: 'system' | 'user' | 'specialist';
  sphereId: SphereId;
  capabilities: string[];
  tokenBudget: number;
  tokenUsed: number;
  status: 'idle' | 'active' | 'suspended';
}

export interface AgentAction {
  agentId: string;
  action: string;
  input: unknown;
  output?: unknown;
  status: 'pending' | 'running' | 'completed' | 'failed';
  artifactId?: string;
}

// ============================================================================
// HUB TYPES
// ============================================================================

export interface HubState {
  communication: CommunicationHubState;
  navigation: NavigationHubState;
  execution: ExecutionHubState;
}

export interface CommunicationHubState {
  activeChannels: string[];
  unreadCount: number;
  pendingMessages: number;
}

export interface NavigationHubState {
  currentSphere: SphereId;
  currentThread?: string;
  breadcrumb: string[];
  recentLocations: string[];
}

export interface ExecutionHubState {
  availableTools: string[];
  activeAgents: string[];
  pendingActions: number;
  tokenBalance: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: Date;
  duration: number;
  version: string;
}

// ============================================================================
// WEBSOCKET TYPES
// ============================================================================

export interface WSMessage {
  type: WSMessageType;
  payload: unknown;
  timestamp: Date;
  correlationId?: string;
}

export type WSMessageType = 
  | 'intent.created'
  | 'intent.processed'
  | 'checkpoint.pending'
  | 'checkpoint.resolved'
  | 'artifact.created'
  | 'hub.updated'
  | 'agent.status'
  | 'error';
