# Interaction → ThreadEvent Mapping

## Action status changes
- UI: "Mark Done"
  -> ThreadEvent: ACTION_UPDATED
  payload:
    { "action_id": "...", "status": "done" }

- UI: Drag action card to column
  -> ThreadEvent: ACTION_UPDATED
  payload:
    { "action_id": "...", "status": "todo|doing|done" }

## Create new action
- UI: "New Action"
  -> ThreadEvent: ACTION_CREATED
  payload:
    { "title": "...", "description": "...", "status": "todo", "due_date": null, "assignee": null }

## Add note (minimal)
Option A (recommended): use MESSAGE_POSTED with tag
- UI: "Add Note"
  -> ThreadEvent: MESSAGE_POSTED
  payload:
    { "text": "...", "tags": ["note"], "context": {"zone_id":"...","item_id":"..."} }

Option B: dedicated NOTE_ADDED event (only if you want)
- ThreadEvent: NOTE_ADDED
  payload:
    { "text": "...", "context": {"zone_id":"...","item_id":"..."} }

## Open details / Jump to source (read only)
- No event required (optional telemetry XR_INTERACTION)
