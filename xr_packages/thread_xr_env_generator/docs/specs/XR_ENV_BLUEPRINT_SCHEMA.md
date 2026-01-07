# XR Environment Blueprint Schema (v1)

Blueprint is a derived artifact. It must be deterministic, regenerable, and non-canonical.

## Required fields
- thread_id
- template
- generated_at
- version
- zones[]

## Zones
Each zone is a renderable surface/area:
- id, type, title
- items[] (derived from events/snapshots)
- layout (relative positions)

## Items
Items represent projections of thread state:
- id, kind, label
- source_event_id (or snapshot ref)
- redaction_level
- actions[] (UI actions allowed)

## Portals
Optional portals link to other threads:
- label, thread_id
