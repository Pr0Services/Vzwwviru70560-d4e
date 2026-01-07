/**
 * CHE·NU™ - DIAMOND LAYOUT
 * The signature losange (diamond) shaped navigation interface
 * Provides quick access to all major features from any screen
 */

import React, { useState, useCallback } from 'react';
import { SphereId, SPHERES, getAllSpheres } from '../../../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface DiamondLayoutProps {
  activeSphere: SphereId;
  onSphereChange: (sphereId: SphereId) => void;
  onOpenOverview: () => void;
  onOpenNotifications: () => void;
  onOpenAccount: () => void;
  onOpenWorkspace: () => void;
  onOpenCommunication: () => void;
  notificationCount?: number;
  isExpanded?: boolean;
}

interface DiamondButtonProps {
  position: 'top' | 'top-left' | 'top-right' | 'right' | 'bottom' | 'left';
  icon: string;
  label: string;
  onClick: () => void;
  badge?: number;
  isActive?: boolean;
  color?: string;
}

// ═══════════════════════════════════════════════════════════════
// DIAMOND BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════

const DiamondButton: React.FC<DiamondButtonProps> = ({
  position,
  icon,
  label,
  onClick,
  badge,
  isActive,
  color,
}) => {
  const positionStyles: Record<string, React.CSSProperties> = {
    'top': { top: 0, left: '50%', transform: 'translateX(-50%)' },
    'top-left': { top: '15%', left: '15%' },
    'top-right': { top: '15%', right: '15%' },
    'right': { top: '50%', right: 0, transform: 'translateY(-50%)' },
    'bottom': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
    'left': { top: '50%', left: 0, transform: 'translateY(-50%)' },
  };

  return (
    <button
      className={`diamond-btn diamond-btn-${position} ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        ...positionStyles[position],
        borderColor: isActive ? color : undefined,
      }}
      title={label}
    >
      <span className="diamond-btn-icon">{icon}</span>
      <span className="diamond-btn-label">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="diamond-btn-badge">{badge > 99 ? '99+' : badge}</span>
      )}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// SPHERE SELECTOR RING
// ═══════════════════════════════════════════════════════════════

interface SphereSelectorRingProps {
  activeSphere: SphereId;
  onSphereChange: (sphereId: SphereId) => void;
  isVisible: boolean;
}

const SphereSelectorRing: React.FC<SphereSelectorRingProps> = ({
  activeSphere,
  onSphereChange,
  isVisible,
}) => {
  const spheres = getAllSpheres();
  const angleStep = 360 / spheres.length;
  const radius = 120;

  return (
    <div className={`sphere-ring ${isVisible ? 'visible' : ''}`}>
      {spheres.map((sphere, index) => {
        const angle = (angleStep * index - 90) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isActive = sphere.id === activeSphere;

        return (
          <button
            key={sphere.id}
            className={`sphere-ring-item ${isActive ? 'active' : ''}`}
            onClick={() => onSphereChange(sphere.id)}
            style={{
              transform: `translate(${x}px, ${y}px)`,
              backgroundColor: isActive ? sphere.color : undefined,
              borderColor: sphere.color,
            }}
            title={sphere.name}
          >
            <span className="sphere-icon">{sphere.icon}</span>
          </button>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN DIAMOND LAYOUT
// ═══════════════════════════════════════════════════════════════

export const DiamondLayout: React.FC<DiamondLayoutProps> = ({
  activeSphere,
  onSphereChange,
  onOpenOverview,
  onOpenNotifications,
  onOpenAccount,
  onOpenWorkspace,
  onOpenCommunication,
  notificationCount = 0,
  isExpanded = false,
}) => {
  const [showSphereRing, setShowSphereRing] = useState(false);
  const currentSphere = SPHERES[activeSphere];

  const toggleSphereRing = useCallback(() => {
    setShowSphereRing((prev) => !prev);
  }, []);

  const handleSphereSelect = useCallback((sphereId: SphereId) => {
    onSphereChange(sphereId);
    setShowSphereRing(false);
  }, [onSphereChange]);

  return (
    <div className={`diamond-layout ${isExpanded ? 'expanded' : ''}`}>
      {/* Central Logo / Sphere Selector */}
      <button
        className="diamond-center"
        onClick={toggleSphereRing}
        style={{ borderColor: currentSphere.color }}
      >
        <span className="diamond-logo">CHE</span>
        <span className="diamond-logo-accent">NU</span>
        <span className="current-sphere-icon">{currentSphere.icon}</span>
      </button>

      {/* Sphere Selection Ring */}
      <SphereSelectorRing
        activeSphere={activeSphere}
        onSphereChange={handleSphereSelect}
        isVisible={showSphereRing}
      />

      {/* Diamond Navigation Points */}
      <DiamondButton
        position="top"
        icon="📊"
        label="Overview"
        onClick={onOpenOverview}
      />

      <DiamondButton
        position="top-left"
        icon="🔔"
        label="Notifications"
        onClick={onOpenNotifications}
        badge={notificationCount}
      />

      <DiamondButton
        position="top-right"
        icon="👤"
        label="My Account"
        onClick={onOpenAccount}
      />

      <DiamondButton
        position="right"
        icon="🗂️"
        label="Workspace"
        onClick={onOpenWorkspace}
      />

      <DiamondButton
        position="bottom"
        icon={currentSphere.icon}
        label="Spheres"
        onClick={toggleSphereRing}
        isActive={showSphereRing}
        color={currentSphere.color}
      />

      <DiamondButton
        position="left"
        icon="💬"
        label="Communication"
        onClick={onOpenCommunication}
      />

      <style>{`
        .diamond-layout {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          pointer-events: none;
          z-index: 1000;
          opacity: 0.9;
          transition: all 0.3s ease;
        }

        .diamond-layout.expanded {
          width: 400px;
          height: 400px;
        }

        .diamond-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1E1F22 0%, #2a2b2e 100%);
          border: 3px solid #D8B26A;
          cursor: pointer;
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .diamond-center:hover {
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow: 0 6px 30px rgba(216, 178, 106, 0.3);
        }

        .diamond-logo {
          font-size: 16px;
          font-weight: 700;
          color: #D8B26A;
          letter-spacing: 2px;
        }

        .diamond-logo-accent {
          font-size: 12px;
          font-weight: 300;
          color: #8D8371;
          letter-spacing: 4px;
        }

        .current-sphere-icon {
          position: absolute;
          bottom: -8px;
          font-size: 16px;
          background: #1E1F22;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .diamond-btn {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(30, 31, 34, 0.95);
          border: 2px solid #333;
          cursor: pointer;
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .diamond-btn:hover {
          transform: scale(1.15);
          border-color: #D8B26A;
          background: rgba(40, 41, 44, 0.98);
        }

        .diamond-btn.active {
          background: rgba(216, 178, 106, 0.15);
        }

        .diamond-btn-icon {
          font-size: 18px;
        }

        .diamond-btn-label {
          display: none;
          font-size: 9px;
          color: #999;
          margin-top: 2px;
        }

        .diamond-btn:hover .diamond-btn-label {
          display: block;
        }

        .diamond-btn-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          background: #e74c3c;
          color: white;
          font-size: 10px;
          font-weight: 600;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        /* Sphere Ring */
        .sphere-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .sphere-ring.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .sphere-ring-item {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(30, 31, 34, 0.95);
          border: 2px solid #444;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          pointer-events: auto;
        }

        .sphere-ring-item:hover {
          transform: scale(1.2) !important;
        }

        .sphere-ring-item.active {
          transform: scale(1.15) !important;
        }

        .sphere-icon {
          font-size: 20px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .diamond-layout {
            width: 250px;
            height: 250px;
          }

          .diamond-center {
            width: 60px;
            height: 60px;
          }

          .diamond-btn {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default DiamondLayout;
