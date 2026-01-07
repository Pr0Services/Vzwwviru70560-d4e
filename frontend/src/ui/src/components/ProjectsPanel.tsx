/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — PROJECTS PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { getSphereColor } from "../adapters/universeAdapter";
import { getProjectsForSphere, formatProjectStatus, getStatusColor } from "../adapters/projectAdapter";
import { SectionCard } from "./SectionCard";

interface ProjectsPanelProps {
  sphere: RootSphere;
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ sphere }) => {
  const projects = getProjectsForSphere(sphere);
  const color = getSphereColor(sphere);

  return (
    <SectionCard 
      title="Projects" 
      icon="📁"
      headerColor={color}
      badge={projects.length}
      collapsible
    >
      <div style={styles.list}>
        {projects.map((project) => (
          <div key={project.id} style={styles.item}>
            <div style={styles.itemHeader}>
              <span style={styles.itemName}>{project.name}</span>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: getStatusColor(project.status) + "20",
                color: getStatusColor(project.status)
              }}>
                {formatProjectStatus(project.status)}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${project.progress}%`,
                  backgroundColor: getStatusColor(project.status)
                }} />
              </div>
              <span style={styles.progressText}>{project.progress}%</span>
            </div>

            <div style={styles.itemMeta}>
              <span style={styles.domain}>{project.domain}</span>
              <span style={styles.counts}>
                {project.missionsCount} missions · {project.phasesCount} phases
              </span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

const styles: Record<string, React.CSSProperties> = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  item: {
    padding: "12px",
    backgroundColor: "#FAFAFA",
    borderRadius: "8px",
    border: "1px solid #F0F0F0"
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  itemName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  statusBadge: {
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px"
  },
  progressBar: {
    flex: 1,
    height: "6px",
    backgroundColor: "#E5E5E5",
    borderRadius: "3px",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.3s ease"
  },
  progressText: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#1E1F22",
    minWidth: "35px",
    textAlign: "right" as const
  },
  itemMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  domain: {
    fontSize: "12px",
    color: "#8D8371"
  },
  counts: {
    fontSize: "11px",
    color: "#8D8371"
  }
};

export default ProjectsPanel;
