/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — TEMPLATES PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { getSphereColor } from "../adapters/universeAdapter";
import { getTemplatesForSphere, formatTemplateCategory } from "../adapters/templateAdapter";
import { SectionCard } from "./SectionCard";

interface TemplatesPanelProps {
  sphere: RootSphere;
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ sphere }) => {
  const templates = getTemplatesForSphere(sphere);
  const color = getSphereColor(sphere);

  return (
    <SectionCard 
      title="Templates" 
      icon="📋"
      headerColor={color}
      badge={templates.length}
      collapsible
    >
      <div style={styles.list}>
        {templates.map((template) => (
          <div key={template.id} style={styles.item}>
            <div style={styles.itemHeader}>
              <span style={styles.itemName}>{template.name}</span>
              <span style={{
                ...styles.categoryBadge,
                backgroundColor: getCategoryBgColor(template.category)
              }}>
                {formatTemplateCategory(template.category)}
              </span>
            </div>
            <div style={styles.itemMeta}>
              <span style={styles.domain}>{template.domain}</span>
              <div style={styles.tags}>
                <span style={styles.sections}>{template.sectionsCount} sections</span>
                {template.isPublic && (
                  <span style={styles.publicBadge}>🌐 Public</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

function getCategoryBgColor(category: string): string {
  const colors: Record<string, string> = {
    document: "#3EB4A220",
    form: "#D8B26A20",
    report: "#3F724920",
    workflow: "#7A593A20",
    layout: "#8D837120",
    structure: "#2F4C3920"
  };
  return colors[category] || "#F0F0F0";
}

const styles: Record<string, React.CSSProperties> = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  item: {
    padding: "10px 12px",
    backgroundColor: "#FAFAFA",
    borderRadius: "6px",
    border: "1px solid #F0F0F0"
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px"
  },
  itemName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  categoryBadge: {
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: 500
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
  tags: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  sections: {
    fontSize: "11px",
    color: "#8D8371"
  },
  publicBadge: {
    fontSize: "10px",
    color: "#3F7249",
    backgroundColor: "#3F724920",
    padding: "2px 6px",
    borderRadius: "8px"
  }
};

export default TemplatesPanel;
