/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU™ — MAP VIEW                                     ║
 * ║                       Vue Carte - Navigation Géographique                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Vue carte alternative de l'univers CHE·NU
 * Représentation en îles/territoires interconnectés
 * Style: Carte au trésor moderne / Sanctuaire Maya
 * 
 * ZONES:
 * - Centre: Nova (Temple Central)
 * - Nord: Personal (Maison)
 * - Est: Business + Government (Cité)
 * - Sud: Studio + Entertainment (Jardins)
 * - Ouest: Community + Social (Village)
 * - Périphérie: Team + Scholar (Observatoire)
 * 
 * @version 2.0.0
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';

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

interface TerritoryConfig {
  id: SphereId;
  label: string;
  labelFr: string;
  x: number;  // Position X en % (0-100)
  y: number;  // Position Y en % (0-100)
  size: number; // Taille relative
  color: string;
  icon: string;
  zone: string;
  paths: SphereId[]; // Connexions vers autres territoires
}

interface PathConfig {
  from: SphereId;
  to: SphereId;
  type: 'main' | 'secondary' | 'hidden';
}

export interface MapViewProps {
  /** Sphère active */
  activeSphere?: SphereId | null;
  /** Sphère survolée */
  hoveredSphere?: SphereId | null;
  /** Données des territoires */
  territoryData?: Partial<Record<SphereId, { itemCount?: number; activity?: number }>>;
  /** Afficher les chemins */
  showPaths?: boolean;
  /** Afficher les labels */
  showLabels?: boolean;
  /** Mode exploration */
  explorationMode?: boolean;
  /** Callbacks */
  onTerritoryClick?: (sphereId: SphereId) => void;
  onTerritoryHover?: (sphereId: SphereId | null) => void;
  onNovaClick?: () => void;
  /** Dimensions */
  width?: number;
  height?: number;
  /** Classes CSS */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION DES TERRITOIRES
// ═══════════════════════════════════════════════════════════════════════════════

const TERRITORIES: TerritoryConfig[] = [
  { id: 'personal',      labelFr: 'Personnel',    label: 'Personal',      x: 50, y: 18, size: 1.2, color: '#3EB4A2', icon: '🏠', zone: 'Nord',   paths: ['business', 'community', 'scholar'] },
  { id: 'business',      labelFr: 'Business',     label: 'Business',      x: 72, y: 32, size: 1.3, color: '#D8B26A', icon: '💼', zone: 'Est',    paths: ['personal', 'government', 'studio'] },
  { id: 'government',    labelFr: 'Institutions', label: 'Government',    x: 82, y: 55, size: 1.0, color: '#8D8371', icon: '🏛️', zone: 'Est',    paths: ['business', 'community'] },
  { id: 'design_studio',        labelFr: 'Studio',       label: 'Studio',        x: 68, y: 75, size: 1.1, color: '#7A593A', icon: '🎨', zone: 'Sud',    paths: ['business', 'entertainment'] },
  { id: 'community',     labelFr: 'Communauté',   label: 'Community',     x: 22, y: 42, size: 1.0, color: '#3F7249', icon: '👥', zone: 'Ouest',  paths: ['personal', 'social', 'government'] },
  { id: 'social',        labelFr: 'Social',       label: 'Social',        x: 18, y: 65, size: 0.9, color: '#2F4C39', icon: '📱', zone: 'Ouest',  paths: ['community', 'entertainment'] },
  { id: 'entertainment', labelFr: 'Loisirs',      label: 'Entertainment', x: 42, y: 82, size: 1.0, color: '#E9E4D6', icon: '🎬', zone: 'Sud',    paths: ['design_studio', 'social'] },
  { id: 'my_team',          labelFr: 'Équipe',       label: 'Team',          x: 28, y: 22, size: 1.0, color: '#5ED8FF', icon: '🤝', zone: 'Nord',   paths: ['personal', 'scholar'] },
  { id: 'scholars',       labelFr: 'Savoir',       label: 'Scholar',       x: 78, y: 18, size: 1.1, color: '#9B59B6', icon: '📚', zone: 'Nord',   paths: ['personal', 'my_team', 'business'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COULEURS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  gold: '#D8B26A',
  goldLight: '#D8B26A44',
  turquoise: '#3EB4A2',
  emerald: '#3F7249',
  bgDark: '#0a0a0c',
  bgMap: '#0d100f',
  bgTerritory: '#151A18',
  water: '#0a1612',
  waterLight: '#0d1a15',
  pathMain: '#D8B26A55',
  pathSecondary: '#D8B26A22',
  textPrimary: '#E8E4DD',
  textSecondary: '#888888',
  textMuted: '#555555',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: TERRITORY NODE
// ═══════════════════════════════════════════════════════════════════════════════

interface TerritoryNodeProps {
  territory: TerritoryConfig;
  isActive: boolean;
  isHovered: boolean;
  itemCount?: number;
  activity?: number;
  showLabel: boolean;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
  containerWidth: number;
  containerHeight: number;
}

const TerritoryNode: React.FC<TerritoryNodeProps> = ({
  territory, isActive, isHovered, itemCount, activity = 0,
  showLabel, onClick, onHover, containerWidth, containerHeight,
}) => {
  const x = (territory.x / 100) * containerWidth;
  const y = (territory.y / 100) * containerHeight;
  const baseSize = Math.min(containerWidth, containerHeight) * 0.06 * territory.size;
  const currentSize = isActive ? baseSize * 1.25 : isHovered ? baseSize * 1.1 : baseSize;
  
  // Activity pulse animation
  const showActivity = activity > 0;

  return (
    <g
      style={{ cursor: 'pointer' }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      role="button"
      aria-label={territory.labelFr}
    >
      {/* Territory glow/shadow */}
      <ellipse
        cx={x}
        cy={y + currentSize * 0.3}
        rx={currentSize * 1.2}
        ry={currentSize * 0.4}
        fill={COLORS.bgDark}
        opacity={0.5}
        style={{ filter: 'blur(8px)' }}
      />

      {/* Activity pulse ring */}
      {showActivity && (
        <circle
          cx={x}
          cy={y}
          r={currentSize + 15}
          fill="none"
          stroke={territory.color}
          strokeWidth={2}
          opacity={0.3}
          style={{ animation: 'territoryPulse 2s ease-in-out infinite' }}
        />
      )}

      {/* Outer glow for active/hovered */}
      {(isActive || isHovered) && (
        <circle
          cx={x}
          cy={y}
          r={currentSize + 10}
          fill={territory.color}
          opacity={0.2}
          style={{ filter: 'blur(12px)' }}
        />
      )}

      {/* Main territory circle */}
      <circle
        cx={x}
        cy={y}
        r={currentSize}
        fill={`${territory.color}22`}
        stroke={territory.color}
        strokeWidth={isActive ? 3 : 2}
        style={{ transition: 'all 0.3s ease' }}
      />

      {/* Inner decoration */}
      <circle
        cx={x}
        cy={y}
        r={currentSize * 0.7}
        fill={territory.color}
        opacity={isActive ? 0.35 : 0.2}
      />

      {/* Icon */}
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize={currentSize * 0.6}
        style={{ pointerEvents: 'none' }}
      >
        {territory.icon}
      </text>

      {/* Label */}
      {showLabel && (
        <g>
          {/* Label background */}
          <rect
            x={x - 45}
            y={y + currentSize + 8}
            width={90}
            height={22}
            rx={11}
            fill={COLORS.bgDark}
            opacity={0.85}
          />
          <text
            x={x}
            y={y + currentSize + 23}
            textAnchor="middle"
            fill={isActive ? territory.color : COLORS.textPrimary}
            fontSize={11}
            fontWeight={isActive ? 600 : 400}
            style={{ pointerEvents: 'none' }}
          >
            {territory.labelFr}
          </text>
        </g>
      )}

      {/* Item count badge */}
      {itemCount !== undefined && itemCount > 0 && (
        <g>
          <circle
            cx={x + currentSize * 0.7}
            cy={y - currentSize * 0.7}
            r={12}
            fill={COLORS.turquoise}
          />
          <text
            x={x + currentSize * 0.7}
            y={y - currentSize * 0.7 + 4}
            textAnchor="middle"
            fill="white"
            fontSize={10}
            fontWeight={600}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </text>
        </g>
      )}
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: PATH BETWEEN TERRITORIES
// ═══════════════════════════════════════════════════════════════════════════════

interface PathLineProps {
  from: TerritoryConfig;
  to: TerritoryConfig;
  isHighlighted: boolean;
  containerWidth: number;
  containerHeight: number;
}

const PathLine: React.FC<PathLineProps> = ({
  from, to, isHighlighted, containerWidth, containerHeight,
}) => {
  const x1 = (from.x / 100) * containerWidth;
  const y1 = (from.y / 100) * containerHeight;
  const x2 = (to.x / 100) * containerWidth;
  const y2 = (to.y / 100) * containerHeight;

  // Calculer le point de contrôle pour une courbe
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const offset = Math.sqrt(dx * dx + dy * dy) * 0.15;
  const ctrlX = midX - dy * 0.2;
  const ctrlY = midY + dx * 0.2;

  return (
    <path
      d={`M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`}
      fill="none"
      stroke={isHighlighted ? COLORS.gold : COLORS.pathSecondary}
      strokeWidth={isHighlighted ? 2 : 1}
      strokeDasharray={isHighlighted ? 'none' : '6 10'}
      opacity={isHighlighted ? 0.6 : 0.3}
      style={{ transition: 'all 0.3s ease' }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: NOVA TEMPLE (Centre)
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaCenterProps {
  x: number;
  y: number;
  size: number;
  onClick?: () => void;
}

const NovaTemple: React.FC<NovaCenterProps> = ({ x, y, size, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <g
      style={{ cursor: 'pointer' }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Temple base shadow */}
      <ellipse
        cx={x}
        cy={y + size * 0.5}
        rx={size * 1.5}
        ry={size * 0.4}
        fill={COLORS.bgDark}
        opacity={0.6}
        style={{ filter: 'blur(10px)' }}
      />

      {/* Outer glow rings */}
      <circle
        cx={x}
        cy={y}
        r={size + 30}
        fill="none"
        stroke={COLORS.turquoise}
        strokeWidth={1}
        opacity={0.15}
        strokeDasharray="12 8"
        style={{ animation: 'rotate 40s linear infinite' }}
      />
      <circle
        cx={x}
        cy={y}
        r={size + 18}
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={1}
        opacity={0.2}
        strokeDasharray="4 12"
        style={{ animation: 'rotate 30s linear infinite reverse' }}
      />

      {/* Main temple glow */}
      <circle
        cx={x}
        cy={y}
        r={size + 8}
        fill={COLORS.turquoise}
        opacity={isHovered ? 0.25 : 0.15}
        style={{ filter: 'blur(15px)', transition: 'opacity 0.3s' }}
      />

      {/* Temple structure - stepped pyramid style */}
      <polygon
        points={`
          ${x} ${y - size * 0.8}
          ${x + size * 0.3} ${y - size * 0.4}
          ${x + size * 0.6} ${y}
          ${x + size * 0.8} ${y + size * 0.3}
          ${x - size * 0.8} ${y + size * 0.3}
          ${x - size * 0.6} ${y}
          ${x - size * 0.3} ${y - size * 0.4}
        `}
        fill={`${COLORS.turquoise}33`}
        stroke={COLORS.turquoise}
        strokeWidth={2}
      />

      {/* Inner chamber */}
      <circle
        cx={x}
        cy={y}
        r={size * 0.35}
        fill={COLORS.bgDark}
        stroke={COLORS.gold}
        strokeWidth={2}
      />

      {/* Nova star */}
      <path
        d={`M${x} ${y - size * 0.2} 
            L${x + size * 0.06} ${y - size * 0.06}
            L${x + size * 0.2} ${y}
            L${x + size * 0.06} ${y + size * 0.06}
            L${x} ${y + size * 0.2}
            L${x - size * 0.06} ${y + size * 0.06}
            L${x - size * 0.2} ${y}
            L${x - size * 0.06} ${y - size * 0.06}
            Z`}
        fill={COLORS.turquoise}
        style={{ 
          filter: `drop-shadow(0 0 6px ${COLORS.turquoise})`,
          animation: 'novaPulse 3s ease-in-out infinite',
        }}
      />

      {/* NOVA label */}
      <text
        x={x}
        y={y + size + 25}
        textAnchor="middle"
        fill={COLORS.gold}
        fontSize={14}
        fontWeight={700}
        letterSpacing={4}
      >
        NOVA
      </text>
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: MAP DECORATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const MapDecorations: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  return (
    <g opacity={0.3}>
      {/* Compass rose */}
      <g transform={`translate(${width - 60}, ${height - 60})`}>
        <circle r={25} fill="none" stroke={COLORS.gold} strokeWidth={1} opacity={0.5} />
        <path d="M0 -20 L3 0 L0 20 L-3 0 Z" fill={COLORS.gold} opacity={0.6} />
        <path d="M-20 0 L0 3 L20 0 L0 -3 Z" fill={COLORS.gold} opacity={0.4} />
        <text y={-28} textAnchor="middle" fontSize={8} fill={COLORS.gold}>N</text>
      </g>

      {/* Corner decorations */}
      <path
        d={`M20 20 L50 20 M20 20 L20 50`}
        stroke={COLORS.gold}
        strokeWidth={2}
        fill="none"
        opacity={0.4}
      />
      <path
        d={`M${width - 20} 20 L${width - 50} 20 M${width - 20} 20 L${width - 20} 50`}
        stroke={COLORS.gold}
        strokeWidth={2}
        fill="none"
        opacity={0.4}
      />

      {/* Water texture dots */}
      {Array.from({ length: 50 }).map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * width}
          cy={Math.random() * height}
          r={1}
          fill={COLORS.turquoise}
          opacity={0.1 + Math.random() * 0.1}
        />
      ))}
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL: MAP VIEW
// ═══════════════════════════════════════════════════════════════════════════════

export const MapView: React.FC<MapViewProps> = ({
  activeSphere = null,
  hoveredSphere: externalHoveredSphere = null,
  territoryData = {},
  showPaths = true,
  showLabels = true,
  explorationMode = false,
  onTerritoryClick,
  onTerritoryHover,
  onNovaClick,
  width = 900,
  height = 700,
  className,
}) => {
  const [internalHoveredSphere, setInternalHoveredSphere] = useState<SphereId | null>(null);
  const hoveredSphere = externalHoveredSphere ?? internalHoveredSphere;

  // Générer les chemins uniques entre territoires
  const paths = useMemo(() => {
    const result: Array<{ from: TerritoryConfig; to: TerritoryConfig }> = [];
    const seen = new Set<string>();
    
    TERRITORIES.forEach(territory => {
      territory.paths.forEach(targetId => {
        const key = [territory.id, targetId].sort().join('-');
        if (!seen.has(key)) {
          seen.add(key);
          const target = TERRITORIES.find(t => t.id === targetId);
          if (target) {
            result.push({ from: territory, to: target });
          }
        }
      });
    });
    
    return result;
  }, []);

  // Handlers
  const handleTerritoryHover = useCallback((sphereId: SphereId, hovering: boolean) => {
    const newHovered = hovering ? sphereId : null;
    setInternalHoveredSphere(newHovered);
    onTerritoryHover?.(newHovered);
  }, [onTerritoryHover]);

  // Nova position
  const novaX = width * 0.5;
  const novaY = height * 0.5;
  const novaSize = Math.min(width, height) * 0.08;

  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundColor: COLORS.bgMap,
        borderRadius: 20,
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
          <radialGradient id="mapBgGradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={COLORS.waterLight} />
            <stop offset="100%" stopColor={COLORS.water} />
          </radialGradient>
          
          <filter id="mapGlow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Background */}
        <rect width={width} height={height} fill="url(#mapBgGradient)" />

        {/* Map decorations */}
        <MapDecorations width={width} height={height} />

        {/* Paths between territories */}
        {showPaths && paths.map(({ from, to }, i) => {
          const isHighlighted = 
            activeSphere === from.id || 
            activeSphere === to.id ||
            hoveredSphere === from.id ||
            hoveredSphere === to.id;
          
          return (
            <PathLine
              key={`path-${i}`}
              from={from}
              to={to}
              isHighlighted={isHighlighted}
              containerWidth={width}
              containerHeight={height}
            />
          );
        })}

        {/* Paths from territories to Nova */}
        {TERRITORIES.map(territory => {
          const x = (territory.x / 100) * width;
          const y = (territory.y / 100) * height;
          const isHighlighted = activeSphere === territory.id || hoveredSphere === territory.id;
          
          return (
            <line
              key={`nova-path-${territory.id}`}
              x1={x}
              y1={y}
              x2={novaX}
              y2={novaY}
              stroke={isHighlighted ? territory.color : COLORS.pathSecondary}
              strokeWidth={1}
              strokeDasharray="4 12"
              opacity={isHighlighted ? 0.4 : 0.1}
            />
          );
        })}

        {/* Territories */}
        {TERRITORIES.map(territory => (
          <TerritoryNode
            key={territory.id}
            territory={territory}
            isActive={activeSphere === territory.id}
            isHovered={hoveredSphere === territory.id}
            itemCount={territoryData[territory.id]?.itemCount}
            activity={territoryData[territory.id]?.activity}
            showLabel={showLabels}
            onClick={() => onTerritoryClick?.(territory.id)}
            onHover={(hovering) => handleTerritoryHover(territory.id, hovering)}
            containerWidth={width}
            containerHeight={height}
          />
        ))}

        {/* Nova Temple (center) */}
        <NovaTemple
          x={novaX}
          y={novaY}
          size={novaSize}
          onClick={onNovaClick}
        />
      </svg>

      {/* CSS Animations */}
      <style>{`
        @keyframes territoryPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); transform-origin: center; }
          to { transform: rotate(360deg); transform-origin: center; }
        }
        @keyframes novaPulse {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 6px ${COLORS.turquoise}); }
          50% { opacity: 0.7; filter: drop-shadow(0 0 12px ${COLORS.turquoise}); }
        }
      `}</style>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          padding: '12px 16px',
          backgroundColor: `${COLORS.bgDark}dd`,
          borderRadius: 12,
          border: `1px solid ${COLORS.gold}33`,
        }}
      >
        <div style={{ fontSize: 10, color: COLORS.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          Carte CHE·NU
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.turquoise }} />
            <span style={{ fontSize: 11, color: COLORS.textPrimary }}>Nova</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', border: `2px solid ${COLORS.gold}` }} />
            <span style={{ fontSize: 11, color: COLORS.textPrimary }}>Territoires</span>
          </div>
        </div>
      </div>

      {/* Mode indicator */}
      {explorationMode && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            padding: '6px 12px',
            backgroundColor: `${COLORS.turquoise}22`,
            border: `1px solid ${COLORS.turquoise}`,
            borderRadius: 8,
            fontSize: 11,
            color: COLORS.turquoise,
          }}
        >
          🧭 Mode Exploration
        </div>
      )}
    </div>
  );
};

export default MapView;
