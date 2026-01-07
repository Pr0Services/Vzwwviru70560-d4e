// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — THEME CONFIG TYPES
// Auto-generated types matching theme-config.json
// ═══════════════════════════════════════════════════════════════════════════════

// =============================================================================
// GLOBAL RULES
// =============================================================================

export interface GlobalRules {
  /** Structure cannot be modified by themes */
  structureImmutable: boolean;
  /** Theme switches must be instant */
  instantSwitch: boolean;
  /** Agents can suggest theme changes */
  agentMaySuggest: boolean;
  /** Agents cannot force theme changes */
  agentMayForce: boolean;
  /** XR inherits from 2D theme unless overridden */
  xrInherits2DTheme: boolean;
  /** Auto-switch to calm/focus on stress detection */
  autoSwitchOnStress: boolean;
}

// =============================================================================
// VISUAL CONFIG
// =============================================================================

export interface BackgroundColors {
  primary: string;
  secondary: string;
  elevated: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  muted: string;
}

export interface AccentColors {
  primary: string;
  success: string;
  warning: string;
  danger: string;
  secondary?: string; // Only in Analysis theme
}

export type ContrastLevel = 'low' | 'medium' | 'high';

export interface VisualConfig {
  background: BackgroundColors;
  text: TextColors;
  accent: AccentColors;
  contrastLevel: ContrastLevel;
}

// =============================================================================
// LAYOUT CONFIG
// =============================================================================

export type DensityLevel = 'low' | 'medium' | 'high';
export type SidePanelMode = 'collapsed' | 'auto' | 'expanded' | 'summaryOnly';

export interface LayoutConfig {
  density: DensityLevel;
  spacingScale: number;
  maxColumns: number;
  sidePanels: SidePanelMode;
}

// =============================================================================
// MOTION CONFIG
// =============================================================================

export type AnimationIntensity = 'none' | 'minimal' | 'low' | 'medium';
export type EasingFunction = 'ease-out' | 'linear' | 'ease-in-out';

export interface MotionConfig {
  enabled: boolean;
  transitionMs: number;
  easing: EasingFunction;
  animationIntensity: AnimationIntensity;
}

// =============================================================================
// AGENT CONFIG
// =============================================================================

export type AgentVisibility = 
  | 'onDemand' 
  | 'operationalOnly' 
  | 'advisory' 
  | 'decisionOnly';

export type AgentTone = 
  | 'calm' 
  | 'direct' 
  | 'explanatory' 
  | 'decisive';

export interface AgentConfig {
  visibility: AgentVisibility;
  tone: AgentTone;
  maxSimultaneousAgents: number;
}

// =============================================================================
// THEME
// =============================================================================

export type ThemeId = 'calm' | 'focus' | 'analysis' | 'executive';

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  purpose: string;
  visual: VisualConfig;
  layout: LayoutConfig;
  motion: MotionConfig;
  agents: AgentConfig;
}

// =============================================================================
// AUTO-SWITCH RULES
// =============================================================================

export interface AutoSwitchRules {
  stressDetected: ThemeId[];
  taskExecution: ThemeId;
  analysisPhase: ThemeId;
  decisionPhase: ThemeId;
}

// =============================================================================
// FULL CONFIG
// =============================================================================

export interface CheNuThemeConfig {
  cheNuThemeConfigVersion: string;
  globalRules: GlobalRules;
  themes: Record<ThemeId, ThemeConfig>;
  autoSwitchRules: AutoSwitchRules;
}

// =============================================================================
// CANONICAL VALUES (from theme-config.json)
// =============================================================================

export const THEME_CONFIG: CheNuThemeConfig = {
  cheNuThemeConfigVersion: "1.0.0",
  globalRules: {
    structureImmutable: true,
    instantSwitch: true,
    agentMaySuggest: true,
    agentMayForce: false,
    xrInherits2DTheme: true,
    autoSwitchOnStress: true,
  },
  themes: {
    calm: {
      id: "calm",
      label: "Calm",
      purpose: "Reduce cognitive load and promote clarity",
      visual: {
        background: {
          primary: "#0F1216",
          secondary: "#151A21",
          elevated: "#1B2230",
        },
        text: {
          primary: "#E6EAF0",
          secondary: "#AEB6C3",
          muted: "#7A8496",
        },
        accent: {
          primary: "#5DA9FF",
          success: "#4CAF88",
          warning: "#F5C26B",
          danger: "#E06C75",
        },
        contrastLevel: "low",
      },
      layout: {
        density: "low",
        spacingScale: 1.25,
        maxColumns: 2,
        sidePanels: "collapsed",
      },
      motion: {
        enabled: true,
        transitionMs: 450,
        easing: "ease-out",
        animationIntensity: "minimal",
      },
      agents: {
        visibility: "onDemand",
        tone: "calm",
        maxSimultaneousAgents: 1,
      },
    },
    focus: {
      id: "focus",
      label: "Focus",
      purpose: "Enable deep execution and task completion",
      visual: {
        background: {
          primary: "#11151B",
          secondary: "#171D26",
          elevated: "#1F2835",
        },
        text: {
          primary: "#F1F4F8",
          secondary: "#B8C0D0",
          muted: "#8893A8",
        },
        accent: {
          primary: "#5DA9FF",
          success: "#4CAF88",
          warning: "#F5C26B",
          danger: "#E06C75",
        },
        contrastLevel: "medium",
      },
      layout: {
        density: "medium",
        spacingScale: 1.0,
        maxColumns: 1,
        sidePanels: "auto",
      },
      motion: {
        enabled: true,
        transitionMs: 180,
        easing: "ease-out",
        animationIntensity: "low",
      },
      agents: {
        visibility: "operationalOnly",
        tone: "direct",
        maxSimultaneousAgents: 1,
      },
    },
    analysis: {
      id: "analysis",
      label: "Analysis",
      purpose: "Explore data, structure, and decision comparisons",
      visual: {
        background: {
          primary: "#141822",
          secondary: "#1A2030",
          elevated: "#232C40",
        },
        text: {
          primary: "#EAF0FA",
          secondary: "#C1CAE0",
          muted: "#93A0C0",
        },
        accent: {
          primary: "#5DA9FF",
          success: "#4CAF88",
          warning: "#F5C26B",
          danger: "#E06C75",
          secondary: "#8AB4F8",
        },
        contrastLevel: "high",
      },
      layout: {
        density: "high",
        spacingScale: 0.9,
        maxColumns: 3,
        sidePanels: "expanded",
      },
      motion: {
        enabled: true,
        transitionMs: 260,
        easing: "ease-out",
        animationIntensity: "medium",
      },
      agents: {
        visibility: "advisory",
        tone: "explanatory",
        maxSimultaneousAgents: 2,
      },
    },
    executive: {
      id: "executive",
      label: "Executive",
      purpose: "High-level overview and decisive actions",
      visual: {
        background: {
          primary: "#0E1116",
          secondary: "#141923",
          elevated: "#1C2332",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#C8CFDC",
          muted: "#9AA6BF",
        },
        accent: {
          primary: "#5DA9FF",
          success: "#4CAF88",
          warning: "#F5C26B",
          danger: "#E06C75",
        },
        contrastLevel: "high",
      },
      layout: {
        density: "medium",
        spacingScale: 0.95,
        maxColumns: 2,
        sidePanels: "summaryOnly",
      },
      motion: {
        enabled: false,
        transitionMs: 120,
        easing: "linear",
        animationIntensity: "none",
      },
      agents: {
        visibility: "decisionOnly",
        tone: "decisive",
        maxSimultaneousAgents: 1,
      },
    },
  },
  autoSwitchRules: {
    stressDetected: ["calm", "focus"],
    taskExecution: "focus",
    analysisPhase: "analysis",
    decisionPhase: "executive",
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get theme config by ID
 */
export const getThemeConfig = (id: ThemeId): ThemeConfig => {
  return THEME_CONFIG.themes[id];
};

/**
 * Get all theme IDs
 */
export const getThemeIds = (): ThemeId[] => {
  return Object.keys(THEME_CONFIG.themes) as ThemeId[];
};

/**
 * Get suggested theme for auto-switch scenario
 */
export const getAutoSwitchTheme = (
  scenario: keyof AutoSwitchRules
): ThemeId | ThemeId[] => {
  return THEME_CONFIG.autoSwitchRules[scenario];
};

/**
 * Check if agent action is allowed by global rules
 */
export const canAgentSuggestTheme = (): boolean => {
  return THEME_CONFIG.globalRules.agentMaySuggest;
};

export const canAgentForceTheme = (): boolean => {
  return THEME_CONFIG.globalRules.agentMayForce;
};

/**
 * Get CSS variable value from theme
 */
export const getThemeCSSVar = (
  theme: ThemeConfig,
  path: string
): string | number | undefined => {
  const parts = path.split('.');
  let value: unknown = theme;
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }
  
  return value;
};

/**
 * Generate CSS variables from theme config
 */
export const generateCSSVariables = (theme: ThemeConfig): Record<string, string> => {
  return {
    '--theme-bg-primary': theme.visual.background.primary,
    '--theme-bg-secondary': theme.visual.background.secondary,
    '--theme-bg-elevated': theme.visual.background.elevated,
    '--theme-text-primary': theme.visual.text.primary,
    '--theme-text-secondary': theme.visual.text.secondary,
    '--theme-text-muted': theme.visual.text.muted,
    '--theme-accent': theme.visual.accent.primary,
    '--theme-success': theme.visual.accent.success,
    '--theme-warning': theme.visual.accent.warning,
    '--theme-danger': theme.visual.accent.danger,
    '--theme-transition': `${theme.motion.transitionMs}ms`,
    '--theme-easing': theme.motion.easing,
    '--theme-spacing-scale': String(theme.layout.spacingScale),
    '--theme-max-columns': String(theme.layout.maxColumns),
  };
};

// =============================================================================
// EXPORTS
// =============================================================================

export default THEME_CONFIG;
