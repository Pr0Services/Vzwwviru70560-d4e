# 07 — Guide d’implémentation (pragmatique, non prescriptif)

Ce guide décrit **comment** implémenter le canon sans imposer de technologies.

## 1) Machine d’état minimale
### États
- `HOT` : conversation active (réponse attendue)
- `COOLING` : conversation qui ralentit
- `ENDED` : fin détectée (moment “bye”)
- `STAGIARY_REVIEW` : revue rapide post-hoc
- `COOLDOWN` : verrou 15 min (si fausse alerte)

### Transitions
- `HOT → COOLING` : après réponse principale + absence d’action en cours
- `COOLING → ENDED` : seuil d’inactivité / indicateurs UX
- `ENDED → STAGIARY_REVIEW` : activation stagiaire
- `STAGIARY_REVIEW → COOLDOWN` : décision = Silence
- `STAGIARY_REVIEW → HOT` : décision = Note (ou question) puis retour normal
- `COOLDOWN → HOT` : après 15 minutes

> Le stagiaire ne doit jamais se déclencher si `COOLDOWN` est actif.

## 2) UX recommandée
### Remplacement de “bye”
Option A : micro-ligne neutre “Le stagiaire révise la conversation.”  
Option B : silence total (aucune UI)

### Question unique (rare)
- une seule question
- courte
- optionnelle
- jamais bloquante

## 3) Stockage : séparation stricte
1) **Logs conversation** (agent de données, exhaustif)
2) **Mémoire canonique** (stabilisée, gouvernée)
3) **Mémoire stagiaire** (petite, triée, questions/patterns)

> Le stagiaire écrit dans (3) uniquement.
> La promotion vers (2) passe par validation/revue.

## 4) Rituel de promotion (workflow)
1) Le stagiaire accumule des notes “candidates”
2) Revue (humain ou agent gouvernance) :
   - récurrence
   - transférabilité
   - absence de données sensibles
   - valeur structurelle
3) Promotion = capacité/règle/template dans la sphère/secteur

## 5) Schéma de données (recommandé)
Voir `schemas/` et `examples/`.

## 6) Déclencheur “fin de conversation”
Choisir une règle stable : message de clôture / bouton “terminer” / inactivité + pas de tâche en cours / fermeture UI.
> Une seule règle d’activation, consistante.

## 7) Cooldown 15 minutes
- Stocker `stagiaire_cooldown_until`
- Si maintenant < cooldown_until : ne pas activer
- Cooldown s’active uniquement si résultat = **Silence**

## 8) Tests fonctionnels
- Le stagiaire ne parle jamais à chaud
- Le stagiaire ne se déclenche que sur fin de conversation
- Après fausse alerte, aucune activation pendant 15 min
- Le stagiaire n’écrit jamais en mémoire canonique
- Les notes stagiaire restent petites et triées
- La promotion exige un processus séparé
