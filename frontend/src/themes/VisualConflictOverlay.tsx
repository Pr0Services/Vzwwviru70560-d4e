// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — VISUAL CONFLICT OVERLAY + AGENT TRUST SCORE
// CANONICAL BLOCK — COPY/PASTE SAFE (Claude / Copilot)
// ═══════════════════════════════════════════════════════════════════════════════

import React from "react";

/* =========================================================
1. TYPES
========================================================= */

export type ThemeLevel =
  | "global"
  | "sphere"
  | "meeting"
  | "agent"
  | "overlay";

export type ConflictSeverity = "info" | "warning" | "critical";

export interface ThemeConflict {
  id: string;
  timestamp: number;
  severity: ConflictSeverity;
  variable: string;
  competingThemes: {
    level: ThemeLevel;
    themeId: string;
    weight: number;
    agentId?: string;
  }[];
  reason: string;
  autoResolved: boolean;
}

export interface AgentTrustScore {
  agentId: string;
  baseScore: number; // 0..100
  conflictPenalty: number; // cumulative
  behaviorScore: number; // future extension
  finalScore: number; // computed
}

/* =========================================================
2. TRUST CONSTANTS
========================================================= */

export const TRUST_CONSTANTS = {
  base: 80, // starting trust
  max: 100,
  min: 0,
  conflictPenalty: {
    info: 0.5,
    warning: 2,
    critical: 5,
  },
  // Trust level thresholds
  thresholds: {
    high: 80,
    medium: 60,
    low: 40,
  },
  // Colors for trust levels
  colors: {
    high: "#4CAF88",
    medium: "#F5C26B",
    low: "#E06C75",
  },
} as const;

/* =========================================================
3. AGENT TRUST ENGINE
========================================================= */

/**
 * Compute trust score for a single agent based on their conflict history
 */
export function computeAgentTrust(
  agentId: string,
  conflicts: ThemeConflict[]
): AgentTrustScore {
  // Filter conflicts involving this agent
  const agentConflicts = conflicts.filter((c) =>
    c.competingThemes.some((t) => t.agentId === agentId)
  );

  // Calculate total penalty from conflicts
  const penaltyTotal = agentConflicts.reduce((sum, c) => {
    return sum + TRUST_CONSTANTS.conflictPenalty[c.severity];
  }, 0);

  const baseScore = TRUST_CONSTANTS.base;
  const behaviorScore = 0; // Extension point for future behavior tracking

  // Compute final score with bounds
  const raw = baseScore - penaltyTotal + behaviorScore;
  const finalScore = Math.max(
    TRUST_CONSTANTS.min,
    Math.min(TRUST_CONSTANTS.max, raw)
  );

  return {
    agentId,
    baseScore,
    conflictPenalty: penaltyTotal,
    behaviorScore,
    finalScore,
  };
}

/**
 * Compute trust scores for all agents found in conflicts
 */
export function computeAllAgentTrust(
  conflicts: ThemeConflict[]
): AgentTrustScore[] {
  // Extract unique agent IDs from conflicts
  const agentIds = new Set<string>();
  conflicts.forEach((c) =>
    c.competingThemes.forEach((t) => {
      if (t.agentId) agentIds.add(t.agentId);
    })
  );

  return Array.from(agentIds).map((id) => computeAgentTrust(id, conflicts));
}

/**
 * Get trust level category
 */
export function getTrustLevel(
  score: number
): "high" | "medium" | "low" | "critical" {
  if (score >= TRUST_CONSTANTS.thresholds.high) return "high";
  if (score >= TRUST_CONSTANTS.thresholds.medium) return "medium";
  if (score >= TRUST_CONSTANTS.thresholds.low) return "low";
  return "critical";
}

/**
 * Get trust color based on score
 */
export function getTrustColor(score: number): string {
  if (score >= TRUST_CONSTANTS.thresholds.high) return TRUST_CONSTANTS.colors.high;
  if (score >= TRUST_CONSTANTS.thresholds.medium) return TRUST_CONSTANTS.colors.medium;
  return TRUST_CONSTANTS.colors.low;
}

/* =========================================================
4. VISUAL CONFLICT OVERLAY (REACT)
========================================================= */

interface ConflictOverlayProps {
  conflicts: ThemeConflict[];
  onSelectConflict?: (conflict: ThemeConflict) => void;
  onDismiss?: () => void;
  maxVisible?: number;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

const positionStyles: Record<string, React.CSSProperties> = {
  "bottom-right": { bottom: 16, right: 16 },
  "bottom-left": { bottom: 16, left: 16 },
  "top-right": { top: 16, right: 16 },
  "top-left": { top: 16, left: 16 },
};

export function ConflictOverlay({
  conflicts,
  onSelectConflict,
  onDismiss,
  maxVisible = 5,
  position = "bottom-right",
}: ConflictOverlayProps) {
  if (!conflicts.length) return null;

  const severityColor = {
    critical: {
      bg: "rgba(224,108,117,0.12)",
      border: "rgba(224,108,117,0.6)",
    },
    warning: {
      bg: "rgba(245,194,107,0.12)",
      border: "rgba(245,194,107,0.5)",
    },
    info: {
      bg: "rgba(93,169,255,0.08)",
      border: "rgba(93,169,255,0.4)",
    },
  };

  return (
    <div
      style={{
        position: "fixed",
        ...positionStyles[position],
        maxWidth: 360,
        background: "rgba(12, 16, 24, 0.94)",
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        fontSize: 12,
        color: "#E6EAF0",
        zIndex: 9999,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 8,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#F5C26B",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          Theme Conflicts ({conflicts.length})
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              background: "transparent",
              border: "none",
              color: "#7A8496",
              cursor: "pointer",
              fontSize: 14,
              padding: "2px 6px",
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Conflict List */}
      <div
        style={{
          maxHeight: 180,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {conflicts.slice(0, maxVisible).map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectConflict?.(c)}
            style={{
              borderRadius: 8,
              padding: 8,
              marginBottom: 6,
              cursor: onSelectConflict ? "pointer" : "default",
              background: severityColor[c.severity].bg,
              border: `1px solid ${severityColor[c.severity].border}`,
              transition: "transform 0.15s ease",
            }}
          >
            {/* Variable & Severity */}
            <div
              style={{
                fontWeight: 500,
                marginBottom: 2,
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span style={{ fontFamily: "monospace" }}>{c.variable}</span>
              <span
                style={{
                  textTransform: "uppercase",
                  fontSize: 10,
                  opacity: 0.8,
                  padding: "1px 4px",
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.2)",
                }}
              >
                {c.severity}
              </span>
            </div>

            {/* Reason */}
            <div
              style={{
                fontSize: 11,
                opacity: 0.9,
                marginBottom: 4,
              }}
            >
              {c.reason}
            </div>

            {/* Competing Themes */}
            <div
              style={{
                fontSize: 10,
                opacity: 0.7,
              }}
            >
              {c.competingThemes
                .map((t) => `${t.level}:${t.themeId}${t.agentId ? `(${t.agentId})` : ""}`)
                .join(" vs ")}
            </div>

            {/* Auto-resolved indicator */}
            {c.autoResolved && (
              <div
                style={{
                  fontSize: 9,
                  opacity: 0.5,
                  marginTop: 4,
                  fontStyle: "italic",
                }}
              >
                ✓ Auto-resolved
              </div>
            )}
          </div>
        ))}
      </div>

      {/* More indicator */}
      {conflicts.length > maxVisible && (
        <div
          style={{
            marginTop: 4,
            fontSize: 11,
            opacity: 0.6,
            textAlign: "center",
          }}
        >
          +{conflicts.length - maxVisible} more conflicts…
        </div>
      )}
    </div>
  );
}

/* =========================================================
5. AGENT TRUST BADGE (REACT)
========================================================= */

interface AgentTrustBadgeProps {
  trust: AgentTrustScore;
  showDetails?: boolean;
  size?: "small" | "medium" | "large";
}

export function AgentTrustBadge({
  trust,
  showDetails = false,
  size = "small",
}: AgentTrustBadgeProps) {
  const color = getTrustColor(trust.finalScore);

  const sizeStyles = {
    small: { fontSize: 11, padding: "2px 8px", dotSize: 8 },
    medium: { fontSize: 13, padding: "4px 12px", dotSize: 10 },
    large: { fontSize: 15, padding: "6px 16px", dotSize: 12 },
  };

  const styles = sizeStyles[size];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: styles.fontSize,
        padding: styles.padding,
        borderRadius: 999,
        border: `1px solid ${color}`,
        color,
        background: "rgba(0,0,0,0.25)",
        transition: "all 0.2s ease",
      }}
      title={`Base: ${trust.baseScore} | Penalties: ${trust.conflictPenalty.toFixed(1)} | Behavior: ${trust.behaviorScore}`}
    >
      <span
        style={{
          width: styles.dotSize,
          height: styles.dotSize,
          borderRadius: "50%",
          background: color,
        }}
      />
      <span>Trust {trust.finalScore.toFixed(0)}%</span>
      {showDetails && trust.conflictPenalty > 0 && (
        <span style={{ opacity: 0.7, fontSize: "0.85em" }}>
          (-{trust.conflictPenalty.toFixed(1)})
        </span>
      )}
    </div>
  );
}

/* =========================================================
6. AGENT TRUST BAR (REACT)
========================================================= */

interface AgentTrustBarProps {
  trust: AgentTrustScore;
  width?: number;
  height?: number;
  showLabel?: boolean;
}

export function AgentTrustBar({
  trust,
  width = 100,
  height = 8,
  showLabel = true,
}: AgentTrustBarProps) {
  const color = getTrustColor(trust.finalScore);
  const percentage = trust.finalScore;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width,
          height,
          background: "rgba(255,255,255,0.1)",
          borderRadius: height / 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: color,
            borderRadius: height / 2,
            transition: "width 0.3s ease, background 0.3s ease",
          }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: 11, color, minWidth: 35 }}>
          {trust.finalScore.toFixed(0)}%
        </span>
      )}
    </div>
  );
}

/* =========================================================
7. TRUST HOOK (REACT)
========================================================= */

import { useMemo } from "react";

export function useAgentTrust(conflicts: ThemeConflict[]) {
  const trustScores = useMemo(
    () => computeAllAgentTrust(conflicts),
    [conflicts]
  );

  const getAgentTrust = (agentId: string): AgentTrustScore | undefined => {
    return trustScores.find((t) => t.agentId === agentId);
  };

  const lowestTrust = useMemo(() => {
    if (trustScores.length === 0) return null;
    return trustScores.reduce((min, t) =>
      t.finalScore < min.finalScore ? t : min
    );
  }, [trustScores]);

  const highestTrust = useMemo(() => {
    if (trustScores.length === 0) return null;
    return trustScores.reduce((max, t) =>
      t.finalScore > max.finalScore ? t : max
    );
  }, [trustScores]);

  return {
    trustScores,
    getAgentTrust,
    lowestTrust,
    highestTrust,
    averageTrust:
      trustScores.length > 0
        ? trustScores.reduce((sum, t) => sum + t.finalScore, 0) / trustScores.length
        : TRUST_CONSTANTS.base,
  };
}

/* =========================================================
8. XR / 3D SEMANTICS (CONCEPT)
========================================================= */

/*
- Conflict overlay → subtle HUD layer, not intrusive
- Critical conflicts → red rimlight on meeting room boundary
- Agent trust score → halo radius + color intensity
- Low trust agent → dimmer aura, less aggressive suggestions
- High trust agent → more visible presence, but never overrides law

XR Mapping:
- Trust 80-100 → Full aura, bright glow
- Trust 60-79  → Normal aura, yellow tint
- Trust 40-59  → Dimmed aura, orange tint
- Trust 0-39   → Minimal aura, red tint, suggestions muted
*/

export interface XRTrustMapping {
  auraIntensity: number; // 0-1
  glowColor: string;
  suggestionVolume: number; // 0-1
  presenceScale: number; // 0.5-1.0
}

export function mapTrustToXR(trust: AgentTrustScore): XRTrustMapping {
  const score = trust.finalScore;

  if (score >= 80) {
    return {
      auraIntensity: 1.0,
      glowColor: TRUST_CONSTANTS.colors.high,
      suggestionVolume: 1.0,
      presenceScale: 1.0,
    };
  } else if (score >= 60) {
    return {
      auraIntensity: 0.75,
      glowColor: TRUST_CONSTANTS.colors.medium,
      suggestionVolume: 0.8,
      presenceScale: 0.9,
    };
  } else if (score >= 40) {
    return {
      auraIntensity: 0.5,
      glowColor: "#E8A855",
      suggestionVolume: 0.5,
      presenceScale: 0.8,
    };
  } else {
    return {
      auraIntensity: 0.25,
      glowColor: TRUST_CONSTANTS.colors.low,
      suggestionVolume: 0.2,
      presenceScale: 0.6,
    };
  }
}

/* =========================================================
9. LAW (CHE·NU)
========================================================= */

/*
✅ Visual conflict overlay explains, not shames
✅ Agent trust is feedback, not punishment
✅ Users remain in control of who they listen to
✅ Orchestrator can down-rank agents with repeated conflicts
✅ All of this is auditable and replayable
*/

export const TRUST_LAW = {
  overlayExplains: true,
  trustIsFeedback: true,
  userInControl: true,
  orchestratorCanDownrank: true,
  fullyAuditable: true,
} as const;

/* =========================================================
10. EXPORTS
========================================================= */

export default {
  // Trust computation
  computeAgentTrust,
  computeAllAgentTrust,
  getTrustLevel,
  getTrustColor,

  // Components
  ConflictOverlay,
  AgentTrustBadge,
  AgentTrustBar,

  // Hook
  useAgentTrust,

  // XR
  mapTrustToXR,

  // Constants
  TRUST_CONSTANTS,
  TRUST_LAW,
};
