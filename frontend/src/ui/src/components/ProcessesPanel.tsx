/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — PROCESSES PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { getSphereColor } from "../adapters/universeAdapter";
import { getProcessesForSphere, formatProcessType } from "../adapters/processAdapter";
import { SectionCard } from "./SectionCard";

interface ProcessesPanelProps {
  sphere: RootSphere;
}

export const ProcessesPanel: React.FC<ProcessesPanelProps> = ({ sphere }) => {
  const processes = getProcessesForSphere(sphere);
  const color = getSphereColor(sphere);

  return (
    <SectionCard 
      title="Processes & Chains" 
      icon="⚙️"
      headerColor={color}
      badge={processes.length}
      collapsible
    >
      <div style={styles.list}>
        {processes.map((process) => (
          <div key={process.id} style={styles.item}>
            <div style={styles.itemHeader}>
              <span style={styles.itemName}>{process.name}</span>
              <span style={{
                ...styles.typeBadge,
                backgroundColor: getTypeBgColor(process.type)
              }}>
                {formatProcessType(process.type)}
              </span>
            </div>
            <div style={styles.itemMeta}>
              <span style={styles.domain}>{process.domain}</span>
              <span style={styles.steps}>
                <span style={styles.stepsIcon}>📋</span>
                {process.stepsCount} steps
              </span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

function getTypeBgColor(type: string): string {
  const colors: Record<string, string> = {
    model: "#3EB4A220",
    chain: "#D8B26A20",
    profile: "#3F724920"
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
  steps: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    color: "#8D8371"
  },
  stepsIcon: {
    fontSize: "10px"
  }
};

export default ProcessesPanel;
