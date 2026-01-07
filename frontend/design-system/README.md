# 🎨 CHE·NU Design System

> **"Refined Industrial"** — Élégance brute avec chaleur humaine

Le Design System CHE·NU est la fondation visuelle de l'application. Il fournit des tokens de design, un système de thèmes, et des composants React réutilisables pour construire des interfaces cohérentes et accessibles.

---

## 📦 Installation

```tsx
// Dans votre fichier App.tsx ou main.tsx
import '@/design-system/styles/variables.css';
import { ThemeProvider, ToastProvider } from '@/design-system';

function App() {
  return (
    <ThemeProvider defaultMode="system">
      <ToastProvider position="top-right">
        {/* Votre application */}
      </ToastProvider>
    </ThemeProvider>
  );
}
```

---

## 🎯 Philosophie

CHE·NU = **"Chez Nous"** — Un système qui évoque:
- 🏠 **Maison** — Chaleur, sécurité, familiarité
- 🏗️ **Construction** — Solidité, structure, professionnalisme  
- 🧠 **Cognitif** — Intelligence, clarté, précision

### Direction esthétique: *Refined Industrial*

Nous combinons l'élégance épurée du design moderne avec la chaleur des matériaux de construction:
- **Copper** (#CD7F4E) — Notre couleur primaire, évoquant le cuivre et l'artisanat
- **Steel Blue** (#6B83A3) — Secondaire, représentant la précision technique
- **Forest Green** (#4F8A60) — Succès et croissance, inspiré des forêts québécoises
- **Warm Grays** — Une échelle de gris chaude rappelant le béton

---

## 🎨 Design Tokens

### Couleurs

```tsx
import { colors } from '@/design-system';

// Couleurs primitives
colors.primitives.copper[500]  // #CD7F4E
colors.primitives.steel[500]   // #6B83A3
colors.primitives.forest[500]  // #4F8A60

// Couleurs sémantiques (utilisez CSS variables dans les composants)
// var(--color-brand-primary)
// var(--color-text-primary)
// var(--color-bg-secondary)

// Couleurs par sphère
colors.spheres.business.primary  // #CD7F4E
colors.spheres.personal.primary  // #6B83A3
colors.spheres.ailab.primary     // #F59E0B
```

### Typographie

```tsx
import { typography } from '@/design-system';

// Familles de polices
typography.fontFamily.display  // Playfair Display (titres hero)
typography.fontFamily.heading  // DM Sans (headings)
typography.fontFamily.body     // Source Sans 3 (corps de texte)
typography.fontFamily.mono     // JetBrains Mono (code)

// Tailles
typography.fontSize['display-xl']  // 3.75rem (60px)
typography.fontSize['heading-lg']  // 1.25rem (20px)
typography.fontSize['body-md']     // 1rem (16px)
```

### Spacing & Sizing

```tsx
import { spacing, sizing } from '@/design-system';

spacing[4]      // 1rem (16px)
spacing[8]      // 2rem (32px)
spacing.gap.md  // 1rem

sizing.component.buttonMd     // 2.5rem (40px)
sizing.component.avatarLg     // 3rem (48px)
sizing.component.sidebarExpanded  // 16rem (256px)
```

---

## 🌓 Système de Thèmes

### ThemeProvider

```tsx
import { ThemeProvider, useTheme } from '@/design-system';

// Wrapper de l'application
<ThemeProvider 
  defaultMode="system"
  defaultSphere="business"
>
  <App />
</ThemeProvider>

// Dans un composant
function MyComponent() {
  const { 
    isDark, 
    toggleTheme, 
    sphere, 
    setSphere 
  } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Mode clair' : '🌙 Mode sombre'}
    </button>
  );
}
```

### Modes disponibles
- `light` — Thème clair
- `dark` — Thème sombre  
- `system` — Suit les préférences système
- `high-contrast` — Contraste élevé (accessibilité)

### Sphères

Chaque sphère a sa propre palette d'accent:

| Sphère | Couleur | Usage |
|--------|---------|-------|
| `personal` | Steel Blue | Espace personnel |
| `business` | Copper | Entreprise, projets |
| `creative` | Purple | Contenu créatif |
| `scholar` | Forest | Études, formation |
| `ailab` | Amber | Laboratoire IA |
| `myteam` | Teal | Gestion d'équipe |
| `xr` | Violet | Réalité augmentée |

---

## 🧩 Composants

### Button

```tsx
import { Button, IconButton, ButtonGroup } from '@/design-system';

// Variants
<Button variant="primary">Action principale</Button>
<Button variant="secondary">Action secondaire</Button>
<Button variant="tertiary">Action tertiaire</Button>
<Button variant="ghost">Subtile</Button>
<Button variant="danger">Supprimer</Button>
<Button variant="success">Confirmer</Button>

// Sizes
<Button size="xs">Très petit</Button>
<Button size="sm">Petit</Button>
<Button size="md">Moyen</Button>
<Button size="lg">Grand</Button>
<Button size="xl">Très grand</Button>

// Avec icônes
<Button leftIcon={<IconPlus />}>Ajouter</Button>
<Button rightIcon={<IconArrow />}>Suivant</Button>

// États
<Button loading>Chargement...</Button>
<Button disabled>Désactivé</Button>

// Icon-only
<IconButton icon={<IconSettings />} aria-label="Paramètres" />

// Groupe
<ButtonGroup attached>
  <Button>Gauche</Button>
  <Button>Centre</Button>
  <Button>Droite</Button>
</ButtonGroup>
```

### Input

```tsx
import { Input, Textarea, Select, Checkbox, Radio } from '@/design-system';

// Input basique
<Input 
  label="Email" 
  type="email" 
  placeholder="vous@exemple.com" 
/>

// Avec validation
<Input
  label="Mot de passe"
  type="password"
  state="error"
  errorMessage="Le mot de passe est requis"
/>

// Variants
<Input variant="default" />  // Bordure
<Input variant="filled" />   // Fond rempli
<Input variant="flushed" />  // Ligne bottom

// Textarea avec auto-resize
<Textarea
  label="Description"
  autoResize
  minRows={3}
  maxRows={10}
/>

// Select
<Select
  label="Pays"
  placeholder="Sélectionnez..."
  options={[
    { value: 'ca', label: 'Canada' },
    { value: 'fr', label: 'France' },
  ]}
/>

// Checkbox & Radio
<Checkbox label="J'accepte les conditions" />
<Radio name="plan" value="pro" label="Plan Pro" />
```

### Card

```tsx
import { Card, CardHeader, CardBody, CardFooter, StatCard } from '@/design-system';

// Card complète
<Card variant="elevated" elevation="md">
  <CardHeader 
    title="Titre de la carte"
    subtitle="Sous-titre optionnel"
    icon={<IconProject />}
    action={<IconButton icon={<IconMore />} aria-label="Options" />}
  />
  <CardBody>
    <p>Contenu de la carte</p>
  </CardBody>
  <CardFooter justify="end" divider>
    <Button variant="ghost">Annuler</Button>
    <Button variant="primary">Sauvegarder</Button>
  </CardFooter>
</Card>

// Card interactive
<Card interactive onClick={handleClick}>
  <CardBody>Cliquez-moi!</CardBody>
</Card>

// Stat Card
<StatCard
  label="Revenus mensuels"
  value="$45,231"
  change={{ value: '+12.5%', type: 'increase' }}
  icon={<IconDollar />}
/>
```

### Avatar & AgentAvatar

```tsx
import { Avatar, AgentAvatar, AvatarGroup } from '@/design-system';

// Avatar utilisateur
<Avatar 
  src="/user.jpg" 
  alt="John Doe"
  size="lg"
  showStatus
  status="online"
/>

// Avatar avec initiales
<Avatar fallback="Jean Dupont" />

// Avatar d'agent IA
<AgentAvatar
  agentName="Nova"
  level="L0"
  agentStatus="active"
  showAura
  sphereColor="var(--sphere-business)"
/>

// Groupe d'avatars
<AvatarGroup max={3}>
  <Avatar fallback="A" />
  <Avatar fallback="B" />
  <Avatar fallback="C" />
  <Avatar fallback="D" />
</AvatarGroup>
```

### Modal & Drawer

```tsx
import { Modal, ConfirmDialog, Drawer } from '@/design-system';

// Modal
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Titre du modal"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Annuler
      </Button>
      <Button variant="primary">Confirmer</Button>
    </>
  }
>
  <p>Contenu du modal</p>
</Modal>

// Dialog de confirmation
<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Supprimer l'élément"
  message="Êtes-vous sûr? Cette action est irréversible."
  confirmText="Supprimer"
  confirmVariant="danger"
/>

// Drawer
<Drawer
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  position="right"
  title="Paramètres"
>
  <p>Contenu du drawer</p>
</Drawer>
```

### Toast Notifications

```tsx
import { ToastProvider, useToast } from '@/design-system';

// Dans App.tsx
<ToastProvider position="top-right" defaultDuration={5000}>
  <App />
</ToastProvider>

// Dans un composant
function MyComponent() {
  const toast = useToast();
  
  return (
    <>
      <button onClick={() => toast.success('Sauvegardé!')}>
        Success
      </button>
      <button onClick={() => toast.error('Une erreur est survenue')}>
        Error
      </button>
      <button onClick={() => toast.info('Information', { title: 'Note' })}>
        Info
      </button>
      
      {/* Toast avec promise */}
      <button onClick={() => {
        toast.promise(saveData(), {
          loading: 'Sauvegarde en cours...',
          success: 'Données sauvegardées!',
          error: 'Échec de la sauvegarde',
        });
      }}>
        Save with Promise
      </button>
    </>
  );
}
```

### Loading & Progress

```tsx
import { 
  Spinner, 
  LoadingOverlay, 
  Progress, 
  CircularProgress,
  Skeleton,
  CardSkeleton 
} from '@/design-system';

// Spinner
<Spinner size="lg" />

// Overlay de chargement
<div className="relative">
  <LoadingOverlay loading={isLoading} text="Chargement..." />
  <YourContent />
</div>

// Progress bar
<Progress value={65} showValue />
<Progress value={30} variant="gradient" />
<Progress indeterminate />

// Progress circulaire
<CircularProgress value={75} showValue />

// Skeletons
<Skeleton variant="text" lines={3} />
<Skeleton variant="circular" width={48} height={48} />
<CardSkeleton />
```

### Navigation

```tsx
import { Tabs, TabList, Tab, TabPanel, Breadcrumb, Pagination } from '@/design-system';

// Tabs
<Tabs defaultTab="tab1" variant="line">
  <TabList>
    <Tab id="tab1">Onglet 1</Tab>
    <Tab id="tab2" badge={3}>Onglet 2</Tab>
    <Tab id="tab3" disabled>Désactivé</Tab>
  </TabList>
  <TabPanel id="tab1">Contenu 1</TabPanel>
  <TabPanel id="tab2">Contenu 2</TabPanel>
</Tabs>

// Breadcrumb
<Breadcrumb
  items={[
    { label: 'Accueil', href: '/' },
    { label: 'Projets', href: '/projects' },
    { label: 'Projet actuel' },
  ]}
/>

// Pagination
<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>
```

---

## 🎭 Accessibilité

Le Design System CHE·NU suit les directives WCAG 2.1 AA:

- ✅ Contrastes de couleurs suffisants
- ✅ Navigation au clavier complète
- ✅ Focus visible et cohérent
- ✅ Labels ARIA appropriés
- ✅ Support des lecteurs d'écran
- ✅ Respect de `prefers-reduced-motion`
- ✅ Respect de `prefers-color-scheme`

---

## 📁 Structure des fichiers

```
src/design-system/
├── index.ts                 # Export principal
├── tokens/
│   └── index.ts            # Design tokens TypeScript
├── styles/
│   └── variables.css       # CSS custom properties
├── theme/
│   └── ThemeProvider.tsx   # Contexte de thème
└── components/
    ├── Avatar.tsx          # Avatar & AgentAvatar
    ├── Badge.tsx           # Badges & Tags
    ├── Button.tsx          # Boutons
    ├── Card.tsx            # Cartes
    ├── Input.tsx           # Inputs, Select, Checkbox
    ├── Loading.tsx         # Spinner, Progress, Skeleton
    ├── Modal.tsx           # Modal, Dialog, Drawer
    ├── Navigation.tsx      # Tabs, Breadcrumb, Pagination
    ├── Toast.tsx           # Notifications toast
    └── Tooltip.tsx         # Tooltips
```

---

## 🔧 Configuration Tailwind

Le design system est optimisé pour Tailwind CSS. Ajoutez ces configurations:

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        copper: {
          50: '#FDF8F6',
          // ... voir tokens
          500: '#CD7F4E',
        },
        // Autres couleurs...
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        heading: ['DM Sans', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

---

## 📝 Conventions de nommage

- **Composants**: PascalCase (`Button`, `CardHeader`)
- **Props types**: PascalCase avec suffix `Props` (`ButtonProps`)
- **Variants**: camelCase (`primary`, `secondary`)
- **CSS variables**: kebab-case (`--color-brand-primary`)
- **Tokens**: camelCase structuré (`colors.primitives.copper[500]`)

---

## 🚀 Roadmap

- [ ] Data Table component
- [ ] Date/Time Picker
- [ ] Rich Text Editor integration
- [ ] Chart components (Recharts wrapper)
- [ ] Form validation integration (React Hook Form)
- [ ] Animation library integration (Framer Motion)
- [ ] Storybook documentation

---

## 📄 License

Propriétaire — Pro-Service Construction © 2024-2025
