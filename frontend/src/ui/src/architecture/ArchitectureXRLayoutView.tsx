/**
 * ============================================================
 * CHE·NU — ARCHITECTURE XR LAYOUT VIEW
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * XR spatial layout preview for Architecture domain
 * Symbolic representation only - NO real WebXR/WebGL
 */

import React, { useState } from 'react';
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

export type XRSectorType = 'blueprints_panel' | 'zoning_grid' | 'structural_diagram' | 'xr_layout_columns' | 'floor_grid' | 'custom';

export interface XRSector {
  id: string;
  name: string;
  type: XRSectorType;
  position: 'left' | 'center' | 'right' | 'front' | 'back';
  objectCount?: number;
}

export interface XRObject {
  id: string;
  type: 'panel' | 'grid' | 'column' | 'volume' | 'marker' | 'label';
  label: string;
  sectorId: string;
}

export interface ArchitectureXRLayoutViewProps {
  sceneName?: string;
  roomType?: 'architectural_room' | 'blueprint_room' | 'zoning_room' | 'structural_room';
  sectors?: XRSector[];
  objects?: XRObject[];
  onSectorClick?: (sector: XRSector) => void;
  onObjectClick?: (object: XRObject) => void;
  onOpenInXR?: () => void;
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
  xrButton: {
    ...baseStyles.button,
    backgroundColor: ARCHITECTURE_COLORS.xrSpatialArchitecture,
    color: CHENU_COLORS.uiSlate,
  },
  previewContainer: {
    ...architectureStyles.xrLayoutContainer,
    minHeight: '350px',
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr',
    gridTemplateRows: '1fr 2fr 1fr',
    gap: '12px',
    padding: '20px',
  },
  sector: {
    ...architectureStyles.xrSector,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  sectorHover: {
    backgroundColor: 'rgba(0,188,212,0.25)',
    borderColor: ARCHITECTURE_COLORS.xrSpatialArchitecture,
    transform: 'scale(1.02)',
  },
  sectorSelected: {
    backgroundColor: 'rgba(0,188,212,0.3)',
    borderColor: ARCHITECTURE_COLORS.xrSpatialArchitecture,
    boxShadow: `0 0 0 3px ${ARCHITECTURE_COLORS.xrSpatialArchitecture}40`,
  },
  sectorIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  sectorName: {
    fontSize: '12px',
    fontWeight: 500,
    color: CHENU_COLORS.textPrimary,
  },
  sectorType: {
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
    marginTop: '4px',
  },
  sectorObjects: {
    fontSize: '10px',
    color: ARCHITECTURE_COLORS.xrSpatialArchitecture,
    marginTop: '6px',
  },
  centerSector: {
    gridColumn: '2',
    gridRow: '2',
    backgroundColor: 'rgba(0,188,212,0.1)',
    border: `2px dashed ${ARCHITECTURE_COLORS.xrSpatialArchitecture}50`,
  },
  positionLabel: {
    position: 'absolute',
    fontSize: '9px',
    color: CHENU_COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statsBar: {
    display: 'flex',
    gap: '20px',
    marginTop: '16px',
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
    color: ARCHITECTURE_COLORS.xrSpatialArchitecture,
  },
  statLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
    textTransform: 'uppercase',
  },
  roomTypeBadge: {
    padding: '8px 16px',
    backgroundColor: 'rgba(0,188,212,0.15)',
    border: `1px solid ${ARCHITECTURE_COLORS.xrSpatialArchitecture}40`,
    borderRadius: '8px',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  roomTypeIcon: {
    fontSize: '20px',
  },
  roomTypeLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.textPrimary,
  },
  footer: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warningBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'rgba(255,152,0,0.1)',
    border: `1px solid ${CHENU_COLORS.warning}`,
    borderRadius: '6px',
    color: CHENU_COLORS.warning,
    fontSize: '10px',
    fontWeight: 500,
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: CHENU_COLORS.textMuted,
  },
};

// ============================================================
// SECTOR TYPE CONFIG
// ============================================================

const SECTOR_TYPE_CONFIG: Record<XRSectorType, { icon: string; label: string }> = {
  blueprints_panel: { icon: '📐', label: 'Blueprints' },
  zoning_grid: { icon: '◻️', label: 'Zoning' },
  structural_diagram: { icon: '🔗', label: 'Structure' },
  xr_layout_columns: { icon: '🏛️', label: 'Columns' },
  floor_grid: { icon: '📏', label: 'Floor Grid' },
  custom: { icon: '⭐', label: 'Custom' },
};

const ROOM_TYPE_CONFIG: Record<string, { icon: string; label: string }> = {
  architectural_room: { icon: '🏛️', label: 'Architectural Room' },
  blueprint_room: { icon: '📐', label: 'Blueprint Room' },
  zoning_room: { icon: '◻️', label: 'Zoning Room' },
  structural_room: { icon: '🔗', label: 'Structural Room' },
};

// ============================================================
// COMPONENT
// ============================================================

export const ArchitectureXRLayoutView: React.FC<ArchitectureXRLayoutViewProps> = ({
  sceneName = 'Architecture Scene',
  roomType = 'architectural_room',
  sectors = [],
  objects = [],
  onSectorClick,
  onObjectClick,
  onOpenInXR,
}) => {
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // Get sector by position
  const getSectorByPosition = (position: string) => {
    return sectors.find(s => s.position === position);
  };

  // Handle sector click
  const handleSectorClick = (sector: XRSector) => {
    setSelectedSector(sector.id === selectedSector ? null : sector.id);
    onSectorClick?.(sector);
  };

  // Get room type config
  const roomConfig = ROOM_TYPE_CONFIG[roomType] || ROOM_TYPE_CONFIG.architectural_room;

  // Render sector
  const renderSector = (position: string, gridPosition?: React.CSSProperties) => {
    const sector = getSectorByPosition(position);
    if (!sector) {
      return (
        <div
          style={mergeStyles(
            styles.sector,
            gridPosition,
            { opacity: 0.3, cursor: 'default' }
          )}
        >
          <div style={{ fontSize: '16px', color: CHENU_COLORS.textMuted }}>+</div>
          <div style={{ fontSize: '10px', color: CHENU_COLORS.textMuted }}>{position}</div>
        </div>
      );
    }

    const isHovered = hoveredSector === sector.id;
    const isSelected = selectedSector === sector.id;
    const typeConfig = SECTOR_TYPE_CONFIG[sector.type];
    const sectorObjects = objects.filter(o => o.sectorId === sector.id);

    return (
      <div
        style={mergeStyles(
          styles.sector,
          gridPosition,
          isHovered ? styles.sectorHover : undefined,
          isSelected ? styles.sectorSelected : undefined
        )}
        onMouseEnter={() => setHoveredSector(sector.id)}
        onMouseLeave={() => setHoveredSector(null)}
        onClick={() => handleSectorClick(sector)}
      >
        <div style={styles.sectorIcon}>{typeConfig.icon}</div>
        <div style={styles.sectorName}>{sector.name}</div>
        <div style={styles.sectorType}>{typeConfig.label}</div>
        {sectorObjects.length > 0 && (
          <div style={styles.sectorObjects}>
            {sectorObjects.length} object{sectorObjects.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  };

  // Empty state
  if (sectors.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span>🌀</span>
            <span>XR Layout View</span>
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌀</div>
          <div>No XR scene configured</div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
            Add sectors to preview XR layout
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
          <span>{sceneName}</span>
        </div>
        {onOpenInXR && (
          <button style={styles.xrButton} onClick={onOpenInXR}>
            🌀 Open in XR
          </button>
        )}
      </div>

      {/* Preview Container */}
      <div style={styles.previewContainer}>
        {/* Position labels */}
        <div style={{ ...styles.positionLabel, top: '5px', left: '50%', transform: 'translateX(-50%)' }}>Front</div>
        <div style={{ ...styles.positionLabel, bottom: '5px', left: '50%', transform: 'translateX(-50%)' }}>Back</div>
        <div style={{ ...styles.positionLabel, left: '5px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)' }}>Left</div>
        <div style={{ ...styles.positionLabel, right: '5px', top: '50%', transform: 'translateY(-50%) rotate(90deg)' }}>Right</div>

        {/* Top row */}
        <div />
        {renderSector('front')}
        <div />

        {/* Middle row */}
        {renderSector('left')}
        {renderSector('center', styles.centerSector)}
        {renderSector('right')}

        {/* Bottom row */}
        <div />
        {renderSector('back')}
        <div />
      </div>

      {/* Room Type Badge */}
      <div style={styles.roomTypeBadge}>
        <span style={styles.roomTypeIcon}>{roomConfig.icon}</span>
        <span style={styles.roomTypeLabel}>{roomConfig.label}</span>
      </div>

      {/* Stats */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{sectors.length}</div>
          <div style={styles.statLabel}>Sectors</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{objects.length}</div>
          <div style={styles.statLabel}>Objects</div>
        </div>
        <div style={styles.statItem}>
          <div style={{ ...styles.statValue, fontSize: '16px' }}>✅</div>
          <div style={styles.statLabel}>Ready</div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={{ fontSize: '11px', color: CHENU_COLORS.textMuted }}>
          Symbolic XR preview • No real WebXR/WebGL
        </span>
        <div style={styles.warningBadge}>
          ⚠️ REPRESENTATIONAL — No real 3D
        </div>
      </div>
    </div>
  );
};

export default ArchitectureXRLayoutView;
