/**
 * ============================================================
 * CHE·NU — XR AVATAR TRAIT CONTROLS
 * SAFE · NON-BIOMETRIC · SYMBOLIC
 * ============================================================
 * 
 * Controls for adjusting avatar morphology traits.
 * Height slider, proportion selector, silhouette selector.
 */

import React from 'react';

// ============================================================
// TYPES
// ============================================================

interface AvatarTraits {
  height: number;
  proportions: 'balanced' | 'compact' | 'slim' | 'strong';
  silhouette: 'neutral' | 'rounded' | 'angular' | 'tall';
  colorPalette: string[];
}

interface XRAvatarTraitControlsProps {
  traits: AvatarTraits;
  onChange: (traits: Partial<AvatarTraits>) => void;
  disabled?: boolean;
}

// ============================================================
// CONSTANTS
// ============================================================

const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

const PROPORTION_OPTIONS: Array<{ value: AvatarTraits['proportions']; label: string; icon: string; description: string }> = [
  { value: 'balanced', label: 'Balanced', icon: '⬡', description: 'Standard proportions' },
  { value: 'compact', label: 'Compact', icon: '◼', description: 'Shorter, wider form' },
  { value: 'slim', label: 'Slim', icon: '▯', description: 'Taller, narrower form' },
  { value: 'strong', label: 'Strong', icon: '◆', description: 'Broader shoulders' },
];

const SILHOUETTE_OPTIONS: Array<{ value: AvatarTraits['silhouette']; label: string; icon: string; description: string }> = [
  { value: 'neutral', label: 'Neutral', icon: '○', description: 'Standard curves' },
  { value: 'rounded', label: 'Rounded', icon: '●', description: 'Soft, circular edges' },
  { value: 'angular', label: 'Angular', icon: '◇', description: 'Sharp, geometric edges' },
  { value: 'tall', label: 'Tall', icon: '⬯', description: 'Elongated form' },
];

const HEIGHT_RANGE = {
  min: 0.7,
  max: 1.5,
  step: 0.05,
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  slider: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    WebkitAppearance: 'none',
    appearance: 'none',
    backgroundColor: CHENU_COLORS.shadowMoss,
    cursor: 'pointer',
    outline: 'none',
  },
  sliderValue: {
    minWidth: '50px',
    padding: '6px 10px',
    borderRadius: '6px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    textAlign: 'center',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },
  optionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  option: {
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: `2px solid transparent`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  optionSelected: {
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}20`,
    borderColor: CHENU_COLORS.cenoteTurquoise,
  },
  optionDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  optionIcon: {
    fontSize: '24px',
  },
  optionLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  optionDescription: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    textAlign: 'center',
  },
  heightPresets: {
    display: 'flex',
    gap: '6px',
    marginTop: '8px',
  },
  heightPreset: {
    flex: 1,
    padding: '6px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    transition: 'all 0.2s ease',
  },
  heightPresetActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRAvatarTraitControls: React.FC<XRAvatarTraitControlsProps> = ({
  traits,
  onChange,
  disabled = false,
}) => {
  // Height presets
  const heightPresets = [
    { label: 'Short', value: 0.8 },
    { label: 'Average', value: 1.0 },
    { label: 'Tall', value: 1.2 },
    { label: 'Very Tall', value: 1.4 },
  ];

  const handleHeightChange = (value: number) => {
    onChange({ height: value });
  };

  const handleProportionsChange = (value: AvatarTraits['proportions']) => {
    if (!disabled) {
      onChange({ proportions: value });
    }
  };

  const handleSilhouetteChange = (value: AvatarTraits['silhouette']) => {
    if (!disabled) {
      onChange({ silhouette: value });
    }
  };

  // Get closest preset
  const closestHeightPreset = heightPresets.reduce((closest, preset) =>
    Math.abs(preset.value - traits.height) < Math.abs(closest.value - traits.height)
      ? preset
      : closest
  );

  return (
    <div style={styles.container}>
      {/* Height Slider */}
      <div style={styles.section}>
        <div style={styles.label}>
          <span>📏</span>
          Height
        </div>
        <div style={styles.sliderContainer}>
          <div style={styles.sliderRow}>
            <input
              type="range"
              min={HEIGHT_RANGE.min}
              max={HEIGHT_RANGE.max}
              step={HEIGHT_RANGE.step}
              value={traits.height}
              onChange={e => handleHeightChange(parseFloat(e.target.value))}
              disabled={disabled}
              style={{
                ...styles.slider,
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            />
            <div style={styles.sliderValue}>{traits.height.toFixed(2)}</div>
          </div>
          <div style={styles.sliderLabels}>
            <span>Short ({HEIGHT_RANGE.min})</span>
            <span>Tall ({HEIGHT_RANGE.max})</span>
          </div>
          <div style={styles.heightPresets}>
            {heightPresets.map(preset => (
              <button
                key={preset.label}
                style={{
                  ...styles.heightPreset,
                  ...(Math.abs(preset.value - traits.height) < 0.05
                    ? styles.heightPresetActive
                    : {}),
                }}
                onClick={() => handleHeightChange(preset.value)}
                disabled={disabled}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Proportions */}
      <div style={styles.section}>
        <div style={styles.label}>
          <span>⚖️</span>
          Proportions
        </div>
        <div style={styles.optionGrid}>
          {PROPORTION_OPTIONS.map(option => (
            <div
              key={option.value}
              style={{
                ...styles.option,
                ...(traits.proportions === option.value ? styles.optionSelected : {}),
                ...(disabled ? styles.optionDisabled : {}),
              }}
              onClick={() => handleProportionsChange(option.value)}
            >
              <span style={styles.optionIcon}>{option.icon}</span>
              <span style={styles.optionLabel}>{option.label}</span>
              <span style={styles.optionDescription}>{option.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Silhouette */}
      <div style={styles.section}>
        <div style={styles.label}>
          <span>🔷</span>
          Silhouette
        </div>
        <div style={styles.optionGrid}>
          {SILHOUETTE_OPTIONS.map(option => (
            <div
              key={option.value}
              style={{
                ...styles.option,
                ...(traits.silhouette === option.value ? styles.optionSelected : {}),
                ...(disabled ? styles.optionDisabled : {}),
              }}
              onClick={() => handleSilhouetteChange(option.value)}
            >
              <span style={styles.optionIcon}>{option.icon}</span>
              <span style={styles.optionLabel}>{option.label}</span>
              <span style={styles.optionDescription}>{option.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default XRAvatarTraitControls;
