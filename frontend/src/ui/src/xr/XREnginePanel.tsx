/**
 * ============================================================
 * CHE·NU — XR UI DASHBOARD — ENGINE PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import { xrStyles, XR_COLORS, getStatusColor, getSphereColor } from "./xrStyles";
import { type XREngine } from "./adapters/xrAdapter";

interface XREnginePanelProps {
  sceneId: string;
  engines: XREngine[];
}

export const XREnginePanel: React.FC<XREnginePanelProps> = ({ sceneId, engines }) => {
  if (engines.length === 0) {
    return (
      <div style={styles.emptyState}>
        <span style={styles.emptyIcon}>⚙️</span>
        <p style={styles.emptyText}>No engines associated with this scene</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Scene Engines</h3>
        <span style={styles.count}>{engines.length} engines</span>
      </div>

      <div style={styles.engineList}>
        {engines.map(engine => {
          const statusColor = getStatusColor(engine.status);
          const sphereColor = getSphereColor(engine.sphere);
          
          return (
            <div key={engine.id} style={styles.engineCard}>
              <div style={styles.engineHeader}>
                <span style={styles.engineIcon}>⚙️</span>
                <div>
                  <span style={styles.engineName}>{engine.name}</span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColor + "20",
                    color: statusColor
                  }}>
                    {engine.status}
                  </span>
                </div>
              </div>
              <p style={styles.engineDesc}>{engine.description}</p>
              <div style={styles.engineMeta}>
                <span style={{
                  ...styles.sphereTag,
                  backgroundColor: sphereColor + "20",
                  color: sphereColor
                }}>
                  {engine.sphere}
                </span>
                <span style={styles.engineId}>{engine.id}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.infoNote}>
        <span>ℹ️</span>
        <span>Engines process data and orchestrate scene behavior.</span>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {},
  emptyState: {
    textAlign: "center" as const,
    padding: "48px",
    color: XR_COLORS.textSecondary
  },
  emptyIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "16px",
    opacity: 0.4
  },
  emptyText: {
    margin: 0,
    fontSize: "14px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
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
  engineList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  engineCard: {
    padding: "16px",
    backgroundColor: "#FAFAFA",
    borderRadius: "10px",
    border: "1px solid #E5E5E5"
  },
  engineHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px"
  },
  engineIcon: {
    fontSize: "24px"
  },
  engineName: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  statusBadge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    marginTop: "4px"
  },
  engineDesc: {
    margin: "0 0 12px 0",
    fontSize: "12px",
    color: XR_COLORS.textSecondary,
    lineHeight: 1.4
  },
  engineMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  sphereTag: {
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: 600
  },
  engineId: {
    fontSize: "10px",
    color: XR_COLORS.textMuted,
    fontFamily: "monospace"
  },
  infoNote: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    backgroundColor: XR_COLORS.info + "10",
    borderRadius: "8px",
    fontSize: "11px",
    color: XR_COLORS.info,
    marginTop: "20px"
  }
};

export default XREnginePanel;
