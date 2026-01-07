# Agent Roles & Contracts

## 1) Orchestrator (AT-OM Orchestrator)
**Purpose:** decide which specs/agents to run, when, and with what scope.
**Inputs:** thread context, mode (live/async), budgets, CEA signals, backlog signals.
**Outputs:** RUN_SPEC, DEFER, ESCALATE, PATCH_INSTRUCTION, BLOCK, ASK_HUMAN.
**Writes:** orchestration events only (auditable).

## 2) Executor (Primary Worker)
**Purpose:** produce the actual work (code, text, plans).
**Constraints:** must accept corrective instructions; must write state changes as events.

## 3) Memory Agent (Per thread, unique)
**Purpose:** preserve coherence over time; produce summaries; link decisions->consequences.
**Writes:** SUMMARY_SNAPSHOT, CORRECTION_APPENDED, optional tags/links.

## 4) Criterion Enforcement Agents (CEAs)
**Purpose:** observe one criterion; detect drift; signal orchestrator.
**Examples:** CanonGuard, SecurityGuard, SchemaGuard, CoherenceGuard, StyleGuard, BudgetGuard.
**Writes:** signals/events (not direct modifications).

## 5) Specialist Workers (On-demand)
**Purpose:** deep reasoning or domain expertise on a segment.
**Invoked:** when risk/complexity requires.
**Scope:** limited to a segment; returns structured output + confidence.

## 6) XR Environment Generator / Renderer
**Purpose:** projection of thread into room; interactions emit thread events.
**Constraint:** no canonical XR memory/state.
