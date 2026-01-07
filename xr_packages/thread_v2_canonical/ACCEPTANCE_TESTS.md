# Acceptance Tests (Must Pass)

## Single source of truth
1) Thread creation produces THREAD_CREATED event.
2) Chat message produces MESSAGE_POSTED event.
3) Live start/end produce LIVE_STARTED/LIVE_ENDED events.
4) Snapshot generation produces SUMMARY_SNAPSHOT event.
5) XR UI displays derived state from events; no separate canonical XR DB state.

## Append-only
6) Attempt to edit an old event is rejected.
7) Corrections use CORRECTION_APPENDED referencing original event.

## Memory agent
8) Exactly one memory_agent participant exists per thread.
9) Reassignment requires PERMISSION_CHANGED + audit events.

## Permissions & privacy
10) Viewer cannot write events.
11) Redaction levels hide sensitive events from insufficient roles.
