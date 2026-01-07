/**
 * CHE·NU™ Universe View — Type Definitions
 * 
 * Universe View is the cognitive navigation layer of CHE·NU.
 * It integrates meta-objects (Threads, Snapshots, Decisions) visually
 * to make continuity, context, and responsibility visible at a glance.
 * 
 * Core Principles:
 * - NO hidden layers
 * - NO infinite depth without zoom
 * - NO implicit semantics
 * - EVERYTHING visible must be explainable
 * - EVERYTHING actionable must be reversible
 * 
 * @version 1.0.0
 * @module universe-view
 */

// ============================================================================
// VIEW STATE ENUMS
// ============================================================================

/**
 * Universe View has 4 base visual states
 */
export type ViewState = 'orbital' | 'focus' | 'thread_lens' | 'decision_focus';

/**
 * Zoom levels for semantic navigation
 * Zooming in = more semantic detail
 * Zooming out = more structural clarity
 */
export type ZoomLevel = 'universe' | 'sphere' | 'category' | 'item' | 'meta';

/**
 * Meta-object types that can be displayed
 */
export type MetaObjectType = 'thread' | 'snapshot' | 'decision';

/**
 * Agent aura intensity
 */
export type AuraIntensity = 'none' | 'subtle' | 'medium' | 'strong';

// ============================================================================
// SPHERE TYPES
// ============================================================================

/**
 * The 9 CHE·NU spheres
 */
export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'design_studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'my_team'
  | 'scholars';

export interface SphereNode {
  id: SphereId;
  name: string;
  icon: string;
  color: string;
  position: Position3D;
  size: number;
  activity_level: ActivityLevel;
  agent_count: number;
  meta_objects: {
    threads: number;
    snapshots: number;
    decisions: number;
  };
  is_focused: boolean;
  is_dimmed: boolean;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export type ActivityLevel = 'high' | 'medium' | 'low' | 'dormant';

// ============================================================================
// META OBJECT INTERFACES
// ============================================================================

/**
 * Base interface for all meta-objects in Universe View
 */
export interface MetaObjectBase {
  id: string;
  type: MetaObjectType;
  title: string;
  owner: string;
  created_at: string;
  last_activity: string;
  position: Position3D;
  is_visible: boolean;
  is_highlighted: boolean;
}

/**
 * Thread visual representation in Universe View
 * Represented as a soft, continuous luminous path
 */
export interface ThreadVisual extends MetaObjectBase {
  type: 'thread';
  path_points: Position3D[];
  thickness: number; // Based on activity level, NOT importance
  color: string; // Neutral, not priority-coded
  linked_entity_ids: string[];
  unresolved_count: number;
  sphere_coverage: SphereId[];
}

/**
 * Snapshot visual representation in Universe View
 * Represented as a temporal anchor marker (⦿)
 */
export interface SnapshotVisual extends MetaObjectBase {
  type: 'snapshot';
  capture_reason: string;
  scope: {
    spheres: SphereId[];
    agents: string[];
    ui_state: string;
  };
  is_active_view: boolean;
}

/**
 * Decision visual representation in Universe View
 * Represented as a crystal-like node with facets
 */
export interface DecisionVisual extends MetaObjectBase {
  type: 'decision';
  question: string;
  status: DecisionStatus;
  option_count: number;
  criteria_count: number;
  linked_snapshot_id?: string;
  downstream_tasks: string[];
  downstream_threads: string[];
  drift_status: DriftStatus;
}

export type DecisionStatus = 'pending' | 'crystallized' | 'superseded' | 'revisited';

export interface DriftStatus {
  has_drift: boolean;
  drift_level: 'none' | 'minor' | 'significant' | 'critical';
  changed_assumptions: string[];
  last_validated: string;
}

export type MetaObject = ThreadVisual | SnapshotVisual | DecisionVisual;

// ============================================================================
// AGENT PRESENCE
// ============================================================================

/**
 * Agent presence in Universe View
 * Visible as soft halos around influenced areas
 */
export interface AgentPresence {
  agent_id: string;
  agent_name: string;
  agent_icon: string;
  contract_id: string;
  position: Position3D;
  aura_radius: number;
  aura_intensity: AuraIntensity;
  aura_color: string;
  influenced_areas: string[];
  has_pending_suggestions: boolean;
  suggestions: AgentSuggestion[];
}

export interface AgentSuggestion {
  id: string;
  agent_id: string;
  suggestion_type: 'unresolved_thread' | 'outdated_snapshot' | 'decision_drift' | 'general';
  title: string;
  description: string;
  target_id?: string;
  target_type?: MetaObjectType;
  priority: 'info' | 'attention' | 'important';
  created_at: string;
  dismissed: boolean;
}

// ============================================================================
// VIEW STATE INTERFACES
// ============================================================================

/**
 * Complete Universe View state
 */
export interface UniverseViewState {
  view_state: ViewState;
  zoom_level: ZoomLevel;
  user_position: Position3D;
  camera_position: Position3D;
  camera_target: Position3D;
  
  // Spheres
  spheres: SphereNode[];
  focused_sphere?: SphereId;
  
  // Meta objects
  meta_objects: MetaObject[];
  active_thread?: string;
  active_snapshot?: string;
  active_decision?: string;
  
  // Agents
  agent_presences: AgentPresence[];
  
  // Visibility toggles
  visibility: VisibilityToggles;
  
  // UI state
  is_snapshot_mode: boolean;
  snapshot_label?: string;
  hovered_object?: HoveredObject;
  selected_object?: SelectedObject;
}

export interface VisibilityToggles {
  show_threads: boolean;
  show_snapshots: boolean;
  show_decisions: boolean;
  show_agent_auras: boolean;
  show_connections: boolean;
  reduced_density: boolean; // Cognitive load management
}

export interface HoveredObject {
  type: 'sphere' | 'thread' | 'snapshot' | 'decision' | 'agent';
  id: string;
  position: { x: number; y: number }; // Screen position for tooltip
}

export interface SelectedObject {
  type: 'sphere' | 'thread' | 'snapshot' | 'decision' | 'agent';
  id: string;
}

// ============================================================================
// ORBITAL STATE (DEFAULT)
// ============================================================================

/**
 * Configuration for orbital (default) state
 * User at center, spheres orbiting
 */
export interface OrbitalConfig {
  center: Position3D;
  orbit_radius: number;
  rotation_speed: number; // 0 = static
  sphere_scale: number;
  meta_indicator_size: number; // Dots, halos
  animation_enabled: boolean;
}

// ============================================================================
// FOCUS STATE
// ============================================================================

/**
 * Configuration for focus state
 * One sphere highlighted, others dimmed
 */
export interface FocusConfig {
  focused_sphere: SphereId;
  highlight_scale: number;
  dim_opacity: number;
  show_sphere_meta: boolean; // Show meta-objects contextualized to sphere
  transition_duration: number;
}

// ============================================================================
// THREAD LENS STATE
// ============================================================================

/**
 * Configuration for thread lens state
 * Only linked entities remain fully visible
 */
export interface ThreadLensConfig {
  thread_id: string;
  highlight_linked: boolean;
  fade_unlinked: boolean;
  fade_opacity: number;
  show_unresolved: boolean;
  show_path: boolean;
  path_animation: boolean;
}

// ============================================================================
// DECISION FOCUS STATE
// ============================================================================

/**
 * Configuration for decision focus state
 * Context Snapshot auto-loaded, downstream highlighted
 */
export interface DecisionFocusConfig {
  decision_id: string;
  auto_load_snapshot: boolean;
  highlight_downstream: boolean;
  show_drift_indicators: boolean;
  crystal_glow_intensity: number;
}

// ============================================================================
// NAVIGATION & INTERACTION
// ============================================================================

/**
 * Navigation action types
 */
export type NavigationAction =
  | { type: 'zoom_in' }
  | { type: 'zoom_out' }
  | { type: 'zoom_to_level'; level: ZoomLevel }
  | { type: 'focus_sphere'; sphere: SphereId }
  | { type: 'unfocus' }
  | { type: 'activate_thread_lens'; thread_id: string }
  | { type: 'deactivate_thread_lens' }
  | { type: 'focus_decision'; decision_id: string }
  | { type: 'unfocus_decision' }
  | { type: 'enter_snapshot_mode'; snapshot_id: string }
  | { type: 'exit_snapshot_mode' }
  | { type: 'pan'; delta: Position3D }
  | { type: 'rotate'; delta: { pitch: number; yaw: number } }
  | { type: 'reset_view' };

/**
 * User interaction events
 */
export interface InteractionEvent {
  type: 'hover' | 'click' | 'double_click' | 'right_click';
  target_type: 'sphere' | 'thread' | 'snapshot' | 'decision' | 'agent' | 'background';
  target_id?: string;
  position: { x: number; y: number };
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
  };
}

// ============================================================================
// TOOLTIP & OVERLAY CONTENT
// ============================================================================

/**
 * Tooltip content for hovered objects
 */
export interface TooltipContent {
  type: 'sphere' | 'thread' | 'snapshot' | 'decision' | 'agent';
  title: string;
  subtitle?: string;
  details: TooltipDetail[];
  actions?: TooltipAction[];
}

export interface TooltipDetail {
  label: string;
  value: string;
  icon?: string;
}

export interface TooltipAction {
  id: string;
  label: string;
  icon?: string;
  action: string;
}

// ============================================================================
// SNAPSHOT MODE
// ============================================================================

/**
 * Snapshot mode state (view-only)
 */
export interface SnapshotModeState {
  is_active: boolean;
  snapshot_id: string;
  snapshot_title: string;
  capture_date: string;
  capture_reason: string;
  frozen_state: UniverseViewState;
  original_state: UniverseViewState;
}

// ============================================================================
// ANIMATION & TRANSITIONS
// ============================================================================

export interface TransitionConfig {
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay: number;
}

export interface ViewTransition {
  from_state: ViewState;
  to_state: ViewState;
  config: TransitionConfig;
  in_progress: boolean;
  progress: number; // 0 to 1
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

export interface AccessibilityConfig {
  reduce_motion: boolean;
  high_contrast: boolean;
  screen_reader_mode: boolean;
  keyboard_navigation: boolean;
  focus_indicators: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const SPHERE_META: Record<SphereId, { name: string; icon: string; color: string }> = {
  personal: { name: 'Personal', icon: '🏠', color: '#4A90D9' },
  business: { name: 'Business', icon: '💼', color: '#D4AF37' },
  government: { name: 'Government', icon: '🏛️', color: '#8B4513' },
  studio: { name: 'Creative Studio', icon: '🎨', color: '#9B59B6' },
  community: { name: 'Community', icon: '👥', color: '#27AE60' },
  social: { name: 'Social & Media', icon: '📱', color: '#E74C3C' },
  entertainment: { name: 'Entertainment', icon: '🎬', color: '#F39C12' },
  my_team: { name: 'My Team', icon: '🤝', color: '#3498DB' },
  scholar: { name: 'Scholar', icon: '📚', color: '#1ABC9C' },
};

export const VIEW_STATE_META: Record<ViewState, { name: string; description: string }> = {
  orbital: {
    name: 'Orbital View',
    description: 'Default view with user at center and spheres orbiting',
  },
  focus: {
    name: 'Sphere Focus',
    description: 'One sphere highlighted, others dimmed',
  },
  thread_lens: {
    name: 'Thread Lens',
    description: 'Knowledge Thread activated, linked entities highlighted',
  },
  decision_focus: {
    name: 'Decision Focus',
    description: 'Decision selected with context and consequences visible',
  },
};

export const ZOOM_LEVEL_META: Record<ZoomLevel, { name: string; shows: string[]; hides: string[] }> = {
  universe: {
    name: 'Universe',
    shows: ['All spheres', 'Global connections'],
    hides: ['Item details', 'Meta objects'],
  },
  sphere: {
    name: 'Sphere',
    shows: ['Sphere structure', 'Categories'],
    hides: ['Individual items'],
  },
  category: {
    name: 'Category',
    shows: ['Category contents', 'Item groups'],
    hides: ['Item internals'],
  },
  item: {
    name: 'Item',
    shows: ['Item details', 'Connections'],
    hides: ['Meta layer'],
  },
  meta: {
    name: 'Meta',
    shows: ['Threads', 'Snapshots', 'Decisions'],
    hides: ['Raw item detail'],
  },
};

export const DRIFT_LEVEL_META: Record<DriftStatus['drift_level'], { label: string; color: string; icon: string }> = {
  none: { label: 'No drift', color: '#27AE60', icon: '✓' },
  minor: { label: 'Minor changes', color: '#F39C12', icon: '⚬' },
  significant: { label: 'Significant changes', color: '#E67E22', icon: '⚠' },
  critical: { label: 'Context changed significantly', color: '#E74C3C', icon: '⚠️' },
};

export const DEFAULT_VISIBILITY: VisibilityToggles = {
  show_threads: true,
  show_snapshots: true,
  show_decisions: true,
  show_agent_auras: true,
  show_connections: true,
  reduced_density: false,
};

export const DEFAULT_ORBITAL_CONFIG: OrbitalConfig = {
  center: { x: 0, y: 0, z: 0 },
  orbit_radius: 300,
  rotation_speed: 0, // Static by default
  sphere_scale: 1,
  meta_indicator_size: 8,
  animation_enabled: true,
};

export const DEFAULT_TRANSITION: TransitionConfig = {
  duration: 400,
  easing: 'ease-in-out',
  delay: 0,
};

export const DEFAULT_ACCESSIBILITY: AccessibilityConfig = {
  reduce_motion: false,
  high_contrast: false,
  screen_reader_mode: false,
  keyboard_navigation: true,
  focus_indicators: true,
};

// ============================================================================
// DESIGN SYSTEM COLORS
// ============================================================================

export const UNIVERSE_COLORS = {
  // Background
  void: '#0A0A0B',
  deepSpace: '#0D0D0E',
  
  // Primary
  sacredGold: '#D4AF37',
  starlight: '#FAF9F6',
  
  // Spheres (gradient bases)
  sphereGlow: 'rgba(212, 175, 55, 0.2)',
  sphereCore: 'rgba(212, 175, 55, 0.8)',
  
  // Meta objects
  threadPath: 'rgba(64, 224, 208, 0.4)', // Cenote turquoise
  snapshotAnchor: '#8B7355', // Ancient stone
  decisionCrystal: '#D4AF37', // Sacred gold
  
  // Agent auras
  agentAura: 'rgba(64, 224, 208, 0.15)',
  
  // States
  highlighted: '#D4AF37',
  dimmed: 'rgba(250, 249, 246, 0.2)',
  focused: '#40E0D0',
  
  // Drift indicators
  driftWarning: '#E67E22',
  driftCritical: '#E74C3C',
  
  // UI
  tooltipBg: 'rgba(30, 31, 34, 0.95)',
  tooltipBorder: 'rgba(212, 175, 55, 0.3)',
};
