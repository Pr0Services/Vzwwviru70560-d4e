/**
 * CHE·NU V51 — SPHERE RING
 * =========================
 * 
 * Left panel - contextual structure.
 * User can optionally focus on a sphere.
 * Context-free entry is the default.
 */

import React from 'react';

export interface SphereRingProps {
  focusedSphere?: string;
  onFocusSphere: (sphereId: string | undefined) => void;
  uiMode: 'light' | 'dark_strict' | 'incident';
}

// Demo spheres
const DEMO_SPHERES = [
  { id: 'personal', name: 'Personnel', icon: '👤', color: '#4a9eff' },
  { id: 'work', name: 'Travail', icon: '💼', color: '#81c784' },
  { id: 'projects', name: 'Projets', icon: '🏗️', color: '#ffb74d' },
  { id: 'ideas', name: 'Idées', icon: '💡', color: '#ba68c8' },
  { id: 'archive', name: 'Archive', icon: '📦', color: '#90a4ae' }
];

const SphereRing: React.FC<SphereRingProps> = ({
  focusedSphere,
  onFocusSphere,
  uiMode
}) => {
  return (
    <div style={getContainerStyles(uiMode)}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>Sphères</span>
        <span style={styles.subtitle}>Context (optional)</span>
      </div>

      {/* Clear Focus Button */}
      <button
        onClick={() => onFocusSphere(undefined)}
        style={{
          ...styles.clearButton,
          backgroundColor: !focusedSphere ? '#4a4a6a' : 'transparent',
          borderColor: !focusedSphere ? '#4a4a6a' : '#333'
        }}
      >
        <span style={styles.clearIcon}>○</span>
        <span>Sans contexte</span>
      </button>

      {/* Sphere List */}
      <div style={styles.sphereList}>
        {DEMO_SPHERES.map(sphere => (
          <SphereNode
            key={sphere.id}
            sphere={sphere}
            isFocused={focusedSphere === sphere.id}
            onFocus={() => onFocusSphere(sphere.id)}
            uiMode={uiMode}
          />
        ))}
      </div>

      {/* Info */}
      <div style={styles.info}>
        <p style={styles.infoText}>
          Les sphères organisent vos pensées par contexte.
          Vous pouvez réfléchir sans contexte.
        </p>
      </div>
    </div>
  );
};

// ============================================
// SPHERE NODE
// ============================================

interface SphereNodeProps {
  sphere: { id: string; name: string; icon: string; color: string };
  isFocused: boolean;
  onFocus: () => void;
  uiMode: string;
}

const SphereNode: React.FC<SphereNodeProps> = ({
  sphere,
  isFocused,
  onFocus,
  uiMode
}) => {
  return (
    <button
      onClick={onFocus}
      style={{
        ...styles.sphereNode,
        backgroundColor: isFocused ? `${sphere.color}20` : 'transparent',
        borderColor: isFocused ? sphere.color : 'transparent'
      }}
    >
      <span style={styles.sphereIcon}>{sphere.icon}</span>
      <span style={styles.sphereName}>{sphere.name}</span>
      {isFocused && (
        <span style={{
          ...styles.focusIndicator,
          backgroundColor: sphere.color
        }} />
      )}
    </button>
  );
};

// ============================================
// STYLES
// ============================================

function getContainerStyles(uiMode: string): React.CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '15px',
    backgroundColor: uiMode === 'light' ? '#f5f5f5' 
      : uiMode === 'incident' ? '#0a0505' 
      : '#0a0a15'
  };
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '15px'
  },
  title: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '2px'
  },
  subtitle: {
    fontSize: '11px',
    color: '#888'
  },
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 12px',
    marginBottom: '15px',
    fontSize: '13px',
    border: '1px solid',
    borderRadius: '6px',
    cursor: 'pointer',
    color: 'inherit',
    textAlign: 'left'
  },
  clearIcon: {
    fontSize: '16px'
  },
  sphereList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1
  },
  sphereNode: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    border: '2px solid transparent',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: 'inherit',
    fontSize: '13px',
    textAlign: 'left',
    transition: 'all 0.2s ease'
  },
  sphereIcon: {
    fontSize: '18px'
  },
  sphereName: {
    flex: 1
  },
  focusIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  info: {
    marginTop: 'auto',
    padding: '12px',
    backgroundColor: '#1a1a2e',
    borderRadius: '6px'
  },
  infoText: {
    fontSize: '11px',
    color: '#888',
    lineHeight: '1.5',
    margin: 0
  }
};

export default SphereRing;
