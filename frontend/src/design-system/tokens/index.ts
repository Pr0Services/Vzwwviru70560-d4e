// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — DESIGN TOKENS
// Foundation Layer — The DNA of CHE·NU Visual Identity
// ═══════════════════════════════════════════════════════════════════════════════
// 
// Philosophy: "Refined Industrial" — Elegant brutalism with human warmth
// CHE·NU = "Chez Nous" = Home + Construction + Cognitive
//
// These tokens are the single source of truth for all visual properties.
// Never use hardcoded values in components — always reference tokens.
// ═══════════════════════════════════════════════════════════════════════════════

// =============================================================================
// COLOR TOKENS
// =============================================================================

/**
 * Core Color Palette
 * 
 * Built on a foundation of warm neutrals with strategic accent colors
 * that represent different aspects of the CHE·NU ecosystem.
 */
export const colors = {
  // ─────────────────────────────────────────────────────────────────────────
  // PRIMITIVE COLORS (Base palette - use semantic colors in components)
  // ─────────────────────────────────────────────────────────────────────────
  
  primitives: {
    // Warm Grays — The "Béton" (Concrete) scale
    // Warmer than typical grays, evoking construction materials
    gray: {
      50:  '#FAFAF9',   // Chalk dust
      100: '#F5F5F4',   // Fresh plaster
      200: '#E7E5E4',   // Cured concrete light
      300: '#D6D3D1',   // Limestone
      400: '#A8A29E',   // Weathered stone
      500: '#78716C',   // Aged concrete
      600: '#57534E',   // Charcoal mortar
      700: '#44403C',   // Dark aggregate
      800: '#292524',   // Deep foundation
      900: '#1C1917',   // Bedrock
      950: '#0C0A09',   // Void
    },

    // Copper — Primary brand color
    // Represents construction, craftsmanship, warmth
    copper: {
      50:  '#FDF8F6',
      100: '#FAEFEB',
      200: '#F5DDD3',
      300: '#ECC5B3',
      400: '#DFA07D',
      500: '#CD7F4E',   // Primary copper
      600: '#B86A3A',
      700: '#9A5530',
      800: '#7D4528',
      900: '#673A23',
      950: '#381C0F',
    },

    // Steel Blue — Secondary / Professional
    // Represents precision, technology, trust
    steel: {
      50:  '#F6F8FA',
      100: '#EEF1F5',
      200: '#D9E0E9',
      300: '#B8C5D6',
      400: '#8FA3BC',
      500: '#6B83A3',   // Primary steel
      600: '#566A87',
      700: '#47566E',
      800: '#3D495B',
      900: '#353F4D',
      950: '#232A33',
    },

    // Forest — Success / Growth / Nature
    // Represents Quebec forests, sustainability
    forest: {
      50:  '#F3F8F4',
      100: '#E4EFE6',
      200: '#CADFD0',
      300: '#A2C6AC',
      400: '#73A681',
      500: '#4F8A60',   // Primary forest
      600: '#3D6F4C',
      700: '#32593E',
      800: '#2A4834',
      900: '#243C2C',
      950: '#112117',
    },

    // Amber — Warning / Attention / Energy
    // Represents safety equipment, attention
    amber: {
      50:  '#FFFCF0',
      100: '#FFF8DB',
      200: '#FFF0B8',
      300: '#FFE485',
      400: '#FFD24D',
      500: '#FFBF1A',   // Primary amber
      600: '#E6A000',
      700: '#BF7C00',
      800: '#996108',
      900: '#7D4F0C',
      950: '#462A01',
    },

    // Rust — Error / Danger / Urgency
    // Represents oxidation, wear, critical states
    rust: {
      50:  '#FEF6F5',
      100: '#FDE9E7',
      200: '#FCD7D3',
      300: '#F9B8B0',
      400: '#F38D80',
      500: '#E86252',   // Primary rust
      600: '#D44636',
      700: '#B23628',
      800: '#932F24',
      900: '#7A2C24',
      950: '#42130E',
    },

    // Blueprint — Info / Planning / Technical
    // Represents architectural drawings, precision
    blueprint: {
      50:  '#F0F7FF',
      100: '#E0EFFE',
      200: '#B9DFFC',
      300: '#7CC6FA',
      400: '#36A7F5',
      500: '#0C8BE6',   // Primary blueprint
      600: '#006DC4',
      700: '#01579F',
      800: '#064A83',
      900: '#0B3F6D',
      950: '#072848',
    },

    // Pure values
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEMANTIC COLORS (Use these in components)
  // ─────────────────────────────────────────────────────────────────────────

  semantic: {
    // Background colors
    background: {
      primary:   'var(--color-bg-primary)',      // Main app background
      secondary: 'var(--color-bg-secondary)',    // Cards, elevated surfaces
      tertiary:  'var(--color-bg-tertiary)',     // Nested elements
      inverse:   'var(--color-bg-inverse)',      // Dark on light, light on dark
      overlay:   'var(--color-bg-overlay)',      // Modals, dropdowns
      subtle:    'var(--color-bg-subtle)',       // Hover states, highlights
    },

    // Text colors
    text: {
      primary:   'var(--color-text-primary)',    // Main text
      secondary: 'var(--color-text-secondary)',  // Supporting text
      tertiary:  'var(--color-text-tertiary)',   // Muted text
      inverse:   'var(--color-text-inverse)',    // Text on inverse bg
      disabled:  'var(--color-text-disabled)',   // Disabled state
      link:      'var(--color-text-link)',       // Links
      linkHover: 'var(--color-text-link-hover)', // Link hover
    },

    // Border colors
    border: {
      default:  'var(--color-border-default)',   // Default borders
      subtle:   'var(--color-border-subtle)',    // Subtle dividers
      strong:   'var(--color-border-strong)',    // Emphasized borders
      focus:    'var(--color-border-focus)',     // Focus rings
    },

    // Status colors
    status: {
      success:     'var(--color-status-success)',
      successBg:   'var(--color-status-success-bg)',
      warning:     'var(--color-status-warning)',
      warningBg:   'var(--color-status-warning-bg)',
      error:       'var(--color-status-error)',
      errorBg:     'var(--color-status-error-bg)',
      info:        'var(--color-status-info)',
      infoBg:      'var(--color-status-info-bg)',
    },

    // Brand colors
    brand: {
      primary:     'var(--color-brand-primary)',
      primaryHover:'var(--color-brand-primary-hover)',
      secondary:   'var(--color-brand-secondary)',
      accent:      'var(--color-brand-accent)',
    },

    // Interactive colors
    interactive: {
      default:  'var(--color-interactive-default)',
      hover:    'var(--color-interactive-hover)',
      active:   'var(--color-interactive-active)',
      disabled: 'var(--color-interactive-disabled)',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SPHERE COLORS (Each sphere has its own color identity)
  // ─────────────────────────────────────────────────────────────────────────

  spheres: {
    personal: {
      primary: '#6B83A3',    // Steel blue - calm, personal
      light:   '#D9E0E9',
      dark:    '#353F4D',
    },
    business: {
      primary: '#CD7F4E',    // Copper - professional, crafted
      light:   '#F5DDD3',
      dark:    '#673A23',
    },
    creative: {
      primary: '#9F5FB0',    // Purple - creative, imaginative
      light:   '#E8D5ED',
      dark:    '#5A2D66',
    },
    scholar: {
      primary: '#4F8A60',    // Forest - growth, knowledge
      light:   '#CADFD0',
      dark:    '#243C2C',
    },
    socialMedia: {
      primary: '#E86252',    // Rust - dynamic, attention
      light:   '#FCD7D3',
      dark:    '#7A2C24',
    },
    community: {
      primary: '#0C8BE6',    // Blueprint - connection, planning
      light:   '#B9DFFC',
      dark:    '#072848',
    },
    xr: {
      primary: '#8B5CF6',    // Violet - immersive, futuristic
      light:   '#DDD6FE',
      dark:    '#4C1D95',
    },
    myTeam: {
      primary: '#14B8A6',    // Teal - collaboration
      light:   '#CCFBF1',
      dark:    '#134E4A',
    },
    aiLab: {
      primary: '#F59E0B',    // Amber - experimental, bright
      light:   '#FEF3C7',
      dark:    '#78350F',
    },
    entertainment: {
      primary: '#EC4899',    // Pink - fun, playful
      light:   '#FCE7F3',
      dark:    '#831843',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // AGENT AURA COLORS (Subtle glows for agent presence)
  // ─────────────────────────────────────────────────────────────────────────

  agentAura: {
    nova:       'rgba(205, 127, 78, 0.3)',   // Copper glow
    architect:  'rgba(12, 139, 230, 0.3)',   // Blueprint glow
    finance:    'rgba(79, 138, 96, 0.3)',    // Forest glow
    project:    'rgba(107, 131, 163, 0.3)',  // Steel glow
    hr:         'rgba(20, 184, 166, 0.3)',   // Teal glow
    marketing:  'rgba(236, 72, 153, 0.3)',   // Pink glow
    legal:      'rgba(120, 113, 108, 0.3)',  // Gray glow
    safety:     'rgba(232, 98, 82, 0.3)',    // Rust glow
  },
} as const;


// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

/**
 * Typography System
 * 
 * Font choices:
 * - Display: "Playfair Display" — Elegant, editorial, memorable
 * - Headings: "DM Sans" — Modern, geometric, professional
 * - Body: "Source Sans 3" — Highly readable, versatile
 * - Mono: "JetBrains Mono" — Technical, code-ready
 */
export const typography = {
  // ─────────────────────────────────────────────────────────────────────────
  // FONT FAMILIES
  // ─────────────────────────────────────────────────────────────────────────

  fontFamily: {
    display: '"Playfair Display", Georgia, "Times New Roman", serif',
    heading: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    body:    '"Source Sans 3", "Segoe UI", Roboto, sans-serif',
    mono:    '"JetBrains Mono", "Fira Code", Consolas, monospace',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FONT SIZES (Modular scale: 1.25 ratio)
  // ─────────────────────────────────────────────────────────────────────────

  fontSize: {
    // Display sizes (for hero sections, splash screens)
    'display-2xl': '4.5rem',    // 72px
    'display-xl':  '3.75rem',   // 60px
    'display-lg':  '3rem',      // 48px
    'display-md':  '2.25rem',   // 36px
    'display-sm':  '1.875rem',  // 30px

    // Heading sizes
    'heading-xl':  '1.5rem',    // 24px - H1
    'heading-lg':  '1.25rem',   // 20px - H2
    'heading-md':  '1.125rem',  // 18px - H3
    'heading-sm':  '1rem',      // 16px - H4
    'heading-xs':  '0.875rem',  // 14px - H5

    // Body sizes
    'body-lg':     '1.125rem',  // 18px
    'body-md':     '1rem',      // 16px (base)
    'body-sm':     '0.875rem',  // 14px
    'body-xs':     '0.75rem',   // 12px

    // Utility sizes
    'caption':     '0.6875rem', // 11px
    'overline':    '0.625rem',  // 10px
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FONT WEIGHTS
  // ─────────────────────────────────────────────────────────────────────────

  fontWeight: {
    light:    300,
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
    black:    900,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LINE HEIGHTS
  // ─────────────────────────────────────────────────────────────────────────

  lineHeight: {
    none:    1,
    tight:   1.2,
    snug:    1.375,
    normal:  1.5,
    relaxed: 1.625,
    loose:   2,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LETTER SPACING
  // ─────────────────────────────────────────────────────────────────────────

  letterSpacing: {
    tighter: '-0.05em',
    tight:   '-0.025em',
    normal:  '0',
    wide:    '0.025em',
    wider:   '0.05em',
    widest:  '0.1em',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TYPOGRAPHY PRESETS (Commonly used combinations)
  // ─────────────────────────────────────────────────────────────────────────

  presets: {
    displayHero: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-display-xl)',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    displayTitle: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-display-md)',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h1: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-heading-xl)',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-heading-lg)',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '0',
    },
    h3: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-heading-md)',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    h4: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-heading-sm)',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    bodyLarge: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-body-lg)',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0',
    },
    bodyDefault: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-body-md)',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
    },
    bodySmall: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-body-sm)',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
    },
    caption: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-caption)',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    overline: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-overline)',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
    },
    code: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-body-sm)',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0',
    },
    label: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-body-sm)',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    buttonLarge: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-body-md)',
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '0.02em',
    },
    buttonDefault: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-body-sm)',
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '0.02em',
    },
    buttonSmall: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-body-xs)',
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '0.02em',
    },
  },
} as const;


// =============================================================================
// SPACING TOKENS
// =============================================================================

/**
 * Spacing System
 * 
 * Based on 4px base unit with semantic names.
 * Use spacing tokens for all margins, paddings, and gaps.
 */
export const spacing = {
  // ─────────────────────────────────────────────────────────────────────────
  // BASE SCALE (4px increments)
  // ─────────────────────────────────────────────────────────────────────────

  px:   '1px',
  0:    '0',
  0.5:  '0.125rem',  // 2px
  1:    '0.25rem',   // 4px
  1.5:  '0.375rem',  // 6px
  2:    '0.5rem',    // 8px
  2.5:  '0.625rem',  // 10px
  3:    '0.75rem',   // 12px
  3.5:  '0.875rem',  // 14px
  4:    '1rem',      // 16px
  5:    '1.25rem',   // 20px
  6:    '1.5rem',    // 24px
  7:    '1.75rem',   // 28px
  8:    '2rem',      // 32px
  9:    '2.25rem',   // 36px
  10:   '2.5rem',    // 40px
  11:   '2.75rem',   // 44px
  12:   '3rem',      // 48px
  14:   '3.5rem',    // 56px
  16:   '4rem',      // 64px
  20:   '5rem',      // 80px
  24:   '6rem',      // 96px
  28:   '7rem',      // 112px
  32:   '8rem',      // 128px
  36:   '9rem',      // 144px
  40:   '10rem',     // 160px
  44:   '11rem',     // 176px
  48:   '12rem',     // 192px
  52:   '13rem',     // 208px
  56:   '14rem',     // 224px
  60:   '15rem',     // 240px
  64:   '16rem',     // 256px
  72:   '18rem',     // 288px
  80:   '20rem',     // 320px
  96:   '24rem',     // 384px

  // ─────────────────────────────────────────────────────────────────────────
  // SEMANTIC SPACING
  // ─────────────────────────────────────────────────────────────────────────

  semantic: {
    // Component internal spacing
    componentXs:   '0.25rem',   // 4px - Tight internal
    componentSm:   '0.5rem',    // 8px - Small internal
    componentMd:   '0.75rem',   // 12px - Default internal
    componentLg:   '1rem',      // 16px - Large internal
    componentXl:   '1.5rem',    // 24px - Extra large internal

    // Stack spacing (vertical)
    stackXs:       '0.5rem',    // 8px
    stackSm:       '1rem',      // 16px
    stackMd:       '1.5rem',    // 24px
    stackLg:       '2rem',      // 32px
    stackXl:       '3rem',      // 48px

    // Inline spacing (horizontal)
    inlineXs:      '0.25rem',   // 4px
    inlineSm:      '0.5rem',    // 8px
    inlineMd:      '1rem',      // 16px
    inlineLg:      '1.5rem',    // 24px
    inlineXl:      '2rem',      // 32px

    // Section spacing
    sectionSm:     '2rem',      // 32px
    sectionMd:     '4rem',      // 64px
    sectionLg:     '6rem',      // 96px
    sectionXl:     '8rem',      // 128px

    // Page margins
    pageMarginSm:  '1rem',      // 16px - Mobile
    pageMarginMd:  '2rem',      // 32px - Tablet
    pageMarginLg:  '4rem',      // 64px - Desktop
    pageMarginXl:  '6rem',      // 96px - Large desktop
  },

  // ─────────────────────────────────────────────────────────────────────────
  // GAP PRESETS (for flex/grid)
  // ─────────────────────────────────────────────────────────────────────────

  gap: {
    none: '0',
    xs:   '0.25rem',   // 4px
    sm:   '0.5rem',    // 8px
    md:   '1rem',      // 16px
    lg:   '1.5rem',    // 24px
    xl:   '2rem',      // 32px
    '2xl': '3rem',     // 48px
  },
} as const;


// =============================================================================
// SIZING TOKENS
// =============================================================================

export const sizing = {
  // ─────────────────────────────────────────────────────────────────────────
  // FIXED SIZES
  // ─────────────────────────────────────────────────────────────────────────

  0:    '0',
  px:   '1px',
  0.5:  '0.125rem',
  1:    '0.25rem',
  1.5:  '0.375rem',
  2:    '0.5rem',
  2.5:  '0.625rem',
  3:    '0.75rem',
  3.5:  '0.875rem',
  4:    '1rem',
  5:    '1.25rem',
  6:    '1.5rem',
  7:    '1.75rem',
  8:    '2rem',
  9:    '2.25rem',
  10:   '2.5rem',
  11:   '2.75rem',
  12:   '3rem',
  14:   '3.5rem',
  16:   '4rem',
  20:   '5rem',
  24:   '6rem',
  28:   '7rem',
  32:   '8rem',
  36:   '9rem',
  40:   '10rem',
  44:   '11rem',
  48:   '12rem',
  52:   '13rem',
  56:   '14rem',
  60:   '15rem',
  64:   '16rem',
  72:   '18rem',
  80:   '20rem',
  96:   '24rem',

  // ─────────────────────────────────────────────────────────────────────────
  // FLUID/PERCENTAGE SIZES
  // ─────────────────────────────────────────────────────────────────────────

  auto:    'auto',
  full:    '100%',
  screen:  '100vh',
  screenW: '100vw',
  min:     'min-content',
  max:     'max-content',
  fit:     'fit-content',

  // Fractional widths
  '1/2':   '50%',
  '1/3':   '33.333333%',
  '2/3':   '66.666667%',
  '1/4':   '25%',
  '2/4':   '50%',
  '3/4':   '75%',
  '1/5':   '20%',
  '2/5':   '40%',
  '3/5':   '60%',
  '4/5':   '80%',
  '1/6':   '16.666667%',
  '5/6':   '83.333333%',
  '1/12':  '8.333333%',
  '5/12':  '41.666667%',
  '7/12':  '58.333333%',
  '11/12': '91.666667%',

  // ─────────────────────────────────────────────────────────────────────────
  // CONTAINER WIDTHS
  // ─────────────────────────────────────────────────────────────────────────

  container: {
    xs:   '20rem',    // 320px
    sm:   '24rem',    // 384px
    md:   '28rem',    // 448px
    lg:   '32rem',    // 512px
    xl:   '36rem',    // 576px
    '2xl': '42rem',   // 672px
    '3xl': '48rem',   // 768px
    '4xl': '56rem',   // 896px
    '5xl': '64rem',   // 1024px
    '6xl': '72rem',   // 1152px
    '7xl': '80rem',   // 1280px
    full: '100%',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COMPONENT SIZES
  // ─────────────────────────────────────────────────────────────────────────

  component: {
    // Icon sizes
    iconXs:     '0.75rem',   // 12px
    iconSm:     '1rem',      // 16px
    iconMd:     '1.25rem',   // 20px
    iconLg:     '1.5rem',    // 24px
    iconXl:     '2rem',      // 32px
    icon2xl:    '2.5rem',    // 40px

    // Avatar sizes
    avatarXs:   '1.5rem',    // 24px
    avatarSm:   '2rem',      // 32px
    avatarMd:   '2.5rem',    // 40px
    avatarLg:   '3rem',      // 48px
    avatarXl:   '4rem',      // 64px
    avatar2xl:  '6rem',      // 96px

    // Button heights
    buttonXs:   '1.5rem',    // 24px
    buttonSm:   '2rem',      // 32px
    buttonMd:   '2.5rem',    // 40px
    buttonLg:   '3rem',      // 48px
    buttonXl:   '3.5rem',    // 56px

    // Input heights
    inputSm:    '2rem',      // 32px
    inputMd:    '2.5rem',    // 40px
    inputLg:    '3rem',      // 48px

    // Touch targets (minimum 44px for accessibility)
    touchMin:   '2.75rem',   // 44px

    // Sidebar widths
    sidebarCollapsed: '4rem',    // 64px
    sidebarExpanded:  '16rem',   // 256px
    sidebarWide:      '20rem',   // 320px

    // Header heights
    headerSm:   '3rem',      // 48px
    headerMd:   '3.5rem',    // 56px
    headerLg:   '4rem',      // 64px

    // Modal widths
    modalSm:    '24rem',     // 384px
    modalMd:    '32rem',     // 512px
    modalLg:    '48rem',     // 768px
    modalXl:    '64rem',     // 1024px
    modalFull:  'calc(100vw - 4rem)',
  },
} as const;


// =============================================================================
// BORDER TOKENS
// =============================================================================

export const borders = {
  // ─────────────────────────────────────────────────────────────────────────
  // BORDER WIDTHS
  // ─────────────────────────────────────────────────────────────────────────

  width: {
    none:   '0',
    thin:   '1px',
    default: '1px',
    medium: '2px',
    thick:  '3px',
    heavy:  '4px',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BORDER RADIUS
  // ─────────────────────────────────────────────────────────────────────────

  radius: {
    none:    '0',
    xs:      '0.125rem',   // 2px
    sm:      '0.25rem',    // 4px
    default: '0.375rem',   // 6px
    md:      '0.5rem',     // 8px
    lg:      '0.75rem',    // 12px
    xl:      '1rem',       // 16px
    '2xl':   '1.5rem',     // 24px
    '3xl':   '2rem',       // 32px
    full:    '9999px',     // Pill shape
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BORDER STYLES
  // ─────────────────────────────────────────────────────────────────────────

  style: {
    solid:  'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',
    none:   'none',
  },
} as const;


// =============================================================================
// SHADOW TOKENS
// =============================================================================

export const shadows = {
  // ─────────────────────────────────────────────────────────────────────────
  // ELEVATION SHADOWS (Material-inspired depth)
  // ─────────────────────────────────────────────────────────────────────────

  elevation: {
    none: 'none',
    
    // Subtle shadow - buttons, inputs
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    
    // Small shadow - cards, dropdowns
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    
    // Default shadow - elevated cards
    default: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    
    // Medium shadow - modals, popovers
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    
    // Large shadow - dialogs, sheets
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    
    // Extra large shadow - floating panels
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
    // 2XL shadow - dramatic elevation
    '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INNER SHADOWS
  // ─────────────────────────────────────────────────────────────────────────

  inner: {
    sm: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    lg: 'inset 0 4px 6px 0 rgba(0, 0, 0, 0.15)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // GLOW SHADOWS (for emphasis, agent auras)
  // ─────────────────────────────────────────────────────────────────────────

  glow: {
    copper: '0 0 20px rgba(205, 127, 78, 0.3)',
    steel: '0 0 20px rgba(107, 131, 163, 0.3)',
    forest: '0 0 20px rgba(79, 138, 96, 0.3)',
    amber: '0 0 20px rgba(255, 191, 26, 0.3)',
    rust: '0 0 20px rgba(232, 98, 82, 0.3)',
    blueprint: '0 0 20px rgba(12, 139, 230, 0.3)',
    white: '0 0 20px rgba(255, 255, 255, 0.3)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FOCUS RINGS
  // ─────────────────────────────────────────────────────────────────────────

  focus: {
    default: '0 0 0 3px rgba(205, 127, 78, 0.4)',
    error: '0 0 0 3px rgba(232, 98, 82, 0.4)',
    success: '0 0 0 3px rgba(79, 138, 96, 0.4)',
  },
} as const;


// =============================================================================
// ANIMATION TOKENS
// =============================================================================

export const animation = {
  // ─────────────────────────────────────────────────────────────────────────
  // DURATIONS
  // ─────────────────────────────────────────────────────────────────────────

  duration: {
    instant:  '0ms',
    fastest:  '50ms',
    faster:   '100ms',
    fast:     '150ms',
    normal:   '200ms',
    slow:     '300ms',
    slower:   '400ms',
    slowest:  '500ms',
    deliberate: '700ms',
    patient:  '1000ms',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EASING FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────

  easing: {
    // Standard easings
    linear:      'linear',
    easeIn:      'cubic-bezier(0.4, 0, 1, 1)',
    easeOut:     'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut:   'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Expressive easings (for emphasis)
    spring:      'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    bounce:      'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth:      'cubic-bezier(0.25, 0.1, 0.25, 1)',
    
    // Entrance/exit easings
    enter:       'cubic-bezier(0, 0, 0.2, 1)',
    exit:        'cubic-bezier(0.4, 0, 1, 1)',
    
    // Dramatic easings (for XR, celebrations)
    dramatic:    'cubic-bezier(0.7, 0, 0.3, 1)',
    anticipate:  'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // KEYFRAME ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────

  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    fadeOut: {
      from: { opacity: 1 },
      to: { opacity: 0 },
    },
    slideInUp: {
      from: { transform: 'translateY(10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideInDown: {
      from: { transform: 'translateY(-10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideInLeft: {
      from: { transform: 'translateX(-10px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    slideInRight: {
      from: { transform: 'translateX(10px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
    scaleOut: {
      from: { transform: 'scale(1)', opacity: 1 },
      to: { transform: 'scale(0.95)', opacity: 0 },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    bounce: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    shake: {
      '0%, 100%': { transform: 'translateX(0)' },
      '25%': { transform: 'translateX(-5px)' },
      '75%': { transform: 'translateX(5px)' },
    },
    glow: {
      '0%, 100%': { boxShadow: '0 0 5px currentColor' },
      '50%': { boxShadow: '0 0 20px currentColor' },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ANIMATION PRESETS
  // ─────────────────────────────────────────────────────────────────────────

  presets: {
    fadeIn:       'fadeIn 200ms ease-out forwards',
    fadeOut:      'fadeOut 150ms ease-in forwards',
    slideUp:      'slideInUp 200ms ease-out forwards',
    slideDown:    'slideInDown 200ms ease-out forwards',
    slideLeft:    'slideInLeft 200ms ease-out forwards',
    slideRight:   'slideInRight 200ms ease-out forwards',
    scaleIn:      'scaleIn 200ms ease-out forwards',
    scaleOut:     'scaleOut 150ms ease-in forwards',
    spin:         'spin 1s linear infinite',
    pulse:        'pulse 2s ease-in-out infinite',
    bounce:       'bounce 1s ease-in-out infinite',
    shake:        'shake 0.5s ease-in-out',
    glow:         'glow 2s ease-in-out infinite',
  },
} as const;


// =============================================================================
// BREAKPOINT TOKENS
// =============================================================================

export const breakpoints = {
  // ─────────────────────────────────────────────────────────────────────────
  // BREAKPOINT VALUES
  // ─────────────────────────────────────────────────────────────────────────

  values: {
    xs:  '320px',    // Small phones
    sm:  '480px',    // Large phones
    md:  '768px',    // Tablets
    lg:  '1024px',   // Laptops
    xl:  '1280px',   // Desktops
    '2xl': '1536px', // Large desktops
    '3xl': '1920px', // Full HD
    '4xl': '2560px', // QHD/4K
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MEDIA QUERY HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  mediaQueries: {
    xs:  '@media (min-width: 320px)',
    sm:  '@media (min-width: 480px)',
    md:  '@media (min-width: 768px)',
    lg:  '@media (min-width: 1024px)',
    xl:  '@media (min-width: 1280px)',
    '2xl': '@media (min-width: 1536px)',
    '3xl': '@media (min-width: 1920px)',
    '4xl': '@media (min-width: 2560px)',
    
    // Max-width queries
    maxXs:  '@media (max-width: 319px)',
    maxSm:  '@media (max-width: 479px)',
    maxMd:  '@media (max-width: 767px)',
    maxLg:  '@media (max-width: 1023px)',
    maxXl:  '@media (max-width: 1279px)',
    
    // Special queries
    portrait:  '@media (orientation: portrait)',
    landscape: '@media (orientation: landscape)',
    hover:     '@media (hover: hover)',
    touch:     '@media (hover: none) and (pointer: coarse)',
    motion:    '@media (prefers-reduced-motion: no-preference)',
    reducedMotion: '@media (prefers-reduced-motion: reduce)',
    dark:      '@media (prefers-color-scheme: dark)',
    light:     '@media (prefers-color-scheme: light)',
    highContrast: '@media (prefers-contrast: high)',
  },
} as const;


// =============================================================================
// Z-INDEX TOKENS
// =============================================================================

export const zIndex = {
  // ─────────────────────────────────────────────────────────────────────────
  // Z-INDEX SCALE
  // ─────────────────────────────────────────────────────────────────────────

  hide:       -1,
  base:       0,
  raised:     1,
  dropdown:   1000,
  sticky:     1100,
  fixed:      1200,
  modalBackdrop: 1300,
  modal:      1400,
  popover:    1500,
  tooltip:    1600,
  toast:      1700,
  overlay:    1800,
  max:        9999,

  // ─────────────────────────────────────────────────────────────────────────
  // SEMANTIC Z-INDEX
  // ─────────────────────────────────────────────────────────────────────────

  semantic: {
    header:        1100,
    sidebar:       1050,
    sidebarOverlay: 1040,
    fab:           1030,
    drawer:        1200,
    dialog:        1400,
    menu:          1500,
    notification:  1700,
    loading:       1800,
  },
} as const;


// =============================================================================
// EXPORT ALL TOKENS
// =============================================================================

export const tokens = {
  colors,
  typography,
  spacing,
  sizing,
  borders,
  shadows,
  animation,
  breakpoints,
  zIndex,
} as const;

export type DesignTokens = typeof tokens;

export default tokens;
