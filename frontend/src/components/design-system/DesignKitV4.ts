/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ V50 — DESIGN KIT v4                                     ║
 * ║              FIGMA ↔ DEV MAPPING                                             ║
 * ║                                                                              ║
 * ║  Complete Token System & Component Specifications                           ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RÈGLES FIGMA:
 * - AUCUNE taille custom hors styles
 * - AUCUN bold manuel (poids via styles uniquement)
 * - Auto-layout uniquement pour spacing
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 1) DESIGN TOKENS (JSON FORMAT)
// ═══════════════════════════════════════════════════════════════════════════════

export const DESIGN_TOKENS = {
  color: {
    bg: {
      root: { value: '#1F2429' },
      dashboard: { value: '#242A30' },
      collaboration: { value: '#20262C' },
      workspace: { value: '#1F2429' },
    },
    surface: {
      dashboard: { value: '#2A3138' },
      collaboration: { value: '#2D343C' },
      workspace: { value: '#323A42' },
      focus: { value: '#39424A' },
    },
    text: {
      primary: { value: '#E2E5E8' },
      secondary: { value: '#B5BBC2' },
      muted: { value: '#8E949B' },
    },
    accent: {
      soft: { value: 'rgba(191,174,122,0.35)' },
    },
    border: {
      subtle: { value: 'rgba(255,255,255,0.04)' },
    },
  },
  font: {
    family: {
      primary: { value: 'Inter, SF Pro, Source Sans 3' },
      mono: { value: 'JetBrains Mono, SF Mono' },
    },
    size: {
      xl: { value: '22px' },
      lg: { value: '18px' },
      md: { value: '16px' },
      base: { value: '14px' },
      sm: { value: '12px' },
    },
    weight: {
      regular: { value: 400 },
      medium: { value: 500 },
      semibold: { value: 600 },
    },
    lineHeight: {
      tight: { value: 1.3 },
      normal: { value: 1.6 },
      loose: { value: 1.65 },
    },
  },
  spacing: {
    xs: { value: '4px' },
    sm: { value: '8px' },
    md: { value: '16px' },
    lg: { value: '24px' },
    xl: { value: '32px' },
  },
  radius: {
    sm: { value: '8px' },
    md: { value: '12px' },
    lg: { value: '16px' },
  },
  shadow: {
    soft: {
      value: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.28)',
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 2) FIGMA ↔ DEV MAPPING — COLORS
// ═══════════════════════════════════════════════════════════════════════════════

export const FIGMA_COLOR_MAPPING: Record<string, { token: string; figmaStyle: string }> = {
  'bg.dashboard': {
    token: 'color.bg.dashboard',
    figmaStyle: 'BG / Dashboard',
  },
  'bg.workspace': {
    token: 'color.bg.workspace',
    figmaStyle: 'BG / Workspace',
  },
  'bg.collaboration': {
    token: 'color.bg.collaboration',
    figmaStyle: 'BG / Collaboration',
  },
  'bg.root': {
    token: 'color.bg.root',
    figmaStyle: 'BG / Root',
  },
  'surface.dashboard': {
    token: 'color.surface.dashboard',
    figmaStyle: 'Surface / Dashboard',
  },
  'surface.collaboration': {
    token: 'color.surface.collaboration',
    figmaStyle: 'Surface / Collaboration',
  },
  'surface.workspace': {
    token: 'color.surface.workspace',
    figmaStyle: 'Surface / Workspace',
  },
  'surface.focus': {
    token: 'color.surface.focus',
    figmaStyle: 'Surface / Focus',
  },
  'text.primary': {
    token: 'color.text.primary',
    figmaStyle: 'Text / Primary',
  },
  'text.secondary': {
    token: 'color.text.secondary',
    figmaStyle: 'Text / Secondary',
  },
  'text.muted': {
    token: 'color.text.muted',
    figmaStyle: 'Text / Muted',
  },
  'accent.soft': {
    token: 'color.accent.soft',
    figmaStyle: 'Accent / Soft',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3) FIGMA ↔ DEV MAPPING — TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════════

export const FIGMA_TYPOGRAPHY_MAPPING: Record<string, {
  usage: string;
  figmaStyle: string;
  size: string;
  weight: number;
  lineHeight: number;
}> = {
  titleXL: {
    usage: 'Title XL',
    figmaStyle: 'Title / XL',
    size: '22px',
    weight: 500,
    lineHeight: 1.3,
  },
  title: {
    usage: 'Title',
    figmaStyle: 'Title / Base',
    size: '18px',
    weight: 500,
    lineHeight: 1.35,
  },
  section: {
    usage: 'Section',
    figmaStyle: 'Section',
    size: '16px',
    weight: 500,
    lineHeight: 1.4,
  },
  body: {
    usage: 'Body',
    figmaStyle: 'Body / Base',
    size: '14px',
    weight: 400,
    lineHeight: 1.6,
  },
  meta: {
    usage: 'Meta',
    figmaStyle: 'Meta',
    size: '12px',
    weight: 400,
    lineHeight: 1.45,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4) FIGMA ↔ DEV MAPPING — SPACING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ⚠️ Auto-layout uniquement dans Figma
 */
export const FIGMA_SPACING_MAPPING: Record<string, {
  token: string;
  usage: string;
  value: string;
}> = {
  xs: {
    token: 'spacing.xs',
    usage: 'Micro gaps',
    value: '4px',
  },
  sm: {
    token: 'spacing.sm',
    usage: 'Small gaps, inline spacing',
    value: '8px',
  },
  md: {
    token: 'spacing.md',
    usage: 'Padding standard',
    value: '16px',
  },
  lg: {
    token: 'spacing.lg',
    usage: 'Séparation sections',
    value: '24px',
  },
  xl: {
    token: 'spacing.xl',
    usage: 'Respiration layout',
    value: '32px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5) CORE COMPONENTS SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const COMPONENT_SPECS = {
  // ─────────────────────────────────────────────────────────────────────────────
  // SURFACE / CARD
  // ─────────────────────────────────────────────────────────────────────────────
  surfaceCard: {
    background: 'color.surface.*',
    radius: 'radius.md', // 12px
    shadow: 'shadow.soft',
    padding: 'spacing.md', // 16px
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // BUTTONS
  // ─────────────────────────────────────────────────────────────────────────────
  buttons: {
    primary: {
      note: '(rare)',
      background: 'color.accent.soft',
      text: 'color.text.primary',
      radius: 'radius.sm',
      padding: 'spacing.sm spacing.md',
    },
    secondary: {
      background: 'color.surface.*',
      border: 'color.border.subtle',
      text: 'color.text.secondary',
      radius: 'radius.sm',
      padding: 'spacing.sm spacing.md',
    },
    ghost: {
      background: 'transparent',
      text: 'color.text.secondary',
      border: 'none',
      padding: 'spacing.sm',
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // AGENT MESSAGE BLOCK
  // ─────────────────────────────────────────────────────────────────────────────
  agentMessageBlock: {
    surface: 'color.surface.collaboration',
    text: 'color.text.secondary',
    fontSize: 'font.size.sm', // 12px
    radius: 'radius.sm', // 8px
    dismissible: true,
    modal: false,
    note: 'Toujours dismissible',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 6) SPECIALIZED COMPONENTS SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const SPECIALIZED_COMPONENT_SPECS = {
  // ─────────────────────────────────────────────────────────────────────────────
  // DECISION BLOCK
  // ─────────────────────────────────────────────────────────────────────────────
  decisionBlock: {
    title: {
      weight: 'font.weight.semibold', // 600
    },
    body: {
      weight: 'font.weight.regular', // 400
    },
    spacing: 'spacing.lg', // 24px espacement vertical
    rules: {
      borderLeft: false, // INTERDIT
      highlight: 'espacement + contraste', // PAS couleur
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // DECISION TIMELINE ITEM
  // ─────────────────────────────────────────────────────────────────────────────
  decisionTimelineItem: {
    active: {
      opacity: 1,
    },
    superseded: {
      opacity: 0.55,
    },
    dot: {
      color: 'color.text.muted', // PAS accent
      size: '6px',
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // TOPIC LIST
  // ─────────────────────────────────────────────────────────────────────────────
  topicList: {
    style: 'text simple',
    badges: false, // Aucun badge
    spacing: 'vertical > visuel',
    fontSize: 'font.size.sm',
    color: 'color.text.secondary',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // IMPACT MAP
  // ─────────────────────────────────────────────────────────────────────────────
  impactMap: {
    nodes: 'neutres',
    colorCoding: false, // Aucun code couleur par type
    highlight: 'légère élévation seulement',
    animation: false,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 7) AGENT UI PERMISSIONS BY SPACE
// ═══════════════════════════════════════════════════════════════════════════════

export type AgentUIType = 'inline_status' | 'contextual_block' | 'inline_helper' | 'readonly_explanation';

export const AGENT_UI_BY_SPACE: Record<string, {
  space: string;
  uiType: AgentUIType;
  description: string;
}> = {
  dashboard: {
    space: 'Dashboard',
    uiType: 'inline_status',
    description: 'Inline status only',
  },
  collaboration: {
    space: 'Collaboration',
    uiType: 'contextual_block',
    description: 'Contextual block',
  },
  workspace: {
    space: 'Workspace',
    uiType: 'inline_helper',
    description: 'Rare inline helper',
  },
  knowledge: {
    space: 'Knowledge',
    uiType: 'readonly_explanation',
    description: 'Read-only explanation',
  },
};

// Agent UI Restrictions
export const AGENT_UI_RESTRICTIONS = {
  modal: false, // ❌ Pas de modal agent
  notification: false, // ❌ Pas de notification push
  persistentChat: false, // ❌ Pas de chat persistant
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 8) CSS VARIABLES OUTPUT
// ═══════════════════════════════════════════════════════════════════════════════

export const CSS_VARIABLES = `
:root {
  /* ═══ COLORS ═══ */
  --color-bg-root: ${DESIGN_TOKENS.color.bg.root.value};
  --color-bg-dashboard: ${DESIGN_TOKENS.color.bg.dashboard.value};
  --color-bg-collaboration: ${DESIGN_TOKENS.color.bg.collaboration.value};
  --color-bg-workspace: ${DESIGN_TOKENS.color.bg.workspace.value};
  
  --color-surface-dashboard: ${DESIGN_TOKENS.color.surface.dashboard.value};
  --color-surface-collaboration: ${DESIGN_TOKENS.color.surface.collaboration.value};
  --color-surface-workspace: ${DESIGN_TOKENS.color.surface.workspace.value};
  --color-surface-focus: ${DESIGN_TOKENS.color.surface.focus.value};
  
  --color-text-primary: ${DESIGN_TOKENS.color.text.primary.value};
  --color-text-secondary: ${DESIGN_TOKENS.color.text.secondary.value};
  --color-text-muted: ${DESIGN_TOKENS.color.text.muted.value};
  
  --color-accent-soft: ${DESIGN_TOKENS.color.accent.soft.value};
  --color-border-subtle: ${DESIGN_TOKENS.color.border.subtle.value};
  
  /* ═══ TYPOGRAPHY ═══ */
  --font-family-primary: ${DESIGN_TOKENS.font.family.primary.value};
  --font-family-mono: ${DESIGN_TOKENS.font.family.mono.value};
  
  --font-size-xl: ${DESIGN_TOKENS.font.size.xl.value};
  --font-size-lg: ${DESIGN_TOKENS.font.size.lg.value};
  --font-size-md: ${DESIGN_TOKENS.font.size.md.value};
  --font-size-base: ${DESIGN_TOKENS.font.size.base.value};
  --font-size-sm: ${DESIGN_TOKENS.font.size.sm.value};
  
  --font-weight-regular: ${DESIGN_TOKENS.font.weight.regular.value};
  --font-weight-medium: ${DESIGN_TOKENS.font.weight.medium.value};
  --font-weight-semibold: ${DESIGN_TOKENS.font.weight.semibold.value};
  
  --line-height-tight: ${DESIGN_TOKENS.font.lineHeight.tight.value};
  --line-height-normal: ${DESIGN_TOKENS.font.lineHeight.normal.value};
  --line-height-loose: ${DESIGN_TOKENS.font.lineHeight.loose.value};
  
  /* ═══ SPACING ═══ */
  --spacing-xs: ${DESIGN_TOKENS.spacing.xs.value};
  --spacing-sm: ${DESIGN_TOKENS.spacing.sm.value};
  --spacing-md: ${DESIGN_TOKENS.spacing.md.value};
  --spacing-lg: ${DESIGN_TOKENS.spacing.lg.value};
  --spacing-xl: ${DESIGN_TOKENS.spacing.xl.value};
  
  /* ═══ RADIUS ═══ */
  --radius-sm: ${DESIGN_TOKENS.radius.sm.value};
  --radius-md: ${DESIGN_TOKENS.radius.md.value};
  --radius-lg: ${DESIGN_TOKENS.radius.lg.value};
  
  /* ═══ SHADOW ═══ */
  --shadow-soft: ${DESIGN_TOKENS.shadow.soft.value};
}
`;

// ═══════════════════════════════════════════════════════════════════════════════
// 9) FIGMA RULES (STRICT)
// ═══════════════════════════════════════════════════════════════════════════════

export const FIGMA_RULES = {
  typography: {
    customSizes: false, // AUCUNE taille custom hors styles
    manualBold: false, // AUCUN bold manuel
    weightsViaStyles: true, // Poids via styles uniquement
  },
  spacing: {
    autoLayoutOnly: true, // Auto-layout uniquement
    manualSpacing: false,
  },
  colors: {
    customColors: false, // Via styles uniquement
    opacity: 'via styles',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Résout un token en sa valeur CSS
 */
export function resolveToken(tokenPath: string): string {
  const parts = tokenPath.split('.');
  let value: unknown = DESIGN_TOKENS;
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return tokenPath; // Return original if not found
    }
  }
  
  return value?.value ?? tokenPath;
}

/**
 * Génère les styles pour un composant Surface/Card
 */
export function getSurfaceCardStyles(variant: 'dashboard' | 'collaboration' | 'workspace' = 'dashboard'): React.CSSProperties {
  return {
    backgroundColor: DESIGN_TOKENS.color.surface[variant].value,
    borderRadius: DESIGN_TOKENS.radius.md.value,
    boxShadow: DESIGN_TOKENS.shadow.soft.value,
    padding: DESIGN_TOKENS.spacing.md.value,
  };
}

/**
 * Génère les styles pour un bouton
 */
export function getButtonStyles(variant: 'primary' | 'secondary' | 'ghost'): React.CSSProperties {
  const spec = COMPONENT_SPECS.buttons[variant];
  
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: DESIGN_TOKENS.color.accent.soft.value,
        color: DESIGN_TOKENS.color.text.primary.value,
        borderRadius: DESIGN_TOKENS.radius.sm.value,
        padding: `${DESIGN_TOKENS.spacing.sm.value} ${DESIGN_TOKENS.spacing.md.value}`,
        border: 'none',
      };
    case 'secondary':
      return {
        backgroundColor: DESIGN_TOKENS.color.surface.dashboard.value,
        border: `1px solid ${DESIGN_TOKENS.color.border.subtle.value}`,
        color: DESIGN_TOKENS.color.text.secondary.value,
        borderRadius: DESIGN_TOKENS.radius.sm.value,
        padding: `${DESIGN_TOKENS.spacing.sm.value} ${DESIGN_TOKENS.spacing.md.value}`,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: DESIGN_TOKENS.color.text.secondary.value,
        border: 'none',
        padding: DESIGN_TOKENS.spacing.sm.value,
      };
  }
}

/**
 * Génère les styles pour un Decision Block
 */
export function getDecisionBlockStyles(): {
  container: React.CSSProperties;
  title: React.CSSProperties;
  body: React.CSSProperties;
} {
  return {
    container: {
      marginBottom: DESIGN_TOKENS.spacing.lg.value,
    },
    title: {
      fontWeight: DESIGN_TOKENS.font.weight.semibold.value,
      fontSize: DESIGN_TOKENS.font.size.base.value,
      color: DESIGN_TOKENS.color.text.primary.value,
      marginBottom: DESIGN_TOKENS.spacing.sm.value,
    },
    body: {
      fontWeight: DESIGN_TOKENS.font.weight.regular.value,
      fontSize: DESIGN_TOKENS.font.size.base.value,
      color: DESIGN_TOKENS.color.text.secondary.value,
    },
  };
}

/**
 * Génère les styles pour un Timeline Item
 */
export function getTimelineItemStyles(status: 'active' | 'superseded'): React.CSSProperties {
  const spec = SPECIALIZED_COMPONENT_SPECS.decisionTimelineItem;
  
  return {
    opacity: status === 'active' ? spec.active.opacity : spec.superseded.opacity,
  };
}

/**
 * Génère les styles pour l'Agent Message Block
 */
export function getAgentMessageBlockStyles(): React.CSSProperties {
  return {
    backgroundColor: DESIGN_TOKENS.color.surface.collaboration.value,
    color: DESIGN_TOKENS.color.text.secondary.value,
    fontSize: DESIGN_TOKENS.font.size.sm.value,
    borderRadius: DESIGN_TOKENS.radius.sm.value,
    padding: DESIGN_TOKENS.spacing.md.value,
    border: `1px solid ${DESIGN_TOKENS.color.border.subtle.value}`,
  };
}

/**
 * Exporte les tokens au format JSON
 */
export function exportTokensJSON(): string {
  return JSON.stringify(DESIGN_TOKENS, null, 2);
}

/**
 * Obtient le type d'UI agent pour un espace
 */
export function getAgentUIForSpace(space: keyof typeof AGENT_UI_BY_SPACE): AgentUIType {
  return AGENT_UI_BY_SPACE[space].uiType;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  DESIGN_TOKENS,
  FIGMA_COLOR_MAPPING,
  FIGMA_TYPOGRAPHY_MAPPING,
  FIGMA_SPACING_MAPPING,
  COMPONENT_SPECS,
  SPECIALIZED_COMPONENT_SPECS,
  AGENT_UI_BY_SPACE,
  AGENT_UI_RESTRICTIONS,
  CSS_VARIABLES,
  FIGMA_RULES,
  resolveToken,
  getSurfaceCardStyles,
  getButtonStyles,
  getDecisionBlockStyles,
  getTimelineItemStyles,
  getAgentMessageBlockStyles,
  exportTokensJSON,
  getAgentUIForSpace,
};
