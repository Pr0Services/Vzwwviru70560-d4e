# Algorithm — Selective Escalation by Segment (SES)

## Goal
For a large task, activate expensive intelligence only for segments that justify it.

## Steps
1) Segment the work:
   - by sections (doc), modules/files (code), logical steps (workflow), or XR zones.
2) Compute per-segment scores:
   - criticality C_s
   - complexity X_s
   - uncertainty U_s
   - exposure E_s
   - size S_s
3) Compute RQ_s using QCT formula.
4) Choose per-segment configuration:
   - simple segments -> cheap executor + light checks
   - complex segments -> strong executor + CEAs
   - critical segments -> add second agent (cheap or strong) locally

## Escalation triggers (examples)
- conflict between CEAs > threshold
- repeated corrections on same segment
- schema/security guard fails
- RQ_s > 0.85
- ER_s high and segment is irreversible

## Output
- ESCALATION_TRIGGERED with scope=segment_id
- Run specialist on only that segment
- Append CORRECTION_APPENDED if needed
