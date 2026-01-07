# CHE·NU™ — ORBITAL MINIMAP
## Spécification UX Complète

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║                      ORBITAL MINIMAP — NAVIGATION CONTEXTUELLE                   ║
║                                                                                  ║
║                           "Calme par défaut, actif au besoin"                    ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

---

## 1. DÉFINITION UX DES SPHÈRES

### Structure Visuelle

```
                           ○ Personnel (0°)
                          ╱
                    ○ Savoir              ○ Business
                   (320°)                   (40°)
                       │                       │
                       │                       │
              ○ Équipe ┼───────────────────────┼ ○ Institutions
               (280°)  │         ●             │   (80°)
                       │       centre          │
                       │                       │
                    ○ Loisirs              ○ Studio
                     (240°)                 (120°)
                          ╲                ╱
                           ○ Social    ○ Communauté
                            (200°)      (160°)
```

### Hiérarchie Cognitive

| Priorité | Sphère | Position | Usage Fréquence |
|----------|--------|----------|-----------------|
| 1 | Personnel | 12h (TOP) | Très haute |
| 2 | Business | 1h30 | Haute |
| 3 | Équipe | 9h30 | Haute |
| 4 | Studio | 4h | Moyenne |
| 5 | Communauté | 5h30 | Moyenne |
| 6 | Social | 7h | Moyenne |
| 7 | Institutions | 3h | Basse |
| 8 | Loisirs | 8h | Basse |
| 9 | Savoir | 11h | Variable |

---

## 2. LISTE DES LABELS (1 MOT)

```typescript
const SPHERES = [
  { id: 'personal',      label: 'Personnel',    angle: 0 },     // 12h  
  { id: 'business',      label: 'Business',     angle: 40 },    // ~1h30
  { id: 'government',    label: 'Institutions', angle: 80 },    // ~3h
  { id: 'studio',        label: 'Studio',       angle: 120 },   // ~4h
  { id: 'community',     label: 'Communauté',   angle: 160 },   // ~5h30
  { id: 'social',        label: 'Social',       angle: 200 },   // ~7h
  { id: 'entertainment', label: 'Loisirs',      angle: 240 },   // ~8h
  { id: 'team',          label: 'Équipe',       angle: 280 },   // ~9h30
  { id: 'scholar',       label: 'Savoir',       angle: 320 },   // ~11h
];
```

### Règles des Labels

- **1 mot maximum** par sphère
- **Français** (localisable)
- **Majuscules** (uppercase)
- **Pas d'emojis**, pas d'icônes
- **Espacement**: `letter-spacing: 0.12em`

---

## 3. PLACEMENT (SVG/Canvas)

### Pseudo-code de Positionnement

```javascript
// Constantes
const SIZE = 380;           // Taille du conteneur
const CENTER = SIZE / 2;    // Centre (190, 190)
const RADIUS = 133;         // Rayon de l'anneau principal (35%)

// Fonction de calcul de position
function getSpherePosition(angle) {
  // Convertir angle en radians
  // 0° = haut (soustraire 90° pour commencer à 12h)
  const radians = ((angle - 90) * Math.PI) / 180;
  
  return {
    x: CENTER + RADIUS * Math.cos(radians),
    y: CENTER + RADIUS * Math.sin(radians)
  };
}

// Exemple pour "Personnel" à 0°
// radians = (0 - 90) * PI/180 = -PI/2
// x = 190 + 133 * cos(-PI/2) = 190 + 0 = 190
// y = 190 + 133 * sin(-PI/2) = 190 - 133 = 57
// Position: (190, 57) → TOP CENTER ✓
```

### Structure SVG de l'Anneau

```xml
<svg viewBox="0 0 380 380">
  <!-- Anneau glow externe -->
  <circle cx="190" cy="190" r="160" 
          stroke="rgba(216,178,106,0.15)" 
          stroke-width="3" 
          fill="none" 
          filter="blur(4px)"/>
  
  <!-- Anneau décoratif externe -->
  <circle cx="190" cy="190" r="170" 
          stroke="rgba(216,178,106,0.25)" 
          stroke-width="1" 
          fill="none"/>
  
  <!-- Anneau principal (sphères ici) -->
  <circle cx="190" cy="190" r="133" 
          stroke="rgba(216,178,106,0.4)" 
          stroke-width="1.5" 
          fill="none"/>
  
  <!-- Anneaux internes -->
  <circle cx="190" cy="190" r="100" 
          stroke="rgba(216,178,106,0.15)" 
          stroke-width="0.8" 
          fill="none"/>
  <circle cx="190" cy="190" r="70" 
          stroke="rgba(216,178,106,0.15)" 
          stroke-width="0.8" 
          fill="none"/>
</svg>
```

### Position des Labels par Quadrant

```javascript
function getLabelPosition(angle) {
  const normalized = ((angle % 360) + 360) % 360;
  
  // TOP (315° - 45°)
  if (normalized >= 315 || normalized < 45) {
    return 'top';    // Label au-dessus
  }
  // RIGHT (45° - 135°)
  if (normalized >= 45 && normalized < 135) {
    return 'right';  // Label à droite
  }
  // BOTTOM (135° - 225°)
  if (normalized >= 135 && normalized < 225) {
    return 'bottom'; // Label en-dessous
  }
  // LEFT (225° - 315°)
  return 'left';     // Label à gauche
}
```

---

## 4. LOGIQUE D'ÉTAT (State Machine)

### Machine d'État

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              STATE MACHINE                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────┐      mouse enter map      ┌───────────┐                     │
│   │          │ ─────────────────────────▶│           │                     │
│   │   REST   │                           │  VISIBLE  │                     │
│   │          │◀───────────────────────── │           │                     │
│   └──────────┘      mouse leave map      └───────────┘                     │
│        │                                       │                            │
│        │                                       │ mouse enter sphere         │
│        │                                       ▼                            │
│        │                                 ┌───────────┐                      │
│        │                                 │           │                      │
│        │                                 │  HOVERED  │                      │
│        │                                 │           │                      │
│        │                                 └───────────┘                      │
│        │                                       │                            │
│        │                                       │ click                      │
│        │                                       ▼                            │
│        │                                 ┌───────────┐                      │
│        └────────────────────────────────▶│           │                      │
│                     click (toggle)       │  ACTIVE   │                      │
│        ┌────────────────────────────────▶│           │                      │
│        │                                 └───────────┘                      │
│        │                                       │                            │
│        └───────────────────────────────────────┘                            │
│                     click same sphere (deactivate)                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### États Visuels

| État | Sphere Opacity | Sphere Size | Glow | Label |
|------|----------------|-------------|------|-------|
| **REST** | 6% | 10px | none | hidden |
| **VISIBLE** | 45% | 10px | soft (8px) | hidden |
| **HOVERED** | 70% | 16px | medium (20px) | visible |
| **ACTIVE** | 100% | 18px | strong (24px) | visible |

### CSS des États

```css
/* REST — Sphères quasi-invisibles */
.sphere-dot {
  width: 10px;
  height: 10px;
  background: rgba(216, 178, 106, 0.06);
  box-shadow: none;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* VISIBLE — Map survolée */
.minimap:hover .sphere-dot {
  background: rgba(216, 178, 106, 0.45);
  box-shadow: 0 0 10px rgba(216, 178, 106, 0.35);
}

/* HOVERED — Sphère survolée */
.sphere:hover .sphere-dot {
  width: 16px;
  height: 16px;
  background: rgba(216, 178, 106, 0.7);
  box-shadow: 
    0 0 20px rgba(216, 178, 106, 0.35),
    0 0 40px rgba(216, 178, 106, 0.15);
}

/* ACTIVE — Sphère sélectionnée */
.sphere.active .sphere-dot {
  width: 18px;
  height: 18px;
  background: rgba(216, 178, 106, 1);
  box-shadow: 
    0 0 24px rgba(216, 178, 106, 0.65),
    0 0 48px rgba(216, 178, 106, 0.35);
}
```

### Logique TypeScript

```typescript
type VisualState = 'rest' | 'visible' | 'hovered' | 'active';

function getSphereState(
  sphereId: SphereId,
  activeSphere: SphereId | null,
  hoveredSphere: SphereId | null,
  isMapHovered: boolean
): VisualState {
  // Priority order: active > hovered > visible > rest
  if (sphereId === activeSphere) return 'active';
  if (sphereId === hoveredSphere) return 'hovered';
  if (isMapHovered) return 'visible';
  return 'rest';
}
```

---

## 5. ANIMATIONS

### Timing Functions

```css
/* Sphères — Mouvement organique */
--ease-sphere: cubic-bezier(0.4, 0, 0.2, 1);
--duration-sphere: 0.5s;

/* Labels — Apparition douce */
--ease-label: ease;
--duration-label: 0.35s;
```

### Séquence d'Animation

1. **Hover Map** → Toutes les sphères fade-in (0.5s)
2. **Hover Sphere** → Sphère scale + glow (0.5s), Label fade-in (0.35s)
3. **Click** → Sphère devient active immédiatement
4. **Leave Map** → Toutes les sphères fade-out (0.5s), Labels hidden

---

## 6. FICHIERS LIVRÉS

```
frontend/src/components/minimap/
├── OrbitalMinimap.tsx      # Composant React principal
├── index.ts                # Exports
├── demo.html               # Démo standalone
└── orbital-ring-bg.png     # Image de fond (optionnelle)

/mnt/user-data/outputs/
└── orbital-minimap-chenu.html  # Artifact interactif
```

---

## 7. UTILISATION

```tsx
import { OrbitalMinimap } from '@/components/minimap';

function MyApp() {
  const [activeSphere, setActiveSphere] = useState<SphereId>('personal');

  return (
    <OrbitalMinimap
      size={380}
      activeSphere={activeSphere}
      onSphereClick={setActiveSphere}
    />
  );
}
```

---

**ON CONTINUE!** 🚀
