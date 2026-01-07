// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — DESIGN SYSTEM UI v1
// OFFICIAL VISUAL LANGUAGE
// ═══════════════════════════════════════════════════════════════════════════════

/* =========================================================
   A.1 — COLOR SYSTEM (CHE·NU BLUEPRINT)
========================================================= */

export const CHENU_COLORS = {
  // PRIMARY PALETTE (industrial, clean)
  primary: {
    blue: '#2D5BE3',      // Trust, intellect
    yellow: '#F5C842',    // Energy, creativity, highlights
    gray: '#2F3237',      // Industrial, infrastructure
    lightGray: '#E7E9EC', // Panels, surfaces
  },

  // SECONDARY
  secondary: {
    success: '#34C759',
    warning: '#F2A600',
    danger: '#E94F37',
    info: '#4378FF',
  },

  // XR ACCENTS
  xr: {
    gridBlue: '#4C7BFF',
    nodeCyan: '#7AE4FF',
    portalPurple: '#C47DFF',
  },

  // BACKGROUNDS
  background: {
    dark: '#111827',
    panel: '#1f2937',
    surface: '#374151',
    hover: '#4b5563',
  },

  // TEXT
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    muted: '#6b7280',
    inverse: '#111827',
  },
} as const;

/* =========================================================
   A.2 — TYPOGRAPHY SYSTEM
========================================================= */

export const CHENU_TYPOGRAPHY = {
  fontFamily: {
    sans: 'Inter, Roboto, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Menlo, Monaco, monospace',
  },

  fontSize: {
    title: '28px',
    h2: '24px',
    h3: '20px',
    body: '16px',
    small: '14px',
    caption: '12px',
    mono: '13px',
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

/* =========================================================
   A.3 — SPACING SYSTEM
========================================================= */

export const CHENU_SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
} as const;

/* =========================================================
   A.4 — BORDER RADIUS
========================================================= */

export const CHENU_RADIUS = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

/* =========================================================
   A.5 — SHADOWS
========================================================= */

export const CHENU_SHADOWS = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  glow: {
    blue: '0 0 20px rgba(45, 91, 227, 0.4)',
    yellow: '0 0 20px rgba(245, 200, 66, 0.4)',
    cyan: '0 0 20px rgba(122, 228, 255, 0.4)',
    purple: '0 0 20px rgba(196, 125, 255, 0.4)',
  },
} as const;

/* =========================================================
   A.6 — COMPONENT TOKENS
========================================================= */

export const CHENU_COMPONENTS = {
  button: {
    primary: {
      bg: CHENU_COLORS.primary.blue,
      text: CHENU_COLORS.text.primary,
      hover: '#4169E1',
    },
    secondary: {
      bg: CHENU_COLORS.primary.yellow,
      text: CHENU_COLORS.text.inverse,
      hover: '#E5B832',
    },
    outline: {
      bg: 'transparent',
      border: CHENU_COLORS.primary.blue,
      text: CHENU_COLORS.primary.blue,
      hover: 'rgba(45, 91, 227, 0.1)',
    },
  },

  card: {
    bg: CHENU_COLORS.background.panel,
    border: CHENU_COLORS.background.surface,
    radius: CHENU_RADIUS.lg,
    padding: CHENU_SPACING.lg,
  },

  panel: {
    bg: CHENU_COLORS.background.surface,
    border: CHENU_COLORS.background.hover,
    radius: CHENU_RADIUS.md,
  },

  tag: {
    sphere: {
      bg: 'rgba(45, 91, 227, 0.2)',
      text: CHENU_COLORS.primary.blue,
    },
    domain: {
      bg: 'rgba(245, 200, 66, 0.2)',
      text: CHENU_COLORS.primary.yellow,
    },
    engine: {
      bg: 'rgba(122, 228, 255, 0.2)',
      text: CHENU_COLORS.xr.nodeCyan,
    },
  },

  input: {
    bg: CHENU_COLORS.background.surface,
    border: CHENU_COLORS.background.hover,
    focus: CHENU_COLORS.primary.blue,
    text: CHENU_COLORS.text.primary,
    placeholder: CHENU_COLORS.text.muted,
  },
} as const;

/* =========================================================
   A.7 — WORKSURFACE MODE STYLES
========================================================= */

export const WORKSURFACE_MODE_STYLES = {
  text: {
    background: '#ffffff',
    padding: '32px 48px',
    maxWidth: '720px',
    fontFamily: CHENU_TYPOGRAPHY.fontFamily.sans,
  },

  table: {
    headerBg: CHENU_COLORS.primary.blue,
    headerText: '#ffffff',
    rowBg: CHENU_COLORS.primary.lightGray,
    rowAltBg: '#f3f4f6',
    borderColor: '#e5e7eb',
  },

  blocks: {
    gap: CHENU_SPACING.md,
    blockBg: CHENU_COLORS.background.panel,
    blockRadius: CHENU_RADIUS.md,
  },

  diagram: {
    nodeBg: CHENU_COLORS.xr.nodeCyan,
    nodeText: CHENU_COLORS.text.inverse,
    edgeColor: CHENU_COLORS.text.muted,
    labelBg: 'rgba(0,0,0,0.7)',
  },

  xr_layout: {
    gridBg: '#e8eefe',
    gridLine: '#d1d5db',
    objectCyan: CHENU_COLORS.xr.nodeCyan,
    objectPurple: CHENU_COLORS.xr.portalPurple,
  },

  summary: {
    headerBorder: CHENU_COLORS.primary.blue,
    sectionGap: CHENU_SPACING.lg,
  },

  final: {
    pageBg: '#ffffff',
    pageMargin: '48px',
    printFriendly: true,
  },
} as const;

/* =========================================================
   A.8 — XR VISUAL TOKENS
========================================================= */

export const XR_VISUAL_TOKENS = {
  room: {
    background: '#f8f9fa',
    floor: '#e9ecef',
    wall: '#dee2e6',
  },

  node: {
    default: CHENU_COLORS.xr.nodeCyan,
    active: CHENU_COLORS.primary.blue,
    hover: '#5DD4FF',
    shadow: '0 4px 12px rgba(122, 228, 255, 0.3)',
  },

  portal: {
    line: CHENU_COLORS.xr.portalPurple,
    lineWidth: 2,
    arrow: true,
    glow: CHENU_SHADOWS.glow.purple,
  },

  universe: {
    layout: 'circular',
    nodeSpacing: 120,
    edgeStyle: 'curved',
  },
} as const;

/* =========================================================
   EXPORTS
========================================================= */

export const CHENU_DESIGN_SYSTEM = {
  colors: CHENU_COLORS,
  typography: CHENU_TYPOGRAPHY,
  spacing: CHENU_SPACING,
  radius: CHENU_RADIUS,
  shadows: CHENU_SHADOWS,
  components: CHENU_COMPONENTS,
  worksurface: WORKSURFACE_MODE_STYLES,
  xr: XR_VISUAL_TOKENS,
} as const;

export default CHENU_DESIGN_SYSTEM;
