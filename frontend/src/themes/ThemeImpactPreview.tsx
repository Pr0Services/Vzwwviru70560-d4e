// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — THEME IMPACT PREVIEW + DECISION IMPACT ANALYSIS
// MEGA BLOCK — COPY / PASTE SAFE (Claude / Copilot)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useMemo } from "react";

/* =========================================================
SECTION A — THEME IMPACT PREVIEW ENGINE
========================================================= */

/*
Goal:
Before applying a theme (or blend), CHE·NU shows:
- What will visually change
- What will remain invariant
- What risks / conflicts might appear

Preview is:
- Read-only
- Reversible
- Explanatory, not flashy
*/

/* ==============================
1. TYPES
============================== */

export type ThemeLevel =
  | "global"
  | "sphere"
  | "meeting"
  | "agent"
  | "overlay";

export interface ThemeVars {
  [cssVar: string]: string;
}

export interface ThemeProfile {
  id: string;
  level: ThemeLevel;
  label: string;
  variables: ThemeVars;
}

export type VarCategory = "background" | "text" | "accent" | "motion" | "layout" | "agent" | "other";
export type RiskLevel = "none" | "low" | "medium" | "high";

export interface ThemeImpactDiff {
  varName: string;
  from?: string;
  to: string;
  category: VarCategory;
  risk: RiskLevel;
}

export interface ThemeImpactSummary {
  changedVars: number;
  highRiskChanges: number;
  mediumRiskChanges: number;
  motionChanges: number;
  textContrastTouched: boolean;
  accessibilityAffected: boolean;
}

export interface ThemeImpactPreview {
  baseTheme: ThemeProfile;
  targetTheme: ThemeProfile;
  diffs: ThemeImpactDiff[];
  summary: ThemeImpactSummary;
  canApplySafely: boolean;
  warnings: string[];
}

/* ==============================
2. CATEGORIZATION HELPERS
============================== */

/**
 * Categorize CSS variable by name prefix
 */
export function categorizeVar(varName: string): VarCategory {
  if (varName.startsWith("--bg-") || varName.includes("background")) return "background";
  if (varName.startsWith("--text-") || varName.includes("text")) return "text";
  if (varName.startsWith("--accent-") || varName.includes("accent")) return "accent";
  if (varName.startsWith("--motion-") || varName.includes("motion") || varName.includes("transition") || varName.includes("animation")) return "motion";
  if (varName.startsWith("--layout-") || varName.includes("spacing") || varName.includes("column")) return "layout";
  if (varName.startsWith("--agent-") || varName.includes("agent") || varName.includes("aura")) return "agent";
  return "other";
}

/**
 * Estimate risk level for a variable change
 */
export function estimateRisk(
  varName: string,
  category: VarCategory
): RiskLevel {
  // High risk: accessibility-critical variables
  const highRiskVars = [
    "--text-primary",
    "--contrast-min",
    "--accessibility-mode",
    "--motion-safety",
    "--security-indicator",
  ];
  if (highRiskVars.some((v) => varName.includes(v.replace("--", "")))) {
    return "high";
  }

  // Medium risk: motion and layout changes
  if (category === "motion" && varName.includes("enabled")) {
    return "medium";
  }
  if (category === "layout" && (varName.includes("column") || varName.includes("density"))) {
    return "medium";
  }

  // Low risk: visual changes that don't affect accessibility
  if (category === "background" || category === "text" || category === "accent") {
    return "low";
  }

  return "none";
}

/**
 * Get human-readable description of a variable change
 */
export function describeVarChange(diff: ThemeImpactDiff): string {
  const { varName, from, to, category } = diff;
  
  const name = varName.replace(/^--/, "").replace(/-/g, " ");
  
  if (!from) {
    return `Adding ${name}: ${to}`;
  }
  
  if (category === "motion" && varName.includes("enabled")) {
    return to === "true" || to === "1" 
      ? "Enabling animations"
      : "Disabling animations";
  }
  
  return `${name}: ${from} → ${to}`;
}

/* ==============================
3. IMPACT PREVIEW BUILDER
============================== */

/**
 * Build a complete theme impact preview
 */
export function buildThemeImpactPreview(
  baseTheme: ThemeProfile,
  targetTheme: ThemeProfile
): ThemeImpactPreview {
  const diffs: ThemeImpactDiff[] = [];
  const warnings: string[] = [];

  // Get all unique variable names
  const allVars = new Set([
    ...Object.keys(baseTheme.variables),
    ...Object.keys(targetTheme.variables),
  ]);

  // Build diffs
  allVars.forEach((varName) => {
    const from = baseTheme.variables[varName];
    const to = targetTheme.variables[varName];

    // Skip if unchanged or target doesn't define it
    if (from === to || typeof to === "undefined") return;

    const category = categorizeVar(varName);
    const risk = estimateRisk(varName, category);

    diffs.push({
      varName,
      from,
      to,
      category,
      risk,
    });
  });

  // Build summary
  const highRiskChanges = diffs.filter((d) => d.risk === "high").length;
  const mediumRiskChanges = diffs.filter((d) => d.risk === "medium").length;
  const motionChanges = diffs.filter((d) => d.category === "motion").length;
  const textContrastTouched = diffs.some(
    (d) => d.varName.includes("text-primary") || d.varName.includes("contrast")
  );
  const accessibilityAffected = diffs.some(
    (d) => d.varName.includes("accessibility") || d.varName.includes("motion-safety")
  );

  const summary: ThemeImpactSummary = {
    changedVars: diffs.length,
    highRiskChanges,
    mediumRiskChanges,
    motionChanges,
    textContrastTouched,
    accessibilityAffected,
  };

  // Generate warnings
  if (highRiskChanges > 0) {
    warnings.push(`${highRiskChanges} high-risk change(s) detected. Review carefully.`);
  }
  if (textContrastTouched) {
    warnings.push("Text contrast may be affected. Verify readability.");
  }
  if (accessibilityAffected) {
    warnings.push("Accessibility settings will change. User consent recommended.");
  }
  if (motionChanges > 0 && diffs.some((d) => d.varName.includes("motion-enabled"))) {
    warnings.push("Motion settings will change. Consider motion-sensitive users.");
  }

  // Determine if safe to apply
  const canApplySafely = highRiskChanges === 0 && !accessibilityAffected;

  return {
    baseTheme,
    targetTheme,
    diffs,
    summary,
    canApplySafely,
    warnings,
  };
}

/* ==============================
4. REACT HOOK
============================== */

export function useThemeImpactPreview(
  baseTheme: ThemeProfile | null,
  targetTheme: ThemeProfile | null
) {
  const preview = useMemo(() => {
    if (!baseTheme || !targetTheme) return null;
    return buildThemeImpactPreview(baseTheme, targetTheme);
  }, [baseTheme, targetTheme]);

  return {
    preview,
    hasChanges: preview ? preview.diffs.length > 0 : false,
    canApplySafely: preview?.canApplySafely ?? true,
    warnings: preview?.warnings ?? [],
  };
}

/* =========================================================
SECTION B — REACT IMPACT PREVIEW PANEL (2D)
========================================================= */

interface ThemeImpactPreviewPanelProps {
  preview: ThemeImpactPreview;
  onConfirm?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export function ThemeImpactPreviewPanel({
  preview,
  onConfirm,
  onCancel,
  showActions = true,
}: ThemeImpactPreviewPanelProps) {
  const { baseTheme, targetTheme, diffs, summary, warnings, canApplySafely } = preview;

  const riskColors: Record<RiskLevel, string> = {
    high: "#E06C75",
    medium: "#F5C26B",
    low: "#5DA9FF",
    none: "#AEB6C3",
  };

  const categoryIcons: Record<VarCategory, string> = {
    background: "🎨",
    text: "📝",
    accent: "✨",
    motion: "🎬",
    layout: "📐",
    agent: "🤖",
    other: "⚙️",
  };

  return (
    <div
      style={{
        maxWidth: 680,
        borderRadius: 12,
        padding: 16,
        background: "rgba(11, 14, 22, 0.97)",
        color: "#E6EAF0",
        fontSize: 13,
        boxShadow: "0 12px 32px rgba(0,0,0,0.65)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14 }}>
          🔍 Theme Impact Preview
        </div>
        <div
          style={{
            fontSize: 11,
            opacity: 0.7,
            padding: "4px 8px",
            borderRadius: 4,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          {baseTheme.label} → {targetTheme.label}
        </div>
      </div>

      {/* Summary Row */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 12,
          fontSize: 11,
          flexWrap: "wrap",
        }}
      >
        <span>
          Total changes: <strong>{summary.changedVars}</strong>
        </span>
        <span>
          High-risk:{" "}
          <strong style={{ color: summary.highRiskChanges ? "#E06C75" : "#4CAF88" }}>
            {summary.highRiskChanges}
          </strong>
        </span>
        <span>
          Medium-risk:{" "}
          <strong style={{ color: summary.mediumRiskChanges ? "#F5C26B" : "#AEB6C3" }}>
            {summary.mediumRiskChanges}
          </strong>
        </span>
        <span>
          Motion: <strong>{summary.motionChanges}</strong>
        </span>
        <span>
          Contrast:{" "}
          <strong style={{ color: summary.textContrastTouched ? "#F5C26B" : "#4CAF88" }}>
            {summary.textContrastTouched ? "AFFECTED" : "OK"}
          </strong>
        </span>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div
          style={{
            marginBottom: 12,
            padding: 10,
            borderRadius: 8,
            background: "rgba(245, 194, 107, 0.1)",
            border: "1px solid rgba(245, 194, 107, 0.3)",
          }}
        >
          {warnings.map((w, i) => (
            <div
              key={i}
              style={{
                fontSize: 11,
                color: "#F5C26B",
                marginBottom: i < warnings.length - 1 ? 4 : 0,
              }}
            >
              ⚠ {w}
            </div>
          ))}
        </div>
      )}

      {/* Diff Table */}
      <div
        style={{
          maxHeight: 240,
          overflowY: "auto",
          borderRadius: 8,
          background: "rgba(16,20,30,0.95)",
          padding: 8,
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "24px 1.4fr 1fr 1fr 60px",
            gap: 8,
            padding: "6px 4px",
            fontSize: 10,
            fontWeight: 600,
            opacity: 0.6,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 4,
          }}
        >
          <div></div>
          <div>Variable</div>
          <div>From</div>
          <div>To</div>
          <div>Risk</div>
        </div>

        {diffs.length === 0 && (
          <div style={{ fontSize: 12, opacity: 0.7, padding: 8, textAlign: "center" }}>
            No visual changes detected.
          </div>
        )}

        {diffs.map((d) => (
          <div
            key={d.varName}
            style={{
              display: "grid",
              gridTemplateColumns: "24px 1.4fr 1fr 1fr 60px",
              gap: 8,
              padding: "6px 4px",
              fontSize: 11,
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              alignItems: "center",
            }}
          >
            <div title={d.category}>{categoryIcons[d.category]}</div>
            <div style={{ fontFamily: "monospace", fontSize: 10 }}>
              {d.varName}
            </div>
            <div style={{ opacity: 0.6 }}>{d.from ?? "—"}</div>
            <div>{d.to}</div>
            <div
              style={{
                textTransform: "uppercase",
                fontSize: 9,
                fontWeight: 600,
                color: riskColors[d.risk],
                padding: "2px 4px",
                borderRadius: 3,
                background: `${riskColors[d.risk]}15`,
                textAlign: "center",
              }}
            >
              {d.risk}
            </div>
          </div>
        ))}
      </div>

      {/* Safe to apply indicator */}
      <div
        style={{
          marginTop: 12,
          padding: 8,
          borderRadius: 6,
          background: canApplySafely
            ? "rgba(76, 175, 136, 0.1)"
            : "rgba(224, 108, 117, 0.1)",
          border: `1px solid ${canApplySafely ? "rgba(76, 175, 136, 0.3)" : "rgba(224, 108, 117, 0.3)"}`,
          fontSize: 11,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>{canApplySafely ? "✓" : "⚠"}</span>
        <span style={{ color: canApplySafely ? "#4CAF88" : "#E06C75" }}>
          {canApplySafely
            ? "Safe to apply automatically"
            : "Review required before applying"}
        </span>
      </div>

      {/* Actions */}
      {showActions && (onConfirm || onCancel) && (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: "#AEB6C3",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Cancel
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: canApplySafely ? "#4CAF88" : "#F5C26B",
                color: canApplySafely ? "#fff" : "#000",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {canApplySafely ? "Apply Theme" : "Apply Anyway"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
SECTION C — DECISION IMPACT ANALYSIS
========================================================= */

/*
We don't just preview themes visually.
We also ask: "What does this decision DO to the work?"

Impact analysis answers:
- How many tasks / views / agents are affected?
- Is this a cosmetic or structural decision?
- Does this increase or reduce cognitive load?
*/

export type ImpactScope = "local" | "sphere" | "global";
export type CognitiveLoadDelta = "lower" | "neutral" | "higher";

export interface DecisionImpactContext {
  affectedTasks: number;
  affectedMeetings: number;
  affectedAgents: number;
  affectedUsers: number;
  scope: ImpactScope;
  estimatedCognitiveLoadDelta: CognitiveLoadDelta;
  isStructural: boolean; // vs cosmetic
}

export interface DecisionImpactReport {
  decisionId: string;
  label: string;
  description: string;
  impact: DecisionImpactContext;
  riskLevel: "low" | "medium" | "high";
  recommendedMessaging: string;
  suggestedActions: string[];
}

/* ==============================
5. IMPACT RISK HEURISTICS
============================== */

/**
 * Compute risk level based on impact context
 */
export function computeDecisionImpactRisk(
  ctx: DecisionImpactContext
): "low" | "medium" | "high" {
  // Size factor weights different impact areas
  const sizeFactor =
    ctx.affectedTasks * 1 +
    ctx.affectedMeetings * 3 +
    ctx.affectedAgents * 2 +
    ctx.affectedUsers * 4;

  // Global scope with significant impact = high risk
  if (ctx.scope === "global" && sizeFactor > 15) return "high";
  if (ctx.scope === "global" && ctx.isStructural) return "high";

  // Sphere scope or cognitive load increase = medium risk
  if (ctx.scope === "sphere" && sizeFactor > 10) return "medium";
  if (ctx.estimatedCognitiveLoadDelta === "higher" && sizeFactor > 6) return "medium";
  if (ctx.isStructural && sizeFactor > 5) return "medium";

  return "low";
}

/**
 * Generate recommended messaging based on risk
 */
export function generateMessagingRecommendation(
  riskLevel: "low" | "medium" | "high",
  ctx: DecisionImpactContext
): string {
  if (riskLevel === "high") {
    return "Broadcast to all affected users with a guided tour of changes. Consider phased rollout.";
  }

  if (riskLevel === "medium") {
    return "Show a subtle banner to affected users explaining what changed and why.";
  }

  if (ctx.estimatedCognitiveLoadDelta === "lower") {
    return "Optionally inform users that the experience has been simplified.";
  }

  return "Silent change. No user communication required.";
}

/**
 * Generate suggested actions based on impact
 */
export function generateSuggestedActions(
  riskLevel: "low" | "medium" | "high",
  ctx: DecisionImpactContext
): string[] {
  const actions: string[] = [];

  if (riskLevel === "high") {
    actions.push("Schedule change for low-activity period");
    actions.push("Prepare rollback plan");
    actions.push("Create user communication");
  }

  if (ctx.isStructural) {
    actions.push("Update documentation");
    actions.push("Notify affected team leads");
  }

  if (ctx.affectedAgents > 0) {
    actions.push("Review agent configurations for compatibility");
  }

  if (ctx.estimatedCognitiveLoadDelta === "higher") {
    actions.push("Consider training materials");
    actions.push("Monitor user feedback post-change");
  }

  if (actions.length === 0) {
    actions.push("No special actions required");
  }

  return actions;
}

/* ==============================
6. DECISION IMPACT BUILDER
============================== */

/**
 * Build a complete decision impact report
 */
export function buildDecisionImpactReport(
  decisionId: string,
  label: string,
  description: string,
  ctx: DecisionImpactContext
): DecisionImpactReport {
  const riskLevel = computeDecisionImpactRisk(ctx);
  const recommendedMessaging = generateMessagingRecommendation(riskLevel, ctx);
  const suggestedActions = generateSuggestedActions(riskLevel, ctx);

  return {
    decisionId,
    label,
    description,
    impact: ctx,
    riskLevel,
    recommendedMessaging,
    suggestedActions,
  };
}

/* =========================================================
SECTION D — DECISION IMPACT PANEL (INVESTOR / OWNER VIEW)
========================================================= */

interface DecisionImpactPanelProps {
  report: DecisionImpactReport;
  onApprove?: () => void;
  onReject?: () => void;
}

export function DecisionImpactPanel({
  report,
  onApprove,
  onReject,
}: DecisionImpactPanelProps) {
  const { impact } = report;

  const riskColors = {
    high: "#E06C75",
    medium: "#F5C26B",
    low: "#4CAF88",
  };

  const cognitiveColors: Record<CognitiveLoadDelta, string> = {
    lower: "#4CAF88",
    neutral: "#AEB6C3",
    higher: "#E06C75",
  };

  const cognitiveIcons: Record<CognitiveLoadDelta, string> = {
    lower: "↓",
    neutral: "→",
    higher: "↑",
  };

  return (
    <div
      style={{
        borderRadius: 12,
        padding: 16,
        background: "rgba(12, 16, 24, 0.96)",
        color: "#E6EAF0",
        fontSize: 13,
        maxWidth: 560,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14 }}>
          📊 Decision Impact Analysis
        </div>
        <div
          style={{
            padding: "4px 10px",
            borderRadius: 4,
            background: `${riskColors[report.riskLevel]}20`,
            color: riskColors[report.riskLevel],
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {report.riskLevel} risk
        </div>
      </div>

      {/* Decision Info */}
      <div
        style={{
          marginBottom: 12,
          padding: 10,
          borderRadius: 8,
          background: "rgba(16, 20, 30, 0.9)",
        }}
      >
        <div style={{ fontWeight: 500, marginBottom: 4 }}>{report.label}</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>{report.description}</div>
      </div>

      {/* Impact Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 12,
        }}
      >
        {/* Left: Numbers */}
        <div
          style={{
            padding: 10,
            borderRadius: 8,
            background: "rgba(16, 20, 30, 0.9)",
            fontSize: 11,
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 6, opacity: 0.7 }}>
            AFFECTED ENTITIES
          </div>
          <div style={{ marginBottom: 4 }}>
            👤 Users: <strong>{impact.affectedUsers}</strong>
          </div>
          <div style={{ marginBottom: 4 }}>
            📋 Tasks: <strong>{impact.affectedTasks}</strong>
          </div>
          <div style={{ marginBottom: 4 }}>
            🏠 Meetings: <strong>{impact.affectedMeetings}</strong>
          </div>
          <div>
            🤖 Agents: <strong>{impact.affectedAgents}</strong>
          </div>
        </div>

        {/* Right: Assessment */}
        <div
          style={{
            padding: 10,
            borderRadius: 8,
            background: "rgba(16, 20, 30, 0.9)",
            fontSize: 11,
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 6, opacity: 0.7 }}>
            ASSESSMENT
          </div>
          <div style={{ marginBottom: 4 }}>
            Scope: <strong style={{ textTransform: "uppercase" }}>{impact.scope}</strong>
          </div>
          <div style={{ marginBottom: 4 }}>
            Type: <strong>{impact.isStructural ? "Structural" : "Cosmetic"}</strong>
          </div>
          <div>
            Cognitive load:{" "}
            <strong style={{ color: cognitiveColors[impact.estimatedCognitiveLoadDelta] }}>
              {cognitiveIcons[impact.estimatedCognitiveLoadDelta]}{" "}
              {impact.estimatedCognitiveLoadDelta}
            </strong>
          </div>
        </div>
      </div>

      {/* Recommended Messaging */}
      <div
        style={{
          padding: 10,
          borderRadius: 8,
          background: "rgba(93, 169, 255, 0.08)",
          border: "1px solid rgba(93, 169, 255, 0.2)",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, marginBottom: 4 }}>
          💬 RECOMMENDED MESSAGING
        </div>
        <div style={{ fontSize: 12 }}>{report.recommendedMessaging}</div>
      </div>

      {/* Suggested Actions */}
      {report.suggestedActions.length > 0 && (
        <div
          style={{
            padding: 10,
            borderRadius: 8,
            background: "rgba(16, 20, 30, 0.9)",
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, marginBottom: 6 }}>
            📝 SUGGESTED ACTIONS
          </div>
          {report.suggestedActions.map((action, i) => (
            <div
              key={i}
              style={{
                fontSize: 11,
                marginBottom: 2,
                paddingLeft: 12,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  opacity: 0.5,
                }}
              >
                •
              </span>
              {action}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {(onApprove || onReject) && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          {onReject && (
            <button
              onClick={onReject}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "1px solid #E06C75",
                background: "transparent",
                color: "#E06C75",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Reject
            </button>
          )}
          {onApprove && (
            <button
              onClick={onApprove}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: "#4CAF88",
                color: "#fff",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Approve
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
SECTION E — LAW (CHE·NU)
========================================================= */

/*
✅ No theme change without understanding its impact
✅ No decision without a narrative (what + why + who it touches)
✅ UX is not just "does it look nice?" but "does it reduce confusion?"
✅ Investor view sees:
   - visual impact
   - structural impact
   - communication strategy

Theme impact + decision impact = clarity.
Clarity = trust.
Trust = adoption.
*/

export const IMPACT_LAW = {
  // Preview rules
  noChangeWithoutUnderstanding: true,
  previewIsReadOnly: true,
  previewIsReversible: true,
  previewIsExplanatory: true,

  // Decision rules
  noDecisionWithoutNarrative: true,
  uxReducesConfusion: true,
  investorSeesFullPicture: true,

  // Core equation
  impactPlusClarity: "trust",
  trustPlusAdoption: "success",
} as const;

/* =========================================================
SECTION F — EXPORTS
========================================================= */

export default {
  // Theme Impact
  categorizeVar,
  estimateRisk,
  describeVarChange,
  buildThemeImpactPreview,
  useThemeImpactPreview,
  ThemeImpactPreviewPanel,

  // Decision Impact
  computeDecisionImpactRisk,
  generateMessagingRecommendation,
  generateSuggestedActions,
  buildDecisionImpactReport,
  DecisionImpactPanel,

  // Law
  IMPACT_LAW,
};
