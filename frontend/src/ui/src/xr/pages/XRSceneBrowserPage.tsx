/**
 * ============================================================
 * CHE·NU — XR PAGE — SCENE BROWSER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState } from "react";
import { XRSceneViewer } from "../components/XRSceneViewer";
import { 
  getAllScenes, 
  getScenesByType, 
  getScenesForSphere,
  getAllTemplates,
  getSceneStats,
  type XRScene,
  type XRSceneType,
  type XRSceneTemplate
} from "../../adapters/xrSceneAdapter";
import type { RootSphere } from "../../adapters/universeAdapter";

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
  filters: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap" as const,
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  filterLabel: {
    fontSize: "12px",
    color: "#8D8371",
  },
  select: {
    padding: "8px 12px",
    backgroundColor: "#1E1F22",
    border: "1px solid #333",
    borderRadius: "6px",
    color: "#E9E4D6",
    fontSize: "13px",
    cursor: "pointer",
    minWidth: "140px",
  },
  searchInput: {
    padding: "8px 12px",
    backgroundColor: "#1E1F22",
    border: "1px solid #333",
    borderRadius: "6px",
    color: "#E9E4D6",
    fontSize: "13px",
    width: "200px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "24px",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  sceneList: {
    backgroundColor: "#1E1F22",
    borderRadius: "12px",
    padding: "16px",
    maxHeight: "600px",
    overflowY: "auto" as const,
  },
  sceneItem: {
    padding: "12px",
    backgroundColor: "#252629",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "2px solid transparent",
    marginBottom: "8px",
  },
  sceneItemActive: {
    borderColor: "#D8B26A",
    backgroundColor: "#2a2520",
  },
  sceneIcon: {
    fontSize: "24px",
    marginRight: "12px",
  },
  sceneName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#E9E4D6",
  },
  sceneMeta: {
    fontSize: "11px",
    color: "#8D8371",
    marginTop: "4px",
  },
  sceneStats: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  statBadge: {
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "10px",
    backgroundColor: "#333",
    color: "#8D8371",
  },
  mainContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  templatesSection: {
    backgroundColor: "#1E1F22",
    borderRadius: "12px",
    padding: "20px",
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
  templatesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "12px",
  },
  templateCard: {
    backgroundColor: "#252629",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center" as const,
    cursor: "pointer",
    transition: "all 0.2s",
    border: "2px solid transparent",
  },
  templateIcon: {
    fontSize: "32px",
    marginBottom: "8px",
  },
  templateName: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#E9E4D6",
  },
  templateMeta: {
    fontSize: "11px",
    color: "#8D8371",
    marginTop: "4px",
  },
  complexityBadge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "10px",
    marginTop: "8px",
  },
  noResults: {
    color: "#8D8371",
    fontSize: "14px",
    textAlign: "center" as const,
    padding: "40px",
    fontStyle: "italic" as const,
  },
  totalCount: {
    fontSize: "12px",
    color: "#8D8371",
    marginBottom: "12px",
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

function getComplexityColor(complexity: string): { bg: string; color: string } {
  switch (complexity) {
    case "simple": return { bg: "#2F4C39", color: "#3EB4A2" };
    case "moderate": return { bg: "#3d3022", color: "#D8B26A" };
    case "complex": return { bg: "#3d2222", color: "#E74C3C" };
    default: return { bg: "#333", color: "#8D8371" };
  }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export const XRSceneBrowserPage: React.FC = () => {
  const [selectedScene, setSelectedScene] = useState<XRScene | null>(null);
  const [filterType, setFilterType] = useState<XRSceneType | "all">("all");
  const [filterSphere, setFilterSphere] = useState<RootSphere | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get data
  const allScenes = getAllScenes();
  const templates = getAllTemplates();

  // Filter scenes
  let filteredScenes = allScenes;
  
  if (filterType !== "all") {
    filteredScenes = filteredScenes.filter(s => s.type === filterType);
  }
  
  if (filterSphere !== "all") {
    filteredScenes = filteredScenes.filter(s => s.sphere === filterSphere);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredScenes = filteredScenes.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    );
  }

  // Select first scene if none selected
  React.useEffect(() => {
    if (!selectedScene && filteredScenes.length > 0) {
      setSelectedScene(filteredScenes[0]);
    }
  }, [filteredScenes, selectedScene]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🎬 Scene Browser</h1>
          <p style={styles.subtitle}>
            Explore and preview XR scenes and environments
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Type:</span>
          <select 
            style={styles.select}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as XRSceneType | "all")}
          >
            <option value="all">All Types</option>
            <option value="sanctuary">Sanctuary</option>
            <option value="workspace">Workspace</option>
            <option value="gallery">Gallery</option>
            <option value="meeting">Meeting</option>
            <option value="dashboard">Dashboard</option>
            <option value="archive">Archive</option>
            <option value="garden">Garden</option>
            <option value="observatory">Observatory</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Sphere:</span>
          <select 
            style={styles.select}
            value={filterSphere}
            onChange={(e) => setFilterSphere(e.target.value as RootSphere | "all")}
          >
            <option value="all">All Spheres</option>
            <option value="personal">Personal</option>
            <option value="creative">Creative</option>
            <option value="business">Business</option>
            <option value="social">Social</option>
            <option value="systems">Systems</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Search:</span>
          <input
            type="text"
            placeholder="Search scenes..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div style={styles.mainGrid}>
        {/* Sidebar - Scene List */}
        <div style={styles.sidebar}>
          <div style={styles.sceneList}>
            <div style={styles.totalCount}>
              {filteredScenes.length} scene{filteredScenes.length !== 1 ? "s" : ""} found
            </div>
            {filteredScenes.length > 0 ? (
              filteredScenes.map((scene) => {
                const stats = getSceneStats(scene.id);
                const isActive = selectedScene?.id === scene.id;
                
                return (
                  <div
                    key={scene.id}
                    style={{
                      ...styles.sceneItem,
                      ...(isActive ? styles.sceneItemActive : {}),
                    }}
                    onClick={() => setSelectedScene(scene)}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={styles.sceneIcon}>{getSceneIcon(scene.type)}</span>
                      <div>
                        <div style={styles.sceneName}>{scene.name}</div>
                        <div style={styles.sceneMeta}>
                          {scene.sphere} · {scene.environment}
                        </div>
                      </div>
                    </div>
                    <div style={styles.sceneStats}>
                      <span style={styles.statBadge}>🔷 {stats.objectCount}</span>
                      <span style={styles.statBadge}>🌀 {stats.portalCount}</span>
                      <span style={styles.statBadge}>📍 {stats.hotspotCount}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={styles.noResults}>No scenes match your filters</div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Scene Viewer */}
          {selectedScene ? (
            <XRSceneViewer
              scene={selectedScene}
              onPortalClick={(portal) => {
                const targetScene = allScenes.find(s => s.id === portal.targetSceneId);
                if (targetScene) setSelectedScene(targetScene);
              }}
              onHotspotClick={(hotspot) => logger.debug("Hotspot:", hotspot)}
              onObjectClick={(obj) => logger.debug("Object:", obj)}
            />
          ) : (
            <div style={{ ...styles.templatesSection, textAlign: "center", padding: "60px" }}>
              <p style={{ color: "#8D8371" }}>Select a scene from the list to preview</p>
            </div>
          )}

          {/* Templates Section */}
          <div style={styles.templatesSection}>
            <div style={styles.sectionTitle}>
              <span>📋</span> Scene Templates
            </div>
            <div style={styles.templatesGrid}>
              {templates.map((template) => {
                const complexity = getComplexityColor(template.complexity);
                
                return (
                  <div
                    key={template.id}
                    style={styles.templateCard}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = "#3EB4A2")}
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = "transparent")}
                  >
                    <div style={styles.templateIcon}>{getSceneIcon(template.type)}</div>
                    <div style={styles.templateName}>{template.name}</div>
                    <div style={styles.templateMeta}>
                      {template.defaultEnvironment} · {template.objectCount} objects
                    </div>
                    <span 
                      style={{
                        ...styles.complexityBadge,
                        backgroundColor: complexity.bg,
                        color: complexity.color,
                      }}
                    >
                      {template.complexity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XRSceneBrowserPage;
