# 📦 CHE·NU™ — MODULES INTEGRATION PACKAGE
## Master Manifest for Assembleur
**Date:** 2026-01-07
**Version:** V1.0
**Status:** PRÊT POUR INTÉGRATION

---

## 🎯 RÉSUMÉ EXÉCUTIF

4 modules prêts pour intégration par l'Agent Assembleur:

| Module | Fichiers | Lignes | Taille ZIP | Status |
|--------|----------|--------|------------|--------|
| 🎓 Professeur | 9 | ~925 | 14 KB | ✅ READY |
| 📚 Stagiaire | 16 | ~1,100 | 23 KB | ✅ READY |
| 📜 Canon | 20 | ~2,200 | 32 KB | ✅ READY |
| 🎬 Video | 6 | ~200 | 5 KB | ✅ READY |
| **TOTAL** | **51** | **~4,425** | **74 KB** | ✅ |

---

## 📦 MODULE 1: AGENT PROFESSEUR

**ID:** `agents.professeur`
**ZIP:** `CHENU_MODULE_PROFESSEUR_v1.zip`

### Mission
Le professeur n'aide pas le système à aller plus vite.
Il l'aide à ne pas se perdre.

### Contenu
```
professeur/
├── backend/
│   └── agent_professeur.py      # 465 lignes
├── frontend/
│   └── ProfesseurComponents.tsx # 459 lignes
├── docs/                        # 6 fichiers specs
└── MANIFEST.md
```

### Tests
✓ 6 tests passent

### API Endpoints
- `POST /professeur/session/start`
- `POST /professeur/session/end`
- `POST /professeur/analyze/intention`
- `POST /professeur/analyze/stability`
- `POST /professeur/recadrage`
- `GET /professeur/recadrage/export`
- `GET /professeur/stats`

---

## 📦 MODULE 2: AGENT STAGIAIRE

**ID:** `agents.stagiaire`
**ZIP:** `CHENU_MODULE_STAGIAIRE_v1.zip`

### Mission
Une note utile est une note écrite avec curiosité, pas avec certitude.

### Contenu
```
stagiaire/
├── backend/
│   └── agent_stagiaire.py       # 492 lignes
├── frontend/
│   └── StagiaireComponents.tsx  # 617 lignes
├── schemas/                     # 3 JSON schemas
├── examples/                    # 2 exemples
├── docs/                        # 8 fichiers specs
└── MANIFEST.md
```

### Tests
✓ 9 tests passent

### Machine d'État
```
HOT → COOLING → ENDED → STAGIARY_REVIEW → COOLDOWN (15min)
```

### API Endpoints
- `GET /stagiaire/conversation/{id}/state`
- `POST /stagiaire/conversation/{id}/transition/{state}`
- `POST /stagiaire/review`
- `GET /stagiaire/notes`
- `GET /stagiaire/promotion/candidates`
- `POST /stagiaire/promotion`
- `POST /stagiaire/promotion/{id}/approve`
- `POST /stagiaire/promotion/{id}/reject`
- `GET /stagiaire/stats`

---

## 📦 MODULE 3: CANON & SIMULATION

**ID:** `core.canon` + `simulation.scenario_lock`
**ZIP:** `CHENU_MODULE_CANON_v1.zip`

### Mission
```
run = template × factors × module_set
```
On varie les facteurs, PAS la forme.

### Contenu
```
canon/
├── backend/
│   ├── need_canon.py            # 400 lignes
│   └── scenario_lock.py         # 100 lignes (standalone)
├── frontend/
│   └── CanonSimulationComponents.tsx  # 786 lignes
├── catalog/                     # YAML configs
├── scenarios/                   # Templates + Factors
├── simulation/                  # DSL + Generator
├── docs/                        # Documentation
└── MANIFEST.md
```

### Tests
✓ 9 tests passent (Need Canon + Scenario Lock)

### API Endpoints
**Canon:**
- `GET /canon/needs`
- `GET /canon/modules`
- `GET /canon/modules/{id}/dependencies`

**Simulation:**
- `GET /simulation/templates`
- `GET /simulation/factors`
- `POST /simulation/run`
- `GET /simulation/run/{id}/report`

---

## 📦 MODULE 4: VIDEO SCRIPTS

**ID:** `content.video_scripts`
**ZIP:** `CHENU_MODULE_VIDEO_v1.zip`

### Mission
Scripts pour vidéos AT-OM: calme, lucide, non-blâmant, urgent.

### Contenu
```
video/
├── docs/
│   ├── README.md
│   └── scripts/
│       ├── 01_surcharge_invisible.md
│       ├── 02_ia_surchargee.md
│       ├── 03_virage_at_om.md
│       └── 04_urgence_invitation.md
└── MANIFEST.md
```

---

## 🔗 INSTRUCTIONS POUR L'ASSEMBLEUR

### Ordre d'Intégration Recommandé
1. **Canon** (base - besoins et modules)
2. **Stagiaire** (dépend de core.governance)
3. **Professeur** (dépend de stagiaire)
4. **Video** (contenu indépendant)

### Checklist par Module
Pour chaque module:
- [ ] Extraire le ZIP
- [ ] Lire le MANIFEST.md
- [ ] Copier backend vers `app/modules/`
- [ ] Copier frontend vers `src/modules/`
- [ ] Ajouter routes à FastAPI main
- [ ] Exécuter les tests
- [ ] Vérifier intégration

### Dépendances
```
core.identity ← core.governance ← agents.stagiaire ← agents.professeur
                     ↑
               core.canon
```

---

## 🔐 GOUVERNANCE RAPPEL

**GOUVERNANCE > EXÉCUTION**

- Professeur: jamais en temps réel, cycle uniquement
- Stagiaire: jamais à chaud, fin de conversation uniquement
- Simulations: toujours `synthetic: true`
- Tous: aucun accès externe non autorisé

---

## ✅ VÉRIFICATION FINALE

| Check | Status |
|-------|--------|
| Tous les tests passent | ✅ |
| Manifests complets | ✅ |
| Documentation incluse | ✅ |
| Schemas JSON inclus | ✅ |
| Frontend React inclus | ✅ |
| Backend Python inclus | ✅ |
| Prêt pour Assembleur | ✅ |

---

**🚀 PRÊT POUR INTÉGRATION!**
