/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — MOBILE NAVIGATION
 * Phase 9: Mobile & PWA
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';

interface NavItem {
  icon: string;
  label: string;
  path: string;
  badge?: number;
}

export const MobileNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const navItems: NavItem[] = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🧵', label: 'Threads', path: '/threads', badge: 3 },
    { icon: '🤖', label: 'Agents', path: '/agents' },
    { icon: '📊', label: 'Analytics', path: '/analytics' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => (
        <button
          key={item.label}
          className={`nav-item ${activeTab === item.label.toLowerCase() ? 'active' : ''}`}
          onClick={() => setActiveTab(item.label.toLowerCase())}
        >
          <span className="nav-icon">
            {item.icon}
            {item.badge && <span className="badge">{item.badge}</span>}
          </span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}

      <style jsx>{`
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e9e4d6;
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          z-index: 1000;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
          max-width: 80px;
        }

        .nav-item.active .nav-icon {
          color: #d8b26a;
          transform: scale(1.1);
        }

        .nav-item.active .nav-label {
          color: #d8b26a;
          font-weight: 600;
        }

        .nav-icon {
          font-size: 24px;
          position: relative;
          transition: all 0.2s;
        }

        .badge {
          position: absolute;
          top: -4px;
          right: -8px;
          background: #e74c3c;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .nav-label {
          font-size: 11px;
          color: #8d8371;
          transition: all 0.2s;
        }

        @media (min-width: 768px) {
          .mobile-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};
