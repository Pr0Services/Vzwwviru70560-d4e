/**
 * ============================================================
 * CHE·NU — MEGA DEMO PACK UI v2
 * Interactive Demo Selector & Viewer
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 */

import React, { useState, useCallback, useMemo } from 'react';

// ============================================================
// STYLES
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

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: COLORS.uiSlate,
    minHeight: '100vh',
    padding: '32px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: COLORS.textPrimary,
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  logoIcon: {
    fontSize: '48px',
  },
  logoText: {
    fontSize: '36px',
    fontWeight: 700,
    background: `linear-gradient(135deg, ${COLORS.sacredGold}, ${COLORS.cenoteTurquoise})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '16px',
    color: COLORS.textMuted,
    marginBottom: '20px',
  },
  badges: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  badge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  badgeSafe: {
    backgroundColor: `${COLORS.jungleEmerald}30`,
    color: COLORS.jungleEmerald,
  },
  badgeV2: {
    backgroundColor: `${COLORS.cenoteTurquoise}30`,
    color: COLORS.cenoteTurquoise,
  },
  badgeMega: {
    backgroundColor: `${COLORS.sacredGold}30`,
    color: COLORS.sacredGold,
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  demoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '16px',
    border: `2px solid ${COLORS.borderColor}`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  demoCardSelected: {
    borderColor: COLORS.cenoteTurquoise,
    boxShadow: `0 0 0 4px ${COLORS.cenoteTurquoise}30`,
  },
  demoCardHeader: {
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  demoIcon: {
    fontSize: '40px',
    lineHeight: 1,
  },
  demoInfo: {
    flex: 1,
  },
  demoName: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '4px',
  },
  demoVersion: {
    fontSize: '12px',
    color: COLORS.textMuted,
  },
  demoSphere: {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  sphereCreative: {
    backgroundColor: `${COLORS.cenoteTurquoise}30`,
    color: COLORS.cenoteTurquoise,
  },
  sphereBusiness: {
    backgroundColor: `${COLORS.sacredGold}30`,
    color: COLORS.sacredGold,
  },
  demoBody: {
    padding: '20px',
  },
  demoDesc: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    marginBottom: '16px',
    lineHeight: 1.5,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: COLORS.textMuted,
  },
  featureIcon: {
    color: COLORS.jungleEmerald,
  },
  demoStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: `1px solid ${COLORS.borderColor}`,
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: '10px',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  previewPanel: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '16px',
    border: `1px solid ${COLORS.borderColor}`,
    overflow: 'hidden',
    marginBottom: '24px',
  },
  previewHeader: {
    padding: '16px 20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewTitle: {
    fontSize: '16px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  previewContent: {
    padding: '24px',
    minHeight: '400px',
  },
  xrMapContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  xrMap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  xrRoom: {
    padding: '16px 20px',
    borderRadius: '12px',
    border: '2px solid',
    textAlign: 'center',
    minWidth: '140px',
    transition: 'all 0.2s ease',
  },
  xrRoomActive: {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  xrRoomIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  xrRoomName: {
    fontSize: '12px',
    fontWeight: 600,
    color: COLORS.textPrimary,
  },
  xrRoomObjects: {
    fontSize: '10px',
    color: COLORS.textMuted,
    marginTop: '4px',
  },
  portalArrow: {
    fontSize: '24px',
    color: COLORS.cenoteTurquoise,
  },
  processGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
  },
  processCard: {
    padding: '16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    borderLeft: '4px solid',
  },
  processActive: {
    borderLeftColor: COLORS.jungleEmerald,
  },
  processPending: {
    borderLeftColor: COLORS.ancientStone,
  },
  processName: {
    fontSize: '13px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    marginBottom: '4px',
  },
  processType: {
    fontSize: '11px',
    color: COLORS.textMuted,
  },
  processStatus: {
    fontSize: '10px',
    marginTop: '8px',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-block',
  },
  statusActive: {
    backgroundColor: `${COLORS.jungleEmerald}30`,
    color: COLORS.jungleEmerald,
  },
  statusPending: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: COLORS.textMuted,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
  },
  button: {
    padding: '14px 28px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  buttonPrimary: {
    backgroundColor: COLORS.cenoteTurquoise,
    color: COLORS.uiSlate,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: COLORS.textSecondary,
  },
  footer: {
    marginTop: '40px',
    padding: '24px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '12px',
    color: COLORS.textMuted,
    lineHeight: 1.6,
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
    marginTop: '16px',
  },
};

// ============================================================
// DEMO DATA
// ============================================================

interface DemoInfo {
  id: string;
  name: string;
  version: string;
  description: string;
  sphere: 'Creative' | 'Business';
  domain: string;
  icon: string;
  features: string[];
  stats: { label: string; value: number | string }[];
  xrRooms?: { name: string; icon: string; objects: number; color: string }[];
  processes?: { name: string; type: string; status: 'active' | 'pending' }[];
}

const DEMOS: DemoInfo[] = [
  {
    id: 'architecture_v1',
    name: 'Architecture Workspace v1',
    version: '1.0.0',
    description: 'Basic architectural workspace with WorkSurface, DataSpaces, and single XR scene. Perfect for simple concept development.',
    sphere: 'Creative',
    domain: 'Architecture',
    icon: '🏛️',
    features: [
      'Project Workspace',
      '3 DataSpaces (Notes, Resources, Archive)',
      'Architecture WorkSurface Profile',
      'Single XR Scene (4 sectors)',
      'Assisted Input Processing',
    ],
    stats: [
      { label: 'XR Rooms', value: 1 },
      { label: 'DataSpaces', value: 3 },
      { label: 'Sectors', value: 4 },
    ],
    xrRooms: [
      { name: 'Architecture Room', icon: '🏛️', objects: 4, color: COLORS.cenoteTurquoise },
    ],
  },
  {
    id: 'architecture_universe_v2',
    name: 'Architecture XR Universe v2',
    version: '2.0.0',
    description: 'Multi-room XR Universe with portal navigation. Follow the complete architectural flow from Concept to Final Layout.',
    sphere: 'Creative',
    domain: 'Architecture',
    icon: '🌀',
    features: [
      '5-Room XR Universe',
      'Portal Navigation (8 portals)',
      'Navigation Map',
      'Linear Design Flow',
      'Comprehensive Sectors',
    ],
    stats: [
      { label: 'XR Rooms', value: 5 },
      { label: 'Portals', value: 8 },
      { label: 'Objects', value: '35+' },
    ],
    xrRooms: [
      { name: 'Concept', icon: '💡', objects: 6, color: '#9C27B0' },
      { name: 'Blueprint', icon: '📐', objects: 8, color: COLORS.cenoteTurquoise },
      { name: 'Zoning', icon: '◻️', objects: 9, color: COLORS.jungleEmerald },
      { name: 'Structural', icon: '🔗', objects: 9, color: COLORS.earthEmber },
      { name: 'Layout', icon: '🎯', objects: 9, color: COLORS.sacredGold },
    ],
  },
  {
    id: 'business_architecture',
    name: 'Business + Architecture',
    version: '1.0.0',
    description: 'Construction project combining Business sphere with Architecture domain. Includes processes, tools, and enterprise DataSpaces.',
    sphere: 'Business',
    domain: 'Architecture & Construction',
    icon: '🏗️',
    features: [
      '3 Industrial XR Rooms',
      '4 Enterprise DataSpaces',
      '5 Business Processes',
      '6 Project Tools',
      'Phase & Timeline Management',
    ],
    stats: [
      { label: 'XR Rooms', value: 3 },
      { label: 'Processes', value: 5 },
      { label: 'Tools', value: 6 },
    ],
    xrRooms: [
      { name: 'Industrial', icon: '🏭', objects: 13, color: COLORS.ancientStone },
      { name: 'Overview', icon: '📊', objects: 12, color: COLORS.sacredGold },
      { name: 'Management', icon: '📋', objects: 9, color: COLORS.cenoteTurquoise },
    ],
    processes: [
      { name: 'Budget Planning', type: 'Financial', status: 'active' },
      { name: 'Resource Allocation', type: 'Planning', status: 'active' },
      { name: 'Timeline Management', type: 'Scheduling', status: 'active' },
      { name: 'Risk Assessment', type: 'Analysis', status: 'pending' },
      { name: 'Quality Control', type: 'Compliance', status: 'pending' },
    ],
  },
];

// ============================================================
// COMPONENT
// ============================================================

export const MegaDemoPackUI: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<string>('architecture_universe_v2');
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const currentDemo = useMemo(() => {
    return DEMOS.find(d => d.id === selectedDemo);
  }, [selectedDemo]);

  const handleRunDemo = useCallback(() => {
    logger.debug('Running demo:', selectedDemo);
    // In real implementation, this would trigger the demo
    alert(`Demo "${currentDemo?.name}" would be executed here.\n\nThis is a UI preview only.`);
  }, [selectedDemo, currentDemo]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🚀</span>
            <span style={styles.logoText}>CHE·NU Mega Demo Pack</span>
          </div>
          <p style={styles.subtitle}>
            Complete demo suite: XR Universe + Business & Construction Integration
          </p>
          <div style={styles.badges}>
            <span style={{ ...styles.badge, ...styles.badgeSafe }}>🛡️ Safe</span>
            <span style={{ ...styles.badge, ...styles.badgeV2 }}>v2.0</span>
            <span style={{ ...styles.badge, ...styles.badgeMega }}>Mega Pack</span>
          </div>
        </header>

        {/* Demo Grid */}
        <div style={styles.demoGrid}>
          {DEMOS.map(demo => (
            <div
              key={demo.id}
              style={{
                ...styles.demoCard,
                ...(selectedDemo === demo.id ? styles.demoCardSelected : {}),
              }}
              onClick={() => setSelectedDemo(demo.id)}
            >
              <div style={styles.demoCardHeader}>
                <span style={styles.demoIcon}>{demo.icon}</span>
                <div style={styles.demoInfo}>
                  <div style={styles.demoName}>{demo.name}</div>
                  <div style={styles.demoVersion}>v{demo.version}</div>
                </div>
                <span
                  style={{
                    ...styles.demoSphere,
                    ...(demo.sphere === 'Creative' ? styles.sphereCreative : styles.sphereBusiness),
                  }}
                >
                  {demo.sphere}
                </span>
              </div>
              <div style={styles.demoBody}>
                <div style={styles.demoDesc}>{demo.description}</div>
                <div style={styles.featureList}>
                  {demo.features.slice(0, 4).map((feature, i) => (
                    <div key={i} style={styles.featureItem}>
                      <span style={styles.featureIcon}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.demoStats}>
                  {demo.stats.map((stat, i) => (
                    <div key={i} style={styles.statItem}>
                      <div style={styles.statValue}>{stat.value}</div>
                      <div style={styles.statLabel}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview Panel */}
        {currentDemo && (
          <div style={styles.previewPanel}>
            <div style={styles.previewHeader}>
              <div style={styles.previewTitle}>
                <span>{currentDemo.icon}</span>
                <span>{currentDemo.name} Preview</span>
              </div>
              <span style={{ fontSize: '12px', color: COLORS.textMuted }}>
                Domain: {currentDemo.domain}
              </span>
            </div>
            <div style={styles.previewContent}>
              {/* XR Room Map */}
              {currentDemo.xrRooms && (
                <div style={styles.xrMapContainer}>
                  <div style={{ fontSize: '14px', color: COLORS.textMuted, marginBottom: '10px' }}>
                    🌀 XR Room Navigation
                  </div>
                  <div style={styles.xrMap}>
                    {currentDemo.xrRooms.map((room, i) => (
                      <React.Fragment key={room.name}>
                        <div
                          style={{
                            ...styles.xrRoom,
                            borderColor: room.color,
                            backgroundColor: `${room.color}15`,
                            ...(hoveredRoom === room.name ? styles.xrRoomActive : {}),
                          }}
                          onMouseEnter={() => setHoveredRoom(room.name)}
                          onMouseLeave={() => setHoveredRoom(null)}
                        >
                          <div style={styles.xrRoomIcon}>{room.icon}</div>
                          <div style={styles.xrRoomName}>{room.name}</div>
                          <div style={styles.xrRoomObjects}>{room.objects} objects</div>
                        </div>
                        {i < currentDemo.xrRooms!.length - 1 && currentDemo.xrRooms!.length > 2 && (
                          <span style={styles.portalArrow}>→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Processes (Business Demo) */}
              {currentDemo.processes && (
                <div style={{ marginTop: '30px' }}>
                  <div style={{ fontSize: '14px', color: COLORS.textMuted, marginBottom: '16px' }}>
                    🔄 Business Processes
                  </div>
                  <div style={styles.processGrid}>
                    {currentDemo.processes.map(process => (
                      <div
                        key={process.name}
                        style={{
                          ...styles.processCard,
                          ...(process.status === 'active' ? styles.processActive : styles.processPending),
                        }}
                      >
                        <div style={styles.processName}>{process.name}</div>
                        <div style={styles.processType}>{process.type}</div>
                        <span
                          style={{
                            ...styles.processStatus,
                            ...(process.status === 'active' ? styles.statusActive : styles.statusPending),
                          }}
                        >
                          {process.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={handleRunDemo}
          >
            🚀 Run Demo
          </button>
          <button style={{ ...styles.button, ...styles.buttonSecondary }}>
            📖 View Documentation
          </button>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerText}>
            ⚠️ All demos are CONCEPTUAL REPRESENTATIONS ONLY.<br />
            Not intended for real construction, engineering, or financial decisions.<br />
            Consult licensed professionals for actual work.
          </div>
          <div style={styles.safetyBadge}>
            🛡️ SAFE · SYMBOLIC · NON-AUTONOMOUS
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MegaDemoPackUI;
