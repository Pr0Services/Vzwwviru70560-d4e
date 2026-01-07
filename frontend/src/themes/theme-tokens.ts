// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — THEME TOKENS
// CANONICAL UI THEMES (CALM • FOCUS • ANALYSIS • EXECUTIVE)
//
// Rules:
// - Themes never change structure, only perception
// - Switching must be instant and non-destructive
// - Agents may recommend a theme but never force it
// ═══════════════════════════════════════════════════════════════════════════════

// =============================================================================
// TYPES
// =============================================================================

export type ThemeId = 'calm' | 'focus' | 'analysis' | 'executive';

export type AgentPresence = 'subtle' | 'operational' | 'visible' | 'minimal';
export type MotionSpeed = 'slow' | 'fast' | 'medium' | 'instant';
export type LayoutDensity = 'spacious' | 'focused' | 'dense' | 'compact';

export interface ThemeColors {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgElevated: string;
  bgHover: string;
  bgActive: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Accents
  accent: string;
  accentHover: string;
  accentMuted: string;

  // States
  success: string;
  warning: string;
  danger: string;

  // Borders
  border: string;
  borderStrong: string;
}

export interface ThemeMotion {
  speed: MotionSpeed;
  durationFast: number;
  durationNormal: number;
  durationSlow: number;
  decorativeAnimations: boolean;
}

export interface ThemeLayout {
  density: LayoutDensity;
  spacing: {
    base: number;
    multiplier: number;
  };
  panelCollapsed: boolean;
  maxVisiblePanels: number;
}

export interface ThemeAgent {
  presence: AgentPresence;
  showSuggestions: boolean;
  suggestionStyle: 'brief' | 'explanatory' | 'direct';
  visibleAgentTypes: string[];
}

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  useCases: string[];
  colors: ThemeColors;
  motion: ThemeMotion;
  layout: ThemeLayout;
  agent: ThemeAgent;
}

// =============================================================================
// THEME: CALM (DEFAULT)
// =============================================================================

export const THEME_CALM: Theme = {
  id: 'calm',
  name: 'Calm',
  description: 'Reduce cognitive load, encourage clarity and reflection.',
  useCases: [
    'Long thinking sessions',
    'Personal organization',
    'Methodology reviews',
    'Evening or fatigue mode',
  ],

  colors: {
    // Very dark, low contrast backgrounds
    bgPrimary: '#0A0C0F',
    bgSecondary: '#0F1216',
    bgElevated: '#151A21',
    bgHover: '#1A2029',
    bgActive: '#1F2633',

    // Soft white, muted secondary text
    textPrimary: '#D8DCE3',
    textSecondary: '#9AA3B3',
    textMuted: '#6B7585',

    // Minimal, blue-tinted accents
    accent: '#4A8FD9',
    accentHover: '#5DA3EC',
    accentMuted: '#3A6FA9',

    // Muted states
    success: '#3D9B76',
    warning: '#D9A54A',
    danger: '#C95A63',

    // Subtle borders
    border: 'rgba(255, 255, 255, 0.05)',
    borderStrong: 'rgba(255, 255, 255, 0.08)',
  },

  motion: {
    speed: 'slow',
    durationFast: 200,
    durationNormal: 350,
    durationSlow: 500,
    decorativeAnimations: false,
  },

  layout: {
    density: 'spacious',
    spacing: {
      base: 8,
      multiplier: 1.5,
    },
    panelCollapsed: true,
    maxVisiblePanels: 2,
  },

  agent: {
    presence: 'subtle',
    showSuggestions: false,
    suggestionStyle: 'brief',
    visibleAgentTypes: [], // Only when explicitly called
  },
};

// =============================================================================
// THEME: FOCUS
// =============================================================================

export const THEME_FOCUS: Theme = {
  id: 'focus',
  name: 'Focus',
  description: 'Enable deep execution and task completion.',
  useCases: [
    'Task execution',
    'Agent task supervision',
    'Short, intense work bursts',
  ],

  colors: {
    // Higher contrast than Calm
    bgPrimary: '#0F1216',
    bgSecondary: '#151A21',
    bgElevated: '#1B2230',
    bgHover: '#232B3A',
    bgActive: '#2A3447',

    // Clear primary accent on current action
    textPrimary: '#E6EAF0',
    textSecondary: '#AEB6C3',
    textMuted: '#7A8496',

    // Strong single accent
    accent: '#5DA9FF',
    accentHover: '#7DBBFF',
    accentMuted: '#4D99EF',

    // Clear states
    success: '#4CAF88',
    warning: '#F5C26B',
    danger: '#E06C75',

    // Visible borders
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.12)',
  },

  motion: {
    speed: 'fast',
    durationFast: 100,
    durationNormal: 150,
    durationSlow: 200,
    decorativeAnimations: false,
  },

  layout: {
    density: 'focused',
    spacing: {
      base: 8,
      multiplier: 1.0,
    },
    panelCollapsed: true,
    maxVisiblePanels: 1,
  },

  agent: {
    presence: 'operational',
    showSuggestions: true,
    suggestionStyle: 'brief',
    visibleAgentTypes: ['operational', 'task'],
  },
};

// =============================================================================
// THEME: ANALYSIS
// =============================================================================

export const THEME_ANALYSIS: Theme = {
  id: 'analysis',
  name: 'Analysis',
  description: 'Explore data, relationships, decisions, and structure.',
  useCases: [
    'Business analysis',
    'Scholar research',
    'Decision comparison',
    'Meeting synthesis',
  ],

  colors: {
    // Slightly brighter background
    bgPrimary: '#12161C',
    bgSecondary: '#181D26',
    bgElevated: '#1E2530',
    bgHover: '#262E3C',
    bgActive: '#2E3848',

    // High contrast text
    textPrimary: '#EDF0F5',
    textSecondary: '#B8C0CE',
    textMuted: '#8891A3',

    // Multiple accent shades allowed
    accent: '#5DA9FF',
    accentHover: '#7DBBFF',
    accentMuted: '#4D99EF',

    // Visible states for analysis
    success: '#4CAF88',
    warning: '#F5C26B',
    danger: '#E06C75',

    // Visible borders for grouping
    border: 'rgba(255, 255, 255, 0.1)',
    borderStrong: 'rgba(255, 255, 255, 0.15)',
  },

  motion: {
    speed: 'medium',
    durationFast: 150,
    durationNormal: 220,
    durationSlow: 300,
    decorativeAnimations: false,
  },

  layout: {
    density: 'dense',
    spacing: {
      base: 8,
      multiplier: 0.875,
    },
    panelCollapsed: false,
    maxVisiblePanels: 4,
  },

  agent: {
    presence: 'visible',
    showSuggestions: true,
    suggestionStyle: 'explanatory',
    visibleAgentTypes: ['analyst', 'research', 'synthesis'],
  },
};

// =============================================================================
// THEME: EXECUTIVE
// =============================================================================

export const THEME_EXECUTIVE: Theme = {
  id: 'executive',
  name: 'Executive',
  description: 'High-level overview, decision-making, and delegation.',
  useCases: [
    'Leadership views',
    'Portfolio oversight',
    'Final decisions',
    'Investor demos',
  ],

  colors: {
    // Clean, sharp contrast
    bgPrimary: '#0D1014',
    bgSecondary: '#13181E',
    bgElevated: '#191F28',
    bgHover: '#212833',
    bgActive: '#29323F',

    // Strong but restrained
    textPrimary: '#F0F2F5',
    textSecondary: '#C0C6D0',
    textMuted: '#8A92A3',

    // Restrained accent
    accent: '#5DA9FF',
    accentHover: '#7DBBFF',
    accentMuted: '#4D99EF',

    // Clear status indicators
    success: '#4CAF88',
    warning: '#F5C26B',
    danger: '#E06C75',

    // Sharp borders
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.12)',
  },

  motion: {
    speed: 'instant',
    durationFast: 80,
    durationNormal: 120,
    durationSlow: 160,
    decorativeAnimations: false,
  },

  layout: {
    density: 'compact',
    spacing: {
      base: 8,
      multiplier: 0.75,
    },
    panelCollapsed: false,
    maxVisiblePanels: 3,
  },

  agent: {
    presence: 'minimal',
    showSuggestions: true,
    suggestionStyle: 'direct',
    visibleAgentTypes: ['decision', 'executive'],
  },
};

// =============================================================================
// THEME REGISTRY
// =============================================================================

export const THEMES: Record<ThemeId, Theme> = {
  calm: THEME_CALM,
  focus: THEME_FOCUS,
  analysis: THEME_ANALYSIS,
  executive: THEME_EXECUTIVE,
};

export const DEFAULT_THEME: ThemeId = 'calm';

// =============================================================================
// THEME HELPERS
// =============================================================================

/**
 * Get theme by ID
 */
export const getTheme = (id: ThemeId): Theme => THEMES[id];

/**
 * Get all theme IDs
 */
export const getThemeIds = (): ThemeId[] => Object.keys(THEMES) as ThemeId[];

/**
 * Get theme spacing with multiplier applied
 */
export const getSpacing = (theme: Theme, units: number): number => {
  return units * theme.layout.spacing.base * theme.layout.spacing.multiplier;
};

/**
 * Get theme duration based on speed
 */
export const getDuration = (
  theme: Theme,
  type: 'fast' | 'normal' | 'slow'
): number => {
  switch (type) {
    case 'fast':
      return theme.motion.durationFast;
    case 'normal':
      return theme.motion.durationNormal;
    case 'slow':
      return theme.motion.durationSlow;
  }
};

/**
 * Check if agent type should be visible in theme
 */
export const isAgentVisible = (theme: Theme, agentType: string): boolean => {
  if (theme.agent.visibleAgentTypes.length === 0) {
    return false; // No agents visible unless explicitly called
  }
  return theme.agent.visibleAgentTypes.includes(agentType);
};

// =============================================================================
// THEME SUGGESTION LOGIC
// =============================================================================

export type UserContext = {
  isStressed?: boolean;
  isOverloaded?: boolean;
  isExecutingTask?: boolean;
  isAnalyzing?: boolean;
  isDecisionMaking?: boolean;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
};

/**
 * Suggest a theme based on user context
 * Returns null if no suggestion is warranted
 */
export const suggestTheme = (context: UserContext): ThemeId | null => {
  // Stress or overload → Calm
  if (context.isStressed || context.isOverloaded) {
    return 'calm';
  }

  // Task execution → Focus
  if (context.isExecutingTask) {
    return 'focus';
  }

  // Analysis or review → Analysis
  if (context.isAnalyzing) {
    return 'analysis';
  }

  // Decision-making → Executive
  if (context.isDecisionMaking) {
    return 'executive';
  }

  // Evening/night → Calm
  if (context.timeOfDay === 'evening' || context.timeOfDay === 'night') {
    return 'calm';
  }

  return null;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default THEMES;
