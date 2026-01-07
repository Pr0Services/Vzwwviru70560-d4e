/**
 * ============================================================
 * CHE·NU — WORKSURFACE XR LAYOUT VIEW
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * XR scene layout preview for WorkSurface
 * Displays XR scene information without real 3D rendering
 */

import React from 'react';
import { CHENU_COLORS } from './worksurfaceStyles';

// ============================================================
// TYPES
// ============================================================

export interface XRSceneRef {
  id: string;
  name: string;
  sectorsCount: number;
  objectsCount: number;
  roomType?: string;
  preset?: string;
}

export interface WorkSurfaceXRLayoutViewProps {
  xrScene?: XRSceneRef | null;
  onOpenInXR?: () => void;
  onEditScene?: () => void;
  onDetach?: () => void;
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    overflow: 'hidden',
  },
  header: {
    padding: '12px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.textSecondary,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  actionButtonPrimary: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  contentArea: {
    padding: '24px',
  },
  previewBox: {
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}15`,
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}30`,
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
  },
  sceneIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  sceneName: {
    fontSize: '20px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
    marginBottom: '8px',
  },
  sceneId: {
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginTop: '20px',
  },
  statBox: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  statLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    marginTop: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailsSection: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  detailsTitle: {
    fontSize: '12px',
    color: CHENU_COLORS.textMuted,
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '6px',
  },
  detailLabel: {
    fontSize: '12px',
    color: CHENU_COLORS.textMuted,
  },
  detailValue: {
    fontSize: '12px',
    fontWeight: 500,
    color: CHENU_COLORS.textPrimary,
  },
  visualPreview: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    padding: '20px',
  },
  sectorBox: {
    width: '60px',
    height: '60px',
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}30`,
    border: `2px solid ${CHENU_COLORS.cenoteTurquoise}50`,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  previewLabel: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '4px 12px',
    borderRadius: '4px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: CHENU_COLORS.textMuted,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '14px',
    marginBottom: '8px',
  },
  emptyHint: {
    fontSize: '12px',
    opacity: 0.7,
    marginBottom: '20px',
  },
  attachButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  footer: {
    padding: '10px 16px',
    borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: 'rgba(0,0,0,0.1)',
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safetyBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: CHENU_COLORS.jungleEmerald,
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const WorkSurfaceXRLayoutView: React.FC<WorkSurfaceXRLayoutViewProps> = ({
  xrScene,
  onOpenInXR,
  onEditScene,
  onDetach,
}) => {
  // Empty state
  if (!xrScene) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span>🌀</span>
            <span>XR Layout View</span>
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🌀</div>
          <div style={styles.emptyText}>No XR scene attached</div>
          <div style={styles.emptyHint}>Connect an XR scene to preview its layout</div>
          <button style={styles.attachButton}>
            ➕ Attach XR Scene
          </button>
        </div>
      </div>
    );
  }

  // Generate sector preview
  const sectorIcons = ['📍', '🏛️', '💡', '🎯', '📦', '🔮', '⭐', '🌟'];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🌀</span>
          <span>XR Layout View</span>
        </div>
        <div style={styles.actions}>
          {onEditScene && (
            <button onClick={onEditScene} style={styles.actionButton}>
              ✏️ Edit
            </button>
          )}
          {onOpenInXR && (
            <button onClick={onOpenInXR} style={{ ...styles.actionButton, ...styles.actionButtonPrimary }}>
              🌀 Open in XR
            </button>
          )}
          {onDetach && (
            <button onClick={onDetach} style={styles.actionButton}>
              ❌ Detach
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={styles.contentArea}>
        {/* Preview Box */}
        <div style={styles.previewBox}>
          <div style={styles.sceneIcon}>🌀</div>
          <div style={styles.sceneName}>{xrScene.name}</div>
          <div style={styles.sceneId}>ID: {xrScene.id}</div>
          
          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{xrScene.sectorsCount}</div>
              <div style={styles.statLabel}>Sectors</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{xrScene.objectsCount}</div>
              <div style={styles.statLabel}>Objects</div>
            </div>
            <div style={styles.statBox}>
              <div style={{ ...styles.statValue, fontSize: '24px' }}>✅</div>
              <div style={styles.statLabel}>Ready</div>
            </div>
          </div>
        </div>

        {/* Visual Preview */}
        <div style={styles.visualPreview}>
          <div style={styles.previewGrid}>
            {Array.from({ length: Math.min(xrScene.sectorsCount, 8) }).map((_, i) => (
              <div key={i} style={styles.sectorBox}>
                {sectorIcons[i % sectorIcons.length]}
              </div>
            ))}
          </div>
          <div style={styles.previewLabel}>
            Representational Layout Preview (No Real 3D)
          </div>
        </div>

        {/* Details Section */}
        <div style={styles.detailsSection}>
          <div style={styles.detailsTitle}>Scene Details</div>
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Room Type</span>
              <span style={styles.detailValue}>{xrScene.roomType || 'Standard'}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Preset</span>
              <span style={styles.detailValue}>{xrScene.preset || 'Default'}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Sectors</span>
              <span style={styles.detailValue}>{xrScene.sectorsCount}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Objects</span>
              <span style={styles.detailValue}>{xrScene.objectsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>XR Scene Preview — No real 3D rendering</span>
        <div style={styles.safetyBadge}>
          <span>🛡️</span>
          <span>SAFE · NO WebXR/WebGL</span>
        </div>
      </div>
    </div>
  );
};

export default WorkSurfaceXRLayoutView;
