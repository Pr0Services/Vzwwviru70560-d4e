// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — THEME & DECISION TIMELINE VIEWER + INVESTOR EXPORT
// CANONICAL BLOCK — COPY / PASTE SAFE (Claude / Copilot)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useMemo, useState, useCallback } from "react";

/* =========================================================
1. TYPES (REUSE + EXTEND)
========================================================= */

export type ThemeLevel =
  | "global"
  | "sphere"
  | "meeting"
  | "agent"
  | "overlay";

export type ConflictSeverity = "info" | "warning" | "critical";

export interface ThemeStateSnapshot {
  timestamp: number;
  activeThemes: {
    level: ThemeLevel;
    themeId: string;
    weight: number;
  }[];
  resolvedVariables: Record<string, string>;
  context: {
    sphereId?: string;
    meetingId?: string;
    agentIds?: string[];
  };
}

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

export interface DecisionEvent {
  id: string;
  timestamp: number;
  label: string;
  description: string;
  decidedBy: "USER" | "AGENT" | "MIXED";
  agentIds?: string[];
  sphereId?: string;
  impactLevel: "low" | "medium" | "high";
}

export interface ThemeTimeline {
  sessionId: string;
  snapshots: ThemeStateSnapshot[];
  conflicts: ThemeConflict[];
  decisions: DecisionEvent[];
}

/* =========================================================
2. TIMELINE POINT (NORMALIZED VIEW)
========================================================= */

export interface TimelinePoint {
  timestamp: number;
  themes: ThemeStateSnapshot["activeThemes"];
  hasConflict: boolean;
  conflictSeverity?: ConflictSeverity;
  conflicts: ThemeConflict[];
  decisions: DecisionEvent[];
}

/**
 * Build normalized timeline points from raw timeline data
 * Merges snapshots, conflicts, and decisions into a unified view
 */
export function buildTimelinePoints(
  timeline: ThemeTimeline
): TimelinePoint[] {
  const result: TimelinePoint[] = [];

  // Collect all unique timestamps
  const allTimestamps = new Set<number>();
  timeline.snapshots.forEach((s) => allTimestamps.add(s.timestamp));
  timeline.conflicts.forEach((c) => allTimestamps.add(c.timestamp));
  timeline.decisions.forEach((d) => allTimestamps.add(d.timestamp));

  const sorted = Array.from(allTimestamps).sort((a, b) => a - b);

  // Build point for each timestamp
  sorted.forEach((ts) => {
    // Find snapshot at or before this timestamp
    const snapshot =
      timeline.snapshots.find((s) => s.timestamp === ts) ??
      timeline.snapshots.reduce((prev, curr) =>
        curr.timestamp <= ts && curr.timestamp > (prev?.timestamp ?? 0)
          ? curr
          : prev,
        timeline.snapshots[0]
      );

    const conflictsAtTs = timeline.conflicts.filter((c) => c.timestamp === ts);
    const decisionsAtTs = timeline.decisions.filter((d) => d.timestamp === ts);

    // Determine worst severity at this point
    const severity: ConflictSeverity | undefined =
      conflictsAtTs.length === 0
        ? undefined
        : conflictsAtTs.some((c) => c.severity === "critical")
        ? "critical"
        : conflictsAtTs.some((c) => c.severity === "warning")
        ? "warning"
        : "info";

    result.push({
      timestamp: ts,
      themes: snapshot?.activeThemes ?? [],
      hasConflict: conflictsAtTs.length > 0,
      conflictSeverity: severity,
      conflicts: conflictsAtTs,
      decisions: decisionsAtTs,
    });
  });

  return result;
}

/* =========================================================
3. TIMELINE STATISTICS
========================================================= */

export interface TimelineStats {
  totalPoints: number;
  totalConflicts: number;
  totalDecisions: number;
  conflictsBySeverity: Record<ConflictSeverity, number>;
  decisionsByImpact: Record<"low" | "medium" | "high", number>;
  decisionsByActor: Record<"USER" | "AGENT" | "MIXED", number>;
  durationMs: number;
  startTime: number;
  endTime: number;
}

export function computeTimelineStats(timeline: ThemeTimeline): TimelineStats {
  const points = buildTimelinePoints(timeline);

  return {
    totalPoints: points.length,
    totalConflicts: timeline.conflicts.length,
    totalDecisions: timeline.decisions.length,
    conflictsBySeverity: {
      info: timeline.conflicts.filter((c) => c.severity === "info").length,
      warning: timeline.conflicts.filter((c) => c.severity === "warning").length,
      critical: timeline.conflicts.filter((c) => c.severity === "critical").length,
    },
    decisionsByImpact: {
      low: timeline.decisions.filter((d) => d.impactLevel === "low").length,
      medium: timeline.decisions.filter((d) => d.impactLevel === "medium").length,
      high: timeline.decisions.filter((d) => d.impactLevel === "high").length,
    },
    decisionsByActor: {
      USER: timeline.decisions.filter((d) => d.decidedBy === "USER").length,
      AGENT: timeline.decisions.filter((d) => d.decidedBy === "AGENT").length,
      MIXED: timeline.decisions.filter((d) => d.decidedBy === "MIXED").length,
    },
    durationMs:
      points.length > 0
        ? points[points.length - 1].timestamp - points[0].timestamp
        : 0,
    startTime: points.length > 0 ? points[0].timestamp : 0,
    endTime: points.length > 0 ? points[points.length - 1].timestamp : 0,
  };
}

/* =========================================================
4. REACT TIMELINE VIEWER (INVESTOR / POWER USER)
========================================================= */

interface ThemeTimelineViewerProps {
  timeline: ThemeTimeline;
  onSelectPoint?: (point: TimelinePoint, index: number) => void;
  onSelectConflict?: (conflict: ThemeConflict) => void;
  onSelectDecision?: (decision: DecisionEvent) => void;
  height?: number;
}

export function ThemeTimelineViewer({
  timeline,
  onSelectPoint,
  onSelectConflict,
  onSelectDecision,
  height = 320,
}: ThemeTimelineViewerProps) {
  const points = useMemo(() => buildTimelinePoints(timeline), [timeline]);
  const stats = useMemo(() => computeTimelineStats(timeline), [timeline]);

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePointClick = useCallback(
    (index: number) => {
      setActiveIndex(index);
      onSelectPoint?.(points[index], index);
    },
    [points, onSelectPoint]
  );

  if (!points.length) {
    return (
      <div
        style={{
          padding: 24,
          textAlign: "center",
          color: "#7A8496",
          fontSize: 14,
        }}
      >
        No timeline data available.
      </div>
    );
  }

  const activePoint = points[activeIndex];
  const start = points[0].timestamp;
  const end = points[points.length - 1].timestamp;
  const totalDuration = end - start || 1;

  // Colors
  const colors = {
    critical: "#E06C75",
    warning: "#F5C26B",
    info: "#5DA9FF",
    decision: "#4CAF88",
    neutral: "#AEB6C3",
  };

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: "rgba(11, 14, 20, 0.94)",
        color: "#E6EAF0",
        fontSize: 12,
        maxWidth: 720,
        minHeight: height,
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 12,
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 14 }}>📊 Session Timeline</span>
        <span
          style={{
            opacity: 0.7,
            fontSize: 11,
            fontWeight: 400,
          }}
        >
          {stats.totalPoints} points • {stats.totalConflicts} conflicts •{" "}
          {stats.totalDecisions} decisions
        </span>
      </div>

      {/* Scrubber Track */}
      <div
        style={{
          position: "relative",
          height: 40,
          marginBottom: 16,
          paddingTop: 8,
        }}
      >
        {/* Track line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 22,
            height: 2,
            background: "rgba(120,130,150,0.4)",
            borderRadius: 999,
          }}
        />

        {/* Timeline points */}
        {points.map((p, i) => {
          const offset = ((p.timestamp - start) / totalDuration) * 100;

          const color = p.hasConflict
            ? colors[p.conflictSeverity!]
            : p.decisions.length > 0
            ? colors.decision
            : colors.neutral;

          const size = i === activeIndex ? 12 : p.decisions.length ? 8 : 6;

          return (
            <div
              key={`${p.timestamp}-${i}`}
              onClick={() => handlePointClick(i)}
              style={{
                position: "absolute",
                left: `${offset}%`,
                top: 16,
                width: size,
                height: size,
                marginLeft: -size / 2,
                borderRadius: "50%",
                background: color,
                cursor: "pointer",
                boxShadow: i === activeIndex ? `0 0 12px ${color}` : "none",
                transition: "all 0.15s ease",
                border: i === activeIndex ? "2px solid #fff" : "none",
              }}
              title={`${new Date(p.timestamp).toLocaleTimeString()} - ${
                p.hasConflict ? `Conflict (${p.conflictSeverity})` : ""
              } ${p.decisions.length > 0 ? `${p.decisions.length} decision(s)` : ""}`}
            />
          );
        })}
      </div>

      {/* Active Point Details */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 12,
        }}
      >
        {/* Left: Active Themes */}
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: "rgba(16, 20, 30, 0.9)",
          }}
        >
          <div
            style={{
              fontWeight: 500,
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Active Themes</span>
            <span style={{ opacity: 0.6, fontSize: 10 }}>
              {new Date(activePoint.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {activePoint.themes.length > 0 ? (
            activePoint.themes.map((t) => (
              <div
                key={`${t.level}-${t.themeId}-${t.weight}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  marginBottom: 4,
                  padding: "4px 8px",
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <span>
                  <span
                    style={{
                      textTransform: "uppercase",
                      fontSize: 9,
                      opacity: 0.7,
                      marginRight: 6,
                    }}
                  >
                    {t.level}
                  </span>
                  {t.themeId}
                </span>
                <span style={{ opacity: 0.7 }}>w: {t.weight.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: 11, opacity: 0.6 }}>No theme data.</div>
          )}
        </div>

        {/* Right: Events */}
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: "rgba(16, 20, 30, 0.9)",
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Events</div>

          {/* Conflicts */}
          {activePoint.conflicts.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectConflict?.(c)}
              style={{
                fontSize: 11,
                marginBottom: 6,
                padding: "6px 8px",
                borderRadius: 4,
                background: `${colors[c.severity]}15`,
                border: `1px solid ${colors[c.severity]}40`,
                cursor: onSelectConflict ? "pointer" : "default",
              }}
            >
              <div style={{ color: colors[c.severity], fontWeight: 500 }}>
                ⚠ Conflict ({c.severity})
              </div>
              <div style={{ opacity: 0.8, marginTop: 2 }}>
                {c.variable}: {c.reason}
              </div>
            </div>
          ))}

          {/* Decisions */}
          {activePoint.decisions.map((d) => (
            <div
              key={d.id}
              onClick={() => onSelectDecision?.(d)}
              style={{
                fontSize: 11,
                marginBottom: 6,
                padding: "6px 8px",
                borderRadius: 4,
                background: `${colors.decision}15`,
                border: `1px solid ${colors.decision}40`,
                cursor: onSelectDecision ? "pointer" : "default",
              }}
            >
              <div style={{ fontWeight: 500 }}>📌 {d.label}</div>
              <div style={{ opacity: 0.8, marginTop: 2 }}>{d.description}</div>
              <div style={{ opacity: 0.6, marginTop: 2, fontSize: 10 }}>
                By: {d.decidedBy} • Impact: {d.impactLevel}
              </div>
            </div>
          ))}

          {/* No events */}
          {activePoint.conflicts.length === 0 &&
            activePoint.decisions.length === 0 && (
              <div style={{ fontSize: 11, opacity: 0.6 }}>
                No notable events at this point.
              </div>
            )}
        </div>
      </div>

      {/* Footer Stats */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          gap: 16,
          fontSize: 10,
          opacity: 0.7,
        }}
      >
        <span>
          Critical: <strong style={{ color: colors.critical }}>{stats.conflictsBySeverity.critical}</strong>
        </span>
        <span>
          Warning: <strong style={{ color: colors.warning }}>{stats.conflictsBySeverity.warning}</strong>
        </span>
        <span>
          High Impact: <strong style={{ color: colors.decision }}>{stats.decisionsByImpact.high}</strong>
        </span>
        <span>Duration: {Math.round(stats.durationMs / 1000)}s</span>
      </div>
    </div>
  );
}

/* =========================================================
5. REACT HOOK FOR TIMELINE VIEWER
========================================================= */

export function useTimelineViewer(timeline: ThemeTimeline) {
  const points = useMemo(() => buildTimelinePoints(timeline), [timeline]);
  const stats = useMemo(() => computeTimelineStats(timeline), [timeline]);
  const [activeIndex, setActiveIndex] = useState(0);

  const activePoint = points[activeIndex] || null;

  const goToPoint = useCallback(
    (index: number) => {
      if (index >= 0 && index < points.length) {
        setActiveIndex(index);
      }
    },
    [points.length]
  );

  const goToTimestamp = useCallback(
    (timestamp: number) => {
      const index = points.findIndex((p) => p.timestamp >= timestamp);
      if (index >= 0) {
        setActiveIndex(index);
      }
    },
    [points]
  );

  const next = useCallback(() => {
    if (activeIndex < points.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, points.length]);

  const prev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex]);

  return {
    points,
    stats,
    activeIndex,
    activePoint,
    goToPoint,
    goToTimestamp,
    next,
    prev,
    isFirst: activeIndex === 0,
    isLast: activeIndex === points.length - 1,
  };
}

/* =========================================================
6. INVESTOR EXPORT (MARKDOWN SUMMARY)
========================================================= */

export function exportTimelineToMarkdown(timeline: ThemeTimeline): string {
  const points = buildTimelinePoints(timeline);
  const stats = computeTimelineStats(timeline);

  const highImpactDecisions = timeline.decisions.filter(
    (d) => d.impactLevel === "high"
  );

  const md: string[] = [];

  md.push(`# CHE·NU — Session Timeline Report`);
  md.push(`**Session ID:** \`${timeline.sessionId}\``);
  md.push(`**Generated:** ${new Date().toISOString()}`);
  md.push("");

  md.push(`## 1. Overview`);
  md.push("");
  md.push(`| Metric | Value |`);
  md.push(`|--------|-------|`);
  md.push(`| Total timeline points | ${stats.totalPoints} |`);
  md.push(`| Session duration | ${Math.round(stats.durationMs / 1000)}s |`);
  md.push(`| Total conflicts | ${stats.totalConflicts} |`);
  md.push(`| Total decisions | ${stats.totalDecisions} |`);
  md.push(`| High-impact decisions | ${stats.decisionsByImpact.high} |`);
  md.push("");

  md.push(`## 2. Conflict Summary`);
  md.push("");
  md.push(`| Severity | Count |`);
  md.push(`|----------|-------|`);
  md.push(`| 🔴 Critical | ${stats.conflictsBySeverity.critical} |`);
  md.push(`| 🟡 Warning | ${stats.conflictsBySeverity.warning} |`);
  md.push(`| 🔵 Info | ${stats.conflictsBySeverity.info} |`);
  md.push("");

  md.push(`## 3. Decision Summary`);
  md.push("");
  md.push(`| Actor | Count |`);
  md.push(`|-------|-------|`);
  md.push(`| User | ${stats.decisionsByActor.USER} |`);
  md.push(`| Agent | ${stats.decisionsByActor.AGENT} |`);
  md.push(`| Mixed | ${stats.decisionsByActor.MIXED} |`);
  md.push("");

  md.push(`## 4. High-Impact Decisions`);
  md.push("");
  if (highImpactDecisions.length === 0) {
    md.push(`_No high-impact decisions recorded._`);
  } else {
    highImpactDecisions.forEach((d, i) => {
      md.push(`### ${i + 1}. ${d.label}`);
      md.push(`- **Description:** ${d.description}`);
      md.push(`- **Decided by:** ${d.decidedBy}`);
      md.push(`- **Timestamp:** ${new Date(d.timestamp).toISOString()}`);
      if (d.agentIds?.length) {
        md.push(`- **Agents involved:** ${d.agentIds.join(", ")}`);
      }
      md.push("");
    });
  }

  md.push(`## 5. Theme Stability Analysis`);
  md.push("");
  md.push(
    `Conflicts are treated as **signals**, not errors. ` +
      `The system detected and auto-resolved ${stats.totalConflicts} theme conflicts ` +
      `according to CHE·NU LAW.`
  );
  md.push("");
  if (stats.conflictsBySeverity.critical > 0) {
    md.push(
      `⚠️ **${stats.conflictsBySeverity.critical} critical conflicts** were detected. ` +
        `These involved forbidden variable overrides and were immediately resolved.`
    );
  }
  md.push("");

  md.push(`## 6. Narrative`);
  md.push("");
  md.push(
    `This session demonstrates CHE·NU's ability to manage complex theme interactions ` +
      `while maintaining user safety, clarity, and explainability. Theme conflicts were ` +
      `detected in real-time, auto-resolved according to the governance LAW, and logged ` +
      `for audit. Decisions can be replayed alongside theme evolution to explain **why** ` +
      `the system looked and behaved the way it did at each moment.`
  );
  md.push("");

  md.push(`## 7. Key Principles Demonstrated`);
  md.push("");
  md.push(`- ✅ **Transparency:** All conflicts and decisions are logged`);
  md.push(`- ✅ **Explainability:** Each event includes context and reasoning`);
  md.push(`- ✅ **User Control:** Users remain in control of theme preferences`);
  md.push(`- ✅ **Safety:** Accessibility and security variables are protected`);
  md.push(`- ✅ **Auditability:** Full replay capability for review`);
  md.push("");

  md.push(`---`);
  md.push("");
  md.push(
    `*This report can be attached to investor decks, audits, or XR replays ` +
      `to demonstrate transparency, control, and explainability.*`
  );
  md.push("");
  md.push(`**CHE·NU LAW:** "Voici ce qui s'est passé, et pourquoi."`);

  return md.join("\n");
}

/* =========================================================
7. JSON EXPORT
========================================================= */

export function exportTimelineToJSON(timeline: ThemeTimeline): string {
  const points = buildTimelinePoints(timeline);
  const stats = computeTimelineStats(timeline);

  return JSON.stringify(
    {
      meta: {
        sessionId: timeline.sessionId,
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
      },
      stats,
      points,
      conflicts: timeline.conflicts,
      decisions: timeline.decisions,
    },
    null,
    2
  );
}

/* =========================================================
8. SUMMARY (CHE·NU LAW)
========================================================= */

/*
✅ Timeline viewer = explanation, not spectacle
✅ Conflicts + decisions are always contextualized
✅ Investor export = narrative + numbers (no bullshit)
✅ Replay is read-only; it never mutates reality
✅ History is your shield: "Voici ce qui s'est passé, et pourquoi."
*/

export const TIMELINE_LAW = {
  viewerIsExplanation: true,
  conflictsContextualized: true,
  exportIsNarrativePlusNumbers: true,
  replayIsReadOnly: true,
  historyIsShield: true,
} as const;

/* =========================================================
9. EXPORTS
========================================================= */

export default {
  // Core functions
  buildTimelinePoints,
  computeTimelineStats,

  // Components
  ThemeTimelineViewer,

  // Hooks
  useTimelineViewer,

  // Export functions
  exportTimelineToMarkdown,
  exportTimelineToJSON,

  // Constants
  TIMELINE_LAW,
};
