# 🏛️ CHE·NU™ V68.6 — Frontend Canonique

**Governed Intelligence Operating System**  
*"GOUVERNANCE > EXÉCUTION"*

---

## 📋 CONTENU DU PACKAGE

```
CHENU_V68.6_FINAL/
├── src/                          # Code source frontend
│   ├── components/               # Composants React
│   │   ├── bureau-canonical/     # 6 sections bureau
│   │   └── nova-canonical/       # Pipeline Nova gouverné
│   ├── stores/                   # 9 stores Zustand canoniques
│   ├── services/                 # Services API (stubs)
│   ├── types/                    # Types TypeScript
│   ├── constants/                # Constantes (couleurs, routes)
│   ├── hooks/                    # Hooks React personnalisés
│   ├── providers/                # Context providers
│   └── pages/                    # Pages de l'application
├── package.json                  # Dépendances npm
├── tsconfig.json                 # Configuration TypeScript
├── RAPPORT_V68.6_COMPILATION.md  # Rapport de compilation
├── ARCHITECTURE.md               # Documentation architecture
└── README.md                     # Ce fichier
```

---

## 🚀 DÉMARRAGE RAPIDE

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Vérifier la compilation TypeScript
npm run typecheck
```

---

## 🏗️ ARCHITECTURE GELÉE

### 9 Sphères
| # | Sphère | Emoji | Description |
|---|--------|-------|-------------|
| 1 | Personal | 🏠 | Espace personnel |
| 2 | Business | 💼 | Gestion d'entreprise |
| 3 | Government | 🏛️ | Institutions |
| 4 | Studio | 🎨 | Création |
| 5 | Community | 👥 | Associations |
| 6 | Social | 📱 | Réseaux sociaux |
| 7 | Entertainment | 🎬 | Divertissement |
| 8 | Team | 🤝 | Collaboration |
| 9 | Scholar | 📚 | Éducation |

### 6 Sections Bureau (par sphère)
1. **QuickCapture** — Capture rapide
2. **ResumeWorkspace** — Espace de travail
3. **Threads** — Fils de discussion (.chenu)
4. **DataFiles** — Fichiers et données
5. **ActiveAgents** — Agents actifs
6. **Meetings** — Réunions

---

## 📦 STORES CANONIQUES

| Store | Fichier | Responsabilité |
|-------|---------|----------------|
| Identity | `identity.store.ts` | Authentification utilisateur |
| Governance | `governance.store.ts` | Checkpoints et validation |
| Agent | `agent.store.ts` | Gestion des agents |
| Token | `token.store.ts` | Crédits internes |
| Nova | `nova.store.ts` | Intelligence système |
| Thread | `thread.store.ts` | Conversations .chenu |
| Dataspace | `dataspace.store.ts` | Espaces de données |
| Memory | `memory.store.ts` | Mémoire contextuelle |
| UI | `ui.store.ts` | État interface |

---

## 🎨 COULEURS CHE·NU

```typescript
export const CHENU_COLORS = {
  sacredGold: '#D8B26A',      // Or sacré
  ancientStone: '#8D8371',    // Pierre ancienne
  jungleEmerald: '#3F7249',   // Émeraude jungle
  cenoteTurquoise: '#3EB4A2', // Turquoise cenote
  shadowMoss: '#2F4C39',      // Mousse d'ombre
  earthEmber: '#7A593A',      // Braise terrestre
  uiSlate: '#1E1F22',         // Ardoise UI
  softSand: '#E9E4D6',        // Sable doux
};
```

---

## ⚖️ PRINCIPES FONDAMENTAUX

1. **GOUVERNANCE > EXÉCUTION**  
   Toute action IA passe par un checkpoint humain

2. **Nova = System Intelligence**  
   Nova n'est JAMAIS un agent hireable

3. **Tokens = Crédits internes**  
   PAS de crypto, uniquement gouvernance

4. **Architecture gelée**  
   9 sphères × 6 sections = FROZEN

---

## 📊 QUALITÉ CODE V68.6

| Métrique | Valeur |
|----------|--------|
| Types `any` | 0 ✅ |
| Erreurs TypeScript | 0 ✅ |
| Console.log | 0 ✅ |
| ESLint errors | 0 ✅ |

---

## 🔗 CONNEXION BACKEND

Les services dans `src/services/` sont des **stubs** prêts à être connectés:

```typescript
// src/services/nova.constitution.service.ts
export const NovaConstitutionService = {
  async query(params: NovaRequest): Promise<NovaResponse>,
  async getStatus(): Promise<NovaStatus>,
  async getGuidance(topic: string): Promise<NovaGuidanceResponse>,
  // ...
};

// src/services/governance.constitution.service.ts
export const GovernanceConstitutionService = {
  async checkGovernance(): Promise<GovernanceCheckResponse>,
  async getCheckpoint(id: string): Promise<Checkpoint>,
  async approveCheckpoint(id: string): Promise<...>,
  // ...
};
```

---

## 📝 LICENCE

CHE·NU™ — Propriétaire  
© 2024-2026 Tous droits réservés

---

**Version**: 68.6  
**Date**: 2026-01-05  
**Status**: ✅ Production Ready (Frontend)
