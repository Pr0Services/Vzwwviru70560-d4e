/**
 * ============================================================
 * CHE·NU — XR UNIVERSE TOPOLOGY
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Displays universe structure statistics and topology analysis.
 */

import React, { useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

interface UniverseStats {
  sceneCount: number;
  sectorCount: number;
  portalCount: number;
  sphereDistribution: Record<string, number>;
  avgPortalsPerScene: number;
  isolatedSceneCount: number;
  connectedComponents: number;
  hubScenes: Array<{ id: string; name: string; connections: number }>;
}

interface XRUniverseTopologyProps {
  universeId: string;
  universeName: string;
  templateId?: string;
  stats: UniverseStats;
  onAnalyze?: () => void;
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

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.uiSlate,
    borderRadius: '12px',
    padding: '16px',
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    backgroundColor: `${CHENU_COLORS.sacredGold}30`,
    color: CHENU_COLORS.sacredGold,
  },
  section: {
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '10px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: CHENU_COLORS.sacredGold,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  sphereList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sphereItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: '6px',
  },
  sphereIcon: {
    fontSize: '16px',
  },
  sphereName: {
    flex: 1,
    fontSize: '13px',
    textTransform: 'capitalize',
  },
  sphereCount: {
    fontWeight: 600,
  },
  sphereBar: {
    height: '4px',
    borderRadius: '2px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    flex: 1,
    maxWidth: '80px',
    marginLeft: '8px',
    overflow: 'hidden',
  },
  sphereBarFill: {
    height: '100%',
    borderRadius: '2px',
  },
  healthGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  healthCard: {
    padding: '10px 12px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
  },
  healthGood: {
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
    color: '#27AE60',
  },
  healthWarning: {
    backgroundColor: 'rgba(241, 196, 15, 0.2)',
    color: '#F1C40F',
  },
  healthBad: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    color: '#E74C3C',
  },
  healthNeutral: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: CHENU_COLORS.ancientStone,
  },
  hubList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  hubItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: '6px',
  },
  hubRank: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.uiSlate,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
  },
  hubName: {
    flex: 1,
    fontSize: '13px',
  },
  hubConnections: {
    fontSize: '12px',
    color: CHENU_COLORS.cenoteTurquoise,
  },
  footer: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.shadowMoss}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  button: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.softSand,
    transition: 'all 0.2s ease',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRUniverseTopology: React.FC<XRUniverseTopologyProps> = ({
  universeName,
  templateId,
  stats,
  onAnalyze,
}) => {
  // Calculate health indicators
  const health = useMemo(() => {
    const connectivity = stats.isolatedSceneCount === 0
      ? 'good'
      : stats.isolatedSceneCount <= 1
        ? 'warning'
        : 'bad';

    const components = stats.connectedComponents <= 1
      ? 'good'
      : stats.connectedComponents <= 2
        ? 'warning'
        : 'bad';

    const density = stats.avgPortalsPerScene >= 1.5
      ? 'good'
      : stats.avgPortalsPerScene >= 0.8
        ? 'warning'
        : 'bad';

    return { connectivity, components, density };
  }, [stats]);

  // Sort spheres by count
  const sortedSpheres = useMemo(() => {
    return Object.entries(stats.sphereDistribution)
      .sort((a, b) => b[1] - a[1]);
  }, [stats.sphereDistribution]);

  const maxSphereCount = sortedSpheres[0]?.[1] ?? 1;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📊</span>
          Universe Topology
        </div>
        {templateId && (
          <span style={styles.badge}>{templateId.replace('template_', '')}</span>
        )}
      </div>

      {/* Core Stats */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Overview</div>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.sceneCount}</div>
            <div style={styles.statLabel}>Scenes</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: CHENU_COLORS.cenoteTurquoise }}>
              {stats.portalCount}
            </div>
            <div style={styles.statLabel}>Portals</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: CHENU_COLORS.jungleEmerald }}>
              {stats.sectorCount}
            </div>
            <div style={styles.statLabel}>Sectors</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: CHENU_COLORS.ancientStone }}>
              {stats.avgPortalsPerScene.toFixed(1)}
            </div>
            <div style={styles.statLabel}>Avg Links/Scene</div>
          </div>
        </div>
      </div>

      {/* Health Indicators */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Topology Health</div>
        <div style={styles.healthGrid}>
          <div
            style={{
              ...styles.healthCard,
              ...(health.connectivity === 'good'
                ? styles.healthGood
                : health.connectivity === 'warning'
                  ? styles.healthWarning
                  : styles.healthBad),
            }}
          >
            <span>{health.connectivity === 'good' ? '✅' : health.connectivity === 'warning' ? '⚠️' : '❌'}</span>
            <span>{stats.isolatedSceneCount} isolated</span>
          </div>
          <div
            style={{
              ...styles.healthCard,
              ...(health.components === 'good'
                ? styles.healthGood
                : health.components === 'warning'
                  ? styles.healthWarning
                  : styles.healthBad),
            }}
          >
            <span>{health.components === 'good' ? '✅' : health.components === 'warning' ? '⚠️' : '❌'}</span>
            <span>{stats.connectedComponents} component{stats.connectedComponents !== 1 ? 's' : ''}</span>
          </div>
          <div
            style={{
              ...styles.healthCard,
              ...(health.density === 'good'
                ? styles.healthGood
                : health.density === 'warning'
                  ? styles.healthWarning
                  : styles.healthNeutral),
            }}
          >
            <span>{health.density === 'good' ? '🔗' : '🔸'}</span>
            <span>{health.density === 'good' ? 'Well connected' : 'Sparse'}</span>
          </div>
          <div style={{ ...styles.healthCard, ...styles.healthNeutral }}>
            <span>📐</span>
            <span>
              {stats.sceneCount > 0
                ? `${Math.round((stats.portalCount / stats.sceneCount) * 100)}% density`
                : '0% density'}
            </span>
          </div>
        </div>
      </div>

      {/* Sphere Distribution */}
      {sortedSpheres.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Sphere Distribution</div>
          <div style={styles.sphereList}>
            {sortedSpheres.slice(0, 5).map(([sphere, count]) => (
              <div key={sphere} style={styles.sphereItem}>
                <span style={styles.sphereIcon}>
                  {SPHERE_ICONS[sphere] ?? '📍'}
                </span>
                <span style={styles.sphereName}>{sphere}</span>
                <span
                  style={{
                    ...styles.sphereCount,
                    color: SPHERE_COLORS[sphere] ?? CHENU_COLORS.ancientStone,
                  }}
                >
                  {count}
                </span>
                <div style={styles.sphereBar}>
                  <div
                    style={{
                      ...styles.sphereBarFill,
                      width: `${(count / maxSphereCount) * 100}%`,
                      backgroundColor: SPHERE_COLORS[sphere] ?? CHENU_COLORS.ancientStone,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hub Scenes */}
      {stats.hubScenes.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Hub Scenes (Most Connected)</div>
          <div style={styles.hubList}>
            {stats.hubScenes.slice(0, 3).map((hub, i) => (
              <div key={hub.id} style={styles.hubItem}>
                <div style={styles.hubRank}>{i + 1}</div>
                <span style={styles.hubName}>{hub.name}</span>
                <span style={styles.hubConnections}>
                  {hub.connections} links
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <span>{universeName}</span>
        {onAnalyze && (
          <button style={styles.button} onClick={onAnalyze}>
            🔍 Analyze
          </button>
        )}
      </div>
    </div>
  );
};

export default XRUniverseTopology;
