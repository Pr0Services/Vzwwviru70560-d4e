/**
 * ============================================================
 * CHE·NU — ARCHITECTURE DIAGRAM VIEW
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Diagram visualization for architectural concepts
 * Symbolic representation only
 */

import React, { useState, useMemo } from 'react';
import {
  CHENU_COLORS,
  ARCHITECTURE_COLORS,
  baseStyles,
  architectureStyles,
  mergeStyles,
} from './architectureStyles';

// ============================================================
// TYPES
// ============================================================

export type DiagramNodeType = 'space' | 'zone' | 'function' | 'circulation' | 'service' | 'concept' | 'custom';

export interface DiagramNode {
  id: string;
  label: string;
  type: DiagramNodeType;
  x?: number;
  y?: number;
  description?: string;
}

export interface DiagramLink {
  from: string;
  to: string;
  label?: string;
  type?: 'flow' | 'adjacent' | 'visual' | 'functional';
}

export interface ArchitectureDiagramViewProps {
  title?: string;
  nodes?: DiagramNode[];
  links?: DiagramLink[];
  layout?: 'horizontal' | 'vertical' | 'radial' | 'force';
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
    ...baseStyles.card,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  controls: {
    display: 'flex',
    gap: '8px',
  },
  controlButton: {
    ...baseStyles.button,
    ...baseStyles.buttonSecondary,
    padding: '6px 12px',
    fontSize: '11px',
  },
  controlButtonActive: {
    backgroundColor: ARCHITECTURE_COLORS.modeDiagram,
    color: CHENU_COLORS.uiSlate,
  },
  canvasContainer: {
    ...architectureStyles.diagramContainer,
    minHeight: '400px',
  },
  node: {
    ...architectureStyles.diagramNode,
    zIndex: 10,
  },
  nodeHover: {
    transform: 'translate(-50%, -50%) scale(1.1)',
    boxShadow: `0 6px 20px rgba(0,0,0,0.4)`,
    zIndex: 20,
  },
  nodeSelected: {
    borderColor: CHENU_COLORS.cenoteTurquoise,
    boxShadow: `0 0 0 3px ${CHENU_COLORS.cenoteTurquoise}40`,
  },
  nodeContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  nodeIcon: {
    fontSize: '14px',
  },
  nodeLabel: {
    fontSize: '12px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    maxWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  linkLabel: {
    position: 'absolute',
    fontSize: '9px',
    color: CHENU_COLORS.textMuted,
    backgroundColor: CHENU_COLORS.cardBg,
    padding: '2px 6px',
    borderRadius: '4px',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  statsBar: {
    display: 'flex',
    gap: '20px',
    marginTop: '16px',
    padding: '10px 16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statValue: {
    fontWeight: 600,
    color: CHENU_COLORS.textSecondary,
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '12px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    color: CHENU_COLORS.textMuted,
  },
  footer: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

// ============================================================
// NODE TYPE CONFIG
// ============================================================

const NODE_TYPE_CONFIG: Record<DiagramNodeType, { icon: string; color: string }> = {
  space: { icon: '🏛️', color: ARCHITECTURE_COLORS.room },
  zone: { icon: '◻️', color: ARCHITECTURE_COLORS.zone },
  function: { icon: '⚙️', color: CHENU_COLORS.sacredGold },
  circulation: { icon: '🚶', color: '#FF9800' },
  service: { icon: '🔧', color: '#607D8B' },
  concept: { icon: '💡', color: '#9C27B0' },
  custom: { icon: '⭐', color: CHENU_COLORS.cenoteTurquoise },
};

// ============================================================
// LAYOUT FUNCTIONS
// ============================================================

function applyLayout(
  nodes: DiagramNode[],
  layout: string,
  canvasWidth: number,
  canvasHeight: number
): DiagramNode[] {
  const padding = 80;
  const availableWidth = canvasWidth - padding * 2;
  const availableHeight = canvasHeight - padding * 2;

  return nodes.map((node, index) => {
    if (node.x !== undefined && node.y !== undefined) {
      return node;
    }

    switch (layout) {
      case 'horizontal':
        return {
          ...node,
          x: padding + (index * availableWidth) / Math.max(nodes.length - 1, 1),
          y: canvasHeight / 2,
        };

      case 'vertical':
        return {
          ...node,
          x: canvasWidth / 2,
          y: padding + (index * availableHeight) / Math.max(nodes.length - 1, 1),
        };

      case 'radial': {
        const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
        const radius = Math.min(availableWidth, availableHeight) / 2.5;
        return {
          ...node,
          x: canvasWidth / 2 + Math.cos(angle) * radius,
          y: canvasHeight / 2 + Math.sin(angle) * radius,
        };
      }

      default: {
        // Grid layout
        const cols = Math.ceil(Math.sqrt(nodes.length));
        const row = Math.floor(index / cols);
        const col = index % cols;
        const rows = Math.ceil(nodes.length / cols);
        return {
          ...node,
          x: padding + (col * availableWidth) / Math.max(cols - 1, 1),
          y: padding + (row * availableHeight) / Math.max(rows - 1, 1),
        };
      }
    }
  });
}

// ============================================================
// COMPONENT
// ============================================================

export const ArchitectureDiagramView: React.FC<ArchitectureDiagramViewProps> = ({
  title = 'Architecture Diagram',
  nodes = [],
  links = [],
  layout = 'radial',
  onNodeClick,
  onLinkClick,
  showLabels = true,
  interactive = true,
}) => {
  const [activeLayout, setActiveLayout] = useState(layout);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Canvas dimensions
  const canvasWidth = 600;
  const canvasHeight = 400;

  // Apply layout to nodes
  const layoutedNodes = useMemo(() => {
    return applyLayout(nodes, activeLayout, canvasWidth, canvasHeight);
  }, [nodes, activeLayout]);

  // Get node types present
  const nodeTypes = useMemo(() => {
    return [...new Set(nodes.map(n => n.type))];
  }, [nodes]);

  // Handle node click
  const handleNodeClick = (node: DiagramNode) => {
    if (!interactive) return;
    setSelectedNode(node.id === selectedNode ? null : node.id);
    onNodeClick?.(node);
  };

  // Get link midpoint
  const getLinkMidpoint = (link: DiagramLink) => {
    const fromNode = layoutedNodes.find(n => n.id === link.from);
    const toNode = layoutedNodes.find(n => n.id === link.to);
    if (!fromNode || !toNode) return null;
    return {
      x: ((fromNode.x || 0) + (toNode.x || 0)) / 2,
      y: ((fromNode.y || 0) + (toNode.y || 0)) / 2,
    };
  };

  // Empty state
  if (nodes.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span>📊</span>
            <span>{title}</span>
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <div>No diagram data available</div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
            Add nodes to visualize the diagram
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📊</span>
          <span>{title}</span>
        </div>
        <div style={styles.controls}>
          {(['horizontal', 'vertical', 'radial', 'force'] as const).map(l => (
            <button
              key={l}
              onClick={() => setActiveLayout(l)}
              style={mergeStyles(
                styles.controlButton,
                activeLayout === l ? styles.controlButtonActive : undefined
              )}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div style={styles.canvasContainer}>
        {/* SVG for links */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <defs>
            <marker
              id="arrowhead-arch"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={ARCHITECTURE_COLORS.modeDiagram} />
            </marker>
          </defs>

          {links.map((link, i) => {
            const fromNode = layoutedNodes.find(n => n.id === link.from);
            const toNode = layoutedNodes.find(n => n.id === link.to);
            if (!fromNode || !toNode) return null;

            return (
              <line
                key={i}
                x1={fromNode.x || 0}
                y1={fromNode.y || 0}
                x2={toNode.x || 0}
                y2={toNode.y || 0}
                stroke={ARCHITECTURE_COLORS.modeDiagram}
                strokeWidth="2"
                opacity={0.5}
                markerEnd="url(#arrowhead-arch)"
              />
            );
          })}
        </svg>

        {/* Link labels */}
        {showLabels &&
          links.map((link, i) => {
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
        {layoutedNodes.map(node => {
          const typeConfig = NODE_TYPE_CONFIG[node.type];
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode === node.id;

          return (
            <div
              key={node.id}
              style={mergeStyles(
                styles.node,
                { left: node.x || 100, top: node.y || 100, borderColor: typeConfig.color },
                isHovered ? styles.nodeHover : undefined,
                isSelected ? styles.nodeSelected : undefined
              )}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node)}
              title={node.description}
            >
              <div style={styles.nodeContent}>
                <span style={styles.nodeIcon}>{typeConfig.icon}</span>
                <span style={styles.nodeLabel}>{node.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span>Nodes:</span>
          <span style={styles.statValue}>{nodes.length}</span>
        </div>
        <div style={styles.statItem}>
          <span>Links:</span>
          <span style={styles.statValue}>{links.length}</span>
        </div>
        <div style={styles.statItem}>
          <span>Layout:</span>
          <span style={styles.statValue}>{activeLayout}</span>
        </div>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {nodeTypes.map(type => (
          <div key={type} style={styles.legendItem}>
            <div style={{ ...styles.legendDot, backgroundColor: NODE_TYPE_CONFIG[type].color }} />
            <span>{NODE_TYPE_CONFIG[type].icon} {type}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={{ fontSize: '11px', color: CHENU_COLORS.textMuted }}>
          Symbolic diagram • Click nodes for details
        </span>
        <div style={architectureStyles.safetyBadge}>
          🛡️ SAFE · REPRESENTATIONAL
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagramView;
