# CHE·NU™ — ANALYSE D'ÉCART (GAP ANALYSIS)
## Alignement Code vs Architecture Canonique

---

## 📊 RÉSUMÉ EXÉCUTIF

| Domaine | Status | Action Requise |
|---------|--------|----------------|
| **Sphères** | ⚠️ Partiel | Ajouter distinction type |
| **Hiérarchie** | ❌ Manquant | Implémenter niveaux |
| **UniverseView** | ⚠️ Partiel | Refactoriser |
| **Agents Minimaux** | ❌ Manquant | Créer 5 agents core |
| **Props/Types** | ⚠️ Partiel | Mettre à jour |

---

## 1️⃣ SPHÈRES — Écarts Identifiés

### Configuration Actuelle
```typescript
// SPHERES_BUREAUX_CANONICAL.ts
type SphereId = 
  | 'personal' | 'business' | 'government' | 'studio'
  | 'community' | 'social' | 'entertainment' | 'team' | 'scholar';
```

### Configuration Requise (Canonique)
```typescript
// Ajouter distinction de type
type SphereType = 'personal' | 'team' | 'contextual';

interface SphereConfig {
  id: SphereId;
  type: SphereType;          // 🆕 NOUVEAU
  orbitLevel: 0 | 1 | 2;     // 🆕 NOUVEAU
  // ... autres propriétés
}

// Personal = orbitLevel 0, type 'personal'
// My Team = orbitLevel 1, type 'team'
// Autres = orbitLevel 2, type 'contextual'
```

### ⚠️ ÉCARTS
| Élément | Actuel | Requis |
|---------|--------|--------|
| `type` | ❌ Absent | ✅ 'personal' / 'team' / 'contextual' |
| `orbitLevel` | ❌ Absent | ✅ 0 / 1 / 2 |
| Statut spécial My Team | ❌ Traité comme sphère normale | ✅ Sphère spéciale |

---

## 2️⃣ HIÉRARCHIE — Écarts Identifiés

### Architecture Actuelle
```
Toutes les sphères sont au même niveau
↓
Grille plate dans UniverseView
```

### Architecture Requise
```
PERSONAL (centre - niveau 0)
   ↓
MY TEAM (premier anneau - niveau 1)
   ↓
CONTEXTUAL SPHERES (second anneau - niveau 2)
```

### ⚠️ ÉCARTS
| Élément | Actuel | Requis |
|---------|--------|--------|
| Hiérarchie visuelle | ❌ Grille plate | ✅ Anneaux concentriques |
| Personal au centre | ❌ Dans la grille | ✅ Toujours centré |
| My Team spéciale | ❌ Comme les autres | ✅ Premier anneau |

---

## 3️⃣ UNIVERSE VIEW — Écarts Identifiés

### Implémentation Actuelle
```typescript
// UniverseView.tsx actuel
export default function UniverseView() {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
      {SPHERES.map((s) => <SphereCard ... />)}
    </section>
  );
}
```

### Implémentation Requise
```typescript
type UniverseViewProps = {
  userId: string;
  personal: { id: "personal"; state: "active" };
  spheres: SphereNode[];
  focusedSphereId?: SphereId | null;
  viewMode: "overview" | "focus";
  interactionMode: "idle" | "hover" | "focus";
  permissions: { canActivateSphere: boolean; canEditTeam: boolean };
};
```

### ⚠️ ÉCARTS
| Élément | Actuel | Requis |
|---------|--------|--------|
| Props typées | ❌ Aucune | ✅ UniverseViewProps |
| viewMode | ❌ Absent | ✅ 'overview' / 'focus' |
| focusedSphereId | ❌ Absent | ✅ Présent |
| États visuels | ❌ Un seul | ✅ latent / active / focus |
| Layout | ❌ Grille | ✅ Concentrique |

---

## 4️⃣ AGENTS MINIMAUX — Écarts Identifiés

### Configuration Actuelle
```typescript
// agents.config.ts
- NOVA (Central Orchestrator) ✅
- L1 Directors (par sphère)
- L2 Managers
- L3 Specialists
```

### Configuration Requise (Canonique)
```
5 AGENTS MINIMAUX OBLIGATOIRES:
1. Personal Core Agent (identité)
2. Team Coordination Agent (collaboration)
3. Memory Governance Agent (mémoire)
4. Validation & Trust Agent (audit)
5. System Orchestrator (routing)
```

### ⚠️ ÉCARTS
| Agent Requis | Status Actuel |
|--------------|---------------|
| Personal Core Agent | ❌ Absent (dir-personal est différent) |
| Team Coordination Agent | ❌ Absent |
| Memory Governance Agent | ❌ Absent |
| Validation & Trust Agent | ❌ Absent |
| System Orchestrator | ⚠️ NOVA existe mais rôle différent |

---

## 5️⃣ RELATIONS — Écarts Identifiés

### Implémentation Actuelle
```
Sphères indépendantes
Pas de parent explicite
```

### Implémentation Requise
```typescript
type SphereNode = {
  relations: {
    parent: "personal" | "my_team";
    linkedToTeam: boolean;
  };
};
```

### ⚠️ ÉCARTS
| Élément | Actuel | Requis |
|---------|--------|--------|
| `parent` | ❌ Absent | ✅ Obligatoire |
| `linkedToTeam` | ❌ Absent | ✅ Obligatoire |
| Relations explicites | ❌ Non | ✅ Oui |

---

## 📋 PLAN DE CORRECTION

### Phase 1: Configuration (Priorité Haute)
1. ✅ Mettre à jour `SPHERES_BUREAUX_CANONICAL.ts`
   - Ajouter `type: SphereType`
   - Ajouter `orbitLevel: 0 | 1 | 2`
   - Marquer My Team comme spéciale

2. ✅ Créer `MINIMAL_AGENTS.ts`
   - Définir les 5 agents minimaux
   - Spécifier leurs responsabilités

### Phase 2: Types (Priorité Haute)
1. ✅ Créer `UniverseViewTypes.ts`
   - `UniverseViewProps`
   - `SphereNode`
   - `SphereType`
   - `SphereState`

### Phase 3: UniverseView (Priorité Moyenne)
1. ⚠️ Refactoriser `UniverseView.tsx`
   - Implémenter layout concentrique
   - Personal toujours au centre
   - My Team en premier anneau
   - États visuels (latent/active/focus)

### Phase 4: Relations (Priorité Moyenne)
1. ⚠️ Implémenter relations parent
2. ⚠️ Implémenter liens My Team

---

## ✅ CE QUI EST DÉJÀ CORRECT

- ✅ 9 Sphères définies
- ✅ Couleurs canoniques
- ✅ Descriptions FR/EN
- ✅ Bureaux flexibles (6 max)
- ✅ NOVA existe

---

## 📁 FICHIERS À MODIFIER

| Fichier | Action |
|---------|--------|
| `SPHERES_BUREAUX_CANONICAL.ts` | Ajouter type + orbitLevel |
| `agents.config.ts` | Ajouter 5 agents minimaux |
| `UniverseView.tsx` | Refactoriser layout |
| `types/index.ts` | Ajouter nouveaux types |
| `universe.config.ts` | Mettre à jour règles |

---

**FIN DE L'ANALYSE D'ÉCART**
