# CHE·NU Universe Dashboard

> **SAFE · NON-AUTONOMOUS · REPRESENTATIONAL**

The CHE·NU Universe Dashboard is a React-based visualization interface for navigating the CHE·NU ecosystem.

## 🛡️ Safety Principles

- **Read-Only Mode**: All data is representational and cannot be modified
- **No Autonomous Actions**: All actions require explicit human initiation
- **External Memory Only**: No internal AI memory or learning
- **Session-Based Settings**: No persistent storage of user preferences

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
ui/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── adapters/           # Data adapters
│   │   ├── universeAdapter.ts
│   │   ├── toolAdapter.ts
│   │   ├── processAdapter.ts
│   │   ├── projectAdapter.ts
│   │   ├── templateAdapter.ts
│   │   └── memoryAdapter.ts
│   ├── components/         # Reusable components
│   │   └── index.ts
│   ├── pages/              # Page components
│   │   ├── DashboardRoot.tsx
│   │   ├── SphereDashboardPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── AboutPage.tsx
│   │   └── HelpPage.tsx
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application
│   └── index.tsx           # Entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔮 10 Spheres

The dashboard provides navigation across 10 spheres:

| Sphere | Icon | Description |
|--------|------|-------------|
| Personal | 🏠 | Daily life and personal management |
| Creative | 🎨 | Artistic projects and creative work |
| Business | 💼 | Professional and business activities |
| Education | 📚 | Learning and academic pursuits |
| Construction | 🏗️ | Building and development projects |
| Real Estate | 🏢 | Property and real estate management |
| Government | 🏛️ | Civic and governmental activities |
| Social | 👥 | Community and social interactions |
| Production | 🏭 | Manufacturing and production |
| Systems | ⚙️ | Infrastructure and system management |

## ⚙️ Engines

The dashboard visualizes four core engines:

- **HyperFabric**: Contextual organization and linking
- **Cartography**: Spatial mapping and navigation
- **Depth & Lens**: Detail level management
- **Projection Engine**: Visualization and rendering

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Sacred Gold | `#D8B26A` | Primary accent |
| Ancient Stone | `#8D8371` | Secondary text |
| Jungle Emerald | `#3F7249` | Success, active states |
| Cenote Turquoise | `#3EB4A2` | Info, highlights |
| Shadow Moss | `#2F4C39` | Dark green accent |
| Earth Ember | `#7A593A` | Warm accent |
| UI Slate | `#1E1F22` | Dark backgrounds |
| Soft Sand | `#E9E4D6` | Light backgrounds |

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **CSS-in-JS** - Styling (inline styles)

## 🔒 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    CHE·NU Dashboard                      │
│                    (Read-Only View)                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     Adapters                             │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐             │
│  │ Universe  │ │   Tool    │ │  Process  │ ...         │
│  └───────────┘ └───────────┘ └───────────┘             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Mock Data / Schemas                         │
│          (Representational Only)                         │
└─────────────────────────────────────────────────────────┘
```

## 📄 License

MIT License - CHE·NU Project

---

**CHE·NU** — *Chez Nous — Your Digital Universe*
