// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — THEME SCOPE SYSTEM
// Canonical Theme Levels, Blending Rules, and Authority
// ═══════════════════════════════════════════════════════════════════════════════

/* ==============================
   Theme Levels (Ordered by Authority)
============================== */

export type ThemeLevel =
  | 'global'   // 1. System-wide
  | 'sphere'   // 2. Domain-scoped
  | 'meeting'  // 3. Spatial
  | 'agent'    // 4. Presence/Aura
  | 'overlay'; // 5. Temporary UX

/* ==============================
   Blending Weights (Canonical)
============================== */

export const THEME_WEIGHTS: Record<ThemeLevel, number> = {
  global: 0.1,
  sphere: 0.4,
  meeting: 0.8,
  agent: 0.3,   // Never > meeting
  overlay: 1.0, // Temporary only
};

/* ==============================
   Permission Matrices
============================== */

export type ThemePermission =
  | 'background'
  | 'typography'
  | 'density'
  | 'motion'
  | 'accent'
  | 'lighting'
  | 'aura'
  | 'highlight'
  | 'layout'
  | 'navigation'
  | 'accessibility'
  | 'data-visibility'
  | 'security';

// What each level CAN modify
export const LEVEL_PERMISSIONS: Record<ThemeLevel, ThemePermission[]> = {
  global: ['background', 'typography', 'density', 'motion'],
  sphere: ['accent', 'density', 'highlight'],
  meeting: ['lighting', 'background', 'highlight'],
  agent: ['aura', 'highlight', 'accent'],
  overlay: ['highlight', 'background'], // Temporary only
};

// What each level CANNOT modify (forbidden)
export const LEVEL_FORBIDDEN: Record<ThemeLevel, ThemePermission[]> = {
  global: ['layout', 'data-visibility', 'security'],
  sphere: ['navigation', 'accessibility', 'meeting'],
  meeting: ['typography', 'navigation', 'security'],
  agent: ['background', 'layout', 'navigation'],
  overlay: ['layout', 'data-visibility', 'security'],
};

/* ==============================
   Theme Scope Definition
============================== */

export interface ThemeScopeDefinition {
  level: ThemeLevel;
  weight: number;
  appliesTo: string[];
  allowed: ThemePermission[];
  forbidden: ThemePermission[];
}

export const THEME_SCOPES: Record<ThemeLevel, ThemeScopeDefinition> = {
  global: {
    level: 'global',
    weight: 0.1,
    appliesTo: [
      'Entire application',
      'Navigation structure',
      'Accessibility rules',
      'Motion safety',
      'Contrast & readability',
      'Global typography scale',
    ],
    allowed: ['background', 'density', 'motion', 'typography'],
    forbidden: ['layout', 'data-visibility', 'security'],
  },
  sphere: {
    level: 'sphere',
    weight: 0.4,
    appliesTo: [
      'Inside a single Sphere',
      'Dashboards',
      'Internal layouts',
      'Domain-specific UI elements',
    ],
    allowed: ['accent', 'density', 'highlight'],
    forbidden: ['navigation', 'accessibility'],
  },
  meeting: {
    level: 'meeting',
    weight: 0.8,
    appliesTo: [
      'Meeting Room ONLY (2D, 3D, XR)',
      'Room lighting',
      'Shared space ambiance',
      'Collaboration surfaces',
    ],
    allowed: ['lighting', 'background', 'highlight'],
    forbidden: ['typography', 'navigation', 'security'],
  },
  agent: {
    level: 'agent',
    weight: 0.3,
    appliesTo: [
      'Agent avatar',
      'Agent UI elements',
      'Agent highlights & signals',
    ],
    allowed: ['aura', 'highlight', 'accent'],
    forbidden: ['background', 'layout', 'navigation'],
  },
  overlay: {
    level: 'overlay',
    weight: 1.0,
    appliesTo: [
      'Alerts',
      'Warnings',
      'Critical focus states',
      'Transitions',
    ],
    allowed: ['highlight', 'background'],
    forbidden: ['layout', 'data-visibility', 'security'],
  },
};

/* ==============================
   Authority Functions
============================== */

/**
 * Check if a theme level can override another
 */
export function canOverride(higher: ThemeLevel, lower: ThemeLevel): boolean {
  // Special case: agent can never override meeting
  if (higher === 'agent' && lower === 'meeting') {
    return false;
  }
  return THEME_WEIGHTS[higher] >= THEME_WEIGHTS[lower];
}

/**
 * Check if a permission is allowed at a given level
 */
export function isPermissionAllowed(
  level: ThemeLevel,
  permission: ThemePermission
): boolean {
  return LEVEL_PERMISSIONS[level].includes(permission);
}

/**
 * Check if a permission is forbidden at a given level
 */
export function isPermissionForbidden(
  level: ThemeLevel,
  permission: ThemePermission
): boolean {
  return LEVEL_FORBIDDEN[level].includes(permission);
}

/**
 * Get the effective weight for a theme level
 */
export function getEffectiveWeight(level: ThemeLevel): number {
  return THEME_WEIGHTS[level];
}

/* ==============================
   Blending Order
============================== */

export const BLENDING_ORDER: ThemeLevel[] = [
  'global',  // 1. Always exists, base layer
  'sphere',  // 2. Blends on entry
  'meeting', // 3. Overlays sphere
  'agent',   // 4. Blends last (never > meeting)
  'overlay', // 5. Overrides visuals ONLY (temporary)
];

/**
 * Sort theme layers by blending order
 */
export function sortByBlendingOrder(levels: ThemeLevel[]): ThemeLevel[] {
  return [...levels].sort(
    (a, b) => BLENDING_ORDER.indexOf(a) - BLENDING_ORDER.indexOf(b)
  );
}

/* ==============================
   Auto-Switch Triggers
============================== */

export type TriggerCondition =
  | 'stress_detected'
  | 'high_task_load'
  | 'investigation'
  | 'decision_point';

export type GlobalThemeId = 'calm' | 'focus' | 'analysis' | 'executive';

export const AUTO_SWITCH_TRIGGERS: Record<TriggerCondition, GlobalThemeId> = {
  stress_detected: 'calm',
  high_task_load: 'focus',
  investigation: 'analysis',
  decision_point: 'executive',
};

/**
 * Get suggested theme based on trigger
 * Note: Only Orchestrator may APPLY, agents may only SUGGEST
 */
export function getSuggestedTheme(trigger: TriggerCondition): GlobalThemeId {
  return AUTO_SWITCH_TRIGGERS[trigger];
}

/* ==============================
   Theme Validation
============================== */

export interface ThemeValidationResult {
  valid: boolean;
  violations: string[];
}

/**
 * Validate that a theme change doesn't violate rules
 */
export function validateThemeChange(
  level: ThemeLevel,
  permissions: ThemePermission[]
): ThemeValidationResult {
  const violations: string[] = [];

  permissions.forEach((permission) => {
    if (isPermissionForbidden(level, permission)) {
      violations.push(
        `${level} theme cannot modify '${permission}' (forbidden)`
      );
    }
    if (!isPermissionAllowed(level, permission)) {
      violations.push(
        `${level} theme is not allowed to modify '${permission}'`
      );
    }
  });

  return {
    valid: violations.length === 0,
    violations,
  };
}

/* ==============================
   Theme Law Principles
============================== */

export const THEME_LAW_PRINCIPLES = [
  'Preserve clarity',
  'Reduce cognitive load',
  'Protect user autonomy',
  'Prevent manipulation',
] as const;

/**
 * Check if a theme respects law principles
 * Returns true if theme passes all checks
 */
export function respectsLaw(
  themeConfig: { 
    preservesClarity?: boolean;
    reducesCognitiveLoad?: boolean;
    protectsAutonomy?: boolean;
    preventsManipulation?: boolean;
  }
): boolean {
  return (
    themeConfig.preservesClarity !== false &&
    themeConfig.reducesCognitiveLoad !== false &&
    themeConfig.protectsAutonomy !== false &&
    themeConfig.preventsManipulation !== false
  );
}

/* ==============================
   Exports
============================== */

export default {
  THEME_WEIGHTS,
  THEME_SCOPES,
  LEVEL_PERMISSIONS,
  LEVEL_FORBIDDEN,
  BLENDING_ORDER,
  AUTO_SWITCH_TRIGGERS,
  THEME_LAW_PRINCIPLES,
  canOverride,
  isPermissionAllowed,
  isPermissionForbidden,
  getEffectiveWeight,
  sortByBlendingOrder,
  getSuggestedTheme,
  validateThemeChange,
  respectsLaw,
};
