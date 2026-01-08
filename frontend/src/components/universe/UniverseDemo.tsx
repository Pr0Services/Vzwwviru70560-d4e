/* =====================================================
   CHE·NU — Demo App
   
   PHASE 3: INTEGRATION DEMO
   
   Shows how all pieces fit together:
   - EngineProvider wraps the app
   - UniverseView renders the universe
   - Components consume resolved dimensions
   ===================================================== */

import React, { useState, useEffect } from 'react';
import { EngineProvider } from '../adapters/react';
import { UniverseView, UniverseConfig, SphereData } from './UniverseView';
import { injectComponentStyles } from './index';

// ─────────────────────────────────────────────────────
// MOCK DATA (in real app, this comes from API/state)
// ─────────────────────────────────────────────────────

const UNIVERSE_CONFIG: UniverseConfig = {
  topology: {
    type: 'radial',
    center: 'trunk',
    layers: ['core', 'extended', 'peripheral'],
  },
  trunk: {
    id: 'nova',
    type: 'orchestrator',
    position: { layer: 'center', index: 0 },
  },
  spheres: {
    order: ['personal', 'business', 'creative', 'scholar'],
    placement: {
      personal: { layer: 'core', angle: 0 },
      business: { layer: 'core', angle: 90 },
      creative: { layer: 'core', angle: 180 },
      scholar: { layer: 'core', angle: 270 },
    },
  },
  layers: {
    center: { radius: 0, scale: 1.2 },
    core: { radius: 200, scale: 1.0 },
    extended: { radius: 320, scale: 0.85 },
    peripheral: { radius: 420, scale: 0.7 },
  },
};

const MOCK_SPHERE_DATA: Record<string, SphereData> = {
  personal: {
    id: 'personal',
    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
    agents: [
      { id: 'life-manager', name: 'Life Manager', icon: '🧬' },
      { id: 'health-tracker', name: 'Health Tracker', icon: '❤️' },
    ],
    processes: [{ status: 'active' }],
    decisions: [{ resolved: false }, { resolved: true }],
  },
  business: {
    id: 'business',
    items: Array(15).fill(null).map((_, i) => ({ id: `proj-${i}` })),
    agents: [
      { id: 'strategy-ai', name: 'Strategy AI', icon: '🎯' },
      { id: 'finance-analyst', name: 'Finance Analyst', icon: '💰' },
      { id: 'market-intel', name: 'Market Intel', icon: '📊' },
      { id: 'partnership-mgr', name: 'Partnership Manager', icon: '🤝' },
      { id: 'operations-ai', name: 'Operations AI', icon: '⚙️' },
    ],
    processes: [{ status: 'active' }, { status: 'active' }, { status: 'pending' }],
    decisions: [
      { resolved: false },
      { resolved: false },
      { resolved: false },
      { resolved: true },
    ],
  },
  creative: {
    id: 'creative',
    items: Array(8).fill(null).map((_, i) => ({ id: `asset-${i}` })),
    agents: [
      { id: 'art-director', name: 'Art Director', icon: '🎨' },
      { id: 'writer-ai', name: 'Writer AI', icon: '✍️' },
      { id: 'video-producer', name: 'Video Producer', icon: '🎬' },
    ],
    processes: [{ status: 'idle' }],
    decisions: [],
  },
  scholar: {
    id: 'scholars',
    items: Array(25).fill(null).map((_, i) => ({ id: `paper-${i}` })),
    agents: [
      { id: 'research-ai', name: 'Research AI', icon: '🔬' },
      { id: 'lit-review', name: 'Literature Review', icon: '📚' },
      { id: 'data-scientist', name: 'Data Scientist', icon: '📈' },
    ],
    processes: [{ status: 'active' }],
    decisions: [{ resolved: false }],
  },
};

// ─────────────────────────────────────────────────────
// APP COMPONENT
// ─────────────────────────────────────────────────────

export function App() {
  const [selectedSphere, setSelectedSphere] = useState<string | null>(null);
  const [sphereData, setSphereData] = useState(MOCK_SPHERE_DATA);
  
  // Inject styles on mount
  useEffect(() => {
    injectComponentStyles();
  }, []);
  
  // Simulate activity
  useEffect(() => {
    const interval = setInterval(() => {
      setSphereData(prev => ({
        ...prev,
        business: {
          ...prev.business,
          processes: prev.business.processes.map(p => ({
            ...p,
            status: Math.random() > 0.3 ? 'active' : 'pending',
          })),
        },
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSphereClick = (sphereId: string) => {
    logger.debug('[CHE·NU] Sphere clicked:', sphereId);
    setSelectedSphere(sphereId);
  };
  
  const handleSphereEnter = (sphereId: string) => {
    logger.debug('[CHE·NU] Entering sphere:', sphereId);
    // Navigate to sphere detail view
  };
  
  const handleTrunkClick = () => {
    logger.debug('[CHE·NU] Trunk clicked');
    setSelectedSphere(null);
  };
  
  const handleAgentClick = (sphereId: string, agentId: string) => {
    logger.debug('[CHE·NU] Agent clicked:', sphereId, agentId);
    // Open agent detail/chat
  };
  
  return (
    <EngineProvider>
      <div className="chenu-app">
        <header className="chenu-app__header">
          <h1>🌳 CHE·NU Universe</h1>
          <p>Constitutional Architecture Demo</p>
        </header>
        
        <main className="chenu-app__main">
          <UniverseView
            config={UNIVERSE_CONFIG}
            sphereData={sphereData}
            complexity="standard"
            permission="write"
            onSphereClick={handleSphereClick}
            onSphereEnter={handleSphereEnter}
            onTrunkClick={handleTrunkClick}
            onAgentClick={handleAgentClick}
            width={800}
            height={700}
            showConnections
            animateLayout
          />
        </main>
        
        <aside className="chenu-app__sidebar">
          <h2>System Status</h2>
          
          <div className="chenu-app__status">
            <StatusItem 
              label="Active Spheres" 
              value={Object.values(sphereData).filter(s => 
                s.processes.some(p => p.status === 'active')
              ).length} 
            />
            <StatusItem 
              label="Total Agents" 
              value={Object.values(sphereData).reduce((sum, s) => 
                sum + s.agents.length, 0
              )} 
            />
            <StatusItem 
              label="Pending Decisions" 
              value={Object.values(sphereData).reduce((sum, s) => 
                sum + s.decisions.filter(d => !d.resolved).length, 0
              )}
              highlight
            />
          </div>
          
          {selectedSphere && (
            <div className="chenu-app__selection">
              <h3>Selected: {selectedSphere}</h3>
              <p>
                {sphereData[selectedSphere]?.items.length || 0} items, 
                {' '}{sphereData[selectedSphere]?.agents.length || 0} agents
              </p>
              <button onClick={() => handleSphereEnter(selectedSphere)}>
                Enter Sphere →
              </button>
            </div>
          )}
        </aside>
        
        <footer className="chenu-app__footer">
          <p>
            JSON = Constitution • Resolver = Interpreter • Components = Pure Renderers
          </p>
        </footer>
      </div>
    </EngineProvider>
  );
}

// ─────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────

function StatusItem({ label, value, highlight }: { 
  label: string; 
  value: number; 
  highlight?: boolean;
}) {
  return (
    <div className={`status-item ${highlight ? 'status-item--highlight' : ''}`}>
      <span className="status-item__value">{value}</span>
      <span className="status-item__label">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// APP STYLES
// ─────────────────────────────────────────────────────

export const appStyles = `
  .chenu-app {
    display: grid;
    grid-template-areas:
      "header header"
      "main sidebar"
      "footer footer";
    grid-template-columns: 1fr 280px;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    background: #0a0e0a;
    color: #e8f0e8;
    font-family: 'Inter', -apple-system, sans-serif;
  }
  
  .chenu-app__header {
    grid-area: header;
    padding: 20px 32px;
    border-bottom: 1px solid rgba(74, 124, 74, 0.2);
  }
  
  .chenu-app__header h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .chenu-app__header p {
    margin: 4px 0 0;
    font-size: 0.875rem;
    opacity: 0.6;
  }
  
  .chenu-app__main {
    grid-area: main;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
  }
  
  .chenu-app__sidebar {
    grid-area: sidebar;
    padding: 24px;
    border-left: 1px solid rgba(74, 124, 74, 0.2);
    background: rgba(0, 0, 0, 0.3);
  }
  
  .chenu-app__sidebar h2 {
    margin: 0 0 16px;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.7;
  }
  
  .chenu-app__status {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .status-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(74, 124, 74, 0.1);
    border-radius: 8px;
  }
  
  .status-item--highlight {
    background: rgba(255, 152, 0, 0.1);
  }
  
  .status-item__value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #4a7c4a;
  }
  
  .status-item--highlight .status-item__value {
    color: #ff9800;
  }
  
  .status-item__label {
    font-size: 0.75rem;
    opacity: 0.7;
  }
  
  .chenu-app__selection {
    margin-top: 24px;
    padding: 16px;
    background: rgba(74, 124, 74, 0.15);
    border-radius: 8px;
    border: 1px solid rgba(74, 124, 74, 0.3);
  }
  
  .chenu-app__selection h3 {
    margin: 0 0 8px;
    font-size: 1rem;
  }
  
  .chenu-app__selection p {
    margin: 0 0 12px;
    font-size: 0.875rem;
    opacity: 0.7;
  }
  
  .chenu-app__selection button {
    width: 100%;
    padding: 10px;
    background: #4a7c4a;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .chenu-app__selection button:hover {
    background: #5a8c5a;
  }
  
  .chenu-app__footer {
    grid-area: footer;
    padding: 16px 32px;
    border-top: 1px solid rgba(74, 124, 74, 0.2);
    text-align: center;
    font-size: 0.75rem;
    opacity: 0.5;
  }
`;

// Inject app styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('chenu-app-styles');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'chenu-app-styles';
    style.textContent = appStyles;
    document.head.appendChild(style);
  }
}

// ─────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────

export default App;
