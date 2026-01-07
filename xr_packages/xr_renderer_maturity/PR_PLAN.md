# PR-READY PLAN — XR Renderer + Thread Maturity + UX Entry

## PR Title
feat(xr): minimal XR renderer + thread maturity + entry UX

## Goal
Ship a minimal but complete XR experience:
- Load blueprint generated from thread
- Render canonical zones
- Allow basic interactions that emit ThreadEvents
- Provide a coherent entry UX: user chooses Chat / Live / XR
- Drive environment evolution through Thread Maturity levels

## Dependencies
- Requires Thread v2 (event log)
- Requires XR Blueprint generator package (ENV_BLUEPRINT_GENERATED)

## Steps
1) Add specs/docs
2) Implement maturity scoring (derived)
3) Implement entry UX (routing + prompts + CTA)
4) Implement XR renderer minimal (zones, items, interactions)
5) Map interactions -> events
6) Add acceptance tests
