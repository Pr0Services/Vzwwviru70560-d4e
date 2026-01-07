/**
 * ============================================================
 * CHE·NU — XR UNIVERSE MAP VIEW
 * Interactive SVG map showing rooms and portals
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState, useMemo, useCallback } from 'react';

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
  domain?: string;
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

interface PositionedScene extends Scene {
  x: number;
  y: number;
}

interface XRUniverseMapViewProps {
  universe: Universe;
  width?: number;
  height?: number;
  layout?: 'circle' | 'horizontal' | 'vertical' | 'grid';
  onSelectScene?: (sceneId: string) => void;
  selectedSceneId?: string | null;
  showLabels?: boolean;
  showIcons?: boolean;
  interactive?: boolean;
}

// ============================================================
// LAYOUT FUNCTIONS
// ============================================================

function layoutCircle(
  scenes: Scene[],
  width: number,
  height: number
): PositionedScene[] {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 60;

  return scenes.map((scene, index) => {
    const angle = (2 * Math.PI * index) / scenes.length - Math.PI / 2;
    return {
      ...scene,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
}

function layoutHorizontal(
  scenes: Scene[],
  width: number,
  height: number
): PositionedScene[] {
  const padding = 60;
  const spacing = (width - padding * 2) / (scenes.length - 1 || 1);
  const centerY = height / 2;

  return scenes.map((scene, index) => ({
    ...scene,
    x: padding + spacing * index,
    y: centerY,
  }));
}

function layoutVertical(
  scenes: Scene[],
  width: number,
  height: number
): PositionedScene[] {
  const padding = 50;
  const spacing = (height - padding * 2) / (scenes.length - 1 || 1);
  const centerX = width / 2;

  return scenes.map((scene, index) => ({
    ...scene,
    x: centerX,
    y: padding + spacing * index,
  }));
}

function layoutGrid(
  scenes: Scene[],
  width: number,
  height: number
): PositionedScene[] {
  const cols = Math.ceil(Math.sqrt(scenes.length));
  const rows = Math.ceil(scenes.length / cols);
  const cellWidth = width / (cols + 1);
  const cellHeight = height / (rows + 1);

  return scenes.map((scene, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    return {
      ...scene,
      x: cellWidth * (col + 1),
      y: cellHeight * (row + 1),
    };
  });
}

// ============================================================
// COMPONENT
// ============================================================

export const XRUniverseMapView: React.FC<XRUniverseMapViewProps> = ({
  universe,
  width = 500,
  height = 350,
  layout = 'horizontal',
  onSelectScene,
  selectedSceneId = null,
  showLabels = true,
  showIcons = true,
  interactive = true,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Position scenes based on layout
  const positionedScenes = useMemo(() => {
    const { scenes } = universe;
    switch (layout) {
      case 'circle':
        return layoutCircle(scenes, width, height);
      case 'horizontal':
        return layoutHorizontal(scenes, width, height);
      case 'vertical':
        return layoutVertical(scenes, width, height);
      case 'grid':
        return layoutGrid(scenes, width, height);
      default:
        return layoutHorizontal(scenes, width, height);
    }
  }, [universe, width, height, layout]);

  // Get position by scene ID
  const getPosition = useCallback(
    (sceneId: string): PositionedScene | undefined => {
      return positionedScenes.find(s => s.id === sceneId);
    },
    [positionedScenes]
  );

  // Filter unique portal connections (avoid duplicates)
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

  // Handle click
  const handleClick = useCallback(
    (sceneId: string) => {
      if (interactive && onSelectScene) {
        onSelectScene(sceneId);
      }
    },
    [interactive, onSelectScene]
  );

  // Node radius
  const nodeRadius = 32;

  return (
    <div
      style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '12px',
        border: `1px solid ${COLORS.borderColor}`,
        padding: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: `1px solid ${COLORS.borderColor}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🌀</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary }}>
            {universe.name}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: COLORS.textMuted }}>
          {universe.scenes.length} rooms • {uniquePortals.length} portals
        </span>
      </div>

      {/* SVG Map */}
      <svg
        width={width}
        height={height}
        style={{
          display: 'block',
          borderRadius: '8px',
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}
      >
        {/* Defs for gradients and filters */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <linearGradient id="portalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.cenoteTurquoise} stopOpacity={0.3} />
            <stop offset="50%" stopColor={COLORS.cenoteTurquoise} stopOpacity={0.8} />
            <stop offset="100%" stopColor={COLORS.cenoteTurquoise} stopOpacity={0.3} />
          </linearGradient>

          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill={COLORS.cenoteTurquoise}
              fillOpacity={0.6}
            />
          </marker>
        </defs>

        {/* Portal connections (lines) */}
        {uniquePortals.map(portal => {
          const from = getPosition(portal.fromScene);
          const to = getPosition(portal.toScene);
          if (!from || !to) return null;

          // Calculate direction for arrow offset
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offsetX = (dx / dist) * nodeRadius;
          const offsetY = (dy / dist) * nodeRadius;

          const isHighlighted =
            hoveredId === portal.fromScene || hoveredId === portal.toScene;

          return (
            <g key={portal.id}>
              <line
                x1={from.x + offsetX}
                y1={from.y + offsetY}
                x2={to.x - offsetX}
                y2={to.y - offsetY}
                stroke={isHighlighted ? COLORS.cenoteTurquoise : COLORS.ancientStone}
                strokeWidth={isHighlighted ? 3 : 2}
                strokeOpacity={isHighlighted ? 1 : 0.5}
                strokeDasharray={isHighlighted ? 'none' : '8,4'}
                markerEnd={layout === 'horizontal' ? 'url(#arrowhead)' : undefined}
              />
            </g>
          );
        })}

        {/* Scene nodes */}
        {positionedScenes.map(scene => {
          const isSelected = selectedSceneId === scene.id;
          const isHovered = hoveredId === scene.id;
          const isActive = isSelected || isHovered;

          // Determine node color based on state
          let fillColor = 'rgba(62, 180, 162, 0.15)';
          let strokeColor = COLORS.cenoteTurquoise;

          if (isSelected) {
            fillColor = `${COLORS.cenoteTurquoise}40`;
            strokeColor = COLORS.sacredGold;
          } else if (isHovered) {
            fillColor = `${COLORS.cenoteTurquoise}30`;
          }

          return (
            <g
              key={scene.id}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                transition: 'transform 0.2s ease',
              }}
              onClick={() => handleClick(scene.id)}
              onMouseEnter={() => setHoveredId(scene.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Glow effect for selected/hovered */}
              {isActive && (
                <circle
                  cx={scene.x}
                  cy={scene.y}
                  r={nodeRadius + 6}
                  fill="none"
                  stroke={isSelected ? COLORS.sacredGold : COLORS.cenoteTurquoise}
                  strokeWidth={2}
                  strokeOpacity={0.4}
                  filter="url(#glow)"
                />
              )}

              {/* Main circle */}
              <circle
                cx={scene.x}
                cy={scene.y}
                r={nodeRadius}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isActive ? 2.5 : 1.5}
              />

              {/* Icon */}
              {showIcons && scene.icon && (
                <text
                  x={scene.x}
                  y={scene.y - (showLabels ? 4 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={showLabels ? 16 : 20}
                >
                  {scene.icon}
                </text>
              )}

              {/* Label */}
              {showLabels && (
                <text
                  x={scene.x}
                  y={scene.y + (showIcons ? 14 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={9}
                  fontWeight={isActive ? 600 : 400}
                  fill={isActive ? COLORS.textPrimary : COLORS.textSecondary}
                >
                  {scene.name.length > 12
                    ? scene.name.slice(0, 10) + '...'
                    : scene.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${width - 100}, ${height - 30})`}>
          <text
            x={0}
            y={0}
            fontSize={9}
            fill={COLORS.textMuted}
            opacity={0.7}
          >
            🛡️ SAFE · READ-ONLY
          </text>
        </g>
      </svg>

      {/* Selected scene info */}
      {selectedSceneId && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            borderLeft: `3px solid ${COLORS.cenoteTurquoise}`,
          }}
        >
          {(() => {
            const scene = positionedScenes.find(s => s.id === selectedSceneId);
            if (!scene) return null;
            return (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{scene.icon}</span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: COLORS.textPrimary,
                    }}
                  >
                    {scene.name}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: COLORS.textMuted }}>
                  Domain: {scene.domain}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default XRUniverseMapView;
