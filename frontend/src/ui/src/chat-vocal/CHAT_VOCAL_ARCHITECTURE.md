# 💬 CHE·NU — Chat & Vocal Architecture
## Interface de Pilotage Cognitif

> **Principe fondamental:** Le chat est la source de vérité.
> Ce qui n'est pas écrit n'existe pas.

---

## 1. Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    HUMAN (Pilote)                           │
│  🎤 Parle → Transcrit → Confirme → Envoie                   │
│  ⌨️ Écrit → Envoie directement                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 CHAT INTERFACE                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Message Thread (Source of Truth)                     │    │
│  │ ├─ [USER] "Prépare-moi un devis pour le client X"   │    │
│  │ ├─ [AGENT:Nova] "Compris. Je prépare le devis..."   │    │
│  │ ├─ [AGENT:Finance] "Budget estimé: 45,000$"         │    │
│  │ └─ [SYSTEM] Task created: DEVIS-2024-001            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ 🎤 Vocal     │  │ ⌨️ Text      │  │ 📎 Files     │       │
│  │   Input      │  │   Input      │  │   Attach     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              AGENT INBOXES (Per-Agent)                       │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ 🤖 Nova     │  │ 💰 Finance  │  │ 📋 Project  │          │
│  │ Inbox: 3    │  │ Inbox: 1    │  │ Inbox: 5    │          │
│  │ Tasks: 2    │  │ Tasks: 0    │  │ Tasks: 3    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Principes Clés

### 2.1 Chat = Source de Vérité

| Règle | Description |
|-------|-------------|
| **Persistence** | Tout message est stocké et horodaté |
| **Immutabilité** | Messages ne peuvent pas être modifiés (seulement annotés) |
| **Traçabilité** | Chaque action découle d'un message |
| **Référençabilité** | Chaque message a un ID unique |

### 2.2 Vocal = Accélérateur (Pas Source de Vérité)

```
🎤 Parler → 📝 Transcrire → ✅ Confirmer → 💬 Envoyer
```

Le vocal n'est JAMAIS source de vérité directe:
- Transcription affichée pour validation
- L'utilisateur confirme avant envoi
- Le message texte résultant EST la source de vérité

### 2.3 Une Inbox par Agent

Chaque agent a sa propre inbox avec:
- Messages reçus
- Tâches assignées
- Context thread (fil de discussion)

---

## 3. Types de Messages

```typescript
type MessageType =
  | 'TASK'              // Demande d'action
  | 'NOTE'              // Information passive
  | 'COMMENT'           // Réaction à un message
  | 'QUESTION'          // Demande de clarification
  | 'DECISION'          // Choix validé
  | 'VOICE_TRANSCRIPT'; // Transcription vocale confirmée
```

---

## 4. Flux de Communication

### 4.1 Human → Agent

```
Human écrit/parle → Message créé → Routé vers Agent(s)
                                 → Task créée si applicable
                                 → Notification envoyée
```

### 4.2 Agent → Human

```
Agent produit output → Message créé → Affiché dans thread
                                    → Notification si urgent
                                    → Attend validation si requis
```

### 4.3 Agent → Agent

```
Agent A demande → Message interne → Agent B reçoit
                                  → Traçabilité complète
                                  → Human peut observer
```

---

## 5. Intégration avec Spheres & Meetings

### 5.1 Chat dans une Sphere

Chaque sphere a son propre canal de chat contextuel:
- Messages filtrés par domaine
- Agents de la sphere prioritaires
- Context automatique

### 5.2 Chat dans un Meeting

Le meeting room a un chat dédié:
- Participants visibles
- Phases reflétées dans le chat
- Décisions enregistrées comme messages spéciaux

---

## 6. Gouvernance

### 6.1 Règles Immuables

1. **Aucun message supprimé** — seulement archivé
2. **Aucune modification** — seulement annotations
3. **Horodatage système** — non modifiable
4. **Attribution claire** — source toujours identifiée

### 6.2 Permissions

| Rôle | Peut Écrire | Peut Annoter | Peut Archiver |
|------|-------------|--------------|---------------|
| Human | ✅ | ✅ | ✅ |
| Agent L0-L1 | ✅ | ✅ | ❌ |
| Agent L2-L5 | ✅ | ❌ | ❌ |
| System | ✅ | ✅ | ✅ |

---

## 7. Implémentation

Voir les fichiers:
- `types.ts` — Types TypeScript
- `components.tsx` — Composants React
- `api-hooks.ts` — API client + hooks

---

**END OF CHAT & VOCAL ARCHITECTURE**
