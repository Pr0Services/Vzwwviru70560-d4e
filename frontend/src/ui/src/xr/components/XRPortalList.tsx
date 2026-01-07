/**
 * ============================================================
 * CHE·NU — XR PORTAL LIST
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState, useMemo, useCallback } from 'react';

// ============================================================
// TYPES
// ============================================================

interface XRPortal {
  id: string;
  fromScene: string;
  fromSceneName: string;
  toScene: string;
  toSceneName: string;
  fromSector?: string;
  toSector?: string;
  label?: string;
  style: string;
  bidirectional: boolean;
  active: boolean;
}

interface XRPortalListProps {
  portals: XRPortal[];
  onSelect?: (portalId: string | null) => void;
  onToggle?: (portalId: string) => void;
  onDelete?: (portalId: string) => void;
  selectedId?: string | null;
  compact?: boolean;
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

const PORTAL_STYLE_ICONS: Record<string, string> = {
  door: '🚪',
  arch: '🌉',
  ring: '⭕',
  vortex: '🌀',
  minimal: '◯',
  bridge: '🌁',
  elevator: '🛗',
  teleport: '✨',
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: CHENU_COLORS.softSand,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
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
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  filters: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  filterButton: {
    padding: '6px 12px',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 500,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: CHENU_COLORS.ancientStone,
    transition: 'all 0.2s ease',
  },
  filterButtonActive: {
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}30`,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '400px',
    overflow: 'auto',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    padding: '12px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cardSelected: {
    borderColor: CHENU_COLORS.sacredGold,
    backgroundColor: `${CHENU_COLORS.sacredGold}10`,
  },
  cardInactive: {
    opacity: 0.5,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  portalIcon: {
    fontSize: '16px',
  },
  portalLabel: {
    fontSize: '13px',
    fontWeight: 500,
  },
  statusBadge: {
    padding: '3px 8px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  activeBadge: {
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}30`,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  inactiveBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.ancientStone,
  },
  connection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '8px',
  },
  sceneName: {
    padding: '4px 8px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '4px',
    color: CHENU_COLORS.softSand,
  },
  arrow: {
    color: CHENU_COLORS.cenoteTurquoise,
    fontWeight: 600,
  },
  meta: {
    display: 'flex',
    gap: '12px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  actions: {
    display: 'flex',
    gap: '6px',
    marginTop: '8px',
  },
  actionButton: {
    padding: '4px 8px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '11px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.softSand,
    transition: 'all 0.2s ease',
  },
  deleteButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    color: '#E74C3C',
  },
  emptyState: {
    textAlign: 'center',
    padding: '30px 20px',
    color: CHENU_COLORS.ancientStone,
  },
  compactCard: {
    padding: '8px 10px',
  },
  compactConnection: {
    fontSize: '11px',
    marginBottom: '0',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRPortalList: React.FC<XRPortalListProps> = ({
  portals,
  onSelect,
  onToggle,
  onDelete,
  selectedId,
  compact = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'bidirectional'>('all');

  const filteredPortals = useMemo(() => {
    switch (filter) {
      case 'active':
        return portals.filter(p => p.active);
      case 'inactive':
        return portals.filter(p => !p.active);
      case 'bidirectional':
        return portals.filter(p => p.bidirectional);
      default:
        return portals;
    }
  }, [portals, filter]);

  const handleSelect = useCallback((portalId: string) => {
    onSelect?.(selectedId === portalId ? null : portalId);
  }, [selectedId, onSelect]);

  const getStyleIcon = useCallback((style: string) => {
    return PORTAL_STYLE_ICONS[style] ?? '🌀';
  }, []);

  if (portals.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌀</div>
          <div>No portals defined</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            Create links between scenes to add portals
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🌀</span>
          Portals
        </div>
        <span style={styles.count}>{filteredPortals.length} / {portals.length}</span>
      </div>

      {/* Filters */}
      {!compact && (
        <div style={styles.filters}>
          {(['all', 'active', 'inactive', 'bidirectional'] as const).map(f => (
            <button
              key={f}
              style={{
                ...styles.filterButton,
                ...(filter === f ? styles.filterButtonActive : {}),
              }}
              onClick={() => setFilter(f)}
            >
              {f === 'all' && '📋 All'}
              {f === 'active' && '✅ Active'}
              {f === 'inactive' && '⏸️ Inactive'}
              {f === 'bidirectional' && '⟷ Bidirectional'}
            </button>
          ))}
        </div>
      )}

      {/* Portal List */}
      <div style={styles.list}>
        {filteredPortals.map(portal => (
          <div
            key={portal.id}
            style={{
              ...styles.card,
              ...(selectedId === portal.id ? styles.cardSelected : {}),
              ...(!portal.active ? styles.cardInactive : {}),
              ...(compact ? styles.compactCard : {}),
            }}
            onClick={() => handleSelect(portal.id)}
          >
            {/* Header Row */}
            <div style={styles.cardHeader}>
              <div style={styles.labelRow}>
                <span style={styles.portalIcon}>{getStyleIcon(portal.style)}</span>
                <span style={styles.portalLabel}>{portal.label ?? 'Portal'}</span>
              </div>
              <span
                style={{
                  ...styles.statusBadge,
                  ...(portal.active ? styles.activeBadge : styles.inactiveBadge),
                }}
              >
                {portal.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Connection */}
            <div style={{
              ...styles.connection,
              ...(compact ? styles.compactConnection : {}),
            }}>
              <span style={styles.sceneName}>{portal.fromSceneName}</span>
              {portal.fromSector && (
                <span style={{ fontSize: '10px' }}>({portal.fromSector})</span>
              )}
              <span style={styles.arrow}>
                {portal.bidirectional ? '⟷' : '→'}
              </span>
              <span style={styles.sceneName}>{portal.toSceneName}</span>
              {portal.toSector && (
                <span style={{ fontSize: '10px' }}>({portal.toSector})</span>
              )}
            </div>

            {/* Meta */}
            {!compact && (
              <div style={styles.meta}>
                <div style={styles.metaItem}>
                  <span>🎨</span>
                  {portal.style}
                </div>
                <div style={styles.metaItem}>
                  <span>{portal.bidirectional ? '⟷' : '→'}</span>
                  {portal.bidirectional ? 'Two-way' : 'One-way'}
                </div>
              </div>
            )}

            {/* Actions */}
            {!compact && selectedId === portal.id && (
              <div style={styles.actions}>
                {onToggle && (
                  <button
                    style={styles.actionButton}
                    onClick={e => {
                      e.stopPropagation();
                      onToggle(portal.id);
                    }}
                  >
                    {portal.active ? '⏸️ Disable' : '▶️ Enable'}
                  </button>
                )}
                <button style={styles.actionButton}>✏️ Edit</button>
                {onDelete && (
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(portal.id);
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default XRPortalList;
