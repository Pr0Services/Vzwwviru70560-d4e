/**
 * CHE·NU™ - DIAMOND LAYOUT
 * The iconic diamond-shaped navigation interface
 * Central to the CHE·NU user experience
 * 
 * Layout:
 *           [Overview]
 *    [Notif]    ◇    [Account]
 *           [Logo]
 *    [Comm]          [Workspace]
 *           [Spheres]
 */

import React, { useState } from 'react';
import { useSphere } from '../../contexts/SphereContext';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type DiamondPosition = 
  | 'top'      // Overview/Dashboard
  | 'top-left'  // Notifications
  | 'top-right' // My Account
  | 'center'    // CHE·NU Logo
  | 'left'      // Communication/Meeting
  | 'right'     // Workspace Navigation
  | 'bottom';   // Spheres

interface DiamondLayoutProps {
  onNavigate?: (position: DiamondPosition) => void;
  isOverlay?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// DIAMOND LAYOUT COMPONENT
// ═══════════════════════════════════════════════════════════════

export const DiamondLayout: React.FC<DiamondLayoutProps> = ({
  onNavigate,
  isOverlay = false
}) => {
  const [activePosition, setActivePosition] = useState<DiamondPosition | null>(null);
  const { activeSphere, toggleSphereMenu } = useSphere();

  const handleClick = (position: DiamondPosition) => {
    setActivePosition(position);
    if (position === 'bottom') {
      toggleSphereMenu();
    }
    onNavigate?.(position);
  };

  return (
    <div 
      className="diamond-layout"
      style={{
        position: isOverlay ? 'fixed' : 'relative',
        top: isOverlay ? '50%' : 'auto',
        left: isOverlay ? '50%' : 'auto',
        transform: isOverlay ? 'translate(-50%, -50%)' : 'none',
        width: '320px',
        height: '320px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: isOverlay ? 1000 : 1
      }}
    >
      {/* Top Row */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginBottom: '12px'
      }}>
        <DiamondNode
          position="top"
          icon="📊"
          label="Overview"
          isActive={activePosition === 'top'}
          onClick={() => handleClick('top')}
        />
      </div>

      {/* Middle Row (3 items) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '40px',
        marginBottom: '12px'
      }}>
        <DiamondNode
          position="top-left"
          icon="🔔"
          label="Notif"
          isActive={activePosition === 'top-left'}
          onClick={() => handleClick('top-left')}
          size="small"
        />
        
        {/* Center Logo */}
        <div 
          onClick={() => handleClick('center')}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: `linear-gradient(135deg, #D8B26A, ${activeSphere.color})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: `0 0 30px ${activeSphere.color}40`,
            transition: 'all 0.3s ease',
            transform: 'rotate(45deg)'
          }}
        >
          <span style={{ 
            transform: 'rotate(-45deg)',
            fontSize: '24px',
            fontWeight: 700,
            color: '#000'
          }}>
            C·N
          </span>
        </div>
        
        <DiamondNode
          position="top-right"
          icon="👤"
          label="Account"
          isActive={activePosition === 'top-right'}
          onClick={() => handleClick('top-right')}
          size="small"
        />
      </div>

      {/* Lower Middle Row */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '80px',
        marginBottom: '12px'
      }}>
        <DiamondNode
          position="left"
          icon="💬"
          label="Comm"
          isActive={activePosition === 'left'}
          onClick={() => handleClick('left')}
        />
        
        <DiamondNode
          position="right"
          icon="🗂️"
          label="Workspace"
          isActive={activePosition === 'right'}
          onClick={() => handleClick('right')}
        />
      </div>

      {/* Bottom Row */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginTop: '12px'
      }}>
        <DiamondNode
          position="bottom"
          icon={activeSphere.icon}
          label="Spheres"
          isActive={activePosition === 'bottom'}
          onClick={() => handleClick('bottom')}
          color={activeSphere.color}
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DIAMOND NODE
// ═══════════════════════════════════════════════════════════════

interface DiamondNodeProps {
  position: DiamondPosition;
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const DiamondNode: React.FC<DiamondNodeProps> = ({
  position,
  icon,
  label,
  isActive,
  onClick,
  size = 'medium',
  color = '#D8B26A'
}) => {
  const sizes = {
    small: { button: 48, icon: 18, label: 10 },
    medium: { button: 60, icon: 22, label: 11 },
    large: { button: 72, icon: 26, label: 12 }
  };
  
  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      style={{
        width: s.button,
        height: s.button,
        borderRadius: '16px',
        backgroundColor: isActive ? `${color}30` : '#111',
        border: isActive ? `2px solid ${color}` : '2px solid #222',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        transition: 'all 0.2s ease',
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
        boxShadow: isActive ? `0 0 20px ${color}40` : 'none'
      }}
    >
      <span style={{ fontSize: s.icon }}>{icon}</span>
      <span style={{ 
        fontSize: s.label, 
        color: isActive ? '#fff' : '#666',
        fontWeight: 500
      }}>
        {label}
      </span>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// DIAMOND MINI (Collapsed Version)
// ═══════════════════════════════════════════════════════════════

interface DiamondMiniProps {
  onClick: () => void;
}

export const DiamondMini: React.FC<DiamondMiniProps> = ({ onClick }) => {
  const { activeSphere } = useSphere();

  return (
    <button
      onClick={onClick}
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `linear-gradient(135deg, #D8B26A, ${activeSphere.color})`,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s ease',
        transform: 'rotate(45deg)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'rotate(45deg) scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'rotate(45deg) scale(1)';
      }}
    >
      <span style={{ 
        transform: 'rotate(-45deg)',
        fontSize: '16px',
        fontWeight: 700,
        color: '#000'
      }}>
        ◇
      </span>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// DIAMOND OVERLAY (Modal Version)
// ═══════════════════════════════════════════════════════════════

interface DiamondOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (position: DiamondPosition) => void;
}

export const DiamondOverlay: React.FC<DiamondOverlayProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <DiamondLayout 
          onNavigate={(position) => {
            onNavigate(position);
            if (position !== 'bottom') {
              onClose();
            }
          }}
        />
      </div>
      
      {/* Close hint */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        color: '#666',
        fontSize: '14px'
      }}>
        Click outside or press ESC to close
      </div>
    </div>
  );
};

export default DiamondLayout;
