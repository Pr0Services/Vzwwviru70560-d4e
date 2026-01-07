/**
 * ============================================================
 * CHE·NU — XR COMPONENT — SCENE VIEWER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { XRScene, XRObject, XRPortal, XRHotspot, XRLight } from "../adapters/xrSceneAdapter";

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    backgroundColor: "#1E1F22",
    borderRadius: "12px",
    padding: "24px",
    color: "#E9E4D6",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #2F4C39",
    paddingBottom: "16px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#D8B26A",
    margin: 0,
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },
  viewport: {
    backgroundColor: "#0a0a0f",
    borderRadius: "8px",
    padding: "40px",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
    overflow: "hidden",
  },
  grid: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(62, 180, 162, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(62, 180, 162, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none" as const,
  },
  scenePreview: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "16px",
    zIndex: 1,
  },
  orb: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    boxShadow: "0 0 40px rgba(216, 178, 106, 0.3)",
  },
  sceneName: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#E9E4D6",
  },
  sceneType: {
    fontSize: "14px",
    color: "#8D8371",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
  },
  sections: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    marginTop: "20px",
  },
  section: {
    backgroundColor: "#252629",
    borderRadius: "8px",
    padding: "16px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#D8B26A",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  itemList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  item: {
    backgroundColor: "#1E1F22",
    borderRadius: "6px",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  itemIcon: {
    fontSize: "20px",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#E9E4D6",
  },
  itemMeta: {
    fontSize: "11px",
    color: "#8D8371",
  },
  stats: {
    display: "flex",
    gap: "16px",
    marginTop: "16px",
    flexWrap: "wrap" as const,
  },
  stat: {
    backgroundColor: "#252629",
    borderRadius: "8px",
    padding: "12px 16px",
    textAlign: "center" as const,
    minWidth: "80px",
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
  emptyState: {
    color: "#8D8371",
    fontSize: "14px",
    fontStyle: "italic" as const,
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getEnvironmentColor(env: string): string {
  const colors: Record<string, string> = {
    void: "#1a1a2e",
    nature: "#3F7249",
    urban: "#4a5568",
    cosmic: "#2d1b4e",
    abstract: "#6b46c1",
    minimal: "#718096",
  };
  return colors[env] || "#1E1F22";
}

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

function getObjectIcon(type: string): string {
  const icons: Record<string, string> = {
    mesh: "🔷",
    group: "📦",
    sprite: "✨",
    text: "📝",
    portal: "🌀",
    interactive: "👆",
  };
  return icons[type] || "⬡";
}

function getPortalIcon(style: string): string {
  const icons: Record<string, string> = {
    door: "🚪",
    arch: "🏛️",
    ring: "⭕",
    vortex: "🌀",
    minimal: "◯",
  };
  return icons[style] || "🌀";
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

const ObjectItem: React.FC<{ object: XRObject; onClick?: () => void }> = ({ object, onClick }) => (
  <div 
    style={styles.item}
    onClick={onClick}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2a2b2f")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1E1F22")}
  >
    <span style={styles.itemIcon}>{getObjectIcon(object.type)}</span>
    <div style={styles.itemInfo}>
      <div style={styles.itemName}>{object.name}</div>
      <div style={styles.itemMeta}>
        {object.type} • {object.interactive ? "Interactive" : "Static"}
      </div>
    </div>
    {object.visible && <span style={{ color: "#3EB4A2" }}>👁️</span>}
  </div>
);

const PortalItem: React.FC<{ portal: XRPortal; onClick?: () => void }> = ({ portal, onClick }) => (
  <div 
    style={styles.item}
    onClick={onClick}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2a2b2f")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1E1F22")}
  >
    <span style={styles.itemIcon}>{getPortalIcon(portal.style)}</span>
    <div style={styles.itemInfo}>
      <div style={styles.itemName}>{portal.name}</div>
      <div style={styles.itemMeta}>
        → {portal.targetSphere || "Unknown"} • {portal.style}
      </div>
    </div>
    <span 
      style={{ 
        width: "12px", 
        height: "12px", 
        borderRadius: "50%", 
        backgroundColor: portal.active ? "#3EB4A2" : "#8D8371" 
      }} 
    />
  </div>
);

const HotspotItem: React.FC<{ hotspot: XRHotspot; onClick?: () => void }> = ({ hotspot, onClick }) => (
  <div 
    style={styles.item}
    onClick={onClick}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2a2b2f")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1E1F22")}
  >
    <span style={styles.itemIcon}>{hotspot.icon}</span>
    <div style={styles.itemInfo}>
      <div style={styles.itemName}>{hotspot.name}</div>
      <div style={styles.itemMeta}>{hotspot.description}</div>
    </div>
    <span style={{ fontSize: "10px", color: "#D8B26A" }}>{hotspot.action}</span>
  </div>
);

const LightItem: React.FC<{ light: XRLight }> = ({ light }) => (
  <div style={styles.item}>
    <span style={styles.itemIcon}>
      {light.type === "ambient" ? "🌐" : light.type === "directional" ? "☀️" : light.type === "point" ? "💡" : "🔦"}
    </span>
    <div style={styles.itemInfo}>
      <div style={styles.itemName}>{light.type}</div>
      <div style={styles.itemMeta}>
        Intensity: {light.intensity} • {light.castShadow ? "Shadows" : "No shadows"}
      </div>
    </div>
    <span 
      style={{ 
        width: "16px", 
        height: "16px", 
        borderRadius: "4px", 
        backgroundColor: light.color 
      }} 
    />
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

export const XRSceneViewer: React.FC<XRSceneViewerProps> = ({
  scene,
  onPortalClick,
  onHotspotClick,
  onObjectClick,
  showGrid = true,
  showStats = true,
  className,
}) => {
  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{scene.name}</h2>
          <p style={{ margin: "4px 0 0", color: "#8D8371", fontSize: "14px" }}>
            {scene.description}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ ...styles.badge, backgroundColor: "#2F4C39", color: "#3EB4A2" }}>
            {scene.type}
          </span>
          <span style={{ ...styles.badge, backgroundColor: "#3d3022", color: "#D8B26A" }}>
            {scene.sphere}
          </span>
        </div>
      </div>

      {/* Viewport Preview */}
      <div style={styles.viewport}>
        {showGrid && <div style={styles.grid} />}
        <div style={styles.scenePreview}>
          <div 
            style={{ 
              ...styles.orb, 
              backgroundColor: getEnvironmentColor(scene.environment),
              border: `3px solid ${scene.lights[0]?.color || "#D8B26A"}` 
            }}
          >
            {getSceneIcon(scene.type)}
          </div>
          <div style={styles.sceneName}>{scene.name}</div>
          <div style={styles.sceneType}>{scene.environment} environment</div>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statValue}>{scene.objects.length}</div>
            <div style={styles.statLabel}>Objects</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>{scene.portals.length}</div>
            <div style={styles.statLabel}>Portals</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>{scene.hotspots.length}</div>
            <div style={styles.statLabel}>Hotspots</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>{scene.lights.length}</div>
            <div style={styles.statLabel}>Lights</div>
          </div>
        </div>
      )}

      {/* Sections */}
      <div style={styles.sections}>
        {/* Objects */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>🔷</span> Objects
          </div>
          <div style={styles.itemList}>
            {scene.objects.length > 0 ? (
              scene.objects.map((obj) => (
                <ObjectItem 
                  key={obj.id} 
                  object={obj} 
                  onClick={() => onObjectClick?.(obj)} 
                />
              ))
            ) : (
              <div style={styles.emptyState}>No objects in scene</div>
            )}
          </div>
        </div>

        {/* Portals */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>🌀</span> Portals
          </div>
          <div style={styles.itemList}>
            {scene.portals.length > 0 ? (
              scene.portals.map((portal) => (
                <PortalItem 
                  key={portal.id} 
                  portal={portal} 
                  onClick={() => onPortalClick?.(portal)} 
                />
              ))
            ) : (
              <div style={styles.emptyState}>No portals in scene</div>
            )}
          </div>
        </div>

        {/* Hotspots */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>📍</span> Hotspots
          </div>
          <div style={styles.itemList}>
            {scene.hotspots.length > 0 ? (
              scene.hotspots.map((hs) => (
                <HotspotItem 
                  key={hs.id} 
                  hotspot={hs} 
                  onClick={() => onHotspotClick?.(hs)} 
                />
              ))
            ) : (
              <div style={styles.emptyState}>No hotspots in scene</div>
            )}
          </div>
        </div>

        {/* Lights */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>💡</span> Lighting
          </div>
          <div style={styles.itemList}>
            {scene.lights.length > 0 ? (
              scene.lights.map((light) => (
                <LightItem key={light.id} light={light} />
              ))
            ) : (
              <div style={styles.emptyState}>No lights in scene</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TYPES
// ============================================================

interface XRSceneViewerProps {
  scene: XRScene;
  onPortalClick?: (portal: XRPortal) => void;
  onHotspotClick?: (hotspot: XRHotspot) => void;
  onObjectClick?: (object: XRObject) => void;
  showGrid?: boolean;
  showStats?: boolean;
  className?: string;
}

export default XRSceneViewer;
