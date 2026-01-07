/**
 * ============================================================
 * CHE·NU — XR UI DASHBOARD — OBJECT INSPECTOR
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import { xrStyles, XR_COLORS, getObjectTypeColor, getObjectTypeIcon } from "./xrStyles";
import { type XRObject } from "./adapters/xrAdapter";

interface XRObjectInspectorProps {
  object: XRObject | null;
}

export const XRObjectInspector: React.FC<XRObjectInspectorProps> = ({ object }) => {
  if (!object) {
    return (
      <div style={styles.emptyState}>
        <span style={styles.emptyIcon}>🔍</span>
        <p style={styles.emptyText}>Select an object to inspect</p>
        <p style={styles.emptyHint}>Click on any object in the list to view its properties</p>
      </div>
    );
  }

  const typeColor = getObjectTypeColor(object.type);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={{
          ...styles.typeIcon,
          backgroundColor: typeColor + "20"
        }}>
          {getObjectTypeIcon(object.type)}
        </span>
        <div>
          <h3 style={styles.objectName}>{object.name}</h3>
          <span style={{
            ...styles.typeBadge,
            backgroundColor: typeColor + "20",
            color: typeColor
          }}>
            {object.type}
          </span>
        </div>
      </div>

      {/* ID */}
      <div style={styles.section}>
        <span style={styles.sectionLabel}>ID</span>
        <span style={styles.idValue}>{object.id}</span>
      </div>

      {/* Transform Section */}
      <div style={styles.section}>
        <span style={styles.sectionLabel}>Transform</span>
        
        {/* Position */}
        <div style={styles.transformGroup}>
          <span style={styles.transformLabel}>Position</span>
          <div style={styles.vectorRow}>
            <div style={styles.vectorItem}>
              <span style={styles.axis}>X</span>
              <span style={styles.value}>{object.position.x.toFixed(2)}</span>
            </div>
            <div style={styles.vectorItem}>
              <span style={styles.axis}>Y</span>
              <span style={styles.value}>{object.position.y.toFixed(2)}</span>
            </div>
            <div style={styles.vectorItem}>
              <span style={styles.axis}>Z</span>
              <span style={styles.value}>{object.position.z.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div style={styles.transformGroup}>
          <span style={styles.transformLabel}>Rotation</span>
          <div style={styles.vectorRow}>
            <div style={styles.vectorItem}>
              <span style={styles.axis}>X</span>
              <span style={styles.value}>{object.rotation.x}°</span>
            </div>
            <div style={styles.vectorItem}>
              <span style={styles.axis}>Y</span>
              <span style={styles.value}>{object.rotation.y}°</span>
            </div>
            <div style={styles.vectorItem}>
              <span style={styles.axis}>Z</span>
              <span style={styles.value}>{object.rotation.z}°</span>
            </div>
          </div>
        </div>

        {/* Scale */}
        <div style={styles.transformGroup}>
          <span style={styles.transformLabel}>Scale</span>
          <div style={styles.vectorRow}>
            <div style={styles.vectorItem}>
              <span style={styles.axis}>X</span>
              <span style={styles.value}>{object.scale.x.toFixed(2)}</span>
            </div>
            <div style={styles.vectorItem}>
              <span style={styles.axis}>Y</span>
              <span style={styles.value}>{object.scale.y.toFixed(2)}</span>
            </div>
            <div style={styles.vectorItem}>
              <span style={styles.axis}>Z</span>
              <span style={styles.value}>{object.scale.z.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Attributes */}
      {object.meta && Object.keys(object.meta).length > 0 && (
        <div style={styles.section}>
          <span style={styles.sectionLabel}>Meta Attributes</span>
          <div style={styles.metaList}>
            {Object.entries(object.meta).map(([key, value]) => (
              <div key={key} style={styles.metaItem}>
                <span style={styles.metaKey}>{key}</span>
                <span style={styles.metaValue}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Type Info */}
      <div style={styles.section}>
        <span style={styles.sectionLabel}>Type Information</span>
        <div style={styles.typeInfo}>
          <TypeInfoRow type={object.type} />
        </div>
      </div>

      {/* Read-Only Notice */}
      <div style={styles.readOnlyNotice}>
        <span>🔒</span>
        <span>Read-only view. Values cannot be modified.</span>
      </div>
    </div>
  );
};

// Type Info Row
const TypeInfoRow: React.FC<{ type: string }> = ({ type }) => {
  const typeDescriptions: Record<string, string> = {
    panel: "2D information display surface",
    node: "3D interactive point or marker",
    portal: "Scene transition gateway",
    avatar: "User representation placeholder",
    display: "Media or content display screen",
    decoration: "Non-interactive visual element",
    interaction_zone: "Area enabling user interaction"
  };

  return (
    <div style={styles.typeInfoContent}>
      <span style={styles.typeInfoIcon}>{getObjectTypeIcon(type)}</span>
      <div>
        <span style={styles.typeInfoName}>{type}</span>
        <span style={styles.typeInfoDesc}>{typeDescriptions[type] || "Unknown type"}</span>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {},
  emptyState: {
    textAlign: "center" as const,
    padding: "48px 24px",
    color: XR_COLORS.textSecondary
  },
  emptyIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "16px",
    opacity: 0.4
  },
  emptyText: {
    margin: "0 0 8px 0",
    fontSize: "15px",
    fontWeight: 500,
    color: XR_COLORS.textPrimary
  },
  emptyHint: {
    margin: 0,
    fontSize: "13px",
    color: XR_COLORS.textMuted
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #E5E5E5"
  },
  typeIcon: {
    fontSize: "28px",
    padding: "12px",
    borderRadius: "12px"
  },
  objectName: {
    margin: "0 0 6px 0",
    fontSize: "18px",
    fontWeight: 600,
    color: XR_COLORS.textPrimary
  },
  typeBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const
  },
  section: {
    marginBottom: "20px"
  },
  sectionLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    color: XR_COLORS.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: "8px"
  },
  idValue: {
    display: "inline-block",
    padding: "6px 12px",
    backgroundColor: "#F5F5F5",
    borderRadius: "6px",
    fontSize: "12px",
    fontFamily: "monospace",
    color: XR_COLORS.textPrimary
  },
  transformGroup: {
    marginBottom: "12px"
  },
  transformLabel: {
    display: "block",
    fontSize: "12px",
    color: XR_COLORS.textMuted,
    marginBottom: "6px"
  },
  vectorRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px"
  },
  vectorItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "#F5F5F5",
    borderRadius: "6px"
  },
  axis: {
    fontSize: "10px",
    fontWeight: 600,
    color: XR_COLORS.textSecondary,
    width: "14px"
  },
  value: {
    fontSize: "13px",
    fontWeight: 500,
    color: XR_COLORS.textPrimary,
    fontFamily: "monospace"
  },
  metaList: {
    backgroundColor: "#F5F5F5",
    borderRadius: "8px",
    overflow: "hidden"
  },
  metaItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderBottom: "1px solid #E5E5E5"
  },
  metaKey: {
    fontSize: "12px",
    color: XR_COLORS.textSecondary
  },
  metaValue: {
    fontSize: "12px",
    fontWeight: 500,
    color: XR_COLORS.textPrimary
  },
  typeInfo: {
    backgroundColor: "#F5F5F5",
    borderRadius: "8px",
    padding: "12px"
  },
  typeInfoContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  typeInfoIcon: {
    fontSize: "24px"
  },
  typeInfoName: {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: XR_COLORS.textPrimary,
    textTransform: "capitalize" as const
  },
  typeInfoDesc: {
    display: "block",
    fontSize: "11px",
    color: XR_COLORS.textMuted
  },
  readOnlyNotice: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    backgroundColor: XR_COLORS.warning + "10",
    borderRadius: "8px",
    fontSize: "11px",
    color: XR_COLORS.accent3,
    marginTop: "24px"
  }
};

export default XRObjectInspector;
