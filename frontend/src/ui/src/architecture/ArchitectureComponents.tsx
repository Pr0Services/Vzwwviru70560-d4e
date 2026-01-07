/**
 * ============================================================
 * CHE·NU — ARCHITECTURE UI COMPONENTS
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * UI components for Architecture domain visualization.
 * All components are REPRESENTATIONAL displays only.
 */

import React, { useState } from 'react';

// ============================================================
// COLORS (CHE·NU Palette)
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
  cardBg: '#2A2B2F',
  borderColor: '#3A3B40',
  textPrimary: '#FFFFFF',
  textSecondary: '#B8B9BD',
  textMuted: '#6B6C70',
};

// ============================================================
// TYPES
// ============================================================

export interface BlueprintGridCell {
  x: number;
  y: number;
  type?: 'column' | 'wall' | 'opening' | 'room' | 'empty';
  label?: string;
  zone?: string;
}

export interface SymbolicZone {
  id: string;
  name: string;
  type: string;
  color: string;
  cells?: Array<{ x: number; y: number }>;
}

export interface SymbolicRoom {
  id: string;
  name: string;
  type: string;
  size: 'small' | 'medium' | 'large';
  connections: string[];
}

// ============================================================
// BLUEPRINT GRID VIEWER
// ============================================================

interface BlueprintGridViewerProps {
  columns: number;
  rows: number;
  cells?: BlueprintGridCell[];
  zones?: SymbolicZone[];
  onCellClick?: (x: number, y: number) => void;
  showGrid?: boolean;
  showLabels?: boolean;
}

export const BlueprintGridViewer: React.FC<BlueprintGridViewerProps> = ({
  columns,
  rows,
  cells = [],
  zones = [],
  onCellClick,
  showGrid = true,
  showLabels = true,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  const cellSize = 40;
  const width = columns * cellSize;
  const height = rows * cellSize;

  // Build cell map
  const cellMap = new Map<string, BlueprintGridCell>();
  cells.forEach(cell => {
    cellMap.set(`${cell.x},${cell.y}`, cell);
  });

  // Build zone color map
  const zoneColors = new Map<string, string>();
  zones.forEach(zone => {
    zoneColors.set(zone.id, zone.color);
  });

  const getCellStyle = (x: number, y: number): React.CSSProperties => {
    const cell = cellMap.get(`${x},${y}`);
    const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
    
    let backgroundColor = 'transparent';
    let borderColor = CHENU_COLORS.borderColor;
    
    if (cell?.zone) {
      backgroundColor = zoneColors.get(cell.zone) || 'rgba(62,180,162,0.2)';
    }
    
    if (cell?.type === 'column') {
      backgroundColor = CHENU_COLORS.sacredGold;
    } else if (cell?.type === 'wall') {
      backgroundColor = CHENU_COLORS.ancientStone;
    } else if (cell?.type === 'opening') {
      backgroundColor = 'transparent';
      borderColor = CHENU_COLORS.cenoteTurquoise;
    }
    
    return {
      width: cellSize,
      height: cellSize,
      backgroundColor,
      border: showGrid ? `1px solid ${borderColor}` : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: onCellClick ? 'pointer' : 'default',
      transition: 'all 0.15s ease',
      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      zIndex: isHovered ? 10 : 1,
      position: 'relative',
    };
  };

  return (
    <div style={{
      backgroundColor: CHENU_COLORS.cardBg,
      borderRadius: '12px',
      border: `1px solid ${CHENU_COLORS.borderColor}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
        backgroundColor: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 600,
          color: CHENU_COLORS.textPrimary,
        }}>
          <span>📐</span>
          <span>Blueprint Grid</span>
        </div>
        <div style={{ fontSize: '11px', color: CHENU_COLORS.textMuted }}>
          {columns} × {rows} grid
        </div>
      </div>

      {/* Grid */}
      <div style={{
        padding: '20px',
        overflowX: 'auto',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: '0px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: '2px',
          borderRadius: '4px',
        }}>
          {Array.from({ length: rows }).map((_, y) =>
            Array.from({ length: columns }).map((_, x) => {
              const cell = cellMap.get(`${x},${y}`);
              return (
                <div
                  key={`${x}-${y}`}
                  style={getCellStyle(x, y)}
                  onClick={() => onCellClick?.(x, y)}
                  onMouseEnter={() => setHoveredCell({ x, y })}
                  onMouseLeave={() => setHoveredCell(null)}
                  title={cell?.label || `(${x}, ${y})`}
                >
                  {showLabels && cell?.type === 'column' && (
                    <span style={{ fontSize: '10px', color: CHENU_COLORS.uiSlate }}>●</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      {zones.length > 0 && (
        <div style={{
          padding: '12px 16px',
          borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
          backgroundColor: 'rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          {zones.map(zone => (
            <div key={zone.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: CHENU_COLORS.textMuted,
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: zone.color,
                borderRadius: '2px',
              }} />
              <span>{zone.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div style={{
        padding: '8px 16px',
        borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
        backgroundColor: 'rgba(0,0,0,0.1)',
        fontSize: '10px',
        color: CHENU_COLORS.jungleEmerald,
        textAlign: 'center',
      }}>
        🛡️ SYMBOLIC BLUEPRINT — NOT FOR CONSTRUCTION
      </div>
    </div>
  );
};

// ============================================================
// ZONE MAPPER
// ============================================================

interface ZoneMapperProps {
  zones: SymbolicZone[];
  rooms?: SymbolicRoom[];
  onZoneClick?: (zone: SymbolicZone) => void;
  layout?: 'bubble' | 'grid' | 'list';
}

export const ZoneMapper: React.FC<ZoneMapperProps> = ({
  zones,
  rooms = [],
  onZoneClick,
  layout = 'bubble',
}) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const handleZoneClick = (zone: SymbolicZone) => {
    setSelectedZone(zone.id === selectedZone ? null : zone.id);
    onZoneClick?.(zone);
  };

  const getZoneSize = (zone: SymbolicZone): number => {
    const roomCount = rooms.filter(r => r.type === zone.type).length;
    return Math.max(80, 60 + roomCount * 20);
  };

  return (
    <div style={{
      backgroundColor: CHENU_COLORS.cardBg,
      borderRadius: '12px',
      border: `1px solid ${CHENU_COLORS.borderColor}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
        backgroundColor: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 600,
          color: CHENU_COLORS.textPrimary,
        }}>
          <span>🗺️</span>
          <span>Zone Mapper</span>
        </div>
        <div style={{ fontSize: '11px', color: CHENU_COLORS.textMuted }}>
          {zones.length} zones
        </div>
      </div>

      {/* Zones Display */}
      <div style={{
        padding: '30px',
        minHeight: '300px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
      }}>
        {zones.map((zone, index) => {
          const size = getZoneSize(zone);
          const isSelected = zone.id === selectedZone;
          
          return (
            <div
              key={zone.id}
              onClick={() => handleZoneClick(zone)}
              style={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: zone.color,
                border: isSelected 
                  ? `3px solid ${CHENU_COLORS.textPrimary}`
                  : `2px solid ${zone.color}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isSelected 
                  ? `0 0 20px ${zone.color}80`
                  : '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: CHENU_COLORS.textPrimary,
                textAlign: 'center',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}>
                {zone.name}
              </span>
              <span style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.7)',
                marginTop: '4px',
              }}>
                {zone.type}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Zone Info */}
      {selectedZone && (
        <div style={{
          padding: '16px',
          borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}>
          {(() => {
            const zone = zones.find(z => z.id === selectedZone);
            if (!zone) return null;
            const zoneRooms = rooms.filter(r => r.type === zone.type);
            
            return (
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: CHENU_COLORS.textPrimary,
                  marginBottom: '8px',
                }}>
                  {zone.name}
                </div>
                <div style={{ fontSize: '12px', color: CHENU_COLORS.textSecondary }}>
                  Type: {zone.type} | Rooms: {zoneRooms.length}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Disclaimer */}
      <div style={{
        padding: '8px 16px',
        borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
        backgroundColor: 'rgba(0,0,0,0.1)',
        fontSize: '10px',
        color: CHENU_COLORS.jungleEmerald,
        textAlign: 'center',
      }}>
        🛡️ CONCEPTUAL ZONING — ILLUSTRATIVE ONLY
      </div>
    </div>
  );
};

// ============================================================
// ROOM RELATIONSHIP DIAGRAM
// ============================================================

interface RoomRelationshipDiagramProps {
  rooms: SymbolicRoom[];
  highlightRoom?: string;
  onRoomClick?: (room: SymbolicRoom) => void;
}

export const RoomRelationshipDiagram: React.FC<RoomRelationshipDiagramProps> = ({
  rooms,
  highlightRoom,
  onRoomClick,
}) => {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const getRoomColor = (room: SymbolicRoom): string => {
    switch (room.type) {
      case 'workspace': return CHENU_COLORS.cenoteTurquoise;
      case 'meeting': return CHENU_COLORS.sacredGold;
      case 'common': return CHENU_COLORS.jungleEmerald;
      case 'private': return CHENU_COLORS.earthEmber;
      case 'service': return CHENU_COLORS.ancientStone;
      default: return CHENU_COLORS.shadowMoss;
    }
  };

  const getRoomSize = (room: SymbolicRoom): number => {
    switch (room.size) {
      case 'small': return 60;
      case 'medium': return 80;
      case 'large': return 100;
      default: return 70;
    }
  };

  return (
    <div style={{
      backgroundColor: CHENU_COLORS.cardBg,
      borderRadius: '12px',
      border: `1px solid ${CHENU_COLORS.borderColor}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
        backgroundColor: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 600,
          color: CHENU_COLORS.textPrimary,
        }}>
          <span>🏠</span>
          <span>Room Relationships</span>
        </div>
        <div style={{ fontSize: '11px', color: CHENU_COLORS.textMuted }}>
          {rooms.length} rooms
        </div>
      </div>

      {/* Rooms Display */}
      <div style={{
        padding: '30px',
        minHeight: '250px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
      }}>
        {rooms.map(room => {
          const size = getRoomSize(room);
          const color = getRoomColor(room);
          const isHighlighted = room.id === highlightRoom;
          const isHovered = room.id === hoveredRoom;
          const isConnected = hoveredRoom 
            ? rooms.find(r => r.id === hoveredRoom)?.connections.includes(room.id)
            : false;
          
          return (
            <div
              key={room.id}
              onClick={() => onRoomClick?.(room)}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              style={{
                width: size,
                height: size,
                borderRadius: '8px',
                backgroundColor: color,
                border: isHighlighted || isHovered
                  ? `3px solid ${CHENU_COLORS.textPrimary}`
                  : isConnected
                    ? `2px dashed ${CHENU_COLORS.cenoteTurquoise}`
                    : `2px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                opacity: hoveredRoom && !isHovered && !isConnected ? 0.5 : 1,
              }}
            >
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: CHENU_COLORS.textPrimary,
                textAlign: 'center',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}>
                {room.name}
              </span>
              <span style={{
                fontSize: '9px',
                color: 'rgba(255,255,255,0.7)',
                marginTop: '2px',
              }}>
                {room.connections.length} links
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        padding: '12px 16px',
        borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
        backgroundColor: 'rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        fontSize: '10px',
        color: CHENU_COLORS.textMuted,
      }}>
        <span>📍 Workspace</span>
        <span>🏛️ Meeting</span>
        <span>🌿 Common</span>
        <span>🔒 Private</span>
        <span>⚙️ Service</span>
      </div>

      {/* Disclaimer */}
      <div style={{
        padding: '8px 16px',
        borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
        backgroundColor: 'rgba(0,0,0,0.1)',
        fontSize: '10px',
        color: CHENU_COLORS.jungleEmerald,
        textAlign: 'center',
      }}>
        🛡️ SYMBOLIC ROOM LAYOUT — CONCEPTUAL ONLY
      </div>
    </div>
  );
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  BlueprintGridViewer,
  ZoneMapper,
  RoomRelationshipDiagram,
};
