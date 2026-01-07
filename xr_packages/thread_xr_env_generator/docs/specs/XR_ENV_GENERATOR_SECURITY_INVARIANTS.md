# XR Generator — Security & Governance Invariants

## A) Projection-only
1) XR has no canonical state store.
2) Blueprint is derived and can be deleted and regenerated.

## B) Permission-gated interactions
3) XR writes must be done through ThreadEvent API.
4) Server validates permissions and redaction_level at read and write.

## C) Privacy
5) Blueprint generation must respect redaction levels.
6) XR client must not receive items the user cannot view.

## D) Agent constraints
7) Generator agent is on-demand only.
8) Generator agent cannot change permissions or rewrite history.

## E) Auditability
9) ENV_BLUEPRINT_GENERATED is an event with actor_id.
10) All XR mutations are recorded as events (actor identity required).
