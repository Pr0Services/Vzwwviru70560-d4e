/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU V25 - THEME SWITCHER UI                         ║
 * ║                                                                              ║
 * ║  Composant de sélection d'univers visuel                                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Universe, UNIVERSE_THEMES, getAllUniverses } from '../../types/chenu.types';

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    position: 'relative' as const,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'var(--chenu-surface)',
    border: '1px solid var(--chenu-border)',
    borderRadius: '8px',
    color: 'var(--chenu-text)',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  buttonHover: {
    background: 'var(--chenu-surface-hover)',
    borderColor: 'var(--chenu-accent)',
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    marginTop: '8px',
    background: 'var(--chenu-bg-secondary)',
    border: '1px solid var(--chenu-border)',
    borderRadius: '12px',
    padding: '8px',
    minWidth: '240px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    zIndex: 1000,
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  optionActive: {
    background: 'var(--chenu-accent)',
    color: '#000',
  },
  optionHover: {
    background: 'var(--chenu-surface)',
  },
  optionIcon: {
    fontSize: '24px',
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontWeight: 600,
    fontSize: '14px',
  },
  optionDesc: {
    fontSize: '12px',
    opacity: 0.7,
    marginTop: '2px',
  },
  colorPreview: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    border: '2px solid rgba(255,255,255,0.2)',
  },
  divider: {
    height: '1px',
    background: 'var(--chenu-border)',
    margin: '8px 0',
  },
  darkToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  toggle: {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    background: 'var(--chenu-surface)',
    position: 'relative' as const,
    transition: 'all 0.2s ease',
  },
  toggleActive: {
    background: 'var(--chenu-accent)',
  },
  toggleKnob: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute' as const,
    top: '2px',
    left: '2px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  toggleKnobActive: {
    left: '22px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const ThemeSwitcher: React.FC = () => {
  const { universe, theme, setUniverse, isDark, toggleDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<Universe | null>(null);

  const universes = getAllUniverses();

  return (
    <div style={styles.container}>
      {/* Trigger Button */}
      <button
        style={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
      >
        <span style={{ fontSize: '20px' }}>{theme.emoji}</span>
        <span>{theme.label}</span>
        <span style={{ marginLeft: '4px', opacity: 0.5 }}>▼</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div style={styles.dropdown}>
            {/* Universe Options */}
            {universes.map((u) => (
              <div
                key={u.id}
                style={{
                  ...styles.option,
                  ...(universe === u.id ? styles.optionActive : {}),
                  ...(hoveredOption === u.id && universe !== u.id ? styles.optionHover : {}),
                }}
                onClick={() => {
                  setUniverse(u.id);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHoveredOption(u.id)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <span style={styles.optionIcon}>{u.emoji}</span>
                <div style={styles.optionInfo}>
                  <div style={styles.optionLabel}>{u.label}</div>
                  <div style={styles.optionDesc}>
                    Salle: {u.mapping.espace}
                  </div>
                </div>
                <div
                  style={{
                    ...styles.colorPreview,
                    background: u.colors.accent,
                  }}
                />
              </div>
            ))}

            {/* Divider */}
            <div style={styles.divider} />

            {/* Dark Mode Toggle */}
            <div
              style={styles.darkToggle}
              onClick={toggleDark}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{isDark ? '🌙' : '☀️'}</span>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>
                  Mode {isDark ? 'Sombre' : 'Clair'}
                </span>
              </div>
              <div
                style={{
                  ...styles.toggle,
                  ...(isDark ? styles.toggleActive : {}),
                }}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    ...(isDark ? styles.toggleKnobActive : {}),
                  }}
                />
              </div>
            </div>

            {/* Current Theme Info */}
            <div style={styles.divider} />
            <div style={{ padding: '12px', opacity: 0.7, fontSize: '12px' }}>
              <div><strong>UI Style:</strong> {theme.uiStyle}</div>
              <div><strong>Meeting Room:</strong> {theme.meetingRoom}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MINI SWITCHER (for compact spaces)
// ═══════════════════════════════════════════════════════════════════════════════

export const ThemeSwitcherMini: React.FC = () => {
  const { universe, theme, setUniverse, isDark, toggleDark } = useTheme();
  const universes = getAllUniverses();

  const nextUniverse = () => {
    const currentIndex = universes.findIndex((u) => u.id === universe);
    const nextIndex = (currentIndex + 1) % universes.length;
    setUniverse(universes[nextIndex].id);
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={nextUniverse}
        style={{
          ...styles.button,
          padding: '8px',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          justifyContent: 'center',
        }}
        title={`Univers: ${theme.label}`}
      >
        <span style={{ fontSize: '20px' }}>{theme.emoji}</span>
      </button>
      <button
        onClick={toggleDark}
        style={{
          ...styles.button,
          padding: '8px',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          justifyContent: 'center',
        }}
        title={isDark ? 'Mode clair' : 'Mode sombre'}
      >
        <span style={{ fontSize: '20px' }}>{isDark ? '🌙' : '☀️'}</span>
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default ThemeSwitcher;
