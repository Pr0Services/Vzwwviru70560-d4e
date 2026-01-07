// CHE·NU™ Avatar & User Profile Components
// Comprehensive user representation with avatars, badges, and profile cards

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
  CSSProperties,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AvatarShape = 'circle' | 'square' | 'rounded';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'dnd';
type BadgePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type ProfileLayout = 'horizontal' | 'vertical' | 'compact';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  statusPosition?: BadgePosition;
  badge?: string | number;
  badgePosition?: BadgePosition;
  badgeColor?: string;
  fallbackIcon?: ReactNode;
  bordered?: boolean;
  borderColor?: string;
  onClick?: () => void;
  className?: string;
}

interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    name?: string;
    alt?: string;
  }>;
  max?: number;
  size?: AvatarSize;
  shape?: AvatarShape;
  spacing?: number;
  showOverflow?: boolean;
  bordered?: boolean;
  onClick?: (index: number) => void;
  onOverflowClick?: () => void;
  className?: string;
}

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
    department?: string;
    status?: AvatarStatus;
    bio?: string;
    location?: string;
    phone?: string;
    socialLinks?: Array<{ type: string; url: string }>;
    stats?: Array<{ label: string; value: string | number }>;
    tags?: string[];
  };
  layout?: ProfileLayout;
  showEmail?: boolean;
  showStatus?: boolean;
  showBio?: boolean;
  showStats?: boolean;
  showActions?: boolean;
  actions?: ReactNode;
  onClick?: () => void;
  onMessage?: () => void;
  onFollow?: () => void;
  className?: string;
}

interface UserListItemProps {
  user: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
    status?: AvatarStatus;
    lastSeen?: Date;
  };
  selected?: boolean;
  showStatus?: boolean;
  showEmail?: boolean;
  showLastSeen?: boolean;
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
}

interface PresenceIndicatorProps {
  status: AvatarStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  pulse?: boolean;
  className?: string;
}

interface InitialsAvatarProps {
  name: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  backgroundColor?: string;
  textColor?: string;
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

const SIZE_CONFIG: Record<AvatarSize, { size: number; fontSize: number; statusSize: number; badgeSize: number }> = {
  xs: { size: 24, fontSize: 10, statusSize: 6, badgeSize: 14 },
  sm: { size: 32, fontSize: 12, statusSize: 8, badgeSize: 16 },
  md: { size: 40, fontSize: 14, statusSize: 10, badgeSize: 18 },
  lg: { size: 48, fontSize: 16, statusSize: 12, badgeSize: 20 },
  xl: { size: 64, fontSize: 20, statusSize: 14, badgeSize: 22 },
  '2xl': { size: 96, fontSize: 28, statusSize: 18, badgeSize: 26 },
};

const STATUS_CONFIG: Record<AvatarStatus, { color: string; label: string }> = {
  online: { color: '#38A169', label: 'Online' },
  offline: { color: '#A0AEC0', label: 'Offline' },
  away: { color: '#ECC94B', label: 'Away' },
  busy: { color: '#E53E3E', label: 'Busy' },
  dnd: { color: '#E53E3E', label: 'Do Not Disturb' },
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
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorFromName(name: string): string {
  if (!name) return AVATAR_COLORS[0];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function getShapeRadius(shape: AvatarShape, size: number): string {
  switch (shape) {
    case 'circle':
      return '50%';
    case 'square':
      return '0';
    case 'rounded':
      return `${Math.min(size * 0.2, 12)}px`;
    default:
      return '50%';
  }
}

function formatLastSeen(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Avatar styles
  avatarContainer: {
    position: 'relative' as const,
    display: 'inline-flex',
    flexShrink: 0,
  },

  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
    fontWeight: 600,
    userSelect: 'none' as const,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },

  avatarBordered: {
    border: '2px solid #ffffff',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
  },

  avatarClickable: {
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },

  avatarClickableHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },

  statusIndicator: {
    position: 'absolute' as const,
    borderRadius: '50%',
    border: '2px solid #ffffff',
  },

  statusIndicatorPulse: {
    animation: 'pulse 2s ease-in-out infinite',
  },

  badge: {
    position: 'absolute' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100px',
    fontSize: '10px',
    fontWeight: 600,
    color: '#ffffff',
    border: '2px solid #ffffff',
  },

  // Avatar group styles
  avatarGroup: {
    display: 'flex',
    alignItems: 'center',
  },

  avatarGroupItem: {
    marginLeft: '-8px',
    transition: 'transform 0.15s, z-index 0.15s',
  },

  avatarGroupItemFirst: {
    marginLeft: 0,
  },

  avatarGroupItemHover: {
    transform: 'translateY(-4px)',
    zIndex: 10,
  },

  avatarGroupOverflow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  avatarGroupOverflowHover: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  // User card styles
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
  },

  userCardHover: {
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },

  userCardClickable: {
    cursor: 'pointer',
  },

  userCardHeader: {
    padding: '24px',
    background: `linear-gradient(135deg, ${BRAND.sacredGold}20, ${BRAND.cenoteTurquoise}10)`,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
  },

  userCardHeaderHorizontal: {
    flexDirection: 'row' as const,
    textAlign: 'left' as const,
    alignItems: 'flex-start',
    gap: '16px',
  },

  userCardHeaderCompact: {
    padding: '16px',
    flexDirection: 'row' as const,
    textAlign: 'left' as const,
    alignItems: 'center',
    gap: '12px',
  },

  userCardAvatar: {
    marginBottom: '12px',
  },

  userCardAvatarHorizontal: {
    marginBottom: 0,
  },

  userCardInfo: {
    flex: 1,
    minWidth: 0,
  },

  userCardName: {
    fontSize: '18px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    margin: 0,
  },

  userCardNameCompact: {
    fontSize: '15px',
  },

  userCardRole: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    marginTop: '2px',
  },

  userCardRoleCompact: {
    fontSize: '13px',
  },

  userCardEmail: {
    fontSize: '13px',
    color: BRAND.cenoteTurquoise,
    marginTop: '4px',
  },

  userCardBody: {
    padding: '20px 24px',
  },

  userCardBodyCompact: {
    padding: '12px 16px',
  },

  userCardBio: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    lineHeight: 1.6,
    marginBottom: '16px',
  },

  userCardLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: BRAND.ancientStone,
    marginBottom: '12px',
  },

  userCardStats: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '16px 0',
    borderTop: `1px solid ${BRAND.ancientStone}10`,
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
    marginBottom: '16px',
  },

  userCardStat: {
    textAlign: 'center' as const,
  },

  userCardStatValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: BRAND.uiSlate,
  },

  userCardStatLabel: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    marginTop: '2px',
  },

  userCardTags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },

  userCardTag: {
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
    borderRadius: '100px',
  },

  userCardActions: {
    display: 'flex',
    gap: '8px',
    padding: '16px 24px',
    borderTop: `1px solid ${BRAND.ancientStone}10`,
  },

  userCardActionsCompact: {
    padding: '12px 16px',
  },

  userCardButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  userCardButtonPrimary: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  userCardButtonPrimaryHover: {
    backgroundColor: BRAND.earthEmber,
  },

  userCardButtonSecondary: {
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
  },

  userCardButtonSecondaryHover: {
    backgroundColor: `${BRAND.ancientStone}20`,
  },

  // User list item styles
  userListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}10`,
    transition: 'all 0.15s',
  },

  userListItemHover: {
    backgroundColor: BRAND.softSand,
    borderColor: `${BRAND.ancientStone}20`,
  },

  userListItemSelected: {
    backgroundColor: `${BRAND.sacredGold}10`,
    borderColor: BRAND.sacredGold,
  },

  userListItemClickable: {
    cursor: 'pointer',
  },

  userListItemInfo: {
    flex: 1,
    minWidth: 0,
  },

  userListItemName: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },

  userListItemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: BRAND.ancientStone,
    marginTop: '2px',
  },

  userListItemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Presence indicator styles
  presenceIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },

  presenceDot: {
    borderRadius: '50%',
    flexShrink: 0,
  },

  presenceLabel: {
    fontSize: '13px',
    fontWeight: 500,
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
  badgeColor = BRAND.cenoteTurquoise,
  fallbackIcon,
  bordered = false,
  borderColor,
  onClick,
  className,
}: AvatarProps): JSX.Element {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const config = SIZE_CONFIG[size];
  const initials = name ? getInitials(name) : '?';
  const bgColor = name ? getColorFromName(name) : BRAND.ancientStone;
  const borderRadius = getShapeRadius(shape, config.size);

  const showImage = src && !imageError;
  const showInitials = !showImage && !fallbackIcon;
  const showFallback = !showImage && fallbackIcon;

  const getPositionStyles = (position: BadgePosition, indicatorSize: number): CSSProperties => {
    const offset = -indicatorSize / 4;
    switch (position) {
      case 'top-left':
        return { top: offset, left: offset };
      case 'top-right':
        return { top: offset, right: offset };
      case 'bottom-left':
        return { bottom: offset, left: offset };
      case 'bottom-right':
        return { bottom: offset, right: offset };
      default:
        return { bottom: offset, right: offset };
    }
  };

  return (
    <div
      style={styles.avatarContainer}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          ...styles.avatar,
          width: config.size,
          height: config.size,
          fontSize: config.fontSize,
          borderRadius,
          backgroundColor: showImage ? BRAND.softSand : bgColor,
          color: showImage ? BRAND.uiSlate : '#ffffff',
          ...(bordered && {
            ...styles.avatarBordered,
            borderColor: borderColor || '#ffffff',
          }),
          ...(onClick && styles.avatarClickable),
          ...(onClick && isHovered && styles.avatarClickableHover),
        }}
        onClick={onClick}
      >
        {showImage && (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            style={styles.avatarImage}
            onError={() => setImageError(true)}
          />
        )}
        {showInitials && initials}
        {showFallback && fallbackIcon}
      </div>

      {/* Status indicator */}
      {status && (
        <div
          style={{
            ...styles.statusIndicator,
            width: config.statusSize,
            height: config.statusSize,
            backgroundColor: STATUS_CONFIG[status].color,
            ...getPositionStyles(statusPosition, config.statusSize),
            ...(status === 'online' && styles.statusIndicatorPulse),
          }}
        />
      )}

      {/* Badge */}
      {badge !== undefined && (
        <div
          style={{
            ...styles.badge,
            minWidth: config.badgeSize,
            height: config.badgeSize,
            padding: '0 4px',
            backgroundColor: badgeColor,
            ...getPositionStyles(badgePosition, config.badgeSize),
          }}
        >
          {badge}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// AVATAR GROUP COMPONENT
// ============================================================

export function AvatarGroup({
  avatars,
  max = 5,
  size = 'md',
  shape = 'circle',
  spacing = -8,
  showOverflow = true,
  bordered = true,
  onClick,
  onOverflowClick,
  className,
}: AvatarGroupProps): JSX.Element {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [overflowHovered, setOverflowHovered] = useState(false);

  const config = SIZE_CONFIG[size];
  const visibleAvatars = avatars.slice(0, max);
  const overflowCount = avatars.length - max;
  const hasOverflow = overflowCount > 0;

  return (
    <div style={styles.avatarGroup} className={className}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          style={{
            ...styles.avatarGroupItem,
            marginLeft: index === 0 ? 0 : spacing,
            zIndex: hoveredIndex === index ? 10 : visibleAvatars.length - index,
            ...(hoveredIndex === index && styles.avatarGroupItemHover),
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Avatar
            src={avatar.src}
            name={avatar.name}
            alt={avatar.alt}
            size={size}
            shape={shape}
            bordered={bordered}
            onClick={() => onClick?.(index)}
          />
        </div>
      ))}

      {showOverflow && hasOverflow && (
        <div
          style={{
            ...styles.avatarGroupItem,
            marginLeft: spacing,
            zIndex: 0,
          }}
        >
          <div
            style={{
              ...styles.avatarGroupOverflow,
              width: config.size,
              height: config.size,
              fontSize: config.fontSize * 0.8,
              borderRadius: getShapeRadius(shape, config.size),
              ...(bordered && styles.avatarBordered),
              ...(overflowHovered && styles.avatarGroupOverflowHover),
            }}
            onClick={onOverflowClick}
            onMouseEnter={() => setOverflowHovered(true)}
            onMouseLeave={() => setOverflowHovered(false)}
          >
            +{overflowCount}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// USER CARD COMPONENT
// ============================================================

export function UserCard({
  user,
  layout = 'vertical',
  showEmail = true,
  showStatus = true,
  showBio = true,
  showStats = true,
  showActions = true,
  actions,
  onClick,
  onMessage,
  onFollow,
  className,
}: UserCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [messageHovered, setMessageHovered] = useState(false);
  const [followHovered, setFollowHovered] = useState(false);

  const isCompact = layout === 'compact';
  const isHorizontal = layout === 'horizontal';

  return (
    <div
      style={{
        ...styles.userCard,
        ...(isHovered && styles.userCardHover),
        ...(onClick && styles.userCardClickable),
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div
        style={{
          ...styles.userCardHeader,
          ...(isHorizontal && styles.userCardHeaderHorizontal),
          ...(isCompact && styles.userCardHeaderCompact),
        }}
      >
        <div
          style={{
            ...styles.userCardAvatar,
            ...(isHorizontal && styles.userCardAvatarHorizontal),
            ...(isCompact && styles.userCardAvatarHorizontal),
          }}
        >
          <Avatar
            src={user.avatar}
            name={user.name}
            size={isCompact ? 'lg' : 'xl'}
            status={showStatus ? user.status : undefined}
          />
        </div>

        <div style={styles.userCardInfo}>
          <h3
            style={{
              ...styles.userCardName,
              ...(isCompact && styles.userCardNameCompact),
            }}
          >
            {user.name}
          </h3>
          {user.role && (
            <div
              style={{
                ...styles.userCardRole,
                ...(isCompact && styles.userCardRoleCompact),
              }}
            >
              {user.role}
              {user.department && ` · ${user.department}`}
            </div>
          )}
          {showEmail && user.email && !isCompact && (
            <div style={styles.userCardEmail}>{user.email}</div>
          )}
        </div>
      </div>

      {/* Body */}
      {(showBio || showStats || user.tags) && !isCompact && (
        <div style={styles.userCardBody}>
          {/* Location */}
          {user.location && (
            <div style={styles.userCardLocation}>
              📍 {user.location}
            </div>
          )}

          {/* Bio */}
          {showBio && user.bio && (
            <p style={styles.userCardBio}>{user.bio}</p>
          )}

          {/* Stats */}
          {showStats && user.stats && user.stats.length > 0 && (
            <div style={styles.userCardStats}>
              {user.stats.map((stat, index) => (
                <div key={index} style={styles.userCardStat}>
                  <div style={styles.userCardStatValue}>{stat.value}</div>
                  <div style={styles.userCardStatLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {user.tags && user.tags.length > 0 && (
            <div style={styles.userCardTags}>
              {user.tags.map((tag, index) => (
                <span key={index} style={styles.userCardTag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div
          style={{
            ...styles.userCardActions,
            ...(isCompact && styles.userCardActionsCompact),
          }}
        >
          {actions || (
            <>
              {onMessage && (
                <button
                  style={{
                    ...styles.userCardButton,
                    ...styles.userCardButtonSecondary,
                    ...(messageHovered && styles.userCardButtonSecondaryHover),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMessage();
                  }}
                  onMouseEnter={() => setMessageHovered(true)}
                  onMouseLeave={() => setMessageHovered(false)}
                >
                  💬 Message
                </button>
              )}
              {onFollow && (
                <button
                  style={{
                    ...styles.userCardButton,
                    ...styles.userCardButtonPrimary,
                    ...(followHovered && styles.userCardButtonPrimaryHover),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFollow();
                  }}
                  onMouseEnter={() => setFollowHovered(true)}
                  onMouseLeave={() => setFollowHovered(false)}
                >
                  ➕ Follow
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// USER LIST ITEM COMPONENT
// ============================================================

export function UserListItem({
  user,
  selected = false,
  showStatus = true,
  showEmail = false,
  showLastSeen = false,
  actions,
  onClick,
  className,
}: UserListItemProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.userListItem,
        ...(isHovered && !selected && styles.userListItemHover),
        ...(selected && styles.userListItemSelected),
        ...(onClick && styles.userListItemClickable),
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar
        src={user.avatar}
        name={user.name}
        size="md"
        status={showStatus ? user.status : undefined}
      />

      <div style={styles.userListItemInfo}>
        <div style={styles.userListItemName}>{user.name}</div>
        <div style={styles.userListItemMeta}>
          {user.role && <span>{user.role}</span>}
          {showEmail && user.email && (
            <>
              {user.role && <span>·</span>}
              <span>{user.email}</span>
            </>
          )}
          {showLastSeen && user.lastSeen && (
            <>
              {(user.role || user.email) && <span>·</span>}
              <span>{formatLastSeen(user.lastSeen)}</span>
            </>
          )}
        </div>
      </div>

      {actions && <div style={styles.userListItemActions}>{actions}</div>}
    </div>
  );
}

// ============================================================
// PRESENCE INDICATOR COMPONENT
// ============================================================

export function PresenceIndicator({
  status,
  size = 'md',
  showLabel = true,
  pulse = true,
  className,
}: PresenceIndicatorProps): JSX.Element {
  const statusConfig = STATUS_CONFIG[status];

  const sizeMap = {
    sm: 6,
    md: 8,
    lg: 10,
  };

  return (
    <div style={styles.presenceIndicator} className={className}>
      <div
        style={{
          ...styles.presenceDot,
          width: sizeMap[size],
          height: sizeMap[size],
          backgroundColor: statusConfig.color,
          ...(pulse && status === 'online' && styles.statusIndicatorPulse),
        }}
      />
      {showLabel && (
        <span
          style={{
            ...styles.presenceLabel,
            color: statusConfig.color,
          }}
        >
          {statusConfig.label}
        </span>
      )}
    </div>
  );
}

// ============================================================
// INITIALS AVATAR COMPONENT
// ============================================================

export function InitialsAvatar({
  name,
  size = 'md',
  shape = 'circle',
  backgroundColor,
  textColor = '#ffffff',
  className,
}: InitialsAvatarProps): JSX.Element {
  const config = SIZE_CONFIG[size];
  const initials = getInitials(name);
  const bgColor = backgroundColor || getColorFromName(name);

  return (
    <div
      style={{
        ...styles.avatar,
        width: config.size,
        height: config.size,
        fontSize: config.fontSize,
        borderRadius: getShapeRadius(shape, config.size),
        backgroundColor: bgColor,
        color: textColor,
      }}
      className={className}
    >
      {initials}
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  AvatarSize,
  AvatarShape,
  AvatarStatus,
  BadgePosition,
  ProfileLayout,
  AvatarProps,
  AvatarGroupProps,
  UserCardProps,
  UserListItemProps,
  PresenceIndicatorProps,
  InitialsAvatarProps,
};

export {
  SIZE_CONFIG,
  STATUS_CONFIG,
  AVATAR_COLORS,
  getInitials,
  getColorFromName,
  getShapeRadius,
  formatLastSeen,
};

export default {
  Avatar,
  AvatarGroup,
  UserCard,
  UserListItem,
  PresenceIndicator,
  InitialsAvatar,
};
