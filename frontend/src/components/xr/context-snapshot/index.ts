/**
 * CHE·NU™ V51 Meta-Layer
 * Context Snapshot V1.0 — Module Exports
 * 
 * PURPOSE:
 * Captures the "where you were" moment for genuine return.
 * Enables resumption without loss of mental context.
 * 
 * CORE PRINCIPLE:
 * Snapshots are CAPTURES, not records.
 * The system preserves state, never surveils.
 * 
 * ETHICAL STANCE:
 * - No automatic surveillance
 * - No pattern analysis
 * - No productivity tracking
 * - No behavior profiling
 * - User-initiated only
 * - Transparent triggers
 * - Always deletable
 * - Privacy respecting
 * 
 * © 2025 CHE·NU™ — Governed Intelligence Operating System
 */

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Core types
  ContextSnapshot,
  SnapshotTrigger,
  SnapshotState,
  
  // Captured elements
  CapturedThread,
  CapturedAgent,
  CapturedNavigation,
  CapturedOpenItems,
  CapturedCognitiveState,
  ContextNotes,
  
  // Restoration
  SnapshotRestoration,
  
  // Configuration
  CaptureConfig,
  RestoreOptions,
  QuickCapture,
  RetentionSettings,
  
  // Automation
  SnapshotAutomationSettings,
  
  // Privacy
  SnapshotPrivacySettings,
  
  // Agent restrictions
  SnapshotAgentPermissions,
  
  // Ethical constraints
  SnapshotEthicalConstraints,
  
  // UI State
  SnapshotFilters,
  ContextSnapshotUIState,
  CaptureFlowState,
  RestoreFlowState,
  CaptureStep
} from './context-snapshot.types';

// ============================================================================
// CONSTANTS
// ============================================================================

export {
  // Labels
  SNAPSHOT_TRIGGER_LABELS,
  SNAPSHOT_STATE_LABELS,
  CAPTURE_STEP_LABELS,
  
  // Defaults
  DEFAULT_CAPTURE_CONFIG,
  DEFAULT_RESTORE_OPTIONS,
  DEFAULT_AUTOMATION_SETTINGS,
  DEFAULT_SNAPSHOT_PRIVACY,
  
  // Agent restrictions
  SNAPSHOT_AGENT_PERMISSIONS,
  SNAPSHOT_AGENT_CANNOT,
  
  // Ethical constraints
  SNAPSHOT_ETHICAL_CONSTRAINTS,
  
  // Design tokens
  SNAPSHOT_DESIGN_TOKENS
} from './context-snapshot.types';

// ============================================================================
// COMPONENTS
// ============================================================================

export {
  // Main component
  default as ContextSnapshot,
  ContextSnapshot as ContextSnapshotComponent,
  
  // Subcomponents
  SnapshotList,
  SnapshotCard,
  SnapshotView,
  SnapshotCapture,
  SnapshotRestore,
  QuickCapturePanel,
  
  // Display components
  TriggerBadge,
  StateIndicator
} from './ContextSnapshot';

// ============================================================================
// HOOKS
// ============================================================================

export {
  // List management
  useSnapshots,
  
  // Single snapshot operations
  useSnapshot,
  
  // Capture flow
  useSnapshotCapture,
  
  // Restore flow
  useSnapshotRestore,
  
  // Quick capture
  useQuickCapture,
  
  // Automation
  useSnapshotAutomation,
  
  // Privacy
  useSnapshotPrivacy,
  
  // UI state
  useContextSnapshotUI,
  
  // Search
  useSnapshotSearch,
  
  // Suggestions
  useSnapshotSuggestions
} from './hooks';

// Export hook types
export type {
  UseSnapshotsOptions,
  UseSnapshotsReturn,
  UseSnapshotReturn,
  UseSnapshotCaptureReturn,
  UseSnapshotRestoreReturn,
  UseQuickCaptureReturn,
  UseSnapshotAutomationReturn,
  UseSnapshotPrivacyReturn,
  UseContextSnapshotUIReturn,
  UseSnapshotSearchReturn,
  UseSnapshotSuggestionsReturn,
  CaptureSuggestion
} from './hooks';

// ============================================================================
// MODULE METADATA
// ============================================================================

/**
 * Context Snapshot module metadata
 * For registry and integration purposes
 */
export const CONTEXT_SNAPSHOT_MODULE = {
  name: 'Context Snapshot',
  version: '1.0.0',
  status: 'active',
  sphere: 'meta-layer',
  
  purpose: 'Captures the "where you were" moment for genuine return',
  
  principles: [
    'Snapshots are CAPTURES, not records',
    'System preserves state, never surveils',
    'User-initiated, transparent, always deletable'
  ],
  
  components: [
    'ContextSnapshot',
    'SnapshotList',
    'SnapshotCard',
    'SnapshotView',
    'SnapshotCapture',
    'SnapshotRestore',
    'QuickCapturePanel'
  ],
  
  hooks: [
    'useSnapshots',
    'useSnapshot',
    'useSnapshotCapture',
    'useSnapshotRestore',
    'useQuickCapture',
    'useSnapshotAutomation',
    'useSnapshotPrivacy',
    'useContextSnapshotUI',
    'useSnapshotSearch',
    'useSnapshotSuggestions'
  ],
  
  dependencies: [
    'cognitive-load-regulator' // For optional cognitive state capture
  ],
  
  ethicalConstraints: [
    'No automatic surveillance',
    'No pattern analysis',
    'No productivity tracking',
    'No behavior profiling',
    'No cross-user comparison',
    'No attention monitoring',
    'No forced/hidden capture',
    'No sentiment analysis'
  ],
  
  agentRestrictions: {
    canDo: [
      'Read snapshots (if agent_readable)',
      'Suggest capture timing',
      'Reference context in assistance',
      'Assist with restoration',
      'Remind about capture notes'
    ],
    cannotDo: [
      'Create snapshots without user initiation',
      'Delete snapshots',
      'Analyze patterns across snapshots',
      'Compare snapshots',
      'Infer productivity',
      'Track behavior',
      'Force or hide capture',
      'Access without permission'
    ]
  }
} as const;
