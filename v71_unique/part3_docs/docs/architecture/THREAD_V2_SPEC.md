# CHE·NU™ Thread V2 — Complete Specification

```
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                              ║
║                              THREAD V2 SPECIFICATION                                         ║
║                                                                                              ║
║        "Dans CHE·NU, tout commence par un Thread. Tout s'y inscrit.                         ║
║         Et rien n'existe en dehors de lui."                                                 ║
║                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════╝
```

**Version:** 2.0.0  
**Status:** PRODUCTION READY  
**Compliance:** 100% Canonical

---

## 1. Overview

The Thread is the **atomic unit of meaning** in CHE·NU. It represents a bounded context for collaboration, decision-making, and action-taking.

### Key Principles

1. **Single Source of Truth** — The Thread's event log is the only authoritative data
2. **Append-Only** — Events are never modified or deleted
3. **Projection-Based Views** — Chat, Live, XR are projections of the event log
4. **Founding Intent** — Every Thread must have a founding_intent

---

## 2. Thread Model

### Core Structure

```python
@dataclass
class Thread:
    # Identity
    id: str                      # UUID
    founding_intent: str         # REQUIRED - Why does this thread exist?
    
    # Ownership
    owner_id: str                # Creator's identity
    sphere: Sphere               # One of the 9 spheres
    
    # State
    status: ThreadStatus         # ACTIVE | ARCHIVED
    visibility: Visibility       # PRIVATE | SHARED | PUBLIC
    
    # Timestamps
    created_at: datetime
    updated_at: datetime
    
    # Append-Only Event Log
    events: List[ThreadEvent]    # The single source of truth
    
    # Derived (from events)
    participants: Set[str]       # Derived from events
    statistics: ThreadStats      # Computed from events
```

### Founding Intent

The `founding_intent` is **required** and **immutable**:

```python
# ✅ Valid creation
thread = Thread(
    founding_intent="Build a marketing campaign for Q2 launch",
    owner_id=user_id,
    sphere=Sphere.BUSINESS
)

# ❌ Invalid - missing founding_intent
thread = Thread(owner_id=user_id)  # ValueError

# ❌ Invalid - modifying founding_intent
thread.founding_intent = "Something else"  # Forbidden
```

---

## 3. Event System

### Event Structure

```python
@dataclass
class ThreadEvent:
    # Identity
    id: str                      # UUID
    thread_id: str               # Parent thread
    
    # Type & Content
    event_type: EventType        # One of 15 types
    payload: Dict[str, Any]      # Event-specific data
    
    # Actor Attribution (REQUIRED)
    actor_id: str                # Who performed this action
    actor_type: ActorType        # HUMAN | AGENT
    
    # Integrity
    created_at: datetime
    integrity_hash: str          # SHA-256 hash
    
    # Links (for corrections, references)
    links: List[EventLink]       # Optional references
```

### Event Types

| Event Type | Purpose | Payload Example |
|------------|---------|-----------------|
| `THREAD_CREATED` | Thread initialization | `{founding_intent, sphere}` |
| `THREAD_ARCHIVED` | Thread closure | `{reason}` |
| `MESSAGE_POSTED` | Chat message | `{content, format}` |
| `LIVE_STARTED` | Real-time session begin | `{session_id, participants}` |
| `LIVE_ENDED` | Real-time session end | `{session_id, duration, snapshot}` |
| `DECISION_RECORDED` | Explicit decision | `{decision, rationale, options_considered}` |
| `ACTION_CREATED` | Task creation | `{action_id, title, assignee}` |
| `ACTION_UPDATED` | Task update | `{action_id, status, changes}` |
| `RESULT_RECORDED` | Outcome capture | `{result_type, data, metrics}` |
| `ERROR_RECORDED` | Error logging | `{error_type, message, context}` |
| `LEARNING_RECORDED` | Insight capture | `{learning, source, applicability}` |
| `SUMMARY_SNAPSHOT` | Memory agent summary | `{summary, key_points, onboarding_brief}` |
| `LINK_ADDED` | External resource | `{url, title, type}` |
| `PERMISSION_CHANGED` | Access modification | `{participant_id, role, action}` |
| `CORRECTION_APPENDED` | Correction (never edit) | `{corrected_text, reason}` |

### Append-Only Enforcement

```python
class Thread:
    def append_event(self, event: ThreadEvent) -> None:
        """Append event to log. The ONLY way to add events."""
        event.integrity_hash = self._compute_hash(event)
        self._events.append(event)
    
    # These methods DO NOT EXIST:
    # def edit_event(...)     ❌
    # def delete_event(...)   ❌
    # def replace_event(...)  ❌
```

---

## 4. Projections

Projections are **derived views** of the event log. They are not authoritative.

### Chat Projection

```python
class ChatProjection:
    """Derived from MESSAGE_POSTED events."""
    
    def get_messages(self, thread: Thread) -> List[Message]:
        return [
            Message(
                id=e.id,
                content=e.payload["content"],
                author_id=e.actor_id,
                timestamp=e.created_at
            )
            for e in thread.events
            if e.event_type == EventType.MESSAGE_POSTED
        ]
```

### XR Projection

```python
class XRProjection:
    """Derived from all events to create spatial environment."""
    
    def get_xr_state(self, thread: Thread) -> XRState:
        return XRState(
            environment_id=f"xr_{thread.id}",
            zones=self._derive_zones(thread.events),
            items=self._derive_items(thread.events),
            portals=self._derive_portals(thread.events)
        )
```

### Timeline Projection

```python
class TimelineProjection:
    """Chronological view of significant events."""
    
    def get_timeline(self, thread: Thread) -> List[TimelineEntry]:
        significant_types = {
            EventType.THREAD_CREATED,
            EventType.DECISION_RECORDED,
            EventType.ACTION_CREATED,
            EventType.LIVE_STARTED,
            EventType.RESULT_RECORDED
        }
        return [
            TimelineEntry(e.id, e.event_type, e.created_at)
            for e in thread.events
            if e.event_type in significant_types
        ]
```

---

## 5. Memory Agent

Each thread has **exactly one** memory agent.

### Constraints

```python
class MemoryAgent:
    """Single memory agent per thread."""
    
    ALLOWED_EVENT_TYPES = {
        EventType.SUMMARY_SNAPSHOT,
        EventType.CORRECTION_APPENDED
    }
    
    def generate_snapshot(self, thread: Thread) -> ThreadEvent:
        """Generate summary from events."""
        summary = self._summarize(thread.events)
        return ThreadEvent(
            event_type=EventType.SUMMARY_SNAPSHOT,
            actor_type=ActorType.AGENT,
            payload={"summary": summary}
        )
    
    def append_correction(self, original_id: str, correction: str) -> ThreadEvent:
        """Correct without editing."""
        return ThreadEvent(
            event_type=EventType.CORRECTION_APPENDED,
            actor_type=ActorType.AGENT,
            payload={"corrected_text": correction},
            links=[EventLink(type="corrects", target_id=original_id)]
        )
```

### Forbidden Actions

```python
# ❌ Memory agent CANNOT:
memory_agent.post_message()       # MESSAGE_POSTED not allowed
memory_agent.create_action()      # ACTION_CREATED not allowed
memory_agent.record_decision()    # DECISION_RECORDED not allowed
```

---

## 6. Participants & Permissions

### Roles

| Role | Capabilities |
|------|--------------|
| `OWNER` | Full control, can archive, can manage permissions |
| `EDITOR` | Can post messages, create actions, record decisions |
| `VIEWER` | Read-only access to permitted content |

### Permission Enforcement

```python
def post_message(thread: Thread, user_id: str, content: str) -> ThreadEvent:
    """Post message with permission check."""
    role = thread.get_participant_role(user_id)
    
    if role not in {Role.OWNER, Role.EDITOR}:
        raise PermissionError("Viewers cannot post messages")
    
    return thread.append_event(
        ThreadEvent(
            event_type=EventType.MESSAGE_POSTED,
            actor_id=user_id,
            actor_type=ActorType.HUMAN,
            payload={"content": content}
        )
    )
```

### Redaction

Events have redaction levels for privacy:

```python
class RedactionLevel(Enum):
    PUBLIC = "public"           # Everyone can see
    SEMI_PRIVATE = "semi_private"  # Editors+ can see
    PRIVATE = "private"         # Owner only
```

---

## 7. Live Sessions

Real-time collaboration sessions within threads.

### Lifecycle

```
LIVE_STARTED → [activity] → LIVE_ENDED (with snapshot)
```

### Events

```python
# Start session
ThreadEvent(
    event_type=EventType.LIVE_STARTED,
    payload={
        "session_id": "live_123",
        "participants": ["user_a", "user_b"]
    }
)

# End session
ThreadEvent(
    event_type=EventType.LIVE_ENDED,
    payload={
        "session_id": "live_123",
        "duration_seconds": 1800,
        "snapshot": {
            "messages_count": 45,
            "decisions_made": 2,
            "actions_created": 5
        }
    }
)
```

---

## 8. Decisions & Actions

### Decisions

Explicit decision recording with rationale:

```python
ThreadEvent(
    event_type=EventType.DECISION_RECORDED,
    actor_id="user_123",
    actor_type=ActorType.HUMAN,  # Decisions are ALWAYS human
    payload={
        "decision": "Launch MVP in March",
        "rationale": "Market timing is optimal",
        "options_considered": [
            {"option": "Launch in February", "rejected_because": "Too rushed"},
            {"option": "Launch in April", "rejected_because": "Misses Q1"}
        ]
    }
)
```

### Actions

Task lifecycle:

```
ACTION_CREATED → [ACTION_UPDATED]* → ACTION_UPDATED(status=completed)
```

```python
# Create
ThreadEvent(
    event_type=EventType.ACTION_CREATED,
    payload={
        "action_id": "act_001",
        "title": "Design landing page",
        "status": "pending",
        "assignee_id": "user_456"
    }
)

# Update
ThreadEvent(
    event_type=EventType.ACTION_UPDATED,
    payload={
        "action_id": "act_001",
        "status": "completed",
        "completed_at": "2026-01-07T15:00:00Z"
    }
)
```

---

## 9. Corrections

**Never edit. Only correct.**

```python
# Original event (has an error)
original = ThreadEvent(
    id="evt_001",
    event_type=EventType.MESSAGE_POSTED,
    payload={"content": "The meeting is at 3pm"}  # Wrong!
)

# Correction (references original)
correction = ThreadEvent(
    event_type=EventType.CORRECTION_APPENDED,
    payload={"corrected_text": "The meeting is at 4pm"},
    links=[
        EventLink(type="corrects", target_id="evt_001")
    ]
)

# Original stays intact, correction linked
```

---

## 10. Statistics

Computed from event log:

```python
@dataclass
class ThreadStats:
    total_events: int
    messages_count: int
    decisions_count: int
    actions_count: int
    actions_completed: int
    live_sessions_count: int
    total_live_duration: int  # seconds
    participants_count: int
    last_activity: datetime
```

---

## 11. API Endpoints

### Thread Management

```
POST   /api/v2/threads                    # Create thread
GET    /api/v2/threads/{id}               # Get thread
GET    /api/v2/threads/{id}/events        # Get all events
POST   /api/v2/threads/{id}/archive       # Archive thread
```

### Events

```
POST   /api/v2/threads/{id}/events        # Append event
GET    /api/v2/threads/{id}/events/{eid}  # Get specific event
```

### Projections

```
GET    /api/v2/threads/{id}/chat          # Chat projection
GET    /api/v2/threads/{id}/timeline      # Timeline projection
GET    /api/v2/threads/{id}/xr            # XR projection
POST   /api/v2/threads/{id}/xr/generate   # Generate XR blueprint
```

### Live Sessions

```
POST   /api/v2/threads/{id}/live/start    # Start session
POST   /api/v2/threads/{id}/live/end      # End session
```

### Memory

```
POST   /api/v2/threads/{id}/snapshot      # Generate snapshot
GET    /api/v2/threads/{id}/snapshots     # List snapshots
```

---

## 12. Canonical Compliance Checklist

| Invariant | Status |
|-----------|--------|
| Append-only event log | ✅ |
| Single source of truth | ✅ |
| Founding intent required | ✅ |
| One memory agent | ✅ |
| Actor attribution | ✅ |
| Corrections via links | ✅ |
| Permission enforcement | ✅ |
| Deterministic projections | ✅ |
| Integrity hashes | ✅ |
| No autonomous execution | ✅ |

---

## 13. Implementation Reference

See:
- `backend/services/thread_v2.py` — Core implementation
- `backend/xr_generator/xr_env_generator.py` — XR projection
- `THREAD_V2_QUALITY_UX_REPORT.md` — Quality validation

---

```
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                              ║
║                    "The Thread is the single source of truth."                               ║
║                                                                                              ║
║                              CHE·NU™ Thread V2 Spec                                         ║
║                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════╝
```

---

© 2026 CHE·NU™ — Thread V2 Specification
