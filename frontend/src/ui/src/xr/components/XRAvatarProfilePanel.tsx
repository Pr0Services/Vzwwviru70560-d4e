/**
 * ============================================================
 * CHE·NU — XR AVATAR PROFILE PANEL
 * SAFE · NON-BIOMETRIC · SYMBOLIC
 * ============================================================
 * 
 * Displays structured avatar profile information.
 * JSON-like read-only view of avatar morphology.
 */

import React, { useState } from 'react';

// ============================================================
// TYPES
// ============================================================

interface AvatarTraits {
  height: number;
  proportions: 'balanced' | 'compact' | 'slim' | 'strong';
  silhouette: 'neutral' | 'rounded' | 'angular' | 'tall';
  colorPalette: string[];
}

interface AvatarMorphology {
  id: string;
  name: string;
  traits: AvatarTraits;
  meta?: Record<string, unknown>;
}

interface XRAvatarProfilePanelProps {
  avatar: AvatarMorphology;
  onCopy?: (json: string) => void;
  showRaw?: boolean;
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

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.softSand,
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  content: {
    padding: '16px',
  },
  section: {
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '10px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  field: {
    padding: '10px 12px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  fieldLabel: {
    fontSize: '9px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    marginBottom: '4px',
  },
  fieldValue: {
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
  },
  fieldValueMono: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
  },
  colorGrid: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  colorItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '6px',
  },
  colorSwatch: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  colorHex: {
    fontSize: '11px',
    fontFamily: "'JetBrains Mono', monospace",
    color: CHENU_COLORS.ancientStone,
  },
  rawJson: {
    padding: '12px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '8px',
    fontSize: '11px',
    fontFamily: "'JetBrains Mono', monospace",
    color: CHENU_COLORS.softSand,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '0 16px',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  tab: {
    padding: '10px 14px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    color: CHENU_COLORS.cenoteTurquoise,
    borderBottomColor: CHENU_COLORS.cenoteTurquoise,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 10px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '6px',
    marginBottom: '6px',
  },
  metaKey: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  metaValue: {
    fontSize: '11px',
    color: CHENU_COLORS.softSand,
    fontFamily: "'JetBrains Mono', monospace",
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRAvatarProfilePanel: React.FC<XRAvatarProfilePanelProps> = ({
  avatar,
  onCopy,
  showRaw = true,
}) => {
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw'>('formatted');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const json = JSON.stringify(avatar, null, 2);
    if (onCopy) {
      onCopy(json);
    } else {
      navigator.clipboard?.writeText(json);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📋</span>
          Avatar Profile
        </div>
        <div style={styles.actions}>
          <button style={styles.actionButton} onClick={handleCopy}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      {showRaw && (
        <div style={styles.tabs}>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'formatted' ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab('formatted')}
          >
            Formatted
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'raw' ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab('raw')}
          >
            Raw JSON
          </div>
        </div>
      )}

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'formatted' ? (
          <>
            {/* Identity Section */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span>🏷️</span>
                Identity
              </div>
              <div style={styles.fieldGrid}>
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>ID</div>
                  <div style={{ ...styles.fieldValue, ...styles.fieldValueMono }}>
                    {avatar.id}
                  </div>
                </div>
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Name</div>
                  <div style={styles.fieldValue}>{avatar.name}</div>
                </div>
              </div>
            </div>

            {/* Traits Section */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span>⚙️</span>
                Traits
              </div>
              <div style={styles.fieldGrid}>
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Height</div>
                  <div style={styles.fieldValue}>{avatar.traits.height.toFixed(2)}</div>
                </div>
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Proportions</div>
                  <div style={styles.fieldValue}>{avatar.traits.proportions}</div>
                </div>
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Silhouette</div>
                  <div style={styles.fieldValue}>{avatar.traits.silhouette}</div>
                </div>
                <div style={styles.field}>
                  <div style={styles.fieldLabel}>Colors</div>
                  <div style={styles.fieldValue}>{avatar.traits.colorPalette.length}</div>
                </div>
              </div>
            </div>

            {/* Color Palette Section */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span>🎨</span>
                Color Palette
              </div>
              <div style={styles.colorGrid}>
                {avatar.traits.colorPalette.map((color, i) => (
                  <div key={i} style={styles.colorItem}>
                    <div
                      style={{
                        ...styles.colorSwatch,
                        backgroundColor: color,
                      }}
                    />
                    <span style={styles.colorHex}>{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta Section */}
            {avatar.meta && Object.keys(avatar.meta).length > 0 && (
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  <span>📦</span>
                  Metadata
                </div>
                {Object.entries(avatar.meta).map(([key, value]) => (
                  <div key={key} style={styles.metaItem}>
                    <span style={styles.metaKey}>{key}</span>
                    <span style={styles.metaValue}>
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={styles.rawJson}>
            {JSON.stringify(avatar, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default XRAvatarProfilePanel;
