// ═══════════════════════════════════════════════════════════════════════════════
// AgentThemeAura.tsx
// ✅ Agent Theme Aura Engine – CHE·NU
// ✅ Works in 2D UI + 3D/XR (same semantic)
// ✅ Non-invasive: aura ≠ control, aura = presence
// ✅ One single block – copy / paste ready for Claude / Copilot
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useMemo } from "react";

/* ==============================
   Types
============================== */

export type AuraMode = "calm" | "focus" | "alert" | "decision";

export interface AgentAuraConfig {
  agentId: string;
  color: string;
  intensity: number; // 0.0 → 1.0
  mode: AuraMode;
  pulse?: boolean;
}

export interface AuraStyle {
  boxShadow: string;
  borderColor: string;
  opacity: number;
  animation: string;
}

/* ==============================
   Mode Presets
============================== */

const MODE_PRESETS: Record<AuraMode, { blurMultiplier: number; pulseSpeed: number }> = {
  calm: { blurMultiplier: 1.0, pulseSpeed: 3.0 },
  focus: { blurMultiplier: 0.8, pulseSpeed: 0 },
  alert: { blurMultiplier: 1.5, pulseSpeed: 1.2 },
  decision: { blurMultiplier: 1.2, pulseSpeed: 2.0 },
};

/* ==============================
   Aura Style Resolver
============================== */

export function resolveAuraStyle(config: AgentAuraConfig): AuraStyle {
  const preset = MODE_PRESETS[config.mode];
  const baseBlur = (12 + config.intensity * 20) * preset.blurMultiplier;
  const baseOpacity = 0.25 + config.intensity * 0.45;

  const pulseAnimation =
    config.pulse && preset.pulseSpeed > 0
      ? `cheNuAuraPulse ${preset.pulseSpeed}s ease-in-out infinite`
      : "none";

  return {
    boxShadow: `0 0 ${baseBlur}px ${config.color}`,
    borderColor: config.color,
    opacity: baseOpacity,
    animation: pulseAnimation,
  };
}

/* ==============================
   React Component (2D / UI)
============================== */

interface AgentThemeAuraProps {
  config: AgentAuraConfig;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AgentThemeAura({
  config,
  children,
  className,
  style,
}: AgentThemeAuraProps) {
  const ref = useRef<HTMLDivElement>(null);

  const auraStyle = useMemo(() => resolveAuraStyle(config), [config]);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    el.style.boxShadow = auraStyle.boxShadow;
    el.style.borderColor = auraStyle.borderColor;
    el.style.opacity = String(auraStyle.opacity);
    el.style.animation = auraStyle.animation;
  }, [auraStyle]);

  return (
    <div
      ref={ref}
      data-agent-id={config.agentId}
      data-aura-mode={config.mode}
      className={className}
      style={{
        borderRadius: "12px",
        transition: "all 0.35s ease",
        position: "relative",
        border: `1px solid ${config.color}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ==============================
   Hook Version
============================== */

export function useAgentAura(config: AgentAuraConfig) {
  const style = useMemo(() => resolveAuraStyle(config), [config]);

  return {
    style,
    cssVars: {
      "--agent-aura-color": config.color,
      "--agent-aura-blur": `${12 + config.intensity * 20}px`,
      "--agent-aura-opacity": style.opacity,
      "--agent-aura-mode": config.mode,
    },
    dataAttributes: {
      "data-agent-id": config.agentId,
      "data-aura-mode": config.mode,
      "data-aura-intensity": config.intensity,
    },
  };
}

/* ==============================
   CSS Keyframes (inject once globally)
============================== */

export const AURA_KEYFRAMES_CSS = `
@keyframes cheNuAuraPulse {
  0%   { box-shadow: 0 0 12px currentColor; opacity: 0.25; }
  50%  { box-shadow: 0 0 28px currentColor; opacity: 0.6; }
  100% { box-shadow: 0 0 12px currentColor; opacity: 0.25; }
}

@keyframes cheNuAuraAlert {
  0%   { box-shadow: 0 0 8px currentColor; opacity: 0.3; }
  25%  { box-shadow: 0 0 24px currentColor; opacity: 0.8; }
  50%  { box-shadow: 0 0 8px currentColor; opacity: 0.3; }
  75%  { box-shadow: 0 0 24px currentColor; opacity: 0.8; }
  100% { box-shadow: 0 0 8px currentColor; opacity: 0.3; }
}

@keyframes cheNuAuraDecision {
  0%   { box-shadow: 0 0 16px currentColor, 0 0 32px currentColor; opacity: 0.5; }
  50%  { box-shadow: 0 0 20px currentColor, 0 0 40px currentColor; opacity: 0.7; }
  100% { box-shadow: 0 0 16px currentColor, 0 0 32px currentColor; opacity: 0.5; }
}
`;

/* ==============================
   Style Injector Component
============================== */

export function AuraStyleInjector() {
  useEffect(() => {
    const styleId = "chenu-aura-keyframes";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = AURA_KEYFRAMES_CSS;
    document.head.appendChild(style);

    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  return null;
}

/* ==============================
   XR / 3D Mapping (Concept)
============================== */

/*
Agent Aura → XR Semantic Mapping

- color        → emissive material color
- intensity    → emissive strength
- pulse        → sine-based emission curve
- mode         → halo shape & distance

Example:
CALM      → soft halo, low frequency pulse
FOCUS     → tight halo, no pulse
ALERT     → fast pulse, wide radius
DECISION  → stable bright core + outer ring
*/

export interface XRAuraMapping {
  emissiveColor: string;
  emissiveIntensity: number;
  haloRadius: number;
  pulseCurve: "sine" | "none" | "sawtooth";
  pulseFrequency: number;
}

export function mapAuraToXR(config: AgentAuraConfig): XRAuraMapping {
  const preset = MODE_PRESETS[config.mode];

  return {
    emissiveColor: config.color,
    emissiveIntensity: config.intensity * 2.0,
    haloRadius: 0.5 + config.intensity * 1.5,
    pulseCurve: config.pulse && preset.pulseSpeed > 0 ? "sine" : "none",
    pulseFrequency: preset.pulseSpeed,
  };
}

/* ==============================
   Rules (IMPORTANT – DO NOT BREAK)
============================== */

/*
✅ Aura never blocks interaction
✅ Aura never overlaps system alerts
✅ Multiple agent auras MAY coexist
✅ Aura intensity auto-damped in stress UX
✅ Meeting theme > agent aura (space wins over presence)
*/

/* ==============================
   Usage Example
============================== */

/*
// Basic usage
<AgentThemeAura
  config={{
    agentId: "nova",
    color: "#00ffd0",
    intensity: 0.8,
    mode: "focus",
    pulse: true
  }}
>
  <AgentAvatar />
</AgentThemeAura>

// Hook usage
const { style, cssVars, dataAttributes } = useAgentAura({
  agentId: "atlas",
  color: "#5DA9FF",
  intensity: 0.6,
  mode: "calm",
  pulse: false
});

// Don't forget to inject styles once at app root
<AuraStyleInjector />
*/

export default AgentThemeAura;
