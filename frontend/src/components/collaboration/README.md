# CHE·NU™ Collaboration Module

## 📍 Position dans CHE·NU

```
Business Sphere (ton compte)
 └─ Projects
     └─ CHE·NU Inc.
         └─ Collaboration  ← CE MODULE
             ├─ Overview
             ├─ Meetings
             ├─ Working Sessions
             ├─ Notes & Decisions
             └─ Vision & Principles
```

**Pas un espace global** — C'est dans Business, au niveau projet.

---

## 🎯 Règle d'Or

```
Le Dashboard montre.
Le Workspace fait.
La Collaboration construit.
```

---

## 📁 Structure des Fichiers

```
collaboration/
├── index.ts                          # Export principal
├── collaboration.types.ts            # Types TypeScript (~250 lignes)
├── CollaborationSpace.tsx            # Composant principal
├── CollaborationOverview.tsx         # Section Overview
├── CollaborationMeetings.tsx         # Section Meetings
├── CollaborationWorkingSessions.tsx  # Section Working Sessions
├── CollaborationNotesDecisions.tsx   # Section Notes & Decisions
├── CollaborationVisionPrinciples.tsx # Section Vision & Principles
├── InviteCollaboratorModal.tsx       # Modal d'invitation
└── CollaborationDemo.tsx             # Démo standalone
```

**Total: ~108KB, ~2500 lignes de code**

---

## 🧱 Les 5 Sections

### 1. Overview
- Vision courte (5-6 lignes)
- Objectifs actuels
- Prochain meeting
- Dernières décisions
- ❌ Pas de graphiques
- ❌ Pas de stats business

### 2. Meetings
- Upcoming / Past
- Structure: Context → Agenda → Notes → Decisions → Action Items
- ✔ Chaque meeting produit une trace

### 3. Working Sessions
- Active / Planned / Completed
- Structure: Goal → Scope → Participants → Notes → Outputs
- 👉 Une session = un objectif clair

### 4. Notes & Decisions
- Categories: Decision, Design Choice, Rejected Option, Open Question
- ✔ Ultra important pour éviter les débats cycliques

### 5. Vision & Principles
- Mission, Values, Design Principles, Ethical Boundaries, Non-Negotiables
- 👉 Ce qui ne change pas

---

## 🔐 Rôles & Permissions

| Rôle | Droits |
|------|--------|
| Observer | Lire |
| Contributor | Participer, écrire |
| Facilitator | Créer meetings, valider décisions |

❌ Pas de rôles complexes
❌ Pas d'admin inutile

---

## 🤖 Règles Agents

```typescript
const COLLABORATION_AGENT_RULES = {
  default_enabled: false,  // Désactivés par défaut!
  
  allowed_actions: [
    'take_notes',
    'summarize', 
    'remind_decisions',
  ],
  
  forbidden_actions: [
    'make_decisions',        // ❌ Jamais décider
    'send_external_messages', // ❌ Jamais envoyer
    'modify_vision',         // ❌ Pas toucher Vision
    'invite_collaborators',  // ❌ Seul humain peut inviter
  ],
};
```

👉 **L'humain reste central.**

---

## 🚀 Usage

```tsx
import { CollaborationSpace } from './components/collaboration';

<CollaborationSpace
  collaboration={collaborationData}
  onBack={() => navigateToProject()}
  currentUserId={userId}
  isOwner={isOwner}
/>
```

---

## 📧 Système d'Invitation

Le modal `InviteCollaboratorModal` permet d'inviter:

1. **Par recherche** — Utilisateurs CHE·NU existants
2. **Par email** — Invitation externe (crée compte si nécessaire)

---

## 🎨 Design System

Utilise les couleurs CHE·NU officielles:

```typescript
CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
}
```

---

## ✅ Conformité R&D

- ✅ Rule #1: Human Sovereignty — Human gates partout
- ✅ Rule #2: Autonomy Isolation — Agents limités
- ✅ Rule #3: Sphere Integrity — Dans Business, pas global
- ✅ Rule #5: Social Restrictions — Pas de ranking/engagement
- ✅ Rule #6: Traceability — Audit trail sur tout

---

**Créé:** 28 Décembre 2025
**Par:** Claude + Jonathan
**Version:** 1.0
