/**
 * ============================================================
 * CHE·NU — DEMO ARCHITECTURE UNIVERSE PAGE
 * Architecture XR Universe Demo v2
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState, useCallback } from 'react';
import { getMockArchitectureUniverseDemo } from './demoAdapter';
import { DemoCallouts } from './DemoCallouts';
import { XRUniverseMapView } from '../xr/XRUniverseMapView';
import { XRSceneListPanel } from '../xr/XRSceneListPanel';

// ============================================================
// COLORS
// ============================================================

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  cardBg: '#2A2B2E',
  borderColor: '#3A3B3E',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#707070',
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: COLORS.uiSlate,
    minHeight: '100vh',
    padding: '24px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: COLORS.textPrimary,
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '24px',
  },
  breadcrumb: {
    fontSize: '12px',
    color: COLORS.textMuted,
    marginBottom: '8px',
  },
  breadcrumbLink: {
    color: COLORS.cenoteTurquoise,
    textDecoration: 'none',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: {
    fontSize: '14px',
    color: COLORS.textMuted,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '20px',
    marginBottom: '24px',
  },
  panel: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.borderColor}`,
    overflow: 'hidden',
  },
  panelHeader: {
    padding: '14px 16px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  panelIcon: {
    fontSize: '16px',
  },
  panelTitle: {
    fontSize: '13px',
    fontWeight: 600,
  },
  panelContent: {
    padding: '16px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  infoCard: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    padding: '12px',
  },
  infoLabel: {
    fontSize: '10px',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.textPrimary,
  },
  dataspaceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  dataspaceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  dataspaceIcon: {
    fontSize: '16px',
  },
  dataspaceName: {
    flex: 1,
    fontSize: '12px',
    fontWeight: 500,
    color: COLORS.textSecondary,
  },
  dataspaceCount: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: COLORS.textMuted,
  },
  footer: {
    padding: '20px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.borderColor}`,
    textAlign: 'center',
  },
  footerText: {
    fontSize: '11px',
    color: COLORS.textMuted,
    lineHeight: 1.5,
  },
  safetyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    backgroundColor: `${COLORS.jungleEmerald}20`,
    border: `1px solid ${COLORS.jungleEmerald}`,
    borderRadius: '8px',
    color: COLORS.jungleEmerald,
    fontSize: '11px',
    fontWeight: 600,
    marginTop: '12px',
  },
};

// ============================================================
// DATASPACE ICONS
// ============================================================

const DATASPACE_ICONS: Record<string, string> = {
  notes: '📝',
  resources: '📚',
  archive: '🗄️',
  finance: '💰',
};

// ============================================================
// COMPONENT
// ============================================================

export const DemoArchitectureUniversePage: React.FC = () => {
  const demo = getMockArchitectureUniverseDemo();
  const { universe, dataspaces, worksurface } = demo;

  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);

  const handleSelectScene = useCallback((sceneId: string) => {
    setSelectedSceneId(prev => (prev === sceneId ? null : sceneId));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.breadcrumb}>
            <a href="/demo" style={styles.breadcrumbLink}>
              Demos
            </a>{' '}
            / Architecture XR Universe
          </div>
          <h1 style={styles.title}>
            <span>🌀</span>
            Architecture XR Universe Demo v2
          </h1>
          <p style={styles.subtitle}>
            Multi-room XR universe with portal navigation for architectural concept development
          </p>
        </div>

        {/* Callouts */}
        <DemoCallouts variant="architecture_universe" />

        {/* Main Content */}
        <div style={styles.mainGrid}>
          {/* Left: Universe Map */}
          <div>
            <XRUniverseMapView
              universe={universe}
              width={700}
              height={400}
              layout="horizontal"
              selectedSceneId={selectedSceneId}
              onSelectScene={handleSelectScene}
            />
          </div>

          {/* Right: Scene List */}
          <div>
            <XRSceneListPanel
              universe={universe}
              selectedSceneId={selectedSceneId}
              onSelectScene={handleSelectScene}
              maxHeight={400}
            />
          </div>
        </div>

        {/* Workspace Info */}
        <div style={{ ...styles.mainGrid, gridTemplateColumns: '1fr 1fr' }}>
          {/* Workspace Panel */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <span style={styles.panelIcon}>📁</span>
              <span style={styles.panelTitle}>Workspace</span>
            </div>
            <div style={styles.panelContent}>
              <div style={styles.infoGrid}>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Workspace ID</div>
                  <div style={styles.infoValue}>{demo.workspaceId}</div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Name</div>
                  <div style={styles.infoValue}>{demo.workspaceName}</div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Sphere</div>
                  <div style={{ ...styles.infoValue, color: COLORS.cenoteTurquoise }}>
                    {demo.sphere}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Domain</div>
                  <div style={styles.infoValue}>{demo.domain}</div>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '10px', color: COLORS.textSecondary }}>
                  WorkSurface
                </div>
                <div style={{ ...styles.infoGrid, gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div style={styles.infoCard}>
                    <div style={styles.infoLabel}>Profile</div>
                    <div style={styles.infoValue}>{worksurface.profile}</div>
                  </div>
                  <div style={styles.infoCard}>
                    <div style={styles.infoLabel}>Mode</div>
                    <div style={styles.infoValue}>{worksurface.primaryMode}</div>
                  </div>
                  <div style={styles.infoCard}>
                    <div style={styles.infoLabel}>Control</div>
                    <div style={styles.infoValue}>{worksurface.controlMode}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DataSpaces Panel */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <span style={styles.panelIcon}>💾</span>
              <span style={styles.panelTitle}>DataSpaces ({dataspaces.length})</span>
            </div>
            <div style={styles.panelContent}>
              <div style={styles.dataspaceList}>
                {dataspaces.map(ds => (
                  <div key={ds.id} style={styles.dataspaceItem}>
                    <span style={styles.dataspaceIcon}>
                      {DATASPACE_ICONS[ds.type] || '📁'}
                    </span>
                    <span style={styles.dataspaceName}>{ds.name}</span>
                    <span style={styles.dataspaceCount}>{ds.entries} entries</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerText}>
            ⚠️ This is a CONCEPTUAL REPRESENTATION ONLY.<br />
            All outputs are symbolic and representational. Not for real construction or engineering.
          </div>
          <div style={styles.safetyBadge}>
            🛡️ SAFE · READ-ONLY · REPRESENTATIONAL
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoArchitectureUniversePage;
