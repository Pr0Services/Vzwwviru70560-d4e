// ═══════════════════════════════════════════════════════════════════════════════
// useCheNuTheme.ts
// React Hook – Canonical Theme Engine for CHE·NU
// ✅ One hook to rule themes (2D, 3D, XR)
// ✅ Driven by JSON config
// ✅ Safe for Copilot / Claude ingestion
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useState } from "react";

/* ==============================
   Types
============================== */

export type CheNuThemeId =
  | "calm"
  | "focus"
  | "analysis"
  | "executive";

export interface CheNuTheme {
  id: CheNuThemeId;
  label: string;
  purpose: string;
  visual: Record<string, any>;
  layout: Record<string, any>;
  motion: Record<string, any>;
  agents: {
    visibility: string;
    tone: string;
    maxSimultaneousAgents: number;
  };
}

export interface CheNuThemeConfig {
  cheNuThemeConfigVersion: string;
  globalRules: {
    structureImmutable: boolean;
    instantSwitch: boolean;
    agentMaySuggest: boolean;
    agentMayForce: boolean;
    xrInherits2DTheme: boolean;
    autoSwitchOnStress: boolean;
  };
  themes: Record<CheNuThemeId, CheNuTheme>;
  autoSwitchRules: {
    stressDetected: CheNuThemeId[];
    taskExecution: CheNuThemeId;
    analysisPhase: CheNuThemeId;
    decisionPhase: CheNuThemeId;
  };
}

/* ==============================
   Context Signals (input)
============================== */

export type CheNuContextSignal =
  | "idle"
  | "stress"
  | "task"
  | "analysis"
  | "decision";

/* ==============================
   Hook
============================== */

export function useCheNuTheme(
  config: CheNuThemeConfig,
  context: CheNuContextSignal
) {
  const [currentTheme, setCurrentTheme] = useState<CheNuThemeId>("calm");

  /* === Auto-switch logic === */
  useEffect(() => {
    if (!config.globalRules.autoSwitchOnStress) return;

    switch (context) {
      case "stress":
        setCurrentTheme(config.autoSwitchRules.stressDetected[0]);
        break;

      case "task":
        setCurrentTheme(config.autoSwitchRules.taskExecution);
        break;

      case "analysis":
        setCurrentTheme(config.autoSwitchRules.analysisPhase);
        break;

      case "decision":
        setCurrentTheme(config.autoSwitchRules.decisionPhase);
        break;

      default:
        break;
    }
  }, [context, config]);

  /* === Resolved theme === */
  const theme = useMemo(() => {
    return config.themes[currentTheme];
  }, [currentTheme, config]);

  /* === Public API === */
  return {
    themeId: currentTheme,
    theme,
    setTheme: (id: CheNuThemeId) => {
      if (config.globalRules.structureImmutable) {
        setCurrentTheme(id);
      }
    },
    motionEnabled: theme.motion.enabled,
    agentVisibility: theme.agents.visibility,
    agentTone: theme.agents.tone
  };
}

/* ==============================
   Usage Example (React)
============================== */

/*
const { theme, themeId } = useCheNuTheme(themeConfig, "analysis");

<div
  style={{
    background: theme.visual.background.primary,
    color: theme.visual.text.primary,
  }}
>
  Active theme: {theme.label}
</div>
*/

export default useCheNuTheme;
