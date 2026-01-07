/**
 * CHE·NU™ XR ARCHITECTURE SYSTEM — TYPE DEFINITIONS
 * 
 * XR Architecture System exists to give CHE·NU a coherent,
 * intentional spatial language.
 * 
 * It ensures that XR spaces are:
 * - consistent
 * - meaningful
 * - readable
 * - non-manipulative
 * 
 * XR is not decoration.
 * XR is structural cognition.
 * 
 * @version 1.0
 * @status V51-ready
 * @constraint ADDITIVE ONLY (NO REFACTOR)
 */

import type { Vector3, Rotation3, BoundingVolume } from '../xr-meta-room/xr-meta-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURAL PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * All XR spaces are built from a limited set of primitives.
 * No arbitrary geometry allowed.
 */
export type ArchitecturalPrimitiveType =
  | 'anchor'    // Fixed reference (decisions, snapshots)
  | 'path'      // Continuity (threads, narratives)
  | 'field'     // Ambient state (meaning, load)
  | 'node'      // Discrete objects (options, agents)
  | 'boundary'  // Limits (contracts, permissions)
  | 'horizon'   // Future / unknown
  | 'depth';    // Complexity, not priority

/**
 * Base primitive interface
 */
export interface ArchitecturalPrimitive {
  id: string;
  type: ArchitecturalPrimitiveType;
  
  // Spatial
  position: Vector3;
  rotation?: Rotation3;
  scale: Vector3;
  
  // Semantic
  semantic_meaning: string;
  semantic_verbal: string;  // Must be explainable verbally
  
  // Visual
  material: MaterialDefinition;
  opacity: number;
  
  // State
  active: boolean;
  interactive: boolean;
  
  // Metadata
  created_at: string;
  source_type?: string;
  source_id?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANCHOR — FIXED REFERENCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Anchor: Fixed reference point in XR space
 * Used for: decisions, snapshots, crystallized meaning
 */
export interface AnchorPrimitive extends ArchitecturalPrimitive {
  type: 'anchor';
  
  // Anchor-specific
  anchor_type: AnchorType;
  stability: 'permanent' | 'semi_permanent' | 'temporary';
  
  // Links
  linked_entity_type?: 'decision' | 'snapshot' | 'meaning' | 'thread';
  linked_entity_id?: string;
  
  // Visual
  glow_radius: number;
  pulse_rate: number;  // 0 = no pulse
}

export type AnchorType =
  | 'decision_anchor'     // Crystallized decision
  | 'snapshot_anchor'     // Context snapshot
  | 'meaning_anchor'      // Core meaning statement
  | 'origin_anchor'       // Room origin
  | 'reference_anchor';   // General reference

// ═══════════════════════════════════════════════════════════════════════════════
// PATH — CONTINUITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Path: Continuity in XR space
 * Used for: threads, narratives, timelines
 */
export interface PathPrimitive extends ArchitecturalPrimitive {
  type: 'path';
  
  // Path-specific
  path_type: PathType;
  waypoints: Vector3[];
  
  // Style
  thickness: number;
  continuity: 'solid' | 'dashed' | 'dotted' | 'fading';
  direction_shown: boolean;
  
  // Walkability
  walkable: boolean;
  walk_speed_multiplier: number;
  
  // Links
  linked_entity_type?: 'thread' | 'narrative' | 'timeline';
  linked_entity_id?: string;
}

export type PathType =
  | 'thread_path'       // Knowledge thread
  | 'narrative_path'    // Story/evolution path
  | 'timeline_path'     // Chronological path
  | 'option_path'       // Decision option path
  | 'connection_path';  // General connection

// ═══════════════════════════════════════════════════════════════════════════════
// FIELD — AMBIENT STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Field: Ambient state representation
 * Used for: meaning, cognitive load, atmosphere
 */
export interface FieldPrimitive extends ArchitecturalPrimitive {
  type: 'field';
  
  // Field-specific
  field_type: FieldType;
  influence_center: Vector3;
  influence_radius: number;
  influence_falloff: 'linear' | 'quadratic' | 'sharp';
  
  // Intensity
  intensity: number;  // 0-1
  
  // Visual (ambient only)
  ambient_color: string;
  particle_density?: number;
  
  // Links
  linked_state_type?: 'meaning' | 'load' | 'mood';
  linked_state_id?: string;
}

export type FieldType =
  | 'meaning_field'     // Shared meaning ambient
  | 'load_field'        // Cognitive load atmosphere
  | 'alignment_field'   // Alignment with values
  | 'uncertainty_field' // Areas of uncertainty
  | 'silence_field';    // Quiet/reflection zones

// ═══════════════════════════════════════════════════════════════════════════════
// NODE — DISCRETE OBJECTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Node: Discrete object in XR space
 * Used for: options, agents, items
 */
export interface NodePrimitive extends ArchitecturalPrimitive {
  type: 'node';
  
  // Node-specific
  node_type: NodeType;
  shape: NodeShape;
  
  // Interaction
  selectable: boolean;
  hoverable: boolean;
  grabbable: boolean;
  
  // State
  selected: boolean;
  hovered: boolean;
  
  // Visual
  highlight_color?: string;
  selection_glow: number;
  
  // Links
  linked_entity_type?: 'option' | 'agent' | 'item' | 'participant';
  linked_entity_id?: string;
}

export type NodeType =
  | 'option_node'       // Decision option
  | 'agent_node'        // Agent presence
  | 'participant_node'  // Human participant
  | 'item_node'         // General item
  | 'marker_node';      // Marking/annotation

export type NodeShape =
  | 'sphere'
  | 'cube'
  | 'cylinder'
  | 'cone'
  | 'torus'
  | 'custom';

// ═══════════════════════════════════════════════════════════════════════════════
// BOUNDARY — LIMITS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Boundary: Limit definition in XR space
 * Used for: contracts, permissions, zones
 */
export interface BoundaryPrimitive extends ArchitecturalPrimitive {
  type: 'boundary';
  
  // Boundary-specific
  boundary_type: BoundaryType;
  bounds: BoundingVolume;
  
  // Permeability
  permeability: 'solid' | 'permeable' | 'one_way' | 'conditional';
  crossing_requires?: string[];  // Permissions needed
  
  // Visual
  visible: boolean;
  border_style: 'line' | 'gradient' | 'particles';
  border_opacity: number;
  
  // Links
  linked_scope_type?: 'contract' | 'permission' | 'zone';
  linked_scope_id?: string;
}

export type BoundaryType =
  | 'contract_boundary'   // Agent contract limits
  | 'permission_boundary' // Access permissions
  | 'zone_boundary'       // Zone definition
  | 'sphere_boundary'     // Sphere limits
  | 'room_boundary';      // Room limits

// ═══════════════════════════════════════════════════════════════════════════════
// HORIZON — FUTURE / UNKNOWN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Horizon: Future/unknown representation
 * Used for: unexplored areas, possibilities
 */
export interface HorizonPrimitive extends ArchitecturalPrimitive {
  type: 'horizon';
  
  // Horizon-specific
  horizon_type: HorizonType;
  direction: Vector3;  // Direction of horizon
  distance: number;    // Visual distance
  
  // Visual
  fade_start: number;
  fade_end: number;
  atmosphere_color: string;
  
  // Semantic
  represents: 'future' | 'unknown' | 'possibility' | 'boundary';
}

export type HorizonType =
  | 'time_horizon'      // Future time
  | 'knowledge_horizon' // Unknown knowledge
  | 'possibility_horizon' // Unexplored options
  | 'space_horizon';    // Edge of space

// ═══════════════════════════════════════════════════════════════════════════════
// DEPTH — COMPLEXITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Depth: Complexity representation (NOT priority!)
 * Used for: nested structures, detail levels
 */
export interface DepthPrimitive extends ArchitecturalPrimitive {
  type: 'depth';
  
  // Depth-specific
  depth_type: DepthType;
  depth_level: number;  // Current depth
  max_depth: number;    // Maximum nesting
  
  // Navigation
  can_dive: boolean;
  can_surface: boolean;
  
  // Visual
  depth_fog: boolean;
  detail_reduction: number;  // 0-1, reduce detail at depth
}

export type DepthType =
  | 'nested_depth'      // Nested structure
  | 'detail_depth'      // Level of detail
  | 'abstraction_depth' // Abstraction level
  | 'context_depth';    // Context layers

// ═══════════════════════════════════════════════════════════════════════════════
// SPATIAL SEMANTICS — NON-NEGOTIABLE RULES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Spatial semantic rules.
 * These are non-negotiable constraints.
 */
export interface SpatialSemantics {
  // Position ≠ importance
  center_means: 'perspective' | 'focus';  // NOT 'importance'
  
  // Height ≠ authority
  height_means: 'abstraction' | 'overview';  // NOT 'authority'
  
  // Size ≠ value
  size_means: 'complexity' | 'scope';  // NOT 'value'
  
  // Brightness ≠ priority
  brightness_means: 'clarity' | 'certainty';  // NOT 'priority'
  
  // Motion ≠ urgency
  motion_means: 'change' | 'activity';  // NOT 'urgency'
}

/**
 * Default semantic definitions.
 * Must be explainable verbally.
 */
export const DEFAULT_SPATIAL_SEMANTICS: SpatialSemantics = {
  center_means: 'perspective',
  height_means: 'abstraction',
  size_means: 'complexity',
  brightness_means: 'clarity',
  motion_means: 'change',
};

/**
 * Semantic rule violation
 */
export interface SemanticViolation {
  rule: keyof SpatialSemantics;
  description: string;
  severity: 'warning' | 'error' | 'critical';
  element_id?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MATERIAL & COLOR PHILOSOPHY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Material definition
 */
export interface MaterialDefinition {
  type: MaterialType;
  
  // Base color
  base_color: string;
  
  // Properties
  roughness: number;     // 0-1, prefer higher (softer)
  metalness: number;     // 0-1, prefer lower
  transparency: number;  // 0-1
  
  // Emission (subtle only)
  emissive_color?: string;
  emissive_intensity?: number;
  
  // Texture
  texture_type?: 'none' | 'subtle' | 'informational';
}

export type MaterialType =
  | 'matte'        // Soft, non-reflective
  | 'soft_glow'    // Subtle emission
  | 'translucent'  // Semi-transparent
  | 'glass'        // Transparent
  | 'fog';         // Volumetric

/**
 * Color philosophy.
 * Color conveys STATE, not EMOTION.
 */
export interface ColorPhilosophy {
  // Palette constraints
  max_saturation: number;    // Max 0.4 (desaturated)
  max_brightness: number;    // Max 0.7 (no high-contrast)
  
  // Prohibited
  no_aggressive_red: boolean;  // Always true
  no_gamification_colors: boolean;  // Always true
  no_high_contrast_alerts: boolean;  // Always true
  
  // Semantic colors
  state_neutral: string;
  state_positive: string;   // Muted green
  state_negative: string;   // Muted amber, NOT red
  state_uncertain: string;  // Gray-blue
  
  // Environment
  background_dark: string;
  ambient_subtle: string;
}

/**
 * Default color philosophy
 */
export const DEFAULT_COLOR_PHILOSOPHY: ColorPhilosophy = {
  max_saturation: 0.4,
  max_brightness: 0.7,
  no_aggressive_red: true,
  no_gamification_colors: true,
  no_high_contrast_alerts: true,
  state_neutral: '#8888AA',
  state_positive: '#88AA88',
  state_negative: '#AAAA88',  // Amber, not red
  state_uncertain: '#8888AA',
  background_dark: '#0a0a12',
  ambient_subtle: '#1a1a2a',
};

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION PRINCIPLES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Navigation configuration
 */
export interface NavigationConfig {
  // Speed (slow by default)
  default_locomotion_speed: number;  // m/s, prefer < 2
  max_locomotion_speed: number;
  
  // Gestures
  gesture_style: 'intentional' | 'casual';  // Prefer intentional
  gesture_confirmation: boolean;  // Require confirmation
  
  // Paths
  forced_paths_allowed: boolean;  // Always false
  multiple_exits_required: boolean;  // Always true
  
  // User agency
  user_can_override_speed: boolean;
  user_can_teleport: boolean;
  user_can_fly: boolean;
  
  // Safety
  exit_always_visible: boolean;  // Always true
  exit_gesture_simple: boolean;  // One-gesture exit
  exit_voice_enabled: boolean;   // Voice command exit
}

/**
 * Default navigation config
 */
export const DEFAULT_NAVIGATION_CONFIG: NavigationConfig = {
  default_locomotion_speed: 1.5,  // Slow
  max_locomotion_speed: 3.0,
  gesture_style: 'intentional',
  gesture_confirmation: true,
  forced_paths_allowed: false,  // Never
  multiple_exits_required: true,  // Always
  user_can_override_speed: true,
  user_can_teleport: true,
  user_can_fly: false,
  exit_always_visible: true,
  exit_gesture_simple: true,
  exit_voice_enabled: true,
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOM TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Room type definition.
 * All rooms inherit the same spatial grammar.
 */
export interface RoomTypeDefinition {
  type: RoomType;
  name: string;
  description: string;
  
  // Inherits
  inherits_spatial_grammar: true;  // Always
  inherits_safety_rules: true;     // Always
  inherits_semantic_primitives: true;  // Always
  
  // Configuration
  allowed_primitives: ArchitecturalPrimitiveType[];
  required_primitives: ArchitecturalPrimitiveType[];
  
  // Layout
  default_layout: RoomLayout;
  
  // Constraints
  max_primitive_count: number;
  max_depth: number;
}

export type RoomType =
  | 'meta_room'
  | 'decision_room'
  | 'team_reflection'
  | 'narrative_replay'
  | 'custom';

/**
 * Room layout configuration
 */
export interface RoomLayout {
  shape: 'circular' | 'rectangular' | 'organic' | 'linear';
  symmetry: 'radial' | 'bilateral' | 'none';
  center_defined: boolean;
  horizon_visible: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECT AGENT ROLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Space Architect Agent (OPTIONAL)
 * Has structural veto power, NO creative authority
 */
export interface ArchitectAgentCapabilities {
  // MAY do
  can_validate_compliance: boolean;  // YES
  can_check_semantics: boolean;      // YES
  can_block_violations: boolean;     // YES
  
  // MAY NOT do
  can_design_rooms: boolean;         // NEVER
  can_choose_aesthetics: boolean;    // NEVER
  can_override_user: boolean;        // NEVER
}

/**
 * Default architect capabilities
 */
export const ARCHITECT_AGENT_CAPABILITIES: ArchitectAgentCapabilities = {
  can_validate_compliance: true,
  can_check_semantics: true,
  can_block_violations: true,
  can_design_rooms: false,
  can_choose_aesthetics: false,
  can_override_user: false,
};

/**
 * Compliance check result
 */
export interface ComplianceCheckResult {
  compliant: boolean;
  violations: SemanticViolation[];
  warnings: SemanticViolation[];
  checked_at: string;
  checked_by: 'architect_agent' | 'system';
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION RULES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validation rule
 */
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  
  category: ValidationCategory;
  severity: 'warning' | 'error' | 'critical';
  
  // Check function signature
  check: (primitive: ArchitecturalPrimitive, context: ValidationContext) => ValidationResult;
}

export type ValidationCategory =
  | 'semantic'
  | 'color'
  | 'navigation'
  | 'accessibility'
  | 'safety';

export interface ValidationContext {
  room_type: RoomType;
  all_primitives: ArchitecturalPrimitive[];
  color_philosophy: ColorPhilosophy;
  navigation_config: NavigationConfig;
}

export interface ValidationResult {
  passed: boolean;
  message?: string;
  suggestion?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create primitive request
 */
export interface CreatePrimitiveRequest {
  type: ArchitecturalPrimitiveType;
  position: Vector3;
  semantic_meaning: string;
  semantic_verbal: string;
  
  // Type-specific config
  config: Record<string, unknown>;
}

/**
 * Validate room request
 */
export interface ValidateRoomRequest {
  room_type: RoomType;
  primitives: ArchitecturalPrimitive[];
  color_philosophy?: Partial<ColorPhilosophy>;
  navigation_config?: Partial<NavigationConfig>;
}

/**
 * Validate room response
 */
export interface ValidateRoomResponse {
  valid: boolean;
  compliance: ComplianceCheckResult;
  suggestions?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT PROPS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Architecture System props
 */
export interface XRArchitectureSystemProps {
  // Room configuration
  room_type: RoomType;
  
  // Primitives
  primitives?: ArchitecturalPrimitive[];
  
  // Philosophy
  color_philosophy?: Partial<ColorPhilosophy>;
  spatial_semantics?: Partial<SpatialSemantics>;
  navigation_config?: Partial<NavigationConfig>;
  
  // Validation
  validate_on_change?: boolean;
  architect_agent_enabled?: boolean;
  
  // Callbacks
  onPrimitiveAdd?: (primitive: ArchitecturalPrimitive) => void;
  onPrimitiveRemove?: (id: string) => void;
  onValidationResult?: (result: ComplianceCheckResult) => void;
  onViolation?: (violation: SemanticViolation) => void;
  
  // Rendering
  render_mode?: 'full' | 'wireframe' | 'debug';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Architecture System design tokens
 */
export const XR_ARCHITECTURE_TOKENS = {
  // Primitives
  primitives: {
    anchor: {
      default_size: 0.3,
      glow_color: 'rgba(136, 136, 170, 0.4)',
    },
    path: {
      default_thickness: 0.05,
      color: 'rgba(160, 140, 180, 0.5)',
    },
    field: {
      default_radius: 3,
      particle_color: 'rgba(140, 160, 180, 0.3)',
    },
    node: {
      default_size: 0.4,
      highlight_color: 'rgba(180, 180, 200, 0.5)',
    },
    boundary: {
      border_color: 'rgba(120, 120, 140, 0.3)',
      fill_color: 'rgba(100, 100, 120, 0.1)',
    },
    horizon: {
      fade_color: 'rgba(20, 20, 40, 1)',
      atmosphere: 'rgba(30, 30, 50, 0.5)',
    },
    depth: {
      fog_color: 'rgba(10, 10, 20, 0.8)',
      level_tint: 0.1,  // Tint per level
    },
  },
  
  // Colors (desaturated)
  colors: {
    neutral: '#8888AA',
    positive: '#88AA88',
    negative: '#AAAA88',
    uncertain: '#8888AA',
    background: '#0a0a12',
    ambient: '#1a1a2a',
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

export const XR_ARCHITECTURE_MODULE_METADATA = {
  id: 'xr_architecture_system',
  name: 'XR Architecture System',
  version: '1.0.0',
  status: 'stable',
  
  description: `
    XR Architecture System exists to give CHE·NU a coherent,
    intentional spatial language. It ensures that XR spaces
    are consistent, meaningful, readable, and non-manipulative.
    
    XR is not decoration.
    XR is structural cognition.
  `,
  
  primitives: [
    'ANCHOR: fixed reference (decisions, snapshots)',
    'PATH: continuity (threads, narratives)',
    'FIELD: ambient state (meaning, load)',
    'NODE: discrete objects (options, agents)',
    'BOUNDARY: limits (contracts, permissions)',
    'HORIZON: future / unknown',
    'DEPTH: complexity, not priority',
  ],
  
  semantic_rules: [
    'CENTER ≠ importance (center = perspective)',
    'HEIGHT ≠ authority (height = abstraction)',
    'SIZE ≠ value (size = complexity)',
    'BRIGHTNESS ≠ priority (brightness = clarity)',
    'MOTION ≠ urgency (motion = change)',
  ],
  
  color_philosophy: [
    'Desaturated palettes',
    'Soft materials',
    'No high-contrast alerts',
    'No aggressive lighting',
    'No gamification textures',
    'Color conveys state, not emotion',
  ],
  
  navigation_principles: [
    'Slow locomotion by default',
    'Intentional gestures',
    'No forced paths',
    'Multiple exits always visible',
    'User agency never compromised',
  ],
  
  room_inheritance: [
    'Same spatial grammar',
    'Same safety rules',
    'Same semantic primitives',
    'Rooms differ by configuration, not philosophy',
  ],
  
  dependencies: [
    'xr_meta_room',
  ],
  
  created_at: '2025-12-29',
  updated_at: '2025-12-29',
};

// ═══════════════════════════════════════════════════════════════════════════════
// NON-GOALS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Architecture System is NOT:
 */
export type XRArchitectureNonGoal =
  | '3d_editor'
  | 'creative_sandbox'
  | 'style_engine'
  | 'immersion_maximizer';

export const XR_ARCHITECTURE_NON_GOALS: XRArchitectureNonGoal[] = [
  '3d_editor',
  'creative_sandbox',
  'style_engine',
  'immersion_maximizer',
];
