# CHE·NU™ — Truth Document (V71) 

> **Ce document est la source canonique de vérité** pour éviter la perte de specs et la dérive des implémentations.  
> Toute PR/commit qui contredit ce document doit être corrigée ou justifiée par une **mise à jour explicite** de ce document.

---

## A. Invariants système (non négociables)

### A1) Gouvernance & sérieux
- CHE·NU™ est un système **gouverné**, orienté **utilité**, **traçabilité** et **sécurité**.
- Pas de “lore” inventé ni d’affirmations extraordinaires sans base vérifiable.

### A2) 3 Hubs = structure principale
1) **Navigation** = *Voir* (contexte, carte, monde, liens)
2) **Communication** = *Dire* (threads, décisions, meetings, courriels, suivi)
3) **Execution / Workspace** = *Faire* (outils, édition, génération d’artifacts)

**Règle**: une action part d’une intention (Communication), se contextualise (Navigation) et s’exécute (Workspace). Le retour (status/artifacts) remonte ensuite dans Communication.

### A3) Hiérarchie d’orchestration
- Chaque profil possède **un orchestrateur général**.
- Chaque sphère a un **orchestrateur de sphère**.
- Des orchestrateurs additionnels peuvent exister **dans la hiérarchie** (ex: entreprise/coop, projet, poste permanent).
- Les agents sont **outils**: pas d’autonomie politique; ils exécutent, préparent, demandent validation.

### A4) Mémoire & conversation anti‑latence
- Chaque agent a:
  - **Conversation active** (court)
  - **Historique consultable** (hors flux principal)
- Mémoire **3‑tiers**:
  - **Hot**: contexte immédiat
  - **Medium**: résumés, décisions, préférences, profils
  - **Cold**: archives (transcripts, pièces jointes)

### A5) AT‑OM / vibration
- **AT‑OM = moteur interne de mapping** (indexation, numérologie, couches de transformation).
- **UX grand public**: affichage standard + AT‑OM Mapping comme encyclopédie.
- **UX avancée**: option pour voir la couche “piano / fréquences / racines”.

---

## B. Layout canonique (Front-end)

### B1) Shell global
- **Left rail**: Navigation / Sphères (panneau pouvant s’ouvrir / se fermer, minimisant la surcharge)
- **Bottom / Side**: Communication (hub compact, extensible dans le workspace)
- **Main**: Workspace (Execution)
- **Top right**: Services CHE·NU + services connectés + statut (sync, trust, etc.)

### B2) Règles d’affichage
- Toujours fournir un **affichage de base** (MVD) même sans données riches.
- Densité d’info contrôlée via niveaux (Focus / Context / Full) mais jamais “vide inutile”.

---

## C. Organisation canonique des données (Communication Hub)

### C1) Arborescence logique
**Communication Hub → Sphère → Agent concerné → Dossier de tâche → Thread + Artifacts + Suivi**

### C2) Level of Detail (LOD)
- Tâche simple → entrée courte (log)
- Tâche complexe → dossier complet (sous‑espace projet)

---

## D. Intégration de la sphère AT‑OM Mapping

### D1) Définition
- Encyclopédie structurée: histoire de l’humanité + civilisations + forces naturelles + symboles + nombres.
- Chaque entrée doit pouvoir se lier à:
  - Concepts
  - Événements
  - Sources
  - Relations causales / analogies

### D2) Règles anti‑dérive
- On décrit ce qui existe dans l’histoire/documentation.
- On n’ajoute pas de “mythologie factuelle”.
- Les analogies numérologiques sont présentées comme **grilles de lecture**, pas comme preuves.

---

## E. Critères de vérification (freeze v1)

### E1) Tests UX (front)
- Navigation ↔ Communication ↔ Workspace: un changement de contexte doit synchroniser les 3 hubs.
- Aucun écran mort: au minimum MVD + contenu contextuel.
- AT‑OM: visible en mode public (encyclopédie), avancé en mode dev.

### E2) Tests structure & intégration
- Orchestrateur général + orchestrateurs de sphère: présents et documentés.
- Mémoire 3‑tiers: endpoints/services définis, UI de consultation d’archives.
- Aucune régression du layout (rails/positions).

### E3) DoD Freeze
- Documentation + layout + orchestrations + mémoire + AT‑OM intégrés.
- Script d’installation & smoke tests passent.

---

## F. Plan de continuation (après freeze)
- Étendre AT‑OM Mapping (import sources, taxonomy, graph).
- Renforcer l’orchestrateur (routing + synapses + policies).
- Ajouter instrumentation (logs, traces, audits) sans alourdir l’UI.

