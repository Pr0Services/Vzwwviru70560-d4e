/**
 * CHE·NU - useTheme Hook
 * Gestion du thème de l'application
 */

import { useState, useCallback, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('chenu_theme');
    return (saved as Theme) || 'dark';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(prefersDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('chenu_theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark'
  };
};

export default useTheme;
