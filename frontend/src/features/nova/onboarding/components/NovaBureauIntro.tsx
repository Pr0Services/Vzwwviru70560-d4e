/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NOVA BUREAU INTRO                               ║
 * ║                    Présentation des 6 sections du Bureau                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';
import { BUREAU_SECTIONS_INFO } from '../scripts/NovaOnboardingScripts';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaBureauIntroProps {
  sphereName?: string;
  sphereColor?: string;
  sphereEmoji?: string;
  highlightSection?: string | null;
  onSectionClick?: (sectionId: string) => void;
  animated?: boolean;
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
  sacredGold: '#D8B26A',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const NovaBureauIntro: React.FC<NovaBureauIntroProps> = ({
  sphereName = 'Personnel',
  sphereColor = COLORS.cenoteTurquoise,
  sphereEmoji = '🏠',
  highlightSection = null,
  onSectionClick,
  animated = true,
}) => {
  const [visibleSections, setVisibleSections] = useState<number>(0);

  // Animate sections appearing one by one
  useEffect(() => {
    if (!animated) {
      setVisibleSections(BUREAU_SECTIONS_INFO.length);
      return;
    }

    const timer = setInterval(() => {
      setVisibleSections(prev => {
        if (prev >= BUREAU_SECTIONS_INFO.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [animated]);

  return (
    <div
      style={{
        padding: 24,
        backgroundColor: COLORS.uiSlate,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <span style={{ fontSize: 32 }}>{sphereEmoji}</span>
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: sphereColor,
            }}
          >
            Bureau — {sphereName}
          </h3>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 12,
              color: COLORS.ancientStone,
            }}
          >
            6 sections pour organiser ton travail
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        {BUREAU_SECTIONS_INFO.map((section, index) => {
          const isVisible = index < visibleSections;
          const isHighlighted = highlightSection === section.id;

          return (
            <button
              key={section.id}
              data-section={section.id}
              onClick={() => onSectionClick?.(section.id)}
              style={{
                padding: 16,
                backgroundColor: isHighlighted 
                  ? `${sphereColor}20` 
                  : COLORS.uiDark,
                border: `1px solid ${isHighlighted ? sphereColor : COLORS.border}`,
                borderRadius: 12,
                cursor: onSectionClick ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Highlight glow */}
              {isHighlighted && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at center, ${sphereColor}20, transparent)`,
                    animation: 'pulse 2s infinite',
                  }}
                />
              )}

              <div style={{ position: 'relative' }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>
                  {section.emoji}
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isHighlighted ? sphereColor : COLORS.softSand,
                  }}
                >
                  {section.name}
                </p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 11,
                    color: COLORS.ancientStone,
                  }}
                >
                  {section.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: `${COLORS.sacredGold}10`,
          borderRadius: 8,
          borderLeft: `3px solid ${COLORS.sacredGold}`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: COLORS.softSand,
          }}
        >
          💡 <strong>Astuce:</strong> Chaque sphère possède le même Bureau avec ces 6 sections. 
          Seul le contenu change selon le contexte.
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NovaBureauIntro;
