# CHE·NU™ Canonical Invariants

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║                         CANONICAL INVARIANTS                                     ║
║                                                                                  ║
║         These rules are ABSOLUTE. They cannot be violated under any             ║
║         circumstance. Violation = System integrity compromised.                  ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

**Version:** 1.0.0  
**Status:** LOCKED  
**Authority:** R&D + Architecture Committee  
**Last Review:** January 2026

---

## Table of Contents

1. [Thread Invariants](#1-thread-invariants)
2. [Agent Invariants](#2-agent-invariants)
3. [Governance Invariants](#3-governance-invariants)
4. [Memory Invariants](#4-memory-invariants)
5. [XR Invariants](#5-xr-invariants)
6. [Identity Invariants](#6-identity-invariants)
7. [Audit Invariants](#7-audit-invariants)

---

## 1. Thread Invariants

### INV-T01: Single Source of Truth

> **The Thread is the only source of truth. All other views are projections.**

```
✅ CORRECT:
   Thread.events → Chat View
   Thread.events → XR Environment
   Thread.events → Timeline

❌ VIOLATION:
   Chat DB → Chat View (separate database)
   XR DB → XR Environment (separate state)
```

### INV-T02: Append-Only Event Log

> **Events are never modified, never deleted. Only appended.**

```python
# ✅ ALLOWED
thread.append_event(new_event)

# ❌ FORBIDDEN
thread.edit_event(event_id, new_data)
thread.delete_event(event_id)
```

### INV-T03: Founding Intent Required

> **Every thread MUST have a founding_intent. It is immutable.**

```python
# ✅ CORRECT
thread = Thread(
    founding_intent="Build a sustainable business",  # Required
    owner_id=user_id,
    sphere=Sphere.BUSINESS
)

# ❌ VIOLATION
thread = Thread(owner_id=user_id)  # Missing founding_intent
```

### INV-T04: Corrections Reference Originals

> **Corrections append CORRECTION_APPENDED events with links to originals.**

```python
# ✅ CORRECT
correction_event = ThreadEvent(
    type="CORRECTION_APPENDED",
    payload={"corrected_text": "new text"},
    links=[{"type": "corrects", "target_id": original_event_id}]
)

# ❌ VIOLATION
original_event.payload["text"] = "new text"  # Direct modification
```

---

## 2. Agent Invariants

### INV-A01: No Always-On Agents

> **Agents are instantiated on-demand, never persistent background processes.**

```python
# ✅ CORRECT
agent = AgentFactory.create_for_task(task)
result = agent.execute(task)
# Agent goes dormant

# ❌ VIOLATION
while True:
    agent.poll_for_work()  # Persistent process
```

### INV-A02: Exactly One Memory Agent Per Thread

> **Each thread has exactly one memory agent, created at thread initialization.**

```python
# ✅ CORRECT
thread = Thread(...)
memory_agent = thread.memory_agent  # Exactly one

# ❌ VIOLATION
thread.add_agent(MemoryAgent())     # Second memory agent
thread.memory_agent = None          # No memory agent
```

### INV-A03: Memory Agent Limited to Specific Events

> **Memory agent can only produce: SUMMARY_SNAPSHOT, CORRECTION_APPENDED**

```python
# ✅ ALLOWED
memory_agent.generate_snapshot()  # → SUMMARY_SNAPSHOT event

# ❌ FORBIDDEN
memory_agent.post_message()       # → MESSAGE_POSTED (not allowed)
memory_agent.create_action()      # → ACTION_CREATED (not allowed)
```

### INV-A04: Agents Propose, Humans Decide

> **No autonomous execution. Agents propose, humans approve.**

```python
# ✅ CORRECT
proposal = agent.propose_action(data)
if human.approves(proposal):
    execute(proposal)

# ❌ VIOLATION
agent.execute_action(data)  # Autonomous execution
```

---

## 3. Governance Invariants

### INV-G01: Governance Before Execution

> **Every action passes through governance layer before execution.**

```
User Intent → Governance Check → [Checkpoint if needed] → Execution → Audit
```

### INV-G02: Checkpoints Block Execution

> **HTTP 423 = Execution MUST stop until human approval.**

```python
# ✅ CORRECT
if governance.requires_checkpoint(action):
    raise HTTPException(status_code=423, detail=checkpoint_info)
    # Execution stops, waits for approval

# ❌ VIOLATION
if governance.requires_checkpoint(action):
    log.warning("Should checkpoint")  # Log but continue
    execute(action)                    # Execute anyway
```

### INV-G03: No Bypass Mechanisms

> **No debug flags, admin overrides, or emergency bypasses.**

```python
# ❌ FORBIDDEN
if DEBUG_MODE:
    skip_governance_check()

if user.is_admin:
    bypass_checkpoint()
```

---

## 4. Memory Invariants

### INV-M01: No Duplicate Memory

> **Thread events ARE the memory. No separate memory database.**

```
✅ CORRECT:
   Thread.events = [MESSAGE_POSTED, DECISION_RECORDED, ...]
   Memory = Thread.events  # Same thing

❌ VIOLATION:
   Thread.events = [...]
   MemoryDB.store(...)  # Separate storage
```

### INV-M02: Snapshots Are Summaries Only

> **SUMMARY_SNAPSHOT events summarize, they don't replace events.**

```python
# Snapshots can be deleted and regenerated without data loss
thread.delete_all_snapshots()
thread.regenerate_snapshots()  # From events
# Thread state unchanged
```

### INV-M03: Memory Can Be Derived Deterministically

> **All memory state can be reconstructed from the event log.**

```python
def reconstruct_state(thread):
    state = {}
    for event in thread.events:
        state = apply_event(state, event)
    return state  # Deterministic

# Same events → Same state (always)
```

---

## 5. XR Invariants

### INV-X01: XR Is Projection Only

> **XR environments are derived views, never authoritative.**

```python
# ✅ CORRECT
xr_state = derive_from_thread(thread)  # Projection

# ❌ VIOLATION
xr_state.decision = "new decision"  # XR modifying data
save_to_xr_database(xr_state)       # XR has own database
```

### INV-X02: XR Changes Create Thread Events

> **Any state change in XR MUST create a ThreadEvent.**

```python
# ✅ CORRECT - XR interaction
def on_xr_decision_complete(decision):
    thread.append_event(
        type="DECISION_RECORDED",
        payload=decision,
        source="xr_environment"
    )

# ❌ VIOLATION
def on_xr_decision_complete(decision):
    xr_state.decisions.append(decision)  # Only XR updated
```

### INV-X03: Blueprint Regenerable Without Loss

> **Deleting XR blueprints and regenerating loses no data.**

```python
thread.delete_all_blueprints()
new_blueprint = xr_generator.generate(thread)
# Identical result (deterministic)
```

---

## 6. Identity Invariants

### INV-I01: Identity Isolation

> **User A cannot access User B's data. Ever. HTTP 403.**

```python
# ✅ CORRECT
if request.identity_id != resource.owner_id:
    raise HTTPException(status_code=403)

# ❌ VIOLATION
if user.is_admin:
    # Allow cross-identity access
    return resource
```

### INV-I02: Identity In Every Event

> **Every event has actor_id and actor_type (HUMAN | AGENT).**

```python
event = ThreadEvent(
    actor_id="user_123",      # Required
    actor_type=ActorType.HUMAN,  # Required
    ...
)
```

### INV-I03: No Anonymous Actions

> **Every action must have an identity. No anonymous operations.**

```python
# ❌ FORBIDDEN
thread.append_event(event_without_actor)
```

---

## 7. Audit Invariants

### INV-U01: Complete Audit Trail

> **Every significant action creates an audit record.**

```python
# Actions that MUST be audited:
- Thread creation/modification
- Event appending
- Decision recording
- Agent execution
- Checkpoint approval/rejection
- Identity verification
```

### INV-U02: Audit Trail Immutable

> **Audit records cannot be modified or deleted.**

```python
# ✅ CORRECT
audit_log.append(AuditRecord(...))

# ❌ FORBIDDEN
audit_log.delete(record_id)
audit_log.update(record_id, new_data)
```

### INV-U03: Full Traceability

> **Every object has: id, created_by, created_at, integrity_hash.**

```python
@dataclass
class TrackedObject:
    id: str                    # Unique identifier
    created_by: str            # Actor who created
    created_at: datetime       # Creation timestamp
    integrity_hash: str        # SHA-256 hash
```

---

## Interdictions (FORBIDDEN Patterns)

### INTERDIT-01: Duplicate Memory

```python
# ❌ FORBIDDEN - Separate databases
chat_db.save_message(msg)      # Chat has own DB
live_db.save_session(session)  # Live has own DB
xr_db.save_state(state)        # XR has own DB

# ✅ REQUIRED - Thread is the only storage
thread.append_event(MESSAGE_POSTED)
thread.append_event(LIVE_STARTED)
thread.append_event(ENV_BLUEPRINT_GENERATED)
```

### INTERDIT-02: Persistent Agents

```python
# ❌ FORBIDDEN - Background processes
class PersistentAgent:
    def run_forever(self):
        while True:
            self.check_for_work()
            time.sleep(60)

# ✅ REQUIRED - On-demand only
class OnDemandAgent:
    def execute(self, task):
        result = self.process(task)
        return result  # Then dormant
```

### INTERDIT-03: Autonomous Environments

```python
# ❌ FORBIDDEN - XR with own state
class XREnvironment:
    def __init__(self):
        self.decisions = []  # Own storage
        self.actions = []    # Own storage

# ✅ REQUIRED - XR derives from thread
class XREnvironment:
    def __init__(self, thread):
        self.state = self.derive_from_thread(thread)
```

### INTERDIT-04: Modify Without Memory Agent

```python
# ❌ FORBIDDEN - Direct event modification
event.payload["text"] = "new text"
thread.events[5] = new_event

# ✅ REQUIRED - Only corrections via memory agent
thread.append_event(CORRECTION_APPENDED, links=[original_id])
```

### INTERDIT-05: Confuse Human/Agent

```python
# ❌ FORBIDDEN - Unclear actor
event = ThreadEvent(
    payload=data,
    # No actor_type!
)

# ✅ REQUIRED - Clear attribution
event = ThreadEvent(
    actor_id="user_123",
    actor_type=ActorType.HUMAN,  # or AGENT
    payload=data
)
```

---

## Compliance Verification

### Automated Checks

```python
def verify_canonical_compliance(thread):
    """Run all canonical invariant checks."""
    errors = []
    
    # INV-T01: Single source of truth
    if has_external_storage(thread):
        errors.append("INV-T01: External storage detected")
    
    # INV-T02: Append-only
    if has_modification_methods(thread):
        errors.append("INV-T02: Event modification detected")
    
    # INV-T03: Founding intent
    if not thread.founding_intent:
        errors.append("INV-T03: Missing founding_intent")
    
    # INV-A02: One memory agent
    if count_memory_agents(thread) != 1:
        errors.append("INV-A02: Invalid memory agent count")
    
    # ... more checks
    
    return errors
```

### Manual Review Checklist

- [ ] All events have actor_id and actor_type
- [ ] No edit/delete methods on events
- [ ] No separate databases for views
- [ ] Checkpoints actually block execution
- [ ] XR state derived from thread events only
- [ ] No autonomous agent execution
- [ ] Complete audit trail present

---

## Violation Response

| Severity | Response |
|----------|----------|
| Critical | Immediate system halt, incident report |
| High | Block deployment, mandatory fix |
| Medium | Fix required before next release |
| Low | Technical debt, scheduled fix |

---

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║                      🔒 THESE INVARIANTS ARE LOCKED 🔒                          ║
║                                                                                  ║
║  Modification requires:                                                          ║
║  • Full Architecture Committee review                                            ║
║  • Impact analysis on all systems                                                ║
║  • Formal approval process                                                       ║
║  • Version increment                                                             ║
║                                                                                  ║
║  "Structure precedes intelligence. Invariants precede features."                 ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

---

© 2026 CHE·NU™ — Canonical Invariants v1.0.0
