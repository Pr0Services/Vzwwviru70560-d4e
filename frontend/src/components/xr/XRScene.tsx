/**
 * CHE·NU™ V75 — XR Scene Component
 * ==================================
 * 3D environment viewer using Three.js concepts
 * (CSS 3D transforms for preview, full Three.js in production)
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XREnvironment, 
  XRZone, 
  XRTemplateType, 
  XR_TEMPLATES, 
  ZONE_LABELS,
  useXREnvironment 
} from '../../xr/types';

// =============================================================================
// ICONS
// =============================================================================

const CubeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const MaximizeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

// =============================================================================
// ZONE COMPONENT
// =============================================================================

interface XRZoneProps {
  zone: XRZone;
  isSelected: boolean;
  onClick: () => void;
}

const XRZoneComponent: React.FC<XRZoneProps> = ({ zone, isSelected, onClick }) => {
  const getZoneColor = () => {
    switch (zone.type) {
      case 'intent_wall': return 'from-cyan-500/30 to-cyan-600/20 border-cyan-400/50';
      case 'decision_wall': return 'from-purple-500/30 to-purple-600/20 border-purple-400/50';
      case 'action_table': return 'from-green-500/30 to-green-600/20 border-green-400/50';
      case 'memory_kiosk': return 'from-yellow-500/30 to-yellow-600/20 border-yellow-400/50';
      case 'timeline_strip': return 'from-blue-500/30 to-blue-600/20 border-blue-400/50';
      case 'resource_shelf': return 'from-pink-500/30 to-pink-600/20 border-pink-400/50';
      default: return 'from-white/20 to-white/10 border-white/30';
    }
  };

  const style: React.CSSProperties = {
    transform: `
      translateX(${zone.position.x * 50}px)
      translateY(${-zone.position.y * 30}px)
      translateZ(${zone.position.z * 20}px)
      rotateY(${zone.rotation.y}deg)
      scale(${0.8 + zone.scale.x * 0.1})
    `,
    width: `${zone.scale.x * 60}px`,
    height: `${zone.scale.y * 40}px`,
  };

  if (!zone.visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`
        absolute cursor-pointer
        bg-gradient-to-br ${getZoneColor()}
        border-2 rounded-lg backdrop-blur-sm
        flex items-center justify-center
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-white shadow-lg shadow-white/20' : ''}
        ${zone.interactive ? 'hover:border-white/70' : 'opacity-50'}
      `}
      style={style}
    >
      <div className="text-center p-2">
        <div className="text-xs font-medium text-white/90 truncate">
          {ZONE_LABELS[zone.type]}
        </div>
        {zone.content?.items && (
          <div className="text-[10px] text-white/50 mt-1">
            {zone.content.items.length} items
          </div>
        )}
      </div>
    </motion.div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface XRSceneProps {
  threadId: string;
  sphereId: string;
  onZoneSelect?: (zone: XRZone) => void;
  className?: string;
}

export const XRScene: React.FC<XRSceneProps> = ({
  threadId,
  sphereId,
  onZoneSelect,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [rotation, setRotation] = useState({ x: 15, y: -20 });
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const {
    environment,
    isLoading,
    error,
    generate,
    updateZone,
    updateLighting,
  } = useXREnvironment(threadId, sphereId);

  // Generate on mount
  useEffect(() => {
    generate();
  }, [generate]);

  // Mouse drag for rotation
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).closest('.xr-canvas')) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    
    setRotation(prev => ({
      x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.3)),
      y: prev.y + deltaX * 0.3,
    }));
    
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zone selection
  const handleZoneClick = useCallback((zone: XRZone) => {
    setSelectedZoneId(zone.id);
    onZoneSelect?.(zone);
  }, [onZoneSelect]);

  // Toggle zone visibility
  const toggleZoneVisibility = useCallback((zoneId: string) => {
    const zone = environment?.zones.find(z => z.id === zoneId);
    if (zone) {
      updateZone(zoneId, { visible: !zone.visible });
    }
  }, [environment, updateZone]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-[#0a0e17] rounded-xl ${className}`} style={{ minHeight: 400 }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-white/60">Génération de l'environnement XR...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-[#0a0e17] rounded-xl ${className}`} style={{ minHeight: 400 }}>
        <div className="text-center text-red-400">
          <p>Erreur: {error}</p>
          <button
            onClick={() => generate()}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!environment) return null;

  return (
    <motion.div
      layout
      className={`
        relative overflow-hidden rounded-xl
        ${isFullscreen ? 'fixed inset-4 z-50' : className}
      `}
      style={{
        background: `linear-gradient(180deg, ${environment.atmosphere.skyColor} 0%, ${environment.atmosphere.groundColor} 100%)`,
        minHeight: isFullscreen ? 'auto' : 400,
      }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/10 rounded-lg">
            <CubeIcon />
          </div>
          <div>
            <h3 className="text-white font-medium">
              {XR_TEMPLATES[environment.template].name}
            </h3>
            <p className="text-xs text-white/50">
              {environment.zones.length} zones • Thread {threadId.slice(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings ? 'bg-cyan-500/30 text-cyan-400' : 'bg-white/10 text-white/60 hover:text-white'
            }`}
          >
            <SettingsIcon />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors"
          >
            <MaximizeIcon />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-16 right-4 z-20 w-64 bg-[#1a1f2e]/95 backdrop-blur-sm border border-white/10 rounded-xl p-4"
          >
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <GridIcon /> Zones
            </h4>
            <div className="space-y-2">
              {environment.zones.map(zone => (
                <div
                  key={zone.id}
                  className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                >
                  <span className="text-sm text-white/80 truncate">
                    {ZONE_LABELS[zone.type]}
                  </span>
                  <button
                    onClick={() => toggleZoneVisibility(zone.id)}
                    className={`p-1.5 rounded transition-colors ${
                      zone.visible ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-white/30'
                    }`}
                  >
                    <EyeIcon />
                  </button>
                </div>
              ))}
            </div>

            {/* Template Switcher */}
            <h4 className="text-white font-medium mt-4 mb-2">Template</h4>
            <select
              value={environment.template}
              onChange={(e) => generate(e.target.value as XRTemplateType)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              {Object.entries(XR_TEMPLATES).map(([key, tpl]) => (
                <option key={key} value={key} className="bg-[#1a1f2e]">
                  {tpl.name}
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas (CSS 3D) */}
      <div
        ref={containerRef}
        className="xr-canvas absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ perspective: '1000px' }}
      >
        {/* Grid Floor */}
        <div
          className="absolute w-[600px] h-[400px] opacity-20"
          style={{
            transform: `rotateX(${rotation.x + 60}deg) rotateZ(${rotation.y}deg)`,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* 3D Scene Container */}
        <div
          className="relative"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Zones */}
          {environment.zones.map(zone => (
            <XRZoneComponent
              key={zone.id}
              zone={zone}
              isSelected={zone.id === selectedZoneId}
              onClick={() => handleZoneClick(zone)}
            />
          ))}
        </div>

        {/* Ambient Particles */}
        {environment.atmosphere.particleSystem?.type !== 'none' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${
                  environment.atmosphere.particleSystem?.type === 'stars'
                    ? 'bg-white/60'
                    : 'bg-white/20'
                }`}
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  opacity: Math.random() * 0.5 + 0.2,
                }}
                animate={{
                  y: [null, '-10%'],
                  opacity: [null, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>Glisser pour tourner • Cliquer sur une zone pour sélectionner</span>
          <span>
            Rotation: X:{rotation.x.toFixed(0)}° Y:{rotation.y.toFixed(0)}°
          </span>
        </div>
      </div>

      {/* Selected Zone Detail */}
      <AnimatePresence>
        {selectedZoneId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 left-4 right-4 bg-[#1a1f2e]/95 backdrop-blur-sm border border-white/10 rounded-xl p-4"
          >
            {(() => {
              const zone = environment.zones.find(z => z.id === selectedZoneId);
              if (!zone) return null;
              return (
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-medium">{ZONE_LABELS[zone.type]}</h4>
                    <p className="text-sm text-white/50 mt-1">
                      Position: ({zone.position.x.toFixed(1)}, {zone.position.y.toFixed(1)}, {zone.position.z.toFixed(1)})
                    </p>
                    {zone.content?.items && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {zone.content.items.slice(0, 3).map(item => (
                          <span key={item.id} className="px-2 py-1 bg-white/10 rounded text-xs text-white/70">
                            {item.label}
                          </span>
                        ))}
                        {zone.content.items.length > 3 && (
                          <span className="px-2 py-1 text-xs text-white/50">
                            +{zone.content.items.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedZoneId(null)}
                    className="p-1 text-white/40 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Overlay Close */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-30 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

export default XRScene;
