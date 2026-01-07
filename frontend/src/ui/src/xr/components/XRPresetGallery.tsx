/**
 * ============================================================
 * CHE·NU — XR PRESET GALLERY
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Gallery view for XR room presets.
 * Displays available templates for each sphere.
 */

import React, { useState, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

interface XRPreset {
  id: string;
  name: string;
  description: string;
  sphere: string;
  domain?: string;
  tags: string[];
}

interface XRPresetGalleryProps {
  presets: XRPreset[];
  onPresetSelect?: (presetId: string) => void;
  onPresetLoad?: (presetId: string) => void;
  selectedPresetId?: string;
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

const SPHERE_CONFIG: Record<string, { color: string; icon: string; name: string }> = {
  personal: { color: CHENU_COLORS.sacredGold, icon: '🏠', name: 'Personal' },
  business: { color: CHENU_COLORS.jungleEmerald, icon: '💼', name: 'Business' },
  community: { color: CHENU_COLORS.cenoteTurquoise, icon: '🌐', name: 'Community' },
  social: { color: '#3498DB', icon: '👥', name: 'Social' },
  entertainment: { color: '#E74C3C', icon: '🎮', name: 'Entertainment' },
  ailab: { color: '#00D9FF', icon: '🤖', name: 'AI Lab' },
  scholar: { color: '#9B59B6', icon: '📚', name: 'Scholar' },
  creative: { color: '#F39C12', icon: '🎨', name: 'Creative' },
  xr: { color: '#00CED1', icon: '🌀', name: 'XR' },
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.uiSlate,
    borderRadius: '16px',
    padding: '20px',
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  filterChip: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: CHENU_COLORS.ancientStone,
  },
  filterChipActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    outline: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '2px solid transparent',
  },
  cardSelected: {
    borderColor: CHENU_COLORS.sacredGold,
  },
  cardHeader: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '2px',
  },
  cardSphere: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  cardBody: {
    padding: '0 16px 16px',
  },
  cardDescription: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    lineHeight: 1.5,
    marginBottom: '12px',
  },
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tag: {
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: CHENU_COLORS.ancientStone,
  },
  cardActions: {
    padding: '12px 16px',
    borderTop: `1px solid ${CHENU_COLORS.shadowMoss}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
  },
  buttonPrimary: {
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.uiSlate,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.softSand,
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: CHENU_COLORS.ancientStone,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  stats: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    gap: '16px',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRPresetGallery: React.FC<XRPresetGalleryProps> = ({
  presets,
  onPresetSelect,
  onPresetLoad,
  selectedPresetId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSphere, setSelectedSphere] = useState<string | null>(null);

  // Get unique spheres
  const spheres = useMemo(() => {
    const uniqueSpheres = new Set(presets.map(p => p.sphere));
    return Array.from(uniqueSpheres);
  }, [presets]);

  // Filter presets
  const filteredPresets = useMemo(() => {
    return presets.filter(preset => {
      // Filter by sphere
      if (selectedSphere && preset.sphere !== selectedSphere) return false;
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = preset.name.toLowerCase().includes(query);
        const matchesDescription = preset.description.toLowerCase().includes(query);
        const matchesTags = preset.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesName && !matchesDescription && !matchesTags) return false;
      }
      
      return true;
    });
  }, [presets, selectedSphere, searchQuery]);

  // Group presets by sphere
  const presetsBySphere = useMemo(() => {
    const grouped: Record<string, XRPreset[]> = {};
    for (const preset of filteredPresets) {
      if (!grouped[preset.sphere]) {
        grouped[preset.sphere] = [];
      }
      grouped[preset.sphere].push(preset);
    }
    return grouped;
  }, [filteredPresets]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🎨</span>
          Preset Gallery
        </div>
        <div style={styles.stats}>
          <span>📦 {presets.length} presets</span>
          <span>🔍 {filteredPresets.length} shown</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Search presets..."
          style={styles.searchInput}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        
        <div
          style={{
            ...styles.filterChip,
            ...(selectedSphere === null ? styles.filterChipActive : {}),
          }}
          onClick={() => setSelectedSphere(null)}
        >
          All Spheres
        </div>
        
        {spheres.map(sphere => {
          const config = SPHERE_CONFIG[sphere] || { icon: '📍', name: sphere };
          return (
            <div
              key={sphere}
              style={{
                ...styles.filterChip,
                ...(selectedSphere === sphere ? styles.filterChipActive : {}),
              }}
              onClick={() => setSelectedSphere(sphere)}
            >
              {config.icon} {config.name}
            </div>
          );
        })}
      </div>

      {/* Preset Grid */}
      {filteredPresets.length > 0 ? (
        <div style={styles.grid}>
          {filteredPresets.map(preset => {
            const sphereConfig = SPHERE_CONFIG[preset.sphere] || {
              color: CHENU_COLORS.ancientStone,
              icon: '📍',
              name: preset.sphere,
            };
            const isSelected = preset.id === selectedPresetId;

            return (
              <div
                key={preset.id}
                style={{
                  ...styles.card,
                  ...(isSelected ? styles.cardSelected : {}),
                }}
                onClick={() => onPresetSelect?.(preset.id)}
              >
                <div style={styles.cardHeader}>
                  <div
                    style={{
                      ...styles.cardIcon,
                      backgroundColor: `${sphereConfig.color}30`,
                    }}
                  >
                    {sphereConfig.icon}
                  </div>
                  <div style={styles.cardInfo}>
                    <div style={styles.cardName}>{preset.name}</div>
                    <div style={styles.cardSphere}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: sphereConfig.color,
                        }}
                      />
                      {sphereConfig.name}
                      {preset.domain && ` / ${preset.domain}`}
                    </div>
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.cardDescription}>{preset.description}</div>
                  <div style={styles.cardTags}>
                    {preset.tags.slice(0, 4).map(tag => (
                      <span key={tag} style={styles.tag}>
                        {tag}
                      </span>
                    ))}
                    {preset.tags.length > 4 && (
                      <span style={styles.tag}>+{preset.tags.length - 4}</span>
                    )}
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <button
                    style={{ ...styles.button, ...styles.buttonSecondary }}
                    onClick={e => {
                      e.stopPropagation();
                      onPresetSelect?.(preset.id);
                    }}
                  >
                    👁️ Preview
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.buttonPrimary }}
                    onClick={e => {
                      e.stopPropagation();
                      onPresetLoad?.(preset.id);
                    }}
                  >
                    ⚡ Load
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔍</div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>No presets found</div>
          <div style={{ fontSize: '13px' }}>
            {searchQuery
              ? `No presets match "${searchQuery}"`
              : 'No presets available for this sphere'}
          </div>
        </div>
      )}
    </div>
  );
};

export default XRPresetGallery;
