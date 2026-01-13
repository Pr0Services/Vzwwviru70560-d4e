# XR Renderer Minimal — Specification (Canonical)

## 1) Purpose
Render an XR room from a Blueprint (derived) and thread-derived state.
Must be:
- Deterministic
- Stateless (canonical)
- Event-sourced for all mutations

## 2) Inputs
- Blueprint (from ENV_BLUEPRINT_GENERATED or snapshot xr_blueprint)
- Derived thread state:
  - founding_intent
  - latest summaries (SUMMARY_SNAPSHOT)
  - decisions (DECISION_RECORDED)
  - actions (derived from ACTION_CREATED/ACTION_UPDATED)
  - live segments (LIVE_*)
  - links (LINK_ADDED)

## 3) Render primitives (minimal)
- Zone surfaces:
  - Wall, Table, Kiosk, Shelf, Timeline
- Items:
  - IntentCard
  - DecisionCard
  - ActionCard
  - MemoryCard
  - ResourceCard
  - TimelineMarker
- Portal:
  - ThreadPortal (to linked thread)

## 4) Canonical zones (must render)
- intent_wall (Wall + IntentCard)
- decision_wall (Wall + DecisionCards)
- action_table (Table + ActionCards grouped by status)
- memory_kiosk (Kiosk + MemoryCard)
- timeline_strip (Timeline + Markers)
- resource_shelf (Shelf + ResourceCards) — only if blueprint contains it

## 5) Interactions (minimal set)
### Read interactions
- Open item details
- Jump to source (event/snapshot reference)
- Filter (e.g., actions by status)

### Write interactions (must emit ThreadEvents)
- Mark action as done
- Move action status (todo/doing/done)
- Add note (creates NOTE event or MESSAGE_POSTED with tag)
- Create new action (ACTION_CREATED)

## 6) All write interactions -> ThreadEvents
Renderer must not mutate local canonical state.
Instead:
1) Optimistic UI update (optional)
2) POST ThreadEvent
3) Reconcile with derived state refresh

## 7) Permissions
- Renderer must respect viewer role:
  - Viewer: read-only
  - Contributor: can create/update actions, add notes
  - Admin/Owner: can do all permitted event writes (still append-only)
- Redaction levels:
  - Items with insufficient redaction_level must be hidden from the client payload.

## 8) Offline / disconnect
- If client is offline, buffer events locally and submit when reconnected
- Event payload must include idempotency key to prevent duplicates
