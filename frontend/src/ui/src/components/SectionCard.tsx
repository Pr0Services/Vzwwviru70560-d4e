/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — SECTION CARD
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";

interface SectionCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  headerColor?: string;
  badge?: string | number;
  collapsible?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({ 
  title, 
  icon,
  children, 
  headerColor = "#D8B26A",
  badge,
  collapsible = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <section style={styles.card}>
      <header 
        style={{
          ...styles.header,
          borderLeftColor: headerColor,
          cursor: collapsible ? "pointer" : "default"
        }}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div style={styles.titleRow}>
          {icon && <span style={styles.icon}>{icon}</span>}
          <h3 style={styles.title}>{title}</h3>
          {badge !== undefined && (
            <span style={{
              ...styles.badge,
              backgroundColor: headerColor + "20",
              color: headerColor
            }}>
              {badge}
            </span>
          )}
        </div>
        {collapsible && (
          <span style={styles.collapseIcon}>
            {isCollapsed ? "▶" : "▼"}
          </span>
        )}
      </header>
      {!isCollapsed && (
        <div style={styles.content}>
          {children}
        </div>
      )}
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    marginBottom: "16px",
    overflow: "hidden",
    border: "1px solid #E5E5E5"
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: "#FAFAFA",
    borderBottom: "1px solid #E5E5E5",
    borderLeft: "3px solid"
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  icon: {
    fontSize: "16px"
  },
  title: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  badge: {
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600
  },
  collapseIcon: {
    fontSize: "10px",
    color: "#8D8371"
  },
  content: {
    padding: "16px"
  }
};

export default SectionCard;
