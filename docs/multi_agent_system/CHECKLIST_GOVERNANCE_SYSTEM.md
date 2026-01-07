# Implementation Checklist (Claude) — Governance System

## Docs
- [ ] Add canon + algorithms + backlogs docs
- [ ] Link from architecture index

## Core
- [ ] Implement governance signals pipeline (CEAs -> orchestrator)
- [ ] Implement QCT (quality/cost targeting) and SES (segment escalation)
- [ ] Implement RDC (drift control) with PATCH_INSTRUCTION format
- [ ] Add event types (ORCH_DECISION_MADE, GOVERNANCE_SIGNAL, etc.)

## Backlogs
- [ ] Implement backlog capture for errors/signals/costs
- [ ] Create weekly tuning job OR manual tuning workflow
- [ ] Ensure all tuning changes are auditable (events)

## Safety
- [ ] Enforce always-on CanonGuard (thread rules)
- [ ] Ensure no hidden background heavy agents
