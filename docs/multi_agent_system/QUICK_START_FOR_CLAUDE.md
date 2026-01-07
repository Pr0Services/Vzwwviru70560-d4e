# Quick Start for Claude

1) Add docs under `docs/` paths provided here.
2) Add event types to your ThreadEvent enum/registry.
3) Implement CEAs as lightweight checkers producing GOVERNANCE_SIGNAL.
4) Implement Orchestrator:
   - QCT (quality/cost targeting)
   - SES (segment escalation)
   - RDC (drift control)
5) Implement Backlog capture:
   - create backlog item on escaped defects, noisy specs, cost spikes
6) Add acceptance tests and wire them into CI if possible.

Non-negotiables:
- append-only events
- projection-only XR
- auditable governance actions
