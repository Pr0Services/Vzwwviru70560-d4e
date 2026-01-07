/**
 * ============================================================
 * CHE·NU — ARCHITECTURE WORKSPACE SHELL
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Main workspace container for Architecture domain
 * Manages modes, tools, and content
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  CHENU_COLORS,
  ARCHITECTURE_COLORS,
  baseStyles,
  architectureStyles,
  mergeStyles,
  getModeColor,
  getSubdomainColor,
} from './architectureStyles';

// ============================================================
// TYPES
// ============================================================

export type ArchitectureMode = 'text' | 'diagram' | 'blocks' | 'table' | 'xr_layout' | 'summary' | 'final';
export type ArchitectureSubdomain = 
  | 'spatial_design' | 'blueprint_design' | 'shape_language' 
  | 'interior_concept' | 'diagrammatic_architecture' | 'xr_spatial_architecture'
  | 'industrial_layout' | 'building_analysis' | 'structure_planning'
  | 'logistics_mapping' | 'operational_floor_mapping';

export interface ArchitectureWorkspaceShellProps {
  subdomain: ArchitectureSubdomain;
  initialMode?: ArchitectureMode;
  availableModes?: ArchitectureMode[];
  title?: string;
  children?: React.ReactNode;
  onModeChange?: (mode: ArchitectureMode) => void;
  onToolActivate?: (tool: string) => void;
}

// ============================================================
// MODE CONFIG
// ============================================================

interface ModeConfig {
  id: ArchitectureMode;
  icon: string;
  label: string;
  description: string;
}

const MODE_CONFIGS: Record<ArchitectureMode, ModeConfig> = {
  text: {
    id: 'text',
    icon: '📝',
    label: 'Notes',
    description: 'Text notes and concepts',
  },
  diagram: {
    id: 'diagram',
    icon: '📊',
    label: 'Diagram',
    description: 'Architecture diagrams',
  },
  blocks: {
    id: 'blocks',
    icon: '🧱',
    label: 'Blocks',
    description: 'Elements and components',
  },
  table: {
    id: 'table',
    icon: '📋',
    label: 'Table',
    description: 'Dimension tables',
  },
  xr_layout: {
    id: 'xr_layout',
    icon: '🌀',
    label: 'XR Layout',
    description: 'Spatial representation',
  },
  summary: {
    id: 'summary',
    icon: '📄',
    label: 'Summary',
    description: 'Project concept',
  },
  final: {
    id: 'final',
    icon: '📐',
    label: 'Final',
    description: 'Blueprint summary',
  },
};

// ============================================================
// SUBDOMAIN CONFIG
// ============================================================

interface SubdomainConfig {
  id: ArchitectureSubdomain;
  name: string;
  icon: string;
  sphere: 'creative' | 'business';
}

const SUBDOMAIN_CONFIGS: Record<ArchitectureSubdomain, SubdomainConfig> = {
  spatial_design: { id: 'spatial_design', name: 'Spatial Design', icon: '🏛️', sphere: 'creative' },
  blueprint_design: { id: 'blueprint_design', name: 'Blueprint Design', icon: '📐', sphere: 'creative' },
  shape_language: { id: 'shape_language', name: 'Shape Language', icon: '🔷', sphere: 'creative' },
  interior_concept: { id: 'interior_concept', name: 'Interior Concept', icon: '🛋️', sphere: 'creative' },
  diagrammatic_architecture: { id: 'diagrammatic_architecture', name: 'Diagrammatic', icon: '📊', sphere: 'creative' },
  xr_spatial_architecture: { id: 'xr_spatial_architecture', name: 'XR Spatial', icon: '🌀', sphere: 'creative' },
  industrial_layout: { id: 'industrial_layout', name: 'Industrial Layout', icon: '🏭', sphere: 'business' },
  building_analysis: { id: 'building_analysis', name: 'Building Analysis', icon: '🔍', sphere: 'business' },
  structure_planning: { id: 'structure_planning', name: 'Structure Planning', icon: '🏗️', sphere: 'business' },
  logistics_mapping: { id: 'logistics_mapping', name: 'Logistics Mapping', icon: '🚚', sphere: 'business' },
  operational_floor_mapping: { id: 'operational_floor_mapping', name: 'Floor Mapping', icon: '📋', sphere: 'business' },
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  shell: {
    backgroundColor: CHENU_COLORS.uiSlate,
    borderRadius: '16px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '600px',
  },
  header: {
    padding: '16px 20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  domainBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    backgroundColor: 'rgba(216,178,106,0.2)',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.sacredGold}40`,
  },
  domainIcon: {
    fontSize: '20px',
  },
  domainLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  domainName: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
  },
  subdomainBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  modesBar: {
    padding: '12px 20px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  modeTab: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: CHENU_COLORS.textMuted,
  },
  modeTabActive: {
    color: CHENU_COLORS.uiSlate,
  },
  modeTabDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  content: {
    flex: 1,
    padding: '20px',
    overflow: 'auto',
  },
  toolbar: {
    padding: '12px 20px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbarLeft: {
    display: 'flex',
    gap: '8px',
  },
  toolButton: {
    ...baseStyles.button,
    ...baseStyles.buttonSecondary,
    padding: '8px 14px',
    fontSize: '11px',
  },
  toolButtonPrimary: {
    ...baseStyles.buttonPrimary,
  },
  statusBar: {
    padding: '10px 20px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
  },
  statusLeft: {
    display: 'flex',
    gap: '16px',
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  safetyBadge: {
    ...architectureStyles.safetyBadge,
    fontSize: '9px',
    padding: '4px 10px',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const ArchitectureWorkspaceShell: React.FC<ArchitectureWorkspaceShellProps> = ({
  subdomain,
  initialMode = 'diagram',
  availableModes = ['text', 'diagram', 'blocks', 'table', 'xr_layout', 'summary', 'final'],
  title,
  children,
  onModeChange,
  onToolActivate,
}) => {
  const [activeMode, setActiveMode] = useState<ArchitectureMode>(initialMode);
  const [lastUpdate] = useState(Date.now());

  // Get subdomain config
  const subdomainConfig = SUBDOMAIN_CONFIGS[subdomain];
  const subdomainColor = getSubdomainColor(subdomain);

  // Handle mode change
  const handleModeChange = useCallback((mode: ArchitectureMode) => {
    if (!availableModes.includes(mode)) return;
    setActiveMode(mode);
    onModeChange?.(mode);
  }, [availableModes, onModeChange]);

  // Format timestamp
  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={styles.shell}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          {/* Domain Badge */}
          <div style={styles.domainBadge}>
            <span style={styles.domainIcon}>🏛️</span>
            <div>
              <div style={styles.domainLabel}>Architecture</div>
              <div style={styles.domainName}>{subdomainConfig.name}</div>
            </div>
          </div>
          
          {/* Title */}
          {title && <div style={styles.title}>{title}</div>}
        </div>

        <div style={styles.headerRight}>
          {/* Subdomain Badge */}
          <div
            style={mergeStyles(
              styles.subdomainBadge,
              {
                backgroundColor: `${subdomainColor}20`,
                color: subdomainColor,
                border: `1px solid ${subdomainColor}40`,
              }
            )}
          >
            {subdomainConfig.icon} {subdomainConfig.sphere}
          </div>
        </div>
      </div>

      {/* Modes Bar */}
      <div style={styles.modesBar}>
        {Object.values(MODE_CONFIGS).map(mode => {
          const isActive = activeMode === mode.id;
          const isAvailable = availableModes.includes(mode.id);
          const modeColor = getModeColor(mode.id);

          return (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              disabled={!isAvailable}
              style={mergeStyles(
                styles.modeTab,
                isActive ? { ...styles.modeTabActive, backgroundColor: modeColor } : undefined,
                !isAvailable ? styles.modeTabDisabled : undefined
              )}
              title={mode.description}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {children || (
          <div style={{ textAlign: 'center', padding: '60px', color: CHENU_COLORS.textMuted }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {MODE_CONFIGS[activeMode].icon}
            </div>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              {MODE_CONFIGS[activeMode].label} Mode
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              {MODE_CONFIGS[activeMode].description}
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button
            style={styles.toolButton}
            onClick={() => onToolActivate?.('BlueprintPanel')}
          >
            📐 Blueprint
          </button>
          <button
            style={styles.toolButton}
            onClick={() => onToolActivate?.('RoomMapper')}
          >
            🏠 Rooms
          </button>
          <button
            style={styles.toolButton}
            onClick={() => onToolActivate?.('DiagramBlockMapper')}
          >
            📊 Diagram
          </button>
        </div>
        <button style={mergeStyles(styles.toolButton, styles.toolButtonPrimary)}>
          💾 Save
        </button>
      </div>

      {/* Status Bar */}
      <div style={styles.statusBar}>
        <div style={styles.statusLeft}>
          <div style={styles.statusItem}>
            <span>Mode:</span>
            <span style={{ color: getModeColor(activeMode), fontWeight: 500 }}>
              {MODE_CONFIGS[activeMode].icon} {MODE_CONFIGS[activeMode].label}
            </span>
          </div>
          <div style={styles.statusItem}>
            <span>Updated:</span>
            <span>{formatTime(lastUpdate)}</span>
          </div>
        </div>
        <div style={styles.safetyBadge}>
          🛡️ SAFE · NON-AUTONOMOUS · SYMBOLIC
        </div>
      </div>
    </div>
  );
};

export default ArchitectureWorkspaceShell;
