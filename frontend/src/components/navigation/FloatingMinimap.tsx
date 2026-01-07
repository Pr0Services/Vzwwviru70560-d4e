/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — FLOATING MINIMAP                                ║
 * ║                    9 Sphères Orbitales autour de l'Île Ceiba                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Position: Haut-gauche, HORS de la top bar
 * Design: Île circulaire avec Ceiba au centre + 9 onglets sphères en orbite
 * Interaction: Click sur sphère = navigation, Click centre = overview
 */

import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'studio' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'team' 
  | 'scholar';

interface Sphere {
  id: SphereId;
  name: string;
  nameFr: string;
  emoji: string;
  color: string;
  colorGlow: string;
  angle: number; // Position en degrés (0 = haut)
}

interface FloatingMinimapProps {
  activeSphere: SphereId | null;
  onSphereSelect: (sphereId: SphereId) => void;
  onCenterClick: () => void;
  size?: number;
  compact?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES — 9 SPHÈRES (ARCHITECTURE GELÉE)
// ═══════════════════════════════════════════════════════════════════════════════

const SPHERES: Sphere[] = [
  { id: 'personal', name: 'Personal', nameFr: 'Personnel', emoji: '🏠', color: '#3EB4A2', colorGlow: 'rgba(62, 180, 162, 0.6)', angle: 0 },
  { id: 'business', name: 'Business', nameFr: 'Affaires', emoji: '💼', color: '#D8B26A', colorGlow: 'rgba(216, 178, 106, 0.6)', angle: 40 },
  { id: 'government', name: 'Government', nameFr: 'Gouvernement', emoji: '🏛️', color: '#8D8371', colorGlow: 'rgba(141, 131, 113, 0.6)', angle: 80 },
  { id: 'studio', name: 'Creative Studio', nameFr: 'Studio Créatif', emoji: '🎨', color: '#E07B53', colorGlow: 'rgba(224, 123, 83, 0.6)', angle: 120 },
  { id: 'community', name: 'Community', nameFr: 'Communauté', emoji: '👥', color: '#3F7249', colorGlow: 'rgba(63, 114, 73, 0.6)', angle: 160 },
  { id: 'social', name: 'Social & Media', nameFr: 'Social & Média', emoji: '📱', color: '#5B8DEE', colorGlow: 'rgba(91, 141, 238, 0.6)', angle: 200 },
  { id: 'entertainment', name: 'Entertainment', nameFr: 'Divertissement', emoji: '🎬', color: '#9B59B6', colorGlow: 'rgba(155, 89, 182, 0.6)', angle: 240 },
  { id: 'team', name: 'My Team', nameFr: 'Mon Équipe', emoji: '🤝', color: '#7A593A', colorGlow: 'rgba(122, 89, 58, 0.6)', angle: 280 },
  { id: 'scholar', name: 'Scholar', nameFr: 'Académique', emoji: '📚', color: '#2F4C39', colorGlow: 'rgba(47, 76, 57, 0.6)', angle: 320 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COULEURS CHE·NU
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  cenoteTurquoise: '#3EB4A2',
  jungleEmerald: '#3F7249',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  shadowMoss: '#2F4C39',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const FloatingMinimap: React.FC<FloatingMinimapProps> = ({
  activeSphere,
  onSphereSelect,
  onCenterClick,
  size = 200,
  compact = false,
}) => {
  const [hoveredSphere, setHoveredSphere] = useState<SphereId | null>(null);
  
  // Calcul des dimensions
  const centerSize = size * 0.45; // L'île centrale
  const tabSize = compact ? size * 0.15 : size * 0.18;
  const orbitRadius = (size / 2) - (tabSize / 2) - 4;

  // Calcul de la position d'un onglet sur l'orbite
  const getTabPosition = useCallback((angle: number) => {
    const radians = (angle - 90) * (Math.PI / 180); // -90 pour que 0° soit en haut
    return {
      x: (size / 2) + Math.cos(radians) * orbitRadius - (tabSize / 2),
      y: (size / 2) + Math.sin(radians) * orbitRadius - (tabSize / 2),
    };
  }, [size, orbitRadius, tabSize]);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        userSelect: 'none',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          CERCLE ORBITAL DE FOND
          ═══════════════════════════════════════════════════════════════════════ */}
      <svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Cercle orbital externe */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={orbitRadius}
          fill="none"
          stroke={COLORS.sacredGold}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.3"
        />
        
        {/* Lignes de connexion vers la sphère active */}
        {activeSphere && (
          <line
            x1={size / 2}
            y1={size / 2}
            x2={getTabPosition(SPHERES.find(s => s.id === activeSphere)!.angle).x + tabSize / 2}
            y2={getTabPosition(SPHERES.find(s => s.id === activeSphere)!.angle).y + tabSize / 2}
            stroke={SPHERES.find(s => s.id === activeSphere)!.color}
            strokeWidth="2"
            opacity="0.5"
          />
        )}
      </svg>

      {/* ═══════════════════════════════════════════════════════════════════════
          ÎLE CENTRALE (Background Image)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div
        onClick={onCenterClick}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: centerSize,
          height: centerSize,
          borderRadius: '50%',
          overflow: 'hidden',
          cursor: 'pointer',
          border: `3px solid ${COLORS.sacredGold}`,
          boxShadow: `
            0 0 20px ${COLORS.sacredGold}40,
            0 0 40px ${COLORS.cenoteTurquoise}20,
            inset 0 0 30px rgba(0,0,0,0.5)
          `,
          transition: 'all 0.3s ease',
        }}
        title="Retour à l'overview"
      >
        {/* Image de l'île */}
        <img
          src="/assets/images/minimap-island.png"
          alt="CHE·NU Island"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.1)',
          }}
        />
        
        {/* Overlay glow au hover */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle, transparent 40%, ${COLORS.sacredGold}20 100%)`,
            opacity: hoveredSphere === null ? 0.3 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          9 ONGLETS SPHÈRES EN ORBITE
          ═══════════════════════════════════════════════════════════════════════ */}
      {SPHERES.map((sphere) => {
        const pos = getTabPosition(sphere.angle);
        const isActive = activeSphere === sphere.id;
        const isHovered = hoveredSphere === sphere.id;
        
        return (
          <div
            key={sphere.id}
            onClick={() => onSphereSelect(sphere.id)}
            onMouseEnter={() => setHoveredSphere(sphere.id)}
            onMouseLeave={() => setHoveredSphere(null)}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: tabSize,
              height: tabSize,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: isActive ? sphere.color : COLORS.uiSlate,
              border: `2px solid ${isActive || isHovered ? sphere.color : COLORS.sacredGold}50`,
              boxShadow: isActive || isHovered 
                ? `0 0 15px ${sphere.colorGlow}, 0 0 30px ${sphere.colorGlow}` 
                : 'none',
              transform: isActive ? 'scale(1.15)' : isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s ease',
              zIndex: isActive ? 10 : isHovered ? 5 : 1,
            }}
            title={sphere.nameFr}
          >
            <span
              style={{
                fontSize: compact ? tabSize * 0.5 : tabSize * 0.55,
                filter: isActive ? 'none' : 'grayscale(30%)',
                transition: 'filter 0.2s ease',
              }}
            >
              {sphere.emoji}
            </span>
          </div>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════════════
          LABEL SPHÈRE ACTIVE
          ═══════════════════════════════════════════════════════════════════════ */}
      {activeSphere && !compact && (
        <div
          style={{
            position: 'absolute',
            bottom: -28,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 16,
            backgroundColor: `${SPHERES.find(s => s.id === activeSphere)!.color}20`,
            border: `1px solid ${SPHERES.find(s => s.id === activeSphere)!.color}`,
            fontSize: 11,
            color: SPHERES.find(s => s.id === activeSphere)!.color,
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          <span>{SPHERES.find(s => s.id === activeSphere)!.emoji}</span>
          <span>{SPHERES.find(s => s.id === activeSphere)!.nameFr}</span>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK POUR UTILISATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useFloatingMinimap = () => {
  const [activeSphere, setActiveSphere] = useState<SphereId | null>(null);
  
  const selectSphere = useCallback((sphereId: SphereId) => {
    setActiveSphere(sphereId);
  }, []);
  
  const goToOverview = useCallback(() => {
    setActiveSphere(null);
  }, []);
  
  return {
    activeSphere,
    selectSphere,
    goToOverview,
    spheres: SPHERES,
  };
};

export default FloatingMinimap;
