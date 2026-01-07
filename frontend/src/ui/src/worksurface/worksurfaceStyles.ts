/**
 * ============================================================
 * CHE·NU — WORKSURFACE STYLES
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Styles and theme for WorkSurface UI components
 */

import React from 'react';

// ============================================================
// COLORS
// ============================================================

export const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  
  // Extended palette
  darkBg: '#0D0D0F',
  cardBg: '#252528',
  borderColor: '#3A3A3D',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B3',
  textMuted: '#6E6E72',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

// ============================================================
// MODE COLORS
// ============================================================

export const MODE_COLORS: Record<string, string> = {
  text: CHENU_COLORS.softSand,
  table: CHENU_COLORS.cenoteTurquoise,
  blocks: CHENU_COLORS.jungleEmerald,
  diagram: CHENU_COLORS.sacredGold,
  summary: CHENU_COLORS.ancientStone,
  xr_layout: '#00CED1',
  final: CHENU_COLORS.earthEmber,
};

// ============================================================
// BASE STYLES
// ============================================================

export const baseStyles: Record<string, React.CSSProperties> = {
  // Container styles
  container: {
    backgroundColor: CHENU_COLORS.uiSlate,
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    minHeight: '100vh',
  },
  
  card: {
    backgroundColor: CHENU_COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    padding: '16px',
  },
  
  panel: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    padding: '14px',
  },
  
  // Typography
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
    margin: 0,
  },
  
  subtitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: CHENU_COLORS.textSecondary,
    margin: 0,
  },
  
  label: {
    fontSize: '12px',
    fontWeight: 500,
    color: CHENU_COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  text: {
    fontSize: '14px',
    color: CHENU_COLORS.textSecondary,
    lineHeight: 1.6,
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
    gap: '6px',
  },
  
  buttonPrimary: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  
  buttonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.textSecondary,
  },
  
  buttonGhost: {
    backgroundColor: 'transparent',
    color: CHENU_COLORS.textSecondary,
  },
  
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    color: CHENU_COLORS.textPrimary,
    outline: 'none',
    width: '100%',
  },
  
  textarea: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    color: CHENU_COLORS.textPrimary,
    outline: 'none',
    resize: 'vertical',
    minHeight: '120px',
    width: '100%',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  
  // Layout
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  gap8: { gap: '8px' },
  gap12: { gap: '12px' },
  gap16: { gap: '16px' },
  gap24: { gap: '24px' },
};

// ============================================================
// WORKSURFACE SPECIFIC STYLES
// ============================================================

export const worksurfaceStyles: Record<string, React.CSSProperties> = {
  // Main layout
  shell: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: CHENU_COLORS.uiSlate,
    color: CHENU_COLORS.softSand,
  },
  
  header: {
    padding: '12px 20px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: CHENU_COLORS.cardBg,
  },
  
  toolbar: {
    padding: '10px 20px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  
  mainContent: {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
  },
  
  statusBar: {
    padding: '8px 20px',
    borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: CHENU_COLORS.cardBg,
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.textMuted,
  },
  
  // Mode switcher
  modeSwitcher: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
  },
  
  modeTab: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.textMuted,
  },
  
  modeTabActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  
  // Content views
  viewContainer: {
    backgroundColor: CHENU_COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    padding: '20px',
    minHeight: '400px',
  },
  
  textView: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '14px',
    lineHeight: 1.8,
    whiteSpace: 'pre-wrap',
  },
  
  tableContainer: {
    overflowX: 'auto',
  },
  
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  
  tableHeader: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: `2px solid ${CHENU_COLORS.borderColor}`,
    color: CHENU_COLORS.textPrimary,
  },
  
  tableCell: {
    padding: '10px 12px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    color: CHENU_COLORS.textSecondary,
  },
  
  blocksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  
  block: {
    padding: '14px 16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    borderLeft: `3px solid ${CHENU_COLORS.cenoteTurquoise}`,
  },
  
  diagramCanvas: {
    position: 'relative',
    minHeight: '350px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  
  diagramNode: {
    position: 'absolute',
    padding: '12px 18px',
    backgroundColor: CHENU_COLORS.cardBg,
    border: `2px solid ${CHENU_COLORS.sacredGold}`,
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 500,
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  
  summaryView: {
    padding: '24px',
    backgroundColor: 'rgba(216,178,106,0.1)',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.sacredGold}30`,
  },
  
  xrPreview: {
    backgroundColor: 'rgba(0,206,209,0.1)',
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}30`,
  },
  
  finalView: {
    backgroundColor: CHENU_COLORS.softSand,
    color: CHENU_COLORS.uiSlate,
    padding: '40px',
    borderRadius: '4px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  
  // Suggestions
  suggestionPanel: {
    backgroundColor: 'rgba(62,180,162,0.1)',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}30`,
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '16px',
  },
  
  suggestionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  // Status indicators
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.success,
  },
  
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Merge styles
 */
export function mergeStyles(...styles: (React.CSSProperties | undefined)[]): React.CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

/**
 * Get mode color
 */
export function getModeColor(mode: string): string {
  return MODE_COLORS[mode] || CHENU_COLORS.ancientStone;
}

/**
 * Create hover style (for use with onMouseEnter/Leave)
 */
export function createHoverStyle(
  baseColor: string,
  hoverColor: string
): { base: React.CSSProperties; hover: React.CSSProperties } {
  return {
    base: { backgroundColor: baseColor },
    hover: { backgroundColor: hoverColor },
  };
}
