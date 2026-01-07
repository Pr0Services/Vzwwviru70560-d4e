/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ V50 — AGENT VOICE & DESIGN KIT                          ║
 * ║              & AGENT PERMISSIONS BY SPACE                                    ║
 * ║                                                                              ║
 * ║  Canonical Implementation Block — FINAL                                      ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RÈGLE FONDAMENTALE (NON NÉGOCIABLE):
 * Les agents CHE·NU:
 * - ne sont pas des personnages
 * - n'ont pas de personnalité visible
 * - ne cherchent pas à convaincre
 * - ne parlent que lorsqu'ils sont utiles
 * 
 * Un agent est un outil silencieux, pas un interlocuteur social.
 * 
 * Les agents sont CONTEXTUELS.
 * Leur capacité d'action dépend EXCLUSIVEMENT de l'espace actif.
 * Aucun agent n'a de pouvoir global.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type Space = 'dashboard' | 'collaboration' | 'workspace' | 'knowledge';

export interface AgentMessage {
  context?: string;
  observation: string;
  suggestion?: string;
  nextStep?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1) AGENT VOICE — PRINCIPES GÉNÉRAUX
// ═══════════════════════════════════════════════════════════════════════════════

export const AGENT_VOICE = {
  // ─────────────────────────────────────────────────────────────────────────────
  // TON
  // ─────────────────────────────────────────────────────────────────────────────
  tone: {
    qualities: [
      'neutre',
      'factuel',
      'calme',
      'non émotionnel',
      'jamais enthousiaste',
    ],
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // STYLE
  // ─────────────────────────────────────────────────────────────────────────────
  style: {
    rules: [
      'phrases courtes',
      'vocabulaire simple',
      'aucune exclamation',
      'aucune métaphore',
      'aucune familiarité',
    ],
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // INTERDIT ABSOLU
  // ─────────────────────────────────────────────────────────────────────────────
  forbidden: [
    'emojis',
    'humour',
    'flatterie',
    'excuses excessives',
    '"Great idea!"',
    '"I\'m excited to help!"',
    'Any enthusiastic phrase',
  ],
  
  // Phrases interdites (exemples)
  forbiddenPhrases: [
    'Great idea!',
    'I\'m excited to help!',
    'That\'s awesome!',
    'Perfect!',
    'Amazing!',
    'I love it!',
    'So sorry!',
    'My apologies!',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 2) STRUCTURE DES MESSAGES AGENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Tout message agent suit ce format:
 * 
 * [Context] - Optionnel
 * [Observation] - Requis
 * [Suggestion] - Optionnel
 * [Next step] - Optionnel
 */
export const MESSAGE_STRUCTURE = {
  sections: ['context', 'observation', 'suggestion', 'nextStep'] as const,
  required: ['observation'] as const,
  optional: ['context', 'suggestion', 'nextStep'] as const,
} as const;

/**
 * Formate un message agent selon la structure canonique
 */
export function formatAgentMessage(message: AgentMessage): string {
  const parts: string[] = [];
  
  if (message.context) {
    parts.push(message.context);
  }
  
  parts.push(message.observation);
  
  if (message.suggestion) {
    parts.push(message.suggestion);
  }
  
  if (message.nextStep) {
    parts.push(message.nextStep);
  }
  
  return parts.join('\n\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3) AGENT CAPABILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export const AGENT_CAPABILITIES = {
  allowed: [
    'résumer',
    'structurer',
    'rappeler',
    'signaler incohérences',
    'proposer (jamais imposer)',
  ],
  
  forbidden: [
    'décider',
    'reformuler une décision validée',
    'déclencher une action critique',
    'alerter de manière urgente sans validation',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 4) AGENT PERMISSIONS BY SPACE
// ═══════════════════════════════════════════════════════════════════════════════

export const AGENT_PERMISSIONS: Record<Space, {
  intention: string;
  allowed: string[];
  forbidden: string[];
  messageFormat: {
    maxLines: number | null;
    style: string;
  };
}> = {
  // ─────────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────────
  dashboard: {
    intention: 'Vue de pilotage, lecture rapide',
    allowed: [
      'Résumer l\'état',
      'Afficher décisions actives',
      'Signaler changements récents',
    ],
    forbidden: [
      'Créer ou modifier quoi que ce soit',
      'Initier un meeting',
      'Suggérer une décision',
    ],
    messageFormat: {
      maxLines: 2,
      style: 'état uniquement',
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // COLLABORATION SPACE
  // ─────────────────────────────────────────────────────────────────────────────
  collaboration: {
    intention: 'Réflexion collective, structuration',
    allowed: [
      'Structurer notes',
      'Résumer meetings',
      'Signaler incohérences',
      'Suggérer Topics',
      'Rappeler décisions existantes',
    ],
    forbidden: [
      'Décider',
      'Valider une décision',
      'Modifier une décision existante',
    ],
    messageFormat: {
      maxLines: null,
      style: 'contextuel, structuré, jamais interruptif',
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // WORKSPACE
  // ─────────────────────────────────────────────────────────────────────────────
  workspace: {
    intention: 'Production, concentration',
    allowed: [
      'Assister sur une tâche précise',
      'Rappeler contexte',
      'Proposer organisation',
    ],
    forbidden: [
      'Afficher décisions globales',
      'Initier des réunions',
      'Pousser des suggestions non sollicitées',
    ],
    messageFormat: {
      maxLines: 2,
      style: 'rare, court, orienté action locale',
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // KNOWLEDGE VIEWS
  // ─────────────────────────────────────────────────────────────────────────────
  knowledge: {
    intention: 'Compréhension, exploration',
    allowed: [
      'Générer résumés',
      'Expliquer relations',
      'Proposer navigation',
    ],
    forbidden: [
      'Modifier le graphe',
      'Prioriser visuellement',
      'Déclencher une révision',
    ],
    messageFormat: {
      maxLines: null,
      style: 'explicatif, neutre, lecture seule',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5) DESIGN KIT — TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const DESIGN_TOKENS = {
  // ─────────────────────────────────────────────────────────────────────────────
  // COLORS
  // ─────────────────────────────────────────────────────────────────────────────
  colors: {
    bgRoot: '#1F2429',
    bgDashboard: '#242A30',
    bgCollaboration: '#20262C',
    bgWorkspace: '#1F2429',
    
    surfaceDashboard: '#2A3138',
    surfaceCollaboration: '#2D343C',
    surfaceWorkspace: '#323A42',
    surfaceFocus: '#39424A',
    
    textPrimary: '#E2E5E8',
    textSecondary: '#B5BBC2',
    textMuted: '#8E949B',
    
    accentSoft: 'rgba(191, 174, 122, 0.35)',
    
    borderSubtle: 'rgba(255, 255, 255, 0.04)',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SHADOWS
  // ─────────────────────────────────────────────────────────────────────────────
  shadows: {
    soft: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.28)',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // TYPOGRAPHY
  // ─────────────────────────────────────────────────────────────────────────────
  typography: {
    fontPrimary: "'Inter', 'SF Pro', 'Source Sans 3', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', 'SF Mono', monospace",
    
    sizeXL: '22px',
    sizeLG: '18px',
    sizeMD: '16px',
    sizeBase: '14px',
    sizeSM: '12px',
    
    lineHeightTight: 1.3,
    lineHeightNormal: 1.6,
    lineHeightLoose: 1.65,
    
    weightRegular: 400,
    weightMedium: 500,
    weightSemibold: 600,
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SPACING
  // ─────────────────────────────────────────────────────────────────────────────
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 6) DESIGN KIT — CSS VARIABLES
// ═══════════════════════════════════════════════════════════════════════════════

export const CSS_VARIABLES = `
:root {
  /* Colors */
  --bg-root: ${DESIGN_TOKENS.colors.bgRoot};
  --bg-dashboard: ${DESIGN_TOKENS.colors.bgDashboard};
  --bg-collaboration: ${DESIGN_TOKENS.colors.bgCollaboration};
  --bg-workspace: ${DESIGN_TOKENS.colors.bgWorkspace};
  
  --surface-dashboard: ${DESIGN_TOKENS.colors.surfaceDashboard};
  --surface-collaboration: ${DESIGN_TOKENS.colors.surfaceCollaboration};
  --surface-workspace: ${DESIGN_TOKENS.colors.surfaceWorkspace};
  --surface-focus: ${DESIGN_TOKENS.colors.surfaceFocus};
  
  --text-primary: ${DESIGN_TOKENS.colors.textPrimary};
  --text-secondary: ${DESIGN_TOKENS.colors.textSecondary};
  --text-muted: ${DESIGN_TOKENS.colors.textMuted};
  
  --accent-soft: ${DESIGN_TOKENS.colors.accentSoft};
  --border-subtle: ${DESIGN_TOKENS.colors.borderSubtle};
  
  /* Shadow */
  --shadow-soft: ${DESIGN_TOKENS.shadows.soft};
  
  /* Typography */
  --font-primary: ${DESIGN_TOKENS.typography.fontPrimary};
  --font-mono: ${DESIGN_TOKENS.typography.fontMono};
  
  --font-size-xl: ${DESIGN_TOKENS.typography.sizeXL};
  --font-size-lg: ${DESIGN_TOKENS.typography.sizeLG};
  --font-size-md: ${DESIGN_TOKENS.typography.sizeMD};
  --font-size-base: ${DESIGN_TOKENS.typography.sizeBase};
  --font-size-sm: ${DESIGN_TOKENS.typography.sizeSM};
  
  --line-height-tight: ${DESIGN_TOKENS.typography.lineHeightTight};
  --line-height-normal: ${DESIGN_TOKENS.typography.lineHeightNormal};
  --line-height-loose: ${DESIGN_TOKENS.typography.lineHeightLoose};
  
  --font-weight-regular: ${DESIGN_TOKENS.typography.weightRegular};
  --font-weight-medium: ${DESIGN_TOKENS.typography.weightMedium};
  --font-weight-semibold: ${DESIGN_TOKENS.typography.weightSemibold};
  
  /* Spacing */
  --space-xs: ${DESIGN_TOKENS.spacing.xs};
  --space-sm: ${DESIGN_TOKENS.spacing.sm};
  --space-md: ${DESIGN_TOKENS.spacing.md};
  --space-lg: ${DESIGN_TOKENS.spacing.lg};
  --space-xl: ${DESIGN_TOKENS.spacing.xl};
}
`;

// ═══════════════════════════════════════════════════════════════════════════════
// 7) DESIGN KIT — CORE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const CORE_COMPONENTS = {
  buttons: {
    variants: ['primary', 'secondary', 'ghost'] as const,
    note: 'Primary is rare',
  },
  
  inputs: {
    variants: ['text', 'select', 'textarea'] as const,
  },
  
  surfaces: {
    variants: ['card', 'section', 'panel'] as const,
    note: 'Panel is read-only',
  },
  
  lists: {
    variants: ['vertical', 'timeline'] as const,
  },
  
  modals: {
    variants: ['confirmation'] as const,
    note: 'Jamais bloquants sans raison',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 8) DESIGN KIT — SPECIALIZED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const SPECIALIZED_COMPONENTS = [
  'Meeting Template',
  'Decision Block',
  'Decision Timeline',
  'Topic List',
  'Impact Map',
  'Agent Message Block',
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 9) AGENT UI ELEMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const AGENT_UI_ELEMENTS = {
  // ─────────────────────────────────────────────────────────────────────────────
  // AGENT MESSAGE BLOCK
  // ─────────────────────────────────────────────────────────────────────────────
  messageBlock: {
    surface: 'neutral',
    accentColor: false, // Pas de couleur d'accent
    fontSize: 'smaller than content', // Plus petit que le contenu principal
    alignment: 'left', // Jamais centré
    modal: false, // Jamais modal bloquant
    dismissible: true,
    
    styles: {
      background: DESIGN_TOKENS.colors.surfaceDashboard,
      border: DESIGN_TOKENS.colors.borderSubtle,
      padding: DESIGN_TOKENS.spacing.md,
      borderRadius: '8px',
      fontSize: DESIGN_TOKENS.typography.sizeSM,
      color: DESIGN_TOKENS.colors.textSecondary,
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // AGENT SUGGESTION
  // ─────────────────────────────────────────────────────────────────────────────
  suggestion: {
    visualPriority: 'optional', // Visuellement optionnelle
    autoAccept: false, // Aucun bouton "Accept automatically"
    dismissible: true, // Toujours dismissible
    
    styles: {
      background: 'rgba(255, 255, 255, 0.02)',
      border: DESIGN_TOKENS.colors.borderSubtle,
      padding: DESIGN_TOKENS.spacing.sm,
      borderRadius: '6px',
      fontSize: DESIGN_TOKENS.typography.sizeSM,
      opacity: 0.9,
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // AGENT INDICATOR
  // ─────────────────────────────────────────────────────────────────────────────
  indicator: {
    visibility: 'discret',
    animated: false, // Jamais animé
    pulsing: false, // Jamais pulsant
    
    styles: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: DESIGN_TOKENS.colors.textMuted,
      opacity: 0.5,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 10) DESIGN KIT — COMPONENT STATES
// ═══════════════════════════════════════════════════════════════════════════════

export const COMPONENT_STATES = {
  hover: {
    colorChange: 'subtle',
    sizeChange: false,
    transition: '0.15s ease',
  },
  
  focus: {
    outline: 'subtle',
    ring: '1px solid rgba(110, 175, 196, 0.4)',
  },
  
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    interactive: false,
  },
  
  readOnly: {
    opacity: 0.9,
    cursor: 'default',
    interactive: false,
    border: 'none',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 11) DESIGN KIT STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

export const DESIGN_KIT_STRUCTURE = {
  foundations: [
    'Color Tokens (Theme v1)',
    'Typography Tokens',
    'Spacing & Rhythm',
    'Elevation & Shadows',
  ],
  
  coreComponents: [
    'Buttons',
    'Inputs',
    'Cards / Surfaces',
    'Lists',
    'Modals',
  ],
  
  layoutPatterns: [
    'Dashboard Layout',
    'Workspace Layout',
    'Collaboration Layout',
    'Knowledge Views',
  ],
  
  specializedComponents: [
    'Meeting Template',
    'Decision Block',
    'Decision Timeline',
    'Topic List',
    'Impact Map',
  ],
  
  agentUIElements: [
    'Agent Message Block',
    'Agent Suggestion',
    'Agent Indicator',
  ],
  
  statesAndFeedback: [
    'Hover',
    'Focus',
    'Disabled',
    'Read-only',
  ],
  
  doAndDont: [
    'Anti-patterns',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Vérifie si un agent peut effectuer une action dans un espace donné
 */
export function canAgentPerform(space: Space, action: string): boolean {
  const permissions = AGENT_PERMISSIONS[space];
  const isAllowed = permissions.allowed.some(a => 
    action.toLowerCase().includes(a.toLowerCase())
  );
  const isForbidden = permissions.forbidden.some(f => 
    action.toLowerCase().includes(f.toLowerCase())
  );
  
  return isAllowed && !isForbidden;
}

/**
 * Obtient le format de message pour un espace
 */
export function getMessageFormatForSpace(space: Space): typeof AGENT_PERMISSIONS[Space]['messageFormat'] {
  return AGENT_PERMISSIONS[space].messageFormat;
}

/**
 * Génère les styles pour un message agent
 */
export function getAgentMessageStyles(): React.CSSProperties {
  return {
    backgroundColor: AGENT_UI_ELEMENTS.messageBlock.styles.background,
    border: `1px solid ${AGENT_UI_ELEMENTS.messageBlock.styles.border}`,
    padding: AGENT_UI_ELEMENTS.messageBlock.styles.padding,
    borderRadius: AGENT_UI_ELEMENTS.messageBlock.styles.borderRadius,
    fontSize: AGENT_UI_ELEMENTS.messageBlock.styles.fontSize,
    color: AGENT_UI_ELEMENTS.messageBlock.styles.color,
  };
}

/**
 * Génère les styles pour une suggestion agent
 */
export function getAgentSuggestionStyles(): React.CSSProperties {
  return {
    backgroundColor: AGENT_UI_ELEMENTS.suggestion.styles.background,
    border: `1px solid ${AGENT_UI_ELEMENTS.suggestion.styles.border}`,
    padding: AGENT_UI_ELEMENTS.suggestion.styles.padding,
    borderRadius: AGENT_UI_ELEMENTS.suggestion.styles.borderRadius,
    fontSize: AGENT_UI_ELEMENTS.suggestion.styles.fontSize,
    opacity: AGENT_UI_ELEMENTS.suggestion.styles.opacity,
  };
}

/**
 * Génère les styles pour un indicateur agent
 */
export function getAgentIndicatorStyles(): React.CSSProperties {
  return {
    width: AGENT_UI_ELEMENTS.indicator.styles.width,
    height: AGENT_UI_ELEMENTS.indicator.styles.height,
    borderRadius: AGENT_UI_ELEMENTS.indicator.styles.borderRadius,
    backgroundColor: AGENT_UI_ELEMENTS.indicator.styles.background,
    opacity: AGENT_UI_ELEMENTS.indicator.styles.opacity,
  };
}

/**
 * Vérifie si une phrase est interdite pour un agent
 */
export function isForbiddenPhrase(phrase: string): boolean {
  return AGENT_VOICE.forbiddenPhrases.some(forbidden => 
    phrase.toLowerCase().includes(forbidden.toLowerCase())
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORBIDDEN PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

export const FORBIDDEN_PATTERNS = [
  'Agents globaux',
  'Permissions implicites',
  'Actions critiques sans contexte',
  'UI agent plus visible que le contenu',
  'Composants sans documentation',
  'Agents bavards',
  'Agents "personnifiés"',
  'Bulles de chat envahissantes',
  'Assistants proactifs non sollicités',
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// OBJECTIVES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * OBJECTIF FINAL:
 * 
 * Les agents CHE·NU doivent donner le sentiment:
 * "Le système veille, sans m'interrompre."
 * 
 * Le Design Kit doit permettre:
 * - cohérence
 * - sérénité
 * - évolutivité
 * 
 * CHE·NU reste un environnement de travail,
 * pas une expérience conversationnelle.
 */

export default {
  AGENT_VOICE,
  MESSAGE_STRUCTURE,
  AGENT_CAPABILITIES,
  AGENT_PERMISSIONS,
  DESIGN_TOKENS,
  CSS_VARIABLES,
  CORE_COMPONENTS,
  SPECIALIZED_COMPONENTS,
  AGENT_UI_ELEMENTS,
  COMPONENT_STATES,
  DESIGN_KIT_STRUCTURE,
  formatAgentMessage,
  canAgentPerform,
  getMessageFormatForSpace,
  getAgentMessageStyles,
  getAgentSuggestionStyles,
  getAgentIndicatorStyles,
  isForbiddenPhrase,
};
