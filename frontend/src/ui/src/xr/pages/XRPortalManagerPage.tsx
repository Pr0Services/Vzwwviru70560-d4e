/**
 * ============================================================
 * CHE·NU — XR PORTAL MANAGER PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

interface Portal {
  id: string;
  name: string;
  sourceSceneId: string;
  sourceSceneName: string;
  targetSceneId: string;
  targetSceneName: string;
  sourceSphere: string;
  targetSphere: string;
  style: 'door' | 'arch' | 'ring' | 'vortex' | 'minimal';
  active: boolean;
  bidirectional: boolean;
}

interface Sphere {
  id: string;
  name: string;
  color: string;
  icon: string;
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

const SPHERES: Sphere[] = [
  { id: 'personal', name: 'Personal', color: CHENU_COLORS.sacredGold, icon: '🏠' },
  { id: 'creative', name: 'Creative', color: '#9B59B6', icon: '🎨' },
  { id: 'business', name: 'Business', color: CHENU_COLORS.jungleEmerald, icon: '💼' },
  { id: 'social', name: 'Social', color: CHENU_COLORS.cenoteTurquoise, icon: '👥' },
  { id: 'scholars', name: 'Scholar', color: '#3498DB', icon: '📚' },
  { id: 'ailab', name: 'AI Lab', color: '#00D9FF', icon: '🤖' },
  { id: 'entertainment', name: 'Entertainment', color: '#E74C3C', icon: '🎮' },
  { id: 'systems', name: 'Systems', color: CHENU_COLORS.ancientStone, icon: '⚙️' },
];

const MOCK_PORTALS: Portal[] = [
  {
    id: 'portal-1',
    name: 'Sanctuary to Studio',
    sourceSceneId: 'scene-sanctuary',
    sourceSceneName: 'Sanctuary',
    targetSceneId: 'scene-creative-studio',
    targetSceneName: 'Creative Studio',
    sourceSphere: 'personal',
    targetSphere: 'creative',
    style: 'arch',
    active: true,
    bidirectional: true,
  },
  {
    id: 'portal-2',
    name: 'Hub Connection',
    sourceSceneId: 'scene-business-hub',
    sourceSceneName: 'Business Hub',
    targetSceneId: 'scene-social-plaza',
    targetSceneName: 'Social Plaza',
    sourceSphere: 'business',
    targetSphere: 'social',
    style: 'ring',
    active: true,
    bidirectional: true,
  },
  {
    id: 'portal-3',
    name: 'Knowledge Gateway',
    sourceSceneId: 'scene-scholar-library',
    sourceSceneName: 'Scholar Library',
    targetSceneId: 'scene-ai-lab',
    targetSceneName: 'AI Laboratory',
    sourceSphere: 'scholars',
    targetSphere: 'ailab',
    style: 'vortex',
    active: true,
    bidirectional: false,
  },
  {
    id: 'portal-4',
    name: 'Observatory Link',
    sourceSceneId: 'scene-observatory',
    sourceSceneName: 'Observatory',
    targetSceneId: 'scene-sanctuary',
    targetSceneName: 'Sanctuary',
    sourceSphere: 'systems',
    targetSphere: 'personal',
    style: 'minimal',
    active: false,
    bidirectional: true,
  },
  {
    id: 'portal-5',
    name: 'Entertainment Access',
    sourceSceneId: 'scene-social-plaza',
    sourceSceneName: 'Social Plaza',
    targetSceneId: 'scene-entertainment-arena',
    targetSceneName: 'Entertainment Arena',
    sourceSphere: 'social',
    targetSphere: 'entertainment',
    style: 'door',
    active: true,
    bidirectional: true,
  },
];

const PORTAL_STYLES = [
  { id: 'door', name: 'Door', icon: '🚪' },
  { id: 'arch', name: 'Arch', icon: '🌉' },
  { id: 'ring', name: 'Ring', icon: '⭕' },
  { id: 'vortex', name: 'Vortex', icon: '🌀' },
  { id: 'minimal', name: 'Minimal', icon: '◯' },
];

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: CHENU_COLORS.uiSlate,
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
    padding: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: {
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  primaryButton: {
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.uiSlate,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: CHENU_COLORS.sacredGold,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '24px',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  networkView: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    minHeight: '400px',
    position: 'relative',
  },
  networkTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    marginBottom: '16px',
  },
  networkCanvas: {
    position: 'relative',
    height: '350px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sphereNode: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '3px solid',
  },
  sphereIcon: {
    fontSize: '24px',
    marginBottom: '4px',
  },
  sphereName: {
    fontSize: '10px',
    fontWeight: 600,
    textAlign: 'center',
  },
  portalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  portalCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    transition: 'all 0.2s ease',
  },
  portalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  portalName: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  portalStatus: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
  },
  portalActive: {
    backgroundColor: 'rgba(62, 180, 162, 0.2)',
    color: CHENU_COLORS.cenoteTurquoise,
  },
  portalInactive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.ancientStone,
  },
  portalConnection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  portalEndpoint: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  endpointSphere: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '2px',
  },
  endpointScene: {
    fontSize: '13px',
    fontWeight: 500,
  },
  portalArrow: {
    fontSize: '20px',
    color: CHENU_COLORS.cenoteTurquoise,
  },
  portalMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  panel: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '20px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  panelTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sphereFilter: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  sphereTag: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
  },
  sphereTagActive: {
    borderColor: 'currentColor',
  },
  styleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  styleOption: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `1px solid transparent`,
  },
  styleOptionActive: {
    borderColor: CHENU_COLORS.sacredGold,
    backgroundColor: 'rgba(216, 178, 106, 0.1)',
  },
  styleIcon: {
    fontSize: '24px',
    marginBottom: '4px',
  },
  styleName: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRPortalManagerPage: React.FC = () => {
  const [portals] = useState<Portal[]>(MOCK_PORTALS);
  const [selectedSphere, setSelectedSphere] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  // Filter portals
  const filteredPortals = useMemo(() => {
    return portals.filter(portal => {
      if (selectedSphere && portal.sourceSphere !== selectedSphere && portal.targetSphere !== selectedSphere) {
        return false;
      }
      if (selectedStyle && portal.style !== selectedStyle) {
        return false;
      }
      return true;
    });
  }, [portals, selectedSphere, selectedStyle]);

  // Stats
  const stats = useMemo(() => ({
    total: portals.length,
    active: portals.filter(p => p.active).length,
    bidirectional: portals.filter(p => p.bidirectional).length,
    spheresConnected: new Set([...portals.map(p => p.sourceSphere), ...portals.map(p => p.targetSphere)]).size,
  }), [portals]);

  // Sphere positions for network view (circular layout)
  const getSpherePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 140;
    return {
      left: `calc(50% + ${Math.cos(angle) * radius}px - 40px)`,
      top: `calc(50% + ${Math.sin(angle) * radius}px - 40px)`,
    };
  };

  const getSphere = (id: string) => SPHERES.find(s => s.id === id);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <span>🌀</span>
            Portal Manager
          </h1>
          <p style={styles.subtitle}>
            Manage XR navigation portals between scenes and spheres
          </p>
        </div>
        <button style={{ ...styles.button, ...styles.primaryButton }}>
          + Create Portal
        </button>
      </header>

      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Total Portals</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: CHENU_COLORS.cenoteTurquoise }}>
            {stats.active}
          </div>
          <div style={styles.statLabel}>Active</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: CHENU_COLORS.jungleEmerald }}>
            {stats.bidirectional}
          </div>
          <div style={styles.statLabel}>Bidirectional</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: CHENU_COLORS.ancientStone }}>
            {stats.spheresConnected}
          </div>
          <div style={styles.statLabel}>Spheres Connected</div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Main */}
        <div style={styles.main}>
          {/* Network View */}
          <div style={styles.networkView}>
            <h3 style={styles.networkTitle}>🌐 Portal Network</h3>
            <div style={styles.networkCanvas}>
              {SPHERES.map((sphere, index) => (
                <div
                  key={sphere.id}
                  style={{
                    ...styles.sphereNode,
                    ...getSpherePosition(index, SPHERES.length),
                    backgroundColor: `${sphere.color}20`,
                    borderColor: sphere.color,
                    opacity: selectedSphere && selectedSphere !== sphere.id ? 0.4 : 1,
                  }}
                  onClick={() => setSelectedSphere(
                    selectedSphere === sphere.id ? null : sphere.id
                  )}
                >
                  <span style={styles.sphereIcon}>{sphere.icon}</span>
                  <span style={styles.sphereName}>{sphere.name}</span>
                </div>
              ))}
              {/* Center hub indicator */}
              <div style={{
                position: 'absolute',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: `${CHENU_COLORS.sacredGold}20`,
                border: `2px dashed ${CHENU_COLORS.sacredGold}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}>
                🌀
              </div>
            </div>
          </div>

          {/* Portal List */}
          <div style={styles.portalList}>
            {filteredPortals.map(portal => {
              const sourceSphere = getSphere(portal.sourceSphere);
              const targetSphere = getSphere(portal.targetSphere);
              const portalStyle = PORTAL_STYLES.find(s => s.id === portal.style);

              return (
                <div key={portal.id} style={styles.portalCard}>
                  <div style={styles.portalHeader}>
                    <div style={styles.portalName}>
                      <span>{portalStyle?.icon}</span>
                      {portal.name}
                    </div>
                    <span style={{
                      ...styles.portalStatus,
                      ...(portal.active ? styles.portalActive : styles.portalInactive),
                    }}>
                      {portal.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div style={styles.portalConnection}>
                    <div style={styles.portalEndpoint}>
                      <div style={{ ...styles.endpointSphere, color: sourceSphere?.color }}>
                        {sourceSphere?.icon} {sourceSphere?.name}
                      </div>
                      <div style={styles.endpointScene}>{portal.sourceSceneName}</div>
                    </div>
                    <span style={styles.portalArrow}>
                      {portal.bidirectional ? '⟷' : '→'}
                    </span>
                    <div style={styles.portalEndpoint}>
                      <div style={{ ...styles.endpointSphere, color: targetSphere?.color }}>
                        {targetSphere?.icon} {targetSphere?.name}
                      </div>
                      <div style={styles.endpointScene}>{portal.targetSceneName}</div>
                    </div>
                  </div>

                  <div style={styles.portalMeta}>
                    <span style={styles.metaItem}>
                      🎨 Style: {portalStyle?.name}
                    </span>
                    <span style={styles.metaItem}>
                      {portal.bidirectional ? '🔄 Bidirectional' : '➡️ One-way'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Sphere Filter */}
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>
              <span>🎯</span>
              Filter by Sphere
            </h3>
            <div style={styles.sphereFilter}>
              {SPHERES.map(sphere => (
                <div
                  key={sphere.id}
                  style={{
                    ...styles.sphereTag,
                    backgroundColor: `${sphere.color}20`,
                    color: sphere.color,
                    ...(selectedSphere === sphere.id ? styles.sphereTagActive : {}),
                  }}
                  onClick={() => setSelectedSphere(
                    selectedSphere === sphere.id ? null : sphere.id
                  )}
                >
                  {sphere.icon} {sphere.name}
                </div>
              ))}
            </div>
          </div>

          {/* Style Filter */}
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>
              <span>✨</span>
              Filter by Style
            </h3>
            <div style={styles.styleGrid}>
              {PORTAL_STYLES.map(style => (
                <div
                  key={style.id}
                  style={{
                    ...styles.styleOption,
                    ...(selectedStyle === style.id ? styles.styleOptionActive : {}),
                  }}
                  onClick={() => setSelectedStyle(
                    selectedStyle === style.id ? null : style.id
                  )}
                >
                  <div style={styles.styleIcon}>{style.icon}</div>
                  <div style={styles.styleName}>{style.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>
              <span>📋</span>
              Legend
            </h3>
            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: CHENU_COLORS.cenoteTurquoise }} />
                <span>Active Portal</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: CHENU_COLORS.ancientStone }} />
                <span>Inactive Portal</span>
              </div>
              <div style={styles.legendItem}>
                <span>⟷</span>
                <span>Bidirectional</span>
              </div>
              <div style={styles.legendItem}>
                <span>→</span>
                <span>One-way</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XRPortalManagerPage;
