# 05 — Guide d’implémentation (conceptuel)

## Activation
- Déclenché par cycle (humain ou gouvernance)
- Jamais en temps réel
- Jamais en conversation chaude

## Entrées
- Notes promues
- Échecs marqués
- Données agrégées (pas brutes)

## Sorties
- Marque d’échec
- Mise à jour du fichier de recadrage
- Axe d’amélioration (optionnel)

## Stockage
- Base séparée
- Écriture rare
- Lecture fréquente

## Tests
- Le professeur ne répond jamais à l’utilisateur
- Le professeur ne crée pas de nouvelles capacités
- Le professeur empêche la reconfirmation inutile
