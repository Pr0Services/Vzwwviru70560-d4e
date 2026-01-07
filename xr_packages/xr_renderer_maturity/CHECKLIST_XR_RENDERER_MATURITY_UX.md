# Implementation Checklist (Claude)

## Docs/specs
- [ ] Add renderer, maturity, UX entry docs
- [ ] Link from architecture index

## Backend
- [ ] Add /threads/{id}/maturity endpoint (derived) OR compute server-side in thread GET
- [ ] Add snapshot type 'thread_maturity' (optional)
- [ ] Ensure XR generator endpoints exist and return blueprint
- [ ] Enforce redaction filtering server-side

## Frontend
- [ ] Implement Thread Lobby screen with mode selection
- [ ] Implement maturity badge + summary excerpt
- [ ] Implement XR preflight + first-time onboarding
- [ ] Implement minimal XR renderer contract

## XR interactions
- [ ] Map actions to ThreadEvents per mapping doc
- [ ] Permission checks before enabling write interactions

## Tests
- [ ] Run acceptance tests doc
