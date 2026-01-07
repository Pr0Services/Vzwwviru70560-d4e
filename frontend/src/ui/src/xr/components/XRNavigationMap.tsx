/**
 * ============================================================
 * CHE·NU — XR NAVIGATION MAP
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * 2D symbolic map showing scenes as nodes and portals as edges.
 * NO real 3D, NO actual navigation, PURE TOPOLOGY.
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// ============================================================
// TYPES
// ============================================================

interface NavNode {
  id: string;
  sceneId: string;
  label: string;
  sphere: string;
  x: number;
  y: number;
}

interface NavLink {
  id: string;
  from: string;
  to: string;
  label?: string;
  bidirectional: boolean;
  linkType: 'portal' | 'adjacency' | 'hierarchy';
}

interface XRNavigationMapProps {
  nodes: NavNode[];
  links: NavLink[];
  selectedNode?: string | null;
  onNodeSelect?: (nodeId: string | null) => void;
  onLinkSelect?: (linkId: string | null) => void;
  width?: number;
  height?: number;
}

// ============================================================
// CONSTANTS
// ============================================================

const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

const SPHERE_COLORS: Record<string, string> = {
  personal: CHENU_COLORS.sacredGold,
  business: CHENU_COLORS.jungleEmerald,
  creative: '#9B59B6',
  social: CHENU_COLORS.cenoteTurquoise,
  scholar: '#3498DB',
  ailab: '#00D9FF',
  entertainment: '#E74C3C',
  systems: CHENU_COLORS.ancientStone,
  health: '#27AE60',
  construction: CHENU_COLORS.earthEmber,
};

const SPHERE_ICONS: Record<string, string> = {
  personal: '🏠',
  business: '💼',
  creative: '🎨',
  social: '👥',
  scholar: '📚',
  ailab: '🤖',
  entertainment: '🎮',
  systems: '⚙️',
  health: '💚',
  construction: '🏗️',
};

const LINK_COLORS: Record<string, string> = {
  portal: CHENU_COLORS.cenoteTurquoise,
  adjacency: CHENU_COLORS.ancientStone,
  hierarchy: CHENU_COLORS.sacredGold,
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    backgroundColor: '#0a0a0a',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  gridLine: {
    stroke: 'rgba(62, 180, 162, 0.1)',
    strokeWidth: 1,
  },
  linkLine: {
    strokeWidth: 2,
    fill: 'none',
  },
  nodeCircle: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  nodeLabel: {
    fill: CHENU_COLORS.softSand,
    fontSize: '11px',
    textAnchor: 'middle',
    pointerEvents: 'none',
  },
  legend: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '11px',
    color: CHENU_COLORS.softSand,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  legendLine: {
    width: '20px',
    height: '2px',
  },
  controls: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    gap: '6px',
  },
  controlButton: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.softSand,
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    zIndex: 100,
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRNavigationMap: React.FC<XRNavigationMapProps> = ({
  nodes,
  links,
  selectedNode,
  onNodeSelect,
  onLinkSelect,
  width = 600,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Calculate scale to fit nodes
  const viewBox = useMemo(() => {
    if (nodes.length === 0) return { minX: 0, minY: 0, width: 100, height: 100 };

    const padding = 50;
    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const minX = Math.min(...xs) - padding;
    const maxX = Math.max(...xs) + padding;
    const minY = Math.min(...ys) - padding;
    const maxY = Math.max(...ys) + padding;

    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [nodes]);

  // Get node by ID
  const getNode = useCallback((id: string) => nodes.find(n => n.id === id), [nodes]);

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string) => {
    onNodeSelect?.(selectedNode === nodeId ? null : nodeId);
  }, [selectedNode, onNodeSelect]);

  // Handle mouse move for tooltip
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({ x: e.clientX - rect.left + 10, y: e.clientY - rect.top - 10 });
    }
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom(z => Math.min(z * 1.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(z => Math.max(z / 1.2, 0.5));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Node color
  const getNodeColor = useCallback((sphere: string) => {
    return SPHERE_COLORS[sphere] ?? CHENU_COLORS.ancientStone;
  }, []);

  // Node icon
  const getNodeIcon = useCallback((sphere: string) => {
    return SPHERE_ICONS[sphere] ?? '📍';
  }, []);

  // Hovered info
  const hoveredNodeData = hoveredNode ? getNode(hoveredNode) : null;
  const hoveredLinkData = hoveredLink ? links.find(l => l.id === hoveredLink) : null;

  return (
    <div style={{ ...styles.container, width, height }} onMouseMove={handleMouseMove}>
      <svg
        ref={svgRef}
        style={styles.svg}
        viewBox={`${viewBox.minX / zoom - pan.x} ${viewBox.minY / zoom - pan.y} ${viewBox.width / zoom} ${viewBox.height / zoom}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" style={styles.gridLine} />
          </pattern>
        </defs>
        <rect
          x={viewBox.minX - 1000}
          y={viewBox.minY - 1000}
          width={viewBox.width + 2000}
          height={viewBox.height + 2000}
          fill="url(#grid)"
        />

        {/* Links */}
        {links.map(link => {
          const fromNode = getNode(link.from);
          const toNode = getNode(link.to);
          if (!fromNode || !toNode) return null;

          const isHovered = hoveredLink === link.id;
          const linkColor = LINK_COLORS[link.linkType] ?? CHENU_COLORS.ancientStone;

          return (
            <g key={link.id}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={linkColor}
                strokeWidth={isHovered ? 3 : 2}
                strokeOpacity={isHovered ? 1 : 0.6}
                strokeDasharray={link.bidirectional ? 'none' : '8,4'}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => onLinkSelect?.(link.id)}
              />
              {/* Arrow for unidirectional */}
              {!link.bidirectional && (
                <polygon
                  points={`0,-4 8,0 0,4`}
                  fill={linkColor}
                  transform={`translate(${(fromNode.x + toNode.x) / 2}, ${(fromNode.y + toNode.y) / 2}) rotate(${Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x) * 180 / Math.PI})`}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const isSelected = selectedNode === node.id;
          const isHovered = hoveredNode === node.id;
          const color = getNodeColor(node.sphere);
          const radius = isSelected ? 28 : isHovered ? 26 : 24;

          return (
            <g
              key={node.id}
              style={{ cursor: 'pointer' }}
              onClick={() => handleNodeClick(node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Glow effect */}
              {(isSelected || isHovered) && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 8}
                  fill={color}
                  fillOpacity={0.2}
                />
              )}
              
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={`${color}30`}
                stroke={color}
                strokeWidth={isSelected ? 3 : 2}
                style={styles.nodeCircle}
              />
              
              {/* Icon */}
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fontSize="18"
                style={{ pointerEvents: 'none' }}
              >
                {getNodeIcon(node.sphere)}
              </text>
              
              {/* Label */}
              <text
                x={node.x}
                y={node.y + radius + 14}
                style={styles.nodeLabel}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Info */}
      <div style={styles.info}>
        {nodes.length} nodes • {links.length} links
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button style={styles.controlButton} onClick={handleZoomIn}>+</button>
        <button style={styles.controlButton} onClick={handleZoomOut}>−</button>
        <button style={styles.controlButton} onClick={handleReset}>⌂</button>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendLine, backgroundColor: LINK_COLORS.portal }} />
          <span>Portal</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendLine, backgroundColor: LINK_COLORS.adjacency, borderStyle: 'dashed' }} />
          <span>Adjacency</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendLine, backgroundColor: LINK_COLORS.hierarchy }} />
          <span>Hierarchy</span>
        </div>
      </div>

      {/* Tooltip */}
      {(hoveredNodeData || hoveredLinkData) && (
        <div style={{ ...styles.tooltip, left: tooltipPos.x, top: tooltipPos.y }}>
          {hoveredNodeData && (
            <>
              <strong>{hoveredNodeData.label}</strong>
              <br />
              <span style={{ color: CHENU_COLORS.ancientStone }}>
                {hoveredNodeData.sphere}
              </span>
            </>
          )}
          {hoveredLinkData && (
            <>
              <strong>{hoveredLinkData.label ?? 'Connection'}</strong>
              <br />
              <span style={{ color: CHENU_COLORS.ancientStone }}>
                {hoveredLinkData.linkType} • {hoveredLinkData.bidirectional ? '⟷' : '→'}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default XRNavigationMap;
