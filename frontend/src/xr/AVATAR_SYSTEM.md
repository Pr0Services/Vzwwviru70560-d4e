# CHE·NU™ — AVATAR SYSTEM
## Visual Representation of Agents & Users

> **Version:** V1 FREEZE  
> **Status:** CANONICAL  
> **Role:** Define avatar design and behavior

---

## 1. AVATAR PHILOSOPHY

### 1.1 Core Principle

**Avatars represent intelligence, not just identity.**

In CHE·NU, avatars communicate:
- Who is speaking
- What type of intelligence
- Current state (thinking, idle, etc.)
- Authority level

### 1.2 Avatar Types

```
┌─────────────────────────────────────────────────────────────────┐
│                    AVATAR HIERARCHY                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USER AVATARS                                                   │
│  └── Customizable, represents the human                         │
│                                                                 │
│  SYSTEM AVATARS                                                 │
│  └── Nova (fixed design, represents system)                     │
│                                                                 │
│  AGENT AVATARS                                                  │
│  ├── Orchestrator (semi-customizable)                           │
│  └── Specialists (predefined per type)                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. NOVA AVATAR

### 2.1 Design Specifications

```yaml
Nova Avatar:
  type: "system"
  customizable: false
  
  visual:
    form: "abstract humanoid silhouette"
    style: "ethereal, luminous"
    primary_color: "#D8B26A"  # Sacred Gold
    secondary_color: "#3EB4A2"  # Cenote Turquoise
    accent_color: "#3F7249"  # Jungle Emerald
  
  characteristics:
    - Glowing outline
    - Soft particle effects
    - No hard edges
    - Gender neutral
    - Culturally neutral
```

### 2.2 Nova States

| State | Visual | Animation | Color |
|-------|--------|-----------|-------|
| **Idle** | Soft glow | Gentle float | Gold |
| **Listening** | Ears glow | Lean in | Gold + Blue |
| **Thinking** | Core pulse | Particles orbit | Gold pulsing |
| **Speaking** | Mouth glow | Gestures | Turquoise |
| **Alert** | Bright | Move closer | Red accent |
| **Success** | Expand | Celebration | Green flash |

### 2.3 Nova Sphere Adaptation

Nova subtly adapts to sphere context:

| Sphere | Nova Adjustment |
|--------|-----------------|
| Personal 🏠 | Warmer tones, relaxed posture |
| Business 💼 | Sharper edges, professional stance |
| Studio 🎨 | More colorful particles |
| Team 🤝 | Badge/insignia visible |

---

## 3. USER AVATARS

### 3.1 Customization Options

```yaml
User Avatar Customization:
  base_options:
    - abstract_shape: geometric forms
    - humanoid_silhouette: gender-neutral human form
    - custom_upload: user's image (2D icon mode only)
  
  customizable_elements:
    - primary_color: user's brand color
    - secondary_color: accent
    - icon_shape: circle, rounded_square, hexagon
    - border_style: none, thin, glow
    - initials: displayed in icon mode
```

### 3.2 User Presence Levels

| Mode | Representation |
|------|----------------|
| 2D Icon | Circle with initials/photo |
| 2D Full | Larger panel with details |
| 3D Simple | Floating orb with color |
| 3D Full | Abstract humanoid |
| VR | Full body representation |

---

## 4. AGENT AVATARS

### 4.1 Orchestrator Avatar

```yaml
Orchestrator Avatar:
  type: "agent"
  customizable: "limited"
  
  base_design:
    form: "abstract assistant figure"
    style: "professional, capable"
    size: smaller than Nova
  
  user_customization:
    - name: custom name
    - primary_color: from palette
    - accent_element: badge/symbol
  
  distinguishing_feature:
    - Clipboard/tool visible
    - More grounded than Nova
    - Active pose
```

### 4.2 Specialist Avatars

Each specialist type has predefined avatar:

| Specialist | Visual Theme | Icon |
|------------|--------------|------|
| Data Analyst | Charts, graphs | 📊 |
| Content Writer | Pen, document | ✍️ |
| Designer | Palette, shapes | 🎨 |
| Researcher | Magnifying glass | 🔍 |
| Coder | Code brackets | 💻 |
| Translator | Globe, text | 🌐 |
| Scheduler | Calendar | 📅 |

### 4.3 Agent State Indicators

| State | Visual Indicator |
|-------|------------------|
| Available | Green dot |
| Working | Spinning indicator |
| Waiting | Yellow dot |
| Error | Red dot |
| Offline | Gray |

---

## 5. AVATAR INTERACTIONS

### 5.1 Turn-Taking Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONVERSATION FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User speaking:                                                 │
│  ┌─────┐                                                        │
│  │ 👤  │ ════════════════════►  [message flows to Nova]        │
│  │glow │                                                        │
│  └─────┘                                                        │
│                                                                 │
│  Nova responding:                                               │
│                    ◄════════════════════ ┌─────┐               │
│  [message flows back]                     │ ✧   │              │
│                                           │ glow│              │
│                                           └─────┘              │
│                                                                 │
│  Active speaker: Brighter glow                                  │
│  Listener: Subtle glow, attentive pose                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Multi-Agent Visualization

When multiple agents involved:

```
User + Nova + Orchestrator + Specialist

        ┌─────┐
        │ ✧   │  Nova (supervisor, largest)
        │     │
        └──┬──┘
           │
    ┌──────┼──────┐
    │      │      │
┌───┴───┐┌─┴─┐┌───┴───┐
│  👤   ││🎯 ││  📊   │
│ User  ││Orc││ Data  │
└───────┘└───┘└───────┘
```

---

## 6. AVATAR RENDERING

### 6.1 2D Rendering

```yaml
2D Avatar:
  icon_size:
    small: 32px
    medium: 48px
    large: 64px
    xl: 96px
  
  components:
    - background: color or gradient
    - border: optional glow
    - content: initials, icon, or image
    - state_indicator: corner dot
```

### 6.2 3D Rendering

```yaml
3D Avatar:
  lod_levels:
    - high: 10000 triangles (close)
    - medium: 5000 triangles (mid)
    - low: 1000 triangles (far)
    - icon: 2D sprite (very far)
  
  materials:
    - base: PBR standard
    - glow: emissive
    - particles: additive blend
  
  animation_system:
    - skeletal: basic rig
    - blend_shapes: expressions
    - procedural: breathing, float
```

---

## 7. AVATAR ACCESSIBILITY

### 7.1 Non-Visual Identification

| Mode | Identification Method |
|------|----------------------|
| Screen reader | "Nova, system assistant" |
| Audio | Unique voice/tone |
| Haptic | Pattern vibration |

### 7.2 Color Blind Modes

```yaml
Color Alternatives:
  - Shapes (circle vs square)
  - Patterns (solid vs striped)
  - Labels (always available)
  - Size variation
```

---

## 8. AVATAR IN XR

### 8.1 VR Avatar Scale

| Entity | Height | Relative |
|--------|--------|----------|
| User | 1.7m (variable) | Reference |
| Nova | 1.0m | 60% of user |
| Orchestrator | 0.8m | 50% of user |
| Specialists | 0.6m | 35% of user |

### 8.2 VR Positioning

```
┌─────────────────────────────────────────────────────────────────┐
│                    VR AVATAR POSITIONS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                        USER (center)                            │
│                            │                                    │
│         Nova ──────────────┼──────────── Right panel            │
│      (companion)           │                                    │
│         1m, -30°           │                                    │
│                            │                                    │
│         Orchestrator       │                                    │
│      (when summoned)       │                                    │
│         1.5m, front        │                                    │
│                            │                                    │
│         Specialists (when active)                               │
│         Orbit around workspace                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. AVATAR EMOTIONS

### 9.1 Expression System

```yaml
Expressions:
  neutral: default state
  happy: success, approval
  thinking: processing
  confused: clarification needed
  concerned: warning state
  alert: urgent attention
  
Implementation:
  2D: icon/emoji overlay
  3D: blend shapes, particles
```

### 9.2 Expression Triggers

| Trigger | Expression |
|---------|------------|
| Task completed | Happy |
| Long processing | Thinking |
| Ambiguous input | Confused |
| Budget warning | Concerned |
| Error/failure | Concerned |
| Urgent notification | Alert |

---

## 10. MVP AVATAR SCOPE

### 10.1 MVP Includes

| Feature | Status |
|---------|--------|
| Nova 2D avatar | ✅ |
| Nova state animations | ✅ |
| User icon avatar | ✅ |
| Agent type icons | ✅ |
| State indicators | ✅ |

### 10.2 MVP Excludes

| Feature | Status |
|---------|--------|
| Full 3D avatars | ❌ Post-MVP |
| User customization | ❌ Post-MVP |
| Expression system | ❌ Post-MVP |
| VR presence | ❌ Post-MVP |

---

## 11. CANONICAL RULES

1. **Nova is Unique** — Only Nova has the golden glow design
2. **Hierarchy Visible** — Size/position shows importance
3. **State Visible** — Current state always shown
4. **Accessible Always** — Non-visual alternatives exist
5. **Consistent Identity** — Same avatar across all views
6. **Performance Aware** — LOD for all 3D avatars

---

*CHE·NU™ — Faces of Intelligence*
