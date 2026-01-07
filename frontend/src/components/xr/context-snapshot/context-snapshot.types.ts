/**
 * CHE·NU™ V51 Meta-Layer
 * Context Snapshot V1.0 — Types
 * 
 * PURPOSE:
 * Captures the "where you were" moment for genuine return.
 * Enables resumption without loss of mental context.
 * 
 * CORE PRINCIPLE:
 * Snapshots are CAPTURES, not records.
 * The system preserves state, never surveils.
 * 
 * WHAT THIS IS:
 * - A mental state capture tool
 * - A context preservation system
 * - A resumption enabler
 * - A cognitive bookmark
 * 
 * WHAT THIS IS NOT:
 * - A surveillance system
 * - A productivity tracker
 * - A behavior recorder
 * - A pattern analyzer
 * - An attention monitor
 * 
 * ETHICAL CONSTRAINTS:
 * - User-initiated only (no auto-capture without consent)
 * - No analysis of snapshot patterns
 * - No comparison between snapshots
 * - No productivity inference
 * - Deletable at any time
 * - Not used for profiling
 * 
 * © 2025 CHE·NU™ — Governed Intelligence Operating System
 */

// ============================================================================
// SNAPSHOT TRIGGER
// ============================================================================

/**
 * What initiated the snapshot
 * 
 * Transparency about why a snapshot exists.
 */
export type SnapshotTrigger = 
  | 'manual'            // User explicitly requested
  | 'scheduled'         // User-configured schedule
  | 'suggested'         // System suggested, user accepted
  | 'sphere_switch'     // Captured on sphere transition (if enabled)
  | 'session_end'       // End of session (if enabled)
  | 'before_break'      // User taking a break
  | 'high_volatility';  // Cognitive load suggested (user accepted)

/**
 * Labels for triggers
 */
export const SNAPSHOT_TRIGGER_LABELS: Record<SnapshotTrigger, string> = {
  manual: 'Manual',
  scheduled: 'Scheduled',
  suggested: 'Suggested',
  sphere_switch: 'Sphere Switch',
  session_end: 'Session End',
  before_break: 'Taking Break',
  high_volatility: 'High Context Change'
};

// ============================================================================
// SNAPSHOT STATE
// ============================================================================

/**
 * Lifecycle state of a snapshot
 */
export type SnapshotState = 
  | 'active'      // Recent, readily available
  | 'archived'    // Older, still accessible
  | 'restored'    // Has been restored at least once
  | 'expired';    // Past retention period (if set)

// ============================================================================
// CAPTURED CONTEXT ELEMENTS
// ============================================================================

/**
 * Active thread state at capture time
 */
export interface CapturedThread {
  thread_id: string;
  title: string;
  phase: string;
  last_interaction?: string;
  notes?: string;
}

/**
 * Active agent state at capture time
 */
export interface CapturedAgent {
  agent_id: string;
  agent_name: string;
  current_task?: string;
  status: 'active' | 'waiting' | 'paused';
}

/**
 * Current navigation state
 */
export interface CapturedNavigation {
  current_sphere: string;
  current_view: string;
  current_path: string[];
  scroll_position?: number;
  expanded_sections?: string[];
}

/**
 * Open items at capture time
 */
export interface CapturedOpenItems {
  open_threads: string[];
  open_documents: string[];
  open_decisions: string[];
  open_meetings: string[];
  pinned_items: string[];
}

/**
 * Cognitive state at capture time (if enabled)
 */
export interface CapturedCognitiveState {
  load_state?: string;
  density?: number;
  fragmentation?: number;
  factors?: string[];
}

/**
 * User-provided context notes
 */
export interface ContextNotes {
  /** What was I doing? */
  current_focus?: string;
  
  /** What was I about to do? */
  next_intention?: string;
  
  /** What should I remember? */
  important_context?: string;
  
  /** Free-form notes */
  additional_notes?: string;
}

// ============================================================================
// CONTEXT SNAPSHOT CORE
// ============================================================================

/**
 * Context Snapshot — A captured moment of mental state
 */
export interface ContextSnapshot {
  /** Unique identifier */
  id: string;
  
  /** Who created this snapshot */
  created_by: string;
  
  /** When captured */
  captured_at: string;
  
  /** What triggered the capture */
  trigger: SnapshotTrigger;
  
  /** Current state */
  state: SnapshotState;
  
  /** User-provided title (optional) */
  title?: string;
  
  // ---- CAPTURED ELEMENTS ----
  
  /** Active threads */
  threads: CapturedThread[];
  
  /** Active agents */
  agents: CapturedAgent[];
  
  /** Navigation state */
  navigation: CapturedNavigation;
  
  /** Open items */
  open_items: CapturedOpenItems;
  
  /** Cognitive state (if enabled) */
  cognitive_state?: CapturedCognitiveState;
  
  /** Active decisions at time */
  active_decisions: string[];
  
  /** Active meanings at time */
  active_meanings: string[];
  
  // ---- USER CONTEXT ----
  
  /** User-provided notes */
  notes: ContextNotes;
  
  // ---- METADATA ----
  
  /** User-defined tags */
  tags: string[];
  
  /** Sphere this was captured in */
  sphere: string;
  
  /** Restoration history */
  restorations: SnapshotRestoration[];
  
  /** Retention settings */
  retention?: RetentionSettings;
}

/**
 * Record of when snapshot was restored
 */
export interface SnapshotRestoration {
  restored_at: string;
  restored_by: string;
  partial: boolean;
  elements_restored: string[];
  notes?: string;
}

/**
 * Retention settings for snapshot
 */
export interface RetentionSettings {
  /** Auto-expire after this date */
  expires_at?: string;
  
  /** Keep indefinitely */
  keep_forever: boolean;
  
  /** Auto-archive after days */
  archive_after_days?: number;
}

// ============================================================================
// SNAPSHOT CAPTURE CONFIG
// ============================================================================

/**
 * What elements to capture
 */
export interface CaptureConfig {
  /** Capture active threads */
  capture_threads: boolean;
  
  /** Capture active agents */
  capture_agents: boolean;
  
  /** Capture navigation state */
  capture_navigation: boolean;
  
  /** Capture open items */
  capture_open_items: boolean;
  
  /** Capture cognitive state (requires permission) */
  capture_cognitive: boolean;
  
  /** Capture active decisions */
  capture_decisions: boolean;
  
  /** Capture active meanings */
  capture_meanings: boolean;
  
  /** Prompt for notes */
  prompt_for_notes: boolean;
}

/**
 * Default capture configuration — Comprehensive by default
 */
export const DEFAULT_CAPTURE_CONFIG: CaptureConfig = {
  capture_threads: true,
  capture_agents: true,
  capture_navigation: true,
  capture_open_items: true,
  capture_cognitive: false, // Requires explicit enable
  capture_decisions: true,
  capture_meanings: true,
  prompt_for_notes: true
};

// ============================================================================
// RESTORATION OPTIONS
// ============================================================================

/**
 * What to restore from a snapshot
 */
export interface RestoreOptions {
  /** Restore navigation state */
  restore_navigation: boolean;
  
  /** Reopen threads */
  restore_threads: boolean;
  
  /** Reactivate agents */
  restore_agents: boolean;
  
  /** Reopen items */
  restore_open_items: boolean;
  
  /** Show notes reminder */
  show_notes: boolean;
  
  /** Navigate to sphere */
  navigate_to_sphere: boolean;
}

/**
 * Default restore options — User chooses
 */
export const DEFAULT_RESTORE_OPTIONS: RestoreOptions = {
  restore_navigation: true,
  restore_threads: true,
  restore_agents: false, // Agents may have changed
  restore_open_items: true,
  show_notes: true,
  navigate_to_sphere: true
};

// ============================================================================
// QUICK CAPTURE (MINIMAL)
// ============================================================================

/**
 * Quick capture — Minimal snapshot for fast saves
 */
export interface QuickCapture {
  id: string;
  captured_at: string;
  sphere: string;
  current_focus?: string;
  next_intention?: string;
  thread_ids: string[];
  navigation_path: string[];
}

// ============================================================================
// SNAPSHOT FILTERS
// ============================================================================

/**
 * Filter configuration for snapshot lists
 */
export interface SnapshotFilters {
  triggers?: SnapshotTrigger[];
  states?: SnapshotState[];
  spheres?: string[];
  tags?: string[];
  has_notes?: boolean;
  date_range?: {
    from?: string;
    to?: string;
  };
  search?: string;
}

// ============================================================================
// UI STATE
// ============================================================================

/**
 * Context Snapshot UI state
 */
export interface ContextSnapshotUIState {
  /** Current view */
  view: 'list' | 'detail' | 'capture' | 'restore';
  
  /** Selected snapshot */
  selected_snapshot_id?: string;
  
  /** Active filters */
  filters: SnapshotFilters;
  
  /** Sort order */
  sort: 'recent_first' | 'oldest_first' | 'by_sphere';
  
  /** Capture in progress */
  capturing: boolean;
  
  /** Restore in progress */
  restoring: boolean;
  
  /** Show quick capture UI */
  show_quick_capture: boolean;
}

// ============================================================================
// CAPTURE FLOW STATE
// ============================================================================

/**
 * State during snapshot capture
 */
export interface CaptureFlowState {
  /** Current step */
  step: 'config' | 'notes' | 'review' | 'capturing' | 'complete';
  
  /** Capture configuration */
  config: CaptureConfig;
  
  /** User notes being entered */
  notes: Partial<ContextNotes>;
  
  /** Optional title */
  title?: string;
  
  /** Tags to apply */
  tags: string[];
  
  /** Retention settings */
  retention?: RetentionSettings;
  
  /** Progress (0-100) */
  progress: number;
  
  /** Any errors */
  error?: string;
}

// ============================================================================
// RESTORE FLOW STATE
// ============================================================================

/**
 * State during snapshot restoration
 */
export interface RestoreFlowState {
  /** Snapshot being restored */
  snapshot_id: string;
  
  /** Current step */
  step: 'options' | 'restoring' | 'complete';
  
  /** Restore options */
  options: RestoreOptions;
  
  /** Progress (0-100) */
  progress: number;
  
  /** What was restored */
  restored_elements: string[];
  
  /** Any errors */
  error?: string;
}

// ============================================================================
// AUTOMATION SETTINGS
// ============================================================================

/**
 * Automated snapshot settings (user-controlled)
 */
export interface SnapshotAutomationSettings {
  /** Auto-capture on sphere switch */
  on_sphere_switch: boolean;
  
  /** Auto-capture on session end */
  on_session_end: boolean;
  
  /** Auto-capture on break */
  on_break: boolean;
  
  /** Offer capture on high volatility */
  suggest_on_volatility: boolean;
  
  /** Scheduled captures */
  scheduled: {
    enabled: boolean;
    interval_hours?: number;
    times?: string[]; // Specific times like "09:00", "17:00"
  };
  
  /** Default retention for automated captures */
  default_retention: Partial<RetentionSettings>;
}

/**
 * Default automation — Conservative, user-controlled
 */
export const DEFAULT_AUTOMATION_SETTINGS: SnapshotAutomationSettings = {
  on_sphere_switch: false,
  on_session_end: false,
  on_break: true,
  suggest_on_volatility: true,
  scheduled: {
    enabled: false
  },
  default_retention: {
    keep_forever: false,
    archive_after_days: 30
  }
};

// ============================================================================
// AGENT PERMISSIONS
// ============================================================================

/**
 * What agents CAN and CANNOT do with snapshots
 */
export const AGENT_SNAPSHOT_PERMISSIONS = {
  /** What agents CAN do */
  CAN: [
    'read_snapshots',                    // Read user's snapshots
    'suggest_capture',                   // Suggest taking a snapshot
    'reference_context',                 // Use snapshot context in suggestions
    'assist_restoration',                // Help restore context
    'remind_about_notes',                // Remind user to check notes
  ],
  
  /** What agents CANNOT do */
  CANNOT: [
    'create_snapshots',                  // Only user creates
    'delete_snapshots',                  // Only user deletes
    'analyze_patterns',                  // No pattern analysis
    'compare_snapshots',                 // No comparison
    'infer_productivity',                // No productivity inference
    'track_behavior',                    // No behavior tracking
    'force_capture',                     // Cannot auto-capture without consent
    'access_without_permission',         // Requires user permission
  ]
} as const;

// ============================================================================
// PRIVACY SETTINGS
// ============================================================================

/**
 * Privacy configuration for snapshots
 */
export interface SnapshotPrivacySettings {
  /** Who can see snapshots */
  visibility: 'private' | 'shared';
  
  /** Allow agent access */
  agent_readable: boolean;
  
  /** Include in exports */
  include_in_exports: boolean;
  
  /** Link to cognitive load data */
  link_cognitive_data: boolean;
  
  /** Auto-expire old snapshots */
  auto_expire: boolean;
  
  /** Days until auto-expire */
  expire_after_days: number;
}

/**
 * Default privacy — Private and ephemeral by default
 */
export const DEFAULT_SNAPSHOT_PRIVACY: SnapshotPrivacySettings = {
  visibility: 'private',
  agent_readable: true,
  include_in_exports: true,
  link_cognitive_data: false, // Opt-in
  auto_expire: true,
  expire_after_days: 90
};

// ============================================================================
// ETHICAL CONSTRAINTS (ENFORCED)
// ============================================================================

/**
 * Ethical constraints for Context Snapshots
 */
export const SNAPSHOT_ETHICAL_CONSTRAINTS = {
  /** Forbidden features */
  FORBIDDEN: [
    'automatic_surveillance',            // No surveillance
    'pattern_analysis',                  // No pattern analysis
    'productivity_tracking',             // No productivity tracking
    'behavior_profiling',                // No behavior profiling
    'cross_user_comparison',             // No comparing users
    'attention_monitoring',              // No attention monitoring
    'forced_capture',                    // No forced captures
    'hidden_capture',                    // No hidden captures
    'sentiment_analysis',                // No mood tracking
  ],
  
  /** Required behaviors */
  REQUIRED: [
    'user_initiated',                    // User controls capture
    'transparent_trigger',               // Always show why captured
    'deletable',                         // Always deletable
    'no_judgment',                       // No evaluation of content
    'privacy_respecting',                // Respect privacy settings
    'consent_required',                  // Consent for automation
  ]
} as const;

// ============================================================================
// DESIGN TOKENS
// ============================================================================

/**
 * Visual design tokens for Context Snapshot
 * 
 * Warm amber aesthetic — preservation, memory, return
 */
export const SNAPSHOT_DESIGN_TOKENS = {
  colors: {
    /** Primary amber */
    primary: '#D4A574',
    
    /** Trigger-specific colors */
    trigger: {
      manual: '#D4A574',           // Amber — intentional
      scheduled: '#A5B4C4',        // Cool gray — routine
      suggested: '#94B49F',        // Sage — helpful
      sphere_switch: '#B4A5C4',    // Lavender — transition
      session_end: '#C4A5A5',      // Rose — closure
      before_break: '#A5C4B4',     // Mint — pause
      high_volatility: '#C4B4A5'   // Tan — adaptive
    },
    
    /** State colors */
    state: {
      active: '#D4A574',           // Amber — available
      archived: '#A5A5A5',         // Gray — stored
      restored: '#94B49F',         // Sage — used
      expired: '#C4A5A5'           // Rose — past
    },
    
    /** Background */
    background: '#FFFAF5',
    
    /** Card surface */
    surface: '#FFFFFF',
    
    /** Text */
    text: {
      primary: '#3D3529',
      secondary: '#6B5D4D',
      muted: '#9A8A7A'
    },
    
    /** Borders */
    border: '#EDE5DB',
    borderHover: '#DDD0C0'
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
    /** Snapshot title */
    title: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.3
    },
    /** Context notes */
    notes: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
      fontStyle: 'italic' as const
    },
    /** Metadata labels */
    label: {
      fontSize: '11px',
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
    /** Warm shadow */
    cardShadow: '0 2px 8px rgba(212, 165, 116, 0.08)',
    cardShadowHover: '0 4px 16px rgba(212, 165, 116, 0.12)',
    
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
  ContextSnapshot,
  CapturedThread,
  CapturedAgent,
  CapturedNavigation,
  CapturedOpenItems,
  CapturedCognitiveState,
  ContextNotes,
  SnapshotRestoration,
  RetentionSettings,
  CaptureConfig,
  RestoreOptions,
  QuickCapture,
  SnapshotFilters,
  ContextSnapshotUIState,
  CaptureFlowState,
  RestoreFlowState,
  SnapshotAutomationSettings,
  SnapshotPrivacySettings
};
