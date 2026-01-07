// =============================================================================
// CHE·NU™ — UNIVERSE VIEW
// Version Finale V51
// Vue principale de navigation dans l'univers
// =============================================================================

import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useThemeStore } from '../../stores/theme.store';
import { useUniverseStore } from '../../stores/universe.store';
import { useAgentStore } from '../../stores/agent.store';
import { SPHERES_DATA } from '../../data/spheres.data';
import { AGENTS_DATA, getAgentsBySphere, getCoreAgents } from '../../data/agents.data';
import { SphereId, DEFAULT_UNIVERSE_DIMENSIONS } from '../../types';
import { Core } from '../core/Core';
import { Sphere } from '../spheres/Sphere';
import { AgentOrbit } from '../agents/AgentOrbit';

interface UniverseViewProps {
  width?: number;
  height?: number;
  className?: string;
}

export const UniverseView: React.FC<UniverseViewProps> = ({
  width = 1200,
  height = 800,
  className = '',
}) => {
  const theme = useThemeStore(state => state.theme);
  const {
    viewMode,
    zoomLevel,
    focusedSphereId,
    hoveredSphereId,
    camera,
    renderConfig,
    focusSphere,
    hoverSphere,
    updateCamera,
    resetCamera,
  } = useUniverseStore();
  
  const { selectAgent } = useAgentStore();
  
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Calculate sphere positions
  const spherePositions = useMemo(() => {
    const positions: Array<{ sphere: typeof SPHERES_DATA[0]; x: number; y: number }> = [];
    const orbitRadius = Math.min(width, height) * 0.35;
    
    SPHERES_DATA.forEach((sphere, index) => {
      if (sphere.id === 'methodology') {
        // Methodology is closer to center
        const angle = Math.PI / 4; // 45 degrees
        positions.push({
          sphere,
          x: centerX + Math.cos(angle) * orbitRadius * 0.4,
          y: centerY + Math.sin(angle) * orbitRadius * 0.4,
        });
      } else {
        // Regular spheres in orbit
        const nonMethodologySpheres = SPHERES_DATA.filter(s => s.id !== 'methodology');
        const idx = nonMethodologySpheres.findIndex(s => s.id === sphere.id);
        const angle = (idx / nonMethodologySpheres.length) * Math.PI * 2 - Math.PI / 2;
        positions.push({
          sphere,
          x: centerX + Math.cos(angle) * orbitRadius,
          y: centerY + Math.sin(angle) * orbitRadius,
        });
      }
    });
    
    return positions;
  }, [width, height, centerX, centerY]);
  
  // Get core agents for center orbit
  const coreAgents = useMemo(() => getCoreAgents(), []);
  
  // Get agents for focused sphere
  const focusedSphereAgents = useMemo(() => {
    if (!focusedSphereId) return [];
    return getAgentsBySphere(focusedSphereId);
  }, [focusedSphereId]);
  
  // Event handlers
  const handleSphereClick = useCallback((sphereId: SphereId) => {
    if (focusedSphereId === sphereId) {
      focusSphere(null);
    } else {
      focusSphere(sphereId);
    }
  }, [focusedSphereId, focusSphere]);
  
  const handleCoreClick = useCallback(() => {
    focusSphere(null);
    resetCamera();
  }, [focusSphere, resetCamera]);
  
  const handleAgentClick = useCallback((agentId: string) => {
    selectAgent(agentId);
  }, [selectAgent]);
  
  // Mouse drag for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - camera.x, y: e.clientY - camera.y });
    }
  }, [camera.x, camera.y]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      updateCamera({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart, updateCamera]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(3, camera.zoom * delta));
    updateCamera({ zoom: newZoom });
  }, [camera.zoom, updateCamera]);
  
  // Transform based on camera
  const transform = useMemo(() => {
    return `translate(${camera.x}, ${camera.y}) scale(${camera.zoom})`;
  }, [camera.x, camera.y, camera.zoom]);
  
  return (
    <div 
      className={`universe-view ${className}`}
      style={{
        width,
        height,
        overflow: 'hidden',
        backgroundColor: theme.palette.bgPrimary,
        borderRadius: theme.radius.lg,
        position: 'relative',
      }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <defs>
          {/* Background gradient */}
          <radialGradient id="universe-bg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={theme.palette.bgSecondary} />
            <stop offset="100%" stopColor={theme.palette.bgPrimary} />
          </radialGradient>
          
          {/* Glow filter */}
          <filter id="universe-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
          
          {/* Star pattern */}
          <pattern id="stars" width="100" height="100" patternUnits="userSpaceOnUse">
            {[...Array(20)].map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 100}
                cy={Math.random() * 100}
                r={Math.random() * 1.5 + 0.5}
                fill={theme.palette.textMuted}
                opacity={Math.random() * 0.5 + 0.2}
              />
            ))}
          </pattern>
        </defs>
        
        {/* Background */}
        <rect width={width} height={height} fill="url(#universe-bg)" />
        
        {/* Stars (if enabled) */}
        {renderConfig.particlesEnabled && (
          <rect width={width} height={height} fill="url(#stars)" opacity={0.3} />
        )}
        
        {/* Main content group with transform */}
        <g transform={transform}>
          {/* Grid (if enabled) */}
          {renderConfig.showGrid && (
            <g opacity={0.1}>
              {[...Array(20)].map((_, i) => (
                <React.Fragment key={i}>
                  <line
                    x1={i * 100}
                    y1={0}
                    x2={i * 100}
                    y2={height * 2}
                    stroke={theme.palette.borderSubtle}
                    strokeWidth={1}
                  />
                  <line
                    x1={0}
                    y1={i * 100}
                    x2={width * 2}
                    y2={i * 100}
                    stroke={theme.palette.borderSubtle}
                    strokeWidth={1}
                  />
                </React.Fragment>
              ))}
            </g>
          )}
          
          {/* Orbit path */}
          <circle
            cx={centerX}
            cy={centerY}
            r={Math.min(width, height) * 0.35}
            fill="none"
            stroke={theme.palette.borderSubtle}
            strokeWidth={1}
            strokeDasharray="8 8"
            opacity={0.3}
          />
          
          {/* Connection lines (if enabled) */}
          {renderConfig.showConnections && (
            <g opacity={0.15}>
              {spherePositions.map(({ sphere, x, y }) => (
                <line
                  key={`line-${sphere.id}`}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke={sphere.color.primary}
                  strokeWidth={1}
                />
              ))}
            </g>
          )}
          
          {/* Spheres */}
          {spherePositions.map(({ sphere, x, y }) => (
            <Sphere
              key={sphere.id}
              sphere={sphere}
              x={x}
              y={y}
              baseSize={50}
              showLabel={renderConfig.showLabels}
              showAgentCount={true}
              showGlow={true}
              onClick={handleSphereClick}
              onHover={hoverSphere}
            />
          ))}
          
          {/* Core agents orbit (around center) */}
          {renderConfig.showAgents && (
            <AgentOrbit
              agents={coreAgents}
              centerX={centerX}
              centerY={centerY}
              baseRadius={60}
              showLabels={false}
              animated={renderConfig.animationsEnabled}
              onClick={handleAgentClick}
            />
          )}
          
          {/* Focused sphere agents */}
          {focusedSphereId && renderConfig.showAgents && focusedSphereAgents.length > 0 && (
            <AgentOrbit
              agents={focusedSphereAgents.slice(0, 20)} // Limit for performance
              centerX={spherePositions.find(p => p.sphere.id === focusedSphereId)?.x || centerX}
              centerY={spherePositions.find(p => p.sphere.id === focusedSphereId)?.y || centerY}
              baseRadius={80}
              showLabels={zoomLevel === 'agent'}
              animated={renderConfig.animationsEnabled}
              onClick={handleAgentClick}
            />
          )}
          
          {/* Central Core */}
          <g transform={`translate(${centerX - 40}, ${centerY - 40})`}>
            <Core
              size={80}
              onClick={handleCoreClick}
              showPulse={renderConfig.animationsEnabled}
              showRings={true}
              showLabel={renderConfig.showLabels}
            />
          </g>
        </g>
        
        {/* View mode indicator */}
        <g transform={`translate(${width - 100}, 20)`}>
          <rect
            x={0}
            y={0}
            width={90}
            height={28}
            rx={14}
            fill={theme.palette.bgElevated}
            stroke={theme.palette.borderDefault}
          />
          <text
            x={45}
            y={18}
            textAnchor="middle"
            fill={theme.palette.textSecondary}
            fontSize={12}
          >
            {viewMode.toUpperCase()}
          </text>
        </g>
        
        {/* Zoom indicator */}
        <g transform={`translate(20, ${height - 40})`}>
          <text
            fill={theme.palette.textMuted}
            fontSize={11}
          >
            Zoom: {Math.round(camera.zoom * 100)}%
          </text>
        </g>
      </svg>
      
      {/* Minimap (if enabled) */}
      {renderConfig.showMinimap && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            width: 150,
            height: 100,
            backgroundColor: theme.palette.bgSecondary,
            border: `1px solid ${theme.palette.borderDefault}`,
            borderRadius: theme.radius.md,
            padding: 8,
            opacity: 0.9,
          }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
            {spherePositions.map(({ sphere, x, y }) => (
              <circle
                key={sphere.id}
                cx={x}
                cy={y}
                r={8}
                fill={sphere.color.primary}
                opacity={focusedSphereId === sphere.id ? 1 : 0.5}
              />
            ))}
            <circle
              cx={centerX}
              cy={centerY}
              r={10}
              fill={theme.palette.accentPrimary}
            />
            {/* Viewport indicator */}
            <rect
              x={centerX - (width / 2 / camera.zoom) - camera.x / camera.zoom}
              y={centerY - (height / 2 / camera.zoom) - camera.y / camera.zoom}
              width={width / camera.zoom}
              height={height / camera.zoom}
              fill="none"
              stroke={theme.palette.accentPrimary}
              strokeWidth={2}
            />
          </svg>
        </div>
      )}
      
      <style>{`
        .universe-view {
          user-select: none;
        }
        
        .universe-view svg {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default UniverseView;
