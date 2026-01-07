# CHE·NU / AT‑OM — Need Canon v1 + Module Catalog v1 + Scenario‑Lock Simulation System
Date: 2026-01-07

This package contains:
- **Need Canon v1** (a stable, extensible list of human/system needs)
- **Module Catalog v1** (modules + dependencies + risks + costs + needs mapping)
- **Scenario‑Lock Templates** (same “shape”, varying “factors” like a combination lock)
- **30‑Day Onboarding Simulation DSL** (daily activities, calls, meetings, tool activation)
- **Generator Spec** (how to produce thousands of runs consistently)

## How to use (high level)
1) Start with `docs/canon/NEED_CANON_V1.md` and `catalog/need_canon.v1.yaml`
2) Review `catalog/module_catalog.v1.yaml`
3) Pick a scenario template from `scenarios/templates/`
4) Choose factor values (profile, circumstance, tool activation, cadence, etc.)
5) Produce a run plan using `simulation/dsl/` (30‑day scripts)
6) Collect outputs as backlogs/metrics (see `simulation/outputs/`)

## Design principle
- **We vary factors, not form.** Scenario templates are fixed “shapes”.
- Each run is a unique combination: **template × factors × module set**.
