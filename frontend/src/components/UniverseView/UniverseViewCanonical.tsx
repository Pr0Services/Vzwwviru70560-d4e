/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — UNIVERSE VIEW (CANONICAL)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * HIÉRARCHIE:
 * - Personal (centre absolu - niveau 0)
 * - My Team (sphère spéciale - niveau 1)
 * - Contextual Spheres (niveau 2)
 * 
 * RÈGLES:
 * - Personal toujours visible et centré
 * - My Team plus proche du centre que les autres
 * - Hiérarchie visible (pas de layout plat)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import {
  SphereNode,
  SphereState,
  ALL_SPHERES
} from '../../canonical/SPHERES_CANONICAL_V2';
import {
  ViewMode,
  InteractionMode
} from '../../canonical/UNIVERSE_VIEW_TYPES';

interface UniverseViewCanonicalProps {
  userId: string;
  spheres?: SphereNode[];
  focusedSphereId?: string | null;
  onSphereClick: (sphereId: string) => void;
  onSphereHover?: (sphereId: string | null) => void;
  language?: 'en' | 'fr';
  className?: string;
}

export const UniverseViewCanonical: React.FC<UniverseViewCanonicalProps> = ({
  userId,
  spheres = ALL_SPHERES,
  focusedSphereId = null,
  onSphereClick,
  onSphereHover,
  language = 'fr',
  className = ''
}) => {
  const [hoveredSphereId, setHoveredSphereId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  // Get spheres by orbit level
  const personalSphere = useMemo(() => spheres.find(s => s.id === 'personal'), [spheres]);
  const teamSphere = useMemo(() => spheres.find(s => s.id === 'my_team'), [spheres]);
  const contextualSpheres = useMemo(
    () => spheres.filter(s => s.visual.orbitLevel === 2),
    [spheres]
  );

  const handleSphereClick = (sphereId: string) => {
    onSphereClick(sphereId);
    if (sphereId !== 'personal') {
      setViewMode('focus');
    }
  };

  const handleSphereHover = (sphereId: string | null) => {
    setHoveredSphereId(sphereId);
    onSphereHover?.(sphereId);
  };

  const handleExitFocus = () => {
    setViewMode('overview');
    onSphereClick('personal');
  };

  // Calculate orbital position
  const getOrbitalPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  // Get visual state
  const getSphereVisualState = (sphere: SphereNode): SphereState => {
    if (focusedSphereId === sphere.id) return 'focus';
    if (sphere.state === 'active') return 'active';
    return 'latent';
  };

  // Render sphere
  const renderSphere = (
    sphere: SphereNode,
    position: { x: number; y: number },
    size: number
  ) => {
    const state = getSphereVisualState(sphere);
    const isHovered = hoveredSphereId === sphere.id;
    const isFocused = focusedSphereId === sphere.id;

    const opacity = state === 'latent' ? 0.4 : 1;
    const scale = isFocused ? 1.2 : isHovered ? 1.1 : 1;
    const glowIntensity = state === 'focus' ? 20 : state === 'active' ? 10 : 0;

    return (
      <g
        key={sphere.id}
        transform={`translate(${position.x}, ${position.y})`}
        onClick={() => handleSphereClick(sphere.id)}
        onMouseEnter={() => handleSphereHover(sphere.id)}
        onMouseLeave={() => handleSphereHover(null)}
        style={{ cursor: 'pointer' }}
      >
        {/* Glow */}
        {glowIntensity > 0 && (
          <circle
            r={size * scale + 5}
            fill="none"
            stroke={sphere.visual.color}
            strokeWidth={2}
            opacity={0.3}
          />
        )}

        {/* Sphere */}
        <circle
          r={size * scale}
          fill={sphere.visual.color}
          opacity={opacity}
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Emoji */}
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.8}
          style={{ pointerEvents: 'none' }}
        >
          {sphere.visual.emoji}
        </text>

        {/* Label */}
        <text
          y={size + 16}
          textAnchor="middle"
          fill="#E9E4D6"
          fontSize={11}
          fontWeight={isFocused ? 600 : 400}
          opacity={state === 'latent' ? 0.5 : 1}
          style={{ pointerEvents: 'none' }}
        >
          {language === 'fr' ? sphere.labelFr : sphere.label}
        </text>

        {/* Special indicator for Team */}
        {sphere.type === 'my_team' && (
          <text
            y={size + 28}
            textAnchor="middle"
            fill="#D8B26A"
            fontSize={9}
            opacity={0.7}
          >
            {language === 'fr' ? 'Spéciale' : 'Special'}
          </text>
        )}
      </g>
    );
  };

  // Render connection
  const renderConnection = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    color: string,
    isActive: boolean
  ) => (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      strokeWidth={isActive ? 2 : 1}
      strokeDasharray={isActive ? 'none' : '4,4'}
      opacity={isActive ? 0.6 : 0.2}
      style={{ transition: 'all 0.3s ease' }}
    />
  );

  const center = { x: 200, y: 200 };
  const orbitRadius1 = 70;
  const orbitRadius2 = 150;

  const contextualPositions = contextualSpheres.map((sphere, index) =>
    getOrbitalPosition(index, contextualSpheres.length, orbitRadius2)
  );

  return (
    <div
      className={`universe-view-canonical ${className}`}
      style={{
        background: '#1E1F22',
        borderRadius: '12px',
        padding: '20px',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: '#D8B26A', fontSize: '14px' }}>
          🌌 {language === 'fr' ? 'Vue Univers' : 'Universe View'}
        </h3>
        {viewMode === 'focus' && (
          <button
            onClick={handleExitFocus}
            style={{
              padding: '4px 12px',
              background: 'transparent',
              border: '1px solid #3A3B3E',
              borderRadius: '4px',
              color: '#8D8371',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ← {language === 'fr' ? 'Vue d\'ensemble' : 'Overview'}
          </button>
        )}
      </div>

      {/* SVG Universe */}
      <svg width="400" height="400" viewBox="0 0 400 400" style={{ display: 'block', margin: '0 auto' }}>
        {/* Orbits */}
        <circle cx={center.x} cy={center.y} r={orbitRadius1} fill="none" stroke="#3A3B3E" strokeWidth={1} strokeDasharray="4,4" opacity={0.5} />
        <circle cx={center.x} cy={center.y} r={orbitRadius2} fill="none" stroke="#3A3B3E" strokeWidth={1} strokeDasharray="4,4" opacity={0.3} />

        {/* Connection Personal → Team */}
        {teamSphere && personalSphere && renderConnection(
          center,
          { x: center.x, y: center.y - orbitRadius1 },
          '#D8B26A',
          hoveredSphereId === 'my_team' || focusedSphereId === 'my_team'
        )}

        {/* Connections Team → Contextual */}
        {contextualSpheres.map((sphere, index) => {
          const pos = contextualPositions[index];
          return renderConnection(
            { x: center.x, y: center.y - orbitRadius1 },
            { x: center.x + pos.x, y: center.y + pos.y },
            sphere.visual.color,
            hoveredSphereId === sphere.id || focusedSphereId === sphere.id
          );
        })}

        {/* Contextual spheres (level 2) */}
        {contextualSpheres.map((sphere, index) => {
          const pos = contextualPositions[index];
          return renderSphere(sphere, { x: center.x + pos.x, y: center.y + pos.y }, 30);
        })}

        {/* My Team (level 1) */}
        {teamSphere && renderSphere(teamSphere, { x: center.x, y: center.y - orbitRadius1 }, 35)}

        {/* Personal (level 0 - center) */}
        {personalSphere && renderSphere(personalSphere, center, 45)}
      </svg>

      {/* Legend */}
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11px', color: '#8D8371' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366F1' }} />
          {language === 'fr' ? 'Centre' : 'Center'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06B6D4' }} />
          {language === 'fr' ? 'Spéciale' : 'Special'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8D8371' }} />
          {language === 'fr' ? 'Contextuelle' : 'Contextual'}
        </div>
      </div>

      {/* Hierarchy */}
      <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '10px', color: '#8D8371', fontStyle: 'italic' }}>
        Personal → My Team → {language === 'fr' ? 'Sphères Contextuelles' : 'Contextual Spheres'}
      </div>
    </div>
  );
};

export default UniverseViewCanonical;
