# CHE-NU — Security & Governance Invariants (Canonical)

## Data integrity
1) Append-only event log (immutable past; corrections appended)
2) Single source of truth (no duplicated memory across chat/live/xr)
3) Deterministic projections (XR rooms cannot exist without thread reference)

## Agents
4) No always-on agents (on-demand only)
5) Exactly one memory agent per thread (reassignment audited)
6) Least privilege (memory agent cannot silently change perms or rewrite history)

## Human sovereignty
7) Humans remain final decision-makers
8) Transparency: all agent writes are events with actor identity

## Privacy
9) Redaction levels: public / semi_private / private enforced by role
10) Data minimization: store only what is required and consented

## Abuse prevention
11) Permission-gated writes + rate limiting recommended
12) No hidden automation: background jobs must be auditable as events
