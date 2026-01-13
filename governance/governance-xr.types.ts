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
// DECISION POINT TYPES (Pending Actions with Aging Alerts)
// =============================================================================

export enum AgingLevel {
  GREEN = 'green',     // 0-24 hours (fresh)
  YELLOW = 'yellow',   // 24h-3 days (attention needed)
  RED = 'red',         // 3-7 days (urgent)
  BLINK = 'blink',     // 7-10 days (critical, animated)
  ARCHIVE = 'archive', // >10 days (auto-archive)
}

export enum DecisionPointType {
  CONFIRMATION = 'confirmation',
  TASK = 'task',
  DECISION = 'decision',
  CHECKPOINT = 'checkpoint',
  APPROVAL = 'approval',
  REVIEW = 'review',
}

export enum UserResponseType {
  VALIDATE = 'validate',
  REDIRECT = 'redirect',
  COMMENT = 'comment',
  DEFER = 'defer',
  REJECT = 'reject',
}

export interface AISuggestion {
  id: string;
  summary: string;
  detailed_explanation: string;
  confidence: number;
  suggested_action: string;
  alternatives: string[];
  rationale: string;
  context_used: string[];
  generated_at: string;
}

export interface UserResponse {
  response_type: UserResponseType;
  comment?: string;
  selected_alternative?: string;
  custom_action?: string;
  responded_by: string;
  responded_at: string;
}

export interface DecisionPoint {
  id: string;
  point_type: DecisionPointType;
  thread_id: string;
  title: string;
  description?: string;
  context?: Record<string, unknown>;
  
  // AI Suggestion
  suggestion?: AISuggestion;
  
  // Aging
  aging_level: AgingLevel;
  created_at: string;
  last_reminded_at?: string;
  reminder_count: number;
  
  // Status
  is_active: boolean;
  is_archived: boolean;
  archived_at?: string;
  archive_reason?: 'timeout' | 'manual' | 'superseded';
  
  // Response
  user_response?: UserResponse;
  
  // Source
  source_event_id?: string;
  source_module?: string;
  checkpoint_id?: string;
  
  // Traceability
  created_by: string;
  sphere_id?: string;
}

// Aging configuration
export const AGING_CONFIG: Record<AgingLevel, {
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  labelFr: string;
  icon: string;
  animate: boolean;
  hoursMin: number;
  hoursMax: number;
}> = {
  [AgingLevel.GREEN]: {
    color: '#059669',
    bgColor: '#D1FAE5',
    borderColor: '#34D399',
    label: 'Fresh',
    labelFr: 'Récent',
    icon: '🟢',
    animate: false,
    hoursMin: 0,
    hoursMax: 24,
  },
  [AgingLevel.YELLOW]: {
    color: '#D97706',
    bgColor: '#FEF3C7',
    borderColor: '#FBBF24',
    label: 'Attention',
    labelFr: 'Attention',
    icon: '🟡',
    animate: false,
    hoursMin: 24,
    hoursMax: 72,
  },
  [AgingLevel.RED]: {
    color: '#DC2626',
    bgColor: '#FEE2E2',
    borderColor: '#F87171',
    label: 'Urgent',
    labelFr: 'Urgent',
    icon: '🔴',
    animate: false,
    hoursMin: 72,
    hoursMax: 168,
  },
  [AgingLevel.BLINK]: {
    color: '#7C2D12',
    bgColor: '#FCA5A5',
    borderColor: '#DC2626',
    label: 'Critical',
    labelFr: 'Critique',
    icon: '🔴',
    animate: true,  // Blink animation
    hoursMin: 168,
    hoursMax: 240,
  },
  [AgingLevel.ARCHIVE]: {
    color: '#6B7280',
    bgColor: '#F3F4F6',
    borderColor: '#9CA3AF',
    label: 'Archived',
    labelFr: 'Archivé',
    icon: '📦',
    animate: false,
    hoursMin: 240,
    hoursMax: Infinity,
  },
};

export const DECISION_TYPE_CONFIG: Record<DecisionPointType, {
  icon: string;
  label: string;
  labelFr: string;
  color: string;
}> = {
  [DecisionPointType.CONFIRMATION]: {
    icon: '✓',
    label: 'Confirmation',
    labelFr: 'Confirmation',
    color: '#3B82F6',
  },
  [DecisionPointType.TASK]: {
    icon: '📋',
    label: 'Task',
    labelFr: 'Tâche',
    color: '#8B5CF6',
  },
  [DecisionPointType.DECISION]: {
    icon: '⚖️',
    label: 'Decision',
    labelFr: 'Décision',
    color: '#F59E0B',
  },
  [DecisionPointType.CHECKPOINT]: {
    icon: '🛑',
    label: 'Checkpoint',
    labelFr: 'Checkpoint',
    color: '#DC2626',
  },
  [DecisionPointType.APPROVAL]: {
    icon: '👍',
    label: 'Approval',
    labelFr: 'Approbation',
    color: '#059669',
  },
  [DecisionPointType.REVIEW]: {
    icon: '👁️',
    label: 'Review',
    labelFr: 'Révision',
    color: '#6366F1',
  },
};

// Utility function to compute aging level from timestamp
export function computeAgingLevel(createdAt: string | Date): AgingLevel {
  const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const now = new Date();
  const hoursElapsed = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  
  if (hoursElapsed <= 24) return AgingLevel.GREEN;
  if (hoursElapsed <= 72) return AgingLevel.YELLOW;
  if (hoursElapsed <= 168) return AgingLevel.RED;
  if (hoursElapsed <= 240) return AgingLevel.BLINK;
  return AgingLevel.ARCHIVE;
}

// Format time remaining/elapsed
export function formatAgingTime(createdAt: string | Date): string {
  const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const now = new Date();
  const hoursElapsed = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  
  if (hoursElapsed < 1) {
    const minutes = Math.floor(hoursElapsed * 60);
    return `${minutes}m`;
  }
  if (hoursElapsed < 24) {
    return `${Math.floor(hoursElapsed)}h`;
  }
  const days = Math.floor(hoursElapsed / 24);
  return `${days}j`;
}

// =============================================================================
// DECISION POINT COMPONENT PROPS
// =============================================================================

export interface DecisionPointCardProps {
  point: DecisionPoint;
  onValidate?: (pointId: string) => void;
  onRedirect?: (pointId: string, alternative: string) => void;
  onComment?: (pointId: string, comment: string) => void;
  onDefer?: (pointId: string) => void;
  onArchive?: (pointId: string) => void;
  compact?: boolean;
  showSuggestion?: boolean;
}

export interface DecisionPointListProps {
  points: DecisionPoint[];
  onValidate?: (pointId: string) => void;
  onRedirect?: (pointId: string, alternative: string) => void;
  onComment?: (pointId: string, comment: string) => void;
  onDefer?: (pointId: string) => void;
  onArchive?: (pointId: string) => void;
  filterByAging?: AgingLevel[];
  filterByType?: DecisionPointType[];
  sortBy?: 'aging' | 'created' | 'type';
  showArchived?: boolean;
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
