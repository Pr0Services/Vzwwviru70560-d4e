/**
 * ============================================================
 * CHE·NU — XR UI DASHBOARD — UNIVERSE LIST PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import { xrStyles, XR_COLORS, combineStyles } from "./xrStyles";
import { getXrUniversesMock, type XRUniverse } from "./adapters/xrAdapter";

interface XRUniverseListPageProps {
  onBack: () => void;
  onUniverseSelect: (universeId: string) => void;
}

export const XRUniverseListPage: React.FC<XRUniverseListPageProps> = ({ onBack, onUniverseSelect }) => {
  const universes = getXrUniversesMock();

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
              <span>🌌</span>
              XR Universes
            </h1>
            <p style={xrStyles.pageSubtitle}>
              Explore multi-scene universes ({universes.length} total)
            </p>
          </div>
          <span style={xrStyles.safeIndicator}>🔒 Read-Only</span>
        </div>
      </div>

      {/* Info Banner */}
      <div style={styles.infoBanner}>
        <span style={styles.infoIcon}>ℹ️</span>
        <div>
          <strong>What is a Universe?</strong>
          <p style={styles.infoText}>
            A Universe is a collection of interconnected XR scenes that share a common theme, 
            navigation structure, and visual identity. Each universe has a root scene as its entry point.
          </p>
        </div>
      </div>

      {/* Universe Cards */}
      <div style={styles.universesGrid}>
        {universes.map(universe => (
          <UniverseCard
            key={universe.id}
            universe={universe}
            onClick={() => onUniverseSelect(universe.id)}
          />
        ))}
      </div>

      {/* Comparison Table */}
      <div style={styles.comparisonSection}>
        <h2 style={styles.sectionTitle}>Universe Comparison</h2>
        <div style={styles.tableWrapper}>
          <table style={xrStyles.table}>
            <thead>
              <tr>
                <th style={xrStyles.th}>Universe</th>
                <th style={xrStyles.th}>Scenes</th>
                <th style={xrStyles.th}>Root Scene</th>
                <th style={xrStyles.th}>Theme</th>
                <th style={xrStyles.th}>Total Objects</th>
              </tr>
            </thead>
            <tbody>
              {universes.map(universe => {
                const totalObjects = universe.scenes.reduce(
                  (acc, s) => acc + s.sectors.reduce((a, sec) => a + sec.objects.length, 0), 0
                );
                const rootScene = universe.scenes.find(s => s.id === universe.rootSceneId);
                
                return (
                  <tr key={universe.id} style={styles.tableRow} onClick={() => onUniverseSelect(universe.id)}>
                    <td style={xrStyles.td}>
                      <div style={styles.universeCell}>
                        <span style={styles.universeIcon}>🌌</span>
                        <div>
                          <span style={styles.universeName}>{universe.name}</span>
                          <span style={styles.universeId}>{universe.id}</span>
                        </div>
                      </div>
                    </td>
                    <td style={xrStyles.td}>
                      <span style={styles.countBadge}>{universe.scenes.length}</span>
                    </td>
                    <td style={xrStyles.td}>{rootScene?.name || "—"}</td>
                    <td style={xrStyles.td}>
                      <div style={styles.themePreview}>
                        <span style={{
                          ...styles.colorDot,
                          backgroundColor: universe.theme.primaryColor
                        }} />
                        <span style={{
                          ...styles.colorDot,
                          backgroundColor: universe.theme.ambientColor
                        }} />
                      </div>
                    </td>
                    <td style={xrStyles.td}>{totalObjects}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Universe Card Component
const UniverseCard: React.FC<{ universe: XRUniverse; onClick: () => void }> = ({ universe, onClick }) => {
  const totalObjects = universe.scenes.reduce(
    (acc, s) => acc + s.sectors.reduce((a, sec) => a + sec.objects.length, 0), 0
  );
  const totalSectors = universe.scenes.reduce((acc, s) => acc + s.sectors.length, 0);

  return (
    <div style={styles.universeCard} onClick={onClick}>
      {/* Header with theme */}
      <div style={{
        ...styles.cardHeader,
        background: `linear-gradient(135deg, ${universe.theme.primaryColor}30, ${universe.theme.ambientColor}50)`
      }}>
        <span style={styles.cardIcon}>🌌</span>
        <div style={styles.themeColors}>
          <span style={{
            ...styles.themeDot,
            backgroundColor: universe.theme.primaryColor
          }} />
          <span style={{
            ...styles.themeDot,
            backgroundColor: universe.theme.ambientColor
          }} />
        </div>
      </div>

      {/* Content */}
      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{universe.name}</h3>
        <p style={styles.cardDescription}>{universe.description}</p>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statValue}>{universe.scenes.length}</span>
            <span style={styles.statLabel}>Scenes</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statValue}>{totalSectors}</span>
            <span style={styles.statLabel}>Sectors</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statValue}>{totalObjects}</span>
            <span style={styles.statLabel}>Objects</span>
          </div>
        </div>

        {/* Scene Preview */}
        <div style={styles.scenesPreview}>
          <span style={styles.previewLabel}>Scenes:</span>
          <div style={styles.sceneTags}>
            {universe.scenes.slice(0, 3).map(scene => (
              <span key={scene.id} style={styles.sceneTag}>
                🎬 {scene.name}
              </span>
            ))}
            {universe.scenes.length > 3 && (
              <span style={styles.moreTag}>+{universe.scenes.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Root Scene */}
        <div style={styles.rootScene}>
          <span style={styles.rootLabel}>Entry Point:</span>
          <span style={styles.rootName}>
            {universe.scenes.find(s => s.id === universe.rootSceneId)?.name}
          </span>
        </div>

        {/* View Button */}
        <button style={styles.viewButton}>
          View Universe →
        </button>
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
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  infoBanner: {
    display: "flex",
    gap: "16px",
    padding: "16px 20px",
    backgroundColor: XR_COLORS.primary + "10",
    borderRadius: "12px",
    border: `1px solid ${XR_COLORS.primary}30`,
    marginBottom: "24px"
  },
  infoIcon: {
    fontSize: "24px"
  },
  infoText: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: XR_COLORS.textSecondary,
    lineHeight: 1.5
  },
  universesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: "24px",
    marginBottom: "40px"
  },
  universeCard: {
    backgroundColor: XR_COLORS.surface,
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  cardHeader: {
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  cardIcon: {
    fontSize: "48px"
  },
  themeColors: {
    position: "absolute",
    top: "12px",
    right: "12px",
    display: "flex",
    gap: "4px"
  },
  themeDot: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.5)"
  },
  cardContent: {
    padding: "20px"
  },
  cardTitle: {
    margin: "0 0 8px 0",
    fontSize: "20px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  cardDescription: {
    margin: "0 0 16px 0",
    fontSize: "13px",
    color: XR_COLORS.textSecondary,
    lineHeight: 1.5
  },
  statsRow: {
    display: "flex",
    gap: "24px",
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid #F0F0F0"
  },
  stat: {
    textAlign: "center" as const
  },
  statValue: {
    display: "block",
    fontSize: "24px",
    fontWeight: 700,
    color: XR_COLORS.primary
  },
  statLabel: {
    display: "block",
    fontSize: "11px",
    color: XR_COLORS.textSecondary
  },
  scenesPreview: {
    marginBottom: "12px"
  },
  previewLabel: {
    display: "block",
    fontSize: "11px",
    color: XR_COLORS.textSecondary,
    marginBottom: "6px"
  },
  sceneTags: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px"
  },
  sceneTag: {
    padding: "4px 10px",
    backgroundColor: "#F0F0F0",
    borderRadius: "12px",
    fontSize: "11px",
    color: XR_COLORS.textPrimary
  },
  moreTag: {
    padding: "4px 10px",
    fontSize: "11px",
    color: XR_COLORS.textMuted
  },
  rootScene: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
    padding: "10px",
    backgroundColor: "#FAFAFA",
    borderRadius: "8px"
  },
  rootLabel: {
    fontSize: "11px",
    color: XR_COLORS.textSecondary
  },
  rootName: {
    fontSize: "12px",
    fontWeight: 500,
    color: XR_COLORS.textPrimary
  },
  viewButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: XR_COLORS.primary,
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer"
  },
  comparisonSection: {
    marginTop: "32px"
  },
  sectionTitle: {
    margin: "0 0 16px 0",
    fontSize: "18px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  tableWrapper: {
    backgroundColor: XR_COLORS.surface,
    borderRadius: "12px",
    border: "1px solid #E5E5E5",
    overflow: "hidden"
  },
  tableRow: {
    cursor: "pointer"
  },
  universeCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  universeIcon: {
    fontSize: "24px"
  },
  universeName: {
    display: "block",
    fontWeight: 500,
    color: XR_COLORS.textPrimary
  },
  universeId: {
    display: "block",
    fontSize: "10px",
    color: XR_COLORS.textMuted
  },
  countBadge: {
    padding: "4px 12px",
    backgroundColor: XR_COLORS.primary + "20",
    color: XR_COLORS.primary,
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600
  },
  themePreview: {
    display: "flex",
    gap: "4px"
  },
  colorDot: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "1px solid #E5E5E5"
  }
};

export default XRUniverseListPage;
