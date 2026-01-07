/**
 * CHE·NU™ XR NARRATIVE REPLAY — TYPE DEFINITIONS
 * 
 * XR Narrative Replay exists to allow humans to
 * RE-EXPERIENCE the evolution of thought, decisions,
 * and meaning — not just events.
 * 
 * This is NOT surveillance.
 * This is reflective memory.
 * 
 * @version 1.0
 * @status V51-ready
 * @constraint ADDITIVE ONLY (NO REFACTOR)
 */

import type { Vector3, Rotation3 } from '../xr-meta-room/xr-meta-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE SOURCES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Input sources for narrative replay.
 * Meetings are ONE possible source, not the core.
 */
export type NarrativeSourceType =
  | 'knowledge_thread'
  | 'context_snapshot'
  | 'crystallized_decision'
  | 'meaning_entry'
  | 'timeline_event'
  | 'xr_session';  // Only if consented

/**
 * Narrative source reference
 */
export interface NarrativeSource {
  type: NarrativeSourceType;
  id: string;
  title: string;
  timestamp: string;
  
  // Source-specific
  thread_id?: string;
  snapshot_id?: string;
  decision_id?: string;
  meaning_id?: string;
  event_type?: string;
  session_id?: string;
  
  // Consent
  consented: boolean;
  consent_given_by?: string;
  consent_given_at?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Narrative element type
 */
export type NarrativeElementType =
  | 'start'         // Initial context & meaning
  | 'branch'        // Explored options
  | 'pause'         // Uncertainty & reflection
  | 'decision'      // Crystallization points
  | 'consequence'   // Downstream effects
  | 'evolution';    // Meaning shifts

/**
 * Base narrative element
 */
export interface NarrativeElement {
  id: string;
  type: NarrativeElementType;
  
  // Temporal
  timestamp: string;
  duration_seconds?: number;
  
  // Spatial (in narrative path)
  position: Vector3;
  
  // Content
  title: string;
  description: string;
  
  // Context
  context_at_time: string;
  intention_at_time?: string;
  uncertainty_level?: number;  // 0-1
  
  // Responsibility
  actor_id?: string;
  actor_name?: string;
  
  // Links
  source: NarrativeSource;
  linked_elements: string[];  // IDs
  
  // Metadata
  created_at: string;
  preserved_as_was: boolean;  // Must be true
}

// ═══════════════════════════════════════════════════════════════════════════════
// ELEMENT SUBTYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Start element — Initial context & meaning
 */
export interface StartElement extends NarrativeElement {
  type: 'start';
  
  // Start-specific
  initial_context: string;
  initial_meaning: string[];
  initial_goals?: string[];
  initial_assumptions?: string[];
}

/**
 * Branch element — Explored options
 */
export interface BranchElement extends NarrativeElement {
  type: 'branch';
  
  // Branch-specific
  options_explored: BranchOption[];
  branching_reason: string;
  branch_chosen?: string;  // ID of chosen option
}

export interface BranchOption {
  id: string;
  title: string;
  description: string;
  explored: boolean;
  rejected_reason?: string;
  led_to?: string;  // Next element ID
}

/**
 * Pause element — Uncertainty & reflection
 */
export interface PauseElement extends NarrativeElement {
  type: 'pause';
  
  // Pause-specific
  pause_reason: 'uncertainty' | 'reflection' | 'waiting' | 'overload';
  questions_at_time?: string[];
  insights_emerged?: string[];
  duration_felt?: 'brief' | 'extended' | 'significant';
}

/**
 * Decision element — Crystallization points
 */
export interface DecisionElement extends NarrativeElement {
  type: 'decision';
  
  // Decision-specific
  decision_id: string;
  decision_title: string;
  rationale: string;
  reversibility: 'reversible' | 'partially_reversible' | 'irreversible';
  options_considered: string[];
  option_chosen: string;
  
  // Context at crystallization
  load_at_decision?: 'light' | 'moderate' | 'heavy' | 'critical';
  meaning_aligned: boolean;
}

/**
 * Consequence element — Downstream effects
 */
export interface ConsequenceElement extends NarrativeElement {
  type: 'consequence';
  
  // Consequence-specific
  cause_element_id: string;  // What caused this
  impact_type: 'positive' | 'neutral' | 'negative' | 'mixed';
  impact_description: string;
  expected: boolean;  // Was this expected?
  learnings?: string[];
}

/**
 * Evolution element — Meaning shifts
 */
export interface EvolutionElement extends NarrativeElement {
  type: 'evolution';
  
  // Evolution-specific
  meaning_before: string;
  meaning_after: string;
  shift_reason: string;
  gradual: boolean;  // vs. sudden
  triggered_by?: string;  // Element ID
}

// ═══════════════════════════════════════════════════════════════════════════════
// NARRATIVE PATH
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Narrative path configuration
 */
export interface NarrativePath {
  id: string;
  title: string;
  description: string;
  
  // Structure
  elements: NarrativeElement[];
  connections: NarrativeConnection[];
  
  // Temporal
  start_time: string;
  end_time?: string;  // Null if ongoing
  
  // Ownership
  created_by: string;
  shared_with?: string[];
  
  // Consent
  all_sources_consented: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

/**
 * Connection between narrative elements
 */
export interface NarrativeConnection {
  id: string;
  from_element_id: string;
  to_element_id: string;
  
  // Type
  connection_type: 'sequential' | 'branch' | 'consequence' | 'reference';
  
  // Spatial
  path_waypoints?: Vector3[];
  
  // Temporal/semantic gap
  temporal_gap: number;  // seconds
  semantic_gap: number;  // 0-1, how different
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPATIAL REPRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Spatial configuration for narrative
 */
export interface NarrativeSpatialConfig {
  // Narrative Path: walkable timeline
  path_style: 'linear' | 'branching' | 'spiral';
  path_width: number;
  
  // Anchors: decisions & snapshots
  anchor_visibility: 'all' | 'major_only' | 'user_controlled';
  
  // Atmosphere: load & meaning
  atmosphere_reactive: boolean;  // Shifts with cognitive load
  
  // Distance meaning
  distance_represents: 'temporal' | 'semantic' | 'hybrid';
  
  // Time spatialization
  time_compression: number;  // Seconds per unit distance
  time_direction: Vector3;  // Direction of time flow
}

/**
 * Default spatial config
 */
export const DEFAULT_NARRATIVE_SPATIAL_CONFIG: NarrativeSpatialConfig = {
  path_style: 'branching',
  path_width: 1.5,
  anchor_visibility: 'user_controlled',
  atmosphere_reactive: true,
  distance_represents: 'hybrid',
  time_compression: 3600,  // 1 hour = 1 unit
  time_direction: { x: 1, y: 0, z: 0 },  // Time flows forward on X
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER CONTROLS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * User controls for replay
 */
export interface NarrativeUserControls {
  // Playback
  can_pause: boolean;       // Always true
  can_jump: boolean;        // Always true
  can_compare: boolean;     // Always true
  can_exit: boolean;        // Always true (instant)
  
  // Speed
  playback_speed: number;   // 1 = real-time, 0 = paused
  max_speed: number;
  
  // Position
  current_position: Vector3;
  current_element_id: string | null;
  
  // Comparison
  comparison_mode: boolean;
  comparison_snapshot_id?: string;
}

/**
 * Default user controls
 */
export const DEFAULT_NARRATIVE_USER_CONTROLS: NarrativeUserControls = {
  can_pause: true,
  can_jump: true,
  can_compare: true,
  can_exit: true,
  playback_speed: 0,  // Start paused
  max_speed: 10,
  current_position: { x: 0, y: 0, z: 0 },
  current_element_id: null,
  comparison_mode: false,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYBACK STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Playback state
 */
export type PlaybackState =
  | 'idle'        // Not started
  | 'playing'     // Auto-advancing
  | 'paused'      // User paused
  | 'exploring'   // User freely exploring
  | 'comparing'   // Comparing past/present
  | 'exiting';    // Exit in progress

/**
 * Narrative session state
 */
export interface NarrativeSessionState {
  session_id: string;
  narrative_id: string;
  
  // Playback
  playback_state: PlaybackState;
  current_time: string;  // Narrative time
  elapsed_real_time: number;  // Seconds in session
  
  // Position
  current_element: NarrativeElement | null;
  visited_elements: string[];  // IDs
  
  // User
  user_id: string;
  controls: NarrativeUserControls;
  
  // Metadata
  started_at: string;
  ended_at?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT ROLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Agent capabilities in narrative replay
 */
export interface NarrativeAgentCapabilities {
  // MAY do
  can_explain: boolean;       // What happened
  can_clarify: boolean;       // Why it mattered
  can_answer: boolean;        // Questions
  
  // MAY NOT do
  can_reinterpret: boolean;   // NEVER - false
  can_justify: boolean;       // NEVER - false
  can_rewrite: boolean;       // NEVER - false
  
  // Must do
  must_cite_sources: boolean; // ALWAYS - true
}

/**
 * Default agent capabilities
 */
export const NARRATIVE_AGENT_CAPABILITIES: NarrativeAgentCapabilities = {
  can_explain: true,
  can_clarify: true,
  can_answer: true,
  can_reinterpret: false,
  can_justify: false,
  can_rewrite: false,
  must_cite_sources: true,
};

/**
 * Agent presence in replay
 */
export interface NarrativeAgent {
  id: string;
  name: string;
  capabilities: NarrativeAgentCapabilities;
  
  // Current state
  is_present: boolean;
  current_explanation?: string;
  cited_sources?: NarrativeSource[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ETHICAL SAFEGUARDS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Ethical safeguards for narrative replay
 */
export interface NarrativeEthicalSafeguards {
  // Opt-in
  replay_is_opt_in: boolean;  // ALWAYS true
  
  // Recording
  no_hidden_recording: boolean;  // ALWAYS true
  
  // Auto-generation
  no_auto_narratives: boolean;  // Without approval - ALWAYS true
  
  // Preservation
  meaning_preserved_as_was: boolean;  // ALWAYS true
  
  // Retrospective
  no_retrospective_optimization: boolean;  // ALWAYS true
}

/**
 * Default ethical safeguards
 */
export const DEFAULT_ETHICAL_SAFEGUARDS: NarrativeEthicalSafeguards = {
  replay_is_opt_in: true,
  no_hidden_recording: true,
  no_auto_narratives: true,
  meaning_preserved_as_was: true,
  no_retrospective_optimization: true,
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM NARRATIVE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Team narrative configuration
 */
export interface TeamNarrativeConfig {
  // Perspectives
  individual_perspectives_visible: boolean;  // ALWAYS true
  
  // Ownership
  ownership_preserved: boolean;  // ALWAYS true
  
  // Disagreements
  disagreements_smoothed: boolean;  // NEVER - always false
  
  // History
  history_plural: boolean;  // ALWAYS true
}

/**
 * Default team narrative config
 */
export const DEFAULT_TEAM_NARRATIVE_CONFIG: TeamNarrativeConfig = {
  individual_perspectives_visible: true,
  ownership_preserved: true,
  disagreements_smoothed: false,
  history_plural: true,
};

/**
 * Team participant in narrative
 */
export interface NarrativeParticipant {
  id: string;
  name?: string;  // Optional
  
  // Perspective
  perspective_color: string;  // Distinct but subtle
  elements_contributed: string[];  // Element IDs
  
  // Presence in replay
  is_viewing: boolean;
  current_position?: Vector3;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON MODE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Comparison between past and present
 */
export interface NarrativeComparison {
  id: string;
  
  // What's being compared
  past_element_id: string;
  past_timestamp: string;
  past_meaning: string;
  
  // Present state
  present_meaning?: string;
  present_context?: string;
  
  // Differences
  differences: ComparisonDifference[];
  
  // User notes
  user_notes?: string;
}

export interface ComparisonDifference {
  aspect: string;
  past_value: string;
  present_value: string;
  significance: 'minor' | 'moderate' | 'major';
}

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create narrative request
 */
export interface CreateNarrativeRequest {
  title: string;
  description: string;
  sources: NarrativeSource[];
  spatial_config?: Partial<NarrativeSpatialConfig>;
  created_by: string;
}

/**
 * Create narrative response
 */
export interface CreateNarrativeResponse {
  narrative: NarrativePath;
  created: boolean;
  error?: string;
}

/**
 * Start replay request
 */
export interface StartReplayRequest {
  narrative_id: string;
  user_id: string;
  start_from_element?: string;  // Optional start point
}

/**
 * Start replay response
 */
export interface StartReplayResponse {
  session: NarrativeSessionState;
  started: boolean;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT PROPS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Narrative Replay props
 */
export interface XRNarrativeReplayProps {
  // Narrative
  narrative: NarrativePath;
  
  // User
  user_id: string;
  
  // Configuration
  spatial_config?: Partial<NarrativeSpatialConfig>;
  
  // Agent
  agent_enabled?: boolean;
  agent?: NarrativeAgent;
  
  // Team mode
  is_team_narrative?: boolean;
  participants?: NarrativeParticipant[];
  
  // Callbacks
  onElementVisit?: (element: NarrativeElement) => void;
  onPlaybackStateChange?: (state: PlaybackState) => void;
  onComparison?: (comparison: NarrativeComparison) => void;
  onExit?: () => void;
  onAgentQuestion?: (question: string) => void;
  
  // Keyboard
  exitKey?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Narrative Replay design tokens
 */
export const XR_NARRATIVE_REPLAY_TOKENS = {
  // Background
  background: {
    dark: '#0a0a12',
    ambient: 'rgba(20, 20, 35, 0.9)',
  },
  
  // Elements
  elements: {
    start: {
      color: '#7A8B99',  // Muted blue-gray
      glow: 'rgba(122, 139, 153, 0.3)',
    },
    branch: {
      color: '#8B8899',  // Muted purple-gray
      glow: 'rgba(139, 136, 153, 0.3)',
    },
    pause: {
      color: '#8B9988',  // Muted green-gray
      glow: 'rgba(139, 153, 136, 0.2)',
    },
    decision: {
      color: '#99887A',  // Muted amber
      glow: 'rgba(153, 136, 122, 0.4)',
    },
    consequence: {
      color: '#888899',  // Neutral gray-purple
      glow: 'rgba(136, 136, 153, 0.3)',
    },
    evolution: {
      color: '#8A9988',  // Muted teal-gray
      glow: 'rgba(138, 153, 136, 0.3)',
    },
  },
  
  // Path
  path: {
    main: 'rgba(160, 140, 180, 0.4)',
    branch: 'rgba(140, 140, 160, 0.3)',
    faded: 'rgba(120, 120, 140, 0.2)',
  },
  
  // Atmosphere
  atmosphere: {
    light: 'rgba(136, 170, 136, 0.1)',
    moderate: 'rgba(170, 170, 136, 0.1)',
    heavy: 'rgba(170, 136, 136, 0.1)',
    critical: 'rgba(170, 120, 120, 0.15)',
  },
  
  // UI
  ui: {
    panel: 'rgba(20, 20, 35, 0.9)',
    border: 'rgba(136, 136, 170, 0.2)',
    text_primary: 'rgba(255, 255, 255, 0.85)',
    text_secondary: 'rgba(255, 255, 255, 0.6)',
    text_subtle: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Controls
  controls: {
    play: '#88AA88',
    pause: '#AAAA88',
    compare: '#8888AA',
    exit: 'rgba(170, 136, 136, 0.8)',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const XR_NARRATIVE_REPLAY_MODULE_METADATA = {
  id: 'xr_narrative_replay',
  name: 'XR Narrative Replay',
  version: '1.0.0',
  status: 'stable',
  
  description: `
    XR Narrative Replay exists to allow humans to
    RE-EXPERIENCE the evolution of thought, decisions,
    and meaning — not just events.
    
    It answers:
    → "How did we get here?"
    → "What changed along the way?"
    → "What did we believe then?"
    
    This is NOT surveillance.
    This is reflective memory.
  `,
  
  narrative_structure: [
    'START: initial context & meaning',
    'BRANCHES: explored options',
    'PAUSES: uncertainty & reflection',
    'DECISIONS: crystallization points',
    'CONSEQUENCES: downstream effects',
    'EVOLUTION: meaning shifts',
  ],
  
  input_sources: [
    'Knowledge Threads',
    'Context Snapshots',
    'Crystallized Decisions',
    'Meaning Entries',
    'Timeline events',
    'XR sessions (if consented)',
  ],
  
  user_controls: [
    'Pause narrative',
    'Jump between points',
    'Compare past & present',
    'Exit instantly',
  ],
  
  ethical_safeguards: [
    'Replay is opt-in',
    'No hidden recording',
    'No auto-generated narratives without approval',
    'Meaning is preserved as it was',
    'No retrospective optimization',
  ],
  
  team_narrative_rules: [
    'Individual perspectives remain visible',
    'Ownership is preserved',
    'Disagreements are not smoothed out',
    'History remains plural',
  ],
  
  agent_capabilities: {
    may: ['explain what happened', 'clarify why a decision mattered', 'answer questions'],
    may_not: ['reinterpret meaning', 'justify outcomes', 'rewrite history'],
    must: ['cite sources'],
  },
  
  dependencies: [
    'knowledge_threads',
    'context_snapshot',
    'decision_crystallizer',
    'meaning_layer',
    'xr_architecture_system',
  ],
  
  created_at: '2025-12-29',
  updated_at: '2025-12-29',
};

// ═══════════════════════════════════════════════════════════════════════════════
// NON-GOALS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Narrative Replay is NOT:
 */
export type XRNarrativeReplayNonGoal =
  | 'training_playback'
  | 'performance_review'
  | 'persuasion_storytelling'
  | 'revisionist_history';

export const XR_NARRATIVE_REPLAY_NON_GOALS: XRNarrativeReplayNonGoal[] = [
  'training_playback',
  'performance_review',
  'persuasion_storytelling',
  'revisionist_history',
];
