/**
 * ============================================================
 * CHE·NU — XR UI DASHBOARD — MINI MAP
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Symbolic minimap showing sector layout and object positions.
 */

import React from "react";
import { xrStyles, XR_COLORS, getObjectTypeColor } from "./xrStyles";
import { type XRScene, type XRObject, type XRSector } from "./adapters/xrAdapter";

interface XRMiniMapProps {
  scene: XRScene;
  selectedSector: XRSector | null;
  selectedObject: XRObject | null;
}

export const XRMiniMap: React.FC<XRMiniMapProps> = ({ scene, selectedSector, selectedObject }) => {
  // Calculate viewport dimensions
  const mapWidth = 340;
  const mapHeight = 200;
  
  // Scale factor for positioning
  const scale = 8;

  return (
    <div style={xrStyles.panel}>
      <div style={xrStyles.panelHeader}>
        <h3 style={xrStyles.panelTitle}>
          <span>🗺️</span> Scene MiniMap
        </h3>
        <span style={styles.legend}>Symbolic View</span>
      </div>
      <div style={styles.mapContainer}>
        <div style={styles.mapViewport}>
          {/* Grid Background */}
          <div style={styles.gridOverlay} />
          
          {/* Render Sectors */}
          {scene.sectors.map((sector, sectorIndex) => {
            const isSelected = selectedSector?.id === sector.id;
            
            // Position sectors in a grid layout
            const col = sectorIndex % 2;
            const row = Math.floor(sectorIndex / 2);
            const sectorX = 20 + col * 160;
            const sectorY = 20 + row * 80;
            const sectorWidth = 140;
            const sectorHeight = 70;

            return (
              <div key={sector.id}>
                {/* Sector Box */}
                <div
                  style={{
                    ...styles.sectorBox,
                    left: sectorX,
                    top: sectorY,
                    width: sectorWidth,
                    height: sectorHeight,
                    backgroundColor: sector.color + "15",
                    borderColor: isSelected ? sector.color : sector.color + "50",
                    borderWidth: isSelected ? "2px" : "1px"
                  }}
                >
                  <span style={{
                    ...styles.sectorLabel,
                    color: sector.color
                  }}>
                    {sector.name}
                  </span>
                </div>

                {/* Render Objects in Sector */}
                {sector.objects.map((obj, objIndex) => {
                  const isObjSelected = selectedObject?.id === obj.id;
                  
                  // Position objects within sector bounds
                  const objX = sectorX + 15 + (objIndex % 4) * 30;
                  const objY = sectorY + 25 + Math.floor(objIndex / 4) * 25;
                  
                  return (
                    <div
                      key={obj.id}
                      style={{
                        ...styles.objectMarker,
                        left: objX,
                        top: objY,
                        backgroundColor: getObjectTypeColor(obj.type),
                        transform: isObjSelected ? "scale(1.5)" : "scale(1)",
                        boxShadow: isObjSelected 
                          ? `0 0 8px ${getObjectTypeColor(obj.type)}` 
                          : "none"
                      }}
                      title={`${obj.name} (${obj.type})`}
                    />
                  );
                })}
              </div>
            );
          })}

          {/* Origin Marker */}
          <div style={styles.originMarker}>
            <span>⊕</span>
          </div>

          {/* Compass */}
          <div style={styles.compass}>
            <span style={styles.compassN}>N</span>
            <span style={styles.compassArrow}>↑</span>
          </div>
        </div>

        {/* Legend */}
        <div style={styles.legendBar}>
          <LegendItem color={XR_COLORS.xrPanel} label="Panel" />
          <LegendItem color={XR_COLORS.xrNode} label="Node" />
          <LegendItem color={XR_COLORS.xrPortal} label="Portal" />
          <LegendItem color={XR_COLORS.accent1} label="Display" />
          <LegendItem color={XR_COLORS.xrAvatar} label="Avatar" />
        </div>
      </div>
    </div>
  );
};

// Legend Item Component
const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div style={styles.legendItem}>
    <span style={{
      ...styles.legendDot,
      backgroundColor: color
    }} />
    <span style={styles.legendLabel}>{label}</span>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  mapContainer: {
    padding: "12px"
  },
  mapViewport: {
    position: "relative" as const,
    width: "100%",
    height: "200px",
    backgroundColor: XR_COLORS.background,
    borderRadius: "8px",
    overflow: "hidden"
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(${XR_COLORS.xrGrid} 1px, transparent 1px),
      linear-gradient(90deg, ${XR_COLORS.xrGrid} 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px"
  },
  sectorBox: {
    position: "absolute",
    borderRadius: "6px",
    border: "1px dashed",
    transition: "all 0.2s"
  },
  sectorLabel: {
    position: "absolute",
    top: "4px",
    left: "6px",
    fontSize: "9px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px"
  },
  objectMarker: {
    position: "absolute",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    transition: "all 0.2s",
    cursor: "default"
  },
  originMarker: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "14px",
    color: XR_COLORS.textLight,
    opacity: 0.4
  },
  compass: {
    position: "absolute",
    top: "8px",
    right: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: XR_COLORS.textLight,
    opacity: 0.6
  },
  compassN: {
    fontSize: "10px",
    fontWeight: 600
  },
  compassArrow: {
    fontSize: "12px"
  },
  legend: {
    fontSize: "10px",
    color: XR_COLORS.textMuted
  },
  legendBar: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #F0F0F0"
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  legendDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%"
  },
  legendLabel: {
    fontSize: "10px",
    color: XR_COLORS.textMuted
  }
};

export default XRMiniMap;
