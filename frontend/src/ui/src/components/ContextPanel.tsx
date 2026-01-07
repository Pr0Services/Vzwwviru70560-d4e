/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — CONTEXT PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { getSphereColor } from "../adapters/universeAdapter";
import { getMockContextForSphere, getContextStats, formatContextDate } from "../adapters/contextAdapter";
import { SectionCard } from "./SectionCard";
import { EngineBadges } from "./EngineBadges";

interface ContextPanelProps {
  sphere: RootSphere;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ sphere }) => {
  const context = getMockContextForSphere(sphere);
  const stats = getContextStats(context);
  const color = getSphereColor(sphere);

  return (
    <SectionCard 
      title="Context Snapshot" 
      icon="📷"
      headerColor={color}
    >
      <div style={styles.container}>
        {/* Domain & Engines */}
        <div style={styles.row}>
          <span style={styles.label}>Domain:</span>
          <span style={styles.value}>{context.domain}</span>
        </div>
        
        <div style={styles.row}>
          <span style={styles.label}>Engines:</span>
        </div>
        <div style={styles.enginesRow}>
          <EngineBadges engines={context.engines} size="small" />
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.totalTools}</span>
            <span style={styles.statLabel}>Tools</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.totalProcesses}</span>
            <span style={styles.statLabel}>Processes</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.totalMemory}</span>
            <span style={styles.statLabel}>Memory</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.enginesActive}</span>
            <span style={styles.statLabel}>Engines</span>
          </div>
        </div>

        {/* Created Date */}
        <div style={styles.footer}>
          <span style={styles.footerLabel}>Created:</span>
          <span style={styles.footerValue}>{formatContextDate(context.createdAt)}</span>
        </div>
      </div>
    </SectionCard>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  label: {
    fontSize: "13px",
    color: "#8D8371",
    fontWeight: 500
  },
  value: {
    fontSize: "14px",
    color: "#1E1F22"
  },
  enginesRow: {
    marginTop: "-4px"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginTop: "8px",
    padding: "12px",
    backgroundColor: "#FAFAFA",
    borderRadius: "8px"
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px"
  },
  statValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1E1F22"
  },
  statLabel: {
    fontSize: "11px",
    color: "#8D8371",
    textTransform: "uppercase" as const
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingTop: "8px",
    borderTop: "1px solid #F0F0F0"
  },
  footerLabel: {
    fontSize: "12px",
    color: "#8D8371"
  },
  footerValue: {
    fontSize: "12px",
    color: "#1E1F22"
  }
};

export default ContextPanel;
