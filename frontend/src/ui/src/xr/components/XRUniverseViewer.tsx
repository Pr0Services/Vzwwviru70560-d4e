/**
 * ============================================================
 * CHE·NU — XR UNIVERSE VIEWER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Comprehensive view of an XR Universe.
 * Shows scenes, portals, topology, and navigation graph.
 */

import React, { useState, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

interface XRScene {
  id: string;
  name: string;
  sphere: string;
  domain?: string;
  sectors: Array<{ id: string; name: string; objects: unknown[] }>;
}

interface XRPortal {
  id: string;
  fromScene: string;
  toScene: string;
  label?: string;
}

interface XRUniverse {
  id: string;
  name: string;
  scenes: string[];
  portals?: XRPortal[];
  meta?: Record<string, unknown>;
}

interface XRUniverseViewerProps {
  universe: XRUniverse;
  scenes: XRScene[];
  onSceneSelect?: (sceneId: string) => void;
  onPortalSelect?: (portalId: string) => void;
  selectedSceneId?: string;
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
  xr: '#00CED1',
};

const SPHERE_ICONS: Record<string, string> = {
  personal: '🏠',
  business: '💼',
  community: '🌐',
  social: '👥',
  entertainment: '🎮',
  ailab: '🤖',
  scholar: '📚',
  creative: '🎨',
  xr: '🌀',
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.uiSlate,
    borderRadius: '16px',
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
    overflow: 'hidden',
  },
  header: {
    padding: '20px',
    borderBottom: `1px solid ${CHENU_COLORS.shadowMoss}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  universeIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}30`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  subtitle: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '2px',
  },
  stats: {
    display: 'flex',
    gap: '16px',
  },
  stat: {
    textAlign: 'center',
    padding: '8px 16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  statLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tabs: {
    display: 'flex',
    borderBottom: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  tab: {
    padding: '12px 20px',
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    color: CHENU_COLORS.cenoteTurquoise,
    borderBottomColor: CHENU_COLORS.cenoteTurquoise,
  },
  content: {
    padding: '20px',
  },
  graphContainer: {
    position: 'relative',
    height: '350px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  graphGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      radial-gradient(circle, ${CHENU_COLORS.shadowMoss}40 1px, transparent 1px)
    `,
    backgroundSize: '25px 25px',
  },
  sceneNode: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '2px solid',
    transform: 'translate(-50%, -50%)',
  },
  sceneNodeSelected: {
    boxShadow: `0 0 0 3px ${CHENU_COLORS.sacredGold}`,
  },
  sceneIcon: {
    fontSize: '24px',
    marginBottom: '4px',
  },
  sceneName: {
    fontSize: '10px',
    fontWeight: 500,
    textAlign: 'center',
    maxWidth: '70px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  sceneList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '12px',
  },
  sceneCard: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    padding: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '2px solid transparent',
  },
  sceneCardSelected: {
    borderColor: CHENU_COLORS.sacredGold,
  },
  sceneCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  sceneCardIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  sceneCardName: {
    fontSize: '14px',
    fontWeight: 600,
  },
  sceneCardSphere: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  sceneCardStats: {
    display: 'flex',
    gap: '12px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  portalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  portalItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  portalIcon: {
    fontSize: '20px',
  },
  portalInfo: {
    flex: 1,
  },
  portalLabel: {
    fontSize: '13px',
    fontWeight: 500,
  },
  portalRoute: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '2px',
  },
  portalArrow: {
    color: CHENU_COLORS.cenoteTurquoise,
    fontSize: '16px',
  },
  topologySection: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    padding: '16px',
  },
  topologyTitle: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  topologyStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  topologyStat: {
    textAlign: 'center',
    padding: '12px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  sphereDistribution: {
    marginTop: '16px',
  },
  sphereBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  sphereLabel: {
    width: '100px',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  sphereProgress: {
    flex: 1,
    height: '8px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  sphereProgressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  sphereCount: {
    width: '30px',
    fontSize: '11px',
    textAlign: 'right',
    color: CHENU_COLORS.ancientStone,
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRUniverseViewer: React.FC<XRUniverseViewerProps> = ({
  universe,
  scenes,
  onSceneSelect,
  onPortalSelect,
  selectedSceneId,
}) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'scenes' | 'portals' | 'topology'>('graph');

  // Get scene data
  const sceneMap = useMemo(() => {
    const map = new Map<string, XRScene>();
    for (const scene of scenes) {
      map.set(scene.id, scene);
    }
    return map;
  }, [scenes]);

  // Universe scenes
  const universeScenes = useMemo(() => {
    return universe.scenes
      .map(id => sceneMap.get(id))
      .filter((s): s is XRScene => s !== undefined);
  }, [universe.scenes, sceneMap]);

  // Portals
  const portals = universe.portals || [];

  // Calculate graph positions
  const scenePositions = useMemo(() => {
    const count = universeScenes.length;
    if (count === 0) return [];
    
    const centerX = 50;
    const centerY = 50;
    const radius = Math.min(35, 15 + count * 3);
    
    return universeScenes.map((scene, i) => {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      return {
        scene,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });
  }, [universeScenes]);

  // Sphere distribution
  const sphereDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    for (const scene of universeScenes) {
      dist[scene.sphere] = (dist[scene.sphere] || 0) + 1;
    }
    return Object.entries(dist).sort((a, b) => b[1] - a[1]);
  }, [universeScenes]);

  // Total sectors and objects
  const totals = useMemo(() => {
    let sectors = 0;
    let objects = 0;
    for (const scene of universeScenes) {
      sectors += scene.sectors.length;
      for (const sector of scene.sectors) {
        objects += sector.objects.length;
      }
    }
    return { sectors, objects };
  }, [universeScenes]);

  // Get scene name by ID
  const getSceneName = (id: string) => sceneMap.get(id)?.name || id;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <div style={styles.universeIcon}>🌌</div>
          <div>
            <div style={styles.title}>{universe.name}</div>
            <div style={styles.subtitle}>
              Universe ID: {universe.id}
            </div>
          </div>
        </div>
        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statValue}>{universeScenes.length}</div>
            <div style={styles.statLabel}>Scenes</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>{portals.length}</div>
            <div style={styles.statLabel}>Portals</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>{totals.sectors}</div>
            <div style={styles.statLabel}>Sectors</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {(['graph', 'scenes', 'portals', 'topology'] as const).map(tab => (
          <div
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'graph' && '🗺️ Graph View'}
            {tab === 'scenes' && '📦 Scenes'}
            {tab === 'portals' && '🌀 Portals'}
            {tab === 'topology' && '📊 Topology'}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Graph View */}
        {activeTab === 'graph' && (
          <div style={styles.graphContainer}>
            <div style={styles.graphGrid} />
            
            {/* Portal Lines */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              {portals.map(portal => {
                const from = scenePositions.find(p => p.scene.id === portal.fromScene);
                const to = scenePositions.find(p => p.scene.id === portal.toScene);
                if (!from || !to) return null;
                
                return (
                  <line
                    key={portal.id}
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke={CHENU_COLORS.cenoteTurquoise}
                    strokeWidth="2"
                    strokeDasharray="6,4"
                    opacity="0.6"
                  />
                );
              })}
            </svg>

            {/* Scene Nodes */}
            {scenePositions.map(({ scene, x, y }) => {
              const color = SPHERE_COLORS[scene.sphere] || CHENU_COLORS.ancientStone;
              const icon = SPHERE_ICONS[scene.sphere] || '📍';
              const isSelected = scene.id === selectedSceneId;

              return (
                <div
                  key={scene.id}
                  style={{
                    ...styles.sceneNode,
                    ...(isSelected ? styles.sceneNodeSelected : {}),
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: `${color}30`,
                    borderColor: color,
                  }}
                  onClick={() => onSceneSelect?.(scene.id)}
                >
                  <span style={styles.sceneIcon}>{icon}</span>
                  <span style={styles.sceneName}>{scene.name}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Scenes List */}
        {activeTab === 'scenes' && (
          <div style={styles.sceneList}>
            {universeScenes.map(scene => {
              const color = SPHERE_COLORS[scene.sphere] || CHENU_COLORS.ancientStone;
              const icon = SPHERE_ICONS[scene.sphere] || '📍';
              const isSelected = scene.id === selectedSceneId;
              const objectCount = scene.sectors.reduce((sum, s) => sum + s.objects.length, 0);

              return (
                <div
                  key={scene.id}
                  style={{
                    ...styles.sceneCard,
                    ...(isSelected ? styles.sceneCardSelected : {}),
                  }}
                  onClick={() => onSceneSelect?.(scene.id)}
                >
                  <div style={styles.sceneCardHeader}>
                    <div
                      style={{
                        ...styles.sceneCardIcon,
                        backgroundColor: `${color}30`,
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <div style={styles.sceneCardName}>{scene.name}</div>
                      <div style={styles.sceneCardSphere}>
                        {scene.sphere}
                        {scene.domain && ` / ${scene.domain}`}
                      </div>
                    </div>
                  </div>
                  <div style={styles.sceneCardStats}>
                    <span>📦 {scene.sectors.length} sectors</span>
                    <span>🔲 {objectCount} objects</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Portals List */}
        {activeTab === 'portals' && (
          <div style={styles.portalList}>
            {portals.length > 0 ? (
              portals.map(portal => (
                <div
                  key={portal.id}
                  style={styles.portalItem}
                  onClick={() => onPortalSelect?.(portal.id)}
                >
                  <span style={styles.portalIcon}>🌀</span>
                  <div style={styles.portalInfo}>
                    <div style={styles.portalLabel}>
                      {portal.label || 'Portal'}
                    </div>
                    <div style={styles.portalRoute}>
                      {getSceneName(portal.fromScene)} → {getSceneName(portal.toScene)}
                    </div>
                  </div>
                  <span style={styles.portalArrow}>→</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: CHENU_COLORS.ancientStone }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌀</div>
                <div>No portals in this universe</div>
              </div>
            )}
          </div>
        )}

        {/* Topology */}
        {activeTab === 'topology' && (
          <div style={styles.topologySection}>
            <div style={styles.topologyTitle}>
              <span>📊</span>
              Universe Topology
            </div>
            
            <div style={styles.topologyStats}>
              <div style={styles.topologyStat}>
                <div style={styles.statValue}>{universeScenes.length}</div>
                <div style={styles.statLabel}>Scenes</div>
              </div>
              <div style={styles.topologyStat}>
                <div style={styles.statValue}>{portals.length}</div>
                <div style={styles.statLabel}>Portals</div>
              </div>
              <div style={styles.topologyStat}>
                <div style={styles.statValue}>{totals.sectors}</div>
                <div style={styles.statLabel}>Sectors</div>
              </div>
              <div style={styles.topologyStat}>
                <div style={styles.statValue}>{totals.objects}</div>
                <div style={styles.statLabel}>Objects</div>
              </div>
            </div>

            <div style={styles.sphereDistribution}>
              <div style={{ ...styles.topologyTitle, marginTop: '16px' }}>
                <span>🌐</span>
                Sphere Distribution
              </div>
              {sphereDistribution.map(([sphere, count]) => {
                const color = SPHERE_COLORS[sphere] || CHENU_COLORS.ancientStone;
                const icon = SPHERE_ICONS[sphere] || '📍';
                const percentage = (count / universeScenes.length) * 100;

                return (
                  <div key={sphere} style={styles.sphereBar}>
                    <div style={styles.sphereLabel}>
                      <span>{icon}</span>
                      {sphere}
                    </div>
                    <div style={styles.sphereProgress}>
                      <div
                        style={{
                          ...styles.sphereProgressFill,
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <div style={styles.sphereCount}>{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default XRUniverseViewer;
