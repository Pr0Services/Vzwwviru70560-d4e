/**
 * ============================================================
 * CHE·NU — XR PATHFINDING VIEWER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Visualizes symbolic paths between scenes.
 * Uses BFS algorithm - NOT real AI pathfinding.
 */

import React, { useState, useMemo, useCallback } from 'react';

// ============================================================
// TYPES
// ============================================================

interface PathNode {
  id: string;
  name: string;
  sphere: string;
}

interface PathLink {
  id: string;
  from: string;
  to: string;
  label?: string;
  weight: number;
}

interface PathResult {
  nodes: string[];
  links: string[];
  totalWeight: number;
  isComplete: boolean;
}

interface XRPathfindingViewerProps {
  nodes: PathNode[];
  links: PathLink[];
  onPathCalculate?: (from: string, to: string) => PathResult | null;
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
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.uiSlate,
    borderRadius: '16px',
    padding: '20px',
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  selectors: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '16px',
    marginBottom: '20px',
    alignItems: 'end',
  },
  selectorGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  select: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
  },
  arrow: {
    fontSize: '24px',
    color: CHENU_COLORS.cenoteTurquoise,
    paddingBottom: '12px',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.uiSlate,
    transition: 'all 0.2s ease',
    marginBottom: '20px',
  },
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  result: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    padding: '16px',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  resultTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
  },
  resultStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  pathVisualization: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    padding: '16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  pathNode: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 14px',
    borderRadius: '8px',
    minWidth: '80px',
  },
  pathNodeIcon: {
    fontSize: '20px',
  },
  pathNodeName: {
    fontSize: '11px',
    fontWeight: 500,
    textAlign: 'center',
  },
  pathArrow: {
    fontSize: '18px',
    color: CHENU_COLORS.cenoteTurquoise,
  },
  pathLink: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    padding: '4px 8px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '4px',
  },
  noPath: {
    textAlign: 'center',
    padding: '30px',
    color: CHENU_COLORS.ancientStone,
  },
  noPathIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  stepList: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    fontSize: '13px',
  },
  stepNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
  },
  stepContent: {
    flex: 1,
  },
  stepAction: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: CHENU_COLORS.ancientStone,
  },
};

// ============================================================
// BFS PATHFINDING (SYMBOLIC)
// ============================================================

function findShortestPath(
  nodes: PathNode[],
  links: PathLink[],
  fromId: string,
  toId: string
): PathResult | null {
  if (fromId === toId) {
    return { nodes: [fromId], links: [], totalWeight: 0, isComplete: true };
  }

  // Build adjacency map
  const adjacency: Map<string, Array<{ nodeId: string; linkId: string; weight: number }>> = new Map();
  
  nodes.forEach(n => adjacency.set(n.id, []));
  
  links.forEach(link => {
    adjacency.get(link.from)?.push({ nodeId: link.to, linkId: link.id, weight: link.weight });
    adjacency.get(link.to)?.push({ nodeId: link.from, linkId: link.id, weight: link.weight });
  });

  // BFS
  const visited = new Set<string>();
  const queue: Array<{ nodeId: string; path: string[]; linkPath: string[]; weight: number }> = [
    { nodeId: fromId, path: [fromId], linkPath: [], weight: 0 }
  ];

  visited.add(fromId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adjacency.get(current.nodeId) ?? [];

    for (const neighbor of neighbors) {
      if (neighbor.nodeId === toId) {
        return {
          nodes: [...current.path, toId],
          links: [...current.linkPath, neighbor.linkId],
          totalWeight: current.weight + neighbor.weight,
          isComplete: true,
        };
      }

      if (!visited.has(neighbor.nodeId)) {
        visited.add(neighbor.nodeId);
        queue.push({
          nodeId: neighbor.nodeId,
          path: [...current.path, neighbor.nodeId],
          linkPath: [...current.linkPath, neighbor.linkId],
          weight: current.weight + neighbor.weight,
        });
      }
    }
  }

  return null; // No path found
}

// ============================================================
// COMPONENT
// ============================================================

export const XRPathfindingViewer: React.FC<XRPathfindingViewerProps> = ({
  nodes,
  links,
  onPathCalculate,
}) => {
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  const [pathResult, setPathResult] = useState<PathResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Get node by ID
  const getNode = useCallback((id: string) => nodes.find(n => n.id === id), [nodes]);
  const getLink = useCallback((id: string) => links.find(l => l.id === id), [links]);

  // Calculate path
  const handleCalculate = useCallback(() => {
    if (!fromNode || !toNode) return;

    const result = onPathCalculate
      ? onPathCalculate(fromNode, toNode)
      : findShortestPath(nodes, links, fromNode, toNode);

    setPathResult(result);
    setHasSearched(true);
  }, [fromNode, toNode, nodes, links, onPathCalculate]);

  // Path nodes with data
  const pathNodesData = useMemo(() => {
    if (!pathResult) return [];
    return pathResult.nodes.map(id => getNode(id)).filter(Boolean) as PathNode[];
  }, [pathResult, getNode]);

  // Can calculate
  const canCalculate = fromNode && toNode && fromNode !== toNode;

  if (nodes.length < 2) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span>🧭</span>
          <span style={styles.title}>Pathfinding</span>
        </div>
        <div style={styles.emptyState}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗺️</div>
          <div>Need at least 2 scenes to calculate paths</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span>🧭</span>
        <span style={styles.title}>Symbolic Pathfinding</span>
      </div>

      {/* Selectors */}
      <div style={styles.selectors}>
        <div style={styles.selectorGroup}>
          <label style={styles.label}>From Scene</label>
          <select
            style={styles.select}
            value={fromNode}
            onChange={e => {
              setFromNode(e.target.value);
              setPathResult(null);
              setHasSearched(false);
            }}
          >
            <option value="">Select start...</option>
            {nodes.map(node => (
              <option key={node.id} value={node.id} disabled={node.id === toNode}>
                {SPHERE_ICONS[node.sphere] ?? '📍'} {node.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.arrow}>→</div>

        <div style={styles.selectorGroup}>
          <label style={styles.label}>To Scene</label>
          <select
            style={styles.select}
            value={toNode}
            onChange={e => {
              setToNode(e.target.value);
              setPathResult(null);
              setHasSearched(false);
            }}
          >
            <option value="">Select destination...</option>
            {nodes.map(node => (
              <option key={node.id} value={node.id} disabled={node.id === fromNode}>
                {SPHERE_ICONS[node.sphere] ?? '📍'} {node.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        style={{
          ...styles.button,
          ...(!canCalculate ? styles.disabledButton : {}),
          width: '100%',
        }}
        onClick={handleCalculate}
        disabled={!canCalculate}
      >
        🧭 Calculate Path
      </button>

      {/* Result */}
      {hasSearched && (
        <div style={styles.result}>
          {pathResult ? (
            <>
              <div style={styles.resultHeader}>
                <span style={styles.resultTitle}>✅ Path Found</span>
                <div style={styles.resultStats}>
                  <span>🔢 {pathResult.nodes.length} steps</span>
                  <span>⚖️ Weight: {pathResult.totalWeight}</span>
                </div>
              </div>

              {/* Path Visualization */}
              <div style={styles.pathVisualization}>
                {pathNodesData.map((node, i) => (
                  <React.Fragment key={node.id}>
                    <div
                      style={{
                        ...styles.pathNode,
                        backgroundColor: `${SPHERE_COLORS[node.sphere] ?? CHENU_COLORS.ancientStone}30`,
                        border: `2px solid ${SPHERE_COLORS[node.sphere] ?? CHENU_COLORS.ancientStone}`,
                      }}
                    >
                      <span style={styles.pathNodeIcon}>
                        {SPHERE_ICONS[node.sphere] ?? '📍'}
                      </span>
                      <span style={styles.pathNodeName}>{node.name}</span>
                    </div>
                    {i < pathNodesData.length - 1 && (
                      <>
                        <span style={styles.pathArrow}>→</span>
                        {pathResult.links[i] && (
                          <span style={styles.pathLink}>
                            {getLink(pathResult.links[i])?.label ?? 'portal'}
                          </span>
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step by Step */}
              <div style={styles.stepList}>
                {pathNodesData.map((node, i) => (
                  <div key={node.id} style={styles.step}>
                    <div style={styles.stepNumber}>{i + 1}</div>
                    <div style={styles.stepContent}>
                      <strong>{node.name}</strong>
                      <div style={styles.stepAction}>
                        {i === 0
                          ? '🚀 Start here'
                          : i === pathNodesData.length - 1
                            ? '🎯 Destination reached'
                            : `🚪 Enter via ${getLink(pathResult.links[i - 1])?.label ?? 'portal'}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={styles.noPath}>
              <div style={styles.noPathIcon}>🚫</div>
              <div style={{ fontSize: '14px', marginBottom: '8px' }}>No Path Found</div>
              <div style={{ fontSize: '12px' }}>
                These scenes are not connected. Create portals to link them.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default XRPathfindingViewer;
