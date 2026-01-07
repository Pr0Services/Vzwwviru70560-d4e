/**
 * ============================================================
 * CHE·NU — XR COMPONENT — SPATIAL MAP
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState } from "react";
import type { SpatialZone, NavigationPath, SpatialMarker, SpawnPoint } from "../adapters/xrSpatialAdapter";

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    backgroundColor: "#1E1F22",
    borderRadius: "12px",
    padding: "20px",
    color: "#E9E4D6",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#D8B26A",
    margin: 0,
  },
  controls: {
    display: "flex",
    gap: "8px",
  },
  toggleButton: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  mapViewport: {
    backgroundColor: "#0a0a0f",
    borderRadius: "8px",
    position: "relative" as const,
    overflow: "hidden",
    height: "400px",
  },
  gridOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(62, 180, 162, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(62, 180, 162, 0.05) 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px",
    pointerEvents: "none" as const,
  },
  zoneNode: {
    position: "absolute" as const,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "2px solid transparent",
  },
  zoneLabel: {
    position: "absolute" as const,
    bottom: "-24px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "10px",
    color: "#E9E4D6",
    whiteSpace: "nowrap" as const,
    textShadow: "0 1px 2px rgba(0,0,0,0.8)",
  },
  pathLine: {
    position: "absolute" as const,
    height: "2px",
    backgroundColor: "#3EB4A2",
    transformOrigin: "left center",
    opacity: 0.5,
  },
  markerDot: {
    position: "absolute" as const,
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    cursor: "pointer",
  },
  spawnPoint: {
    position: "absolute" as const,
    width: "12px",
    height: "12px",
    borderRadius: "2px",
    backgroundColor: "#D8B26A",
    transform: "rotate(45deg)",
    cursor: "pointer",
  },
  legend: {
    display: "flex",
    gap: "16px",
    marginTop: "16px",
    flexWrap: "wrap" as const,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    color: "#8D8371",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  sidebar: {
    marginTop: "16px",
    backgroundColor: "#252629",
    borderRadius: "8px",
    padding: "12px",
  },
  sidebarTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#D8B26A",
    marginBottom: "8px",
  },
  zoneInfo: {
    fontSize: "12px",
    color: "#E9E4D6",
  },
  zoneInfoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    borderBottom: "1px solid #333",
  },
  noSelection: {
    color: "#8D8371",
    fontSize: "12px",
    fontStyle: "italic" as const,
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getZoneIcon(type: string): string {
  const icons: Record<string, string> = {
    hub: "🏛️",
    workspace: "💼",
    gallery: "🖼️",
    garden: "🌿",
    archive: "📚",
    portal: "🌀",
    observation: "🔭",
    meeting: "👥",
  };
  return icons[type] || "📍";
}

function getSphereColor(sphere: string): string {
  const colors: Record<string, string> = {
    personal: "#3EB4A2",
    creative: "#9B59B6",
    business: "#2C3E50",
    social: "#E74C3C",
    education: "#3498DB",
    systems: "#1E1F22",
    production: "#F39C12",
    health: "#27AE60",
    construction: "#D35400",
    realestate: "#8E44AD",
  };
  return colors[sphere] || "#8D8371";
}

// ============================================================
// MAIN COMPONENT
// ============================================================

interface XRSpatialMapProps {
  zones: SpatialZone[];
  paths: NavigationPath[];
  markers?: SpatialMarker[];
  spawnPoints?: SpawnPoint[];
  onZoneClick?: (zone: SpatialZone) => void;
  onMarkerClick?: (marker: SpatialMarker) => void;
  showPaths?: boolean;
  showMarkers?: boolean;
  showSpawns?: boolean;
  className?: string;
}

export const XRSpatialMap: React.FC<XRSpatialMapProps> = ({
  zones,
  paths,
  markers = [],
  spawnPoints = [],
  onZoneClick,
  onMarkerClick,
  showPaths: initialShowPaths = true,
  showMarkers: initialShowMarkers = true,
  showSpawns: initialShowSpawns = false,
  className,
}) => {
  const [showPaths, setShowPaths] = useState(initialShowPaths);
  const [showMarkers, setShowMarkers] = useState(initialShowMarkers);
  const [showSpawns, setShowSpawns] = useState(initialShowSpawns);
  const [selectedZone, setSelectedZone] = useState<SpatialZone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  // Normalize positions to viewport (simple 2D projection)
  const normalizePosition = (center: { x: number; y: number; z: number }) => {
    // Map world coordinates to viewport percentage
    const scale = 2;
    const offsetX = 50;
    const offsetY = 50;
    return {
      x: offsetX + (center.x / scale),
      y: offsetY + (center.z / scale), // Use Z for Y in 2D top-down view
    };
  };

  const handleZoneClick = (zone: SpatialZone) => {
    setSelectedZone(zone);
    onZoneClick?.(zone);
  };

  // Render path between two zones
  const renderPath = (path: NavigationPath) => {
    const fromZone = zones.find(z => z.id === path.fromZoneId);
    const toZone = zones.find(z => z.id === path.toZoneId);
    if (!fromZone || !toZone) return null;

    const from = normalizePosition(fromZone.center);
    const to = normalizePosition(toZone.center);
    
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return (
      <div
        key={path.id}
        style={{
          ...styles.pathLine,
          left: `${from.x}%`,
          top: `${from.y}%`,
          width: `${length}%`,
          transform: `rotate(${angle}deg)`,
          backgroundColor: path.type === "portal" ? "#D8B26A" : 
                          path.type === "teleport" ? "#9B59B6" : "#3EB4A2",
        }}
        title={`${path.name} (${path.type})`}
      />
    );
  };

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>🗺️ Spatial Map</h3>
        <div style={styles.controls}>
          <button
            style={{
              ...styles.toggleButton,
              backgroundColor: showPaths ? "#2F4C39" : "#252629",
              color: showPaths ? "#3EB4A2" : "#8D8371",
            }}
            onClick={() => setShowPaths(!showPaths)}
          >
            Paths
          </button>
          <button
            style={{
              ...styles.toggleButton,
              backgroundColor: showMarkers ? "#2F4C39" : "#252629",
              color: showMarkers ? "#3EB4A2" : "#8D8371",
            }}
            onClick={() => setShowMarkers(!showMarkers)}
          >
            Markers
          </button>
          <button
            style={{
              ...styles.toggleButton,
              backgroundColor: showSpawns ? "#2F4C39" : "#252629",
              color: showSpawns ? "#3EB4A2" : "#8D8371",
            }}
            onClick={() => setShowSpawns(!showSpawns)}
          >
            Spawns
          </button>
        </div>
      </div>

      {/* Map Viewport */}
      <div style={styles.mapViewport}>
        <div style={styles.gridOverlay} />

        {/* Render Paths */}
        {showPaths && paths.map(renderPath)}

        {/* Render Zones */}
        {zones.map((zone) => {
          const pos = normalizePosition(zone.center);
          const isSelected = selectedZone?.id === zone.id;
          const isHovered = hoveredZone === zone.id;
          const size = Math.max(30, zone.radius * 2);

          return (
            <div
              key={zone.id}
              style={{
                ...styles.zoneNode,
                left: `calc(${pos.x}% - ${size/2}px)`,
                top: `calc(${pos.y}% - ${size/2}px)`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: getSphereColor(zone.sphere),
                opacity: zone.accessible ? 1 : 0.5,
                borderColor: isSelected ? "#D8B26A" : isHovered ? "#3EB4A2" : "transparent",
                transform: isHovered ? "scale(1.1)" : "scale(1)",
                boxShadow: isSelected ? `0 0 20px ${getSphereColor(zone.sphere)}` : "none",
                zIndex: isHovered || isSelected ? 10 : 1,
              }}
              onClick={() => handleZoneClick(zone)}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              {getZoneIcon(zone.type)}
              <span style={styles.zoneLabel}>{zone.name}</span>
            </div>
          );
        })}

        {/* Render Markers */}
        {showMarkers && markers.map((marker) => {
          const zone = zones.find(z => z.id === marker.zoneId);
          if (!zone || !marker.visible) return null;
          
          const zonePos = normalizePosition(zone.center);
          // Offset marker slightly from zone center
          const offset = { x: (marker.position.x - zone.center.x) / 10, y: (marker.position.z - zone.center.z) / 10 };

          return (
            <div
              key={marker.id}
              style={{
                ...styles.markerDot,
                left: `calc(${zonePos.x + offset.x}% - 8px)`,
                top: `calc(${zonePos.y + offset.y}% - 8px)`,
                backgroundColor: "#D8B26A",
              }}
              onClick={() => onMarkerClick?.(marker)}
              title={marker.name}
            >
              {marker.icon}
            </div>
          );
        })}

        {/* Render Spawn Points */}
        {showSpawns && spawnPoints.map((spawn) => {
          const zone = zones.find(z => z.id === spawn.zoneId);
          if (!zone) return null;
          
          const pos = normalizePosition({
            x: spawn.position.x,
            y: spawn.position.y,
            z: spawn.position.z,
          });

          return (
            <div
              key={spawn.id}
              style={{
                ...styles.spawnPoint,
                left: `calc(${pos.x}% - 6px)`,
                top: `calc(${pos.y}% - 6px)`,
                backgroundColor: spawn.default ? "#3EB4A2" : "#D8B26A",
              }}
              title={`${spawn.name} (Cap: ${spawn.capacity})`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: "#3EB4A2" }} />
          <span>Personal</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: "#9B59B6" }} />
          <span>Creative</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: "#2C3E50" }} />
          <span>Business</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: "#1E1F22", border: "1px solid #8D8371" }} />
          <span>Systems</span>
        </div>
      </div>

      {/* Selected Zone Info */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Zone Details</div>
        {selectedZone ? (
          <div style={styles.zoneInfo}>
            <div style={styles.zoneInfoRow}>
              <span>Name</span>
              <span>{selectedZone.name}</span>
            </div>
            <div style={styles.zoneInfoRow}>
              <span>Type</span>
              <span>{selectedZone.type}</span>
            </div>
            <div style={styles.zoneInfoRow}>
              <span>Sphere</span>
              <span>{selectedZone.sphere}</span>
            </div>
            <div style={styles.zoneInfoRow}>
              <span>Radius</span>
              <span>{selectedZone.radius}m</span>
            </div>
            <div style={styles.zoneInfoRow}>
              <span>Connected</span>
              <span>{selectedZone.connectedZones.length} zones</span>
            </div>
            <div style={{ ...styles.zoneInfoRow, borderBottom: "none" }}>
              <span>Accessible</span>
              <span>{selectedZone.accessible ? "✅ Yes" : "❌ No"}</span>
            </div>
            <p style={{ marginTop: "8px", fontSize: "11px", color: "#8D8371" }}>
              {selectedZone.description}
            </p>
          </div>
        ) : (
          <div style={styles.noSelection}>Click a zone to view details</div>
        )}
      </div>
    </div>
  );
};

export default XRSpatialMap;
