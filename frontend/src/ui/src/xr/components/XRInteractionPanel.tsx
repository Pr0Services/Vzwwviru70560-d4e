/**
 * ============================================================
 * CHE·NU — XR COMPONENT — INTERACTION PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState } from "react";
import type {
  GestureDefinition,
  InputBinding,
  VoiceCommand,
  InteractionProfile,
  HapticPattern,
} from "../adapters/xrInteractionAdapter";

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
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#D8B26A",
    margin: 0,
  },
  tabs: {
    display: "flex",
    gap: "4px",
    backgroundColor: "#252629",
    padding: "4px",
    borderRadius: "8px",
  },
  tab: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    backgroundColor: "#3EB4A2",
    color: "#1E1F22",
    fontWeight: "500",
  },
  tabInactive: {
    backgroundColor: "transparent",
    color: "#8D8371",
  },
  section: {
    backgroundColor: "#252629",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "16px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#D8B26A",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "12px",
  },
  card: {
    backgroundColor: "#1E1F22",
    borderRadius: "8px",
    padding: "12px",
    border: "1px solid #333",
    transition: "border-color 0.2s",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  cardIcon: {
    fontSize: "24px",
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#E9E4D6",
  },
  cardMeta: {
    fontSize: "11px",
    color: "#8D8371",
  },
  cardBody: {
    fontSize: "12px",
    color: "#8D8371",
    marginTop: "8px",
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "10px",
    fontWeight: "500",
    marginRight: "4px",
  },
  profileCard: {
    backgroundColor: "#1E1F22",
    borderRadius: "8px",
    padding: "16px",
    border: "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  profileActive: {
    borderColor: "#3EB4A2",
    backgroundColor: "#1a2924",
  },
  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  profileName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#E9E4D6",
  },
  profileDevice: {
    fontSize: "11px",
    color: "#3EB4A2",
    textTransform: "uppercase" as const,
  },
  profileStats: {
    display: "flex",
    gap: "16px",
    marginTop: "12px",
  },
  stat: {
    textAlign: "center" as const,
  },
  statValue: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#D8B26A",
  },
  statLabel: {
    fontSize: "10px",
    color: "#8D8371",
    textTransform: "uppercase" as const,
  },
  voiceList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  voiceItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    backgroundColor: "#1E1F22",
    borderRadius: "6px",
  },
  voicePhrase: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#E9E4D6",
    flex: 1,
  },
  voiceAction: {
    fontSize: "11px",
    color: "#3EB4A2",
  },
  hapticVisual: {
    display: "flex",
    gap: "2px",
    marginTop: "8px",
  },
  hapticBar: {
    width: "8px",
    backgroundColor: "#3EB4A2",
    borderRadius: "2px",
    transition: "height 0.2s",
  },
  emptyState: {
    color: "#8D8371",
    fontSize: "13px",
    textAlign: "center" as const,
    padding: "20px",
    fontStyle: "italic" as const,
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getDeviceIcon(device: string): string {
  const icons: Record<string, string> = {
    controller: "🎮",
    hand: "🖐️",
    gaze: "👁️",
    mouse: "🖱️",
    touch: "👆",
    voice: "🎙️",
  };
  return icons[device] || "📱";
}

function getHandBadgeColor(hand: string): string {
  if (hand === "left") return "#3498DB";
  if (hand === "right") return "#E74C3C";
  if (hand === "both") return "#9B59B6";
  return "#3EB4A2";
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

const GestureCard: React.FC<{ gesture: GestureDefinition }> = ({ gesture }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <span style={styles.cardIcon}>{gesture.icon}</span>
      <div>
        <div style={styles.cardTitle}>{gesture.name}</div>
        <div style={styles.cardMeta}>{gesture.type}</div>
      </div>
    </div>
    <div style={styles.cardBody}>
      <p>{gesture.description}</p>
      <div style={{ marginTop: "8px" }}>
        <span 
          style={{ 
            ...styles.badge, 
            backgroundColor: getHandBadgeColor(gesture.requiredHand),
            color: "#fff",
          }}
        >
          {gesture.requiredHand} hand
        </span>
        <span style={{ ...styles.badge, backgroundColor: "#2F4C39", color: "#3EB4A2" }}>
          → {gesture.action}
        </span>
      </div>
      <div style={{ marginTop: "8px", fontSize: "11px", color: "#8D8371" }}>
        Confidence: {Math.round(gesture.confidenceThreshold * 100)}%
      </div>
    </div>
  </div>
);

const BindingCard: React.FC<{ binding: InputBinding }> = ({ binding }) => (
  <div 
    style={{ 
      ...styles.card,
      opacity: binding.enabled ? 1 : 0.5,
    }}
  >
    <div style={styles.cardHeader}>
      <span style={styles.cardIcon}>{getDeviceIcon(binding.device)}</span>
      <div>
        <div style={styles.cardTitle}>{binding.name}</div>
        <div style={styles.cardMeta}>{binding.device} / {binding.input}</div>
      </div>
      <span 
        style={{ 
          ...styles.badge, 
          backgroundColor: binding.enabled ? "#2F4C39" : "#3d2222",
          color: binding.enabled ? "#3EB4A2" : "#E74C3C",
          marginLeft: "auto",
        }}
      >
        {binding.enabled ? "Enabled" : "Disabled"}
      </span>
    </div>
    <div style={styles.cardBody}>
      <p>{binding.description}</p>
      <div style={{ marginTop: "8px" }}>
        <span style={{ ...styles.badge, backgroundColor: "#3d3022", color: "#D8B26A" }}>
          → {binding.action}
        </span>
        {binding.modifiers?.map((mod, i) => (
          <span key={i} style={{ ...styles.badge, backgroundColor: "#333", color: "#8D8371" }}>
            {mod}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const VoiceCommandItem: React.FC<{ command: VoiceCommand }> = ({ command }) => (
  <div 
    style={{ 
      ...styles.voiceItem,
      opacity: command.enabled ? 1 : 0.5,
    }}
  >
    <span>🎙️</span>
    <div style={styles.voicePhrase}>"{command.phrase}"</div>
    <div style={styles.voiceAction}>{command.action}</div>
    <span 
      style={{ 
        ...styles.badge, 
        backgroundColor: "#333",
        color: "#8D8371",
      }}
    >
      {Math.round(command.confidence * 100)}%
    </span>
  </div>
);

const HapticCard: React.FC<{ haptic: HapticPattern }> = ({ haptic }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <span style={styles.cardIcon}>📳</span>
      <div>
        <div style={styles.cardTitle}>{haptic.name}</div>
        <div style={styles.cardMeta}>{haptic.duration}ms • {haptic.device}</div>
      </div>
    </div>
    <div style={styles.cardBody}>
      <p>{haptic.description}</p>
      <div style={{ marginTop: "8px" }}>
        <span style={{ fontSize: "11px", color: "#8D8371" }}>
          Intensity: {Math.round(haptic.intensity * 100)}%
        </span>
      </div>
      {/* Visual pattern */}
      <div style={styles.hapticVisual}>
        {haptic.pattern.map((val, i) => (
          <div 
            key={i}
            style={{
              ...styles.hapticBar,
              height: `${Math.max(4, val * 24)}px`,
              opacity: val === 0 ? 0.2 : 1,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const ProfileCard: React.FC<{ 
  profile: InteractionProfile; 
  isActive: boolean;
  onClick: () => void;
}> = ({ profile, isActive, onClick }) => (
  <div 
    style={{ 
      ...styles.profileCard,
      ...(isActive ? styles.profileActive : {}),
    }}
    onClick={onClick}
  >
    <div style={styles.profileHeader}>
      <div>
        <div style={styles.profileName}>{profile.name}</div>
        <div style={{ fontSize: "12px", color: "#8D8371", marginTop: "4px" }}>
          {profile.description}
        </div>
      </div>
      <span style={styles.profileDevice}>
        {getDeviceIcon(profile.defaultDevice)} {profile.defaultDevice}
      </span>
    </div>
    <div style={styles.profileStats}>
      <div style={styles.stat}>
        <div style={styles.statValue}>{profile.bindings.length}</div>
        <div style={styles.statLabel}>Bindings</div>
      </div>
      <div style={styles.stat}>
        <div style={styles.statValue}>{profile.gestures.length}</div>
        <div style={styles.statLabel}>Gestures</div>
      </div>
      <div style={styles.stat}>
        <div style={styles.statValue}>{profile.voiceCommands.length}</div>
        <div style={styles.statLabel}>Voice</div>
      </div>
      <div style={styles.stat}>
        <div style={{ ...styles.statValue, color: profile.hapticEnabled ? "#3EB4A2" : "#E74C3C" }}>
          {profile.hapticEnabled ? "ON" : "OFF"}
        </div>
        <div style={styles.statLabel}>Haptic</div>
      </div>
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

type TabType = "profiles" | "gestures" | "bindings" | "voice" | "haptics";

interface XRInteractionPanelProps {
  profiles: InteractionProfile[];
  gestures: GestureDefinition[];
  bindings: InputBinding[];
  voiceCommands: VoiceCommand[];
  haptics: HapticPattern[];
  activeProfileId?: string;
  onProfileSelect?: (profile: InteractionProfile) => void;
  className?: string;
}

export const XRInteractionPanel: React.FC<XRInteractionPanelProps> = ({
  profiles,
  gestures,
  bindings,
  voiceCommands,
  haptics,
  activeProfileId,
  onProfileSelect,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("profiles");

  const renderTab = (tab: TabType, label: string, icon: string) => (
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
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>🎮 Interaction Settings</h3>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {renderTab("profiles", "Profiles", "👤")}
        {renderTab("gestures", "Gestures", "🖐️")}
        {renderTab("bindings", "Bindings", "🎮")}
        {renderTab("voice", "Voice", "🎙️")}
        {renderTab("haptics", "Haptics", "📳")}
      </div>

      {/* Content */}
      <div style={styles.section}>
        {/* Profiles Tab */}
        {activeTab === "profiles" && (
          <>
            <div style={styles.sectionTitle}>
              <span>👤</span> Interaction Profiles
            </div>
            <div style={styles.grid}>
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  isActive={profile.id === activeProfileId}
                  onClick={() => onProfileSelect?.(profile)}
                />
              ))}
            </div>
          </>
        )}

        {/* Gestures Tab */}
        {activeTab === "gestures" && (
          <>
            <div style={styles.sectionTitle}>
              <span>🖐️</span> Hand Gestures ({gestures.length})
            </div>
            <div style={styles.grid}>
              {gestures.map((gesture) => (
                <GestureCard key={gesture.id} gesture={gesture} />
              ))}
            </div>
          </>
        )}

        {/* Bindings Tab */}
        {activeTab === "bindings" && (
          <>
            <div style={styles.sectionTitle}>
              <span>🎮</span> Input Bindings ({bindings.length})
            </div>
            <div style={styles.grid}>
              {bindings.map((binding) => (
                <BindingCard key={binding.id} binding={binding} />
              ))}
            </div>
          </>
        )}

        {/* Voice Tab */}
        {activeTab === "voice" && (
          <>
            <div style={styles.sectionTitle}>
              <span>🎙️</span> Voice Commands ({voiceCommands.length})
            </div>
            <div style={styles.voiceList}>
              {voiceCommands.map((cmd) => (
                <VoiceCommandItem key={cmd.id} command={cmd} />
              ))}
            </div>
          </>
        )}

        {/* Haptics Tab */}
        {activeTab === "haptics" && (
          <>
            <div style={styles.sectionTitle}>
              <span>📳</span> Haptic Patterns ({haptics.length})
            </div>
            <div style={styles.grid}>
              {haptics.map((haptic) => (
                <HapticCard key={haptic.id} haptic={haptic} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default XRInteractionPanel;
