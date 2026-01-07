# Implementation Checklist — XR Generator (Claude)

## Docs
- [ ] Add `docs/specs/XR_ENV_GENERATOR.md`
- [ ] Add `docs/specs/XR_ENV_BLUEPRINT_SCHEMA.md`
- [ ] Link from architecture index

## Backend
- [ ] Add event types: ENV_BLUEPRINT_GENERATED (+ optional ENV_REQUESTED)
- [ ] Add endpoint POST /threads/{id}/xr/generate
- [ ] Add endpoint GET  /threads/{id}/xr/blueprint/latest
- [ ] Implement blueprint validation against schema
- [ ] Implement generator agent (on-demand) that reads events/snapshots and outputs blueprint
- [ ] Enforce redaction + permissions in blueprint item selection

## Frontend/XR
- [ ] Implement blueprint loader
- [ ] Render minimum canonical zones
- [ ] Ensure XR state mutations are emitted as thread events only

## Tests
- [ ] Run `ACCEPTANCE_TESTS_XR_GENERATOR.md`
