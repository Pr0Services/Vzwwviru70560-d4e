/**
 * ============================================================
 * CHE·NU — XR UI DASHBOARD — COMMON STYLES
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";

// ============================================================
// COLOR PALETTE (XR Theme)
// ============================================================

export const XR_COLORS = {
  // Primary
  primary: "#D8B26A",
  primaryLight: "#E8C890",
  primaryDark: "#B8964A",
  
  // Accents
  accent1: "#3EB4A2",  // Cenote Turquoise
  accent2: "#3F7249",  // Jungle Emerald
  accent3: "#7A593A",  // Earth Ember
  
  // Neutrals
  background: "#1E1F22",
  backgroundLight: "#2A2B2F",
  backgroundLighter: "#35363A",
  surface: "#FFFFFF",
  surfaceDark: "#F5F5F5",
  
  // Text
  textPrimary: "#1E1F22",
  textSecondary: "#8D8371",
  textLight: "#E9E4D6",
  textMuted: "#666666",
  
  // Status
  success: "#3F7249",
  warning: "#D8B26A",
  error: "#C75050",
  info: "#3EB4A2",
  
  // XR Specific
  xrGrid: "#3EB4A220",
  xrNode: "#D8B26A",
  xrPanel: "#3F7249",
  xrPortal: "#7A593A",
  xrZone: "#3EB4A240",
  xrAvatar: "#8D8371"
};

// ============================================================
// SPACING
// ============================================================

export const XR_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

// ============================================================
// TYPOGRAPHY
// ============================================================

export const XR_TYPOGRAPHY = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'SF Mono', 'Fira Code', monospace",
  
  h1: { fontSize: "28px", fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: "22px", fontWeight: 600, lineHeight: 1.3 },
  h3: { fontSize: "18px", fontWeight: 600, lineHeight: 1.4 },
  h4: { fontSize: "15px", fontWeight: 600, lineHeight: 1.4 },
  body: { fontSize: "14px", fontWeight: 400, lineHeight: 1.5 },
  small: { fontSize: "12px", fontWeight: 400, lineHeight: 1.4 },
  caption: { fontSize: "11px", fontWeight: 500, lineHeight: 1.3 }
};

// ============================================================
// COMMON STYLES
// ============================================================

export const xrStyles: Record<string, React.CSSProperties> = {
  // Layout
  pageContainer: {
    maxWidth: "1400px",
    padding: XR_SPACING.lg
  },
  
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  
  flexColumn: {
    display: "flex",
    flexDirection: "column"
  },
  
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: XR_SPACING.md
  },
  
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: XR_SPACING.md
  },
  
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: XR_SPACING.md
  },
  
  gridAuto: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: XR_SPACING.md
  },
  
  // Header
  pageHeader: {
    marginBottom: XR_SPACING.lg
  },
  
  pageTitle: {
    margin: "0 0 8px 0",
    ...XR_TYPOGRAPHY.h1,
    color: XR_COLORS.textPrimary,
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  
  pageSubtitle: {
    margin: 0,
    ...XR_TYPOGRAPHY.body,
    color: XR_COLORS.textSecondary
  },
  
  // Cards
  card: {
    backgroundColor: XR_COLORS.surface,
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5",
    padding: XR_SPACING.lg,
    transition: "all 0.2s ease"
  },
  
  cardHover: {
    cursor: "pointer"
  },
  
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: XR_SPACING.md
  },
  
  cardTitle: {
    margin: 0,
    ...XR_TYPOGRAPHY.h4,
    color: XR_COLORS.textPrimary
  },
  
  cardDescription: {
    margin: 0,
    ...XR_TYPOGRAPHY.small,
    color: XR_COLORS.textMuted,
    lineHeight: 1.5
  },
  
  // Dark Card (XR themed)
  cardDark: {
    backgroundColor: XR_COLORS.background,
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    border: `1px solid ${XR_COLORS.backgroundLighter}`,
    padding: XR_SPACING.lg
  },
  
  // Panel
  panel: {
    backgroundColor: XR_COLORS.surface,
    borderRadius: "10px",
    border: "1px solid #E5E5E5",
    overflow: "hidden"
  },
  
  panelHeader: {
    padding: "12px 16px",
    backgroundColor: "#FAFAFA",
    borderBottom: "1px solid #E5E5E5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  
  panelTitle: {
    margin: 0,
    ...XR_TYPOGRAPHY.h4,
    color: XR_COLORS.textPrimary,
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  
  panelContent: {
    padding: XR_SPACING.md
  },
  
  // Badges
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600
  },
  
  badgePrimary: {
    backgroundColor: `${XR_COLORS.primary}20`,
    color: XR_COLORS.primary
  },
  
  badgeSuccess: {
    backgroundColor: `${XR_COLORS.success}20`,
    color: XR_COLORS.success
  },
  
  badgeInfo: {
    backgroundColor: `${XR_COLORS.info}20`,
    color: XR_COLORS.info
  },
  
  badgeWarning: {
    backgroundColor: `${XR_COLORS.warning}20`,
    color: XR_COLORS.warning
  },
  
  badgeNeutral: {
    backgroundColor: "#F0F0F0",
    color: XR_COLORS.textMuted
  },
  
  // Tags
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px"
  },
  
  tagXrPanel: {
    backgroundColor: `${XR_COLORS.xrPanel}20`,
    color: XR_COLORS.xrPanel
  },
  
  tagXrNode: {
    backgroundColor: `${XR_COLORS.xrNode}20`,
    color: XR_COLORS.xrNode
  },
  
  tagXrPortal: {
    backgroundColor: `${XR_COLORS.xrPortal}20`,
    color: XR_COLORS.xrPortal
  },
  
  tagXrAvatar: {
    backgroundColor: `${XR_COLORS.xrAvatar}20`,
    color: XR_COLORS.xrAvatar
  },
  
  tagXrZone: {
    backgroundColor: `${XR_COLORS.accent1}20`,
    color: XR_COLORS.accent1
  },
  
  // Buttons
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
    border: "none"
  },
  
  buttonPrimary: {
    backgroundColor: XR_COLORS.primary,
    color: "#FFFFFF"
  },
  
  buttonSecondary: {
    backgroundColor: "#F0F0F0",
    color: XR_COLORS.textPrimary
  },
  
  buttonOutline: {
    backgroundColor: "transparent",
    border: "1px solid #E5E5E5",
    color: XR_COLORS.textPrimary
  },
  
  // Stats
  statCard: {
    textAlign: "center" as const,
    padding: XR_SPACING.md,
    backgroundColor: XR_COLORS.surface,
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  
  statValue: {
    display: "block",
    fontSize: "28px",
    fontWeight: 700,
    color: XR_COLORS.primary
  },
  
  statLabel: {
    display: "block",
    fontSize: "11px",
    color: XR_COLORS.textSecondary,
    marginTop: "4px"
  },
  
  // Tables
  table: {
    width: "100%",
    borderCollapse: "collapse" as const
  },
  
  th: {
    textAlign: "left" as const,
    padding: "12px 16px",
    fontSize: "11px",
    fontWeight: 600,
    color: XR_COLORS.textSecondary,
    textTransform: "uppercase" as const,
    borderBottom: "1px solid #E5E5E5",
    backgroundColor: "#FAFAFA"
  },
  
  td: {
    padding: "12px 16px",
    fontSize: "13px",
    color: XR_COLORS.textPrimary,
    borderBottom: "1px solid #F0F0F0"
  },
  
  // XR Specific
  xrViewport: {
    backgroundColor: XR_COLORS.background,
    borderRadius: "12px",
    border: `1px solid ${XR_COLORS.backgroundLighter}`,
    overflow: "hidden",
    position: "relative" as const
  },
  
  xrGrid: {
    backgroundImage: `
      linear-gradient(${XR_COLORS.xrGrid} 1px, transparent 1px),
      linear-gradient(90deg, ${XR_COLORS.xrGrid} 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px"
  },
  
  xrObjectMarker: {
    position: "absolute" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "default",
    transition: "transform 0.2s"
  },
  
  xrSectorBox: {
    position: "absolute" as const,
    border: "2px dashed",
    borderRadius: "8px",
    opacity: 0.6
  },
  
  // Safe Mode Indicator
  safeIndicator: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    backgroundColor: `${XR_COLORS.success}15`,
    borderRadius: "16px",
    fontSize: "11px",
    fontWeight: 600,
    color: XR_COLORS.success
  },
  
  readOnlyBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: `${XR_COLORS.warning}15`,
    borderRadius: "8px",
    fontSize: "12px",
    color: XR_COLORS.accent3,
    marginBottom: XR_SPACING.md
  },
  
  // Empty State
  emptyState: {
    textAlign: "center" as const,
    padding: XR_SPACING.xxl,
    color: XR_COLORS.textSecondary
  },
  
  emptyIcon: {
    fontSize: "48px",
    marginBottom: XR_SPACING.md,
    opacity: 0.5
  },
  
  emptyText: {
    margin: 0,
    ...XR_TYPOGRAPHY.body
  },
  
  // Dividers
  divider: {
    height: "1px",
    backgroundColor: "#E5E5E5",
    margin: `${XR_SPACING.md}px 0`
  },
  
  dividerVertical: {
    width: "1px",
    backgroundColor: "#E5E5E5",
    margin: `0 ${XR_SPACING.md}px`
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getObjectTypeColor(type: string): string {
  const colors: Record<string, string> = {
    panel: XR_COLORS.xrPanel,
    node: XR_COLORS.xrNode,
    portal: XR_COLORS.xrPortal,
    avatar: XR_COLORS.xrAvatar,
    display: XR_COLORS.accent1,
    decoration: XR_COLORS.textSecondary,
    interaction_zone: XR_COLORS.accent1
  };
  return colors[type] || XR_COLORS.textMuted;
}

export function getObjectTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    panel: "📋",
    node: "🔮",
    portal: "🚪",
    avatar: "👤",
    display: "🖥️",
    decoration: "🌿",
    interaction_zone: "⭕"
  };
  return icons[type] || "📦";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: XR_COLORS.success,
    running: XR_COLORS.success,
    published: XR_COLORS.success,
    completed: XR_COLORS.info,
    standby: XR_COLORS.warning,
    idle: XR_COLORS.textMuted,
    draft: XR_COLORS.textSecondary,
    disabled: XR_COLORS.error,
    archived: XR_COLORS.textMuted
  };
  return colors[status] || XR_COLORS.textMuted;
}

export function getSphereColor(sphere: string): string {
  const colors: Record<string, string> = {
    Personal: "#3F7249",
    Creative: "#D8B26A",
    Business: "#1E1F22",
    Education: "#3EB4A2",
    Construction: "#7A593A",
    "Real Estate": "#8D8371",
    Government: "#2F4C39",
    Social: "#3EB4A2",
    Entertainment: "#D8B26A",
    Systems: "#3EB4A2",
    Production: "#7A593A"
  };
  return colors[sphere] || XR_COLORS.textMuted;
}

// ============================================================
// STYLE COMBINER
// ============================================================

export function combineStyles(...styles: React.CSSProperties[]): React.CSSProperties {
  return Object.assign({}, ...styles);
}

export default xrStyles;
