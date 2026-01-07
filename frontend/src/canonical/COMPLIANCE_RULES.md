# CHE·NU™ — COMPLIANCE RULES (CANONICAL)

## ⚠️ THIS DOCUMENT IS ABSOLUTE

These rules CANNOT be violated. Any code that violates these rules is NON-COMPLIANT.

---

## 1. AGENT BEHAVIOR

### ABSOLUTE RULES

| Rule | Description |
|------|-------------|
| **NEVER_INITIATE** | Agents NEVER initiate actions |
| **NEVER_START_MEETINGS** | Agents NEVER start meetings |
| **NEVER_START_ACTIONS** | Agents NEVER start actions |
| **RESPOND_ONLY_TO_USER** | Agents ONLY respond to user input |
| **PROPOSE_AFTER_INPUT_ONLY** | System proposes ONLY after user input |

### What Agents DO
- Wait for user input
- Respond to user requests
- Propose options (after user input)
- Execute validated actions

### What Agents NEVER DO
- ❌ Initiate conversations
- ❌ Start meetings automatically
- ❌ Execute without validation
- ❌ Make assumptions about intent
- ❌ Provide unsolicited suggestions

---

## 2. SYSTEM CHANNEL

### NOT A CHAT

The System Channel is NOT a chat interface. It is a structured state machine.

### EXPLICIT STATES

```
IDLE → INTENT → PROPOSAL → (EXECUTE or REJECT) → IDLE
```

| State | Description |
|-------|-------------|
| **IDLE** | Waiting for user input. System does NOTHING. |
| **INTENT** | User has provided input. System reformulates intent for confirmation. |
| **PROPOSAL** | Intent confirmed. System presents proposal for accept/reject. |
| **CLOSED** | Channel closed. |

### RULES

1. **Intent reformulation is REQUIRED** before any proposal
2. User MUST confirm intent before proposal is shown
3. NO conversational responses
4. NO small talk
5. System NEVER initiates

---

## 3. MEETINGS

### REQUIRED COMPONENTS

Every meeting MUST have:

1. **SCOPE** - Which spheres, what's in/out
2. **GOAL** - What we're trying to achieve
3. **CLOSURE** - How the meeting ends

### FORBIDDEN

- ❌ Indefinite meetings (no end)
- ❌ Passive meetings (no purpose)
- ❌ Agent-initiated meetings
- ❌ Automatic meetings

### MEETING LIFECYCLE

```
SCHEDULED → ACTIVE → CLOSING → COMPLETED
                  ↓
              CANCELLED
```

All meetings are TIME-BOUNDED. Max durations:
- Reflection: 30 minutes
- Team Alignment: 45 minutes
- Decision: 60 minutes
- Review/Audit: 90 minutes

---

## 4. XR DECISION ROOM

### SPATIAL MIRROR ONLY

XR is ONLY a spatial representation of the standard UI. Nothing more.

### XR ADDS ZERO CAPABILITY

| Standard UI | XR |
|-------------|-----|
| View proposals | View proposals (spatially) |
| Select proposal | Select proposal (click) |
| Validate | Validate (same button) |
| Reject | Reject (same button) |

### FORBIDDEN IN XR

- ❌ Gesture-based actions
- ❌ Voice commands
- ❌ Spatial manipulation
- ❌ Agent summoning
- ❌ Narrative triggers
- ❌ Immersive effects
- ❌ Ambient interactions

### RULE

**Everything available in XR MUST be available in standard UI.**

If it's not in standard UI, it CANNOT be in XR.

---

## 5. MEMORY

### NEVER STORED

The following are EXPLICITLY FORBIDDEN from storage:

| Forbidden | Reason |
|-----------|--------|
| Raw reasoning | Process, not outcome |
| Transcripts | Verbatim content |
| Conversation history | Raw logs |
| Intermediate analysis | Process data |
| Draft proposals | Not validated |
| Agent-to-agent communication | Internal process |
| Thinking traces | Process data |
| Speculation | Not validated |

### ALLOWED STORAGE (with validation)

| Allowed | Condition |
|---------|-----------|
| Validated decision (summary) | User validated |
| Validated action item (summary) | User validated |
| Validated insight (summary) | User validated |
| User note | Explicit user input |

### VALIDATION REQUIRED

**NO content can be stored without explicit user validation.**

1. System proposes memory entry
2. User reviews entry
3. User can edit entry
4. User explicitly validates OR rejects
5. Only validated entries are stored
6. Rejected entries are DELETED (never stored)

---

## COMPLIANCE CHECKLIST

Before any code is merged, verify:

- [ ] Agents never initiate
- [ ] System Channel uses explicit states
- [ ] Intent reformulation before proposals
- [ ] Meetings have scope, goal, closure
- [ ] Meetings are time-bounded
- [ ] XR mirrors standard UI only
- [ ] XR adds no extra capability
- [ ] No raw reasoning in memory
- [ ] No transcripts in memory
- [ ] User validation required for memory storage

---

**CHE·NU™** — Governed Intelligence Operating System
*Governance > Execution*
