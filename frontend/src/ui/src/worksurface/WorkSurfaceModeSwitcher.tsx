/**
 * ============================================================
 * CHE·NU — WORKSURFACE MODE SWITCHER
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Standalone mode switching component with enhanced UI
 */

import React, { useState } from 'react';
import { CHENU_COLORS, getModeColor } from './worksurfaceStyles';

// ============================================================
// TYPES
// ============================================================

export type WorkSurfaceMode = 'text' | 'table' | 'blocks' | 'diagram' | 'summary' | 'xr_layout' | 'final';

export interface ModeConfig {
  id: WorkSurfaceMode;
  icon: string;
  label: string;
  shortLabel: string;
  description: string;
  shortcut: string;
}

export interface WorkSurfaceModeSwitcherProps {
  activeMode: WorkSurfaceMode;
  availableModes: WorkSurfaceMode[];
  onChange: (mode: WorkSurfaceMode) => void;
  variant?: 'tabs' | 'dropdown' | 'pills' | 'compact';
  showShortcuts?: boolean;
  showDescriptions?: boolean;
  disabled?: boolean;
}

// ============================================================
// MODE CONFIGURATION
// ============================================================

const MODE_CONFIGS: Record<WorkSurfaceMode, ModeConfig> = {
  text: {
    id: 'text',
    icon: '📝',
    label: 'Text Editor',
    shortLabel: 'Text',
    description: 'Free-form text editing',
    shortcut: 'Alt+1',
  },
  table: {
    id: 'table',
    icon: '📊',
    label: 'Table View',
    shortLabel: 'Table',
    description: 'Spreadsheet-like data view',
    shortcut: 'Alt+2',
  },
  blocks: {
    id: 'blocks',
    icon: '🧱',
    label: 'Block Editor',
    shortLabel: 'Blocks',
    description: 'Notion-like block organization',
    shortcut: 'Alt+3',
  },
  diagram: {
    id: 'diagram',
    icon: '🔗',
    label: 'Diagram View',
    shortLabel: 'Diagram',
    description: 'Visual node-link diagram',
    shortcut: 'Alt+4',
  },
  summary: {
    id: 'summary',
    icon: '📋',
    label: 'Summary',
    shortLabel: 'Summary',
    description: 'Condensed content overview',
    shortcut: 'Alt+5',
  },
  xr_layout: {
    id: 'xr_layout',
    icon: '🌀',
    label: 'XR Layout',
    shortLabel: 'XR',
    description: 'Extended reality preview',
    shortcut: 'Alt+6',
  },
  final: {
    id: 'final',
    icon: '📄',
    label: 'Final Document',
    shortLabel: 'Final',
    description: 'Finalized document view',
    shortcut: 'Alt+7',
  },
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    gap: '4px',
  },
  tabsContainer: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
  },
  pillsContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  compactContainer: {
    display: 'flex',
    gap: '2px',
    padding: '2px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '6px',
  },
  tab: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.textMuted,
  },
  tabActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  tabDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  pill: {
    padding: '10px 16px',
    borderRadius: '20px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    color: CHENU_COLORS.textSecondary,
  },
  pillActive: {
    borderColor: CHENU_COLORS.cenoteTurquoise,
    backgroundColor: 'rgba(62,180,162,0.2)',
    color: CHENU_COLORS.cenoteTurquoise,
  },
  compact: {
    padding: '6px 10px',
    borderRadius: '4px',
    border: 'none',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.textMuted,
  },
  compactActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: CHENU_COLORS.cardBg,
    color: CHENU_COLORS.textPrimary,
    minWidth: '160px',
    justifyContent: 'space-between',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    backgroundColor: CHENU_COLORS.cardBg,
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    borderRadius: '8px',
    padding: '4px',
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  dropdownItem: {
    padding: '10px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.15s ease',
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    color: CHENU_COLORS.textSecondary,
    fontSize: '13px',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(62,180,162,0.2)',
    color: CHENU_COLORS.cenoteTurquoise,
  },
  shortcut: {
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
    marginLeft: 'auto',
    padding: '2px 6px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '4px',
  },
  description: {
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    marginTop: '2px',
  },
};

// ============================================================
// COMPONENT VARIANTS
// ============================================================

// Tabs Variant
const TabsVariant: React.FC<{
  modes: WorkSurfaceMode[];
  activeMode: WorkSurfaceMode;
  onChange: (mode: WorkSurfaceMode) => void;
  disabled?: boolean;
  showShortcuts?: boolean;
}> = ({ modes, activeMode, onChange, disabled, showShortcuts }) => (
  <div style={styles.tabsContainer}>
    {modes.map(mode => {
      const config = MODE_CONFIGS[mode];
      const isActive = mode === activeMode;
      return (
        <button
          key={mode}
          onClick={() => !disabled && onChange(mode)}
          disabled={disabled}
          style={{
            ...styles.tab,
            ...(isActive ? { ...styles.tabActive, backgroundColor: getModeColor(mode) } : {}),
            ...(disabled ? styles.tabDisabled : {}),
          }}
          title={showShortcuts ? `${config.label} (${config.shortcut})` : config.label}
        >
          <span>{config.icon}</span>
          <span>{config.shortLabel}</span>
        </button>
      );
    })}
  </div>
);

// Pills Variant
const PillsVariant: React.FC<{
  modes: WorkSurfaceMode[];
  activeMode: WorkSurfaceMode;
  onChange: (mode: WorkSurfaceMode) => void;
  disabled?: boolean;
  showDescriptions?: boolean;
}> = ({ modes, activeMode, onChange, disabled, showDescriptions }) => (
  <div style={styles.pillsContainer}>
    {modes.map(mode => {
      const config = MODE_CONFIGS[mode];
      const isActive = mode === activeMode;
      return (
        <button
          key={mode}
          onClick={() => !disabled && onChange(mode)}
          disabled={disabled}
          style={{
            ...styles.pill,
            ...(isActive ? { ...styles.pillActive, borderColor: getModeColor(mode), color: getModeColor(mode) } : {}),
            ...(disabled ? styles.tabDisabled : {}),
            flexDirection: showDescriptions ? 'column' : 'row',
            alignItems: showDescriptions ? 'flex-start' : 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </div>
          {showDescriptions && (
            <div style={styles.description}>{config.description}</div>
          )}
        </button>
      );
    })}
  </div>
);

// Compact Variant
const CompactVariant: React.FC<{
  modes: WorkSurfaceMode[];
  activeMode: WorkSurfaceMode;
  onChange: (mode: WorkSurfaceMode) => void;
  disabled?: boolean;
}> = ({ modes, activeMode, onChange, disabled }) => (
  <div style={styles.compactContainer}>
    {modes.map(mode => {
      const config = MODE_CONFIGS[mode];
      const isActive = mode === activeMode;
      return (
        <button
          key={mode}
          onClick={() => !disabled && onChange(mode)}
          disabled={disabled}
          style={{
            ...styles.compact,
            ...(isActive ? { ...styles.compactActive, backgroundColor: getModeColor(mode) } : {}),
            ...(disabled ? styles.tabDisabled : {}),
          }}
          title={config.label}
        >
          {config.icon}
        </button>
      );
    })}
  </div>
);

// Dropdown Variant
const DropdownVariant: React.FC<{
  modes: WorkSurfaceMode[];
  activeMode: WorkSurfaceMode;
  onChange: (mode: WorkSurfaceMode) => void;
  disabled?: boolean;
  showShortcuts?: boolean;
}> = ({ modes, activeMode, onChange, disabled, showShortcuts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeConfig = MODE_CONFIGS[activeMode];
  
  return (
    <div style={styles.dropdownContainer}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          ...styles.dropdownButton,
          ...(disabled ? styles.tabDisabled : {}),
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{activeConfig.icon}</span>
          <span>{activeConfig.label}</span>
        </span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div style={styles.dropdownMenu}>
          {modes.map(mode => {
            const config = MODE_CONFIGS[mode];
            const isActive = mode === activeMode;
            return (
              <button
                key={mode}
                onClick={() => {
                  onChange(mode);
                  setIsOpen(false);
                }}
                style={{
                  ...styles.dropdownItem,
                  ...(isActive ? styles.dropdownItemActive : {}),
                }}
              >
                <span>{config.icon}</span>
                <span>{config.label}</span>
                {showShortcuts && (
                  <span style={styles.shortcut}>{config.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export const WorkSurfaceModeSwitcher: React.FC<WorkSurfaceModeSwitcherProps> = ({
  activeMode,
  availableModes,
  onChange,
  variant = 'tabs',
  showShortcuts = false,
  showDescriptions = false,
  disabled = false,
}) => {
  const commonProps = {
    modes: availableModes,
    activeMode,
    onChange,
    disabled,
  };
  
  switch (variant) {
    case 'tabs':
      return <TabsVariant {...commonProps} showShortcuts={showShortcuts} />;
    case 'pills':
      return <PillsVariant {...commonProps} showDescriptions={showDescriptions} />;
    case 'compact':
      return <CompactVariant {...commonProps} />;
    case 'dropdown':
      return <DropdownVariant {...commonProps} showShortcuts={showShortcuts} />;
    default:
      return <TabsVariant {...commonProps} showShortcuts={showShortcuts} />;
  }
};

export default WorkSurfaceModeSwitcher;
