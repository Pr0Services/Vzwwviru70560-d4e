# Acceptance Tests — XR Generator (Must Pass)

## A) Projection-only
1) Generate blueprint -> ENV_BLUEPRINT_GENERATED event exists.
2) Delete cached blueprint -> regenerate works without loss.
3) XR has no canonical DB tables for decisions/actions.

## B) Single source of truth
4) XR moves action to Done -> ACTION_UPDATED event exists.
5) Chat UI reflects updated action from events.

## C) Permissions & privacy
6) Viewer cannot mutate actions (event POST rejected).
7) Redacted items not visible in blueprint for insufficient roles.

## D) Cost control
8) Generator agent is not running continuously.
9) Generate endpoint runs only on demand.
