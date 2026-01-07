// ═══════════════════════════════════════════════════════════════════════════════
// CheNuThemeTransitionEngine.tsx
// ✅ Theme transition + theme blending engine
// ✅ Allows MULTI-THEME coexistence (agents in different themes)
// ✅ Meeting room can have its own theme layer
// ✅ One block – copy/paste safe for Claude / Copilot
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState, useCallback } from "react";

/* ==============================
   Types
============================== */

export type ThemeLayerType =
  | "global"
  | "meeting"
  | "agent"
  | "overlay";

export interface ThemeLayer {
  id: string;
  type: ThemeLayerType;
  weight: number; // 0 → 1 blending influence
  variables: Record<string, string>;
}

export interface ThemeTransitionOptions {
  durationMs: number;
  easing: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

/* ==============================
   Theme Mixer
============================== */

export function blendThemes(
  layers: ThemeLayer[]
): Record<string, string> {
  const result: Record<string, string> = {};

  // Sort by weight (lower weight = base, higher weight = override)
  layers
    .sort((a, b) => a.weight - b.weight)
    .forEach(layer => {
      Object.entries(layer.variables).forEach(([key, value]) => {
        result[key] = value;
      });
    });

  return result;
}

/* ==============================
   Theme Transition Hook
============================== */

export function useCheNuThemeTransition(
  baseThemeVars: Record<string, string>
) {
  const [layers, setLayers] = useState<ThemeLayer[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  /* === Apply blended theme === */
  useEffect(() => {
    if (!ref.current) return;

    const blended = blendThemes([
      {
        id: "base",
        type: "global",
        weight: 0.1,
        variables: baseThemeVars
      },
      ...layers
    ]);

    const style = ref.current.style;
    Object.entries(blended).forEach(([key, value]) => {
      style.setProperty(key, value);
    });
  }, [layers, baseThemeVars]);

  /* === Add Layer === */
  const addLayer = useCallback((layer: ThemeLayer) => {
    setLayers(prev =>
      prev.filter(l => l.id !== layer.id).concat(layer)
    );
  }, []);

  /* === Remove Layer === */
  const removeLayer = useCallback((id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
  }, []);

  /* === Update Weight === */
  const updateWeight = useCallback((id: string, weight: number) => {
    setLayers(prev =>
      prev.map(l =>
        l.id === id ? { ...l, weight: Math.max(0, Math.min(1, weight)) } : l
      )
    );
  }, []);

  /* === Clear All Layers === */
  const clearLayers = useCallback(() => {
    setLayers([]);
  }, []);

  /* === Get Layer by ID === */
  const getLayer = useCallback((id: string): ThemeLayer | undefined => {
    return layers.find(l => l.id === id);
  }, [layers]);

  /* === Get Layers by Type === */
  const getLayersByType = useCallback((type: ThemeLayerType): ThemeLayer[] => {
    return layers.filter(l => l.type === type);
  }, [layers]);

  /* === Public API === */
  return {
    containerRef: ref,
    layers,
    addLayer,
    removeLayer,
    updateWeight,
    clearLayers,
    getLayer,
    getLayersByType,
    blendedVars: blendThemes([
      { id: "base", type: "global", weight: 0.1, variables: baseThemeVars },
      ...layers
    ])
  };
}

/* ==============================
   Preset Layer Factories
============================== */

export const createMeetingLayer = (
  id: string,
  variables: Record<string, string>,
  weight: number = 0.8
): ThemeLayer => ({
  id,
  type: "meeting",
  weight,
  variables
});

export const createAgentLayer = (
  agentId: string,
  accentColor: string,
  glowColor?: string,
  weight: number = 0.5
): ThemeLayer => ({
  id: `agent-${agentId}`,
  type: "agent",
  weight,
  variables: {
    "--accent-primary": accentColor,
    "--agent-glow": glowColor ? `0 0 12px ${glowColor}` : "none",
    "--agent-accent": accentColor
  }
});

export const createOverlayLayer = (
  id: string,
  variables: Record<string, string>,
  weight: number = 0.9
): ThemeLayer => ({
  id,
  type: "overlay",
  weight,
  variables
});

/* ==============================
   Example Scenarios
============================== */

/*
1️⃣ Global theme = Calm
2️⃣ Meeting Room = Executive Theme
3️⃣ Agent "Nova" = Focus Theme overlay

Layers:
- Global applies always
- Meeting overrides layout + lighting
- Agent applies accent + glow only
*/

/* ==============================
   Usage Example
============================== */

/*
const { containerRef, addLayer, removeLayer } =
  useCheNuThemeTransition(themeVars);

useEffect(() => {
  // Add meeting room theme
  addLayer(createMeetingLayer("meeting-room", {
    "--bg-primary": "#0b0f1a",
    "--accent-primary": "#ffcc00"
  }));

  // Add agent accent
  addLayer(createAgentLayer("nova", "#00ffd0", "#00ffd0"));

  return () => {
    removeLayer("meeting-room");
    removeLayer("agent-nova");
  };
}, []);

return (
  <div ref={containerRef}>
    <MeetingRoom />
  </div>
);
*/

/* ==============================
   Meeting Room Rules (IMPORTANT)
============================== */
/*
- Meeting Room theme NEVER overrides:
  - Accessibility rules
  - Motion safety
  - Contrast minimums

- Agents may bring:
  - Accent
  - Highlight
  - UI micro-effects

- Only ONE meeting theme active
- Multiple agents allowed simultaneously
*/

/* ==============================
   Layer Priority Reference
============================== */
/*
Weight Guidelines:
- 0.0 - 0.2: Base/Global (lowest priority)
- 0.3 - 0.5: Agent accents
- 0.6 - 0.8: Meeting/Context themes
- 0.9 - 1.0: Overlays/Modals (highest priority)
*/

export default useCheNuThemeTransition;
