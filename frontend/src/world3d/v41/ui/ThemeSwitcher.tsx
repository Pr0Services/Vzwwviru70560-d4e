/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 UI — THEME SWITCHER
 * Elegant theme switching interface with smooth transitions
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import type { V41Theme } from '../V41Complete';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ThemeSwitcherProps {
  currentTheme: V41Theme;
  onThemeChange: (theme: V41Theme, smooth: boolean) => Promise<void>;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  compact?: boolean;
  showLabels?: boolean;
}

interface ThemeConfig {
  id: V41Theme;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const THEMES: ThemeConfig[] = [
  {
    id: 'normal',
    label: 'Normal',
    emoji: '🏢',
    color: '#E9E4D6', // Soft Sand
    description: 'Clean studio environment',
  },
  {
    id: 'atlean',
    label: 'Atlean',
    emoji: '🏛️',
    color: '#D8B26A', // Sacred Gold
    description: 'Ancient Maya mysticism',
  },
  {
    id: 'futuristic',
    label: 'Futuristic',
    emoji: '🚀',
    color: '#00F0FF', // Cyan neon
    description: 'Cyber city of tomorrow',
  },
  {
    id: 'cosmic',
    label: 'Cosmic',
    emoji: '🌌',
    color: '#9D4EDD', // Purple cosmic
    description: 'Deep space exploration',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// THEME SWITCHER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
  position = 'top-right',
  compact = false,
  showLabels = true,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleThemeClick = async (theme: V41Theme) => {
    if (theme === currentTheme || isTransitioning) return;

    setIsTransitioning(true);
    
    try {
      await onThemeChange(theme, true); // Smooth transition
    } catch (error) {
      console.error('Theme change failed:', error);
    } finally {
      setIsTransitioning(false);
      if (compact) {
        setIsExpanded(false);
      }
    }
  };

  const currentThemeConfig = THEMES.find(t => t.id === currentTheme);

  // Position styles
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
  };

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 1000,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {compact ? (
        // Compact mode: Current theme button + expandable menu
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isTransitioning}
            style={{
              background: 'rgba(30, 31, 34, 0.95)',
              border: `2px solid ${currentThemeConfig?.color}`,
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#FFFFFF',
              cursor: isTransitioning ? 'wait' : 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              opacity: isTransitioning ? 0.6 : 1,
            }}
          >
            <span>{currentThemeConfig?.emoji}</span>
            {showLabels && (
              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                {currentThemeConfig?.label}
              </span>
            )}
            <span style={{ fontSize: '12px', opacity: 0.6 }}>
              {isExpanded ? '▲' : '▼'}
            </span>
          </button>

          {/* Expanded menu */}
          {isExpanded && (
            <div
              style={{
                position: 'absolute',
                top: '60px',
                right: 0,
                background: 'rgba(30, 31, 34, 0.98)',
                borderRadius: '12px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                minWidth: '200px',
              }}
            >
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeClick(theme.id)}
                  disabled={isTransitioning || theme.id === currentTheme}
                  style={{
                    background: theme.id === currentTheme 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#FFFFFF',
                    cursor: theme.id === currentTheme ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                    opacity: theme.id === currentTheme ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (theme.id !== currentTheme && !isTransitioning) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (theme.id !== currentTheme) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{theme.emoji}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontWeight: 500 }}>{theme.label}</div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>
                      {theme.description}
                    </div>
                  </div>
                  {theme.id === currentTheme && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: theme.color,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Full mode: All themes visible
        <div
          style={{
            background: 'rgba(30, 31, 34, 0.95)',
            borderRadius: '16px',
            padding: '12px',
            display: 'flex',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeClick(theme.id)}
              disabled={isTransitioning || theme.id === currentTheme}
              title={`${theme.label} - ${theme.description}`}
              style={{
                background: theme.id === currentTheme 
                  ? `linear-gradient(135deg, ${theme.color}40, ${theme.color}20)` 
                  : 'rgba(255, 255, 255, 0.05)',
                border: theme.id === currentTheme 
                  ? `2px solid ${theme.color}` 
                  : '2px solid transparent',
                borderRadius: '12px',
                padding: showLabels ? '12px 16px' : '12px',
                color: '#FFFFFF',
                cursor: theme.id === currentTheme ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.3s ease',
                minWidth: showLabels ? '80px' : '48px',
                opacity: isTransitioning ? 0.4 : theme.id === currentTheme ? 1 : 0.7,
              }}
              onMouseEnter={(e) => {
                if (theme.id !== currentTheme && !isTransitioning) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (theme.id !== currentTheme) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <span style={{ fontSize: '24px' }}>{theme.emoji}</span>
              {showLabels && (
                <span style={{ fontSize: '12px', fontWeight: 500 }}>
                  {theme.label}
                </span>
              )}
            </button>
          ))}

          {/* Transition indicator */}
          {isTransitioning && (
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(216, 178, 106, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 1s ease-in-out infinite',
              }}
            >
              <span style={{ fontSize: '12px' }}>⏳</span>
            </div>
          )}
        </div>
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default ThemeSwitcher;
