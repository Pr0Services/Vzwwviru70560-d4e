# Integration Notes

## Incremental strategy
1) Add thread_events as canonical log.
2) Route chat to MESSAGE_POSTED events.
3) Add live events + optional transcript links.
4) Add snapshots for performance.
5) XR reads derived state; writes only via events.

## Non-negotiables
- No duplicated memory
- Append-only log
- Exactly one memory agent per thread
