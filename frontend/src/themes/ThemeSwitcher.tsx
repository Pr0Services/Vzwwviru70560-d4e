// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — THEME SWITCHER COMPONENT
// UI for Theme Selection
//
// Features:
// - Theme selection buttons/dropdown
// - Theme suggestion notification (dismissible)
// - Theme preview on hover
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { ThemeId, Theme } from './theme-tokens';

// =============================================================================
// TYPES
// =============================================================================

interface ThemeSwitcherProps {
  variant?: 'buttons' | 'dropdown' | 'minimal';
  showLabels?: boolean;
  showDescription?: boolean;
  size?: 'small' | 'medium' | 'large';
}

interface ThemeSuggestionProps {
  onAccept: () => void;
  onDismiss: () => void;
  suggestedTheme: Theme;
}

// =============================================================================
// THEME ICONS
// =============================================================================

const THEME_ICONS: Record<ThemeId, string> = {
  calm: '🌙',
  focus: '🎯',
  analysis: '📊',
  executive: '👔',
};

const THEME_COLORS: Record<ThemeId, string> = {
  calm: '#4A8FD9',
  focus: '#5DA9FF',
  analysis: '#8B5CF6',
  executive: '#F5C26B',
};

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
  },

  buttonGroup: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    background: 'var(--theme-bg-secondary)',
    borderRadius: '10px',
  },

  themeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'var(--theme-text-secondary)',
    fontSize: '0.875rem',
    transition: 'all var(--theme-duration-fast) ease-out',
  },

  themeButtonActive: {
    background: 'var(--theme-bg-elevated)',
    color: 'var(--theme-text-primary)',
  },

  themeIcon: {
    fontSize: '1.125rem',
  },

  dropdown: {
    position: 'relative' as const,
  },

  dropdownTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'var(--theme-bg-secondary)',
    border: '1px solid var(--theme-border)',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'var(--theme-text-primary)',
    fontSize: '0.9375rem',
  },

  dropdownMenu: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    padding: '4px',
    background: 'var(--theme-bg-elevated)',
    border: '1px solid var(--theme-border)',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    zIndex: 100,
  },

  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: 'var(--theme-text-primary)',
    fontSize: '0.9375rem',
    width: '100%',
    textAlign: 'left' as const,
    transition: 'background var(--theme-duration-fast) ease-out',
  },

  dropdownItemActive: {
    background: 'var(--theme-bg-active)',
  },

  minimal: {
    display: 'flex',
    gap: '4px',
  },

  minimalButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all var(--theme-duration-fast) ease-out',
  },

  suggestionBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'var(--theme-bg-elevated)',
    border: '1px solid var(--theme-border)',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },

  suggestionText: {
    flex: 1,
    fontSize: '0.875rem',
    color: 'var(--theme-text-primary)',
  },

  suggestionActions: {
    display: 'flex',
    gap: '8px',
  },

  suggestionButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all var(--theme-duration-fast) ease-out',
  },
};

// =============================================================================
// THEME SWITCHER COMPONENT
// =============================================================================

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'buttons',
  showLabels = true,
  showDescription = false,
  size = 'medium',
}) => {
  const { theme, themeId, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState<ThemeId | null>(null);

  // Render buttons variant
  if (variant === 'buttons') {
    return (
      <div style={styles.buttonGroup}>
        {availableThemes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            onMouseEnter={() => setHoveredTheme(t.id)}
            onMouseLeave={() => setHoveredTheme(null)}
            style={{
              ...styles.themeButton,
              ...(themeId === t.id ? styles.themeButtonActive : {}),
              ...(hoveredTheme === t.id && themeId !== t.id
                ? { background: 'var(--theme-bg-hover)' }
                : {}),
            }}
            title={t.description}
          >
            <span style={styles.themeIcon}>{THEME_ICONS[t.id]}</span>
            {showLabels && <span>{t.name}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Render dropdown variant
  if (variant === 'dropdown') {
    return (
      <div style={styles.dropdown}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={styles.dropdownTrigger}
        >
          <span>{THEME_ICONS[themeId]}</span>
          <span>{theme.name}</span>
          <span style={{ marginLeft: 'auto' }}>{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div style={styles.dropdownMenu}>
            {availableThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                style={{
                  ...styles.dropdownItem,
                  ...(themeId === t.id ? styles.dropdownItemActive : {}),
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{THEME_ICONS[t.id]}</span>
                <div>
                  <div style={{ fontWeight: 500 }}>{t.name}</div>
                  {showDescription && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--theme-text-muted)',
                        marginTop: '2px',
                      }}
                    >
                      {t.description}
                    </div>
                  )}
                </div>
                {themeId === t.id && (
                  <span style={{ marginLeft: 'auto', color: 'var(--theme-accent)' }}>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render minimal variant
  return (
    <div style={styles.minimal}>
      {availableThemes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          style={{
            ...styles.minimalButton,
            borderColor: themeId === t.id ? THEME_COLORS[t.id] : 'transparent',
            background: themeId === t.id ? `${THEME_COLORS[t.id]}20` : 'transparent',
          }}
          title={`${t.name}: ${t.description}`}
        >
          {THEME_ICONS[t.id]}
        </button>
      ))}
    </div>
  );
};

// =============================================================================
// THEME SUGGESTION COMPONENT
// =============================================================================

export const ThemeSuggestion: React.FC = () => {
  const { suggestion, dismissSuggestion, acceptSuggestion, availableThemes } = useTheme();

  if (!suggestion) return null;

  const suggestedTheme = availableThemes.find((t) => t.id === suggestion);
  if (!suggestedTheme) return null;

  return (
    <div style={styles.suggestionBanner}>
      <span style={{ fontSize: '1.25rem' }}>{THEME_ICONS[suggestion]}</span>
      <div style={styles.suggestionText}>
        <strong>Suggestion:</strong> Switch to <strong>{suggestedTheme.name}</strong> theme
        <span style={{ color: 'var(--theme-text-muted)', marginLeft: '8px' }}>
          — {suggestedTheme.description}
        </span>
      </div>
      <div style={styles.suggestionActions}>
        <button
          onClick={dismissSuggestion}
          style={{
            ...styles.suggestionButton,
            background: 'transparent',
            border: '1px solid var(--theme-border)',
            color: 'var(--theme-text-secondary)',
          }}
        >
          Dismiss
        </button>
        <button
          onClick={acceptSuggestion}
          style={{
            ...styles.suggestionButton,
            background: 'var(--theme-accent)',
            border: 'none',
            color: '#FFFFFF',
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// THEME INDICATOR (Minimal display of current theme)
// =============================================================================

export const ThemeIndicator: React.FC = () => {
  const { theme, themeId } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        background: `${THEME_COLORS[themeId]}15`,
        borderRadius: '6px',
        fontSize: '0.8125rem',
        color: THEME_COLORS[themeId],
      }}
    >
      <span>{THEME_ICONS[themeId]}</span>
      <span>{theme.name}</span>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ThemeSwitcher;
