# XR Environment Generator — Technical Spec (Canonical)

## 1) Definitions
- **Thread**: single source of truth (event log).
- **XR Environment**: a *projection* of thread state.
- **Blueprint**: derived JSON artifact describing room layout and interactables.

## 2) Projection-only rule
XR must not become a second truth:
- No XR tables holding canonical decisions/actions
- No XR-only memory
- Any XR interaction that changes state must create a ThreadEvent

## 3) Inputs
Generator reads:
- Thread.founding_intent
- Latest SUMMARY_SNAPSHOT (memory_summary / onboarding_brief)
- Open actions (ACTION_CREATED/UPDATED status)
- Decisions (DECISION_RECORDED)
- Links (LINK_ADDED) + inter-thread refs
- Live segments (LIVE_STARTED/LIVE_ENDED)

## 4) Outputs
Generator writes:
- ENV_BLUEPRINT_GENERATED (payload=blueprint)
Optionally also writes:
- Snapshot (thread_snapshots: snapshot_type='xr_blueprint')

## 5) Templates
Default templates:
- personal_room
- business_room
- cause_room
- lab_room
- custom_room

Template selection rules (deterministic):
- thread.type=personal -> personal_room
- thread.type=collective + mission keywords -> cause_room
- presence of finance/ops decisions -> business_room
- presence of hypotheses/experiments -> lab_room
- else -> custom_room

## 6) Canonical zones (always present)
- intent_wall
- decision_wall
- action_table
- memory_kiosk
- timeline_strip
- resource_shelf (if links exist)

## 7) Rendering contract
XR client:
- Loads blueprint
- Loads derived thread state (events/snapshots)
- Renders zones + items
- Sends mutations as ThreadEvents only (e.g., ACTION_UPDATED)

## 8) Caching
Blueprint caching is allowed:
- stored as snapshot or event payload
- must be deletable and regenerable without loss

## 9) Telemetry (optional)
XR_RENDERED events allowed for analytics, but must never be authoritative.
