/**
 * ============================================================
 * CHE·NU — XR UNIVERSE EDITOR PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState, useMemo, useCallback } from 'react';

// ============================================================
// TYPES
// ============================================================

interface XRScene {
  id: string;
  name: string;
  sphere: string;
  sectors: { id: string; name: string }[];
}

interface XRPortal {
  id: string;
  fromScene: string;
  toScene: string;
  label?: string;
  bidirectional: boolean;
}

interface XRUniverse {
  id: string;
  name: string;
  description?: string;
  scenes: XRScene[];
  portals: XRPortal[];
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

const SPHERES = [
  { id: 'personal', name: 'Personal', color: CHENU_COLORS.sacredGold, icon: '🏠' },
  { id: 'business', name: 'Business', color: CHENU_COLORS.jungleEmerald, icon: '💼' },
  { id: 'creative', name: 'Creative', color: '#9B59B6', icon: '🎨' },
  { id: 'social', name: 'Social', color: CHENU_COLORS.cenoteTurquoise, icon: '👥' },
  { id: 'scholars', name: 'Scholar', color: '#3498DB', icon: '📚' },
  { id: 'ailab', name: 'AI Lab', color: '#00D9FF', icon: '🤖' },
  { id: 'entertainment', name: 'Entertainment', color: '#E74C3C', icon: '🎮' },
  { id: 'systems', name: 'Systems', color: CHENU_COLORS.ancientStone, icon: '⚙️' },
];

// Mock Universe Data
const MOCK_UNIVERSE: XRUniverse = {
  id: 'universe-1',
  name: 'CHE·NU Main Universe',
  description: 'Primary universe for CHE·NU platform',
  scenes: [
    { id: 'scene-1', name: 'Central Hub', sphere: 'systems', sectors: [{ id: 's1', name: 'Main Hall' }, { id: 's2', name: 'Info Center' }] },
    { id: 'scene-2', name: 'Personal Sanctuary', sphere: 'personal', sectors: [{ id: 's3', name: 'Meditation' }] },
    { id: 'scene-3', name: 'Business Hub', sphere: 'business', sectors: [] },
    { id: 'scene-4', name: 'Creative Studio', sphere: 'creative', sectors: [{ id: 's4', name: 'Gallery' }, { id: 's5', name: 'Workshop' }] },
    { id: 'scene-5', name: 'Social Plaza', sphere: 'social', sectors: [] },
    { id: 'scene-6', name: 'AI Laboratory', sphere: 'ailab', sectors: [{ id: 's6', name: 'Sandbox' }] },
  ],
  portals: [
    { id: 'p1', fromScene: 'scene-1', toScene: 'scene-2', label: 'To Personal', bidirectional: true },
    { id: 'p2', fromScene: 'scene-1', toScene: 'scene-3', label: 'To Business', bidirectional: true },
    { id: 'p3', fromScene: 'scene-1', toScene: 'scene-4', label: 'To Creative', bidirectional: true },
    { id: 'p4', fromScene: 'scene-1', toScene: 'scene-5', label: 'To Social', bidirectional: true },
    { id: 'p5', fromScene: 'scene-1', toScene: 'scene-6', label: 'To AI Lab', bidirectional: true },
    { id: 'p6', fromScene: 'scene-2', toScene: 'scene-4', label: 'Creative Link', bidirectional: false },
  ],
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: CHENU_COLORS.uiSlate,
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  title: {
    fontSize: '22px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  button: {
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  primaryButton: {
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.uiSlate,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.softSand,
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr 320px',
    height: 'calc(100vh - 73px)',
  },
  sidebar: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRight: `1px solid ${CHENU_COLORS.shadowMoss}`,
    overflow: 'auto',
  },
  sidebarSection: {
    padding: '16px',
    borderBottom: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  sectionTitle: {
    fontSize: '12px',
    textTransform: 'uppercase',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '12px',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sceneList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  sceneItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  sceneItemSelected: {
    backgroundColor: `${CHENU_COLORS.sacredGold}20`,
    border: `1px solid ${CHENU_COLORS.sacredGold}40`,
  },
  sceneIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  sceneInfo: {
    flex: 1,
  },
  sceneName: {
    fontSize: '13px',
    fontWeight: 500,
  },
  sceneMeta: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  viewport: {
    position: 'relative',
    backgroundColor: '#0a0a0a',
    overflow: 'hidden',
  },
  graphView: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  graphNode: {
    position: 'absolute',
    padding: '12px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '120px',
    textAlign: 'center',
  },
  graphNodeLabel: {
    fontSize: '12px',
    fontWeight: 500,
    marginTop: '6px',
  },
  graphNodeIcon: {
    fontSize: '24px',
  },
  viewportControls: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '8px 12px',
    borderRadius: '20px',
  },
  viewportButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.softSand,
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderLeft: `1px solid ${CHENU_COLORS.shadowMoss}`,
    display: 'flex',
    flexDirection: 'column',
  },
  panelTabs: {
    display: 'flex',
    borderBottom: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  panelTab: {
    flex: 1,
    padding: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    color: CHENU_COLORS.ancientStone,
    transition: 'all 0.2s ease',
    borderBottom: '2px solid transparent',
  },
  panelTabActive: {
    color: CHENU_COLORS.cenoteTurquoise,
    borderBottomColor: CHENU_COLORS.cenoteTurquoise,
  },
  panelContent: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
  portalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  portalCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '12px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  portalLabel: {
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  portalConnection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  portalArrow: {
    color: CHENU_COLORS.cenoteTurquoise,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '16px',
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: CHENU_COLORS.sacredGold,
  },
  statLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
  },
  linkEditor: {
    marginTop: '16px',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    marginBottom: '10px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  footer: {
    padding: '12px 16px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTop: `1px solid ${CHENU_COLORS.shadowMoss}`,
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    justifyContent: 'space-between',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRUniverseEditorPage: React.FC = () => {
  const [universe] = useState<XRUniverse>(MOCK_UNIVERSE);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'portals' | 'topology' | 'link'>('portals');
  const [linkFrom, setLinkFrom] = useState('');
  const [linkTo, setLinkTo] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [linkBidirectional, setLinkBidirectional] = useState(true);

  const getSphere = (sphereId: string) => SPHERES.find(s => s.id === sphereId);

  // Calculate node positions for graph view
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = 50; // percent
    const centerY = 50;
    const radius = 35;

    universe.scenes.forEach((scene, index) => {
      if (index === 0) {
        // First scene at center
        positions[scene.id] = { x: centerX, y: centerY };
      } else {
        // Other scenes in a circle
        const angle = ((index - 1) / (universe.scenes.length - 1)) * 2 * Math.PI - Math.PI / 2;
        positions[scene.id] = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        };
      }
    });

    return positions;
  }, [universe.scenes]);

  const getSceneName = useCallback((sceneId: string) => {
    return universe.scenes.find(s => s.id === sceneId)?.name ?? sceneId;
  }, [universe.scenes]);

  const handleCreateLink = useCallback(() => {
    if (linkFrom && linkTo && linkFrom !== linkTo) {
      logger.debug('Creating link:', { from: linkFrom, to: linkTo, label: linkLabel, bidirectional: linkBidirectional });
      // In real implementation, this would update the universe
      setLinkFrom('');
      setLinkTo('');
      setLinkLabel('');
    }
  }, [linkFrom, linkTo, linkLabel, linkBidirectional]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>
          <span>🌌</span>
          XR Universe Editor
          <span style={{ color: CHENU_COLORS.ancientStone, fontWeight: 400, fontSize: '14px' }}>
            — {universe.name}
          </span>
        </h1>
        <div style={styles.headerActions}>
          <button style={{ ...styles.button, ...styles.secondaryButton }}>
            📋 Templates
          </button>
          <button style={{ ...styles.button, ...styles.secondaryButton }}>
            📤 Export
          </button>
          <button style={{ ...styles.button, ...styles.primaryButton }}>
            💾 Save Universe
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Left Sidebar - Scene List */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <div style={styles.sectionTitle}>
              <span>Scenes ({universe.scenes.length})</span>
              <button style={{ ...styles.button, ...styles.secondaryButton, padding: '4px 8px', fontSize: '11px' }}>
                + Add
              </button>
            </div>
            <div style={styles.sceneList}>
              {universe.scenes.map(scene => {
                const sphere = getSphere(scene.sphere);
                return (
                  <div
                    key={scene.id}
                    style={{
                      ...styles.sceneItem,
                      ...(selectedScene === scene.id ? styles.sceneItemSelected : {}),
                    }}
                    onClick={() => setSelectedScene(selectedScene === scene.id ? null : scene.id)}
                  >
                    <div
                      style={{
                        ...styles.sceneIcon,
                        backgroundColor: `${sphere?.color}30`,
                        border: `2px solid ${sphere?.color}`,
                      }}
                    >
                      {sphere?.icon}
                    </div>
                    <div style={styles.sceneInfo}>
                      <div style={styles.sceneName}>{scene.name}</div>
                      <div style={styles.sceneMeta}>
                        {sphere?.name} • {scene.sectors.length} sectors
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Center - Graph View */}
        <section style={styles.viewport}>
          <div style={styles.graphView}>
            {/* Connections (SVG lines) */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              {universe.portals.map(portal => {
                const fromPos = nodePositions[portal.fromScene];
                const toPos = nodePositions[portal.toScene];
                if (!fromPos || !toPos) return null;

                return (
                  <g key={portal.id}>
                    <line
                      x1={`${fromPos.x}%`}
                      y1={`${fromPos.y}%`}
                      x2={`${toPos.x}%`}
                      y2={`${toPos.y}%`}
                      stroke={CHENU_COLORS.cenoteTurquoise}
                      strokeWidth="2"
                      strokeOpacity="0.5"
                      strokeDasharray={portal.bidirectional ? 'none' : '5,5'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Scene Nodes */}
            {universe.scenes.map(scene => {
              const pos = nodePositions[scene.id];
              const sphere = getSphere(scene.sphere);
              if (!pos) return null;

              return (
                <div
                  key={scene.id}
                  style={{
                    ...styles.graphNode,
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: `${sphere?.color}20`,
                    border: `2px solid ${sphere?.color}`,
                    boxShadow: selectedScene === scene.id
                      ? `0 0 20px ${sphere?.color}`
                      : 'none',
                  }}
                  onClick={() => setSelectedScene(scene.id)}
                >
                  <div style={styles.graphNodeIcon}>{sphere?.icon}</div>
                  <div style={styles.graphNodeLabel}>{scene.name}</div>
                </div>
              );
            })}
          </div>

          {/* Viewport Controls */}
          <div style={styles.viewportControls}>
            <button style={styles.viewportButton}>🔍+</button>
            <button style={styles.viewportButton}>🔍-</button>
            <button style={styles.viewportButton}>🎯</button>
            <button style={styles.viewportButton}>🔄</button>
          </div>
        </section>

        {/* Right Panel */}
        <aside style={styles.panel}>
          <div style={styles.panelTabs}>
            <div
              style={{
                ...styles.panelTab,
                ...(activeTab === 'portals' ? styles.panelTabActive : {}),
              }}
              onClick={() => setActiveTab('portals')}
            >
              🌀 Portals
            </div>
            <div
              style={{
                ...styles.panelTab,
                ...(activeTab === 'topology' ? styles.panelTabActive : {}),
              }}
              onClick={() => setActiveTab('topology')}
            >
              📊 Stats
            </div>
            <div
              style={{
                ...styles.panelTab,
                ...(activeTab === 'link' ? styles.panelTabActive : {}),
              }}
              onClick={() => setActiveTab('link')}
            >
              🔗 Link
            </div>
          </div>

          <div style={styles.panelContent}>
            {activeTab === 'portals' && (
              <>
                <div style={styles.sectionTitle}>
                  Portal Connections ({universe.portals.length})
                </div>
                <div style={styles.portalList}>
                  {universe.portals.map(portal => (
                    <div key={portal.id} style={styles.portalCard}>
                      <div style={styles.portalLabel}>
                        <span>🌀</span>
                        {portal.label}
                      </div>
                      <div style={styles.portalConnection}>
                        <span>{getSceneName(portal.fromScene)}</span>
                        <span style={styles.portalArrow}>
                          {portal.bidirectional ? '⟷' : '→'}
                        </span>
                        <span>{getSceneName(portal.toScene)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'topology' && (
              <>
                <div style={styles.stats}>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{universe.scenes.length}</div>
                    <div style={styles.statLabel}>Scenes</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={{ ...styles.statValue, color: CHENU_COLORS.cenoteTurquoise }}>
                      {universe.portals.length}
                    </div>
                    <div style={styles.statLabel}>Portals</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={{ ...styles.statValue, color: CHENU_COLORS.jungleEmerald }}>
                      {universe.portals.filter(p => p.bidirectional).length}
                    </div>
                    <div style={styles.statLabel}>Bidirectional</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={{ ...styles.statValue, color: CHENU_COLORS.ancientStone }}>
                      {universe.scenes.reduce((sum, s) => sum + s.sectors.length, 0)}
                    </div>
                    <div style={styles.statLabel}>Sectors</div>
                  </div>
                </div>

                <div style={styles.sectionTitle}>Sphere Distribution</div>
                {SPHERES.map(sphere => {
                  const count = universe.scenes.filter(s => s.sphere === sphere.id).length;
                  if (count === 0) return null;
                  return (
                    <div key={sphere.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span>{sphere.icon}</span>
                      <span style={{ flex: 1, fontSize: '13px' }}>{sphere.name}</span>
                      <span style={{ color: sphere.color, fontWeight: 600 }}>{count}</span>
                    </div>
                  );
                })}
              </>
            )}

            {activeTab === 'link' && (
              <div style={styles.linkEditor}>
                <div style={styles.sectionTitle}>Create Scene Link</div>
                
                <label style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '4px', display: 'block' }}>
                  From Scene
                </label>
                <select
                  style={styles.select}
                  value={linkFrom}
                  onChange={e => setLinkFrom(e.target.value)}
                >
                  <option value="">Select scene...</option>
                  {universe.scenes.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <label style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '4px', display: 'block' }}>
                  To Scene
                </label>
                <select
                  style={styles.select}
                  value={linkTo}
                  onChange={e => setLinkTo(e.target.value)}
                >
                  <option value="">Select scene...</option>
                  {universe.scenes.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <label style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '4px', display: 'block' }}>
                  Portal Label
                </label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Enter label..."
                  value={linkLabel}
                  onChange={e => setLinkLabel(e.target.value)}
                />

                <label style={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={linkBidirectional}
                    onChange={e => setLinkBidirectional(e.target.checked)}
                  />
                  Bidirectional
                </label>

                <button
                  style={{ ...styles.button, ...styles.primaryButton, width: '100%' }}
                  onClick={handleCreateLink}
                  disabled={!linkFrom || !linkTo || linkFrom === linkTo}
                >
                  🔗 Create Portal
                </button>
              </div>
            )}
          </div>

          <div style={styles.footer}>
            <span>SAFE · READ-ONLY</span>
            <span>Topology View</span>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default XRUniverseEditorPage;
