# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU — MINIMAL STYLE GUIDE
# CANONICAL UX / UI DESIGN SYSTEM
# Implement Exactly As Defined
# ═══════════════════════════════════════════════════════════════════════════════

**Version**: 1.0.0  
**Status**: CANONICAL - IMPLEMENT EXACTLY  
**Priority**: CRITICAL

---

## PHILOSOPHY

Che-Nu prioritizes **clarity**, **calm**, and **cognitive safety**.

Design must reduce mental load, not impress.  
Every visual choice must serve **orientation**, **decision**, or **focus**.

### Key Principles

| Principle | Priority |
|-----------|----------|
| **Calm** | > Flashy |
| **Structure** | > Decoration |
| **Space** | > Density |
| **Meaningful motion** | > Constant motion |

---

## COLOR SYSTEM

### Base Palette (neutral, low contrast)

| Token | Value | Usage |
|-------|-------|-------|
| `Color.Background.Primary` | `#0F1216` | Main background |
| `Color.Background.Secondary` | `#151A21` | Cards, panels |
| `Color.Background.Elevated` | `#1B2230` | Modals, dropdowns |
| `Color.Text.Primary` | `#E6EAF0` | Main text |
| `Color.Text.Secondary` | `#AEB6C3` | Labels, subtitles |
| `Color.Text.Muted` | `#7A8496` | Metadata, timestamps |

### Accent Palette (used sparingly)

| Token | Value | Usage |
|-------|-------|-------|
| `Color.Accent.Focus` | `#5DA9FF` | Primary action |
| `Color.Accent.Success` | `#4CAF88` | Confirmations |
| `Color.Accent.Warning` | `#F5C26B` | Alerts |
| `Color.Accent.Danger` | `#E06C75` | Critical only |

### Color Rules

1. ❌ Never use more than **one accent per screen**
2. ❌ Red is reserved **only** for irreversible or critical states
3. ✅ Backgrounds stay dark to reduce eye strain

---

## TYPOGRAPHY

### Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

- **Primary**: Inter / System UI fallback
- **No decorative fonts**

### Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| `Font.Title` | 20–24px | Page titles |
| `Font.Section` | 16–18px | Section headers |
| `Font.Body` | 14–15px | Body text |
| `Font.Metadata` | 12–13px | Labels, timestamps |

### Typography Rules

1. ✅ Line height ≥ **1.45**
2. ❌ Never justify text
3. ❌ Avoid italics for long content
4. ✅ Use bold only for **emphasis**, never decoration

---

## SPACING & LAYOUT

### Base Unit

```
BASE_UNIT = 8px
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `Space.XS` | 4px | Micro spacing |
| `Space.S` | 8px | Compact elements |
| `Space.M` | 16px | Standard spacing |
| `Space.L` | 24px | Section separation |
| `Space.XL` | 32px | Major sections |

### Layout Rules

1. ✅ Always leave breathing space around actions
2. ✅ Prefer **vertical stacking** over grids
3. ❌ Avoid more than **3 columns** in any context
4. ✅ Empty space is **functional**, not wasted

---

## BUTTONS & INTERACTIONS

### Button Hierarchy

| Type | Style | Color | Radius |
|------|-------|-------|--------|
| **Primary** | Filled | Accent | 8–10px |
| **Secondary** | Outline | Neutral | 8–10px |
| **Tertiary** | Text only | Low contrast | — |

### Button Rules

1. ⚠️ Only **ONE primary action** per screen
2. ✅ Buttons must say **what they do**, not how
3. ✅ **Disable** actions instead of hiding them

---

## ICONS

### Icon Style

- Simple, **line-based**
- No filled icons unless state = **active**

### Icon Rules

1. ✅ Icons **support** text, never replace it
2. ❌ Avoid icon-only actions unless universally obvious

---

## ANIMATION & MOTION

### Timing

| Action Type | Duration |
|-------------|----------|
| Fast actions | 120–150ms |
| Transitions | 200–300ms |
| Zoom / Universe view | 400–600ms |

### Easing

- ✅ **Ease-out** preferred
- ❌ No bounce
- ❌ No elastic effects

### Motion Rules

1. ✅ Motion must **explain state change**
2. ❌ Never animate for decoration alone
3. ✅ Allow users to **reduce motion** (accessibility)

---

## CARDS & PANELS

### Card Style

- Slight elevation via shadow or contrast
- Rounded corners: **10–12px**
- No visible borders unless grouping is unclear

### Card Feel

Cards and panels should feel:
- **Stable**
- **Quiet**
- **Trustworthy**

---

## AGENT PRESENCE (UX)

### Agent Visual Rules

Agents must be visually **subtle**:
- Small avatar or icon
- Muted accent
- Appears **only when relevant**

### Agent Never

| ❌ Never |
|----------|
| Flash |
| Pop unexpectedly |
| Interrupt focus |

### Agent Tone

- **Suggestive**, never authoritative
- **Calm**, respectful, optional

---

## STATES & FEEDBACK

### Feedback Types

Every action provides:

| Type | Style |
|------|-------|
| Visual confirmation | Subtle |
| Logical confirmation | State change |
| Narrative confirmation | Optional |

### Avoid

- ❌ Loud toasts
- ❌ Aggressive alerts
- ❌ Frequent confirmations

---

## ACCESSIBILITY

| Requirement | Standard |
|-------------|----------|
| Contrast ratio | ≥ WCAG AA |
| Keyboard | Fully navigable |
| Screen-reader | Friendly labels |
| Motion | Reduction option |

---

## FINAL RULE

> If a visual element does not improve **clarity**, reduce **effort**, 
> or support **decision-making**, it does not belong in Che-Nu.

---

**END OF STYLE GUIDE**
