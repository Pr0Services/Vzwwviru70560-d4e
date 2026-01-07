# 🏛️ CHE·NU V71 — Principes Canoniques

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                       PRINCIPES CANONIQUES V2                                ║
║                          CHE·NU™ V71                                         ║
║                                                                              ║
║   "Ces principes sont IMMUABLES. Ils définissent l'essence de CHE·NU."     ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 📜 Le Manifeste

```
╔════════════════════════════════════════════════════════════════╗
║                    THE CHE·NU MANIFESTO                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  1. STRUCTURE PRECEDES INTELLIGENCE                            ║
║     → L'architecture avant les features                        ║
║     → La clarté avant la puissance                            ║
║                                                                ║
║  2. VISIBILITY PRECEDES POWER                                  ║
║     → Tout est visible avant d'être puissant                  ║
║     → La transparence est non-négociable                      ║
║                                                                ║
║  3. HUMAN ACCOUNTABILITY IS NON-NEGOTIABLE                     ║
║     → L'humain est toujours responsable                       ║
║     → L'IA propose, l'humain dispose                          ║
║                                                                ║
║  4. SYSTEMS GUIDE DECISIONS; HUMANS DECIDE                     ║
║     → Les systèmes éclairent                                  ║
║     → Les humains décident                                    ║
║                                                                ║
║  5. CHE·NU IS BUILT FOR DECADES, NOT TRENDS                   ║
║     → Construit pour durer                                    ║
║     → Pas pour les modes                                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## 🎯 Les 12 Invariants Canoniques

### Invariant 1: APPEND-ONLY EVENT LOG

```python
# ✅ CORRECT
thread.append_event(event)

# ❌ INTERDIT - Ces méthodes N'EXISTENT PAS
thread.edit_event(event_id, new_data)   # N'EXISTE PAS
thread.delete_event(event_id)            # N'EXISTE PAS
```

**Justification:** L'historique est immuable. Les corrections créent de nouveaux événements.

### Invariant 2: SINGLE SOURCE OF TRUTH

```python
# ✅ CORRECT - Chat écrit dans le thread
thread.post_message(content)  # Crée MESSAGE_POSTED event

# ❌ INTERDIT - Pas de mémoire séparée
chat_database.save(message)   # N'EXISTE PAS
```

**Justification:** Le thread est la SEULE source de vérité.

### Invariant 3: DETERMINISTIC PROJECTIONS

```python
# XR environment_id est TOUJOURS dérivé du thread_id
xr_environment_id = f"xr_{thread_id}"

# ✅ CORRECT - Projection déterministe
xr_state = thread.derive_xr_state()

# ❌ INTERDIT - XR comme source de vérité
xr_database.save_state(xr_state)  # N'EXISTE PAS
```

**Justification:** Les projections sont calculées, pas stockées.

### Invariant 4: NO ALWAYS-ON AGENTS

```python
# ✅ CORRECT - Agent créé à la demande
memory_agent = thread.get_memory_agent()  # Créé si absent

# ❌ INTERDIT - Agent en boucle
while True:
    agent.process()  # JAMAIS de boucle infinie
```

**Justification:** Pas de processus background non contrôlés.

### Invariant 5: EXACTLY ONE MEMORY AGENT

```python
# ✅ CORRECT - Un seul memory agent par thread
assert len(thread.memory_agents) == 1

# ❌ INTERDIT - Plusieurs memory agents
thread.add_memory_agent(agent2)  # ERREUR
```

**Justification:** Un seul responsable de la mémoire.

### Invariant 6: LEAST PRIVILEGE

```python
# Memory Agent ne peut créer que ces types:
MEMORY_AGENT_ALLOWED = [
    "SUMMARY_SNAPSHOT",
    "CORRECTION_APPENDED"
]

# ✅ CORRECT
memory_agent.create_snapshot()

# ❌ INTERDIT
memory_agent.record_decision()  # PERMISSION DENIED
```

**Justification:** Principe du moindre privilège.

### Invariant 7: HUMAN SOVEREIGNTY

```python
# ✅ CORRECT - Décisions par humains
thread.record_decision(
    decision="Approuver budget",
    actor_type=ActorType.HUMAN,
    actor_id=user_id
)

# ❌ INTERDIT - Décisions autonomes par IA
thread.record_decision(
    decision="J'ai décidé de...",
    actor_type=ActorType.AGENT  # ERREUR: Agents ne décident pas
)
```

**Justification:** L'humain est souverain.

### Invariant 8: TRANSPARENCY

```python
# ✅ CORRECT - Tous les événements ont un acteur
event = ThreadEvent(
    actor_id="user_123",
    actor_type=ActorType.HUMAN,
    ...
)

# ❌ INTERDIT - Événements anonymes
event = ThreadEvent(
    actor_id=None,  # ERREUR: Requis
    ...
)
```

**Justification:** Traçabilité totale.

### Invariant 9: REDACTION BY ROLE

```python
# Viewer ne voit que PUBLIC
viewer_events = thread.get_events(viewer_id, role=Role.VIEWER)
assert all(e.redaction_level == "public" for e in viewer_events)

# Owner voit tout
owner_events = thread.get_events(owner_id, role=Role.OWNER)
# Inclut: public, semi_private, private
```

**Justification:** Protection des données par rôle.

### Invariant 10: DATA MINIMIZATION

```python
# ✅ CORRECT - Payload minimal
event = ThreadEvent(
    payload={"decision": "Approuver", "rationale": "Budget OK"}
)

# ❌ INTERDIT - Données sensibles dans payload
event = ThreadEvent(
    payload={"ssn": "123-45-6789", "credit_card": "..."}  # JAMAIS
)
```

**Justification:** Minimisation des données.

### Invariant 11: PERMISSION-GATED WRITES

```python
# ✅ CORRECT - Vérification permissions
if user.role == Role.VIEWER:
    raise PermissionError("Viewers cannot write")

# ❌ INTERDIT - Écriture sans vérification
thread.post_message(content)  # Sans vérifier les permissions
```

**Justification:** Contrôle d'accès strict.

### Invariant 12: NO HIDDEN AUTOMATION

```python
# ✅ CORRECT - Statistiques transparentes
stats = thread.get_stats()  # Visibles

# ❌ INTERDIT - Processus cachés
def _hidden_background_process():
    while True:
        process_secretly()  # JAMAIS
```

**Justification:** Pas d'automatisation cachée.

---

## 🚫 Les 5 Interdictions

### Interdiction 1: DUPLICATE MEMORY

```
❌ INTERDIT:
- Table séparée pour chat messages
- Base de données XR
- Cache persistant comme source

✅ REQUIS:
- TOUT passe par le Thread Event Log
```

### Interdiction 2: PERSISTENT AGENTS

```
❌ INTERDIT:
- Agents en boucle infinie
- Background workers non contrôlés
- Processus autonomes

✅ REQUIS:
- Agents activés à la demande
- Terminaison après tâche
```

### Interdiction 3: AUTONOMOUS ENVIRONMENTS

```
❌ INTERDIT:
- XR avec son propre état
- Environnements qui modifient sans thread event
- État persistant hors thread

✅ REQUIS:
- XR = projection du thread
- Toute interaction → ThreadEvent
```

### Interdiction 4: MODIFY WITHOUT MEMORY AGENT

```
❌ INTERDIT:
- Éditer événements directement
- Supprimer de l'historique
- Modifier sans trace

✅ REQUIS:
- Corrections via CORRECTION_APPENDED
- Links vers événement original
```

### Interdiction 5: CONFUSE HUMAN/AGENT

```
❌ INTERDIT:
- Événements sans actor_type
- Décisions par agents
- Attribution ambiguë

✅ REQUIS:
- Toujours actor_type: HUMAN | AGENT
- Décisions = HUMAN seulement
```

---

## 🔐 Matrice de Conformité

| Composant | Invariants Respectés | Status |
|-----------|---------------------|--------|
| Thread Service V2 | 12/12 | ✅ CONFORME |
| Memory Agent | 12/12 | ✅ CONFORME |
| XR Generator | 12/12 | ✅ CONFORME |
| Nova Pipeline | 12/12 | ✅ CONFORME |
| Agent Runtime | 12/12 | ✅ CONFORME |

---

## 📋 Checklist de Validation

Pour chaque nouveau composant:

```markdown
□ 1. Append-only: Pas de edit/delete sur events
□ 2. Single truth: Pas de stockage alternatif
□ 3. Deterministic: Projections calculées
□ 4. No always-on: Pas de boucles infinies
□ 5. One memory agent: Exactement un par thread
□ 6. Least privilege: Permissions minimales
□ 7. Human sovereignty: Décisions par humains
□ 8. Transparency: actor_id + actor_type
□ 9. Redaction: Filtrage par rôle
□ 10. Data minimization: Payloads minimaux
□ 11. Permission-gated: Vérification avant écriture
□ 12. No hidden: Pas d'automatisation cachée
```

---

## 🎯 Citation Fondatrice

> "Dans CHE·NU, tout commence par un thread.
> Tout s'y inscrit.
> Et rien n'existe en dehors de lui."

---

**© 2025-2026 CHE·NU™**  
**Principes Canoniques V2**  
**Status: LOCKED — Ne pas modifier sans revue architecturale**
