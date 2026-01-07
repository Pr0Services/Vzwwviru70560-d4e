/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — ENGINE BADGES
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";

interface EngineBadgesProps {
  engines: string[];
  maxDisplay?: number;
  size?: "small" | "medium";
}

export const EngineBadges: React.FC<EngineBadgesProps> = ({ 
  engines, 
  maxDisplay = 5,
  size = "medium"
}) => {
  const displayEngines = engines.slice(0, maxDisplay);
  const remaining = engines.length - maxDisplay;

  const badgeStyle = size === "small" ? styles.badgeSmall : styles.badge;

  return (
    <div style={styles.container}>
      {displayEngines.map((engine, index) => (
        <span key={engine} style={{
          ...badgeStyle,
          backgroundColor: getEngineColor(index)
        }}>
          {formatEngineName(engine)}
        </span>
      ))}
      {remaining > 0 && (
        <span style={styles.moreBadge}>
          +{remaining} more
        </span>
      )}
    </div>
  );
};

// Format engine name for display
function formatEngineName(engine: string): string {
  return engine.replace("Engine", "").replace(/([A-Z])/g, " $1").trim();
}

// Get color based on index
function getEngineColor(index: number): string {
  const colors = [
    "#3EB4A220",  // Cenote Turquoise
    "#D8B26A20",  // Sacred Gold
    "#3F724920",  // Jungle Emerald
    "#8D837120",  // Ancient Stone
    "#7A593A20",  // Earth Ember
    "#2F4C3920",  // Shadow Moss
    "#6B5B9520",  // Deep Purple
    "#4A90A420"   // Tech Blue
  ];
  return colors[index % colors.length];
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px"
  },
  badge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#1E1F22"
  },
  badgeSmall: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#1E1F22"
  },
  moreBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#8D8371",
    backgroundColor: "#F0F0F0"
  }
};

export default EngineBadges;
