/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NOVA THEME SELECTOR                             ║
 * ║                    Carrousel de sélection d'environnement                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from 'react';
import { NOVA_THEMES, NovaTheme } from '../scripts/NovaOnboardingScripts';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaThemeSelectorProps {
  onSelect: (themeId: string) => void;
  selectedTheme?: string | null;
  showLabels?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  uiSlate: '#1E1F22',
  uiDark: '#141416',
  softSand: '#E9E4D6',
  ancientStone: '#8D8371',
  border: '#2A2A2E',
  cenoteTurquoise: '#3EB4A2',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const NovaThemeSelector: React.FC<NovaThemeSelectorProps> = ({
  onSelect,
  selectedTheme = null,
  showLabels = false,
}) => {
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const handleSelect = useCallback((theme: NovaTheme) => {
    onSelect(theme.id);
  }, [onSelect]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 24,
      }}
    >
      {/* Theme Cards */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {NOVA_THEMES.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const isHovered = hoveredTheme === theme.id;
          
          return (
            <button
              key={theme.id}
              onClick={() => handleSelect(theme)}
              onMouseEnter={() => setHoveredTheme(theme.id)}
              onMouseLeave={() => setHoveredTheme(null)}
              style={{
                position: 'relative',
                width: 140,
                height: 180,
                padding: 0,
                border: `2px solid ${isSelected ? theme.colors.primary : isHovered ? theme.colors.primary + '80' : COLORS.border}`,
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.05)' : isHovered ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isSelected 
                  ? `0 8px 24px ${theme.colors.primary}40`
                  : isHovered 
                    ? `0 4px 16px ${theme.colors.primary}20`
                    : 'none',
              }}
            >
              {/* Background Gradient */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, ${theme.colors.background}, ${theme.colors.secondary})`,
                }}
              />
              
              {/* Decorative Elements */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 70% 30%, ${theme.colors.accent}20, transparent 50%)`,
                }}
              />
              
              {/* Content */}
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                }}
              >
                {/* Emoji */}
                <span
                  style={{
                    fontSize: 48,
                    marginBottom: 12,
                    filter: isSelected || isHovered ? 'none' : 'grayscale(30%)',
                    transition: 'filter 0.3s ease',
                  }}
                >
                  {theme.emoji}
                </span>
                
                {/* Name (optional) */}
                {showLabels && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: theme.colors.primary,
                      textAlign: 'center',
                    }}
                  >
                    {theme.name}
                  </span>
                )}
              </div>
              
              {/* Selection Indicator */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'popIn 0.3s ease',
                  }}
                >
                  <span style={{ color: 'white', fontSize: 14 }}>✓</span>
                </div>
              )}
              
              {/* Glow Effect on Hover */}
              <div
                style={{
                  position: 'absolute',
                  inset: -2,
                  borderRadius: 18,
                  background: `linear-gradient(135deg, ${theme.colors.primary}40, ${theme.colors.accent}40)`,
                  opacity: isSelected || isHovered ? 0.3 : 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: -1,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Theme Preview Info */}
      {(selectedTheme || hoveredTheme) && (
        <div
          style={{
            marginTop: 24,
            padding: '12px 24px',
            backgroundColor: COLORS.uiSlate,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            textAlign: 'center',
          }}
        >
          {(() => {
            const theme = NOVA_THEMES.find(t => t.id === (selectedTheme || hoveredTheme));
            if (!theme) return null;
            return (
              <>
                <p style={{ 
                  margin: 0, 
                  fontSize: 14, 
                  fontWeight: 600,
                  color: theme.colors.primary,
                }}>
                  {theme.name}
                </p>
                <p style={{ 
                  margin: '4px 0 0', 
                  fontSize: 11, 
                  color: COLORS.ancientStone,
                }}>
                  {selectedTheme === theme.id ? 'Sélectionné' : 'Cliquez pour sélectionner'}
                </p>
              </>
            );
          })()}
        </div>
      )}

      {/* Confirm Button */}
      {selectedTheme && (
        <button
          onClick={() => onSelect(selectedTheme)}
          style={{
            marginTop: 24,
            padding: '12px 32px',
            backgroundColor: COLORS.cenoteTurquoise,
            border: 'none',
            borderRadius: 12,
            color: COLORS.uiDark,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            animation: 'slideUp 0.3s ease',
          }}
        >
          Confirmer mon choix
        </button>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes popIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default NovaThemeSelector;
