/**
 * ============================================================
 * CHE·NU — XR COMPONENT — SESSION STATUS
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { 
  XRSession, 
  XRDevice, 
  SessionState, 
  RenderSettings, 
  ComfortSettings,
  AudioSettings 
} from "../adapters/xrSessionAdapter";

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    backgroundColor: "#1E1F22",
    borderRadius: "12px",
    padding: "20px",
    color: "#E9E4D6",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid #333",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#D8B26A",
    margin: 0,
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statusDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },
  statusText: {
    fontSize: "14px",
    fontWeight: "500",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: "#252629",
    borderRadius: "8px",
    padding: "16px",
  },
  cardTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#D8B26A",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: "1px solid #1E1F22",
  },
  metricLabel: {
    fontSize: "12px",
    color: "#8D8371",
  },
  metricValue: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#E9E4D6",
  },
  deviceList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  deviceItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px",
    backgroundColor: "#1E1F22",
    borderRadius: "6px",
  },
  deviceIcon: {
    fontSize: "20px",
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#E9E4D6",
  },
  deviceMeta: {
    fontSize: "10px",
    color: "#8D8371",
  },
  batteryBar: {
    width: "40px",
    height: "8px",
    backgroundColor: "#333",
    borderRadius: "4px",
    overflow: "hidden",
  },
  batteryFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s",
  },
  slider: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sliderTrack: {
    flex: 1,
    height: "4px",
    backgroundColor: "#333",
    borderRadius: "2px",
    position: "relative" as const,
  },
  sliderFill: {
    position: "absolute" as const,
    left: 0,
    top: 0,
    height: "100%",
    backgroundColor: "#3EB4A2",
    borderRadius: "2px",
  },
  statBox: {
    textAlign: "center" as const,
    padding: "12px",
    backgroundColor: "#1E1F22",
    borderRadius: "6px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#3EB4A2",
  },
  statLabel: {
    fontSize: "10px",
    color: "#8D8371",
    textTransform: "uppercase" as const,
    marginTop: "4px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginBottom: "12px",
  },
  toggle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 0",
  },
  toggleSwitch: {
    width: "36px",
    height: "20px",
    borderRadius: "10px",
    position: "relative" as const,
    cursor: "pointer",
  },
  toggleKnob: {
    position: "absolute" as const,
    top: "2px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    transition: "left 0.2s",
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getStateColor(state: SessionState): string {
  const colors: Record<SessionState, string> = {
    inactive: "#8D8371",
    initializing: "#F39C12",
    active: "#3EB4A2",
    paused: "#D8B26A",
    ending: "#E74C3C",
    error: "#E74C3C",
  };
  return colors[state] || "#8D8371";
}

function getDeviceIcon(type: string): string {
  const icons: Record<string, string> = {
    headset: "🥽",
    controller: "🎮",
    tracker: "📡",
    hand: "🖐️",
  };
  return icons[type] || "📱";
}

function getBatteryColor(level: number): string {
  if (level > 60) return "#3EB4A2";
  if (level > 30) return "#F39C12";
  return "#E74C3C";
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

const DeviceCard: React.FC<{ device: XRDevice }> = ({ device }) => (
  <div style={styles.deviceItem}>
    <span style={styles.deviceIcon}>{getDeviceIcon(device.type)}</span>
    <div style={styles.deviceInfo}>
      <div style={styles.deviceName}>{device.name}</div>
      <div style={styles.deviceMeta}>{device.manufacturer}</div>
    </div>
    {device.batteryLevel !== undefined && (
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <div style={styles.batteryBar}>
          <div 
            style={{
              ...styles.batteryFill,
              width: `${device.batteryLevel}%`,
              backgroundColor: getBatteryColor(device.batteryLevel),
            }}
          />
        </div>
        <span style={{ fontSize: "10px", color: "#8D8371" }}>{device.batteryLevel}%</span>
      </div>
    )}
    <span 
      style={{ 
        width: "8px", 
        height: "8px", 
        borderRadius: "50%", 
        backgroundColor: device.connected ? "#3EB4A2" : "#E74C3C" 
      }} 
    />
  </div>
);

const SettingToggle: React.FC<{ label: string; enabled: boolean }> = ({ label, enabled }) => (
  <div style={styles.toggle}>
    <span style={styles.metricLabel}>{label}</span>
    <div 
      style={{
        ...styles.toggleSwitch,
        backgroundColor: enabled ? "#2F4C39" : "#333",
      }}
    >
      <div 
        style={{
          ...styles.toggleKnob,
          left: enabled ? "18px" : "2px",
        }}
      />
    </div>
  </div>
);

const SettingSlider: React.FC<{ label: string; value: number; max?: number }> = ({ 
  label, 
  value, 
  max = 1 
}) => (
  <div style={styles.metricRow}>
    <span style={styles.metricLabel}>{label}</span>
    <div style={styles.slider}>
      <div style={styles.sliderTrack}>
        <div style={{ ...styles.sliderFill, width: `${(value / max) * 100}%` }} />
      </div>
      <span style={{ fontSize: "11px", color: "#E9E4D6", minWidth: "30px" }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

interface XRSessionStatusProps {
  session: XRSession | null;
  showDevices?: boolean;
  showSettings?: boolean;
  compact?: boolean;
  className?: string;
}

export const XRSessionStatus: React.FC<XRSessionStatusProps> = ({
  session,
  showDevices = true,
  showSettings = true,
  compact = false,
  className,
}) => {
  if (!session) {
    return (
      <div style={styles.container} className={className}>
        <div style={styles.header}>
          <h3 style={styles.title}>🥽 XR Session</h3>
          <div style={styles.statusIndicator}>
            <div style={{ ...styles.statusDot, backgroundColor: "#8D8371" }} />
            <span style={{ ...styles.statusText, color: "#8D8371" }}>No Active Session</span>
          </div>
        </div>
        <p style={{ color: "#8D8371", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>
          Start an XR session to view status
        </p>
      </div>
    );
  }

  const stateColor = getStateColor(session.state);

  if (compact) {
    return (
      <div 
        style={{ 
          ...styles.container, 
          padding: "12px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }} 
        className={className}
      >
        <div style={styles.statusIndicator}>
          <div style={{ ...styles.statusDot, backgroundColor: stateColor }} />
          <span style={{ ...styles.statusText, color: stateColor }}>{session.state}</span>
        </div>
        <span style={{ color: "#8D8371", fontSize: "12px" }}>{session.mode}</span>
        <span style={{ color: "#E9E4D6", fontSize: "12px" }}>{session.frameRate} FPS</span>
        <span style={{ color: "#8D8371", fontSize: "12px" }}>{formatDuration(session.duration)}</span>
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "#3EB4A2" }}>
          {session.currentSphere}
        </span>
      </div>
    );
  }

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>🥽 XR Session</h3>
        <div style={styles.statusIndicator}>
          <div style={{ ...styles.statusDot, backgroundColor: stateColor }} />
          <span style={{ ...styles.statusText, color: stateColor }}>
            {session.state.charAt(0).toUpperCase() + session.state.slice(1)}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{session.frameRate}</div>
          <div style={styles.statLabel}>FPS</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{formatDuration(session.duration)}</div>
          <div style={styles.statLabel}>Duration</div>
        </div>
        <div style={styles.statBox}>
          <div style={{ ...styles.statValue, color: "#D8B26A" }}>{session.mode.replace("immersive-", "")}</div>
          <div style={styles.statLabel}>Mode</div>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Current Location */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>📍</span> Current Location
          </div>
          <div style={styles.metricRow}>
            <span style={styles.metricLabel}>Sphere</span>
            <span style={styles.metricValue}>{session.currentSphere}</span>
          </div>
          <div style={{ ...styles.metricRow, borderBottom: "none" }}>
            <span style={styles.metricLabel}>Scene</span>
            <span style={styles.metricValue}>{session.currentSceneId.split("-").pop()}</span>
          </div>
        </div>

        {/* Devices */}
        {showDevices && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>🎮</span> Devices ({session.devices.filter(d => d.connected).length})
            </div>
            <div style={styles.deviceList}>
              {session.devices.slice(0, 3).map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
              {session.devices.length > 3 && (
                <div style={{ fontSize: "11px", color: "#8D8371", textAlign: "center" }}>
                  +{session.devices.length - 3} more devices
                </div>
              )}
            </div>
          </div>
        )}

        {/* Render Settings */}
        {showSettings && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>🎨</span> Render Settings
            </div>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Quality</span>
              <span style={styles.metricValue}>{session.renderSettings.quality}</span>
            </div>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Target FPS</span>
              <span style={styles.metricValue}>{session.renderSettings.targetFramerate}</span>
            </div>
            <SettingSlider 
              label="Resolution" 
              value={session.renderSettings.resolutionScale} 
            />
            <SettingToggle label="Shadows" enabled={session.renderSettings.shadows} />
            <SettingToggle label="Reflections" enabled={session.renderSettings.reflections} />
            <SettingToggle label="Foveated" enabled={session.renderSettings.foveatedRendering} />
          </div>
        )}

        {/* Comfort Settings */}
        {showSettings && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>🛋️</span> Comfort Settings
            </div>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Mode</span>
              <span style={styles.metricValue}>{session.comfortSettings.mode}</span>
            </div>
            <SettingToggle label="Vignette" enabled={session.comfortSettings.vignette} />
            <SettingToggle label="Snap Turning" enabled={session.comfortSettings.snapTurning} />
            <SettingToggle label="Teleport" enabled={session.comfortSettings.teleportEnabled} />
            {session.comfortSettings.snapTurning && (
              <div style={styles.metricRow}>
                <span style={styles.metricLabel}>Snap Angle</span>
                <span style={styles.metricValue}>{session.comfortSettings.snapTurnAngle}°</span>
              </div>
            )}
          </div>
        )}

        {/* Audio Settings */}
        {showSettings && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>🔊</span> Audio Settings
            </div>
            <SettingToggle label="Spatial Audio" enabled={session.audioSettings.spatialAudio} />
            <SettingSlider label="Master" value={session.audioSettings.masterVolume} />
            <SettingSlider label="Ambient" value={session.audioSettings.ambientVolume} />
            <SettingSlider label="Effects" value={session.audioSettings.effectsVolume} />
            <SettingSlider label="Voice" value={session.audioSettings.voiceVolume} />
          </div>
        )}

        {/* Capabilities */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>✨</span> Capabilities
          </div>
          <SettingToggle label="Hand Tracking" enabled={session.capabilities.handTracking} />
          <SettingToggle label="Eye Tracking" enabled={session.capabilities.eyeTracking} />
          <SettingToggle label="Depth Sensing" enabled={session.capabilities.depthSensing} />
          <SettingToggle label="Plane Detection" enabled={session.capabilities.planeDetection} />
          <SettingToggle label="Anchors" enabled={session.capabilities.anchorDetection} />
        </div>
      </div>
    </div>
  );
};

export default XRSessionStatus;
