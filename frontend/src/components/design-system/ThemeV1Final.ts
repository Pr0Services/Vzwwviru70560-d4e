/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ V50 — THEME v1 FINAL                                    ║
 * ║              & TYPOGRAPHY BY ROLE                                            ║
 * ║                                                                              ║
 * ║  Canonical Design System Block — VERSION: LOCKED                             ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RÈGLE FONDAMENTALE (NON NÉGOCIABLE):
 * CHE·NU possède UN SEUL THEME.
 * 
 * Les rôles n'introduisent JAMAIS:
 * - de nouvelles couleurs
 * - de nouvelles polices
 * - de nouveaux styles
 * 
 * L'adaptation par rôle est TYPOGRAPHIQUE et RYTHMIQUE uniquement.
 * 
 * OBJECTIF:
 * "Quel que soit mon rôle, cet espace me respecte."
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type UserRole = 
  | 'owner'       // Owner / Founder
  | 'contributor' // Contributor / Team Member
  | 'facilitator' // Facilitator / Lead
  | 'observer';   // Observer / Read-only

// ═══════════════════════════════════════════════════════════════════════════════
// 1) CHE·NU THEME v1 — TOKENS FINAUX (LOCKED)
// ═══════════════════════════════════════════════════════════════════════════════

export const THEME_V1 = {
  // ─────────────────────────────────────────────────────────────────────────────
  // COLORS (STABLE)
  // ─────────────────────────────────────────────────────────────────────────────
  colors: {
    // Backgrounds
    bgRoot: '#1F2429',
    bgDashboard: '#242A30',
    bgCollaboration: '#20262C',
    bgWorkspace: '#1F2429',
    
    // Surfaces
    surfaceDashboard: '#2A3138',
    surfaceCollaboration: '#2D343C',
    surfaceWorkspace: '#323A42',
    surfaceFocus: '#39424A',
    
    // Text
    textPrimary: '#E2E5E8',
    textSecondary: '#B5BBC2',
    textMuted: '#8E949B',
    
    // Accent (RARE)
    accentSoft: 'rgba(191, 174, 122, 0.35)',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // BORDERS & SHADOWS
  // ─────────────────────────────────────────────────────────────────────────────
  borders: {
    subtle: 'rgba(255, 255, 255, 0.04)',
  },
  
  shadows: {
    soft: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.28)',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// CSS VARIABLES (EXPORT)
// ═══════════════════════════════════════════════════════════════════════════════

export const THEME_CSS_VARIABLES = {
  // Backgrounds
  '--bg-root': THEME_V1.colors.bgRoot,
  '--bg-dashboard': THEME_V1.colors.bgDashboard,
  '--bg-collaboration': THEME_V1.colors.bgCollaboration,
  '--bg-workspace': THEME_V1.colors.bgWorkspace,
  
  // Surfaces
  '--surface-dashboard': THEME_V1.colors.surfaceDashboard,
  '--surface-collaboration': THEME_V1.colors.surfaceCollaboration,
  '--surface-workspace': THEME_V1.colors.surfaceWorkspace,
  '--surface-focus': THEME_V1.colors.surfaceFocus,
  
  // Text
  '--text-primary': THEME_V1.colors.textPrimary,
  '--text-secondary': THEME_V1.colors.textSecondary,
  '--text-muted': THEME_V1.colors.textMuted,
  
  // Accent
  '--accent-soft': THEME_V1.colors.accentSoft,
  
  // Borders & Shadows
  '--border-subtle': THEME_V1.borders.subtle,
  '--shadow-soft': THEME_V1.shadows.soft,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 2) TYPOGRAPHY — BASE (COMMUNE À TOUS)
// ═══════════════════════════════════════════════════════════════════════════════

export const TYPOGRAPHY_BASE = {
  // Font Family
  fontFamily: {
    primary: "'Inter', 'SF Pro', 'Source Sans 3', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', monospace",
  },
  
  // Base Text
  base: {
    size: '14px',
    lineHeight: 1.6,
    weight: 400, // Regular
  },
  
  // Scale
  scale: {
    titleXL: { size: '21px', lineHeight: 1.3, weight: 500 },
    title: { size: '17px', lineHeight: 1.35, weight: 500 },
    section: { size: '15px', lineHeight: 1.4, weight: 500 },
    body: { size: '14px', lineHeight: 1.6, weight: 400 },
    meta: { size: '12px', lineHeight: 1.45, weight: 400 },
  },
  
  // Weights
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 3) TYPOGRAPHY BY ROLE (SUBTLE ADAPTATION)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Les rôles influencent:
 * - le poids
 * - l'espacement
 * - la densité
 * 
 * PAS la couleur ni la taille de base.
 */
export const TYPOGRAPHY_BY_ROLE: Record<UserRole, {
  intention: string[];
  adjustments: {
    titleWeight: number;
    sectionWeight: number;
    bodyWeight: number;
    decisionWeight: number;
    metaContrast: 'standard' | 'increased';
    verticalSpacing: number; // multiplier (1 = standard)
    density: 'standard' | 'reduced';
  };
}> = {
  // ─────────────────────────────────────────────────────────────────────────────
  // ROLE: OWNER / FOUNDER
  // ─────────────────────────────────────────────────────────────────────────────
  owner: {
    intention: [
      'vision globale',
      'décisions structurantes',
      'lecture synthétique',
    ],
    adjustments: {
      titleWeight: 600, // Medium → Semibold
      sectionWeight: 500,
      bodyWeight: 400,
      decisionWeight: 600, // Semibold
      metaContrast: 'increased', // Légèrement plus contrastée
      verticalSpacing: 1.05, // +5%
      density: 'standard',
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ROLE: CONTRIBUTOR / TEAM MEMBER
  // ─────────────────────────────────────────────────────────────────────────────
  contributor: {
    intention: [
      'produire',
      'collaborer',
      'écrire longtemps',
    ],
    adjustments: {
      titleWeight: 500, // Medium
      sectionWeight: 500,
      bodyWeight: 400, // Regular
      decisionWeight: 500,
      metaContrast: 'standard',
      verticalSpacing: 1.0, // Standard
      density: 'standard',
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ROLE: FACILITATOR / LEAD
  // ─────────────────────────────────────────────────────────────────────────────
  facilitator: {
    intention: [
      'guider les discussions',
      'clarifier',
      'structurer sans imposer',
    ],
    adjustments: {
      titleWeight: 500, // Medium
      sectionWeight: 500, // Medium
      bodyWeight: 400,
      decisionWeight: 500, // Medium
      metaContrast: 'standard',
      verticalSpacing: 1.08, // +8%
      density: 'standard', // Séparations plus visibles via spacing
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ROLE: OBSERVER / READ-ONLY
  // ─────────────────────────────────────────────────────────────────────────────
  observer: {
    intention: [
      'comprendre rapidement',
      'ne pas intervenir',
    ],
    adjustments: {
      titleWeight: 400, // Regular
      sectionWeight: 400,
      bodyWeight: 400, // Regular
      decisionWeight: 500,
      metaContrast: 'increased', // Meta plus visible
      verticalSpacing: 1.0,
      density: 'reduced', // Légèrement réduite
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4) NOTES vs DECISIONS (TOUS RÔLES)
// ═══════════════════════════════════════════════════════════════════════════════

export const CONTENT_TYPES = {
  notes: {
    weight: 400, // Regular
    color: '--text-secondary',
    accent: 'none',
    maxWidth: '65ch', // Largeur confortable
  },
  
  decisions: {
    weight: 'role-dependent', // Medium ou Semibold selon rôle
    color: '--text-primary',
    verticalSpacingMultiplier: 1.1, // +10%
    display: 'distinct-block',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Génère les styles typographiques pour un rôle donné
 */
export function getTypographyForRole(role: UserRole): {
  title: React.CSSProperties;
  section: React.CSSProperties;
  body: React.CSSProperties;
  decision: React.CSSProperties;
  meta: React.CSSProperties;
  note: React.CSSProperties;
} {
  const roleConfig = TYPOGRAPHY_BY_ROLE[role];
  const spacing = roleConfig.adjustments.verticalSpacing;
  
  return {
    title: {
      fontFamily: TYPOGRAPHY_BASE.fontFamily.primary,
      fontSize: TYPOGRAPHY_BASE.scale.title.size,
      lineHeight: TYPOGRAPHY_BASE.scale.title.lineHeight,
      fontWeight: roleConfig.adjustments.titleWeight,
      color: THEME_V1.colors.textPrimary,
      marginBottom: `${16 * spacing}px`,
    },
    
    section: {
      fontFamily: TYPOGRAPHY_BASE.fontFamily.primary,
      fontSize: TYPOGRAPHY_BASE.scale.section.size,
      lineHeight: TYPOGRAPHY_BASE.scale.section.lineHeight,
      fontWeight: roleConfig.adjustments.sectionWeight,
      color: THEME_V1.colors.textPrimary,
      marginBottom: `${12 * spacing}px`,
    },
    
    body: {
      fontFamily: TYPOGRAPHY_BASE.fontFamily.primary,
      fontSize: TYPOGRAPHY_BASE.scale.body.size,
      lineHeight: TYPOGRAPHY_BASE.scale.body.lineHeight,
      fontWeight: roleConfig.adjustments.bodyWeight,
      color: THEME_V1.colors.textSecondary,
    },
    
    decision: {
      fontFamily: TYPOGRAPHY_BASE.fontFamily.primary,
      fontSize: TYPOGRAPHY_BASE.scale.body.size,
      lineHeight: TYPOGRAPHY_BASE.scale.body.lineHeight,
      fontWeight: roleConfig.adjustments.decisionWeight,
      color: THEME_V1.colors.textPrimary,
      marginBottom: `${16 * 1.1}px`, // +10%
    },
    
    meta: {
      fontFamily: TYPOGRAPHY_BASE.fontFamily.primary,
      fontSize: TYPOGRAPHY_BASE.scale.meta.size,
      lineHeight: TYPOGRAPHY_BASE.scale.meta.lineHeight,
      fontWeight: TYPOGRAPHY_BASE.weights.regular,
      color: roleConfig.adjustments.metaContrast === 'increased' 
        ? THEME_V1.colors.textSecondary 
        : THEME_V1.colors.textMuted,
    },
    
    note: {
      fontFamily: TYPOGRAPHY_BASE.fontFamily.primary,
      fontSize: TYPOGRAPHY_BASE.scale.body.size,
      lineHeight: TYPOGRAPHY_BASE.scale.body.lineHeight,
      fontWeight: CONTENT_TYPES.notes.weight,
      color: THEME_V1.colors.textSecondary,
      maxWidth: CONTENT_TYPES.notes.maxWidth,
    },
  };
}

/**
 * Génère le multiplicateur d'espacement pour un rôle
 */
export function getSpacingMultiplier(role: UserRole): number {
  return TYPOGRAPHY_BY_ROLE[role].adjustments.verticalSpacing;
}

/**
 * Vérifie si la densité doit être réduite pour un rôle
 */
export function shouldReduceDensity(role: UserRole): boolean {
  return TYPOGRAPHY_BY_ROLE[role].adjustments.density === 'reduced';
}

/**
 * Obtient le poids de police pour les décisions selon le rôle
 */
export function getDecisionWeight(role: UserRole): number {
  return TYPOGRAPHY_BY_ROLE[role].adjustments.decisionWeight;
}

/**
 * Génère les CSS variables du thème
 */
export function generateThemeCSSVariables(): string {
  return Object.entries(THEME_CSS_VARIABLES)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ');
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5) CE QUI EST STRICTEMENT INTERDIT
// ═══════════════════════════════════════════════════════════════════════════════

export const FORBIDDEN_PATTERNS = [
  'Thèmes par rôle',
  'Couleurs par rôle',
  'Tailles de texte différentes par rôle',
  'Bold généralisé',
  'Effets typographiques décoratifs',
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 6) TESTS DE VALIDATION (OBLIGATOIRES)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Pour CHAQUE rôle:
 * 
 * 1) Lecture 10 minutes sans fatigue → OK
 * 2) Décision repérée en < 2 secondes → OK
 * 3) Notes lisibles sans distraction → OK
 * 4) Aucun élément typographique ne domine inutilement
 * 
 * Si un test échoue → ajuster l'espacement, PAS la couleur.
 */
export const VALIDATION_TESTS = [
  {
    id: 'sustained_reading',
    name: 'Lecture soutenue',
    question: 'Lecture 10 minutes sans fatigue → OK ?',
    action: 'Si échec: ajuster espacement',
  },
  {
    id: 'decision_spotting',
    name: 'Repérage décision',
    question: 'Décision repérée en < 2 secondes → OK ?',
    action: 'Si échec: ajuster poids',
  },
  {
    id: 'notes_readability',
    name: 'Notes lisibles',
    question: 'Notes lisibles sans distraction → OK ?',
    action: 'Si échec: réduire contraste décisions',
  },
  {
    id: 'no_dominance',
    name: 'Pas de dominance',
    question: 'Aucun élément typographique ne domine inutilement ?',
    action: 'Si échec: uniformiser poids',
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ROLE DESCRIPTIONS (FOR UI)
// ═══════════════════════════════════════════════════════════════════════════════

export const ROLE_DESCRIPTIONS: Record<UserRole, {
  name: string;
  icon: string;
  description: string;
}> = {
  owner: {
    name: 'Owner / Founder',
    icon: '👑',
    description: 'Vision globale, décisions structurantes',
  },
  contributor: {
    name: 'Contributor / Team Member',
    icon: '✍️',
    description: 'Produire, collaborer, écrire',
  },
  facilitator: {
    name: 'Facilitator / Lead',
    icon: '🎯',
    description: 'Guider, clarifier, structurer',
  },
  observer: {
    name: 'Observer / Read-only',
    icon: '👁️',
    description: 'Comprendre rapidement',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// OBJECTIVES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * OBJECTIF FINAL:
 * 
 * CHE·NU doit donner le sentiment:
 * "Quel que soit mon rôle, cet espace me respecte."
 * 
 * Même langage visuel.
 * Même calme.
 * Même cohérence.
 * 
 * Le système s'adapte à l'humain,
 * sans jamais se fragmenter.
 */

export default {
  THEME_V1,
  THEME_CSS_VARIABLES,
  TYPOGRAPHY_BASE,
  TYPOGRAPHY_BY_ROLE,
  CONTENT_TYPES,
  getTypographyForRole,
  getSpacingMultiplier,
  shouldReduceDensity,
  getDecisionWeight,
  generateThemeCSSVariables,
  ROLE_DESCRIPTIONS,
  VALIDATION_TESTS,
};
