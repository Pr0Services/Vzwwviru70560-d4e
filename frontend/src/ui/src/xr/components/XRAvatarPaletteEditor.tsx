/**
 * ============================================================
 * CHE·NU — XR AVATAR PALETTE EDITOR
 * SAFE · NON-BIOMETRIC · SYMBOLIC
 * ============================================================
 * 
 * Color palette editor for avatar customization.
 * Supports preset palettes and custom colors.
 */

import React, { useState } from 'react';

// ============================================================
// TYPES
// ============================================================

interface XRAvatarPaletteEditorProps {
  palette: string[];
  onChange: (palette: string[]) => void;
  maxColors?: number;
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

const PRESET_PALETTES = [
  {
    id: 'sacred-gold',
    name: 'Sacred Gold',
    colors: ['#D8B26A', '#C4A05C', '#E5C27A', '#B89048'],
  },
  {
    id: 'jungle-emerald',
    name: 'Jungle Emerald',
    colors: ['#3F7249', '#356340', '#4A8555', '#2D5336'],
  },
  {
    id: 'cenote-turquoise',
    name: 'Cenote Turquoise',
    colors: ['#3EB4A2', '#35A090', '#4AC5B3', '#2C8C7E'],
  },
  {
    id: 'earth-ember',
    name: 'Earth Ember',
    colors: ['#7A593A', '#6A4D32', '#8C6644', '#5A4128'],
  },
  {
    id: 'ancient-stone',
    name: 'Ancient Stone',
    colors: ['#8D8371', '#7A7263', '#9F9585', '#6B6255'],
  },
  {
    id: 'cosmic-blue',
    name: 'Cosmic Blue',
    colors: ['#1E3A5F', '#162D4A', '#264A75', '#102440'],
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    colors: ['#E67E22', '#D35400', '#F39C12', '#B84D00'],
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    colors: ['#00D9FF', '#00B8DB', '#00F0FF', '#009BB8'],
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    colors: ['#9B59B6', '#8E44AD', '#A569BD', '#7D3C98'],
  },
  {
    id: 'neutral',
    name: 'Neutral',
    colors: ['#E9E4D6', '#D4CFC1', '#F5F0E2', '#BFB9AB'],
  },
];

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
  currentPalette: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  colorSlot: {
    position: 'relative',
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    border: `2px solid ${CHENU_COLORS.shadowMoss}`,
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  },
  colorSlotActive: {
    borderColor: CHENU_COLORS.sacredGold,
    boxShadow: `0 0 0 2px ${CHENU_COLORS.sacredGold}40`,
  },
  colorInput: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  colorSlotLabel: {
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '8px',
    color: 'white',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    fontWeight: 600,
  },
  addColorButton: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    border: `2px dashed ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: CHENU_COLORS.ancientStone,
    transition: 'all 0.2s ease',
  },
  removeButton: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#E74C3C',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: 'white',
    fontWeight: 'bold',
  },
  presetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  presetItem: {
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: `2px solid transparent`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  presetItemActive: {
    borderColor: CHENU_COLORS.cenoteTurquoise,
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}10`,
  },
  presetName: {
    fontSize: '11px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
    marginBottom: '6px',
  },
  presetColors: {
    display: 'flex',
    gap: '4px',
  },
  presetColor: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '1px solid rgba(0,0,0,0.2)',
  },
  hexInput: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '12px',
    fontFamily: 'monospace',
    width: '100%',
    outline: 'none',
  },
  colorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '6px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  colorPreview: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRAvatarPaletteEditor: React.FC<XRAvatarPaletteEditorProps> = ({
  palette,
  onChange,
  maxColors = 4,
  disabled = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Check if palette matches a preset
  const activePreset = PRESET_PALETTES.find(
    preset =>
      preset.colors.length === palette.length &&
      preset.colors.every((c, i) => c.toLowerCase() === palette[i]?.toLowerCase())
  );

  const handleColorChange = (index: number, color: string) => {
    const newPalette = [...palette];
    newPalette[index] = color;
    onChange(newPalette);
  };

  const handleAddColor = () => {
    if (palette.length < maxColors) {
      onChange([...palette, CHENU_COLORS.ancientStone]);
    }
  };

  const handleRemoveColor = (index: number) => {
    if (palette.length > 1) {
      const newPalette = palette.filter((_, i) => i !== index);
      onChange(newPalette);
      if (selectedIndex === index) {
        setSelectedIndex(null);
      }
    }
  };

  const handlePresetSelect = (presetColors: string[]) => {
    if (!disabled) {
      onChange([...presetColors]);
      setSelectedIndex(null);
    }
  };

  const handleHexInput = (hex: string) => {
    if (selectedIndex !== null && /^#[0-9A-Fa-f]{6}$/.test(hex)) {
      handleColorChange(selectedIndex, hex);
    }
  };

  return (
    <div style={styles.container}>
      {/* Current Palette */}
      <div style={styles.section}>
        <div style={styles.label}>
          <span>🎨</span>
          Color Palette
        </div>
        <div style={styles.currentPalette}>
          {palette.map((color, index) => (
            <div
              key={index}
              style={{
                ...styles.colorSlot,
                ...(selectedIndex === index ? styles.colorSlotActive : {}),
                backgroundColor: color,
                opacity: disabled ? 0.5 : 1,
              }}
              onClick={() => !disabled && setSelectedIndex(index)}
            >
              <input
                type="color"
                value={color}
                onChange={e => handleColorChange(index, e.target.value)}
                disabled={disabled}
                style={styles.colorInput}
              />
              <span style={styles.colorSlotLabel}>{index + 1}</span>
              {palette.length > 1 && !disabled && (
                <button
                  style={styles.removeButton}
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveColor(index);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {palette.length < maxColors && !disabled && (
            <button style={styles.addColorButton} onClick={handleAddColor}>
              +
            </button>
          )}
        </div>
      </div>

      {/* Selected Color Info */}
      {selectedIndex !== null && (
        <div style={styles.colorInfo}>
          <div
            style={{
              ...styles.colorPreview,
              backgroundColor: palette[selectedIndex],
            }}
          />
          <span>Color {selectedIndex + 1}:</span>
          <input
            type="text"
            value={palette[selectedIndex]}
            onChange={e => handleHexInput(e.target.value)}
            disabled={disabled}
            style={{
              ...styles.hexInput,
              flex: 1,
            }}
            placeholder="#000000"
          />
        </div>
      )}

      {/* Preset Palettes */}
      <div style={styles.section}>
        <div style={styles.label}>
          <span>📦</span>
          Preset Palettes
        </div>
        <div style={styles.presetGrid}>
          {PRESET_PALETTES.map(preset => (
            <div
              key={preset.id}
              style={{
                ...styles.presetItem,
                ...(activePreset?.id === preset.id ? styles.presetItemActive : {}),
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
              onClick={() => handlePresetSelect(preset.colors)}
            >
              <div style={styles.presetName}>{preset.name}</div>
              <div style={styles.presetColors}>
                {preset.colors.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.presetColor,
                      backgroundColor: color,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default XRAvatarPaletteEditor;
