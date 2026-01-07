/**
 * ============================================================
 * CHE·NU — WORKSURFACE TOOLBAR
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Toolbar component with context info and action buttons
 */

import React from 'react';
import { CHENU_COLORS } from './worksurfaceStyles';

// ============================================================
// TYPES
// ============================================================

export type WorkSurfaceControlMode = 'manual' | 'assisted';

export interface ContextInfo {
  sphere: string;
  domain?: string;
  engines?: string[];
}

export interface WorkSurfaceToolbarProps {
  controlMode: WorkSurfaceControlMode;
  context?: ContextInfo | null;
  hasContent: boolean;
  hasXRScene: boolean;
  onControlModeToggle: () => void;
  onClear: () => void;
  onExport?: () => void;
  onShowSummary?: () => void;
  onShowXR?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    padding: '10px 20px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: CHENU_COLORS.borderColor,
    margin: '0 4px',
  },
  contextBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '6px',
    fontSize: '12px',
    color: CHENU_COLORS.textSecondary,
  },
  sphereIcon: {
    fontSize: '14px',
  },
  button: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.textSecondary,
  },
  buttonPrimary: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  buttonSuccess: {
    backgroundColor: CHENU_COLORS.jungleEmerald,
    color: CHENU_COLORS.softSand,
  },
  buttonWarning: {
    backgroundColor: 'rgba(255,152,0,0.2)',
    color: '#FF9800',
  },
  buttonDanger: {
    backgroundColor: 'rgba(244,67,54,0.2)',
    color: CHENU_COLORS.error,
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  spacer: {
    flex: 1,
  },
  label: {
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

// ============================================================
// SPHERE ICONS
// ============================================================

const SPHERE_ICONS: Record<string, string> = {
  personal: '🏠',
  business: '💼',
  creative: '🎨',
  scholar: '📚',
  social: '👥',
  entertainment: '🎮',
  community: '🌐',
  ailab: '🤖',
  myteam: '👔',
  xr: '🌀',
  default: '📍',
};

// ============================================================
// COMPONENT
// ============================================================

export const WorkSurfaceToolbar: React.FC<WorkSurfaceToolbarProps> = ({
  controlMode,
  context,
  hasContent,
  hasXRScene,
  onControlModeToggle,
  onClear,
  onExport,
  onShowSummary,
  onShowXR,
  onUndo,
  onRedo,
}) => {
  const sphereIcon = context?.sphere 
    ? SPHERE_ICONS[context.sphere.toLowerCase()] || SPHERE_ICONS.default
    : SPHERE_ICONS.default;

  return (
    <div style={styles.toolbar}>
      {/* Context Section */}
      {context && (
        <div style={styles.section}>
          <div style={styles.contextBadge}>
            <span style={styles.sphereIcon}>{sphereIcon}</span>
            <span>{context.sphere}</span>
            {context.domain && (
              <>
                <span style={{ color: CHENU_COLORS.textMuted }}>/</span>
                <span>{context.domain}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Undo/Redo Section */}
      {(onUndo || onRedo) && (
        <>
          <div style={styles.divider} />
          <div style={styles.section}>
            {onUndo && (
              <button
                onClick={onUndo}
                style={styles.button}
                title="Undo (Ctrl+Z)"
              >
                ↩️
              </button>
            )}
            {onRedo && (
              <button
                onClick={onRedo}
                style={styles.button}
                title="Redo (Ctrl+Y)"
              >
                ↪️
              </button>
            )}
          </div>
        </>
      )}

      {/* Spacer */}
      <div style={styles.spacer} />

      {/* Action Buttons */}
      <div style={styles.section}>
        {/* Summary Button */}
        {onShowSummary && hasContent && (
          <button
            onClick={onShowSummary}
            style={styles.button}
            title="Generate Summary"
          >
            📋 Summary
          </button>
        )}

        {/* XR Button */}
        {onShowXR && hasXRScene && (
          <button
            onClick={onShowXR}
            style={{ ...styles.button, ...styles.buttonPrimary }}
            title="Show XR Layout"
          >
            🌀 XR View
          </button>
        )}

        {/* Export Button */}
        {onExport && hasContent && (
          <button
            onClick={onExport}
            style={styles.button}
            title="Export Content"
          >
            📤 Export
          </button>
        )}
      </div>

      <div style={styles.divider} />

      {/* Control Mode Toggle */}
      <div style={styles.section}>
        <span style={styles.label}>Mode:</span>
        <button
          onClick={onControlModeToggle}
          style={{
            ...styles.button,
            ...(controlMode === 'assisted' ? styles.buttonSuccess : {}),
          }}
          title={controlMode === 'assisted' 
            ? 'Assisted Mode: Auto-adapts view based on content' 
            : 'Manual Mode: You control view switching'
          }
        >
          {controlMode === 'assisted' ? '🤖' : '🎛️'}
          {controlMode === 'assisted' ? 'Assisted' : 'Manual'}
        </button>
      </div>

      <div style={styles.divider} />

      {/* Clear Button */}
      <button
        onClick={onClear}
        style={{
          ...styles.button,
          ...styles.buttonDanger,
          ...(hasContent ? {} : styles.buttonDisabled),
        }}
        disabled={!hasContent}
        title="Clear all content"
      >
        🗑️ Clear
      </button>
    </div>
  );
};

// ============================================================
// COMPACT VARIANT
// ============================================================

export interface WorkSurfaceToolbarCompactProps {
  controlMode: WorkSurfaceControlMode;
  onControlModeToggle: () => void;
  onClear: () => void;
}

export const WorkSurfaceToolbarCompact: React.FC<WorkSurfaceToolbarCompactProps> = ({
  controlMode,
  onControlModeToggle,
  onClear,
}) => (
  <div style={{ ...styles.toolbar, padding: '8px 16px' }}>
    <button
      onClick={onControlModeToggle}
      style={{
        ...styles.button,
        padding: '6px 10px',
        fontSize: '11px',
        ...(controlMode === 'assisted' ? styles.buttonSuccess : {}),
      }}
    >
      {controlMode === 'assisted' ? '🤖' : '🎛️'}
    </button>
    <div style={styles.spacer} />
    <button
      onClick={onClear}
      style={{ ...styles.button, ...styles.buttonDanger, padding: '6px 10px', fontSize: '11px' }}
    >
      🗑️
    </button>
  </div>
);

export default WorkSurfaceToolbar;
