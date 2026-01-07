// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — TYPOGRAPHY COMPONENTS
// CANONICAL DESIGN SYSTEM
//
// Rules:
// - Line height ≥ 1.45
// - Never justify text
// - Avoid italics for long content
// - Use bold only for emphasis, never decoration
// ═══════════════════════════════════════════════════════════════════════════════

import React, { HTMLAttributes, forwardRef } from 'react';
import { colors, typography } from './design-tokens';

// =============================================================================
// TYPES
// =============================================================================

type TextColor = 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'danger';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';

interface BaseTextProps {
  color?: TextColor;
  weight?: TextWeight;
  align?: TextAlign;
  truncate?: boolean;
  lines?: number;
}

// =============================================================================
// COLOR MAPPING
// =============================================================================

const colorMap: Record<TextColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  muted: colors.text.muted,
  accent: colors.accent.focus,
  success: colors.accent.success,
  warning: colors.accent.warning,
  danger: colors.accent.danger,
};

// =============================================================================
// TITLE COMPONENT
// =============================================================================

type TitleLevel = 1 | 2 | 3 | 4;

interface TitleProps extends BaseTextProps, HTMLAttributes<HTMLHeadingElement> {
  level?: TitleLevel;
}

const titleStyles: Record<TitleLevel, React.CSSProperties> = {
  1: {
    fontSize: '1.75rem',
    fontWeight: typography.fontWeight.bold,
    lineHeight: 1.25,
    letterSpacing: typography.letterSpacing.tight,
  },
  2: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 1.3,
    letterSpacing: typography.letterSpacing.tight,
  },
  3: {
    fontSize: typography.fontSize.section,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 1.35,
    letterSpacing: typography.letterSpacing.normal,
  },
  4: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 1.4,
    letterSpacing: typography.letterSpacing.normal,
  },
};

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  (
    {
      level = 2,
      color = 'primary',
      weight,
      align = 'left',
      truncate = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    const computedStyle: React.CSSProperties = {
      margin: 0,
      fontFamily: typography.fontFamily.primary,
      color: colorMap[color],
      textAlign: align,
      ...titleStyles[level],
      ...(weight ? { fontWeight: typography.fontWeight[weight] } : {}),
      ...(truncate
        ? {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }
        : {}),
      ...style,
    };

    return React.createElement(Tag, { ref, style: computedStyle, ...props }, children);
  }
);

Title.displayName = 'Title';

// =============================================================================
// TEXT COMPONENT
// =============================================================================

type TextSize = 'body' | 'small' | 'micro';

interface TextProps extends BaseTextProps, HTMLAttributes<HTMLParagraphElement> {
  size?: TextSize;
  as?: 'p' | 'span' | 'div';
}

const textSizeStyles: Record<TextSize, React.CSSProperties> = {
  body: {
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.normal,
  },
  small: {
    fontSize: typography.fontSize.metadata,
    lineHeight: typography.lineHeight.normal,
  },
  micro: {
    fontSize: typography.fontSize.micro,
    lineHeight: typography.lineHeight.tight,
  },
};

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      size = 'body',
      color = 'primary',
      weight = 'normal',
      align = 'left',
      truncate = false,
      lines,
      as = 'p',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const computedStyle: React.CSSProperties = {
      margin: 0,
      fontFamily: typography.fontFamily.primary,
      color: colorMap[color],
      fontWeight: typography.fontWeight[weight],
      textAlign: align,
      ...textSizeStyles[size],
      ...(truncate
        ? {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }
        : {}),
      ...(lines
        ? {
            display: '-webkit-box',
            WebkitLineClamp: lines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }
        : {}),
      ...style,
    };

    return React.createElement(as, { ref, style: computedStyle, ...props }, children);
  }
);

Text.displayName = 'Text';

// =============================================================================
// LABEL COMPONENT
// =============================================================================

interface LabelTextProps extends BaseTextProps, HTMLAttributes<HTMLSpanElement> {
  uppercase?: boolean;
}

export const LabelText = forwardRef<HTMLSpanElement, LabelTextProps>(
  (
    {
      color = 'secondary',
      weight = 'medium',
      uppercase = false,
      children,
      style,
      ...props
    },
    ref
  ) => (
    <span
      ref={ref}
      style={{
        fontSize: typography.fontSize.metadata,
        fontWeight: typography.fontWeight[weight],
        color: colorMap[color],
        letterSpacing: uppercase ? typography.letterSpacing.wider : typography.letterSpacing.wide,
        textTransform: uppercase ? 'uppercase' : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
);

LabelText.displayName = 'LabelText';

// =============================================================================
// CODE COMPONENT
// =============================================================================

interface CodeProps extends HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

export const Code = forwardRef<HTMLElement, CodeProps>(
  ({ inline = true, children, style, ...props }, ref) => {
    if (inline) {
      return (
        <code
          ref={ref}
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '0.9em',
            padding: '0.15em 0.4em',
            backgroundColor: colors.background.elevated,
            borderRadius: '4px',
            color: colors.accent.focus,
            ...style,
          }}
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <pre
        style={{
          fontFamily: typography.fontFamily.mono,
          fontSize: typography.fontSize.metadata,
          lineHeight: 1.6,
          padding: '16px',
          backgroundColor: colors.background.elevated,
          borderRadius: '8px',
          overflow: 'auto',
          margin: 0,
          ...style,
        }}
      >
        <code ref={ref} {...props}>
          {children}
        </code>
      </pre>
    );
  }
);

Code.displayName = 'Code';

// =============================================================================
// LINK COMPONENT
// =============================================================================

interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  color?: TextColor;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, external = false, color = 'accent', children, style, ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        color: colorMap[color],
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'opacity 150ms ease-out',
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLAnchorElement).style.textDecoration = 'underline';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLAnchorElement).style.textDecoration = 'none';
      }}
      {...props}
    >
      {children}
      {external && ' ↗'}
    </a>
  )
);

Link.displayName = 'Link';

// =============================================================================
// BADGE COMPONENT
// =============================================================================

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'small' | 'medium';
}

const badgeColors: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: colors.background.elevated, text: colors.text.secondary },
  accent: { bg: `${colors.accent.focus}20`, text: colors.accent.focus },
  success: { bg: `${colors.accent.success}20`, text: colors.accent.success },
  warning: { bg: `${colors.accent.warning}20`, text: colors.accent.warning },
  danger: { bg: `${colors.accent.danger}20`, text: colors.accent.danger },
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'small', children, style, ...props }, ref) => {
    const colorStyle = badgeColors[variant];
    const isSmall = size === 'small';

    return (
      <span
        ref={ref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: isSmall ? '2px 6px' : '4px 10px',
          fontSize: isSmall ? typography.fontSize.micro : typography.fontSize.metadata,
          fontWeight: typography.fontWeight.medium,
          borderRadius: '4px',
          backgroundColor: colorStyle.bg,
          color: colorStyle.text,
          textTransform: 'uppercase',
          letterSpacing: typography.letterSpacing.wide,
          ...style,
        }}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// =============================================================================
// EXPORTS
// =============================================================================

export default Text;
