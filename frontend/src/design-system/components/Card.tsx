// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — CARD COMPONENT
// Production-grade card with variants and interactive states
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from 'react';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Card visual variants
 */
export type CardVariant =
  | 'elevated'     // Shadow-based elevation
  | 'outlined'     // Border-based
  | 'filled'       // Solid background
  | 'ghost'        // Minimal, transparent
  | 'gradient';    // Gradient background

/**
 * Card elevation levels (for elevated variant)
 */
export type CardElevation = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Card padding sizes
 */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Card props
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: CardVariant;
  
  /** Elevation level */
  elevation?: CardElevation;
  
  /** Padding size */
  padding?: CardPadding;
  
  /** Make card interactive (hover effects) */
  interactive?: boolean;
  
  /** Make card clickable */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  
  /** Selected state */
  selected?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Full width */
  fullWidth?: boolean;
  
  /** Sphere accent color */
  sphereAccent?: string;
  
  /** Border radius override */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /** Gradient colors (for gradient variant) */
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
}

/**
 * Card Header props
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Title text */
  title?: ReactNode;
  
  /** Subtitle text */
  subtitle?: ReactNode;
  
  /** Icon to display before title */
  icon?: ReactNode;
  
  /** Action element (button, menu, etc.) */
  action?: ReactNode;
  
  /** Divider below header */
  divider?: boolean;
}

/**
 * Card Body props
 */
export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Padding override */
  padding?: CardPadding;
}

/**
 * Card Footer props
 */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Divider above footer */
  divider?: boolean;
  
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

// =============================================================================
// STYLES
// =============================================================================

const baseStyles = `
  relative
  overflow-hidden
  transition-all duration-200 ease-out
`;

const variantStyles: Record<CardVariant, string> = {
  elevated: `
    bg-[var(--color-bg-secondary)]
    border border-transparent
  `,
  outlined: `
    bg-[var(--color-bg-secondary)]
    border border-[var(--color-border-default)]
    shadow-none
  `,
  filled: `
    bg-[var(--color-bg-tertiary)]
    border border-transparent
    shadow-none
  `,
  ghost: `
    bg-transparent
    border border-transparent
    shadow-none
  `,
  gradient: `
    border border-transparent
  `,
};

const elevationStyles: Record<CardElevation, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-default',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
};

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const roundedStyles: Record<NonNullable<CardProps['rounded']>, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-3xl',
};

const interactiveStyles = `
  cursor-pointer
  hover:shadow-md
  hover:border-[var(--color-border-strong)]
  active:shadow-sm
  active:scale-[0.995]
`;

const selectedStyles = `
  ring-2 ring-[var(--color-brand-primary)] ring-offset-2
  border-[var(--color-brand-primary)]
`;

const disabledStyles = `
  opacity-50
  cursor-not-allowed
  pointer-events-none
`;

// =============================================================================
// CARD COMPONENT
// =============================================================================

/**
 * Card Component
 * 
 * A flexible container component for grouping related content.
 * Supports multiple variants, elevations, and interactive states.
 * 
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <CardHeader title="Card Title" subtitle="Subtitle" />
 *   <CardBody>Content goes here</CardBody>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * 
 * // Interactive card
 * <Card interactive onClick={handleClick}>
 *   <CardBody>Click me!</CardBody>
 * </Card>
 * 
 * // Gradient card
 * <Card variant="gradient" gradientFrom="var(--copper-500)" gradientTo="var(--copper-700)">
 *   <CardBody>Gradient background</CardBody>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(
    {
      variant = 'elevated',
      elevation = 'md',
      padding = 'none',
      interactive = false,
      onClick,
      selected = false,
      disabled = false,
      fullWidth = false,
      sphereAccent,
      rounded = 'lg',
      gradientFrom,
      gradientTo,
      gradientDirection = 'to-br',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) {
    const isClickable = interactive || !!onClick;

    // Build gradient style
    const gradientStyle =
      variant === 'gradient' && gradientFrom && gradientTo
        ? {
            background: `linear-gradient(${gradientDirection.replace('to-', 'to ')}, ${gradientFrom}, ${gradientTo})`,
          }
        : {};

    // Build sphere accent style
    const accentStyle = sphereAccent
      ? {
          borderLeftWidth: '4px',
          borderLeftColor: sphereAccent,
        }
      : {};

    const classes = [
      baseStyles,
      variantStyles[variant],
      variant === 'elevated' && elevationStyles[elevation],
      paddingStyles[padding],
      roundedStyles[rounded],
      fullWidth && 'w-full',
      isClickable && !disabled && interactiveStyles,
      selected && selectedStyles,
      disabled && disabledStyles,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (!disabled && onClick) {
        onClick(e);
      }
    };

    return (
      <div
        ref={ref}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable && !disabled ? 0 : undefined}
        aria-disabled={disabled}
        aria-selected={selected}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (isClickable && !disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick?.(e as unknown as MouseEvent<HTMLDivElement>);
          }
        }}
        className={classes}
        style={{ ...gradientStyle, ...accentStyle, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// =============================================================================
// CARD HEADER COMPONENT
// =============================================================================

/**
 * Card Header
 * 
 * @example
 * ```tsx
 * <CardHeader
 *   icon={<IconUser />}
 *   title="User Profile"
 *   subtitle="Manage your account settings"
 *   action={<IconButton icon={<IconMore />} aria-label="More options" />}
 * />
 * ```
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader(
    {
      title,
      subtitle,
      icon,
      action,
      divider = false,
      className = '',
      children,
      ...props
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`
          flex items-start justify-between gap-4
          px-4 py-3
          ${divider ? 'border-b border-[var(--color-border-subtle)]' : ''}
          ${className}
        `}
        {...props}
      >
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon */}
          {icon && (
            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-bg-subtle)] text-[var(--color-brand-primary)]">
              {icon}
            </span>
          )}

          {/* Title & Subtitle */}
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-base font-semibold text-[var(--color-text-primary)] truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 truncate">
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>

        {/* Action */}
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
);

// =============================================================================
// CARD BODY COMPONENT
// =============================================================================

/**
 * Card Body
 * 
 * @example
 * ```tsx
 * <CardBody padding="lg">
 *   <p>Card content here</p>
 * </CardBody>
 * ```
 */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  function CardBody({ padding = 'md', className = '', children, ...props }, ref) {
    return (
      <div ref={ref} className={`${paddingStyles[padding]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

// =============================================================================
// CARD FOOTER COMPONENT
// =============================================================================

/**
 * Card Footer
 * 
 * @example
 * ```tsx
 * <CardFooter divider justify="end">
 *   <Button variant="ghost">Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </CardFooter>
 * ```
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter(
    { divider = false, justify = 'end', className = '', children, ...props },
    ref
  ) {
    const justifyStyles = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    };

    return (
      <div
        ref={ref}
        className={`
          flex items-center gap-3
          px-4 py-3
          ${justifyStyles[justify]}
          ${divider ? 'border-t border-[var(--color-border-subtle)]' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// =============================================================================
// CARD IMAGE COMPONENT
// =============================================================================

export interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  /** Image source */
  src: string;
  
  /** Alt text */
  alt: string;
  
  /** Aspect ratio */
  aspectRatio?: '1/1' | '4/3' | '16/9' | '21/9' | 'auto';
  
  /** Object fit */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  
  /** Position (top or bottom of card) */
  position?: 'top' | 'bottom';
  
  /** Overlay gradient */
  overlay?: boolean;
}

/**
 * Card Image
 * 
 * @example
 * ```tsx
 * <Card>
 *   <CardImage
 *     src="/hero.jpg"
 *     alt="Hero image"
 *     aspectRatio="16/9"
 *     overlay
 *   />
 *   <CardBody>Content below image</CardBody>
 * </Card>
 * ```
 */
export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  function CardImage(
    {
      src,
      alt,
      aspectRatio = '16/9',
      objectFit = 'cover',
      position = 'top',
      overlay = false,
      className = '',
      ...props
    },
    ref
  ) {
    const aspectRatioStyles = {
      '1/1': 'aspect-square',
      '4/3': 'aspect-[4/3]',
      '16/9': 'aspect-video',
      '21/9': 'aspect-[21/9]',
      auto: 'aspect-auto',
    };

    const objectFitStyles = {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
    };

    const positionStyles = {
      top: 'rounded-t-[inherit]',
      bottom: 'rounded-b-[inherit]',
    };

    return (
      <div
        ref={ref}
        className={`
          relative
          overflow-hidden
          ${aspectRatioStyles[aspectRatio]}
          ${positionStyles[position]}
          ${className}
        `}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className={`
            w-full h-full
            ${objectFitStyles[objectFit]}
          `}
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        )}
      </div>
    );
  }
);

// =============================================================================
// STAT CARD COMPONENT
// =============================================================================

export interface StatCardProps extends Omit<CardProps, 'children'> {
  /** Stat label */
  label: string;
  
  /** Stat value */
  value: string | number;
  
  /** Change indicator */
  change?: {
    value: string | number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  
  /** Icon */
  icon?: ReactNode;
  
  /** Description */
  description?: string;
}

/**
 * Stat Card
 * 
 * A pre-composed card for displaying statistics.
 * 
 * @example
 * ```tsx
 * <StatCard
 *   label="Total Revenue"
 *   value="$45,231"
 *   change={{ value: '+12.5%', type: 'increase' }}
 *   icon={<IconDollar />}
 * />
 * ```
 */
export function StatCard({
  label,
  value,
  change,
  icon,
  description,
  className = '',
  ...cardProps
}: StatCardProps): JSX.Element {
  const changeColors = {
    increase: 'text-[var(--color-status-success)]',
    decrease: 'text-[var(--color-status-error)]',
    neutral: 'text-[var(--color-text-tertiary)]',
  };

  const changeIcons = {
    increase: '↑',
    decrease: '↓',
    neutral: '→',
  };

  return (
    <Card padding="md" className={className} {...cardProps}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-1 ${changeColors[change.type]}`}>
              <span className="mr-1">{changeIcons[change.type]}</span>
              {change.value}
            </p>
          )}
          {description && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-[var(--color-bg-subtle)] text-[var(--color-brand-primary)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Card;
