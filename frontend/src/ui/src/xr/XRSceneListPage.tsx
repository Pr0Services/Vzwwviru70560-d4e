/**
 * ============================================================
 * CHE·NU — XR UI DASHBOARD — SCENE LIST PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState } from "react";
import { xrStyles, XR_COLORS, combineStyles, getSphereColor, getStatusColor } from "./xrStyles";
import { getXrScenesMock, type XRScene } from "./adapters/xrAdapter";

interface XRSceneListPageProps {
  onBack: () => void;
  onSceneSelect: (sceneId: string) => void;
}

export const XRSceneListPage: React.FC<XRSceneListPageProps> = ({ onBack, onSceneSelect }) => {
  const scenes = getXrScenesMock();
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const spheres = Array.from(new Set(scenes.map(s => s.sphere)));
  
  const filteredScenes = filter === "all" 
    ? scenes 
    : scenes.filter(s => s.sphere === filter);

  return (
    <div style={xrStyles.pageContainer}>
      {/* Header */}
      <div style={xrStyles.pageHeader}>
        <button style={styles.backButton} onClick={onBack}>
          ← Back to XR Dashboard
        </button>
        <div style={styles.headerRow}>
          <div>
            <h1 style={xrStyles.pageTitle}>
              <span>🎬</span>
              XR Scenes
            </h1>
            <p style={xrStyles.pageSubtitle}>
              Browse and explore all XR scenes ({scenes.length} total)
            </p>
          </div>
          <span style={xrStyles.safeIndicator}>🔒 Read-Only</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={styles.filtersBar}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Filter by Sphere:</span>
          <div style={styles.filterButtons}>
            <button
              style={{
                ...styles.filterButton,
                ...(filter === "all" ? styles.filterButtonActive : {})
              }}
              onClick={() => setFilter("all")}
            >
              All ({scenes.length})
            </button>
            {spheres.map(sphere => (
              <button
                key={sphere}
                style={{
                  ...styles.filterButton,
                  ...(filter === sphere ? styles.filterButtonActive : {})
                }}
                onClick={() => setFilter(sphere)}
              >
                {sphere} ({scenes.filter(s => s.sphere === sphere).length})
              </button>
            ))}
          </div>
        </div>
        
        <div style={styles.viewToggle}>
          <button
            style={{
              ...styles.viewButton,
              ...(viewMode === "grid" ? styles.viewButtonActive : {})
            }}
            onClick={() => setViewMode("grid")}
          >
            ▦ Grid
          </button>
          <button
            style={{
              ...styles.viewButton,
              ...(viewMode === "list" ? styles.viewButtonActive : {})
            }}
            onClick={() => setViewMode("list")}
          >
            ☰ List
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div style={styles.sceneGrid}>
          {filteredScenes.map(scene => (
            <SceneGridCard
              key={scene.id}
              scene={scene}
              onClick={() => onSceneSelect(scene.id)}
            />
          ))}
        </div>
      ) : (
        <div style={styles.sceneList}>
          <table style={xrStyles.table}>
            <thead>
              <tr>
                <th style={xrStyles.th}>Scene</th>
                <th style={xrStyles.th}>Sphere</th>
                <th style={xrStyles.th}>Domain</th>
                <th style={xrStyles.th}>Sectors</th>
                <th style={xrStyles.th}>Objects</th>
                <th style={xrStyles.th}>Status</th>
                <th style={xrStyles.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredScenes.map(scene => (
                <SceneListRow
                  key={scene.id}
                  scene={scene}
                  onClick={() => onSceneSelect(scene.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredScenes.length === 0 && (
        <div style={xrStyles.emptyState}>
          <span style={xrStyles.emptyIcon}>🎬</span>
          <p style={xrStyles.emptyText}>No scenes found for this filter</p>
        </div>
      )}
    </div>
  );
};

// Grid Card Component
const SceneGridCard: React.FC<{ scene: XRScene; onClick: () => void }> = ({ scene, onClick }) => {
  const objectCount = scene.sectors.reduce((acc, s) => acc + s.objects.length, 0);
  const sphereColor = getSphereColor(scene.sphere);
  const statusColor = getStatusColor(scene.status);

  return (
    <div style={styles.gridCard} onClick={onClick}>
      {/* Preview */}
      <div style={styles.cardPreview}>
        <div style={styles.previewContent}>
          {scene.sectors.map(sector => (
            <div
              key={sector.id}
              style={{
                ...styles.sectorBlock,
                backgroundColor: sector.color + "30",
                borderColor: sector.color
              }}
            >
              {sector.objects.slice(0, 4).map((obj, i) => (
                <div
                  key={obj.id}
                  style={{
                    ...styles.objectDot,
                    backgroundColor: sector.color,
                    left: `${15 + (i % 2) * 35}%`,
                    top: `${20 + Math.floor(i / 2) * 30}%`
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <span style={{
          ...styles.statusBadge,
          backgroundColor: statusColor + "20",
          color: statusColor
        }}>
          {scene.status}
        </span>
      </div>

      {/* Info */}
      <div style={styles.cardInfo}>
        <h3 style={styles.cardTitle}>{scene.name}</h3>
        <div style={styles.cardSphere}>
          <span style={{
            ...styles.sphereDot,
            backgroundColor: sphereColor
          }} />
          {scene.sphere}
        </div>
        <p style={styles.cardDomain}>{scene.domain}</p>
        
        <div style={styles.cardStats}>
          <div style={styles.cardStat}>
            <span style={styles.statValue}>{scene.sectors.length}</span>
            <span style={styles.statLabel}>Sectors</span>
          </div>
          <div style={styles.cardStat}>
            <span style={styles.statValue}>{objectCount}</span>
            <span style={styles.statLabel}>Objects</span>
          </div>
          <div style={styles.cardStat}>
            <span style={styles.statValue}>{scene.engines.length}</span>
            <span style={styles.statLabel}>Engines</span>
          </div>
        </div>

        <div style={styles.cardEngines}>
          {scene.engines.slice(0, 3).map(engine => (
            <span key={engine} style={styles.engineTag}>{engine}</span>
          ))}
          {scene.engines.length > 3 && (
            <span style={styles.engineMore}>+{scene.engines.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// List Row Component
const SceneListRow: React.FC<{ scene: XRScene; onClick: () => void }> = ({ scene, onClick }) => {
  const objectCount = scene.sectors.reduce((acc, s) => acc + s.objects.length, 0);
  const sphereColor = getSphereColor(scene.sphere);
  const statusColor = getStatusColor(scene.status);

  return (
    <tr style={styles.listRow} onClick={onClick}>
      <td style={xrStyles.td}>
        <div style={styles.sceneCell}>
          <span style={styles.sceneIcon}>🎬</span>
          <div>
            <span style={styles.sceneName}>{scene.name}</span>
            <span style={styles.sceneId}>{scene.id}</span>
          </div>
        </div>
      </td>
      <td style={xrStyles.td}>
        <span style={{
          ...styles.sphereBadge,
          backgroundColor: sphereColor + "20",
          color: sphereColor
        }}>
          {scene.sphere}
        </span>
      </td>
      <td style={xrStyles.td}>{scene.domain}</td>
      <td style={xrStyles.td}>{scene.sectors.length}</td>
      <td style={xrStyles.td}>{objectCount}</td>
      <td style={xrStyles.td}>
        <span style={{
          ...styles.statusTag,
          backgroundColor: statusColor + "20",
          color: statusColor
        }}>
          {scene.status}
        </span>
      </td>
      <td style={xrStyles.td}>{scene.createdAt}</td>
    </tr>
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
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  filtersBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: XR_COLORS.surface,
    borderRadius: "12px",
    border: "1px solid #E5E5E5",
    marginBottom: "24px"
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  filterLabel: {
    fontSize: "13px",
    color: XR_COLORS.textSecondary
  },
  filterButtons: {
    display: "flex",
    gap: "8px"
  },
  filterButton: {
    padding: "6px 12px",
    borderRadius: "16px",
    border: "1px solid #E5E5E5",
    backgroundColor: "transparent",
    fontSize: "12px",
    color: XR_COLORS.textSecondary,
    cursor: "pointer"
  },
  filterButtonActive: {
    backgroundColor: XR_COLORS.primary + "20",
    borderColor: XR_COLORS.primary,
    color: XR_COLORS.primary
  },
  viewToggle: {
    display: "flex",
    gap: "4px"
  },
  viewButton: {
    padding: "6px 12px",
    border: "1px solid #E5E5E5",
    backgroundColor: "transparent",
    fontSize: "12px",
    color: XR_COLORS.textSecondary,
    cursor: "pointer"
  },
  viewButtonActive: {
    backgroundColor: XR_COLORS.textPrimary,
    borderColor: XR_COLORS.textPrimary,
    color: "#FFFFFF"
  },
  sceneGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  sceneList: {
    backgroundColor: XR_COLORS.surface,
    borderRadius: "12px",
    border: "1px solid #E5E5E5",
    overflow: "hidden"
  },
  gridCard: {
    backgroundColor: XR_COLORS.surface,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #E5E5E5",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  cardPreview: {
    height: "140px",
    backgroundColor: XR_COLORS.background,
    position: "relative",
    padding: "12px"
  },
  previewContent: {
    display: "flex",
    gap: "8px",
    height: "100%"
  },
  sectorBlock: {
    flex: 1,
    borderRadius: "6px",
    border: "1px solid",
    position: "relative"
  },
  objectDot: {
    position: "absolute",
    width: "10px",
    height: "10px",
    borderRadius: "50%"
  },
  statusBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    padding: "3px 8px",
    borderRadius: "10px",
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase" as const
  },
  cardInfo: {
    padding: "16px"
  },
  cardTitle: {
    margin: "0 0 8px 0",
    fontSize: "16px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  cardSphere: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: XR_COLORS.textSecondary,
    marginBottom: "4px"
  },
  sphereDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%"
  },
  cardDomain: {
    margin: "0 0 12px 0",
    fontSize: "12px",
    color: XR_COLORS.textMuted
  },
  cardStats: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid #F0F0F0"
  },
  cardStat: {
    textAlign: "center" as const
  },
  statValue: {
    display: "block",
    fontSize: "18px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  statLabel: {
    display: "block",
    fontSize: "10px",
    color: XR_COLORS.textSecondary
  },
  cardEngines: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px"
  },
  engineTag: {
    padding: "3px 8px",
    backgroundColor: "#F0F0F0",
    borderRadius: "4px",
    fontSize: "10px",
    color: XR_COLORS.textSecondary
  },
  engineMore: {
    padding: "3px 8px",
    fontSize: "10px",
    color: XR_COLORS.textMuted
  },
  listRow: {
    cursor: "pointer",
    transition: "background-color 0.15s"
  },
  sceneCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  sceneIcon: {
    fontSize: "20px"
  },
  sceneName: {
    display: "block",
    fontWeight: 500,
    color: XR_COLORS.textPrimary
  },
  sceneId: {
    display: "block",
    fontSize: "10px",
    color: XR_COLORS.textMuted
  },
  sphereBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600
  },
  statusTag: {
    padding: "3px 8px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase" as const
  }
};

export default XRSceneListPage;
