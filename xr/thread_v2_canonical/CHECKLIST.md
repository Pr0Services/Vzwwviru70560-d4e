# Implementation Checklist (Claude)

## Repo / Docs
- [ ] Add docs:
  - docs/canon/THREAD_V2_CANONICAL.md
  - docs/specs/THREAD_V2_TECH_SPECS.md
  - docs/specs/THREAD_V2_SECURITY_INVARIANTS.md
- [ ] Link from architecture index

## Data layer
- [ ] Tables: threads, thread_participants, thread_events, thread_snapshots
- [ ] Indices on (thread_id, created_at, event_type)
- [ ] Enforce exactly 1 memory_agent per thread

## API
- [ ] Create thread emits THREAD_CREATED
- [ ] Post event endpoint validates append-only + permissions
- [ ] Chat messages -> MESSAGE_POSTED
- [ ] Live start/end -> LIVE_STARTED/LIVE_ENDED
- [ ] Snapshot generation via memory agent

## UI
- [ ] Chat/Live/XR all read/write via event log
- [ ] No separate memory stores per mode

## Security
- [ ] Block edits/deletes of prior events
- [ ] Enforce redaction levels
- [ ] Audit trail for permission changes + memory agent reassignment

## Acceptance
- [ ] Run ACCEPTANCE_TESTS.md
