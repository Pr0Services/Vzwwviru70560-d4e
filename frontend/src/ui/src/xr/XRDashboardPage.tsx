/**
 * ============================================================
 * CHE·NU — XR UI DASHBOARD — DASHBOARD PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Root dashboard for XR visualization system.
 */

import React from "react";
import { xrStyles, XR_COLORS, combineStyles } from "./xrStyles";
import { getXrStats, getXrScenesMock, getXrUniversesMock, getXrPresetsMock } from "./adapters/xrAdapter";

type XRPageType = "scenes" | "universes" | "avatars" | "presets" | "tools";

interface XRDashboardPageProps {
  onNavigate: (page: XRPageType) => void;
  onSceneSelect: (sceneId: string) => void;
  onUniverseSelect: (universeId: string) => void;
}

export const XRDashboardPage: React.FC<XRDashboardPageProps> = ({
  onNavigate,
  onSceneSelect,
  onUniverseSelect
}) => {
  const stats = getXrStats();
  const scenes = getXrScenesMock();
  const universes = getXrUniversesMock();
  const presets = getXrPresetsMock();

  return (
    <div style={xrStyles.pageContainer}>
      {/* Header */}
      <div style={xrStyles.pageHeader}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={xrStyles.pageTitle}>
              <span style={styles.xrIcon}>🔮</span>
              XR Dashboard
            </h1>
            <p style={xrStyles.pageSubtitle}>
              Explore and visualize XR scenes, universes, and spatial structures
            </p>
          </div>
          <div style={styles.headerBadges}>
            <span style={xrStyles.safeIndicator}>
              🔒 SAFE Mode
            </span>
            <span style={combineStyles(xrStyles.badge, xrStyles.badgeNeutral)}>
              📖 Read-Only
            </span>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div style={xrStyles.readOnlyBanner}>
        <span>⚠️</span>
        <span>XR visualization is purely representational. No real 3D rendering or WebXR.</span>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard icon="🎬" value={stats.totalScenes} label="Scenes" color={XR_COLORS.xrPanel} />
        <StatCard icon="🌌" value={stats.totalUniverses} label="Universes" color={XR_COLORS.primary} />
        <StatCard icon="👤" value={stats.totalAvatars} label="Avatars" color={XR_COLORS.xrAvatar} />
        <StatCard icon="📦" value={stats.totalPresets} label="Presets" color={XR_COLORS.accent1} />
        <StatCard icon="🔷" value={stats.totalObjects} label="Objects" color={XR_COLORS.xrNode} />
        <StatCard icon="🗺️" value={stats.totalSectors} label="Sectors" color={XR_COLORS.accent3} />
      </div>

      {/* Quick Navigation */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Navigation</h2>
        <div style={styles.navGrid}>
          <NavCard
            icon="🎬"
            title="Scene List"
            description="Browse all XR scenes"
            count={stats.totalScenes}
            onClick={() => onNavigate("scenes")}
          />
          <NavCard
            icon="🌌"
            title="Universe List"
            description="Explore XR universes"
            count={stats.totalUniverses}
            onClick={() => onNavigate("universes")}
          />
          <NavCard
            icon="👤"
            title="Avatar Browser"
            description="View avatar morphologies"
            count={stats.totalAvatars}
            onClick={() => onNavigate("avatars")}
          />
          <NavCard
            icon="📦"
            title="Preset Gallery"
            description="Scene templates & presets"
            count={stats.totalPresets}
            onClick={() => onNavigate("presets")}
          />
          <NavCard
            icon="🔧"
            title="XR Tools"
            description="Conceptual tools & helpers"
            count={6}
            onClick={() => onNavigate("tools")}
          />
        </div>
      </div>

      {/* Recent Scenes */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Scenes</h2>
          <button 
            style={combineStyles(xrStyles.button, xrStyles.buttonOutline)}
            onClick={() => onNavigate("scenes")}
          >
            View All →
          </button>
        </div>
        <div style={styles.scenesGrid}>
          {scenes.slice(0, 4).map(scene => (
            <SceneCard
              key={scene.id}
              scene={scene}
              onClick={() => onSceneSelect(scene.id)}
            />
          ))}
        </div>
      </div>

      {/* Universes Overview */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Universes</h2>
          <button 
            style={combineStyles(xrStyles.button, xrStyles.buttonOutline)}
            onClick={() => onNavigate("universes")}
          >
            View All →
          </button>
        </div>
        <div style={styles.universesGrid}>
          {universes.map(universe => (
            <UniverseCard
              key={universe.id}
              universe={universe}
              onClick={() => onUniverseSelect(universe.id)}
            />
          ))}
        </div>
      </div>

      {/* Presets Preview */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Popular Presets</h2>
          <button 
            style={combineStyles(xrStyles.button, xrStyles.buttonOutline)}
            onClick={() => onNavigate("presets")}
          >
            View Gallery →
          </button>
        </div>
        <div style={styles.presetsGrid}>
          {presets.slice(0, 6).map(preset => (
            <PresetMiniCard key={preset.id} preset={preset} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>CHE·NU XR Layer v3 — SAFE · NON-AUTONOMOUS · REPRESENTATIONAL</span>
      </div>
    </div>
  );
};

// Stat Card
const StatCard: React.FC<{ icon: string; value: number; label: string; color: string }> = ({
  icon,
  value,
  label,
  color
}) => (
  <div style={xrStyles.statCard}>
    <span style={{ fontSize: "24px", marginBottom: "8px", display: "block" }}>{icon}</span>
    <span style={{ ...xrStyles.statValue, color }}>{value}</span>
    <span style={xrStyles.statLabel}>{label}</span>
  </div>
);

// Navigation Card
const NavCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  count: number;
  onClick: () => void;
}> = ({ icon, title, description, count, onClick }) => (
  <div style={styles.navCard} onClick={onClick}>
    <span style={styles.navIcon}>{icon}</span>
    <div>
      <h3 style={styles.navTitle}>{title}</h3>
      <p style={styles.navDesc}>{description}</p>
    </div>
    <span style={styles.navCount}>{count}</span>
  </div>
);

// Scene Card
const SceneCard: React.FC<{
  scene: ReturnType<typeof getXrScenesMock>[0];
  onClick: () => void;
}> = ({ scene, onClick }) => {
  const objectCount = scene.sectors.reduce((acc, s) => acc + s.objects.length, 0);
  
  return (
    <div style={styles.sceneCard} onClick={onClick}>
      {/* Mini Preview */}
      <div style={styles.scenePreview}>
        <div style={styles.previewGrid}>
          {scene.sectors.map(sector => (
            <div
              key={sector.id}
              style={{
                ...styles.previewSector,
                backgroundColor: sector.color + "40"
              }}
            >
              {sector.objects.slice(0, 3).map((obj, i) => (
                <div
                  key={obj.id}
                  style={{
                    ...styles.previewDot,
                    backgroundColor: sector.color,
                    left: `${20 + i * 25}%`,
                    top: `${30 + (i % 2) * 20}%`
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Info */}
      <div style={styles.sceneInfo}>
        <h4 style={styles.sceneName}>{scene.name}</h4>
        <span style={styles.sceneSphere}>{scene.sphere} · {scene.domain}</span>
        <div style={styles.sceneMeta}>
          <span>{scene.sectors.length} sectors</span>
          <span>{objectCount} objects</span>
        </div>
      </div>
    </div>
  );
};

// Universe Card
const UniverseCard: React.FC<{
  universe: ReturnType<typeof getXrUniversesMock>[0];
  onClick: () => void;
}> = ({ universe, onClick }) => (
  <div style={styles.universeCard} onClick={onClick}>
    <div style={{
      ...styles.universeHeader,
      backgroundColor: universe.theme.primaryColor + "20"
    }}>
      <span style={styles.universeIcon}>🌌</span>
    </div>
    <div style={styles.universeContent}>
      <h3 style={styles.universeName}>{universe.name}</h3>
      <p style={styles.universeDesc}>{universe.description}</p>
      <div style={styles.universeMeta}>
        <span>🎬 {universe.scenes.length} scenes</span>
      </div>
    </div>
  </div>
);

// Preset Mini Card
const PresetMiniCard: React.FC<{
  preset: ReturnType<typeof getXrPresetsMock>[0];
}> = ({ preset }) => (
  <div style={styles.presetMini}>
    <span style={styles.presetIcon}>{preset.thumbnail}</span>
    <span style={styles.presetName}>{preset.name}</span>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  headerBadges: {
    display: "flex",
    gap: "8px"
  },
  xrIcon: {
    fontSize: "32px"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "16px",
    marginBottom: "32px"
  },
  section: {
    marginBottom: "32px"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },
  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  navGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "12px"
  },
  navCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center" as const,
    padding: "20px",
    backgroundColor: XR_COLORS.surface,
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #E5E5E5",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  navIcon: {
    fontSize: "32px",
    marginBottom: "12px"
  },
  navTitle: {
    margin: "0 0 4px 0",
    fontSize: "14px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  navDesc: {
    margin: 0,
    fontSize: "11px",
    color: XR_COLORS.textSecondary
  },
  navCount: {
    marginTop: "12px",
    padding: "4px 12px",
    backgroundColor: XR_COLORS.primary + "20",
    color: XR_COLORS.primary,
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600
  },
  scenesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px"
  },
  sceneCard: {
    backgroundColor: XR_COLORS.surface,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #E5E5E5",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  scenePreview: {
    height: "100px",
    backgroundColor: XR_COLORS.background,
    position: "relative",
    overflow: "hidden"
  },
  previewGrid: {
    display: "flex",
    height: "100%",
    gap: "2px",
    padding: "8px"
  },
  previewSector: {
    flex: 1,
    borderRadius: "4px",
    position: "relative"
  },
  previewDot: {
    position: "absolute",
    width: "8px",
    height: "8px",
    borderRadius: "50%"
  },
  sceneInfo: {
    padding: "12px"
  },
  sceneName: {
    margin: "0 0 4px 0",
    fontSize: "14px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  sceneSphere: {
    display: "block",
    fontSize: "11px",
    color: XR_COLORS.textSecondary,
    marginBottom: "8px"
  },
  sceneMeta: {
    display: "flex",
    gap: "12px",
    fontSize: "11px",
    color: XR_COLORS.textMuted
  },
  universesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px"
  },
  universeCard: {
    backgroundColor: XR_COLORS.surface,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #E5E5E5",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  universeHeader: {
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  universeIcon: {
    fontSize: "36px"
  },
  universeContent: {
    padding: "16px"
  },
  universeName: {
    margin: "0 0 6px 0",
    fontSize: "16px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  universeDesc: {
    margin: "0 0 12px 0",
    fontSize: "12px",
    color: XR_COLORS.textSecondary,
    lineHeight: 1.4
  },
  universeMeta: {
    fontSize: "12px",
    color: XR_COLORS.textMuted
  },
  presetsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "12px"
  },
  presetMini: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px",
    backgroundColor: XR_COLORS.surface,
    borderRadius: "10px",
    border: "1px solid #E5E5E5"
  },
  presetIcon: {
    fontSize: "28px",
    marginBottom: "8px"
  },
  presetName: {
    fontSize: "11px",
    color: XR_COLORS.textSecondary,
    textAlign: "center" as const
  },
  footer: {
    textAlign: "center" as const,
    padding: "24px 0",
    borderTop: "1px solid #E5E5E5",
    fontSize: "12px",
    color: XR_COLORS.textSecondary
  }
};

export default XRDashboardPage;
