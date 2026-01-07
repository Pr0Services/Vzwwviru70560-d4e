/**
 * ============================================================
 * CHE·NU — XR SCENE CARD LIST
 * Card grid view of XR scenes
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

interface XRSceneCardListProps {
  scenes: Scene[];
  columns?: 1 | 2 | 3 | 4;
  selectedSceneId?: string | null;
  onSelectScene?: (sceneId: string) => void;
  showDescription?: boolean;
  showStats?: boolean;
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'grid',
    gap: '16px',
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.borderColor}`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cardSelected: {
    borderColor: COLORS.cenoteTurquoise,
    boxShadow: `0 0 0 2px ${COLORS.cenoteTurquoise}30`,
  },
  cardHover: {
    borderColor: COLORS.ancientStone,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  cardHeader: {
    padding: '16px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  headerInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: '15px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    marginBottom: '2px',
  },
  cardDomain: {
    fontSize: '11px',
    color: COLORS.textMuted,
  },
  cardBody: {
    padding: '16px',
  },
  description: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    lineHeight: 1.5,
    marginBottom: '12px',
  },
  stats: {
    display: 'flex',
    gap: '16px',
    paddingTop: '12px',
    borderTop: `1px solid ${COLORS.borderColor}`,
  },
  stat: {
    flex: 1,
    textAlign: 'center',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: '10px',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 500,
  },
  badgeCreative: {
    backgroundColor: `${COLORS.cenoteTurquoise}20`,
    color: COLORS.cenoteTurquoise,
  },
  badgeBusiness: {
    backgroundColor: `${COLORS.sacredGold}20`,
    color: COLORS.sacredGold,
  },
  safetyBanner: {
    padding: '8px 16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    fontSize: '10px',
    color: COLORS.textMuted,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getIconBackground(sphere?: string): string {
  switch (sphere) {
    case 'Creative':
      return `${COLORS.cenoteTurquoise}20`;
    case 'Business':
      return `${COLORS.sacredGold}20`;
    default:
      return 'rgba(255,255,255,0.1)';
  }
}

function getIconBorder(sphere?: string): string {
  switch (sphere) {
    case 'Creative':
      return COLORS.cenoteTurquoise;
    case 'Business':
      return COLORS.sacredGold;
    default:
      return COLORS.ancientStone;
  }
}

// ============================================================
// COMPONENT
// ============================================================

export const XRSceneCardList: React.FC<XRSceneCardListProps> = ({
  scenes,
  columns = 2,
  selectedSceneId = null,
  onSelectScene,
  showDescription = true,
  showStats = true,
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

  if (scenes.length === 0) {
    return (
      <div
        style={{
          padding: '32px',
          textAlign: 'center',
          color: COLORS.textMuted,
          backgroundColor: COLORS.cardBg,
          borderRadius: '12px',
          border: `1px solid ${COLORS.borderColor}`,
        }}
      >
        No XR scenes available
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.container,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {scenes.map(scene => {
        const isSelected = selectedSceneId === scene.id;
        const isHovered = hoveredId === scene.id;

        return (
          <div
            key={scene.id}
            style={{
              ...styles.card,
              ...(isSelected ? styles.cardSelected : {}),
              ...(isHovered && !isSelected ? styles.cardHover : {}),
            }}
            onClick={() => handleSelect(scene.id)}
            onMouseEnter={() => setHoveredId(scene.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Header */}
            <div style={styles.cardHeader}>
              <div
                style={{
                  ...styles.iconContainer,
                  backgroundColor: getIconBackground(scene.sphere),
                  border: `1px solid ${getIconBorder(scene.sphere)}40`,
                }}
              >
                {scene.icon || '🌀'}
              </div>
              <div style={styles.headerInfo}>
                <div style={styles.cardName}>{scene.name}</div>
                {scene.domain && (
                  <div style={styles.cardDomain}>{scene.domain}</div>
                )}
              </div>
              {scene.sphere && (
                <span
                  style={{
                    ...styles.badge,
                    ...(scene.sphere === 'Creative'
                      ? styles.badgeCreative
                      : styles.badgeBusiness),
                  }}
                >
                  {scene.sphere}
                </span>
              )}
            </div>

            {/* Body */}
            <div style={styles.cardBody}>
              {showDescription && scene.description && (
                <div style={styles.description}>{scene.description}</div>
              )}

              {showStats && (scene.sectors || scene.objects) && (
                <div style={styles.stats}>
                  {scene.sectors && (
                    <div style={styles.stat}>
                      <div style={styles.statValue}>{scene.sectors}</div>
                      <div style={styles.statLabel}>Sectors</div>
                    </div>
                  )}
                  {scene.objects && (
                    <div style={styles.stat}>
                      <div style={styles.statValue}>{scene.objects}</div>
                      <div style={styles.statLabel}>Objects</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Safety Banner */}
            <div style={styles.safetyBanner}>
              <span>🛡️</span>
              <span>Symbolic XR room • Representational only</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default XRSceneCardList;
