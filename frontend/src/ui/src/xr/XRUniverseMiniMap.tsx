/**
 * ============================================================
 * CHE·NU — XR UNIVERSE MINI MAP
 * Compact version of universe map for sidebars/panels
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState, useMemo } from 'react';

// ============================================================
// COLORS
// ============================================================

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  cardBg: '#2A2B2E',
  borderColor: '#3A3B3E',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#707070',
};

// ============================================================
// TYPES
// ============================================================

interface Scene {
  id: string;
  name: string;
  icon?: string;
}

interface Portal {
  id: string;
  fromScene: string;
  toScene: string;
}

interface Universe {
  id: string;
  name: string;
  scenes: Scene[];
  portals?: Portal[];
}

interface XRUniverseMiniMapProps {
  universe: Universe;
  size?: number;
  currentSceneId?: string | null;
  showLabels?: boolean;
  onClick?: () => void;
}

// ============================================================
// COMPONENT
// ============================================================

export const XRUniverseMiniMap: React.FC<XRUniverseMiniMapProps> = ({
  universe,
  size = 150,
  currentSceneId = null,
  showLabels = false,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);

  // Position scenes in a circle
  const positionedScenes = useMemo(() => {
    const { scenes } = universe;
    const radius = (size / 2) - 30;
    const centerX = size / 2;
    const centerY = size / 2;

    return scenes.map((scene, index) => {
      const angle = (2 * Math.PI * index) / scenes.length - Math.PI / 2;
      return {
        ...scene,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [universe, size]);

  // Get unique portals
  const uniquePortals = useMemo(() => {
    const portals = universe.portals ?? [];
    const seen = new Set<string>();
    return portals.filter(portal => {
      const key = [portal.fromScene, portal.toScene].sort().join('-');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [universe.portals]);

  const getPosition = (sceneId: string) => {
    return positionedScenes.find(s => s.id === sceneId);
  };

  const nodeRadius = showLabels ? 16 : 12;

  return (
    <div
      style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '10px',
        border: `1px solid ${hovered ? COLORS.cenoteTurquoise : COLORS.borderColor}`,
        padding: '8px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Title */}
      <div
        style={{
          fontSize: '10px',
          fontWeight: 600,
          color: COLORS.textMuted,
          marginBottom: '6px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
        }}
      >
        <span>🌀</span>
        <span>{universe.scenes.length} rooms</span>
      </div>

      {/* SVG Map */}
      <svg
        width={size}
        height={size}
        style={{
          display: 'block',
          borderRadius: '6px',
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}
      >
        {/* Connections */}
        {uniquePortals.map(portal => {
          const from = getPosition(portal.fromScene);
          const to = getPosition(portal.toScene);
          if (!from || !to) return null;

          return (
            <line
              key={portal.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={COLORS.ancientStone}
              strokeWidth={1}
              strokeOpacity={0.5}
            />
          );
        })}

        {/* Nodes */}
        {positionedScenes.map(scene => {
          const isCurrent = currentSceneId === scene.id;

          return (
            <g key={scene.id}>
              {/* Highlight ring for current */}
              {isCurrent && (
                <circle
                  cx={scene.x}
                  cy={scene.y}
                  r={nodeRadius + 4}
                  fill="none"
                  stroke={COLORS.sacredGold}
                  strokeWidth={2}
                  strokeOpacity={0.6}
                />
              )}

              {/* Node circle */}
              <circle
                cx={scene.x}
                cy={scene.y}
                r={nodeRadius}
                fill={isCurrent ? `${COLORS.cenoteTurquoise}40` : 'rgba(62,180,162,0.15)'}
                stroke={isCurrent ? COLORS.sacredGold : COLORS.cenoteTurquoise}
                strokeWidth={isCurrent ? 2 : 1}
              />

              {/* Icon or label */}
              {showLabels && scene.icon ? (
                <text
                  x={scene.x}
                  y={scene.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                >
                  {scene.icon}
                </text>
              ) : (
                <circle
                  cx={scene.x}
                  cy={scene.y}
                  r={3}
                  fill={isCurrent ? COLORS.sacredGold : COLORS.cenoteTurquoise}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Current scene indicator */}
      {currentSceneId && (
        <div
          style={{
            marginTop: '6px',
            fontSize: '9px',
            color: COLORS.textMuted,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          📍 {positionedScenes.find(s => s.id === currentSceneId)?.name || 'Unknown'}
        </div>
      )}
    </div>
  );
};

export default XRUniverseMiniMap;
