/**
 * CHE·NU™ V51 Meta-Layer
 * Decision Crystallizer V1.0 — Types
 * 
 * PURPOSE:
 * Makes decisions VISIBLE, TRACEABLE, and EXPLICIT.
 * Preserves the decision-making moment without optimization pressure.
 * 
 * CORE PRINCIPLE:
 * Decisions are CRYSTALLIZED, not optimized.
 * The system records and respects choices, never judges them.
 * 
 * WHAT THIS IS:
 * - A decision journal
 * - A choice visibility system
 * - A traceability record
 * - An uncertainty acknowledgment tool
 * 
 * WHAT THIS IS NOT:
 * - A decision optimizer
 * - A choice recommender
 * - A regret analyzer
 * - A performance evaluator
 * - A rationality coach
 * 
 * ETHICAL CONSTRAINTS:
 * - No decision scoring or ranking
 * - No "optimal path" suggestions
 * - No outcome-based judgment
 * - No regret framing
 * - No hindsight optimization
 * - No pressure to decide faster
 * - No comparison with others' decisions
 * 
 * © 2025 CHE·NU™ — Governed Intelligence Operating System
 */

// ============================================================================
// DECISION NATURE
// ============================================================================

/**
 * Decision nature — What kind of choice this is
 * 
 * These are descriptive, not evaluative.
 * No hierarchy implied.
 */
export type DecisionNature = 
  | 'commitment'      // ◆ Choosing to stand by something
  | 'direction'       // → Choosing a path forward
  | 'boundary'        // ⊥ Choosing what to exclude
  | 'priority'        // ↑ Choosing what comes first
  | 'allocation'      // ⊞ Choosing how to distribute
  | 'delegation'      // ↷ Choosing who handles what
  | 'deferral'        // ⏸ Choosing to decide later
  | 'acceptance'      // ✓ Choosing to accept as-is
  | 'release'         // ○ Choosing to let go
  | 'unknown';        // ? Nature not yet clear

/**
 * Visual symbols for decision natures
 * Neutral iconography, no judgment implied
 */
export const DECISION_NATURE_SYMBOLS: Record<DecisionNature, string> = {
  commitment: '◆',
  direction: '→',
  boundary: '⊥',
  priority: '↑',
  allocation: '⊞',
  delegation: '↷',
  deferral: '⏸',
  acceptance: '✓',
  release: '○',
  unknown: '?'
};

/**
 * Human-readable labels for decision natures
 */
export const DECISION_NATURE_LABELS: Record<DecisionNature, string> = {
  commitment: 'Commitment',
  direction: 'Direction',
  boundary: 'Boundary',
  priority: 'Priority',
  allocation: 'Allocation',
  delegation: 'Delegation',
  deferral: 'Deferral',
  acceptance: 'Acceptance',
  release: 'Release',
  unknown: 'Unknown'
};

/**
 * Descriptions for decision natures
 * Descriptive only, no prescription
 */
export const DECISION_NATURE_DESCRIPTIONS: Record<DecisionNature, string> = {
  commitment: 'Standing by something regardless of outcome',
  direction: 'Choosing a path among possibilities',
  boundary: 'Defining what is outside scope',
  priority: 'Ordering what matters most now',
  allocation: 'Distributing resources or attention',
  delegation: 'Assigning responsibility to others',
  deferral: 'Consciously postponing a choice',
  acceptance: 'Acknowledging reality as it is',
  release: 'Letting go of control or attachment',
  unknown: 'Nature not yet determined'
};

// ============================================================================
// CERTAINTY LEVELS
// ============================================================================

/**
 * Certainty level — How confident the human feels
 * 
 * This is SELF-REPORTED, never inferred.
 * No external judgment of appropriateness.
 */
export type CertaintyLevel = 
  | 'certain'         // I know this is what I want
  | 'confident'       // I feel good about this
  | 'leaning'         // I think this is right
  | 'uncertain'       // I'm not sure
  | 'torn'            // I see valid paths in multiple directions
  | 'forced';         // I don't want to choose but must

/**
 * Certainty level visual indicators
 * No value judgment implied
 */
export const CERTAINTY_INDICATORS: Record<CertaintyLevel, string> = {
  certain: '●●●●',
  confident: '●●●○',
  leaning: '●●○○',
  uncertain: '●○○○',
  torn: '◐◐',
  forced: '⊗'
};

// ============================================================================
// DECISION STATE
// ============================================================================

/**
 * Decision state — Lifecycle of a decision
 * 
 * Descriptive, not prescriptive.
 * No state is "better" than another.
 */
export type DecisionState = 
  | 'emerging'        // Decision is forming but not yet made
  | 'crystallized'    // Decision has been made and recorded
  | 'active'          // Decision is guiding current actions
  | 'dormant'         // Decision exists but not currently relevant
  | 'revisited'       // Decision is being reconsidered
  | 'superseded'      // Decision replaced by another
  | 'dissolved';      // Decision no longer applies

/**
 * State descriptions
 */
export const DECISION_STATE_DESCRIPTIONS: Record<DecisionState, string> = {
  emerging: 'Forming but not yet crystallized',
  crystallized: 'Made and recorded',
  active: 'Currently guiding actions',
  dormant: 'Exists but not currently relevant',
  revisited: 'Being reconsidered',
  superseded: 'Replaced by another decision',
  dissolved: 'No longer applies'
};

// ============================================================================
// CONTEXT CAPTURED
// ============================================================================

/**
 * Decision context — What was true when the decision was made
 * 
 * This captures the decision-making moment WITHOUT judgment.
 * Context is factual, not evaluative.
 */
export interface DecisionContext {
  /** Active knowledge threads at decision time */
  active_threads: string[];
  
  /** Cognitive load state at decision time (optional) */
  cognitive_state?: {
    density: number;
    fragmentation: number;
    state: string;
  };
  
  /** Meanings that were considered */
  relevant_meanings: string[];
  
  /** Known constraints at the time */
  constraints: string[];
  
  /** What information was available */
  information_available: string[];
  
  /** What information was missing or uncertain */
  information_gaps: string[];
  
  /** External pressures present (time, social, etc.) */
  pressures: string[];
  
  /** Free-form context notes */
  notes?: string;
}

// ============================================================================
// ALTERNATIVES CONSIDERED
// ============================================================================

/**
 * Alternative considered — What else was on the table
 * 
 * Recording alternatives without comparison or ranking.
 * No "what if" speculation or regret framing.
 */
export interface AlternativeConsidered {
  /** Unique identifier */
  id: string;
  
  /** Brief description of the alternative */
  description: string;
  
  /** Why it was considered */
  reason_considered?: string;
  
  /** Why it wasn't chosen (human's own words) */
  reason_not_chosen?: string;
  
  /** Order it was considered (not importance) */
  consideration_order: number;
}

// ============================================================================
// DECISION CORE
// ============================================================================

/**
 * Decision entry — A crystallized decision
 * 
 * The heart of the Decision Crystallizer.
 * Records the decision-making moment with full context.
 */
export interface DecisionEntry {
  /** Unique identifier */
  id: string;
  
  /** Who made this decision */
  author: string;
  
  /** Author's display name */
  author_name: string;
  
  /** When the decision was crystallized */
  crystallized_at: string;
  
  /** When the decision was last updated */
  updated_at: string;
  
  // ---- DECISION CONTENT ----
  
  /** Brief title for the decision */
  title: string;
  
  /** The decision statement in human's own words */
  statement: string;
  
  /** Extended rationale (optional, never required) */
  rationale?: string;
  
  /** Nature of the decision */
  nature: DecisionNature;
  
  /** Self-reported certainty */
  certainty: CertaintyLevel;
  
  /** Current state */
  state: DecisionState;
  
  // ---- CONTEXT ----
  
  /** Context at decision time */
  context: DecisionContext;
  
  /** Alternatives that were considered */
  alternatives: AlternativeConsidered[];
  
  // ---- RELATIONSHIPS ----
  
  /** Linked entities (threads, meanings, agents, etc.) */
  linked_entities: DecisionLinkedEntity[];
  
  /** If this supersedes another decision */
  supersedes?: string;
  
  /** If this was superseded by another decision */
  superseded_by?: string;
  
  /** Related decisions (not parent/child, just related) */
  related_decisions: string[];
  
  // ---- REVISITATION ----
  
  /** Optional review reminder */
  review_reminder?: ReviewReminder;
  
  /** History of revisitations (if any) */
  revisitations: DecisionRevisitation[];
  
  // ---- METADATA ----
  
  /** User-defined tags */
  tags: string[];
  
  /** Sphere this decision primarily relates to */
  sphere?: string;
}

/**
 * Linked entity types for decisions
 */
export type DecisionLinkedEntityType = 
  | 'thread'
  | 'meaning'
  | 'agent'
  | 'snapshot'
  | 'document'
  | 'person'
  | 'project'
  | 'external';

/**
 * Linked entity reference
 */
export interface DecisionLinkedEntity {
  type: DecisionLinkedEntityType;
  id: string;
  label: string;
  relationship?: string;
}

/**
 * Review reminder configuration
 */
export interface ReviewReminder {
  /** When to remind */
  remind_at: string;
  
  /** What prompted setting this reminder */
  reason?: string;
  
  /** Has it been triggered? */
  triggered: boolean;
  
  /** If dismissed without action */
  dismissed?: boolean;
}

/**
 * Decision revisitation — When a decision was reconsidered
 * 
 * NO judgment of whether revisitation was "necessary" or "justified".
 * Simply records the act of reconsidering.
 */
export interface DecisionRevisitation {
  /** When revisitation occurred */
  revisited_at: string;
  
  /** Who revisited */
  revisited_by: string;
  
  /** Outcome of revisitation */
  outcome: 'reaffirmed' | 'modified' | 'superseded' | 'dissolved';
  
  /** Notes about the revisitation */
  notes?: string;
  
  /** What changed (if modified) */
  changes?: string;
  
  /** Link to superseding decision (if superseded) */
  superseding_decision?: string;
}

// ============================================================================
// EMERGING DECISION (PRE-CRYSTALLIZATION)
// ============================================================================

/**
 * Emerging decision — Decision in formation
 * 
 * A space for decisions that haven't crystallized yet.
 * NO pressure to crystallize. Some decisions stay emerging forever.
 */
export interface EmergingDecision {
  /** Unique identifier */
  id: string;
  
  /** Who is considering this */
  author: string;
  
  /** When it started emerging */
  emerged_at: string;
  
  /** Working title */
  working_title: string;
  
  /** Current thinking (informal) */
  current_thinking?: string;
  
  /** Tentative nature (can change) */
  tentative_nature?: DecisionNature;
  
  /** Options being considered */
  options: string[];
  
  /** Questions to resolve */
  open_questions: string[];
  
  /** Linked entities for context */
  linked_entities: DecisionLinkedEntity[];
  
  /** Has this crystallized? */
  crystallized: boolean;
  
  /** Link to crystallized decision (if crystallized) */
  crystallized_as?: string;
}

// ============================================================================
// DECISION FILTERS
// ============================================================================

/**
 * Filter configuration for decision lists
 */
export interface DecisionFilters {
  natures?: DecisionNature[];
  certainties?: CertaintyLevel[];
  states?: DecisionState[];
  spheres?: string[];
  tags?: string[];
  has_review_reminder?: boolean;
  search?: string;
  date_range?: {
    from?: string;
    to?: string;
  };
}

// ============================================================================
// DECISION DRIFT DETECTION
// ============================================================================

/**
 * Decision drift — When actions diverge from stated decisions
 * 
 * NOT a judgment. NOT a criticism.
 * Simply a visibility tool for potential misalignment.
 * 
 * The human decides what to do with this information.
 */
export interface DecisionDrift {
  /** The decision that may be drifting from */
  decision_id: string;
  
  /** When drift was detected */
  detected_at: string;
  
  /** What triggered the detection */
  trigger: DecisionDriftTrigger;
  
  /** Description of potential misalignment */
  description: string;
  
  /** Current status */
  status: 'unacknowledged' | 'acknowledged' | 'resolved' | 'dismissed';
  
  /** Human's response (if any) */
  response?: string;
}

/**
 * What triggered drift detection
 */
export type DecisionDriftTrigger = 
  | 'time_pattern'         // Actions over time suggest different direction
  | 'explicit_action'      // Specific action contradicts decision
  | 'agent_observation'    // Agent noticed potential misalignment
  | 'related_decision'     // New decision may conflict
  | 'meaning_conflict'     // Conflict with stated meaning
  | 'user_flagged';        // User flagged it themselves

// ============================================================================
// UI STATE
// ============================================================================

/**
 * Decision Crystallizer UI state
 */
export interface DecisionCrystallizerUIState {
  /** List view or detail view */
  view: 'list' | 'detail' | 'emerging' | 'create';
  
  /** Selected decision (if in detail view) */
  selected_decision_id?: string;
  
  /** Active filters */
  filters: DecisionFilters;
  
  /** Sort order */
  sort: DecisionSortOption;
  
  /** Expanded sections */
  expanded_sections: string[];
  
  /** Show emerging decisions */
  show_emerging: boolean;
  
  /** Show drift notices */
  show_drift_notices: boolean;
}

/**
 * Sort options for decisions
 */
export type DecisionSortOption = 
  | 'recent_first'
  | 'oldest_first'
  | 'by_nature'
  | 'by_certainty'
  | 'by_state'
  | 'alphabetical';

// ============================================================================
// CREATION FLOW
// ============================================================================

/**
 * Decision creation steps
 * 
 * Guided flow for crystallizing a decision.
 * Each step is optional except the statement.
 */
export type DecisionCreationStep = 
  | 'nature'          // What kind of decision is this?
  | 'statement'       // What is the decision? (REQUIRED)
  | 'certainty'       // How certain do you feel?
  | 'context'         // What context matters?
  | 'alternatives'    // What else was considered?
  | 'rationale'       // Why this choice? (optional)
  | 'links'           // What is this connected to?
  | 'review';         // Final review before crystallizing

/**
 * Creation form state
 */
export interface DecisionCreationState {
  step: DecisionCreationStep;
  
  // Values being entered
  nature?: DecisionNature;
  title: string;
  statement: string;
  certainty?: CertaintyLevel;
  rationale?: string;
  context: Partial<DecisionContext>;
  alternatives: Partial<AlternativeConsidered>[];
  linked_entities: DecisionLinkedEntity[];
  tags: string[];
  review_reminder?: Partial<ReviewReminder>;
  
  // UI state
  is_valid: boolean;
  errors: Record<string, string>;
}

// ============================================================================
// AGENT PERMISSIONS
// ============================================================================

/**
 * What agents CAN and CANNOT do with decisions
 * 
 * RESTRICTIVE by design. Decisions are human territory.
 */
export const AGENT_DECISION_PERMISSIONS = {
  /** What agents CAN do */
  CAN: [
    'read_decisions',                    // Read crystallized decisions
    'reference_in_suggestions',          // Reference decisions in suggestions
    'detect_potential_drift',            // Notice potential misalignment
    'surface_drift_gently',              // Show drift without judgment
    'suggest_review_timing',             // Suggest when to revisit
    'provide_context_when_asked',        // Help recall decision context
  ],
  
  /** What agents CANNOT do */
  CANNOT: [
    'create_decisions',                  // Decisions are human-only
    'modify_decisions',                  // Only humans can change
    'delete_decisions',                  // Only humans can remove
    'judge_decisions',                   // No evaluation
    'rank_decisions',                    // No ordering by "quality"
    'suggest_better_decisions',          // No optimization
    'compare_to_others',                 // No social comparison
    'predict_regret',                    // No regret framing
    'pressure_faster_decisions',         // No time pressure
    'invalidate_uncertainty',            // Uncertainty is valid
    'question_certainty_levels',         // Self-reported is final
  ]
} as const;

// ============================================================================
// PRIVACY SETTINGS
// ============================================================================

/**
 * Privacy configuration for decisions
 */
export interface DecisionPrivacySettings {
  /** Who can see decisions */
  visibility: 'private' | 'shared' | 'my_team';
  
  /** Allow agents to reference decisions */
  agent_readable: boolean;
  
  /** Allow drift detection */
  drift_detection_enabled: boolean;
  
  /** Include in snapshots */
  include_in_snapshots: boolean;
  
  /** Allow linking from other objects */
  allow_external_links: boolean;
  
  /** Export decisions */
  allow_export: boolean;
}

/**
 * Default privacy settings — Conservative by default
 */
export const DEFAULT_DECISION_PRIVACY: DecisionPrivacySettings = {
  visibility: 'private',
  agent_readable: true,
  drift_detection_enabled: true,
  include_in_snapshots: true,
  allow_external_links: true,
  allow_export: true
};

// ============================================================================
// ETHICAL CONSTRAINTS (ENFORCED)
// ============================================================================

/**
 * Ethical constraints for Decision Crystallizer
 * 
 * These are HARD CONSTRAINTS, not guidelines.
 */
export const DECISION_ETHICAL_CONSTRAINTS = {
  /** Forbidden features */
  FORBIDDEN: [
    'decision_quality_scoring',          // No scoring decisions
    'outcome_prediction',                // No predicting results
    'regret_probability',                // No regret framing
    'decision_speed_tracking',           // No pressure to decide faster
    'comparison_with_others',            // No social comparison
    'optimal_path_suggestion',           // No "best" suggestions
    'hindsight_analysis',                // No "should have" framing
    'consistency_scoring',               // No consistency pressure
    'rationality_evaluation',            // No rationality judgment
    'emotional_state_inference',         // No mood inference
  ],
  
  /** Required behaviors */
  REQUIRED: [
    'human_authored_only',               // Only humans create decisions
    'no_optimization_pressure',          // Never suggest optimizing
    'uncertainty_respected',             // Uncertainty is valid
    'all_natures_equal',                 // No nature is better
    'drift_without_judgment',            // Drift is noticed, not judged
    'context_preserved',                 // Context always captured
    'revisitation_neutral',              // Revisiting is normal
  ]
} as const;

// ============================================================================
// DESIGN TOKENS
// ============================================================================

/**
 * Visual design tokens for Decision Crystallizer
 * 
 * Crystalline aesthetic — clarity without harshness
 */
export const DECISION_DESIGN_TOKENS = {
  colors: {
    /** Primary crystalline blue */
    primary: '#6B8DD6',
    
    /** Nature-specific colors (all muted, equal weight) */
    nature: {
      commitment: '#8B7355',      // Warm brown — steadfast
      direction: '#6B8DD6',       // Blue — forward
      boundary: '#7A6B8D',        // Purple — definition
      priority: '#8DAA6B',        // Green — focus
      allocation: '#6B8D8D',      // Teal — distribution
      delegation: '#8D7A6B',      // Tan — handoff
      deferral: '#8B8B8B',        // Gray — pause
      acceptance: '#6B8D7A',      // Sage — peace
      release: '#A0A0A0',         // Light gray — letting go
      unknown: '#7A7A7A'          // Medium gray — undefined
    },
    
    /** Certainty colors (no judgment implied) */
    certainty: {
      certain: '#6B8DD6',
      confident: '#6B9DD6',
      leaning: '#8B9DAA',
      uncertain: '#9A9A9A',
      torn: '#AA8B9D',
      forced: '#AA8B7A'
    },
    
    /** State colors */
    state: {
      emerging: '#AAA06B',        // Amber — forming
      crystallized: '#6B8DD6',    // Blue — solid
      active: '#6BAA8D',          // Green — guiding
      dormant: '#8B8B8B',         // Gray — resting
      revisited: '#AA8D6B',       // Orange — reconsidering
      superseded: '#7A7A7A',      // Dim — replaced
      dissolved: '#A0A0A0'        // Faded — gone
    },
    
    /** Background */
    background: '#FAFCFF',
    
    /** Card surface */
    surface: '#FFFFFF',
    
    /** Text */
    text: {
      primary: '#2A3B4C',
      secondary: '#5A6B7C',
      muted: '#8A9BAC'
    },
    
    /** Borders */
    border: '#E8EEF4',
    borderHover: '#D0DCE8'
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  
  typography: {
    /** Decision title */
    title: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.3
    },
    /** Decision statement */
    statement: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.6
    },
    /** Metadata labels */
    label: {
      fontSize: '12px',
      fontWeight: 500,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em'
    },
    /** Body text */
    body: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5
    }
  },
  
  effects: {
    /** Crystalline shadow */
    cardShadow: '0 2px 8px rgba(107, 141, 214, 0.08)',
    cardShadowHover: '0 4px 16px rgba(107, 141, 214, 0.12)',
    
    /** Border radius */
    borderRadius: '8px',
    borderRadiusLg: '12px',
    
    /** Transitions */
    transition: 'all 0.2s ease'
  }
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  DecisionEntry,
  DecisionContext,
  AlternativeConsidered,
  DecisionLinkedEntity,
  DecisionRevisitation,
  ReviewReminder,
  EmergingDecision,
  DecisionFilters,
  DecisionDrift,
  DecisionCrystallizerUIState,
  DecisionCreationState,
  DecisionPrivacySettings
};
