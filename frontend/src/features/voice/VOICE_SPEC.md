# CHE·NU — NOVA VOICE ACTIVATION

```
Version: 1.0.0
Status: FROZEN
Last Updated: 2025-01
```

---

## 🎯 PURPOSE

Introduce voice interaction without breaking trust, focus, or governance.
Voice is an extension of the system — never a default behavior.

---

## 🧱 CORE PRINCIPLE

> Voice is earned, not enabled.
> Silence is the default state.

---

## ACTIVATION CONDITIONS (MINIMUM 2 REQUIRED)

Nova voice may be proposed only if **at least 2** of these are true:

| # | Condition |
|---|-----------|
| 1 | User has completed at least one assisted action (proposal accepted/rejected) |
| 2 | Session duration > 20 minutes |
| 3 | Orchestrator is activated |
| 4 | User is multitasking (switching surfaces or contexts) |
| 5 | User enters a meeting or collaboration context |

**If conditions not met → voice remains unavailable.**

---

## PROPOSAL RULES (STRICT)

- Proposed **once only**
- No reminders if declined
- No automatic activation
- Proposal must be explicit and reversible

---

## CANONICAL NOVA PROPOSAL SCRIPT

```
Nova (text only):
"You can enable voice interaction if you prefer speaking instead of typing.
Voice is optional and can be turned off at any time."
```

### Buttons
```
[ Enable voice ]   [ Not now ]
```

- Default focus: **"Not now"**

---

## IF USER DECLINES

- Choice is remembered
- Voice not re-proposed in same session
- Manual activation remains available

### Settings Path
```
Settings → Interaction → Voice
```

---

## IF USER ACCEPTS

### Immediate Effects
- Nova voice becomes available
- Push-to-talk enabled by default
- No continuous listening
- No background recording

### What Does NOT Change
- No automatic actions
- No direct execution
- No DB access
- No bypass of confirmation flows

---

## VOICE INTERACTION MODES

### Mode 1 — Push-to-Talk (Default)
- User explicitly clicks or holds a key
- Visual indicator while listening
- Stops immediately after input

### Mode 2 — Hands-Free (Optional, Later)
- Explicit user opt-in
- Clear visual indicator at all times
- Disabled by default
- Can be suspended instantly

---

## WHAT NOVA VOICE CAN DO

- ✅ Read explanations aloud
- ✅ Confirm user intentions
- ✅ Ask clarification questions
- ✅ Narrate system state

---

## WHAT NOVA VOICE CANNOT DO

- ❌ Execute actions
- ❌ Confirm on behalf of user
- ❌ Trigger agents directly
- ❌ Access data silently
- ❌ Persist information

---

## VOICE + ORCHESTRATOR RELATIONSHIP

- Voice speaks for Nova only
- Orchestrator never speaks directly
- All actions still follow the governance flow:

```
Intention → Proposal → Confirmation → Execution
```

**Voice does not shorten or bypass the flow.**

---

## PRIVACY & TRUST RULES

- Voice is processed only when activated
- No passive listening
- No storage of raw audio by default
- Transcripts are visible before any use
- User can delete voice interactions at any time

---

## UX CONSTRAINTS (NON-NEGOTIABLE)

- Voice never interrupts typing
- Voice never overlaps other audio
- Voice pauses automatically during focus mode
- Voice respects OS-level mute settings

---

## VISUAL INDICATORS

When voice is enabled:
- Subtle microphone icon visible
- Active listening state clearly shown
- One-click mute always available

### States
| State | Indicator |
|-------|-----------|
| Available | Grey mic icon |
| Listening | Pulsing green |
| Processing | Spinning |
| Speaking | Animated waves |
| Muted | Crossed mic |

---

## FAILURE & FALLBACK

If voice fails:
- System falls back to text silently
- No error popups
- Nova explains only if user asks

---

## GOVERNANCE SUMMARY

- ✅ Voice is optional
- ✅ Voice is reversible
- ✅ Voice is never required
- ✅ Voice never decides
- ✅ Voice never acts alone

---

## CANONICAL STATEMENT

```
"NOVA speaks only when invited.
NOVA listens only when allowed.
NOVA never acts without consent."
```

---

```
END OF SPECIFICATION
```
