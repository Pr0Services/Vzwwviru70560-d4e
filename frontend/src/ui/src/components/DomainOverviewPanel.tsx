/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — DOMAIN OVERVIEW PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { getDomainsForSphere, getSphereColor } from "../adapters/universeAdapter";
import { SectionCard } from "./SectionCard";

interface DomainOverviewPanelProps {
  sphere: RootSphere;
}

export const DomainOverviewPanel: React.FC<DomainOverviewPanelProps> = ({ sphere }) => {
  const domains = getDomainsForSphere(sphere);
  const color = getSphereColor(sphere);

  return (
    <SectionCard 
      title="Domains" 
      icon="🗂️" 
      headerColor={color}
      badge={domains.length}
    >
      <ul style={styles.list}>
        {domains.map((domain, index) => (
          <li key={domain} style={styles.listItem}>
            <span style={{
              ...styles.dot,
              backgroundColor: color
            }} />
            <span style={styles.domainName}>{domain}</span>
            <span style={styles.domainIndex}>#{index + 1}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
};

const styles: Record<string, React.CSSProperties> = {
  list: {
    margin: 0,
    padding: 0,
    listStyle: "none"
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #F0F0F0"
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginRight: "12px"
  },
  domainName: {
    flex: 1,
    fontSize: "14px",
    color: "#1E1F22"
  },
  domainIndex: {
    fontSize: "12px",
    color: "#8D8371"
  }
};

export default DomainOverviewPanel;
