/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — MEMORY PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { getSphereColor } from "../adapters/universeAdapter";
import { 
  getMemoryForSphere, 
  getMemoryCount, 
  getMemoryTypeCounts,
  formatMemoryType, 
  formatMemoryDate 
} from "../adapters/memoryAdapter";
import { SectionCard } from "./SectionCard";

interface MemoryPanelProps {
  sphere: RootSphere;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ sphere }) => {
  const memories = getMemoryForSphere(sphere);
  const totalCount = getMemoryCount(sphere);
  const typeCounts = getMemoryTypeCounts(sphere);
  const color = getSphereColor(sphere);

  return (
    <SectionCard 
      title="Memory Records" 
      icon="🧠"
      headerColor={color}
      badge={totalCount}
      collapsible
    >
      {/* Type Distribution */}
      <div style={styles.typeGrid}>
        {Object.entries(typeCounts).map(([type, count]) => (
          <div key={type} style={styles.typeItem}>
            <span style={styles.typeCount}>{count}</span>
            <span style={styles.typeLabel}>{type}</span>
          </div>
        ))}
      </div>

      {/* Recent Memories */}
      <div style={styles.divider} />
      <h4 style={styles.subheader}>Recent Records</h4>
      
      <div style={styles.list}>
        {memories.map((memory) => (
          <div key={memory.id} style={styles.item}>
            <div style={styles.itemHeader}>
              <span style={{
                ...styles.typeBadge,
                backgroundColor: getTypeBgColor(memory.type)
              }}>
                {formatMemoryType(memory.type)}
              </span>
              <span style={styles.date}>{formatMemoryDate(memory.createdAt)}</span>
            </div>
            <p style={styles.preview}>{memory.preview}</p>
          </div>
        ))}
      </div>

      {totalCount > 5 && (
        <div style={styles.footer}>
          <span style={styles.moreLabel}>+ {totalCount - 5} more records</span>
        </div>
      )}
    </SectionCard>
  );
};

function getTypeBgColor(type: string): string {
  const colors: Record<string, string> = {
    fact: "#3EB4A220",
    preference: "#D8B26A20",
    event: "#3F724920",
    note: "#8D837120",
    reference: "#7A593A20"
  };
  return colors[type] || "#F0F0F0";
}

const styles: Record<string, React.CSSProperties> = {
  typeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "8px",
    marginBottom: "12px"
  },
  typeItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px",
    backgroundColor: "#FAFAFA",
    borderRadius: "6px"
  },
  typeCount: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#1E1F22"
  },
  typeLabel: {
    fontSize: "10px",
    color: "#8D8371",
    textTransform: "capitalize" as const
  },
  divider: {
    height: "1px",
    backgroundColor: "#E5E5E5",
    margin: "12px 0"
  },
  subheader: {
    margin: "0 0 10px 0",
    fontSize: "12px",
    fontWeight: 600,
    color: "#8D8371",
    textTransform: "uppercase" as const
  },
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
  typeBadge: {
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: 500
  },
  date: {
    fontSize: "11px",
    color: "#8D8371"
  },
  preview: {
    margin: 0,
    fontSize: "13px",
    color: "#1E1F22",
    lineHeight: 1.4
  },
  footer: {
    marginTop: "12px",
    textAlign: "center" as const
  },
  moreLabel: {
    fontSize: "12px",
    color: "#8D8371",
    fontStyle: "italic"
  }
};

export default MemoryPanel;
