# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU — UI WIREFRAMES
# AGENT INBOX • TASKS • MEETING ROOM • GLOBAL LAYOUT
# CANONICAL UX STRUCTURE (IMPLEMENT AS-IS)
# ═══════════════════════════════════════════════════════════════════════════════

**Version**: 1.0.0  
**Status**: CANONICAL - IMPLEMENT AS-IS  
**Priority**: CRITICAL

---

## GLOBAL LAYOUT (APPLIES TO ALL SCREENS)

```
+--------------------------------------------------+
| TOP BAR                                          |
| [Sphere Icon] Sphere Name        [Nova] [User]   |
+--------------------------------------------------+
| SIDE BAR            | MAIN CONTENT               |
|---------------------|----------------------------|
| Universe View       | Context-aware content      |
| My Team             |                            |
| Inbox               |                            |
| Tasks               |                            |
| Meetings            |                            |
| Memory              |                            |
+---------------------+----------------------------+
```

### Rules

| Rule | Description |
|------|-------------|
| Left sidebar is stable | Navigation never changes |
| Main content changes per context | Dynamic based on selection |
| Nova icon is always visible but passive | AI assistant available but not intrusive |
| No popups by default | Everything in-context |

---

## AGENT INBOX — LIST VIEW

```
+--------------------------------------------------+
| AGENT INBOX — [Agent Name]                        |
+--------------------------------------------------+
| Filters: [All] [Tasks] [Notes] [Decisions] [🔍] |
+--------------------------------------------------+
| ◉ NEW  | [TASK][HIGH] Review CRM Pipeline        |
|        | From: User — 10 min ago                  |
|--------------------------------------------------|
| ◉ NEW  | [NOTE] Client feedback summary           |
|        | From: Agent — Yesterday                  |
|--------------------------------------------------|
|        | [QUESTION] Need clarification             |
|        | From: Agent — 2 days ago                  |
+--------------------------------------------------+
```

### Rules

| Rule | Description |
|------|-------------|
| Bold dot ◉ = unread | Visual indicator for new messages |
| Priority color is subtle | Not overwhelming |
| Scroll only inside the list | Header stays fixed |
| No modal opening | Everything inline |

---

## AGENT INBOX — MESSAGE DETAIL

```
+--------------------------------------------------+
| MESSAGE DETAIL                                   |
+--------------------------------------------------+
| Type: TASK      Priority: HIGH                   |
| Sender: User     Time: 2025-xx-xx                |
|--------------------------------------------------|
| Title / Content                                  |
| ------------------------------------------------ |
| Please analyze the onboarding funnel             |
| and propose optimizations.                       |
|--------------------------------------------------|
| Related Task: [Open Task]                        |
+--------------------------------------------------+
| [Acknowledge] [Create Task] [Ask Question]      |
+--------------------------------------------------+
```

### Rules

| Rule | Description |
|------|-------------|
| Primary action is always clear | Most important action highlighted |
| No destructive action on this screen | Safe operations only |
| Actions limited to max 3 visible buttons | Reduce cognitive load |

---

## TASK BOARD — AGENT VIEW

```
+--------------------------------------------------+
| TASKS — Assigned to [Agent Name]                 |
+--------------------------------------------------+
| [PENDING]                                       |
| - Analyze onboarding UX        (HIGH)            |
|--------------------------------------------------|
| [IN PROGRESS]                                   |
| - CRM competitor review        (NORMAL)          |
|--------------------------------------------------|
| [BLOCKED]                                       |
| - Data missing from API        (HIGH)            |
|--------------------------------------------------|
| [COMPLETED]                                     |
| - Weekly report                (LOW)             |
+--------------------------------------------------+
```

### Rules

| Rule | Description |
|------|-------------|
| Kanban-style vertical flow | Clear status progression |
| Drag & drop optional | Enhanced UX when available |
| Status is always visible | No hidden states |
| No hidden states | Everything explicit |

---

## TASK DETAIL

```
+--------------------------------------------------+
| TASK DETAIL                                     |
+--------------------------------------------------+
| Title: Analyze onboarding UX                    |
| Priority: HIGH   Status: IN PROGRESS             |
| Due: Tomorrow                                   |
|--------------------------------------------------|
| Description                                     |
| ------------------------------------------------ |
| Full task description here                      |
|--------------------------------------------------|
| Updates Timeline                                |
| - Agent started task (10:22)                    |
| - Found friction in step 2                      |
+--------------------------------------------------+
| [Update Status] [Add Comment] [Mark Done]       |
+--------------------------------------------------+
```

---

## MEETING ROOM 2D — MAIN VIEW

```
+--------------------------------------------------+
| MEETING ROOM — Strategy Review                  |
+--------------------------------------------------+
| Objective: Improve onboarding conversion        |
+--------------------------------------------------+
| Agenda (Left)        | Discussion / Content     |
|----------------------|---------------------------|
| 1. Funnel overview   | Threaded discussion       |
| 2. UX friction       |                           |
| 3. Decisions         |                           |
|----------------------|---------------------------|
| Agents active:       | Timeline                  |
| Organizer            | - Decision logged         |
| Methodology          | - Task created            |
+--------------------------------------------------+
| [Summarize] [Decide] [Continue Later]           |
+--------------------------------------------------+
```

### Rules

| Rule | Description |
|------|-------------|
| Agenda always visible | Context never lost |
| Decisions visually separated from chat | Clear distinction |
| Agents listed but not dominant | Present but not overwhelming |

---

## VOICE INPUT (ANY CONTEXT)

```
[🎙 Hold to Speak]

After release:
→ Transcription preview
→ User confirms / edits
→ Message created
```

### NEVER

| ❌ Never | Why |
|----------|-----|
| Auto-send | User must confirm |
| Continuous listening | Privacy & control |

---

## UNIVERSE VIEW — MINIMAL WIREFRAME

```
             [Business Sphere]
                  ◉
        ◉ [Scholar]       [Creative] ◉

              [YOU / CORE]

        ◉ [Methodology]    [XR] ◉
```

### Rules

| Rule | Description |
|------|-------------|
| Size = importance (not noise) | Visual hierarchy |
| Click = focus | Select sphere |
| Zoom = dive into sphere | Navigate deeper |
| No clutter, no labels overload | Clean UI |

---

## UX GOLDEN RULES

1. **One primary action per screen**
2. **Nothing irreversible**
3. **Calm colors, slow transitions**
4. **Agents assist, never overwhelm**
5. **Silence is a feature**

---

**END OF UI WIREFRAME BLOCK**
