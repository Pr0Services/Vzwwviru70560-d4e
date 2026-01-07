/**
 * ============================================================
 * CHE·NU — XR CONTEXT VIEWER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Visualizes a ContextSnapshot as an XR scene.
 * Shows engines, tools, processes, and memories spatially.
 */

import React, { useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

interface ContextEngine {
  id: string;
  name: string;
  type: string;
  status?: 'active' | 'idle' | 'loading';
  priority?: number;
}

interface ContextSnapshot {
  id: string;
  sphere: string;
  domain?: string;
  engines: ContextEngine[];
  tools?: Array<{ id: string; name: string; type: string }>;
  processes?: Array<{ id: string; name: string; status: string }>;
  memories?: Array<{ id: string; label: string; type: string }>;
  timestamp?: string;
}

interface XRContextViewerProps {
  context: ContextSnapshot;
  onEngineClick?: (engineId: string) => void;
  onToolClick?: (toolId: string) => void;
  showTools?: boolean;
  showProcesses?: boolean;
  showMemories?: boolean;
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
  community: CHENU_COLORS.cenoteTurquoise,
  social: '#3498DB',
  entertainment: '#E74C3C',
  ailab: '#00D9FF',
  scholar: '#9B59B6',
  creative: '#F39C12',
};

const STATUS_COLORS: Record<string, string> = {
  active: '#27AE60',
  idle: CHENU_COLORS.ancientStone,
  loading: '#F39C12',
};

const ENGINE_TYPE_ICONS: Record<string, string> = {
  dashboard: '📊',
  analytics: '📈',
  control: '🎛️',
  data: '💾',
  visualization: '👁️',
  input: '📝',
  output: '📤',
  processing: '⚙️',
  storage: '🗄️',
  communication: '📡',
  default: '📦',
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
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  contextInfo: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 500,
  },
  canvas: {
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    minHeight: '400px',
    overflow: 'hidden',
  },
  canvasGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      radial-gradient(circle at center, ${CHENU_COLORS.shadowMoss}40 1px, transparent 1px)
    `,
    backgroundSize: '30px 30px',
    pointerEvents: 'none',
  },
  centerNode: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid',
    zIndex: 10,
  },
  centerIcon: {
    fontSize: '24px',
  },
  centerLabel: {
    fontSize: '10px',
    fontWeight: 600,
    marginTop: '4px',
  },
  engineNode: {
    position: 'absolute',
    width: '70px',
    height: '70px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '2px solid',
    transform: 'translate(-50%, -50%)',
  },
  engineIcon: {
    fontSize: '20px',
    marginBottom: '4px',
  },
  engineName: {
    fontSize: '9px',
    fontWeight: 500,
    textAlign: 'center',
    maxWidth: '60px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusDot: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: `2px solid ${CHENU_COLORS.uiSlate}`,
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sidebar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginTop: '16px',
  },
  sidebarSection: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    padding: '14px',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '150px',
    overflowY: 'auto',
  },
  item: {
    padding: '8px 10px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  itemIcon: {
    fontSize: '14px',
  },
  itemName: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemType: {
    fontSize: '9px',
    color: CHENU_COLORS.ancientStone,
    padding: '2px 6px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '4px',
  },
  legend: {
    display: 'flex',
    gap: '16px',
    marginTop: '12px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRContextViewer: React.FC<XRContextViewerProps> = ({
  context,
  onEngineClick,
  onToolClick,
  showTools = true,
  showProcesses = true,
  showMemories = true,
}) => {
  const sphereColor = SPHERE_COLORS[context.sphere] || CHENU_COLORS.ancientStone;

  // Calculate engine positions in a circle
  const enginePositions = useMemo(() => {
    const engines = context.engines;
    const centerX = 50; // %
    const centerY = 50; // %
    const radius = 35; // %
    
    return engines.map((engine, i) => {
      const angle = (i * 2 * Math.PI) / engines.length - Math.PI / 2;
      return {
        engine,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });
  }, [context.engines]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = { active: 0, idle: 0, loading: 0 };
    for (const engine of context.engines) {
      const status = engine.status || 'idle';
      counts[status as keyof typeof counts]++;
    }
    return counts;
  }, [context.engines]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🔮</span>
          Context XR View
        </div>
        <div style={styles.contextInfo}>
          <span
            style={{
              ...styles.badge,
              backgroundColor: `${sphereColor}30`,
              color: sphereColor,
            }}
          >
            {context.sphere}
          </span>
          {context.domain && (
            <span
              style={{
                ...styles.badge,
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            >
              {context.domain}
            </span>
          )}
          <span style={{ ...styles.badge, backgroundColor: 'rgba(0,0,0,0.3)' }}>
            {context.engines.length} engines
          </span>
        </div>
      </div>

      {/* XR Canvas */}
      <div style={styles.canvas}>
        <div style={styles.canvasGrid} />
        
        {/* Center Context Node */}
        <div
          style={{
            ...styles.centerNode,
            backgroundColor: `${sphereColor}30`,
            borderColor: sphereColor,
          }}
        >
          <span style={styles.centerIcon}>🌐</span>
          <span style={styles.centerLabel}>CONTEXT</span>
        </div>

        {/* Engine Nodes */}
        {enginePositions.map(({ engine, x, y }) => {
          const icon = ENGINE_TYPE_ICONS[engine.type] || ENGINE_TYPE_ICONS.default;
          const statusColor = STATUS_COLORS[engine.status || 'idle'];
          
          return (
            <div
              key={engine.id}
              style={{
                ...styles.engineNode,
                left: `${x}%`,
                top: `${y}%`,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderColor: `${sphereColor}60`,
              }}
              onClick={() => onEngineClick?.(engine.id)}
              title={`${engine.name} (${engine.type})`}
            >
              <div
                style={{
                  ...styles.statusDot,
                  backgroundColor: statusColor,
                }}
              />
              <span style={styles.engineIcon}>{icon}</span>
              <span style={styles.engineName}>{engine.name}</span>
            </div>
          );
        })}

        {/* Connection Lines (SVG) */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {enginePositions.map(({ engine, x, y }) => (
            <line
              key={`line-${engine.id}`}
              x1="50%"
              y1="50%"
              x2={`${x}%`}
              y2={`${y}%`}
              stroke={`${sphereColor}40`}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} style={styles.legendItem}>
            <div style={{ ...styles.legendDot, backgroundColor: color }} />
            <span>
              {status} ({statusCounts[status as keyof typeof statusCounts]})
            </span>
          </div>
        ))}
      </div>

      {/* Sidebar Sections */}
      <div style={styles.sidebar}>
        {/* Tools */}
        {showTools && context.tools && context.tools.length > 0 && (
          <div style={styles.sidebarSection}>
            <div style={styles.sectionTitle}>
              <span>🛠️</span>
              Tools ({context.tools.length})
            </div>
            <div style={styles.itemList}>
              {context.tools.map(tool => (
                <div
                  key={tool.id}
                  style={styles.item}
                  onClick={() => onToolClick?.(tool.id)}
                >
                  <span style={styles.itemIcon}>🔧</span>
                  <span style={styles.itemName}>{tool.name}</span>
                  <span style={styles.itemType}>{tool.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processes */}
        {showProcesses && context.processes && context.processes.length > 0 && (
          <div style={styles.sidebarSection}>
            <div style={styles.sectionTitle}>
              <span>⚡</span>
              Processes ({context.processes.length})
            </div>
            <div style={styles.itemList}>
              {context.processes.map(process => (
                <div key={process.id} style={styles.item}>
                  <span style={styles.itemIcon}>
                    {process.status === 'running' ? '🔄' : '⏸️'}
                  </span>
                  <span style={styles.itemName}>{process.name}</span>
                  <span style={styles.itemType}>{process.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Memories */}
        {showMemories && context.memories && context.memories.length > 0 && (
          <div style={styles.sidebarSection}>
            <div style={styles.sectionTitle}>
              <span>🧠</span>
              Memories ({context.memories.length})
            </div>
            <div style={styles.itemList}>
              {context.memories.map(memory => (
                <div key={memory.id} style={styles.item}>
                  <span style={styles.itemIcon}>💭</span>
                  <span style={styles.itemName}>{memory.label}</span>
                  <span style={styles.itemType}>{memory.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default XRContextViewer;
