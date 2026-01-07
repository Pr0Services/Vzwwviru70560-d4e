/**
 * CHE·NU™ - Mobile Bottom Navigation
 */
import React from 'react';
import { useHubs } from '../hubs/HubArchitecture';

export const MobileBottomNav: React.FC = () => {
  const { openNova, toggleHub } = useHubs();

  return (
    <nav className="mobile-bottom-nav" data-component="mobile-bottom-nav">
      <button 
        className="nav-item"
        onClick={() => toggleHub('navigation')}
        data-action="open-spheres"
      >
        <span className="icon">🎯</span>
        <span className="label">Spheres</span>
      </button>

      <button 
        className="nav-item"
        onClick={() => toggleHub('workspace')}
        data-action="open-workspace"
      >
        <span className="icon">📝</span>
        <span className="label">Workspace</span>
      </button>

      <button 
        className="nav-item primary"
        onClick={openNova}
        data-action="open-nova"
      >
        <span className="icon">✨</span>
        <span className="label">Nova</span>
      </button>

      <button 
        className="nav-item"
        data-action="quick-capture"
      >
        <span className="icon">⚡</span>
        <span className="label">Capture</span>
      </button>

      <button 
        className="nav-item"
        onClick={() => toggleHub('communication')}
        data-action="open-communication"
      >
        <span className="icon">💬</span>
        <span className="label">Chat</span>
      </button>
    </nav>
  );
};
