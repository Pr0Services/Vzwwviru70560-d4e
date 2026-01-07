/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — DASHBOARD ROOT PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Global overview showing all spheres as cards.
 */

import React from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { 
  ROOT_SPHERES, 
  getSphereLabel, 
  getSphereIcon, 
  getSphereColor,
  getSphereDescription,
  getDomainsForSphere,
  getEnginesForSphere
} from "../adapters/universeAdapter";
import { getToolsCount } from "../adapters/toolAdapter";
import { getProcessesCount } from "../adapters/processAdapter";
import { getProjectsCount, getActiveProjectsCount } from "../adapters/projectAdapter";
import { getTemplatesCount } from "../adapters/templateAdapter";
import { getMemoryCount } from "../adapters/memoryAdapter";

interface DashboardRootProps {
  onSphereSelect: (sphere: RootSphere) => void;
}

export const DashboardRoot: React.FC<DashboardRootProps> = ({ onSphereSelect }) => {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            <span style={styles.logoIcon}>◈</span>
            CHE·NU Universe Overview
          </h1>
          <p style={styles.subtitle}>
            Explore the 10 spheres of the CHE·NU ecosystem. 
            Select a sphere to view its detailed dashboard.
          </p>
        </div>
        <div style={styles.headerBadges}>
          <span style={styles.badge}>🔒 Read-Only</span>
          <span style={styles.badge}>✓ Safe Mode</span>
          <span style={styles.badge}>10 Spheres</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={styles.statsRow}>
        <StatCard label="Total Spheres" value={10} icon="🌐" />
        <StatCard label="Total Domains" value={ROOT_SPHERES.reduce((acc, s) => acc + getDomainsForSphere(s).length, 0)} icon="🗂️" />
        <StatCard label="Total Engines" value={ROOT_SPHERES.reduce((acc, s) => acc + getEnginesForSphere(s).length, 0)} icon="⚙️" />
        <StatCard label="Active Projects" value={ROOT_SPHERES.reduce((acc, s) => acc + getActiveProjectsCount(s), 0)} icon="📁" />
      </div>

      {/* Sphere Cards Grid */}
      <div style={styles.grid}>
        {ROOT_SPHERES.map((sphere) => (
          <SphereCard 
            key={sphere} 
            sphere={sphere} 
            onClick={() => onSphereSelect(sphere)}
          />
        ))}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.footerText}>
          CHE·NU OS v3.0 — SAFE · NON-AUTONOMOUS · REPRESENTATIONAL
        </span>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{ label: string; value: number; icon: string }> = ({ label, value, icon }) => (
  <div style={styles.statCard}>
    <span style={styles.statIcon}>{icon}</span>
    <div>
      <span style={styles.statValue}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  </div>
);

// Sphere Card Component
const SphereCard: React.FC<{ sphere: RootSphere; onClick: () => void }> = ({ sphere, onClick }) => {
  const color = getSphereColor(sphere);
  const domains = getDomainsForSphere(sphere);
  const engines = getEnginesForSphere(sphere);
  
  return (
    <div 
      style={{
        ...styles.sphereCard,
        borderTopColor: color
      }}
      onClick={onClick}
    >
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <span style={{
          ...styles.sphereIcon,
          backgroundColor: color + "20"
        }}>
          {getSphereIcon(sphere)}
        </span>
        <div>
          <h3 style={styles.sphereName}>{getSphereLabel(sphere)}</h3>
          <span style={styles.sphereId}>{sphere}</span>
        </div>
      </div>

      {/* Description */}
      <p style={styles.sphereDescription}>
        {getSphereDescription(sphere)}
      </p>

      {/* Stats */}
      <div style={styles.cardStats}>
        <div style={styles.cardStat}>
          <span style={styles.cardStatValue}>{domains.length}</span>
          <span style={styles.cardStatLabel}>Domains</span>
        </div>
        <div style={styles.cardStat}>
          <span style={styles.cardStatValue}>{engines.length}</span>
          <span style={styles.cardStatLabel}>Engines</span>
        </div>
        <div style={styles.cardStat}>
          <span style={styles.cardStatValue}>{getToolsCount(sphere)}</span>
          <span style={styles.cardStatLabel}>Tools</span>
        </div>
        <div style={styles.cardStat}>
          <span style={styles.cardStatValue}>{getProjectsCount(sphere)}</span>
          <span style={styles.cardStatLabel}>Projects</span>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div style={styles.quickStats}>
        <span style={styles.quickStat}>
          📋 {getTemplatesCount(sphere)} templates
        </span>
        <span style={styles.quickStat}>
          ⚙️ {getProcessesCount(sphere)} processes
        </span>
        <span style={styles.quickStat}>
          🧠 {getMemoryCount(sphere)} memory
        </span>
      </div>

      {/* View Button */}
      <div style={styles.cardFooter}>
        <span style={{
          ...styles.viewButton,
          backgroundColor: color,
          color: "#FFFFFF"
        }}>
          View Dashboard →
        </span>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1400px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px"
  },
  headerContent: {},
  title: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: 700,
    color: "#1E1F22",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  logoIcon: {
    color: "#D8B26A",
    fontSize: "32px"
  },
  subtitle: {
    margin: 0,
    fontSize: "15px",
    color: "#8D8371",
    maxWidth: "500px",
    lineHeight: 1.5
  },
  headerBadges: {
    display: "flex",
    gap: "8px"
  },
  badge: {
    padding: "6px 14px",
    backgroundColor: "#3F724920",
    color: "#3F7249",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 600
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "32px"
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  statIcon: {
    fontSize: "24px"
  },
  statValue: {
    display: "block",
    fontSize: "24px",
    fontWeight: 700,
    color: "#1E1F22"
  },
  statLabel: {
    display: "block",
    fontSize: "12px",
    color: "#8D8371"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
    marginBottom: "32px"
  },
  sphereCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5",
    borderTop: "4px solid",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px"
  },
  sphereIcon: {
    fontSize: "24px",
    padding: "10px",
    borderRadius: "10px"
  },
  sphereName: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#1E1F22"
  },
  sphereId: {
    fontSize: "11px",
    color: "#8D8371"
  },
  sphereDescription: {
    margin: "0 0 16px 0",
    fontSize: "13px",
    color: "#666",
    lineHeight: 1.5
  },
  cardStats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    padding: "12px",
    backgroundColor: "#FAFAFA",
    borderRadius: "8px",
    marginBottom: "12px"
  },
  cardStat: {
    textAlign: "center" as const
  },
  cardStatValue: {
    display: "block",
    fontSize: "18px",
    fontWeight: 700,
    color: "#1E1F22"
  },
  cardStatLabel: {
    display: "block",
    fontSize: "10px",
    color: "#8D8371"
  },
  quickStats: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap" as const
  },
  quickStat: {
    fontSize: "11px",
    color: "#8D8371"
  },
  cardFooter: {
    display: "flex",
    justifyContent: "flex-end"
  },
  viewButton: {
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600
  },
  footer: {
    textAlign: "center" as const,
    padding: "24px 0",
    borderTop: "1px solid #E5E5E5"
  },
  footerText: {
    fontSize: "12px",
    color: "#8D8371"
  }
};

export default DashboardRoot;
