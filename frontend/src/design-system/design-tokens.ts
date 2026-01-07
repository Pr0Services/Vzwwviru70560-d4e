// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — DESIGN TOKENS (TYPESCRIPT)
// CANONICAL DESIGN SYSTEM
//
// Usage:
//   import { tokens, colors, spacing } from './design-tokens';
//   style={{ color: colors.text.primary, padding: spacing.m }}
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Base unit for spacing calculations (8px)
 */
export const BASE_UNIT = 8;

// =============================================================================
// COLORS
// =============================================================================

/**
 * Color System
 * - Background: Dark, low contrast for reduced eye strain
 * - Accent: Use sparingly - ONE per screen maximum
 */
export const colors = {
  // Background Colors (neutral, low contrast)
  background: {
    primary: '#0F1216',
    secondary: '#151A21',
    elevated: '#1B2230',
    hover: '#232B3A',
    active: '#2A3447',
  },

  // Text Colors
  text: {
    primary: '#E6EAF0',
    secondary: '#AEB6C3',
    muted: '#7A8496',
    disabled: '#525B6B',
  },

  // Accent Colors (use sparingly - ONE per screen max)
  accent: {
    focus: '#5DA9FF',
    focusHover: '#7DBBFF',
    focusActive: '#4D99EF',

    success: '#4CAF88',
    successHover: '#5CC09A',
    successActive: '#3C9F78',

    warning: '#F5C26B',
    warningHover: '#F7CE85',
    warningActive: '#E5B25B',

    danger: '#E06C75',
    dangerHover: '#E88088',
    dangerActive: '#D05C65',
  },

  // Border Colors
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    default: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.15)',
    focus: '#5DA9FF',
  },

  // Transparent overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darker: 'rgba(0, 0, 0, 0.8)',
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

/**
 * Typography System
 * - Primary font: Inter with system fallback
 * - Line height ≥ 1.45
 * - Bold for emphasis only, never decoration
 */
export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
  },

  fontSize: {
    title: '1.375rem',      // 22px
    section: '1.0625rem',   // 17px
    body: '0.9375rem',      // 15px
    metadata: '0.8125rem',  // 13px
    micro: '0.6875rem',     // 11px
  },

  fontSizePx: {
    title: 22,
    section: 17,
    body: 15,
    metadata: 13,
    micro: 11,
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.45,
    relaxed: 1.6,
  },

  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

// =============================================================================
// SPACING
// =============================================================================

/**
 * Spacing Scale (base unit: 8px)
 * - Prefer vertical stacking over grids
 * - Max 3 columns in any context
 * - Empty space is functional, not wasted
 */
export const spacing = {
  xs: 4,   // 0.5 units
  s: 8,    // 1 unit
  m: 16,   // 2 units
  l: 24,   // 3 units
  xl: 32,  // 4 units
  '2xl': 48, // 6 units
  '3xl': 64, // 8 units
} as const;

/**
 * Spacing as CSS strings
 */
export const spacingPx = {
  xs: '4px',
  s: '8px',
  m: '16px',
  l: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

/**
 * Border Radius Scale
 * - Cards: 10-12px
 * - Buttons: 8-10px
 */
export const radius = {
  xs: 4,
  s: 6,
  m: 8,
  l: 10,
  xl: 12,
  '2xl': 16,
  full: 9999,
} as const;

export const radiusPx = {
  xs: '4px',
  s: '6px',
  m: '8px',
  l: '10px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

/**
 * Shadow System (for elevation)
 * - Slight elevation via shadow or contrast
 */
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 8px rgba(0, 0, 0, 0.4)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.5)',
  xl: '0 16px 32px rgba(0, 0, 0, 0.6)',
} as const;

// =============================================================================
// ANIMATION & MOTION
// =============================================================================

/**
 * Animation System
 * - Ease-out preferred
 * - No bounce, no elastic effects
 * - Motion must explain state change
 */
export const animation = {
  duration: {
    instant: 50,
    fast: 120,
    normal: 200,
    slow: 300,
    slower: 400,
    slowest: 600,
  },

  durationMs: {
    instant: '50ms',
    fast: '120ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
    slowest: '600ms',
  },

  easing: {
    out: 'cubic-bezier(0.33, 1, 0.68, 1)',
    in: 'cubic-bezier(0.32, 0, 0.67, 0)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    linear: 'linear',
  },
} as const;

/**
 * Pre-built transitions
 */
export const transitions = {
  fast: `${animation.durationMs.fast} ${animation.easing.out}`,
  normal: `${animation.durationMs.normal} ${animation.easing.out}`,
  slow: `${animation.durationMs.slow} ${animation.easing.out}`,
} as const;

// =============================================================================
// Z-INDEX
// =============================================================================

/**
 * Z-Index Scale
 */
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
} as const;

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

/**
 * Button Tokens
 */
export const buttonTokens = {
  paddingX: spacing.m,
  paddingY: spacing.s,
  radius: radius.m,
  fontSize: typography.fontSizePx.body,
  fontWeight: typography.fontWeight.medium,
} as const;

/**
 * Card Tokens
 */
export const cardTokens = {
  padding: spacing.m,
  radius: radius.xl,
  background: colors.background.secondary,
  border: colors.border.subtle,
} as const;

/**
 * Input Tokens
 */
export const inputTokens = {
  paddingX: spacing.m,
  paddingY: spacing.s,
  radius: radius.m,
  background: colors.background.primary,
  border: colors.border.default,
  focusBorder: colors.accent.focus,
} as const;

/**
 * Layout Tokens
 */
export const layoutTokens = {
  sidebarWidth: 240,
  sidebarCollapsedWidth: 64,
  topbarHeight: 56,
  maxContentWidth: 1200,
} as const;

// =============================================================================
// UNIFIED TOKENS EXPORT
// =============================================================================

/**
 * Complete Design Tokens Object
 */
export const tokens = {
  colors,
  typography,
  spacing,
  spacingPx,
  radius,
  radiusPx,
  shadows,
  animation,
  transitions,
  zIndex,
  button: buttonTokens,
  card: cardTokens,
  input: inputTokens,
  layout: layoutTokens,
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Convert spacing units to pixels
 */
export const toPixels = (units: number): number => units * BASE_UNIT;

/**
 * Convert spacing units to CSS string
 */
export const toPx = (units: number): string => `${units * BASE_UNIT}px`;

/**
 * Check if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get duration based on motion preference
 */
export const getDuration = (duration: keyof typeof animation.duration): number => {
  if (prefersReducedMotion()) return 0;
  return animation.duration[duration];
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ColorKey = keyof typeof colors;
export type SpacingKey = keyof typeof spacing;
export type RadiusKey = keyof typeof radius;
export type DurationKey = keyof typeof animation.duration;
export type EasingKey = keyof typeof animation.easing;
export type ZIndexKey = keyof typeof zIndex;

// Default export
export default tokens;
