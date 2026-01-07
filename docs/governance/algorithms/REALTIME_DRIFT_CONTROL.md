# Algorithm — Realtime Drift Control (RDC)

## Goal
Continuously realign the executor when it drifts.

## Roles
- CEAs emit GOVERNANCE_SIGNAL events (WARN/CORRECT/PAUSE/BLOCK/ESCALATE)
- Orchestrator decides response and sends corrective instruction.

## Drift pipeline
1) Observe output + context window.
2) Detect drift type:
   - intent drift
   - canon violation (thread rules)
   - safety violation
   - structure drift
   - budget/latency drift
3) Decide intervention:
   - WARN: annotate and continue
   - CORRECT: inject local instruction (patch) with scope
   - PAUSE: halt executor output until clarified
   - BLOCK: stop and require human approval
   - ESCALATE: invoke specialist for segment

## Correction format (recommended)
PATCH_INSTRUCTION:
- scope (segment_id + region)
- constraint (what must hold)
- correction (what to change)
- rationale (short)
- verification (which spec confirms)

## Outcome
- Executor applies patch to segment only
- Orchestrator runs quick verification spec
- Log ORCH_DECISION_MADE + SPEC_RUN
