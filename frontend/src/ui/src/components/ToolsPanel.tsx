/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — TOOLS PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { getSphereColor } from "../adapters/universeAdapter";
import { getToolsForSphere, formatToolType } from "../adapters/toolAdapter";
import { SectionCard } from "./SectionCard";

interface ToolsPanelProps {
  sphere: RootSphere;
}

export const ToolsPanel: React.FC<ToolsPanelProps> = ({ sphere }) => {
  const tools = getToolsForSphere(sphere);
  const color = getSphereColor(sphere);

  return (
    <SectionCard 
      title="Tools & Toolsets" 
      icon="🔧"
      headerColor={color}
      badge={tools.length}
      collapsible
    >
      <div style={styles.list}>
        {tools.map((tool) => (
          <div key={tool.id} style={styles.item}>
            <div style={styles.itemHeader}>
              <span style={styles.itemName}>{tool.name}</span>
              <span style={{
                ...styles.typeBadge,
                backgroundColor: getTypeBgColor(tool.type)
              }}>
                {formatToolType(tool.type)}
              </span>
            </div>
            <div style={styles.itemMeta}>
              <span style={styles.domain}>{tool.domain}</span>
              <span style={styles.engines}>{tool.enginesCount} engine(s)</span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

function getTypeBgColor(type: string): string {
  const colors: Record<string, string> = {
    tool: "#3EB4A220",
    toolset: "#D8B26A20",
    toolchain: "#3F724920",
    pipeline: "#7A593A20"
  };
  return colors[type] || "#F0F0F0";
}

const styles: Record<string, React.CSSProperties> = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  item: {
    padding: "10px 12px",
    backgroundColor: "#FAFAFA",
    borderRadius: "6px",
    border: "1px solid #F0F0F0"
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px"
  },
  itemName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  typeBadge: {
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: 500
  },
  itemMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  domain: {
    fontSize: "12px",
    color: "#8D8371"
  },
  engines: {
    fontSize: "11px",
    color: "#8D8371"
  }
};

export default ToolsPanel;
