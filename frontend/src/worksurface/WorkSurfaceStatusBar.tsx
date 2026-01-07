/**
 * ============================================================
 * CHE·NU — WORKSURFACE STATUS BAR
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Status bar component showing WorkSurface state
 */

import React from 'react';
import { CHENU_COLORS } from './worksurfaceStyles';

// ============================================================
// TYPES
// ============================================================

export type WorkSurfaceMode = 'text' | 'table' | 'blocks' | 'diagram' | 'summary' | 'xr_layout' | 'final';
export type WorkSurfaceControlMode = 'manual' | 'assisted';

export interface WorkSurfaceState {
  activeMode: WorkSurfaceMode;
  availableModes: WorkSurfaceMode[];
  controlMode: WorkSurfaceControlMode;
  lastInputKind: string;
  lastUpdate: number;
}

export interface WorkSurfaceStatusBarProps {
  state: WorkSurfaceState;
  wordCount?: number;
  blockCount?: number;
  connected?: boolean;
  synced?: boolean;
  showSafetyBadge?: boolean;
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  statusBar: {
    padding: '8px 20px',
    borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: CHENU_COLORS.cardBg,
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.textMuted,
    flexWrap: 'wrap',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  divider: {
    color: CHENU_COLORS.borderColor,
  },
  indicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  statusDotConnected: {
    backgroundColor: CHENU_COLORS.success,
  },
  statusDotDisconnected: {
    backgroundColor: CHENU_COLORS.error,
  },
  statusDotSyncing: {
    backgroundColor: CHENU_COLORS.warning,
    animation: 'pulse 1s infinite',
  },
  badge: {
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  modeBadge: {
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}30`,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  controlBadge: {
    backgroundColor: `${CHENU_COLORS.jungleEmerald}30`,
    color: CHENU_COLORS.jungleEmerald,
  },
  safetyBadge: {
    backgroundColor: `${CHENU_COLORS.jungleEmerald}20`,
    color: CHENU_COLORS.jungleEmerald,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  spacer: {
    flex: 1,
  },
  timestamp: {
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
    opacity: 0.7,
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: {
    fontWeight: 600,
    color: CHENU_COLORS.textSecondary,
  },
};

// ============================================================
// MODE CONFIG
// ============================================================

const MODE_CONFIG: Record<WorkSurfaceMode, { icon: string; label: string }> = {
  text: { icon: '📝', label: 'Text' },
  table: { icon: '📊', label: 'Table' },
  blocks: { icon: '🧱', label: 'Blocks' },
  diagram: { icon: '🔗', label: 'Diagram' },
  summary: { icon: '📋', label: 'Summary' },
  xr_layout: { icon: '🌀', label: 'XR' },
  final: { icon: '📄', label: 'Final' },
};

// ============================================================
// HELPERS
// ============================================================

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

// ============================================================
// COMPONENT
// ============================================================

export const WorkSurfaceStatusBar: React.FC<WorkSurfaceStatusBarProps> = ({
  state,
  wordCount = 0,
  blockCount = 0,
  connected = true,
  synced = true,
  showSafetyBadge = true,
}) => {
  const modeConfig = MODE_CONFIG[state.activeMode];

  return (
    <div style={styles.statusBar}>
      {/* Connection Status */}
      <div style={styles.indicator}>
        <div
          style={{
            ...styles.statusDot,
            ...(connected
              ? synced
                ? styles.statusDotConnected
                : styles.statusDotSyncing
              : styles.statusDotDisconnected),
          }}
        />
        <span>{connected ? (synced ? 'Ready' : 'Syncing') : 'Offline'}</span>
      </div>

      <span style={styles.divider}>|</span>

      {/* Active Mode */}
      <div style={styles.section}>
        <span>Mode:</span>
        <span style={{ ...styles.badge, ...styles.modeBadge }}>
          {modeConfig.icon} {modeConfig.label}
        </span>
      </div>

      <span style={styles.divider}>|</span>

      {/* Control Mode */}
      <div style={styles.section}>
        <span>Control:</span>
        <span style={{ ...styles.badge, ...styles.controlBadge }}>
          {state.controlMode === 'assisted' ? '🤖' : '🎛️'} {state.controlMode}
        </span>
      </div>

      <span style={styles.divider}>|</span>

      {/* Last Input Kind */}
      <div style={styles.section}>
        <span>Input:</span>
        <span style={styles.statValue}>{state.lastInputKind || 'none'}</span>
      </div>

      {/* Stats */}
      {(wordCount > 0 || blockCount > 0) && (
        <>
          <span style={styles.divider}>|</span>
          <div style={styles.stat}>
            <span style={styles.statValue}>{wordCount}</span>
            <span>words</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statValue}>{blockCount}</span>
            <span>blocks</span>
          </div>
        </>
      )}

      {/* Spacer */}
      <div style={styles.spacer} />

      {/* Timestamp */}
      <div style={styles.timestamp}>
        Updated: {formatTimestamp(state.lastUpdate)}
      </div>

      {/* Safety Badge */}
      {showSafetyBadge && (
        <div style={{ ...styles.badge, ...styles.safetyBadge }}>
          🛡️ SAFE · REPRESENTATIONAL
        </div>
      )}
    </div>
  );
};

// ============================================================
// COMPACT VARIANT
// ============================================================

export interface WorkSurfaceStatusBarCompactProps {
  activeMode: WorkSurfaceMode;
  controlMode: WorkSurfaceControlMode;
  connected?: boolean;
}

export const WorkSurfaceStatusBarCompact: React.FC<WorkSurfaceStatusBarCompactProps> = ({
  activeMode,
  controlMode,
  connected = true,
}) => {
  const modeConfig = MODE_CONFIG[activeMode];

  return (
    <div style={{ ...styles.statusBar, padding: '6px 16px', fontSize: '11px' }}>
      <div style={styles.indicator}>
        <div
          style={{
            ...styles.statusDot,
            width: '6px',
            height: '6px',
            ...(connected ? styles.statusDotConnected : styles.statusDotDisconnected),
          }}
        />
      </div>
      <span>{modeConfig.icon} {modeConfig.label}</span>
      <span style={styles.divider}>|</span>
      <span>{controlMode === 'assisted' ? '🤖' : '🎛️'}</span>
      <div style={styles.spacer} />
      <span style={{ color: CHENU_COLORS.jungleEmerald, fontSize: '10px' }}>SAFE</span>
    </div>
  );
};

export default WorkSurfaceStatusBar;
