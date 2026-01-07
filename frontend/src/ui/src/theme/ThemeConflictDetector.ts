// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — THEME CONFLICT DETECTOR + TIMELINE REPLAY
// CANONICAL BLOCK — COPY/PASTE SAFE
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';

/* =========================================================
   1. TYPES
========================================================= */

export type ThemeLevel = 'global' | 'sphere' | 'meeting' | 'agent' | 'overlay';
export type ConflictSeverity = 'info' | 'warning' | 'critical';

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

export interface ThemeTimelineEvent {
  id: string;
  timestamp: number;
  type: 'apply' | 'blend' | 'override' | 'reset' | 'conflict';
  level: ThemeLevel;
  themeId: string;
  variables: Record<string, string>;
  source: string;
  conflict?: ThemeConflict;
}

export interface TimelineSnapshot {
  timestamp: number;
  activeThemes: Map<ThemeLevel, string>;
  computedVariables: Record<string, string>;
  conflicts: ThemeConflict[];
}

/* =========================================================
   2. CONFLICT RULES (IMMUTABLE)
========================================================= */

export const THEME_CONFLICT_RULES = {
  // Priority weights per level (higher = wins)
  LEVEL_WEIGHTS: {
    global: 0.1,
    sphere: 0.4,
    meeting: 0.8,
    agent: 0.3,
    overlay: 1.0,
  } as const,

  // Variables that cannot be overridden
  PROTECTED_VARIABLES: [
    '--governance-indicator-color',
    '--human-decision-highlight',
    '--safety-warning-color',
  ] as const,

  // Maximum blend depth
  MAX_BLEND_DEPTH: 4,

  // Auto-resolve threshold (if weight diff > this, auto-resolve)
  AUTO_RESOLVE_THRESHOLD: 0.3,
} as const;

/* =========================================================
   3. CONFLICT DETECTION
========================================================= */

export function detectThemeConflicts(
  currentThemes: Map<ThemeLevel, { themeId: string; variables: Record<string, string> }>,
  newTheme: { level: ThemeLevel; themeId: string; variables: Record<string, string> }
): ThemeConflict[] {
  const conflicts: ThemeConflict[] = [];
  const newWeight = THEME_CONFLICT_RULES.LEVEL_WEIGHTS[newTheme.level];

  for (const [existingLevel, existing] of currentThemes) {
    if (existingLevel === newTheme.level) continue;

    const existingWeight = THEME_CONFLICT_RULES.LEVEL_WEIGHTS[existingLevel];
    
    // Find overlapping variables
    const overlapping = Object.keys(newTheme.variables).filter(
      key => key in existing.variables && newTheme.variables[key] !== existing.variables[key]
    );

    for (const variable of overlapping) {
      // Check if protected
      if (THEME_CONFLICT_RULES.PROTECTED_VARIABLES.includes(variable as any)) {
        conflicts.push({
          id: `conflict-${Date.now()}-${variable}`,
          timestamp: Date.now(),
          severity: 'critical',
          variable,
          competingThemes: [
            { level: existingLevel, themeId: existing.themeId, weight: existingWeight },
            { level: newTheme.level, themeId: newTheme.themeId, weight: newWeight },
          ],
          reason: `Protected variable "${variable}" cannot be overridden`,
          autoResolved: false,
        });
        continue;
      }

      // Determine severity based on weight difference
      const weightDiff = Math.abs(newWeight - existingWeight);
      const severity: ConflictSeverity = 
        weightDiff > THEME_CONFLICT_RULES.AUTO_RESOLVE_THRESHOLD ? 'info' :
        weightDiff > 0.1 ? 'warning' : 'critical';

      conflicts.push({
        id: `conflict-${Date.now()}-${variable}`,
        timestamp: Date.now(),
        severity,
        variable,
        competingThemes: [
          { level: existingLevel, themeId: existing.themeId, weight: existingWeight },
          { level: newTheme.level, themeId: newTheme.themeId, weight: newWeight },
        ],
        reason: `Variable "${variable}" has conflicting values`,
        autoResolved: weightDiff > THEME_CONFLICT_RULES.AUTO_RESOLVE_THRESHOLD,
      });
    }
  }

  return conflicts;
}

/* =========================================================
   4. TIMELINE RECORDER
========================================================= */

export class ThemeTimelineRecorder {
  private events: ThemeTimelineEvent[] = [];
  private snapshots: TimelineSnapshot[] = [];
  private maxEvents = 1000;

  record(event: Omit<ThemeTimelineEvent, 'id' | 'timestamp'>): ThemeTimelineEvent {
    const fullEvent: ThemeTimelineEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
    };

    this.events.push(fullEvent);

    // Trim if too many events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    return fullEvent;
  }

  snapshot(
    activeThemes: Map<ThemeLevel, string>,
    computedVariables: Record<string, string>,
    conflicts: ThemeConflict[]
  ): TimelineSnapshot {
    const snap: TimelineSnapshot = {
      timestamp: Date.now(),
      activeThemes: new Map(activeThemes),
      computedVariables: { ...computedVariables },
      conflicts: [...conflicts],
    };
    this.snapshots.push(snap);
    return snap;
  }

  getEvents(since?: number): ThemeTimelineEvent[] {
    if (since === undefined) return [...this.events];
    return this.events.filter(e => e.timestamp >= since);
  }

  getSnapshots(): TimelineSnapshot[] {
    return [...this.snapshots];
  }

  findSnapshotAt(timestamp: number): TimelineSnapshot | null {
    // Find the snapshot closest to (but not after) the timestamp
    let closest: TimelineSnapshot | null = null;
    for (const snap of this.snapshots) {
      if (snap.timestamp <= timestamp) {
        closest = snap;
      } else {
        break;
      }
    }
    return closest;
  }

  clear(): void {
    this.events = [];
    this.snapshots = [];
  }
}

/* =========================================================
   5. TIMELINE REPLAY
========================================================= */

export interface ReplayControls {
  play: () => void;
  pause: () => void;
  seekTo: (timestamp: number) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
}

export interface ReplayState {
  isPlaying: boolean;
  currentTime: number;
  speed: number;
  currentSnapshot: TimelineSnapshot | null;
  eventsAtTime: ThemeTimelineEvent[];
}

export function replayThemeTimeline(
  recorder: ThemeTimelineRecorder,
  onUpdate: (state: ReplayState) => void
): ReplayControls {
  let isPlaying = false;
  let currentTime = 0;
  let speed = 1;
  let animationFrame: number | null = null;
  let lastRealTime = 0;

  const events = recorder.getEvents();
  const snapshots = recorder.getSnapshots();

  if (events.length === 0) {
    return {
      play: () => {},
      pause: () => {},
      seekTo: () => {},
      setSpeed: () => {},
      reset: () => {},
    };
  }

  const startTime = events[0].timestamp;
  const endTime = events[events.length - 1].timestamp;

  function update() {
    const snapshot = recorder.findSnapshotAt(currentTime);
    const eventsAtTime = events.filter(e => 
      e.timestamp >= currentTime - 1000 && e.timestamp <= currentTime
    );

    onUpdate({
      isPlaying,
      currentTime,
      speed,
      currentSnapshot: snapshot,
      eventsAtTime,
    });
  }

  function tick(realTime: number) {
    if (!isPlaying) return;

    const delta = (realTime - lastRealTime) * speed;
    lastRealTime = realTime;
    currentTime += delta;

    if (currentTime >= endTime) {
      currentTime = endTime;
      isPlaying = false;
    }

    update();

    if (isPlaying) {
      animationFrame = requestAnimationFrame(tick);
    }
  }

  return {
    play() {
      if (currentTime >= endTime) {
        currentTime = startTime;
      }
      isPlaying = true;
      lastRealTime = performance.now();
      animationFrame = requestAnimationFrame(tick);
    },

    pause() {
      isPlaying = false;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      update();
    },

    seekTo(timestamp: number) {
      currentTime = Math.max(startTime, Math.min(endTime, timestamp));
      update();
    },

    setSpeed(newSpeed: number) {
      speed = Math.max(0.1, Math.min(10, newSpeed));
      update();
    },

    reset() {
      isPlaying = false;
      currentTime = startTime;
      speed = 1;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      update();
    },
  };
}

/* =========================================================
   6. REACT HOOK: useThemeTimelineReplay
========================================================= */

export function useThemeTimelineReplay(recorder: ThemeTimelineRecorder) {
  const [state, setState] = useState<ReplayState>({
    isPlaying: false,
    currentTime: 0,
    speed: 1,
    currentSnapshot: null,
    eventsAtTime: [],
  });

  const controlsRef = useRef<ReplayControls | null>(null);

  useEffect(() => {
    controlsRef.current = replayThemeTimeline(recorder, setState);
    return () => {
      controlsRef.current?.pause();
    };
  }, [recorder]);

  return {
    state,
    play: () => controlsRef.current?.play(),
    pause: () => controlsRef.current?.pause(),
    seekTo: (ts: number) => controlsRef.current?.seekTo(ts),
    setSpeed: (s: number) => controlsRef.current?.setSpeed(s),
    reset: () => controlsRef.current?.reset(),
  };
}

/* =========================================================
   7. VISUAL CONFLICT CONFIG
========================================================= */

export const CONFLICT_VISUAL_CONFIG = {
  // Colors for conflict severity
  SEVERITY_COLORS: {
    info: '#60a5fa',      // Blue
    warning: '#fbbf24',   // Yellow
    critical: '#ef4444',  // Red
  },

  // Icons
  SEVERITY_ICONS: {
    info: 'ℹ️',
    warning: '⚠️',
    critical: '🚨',
  },

  // Animation
  CONFLICT_PULSE_DURATION: 2000,
  CONFLICT_HIGHLIGHT_OPACITY: 0.3,

  // XR specific
  XR_CONFLICT_GLOW_INTENSITY: 0.8,
  XR_CONFLICT_PARTICLE_COUNT: 50,
} as const;

/* =========================================================
   8. GOVERNANCE RULES
========================================================= */

export const GOVERNANCE_RULES = {
  // Theme changes require human approval if:
  REQUIRE_APPROVAL: {
    protectedVariables: true,
    criticalConflicts: true,
    globalLevelChanges: true,
  },

  // Theme changes are logged:
  AUDIT_LEVEL: 'full' as const, // 'minimal' | 'standard' | 'full'

  // Maximum theme changes per minute (rate limiting)
  MAX_CHANGES_PER_MINUTE: 10,

  // Cooldown after critical conflict (ms)
  CRITICAL_CONFLICT_COOLDOWN: 5000,
} as const;

/* =========================================================
   9. EXPORTS
========================================================= */

export default {
  THEME_CONFLICT_RULES,
  CONFLICT_VISUAL_CONFIG,
  GOVERNANCE_RULES,
  detectThemeConflicts,
  ThemeTimelineRecorder,
  replayThemeTimeline,
  useThemeTimelineReplay,
};
