# 📜 CHE·NU CORE REFERENCE

> **CONSTITUTION IMMUABLE DU SYSTÈME**

Ce dossier contient les **lois déclaratives** qui gouvernent tout le comportement de CHE·NU.  
**Aucun code ne doit prendre de décision** — tout comportement provient de ces fichiers JSON.

---

## 📁 Structure

```
core-reference/
├── dimension.engine.json    # Règles de résolution des dimensions
├── universe.map.json        # Topologie de l'univers et placement des sphères
├── spheres/                 # Configuration de chaque sphère
│   ├── personal.json
│   ├── business.json
│   ├── creative.json
│   ├── scholar.json
│   └── ...
├── themes/                  # Définitions visuelles des thèmes
└── permissions/             # Matrices de permissions
```

---

## 🧮 dimension.engine.json

Définit les règles de résolution pour transformer un **contexte** en **dimensions résolues**.

### Entrées (Context)
- `content` — Volume de contenu (items, agents, processus)
- `activity` — Niveau d'activité (temps depuis interaction, actions/min)
- `complexity` — Complexité de l'utilisateur/contexte
- `permission` — Niveau de permission de l'utilisateur

### Sorties (Resolved)
- `scale` — Facteur de taille (0.6 → 1.6)
- `visibility` — Opacité (0 → 1)
- `motion` — Type d'animation et intensité
- `density` — Niveau de détail UI
- `depthAllowed` — Profondeur de navigation autorisée

### Mode de Résolution
```
resolution.mode = "multiplicative"
```
Les facteurs sont **multipliés** entre eux :
```
finalScale = content.scale × depth.scaleFactor^level
finalVisibility = activity.visibility × permission.visibility × depth.visibilityFactor^level
```

---

## 🗺️ universe.map.json

Définit la **topologie** de l'univers CHE·NU :
- Position du tronc central (NOVA)
- Placement angulaire des sphères
- Couches (core, extended, peripheral)
- Types de connexions

---

## 🔮 spheres/*.json

Chaque sphère a sa propre configuration :
- `visual` — Forme, couleur, axe de croissance
- `layout` — Dimensions min/max, arrangement
- `behavior` — Réactions (onFocus, onEnter, onIdle, onActive)
- `rules` — Règles spécifiques à la sphère

---

## ⚖️ RÈGLES D'OR

1. **JAMAIS de hardcoding** — Tout comportement vient d'un JSON
2. **Le Resolver est PUR** — Même entrée = même sortie, toujours
3. **Pas de dépendances UI** — Le resolver ignore React, DOM, CSS
4. **Extension par JSON** — Besoin d'une feature? Ajoute une règle JSON
5. **Testable à 100%** — Chaque fonction peut être testée unitairement

---

## 🔄 Flux de Données

```
┌─────────────────────┐
│  core-reference/    │  ← Lois (JSON)
│  *.json             │
└──────────┬──────────┘
           │ lecture
           ▼
┌─────────────────────┐
│  DimensionResolver  │  ← Interpréteur PUR
│  (TypeScript)       │     Pas de side effects
└──────────┬──────────┘
           │ ResolvedDimension
           ▼
┌─────────────────────┐
│  Renderer           │  ← React / Three.js / XR
│  (Adaptatif)        │     Applique les dimensions
└─────────────────────┘
```

---

## 📌 Version

- Schema: `chenu://dimension-engine/v1`
- Version: `1.0.0`

© Pro-Service Construction — CHE·NU™
