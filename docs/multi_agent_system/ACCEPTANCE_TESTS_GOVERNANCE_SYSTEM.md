# Acceptance Tests — Governance System (Must Pass)

## A) Drift control
1) If executor violates founding intent, CoherenceGuard emits GOVERNANCE_SIGNAL(CORRECT).
2) Orchestrator injects PATCH_INSTRUCTION scoped to segment.
3) Quick verification passes (SPEC_RUN logged).

## B) Selective escalation
4) Large task is segmented; only critical segments trigger strong critic.
5) Non-critical segments remain cheap.

## C) Budgets
6) In live mode, orchestrator avoids high-latency specs unless RQ > 0.85.
7) Deferred heavy checks run post-live and log SPEC_DEFERRED -> SPEC_RUN.

## D) Backlogs
8) A missed defect creates BACKLOG_ITEM_CREATED with references.
9) Policy tuning updates thresholds within bounds and logs ORCH_DECISION_MADE.
10) Noise reduction: repeated false positives reduce spec trigger frequency (bounded).

## E) Non-negotiables
11) No event history mutation; corrections are appended.
12) No duplicated memory outside thread.
