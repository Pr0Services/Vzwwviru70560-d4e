/**
 * CHE·NU™ XR TEAM REFLECTION — TYPE DEFINITIONS
 * 
 * XR Team Reflection exists to allow multiple humans to
 * reflect together on shared work WITHOUT:
 * - urgency
 * - hierarchy
 * - persuasion
 * - performance pressure
 * 
 * It is NOT a meeting room.
 * It is NOT a standup.
 * It is NOT a review board.
 * 
 * @version 1.0
 * @status V51-ready
 * @constraint ADDITIVE ONLY (NO REFACTOR)
 */

import type { Vector3, Rotation3, BoundingVolume } from '../xr-meta-room/xr-meta-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM REFLECTION CORE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Room entry requirements
 * Entry requires explicit consent
 */
export interface TeamReflectionEntryRequirements {
  explicit_invitation: boolean;  // Always required
  explicit_consent: boolean;     // Always required
  scope_defined: boolean;        // Always required
  no_auto_join: boolean;         // Always true
  no_silent_presence: boolean;   // Always true
}

/**
 * Room configuration
 */
export interface TeamReflectionConfig {
  // Layout
  circular_layout: boolean;      // Always true - non-hierarchical
  equal_positions: boolean;      // Always true - no dominant position
  no_head_of_table: boolean;     // Always true
  
  // Privacy
  anonymous_load: boolean;       // Cognitive load is anonymized
  names_optional: boolean;       // Names can be hidden
  no_status_indicators: boolean; // No rank display
  
  // Behavior
  allow_meaning_add: boolean;    // Participants can add meaning
  allow_misalignment_mark: boolean; // Can mark misalignment
  silence_allowed: boolean;      // Silence is respected
  
  // Recording
  recording_consented: boolean;  // Explicit consent required
  logging_enabled: boolean;
}

/**
 * Default configuration
 */
export const DEFAULT_TEAM_REFLECTION_CONFIG: TeamReflectionConfig = {
  circular_layout: true,
  equal_positions: true,
  no_head_of_table: true,
  anonymous_load: true,
  names_optional: true,
  no_status_indicators: true,
  allow_meaning_add: true,
  allow_misalignment_mark: true,
  silence_allowed: true,
  recording_consented: false,
  logging_enabled: false,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PARTICIPANT PRESENCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Participant in reflection space
 * Presence is equal by design
 */
export interface TeamReflectionParticipant {
  id: string;
  user_id: string;
  
  // Identity (minimal)
  display_name?: string;          // Optional, can be anonymous
  avatar_style: 'minimal' | 'abstract' | 'hidden';
  
  // Position (equidistant)
  position: Vector3;
  seat_index: number;             // Position in circle
  
  // State
  present: boolean;
  joined_at: string;
  consent_given: boolean;
  
  // Activity (subtle)
  is_speaking: boolean;           // Currently speaking
  has_acknowledged: boolean;      // Has acknowledged shared meaning
  silence_mode: boolean;          // In quiet reflection
  
  // NO status indicators
  // NO rank display
  // NO performance metrics
}

/**
 * Invitation to join reflection
 */
export interface TeamReflectionInvitation {
  id: string;
  session_id: string;
  
  invited_user_id: string;
  invited_by: string;
  
  scope: ReflectionScope;
  
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sent_at: string;
  responded_at?: string;
  
  consent_required: true;  // Always required
}

// ═══════════════════════════════════════════════════════════════════════════════
// REFLECTION SCOPE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * What this reflection is about
 */
export interface ReflectionScope {
  id: string;
  title: string;
  description?: string;
  
  // What is being reflected on
  focus_type: ReflectionFocusType;
  
  // Linked content
  linked_thread_ids: string[];
  linked_decision_ids: string[];
  linked_meaning_ids: string[];
  
  // Time bounds
  time_period?: {
    start: string;
    end: string;
  };
  
  // Defined by
  defined_by: string;
  defined_at: string;
}

/**
 * Types of reflection focus
 */
export type ReflectionFocusType =
  | 'shared_meaning'     // Reflecting on shared values/intentions
  | 'shared_decisions'   // Reflecting on past decisions
  | 'shared_threads'     // Reflecting on shared knowledge
  | 'workflow_patterns'  // Reflecting on how we work
  | 'alignment_check'    // Checking team alignment
  | 'open_reflection';   // General reflection, no specific focus

// ═══════════════════════════════════════════════════════════════════════════════
// SPATIAL ZONES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Spatial zone types
 * The room is circular and non-hierarchical
 */
export type TeamReflectionZoneType =
  | 'center'           // Shared focus area
  | 'meaning_field'    // Shared values & intentions
  | 'thread_map'       // Shared knowledge threads
  | 'decision_archive' // Shared decisions (read-only)
  | 'load_ambience'    // Aggregated team load
  | 'silence_zone';    // Optional quiet reflection

/**
 * Zone definition
 */
export interface TeamReflectionZone {
  type: TeamReflectionZoneType;
  bounds: BoundingVolume;
  active: boolean;
  participants_in_zone: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED MEANING — XR REPRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Shared meaning in reflection space
 * Appears as ambient shared statements
 */
export interface SharedMeaning {
  id: string;
  meaning_id: string;        // Reference to Meaning Layer
  
  // Content
  statement: string;
  domain: string;
  
  // Spatial (ambient)
  position: Vector3;
  influence_radius: number;
  
  // State
  visibility: 'visible' | 'subtle' | 'hidden';
  
  // Acknowledgment
  acknowledged_by: string[];  // Participants who acknowledged
  conflict_marked_by: string[]; // Participants who marked conflict
  
  // Conflicts are shown gently, never emphasized
  has_conflict: boolean;
  conflict_notes?: string[];
}

/**
 * Meaning conflict marker
 * Shown gently, never emphasized
 */
export interface MeaningConflict {
  meaning_id: string;
  marked_by: string;
  notes?: string;
  marked_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED THREADS — XR REPRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Shared knowledge thread in reflection
 */
export interface SharedThread {
  id: string;
  thread_id: string;         // Reference to Knowledge Thread
  
  // Content
  title: string;
  summary: string;
  
  // Spatial
  path_points: Vector3[];
  thickness: number;
  
  // Ownership
  contributors: string[];
  
  // State
  highlighted: boolean;
  being_discussed: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED DECISIONS — XR REPRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Shared decision in reflection
 * Read-only unless explicitly enabled
 */
export interface SharedDecision {
  id: string;
  decision_id: string;       // Reference to Decision Crystallizer
  
  // Content
  title: string;
  question: string;
  selected_option: string;
  rationale: string;
  
  // Spatial (anchor)
  position: Vector3;
  
  // Ownership
  crystallized_by: string;
  
  // State
  is_read_only: boolean;     // Always true unless explicitly enabled
  being_reviewed: boolean;
  
  // Reflection ≠ decision-making
}

// ═══════════════════════════════════════════════════════════════════════════════
// COGNITIVE LOAD — TEAM VIEW
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Team cognitive load state
 * Aggregated and anonymized
 */
export interface TeamLoadState {
  // Aggregated (no individual exposure)
  aggregated_level: 'light' | 'moderate' | 'heavy' | 'critical';
  
  // Environmental representation
  environmental_tone: 'open' | 'present' | 'weighted' | 'dense';
  
  // Purpose: collective pacing awareness
  // NOT for individual monitoring
  
  // Counts (anonymous)
  participants_in_light: number;
  participants_in_heavy: number;
  
  // NO individual exposure
  individual_loads?: never;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SILENCE ZONE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Silence zone for quiet reflection
 */
export interface SilenceZone {
  id: string;
  position: Vector3;
  radius: number;
  
  // Participants in silence
  participants: string[];
  
  // Silence is allowed and respected
  active: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT ROLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Agent capabilities in Team Reflection
 * Agents are observers, not facilitators
 */
export interface TeamReflectionAgentCapabilities {
  // MAY do
  can_summarize: boolean;        // YES
  can_clarify: boolean;          // YES
  can_answer_questions: boolean; // YES
  
  // MAY NOT do
  can_moderate: boolean;         // NEVER
  can_steer_conclusions: boolean; // NEVER
  can_enforce_alignment: boolean; // NEVER
  can_facilitate: boolean;       // NEVER
}

/**
 * Default agent capabilities
 */
export const TEAM_REFLECTION_AGENT_CAPABILITIES: TeamReflectionAgentCapabilities = {
  can_summarize: true,
  can_clarify: true,
  can_answer_questions: true,
  can_moderate: false,
  can_steer_conclusions: false,
  can_enforce_alignment: false,
  can_facilitate: false,
};

/**
 * Agent presence in team reflection
 */
export interface TeamReflectionAgent {
  id: string;
  agent_id: string;
  name: string;
  
  present: boolean;
  position?: Vector3;
  
  // Role is observer only
  role: 'observer';
  
  last_summary?: string;
  last_clarification?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOM STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Complete room state
 */
export interface TeamReflectionRoomState {
  id: string;
  session_id: string;
  started_at: string;
  
  // Configuration
  config: TeamReflectionConfig;
  scope: ReflectionScope;
  
  // Participants
  participants: TeamReflectionParticipant[];
  max_participants: number;
  
  // Content
  shared_meanings: SharedMeaning[];
  shared_threads: SharedThread[];
  shared_decisions: SharedDecision[];
  
  // Zones
  zones: TeamReflectionZone[];
  silence_zone: SilenceZone;
  
  // Load (aggregated)
  team_load: TeamLoadState;
  
  // Agents
  agents: TeamReflectionAgent[];
  
  // State
  is_active: boolean;
  recording_consented: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Interaction types in Team Reflection
 */
export type TeamReflectionInteractionType =
  | 'acknowledge_meaning'   // Acknowledge shared meaning
  | 'mark_misalignment'     // Mark misalignment (gentle)
  | 'add_meaning'           // Add new meaning (if permitted)
  | 'highlight_thread'      // Highlight a thread for discussion
  | 'review_decision'       // Review a decision
  | 'enter_silence'         // Enter silence zone
  | 'exit_silence'          // Exit silence zone
  | 'request_summary'       // Ask agent for summary
  | 'request_clarification'; // Ask agent for clarification

/**
 * Interaction event
 */
export interface TeamReflectionInteractionEvent {
  type: TeamReflectionInteractionType;
  participant_id: string;
  timestamp: string;
  target_id?: string;
  target_type?: string;
  data?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXIT & SAFETY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Exit options
 * One-gesture exit, one-voice exit
 */
export type ExitMethod = 'gesture' | 'voice' | 'button' | 'timeout';

/**
 * Exit event
 */
export interface ExitEvent {
  participant_id: string;
  method: ExitMethod;
  timestamp: string;
  session_still_active: boolean;
  
  // No lingering presence
  presence_cleared: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create session request
 */
export interface CreateTeamReflectionRequest {
  scope: Omit<ReflectionScope, 'id' | 'defined_at'>;
  config?: Partial<TeamReflectionConfig>;
  initial_invitations: string[];  // User IDs to invite
}

/**
 * Create session response
 */
export interface CreateTeamReflectionResponse {
  success: boolean;
  session_id: string;
  room_state: TeamReflectionRoomState;
  invitations_sent: TeamReflectionInvitation[];
  error?: string;
}

/**
 * Join session request
 */
export interface JoinTeamReflectionRequest {
  session_id: string;
  invitation_id: string;
  consent_given: boolean;
  display_name?: string;
  avatar_style?: TeamReflectionParticipant['avatar_style'];
}

/**
 * Join session response
 */
export interface JoinTeamReflectionResponse {
  success: boolean;
  participant: TeamReflectionParticipant;
  room_state: TeamReflectionRoomState;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT PROPS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Team Reflection component props
 */
export interface XRTeamReflectionProps {
  // Session
  session_id: string;
  scope: ReflectionScope;
  config?: Partial<TeamReflectionConfig>;
  
  // Current user
  current_user_id: string;
  display_name?: string;
  
  // Participants
  participants?: TeamReflectionParticipant[];
  
  // Content
  shared_meanings?: SharedMeaning[];
  shared_threads?: SharedThread[];
  shared_decisions?: SharedDecision[];
  
  // Callbacks
  onJoin?: (participant: TeamReflectionParticipant) => void;
  onLeave?: (exit: ExitEvent) => void;
  onAcknowledge?: (meaning_id: string) => void;
  onMarkMisalignment?: (meaning_id: string, notes?: string) => void;
  onEnterSilence?: () => void;
  onExitSilence?: () => void;
  onInteraction?: (event: TeamReflectionInteractionEvent) => void;
  onAgentRequest?: (type: 'summary' | 'clarification', context?: unknown) => void;
  
  // XR
  xr_runtime?: 'webxr' | 'mock' | 'preview';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Team Reflection design tokens
 * Calm, equal, non-hierarchical
 */
export const XR_TEAM_REFLECTION_TOKENS = {
  // Environment
  environment: {
    background: '#0a0a12',
    ambient: '#1a1a2a',
    floor: '#141420',
  },
  
  // Center
  center: {
    focus: 'rgba(180, 180, 200, 0.2)',
    glow: 'rgba(180, 180, 200, 0.1)',
  },
  
  // Participants (all equal color)
  participant: {
    avatar: '#8888AA',
    speaking: '#9999BB',
    silence: '#666688',
  },
  
  // Shared Meaning
  meaning: {
    visible: 'rgba(140, 160, 180, 0.6)',
    subtle: 'rgba(140, 160, 180, 0.3)',
    acknowledged: 'rgba(160, 180, 160, 0.5)',
    conflict: 'rgba(180, 160, 140, 0.4)', // Gentle, not alarming
  },
  
  // Threads
  thread: {
    path: 'rgba(160, 140, 180, 0.5)',
    highlighted: 'rgba(180, 160, 200, 0.7)',
  },
  
  // Decisions
  decision: {
    anchor: 'rgba(140, 180, 180, 0.5)',
    reviewing: 'rgba(160, 200, 200, 0.6)',
  },
  
  // Load ambience
  load: {
    light: 'rgba(160, 180, 160, 0.2)',
    moderate: 'rgba(180, 180, 160, 0.3)',
    heavy: 'rgba(180, 160, 160, 0.4)',
    critical: 'rgba(180, 140, 140, 0.5)',
  },
  
  // Silence zone
  silence: {
    border: 'rgba(100, 100, 120, 0.3)',
    interior: 'rgba(80, 80, 100, 0.1)',
  },
  
  // Text
  text: {
    primary: 'rgba(255, 255, 255, 0.85)',
    secondary: 'rgba(255, 255, 255, 0.6)',
    subtle: 'rgba(255, 255, 255, 0.3)',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const XR_TEAM_REFLECTION_MODULE_METADATA = {
  id: 'xr_team_reflection',
  name: 'XR Team Reflection',
  version: '1.0.0',
  status: 'stable',
  
  description: `
    XR Team Reflection exists to allow multiple humans to
    reflect together on shared work WITHOUT:
    - urgency
    - hierarchy
    - persuasion
    - performance pressure
    
    It supports shared understanding, alignment, and mutual respect.
  `,
  
  purpose: [
    'Shared understanding',
    'Alignment',
    'Mutual respect',
  ],
  
  spatial_zones: [
    'CENTER: Shared focus area',
    'MEANING FIELD: Shared values & intentions',
    'THREAD MAP: Shared knowledge threads',
    'DECISION ARCHIVE: Shared decisions (read-only)',
    'LOAD AMBIENCE: Aggregated team load',
    'SILENCE ZONE: Optional quiet reflection',
  ],
  
  constraints: [
    'No "head of table"',
    'No dominant position',
    'No status indicators',
    'No rank display',
    'No individual metrics',
    'No private data exposed',
    'No auto-joining',
    'No silent presence',
    'No recording without consent',
    'Agents may NOT moderate',
    'Agents may NOT steer conclusions',
    'Agents may NOT enforce alignment',
  ],
  
  entry_requirements: [
    'Explicit invitation',
    'Explicit consent',
    'Clear scope definition',
  ],
  
  dependencies: [
    'meaning_layer',
    'knowledge_threads',
    'decision_crystallizer',
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
 * XR Team Reflection is NOT:
 */
export type XRTeamReflectionNonGoal =
  | 'team_performance_evaluation'
  | 'managerial_oversight'
  | 'consensus_forcing'
  | 'social_pressure_mechanism'
  | 'meeting_room'
  | 'standup'
  | 'review_board';

export const XR_TEAM_REFLECTION_NON_GOALS: XRTeamReflectionNonGoal[] = [
  'team_performance_evaluation',
  'managerial_oversight',
  'consensus_forcing',
  'social_pressure_mechanism',
  'meeting_room',
  'standup',
  'review_board',
];
