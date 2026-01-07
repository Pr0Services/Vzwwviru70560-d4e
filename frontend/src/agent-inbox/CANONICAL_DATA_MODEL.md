# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU — CANONICAL DATA MODEL (FULL)
# AGENT INBOX • MESSAGING • TASK ENGINE
# Authoritative Specification — Implement Exactly
# ═══════════════════════════════════════════════════════════════════════════════

**Version**: 1.0.0  
**Status**: CANONICAL - AUTHORITATIVE  
**Priority**: IMPLEMENT AS-IS

---

## DATABASE SCHEMA (SQL Canonical Form)

```sql
TABLE agents (
    id TEXT PRIMARY KEY,
    sphere_id TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

TABLE agent_inboxes (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL REFERENCES agents(id),
    sphere_id TEXT NOT NULL,
    unread_count INTEGER NOT NULL DEFAULT 0,
    last_activity_at TIMESTAMP,
    is_muted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL
);

TABLE inbox_messages (
    id TEXT PRIMARY KEY,
    inbox_id TEXT NOT NULL REFERENCES agent_inboxes(id),
    sender_type TEXT NOT NULL,                 -- USER | AGENT | SYSTEM
    sender_id TEXT,
    message_type TEXT NOT NULL,                -- TASK | NOTE | COMMENT | QUESTION | DECISION | VOICE_TRANSCRIPT
    priority TEXT NOT NULL,                    -- LOW | NORMAL | HIGH | CRITICAL
    content_text TEXT NOT NULL,
    content_summary TEXT,
    voice_file_ref TEXT,
    transcription_confidence REAL,
    requires_confirmation BOOLEAN NOT NULL DEFAULT FALSE,
    related_task_id TEXT,
    related_decision_id TEXT,
    status TEXT NOT NULL DEFAULT 'NEW',        -- NEW | READ | ACKNOWLEDGED | ARCHIVED
    created_at TIMESTAMP NOT NULL,
    acknowledged_at TIMESTAMP
);

TABLE tasks (
    id TEXT PRIMARY KEY,
    sphere_id TEXT NOT NULL,
    assigned_agent_id TEXT NOT NULL REFERENCES agents(id),
    created_by_type TEXT NOT NULL,             -- USER | AGENT
    created_by_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    task_type TEXT NOT NULL,                   -- EXECUTE | ANALYZE | REVIEW | DECIDE | RESEARCH
    priority TEXT NOT NULL,                    -- LOW | NORMAL | HIGH | CRITICAL
    status TEXT NOT NULL DEFAULT 'PENDING',    -- PENDING | IN_PROGRESS | BLOCKED | COMPLETED | CANCELLED
    due_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

TABLE task_updates (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL REFERENCES tasks(id),
    actor_type TEXT NOT NULL,                  -- USER | AGENT
    actor_id TEXT NOT NULL,
    update_type TEXT NOT NULL,                 -- STATUS_CHANGE | COMMENT | RESULT | BLOCKER
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

---

## TYPESCRIPT CANONICAL TYPES

```typescript
export type SenderType = "USER" | "AGENT" | "SYSTEM";
export type MessageType = "TASK" | "NOTE" | "COMMENT" | "QUESTION" | "DECISION" | "VOICE_TRANSCRIPT";
export type Priority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
export type MessageStatus = "NEW" | "READ" | "ACKNOWLEDGED" | "ARCHIVED";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED" | "CANCELLED";
export type TaskType = "EXECUTE" | "ANALYZE" | "REVIEW" | "DECIDE" | "RESEARCH";

export interface Agent {
  id: string;
  sphere_id: string;
  name: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AgentInbox {
  id: string;
  agent_id: string;
  sphere_id: string;
  unread_count: number;
  last_activity_at?: string;
  is_muted: boolean;
  created_at: string;
}

export interface InboxMessage {
  id: string;
  inbox_id: string;
  sender_type: SenderType;
  sender_id?: string;
  message_type: MessageType;
  priority: Priority;
  content_text: string;
  content_summary?: string;
  voice_file_ref?: string;
  transcription_confidence?: number;
  requires_confirmation: boolean;
  related_task_id?: string;
  related_decision_id?: string;
  status: MessageStatus;
  created_at: string;
  acknowledged_at?: string;
}

export interface Task {
  id: string;
  sphere_id: string;
  assigned_agent_id: string;
  created_by_type: SenderType;
  created_by_id: string;
  title: string;
  description: string;
  task_type: TaskType;
  priority: Priority;
  status: TaskStatus;
  due_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskUpdate {
  id: string;
  task_id: string;
  actor_type: SenderType;
  actor_id: string;
  update_type: "STATUS_CHANGE" | "COMMENT" | "RESULT" | "BLOCKER";
  content: string;
  created_at: string;
}
```

---

## ORM MODELS (PRISMA CANONICAL)

```prisma
model Agent {
  id          String   @id
  sphere_id   String
  name        String
  role        String
  avatar_url  String?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  inboxes     AgentInbox[]
  tasks       Task[]   @relation("AgentTasks")
}

model AgentInbox {
  id               String        @id
  agent_id         String
  sphere_id        String
  unread_count     Int           @default(0)
  last_activity_at DateTime?
  is_muted         Boolean       @default(false)
  created_at       DateTime      @default(now())
  agent            Agent         @relation(fields: [agent_id], references: [id])
  messages         InboxMessage[]
}

model InboxMessage {
  id                       String   @id
  inbox_id                 String
  sender_type              String
  sender_id                String?
  message_type             String
  priority                 String
  content_text             String
  content_summary          String?
  voice_file_ref           String?
  transcription_confidence Float?
  requires_confirmation    Boolean  @default(false)
  related_task_id          String?
  related_decision_id      String?
  status                   String   @default("NEW")
  created_at               DateTime @default(now())
  acknowledged_at          DateTime?
  inbox                    AgentInbox @relation(fields: [inbox_id], references: [id])
}

model Task {
  id                String   @id
  sphere_id         String
  assigned_agent_id String
  created_by_type   String
  created_by_id     String
  title             String
  description       String
  task_type         String
  priority          String
  status            String   @default("PENDING")
  due_at            DateTime?
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  updates           TaskUpdate[]
  agent             Agent    @relation("AgentTasks", fields: [assigned_agent_id], references: [id])
}

model TaskUpdate {
  id          String   @id
  task_id     String
  actor_type  String
  actor_id    String
  update_type String
  content     String
  created_at  DateTime @default(now())
  task        Task     @relation(fields: [task_id], references: [id])
}
```

---

## OFFICIAL API CONTRACT (REST)

### Send Message to Agent Inbox

```
POST /inbox/{agent_id}/message
```

**Body:**
```json
{
  "sender_type": "USER",
  "sender_id": "uuid",
  "message_type": "TASK",
  "priority": "HIGH",
  "content_text": "...",
  "requires_confirmation": true
}
```

### Create Task

```
POST /task/create
```

**Body:**
```json
{
  "assigned_agent_id": "uuid",
  "sphere_id": "business",
  "title": "Research competitor",
  "description": "...",
  "task_type": "RESEARCH",
  "priority": "NORMAL"
}
```

### Update Task Status

```
PATCH /task/{id}/status
```

**Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

### Add Task Update

```
POST /task/{id}/update
```

**Body:**
```json
{
  "actor_type": "AGENT",
  "actor_id": "uuid",
  "update_type": "COMMENT",
  "content": "Found new data."
}
```

---

## CONFIRMATION RULES (MANDATORY)

| Rule | Description |
|------|-------------|
| **No voice → task without confirmation** | Voice input MUST be confirmed before creating tasks |
| **No execution without Task entity** | Agents cannot act without a formal Task record |
| **No message disappears** | Only archive, never delete |
| **All activity is logged + replayable** | Complete audit trail |
| **Inbox is the only official channel** | No parallel communication allowed |

---

**END OF CANONICAL DATA MODEL BLOCK**
