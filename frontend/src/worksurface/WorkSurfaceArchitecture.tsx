/**
 * ============================================================
 * CHE·NU — WORKSURFACE ARCHITECTURE MODE
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * WorkSurface UI components with Architecture mode integration.
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

const MODE_COLORS: Record<string, string> = {
  text: '#64B5F6',
  diagram: '#81C784',
  blocks: '#FFB74D',
  table: '#BA68C8',
  xr_layout: '#4DD0E1',
  summary: '#A1887F',
  final: COLORS.sacredGold,
};

const styles: Record<string, React.CSSProperties> = {
  shell: {
    backgroundColor: COLORS.uiSlate,
    borderRadius: '16px',
    border: `1px solid ${COLORS.borderColor}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '500px',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    padding: '16px 20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    borderRadius: '8px',
  },
  profileIcon: {
    fontSize: '20px',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  profileLabel: {
    fontSize: '10px',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  profileName: {
    fontSize: '13px',
    fontWeight: 600,
    color: COLORS.textPrimary,
  },
  architectureBadge: {
    backgroundColor: `${COLORS.sacredGold}20`,
    border: `1px solid ${COLORS.sacredGold}40`,
  },
  defaultBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: `1px solid ${COLORS.borderColor}`,
  },
  modesBar: {
    padding: '12px 20px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  modesLabel: {
    fontSize: '11px',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginRight: '8px',
  },
  modeTab: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: COLORS.textMuted,
  },
  modeTabPrimary: {
    borderWidth: '2px',
    borderStyle: 'solid',
  },
  modeTabActive: {
    color: COLORS.uiSlate,
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
  contentPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '300px',
    color: COLORS.textMuted,
  },
  placeholderIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  placeholderTitle: {
    fontSize: '16px',
    fontWeight: 500,
    color: COLORS.textSecondary,
    marginBottom: '8px',
  },
  placeholderDesc: {
    fontSize: '12px',
    opacity: 0.7,
  },
  footer: {
    padding: '12px 20px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTop: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: COLORS.textMuted,
  },
  footerLeft: {
    display: 'flex',
    gap: '16px',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  safetyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: 'rgba(63,114,73,0.2)',
    border: `1px solid ${COLORS.jungleEmerald}`,
    borderRadius: '6px',
    color: COLORS.jungleEmerald,
    fontSize: '9px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
};

// ============================================================
// TYPES
// ============================================================

type WorkSurfaceMode = 'text' | 'diagram' | 'blocks' | 'table' | 'xr_layout' | 'summary' | 'final';

interface WorkSurfaceProfile {
  id: string;
  name: string;
  primaryMode: WorkSurfaceMode;
  secondaryModes: WorkSurfaceMode[];
  availableModes: WorkSurfaceMode[];
  icon: string;
  color: string;
}

interface WorkSurfaceArchitectureProps {
  profile?: WorkSurfaceProfile;
  initialMode?: WorkSurfaceMode;
  onModeChange?: (mode: WorkSurfaceMode) => void;
  children?: React.ReactNode;
}

// ============================================================
// MODE CONFIG
// ============================================================

const MODE_ICONS: Record<WorkSurfaceMode, string> = {
  text: '📝',
  diagram: '📊',
  blocks: '🧱',
  table: '📋',
  xr_layout: '🌀',
  summary: '📄',
  final: '📐',
};

const MODE_LABELS: Record<WorkSurfaceMode, string> = {
  text: 'Notes',
  diagram: 'Diagram',
  blocks: 'Blocks',
  table: 'Table',
  xr_layout: 'XR Layout',
  summary: 'Summary',
  final: 'Final',
};

// ============================================================
// DEFAULT PROFILES
// ============================================================

const DEFAULT_PROFILE: WorkSurfaceProfile = {
  id: 'default',
  name: 'Default',
  primaryMode: 'text',
  secondaryModes: ['blocks', 'summary', 'final'],
  availableModes: ['text', 'table', 'blocks', 'diagram', 'summary', 'xr_layout', 'final'],
  icon: '📄',
  color: '#64B5F6',
};

const ARCHITECTURE_PROFILE: WorkSurfaceProfile = {
  id: 'architecture',
  name: 'Architecture',
  primaryMode: 'diagram',
  secondaryModes: ['xr_layout', 'table', 'blocks', 'summary', 'final'],
  availableModes: ['text', 'diagram', 'xr_layout', 'table', 'blocks', 'summary', 'final'],
  icon: '🏛️',
  color: COLORS.sacredGold,
};

// ============================================================
// COMPONENT
// ============================================================

export const WorkSurfaceArchitecture: React.FC<WorkSurfaceArchitectureProps> = ({
  profile = ARCHITECTURE_PROFILE,
  initialMode,
  onModeChange,
  children,
}) => {
  const [activeMode, setActiveMode] = useState<WorkSurfaceMode>(
    initialMode || profile.primaryMode
  );

  const isArchitectureProfile = profile.id === 'architecture' || 
    profile.name.toLowerCase().includes('architecture');

  // Handle mode change
  const handleModeChange = useCallback((mode: WorkSurfaceMode) => {
    if (!profile.availableModes.includes(mode)) return;
    setActiveMode(mode);
    onModeChange?.(mode);
  }, [profile.availableModes, onModeChange]);

  // Determine if mode is primary/secondary
  const isPrimaryMode = (mode: WorkSurfaceMode) => mode === profile.primaryMode;
  const isSecondaryMode = (mode: WorkSurfaceMode) => profile.secondaryModes.includes(mode);

  return (
    <div style={styles.shell}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          {/* Profile Badge */}
          <div
            style={{
              ...styles.profileBadge,
              ...(isArchitectureProfile ? styles.architectureBadge : styles.defaultBadge),
            }}
          >
            <span style={styles.profileIcon}>{profile.icon}</span>
            <div style={styles.profileInfo}>
              <span style={styles.profileLabel}>Profile</span>
              <span style={{ ...styles.profileName, color: profile.color }}>
                {profile.name}
              </span>
            </div>
          </div>

          {/* Architecture Mode Indicator */}
          {isArchitectureProfile && (
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: `${COLORS.sacredGold}20`,
                border: `1px solid ${COLORS.sacredGold}40`,
                fontSize: '11px',
                fontWeight: 600,
                color: COLORS.sacredGold,
              }}
            >
              ✨ Architecture Mode Active
            </div>
          )}
        </div>
      </div>

      {/* Modes Bar */}
      <div style={styles.modesBar}>
        <span style={styles.modesLabel}>Modes</span>
        {profile.availableModes.map(mode => {
          const isActive = activeMode === mode;
          const isPrimary = isPrimaryMode(mode);
          const modeColor = MODE_COLORS[mode];

          return (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              style={{
                ...styles.modeTab,
                ...(isPrimary ? { ...styles.modeTabPrimary, borderColor: modeColor } : {}),
                ...(isActive ? { ...styles.modeTabActive, backgroundColor: modeColor } : {}),
              }}
              title={isPrimary ? 'Primary mode' : isSecondaryMode(mode) ? 'Secondary mode' : undefined}
            >
              <span>{MODE_ICONS[mode]}</span>
              <span>{MODE_LABELS[mode]}</span>
              {isPrimary && !isActive && (
                <span style={{ fontSize: '10px', opacity: 0.7 }}>★</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {children || (
          <div style={styles.contentPlaceholder}>
            <div style={styles.placeholderIcon}>{MODE_ICONS[activeMode]}</div>
            <div style={styles.placeholderTitle}>{MODE_LABELS[activeMode]} Mode</div>
            <div style={styles.placeholderDesc}>
              {isArchitectureProfile 
                ? 'Architecture workspace ready for conceptual design'
                : 'WorkSurface content area'
              }
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <div style={styles.footerItem}>
            <span>Mode:</span>
            <span style={{ color: MODE_COLORS[activeMode], fontWeight: 500 }}>
              {MODE_ICONS[activeMode]} {MODE_LABELS[activeMode]}
            </span>
          </div>
          <div style={styles.footerItem}>
            <span>Profile:</span>
            <span style={{ color: profile.color, fontWeight: 500 }}>
              {profile.name}
            </span>
          </div>
        </div>
        <div style={styles.safetyBadge}>
          🛡️ SAFE · CONCEPTUAL
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EXPORTS
// ============================================================

export { DEFAULT_PROFILE, ARCHITECTURE_PROFILE };
export type { WorkSurfaceProfile, WorkSurfaceMode };
export default WorkSurfaceArchitecture;
