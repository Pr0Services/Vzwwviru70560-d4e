# CHE·NU™ — XR PRINCIPLES
## Extended Reality Design Philosophy

> **Version:** V1 FREEZE  
> **Status:** CANONICAL  
> **Role:** Define XR approach for VR/AR/MR experiences

---

## 1. XR PHILOSOPHY

### 1.1 Core Belief

**XR is not a gimmick — it's a natural evolution of spatial interaction.**

CHE·NU approaches XR as:
- Extension of 2D interface, not replacement
- Optional enhancement, not requirement
- Productivity tool, not entertainment

### 1.2 Design Principles

```
┌─────────────────────────────────────────────────────────────────┐
│                    XR DESIGN PRINCIPLES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. CONTINUITY                                                  │
│     Same data, same logic, different presentation               │
│                                                                 │
│  2. COMFORT                                                     │
│     Prioritize user wellbeing over immersion                    │
│                                                                 │
│  3. UTILITY                                                     │
│     XR must provide tangible productivity benefit               │
│                                                                 │
│  4. ACCESSIBILITY                                               │
│     Full functionality remains available in 2D                  │
│                                                                 │
│  5. CONTEXT                                                     │
│     Environment adapts to sphere context                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. XR MODES

### 2.1 Mode Spectrum

```
2D Desktop ←──────────────────────────────────────────→ Full VR
    │                                                        │
    ├── Standard (current)                                   │
    ├── AR Overlay (phone/glasses)                           │
    ├── Mixed Reality (passthrough)                          │
    └── Full VR (immersive)                                  │
```

### 2.2 Mode Definitions

| Mode | Description | Hardware |
|------|-------------|----------|
| **Desktop** | Standard 2D interface | Monitor, keyboard |
| **AR Overlay** | UI elements over real world | Phone, AR glasses |
| **Mixed Reality** | Virtual + passthrough | Quest 3, Vision Pro |
| **Full VR** | Complete immersion | VR headsets |

### 2.3 Feature Availability by Mode

| Feature | Desktop | AR | MR | VR |
|---------|---------|-----|-----|-----|
| Bureau Central | ✅ | ✅ | ✅ | ✅ |
| Sphere Navigation | ✅ | ✅ | ✅ | ✅ |
| Thread Management | ✅ | ✅ | ✅ | ✅ |
| Nova Interaction | ✅ | ✅ | ✅ | ✅ |
| Spatial Layout | ❌ | ⚠️ | ✅ | ✅ |
| 3D Data Visualization | ❌ | ⚠️ | ✅ | ✅ |
| Full Environment | ❌ | ❌ | ⚠️ | ✅ |

---

## 3. SPATIAL DESIGN

### 3.1 Space Organization

```
┌─────────────────────────────────────────────────────────────────┐
│                    VR SPACE LAYOUT                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                        SKY/CEILING                              │
│                     (Sphere indicator)                          │
│                                                                 │
│    ┌────────┐                              ┌────────┐          │
│    │  LEFT  │                              │ RIGHT  │          │
│    │ PANEL  │       ┌──────────┐           │ PANEL  │          │
│    │        │       │  BUREAU  │           │        │          │
│    │ (Nav)  │       │ CENTRAL  │           │(Tools) │          │
│    │        │       │          │           │        │          │
│    └────────┘       └──────────┘           └────────┘          │
│                                                                 │
│                     ┌──────────┐                                │
│                     │  BOTTOM  │                                │
│                     │  PANEL   │                                │
│                     │  (Nova)  │                                │
│                     └──────────┘                                │
│                                                                 │
│                        FLOOR                                    │
│                  (Token/Budget status)                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Comfort Zones

| Zone | Distance | Use |
|------|----------|-----|
| **Intimate** | 0-0.5m | Urgent alerts only |
| **Personal** | 0.5-1.5m | Nova, active panels |
| **Social** | 1.5-3m | Bureau, main workspace |
| **Public** | 3m+ | Environment, sphere identity |

### 3.3 Height Guidelines

| Element | Height | Reason |
|---------|--------|--------|
| Primary workspace | Eye level | Natural focus |
| Secondary info | Below eye | Easy glance |
| Navigation | Peripheral | Quick access |
| Environment | Above/around | Context |

---

## 4. INTERACTION PATTERNS

### 4.1 Input Methods

| Input | Desktop | AR | VR |
|-------|---------|-----|-----|
| Mouse/Touch | ✅ | ❌ | ❌ |
| Gaze | ❌ | ✅ | ✅ |
| Hand tracking | ❌ | ⚠️ | ✅ |
| Controllers | ❌ | ❌ | ✅ |
| Voice | ✅ | ✅ | ✅ |

### 4.2 Gesture Vocabulary

```yaml
Core Gestures:
  - pinch: Select/confirm
  - point: Navigate cursor
  - palm_push: Dismiss/back
  - grab: Move/drag
  - two_hand_scale: Resize
  - thumbs_up: Approve action
  - wave: Call Nova
```

### 4.3 Voice Commands

```yaml
Voice Commands:
  Navigation:
    - "Go to [sphere]"
    - "Open [section]"
    - "Show me [item]"
  
  Nova:
    - "Hey Nova"
    - "Nova, help with..."
    - "Ask Nova about..."
  
  Actions:
    - "Create new [type]"
    - "Save this"
    - "Send to [destination]"
```

---

## 5. COMFORT & SAFETY

### 5.1 Motion Sickness Prevention

| Guideline | Implementation |
|-----------|----------------|
| No artificial locomotion | Teleport or stationary |
| Stable horizon | Never tilt world |
| Fade transitions | No sudden cuts |
| User-initiated movement | Never force motion |
| Comfort settings | User adjustable |

### 5.2 Session Limits

```yaml
Session Management:
  reminder_interval: 30  # minutes
  suggested_break: 10    # minutes
  max_recommended: 2     # hours
  
  notifications:
    - 30min: "Brief stretch break suggested"
    - 60min: "Consider a 5-minute break"
    - 90min: "You've been in VR for 90 minutes"
    - 120min: "Extended session - please take a break"
```

### 5.3 Emergency Exit

- **Quick exit**: Always accessible
- **Passthrough**: Instant real-world view
- **Session save**: Auto-save on exit
- **Gradual transition**: Fade, don't cut

---

## 6. SPHERE ENVIRONMENTS

### 6.1 Environment Per Sphere

| Sphere | VR Environment |
|--------|----------------|
| Personal 🏠 | Cozy home office |
| Business 💼 | Modern corner office |
| Government 🏛️ | Civic building interior |
| Studio 🎨 | Artist's loft |
| Community 👥 | Community center |
| Social 📱 | Urban plaza |
| Entertainment 🎬 | Theater/lounge |
| Team 🤝 | Command center |

### 6.2 Environment Elements

```yaml
Environment Components:
  static:
    - Walls/boundaries
    - Floor/ceiling
    - Ambient lighting
    - Background objects
  
  interactive:
    - Bureau (desk)
    - Nova presence
    - Tool surfaces
    - Navigation points
  
  dynamic:
    - Lighting (time of day)
    - Weather (optional)
    - Activity indicators
```

---

## 7. PERFORMANCE

### 7.1 Frame Rate Targets

| Platform | Target FPS | Minimum |
|----------|------------|---------|
| Quest 2/3 | 90 fps | 72 fps |
| PCVR | 90 fps | 80 fps |
| Vision Pro | 90 fps | 90 fps |
| AR Mobile | 60 fps | 30 fps |

### 7.2 Optimization Strategies

```yaml
Optimization:
  rendering:
    - Foveated rendering
    - LOD (Level of Detail)
    - Occlusion culling
    - Dynamic resolution
  
  assets:
    - Compressed textures
    - Optimized meshes
    - Async loading
    - Asset pooling
  
  ui:
    - Distance-based detail
    - Batch UI elements
    - Minimize overdraw
```

---

## 8. ACCESSIBILITY IN XR

### 8.1 Accommodations

| Need | Accommodation |
|------|---------------|
| Seated users | Full seated mode |
| Limited mobility | Gaze + voice control |
| Visual impairment | Audio descriptions, high contrast |
| Hearing impairment | Visual notifications, captions |
| Motion sensitivity | Reduced effects, static mode |

### 8.2 Settings

```yaml
Accessibility Settings:
  - seated_mode: true/false
  - dominant_hand: left/right
  - text_size: small/medium/large
  - contrast: normal/high
  - motion_reduction: off/mild/full
  - audio_descriptions: true/false
  - closed_captions: true/false
```

---

## 9. MVP XR SCOPE

### 9.1 MVP Includes

| Feature | Status |
|---------|--------|
| VR environment foundation | ✅ |
| Bureau Central in VR | ✅ |
| Nova presence | ✅ |
| Basic hand tracking | ✅ |
| Sphere switching | ✅ |
| Note viewing | ✅ |

### 9.2 MVP Excludes

| Feature | Status |
|---------|--------|
| AR mode | ❌ Post-MVP |
| Mixed reality passthrough | ❌ Post-MVP |
| Multi-user VR | ❌ Post-MVP |
| Full environment customization | ❌ Post-MVP |
| Complex 3D data viz | ❌ Post-MVP |

---

## 10. CANONICAL RULES

1. **2D First** — XR enhances, doesn't replace
2. **Same Data** — XR is a view, not separate system
3. **User Comfort** — Never sacrifice wellbeing
4. **Optional Always** — XR is never required
5. **Performance Priority** — Smooth > beautiful
6. **Accessible Design** — XR for everyone

---

*CHE·NU™ — Intelligence in Every Dimension*
