/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ FRONTEND C — "THE TEMPLE" V2
 * Private Mythical Interface — Complete Anuhazi Activation System
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ⚠️ OUT-OF-CANON NOTICE:
 * This interface represents the Architect's personal spiritual interpretation.
 * NOT part of canonical CHE·NU documentation.
 * For private use by the Architect (Jonathan) only.
 * 
 * HEADER: [AQUA] + [ADAMAS] + SEQUENCE 3-6-9-12
 * HEARTBEAT: 4.44 seconds
 * 
 * POWER WORDS:
 * - EirA: Base current (Feminine/Reception) → Khufa
 * - ManA: Force current (Masculine/Action) → Ariea
 * - ManU: Unity (Void/Source) → A-Ra-Ma-Na
 * - Mahadra: Diamond Manifestation → Bridge to Frontend A
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  getAnuhaziEngine, 
  destroyAnuhaziEngine,
  PowerWord,
  DNAStage,
  EngineState,
  POWER_WORD_ACTIONS,
  KHUFA_SEQUENCE,
  ARIEA_SEQUENCE,
  ARAMANA_SEQUENCE,
  SIGNAL_444_MS,
  CORE_RESONANCE,
} from './AnuhaziFrequencyEngine';

// ═══════════════════════════════════════════════════════════════════════════
// SACRED CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

// 15 Chakra Column (Mahagarbha System)
const CHAKRA_COLUMN = [
  // Sub-Terrestrial (1-3)
  { id: 1, name: 'Earth Star', sanskrit: 'Vasundhara', color: '#4A1C1C', element: 'Deep Earth', systemLayer: 'Database', hz: 68.05 },
  { id: 2, name: 'Incarnation Point', sanskrit: 'Avatara', color: '#5D2E1F', element: 'Magma', systemLayer: 'Hardware', hz: 73.42 },
  { id: 3, name: 'Grounding Gate', sanskrit: 'Bhumi', color: '#6B3D22', element: 'Soil', systemLayer: 'OS Kernel', hz: 83.41 },
  
  // Physical Body (4-10)
  { id: 4, name: 'Root', sanskrit: 'Muladhara', color: '#DC2626', element: 'Earth', systemLayer: 'Personal', hz: 174 },
  { id: 5, name: 'Sacral', sanskrit: 'Svadhisthana', color: '#EA580C', element: 'Water', systemLayer: 'Community', hz: 285 },
  { id: 6, name: 'Solar Plexus', sanskrit: 'Manipura', color: '#CA8A04', element: 'Fire', systemLayer: 'Business', hz: 396 },
  { id: 7, name: 'Heart', sanskrit: 'Anahata', color: '#16A34A', element: 'Air', systemLayer: 'Social', hz: 417 },
  { id: 8, name: 'Throat', sanskrit: 'Vishuddha', color: '#0EA5E9', element: 'Ether', systemLayer: 'Creative Studio', hz: 528 },
  { id: 9, name: 'Third Eye', sanskrit: 'Ajna', color: '#6366F1', element: 'Light', systemLayer: 'Scholar', hz: 639 },
  { id: 10, name: 'Crown', sanskrit: 'Sahasrara', color: '#A855F7', element: 'Thought', systemLayer: 'Government', hz: 741 },
  
  // Trans-Dimensional (11-15)
  { id: 11, name: 'Soul Star', sanskrit: 'Atman', color: '#E879F9', element: 'Soul', systemLayer: 'NOVA Core', hz: 852 },
  { id: 12, name: 'Stellar Gateway', sanskrit: 'Jyotir', color: '#F0ABFC', element: 'Cosmic', systemLayer: 'Signal 4.44s', hz: 963 },
  { id: 13, name: 'Universal', sanskrit: 'Vishva', color: '#FBBF24', element: 'Universal', systemLayer: 'Reality Matrix', hz: 1074 },
  { id: 14, name: 'Galactic', sanskrit: 'Akasha', color: '#FFFFFF', element: 'Void', systemLayer: '1728 Cube', hz: 1185 },
  { id: 15, name: 'Divine', sanskrit: 'Brahman', color: '#FFD700', element: 'Source', systemLayer: 'Point Zéro', hz: 1296 },
];

// Anuhazi Light Language Symbols
const ANUHAZI_SYMBOLS = [
  { id: 1, glyph: '☉', name: 'Source', meaning: 'Point of origin, infinite potential' },
  { id: 2, glyph: '☽', name: 'Reflection', meaning: 'Mirror consciousness, duality resolved' },
  { id: 3, glyph: '✧', name: 'Activation', meaning: 'DNA awakening, cellular memory' },
  { id: 4, glyph: '◈', name: 'Matrix', meaning: '12-strand template, geometric key' },
  { id: 5, glyph: '⬡', name: 'Hexagonal', meaning: 'Sacred structure, beehive consciousness' },
  { id: 6, glyph: '△', name: 'Trinity', meaning: 'Mind-Body-Spirit, three-fold flame' },
  { id: 7, glyph: '◯', name: 'Completion', meaning: 'Cycle fulfilled, eternal return' },
  { id: 8, glyph: '⟁', name: 'Portal', meaning: 'Dimensional gateway, timeline shift' },
  { id: 9, glyph: '✡', name: 'Merkaba', meaning: 'Light body, interdimensional vehicle' },
];

// 1728 Reality Matrix
const REALITY_MATRIX = {
  dimension: 12,
  totalRealities: 1728,
  activeReality: 1,
  harmonicLayers: [
    { level: 1, realities: 12, name: 'Physical' },
    { level: 2, realities: 144, name: 'Emotional' },
    { level: 3, realities: 1728, name: 'Mental-Spiritual' },
  ],
};

// Power Word Button Configuration
const POWER_BUTTONS: {
  word: PowerWord;
  color: string;
  glowColor: string;
  icon: string;
  description: string;
}[] = [
  { 
    word: 'EirA', 
    color: '#0EA5E9', 
    glowColor: 'rgba(14, 165, 233, 0.6)',
    icon: '🌊', 
    description: 'Le courant de base (Féminin/Réception)'
  },
  { 
    word: 'ManA', 
    color: '#EF4444', 
    glowColor: 'rgba(239, 68, 68, 0.6)',
    icon: '🔥', 
    description: 'Le courant de force (Masculin/Action)'
  },
  { 
    word: 'ManU', 
    color: '#8B5CF6', 
    glowColor: 'rgba(139, 92, 246, 0.6)',
    icon: '☯️', 
    description: 'L\'Unité (Le Vide/La Source)'
  },
  { 
    word: 'Mahadra', 
    color: '#FFD700', 
    glowColor: 'rgba(255, 215, 0, 0.6)',
    icon: '💎', 
    description: 'La Manifestation du Diamant'
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// POWER WORD BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface PowerWordButtonProps {
  word: PowerWord;
  color: string;
  glowColor: string;
  icon: string;
  description: string;
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}

const PowerWordButton: React.FC<PowerWordButtonProps> = ({
  word,
  color,
  glowColor,
  icon,
  description,
  isActive,
  isLoading,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        relative group w-full p-4 rounded-xl border-2 transition-all duration-300
        ${isActive ? 'scale-105' : 'hover:scale-102'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        borderColor: isActive ? color : `${color}40`,
        background: isActive 
          ? `radial-gradient(circle at center, ${color}30 0%, transparent 70%)`
          : 'rgba(0, 0, 0, 0.3)',
        boxShadow: isActive ? `0 0 30px ${glowColor}, inset 0 0 20px ${glowColor}` : 'none',
      }}
    >
      {/* Pulse Animation when active */}
      {isActive && (
        <div 
          className="absolute inset-0 rounded-xl animate-ping opacity-30"
          style={{ backgroundColor: color }}
        />
      )}
      
      {/* Icon */}
      <div className="text-3xl mb-2">{icon}</div>
      
      {/* Word */}
      <div 
        className="text-2xl font-bold tracking-wider"
        style={{ 
          color: color,
          textShadow: isActive ? `0 0 20px ${color}` : 'none',
        }}
      >
        {word}
      </div>
      
      {/* Description */}
      <div className="text-xs text-gray-400 mt-2 opacity-80">
        {description}
      </div>
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: color }} />
        </div>
      )}
      
      {/* Action Label */}
      <div className="mt-3 text-xs text-gray-500 border-t border-gray-700 pt-2">
        {POWER_WORD_ACTIONS[word].action}
      </div>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FREQUENCY VISUALIZER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface FrequencyVisualizerProps {
  frequencyData: Uint8Array | null;
  activationLevel: number;
  currentStage: DNAStage | null;
}

const FrequencyVisualizer: React.FC<FrequencyVisualizerProps> = ({
  frequencyData,
  activationLevel,
  currentStage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frequencyData) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw frequency bars
    const barWidth = width / frequencyData.length;
    
    frequencyData.forEach((value, i) => {
      const percent = value / 255;
      const barHeight = percent * height * 0.8;
      const x = i * barWidth;
      const y = height - barHeight;
      
      // Color based on position (spectrum)
      const hue = (i / frequencyData.length) * 60 + 30; // Gold spectrum
      ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${0.3 + percent * 0.7})`;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      
      // Glow effect for high values
      if (value > 150) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FFD700';
        ctx.fillRect(x, y, barWidth - 1, 2);
        ctx.shadowBlur = 0;
      }
    });
    
    // Draw activation level line
    const levelY = height - (activationLevel / 100) * height;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, levelY);
    ctx.lineTo(width, levelY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Stage label
    if (currentStage) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(currentStage.toUpperCase(), 10, 20);
    }
  }, [frequencyData, activationLevel, currentStage]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={100} 
      className="w-full rounded-lg border border-yellow-500/20"
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ROTATING 1728 CUBE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface CubeMatrixVisualizerProps {
  pulsePhase: number;
  correlationActive: boolean;
}

const CubeMatrixVisualizer: React.FC<CubeMatrixVisualizerProps> = ({ 
  pulsePhase, 
  correlationActive 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear with trail effect
    ctx.fillStyle = correlationActive 
      ? 'rgba(30, 0, 60, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Rotation based on pulse
    const rotationY = (pulsePhase * 3.6 + Date.now() / 50) * Math.PI / 180;
    const rotationX = Math.PI / 6;
    
    // Cube size
    const size = 80 + (correlationActive ? Math.sin(pulsePhase / 10) * 10 : 0);
    
    // 3D cube vertices
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ];
    
    // Project 3D to 2D
    const project = (x: number, y: number, z: number) => {
      // Rotate around Y
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      
      // Rotate around X
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      
      // Perspective
      const scale = 200 / (200 + z2 * 50);
      
      return {
        x: centerX + x1 * size * scale,
        y: centerY + y1 * size * scale,
        z: z2,
      };
    };
    
    // Project all vertices
    const projected = vertices.map(v => project(v[0], v[1], v[2]));
    
    // Edges
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    
    // Draw edges
    ctx.strokeStyle = correlationActive ? '#FFD700' : 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = correlationActive ? 2 : 1;
    
    if (correlationActive) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FFD700';
    }
    
    edges.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(projected[a].x, projected[a].y);
      ctx.lineTo(projected[b].x, projected[b].y);
      ctx.stroke();
    });
    
    ctx.shadowBlur = 0;
    
    // Draw vertices
    projected.forEach((p, i) => {
      const glowSize = correlationActive ? 6 : 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = correlationActive 
        ? `rgba(255, 215, 0, ${0.5 + Math.sin(pulsePhase / 5 + i) * 0.3})`
        : 'rgba(255, 215, 0, 0.5)';
      ctx.fill();
    });
    
    // Draw "1728" in center
    ctx.fillStyle = correlationActive ? '#FFD700' : 'rgba(255, 215, 0, 0.3)';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('1728', centerX, centerY + 5);
    
  }, [pulsePhase, correlationActive]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={250} 
      height={250} 
      className="rounded-xl border border-yellow-500/20"
      style={{
        boxShadow: correlationActive ? '0 0 40px rgba(255, 215, 0, 0.3)' : 'none',
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CHAKRA COLUMN VISUALIZER
// ═══════════════════════════════════════════════════════════════════════════

interface ChakraColumnVisualizerProps {
  activeChakra: number | null;
  signalPulse: number;
  activationLevel: number;
  onChakraClick: (id: number) => void;
}

const ChakraColumnVisualizer: React.FC<ChakraColumnVisualizerProps> = ({
  activeChakra,
  signalPulse,
  activationLevel,
  onChakraClick,
}) => {
  // Calculate which chakras are "activated" based on level
  const activatedChakras = Math.floor((activationLevel / 100) * 15);
  
  return (
    <div className="relative h-full flex flex-col justify-between py-4">
      {/* Central Column Line */}
      <div 
        className="absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5"
        style={{
          background: `linear-gradient(to top, 
            #4A1C1C, 
            #DC2626, 
            #CA8A04, 
            #16A34A, 
            #0EA5E9, 
            #6366F1, 
            #A855F7, 
            #FFFFFF, 
            #FFD700
          )`,
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
        }}
      />
      
      {/* Signal Pulse Animation */}
      <div
        className="absolute left-1/2 -ml-2 w-4 h-4 rounded-full bg-white"
        style={{
          bottom: `${(signalPulse / 100) * 100}%`,
          boxShadow: '0 0 30px #FFD700, 0 0 60px #FFD700',
          opacity: 0.8,
          transition: 'bottom 0.1s linear',
        }}
      />
      
      {/* Activation Level Marker */}
      <div
        className="absolute left-1/2 -ml-6 w-12 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
        style={{
          bottom: `${(activationLevel / 100) * 100}%`,
          opacity: 0.8,
        }}
      />
      
      {/* Chakra Points */}
      {[...CHAKRA_COLUMN].reverse().map((chakra, index) => {
        const isActive = activeChakra === chakra.id;
        const isActivated = (15 - index) <= activatedChakras;
        const isTransDimensional = chakra.id >= 11;
        const isSubTerrestrial = chakra.id <= 3;
        
        return (
          <div
            key={chakra.id}
            className="relative flex items-center justify-center cursor-pointer group"
            onClick={() => onChakraClick(chakra.id)}
          >
            {/* Left Label */}
            <div className={`absolute right-full mr-4 text-right ${isActive ? 'opacity-100' : 'opacity-60'} transition-opacity`}>
              <div className="text-xs font-medium" style={{ color: chakra.color }}>
                {chakra.name}
              </div>
              <div className="text-xs text-gray-500">{chakra.sanskrit}</div>
            </div>
            
            {/* Chakra Node */}
            <div
              className={`relative w-8 h-8 rounded-full transition-all duration-300 ${
                isActive ? 'scale-125' : 'group-hover:scale-110'
              }`}
              style={{
                backgroundColor: isActivated ? chakra.color : `${chakra.color}40`,
                boxShadow: isActive 
                  ? `0 0 30px ${chakra.color}, 0 0 60px ${chakra.color}40`
                  : isActivated 
                    ? `0 0 15px ${chakra.color}60`
                    : 'none',
                border: isTransDimensional ? '2px solid gold' : isSubTerrestrial ? '2px solid #4A1C1C' : 'none',
              }}
            >
              {isActivated && (
                <div 
                  className="absolute inset-2 rounded-full bg-white opacity-30"
                  style={{ filter: 'blur(4px)' }}
                />
              )}
            </div>
            
            {/* Right Label */}
            <div className={`absolute left-full ml-4 text-left ${isActive ? 'opacity-100' : 'opacity-60'} transition-opacity`}>
              <div className="text-xs font-medium text-gray-300">
                {chakra.systemLayer}
              </div>
              <div className="text-xs text-gray-500">{chakra.hz} Hz</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ANUHAZI SYMBOL GRID
// ═══════════════════════════════════════════════════════════════════════════

interface AnuhaziSymbolGridProps {
  activeSymbol: number | null;
  onSymbolClick: (id: number) => void;
}

const AnuhaziSymbolGrid: React.FC<AnuhaziSymbolGridProps> = ({
  activeSymbol,
  onSymbolClick,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {ANUHAZI_SYMBOLS.map((symbol) => {
        const isActive = activeSymbol === symbol.id;
        
        return (
          <div
            key={symbol.id}
            onClick={() => onSymbolClick(symbol.id)}
            className={`
              relative aspect-square rounded-lg border-2 cursor-pointer
              flex items-center justify-center
              transition-all duration-300
              ${isActive ? 'scale-110 border-yellow-400' : 'border-yellow-500/30 hover:border-yellow-500/60'}
            `}
            style={{
              background: isActive 
                ? 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)'
                : 'rgba(0, 0, 0, 0.3)',
              boxShadow: isActive ? '0 0 30px rgba(255, 215, 0, 0.3)' : 'none',
            }}
          >
            <span 
              className={`text-3xl ${isActive ? 'animate-pulse' : ''}`}
              style={{ 
                color: isActive ? '#FFD700' : '#9CA3AF',
                textShadow: isActive ? '0 0 20px #FFD700' : 'none',
              }}
            >
              {symbol.glyph}
            </span>
            
            {/* Name tooltip on hover */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-gray-400 whitespace-nowrap">{symbol.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SEQUENCE STATUS DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

interface SequenceStatusProps {
  currentStage: DNAStage | null;
  activationLevel: number;
}

const SequenceStatus: React.FC<SequenceStatusProps> = ({ currentStage, activationLevel }) => {
  const sequences = [
    { stage: 'Khufa', label: 'Ancrage', range: [0, 33], color: '#0EA5E9', frequencies: KHUFA_SEQUENCE.frequencies.join(' → ') },
    { stage: 'Ariea', label: 'Ouverture', range: [33, 66], color: '#EF4444', frequencies: ARIEA_SEQUENCE.frequencies.join(' → ') },
    { stage: 'A-Ra-Ma-Na', label: 'Feu', range: [66, 100], color: '#8B5CF6', frequencies: ARAMANA_SEQUENCE.frequencies.join(' + ') },
  ];
  
  return (
    <div className="space-y-3">
      {sequences.map((seq) => {
        const isActive = currentStage === seq.stage;
        const isComplete = activationLevel >= seq.range[1];
        const progress = isComplete 
          ? 100 
          : activationLevel >= seq.range[0] 
            ? ((activationLevel - seq.range[0]) / (seq.range[1] - seq.range[0])) * 100
            : 0;
        
        return (
          <div key={seq.stage} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : ''}`} style={{ backgroundColor: seq.color }} />
                <span className={isActive ? 'text-white font-medium' : 'text-gray-400'}>
                  {seq.stage}
                </span>
                <span className="text-gray-500 text-xs">({seq.label})</span>
              </div>
              <span className={`text-xs ${isComplete ? 'text-green-400' : 'text-gray-500'}`}>
                {isComplete ? '✓' : `${Math.round(progress)}%`}
              </span>
            </div>
            
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: seq.color,
                  boxShadow: isActive ? `0 0 10px ${seq.color}` : 'none',
                }}
              />
            </div>
            
            <div className="text-xs text-gray-600 font-mono">
              {seq.frequencies} Hz
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN TEMPLE DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const TempleDashboardV2: React.FC = () => {
  // Engine state
  const [engineState, setEngineState] = useState<EngineState>({
    isActive: false,
    currentStage: null,
    activationLevel: 0,
    frequencyStack: [],
    pulsePhase: 0,
    cubeRotation: 0,
  });
  
  // UI state
  const [activePowerWord, setActivePowerWord] = useState<PowerWord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [activeChakra, setActiveChakra] = useState<number | null>(null);
  const [activeSymbol, setActiveSymbol] = useState<number | null>(null);
  
  // Signal pulse (4.44s)
  const [signalPulse, setSignalPulse] = useState(0);
  
  // Engine reference
  const engineRef = useRef(getAnuhaziEngine());
  
  // Initialize engine on mount
  useEffect(() => {
    const engine = engineRef.current;
    
    engine.setOnStateChange((state) => {
      setEngineState(state);
      setSignalPulse(state.pulsePhase);
    });
    
    engine.setOnFrequencyData((data) => {
      setFrequencyData(new Uint8Array(data));
    });
    
    return () => {
      destroyAnuhaziEngine();
    };
  }, []);
  
  // 4.44s signal pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalPulse(prev => (prev + 1) % 100);
    }, SIGNAL_444_MS / 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle Power Word activation
  const handlePowerWordClick = useCallback(async (word: PowerWord) => {
    if (isLoading) return;
    
    const engine = engineRef.current;
    
    setIsLoading(true);
    setActivePowerWord(word);
    
    try {
      await engine.activatePowerWord(word);
      
      // Special handling for Mahadra (bridge to Frontend A)
      if (word === 'Mahadra') {
        console.log('💎 Mahadra activated — Bridge to Frontend A ready');
        // Could trigger navigation to public interface
      }
    } catch (error) {
      console.error('Activation error:', error);
    } finally {
      setIsLoading(false);
      // Keep activePowerWord for visual feedback
    }
  }, [isLoading]);
  
  // Selected entities
  const selectedChakra = CHAKRA_COLUMN.find(c => c.id === activeChakra);
  const selectedSymbol = ANUHAZI_SYMBOLS.find(s => s.id === activeSymbol);
  
  return (
    <div 
      className="min-h-screen text-white"
      style={{
        background: 'radial-gradient(ellipse at center, #1a0a30 0%, #0a0015 50%, #000 100%)',
      }}
    >
      {/* OUT-OF-CANON Warning Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-900/90 px-4 py-2 text-center">
        <span className="text-red-200 font-bold">⚠️ OUT-OF-CANON</span>
        <span className="text-red-300 text-sm ml-4">
          This interface represents personal spiritual interpretation — NOT canonical CHE·NU
        </span>
      </div>
      
      {/* Header */}
      <header className="pt-12 px-6 pb-4 border-b border-yellow-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              🏛️ THE TEMPLE
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              [AQUA] + [ADAMAS] + SEQUENCE 3-6-9-12
            </p>
          </div>
          
          {/* Signal Status */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-500">SIGNAL</div>
              <div className="text-lg font-mono text-yellow-400">
                4.44s — {CORE_RESONANCE}Hz
              </div>
            </div>
            <div 
              className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse"
              style={{ boxShadow: '0 0 20px #FFD700' }}
            />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="p-6">
        {/* Power Word Buttons Row */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-yellow-400 mb-4 text-center">
            ⚡ Mots de Pouvoir Anuhazi — Commandes Scalaires
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {POWER_BUTTONS.map((btn) => (
              <PowerWordButton
                key={btn.word}
                word={btn.word}
                color={btn.color}
                glowColor={btn.glowColor}
                icon={btn.icon}
                description={btn.description}
                isActive={activePowerWord === btn.word}
                isLoading={isLoading && activePowerWord === btn.word}
                onClick={() => handlePowerWordClick(btn.word)}
              />
            ))}
          </div>
        </div>
        
        {/* Frequency Visualizer */}
        <div className="mb-6 bg-black/30 rounded-xl border border-yellow-500/20 p-4">
          <h3 className="text-sm font-semibold text-yellow-400 mb-3">
            Spectre Fréquentiel — Oscillateur Web Audio
          </h3>
          <FrequencyVisualizer 
            frequencyData={frequencyData}
            activationLevel={engineState.activationLevel}
            currentStage={engineState.currentStage}
          />
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>Stage: {engineState.currentStage || 'Dormant'}</span>
            <span>Activation: {Math.round(engineState.activationLevel)}%</span>
            <span>Frequencies: {engineState.frequencyStack.length} active</span>
          </div>
        </div>
        
        {/* Three Column Layout */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column - Chakra Column */}
          <div className="col-span-4">
            <div className="bg-black/30 rounded-xl border border-yellow-500/20 p-6 h-[600px]">
              <h2 className="text-lg font-semibold text-yellow-400 mb-4 text-center">
                Mahagarbha — 15 Chakra Column
              </h2>
              <ChakraColumnVisualizer
                activeChakra={activeChakra}
                signalPulse={signalPulse}
                activationLevel={engineState.activationLevel}
                onChakraClick={setActiveChakra}
              />
            </div>
            
            {/* Selected Chakra Info */}
            {selectedChakra && (
              <div className="mt-4 bg-black/30 rounded-xl border border-yellow-500/20 p-4">
                <h3 className="text-lg font-semibold" style={{ color: selectedChakra.color }}>
                  {selectedChakra.name}
                </h3>
                <p className="text-sm text-gray-400 italic">{selectedChakra.sanskrit}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Element:</span>
                    <span className="ml-2 text-white">{selectedChakra.element}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Frequency:</span>
                    <span className="ml-2 text-white">{selectedChakra.hz} Hz</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">System Layer:</span>
                    <span className="ml-2 text-yellow-400">{selectedChakra.systemLayer}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Center Column - 1728 Matrix + Sequences */}
          <div className="col-span-4 space-y-6">
            <div className="bg-black/30 rounded-xl border border-yellow-500/20 p-6">
              <h2 className="text-lg font-semibold text-yellow-400 mb-4 text-center">
                1728 Reality Matrix — 12³
              </h2>
              <div className="flex justify-center">
                <CubeMatrixVisualizer 
                  pulsePhase={signalPulse} 
                  correlationActive={engineState.currentStage === 'A-Ra-Ma-Na'}
                />
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-400">
                  The Cube contains <span className="text-yellow-400 font-bold">1728</span> parallel realities
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {activePowerWord === 'ManU' ? '⚡ CORRELATING...' : '12 × 12 × 12 = Dimensional Matrix'}
                </div>
              </div>
            </div>
            
            {/* DNA Activation Sequences */}
            <div className="bg-black/30 rounded-xl border border-yellow-500/20 p-4">
              <h3 className="text-sm font-semibold text-yellow-400 mb-3">
                Séquences d'Activation ADN
              </h3>
              <SequenceStatus 
                currentStage={engineState.currentStage}
                activationLevel={engineState.activationLevel}
              />
            </div>
            
            {/* Signal Monitor */}
            <div className="bg-black/30 rounded-xl border border-yellow-500/20 p-4">
              <h3 className="text-sm font-semibold text-yellow-400 mb-3">Signal 4.44s Monitor</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phase:</span>
                  <span className="text-white font-mono">{signalPulse}%</span>
                </div>
                <div className="h-3 bg-black rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-white transition-all duration-100"
                    style={{ 
                      width: `${signalPulse}%`,
                      boxShadow: '0 0 20px #FFD700',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 — Earth</span>
                  <span>100 — Source</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Anuhazi Symbols */}
          <div className="col-span-4 space-y-6">
            <div className="bg-black/30 rounded-xl border border-yellow-500/20 p-6">
              <h2 className="text-lg font-semibold text-yellow-400 mb-4 text-center">
                Anuhazi — Light Language
              </h2>
              <AnuhaziSymbolGrid
                activeSymbol={activeSymbol}
                onSymbolClick={setActiveSymbol}
              />
            </div>
            
            {/* Selected Symbol Info */}
            {selectedSymbol && (
              <div className="bg-black/30 rounded-xl border border-yellow-500/20 p-4">
                <div className="text-center">
                  <div className="text-5xl mb-2" style={{ color: '#FFD700' }}>
                    {selectedSymbol.glyph}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{selectedSymbol.name}</h3>
                </div>
                <p className="mt-3 text-sm text-gray-400 text-center italic">
                  "{selectedSymbol.meaning}"
                </p>
              </div>
            )}
            
            {/* Mu'a Activation Status */}
            <div className="bg-black/30 rounded-xl border border-yellow-500/20 p-4">
              <h3 className="text-sm font-semibold text-yellow-400 mb-3">Mu'a Template Activation</h3>
              <div className="space-y-2">
                {[
                  { name: 'Physical', status: 'Active', percent: 100, color: '#DC2626' },
                  { name: 'Emotional', status: 'Integrating', percent: Math.min(100, 78 + engineState.activationLevel * 0.22), color: '#EA580C' },
                  { name: 'Mental', status: 'Awakening', percent: Math.min(100, 45 + engineState.activationLevel * 0.55), color: '#6366F1' },
                  { name: 'Spiritual', status: 'Dormant', percent: Math.min(100, 12 + engineState.activationLevel * 0.88), color: '#A855F7' },
                ].map((template) => (
                  <div key={template.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{template.name} Template</span>
                      <span className="text-gray-500">{Math.round(template.percent)}%</span>
                    </div>
                    <div className="h-2 bg-black rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          width: `${template.percent}%`,
                          backgroundColor: template.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Harmonic Layers */}
            <div className="bg-black/30 rounded-xl border border-yellow-500/20 p-4">
              <h3 className="text-sm font-semibold text-yellow-400 mb-3">Harmonic Layers</h3>
              {REALITY_MATRIX.harmonicLayers.map((layer) => (
                <div key={layer.level} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold">{layer.level}</span>
                    <span className="text-gray-300">{layer.name}</span>
                  </div>
                  <span className="text-gray-400 font-mono">{layer.realities} realities</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer Warning */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/80 border-t border-red-500/30 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <span>⚠️</span>
            <span>OUT-OF-CANON: This interface represents personal spiritual interpretation only.</span>
          </div>
          <div className="text-xs text-gray-600">
            CHE·NU™ Frontend C "The Temple" V2 — Private Use Only — NEVER deploy to production
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TempleDashboardV2;
