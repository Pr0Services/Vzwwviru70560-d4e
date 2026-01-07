/**
 * CHE·NU™ — Diamond Hub Component
 * Central convergence point. Always visible.
 * Reflects context, does nothing by itself.
 */

import React from "react";
import { motion } from "framer-motion";
import type { DiamondState, Hub } from "../../../shared/types";

interface DiamondHubProps {
  diamond: DiamondState;
  visibleHubs: Hub[];
  onToggleHub: (hub: Hub) => void;
}

export function DiamondHub({
  diamond,
  visibleHubs,
  onToggleHub,
}: DiamondHubProps) {
  const { contextLabel, currentState, alertsCount, meetingsCount, tasksDueCount } =
    diamond;

  return (
    <motion.div
      className="diamond-hub"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Diamond Icon */}
      <div className="diamond-icon">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          ◆
        </motion.span>
      </div>

      {/* Context Label */}
      <div className="diamond-context">
        <span className="context-label">{contextLabel}</span>
        <span className="state-label">{currentState.replace("_", " ")}</span>
      </div>

      {/* Status Indicators */}
      <div className="diamond-status">
        <div className="status-item" title="Alertes">
          <span className="status-count alerts">{alertsCount}</span>
          <span className="status-icon">🔔</span>
        </div>
        <div className="status-item" title="Réunions">
          <span className="status-count meetings">{meetingsCount}</span>
          <span className="status-icon">📹</span>
        </div>
        <div className="status-item" title="Tâches dues">
          <span className="status-count tasks">{tasksDueCount}</span>
          <span className="status-icon">✅</span>
        </div>
      </div>

      {/* Hub Toggles */}
      <div className="diamond-hubs">
        {(["communication", "navigation", "workspace"] as Hub[]).map((hub) => {
          const isActive = visibleHubs.includes(hub);
          return (
            <button
              key={hub}
              className={`hub-toggle ${isActive ? "active" : ""}`}
              onClick={() => onToggleHub(hub)}
              title={`${isActive ? "Masquer" : "Afficher"} ${hub}`}
            >
              {hub === "communication" && "💬"}
              {hub === "navigation" && "🧭"}
              {hub === "workspace" && "🔧"}
            </button>
          );
        })}
      </div>

      {/* Governance Indicator */}
      <div className="diamond-governance">
        <span className="governance-badge">🛡️ Gouverné</span>
      </div>
    </motion.div>
  );
}
