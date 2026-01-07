# CHE·NU™ — XR UI MAPPING
## 2D → 3D Interface Translation

> **Version:** V1 FREEZE  
> **Status:** CANONICAL  
> **Role:** Map desktop UI elements to XR equivalents

---

## 1. MAPPING PHILOSOPHY

### 1.1 Core Principle

**Every 2D element has a 3D equivalent, not a 3D replacement.**

```
┌─────────────────────────────────────────────────────────────────┐
│                    MAPPING RULE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  2D Component          →      3D Equivalent                     │
│  ─────────────                ──────────────                    │
│  Same functionality           Spatial presentation              │
│  Same data                    Different interaction             │
│  Same governance              Adapted ergonomics                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. MAIN LAYOUT MAPPING

### 2.1 Hub Layout Translation

```
2D Layout:                         3D Layout:
┌─────┬───────────┬─────┐         ┌─────────────────────────────┐
│     │           │     │         │                             │
│ HUB │    HUB    │ HUB │    →    │    ┌─────────────────┐      │
│LEFT │  CENTER   │RIGHT│         │ L  │   BUREAU        │  R   │
│     │           │     │         │ E  │   CENTRAL       │  I   │
│     ├───────────┤     │         │ F  │   (floating)    │  G   │
│     │HUB BOTTOM │     │         │ T  └─────────────────┘  H   │
└─────┴───────────┴─────┘         │                       T     │
                                  │       BOTTOM PANEL          │
                                  │       (below user)          │
                                  └─────────────────────────────┘
```

### 2.2 Position Mapping

| 2D Hub | 3D Position | Distance | Angle |
|--------|-------------|----------|-------|
| Center | Front | 1.5m | 0° |
| Left | Left side | 1.2m | -45° |
| Right | Right side | 1.2m | +45° |
| Bottom | Below center | 1.0m | -30° |

---

## 3. BUREAU SECTIONS IN XR

### 3.1 Section Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUREAU IN VR                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│         ┌─────────────────────────────────────┐                │
│         │                                     │                │
│         │      ACTIVE SECTION PANEL           │                │
│         │      (Notes, Tasks, etc.)           │                │
│         │                                     │                │
│         └─────────────────────────────────────┘                │
│                                                                 │
│    ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐│
│    │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │ │ 7 │ │ 8 │ │ 9 │ │10 ││
│    └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘│
│    SECTION TABS (curved below main panel)                      │
│                                                                 │
│    1=Dashboard 2=Notes 3=Tasks 4=Projects 5=Threads            │
│    6=Meetings 7=Data 8=Agents 9=Reports 10=Budget              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Section Tab Interaction

| Action | 2D | VR |
|--------|-----|-----|
| Select | Click | Point + pinch |
| Preview | Hover | Gaze 1s |
| Arrange | Drag | Grab + move |

---

## 4. COMPONENT MAPPING

### 4.1 Buttons

```yaml
Button (2D):
  type: flat rectangle
  interaction: click, hover
  feedback: color change

Button (3D):
  type: floating panel or sphere
  interaction: point + pinch, poke
  feedback: glow, haptic, sound
  depth: slight (0.02m)
```

### 4.2 Text Input

```yaml
TextInput (2D):
  type: text field
  interaction: keyboard input

TextInput (3D):
  options:
    - virtual_keyboard: floating QWERTY
    - voice_input: speech-to-text (primary)
    - controller_typing: laser pointer
    - hand_tracking: air typing (experimental)
  recommended: voice_input
```

### 4.3 Lists

```yaml
List (2D):
  type: scrollable vertical list
  interaction: scroll, click item

List (3D):
  type: carousel or stacked panels
  interaction: swipe, grab scroll
  layout:
    - vertical_stack: items stack in depth
    - horizontal_carousel: items orbit
    - grid: spatial 3x3 grid
  selection: point + pinch or grab
```

### 4.4 Modals/Dialogs

```yaml
Modal (2D):
  type: overlay on screen center
  interaction: button clicks

Modal (3D):
  type: floating panel, moves with user
  position: 1m in front, eye level
  interaction: same as buttons
  dismiss: palm push or "close" gesture
```

### 4.5 Menus

```yaml
Menu (2D):
  type: dropdown or context menu
  interaction: click to open

Menu (3D):
  type: radial menu or arc menu
  position: spawns from hand/controller
  interaction: point at option, release to select
```

---

## 5. NAVIGATION MAPPING

### 5.1 Sphere Navigation

```yaml
Sphere Nav (2D):
  location: left hub
  type: icon list
  interaction: click to switch

Sphere Nav (3D):
  location: left peripheral (45° left)
  type: floating spheres/orbs
  arrangement: vertical arc
  interaction: 
    - point + pinch: select
    - grab + pull: quick switch
  transition: environment morph (1s)
```

### 5.2 Breadcrumbs

```yaml
Breadcrumbs (2D):
  type: text path (Sphere > Section > Item)
  interaction: click to navigate

Breadcrumbs (3D):
  type: floating trail above
  visual: glowing path markers
  interaction: point at marker to return
```

---

## 6. NOVA IN XR

### 6.1 Nova Presence

```yaml
Nova (2D):
  location: bottom hub panel
  type: chat interface, avatar icon
  interaction: type/click

Nova (3D):
  location: bottom-right of user (companion position)
  type: holographic avatar
  distance: 1m
  height: user shoulder level
  states:
    - idle: subtle float animation
    - thinking: glow pulse
    - speaking: mouth animation, gestures
    - alert: moves closer, glow intensifies
  interaction:
    - voice: primary
    - gesture: wave to summon
    - gaze: extended gaze triggers "need help?"
```

### 6.2 Nova Conversation Panel

```yaml
Conversation (2D):
  type: chat window with messages

Conversation (3D):
  type: floating panel near Nova
  messages: appear as speech bubbles
  history: scrollable panel (optional)
  suggestions: orbiting option buttons
```

---

## 7. DATA VISUALIZATION IN XR

### 7.1 Charts

| 2D Chart | 3D Equivalent |
|----------|---------------|
| Bar chart | 3D bar columns |
| Line chart | 3D ribbon path |
| Pie chart | Exploded 3D pie |
| Table | Floating data cards |

### 7.2 DataSpace Visualization

```yaml
DataSpace (2D):
  type: table/grid view
  interaction: scroll, click row

DataSpace (3D):
  options:
    - card_cloud: floating data cards in space
    - timeline_path: data along time axis
    - node_graph: connected spheres
    - traditional_table: floating spreadsheet
  interaction:
    - grab cards to inspect
    - pinch to zoom
    - voice to filter
```

---

## 8. TOKENS & BUDGET IN XR

### 8.1 Token Display

```yaml
Token Display (2D):
  location: header/footer
  type: number + progress bar

Token Display (3D):
  location: floor or wrist
  type: glowing pool/meter
  visualization:
    - liquid level (tank)
    - particle count (energy)
    - ring segments (gauge)
  interaction: glance to see details
```

### 8.2 Cost Preview

```yaml
Cost Preview (2D):
  type: tooltip or modal

Cost Preview (3D):
  type: floating estimate near action
  appears: before confirming action
  visual: token icons flowing into action
```

---

## 9. INTERACTION STATE MAPPING

### 9.1 States

| State | 2D Visual | 3D Visual |
|-------|-----------|-----------|
| Default | Normal | Normal |
| Hover | Highlight | Glow + expand |
| Active | Pressed | Pull in + haptic |
| Disabled | Grayed | Transparent + no interaction |
| Loading | Spinner | Particle swirl |
| Error | Red outline | Red glow + shake |
| Success | Green | Green flash + sound |

### 9.2 Feedback Channels

| Channel | 2D | 3D |
|---------|-----|-----|
| Visual | Color, animation | Glow, particles, motion |
| Audio | Click sounds | Spatial audio, tones |
| Haptic | N/A | Controller/hand haptics |

---

## 10. RESPONSIVE XR

### 10.1 Adaptation Rules

```yaml
Panel Scaling:
  comfortable_reading: 0.5m width at 1.5m distance
  min_text_size: 0.015m (15mm at 1m)
  
Distance Adaptation:
  near_user: more detail, smaller panels
  far_user: larger panels, simplified content
  
Performance Mode:
  high_end: full effects, high poly
  balanced: reduced particles, medium poly
  performance: minimal effects, low poly
```

---

## 11. CANONICAL RULES

1. **1:1 Functionality** — Every 2D feature exists in 3D
2. **Spatial Logic** — Position has meaning
3. **Comfort First** — Never strain the user
4. **Voice Primary** — Voice is main input in VR
5. **Feedback Rich** — Multi-sensory confirmation
6. **Consistent Mapping** — Same gestures everywhere

---

*CHE·NU™ — Every Interface, Every Dimension*
