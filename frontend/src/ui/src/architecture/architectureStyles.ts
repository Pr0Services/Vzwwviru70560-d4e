/**
 * ============================================================
 * CHE·NU — ARCHITECTURE UI STYLES
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Styles for Architecture domain UI components
 */

import React from 'react';

// ============================================================
// CHE·NU BRAND COLORS
// ============================================================

export const CHENU_COLORS = {
  // Brand palette
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  
  // UI colors
  cardBg: '#2A2B2E',
  borderColor: '#3A3B3E',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#707070',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
} as const;

// ============================================================
// ARCHITECTURE-SPECIFIC COLORS
// ============================================================

export const ARCHITECTURE_COLORS = {
  // Subdomain colors
  spatialDesign: CHENU_COLORS.cenoteTurquoise,
  blueprintDesign: CHENU_COLORS.sacredGold,
  shapeLanguage: '#9C27B0',
  interiorConcept: CHENU_COLORS.earthEmber,
  diagrammaticArchitecture: CHENU_COLORS.jungleEmerald,
  xrSpatialArchitecture: '#00BCD4',
  industrialLayout: '#607D8B',
  buildingAnalysis: '#795548',
  structurePlanning: CHENU_COLORS.ancientStone,
  logisticsMapping: '#FF5722',
  operationalFloorMapping: '#3F51B5',
  
  // Element colors
  room: CHENU_COLORS.cenoteTurquoise,
  zone: CHENU_COLORS.jungleEmerald,
  wall: CHENU_COLORS.ancientStone,
  column: CHENU_COLORS.sacredGold,
  opening: '#4CAF50',
  circulation: '#FF9800',
  structural: CHENU_COLORS.earthEmber,
  
  // Mode colors
  modeText: '#64B5F6',
  modeDiagram: '#81C784',
  modeBlocks: '#FFB74D',
  modeTable: '#BA68C8',
  modeXrLayout: '#4DD0E1',
  modeSummary: '#A1887F',
  modeFinal: CHENU_COLORS.sacredGold,
} as const;

// ============================================================
// BASE STYLES
// ============================================================

export const baseStyles: Record<string, React.CSSProperties> = {
  // Container styles
  container: {
    backgroundColor: CHENU_COLORS.uiSlate,
    color: CHENU_COLORS.textPrimary,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    backgroundColor: CHENU_COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    padding: '20px',
  },
  panel: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    padding: '16px',
  },
  
  // Typography
  heading: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
    marginBottom: '12px',
  },
  subheading: {
    fontSize: '14px',
    fontWeight: 500,
    color: CHENU_COLORS.textSecondary,
    marginBottom: '8px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    color: CHENU_COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  // Interactive elements
  button: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  buttonPrimary: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.textSecondary,
  },
  
  // Form elements
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.textPrimary,
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  
  // Layout
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
};

// ============================================================
// ARCHITECTURE-SPECIFIC STYLES
// ============================================================

export const architectureStyles: Record<string, React.CSSProperties> = {
  // Blueprint styles
  blueprintContainer: {
    backgroundColor: '#1a1a2e',
    border: `2px solid ${ARCHITECTURE_COLORS.blueprintDesign}`,
    borderRadius: '12px',
    padding: '20px',
  },
  blueprintGrid: {
    display: 'grid',
    gap: '2px',
    backgroundColor: 'rgba(216,178,106,0.1)',
  },
  blueprintCell: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(216,178,106,0.2)',
    minHeight: '40px',
    transition: 'all 0.2s ease',
  },
  blueprintCellActive: {
    backgroundColor: 'rgba(216,178,106,0.2)',
    borderColor: ARCHITECTURE_COLORS.blueprintDesign,
  },
  
  // Room styles
  roomCard: {
    backgroundColor: 'rgba(62,180,162,0.15)',
    border: `2px solid ${ARCHITECTURE_COLORS.room}`,
    borderRadius: '10px',
    padding: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  roomCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px rgba(62,180,162,0.3)`,
  },
  
  // Zone styles
  zoneCard: {
    backgroundColor: 'rgba(63,114,73,0.15)',
    border: `2px solid ${ARCHITECTURE_COLORS.zone}`,
    borderRadius: '10px',
    padding: '14px',
  },
  
  // Structural element styles
  structuralElement: {
    backgroundColor: 'rgba(122,89,58,0.2)',
    border: `2px solid ${ARCHITECTURE_COLORS.structural}`,
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  // Diagram styles
  diagramContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    padding: '20px',
    minHeight: '300px',
    position: 'relative',
  },
  diagramNode: {
    position: 'absolute',
    backgroundColor: CHENU_COLORS.cardBg,
    border: `2px solid ${CHENU_COLORS.sacredGold}`,
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: 500,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: 'translate(-50%, -50%)',
  },
  
  // XR Layout styles
  xrLayoutContainer: {
    backgroundColor: 'rgba(0,188,212,0.1)',
    border: `2px solid ${ARCHITECTURE_COLORS.xrSpatialArchitecture}`,
    borderRadius: '12px',
    padding: '20px',
    minHeight: '300px',
  },
  xrSector: {
    backgroundColor: 'rgba(0,188,212,0.15)',
    border: `1px solid rgba(0,188,212,0.3)`,
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
  },
  
  // Mode badge styles
  modeBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  // Safety badge
  safetyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'rgba(63,114,73,0.2)',
    border: `1px solid ${CHENU_COLORS.jungleEmerald}`,
    borderRadius: '6px',
    color: CHENU_COLORS.jungleEmerald,
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  
  // Disclaimer
  disclaimer: {
    backgroundColor: 'rgba(255,152,0,0.1)',
    border: `1px solid ${CHENU_COLORS.warning}`,
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '12px',
    color: CHENU_COLORS.warning,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Merge styles
 */
export function mergeStyles(
  ...styles: (React.CSSProperties | undefined)[]
): React.CSSProperties {
  return styles.reduce((acc, style) => ({ ...acc, ...style }), {}) as React.CSSProperties;
}

/**
 * Get subdomain color
 */
export function getSubdomainColor(subdomain: string): string {
  const colorMap: Record<string, string> = {
    spatial_design: ARCHITECTURE_COLORS.spatialDesign,
    blueprint_design: ARCHITECTURE_COLORS.blueprintDesign,
    shape_language: ARCHITECTURE_COLORS.shapeLanguage,
    interior_concept: ARCHITECTURE_COLORS.interiorConcept,
    diagrammatic_architecture: ARCHITECTURE_COLORS.diagrammaticArchitecture,
    xr_spatial_architecture: ARCHITECTURE_COLORS.xrSpatialArchitecture,
    industrial_layout: ARCHITECTURE_COLORS.industrialLayout,
    building_analysis: ARCHITECTURE_COLORS.buildingAnalysis,
    structure_planning: ARCHITECTURE_COLORS.structurePlanning,
    logistics_mapping: ARCHITECTURE_COLORS.logisticsMapping,
    operational_floor_mapping: ARCHITECTURE_COLORS.operationalFloorMapping,
  };
  return colorMap[subdomain] || CHENU_COLORS.cenoteTurquoise;
}

/**
 * Get mode color
 */
export function getModeColor(mode: string): string {
  const colorMap: Record<string, string> = {
    text: ARCHITECTURE_COLORS.modeText,
    diagram: ARCHITECTURE_COLORS.modeDiagram,
    blocks: ARCHITECTURE_COLORS.modeBlocks,
    table: ARCHITECTURE_COLORS.modeTable,
    xr_layout: ARCHITECTURE_COLORS.modeXrLayout,
    summary: ARCHITECTURE_COLORS.modeSummary,
    final: ARCHITECTURE_COLORS.modeFinal,
  };
  return colorMap[mode] || CHENU_COLORS.cenoteTurquoise;
}

/**
 * Get element color
 */
export function getElementColor(elementType: string): string {
  const colorMap: Record<string, string> = {
    room: ARCHITECTURE_COLORS.room,
    zone: ARCHITECTURE_COLORS.zone,
    wall: ARCHITECTURE_COLORS.wall,
    column: ARCHITECTURE_COLORS.column,
    opening: ARCHITECTURE_COLORS.opening,
    circulation: ARCHITECTURE_COLORS.circulation,
    structural: ARCHITECTURE_COLORS.structural,
  };
  return colorMap[elementType] || CHENU_COLORS.ancientStone;
}
