// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — CARD & PANEL COMPONENTS
// CANONICAL DESIGN SYSTEM
//
// Cards should feel:
// - Stable
// - Quiet
// - Trustworthy
// ═══════════════════════════════════════════════════════════════════════════════

import React, { HTMLAttributes, forwardRef } from 'react';
import { colors, spacing, radius, shadows, animation } from './design-tokens';

// =============================================================================
// TYPES
// =============================================================================

type CardVariant = 'default' | 'elevated' | 'outline' | 'ghost';
type CardPadding = 'none' | 'small' | 'medium' | 'large';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  selected?: boolean;
  fullWidth?: boolean;
}

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  fullWidth?: boolean;
}

// =============================================================================
// STYLES
// =============================================================================

const paddingStyles: Record<CardPadding, React.CSSProperties> = {
  none: { padding: 0 },
  small: { padding: `${spacing.s}px` },
  medium: { padding: `${spacing.m}px` },
  large: { padding: `${spacing.l}px` },
};

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    backgroundColor: colors.background.secondary,
    border: `1px solid ${colors.border.subtle}`,
  },
  elevated: {
    backgroundColor: colors.background.elevated,
    boxShadow: shadows.md,
    border: 'none',
  },
  outline: {
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.default}`,
  },
  ghost: {
    backgroundColor: 'transparent',
    border: 'none',
  },
};

// =============================================================================
// CARD COMPONENT
// =============================================================================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'medium',
      interactive = false,
      selected = false,
      fullWidth = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const computedStyle: React.CSSProperties = {
      borderRadius: `${radius.xl}px`,
      transition: `all ${animation.durationMs.fast} ${animation.easing.out}`,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...(fullWidth ? { width: '100%' } : {}),
      ...(interactive
        ? {
            cursor: 'pointer',
            ...(isHovered ? { transform: 'translateY(-2px)', boxShadow: shadows.lg } : {}),
          }
        : {}),
      ...(selected
        ? {
            borderColor: colors.accent.focus,
            backgroundColor: variant === 'ghost' ? colors.overlay.light : undefined,
          }
        : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        style={computedStyle}
        onMouseEnter={() => interactive && setIsHovered(true)}
        onMouseLeave={() => interactive && setIsHovered(false)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// =============================================================================
// CARD HEADER
// =============================================================================

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  style,
  ...props
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: `${spacing.m}px`,
      marginBottom: `${spacing.m}px`,
      ...style,
    }}
    {...props}
  >
    <div>
      <h3
        style={{
          margin: 0,
          fontSize: '1.0625rem',
          fontWeight: 600,
          color: colors.text.primary,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          style={{
            margin: `${spacing.xs}px 0 0`,
            fontSize: '0.875rem',
            color: colors.text.secondary,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// =============================================================================
// CARD CONTENT
// =============================================================================

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  style,
  ...props
}) => (
  <div
    style={{
      color: colors.text.primary,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

// =============================================================================
// CARD FOOTER
// =============================================================================

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'space-between';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  align = 'right',
  children,
  style,
  ...props
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent:
        align === 'space-between'
          ? 'space-between'
          : align === 'center'
          ? 'center'
          : align === 'left'
          ? 'flex-start'
          : 'flex-end',
      gap: `${spacing.s}px`,
      marginTop: `${spacing.m}px`,
      paddingTop: `${spacing.m}px`,
      borderTop: `1px solid ${colors.border.subtle}`,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

// =============================================================================
// PANEL COMPONENT
// =============================================================================

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ padding = 'large', fullWidth = false, children, style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        backgroundColor: colors.background.secondary,
        borderRadius: `${radius.xl}px`,
        boxShadow: shadows.md,
        ...paddingStyles[padding],
        ...(fullWidth ? { width: '100%' } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
);

Panel.displayName = 'Panel';

// =============================================================================
// DIVIDER
// =============================================================================

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  spacing?: 'small' | 'medium' | 'large';
  variant?: 'solid' | 'dashed' | 'dotted';
}

export const Divider: React.FC<DividerProps> = ({
  spacing: spacingProp = 'medium',
  variant = 'solid',
  style,
  ...props
}) => {
  const spacingMap = {
    small: spacing.s,
    medium: spacing.m,
    large: spacing.l,
  };

  return (
    <hr
      style={{
        border: 'none',
        borderTop: `1px ${variant} ${colors.border.default}`,
        margin: `${spacingMap[spacingProp]}px 0`,
        ...style,
      }}
      {...props}
    />
  );
};

// =============================================================================
// SURFACE (for layered backgrounds)
// =============================================================================

type SurfaceLevel = 0 | 1 | 2;

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  level?: SurfaceLevel;
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ level = 0, children, style, ...props }, ref) => {
    const backgrounds: Record<SurfaceLevel, string> = {
      0: colors.background.primary,
      1: colors.background.secondary,
      2: colors.background.elevated,
    };

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: backgrounds[level],
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Surface.displayName = 'Surface';

// =============================================================================
// EXPORTS
// =============================================================================

export default Card;
