// CHE·NU™ Settings — Appearance & Theme Preferences
// Complete appearance settings with theme, sphere colors, and accessibility

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';
import { 
  useTheme, 
  ThemeModeSwitcher, 
  SphereSwitcher, 
  CHENU_BRAND_COLORS,
  SPHERE_COLORS,
  SphereCode
} from '../../components/theme';

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    padding: '24px 32px',
    backgroundColor: CHENU_COLORS.uiSlate,
    minHeight: '100vh',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: {
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '8px',
  },
  
  section: {
    backgroundColor: '#111113',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionDesc: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '20px',
  },
  
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  optionCard: (isSelected: boolean) => ({
    padding: '20px',
    backgroundColor: isSelected ? CHENU_COLORS.sacredGold + '11' : '#0a0a0b',
    borderRadius: '12px',
    border: `2px solid ${isSelected ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone + '33'}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center' as const,
  }),
  optionIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  optionName: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  optionDesc: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  
  colorPalette: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  colorCard: {
    backgroundColor: '#0a0a0b',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center' as const,
  },
  colorSwatch: (color: string) => ({
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: color,
    margin: '0 auto 12px',
    border: '3px solid #1a1a1d',
  }),
  colorName: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '2px',
  },
  colorHex: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    fontFamily: 'monospace',
  },
  
  sphereGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  sphereCard: (isActive: boolean, color: string) => ({
    padding: '16px',
    backgroundColor: isActive ? `${color}11` : '#0a0a0b',
    borderRadius: '12px',
    border: `2px solid ${isActive ? color : CHENU_COLORS.ancientStone + '33'}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center' as const,
  }),
  sphereIcon: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  sphereName: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  sphereColorDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '4px',
    marginTop: '8px',
  },
  colorDot: (color: string) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color,
  }),
  
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
    marginBottom: '2px',
  },
  toggleDesc: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  toggle: (isOn: boolean) => ({
    width: '48px',
    height: '26px',
    borderRadius: '13px',
    backgroundColor: isOn ? CHENU_COLORS.sacredGold : '#333',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  }),
  toggleKnob: (isOn: boolean) => ({
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    position: 'absolute' as const,
    top: '2px',
    left: isOn ? '24px' : '2px',
    transition: 'left 0.2s ease',
  }),
  
  preview: {
    backgroundColor: '#0a0a0b',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '16px',
  },
  previewTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    marginBottom: '16px',
    textTransform: 'uppercase' as const,
  },
  previewCard: {
    padding: '20px',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    marginBottom: '12px',
  },
};

// ============================================================
// COMPONENT
// ============================================================

const SettingsAppearance: React.FC = () => {
  const { theme, setMode, setActiveSphere } = useTheme();
  const [settings, setSettings] = useState({
    reducedMotion: false,
    highContrast: false,
    compactMode: false,
    showSphereColors: true,
  });

  const SPHERES: { code: SphereCode; name: string; icon: string }[] = [
    { code: 'personal', name: 'Personal', icon: '🏠' },
    { code: 'business', name: 'Business', icon: '💼' },
    { code: 'government', name: 'Government', icon: '🏛️' },
    { code: 'studio', name: 'Studio', icon: '🎨' },
    { code: 'community', name: 'Community', icon: '👥' },
    { code: 'social', name: 'Social', icon: '📱' },
    { code: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { code: 'team', name: 'My Team', icon: '🤝' },
  ];

  const BRAND_COLORS_DISPLAY = [
    { name: 'Sacred Gold', hex: CHENU_BRAND_COLORS.sacredGold },
    { name: 'Ancient Stone', hex: CHENU_BRAND_COLORS.ancientStone },
    { name: 'Jungle Emerald', hex: CHENU_BRAND_COLORS.jungleEmerald },
    { name: 'Cenote Turquoise', hex: CHENU_BRAND_COLORS.cenoteTurquoise },
    { name: 'Shadow Moss', hex: CHENU_BRAND_COLORS.shadowMoss },
    { name: 'Earth Ember', hex: CHENU_BRAND_COLORS.earthEmber },
    { name: 'UI Slate', hex: CHENU_BRAND_COLORS.uiSlate },
    { name: 'Soft Sand', hex: CHENU_BRAND_COLORS.softSand },
  ];

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span>🎨</span> Appearance Settings
        </h1>
        <p style={styles.subtitle}>
          Customize the look and feel of your CHE·NU workspace
        </p>
      </div>

      {/* Theme Mode */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>🌓</span> Theme Mode
        </div>
        <div style={styles.sectionDesc}>
          Choose between light, dark, or system-matched appearance
        </div>
        <div style={styles.optionsGrid}>
          <div
            style={styles.optionCard(theme.mode === 'light')}
            onClick={() => setMode('light')}
          >
            <div style={styles.optionIcon}>☀️</div>
            <div style={styles.optionName}>Light</div>
            <div style={styles.optionDesc}>Bright, clean interface</div>
          </div>
          <div
            style={styles.optionCard(theme.mode === 'dark')}
            onClick={() => setMode('dark')}
          >
            <div style={styles.optionIcon}>🌙</div>
            <div style={styles.optionName}>Dark</div>
            <div style={styles.optionDesc}>Easy on the eyes</div>
          </div>
          <div
            style={styles.optionCard(theme.mode === 'system')}
            onClick={() => setMode('system')}
          >
            <div style={styles.optionIcon}>💻</div>
            <div style={styles.optionName}>System</div>
            <div style={styles.optionDesc}>Match your device</div>
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>🎨</span> CHE·NU Brand Colors
        </div>
        <div style={styles.sectionDesc}>
          The official CHE·NU color palette used throughout the interface
        </div>
        <div style={styles.colorPalette}>
          {BRAND_COLORS_DISPLAY.map(color => (
            <div key={color.name} style={styles.colorCard}>
              <div style={styles.colorSwatch(color.hex)} />
              <div style={styles.colorName}>{color.name}</div>
              <div style={styles.colorHex}>{color.hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sphere Colors */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>🌐</span> Sphere Theme Colors
        </div>
        <div style={styles.sectionDesc}>
          Click a sphere to preview its color theme across the interface
        </div>
        <div style={styles.sphereGrid}>
          {SPHERES.map(sphere => {
            const colors = SPHERE_COLORS[sphere.code];
            const isActive = theme.activeSphere === sphere.code;
            return (
              <div
                key={sphere.code}
                style={styles.sphereCard(isActive, colors.primary)}
                onClick={() => setActiveSphere(isActive ? null : sphere.code)}
              >
                <div style={styles.sphereIcon}>{sphere.icon}</div>
                <div style={styles.sphereName}>{sphere.name}</div>
                <div style={styles.sphereColorDots}>
                  <div style={styles.colorDot(colors.primary)} title="Primary" />
                  <div style={styles.colorDot(colors.secondary)} title="Secondary" />
                  <div style={styles.colorDot(colors.accent)} title="Accent" />
                </div>
              </div>
            );
          })}
        </div>
        {theme.activeSphere && (
          <div style={styles.preview}>
            <div style={styles.previewTitle}>Preview with {theme.activeSphere} theme</div>
            <div style={{
              ...styles.previewCard,
              borderColor: SPHERE_COLORS[theme.activeSphere].primary,
            }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: SPHERE_COLORS[theme.activeSphere].primary,
                marginBottom: '8px'
              }}>
                {SPHERES.find(s => s.code === theme.activeSphere)?.icon} Sample Card Title
              </div>
              <div style={{ fontSize: '14px', color: CHENU_COLORS.softSand }}>
                This is how elements will look with the {theme.activeSphere} sphere active.
              </div>
              <button style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: SPHERE_COLORS[theme.activeSphere].primary,
                border: 'none',
                borderRadius: '6px',
                color: '#000',
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                Sample Button
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Accessibility */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>♿</span> Accessibility
        </div>
        <div style={styles.sectionDesc}>
          Options to improve accessibility and comfort
        </div>
        
        <div style={styles.toggleRow}>
          <div style={styles.toggleInfo}>
            <div style={styles.toggleLabel}>Reduced Motion</div>
            <div style={styles.toggleDesc}>Minimize animations and transitions</div>
          </div>
          <div 
            style={styles.toggle(settings.reducedMotion)} 
            onClick={() => toggleSetting('reducedMotion')}
          >
            <div style={styles.toggleKnob(settings.reducedMotion)} />
          </div>
        </div>

        <div style={styles.toggleRow}>
          <div style={styles.toggleInfo}>
            <div style={styles.toggleLabel}>High Contrast</div>
            <div style={styles.toggleDesc}>Increase contrast for better visibility</div>
          </div>
          <div 
            style={styles.toggle(settings.highContrast)} 
            onClick={() => toggleSetting('highContrast')}
          >
            <div style={styles.toggleKnob(settings.highContrast)} />
          </div>
        </div>

        <div style={styles.toggleRow}>
          <div style={styles.toggleInfo}>
            <div style={styles.toggleLabel}>Compact Mode</div>
            <div style={styles.toggleDesc}>Reduce spacing for more content</div>
          </div>
          <div 
            style={styles.toggle(settings.compactMode)} 
            onClick={() => toggleSetting('compactMode')}
          >
            <div style={styles.toggleKnob(settings.compactMode)} />
          </div>
        </div>

        <div style={{ ...styles.toggleRow, borderBottom: 'none' }}>
          <div style={styles.toggleInfo}>
            <div style={styles.toggleLabel}>Show Sphere Colors</div>
            <div style={styles.toggleDesc}>Apply sphere-specific colors to interface</div>
          </div>
          <div 
            style={styles.toggle(settings.showSphereColors)} 
            onClick={() => toggleSetting('showSphereColors')}
          >
            <div style={styles.toggleKnob(settings.showSphereColors)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsAppearance;
