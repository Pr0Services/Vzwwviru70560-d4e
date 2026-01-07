// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — THEME PROVIDER
// React context for theme management
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Available theme modes
 */
export type ThemeMode = 'light' | 'dark' | 'system' | 'high-contrast';

/**
 * Sphere identifiers for sphere-specific theming
 */
export type SphereId =
  | 'personal'
  | 'business'
  | 'creative'
  | 'scholar'
  | 'social'
  | 'community'
  | 'xr'
  | 'myteam'
  | 'ailab'
  | 'entertainment'
  | null;

/**
 * Theme context value
 */
export interface ThemeContextValue {
  /** Current theme mode */
  mode: ThemeMode;
  
  /** Resolved theme (accounts for 'system' preference) */
  resolvedTheme: 'light' | 'dark' | 'high-contrast';
  
  /** Current active sphere */
  sphere: SphereId;
  
  /** Whether dark mode is active */
  isDark: boolean;
  
  /** Set theme mode */
  setMode: (mode: ThemeMode) => void;
  
  /** Toggle between light and dark */
  toggleTheme: () => void;
  
  /** Set active sphere */
  setSphere: (sphere: SphereId) => void;
  
  /** System preference for dark mode */
  systemPrefersDark: boolean;
}

/**
 * Theme provider props
 */
export interface ThemeProviderProps {
  /** Child components */
  children: ReactNode;
  
  /** Default theme mode */
  defaultMode?: ThemeMode;
  
  /** Default sphere */
  defaultSphere?: SphereId;
  
  /** Storage key for persisting theme preference */
  storageKey?: string;
  
  /** Attribute to set on the document element */
  attribute?: 'class' | 'data-theme';
  
  /** Disable system theme detection */
  disableSystemDetection?: boolean;
  
  /** Callback when theme changes */
  onThemeChange?: (theme: ThemeMode, resolved: 'light' | 'dark' | 'high-contrast') => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY_THEME = 'chenu-theme-mode';
const STORAGE_KEY_SPHERE = 'chenu-theme-sphere';

// =============================================================================
// CONTEXT
// =============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get system color scheme preference
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Get stored theme from localStorage
 */
function getStoredTheme(key: string): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(key);
    if (stored && ['light', 'dark', 'system', 'high-contrast'].includes(stored)) {
      return stored as ThemeMode;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

/**
 * Get stored sphere from localStorage
 */
function getStoredSphere(key: string): SphereId | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return stored as SphereId;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

/**
 * Store theme in localStorage
 */
function storeTheme(key: string, mode: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, mode);
  } catch {
    // localStorage not available
  }
}

/**
 * Store sphere in localStorage
 */
function storeSphere(key: string, sphere: SphereId): void {
  if (typeof window === 'undefined') return;
  try {
    if (sphere) {
      localStorage.setItem(key, sphere);
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // localStorage not available
  }
}

/**
 * Apply theme to document
 */
function applyTheme(
  theme: 'light' | 'dark' | 'high-contrast',
  attribute: 'class' | 'data-theme'
): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  if (attribute === 'class') {
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
  } else {
    root.setAttribute('data-theme', theme);
  }
}

/**
 * Apply sphere to document
 */
function applySphere(sphere: SphereId): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  if (sphere) {
    root.setAttribute('data-sphere', sphere);
  } else {
    root.removeAttribute('data-sphere');
  }
}

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

/**
 * Theme Provider
 * 
 * Provides theme context to the application, handling:
 * - Light/Dark/System mode switching
 * - Sphere-specific theming
 * - Persistence via localStorage
 * - System preference detection
 * 
 * @example
 * ```tsx
 * <ThemeProvider defaultMode="system">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultMode = 'system',
  defaultSphere = null,
  storageKey = STORAGE_KEY_THEME,
  attribute = 'data-theme',
  disableSystemDetection = false,
  onThemeChange,
}: ThemeProviderProps): JSX.Element {
  // ─────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────

  const [mode, setModeState] = useState<ThemeMode>(() => {
    // Try to get stored theme, fall back to default
    return getStoredTheme(storageKey) ?? defaultMode;
  });

  const [sphere, setSphereState] = useState<SphereId>(() => {
    return getStoredSphere(STORAGE_KEY_SPHERE) ?? defaultSphere;
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    return getSystemTheme() === 'dark';
  });

  // ─────────────────────────────────────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────────────────────────────────────

  const resolvedTheme = useMemo<'light' | 'dark' | 'high-contrast'>(() => {
    if (mode === 'high-contrast') return 'high-contrast';
    if (mode === 'system') {
      return disableSystemDetection ? 'light' : (systemPrefersDark ? 'dark' : 'light');
    }
    return mode as 'light' | 'dark';
  }, [mode, systemPrefersDark, disableSystemDetection]);

  const isDark = resolvedTheme === 'dark';

  // ─────────────────────────────────────────────────────────────────────────
  // CALLBACKS
  // ─────────────────────────────────────────────────────────────────────────

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    storeTheme(storageKey, newMode);
  }, [storageKey]);

  const toggleTheme = useCallback(() => {
    setMode(isDark ? 'light' : 'dark');
  }, [isDark, setMode]);

  const setSphere = useCallback((newSphere: SphereId) => {
    setSphereState(newSphere);
    storeSphere(STORAGE_KEY_SPHERE, newSphere);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────

  // Listen for system preference changes
  useEffect(() => {
    if (disableSystemDetection || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [disableSystemDetection]);

  // Apply theme to document
  useEffect(() => {
    applyTheme(resolvedTheme, attribute);
    onThemeChange?.(mode, resolvedTheme);
  }, [resolvedTheme, attribute, mode, onThemeChange]);

  // Apply sphere to document
  useEffect(() => {
    applySphere(sphere);
  }, [sphere]);

  // ─────────────────────────────────────────────────────────────────────────
  // CONTEXT VALUE
  // ─────────────────────────────────────────────────────────────────────────

  const contextValue = useMemo<ThemeContextValue>(() => ({
    mode,
    resolvedTheme,
    sphere,
    isDark,
    setMode,
    toggleTheme,
    setSphere,
    systemPrefersDark,
  }), [
    mode,
    resolvedTheme,
    sphere,
    isDark,
    setMode,
    toggleTheme,
    setSphere,
    systemPrefersDark,
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook to access theme context
 * 
 * @throws Error if used outside ThemeProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isDark, toggleTheme, sphere } = useTheme();
 *   
 *   return (
 *     <button onClick={toggleTheme}>
 *       {isDark ? 'Light Mode' : 'Dark Mode'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Hook to get just the dark mode state
 */
export function useIsDark(): boolean {
  const { isDark } = useTheme();
  return isDark;
}

/**
 * Hook to get just the current sphere
 */
export function useCurrentSphere(): SphereId {
  const { sphere } = useTheme();
  return sphere;
}

/**
 * Hook to get theme-aware colors
 */
export function useThemeColors() {
  const { isDark, sphere } = useTheme();
  
  return useMemo(() => {
    // Return CSS variable references that will resolve correctly
    return {
      // Background
      bgPrimary: 'var(--color-bg-primary)',
      bgSecondary: 'var(--color-bg-secondary)',
      bgTertiary: 'var(--color-bg-tertiary)',
      
      // Text
      textPrimary: 'var(--color-text-primary)',
      textSecondary: 'var(--color-text-secondary)',
      textTertiary: 'var(--color-text-tertiary)',
      
      // Brand
      brandPrimary: 'var(--color-brand-primary)',
      brandSecondary: 'var(--color-brand-secondary)',
      
      // Status
      success: 'var(--color-status-success)',
      warning: 'var(--color-status-warning)',
      error: 'var(--color-status-error)',
      info: 'var(--color-status-info)',
      
      // Sphere-specific
      sphereColor: sphere ? `var(--sphere-${sphere})` : 'var(--color-brand-primary)',
      sphereColorLight: sphere ? `var(--sphere-${sphere}-light)` : 'var(--color-brand-primary)',
      sphereColorDark: sphere ? `var(--sphere-${sphere}-dark)` : 'var(--color-brand-primary)',
      
      // Meta
      isDark,
      currentSphere: sphere,
    };
  }, [isDark, sphere]);
}

// =============================================================================
// THEME TOGGLE COMPONENT
// =============================================================================

export interface ThemeToggleProps {
  /** Size of the toggle */
  size?: 'sm' | 'md' | 'lg';
  
  /** Additional CSS class */
  className?: string;
  
  /** Show label */
  showLabel?: boolean;
}

/**
 * Pre-built theme toggle component
 */
export function ThemeToggle({
  size = 'md',
  className = '',
  showLabel = false,
}: ThemeToggleProps): JSX.Element {
  const { isDark, toggleTheme, mode } = useTheme();
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`
        inline-flex items-center justify-center gap-2
        ${sizeClasses[size]}
        rounded-lg
        bg-transparent
        hover:bg-[var(--color-bg-hover)]
        active:bg-[var(--color-bg-active)]
        text-[var(--color-text-secondary)]
        hover:text-[var(--color-text-primary)]
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]
        ${className}
      `}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={`Current: ${mode} mode`}
    >
      {isDark ? (
        // Sun icon for switching to light
        <svg
          width={iconSize[size]}
          height={iconSize[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // Moon icon for switching to dark
        <svg
          width={iconSize[size]}
          height={iconSize[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}

// =============================================================================
// SPHERE SELECTOR COMPONENT
// =============================================================================

export interface SphereSelectorProps {
  /** Size of the selector */
  size?: 'sm' | 'md' | 'lg';
  
  /** Additional CSS class */
  className?: string;
  
  /** Available spheres to show */
  availableSpheres?: SphereId[];
}

const SPHERE_LABELS: Record<NonNullable<SphereId>, string> = {
  personal: 'Personnel',
  business: 'Entreprise',
  creative: 'Créatif',
  scholar: 'Études',
  social: 'Social',
  community: 'Communauté',
  xr: 'XR',
  myteam: 'Mon Équipe',
  ailab: 'AI Lab',
  entertainment: 'Divertissement',
};

const ALL_SPHERES: NonNullable<SphereId>[] = [
  'personal',
  'business',
  'creative',
  'scholar',
  'social',
  'community',
  'xr',
  'myteam',
  'ailab',
  'entertainment',
];

/**
 * Pre-built sphere selector component
 */
export function SphereSelector({
  size = 'md',
  className = '',
  availableSpheres = ALL_SPHERES,
}: SphereSelectorProps): JSX.Element {
  const { sphere, setSphere } = useTheme();

  const sizeClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  const buttonSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-wrap ${sizeClasses[size]} ${className}`}>
      {availableSpheres.filter((s): s is NonNullable<SphereId> => s !== null).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setSphere(sphere === s ? null : s)}
          className={`
            ${buttonSizeClasses[size]}
            rounded-full
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            ${sphere === s
              ? 'ring-2 ring-offset-2 ring-[var(--color-brand-primary)] scale-110'
              : 'hover:scale-105 opacity-70 hover:opacity-100'
            }
          `}
          style={{
            backgroundColor: `var(--sphere-${s})`,
          }}
          aria-label={SPHERE_LABELS[s]}
          aria-pressed={sphere === s}
          title={SPHERE_LABELS[s]}
        />
      ))}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ThemeProvider;
