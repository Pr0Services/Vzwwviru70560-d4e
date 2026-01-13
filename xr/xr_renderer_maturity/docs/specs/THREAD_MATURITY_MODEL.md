# Thread Maturity Model (Canonical, Derived)

## 1) Why maturity exists
Maturity controls:
- Which XR template is chosen
- How dense/complex the room becomes
- Which UI prompts are shown at entry
- Which automation triggers are allowed

Maturity is **derived** from events/snapshots, never authoritative.

## 2) Maturity levels (0–5)
0. Seed       — intent only, few messages
1. Sprout     — chat active, first actions/decisions appear
2. Workshop   — tasks structured, summaries exist
3. Studio     — multiple participants, live sessions, linked threads
4. Org        — cross-thread dependencies, governance, regular snapshots
5. Ecosystem  — many linked threads, portals, high continuity

## 3) Scoring (simple + deterministic)
Compute a numeric score from event log, clamp to [0, 100]. Suggested weights:
- +10 if ≥ 1 SUMMARY_SNAPSHOT
- +10 if ≥ 1 DECISION_RECORDED
- +10 if ≥ 5 ACTION_* events
- +10 if ≥ 3 participants
- +10 if ≥ 1 LIVE segment
- +10 if ≥ 3 LINK_ADDED
- +10 if ≥ 20 MESSAGE_POSTED
- +10 if ≥ 5 CORRECTION_APPENDED / ERROR_RECORDED / LEARNING_RECORDED (learning density)
- +10 if thread age ≥ 30 days and still active
- +10 if ≥ 3 linked threads (portals)

Map score to levels:
- 0–9: Level 0 (Seed)
- 10–24: Level 1 (Sprout)
- 25–44: Level 2 (Workshop)
- 45–64: Level 3 (Studio)
- 65–84: Level 4 (Org)
- 85–100: Level 5 (Ecosystem)

## 4) Environment evolution rules
Level 0: one wall + memory kiosk (simple)
Level 1: add action table + basic decision wall
Level 2: add resource shelf + timeline strip
Level 3: add portals + live corner + roles signage
Level 4: add governance board + metrics shelf (derived)
Level 5: add multi-room navigation + thread atlas view (still projection)

## 5) Storage
- Store computed maturity as derived snapshot:
  - snapshot_type='thread_maturity'
  - content includes score + level + computed signals
- Recompute on demand or when threshold-triggering events happen.
