/**
 * CHE·NU™ XR DECISION ROOM — TYPE DEFINITIONS
 * 
 * XR Decision Room exists to support conscious, accountable
 * decision-making in complex contexts.
 * 
 * It is NOT a debate arena.
 * It is NOT a persuasion space.
 * It is NOT a productivity accelerator.
 * 
 * Decisions are not rushed here. They are crystallized.
 * 
 * @version 1.0
 * @status V51-ready
 * @constraint ADDITIVE ONLY (NO REFACTOR)
 */

import type { Vector3, Rotation3, BoundingVolume } from '../xr-meta-room/xr-meta-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION ROOM CORE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Room entry conditions
 * Entry is always explicit
 */
export type DecisionRoomEntryReason =
  | 'creating_new'              // Creating a new decision
  | 'reviewing_existing'        // Reviewing an existing decision
  | 'resolving_drift'           // Resolving decision drift
  | 'before_irreversible';      // Before committing to irreversible action

/**
 * Room configuration
 */
export interface DecisionRoomConfig {
  // Visual
  symmetry_enforced: boolean;   // Always true - no visual bias
  neutral_colors: boolean;      // Always true - no emotional manipulation
  option_equidistance: boolean; // Always true - paths are equal
  
  // Behavior
  allow_weighting: boolean;     // User can explicitly weight
  show_consequences: boolean;   // Show downstream impacts
  show_meaning: boolean;        // Show alignment cues
  show_load: boolean;           // Show cognitive load
  
  // Safety
  require_rationale: boolean;   // Must provide reason to crystallize
  require_reversibility: boolean; // Must declare if reversible
  log_session: boolean;         // Log XR session
}

/**
 * Default room configuration
 */
export const DEFAULT_DECISION_ROOM_CONFIG: DecisionRoomConfig = {
  symmetry_enforced: true,
  neutral_colors: true,
  option_equidistance: true,
  allow_weighting: true,
  show_consequences: true,
  show_meaning: true,
  show_load: true,
  require_rationale: true,
  require_reversibility: true,
  log_session: false,  // Opt-in
};

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION CORE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Decision being examined
 */
export interface XRDecisionCore {
  id: string;
  title: string;
  question: string;           // The question being decided
  description?: string;
  
  // Context
  context_summary: string;
  linked_snapshot_id?: string;
  linked_thread_ids: string[];
  
  // State
  state: DecisionState;
  created_at: string;
  created_by: string;
  
  // Crystallization
  crystallized_at?: string;
  crystallized_by?: string;
  selected_option_id?: string;
  rationale?: string;
  reversibility?: DecisionReversibility;
}

/**
 * Decision state
 */
export type DecisionState =
  | 'exploring'      // Examining options
  | 'evaluating'     // Applying criteria
  | 'deliberating'   // Final consideration
  | 'crystallized'   // Decision made
  | 'reconsidering'; // Re-examining

/**
 * Decision reversibility
 */
export type DecisionReversibility =
  | 'fully_reversible'     // Can undo completely
  | 'partially_reversible' // Some aspects can be undone
  | 'irreversible'         // Cannot undo
  | 'time_limited';        // Reversible within timeframe

// ═══════════════════════════════════════════════════════════════════════════════
// OPTIONS — SPATIAL PATHS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Option (spatial path)
 * Each option is a distinct spatial path
 * Paths are equidistant and neutral
 */
export interface XRDecisionOption {
  id: string;
  decision_id: string;
  
  // Content
  title: string;
  description: string;
  
  // Spatial representation
  path_angle: number;         // Angle from center (equidistant)
  path_length: number;        // All paths same length by default
  position: Vector3;          // Endpoint position
  
  // Visual (neutral by default)
  color: string;              // Same color for all unless weighted
  opacity: number;
  glow: number;
  
  // Evaluation
  explicit_weight?: number;   // Only if user assigns
  assumptions: OptionAssumption[];
  risks: OptionRisk[];
  
  // State
  explored: boolean;          // User has walked this path
  selected: boolean;          // This is the chosen option
}

/**
 * Assumption behind an option
 */
export interface OptionAssumption {
  id: string;
  statement: string;
  confidence: 'high' | 'medium' | 'low' | 'unknown';
  source?: string;
}

/**
 * Risk associated with an option
 */
export interface OptionRisk {
  id: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  mitigation?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRITERIA — ORBITING MARKERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Criterion (orbiting marker)
 * Criteria orbit around the decision core
 */
export interface XRDecisionCriterion {
  id: string;
  decision_id: string;
  
  // Content
  name: string;
  description: string;
  
  // Spatial
  orbit_radius: number;       // Distance from center
  orbit_angle: number;        // Position in orbit
  position: Vector3;          // Computed position
  
  // Evaluation
  weight?: number;            // Only if explicitly set
  weight_visible: boolean;    // Whether weight is shown
  
  // Visibility
  active: boolean;            // Currently visible
  
  // No hidden scoring
  // No algorithmic preference
}

/**
 * Criteria evaluation for an option
 */
export interface CriteriaEvaluation {
  option_id: string;
  criterion_id: string;
  score?: number;             // Optional explicit score
  notes?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSEQUENCES — DOWNSTREAM IMPACTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Consequence projection
 */
export interface XRConsequence {
  id: string;
  option_id: string;
  
  // Content
  description: string;
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  
  // Spatial
  position: Vector3;
  distance_from_option: number;  // Further = longer timeframe
  
  // Visual
  certainty: number;          // 0-1, affects opacity
  impact_type: 'positive' | 'negative' | 'neutral' | 'uncertain';
  
  // Linked
  linked_decisions?: string[];
  linked_stakeholders?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT SNAPSHOT INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Snapshot integration state
 */
export interface DecisionSnapshotState {
  loaded: boolean;
  snapshot_id: string | null;
  frozen_context: boolean;     // Irrelevant context frozen
  show_comparison: boolean;    // Compare with current state
  label_visible: boolean;      // Always labeled
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEANING FIELD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Meaning alignment cue
 */
export interface XRDecisionMeaning {
  id: string;
  meaning_id: string;         // Reference to Meaning Layer
  
  // Content
  statement: string;
  purpose_domain: string;
  
  // Spatial (ambient)
  influence_center: Vector3;
  influence_radius: number;
  
  // Alignment
  alignment_with_options: OptionAlignment[];
}

/**
 * How an option aligns with meaning
 */
export interface OptionAlignment {
  option_id: string;
  alignment: 'aligned' | 'neutral' | 'tension' | 'conflict';
  notes?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COGNITIVE LOAD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Decision room load state
 */
export interface DecisionLoadState {
  overall: 'light' | 'moderate' | 'heavy' | 'overwhelming';
  
  // Contributing factors
  option_count: number;
  criterion_count: number;
  consequence_complexity: number;
  context_volatility: number;
  time_pressure: number;
  
  // Environmental effect
  air_density: number;
  visual_density: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPATIAL ZONES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Spatial zone types
 * The room is structured, symmetrical, and calm
 */
export type DecisionZoneType =
  | 'center'            // Decision core
  | 'option_nodes'      // Spatially separated paths
  | 'criteria_ring'     // Criteria orbit
  | 'context_plane'     // Active snapshot
  | 'consequence_field' // Downstream projections
  | 'meaning_field'     // Ambient alignment
  | 'load_indicator';   // Environmental density

/**
 * Zone definition
 */
export interface DecisionZone {
  type: DecisionZoneType;
  bounds: BoundingVolume;
  active: boolean;
  interactive: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRYSTALLIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Crystallization requirements
 * Crystallization occurs ONLY when all met
 */
export interface CrystallizationRequirements {
  user_confirmed: boolean;      // User explicitly confirms
  rationale_provided: boolean;  // Rationale is provided
  reversibility_declared: boolean; // Reversibility is declared
  
  // Optional
  all_options_explored?: boolean;
  all_criteria_evaluated?: boolean;
}

/**
 * Crystallization event
 */
export interface CrystallizationEvent {
  decision_id: string;
  selected_option_id: string;
  rationale: string;
  reversibility: DecisionReversibility;
  
  // Context
  snapshot_id?: string;
  timestamp: string;
  crystallized_by: string;
  
  // Session
  xr_session_logged: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT ROLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Agent capabilities in Decision Room
 */
export interface DecisionRoomAgentCapabilities {
  // MAY do
  can_explain_options: boolean;      // YES
  can_simulate_consequences: boolean; // YES
  can_surface_contradictions: boolean; // YES
  can_cite_sources: boolean;         // YES
  can_cite_contract_boundaries: boolean; // YES
  
  // MAY NOT do
  can_recommend_choice: boolean;     // NEVER
  can_prioritize_options: boolean;   // NEVER
  can_influence_emotionally: boolean; // NEVER
  can_hide_information: boolean;     // NEVER
}

/**
 * Default agent capabilities
 */
export const DECISION_ROOM_AGENT_CAPABILITIES: DecisionRoomAgentCapabilities = {
  can_explain_options: true,
  can_simulate_consequences: true,
  can_surface_contradictions: true,
  can_cite_sources: true,
  can_cite_contract_boundaries: true,
  can_recommend_choice: false,
  can_prioritize_options: false,
  can_influence_emotionally: false,
  can_hide_information: false,
};

/**
 * Agent presence in room
 */
export interface DecisionRoomAgent {
  id: string;
  agent_id: string;
  name: string;
  
  present: boolean;
  position?: Vector3;
  
  // Activity
  last_explanation?: string;
  cited_sources: string[];
  contract_boundaries: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOM STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Complete room state
 */
export interface DecisionRoomState {
  id: string;
  session_id: string;
  entered_at: string;
  entry_reason: DecisionRoomEntryReason;
  
  // Configuration
  config: DecisionRoomConfig;
  
  // Decision
  decision: XRDecisionCore;
  options: XRDecisionOption[];
  criteria: XRDecisionCriterion[];
  consequences: XRConsequence[];
  meanings: XRDecisionMeaning[];
  
  // Context
  snapshot_state: DecisionSnapshotState;
  load_state: DecisionLoadState;
  
  // Zones
  zones: DecisionZone[];
  
  // User
  user_position: Vector3;
  current_zone: DecisionZoneType;
  walking_option_id: string | null;
  
  // Selection
  selected_option_id: string | null;
  hovered_element_id: string | null;
  
  // Agents
  agents: DecisionRoomAgent[];
  
  // Crystallization
  crystallization_requirements: CrystallizationRequirements;
  can_crystallize: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Interaction types in Decision Room
 */
export type DecisionInteractionType =
  | 'walk_option_path'       // Walk along an option path
  | 'inspect_assumptions'    // Inspect option assumptions
  | 'inspect_risks'          // Inspect option risks
  | 'toggle_criterion'       // Toggle criterion visibility
  | 'set_weight'             // Set explicit weight
  | 'view_consequence'       // View consequence detail
  | 'compare_snapshot'       // Compare with current state
  | 'request_agent_explain'  // Ask agent to explain
  | 'begin_crystallization'  // Start crystallization
  | 'confirm_crystallization'; // Confirm decision

/**
 * Interaction event
 */
export interface DecisionInteractionEvent {
  type: DecisionInteractionType;
  timestamp: string;
  target_id?: string;
  target_type?: string;
  user_position: Vector3;
  data?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Room entry request
 */
export interface EnterDecisionRoomRequest {
  entry_reason: DecisionRoomEntryReason;
  decision_id?: string;       // For existing decisions
  new_decision?: {
    title: string;
    question: string;
    description?: string;
  };
  config_overrides?: Partial<DecisionRoomConfig>;
}

/**
 * Room entry response
 */
export interface EnterDecisionRoomResponse {
  success: boolean;
  session_id: string;
  room_state: DecisionRoomState;
  error?: string;
}

/**
 * Crystallization request
 */
export interface CrystallizeDecisionRequest {
  decision_id: string;
  selected_option_id: string;
  rationale: string;
  reversibility: DecisionReversibility;
  confirm: boolean;
}

/**
 * Crystallization response
 */
export interface CrystallizeDecisionResponse {
  success: boolean;
  decision: XRDecisionCore;
  event: CrystallizationEvent;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT PROPS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Decision Room component props
 */
export interface XRDecisionRoomProps {
  // Entry
  entry_reason: DecisionRoomEntryReason;
  decision?: XRDecisionCore;
  initial_config?: Partial<DecisionRoomConfig>;
  
  // Data
  options?: XRDecisionOption[];
  criteria?: XRDecisionCriterion[];
  consequences?: XRConsequence[];
  meanings?: XRDecisionMeaning[];
  
  // Callbacks
  onEnter?: (session_id: string) => void;
  onExit?: () => void;
  onOptionWalk?: (option_id: string) => void;
  onCrystallize?: (event: CrystallizationEvent) => void;
  onInteraction?: (event: DecisionInteractionEvent) => void;
  onAgentRequest?: (request: string, context: unknown) => void;
  
  // XR
  xr_runtime?: 'webxr' | 'mock' | 'preview';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Decision Room design tokens
 * Neutral, symmetrical, calm
 */
export const XR_DECISION_ROOM_TOKENS = {
  // Environment
  environment: {
    background: '#0c0c18',
    ambient: '#2a2a4a',
    fog: '#1a1a2e',
  },
  
  // Decision core
  core: {
    primary: '#6B8DD6',      // Crystalline blue
    glow: '#8BADF0',
    ring: '#4A6AAA',
  },
  
  // Options (all same color for neutrality)
  options: {
    neutral: '#8B8BA8',      // Neutral gray-purple
    explored: '#9B9BC8',
    selected: '#ABABD8',
    path: '#6B6B88',
  },
  
  // Criteria
  criteria: {
    active: '#A8A8C8',
    inactive: '#686888',
    weighted: '#C8C8E8',
  },
  
  // Consequences
  consequences: {
    positive: '#6B9B6B',
    negative: '#9B6B6B',
    neutral: '#8B8B9B',
    uncertain: '#9B9B8B',
  },
  
  // Meaning
  meaning: {
    aligned: '#6B8B6B',
    tension: '#8B8B6B',
    conflict: '#8B6B6B',
    neutral: '#7B7B8B',
  },
  
  // Text
  text: {
    primary: 'rgba(255, 255, 255, 0.9)',
    secondary: 'rgba(255, 255, 255, 0.6)',
    subtle: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Interaction
  interaction: {
    hover: 'rgba(255, 255, 255, 0.1)',
    selected: 'rgba(255, 255, 255, 0.2)',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const XR_DECISION_ROOM_MODULE_METADATA = {
  id: 'xr_decision_room',
  name: 'XR Decision Room',
  version: '1.0.0',
  status: 'stable',
  
  description: `
    XR Decision Room exists to support conscious, accountable
    decision-making in complex contexts.
    
    It is NOT a debate arena.
    It is NOT a persuasion space.
    It is NOT a productivity accelerator.
    
    Decisions are not rushed here. They are crystallized.
  `,
  
  purpose: [
    'Externalize complexity',
    'Slow decision-making appropriately',
    'Preserve responsibility and traceability',
  ],
  
  spatial_zones: [
    'CENTER: Decision core',
    'OPTION NODES: Spatially separated paths (equidistant)',
    'CRITERIA RING: Criteria orbit around core',
    'CONTEXT PLANE: Active Context Snapshot',
    'CONSEQUENCE FIELD: Downstream impact projections',
    'MEANING FIELD: Ambient alignment cues',
    'LOAD INDICATOR: Environmental density',
  ],
  
  constraints: [
    'No asymmetry - room is symmetrical',
    'No visual bias - all options equal',
    'No hidden scoring',
    'No algorithmic preference',
    'Agents may NOT recommend choices',
    'Crystallization requires explicit confirmation',
    'Rationale is always required',
    'Reversibility must be declared',
  ],
  
  dependencies: [
    'decision_crystallizer',
    'context_snapshot',
    'meaning_layer',
    'cognitive_load_regulator',
    'xr_meta_room',
  ],
  
  created_at: '2025-12-29',
  updated_at: '2025-12-29',
};

// ═══════════════════════════════════════════════════════════════════════════════
// NON-GOALS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Decision Room is NOT:
 * - Voting system
 * - Negotiation room
 * - Persuasion engine
 * - Performance theater
 * 
 * It exists for CLARITY, not agreement.
 */
export type XRDecisionRoomNonGoal =
  | 'voting_system'
  | 'negotiation_room'
  | 'persuasion_engine'
  | 'performance_theater'
  | 'debate_arena'
  | 'productivity_accelerator';

export const XR_DECISION_ROOM_NON_GOALS: XRDecisionRoomNonGoal[] = [
  'voting_system',
  'negotiation_room',
  'persuasion_engine',
  'performance_theater',
  'debate_arena',
  'productivity_accelerator',
];
