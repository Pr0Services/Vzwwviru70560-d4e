/**
 * ============================================================
 * CHE·NU — ARCHITECTURE ROOM MAPPER
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Room layout and relationship visualization component
 * Symbolic representation only
 */

import React, { useState, useMemo } from 'react';
import {
  CHENU_COLORS,
  ARCHITECTURE_COLORS,
  baseStyles,
  architectureStyles,
  mergeStyles,
} from './architectureStyles';

// ============================================================
// TYPES
// ============================================================

export type RoomType = 'workspace' | 'meeting' | 'common' | 'private' | 'storage' | 'circulation' | 'service' | 'outdoor' | 'virtual' | 'custom';
export type RoomSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  size: RoomSize;
  zone?: string;
  connections: string[];
  notes?: string;
}

export interface RoomConnection {
  from: string;
  to: string;
  type?: 'adjacent' | 'connected' | 'visual' | 'circulation';
}

export interface RoomMapperProps {
  rooms?: Room[];
  connections?: RoomConnection[];
  selectedRoom?: string | null;
  onRoomClick?: (room: Room) => void;
  onConnectionClick?: (connection: RoomConnection) => void;
  layout?: 'grid' | 'flow' | 'radial';
  showConnections?: boolean;
  showZones?: boolean;
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    ...baseStyles.card,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  controls: {
    display: 'flex',
    gap: '8px',
  },
  layoutButton: {
    ...baseStyles.button,
    ...baseStyles.buttonSecondary,
    padding: '6px 12px',
    fontSize: '11px',
  },
  layoutButtonActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  mapContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    padding: '24px',
    minHeight: '400px',
    position: 'relative',
  },
  roomsGrid: {
    display: 'grid',
    gap: '16px',
  },
  roomCard: {
    ...architectureStyles.roomCard,
    position: 'relative',
  },
  roomCardSelected: {
    borderColor: CHENU_COLORS.sacredGold,
    boxShadow: `0 0 0 3px ${CHENU_COLORS.sacredGold}40`,
  },
  roomHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  roomName: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
  },
  roomType: {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '10px',
    backgroundColor: 'rgba(62,180,162,0.3)',
    color: ARCHITECTURE_COLORS.room,
    textTransform: 'uppercase',
  },
  roomSize: {
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
  },
  roomZone: {
    fontSize: '11px',
    color: CHENU_COLORS.jungleEmerald,
    marginTop: '4px',
  },
  roomConnections: {
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: `1px solid rgba(62,180,162,0.2)`,
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
  },
  connectionDot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    marginRight: '4px',
  },
  statsBar: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
    padding: '12px 16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  statLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
    textTransform: 'uppercase',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '16px',
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendIcon: {
    fontSize: '14px',
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
  footer: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safetyBadge: {
    ...architectureStyles.safetyBadge,
  },
};

// ============================================================
// ROOM TYPE CONFIG
// ============================================================

const ROOM_TYPE_CONFIG: Record<RoomType, { icon: string; color: string }> = {
  workspace: { icon: '💼', color: ARCHITECTURE_COLORS.room },
  meeting: { icon: '🤝', color: '#9C27B0' },
  common: { icon: '🛋️', color: '#FF9800' },
  private: { icon: '🔒', color: CHENU_COLORS.earthEmber },
  storage: { icon: '📦', color: CHENU_COLORS.ancientStone },
  circulation: { icon: '🚶', color: '#4CAF50' },
  service: { icon: '🔧', color: '#607D8B' },
  outdoor: { icon: '🌳', color: CHENU_COLORS.jungleEmerald },
  virtual: { icon: '🌀', color: '#00BCD4' },
  custom: { icon: '⚡', color: CHENU_COLORS.sacredGold },
};

const SIZE_CONFIG: Record<RoomSize, string> = {
  small: 'S',
  medium: 'M',
  large: 'L',
  xlarge: 'XL',
};

// ============================================================
// COMPONENT
// ============================================================

export const RoomMapper: React.FC<RoomMapperProps> = ({
  rooms = [],
  connections = [],
  selectedRoom,
  onRoomClick,
  onConnectionClick,
  layout = 'grid',
  showConnections = true,
  showZones = true,
}) => {
  const [activeLayout, setActiveLayout] = useState(layout);

  // Group rooms by zone
  const roomsByZone = useMemo(() => {
    const grouped: Record<string, Room[]> = { _unzoned: [] };
    rooms.forEach(room => {
      const zone = room.zone || '_unzoned';
      if (!grouped[zone]) grouped[zone] = [];
      grouped[zone].push(room);
    });
    return grouped;
  }, [rooms]);

  // Get room types present
  const roomTypes = useMemo(() => {
    return [...new Set(rooms.map(r => r.type))];
  }, [rooms]);

  // Calculate grid columns based on layout
  const gridColumns = useMemo(() => {
    switch (activeLayout) {
      case 'flow': return 2;
      case 'radial': return 3;
      default: return Math.min(4, Math.max(2, Math.ceil(Math.sqrt(rooms.length))));
    }
  }, [activeLayout, rooms.length]);

  // Handle room click
  const handleRoomClick = (room: Room) => {
    onRoomClick?.(room);
  };

  // Empty state
  if (rooms.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span>🏠</span>
            <span>Room Mapper</span>
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🏠</div>
          <div>No rooms defined</div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
            Add rooms to see the layout
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
          <span>🏠</span>
          <span>Room Mapper</span>
        </div>
        <div style={styles.controls}>
          {(['grid', 'flow', 'radial'] as const).map(l => (
            <button
              key={l}
              onClick={() => setActiveLayout(l)}
              style={mergeStyles(
                styles.layoutButton,
                activeLayout === l ? styles.layoutButtonActive : undefined
              )}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div style={styles.mapContainer}>
        <div
          style={{
            ...styles.roomsGrid,
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          }}
        >
          {rooms.map(room => {
            const typeConfig = ROOM_TYPE_CONFIG[room.type];
            const isSelected = selectedRoom === room.id;
            const roomConnections = connections.filter(
              c => c.from === room.id || c.to === room.id
            );

            return (
              <div
                key={room.id}
                style={mergeStyles(
                  styles.roomCard,
                  isSelected ? styles.roomCardSelected : undefined
                )}
                onClick={() => handleRoomClick(room)}
              >
                {/* Room Header */}
                <div style={styles.roomHeader}>
                  <span style={styles.roomName}>
                    {typeConfig.icon} {room.name}
                  </span>
                  <span style={styles.roomType}>{room.type}</span>
                </div>

                {/* Room Size */}
                <div style={styles.roomSize}>
                  Size: {SIZE_CONFIG[room.size]}
                </div>

                {/* Zone */}
                {showZones && room.zone && (
                  <div style={styles.roomZone}>
                    Zone: {room.zone}
                  </div>
                )}

                {/* Connections */}
                {showConnections && roomConnections.length > 0 && (
                  <div style={styles.roomConnections}>
                    <span style={styles.connectionDot} />
                    {roomConnections.length} connection{roomConnections.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{rooms.length}</div>
          <div style={styles.statLabel}>Rooms</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{connections.length}</div>
          <div style={styles.statLabel}>Connections</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{Object.keys(roomsByZone).filter(z => z !== '_unzoned').length}</div>
          <div style={styles.statLabel}>Zones</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{roomTypes.length}</div>
          <div style={styles.statLabel}>Types</div>
        </div>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {roomTypes.map(type => (
          <div key={type} style={styles.legendItem}>
            <span style={styles.legendIcon}>{ROOM_TYPE_CONFIG[type].icon}</span>
            <span>{type}</span>
            <span>({rooms.filter(r => r.type === type).length})</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={{ fontSize: '11px', color: CHENU_COLORS.textMuted }}>
          Layout: {activeLayout} • Click room for details
        </span>
        <div style={styles.safetyBadge}>
          🛡️ SAFE · SYMBOLIC
        </div>
      </div>
    </div>
  );
};

export default RoomMapper;
