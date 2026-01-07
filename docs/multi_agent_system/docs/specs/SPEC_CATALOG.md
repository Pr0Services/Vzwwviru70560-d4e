# Spec Catalog (Checks) — Canonical Structure

A **Spec** is a check policy with cost, latency, and risk coverage.

## Spec definition (fields)
- id
- name
- category: correctness | safety | coherence | style | compliance | performance | cost
- cost_level: 1-5
- latency_level: 1-5
- risk_coverage: list
- triggers: conditions
- cooldown: seconds/turns
- output: signal | patch | block
- owner_agent: CEA or specialist

## Example minimal catalog
- CANON_GUARD (cost1)  — enforces thread truths (append-only, no duplicate memory)
- SCHEMA_GUARD (cost1) — validates JSON/schema output
- SECURITY_GUARD (cost2) — checks invariants
- COHERENCE_GUARD (cost2) — detects contradictions/drift
- STYLE_GUARD (cost1) — formatting, clarity
- DEEP_CRITIC (cost4) — heavy critic review (async preferred)
- LEGAL_COMPLIANCE (cost5) — heavy, high stakes
