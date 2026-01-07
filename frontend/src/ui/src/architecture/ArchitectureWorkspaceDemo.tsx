/**
 * ============================================================
 * CHE·NU — ARCHITECTURAL WORKSPACE DEMO UI v1
 * Complete Interactive Demo Page
 * SAFE · CONCEPTUAL · NON-AUTONOMOUS
 * ============================================================
 */

import React, { useState, useCallback, useEffect } from 'react';

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
    padding: '24px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: COLORS.textPrimary,
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  logoIcon: {
    fontSize: '36px',
  },
  logoText: {
    fontSize: '28px',
    fontWeight: 700,
    background: `linear-gradient(135deg, ${COLORS.sacredGold}, ${COLORS.cenoteTurquoise})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '14px',
    color: COLORS.textMuted,
  },
  badges: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '12px',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  badgeSafe: {
    backgroundColor: `${COLORS.jungleEmerald}30`,
    color: COLORS.jungleEmerald,
  },
  badgeDemo: {
    backgroundColor: `${COLORS.cenoteTurquoise}30`,
    color: COLORS.cenoteTurquoise,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr 320px',
    gap: '20px',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    fontSize: '12px',
  },
  infoLabel: {
    color: COLORS.textMuted,
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontWeight: 500,
  },
  dataspaceCard: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '10px',
  },
  dataspaceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  dataspaceName: {
    fontSize: '12px',
    fontWeight: 600,
  },
  dataspaceType: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: COLORS.textMuted,
  },
  dataspaceEntries: {
    fontSize: '10px',
    color: COLORS.textMuted,
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  worksurfaceShell: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.borderColor}`,
    overflow: 'hidden',
    flex: 1,
  },
  wsHeader: {
    padding: '12px 16px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wsProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  wsProfileBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: `${COLORS.sacredGold}20`,
    border: `1px solid ${COLORS.sacredGold}40`,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  wsProfileIcon: {
    fontSize: '14px',
  },
  wsProfileName: {
    fontSize: '12px',
    fontWeight: 600,
    color: COLORS.sacredGold,
  },
  wsModeBadge: {
    padding: '4px 10px',
    borderRadius: '4px',
    backgroundColor: `${COLORS.cenoteTurquoise}20`,
    color: COLORS.cenoteTurquoise,
    fontSize: '10px',
    fontWeight: 600,
  },
  wsModes: {
    padding: '10px 16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  modeTab: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: COLORS.textMuted,
  },
  modeTabActive: {
    backgroundColor: COLORS.cenoteTurquoise,
    color: COLORS.uiSlate,
  },
  modeTabPrimary: {
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: COLORS.sacredGold,
  },
  wsContent: {
    padding: '20px',
    minHeight: '400px',
    overflow: 'auto',
  },
  diagramContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  diagramNodes: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
  },
  diagramNode: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '2px solid',
    textAlign: 'center',
    minWidth: '120px',
  },
  nodeRoom: {
    backgroundColor: 'rgba(62,180,162,0.15)',
    borderColor: COLORS.cenoteTurquoise,
  },
  nodeZone: {
    backgroundColor: 'rgba(63,114,73,0.15)',
    borderColor: COLORS.jungleEmerald,
  },
  nodeCirculation: {
    backgroundColor: 'rgba(216,178,106,0.15)',
    borderColor: COLORS.sacredGold,
  },
  nodeLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: COLORS.textPrimary,
  },
  nodeType: {
    fontSize: '10px',
    color: COLORS.textMuted,
    marginTop: '4px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
  },
  tableHeader: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    textAlign: 'left',
  },
  th: {
    padding: '10px 12px',
    fontWeight: 600,
    color: COLORS.textSecondary,
    borderBottom: `1px solid ${COLORS.borderColor}`,
  },
  td: {
    padding: '10px 12px',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    color: COLORS.textPrimary,
  },
  textContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  textBlock: {
    padding: '10px 14px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    fontSize: '12px',
    color: COLORS.textSecondary,
    borderLeft: `3px solid ${COLORS.ancientStone}`,
  },
  wsFooter: {
    padding: '10px 16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTop: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '10px',
    color: COLORS.textMuted,
  },
  safetyBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: `${COLORS.jungleEmerald}20`,
    border: `1px solid ${COLORS.jungleEmerald}`,
    borderRadius: '4px',
    color: COLORS.jungleEmerald,
    fontSize: '9px',
    fontWeight: 600,
  },
  xrPanel: {
    marginTop: '16px',
  },
  xrContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '8px',
    minHeight: '200px',
  },
  xrSector: {
    backgroundColor: 'rgba(0,188,212,0.1)',
    border: `1px solid rgba(0,188,212,0.3)`,
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  xrSectorHover: {
    backgroundColor: 'rgba(0,188,212,0.2)',
    borderColor: '#00BCD4',
  },
  xrSectorIcon: {
    fontSize: '20px',
    marginBottom: '6px',
  },
  xrSectorName: {
    fontSize: '10px',
    fontWeight: 500,
    color: COLORS.textSecondary,
  },
  inputPanel: {
    marginTop: '16px',
  },
  inputHistory: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  inputEntry: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    padding: '10px 12px',
    borderLeft: '3px solid',
  },
  inputSpatial: {
    borderLeftColor: COLORS.cenoteTurquoise,
  },
  inputZoning: {
    borderLeftColor: COLORS.jungleEmerald,
  },
  inputText: {
    borderLeftColor: COLORS.ancientStone,
  },
  inputContent: {
    fontSize: '11px',
    color: COLORS.textSecondary,
    marginBottom: '6px',
  },
  inputMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '9px',
  },
  inputTag: {
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  adaptationTag: {
    backgroundColor: `${COLORS.cenoteTurquoise}30`,
    color: COLORS.cenoteTurquoise,
  },
  templateList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  templateItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '6px',
    fontSize: '11px',
  },
  templateIcon: {
    fontSize: '14px',
  },
  templateName: {
    flex: 1,
    color: COLORS.textSecondary,
  },
  templateStatus: {
    fontSize: '9px',
    color: COLORS.jungleEmerald,
  },
  footer: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.borderColor}`,
    textAlign: 'center',
  },
  footerDisclaimer: {
    fontSize: '11px',
    color: COLORS.textMuted,
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: 1.5,
  },
};

// ============================================================
// DEMO DATA TYPES
// ============================================================

interface DemoNode {
  id: string;
  label: string;
  type: 'room' | 'zone' | 'circulation';
}

interface DemoTableRow {
  element: string;
  dimensions: string;
  notes: string;
}

interface DemoInput {
  id: string;
  content: string;
  type: 'spatial_dimensions' | 'zoning' | 'text';
  adapted: boolean;
}

interface DemoSector {
  id: string;
  name: string;
  icon: string;
  position: number;
}

// ============================================================
// DEMO DATA
// ============================================================

const DEMO_NODES: DemoNode[] = [
  { id: 'room_a', label: 'Room A (12×8m)', type: 'room' },
  { id: 'room_b', label: 'Room B (10×10m)', type: 'room' },
  { id: 'corridor', label: 'Corridor (3m width)', type: 'circulation' },
  { id: 'zone_public', label: 'Zone A: Public Zone', type: 'zone' },
  { id: 'zone_private', label: 'Zone B: Private Zone', type: 'zone' },
  { id: 'zone_circulation', label: 'Zone C: Circulation Zone', type: 'zone' },
];

const DEMO_TABLE: DemoTableRow[] = [
  { element: 'Room A', dimensions: '12m x 8m', notes: '' },
  { element: 'Room B', dimensions: '10m x 10m', notes: '' },
  { element: 'Corridor', dimensions: '3m width', notes: 'circulation flow important' },
];

const DEMO_TEXT = [
  '- Room A: 12m x 8m',
  '- Room B: 10m x 10m',
  '- Corridor: 3m width',
  '- Notes: circulation flow important',
  'Zoning: A = public zone, B = private zone, C = circulation zone',
  'Natural light should reach all main rooms. Entry through corridor.',
];

const DEMO_INPUTS: DemoInput[] = [
  { id: '1', content: 'Room A: 12m x 8m, Room B: 10m x 10m, Corridor: 3m width', type: 'spatial_dimensions', adapted: true },
  { id: '2', content: 'Zoning: A = public zone, B = private zone, C = circulation zone', type: 'zoning', adapted: true },
  { id: '3', content: 'Natural light should reach all main rooms. Entry through corridor.', type: 'text', adapted: false },
];

const DEMO_SECTORS: DemoSector[] = [
  { id: 's1', name: 'Blueprint Wall', icon: '📐', position: 1 },
  { id: 's2', name: 'Zoning Grid', icon: '◻️', position: 3 },
  { id: 's3', name: 'Structural Diagram', icon: '🔗', position: 5 },
  { id: 's4', name: 'XR Layout', icon: '🌀', position: 4 },
];

const DEMO_TEMPLATES = [
  { id: 't1', name: 'Blueprint Structure', kind: 'document', icon: '📐' },
  { id: 't2', name: 'Zoning Diagram', kind: 'diagram', icon: '◻️' },
  { id: 't3', name: 'Floor Grid', kind: 'table', icon: '📏' },
  { id: 't4', name: 'Project Brief', kind: 'document', icon: '📋' },
];

// ============================================================
// COMPONENT
// ============================================================

type Mode = 'diagram' | 'table' | 'text' | 'xr_layout' | 'summary';

const MODE_ICONS: Record<Mode, string> = {
  diagram: '📊',
  table: '📋',
  text: '📝',
  xr_layout: '🌀',
  summary: '📄',
};

export const ArchitectureWorkspaceDemo: React.FC = () => {
  const [activeMode, setActiveMode] = useState<Mode>('diagram');
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  // Render content based on mode
  const renderContent = () => {
    switch (activeMode) {
      case 'diagram':
        return (
          <div style={styles.diagramContainer}>
            <div style={{ textAlign: 'center', fontSize: '12px', color: COLORS.textMuted, marginBottom: '10px' }}>
              Conceptual Spatial Diagram
            </div>
            <div style={styles.diagramNodes}>
              {DEMO_NODES.map(node => (
                <div
                  key={node.id}
                  style={{
                    ...styles.diagramNode,
                    ...(node.type === 'room' ? styles.nodeRoom : 
                        node.type === 'zone' ? styles.nodeZone : styles.nodeCirculation),
                  }}
                >
                  <div style={styles.nodeLabel}>{node.label}</div>
                  <div style={styles.nodeType}>{node.type}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'table':
        return (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>Element</th>
                  <th style={styles.th}>Dimensions</th>
                  <th style={styles.th}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_TABLE.map((row, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{row.element}</td>
                    <td style={styles.td}>{row.dimensions}</td>
                    <td style={styles.td}>{row.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'text':
        return (
          <div style={styles.textContent}>
            {DEMO_TEXT.map((text, i) => (
              <div key={i} style={styles.textBlock}>{text}</div>
            ))}
          </div>
        );

      case 'xr_layout':
        return (
          <div style={styles.xrContainer}>
            {Array.from({ length: 9 }).map((_, i) => {
              const sector = DEMO_SECTORS.find(s => s.position === i);
              if (!sector) return <div key={i} />;
              
              return (
                <div
                  key={sector.id}
                  style={{
                    ...styles.xrSector,
                    ...(hoveredSector === sector.id ? styles.xrSectorHover : {}),
                  }}
                  onMouseEnter={() => setHoveredSector(sector.id)}
                  onMouseLeave={() => setHoveredSector(null)}
                >
                  <div style={styles.xrSectorIcon}>{sector.icon}</div>
                  <div style={styles.xrSectorName}>{sector.name}</div>
                </div>
              );
            })}
          </div>
        );

      case 'summary':
        return (
          <div style={{ fontSize: '12px', color: COLORS.textSecondary, lineHeight: 1.6 }}>
            <h3 style={{ color: COLORS.textPrimary, marginBottom: '12px' }}>Architectural Concept Summary</h3>
            
            <h4 style={{ color: COLORS.cenoteTurquoise, marginTop: '16px', marginBottom: '8px' }}>Spaces</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Room A (12×8m)</li>
              <li>Room B (10×10m)</li>
              <li>Corridor (3m width)</li>
            </ul>
            
            <h4 style={{ color: COLORS.jungleEmerald, marginTop: '16px', marginBottom: '8px' }}>Zoning</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Zone A: Public Zone</li>
              <li>Zone B: Private Zone</li>
              <li>Zone C: Circulation Zone</li>
            </ul>
            
            <h4 style={{ color: COLORS.sacredGold, marginTop: '16px', marginBottom: '8px' }}>Notes</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Natural light should reach all main rooms</li>
              <li>Entry through corridor</li>
              <li>Circulation flow is important</li>
            </ul>
            
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgba(255,152,0,0.1)', borderRadius: '6px', fontSize: '10px', color: COLORS.textMuted }}>
              ⚠️ This is a conceptual representation only. Not for construction.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🏗️</span>
            <span style={styles.logoText}>CHE·NU Architecture Demo</span>
          </div>
          <p style={styles.subtitle}>
            Complete demo: Project Workspace + DataSpaces + WorkSurface + XR Scene
          </p>
          <div style={styles.badges}>
            <span style={{ ...styles.badge, ...styles.badgeSafe }}>🛡️ Safe</span>
            <span style={{ ...styles.badge, ...styles.badgeDemo }}>🎮 Demo v1</span>
          </div>
        </header>

        {/* Main Grid */}
        <div style={styles.mainGrid}>
          {/* Left Sidebar */}
          <div style={styles.sidebar}>
            {/* Workspace Info */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelIcon}>📁</span>
                <span style={styles.panelTitle}>Workspace</span>
              </div>
              <div style={styles.panelContent}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Domain</span>
                  <span style={styles.infoValue}>Architecture</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Sphere</span>
                  <span style={styles.infoValue}>Creative</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Mode</span>
                  <span style={styles.infoValue}>Project</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Control</span>
                  <span style={styles.infoValue}>Assisted</span>
                </div>
              </div>
            </div>

            {/* DataSpaces */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelIcon}>💾</span>
                <span style={styles.panelTitle}>DataSpaces</span>
              </div>
              <div style={styles.panelContent}>
                <div style={styles.dataspaceCard}>
                  <div style={styles.dataspaceHeader}>
                    <span>📝</span>
                    <span style={styles.dataspaceName}>Notes</span>
                    <span style={styles.dataspaceType}>notes</span>
                  </div>
                  <div style={styles.dataspaceEntries}>2 entries</div>
                </div>
                <div style={styles.dataspaceCard}>
                  <div style={styles.dataspaceHeader}>
                    <span>📚</span>
                    <span style={styles.dataspaceName}>Resources</span>
                    <span style={styles.dataspaceType}>resources</span>
                  </div>
                  <div style={styles.dataspaceEntries}>2 entries</div>
                </div>
                <div style={styles.dataspaceCard}>
                  <div style={styles.dataspaceHeader}>
                    <span>🗄</span>
                    <span style={styles.dataspaceName}>Archive</span>
                    <span style={styles.dataspaceType}>archive</span>
                  </div>
                  <div style={styles.dataspaceEntries}>1 entry</div>
                </div>
              </div>
            </div>

            {/* Templates */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelIcon}>📄</span>
                <span style={styles.panelTitle}>Templates Loaded</span>
              </div>
              <div style={styles.panelContent}>
                <div style={styles.templateList}>
                  {DEMO_TEMPLATES.map(t => (
                    <div key={t.id} style={styles.templateItem}>
                      <span style={styles.templateIcon}>{t.icon}</span>
                      <span style={styles.templateName}>{t.name}</span>
                      <span style={styles.templateStatus}>✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={styles.mainContent}>
            <div style={styles.worksurfaceShell}>
              {/* WS Header */}
              <div style={styles.wsHeader}>
                <div style={styles.wsProfile}>
                  <div style={styles.wsProfileBadge}>
                    <span style={styles.wsProfileIcon}>🏛️</span>
                    <span style={styles.wsProfileName}>Architecture Profile</span>
                  </div>
                  <span style={styles.wsModeBadge}>✨ Active</span>
                </div>
              </div>

              {/* Modes */}
              <div style={styles.wsModes}>
                {(['diagram', 'table', 'text', 'xr_layout', 'summary'] as Mode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    style={{
                      ...styles.modeTab,
                      ...(activeMode === mode ? styles.modeTabActive : {}),
                      ...(mode === 'diagram' ? styles.modeTabPrimary : {}),
                    }}
                  >
                    <span>{MODE_ICONS[mode]}</span>
                    <span>{mode.replace('_', ' ')}</span>
                    {mode === 'diagram' && <span>★</span>}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div style={styles.wsContent}>
                {renderContent()}
              </div>

              {/* Footer */}
              <div style={styles.wsFooter}>
                <span>Mode: {activeMode} | Profile: Architecture</span>
                <div style={styles.safetyBadge}>
                  🛡️ SAFE · CONCEPTUAL
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={styles.sidebar}>
            {/* Input History */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelIcon}>📥</span>
                <span style={styles.panelTitle}>Input History</span>
              </div>
              <div style={styles.panelContent}>
                <div style={styles.inputHistory}>
                  {DEMO_INPUTS.map(input => (
                    <div
                      key={input.id}
                      style={{
                        ...styles.inputEntry,
                        ...(input.type === 'spatial_dimensions' ? styles.inputSpatial :
                            input.type === 'zoning' ? styles.inputZoning : styles.inputText),
                      }}
                    >
                      <div style={styles.inputContent}>{input.content}</div>
                      <div style={styles.inputMeta}>
                        <span style={styles.inputTag}>{input.type}</span>
                        {input.adapted && (
                          <span style={{ ...styles.inputTag, ...styles.adaptationTag }}>✓ adapted</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* XR Scene Info */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelIcon}>🌀</span>
                <span style={styles.panelTitle}>XR Scene</span>
              </div>
              <div style={styles.panelContent}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Preset</span>
                  <span style={styles.infoValue}>architectureRoom</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Sectors</span>
                  <span style={styles.infoValue}>4</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Objects</span>
                  <span style={styles.infoValue}>4</span>
                </div>
                <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {DEMO_SECTORS.map(s => (
                    <span
                      key={s.id}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'rgba(0,188,212,0.2)',
                        borderRadius: '4px',
                        fontSize: '10px',
                        color: COLORS.textSecondary,
                      }}
                    >
                      {s.icon} {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <footer style={styles.footer}>
          <div style={styles.footerDisclaimer}>
            ⚠️ <strong>IMPORTANT:</strong> This is a CONCEPTUAL REPRESENTATION ONLY. 
            All outputs are symbolic and representational, for cognitive design and ideation only. 
            NOT intended for real construction, engineering decisions, or as a replacement for professional architectural services. 
            Consult licensed professionals for actual architectural and engineering work.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ArchitectureWorkspaceDemo;
