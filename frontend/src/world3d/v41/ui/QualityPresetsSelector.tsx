/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 UI — QUALITY PRESETS SELECTOR
 * Quick quality preset switching with visual feedback
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { QualityPreset, PerformanceStats } from '../CHENU_V41_POLISH/QualityAutoDetect';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface QualityPresetsSelectorProps {
  currentPreset: QualityPreset;
  performance: PerformanceStats;
  adaptiveEnabled: boolean;
  onPresetChange: (preset: QualityPreset) => void;
  position?: 'top' | 'bottom';
  showPerformance?: boolean;
}

interface PresetConfig {
  id: QualityPreset;
  label: string;
  color: string;
  icon: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRESET CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const PRESETS: PresetConfig[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    color: '#FF4444',
    icon: '🥔',
    description: 'Potato mode - maximum compatibility',
  },
  {
    id: 'low',
    label: 'Low',
    color: '#FF8844',
    icon: '📱',
    description: 'Mobile optimized',
  },
  {
    id: 'medium',
    label: 'Medium',
    color: '#FFBB44',
    icon: '💻',
    description: 'Balanced quality & performance',
  },
  {
    id: 'high',
    label: 'High',
    color: '#88FF44',
    icon: '🖥️',
    description: 'High-end desktop',
  },
  {
    id: 'ultra',
    label: 'Ultra',
    color: '#44FF88',
    icon: '🚀',
    description: 'Maximum quality',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// QUALITY PRESETS SELECTOR
// ═══════════════════════════════════════════════════════════════════════════════

export const QualityPresetsSelector: React.FC<QualityPresetsSelectorProps> = ({
  currentPreset,
  performance,
  adaptiveEnabled,
  onPresetChange,
  position = 'bottom',
  showPerformance = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentConfig = PRESETS.find(p => p.id === currentPreset);

  // FPS color based on performance
  const getFPSColor = (fps: number): string => {
    if (fps >= 55) return '#44FF88'; // Great
    if (fps >= 45) return '#88FF44'; // Good
    if (fps >= 30) return '#FFBB44'; // Ok
    if (fps >= 20) return '#FF8844'; // Poor
    return '#FF4444'; // Critical
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    [position]: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 998,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  return (
    <div style={containerStyle}>
      {/* Main bar */}
      <div
        style={{
          background: 'rgba(30, 31, 34, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Performance indicator */}
        {showPerformance && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingRight: '16px',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: getFPSColor(performance.avgFps),
              }}
            >
              {performance.avgFps.toFixed(0)}
            </div>
            <div
              style={{
                fontSize: '11px',
                opacity: 0.6,
                color: '#FFF',
              }}
            >
              FPS
            </div>
          </div>
        )}

        {/* Adaptive badge */}
        {adaptiveEnabled && (
          <div
            style={{
              padding: '4px 8px',
              background: 'rgba(68, 255, 136, 0.2)',
              border: '1px solid #44FF88',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 600,
              color: '#44FF88',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Auto
          </div>
        )}

        {/* Current preset button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: `linear-gradient(135deg, ${currentConfig?.color}40, ${currentConfig?.color}20)`,
            border: `2px solid ${currentConfig?.color}`,
            borderRadius: '10px',
            padding: '8px 16px',
            color: '#FFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: '18px' }}>{currentConfig?.icon}</span>
          <span>{currentConfig?.label}</span>
          <span style={{ fontSize: '10px', opacity: 0.6 }}>
            {isExpanded ? '▲' : '▼'}
          </span>
        </button>

        {/* Quick info */}
        <div
          style={{
            fontSize: '11px',
            opacity: 0.6,
            color: '#FFF',
          }}
        >
          {currentConfig?.description}
        </div>
      </div>

      {/* Expanded presets menu */}
      {isExpanded && (
        <div
          style={{
            position: 'absolute',
            [position === 'bottom' ? 'bottom' : 'top']: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(30, 31, 34, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            minWidth: '360px',
            animation: 'slideUp 0.2s ease',
          }}
        >
          {/* Presets grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px',
            }}
          >
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onPresetChange(preset.id);
                  setIsExpanded(false);
                }}
                disabled={preset.id === currentPreset}
                style={{
                  padding: '12px 8px',
                  background: preset.id === currentPreset 
                    ? `linear-gradient(135deg, ${preset.color}40, ${preset.color}20)`
                    : 'rgba(255, 255, 255, 0.05)',
                  border: preset.id === currentPreset 
                    ? `2px solid ${preset.color}`
                    : '2px solid transparent',
                  borderRadius: '10px',
                  color: '#FFF',
                  cursor: preset.id === currentPreset ? 'default' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                  opacity: preset.id === currentPreset ? 1 : 0.7,
                }}
                onMouseEnter={(e) => {
                  if (preset.id !== currentPreset) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (preset.id !== currentPreset) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <span style={{ fontSize: '24px' }}>{preset.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 600 }}>
                  {preset.label}
                </span>
              </button>
            ))}
          </div>

          {/* Description */}
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              fontSize: '12px',
              textAlign: 'center',
              color: '#FFF',
            }}
          >
            💡 Click a preset to change quality level
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(${position === 'bottom' ? '10px' : '-10px'});
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default QualityPresetsSelector;
