/* =====================================================
   CHE·NU — Dimension Resolver Engine
   
   PHASE 1: PURE RESOLVER
   
   Constraints:
   - NO React, NO UI, NO framework dependencies
   - NO hardcoding of behavior
   - ALL logic from JSON rules
   - PURE functions (same input = same output)
   - 100% TESTABLE
   - DETERMINISTIC
   ===================================================== */

import {
  DimensionContext,
  ResolvedDimension,
  EngineConfig,
  SphereConfig,
  ContentContext,
  ActivityContext,
  ContentLevel,
  ActivityState,
  MotionType,
  DensityLevel,
  ComplexityLevel,
  PermissionLevel,
  MotionResolution,
  DensityResolution,
} from './types';

// ─────────────────────────────────────────────────────
// DEFAULTS (used when context is incomplete)
// ─────────────────────────────────────────────────────

const DEFAULT_CONTENT: Required<ContentContext> = {
  items: 0,
  agents: 0,
  processes: 0,
  decisions: 0,
};

const DEFAULT_ACTIVITY: Required<ActivityContext> = {
  lastInteractionMs: 0,
  actionsPerMinute: 0,
  triggers: [],
};

const DEFAULT_CONTEXT: Required<DimensionContext> = {
  content: DEFAULT_CONTENT,
  activity: DEFAULT_ACTIVITY,
  complexity: 'standard',
  permission: 'read',
  depth: 0,
  sphereId: '',
};

// ─────────────────────────────────────────────────────
// MAIN RESOLVER FUNCTION
// ─────────────────────────────────────────────────────

/**
 * Resolves a dimension context into renderer-agnostic output.
 * 
 * @param context - The current context (content, activity, etc.)
 * @param engine - The engine configuration (from dimension.engine.json)
 * @param sphere - Optional sphere-specific config (from spheres/*.json)
 * @returns ResolvedDimension - Framework-agnostic dimension data
 * 
 * PURE FUNCTION: Same inputs always produce same outputs.
 */
export function resolveDimension(
  context: DimensionContext,
  engine: EngineConfig,
  sphere?: SphereConfig
): ResolvedDimension {
  // 1. Normalize context with defaults
  const ctx = normalizeContext(context);
  
  // 2. Resolve each factor independently
  const contentResolution = resolveContent(ctx.content, engine.content);
  const activityResolution = resolveActivity(ctx.activity, engine.activity);
  const complexityResolution = resolveComplexity(ctx.complexity, engine.complexity);
  const permissionResolution = resolvePermission(ctx.permission, engine.permission);
  const depthResolution = resolveDepth(ctx.depth, engine.depth);
  
  // 3. Compute final values based on resolution mode
  const scale = computeScale(
    contentResolution.scale,
    depthResolution.scaleFactor,
    sphere?.rules.sizeByContent ?? true,
    engine.resolution.mode
  );
  
  const visibility = computeVisibility(
    activityResolution.visibility,
    permissionResolution.visibility,
    depthResolution.visibilityFactor,
    engine.resolution.mode
  );
  
  // 4. Resolve motion
  const motion = resolveMotion(
    activityResolution.motionType,
    engine.motion,
    sphere?.rules.motionByActivity ?? true
  );
  
  // 5. Resolve density (higher of content or complexity determines it)
  const density = resolveDensity(
    contentResolution.density,
    complexityResolution.density,
    engine.density
  );
  
  // 6. Compute allowed depth
  const depthAllowed = Math.min(
    complexityResolution.depthAllowed,
    engine.depth.maxLevels
  );
  
  // 7. Assemble final result
  return {
    scale,
    visibility,
    visible: visibility > 0 && permissionResolution.visible,
    interactable: permissionResolution.interactable && visibility > 0.5,
    motion,
    density,
    depthAllowed,
    currentDepth: ctx.depth,
    activityState: activityResolution.state,
    contentLevel: contentResolution.level,
  };
}

// ─────────────────────────────────────────────────────
// NORMALIZE CONTEXT
// ─────────────────────────────────────────────────────

/**
 * Fills missing context values with defaults.
 * PURE: Always returns new object.
 */
function normalizeContext(context: DimensionContext): Required<DimensionContext> {
  return {
    content: { ...DEFAULT_CONTENT, ...context.content },
    activity: { ...DEFAULT_ACTIVITY, ...context.activity },
    complexity: context.complexity ?? DEFAULT_CONTEXT.complexity,
    permission: context.permission ?? DEFAULT_CONTEXT.permission,
    depth: context.depth ?? DEFAULT_CONTEXT.depth,
    sphereId: context.sphereId ?? DEFAULT_CONTEXT.sphereId,
  };
}

// ─────────────────────────────────────────────────────
// CONTENT RESOLUTION
// ─────────────────────────────────────────────────────

interface ContentResolution {
  level: ContentLevel;
  scale: number;
  density: DensityLevel;
  total: number;
}

/**
 * Resolves content metrics to content level.
 * RULE: Determined by JSON thresholds only.
 */
function resolveContent(
  content: Required<ContentContext>,
  config: EngineConfig['content']
): ContentResolution {
  const total = content.items + content.agents + content.processes + content.decisions;
  
  // Find matching threshold (order: extreme → minimal)
  const levels: ContentLevel[] = ['extreme', 'high', 'medium', 'low', 'minimal'];
  
  for (const level of levels) {
    const threshold = config.thresholds[level];
    if (!threshold) continue;
    
    const meetsMin = threshold.min === undefined || total >= threshold.min;
    const meetsMax = threshold.max === undefined || total < threshold.max;
    
    if (meetsMin && meetsMax) {
      return {
        level,
        scale: threshold.scale,
        density: threshold.density,
        total,
      };
    }
  }
  
  // Fallback to minimal
  const fallback = config.thresholds.minimal;
  return {
    level: 'minimal',
    scale: fallback?.scale ?? 0.6,
    density: fallback?.density ?? 'minimal',
    total,
  };
}

// ─────────────────────────────────────────────────────
// ACTIVITY RESOLUTION
// ─────────────────────────────────────────────────────

interface ActivityResolution {
  state: ActivityState;
  motionType: MotionType;
  visibility: number;
}

/**
 * Resolves activity metrics to activity state.
 * RULE: Determined by JSON transitions only.
 */
function resolveActivity(
  activity: Required<ActivityContext>,
  config: EngineConfig['activity']
): ActivityResolution {
  const { lastInteractionMs, actionsPerMinute, triggers } = activity;
  const { transitions, states } = config;
  
  // Determine state based on rules (priority: critical → dormant)
  let state: ActivityState;
  
  // Check critical triggers first
  const hasCritical = triggers.some(t => 
    transitions.criticalTriggers.includes(t)
  );
  
  if (hasCritical) {
    state = 'critical';
  } else if (actionsPerMinute >= transitions.busyThreshold) {
    state = 'busy';
  } else if (lastInteractionMs < transitions.toIdle) {
    state = 'active';
  } else if (lastInteractionMs < transitions.toDormant) {
    state = 'idle';
  } else {
    state = 'dormant';
  }
  
  const stateConfig = states[state];
  
  return {
    state,
    motionType: stateConfig.motion,
    visibility: stateConfig.visibility,
  };
}

// ─────────────────────────────────────────────────────
// COMPLEXITY RESOLUTION
// ─────────────────────────────────────────────────────

interface ComplexityResolution {
  depthAllowed: number;
  density: DensityLevel;
}

/**
 * Resolves complexity level.
 * RULE: Direct lookup from JSON.
 */
function resolveComplexity(
  level: ComplexityLevel,
  config: EngineConfig['complexity']
): ComplexityResolution {
  const levelConfig = config.levels[level];
  
  if (!levelConfig) {
    // Fallback to standard if level not found
    return {
      depthAllowed: 2,
      density: 'standard',
    };
  }
  
  return {
    depthAllowed: levelConfig.depthAllowed,
    density: levelConfig.density,
  };
}

// ─────────────────────────────────────────────────────
// PERMISSION RESOLUTION
// ─────────────────────────────────────────────────────

interface PermissionResolution {
  visible: boolean;
  interactable: boolean;
  visibility: number;
}

/**
 * Resolves permission level.
 * RULE: Direct lookup from JSON.
 */
function resolvePermission(
  level: PermissionLevel,
  config: EngineConfig['permission']
): PermissionResolution {
  const levelConfig = config.levels[level];
  
  if (!levelConfig) {
    // Fallback to none if level not found
    return {
      visible: false,
      interactable: false,
      visibility: 0,
    };
  }
  
  return {
    visible: levelConfig.visible,
    interactable: levelConfig.interactable,
    visibility: levelConfig.visibility,
  };
}

// ─────────────────────────────────────────────────────
// DEPTH RESOLUTION
// ─────────────────────────────────────────────────────

interface DepthResolution {
  scaleFactor: number;
  visibilityFactor: number;
}

/**
 * Resolves depth factors.
 * RULE: Exponential decay based on JSON config.
 */
function resolveDepth(
  depth: number,
  config: EngineConfig['depth']
): DepthResolution {
  const clampedDepth = Math.min(Math.max(0, depth), config.maxLevels);
  
  return {
    scaleFactor: Math.pow(config.scaleFactor, clampedDepth),
    visibilityFactor: Math.pow(config.visibilityFactor, clampedDepth),
  };
}

// ─────────────────────────────────────────────────────
// MOTION RESOLUTION
// ─────────────────────────────────────────────────────

/**
 * Resolves motion type to motion config.
 * RULE: Direct lookup from JSON.
 */
function resolveMotion(
  type: MotionType,
  config: EngineConfig['motion'],
  enabled: boolean
): MotionResolution {
  if (!enabled) {
    return {
      type: 'none',
      animation: null,
      intensity: 0,
    };
  }
  
  const typeConfig = config.types[type];
  
  if (!typeConfig) {
    return {
      type: 'none',
      animation: null,
      intensity: 0,
    };
  }
  
  return {
    type,
    animation: typeConfig.animation,
    intensity: typeConfig.intensity,
  };
}

// ─────────────────────────────────────────────────────
// DENSITY RESOLUTION
// ─────────────────────────────────────────────────────

/**
 * Resolves density level.
 * RULE: Takes the higher of content or complexity density.
 */
function resolveDensity(
  contentDensity: DensityLevel,
  complexityDensity: DensityLevel,
  config: EngineConfig['density']
): DensityResolution {
  const densityOrder: DensityLevel[] = ['minimal', 'compact', 'standard', 'expanded', 'full'];
  
  const contentIndex = densityOrder.indexOf(contentDensity);
  const complexityIndex = densityOrder.indexOf(complexityDensity);
  
  // Take the higher density
  const finalLevel = densityOrder[Math.max(contentIndex, complexityIndex)];
  const typeConfig = config.types[finalLevel];
  
  return {
    level: finalLevel,
    spacing: typeConfig?.spacing ?? 1.0,
    details: typeConfig?.details ?? 3,
  };
}

// ─────────────────────────────────────────────────────
// SCALE COMPUTATION
// ─────────────────────────────────────────────────────

/**
 * Computes final scale based on resolution mode.
 * RULE: Multiplicative by default.
 */
function computeScale(
  contentScale: number,
  depthFactor: number,
  sizeByContent: boolean,
  mode: EngineConfig['resolution']['mode']
): number {
  const baseScale = sizeByContent ? contentScale : 1.0;
  
  switch (mode) {
    case 'multiplicative':
      return baseScale * depthFactor;
    case 'additive':
      return baseScale + (depthFactor - 1);
    case 'max':
      return Math.max(baseScale, depthFactor);
    default:
      return baseScale * depthFactor;
  }
}

// ─────────────────────────────────────────────────────
// VISIBILITY COMPUTATION
// ─────────────────────────────────────────────────────

/**
 * Computes final visibility based on resolution mode.
 * RULE: Multiplicative by default.
 */
function computeVisibility(
  activityVisibility: number,
  permissionVisibility: number,
  depthFactor: number,
  mode: EngineConfig['resolution']['mode']
): number {
  switch (mode) {
    case 'multiplicative':
      return activityVisibility * permissionVisibility * depthFactor;
    case 'additive':
      return Math.min(1, (activityVisibility + permissionVisibility + depthFactor) / 3);
    case 'max':
      return Math.min(activityVisibility, permissionVisibility, depthFactor);
    default:
      return activityVisibility * permissionVisibility * depthFactor;
  }
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export {
  normalizeContext,
  resolveContent,
  resolveActivity,
  resolveComplexity,
  resolvePermission,
  resolveDepth,
  resolveMotion,
  resolveDensity,
  computeScale,
  computeVisibility,
};

export default resolveDimension;
