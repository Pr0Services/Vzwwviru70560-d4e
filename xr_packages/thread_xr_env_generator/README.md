# CHE-NU — Thread → XR Environment Generator (PR-Ready Package)
Date: 2026-01-06

This package is PR-ready for implementing **Thread → Environment Generator** as a **projection-only** pipeline,
fully compatible with **Thread v2 (single source of truth)**.

## Core principle (non-negotiable)
- THREAD event log = canonical truth
- XR environment = deterministic projection
- Blueprint = derived artifact (cacheable, never canonical)
- XR writes only via thread events (permission-gated)

## Contents
- PR plan + commit messages
- Specs (XR generator, blueprint schema, mapping rules)
- Security invariants
- API contract + FastAPI stubs (pseudo + minimal code)
- Acceptance tests
- Implementation checklist

Hand this to Claude and ask them to implement in your repo.
