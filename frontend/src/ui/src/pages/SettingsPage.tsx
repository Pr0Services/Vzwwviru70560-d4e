/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — SETTINGS PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState } from "react";

interface SettingsState {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: boolean;
  compactMode: boolean;
  showEngines: boolean;
  showMemory: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<SettingsState>({
    theme: "light",
    language: "en",
    notifications: true,
    compactMode: false,
    showEngines: true,
    showMemory: true,
    autoRefresh: false,
    refreshInterval: 30
  });

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>
          <span style={styles.icon}>⚙️</span>
          Settings
        </h1>
        <p style={styles.subtitle}>
          Configure your CHE·NU dashboard experience. Note: Settings are session-based only (no persistent storage).
        </p>
      </div>

      {/* Settings Sections */}
      <div style={styles.sectionsGrid}>
        {/* Appearance Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span>🎨</span> Appearance
          </h2>
          
          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <span style={styles.settingLabel}>Theme</span>
              <span style={styles.settingDesc}>Choose your preferred color scheme</span>
            </div>
            <select 
              style={styles.select}
              value={settings.theme}
              onChange={(e) => updateSetting("theme", e.target.value as SettingsState["theme"])}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <span style={styles.settingLabel}>Language</span>
              <span style={styles.settingDesc}>Select display language</span>
            </div>
            <select 
              style={styles.select}
              value={settings.language}
              onChange={(e) => updateSetting("language", e.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <span style={styles.settingLabel}>Compact Mode</span>
              <span style={styles.settingDesc}>Reduce spacing for more content</span>
            </div>
            <ToggleSwitch 
              checked={settings.compactMode}
              onChange={(val) => updateSetting("compactMode", val)}
            />
          </div>
        </div>

        {/* Display Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span>📊</span> Display Options
          </h2>
          
          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <span style={styles.settingLabel}>Show Engines</span>
              <span style={styles.settingDesc}>Display engine badges on sphere cards</span>
            </div>
            <ToggleSwitch 
              checked={settings.showEngines}
              onChange={(val) => updateSetting("showEngines", val)}
            />
          </div>

          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <span style={styles.settingLabel}>Show Memory</span>
              <span style={styles.settingDesc}>Display memory indicators</span>
            </div>
            <ToggleSwitch 
              checked={settings.showMemory}
              onChange={(val) => updateSetting("showMemory", val)}
            />
          </div>

          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <span style={styles.settingLabel}>Notifications</span>
              <span style={styles.settingDesc}>Enable in-app notifications</span>
            </div>
            <ToggleSwitch 
              checked={settings.notifications}
              onChange={(val) => updateSetting("notifications", val)}
            />
          </div>
        </div>

        {/* Data Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span>🔄</span> Data & Refresh
          </h2>
          
          <div style={styles.settingRow}>
            <div style={styles.settingInfo}>
              <span style={styles.settingLabel}>Auto Refresh</span>
              <span style={styles.settingDesc}>Automatically refresh dashboard data</span>
            </div>
            <ToggleSwitch 
              checked={settings.autoRefresh}
              onChange={(val) => updateSetting("autoRefresh", val)}
            />
          </div>

          {settings.autoRefresh && (
            <div style={styles.settingRow}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Refresh Interval</span>
                <span style={styles.settingDesc}>Seconds between refresh cycles</span>
              </div>
              <select 
                style={styles.select}
                value={settings.refreshInterval}
                onChange={(e) => updateSetting("refreshInterval", parseInt(e.target.value))}
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>
          )}
        </div>

        {/* System Info */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span>ℹ️</span> System Information
          </h2>
          
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Version</span>
            <span style={styles.infoValue}>CHE·NU OS v3.0</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Architecture</span>
            <span style={styles.infoValue}>SAFE · NON-AUTONOMOUS</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Mode</span>
            <span style={styles.infoValue}>READ-ONLY</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Spheres</span>
            <span style={styles.infoValue}>10 Active</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Memory System</span>
            <span style={styles.infoValue}>External Only</span>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div style={styles.safetyNotice}>
        <div style={styles.safetyIcon}>🔒</div>
        <div style={styles.safetyContent}>
          <h3 style={styles.safetyTitle}>SAFE Mode Active</h3>
          <p style={styles.safetyText}>
            CHE·NU operates in SAFE, NON-AUTONOMOUS mode. All data is read-only and representational. 
            No persistent state is stored. Settings are session-based only.
          </p>
        </div>
      </div>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (val: boolean) => void }> = ({ checked, onChange }) => (
  <div 
    style={{
      ...toggleStyles.track,
      backgroundColor: checked ? "#3F7249" : "#E5E5E5"
    }}
    onClick={() => onChange(!checked)}
  >
    <div style={{
      ...toggleStyles.thumb,
      transform: checked ? "translateX(20px)" : "translateX(0)"
    }} />
  </div>
);

const toggleStyles: Record<string, React.CSSProperties> = {
  track: {
    width: "44px",
    height: "24px",
    borderRadius: "12px",
    cursor: "pointer",
    position: "relative",
    transition: "background-color 0.2s"
  },
  thumb: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: "2px",
    left: "2px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    transition: "transform 0.2s"
  }
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1000px"
  },
  header: {
    marginBottom: "32px"
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#8D8371",
    cursor: "pointer",
    fontSize: "13px",
    padding: "0",
    marginBottom: "16px"
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: 700,
    color: "#1E1F22",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  icon: {
    fontSize: "28px"
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#8D8371",
    maxWidth: "500px"
  },
  sectionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
    marginBottom: "32px"
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    fontSize: "16px",
    fontWeight: 600,
    color: "#1E1F22",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingBottom: "12px",
    borderBottom: "1px solid #E5E5E5"
  },
  settingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #F0F0F0"
  },
  settingInfo: {},
  settingLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#1E1F22",
    marginBottom: "2px"
  },
  settingDesc: {
    display: "block",
    fontSize: "12px",
    color: "#8D8371"
  },
  select: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #E5E5E5",
    fontSize: "13px",
    color: "#1E1F22",
    backgroundColor: "#FAFAFA",
    cursor: "pointer",
    minWidth: "140px"
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #F0F0F0"
  },
  infoLabel: {
    fontSize: "13px",
    color: "#666"
  },
  infoValue: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#1E1F22"
  },
  safetyNotice: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#3F724910",
    borderRadius: "12px",
    border: "1px solid #3F724930"
  },
  safetyIcon: {
    fontSize: "28px"
  },
  safetyContent: {},
  safetyTitle: {
    margin: "0 0 6px 0",
    fontSize: "15px",
    fontWeight: 600,
    color: "#3F7249"
  },
  safetyText: {
    margin: 0,
    fontSize: "13px",
    color: "#2F4C39",
    lineHeight: 1.5
  }
};

export default SettingsPage;
