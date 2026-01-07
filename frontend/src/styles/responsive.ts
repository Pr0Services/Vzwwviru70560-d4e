/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — RESPONSIVE STYLES                           ║
 * ║                                                                              ║
 * ║  Mobile-first responsive design system                                       ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// BREAKPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export const breakpoints = {
  xs: 320,   // Small phones
  sm: 480,   // Large phones
  md: 768,   // Tablets
  lg: 1024,  // Small laptops
  xl: 1280,  // Desktops
  xxl: 1536, // Large desktops
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Media query helpers
export const media = {
  xs: `@media (min-width: ${breakpoints.xs}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  xxl: `@media (min-width: ${breakpoints.xxl}px)`,
  // Max-width queries for mobile-first overrides
  maxXs: `@media (max-width: ${breakpoints.xs - 1}px)`,
  maxSm: `@media (max-width: ${breakpoints.sm - 1}px)`,
  maxMd: `@media (max-width: ${breakpoints.md - 1}px)`,
  maxLg: `@media (max-width: ${breakpoints.lg - 1}px)`,
  maxXl: `@media (max-width: ${breakpoints.xl - 1}px)`,
  // Touch devices
  touch: `@media (hover: none) and (pointer: coarse)`,
  // Reduced motion
  reducedMotion: `@media (prefers-reduced-motion: reduce)`,
  // Dark mode (system preference)
  dark: `@media (prefers-color-scheme: dark)`,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSIVE HOOK
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm) setBreakpoint('xs');
      else if (width < breakpoints.md) setBreakpoint('sm');
      else if (width < breakpoints.lg) setBreakpoint('md');
      else if (width < breakpoints.xl) setBreakpoint('lg');
      else if (width < breakpoints.xxl) setBreakpoint('xl');
      else setBreakpoint('xxl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

export function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'xs' || breakpoint === 'sm';
}

export function useIsTablet(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'md';
}

export function useIsDesktop(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === 'xxl';
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSIVE SPACING
// ═══════════════════════════════════════════════════════════════════════════════

export const spacing = {
  // Base spacing scale (in pixels)
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// Responsive spacing values
export const responsiveSpacing = {
  // Page padding
  pagePadding: {
    xs: spacing[3],  // 12px
    sm: spacing[4],  // 16px
    md: spacing[5],  // 20px
    lg: spacing[6],  // 24px
    xl: spacing[8],  // 32px
  },
  // Card padding
  cardPadding: {
    xs: spacing[3],  // 12px
    sm: spacing[4],  // 16px
    md: spacing[5],  // 20px
    lg: spacing[5],  // 20px
  },
  // Section gap
  sectionGap: {
    xs: spacing[4],  // 16px
    sm: spacing[5],  // 20px
    md: spacing[6],  // 24px
    lg: spacing[8],  // 32px
  },
  // Grid gap
  gridGap: {
    xs: spacing[2],  // 8px
    sm: spacing[3],  // 12px
    md: spacing[4],  // 16px
    lg: spacing[4],  // 16px
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSIVE TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════════

export const typography = {
  // Font sizes (in pixels)
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Responsive font sizes
export const responsiveFontSize = {
  // Page titles
  pageTitle: {
    xs: typography.fontSize.xl,    // 20px
    sm: typography.fontSize['2xl'], // 24px
    md: typography.fontSize['3xl'], // 28px
    lg: typography.fontSize['3xl'], // 28px
  },
  // Section titles
  sectionTitle: {
    xs: typography.fontSize.md,  // 16px
    sm: typography.fontSize.lg,  // 18px
    md: typography.fontSize.lg,  // 18px
    lg: typography.fontSize.xl,  // 20px
  },
  // Card titles
  cardTitle: {
    xs: typography.fontSize.sm,   // 12px
    sm: typography.fontSize.base, // 14px
    md: typography.fontSize.base, // 14px
    lg: typography.fontSize.md,   // 16px
  },
  // Body text
  body: {
    xs: typography.fontSize.sm,   // 12px
    sm: typography.fontSize.sm,   // 12px
    md: typography.fontSize.base, // 14px
    lg: typography.fontSize.base, // 14px
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSIVE GRID
// ═══════════════════════════════════════════════════════════════════════════════

export const grid = {
  // Sphere grid columns
  sphereGrid: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 3,
  },
  // Agent grid columns
  agentGrid: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
  },
  // Thread grid columns
  threadGrid: {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 2,
    xl: 3,
  },
  // File grid columns
  fileGrid: {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6,
  },
  // Stats grid columns
  statsGrid: {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSIVE COMPONENTS SIZES
// ═══════════════════════════════════════════════════════════════════════════════

export const componentSizes = {
  // Sidebar width
  sidebarWidth: {
    collapsed: 64,
    expanded: 260,
  },
  // Detail panel width
  detailPanelWidth: {
    xs: '100%',
    sm: '100%',
    md: 380,
    lg: 420,
    xl: 480,
  },
  // Modal max width
  modalMaxWidth: {
    xs: '95%',
    sm: 440,
    md: 520,
    lg: 600,
  },
  // FAB size
  fabSize: {
    xs: 48,
    sm: 52,
    md: 56,
    lg: 56,
  },
  // Avatar sizes
  avatarSize: {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  },
  // Icon sizes
  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
  // Button heights
  buttonHeight: {
    sm: 32,
    md: 40,
    lg: 48,
  },
  // Input heights
  inputHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CSS VARIABLES GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

export const generateResponsiveCSS = (): string => `
  :root {
    /* Base spacing */
    --spacing-page: ${responsiveSpacing.pagePadding.xs}px;
    --spacing-card: ${responsiveSpacing.cardPadding.xs}px;
    --spacing-section: ${responsiveSpacing.sectionGap.xs}px;
    --spacing-grid: ${responsiveSpacing.gridGap.xs}px;
    
    /* Typography */
    --font-page-title: ${responsiveFontSize.pageTitle.xs}px;
    --font-section-title: ${responsiveFontSize.sectionTitle.xs}px;
    --font-card-title: ${responsiveFontSize.cardTitle.xs}px;
    --font-body: ${responsiveFontSize.body.xs}px;
    
    /* Grid columns */
    --grid-spheres: ${grid.sphereGrid.xs};
    --grid-agents: ${grid.agentGrid.xs};
    --grid-threads: ${grid.threadGrid.xs};
    
    /* Component sizes */
    --size-fab: ${componentSizes.fabSize.xs}px;
    --size-detail-panel: 100%;
    --size-modal: 95%;
  }

  ${media.sm} {
    :root {
      --spacing-page: ${responsiveSpacing.pagePadding.sm}px;
      --spacing-card: ${responsiveSpacing.cardPadding.sm}px;
      --spacing-section: ${responsiveSpacing.sectionGap.sm}px;
      --spacing-grid: ${responsiveSpacing.gridGap.sm}px;
      
      --font-page-title: ${responsiveFontSize.pageTitle.sm}px;
      --font-section-title: ${responsiveFontSize.sectionTitle.sm}px;
      --font-card-title: ${responsiveFontSize.cardTitle.sm}px;
      --font-body: ${responsiveFontSize.body.sm}px;
      
      --grid-spheres: ${grid.sphereGrid.sm};
      --grid-agents: ${grid.agentGrid.sm};
      --grid-threads: ${grid.threadGrid.sm};
      
      --size-fab: ${componentSizes.fabSize.sm}px;
      --size-detail-panel: 100%;
      --size-modal: ${componentSizes.modalMaxWidth.sm}px;
    }
  }

  ${media.md} {
    :root {
      --spacing-page: ${responsiveSpacing.pagePadding.md}px;
      --spacing-card: ${responsiveSpacing.cardPadding.md}px;
      --spacing-section: ${responsiveSpacing.sectionGap.md}px;
      --spacing-grid: ${responsiveSpacing.gridGap.md}px;
      
      --font-page-title: ${responsiveFontSize.pageTitle.md}px;
      --font-section-title: ${responsiveFontSize.sectionTitle.md}px;
      --font-card-title: ${responsiveFontSize.cardTitle.md}px;
      --font-body: ${responsiveFontSize.body.md}px;
      
      --grid-spheres: ${grid.sphereGrid.md};
      --grid-agents: ${grid.agentGrid.md};
      --grid-threads: ${grid.threadGrid.md};
      
      --size-fab: ${componentSizes.fabSize.md}px;
      --size-detail-panel: ${componentSizes.detailPanelWidth.md}px;
      --size-modal: ${componentSizes.modalMaxWidth.md}px;
    }
  }

  ${media.lg} {
    :root {
      --spacing-page: ${responsiveSpacing.pagePadding.lg}px;
      --spacing-card: ${responsiveSpacing.cardPadding.lg}px;
      --spacing-section: ${responsiveSpacing.sectionGap.lg}px;
      --spacing-grid: ${responsiveSpacing.gridGap.lg}px;
      
      --font-page-title: ${responsiveFontSize.pageTitle.lg}px;
      --font-section-title: ${responsiveFontSize.sectionTitle.lg}px;
      --font-card-title: ${responsiveFontSize.cardTitle.lg}px;
      --font-body: ${responsiveFontSize.body.lg}px;
      
      --grid-spheres: ${grid.sphereGrid.lg};
      --grid-agents: ${grid.agentGrid.lg};
      --grid-threads: ${grid.threadGrid.lg};
      
      --size-fab: ${componentSizes.fabSize.lg}px;
      --size-detail-panel: ${componentSizes.detailPanelWidth.lg}px;
      --size-modal: ${componentSizes.modalMaxWidth.lg}px;
    }
  }

  ${media.xl} {
    :root {
      --spacing-page: ${responsiveSpacing.pagePadding.xl}px;
      
      --grid-agents: ${grid.agentGrid.xl};
      --grid-threads: ${grid.threadGrid.xl};
      
      --size-detail-panel: ${componentSizes.detailPanelWidth.xl}px;
    }
  }

  /* Mobile-specific overrides */
  ${media.maxMd} {
    .hide-mobile {
      display: none !important;
    }
    
    .full-width-mobile {
      width: 100% !important;
      max-width: none !important;
    }
    
    .stack-mobile {
      flex-direction: column !important;
    }
    
    /* Reduce padding on mobile */
    .compact-mobile {
      padding: 12px !important;
    }
    
    /* Full-screen modals on mobile */
    .modal-mobile-fullscreen {
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      border-radius: 0 !important;
    }
    
    /* Bottom sheet on mobile */
    .bottom-sheet-mobile {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      top: auto !important;
      border-radius: 20px 20px 0 0 !important;
      max-height: 90vh !important;
    }
  }

  /* Touch device optimizations */
  ${media.touch} {
    /* Larger touch targets */
    button, a, [role="button"] {
      min-height: 44px;
      min-width: 44px;
    }
    
    /* Disable hover effects on touch */
    .hover-effect:hover {
      transform: none !important;
      box-shadow: none !important;
    }
  }

  /* Reduced motion */
  ${media.reducedMotion} {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get responsive value based on current breakpoint
 */
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  breakpoint: Breakpoint,
  defaultValue: T
): T {
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  // Find the closest defined value
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp]!;
    }
  }
  
  return defaultValue;
}

/**
 * Create responsive style object
 */
export function createResponsiveStyle(
  breakpoint: Breakpoint,
  styles: Partial<Record<Breakpoint, React.CSSProperties>>
): React.CSSProperties {
  return getResponsiveValue(styles, breakpoint, {});
}

export default {
  breakpoints,
  media,
  spacing,
  responsiveSpacing,
  typography,
  responsiveFontSize,
  grid,
  componentSizes,
  generateResponsiveCSS,
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  getResponsiveValue,
  createResponsiveStyle,
};
