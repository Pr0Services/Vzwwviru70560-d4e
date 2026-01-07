# System Architecture Overview

## Layers (from truth to experience)
1) **Thread Core** (event log + snapshots) — canonical
2) **Governance Layer** (orchestrator + CEAs + memory)
3) **Execution Layer** (executor + specialist workers)
4) **Projection Layer** (chat/live/xr UI)

## Control loops
### Loop A — Execution loop
Executor produces draft outputs; emits events for actions/decisions.

### Loop B — Governance loop (realtime)
CEAs observe outputs and context; emit signals.
Orchestrator decides micro-corrections/escalations; applies corrections via instructions/events.

### Loop C — Learning loop (backlogs)
Backlogs store misses, costs, false positives, and outcomes.
Orchestrator updates policies, thresholds, and spec catalog.

## Key idea
Governance is distributed observation + centralized decision.
