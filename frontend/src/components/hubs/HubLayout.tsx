/**
 * CHE·NU™ - HUB LAYOUT
 * 
 * COMPLIANCE CHECKLIST COMPLIANT (v1-freeze)
 * 
 * 3-Hub Layout:
 * - Communication Hub (left)
 * - Workspace Hub (center)
 * - Navigation Hub (bottom)
 * 
 * Max 2 visible at once
 * Nova always accessible (floating)
 */

import React from 'react';
import { useHubStore, useVisibleHubs, useNovaState } from '../../stores/hubStore';
import { HUBS, HubId } from '../../config/hubs.config';

// ═══════════════════════════════════════════════════════════════
// NOVA FLOATING BUTTON (Always Accessible)
// ═══════════════════════════════════════════════════════════════

const NovaFloatingButton: React.FC = () => {
  const { open, minimized } = useNovaState();
  const { toggleNova, openNova } = useHubStore();

  return (
    <button 
      className={`nova-floating-btn ${open ? 'active' : ''} ${minimized ? 'minimized' : ''}`}
      onClick={toggleNova}
      title="Nova - Always accessible"
    >
      <span className="nova-icon">✧</span>
      {!minimized && <span className="nova-label">Nova</span>}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// HUB TOGGLE BAR
// ═══════════════════════════════════════════════════════════════

const HubToggleBar: React.FC = () => {
  const visibleHubs = useVisibleHubs();
  const { toggleHub, showCommunicationWorkspace, showNavigationWorkspace } = useHubStore();

  return (
    <div className="hub-toggle-bar">
      {Object.values(HUBS).map((hub) => (
        <button
          key={hub.id}
          className={`hub-toggle ${visibleHubs.includes(hub.id) ? 'active' : ''}`}
          onClick={() => toggleHub(hub.id)}
          title={hub.description}
        >
          <span className="hub-icon">{hub.icon}</span>
          <span className="hub-name">{hub.name}</span>
        </button>
      ))}
      
      <div className="hub-presets">
        <button onClick={showCommunicationWorkspace} title="Chat + Work">
          💬📝
        </button>
        <button onClick={showNavigationWorkspace} title="Nav + Work">
          🧭📝
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HUB PANEL
// ═══════════════════════════════════════════════════════════════

interface HubPanelProps {
  hubId: HubId;
  children?: React.ReactNode;
}

const HubPanel: React.FC<HubPanelProps> = ({ hubId, children }) => {
  const hub = HUBS[hubId];
  const { expandHub, hideHub } = useHubStore();
  const expanded = useHubStore((s) => s.expandedHub === hubId);

  return (
    <div className={`hub-panel hub-${hubId} ${expanded ? 'expanded' : ''}`}>
      <header className="hub-header">
        <div className="hub-title">
          <span className="hub-icon">{hub.icon}</span>
          <h2>{hub.name}</h2>
        </div>
        <div className="hub-actions">
          <button onClick={() => expandHub(expanded ? null : hubId)} title="Expand">
            {expanded ? '⊟' : '⊞'}
          </button>
          {hub.isCollapsible && (
            <button onClick={() => hideHub(hubId)} title="Close">✕</button>
          )}
        </div>
      </header>
      <div className="hub-content">
        {children}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN HUB LAYOUT
// ═══════════════════════════════════════════════════════════════

interface HubLayoutProps {
  communicationContent?: React.ReactNode;
  navigationContent?: React.ReactNode;
  workspaceContent?: React.ReactNode;
}

export const HubLayout: React.FC<HubLayoutProps> = ({
  communicationContent,
  navigationContent,
  workspaceContent,
}) => {
  const visibleHubs = useVisibleHubs();
  const expandedHub = useHubStore((s) => s.expandedHub);
  const { novaOpen } = useNovaState();

  // Calculate layout based on visible hubs
  const hasComm = visibleHubs.includes('communication');
  const hasNav = visibleHubs.includes('navigation');
  const hasWork = visibleHubs.includes('workspace');

  const layoutClass = [
    hasComm && 'with-communication',
    hasNav && 'with-navigation',
    hasWork && 'with-workspace',
    expandedHub && `expanded-${expandedHub}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={`hub-layout ${layoutClass}`}>
      {/* Hub Toggle Bar */}
      <HubToggleBar />

      {/* Hub Panels */}
      <div className="hub-panels">
        {hasComm && (
          <HubPanel hubId="communication">
            {communicationContent || (
              <div className="hub-placeholder">
                <p>💬 Communication Hub</p>
                <ul>
                  <li>Nova Chat</li>
                  <li>Active Threads</li>
                  <li>Notifications</li>
                </ul>
              </div>
            )}
          </HubPanel>
        )}

        {hasWork && (
          <HubPanel hubId="workspace">
            {workspaceContent || (
              <div className="hub-placeholder">
                <p>📝 Workspace Hub</p>
                <ul>
                  <li>Create</li>
                  <li>Transform</li>
                  <li>Version</li>
                </ul>
              </div>
            )}
          </HubPanel>
        )}

        {hasNav && (
          <HubPanel hubId="navigation">
            {navigationContent || (
              <div className="hub-placeholder">
                <p>🧭 Navigation Hub</p>
                <ul>
                  <li>8 Spheres</li>
                  <li>10 Bureau Sections</li>
                  <li>Search</li>
                </ul>
              </div>
            )}
          </HubPanel>
        )}
      </div>

      {/* Nova Floating (Always Accessible) */}
      <NovaFloatingButton />

      {/* Nova Panel (when open) */}
      {novaOpen && (
        <div className="nova-panel">
          <div className="nova-header">
            <span>✧ Nova</span>
            <button onClick={() => useHubStore.getState().closeNova()}>✕</button>
          </div>
          <div className="nova-content">
            <p>System Intelligence - Always at your service</p>
            <input type="text" placeholder="Ask Nova anything..." />
          </div>
        </div>
      )}

      <style>{`
        .hub-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #0a0a0a;
          position: relative;
        }

        /* Hub Toggle Bar */
        .hub-toggle-bar {
          display: flex;
          gap: 8px;
          padding: 12px 20px;
          background: #111;
          border-bottom: 1px solid #222;
        }

        .hub-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          cursor: pointer;
          transition: all 0.2s;
        }

        .hub-toggle:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ccc;
        }

        .hub-toggle.active {
          background: rgba(216, 178, 106, 0.1);
          border-color: rgba(216, 178, 106, 0.3);
          color: #D8B26A;
        }

        .hub-icon {
          font-size: 18px;
        }

        .hub-presets {
          margin-left: auto;
          display: flex;
          gap: 8px;
        }

        .hub-presets button {
          padding: 8px 12px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Hub Panels Container */
        .hub-panels {
          flex: 1;
          display: grid;
          gap: 1px;
          background: #222;
          overflow: hidden;
        }

        /* Layout variations */
        .with-communication.with-workspace .hub-panels {
          grid-template-columns: 320px 1fr;
        }

        .with-navigation.with-workspace .hub-panels {
          grid-template-columns: 1fr;
          grid-template-rows: 1fr 200px;
        }

        .with-communication.with-navigation .hub-panels {
          grid-template-columns: 320px 1fr;
        }

        /* Hub Panel */
        .hub-panel {
          background: #0d0d0d;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .hub-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #111;
          border-bottom: 1px solid #222;
        }

        .hub-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hub-title h2 {
          margin: 0;
          font-size: 14px;
          color: #ccc;
        }

        .hub-actions {
          display: flex;
          gap: 8px;
        }

        .hub-actions button {
          padding: 4px 8px;
          background: transparent;
          border: none;
          color: #666;
          cursor: pointer;
        }

        .hub-actions button:hover {
          color: #ccc;
        }

        .hub-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .hub-placeholder {
          color: #666;
          text-align: center;
          padding: 40px 20px;
        }

        .hub-placeholder p {
          font-size: 18px;
          margin-bottom: 16px;
        }

        .hub-placeholder ul {
          list-style: none;
          padding: 0;
        }

        .hub-placeholder li {
          margin: 8px 0;
        }

        /* Nova Floating Button */
        .nova-floating-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #D8B26A, #7A593A);
          border: none;
          border-radius: 50px;
          color: #1a1a1a;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(216, 178, 106, 0.3);
          transition: all 0.3s;
          z-index: 1000;
        }

        .nova-floating-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 30px rgba(216, 178, 106, 0.4);
        }

        .nova-floating-btn.active {
          background: #3EB4A2;
        }

        .nova-icon {
          font-size: 20px;
        }

        /* Nova Panel */
        .nova-panel {
          position: fixed;
          bottom: 80px;
          right: 24px;
          width: 360px;
          background: #111;
          border: 1px solid #333;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .nova-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: linear-gradient(135deg, rgba(216, 178, 106, 0.2), rgba(62, 180, 162, 0.2));
          border-bottom: 1px solid #333;
        }

        .nova-header span {
          font-size: 18px;
          font-weight: 600;
          color: #D8B26A;
        }

        .nova-header button {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 18px;
        }

        .nova-content {
          padding: 16px;
        }

        .nova-content p {
          color: #888;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .nova-content input {
          width: 100%;
          padding: 12px 16px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        /* Expanded state */
        .hub-panel.expanded {
          position: fixed;
          inset: 60px 20px 20px 20px;
          z-index: 100;
        }
      `}</style>
    </div>
  );
};

export default HubLayout;
