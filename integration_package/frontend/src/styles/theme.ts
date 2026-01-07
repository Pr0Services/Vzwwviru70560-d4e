/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — DESIGN SYSTEM                               ║
 * ║                                                                              ║
 * ║  Global theme, colors, typography, spacing, and components                   ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR PALETTE — CHE·NU BRAND
// ═══════════════════════════════════════════════════════════════════════════════

export const colors = {
  // Primary Brand Colors
  brand: {
    sacredGold: '#D8B26A',
    sacredGoldLight: '#E8C88A',
    sacredGoldDark: '#B8925A',
    
    ancientStone: '#8D8371',
    jungleEmerald: '#3F7249',
    cenoteTurquoise: '#3EB4A2',
    shadowMoss: '#2F4C39',
    earthEmber: '#7A593A',
  },

  // UI Colors
  ui: {
    slate: '#1E1F22',
    slateDark: '#0D1210',
    slateLight: '#2A3530',
    softSand: '#E9E4D6',
  },

  // Background Gradients
  bg: {
    primary: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
    card: 'linear-gradient(145deg, rgba(30, 35, 32, 0.95) 0%, rgba(25, 30, 28, 0.95) 100%)',
    glass: 'rgba(255, 255, 255, 0.02)',
    glassHover: 'rgba(255, 255, 255, 0.05)',
  },

  // Text Colors
  text: {
    primary: '#E8F0E8',
    secondary: '#9BA89B',
    muted: '#6B7B6B',
    disabled: '#4B5B4B',
    inverse: '#1E1F22',
  },

  // Semantic Colors
  semantic: {
    success: '#4ADE80',
    successBg: 'rgba(74, 222, 128, 0.1)',
    warning: '#FACC15',
    warningBg: 'rgba(250, 204, 21, 0.1)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.1)',
    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.1)',
  },

  // Level Colors (L0-L3)
  levels: {
    L0: { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)' },
    L1: { color: '#D8B26A', bg: 'rgba(216, 178, 106, 0.15)', border: 'rgba(216, 178, 106, 0.3)' },
    L2: { color: '#3EB4A2', bg: 'rgba(62, 180, 162, 0.15)', border: 'rgba(62, 180, 162, 0.3)' },
    L3: { color: '#6B8E6B', bg: 'rgba(107, 142, 107, 0.15)', border: 'rgba(107, 142, 107, 0.3)' },
  },

  // Aging Colors
  aging: {
    GREEN: '#4ADE80',
    YELLOW: '#FACC15',
    RED: '#EF4444',
    BLINK: '#F97316',
    ARCHIVE: '#6B7B6B',
  },

  // Maturity Colors
  maturity: {
    SEED: '#6B7B6B',
    SPROUTING: '#3EB4A2',
    GROWING: '#4ADE80',
    MATURE: '#D8B26A',
    RIPE: '#8B5CF6',
  },

  // Sphere Colors
  spheres: {
    personal: '#3B82F6',
    business: '#D8B26A',
    government: '#8B5CF6',
    studio: '#EC4899',
    community: '#10B981',
    social: '#F97316',
    entertainment: '#EF4444',
    team: '#06B6D4',
    scholar: '#8B5CF6',
  },

  // Border Colors
  border: {
    default: 'rgba(255, 255, 255, 0.06)',
    light: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.12)',
    strong: 'rgba(255, 255, 255, 0.2)',
    gold: 'rgba(216, 178, 106, 0.3)',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════════

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  },

  fontSize: {
    xs: '10px',
    sm: '11px',
    base: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
    '5xl': '32px',
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SPACING
// ═══════════════════════════════════════════════════════════════════════════════

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BORDER RADIUS
// ═══════════════════════════════════════════════════════════════════════════════

export const radius = {
  none: '0',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '10px',
  '2xl': '12px',
  '3xl': '16px',
  '4xl': '20px',
  full: '9999px',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SHADOWS
// ═══════════════════════════════════════════════════════════════════════════════

export const shadows = {
  none: 'none',
  sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
  md: '0 4px 12px rgba(0, 0, 0, 0.15)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.2)',
  xl: '0 16px 48px rgba(0, 0, 0, 0.3)',
  '2xl': '0 24px 64px rgba(0, 0, 0, 0.4)',
  gold: '0 4px 16px rgba(216, 178, 106, 0.2)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const transitions = {
  fast: '0.1s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
  spring: '0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// Z-INDEX
// ═══════════════════════════════════════════════════════════════════════════════

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 1000,
  popover: 1100,
  tooltip: 1200,
  toast: 1300,
  overlay: 9998,
  max: 9999,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BREAKPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT STYLES
// ═══════════════════════════════════════════════════════════════════════════════

export const components = {
  // Button variants
  button: {
    primary: {
      background: `linear-gradient(135deg, ${colors.brand.jungleEmerald} 0%, ${colors.brand.shadowMoss} 100%)`,
      color: colors.text.primary,
      border: 'none',
      borderRadius: radius.xl,
      padding: `${spacing[3]} ${spacing[5]}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      cursor: 'pointer',
      transition: transitions.normal,
    },
    secondary: {
      background: colors.bg.glass,
      color: colors.text.secondary,
      border: `1px solid ${colors.border.light}`,
      borderRadius: radius.xl,
      padding: `${spacing[3]} ${spacing[5]}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: transitions.normal,
    },
    gold: {
      background: `linear-gradient(135deg, ${colors.brand.sacredGold} 0%, ${colors.brand.sacredGoldDark} 100%)`,
      color: colors.ui.slate,
      border: 'none',
      borderRadius: radius.xl,
      padding: `${spacing[3]} ${spacing[5]}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      cursor: 'pointer',
      transition: transitions.normal,
    },
    ghost: {
      background: 'transparent',
      color: colors.text.secondary,
      border: 'none',
      borderRadius: radius.lg,
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: transitions.normal,
    },
  },

  // Card styles
  card: {
    default: {
      background: colors.bg.card,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius['2xl'],
      padding: spacing[4],
    },
    elevated: {
      background: colors.bg.card,
      border: `1px solid ${colors.border.light}`,
      borderRadius: radius['3xl'],
      padding: spacing[5],
      boxShadow: shadows.lg,
    },
    glass: {
      background: colors.bg.glass,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius['2xl'],
      padding: spacing[4],
      backdropFilter: 'blur(8px)',
    },
  },

  // Input styles
  input: {
    default: {
      background: 'transparent',
      border: `1px solid ${colors.border.light}`,
      borderRadius: radius.lg,
      padding: `${spacing[3]} ${spacing[4]}`,
      color: colors.text.primary,
      fontSize: typography.fontSize.base,
      outline: 'none',
      transition: transitions.normal,
    },
    focus: {
      borderColor: colors.brand.sacredGold,
      boxShadow: `0 0 0 2px rgba(216, 178, 106, 0.2)`,
    },
  },

  // Badge styles
  badge: {
    default: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${spacing[1]} ${spacing[2]}`,
      borderRadius: radius.md,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
    },
    success: {
      background: colors.semantic.successBg,
      color: colors.semantic.success,
    },
    warning: {
      background: colors.semantic.warningBg,
      color: colors.semantic.warning,
    },
    error: {
      background: colors.semantic.errorBg,
      color: colors.semantic.error,
    },
    info: {
      background: colors.semantic.infoBg,
      color: colors.semantic.info,
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// THEME OBJECT
// ═══════════════════════════════════════════════════════════════════════════════

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  components,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;

// ═══════════════════════════════════════════════════════════════════════════════
// CSS VARIABLES (for global styles)
// ═══════════════════════════════════════════════════════════════════════════════

export const cssVariables = `
  :root {
    /* Brand Colors */
    --color-sacred-gold: ${colors.brand.sacredGold};
    --color-sacred-gold-light: ${colors.brand.sacredGoldLight};
    --color-sacred-gold-dark: ${colors.brand.sacredGoldDark};
    --color-ancient-stone: ${colors.brand.ancientStone};
    --color-jungle-emerald: ${colors.brand.jungleEmerald};
    --color-cenote-turquoise: ${colors.brand.cenoteTurquoise};
    --color-shadow-moss: ${colors.brand.shadowMoss};
    --color-earth-ember: ${colors.brand.earthEmber};

    /* UI Colors */
    --color-ui-slate: ${colors.ui.slate};
    --color-ui-slate-dark: ${colors.ui.slateDark};
    --color-ui-slate-light: ${colors.ui.slateLight};
    --color-ui-soft-sand: ${colors.ui.softSand};

    /* Text Colors */
    --color-text-primary: ${colors.text.primary};
    --color-text-secondary: ${colors.text.secondary};
    --color-text-muted: ${colors.text.muted};
    --color-text-disabled: ${colors.text.disabled};

    /* Semantic Colors */
    --color-success: ${colors.semantic.success};
    --color-warning: ${colors.semantic.warning};
    --color-error: ${colors.semantic.error};
    --color-info: ${colors.semantic.info};

    /* Aging Colors */
    --color-aging-green: ${colors.aging.GREEN};
    --color-aging-yellow: ${colors.aging.YELLOW};
    --color-aging-red: ${colors.aging.RED};
    --color-aging-blink: ${colors.aging.BLINK};

    /* Typography */
    --font-sans: ${typography.fontFamily.sans};
    --font-mono: ${typography.fontFamily.mono};

    /* Spacing */
    --spacing-1: ${spacing[1]};
    --spacing-2: ${spacing[2]};
    --spacing-3: ${spacing[3]};
    --spacing-4: ${spacing[4]};
    --spacing-5: ${spacing[5]};
    --spacing-6: ${spacing[6]};

    /* Border Radius */
    --radius-sm: ${radius.sm};
    --radius-md: ${radius.md};
    --radius-lg: ${radius.lg};
    --radius-xl: ${radius.xl};

    /* Transitions */
    --transition-fast: ${transitions.fast};
    --transition-normal: ${transitions.normal};
    --transition-slow: ${transitions.slow};
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════════════════════

export const globalStyles = `
  ${cssVariables}

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--font-sans);
    background: ${colors.bg.primary};
    color: var(--color-text-primary);
    line-height: ${typography.lineHeight.normal};
  }

  a {
    color: var(--color-sacred-gold);
    text-decoration: none;
    transition: var(--transition-fast);
  }

  a:hover {
    color: var(--color-sacred-gold-light);
  }

  button {
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  /* Focus visible */
  :focus-visible {
    outline: 2px solid var(--color-sacred-gold);
    outline-offset: 2px;
  }

  /* Selection */
  ::selection {
    background: rgba(216, 178, 106, 0.3);
    color: var(--color-text-primary);
  }

  /* Animations */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slideDown {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .animate-pulse { animation: pulse 2s infinite; }
  .animate-fade-in { animation: fadeIn 0.2s ease; }
  .animate-slide-up { animation: slideUp 0.3s ease; }
  .animate-slide-down { animation: slideDown 0.3s ease; }
  .animate-scale-in { animation: scaleIn 0.2s ease; }
`;

export default theme;
