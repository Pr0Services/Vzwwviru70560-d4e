/**
 * CHE·NU™ - APP SHELL
 * The main application shell that integrates all navigation
 * and provides the core layout structure
 */

import React, { useState } from 'react';
import { SphereProvider, useSphere } from '../contexts/SphereContext';
import { SphereSelector } from '../components/navigation/SphereSelector';
import { SpherePage } from '../pages/spheres/SpherePage';
import { DiamondMini, DiamondOverlay } from '../components/diamond/DiamondLayout';
import { NovaOverlay } from '../components/core/NovaOverlay';

// ═══════════════════════════════════════════════════════════════
// APP SHELL COMPONENT
// ═══════════════════════════════════════════════════════════════

export const AppShell: React.FC = () => {
  return (
    <SphereProvider>
      <AppContent />
    </SphereProvider>
  );
};

// ═══════════════════════════════════════════════════════════════
// APP CONTENT (Inside Provider)
// ═══════════════════════════════════════════════════════════════

const AppContent: React.FC = () => {
  const [sphereSelectorCollapsed, setSphereSelectorCollapsed] = useState(false);
  const [isDiamondOpen, setIsDiamondOpen] = useState(false);
  const { activeSphereId, navigateTo } = useSphere();

  const handleDiamondNavigate = (position: string) => {
    switch (position) {
      case 'top':
        // Navigate to dashboard of current sphere
        navigateTo(activeSphereId, 'dashboard');
        break;
      case 'left':
        // Navigate to meetings (communication)
        navigateTo(activeSphereId, 'meetings');
        break;
      case 'right':
        // Navigate to threads (workspace)
        navigateTo(activeSphereId, 'threads');
        break;
      default:
        break;
    }
    setIsDiamondOpen(false);
  };

  return (
    <div 
      className="app-shell"
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff'
      }}
    >
      {/* Sphere Selector Sidebar */}
      <SphereSelector 
        collapsed={sphereSelectorCollapsed}
        onToggle={() => setSphereSelectorCollapsed(!sphereSelectorCollapsed)}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <TopBar onDiamondClick={() => setIsDiamondOpen(true)} />
        
        {/* Sphere Page */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <SpherePage sphereId={activeSphereId} />
        </div>
      </div>

      {/* Diamond Overlay */}
      <DiamondOverlay
        isOpen={isDiamondOpen}
        onClose={() => setIsDiamondOpen(false)}
        onNavigate={handleDiamondNavigate}
      />

      {/* Nova Overlay - Always Accessible */}
      <NovaOverlay />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TOP BAR
// ═══════════════════════════════════════════════════════════════

interface TopBarProps {
  onDiamondClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onDiamondClick }) => {
  const { activeSphere, activeSection } = useSphere();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: '#0f0f0f',
      borderBottom: '1px solid #1a1a1a'
    }}>
      {/* Breadcrumb */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px'
      }}>
        <span style={{ color: activeSphere.color }}>
          {activeSphere.icon} {activeSphere.name}
        </span>
        <span style={{ color: '#333' }}>/</span>
        <span style={{ color: '#888' }}>
          {activeSection.icon} {activeSection.name}
        </span>
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Quick Actions */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
      }}>
        {/* Search */}
        <button style={{
          padding: '8px 16px',
          backgroundColor: '#111',
          border: '1px solid #222',
          borderRadius: '8px',
          color: '#666',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px'
        }}>
          <span>🔍</span>
          <span>Search</span>
          <span style={{ 
            padding: '2px 6px', 
            backgroundColor: '#1a1a1a', 
            borderRadius: '4px',
            fontSize: '11px'
          }}>
            ⌘K
          </span>
        </button>

        {/* Diamond Mini */}
        <DiamondMini onClick={onDiamondClick} />

        {/* Notifications */}
        <button style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#111',
          border: '1px solid #222',
          borderRadius: '10px',
          color: '#888',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          position: 'relative'
        }}>
          🔔
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: '#E74C3C',
            borderRadius: '50%'
          }} />
        </button>

        {/* User */}
        <button style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#D8B26A20',
          border: '1px solid #D8B26A40',
          borderRadius: '10px',
          color: '#D8B26A',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 600
        }}>
          J
        </button>
      </div>
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default AppShell;
