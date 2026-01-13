# Mapping Rules (Deterministic)

## Template selection
- personal -> personal_room
- collective + 'cause/community' keywords -> cause_room
- business signals (finance/ops decisions, revenue actions) -> business_room
- hypotheses/experiments -> lab_room
- otherwise -> custom_room

## Zone rules
Always include:
- intent_wall (founding_intent + top summary excerpt)
- decision_wall (latest N decisions)
- action_table (open actions grouped by status)
- memory_kiosk (latest memory_summary + onboarding_brief)
- timeline_strip (live segments + milestones)
Include if exists:
- resource_shelf (links/resources)
- portals (linked threads)

## Item sourcing
- intent item: Thread.founding_intent + snapshot highlights
- decisions: DECISION_RECORDED events
- actions: ACTION_CREATED/ACTION_UPDATED events (derived current status)
- memory: SUMMARY_SNAPSHOT (latest)
- timeline: LIVE_STARTED/LIVE_ENDED + RESULT_RECORDED milestones
- resources: LINK_ADDED
