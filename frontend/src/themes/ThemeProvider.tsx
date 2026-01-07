// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — THEME PROVIDER
// React Context for Theme Management
//
// Rules:
// - Switching must be instant and non-destructive
// - Agents may recommend a theme but never force it
// - Theme changes are always reversible
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

import {
  Theme,
  ThemeId,
  THEMES,
  DEFAULT_THEME,
  getTheme,
  getThemeIds,
  suggestTheme,
  UserContext,
} from './theme-tokens';

// =============================================================================
// CONTEXT TYPES
// =============================================================================

interface ThemeContextValue {
  // Current theme
  theme: Theme;
  themeId: ThemeId;

  // Theme switching
  setTheme: (id: ThemeId) => void;
  toggleTheme: () => void;

  // Theme suggestions (dismissible)
  suggestion: ThemeId | null;
  suggestFromContext: (context: UserContext) => void;
  dismissSuggestion: () => void;
  acceptSuggestion: () => void;

  // Theme info
  availableThemes: Theme[];

  // Helpers
  getSpacing: (units: number) => number;
  getDuration: (type: 'fast' | 'normal' | 'slow') => number;
  isAgentVisible: (agentType: string) => boolean;
}

// =============================================================================
// CONTEXT
// =============================================================================

const ThemeContext = createContext<ThemeContextValue | null>(null);

// =============================================================================
// STORAGE KEY
// =============================================================================

const THEME_STORAGE_KEY = 'chenu-theme';

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeId;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_STORAGE_KEY,
}) => {
  // Load initial theme from storage or use default
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    
    const stored = localStorage.getItem(storageKey);
    if (stored && getThemeIds().includes(stored as ThemeId)) {
      return stored as ThemeId;
    }
    return defaultTheme;
  });

  const [suggestion, setSuggestion] = useState<ThemeId | null>(null);

  // Get current theme object
  const theme = useMemo(() => getTheme(themeId), [themeId]);

  // Get all available themes
  const availableThemes = useMemo(() => getThemeIds().map(getTheme), []);

  // Apply theme to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
      localStorage.setItem(storageKey, themeId);
    }
  }, [themeId, storageKey]);

  // Set theme
  const setTheme = useCallback((id: ThemeId) => {
    if (getThemeIds().includes(id)) {
      setThemeId(id);
      setSuggestion(null); // Clear suggestion when manually changing
    }
  }, []);

  // Toggle through themes
  const toggleTheme = useCallback(() => {
    const ids = getThemeIds();
    const currentIndex = ids.indexOf(themeId);
    const nextIndex = (currentIndex + 1) % ids.length;
    setTheme(ids[nextIndex]);
  }, [themeId, setTheme]);

  // Suggest theme based on context
  const suggestFromContext = useCallback((context: UserContext) => {
    const suggested = suggestTheme(context);
    if (suggested && suggested !== themeId) {
      setSuggestion(suggested);
    }
  }, [themeId]);

  // Dismiss suggestion
  const dismissSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);

  // Accept suggestion
  const acceptSuggestion = useCallback(() => {
    if (suggestion) {
      setTheme(suggestion);
    }
  }, [suggestion, setTheme]);

  // Helper: Get spacing with theme multiplier
  const getSpacing = useCallback(
    (units: number) => {
      return units * theme.layout.spacing.base * theme.layout.spacing.multiplier;
    },
    [theme]
  );

  // Helper: Get duration
  const getDuration = useCallback(
    (type: 'fast' | 'normal' | 'slow') => {
      switch (type) {
        case 'fast':
          return theme.motion.durationFast;
        case 'normal':
          return theme.motion.durationNormal;
        case 'slow':
          return theme.motion.durationSlow;
      }
    },
    [theme]
  );

  // Helper: Check agent visibility
  const isAgentVisible = useCallback(
    (agentType: string) => {
      if (theme.agent.visibleAgentTypes.length === 0) {
        return false;
      }
      return theme.agent.visibleAgentTypes.includes(agentType);
    },
    [theme]
  );

  // Context value
  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      themeId,
      setTheme,
      toggleTheme,
      suggestion,
      suggestFromContext,
      dismissSuggestion,
      acceptSuggestion,
      availableThemes,
      getSpacing,
      getDuration,
      isAgentVisible,
    }),
    [
      theme,
      themeId,
      setTheme,
      toggleTheme,
      suggestion,
      suggestFromContext,
      dismissSuggestion,
      acceptSuggestion,
      availableThemes,
      getSpacing,
      getDuration,
      isAgentVisible,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ThemeProvider;
