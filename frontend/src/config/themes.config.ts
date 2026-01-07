/**
 * CHE·NU - Themes Configuration
 */

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
}

export const THEMES: Record<string, ThemeConfig> = {
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      border: '#334155',
      accent: '#22d3ee',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    }
  },
  light: {
    id: 'light',
    name: 'Light Mode',
    colors: {
      primary: '#2563eb',
      secondary: '#7c3aed',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      accent: '#0891b2',
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    }
  },
  chenu: {
    id: 'chenu',
    name: 'CHE·NU Classic',
    colors: {
      primary: '#D8B26A',     // Sacred Gold
      secondary: '#3EB4A2',   // Cenote Turquoise
      background: '#1E1F22',  // UI Slate
      surface: '#2F4C39',     // Shadow Moss
      text: '#E9E4D6',        // Soft Sand
      textMuted: '#8D8371',   // Ancient Stone
      border: '#3F7249',      // Jungle Emerald
      accent: '#3EB4A2',      // Cenote Turquoise
      success: '#3F7249',     // Jungle Emerald
      warning: '#D8B26A',     // Sacred Gold
      error: '#7A593A'        // Earth Ember
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    }
  }
};

export const DEFAULT_THEME = 'chenu';

export const getThemeConfig = (themeId: string): ThemeConfig => {
  return THEMES[themeId] || THEMES[DEFAULT_THEME];
};

export default THEMES;
