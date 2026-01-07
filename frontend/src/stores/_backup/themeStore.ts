/**
 * CHE·NU™ - Theme Store
 * Zustand store for theme management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeId, DEFAULT_THEME, applyTheme } from '../config/themes.config';

interface ThemeState {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: DEFAULT_THEME,
      
      setTheme: (theme: ThemeId) => {
        applyTheme(theme);
        set({ currentTheme: theme });
      },
    }),
    {
      name: 'chenu-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on rehydration
        if (state?.currentTheme) {
          applyTheme(state.currentTheme);
        }
      },
    }
  )
);

export default useThemeStore;
