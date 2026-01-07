/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NOVA SPHERE OVERVIEW                            ║
 * ║                    Vue d'ensemble des 9 sphères pour onboarding              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from 'react';
import { SPHERES } from '../../hooks/useRouterNavigation';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaSphereOverviewProps {
  unlockedSpheres?: string[];
  activeSphere?: string | null;
  onSphereClick?: (sphereId: string) => void;
  showDescriptions?: boolean;
  compact?: boolean;
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

// Descriptions for onboarding
const SPHERE_DESCRIPTIONS: Record<string, string> = {
  personal: 'Toujours actif (point de départ)',
  business: 'Débloqué après orientation',
  government: 'Débloqué après Business',
  studio: 'Débloqué selon intérêts',
  community: 'Débloqué selon intérêts',
  social: 'Débloqué selon intérêts',
  entertainment: 'Débloqué selon intérêts',
  team: 'Débloqué avec collaboration',
  scholar: 'Débloqué selon intérêts',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const NovaSphereOverview: React.FC<NovaSphereOverviewProps> = ({
  unlockedSpheres = ['personal'],
  activeSphere = null,
  onSphereClick,
  showDescriptions = true,
  compact = false,
}) => {
  const [hoveredSphere, setHoveredSphere] = useState<string | null>(null);

  const handleClick = useCallback((sphereId: string) => {
    if (unlockedSpheres.includes(sphereId) && onSphereClick) {
      onSphereClick(sphereId);
    }
  }, [unlockedSpheres, onSphereClick]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: compact ? 16 : 24,
      }}
    >
      {/* Central Island Representation */}
      <div
        style={{
          position: 'relative',
          width: compact ? 280 : 360,
          height: compact ? 280 : 360,
          marginBottom: 24,
        }}
      >
        {/* Center Island */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: compact ? 80 : 100,
            height: compact ? 80 : 100,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${COLORS.sacredGold}40, ${COLORS.cenoteTurquoise}40)`,
            border: `3px solid ${COLORS.sacredGold}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 30px ${COLORS.sacredGold}30`,
          }}
        >
          <span style={{ fontSize: compact ? 32 : 40 }}>🏝️</span>
        </div>

        {/* Orbital Ring */}
        <svg
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
          }}
        >
          <circle
            cx="50%"
            cy="50%"
            r={compact ? 120 : 150}
            fill="none"
            stroke={COLORS.sacredGold}
            strokeWidth="1"
            strokeDasharray="6 6"
            opacity="0.3"
          />
        </svg>

        {/* Spheres in Orbit */}
        {SPHERES.map((sphere, index) => {
          const angle = (index * 40) - 90; // Starting from top
          const radians = angle * (Math.PI / 180);
          const radius = compact ? 120 : 150;
          const x = 50 + Math.cos(radians) * (radius / (compact ? 1.4 : 1.8));
          const y = 50 + Math.sin(radians) * (radius / (compact ? 1.4 : 1.8));
          
          const isUnlocked = unlockedSpheres.includes(sphere.id);
          const isActive = activeSphere === sphere.id;
          const isHovered = hoveredSphere === sphere.id;

          return (
            <button
              key={sphere.id}
              onClick={() => handleClick(sphere.id)}
              onMouseEnter={() => setHoveredSphere(sphere.id)}
              onMouseLeave={() => setHoveredSphere(null)}
              data-sphere={sphere.id}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                width: compact ? 44 : 56,
                height: compact ? 44 : 56,
                borderRadius: '50%',
                border: `2px solid ${isActive ? sphere.color : isUnlocked ? sphere.color + '80' : COLORS.border}`,
                backgroundColor: isActive 
                  ? sphere.color 
                  : isUnlocked 
                    ? COLORS.uiSlate 
                    : COLORS.uiDark,
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isUnlocked ? 1 : 0.4,
                boxShadow: isActive || isHovered 
                  ? `0 0 20px ${sphere.color}60` 
                  : 'none',
                transform: `translate(-50%, -50%) scale(${isActive ? 1.15 : isHovered && isUnlocked ? 1.1 : 1})`,
              }}
            >
              <span
                style={{
                  fontSize: compact ? 20 : 24,
                  filter: isUnlocked ? 'none' : 'grayscale(100%)',
                }}
              >
                {sphere.emoji}
              </span>
              
              {/* Lock icon for locked spheres */}
              {!isUnlocked && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    fontSize: 12,
                    backgroundColor: COLORS.uiDark,
                    borderRadius: '50%',
                    padding: 2,
                  }}
                >
                  🔒
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend / List */}
      {showDescriptions && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: compact ? '1fr' : 'repeat(3, 1fr)',
            gap: compact ? 8 : 12,
            width: '100%',
            maxWidth: 600,
          }}
        >
          {SPHERES.map((sphere) => {
            const isUnlocked = unlockedSpheres.includes(sphere.id);
            
            return (
              <div
                key={sphere.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  backgroundColor: isUnlocked ? `${sphere.color}10` : 'transparent',
                  borderRadius: 8,
                  border: `1px solid ${isUnlocked ? sphere.color + '40' : COLORS.border}`,
                  opacity: isUnlocked ? 1 : 0.5,
                }}
              >
                <span style={{ fontSize: 16 }}>{sphere.emoji}</span>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 500,
                      color: isUnlocked ? sphere.color : COLORS.ancientStone,
                    }}
                  >
                    {sphere.nameFr}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 10,
                      color: COLORS.ancientStone,
                    }}
                  >
                    {SPHERE_DESCRIPTIONS[sphere.id]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NovaSphereOverview;
