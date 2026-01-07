// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — AGENT LEARNING LOOP + XR SPATIAL INBOX
// CANONICAL MEGA BLOCK (COPY / PASTE SAFE)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useMemo, useCallback } from "react";

/* =========================================================
SECTION A — AGENT LEARNING LOOP (FEEDBACK → TRUST → BEHAVIOR)
========================================================= */

/*
Purpose:
- Agents learn ONLY from human/orchestrator outcomes
- No self-reinforcement loops
- Learning affects:
  • confidence calibration
  • suggestion frequency
  • scope eligibility
*/

/* ==============================
1. TYPES
============================== */

export type LearningOutcome = "accepted" | "rejected" | "expired";

export interface AgentLearningEvent {
  agentId: string;
  suggestionId: string;
  outcome: LearningOutcome;
  confidenceAtSubmission: number; // 0..1
  timestamp: number;
  scope?: "global" | "sphere" | "meeting";
  decidedBy?: "USER" | "ORCHESTRATOR";
}

export interface AgentLearningProfile {
  agentId: string;
  acceptanceRate: number; // rolling
  rejectionRate: number; // rolling
  expirationRate: number; // rolling
  calibrationError: number; // |confidence - outcome|
  suggestionThrottle: number; // 0..1 (lower = fewer suggestions)
  totalSuggestions: number;
  scopeAllowance: {
    global: boolean;
    sphere: boolean;
    meeting: boolean;
  };
  lastUpdated: number;
}

/* ==============================
2. LEARNING CONSTANTS
============================== */

export const LEARNING_CONSTANTS = {
  // Rolling window size for calculations
  windowSize: 50,

  // Throttle adjustments
  penaltyReject: 0.08,
  penaltyExpired: 0.04,
  rewardAccept: 0.06,

  // Throttle bounds
  throttleMin: 0.25,
  throttleMax: 1.0,

  // Scope eligibility thresholds
  globalAcceptanceThreshold: 0.75,
  globalCalibrationThreshold: 0.2,
  sphereAcceptanceThreshold: 0.55,

  // Confidence adjustment based on calibration
  confidenceAdjustmentFactor: 0.3,
} as const;

/* ==============================
3. LEARNING UPDATE ENGINE
============================== */

/**
 * Create initial learning profile for a new agent
 */
export function createAgentLearningProfile(agentId: string): AgentLearningProfile {
  return {
    agentId,
    acceptanceRate: 0.5, // neutral starting point
    rejectionRate: 0,
    expirationRate: 0,
    calibrationError: 0.3, // moderate uncertainty
    suggestionThrottle: 0.8, // slightly below max
    totalSuggestions: 0,
    scopeAllowance: {
      global: false, // must be earned
      sphere: true,
      meeting: true,
    },
    lastUpdated: Date.now(),
  };
}

/**
 * Update agent learning profile based on recent events
 */
export function updateAgentLearningProfile(
  profile: AgentLearningProfile,
  events: AgentLearningEvent[]
): AgentLearningProfile {
  // Get recent events for this agent
  const agentEvents = events.filter((e) => e.agentId === profile.agentId);
  const recent = agentEvents.slice(-LEARNING_CONSTANTS.windowSize);

  if (recent.length === 0) {
    return profile;
  }

  // Calculate outcome rates
  const accepted = recent.filter((e) => e.outcome === "accepted").length;
  const rejected = recent.filter((e) => e.outcome === "rejected").length;
  const expired = recent.filter((e) => e.outcome === "expired").length;

  const acceptanceRate = accepted / recent.length;
  const rejectionRate = rejected / recent.length;
  const expirationRate = expired / recent.length;

  // Calculate calibration error (how well confidence predicts outcomes)
  const calibrationError =
    recent.reduce((sum, e) => {
      const actualOutcome = e.outcome === "accepted" ? 1 : 0;
      return sum + Math.abs(e.confidenceAtSubmission - actualOutcome);
    }, 0) / recent.length;

  // Adjust throttle based on outcomes
  let throttle = profile.suggestionThrottle;
  throttle += accepted * LEARNING_CONSTANTS.rewardAccept;
  throttle -= rejected * LEARNING_CONSTANTS.penaltyReject;
  throttle -= expired * LEARNING_CONSTANTS.penaltyExpired;

  // Clamp throttle to bounds
  throttle = Math.max(
    LEARNING_CONSTANTS.throttleMin,
    Math.min(LEARNING_CONSTANTS.throttleMax, throttle)
  );

  // Determine scope allowance based on performance
  const scopeAllowance = {
    global:
      acceptanceRate > LEARNING_CONSTANTS.globalAcceptanceThreshold &&
      calibrationError < LEARNING_CONSTANTS.globalCalibrationThreshold,
    sphere: acceptanceRate > LEARNING_CONSTANTS.sphereAcceptanceThreshold,
    meeting: true, // always allowed
  };

  return {
    ...profile,
    acceptanceRate,
    rejectionRate,
    expirationRate,
    calibrationError,
    suggestionThrottle: throttle,
    totalSuggestions: profile.totalSuggestions + recent.length,
    scopeAllowance,
    lastUpdated: Date.now(),
  };
}

/**
 * Adjust agent's confidence based on their calibration error
 */
export function adjustConfidenceForAgent(
  rawConfidence: number,
  profile: AgentLearningProfile
): number {
  // High calibration error = reduce displayed confidence
  const adjustment =
    1 - profile.calibrationError * LEARNING_CONSTANTS.confidenceAdjustmentFactor;
  return Math.max(0, Math.min(1, rawConfidence * adjustment));
}

/**
 * Check if agent is allowed to suggest for a given scope
 */
export function canAgentSuggestScope(
  profile: AgentLearningProfile,
  scope: "global" | "sphere" | "meeting"
): boolean {
  return profile.scopeAllowance[scope];
}

/**
 * Should agent's suggestion be throttled?
 */
export function shouldThrottleSuggestion(
  profile: AgentLearningProfile
): boolean {
  // Random throttle based on throttle value
  return Math.random() > profile.suggestionThrottle;
}

/* ==============================
4. LEARNING PROFILE MANAGER
============================== */

export class AgentLearningManager {
  private profiles: Map<string, AgentLearningProfile> = new Map();
  private events: AgentLearningEvent[] = [];
  private maxEvents: number = 10000;

  /**
   * Get or create profile for agent
   */
  getProfile(agentId: string): AgentLearningProfile {
    if (!this.profiles.has(agentId)) {
      this.profiles.set(agentId, createAgentLearningProfile(agentId));
    }
    return this.profiles.get(agentId)!;
  }

  /**
   * Record a learning event
   */
  recordEvent(event: AgentLearningEvent): void {
    this.events.push(event);

    // Enforce max events (rolling window)
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Update the agent's profile
    const profile = this.getProfile(event.agentId);
    const updated = updateAgentLearningProfile(profile, this.events);
    this.profiles.set(event.agentId, updated);
  }

  /**
   * Get all events for an agent
   */
  getEventsForAgent(agentId: string): AgentLearningEvent[] {
    return this.events.filter((e) => e.agentId === agentId);
  }

  /**
   * Get all profiles
   */
  getAllProfiles(): AgentLearningProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Export state
   */
  export(): { profiles: AgentLearningProfile[]; events: AgentLearningEvent[] } {
    return {
      profiles: this.getAllProfiles(),
      events: [...this.events],
    };
  }

  /**
   * Import state
   */
  import(data: { profiles: AgentLearningProfile[]; events: AgentLearningEvent[] }): void {
    this.profiles.clear();
    data.profiles.forEach((p) => this.profiles.set(p.agentId, p));
    this.events = [...data.events];
  }
}

/* ==============================
5. REACT HOOK
============================== */

export function useAgentLearning(manager: AgentLearningManager) {
  const [, forceUpdate] = React.useState({});

  const recordOutcome = useCallback(
    (
      agentId: string,
      suggestionId: string,
      outcome: LearningOutcome,
      confidenceAtSubmission: number,
      scope?: "global" | "sphere" | "meeting",
      decidedBy?: "USER" | "ORCHESTRATOR"
    ) => {
      manager.recordEvent({
        agentId,
        suggestionId,
        outcome,
        confidenceAtSubmission,
        timestamp: Date.now(),
        scope,
        decidedBy,
      });
      forceUpdate({});
    },
    [manager]
  );

  const getProfile = useCallback(
    (agentId: string) => manager.getProfile(agentId),
    [manager]
  );

  const canSuggest = useCallback(
    (agentId: string, scope: "global" | "sphere" | "meeting") => {
      const profile = manager.getProfile(agentId);
      return canAgentSuggestScope(profile, scope) && !shouldThrottleSuggestion(profile);
    },
    [manager]
  );

  return {
    recordOutcome,
    getProfile,
    canSuggest,
    allProfiles: manager.getAllProfiles(),
  };
}

/*
LAW — AGENT LEARNING:
✅ Agents NEVER learn from other agents
✅ Only decisions with authority count
✅ Learning modifies behavior, not power
✅ Low calibration → less confidence display
✅ Trust score integrates learning output
*/

/* =========================================================
SECTION B — XR SPATIAL THEME INBOX (IMMERSIVE UI)
========================================================= */

/*
Concept:
- Theme suggestions appear as spatial "orbs"
- Position indicates scope
- Size = confidence
- Color = agent aura
- Distance = urgency
*/

/* ==============================
6. XR INBOX TYPES
============================== */

export type XRInboxScope = "global" | "sphere" | "meeting";

export interface XRThemeSuggestionNode {
  id: string;
  agentId: string;
  themeId: string;
  scope: XRInboxScope;
  confidence: number; // 0..1
  urgency: number; // 0..1
  color: string; // agent aura color
  reason: string;
}

export interface XRSuggestionPosition {
  x: number;
  y: number;
  z: number;
  scale: number;
}

/* ==============================
7. XR SPATIAL MAPPING RULES
============================== */

/**
 * Map suggestion to 3D position in XR space
 */
export function mapSuggestionToXRPosition(
  suggestion: XRThemeSuggestionNode,
  index: number = 0,
  total: number = 1
): XRSuggestionPosition {
  // Base radius depends on scope (global = far, meeting = close)
  const baseRadius =
    suggestion.scope === "global"
      ? 3.5
      : suggestion.scope === "sphere"
      ? 2.5
      : 1.8;

  // Height based on confidence (higher confidence = higher position)
  const height = 1.0 + suggestion.confidence * 0.8;

  // Distance modified by urgency (more urgent = closer)
  const distance = baseRadius + (1 - suggestion.urgency) * 1.5;

  // Distribute suggestions in a circle if multiple
  const angle = (index / total) * Math.PI * 2 + Math.PI / 4;

  // Scale based on confidence
  const scale = 0.15 + suggestion.confidence * 0.25;

  return {
    x: Math.cos(angle) * distance,
    y: height,
    z: Math.sin(angle) * distance,
    scale,
  };
}

/**
 * Get pulse speed based on urgency
 */
export function getXRPulseSpeed(urgency: number): number {
  // Higher urgency = faster pulse (0.5s to 3s)
  return 0.5 + (1 - urgency) * 2.5;
}

/**
 * Get glow intensity based on confidence
 */
export function getXRGlowIntensity(confidence: number): number {
  return 0.3 + confidence * 0.7;
}

/* ==============================
8. XR INBOX RENDERING CONFIG
============================== */

export const XR_INBOX_CONFIG = {
  // Orb appearance
  orbGeometry: "sphere",
  orbSegments: 32,
  orbMaterial: "standard",

  // Animation
  floatAmplitude: 0.05,
  floatSpeed: 1.0,
  pulseMin: 0.8,
  pulseMax: 1.2,

  // Interaction
  hoverScale: 1.3,
  selectAnimation: "merge",
  rejectAnimation: "fade",

  // Colors by scope
  scopeOutlineColors: {
    global: "#E06C75",
    sphere: "#F5C26B",
    meeting: "#4CAF88",
  },
} as const;

/* ==============================
9. XR SUGGESTION COMPONENT (React Three Fiber concept)
============================== */

interface XRSuggestionOrbProps {
  suggestion: XRThemeSuggestionNode;
  position: XRSuggestionPosition;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

// Pseudo-component for React Three Fiber
export const XRSuggestionOrbConfig = {
  render: (props: XRSuggestionOrbProps) => ({
    // Mesh configuration for R3F
    position: [props.position.x, props.position.y, props.position.z],
    scale: props.position.scale,
    geometry: { type: "sphere", args: [1, 32, 32] },
    material: {
      type: "standard",
      color: props.suggestion.color,
      emissive: props.suggestion.color,
      emissiveIntensity: getXRGlowIntensity(props.suggestion.confidence),
      transparent: true,
      opacity: 0.9,
    },
    animation: {
      float: {
        amplitude: XR_INBOX_CONFIG.floatAmplitude,
        speed: XR_INBOX_CONFIG.floatSpeed,
      },
      pulse: {
        speed: getXRPulseSpeed(props.suggestion.urgency),
        min: XR_INBOX_CONFIG.pulseMin,
        max: XR_INBOX_CONFIG.pulseMax,
      },
    },
    interaction: {
      onPointerOver: () => props.onHover?.(true),
      onPointerOut: () => props.onHover?.(false),
      onClick: props.onSelect,
    },
    outline: {
      color: XR_INBOX_CONFIG.scopeOutlineColors[props.suggestion.scope],
      width: 2,
    },
  }),
};

/* ==============================
10. XR INBOX MANAGER
============================== */

export class XRThemeInboxManager {
  private suggestions: XRThemeSuggestionNode[] = [];

  add(suggestion: XRThemeSuggestionNode): void {
    this.suggestions.push(suggestion);
  }

  remove(id: string): void {
    this.suggestions = this.suggestions.filter((s) => s.id !== id);
  }

  getAll(): XRThemeSuggestionNode[] {
    return [...this.suggestions];
  }

  getPositions(): Array<{ suggestion: XRThemeSuggestionNode; position: XRSuggestionPosition }> {
    const total = this.suggestions.length;
    return this.suggestions.map((s, i) => ({
      suggestion: s,
      position: mapSuggestionToXRPosition(s, i, total),
    }));
  }

  clear(): void {
    this.suggestions = [];
  }
}

/* ==============================
11. XR INTERACTION RULES
============================== */

/*
XR Interaction:
✅ Grab / point / gaze selectable
✅ Hover shows: agent, reason, confidence
✅ Accept animates merge into environment
✅ Reject fades + logs learning event
✅ No background dim → non-intrusive
*/

export const XR_INTERACTION_RULES = {
  selectionMethods: ["grab", "point", "gaze"],
  hoverInfo: ["agent", "reason", "confidence", "scope"],
  acceptAnimation: "merge-into-environment",
  rejectAnimation: "fade-with-particles",
  backgroundDim: false,
  blocking: false,
} as const;

/*
LAW — XR INBOX:
- XR Inbox is Optional
- XR Inbox is Readable
- XR Inbox is Non-blocking
- XR does NOT increase agent authority
- XR increases human understanding
*/

/* =========================================================
SECTION C — INTEGRATION SUMMARY
========================================================= */

/*
FLOW:
1. Agent suggests →
2. Suggestion enters Inbox →
3. User / Orchestrator decides →
4. Decision logged →
5. Agent Learning updated →
6. Trust & throttle adjusted →
7. Future suggestions improve

XR Inbox:
- Shows proposals spatially
- Teaches system behavior visually
- Reinforces human-in-the-loop philosophy
*/

/* =========================================================
12. CHE·NU CORE PRINCIPLE
========================================================= */

export const LEARNING_LAW = {
  // Core principles
  learningWithoutAuthority: true,
  intelligenceWithoutDomination: true,
  clarityWithoutOverload: true,

  // Agent learning rules
  agentsNeverLearnFromAgents: true,
  onlyAuthorityDecisionsCount: true,
  learningModifiesBehaviorNotPower: true,
  lowCalibrationReducesConfidenceDisplay: true,
  trustIntegratesLearningOutput: true,

  // XR rules
  xrIsOptional: true,
  xrIsReadable: true,
  xrIsNonBlocking: true,
  xrDoesNotIncreaseAgentAuthority: true,
  xrIncreasesHumanUnderstanding: true,
} as const;

/*
"Learning without authority.
Intelligence without domination.
Clarity without overload."
*/

/* =========================================================
13. EXPORTS
========================================================= */

export default {
  // Learning Profile
  createAgentLearningProfile,
  updateAgentLearningProfile,
  adjustConfidenceForAgent,
  canAgentSuggestScope,
  shouldThrottleSuggestion,

  // Manager
  AgentLearningManager,

  // Hook
  useAgentLearning,

  // XR
  mapSuggestionToXRPosition,
  getXRPulseSpeed,
  getXRGlowIntensity,
  XRThemeInboxManager,
  XRSuggestionOrbConfig,

  // Constants
  LEARNING_CONSTANTS,
  XR_INBOX_CONFIG,
  XR_INTERACTION_RULES,
  LEARNING_LAW,
};
