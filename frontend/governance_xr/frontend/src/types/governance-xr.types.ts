/**
 * CHE·NU™ Governance & XR Types
 * 
 * TypeScript definitions for:
 * - Governance system (signals, decisions, backlog)
 * - XR renderer (blueprints, zones, items)
 * - Thread maturity system
 * - Thread lobby
 * 
 * R&D Compliance:
 * - Rule #6: All types include traceability fields
 * - Rule #7: Aligned with backend schemas
 */

// =============================================================================
// ENUMS
// =============================================================================

export enum GovernanceSignalLevel {
  WARN = 'WARN',
  CORRECT = 'CORRECT',
  PAUSE = 'PAUSE',
  BLOCK = 'BLOCK',
  ESCALATE = 'ESCALATE',
}

export enum GovernanceCriterion {
  SCHEMA = 'SCHEMA',
  CANON = 'CANON',
  SECURITY = 'SECURITY',
  COHERENCE = 'COHERENCE',
  STYLE = 'STYLE',
  BUDGET = 'BUDGET',
  LEGAL = 'LEGAL',
}

export enum OrchestratorDecision {
  PROCEED = 'PROCEED',
  BLOCK = 'BLOCK',
  CORRECT = 'CORRECT',
  ESCALATE = 'ESCALATE',
  ASK_HUMAN = 'ASK_HUMAN',
}

export enum BacklogType {
  ERROR = 'error',
  SIGNAL = 'signal',
  DECISION = 'decision',
  COST = 'cost',
  GOVERNANCE_DEBT = 'governance_debt',
}

export enum BacklogSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum BacklogStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  WONT_FIX = 'wont_fix',
  DUPLICATE = 'duplicate',
}

export enum MaturityLevel {
  SEED = 0,
  SPROUT = 1,
  WORKSHOP = 2,
  STUDIO = 3,
  ORG = 4,
  ECOSYSTEM = 5,
}

export enum ZoneType {
  INTENT_WALL = 'intent_wall',
  DECISION_WALL = 'decision_wall',
  ACTION_TABLE = 'action_table',
  MEMORY_KIOSK = 'memory_kiosk',
  TIMELINE_STRIP = 'timeline_strip',
  RESOURCE_SHELF = 'resource_shelf',
  PORTAL_AREA = 'portal_area',
}

export enum ItemKind {
  INTENT = 'intent',
  DECISION = 'decision',
  ACTION = 'action',
  MEMORY = 'memory',
  RESOURCE = 'resource',
  TIMELINE_EVENT = 'timeline_event',
  NOTE = 'note',
}

export enum ThreadEntryMode {
  CHAT = 'chat',
  LIVE = 'live',
  XR = 'xr',
}

export enum ViewerRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

export enum XRTemplate {
  PERSONAL_ROOM = 'personal_room',
  BUSINESS_ROOM = 'business_room',
  CAUSE_ROOM = 'cause_room',
  LAB_ROOM = 'lab_room',
  CUSTOM_ROOM = 'custom_room',
}

export enum ActionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum RedactionLevel {
  FULL = 'full',
  PARTIAL = 'partial',
  TITLES_ONLY = 'titles_only',
  NONE = 'none',
}

// =============================================================================
// GOVERNANCE TYPES
// =============================================================================

export interface GovernanceSignal {
  id: string;
  cea_name: string;
  criterion: GovernanceCriterion;
  level: GovernanceSignalLevel;
  message: string;
  details?: Record<string, unknown>;
  patch_target?: string;
  patch_instruction?: PatchInstruction;
  created_at: string;
}

export interface PatchInstruction {
  action: 'replace' | 'append' | 'remove' | 'insert';
  target_path: string;
  new_value?: unknown;
  reason: string;
}

export interface OrchestratorDecisionResult {
  id: string;
  thread_id: string;
  decision: OrchestratorDecision;
  reason: string;
  
  // QCT results
  qct?: {
    required_quality: number;
    expected_error_rate: number;
    selected_config: string;
    estimated_cost: number;
  };
  
  // SES results
  ses?: {
    segment_scores: Record<string, number>;
    escalation_triggered: boolean;
  };
  
  // RDC results
  rdc?: {
    intervention: GovernanceSignalLevel;
    signal_count: number;
  };
  
  // Checkpoint info (if BLOCK or ASK_HUMAN)
  checkpoint_id?: string;
  
  created_at: string;
}

export interface BacklogItem {
  id: string;
  thread_id: string;
  backlog_type: BacklogType;
  severity: BacklogSeverity;
  status: BacklogStatus;
  title: string;
  description?: string;
  context?: Record<string, unknown>;
  source_spec?: string;
  resolution?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  created_by: string;
}

export interface PolicyTuningProposal {
  id: string;
  parameter_name: string;
  old_value: number;
  new_value: number;
  change_magnitude: number;
  reason: string;
  requires_approval: boolean;
  approved?: boolean;
  created_at: string;
}

// =============================================================================
// MATURITY TYPES
// =============================================================================

export interface MaturitySignals {
  summary_count: number;
  decision_count: number;
  action_count: number;
  action_completed_count: number;
  participant_count: number;
  live_session_count: number;
  link_count: number;
  message_count: number;
  learning_event_count: number;
  age_days: number;
  portal_count: number;
}

export interface MaturityResult {
  thread_id: string;
  score: number;
  level: MaturityLevel;
  level_name: string;
  signals: MaturitySignals;
  computed_at: string;
}

export const MATURITY_LEVEL_NAMES: Record<MaturityLevel, string> = {
  [MaturityLevel.SEED]: 'Seed',
  [MaturityLevel.SPROUT]: 'Sprout',
  [MaturityLevel.WORKSHOP]: 'Workshop',
  [MaturityLevel.STUDIO]: 'Studio',
  [MaturityLevel.ORG]: 'Org',
  [MaturityLevel.ECOSYSTEM]: 'Ecosystem',
};

export const MATURITY_LEVEL_COLORS: Record<MaturityLevel, string> = {
  [MaturityLevel.SEED]: '#9CA3AF',       // gray-400
  [MaturityLevel.SPROUT]: '#34D399',     // green-400
  [MaturityLevel.WORKSHOP]: '#60A5FA',   // blue-400
  [MaturityLevel.STUDIO]: '#A78BFA',     // purple-400
  [MaturityLevel.ORG]: '#F59E0B',        // amber-500
  [MaturityLevel.ECOSYSTEM]: '#EF4444',  // red-500
};

export const MATURITY_LEVEL_ICONS: Record<MaturityLevel, string> = {
  [MaturityLevel.SEED]: '🌱',
  [MaturityLevel.SPROUT]: '🌿',
  [MaturityLevel.WORKSHOP]: '🔧',
  [MaturityLevel.STUDIO]: '🎨',
  [MaturityLevel.ORG]: '🏢',
  [MaturityLevel.ECOSYSTEM]: '🌐',
};

// =============================================================================
// XR TYPES
// =============================================================================

export interface BlueprintItem {
  id: string;
  kind: ItemKind;
  title: string;
  preview?: string;
  status?: ActionStatus;
  assignee?: string;
  due_date?: string;
  source_event_id: string;
  position: { x: number; y: number; z: number };
  interaction_enabled: boolean;
  redacted: boolean;
}

export interface BlueprintZone {
  zone_type: ZoneType;
  label: string;
  position: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  items: BlueprintItem[];
  visible: boolean;
  interactive: boolean;
}

export interface ThreadPortal {
  target_thread_id: string;
  target_thread_title: string;
  link_type: 'parent' | 'child' | 'reference' | 'related';
  position: { x: number; y: number; z: number };
  preview_available: boolean;
}

export interface XRBlueprint {
  thread_id: string;
  template: XRTemplate;
  maturity_level: MaturityLevel;
  zones: BlueprintZone[];
  portals: ThreadPortal[];
  ambient: {
    lighting: string;
    skybox: string;
    audio?: string;
  };
  generated_at: string;
  viewer_role: ViewerRole;
  redaction_level: RedactionLevel;
}

export interface XRPreflightData {
  thread_id: string;
  xr_available: boolean;
  zones_visible: ZoneType[];
  features_enabled: string[];
  estimated_load_time_ms: number;
  device_requirements: string[];
  privacy_note: string;
  proceed_enabled: boolean;
}

// =============================================================================
// THREAD LOBBY TYPES
// =============================================================================

export interface ThreadLobbyData {
  thread_id: string;
  thread_title: string;
  thread_type: 'personal' | 'collective' | 'institutional';
  sphere_id: string;
  sphere_name: string;
  
  // Maturity
  maturity: MaturityResult;
  
  // Summary
  summary?: string;
  last_activity?: string;
  
  // Live status
  live_active: boolean;
  live_participant_count?: number;
  
  // Mode recommendations
  recommended_mode: ThreadEntryMode;
  available_modes: ThreadEntryMode[];
  
  // Microcopy
  welcome_message: string;
  mode_descriptions: Record<ThreadEntryMode, string>;
}

export interface ThreadLobbyProps {
  threadId: string;
  onEnterMode: (mode: ThreadEntryMode) => void;
  onBack: () => void;
}

// =============================================================================
// XR INTERACTION EVENT TYPES
// =============================================================================

export interface XRActionUpdatePayload {
  action_id: string;
  new_status: ActionStatus;
  completion_note?: string;
}

export interface XRActionCreatePayload {
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  parent_decision_id?: string;
}

export interface XRNotePayload {
  content: string;
  zone_context?: ZoneType;
  item_context_id?: string;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface CheckpointResponse {
  status: 'checkpoint_pending';
  checkpoint: {
    id: string;
    type: string;
    reason: string;
    requires_approval: boolean;
    options: string[];
  };
}

// =============================================================================
// GOVERNANCE DASHBOARD TYPES
// =============================================================================

export interface GovernanceDashboardData {
  thread_id: string;
  
  // Recent signals
  recent_signals: GovernanceSignal[];
  signal_counts_by_level: Record<GovernanceSignalLevel, number>;
  
  // Recent decisions
  recent_decisions: OrchestratorDecisionResult[];
  decision_counts: Record<OrchestratorDecision, number>;
  
  // Backlog
  open_backlog_count: number;
  backlog_by_type: Record<BacklogType, number>;
  backlog_by_severity: Record<BacklogSeverity, number>;
  
  // Metrics
  metrics: {
    escape_rate: number;
    fix_cost_median: number;
    noise_rate: number;
  };
  
  // Policy tuning
  pending_policy_changes: PolicyTuningProposal[];
}

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

export interface MaturityBadgeProps {
  maturity: MaturityResult;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  showSignals?: boolean;
}

export interface GovernanceSignalCardProps {
  signal: GovernanceSignal;
  onAcknowledge?: (signalId: string) => void;
}

export interface BacklogItemCardProps {
  item: BacklogItem;
  onResolve?: (itemId: string, resolution: string) => void;
  onEscalate?: (itemId: string) => void;
}

export interface XRZoneProps {
  zone: BlueprintZone;
  onItemClick?: (item: BlueprintItem) => void;
  onItemAction?: (item: BlueprintItem, action: string) => void;
}

export interface XRPortalProps {
  portal: ThreadPortal;
  onEnter?: (targetThreadId: string) => void;
}

export interface PreflightModalProps {
  preflight: XRPreflightData;
  onProceed: () => void;
  onCancel: () => void;
}
