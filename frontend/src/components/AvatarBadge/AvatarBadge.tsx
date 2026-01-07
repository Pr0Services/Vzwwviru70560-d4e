// CHE·NU™ Avatar, Badge & Status Components
// Comprehensive user representation and status indicators

import React, {
  useState,
  useCallback,
  useMemo,
  ReactNode,
  CSSProperties,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AvatarShape = 'circle' | 'square' | 'rounded';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'dnd';

type BadgeVariant = 'solid' | 'subtle' | 'outline' | 'dot';
type BadgeColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

type StatusIndicatorSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  statusPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  badge?: ReactNode;
  badgePosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  icon?: ReactNode;
  color?: string;
  bordered?: boolean;
  borderColor?: string;
  onClick?: () => void;
  onError?: () => void;
  className?: string;
  style?: CSSProperties;
}

interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarSize;
  spacing?: number;
  showOverflow?: boolean;
  className?: string;
}

interface BadgeProps {
  children?: ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  rounded?: boolean;
  removable?: boolean;
  icon?: ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

interface StatusIndicatorProps {
  status: AvatarStatus;
  size?: StatusIndicatorSize;
  pulse?: boolean;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

interface PresenceProps {
  status: AvatarStatus;
  lastSeen?: Date | string;
  showLastSeen?: boolean;
  className?: string;
}

interface UserCardProps {
  name: string;
  avatar?: string;
  subtitle?: string;
  status?: AvatarStatus;
  badge?: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
  onClick?: () => void;
  className?: string;
}

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// CONSTANTS
// ============================================================

const AVATAR_SIZES: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 96,
};

const AVATAR_FONT_SIZES: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 36,
};

const STATUS_SIZES: Record<StatusIndicatorSize, number> = {
  sm: 8,
  md: 12,
  lg: 16,
};

const STATUS_COLORS: Record<AvatarStatus, string> = {
  online: '#48BB78',
  offline: '#A0AEC0',
  away: '#ECC94B',
  busy: '#ED8936',
  dnd: '#F56565',
};

const STATUS_LABELS: Record<AvatarStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  away: 'Away',
  busy: 'Busy',
  dnd: 'Do Not Disturb',
};

const BADGE_COLORS: Record<BadgeColor, { bg: string; text: string; border: string }> = {
  default: { bg: BRAND.softSand, text: BRAND.uiSlate, border: BRAND.ancientStone },
  primary: { bg: `${BRAND.sacredGold}20`, text: BRAND.earthEmber, border: BRAND.sacredGold },
  success: { bg: '#C6F6D5', text: '#276749', border: '#48BB78' },
  warning: { bg: '#FEFCBF', text: '#975A16', border: '#ECC94B' },
  danger: { bg: '#FED7D7', text: '#C53030', border: '#F56565' },
  info: { bg: `${BRAND.cenoteTurquoise}20`, text: BRAND.shadowMoss, border: BRAND.cenoteTurquoise },
};

const AVATAR_COLORS = [
  '#E53E3E', '#DD6B20', '#D69E2E', '#38A169', '#319795',
  '#3182CE', '#5A67D8', '#805AD5', '#D53F8C', '#718096',
];

// ============================================================
// UTILITIES
// ============================================================

function getInitials(name: string): string {
  if (!name) return '?';
  
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

function getColorFromName(name: string): string {
  if (!name) return AVATAR_COLORS[0];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatLastSeen(date: Date | string): string {
  const now = new Date();
  const lastSeen = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - lastSeen.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return lastSeen.toLocaleDateString();
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Avatar styles
  avatar: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    userSelect: 'none' as const,
    flexShrink: 0,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },

  avatarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarBordered: {
    boxShadow: '0 0 0 2px #ffffff',
  },

  avatarClickable: {
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },

  statusIndicator: {
    position: 'absolute' as const,
    borderRadius: '50%',
    border: '2px solid #ffffff',
  },

  avatarBadge: {
    position: 'absolute' as const,
  },

  // Avatar group styles
  avatarGroup: {
    display: 'flex',
    alignItems: 'center',
  },

  avatarGroupItem: {
    marginLeft: '-8px',
    border: '2px solid #ffffff',
    borderRadius: '50%',
  },

  avatarGroupOverflow: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
    fontWeight: 600,
    borderRadius: '50%',
    marginLeft: '-8px',
    border: '2px solid #ffffff',
  },

  // Badge styles
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: 500,
    lineHeight: 1,
    whiteSpace: 'nowrap' as const,
  },

  badgeXs: {
    padding: '2px 6px',
    fontSize: '10px',
    borderRadius: '4px',
  },

  badgeSm: {
    padding: '3px 8px',
    fontSize: '11px',
    borderRadius: '4px',
  },

  badgeMd: {
    padding: '4px 10px',
    fontSize: '12px',
    borderRadius: '6px',
  },

  badgeLg: {
    padding: '6px 12px',
    fontSize: '13px',
    borderRadius: '6px',
  },

  badgeRounded: {
    borderRadius: '100px',
  },

  badgeDot: {
    width: '8px',
    height: '8px',
    padding: 0,
    borderRadius: '50%',
  },

  badgeIcon: {
    fontSize: '12px',
    lineHeight: 1,
  },

  badgeRemove: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '4px',
    padding: '2px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    opacity: 0.6,
    fontSize: '12px',
    lineHeight: 1,
    borderRadius: '2px',
    transition: 'opacity 0.2s',
  },

  badgeClickable: {
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },

  // Status indicator styles
  statusDot: {
    display: 'inline-block',
    borderRadius: '50%',
    flexShrink: 0,
  },

  statusPulse: {
    animation: 'pulse 2s infinite',
  },

  statusContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },

  statusLabel: {
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  // Presence styles
  presence: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  presenceText: {
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  // User card styles
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}20`,
    transition: 'all 0.2s',
  },

  userCardClickable: {
    cursor: 'pointer',
  },

  userCardHover: {
    borderColor: BRAND.sacredGold,
    boxShadow: `0 0 0 1px ${BRAND.sacredGold}`,
  },

  userCardCompact: {
    padding: '8px',
    gap: '8px',
  },

  userCardInfo: {
    flex: 1,
    minWidth: 0,
  },

  userCardName: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  userCardSubtitle: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    marginTop: '2px',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  userCardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
};

// ============================================================
// AVATAR COMPONENT
// ============================================================

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  status,
  statusPosition = 'bottom-right',
  badge,
  badgePosition = 'top-right',
  icon,
  color,
  bordered = false,
  borderColor,
  onClick,
  onError,
  className,
  style,
}: AvatarProps): JSX.Element {
  const [imageError, setImageError] = useState(false);

  const sizeValue = AVATAR_SIZES[size];
  const fontSize = AVATAR_FONT_SIZES[size];
  const initials = getInitials(name || alt || '');
  const bgColor = color || getColorFromName(name || alt || '');

  const handleImageError = useCallback(() => {
    setImageError(true);
    onError?.();
  }, [onError]);

  const borderRadius = shape === 'circle' 
    ? '50%' 
    : shape === 'rounded' 
      ? '8px' 
      : '4px';

  const statusSize = size === 'xs' || size === 'sm' ? 'sm' : size === 'md' || size === 'lg' ? 'md' : 'lg';
  const statusSizeValue = STATUS_SIZES[statusSize];

  const getPositionStyles = (position: string): CSSProperties => {
    const offset = statusSizeValue / 4;
    switch (position) {
      case 'top-right':
        return { top: offset, right: offset };
      case 'top-left':
        return { top: offset, left: offset };
      case 'bottom-left':
        return { bottom: offset, left: offset };
      case 'bottom-right':
      default:
        return { bottom: offset, right: offset };
    }
  };

  const avatarStyle: CSSProperties = {
    ...styles.avatar,
    width: sizeValue,
    height: sizeValue,
    borderRadius,
    fontSize,
    backgroundColor: src && !imageError ? 'transparent' : bgColor,
    color: '#ffffff',
    ...(bordered && {
      ...styles.avatarBordered,
      boxShadow: `0 0 0 2px ${borderColor || '#ffffff'}`,
    }),
    ...(onClick && styles.avatarClickable),
    ...style,
  };

  return (
    <div
      style={avatarStyle}
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          style={styles.avatarImage}
          onError={handleImageError}
        />
      ) : icon ? (
        <span style={{ ...styles.avatarIcon, fontSize: fontSize * 1.2 }}>{icon}</span>
      ) : (
        initials
      )}

      {status && (
        <span
          style={{
            ...styles.statusIndicator,
            ...getPositionStyles(statusPosition),
            width: statusSizeValue,
            height: statusSizeValue,
            backgroundColor: STATUS_COLORS[status],
          }}
        />
      )}

      {badge && (
        <span
          style={{
            ...styles.avatarBadge,
            ...getPositionStyles(badgePosition),
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

// ============================================================
// AVATAR GROUP COMPONENT
// ============================================================

export function AvatarGroup({
  children,
  max = 5,
  size = 'md',
  spacing = -8,
  showOverflow = true,
  className,
}: AvatarGroupProps): JSX.Element {
  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const overflowCount = childArray.length - max;
  const sizeValue = AVATAR_SIZES[size];

  return (
    <div style={styles.avatarGroup} className={className}>
      {visibleChildren.map((child, index) => (
        <div
          key={index}
          style={{
            ...styles.avatarGroupItem,
            marginLeft: index === 0 ? 0 : spacing,
            zIndex: visibleChildren.length - index,
          }}
        >
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size, bordered: true })
            : child}
        </div>
      ))}

      {showOverflow && overflowCount > 0 && (
        <div
          style={{
            ...styles.avatarGroupOverflow,
            width: sizeValue,
            height: sizeValue,
            fontSize: AVATAR_FONT_SIZES[size],
            marginLeft: spacing,
          }}
        >
          +{overflowCount}
        </div>
      )}
    </div>
  );
}

// ============================================================
// BADGE COMPONENT
// ============================================================

export function Badge({
  children,
  variant = 'solid',
  color = 'default',
  size = 'md',
  rounded = false,
  removable = false,
  icon,
  onRemove,
  onClick,
  className,
  style,
}: BadgeProps): JSX.Element {
  const colors = BADGE_COLORS[color];

  const sizeStyles = {
    xs: styles.badgeXs,
    sm: styles.badgeSm,
    md: styles.badgeMd,
    lg: styles.badgeLg,
  }[size];

  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case 'subtle':
        return {
          backgroundColor: colors.bg,
          color: colors.text,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.text,
          border: `1px solid ${colors.border}`,
        };
      case 'dot':
        return {
          ...styles.badgeDot,
          backgroundColor: colors.border,
        };
      case 'solid':
      default:
        return {
          backgroundColor: colors.border,
          color: '#ffffff',
        };
    }
  };

  const badgeStyle: CSSProperties = {
    ...styles.badge,
    ...sizeStyles,
    ...getVariantStyles(),
    ...(rounded && styles.badgeRounded),
    ...(onClick && styles.badgeClickable),
    ...style,
  };

  if (variant === 'dot') {
    return <span style={badgeStyle} className={className} />;
  }

  return (
    <span
      style={badgeStyle}
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && <span style={styles.badgeIcon}>{icon}</span>}
      {children}
      {removable && onRemove && (
        <button
          style={styles.badgeRemove}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}

// ============================================================
// STATUS INDICATOR COMPONENT
// ============================================================

export function StatusIndicator({
  status,
  size = 'md',
  pulse = false,
  label,
  showLabel = false,
  className,
}: StatusIndicatorProps): JSX.Element {
  const sizeValue = STATUS_SIZES[size];
  const statusColor = STATUS_COLORS[status];
  const statusLabel = label || STATUS_LABELS[status];

  const dotStyle: CSSProperties = {
    ...styles.statusDot,
    width: sizeValue,
    height: sizeValue,
    backgroundColor: statusColor,
    ...(pulse && status === 'online' && styles.statusPulse),
  };

  if (showLabel) {
    return (
      <div style={styles.statusContainer} className={className}>
        <span style={dotStyle} />
        <span style={styles.statusLabel}>{statusLabel}</span>
      </div>
    );
  }

  return (
    <>
      <span style={dotStyle} className={className} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}

// ============================================================
// PRESENCE COMPONENT
// ============================================================

export function Presence({
  status,
  lastSeen,
  showLastSeen = true,
  className,
}: PresenceProps): JSX.Element {
  const statusLabel = STATUS_LABELS[status];

  return (
    <div style={styles.presence} className={className}>
      <StatusIndicator status={status} size="sm" pulse={status === 'online'} />
      <span style={styles.presenceText}>
        {status === 'online' ? (
          statusLabel
        ) : showLastSeen && lastSeen ? (
          `Last seen ${formatLastSeen(lastSeen)}`
        ) : (
          statusLabel
        )}
      </span>
    </div>
  );
}

// ============================================================
// USER CARD COMPONENT
// ============================================================

export function UserCard({
  name,
  avatar,
  subtitle,
  status,
  badge,
  actions,
  compact = false,
  onClick,
  className,
}: UserCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle: CSSProperties = {
    ...styles.userCard,
    ...(compact && styles.userCardCompact),
    ...(onClick && styles.userCardClickable),
    ...(isHovered && onClick && styles.userCardHover),
  };

  return (
    <div
      style={cardStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Avatar
        src={avatar}
        name={name}
        size={compact ? 'sm' : 'md'}
        status={status}
      />

      <div style={styles.userCardInfo}>
        <div style={styles.userCardName}>{name}</div>
        {subtitle && <div style={styles.userCardSubtitle}>{subtitle}</div>}
      </div>

      {badge && badge}

      {actions && <div style={styles.userCardActions}>{actions}</div>}
    </div>
  );
}

// ============================================================
// NOTIFICATION BADGE COMPONENT
// ============================================================

interface NotificationBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  dot?: boolean;
  color?: BadgeColor;
  children: ReactNode;
  offset?: { x: number; y: number };
  className?: string;
}

export function NotificationBadge({
  count,
  max = 99,
  showZero = false,
  dot = false,
  color = 'danger',
  children,
  offset = { x: 0, y: 0 },
  className,
}: NotificationBadgeProps): JSX.Element {
  const displayCount = count > max ? `${max}+` : count;
  const shouldShow = dot || count > 0 || showZero;

  const badgeColors = BADGE_COLORS[color];

  const badgeStyle: CSSProperties = {
    position: 'absolute',
    top: offset.y,
    right: offset.x,
    transform: 'translate(50%, -50%)',
    minWidth: dot ? '8px' : '18px',
    height: dot ? '8px' : '18px',
    padding: dot ? 0 : '0 5px',
    borderRadius: '100px',
    backgroundColor: badgeColors.border,
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ffffff',
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }} className={className}>
      {children}
      {shouldShow && (
        <span style={badgeStyle}>
          {!dot && displayCount}
        </span>
      )}
    </div>
  );
}

// ============================================================
// TAG COMPONENT (Similar to Badge but for labels/tags)
// ============================================================

interface TagProps {
  children: ReactNode;
  color?: string;
  bgColor?: string;
  closable?: boolean;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  onClose?: () => void;
  onClick?: () => void;
  className?: string;
}

export function Tag({
  children,
  color,
  bgColor,
  closable = false,
  icon,
  size = 'md',
  onClose,
  onClick,
  className,
}: TagProps): JSX.Element {
  const sizeStyles: Record<string, CSSProperties> = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 10px', fontSize: '12px' },
    lg: { padding: '6px 12px', fontSize: '13px' },
  };

  const tagStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    borderRadius: '4px',
    fontWeight: 500,
    backgroundColor: bgColor || BRAND.softSand,
    color: color || BRAND.uiSlate,
    ...sizeStyles[size],
    ...(onClick && { cursor: 'pointer' }),
  };

  return (
    <span style={tagStyle} className={className} onClick={onClick}>
      {icon && <span style={{ fontSize: '14px', lineHeight: 1 }}>{icon}</span>}
      {children}
      {closable && onClose && (
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0 2px',
            fontSize: '14px',
            lineHeight: 1,
            opacity: 0.6,
            color: 'inherit',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  AvatarSize,
  AvatarShape,
  AvatarStatus,
  BadgeVariant,
  BadgeColor,
  BadgeSize,
  StatusIndicatorSize,
  AvatarProps,
  AvatarGroupProps,
  BadgeProps,
  StatusIndicatorProps,
  PresenceProps,
  UserCardProps,
  NotificationBadgeProps,
  TagProps,
};

export {
  getInitials,
  getColorFromName,
  formatLastSeen,
  AVATAR_SIZES,
  STATUS_COLORS,
  STATUS_LABELS,
  BADGE_COLORS,
};

export default {
  Avatar,
  AvatarGroup,
  Badge,
  StatusIndicator,
  Presence,
  UserCard,
  NotificationBadge,
  Tag,
};
