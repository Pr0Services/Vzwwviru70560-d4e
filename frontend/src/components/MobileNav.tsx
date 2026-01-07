/**
 * CHE·NU™ - Mobile Navigation Component
 */
import React, { useState } from 'react';
import { useSphereStore } from '../stores/sphere.store';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { spheres, activeSphere, setActiveSphere } = useSphereStore();
  const [activeTab, setActiveTab] = useState<'spheres' | 'menu'>('spheres');

  const sphereIcons: Record<string, string> = {
    personal: '🏠',
    business: '💼',
    government: '🏛️',
    studio: '🎨',
    community: '👥',
    social: '📱',
    entertainment: '🎬',
    myteam: '🤝',
    scholar: '📚'
  };

  return (
    <div 
      className={`mobile-nav ${isOpen ? 'open' : ''}`}
      data-component="mobile-nav"
    >
      <div className="mobile-nav-header">
        <div className="tabs">
          <button 
            className={activeTab === 'spheres' ? 'active' : ''}
            onClick={() => setActiveTab('spheres')}
          >
            Spheres
          </button>
          <button 
            className={activeTab === 'menu' ? 'active' : ''}
            onClick={() => setActiveTab('menu')}
          >
            Menu
          </button>
        </div>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      <div className="mobile-nav-content">
        {activeTab === 'spheres' && (
          <div className="sphere-grid">
            {spheres.map((sphere) => (
              <button
                key={sphere}
                className={`sphere-card ${activeSphere === sphere ? 'active' : ''}`}
                onClick={() => {
                  setActiveSphere(sphere);
                  onClose();
                }}
                data-sphere={sphere}
              >
                <span className="sphere-icon">{sphereIcons[sphere]}</span>
                <span className="sphere-name">{sphere}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="menu-items">
            <button className="menu-item" data-action="quick-capture">
              ⚡ Quick Capture
            </button>
            <button className="menu-item">
              🤖 Active Agents
            </button>
            <button className="menu-item">
              💬 Threads
            </button>
            <button className="menu-item">
              📅 Meetings
            </button>
            <button className="menu-item">
              ⚙️ Settings
            </button>
            <button className="menu-item">
              👤 Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
