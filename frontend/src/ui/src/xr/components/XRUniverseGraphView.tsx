/**
 * ============================================================
 * CHE·NU — XR UNIVERSE GRAPH VIEW
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Visual graph representation of universe topology.
 * Uses buildNavGraph() to render nodes and connections.
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// ============================================================
// TYPES
// ============================================================

interface GraphNode {
  id: string;
  label: string;
  sphere: string;
  type: 'scene' | 'sector' | 'hub';
  connections: number;
}

interface GraphLink {
  id: string;
  source: string;
  target: string;
  type: 'portal' | 'adjacency' | 'hierarchy';
  bidirectional: boolean;
}

interface XRUniverseGraphViewProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeClick?: (nodeId: string) => void;
  onLinkClick?: (linkId: string) => void;
  selectedNodeId?: string | null;
  highlightPath?: string[];
  layout?: 'force' | 'radial' | 'hierarchical';
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
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a0a',
    borderRadius: '12px',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    gap: '8px',
    zIndex: 10,
  },
  controlButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: CHENU_COLORS.softSand,
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  layoutSelector: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    display: 'flex',
    gap: '4px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '4px',
    borderRadius: '8px',
    zIndex: 10,
  },
  layoutButton: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  layoutButtonActive: {
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.uiSlate,
  },
  stats: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    gap: '16px',
    zIndex: 10,
  },
  legend: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '10px',
    color: CHENU_COLORS.softSand,
    zIndex: 10,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  legendLine: {
    width: '16px',
    height: '2px',
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
  emptyState: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: CHENU_COLORS.ancientStone,
  },
};

// ============================================================
// LAYOUT ALGORITHMS
// ============================================================

interface NodePosition {
  x: number;
  y: number;
}

function calculateForceLayout(
  nodes: GraphNode[],
  links: GraphLink[],
  width: number,
  height: number
): Record<string, NodePosition> {
  // Simple force-directed layout simulation
  const positions: Record<string, NodePosition> = {};
  
  // Initialize random positions
  nodes.forEach((node, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI;
    const radius = Math.min(width, height) * 0.35;
    positions[node.id] = {
      x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
      y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
    };
  });

  // Simple iterations for layout
  for (let iter = 0; iter < 50; iter++) {
    // Repulsion between nodes
    nodes.forEach((nodeA, i) => {
      nodes.forEach((nodeB, j) => {
        if (i >= j) return;
        const posA = positions[nodeA.id];
        const posB = positions[nodeB.id];
        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = 2000 / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        posA.x -= fx;
        posA.y -= fy;
        posB.x += fx;
        posB.y += fy;
      });
    });

    // Attraction along links
    links.forEach(link => {
      const posA = positions[link.source];
      const posB = positions[link.target];
      if (!posA || !posB) return;
      const dx = posB.x - posA.x;
      const dy = posB.y - posA.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = (dist - 100) * 0.1;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      posA.x += fx;
      posA.y += fy;
      posB.x -= fx;
      posB.y -= fy;
    });

    // Center gravity
    nodes.forEach(node => {
      const pos = positions[node.id];
      pos.x += (width / 2 - pos.x) * 0.01;
      pos.y += (height / 2 - pos.y) * 0.01;
    });
  }

  return positions;
}

function calculateRadialLayout(
  nodes: GraphNode[],
  _links: GraphLink[],
  width: number,
  height: number
): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};
  const centerX = width / 2;
  const centerY = height / 2;

  // Find hub node (most connections)
  const hubNode = nodes.reduce((max, node) =>
    node.connections > (max?.connections ?? 0) ? node : max
  , nodes[0]);

  // Place hub at center
  if (hubNode) {
    positions[hubNode.id] = { x: centerX, y: centerY };
  }

  // Place others in circle
  const otherNodes = nodes.filter(n => n.id !== hubNode?.id);
  const radius = Math.min(width, height) * 0.35;

  otherNodes.forEach((node, i) => {
    const angle = (i / otherNodes.length) * 2 * Math.PI - Math.PI / 2;
    positions[node.id] = {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });

  return positions;
}

function calculateHierarchicalLayout(
  nodes: GraphNode[],
  _links: GraphLink[],
  width: number,
  height: number
): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};

  // Sort by connections (hubs first)
  const sorted = [...nodes].sort((a, b) => b.connections - a.connections);

  // Arrange in rows
  const nodesPerRow = Math.ceil(Math.sqrt(nodes.length));
  const rowHeight = height / (Math.ceil(nodes.length / nodesPerRow) + 1);
  const colWidth = width / (nodesPerRow + 1);

  sorted.forEach((node, i) => {
    const row = Math.floor(i / nodesPerRow);
    const col = i % nodesPerRow;
    positions[node.id] = {
      x: colWidth * (col + 1),
      y: rowHeight * (row + 1),
    };
  });

  return positions;
}

// ============================================================
// COMPONENT
// ============================================================

export const XRUniverseGraphView: React.FC<XRUniverseGraphViewProps> = ({
  nodes,
  links,
  onNodeClick,
  onLinkClick,
  selectedNodeId,
  highlightPath = [],
  layout: initialLayout = 'radial',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [layout, setLayout] = useState(initialLayout);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Calculate node positions based on layout
  const positions = useMemo(() => {
    switch (layout) {
      case 'force':
        return calculateForceLayout(nodes, links, dimensions.width, dimensions.height);
      case 'hierarchical':
        return calculateHierarchicalLayout(nodes, links, dimensions.width, dimensions.height);
      case 'radial':
      default:
        return calculateRadialLayout(nodes, links, dimensions.width, dimensions.height);
    }
  }, [nodes, links, layout, dimensions]);

  // Get node color
  const getNodeColor = useCallback((sphere: string) => {
    return SPHERE_COLORS[sphere] ?? CHENU_COLORS.ancientStone;
  }, []);

  // Check if node is in highlight path
  const isInPath = useCallback((nodeId: string) => {
    return highlightPath.includes(nodeId);
  }, [highlightPath]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({ x: e.clientX - rect.left + 10, y: e.clientY - rect.top - 10 });
    }
  }, []);

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(z * 1.2, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Hovered node data
  const hoveredNodeData = hoveredNode ? nodes.find(n => n.id === hoveredNode) : null;

  if (nodes.length === 0) {
    return (
      <div style={styles.container} ref={containerRef}>
        <div style={styles.emptyState}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌌</div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>No Graph Data</div>
          <div style={{ fontSize: '12px' }}>Add scenes to visualize the universe topology</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container} ref={containerRef} onMouseMove={handleMouseMove}>
      {/* Layout Selector */}
      <div style={styles.layoutSelector}>
        {(['radial', 'force', 'hierarchical'] as const).map(l => (
          <button
            key={l}
            style={{
              ...styles.layoutButton,
              ...(layout === l ? styles.layoutButtonActive : {}),
            }}
            onClick={() => setLayout(l)}
          >
            {l === 'radial' && '⭕ Radial'}
            {l === 'force' && '🔀 Force'}
            {l === 'hierarchical' && '📊 Grid'}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button style={styles.controlButton} onClick={handleZoomIn}>+</button>
        <button style={styles.controlButton} onClick={handleZoomOut}>−</button>
        <button style={styles.controlButton} onClick={handleReset}>⌂</button>
      </div>

      {/* SVG Graph */}
      <svg style={styles.svg}>
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Grid Pattern */}
          <defs>
            <pattern id="graphGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(62, 180, 162, 0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x="-1000" y="-1000" width={dimensions.width + 2000} height={dimensions.height + 2000} fill="url(#graphGrid)" />

          {/* Links */}
          {links.map(link => {
            const sourcePos = positions[link.source];
            const targetPos = positions[link.target];
            if (!sourcePos || !targetPos) return null;

            const isHighlighted = isInPath(link.source) && isInPath(link.target);
            const color = LINK_COLORS[link.type] ?? CHENU_COLORS.ancientStone;

            return (
              <g key={link.id}>
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={isHighlighted ? CHENU_COLORS.sacredGold : color}
                  strokeWidth={isHighlighted ? 3 : 2}
                  strokeOpacity={isHighlighted ? 1 : 0.5}
                  strokeDasharray={link.bidirectional ? 'none' : '6,3'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onLinkClick?.(link.id)}
                />
                {/* Arrow for unidirectional */}
                {!link.bidirectional && (
                  <polygon
                    points="0,-4 8,0 0,4"
                    fill={color}
                    transform={`translate(${(sourcePos.x + targetPos.x) / 2}, ${(sourcePos.y + targetPos.y) / 2}) rotate(${Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x) * 180 / Math.PI})`}
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const pos = positions[node.id];
            if (!pos) return null;

            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNode === node.id;
            const isHighlighted = isInPath(node.id);
            const color = getNodeColor(node.sphere);
            const radius = node.type === 'hub' ? 32 : 26;

            return (
              <g
                key={node.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onNodeClick?.(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Glow */}
                {(isSelected || isHighlighted || isHovered) && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius + 10}
                    fill={isHighlighted ? CHENU_COLORS.sacredGold : color}
                    fillOpacity={0.3}
                  />
                )}

                {/* Main circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={`${color}30`}
                  stroke={isSelected ? CHENU_COLORS.sacredGold : color}
                  strokeWidth={isSelected ? 3 : 2}
                />

                {/* Icon */}
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fontSize="18"
                  style={{ pointerEvents: 'none' }}
                >
                  {SPHERE_ICONS[node.sphere] ?? '📍'}
                </text>

                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + radius + 16}
                  textAnchor="middle"
                  fill={CHENU_COLORS.softSand}
                  fontSize="11"
                  fontWeight={isSelected ? 600 : 400}
                  style={{ pointerEvents: 'none' }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Stats */}
      <div style={styles.stats}>
        <span>🔵 {nodes.length} nodes</span>
        <span>🔗 {links.length} links</span>
        <span>🔍 {Math.round(zoom * 100)}%</span>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendLine, backgroundColor: LINK_COLORS.portal }} />
          <span>Portal</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendLine, backgroundColor: LINK_COLORS.adjacency }} />
          <span>Adjacency</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendLine, backgroundColor: LINK_COLORS.hierarchy }} />
          <span>Hierarchy</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredNodeData && (
        <div style={{ ...styles.tooltip, left: tooltipPos.x, top: tooltipPos.y }}>
          <strong>{hoveredNodeData.label}</strong>
          <br />
          <span style={{ color: CHENU_COLORS.ancientStone }}>
            {hoveredNodeData.sphere} • {hoveredNodeData.connections} connections
          </span>
        </div>
      )}
    </div>
  );
};

export default XRUniverseGraphView;
