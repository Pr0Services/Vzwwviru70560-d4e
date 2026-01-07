/**
 * CHE·NU™ Agent Contract — Type Definitions
 * 
 * Agent Contract exists to make agent behavior:
 * - explicit
 * - bounded
 * - accountable
 * - inspectable
 * 
 * Contracts are:
 * - readable by humans
 * - enforceable by the system
 * - visible in Universe View
 * - referenced by logs, decisions, and snapshots
 * 
 * Contracts DO NOT:
 * - optimize agent performance
 * - tune prompts automatically
 * - learn silently
 * 
 * They constrain, not empower.
 * 
 * Position: Mega-Tree → Meta Layer → Agent Contracts
 * 
 * @version 1.0.0
 * @module agent-contract
 */

// ============================================================================
// CONTRACT STATUS
// ============================================================================

/**
 * Contract lifecycle status
 */
export type ContractStatus = 'draft' | 'active' | 'suspended' | 'retired';

/**
 * Violation response types
 */
export type ViolationResponse = 'block' | 'warn' | 'escalate';

/**
 * Logging levels for enforcement
 */
export type LoggingLevel = 'full' | 'partial';

/**
 * Learning approval types
 */
export type LearningApproval = 'always' | 'conditional' | 'never';

// ============================================================================
// ACTION TYPES
// ============================================================================

/**
 * Agent action types that can be permitted or forbidden
 */
export type AgentActionType =
  | 'read_data'
  | 'write_data'
  | 'delete_data'
  | 'execute_task'
  | 'suggest_action'
  | 'make_decision'
  | 'contact_user'
  | 'contact_external'
  | 'modify_thread'
  | 'create_snapshot'
  | 'escalate_issue'
  | 'learn_from_interaction'
  | 'access_cross_sphere'
  | 'invoke_other_agent'
  | 'modify_own_behavior';

/**
 * Decision types an agent might be allowed to make
 */
export type AgentDecisionType =
  | 'prioritization'
  | 'categorization'
  | 'suggestion_generation'
  | 'data_organization'
  | 'scheduling'
  | 'content_filtering'
  | 'anomaly_detection'
  | 'none';

// ============================================================================
// SCOPE DEFINITIONS
// ============================================================================

/**
 * Sphere scope for permissions
 */
export type SphereScope = 
  | 'personal'
  | 'business'
  | 'government'
  | 'design_studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'my_team'
  | 'scholars'
  | '*'; // All spheres (rare, requires explicit approval)

/**
 * Data scope for access control
 */
export type DataScope = 
  | 'user_data'
  | 'thread_data'
  | 'decision_data'
  | 'snapshot_data'
  | 'agent_data'
  | 'system_data'
  | 'external_data';

// ============================================================================
// PERMISSION STRUCTURES
// ============================================================================

/**
 * Condition for an allowed action
 */
export interface ActionCondition {
  type: 'time_window' | 'user_present' | 'approval_required' | 'rate_limit' | 'scope_match';
  parameters: Record<string, any>;
  description: string;
}

/**
 * An allowed action with scope and conditions
 */
export interface AllowedAction {
  action_type: AgentActionType;
  scope: SphereScope[];
  conditions: ActionCondition[];
  description: string;
}

/**
 * A forbidden action with reason
 */
export interface ForbiddenAction {
  action_type: AgentActionType;
  reason: string;
  exception_process?: string; // How to request exception
}

/**
 * Permission set for an agent
 */
export interface Permissions {
  allowed_actions: AllowedAction[];
  forbidden_actions: ForbiddenAction[];
}

// ============================================================================
// DECISION BOUNDARIES
// ============================================================================

/**
 * Decision boundary rules for an agent
 */
export interface DecisionBoundaries {
  may_decide: boolean;
  decision_types_allowed: AgentDecisionType[];
  must_request_human_for: AgentDecisionType[];
  max_decision_impact: 'low' | 'medium' | 'high' | 'none';
  requires_explanation: boolean;
}

// ============================================================================
// DATA ACCESS
// ============================================================================

/**
 * Data access rules for an agent
 */
export interface DataAccess {
  readable_scopes: DataScope[];
  writable_scopes: DataScope[];
  restricted_scopes: DataScope[];
  retention_policy?: string;
}

// ============================================================================
// INTERACTION RULES
// ============================================================================

/**
 * Escalation condition definition
 */
export interface EscalationCondition {
  trigger: string;
  description: string;
  response: 'notify' | 'pause' | 'terminate';
}

/**
 * Interruption condition definition
 */
export interface InterruptionCondition {
  trigger: string;
  description: string;
  action: string;
}

/**
 * Interaction rules for an agent
 */
export interface InteractionRules {
  may_contact_user: boolean;
  contact_frequency_limit?: string; // e.g., "max 3 per hour"
  escalation_conditions: EscalationCondition[];
  interruption_required_on: InterruptionCondition[];
  may_request_clarification: boolean;
  must_explain_actions: boolean;
}

// ============================================================================
// LEARNING CONSTRAINTS
// ============================================================================

/**
 * Learning constraint rules for an agent
 */
export interface LearningConstraints {
  learning_allowed: boolean;
  approval_required: LearningApproval;
  visible_learning_log: boolean;
  learning_scope: string[];
  forbidden_learning: string[];
}

// ============================================================================
// ENFORCEMENT
// ============================================================================

/**
 * Enforcement configuration for a contract
 */
export interface Enforcement {
  violation_response: ViolationResponse;
  logging_level: LoggingLevel;
  audit_frequency: 'realtime' | 'hourly' | 'daily';
  alert_on_violation: boolean;
  auto_suspend_threshold?: number; // Number of violations before auto-suspend
}

// ============================================================================
// PURPOSE DEFINITION
// ============================================================================

/**
 * Purpose section of a contract
 */
export interface ContractPurpose {
  mission_statement: string;
  success_definition: string;
  non_goals: string[];
}

// ============================================================================
// CREATION CONTEXT
// ============================================================================

/**
 * Context for contract creation
 */
export interface ContractCreationContext {
  created_at: string;
  created_by: string;
  creation_reason: string;
  template_used?: string;
  based_on_contract?: string;
}

// ============================================================================
// MAIN CONTRACT INTERFACE
// ============================================================================

/**
 * Main Agent Contract interface
 */
export interface AgentContract {
  id: string;
  agent_id: string;
  agent_role: string;
  agent_name: string;
  owner: string; // Human owner
  version: string;
  status: ContractStatus;
  
  purpose: ContractPurpose;
  permissions: Permissions;
  decision_boundaries: DecisionBoundaries;
  data_access: DataAccess;
  interaction_rules: InteractionRules;
  learning_constraints: LearningConstraints;
  enforcement: Enforcement;
  
  creation_context: ContractCreationContext;
  approval_timestamp?: string;
  approved_by?: string;
  last_modified: string;
  last_modified_by: string;
  
  // Audit
  violation_count: number;
  last_violation?: string;
  last_audit: string;
}

// ============================================================================
// VIOLATION RECORD
// ============================================================================

/**
 * Record of a contract violation
 */
export interface ContractViolation {
  id: string;
  contract_id: string;
  agent_id: string;
  timestamp: string;
  action_attempted: AgentActionType;
  violation_type: 'forbidden_action' | 'scope_exceeded' | 'condition_unmet' | 'decision_unauthorized';
  description: string;
  context: Record<string, any>;
  response_taken: ViolationResponse;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
}

// ============================================================================
// CONTRACT SUMMARY
// ============================================================================

/**
 * Summary view of a contract for lists
 */
export interface ContractSummary {
  id: string;
  agent_id: string;
  agent_name: string;
  agent_role: string;
  owner: string;
  status: ContractStatus;
  version: string;
  mission_statement: string;
  allowed_action_count: number;
  forbidden_action_count: number;
  violation_count: number;
  last_activity: string;
}

// ============================================================================
// UI STATE INTERFACES
// ============================================================================

/**
 * Contract list view state
 */
export interface ContractListState {
  contracts: ContractSummary[];
  filter_status?: ContractStatus;
  filter_agent?: string;
  search_query: string;
  sort_by: 'name' | 'status' | 'violations' | 'last_modified';
  sort_order: 'asc' | 'desc';
  is_loading: boolean;
  error: string | null;
}

/**
 * Contract view/edit state
 */
export interface ContractViewState {
  contract: AgentContract | null;
  is_editing: boolean;
  edit_section?: keyof AgentContract;
  pending_changes: Partial<AgentContract>;
  is_loading: boolean;
  is_saving: boolean;
  error: string | null;
}

/**
 * Contract creation form
 */
export interface ContractCreationForm {
  agent_id: string;
  agent_role: string;
  agent_name: string;
  mission_statement: string;
  success_definition: string;
  non_goals: string[];
  creation_reason: string;
  template_id?: string;
}

// ============================================================================
// CONTRACT TEMPLATE
// ============================================================================

/**
 * Contract template for quick creation
 */
export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  agent_archetype: string;
  default_permissions: Permissions;
  default_decision_boundaries: DecisionBoundaries;
  default_data_access: DataAccess;
  default_interaction_rules: InteractionRules;
  default_learning_constraints: LearningConstraints;
  default_enforcement: Enforcement;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const CONTRACT_STATUS_META: Record<ContractStatus, { label: string; color: string; icon: string }> = {
  draft: { label: 'Draft', color: '#7F8C8D', icon: '📝' },
  active: { label: 'Active', color: '#27AE60', icon: '✅' },
  suspended: { label: 'Suspended', color: '#E67E22', icon: '⏸️' },
  retired: { label: 'Retired', color: '#95A5A6', icon: '📦' },
};

export const ACTION_TYPE_META: Record<AgentActionType, { label: string; description: string; risk: 'low' | 'medium' | 'high' }> = {
  read_data: { label: 'Read Data', description: 'Read user or system data', risk: 'low' },
  write_data: { label: 'Write Data', description: 'Create or modify data', risk: 'medium' },
  delete_data: { label: 'Delete Data', description: 'Remove data permanently', risk: 'high' },
  execute_task: { label: 'Execute Task', description: 'Perform automated task', risk: 'medium' },
  suggest_action: { label: 'Suggest Action', description: 'Propose actions to user', risk: 'low' },
  make_decision: { label: 'Make Decision', description: 'Autonomously decide', risk: 'high' },
  contact_user: { label: 'Contact User', description: 'Send notifications/messages', risk: 'low' },
  contact_external: { label: 'Contact External', description: 'Communicate outside CHE·NU', risk: 'high' },
  modify_thread: { label: 'Modify Thread', description: 'Change knowledge threads', risk: 'medium' },
  create_snapshot: { label: 'Create Snapshot', description: 'Capture context snapshots', risk: 'low' },
  escalate_issue: { label: 'Escalate Issue', description: 'Flag issues for human review', risk: 'low' },
  learn_from_interaction: { label: 'Learn', description: 'Adapt based on interactions', risk: 'medium' },
  access_cross_sphere: { label: 'Cross-Sphere Access', description: 'Access data across spheres', risk: 'high' },
  invoke_other_agent: { label: 'Invoke Agent', description: 'Trigger other agents', risk: 'high' },
  modify_own_behavior: { label: 'Self-Modify', description: 'Change own behavior', risk: 'high' },
};

export const DECISION_TYPE_META: Record<AgentDecisionType, { label: string; description: string }> = {
  prioritization: { label: 'Prioritization', description: 'Order items by importance' },
  categorization: { label: 'Categorization', description: 'Classify items into groups' },
  suggestion_generation: { label: 'Suggestion Generation', description: 'Create recommendations' },
  data_organization: { label: 'Data Organization', description: 'Structure data automatically' },
  scheduling: { label: 'Scheduling', description: 'Arrange timing of tasks' },
  content_filtering: { label: 'Content Filtering', description: 'Filter/hide content' },
  anomaly_detection: { label: 'Anomaly Detection', description: 'Identify unusual patterns' },
  none: { label: 'None', description: 'No autonomous decisions allowed' },
};

export const VIOLATION_RESPONSE_META: Record<ViolationResponse, { label: string; description: string; severity: number }> = {
  warn: { label: 'Warn', description: 'Log and notify, allow action', severity: 1 },
  block: { label: 'Block', description: 'Prevent action, log violation', severity: 2 },
  escalate: { label: 'Escalate', description: 'Block, notify human immediately', severity: 3 },
};

export const DEFAULT_CONTRACT_FORM: ContractCreationForm = {
  agent_id: '',
  agent_role: '',
  agent_name: '',
  mission_statement: '',
  success_definition: '',
  non_goals: [],
  creation_reason: '',
};

export const DEFAULT_PERMISSIONS: Permissions = {
  allowed_actions: [
    {
      action_type: 'read_data',
      scope: ['personal'],
      conditions: [],
      description: 'Basic data reading within personal sphere',
    },
    {
      action_type: 'suggest_action',
      scope: ['*'],
      conditions: [],
      description: 'Can suggest actions to user',
    },
  ],
  forbidden_actions: [
    {
      action_type: 'delete_data',
      reason: 'Data deletion requires explicit human action',
    },
    {
      action_type: 'contact_external',
      reason: 'External communication is not permitted',
    },
    {
      action_type: 'modify_own_behavior',
      reason: 'Self-modification is forbidden',
    },
  ],
};

export const DEFAULT_DECISION_BOUNDARIES: DecisionBoundaries = {
  may_decide: false,
  decision_types_allowed: [],
  must_request_human_for: ['prioritization', 'categorization', 'scheduling'],
  max_decision_impact: 'none',
  requires_explanation: true,
};

export const DEFAULT_DATA_ACCESS: DataAccess = {
  readable_scopes: ['user_data'],
  writable_scopes: [],
  restricted_scopes: ['system_data', 'agent_data'],
};

export const DEFAULT_INTERACTION_RULES: InteractionRules = {
  may_contact_user: false,
  escalation_conditions: [],
  interruption_required_on: [],
  may_request_clarification: true,
  must_explain_actions: true,
};

export const DEFAULT_LEARNING_CONSTRAINTS: LearningConstraints = {
  learning_allowed: false,
  approval_required: 'always',
  visible_learning_log: true,
  learning_scope: [],
  forbidden_learning: ['user_preferences', 'private_data'],
};

export const DEFAULT_ENFORCEMENT: Enforcement = {
  violation_response: 'block',
  logging_level: 'full',
  audit_frequency: 'realtime',
  alert_on_violation: true,
  auto_suspend_threshold: 5,
};

// ============================================================================
// DESIGN COLORS
// ============================================================================

export const CONTRACT_COLORS = {
  // Background
  obsidianBlack: '#0A0A0B',
  nightSlate: '#1E1F22',
  
  // Primary
  sacredGold: '#D4AF37',
  templeWhite: '#FAF9F6',
  
  // Status colors
  active: '#27AE60',
  suspended: '#E67E22',
  retired: '#95A5A6',
  draft: '#7F8C8D',
  
  // Risk colors
  lowRisk: '#27AE60',
  mediumRisk: '#F39C12',
  highRisk: '#E74C3C',
  
  // UI
  border: 'rgba(212, 175, 55, 0.2)',
  cardBg: 'rgba(30, 31, 34, 0.8)',
  dimmed: 'rgba(250, 249, 246, 0.5)',
};
