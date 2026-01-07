// CHE·NU™ Settings Panel Components
// Comprehensive settings management with sections, preferences, and controls

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type SettingType = 
  | 'toggle'
  | 'select'
  | 'input'
  | 'textarea'
  | 'slider'
  | 'color'
  | 'radio'
  | 'checkbox'
  | 'number'
  | 'date'
  | 'time'
  | 'file'
  | 'custom';

interface SettingOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface SettingItem {
  id: string;
  type: SettingType;
  label: string;
  description?: string;
  value: unknown;
  defaultValue?: unknown;
  options?: SettingOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  validation?: (value: unknown) => string | null;
  onChange?: (value: unknown) => void;
  render?: (props: { value: unknown; onChange: (value: unknown) => void }) => ReactNode;
  helpText?: string;
  warning?: string;
  badge?: string;
  icon?: ReactNode;
}

interface SettingSection {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  settings: SettingItem[];
  collapsed?: boolean;
  badge?: string;
}

interface SettingsContextValue {
  settings: Record<string, any>;
  updateSetting: (id: string, value: unknown) => void;
  resetSetting: (id: string) => void;
  resetAll: () => void;
  isDirty: boolean;
  errors: Record<string, string>;
}

interface SettingsPanelProps {
  sections: SettingSection[];
  values?: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
  onSave?: (values: Record<string, any>) => void;
  onCancel?: () => void;
  showSearch?: boolean;
  showSaveButtons?: boolean;
  autoSave?: boolean;
  className?: string;
}

interface SettingsSectionProps {
  section: SettingSection;
  values: Record<string, any>;
  errors: Record<string, string>;
  onChange: (id: string, value: unknown) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface SettingItemProps {
  setting: SettingItem;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

interface PreferencesCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// CONTEXT
// ============================================================

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsPanel');
  }
  return context;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  panel: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
    backgroundColor: BRAND.softSand,
  },

  headerTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  search: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}20`,
    width: '250px',
  },

  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: 'transparent',
  },

  content: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px 0',
  },

  section: {
    marginBottom: '8px',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  sectionHeaderHover: {
    backgroundColor: BRAND.softSand,
  },

  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  sectionTitleIcon: {
    fontSize: '20px',
  },

  sectionTitleText: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  sectionDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    marginTop: '2px',
  },

  sectionBadge: {
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
    borderRadius: '100px',
  },

  sectionToggle: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    transition: 'transform 0.2s',
  },

  sectionToggleExpanded: {
    transform: 'rotate(180deg)',
  },

  sectionContent: {
    padding: '0 20px 16px',
  },

  settingRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '24px',
    padding: '16px 0',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  settingRowLast: {
    borderBottom: 'none',
  },

  settingInfo: {
    flex: 1,
    minWidth: 0,
  },

  settingLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  settingLabelIcon: {
    fontSize: '16px',
  },

  settingLabelBadge: {
    padding: '1px 6px',
    fontSize: '10px',
    fontWeight: 600,
    backgroundColor: BRAND.cenoteTurquoise,
    color: '#ffffff',
    borderRadius: '100px',
    textTransform: 'uppercase' as const,
  },

  settingDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.5,
  },

  settingHelp: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  settingWarning: {
    fontSize: '12px',
    color: '#DD6B20',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  settingError: {
    fontSize: '12px',
    color: '#E53E3E',
    marginTop: '6px',
  },

  settingControl: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },

  // Toggle switch
  toggle: {
    position: 'relative' as const,
    width: '48px',
    height: '28px',
    backgroundColor: `${BRAND.ancientStone}30`,
    borderRadius: '100px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },

  toggleChecked: {
    backgroundColor: BRAND.cenoteTurquoise,
  },

  toggleDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  toggleKnob: {
    position: 'absolute' as const,
    top: '3px',
    left: '3px',
    width: '22px',
    height: '22px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s',
  },

  toggleKnobChecked: {
    transform: 'translateX(20px)',
  },

  // Select
  select: {
    padding: '8px 32px 8px 12px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: '#ffffff',
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '8px',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '160px',
    appearance: 'none' as const,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%238D8371\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '20px',
  },

  selectFocus: {
    borderColor: BRAND.sacredGold,
    boxShadow: `0 0 0 3px ${BRAND.sacredGold}15`,
  },

  // Input
  input: {
    padding: '8px 12px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: '#ffffff',
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '8px',
    outline: 'none',
    minWidth: '200px',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },

  inputFocus: {
    borderColor: BRAND.sacredGold,
    boxShadow: `0 0 0 3px ${BRAND.sacredGold}15`,
  },

  inputError: {
    borderColor: '#E53E3E',
  },

  // Textarea
  textarea: {
    padding: '10px 12px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: '#ffffff',
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '8px',
    outline: 'none',
    minWidth: '300px',
    minHeight: '80px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },

  // Slider
  slider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '200px',
  },

  sliderTrack: {
    flex: 1,
    height: '6px',
    backgroundColor: `${BRAND.ancientStone}20`,
    borderRadius: '100px',
    position: 'relative' as const,
  },

  sliderFill: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: BRAND.cenoteTurquoise,
    borderRadius: '100px',
  },

  sliderThumb: {
    position: 'absolute' as const,
    top: '50%',
    width: '18px',
    height: '18px',
    backgroundColor: '#ffffff',
    border: `2px solid ${BRAND.cenoteTurquoise}`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },

  sliderValue: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    minWidth: '40px',
    textAlign: 'right' as const,
  },

  // Color picker
  colorPicker: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  colorSwatch: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: `2px solid ${BRAND.ancientStone}20`,
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  },

  colorSwatchActive: {
    borderColor: BRAND.sacredGold,
    boxShadow: `0 0 0 3px ${BRAND.sacredGold}30`,
  },

  colorInput: {
    width: '36px',
    height: '36px',
    padding: 0,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  colorHex: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    fontFamily: 'monospace',
  },

  // Radio group
  radioGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  radioOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}20`,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  radioOptionHover: {
    borderColor: BRAND.ancientStone,
  },

  radioOptionSelected: {
    borderColor: BRAND.cenoteTurquoise,
    backgroundColor: `${BRAND.cenoteTurquoise}08`,
  },

  radioCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: `2px solid ${BRAND.ancientStone}40`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'border-color 0.15s',
  },

  radioCircleSelected: {
    borderColor: BRAND.cenoteTurquoise,
  },

  radioDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: BRAND.cenoteTurquoise,
  },

  radioLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
  },

  radioDescription: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    marginTop: '2px',
  },

  // Checkbox group
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },

  checkboxBox: {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: `2px solid ${BRAND.ancientStone}40`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s',
  },

  checkboxBoxChecked: {
    backgroundColor: BRAND.cenoteTurquoise,
    borderColor: BRAND.cenoteTurquoise,
  },

  checkboxCheck: {
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 700,
  },

  checkboxLabel: {
    fontSize: '14px',
    color: BRAND.uiSlate,
  },

  // Footer
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderTop: `1px solid ${BRAND.ancientStone}10`,
    backgroundColor: BRAND.softSand,
  },

  footerInfo: {
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  footerActions: {
    display: 'flex',
    gap: '12px',
  },

  button: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  buttonPrimary: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  buttonPrimaryHover: {
    backgroundColor: BRAND.earthEmber,
  },

  buttonSecondary: {
    backgroundColor: '#ffffff',
    color: BRAND.uiSlate,
    border: `1px solid ${BRAND.ancientStone}30`,
  },

  buttonSecondaryHover: {
    borderColor: BRAND.ancientStone,
  },

  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  // Preferences card
  preferencesCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  preferencesCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
  },

  preferencesCardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  preferencesCardIcon: {
    fontSize: '24px',
  },

  preferencesCardTitleText: {
    fontSize: '16px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  preferencesCardDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    marginTop: '2px',
  },

  preferencesCardContent: {
    padding: '20px',
  },
};

// ============================================================
// SETTING ITEM COMPONENT
// ============================================================

function SettingItemComponent({
  setting,
  value,
  error,
  onChange,
}: SettingItemProps): JSX.Element | null {
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  if (setting.hidden) return null;

  const renderControl = () => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div
            style={{
              ...styles.toggle,
              ...(value && styles.toggleChecked),
              ...(setting.disabled && styles.toggleDisabled),
            }}
            onClick={() => !setting.disabled && onChange(!value)}
          >
            <div
              style={{
                ...styles.toggleKnob,
                ...(value && styles.toggleKnobChecked),
              }}
            />
          </div>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={setting.disabled}
            style={{
              ...styles.select,
              ...(isFocused && styles.selectFocus),
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setting.placeholder}
            disabled={setting.disabled}
            style={{
              ...styles.input,
              ...(isFocused && styles.inputFocus),
              ...(error && styles.inputError),
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            min={setting.min}
            max={setting.max}
            step={setting.step}
            placeholder={setting.placeholder}
            disabled={setting.disabled}
            style={{
              ...styles.input,
              ...(isFocused && styles.inputFocus),
              width: '120px',
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setting.placeholder}
            disabled={setting.disabled}
            style={{
              ...styles.textarea,
              ...(isFocused && styles.inputFocus),
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        );

      case 'slider':
        const min = setting.min ?? 0;
        const max = setting.max ?? 100;
        const percent = ((value - min) / (max - min)) * 100;
        return (
          <div style={styles.slider}>
            <div style={styles.sliderTrack}>
              <div style={{ ...styles.sliderFill, width: `${percent}%` }} />
              <div style={{ ...styles.sliderThumb, left: `${percent}%` }} />
            </div>
            <input
              type="range"
              value={value ?? min}
              onChange={(e) => onChange(Number(e.target.value))}
              min={min}
              max={max}
              step={setting.step ?? 1}
              disabled={setting.disabled}
              style={{ position: 'absolute', width: '100%', opacity: 0, cursor: 'pointer' }}
            />
            <span style={styles.sliderValue}>{value ?? min}</span>
          </div>
        );

      case 'color':
        return (
          <div style={styles.colorPicker}>
            <div
              style={{
                ...styles.colorSwatch,
                backgroundColor: value || '#ffffff',
              }}
            />
            <input
              type="color"
              value={value || '#ffffff'}
              onChange={(e) => onChange(e.target.value)}
              disabled={setting.disabled}
              style={styles.colorInput}
            />
            <span style={styles.colorHex}>{value || '#ffffff'}</span>
          </div>
        );

      case 'radio':
        return (
          <div style={styles.radioGroup}>
            {setting.options?.map((option) => {
              const isSelected = value === option.value;
              const isHovered = hoveredOption === String(option.value);
              return (
                <div
                  key={option.value}
                  style={{
                    ...styles.radioOption,
                    ...(isHovered && !isSelected && styles.radioOptionHover),
                    ...(isSelected && styles.radioOptionSelected),
                  }}
                  onClick={() => !option.disabled && onChange(option.value)}
                  onMouseEnter={() => setHoveredOption(String(option.value))}
                  onMouseLeave={() => setHoveredOption(null)}
                >
                  <div
                    style={{
                      ...styles.radioCircle,
                      ...(isSelected && styles.radioCircleSelected),
                    }}
                  >
                    {isSelected && <div style={styles.radioDot} />}
                  </div>
                  <div>
                    <div style={styles.radioLabel}>{option.label}</div>
                    {option.description && (
                      <div style={styles.radioDescription}>{option.description}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'checkbox':
        const checkedValues = Array.isArray(value) ? value : [];
        return (
          <div style={styles.checkboxGroup}>
            {setting.options?.map((option) => {
              const isChecked = checkedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  style={styles.checkbox}
                  onClick={() => {
                    if (option.disabled) return;
                    const newValues = isChecked
                      ? checkedValues.filter((v) => v !== option.value)
                      : [...checkedValues, option.value];
                    onChange(newValues);
                  }}
                >
                  <div
                    style={{
                      ...styles.checkboxBox,
                      ...(isChecked && styles.checkboxBoxChecked),
                    }}
                  >
                    {isChecked && <span style={styles.checkboxCheck}>✓</span>}
                  </div>
                  <span style={styles.checkboxLabel}>{option.label}</span>
                </div>
              );
            })}
          </div>
        );

      case 'custom':
        if (setting.render) {
          return setting.render({ value, onChange });
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div style={styles.settingRow}>
      <div style={styles.settingInfo}>
        <div style={styles.settingLabel}>
          {setting.icon && <span style={styles.settingLabelIcon}>{setting.icon}</span>}
          {setting.label}
          {setting.badge && <span style={styles.settingLabelBadge}>{setting.badge}</span>}
        </div>
        {setting.description && (
          <div style={styles.settingDescription}>{setting.description}</div>
        )}
        {setting.helpText && (
          <div style={styles.settingHelp}>ℹ️ {setting.helpText}</div>
        )}
        {setting.warning && (
          <div style={styles.settingWarning}>⚠️ {setting.warning}</div>
        )}
        {error && <div style={styles.settingError}>❌ {error}</div>}
      </div>
      <div style={styles.settingControl}>{renderControl()}</div>
    </div>
  );
}

// ============================================================
// SETTINGS SECTION COMPONENT
// ============================================================

function SettingsSectionComponent({
  section,
  values,
  errors,
  onChange,
  collapsed = false,
  onToggleCollapse,
}: SettingsSectionProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.section}>
      <div
        style={{
          ...styles.sectionHeader,
          ...(isHovered && styles.sectionHeaderHover),
        }}
        onClick={onToggleCollapse}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.sectionTitle}>
          {section.icon && <span style={styles.sectionTitleIcon}>{section.icon}</span>}
          <div>
            <div style={styles.sectionTitleText}>{section.title}</div>
            {section.description && (
              <div style={styles.sectionDescription}>{section.description}</div>
            )}
          </div>
          {section.badge && <span style={styles.sectionBadge}>{section.badge}</span>}
        </div>
        <span
          style={{
            ...styles.sectionToggle,
            ...(!collapsed && styles.sectionToggleExpanded),
          }}
        >
          ▼
        </span>
      </div>

      {!collapsed && (
        <div style={styles.sectionContent}>
          {section.settings.map((setting, index) => (
            <SettingItemComponent
              key={setting.id}
              setting={setting}
              value={values[setting.id]}
              error={errors[setting.id]}
              onChange={(value) => onChange(setting.id, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN SETTINGS PANEL COMPONENT
// ============================================================

export function SettingsPanel({
  sections,
  values: initialValues = {},
  onChange,
  onSave,
  onCancel,
  showSearch = true,
  showSaveButtons = true,
  autoSave = false,
  className,
}: SettingsPanelProps): JSX.Element {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [saveHovered, setSaveHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = useCallback((id: string, value: unknown) => {
    setValues((prev) => {
      const newValues = { ...prev, [id]: value };
      
      // Find setting and validate
      for (const section of sections) {
        const setting = section.settings.find((s) => s.id === id);
        if (setting?.validation) {
          const error = setting.validation(value);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: error || '',
          }));
        }
        if (setting?.onChange) {
          setting.onChange(value);
        }
      }

      onChange?.(newValues);

      if (autoSave) {
        onSave?.(newValues);
      }

      return newValues;
    });
  }, [sections, onChange, onSave, autoSave]);

  const handleSave = useCallback(() => {
    // Validate all
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    for (const section of sections) {
      for (const setting of section.settings) {
        if (setting.validation) {
          const error = setting.validation(values[setting.id]);
          if (error) {
            newErrors[setting.id] = error;
            hasErrors = true;
          }
        }
        if (setting.required && !values[setting.id]) {
          newErrors[setting.id] = 'This field is required';
          hasErrors = true;
        }
      }
    }

    setErrors(newErrors);

    if (!hasErrors) {
      onSave?.(values);
    }
  }, [sections, values, onSave]);

  const handleCancel = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    onCancel?.();
  }, [initialValues, onCancel]);

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Filter sections by search
  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    const query = searchQuery.toLowerCase();
    return sections
      .map((section) => ({
        ...section,
        settings: section.settings.filter(
          (setting) =>
            setting.label.toLowerCase().includes(query) ||
            setting.description?.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.settings.length > 0);
  }, [sections, searchQuery]);

  const contextValue: SettingsContextValue = {
    settings: values,
    updateSetting: handleChange,
    resetSetting: (id) => handleChange(id, initialValues[id]),
    resetAll: handleCancel,
    isDirty,
    errors,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      <div style={styles.panel} className={className}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerTitle}>Settings</span>
          {showSearch && (
            <div style={styles.search}>
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div style={styles.content}>
          {filteredSections.map((section) => (
            <SettingsSectionComponent
              key={section.id}
              section={section}
              values={values}
              errors={errors}
              onChange={handleChange}
              collapsed={collapsedSections.has(section.id)}
              onToggleCollapse={() => toggleSection(section.id)}
            />
          ))}
        </div>

        {/* Footer */}
        {showSaveButtons && (
          <div style={styles.footer}>
            <span style={styles.footerInfo}>
              {isDirty ? 'You have unsaved changes' : 'All changes saved'}
            </span>
            <div style={styles.footerActions}>
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  ...(cancelHovered && styles.buttonSecondaryHover),
                }}
                onClick={handleCancel}
                onMouseEnter={() => setCancelHovered(true)}
                onMouseLeave={() => setCancelHovered(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonPrimary,
                  ...(saveHovered && styles.buttonPrimaryHover),
                  ...(!isDirty && styles.buttonDisabled),
                }}
                onClick={handleSave}
                disabled={!isDirty}
                onMouseEnter={() => setSaveHovered(true)}
                onMouseLeave={() => setSaveHovered(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </SettingsContext.Provider>
  );
}

// ============================================================
// PREFERENCES CARD COMPONENT
// ============================================================

export function PreferencesCard({
  title,
  description,
  icon,
  children,
  actions,
  className,
}: PreferencesCardProps): JSX.Element {
  return (
    <div style={styles.preferencesCard} className={className}>
      <div style={styles.preferencesCardHeader}>
        <div style={styles.preferencesCardTitle}>
          {icon && <span style={styles.preferencesCardIcon}>{icon}</span>}
          <div>
            <div style={styles.preferencesCardTitleText}>{title}</div>
            {description && (
              <div style={styles.preferencesCardDescription}>{description}</div>
            )}
          </div>
        </div>
        {actions}
      </div>
      <div style={styles.preferencesCardContent}>{children}</div>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  SettingType,
  SettingOption,
  SettingItem,
  SettingSection,
  SettingsContextValue,
  SettingsPanelProps,
  SettingsSectionProps,
  SettingItemProps,
  PreferencesCardProps,
};

export default {
  SettingsPanel,
  PreferencesCard,
  useSettings,
};
