# Backlogs — Improving Decisions Over Time (Canonical)

## 1) Why backlogs matter
Backlogs are the system's learning memory about *governance outcomes*:
- What errors occurred
- Where they were detected (or missed)
- What it cost to fix
- Which specs created noise
- Which configurations produced best outcomes

Backlogs turn governance into an improving control system.

## 2) Backlog types (recommended)
### A) Error Backlog
Captures defects that escaped early checks.
Fields:
- severity (S1..S5)
- type (logic, security, schema, contradiction, UX)
- where detected (stage: live/async; segment_id)
- escape depth (how late it was caught)
- fix cost (time/tokens)
- root cause hypothesis

### B) Signal Backlog
Captures false positives / noisy checkers.
Fields:
- spec_id / criterion
- false positive rate
- context
- recommended threshold adjustment

### C) Decision Backlog
Captures decision outcomes:
- decision_id
- outcome quality (good/bad/mixed)
- time to impact
- dependencies missed
- what signals were ignored

### D) Cost Backlog
Tracks compute and latency:
- per spec cost estimate vs actual
- per configuration cost
- live latency spikes

### E) Governance Debt Backlog
Tracks structural issues:
- missing specs
- missing event types
- unclear roles/permissions
- poor segmentation

## 3) Using backlogs to improve orchestration
### 3.1 Policy updates (weekly or per release)
- adjust spec thresholds and cooldowns
- promote specs from optional to always-on if repeated violations
- demote noisy specs
- refine segmentation rules
- refine configuration selection (QCT parameters)

### 3.2 Automatic tuning (safe subset)
Allow orchestrator to auto-tune only:
- thresholds (within bounded range)
- cooldowns (within bounded range)
- routing between cheap vs strong critic (bounded)
Any large change requires human approval event.

## 4) Feedback metrics (simple)
- Escape Rate: % issues found late
- Fix Cost: median tokens/time per issue
- Noise Rate: % false alerts
- Rework Ratio: correction tokens / production tokens
- Live Smoothness: 95th percentile latency

## 5) Backlog items as thread events
Store backlog creation as:
- BACKLOG_ITEM_CREATED event
and/or dedicated backlog tables linked to events.

## 6) Closure loop
Every backlog item must map to one of:
- new spec
- threshold change
- new acceptance test
- new UI guardrail
- documentation clarification
