/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — TOP BAR
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { getSphereLabel, getSphereIcon, getSphereColor } from "../adapters/universeAdapter";

interface TopBarProps {
  currentSphere?: RootSphere;
}

export const TopBar: React.FC<TopBarProps> = ({ currentSphere }) => {
  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <h1 style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          CHE·NU
        </h1>
        <span style={styles.separator}>|</span>
        <span style={styles.subtitle}>Universe Dashboard</span>
      </div>
      
      <div style={styles.center}>
        {currentSphere && (
          <div style={{
            ...styles.sphereBadge,
            backgroundColor: getSphereColor(currentSphere) + "20",
            borderColor: getSphereColor(currentSphere)
          }}>
            <span>{getSphereIcon(currentSphere)}</span>
            <span>{getSphereLabel(currentSphere)} Sphere</span>
          </div>
        )}
      </div>
      
      <div style={styles.right}>
        <span style={styles.readOnlyBadge}>🔒 READ-ONLY</span>
        <span style={styles.safeBadge}>SAFE MODE</span>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    backgroundColor: "#1E1F22",
    color: "#E9E4D6",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  logo: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  logoIcon: {
    color: "#D8B26A",
    fontSize: "24px"
  },
  separator: {
    color: "#666",
    fontSize: "20px"
  },
  subtitle: {
    fontSize: "14px",
    color: "#8D8371",
    fontWeight: 400
  },
  center: {
    display: "flex",
    alignItems: "center"
  },
  sphereBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 16px",
    borderRadius: "20px",
    border: "1px solid",
    fontSize: "14px",
    fontWeight: 500
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  readOnlyBadge: {
    padding: "4px 12px",
    backgroundColor: "#3EB4A220",
    color: "#3EB4A2",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600
  },
  safeBadge: {
    padding: "4px 12px",
    backgroundColor: "#3F724920",
    color: "#3F7249",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600
  }
};

export default TopBar;
