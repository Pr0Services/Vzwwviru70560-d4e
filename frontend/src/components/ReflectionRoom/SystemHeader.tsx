/**
 * CHE·NU V51 — SYSTEM HEADER
 * ==========================
 * 
 * Nova visibility only - no interaction.
 * Shows system status, cognitive load indicator, navigation.
 */

import React from 'react';
import { CognitiveLoadSignals, LoadState } from '../../stores/CognitiveLoadSignals';

export interface SystemHeaderProps {
  uiMode: 'light' | 'dark_strict' | 'incident';
  cognitiveLoad: CognitiveLoadSignals;
  onNavigateToModule?: (moduleId: string) => void;
}

const SystemHeader: React.FC<SystemHeaderProps> = ({
  uiMode,
  cognitiveLoad,
  onNavigateToModule
}) => {
  return (
    <header style={getHeaderStyles(uiMode)}>
      {/* Logo / Brand */}
      <div style={styles.brand}>
        <span style={styles.logo}>CHE·NU</span>
        <span style={styles.version}>V51</span>
      </div>

      {/* Module Title */}
      <div style={styles.moduleTitle}>
        <span style={styles.moduleName}>Reflection Room</span>
        <span style={styles.moduleDesc}>Cognitive Workspace</span>
      </div>

      {/* Nova Status - Visibility Only */}
      <div style={styles.novaStatus}>
        <NovaIndicator uiMode={uiMode} />
      </div>

      {/* Cognitive Load Indicator */}
      <div style={styles.cognitiveLoad}>
        <CognitiveLoadIndicator 
          loadState={cognitiveLoad.load_state}
          warnings={cognitiveLoad.warnings.length}
          uiMode={uiMode}
        />
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <NavButton 
          label="Memory" 
          onClick={() => onNavigateToModule?.('memory_inspector')}
          uiMode={uiMode}
        />
        <NavButton 
          label="Agents" 
          onClick={() => onNavigateToModule?.('agent_workspace')}
          uiMode={uiMode}
        />
        <NavButton 
          label="Admin" 
          onClick={() => onNavigateToModule?.('admin_panel')}
          uiMode={uiMode}
        />
      </nav>
    </header>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

const NovaIndicator: React.FC<{ uiMode: string }> = ({ uiMode }) => (
  <div style={styles.novaIndicator}>
    <div style={{
      ...styles.novaDot,
      backgroundColor: uiMode === 'incident' ? '#ff6b6b' : '#4a9eff'
    }} />
    <span style={styles.novaLabel}>Nova</span>
    <span style={styles.novaState}>Observing</span>
  </div>
);

const CognitiveLoadIndicator: React.FC<{
  loadState: LoadState;
  warnings: number;
  uiMode: string;
}> = ({ loadState, warnings, uiMode }) => {
  const getColor = () => {
    switch (loadState) {
      case 'warning': return '#ff6b6b';
      case 'loaded': return '#ffb74d';
      case 'open': return '#81c784';
      case 'closed': return '#666';
      default: return '#666';
    }
  };

  return (
    <div style={styles.loadIndicator}>
      <div style={{
        ...styles.loadBar,
        backgroundColor: getColor()
      }}>
        <span style={styles.loadLabel}>{loadState.toUpperCase()}</span>
      </div>
      {warnings > 0 && (
        <span style={styles.warningBadge}>{warnings}</span>
      )}
    </div>
  );
};

const NavButton: React.FC<{
  label: string;
  onClick?: () => void;
  uiMode: string;
}> = ({ label, onClick, uiMode }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.navButton,
      color: uiMode === 'light' ? '#333' : '#888',
      borderColor: uiMode === 'light' ? '#ddd' : '#333'
    }}
  >
    {label}
  </button>
);

// ============================================
// STYLES
// ============================================

function getHeaderStyles(uiMode: string): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    gap: '20px',
    borderBottom: '1px solid',
    height: '50px',
    flexShrink: 0
  };

  switch (uiMode) {
    case 'light':
      return { ...base, backgroundColor: '#fff', borderColor: '#ddd' };
    case 'incident':
      return { ...base, backgroundColor: '#1a0505', borderColor: '#500' };
    default:
      return { ...base, backgroundColor: '#0f0f1a', borderColor: '#333' };
  }
}

const styles: Record<string, React.CSSProperties> = {
  brand: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px'
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '2px'
  },
  version: {
    fontSize: '10px',
    color: '#666',
    padding: '2px 6px',
    backgroundColor: '#333',
    borderRadius: '4px'
  },
  moduleTitle: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '20px'
  },
  moduleName: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  moduleDesc: {
    fontSize: '10px',
    color: '#888'
  },
  novaStatus: {
    marginLeft: 'auto'
  },
  novaIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  novaDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    animation: 'pulse 2s infinite'
  },
  novaLabel: {
    fontSize: '12px',
    fontWeight: 'bold'
  },
  novaState: {
    fontSize: '10px',
    color: '#888'
  },
  cognitiveLoad: {
    marginLeft: '20px'
  },
  loadIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  loadBar: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold'
  },
  loadLabel: {
    color: '#fff'
  },
  warningBadge: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '50%'
  },
  nav: {
    display: 'flex',
    gap: '10px',
    marginLeft: '20px'
  },
  navButton: {
    padding: '4px 12px',
    fontSize: '12px',
    backgroundColor: 'transparent',
    border: '1px solid',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default SystemHeader;
