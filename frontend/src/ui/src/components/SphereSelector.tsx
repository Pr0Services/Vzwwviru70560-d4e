/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — SPHERE SELECTOR
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { 
  ROOT_SPHERES, 
  getSphereLabel, 
  getSphereIcon, 
  getSphereColor 
} from "../adapters/universeAdapter";

interface SphereSelectorProps {
  selectedSphere?: RootSphere;
  onSelect: (sphere: RootSphere) => void;
  variant?: "pills" | "dropdown" | "grid";
}

export const SphereSelector: React.FC<SphereSelectorProps> = ({ 
  selectedSphere, 
  onSelect,
  variant = "pills"
}) => {
  if (variant === "dropdown") {
    return (
      <select 
        style={styles.select}
        value={selectedSphere || ""}
        onChange={(e) => onSelect(e.target.value as RootSphere)}
      >
        <option value="">Select Sphere...</option>
        {ROOT_SPHERES.map((sphere) => (
          <option key={sphere} value={sphere}>
            {getSphereIcon(sphere)} {getSphereLabel(sphere)}
          </option>
        ))}
      </select>
    );
  }

  if (variant === "grid") {
    return (
      <div style={styles.grid}>
        {ROOT_SPHERES.map((sphere) => {
          const isSelected = selectedSphere === sphere;
          return (
            <div
              key={sphere}
              style={{
                ...styles.gridItem,
                backgroundColor: isSelected ? getSphereColor(sphere) + "30" : "#FFFFFF",
                borderColor: isSelected ? getSphereColor(sphere) : "#E5E5E5"
              }}
              onClick={() => onSelect(sphere)}
            >
              <span style={styles.gridIcon}>{getSphereIcon(sphere)}</span>
              <span style={styles.gridLabel}>{getSphereLabel(sphere)}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Default: pills
  return (
    <div style={styles.pills}>
      {ROOT_SPHERES.map((sphere) => {
        const isSelected = selectedSphere === sphere;
        return (
          <button
            key={sphere}
            style={{
              ...styles.pill,
              backgroundColor: isSelected ? getSphereColor(sphere) : "transparent",
              color: isSelected ? "#FFFFFF" : "#1E1F22",
              borderColor: getSphereColor(sphere)
            }}
            onClick={() => onSelect(sphere)}
          >
            <span>{getSphereIcon(sphere)}</span>
            <span>{getSphereLabel(sphere)}</span>
          </button>
        );
      })}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  },
  pill: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    transition: "all 0.2s ease"
  },
  select: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #E5E5E5",
    backgroundColor: "#FFFFFF",
    fontSize: "14px",
    cursor: "pointer",
    minWidth: "200px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "12px"
  },
  gridItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "16px",
    borderRadius: "12px",
    border: "2px solid",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  gridIcon: {
    fontSize: "24px"
  },
  gridLabel: {
    fontSize: "13px",
    fontWeight: 500,
    textAlign: "center" as const
  }
};

export default SphereSelector;
