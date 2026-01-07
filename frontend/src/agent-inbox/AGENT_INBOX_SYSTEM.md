# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU — AGENT INBOX / MESSAGE / TASK SYSTEM
# CANONICAL DATA MODEL + IMPLEMENTATION
# ═══════════════════════════════════════════════════════════════════════════════

**Version**: 1.0.0
**Status**: CANONICAL - AUTHORITATIVE
**Priority**: CRITICAL

---

## GLOBAL PRINCIPLES

> **Every agent has a dedicated Inbox.**
> **All tasks, instructions, decisions, comments, and feedback MUST pass through this system.**

| Principle | Rule |
|-----------|------|
| **Chat = Source of Truth** | All communication is text-based and structured |
| **Voice = Accelerator Only** | Must be transcribed, reviewed, and confirmed |
| **No Execution Without Entity** | Nothing executes without a structured message or task |
| **Full Traceability** | Every message and task is auditable and replayable |
| **No Parallel Channels** | No informal or alternative communication allowed |

---

## DATA MODELS

### AgentInbox

Every agent has exactly ONE inbox per sphere.

```
MODEL AgentInbox {
  id                string      // UUID
  sphere_id         string      // FK → Sphere.id
  agent_id          string      // FK → AgentInstance.id
  unread_count      int         // Cached count for UI
  last_activity_at  datetime    // Last message/task activity
  is_muted          boolean     // User preference
  created_at        datetime
}
```

**Constraints**:
- UNIQUE(sphere_id, agent_id)
- agent_id must reference valid AgentInstance
- unread_count >= 0

---

### InboxMessage

All communication flows through messages.

```
MODEL InboxMessage {
  id                      string      // UUID
  inbox_id                string      // FK → AgentInbox.id
  
  // Sender
  sender_type             string      // USER | AGENT | SYSTEM
  sender_id               string      // User ID or Agent ID
  
  // Classification
  message_type            string      // TASK | NOTE | COMMENT | QUESTION | DECISION | VOICE_TRANSCRIPT
  priority                string      // LOW | NORMAL | HIGH | CRITICAL
  
  // Content
  content_text            string      // Main message body
  content_summary         string?     // AI-generated summary (optional)
  
  // Voice-specific
  voice_file_ref          string?     // Reference to audio file
  transcription_confidence float?     // 0.0-1.0 confidence score
  requires_confirmation   boolean     // TRUE if voice input needs user validation
  
  // Relations
  related_task_id         string?     // FK → Task.id
  related_decision_id     string?     // FK → Decision.id
  
  // Timestamps
  created_at              datetime
  acknowledged_at         datetime?   // When agent acknowledged
  
  // Status
  status                  string      // NEW | READ | ACKNOWLEDGED | ARCHIVED
}
```

**Message Types**:
| Type | Description | Creates Task |
|------|-------------|--------------|
| `TASK` | Actionable request | Yes |
| `NOTE` | Information only | No |
| `COMMENT` | Feedback/response | No |
| `QUESTION` | Clarification request | No |
| `DECISION` | Finalized decision | No |
| `VOICE_TRANSCRIPT` | Transcribed voice | Depends |

**Priority Levels**:
| Priority | Response Time | UI Treatment |
|----------|---------------|--------------|
| `LOW` | When convenient | Gray indicator |
| `NORMAL` | Same day | Blue indicator |
| `HIGH` | Within hours | Orange indicator |
| `CRITICAL` | Immediate | Red indicator + alert |

---

### Task

Actionable work items assigned to agents.

```
MODEL Task {
  id                string      // UUID
  sphere_id         string      // FK → Sphere.id
  
  // Assignment
  assigned_agent_id string      // FK → AgentInstance.id
  created_by_type   string      // USER | AGENT
  created_by_id     string
  
  // Content
  title             string      // Short description
  description       string      // Full details
  
  // Classification
  task_type         string      // EXECUTE | ANALYZE | REVIEW | DECIDE | RESEARCH
  priority          string      // LOW | NORMAL | HIGH | CRITICAL
  
  // Status
  status            string      // PENDING | IN_PROGRESS | BLOCKED | COMPLETED | CANCELLED
  
  // Timing
  due_at            datetime?   // Optional deadline
  created_at        datetime
  updated_at        datetime
}
```

**Task Types**:
| Type | Description |
|------|-------------|
| `EXECUTE` | Perform an action |
| `ANALYZE` | Study and report |
| `REVIEW` | Check and validate |
| `DECIDE` | Make a recommendation |
| `RESEARCH` | Gather information |

**Task Status Flow**:
```
PENDING → IN_PROGRESS → COMPLETED
                ↓
            BLOCKED → IN_PROGRESS
                ↓
            CANCELLED
```

---

### TaskUpdate

Audit trail for all task changes.

```
MODEL TaskUpdate {
  id            string      // UUID
  task_id       string      // FK → Task.id
  
  // Actor
  actor_type    string      // USER | AGENT
  actor_id      string
  
  // Change
  update_type   string      // STATUS_CHANGE | COMMENT | RESULT | BLOCKER
  content       string      // Details of the update
  
  // Timing
  created_at    datetime
}
```

**Update Types**:
| Type | Description |
|------|-------------|
| `STATUS_CHANGE` | Task status modified |
| `COMMENT` | Note or clarification added |
| `RESULT` | Output or deliverable attached |
| `BLOCKER` | Impediment reported |

---

## VOICE FLOW (MANDATORY)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        VOICE INPUT FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. 🎙️ User speaks (voice input)                                           │
│           │                                                                 │
│           ▼                                                                 │
│  2. 📼 System records audio                                                │
│           │                                                                 │
│           ▼                                                                 │
│  3. 🧠 Agent transcribes audio                                             │
│           │                                                                 │
│           ▼                                                                 │
│  4. 📝 Agent generates structured message draft                            │
│           │                                                                 │
│           ▼                                                                 │
│  5. ✅ User MUST confirm or edit transcription                             │
│           │                                                                 │
│           ├─────────────────┐                                               │
│           ▼                 ▼                                               │
│  6a. [Confirmed]      6b. [Edited]                                         │
│           │                 │                                               │
│           └────────┬────────┘                                               │
│                    ▼                                                        │
│  7. 📬 Message/Task created in Inbox                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CRITICAL RULE

> **Unconfirmed voice input can NEVER create a task or decision.**

The `requires_confirmation` flag MUST be:
- `true` for all voice transcripts until user confirms
- Checked before any task creation
- Logged in audit trail

---

## AGENT BEHAVIOR RULES

### MUST DO

| Rule | Description |
|------|-------------|
| **Acknowledge messages** | Explicitly mark messages as received |
| **Require Task entity** | Never execute without a Task record |
| **Update Task status** | Keep status current during execution |
| **Request clarification** | Use QUESTION messages when unclear |
| **Propose, don't finalize** | Decisions require user confirmation |

### MUST NOT

| Rule | Description |
|------|-------------|
| **Execute without Task** | No action without Task entity |
| **Assume instructions** | Always verify unclear requests |
| **Finalize decisions** | Only propose; user confirms |
| **Skip acknowledgment** | Always acknowledge receipt |
| **Use parallel channels** | All communication through Inbox |

---

## UX REQUIREMENTS

### Agent Card Display

Each agent must show:

```
┌─────────────────────────────────────────┐
│  🤖 Agent Name                    [🔔 3]│
│  ────────────────────────────────────── │
│  📋 Pending tasks: 2                    │
│  🕐 Last activity: 5 min ago            │
│  ────────────────────────────────────── │
│  Latest: "I've started analyzing..."    │
└─────────────────────────────────────────┘
```

### Chat View Features

- [ ] Filter by message_type
- [ ] Filter by priority
- [ ] Filter by status
- [ ] Search content
- [ ] Thread grouping

### Task List View

- [ ] View all tasks (separate from chat)
- [ ] Filter by status
- [ ] Sort by due_at, priority, created_at
- [ ] Quick status update

### Voice Input

- **Push-to-talk ONLY**
- No continuous listening
- Visual recording indicator
- Transcription preview before send
- Edit capability before confirmation

---

## SECURITY & AUDIT

### Logging Requirements

| Event | Logged Data |
|-------|-------------|
| Message created | Full message, actor, timestamp |
| Message read | Message ID, actor, timestamp |
| Message acknowledged | Message ID, actor, timestamp |
| Task created | Full task, actor, timestamp |
| Task updated | Task ID, changes, actor, timestamp |
| Voice recorded | Audio ref, actor, timestamp |
| Voice confirmed | Message ID, actor, timestamp |

### Data Retention

| Data Type | Retention | Deletion |
|-----------|-----------|----------|
| Messages | Indefinite | Archive only |
| Tasks | Indefinite | Archive only |
| TaskUpdates | Indefinite | Never |
| Voice files | 90 days | Hard delete after |
| Audit logs | 5 years | Archive after |

### Archive Rules

- No hard deletion of messages or tasks
- `status = 'ARCHIVED'` instead of DELETE
- Archived items hidden from default views
- Archived items visible in audit mode

### Replay Support

The system must support:
- Full conversation replay
- Task history reconstruction
- Decision audit trail
- Voice playback (within retention)

---

## API SPECIFICATION

### Endpoints Required

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/inbox/{agent_id}/messages` | Send message |
| `PATCH` | `/api/inbox/messages/{id}/acknowledge` | Acknowledge message |
| `POST` | `/api/tasks` | Create task |
| `PATCH` | `/api/tasks/{id}` | Update task |
| `POST` | `/api/tasks/{id}/updates` | Add task update |
| `POST` | `/api/inbox/{agent_id}/voice` | Submit voice for transcription |
| `POST` | `/api/inbox/voice/{id}/confirm` | Confirm voice transcript |
| `GET` | `/api/inbox/{agent_id}` | Get inbox with messages |
| `GET` | `/api/tasks` | List tasks with filters |

### Validation Rules

All API endpoints must enforce:
- Actor identity verification
- Message type validation
- Priority validation
- Status transition validation
- Voice confirmation check before task creation

---

## IMPLEMENTATION CHECKLIST

### Database Layer
- [ ] AgentInbox table
- [ ] InboxMessage table
- [ ] Task table
- [ ] TaskUpdate table
- [ ] Indexes for common queries
- [ ] Foreign key constraints

### TypeScript Types
- [ ] AgentInbox interface
- [ ] InboxMessage interface
- [ ] Task interface
- [ ] TaskUpdate interface
- [ ] Enums for all string types

### API Layer
- [ ] Send message endpoint
- [ ] Acknowledge message endpoint
- [ ] Create task endpoint
- [ ] Update task endpoint
- [ ] Attach task to message endpoint
- [ ] Voice transcription endpoint
- [ ] Voice confirmation endpoint
- [ ] List/filter endpoints

### Business Logic
- [ ] Voice confirmation enforcement
- [ ] Task status transition validation
- [ ] Priority escalation rules
- [ ] Unread count management
- [ ] Audit logging

### UI Components
- [ ] Agent card with inbox indicator
- [ ] Message list with filters
- [ ] Task list view
- [ ] Voice recorder (push-to-talk)
- [ ] Transcription confirmation dialog
- [ ] Message composer

---

**END OF CANONICAL BLOCK**

*No simplifications. No assumptions. No skipped sections.*
