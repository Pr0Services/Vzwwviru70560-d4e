/**
 * CHE·NU™ Meaning Layer — Type Definitions
 * 
 * Meaning Layer captures and preserves the human WHY behind
 * actions, structures, and decisions.
 * 
 * Core principle: Meaning is DECLARED, never inferred.
 * 
 * Position: Mega-Tree → Meta Layer → Meaning Layer
 * 
 * @module meaning-layer
 * @version 1.0.0
 */

// ============================================================================
// Core Enums
// ============================================================================

/**
 * Types of meaning entries
 * Non-hierarchical, non-exhaustive
 */
export type MeaningType = 
  | 'purpose'      // "Why this exists"
  | 'value'        // "What matters here"
  | 'intention'    // "What I am trying to do"
  | 'belief'       // "What I assume to be true"
  | 'commitment';  // "What I choose to stand by"

/**
 * Visibility scope of meaning
 */
export type MeaningScope = 
  | 'personal'  // Only visible to author
  | 'shared'    // Visible to selected people
  | 'my_team';     // Visible to entire team

/**
 * Stability indicator for meaning
 */
export type MeaningStability = 
  | 'temporary'    // Short-term, experimental
  | 'evolving'     // In development, may change
  | 'foundational'; // Core, unlikely to change

/**
 * State of a meaning entry
 */
export type MeaningState = 
  | 'active'     // Currently relevant
  | 'dormant'    // Not currently active, but preserved
  | 'superseded' // Replaced by newer meaning
  | 'obsolete';  // No longer applicable

/**
 * Types of entities that can be linked to meaning
 */
export type LinkedEntityType = 
  | 'thread'
  | 'decision'
  | 'snapshot'
  | 'sphere'
  | 'project'
  | 'task'
  | 'agent'
  | 'goal'
  | 'document'
  | 'relationship'
  | 'custom';

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Reference to an entity linked to meaning
 */
export interface LinkedEntity {
  /** Type of entity */
  entity_type: LinkedEntityType;
  
  /** Unique identifier of the entity */
  entity_id: string;
  
  /** Display name for the entity */
  entity_name: string;
  
  /** When this link was created */
  linked_at: string;
  
  /** Optional note about why this link exists */
  link_reason?: string;
}

/**
 * Optional reminder to review meaning
 */
export interface ReviewReminder {
  /** Whether reminder is enabled */
  enabled: boolean;
  
  /** Frequency of reminder */
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  
  /** Next scheduled review */
  next_review?: string;
  
  /** Last time meaning was reviewed */
  last_reviewed?: string;
}

/**
 * Record of meaning evolution
 */
export interface MeaningRevision {
  /** Revision number */
  revision: number;
  
  /** When this revision was created */
  timestamp: string;
  
  /** Previous statement */
  previous_statement: string;
  
  /** New statement */
  new_statement: string;
  
  /** Reason for change */
  change_reason?: string;
}

/**
 * Main Meaning Entry structure
 * Human-authored, never auto-generated
 */
export interface MeaningEntry {
  /** Unique identifier */
  id: string;
  
  /** Human author (never system) */
  author: string;
  
  /** Author's display name */
  author_name: string;
  
  /** When created */
  created_at: string;
  
  /** When last modified */
  updated_at: string;
  
  /** Optional title for quick reference */
  title?: string;
  
  /** The meaning statement itself (free-form, human language) */
  statement: string;
  
  /** Type of meaning */
  type: MeaningType;
  
  /** Entities this meaning applies to */
  linked_entities: LinkedEntity[];
  
  /** Visibility scope */
  scope: MeaningScope;
  
  /** Stability indicator */
  stability: MeaningStability;
  
  /** Current state */
  state: MeaningState;
  
  /** Review reminder settings */
  review_reminder: ReviewReminder;
  
  /** Revision history */
  revisions: MeaningRevision[];
  
  /** If superseded, ID of the replacement */
  superseded_by?: string;
  
  /** Optional tags for organization */
  tags?: string[];
}

/**
 * Summary of meaning entry for list views
 */
export interface MeaningSummary {
  id: string;
  title?: string;
  statement: string;
  type: MeaningType;
  scope: MeaningScope;
  stability: MeaningStability;
  state: MeaningState;
  linked_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Creation & Editing
// ============================================================================

/**
 * Form data for creating a new meaning entry
 */
export interface MeaningCreationForm {
  title?: string;
  statement: string;
  type: MeaningType;
  scope: MeaningScope;
  stability: MeaningStability;
  linked_entities: LinkedEntity[];
  review_reminder: ReviewReminder;
  tags?: string[];
}

/**
 * Context for prompting meaning creation
 * Used when agents suggest adding meaning
 */
export interface MeaningPromptContext {
  /** Entity that triggered the prompt */
  trigger_entity: LinkedEntity;
  
  /** Why meaning might be valuable here */
  prompt_reason: string;
  
  /** Suggested meaning type */
  suggested_type?: MeaningType;
  
  /** Whether user has dismissed this prompt */
  dismissed?: boolean;
}

// ============================================================================
// Conflict Detection
// ============================================================================

/**
 * Detected conflict between meaning and action
 */
export interface MeaningConflict {
  /** Unique identifier */
  id: string;
  
  /** The meaning entry in question */
  meaning_id: string;
  
  /** The meaning statement */
  meaning_statement: string;
  
  /** The conflicting entity */
  conflicting_entity: LinkedEntity;
  
  /** Description of the conflict */
  conflict_description: string;
  
  /** When detected */
  detected_at: string;
  
  /** Severity: informational or significant */
  severity: 'informational' | 'significant';
  
  /** Whether user has acknowledged */
  acknowledged: boolean;
  
  /** User's response to the conflict */
  user_response?: 'accept_conflict' | 'modify_meaning' | 'modify_action' | 'dismiss';
}

// ============================================================================
// Agent Interaction
// ============================================================================

/**
 * Rules for how agents interact with meaning
 */
export interface AgentMeaningRules {
  /** Agent may read meaning entries */
  can_read: boolean;
  
  /** Agent may reference meaning in suggestions */
  can_reference: boolean;
  
  /** Agent may warn about misalignment */
  can_warn_misalignment: boolean;
  
  /** Agent may NOT create meaning */
  cannot_create: true;
  
  /** Agent may NOT edit meaning */
  cannot_edit: true;
  
  /** Agent may NOT rank meaning */
  cannot_rank: true;
  
  /** Agent may NOT optimize meaning */
  cannot_optimize: true;
}

/**
 * Agent suggestion related to meaning
 */
export interface AgentMeaningSuggestion {
  /** The relevant meaning entry */
  meaning_id: string;
  
  /** What the agent is suggesting */
  suggestion_type: 'may_conflict' | 'consider_reviewing' | 'relevant_to_decision';
  
  /** Agent's explanation */
  explanation: string;
  
  /** Phrasing must be respectful, not prescriptive */
  phrasing: string;
}

// ============================================================================
// Visualization
// ============================================================================

/**
 * Visual representation of meaning in Universe View
 */
export interface MeaningVisual {
  /** The meaning entry */
  meaning_id: string;
  
  /** Visual form: subtle halo or annotation */
  visual_form: 'halo' | 'annotation' | 'connection_line';
  
  /** Color based on type */
  color: string;
  
  /** Opacity (always subtle) */
  opacity: number;
  
  /** Whether currently visible */
  visible: boolean;
  
  /** Position relative to linked entity */
  position: { x: number; y: number };
}

/**
 * Meaning layer toggle state
 */
export interface MeaningLayerState {
  /** Whether layer is visible */
  visible: boolean;
  
  /** Which types are shown */
  visible_types: MeaningType[];
  
  /** Which scopes are shown */
  visible_scopes: MeaningScope[];
  
  /** Hover state */
  hovered_meaning_id: string | null;
  
  /** Selected state */
  selected_meaning_id: string | null;
}

// ============================================================================
// Reflection View
// ============================================================================

/**
 * Dedicated view for meaning reflection
 */
export interface MeaningReflectionView {
  /** All meaning entries by type */
  by_type: Record<MeaningType, MeaningSummary[]>;
  
  /** Meaning needing review */
  needs_review: MeaningSummary[];
  
  /** Recently created */
  recent: MeaningSummary[];
  
  /** Foundational meanings */
  foundational: MeaningSummary[];
  
  /** Active conflicts */
  conflicts: MeaningConflict[];
  
  /** Evolution timeline */
  evolution_timeline: {
    date: string;
    event: 'created' | 'revised' | 'superseded' | 'obsoleted';
    meaning_id: string;
    summary: string;
  }[];
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Metadata for meaning types
 */
export const MEANING_TYPE_META: Record<MeaningType, {
  label: string;
  description: string;
  prompt: string;
  color: string;
  icon: string;
}> = {
  purpose: {
    label: 'Purpose',
    description: 'Why this exists',
    prompt: 'What is the purpose of this?',
    color: '#D4AF37', // Sacred Gold
    icon: '◎',
  },
  value: {
    label: 'Value',
    description: 'What matters here',
    prompt: 'What matters most about this?',
    color: '#9B59B6', // Nebula Purple
    icon: '◇',
  },
  intention: {
    label: 'Intention',
    description: 'What I am trying to do',
    prompt: 'What are you trying to accomplish?',
    color: '#40E0D0', // Cenote Turquoise
    icon: '→',
  },
  belief: {
    label: 'Belief',
    description: 'What I assume to be true',
    prompt: 'What do you believe about this?',
    color: '#00FF88', // Aurora Green
    icon: '∴',
  },
  commitment: {
    label: 'Commitment',
    description: 'What I choose to stand by',
    prompt: 'What are you committed to here?',
    color: '#FF6B35', // Plasma Orange
    icon: '⚓',
  },
};

/**
 * Metadata for meaning scopes
 */
export const MEANING_SCOPE_META: Record<MeaningScope, {
  label: string;
  description: string;
  icon: string;
}> = {
  personal: {
    label: 'Personal',
    description: 'Only visible to you',
    icon: '👤',
  },
  shared: {
    label: 'Shared',
    description: 'Visible to selected people',
    icon: '👥',
  },
  team: {
    label: 'Team',
    description: 'Visible to entire team',
    icon: '🏢',
  },
};

/**
 * Metadata for stability levels
 */
export const MEANING_STABILITY_META: Record<MeaningStability, {
  label: string;
  description: string;
  color: string;
}> = {
  temporary: {
    label: 'Temporary',
    description: 'Short-term, experimental',
    color: '#6B7280',
  },
  evolving: {
    label: 'Evolving',
    description: 'In development, may change',
    color: '#F59E0B',
  },
  foundational: {
    label: 'Foundational',
    description: 'Core, unlikely to change',
    color: '#10B981',
  },
};

/**
 * Metadata for meaning states
 */
export const MEANING_STATE_META: Record<MeaningState, {
  label: string;
  description: string;
  color: string;
}> = {
  active: {
    label: 'Active',
    description: 'Currently relevant and guiding',
    color: '#10B981',
  },
  dormant: {
    label: 'Dormant',
    description: 'Not currently active, but preserved',
    color: '#6B7280',
  },
  superseded: {
    label: 'Superseded',
    description: 'Replaced by newer meaning',
    color: '#F59E0B',
  },
  obsolete: {
    label: 'Obsolete',
    description: 'No longer applicable',
    color: '#EF4444',
  },
};

/**
 * Design colors for Meaning Layer
 */
export const MEANING_COLORS = {
  // Background
  layerBackground: 'rgba(212, 175, 55, 0.05)', // Subtle gold
  
  // Type colors
  purpose: '#D4AF37',
  value: '#9B59B6',
  intention: '#40E0D0',
  belief: '#00FF88',
  commitment: '#FF6B35',
  
  // State colors
  active: '#10B981',
  dormant: '#6B7280',
  superseded: '#F59E0B',
  obsolete: '#EF4444',
  
  // Conflict
  conflictWarning: '#F59E0B',
  conflictSignificant: '#EF4444',
  
  // UI
  border: 'rgba(212, 175, 55, 0.3)',
  hoverBackground: 'rgba(212, 175, 55, 0.1)',
  selectedBorder: '#D4AF37',
};

/**
 * Default agent meaning rules
 */
export const DEFAULT_AGENT_MEANING_RULES: AgentMeaningRules = {
  can_read: true,
  can_reference: true,
  can_warn_misalignment: true,
  cannot_create: true,
  cannot_edit: true,
  cannot_rank: true,
  cannot_optimize: true,
};

/**
 * Default review reminder
 */
export const DEFAULT_REVIEW_REMINDER: ReviewReminder = {
  enabled: false,
  frequency: 'quarterly',
};

/**
 * Ethical constraints for meaning layer
 */
export const MEANING_ETHICAL_CONSTRAINTS = {
  // What meaning layer does NOT do
  no_persuasion: true,
  no_emotional_scoring: true,
  no_sentiment_analysis_for_control: true,
  no_optimization: true,
  no_ranking: true,
  no_coaching: true,
  no_therapy: true,
  no_performance_evaluation: true,
  no_belief_enforcement: true,
  no_moral_framework: true,
  
  // What meaning layer provides
  provides_space: true,
  provides_reflection: true,
  provides_traceability: true,
  provides_visibility: true,
  
  // Core principle
  meaning_is_declared_never_inferred: true,
};
