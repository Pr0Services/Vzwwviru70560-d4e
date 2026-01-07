/**
 * CHE·NU™ XR META ROOM — TYPE DEFINITIONS
 * 
 * XR Meta Room is a spatial environment for reflection, alignment,
 * and high-level sense-making. NOT for execution, productivity, or performance.
 * 
 * It exists to answer:
 * → "What am I doing?"
 * → "Why am I doing it?"
 * → "Does this still make sense?"
 * 
 * XR Meta Room is the calm center of CHE·NU.
 * 
 * @version 1.0
 * @status V51-ready
 * @constraint ADDITIVE ONLY (NO REFACTOR)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SPATIAL PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 3D position in XR space
 * Using right-handed coordinate system (Y-up)
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Rotation in XR space (Euler angles in radians)
 */
export interface Rotation3 {
  pitch: number;  // X-axis rotation
  yaw: number;    // Y-axis rotation
  roll: number;   // Z-axis rotation
}

/**
 * Quaternion for smooth rotations
 */
export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 * Spatial transform
 */
export interface Transform {
  position: Vector3;
  rotation: Rotation3 | Quaternion;
  scale: Vector3;
}

/**
 * Bounding volume for spatial objects
 */
export interface BoundingVolume {
  center: Vector3;
  radius: number;  // Spherical bounds for simplicity
  extents?: Vector3;  // Optional box bounds
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOM CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Room entry sources
 * System must NEVER force entry
 */
export type RoomEntrySource =
  | 'explicit_request'        // User explicitly asked
  | 'reflection_session'      // During reflection
  | 'decision_review'         // Reviewing major decisions
  | 'overload_resolution'     // Resolving cognitive overload
  | 'snapshot_replay'         // Entering from snapshot
  | 'universe_view';          // From Universe View XR entry

/**
 * Room ambient state
 * Affects environmental feel, not functionality
 */
export type RoomAmbience =
  | 'clear'       // Open, light
  | 'calm'        // Settled, peaceful
  | 'focused'     // Slightly concentrated
  | 'dense'       // More present, weighted
  | 'reflective'; // Contemplative

/**
 * Room configuration
 */
export interface RoomConfig {
  // Ambient
  ambience: RoomAmbience;
  light_level: number;           // 0-1, affects visibility
  sound_dampening: number;       // 0-1, environmental audio
  
  // Movement
  movement_speed: number;        // Always slow in XR Meta Room
  gesture_sensitivity: number;   // 0-1
  
  // Visual
  object_opacity: number;        // 0-1, for meta objects
  boundary_visibility: number;   // 0-1, for agent boundaries
  thread_glow_intensity: number; // 0-1
  
  // Interaction
  allow_edits: boolean;          // Default: false
  show_agents: boolean;          // Default: only if invited
  
  // Privacy
  record_session: boolean;       // Default: false
}

/**
 * Default room configuration
 */
export const DEFAULT_ROOM_CONFIG: RoomConfig = {
  ambience: 'calm',
  light_level: 0.7,
  sound_dampening: 0.5,
  movement_speed: 0.3,  // Always slow
  gesture_sensitivity: 0.5,
  object_opacity: 0.85,
  boundary_visibility: 0.4,
  thread_glow_intensity: 0.3,
  allow_edits: false,
  show_agents: false,
  record_session: false,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPATIAL ZONES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Spatial zone types (non-hierarchical)
 */
export type ZoneType =
  | 'center'            // User presence
  | 'thread_field'      // Floating semantic paths
  | 'decision_anchors'  // Crystalline nodes
  | 'snapshot_markers'  // Temporal pillars
  | 'meaning_halo'      // Ambient layer
  | 'load_field'        // Environmental density
  | 'agent_boundaries'; // Subtle perimeter outlines

/**
 * Spatial zone definition
 */
export interface SpatialZone {
  id: string;
  type: ZoneType;
  bounds: BoundingVolume;
  
  // Visual
  color_primary: string;     // Soft, non-urgent
  color_secondary: string;
  opacity: number;
  
  // Behavior
  interactive: boolean;
  enter_callback?: string;   // Event name
  exit_callback?: string;
  
  // Content
  contains: ZoneContent[];
}

/**
 * Content within a zone
 */
export interface ZoneContent {
  id: string;
  type: 'thread' | 'decision' | 'snapshot' | 'meaning' | 'load' | 'agent' | 'boundary';
  entity_id: string;  // Reference to actual entity
  position: Vector3;
  visual_state: VisualState;
}

/**
 * Visual state for objects
 */
export interface VisualState {
  opacity: number;
  glow: number;
  scale: number;
  animation?: AnimationState;
}

/**
 * Animation state (always calm, never urgent)
 */
export interface AnimationState {
  type: 'float' | 'pulse' | 'rotate' | 'breathe' | 'none';
  speed: number;      // Always slow
  amplitude: number;  // Always subtle
}

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE THREADS — XR REPRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Thread XR representation
 * Threads appear as soft, continuous spatial paths
 */
export interface XRThread {
  id: string;
  thread_id: string;       // Reference to Knowledge Thread
  title: string;
  phase: string;           // From Knowledge Threads
  
  // Spatial path (series of points forming the thread)
  path: Vector3[];
  thickness: number;       // Based on activity
  
  // Visual
  color: string;           // Soft, non-competing
  glow_intensity: number;
  opacity: number;
  
  // Linked elements along the thread
  linked_elements: XRLinkedElement[];
  
  // Unresolved segments (dimmer, dotted)
  unresolved_segments: ThreadSegment[];
  
  // Interaction
  walkable: boolean;       // User can walk along
  pausable: boolean;       // Can pause at linked elements
}

/**
 * Linked element on a thread
 */
export interface XRLinkedElement {
  id: string;
  position_on_thread: number;  // 0-1 along path
  position: Vector3;
  entity_type: 'decision' | 'snapshot' | 'meaning' | 'note' | 'document';
  entity_id: string;
  preview_text?: string;
}

/**
 * Thread segment (for unresolved parts)
 */
export interface ThreadSegment {
  start: number;  // 0-1 along path
  end: number;
  state: 'unresolved' | 'emerging' | 'paused';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECISIONS — XR REPRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Decision XR representation
 * Decisions appear as suspended crystal forms
 */
export interface XRDecision {
  id: string;
  decision_id: string;     // Reference to crystallized decision
  title: string;
  nature: string;          // From Decision Crystallizer
  
  // Spatial
  position: Vector3;
  rotation: Rotation3;     // Orientation shows selected path
  
  // Crystal form
  facet_count: number;           // Based on options/criteria count
  facets: XRDecisionFacet[];
  selected_facet_index: number;  // Which path was chosen
  
  // Visual
  crystal_color: string;
  refraction: number;      // Light behavior
  clarity: number;         // Based on certainty
  
  // Linked context
  linked_snapshot_id?: string;
  downstream_decisions: string[];
  
  // Interaction
  inspectable: boolean;
  editable: boolean;       // Default: false
}

/**
 * Decision facet (option/criterion)
 */
export interface XRDecisionFacet {
  index: number;
  label: string;
  type: 'option' | 'criterion' | 'consequence';
  orientation: Vector3;    // Direction this facet faces
  brightness: number;      // Selected facet is brighter
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT SNAPSHOTS — XR REPRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Snapshot XR representation
 * Snapshots appear as temporal anchors or light columns
 */
export interface XRSnapshot {
  id: string;
  snapshot_id: string;     // Reference to Context Snapshot
  title: string;
  captured_at: string;     // ISO timestamp
  trigger: string;         // From Context Snapshot
  
  // Spatial
  position: Vector3;
  height: number;          // Column height
  radius: number;          // Column radius
  
  // Visual
  column_color: string;
  light_intensity: number;
  particle_density: number;  // Soft particles rising
  
  // Preview
  preview_threads: string[];
  preview_decisions: string[];
  context_notes?: string;
  
  // Interaction
  enterable: boolean;      // Can enter snapshot mode
  exit_instant: boolean;   // Always true - user can exit instantly
}

/**
 * Snapshot mode state
 * When entering a snapshot, room temporarily reconfigures
 */
export interface SnapshotModeState {
  active: boolean;
  snapshot_id: string | null;
  original_room_state: RoomState | null;
  label_visible: boolean;  // Always clearly labeled
  time_entered: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEANING LAYER — XR REPRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Meaning XR representation
 * Meaning is ambient, not objectified
 * Appears as subtle light, gentle text fragments, atmospheric tone
 */
export interface XRMeaning {
  id: string;
  meaning_id: string;      // Reference to Meaning Layer entry
  purpose_domain: string;  // From Meaning Layer
  
  // Ambient representation (NOT an object)
  representation: MeaningRepresentation;
  
  // Position (where in space this meaning is most present)
  influence_center: Vector3;
  influence_radius: number;
  
  // Meaning never competes with objects - it frames them
  layer: 'background' | 'ambient' | 'subtle_foreground';
}

/**
 * How meaning manifests in space
 */
export interface MeaningRepresentation {
  type: 'light' | 'text' | 'tone' | 'atmosphere';
  
  // For light
  light_color?: string;
  light_intensity?: number;
  light_softness?: number;
  
  // For text fragments
  text_content?: string;
  text_opacity?: number;
  text_float?: boolean;
  
  // For tone/atmosphere
  ambient_hue?: string;
  ambient_saturation?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COGNITIVE LOAD — XR REPRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cognitive Load XR representation
 * Load is environmental - no alerts, no warnings, only perception
 */
export interface XRCognitiveLoad {
  // Current state
  load_state: LoadXRState;
  
  // Environmental effects
  air_density: number;         // 0-1, affects visual fog
  movement_resistance: number; // 0-1, affects navigation speed
  sound_dampening: number;     // 0-1, affects ambient audio
  
  // Visual effects
  visual_density: number;      // How "full" space feels
  color_temperature: number;   // Warm to cool
  
  // These are PERCEPTIONS, not alerts
  perception_cues: LoadPerceptionCue[];
}

/**
 * Load state for XR (derived from Cognitive Load Regulator)
 */
export type LoadXRState =
  | 'open'      // Space feels open and fluid
  | 'present'   // Normal presence
  | 'weighted'  // Space feels denser
  | 'heavy';    // Motion slows slightly

/**
 * Perception cues (subtle, never urgent)
 */
export interface LoadPerceptionCue {
  type: 'density' | 'movement' | 'sound' | 'light';
  intensity: number;  // 0-1
  description: string;  // Human-readable
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT PRESENCE — XR REPRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Agent XR presence
 * Agents appear ONLY if invited
 */
export interface XRAgentPresence {
  id: string;
  agent_id: string;
  agent_name: string;
  
  // Only appears if invited
  invited: boolean;
  
  // Minimal avatar
  avatar_type: 'marker' | 'minimal_form' | 'voice_only';
  position?: Vector3;
  
  // Contract visualization
  contract_visible: boolean;
  boundary_zone?: BoundingVolume;  // "Cannot cross" zone
  
  // Capabilities in XR Meta Room
  can_explain: boolean;    // YES
  can_answer: boolean;     // YES
  can_reflect: boolean;    // YES
  can_persuade: boolean;   // NEVER
  can_optimize: boolean;   // NEVER
  can_lead: boolean;       // NEVER
}

/**
 * Agent boundary (visible spatial boundary)
 */
export interface XRAgentBoundary {
  agent_id: string;
  boundary_type: 'soft' | 'clear' | 'firm';
  visual_style: 'outline' | 'gradient' | 'subtle_wall';
  color: string;
  opacity: number;
  shape: BoundingVolume;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOM STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Complete room state
 */
export interface RoomState {
  id: string;
  session_id: string;
  entered_at: string;
  entry_source: RoomEntrySource;
  
  // Configuration
  config: RoomConfig;
  
  // User
  user_position: Vector3;
  user_orientation: Rotation3;
  
  // Zones
  zones: SpatialZone[];
  active_zone: ZoneType | null;
  
  // Content
  threads: XRThread[];
  decisions: XRDecision[];
  snapshots: XRSnapshot[];
  meanings: XRMeaning[];
  cognitive_load: XRCognitiveLoad;
  agent_presences: XRAgentPresence[];
  
  // Snapshot mode
  snapshot_mode: SnapshotModeState;
  
  // Interaction state
  selected_object: SelectedObject | null;
  hover_object: string | null;
}

/**
 * Selected object in room
 */
export interface SelectedObject {
  id: string;
  type: 'thread' | 'decision' | 'snapshot' | 'meaning' | 'agent';
  inspection_open: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTION & GESTURES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Interaction types (always slow, intentional)
 */
export type InteractionType =
  | 'look'           // Gaze at object
  | 'approach'       // Move toward
  | 'touch'          // Gentle touch/select
  | 'hold'           // Extended touch
  | 'gesture_open'   // Open gesture (inspect)
  | 'gesture_close'  // Close gesture (dismiss)
  | 'walk_along'     // Walk along thread
  | 'step_back'      // Step back (deselect)
  | 'exit_gesture'   // One gesture exit
  | 'exit_voice';    // Voice command exit

/**
 * Interaction event
 */
export interface InteractionEvent {
  type: InteractionType;
  timestamp: string;
  target_id?: string;
  target_type?: string;
  position: Vector3;
  user_position: Vector3;
}

/**
 * Exit method (user is NEVER trapped)
 */
export type ExitMethod =
  | 'gesture'        // One gesture
  | 'voice'          // Voice command
  | 'controller'     // Button press
  | 'timeout';       // User-configured timeout

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Navigation mode (always calm)
 */
export type NavigationMode =
  | 'free'           // Free movement (slow)
  | 'guided'         // Following a thread
  | 'anchored'       // Stationary, looking around
  | 'transitioning'; // Moving between zones

/**
 * Navigation state
 */
export interface NavigationState {
  mode: NavigationMode;
  speed: number;           // Always slow
  following_thread?: string;
  destination?: Vector3;
  transition_progress: number;  // 0-1
}

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Room entry request
 */
export interface EnterRoomRequest {
  entry_source: RoomEntrySource;
  config_overrides?: Partial<RoomConfig>;
  initial_focus?: {
    type: 'thread' | 'decision' | 'snapshot';
    id: string;
  };
  snapshot_context_id?: string;  // If entering from snapshot
}

/**
 * Room entry response
 */
export interface EnterRoomResponse {
  success: boolean;
  session_id: string;
  room_state: RoomState;
  error?: string;
}

/**
 * Room exit request
 */
export interface ExitRoomRequest {
  session_id: string;
  exit_method: ExitMethod;
  save_position?: boolean;  // Remember where user was
}

/**
 * Room update (real-time sync)
 */
export interface RoomUpdate {
  type: 'thread' | 'decision' | 'snapshot' | 'meaning' | 'load' | 'agent' | 'config';
  action: 'add' | 'update' | 'remove';
  data: unknown;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT PROPS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Meta Room component props
 */
export interface XRMetaRoomProps {
  // Entry
  entry_source: RoomEntrySource;
  initial_config?: Partial<RoomConfig>;
  
  // Data sources (connected to other meta modules)
  threads?: XRThread[];
  decisions?: XRDecision[];
  snapshots?: XRSnapshot[];
  meanings?: XRMeaning[];
  cognitive_load?: XRCognitiveLoad;
  agents?: XRAgentPresence[];
  
  // Callbacks
  onEnter?: (session_id: string) => void;
  onExit?: (exit_method: ExitMethod) => void;
  onInteraction?: (event: InteractionEvent) => void;
  onNavigate?: (state: NavigationState) => void;
  onSelect?: (object: SelectedObject | null) => void;
  onSnapshotEnter?: (snapshot_id: string) => void;
  onSnapshotExit?: () => void;
  onAgentInvite?: (agent_id: string) => void;
  onAgentDismiss?: (agent_id: string) => void;
  
  // XR runtime (abstracted)
  xr_runtime?: 'webxr' | 'mock' | 'preview';
}

/**
 * Thread visualization props
 */
export interface XRThreadVisualizationProps {
  thread: XRThread;
  room_config: RoomConfig;
  is_selected: boolean;
  is_hovered: boolean;
  onClick?: (thread_id: string) => void;
  onWalkStart?: (thread_id: string) => void;
}

/**
 * Decision visualization props
 */
export interface XRDecisionVisualizationProps {
  decision: XRDecision;
  room_config: RoomConfig;
  is_selected: boolean;
  is_hovered: boolean;
  onClick?: (decision_id: string) => void;
  onInspect?: (decision_id: string) => void;
}

/**
 * Snapshot visualization props
 */
export interface XRSnapshotVisualizationProps {
  snapshot: XRSnapshot;
  room_config: RoomConfig;
  is_selected: boolean;
  is_hovered: boolean;
  onClick?: (snapshot_id: string) => void;
  onEnter?: (snapshot_id: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Meta Room design tokens
 * All colors are soft, all elements are calm
 */
export const XR_META_ROOM_TOKENS = {
  // Environment
  environment: {
    background: '#0a0a14',       // Deep, calm dark
    ambient_light: '#3a3a5a',    // Soft ambient
    fog_color: '#1a1a2e',        // Gentle fog
  },
  
  // Zones
  zones: {
    center: '#4a4a6a',
    thread_field: '#5a5a7a',
    decision_anchors: '#6a6a8a',
    snapshot_markers: '#7a7a9a',
    meaning_halo: '#8a8aaa',
    load_field: '#4a5a6a',
    agent_boundaries: '#6a7a7a',
  },
  
  // Objects
  threads: {
    primary: '#D4A574',          // Warm amber
    glow: '#E8C9A0',
    unresolved: '#8B7A66',
  },
  
  decisions: {
    crystal: '#6B8DD6',          // Crystalline blue
    selected: '#8BADF0',
    facet: '#5A7AC5',
  },
  
  snapshots: {
    column: '#C9A574',           // Warm amber
    light: '#F0D8B4',
    particles: '#E8D4A0',
  },
  
  meaning: {
    light: '#8B7AA8',            // Soft purple
    text: '#A090C0',
    atmosphere: '#6A5A88',
  },
  
  load: {
    open: '#7A9BBF',
    present: '#6A8BAF',
    weighted: '#5A7B9F',
    heavy: '#4A6B8F',
  },
  
  agents: {
    boundary: '#4A9B6B',         // Trust green
    presence: '#6ABB8B',
    forbidden: '#9B6A6A',
  },
  
  // Interaction
  interaction: {
    hover: 'rgba(255, 255, 255, 0.1)',
    selected: 'rgba(255, 255, 255, 0.2)',
    active: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Text
  text: {
    primary: 'rgba(255, 255, 255, 0.9)',
    secondary: 'rgba(255, 255, 255, 0.6)',
    subtle: 'rgba(255, 255, 255, 0.3)',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE METADATA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Module metadata for registry
 */
export const XR_META_ROOM_MODULE_METADATA = {
  id: 'xr_meta_room',
  name: 'XR Meta Room',
  version: '1.0.0',
  status: 'stable',
  
  description: `
    XR Meta Room is a spatial environment dedicated to reflection,
    alignment, and high-level sense-making. It is the calm center of CHE·NU.
    
    NOT for execution.
    NOT for productivity.
    NOT for performance.
    
    It exists to answer:
    - "What am I doing?"
    - "Why am I doing it?"
    - "Does this still make sense?"
  `,
  
  sphere: 'meta',
  layer: 'xr',
  
  dependencies: [
    'knowledge_threads',
    'decision_crystallizer',
    'context_snapshot',
    'meaning_layer',
    'cognitive_load_regulator',
    'agent_contract',
    'universe_view',
  ],
  
  ethical_constraints: [
    'System must NEVER force entry',
    'User is NEVER trapped - one gesture/voice exit',
    'No execution in this space',
    'No productivity metrics',
    'No performance tracking',
    'Agents may explain, answer, reflect - NEVER persuade, optimize, or lead',
    'All movement is slow, all gestures are intentional',
    'No sharp edges, no visual noise, no urgency cues',
    'No rapid UI, no notifications',
    'Calm by design, not by restriction',
  ],
  
  xr_constraints: [
    'Minimal, calm, grounded environment',
    'Non-hierarchical spatial zones',
    'Threads invite exploration, never pull attention',
    'Decisions are inspectable, not editable by default',
    'Snapshots are clearly labeled, exit is instant',
    'Meaning is ambient, never competes with objects',
    'Load is environmental perception, not alerts',
    'Agent boundaries are visible "cannot cross" zones',
  ],
  
  created_at: '2025-12-29',
  updated_at: '2025-12-29',
};

// ═══════════════════════════════════════════════════════════════════════════════
// NON-GOALS (CRITICAL TO UNDERSTAND)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Meta Room is NOT:
 * - A meeting room
 * - A collaboration space
 * - A productivity XR tool
 * - A performance visualization
 * 
 * It is a place for ALIGNMENT.
 */
export type XRMetaRoomNonGoal =
  | 'meeting_room'
  | 'collaboration_space'
  | 'productivity_tool'
  | 'performance_visualization'
  | 'gamification'
  | 'social_space'
  | 'task_execution'
  | 'notification_center';

/**
 * Guard against non-goals
 */
export function assertNotNonGoal(feature: string): void {
  const nonGoals: XRMetaRoomNonGoal[] = [
    'meeting_room',
    'collaboration_space',
    'productivity_tool',
    'performance_visualization',
    'gamification',
    'social_space',
    'task_execution',
    'notification_center',
  ];
  
  if (nonGoals.some(ng => feature.toLowerCase().includes(ng.replace('_', ' ')))) {
    throw new Error(`XR Meta Room CANNOT support: ${feature}. This is a non-goal.`);
  }
}
