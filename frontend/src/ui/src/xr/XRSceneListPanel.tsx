/**
 * ============================================================
 * CHE·NU — XR SCENE LIST PANEL
 * List view of scenes with selection
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState, useCallback } from 'react';

// ============================================================
// COLORS
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

// ============================================================
// TYPES
// ============================================================

interface Scene {
  id: string;
  name: string;
  domain?: string;
  sphere?: string;
  sectors?: number;
  objects?: number;
  icon?: string;
  description?: string;
}

interface Universe {
  id: string;
  name: string;
  scenes: Scene[];
}

interface XRSceneListPanelProps {
  universe: Universe;
  selectedSceneId?: string | null;
  onSelectScene?: (sceneId: string) => void;
  showDetails?: boolean;
  maxHeight?: number | string;
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.borderColor}`,
    overflow: 'hidden',
  },
  header: {
    padding: '14px 16px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerIcon: {
    fontSize: '16px',
  },
  headerText: {
    fontSize: '13px',
    fontWeight: 600,
    color: COLORS.textPrimary,
  },
  headerCount: {
    fontSize: '11px',
    color: COLORS.textMuted,
    padding: '2px 8px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
  },
  list: {
    padding: '8px',
    overflowY: 'auto',
  },
  sceneItem: {
    padding: '12px 14px',
    marginBottom: '6px',
    borderRadius: '8px',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  sceneItemSelected: {
    backgroundColor: `${COLORS.cenoteTurquoise}20`,
    borderColor: COLORS.cenoteTurquoise,
  },
  sceneItemHover: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: COLORS.borderColor,
  },
  sceneHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
  },
  sceneIcon: {
    fontSize: '20px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(62, 180, 162, 0.15)',
    borderRadius: '6px',
  },
  sceneName: {
    fontSize: '13px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    flex: 1,
  },
  sceneMeta: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: `1px solid ${COLORS.borderColor}`,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    color: COLORS.textMuted,
  },
  metaValue: {
    color: COLORS.textSecondary,
    fontWeight: 500,
  },
  sceneDescription: {
    fontSize: '11px',
    color: COLORS.textMuted,
    marginTop: '6px',
    lineHeight: 1.4,
  },
  domainBadge: {
    fontSize: '9px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: COLORS.textMuted,
  },
  empty: {
    padding: '24px',
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: '12px',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRSceneListPanel: React.FC<XRSceneListPanelProps> = ({
  universe,
  selectedSceneId = null,
  onSelectScene,
  showDetails = true,
  maxHeight = 400,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelect = useCallback(
    (sceneId: string) => {
      if (onSelectScene) {
        onSelectScene(sceneId);
      }
    },
    [onSelectScene]
  );

  const { scenes } = universe;

  if (scenes.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <span style={styles.headerIcon}>📋</span>
            <span style={styles.headerText}>Scenes</span>
          </div>
        </div>
        <div style={styles.empty}>No scenes in this universe</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <span style={styles.headerIcon}>📋</span>
          <span style={styles.headerText}>Scenes in {universe.name}</span>
        </div>
        <span style={styles.headerCount}>{scenes.length}</span>
      </div>

      {/* Scene List */}
      <div style={{ ...styles.list, maxHeight }}>
        {scenes.map((scene, index) => {
          const isSelected = selectedSceneId === scene.id;
          const isHovered = hoveredId === scene.id;

          return (
            <div
              key={scene.id}
              style={{
                ...styles.sceneItem,
                ...(isSelected ? styles.sceneItemSelected : {}),
                ...(isHovered && !isSelected ? styles.sceneItemHover : {}),
              }}
              onClick={() => handleSelect(scene.id)}
              onMouseEnter={() => setHoveredId(scene.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Scene Header */}
              <div style={styles.sceneHeader}>
                <div style={styles.sceneIcon}>{scene.icon || '🌀'}</div>
                <span style={styles.sceneName}>
                  {index + 1}. {scene.name}
                </span>
                {scene.domain && (
                  <span style={styles.domainBadge}>{scene.domain}</span>
                )}
              </div>

              {/* Description */}
              {showDetails && scene.description && (
                <div style={styles.sceneDescription}>{scene.description}</div>
              )}

              {/* Meta Info */}
              {showDetails && (scene.sectors || scene.objects) && (
                <div style={styles.sceneMeta}>
                  {scene.sectors && (
                    <div style={styles.metaItem}>
                      <span>📍</span>
                      <span style={styles.metaValue}>{scene.sectors}</span>
                      <span>sectors</span>
                    </div>
                  )}
                  {scene.objects && (
                    <div style={styles.metaItem}>
                      <span>📦</span>
                      <span style={styles.metaValue}>{scene.objects}</span>
                      <span>objects</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default XRSceneListPanel;
