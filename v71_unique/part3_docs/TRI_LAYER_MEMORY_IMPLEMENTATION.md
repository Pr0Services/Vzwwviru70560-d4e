# 🧠 TRI-LAYER MEMORY ARCHITECTURE — IMPLÉMENTATION V71

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║              CHE·NU™ — ARCHITECTURE MÉMOIRE TRI-COUCHE                       ║
║                                                                              ║
║              L1 Hot · L2 Warm · L3 Cold                                      ║
║              Implémentation Complète                                          ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Date:** 6 Janvier 2026  
**Version:** V71.1  
**Status:** ✅ IMPLÉMENTÉ

---

## 📋 FICHIERS CRÉÉS

### Frontend (TypeScript)

| Fichier | Taille | Description |
|---------|--------|-------------|
| `frontend/src/types/memory-architecture.types.ts` | ~450 lignes | Types complets pour les 3 couches |
| `frontend/src/services/memory-architecture.service.ts` | ~500 lignes | Services API pour chaque couche |
| `frontend/src/stores/triLayerMemory.store.ts` | ~450 lignes | Store Zustand avec flux cognitif |

### Backend (Python)

| Fichier | Taille | Description |
|---------|--------|-------------|
| `backend/api/services/tri_layer_memory.py` | ~800 lignes | Services complets L1/L2/L3 |
| `backend/api/routes/memory_routes.py` | ~600 lignes | 40+ endpoints API |

**Total:** ~2,800 lignes de code

---

## 🏗️ ARCHITECTURE IMPLÉMENTÉE

### L1 — Mémoire Chaude (HOT)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  L1 - MÉMOIRE CHAUDE                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  RÔLE: Raisonnement actif (SEULE couche utilisée pour raisonner)           │
│  CHARGE LLM: Élevée                                                        │
│  MUTABILITÉ: Volatile                                                       │
│                                                                             │
│  CONTENU:                                                                   │
│  ├── Messages de la conversation active                                    │
│  ├── Objectifs immédiats                                                   │
│  ├── Contraintes courantes                                                 │
│  └── État du raisonnement en cours                                        │
│                                                                             │
│  RÈGLES:                                                                    │
│  ├── 1 mémoire chaude PAR AGENT                                           │
│  ├── Taille strictement limitée (max_tokens, max_messages)                │
│  ├── Jamais persistée brute                                               │
│  └── Archivée automatiquement à 80% de capacité                           │
│                                                                             │
│  ENDPOINTS:                                                                 │
│  ├── POST /memory/hot/initialize                                          │
│  ├── GET  /memory/hot/{agent_id}                                          │
│  ├── POST /memory/hot/{agent_id}/message                                  │
│  ├── POST /memory/hot/{agent_id}/reasoning                                │
│  ├── POST /memory/hot/{agent_id}/objectives                               │
│  ├── POST /memory/hot/{agent_id}/constraints                              │
│  └── DELETE /memory/hot/{agent_id}                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### L2 — Mémoire Subjective (WARM)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  L2 - MÉMOIRE SUBJECTIVE                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  RÔLE: Continuité & intention                                              │
│  CHARGE LLM: Moyenne                                                        │
│  MUTABILITÉ: Révisable                                                      │
│                                                                             │
│  CONTENU:                                                                   │
│  ├── Résumés sémantiques de conversations                                  │
│  ├── Décisions prises et leurs intentions                                  │
│  ├── Hypothèses encore actives                                             │
│  ├── Préférences apprises                                                  │
│  └── Modèles mentaux temporaires                                           │
│                                                                             │
│  PROPRIÉTÉS:                                                                │
│  ├── Compressée (ratio configurable)                                       │
│  ├── Synthétique                                                           │
│  ├── Révisable                                                             │
│  └── Dépendante de l'agent/profil                                         │
│                                                                             │
│  👉 Deux agents peuvent avoir des mémoires subjectives DIFFÉRENTES         │
│     d'un même événement.                                                    │
│                                                                             │
│  ENDPOINTS:                                                                 │
│  ├── GET  /memory/warm/{owner_id}                                         │
│  ├── POST /memory/warm/{owner_id}/summaries                               │
│  ├── POST /memory/warm/{owner_id}/decisions                               │
│  ├── POST /memory/warm/{owner_id}/hypotheses                              │
│  ├── PUT  /memory/warm/{owner_id}/hypotheses/{id}                         │
│  ├── POST /memory/warm/{owner_id}/preferences                             │
│  ├── GET  /memory/warm/{owner_id}/preferences                             │
│  ├── POST /memory/warm/{owner_id}/search                                  │
│  └── POST /memory/warm/{owner_id}/compress                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### L3 — Mémoire Froide (COLD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  L3 - MÉMOIRE FROIDE (ARCHIVE)                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  RÔLE: Vérité & traçabilité                                                │
│  CHARGE LLM: NULLE (jamais chargée en contexte)                            │
│  MUTABILITÉ: IMMUABLE                                                       │
│                                                                             │
│  CONTENU:                                                                   │
│  ├── Conversations intégrales archivées                                    │
│  ├── Artifacts validés                                                     │
│  ├── Décisions gelées                                                      │
│  ├── Logs OPA / audits                                                     │
│  └── Snapshots de session                                                  │
│                                                                             │
│  PROPRIÉTÉS:                                                                │
│  ├── JAMAIS chargée en contexte LLM                                       │
│  ├── Accessible UNIQUEMENT par référence                                  │
│  ├── NON modifiable                                                        │
│  ├── Juridiquement traçable                                               │
│  └── Checksum SHA-256 pour intégrité                                      │
│                                                                             │
│  👉 C'est la SOURCE DE VÉRITÉ, jamais le moteur de raisonnement.          │
│                                                                             │
│  ENDPOINTS:                                                                 │
│  ├── POST /memory/cold/archive                                            │
│  ├── POST /memory/cold/access (retourne RÉFÉRENCE, jamais contenu)        │
│  ├── GET  /memory/cold/{owner_id}                                         │
│  └── GET  /memory/cold/{entry_id}/verify                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUX COGNITIF STANDARD

```
                    ┌─────────────────────────┐
                    │   L3 - MÉMOIRE FROIDE   │
                    │   (Archive Immuable)    │
                    └───────────┬─────────────┘
                                │
                          [résumé]
                                │
                                ▼
                    ┌─────────────────────────┐
                    │  L2 - MÉMOIRE SUBJECTIVE│
                    │  (Continuité Vécue)     │
                    └───────────┬─────────────┘
                                │
                         [sélection]
                                │
                                ▼
                    ┌─────────────────────────┐
                    │   L1 - MÉMOIRE CHAUDE   │
                    │   (Présent Cognitif)    │
                    └───────────┬─────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │  RAISONNEMENT / ACTION  │
                    └─────────────────────────┘
```

**Implémenté via:** `executeFlux()` dans le store et `load_context()` dans l'API

---

## 📡 ENDPOINTS API COMPLETS

### Session Management
```
POST /memory/session/initialize    → Initialise session complète
POST /memory/session/end           → Termine session avec archivage
```

### Context Loading
```
POST /memory/context/load          → Charge contexte pour raisonnement
POST /memory/context/preload       → Précharge pour nouvelle conversation
```

### Archiving
```
POST /memory/archive               → Archive conversation complète
GET  /memory/archive/policy        → Récupère politique d'archivage
```

### Conversations
```
POST /memory/conversations         → Crée nouvelle conversation
POST /memory/conversations/{id}/close → Ferme conversation
```

### Health
```
GET  /memory/health                → Health check du service
```

---

## 🎯 PRINCIPE FONDAMENTAL

> **"Aucune intelligence ne doit porter l'intégralité de son passé actif en mémoire."**

Le contexte n'est **JAMAIS empilé**, il est **ADRESSABLE**.

Cette séparation est **OBLIGATOIRE** pour éviter:
- Surcharge contextuelle
- Dérive cognitive
- Conversations infinies
- Hallucinations structurelles

---

## ✅ FONCTIONNALITÉS IMPLÉMENTÉES

### Auto-Archivage
- [x] Archivage automatique à 80% de capacité
- [x] Génération de résumé sémantique
- [x] Extraction de décisions
- [x] Création d'entrée froide

### Recherche Sémantique
- [x] Recherche dans les résumés
- [x] Recherche dans les décisions
- [x] Scoring de pertinence

### Compression
- [x] Compression automatique de la mémoire subjective
- [x] Rétention configurable
- [x] Tri par pertinence

### Intégrité
- [x] Checksum SHA-256 pour entrées froides
- [x] Vérification d'intégrité
- [x] Audit trail des accès

### Gouvernance
- [x] Accès par référence uniquement (L3)
- [x] Isolation par owner/agent
- [x] TTL configurable

---

## 🔧 CONFIGURATION

### Hot Memory
```typescript
const DEFAULT_HOT_CONFIG = {
  max_tokens: 8000,
  max_messages: 50,
  ttl_seconds: 3600,
  auto_archive_threshold: 0.8,
};
```

### Warm Memory
```typescript
const DEFAULT_WARM_CONFIG = {
  max_entries: 1000,
  compression_ratio: 0.1,
  retention_days: 90,
  revision_allowed: true,
};
```

### Cold Memory
```typescript
const DEFAULT_COLD_CONFIG = {
  retention_years: 7,
  encryption_required: true,
  immutable: true,
  audit_trail_required: true,
};
```

---

## 📊 MÉTRIQUES EXPOSÉES

| Métrique | Description |
|----------|-------------|
| `hotUtilization` | % utilisation mémoire chaude |
| `warmEntryCount` | Nombre d'entrées mémoire subjective |
| `coldAccessCount` | Nombre d'accès mémoire froide |
| `lastContextLoadTime` | Temps dernier chargement contexte |

---

## 🚀 PROCHAINES ÉTAPES

1. **Intégration LLM** — Connecter la génération de résumés au LLM
2. **Embeddings vectoriels** — Recherche sémantique avec embeddings
3. **Persistance** — PostgreSQL pour warm, S3 pour cold
4. **UI Dashboard** — Visualisation des 3 couches

---

© 2026 CHE·NU™ — "GOUVERNANCE > EXÉCUTION"
