/**
 * ============================================================
 * CHE·NU — XR AVATAR PRESET LIST
 * SAFE · NON-BIOMETRIC · SYMBOLIC
 * ============================================================
 * 
 * List of available avatar presets for selection.
 * Includes category filtering and preview.
 */

import React, { useState, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

interface AvatarTraits {
  height: number;
  proportions: 'balanced' | 'compact' | 'slim' | 'strong';
  silhouette: 'neutral' | 'rounded' | 'angular' | 'tall';
  colorPalette: string[];
}

interface AvatarPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  traits: AvatarTraits;
}

interface XRAvatarPresetListProps {
  presets: AvatarPreset[];
  selectedPresetId?: string;
  onPresetSelect?: (presetId: string) => void;
  onPresetApply?: (preset: AvatarPreset) => void;
}

// ============================================================
// CONSTANTS
// ============================================================

const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

const CATEGORY_CONFIG: Record<string, { icon: string; color: string }> = {
  standard: { icon: '⭐', color: CHENU_COLORS.sacredGold },
  sphere: { icon: '🌐', color: CHENU_COLORS.cenoteTurquoise },
  special: { icon: '✨', color: '#9B59B6' },
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  count: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  filters: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  filterChip: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  filterChipActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  presetCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  presetCardSelected: {
    borderColor: CHENU_COLORS.sacredGold,
    backgroundColor: `${CHENU_COLORS.sacredGold}10`,
  },
  presetPreview: {
    width: '50px',
    height: '60px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  previewHead: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    marginBottom: '-4px',
    zIndex: 1,
  },
  previewBody: {
    width: '24px',
    height: '28px',
    borderRadius: '6px',
  },
  presetInfo: {
    flex: 1,
    minWidth: 0,
  },
  presetName: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '2px',
  },
  presetDescription: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  presetMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '6px',
  },
  categoryBadge: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '9px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  traitBadge: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },
  applyButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.uiSlate,
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: CHENU_COLORS.ancientStone,
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRAvatarPresetList: React.FC<XRAvatarPresetListProps> = ({
  presets,
  selectedPresetId,
  onPresetSelect,
  onPresetApply,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(presets.map(p => p.category));
    return Array.from(cats);
  }, [presets]);

  // Filter presets
  const filteredPresets = useMemo(() => {
    if (!selectedCategory) return presets;
    return presets.filter(p => p.category === selectedCategory);
  }, [presets, selectedCategory]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📦</span>
          Avatar Presets
        </div>
        <div style={styles.count}>
          {filteredPresets.length} of {presets.length}
        </div>
      </div>

      {/* Category Filters */}
      <div style={styles.filters}>
        <div
          style={{
            ...styles.filterChip,
            ...(selectedCategory === null ? styles.filterChipActive : {}),
          }}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </div>
        {categories.map(category => {
          const config = CATEGORY_CONFIG[category] || { icon: '📍', color: CHENU_COLORS.ancientStone };
          return (
            <div
              key={category}
              style={{
                ...styles.filterChip,
                ...(selectedCategory === category ? styles.filterChipActive : {}),
              }}
              onClick={() => setSelectedCategory(category)}
            >
              <span>{config.icon}</span>
              {category}
            </div>
          );
        })}
      </div>

      {/* Preset List */}
      <div style={styles.list}>
        {filteredPresets.length > 0 ? (
          filteredPresets.map(preset => {
            const isSelected = preset.id === selectedPresetId;
            const primaryColor = preset.traits.colorPalette[0] || CHENU_COLORS.ancientStone;
            const secondaryColor = preset.traits.colorPalette[1] || primaryColor;
            const categoryConfig = CATEGORY_CONFIG[preset.category] || { icon: '📍', color: CHENU_COLORS.ancientStone };

            return (
              <div
                key={preset.id}
                style={{
                  ...styles.presetCard,
                  ...(isSelected ? styles.presetCardSelected : {}),
                }}
                onClick={() => onPresetSelect?.(preset.id)}
              >
                {/* Mini Preview */}
                <div
                  style={{
                    ...styles.presetPreview,
                    backgroundColor: `${primaryColor}20`,
                  }}
                >
                  <div
                    style={{
                      ...styles.previewHead,
                      backgroundColor: primaryColor,
                    }}
                  />
                  <div
                    style={{
                      ...styles.previewBody,
                      backgroundColor: secondaryColor,
                    }}
                  />
                </div>

                {/* Info */}
                <div style={styles.presetInfo}>
                  <div style={styles.presetName}>{preset.name}</div>
                  <div style={styles.presetDescription}>{preset.description}</div>
                  <div style={styles.presetMeta}>
                    <span
                      style={{
                        ...styles.categoryBadge,
                        backgroundColor: `${categoryConfig.color}20`,
                        color: categoryConfig.color,
                      }}
                    >
                      {categoryConfig.icon} {preset.category}
                    </span>
                    <span style={styles.traitBadge}>
                      H:{preset.traits.height.toFixed(1)} · {preset.traits.proportions} · {preset.traits.silhouette}
                    </span>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  style={styles.applyButton}
                  onClick={e => {
                    e.stopPropagation();
                    onPresetApply?.(preset);
                  }}
                >
                  Apply
                </button>
              </div>
            );
          })
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <div>No presets in this category</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default XRAvatarPresetList;
