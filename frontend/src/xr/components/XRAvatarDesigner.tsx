/**
 * ============================================================
 * CHE·NU — XR AVATAR MORPHOLOGY DESIGNER
 * SAFE · REPRESENTATIONAL · NON-BIOMETRIC
 * ============================================================
 * 
 * Avatar designer with ONLY symbolic/abstract traits.
 * NO biometrics, NO real human likeness, NO realistic phenotypes.
 */

import React, { useState } from "react";

// ============================================================
// TYPES
// ============================================================

export interface XRAvatarMorphology {
  id: string;
  name: string;
  traits: {
    height: number;           // Abstract units (1.4 - 2.0)
    proportions: string;      // "balanced", "compact", "slim", "strong"
    silhouette: string;       // Symbolic shape tag
    colorPalette: string[];   // 3-5 hex colors
  };
  meta: Record<string, unknown>;
}

// ============================================================
// PRESETS (All neutral, non-identifying)
// ============================================================

export const AVATAR_PRESETS: XRAvatarMorphology[] = [
  {
    id: "avatar_default",
    name: "CHE·NU Default",
    traits: {
      height: 1.75,
      proportions: "balanced",
      silhouette: "neutral",
      colorPalette: ["#f5f5f5", "#d0d0d0", "#333333"]
    },
    meta: { safe: true, preset: true }
  },
  {
    id: "avatar_compact",
    name: "Compact Presence",
    traits: {
      height: 1.6,
      proportions: "compact",
      silhouette: "rounded",
      colorPalette: ["#fdf3c4", "#f7c77d", "#45413c"]
    },
    meta: { safe: true, preset: true }
  },
  {
    id: "avatar_tall",
    name: "Tall Essence",
    traits: {
      height: 1.9,
      proportions: "slim",
      silhouette: "tall",
      colorPalette: ["#E9E4D6", "#8D8371", "#2F4C39"]
    },
    meta: { safe: true, preset: true }
  },
  {
    id: "avatar_strong",
    name: "Strong Foundation",
    traits: {
      height: 1.8,
      proportions: "strong",
      silhouette: "angular",
      colorPalette: ["#3EB4A2", "#2F4C39", "#1E1F22"]
    },
    meta: { safe: true, preset: true }
  },
  {
    id: "avatar_golden",
    name: "Golden Aura",
    traits: {
      height: 1.75,
      proportions: "balanced",
      silhouette: "neutral",
      colorPalette: ["#D8B26A", "#7A593A", "#1E1F22"]
    },
    meta: { safe: true, preset: true }
  },
  {
    id: "avatar_ocean",
    name: "Ocean Spirit",
    traits: {
      height: 1.7,
      proportions: "balanced",
      silhouette: "rounded",
      colorPalette: ["#3EB4A2", "#1a5f52", "#0a2f29"]
    },
    meta: { safe: true, preset: true }
  }
];

// ============================================================
// FACTORY FUNCTION
// ============================================================

export function createAvatarMorphology(
  name: string,
  overrides: Partial<XRAvatarMorphology["traits"]> = {}
): XRAvatarMorphology {
  return {
    id: "avatar_" + Math.random().toString(36).slice(2),
    name,
    traits: {
      height: overrides.height ?? 1.75,
      proportions: overrides.proportions ?? "balanced",
      silhouette: overrides.silhouette ?? "neutral",
      colorPalette: overrides.colorPalette ?? ["#f5f5f5", "#d0d0d0", "#333333"]
    },
    meta: { safe: true, preset: false }
  };
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    backgroundColor: "#1E1F22",
    borderRadius: "12px",
    padding: "24px",
    color: "#E9E4D6",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #333",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#D8B26A",
    margin: 0,
  },
  subtitle: {
    fontSize: "12px",
    color: "#8D8371",
    marginTop: "4px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    gap: "20px",
  },
  panel: {
    backgroundColor: "#252629",
    borderRadius: "8px",
    padding: "16px",
  },
  panelTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#D8B26A",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  presetList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    maxHeight: "400px",
    overflowY: "auto" as const,
  },
  presetItem: {
    padding: "12px",
    backgroundColor: "#1E1F22",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "2px solid transparent",
  },
  presetName: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#E9E4D6",
    marginBottom: "6px",
  },
  presetColors: {
    display: "flex",
    gap: "4px",
  },
  colorDot: {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
    border: "1px solid #333",
  },
  presetTags: {
    display: "flex",
    gap: "4px",
    marginTop: "6px",
  },
  tag: {
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "10px",
    backgroundColor: "#333",
    color: "#8D8371",
  },
  previewArea: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
    position: "relative" as const,
  },
  avatarShape: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "8px",
  },
  avatarHead: {
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    transition: "all 0.3s",
  },
  avatarBody: {
    borderRadius: "8px",
    transition: "all 0.3s",
  },
  heightBar: {
    position: "absolute" as const,
    right: "20px",
    top: "20px",
    bottom: "20px",
    width: "30px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  heightTrack: {
    width: "4px",
    flex: 1,
    backgroundColor: "#333",
    borderRadius: "2px",
    position: "relative" as const,
  },
  heightMarker: {
    position: "absolute" as const,
    width: "16px",
    height: "16px",
    backgroundColor: "#D8B26A",
    borderRadius: "50%",
    left: "-6px",
    transition: "top 0.3s",
  },
  heightLabel: {
    fontSize: "11px",
    color: "#8D8371",
    marginTop: "8px",
  },
  controlGroup: {
    marginBottom: "16px",
  },
  controlLabel: {
    fontSize: "12px",
    color: "#8D8371",
    marginBottom: "8px",
    display: "block",
  },
  slider: {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    backgroundColor: "#333",
    appearance: "none" as const,
    cursor: "pointer",
  },
  select: {
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "#1E1F22",
    border: "1px solid #333",
    borderRadius: "6px",
    color: "#E9E4D6",
    fontSize: "13px",
    cursor: "pointer",
  },
  colorInput: {
    width: "40px",
    height: "40px",
    border: "2px solid #333",
    borderRadius: "6px",
    cursor: "pointer",
    padding: 0,
  },
  paletteRow: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  nameInput: {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "#1E1F22",
    border: "1px solid #333",
    borderRadius: "6px",
    color: "#E9E4D6",
    fontSize: "14px",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  buttonPrimary: {
    backgroundColor: "#3EB4A2",
    color: "#1E1F22",
  },
  buttonSecondary: {
    backgroundColor: "#252629",
    color: "#E9E4D6",
    border: "1px solid #333",
  },
  buttonRow: {
    display: "flex",
    gap: "8px",
    marginTop: "16px",
  },
  jsonPanel: {
    backgroundColor: "#0a0a0f",
    borderRadius: "6px",
    padding: "12px",
    fontFamily: "monospace",
    fontSize: "11px",
    color: "#3EB4A2",
    maxHeight: "200px",
    overflow: "auto" as const,
    whiteSpace: "pre-wrap" as const,
  },
  legend: {
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#1E1F22",
    borderRadius: "6px",
    fontSize: "11px",
    color: "#8D8371",
  },
  legendTitle: {
    fontWeight: "600",
    color: "#D8B26A",
    marginBottom: "8px",
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

interface XRAvatarDesignerProps {
  onProfileChange?: (profile: XRAvatarMorphology) => void;
  className?: string;
}

export const XRAvatarDesigner: React.FC<XRAvatarDesignerProps> = ({
  onProfileChange,
  className,
}) => {
  const [profile, setProfile] = useState<XRAvatarMorphology>(AVATAR_PRESETS[0]);
  const [showJson, setShowJson] = useState(false);

  const updateTrait = <K extends keyof XRAvatarMorphology["traits"]>(
    key: K,
    value: XRAvatarMorphology["traits"][K]
  ) => {
    const updated = {
      ...profile,
      traits: { ...profile.traits, [key]: value },
      meta: { ...profile.meta, preset: false },
    };
    setProfile(updated);
    onProfileChange?.(updated);
  };

  const updateColor = (index: number, color: string) => {
    const newPalette = [...profile.traits.colorPalette];
    newPalette[index] = color;
    updateTrait("colorPalette", newPalette);
  };

  const loadPreset = (preset: XRAvatarMorphology) => {
    setProfile({ ...preset });
    onProfileChange?.(preset);
  };

  const resetToDefault = () => {
    loadPreset(AVATAR_PRESETS[0]);
  };

  const exportProfile = () => {
    const json = JSON.stringify(profile, null, 2);
    navigator.clipboard?.writeText(json);
    alert("Profile copied to clipboard!");
  };

  // Calculate visual properties
  const heightPercent = ((profile.traits.height - 1.4) / 0.6) * 100;
  const bodyWidth = profile.traits.proportions === "slim" ? 60 : 
                    profile.traits.proportions === "strong" ? 100 :
                    profile.traits.proportions === "compact" ? 70 : 80;
  const bodyHeight = profile.traits.silhouette === "tall" ? 140 :
                     profile.traits.silhouette === "rounded" ? 100 : 120;
  const borderRadius = profile.traits.silhouette === "rounded" ? "40%" :
                       profile.traits.silhouette === "angular" ? "4px" : "8px";

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🎭 Avatar Morphology Designer</h2>
          <p style={styles.subtitle}>
            Abstract symbolic design · No biometrics · Safe representational only
          </p>
        </div>
        <div style={styles.buttonRow}>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={resetToDefault}
          >
            Reset
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={exportProfile}
          >
            Export JSON
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left Panel - Presets */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>
            <span>📋</span> Presets
          </div>
          <div style={styles.presetList}>
            {AVATAR_PRESETS.map((preset) => (
              <div
                key={preset.id}
                style={{
                  ...styles.presetItem,
                  borderColor: profile.id === preset.id ? "#D8B26A" : "transparent",
                  backgroundColor: profile.id === preset.id ? "#2a2b2f" : "#1E1F22",
                }}
                onClick={() => loadPreset(preset)}
              >
                <div style={styles.presetName}>{preset.name}</div>
                <div style={styles.presetColors}>
                  {preset.traits.colorPalette.map((c, i) => (
                    <div key={i} style={{ ...styles.colorDot, backgroundColor: c }} />
                  ))}
                </div>
                <div style={styles.presetTags}>
                  <span style={styles.tag}>{preset.traits.proportions}</span>
                  <span style={styles.tag}>{preset.traits.silhouette}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Preview */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>
            <span>👁️</span> Preview
          </div>
          <div style={styles.previewArea}>
            {/* Avatar Shape (Symbolic Only) */}
            <div style={styles.avatarShape}>
              {/* Head - Circle */}
              <div
                style={{
                  ...styles.avatarHead,
                  width: `${bodyWidth * 0.6}px`,
                  height: `${bodyWidth * 0.6}px`,
                  backgroundColor: profile.traits.colorPalette[0],
                  border: `3px solid ${profile.traits.colorPalette[2]}`,
                }}
              >
                😊
              </div>
              {/* Body - Rectangle */}
              <div
                style={{
                  ...styles.avatarBody,
                  width: `${bodyWidth}px`,
                  height: `${bodyHeight}px`,
                  backgroundColor: profile.traits.colorPalette[1],
                  border: `3px solid ${profile.traits.colorPalette[2]}`,
                  borderRadius: borderRadius,
                }}
              />
            </div>

            {/* Height Bar */}
            <div style={styles.heightBar}>
              <div style={styles.heightTrack}>
                <div
                  style={{
                    ...styles.heightMarker,
                    top: `${100 - heightPercent}%`,
                  }}
                />
              </div>
              <span style={styles.heightLabel}>{profile.traits.height.toFixed(2)}u</span>
            </div>

            {/* Name Display */}
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#D8B26A" }}>
                {profile.name}
              </div>
              <div style={{ fontSize: "12px", color: "#8D8371", marginTop: "4px" }}>
                {profile.traits.proportions} · {profile.traits.silhouette}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Controls */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>
            <span>🎛️</span> Traits
          </div>

          {/* Name */}
          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              style={styles.nameInput}
            />
          </div>

          {/* Height */}
          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>
              Height (Abstract Units): {profile.traits.height.toFixed(2)}
            </label>
            <input
              type="range"
              min="1.4"
              max="2.0"
              step="0.05"
              value={profile.traits.height}
              onChange={(e) => updateTrait("height", parseFloat(e.target.value))}
              style={styles.slider}
            />
          </div>

          {/* Proportions */}
          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Proportions</label>
            <select
              value={profile.traits.proportions}
              onChange={(e) => updateTrait("proportions", e.target.value)}
              style={styles.select}
            >
              <option value="balanced">Balanced</option>
              <option value="compact">Compact</option>
              <option value="slim">Slim</option>
              <option value="strong">Strong</option>
            </select>
          </div>

          {/* Silhouette */}
          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Silhouette</label>
            <select
              value={profile.traits.silhouette}
              onChange={(e) => updateTrait("silhouette", e.target.value)}
              style={styles.select}
            >
              <option value="neutral">Neutral</option>
              <option value="rounded">Rounded</option>
              <option value="angular">Angular</option>
              <option value="tall">Tall</option>
            </select>
          </div>

          {/* Color Palette */}
          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Color Palette</label>
            <div style={styles.paletteRow}>
              {profile.traits.colorPalette.map((color, i) => (
                <input
                  key={i}
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(i, e.target.value)}
                  style={styles.colorInput}
                  title={`Color ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* JSON Toggle */}
          <div style={{ marginTop: "20px" }}>
            <button
              style={{ ...styles.button, ...styles.buttonSecondary, width: "100%" }}
              onClick={() => setShowJson(!showJson)}
            >
              {showJson ? "Hide" : "Show"} JSON Profile
            </button>
          </div>

          {showJson && (
            <div style={{ ...styles.jsonPanel, marginTop: "12px" }}>
              {JSON.stringify(profile, null, 2)}
            </div>
          )}

          {/* Legend */}
          <div style={styles.legend}>
            <div style={styles.legendTitle}>ℹ️ About Traits</div>
            <p>All traits are <strong>abstract and symbolic</strong>.</p>
            <p>• Height: Abstract units (not real measurements)</p>
            <p>• Proportions: General shape balance</p>
            <p>• Silhouette: Outline style</p>
            <p>• Colors: Representational palette only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XRAvatarDesigner;
