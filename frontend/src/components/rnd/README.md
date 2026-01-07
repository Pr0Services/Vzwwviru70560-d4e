# CHE·NU™ R&D Workspace Module

> **"L'interface structure la pensée. L'agent éclaire la complexité. L'humain assume la décision."**

## Overview

The R&D Workspace is a specialized workspace within CHE·NU for structured research and decision-making. It implements a 6-phase methodology with strict agent controls and optional quantitative analysis modules.

**Access Path:** Dashboard → Workspaces → R&D Workspace

## Architecture

```
rnd-workspace/
├── index.ts                      # Clean exports
├── rnd-workspace.types.ts        # TypeScript type definitions
├── RnDWorkspace.tsx              # Main container component
├── RnDPhase1Exploration.tsx      # 🔵 Exploration phase
├── RnDPhase2Selection.tsx        # 🟡 Selection phase
├── RnDPhase3Examples.tsx         # 🟢 Examples phase
├── RnDPhase4Comparison.tsx       # 🟠 Comparison phase
├── RnDPhase5Refinement.tsx       # 🔴 Refinement phase
├── RnDPhase6Decision.tsx         # 🟣 Decision phase
├── RnDAgentPanel.tsx             # Agent interaction panel
├── QuantitativeModulesModal.tsx  # Quantitative analysis tools
└── README.md                     # This file
```

## The 6 Phases

### Phase 1: Exploration 🔵
**Objective:** Capture ideas without filtering

- **Idea Types:** 💡 Idea, ❓ Question, 🔬 Hypothesis, ✨ Inspiration
- **Rules:**
  - NO hierarchy imposed
  - NO scoring at this stage
  - NO deletion allowed
  - Agent can regroup and identify themes

### Phase 2: Selection 🟡
**Objective:** Filter and prioritize ideas

- **Criteria Configuration:** Customizable weights (feasibility, impact, cost, risk)
- **Voting System:** 5-star rating per criterion
- **Rules:**
  - Justification OBLIGATORY for selection
  - Rejection reason OBLIGATORY
  - Rejected ideas remain VISIBLE in archive
  - Scores are indicative, not deterministic

### Phase 3: Examples 🟢
**Objective:** Concretize and test with scenarios

- **Scenario Types:** 📋 Standard, ⚠️ Edge Case, 🔄 Counter-example, 🔬 Simulation
- **Hypothesis Testing:** Each scenario tests a specific hypothesis
- **Agent Capabilities:**
  - Generate variants
  - Propose counter-examples
  - Run parametric simulations

### Phase 4: Comparison 🟠
**Objective:** Systematically compare solutions

- **Comparison Matrix:** Solutions × Criteria with weighted scores
- **Rankings:** Visual ranking with scores
- **Disagreements:** Documented (not erased!) conflicts between evaluators
- **Quantitative Modules Available:**
  - Decision Matrix
  - Sensitivity Analysis

### Phase 5: Refinement 🔴
**Objective:** Iterate and optimize selected solutions

- **Version Tracking:** Every iteration logged with version number
- **Iteration Form:** Changes + Justification required
- **Risk Detection:** Automatic and manual risk flagging
- **Agent Suggestions:** Optimization hints (human validates)
- **Timeline:** Visual history of iterations

### Phase 6: Decision 🟣
**Objective:** Finalize and formalize the decision

- **Final Decision:** Formal statement with detailed rationale
- **Rejected Hypotheses:** Archive of what was explored and why discarded
- **Outputs:** Documents, action plans, next steps
- **Lessons Learned:** What to remember for future R&D
- **Traceability:** Complete audit trail from Phase 1 to 6

## Agent Rules (Non-Negotiable)

```typescript
const RND_AGENT_RULES = {
  role: 'analyst_and_cognitive_accelerator',
  never_decides: true,
  forbidden: [
    'make_final_decision',      // Agent NEVER decides
    'delete_ideas',             // Ideas cannot be deleted
    'impose_score',             // Scores are suggestions only
    'act_without_explicit_request'  // Only on-demand
  ],
  capabilities_per_phase: {
    1: ['regroup_ideas', 'reformulate', 'identify_themes'],
    2: ['comparative_synthesis', 'highlight_disagreements'],
    3: ['generate_variants', 'propose_counter_examples', 'simulate_scenarios'],
    4: ['comparative_analysis', 'synthesis_pros_cons', 'detect_inconsistencies'],
    5: ['optimization_suggestions', 'detect_hidden_risks', 'coherence_check'],
    6: ['final_synthesis', 'executive_summary', 'vigilance_points']
  }
};
```

## Quantitative Modules

Available on-demand to support (not replace) human judgment:

| Module | Phases | Complexity | Description |
|--------|--------|------------|-------------|
| Decision Matrix | 4-5 | Simple | Weighted multi-criteria evaluation |
| Weighted Scoring | 3-5 | Simple | Composite score calculation |
| Parametric Simulation | 3-5 | Medium | Explore parameter variations |
| Sensitivity Analysis | 4-5 | Medium | Identify high-impact parameters |
| Probabilistic Estimation | 3-5 | Advanced | PERT-based confidence intervals |

## Design System

### Colors

```typescript
const CHENU_COLORS = {
  // Brand
  sacredGold: '#D4AF37',
  ancientStone: '#8B7355',
  cenoteTurquoise: '#40E0D0',
  nightSlate: '#1E1F22',
  deepBlue: '#1E3A5F',
  
  // Phase-specific
  explorationBlue: '#3B82F6',
  selectionYellow: '#EAB308',
  examplesGreen: '#22C55E',
  comparisonOrange: '#F97316',
  refinementRed: '#EF4444',
  decisionPurple: '#A855F7',
};
```

### Dark Mode Native
- Background: `#111113`
- Card: `#1E1F22`
- Border: `rgba(255,255,255,0.1)`

## Usage

```tsx
import { RnDWorkspace } from '@/components/rnd-workspace';

// In your workspace router
<Route path="/workspaces/rnd/:projectId" element={<RnDWorkspace />} />
```

### Creating a New R&D Project

```typescript
const newProject: RnDProject = {
  id: crypto.randomUUID(),
  title: 'AI Integration Strategy',
  domain: 'product',
  objective: 'Define the optimal AI integration approach for Q2',
  currentPhase: 1,
  createdAt: new Date(),
  createdBy: userId,
  status: 'active',
  phaseData: {
    1: { ideas: [], themes: [], lastActivity: null },
    2: { criteria: [], votes: {}, selections: [], rejections: [], lastActivity: null },
    // ... other phases
  },
  traceability: [],
};
```

## Key Features

### Traceability
Every action is logged with:
- `actor`: Who performed it
- `action`: What was done
- `timestamp`: When it happened
- `phaseAtTime`: Phase when action occurred
- `details`: Contextual information

### Phase Progression
- Cannot skip phases
- Cannot advance without required data:
  - Phase 1 → 2: At least 3 ideas
  - Phase 2 → 3: At least 1 selection
  - Phase 3 → 4: At least 2 scenarios
  - Phase 4 → 5: At least 2 evaluated solutions
  - Phase 5 → 6: At least 1 iteration

### Rejected Ideas Visibility
Rejected ideas in Phase 2 are ALWAYS visible in an archive section.
This preserves the reasoning path and prevents re-exploration of discarded options.

### Version Tracking
Phase 5 implements explicit version tracking for iterations:
- `v1.0`, `v1.1`, `v2.0`...
- Each version documents changes and justification
- Timeline visualization shows evolution

## File Statistics

| File | Lines | Size |
|------|-------|------|
| rnd-workspace.types.ts | ~650 | 15.5 KB |
| RnDWorkspace.tsx | ~550 | 19.6 KB |
| RnDPhase1Exploration.tsx | ~400 | 14.5 KB |
| RnDPhase2Selection.tsx | ~550 | 19.2 KB |
| RnDPhase3Examples.tsx | ~450 | 19.6 KB |
| RnDPhase4Comparison.tsx | ~500 | 19.9 KB |
| RnDPhase5Refinement.tsx | ~500 | 21.3 KB |
| RnDPhase6Decision.tsx | ~550 | 42.4 KB |
| RnDAgentPanel.tsx | ~500 | 17.0 KB |
| QuantitativeModulesModal.tsx | ~600 | 22.5 KB |
| **Total** | **~5,250** | **~211 KB** |

## Integration Points

### With Dashboard
```tsx
// In Dashboard workspaces list
{
  id: 'rnd-workspace',
  name: 'R&D Workspace',
  icon: '🔬',
  description: 'Structured research and decision-making',
  path: '/workspaces/rnd',
}
```

### With Business Sphere
R&D Workspace projects can be linked to Business Sphere projects for strategic alignment.

### With Scholar Sphere
Research outputs can flow into Scholar Sphere for academic documentation.

## Best Practices

1. **Don't rush through phases** - Each phase has a purpose
2. **Use the agent sparingly** - It accelerates, doesn't replace thinking
3. **Document disagreements** - They're valuable data, not noise
4. **Justify rejections** - Future you will thank present you
5. **Use quantitative modules** - But interpret, don't just accept numbers

## Golden Rules

> "L'interface structure la pensée."
> The interface structures thought.

> "L'agent éclaire la complexité."
> The agent illuminates complexity.

> "L'humain assume la décision."
> The human owns the decision.

---

**CHE·NU™ R&D Workspace v1.0**
*Governed Intelligence Operating System*

© 2025 CHE·NU. All rights reserved.
