/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — SPHERE DASHBOARD
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { getSphereLabel, getSphereIcon, getSphereDescription, getSphereColor } from "../adapters/universeAdapter";
import { DomainOverviewPanel } from "./DomainOverviewPanel";
import { ContextPanel } from "./ContextPanel";
import { ToolsPanel } from "./ToolsPanel";
import { ProcessesPanel } from "./ProcessesPanel";
import { ProjectsPanel } from "./ProjectsPanel";
import { TemplatesPanel } from "./TemplatesPanel";
import { MemoryPanel } from "./MemoryPanel";

interface SphereDashboardProps {
  sphere: RootSphere;
}

export const SphereDashboard: React.FC<SphereDashboardProps> = ({ sphere }) => {
  const label = getSphereLabel(sphere);
  const icon = getSphereIcon(sphere);
  const description = getSphereDescription(sphere);
  const color = getSphereColor(sphere);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={{
            ...styles.icon,
            backgroundColor: color + "20"
          }}>
            {icon}
          </span>
          <div>
            <h2 style={styles.title}>{label} Sphere Dashboard</h2>
            <p style={styles.description}>{description}</p>
          </div>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.readOnlyTag}>🔒 Read-Only View</span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={styles.grid}>
        {/* Left Column */}
        <div style={styles.column}>
          <DomainOverviewPanel sphere={sphere} />
          <ContextPanel sphere={sphere} />
          <ProcessesPanel sphere={sphere} />
        </div>

        {/* Right Column */}
        <div style={styles.column}>
          <ToolsPanel sphere={sphere} />
          <TemplatesPanel sphere={sphere} />
          <ProjectsPanel sphere={sphere} />
          <MemoryPanel sphere={sphere} />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1400px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px"
  },
  headerLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px"
  },
  icon: {
    fontSize: "32px",
    padding: "12px",
    borderRadius: "12px"
  },
  title: {
    margin: "0 0 4px 0",
    fontSize: "24px",
    fontWeight: 700,
    color: "#1E1F22"
  },
  description: {
    margin: 0,
    fontSize: "14px",
    color: "#8D8371",
    maxWidth: "500px"
  },
  headerRight: {
    display: "flex",
    alignItems: "center"
  },
  readOnlyTag: {
    padding: "6px 12px",
    backgroundColor: "#3EB4A220",
    color: "#3EB4A2",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 600
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "24px",
    alignItems: "flex-start"
  },
  column: {
    display: "flex",
    flexDirection: "column"
  }
};

export default SphereDashboard;
