# Generator Agent — Pseudocode

Inputs:
- thread (founding_intent, type)
- events (paged)
- snapshots (latest memory_summary, onboarding_brief)

Algorithm:
1) Derive current state:
   - collect decisions
   - derive action status map from ACTION_CREATED/ACTION_UPDATED
   - collect links
   - collect live segments timeline

2) Pick template deterministically (Mapping Rules)

3) Build zones:
   - intent_wall (1 item)
   - decision_wall (top N decisions)
   - action_table (open actions grouped: todo/doing/done)
   - memory_kiosk (latest summaries)
   - timeline_strip (live segments + milestones)
   - resource_shelf (if links)

4) Apply redaction filtering per viewer role

5) Return blueprint JSON with references
