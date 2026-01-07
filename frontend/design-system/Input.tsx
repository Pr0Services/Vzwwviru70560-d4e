// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — INPUT COMPONENTS
// CANONICAL DESIGN SYSTEM
//
// Inputs should be:
// - Clear and readable
// - Subtle until focused
// - Accessible with keyboard
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useState,
} from 'react';
import { colors, spacing, radius, typography, animation } from './design-tokens';

// =============================================================================
// TYPES
// =============================================================================

type InputSize = 'small' | 'medium' | 'large';
type InputState = 'default' | 'error' | 'success';

interface BaseInputProps {
  size?: InputSize;
  state?: InputState;
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

interface InputProps
  extends BaseInputProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {}

interface TextAreaProps
  extends BaseInputProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

// =============================================================================
// STYLES
// =============================================================================

const sizeStyles: Record<InputSize, React.CSSProperties> = {
  small: {
    padding: `${spacing.xs}px ${spacing.s}px`,
    fontSize: typography.fontSize.metadata,
    minHeight: '28px',
  },
  medium: {
    padding: `${spacing.s}px ${spacing.m}px`,
    fontSize: typography.fontSize.body,
    minHeight: '36px',
  },
  large: {
    padding: `${spacing.m}px ${spacing.m}px`,
    fontSize: typography.fontSize.section,
    minHeight: '44px',
  },
};

const stateColors: Record<InputState, { border: string; focusBorder: string }> = {
  default: {
    border: colors.border.default,
    focusBorder: colors.accent.focus,
  },
  error: {
    border: colors.accent.danger,
    focusBorder: colors.accent.danger,
  },
  success: {
    border: colors.accent.success,
    focusBorder: colors.accent.success,
  },
};

// =============================================================================
// INPUT COMPONENT
// =============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'medium',
      state = 'default',
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      style,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const stateColor = error ? stateColors.error : stateColors[state];

    const containerStyle: React.CSSProperties = {
      display: 'inline-flex',
      flexDirection: 'column',
      gap: `${spacing.xs}px`,
      ...(fullWidth ? { width: '100%' } : {}),
    };

    const inputWrapperStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: `${spacing.s}px`,
      backgroundColor: disabled ? colors.background.secondary : colors.background.primary,
      border: `1px solid ${isFocused ? stateColor.focusBorder : stateColor.border}`,
      borderRadius: `${radius.m}px`,
      transition: `all ${animation.durationMs.fast} ${animation.easing.out}`,
      ...sizeStyles[size],
      ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
    };

    const inputStyle: React.CSSProperties = {
      flex: 1,
      minWidth: 0,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: colors.text.primary,
      fontFamily: typography.fontFamily.primary,
      fontSize: 'inherit',
      lineHeight: typography.lineHeight.normal,
      ...(disabled ? { cursor: 'not-allowed' } : {}),
    };

    return (
      <div style={containerStyle}>
        {label && <Label htmlFor={props.id}>{label}</Label>}
        
        <div style={inputWrapperStyle}>
          {leftIcon && (
            <span style={{ color: colors.text.muted, display: 'flex' }}>{leftIcon}</span>
          )}
          <input
            ref={ref}
            disabled={disabled}
            style={{ ...inputStyle, ...style }}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && (
            <span style={{ color: colors.text.muted, display: 'flex' }}>{rightIcon}</span>
          )}
        </div>

        {(error || hint) && (
          <span
            style={{
              fontSize: typography.fontSize.metadata,
              color: error ? colors.accent.danger : colors.text.muted,
            }}
          >
            {error || hint}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// =============================================================================
// TEXTAREA COMPONENT
// =============================================================================

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      size = 'medium',
      state = 'default',
      label,
      hint,
      error,
      fullWidth = false,
      disabled,
      rows = 4,
      resize = 'vertical',
      style,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const stateColor = error ? stateColors.error : stateColors[state];

    const containerStyle: React.CSSProperties = {
      display: 'inline-flex',
      flexDirection: 'column',
      gap: `${spacing.xs}px`,
      ...(fullWidth ? { width: '100%' } : {}),
    };

    const textareaStyle: React.CSSProperties = {
      backgroundColor: disabled ? colors.background.secondary : colors.background.primary,
      border: `1px solid ${isFocused ? stateColor.focusBorder : stateColor.border}`,
      borderRadius: `${radius.m}px`,
      padding: `${spacing.s}px ${spacing.m}px`,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.primary,
      fontSize: sizeStyles[size].fontSize,
      lineHeight: typography.lineHeight.normal,
      transition: `all ${animation.durationMs.fast} ${animation.easing.out}`,
      resize,
      outline: 'none',
      ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
      ...style,
    };

    return (
      <div style={containerStyle}>
        {label && <Label htmlFor={props.id}>{label}</Label>}
        
        <textarea
          ref={ref}
          disabled={disabled}
          rows={rows}
          style={textareaStyle}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {(error || hint) && (
          <span
            style={{
              fontSize: typography.fontSize.metadata,
              color: error ? colors.accent.danger : colors.text.muted,
            }}
          >
            {error || hint}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

// =============================================================================
// LABEL
// =============================================================================

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ required, children, style, ...props }) => (
  <label
    style={{
      display: 'block',
      fontSize: typography.fontSize.metadata,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.secondary,
      ...style,
    }}
    {...props}
  >
    {children}
    {required && (
      <span style={{ color: colors.accent.danger, marginLeft: '2px' }}>*</span>
    )}
  </label>
);

// =============================================================================
// SELECT
// =============================================================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: InputSize;
  state?: InputState;
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'medium',
      state = 'default',
      label,
      hint,
      error,
      options,
      placeholder,
      fullWidth = false,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const stateColor = error ? stateColors.error : stateColors[state];

    const containerStyle: React.CSSProperties = {
      display: 'inline-flex',
      flexDirection: 'column',
      gap: `${spacing.xs}px`,
      ...(fullWidth ? { width: '100%' } : {}),
    };

    const selectStyle: React.CSSProperties = {
      appearance: 'none',
      backgroundColor: disabled ? colors.background.secondary : colors.background.primary,
      border: `1px solid ${stateColor.border}`,
      borderRadius: `${radius.m}px`,
      color: colors.text.primary,
      fontFamily: typography.fontFamily.primary,
      cursor: disabled ? 'not-allowed' : 'pointer',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A8496' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: `right ${spacing.s}px center`,
      paddingRight: `${spacing.xl}px`,
      ...sizeStyles[size],
      ...(disabled ? { opacity: 0.6 } : {}),
      ...style,
    };

    return (
      <div style={containerStyle}>
        {label && <Label htmlFor={props.id}>{label}</Label>}
        
        <select ref={ref} disabled={disabled} style={selectStyle} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {(error || hint) && (
          <span
            style={{
              fontSize: typography.fontSize.metadata,
              color: error ? colors.accent.danger : colors.text.muted,
            }}
          >
            {error || hint}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// =============================================================================
// CHECKBOX
// =============================================================================

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, disabled, style, ...props }, ref) => {
    return (
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${spacing.s}px`,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          style={{
            width: '18px',
            height: '18px',
            accentColor: colors.accent.focus,
            cursor: 'inherit',
            ...style,
          }}
          {...props}
        />
        {label && (
          <span
            style={{
              fontSize: typography.fontSize.body,
              color: colors.text.primary,
            }}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// =============================================================================
// EXPORTS
// =============================================================================

export default Input;
