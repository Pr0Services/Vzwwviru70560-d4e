// =============================================================================
// CHE·NU™ — THEME TYPES
// Version Finale V51
// 5 Thèmes: Dark Calm, Natural, Futuristic, Astral, Ancient
// =============================================================================

/**
 * Identifiants des thèmes disponibles
 */
export type ThemeId = 
  | 'dark_calm'     // Défaut - Sombre et apaisant
  | 'natural'       // Tons naturels/biophilic
  | 'futuristic'    // Sci-fi moderne
  | 'astral'        // Cosmique/étoilé
  | 'ancient'       // Ancien/mystique
  | 'high_contrast' // Accessibilité
  | 'custom';       // Personnalisé

/**
 * Mode de thème
 */
export type ThemeMode = 'dark' | 'light' | 'auto';

/**
 * Palette de couleurs
 */
export interface ThemePalette {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgElevated: string;
  bgOverlay: string;
  
  // Surfaces
  surfaceDefault: string;
  surfaceHover: string;
  surfaceActive: string;
  surfaceDisabled: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;
  textInverse: string;
  
  // Borders
  borderDefault: string;
  borderSubtle: string;
  borderStrong: string;
  borderFocus: string;
  
  // Accents
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  
  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Sphere-specific (override per sphere)
  sphereAccent: string;
  sphereGlow: string;
}

/**
 * Configuration typographique
 */
export interface ThemeTypography {
  // Font families
  fontPrimary: string;
  fontSecondary: string;
  fontMono: string;
  
  // Base sizes
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  
  // Line heights
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
  
  // Font weights
  fontWeightLight: number;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
  
  // Letter spacing
  letterSpacingTight: string;
  letterSpacingNormal: string;
  letterSpacingWide: string;
}

/**
 * Espacements
 */
export interface ThemeSpacing {
  space0: string;
  space1: string;   // 4px
  space2: string;   // 8px
  space3: string;   // 12px
  space4: string;   // 16px
  space5: string;   // 20px
  space6: string;   // 24px
  space8: string;   // 32px
  space10: string;  // 40px
  space12: string;  // 48px
  space16: string;  // 64px
  space20: string;  // 80px
}

/**
 * Rayons de bordure
 */
export interface ThemeRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

/**
 * Ombres
 */
export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  glow: string;
  inner: string;
}

/**
 * Transitions
 */
export interface ThemeTransitions {
  fast: string;
  normal: string;
  slow: string;
  bounce: string;
}

/**
 * Z-index
 */
export interface ThemeZIndex {
  base: number;
  dropdown: number;
  sticky: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
  overlay: number;
  max: number;
}

/**
 * Breakpoints
 */
export interface ThemeBreakpoints {
  xs: string;    // 320px
  sm: string;    // 640px
  md: string;    // 768px
  lg: string;    // 1024px
  xl: string;    // 1280px
  '2xl': string; // 1536px
}

/**
 * Configuration des animations
 */
export interface ThemeAnimations {
  enabled: boolean;
  reducedMotion: boolean;
  orbitSpeed: number;      // Vitesse rotation sphères
  glowPulse: number;       // Fréquence pulse glow
  transitionDuration: number;
}

/**
 * Configuration XR spécifique au thème
 */
export interface ThemeXRConfig {
  ambientLightColor: string;
  ambientLightIntensity: number;
  fogColor: string;
  fogDensity: number;
  skyboxUrl: string | null;
  particleColor: string;
  particleDensity: number;
}

/**
 * Définition complète d'un thème
 */
export interface Theme {
  // Identité
  id: ThemeId;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  mode: ThemeMode;
  
  // Design tokens
  palette: ThemePalette;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadows: ThemeShadows;
  transitions: ThemeTransitions;
  zIndex: ThemeZIndex;
  breakpoints: ThemeBreakpoints;
  
  // Comportement
  animations: ThemeAnimations;
  
  // XR
  xr: ThemeXRConfig;
  
  // Métadonnées
  version: string;
  author: string;
  isDefault: boolean;
  isCustom: boolean;
}

/**
 * Préférences utilisateur de thème
 */
export interface ThemePreferences {
  activeThemeId: ThemeId;
  mode: ThemeMode;
  reducedMotion: boolean;
  highContrast: boolean;
  customOverrides: Partial<ThemePalette>;
}

/**
 * Contexte de thème
 */
export interface ThemeContext {
  theme: Theme;
  preferences: ThemePreferences;
  setTheme: (themeId: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleReducedMotion: () => void;
  resetToDefault: () => void;
}

// =============================================================================
// CONSTANTES
// =============================================================================

export const THEME_IDS: ThemeId[] = [
  'dark_calm',
  'natural',
  'futuristic',
  'astral',
  'ancient',
  'high_contrast',
];

export const DEFAULT_THEME_ID: ThemeId = 'dark_calm';

export const THEME_MODES: ThemeMode[] = ['dark', 'light', 'auto'];

/**
 * Mapping thème → couleur d'accent principale
 */
export const THEME_ACCENT_COLORS: Record<ThemeId, string> = {
  dark_calm: '#A855F7',      // Violet doux
  natural: '#10B981',        // Vert nature
  futuristic: '#06B6D4',     // Cyan tech
  astral: '#8B5CF6',         // Violet cosmique
  ancient: '#D97706',        // Ambre ancien
  high_contrast: '#FFFFFF',  // Blanc pur
  custom: '#6366F1',         // Indigo
};

/**
 * Mapping thème → description courte
 */
export const THEME_DESCRIPTIONS: Record<ThemeId, string> = {
  dark_calm: 'Sombre et apaisant pour concentration',
  natural: 'Tons naturels biophiliques',
  futuristic: 'Interface sci-fi moderne',
  astral: 'Voyage cosmique étoilé',
  ancient: 'Sagesse mystique ancienne',
  high_contrast: 'Accessibilité maximale',
  custom: 'Votre thème personnalisé',
};
