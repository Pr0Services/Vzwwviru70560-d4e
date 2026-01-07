/**
 * ============================================================
 * CHE·NU — XR PAGE — SETTINGS
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState } from "react";
import { XRSessionStatus } from "../components/XRSessionStatus";
import { XRInteractionPanel } from "../components/XRInteractionPanel";
import {
  getCurrentSession,
  getAllPresets,
  getAvailableModes,
  getQualityLevels,
  getComfortModes,
  type SessionPreset,
} from "../../adapters/xrSessionAdapter";
import {
  getAllGestures,
  getAllBindings,
  getAllVoiceCommands,
  getAllHaptics,
  getAllProfiles,
  type InteractionProfile,
} from "../../adapters/xrInteractionAdapter";

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
  tabs: {
    display: "flex",
    gap: "4px",
    backgroundColor: "#1E1F22",
    padding: "4px",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  tab: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    backgroundColor: "#D8B26A",
    color: "#1E1F22",
    fontWeight: "500",
  },
  tabInactive: {
    backgroundColor: "transparent",
    color: "#8D8371",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "24px",
  },
  card: {
    backgroundColor: "#1E1F22",
    borderRadius: "12px",
    padding: "20px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#D8B26A",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  presetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px",
  },
  presetCard: {
    backgroundColor: "#252629",
    borderRadius: "8px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "2px solid transparent",
  },
  presetActive: {
    borderColor: "#3EB4A2",
    backgroundColor: "#1a2924",
  },
  presetName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#E9E4D6",
    marginBottom: "4px",
  },
  presetDesc: {
    fontSize: "12px",
    color: "#8D8371",
  },
  presetMeta: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
    flexWrap: "wrap" as const,
  },
  badge: {
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "10px",
    backgroundColor: "#333",
    color: "#8D8371",
  },
  recommendedBadge: {
    backgroundColor: "#2F4C39",
    color: "#3EB4A2",
  },
  settingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #333",
  },
  settingLabel: {
    fontSize: "13px",
    color: "#E9E4D6",
  },
  settingDesc: {
    fontSize: "11px",
    color: "#8D8371",
    marginTop: "2px",
  },
  select: {
    padding: "8px 12px",
    backgroundColor: "#252629",
    border: "1px solid #333",
    borderRadius: "6px",
    color: "#E9E4D6",
    fontSize: "13px",
    cursor: "pointer",
    minWidth: "120px",
  },
  slider: {
    width: "120px",
    height: "6px",
    borderRadius: "3px",
    backgroundColor: "#333",
    appearance: "none" as const,
    cursor: "pointer",
  },
  toggle: {
    width: "44px",
    height: "24px",
    borderRadius: "12px",
    position: "relative" as const,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  toggleKnob: {
    position: "absolute" as const,
    top: "2px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    transition: "left 0.2s",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "8px",
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
  infoBox: {
    backgroundColor: "#252629",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "16px",
  },
  infoTitle: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#D8B26A",
    marginBottom: "8px",
  },
  infoText: {
    fontSize: "12px",
    color: "#8D8371",
    lineHeight: 1.5,
  },
};

// ============================================================
// TYPES
// ============================================================

type SettingsTab = "session" | "render" | "comfort" | "audio" | "interaction";

// ============================================================
// SUB-COMPONENTS
// ============================================================

const Toggle: React.FC<{ enabled: boolean; onChange?: () => void }> = ({ enabled, onChange }) => (
  <div
    style={{
      ...styles.toggle,
      backgroundColor: enabled ? "#3EB4A2" : "#333",
    }}
    onClick={onChange}
  >
    <div
      style={{
        ...styles.toggleKnob,
        left: enabled ? "22px" : "2px",
      }}
    />
  </div>
);

const SettingItem: React.FC<{
  label: string;
  description?: string;
  children: React.ReactNode;
}> = ({ label, description, children }) => (
  <div style={styles.settingRow}>
    <div>
      <div style={styles.settingLabel}>{label}</div>
      {description && <div style={styles.settingDesc}>{description}</div>}
    </div>
    {children}
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

export const XRSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("session");
  const [activePreset, setActivePreset] = useState<string>("preset-balanced");
  const [activeProfile, setActiveProfile] = useState<string>("profile-vr-default");

  // Get data
  const session = getCurrentSession();
  const presets = getAllPresets();
  const modes = getAvailableModes();
  const qualities = getQualityLevels();
  const comfortModes = getComfortModes();

  // Interaction data
  const gestures = getAllGestures();
  const bindings = getAllBindings();
  const voiceCommands = getAllVoiceCommands();
  const haptics = getAllHaptics();
  const profiles = getAllProfiles();

  const renderTab = (tab: SettingsTab, label: string, icon: string) => (
    <button
      style={{
        ...styles.tab,
        ...(activeTab === tab ? styles.tabActive : styles.tabInactive),
      }}
      onClick={() => setActiveTab(tab)}
    >
      {icon} {label}
    </button>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>⚙️ XR Settings</h1>
          <p style={styles.subtitle}>
            Configure your immersive experience preferences
          </p>
        </div>
        <div style={styles.buttonRow}>
          <button style={{ ...styles.button, ...styles.buttonSecondary }}>
            Reset All
          </button>
          <button style={{ ...styles.button, ...styles.buttonPrimary }}>
            Apply Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {renderTab("session", "Session", "🥽")}
        {renderTab("render", "Render", "🎨")}
        {renderTab("comfort", "Comfort", "🛋️")}
        {renderTab("audio", "Audio", "🔊")}
        {renderTab("interaction", "Interaction", "🎮")}
      </div>

      {/* Tab Content */}
      {activeTab === "session" && (
        <div style={styles.grid}>
          {/* Session Status */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>📊</span> Current Session
            </div>
            <XRSessionStatus session={session} showSettings={false} />
          </div>

          {/* Session Presets */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>📋</span> Session Presets
            </div>
            <div style={styles.presetGrid}>
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  style={{
                    ...styles.presetCard,
                    ...(activePreset === preset.id ? styles.presetActive : {}),
                  }}
                  onClick={() => setActivePreset(preset.id)}
                >
                  <div style={styles.presetName}>{preset.name}</div>
                  <div style={styles.presetDesc}>{preset.description}</div>
                  <div style={styles.presetMeta}>
                    <span style={styles.badge}>{preset.mode.replace("immersive-", "")}</span>
                    <span style={styles.badge}>{preset.renderSettings.quality}</span>
                    {preset.recommended && (
                      <span style={{ ...styles.badge, ...styles.recommendedBadge }}>
                        ✓ Recommended
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "render" && (
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>🎨</span> Render Quality
            </div>
            <SettingItem label="Quality Preset" description="Overall visual quality level">
              <select style={styles.select} defaultValue="high">
                {qualities.map((q) => (
                  <option key={q} value={q}>{q.charAt(0).toUpperCase() + q.slice(1)}</option>
                ))}
              </select>
            </SettingItem>
            <SettingItem label="Target Framerate" description="Frames per second target">
              <select style={styles.select} defaultValue="72">
                <option value="60">60 FPS</option>
                <option value="72">72 FPS</option>
                <option value="90">90 FPS</option>
                <option value="120">120 FPS</option>
              </select>
            </SettingItem>
            <SettingItem label="Resolution Scale" description="Render resolution multiplier">
              <input type="range" style={styles.slider} min="0.5" max="1.5" step="0.1" defaultValue="1.0" />
            </SettingItem>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>✨</span> Visual Effects
            </div>
            <SettingItem label="Anti-aliasing" description="Smooth jagged edges">
              <Toggle enabled={true} />
            </SettingItem>
            <SettingItem label="Shadows" description="Real-time shadow casting">
              <Toggle enabled={true} />
            </SettingItem>
            <SettingItem label="Reflections" description="Screen-space reflections">
              <Toggle enabled={true} />
            </SettingItem>
            <SettingItem label="Post Processing" description="Bloom, color grading, etc.">
              <Toggle enabled={true} />
            </SettingItem>
            <SettingItem label="Foveated Rendering" description="Focus rendering optimization">
              <Toggle enabled={true} />
            </SettingItem>
          </div>
        </div>
      )}

      {activeTab === "comfort" && (
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>🛋️</span> Comfort Mode
            </div>
            <SettingItem label="Play Mode" description="Your physical play space">
              <select style={styles.select} defaultValue="standing">
                {comfortModes.map((m) => (
                  <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                ))}
              </select>
            </SettingItem>
            <SettingItem label="Height Offset" description="Adjust virtual height">
              <input type="range" style={styles.slider} min="-0.5" max="0.5" step="0.1" defaultValue="0" />
            </SettingItem>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>🔄</span> Movement
            </div>
            <SettingItem label="Snap Turning" description="Turn in fixed increments">
              <Toggle enabled={true} />
            </SettingItem>
            <SettingItem label="Snap Turn Angle" description="Degrees per snap">
              <select style={styles.select} defaultValue="45">
                <option value="15">15°</option>
                <option value="22.5">22.5°</option>
                <option value="30">30°</option>
                <option value="45">45°</option>
                <option value="60">60°</option>
                <option value="90">90°</option>
              </select>
            </SettingItem>
            <SettingItem label="Smooth Turning" description="Continuous rotation">
              <Toggle enabled={false} />
            </SettingItem>
            <SettingItem label="Teleport Movement" description="Point-and-click navigation">
              <Toggle enabled={true} />
            </SettingItem>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>🎭</span> Vignette
            </div>
            <SettingItem label="Enable Vignette" description="Reduce peripheral vision during movement">
              <Toggle enabled={true} />
            </SettingItem>
            <SettingItem label="Vignette Intensity" description="How much to darken edges">
              <input type="range" style={styles.slider} min="0" max="1" step="0.1" defaultValue="0.3" />
            </SettingItem>
            <div style={styles.infoBox}>
              <div style={styles.infoTitle}>ℹ️ Comfort Tips</div>
              <div style={styles.infoText}>
                If you experience motion sickness, try enabling snap turning and vignette. 
                Start with shorter sessions and take breaks regularly.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "audio" && (
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>🔊</span> Audio Settings
            </div>
            <SettingItem label="Spatial Audio" description="3D positional sound">
              <Toggle enabled={true} />
            </SettingItem>
            <SettingItem label="Master Volume">
              <input type="range" style={styles.slider} min="0" max="1" step="0.1" defaultValue="0.8" />
            </SettingItem>
            <SettingItem label="Ambient Volume">
              <input type="range" style={styles.slider} min="0" max="1" step="0.1" defaultValue="0.5" />
            </SettingItem>
            <SettingItem label="Effects Volume">
              <input type="range" style={styles.slider} min="0" max="1" step="0.1" defaultValue="0.7" />
            </SettingItem>
            <SettingItem label="Voice Volume">
              <input type="range" style={styles.slider} min="0" max="1" step="0.1" defaultValue="0.8" />
            </SettingItem>
            <SettingItem label="Music Volume">
              <input type="range" style={styles.slider} min="0" max="1" step="0.1" defaultValue="0.4" />
            </SettingItem>
          </div>
        </div>
      )}

      {activeTab === "interaction" && (
        <XRInteractionPanel
          profiles={profiles}
          gestures={gestures}
          bindings={bindings}
          voiceCommands={voiceCommands}
          haptics={haptics}
          activeProfileId={activeProfile}
          onProfileSelect={(profile) => setActiveProfile(profile.id)}
        />
      )}
    </div>
  );
};

export default XRSettingsPage;
