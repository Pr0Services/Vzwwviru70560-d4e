// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — LOADING, PROGRESS & SKELETON COMPONENTS
// Visual feedback components for loading states
// ═══════════════════════════════════════════════════════════════════════════════

import React, { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ProgressVariant = 'default' | 'gradient' | 'striped';

// =============================================================================
// SPINNER COMPONENT
// =============================================================================

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Size */
  size?: SpinnerSize;
  
  /** Color */
  color?: string;
  
  /** Thickness */
  thickness?: number;
  
  /** Speed (in seconds) */
  speed?: number;
  
  /** Label for accessibility */
  label?: string;
}

const spinnerSizes: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

/**
 * Spinner Component
 * 
 * @example
 * ```tsx
 * <Spinner size="lg" />
 * <Spinner color="var(--color-status-success)" />
 * ```
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  function Spinner(
    {
      size = 'md',
      color = 'var(--color-brand-primary)',
      thickness = 3,
      speed = 0.75,
      label = 'Chargement...',
      className = '',
      ...props
    },
    ref
  ) {
    const s = spinnerSizes[size];

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={`inline-flex items-center justify-center ${className}`}
        {...props}
      >
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          style={{
            animation: `spin ${speed}s linear infinite`,
          }}
        >
          <circle
            cx="12"
            cy="12"
            r={10 - thickness / 2}
            stroke="currentColor"
            strokeWidth={thickness}
            strokeOpacity={0.2}
            className="text-[var(--color-border-default)]"
          />
          <path
            d={`M12 ${2 + thickness / 2} a ${10 - thickness / 2} ${10 - thickness / 2} 0 0 1 ${10 - thickness / 2} ${10 - thickness / 2}`}
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
        </svg>
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

// =============================================================================
// LOADING OVERLAY COMPONENT
// =============================================================================

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Loading state */
  loading: boolean;
  
  /** Spinner size */
  spinnerSize?: SpinnerSize;
  
  /** Loading text */
  text?: string;
  
  /** Blur background */
  blur?: boolean;
  
  /** Full screen mode */
  fullScreen?: boolean;
}

/**
 * Loading Overlay Component
 * 
 * @example
 * ```tsx
 * <div className="relative">
 *   <LoadingOverlay loading={isLoading} text="Chargement des données..." />
 *   <YourContent />
 * </div>
 * ```
 */
export function LoadingOverlay({
  loading,
  spinnerSize = 'lg',
  text,
  blur = true,
  fullScreen = false,
  className = '',
  children,
  ...props
}: LoadingOverlayProps): JSX.Element | null {
  if (!loading) return null;

  return (
    <div
      className={`
        ${fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10'}
        flex flex-col items-center justify-center gap-4
        ${blur ? 'backdrop-blur-sm' : ''}
        bg-[var(--color-bg-overlay)]
        ${className}
      `}
      {...props}
    >
      <Spinner size={spinnerSize} />
      {text && (
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          {text}
        </p>
      )}
      {children}
    </div>
  );
}

// =============================================================================
// PROGRESS BAR COMPONENT
// =============================================================================

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value: number;
  
  /** Maximum value */
  max?: number;
  
  /** Variant */
  variant?: ProgressVariant;
  
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Color */
  color?: string;
  
  /** Show value label */
  showValue?: boolean;
  
  /** Custom label */
  label?: string;
  
  /** Animated stripes */
  animated?: boolean;
  
  /** Indeterminate (loading) mode */
  indeterminate?: boolean;
}

const progressSizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

/**
 * Progress Component
 * 
 * @example
 * ```tsx
 * <Progress value={65} showValue />
 * <Progress value={30} variant="gradient" />
 * <Progress indeterminate />
 * ```
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(
    {
      value,
      max = 100,
      variant = 'default',
      size = 'md',
      color,
      showValue = false,
      label,
      animated = false,
      indeterminate = false,
      className = '',
      ...props
    },
    ref
  ) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variantStyles: Record<ProgressVariant, string> = {
      default: color || 'bg-[var(--color-brand-primary)]',
      gradient: 'bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-accent)]',
      striped: `
        ${color || 'bg-[var(--color-brand-primary)]'}
        bg-[length:1rem_1rem]
        bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]
      `,
    };

    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        {/* Label */}
        {(label || showValue) && (
          <div className="flex justify-between mb-1">
            {label && (
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                {label}
              </span>
            )}
            {showValue && (
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        {/* Progress track */}
        <div
          className={`
            w-full
            ${progressSizes[size]}
            bg-[var(--color-bg-tertiary)]
            rounded-full
            overflow-hidden
          `}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* Progress fill */}
          <div
            className={`
              h-full
              ${variantStyles[variant]}
              rounded-full
              transition-all duration-300 ease-out
              ${animated ? 'animate-[progress-stripes_1s_linear_infinite]' : ''}
              ${indeterminate ? 'animate-[progress-indeterminate_1.5s_ease-in-out_infinite]' : ''}
            `}
            style={{
              width: indeterminate ? '30%' : `${percentage}%`,
              backgroundColor: variant === 'default' && color ? color : undefined,
            }}
          />
        </div>
      </div>
    );
  }
);

// Add progress animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes progress-stripes {
      0% { background-position: 1rem 0; }
      100% { background-position: 0 0; }
    }
    @keyframes progress-indeterminate {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(400%); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  if (!document.querySelector('style[data-chenu-progress]')) {
    style.setAttribute('data-chenu-progress', 'true');
    document.head.appendChild(style);
  }
}

// =============================================================================
// CIRCULAR PROGRESS COMPONENT
// =============================================================================

export interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value: number;
  
  /** Size in pixels */
  size?: number;
  
  /** Track width */
  trackWidth?: number;
  
  /** Color */
  color?: string;
  
  /** Track color */
  trackColor?: string;
  
  /** Show value inside */
  showValue?: boolean;
  
  /** Custom content inside */
  children?: ReactNode;
  
  /** Rotation start angle */
  startAngle?: number;
}

/**
 * Circular Progress Component
 * 
 * @example
 * ```tsx
 * <CircularProgress value={75} showValue />
 * <CircularProgress value={50} size={100}>
 *   <span>50%</span>
 * </CircularProgress>
 * ```
 */
export function CircularProgress({
  value,
  size = 48,
  trackWidth = 4,
  color = 'var(--color-brand-primary)',
  trackColor = 'var(--color-border-default)',
  showValue = false,
  children,
  startAngle = -90,
  className = '',
  ...props
}: CircularProgressProps): JSX.Element {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - trackWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${startAngle}deg)` }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={trackWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={trackWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />
      </svg>

      {/* Center content */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `rotate(${-startAngle}deg)` }}
      >
        {children || (showValue && (
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {Math.round(percentage)}%
          </span>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// SKELETON COMPONENT
// =============================================================================

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Width */
  width?: string | number;
  
  /** Height */
  height?: string | number;
  
  /** Variant */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  
  /** Animation */
  animation?: 'pulse' | 'wave' | 'none';
  
  /** Number of lines (for text variant) */
  lines?: number;
}

/**
 * Skeleton Component
 * 
 * @example
 * ```tsx
 * <Skeleton variant="text" lines={3} />
 * <Skeleton variant="circular" width={48} height={48} />
 * <Skeleton variant="rectangular" width="100%" height={200} />
 * ```
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    {
      width,
      height,
      variant = 'text',
      animation = 'pulse',
      lines = 1,
      className = '',
      style,
      ...props
    },
    ref
  ) {
    const variantStyles: Record<NonNullable<SkeletonProps['variant']>, string> = {
      text: 'rounded h-4',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-lg',
    };

    const animationStyles: Record<NonNullable<SkeletonProps['animation']>, string> = {
      pulse: 'animate-pulse',
      wave: 'skeleton-wave',
      none: '',
    };

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className={`space-y-2 ${className}`} {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`
                bg-[var(--color-bg-hover)]
                ${variantStyles.text}
                ${animationStyles[animation]}
              `}
              style={{
                width: index === lines - 1 ? '80%' : '100%',
                ...style,
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`
          bg-[var(--color-bg-hover)]
          ${variantStyles[variant]}
          ${animationStyles[animation]}
          ${className}
        `}
        style={{
          width: width ?? (variant === 'circular' ? 40 : '100%'),
          height: height ?? (variant === 'circular' ? 40 : variant === 'text' ? 16 : 100),
          ...style,
        }}
        {...props}
      />
    );
  }
);

// Add skeleton wave animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes skeleton-wave {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .skeleton-wave {
      background: linear-gradient(
        90deg,
        var(--color-bg-hover) 0%,
        var(--color-bg-subtle) 50%,
        var(--color-bg-hover) 100%
      );
      background-size: 200% 100%;
      animation: skeleton-wave 1.5s ease-in-out infinite;
    }
  `;
  if (!document.querySelector('style[data-chenu-skeleton]')) {
    style.setAttribute('data-chenu-skeleton', 'true');
    document.head.appendChild(style);
  }
}

// =============================================================================
// SKELETON PRESETS
// =============================================================================

/**
 * Card Skeleton
 */
export function CardSkeleton({ className = '' }: { className?: string }): JSX.Element {
  return (
    <div className={`p-4 space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton variant="rectangular" height={120} />
      <Skeleton variant="text" lines={3} />
    </div>
  );
}

/**
 * Table Skeleton
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className = '',
}: {
  rows?: number;
  columns?: number;
  className?: string;
}): JSX.Element {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={20} className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height={16} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * List Skeleton
 */
export function ListSkeleton({
  items = 5,
  hasAvatar = true,
  className = '',
}: {
  items?: number;
  hasAvatar?: boolean;
  className?: string;
}): JSX.Element {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          {hasAvatar && <Skeleton variant="circular" width={40} height={40} />}
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={14} />
            <Skeleton width="40%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Spinner;
