# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU — THEME APPLICATION & SCOPE DEFINITIONS
# CANONICAL DOCUMENTATION
# ═══════════════════════════════════════════════════════════════════════════════

**Version**: 1.0.0  
**Status**: CANONICAL - LAW  
**Priority**: CRITICAL

---

## 1. PURPOSE

Define clearly:
- What each theme represents
- Where it applies
- What it can modify
- What it must NEVER override

**Themes are NOT skins.**  
**Themes are contextual environments governed by law.**

---

## 2. THEME LEVELS (ORDERED BY AUTHORITY)

| Level | Name | Authority | Weight |
|-------|------|-----------|--------|
| 1 | **GLOBAL THEME** | System | 0.1 |
| 2 | **SPHERE THEME** | Domain | 0.4 |
| 3 | **MEETING THEME** | Space | 0.8 |
| 4 | **AGENT THEME** | Presence/Aura | 0.3 |
| 5 | **OVERLAY THEME** | Temporary UX | 1.0 |

**Higher level ALWAYS wins over lower level.**

---

## 3. GLOBAL THEMES (SYSTEM-WIDE)

### 🎯 Applies to
- Entire application
- Navigation structure
- Accessibility rules
- Motion safety
- Contrast & readability
- Global typography scale

### ✅ Allowed changes
- Background base color
- UI density
- Motion intensity (on/off)
- Typography style family

### ❌ Forbidden
- Layout hierarchy
- Data visibility
- Security or privacy indicators

### Canonical Global Themes

| Theme | Purpose | Default For |
|-------|---------|-------------|
| **CALM** | Default exploration | Evening, fatigue, stress |
| **FOCUS** | Task execution | Active work sessions |
| **ANALYSIS** | Deep inspection | Research, comparison |
| **EXECUTIVE** | Decision making | Leadership, oversight |

---

## 4. SPHERE THEMES (DOMAIN SCOPED)

### 🎯 Applies to
- Inside a single Sphere
- Dashboards
- Internal layouts
- Domain-specific UI elements

### ✅ Allowed
- Color accents
- Component density
- Visualization style
- Data grouping logic
- Visual metaphors (charts, graphs)

### ❌ Forbidden
- Global navigation
- Accessibility rules
- Meeting room overrides

### Examples

| Sphere | Theme Character |
|--------|-----------------|
| **Scholar** | Neutral, legible, knowledge-first |
| **Creative Studio** | Expressive but constrained |
| **Business** | Data-forward, low ornamentation |
| **Operations** | Clarity, status-focused |

---

## 5. MEETING THEMES (SPATIAL)

### 🎯 Applies to
- Meeting Room ONLY (2D, 3D, XR)
- Room lighting
- Shared space ambiance
- Collaboration surfaces

### ✅ Allowed
- Lighting tone
- Depth & shadows
- Ambient motion
- Collaboration UI panels

### ❌ Forbidden
- User preferences
- Global typography
- Agent authority hierarchy

### Rule
> **ONE meeting theme at a time.**

---

## 6. AGENT THEMES (PRESENCE / AURA)

### 🎯 Applies to
- Agent avatar
- Agent UI elements
- Agent highlights & signals

### ✅ Allowed
- Aura color
- Glow / halo
- Highlight accents
- Presence indicators

### ❌ Forbidden
- Background changes
- Layout changes
- Theme switching

**Agents express presence, not control.**

---

## 7. OVERLAY THEMES (TEMPORARY STATES)

### 🎯 Applies to
- Alerts
- Warnings
- Critical focus states
- Transitions

### ✅ Allowed
- Temporary dimming
- Highlighting
- Motion emphasis
- Attention direction

### ❌ Forbidden
- Persistent state change
- Data mutation

**Must self-destruct after resolution.**

---

## 8. THEME BLENDING RULES

### Layer Order
1. Global theme always exists
2. Sphere theme blends on entry
3. Meeting theme overlays sphere
4. Agent aura blends last
5. Overlay theme overrides visuals ONLY

### Blending Weights

| Layer | Weight | Notes |
|-------|--------|-------|
| Global | 0.1 | Base, always present |
| Sphere | 0.4 | Domain context |
| Meeting | 0.8 | Space dominates |
| Agent | 0.3 | Never > meeting |
| Overlay | 1.0 | Temporary only |

---

## 9. AUTOMATIC THEME TRIGGERS

| Trigger | Theme | Authority |
|---------|-------|-----------|
| Stress detected | → CALM | Agent suggest |
| High task load | → FOCUS | Agent suggest |
| Investigation | → ANALYSIS | Agent suggest |
| Decision point | → EXECUTIVE | Agent suggest |

**Agents may SUGGEST.**  
**Only Orchestrator may APPLY.**

---

## 10. THEMES AS LAW

Themes must:
- ✅ Preserve clarity
- ✅ Reduce cognitive load
- ✅ Protect user autonomy
- ✅ Prevent manipulation

**If a theme violates clarity → REJECTED.**

---

## 11. SUMMARY

| Concept | Role |
|---------|------|
| **Themes** | Environment |
| **Agents** | Presence |
| **Meetings** | Spaces |
| **Spheres** | Context |
| **Law** | Boundary |

**Structure is immutable.**  
**Experience is adaptive.**

---

## 12. IMPLEMENTATION REFERENCE

```typescript
// Theme Level Types
type ThemeLevel = 
  | 'global'    // System-wide
  | 'sphere'    // Domain-scoped
  | 'meeting'   // Spatial
  | 'agent'     // Presence
  | 'overlay';  // Temporary

// Blending Weights
const THEME_WEIGHTS: Record<ThemeLevel, number> = {
  global: 0.1,
  sphere: 0.4,
  meeting: 0.8,
  agent: 0.3,
  overlay: 1.0,
};

// Theme Authority Check
function canOverride(higher: ThemeLevel, lower: ThemeLevel): boolean {
  return THEME_WEIGHTS[higher] >= THEME_WEIGHTS[lower];
}
```

---

**END OF THEME SCOPE DEFINITIONS**
