# CHE·NU™ — Governed Intelligence Operating System

```
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                              ║
║       ██████╗██╗  ██╗███████╗   ███╗   ██╗██╗   ██╗    ██╗   ██╗███████╗ ██╗                ║
║      ██╔════╝██║  ██║██╔════╝   ████╗  ██║██║   ██║    ██║   ██║╚════██║███║                ║
║      ██║     ███████║█████╗     ██╔██╗ ██║██║   ██║    ██║   ██║    ██╔╝╚██║                ║
║      ██║     ██╔══██║██╔══╝     ██║╚██╗██║██║   ██║    ╚██╗ ██╔╝   ██╔╝  ██║                ║
║      ╚██████╗██║  ██║███████╗██╗██║ ╚████║╚██████╔╝     ╚████╔╝    ██║   ██║                ║
║       ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝       ╚═══╝     ╚═╝   ╚═╝                ║
║                                                                                              ║
║                    GOVERNED INTELLIGENCE OPERATING SYSTEM                                    ║
║                                                                                              ║
║                         "Chez Nous" — At Home with Your Data                                ║
║                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════╝
```

[![Version](https://img.shields.io/badge/version-71.0.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](./LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-green.svg)](./09_TESTS)
[![Canonical](https://img.shields.io/badge/canonical-compliant-gold.svg)](./docs/architecture/CANONICAL_INVARIANTS.md)

---

## 📋 Table of Contents

1. [Vision & Philosophy](#-vision--philosophy)
2. [Architecture Overview](#-architecture-overview)
3. [Core Principles](#-core-principles)
4. [The 9 Spheres](#-the-9-spheres)
5. [Thread System](#-thread-system)
6. [Agent Framework](#-agent-framework)
7. [XR Integration](#-xr-integration)
8. [Quick Start](#-quick-start)
9. [Directory Structure](#-directory-structure)
10. [Documentation](#-documentation)
11. [Contributing](#-contributing)
12. [License](#-license)

---

## 🎯 Vision & Philosophy

### What CHE·NU Is NOT
- ❌ A chatbot
- ❌ A productivity app
- ❌ A crypto platform
- ❌ A social network
- ❌ An AI wrapper

### What CHE·NU IS
- ✅ A **Governed Intelligence Operating System**
- ✅ A platform for managing **intent, data, AI agents, and costs**
- ✅ A **governance system** before anything else
- ✅ An operating system where **humans take ALL decisions**
- ✅ A framework built for **decades, not trends**

### The CHE·NU Manifesto

> **Structure precedes intelligence.**
> **Visibility precedes power.**
> **Human accountability is non-negotiable.**
> **Systems guide decisions; humans decide.**
> **CHE·NU is built for decades, not trends.**

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CHE·NU ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          USER INTERFACE LAYER                            │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │   │
│  │  │   Web   │  │ Mobile  │  │ Desktop │  │   XR    │  │   CLI   │       │   │
│  │  │ React   │  │ Expo    │  │ Tauri   │  │ Unity   │  │ Typer   │       │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘       │   │
│  └───────┼───────────┼───────────┼───────────┼───────────┼─────────────────┘   │
│          │           │           │           │           │                      │
│  ┌───────┴───────────┴───────────┴───────────┴───────────┴─────────────────┐   │
│  │                           API GATEWAY                                    │   │
│  │              FastAPI • WebSocket • REST • GraphQL                        │   │
│  └───────────────────────────────┬──────────────────────────────────────────┘   │
│                                  │                                              │
│  ┌───────────────────────────────┴──────────────────────────────────────────┐   │
│  │                         GOVERNANCE LAYER                                 │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                │   │
│  │  │    Identity   │  │   Checkpoint  │  │     Audit     │                │   │
│  │  │   Boundary    │  │    System     │  │     Trail     │                │   │
│  │  └───────────────┘  └───────────────┘  └───────────────┘                │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                         CORE SERVICES                                    │   │
│  │                                                                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │   Thread    │  │    Agent    │  │   Memory    │  │     XR      │    │   │
│  │  │   System    │  │  Framework  │  │   Engine    │  │  Generator  │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  │                                                                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │  Knowledge  │  │   Token     │  │  Encoding   │  │   Search    │    │   │
│  │  │    Base     │  │  Governor   │  │    Layer    │  │   Engine    │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                         THE 9 SPHERES                                    │   │
│  │                                                                          │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │
│  │  │Personal │ │Business │ │Governmt │ │ Studio  │ │Community│           │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                       │   │
│  │  │ Social  │ │Entertmt │ │ My Team │ │ Scholar │                       │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘                       │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                         DATA LAYER                                       │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                │   │
│  │  │  PostgreSQL   │  │    Redis      │  │   Pinecone    │                │   │
│  │  │  (Primary)    │  │   (Cache)     │  │  (Vectors)    │                │   │
│  │  └───────────────┘  └───────────────┘  └───────────────┘                │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏛 Core Principles

### 1. GOVERNANCE > EXECUTION

Every action in CHE·NU passes through governance checkpoints:

```
User Intent → Governance Check → Checkpoint (if needed) → Execution → Audit
```

**HTTP Status Codes:**
- `200` — Success, execution complete
- `403` — Identity violation, access denied
- `423` — Checkpoint required, human approval needed

### 2. THREAD AS SINGLE SOURCE OF TRUTH

**In CHE·NU, everything begins with a Thread. Everything is recorded in it. Nothing exists outside of it.**

```
┌─────────────────────────────────────────────────────────────────┐
│                         THREAD                                  │
│                                                                 │
│  founding_intent: "Your purpose"                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    EVENT LOG (Append-Only)              │   │
│  │                                                         │   │
│  │  [THREAD_CREATED] → [MESSAGE_POSTED] → [DECISION] →    │   │
│  │  [ACTION_CREATED] → [LIVE_STARTED] → [SNAPSHOT] → ...  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Projections: Chat | Live | XR | Timeline | Memory              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3. HUMAN SOVEREIGNTY

Agents propose. Humans decide. No exceptions.

```python
# WRONG ❌
agent.execute_action(data)  # Autonomous execution

# CORRECT ✅
proposal = agent.propose_action(data)  # Agent proposes
if human.approves(proposal):           # Human decides
    execute(proposal)                  # Then execute
```

### 4. IDENTITY ISOLATION

Every user's data is strictly isolated. Cross-identity access = HTTP 403.

### 5. APPEND-ONLY AUDIT TRAIL

Events are never modified, never deleted. Only appended. Corrections reference originals.

---

## 🌐 The 9 Spheres

CHE·NU organizes life and work into 9 distinct spheres:

| Sphere | Icon | Purpose | Key Features |
|--------|------|---------|--------------|
| **Personal** | 🏠 | Individual life management | Notes, Tasks, Goals, Habits |
| **Business** | 💼 | Professional operations | CRM, Invoicing, Projects |
| **Government** | 🏛 | Civic & institutional | Compliance, Documents |
| **Creative Studio** | 🎨 | Content creation | AI Art, Video, Music |
| **Community** | 👥 | Collective initiatives | Groups, Events, Causes |
| **Social & Media** | 📱 | Public presence | Scheduling, Analytics |
| **Entertainment** | 🎬 | Leisure & consumption | Streaming, Gaming |
| **My Team** | 🤝 | Team coordination | Collaboration, Resources |
| **Scholar** | 📚 | Learning & research | Knowledge, Citations |

Each sphere has:
- 6 Bureau sections (QuickCapture, ResumeWorkspace, Threads, DataFiles, ActiveAgents, Meetings)
- Dedicated agents
- Scope-limited access

---

## 🧵 Thread System

### Thread V2 Architecture

```python
@dataclass
class Thread:
    """The atomic unit of meaning in CHE·NU."""
    id: str
    founding_intent: str  # REQUIRED — Why does this thread exist?
    owner_id: str
    sphere: Sphere
    status: ThreadStatus
    created_at: datetime
    events: List[ThreadEvent]  # Append-only event log
    
    # Projections (derived from events)
    def get_chat_view() -> ChatProjection
    def get_xr_state() -> XRProjection
    def get_timeline() -> TimelineProjection
```

### Event Types

| Event Type | Purpose |
|------------|---------|
| `THREAD_CREATED` | Thread initialization |
| `MESSAGE_POSTED` | Chat messages |
| `DECISION_RECORDED` | Explicit decisions with rationale |
| `ACTION_CREATED` | Task/action creation |
| `ACTION_UPDATED` | Status updates |
| `LIVE_STARTED` | Real-time session begin |
| `LIVE_ENDED` | Real-time session end |
| `SUMMARY_SNAPSHOT` | Memory agent summaries |
| `LINK_ADDED` | External resources |
| `CORRECTION_APPENDED` | Corrections (never edits) |

---

## 🤖 Agent Framework

### Agent Lifecycle

```
Dormant → Instantiated → Bound to Thread → Scoped Execution → Result → Dormant
```

### Agent Types

1. **Nova** — System intelligence (never hired, always available)
2. **User Orchestrator** — Personal assistant (hired by user)
3. **Specialized Agents** — Domain experts (hired per task)
4. **Memory Agent** — Exactly one per thread (automatic)

### Agent Constraints

```python
class AgentConstraints:
    max_tokens: int        # Token budget
    scope: List[Sphere]    # Allowed spheres
    permissions: List[str] # Allowed actions
    requires_approval: bool # Checkpoint enforcement
```

---

## 🥽 XR Integration

### XR as Projection

XR environments are **projections** of thread state, never authoritative:

```
Thread Events → XR Generator → Blueprint → XR Client Rendering
                    ↓
            ENV_BLUEPRINT_GENERATED (event)
```

### XR Zones (Canonical)

Every XR environment contains:
- `intent_wall` — Founding intent display
- `decision_wall` — Key decisions
- `action_table` — Active tasks
- `memory_kiosk` — Snapshots & summaries
- `timeline_strip` — Chronological events
- `resource_shelf` — External links (optional)

### XR Templates

- `personal_room` — For personal threads
- `business_room` — For business/finance
- `cause_room` — For community/impact
- `lab_room` — For research/experiments
- `custom_room` — Default fallback

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Clone repository
git clone https://github.com/chenu/chenu-v71.git
cd chenu-v71

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Environment configuration
cp .env.example .env
# Edit .env with your configuration

# Database setup
alembic upgrade head

# Start backend
uvicorn main:app --reload

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### First Steps

1. Create your identity
2. Initialize your first thread with a founding_intent
3. Post your first message
4. Record your first decision
5. Explore the thread projections

---

## 📁 Directory Structure

```
CHE·NU_V71/
├── 00_MASTER/                    # Master documentation
│   ├── CANONICAL_ARCHITECTURE.md
│   ├── GOVERNANCE_RULES.md
│   └── VERSIONING.md
│
├── 01_GOVERNANCE/                # Governance modules
│   ├── identity/                 # Identity management
│   ├── checkpoints/              # Checkpoint system
│   └── audit/                    # Audit trail
│
├── 02_CORE_SYSTEM/               # Core services
│   ├── thread_v2/                # Thread system
│   ├── agent_framework/          # Agent framework
│   ├── memory_engine/            # Memory management
│   └── token_governor/           # Token budgets
│
├── 03_INTERFACES/                # Interface adapters
│   ├── api/                      # REST/GraphQL API
│   ├── websocket/                # Real-time events
│   └── cli/                      # Command line
│
├── 04_ORCHESTRATION/             # Nova & orchestration
│   ├── nova_pipeline/            # Multi-lane pipeline
│   ├── llm_router/               # LLM routing
│   └── agent_runtime/            # Agent execution
│
├── 05_SOCIO_ECONOMIC/            # Economic modules
│   ├── tokens/                   # Token system
│   └── billing/                  # Cost tracking
│
├── 06_KNOWLEDGE_CULTURE/         # Knowledge systems
│   ├── knowledge_base/           # KB management
│   ├── search_engine/            # Semantic search
│   └── citations/                # Citation tracking
│
├── 07_ADVANCED_TECH/             # Advanced features
│   ├── xr_generator/             # XR blueprints
│   ├── ml_models/                # ML components
│   └── integrations/             # External APIs
│
├── 08_GRAPHS/                    # Graph structures
│   ├── relationship_graph/       # Entity relationships
│   └── knowledge_graph/          # Knowledge connections
│
├── 09_TESTS/                     # Test suites
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── canonical/                # Canonical compliance
│
├── backend/                      # Python backend
│   ├── api/                      # API routes
│   ├── services/                 # Business logic
│   ├── agents/                   # Agent implementations
│   └── core/                     # Core modules
│
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/           # UI components
│   │   ├── pages/                # Page components
│   │   ├── hooks/                # Custom hooks
│   │   └── stores/               # State management
│   └── public/
│
├── docs/                         # Documentation
│   ├── architecture/             # Architecture docs
│   ├── api/                      # API documentation
│   ├── guides/                   # User guides
│   └── specs/                    # Specifications
│
├── Datasets/                     # Sample data
├── cypress/                      # E2E tests
│
├── .env.example                  # Environment template
├── CHANGELOG.md                  # Version history
├── CONTRIBUTING.md               # Contribution guide
├── LICENSE                       # License
├── README.md                     # This file
└── QUICK_START.md                # Quick start guide
```

---

## 📚 Documentation

### Architecture
- [Canonical Invariants](./docs/architecture/CANONICAL_INVARIANTS.md)
- [Thread V2 Specification](./docs/architecture/THREAD_V2_SPEC.md)
- [Agent Framework](./docs/architecture/AGENT_FRAMEWORK.md)
- [XR Integration](./docs/architecture/XR_INTEGRATION.md)

### API
- [REST API Reference](./docs/api/REST_API.md)
- [WebSocket Events](./docs/api/WEBSOCKET_EVENTS.md)
- [GraphQL Schema](./docs/api/GRAPHQL_SCHEMA.md)

### Guides
- [Quick Start Guide](./QUICK_START.md)
- [Development Guide](./docs/guides/DEVELOPMENT.md)
- [Deployment Guide](./docs/guides/DEPLOYMENT.md)
- [Testing Guide](./docs/guides/TESTING.md)

### Reports
- [Thread V2 Quality Report](./THREAD_V2_QUALITY_UX_REPORT.md)
- [Deployment Report](./V71_FINAL_DEPLOYMENT_REPORT.md)
- [UX Analysis](./V71_ANALYSE_UX_COMPLETE.md)

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow canonical principles
4. Write tests
5. Submit PR with clear description

### Code Standards

- Python: Black, isort, mypy
- TypeScript: ESLint, Prettier
- Tests: pytest, Jest, Cypress
- Documentation: Markdown with Mermaid

---

## 📄 License

CHE·NU™ is proprietary software. See [LICENSE](./LICENSE) for details.

---

## 🏆 Credits

Created with 💜 by Jonathan and the CHE·NU Team

Special thanks to all AI collaborators who contributed to stress-testing ideas, refining vision, and uncovering blind spots.

---

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    "Structure precedes intelligence."                        ║
║                                                                              ║
║                           CHE·NU™ V71.0.0                                   ║
║                                                                              ║
║                  © 2026 CHE·NU™ — All Rights Reserved                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```
