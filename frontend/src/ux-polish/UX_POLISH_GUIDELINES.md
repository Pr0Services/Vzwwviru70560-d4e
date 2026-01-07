# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU — UX POLISH GUIDELINES
# From "I understand it's powerful" to "I instinctively know what to do"
# ═══════════════════════════════════════════════════════════════════════════════

**Version**: 1.0.0
**Status**: CANONICAL
**Priority**: CRITICAL FOR USER EXPERIENCE

---

## 🎯 OBJECTIVE

Transform user experience from:
> "Je comprends que c'est puissant"

To:
> "Je sais instinctivement quoi faire maintenant"

---

## CORE PHILOSOPHY

> **CHE·NU ne cherche pas à impressionner.**
> **Il cherche à mettre l'utilisateur dans un état de clarté.**

When UX succeeds:
- The user thinks less about the tool
- The user thinks more clearly themselves
- The system feels like a natural extension of thought

---

# ═══════════════════════════════════════════════════════════════════════════════
# RULE 1 — LESS ON SCREEN, MORE MEANING
# ═══════════════════════════════════════════════════════════════════════════════

## ✅ Target

| Element | Count |
|---------|-------|
| Primary action visible | **1** |
| Secondary actions | **2-3 max** |
| Everything else | **Latent** (hover, focus, zoom, scroll, long-press) |

## ❌ Avoid

- ❌ Overloaded dashboards
- ❌ Long lists without hierarchy
- ❌ "Advanced" options visible by default
- ❌ Multiple CTAs competing for attention
- ❌ Information density without purpose

## CHE·NU Principle

> **La complexité existe, mais elle se révèle progressivement.**
> Complexity exists, but it reveals itself progressively.

### Implementation

```typescript
interface ScreenComplexity {
  primaryAction: Action;           // ONE only
  secondaryActions: Action[];      // Max 3
  latentActions: LatentAction[];   // Revealed on interaction
  
  revealTriggers: {
    hover: boolean;
    focus: boolean;
    zoom: boolean;
    scroll: boolean;
    longPress: boolean;
  };
}
```

### Visual Hierarchy Levels

```
Level 1: IMMEDIATE (always visible)
├── Primary action button
├── Current context indicator
└── Essential status

Level 2: AVAILABLE (one interaction away)
├── Secondary actions
├── Quick settings
└── Navigation options

Level 3: DISCOVERABLE (intentional exploration)
├── Advanced settings
├── Detailed analytics
└── Power user features

Level 4: DEEP (expert mode)
├── System configuration
├── Debug information
└── Developer tools
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# RULE 2 — ABSOLUTE VISUAL HIERARCHY
# ═══════════════════════════════════════════════════════════════════════════════

## The 4 Questions (In Visual Order)

Every screen MUST answer these questions in this exact visual order:

| Order | Question | French | Visual Treatment |
|-------|----------|--------|------------------|
| **1** | Where am I? | Où suis-je? | Top, prominent, contextual |
| **2** | Why am I here? | Pourquoi je suis ici? | Objective/purpose statement |
| **3** | What's happening now? | Qu'est-ce qui se passe? | Status, agent activity |
| **4** | What can I do next? | Que puis-je faire? | Clear action affordance |

## Validation Rule

> **If a screen doesn't answer all 4, it must be simplified.**

### Screen Audit Template

```typescript
interface ScreenAudit {
  screenId: string;
  
  answersQuestions: {
    whereAmI: boolean;          // Q1
    whyAmIHere: boolean;        // Q2
    whatsHappening: boolean;    // Q3
    whatCanIDo: boolean;        // Q4
  };
  
  visualOrder: {
    q1Position: 'top' | 'other';
    q2Position: 'below_q1' | 'other';
    q3Position: 'center' | 'other';
    q4Position: 'action_area' | 'other';
  };
  
  needsSimplification: boolean;
  simplificationNotes?: string;
}
```

### Visual Layout Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│  Q1: WHERE AM I?                                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 🔮 Business Sphere > Projects > Q1 Planning               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Q2: WHY AM I HERE?                                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Objective: Finalize Q1 marketing budget allocation        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Q3: WHAT'S HAPPENING NOW?                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  [Main content area - status, data, conversation]        │  │
│  │                                                           │  │
│  │  Agents: ░░░░░░░░░░░░░░░░░░ Nova ready                  │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Q4: WHAT CAN I DO NEXT?                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           [ 🎯 Primary Action ]                           │  │
│  │     [Secondary]  [Secondary]  [...]                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# RULE 3 — UNIVERSE VIEW & NAVIGATION POLISH
# ═══════════════════════════════════════════════════════════════════════════════

## Universe View Principles

### Size = Real Importance (Not Raw Frequency)

```typescript
interface SphereVisualSize {
  // NOT based on:
  // - Click frequency
  // - Time spent
  // - Number of items
  
  // BASED on:
  importance: number;        // User-defined priority
  currentRelevance: number;  // Contextual to now
  objectiveWeight: number;   // Active objectives
  
  calculateSize(): number {
    return (
      this.importance * 0.5 +
      this.currentRelevance * 0.3 +
      this.objectiveWeight * 0.2
    );
  }
}
```

### Animation Guidelines

| Animation | Speed | Easing | Purpose |
|-----------|-------|--------|---------|
| Sphere movement | **Slow** (800-1200ms) | ease-out | Calm, predictable |
| Hover response | **Quick** (150-200ms) | ease-in-out | Responsive |
| Focus transition | **Medium** (400-600ms) | ease-out | Intentional |
| Return animation | **Medium** (300-500ms) | ease-in | Always available |

### Breathing Space

```css
.universe-view {
  /* Intentional empty space */
  --sphere-spacing: calc(var(--sphere-size) * 0.4);
  --breathing-room: 15%; /* Minimum empty space */
  
  /* Spheres "breathe" */
  animation: gentle-pulse 4s ease-in-out infinite;
}

@keyframes gentle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

## Micro-Interactions

| Interaction | Result | Feel |
|-------------|--------|------|
| **Hover** | Light preview | Curious, inviting |
| **Click** | Focus on sphere | Intentional |
| **Double-click / Zoom** | Immersion into sphere | Committed |
| **Back** | Always visible, immediate | Safe, in control |

### Critical Rule

> **L'utilisateur ne doit jamais se sentir coincé.**
> The user must NEVER feel trapped.

### Implementation

```typescript
interface NavigationSafety {
  // Always visible
  backButton: {
    visible: 'always';
    position: 'fixed';
    responseTime: '<100ms';
  };
  
  // Escape routes
  escapeOptions: {
    backToUniverse: boolean;  // Always true
    backToPrevious: boolean;  // Always true
    homeShortcut: boolean;    // Always true
  };
  
  // No dead ends
  validateScreen(): boolean {
    return this.hasBackButton() && 
           this.hasEscapeRoute() && 
           this.canAlwaysReturn();
  }
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# RULE 4 — MEETING ROOM 2D COGNITIVE POLISH
# ═══════════════════════════════════════════════════════════════════════════════

## User Feeling Target

> **"Je suis accompagné, pas observé."**
> "I'm being accompanied, not watched."

## Key UX Actions

### 1. Agenda Always Visible

```typescript
interface AgendaDisplay {
  visibility: 'always';  // Even when minimized
  
  states: {
    expanded: AgendaFull;
    minimized: AgendaCompact;  // Still shows current phase
    hidden: never;  // NOT allowed
  };
  
  compact: {
    currentPhase: string;
    progress: number;      // Visual indicator
    timeRemaining?: number;
  };
}
```

### 2. Nova: Discreet, Never Intrusive

```typescript
interface NovaPresence {
  visibility: 'subtle';
  
  behavior: {
    speaksFirst: false;           // Never initiates unprompted
    respondsWhenAsked: true;
    offersHelp: 'only_when_stuck'; // Detects confusion
    
    // Visual presence
    indicator: 'small_avatar';     // Not prominent
    position: 'corner';            // Not center stage
    animation: 'gentle_breathing'; // Alive but calm
  };
  
  interruptionRules: {
    criticalOnly: true;
    userCanDismiss: true;
    neverBlocking: true;
  };
}
```

### 3. Agents Speak Only When Valuable

```typescript
interface AgentSpeakingRules {
  speakWhen: {
    userAsks: true;
    criticalInsight: true;
    decisionRequired: true;
    errorPrevention: true;
  };
  
  dontSpeakWhen: {
    justToConfirm: true;       // No "got it" unless asked
    toShowOff: true;           // No unsolicited analysis
    routineActions: true;      // Silent on common tasks
  };
  
  // Value threshold
  minimumValueScore: 0.7;  // Only speak if value > 0.7
}
```

### 4. Clear Action Buttons

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Meeting in progress...                                          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │              [ 📝 Résumer ]                             │    │
│  │                                                         │    │
│  │      [ ✅ Décider ]      [ ⏸️ Continuer plus tard ]    │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Cognitive Load Indicator

```typescript
interface CognitiveLoadIndicator {
  display: 'visual_meter';
  
  levels: {
    low: {
      color: 'green';
      message: null;  // No message when good
    };
    medium: {
      color: 'yellow';
      message: 'Beaucoup d\'éléments actifs';
    };
    high: {
      color: 'orange';
      message: 'Suggérer une pause?';
      action: 'offer_calm_mode';
    };
    overload: {
      color: 'red';
      message: 'Mode focus recommandé';
      action: 'prompt_focus_mode';
    };
  };
  
  factors: {
    activeAgents: number;
    openThreads: number;
    pendingDecisions: number;
    timeInSession: number;
    interactionVelocity: number;
  };
}
```

### 6. Calm Mode / Focus Mode

```typescript
interface CalmMode {
  name: 'Mode Calme';
  
  activates: {
    reducedUI: true;
    agentsSilent: true;       // Except critical
    notificationsOff: true;
    animationsMinimal: true;
    colorsPastel: true;
  };
  
  shows: {
    currentTask: true;
    essentialActions: true;
    backButton: true;
  };
  
  hides: {
    agentActivity: true;
    secondaryOptions: true;
    analytics: true;
    suggestions: true;
  };
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# RULE 5 — CONSTANT BUT GENTLE FEEDBACK
# ═══════════════════════════════════════════════════════════════════════════════

## Every Action Produces

| Feedback Type | Purpose | Example |
|---------------|---------|---------|
| **Visual** | Micro-animation | Button pulse, checkmark |
| **Logical** | Confirmation | "OK, c'est fait" |
| **Narrative** (sometimes) | Implications | "Voici ce que ça implique" |

## ❌ NEVER

- ❌ Brutal popup
- ❌ Useless alert
- ❌ Anxiety-inducing confirmation
- ❌ Modal that blocks everything
- ❌ Red error without solution

## Feedback Patterns

### Success Feedback

```typescript
interface SuccessFeedback {
  visual: {
    type: 'micro_animation';
    duration: 300;  // ms
    style: 'gentle_pulse' | 'soft_checkmark' | 'subtle_glow';
  };
  
  text: {
    show: boolean;  // Sometimes optional
    message: string;  // "Enregistré" not "Sauvegarde réussie!"
    duration: 2000;  // ms, then fade
    position: 'inline' | 'toast_subtle';
  };
  
  sound: null;  // No sounds by default
}
```

### Error Feedback (Gentle)

```typescript
interface ErrorFeedback {
  visual: {
    type: 'subtle_highlight';
    color: 'soft_red';  // Not alarming
    animation: 'gentle_shake';  // Not aggressive
  };
  
  message: {
    tone: 'helpful';  // Not accusatory
    format: 'problem + solution';
    
    // Good: "Ce champ a besoin d'une valeur. Voici un exemple: ..."
    // Bad: "ERREUR: Champ requis manquant!"
  };
  
  blocking: false;  // Never block unless critical
  dismissable: true;
}
```

### Confirmation Dialogs (When Needed)

```typescript
interface ConfirmationDialog {
  // Only for destructive or significant actions
  triggers: ['delete', 'major_change', 'send_external'];
  
  style: {
    modal: false;  // Prefer inline confirmation
    tone: 'calm';
    colors: 'neutral';  // Not red/alarming
  };
  
  content: {
    question: 'clear_and_simple';  // "Supprimer ce projet?"
    consequence: 'if_helpful';     // Only if not obvious
    actions: ['Annuler', 'Confirmer'];  // Cancel always first
  };
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# RULE 6 — AGENTS UX: NOT ROBOTS
# ═══════════════════════════════════════════════════════════════════════════════

## Agent Behavior Rules

### Must Do

| Behavior | Implementation |
|----------|----------------|
| **Reformulate** | Restate in simpler terms |
| **Propose** | Offer, never demand |
| **Be ignorable** | No penalty for dismissing |

### Must Not

| Avoid | Why |
|-------|-----|
| Explain excessively | Overwhelms |
| Impose | Removes agency |
| Penalize ignoring | Creates anxiety |

## Language Patterns

### ✅ Good Agent UX

```
"Si tu veux, je peux..."
"Une option serait de..."
"Voici ce que je remarque..."
"Tu pourrais considérer..."
"Besoin d'aide avec ça?"
```

### ❌ Bad Agent UX

```
"Tu dois..."
"Il est recommandé de..."
"Erreur: ..."
"Vous devez d'abord..."
"Action requise: ..."
"Il faut absolument..."
```

## Agent Personality Guidelines

```typescript
interface AgentPersonality {
  tone: 'helpful_companion';
  
  traits: {
    humble: true;           // Never arrogant
    patient: true;          // Never rushed
    optional: true;         // Always skippable
    supportive: true;       // Never judgmental
    concise: true;          // Never verbose
  };
  
  avoids: {
    technicalJargon: true;
    longExplanations: true;
    unsolicedAdvice: true;
    repeatingItself: true;
  };
  
  responds: {
    whenAsked: 'immediately';
    whenStuck: 'gently_offers';
    whenError: 'helps_recover';
    otherwise: 'stays_quiet';
  };
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# RULE 7 — RHYTHM & BREATHING
# ═══════════════════════════════════════════════════════════════════════════════

## Intentional Pauses

> **Le silence UX est une fonction, pas un bug.**
> UX silence is a feature, not a bug.

### Introduce Deliberately

| Element | Purpose | Implementation |
|---------|---------|----------------|
| **Visual pauses** | Rest for eyes | Empty space, margins |
| **Slow transitions** | Mental preparation | 400-800ms animations |
| **Silent zones** | Cognitive rest | Areas without info |

### Timing Guidelines

```css
:root {
  /* Transition speeds */
  --transition-instant: 100ms;   /* Direct feedback */
  --transition-quick: 200ms;     /* Hover states */
  --transition-normal: 400ms;    /* Standard transitions */
  --transition-slow: 800ms;      /* Major view changes */
  --transition-deliberate: 1200ms; /* Immersive transitions */
  
  /* Breathing rhythms */
  --breathing-slow: 4s;          /* Ambient animations */
  --breathing-medium: 2s;        /* Subtle pulses */
  
  /* Pause durations */
  --pause-micro: 50ms;           /* Between rapid actions */
  --pause-short: 200ms;          /* Between related actions */
  --pause-medium: 500ms;         /* Between sections */
  --pause-long: 1000ms;          /* Major transitions */
}
```

### Silent Zones

```typescript
interface SilentZone {
  // Areas intentionally free of information
  
  purpose: 'cognitive_rest';
  
  contains: {
    information: false;
    actions: false;
    notifications: false;
  };
  
  locations: [
    'margins',
    'between_sections',
    'after_completion',
    'loading_states'  // Calm, not busy
  ];
}
```

### Loading States (Calm)

```typescript
interface LoadingState {
  style: 'calm_not_busy';
  
  shows: {
    spinner: false;        // No spinning wheels
    progressBar: 'subtle'; // If needed, very subtle
    skeleton: 'gentle';    // Soft pulsing, not harsh
    message: 'reassuring'; // "Un moment..." not "Chargement..."
  };
  
  animation: {
    type: 'gentle_pulse';
    speed: 'slow';
    color: 'muted';
  };
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# RULE 8 — ULTRA-LIGHT ONBOARDING
# ═══════════════════════════════════════════════════════════════════════════════

## Philosophy

> **No long tutorials. Ever.**

### Instead

| Principle | Implementation |
|-----------|----------------|
| 1 key info at a time | Single tooltip/hint |
| Revealed at exact moment needed | Contextual, not front-loaded |
| Always skippable | Never forced |

### Progressive Disclosure

```typescript
interface OnboardingSystem {
  approach: 'progressive_disclosure';
  
  rules: {
    maxInfoAtOnce: 1;
    timing: 'just_in_time';  // Not upfront
    skippable: 'always';
    repeatable: 'on_demand'; // Help always available
  };
  
  triggers: {
    firstUse: 'show_essential_only';
    newFeature: 'subtle_indicator';
    stuck: 'offer_guidance';
    explicit: 'full_help';
  };
  
  formats: {
    tooltip: true;           // Preferred
    coachMark: 'sparingly';
    modal: false;            // Avoid
    tour: false;             // Never forced
  };
}
```

### Onboarding Hints

```typescript
interface OnboardingHint {
  content: string;           // One sentence max
  
  display: {
    style: 'subtle_tooltip';
    position: 'near_element';
    animation: 'fade_in_slow';
  };
  
  dismissal: {
    auto: true;              // Fades after use
    manual: true;            // Click to dismiss
    permanent: true;         // "Don't show again"
  };
  
  timing: {
    showAfter: 'user_hovers' | 'first_interaction' | 'pause_detected';
    hideAfter: 5000;         // ms
  };
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# RULE 9 — QUICK POLISH CHECKLIST
# ═══════════════════════════════════════════════════════════════════════════════

## Screen-by-Screen Validation

Before any screen ships, verify:

| Check | Question | Pass |
|-------|----------|------|
| ✅ | Has ONE clear primary action? | |
| ✅ | Nothing is irreversible without warning? | |
| ✅ | No screen feels scary/overwhelming? | |
| ✅ | Agents never saturate? | |
| ✅ | User can always "go back"? | |
| ✅ | System feels benevolent and calm? | |

## Component Checklist

```typescript
interface UXChecklist {
  // Per screen
  screen: {
    singlePrimaryAction: boolean;
    answersAllFourQuestions: boolean;
    hasBackButton: boolean;
    nothingIrreversible: boolean;
    feelsCalm: boolean;
  };
  
  // Per interaction
  interaction: {
    hasFeedback: boolean;
    feedbackIsGentle: boolean;
    canBeUndone: boolean;
    noModalBlocking: boolean;
  };
  
  // Per agent
  agent: {
    speaksOnlyWhenValuable: boolean;
    canBeIgnored: boolean;
    usesGentleLanguage: boolean;
    neverImposing: boolean;
  };
  
  // Overall
  experience: {
    hasBreathingSpace: boolean;
    transitionsAreSmooth: boolean;
    onboardingIsLight: boolean;
    feelsBenevolent: boolean;
  };
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# FINAL UX PHILOSOPHY
# ═══════════════════════════════════════════════════════════════════════════════

## The CHE·NU Promise

> **CHE·NU ne cherche pas à impressionner.**
> **Il cherche à mettre l'utilisateur dans un état de clarté.**

## Success Metrics

When UX is successful:
1. **User thinks less about the tool** — It becomes invisible
2. **User thinks more clearly** — The tool enhances cognition
3. **User feels supported** — Not watched, not judged
4. **User feels in control** — Can always navigate, undo, escape
5. **User feels calm** — Even in complex tasks

## Design Mantras

```
"Show less, mean more"
"Reveal progressively"
"Accompany, don't impose"
"Silence is a feature"
"Always a way back"
"Calm over impressive"
```

---

## IMPLEMENTATION PRIORITY

| Priority | Rule | Impact |
|----------|------|--------|
| **P0** | Visual Hierarchy (4 Questions) | Foundational |
| **P0** | Always-visible back button | Safety |
| **P0** | Gentle feedback | Trust |
| **P1** | Less on screen | Clarity |
| **P1** | Agents not robots | Relationship |
| **P1** | Cognitive load indicator | Wellbeing |
| **P2** | Rhythm & breathing | Polish |
| **P2** | Ultra-light onboarding | First impression |

---

**END OF UX POLISH GUIDELINES**

*CHE·NU UX Canonical Reference*
*Pro-Service Construction*
