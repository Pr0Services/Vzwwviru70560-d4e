/**
 * CHE·NU™ Alert, Empty State & Utility Components
 * 
 * Status messages, empty states, and utility layout components.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// ALERT TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ALERT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const AlertIcons: Record<AlertVariant, string> = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠',
  error: '✕',
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  action,
}) => {
  return (
    <div className={`alert alert--${variant}`} role="alert">
      <div className="alert__icon">
        {icon || AlertIcons[variant]}
      </div>
      
      <div className="alert__content">
        {title && <div className="alert__title">{title}</div>}
        <div className="alert__message">{children}</div>
      </div>
      
      <div className="alert__actions">
        {action && (
          <button 
            type="button"
            className="alert__action"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
        {onClose && (
          <button 
            type="button"
            className="alert__close"
            onClick={onClose}
            aria-label="Close alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// BANNER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface BannerProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export const Banner: React.FC<BannerProps> = ({
  variant = 'info',
  children,
  action,
  onClose,
}) => {
  return (
    <div className={`banner banner--${variant}`} role="banner">
      <div className="banner__content">{children}</div>
      
      {action && (
        <button 
          type="button"
          className="banner__action"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
      
      {onClose && (
        <button 
          type="button"
          className="banner__close"
          onClick={onClose}
          aria-label="Close banner"
        >
          ×
        </button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// EMPTY STATE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
}) => {
  return (
    <div className={`empty-state empty-state--${size}`}>
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="empty-state__actions">
          {action && (
            <button
              type="button"
              className="empty-state__action empty-state__action--primary"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              className="empty-state__action empty-state__action--secondary"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// DIVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  spacing = 'md',
}) => {
  if (label && orientation === 'horizontal') {
    return (
      <div className={`divider divider--with-label divider--${spacing}`}>
        <span className="divider__line" />
        <span className="divider__label">{label}</span>
        <span className="divider__line" />
      </div>
    );
  }

  return (
    <div 
      className={`divider divider--${orientation} divider--${spacing}`}
      role="separator"
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STACK COMPONENT (Utility Layout)
// ═══════════════════════════════════════════════════════════════════════════

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  spacing?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

const spacingMap = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  children,
  className = '',
  style,
  ...props
}) => {
  const gap = typeof spacing === 'number' ? spacing : spacingMap[spacing];

  return (
    <div
      className={`stack ${className}`}
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: align === 'start' ? 'flex-start' : 
                   align === 'end' ? 'flex-end' : 
                   align,
        justifyContent: justify === 'start' ? 'flex-start' :
                        justify === 'end' ? 'flex-end' :
                        justify === 'between' ? 'space-between' :
                        justify === 'around' ? 'space-around' :
                        justify,
        gap,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// BOX COMPONENT (Utility Layout)
// ═══════════════════════════════════════════════════════════════════════════

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  background?: 'transparent' | 'primary' | 'secondary' | 'tertiary';
}

export const Box: React.FC<BoxProps> = ({
  padding,
  margin,
  borderRadius = 'none',
  background = 'transparent',
  children,
  className = '',
  style,
  ...props
}) => {
  const pad = padding ? (typeof padding === 'number' ? padding : spacingMap[padding]) : undefined;
  const mar = margin ? (typeof margin === 'number' ? margin : spacingMap[margin]) : undefined;

  return (
    <div
      className={`box box--bg-${background} ${className}`}
      style={{
        padding: pad,
        margin: mar,
        borderRadius: borderRadius === 'none' ? 0 :
                      borderRadius === 'sm' ? 4 :
                      borderRadius === 'md' ? 8 :
                      borderRadius === 'lg' ? 12 :
                      borderRadius === 'full' ? 9999 : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TEXT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div' | 'label';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning';
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
  lines?: number;
}

export const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  size = 'md',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  truncate = false,
  lines,
  children,
  className = '',
  style,
  ...props
}) => {
  const sizeStyles: Record<string, number> = { xs: 12, sm: 13, md: 14, lg: 16, xl: 18 };
  
  return (
    <Component
      className={`text text--${color} ${truncate ? 'text--truncate' : ''} ${className}`}
      style={{
        fontSize: sizeStyles[size],
        fontWeight: weight === 'normal' ? 400 :
                    weight === 'medium' ? 500 :
                    weight === 'semibold' ? 600 : 700,
        textAlign: align,
        ...(lines && {
          display: '-webkit-box',
          WebkitLineClamp: lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }),
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// HEADING COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Heading: React.FC<HeadingProps> = ({
  as: Component = 'h2',
  size = 'lg',
  children,
  className = '',
  style,
  ...props
}) => {
  const sizeStyles: Record<string, { fontSize: number; lineHeight: number }> = {
    xs: { fontSize: 14, lineHeight: 1.4 },
    sm: { fontSize: 16, lineHeight: 1.4 },
    md: { fontSize: 18, lineHeight: 1.4 },
    lg: { fontSize: 20, lineHeight: 1.3 },
    xl: { fontSize: 24, lineHeight: 1.3 },
    '2xl': { fontSize: 30, lineHeight: 1.2 },
    '3xl': { fontSize: 36, lineHeight: 1.2 },
  };

  return (
    <Component
      className={`heading ${className}`}
      style={{
        ...sizeStyles[size],
        fontWeight: 600,
        color: 'var(--color-text-primary, #111827)',
        margin: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const AlertStyles: React.FC = () => (
  <style>{`
    /* Alert */
    .alert {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--radius-md, 8px);
      font-size: 14px;
    }

    .alert--info {
      background: rgba(59, 130, 246, 0.1);
      color: #1d4ed8;
    }

    .alert--success {
      background: rgba(34, 197, 94, 0.1);
      color: #15803d;
    }

    .alert--warning {
      background: rgba(245, 158, 11, 0.1);
      color: #b45309;
    }

    .alert--error {
      background: rgba(239, 68, 68, 0.1);
      color: #b91c1c;
    }

    .alert__icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .alert__content {
      flex: 1;
      min-width: 0;
    }

    .alert__title {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .alert__message {
      opacity: 0.9;
    }

    .alert__actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .alert__action {
      padding: 4px 12px;
      border: none;
      background: rgba(0, 0, 0, 0.1);
      color: inherit;
      font-size: 13px;
      font-weight: 500;
      border-radius: var(--radius-sm, 6px);
      cursor: pointer;
    }

    .alert__action:hover {
      background: rgba(0, 0, 0, 0.15);
    }

    .alert__close {
      padding: 0;
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      color: inherit;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.6;
      border-radius: var(--radius-sm, 6px);
    }

    .alert__close:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.1);
    }

    /* Banner */
    .banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 10px 16px;
      font-size: 14px;
    }

    .banner--info { background: #3b82f6; color: white; }
    .banner--success { background: #22c55e; color: white; }
    .banner--warning { background: #f59e0b; color: white; }
    .banner--error { background: #ef4444; color: white; }

    .banner__content {
      flex: 1;
      text-align: center;
    }

    .banner__action {
      padding: 4px 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: transparent;
      color: white;
      font-size: 13px;
      font-weight: 500;
      border-radius: var(--radius-sm, 6px);
      cursor: pointer;
    }

    .banner__action:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .banner__close {
      padding: 0;
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      color: white;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.8;
    }

    .banner__close:hover {
      opacity: 1;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 48px 24px;
    }

    .empty-state--sm { padding: 32px 16px; }
    .empty-state--lg { padding: 64px 32px; }

    .empty-state__icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.4;
    }

    .empty-state--sm .empty-state__icon { font-size: 36px; }
    .empty-state--lg .empty-state__icon { font-size: 64px; }

    .empty-state__title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-text-primary, #111827);
      margin: 0 0 8px;
    }

    .empty-state--sm .empty-state__title { font-size: 16px; }
    .empty-state--lg .empty-state__title { font-size: 20px; }

    .empty-state__description {
      font-size: 14px;
      color: var(--color-text-secondary, #6b7280);
      margin: 0 0 24px;
      max-width: 400px;
    }

    .empty-state__actions {
      display: flex;
      gap: 12px;
    }

    .empty-state__action {
      padding: 10px 20px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      border-radius: var(--radius-md, 8px);
      cursor: pointer;
      transition: all var(--transition-fast, 0.15s);
    }

    .empty-state__action--primary {
      background: var(--color-primary, #6366f1);
      color: white;
    }

    .empty-state__action--primary:hover {
      background: var(--color-primary-hover, #4f46e5);
    }

    .empty-state__action--secondary {
      background: transparent;
      color: var(--color-text-secondary, #6b7280);
      border: 1px solid var(--color-border, #e5e7eb);
    }

    .empty-state__action--secondary:hover {
      background: var(--color-bg-tertiary, #f3f4f6);
    }

    /* Divider */
    .divider {
      background: var(--color-border, #e5e7eb);
    }

    .divider--horizontal {
      height: 1px;
      width: 100%;
    }

    .divider--vertical {
      width: 1px;
      height: 100%;
      align-self: stretch;
    }

    .divider--sm { margin: 8px 0; }
    .divider--md { margin: 16px 0; }
    .divider--lg { margin: 24px 0; }

    .divider--with-label {
      display: flex;
      align-items: center;
      gap: 16px;
      background: transparent;
    }

    .divider__line {
      flex: 1;
      height: 1px;
      background: var(--color-border, #e5e7eb);
    }

    .divider__label {
      font-size: 13px;
      color: var(--color-text-tertiary, #9ca3af);
      white-space: nowrap;
    }

    /* Text */
    .text--primary { color: var(--color-text-primary, #111827); }
    .text--secondary { color: var(--color-text-secondary, #6b7280); }
    .text--tertiary { color: var(--color-text-tertiary, #9ca3af); }
    .text--error { color: var(--color-error, #ef4444); }
    .text--success { color: var(--color-success, #22c55e); }
    .text--warning { color: var(--color-warning, #f59e0b); }

    .text--truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Box */
    .box--bg-transparent { background: transparent; }
    .box--bg-primary { background: var(--color-bg-primary, #ffffff); }
    .box--bg-secondary { background: var(--color-bg-secondary, #f9fafb); }
    .box--bg-tertiary { background: var(--color-bg-tertiary, #f3f4f6); }

    /* Dark mode */
    [data-theme="dark"] .alert--info {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }

    [data-theme="dark"] .alert--success {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
    }

    [data-theme="dark"] .alert--warning {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
    }

    [data-theme="dark"] .alert--error {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }

    [data-theme="dark"] .empty-state__title {
      color: #f9fafb;
    }

    [data-theme="dark"] .empty-state__action--secondary {
      border-color: #333;
      color: #9ca3af;
    }

    [data-theme="dark"] .empty-state__action--secondary:hover {
      background: #2a2a2a;
    }

    [data-theme="dark"] .divider,
    [data-theme="dark"] .divider__line {
      background: #333;
    }

    [data-theme="dark"] .text--primary { color: #f9fafb; }
    [data-theme="dark"] .heading { color: #f9fafb; }

    [data-theme="dark"] .box--bg-primary { background: #1a1a1a; }
    [data-theme="dark"] .box--bg-secondary { background: #1f1f1f; }
    [data-theme="dark"] .box--bg-tertiary { background: #2a2a2a; }
  `}</style>
);

export default {
  Alert,
  Banner,
  EmptyState,
  Divider,
  Stack,
  Box,
  Text,
  Heading,
  AlertStyles,
};
