# 🤝 Contributing to CHE·NU

Merci de votre intérêt pour contribuer à CHE·NU! Ce document explique le processus de contribution.

## 📋 Code of Conduct

- Respect et professionnalisme
- Feedback constructif
- Collaboration ouverte

## 🔄 Workflow de Contribution

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/che-nu.git
cd che-nu
git remote add upstream https://github.com/che-nu/che-nu.git
```

### 2. Créer une branche

```bash
git checkout -b feature/amazing-feature
# ou
git checkout -b fix/bug-description
```

### 3. Développer

```bash
# Installer les dépendances
pip install -r requirements-dev.txt

# Lancer les tests
pytest -v

# Vérifier le style
black . && isort . && flake8
```

### 4. Commit (Conventional Commits)

```bash
# Types: feat, fix, docs, style, refactor, test, chore
git commit -m "feat: add amazing feature"
git commit -m "fix: resolve issue #123"
```

### 5. Push & PR

```bash
git push origin feature/amazing-feature
# Ouvrir une Pull Request sur GitHub
```

## 🏛️ Règles Canoniques

**IMPORTANT:** Toute contribution DOIT respecter les [Principes Canoniques](./docs/CANONICAL_PRINCIPLES.md).

Checklist avant PR:
- [ ] Append-only events (pas d'edit/delete)
- [ ] Single source of truth (pas de mémoire dupliquée)
- [ ] Human sovereignty (décisions par humains)
- [ ] Tests avec coverage ≥80%

## 📝 Structure des PRs

```markdown
## Description
Brief description of changes

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactor

## Canonical Compliance
- [ ] Respects 12 invariants
- [ ] No hidden automation
- [ ] Human sovereignty preserved

## Tests
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Coverage ≥80%
```

## 🧪 Tests

```bash
# Unit tests
pytest tests/unit -v

# Integration tests
pytest tests/integration -v

# Coverage
pytest --cov=backend --cov-report=html
```

## 📚 Documentation

- Documenter toutes les fonctions publiques
- Mettre à jour le README si nécessaire
- Ajouter des exemples pour les nouvelles features

---

**Questions?** Ouvrez une issue ou contactez l'équipe.
