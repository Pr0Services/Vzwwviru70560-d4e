/**
 * CHE·NU™ - MOBILE 3-TAB NAVIGATION
 * Tab 1: Communications (Nova + Agents)
 * Tab 2: Navigation Hub (Dashboard + Sphères)
 * Tab 3: CHE·NU Browser (Workspace + Documents)
 */

import React, { useState, useCallback } from 'react';
import { SphereId, SPHERES, BUREAU_SECTIONS } from '../../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type MobileTab = 'communications' | 'hub' | 'browser';

interface MobileShellProps {
  activeSphere: SphereId;
  onSphereChange: (sphereId: SphereId) => void;
  children?: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════════
// TAB 1: COMMUNICATIONS
// ═══════════════════════════════════════════════════════════════

interface CommunicationsTabProps {
  activeSphere: SphereId;
}

const CommunicationsTab: React.FC<CommunicationsTabProps> = ({ activeSphere }) => {
  const [activeView, setActiveView] = useState<'nova' | 'agents' | 'calls'>('nova');
  const sphere = SPHERES[activeSphere];

  return (
    <div className="tab-content communications-tab">
      {/* View Selector */}
      <div className="view-selector">
        <button
          className={`view-btn ${activeView === 'nova' ? 'active' : ''}`}
          onClick={() => setActiveView('nova')}
        >
          <span className="icon">✧</span>
          <span>Nova</span>
        </button>
        <button
          className={`view-btn ${activeView === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveView('agents')}
        >
          <span className="icon">🤖</span>
          <span>Agents</span>
        </button>
        <button
          className={`view-btn ${activeView === 'calls' ? 'active' : ''}`}
          onClick={() => setActiveView('calls')}
        >
          <span className="icon">📞</span>
          <span>Calls</span>
        </button>
      </div>

      {/* Content */}
      <div className="view-content">
        {activeView === 'nova' && (
          <div className="nova-chat-mobile">
            <div className="chat-header">
              <div className="nova-avatar">✧</div>
              <div className="nova-info">
                <h3>Nova</h3>
                <span className="context">{sphere.icon} {sphere.name}</span>
              </div>
            </div>
            <div className="chat-messages">
              <div className="message nova">
                <p>Hello! I'm Nova. How can I help you in {sphere.name} today?</p>
              </div>
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Ask Nova anything..." />
              <button className="send-btn">→</button>
            </div>
          </div>
        )}

        {activeView === 'agents' && (
          <div className="agents-list-mobile">
            <h3>Available Agents</h3>
            {sphere.defaultAgents.map((agent, i) => (
              <div key={i} className="agent-card">
                <span className="agent-icon">🤖</span>
                <div className="agent-info">
                  <span className="agent-name">{agent}</span>
                  <span className="agent-status">Active</span>
                </div>
                <button className="agent-action">Chat</button>
              </div>
            ))}
          </div>
        )}

        {activeView === 'calls' && (
          <div className="calls-view">
            <div className="no-calls">
              <span className="icon">📞</span>
              <p>No recent calls</p>
              <button className="start-call-btn">Start a Call</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .communications-tab {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .view-selector {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          background: #111;
          border-bottom: 1px solid #222;
        }

        .view-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: #888;
          cursor: pointer;
        }

        .view-btn.active {
          background: rgba(216, 178, 106, 0.15);
          color: #D8B26A;
        }

        .view-btn .icon {
          font-size: 20px;
        }

        .view-btn span:last-child {
          font-size: 11px;
        }

        .view-content {
          flex: 1;
          overflow-y: auto;
        }

        .nova-chat-mobile {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #111;
          border-bottom: 1px solid #222;
        }

        .nova-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D8B26A, #7A593A);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #1a1a1a;
        }

        .nova-info h3 {
          margin: 0;
          color: #D8B26A;
        }

        .context {
          font-size: 12px;
          color: #666;
        }

        .chat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }

        .message {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 16px;
          margin-bottom: 12px;
        }

        .message.nova {
          background: #1f1f1f;
          border-top-left-radius: 4px;
        }

        .message p {
          margin: 0;
          color: #ddd;
          font-size: 14px;
        }

        .chat-input {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          background: #111;
          border-top: 1px solid #222;
        }

        .chat-input input {
          flex: 1;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 24px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
        }

        .send-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #D8B26A;
          border: none;
          color: #1a1a1a;
          font-size: 18px;
          cursor: pointer;
        }

        .agents-list-mobile {
          padding: 16px;
        }

        .agents-list-mobile h3 {
          color: #888;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .agent-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #1a1a1a;
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .agent-icon {
          font-size: 24px;
        }

        .agent-info {
          flex: 1;
        }

        .agent-name {
          display: block;
          color: #fff;
          font-size: 14px;
        }

        .agent-status {
          font-size: 11px;
          color: #3F7249;
        }

        .agent-action {
          padding: 8px 16px;
          background: rgba(216, 178, 106, 0.2);
          border: none;
          border-radius: 20px;
          color: #D8B26A;
          font-size: 12px;
          cursor: pointer;
        }

        .calls-view {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .no-calls {
          text-align: center;
          color: #666;
        }

        .no-calls .icon {
          font-size: 48px;
          opacity: 0.3;
        }

        .start-call-btn {
          margin-top: 16px;
          padding: 12px 24px;
          background: #D8B26A;
          border: none;
          border-radius: 24px;
          color: #1a1a1a;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TAB 2: NAVIGATION HUB
// ═══════════════════════════════════════════════════════════════

interface NavigationHubTabProps {
  activeSphere: SphereId;
  onSphereChange: (sphereId: SphereId) => void;
}

const NavigationHubTab: React.FC<NavigationHubTabProps> = ({ activeSphere, onSphereChange }) => {
  const spheres = Object.values(SPHERES);
  const currentSphere = SPHERES[activeSphere];

  return (
    <div className="tab-content hub-tab">
      {/* Current Sphere Header */}
      <div className="current-sphere" style={{ borderColor: currentSphere.color }}>
        <span className="sphere-icon">{currentSphere.icon}</span>
        <div className="sphere-info">
          <h2>{currentSphere.name}</h2>
          <p>{currentSphere.description}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          {BUREAU_SECTIONS.slice(0, 6).map((section) => (
            <button key={section.id} className="action-btn">
              <span className="icon">{section.icon}</span>
              <span>{section.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* All Spheres */}
      <div className="spheres-section">
        <h3>All Spheres</h3>
        <div className="spheres-grid">
          {spheres.map((sphere) => (
            <button
              key={sphere.id}
              className={`sphere-card ${activeSphere === sphere.id ? 'active' : ''}`}
              onClick={() => onSphereChange(sphere.id)}
              style={{ borderColor: sphere.color }}
            >
              <span className="sphere-icon">{sphere.icon}</span>
              <span className="sphere-name">{sphere.name}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .hub-tab {
          padding: 16px;
          overflow-y: auto;
        }

        .current-sphere {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #111;
          border-radius: 16px;
          border-left: 4px solid;
          margin-bottom: 24px;
        }

        .current-sphere .sphere-icon {
          font-size: 40px;
        }

        .sphere-info h2 {
          margin: 0 0 4px;
          color: #fff;
        }

        .sphere-info p {
          margin: 0;
          color: #888;
          font-size: 13px;
        }

        .quick-actions h3,
        .spheres-section h3 {
          color: #888;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          background: #1a1a1a;
          border: none;
          border-radius: 12px;
          color: #ccc;
          cursor: pointer;
        }

        .action-btn .icon {
          font-size: 24px;
        }

        .action-btn span:last-child {
          font-size: 11px;
        }

        .spheres-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .sphere-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #1a1a1a;
          border: 2px solid transparent;
          border-radius: 12px;
          color: #ccc;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sphere-card.active {
          background: rgba(255, 255, 255, 0.05);
        }

        .sphere-card .sphere-icon {
          font-size: 24px;
        }

        .sphere-card .sphere-name {
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TAB 3: BROWSER
// ═══════════════════════════════════════════════════════════════

interface BrowserTabProps {
  activeSphere: SphereId;
}

const BrowserTab: React.FC<BrowserTabProps> = ({ activeSphere }) => {
  const [url, setUrl] = useState(`chenu://${activeSphere}/dashboard`);
  const sphere = SPHERES[activeSphere];

  return (
    <div className="tab-content browser-tab">
      {/* Address Bar */}
      <div className="address-bar">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="url-input"
        />
        <button className="go-btn">→</button>
      </div>

      {/* Browser Content */}
      <div className="browser-content">
        <div className="workspace-view">
          <h2>{sphere.icon} {sphere.name} Workspace</h2>
          
          <div className="recent-items">
            <h3>Recent</h3>
            <div className="item">📄 Q4 Report Draft</div>
            <div className="item">📝 Meeting Notes - Dec 15</div>
            <div className="item">📊 Analytics Dashboard</div>
          </div>

          <div className="favorites">
            <h3>Favorites</h3>
            <div className="item">⭐ Important Project</div>
            <div className="item">⭐ Key Contacts</div>
          </div>
        </div>
      </div>

      <style>{`
        .browser-tab {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .address-bar {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          background: #111;
          border-bottom: 1px solid #222;
        }

        .url-input {
          flex: 1;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 10px 14px;
          color: #3EB4A2;
          font-family: monospace;
          font-size: 13px;
        }

        .go-btn {
          width: 40px;
          background: #333;
          border: none;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
        }

        .browser-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .workspace-view h2 {
          color: #fff;
          margin-bottom: 24px;
        }

        .recent-items,
        .favorites {
          margin-bottom: 24px;
        }

        .recent-items h3,
        .favorites h3 {
          color: #888;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .item {
          padding: 12px 16px;
          background: #1a1a1a;
          border-radius: 8px;
          margin-bottom: 8px;
          color: #ccc;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN MOBILE SHELL
// ═══════════════════════════════════════════════════════════════

export const MobileShell: React.FC<MobileShellProps> = ({
  activeSphere,
  onSphereChange,
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('hub');

  const renderTab = () => {
    switch (activeTab) {
      case 'communications':
        return <CommunicationsTab activeSphere={activeSphere} />;
      case 'hub':
        return <NavigationHubTab activeSphere={activeSphere} onSphereChange={onSphereChange} />;
      case 'browser':
        return <BrowserTab activeSphere={activeSphere} />;
    }
  };

  return (
    <div className="mobile-shell">
      {/* Tab Content */}
      <div className="tab-container">
        {renderTab()}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'communications' ? 'active' : ''}`}
          onClick={() => setActiveTab('communications')}
        >
          <span className="icon">💬</span>
          <span className="label">Comms</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'hub' ? 'active' : ''}`}
          onClick={() => setActiveTab('hub')}
        >
          <span className="icon">🏠</span>
          <span className="label">Hub</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'browser' ? 'active' : ''}`}
          onClick={() => setActiveTab('browser')}
        >
          <span className="icon">🌐</span>
          <span className="label">Browser</span>
        </button>
      </nav>

      <style>{`
        .mobile-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #0a0a0a;
          color: #fff;
        }

        .tab-container {
          flex: 1;
          overflow: hidden;
        }

        .tab-content {
          height: 100%;
        }

        .tab-bar {
          display: flex;
          background: #111;
          border-top: 1px solid #222;
          padding: 8px 0;
          padding-bottom: env(safe-area-inset-bottom, 8px);
        }

        .tab-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px;
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          transition: color 0.2s;
        }

        .tab-btn.active {
          color: #D8B26A;
        }

        .tab-btn .icon {
          font-size: 22px;
        }

        .tab-btn .label {
          font-size: 10px;
        }
      `}</style>
    </div>
  );
};

export default MobileShell;
