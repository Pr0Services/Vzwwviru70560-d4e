# CHE-NU — Thread v2 Canonical Package (for Claude)
Date: 2026-01-06

This package contains everything needed to implement the **Thread v2** definition:
- Official canonical definition (non-negotiable)
- Simple schema + invariants
- Technical specs (DB, API, XR projection rules)
- Security & governance invariants
- Implementation checklist + acceptance tests

## Goal
Unify **Chat / Live / XR Environment** as *projections* of the same canonical entity:
> **THREAD = single source of truth**
No duplicated memory, no autonomous environment state, no always-on agents.

## What Claude should do
1) Add/confirm Thread v2 docs in repo
2) Implement DB structures (or migrations) to support Thread v2
3) Implement API endpoints + validation
4) Implement Memory Agent lifecycle rules (on-demand, no persistent runtime)
5) Enforce security invariants in code paths (writes, permissions, append-only)
6) Update UI modules so Chat/Live/XR read/write the same thread event log

See: `CHECKLIST.md` and `ACCEPTANCE_TESTS.md`.
