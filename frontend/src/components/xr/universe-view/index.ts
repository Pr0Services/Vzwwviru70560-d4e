/**
 * CHE·NU™ Universe View Module
 * 
 * The cognitive navigation layer of CHE·NU.
 * Integrates meta-objects (Threads, Snapshots, Decisions) visually
 * to make continuity, context, and responsibility visible at a glance.
 * 
 * Core Principles:
 * - NO hidden layers
 * - NO infinite depth without zoom
 * - NO implicit semantics
 * - EVERYTHING visible must be explainable
 * - EVERYTHING actionable must be reversible
 * 
 * States:
 * - ORBITAL (default): User at center, spheres orbiting
 * - FOCUS: One sphere highlighted, others dimmed
 * - THREAD_LENS: Knowledge Thread activated
 * - DECISION_FOCUS: Decision with context and consequences
 * 
 * Non-Goals:
 * - NOT a dashboard
 * - NOT a productivity tracker
 * - NOT a control panel
 * - NOT a gamified space
 * 
 * It is: A cognitive map.
 * 
 * @version 1.0.0
 * @module universe-view
 */

// ============================================================================
// TYPES
// ============================================================================

export type {
  // View states
  ViewState,
  ZoomLevel,
  MetaObjectType,
  AuraIntensity,
  
  // Sphere types
  SphereId,
  SphereNode,
  Position3D,
  ActivityLevel,
  
  // Meta object interfaces
  MetaObjectBase,
  ThreadVisual,
  SnapshotVisual,
  DecisionVisual,
  MetaObject,
  DecisionStatus,
  DriftStatus,
  
  // Agent presence
  AgentPresence,
  AgentSuggestion,
  
  // View state interfaces
  UniverseViewState,
  VisibilityToggles,
  HoveredObject,
  SelectedObject,
  
  // Configuration
  OrbitalConfig,
  FocusConfig,
  ThreadLensConfig,
  DecisionFocusConfig,
  
  // Navigation
  NavigationAction,
  InteractionEvent,
  
  // Tooltip
  TooltipContent,
  TooltipDetail,
  TooltipAction,
  
  // Snapshot mode
  SnapshotModeState,
  
  // Animation
  TransitionConfig,
  ViewTransition,
  
  // Accessibility
  AccessibilityConfig,
} from './universe-view.types';

// Export constants
export {
  SPHERE_META,
  VIEW_STATE_META,
  ZOOM_LEVEL_META,
  DRIFT_LEVEL_META,
  DEFAULT_VISIBILITY,
  DEFAULT_ORBITAL_CONFIG,
  DEFAULT_TRANSITION,
  DEFAULT_ACCESSIBILITY,
  UNIVERSE_COLORS,
} from './universe-view.types';

// ============================================================================
// COMPONENTS
// ============================================================================

export { UniverseView } from './UniverseView';
export type { UniverseViewProps } from './UniverseView';

// ============================================================================
// HOOKS
// ============================================================================

export {
  useUniverseNavigation,
  useVisibilityToggles,
  useMetaObjects,
  useAgentPresences,
  useSnapshotMode,
  useKeyboardNavigation,
  useSphereLayout,
  useHoverState,
  useAccessibility,
} from './hooks';

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

import { UniverseView } from './UniverseView';
export default UniverseView;
