// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — BADGE COMPONENT
// Production-grade badges for status indicators, tags, and labels
// ═══════════════════════════════════════════════════════════════════════════════

import React, { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Badge variants
 */
export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'subtle';

/**
 * Badge sizes
 */
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Badge props
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?: BadgeVariant;
  
  /** Size */
  size?: BadgeSize;
  
  /** Left icon */
  leftIcon?: ReactNode;
  
  /** Right icon */
  rightIcon?: ReactNode;
  
  /** Dot indicator (replaces left icon) */
  dot?: boolean;
  
  /** Dot color (CSS value) */
  dotColor?: string;
  
  /** Make badge pill-shaped */
  rounded?: boolean;
  
  /** Interactive hover effect */
  interactive?: boolean;
  
  /** Removable badge (shows X button) */
  removable?: boolean;
  
  /** Callback when remove is clicked */
  onRemove?: () => void;
  
  /** Custom background color */
  bgColor?: string;
  
  /** Custom text color */
  textColor?: string;
  
  /** Sphere association */
  sphere?: string;
}

/**
 * Badge Group props
 */
export interface BadgeGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between badges */
  gap?: 'xs' | 'sm' | 'md';
  
  /** Wrap badges */
  wrap?: boolean;
}

// =============================================================================
// STYLES
// =============================================================================

const sizeStyles: Record<BadgeSize, { badge: string; icon: string; dot: string; remove: string }> = {
  xs: {
    badge: 'px-1.5 py-0.5 text-[10px] gap-1',
    icon: 'w-2.5 h-2.5',
    dot: 'w-1.5 h-1.5',
    remove: 'w-3 h-3 -mr-0.5',
  },
  sm: {
    badge: 'px-2 py-0.5 text-xs gap-1',
    icon: 'w-3 h-3',
    dot: 'w-2 h-2',
    remove: 'w-3.5 h-3.5 -mr-0.5',
  },
  md: {
    badge: 'px-2.5 py-1 text-xs gap-1.5',
    icon: 'w-3.5 h-3.5',
    dot: 'w-2 h-2',
    remove: 'w-4 h-4 -mr-1',
  },
  lg: {
    badge: 'px-3 py-1.5 text-sm gap-2',
    icon: 'w-4 h-4',
    dot: 'w-2.5 h-2.5',
    remove: 'w-4.5 h-4.5 -mr-1',
  },
};

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border?: string; dot?: string }> = {
  default: {
    bg: 'bg-[var(--color-bg-tertiary)]',
    text: 'text-[var(--color-text-secondary)]',
    dot: 'bg-[var(--color-text-tertiary)]',
  },
  primary: {
    bg: 'bg-[var(--color-brand-primary)]',
    text: 'text-white',
    dot: 'bg-white',
  },
  secondary: {
    bg: 'bg-[var(--color-brand-secondary)]',
    text: 'text-white',
    dot: 'bg-white',
  },
  success: {
    bg: 'bg-[var(--color-status-success-bg)]',
    text: 'text-[var(--color-status-success)]',
    dot: 'bg-[var(--color-status-success)]',
  },
  warning: {
    bg: 'bg-[var(--color-status-warning-bg)]',
    text: 'text-[var(--color-status-warning)]',
    dot: 'bg-[var(--color-status-warning)]',
  },
  error: {
    bg: 'bg-[var(--color-status-error-bg)]',
    text: 'text-[var(--color-status-error)]',
    dot: 'bg-[var(--color-status-error)]',
  },
  info: {
    bg: 'bg-[var(--color-status-info-bg)]',
    text: 'text-[var(--color-status-info)]',
    dot: 'bg-[var(--color-status-info)]',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-[var(--color-text-primary)]',
    border: 'border border-[var(--color-border-default)]',
    dot: 'bg-[var(--color-text-tertiary)]',
  },
  subtle: {
    bg: 'bg-[var(--color-bg-subtle)]',
    text: 'text-[var(--color-text-secondary)]',
    dot: 'bg-[var(--color-text-tertiary)]',
  },
};

// Sphere color mapping for badges
const SPHERE_BADGE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  personal: {
    bg: 'bg-[var(--sphere-personal-light)]',
    text: 'text-[var(--sphere-personal-dark)]',
    dot: 'bg-[var(--sphere-personal)]',
  },
  business: {
    bg: 'bg-[var(--sphere-business-light)]',
    text: 'text-[var(--sphere-business-dark)]',
    dot: 'bg-[var(--sphere-business)]',
  },
  creative: {
    bg: 'bg-[var(--sphere-creative-light)]',
    text: 'text-[var(--sphere-creative-dark)]',
    dot: 'bg-[var(--sphere-creative)]',
  },
  scholar: {
    bg: 'bg-[var(--sphere-scholar-light)]',
    text: 'text-[var(--sphere-scholar-dark)]',
    dot: 'bg-[var(--sphere-scholar)]',
  },
  social: {
    bg: 'bg-[var(--sphere-social-light)]',
    text: 'text-[var(--sphere-social-dark)]',
    dot: 'bg-[var(--sphere-social)]',
  },
  community: {
    bg: 'bg-[var(--sphere-community-light)]',
    text: 'text-[var(--sphere-community-dark)]',
    dot: 'bg-[var(--sphere-community)]',
  },
  xr: {
    bg: 'bg-[var(--sphere-xr-light)]',
    text: 'text-[var(--sphere-xr-dark)]',
    dot: 'bg-[var(--sphere-xr)]',
  },
  myteam: {
    bg: 'bg-[var(--sphere-myteam-light)]',
    text: 'text-[var(--sphere-myteam-dark)]',
    dot: 'bg-[var(--sphere-myteam)]',
  },
  ailab: {
    bg: 'bg-[var(--sphere-ailab-light)]',
    text: 'text-[var(--sphere-ailab-dark)]',
    dot: 'bg-[var(--sphere-ailab)]',
  },
  entertainment: {
    bg: 'bg-[var(--sphere-entertainment-light)]',
    text: 'text-[var(--sphere-entertainment-dark)]',
    dot: 'bg-[var(--sphere-entertainment)]',
  },
};

const gapStyles: Record<NonNullable<BadgeGroupProps['gap']>, string> = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
};

// =============================================================================
// REMOVE BUTTON COMPONENT
// =============================================================================

interface RemoveButtonProps {
  onClick: () => void;
  size: BadgeSize;
}

function RemoveButton({ onClick, size }: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        ${sizeStyles[size].remove}
        inline-flex items-center justify-center
        rounded-full
        hover:bg-black/10
        focus:outline-none focus:ring-1 focus:ring-current
        transition-colors duration-150
      `}
      aria-label="Remove"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

// =============================================================================
// BADGE COMPONENT
// =============================================================================

/**
 * Badge Component
 * 
 * Displays status indicators, tags, and labels with multiple variants.
 * 
 * @example
 * ```tsx
 * // Basic badge
 * <Badge>Default</Badge>
 * 
 * // Status badge with dot
 * <Badge variant="success" dot>Active</Badge>
 * 
 * // Removable tag
 * <Badge removable onRemove={handleRemove}>Tag</Badge>
 * 
 * // Sphere badge
 * <Badge sphere="business">Business</Badge>
 * 
 * // With icons
 * <Badge leftIcon={<IconStar />} variant="warning">Featured</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    {
      variant = 'default',
      size = 'md',
      leftIcon,
      rightIcon,
      dot = false,
      dotColor,
      rounded = false,
      interactive = false,
      removable = false,
      onRemove,
      bgColor,
      textColor,
      sphere,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) {
    // Determine styles based on sphere or variant
    const styleConfig = sphere && SPHERE_BADGE_STYLES[sphere]
      ? SPHERE_BADGE_STYLES[sphere]
      : variantStyles[variant];

    const sizeConfig = sizeStyles[size];

    const customStyles: React.CSSProperties = {
      ...style,
      ...(bgColor ? { backgroundColor: bgColor } : {}),
      ...(textColor ? { color: textColor } : {}),
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center
          font-medium
          ${sizeConfig.badge}
          ${bgColor ? '' : styleConfig.bg}
          ${textColor ? '' : styleConfig.text}
          ${styleConfig.border || ''}
          ${rounded ? 'rounded-full' : 'rounded-md'}
          ${interactive ? 'cursor-pointer hover:opacity-80 transition-opacity duration-150' : ''}
          ${className}
        `}
        style={customStyles}
        {...props}
      >
        {/* Dot indicator */}
        {dot && (
          <span
            className={`
              ${sizeConfig.dot}
              rounded-full
              flex-shrink-0
            `}
            style={{
              backgroundColor: dotColor || undefined,
            }}
            aria-hidden="true"
          />
        )}

        {/* Left icon */}
        {!dot && leftIcon && (
          <span className={`${sizeConfig.icon} flex-shrink-0`}>
            {leftIcon}
          </span>
        )}

        {/* Content */}
        {children}

        {/* Right icon */}
        {!removable && rightIcon && (
          <span className={`${sizeConfig.icon} flex-shrink-0`}>
            {rightIcon}
          </span>
        )}

        {/* Remove button */}
        {removable && onRemove && (
          <RemoveButton onClick={onRemove} size={size} />
        )}
      </span>
    );
  }
);

// =============================================================================
// BADGE GROUP COMPONENT
// =============================================================================

/**
 * Badge Group
 * 
 * Groups multiple badges together with consistent spacing.
 * 
 * @example
 * ```tsx
 * <BadgeGroup>
 *   <Badge variant="primary">React</Badge>
 *   <Badge variant="primary">TypeScript</Badge>
 *   <Badge variant="primary">Tailwind</Badge>
 * </BadgeGroup>
 * ```
 */
export function BadgeGroup({
  gap = 'sm',
  wrap = true,
  className = '',
  children,
  ...props
}: BadgeGroupProps): JSX.Element {
  return (
    <div
      className={`
        inline-flex items-center
        ${gapStyles[gap]}
        ${wrap ? 'flex-wrap' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// =============================================================================
// STATUS BADGE COMPONENT
// =============================================================================

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'dot'> {
  /** Status type */
  status: 'online' | 'offline' | 'busy' | 'away' | 'pending' | 'active' | 'inactive';
}

const STATUS_CONFIG: Record<StatusBadgeProps['status'], { variant: BadgeVariant; label: string; dotColor?: string }> = {
  online: { variant: 'success', label: 'En ligne' },
  offline: { variant: 'default', label: 'Hors ligne', dotColor: 'var(--color-text-tertiary)' },
  busy: { variant: 'error', label: 'Occupé' },
  away: { variant: 'warning', label: 'Absent' },
  pending: { variant: 'warning', label: 'En attente' },
  active: { variant: 'success', label: 'Actif' },
  inactive: { variant: 'default', label: 'Inactif', dotColor: 'var(--color-text-tertiary)' },
};

/**
 * Status Badge
 * 
 * Pre-configured badge for common status indicators.
 * 
 * @example
 * ```tsx
 * <StatusBadge status="online" />
 * <StatusBadge status="busy" />
 * <StatusBadge status="pending">En cours de traitement</StatusBadge>
 * ```
 */
export function StatusBadge({
  status,
  children,
  ...props
}: StatusBadgeProps): JSX.Element {
  const config = STATUS_CONFIG[status];
  
  return (
    <Badge
      variant={config.variant}
      dot
      dotColor={config.dotColor}
      {...props}
    >
      {children || config.label}
    </Badge>
  );
}

// =============================================================================
// COUNTER BADGE COMPONENT
// =============================================================================

export interface CounterBadgeProps extends Omit<BadgeProps, 'children'> {
  /** Count value */
  count: number;
  
  /** Maximum count to display (shows max+ if exceeded) */
  max?: number;
  
  /** Show zero */
  showZero?: boolean;
  
  /** Pulse animation for updates */
  pulse?: boolean;
}

/**
 * Counter Badge
 * 
 * Badge for displaying counts with optional max value.
 * 
 * @example
 * ```tsx
 * <CounterBadge count={5} />
 * <CounterBadge count={150} max={99} /> // Shows "99+"
 * <CounterBadge count={0} showZero /> // Shows "0"
 * ```
 */
export function CounterBadge({
  count,
  max = 99,
  showZero = false,
  pulse = false,
  size = 'sm',
  variant = 'primary',
  className = '',
  ...props
}: CounterBadgeProps): JSX.Element | null {
  if (count === 0 && !showZero) return null;

  const displayCount = max && count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant={variant}
      size={size}
      rounded
      className={`
        min-w-[1.25rem] justify-center
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      {displayCount}
    </Badge>
  );
}

// =============================================================================
// AGENT LEVEL BADGE COMPONENT
// =============================================================================

export interface AgentLevelBadgeProps extends Omit<BadgeProps, 'children'> {
  /** Agent level (0-3) */
  level: 0 | 1 | 2 | 3;
  
  /** Show full label */
  showLabel?: boolean;
}

const LEVEL_CONFIG: Record<number, { label: string; shortLabel: string; color: string }> = {
  0: { label: 'Orchestrateur', shortLabel: 'L0', color: 'var(--copper-500)' },
  1: { label: 'Directeur', shortLabel: 'L1', color: 'var(--steel-500)' },
  2: { label: 'Spécialiste', shortLabel: 'L2', color: 'var(--forest-500)' },
  3: { label: 'Exécutant', shortLabel: 'L3', color: 'var(--blueprint-500)' },
};

/**
 * Agent Level Badge
 * 
 * Badge for displaying AI agent hierarchy levels.
 * 
 * @example
 * ```tsx
 * <AgentLevelBadge level={0} showLabel />
 * <AgentLevelBadge level={2} />
 * ```
 */
export function AgentLevelBadge({
  level,
  showLabel = false,
  size = 'sm',
  className = '',
  ...props
}: AgentLevelBadgeProps): JSX.Element {
  const config = LEVEL_CONFIG[level];

  return (
    <Badge
      size={size}
      bgColor={`${config.color}20`}
      textColor={config.color}
      dot
      dotColor={config.color}
      className={className}
      {...props}
    >
      {showLabel ? `${config.shortLabel} - ${config.label}` : config.shortLabel}
    </Badge>
  );
}

// =============================================================================
// NOTIFICATION BADGE COMPONENT (for overlaying on other elements)
// =============================================================================

export interface NotificationBadgeProps {
  /** Count value */
  count?: number;
  
  /** Maximum count */
  max?: number;
  
  /** Show dot instead of count */
  dot?: boolean;
  
  /** Variant */
  variant?: 'primary' | 'error' | 'warning' | 'success';
  
  /** Position */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  
  /** Show zero */
  showZero?: boolean;
  
  /** Children to wrap */
  children: ReactNode;
  
  /** Additional class */
  className?: string;
}

const POSITION_CLASSES: Record<NonNullable<NotificationBadgeProps['position']>, string> = {
  'top-right': '-top-1 -right-1',
  'top-left': '-top-1 -left-1',
  'bottom-right': '-bottom-1 -right-1',
  'bottom-left': '-bottom-1 -left-1',
};

const NOTIFICATION_VARIANT_COLORS: Record<NonNullable<NotificationBadgeProps['variant']>, string> = {
  primary: 'bg-[var(--color-brand-primary)]',
  error: 'bg-[var(--color-status-error)]',
  warning: 'bg-[var(--color-status-warning)]',
  success: 'bg-[var(--color-status-success)]',
};

/**
 * Notification Badge
 * 
 * Badge that overlays on another element (like an icon).
 * 
 * @example
 * ```tsx
 * <NotificationBadge count={5}>
 *   <IconBell />
 * </NotificationBadge>
 * 
 * <NotificationBadge dot variant="error">
 *   <Avatar src="/user.jpg" />
 * </NotificationBadge>
 * ```
 */
export function NotificationBadge({
  count,
  max = 99,
  dot = false,
  variant = 'error',
  position = 'top-right',
  showZero = false,
  children,
  className = '',
}: NotificationBadgeProps): JSX.Element {
  const showBadge = dot || (count !== undefined && (count > 0 || showZero));
  const displayCount = count !== undefined && max && count > max ? `${max}+` : count;

  return (
    <span className={`relative inline-flex ${className}`}>
      {children}
      {showBadge && (
        <span
          className={`
            absolute
            ${POSITION_CLASSES[position]}
            flex items-center justify-center
            ${dot ? 'w-2.5 h-2.5' : 'min-w-[1.125rem] h-[1.125rem] px-1'}
            text-[10px] font-bold text-white
            ${NOTIFICATION_VARIANT_COLORS[variant]}
            rounded-full
            ring-2 ring-[var(--color-bg-primary)]
          `}
        >
          {!dot && displayCount}
        </span>
      )}
    </span>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Badge;
