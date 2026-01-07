# PR-READY PLAN — Thread → Environment Generator

## PR Title
feat(xr): generate XR environments from threads (projection-only, event-sourced)

## Goal
Generate an XR environment (room) from a thread's canonical event log + snapshots using an on-demand generator agent.

## Non-negotiables
- No duplicated memory (no XR canonical state)
- Blueprint is derived (cache ok)
- All XR actions write via ThreadEvent API

## Steps
1) Add docs/specs
2) Add blueprint schema + validation
3) Add backend endpoints:
   - POST /threads/{thread_id}/xr/generate
   - GET /threads/{thread_id}/xr/blueprint/latest
4) Add generator agent (on-demand)
5) Add XR client loader + renderer contract
6) Add acceptance tests + checklist
