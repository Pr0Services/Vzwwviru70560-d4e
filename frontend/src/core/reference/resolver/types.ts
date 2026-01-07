/* =====================================================
   CHE·NU — Dimension Resolver Types
   
   PURE TYPES — NO DEPENDENCIES
   These types are framework-agnostic and can be used
   by any renderer (React, Three.js, XR, CLI, etc.)
   ===================================================== */

// ─────────────────────────────────────────────────────
// INPUT: Context (what we know about the situation)
// ─────────────────────────────────────────────────────

/**
 * Complete context for dimension resolution.
 * All fields are optional — resolver uses defaults for missing values.
 */
export interface DimensionContext {
  content?: ContentContext;
  activity?: ActivityContext;
  complexity?: ComplexityLevel;
  permission?: PermissionLevel;
  depth?: number;
  sphereId?: string;
}

/**
 * Content metrics — measures "how much stuff" is present.
 */
export interface ContentContext {
  items?: number;
  agents?: number;
  processes?: number;
  decisions?: number;
}

/**
 * Activity metrics — measures "how active" the context is.
 */
export interface ActivityContext {
  lastInteractionMs?: number;  // ms since last interaction
  actionsPerMinute?: number;
  triggers?: string[];         // e.g., ["pendingApproval", "deadline"]
}

export type ComplexityLevel = 'simple' | 'standard' | 'advanced' | 'expert';
export type PermissionLevel = 'none' | 'glimpse' | 'view' | 'read' | 'write' | 'admin';

// ─────────────────────────────────────────────────────
// OUTPUT: Resolved Dimension (what the renderer needs)
// ─────────────────────────────────────────────────────

/**
 * Resolved dimension — renderer-agnostic output.
 * Can be consumed by React, Three.js, XR, or any other renderer.
 */
export interface ResolvedDimension {
  // Size
  scale: number;              // 0.6 → 1.6
  
  // Visibility
  visibility: number;         // 0 → 1
  visible: boolean;           // derived from visibility > 0
  interactable: boolean;      // can user interact?
  
  // Motion
  motion: MotionResolution;
  
  // UI Density
  density: DensityResolution;
  
  // Depth
  depthAllowed: number;       // how deep can user navigate?
  currentDepth: number;       // current depth level
  
  // Activity State (for renderer hints)
  activityState: ActivityState;
  
  // Content Level (for renderer hints)
  contentLevel: ContentLevel;
}

export interface MotionResolution {
  type: MotionType;
  animation: string | null;
  intensity: number;          // 0 → 1
}

export interface DensityResolution {
  level: DensityLevel;
  spacing: number;            // multiplier (0.5 → 1.5)
  details: number;            // 1 → 5 (how much detail to show)
}

export type MotionType = 'none' | 'subtle' | 'moderate' | 'urgent';
export type DensityLevel = 'minimal' | 'compact' | 'standard' | 'expanded' | 'full';
export type ActivityState = 'dormant' | 'idle' | 'active' | 'busy' | 'critical';
export type ContentLevel = 'minimal' | 'low' | 'medium' | 'high' | 'extreme';

// ─────────────────────────────────────────────────────
// ENGINE CONFIG: Rules from JSON
// ─────────────────────────────────────────────────────

/**
 * Engine configuration — loaded from dimension.engine.json
 */
export interface EngineConfig {
  $schema: string;
  version: string;
  resolution: ResolutionConfig;
  content: ContentConfig;
  activity: ActivityConfig;
  complexity: ComplexityConfig;
  permission: PermissionConfig;
  depth: DepthConfig;
  motion: MotionConfig;
  density: DensityConfig;
}

export interface ResolutionConfig {
  order: string[];
  mode: 'multiplicative' | 'additive' | 'max';
}

export interface ContentConfig {
  thresholds: Record<ContentLevel, ContentThreshold>;
  metrics: string[];
}

export interface ContentThreshold {
  min?: number;
  max?: number;
  scale: number;
  density: DensityLevel;
}

export interface ActivityConfig {
  states: Record<ActivityState, ActivityStateConfig>;
  transitions: ActivityTransitions;
}

export interface ActivityStateConfig {
  motion: MotionType;
  visibility: number;
  updateMs: number;
}

export interface ActivityTransitions {
  toIdle: number;
  toDormant: number;
  busyThreshold: number;
  criticalTriggers: string[];
}

export interface ComplexityConfig {
  levels: Record<ComplexityLevel, ComplexityLevelConfig>;
}

export interface ComplexityLevelConfig {
  depthAllowed: number;
  density: DensityLevel;
}

export interface PermissionConfig {
  levels: Record<PermissionLevel, PermissionLevelConfig>;
}

export interface PermissionLevelConfig {
  visible: boolean;
  interactable: boolean;
  visibility: number;
}

export interface DepthConfig {
  maxLevels: number;
  scaleFactor: number;
  visibilityFactor: number;
}

export interface MotionConfig {
  types: Record<MotionType, MotionTypeConfig>;
}

export interface MotionTypeConfig {
  animation: string | null;
  intensity: number;
}

export interface DensityConfig {
  types: Record<DensityLevel, DensityTypeConfig>;
}

export interface DensityTypeConfig {
  spacing: number;
  details: number;
}

// ─────────────────────────────────────────────────────
// SPHERE CONFIG: Per-sphere rules
// ─────────────────────────────────────────────────────

/**
 * Sphere-specific configuration — loaded from spheres/*.json
 */
export interface SphereConfig {
  id: string;
  name: string;
  type: string;
  visual: SphereVisual;
  layout: SphereLayout;
  priority: string[];
  permissions: Record<string, string[]>;
  behavior: SphereBehavior;
  rules: SphereRules;
}

export interface SphereVisual {
  baseShape: 'structure' | 'organic' | 'hybrid';
  color: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string[];
  };
  growthAxis: 'vertical' | 'horizontal' | 'radial' | 'depth';
  icon: string;
  glow: {
    enabled: boolean;
    intensity: number;
    color: string;
  };
}

export interface SphereLayout {
  defaultDimension: string;
  minDimension: string;
  maxDimension: string;
  childArrangement: string;
  expansionDirection: string;
}

export interface SphereBehavior {
  onFocus: BehaviorAction;
  onEnter: BehaviorAction;
  onIdle: BehaviorAction;
  onActive: BehaviorAction;
}

export interface BehaviorAction {
  scale?: number;
  animation?: string;
  transition?: string;
  duration?: number;
  dimAfter?: number;
  showDetails?: boolean;
  highlight?: boolean;
}

export interface SphereRules {
  sizeByContent: boolean;
  motionByActivity: boolean;
  visibilityByPermission: boolean;
  [key: string]: boolean;
}
