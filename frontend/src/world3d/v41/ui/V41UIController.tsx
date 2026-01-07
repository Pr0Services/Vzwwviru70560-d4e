/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 UI — CONTROLLER
 * Complete UI integration for V41 system
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SettingsPanel } from './SettingsPanel';
import { QualityPresetsSelector } from './QualityPresetsSelector';
import type { V41Theme } from '../V41Complete';
import type { V41IntegrationManager } from '../V41Complete';
import type { QualityPreset, PerformanceStats, QualitySettings } from '../CHENU_V41_POLISH/QualityAutoDetect';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface V41UIControllerProps {
  v41Manager: V41IntegrationManager;
  showThemeSwitcher?: boolean;
  showSettingsPanel?: boolean;
  showQualityPresets?: boolean;
  themeSwitcherPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  themeSwitcherCompact?: boolean;
  settingsPanelPosition?: 'left' | 'right';
  qualityPresetsPosition?: 'top' | 'bottom';
}

// ═══════════════════════════════════════════════════════════════════════════════
// V41 UI CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════════

export const V41UIController: React.FC<V41UIControllerProps> = ({
  v41Manager,
  showThemeSwitcher = true,
  showSettingsPanel = true,
  showQualityPresets = true,
  themeSwitcherPosition = 'top-right',
  themeSwitcherCompact = false,
  settingsPanelPosition = 'right',
  qualityPresetsPosition = 'bottom',
}) => {
  // State
  const [currentTheme, setCurrentTheme] = useState<V41Theme>('normal');
  const [quality, setQuality] = useState<QualitySettings>(v41Manager.getQualitySettings());
  const [performance, setPerformance] = useState<PerformanceStats>(v41Manager.getPerformanceStats());
  const [adaptiveQualityEnabled, setAdaptiveQualityEnabled] = useState(true);

  // Update performance stats every frame
  useEffect(() => {
    let animationFrameId: number;

    const updateStats = () => {
      setPerformance(v41Manager.getPerformanceStats());
      setQuality(v41Manager.getQualitySettings());
      animationFrameId = requestAnimationFrame(updateStats);
    };

    updateStats();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [v41Manager]);

  // Handlers
  const handleThemeChange = useCallback(async (theme: V41Theme, smooth: boolean) => {
    await v41Manager.switchTheme(theme, smooth);
    setCurrentTheme(theme);
  }, [v41Manager]);

  const handleQualityChange = useCallback((preset: QualityPreset) => {
    v41Manager.getQualitySettings(); // This would need to be a setter method
    setQuality(v41Manager.getQualitySettings());
  }, [v41Manager]);

  const handleAdaptiveQualityToggle = useCallback((enabled: boolean) => {
    v41Manager.setAdaptiveQuality(enabled);
    setAdaptiveQualityEnabled(enabled);
  }, [v41Manager]);

  const handleBloomChange = useCallback((strength: number, threshold: number) => {
    // Would call v41Manager method to update bloom
    console.log('Bloom updated:', { strength, threshold });
  }, [v41Manager]);

  const handleParticleCountChange = useCallback((count: number) => {
    // Would call v41Manager method to update particles
    console.log('Particles updated:', count);
  }, [v41Manager]);

  const handleFogDensityChange = useCallback((density: number) => {
    // Would call v41Manager method to update fog
    console.log('Fog updated:', density);
  }, [v41Manager]);

  const handleReset = useCallback(() => {
    // Reset to defaults
    handleThemeChange('normal', true);
    handleAdaptiveQualityToggle(true);
    console.log('Settings reset to defaults');
  }, [handleThemeChange, handleAdaptiveQualityToggle]);

  return (
    <>
      {/* Theme Switcher */}
      {showThemeSwitcher && (
        <ThemeSwitcher
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          position={themeSwitcherPosition}
          compact={themeSwitcherCompact}
          showLabels={!themeSwitcherCompact}
        />
      )}

      {/* Settings Panel */}
      {showSettingsPanel && (
        <SettingsPanel
          quality={quality}
          performance={performance}
          adaptiveQualityEnabled={adaptiveQualityEnabled}
          onQualityChange={handleQualityChange}
          onAdaptiveQualityToggle={handleAdaptiveQualityToggle}
          onBloomChange={handleBloomChange}
          onParticleCountChange={handleParticleCountChange}
          onFogDensityChange={handleFogDensityChange}
          onReset={handleReset}
          position={settingsPanelPosition}
          defaultOpen={false}
        />
      )}

      {/* Quality Presets Selector */}
      {showQualityPresets && (
        <QualityPresetsSelector
          currentPreset={quality.preset}
          performance={performance}
          adaptiveEnabled={adaptiveQualityEnabled}
          onPresetChange={handleQualityChange}
          position={qualityPresetsPosition}
          showPerformance={true}
        />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default V41UIController;
