# Acceptance Tests — XR Renderer + Maturity + UX Entry (Must Pass)

## A) Entry UX
1) Opening a thread shows Lobby with founding intent + maturity + latest summary.
2) Mode buttons adapt: Level 0 recommends Chat; Level 3 recommends XR.
3) Live ongoing shows Join Live CTA; otherwise Start Live (if permitted).

## B) Maturity
4) Maturity score computed deterministically from events.
5) Snapshot 'thread_maturity' stored (optional) and matches recomputation.
6) Adding threshold events bumps maturity level appropriately.

## C) XR Renderer (projection-only)
7) XR loads blueprint and renders required zones.
8) XR shows only items allowed by redaction level + permissions.
9) XR writes only via events API; no local canonical state.

## D) Interactions -> events
10) Mark action done emits ACTION_UPDATED.
11) Add note emits MESSAGE_POSTED (tag=note).
12) Create action emits ACTION_CREATED.

## E) No forbidden behavior
13) No background agents running continuously.
14) No duplicated memory store for XR.
