/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — SIDEBAR
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

interface SidebarProps {
  currentSphere?: RootSphere;
  onSphereSelect?: (sphere: RootSphere) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentSphere, 
  onSphereSelect 
}) => {
  const handleSphereClick = (sphere: RootSphere) => {
    if (onSphereSelect) {
      onSphereSelect(sphere);
    }
  };

  return (
    <aside style={styles.sidebar}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>🌐</span>
        <span style={styles.headerText}>Spheres</span>
      </div>

      {/* Global Dashboard Link */}
      <div 
        style={{
          ...styles.menuItem,
          ...(currentSphere === undefined ? styles.menuItemActive : {})
        }}
        onClick={() => handleSphereClick(undefined as any)}
      >
        <span style={styles.menuIcon}>📊</span>
        <span>Global Overview</span>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Sphere Links */}
      <div style={styles.sphereList}>
        {ROOT_SPHERES.map((sphere) => {
          const isActive = currentSphere === sphere;
          return (
            <div
              key={sphere}
              style={{
                ...styles.menuItem,
                ...(isActive ? {
                  ...styles.menuItemActive,
                  backgroundColor: getSphereColor(sphere) + "20",
                  borderLeftColor: getSphereColor(sphere)
                } : {})
              }}
              onClick={() => handleSphereClick(sphere)}
            >
              <span style={styles.menuIcon}>{getSphereIcon(sphere)}</span>
              <span style={styles.menuLabel}>{getSphereLabel(sphere)}</span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerBadge}>
          <span>◈</span>
          <span>CHE·NU OS</span>
        </div>
        <span style={styles.version}>v3.0</span>
      </div>
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: "240px",
    backgroundColor: "#1E1F22",
    color: "#E9E4D6",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #333"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "16px 20px",
    borderBottom: "1px solid #333"
  },
  headerIcon: {
    fontSize: "18px"
  },
  headerText: {
    fontSize: "14px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#8D8371"
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    borderLeft: "3px solid transparent"
  },
  menuItemActive: {
    backgroundColor: "#D8B26A20",
    borderLeftColor: "#D8B26A"
  },
  menuIcon: {
    fontSize: "16px",
    width: "24px",
    textAlign: "center" as const
  },
  menuLabel: {
    fontSize: "14px"
  },
  divider: {
    height: "1px",
    backgroundColor: "#333",
    margin: "8px 20px"
  },
  sphereList: {
    flex: 1,
    overflowY: "auto"
  },
  footer: {
    padding: "16px 20px",
    borderTop: "1px solid #333",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  footerBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#D8B26A",
    fontSize: "12px",
    fontWeight: 600
  },
  version: {
    fontSize: "11px",
    color: "#666"
  }
};

export default Sidebar;
