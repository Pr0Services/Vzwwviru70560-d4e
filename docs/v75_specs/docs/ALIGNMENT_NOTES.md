# Improvement Notes (How to align with your real repo)

This package is a **canonical v1** to unblock simulation now.
To fully align with AT‑OM repo, do this mapping pass:

1) Extract actual modules from code:
   - backend/services/** (each service = candidate module)
   - frontend/src/features/** (each feature = candidate module)
   - docs/** (declared modules/specs)

2) For each real module:
   - assign needs_served (1–3 primary)
   - assign dependencies (hard)
   - assign risk_level and risk_profile
   - list known_usages (endpoints/actions)

3) Validate:
   - all dependencies resolvable
   - high-risk modules require governance.core + checkpoints.core

4) Add integration providers:
   - Gmail/Outlook/Calendar/Drive/ClickUp
   - Payment (if any)
   - Storage (if any)

5) Add new templates:
   - multi-tenant org onboarding
   - creative studio production pipeline
   - construction materials procurement workflow
