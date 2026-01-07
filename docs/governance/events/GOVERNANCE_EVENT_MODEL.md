# Event Model Additions (Governance)

These events extend Thread v2 without breaking it.

## Orchestration
- ORCH_DECISION_MADE
  payload: { decision, reason, budgets, signals, scope }
- SPEC_RUN
  payload: { spec_id, result_summary, cost_estimate, scope }
- SPEC_DEFERRED
  payload: { spec_id, defer_to, reason }
- ESCALATION_TRIGGERED
  payload: { to_agent, scope, reason, required_quality }

## Governance signals (from CEAs)
- GOVERNANCE_SIGNAL
  payload: { level: WARN|CORRECT|PAUSE|BLOCK|ESCALATE, criterion, message, scope, confidence }

## Quality / maturity derived
- QUALITY_TARGET_SET (optional)
  payload: { target_level, reason, scope }
- THREAD_MATURITY_COMPUTED (optional)
  payload: { score, level, signals }

## Backlog capture
- BACKLOG_ITEM_CREATED
  payload: { backlog_type, severity, description, references }
