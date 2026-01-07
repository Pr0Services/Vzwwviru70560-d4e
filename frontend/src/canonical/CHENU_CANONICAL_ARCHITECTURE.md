# CHE·NU™ — ARCHITECTURE CANONIQUE
## Document Officiel — VERROUILLÉ

---

# 🧭 SECTION 1: STRUCTURE DES SPHÈRES

## PRINCIPE FONDAMENTAL

CHE·NU est centré sur la personne.
Tout le reste est contextuel, relationnel et évolutif.
La map ne représente pas des fonctionnalités,
elle représente des **contextes de responsabilité**.

---

## 🔴 CENTRE ABSOLU — PERSONAL

| Attribut | Valeur |
|----------|--------|
| **Statut** | Centre identitaire |
| **Visibilité** | Toujours présent |
| **État** | Toujours actif |
| **Position** | Jamais déplacé |

### Rôle
- Porte l'identité
- Porte la mémoire
- Porte la responsabilité
- Porte le sens

### Règles NON-NÉGOCIABLES
- Aucun contexte n'existe sans Personal
- Aucune sphère ne peut exister indépendamment
- Toute navigation commence et revient ici

---

## 🔵 PREMIER ANNEAU — MY TEAM (Sphère Spéciale)

| Attribut | Valeur |
|----------|--------|
| **Statut** | Sphère officielle à statut spécial |
| **Type** | Transversale, relationnelle, structurante |
| **Subordination** | Toujours subordonnée à Personal |

### Rôle
- Gestion des humains
- Gestion des agents
- Définition des rôles
- Coordination du travail
- **Lieu explicite du collectif**

### Règles NON-NÉGOCIABLES
- Toute collaboration passe par My Team
- Aucune sphère collaborative sans My Team
- My Team peut être vide (solo), mais jamais inexistante
- Plus proche du centre que toutes les autres sphères

### Ce qui la distingue
- **N'est PAS une sphère métier**
- Interagit avec toutes les autres sphères
- N'est pas optionnelle au même niveau
- A un statut visuel et logique distinct

---

## 🌐 SECOND ANNEAU — SPHÈRES CONTEXTUELLES

### Liste Officielle (FROZEN)
| # | Sphère | Icône | Type |
|---|--------|-------|------|
| 1 | Enterprise | 💼 | Métier |
| 2 | Design Studio | 🎨 | Métier |
| 3 | Social | 📱 | Social |
| 4 | Community | 👥 | Social |
| 5 | Government | 🏛️ | Institutionnel |
| 6 | Scholars | 🎓 | Recherche |
| 7 | Entertainment | 🎬 | Loisirs |

### Caractéristiques
- Optionnelles
- Activables dans le temps
- Non toutes visibles par défaut
- Dépendantes de Personal
- Ne se relient pas entre elles sans My Team

---

## 🔗 RÈGLES DE RELATION (STRICTES)

### Règle 1 — Hiérarchie Explicite
```
PERSONAL
   ↓
MY TEAM
   ↓
CONTEXTUAL SPHERES
```
- Rien n'est plat
- Rien n'est égalitaire
- La hiérarchie est visible

### Règle 2 — Aucune Relation Cachée
- Pas de lien sphère ↔ sphère direct
- Pas de collaboration implicite
- Tout lien collectif passe par My Team
- Tout sens passe par Personal

### Règle 3 — Progressivité
- Tout n'est pas visible au départ
- La map se construit avec le temps
- L'utilisateur "mérite" les sphères par usage réel

---

# 🎛️ SECTION 2: UNIVERSE VIEW

## Responsabilité

UniverseView est une **vue relationnelle**.

### DOIT représenter:
- Des contextes
- Des relations hiérarchiques
- Des états d'activation

### NE DOIT PAS:
- Servir de menu
- Lister des fonctionnalités
- Exposer toute la complexité d'un coup

---

## Props TypeScript

```typescript
type UniverseViewProps = {
  userId: string;

  personal: {
    id: "personal";
    state: "active"; // always active
  };

  spheres: SphereNode[];

  focusedSphereId?: SphereId | null;

  viewMode: "overview" | "focus";

  interactionMode: "idle" | "hover" | "focus";

  permissions: {
    canActivateSphere: boolean;
    canEditTeam: boolean;
  };
};
```

---

## Type SphereNode

```typescript
type SphereNode = {
  id: SphereId;
  label: string;
  type: "personal" | "team" | "contextual";

  state: "latent" | "active" | "focus";

  relations: {
    parent: "personal" | "my_team";
    linkedToTeam: boolean;
  };

  visual: {
    orbitLevel: 0 | 1 | 2;
    priority: number;
  };

  meta?: {
    createdAt?: string;
    lastActiveAt?: string;
    activityScore?: number;
  };
};
```

---

## États Visuels

### 💤 LATENT
- Visibilité réduite ou cachée
- Pas d'interaction directe
- Pas de label dominant

### 🟢 ACTIVE
- Visible
- Reliée
- Interaction possible

### 🎯 FOCUS
- Mise en avant visuelle
- Les autres sphères se retirent
- Personal reste visible
- My Team reste visible si pertinente

---

## Interactions Autorisées

| Action | Effet |
|--------|-------|
| **Hover** | Révèle les relations, met en évidence le chemin |
| **Click** | Active le focus, change viewMode |
| **Exit focus** | Retour fluide vers Personal |

## Interactions INTERDITES

- ❌ Drag libre non contraint
- ❌ Zoom infini
- ❌ Multi-focus
- ❌ Liens directs sphère ↔ sphère
- ❌ Activation automatique

---

# 🤖 SECTION 3: AGENTS MINIMAUX

## Principe

CHE·NU ne fonctionne pas par accumulation d'agents,
mais par **responsabilités clairement séparées**.

Ces agents sont **OBLIGATOIRES**, toujours présents.

---

## 🔴 1. PERSONAL CORE AGENT

| Attribut | Valeur |
|----------|--------|
| **Nom canonique** | Personal Core Agent |
| **Rôle** | Identité & Responsabilité |

### Ce qu'il fait
- Maintient la cohérence du Personal
- Centralise les décisions validées
- Point d'entrée logique pour tout raisonnement

### Ce qu'il NE fait PAS
- Pas d'autonomie
- Pas d'exécution
- Pas de décisions finales

**👉 Sans lui, CHE·NU n'a pas de centre.**

---

## 🔵 2. TEAM COORDINATION AGENT

| Attribut | Valeur |
|----------|--------|
| **Nom canonique** | Team Coordination Agent |
| **Rôle** | Collaboration |

### Ce qu'il fait
- Maintient la cohérence collective
- Route les actions collaboratives
- Applique les règles de collaboration

### Ce qu'il NE fait PAS
- Pas de décisions métier
- Pas d'autorité sur le Personal

**👉 Sans lui, la collaboration devient implicite (interdit).**

---

## 🟣 3. MEMORY GOVERNANCE AGENT

| Attribut | Valeur |
|----------|--------|
| **Nom canonique** | Memory Governance Agent |
| **Rôle** | Gouvernance de la mémoire |

### Ce qu'il fait
- Applique les règles de mémoire
- Empêche toute écriture silencieuse
- Trace les décisions mémorielles

### Ce qu'il NE fait PAS
- Pas d'interprétation libre
- Pas de résumé sans validation

**👉 Sans lui, CHE·NU viole ses propres Tree Laws.**

---

## ⚖️ 4. VALIDATION & TRUST AGENT

| Attribut | Valeur |
|----------|--------|
| **Nom canonique** | Validation & Trust Agent |
| **Rôle** | Audit & Compliance |

### Ce qu'il fait
- Valide les décisions critiques
- Bloque les dérives
- Génère des traces auditables

### Ce qu'il NE fait PAS
- Pas de création
- Pas de suggestion métier

**👉 Sans lui, CHE·NU devient un assistant classique.**

---

## 🧭 5. SYSTEM ORCHESTRATOR

| Attribut | Valeur |
|----------|--------|
| **Nom canonique** | System Orchestrator (Minimal) |
| **Rôle** | Routing uniquement |

⚠️ **Ce n'est PAS un super-cerveau.**

### Ce qu'il fait
- Délègue
- Séquence
- Coordonne

### Ce qu'il NE fait PAS
- Pas de raisonnement métier
- Pas de décision
- Pas de mémoire propre

**👉 Sans lui, le système est chaotique.**

---

## Relation Entre Agents

```
User
 ↓
Personal Core Agent
 ↓
System Orchestrator
 ↓
 ├─ Memory Governance Agent
 ├─ Validation & Trust Agent
 └─ Team Coordination Agent
```

### Règles
- Le Personal Core reste l'autorité logique
- L'orchestrateur ne décide jamais
- La mémoire est toujours surveillée
- La validation est toujours possible

---

## Ce qui N'EST PAS dans le minimum

- ❌ Agents métier (Enterprise, Design, etc.)
- ❌ Agents créatifs
- ❌ Agents analytics
- ❌ Agents automation

👉 Ils sont débloqués plus tard, par sphère.

---

# 🚫 SECTION 4: RÈGLES DE VÉRITÉ

## Déviation = Bug

Si l'un de ces éléments est violé, c'est un bug:

```
If:
- Personal disappears
- My Team is treated as a normal sphere
- All spheres are visible by default
- Spheres connect directly
- UniverseView looks like a menu
- One minimal agent is missing
- Memory writes without governance
- Collaboration bypasses My Team

Then:
❌ This is NOT CHE·NU
```

---

# ✅ SECTION 5: RÉSUMÉ VERROUILLÉ

| Élément | Status |
|---------|--------|
| Personal = Centre absolu | 🔒 LOCKED |
| My Team = Sphère spéciale | 🔒 LOCKED |
| 7 Sphères contextuelles | 🔒 LOCKED |
| Hiérarchie explicite | 🔒 LOCKED |
| UniverseView = Vue relationnelle | 🔒 LOCKED |
| 5 Agents minimaux | 🔒 LOCKED |
| Pas de relations cachées | 🔒 LOCKED |
| Progressivité obligatoire | 🔒 LOCKED |

---

**FIN DU DOCUMENT CANONIQUE**
**Version: 1.0**
**Date: 2025-01-01**
