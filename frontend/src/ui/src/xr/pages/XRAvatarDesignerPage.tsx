/**
 * ============================================================
 * CHE·NU — XR PAGE — AVATAR DESIGNER
 * SAFE · REPRESENTATIONAL · NON-BIOMETRIC
 * ============================================================
 * 
 * Page wrapper for XRAvatarDesigner component.
 * Provides full-page avatar morphology editing experience.
 */

import React from "react";
import { XRAvatarDesigner } from "../components/XRAvatarDesigner";
import type { XRAvatarMorphology } from "../components/XRAvatarDesigner";

// ============================================================
// STYLES
// ============================================================

const styles = {
  page: {
    backgroundColor: "#0a0a0f",
    minHeight: "100vh",
    padding: "24px",
    color: "#E9E4D6",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#D8B26A",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#8D8371",
    marginTop: "4px",
  },
  backButton: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#252629",
    color: "#E9E4D6",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  safetyNotice: {
    backgroundColor: "#2F4C39",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "13px",
    color: "#3EB4A2",
  },
  safetyIcon: {
    fontSize: "24px",
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

interface XRAvatarDesignerPageProps {
  onBack?: () => void;
  onProfileSave?: (profile: XRAvatarMorphology) => void;
}

export const XRAvatarDesignerPage: React.FC<XRAvatarDesignerPageProps> = ({
  onBack,
  onProfileSave,
}) => {
  const [savedProfile, setSavedProfile] = React.useState<XRAvatarMorphology | null>(null);

  const handleProfileChange = (profile: XRAvatarMorphology) => {
    // Profile changes are tracked in local state only
    // No persistence - frontend state only
    logger.debug("[XR Avatar Designer] Profile updated:", profile.name);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🎭 Avatar Morphology Designer</h1>
          <p style={styles.subtitle}>
            Create and customize abstract avatar representations
          </p>
        </div>
        {onBack && (
          <button style={styles.backButton} onClick={onBack}>
            ← Back to XR Dashboard
          </button>
        )}
      </div>

      {/* Safety Notice */}
      <div style={styles.safetyNotice}>
        <span style={styles.safetyIcon}>🛡️</span>
        <div>
          <strong>Safe Design Mode</strong> — All avatar traits are abstract and symbolic. 
          No biometrics, no real human likeness, no realistic phenotype categories. 
          Edits remain in local browser state only.
        </div>
      </div>

      {/* Designer Component */}
      <XRAvatarDesigner 
        onProfileChange={handleProfileChange}
      />

      {/* Footer Info */}
      <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#1E1F22", borderRadius: "8px" }}>
        <h4 style={{ color: "#D8B26A", margin: "0 0 8px 0", fontSize: "14px" }}>
          ℹ️ About Avatar Morphology
        </h4>
        <p style={{ color: "#8D8371", fontSize: "12px", margin: 0, lineHeight: 1.6 }}>
          CHE·NU Avatar Morphology Designer creates <strong>abstract symbolic representations</strong> only.
          All traits (height, proportions, silhouette, colors) are neutral descriptors with no connection
          to real-world physical characteristics. This ensures a safe, inclusive design space for all users.
          Avatars are representational entities within the CHE·NU universe, not simulations of real people.
        </p>
      </div>
    </div>
  );
};

export default XRAvatarDesignerPage;
