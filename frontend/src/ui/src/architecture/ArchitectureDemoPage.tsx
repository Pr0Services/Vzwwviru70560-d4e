/**
 * ============================================================
 * CHE·NU — ARCHITECTURE DEMO PAGE
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Demo page for creating and exploring architectural workspaces.
 */

import React, { useState, useCallback } from 'react';

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
    padding: '40px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: COLORS.textPrimary,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center',
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
    fontSize: '32px',
    fontWeight: 700,
    background: `linear-gradient(135deg, ${COLORS.sacredGold}, ${COLORS.cenoteTurquoise})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '16px',
    color: COLORS.textMuted,
    marginBottom: '24px',
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
    letterSpacing: '0.5px',
  },
  badgeSafe: {
    backgroundColor: `${COLORS.jungleEmerald}30`,
    color: COLORS.jungleEmerald,
    border: `1px solid ${COLORS.jungleEmerald}`,
  },
  badgeSymbolic: {
    backgroundColor: `${COLORS.cenoteTurquoise}30`,
    color: COLORS.cenoteTurquoise,
    border: `1px solid ${COLORS.cenoteTurquoise}`,
  },
  badgeNonAuto: {
    backgroundColor: `${COLORS.sacredGold}30`,
    color: COLORS.sacredGold,
    border: `1px solid ${COLORS.sacredGold}`,
  },
  scenarioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  scenarioCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '16px',
    border: `2px solid ${COLORS.borderColor}`,
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  scenarioCardHover: {
    borderColor: COLORS.sacredGold,
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
  },
  scenarioCardSelected: {
    borderColor: COLORS.cenoteTurquoise,
    boxShadow: `0 0 0 3px ${COLORS.cenoteTurquoise}30`,
  },
  scenarioIcon: {
    fontSize: '40px',
    marginBottom: '16px',
  },
  scenarioName: {
    fontSize: '18px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    marginBottom: '8px',
  },
  scenarioDesc: {
    fontSize: '13px',
    color: COLORS.textMuted,
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  scenarioMeta: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  metaTag: {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '10px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: COLORS.textSecondary,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '40px',
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
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  resultPanel: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '16px',
    border: `1px solid ${COLORS.borderColor}`,
    padding: '24px',
    marginTop: '24px',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${COLORS.borderColor}`,
  },
  resultTitle: {
    fontSize: '16px',
    fontWeight: 600,
  },
  resultSuccess: {
    padding: '4px 10px',
    borderRadius: '4px',
    backgroundColor: `${COLORS.jungleEmerald}30`,
    color: COLORS.jungleEmerald,
    fontSize: '11px',
    fontWeight: 600,
  },
  resultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  resultItem: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    padding: '16px',
  },
  resultLabel: {
    fontSize: '10px',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  resultValue: {
    fontSize: '13px',
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  footer: {
    textAlign: 'center',
    padding: '40px 0',
    borderTop: `1px solid ${COLORS.borderColor}`,
    marginTop: '40px',
  },
  footerText: {
    fontSize: '12px',
    color: COLORS.textMuted,
  },
};

// ============================================================
// TYPES
// ============================================================

interface DemoScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
}

interface DemoResult {
  workspaceId: string;
  workspaceName: string;
  dataspaceCount: number;
  worksurfaceId: string;
  xrSceneId: string;
  hasUniverse: boolean;
}

// ============================================================
// DEMO SCENARIOS
// ============================================================

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'minimal',
    name: 'Minimal Architecture',
    description: 'Basic workspace with dataspaces and worksurface. Perfect for quick conceptual work.',
    icon: '⚡',
    tags: ['quick', 'basic', '2 rooms'],
  },
  {
    id: 'full',
    name: 'Full Architecture Hub',
    description: 'Complete setup with XR hub universe. Central concept room + satellite rooms.',
    icon: '🏛️',
    tags: ['complete', 'hub', '5 rooms'],
  },
  {
    id: 'linear',
    name: 'Linear Workflow',
    description: 'Sequential flow: Concept → Zoning → Structure → Layout → Final.',
    icon: '📐',
    tags: ['workflow', 'linear', '5 rooms'],
  },
  {
    id: 'business',
    name: 'Business Project',
    description: 'Business-oriented configuration for architecture & construction projects.',
    icon: '🏗️',
    tags: ['business', 'construction'],
  },
];

// ============================================================
// COMPONENT
// ============================================================

export const ArchitectureDemoPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Handle scenario selection
  const handleScenarioSelect = useCallback((id: string) => {
    setSelectedScenario(selectedScenario === id ? null : id);
    setResult(null);
  }, [selectedScenario]);

  // Create demo workspace
  const handleCreateDemo = useCallback(async () => {
    if (!selectedScenario) return;

    setIsCreating(true);

    // Simulate creation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock result
    const timestamp = Date.now().toString(36);
    const scenario = DEMO_SCENARIOS.find(s => s.id === selectedScenario);
    const hasUniverse = ['full', 'linear'].includes(selectedScenario);

    setResult({
      workspaceId: `ws_${timestamp}`,
      workspaceName: scenario?.name || 'Demo Workspace',
      dataspaceCount: 4,
      worksurfaceId: `wsurf_${timestamp}`,
      xrSceneId: `scene_${timestamp}`,
      hasUniverse,
    });

    setIsCreating(false);
  }, [selectedScenario]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🏛️</span>
            <span style={styles.logoText}>CHE·NU Architecture Demo</span>
          </div>
          <p style={styles.subtitle}>
            Create a complete architectural workspace with integrated XR, WorkSurface, and DataSpaces
          </p>
          <div style={styles.badges}>
            <span style={{ ...styles.badge, ...styles.badgeSafe }}>🛡️ Safe</span>
            <span style={{ ...styles.badge, ...styles.badgeSymbolic }}>◻️ Symbolic</span>
            <span style={{ ...styles.badge, ...styles.badgeNonAuto }}>🔒 Non-Autonomous</span>
          </div>
        </header>

        {/* Scenario Selection */}
        <div style={styles.scenarioGrid}>
          {DEMO_SCENARIOS.map(scenario => (
            <div
              key={scenario.id}
              style={{
                ...styles.scenarioCard,
                ...(hoveredScenario === scenario.id ? styles.scenarioCardHover : {}),
                ...(selectedScenario === scenario.id ? styles.scenarioCardSelected : {}),
              }}
              onClick={() => handleScenarioSelect(scenario.id)}
              onMouseEnter={() => setHoveredScenario(scenario.id)}
              onMouseLeave={() => setHoveredScenario(null)}
            >
              <div style={styles.scenarioIcon}>{scenario.icon}</div>
              <div style={styles.scenarioName}>{scenario.name}</div>
              <div style={styles.scenarioDesc}>{scenario.description}</div>
              <div style={styles.scenarioMeta}>
                {scenario.tags.map(tag => (
                  <span key={tag} style={styles.metaTag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              ...((!selectedScenario || isCreating) ? styles.buttonDisabled : {}),
            }}
            onClick={handleCreateDemo}
            disabled={!selectedScenario || isCreating}
          >
            {isCreating ? (
              <>🔄 Creating...</>
            ) : (
              <>🚀 Create Demo Workspace</>
            )}
          </button>
          <button style={{ ...styles.button, ...styles.buttonSecondary }}>
            📖 View Documentation
          </button>
        </div>

        {/* Result Panel */}
        {result && (
          <div style={styles.resultPanel}>
            <div style={styles.resultHeader}>
              <span style={{ fontSize: '24px' }}>✅</span>
              <span style={styles.resultTitle}>{result.workspaceName} Created</span>
              <span style={styles.resultSuccess}>SUCCESS</span>
            </div>
            <div style={styles.resultGrid}>
              <div style={styles.resultItem}>
                <div style={styles.resultLabel}>Workspace ID</div>
                <div style={styles.resultValue}>{result.workspaceId}</div>
              </div>
              <div style={styles.resultItem}>
                <div style={styles.resultLabel}>WorkSurface ID</div>
                <div style={styles.resultValue}>{result.worksurfaceId}</div>
              </div>
              <div style={styles.resultItem}>
                <div style={styles.resultLabel}>XR Scene ID</div>
                <div style={styles.resultValue}>{result.xrSceneId}</div>
              </div>
              <div style={styles.resultItem}>
                <div style={styles.resultLabel}>DataSpaces</div>
                <div style={styles.resultValue}>{result.dataspaceCount} created</div>
              </div>
              <div style={styles.resultItem}>
                <div style={styles.resultLabel}>XR Universe</div>
                <div style={styles.resultValue}>
                  {result.hasUniverse ? '✅ Included' : '❌ Not included'}
                </div>
              </div>
              <div style={styles.resultItem}>
                <div style={styles.resultLabel}>Profile</div>
                <div style={styles.resultValue}>Architecture</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            CHE·NU Architecture Integration v1.0 — All outputs are symbolic and conceptual only.
            <br />
            Not intended for real construction, engineering, or structural decisions.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ArchitectureDemoPage;
