// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — UNIVERSE VIEW
// Canonical Implementation of UI Wireframe
//
// RULES:
// - Size = importance (not noise)
// - Click = focus
// - Zoom = dive into sphere
// - No clutter, no labels overload
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface Sphere {
  id: string;
  name: string;
  icon: string;
  color: string;
  importance: number; // 0-100, affects size
  position: { x: number; y: number }; // relative position
  unreadCount?: number;
  description?: string;
}

interface UniverseViewProps {
  spheres: Sphere[];
  activeSphereId?: string;
  onSphereClick: (sphere: Sphere) => void;
  onSphereHover?: (sphere: Sphere | null) => void;
  userName?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_SPHERES: Sphere[] = [
  { id: 'business', name: 'Business', icon: '💼', color: '#0066cc', importance: 90, position: { x: 50, y: 15 } },
  { id: 'scholars', name: 'Scholar', icon: '📚', color: '#8b5cf6', importance: 70, position: { x: 25, y: 35 } },
  { id: 'creative', name: 'Creative', icon: '🎨', color: '#f59e0b', importance: 70, position: { x: 75, y: 35 } },
  { id: 'methodology', name: 'Methodology', icon: '⚙️', color: '#10b981', importance: 60, position: { x: 25, y: 65 } },
  { id: 'xr', name: 'XR', icon: '🥽', color: '#ec4899', importance: 60, position: { x: 75, y: 65 } },
  { id: 'social', name: 'Social', icon: '🌐', color: '#06b6d4', importance: 50, position: { x: 50, y: 85 } },
];

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    minHeight: '500px',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  
  // Stars background
  starsLayer: {
    position: 'absolute' as const,
    inset: 0,
    background: `
      radial-gradient(2px 2px at 20% 30%, white, transparent),
      radial-gradient(2px 2px at 40% 70%, white, transparent),
      radial-gradient(1px 1px at 60% 20%, white, transparent),
      radial-gradient(1px 1px at 80% 60%, white, transparent),
      radial-gradient(1px 1px at 10% 80%, white, transparent),
      radial-gradient(2px 2px at 90% 40%, white, transparent),
      radial-gradient(1px 1px at 50% 50%, white, transparent)
    `,
    opacity: 0.3,
  },
  
  // Core (YOU)
  core: {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d8b26a 0%, #b8963a 100%)',
    boxShadow: '0 0 60px rgba(216, 178, 106, 0.5), 0 0 100px rgba(216, 178, 106, 0.3)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  
  coreLabel: {
    color: '#1a1a1a',
    fontWeight: 600,
    fontSize: '0.875rem',
    textAlign: 'center' as const,
  },
  
  coreSubLabel: {
    color: '#1a1a1a',
    fontSize: '0.75rem',
    opacity: 0.8,
  },
  
  // Sphere node
  sphereNode: {
    position: 'absolute' as const,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 300ms ease',
    border: '2px solid transparent',
  },
  
  sphereIcon: {
    fontSize: '1.5rem',
  },
  
  // Sphere label (on hover)
  sphereLabel: {
    position: 'absolute' as const,
    bottom: '-30px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '0.25rem 0.75rem',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
    opacity: 0,
    transition: 'opacity 200ms ease',
    pointerEvents: 'none' as const,
  },
  
  // Unread badge
  unreadBadge: {
    position: 'absolute' as const,
    top: '-4px',
    right: '-4px',
    minWidth: '18px',
    height: '18px',
    padding: '0 4px',
    background: '#ef4444',
    color: 'white',
    borderRadius: '9px',
    fontSize: '0.6875rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Connection lines
  connectionLine: {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transformOrigin: '0 0',
    height: '1px',
    background: 'rgba(216, 178, 106, 0.2)',
    zIndex: 1,
  },
  
  // Hover info panel
  infoPanel: {
    position: 'absolute' as const,
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '1rem 1.5rem',
    background: 'rgba(0, 0, 0, 0.9)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    textAlign: 'center' as const,
    zIndex: 100,
    minWidth: '200px',
  },
  
  infoPanelTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
  },
  
  infoPanelDescription: {
    margin: '0.5rem 0 0',
    fontSize: '0.875rem',
    color: '#a3a3a3',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const UniverseView: React.FC<UniverseViewProps> = ({
  spheres = DEFAULT_SPHERES,
  activeSphereId,
  onSphereClick,
  onSphereHover,
  userName = 'YOU',
}) => {
  const [hoveredSphere, setHoveredSphere] = useState<Sphere | null>(null);

  // Calculate sphere size based on importance
  const getSphereSize = (importance: number): number => {
    const minSize = 50;
    const maxSize = 80;
    return minSize + ((importance / 100) * (maxSize - minSize));
  };

  // Handle sphere hover
  const handleSphereHover = useCallback((sphere: Sphere | null) => {
    setHoveredSphere(sphere);
    onSphereHover?.(sphere);
  }, [onSphereHover]);

  // Calculate connection line angle and length
  const getConnectionStyle = (sphere: Sphere) => {
    const centerX = 50;
    const centerY = 50;
    const dx = sphere.position.x - centerX;
    const dy = sphere.position.y - centerY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const length = Math.sqrt(dx * dx + dy * dy);
    
    return {
      width: `${length}%`,
      transform: `rotate(${angle}deg)`,
    };
  };

  return (
    <div style={styles.container}>
      {/* Stars Background */}
      <div style={styles.starsLayer} />

      {/* Connection Lines */}
      {spheres.map(sphere => (
        <div
          key={`line-${sphere.id}`}
          style={{
            ...styles.connectionLine,
            ...getConnectionStyle(sphere),
          }}
        />
      ))}

      {/* Core (YOU) */}
      <div style={styles.core}>
        <span style={{ fontSize: '1.5rem' }}>👤</span>
        <span style={styles.coreLabel}>{userName}</span>
        <span style={styles.coreSubLabel}>CORE</span>
      </div>

      {/* Spheres */}
      {spheres.map(sphere => {
        const size = getSphereSize(sphere.importance);
        const isActive = activeSphereId === sphere.id;
        const isHovered = hoveredSphere?.id === sphere.id;

        return (
          <div
            key={sphere.id}
            onClick={() => onSphereClick(sphere)}
            onMouseEnter={() => handleSphereHover(sphere)}
            onMouseLeave={() => handleSphereHover(null)}
            style={{
              ...styles.sphereNode,
              left: `${sphere.position.x}%`,
              top: `${sphere.position.y}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `linear-gradient(135deg, ${sphere.color} 0%, ${sphere.color}aa 100%)`,
              boxShadow: isActive || isHovered
                ? `0 0 30px ${sphere.color}80, 0 0 60px ${sphere.color}40`
                : `0 0 20px ${sphere.color}40`,
              borderColor: isActive ? sphere.color : 'transparent',
              transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : isActive ? 1.1 : 1})`,
            }}
          >
            <span style={{
              ...styles.sphereIcon,
              fontSize: `${size * 0.4}px`,
            }}>
              {sphere.icon}
            </span>

            {/* Unread Badge */}
            {sphere.unreadCount && sphere.unreadCount > 0 && (
              <span style={styles.unreadBadge}>
                {sphere.unreadCount > 99 ? '99+' : sphere.unreadCount}
              </span>
            )}

            {/* Label (on hover) */}
            <span style={{
              ...styles.sphereLabel,
              opacity: isHovered ? 1 : 0,
            }}>
              [{sphere.name}]
            </span>
          </div>
        );
      })}

      {/* Info Panel (when hovering) */}
      {hoveredSphere && (
        <div style={styles.infoPanel}>
          <h3 style={styles.infoPanelTitle}>
            {hoveredSphere.icon} {hoveredSphere.name} Sphere
          </h3>
          {hoveredSphere.description && (
            <p style={styles.infoPanelDescription}>
              {hoveredSphere.description}
            </p>
          )}
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#737373' }}>
            Click to enter sphere
          </p>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MINI UNIVERSE VIEW (for sidebar/navigation)
// =============================================================================

interface MiniUniverseViewProps {
  spheres: Sphere[];
  activeSphereId?: string;
  onSphereClick: (sphere: Sphere) => void;
}

export const MiniUniverseView: React.FC<MiniUniverseViewProps> = ({
  spheres = DEFAULT_SPHERES,
  activeSphereId,
  onSphereClick,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      padding: '0.5rem',
    }}>
      {spheres.map(sphere => {
        const isActive = activeSphereId === sphere.id;
        
        return (
          <button
            key={sphere.id}
            onClick={() => onSphereClick(sphere)}
            title={sphere.name}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: isActive ? `2px solid ${sphere.color}` : '2px solid transparent',
              background: `${sphere.color}20`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              transition: 'all 150ms ease',
            }}
          >
            {sphere.icon}
          </button>
        );
      })}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default UniverseView;
export { DEFAULT_SPHERES };
