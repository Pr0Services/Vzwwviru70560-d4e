// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — BUTTON COMPONENT
// Production-grade button with all variants and states
// ═══════════════════════════════════════════════════════════════════════════════

import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Button visual variants
 */
export type ButtonVariant =
  | 'primary'      // Main CTA, filled with brand color
  | 'secondary'    // Secondary action, outlined
  | 'tertiary'     // Subtle action, text-only
  | 'ghost'        // Minimal, transparent background
  | 'danger'       // Destructive action
  | 'success'      // Positive action
  | 'warning';     // Caution action

/**
 * Button sizes
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  
  /** Size */
  size?: ButtonSize;
  
  /** Full width button */
  fullWidth?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Icon to display before text */
  leftIcon?: ReactNode;
  
  /** Icon to display after text */
  rightIcon?: ReactNode;
  
  /** Icon-only button (no text, just icon) */
  iconOnly?: boolean;
  
  /** Make button rounded (pill shape) */
  rounded?: boolean;
  
  /** Active/pressed state */
  active?: boolean;
}

// =============================================================================
// STYLES
// =============================================================================

const baseStyles = `
  inline-flex items-center justify-center
  font-semibold
  transition-all duration-200 ease-out
  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50
  select-none
  relative
  overflow-hidden
`;

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--color-brand-primary)]
    text-white
    hover:bg-[var(--color-brand-primary-hover)]
    active:bg-[var(--color-brand-primary-active,var(--color-brand-primary-hover))]
    focus-visible:ring-[var(--color-brand-primary)]
    shadow-sm hover:shadow-md active:shadow-sm
  `,
  secondary: `
    bg-transparent
    text-[var(--color-brand-primary)]
    border-2 border-[var(--color-brand-primary)]
    hover:bg-[var(--color-brand-primary)] hover:text-white
    active:bg-[var(--color-brand-primary-hover)] active:border-[var(--color-brand-primary-hover)]
    focus-visible:ring-[var(--color-brand-primary)]
  `,
  tertiary: `
    bg-transparent
    text-[var(--color-text-secondary)]
    hover:text-[var(--color-text-primary)]
    hover:bg-[var(--color-bg-subtle)]
    active:bg-[var(--color-bg-hover)]
    focus-visible:ring-[var(--color-brand-primary)]
  `,
  ghost: `
    bg-transparent
    text-[var(--color-text-primary)]
    hover:bg-[var(--color-bg-subtle)]
    active:bg-[var(--color-bg-hover)]
    focus-visible:ring-[var(--color-brand-primary)]
  `,
  danger: `
    bg-[var(--color-status-error)]
    text-white
    hover:bg-[var(--rust-600)]
    active:bg-[var(--rust-700)]
    focus-visible:ring-[var(--color-status-error)]
    shadow-sm hover:shadow-md active:shadow-sm
  `,
  success: `
    bg-[var(--color-status-success)]
    text-white
    hover:bg-[var(--forest-600)]
    active:bg-[var(--forest-700)]
    focus-visible:ring-[var(--color-status-success)]
    shadow-sm hover:shadow-md active:shadow-sm
  `,
  warning: `
    bg-[var(--color-status-warning)]
    text-[var(--color-text-inverse)]
    hover:bg-[var(--amber-600)]
    active:bg-[var(--amber-700)]
    focus-visible:ring-[var(--color-status-warning)]
    shadow-sm hover:shadow-md active:shadow-sm
  `,
};

const sizeStyles: Record<ButtonSize, { button: string; icon: string; text: string }> = {
  xs: {
    button: 'h-6 px-2 gap-1 text-xs rounded',
    icon: 'w-3 h-3',
    text: 'tracking-wide',
  },
  sm: {
    button: 'h-8 px-3 gap-1.5 text-sm rounded-md',
    icon: 'w-4 h-4',
    text: 'tracking-wide',
  },
  md: {
    button: 'h-10 px-4 gap-2 text-sm rounded-md',
    icon: 'w-5 h-5',
    text: 'tracking-wide',
  },
  lg: {
    button: 'h-12 px-6 gap-2 text-base rounded-lg',
    icon: 'w-5 h-5',
    text: 'tracking-normal',
  },
  xl: {
    button: 'h-14 px-8 gap-3 text-lg rounded-lg',
    icon: 'w-6 h-6',
    text: 'tracking-normal',
  },
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  xs: 'h-6 w-6 p-0',
  sm: 'h-8 w-8 p-0',
  md: 'h-10 w-10 p-0',
  lg: 'h-12 w-12 p-0',
  xl: 'h-14 w-14 p-0',
};

// =============================================================================
// LOADING SPINNER
// =============================================================================

interface SpinnerProps {
  size: ButtonSize;
  className?: string;
}

function Spinner({ size, className = '' }: SpinnerProps) {
  const sizeMap: Record<ButtonSize, number> = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  };

  const s = sizeMap[size];

  return (
    <svg
      className={`animate-spin ${className}`}
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// =============================================================================
// RIPPLE EFFECT
// =============================================================================

function createRipple(event: React.MouseEvent<HTMLButtonElement>) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: currentColor;
    border-radius: 50%;
    transform: scale(0);
    opacity: 0.3;
    pointer-events: none;
    animation: ripple 600ms ease-out forwards;
  `;

  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation to stylesheet (only once)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  if (!document.querySelector('style[data-chenu-ripple]')) {
    style.setAttribute('data-chenu-ripple', 'true');
    document.head.appendChild(style);
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Supports icons, loading states, and ripple effects.
 * 
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Save Changes
 * </Button>
 * 
 * // Button with icon
 * <Button variant="secondary" leftIcon={<IconPlus />}>
 *   Add Item
 * </Button>
 * 
 * // Loading state
 * <Button loading>
 *   Saving...
 * </Button>
 * 
 * // Icon-only button
 * <Button variant="ghost" iconOnly aria-label="Settings">
 *   <IconSettings />
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      rounded = false,
      active = false,
      disabled,
      className = '',
      children,
      onClick,
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || loading;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        createRipple(e);
        onClick?.(e);
      }
    };

    const sizeConfig = sizeStyles[size];

    const classes = [
      baseStyles,
      variantStyles[variant],
      iconOnly ? iconOnlySizeStyles[size] : sizeConfig.button,
      rounded && 'rounded-full',
      fullWidth && 'w-full',
      active && 'ring-2 ring-offset-2 ring-[var(--color-brand-primary)]',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={classes}
        onClick={handleClick}
        aria-busy={loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <Spinner size={size} className={children ? 'mr-2' : ''} />
        )}

        {/* Left icon */}
        {!loading && leftIcon && (
          <span className={`flex-shrink-0 ${sizeConfig.icon}`}>
            {leftIcon}
          </span>
        )}

        {/* Button text */}
        {!iconOnly && children && (
          <span className={`${sizeConfig.text} ${loading ? 'opacity-0' : ''}`}>
            {children}
          </span>
        )}

        {/* Icon-only children (the icon itself) */}
        {iconOnly && !loading && (
          <span className={`flex-shrink-0 ${sizeConfig.icon}`}>
            {children}
          </span>
        )}

        {/* Right icon */}
        {!loading && rightIcon && (
          <span className={`flex-shrink-0 ${sizeConfig.icon}`}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

// =============================================================================
// BUTTON GROUP
// =============================================================================

export interface ButtonGroupProps {
  /** Children buttons */
  children: ReactNode;
  
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  
  /** Size applied to all buttons */
  size?: ButtonSize;
  
  /** Variant applied to all buttons */
  variant?: ButtonVariant;
  
  /** Additional CSS class */
  className?: string;
  
  /** Attached buttons (connected visually) */
  attached?: boolean;
}

/**
 * Button Group
 * 
 * Groups multiple buttons together with proper spacing and visual connection.
 * 
 * @example
 * ```tsx
 * <ButtonGroup attached>
 *   <Button>Left</Button>
 *   <Button>Middle</Button>
 *   <Button>Right</Button>
 * </ButtonGroup>
 * ```
 */
export function ButtonGroup({
  children,
  orientation = 'horizontal',
  size,
  variant,
  className = '',
  attached = false,
}: ButtonGroupProps): JSX.Element {
  const isHorizontal = orientation === 'horizontal';

  // Clone children to apply group props
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement<ButtonProps>(child)) return child;

    const isFirst = index === 0;
    const isLast = index === React.Children.count(children) - 1;

    let borderRadius = '';
    if (attached) {
      if (isHorizontal) {
        if (isFirst) borderRadius = 'rounded-r-none';
        else if (isLast) borderRadius = 'rounded-l-none';
        else borderRadius = 'rounded-none';
      } else {
        if (isFirst) borderRadius = 'rounded-b-none';
        else if (isLast) borderRadius = 'rounded-t-none';
        else borderRadius = 'rounded-none';
      }
    }

    return React.cloneElement(child, {
      size: size ?? child.props.size,
      variant: variant ?? child.props.variant,
      className: `${child.props.className || ''} ${borderRadius} ${
        attached && !isLast
          ? isHorizontal
            ? '-mr-px'
            : '-mb-px'
          : ''
      }`,
    });
  });

  return (
    <div
      className={`
        inline-flex
        ${isHorizontal ? 'flex-row' : 'flex-col'}
        ${!attached && (isHorizontal ? 'gap-2' : 'gap-2')}
        ${className}
      `}
      role="group"
    >
      {enhancedChildren}
    </div>
  );
}

// =============================================================================
// ICON BUTTON
// =============================================================================

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'iconOnly'> {
  /** The icon to display */
  icon: ReactNode;
  
  /** Accessible label (required for icon-only buttons) */
  'aria-label': string;
}

/**
 * Icon Button
 * 
 * A button that displays only an icon. Requires aria-label for accessibility.
 * 
 * @example
 * ```tsx
 * <IconButton
 *   icon={<IconMenu />}
 *   aria-label="Open menu"
 *   variant="ghost"
 * />
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, ...props }, ref) {
    return (
      <Button ref={ref} iconOnly {...props}>
        {icon}
      </Button>
    );
  }
);

// =============================================================================
// EXPORTS
// =============================================================================

export default Button;
