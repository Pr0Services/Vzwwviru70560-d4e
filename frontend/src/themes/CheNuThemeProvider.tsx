// ═══════════════════════════════════════════════════════════════════════════════
// CheNuThemeProvider.tsx
// ✅ Canonical ThemeProvider for CHE·NU
// ✅ Binds theme to CSS variables + XR-ready
// ✅ Plug-and-play with useCheNuTheme hook
// ✅ One single block – copy / paste safe
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  createContext,
  useContext,
  useEffect,
  useRef
} from "react";
import { CheNuThemeConfig, CheNuTheme, CheNuThemeId, useCheNuTheme } from "./useCheNuTheme";

/* ==============================
   Context
============================== */

interface CheNuThemeContextValue {
  themeId: CheNuThemeId;
  theme: CheNuTheme;
  setTheme: (id: CheNuThemeId) => void;
  motionEnabled: boolean;
  agentVisibility: string;
  agentTone: string;
}

const CheNuThemeContext = createContext<CheNuThemeContextValue | null>(null);

/* ==============================
   Provider Props
============================== */

interface CheNuThemeProviderProps {
  config: CheNuThemeConfig;
  contextSignal: "idle" | "stress" | "task" | "analysis" | "decision";
  children: React.ReactNode;
}

/* ==============================
   Provider
============================== */

export function CheNuThemeProvider({
  config,
  contextSignal,
  children
}: CheNuThemeProviderProps) {
  const { 
    theme, 
    themeId, 
    setTheme,
    motionEnabled,
    agentVisibility,
    agentTone
  } = useCheNuTheme(config, contextSignal);
  
  const rootRef = useRef<HTMLDivElement>(null);

  /* ==============================
     Apply CSS Variables
  ============================== */

  useEffect(() => {
    if (!rootRef.current) return;

    const root = rootRef.current.style;

    // Colors - Background
    Object.entries(theme.visual?.background || {}).forEach(
      ([key, value]) => root.setProperty(`--bg-${key}`, String(value))
    );

    // Colors - Text
    Object.entries(theme.visual?.text || {}).forEach(
      ([key, value]) => root.setProperty(`--text-${key}`, String(value))
    );

    // Accent / UI
    Object.entries(theme.visual?.accent || {}).forEach(
      ([key, value]) => root.setProperty(`--accent-${key}`, String(value))
    );

    // Layout
    if (theme.layout) {
      root.setProperty("--layout-density", theme.layout.density || "medium");
      root.setProperty("--layout-spacing-scale", String(theme.layout.spacingScale || 1));
      root.setProperty("--layout-max-columns", String(theme.layout.maxColumns || 2));
      root.setProperty("--layout-side-panels", theme.layout.sidePanels || "auto");
    }

    // Motion
    root.setProperty(
      "--motion-enabled",
      theme.motion?.enabled ? "1" : "0"
    );
    root.setProperty(
      "--motion-transition-ms",
      String(theme.motion?.transitionMs || 300)
    );
    root.setProperty(
      "--motion-easing",
      theme.motion?.easing || "ease-out"
    );
    root.setProperty(
      "--motion-intensity",
      theme.motion?.animationIntensity || "low"
    );

    // Agents
    root.setProperty("--agent-visibility", theme.agents?.visibility || "onDemand");
    root.setProperty("--agent-tone", theme.agents?.tone || "calm");
    root.setProperty(
      "--agent-max-simultaneous",
      String(theme.agents?.maxSimultaneousAgents || 1)
    );

    // Contrast level
    root.setProperty(
      "--contrast-level",
      theme.visual?.contrastLevel || "medium"
    );

  }, [theme]);

  /* ==============================
     Provider Output
  ============================== */

  const contextValue: CheNuThemeContextValue = {
    themeId,
    theme,
    setTheme,
    motionEnabled,
    agentVisibility,
    agentTone
  };

  return (
    <CheNuThemeContext.Provider value={contextValue}>
      <div
        ref={rootRef}
        data-che-nu-theme={themeId}
        style={{
          width: "100%",
          height: "100%",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          transition: theme.motion?.enabled
            ? `all ${theme.motion.transitionMs}ms ${theme.motion.easing}`
            : "none"
        }}
      >
        {children}
      </div>
    </CheNuThemeContext.Provider>
  );
}

/* ==============================
   Hook Consumer
============================== */

export function useCheNuThemeContext(): CheNuThemeContextValue {
  const ctx = useContext(CheNuThemeContext);
  if (!ctx) {
    throw new Error(
      "useCheNuThemeContext must be used inside CheNuThemeProvider"
    );
  }
  return ctx;
}

/* ==============================
   Usage Example
============================== */

/*
<CheNuThemeProvider
  config={themeConfig}
  contextSignal="analysis"
>
  <App />
</CheNuThemeProvider>
*/

/* ==============================
   CSS Example
============================== */
/*
:root {
  --bg-primary: #0d1117;
  --text-primary: #e6edf3;
  --accent-primary: #00ffd0;
}

button {
  background: var(--accent-primary);
}

.panel {
  transition: all var(--motion-transition-ms) var(--motion-easing);
}
*/

export default CheNuThemeProvider;
