/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — DESIGN TOKENS                                   ║
 * ║                                                                              ║
 * ║  Official Brandbook Colors & Typography                                      ║
 * ║  Extracted from V4.9 for canonical use                                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// BRAND COLORS (Official Brandbook)
// ═══════════════════════════════════════════════════════════════════════════════

export const BRAND_COLORS = {
  sacredGold: '#D8B26A',      // Primary accent
  ancientStone: '#8D8371',    // Secondary accent
  jungleEmerald: '#3F7249',   // Success / Nature
  cenoteTurquoise: '#3EB4A2', // Info / Water
  shadowMoss: '#2F4C39',      // Dark green
  earthEmber: '#7A593A',      // Warm accent
  darkSlate: '#1E1F22',       // Background
  softSand: '#E9E4D6',        // Light background
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SEMANTIC COLORS
// ═══════════════════════════════════════════════════════════════════════════════

export const SEMANTIC_COLORS = {
  background: {
    primary: '#1E1F22',
    secondary: '#252629',
    tertiary: '#2D2E32',
    elevated: '#343539',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    muted: '#71717A',
    inverse: '#1E1F22',
  },
  border: {
    default: '#3F3F46',
    strong: '#52525B',
    subtle: '#27272A',
  },
  status: {
    success: '#3F7249',
    warning: '#D8B26A',
    error: '#DC2626',
    info: '#3EB4A2',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════════

export const TYPOGRAPHY = {
  fontFamily: {
    display: '"Lora", "Quattrocento", serif',
    heading: '"Josefin Sans", sans-serif',
    body: '"Inter", "Nunito", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem',  // 40px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SPACING
// ═══════════════════════════════════════════════════════════════════════════════

export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BORDER RADIUS
// ═══════════════════════════════════════════════════════════════════════════════

export const RADIUS = {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',  // Pill shape
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SHADOWS
// ═══════════════════════════════════════════════════════════════════════════════

export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.3)',
  glow: '0 0 20px rgba(216, 178, 106, 0.3)', // Sacred Gold glow
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const TRANSITIONS = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// Z-INDEX LAYERS
// ═══════════════════════════════════════════════════════════════════════════════

export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  nova: 90,
  max: 100,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED TOKENS OBJECT
// ═══════════════════════════════════════════════════════════════════════════════

export const tokens = {
  colors: {
    ...BRAND_COLORS,
    ...SEMANTIC_COLORS,
  },
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  transitions: TRANSITIONS,
  zIndex: Z_INDEX,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// CSS VARIABLES GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

export const generateCSSVariables = (): string => {
  return `
:root {
  /* Brand Colors */
  --color-sacred-gold: ${BRAND_COLORS.sacredGold};
  --color-ancient-stone: ${BRAND_COLORS.ancientStone};
  --color-jungle-emerald: ${BRAND_COLORS.jungleEmerald};
  --color-cenote-turquoise: ${BRAND_COLORS.cenoteTurquoise};
  --color-shadow-moss: ${BRAND_COLORS.shadowMoss};
  --color-earth-ember: ${BRAND_COLORS.earthEmber};
  --color-dark-slate: ${BRAND_COLORS.darkSlate};
  --color-soft-sand: ${BRAND_COLORS.softSand};
  
  /* Background */
  --bg-primary: ${SEMANTIC_COLORS.background.primary};
  --bg-secondary: ${SEMANTIC_COLORS.background.secondary};
  --bg-tertiary: ${SEMANTIC_COLORS.background.tertiary};
  --bg-elevated: ${SEMANTIC_COLORS.background.elevated};
  
  /* Text */
  --text-primary: ${SEMANTIC_COLORS.text.primary};
  --text-secondary: ${SEMANTIC_COLORS.text.secondary};
  --text-muted: ${SEMANTIC_COLORS.text.muted};
  
  /* Border */
  --border-default: ${SEMANTIC_COLORS.border.default};
  --border-strong: ${SEMANTIC_COLORS.border.strong};
  --border-subtle: ${SEMANTIC_COLORS.border.subtle};
  
  /* Status */
  --status-success: ${SEMANTIC_COLORS.status.success};
  --status-warning: ${SEMANTIC_COLORS.status.warning};
  --status-error: ${SEMANTIC_COLORS.status.error};
  --status-info: ${SEMANTIC_COLORS.status.info};
  
  /* Typography */
  --font-display: ${TYPOGRAPHY.fontFamily.display};
  --font-heading: ${TYPOGRAPHY.fontFamily.heading};
  --font-body: ${TYPOGRAPHY.fontFamily.body};
  --font-mono: ${TYPOGRAPHY.fontFamily.mono};
  
  /* Spacing */
  --space-xs: ${SPACING.xs};
  --space-sm: ${SPACING.sm};
  --space-md: ${SPACING.md};
  --space-lg: ${SPACING.lg};
  --space-xl: ${SPACING.xl};
  
  /* Radius */
  --radius-sm: ${RADIUS.sm};
  --radius-md: ${RADIUS.md};
  --radius-lg: ${RADIUS.lg};
  --radius-xl: ${RADIUS.xl};
  
  /* Shadows */
  --shadow-sm: ${SHADOWS.sm};
  --shadow-md: ${SHADOWS.md};
  --shadow-lg: ${SHADOWS.lg};
  --shadow-glow: ${SHADOWS.glow};
  
  /* Transitions */
  --transition-fast: ${TRANSITIONS.fast};
  --transition-normal: ${TRANSITIONS.normal};
  --transition-slow: ${TRANSITIONS.slow};
}
  `.trim();
};

export default tokens;
