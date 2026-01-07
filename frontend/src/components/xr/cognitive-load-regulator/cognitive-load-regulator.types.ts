/**
 * CHE·NU™ Cognitive Load Regulator — Type Definitions
 * 
 * Makes mental overload VISIBLE, EXPLICIT, and RESPECTED —
 * without optimization pressure or behavioral manipulation.
 * 
 * Core principle: The system adapts to the human.
 *                 The human never adapts to the system.
 * 
 * Position: Mega-Tree → Meta Layer → Cognitive Load Regulator
 * 
 * @module cognitive-load-regulator
 * @version 1.0.0
 */

// ============================================================================
// Load Dimensions
// ============================================================================

/**
 * Multi-axis load representation
 * Load is a SHAPE, not a rank
 */
export interface LoadDimensions {
  /** How much is active at once (0-100) */
  density: number;
  
  /** How scattered context is (0-100) */
  fragmentation: number;
  
  /** Unresolved meaning or decisions (0-100) */
  ambiguity: number;
  
  /** How fast context is changing (0-100) */
  volatility: number;
  
  /** Number of owned decisions (0-100) */
  responsibility_weight: number;
}

/**
 * Descriptive load state labels (not judgmental)
 */
export type LoadState = 
  | 'clear'        // Minimal active complexity
  | 'focused'      // Single main context
  | 'dense'        // Many active elements
  | 'fragmented'   // Scattered across contexts
  | 'saturated'    // Near capacity
  | 'unstable';    // Rapid context changes

/**
 * Trend direction for load changes
 */
export type LoadTrend = 'decreasing' | 'stable' | 'increasing';

// ============================================================================
// Contributing Factors
// ============================================================================

/**
 * Types of factors that contribute to load
 */
export type ContributingFactorType = 
  | 'active_threads'
  | 'unresolved_decisions'
  | 'decision_drift'
  | 'concurrent_agents'
  | 'navigation_depth'
  | 'context_switches'
  | 'meaning_conflicts'
  | 'snapshot_frequency'
  | 'task_ambiguity'
  | 'pending_approvals';

/**
 * Individual factor contributing to load
 */
export interface ContributingFactor {
  /** Type of factor */
  type: ContributingFactorType;
  
  /** Human-readable label */
  label: string;
  
  /** Current value */
  value: number;
  
  /** Typical/baseline value */
  baseline: number;
  
  /** How much this contributes to overall load */
  contribution: number;
  
  /** Explanation of why this contributes */
  explanation: string;
  
  /** Link to the contributing items */
  items?: {
    id: string;
    name: string;
    type: string;
  }[];
}

// ============================================================================
// Load State
// ============================================================================

/**
 * Complete load state snapshot
 */
export interface CognitiveLoadState {
  /** Unique identifier for this state */
  id: string;
  
  /** When this state was measured */
  timestamp: string;
  
  /** Multi-axis dimensions */
  dimensions: LoadDimensions;
  
  /** Descriptive state */
  state: LoadState;
  
  /** Trend direction */
  trend: LoadTrend;
  
  /** Contributing factors */
  factors: ContributingFactor[];
  
  /** Session identifier */
  session_id: string;
}

/**
 * Historical load data point
 */
export interface LoadHistoryPoint {
  timestamp: string;
  state: LoadState;
  dimensions: LoadDimensions;
}

// ============================================================================
// UI State
// ============================================================================

/**
 * Visual indicator position
 */
export type IndicatorPosition = 
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Visual intensity of the indicator
 */
export type IndicatorIntensity = 
  | 'minimal'   // Nearly invisible
  | 'subtle'    // Barely noticeable
  | 'present'   // Visible but not distracting
  | 'prominent'; // More visible (never intrusive)

/**
 * Regulator UI state
 */
export interface RegulatorUIState {
  /** Whether indicator is visible */
  visible: boolean;
  
  /** Position on screen */
  position: IndicatorPosition;
  
  /** Current intensity */
  intensity: IndicatorIntensity;
  
  /** Whether breakdown view is expanded */
  expanded: boolean;
  
  /** Whether animations are paused */
  animations_paused: boolean;
  
  /** User preference: hide permanently */
  permanently_hidden: boolean;
}

// ============================================================================
// Adaptation Responses
// ============================================================================

/**
 * System adaptations based on load
 */
export interface SystemAdaptation {
  /** Type of adaptation */
  type: 'fade_meta' | 'slow_animations' | 'reduce_density' | 'simplify_view';
  
  /** Whether currently active */
  active: boolean;
  
  /** Description of what changes */
  description: string;
  
  /** Note: NO functionality is removed */
  functionality_preserved: true;
}

/**
 * Suggestion the regulator might offer
 */
export interface LoadSuggestion {
  /** Type of suggestion */
  type: 'pause' | 'snapshot' | 'reduce_scope' | 'continue';
  
  /** Human-readable suggestion */
  text: string;
  
  /** Optional action callback */
  action?: () => void;
  
  /** Whether user has dismissed */
  dismissed: boolean;
}

// ============================================================================
// Agent Interaction
// ============================================================================

/**
 * Rules for how agents interact with load regulator
 */
export interface AgentLoadRules {
  /** Agent may read current load state */
  can_read_state: boolean;
  
  /** Agent may reference load in suggestions */
  can_reference: boolean;
  
  /** Agent may suggest pausing or snapshots */
  can_suggest_pause: boolean;
  
  /** Agent may NOT escalate urgency based on load */
  cannot_escalate: true;
  
  /** Agent may NOT override user intent */
  cannot_override: true;
  
  /** Agent may NOT change behavior without permission */
  cannot_change_behavior: true;
}

/**
 * Example agent phrasing templates
 */
export const AGENT_LOAD_PHRASINGS = {
  dense_context: "Current context is dense. Would you like to reduce scope or continue?",
  high_fragmentation: "Your attention seems scattered across many areas. Would a snapshot help?",
  high_volatility: "Things are changing quickly. Would you like to pause and take stock?",
  suggestion_optional: "This is just an observation — you can continue as you prefer.",
} as const;

// ============================================================================
// Privacy & Data
// ============================================================================

/**
 * Privacy settings for load data
 */
export interface LoadPrivacySettings {
  /** Load states are ephemeral */
  ephemeral: boolean;
  
  /** No long-term profiling */
  no_profiling: boolean;
  
  /** Only linked to snapshots if user opts in */
  snapshot_linkage: 'disabled' | 'opt-in';
  
  /** User can disable permanently */
  can_disable: boolean;
  
  /** No historical judgment */
  no_historical_judgment: boolean;
}

// ============================================================================
// Integration Points
// ============================================================================

/**
 * Integration with other modules
 */
export interface ModuleIntegration {
  /** Knowledge Threads: highlights excessive parallel threads */
  knowledge_threads: {
    track_parallel_count: boolean;
    highlight_excessive: boolean;
  };
  
  /** Context Snapshots: suggested when volatility is high */
  context_snapshots: {
    suggest_on_high_volatility: boolean;
  };
  
  /** Decision Crystallizer: flags decisions made under high ambiguity */
  decision_crystallizer: {
    flag_high_ambiguity: boolean;
  };
  
  /** Meaning Layer: highlights conflicts increasing load */
  meaning_layer: {
    track_conflicts: boolean;
  };
  
  /** Agent Contracts: agents must respect load visibility rules */
  agent_contracts: {
    enforce_load_rules: boolean;
  };
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Load state metadata
 */
export const LOAD_STATE_META: Record<LoadState, {
  label: string;
  description: string;
  color: string;
  icon: string;
}> = {
  clear: {
    label: 'Clear',
    description: 'Minimal active complexity',
    color: '#10B981',
    icon: '○',
  },
  focused: {
    label: 'Focused',
    description: 'Single main context',
    color: '#3B82F6',
    icon: '◎',
  },
  dense: {
    label: 'Dense',
    description: 'Many active elements',
    color: '#F59E0B',
    icon: '◉',
  },
  fragmented: {
    label: 'Fragmented',
    description: 'Scattered across contexts',
    color: '#8B5CF6',
    icon: '⊕',
  },
  saturated: {
    label: 'Saturated',
    description: 'Near capacity',
    color: '#EF4444',
    icon: '●',
  },
  unstable: {
    label: 'Unstable',
    description: 'Rapid context changes',
    color: '#EC4899',
    icon: '◐',
  },
};

/**
 * Contributing factor metadata
 */
export const FACTOR_META: Record<ContributingFactorType, {
  label: string;
  description: string;
  weight: number;
}> = {
  active_threads: {
    label: 'Active Threads',
    description: 'Number of open knowledge threads',
    weight: 1.2,
  },
  unresolved_decisions: {
    label: 'Unresolved Decisions',
    description: 'Pending decisions awaiting action',
    weight: 1.5,
  },
  decision_drift: {
    label: 'Decision Drift',
    description: 'Decisions that may need revisiting',
    weight: 1.0,
  },
  concurrent_agents: {
    label: 'Active Agents',
    description: 'Agents currently requesting attention',
    weight: 0.8,
  },
  navigation_depth: {
    label: 'Navigation Depth',
    description: 'Current zoom/drill-down level',
    weight: 0.5,
  },
  context_switches: {
    label: 'Context Switches',
    description: 'Recent changes between contexts',
    weight: 1.3,
  },
  meaning_conflicts: {
    label: 'Meaning Conflicts',
    description: 'Potential conflicts with stated meaning',
    weight: 1.4,
  },
  snapshot_frequency: {
    label: 'Snapshot Frequency',
    description: 'Rate of context preservation',
    weight: 0.6,
  },
  task_ambiguity: {
    label: 'Task Ambiguity',
    description: 'Unclear or undefined tasks',
    weight: 1.2,
  },
  pending_approvals: {
    label: 'Pending Approvals',
    description: 'Items awaiting your approval',
    weight: 1.0,
  },
};

/**
 * Design colors for regulator
 */
export const REGULATOR_COLORS = {
  // State colors
  clear: '#10B981',
  focused: '#3B82F6',
  dense: '#F59E0B',
  fragmented: '#8B5CF6',
  saturated: '#EF4444',
  unstable: '#EC4899',
  
  // UI colors
  background: 'rgba(10, 10, 15, 0.95)',
  border: 'rgba(255, 255, 255, 0.1)',
  text: '#E8E6E3',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  
  // Indicator
  indicatorBg: 'rgba(20, 20, 30, 0.8)',
  indicatorBorder: 'rgba(255, 255, 255, 0.15)',
};

/**
 * Default privacy settings
 */
export const DEFAULT_PRIVACY_SETTINGS: LoadPrivacySettings = {
  ephemeral: true,
  no_profiling: true,
  snapshot_linkage: 'disabled',
  can_disable: true,
  no_historical_judgment: true,
};

/**
 * Default agent rules
 */
export const DEFAULT_AGENT_LOAD_RULES: AgentLoadRules = {
  can_read_state: true,
  can_reference: true,
  can_suggest_pause: true,
  cannot_escalate: true,
  cannot_override: true,
  cannot_change_behavior: true,
};

/**
 * Default module integration settings
 */
export const DEFAULT_MODULE_INTEGRATION: ModuleIntegration = {
  knowledge_threads: {
    track_parallel_count: true,
    highlight_excessive: true,
  },
  context_snapshots: {
    suggest_on_high_volatility: true,
  },
  decision_crystallizer: {
    flag_high_ambiguity: true,
  },
  meaning_layer: {
    track_conflicts: true,
  },
  agent_contracts: {
    enforce_load_rules: true,
  },
};

/**
 * Ethical constraints for cognitive load regulator
 */
export const LOAD_ETHICAL_CONSTRAINTS = {
  // What regulator does NOT do
  no_nudging: true,
  no_guilt_framing: true,
  no_productivity_pressure: true,
  no_engagement_optimization: true,
  no_dark_patterns: true,
  no_biometric_data: true,
  no_emotional_inference: true,
  no_behavioral_scoring: true,
  
  // What regulator is NOT
  not_focus_timer: true,
  not_wellness_tracker: true,
  not_productivity_optimizer: true,
  not_burnout_detector: true,
  not_behavioral_control: true,
  
  // What regulator provides
  provides_visibility: true,
  provides_explanation: true,
  provides_user_control: true,
  
  // Core principle
  tells_what_is_happening: true,
  never_tells_what_to_do: true,
};

/**
 * Thresholds for state determination
 */
export const LOAD_THRESHOLDS = {
  clear: { max: 20 },
  focused: { max: 40 },
  dense: { max: 60 },
  fragmented: { max: 75 },
  saturated: { max: 90 },
  unstable: { volatility_min: 70 },
};
