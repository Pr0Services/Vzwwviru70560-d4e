# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU — THEME PRESETS
# CANONICAL UI THEMES (CALM • FOCUS • ANALYSIS • EXECUTIVE)
# User-switchable and Agent-adaptable
# ═══════════════════════════════════════════════════════════════════════════════

**Version**: 1.0.0  
**Status**: CANONICAL - IMPLEMENT EXACTLY  
**Priority**: CRITICAL

---

## GLOBAL THEME RULES

| Rule | Description |
|------|-------------|
| **Definition** | A theme is a visual + interaction preset, not just colors |
| **Scope** | Themes never change structure, only perception |
| **Switching** | Must be instant and non-destructive |
| **Adaptation** | Each theme adapts motion, density, contrast, and agent presence |
| **Autonomy** | Agents may recommend a theme but never force it |

---

## THEME 1 — CALM (DEFAULT)

### Purpose
Reduce cognitive load, encourage clarity and reflection.

### Visuals
| Property | Value |
|----------|-------|
| Background | Very dark, low contrast |
| Text | Soft white, muted secondary |
| Accents | Minimal, blue-tinted |

### Layout
- Large spacing
- Few visible panels
- Generous empty space

### Motion
- Slow transitions (300-400ms)
- Minimal animations

### Agent Behavior
- Very subtle presence
- Appears only when explicitly called

### Use Cases
- Long thinking sessions
- Personal organization
- Methodology reviews
- Evening or fatigue mode

### Token
```typescript
theme = "calm"
```

---

## THEME 2 — FOCUS

### Purpose
Enable deep execution and task completion.

### Visuals
| Property | Value |
|----------|-------|
| Background | Higher contrast than Calm |
| Text | Clear primary accent on current action |
| Accents | Reduced color variation |

### Layout
- One main panel emphasized
- Side panels collapsed by default
- Clear task hierarchy

### Motion
- Fast, precise transitions (120-150ms)
- No decorative animation

### Agent Behavior
- Only operational agents visible
- Short, direct suggestions

### Use Cases
- Task execution
- Agent task supervision
- Short, intense work bursts

### Token
```typescript
theme = "focus"
```

---

## THEME 3 — ANALYSIS

### Purpose
Explore data, relationships, decisions, and structure.

### Visuals
| Property | Value |
|----------|-------|
| Background | Slightly brighter |
| Text | High contrast |
| Accents | Multiple shades allowed (still limited) |

### Layout
- More information density
- Multiple panels allowed
- Visual connectors (lines, grouping)

### Motion
- Medium speed (200-250ms)
- Emphasis on state changes

### Agent Behavior
- Analyst agents visible
- Explanatory suggestions allowed
- Charts and summaries emphasized

### Use Cases
- Business analysis
- Scholar research
- Decision comparison
- Meeting synthesis

### Token
```typescript
theme = "analysis"
```

---

## THEME 4 — EXECUTIVE

### Purpose
High-level overview, decision-making, and delegation.

### Visuals
| Property | Value |
|----------|-------|
| Background | Clean, sharp contrast |
| Text | Strong but restrained |
| Accents | Minimal gradients |

### Layout
- KPI-style summaries
- Decision blocks
- Status indicators prominent

### Motion
- Very limited (100-120ms)
- Feels immediate and responsive

### Agent Behavior
- Only decision-relevant agents appear
- No exploratory chatter
- Direct recommendations allowed

### Use Cases
- Leadership views
- Portfolio oversight
- Final decisions
- Investor demos

### Token
```typescript
theme = "executive"
```

---

## THEME ADAPTATION RULES

| Rule | Description |
|------|-------------|
| **Default** | Default theme per user is **Calm** |
| **Manual** | Theme can be manually selected |
| **Suggested** | Agents can suggest themes |
| **Stress Mode** | Auto-switch to Calm or Focus |
| **XR** | XR themes inherit from current 2D theme unless overridden |

---

## AGENT-INFLUENCED THEME SUGGESTIONS

| Condition | Suggested Theme |
|-----------|-----------------|
| Detected stress or overload | **Calm** |
| Task execution phase | **Focus** |
| Comparison, review, learning | **Analysis** |
| High-level delegation or reporting | **Executive** |

**All suggestions must be dismissible.**

---

## THEME SAFETY RULES

| Rule | Requirement |
|------|-------------|
| **Information** | No theme hides critical information |
| **Permissions** | No theme changes permissions |
| **Data** | No theme alters data or decisions |
| **Reversibility** | Theme changes are always reversible |

---

**END OF THEME PRESET BLOCK**
