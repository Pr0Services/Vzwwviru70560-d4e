/**
 * ============================================================
 * CHE·NU — WORKSURFACE DIAGRAM VIEW
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Visual diagram/graph view for WorkSurface
 */

import React, { useState, useMemo } from 'react';
import { CHENU_COLORS } from './worksurfaceStyles';

// ============================================================
// TYPES
// ============================================================

export interface DiagramNode {
  id: string;
  label: string;
  type?: string;
  x?: number;
  y?: number;
}

export interface DiagramLink {
  source: string;
  target: string;
  label?: string;
}

export interface DiagramStructure {
  nodes: DiagramNode[];
  links: DiagramLink[];
  layout?: 'horizontal' | 'vertical' | 'radial' | 'force';
}

export interface WorkSurfaceDiagramViewProps {
  diagram?: DiagramStructure | null;
  onNodeClick?: (node: DiagramNode) => void;
  onLinkClick?: (link: DiagramLink) => void;
  showLabels?: boolean;
  interactive?: boolean;
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    overflow: 'hidden',
  },
  header: {
    padding: '12px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stats: {
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    display: 'flex',
    gap: '12px',
  },
  controls: {
    padding: '10px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: 'rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  controlButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.textSecondary,
    transition: 'all 0.2s ease',
  },
  controlButtonActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  canvasContainer: {
    position: 'relative',
    minHeight: '400px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '400px',
  },
  node: {
    position: 'absolute',
    padding: '12px 18px',
    backgroundColor: CHENU_COLORS.cardBg,
    border: `2px solid ${CHENU_COLORS.sacredGold}`,
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 500,
    color: CHENU_COLORS.textPrimary,
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    zIndex: 10,
    maxWidth: '150px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  nodeHover: {
    transform: 'translate(-50%, -50%) scale(1.1)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
    zIndex: 20,
  },
  nodeSelected: {
    borderColor: CHENU_COLORS.cenoteTurquoise,
    boxShadow: `0 0 0 3px ${CHENU_COLORS.cenoteTurquoise}40`,
  },
  linkLabel: {
    position: 'absolute',
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
    backgroundColor: CHENU_COLORS.cardBg,
    padding: '2px 6px',
    borderRadius: '4px',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: CHENU_COLORS.textMuted,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '14px',
    marginBottom: '8px',
  },
  emptyHint: {
    fontSize: '12px',
    opacity: 0.7,
  },
  legend: {
    padding: '10px 16px',
    borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: 'rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
  },
};

// ============================================================
// NODE TYPE COLORS
// ============================================================

const NODE_TYPE_COLORS: Record<string, string> = {
  default: CHENU_COLORS.sacredGold,
  input: CHENU_COLORS.jungleEmerald,
  output: CHENU_COLORS.earthEmber,
  process: CHENU_COLORS.cenoteTurquoise,
  decision: '#FF9800',
  data: '#9C27B0',
};

// ============================================================
// LAYOUT HELPERS
// ============================================================

function applyAutoLayout(nodes: DiagramNode[], layout: string): DiagramNode[] {
  const padding = 80;
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  return nodes.map((node, index) => {
    if (node.x !== undefined && node.y !== undefined) {
      return node;
    }
    
    switch (layout) {
      case 'horizontal':
        return {
          ...node,
          x: padding + (index * (canvasWidth - padding * 2)) / Math.max(nodes.length - 1, 1),
          y: canvasHeight / 2,
        };
      
      case 'vertical':
        return {
          ...node,
          x: canvasWidth / 2,
          y: padding + (index * (canvasHeight - padding * 2)) / Math.max(nodes.length - 1, 1),
        };
      
      case 'radial':
        const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
        const radius = Math.min(canvasWidth, canvasHeight) / 3;
        return {
          ...node,
          x: canvasWidth / 2 + Math.cos(angle) * radius,
          y: canvasHeight / 2 + Math.sin(angle) * radius,
        };
      
      default:
        // Grid layout
        const cols = Math.ceil(Math.sqrt(nodes.length));
        const row = Math.floor(index / cols);
        const col = index % cols;
        return {
          ...node,
          x: padding + (col * (canvasWidth - padding * 2)) / Math.max(cols - 1, 1),
          y: padding + (row * (canvasHeight - padding * 2)) / Math.max(Math.ceil(nodes.length / cols) - 1, 1),
        };
    }
  });
}

// ============================================================
// COMPONENT
// ============================================================

export const WorkSurfaceDiagramView: React.FC<WorkSurfaceDiagramViewProps> = ({
  diagram,
  onNodeClick,
  onLinkClick,
  showLabels = true,
  interactive = true,
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [layout, setLayout] = useState<string>(diagram?.layout || 'horizontal');

  // Apply layout to nodes
  const layoutedNodes = useMemo(() => {
    if (!diagram) return [];
    return applyAutoLayout(diagram.nodes, layout);
  }, [diagram, layout]);

  // Get node color
  const getNodeColor = (node: DiagramNode): string => {
    return NODE_TYPE_COLORS[node.type || 'default'] || NODE_TYPE_COLORS.default;
  };

  // Handle node click
  const handleNodeClick = (node: DiagramNode) => {
    if (!interactive) return;
    setSelectedNode(node.id === selectedNode ? null : node.id);
    if (onNodeClick) {
      onNodeClick(node);
    }
  };

  // Calculate link midpoint for label
  const getLinkMidpoint = (link: DiagramLink) => {
    const sourceNode = layoutedNodes.find(n => n.id === link.source);
    const targetNode = layoutedNodes.find(n => n.id === link.target);
    if (!sourceNode || !targetNode) return null;
    
    return {
      x: ((sourceNode.x || 0) + (targetNode.x || 0)) / 2,
      y: ((sourceNode.y || 0) + (targetNode.y || 0)) / 2,
    };
  };

  // Empty state
  if (!diagram || diagram.nodes.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span>🔗</span>
            <span>Diagram View</span>
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔗</div>
          <div style={styles.emptyText}>No diagram data available</div>
          <div style={styles.emptyHint}>Add structured content to generate diagram</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🔗</span>
          <span>Diagram View</span>
        </div>
        <div style={styles.stats}>
          <span>{diagram.nodes.length} nodes</span>
          <span>•</span>
          <span>{diagram.links.length} links</span>
        </div>
      </div>

      {/* Layout Controls */}
      <div style={styles.controls}>
        <span style={{ fontSize: '11px', color: CHENU_COLORS.textMuted }}>Layout:</span>
        {['horizontal', 'vertical', 'radial', 'grid'].map(l => (
          <button
            key={l}
            onClick={() => setLayout(l)}
            style={{
              ...styles.controlButton,
              ...(layout === l ? styles.controlButtonActive : {}),
            }}
          >
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div style={styles.canvasContainer}>
        {/* SVG for links */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
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
                fill={CHENU_COLORS.cenoteTurquoise}
              />
            </marker>
          </defs>
          
          {diagram.links.map((link, i) => {
            const sourceNode = layoutedNodes.find(n => n.id === link.source);
            const targetNode = layoutedNodes.find(n => n.id === link.target);
            if (!sourceNode || !targetNode) return null;
            
            return (
              <line
                key={i}
                x1={sourceNode.x || 0}
                y1={sourceNode.y || 0}
                x2={targetNode.x || 0}
                y2={targetNode.y || 0}
                stroke={CHENU_COLORS.cenoteTurquoise}
                strokeWidth="2"
                opacity={0.6}
                markerEnd="url(#arrowhead)"
                style={{ cursor: interactive ? 'pointer' : 'default' }}
                onClick={() => onLinkClick?.(link)}
              />
            );
          })}
        </svg>

        {/* Link Labels */}
        {showLabels && diagram.links.map((link, i) => {
          if (!link.label) return null;
          const midpoint = getLinkMidpoint(link);
          if (!midpoint) return null;
          
          return (
            <div
              key={`label-${i}`}
              style={{
                ...styles.linkLabel,
                left: midpoint.x,
                top: midpoint.y,
              }}
            >
              {link.label}
            </div>
          );
        })}

        {/* Nodes */}
        {layoutedNodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode === node.id;
          
          return (
            <div
              key={node.id}
              style={{
                ...styles.node,
                left: node.x || 100,
                top: node.y || 100,
                borderColor: getNodeColor(node),
                ...(isHovered ? styles.nodeHover : {}),
                ...(isSelected ? styles.nodeSelected : {}),
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node)}
              title={node.label}
            >
              {node.label}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <span>🔗 {diagram.links.length} connections</span>
        <span>•</span>
        <span>Layout: {layout}</span>
        <span>•</span>
        <span style={{ color: CHENU_COLORS.jungleEmerald }}>SAFE · REPRESENTATIONAL</span>
      </div>
    </div>
  );
};

export default WorkSurfaceDiagramView;
