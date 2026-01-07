/**
 * ============================================================
 * CHE·NU — XR UI DASHBOARD — MEMORY PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import { xrStyles, XR_COLORS } from "./xrStyles";
import { getXrMemoryEntriesMock, type XRMemoryEntry } from "./adapters/xrAdapter";

interface XRMemoryPanelProps {
  sceneId: string;
  selectedObjectId?: string;
}

export const XRMemoryPanel: React.FC<XRMemoryPanelProps> = ({ sceneId, selectedObjectId }) => {
  const allMemory = getXrMemoryEntriesMock();
  const filteredMemory = selectedObjectId 
    ? allMemory.filter(m => m.objectId === selectedObjectId)
    : allMemory;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Memory Entries</h3>
        <span style={styles.count}>
          {filteredMemory.length} {selectedObjectId ? "for selected" : "total"}
        </span>
      </div>

      {/* Safety Notice */}
      <div style={styles.safetyNotice}>
        <span>🔒</span>
        <span>Memory is external and documentary only. No internal AI memory.</span>
      </div>

      {/* Memory Entries */}
      {filteredMemory.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>🧠</span>
          <p style={styles.emptyText}>
            {selectedObjectId 
              ? "No memory entries for selected object" 
              : "No memory entries available"}
          </p>
        </div>
      ) : (
        <div style={styles.memoryList}>
          {filteredMemory.map(entry => (
            <MemoryEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {/* Info */}
      <div style={styles.infoSection}>
        <h4 style={styles.infoTitle}>About XR Memory</h4>
        <p style={styles.infoText}>
          Memory entries link objects to documentary notes, references, and context. 
          All memory is explicit, user-controlled, and external to any AI system.
        </p>
        <div style={styles.memoryTypes}>
          <span style={styles.typeTag}>📝 Note</span>
          <span style={styles.typeTag}>🔗 Reference</span>
          <span style={styles.typeTag}>📍 Context</span>
        </div>
      </div>
    </div>
  );
};

// Memory Entry Card
const MemoryEntryCard: React.FC<{ entry: XRMemoryEntry }> = ({ entry }) => {
  const typeColors: Record<string, string> = {
    note: XR_COLORS.primary,
    reference: XR_COLORS.accent1,
    context: XR_COLORS.accent2
  };
  const typeIcons: Record<string, string> = {
    note: "📝",
    reference: "🔗",
    context: "📍"
  };

  return (
    <div style={styles.memoryCard}>
      <div style={styles.cardHeader}>
        <span style={{
          ...styles.typeBadge,
          backgroundColor: typeColors[entry.type] + "20",
          color: typeColors[entry.type]
        }}>
          {typeIcons[entry.type]} {entry.type}
        </span>
        <span style={styles.timestamp}>{entry.timestamp}</span>
      </div>
      <h4 style={styles.entryTitle}>{entry.title}</h4>
      <p style={styles.entryContent}>{entry.content}</p>
      <div style={styles.cardFooter}>
        <span style={styles.objectRef}>📦 {entry.objectId}</span>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {},
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  count: {
    fontSize: "12px",
    color: XR_COLORS.textSecondary
  },
  safetyNotice: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    backgroundColor: XR_COLORS.success + "10",
    borderRadius: "8px",
    fontSize: "11px",
    color: XR_COLORS.success,
    marginBottom: "16px"
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "32px",
    color: XR_COLORS.textSecondary
  },
  emptyIcon: {
    fontSize: "36px",
    display: "block",
    marginBottom: "12px",
    opacity: 0.4
  },
  emptyText: {
    margin: 0,
    fontSize: "13px"
  },
  memoryList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  memoryCard: {
    padding: "16px",
    backgroundColor: "#FAFAFA",
    borderRadius: "10px",
    border: "1px solid #E5E5E5"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  typeBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase" as const
  },
  timestamp: {
    fontSize: "10px",
    color: XR_COLORS.textMuted
  },
  entryTitle: {
    margin: "0 0 6px 0",
    fontSize: "14px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  entryContent: {
    margin: "0 0 12px 0",
    fontSize: "12px",
    color: XR_COLORS.textSecondary,
    lineHeight: 1.5
  },
  cardFooter: {
    paddingTop: "8px",
    borderTop: "1px solid #E5E5E5"
  },
  objectRef: {
    fontSize: "10px",
    color: XR_COLORS.textMuted,
    fontFamily: "monospace"
  },
  infoSection: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: XR_COLORS.primary + "08",
    borderRadius: "10px"
  },
  infoTitle: {
    margin: "0 0 8px 0",
    fontSize: "13px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  infoText: {
    margin: "0 0 12px 0",
    fontSize: "12px",
    color: XR_COLORS.textSecondary,
    lineHeight: 1.5
  },
  memoryTypes: {
    display: "flex",
    gap: "8px"
  },
  typeTag: {
    padding: "4px 8px",
    backgroundColor: "#FFF",
    borderRadius: "6px",
    fontSize: "10px",
    color: XR_COLORS.textSecondary
  }
};

export default XRMemoryPanel;
