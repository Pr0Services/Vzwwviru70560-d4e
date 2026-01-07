/**
 * ============================================================
 * CHE·NU — XR COMPONENT — AVATAR CARD
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import type { XRAvatar, AvatarExpression, AvatarAnimation } from "../adapters/xrAvatarAdapter";

// ============================================================
// STYLES
// ============================================================

const styles = {
  card: {
    backgroundColor: "#1E1F22",
    borderRadius: "12px",
    padding: "20px",
    color: "#E9E4D6",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  avatarPreview: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    position: "relative" as const,
  },
  glowRing: {
    position: "absolute" as const,
    top: "-4px",
    left: "-4px",
    right: "-4px",
    bottom: "-4px",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#D8B26A",
    margin: 0,
  },
  role: {
    fontSize: "13px",
    color: "#8D8371",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    marginTop: "4px",
  },
  bio: {
    fontSize: "13px",
    color: "#E9E4D6",
    marginTop: "8px",
    opacity: 0.8,
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "500",
  },
  traitsSection: {
    backgroundColor: "#252629",
    borderRadius: "8px",
    padding: "12px",
  },
  traitRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: "1px solid #333",
  },
  traitLabel: {
    fontSize: "12px",
    color: "#8D8371",
  },
  traitValue: {
    fontSize: "12px",
    color: "#E9E4D6",
    fontWeight: "500",
  },
  colorPalette: {
    display: "flex",
    gap: "6px",
    marginTop: "12px",
  },
  colorSwatch: {
    width: "24px",
    height: "24px",
    borderRadius: "4px",
    border: "2px solid #333",
  },
  expressionBar: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const,
  },
  expressionChip: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    backgroundColor: "#2F4C39",
    color: "#3EB4A2",
  },
  accessoriesSection: {
    marginTop: "12px",
  },
  accessoryItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 0",
    fontSize: "12px",
    color: "#E9E4D6",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid #333",
  },
  footerMeta: {
    fontSize: "11px",
    color: "#8D8371",
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getRoleIcon(role: string): string {
  const icons: Record<string, string> = {
    user: "👤",
    nova: "✨",
    director: "🎭",
    guide: "🧭",
    assistant: "🤖",
    participant: "👥",
  };
  return icons[role] || "👤";
}

function getExpressionEmoji(expression: AvatarExpression): string {
  const emojis: Record<string, string> = {
    neutral: "😐",
    happy: "😊",
    thinking: "🤔",
    focused: "🎯",
    welcoming: "👋",
    concerned: "😟",
  };
  return emojis[expression] || "😐";
}

function getAnimationIcon(animation: AvatarAnimation): string {
  const icons: Record<string, string> = {
    idle: "🧍",
    talking: "💬",
    walking: "🚶",
    waving: "👋",
    pointing: "👉",
    nodding: "👍",
    thinking: "💭",
  };
  return icons[animation] || "🧍";
}

function getAccessoryIcon(type: string): string {
  const icons: Record<string, string> = {
    headwear: "🎩",
    eyewear: "👓",
    neckwear: "🧣",
    handwear: "🧤",
    badge: "🏷️",
    aura: "✨",
  };
  return icons[type] || "📦";
}

// ============================================================
// MAIN COMPONENT
// ============================================================

interface XRAvatarCardProps {
  avatar: XRAvatar;
  onSelect?: (avatar: XRAvatar) => void;
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

export const XRAvatarCard: React.FC<XRAvatarCardProps> = ({
  avatar,
  onSelect,
  showDetails = true,
  compact = false,
  className,
}) => {
  const { appearance, expression, currentAnimation, accessories } = avatar;
  const primaryColor = appearance.colors.primary;
  const glowColor = appearance.colors.glow || primaryColor;

  if (compact) {
    return (
      <div 
        style={{
          ...styles.card,
          padding: "12px",
          flexDirection: "row",
          alignItems: "center",
          cursor: onSelect ? "pointer" : "default",
        }}
        className={className}
        onClick={() => onSelect?.(avatar)}
      >
        <div 
          style={{
            ...styles.avatarPreview,
            width: "48px",
            height: "48px",
            fontSize: "20px",
            backgroundColor: primaryColor,
          }}
        >
          {getRoleIcon(avatar.role)}
        </div>
        <div style={{ flex: 1, marginLeft: "12px" }}>
          <div style={{ ...styles.name, fontSize: "14px" }}>{avatar.name}</div>
          <div style={styles.role}>{avatar.role}</div>
        </div>
        <span style={styles.expressionChip}>
          {getExpressionEmoji(expression)} {expression}
        </span>
      </div>
    );
  }

  return (
    <div 
      style={{
        ...styles.card,
        cursor: onSelect ? "pointer" : "default",
      }}
      className={className}
      onClick={() => onSelect?.(avatar)}
    >
      {/* Header */}
      <div style={styles.header}>
        <div 
          style={{
            ...styles.avatarPreview,
            backgroundColor: primaryColor,
            opacity: appearance.opacity,
          }}
        >
          {appearance.glow && (
            <div 
              style={{
                ...styles.glowRing,
                border: `3px solid ${glowColor}`,
                boxShadow: `0 0 20px ${glowColor}`,
                opacity: appearance.glowIntensity || 0.5,
              }}
            />
          )}
          {getRoleIcon(avatar.role)}
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{avatar.name}</h3>
          <div style={styles.role}>{avatar.role}</div>
          {avatar.bio && <p style={styles.bio}>{avatar.bio}</p>}
        </div>
        <span 
          style={{
            ...styles.statusBadge,
            backgroundColor: avatar.active ? "#2F4C39" : "#3d2222",
            color: avatar.active ? "#3EB4A2" : "#e74c3c",
          }}
        >
          {avatar.active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Expression & Animation */}
      <div style={styles.expressionBar}>
        <span style={styles.expressionChip}>
          {getExpressionEmoji(expression)} {expression}
        </span>
        <span style={{ ...styles.expressionChip, backgroundColor: "#3d3022", color: "#D8B26A" }}>
          {getAnimationIcon(currentAnimation)} {currentAnimation}
        </span>
      </div>

      {showDetails && (
        <>
          {/* Traits */}
          <div style={styles.traitsSection}>
            <div style={styles.traitRow}>
              <span style={styles.traitLabel}>Style</span>
              <span style={styles.traitValue}>{appearance.style}</span>
            </div>
            <div style={styles.traitRow}>
              <span style={styles.traitLabel}>Height</span>
              <span style={styles.traitValue}>{appearance.height}m</span>
            </div>
            <div style={styles.traitRow}>
              <span style={styles.traitLabel}>Opacity</span>
              <span style={styles.traitValue}>{Math.round(appearance.opacity * 100)}%</span>
            </div>
            <div style={{ ...styles.traitRow, borderBottom: "none" }}>
              <span style={styles.traitLabel}>Glow</span>
              <span style={styles.traitValue}>
                {appearance.glow ? `${Math.round((appearance.glowIntensity || 0) * 100)}%` : "Off"}
              </span>
            </div>

            {/* Color Palette */}
            <div style={styles.colorPalette}>
              <div 
                style={{ ...styles.colorSwatch, backgroundColor: appearance.colors.primary }}
                title="Primary"
              />
              <div 
                style={{ ...styles.colorSwatch, backgroundColor: appearance.colors.secondary }}
                title="Secondary"
              />
              <div 
                style={{ ...styles.colorSwatch, backgroundColor: appearance.colors.accent }}
                title="Accent"
              />
              {appearance.colors.glow && (
                <div 
                  style={{ 
                    ...styles.colorSwatch, 
                    backgroundColor: appearance.colors.glow,
                    boxShadow: `0 0 10px ${appearance.colors.glow}`,
                  }}
                  title="Glow"
                />
              )}
            </div>
          </div>

          {/* Accessories */}
          {accessories.length > 0 && (
            <div style={styles.accessoriesSection}>
              <div style={{ ...styles.traitLabel, marginBottom: "8px" }}>Accessories</div>
              {accessories.map((acc) => (
                <div key={acc.id} style={styles.accessoryItem}>
                  <span>{getAccessoryIcon(acc.type)}</span>
                  <span>{acc.name}</span>
                  {acc.color && (
                    <span 
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "2px",
                        backgroundColor: acc.color,
                        marginLeft: "auto",
                      }}
                    />
                  )}
                  <span style={{ opacity: acc.visible ? 1 : 0.4 }}>
                    {acc.visible ? "👁️" : "🚫"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Voice */}
          {avatar.voice && (
            <div style={{ ...styles.traitsSection, marginTop: "0" }}>
              <div style={{ ...styles.traitLabel, marginBottom: "8px" }}>🎙️ Voice</div>
              <div style={styles.traitRow}>
                <span style={styles.traitLabel}>Name</span>
                <span style={styles.traitValue}>{avatar.voice.name}</span>
              </div>
              <div style={styles.traitRow}>
                <span style={styles.traitLabel}>Language</span>
                <span style={styles.traitValue}>{avatar.voice.language}</span>
              </div>
              <div style={{ ...styles.traitRow, borderBottom: "none" }}>
                <span style={styles.traitLabel}>Settings</span>
                <span style={styles.traitValue}>
                  P:{avatar.voice.pitch} S:{avatar.voice.speed} V:{avatar.voice.volume}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.footerMeta}>
          ID: {avatar.id.slice(0, 20)}...
        </span>
        <span style={styles.footerMeta}>
          Created: {new Date(avatar.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default XRAvatarCard;
