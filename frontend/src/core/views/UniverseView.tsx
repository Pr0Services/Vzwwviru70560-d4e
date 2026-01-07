/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU™ — UNIVERSE VIEW                                ║
 * ║                       Vue Univers - Navigation Principale                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Vue principale de l'univers CHE·NU affichant les 9 sphères
 * Nova au centre, sphères en orbite interactive
 * 
 * MODES:
 * - 2D: Vue standard avec sphères plates
 * - 3D: Vue avec perspective (Three.js ready)
 * - VR: Vue immersive (WebXR ready)
 * 
 * @version 2.0.0
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';

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

export type ViewMode = '2d' | '3d' | 'vr';

interface SphereData {
  id: SphereId;
  label: string;
  labelFr: string;
  description: string;
  color: string;
  angle: number;
  icon: string;
  itemCount: number;
  activeAgents: number;
  tokensUsed: number;
}

interface AgentOrbit {
  id: string;
  name: string;
  level: 'L0' | 'L1' | 'L2' | 'L3';
  sphereId: SphereId | 'nova';
  status: 'active' | 'idle' | 'busy';
  orbitOffset: number;
}

export interface UniverseViewProps {
  /** Mode de vue */
  mode?: ViewMode;
  /** Sphère active */
  activeSphere?: SphereId | null;
  /** Sphère survolée */
  hoveredSphere?: SphereId | null;
  /** Données des sphères */
  sphereData?: Partial<Record<SphereId, Partial<SphereData>>>;
  /** Agents en orbite */
  agents?: AgentOrbit[];
  /** Afficher les agents */
  showAgents?: boolean;
  /** Afficher les statistiques */
  showStats?: boolean;
  /** Afficher les connexions inter-sphères */
  showConnections?: boolean;
  /** Callbacks */
  onSphereClick?: (sphereId: SphereId) => void;
  onSphereHover?: (sphereId: SphereId | null) => void;
  onNovaClick?: () => void;
  onAgentClick?: (agentId: string) => void;
  /** Dimensions */
  width?: number;
  height?: number;
  /** Classes CSS */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_SPHERES: SphereData[] = [
  { id: 'personal',      label: 'Personal',      labelFr: 'Personnel',    description: 'Vie personnelle et bien-être', color: '#3EB4A2', angle: 0,   icon: '🏠', itemCount: 0, activeAgents: 0, tokensUsed: 0 },
  { id: 'business',      label: 'Business',      labelFr: 'Business',     description: 'Entreprise et projets',        color: '#D8B26A', angle: 40,  icon: '💼', itemCount: 0, activeAgents: 0, tokensUsed: 0 },
  { id: 'government',    label: 'Government',    labelFr: 'Institutions', description: 'Relations institutionnelles', color: '#8D8371', angle: 80,  icon: '🏛️', itemCount: 0, activeAgents: 0, tokensUsed: 0 },
  { id: 'design_studio',        label: 'Studio',        labelFr: 'Studio',       description: 'Création et design',          color: '#7A593A', angle: 120, icon: '🎨', itemCount: 0, activeAgents: 0, tokensUsed: 0 },
  { id: 'community',     label: 'Community',     labelFr: 'Communauté',   description: 'Associations et groupes',     color: '#3F7249', angle: 160, icon: '👥', itemCount: 0, activeAgents: 0, tokensUsed: 0 },
  { id: 'social',        label: 'Social',        labelFr: 'Social',       description: 'Réseaux et médias',           color: '#2F4C39', angle: 200, icon: '📱', itemCount: 0, activeAgents: 0, tokensUsed: 0 },
  { id: 'entertainment', label: 'Entertainment', labelFr: 'Loisirs',      description: 'Divertissement et détente',   color: '#E9E4D6', angle: 240, icon: '🎬', itemCount: 0, activeAgents: 0, tokensUsed: 0 },
  { id: 'my_team',          label: 'Team',          labelFr: 'Équipe',       description: 'Collaboration et outils',     color: '#5ED8FF', angle: 280, icon: '🤝', itemCount: 0, activeAgents: 0, tokensUsed: 0 },
  { id: 'scholars',       label: 'Scholar',       labelFr: 'Savoir',       description: 'Apprentissage et recherche',  color: '#9B59B6', angle: 320, icon: '📚', itemCount: 0, activeAgents: 0, tokensUsed: 0 },
];

const COLORS = {
  gold: '#D8B26A',
  turquoise: '#3EB4A2',
  emerald: '#3F7249',
  bgDark: '#0a0a0c',
  bgCard: '#151A18',
  border: '#2A3530',
  textPrimary: '#E8E4DD',
  textSecondary: '#888888',
  textMuted: '#555555',
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

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: SPHERE CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface SphereCardProps {
  sphere: SphereData;
  position: { x: number; y: number };
  isActive: boolean;
  isHovered: boolean;
  showStats: boolean;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
  size: number;
}

const SphereCard: React.FC<SphereCardProps> = ({
  sphere, position, isActive, isHovered, showStats, onClick, onHover, size,
}) => {
  const baseSize = size;
  const currentSize = isActive ? baseSize * 1.3 : isHovered ? baseSize * 1.15 : baseSize;
  const opacity = isActive ? 1 : isHovered ? 0.95 : 0.7;

  return (
    <g
      style={{ cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      role="button"
      aria-label={`${sphere.labelFr} - ${sphere.description}`}
    >
      {/* Outer glow */}
      {(isActive || isHovered) && (
        <circle
          cx={position.x}
          cy={position.y}
          r={currentSize + 20}
          fill={sphere.color}
          opacity={0.15}
          style={{ filter: 'blur(15px)' }}
        />
      )}

      {/* Connection line to center */}
      <line
        x1={position.x}
        y1={position.y}
        x2={position.x * 0.3 + (1 - 0.3) * (position.x > 0 ? position.x : position.x)}
        y2={position.y * 0.3 + (1 - 0.3) * (position.y > 0 ? position.y : position.y)}
        stroke={sphere.color}
        strokeWidth={1}
        opacity={isActive ? 0.4 : 0.1}
        strokeDasharray={isActive ? 'none' : '4 8'}
      />

      {/* Main sphere */}
      <circle
        cx={position.x}
        cy={position.y}
        r={currentSize}
        fill={`${sphere.color}22`}
        stroke={sphere.color}
        strokeWidth={isActive ? 3 : 2}
        opacity={opacity}
        style={{ transition: 'all 0.3s ease' }}
      />

      {/* Inner circle */}
      <circle
        cx={position.x}
        cy={position.y}
        r={currentSize * 0.7}
        fill={sphere.color}
        opacity={isActive ? 0.3 : 0.15}
      />

      {/* Icon */}
      <text
        x={position.x}
        y={position.y + 4}
        textAnchor="middle"
        fontSize={currentSize * 0.5}
        style={{ pointerEvents: 'none' }}
      >
        {sphere.icon}
      </text>

      {/* Label */}
      <text
        x={position.x}
        y={position.y + currentSize + 20}
        textAnchor="middle"
        fill={isActive ? COLORS.textPrimary : COLORS.textSecondary}
        fontSize={isActive ? 14 : 12}
        fontWeight={isActive ? 600 : 400}
        style={{ 
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
          opacity: isHovered || isActive ? 1 : 0.7,
        }}
      >
        {sphere.labelFr}
      </text>

      {/* Stats badge */}
      {showStats && (isActive || isHovered) && sphere.activeAgents > 0 && (
        <g>
          <rect
            x={position.x + currentSize * 0.5}
            y={position.y - currentSize - 10}
            width={24}
            height={18}
            rx={9}
            fill={COLORS.turquoise}
          />
          <text
            x={position.x + currentSize * 0.5 + 12}
            y={position.y - currentSize - 10 + 13}
            textAnchor="middle"
            fill="white"
            fontSize={10}
            fontWeight={600}
          >
            {sphere.activeAgents}
          </text>
        </g>
      )}
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: NOVA CENTER
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaCenterProps {
  centerX: number;
  centerY: number;
  size: number;
  onClick?: () => void;
}

const NovaCenter: React.FC<NovaCenterProps> = ({ centerX, centerY, size, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <g
      style={{ cursor: 'pointer' }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      aria-label="Nova - Intelligence système centrale"
    >
      {/* Outer glow rings */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size + 40}
        fill="none"
        stroke={COLORS.turquoise}
        strokeWidth={1}
        opacity={0.1}
        strokeDasharray="8 16"
        style={{ animation: 'rotate 60s linear infinite reverse' }}
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={size + 25}
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={1}
        opacity={0.15}
        strokeDasharray="4 12"
        style={{ animation: 'rotate 45s linear infinite' }}
      />

      {/* Main glow */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size + 15}
        fill={COLORS.turquoise}
        opacity={isHovered ? 0.2 : 0.1}
        style={{ filter: 'blur(20px)', transition: 'opacity 0.3s' }}
      />

      {/* Core */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size}
        fill={`url(#novaGradient)`}
        stroke={isHovered ? COLORS.gold : COLORS.turquoise}
        strokeWidth={2}
        style={{ transition: 'all 0.3s ease' }}
      />

      {/* Inner decoration */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size * 0.6}
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={1}
        opacity={0.3}
      />

      {/* Nova star icon */}
      <path
        d={`M${centerX} ${centerY - size * 0.4} 
            L${centerX + size * 0.12} ${centerY - size * 0.12}
            L${centerX + size * 0.4} ${centerY}
            L${centerX + size * 0.12} ${centerY + size * 0.12}
            L${centerX} ${centerY + size * 0.4}
            L${centerX - size * 0.12} ${centerY + size * 0.12}
            L${centerX - size * 0.4} ${centerY}
            L${centerX - size * 0.12} ${centerY - size * 0.12}
            Z`}
        fill={COLORS.bgDark}
        opacity={0.7}
      />

      {/* NOVA label */}
      <text
        x={centerX}
        y={centerY + size + 30}
        textAnchor="middle"
        fill={COLORS.turquoise}
        fontSize={16}
        fontWeight={700}
        letterSpacing={3}
      >
        NOVA
      </text>
      <text
        x={centerX}
        y={centerY + size + 48}
        textAnchor="middle"
        fill={COLORS.textSecondary}
        fontSize={10}
      >
        Intelligence Système
      </text>
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: STARFIELD BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════════

const Starfield: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const stars = useMemo(() => {
    const result = [];
    for (let i = 0; i < 100; i++) {
      result.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
    return result;
  }, [width, height]);

  return (
    <g>
      {stars.map((star, i) => (
        <circle
          key={i}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill={COLORS.textPrimary}
          opacity={star.opacity}
        />
      ))}
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL: UNIVERSE VIEW
// ═══════════════════════════════════════════════════════════════════════════════

export const UniverseView: React.FC<UniverseViewProps> = ({
  mode = '2d',
  activeSphere = null,
  hoveredSphere: externalHoveredSphere = null,
  sphereData = {},
  agents = [],
  showAgents = false,
  showStats = true,
  showConnections = false,
  onSphereClick,
  onSphereHover,
  onNovaClick,
  onAgentClick,
  width = 800,
  height = 800,
  className,
}) => {
  const [internalHoveredSphere, setInternalHoveredSphere] = useState<SphereId | null>(null);
  const hoveredSphere = externalHoveredSphere ?? internalHoveredSphere;

  // Merge sphere data with defaults
  const spheres = useMemo(() => {
    return DEFAULT_SPHERES.map(sphere => ({
      ...sphere,
      ...sphereData[sphere.id],
    }));
  }, [sphereData]);

  // Dimensions
  const centerX = width / 2;
  const centerY = height / 2;
  const orbitRadius = Math.min(width, height) * 0.35;
  const sphereSize = Math.min(width, height) * 0.06;
  const novaSize = Math.min(width, height) * 0.08;

  // Handle sphere hover
  const handleSphereHover = useCallback((sphereId: SphereId, hovering: boolean) => {
    const newHovered = hovering ? sphereId : null;
    setInternalHoveredSphere(newHovered);
    onSphereHover?.(newHovered);
  }, [onSphereHover]);

  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundColor: COLORS.bgDark,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block' }}
      >
        {/* Definitions */}
        <defs>
          <radialGradient id="novaGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.turquoise} stopOpacity="1" />
            <stop offset="70%" stopColor={COLORS.turquoise} stopOpacity="0.7" />
            <stop offset="100%" stopColor={COLORS.emerald} stopOpacity="0.5" />
          </radialGradient>
          
          <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#151A18" stopOpacity="1" />
            <stop offset="100%" stopColor={COLORS.bgDark} stopOpacity="1" />
          </radialGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width={width} height={height} fill="url(#bgGradient)" />

        {/* Starfield */}
        <Starfield width={width} height={height} />

        {/* Orbital rings */}
        <circle
          cx={centerX}
          cy={centerY}
          r={orbitRadius}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={1}
          opacity={0.15}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={orbitRadius * 0.6}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={0.5}
          opacity={0.08}
          strokeDasharray="8 16"
        />

        {/* Connections between spheres */}
        {showConnections && spheres.map((sphere, i) => {
          const nextSphere = spheres[(i + 1) % spheres.length];
          const pos1 = getSpherePosition(sphere.angle, orbitRadius, centerX, centerY);
          const pos2 = getSpherePosition(nextSphere.angle, orbitRadius, centerX, centerY);
          return (
            <line
              key={`conn-${sphere.id}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={COLORS.gold}
              strokeWidth={0.5}
              opacity={0.1}
              strokeDasharray="4 8"
            />
          );
        })}

        {/* Spheres */}
        {spheres.map((sphere) => {
          const pos = getSpherePosition(sphere.angle, orbitRadius, centerX, centerY);
          return (
            <SphereCard
              key={sphere.id}
              sphere={sphere}
              position={pos}
              isActive={activeSphere === sphere.id}
              isHovered={hoveredSphere === sphere.id}
              showStats={showStats}
              onClick={() => onSphereClick?.(sphere.id)}
              onHover={(hovering) => handleSphereHover(sphere.id, hovering)}
              size={sphereSize}
            />
          );
        })}

        {/* Nova Center */}
        <NovaCenter
          centerX={centerX}
          centerY={centerY}
          size={novaSize}
          onClick={onNovaClick}
        />

        {/* Agent orbits */}
        {showAgents && agents.map((agent, i) => {
          const agentAngle = (i * 360 / agents.length) + Date.now() / 100;
          const agentRadius = orbitRadius * 0.5;
          const pos = getSpherePosition(agentAngle, agentRadius, centerX, centerY);
          return (
            <circle
              key={agent.id}
              cx={pos.x}
              cy={pos.y}
              r={4}
              fill={agent.status === 'active' ? COLORS.turquoise : COLORS.textMuted}
              opacity={0.8}
              style={{ cursor: 'pointer' }}
              onClick={() => onAgentClick?.(agent.id)}
            />
          );
        })}
      </svg>

      {/* CSS Animations */}
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); transform-origin: 50% 50%; }
          to { transform: rotate(360deg); transform-origin: 50% 50%; }
        }
      `}</style>

      {/* Mode indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          padding: '6px 12px',
          backgroundColor: `${COLORS.bgCard}cc`,
          borderRadius: 8,
          fontSize: 11,
          color: COLORS.textSecondary,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {mode.toUpperCase()} MODE
      </div>
    </div>
  );
};

export default UniverseView;
