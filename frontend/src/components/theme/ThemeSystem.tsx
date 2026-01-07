// CHE·NU™ Theme System — Brand Colors & Dynamic Theming
// Complete theming with sphere-specific colors and dark/light modes

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ============================================================
// BRAND COLORS (From Memory Prompt - SACRED)
// ============================================================

export const CHENU_BRAND_COLORS = {
  // Primary Brand Colors
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  
  // UI Colors
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  
  // Semantic Colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

// ============================================================
// SPHERE COLORS
// ============================================================

export const SPHERE_COLORS = {
  personal: { primary: '#76E6C7', secondary: '#3EB4A2', accent: '#2F8A76' },
  business: { primary: '#5BA9FF', secondary: '#3B82F6', accent: '#1D4ED8' },
  government: { primary: '#D08FFF', secondary: '#A855F7', accent: '#7C3AED' },
  studio: { primary: '#FF8BAA', secondary: '#EC4899', accent: '#BE185D' },
  community: { primary: '#22C55E', secondary: '#16A34A', accent: '#15803D' },
  social: { primary: '#66D06F', secondary: '#4ADE80', accent: '#22C55E' },
  entertainment: { primary: '#FFB04D', secondary: '#F59E0B', accent: '#D97706' },
  team: { primary: '#5ED8FF', secondary: '#38BDF8', accent: '#0EA5E9' },
} as const;

// ============================================================
// THEME TYPES
// ============================================================

export type ThemeMode = 'dark' | 'light' | 'system';
export type SphereCode = keyof typeof SPHERE_COLORS;

export interface ThemeColors {
  // Background
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgElevated: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  // Brand
  brand: string;
  brandSecondary: string;
  brandAccent: string;
  
  // Borders
  border: string;
  borderLight: string;
  borderHover: string;
  
  // Interactive
  buttonPrimary: string;
  buttonSecondary: string;
  buttonHover: string;
  
  // Status
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Special
  nova: string;
  governance: string;
  agent: string;
  thread: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyMono: string;
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSizeXxl: string;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
}

export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  glow: string;
}

export interface Theme {
  mode: ThemeMode;
  activeSphere: SphereCode | null;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  typography: ThemeTypography;
  shadows: ThemeShadows;
}

// ============================================================
// THEME DEFINITIONS
// ============================================================

const baseSpacing: ThemeSpacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

const baseBorderRadius: ThemeBorderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

const baseTypography: ThemeTypography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFamilyMono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  fontSizeXs: '11px',
  fontSizeSm: '13px',
  fontSizeMd: '14px',
  fontSizeLg: '16px',
  fontSizeXl: '20px',
  fontSizeXxl: '28px',
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
  lineHeightTight: 1.25,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
};

const darkColors: ThemeColors = {
  bgPrimary: CHENU_BRAND_COLORS.uiSlate,
  bgSecondary: '#0a0a0b',
  bgTertiary: '#111113',
  bgElevated: '#1a1a1d',
  
  textPrimary: CHENU_BRAND_COLORS.softSand,
  textSecondary: '#b3b0a8',
  textMuted: CHENU_BRAND_COLORS.ancientStone,
  textInverse: '#0a0a0b',
  
  brand: CHENU_BRAND_COLORS.sacredGold,
  brandSecondary: CHENU_BRAND_COLORS.cenoteTurquoise,
  brandAccent: CHENU_BRAND_COLORS.jungleEmerald,
  
  border: `${CHENU_BRAND_COLORS.ancientStone}33`,
  borderLight: `${CHENU_BRAND_COLORS.ancientStone}22`,
  borderHover: `${CHENU_BRAND_COLORS.ancientStone}55`,
  
  buttonPrimary: CHENU_BRAND_COLORS.sacredGold,
  buttonSecondary: '#111113',
  buttonHover: `${CHENU_BRAND_COLORS.sacredGold}dd`,
  
  success: CHENU_BRAND_COLORS.success,
  warning: CHENU_BRAND_COLORS.warning,
  error: CHENU_BRAND_COLORS.error,
  info: CHENU_BRAND_COLORS.info,
  
  nova: CHENU_BRAND_COLORS.cenoteTurquoise,
  governance: '#9b59b6',
  agent: CHENU_BRAND_COLORS.jungleEmerald,
  thread: CHENU_BRAND_COLORS.sacredGold,
};

const lightColors: ThemeColors = {
  bgPrimary: '#f8f7f4',
  bgSecondary: '#ffffff',
  bgTertiary: '#f0ede8',
  bgElevated: '#ffffff',
  
  textPrimary: '#1a1a1d',
  textSecondary: '#4a4a4d',
  textMuted: '#6a6a6d',
  textInverse: '#ffffff',
  
  brand: '#b8923a',
  brandSecondary: '#2e9488',
  brandAccent: '#2d5a39',
  
  border: '#d1cdc4',
  borderLight: '#e5e2dc',
  borderHover: '#b8b4aa',
  
  buttonPrimary: '#b8923a',
  buttonSecondary: '#f0ede8',
  buttonHover: '#a8822a',
  
  success: '#16a34a',
  warning: '#d97706',
  error: '#dc2626',
  info: '#2563eb',
  
  nova: '#2e9488',
  governance: '#7c3aed',
  agent: '#2d5a39',
  thread: '#b8923a',
};

const darkShadows: ThemeShadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px rgba(0, 0, 0, 0.4)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
  glow: `0 0 20px ${CHENU_BRAND_COLORS.sacredGold}33`,
};

const lightShadows: ThemeShadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  glow: '0 0 20px rgba(184, 146, 58, 0.2)',
};

// ============================================================
// THEME CONTEXT
// ============================================================

interface ThemeContextType {
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
  setActiveSphere: (sphere: SphereCode | null) => void;
  getSphereColors: (sphere: SphereCode) => typeof SPHERE_COLORS.personal;
  cssVars: Record<string, string>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// ============================================================
// THEME PROVIDER
// ============================================================

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [activeSphere, setActiveSphereState] = useState<SphereCode | null>(null);

  const isDark = useMemo(() => {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return mode === 'dark';
  }, [mode]);

  const colors = useMemo(() => {
    const baseColors = isDark ? darkColors : lightColors;
    
    // Override with sphere colors if active
    if (activeSphere) {
      const sphereColor = SPHERE_COLORS[activeSphere];
      return {
        ...baseColors,
        brand: sphereColor.primary,
        brandSecondary: sphereColor.secondary,
        brandAccent: sphereColor.accent,
        buttonPrimary: sphereColor.primary,
        buttonHover: sphereColor.secondary,
      };
    }
    
    return baseColors;
  }, [isDark, activeSphere]);

  const theme: Theme = useMemo(() => ({
    mode,
    activeSphere,
    colors,
    spacing: baseSpacing,
    borderRadius: baseBorderRadius,
    typography: baseTypography,
    shadows: isDark ? darkShadows : lightShadows,
  }), [mode, activeSphere, colors, isDark]);

  const cssVars = useMemo(() => ({
    '--bg-primary': colors.bgPrimary,
    '--bg-secondary': colors.bgSecondary,
    '--bg-tertiary': colors.bgTertiary,
    '--bg-elevated': colors.bgElevated,
    '--text-primary': colors.textPrimary,
    '--text-secondary': colors.textSecondary,
    '--text-muted': colors.textMuted,
    '--brand': colors.brand,
    '--brand-secondary': colors.brandSecondary,
    '--border': colors.border,
    '--border-light': colors.borderLight,
    '--success': colors.success,
    '--warning': colors.warning,
    '--error': colors.error,
    '--info': colors.info,
    '--spacing-xs': baseSpacing.xs,
    '--spacing-sm': baseSpacing.sm,
    '--spacing-md': baseSpacing.md,
    '--spacing-lg': baseSpacing.lg,
    '--spacing-xl': baseSpacing.xl,
    '--radius-sm': baseBorderRadius.sm,
    '--radius-md': baseBorderRadius.md,
    '--radius-lg': baseBorderRadius.lg,
    '--font-family': baseTypography.fontFamily,
    '--font-family-mono': baseTypography.fontFamilyMono,
  }), [colors]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    document.documentElement.setAttribute('data-theme', newMode);
  }, []);

  const setActiveSphere = useCallback((sphere: SphereCode | null) => {
    setActiveSphereState(sphere);
    if (sphere) {
      document.documentElement.setAttribute('data-sphere', sphere);
    } else {
      document.documentElement.removeAttribute('data-sphere');
    }
  }, []);

  const getSphereColors = useCallback((sphere: SphereCode) => {
    return SPHERE_COLORS[sphere];
  }, []);

  // Apply CSS variables to document
  React.useEffect(() => {
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [cssVars]);

  return (
    <ThemeContext.Provider value={{ theme, setMode, setActiveSphere, getSphereColors, cssVars }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================
// THEME SWITCHER COMPONENT
// ============================================================

const switcherStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  button: (isActive: boolean, color: string) => ({
    padding: '8px 12px',
    backgroundColor: isActive ? `${color}22` : 'transparent',
    border: `1px solid ${isActive ? color : '#333'}`,
    borderRadius: '8px',
    color: isActive ? color : '#888',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: isActive ? 600 : 400,
    transition: 'all 0.2s ease',
  }),
  sphereButton: (isActive: boolean, color: string) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: isActive ? color : `${color}33`,
    border: `2px solid ${isActive ? color : 'transparent'}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  }),
};

export const ThemeModeSwitcher: React.FC = () => {
  const { theme, setMode } = useTheme();
  
  return (
    <div style={switcherStyles.container}>
      <button
        style={switcherStyles.button(theme.mode === 'light', CHENU_BRAND_COLORS.sacredGold)}
        onClick={() => setMode('light')}
      >
        ☀️ Light
      </button>
      <button
        style={switcherStyles.button(theme.mode === 'dark', CHENU_BRAND_COLORS.sacredGold)}
        onClick={() => setMode('dark')}
      >
        🌙 Dark
      </button>
      <button
        style={switcherStyles.button(theme.mode === 'system', CHENU_BRAND_COLORS.sacredGold)}
        onClick={() => setMode('system')}
      >
        💻 System
      </button>
    </div>
  );
};

export const SphereSwitcher: React.FC = () => {
  const { theme, setActiveSphere, getSphereColors } = useTheme();
  
  const spheres: { code: SphereCode; icon: string }[] = [
    { code: 'personal', icon: '🏠' },
    { code: 'business', icon: '💼' },
    { code: 'government', icon: '🏛️' },
    { code: 'design_studio', icon: '🎨' },
    { code: 'community', icon: '👥' },
    { code: 'social', icon: '📱' },
    { code: 'entertainment', icon: '🎬' },
    { code: 'my_team', icon: '🤝' },
  ];

  return (
    <div style={{ ...switcherStyles.container, gap: '4px' }}>
      <button
        style={{
          padding: '6px 10px',
          backgroundColor: !theme.activeSphere ? '#333' : 'transparent',
          border: '1px solid #333',
          borderRadius: '6px',
          color: !theme.activeSphere ? '#fff' : '#888',
          cursor: 'pointer',
          fontSize: '12px',
        }}
        onClick={() => setActiveSphere(null)}
      >
        Default
      </button>
      {spheres.map(sphere => {
        const colors = getSphereColors(sphere.code);
        const isActive = theme.activeSphere === sphere.code;
        return (
          <button
            key={sphere.code}
            style={switcherStyles.sphereButton(isActive, colors.primary)}
            onClick={() => setActiveSphere(sphere.code)}
            title={sphere.code}
          >
            {sphere.icon}
          </button>
        );
      })}
    </div>
  );
};

// ============================================================
// THEMED COMPONENTS
// ============================================================

interface ThemedCardProps {
  children: React.ReactNode;
  elevated?: boolean;
  style?: React.CSSProperties;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({ children, elevated, style }) => {
  const { theme } = useTheme();
  
  return (
    <div style={{
      backgroundColor: elevated ? theme.colors.bgElevated : theme.colors.bgTertiary,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border}`,
      padding: theme.spacing.lg,
      boxShadow: elevated ? theme.shadows.md : theme.shadows.none,
      ...style,
    }}>
      {children}
    </div>
  );
};

interface ThemedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  style,
}) => {
  const { theme } = useTheme();
  
  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: theme.typography.fontSizeSm },
    md: { padding: '10px 20px', fontSize: theme.typography.fontSizeMd },
    lg: { padding: '14px 28px', fontSize: theme.typography.fontSizeLg },
  };
  
  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.buttonPrimary,
      color: theme.colors.textInverse,
      border: 'none',
    },
    secondary: {
      backgroundColor: theme.colors.buttonSecondary,
      color: theme.colors.textPrimary,
      border: `1px solid ${theme.colors.border}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.textPrimary,
      border: 'none',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...sizeStyles[size],
        ...variantStyles[variant],
        borderRadius: theme.borderRadius.md,
        fontWeight: theme.typography.fontWeightSemibold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        fontFamily: theme.typography.fontFamily,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  ThemeProvider,
  useTheme,
  ThemeModeSwitcher,
  SphereSwitcher,
  ThemedCard,
  ThemedButton,
  CHENU_BRAND_COLORS,
  SPHERE_COLORS,
};
