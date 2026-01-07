/**
 * ============================================================
 * CHE·NU — XR UI DASHBOARD — PROCESS PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import { xrStyles, XR_COLORS, getStatusColor } from "./xrStyles";
import { getXrProcessesMock, type XRProcess } from "./adapters/xrAdapter";

interface XRProcessPanelProps {
  sceneId: string;
}

export const XRProcessPanel: React.FC<XRProcessPanelProps> = ({ sceneId }) => {
  const processes = getXrProcessesMock();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>XR Processes</h3>
        <span style={styles.count}>{processes.length} workflows</span>
      </div>

      {/* Process List */}
      <div style={styles.processList}>
        {processes.map(process => (
          <ProcessCard key={process.id} process={process} />
        ))}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <span style={styles.legendTitle}>Process Status</span>
        <div style={styles.legendItems}>
          <LegendItem status="idle" label="Idle" />
          <LegendItem status="active" label="Active" />
          <LegendItem status="completed" label="Completed" />
        </div>
      </div>
    </div>
  );
};

// Process Card
const ProcessCard: React.FC<{ process: XRProcess }> = ({ process }) => {
  const statusColor = getStatusColor(process.status);
  const completedSteps = process.status === "completed" 
    ? process.steps.length 
    : process.status === "active" 
      ? Math.floor(process.steps.length / 2)
      : 0;

  return (
    <div style={styles.processCard}>
      {/* Header */}
      <div style={styles.cardHeader}>
        <span style={styles.processIcon}>🔄</span>
        <div style={styles.cardInfo}>
          <span style={styles.processName}>{process.name}</span>
          <span style={{
            ...styles.statusBadge,
            backgroundColor: statusColor + "20",
            color: statusColor
          }}>
            {process.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={styles.processDesc}>{process.description}</p>

      {/* Steps */}
      <div style={styles.stepsSection}>
        <span style={styles.stepsLabel}>Steps ({completedSteps}/{process.steps.length})</span>
        <div style={styles.stepsList}>
          {process.steps.map((step, index) => {
            const isCompleted = index < completedSteps;
            const isActive = index === completedSteps && process.status === "active";
            
            return (
              <div 
                key={index} 
                style={{
                  ...styles.stepItem,
                  ...(isCompleted ? styles.stepCompleted : {}),
                  ...(isActive ? styles.stepActive : {})
                }}
              >
                <span style={{
                  ...styles.stepNumber,
                  backgroundColor: isCompleted ? XR_COLORS.success : isActive ? XR_COLORS.primary : "#E5E5E5",
                  color: isCompleted || isActive ? "#FFF" : XR_COLORS.textMuted
                }}>
                  {isCompleted ? "✓" : index + 1}
                </span>
                <span style={{
                  ...styles.stepText,
                  color: isCompleted ? XR_COLORS.success : isActive ? XR_COLORS.primary : XR_COLORS.textMuted
                }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${(completedSteps / process.steps.length) * 100}%`,
            backgroundColor: statusColor
          }} />
        </div>
        <span style={styles.progressText}>
          {Math.round((completedSteps / process.steps.length) * 100)}%
        </span>
      </div>
    </div>
  );
};

// Legend Item
const LegendItem: React.FC<{ status: string; label: string }> = ({ status, label }) => (
  <div style={styles.legendItem}>
    <span style={{
      ...styles.legendDot,
      backgroundColor: getStatusColor(status)
    }} />
    <span style={styles.legendLabel}>{label}</span>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  container: {},
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  count: {
    fontSize: "12px",
    color: XR_COLORS.textSecondary
  },
  processList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  processCard: {
    padding: "16px",
    backgroundColor: "#FAFAFA",
    borderRadius: "12px",
    border: "1px solid #E5E5E5"
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "10px"
  },
  processIcon: {
    fontSize: "24px"
  },
  cardInfo: {},
  processName: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary,
    marginBottom: "4px"
  },
  statusBadge: {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase" as const
  },
  processDesc: {
    margin: "0 0 16px 0",
    fontSize: "12px",
    color: XR_COLORS.textSecondary,
    lineHeight: 1.4
  },
  stepsSection: {
    marginBottom: "12px"
  },
  stepsLabel: {
    display: "block",
    fontSize: "11px",
    color: XR_COLORS.textMuted,
    marginBottom: "8px"
  },
  stepsList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  stepCompleted: {},
  stepActive: {},
  stepNumber: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 600
  },
  stepText: {
    fontSize: "12px"
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
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
    fontSize: "11px",
    fontWeight: 600,
    color: XR_COLORS.textSecondary,
    minWidth: "35px"
  },
  legend: {
    marginTop: "24px",
    padding: "12px",
    backgroundColor: "#F5F5F5",
    borderRadius: "8px"
  },
  legendTitle: {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    color: XR_COLORS.textSecondary,
    marginBottom: "8px"
  },
  legendItems: {
    display: "flex",
    gap: "16px"
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%"
  },
  legendLabel: {
    fontSize: "11px",
    color: XR_COLORS.textMuted
  }
};

export default XRProcessPanel;
