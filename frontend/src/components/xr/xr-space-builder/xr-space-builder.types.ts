/**
 * CHE·NU™ XR SPACE BUILDER UI — TYPE DEFINITIONS
 * 
 * XR Space Builder UI exists to let humans DESIGN XR spaces
 * without requiring 3D expertise, while enforcing:
 * - semantic clarity
 * - architectural discipline
 * - ethical safety
 * - cognitive calm
 * 
 * This UI translates XR Architecture rules into
 * UNDERSTANDABLE, HUMAN-SCALE controls.
 * 
 * No raw 3D manipulation.
 * No free-form geometry.
 * 
 * The user never "moves polygons".
 * The user declares INTENT and STRUCTURE.
 * 
 * @version 1.0
 * @status V51-ready
 * @freeze V51 OFFICIAL
 */

// ═══════════════════════════════════════════════════════════════════════════════
// UI PHILOSOPHY — FROZEN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Space Builder UI is:
 * - declarative, not procedural
 * - semantic, not geometric
 * - layered, not crowded
 * - calm, not stimulating
 */
export interface XRSpaceBuilderPhilosophy {
  /** User declares intent, not geometry */
  readonly declarative: true;
  /** Semantic meaning, not coordinates */
  readonly semantic: true;
  /** Layered information, not crowded */
  readonly layered: true;
  /** Calm interface, not stimulating */
  readonly calm: true;
  /** No raw 3D manipulation */
  readonly no_raw_3d: true;
  /** No free-form geometry */
  readonly no_freeform: true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVES — ALLOWED BUILDING BLOCKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Limited list of allowed primitives
 * Each has semantic meaning, not geometric meaning
 */
export type XRPrimitiveType =
  | 'anchor'    // Fixed reference points
  | 'path'      // Continuity/flow
  | 'node'      // Discrete objects
  | 'field'     // Ambient state
  | 'boundary'  // Limits/edges
  | 'horizon'   // Future/unknown
  | 'light';    // Illumination (cognitive, not decorative)

/**
 * Primitive definition with meaning and anti-meaning
 */
export interface XRPrimitive {
  id: string;
  type: XRPrimitiveType;
  
  /** Human-readable icon identifier */
  icon: string;
  
  /** Short meaning explanation */
  meaning: string;
  
  /** What this does NOT mean (critical for clarity) */
  not_meaning: string;
  
  /** Semantic parameters only - NO free transforms */
  parameters: XRPrimitiveParameters;
  
  /** References to other elements */
  references: string[];
  
  /** Scope within the space */
  scope: XRPrimitiveScope;
}

/**
 * Primitive parameters - semantic only
 * NO free numeric transforms (scale, rotation, speed)
 */
export interface XRPrimitiveParameters {
  /** Semantic purpose */
  purpose?: string;
  
  /** Visibility rule */
  visibility?: 'always' | 'contextual' | 'on_focus';
  
  /** Relationship strength */
  relationship_strength?: 'strong' | 'moderate' | 'weak';
  
  /** Temporal aspect */
  temporal?: 'permanent' | 'session' | 'momentary';
}

/**
 * Primitive-specific parameters
 */
export interface AnchorParameters extends XRPrimitiveParameters {
  anchor_type: 'decision' | 'snapshot' | 'milestone' | 'reference';
  stability: 'fixed' | 'adjustable';
}

export interface PathParameters extends XRPrimitiveParameters {
  path_type: 'thread' | 'narrative' | 'exploration';
  continuity: 'linear' | 'branching' | 'cyclical';
  direction: 'forward' | 'bidirectional';
}

export interface NodeParameters extends XRPrimitiveParameters {
  node_type: 'option' | 'agent' | 'data' | 'action';
  interactivity: 'selectable' | 'viewable' | 'expandable';
}

export interface FieldParameters extends XRPrimitiveParameters {
  field_type: 'meaning' | 'cognitive_load' | 'context' | 'atmosphere';
  intensity: 'subtle' | 'present' | 'prominent';
}

export interface BoundaryParameters extends XRPrimitiveParameters {
  boundary_type: 'scope' | 'permission' | 'time' | 'sphere';
  permeability: 'hard' | 'soft' | 'negotiable';
}

export interface HorizonParameters extends XRPrimitiveParameters {
  horizon_type: 'future' | 'unknown' | 'potential' | 'limit';
  approachability: 'reachable' | 'visible_only' | 'conceptual';
}

export interface LightParameters extends XRPrimitiveParameters {
  light_type: 'clarity' | 'focus' | 'ambient' | 'guide';
  /** Light is cognitive, not decorative */
  cognitive_purpose: string;
}

export type XRPrimitiveScope = 
  | 'global'      // Visible everywhere
  | 'zone'        // Visible in specific zone
  | 'contextual'  // Visible based on context
  | 'personal';   // Visible only to owner

// ═══════════════════════════════════════════════════════════════════════════════
// UI ZONES — 5 STABLE ZONES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * UI Layout: 5 stable zones
 */
export interface XRSpaceBuilderLayout {
  /** A) Space Overview Panel - top-down abstract map */
  overview_panel: SpaceOverviewPanel;
  
  /** B) Primitive Palette - allowed primitives */
  primitive_palette: PrimitivePalettePanel;
  
  /** C) Semantic Config Panel - context-sensitive config */
  semantic_config: SemanticConfigPanel;
  
  /** D) Validation & Safety Panel - real-time validation */
  validation_panel: ValidationPanel;
  
  /** E) Preview/Test Panel - XR preview */
  preview_panel: PreviewPanel;
}

/**
 * A) SPACE OVERVIEW PANEL (LEFT)
 * Top-down abstract map (non-3D)
 */
export interface SpaceOverviewPanel {
  /** Panel position */
  position: 'left';
  
  /** Zones in the space */
  zones: XRZone[];
  
  /** Anchors placed */
  anchors: XRPrimitive[];
  
  /** Paths defined */
  paths: XRPrimitive[];
  
  /** Currently focused zone */
  focused_zone?: string;
  
  /** View mode - always non-perspective */
  view_mode: 'top_down_abstract';
  
  /** No perspective distortion - ENFORCED */
  no_perspective: true;
}

/**
 * Zone within a space
 */
export interface XRZone {
  id: string;
  name: string;
  purpose: string;
  primitives: string[]; // Primitive IDs
  boundaries: string[]; // Boundary primitive IDs
  position_hint: 'center' | 'north' | 'south' | 'east' | 'west' | 'peripheral';
}

/**
 * B) PRIMITIVE PALETTE (LEFT / LOWER)
 * Limited list of allowed primitives
 */
export interface PrimitivePalettePanel {
  /** Panel position */
  position: 'left_lower';
  
  /** Available primitives (limited set) */
  primitives: PrimitivePaletteItem[];
  
  /** Currently selected primitive type */
  selected?: XRPrimitiveType;
}

/**
 * Palette item with full semantic information
 */
export interface PrimitivePaletteItem {
  type: XRPrimitiveType;
  icon: string;
  label: string;
  meaning: string;
  not_meaning: string;
  enabled: boolean;
  reason_if_disabled?: string;
}

/**
 * C) SEMANTIC CONFIG PANEL (CENTER / RIGHT)
 * Context-sensitive configuration
 */
export interface SemanticConfigPanel {
  /** Panel position */
  position: 'center_right';
  
  /** Currently selected primitive for config */
  selected_primitive?: XRPrimitive;
  
  /** Available options (ONLY allowed properties) */
  available_options: SemanticOption[];
  
  /** Each option has meaning explanation */
  explanations: Record<string, string>;
}

/**
 * Semantic option with meaning
 */
export interface SemanticOption {
  id: string;
  label: string;
  type: 'select' | 'toggle' | 'text' | 'reference';
  
  /** Meaning explanation - REQUIRED */
  meaning: string;
  
  /** What this does NOT affect */
  not_meaning?: string;
  
  /** Current value */
  value: unknown;
  
  /** Allowed values (if select) */
  allowed_values?: Array<{ value: unknown; label: string; meaning: string }>;
}

/**
 * D) VALIDATION & SAFETY PANEL (RIGHT)
 * Real-time validation status
 */
export interface ValidationPanel {
  /** Panel position */
  position: 'right';
  
  /** Overall validity */
  is_valid: boolean;
  
  /** Validation results */
  validations: ValidationResult[];
  
  /** Errors are BLOCKING, not advisory */
  errors_are_blocking: true;
  
  /** Current blocking errors */
  blocking_errors: ValidationError[];
  
  /** Warnings (non-blocking) */
  warnings: ValidationWarning[];
}

/**
 * Validation result
 */
export interface ValidationResult {
  rule_id: string;
  rule_name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  /** WHY this is important */
  explanation: string;
}

/**
 * Validation error - BLOCKS progress
 */
export interface ValidationError {
  id: string;
  rule_violated: string;
  element_id?: string;
  message: string;
  /** WHY this is blocked - ALWAYS explains */
  why_blocked: string;
  /** How to fix */
  how_to_fix: string;
}

/**
 * Validation warning - advisory
 */
export interface ValidationWarning {
  id: string;
  rule_id: string;
  element_id?: string;
  message: string;
  suggestion: string;
}

/**
 * E) PREVIEW/TEST PANEL (BOTTOM)
 * XR preview and testing
 */
export interface PreviewPanel {
  /** Panel position */
  position: 'bottom';
  
  /** Preview mode */
  mode: PreviewMode;
  
  /** Simulation options */
  simulations: PreviewSimulation[];
  
  /** Current preview state */
  state: PreviewState;
}

export type PreviewMode = 
  | 'static'        // Static view
  | 'walkthrough'   // User perspective
  | 'observer'      // Third-person view
  | 'overlay';      // With overlays

export interface PreviewSimulation {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface PreviewState {
  is_previewing: boolean;
  current_position?: { x: number; y: number; z: number };
  active_overlays: string[];
  cognitive_load_visible: boolean;
  meaning_layer_visible: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATION FLOW — GUIDED PROCESS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Creation flow steps - NO step is skippable
 */
export type CreationStep =
  | 'select_mode'      // 1. Template / Clone / Composable
  | 'declare_purpose'  // 2. Intended purpose & meaning
  | 'place_primitives' // 3. Guided primitive placement
  | 'validate'         // 4. Continuous semantic validation
  | 'preview'          // 5. XR preview
  | 'confirm';         // 6. Confirm & publish

/**
 * Creation mode selection
 */
export type CreationMode =
  | 'template'    // Start from template
  | 'clone'       // Clone existing space
  | 'composable'; // Build from scratch (guided)

/**
 * Space declaration - purpose and meaning
 */
export interface SpaceDeclaration {
  /** Intended purpose - REQUIRED */
  purpose: string;
  
  /** Intended meaning - REQUIRED */
  meaning: string;
  
  /** Target users */
  target_users: string[];
  
  /** Expected cognitive load */
  expected_load: 'low' | 'moderate' | 'high';
  
  /** Primary use case */
  primary_use_case: string;
}

/**
 * Creation flow state
 */
export interface CreationFlowState {
  current_step: CreationStep;
  mode?: CreationMode;
  declaration?: SpaceDeclaration;
  primitives_placed: XRPrimitive[];
  validation_passed: boolean;
  preview_completed: boolean;
  ready_to_publish: boolean;
  
  /** Steps completed */
  completed_steps: CreationStep[];
  
  /** Steps remaining */
  remaining_steps: CreationStep[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAFETY GUARANTEES — ENFORCED
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Builder safety guarantees - MUST enforce
 * If violated → BLOCK + EXPLANATION
 */
export interface BuilderSafetyGuarantees {
  /** No hidden areas in the space */
  no_hidden_areas: true;
  
  /** No forced perspective tricks */
  no_forced_perspective: true;
  
  /** No urgency encoding (flashing, red, timers) */
  no_urgency_encoding: true;
  
  /** No attention traps (loops, addiction patterns) */
  no_attention_traps: true;
  
  /** No authority signaling via space (size=importance) */
  no_authority_signaling: true;
  
  /** Exit always visible and reachable */
  exit_always_visible: true;
  
  /** User agency preserved */
  user_agency_preserved: true;
}

/**
 * Safety violation
 */
export interface SafetyViolation {
  id: string;
  guarantee_violated: keyof BuilderSafetyGuarantees;
  element_id?: string;
  description: string;
  severity: 'critical' | 'high' | 'moderate';
  
  /** Blocks all progress */
  blocks_progress: true;
  
  /** Explanation of why this is dangerous */
  why_dangerous: string;
  
  /** How to resolve */
  resolution: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// XR ARCHITECT AGENT — UI ROLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Architect Agent role in UI
 */
export interface XRArchitectAgentUI {
  /** Agent monitors validation panel */
  monitors_validation: true;
  
  /** Agent explains architectural rules */
  explains_rules: true;
  
  /** Agent NEVER edits or suggests aesthetics */
  never_edits_aesthetics: true;
  
  /** Agent language must cite rules verbatim */
  cites_rules_verbatim: true;
}

/**
 * Agent capabilities in builder
 */
export interface XRArchitectAgentCapabilities {
  /** MAY: Explain why something is blocked */
  may_explain_blocks: true;
  
  /** MAY: Cite specific rules */
  may_cite_rules: true;
  
  /** MAY: Answer questions about architecture */
  may_answer_questions: true;
  
  /** MAY NOT: Suggest designs */
  may_not_suggest_designs: true;
  
  /** MAY NOT: Choose aesthetics */
  may_not_choose_aesthetics: true;
  
  /** MAY NOT: Override user decisions */
  may_not_override_user: true;
  
  /** MAY NOT: Auto-fix violations */
  may_not_auto_fix: true;
}

/**
 * Agent message in builder
 */
export interface ArchitectAgentMessage {
  id: string;
  timestamp: string;
  type: 'explanation' | 'rule_citation' | 'answer' | 'warning';
  content: string;
  
  /** Rule reference if citing */
  rule_reference?: string;
  
  /** Element reference if about specific element */
  element_reference?: string;
  
  /** Must cite source */
  source_citation: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSIONING — UI EXPOSURE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Version information exposed in UI
 */
export interface SpaceVersioning {
  /** Current version */
  current_version: string;
  
  /** Version history timeline */
  version_timeline: SpaceVersion[];
  
  /** Semantic diff capability */
  semantic_diff_available: true;
  
  /** Rollback capability */
  rollback_available: true;
}

/**
 * Space version
 */
export interface SpaceVersion {
  id: string;
  version: string;
  created_at: string;
  created_by: string;
  
  /** What changed (semantic) */
  changes: SemanticChange[];
  
  /** Context snapshot link */
  context_snapshot_id?: string;
  
  /** Meaning entry link */
  meaning_entry_id?: string;
  
  /** Is this version locked */
  is_locked: boolean;
}

/**
 * Semantic change (not geometric)
 */
export interface SemanticChange {
  type: 'added' | 'removed' | 'modified' | 'moved';
  element_type: XRPrimitiveType | 'zone' | 'purpose' | 'meaning';
  description: string;
  old_value?: string;
  new_value?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPACE DEFINITION — COMPLETE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Complete XR Space definition
 */
export interface XRSpace {
  id: string;
  name: string;
  
  /** Declaration (purpose & meaning) */
  declaration: SpaceDeclaration;
  
  /** Zones */
  zones: XRZone[];
  
  /** Primitives */
  primitives: XRPrimitive[];
  
  /** Connections between primitives */
  connections: PrimitiveConnection[];
  
  /** Version info */
  versioning: SpaceVersioning;
  
  /** Safety validation status */
  safety_status: SafetyStatus;
  
  /** Creation metadata */
  created_by: string;
  created_at: string;
  updated_at: string;
  
  /** Publication status */
  is_published: boolean;
  published_at?: string;
}

/**
 * Connection between primitives
 */
export interface PrimitiveConnection {
  id: string;
  from_primitive: string;
  to_primitive: string;
  connection_type: 'flow' | 'reference' | 'containment' | 'sequence';
  semantic_meaning: string;
}

/**
 * Safety validation status
 */
export interface SafetyStatus {
  is_safe: boolean;
  last_validated: string;
  violations: SafetyViolation[];
  guarantees_met: Partial<Record<keyof BuilderSafetyGuarantees, boolean>>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES — STARTING POINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Space template
 */
export interface XRSpaceTemplate {
  id: string;
  name: string;
  description: string;
  
  /** Template purpose */
  purpose: string;
  
  /** Pre-configured zones */
  zones: XRZone[];
  
  /** Pre-configured primitives */
  primitives: XRPrimitive[];
  
  /** What can be customized */
  customizable: string[];
  
  /** What is locked */
  locked: string[];
  
  /** Recommended for */
  recommended_for: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create space request
 */
export interface CreateSpaceRequest {
  mode: CreationMode;
  declaration: SpaceDeclaration;
  template_id?: string;
  clone_from_id?: string;
  user_id: string;
}

/**
 * Create space response
 */
export interface CreateSpaceResponse {
  space: XRSpace;
  initial_validation: ValidationResult[];
  next_step: CreationStep;
}

/**
 * Add primitive request
 */
export interface AddPrimitiveRequest {
  space_id: string;
  primitive_type: XRPrimitiveType;
  zone_id?: string;
  parameters: XRPrimitiveParameters;
  user_id: string;
}

/**
 * Validate space request
 */
export interface ValidateSpaceRequest {
  space_id: string;
  full_validation?: boolean;
}

/**
 * Validate space response
 */
export interface ValidateSpaceResponse {
  is_valid: boolean;
  validations: ValidationResult[];
  errors: ValidationError[];
  warnings: ValidationWarning[];
  safety_violations: SafetyViolation[];
}

/**
 * Publish space request
 */
export interface PublishSpaceRequest {
  space_id: string;
  user_id: string;
  create_snapshot: boolean;
  link_meaning_entry?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT PROPS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Space Builder component props
 */
export interface XRSpaceBuilderProps {
  /** User ID */
  user_id: string;
  
  /** Initial mode */
  initial_mode?: CreationMode;
  
  /** Template to use (if template mode) */
  template_id?: string;
  
  /** Space to clone (if clone mode) */
  clone_from_id?: string;
  
  /** Existing space to edit */
  space_id?: string;
  
  /** Enable architect agent */
  architect_agent_enabled?: boolean;
  
  /** Callbacks */
  onSpaceCreated?: (space: XRSpace) => void;
  onSpaceUpdated?: (space: XRSpace) => void;
  onSpacePublished?: (space: XRSpace) => void;
  onValidationChange?: (validation: ValidateSpaceResponse) => void;
  onStepChange?: (step: CreationStep) => void;
  onExit?: () => void;
  
  /** Custom class */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NON-GOALS — WHAT THIS IS NOT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Space Builder UI is NOT:
 */
export type XRSpaceBuilderNonGoal =
  | 'a_3d_editor'
  | 'a_creative_playground'
  | 'a_visual_scripting_tool'
  | 'a_performance_optimizer'
  | 'a_game_engine'
  | 'a_modeling_tool';

/**
 * It IS a STRUCTURE DECLARATION INTERFACE
 */
export const XR_SPACE_BUILDER_IS = 'STRUCTURE_DECLARATION_INTERFACE' as const;

export const XR_SPACE_BUILDER_NON_GOALS: XRSpaceBuilderNonGoal[] = [
  'a_3d_editor',
  'a_creative_playground',
  'a_visual_scripting_tool',
  'a_performance_optimizer',
  'a_game_engine',
  'a_modeling_tool',
];

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const XR_SPACE_BUILDER_TOKENS = {
  // Layout
  layout: {
    overview_width: '280px',
    palette_height: '200px',
    config_width: '320px',
    validation_width: '280px',
    preview_height: '240px',
  },
  
  // Colors (calm, not stimulating)
  colors: {
    background: '#0a0a12',
    panel_bg: '#12121a',
    border: '#2a2a3a',
    text_primary: '#e0e0e8',
    text_secondary: '#8888aa',
    accent: '#6688cc',
    success: '#88aa88',
    warning: '#aaaa88',
    error: '#aa8888',
  },
  
  // Validation colors
  validation: {
    pass: '#88aa88',
    fail: '#aa8888',
    warning: '#aaaa88',
    blocked: '#aa6666',
  },
  
  // Primitive colors (semantic)
  primitives: {
    anchor: '#8899bb',
    path: '#99aa88',
    node: '#aa9988',
    field: '#8888aa',
    boundary: '#aa88aa',
    horizon: '#88aaaa',
    light: '#aaaa99',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const DEFAULT_SAFETY_GUARANTEES: BuilderSafetyGuarantees = {
  no_hidden_areas: true,
  no_forced_perspective: true,
  no_urgency_encoding: true,
  no_attention_traps: true,
  no_authority_signaling: true,
  exit_always_visible: true,
  user_agency_preserved: true,
};

export const DEFAULT_ARCHITECT_CAPABILITIES: XRArchitectAgentCapabilities = {
  may_explain_blocks: true,
  may_cite_rules: true,
  may_answer_questions: true,
  may_not_suggest_designs: true,
  may_not_choose_aesthetics: true,
  may_not_override_user: true,
  may_not_auto_fix: true,
};

export const PRIMITIVE_DEFINITIONS: PrimitivePaletteItem[] = [
  {
    type: 'anchor',
    icon: '⚓',
    label: 'Anchor',
    meaning: 'Fixed reference point - decisions, snapshots, milestones',
    not_meaning: 'NOT importance or priority',
    enabled: true,
  },
  {
    type: 'path',
    icon: '〰️',
    label: 'Path',
    meaning: 'Continuity and flow - threads, narratives, exploration',
    not_meaning: 'NOT mandatory direction or forced route',
    enabled: true,
  },
  {
    type: 'node',
    icon: '◉',
    label: 'Node',
    meaning: 'Discrete object - options, agents, data points',
    not_meaning: 'NOT hierarchy or rank',
    enabled: true,
  },
  {
    type: 'field',
    icon: '◐',
    label: 'Field',
    meaning: 'Ambient state - meaning, cognitive load, context',
    not_meaning: 'NOT decoration or atmosphere only',
    enabled: true,
  },
  {
    type: 'boundary',
    icon: '▢',
    label: 'Boundary',
    meaning: 'Limits and edges - scope, permissions, time',
    not_meaning: 'NOT barriers or restrictions',
    enabled: true,
  },
  {
    type: 'horizon',
    icon: '━',
    label: 'Horizon',
    meaning: 'Future or unknown - potential, limits of knowledge',
    not_meaning: 'NOT unreachable or forbidden',
    enabled: true,
  },
  {
    type: 'light',
    icon: '✦',
    label: 'Light',
    meaning: 'Cognitive illumination - clarity, focus, guidance',
    not_meaning: 'NOT decoration or mood lighting',
    enabled: true,
  },
];

export const CREATION_STEPS_ORDER: CreationStep[] = [
  'select_mode',
  'declare_purpose',
  'place_primitives',
  'validate',
  'preview',
  'confirm',
];

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const XR_SPACE_BUILDER_MODULE_METADATA = {
  name: 'XR Space Builder UI',
  version: '1.0.0',
  status: 'V51-FROZEN',
  purpose: 'Structure declaration interface for XR spaces',
  philosophy: 'declarative, semantic, layered, calm',
  
  what_it_is: XR_SPACE_BUILDER_IS,
  what_it_is_not: XR_SPACE_BUILDER_NON_GOALS,
  
  guarantees: Object.keys(DEFAULT_SAFETY_GUARANTEES),
  primitives: PRIMITIVE_DEFINITIONS.map(p => p.type),
  steps: CREATION_STEPS_ORDER,
} as const;
