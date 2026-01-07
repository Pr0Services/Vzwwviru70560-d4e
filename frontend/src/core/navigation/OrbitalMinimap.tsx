/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU™ — ORBITAL MINIMAP                              ║
 * ║                       Navigation des 9 Sphères                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Minimap orbitale minimaliste avec les 9 sphères CHE·NU
 * Nova au centre, sphères en orbite
 * 
 * ÉTATS VISUELS:
 * 1. REST: Anneau visible, sphères subtiles
 * 2. HOVER: Sphère s'illumine, label apparaît
 * 3. ACTIVE: Sphère agrandie avec glow permanent
 * 
 * @version 2.0.0
 */

import React, { useState, useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
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

interface SphereConfig {
  id: SphereId;
  label: string;
  labelFr: string;
  angle: number;
  color: string;
}

export interface OrbitalMinimapProps {
  /** Sphère actuellement active */
  activeSphere?: SphereId;
  /** Callback au clic sur une sphère */
  onSphereClick?: (sphereId: SphereId) => void;
  /** Callback au clic sur Nova (centre) */
  onNovaClick?: () => void;
  /** Taille en pixels */
  size?: number;
  /** Afficher les labels */
  showLabels?: boolean;
  /** Mode compact (sans labels) */
  compact?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION DES 9 SPHÈRES
// ═══════════════════════════════════════════════════════════════════════════════

const SPHERES: SphereConfig[] = [
  { id: 'personal',      label: 'Personal',      labelFr: 'Personnel',    angle: 0,   color: '#3EB4A2' },
  { id: 'business',      label: 'Business',      labelFr: 'Business',     angle: 40,  color: '#D8B26A' },
  { id: 'government',    label: 'Government',    labelFr: 'Institutions', angle: 80,  color: '#8D8371' },
  { id: 'design_studio',        label: 'Studio',        labelFr: 'Studio',       angle: 120, color: '#7A593A' },
  { id: 'community',     label: 'Community',     labelFr: 'Communauté',   angle: 160, color: '#3F7249' },
  { id: 'social',        label: 'Social',        labelFr: 'Social',       angle: 200, color: '#2F4C39' },
  { id: 'entertainment', label: 'Entertainment', labelFr: 'Loisirs',      angle: 240, color: '#E9E4D6' },
  { id: 'my_team',          label: 'Team',          labelFr: 'Équipe',       angle: 280, color: '#5ED8FF' },
  { id: 'scholars',       label: 'Scholar',       labelFr: 'Savoir',       angle: 320, color: '#9B59B6' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COULEURS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  gold: '#D8B26A',
  goldFaint: 'rgba(216, 178, 106, 0.08)',
  goldLight: 'rgba(216, 178, 106, 0.3)',
  goldMedium: 'rgba(216, 178, 106, 0.6)',
  turquoise: '#3EB4A2',
  bgDark: '#0d0d0f',
  textPrimary: '#E8E4DD',
  textSecondary: '#888888',
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function getSpherePosition(angle: number, radius: number, centerX: number, centerY: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
  };
}

function getLabelPosition(angle: number): { anchor: string; dx: number; dy: number } {
  // Positionner le label selon le quadrant
  if (angle >= 315 || angle < 45) return { anchor: 'middle', dx: 0, dy: -20 };
  if (angle >= 45 && angle < 135) return { anchor: 'start', dx: 15, dy: 5 };
  if (angle >= 135 && angle < 225) return { anchor: 'middle', dx: 0, dy: 25 };
  return { anchor: 'end', dx: -15, dy: 5 };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const OrbitalMinimap: React.FC<OrbitalMinimapProps> = ({
  activeSphere,
  onSphereClick,
  onNovaClick,
  size = 280,
  showLabels = true,
  compact = false,
  className,
}) => {
  const [hoveredSphere, setHoveredSphere] = useState<SphereId | null>(null);
  const [isHoveringMap, setIsHoveringMap] = useState(false);

  // Dimensions calculées
  const center = size / 2;
  const orbitRadius = size * 0.38;
  const sphereRadius = compact ? 8 : 12;
  const sphereRadiusActive = compact ? 10 : 16;
  const novaRadius = compact ? 16 : 24;

  // Déterminer si on affiche les labels
  const shouldShowLabels = showLabels && !compact && isHoveringMap;

  // Render sphere
  const renderSphere = useCallback((sphere: SphereConfig) => {
    const pos = getSpherePosition(sphere.angle, orbitRadius, center, center);
    const isActive = activeSphere === sphere.id;
    const isHovered = hoveredSphere === sphere.id;
    const showThisSphere = isHoveringMap || isActive;
    const labelPos = getLabelPosition(sphere.angle);
    
    const currentRadius = isActive ? sphereRadiusActive : isHovered ? sphereRadius + 2 : sphereRadius;
    const opacity = isActive ? 1 : isHovered ? 0.9 : showThisSphere ? 0.6 : 0.15;

    return (
      <g key={sphere.id}>
        {/* Glow effect for active/hovered */}
        {(isActive || isHovered) && (
          <circle
            cx={pos.x}
            cy={pos.y}
            r={currentRadius + 8}
            fill={sphere.color}
            opacity={0.2}
            style={{ filter: 'blur(6px)' }}
          />
        )}
        
        {/* Main sphere */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r={currentRadius}
          fill={sphere.color}
          opacity={opacity}
          stroke={isActive ? COLORS.gold : 'transparent'}
          strokeWidth={isActive ? 2 : 0}
          style={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={() => setHoveredSphere(sphere.id)}
          onMouseLeave={() => setHoveredSphere(null)}
          onClick={() => onSphereClick?.(sphere.id)}
          role="button"
          aria-label={sphere.labelFr}
        />

        {/* Label */}
        {shouldShowLabels && (isHovered || isActive) && (
          <text
            x={pos.x + labelPos.dx}
            y={pos.y + labelPos.dy}
            textAnchor={labelPos.anchor}
            fill={COLORS.textPrimary}
            fontSize={11}
            fontWeight={isActive ? 600 : 400}
            style={{
              pointerEvents: 'none',
              transition: 'opacity 0.2s ease',
            }}
          >
            {sphere.labelFr}
          </text>
        )}
      </g>
    );
  }, [activeSphere, hoveredSphere, isHoveringMap, center, orbitRadius, sphereRadius, sphereRadiusActive, onSphereClick, shouldShowLabels]);

  // Memoized spheres
  const renderedSpheres = useMemo(() => 
    SPHERES.map(renderSphere), 
    [renderSphere]
  );

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: 'relative',
      }}
      onMouseEnter={() => setIsHoveringMap(true)}
      onMouseLeave={() => {
        setIsHoveringMap(false);
        setHoveredSphere(null);
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        {/* Definitions for gradients and filters */}
        <defs>
          <radialGradient id="novaGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.turquoise} stopOpacity="1" />
            <stop offset="100%" stopColor={COLORS.turquoise} stopOpacity="0.6" />
          </radialGradient>
          
          <filter id="novaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle (subtle) */}
        <circle
          cx={center}
          cy={center}
          r={size / 2 - 2}
          fill={COLORS.bgDark}
          opacity={0.5}
        />

        {/* Orbital ring */}
        <circle
          cx={center}
          cy={center}
          r={orbitRadius}
          fill="none"
          stroke={COLORS.goldFaint}
          strokeWidth={1}
          style={{
            transition: 'stroke 0.3s ease',
            stroke: isHoveringMap ? COLORS.goldLight : COLORS.goldFaint,
          }}
        />

        {/* Inner decorative ring */}
        <circle
          cx={center}
          cy={center}
          r={orbitRadius * 0.5}
          fill="none"
          stroke={COLORS.goldFaint}
          strokeWidth={0.5}
          strokeDasharray="4 8"
          opacity={isHoveringMap ? 0.5 : 0.2}
        />

        {/* Spheres */}
        {renderedSpheres}

        {/* Nova (center) */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={onNovaClick}
          role="button"
          aria-label="Nova - Intelligence système"
        >
          {/* Nova glow */}
          <circle
            cx={center}
            cy={center}
            r={novaRadius + 10}
            fill={COLORS.turquoise}
            opacity={0.15}
            style={{ filter: 'blur(8px)' }}
          />
          
          {/* Nova core */}
          <circle
            cx={center}
            cy={center}
            r={novaRadius}
            fill="url(#novaGradient)"
            filter="url(#novaGlow)"
            style={{ transition: 'all 0.3s ease' }}
          />
          
          {/* Nova icon (star) */}
          <path
            d={`M${center} ${center - novaRadius * 0.5} 
                L${center + novaRadius * 0.15} ${center - novaRadius * 0.15}
                L${center + novaRadius * 0.5} ${center}
                L${center + novaRadius * 0.15} ${center + novaRadius * 0.15}
                L${center} ${center + novaRadius * 0.5}
                L${center - novaRadius * 0.15} ${center + novaRadius * 0.15}
                L${center - novaRadius * 0.5} ${center}
                L${center - novaRadius * 0.15} ${center - novaRadius * 0.15}
                Z`}
            fill={COLORS.bgDark}
            opacity={0.8}
          />
        </g>

        {/* Active sphere indicator ring */}
        {activeSphere && (
          <circle
            cx={center}
            cy={center}
            r={orbitRadius}
            fill="none"
            stroke={SPHERES.find(s => s.id === activeSphere)?.color || COLORS.gold}
            strokeWidth={2}
            opacity={0.3}
            strokeDasharray="8 16"
            style={{
              animation: 'rotate 30s linear infinite',
            }}
          />
        )}
      </svg>

      {/* CSS Animation */}
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); transform-origin: center; }
          to { transform: rotate(360deg); transform-origin: center; }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: MINIMAP COMPACTE (pour sidebar)
// ═══════════════════════════════════════════════════════════════════════════════

export interface CompactMinimapProps {
  activeSphere?: SphereId;
  onSphereClick?: (sphereId: SphereId) => void;
  onNovaClick?: () => void;
}

export const CompactMinimap: React.FC<CompactMinimapProps> = (props) => {
  return (
    <OrbitalMinimap
      {...props}
      size={120}
      showLabels={false}
      compact={true}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: MINIMAP HEADER (pour top bar)
// ═══════════════════════════════════════════════════════════════════════════════

export interface MinimapHeaderProps {
  activeSphere?: SphereId;
  onSphereClick?: (sphereId: SphereId) => void;
}

export const MinimapHeader: React.FC<MinimapHeaderProps> = ({
  activeSphere,
  onSphereClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeSphereConfig = SPHERES.find(s => s.id === activeSphere);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Current sphere indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          backgroundColor: `${activeSphereConfig?.color || COLORS.turquoise}22`,
          border: `1px solid ${activeSphereConfig?.color || COLORS.turquoise}44`,
          borderRadius: 20,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: activeSphereConfig?.color || COLORS.turquoise,
          }}
        />
        <span style={{ fontSize: 13, color: COLORS.textPrimary, fontWeight: 500 }}>
          {activeSphereConfig?.labelFr || 'Sélectionner'}
        </span>
      </div>

      {/* Expanded minimap */}
      {isExpanded && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 8,
            padding: 16,
            backgroundColor: COLORS.bgDark,
            borderRadius: 16,
            border: `1px solid ${COLORS.gold}33`,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            zIndex: 100,
          }}
        >
          <OrbitalMinimap
            activeSphere={activeSphere}
            onSphereClick={(id) => {
              onSphereClick?.(id);
              setIsExpanded(false);
            }}
            size={220}
          />
        </div>
      )}
    </div>
  );
};

export default OrbitalMinimap;
