/**
 * CHE·NU™ - SPHERE SELECTOR
 * Main navigation component for switching between the 8 Spheres
 * Can be displayed as sidebar, dropdown, or grid
 */

import React, { useState } from 'react';
import { 
  SphereId, 
  Sphere,
  SPHERES,
  getAllSpheres 
} from '../../constants/spheres';
import { useSphere } from '../../contexts/SphereContext';

// ═══════════════════════════════════════════════════════════════
// SPHERE SELECTOR - SIDEBAR VERSION
// ═══════════════════════════════════════════════════════════════

interface SphereSelectorProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const SphereSelector: React.FC<SphereSelectorProps> = ({
  collapsed = false,
  onToggle
}) => {
  const { activeSphereId, setSphere, spheres } = useSphere();

  return (
    <nav 
      className="sphere-selector"
      style={{
        width: collapsed ? '72px' : '200px',
        backgroundColor: '#0a0a0a',
        borderRight: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        height: '100vh'
      }}
    >
      {/* Logo */}
      <div 
        onClick={onToggle}
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '12px',
          cursor: 'pointer',
          borderBottom: '1px solid #1a1a1a'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #D8B26A, #3EB4A2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '14px'
        }}>
          C·N
        </div>
        {!collapsed && (
          <span style={{ 
            fontWeight: 600, 
            fontSize: '18px',
            background: 'linear-gradient(90deg, #D8B26A, #3EB4A2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CHE·NU
          </span>
        )}
      </div>

      {/* Spheres List */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '12px 8px'
      }}>
        {!collapsed && (
          <div style={{
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: '#444',
            padding: '8px 12px',
            marginBottom: '4px'
          }}>
            Spheres
          </div>
        )}
        
        {spheres.map((sphere) => (
          <SphereItem
            key={sphere.id}
            sphere={sphere}
            isActive={activeSphereId === sphere.id}
            onClick={() => setSphere(sphere.id)}
            collapsed={collapsed}
          />
        ))}
      </div>

      {/* Bottom Actions */}
      <div style={{
        padding: '12px 8px',
        borderTop: '1px solid #1a1a1a'
      }}>
        <button
          style={{
            width: '100%',
            padding: collapsed ? '12px' : '10px 16px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#888',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '10px',
            fontSize: '14px'
          }}
        >
          <span>⚙️</span>
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════════
// SPHERE ITEM
// ═══════════════════════════════════════════════════════════════

interface SphereItemProps {
  sphere: Sphere;
  isActive: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const SphereItem: React.FC<SphereItemProps> = ({
  sphere,
  isActive,
  onClick,
  collapsed
}) => (
  <button
    onClick={onClick}
    title={collapsed ? sphere.name : undefined}
    style={{
      width: '100%',
      padding: collapsed ? '14px' : '12px 16px',
      marginBottom: '4px',
      backgroundColor: isActive ? `${sphere.color}15` : 'transparent',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      textAlign: 'left',
      color: isActive ? '#fff' : '#666',
      transition: 'all 0.15s ease',
      justifyContent: collapsed ? 'center' : 'flex-start',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      if (!isActive) {
        e.currentTarget.style.backgroundColor = '#111';
        e.currentTarget.style.color = '#aaa';
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#666';
      }
    }}
  >
    {/* Active Indicator */}
    {isActive && (
      <div style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '4px',
        height: '28px',
        backgroundColor: sphere.color,
        borderRadius: '0 4px 4px 0'
      }} />
    )}
    
    {/* Icon */}
    <span style={{ 
      fontSize: '22px',
      filter: isActive ? 'none' : 'grayscale(50%)'
    }}>
      {sphere.icon}
    </span>
    
    {/* Name */}
    {!collapsed && (
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ 
          fontWeight: isActive ? 600 : 400,
          fontSize: '14px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {sphere.name}
        </div>
        {isActive && (
          <div style={{
            fontSize: '11px',
            color: sphere.color,
            marginTop: '2px'
          }}>
            Active
          </div>
        )}
      </div>
    )}
    
    {/* Active Dot */}
    {!collapsed && isActive && (
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: sphere.color,
        boxShadow: `0 0 8px ${sphere.color}`
      }} />
    )}
  </button>
);

// ═══════════════════════════════════════════════════════════════
// SPHERE GRID (Alternative Layout)
// ═══════════════════════════════════════════════════════════════

interface SphereGridProps {
  onSelect: (sphereId: SphereId) => void;
}

export const SphereGrid: React.FC<SphereGridProps> = ({ onSelect }) => {
  const { activeSphereId, spheres } = useSphere();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      padding: '24px'
    }}>
      {spheres.map((sphere) => (
        <button
          key={sphere.id}
          onClick={() => onSelect(sphere.id)}
          style={{
            padding: '24px 16px',
            backgroundColor: activeSphereId === sphere.id ? `${sphere.color}20` : '#111',
            border: activeSphereId === sphere.id ? `2px solid ${sphere.color}` : '2px solid #222',
            borderRadius: '16px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s ease',
            color: activeSphereId === sphere.id ? '#fff' : '#888'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 8px 24px ${sphere.color}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span style={{ fontSize: '36px' }}>{sphere.icon}</span>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>{sphere.name}</span>
        </button>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SPHERE DROPDOWN (Mobile/Compact)
// ═══════════════════════════════════════════════════════════════

export const SphereDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeSphere, activeSphereId, setSphere, spheres } = useSphere();

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '10px 16px',
          backgroundColor: `${activeSphere.color}15`,
          border: `1px solid ${activeSphere.color}40`,
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#fff'
        }}
      >
        <span style={{ fontSize: '20px' }}>{activeSphere.icon}</span>
        <span style={{ fontWeight: 500 }}>{activeSphere.name}</span>
        <span style={{ marginLeft: '8px', color: '#666' }}>▼</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            backgroundColor: '#111',
            border: '1px solid #222',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 1000
          }}
        >
          {spheres.map((sphere) => (
            <button
              key={sphere.id}
              onClick={() => {
                setSphere(sphere.id);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: activeSphereId === sphere.id ? `${sphere.color}15` : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: activeSphereId === sphere.id ? '#fff' : '#888',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '18px' }}>{sphere.icon}</span>
              <span>{sphere.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SphereSelector;
