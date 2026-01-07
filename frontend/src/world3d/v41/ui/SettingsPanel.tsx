/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 UI — SETTINGS PANEL
 * Complete settings interface with real-time controls
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import type { QualityPreset, PerformanceStats, QualitySettings } from '../CHENU_V41_POLISH/QualityAutoDetect';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SettingsPanelProps {
  // State
  quality: QualitySettings;
  performance: PerformanceStats;
  adaptiveQualityEnabled: boolean;
  
  // Callbacks
  onQualityChange: (preset: QualityPreset) => void;
  onAdaptiveQualityToggle: (enabled: boolean) => void;
  onBloomChange: (strength: number, threshold: number) => void;
  onParticleCountChange: (count: number) => void;
  onFogDensityChange: (density: number) => void;
  onReset: () => void;
  
  // Display
  position?: 'left' | 'right';
  defaultOpen?: boolean;
}

interface SettingsSection {
  id: string;
  label: string;
  icon: string;
  expanded: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS PANEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  quality,
  performance,
  adaptiveQualityEnabled,
  onQualityChange,
  onAdaptiveQualityToggle,
  onBloomChange,
  onParticleCountChange,
  onFogDensityChange,
  onReset,
  position = 'right',
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [sections, setSections] = useState<SettingsSection[]>([
    { id: 'quality', label: 'Quality', icon: '⚙️', expanded: true },
    { id: 'postfx', label: 'Post-Processing', icon: '✨', expanded: false },
    { id: 'atmospheric', label: 'Atmospheric', icon: '🌫️', expanded: false },
    { id: 'performance', label: 'Performance', icon: '📊', expanded: false },
  ]);

  // Local state for sliders (for smooth UI updates)
  const [bloomStrength, setBloomStrength] = useState(0.6);
  const [bloomThreshold, setBloomThreshold] = useState(0.7);
  const [particleCount, setParticleCount] = useState(2000);
  const [fogDensity, setFogDensity] = useState(0.008);

  const toggleSection = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, expanded: !s.expanded } : s
    ));
  };

  const qualityPresets: QualityPreset[] = ['minimal', 'low', 'medium', 'high', 'ultra'];
  
  const qualityColors: Record<QualityPreset, string> = {
    minimal: '#FF4444',
    low: '#FF8844',
    medium: '#FFBB44',
    high: '#88FF44',
    ultra: '#44FF88',
  };

  const panelStyles: React.CSSProperties = {
    position: 'fixed',
    [position]: isOpen ? '0' : '-380px',
    top: '0',
    height: '100vh',
    width: '360px',
    background: 'rgba(30, 31, 34, 0.98)',
    backdropFilter: 'blur(20px)',
    boxShadow: position === 'left' 
      ? '4px 0 24px rgba(0, 0, 0, 0.4)' 
      : '-4px 0 24px rgba(0, 0, 0, 0.4)',
    transition: `${position} 0.3s ease`,
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    color: '#FFFFFF',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    overflowY: 'auto',
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          [position]: isOpen ? '360px' : '0',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '80px',
          background: 'rgba(30, 31, 34, 0.95)',
          border: 'none',
          borderRadius: position === 'left' ? '0 8px 8px 0' : '8px 0 0 8px',
          color: '#FFFFFF',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: `${position} 0.3s ease`,
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        {isOpen ? (position === 'left' ? '◀' : '▶') : (position === 'left' ? '▶' : '◀')}
      </button>

      {/* Settings panel */}
      <div style={panelStyles}>
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            V41 Settings
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.6 }}>
            Real-time quality & effects control
          </p>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '16px' }}>
          {/* QUALITY SECTION */}
          {sections.find(s => s.id === 'quality')?.expanded && (
            <Section
              title="Quality Preset"
              icon="⚙️"
              onToggle={() => toggleSection('quality')}
              expanded={true}
            >
              {/* Quality preset buttons */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {qualityPresets.map(preset => (
                  <button
                    key={preset}
                    onClick={() => onQualityChange(preset)}
                    disabled={quality.preset === preset}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      background: quality.preset === preset 
                        ? qualityColors[preset]
                        : 'rgba(255, 255, 255, 0.05)',
                      border: quality.preset === preset 
                        ? `2px solid ${qualityColors[preset]}`
                        : '2px solid transparent',
                      borderRadius: '6px',
                      color: quality.preset === preset ? '#000' : '#FFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: quality.preset === preset ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'uppercase',
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Adaptive quality toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>
                    Adaptive Quality
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.6 }}>
                    Auto-adjust based on FPS
                  </div>
                </div>
                <button
                  onClick={() => onAdaptiveQualityToggle(!adaptiveQualityEnabled)}
                  style={{
                    width: '48px',
                    height: '24px',
                    background: adaptiveQualityEnabled 
                      ? '#44FF88' 
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '12px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: adaptiveQualityEnabled ? '26px' : '2px',
                      width: '20px',
                      height: '20px',
                      background: '#FFF',
                      borderRadius: '50%',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </button>
              </div>

              {/* Quality info */}
              <InfoGrid>
                <InfoItem label="Pixel Ratio" value={`${quality.pixelRatio.toFixed(2)}x`} />
                <InfoItem label="Shadow Map" value={`${quality.shadowMapSize}px`} />
                <InfoItem label="Texture Quality" value={`${(quality.textureQuality * 100).toFixed(0)}%`} />
                <InfoItem label="Target FPS" value={`${quality.targetFPS}`} />
              </InfoGrid>
            </Section>
          )}

          {/* POST-PROCESSING SECTION */}
          {sections.find(s => s.id === 'postfx')?.expanded && (
            <Section
              title="Post-Processing"
              icon="✨"
              onToggle={() => toggleSection('postfx')}
              expanded={true}
            >
              {quality.enablePostProcessing ? (
                <>
                  <Slider
                    label="Bloom Strength"
                    value={bloomStrength}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={(val) => {
                      setBloomStrength(val);
                      onBloomChange(val, bloomThreshold);
                    }}
                  />
                  <Slider
                    label="Bloom Threshold"
                    value={bloomThreshold}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(val) => {
                      setBloomThreshold(val);
                      onBloomChange(bloomStrength, val);
                    }}
                  />
                  <InfoGrid>
                    <InfoItem label="Bloom Quality" value={quality.bloomQuality} />
                    <InfoItem label="FXAA" value={quality.antialias ? 'ON' : 'OFF'} />
                  </InfoGrid>
                </>
              ) : (
                <div style={{ 
                  padding: '16px', 
                  textAlign: 'center', 
                  opacity: 0.5,
                  fontSize: '13px',
                }}>
                  Post-processing disabled in current quality preset
                </div>
              )}
            </Section>
          )}

          {/* ATMOSPHERIC SECTION */}
          {sections.find(s => s.id === 'atmospheric')?.expanded && (
            <Section
              title="Atmospheric Effects"
              icon="🌫️"
              onToggle={() => toggleSection('atmospheric')}
              expanded={true}
            >
              {quality.enableAtmospheric ? (
                <>
                  <Slider
                    label="Particle Count"
                    value={particleCount}
                    min={0}
                    max={5000}
                    step={100}
                    onChange={(val) => {
                      setParticleCount(val);
                      onParticleCountChange(val);
                    }}
                  />
                  <Slider
                    label="Fog Density"
                    value={fogDensity}
                    min={0}
                    max={0.02}
                    step={0.001}
                    onChange={(val) => {
                      setFogDensity(val);
                      onFogDensityChange(val);
                    }}
                  />
                  <InfoGrid>
                    <InfoItem label="Particles" value={`${quality.particleCount}`} />
                    <InfoItem label="Fog" value={quality.enableFog ? 'ON' : 'OFF'} />
                  </InfoGrid>
                </>
              ) : (
                <div style={{ 
                  padding: '16px', 
                  textAlign: 'center', 
                  opacity: 0.5,
                  fontSize: '13px',
                }}>
                  Atmospheric effects disabled in current quality preset
                </div>
              )}
            </Section>
          )}

          {/* PERFORMANCE SECTION */}
          {sections.find(s => s.id === 'performance')?.expanded && (
            <Section
              title="Performance Monitor"
              icon="📊"
              onToggle={() => toggleSection('performance')}
              expanded={true}
            >
              {/* FPS Display */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontSize: '32px', fontWeight: 700, textAlign: 'center' }}>
                  {performance.fps.toFixed(1)}
                  <span style={{ fontSize: '16px', opacity: 0.6, marginLeft: '4px' }}>FPS</span>
                </div>
                <div style={{ fontSize: '11px', opacity: 0.6, textAlign: 'center', marginTop: '4px' }}>
                  Avg: {performance.avgFps.toFixed(1)} | Min: {performance.minFps.toFixed(1)} | Max: {performance.maxFps.toFixed(1)}
                </div>
              </div>

              {/* Performance stats */}
              <InfoGrid>
                <InfoItem label="Frame Time" value={`${performance.frameTime.toFixed(2)}ms`} />
                {performance.memoryUsed > 0 && (
                  <InfoItem label="Memory" value={`${performance.memoryUsed.toFixed(1)}MB`} />
                )}
                <InfoItem label="Draw Calls" value={`${performance.drawCalls}`} />
                <InfoItem label="Triangles" value={`${performance.triangles.toLocaleString()}`} />
              </InfoGrid>
            </Section>
          )}

          {/* Section toggles (collapsed) */}
          {sections.filter(s => !s.expanded).map(section => (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: 'none',
                borderRadius: '8px',
                color: '#FFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <span>
                {section.icon} {section.label}
              </span>
              <span style={{ opacity: 0.6 }}>▼</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <button
            onClick={onReset}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255, 68, 68, 0.2)',
              border: '2px solid #FF4444',
              borderRadius: '8px',
              color: '#FF4444',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)';
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Section: React.FC<{
  title: string;
  icon: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, icon, expanded, onToggle, children }) => (
  <div style={{ marginBottom: '16px' }}>
    <button
      onClick={onToggle}
      style={{
        width: '100%',
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: 'none',
        borderRadius: '8px 8px 0 0',
        color: '#FFF',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '14px',
        fontWeight: 600,
      }}
    >
      <span>
        {icon} {title}
      </span>
      <span style={{ opacity: 0.6 }}>{expanded ? '▲' : '▼'}</span>
    </button>
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '0 0 8px 8px',
        padding: '16px',
      }}
    >
      {children}
    </div>
  </div>
);

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}> = ({ label, value, min, max, step, onChange }) => (
  <div style={{ marginBottom: '16px' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '13px',
      }}
    >
      <span>{label}</span>
      <span style={{ fontWeight: 600 }}>{value.toFixed(step >= 1 ? 0 : 2)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      style={{
        width: '100%',
        height: '4px',
        borderRadius: '2px',
        background: 'rgba(255, 255, 255, 0.1)',
        outline: 'none',
        cursor: 'pointer',
      }}
    />
  </div>
);

const InfoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      marginTop: '12px',
    }}
  >
    {children}
  </div>
);

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      padding: '8px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '6px',
      fontSize: '11px',
    }}
  >
    <div style={{ opacity: 0.6, marginBottom: '2px' }}>{label}</div>
    <div style={{ fontWeight: 600 }}>{value}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default SettingsPanel;
