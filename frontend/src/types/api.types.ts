/**
 * ============================================================================
 * CHE·NU™ V70 — API TYPES
 * ============================================================================
 * TypeScript types matching Backend V69 Pydantic models
 * Principle: GOUVERNANCE > EXÉCUTION
 * ============================================================================
 */

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
  tenant_id?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token?: string;
}

export interface UserInfo {
  user_id: string;
  email: string;
  name: string;
  tenant_id?: string;
  roles: string[];
}

// ============================================================================
// SIMULATION TYPES
// ============================================================================

export interface CreateSimulationRequest {
  name: string;
  description?: string;
  t_end?: number;
  tags?: string[];
}

export interface SimulationResponse {
  simulation_id: string;
  name: string;
  description: string;
  status: SimulationStatus;
  t_end: number;
  scenarios_count: number;
  created_at: string;
  tags: string[];
}

export type SimulationStatus = 
  | 'draft' 
  | 'ready' 
  | 'running' 
  | 'paused' 
  | 'completed' 
  | 'failed';

export interface RunSimulationRequest {
  scenario_ids?: string[];
  sign_artifacts?: boolean;
}

export interface SimulationResultResponse {
  simulation_id: string;
  scenario_id: string;
  artifact_id: string;
  total_ticks: number;
  chain_valid: boolean;
  signed: boolean;
}

// ============================================================================
// SCENARIO TYPES
// ============================================================================

export interface CreateScenarioRequest {
  simulation_id: string;
  name: string;
  description?: string;
  initial_state?: Record<string, unknown>;
  interventions?: Intervention[];
}

export interface Intervention {
  tick: number;
  node_id: string;
  value: unknown;
  type: 'set' | 'increment' | 'multiply';
}

export interface ScenarioResponse {
  scenario_id: string;
  simulation_id: string;
  name: string;
  description: string;
  initial_state: Record<string, unknown>;
  interventions: Intervention[];
  status: string;
  created_at: string;
}

export interface CompareScenarioRequest {
  scenario_ids: string[];
  metrics: string[];
}

export interface ComparisonResponse {
  comparison_id: string;
  scenario_ids: string[];
  metrics: Record<string, MetricComparison>;
  created_at: string;
}

export interface MetricComparison {
  values: Record<string, number>;
  winner?: string;
  difference: number;
}

// ============================================================================
// AGENT TYPES
// ============================================================================

export interface CreateAgentRequest {
  name: string;
  type: AgentType;
  level: AgentLevel;
  capabilities: string[];
  config?: Record<string, unknown>;
}

export type AgentType = 
  | 'analyst' 
  | 'executor' 
  | 'validator' 
  | 'orchestrator';

export type AgentLevel = 1 | 2 | 3;

export interface AgentResponse {
  agent_id: string;
  name: string;
  type: AgentType;
  level: AgentLevel;
  status: AgentStatus;
  capabilities: string[];
  parent_id?: string;
  children_ids: string[];
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type AgentStatus = 
  | 'idle' 
  | 'active' 
  | 'paused' 
  | 'terminated';

export interface AgentActionRequest {
  action_type: string;
  parameters: Record<string, unknown>;
  requires_checkpoint?: boolean;
}

export interface AgentActionResponse {
  action_id: string;
  agent_id: string;
  action_type: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed';
  checkpoint_id?: string;
  result?: unknown;
  created_at: string;
}

export interface AgentHierarchy {
  root_agents: AgentResponse[];
  total_count: number;
  by_level: Record<number, number>;
}

// ============================================================================
// CHECKPOINT TYPES (GOVERNANCE)
// ============================================================================

export interface CheckpointResponse {
  checkpoint_id: string;
  type: CheckpointType;
  category: CheckpointCategory;
  status: CheckpointStatus;
  description: string;
  context: CheckpointContext;
  resolution?: CheckpointResolution;
  created_at: string;
  resolved_at?: string;
  timeout_at?: string;
}

export type CheckpointType = 
  | 'governance' 
  | 'cost' 
  | 'identity' 
  | 'sensitive' 
  | 'hitl';

export type CheckpointCategory = 'A' | 'B' | 'C';

export type CheckpointStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'timeout' 
  | 'escalated';

export interface CheckpointContext {
  agent_id: string;
  action_id: string;
  simulation_id?: string;
  data: Record<string, unknown>;
  risk_score: number;
}

export interface ResolveCheckpointRequest {
  resolution: 'approve' | 'reject' | 'escalate';
  reason?: string;
  resolved_by: string;
}

export interface CheckpointResolution {
  decision: 'approve' | 'reject' | 'escalate';
  reason?: string;
  resolved_by: string;
  resolved_at: string;
}

// ============================================================================
// XR PACK TYPES
// ============================================================================

export interface GenerateXRPackRequest {
  simulation_id: string;
  scenario_id: string;
  visualization_type: XRVisualizationType;
  options?: XRPackOptions;
}

export type XRVisualizationType = 
  | 'timeline' 
  | 'causal_graph' 
  | 'state_evolution' 
  | 'comparison';

export interface XRPackOptions {
  resolution?: 'low' | 'medium' | 'high';
  include_audio?: boolean;
  include_haptics?: boolean;
  chunk_size?: number;
}

export interface XRPackResponse {
  pack_id: string;
  simulation_id: string;
  scenario_id: string;
  visualization_type: XRVisualizationType;
  status: XRPackStatus;
  manifest_url: string;
  total_chunks: number;
  file_size_bytes: number;
  created_at: string;
  read_only: boolean; // CANON: XR = READ ONLY
}

export type XRPackStatus = 
  | 'generating' 
  | 'ready' 
  | 'failed' 
  | 'expired';

export interface XRManifest {
  pack_id: string;
  version: string;
  chunks: XRChunk[];
  metadata: XRMetadata;
  read_only: boolean;
}

export interface XRChunk {
  chunk_id: string;
  sequence: number;
  size_bytes: number;
  checksum: string;
  content_type: string;
}

export interface XRMetadata {
  duration_seconds: number;
  keyframes: number;
  resolution: string;
  created_at: string;
}

// ============================================================================
// CAUSAL ENGINE TYPES
// ============================================================================

export interface CreateDAGRequest {
  name: string;
  description?: string;
  simulation_id?: string;
}

export interface DAGResponse {
  dag_id: string;
  name: string;
  description: string;
  simulation_id?: string;
  nodes: CausalNode[];
  edges: CausalEdge[];
  status: string;
  created_at: string;
  validated: boolean;
  validation_errors?: string[];
}

export interface CausalNode {
  node_id: string;
  name: string;
  type: 'variable' | 'intervention' | 'outcome';
  value?: unknown;
  distribution?: string;
  metadata?: Record<string, unknown>;
}

export interface CausalEdge {
  edge_id: string;
  source_id: string;
  target_id: string;
  weight?: number;
  relationship: 'causal' | 'confounding' | 'mediating';
}

export interface AddNodeRequest {
  name: string;
  type: 'variable' | 'intervention' | 'outcome';
  value?: unknown;
  distribution?: string;
}

export interface AddEdgeRequest {
  source_id: string;
  target_id: string;
  weight?: number;
  relationship: 'causal' | 'confounding' | 'mediating';
}

export interface CausalInferenceRequest {
  dag_id: string;
  query: CausalQuery;
  method: InferenceMethod;
}

export interface CausalQuery {
  outcome_node: string;
  intervention_node?: string;
  intervention_value?: unknown;
  conditioning_nodes?: string[];
}

export type InferenceMethod = 
  | 'do_calculus' 
  | 'backdoor' 
  | 'frontdoor' 
  | 'iv';

export interface CausalInferenceResponse {
  inference_id: string;
  dag_id: string;
  query: CausalQuery;
  result: {
    estimate: number;
    confidence_interval: [number, number];
    p_value?: number;
  };
  method_used: InferenceMethod;
  assumptions: string[];
  created_at: string;
}

// ============================================================================
// AUDIT TYPES
// ============================================================================

export interface AuditEventResponse {
  event_id: string;
  event_type: AuditEventType;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string;
  actor_type: 'user' | 'agent' | 'system';
  timestamp: string;
  data: Record<string, unknown>;
  signature?: string;
  merkle_proof?: MerkleProof;
}

export type AuditEventType = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'execute' 
  | 'approve' 
  | 'reject';

export interface MerkleProof {
  root: string;
  path: string[];
  leaf_index: number;
}

export interface AuditReportResponse {
  report_id: string;
  simulation_id: string;
  events_count: number;
  chain_valid: boolean;
  merkle_root: string;
  time_range: {
    start: string;
    end: string;
  };
  summary: {
    creates: number;
    updates: number;
    deletes: number;
    executions: number;
    approvals: number;
    rejections: number;
  };
  artifacts: AuditArtifact[];
}

export interface AuditArtifact {
  artifact_id: string;
  type: string;
  signature: string;
  signed_at: string;
  signed_by: string;
}

export interface VerifyAuditRequest {
  event_id?: string;
  artifact_id?: string;
  signature?: string;
}

export interface VerifyAuditResponse {
  valid: boolean;
  verification_type: 'event' | 'artifact' | 'signature';
  details: Record<string, unknown>;
  verified_at: string;
}

// ============================================================================
// WEBSOCKET TYPES
// ============================================================================

export type WSMessageType = 
  | 'simulation.started'
  | 'simulation.tick'
  | 'simulation.completed'
  | 'simulation.error'
  | 'checkpoint.pending'
  | 'checkpoint.resolved'
  | 'agent.action'
  | 'xr.chunk_ready';

export interface WSMessage<T = unknown> {
  type: WSMessageType;
  payload: T;
  timestamp: string;
  sequence: number;
}

export interface SimulationTickPayload {
  simulation_id: string;
  scenario_id: string;
  tick: number;
  total_ticks: number;
  state: Record<string, unknown>;
}

export interface CheckpointPendingPayload {
  checkpoint_id: string;
  type: CheckpointType;
  category: CheckpointCategory;
  description: string;
  timeout_at: string;
}

// ============================================================================
// HEALTH TYPES
// ============================================================================

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  environment: string;
  uptime_seconds: number;
  components: Record<string, 'healthy' | 'degraded' | 'unhealthy'>;
}

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  status?: string;
  type?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// ============================================================================
// SPHERE TYPES (CANON)
// ============================================================================

export type SphereCode = 
  | 'PERSONAL'
  | 'BUSINESS'
  | 'GOVERNMENT'
  | 'STUDIO'
  | 'COMMUNITY'
  | 'SOCIAL'
  | 'ENTERTAINMENT'
  | 'TEAM'
  | 'SCHOLAR';

export type BureauSection = 
  | 'QuickCapture'
  | 'ResumeWorkspace'
  | 'Threads'
  | 'DataFiles'
  | 'ActiveAgents'
  | 'Meetings';

export interface SphereConfig {
  code: SphereCode;
  name: string;
  icon: string;
  color: string;
  sections: BureauSection[];
}

export const SPHERE_CONFIGS: Record<SphereCode, SphereConfig> = {
  PERSONAL: { code: 'PERSONAL', name: 'Personal', icon: '🏠', color: '#3B82F6', sections: ['QuickCapture', 'ResumeWorkspace', 'Threads', 'DataFiles', 'ActiveAgents', 'Meetings'] },
  BUSINESS: { code: 'BUSINESS', name: 'Business', icon: '💼', color: '#10B981', sections: ['QuickCapture', 'ResumeWorkspace', 'Threads', 'DataFiles', 'ActiveAgents', 'Meetings'] },
  GOVERNMENT: { code: 'GOVERNMENT', name: 'Government', icon: '🏛️', color: '#8B5CF6', sections: ['QuickCapture', 'ResumeWorkspace', 'Threads', 'DataFiles', 'ActiveAgents', 'Meetings'] },
  STUDIO: { code: 'STUDIO', name: 'Studio', icon: '🎨', color: '#F59E0B', sections: ['QuickCapture', 'ResumeWorkspace', 'Threads', 'DataFiles', 'ActiveAgents', 'Meetings'] },
  COMMUNITY: { code: 'COMMUNITY', name: 'Community', icon: '👥', color: '#EC4899', sections: ['QuickCapture', 'ResumeWorkspace', 'Threads', 'DataFiles', 'ActiveAgents', 'Meetings'] },
  SOCIAL: { code: 'SOCIAL', name: 'Social & Media', icon: '📱', color: '#06B6D4', sections: ['QuickCapture', 'ResumeWorkspace', 'Threads', 'DataFiles', 'ActiveAgents', 'Meetings'] },
  ENTERTAINMENT: { code: 'ENTERTAINMENT', name: 'Entertainment', icon: '🎬', color: '#EF4444', sections: ['QuickCapture', 'ResumeWorkspace', 'Threads', 'DataFiles', 'ActiveAgents', 'Meetings'] },
  TEAM: { code: 'TEAM', name: 'My Team', icon: '🤝', color: '#14B8A6', sections: ['QuickCapture', 'ResumeWorkspace', 'Threads', 'DataFiles', 'ActiveAgents', 'Meetings'] },
  SCHOLAR: { code: 'SCHOLAR', name: 'Scholar', icon: '📚', color: '#6366F1', sections: ['QuickCapture', 'ResumeWorkspace', 'Threads', 'DataFiles', 'ActiveAgents', 'Meetings'] },
};
