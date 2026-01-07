# CHE-NU — Thread v2 Technical Specs

## 0) Design principles
- **Single Source of Truth:** Thread event log is canonical.
- **Append-only:** No silent edits of past events; only append corrections with references.
- **Projection model:** Chat/Live/XR are views of the same log.
- **On-demand agents:** Agents are instantiated on request; no continuous background loops.
- **Least privilege:** Permissions by role per thread.

---

## 1) Domain model (entities)
### 1.1 Thread
Core fields:
- id (UUID/ULID)
- type: personal | collective | inter_sphere
- title (optional but recommended)
- founding_intent (required)
- status: active | dormant | archived
- created_at, updated_at

### 1.2 ThreadParticipant
- thread_id
- subject_type: human | agent
- subject_id
- role: owner | admin | contributor | viewer | memory_agent | specialist_agent
- permissions (optional overrides)

### 1.3 ThreadEvent (append-only log)
Required:
- event_id, thread_id, event_type, created_at
- actor_type: human | agent
- actor_id
- payload (JSON)
Optional:
- links, integrity hash, redaction_level

Minimum event types:
- THREAD_CREATED
- MESSAGE_POSTED
- LIVE_STARTED
- LIVE_ENDED
- DECISION_RECORDED
- ACTION_CREATED
- ACTION_UPDATED
- RESULT_RECORDED
- ERROR_RECORDED
- LEARNING_RECORDED
- SUMMARY_SNAPSHOT
- LINK_ADDED
- PERMISSION_CHANGED
- THREAD_ARCHIVED
- CORRECTION_APPENDED

### 1.4 ThreadSnapshot (derived)
Materialized summaries for fast UX:
- snapshot_type: memory_summary | state_summary | onboarding_brief
- references: list of event_ids

---

## 2) XR generation rules (projection)
- XR environment id maps deterministically to thread_id
- XR stores **no authoritative state**
- Layout derived from: founding_intent, snapshots, open actions/decisions, links

Suggested zones:
- Intent wall, Decision wall, Action table, Resource shelf, Timeline strip, Memory kiosk

---

## 3) Memory Agent lifecycle
- Exactly one memory agent per thread
- Invoked on-demand (user request) + optional triggers (live end)
- Writes only SUMMARY_SNAPSHOT and CORRECTION_APPENDED (no deletions)

---

## 4) API spec (FastAPI-friendly)
Threads:
- POST /threads
- GET /threads/{thread_id}
- PATCH /threads/{thread_id} (title/status only)
- POST /threads/{thread_id}/archive

Events:
- GET /threads/{thread_id}/events
- POST /threads/{thread_id}/events

Chat view:
- POST /threads/{thread_id}/chat/messages -> MESSAGE_POSTED
- GET  /threads/{thread_id}/chat/messages

Live:
- POST /threads/{thread_id}/live/start -> LIVE_STARTED
- POST /threads/{thread_id}/live/end   -> LIVE_ENDED (+ optional snapshot trigger)

Snapshots:
- GET /threads/{thread_id}/snapshots/latest?type=memory_summary
- POST /threads/{thread_id}/snapshots/generate

Participants/permissions:
- GET/POST /threads/{thread_id}/participants
- POST /threads/{thread_id}/permissions/change -> PERMISSION_CHANGED

---

## 5) Validation rules
- Reject writes without permission
- Reject edits of past events (append-only)
- Enforce exactly one memory_agent per thread
- XR must write only through events
