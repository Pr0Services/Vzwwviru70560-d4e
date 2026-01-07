# 04_ORCHESTRATION

## Modules V71
- SYNAPSE_FLOW.md - Flux synaptique
- SYNAPTIC_SWITCHER.md - Changement de contexte
- AGENT_HIERARCHY.md - Hiérarchie agents
- YELLOW_PAGES_AUTHORITY.md - Autorité & routage

## Backend Implementation
backend/core/synaptic/
├── synaptic_context.py
├── synaptic_switcher.py
├── synaptic_graph.py
└── yellow_pages.py

backend/core/quantum/
└── quantum_orchestrator.py

## Test D (Validation)
- Un besoin → un seul appel
- Appel va au bon niveau hiérarchique
- Pas de collision d'agents
