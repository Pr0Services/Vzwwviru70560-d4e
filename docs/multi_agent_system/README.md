# AT-OM / CHE-NU — Multi-Agent Governance System (Complete Spec Package)
Date: 2026-01-06

This package defines the **complete governance system** for CHE-NU / AT-OM:
- Principles (canonical)
- Agent roles (Executor, Orchestrator, Memory, Criterion Enforcers, Specialists)
- Algorithms (quality-cost targeting, selective escalation, realtime correction)
- Event model additions
- Backlog loop: how backlogs improve decisions and orchestration over time
- Implementation checklist + acceptance tests

## Non-negotiables (thread v2 alignment)
- Thread event log is the single source of truth (append-only).
- Chat / Live / XR are projections.
- Agents are on-demand unless explicitly configured; no hidden always-on workers.
- Governance actions must be auditable as events.

Start with:
- docs/canon/GOVERNANCE_CANON.md
- docs/algorithms/QUALITY_COST_TARGETING.md
- docs/backlogs/BACKLOG_DECISION_IMPROVEMENT.md
