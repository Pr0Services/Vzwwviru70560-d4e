/**
 * ============================================================
 * CHE·NU — XR PAGE — DASHBOARD
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import { XRSceneViewer } from "../components/XRSceneViewer";
import { XRAvatarCard } from "../components/XRAvatarCard";
import { XRSpatialMap } from "../components/XRSpatialMap";
import { XRSessionStatus } from "../components/XRSessionStatus";

// Import adapters
import { getAllScenes, getSceneById } from "../../adapters/xrSceneAdapter";
import { getAllAvatars, getNovaAvatar } from "../../adapters/xrAvatarAdapter";
import { getAllZones, getAllPaths, getAllMarkers, getAllSpawnPoints } from "../../adapters/xrSpatialAdapter";
import { getCurrentSession, getSessionStats } from "../../adapters/xrSessionAdapter";

// ============================================================
// STYLES
// ============================================================

const styles = {
  page: {
    backgroundColor: "#0a0a0f",
    minHeight: "100vh",
    padding: "24px",
    color: "#E9E4D6",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#D8B26A",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#8D8371",
    marginTop: "4px",
  },
  quickStats: {
    display: "flex",
    gap: "12px",
  },
  statBox: {
    backgroundColor: "#1E1F22",
    borderRadius: "8px",
    padding: "12px 20px",
    textAlign: "center" as const,
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#3EB4A2",
  },
  statLabel: {
    fontSize: "11px",
    color: "#8D8371",
    textTransform: "uppercase" as const,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
  },
  fullWidth: {
    gridColumn: "1 / -1",
  },
  section: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#D8B26A",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  card: {
    backgroundColor: "#1E1F22",
    borderRadius: "12px",
    padding: "20px",
  },
  avatarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "12px",
  },
  scenesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px",
  },
  sceneCard: {
    backgroundColor: "#252629",
    borderRadius: "8px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "2px solid transparent",
  },
  sceneIcon: {
    fontSize: "32px",
    marginBottom: "8px",
  },
  sceneName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#E9E4D6",
  },
  sceneMeta: {
    fontSize: "12px",
    color: "#8D8371",
    marginTop: "4px",
  },
  navButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    backgroundColor: "#3EB4A2",
    color: "#1E1F22",
    marginRight: "8px",
  },
  navButtonSecondary: {
    backgroundColor: "#252629",
    color: "#E9E4D6",
    border: "1px solid #333",
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getSceneIcon(type: string): string {
  const icons: Record<string, string> = {
    sanctuary: "🏛️",
    workspace: "💼",
    gallery: "🖼️",
    meeting: "👥",
    dashboard: "📊",
    archive: "📚",
    garden: "🌿",
    observatory: "🔭",
  };
  return icons[type] || "🌐";
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export const XRDashboardPage: React.FC = () => {
  const [selectedSceneId, setSelectedSceneId] = React.useState<string | null>(null);

  // Get data from adapters
  const scenes = getAllScenes();
  const avatars = getAllAvatars();
  const novaAvatar = getNovaAvatar();
  const zones = getAllZones();
  const paths = getAllPaths();
  const markers = getAllMarkers();
  const spawnPoints = getAllSpawnPoints();
  const session = getCurrentSession();
  const stats = getSessionStats();

  const selectedScene = selectedSceneId ? getSceneById(selectedSceneId) : scenes[0];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🥽 XR Dashboard</h1>
          <p style={styles.subtitle}>
            Immersive Experience Control Center · CHE·NU Universe
          </p>
        </div>
        <div style={styles.quickStats}>
          <div style={styles.statBox}>
            <div style={styles.statValue}>{scenes.length}</div>
            <div style={styles.statLabel}>Scenes</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statValue}>{zones.length}</div>
            <div style={styles.statLabel}>Zones</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statValue}>{avatars.length}</div>
            <div style={styles.statLabel}>Avatars</div>
          </div>
          <div style={styles.statBox}>
            <div style={{ ...styles.statValue, color: session ? "#3EB4A2" : "#8D8371" }}>
              {session ? "Active" : "Off"}
            </div>
            <div style={styles.statLabel}>Session</div>
          </div>
        </div>
      </div>

      {/* Session Status (Compact) */}
      <div style={styles.section}>
        <XRSessionStatus session={session} compact />
      </div>

      {/* Main Grid */}
      <div style={styles.grid}>
        {/* Left Column */}
        <div>
          {/* Current Scene Viewer */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>🎬</span> Active Scene
            </div>
            {selectedScene && (
              <XRSceneViewer
                scene={selectedScene}
                onPortalClick={(portal) => {
                  logger.debug("Portal clicked:", portal);
                  // Navigate to target scene
                  const targetScene = scenes.find(s => s.id === portal.targetSceneId);
                  if (targetScene) setSelectedSceneId(targetScene.id);
                }}
              />
            )}
          </div>

          {/* Scene Selection */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>🗂️</span> Available Scenes
            </div>
            <div style={styles.scenesGrid}>
              {scenes.map((scene) => (
                <div
                  key={scene.id}
                  style={{
                    ...styles.sceneCard,
                    borderColor: selectedSceneId === scene.id ? "#D8B26A" : "transparent",
                  }}
                  onClick={() => setSelectedSceneId(scene.id)}
                >
                  <div style={styles.sceneIcon}>{getSceneIcon(scene.type)}</div>
                  <div style={styles.sceneName}>{scene.name}</div>
                  <div style={styles.sceneMeta}>
                    {scene.sphere} · {scene.environment}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Nova Avatar */}
          {novaAvatar && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span>✨</span> Nova AI
              </div>
              <XRAvatarCard avatar={novaAvatar} showDetails />
            </div>
          )}

          {/* Quick Actions */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>⚡</span> Quick Actions
            </div>
            <div style={styles.card}>
              <button style={styles.navButton}>
                Enter VR
              </button>
              <button style={{ ...styles.navButton, ...styles.navButtonSecondary }}>
                Avatar Designer
              </button>
              <button style={{ ...styles.navButton, ...styles.navButtonSecondary }}>
                Settings
              </button>
            </div>
          </div>

          {/* Session Stats */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>📊</span> Session Statistics
            </div>
            <div style={styles.card}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#8D8371", textTransform: "uppercase" }}>
                    Total Sessions
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "600", color: "#3EB4A2" }}>
                    {stats.totalSessions}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#8D8371", textTransform: "uppercase" }}>
                    Total Time
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "600", color: "#D8B26A" }}>
                    {Math.round(stats.totalTime / 3600)}h
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#8D8371", textTransform: "uppercase" }}>
                    Avg Duration
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "600", color: "#E9E4D6" }}>
                    {Math.round(stats.averageDuration / 60)}m
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#8D8371", textTransform: "uppercase" }}>
                    Avg FPS
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "600", color: "#3EB4A2" }}>
                    {Math.round(stats.averageFrameRate)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spatial Map (Full Width) */}
      <div style={{ ...styles.section, ...styles.fullWidth }}>
        <div style={styles.sectionTitle}>
          <span>🗺️</span> Spatial Navigation Map
        </div>
        <XRSpatialMap
          zones={zones}
          paths={paths}
          markers={markers}
          spawnPoints={spawnPoints}
          onZoneClick={(zone) => {
            logger.debug("Zone clicked:", zone);
            // Find scene for this zone
            const scene = scenes.find(s => s.id === zone.sceneId);
            if (scene) setSelectedSceneId(scene.id);
          }}
        />
      </div>

      {/* Avatars Grid */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>🎭</span> Available Avatars
        </div>
        <div style={styles.avatarGrid}>
          {avatars.slice(0, 4).map((avatar) => (
            <XRAvatarCard
              key={avatar.id}
              avatar={avatar}
              compact
              onSelect={(a) => logger.debug("Avatar selected:", a)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default XRDashboardPage;
