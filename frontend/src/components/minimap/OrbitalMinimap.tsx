/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — ORBITAL MINIMAP
 * Governed Intelligence Operating System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Minimalist orbital navigation with 9 spheres on a sacred ring
 * Inspired by sacred geometry and cosmic harmony
 * 
 * VISUAL STATES:
 * ─────────────
 * 1. REST:        Ring visible, spheres invisible/very faint
 * 2. HOVER MAP:   Spheres appear (40-60% opacity), no labels
 * 3. HOVER SPHERE: Sphere grows, soft glow, label appears (1 word)
 * 4. ACTIVE:      Constant glow, enlarged, label always visible
 * 
 * CONSTRAINTS:
 * ────────────
 * - No icons, no emojis
 * - Simple typography
 * - Slow, fluid animations
 * - One active sphere at a time
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'design_studio' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'my_team' 
  | 'scholars';

interface Sphere {
  id: SphereId;
  label: string;       // UN seul mot
  angle: number;       // Degrés depuis le haut (0° = 12h)
}

interface OrbitalMinimapProps {
  /** Sphère actuellement active */
  activeSphere?: SphereId;
  /** Callback au clic sur une sphère */
  onSphereClick?: (sphereId: SphereId) => void;
  /** Taille en pixels (défaut: 300) */
  size?: number;
  /** Image de fond personnalisée */
  backgroundImage?: string;
  /** Classe CSS additionnelle */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DÉFINITION UX DES 9 SPHÈRES
// ═══════════════════════════════════════════════════════════════════════════════
// 
// Positionnement: horloge à 9 positions
// Angle 0° = 12h (haut), sens horaire
//
// ═══════════════════════════════════════════════════════════════════════════════

const SPHERES: Sphere[] = [
  { id: 'personal',      label: 'Personnel',    angle: 0 },     // 12h  - TOP
  { id: 'business',      label: 'Business',     angle: 40 },    // ~1h30
  { id: 'government',    label: 'Institutions', angle: 80 },    // ~3h
  { id: 'design_studio',        label: 'Studio',       angle: 120 },   // ~4h
  { id: 'community',     label: 'Communauté',   angle: 160 },   // ~5h30
  { id: 'social',        label: 'Social',       angle: 200 },   // ~7h
  { id: 'entertainment', label: 'Loisirs',      angle: 240 },   // ~8h
  { id: 'my_team',          label: 'Équipe',       angle: 280 },   // ~9h30
  { id: 'scholars',       label: 'Savoir',       angle: 320 },   // ~11h
];

// ═══════════════════════════════════════════════════════════════════════════════
// COULEURS CHE·NU
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  sacredGoldFaint: 'rgba(216, 178, 106, 0.08)',
  sacredGoldLight: 'rgba(216, 178, 106, 0.45)',
  sacredGoldMedium: 'rgba(216, 178, 106, 0.7)',
  sacredGoldFull: 'rgba(216, 178, 106, 1)',
  glowSoft: 'rgba(216, 178, 106, 0.4)',
  glowStrong: 'rgba(216, 178, 106, 0.7)',
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Position sur l'anneau
// ═══════════════════════════════════════════════════════════════════════════════

function getSpherePosition(
  angle: number, 
  radius: number, 
  centerX: number, 
  centerY: number
): { x: number; y: number } {
  // Convertir en radians, 0° = haut (soustraire 90°)
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Position du label selon le quadrant
// ═══════════════════════════════════════════════════════════════════════════════

function getLabelStyle(angle: number, size: number): React.CSSProperties {
  const offset = size * 0.06;
  const normalizedAngle = ((angle % 360) + 360) % 360;
  
  // TOP (315° - 45°)
  if (normalizedAngle >= 315 || normalizedAngle < 45) {
    return { 
      bottom: '100%', 
      left: '50%', 
      transform: 'translateX(-50%)',
      marginBottom: offset,
      textAlign: 'center',
    };
  }
  // RIGHT (45° - 135°)
  if (normalizedAngle >= 45 && normalizedAngle < 135) {
    return { 
      top: '50%', 
      left: '100%', 
      transform: 'translateY(-50%)',
      marginLeft: offset,
      textAlign: 'left',
    };
  }
  // BOTTOM (135° - 225°)
  if (normalizedAngle >= 135 && normalizedAngle < 225) {
    return { 
      top: '100%', 
      left: '50%', 
      transform: 'translateX(-50%)',
      marginTop: offset,
      textAlign: 'center',
    };
  }
  // LEFT (225° - 315°)
  return { 
    top: '50%', 
    right: '100%', 
    transform: 'translateY(-50%)',
    marginRight: offset,
    textAlign: 'right',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const OrbitalMinimap: React.FC<OrbitalMinimapProps> = ({
  activeSphere,
  onSphereClick,
  size = 300,
  backgroundImage,
  className = '',
}) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────
  
  const [isMapHovered, setIsMapHovered] = useState(false);
  const [hoveredSphere, setHoveredSphere] = useState<SphereId | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // DIMENSIONS
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Rayon de l'anneau (ajuster selon l'image)
  const ringRadiusPercent = 0.35;
  const radius = size * ringRadiusPercent;
  const center = size / 2;
  const sphereBaseSize = Math.max(8, size * 0.032);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  
  const handleSphereClick = useCallback((sphereId: SphereId) => {
    onSphereClick?.(sphereId);
  }, [onSphereClick]);

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE LOGIC
  // ─────────────────────────────────────────────────────────────────────────────
  
  type VisualState = 'rest' | 'visible' | 'hovered' | 'active';
  
  const getSphereState = (sphereId: SphereId): VisualState => {
    if (sphereId === activeSphere) return 'active';
    if (sphereId === hoveredSphere) return 'hovered';
    if (isMapHovered) return 'visible';
    return 'rest';
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onMouseEnter={() => setIsMapHovered(true)}
      onMouseLeave={() => {
        setIsMapHovered(false);
        setHoveredSphere(null);
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          BACKGROUND: L'anneau (image)
          ═══════════════════════════════════════════════════════════════════════ */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SVG FALLBACK: Anneau si pas d'image
          ═══════════════════════════════════════════════════════════════════════ */}
      {!backgroundImage && (
        <svg
          width={size}
          height={size}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {/* Anneau externe */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={COLORS.sacredGoldLight}
            strokeWidth={1.5}
            opacity={0.6}
          />
          {/* Anneau interne (glow) */}
          <circle
            cx={center}
            cy={center}
            r={radius * 0.85}
            fill="none"
            stroke={COLORS.sacredGoldFaint}
            strokeWidth={1}
            opacity={0.3}
          />
        </svg>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SPHERES LAYER
          ═══════════════════════════════════════════════════════════════════════ */}
      {SPHERES.map((sphere) => {
        const position = getSpherePosition(sphere.angle, radius, center, center);
        const state = getSphereState(sphere.id);
        
        // ─────────────────────────────────────────────────────────────────────
        // VISUAL STATE STYLES
        // ─────────────────────────────────────────────────────────────────────
        
        const stateConfig = {
          rest: {
            size: sphereBaseSize,
            background: COLORS.sacredGoldFaint,
            boxShadow: 'none',
            labelOpacity: 0,
          },
          visible: {
            size: sphereBaseSize,
            background: COLORS.sacredGoldLight,
            boxShadow: `0 0 8px ${COLORS.glowSoft}`,
            labelOpacity: 0,
          },
          hovered: {
            size: sphereBaseSize * 1.5,
            background: COLORS.sacredGoldMedium,
            boxShadow: `0 0 16px ${COLORS.glowSoft}, 0 0 32px ${COLORS.sacredGoldFaint}`,
            labelOpacity: 1,
          },
          active: {
            size: sphereBaseSize * 1.6,
            background: COLORS.sacredGoldFull,
            boxShadow: `0 0 20px ${COLORS.glowStrong}, 0 0 40px ${COLORS.glowSoft}`,
            labelOpacity: 1,
          },
        };
        
        const config = stateConfig[state];
        const labelStyle = getLabelStyle(sphere.angle, size);

        return (
          <div
            key={sphere.id}
            style={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -50%)',
              zIndex: state === 'active' || state === 'hovered' ? 10 : 1,
            }}
            onMouseEnter={() => setHoveredSphere(sphere.id)}
            onMouseLeave={() => setHoveredSphere(null)}
            onClick={() => handleSphereClick(sphere.id)}
          >
            {/* ─────────────────────────────────────────────────────────────────
                SPHERE DOT
                ───────────────────────────────────────────────────────────────── */}
            <div
              style={{
                width: config.size,
                height: config.size,
                borderRadius: '50%',
                background: config.background,
                boxShadow: config.boxShadow,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
            />

            {/* ─────────────────────────────────────────────────────────────────
                LABEL (1 mot)
                ───────────────────────────────────────────────────────────────── */}
            <span
              style={{
                position: 'absolute',
                whiteSpace: 'nowrap',
                fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
                fontSize: Math.max(10, size * 0.032),
                fontWeight: 400,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: state === 'active' ? COLORS.sacredGold : COLORS.sacredGoldMedium,
                opacity: config.labelOpacity,
                transition: 'all 0.3s ease',
                pointerEvents: 'none',
                ...labelStyle,
              }}
            >
              {sphere.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default OrbitalMinimap;
export { SPHERES, COLORS };
export type { Sphere, OrbitalMinimapProps };
