// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — THEME CONFLICT DETECTOR + THEME TIMELINE REPLAY
// CANONICAL BLOCK — COPY / PASTE SAFE (Claude / Copilot)
// ═══════════════════════════════════════════════════════════════════════════════

/* =========================================================
1. CORE CONCEPT
---------------------------------------------------------
- Detect visual / semantic conflicts between themes
- Log them deterministically
- Replay the evolution of themes over time (meetings, tasks)
- Explain WHY a conflict occurred (not just that it did)

Themes are subject to LAW.
Conflicts are NOT errors — they are signals.
========================================================= */

/* =========================================================
2. TYPES
========================================================= */

export type ThemeLevel =
  | "global"
  | "sphere"
  | "meeting"
  | "agent"
  | "overlay";

export type ConflictSeverity =
  | "info"
  | "warning"
  | "critical";

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
  }[];
  reason: string;
  autoResolved: boolean;
}

export interface ThemeTimeline {
  sessionId: string;
  snapshots: ThemeStateSnapshot[];
  conflicts: ThemeConflict[];
}

/* =========================================================
3. CONFLICT DETECTION RULES (IMMUTABLE)
========================================================= */

export const THEME_CONFLICT_RULES = {
  // Variables that CANNOT be overridden by lower-level themes
  forbiddenOverrides: [
    "--text-primary",
    "--contrast-min",
    "--motion-safety",
    "--accessibility-mode",
    "--security-indicator",
    "--data-visibility",
  ],

  // Order of authority (lower index = higher authority)
  dominanceOrder: [
    "global",
    "sphere",
    "meeting",
    "agent",
    "overlay",
  ] as ThemeLevel[],

  // Maximum allowed weights per level
  maxWeights: {
    global: 0.2,
    sphere: 0.5,
    meeting: 0.9,
    agent: 0.4,
    overlay: 1.0,
  } as Record<ThemeLevel, number>,

  // Variables that can only be set by specific levels
  exclusiveVariables: {
    global: ["--motion-safety", "--accessibility-mode"],
    sphere: ["--sphere-accent"],
    meeting: ["--meeting-lighting", "--meeting-ambiance"],
    agent: ["--agent-glow", "--agent-aura"],
    overlay: ["--overlay-dimming"],
  } as Record<ThemeLevel, string[]>,
};

/* =========================================================
4. CONFLICT DETECTOR ENGINE
========================================================= */

export function detectThemeConflicts(
  snapshot: ThemeStateSnapshot
): ThemeConflict[] {
  const conflicts: ThemeConflict[] = [];
  const variableOwners: Record<string, typeof snapshot.activeThemes> = {};

  // Map which themes are trying to set which variables
  snapshot.activeThemes.forEach((theme) => {
    Object.keys(snapshot.resolvedVariables).forEach((variable) => {
      if (!variableOwners[variable]) {
        variableOwners[variable] = [];
      }
      variableOwners[variable].push(theme);
    });
  });

  // Check each variable for conflicts
  Object.entries(variableOwners).forEach(([variable, themes]) => {
    // Single owner = no conflict
    if (themes.length <= 1) return;

    // Check forbidden overrides
    const isForbidden = THEME_CONFLICT_RULES.forbiddenOverrides.includes(variable);

    // Check weight violations
    const overweightTheme = themes.find(
      (t) => t.weight > THEME_CONFLICT_RULES.maxWeights[t.level]
    );

    // Check exclusive variable violations
    const exclusiveViolation = themes.find((t) => {
      const exclusiveFor = Object.entries(THEME_CONFLICT_RULES.exclusiveVariables)
        .find(([_, vars]) => vars.includes(variable));
      return exclusiveFor && exclusiveFor[0] !== t.level;
    });

    // Check dominance order violations
    const dominanceViolation = checkDominanceViolation(themes, variable);

    if (isForbidden) {
      conflicts.push(createConflict(
        variable,
        themes,
        "critical",
        "Forbidden variable override attempted - protected by accessibility/security law",
        true
      ));
    } else if (overweightTheme) {
      conflicts.push(createConflict(
        variable,
        themes,
        "warning",
        `Theme '${overweightTheme.themeId}' weight (${overweightTheme.weight}) exceeds maximum for ${overweightTheme.level} level (${THEME_CONFLICT_RULES.maxWeights[overweightTheme.level]})`,
        true
      ));
    } else if (exclusiveViolation) {
      conflicts.push(createConflict(
        variable,
        themes,
        "warning",
        `Variable '${variable}' is exclusive to another theme level`,
        true
      ));
    } else if (dominanceViolation) {
      conflicts.push(createConflict(
        variable,
        themes,
        "info",
        dominanceViolation,
        true
      ));
    }
  });

  return conflicts;
}

function createConflict(
  variable: string,
  themes: ThemeStateSnapshot["activeThemes"],
  severity: ConflictSeverity,
  reason: string,
  autoResolved: boolean
): ThemeConflict {
  return {
    id: `conflict-${variable}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    severity,
    variable,
    competingThemes: themes,
    reason,
    autoResolved,
  };
}

function checkDominanceViolation(
  themes: ThemeStateSnapshot["activeThemes"],
  variable: string
): string | null {
  const sorted = [...themes].sort(
    (a, b) =>
      THEME_CONFLICT_RULES.dominanceOrder.indexOf(a.level) -
      THEME_CONFLICT_RULES.dominanceOrder.indexOf(b.level)
  );

  // Check if a lower-authority theme has higher weight than a higher-authority theme
  for (let i = 0; i < sorted.length - 1; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[j].weight > sorted[i].weight) {
        return `Lower-authority theme '${sorted[j].themeId}' (${sorted[j].level}) has higher weight than '${sorted[i].themeId}' (${sorted[i].level}) for variable '${variable}'`;
      }
    }
  }

  return null;
}

/* =========================================================
5. THEME TIMELINE RECORDER
========================================================= */

export class ThemeTimelineRecorder {
  private timeline: ThemeTimeline;
  private maxSnapshots: number;

  constructor(sessionId: string, maxSnapshots: number = 1000) {
    this.timeline = {
      sessionId,
      snapshots: [],
      conflicts: [],
    };
    this.maxSnapshots = maxSnapshots;
  }

  /**
   * Record a new snapshot and detect conflicts
   */
  record(snapshot: ThemeStateSnapshot): ThemeConflict[] {
    // Enforce max snapshots (rolling window)
    if (this.timeline.snapshots.length >= this.maxSnapshots) {
      this.timeline.snapshots.shift();
    }

    this.timeline.snapshots.push(snapshot);

    const detected = detectThemeConflicts(snapshot);
    this.timeline.conflicts.push(...detected);

    return detected;
  }

  /**
   * Get snapshot at specific index
   */
  getSnapshot(index: number): ThemeStateSnapshot | undefined {
    return this.timeline.snapshots[index];
  }

  /**
   * Get snapshots in time range
   */
  getSnapshotsInRange(startTime: number, endTime: number): ThemeStateSnapshot[] {
    return this.timeline.snapshots.filter(
      (s) => s.timestamp >= startTime && s.timestamp <= endTime
    );
  }

  /**
   * Get conflicts by severity
   */
  getConflictsBySeverity(severity: ConflictSeverity): ThemeConflict[] {
    return this.timeline.conflicts.filter((c) => c.severity === severity);
  }

  /**
   * Get conflicts for a specific variable
   */
  getConflictsForVariable(variable: string): ThemeConflict[] {
    return this.timeline.conflicts.filter((c) => c.variable === variable);
  }

  /**
   * Export the entire timeline
   */
  export(): ThemeTimeline {
    return { ...this.timeline };
  }

  /**
   * Export as JSON string
   */
  exportJSON(): string {
    return JSON.stringify(this.timeline, null, 2);
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalSnapshots: this.timeline.snapshots.length,
      totalConflicts: this.timeline.conflicts.length,
      conflictsByLevel: {
        info: this.timeline.conflicts.filter((c) => c.severity === "info").length,
        warning: this.timeline.conflicts.filter((c) => c.severity === "warning").length,
        critical: this.timeline.conflicts.filter((c) => c.severity === "critical").length,
      },
      sessionDuration:
        this.timeline.snapshots.length > 0
          ? this.timeline.snapshots[this.timeline.snapshots.length - 1].timestamp -
            this.timeline.snapshots[0].timestamp
          : 0,
    };
  }

  /**
   * Clear all data
   */
  clear() {
    this.timeline.snapshots = [];
    this.timeline.conflicts = [];
  }
}

/* =========================================================
6. TIMELINE REPLAY (READ-ONLY)
========================================================= */

export interface ReplayControls {
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (index: number) => void;
  setSpeed: (speed: number) => void;
  isPlaying: () => boolean;
  getCurrentIndex: () => number;
}

export function replayThemeTimeline(
  timeline: ThemeTimeline,
  onFrame: (snapshot: ThemeStateSnapshot, index: number) => void,
  onConflict?: (conflict: ThemeConflict) => void,
  speed: number = 1
): ReplayControls {
  let currentIndex = 0;
  let playing = true;
  let currentSpeed = speed;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function step() {
    if (!playing || currentIndex >= timeline.snapshots.length) {
      return;
    }

    const snapshot = timeline.snapshots[currentIndex];
    onFrame(snapshot, currentIndex);

    // Check for conflicts at this timestamp
    if (onConflict) {
      timeline.conflicts
        .filter((c) => c.timestamp === snapshot.timestamp)
        .forEach(onConflict);
    }

    currentIndex++;

    if (currentIndex < timeline.snapshots.length) {
      const nextSnapshot = timeline.snapshots[currentIndex];
      const delay = (nextSnapshot.timestamp - snapshot.timestamp) / currentSpeed;
      timeoutId = setTimeout(step, Math.max(delay, 16)); // Min 16ms (60fps)
    }
  }

  // Start playback
  step();

  return {
    pause: () => {
      playing = false;
      if (timeoutId) clearTimeout(timeoutId);
    },
    resume: () => {
      if (!playing) {
        playing = true;
        step();
      }
    },
    stop: () => {
      playing = false;
      currentIndex = 0;
      if (timeoutId) clearTimeout(timeoutId);
    },
    seek: (index: number) => {
      currentIndex = Math.max(0, Math.min(index, timeline.snapshots.length - 1));
      if (timeline.snapshots[currentIndex]) {
        onFrame(timeline.snapshots[currentIndex], currentIndex);
      }
    },
    setSpeed: (newSpeed: number) => {
      currentSpeed = Math.max(0.1, Math.min(10, newSpeed));
    },
    isPlaying: () => playing,
    getCurrentIndex: () => currentIndex,
  };
}

/* =========================================================
7. REACT HOOK FOR REPLAY
========================================================= */

import { useState, useCallback, useRef, useEffect } from "react";

export function useThemeTimelineReplay(timeline: ThemeTimeline | null) {
  const [currentSnapshot, setCurrentSnapshot] = useState<ThemeStateSnapshot | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conflicts, setConflicts] = useState<ThemeConflict[]>([]);
  const controlsRef = useRef<ReplayControls | null>(null);

  const play = useCallback(() => {
    if (!timeline) return;

    controlsRef.current = replayThemeTimeline(
      timeline,
      (snapshot, index) => {
        setCurrentSnapshot(snapshot);
        setCurrentIndex(index);
      },
      (conflict) => {
        setConflicts((prev) => [...prev, conflict]);
      }
    );
    setIsPlaying(true);
  }, [timeline]);

  const pause = useCallback(() => {
    controlsRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    controlsRef.current?.resume();
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    controlsRef.current?.stop();
    setIsPlaying(false);
    setCurrentIndex(0);
    setConflicts([]);
  }, []);

  const seek = useCallback((index: number) => {
    controlsRef.current?.seek(index);
  }, []);

  const setSpeed = useCallback((speed: number) => {
    controlsRef.current?.setSpeed(speed);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  return {
    currentSnapshot,
    currentIndex,
    isPlaying,
    conflicts,
    totalSnapshots: timeline?.snapshots.length ?? 0,
    play,
    pause,
    resume,
    stop,
    seek,
    setSpeed,
  };
}

/* =========================================================
8. XR / UI VISUAL SEMANTICS (IMPORTANT)
========================================================= */

/*
- Conflicts are shown as:
  • Pulsing outline on offending agent or room
  • Timeline markers (yellow = warning, red = critical)
- Replay mode is READ-ONLY
- User can pause, scrub, compare snapshots
- Conflicts always explain themselves (reason field)

Visual Mapping:
- info     → subtle blue marker, no pulse
- warning  → yellow outline, slow pulse
- critical → red outline, fast pulse, audio cue
*/

export const CONFLICT_VISUAL_CONFIG = {
  info: {
    color: "#5DA9FF",
    pulseSpeed: 0,
    outlineWidth: 1,
    audioCue: false,
  },
  warning: {
    color: "#F5C26B",
    pulseSpeed: 2000, // ms
    outlineWidth: 2,
    audioCue: false,
  },
  critical: {
    color: "#E06C75",
    pulseSpeed: 800, // ms
    outlineWidth: 3,
    audioCue: true,
  },
};

/* =========================================================
9. GOVERNANCE RULES
========================================================= */

/*
✅ Conflicts NEVER break rendering
✅ All conflicts logged immutably
✅ Auto-resolve prefers higher authority theme
✅ Agent-caused conflicts reduce future authority score
✅ Timeline is exportable (PDF / XR / Investor replay)
*/

export const GOVERNANCE_RULES = {
  conflictsNeverBreakRendering: true,
  conflictsLoggedImmutably: true,
  autoResolvePreference: "higher-authority",
  agentConflictPenalty: true,
  exportFormats: ["json", "pdf", "xr-replay"],
} as const;

/* =========================================================
10. SUMMARY (CHE·NU LAW)
========================================================= */

/*
Structure is frozen.
Behavior is observed.
Conflicts teach the system.
History explains decisions.
*/

export default {
  detectThemeConflicts,
  ThemeTimelineRecorder,
  replayThemeTimeline,
  useThemeTimelineReplay,
  THEME_CONFLICT_RULES,
  CONFLICT_VISUAL_CONFIG,
  GOVERNANCE_RULES,
};
