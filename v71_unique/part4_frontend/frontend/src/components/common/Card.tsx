/**
 * CHE·NU™ Card & Badge Components
 * 
 * Flexible card layouts and status badges for displaying content.
 * Includes variants, interactive states, and composition patterns.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// CARD TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost';
export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  isHoverable?: boolean;
  isClickable?: boolean;
  isPadded?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  avatar?: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between';
}

// ═══════════════════════════════════════════════════════════════════════════
// CARD COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  variant = 'elevated',
  size = 'md',
  isHoverable = false,
  isClickable = false,
  isPadded = true,
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        card 
        card--${variant} 
        card--${size}
        ${isHoverable ? 'card--hoverable' : ''}
        ${isClickable ? 'card--clickable' : ''}
        ${isPadded ? 'card--padded' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  avatar,
  children,
  className = '',
  ...props
}) => {
  if (children) {
    return (
      <div className={`card__header ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={`card__header ${className}`} {...props}>
      {avatar && <div className="card__header-avatar">{avatar}</div>}
      <div className="card__header-content">
        {title && <h3 className="card__title">{title}</h3>}
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="card__header-action">{action}</div>}
    </div>
  );
};

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`card__body ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardFooterProps> = ({
  justify = 'end',
  children,
  className = '',
  ...props
}) => (
  <div 
    className={`card__footer card__footer--${justify} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

export const CardImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & {
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  position?: 'top' | 'bottom';
}> = ({
  aspectRatio = 'auto',
  position = 'top',
  className = '',
  alt = '',
  ...props
}) => (
  <div className={`card__image card__image--${position}`}>
    <img 
      className={className}
      style={{ aspectRatio }}
      alt={alt}
      {...props}
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// BADGE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  isRounded?: boolean;
  isDot?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRemove?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  isRounded = false,
  isDot = false,
  leftIcon,
  rightIcon,
  onRemove,
  children,
  className = '',
  ...props
}) => {
  if (isDot) {
    return (
      <span 
        className={`badge-dot badge-dot--${variant} badge-dot--${size} ${className}`}
        {...props}
      />
    );
  }

  return (
    <span
      className={`
        badge 
        badge--${variant} 
        badge--${size}
        ${isRounded ? 'badge--rounded' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {leftIcon && <span className="badge__icon">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="badge__icon">{rightIcon}</span>}
      {onRemove && (
        <button 
          type="button"
          className="badge__remove"
          onClick={onRemove}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STATUS BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export type StatusType = 'online' | 'offline' | 'away' | 'busy' | 'pending' | 'approved' | 'rejected';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showDot?: boolean;
  size?: BadgeSize;
}

const STATUS_CONFIG: Record<StatusType, { variant: BadgeVariant; label: string }> = {
  online: { variant: 'success', label: 'Online' },
  offline: { variant: 'default', label: 'Offline' },
  away: { variant: 'warning', label: 'Away' },
  busy: { variant: 'error', label: 'Busy' },
  pending: { variant: 'warning', label: 'Pending' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'error', label: 'Rejected' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showDot = true,
  size = 'sm',
}) => {
  const config = STATUS_CONFIG[status];
  
  return (
    <Badge variant={config.variant} size={size}>
      {showDot && <Badge variant={config.variant} isDot size="xs" />}
      {label || config.label}
    </Badge>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COUNTER BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface CounterBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export const CounterBadge: React.FC<CounterBadgeProps> = ({
  count,
  max = 99,
  variant = 'error',
  size = 'sm',
}) => {
  if (count <= 0) return null;
  
  const displayCount = count > max ? `${max}+` : count.toString();
  
  return (
    <Badge variant={variant} size={size} isRounded>
      {displayCount}
    </Badge>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// AVATAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  isRounded?: boolean;
  statusBadge?: StatusType;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getColorFromName = (name: string): string => {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name,
  size = 'md',
  isRounded = true,
  statusBadge,
  className = '',
  ...props
}) => {
  const [imgError, setImgError] = React.useState(false);
  const showFallback = !src || imgError;
  const initials = name ? getInitials(name) : '?';
  const bgColor = name ? getColorFromName(name) : '#6b7280';

  return (
    <div
      className={`
        avatar 
        avatar--${size}
        ${isRounded ? 'avatar--rounded' : 'avatar--square'}
        ${className}
      `.trim()}
      {...props}
    >
      {showFallback ? (
        <div 
          className="avatar__fallback"
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt || name || ''} 
          className="avatar__image"
          onError={() => setImgError(true)}
        />
      )}
      {statusBadge && (
        <span className={`avatar__status avatar__status--${statusBadge}`} />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// AVATAR GROUP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  spacing?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 5,
  size = 'md',
  spacing = -8,
}) => {
  const childArray = React.Children.toArray(children);
  const visibleAvatars = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className="avatar-group" style={{ gap: spacing }}>
      {visibleAvatars.map((child, index) => (
        <div 
          key={index} 
          className="avatar-group__item"
          style={{ marginLeft: index > 0 ? spacing : 0 }}
        >
          {React.isValidElement(child) 
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
            : child
          }
        </div>
      ))}
      {remainingCount > 0 && (
        <div 
          className={`avatar avatar--${size} avatar--rounded avatar-group__overflow`}
          style={{ marginLeft: spacing }}
        >
          <div className="avatar__fallback avatar__fallback--overflow">
            +{remainingCount}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const CardBadgeStyles: React.FC = () => (
  <style>{`
    /* Card base */
    .card {
      display: flex;
      flex-direction: column;
      border-radius: var(--radius-lg, 12px);
      overflow: hidden;
    }

    /* Card sizes (padding) */
    .card--padded.card--sm { padding: 12px; }
    .card--padded.card--md { padding: 16px; }
    .card--padded.card--lg { padding: 24px; }

    /* Card variants */
    .card--elevated {
      background: var(--color-bg-primary, #ffffff);
      box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
    }

    .card--outlined {
      background: var(--color-bg-primary, #ffffff);
      border: 1px solid var(--color-border, #e5e7eb);
    }

    .card--filled {
      background: var(--color-bg-secondary, #f9fafb);
    }

    .card--ghost {
      background: transparent;
    }

    /* Card states */
    .card--hoverable {
      transition: all var(--transition-fast, 0.15s);
    }

    .card--hoverable:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
    }

    .card--clickable {
      cursor: pointer;
    }

    .card--clickable:active {
      transform: scale(0.98);
    }

    /* Card header */
    .card__header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 12px;
    }

    .card__header-avatar {
      flex-shrink: 0;
    }

    .card__header-content {
      flex: 1;
      min-width: 0;
    }

    .card__header-action {
      flex-shrink: 0;
    }

    .card__title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-primary, #111827);
      margin: 0;
    }

    .card__subtitle {
      font-size: 14px;
      color: var(--color-text-secondary, #6b7280);
      margin: 4px 0 0;
    }

    /* Card body */
    .card__body {
      flex: 1;
    }

    /* Card footer */
    .card__footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 12px;
    }

    .card__footer--start { justify-content: flex-start; }
    .card__footer--center { justify-content: center; }
    .card__footer--end { justify-content: flex-end; }
    .card__footer--between { justify-content: space-between; }

    /* Card image */
    .card__image {
      width: 100%;
      overflow: hidden;
    }

    .card__image--top {
      margin: -16px -16px 16px;
      width: calc(100% + 32px);
    }

    .card__image--bottom {
      margin: 16px -16px -16px;
      width: calc(100% + 32px);
    }

    .card__image img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }

    /* Badge base */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      white-space: nowrap;
      border-radius: 6px;
    }

    .badge--rounded {
      border-radius: 999px;
    }

    /* Badge sizes */
    .badge--xs { height: 18px; padding: 0 6px; font-size: 10px; }
    .badge--sm { height: 22px; padding: 0 8px; font-size: 11px; }
    .badge--md { height: 26px; padding: 0 10px; font-size: 12px; }
    .badge--lg { height: 30px; padding: 0 12px; font-size: 13px; }

    /* Badge variants */
    .badge--default {
      background: var(--color-bg-tertiary, #e5e7eb);
      color: var(--color-text-primary, #374151);
    }

    .badge--primary {
      background: rgba(99, 102, 241, 0.15);
      color: #4f46e5;
    }

    .badge--secondary {
      background: rgba(107, 114, 128, 0.15);
      color: #4b5563;
    }

    .badge--success {
      background: rgba(34, 197, 94, 0.15);
      color: #16a34a;
    }

    .badge--warning {
      background: rgba(245, 158, 11, 0.15);
      color: #d97706;
    }

    .badge--error {
      background: rgba(239, 68, 68, 0.15);
      color: #dc2626;
    }

    .badge--info {
      background: rgba(59, 130, 246, 0.15);
      color: #2563eb;
    }

    .badge__icon {
      display: flex;
      align-items: center;
    }

    .badge__remove {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-left: 2px;
      margin-right: -4px;
      padding: 0;
      border: none;
      background: transparent;
      color: inherit;
      opacity: 0.6;
      cursor: pointer;
      border-radius: 50%;
      font-size: 14px;
      line-height: 1;
    }

    .badge__remove:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.1);
    }

    /* Badge dot */
    .badge-dot {
      display: inline-block;
      border-radius: 50%;
    }

    .badge-dot--xs { width: 6px; height: 6px; }
    .badge-dot--sm { width: 8px; height: 8px; }
    .badge-dot--md { width: 10px; height: 10px; }
    .badge-dot--lg { width: 12px; height: 12px; }

    .badge-dot--default { background: var(--color-text-secondary, #6b7280); }
    .badge-dot--primary { background: var(--color-primary, #6366f1); }
    .badge-dot--secondary { background: #6b7280; }
    .badge-dot--success { background: var(--color-success, #22c55e); }
    .badge-dot--warning { background: var(--color-warning, #f59e0b); }
    .badge-dot--error { background: var(--color-error, #ef4444); }
    .badge-dot--info { background: #3b82f6; }

    /* Avatar */
    .avatar {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }

    .avatar--rounded { border-radius: 50%; }
    .avatar--square { border-radius: var(--radius-md, 8px); }

    /* Avatar sizes */
    .avatar--xs { width: 24px; height: 24px; font-size: 10px; }
    .avatar--sm { width: 32px; height: 32px; font-size: 12px; }
    .avatar--md { width: 40px; height: 40px; font-size: 14px; }
    .avatar--lg { width: 48px; height: 48px; font-size: 16px; }
    .avatar--xl { width: 64px; height: 64px; font-size: 20px; }
    .avatar--2xl { width: 96px; height: 96px; font-size: 28px; }

    .avatar__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar__fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
    }

    .avatar__fallback--overflow {
      background: var(--color-bg-tertiary, #e5e7eb);
      color: var(--color-text-secondary, #6b7280);
      font-size: 0.75em;
    }

    .avatar__status {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 25%;
      height: 25%;
      min-width: 8px;
      min-height: 8px;
      border-radius: 50%;
      border: 2px solid var(--color-bg-primary, #ffffff);
    }

    .avatar__status--online { background: var(--color-success, #22c55e); }
    .avatar__status--offline { background: var(--color-text-tertiary, #9ca3af); }
    .avatar__status--away { background: var(--color-warning, #f59e0b); }
    .avatar__status--busy { background: var(--color-error, #ef4444); }

    /* Avatar group */
    .avatar-group {
      display: flex;
      align-items: center;
    }

    .avatar-group__item {
      position: relative;
    }

    .avatar-group__item .avatar {
      border: 2px solid var(--color-bg-primary, #ffffff);
    }

    .avatar-group__overflow {
      z-index: 0;
    }

    /* Dark mode */
    [data-theme="dark"] .card--elevated {
      background: #1a1a1a;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }

    [data-theme="dark"] .card--outlined {
      background: #1a1a1a;
      border-color: #333;
    }

    [data-theme="dark"] .card--filled {
      background: #2a2a2a;
    }

    [data-theme="dark"] .card__title {
      color: #f9fafb;
    }

    [data-theme="dark"] .badge--default {
      background: #333;
      color: #e5e7eb;
    }

    [data-theme="dark"] .avatar__fallback--overflow {
      background: #333;
      color: #9ca3af;
    }

    [data-theme="dark"] .avatar__status {
      border-color: #1a1a1a;
    }

    [data-theme="dark"] .avatar-group__item .avatar {
      border-color: #1a1a1a;
    }
  `}</style>
);

export default {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImage,
  Badge,
  StatusBadge,
  CounterBadge,
  Avatar,
  AvatarGroup,
  CardBadgeStyles,
};
