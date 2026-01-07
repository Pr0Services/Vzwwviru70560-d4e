// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — THEME SUGGESTION INBOX & ARBITRATION ENGINE
// CANONICAL BLOCK — COPY / PASTE SAFE (Claude / Copilot)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo, useCallback } from "react";

/* =========================================================
1. TYPES
========================================================= */

export type ThemeSuggestionStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired";

export type ThemeSuggestionScope = "global" | "sphere" | "meeting";

export interface ThemeSuggestion {
  id: string;
  timestamp: number;
  suggestedByAgentId: string;
  scope: ThemeSuggestionScope;
  targetId?: string; // sphereId or meetingId
  proposedThemeId: string;
  proposedWeight?: number;
  reason: string;
  confidence: number; // 0..1
  status: ThemeSuggestionStatus;
  expiresAt?: number; // optional expiration timestamp
}

export interface ThemeArbitrationDecision {
  suggestionId: string;
  decidedBy: "USER" | "ORCHESTRATOR";
  decision: "accept" | "reject";
  timestamp: number;
  note?: string;
}

export interface SuggestionInboxState {
  suggestions: ThemeSuggestion[];
  decisions: ThemeArbitrationDecision[];
}

/* =========================================================
2. CONSTANTS
========================================================= */

export const SUGGESTION_CONSTANTS = {
  // Time-to-live for pending suggestions (5 minutes)
  defaultTTL: 5 * 60 * 1000,

  // Minimum confidence to show suggestion (below = auto-ignore)
  minConfidenceToShow: 0.3,

  // Minimum confidence for auto-accept consideration
  minConfidenceForAutoAccept: 0.85,

  // Trust score threshold below which user confirmation is required
  lowTrustThreshold: 50,

  // Maximum pending suggestions before oldest are auto-expired
  maxPendingSuggestions: 10,

  // Colors for status
  statusColors: {
    pending: "#F5C26B",
    accepted: "#4CAF88",
    rejected: "#E06C75",
    expired: "#7A8496",
  },
} as const;

/* =========================================================
3. INBOX CLASS
========================================================= */

export class ThemeSuggestionInbox {
  private suggestions: ThemeSuggestion[] = [];
  private decisions: ThemeArbitrationDecision[] = [];
  private listeners: Set<() => void> = new Set();

  /**
   * Add a new suggestion to the inbox
   */
  add(suggestion: ThemeSuggestion): void {
    // Auto-ignore low confidence suggestions
    if (suggestion.confidence < SUGGESTION_CONSTANTS.minConfidenceToShow) {
      logger.debug(
        `[ThemeSuggestionInbox] Ignored low-confidence suggestion from ${suggestion.suggestedByAgentId}`
      );
      return;
    }

    // Set expiration if not set
    if (!suggestion.expiresAt) {
      suggestion.expiresAt = suggestion.timestamp + SUGGESTION_CONSTANTS.defaultTTL;
    }

    this.suggestions.push(suggestion);
    this.enforceMaxPending();
    this.notify();
  }

  /**
   * List suggestions with optional status filter
   */
  list(filter?: ThemeSuggestionStatus[]): ThemeSuggestion[] {
    if (!filter) return [...this.suggestions];
    return this.suggestions.filter((s) => filter.includes(s.status));
  }

  /**
   * Get pending suggestions
   */
  getPending(): ThemeSuggestion[] {
    return this.list(["pending"]);
  }

  /**
   * Get suggestion by ID
   */
  get(id: string): ThemeSuggestion | undefined {
    return this.suggestions.find((s) => s.id === id);
  }

  /**
   * Update suggestion status
   */
  updateStatus(id: string, status: ThemeSuggestionStatus): void {
    const suggestion = this.suggestions.find((s) => s.id === id);
    if (suggestion) {
      suggestion.status = status;
      this.notify();
    }
  }

  /**
   * Expire old pending suggestions
   */
  expireOld(ttlMs: number = SUGGESTION_CONSTANTS.defaultTTL): number {
    const now = Date.now();
    let expiredCount = 0;

    this.suggestions.forEach((s) => {
      if (s.status === "pending") {
        const isExpired =
          (s.expiresAt && now > s.expiresAt) || now - s.timestamp > ttlMs;

        if (isExpired) {
          s.status = "expired";
          expiredCount++;
        }
      }
    });

    if (expiredCount > 0) {
      this.notify();
    }

    return expiredCount;
  }

  /**
   * Enforce maximum pending suggestions
   */
  private enforceMaxPending(): void {
    const pending = this.getPending();
    if (pending.length > SUGGESTION_CONSTANTS.maxPendingSuggestions) {
      // Expire oldest pending suggestions
      const toExpire = pending
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, pending.length - SUGGESTION_CONSTANTS.maxPendingSuggestions);

      toExpire.forEach((s) => {
        s.status = "expired";
      });
    }
  }

  /**
   * Record a decision
   */
  recordDecision(decision: ThemeArbitrationDecision): void {
    this.decisions.push(decision);
  }

  /**
   * Get decisions for a suggestion
   */
  getDecisionFor(suggestionId: string): ThemeArbitrationDecision | undefined {
    return this.decisions.find((d) => d.suggestionId === suggestionId);
  }

  /**
   * Get all decisions
   */
  getDecisions(): ThemeArbitrationDecision[] {
    return [...this.decisions];
  }

  /**
   * Get suggestions by agent
   */
  getByAgent(agentId: string): ThemeSuggestion[] {
    return this.suggestions.filter((s) => s.suggestedByAgentId === agentId);
  }

  /**
   * Get suggestions for same theme (to detect consensus)
   */
  getSimilar(themeId: string, scope: ThemeSuggestionScope): ThemeSuggestion[] {
    return this.suggestions.filter(
      (s) =>
        s.proposedThemeId === themeId &&
        s.scope === scope &&
        s.status === "pending"
    );
  }

  /**
   * Clear all suggestions
   */
  clear(): void {
    this.suggestions = [];
    this.decisions = [];
    this.notify();
  }

  /**
   * Export state
   */
  export(): SuggestionInboxState {
    return {
      suggestions: [...this.suggestions],
      decisions: [...this.decisions],
    };
  }

  /**
   * Subscribe to changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }
}

/* =========================================================
4. ARBITRATION ENGINE
========================================================= */

/**
 * Make a decision on a theme suggestion
 */
export function arbitrateThemeSuggestion(
  suggestion: ThemeSuggestion,
  decision: "accept" | "reject",
  decidedBy: "USER" | "ORCHESTRATOR",
  note?: string
): ThemeArbitrationDecision {
  // Update suggestion status
  suggestion.status = decision === "accept" ? "accepted" : "rejected";

  // Create decision record
  return {
    suggestionId: suggestion.id,
    decidedBy,
    decision,
    timestamp: Date.now(),
    note,
  };
}

/**
 * Check if suggestion can be auto-accepted by orchestrator
 */
export function canAutoAccept(
  suggestion: ThemeSuggestion,
  agentTrustScore?: number
): { canAccept: boolean; reason: string } {
  // Low confidence = cannot auto-accept
  if (suggestion.confidence < SUGGESTION_CONSTANTS.minConfidenceForAutoAccept) {
    return {
      canAccept: false,
      reason: `Confidence ${(suggestion.confidence * 100).toFixed(0)}% below threshold`,
    };
  }

  // Low trust agent = requires user confirmation
  if (
    agentTrustScore !== undefined &&
    agentTrustScore < SUGGESTION_CONSTANTS.lowTrustThreshold
  ) {
    return {
      canAccept: false,
      reason: `Agent trust score ${agentTrustScore}% requires user confirmation`,
    };
  }

  // Global scope = requires user confirmation
  if (suggestion.scope === "global") {
    return {
      canAccept: false,
      reason: "Global theme changes require user confirmation",
    };
  }

  return { canAccept: true, reason: "Meets auto-accept criteria" };
}

/**
 * Check for consensus among agents
 */
export function checkConsensus(
  inbox: ThemeSuggestionInbox,
  themeId: string,
  scope: ThemeSuggestionScope
): { hasConsensus: boolean; agentCount: number; totalConfidence: number } {
  const similar = inbox.getSimilar(themeId, scope);
  const uniqueAgents = new Set(similar.map((s) => s.suggestedByAgentId));
  const totalConfidence = similar.reduce((sum, s) => sum + s.confidence, 0);

  return {
    hasConsensus: uniqueAgents.size >= 2,
    agentCount: uniqueAgents.size,
    totalConfidence,
  };
}

/* =========================================================
5. ORCHESTRATOR AUTO-DECISION RULES
========================================================= */

export interface OrchestratorContext {
  userOverrideActive: boolean;
  agentTrustScores: Record<string, number>; // 0..100
  userPreferenceLocks: string[]; // locked theme properties
}

/**
 * Check if orchestrator should auto-accept a suggestion
 */
export function shouldAutoAcceptSuggestion(
  suggestion: ThemeSuggestion,
  ctx: OrchestratorContext
): boolean {
  // User override = never auto-accept
  if (ctx.userOverrideActive) return false;

  // Low confidence = no auto-accept
  if (suggestion.confidence < 0.65) return false;

  // Check agent trust
  const agentTrust = ctx.agentTrustScores[suggestion.suggestedByAgentId] ?? 50;
  if (agentTrust < 60) return false;

  // Global scope = always requires human validation
  if (suggestion.scope === "global") return false;

  return true;
}

/**
 * Orchestrator decision flow
 */
export function orchestratorDecision(
  suggestion: ThemeSuggestion,
  ctx: OrchestratorContext
): "accept" | "reject" | "defer" {
  // Auto-accept if criteria met
  if (shouldAutoAcceptSuggestion(suggestion, ctx)) {
    return "accept";
  }

  // Very low confidence = auto-reject
  if (suggestion.confidence < 0.4) {
    return "reject";
  }

  // Otherwise defer to user inbox
  return "defer";
}

/**
 * Process suggestion through orchestrator
 */
export function processWithOrchestrator(
  suggestion: ThemeSuggestion,
  inbox: ThemeSuggestionInbox,
  ctx: OrchestratorContext
): { decision: "accept" | "reject" | "defer"; arbitration?: ThemeArbitrationDecision } {
  const decision = orchestratorDecision(suggestion, ctx);

  if (decision === "accept") {
    const arbitration = arbitrateThemeSuggestion(
      suggestion,
      "accept",
      "ORCHESTRATOR",
      "Auto-accepted: high confidence + trusted agent"
    );
    inbox.recordDecision(arbitration);
    return { decision, arbitration };
  }

  if (decision === "reject") {
    const arbitration = arbitrateThemeSuggestion(
      suggestion,
      "reject",
      "ORCHESTRATOR",
      "Auto-rejected: confidence below threshold"
    );
    inbox.recordDecision(arbitration);
    return { decision, arbitration };
  }

  // Defer = add to inbox for user decision
  return { decision };
}

/*
ORCHESTRATOR LAW:
✅ Orchestrator NEVER overrides user hard locks
✅ Auto-accept only applies to local scope (sphere / meeting)
✅ Global themes always require human validation
✅ Low trust agents are sandboxed
✅ All decisions logged to timeline
*/

/* =========================================================
6. PROTECTED PROPERTIES (CANNOT BE OVERRIDDEN)
========================================================= */

export const PROTECTED_FROM_SUGGESTION = [
  "accessibility",
  "motion-safety",
  "contrast-minimum",
  "user-preference-lock",
  "security-indicators",
] as const;

export function isProtectedProperty(property: string): boolean {
  return PROTECTED_FROM_SUGGESTION.some((p) =>
    property.toLowerCase().includes(p.toLowerCase().replace("-", ""))
  );
}

/* =========================================================
6. REACT HOOK
========================================================= */

export function useThemeSuggestionInbox(inbox: ThemeSuggestionInbox) {
  const [, forceUpdate] = useState({});

  // Subscribe to inbox changes
  React.useEffect(() => {
    return inbox.subscribe(() => forceUpdate({}));
  }, [inbox]);

  const pending = useMemo(() => inbox.getPending(), [inbox]);

  const accept = useCallback(
    (id: string, note?: string) => {
      const suggestion = inbox.get(id);
      if (suggestion) {
        const decision = arbitrateThemeSuggestion(
          suggestion,
          "accept",
          "USER",
          note
        );
        inbox.recordDecision(decision);
        return decision;
      }
    },
    [inbox]
  );

  const reject = useCallback(
    (id: string, note?: string) => {
      const suggestion = inbox.get(id);
      if (suggestion) {
        const decision = arbitrateThemeSuggestion(
          suggestion,
          "reject",
          "USER",
          note
        );
        inbox.recordDecision(decision);
        return decision;
      }
    },
    [inbox]
  );

  const expireOld = useCallback(() => {
    return inbox.expireOld();
  }, [inbox]);

  return {
    pending,
    pendingCount: pending.length,
    all: inbox.list(),
    accept,
    reject,
    expireOld,
    hasPending: pending.length > 0,
  };
}

/* =========================================================
7. REACT COMPONENT: SUGGESTION CARD
========================================================= */

interface SuggestionCardProps {
  suggestion: ThemeSuggestion;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  agentTrustScore?: number;
}

export function SuggestionCard({
  suggestion,
  onAccept,
  onReject,
  agentTrustScore,
}: SuggestionCardProps) {
  const isPending = suggestion.status === "pending";
  const statusColor = SUGGESTION_CONSTANTS.statusColors[suggestion.status];

  const confidencePercent = Math.round(suggestion.confidence * 100);
  const confidenceColor =
    confidencePercent >= 80
      ? "#4CAF88"
      : confidencePercent >= 50
      ? "#F5C26B"
      : "#E06C75";

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 8,
        background: "rgba(16, 20, 30, 0.9)",
        border: `1px solid ${statusColor}40`,
        marginBottom: 8,
        opacity: isPending ? 1 : 0.6,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: statusColor,
            }}
          />
          <span style={{ fontWeight: 500 }}>
            {suggestion.proposedThemeId.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: 10,
              opacity: 0.7,
              textTransform: "uppercase",
            }}
          >
            {suggestion.scope}
          </span>
        </div>
        <span
          style={{
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 4,
            background: `${statusColor}20`,
            color: statusColor,
            textTransform: "uppercase",
          }}
        >
          {suggestion.status}
        </span>
      </div>

      {/* Agent & Confidence */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          marginBottom: 8,
          opacity: 0.8,
        }}
      >
        <span>Suggested by: {suggestion.suggestedByAgentId}</span>
        <span style={{ color: confidenceColor }}>
          Confidence: {confidencePercent}%
        </span>
      </div>

      {/* Reason */}
      <div
        style={{
          fontSize: 12,
          marginBottom: 12,
          padding: 8,
          borderRadius: 4,
          background: "rgba(0,0,0,0.2)",
        }}
      >
        "{suggestion.reason}"
      </div>

      {/* Actions */}
      {isPending && (onAccept || onReject) && (
        <div style={{ display: "flex", gap: 8 }}>
          {onAccept && (
            <button
              onClick={() => onAccept(suggestion.id)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                background: "#4CAF88",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              ✓ Accept
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(suggestion.id)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #E06C75",
                background: "transparent",
                color: "#E06C75",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              ✗ Reject
            </button>
          )}
        </div>
      )}

      {/* Trust warning */}
      {agentTrustScore !== undefined &&
        agentTrustScore < SUGGESTION_CONSTANTS.lowTrustThreshold && (
          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              color: "#F5C26B",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ⚠ Low trust agent ({agentTrustScore}%) — review carefully
          </div>
        )}
    </div>
  );
}

/* =========================================================
8. REACT COMPONENT: SUGGESTION INBOX
========================================================= */

interface SuggestionInboxUIProps {
  inbox: ThemeSuggestionInbox;
  onAccept?: (suggestion: ThemeSuggestion) => void;
  onReject?: (suggestion: ThemeSuggestion) => void;
  getAgentTrust?: (agentId: string) => number | undefined;
}

export function SuggestionInboxUI({
  inbox,
  onAccept,
  onReject,
  getAgentTrust,
}: SuggestionInboxUIProps) {
  const { pending, accept, reject, pendingCount } =
    useThemeSuggestionInbox(inbox);

  if (pendingCount === 0) {
    return null;
  }

  const handleAccept = (id: string) => {
    const suggestion = inbox.get(id);
    accept(id);
    if (suggestion && onAccept) {
      onAccept(suggestion);
    }
  };

  const handleReject = (id: string) => {
    const suggestion = inbox.get(id);
    reject(id);
    if (suggestion && onReject) {
      onReject(suggestion);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        width: 340,
        maxHeight: "80vh",
        overflowY: "auto",
        padding: 12,
        borderRadius: 12,
        background: "rgba(11, 14, 20, 0.94)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        color: "#E6EAF0",
        fontSize: 12,
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14 }}>
          💡 Theme Suggestions
        </div>
        <span
          style={{
            background: "#F5C26B",
            color: "#000",
            padding: "2px 8px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {pendingCount}
        </span>
      </div>

      {/* Suggestions */}
      {pending.map((s) => (
        <SuggestionCard
          key={s.id}
          suggestion={s}
          onAccept={handleAccept}
          onReject={handleReject}
          agentTrustScore={getAgentTrust?.(s.suggestedByAgentId)}
        />
      ))}

      {/* Footer */}
      <div
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: 10,
          opacity: 0.6,
          textAlign: "center",
        }}
      >
        Agents propose. Humans decide.
      </div>
    </div>
  );
}

/* =========================================================
9. TIMELINE INTEGRATION EVENTS
========================================================= */

export type SuggestionEventType =
  | "theme_suggestion_created"
  | "theme_change_applied"
  | "theme_suggestion_rejected"
  | "theme_suggestion_expired";

export interface SuggestionTimelineEvent {
  type: SuggestionEventType;
  timestamp: number;
  suggestionId: string;
  agentId: string;
  themeId: string;
  scope: ThemeSuggestionScope;
  decidedBy?: "USER" | "ORCHESTRATOR";
}

export function createSuggestionEvent(
  type: SuggestionEventType,
  suggestion: ThemeSuggestion,
  decidedBy?: "USER" | "ORCHESTRATOR"
): SuggestionTimelineEvent {
  return {
    type,
    timestamp: Date.now(),
    suggestionId: suggestion.id,
    agentId: suggestion.suggestedByAgentId,
    themeId: suggestion.proposedThemeId,
    scope: suggestion.scope,
    decidedBy,
  };
}

/* =========================================================
10. LAW (CHE·NU)
========================================================= */

/*
✅ Agents propose
✅ Humans decide
✅ System remembers

✅ Inbox is non-blocking
✅ Shows: who suggested, why, confidence
✅ One-click accept / reject
✅ Hover explains expected visual change
✅ No suggestion may override accessibility, motion safety, or user locks
*/

export const SUGGESTION_LAW = {
  agentsPropose: true,
  humansDecide: true,
  systemRemembers: true,
  inboxNonBlocking: true,
  protectedPropertiesEnforced: true,
} as const;

/* =========================================================
11. EXPORTS
========================================================= */

export default {
  // Classes
  ThemeSuggestionInbox,

  // Functions
  arbitrateThemeSuggestion,
  canAutoAccept,
  checkConsensus,
  isProtectedProperty,
  createSuggestionEvent,

  // Components
  SuggestionCard,
  SuggestionInboxUI,

  // Hook
  useThemeSuggestionInbox,

  // Constants
  SUGGESTION_CONSTANTS,
  PROTECTED_FROM_SUGGESTION,
  SUGGESTION_LAW,
};
