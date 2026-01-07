# Scenario‑Lock Simulation System (Canon)

## Idea
Each simulation run is a combination lock:
- **Template** = fixed *form* (shape of onboarding + usage)
- **Factors** = variable digits (profile, circumstance, cadence, tool activations, constraints)
- **Modules** = activable set chosen by needs, dependencies, and risk

We vary factors, NOT form:
`run = template × factors × module_set`

## Terms
- **Template**: a structured sequence of phases and steps. Never changes shape.
- **Factor**: a parameter that can take values; changes the run behavior.
- **ModuleSet**: a set of enabled modules with activation modes.

## 30‑Day Runs
Each onboarding scenario can expand into 30 days of activities.
Day scripts are generated from the template + factor values:
- daily actions
- meetings/calls
- tool activations
- decision points
- governance triggers
- outcomes and backlogs

## What we test
- correctness (append-only, identity boundary)
- governance calibration (noise vs missed violations)
- cost/latency control (QCT + selective escalation)
- UX calmness (warns hidden by default)
- resilience (disconnects, retries, incomplete onboarding)

See also:
- `simulation/dsl/README_DSL.md`
- `simulation/generator/GENERATOR_SPEC.md`
