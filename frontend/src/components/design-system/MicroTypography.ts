/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ V50 — MICRO-TYPOGRAPHY CANON                            ║
 * ║                                                                              ║
 * ║  Readability, Rhythm & Cognitive Comfort                                     ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RÈGLE FONDAMENTALE (NON NÉGOCIABLE):
 * La typographie CHE·NU doit:
 * - disparaître quand on lit
 * - guider sans attirer l'attention
 * - respirer verticalement
 * 
 * Si on remarque la typo, c'est qu'elle est trop présente.
 * 
 * OBJECTIF:
 * L'utilisateur doit sentir: "Je peux lire, réfléchir et décider ici sans effort."
 * Pas: "C'est beau, mais fatigant."
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 1) FONTS — RÔLES STRICTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PRINCIPES:
 * - une seule famille principale
 * - pas de mélange décoratif
 * - pas de contraste extrême
 * 
 * INTERDIT:
 * - polices fantaisie
 * - variations excessives
 * - italique décoratif
 */
export const FONT_FAMILIES = {
  // Famille principale (UI / Text)
  primary: "'Inter', 'SF Pro', 'Source Sans 3', system-ui, sans-serif",
  
  // Monospace (rare) - pour code uniquement
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  
  // INTERDIT: polices fantaisie, variations excessives
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 2) ÉCHELLE TYPOGRAPHIQUE (SIMPLE & STABLE)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Utiliser une échelle douce (≈1.2)
 * 
 * INTERDIT:
 * - tailles inférieures à 12px
 * - contrastes de taille agressifs
 */
export const TYPE_SCALE = {
  // Title XL: 20-22px / 1.3
  titleXL: {
    size: '21px',
    lineHeight: 1.3,
    weight: 500,
    letterSpacing: '-0.01em',
  },
  
  // Title: 17-18px / 1.35
  title: {
    size: '17px',
    lineHeight: 1.35,
    weight: 500,
    letterSpacing: '-0.01em',
  },
  
  // Section: 15-16px / 1.4
  section: {
    size: '15px',
    lineHeight: 1.4,
    weight: 500,
    letterSpacing: '0',
  },
  
  // Body: 14px / 1.6 ← BASE
  body: {
    size: '14px',
    lineHeight: 1.6,
    weight: 400,
    letterSpacing: '0',
  },
  
  // Meta: 12-13px / 1.5
  meta: {
    size: '12px',
    lineHeight: 1.5,
    weight: 400,
    letterSpacing: '+0.02em',
  },
  
  // Small (minimum allowed): 12px
  small: {
    size: '12px',
    lineHeight: 1.45,
    weight: 400,
    letterSpacing: '+0.02em',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 3) LINE-HEIGHT (CLÉ DU CONFORT)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * RÈGLE SIMPLE:
 * Plus le texte est long, plus il respire.
 * 
 * INTERDIT:
 * - line-height < 1.4 pour le body
 */
export const LINE_HEIGHTS = {
  // Titres courts
  tight: 1.3,
  title: 1.35,
  
  // Sections
  section: 1.4,
  
  // Paragraphes (confort lecture)
  body: 1.6,
  bodyRelaxed: 1.65,
  
  // Listes
  list: 1.55,
  
  // Meta / Dates
  meta: 1.45,
  
  // MINIMUM ABSOLU pour body
  minimum: 1.4,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 4) LETTER-SPACING (TRÈS SUBTIL)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * UTILISATION MINIMALE
 * 
 * INTERDIT:
 * - tracking excessif
 * - uppercase + tracking fort
 */
export const LETTER_SPACING = {
  // Body text: aucun
  body: '0',
  
  // Titles: très léger resserrement (optionnel)
  title: '-0.01em',
  
  // Meta / labels: léger écartement
  meta: '0.02em',
  
  // INTERDIT: valeurs > 0.05em ou < -0.02em
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 5) POIDS (FONT-WEIGHT) — PAR INTENTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * UTILISER PEU DE POIDS
 * 
 * INTERDIT:
 * - bold généralisé
 * - variations multiples sur un même écran
 */
export const FONT_WEIGHTS = {
  // Light: rare (citations longues)
  light: 300,
  
  // Regular: lecture principale
  regular: 400,
  
  // Medium: titres, sections
  medium: 500,
  
  // Semibold: décisions actives UNIQUEMENT
  semibold: 600,
  
  // Bold: INTERDIT en usage général
  // bold: 700, // Ne pas utiliser
} as const;

// Usage par contexte
export const WEIGHT_BY_CONTEXT = {
  // Lecture principale
  body: FONT_WEIGHTS.regular,
  paragraph: FONT_WEIGHTS.regular,
  
  // Titres et sections
  title: FONT_WEIGHTS.medium,
  section: FONT_WEIGHTS.medium,
  
  // Décisions actives UNIQUEMENT
  decisionActive: FONT_WEIGHTS.semibold,
  
  // Citations longues (rare)
  quote: FONT_WEIGHTS.light,
  
  // Notes: toujours regular
  note: FONT_WEIGHTS.regular,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 6) NOTES vs DECISIONS — MICRO-DIFFÉRENCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * La différence doit être RESSENTIE, pas explicitement vue.
 */
export const NOTES_VS_DECISIONS = {
  // NOTES
  notes: {
    weight: FONT_WEIGHTS.regular,
    color: '#B8BDC3', // Légèrement atténuée
    highlight: 'none',
    spacing: 'normal',
  },
  
  // DECISIONS
  decisions: {
    weight: FONT_WEIGHTS.medium, // ou semibold pour active
    color: '#E6E8EA', // Contraste +8-10%
    highlight: 'subtle', // Jamais fort
    spacing: 'slightly_more', // Espacement vertical légèrement supérieur
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 7) LISTES & BLOCS DE TEXTE
// ═══════════════════════════════════════════════════════════════════════════════

export const TEXT_BLOCKS = {
  // LISTES
  list: {
    itemSpacing: '12px', // Espace vertical entre items > horizontal
    bulletStyle: 'simple', // Puces simples ou tirets
    bulletType: '–', // Tiret, pas de cercle décoratif
    iconDecorative: false, // JAMAIS d'icônes décoratives
  },
  
  // BLOCS
  paragraph: {
    maxWidth: '65ch', // 60-70 caractères max
    marginVertical: '16px', // Marges généreuses
    marginHorizontal: '0',
    borderToEdge: false, // JAMAIS de texte bord à bord
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 8) DATES, STATUTS, MÉTA-INFO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Objectif: Informer sans voler l'attention.
 */
export const META_INFO = {
  size: TYPE_SCALE.meta.size,
  color: '#8B9096', // Atténuée
  weight: FONT_WEIGHTS.regular,
  textTransform: 'none', // JAMAIS en capitales
  maxLines: 1, // JAMAIS plus d'une ligne
  lineHeight: LINE_HEIGHTS.meta,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 9) INTERACTIONS TYPOGRAPHIQUES
// ═══════════════════════════════════════════════════════════════════════════════

export const TYPOGRAPHY_INTERACTIONS = {
  // HOVER
  hover: {
    colorChange: 'subtle', // Changement léger de couleur
    sizeChange: 'none', // JAMAIS de changement de taille
    underline: 'none', // Pas de underline permanent
  },
  
  // ACTIVE
  active: {
    contrast: 'slightly_reinforced',
    jumpEffect: 'none', // Aucun effet "saut"
  },
  
  // INTERDIT
  forbidden: [
    'Animations de texte',
    'Underline permanent',
    'Changement de taille au hover',
    'Effets de saut',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// CSS TOKENS (EXPORT)
// ═══════════════════════════════════════════════════════════════════════════════

export const TYPOGRAPHY_CSS_TOKENS = {
  // Base
  '--font-family-primary': FONT_FAMILIES.primary,
  '--font-family-mono': FONT_FAMILIES.mono,
  
  // Scale
  '--font-size-title-xl': TYPE_SCALE.titleXL.size,
  '--font-size-title': TYPE_SCALE.title.size,
  '--font-size-section': TYPE_SCALE.section.size,
  '--font-size-body': TYPE_SCALE.body.size,
  '--font-size-meta': TYPE_SCALE.meta.size,
  '--font-size-small': TYPE_SCALE.small.size,
  
  // Line Heights
  '--line-height-tight': LINE_HEIGHTS.tight.toString(),
  '--line-height-title': LINE_HEIGHTS.title.toString(),
  '--line-height-body': LINE_HEIGHTS.body.toString(),
  '--line-height-list': LINE_HEIGHTS.list.toString(),
  '--line-height-meta': LINE_HEIGHTS.meta.toString(),
  
  // Letter Spacing
  '--letter-spacing-body': LETTER_SPACING.body,
  '--letter-spacing-title': LETTER_SPACING.title,
  '--letter-spacing-meta': LETTER_SPACING.meta,
  
  // Weights
  '--font-weight-light': FONT_WEIGHTS.light.toString(),
  '--font-weight-regular': FONT_WEIGHTS.regular.toString(),
  '--font-weight-medium': FONT_WEIGHTS.medium.toString(),
  '--font-weight-semibold': FONT_WEIGHTS.semibold.toString(),
  
  // Text Blocks
  '--text-max-width': TEXT_BLOCKS.paragraph.maxWidth,
  '--list-item-spacing': TEXT_BLOCKS.list.itemSpacing,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

type TypeScaleKey = keyof typeof TYPE_SCALE;

/**
 * Génère les styles typographiques pour un niveau d'échelle
 */
export function getTypeStyles(scale: TypeScaleKey): React.CSSProperties {
  const config = TYPE_SCALE[scale];
  return {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: config.size,
    lineHeight: config.lineHeight,
    fontWeight: config.weight,
    letterSpacing: config.letterSpacing,
  };
}

/**
 * Génère les styles pour les notes
 */
export function getNoteStyles(): React.CSSProperties {
  return {
    ...getTypeStyles('body'),
    fontWeight: NOTES_VS_DECISIONS.notes.weight,
    color: NOTES_VS_DECISIONS.notes.color,
  };
}

/**
 * Génère les styles pour les décisions
 */
export function getDecisionStyles(isActive: boolean = false): React.CSSProperties {
  return {
    ...getTypeStyles('body'),
    fontWeight: isActive 
      ? FONT_WEIGHTS.semibold 
      : NOTES_VS_DECISIONS.decisions.weight,
    color: NOTES_VS_DECISIONS.decisions.color,
  };
}

/**
 * Génère les styles pour les méta-informations
 */
export function getMetaStyles(): React.CSSProperties {
  return {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: META_INFO.size,
    lineHeight: META_INFO.lineHeight,
    fontWeight: META_INFO.weight,
    color: META_INFO.color,
    textTransform: META_INFO.textTransform as any,
  };
}

/**
 * Génère les styles pour un paragraphe
 */
export function getParagraphStyles(): React.CSSProperties {
  return {
    ...getTypeStyles('body'),
    maxWidth: TEXT_BLOCKS.paragraph.maxWidth,
    marginTop: TEXT_BLOCKS.paragraph.marginVertical,
    marginBottom: TEXT_BLOCKS.paragraph.marginVertical,
  };
}

/**
 * Génère les styles pour une liste
 */
export function getListStyles(): React.CSSProperties {
  return {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: TYPE_SCALE.body.size,
    lineHeight: LINE_HEIGHTS.list,
    fontWeight: FONT_WEIGHTS.regular,
    listStyleType: 'none',
  };
}

/**
 * Génère les styles pour un item de liste
 */
export function getListItemStyles(): React.CSSProperties {
  return {
    marginBottom: TEXT_BLOCKS.list.itemSpacing,
    paddingLeft: '1em',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10) TESTS OBLIGATOIRES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * VALIDATION RAPIDE
 * 
 * 1) Lire un texte 5 minutes sans scroller → OK ?
 * 2) Repérer une décision en 2 secondes → OK ?
 * 3) Fermer les yeux, rouvrir → la hiérarchie est claire ?
 * 4) Aucun mot ne "crie" visuellement ?
 * 
 * Si oui → micro-typographie validée.
 */
export const VALIDATION_TESTS = [
  {
    id: 'sustained_reading',
    name: 'Lecture soutenue',
    question: 'Lire un texte 5 minutes sans scroller → OK ?',
    criteria: 'Pas de fatigue visuelle',
  },
  {
    id: 'decision_spotting',
    name: 'Repérage décision',
    question: 'Repérer une décision en 2 secondes → OK ?',
    criteria: 'Hiérarchie visuelle claire',
  },
  {
    id: 'blink_test',
    name: 'Test de clignement',
    question: 'Fermer les yeux, rouvrir → la hiérarchie est claire ?',
    criteria: 'Structure immédiatement perceptible',
  },
  {
    id: 'no_shouting',
    name: 'Pas de cri visuel',
    question: 'Aucun mot ne "crie" visuellement ?',
    criteria: 'Typographie équilibrée',
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// FORBIDDEN PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

export const FORBIDDEN_TYPOGRAPHY = [
  'Polices fantaisie',
  'Variations excessives',
  'Italique décoratif',
  'Tailles < 12px',
  'Contrastes de taille agressifs',
  'Line-height < 1.4 pour body',
  'Tracking excessif',
  'Uppercase + tracking fort',
  'Bold généralisé',
  'Variations multiples sur un même écran',
  'Animations de texte',
  'Underline permanent',
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// OBJECTIVES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * OBJECTIF FINAL:
 * 
 * L'utilisateur doit sentir:
 * "Je peux lire, réfléchir et décider ici sans effort."
 * 
 * Pas:
 * "C'est beau, mais fatigant."
 * 
 * CHE·NU utilise la typographie comme un rythme,
 * pas comme un style.
 */

export default {
  FONT_FAMILIES,
  TYPE_SCALE,
  LINE_HEIGHTS,
  LETTER_SPACING,
  FONT_WEIGHTS,
  WEIGHT_BY_CONTEXT,
  NOTES_VS_DECISIONS,
  TEXT_BLOCKS,
  META_INFO,
  TYPOGRAPHY_INTERACTIONS,
  TYPOGRAPHY_CSS_TOKENS,
  getTypeStyles,
  getNoteStyles,
  getDecisionStyles,
  getMetaStyles,
  getParagraphStyles,
  getListStyles,
  getListItemStyles,
  VALIDATION_TESTS,
};
