// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — BUTTON COMPONENT
// CANONICAL DESIGN SYSTEM
//
// Rules:
// - Only ONE primary action per screen
// - Buttons say what they do, not how
// - Disable actions instead of hiding them
// ═══════════════════════════════════════════════════════════════════════════════

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { colors, spacing, radius, typography, animation } from './design-tokens';

// =============================================================================
// TYPES
// =============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// =============================================================================
// STYLES
// =============================================================================

const baseStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: `${spacing.s}px`,
  fontFamily: typography.fontFamily.primary,
  fontWeight: typography.fontWeight.medium,
  lineHeight: 1,
  border: 'none',
  cursor: 'pointer',
  transition: `all ${animation.durationMs.fast} ${animation.easing.out}`,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  userSelect: 'none',
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  small: {
    padding: `${spacing.xs}px ${spacing.s}px`,
    fontSize: typography.fontSize.metadata,
    borderRadius: `${radius.s}px`,
    minHeight: '28px',
  },
  medium: {
    padding: `${spacing.s}px ${spacing.m}px`,
    fontSize: typography.fontSize.body,
    borderRadius: `${radius.m}px`,
    minHeight: '36px',
  },
  large: {
    padding: `${spacing.m}px ${spacing.l}px`,
    fontSize: typography.fontSize.section,
    borderRadius: `${radius.l}px`,
    minHeight: '44px',
  },
};

const variantStyles: Record<ButtonVariant, {
  default: React.CSSProperties;
  hover: React.CSSProperties;
  active: React.CSSProperties;
  disabled: React.CSSProperties;
}> = {
  primary: {
    default: {
      backgroundColor: colors.accent.focus,
      color: '#FFFFFF',
    },
    hover: {
      backgroundColor: colors.accent.focusHover,
    },
    active: {
      backgroundColor: colors.accent.focusActive,
      transform: 'scale(0.98)',
    },
    disabled: {
      backgroundColor: colors.text.disabled,
      color: colors.text.muted,
      cursor: 'not-allowed',
    },
  },
  secondary: {
    default: {
      backgroundColor: 'transparent',
      color: colors.text.primary,
      border: `1px solid ${colors.border.default}`,
    },
    hover: {
      backgroundColor: colors.background.hover,
      borderColor: colors.border.strong,
    },
    active: {
      backgroundColor: colors.background.active,
      transform: 'scale(0.98)',
    },
    disabled: {
      backgroundColor: 'transparent',
      color: colors.text.disabled,
      borderColor: colors.border.subtle,
      cursor: 'not-allowed',
    },
  },
  tertiary: {
    default: {
      backgroundColor: 'transparent',
      color: colors.text.secondary,
    },
    hover: {
      color: colors.text.primary,
      backgroundColor: colors.overlay.light,
    },
    active: {
      color: colors.text.primary,
      backgroundColor: colors.overlay.medium,
    },
    disabled: {
      color: colors.text.disabled,
      cursor: 'not-allowed',
    },
  },
  danger: {
    default: {
      backgroundColor: colors.accent.danger,
      color: '#FFFFFF',
    },
    hover: {
      backgroundColor: colors.accent.dangerHover,
    },
    active: {
      backgroundColor: colors.accent.dangerActive,
      transform: 'scale(0.98)',
    },
    disabled: {
      backgroundColor: colors.text.disabled,
      color: colors.text.muted,
      cursor: 'not-allowed',
    },
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      style,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    const isDisabled = disabled || loading;
    const variantStyle = variantStyles[variant];

    const computedStyle: React.CSSProperties = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyle.default,
      ...(isHovered && !isDisabled ? variantStyle.hover : {}),
      ...(isActive && !isDisabled ? variantStyle.active : {}),
      ...(isDisabled ? variantStyle.disabled : {}),
      ...(fullWidth ? { width: '100%' } : {}),
      ...style,
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={computedStyle}
        onMouseEnter={(e) => {
          setIsHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          setIsActive(false);
          onMouseLeave?.(e);
        }}
        onMouseDown={(e) => {
          setIsActive(true);
          onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          setIsActive(false);
          onMouseUp?.(e);
        }}
        {...props}
      >
        {loading ? (
          <LoadingSpinner size={size} />
        ) : (
          <>
            {leftIcon && <span style={{ display: 'flex' }}>{leftIcon}</span>}
            {children}
            {rightIcon && <span style={{ display: 'flex' }}>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// =============================================================================
// LOADING SPINNER
// =============================================================================

const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const spinnerSize = size === 'small' ? 14 : size === 'medium' ? 16 : 20;

  return (
    <svg
      width={spinnerSize}
      height={spinnerSize}
      viewBox="0 0 24 24"
      fill="none"
      style={{
        animation: 'spin 1s linear infinite',
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity={0.3}
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
};

// =============================================================================
// ICON BUTTON
// =============================================================================

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string; // Required for accessibility
  icon: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'secondary', size = 'medium', label, icon, ...props }, ref) => {
    const sizeMap = {
      small: 28,
      medium: 36,
      large: 44,
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label={label}
        title={label}
        style={{
          padding: 0,
          width: `${sizeMap[size]}px`,
          height: `${sizeMap[size]}px`,
          minHeight: 'unset',
        }}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

// =============================================================================
// BUTTON GROUP
// =============================================================================

interface ButtonGroupProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  gap?: keyof typeof spacing;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  direction = 'horizontal',
  gap = 's',
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      gap: `${spacing[gap]}px`,
    }}
  >
    {children}
  </div>
);

// =============================================================================
// EXPORTS
// =============================================================================

export default Button;
