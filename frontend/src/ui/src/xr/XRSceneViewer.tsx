/**
 * ============================================================
 * CHE·NU — XR UI DASHBOARD — SCENE VIEWER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Main scene viewer with multiple panels for exploring XR scenes.
 */

import React, { useState } from "react";
import { xrStyles, XR_COLORS, combineStyles, getObjectTypeColor, getObjectTypeIcon, getSphereColor } from "./xrStyles";
import { getSceneById, getEnginesForScene, getMemoryForObject, type XRScene, type XRObject, type XRSector } from "./adapters/xrAdapter";
import { XRObjectInspector } from "./XRObjectInspector";
import { XRMiniMap } from "./XRMiniMap";
import { XREnginePanel } from "./XREnginePanel";
import { XRMemoryPanel } from "./XRMemoryPanel";
import { XRProcessPanel } from "./XRProcessPanel";

interface XRSceneViewerProps {
  sceneId: string;
  onBack: () => void;
}

export const XRSceneViewer: React.FC<XRSceneViewerProps> = ({ sceneId, onBack }) => {
  const scene = getSceneById(sceneId);
  const [selectedObject, setSelectedObject] = useState<XRObject | null>(null);
  const [selectedSector, setSelectedSector] = useState<XRSector | null>(null);
  const [activePanel, setActivePanel] = useState<"inspector" | "engines" | "memory" | "processes">("inspector");

  if (!scene) {
    return (
      <div style={xrStyles.pageContainer}>
        <div style={xrStyles.emptyState}>
          <span style={xrStyles.emptyIcon}>❌</span>
          <p style={xrStyles.emptyText}>Scene not found: {sceneId}</p>
          <button onClick={onBack} style={styles.backBtn}>← Back</button>
        </div>
      </div>
    );
  }

  const sphereColor = getSphereColor(scene.sphere);
  const engines = getEnginesForScene(sceneId);
  const allObjects = scene.sectors.flatMap(s => s.objects);

  return (
    <div style={xrStyles.pageContainer}>
      {/* Header */}
      <div style={xrStyles.pageHeader}>
        <button style={styles.backButton} onClick={onBack}>
          ← Back to Scenes
        </button>
        <div style={styles.headerRow}>
          <div style={styles.headerInfo}>
            <div style={styles.headerTitle}>
              <span style={styles.sceneIcon}>🎬</span>
              <div>
                <h1 style={styles.title}>{scene.name}</h1>
                <div style={styles.headerMeta}>
                  <span style={{
                    ...styles.sphereBadge,
                    backgroundColor: sphereColor + "20",
                    color: sphereColor
                  }}>
                    {scene.sphere}
                  </span>
                  <span style={styles.domain}>{scene.domain}</span>
                  <span style={styles.sceneId}>{scene.id}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.headerBadges}>
            <span style={xrStyles.safeIndicator}>🔒 SAFE</span>
            <span style={combineStyles(xrStyles.badge, xrStyles.badgeNeutral)}>📖 Read-Only</span>
          </div>
        </div>
        <p style={styles.description}>{scene.description}</p>
      </div>

      {/* Main Content Grid */}
      <div style={styles.mainGrid}>
        {/* Left Column - Scene Tree & MiniMap */}
        <div style={styles.leftColumn}>
          {/* Scene Overview Panel */}
          <div style={xrStyles.panel}>
            <div style={xrStyles.panelHeader}>
              <h3 style={xrStyles.panelTitle}>
                <span>📊</span> Scene Overview
              </h3>
            </div>
            <div style={xrStyles.panelContent}>
              <div style={styles.overviewStats}>
                <div style={styles.overviewStat}>
                  <span style={styles.overviewValue}>{scene.sectors.length}</span>
                  <span style={styles.overviewLabel}>Sectors</span>
                </div>
                <div style={styles.overviewStat}>
                  <span style={styles.overviewValue}>{allObjects.length}</span>
                  <span style={styles.overviewLabel}>Objects</span>
                </div>
                <div style={styles.overviewStat}>
                  <span style={styles.overviewValue}>{scene.engines.length}</span>
                  <span style={styles.overviewLabel}>Engines</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sector List Panel */}
          <div style={xrStyles.panel}>
            <div style={xrStyles.panelHeader}>
              <h3 style={xrStyles.panelTitle}>
                <span>🗺️</span> Sectors
              </h3>
            </div>
            <div style={xrStyles.panelContent}>
              {scene.sectors.map(sector => (
                <div
                  key={sector.id}
                  style={{
                    ...styles.sectorItem,
                    ...(selectedSector?.id === sector.id ? styles.sectorItemActive : {}),
                    borderLeftColor: sector.color
                  }}
                  onClick={() => setSelectedSector(sector)}
                >
                  <div style={styles.sectorHeader}>
                    <span style={{
                      ...styles.sectorDot,
                      backgroundColor: sector.color
                    }} />
                    <span style={styles.sectorName}>{sector.name}</span>
                    <span style={styles.sectorCount}>{sector.objects.length} objects</span>
                  </div>
                  <div style={styles.sectorBounds}>
                    {sector.bounds.width}×{sector.bounds.height}×{sector.bounds.depth}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Object List Panel */}
          <div style={xrStyles.panel}>
            <div style={xrStyles.panelHeader}>
              <h3 style={xrStyles.panelTitle}>
                <span>📦</span> Objects
                {selectedSector && <span style={styles.filterNote}>(in {selectedSector.name})</span>}
              </h3>
              {selectedSector && (
                <button 
                  style={styles.clearFilter}
                  onClick={() => setSelectedSector(null)}
                >
                  Clear
                </button>
              )}
            </div>
            <div style={styles.objectList}>
              {(selectedSector ? selectedSector.objects : allObjects).map(obj => (
                <div
                  key={obj.id}
                  style={{
                    ...styles.objectItem,
                    ...(selectedObject?.id === obj.id ? styles.objectItemActive : {})
                  }}
                  onClick={() => setSelectedObject(obj)}
                >
                  <span style={{
                    ...styles.objectIcon,
                    backgroundColor: getObjectTypeColor(obj.type) + "20"
                  }}>
                    {getObjectTypeIcon(obj.type)}
                  </span>
                  <div style={styles.objectInfo}>
                    <span style={styles.objectName}>{obj.name}</span>
                    <span style={styles.objectType}>{obj.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MiniMap */}
          <XRMiniMap scene={scene} selectedSector={selectedSector} selectedObject={selectedObject} />
        </div>

        {/* Right Column - Detail Panels */}
        <div style={styles.rightColumn}>
          {/* Panel Tabs */}
          <div style={styles.panelTabs}>
            <button
              style={{
                ...styles.panelTab,
                ...(activePanel === "inspector" ? styles.panelTabActive : {})
              }}
              onClick={() => setActivePanel("inspector")}
            >
              🔍 Inspector
            </button>
            <button
              style={{
                ...styles.panelTab,
                ...(activePanel === "engines" ? styles.panelTabActive : {})
              }}
              onClick={() => setActivePanel("engines")}
            >
              ⚙️ Engines
            </button>
            <button
              style={{
                ...styles.panelTab,
                ...(activePanel === "memory" ? styles.panelTabActive : {})
              }}
              onClick={() => setActivePanel("memory")}
            >
              🧠 Memory
            </button>
            <button
              style={{
                ...styles.panelTab,
                ...(activePanel === "processes" ? styles.panelTabActive : {})
              }}
              onClick={() => setActivePanel("processes")}
            >
              🔄 Processes
            </button>
          </div>

          {/* Panel Content */}
          <div style={styles.panelContent}>
            {activePanel === "inspector" && (
              <XRObjectInspector object={selectedObject} />
            )}
            {activePanel === "engines" && (
              <XREnginePanel sceneId={sceneId} engines={engines} />
            )}
            {activePanel === "memory" && (
              <XRMemoryPanel sceneId={sceneId} selectedObjectId={selectedObject?.id} />
            )}
            {activePanel === "processes" && (
              <XRProcessPanel sceneId={sceneId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backButton: {
    background: "none",
    border: "none",
    color: XR_COLORS.textSecondary,
    cursor: "pointer",
    fontSize: "13px",
    padding: "0",
    marginBottom: "16px"
  },
  backBtn: {
    marginTop: "16px",
    padding: "8px 16px",
    backgroundColor: XR_COLORS.primary,
    color: "#FFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  headerInfo: {},
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  sceneIcon: {
    fontSize: "40px"
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
    color: XR_COLORS.textPrimary
  },
  headerMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "6px"
  },
  sphereBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600
  },
  domain: {
    fontSize: "13px",
    color: XR_COLORS.textSecondary
  },
  sceneId: {
    fontSize: "11px",
    color: XR_COLORS.textMuted,
    fontFamily: "monospace"
  },
  headerBadges: {
    display: "flex",
    gap: "8px"
  },
  description: {
    margin: "16px 0 0 0",
    fontSize: "14px",
    color: XR_COLORS.textSecondary,
    lineHeight: 1.5,
    maxWidth: "600px"
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: "24px",
    marginTop: "24px"
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column"
  },
  overviewStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px"
  },
  overviewStat: {
    textAlign: "center" as const,
    padding: "12px",
    backgroundColor: "#FAFAFA",
    borderRadius: "8px"
  },
  overviewValue: {
    display: "block",
    fontSize: "24px",
    fontWeight: 700,
    color: XR_COLORS.primary
  },
  overviewLabel: {
    display: "block",
    fontSize: "11px",
    color: XR_COLORS.textSecondary
  },
  sectorItem: {
    padding: "12px",
    borderLeft: "3px solid",
    backgroundColor: "#FAFAFA",
    borderRadius: "0 8px 8px 0",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "all 0.15s"
  },
  sectorItemActive: {
    backgroundColor: XR_COLORS.primary + "10"
  },
  sectorHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  sectorDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%"
  },
  sectorName: {
    flex: 1,
    fontSize: "13px",
    fontWeight: 500,
    color: XR_COLORS.textPrimary
  },
  sectorCount: {
    fontSize: "11px",
    color: XR_COLORS.textMuted
  },
  sectorBounds: {
    marginTop: "4px",
    marginLeft: "18px",
    fontSize: "10px",
    color: XR_COLORS.textMuted,
    fontFamily: "monospace"
  },
  filterNote: {
    fontSize: "11px",
    color: XR_COLORS.textMuted,
    fontWeight: 400,
    marginLeft: "8px"
  },
  clearFilter: {
    padding: "4px 8px",
    backgroundColor: "transparent",
    border: "1px solid #E5E5E5",
    borderRadius: "4px",
    fontSize: "10px",
    color: XR_COLORS.textSecondary,
    cursor: "pointer"
  },
  objectList: {
    maxHeight: "300px",
    overflowY: "auto" as const
  },
  objectItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.15s"
  },
  objectItemActive: {
    backgroundColor: XR_COLORS.primary + "15"
  },
  objectIcon: {
    padding: "8px",
    borderRadius: "8px",
    fontSize: "16px"
  },
  objectInfo: {},
  objectName: {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: XR_COLORS.textPrimary
  },
  objectType: {
    display: "block",
    fontSize: "10px",
    color: XR_COLORS.textMuted,
    textTransform: "uppercase" as const
  },
  panelTabs: {
    display: "flex",
    gap: "4px",
    marginBottom: "16px"
  },
  panelTab: {
    flex: 1,
    padding: "12px 16px",
    backgroundColor: "#F0F0F0",
    border: "none",
    borderRadius: "8px 8px 0 0",
    fontSize: "13px",
    fontWeight: 500,
    color: XR_COLORS.textSecondary,
    cursor: "pointer",
    transition: "all 0.15s"
  },
  panelTabActive: {
    backgroundColor: XR_COLORS.surface,
    color: XR_COLORS.primary,
    boxShadow: "0 -2px 0 " + XR_COLORS.primary + " inset"
  },
  panelContent: {
    flex: 1,
    backgroundColor: XR_COLORS.surface,
    borderRadius: "0 0 12px 12px",
    border: "1px solid #E5E5E5",
    borderTop: "none",
    padding: "20px",
    minHeight: "500px"
  }
};

export default XRSceneViewer;
