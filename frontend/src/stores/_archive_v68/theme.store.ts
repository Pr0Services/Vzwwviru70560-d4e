// =============================================================================
// CHE·NU™ — THEME STORE
// Version Finale V51
// =============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Theme, ThemeId, ThemeMode, ThemePalette, DEFAULT_THEME_ID } from '../types';
import { getTheme, THEMES_DATA } from '../data/themes.data';

interface ThemeStore {
  // State
  activeThemeId: ThemeId;
  theme: Theme;
  mode: ThemeMode;
  reducedMotion: boolean;
  highContrast: boolean;
  customOverrides: Partial<ThemePalette>;
  
  // Actions
  setTheme: (themeId: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  setCustomOverride: (key: keyof ThemePalette, value: string) => void;
  clearCustomOverrides: () => void;
  resetToDefault: () => void;
  
  // Computed
  getEffectivePalette: () => ThemePalette;
}

const initialTheme = getTheme(DEFAULT_THEME_ID);

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set, get) => ({
        activeThemeId: DEFAULT_THEME_ID,
        theme: initialTheme,
        mode: 'dark',
        reducedMotion: false,
        highContrast: false,
        customOverrides: {},
        
        setTheme: (themeId) => {
          const theme = getTheme(themeId);
          set({ activeThemeId: themeId, theme });
          
          // Apply CSS variables
          applyThemeToCss(theme);
        },
        
        setMode: (mode) => set({ mode }),
        
        toggleReducedMotion: () => {
          const newValue = !get().reducedMotion;
          set({ reducedMotion: newValue });
          document.documentElement.classList.toggle('reduce-motion', newValue);
        },
        
        toggleHighContrast: () => {
          const state = get();
          if (state.highContrast) {
            // Revert to previous theme
            const theme = getTheme(state.activeThemeId);
            set({ highContrast: false, theme });
            applyThemeToCss(theme);
          } else {
            // Switch to high contrast
            const theme = getTheme('high_contrast');
            set({ highContrast: true, theme });
            applyThemeToCss(theme);
          }
        },
        
        setCustomOverride: (key, value) => {
          const overrides = { ...get().customOverrides, [key]: value };
          set({ customOverrides: overrides });
          
          // Apply single CSS variable
          document.documentElement.style.setProperty(`--${camelToKebab(key)}`, value);
        },
        
        clearCustomOverrides: () => {
          set({ customOverrides: {} });
          applyThemeToCss(get().theme);
        },
        
        resetToDefault: () => {
          const theme = getTheme(DEFAULT_THEME_ID);
          set({
            activeThemeId: DEFAULT_THEME_ID,
            theme,
            mode: 'dark',
            reducedMotion: false,
            highContrast: false,
            customOverrides: {},
          });
          applyThemeToCss(theme);
        },
        
        getEffectivePalette: () => {
          const { theme, customOverrides } = get();
          return { ...theme.palette, ...customOverrides };
        },
      }),
      {
        name: 'chenu-theme-store',
        partialize: (state) => ({
          activeThemeId: state.activeThemeId,
          mode: state.mode,
          reducedMotion: state.reducedMotion,
          customOverrides: state.customOverrides,
        }),
      }
    ),
    { name: 'ThemeStore' }
  )
);

// =============================================================================
// HELPERS
// =============================================================================

function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function applyThemeToCss(theme: Theme): void {
  const root = document.documentElement;
  
  // Apply palette
  Object.entries(theme.palette).forEach(([key, value]) => {
    root.style.setProperty(`--${camelToKebab(key)}`, value);
  });
  
  // Apply typography
  Object.entries(theme.typography).forEach(([key, value]) => {
    root.style.setProperty(`--${camelToKebab(key)}`, String(value));
  });
  
  // Apply spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--${camelToKebab(key)}`, value);
  });
  
  // Apply radius
  Object.entries(theme.radius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });
  
  // Apply shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
  
  // Apply mode class
  root.classList.remove('theme-light', 'theme-dark');
  root.classList.add(`theme-${theme.mode}`);
  
  // Apply theme id class
  Object.keys(THEMES_DATA).forEach(id => {
    root.classList.remove(`theme-${id}`);
  });
  root.classList.add(`theme-${theme.id}`);
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('chenu-theme-store');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.activeThemeId) {
        const theme = getTheme(state.activeThemeId);
        applyThemeToCss(theme);
      }
    } catch (e) {
      applyThemeToCss(initialTheme);
    }
  } else {
    applyThemeToCss(initialTheme);
  }
}
