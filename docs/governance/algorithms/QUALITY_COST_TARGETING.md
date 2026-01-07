# Algorithm — Quality/Cost Targeting (QCT)

## Goal
Choose an agent configuration that minimizes cost while meeting required quality.

## Variables
- C = criticality (0..1)
- X = complexity (0..1)
- E = exposure (0..1) (public/legal impact)
- R = irreversibility (0..1)
- U = uncertainty (0..1)
- S = segment_size (0..1)
- Mode = live | async
- B_cost = remaining cost budget
- B_latency = latency budget

## Required quality (RQ)
RQ = clamp( 0.2 + 0.35*C + 0.25*X + 0.25*E + 0.25*R + 0.15*U , 0, 1 )

Interpretation:
- 0.0-0.3: draft acceptable
- 0.3-0.6: professional internal
- 0.6-0.85: high quality deliverable
- 0.85-1.0: critical / near-zero defect

## Expected error rate (ER)
ER = clamp( 0.1 + 0.45*S + 0.25*X + 0.20*U , 0, 1 )

## Candidate configurations
A) 1 cheap executor + light CEAs
B) 1 strong executor + light CEAs
C) 1 strong executor + 1 cheap critic + CEAs
D) 1 strong executor + 1 strong critic + CEAs
E) 2 strong workers (parallel) + CEAs (critical steps only)

## Decision rule
Pick configuration with minimal estimated cost such that:
Quality(config, RQ, ER, Mode) >= RQ
and cost(config) <= B_cost
and latency(config, Mode) <= B_latency (hard in live)

## Mode constraints
- live: only configs A/B/C unless critical; heavy work deferred post-live.
- async: configs D/E allowed.

## Outputs
- set target quality for segment
- choose which specs/agents run and their scope
- log ORCH_DECISION_MADE
