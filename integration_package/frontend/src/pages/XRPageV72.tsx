/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — XR IMMERSIVE VIEW                           ║
 * ║                                                                              ║
 * ║  READ-ONLY XR interface for navigation and visualization                     ║
 * ║  GOUVERNANCE > EXÉCUTION — NO WRITE OPERATIONS IN XR                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// V72 Components
import { GlobalSearchV72 } from '../components/search/GlobalSearchV72';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { SPHERES } from '../hooks/useSpheres';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type XRViewMode = 'spheres' | 'threads' | 'decisions' | 'agents' | 'timeline';

interface XRSpherePosition {
  x: number;
  y: number;
  z: number;
  scale: number;
}

interface XRNode {
  id: string;
  label: string;
  type: 'sphere' | 'thread' | 'decision' | 'agent';
  color: string;
  position: XRSpherePosition;
  connections: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const VIEW_MODES: Record<XRViewMode, { icon: string; label: string; description: string }> = {
  spheres: { icon: '🌐', label: 'Sphères', description: 'Vue des 9 sphères de vie' },
  threads: { icon: '🧵', label: 'Threads', description: 'Réseau de threads et connexions' },
  decisions: { icon: '⚡', label: 'Décisions', description: 'Points de décision par urgence' },
  agents: { icon: '🤖', label: 'Agents', description: 'Constellation des agents' },
  timeline: { icon: '📅', label: 'Timeline', description: 'Vue chronologique' },
};

// Generate sphere positions in 3D-like arrangement
const generateSphereNodes = (): XRNode[] => {
  const angleStep = (2 * Math.PI) / 9;
  const radius = 35;
  
  return SPHERES.map((sphere, i) => ({
    id: sphere.id,
    label: sphere.name_fr,
    type: 'sphere' as const,
    color: sphere.color,
    position: {
      x: 50 + radius * Math.cos(angleStep * i - Math.PI / 2),
      y: 50 + radius * Math.sin(angleStep * i - Math.PI / 2),
      z: Math.sin(i * 0.7) * 10,
      scale: 1 + Math.sin(i * 0.5) * 0.2,
    },
    connections: i > 0 ? [SPHERES[i - 1].id] : [],
  }));
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3D SPHERE VISUALIZATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const XRSphereVisualization: React.FC<{
  nodes: XRNode[];
  selectedNode: string | null;
  onNodeSelect: (id: string) => void;
  onNodeNavigate: (id: string) => void;
}> = ({ nodes, selectedNode, onNodeSelect, onNodeNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle mouse drag for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setRotation(prev => ({
      x: prev.x + deltaY * 0.2,
      y: prev.y + deltaX * 0.2,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Auto rotation
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setRotation(prev => ({ ...prev, y: prev.y + 0.1 }));
    }, 50);
    return () => clearInterval(interval);
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
        perspective: '1000px',
        overflow: 'hidden',
      }}
    >
      {/* Central Nova */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(216, 178, 106, 0.4) 0%, rgba(63, 114, 73, 0.2) 50%, transparent 70%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          animation: 'pulse 3s infinite',
          zIndex: 100,
        }}
      >
        ✨
      </div>

      {/* Connection lines */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {nodes.map((node, i) => {
          const nextNode = nodes[(i + 1) % nodes.length];
          const x1 = node.position.x;
          const y1 = node.position.y;
          const x2 = nextNode.position.x;
          const y2 = nextNode.position.y;
          
          return (
            <line
              key={`line-${node.id}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="rgba(216, 178, 106, 0.15)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
        
        {/* Lines to center */}
        {nodes.map((node) => (
          <line
            key={`center-${node.id}`}
            x1="50%"
            y1="50%"
            x2={`${node.position.x}%`}
            y2={`${node.position.y}%`}
            stroke={`${node.color}30`}
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Sphere nodes */}
      {nodes.map((node) => {
        const sphere = SPHERES.find(s => s.id === node.id);
        const isSelected = selectedNode === node.id;
        const zFactor = (node.position.z + 10) / 20; // Normalize z for depth effect
        const scale = node.position.scale * (0.8 + zFactor * 0.4);
        
        return (
          <button
            key={node.id}
            onClick={() => onNodeSelect(node.id)}
            onDoubleClick={() => onNodeNavigate(node.id)}
            style={{
              position: 'absolute',
              left: `${node.position.x}%`,
              top: `${node.position.y}%`,
              transform: `translate(-50%, -50%) scale(${scale}) rotateY(${rotation.y}deg)`,
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${node.color}60 0%, ${node.color}30 50%, ${node.color}10 100%)`,
              border: `2px solid ${isSelected ? node.color : `${node.color}50`}`,
              boxShadow: isSelected
                ? `0 0 30px ${node.color}60, inset 0 0 20px ${node.color}30`
                : `0 0 15px ${node.color}30`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              zIndex: Math.round(zFactor * 50),
            }}
          >
            <span style={{ fontSize: 24 }}>{sphere?.icon}</span>
            <span
              style={{
                fontSize: 8,
                color: '#E8F0E8',
                marginTop: 2,
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                maxWidth: 60,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {node.label}
            </span>
          </button>
        );
      })}

      {/* Particle effects */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 2,
            height: 2,
            borderRadius: '50%',
            background: 'rgba(216, 178, 106, 0.3)',
            animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INFO PANEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const XRInfoPanel: React.FC<{
  selectedNode: string | null;
  onNavigate: (id: string) => void;
}> = ({ selectedNode, onNavigate }) => {
  if (!selectedNode) {
    return (
      <div
        style={{
          padding: 24,
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.06)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>👆</div>
        <p style={{ color: '#6B7B6B', fontSize: 13, margin: 0 }}>
          Sélectionnez une sphère pour voir ses détails
        </p>
        <p style={{ color: '#4B5B4B', fontSize: 11, margin: '8px 0 0' }}>
          Double-clic pour naviguer
        </p>
      </div>
    );
  }

  const sphere = SPHERES.find(s => s.id === selectedNode);
  if (!sphere) return null;

  return (
    <div
      style={{
        padding: 24,
        background: `linear-gradient(135deg, ${sphere.color}10 0%, transparent 100%)`,
        borderRadius: 16,
        border: `1px solid ${sphere.color}30`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: `${sphere.color}20`,
            border: `2px solid ${sphere.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
          }}
        >
          {sphere.icon}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, color: '#E8F0E8' }}>{sphere.name_fr}</h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6B7B6B' }}>
            {sphere.description_fr}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Threads actifs', value: Math.floor(Math.random() * 15) + 3, icon: '🧵' },
          { label: 'Décisions', value: Math.floor(Math.random() * 8) + 1, icon: '⚡' },
          { label: 'Agents', value: Math.floor(Math.random() * 5) + 2, icon: '🤖' },
          { label: 'Fichiers', value: Math.floor(Math.random() * 30) + 10, icon: '📁' },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              padding: 12,
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 10,
            }}
          >
            <div style={{ fontSize: 14, marginBottom: 2 }}>{stat.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: sphere.color }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: '#6B7B6B' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#6B7B6B', marginBottom: 8 }}>6 Bureau Sections:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {sphere.bureau.map((section, i) => (
            <span
              key={i}
              style={{
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 4,
                fontSize: 10,
                color: '#9BA89B',
              }}
            >
              {section}
            </span>
          ))}
        </div>
      </div>

      {/* Navigate Button */}
      <button
        onClick={() => onNavigate(selectedNode)}
        style={{
          width: '100%',
          padding: '14px',
          background: `linear-gradient(135deg, ${sphere.color} 0%, ${sphere.color}CC 100%)`,
          border: 'none',
          borderRadius: 10,
          color: '#1A1A1A',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Ouvrir {sphere.name_fr} →
      </button>

      {/* READ-ONLY Notice */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 11, color: '#8B5CF6' }}>
          🔒 Vue XR en lecture seule — Aucune modification possible
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export const XRPageV72: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [viewMode, setViewMode] = useState<XRViewMode>('spheres');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate nodes based on view mode
  const nodes = generateSphereNodes();

  // Handlers
  const handleNodeNavigate = useCallback((id: string) => {
    navigate(`/sphere/${id}`);
  }, [navigate]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAction: (action) => {
      if (action === 'search') setIsSearchOpen(true);
      if (action === 'escape') {
        if (isFullscreen) setIsFullscreen(false);
        else setIsSearchOpen(false);
      }
    },
  });

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(145deg, #050807 0%, #0A0D0B 50%, #070A08 100%)',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6B7B6B',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(216, 178, 106, 0.3) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              🥽
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#E8F0E8' }}>
                Vue XR Immersive
              </h1>
              <p style={{ margin: 0, fontSize: 10, color: '#6B7B6B' }}>
                READ-ONLY • GOUVERNANCE {'>'} EXÉCUTION
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Selector */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(Object.keys(VIEW_MODES) as XRViewMode[]).map((mode) => {
            const config = VIEW_MODES[mode];
            const isActive = viewMode === mode;
            
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={config.description}
                style={{
                  padding: '8px 12px',
                  background: isActive ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isActive ? '#8B5CF6' : 'rgba(255, 255, 255, 0.06)'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 14 }}>{config.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    color: isActive ? '#8B5CF6' : '#6B7B6B',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 8,
              color: '#9BA89B',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            🔍 ⌘K
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 8,
              color: '#9BA89B',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            {isFullscreen ? '⊙' : '⛶'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 3D Visualization Area */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
          }}
        >
          <XRSphereVisualization
            nodes={nodes}
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
            onNodeNavigate={handleNodeNavigate}
          />

          {/* Navigation hints */}
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 16,
              padding: '10px 20px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 20,
              fontSize: 11,
              color: '#6B7B6B',
            }}
          >
            <span>🖱️ Glisser pour tourner</span>
            <span>👆 Clic pour sélectionner</span>
            <span>👆👆 Double-clic pour naviguer</span>
          </div>
        </div>

        {/* Info Panel */}
        {!isFullscreen && (
          <div
            style={{
              width: 320,
              padding: 20,
              borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(0, 0, 0, 0.2)',
              overflowY: 'auto',
            }}
          >
            <XRInfoPanel
              selectedNode={selectedNode}
              onNavigate={handleNodeNavigate}
            />

            {/* View Mode Info */}
            <div
              style={{
                marginTop: 20,
                padding: 16,
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 12,
              }}
            >
              <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#9BA89B' }}>
                {VIEW_MODES[viewMode].icon} {VIEW_MODES[viewMode].label}
              </h4>
              <p style={{ margin: 0, fontSize: 11, color: '#6B7B6B' }}>
                {VIEW_MODES[viewMode].description}
              </p>
            </div>

            {/* XR Controls Info */}
            <div
              style={{
                marginTop: 20,
                padding: 16,
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(216, 178, 106, 0.08) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: 12,
              }}
            >
              <h4 style={{ margin: '0 0 12px', fontSize: 12, color: '#8B5CF6' }}>
                🎮 Contrôles XR
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { key: '←/→', action: 'Rotation horizontale' },
                  { key: '↑/↓', action: 'Rotation verticale' },
                  { key: 'Espace', action: 'Reset vue' },
                  { key: 'Échap', action: 'Quitter plein écran' },
                ].map((control, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <kbd
                      style={{
                        padding: '2px 6px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 4,
                        fontSize: 10,
                        color: '#9BA89B',
                      }}
                    >
                      {control.key}
                    </kbd>
                    <span style={{ fontSize: 10, color: '#6B7B6B' }}>{control.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <GlobalSearchV72
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(result) => result.path && navigate(result.path)}
        onNavigate={navigate}
      />
    </div>
  );
};

export default XRPageV72;
