/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — MINIMAP ROUTER BRIDGE                           ║
 * ║                    Wrapper qui connecte FloatingMinimap au Router            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * UTILISATION:
 * Ce composant wrape le FloatingMinimap existant et le connecte automatiquement
 * au système de navigation URL via useMinimapRouter.
 * 
 * <MinimapRouterBridge /> 
 * → Affiche FloatingMinimap avec navigation URL automatique
 */

import React, { memo } from 'react';
import { FloatingMinimap, SphereId } from '../components/navigation/FloatingMinimap';
import { useMinimapRouter } from '../hooks/useMinimapRouter';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface MinimapRouterBridgeProps {
  /** Taille de la minimap (default: 180) */
  size?: number;
  /** Mode compact pour mobile */
  compact?: boolean;
  /** Position CSS personnalisée */
  position?: {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
  };
  /** Z-index personnalisé */
  zIndex?: number;
  /** Classe CSS additionnelle */
  className?: string;
  /** Masquer la minimap */
  hidden?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_POSITION = {
  top: 80,
  left: 16,
};

const COLORS = {
  uiSlate: '#1E1F22',
  border: '#2A2A2E',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const MinimapRouterBridge: React.FC<MinimapRouterBridgeProps> = memo(({
  size = 180,
  compact = false,
  position = DEFAULT_POSITION,
  zIndex = 100,
  className = '',
  hidden = false,
}) => {
  // Bridge hook - connecte à la navigation URL
  const {
    activeSphere,
    onSphereSelect,
    onCenterClick,
    currentSphereInfo,
    isInOverview,
  } = useMinimapRouter();

  // Ne pas afficher si hidden
  if (hidden) return null;

  return (
    <div
      className={`minimap-router-bridge ${className}`}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        right: position.right,
        bottom: position.bottom,
        zIndex,
        // Animation d'entrée
        animation: 'minimapFadeIn 0.3s ease',
      }}
    >
      {/* Container avec fond semi-transparent */}
      <div
        style={{
          padding: 8,
          borderRadius: 16,
          backgroundColor: `${COLORS.uiSlate}90`,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* FloatingMinimap existant avec props du bridge */}
        <FloatingMinimap
          activeSphere={activeSphere}
          onSphereSelect={onSphereSelect}
          onCenterClick={onCenterClick}
          size={size}
          compact={compact}
        />
      </div>

      {/* Indicateur de section actuelle (sous la minimap) */}
      {currentSphereInfo && !compact && (
        <div
          style={{
            marginTop: 8,
            padding: '6px 12px',
            borderRadius: 8,
            backgroundColor: `${COLORS.uiSlate}90`,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${currentSphereInfo.color}40`,
            fontSize: 11,
            color: currentSphereInfo.color,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span>{currentSphereInfo.emoji}</span>
          <span>{currentSphereInfo.nameFr}</span>
        </div>
      )}

      {/* Indicateur Overview */}
      {isInOverview && !compact && (
        <div
          style={{
            marginTop: 8,
            padding: '6px 12px',
            borderRadius: 8,
            backgroundColor: `${COLORS.uiSlate}90`,
            backdropFilter: 'blur(8px)',
            border: `1px solid #D8B26A40`,
            fontSize: 11,
            color: '#D8B26A',
            textAlign: 'center',
          }}
        >
          🏝️ Vue d'ensemble
        </div>
      )}

      {/* CSS pour l'animation */}
      <style>{`
        @keyframes minimapFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .minimap-router-bridge:hover {
          transform: scale(1.02);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
});

MinimapRouterBridge.displayName = 'MinimapRouterBridge';

// ═══════════════════════════════════════════════════════════════════════════════
// VARIANTES PRÉ-CONFIGURÉES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Minimap pour desktop - position haut-gauche
 */
export const DesktopMinimap: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <MinimapRouterBridge
    size={180}
    compact={false}
    position={{ top: 80, left: 16 }}
    hidden={hidden}
  />
);

/**
 * Minimap pour mobile - plus petite, position bas-gauche
 */
export const MobileMinimap: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <MinimapRouterBridge
    size={120}
    compact={true}
    position={{ bottom: 80, left: 16 }}
    hidden={hidden}
  />
);

/**
 * Minimap pour tablette - taille moyenne
 */
export const TabletMinimap: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <MinimapRouterBridge
    size={150}
    compact={false}
    position={{ top: 80, left: 16 }}
    hidden={hidden}
  />
);

export default MinimapRouterBridge;
