# UX Entry Flow — Entering a Thread (Chat / Live / XR)

## 1) UX goal
When a user opens a thread, they should instantly know:
- What this thread is
- Where it stands (maturity + latest summary)
- What they can do next
- Which mode is best right now (Chat, Live, XR)

## 2) Entry screen (Thread Lobby)
Components:
- Title + founding intent (short)
- "Where we are" card:
  - maturity level label
  - last updated
  - last summary excerpt (from SUMMARY_SNAPSHOT)
- Primary CTA buttons:
  - Continue in Chat
  - Enter XR Room
  - Start/Join Live (if permitted)
- Secondary:
  - View timeline
  - View decisions
  - View actions list

## 3) Mode recommendations (adaptive)
Use maturity + recency:
- If Level 0–1: Recommend Chat (simplest)
- If Level 2–3: Recommend XR for coordination and overview
- If Live is ongoing: Recommend Join Live
- If last summary is stale: Recommend Generate Summary (memory agent)

## 4) "Enter XR" preflight (avoid confusion)
Before entering XR, show:
- What will be visible (zones list)
- What you can modify (permissions)
- Privacy note (redaction level enforcement)
- Button: Enter

## 5) First-time onboarding (per thread)
If user enters thread first time:
- Show 30-second guided intro:
  - “This room is a projection of the thread.”
  - “Any change becomes an event.”
  - “The memory agent can summarize anytime.”
  - “Nothing is lost.”

## 6) Live UX
- If Live ongoing:
  - Show Join Live
  - Show roles present (humans + agents)
- If no Live:
  - Show Start Live (for allowed roles)
  - Explain: “Live creates a time segment in this same thread.”

## 7) Edge cases
- No snapshot yet:
  - show founding intent + “Generate first summary” CTA
- Archived thread:
  - default read-only mode; XR entry allowed (read-only)
- Low permission:
  - hide write CTAs; show “Request access” flow (optional)
