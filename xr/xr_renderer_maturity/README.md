# CHE-NU — XR Renderer + Thread Maturity + UX Entry (PR-Ready Package)
Date: 2026-01-06

This package extends the XR generator package with:
1) **XR Renderer Minimal** (zones + objects + interactions -> ThreadEvents)
2) **Thread Maturity Model** (how environments evolve as threads grow)
3) **UX Entry Flow** (how users enter a thread as chat/live/xr without confusion)

## Canon rules (non-negotiable)
- Thread event log is the single source of truth.
- XR is a projection; no canonical XR state store.
- All mutations from XR are posted as ThreadEvents (permission-gated).
- Maturity is derived from events/snapshots; it does not replace truth.

## Contents
- PR plan + suggested commits
- Renderer contract + component spec
- Interaction-to-event mapping
- Thread maturity scoring + levels + environment evolution rules
- UX entry flows + copy + screens + edge cases
- Acceptance tests + implementation checklist
- Frontend stubs (TypeScript) + backend stub notes
