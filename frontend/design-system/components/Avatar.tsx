// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — AVATAR COMPONENT
// Production-grade avatar with multiple variants for users and AI agents
// ═══════════════════════════════════════════════════════════════════════════════

import React, { forwardRef, useState, useMemo, type HTMLAttributes, type ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Avatar size variants
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Avatar shape variants
 */
export type AvatarShape = 'circle' | 'rounded' | 'square';

/**
 * Avatar status indicator
 */
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | 'none';

/**
 * Avatar props
 */
export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src?: string;
  
  /** Alt text for the image */
  alt?: string;
  
  /** Name to generate initials from */
  name?: string;
  
  /** Size */
  size?: AvatarSize;
  
  /** Shape */
  shape?: AvatarShape;
  
  /** Status indicator */
  status?: AvatarStatus;
  
  /** Custom fallback icon */
  fallbackIcon?: ReactNode;
  
  /** Background color (for initials/icon fallback) */
  bgColor?: string;
  
  /** Text color (for initials) */
  textColor?: string;
  
  /** Show ring/border */
  ring?: boolean;
  
  /** Ring color */
  ringColor?: string;
  
  /** Loading state */
  loading?: boolean;
  
  /** Is this an AI agent? */
  isAgent?: boolean;
  
  /** Agent aura glow effect */
  agentAura?: boolean;
  
  /** Agent aura color */
  auraColor?: string;
  
  /** Sphere association (for color) */
  sphere?: string;
}

/**
 * Avatar Group props
 */
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars to show before +N */
  max?: number;
  
  /** Size for all avatars */
  size?: AvatarSize;
  
  /** Spacing between avatars (negative overlap) */
  spacing?: 'tight' | 'normal' | 'loose';
  
  /** Children avatars */
  children: ReactNode;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SIZE_CLASSES: Record<AvatarSize, { container: string; text: string; status: string; ring: string }> = {
  xs: {
    container: 'w-6 h-6',
    text: 'text-[10px]',
    status: 'w-2 h-2 border',
    ring: 'ring-1 ring-offset-1',
  },
  sm: {
    container: 'w-8 h-8',
    text: 'text-xs',
    status: 'w-2.5 h-2.5 border-[1.5px]',
    ring: 'ring-2 ring-offset-1',
  },
  md: {
    container: 'w-10 h-10',
    text: 'text-sm',
    status: 'w-3 h-3 border-2',
    ring: 'ring-2 ring-offset-2',
  },
  lg: {
    container: 'w-12 h-12',
    text: 'text-base',
    status: 'w-3.5 h-3.5 border-2',
    ring: 'ring-2 ring-offset-2',
  },
  xl: {
    container: 'w-16 h-16',
    text: 'text-lg',
    status: 'w-4 h-4 border-2',
    ring: 'ring-[3px] ring-offset-2',
  },
  '2xl': {
    container: 'w-24 h-24',
    text: 'text-2xl',
    status: 'w-5 h-5 border-[3px]',
    ring: 'ring-[3px] ring-offset-3',
  },
};

const SHAPE_CLASSES: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-lg',
  square: 'rounded-none',
};

const STATUS_COLORS: Record<AvatarStatus, string> = {
  online: 'bg-[var(--color-status-success)]',
  offline: 'bg-[var(--color-text-tertiary)]',
  busy: 'bg-[var(--color-status-error)]',
  away: 'bg-[var(--color-status-warning)]',
  none: '',
};

const SPACING_CLASSES: Record<NonNullable<AvatarGroupProps['spacing']>, string> = {
  tight: '-space-x-3',
  normal: '-space-x-2',
  loose: '-space-x-1',
};

// Sphere color mapping
const SPHERE_COLORS: Record<string, string> = {
  personal: 'var(--sphere-personal)',
  business: 'var(--sphere-business)',
  creative: 'var(--sphere-creative)',
  scholar: 'var(--sphere-scholar)',
  social: 'var(--sphere-social)',
  community: 'var(--sphere-community)',
  xr: 'var(--sphere-xr)',
  myteam: 'var(--sphere-myteam)',
  ailab: 'var(--sphere-ailab)',
  entertainment: 'var(--sphere-entertainment)',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate initials from a name
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate a consistent color from a string
 */
function stringToColor(str: string): string {
  const colors = [
    'var(--copper-500)',
    'var(--steel-500)',
    'var(--forest-500)',
    'var(--blueprint-500)',
    'var(--rust-400)',
    'var(--amber-600)',
    '#9F5FB0',  // Purple
    '#14B8A6',  // Teal
    '#EC4899',  // Pink
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

// =============================================================================
// DEFAULT FALLBACK ICON
// =============================================================================

function DefaultUserIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function DefaultAgentIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

// =============================================================================
// AVATAR COMPONENT
// =============================================================================

/**
 * Avatar Component
 * 
 * Displays user or agent avatars with support for images, initials,
 * status indicators, and AI agent aura effects.
 * 
 * @example
 * ```tsx
 * // User avatar with image
 * <Avatar src="/user.jpg" alt="John Doe" name="John Doe" size="lg" />
 * 
 * // User avatar with initials
 * <Avatar name="John Doe" status="online" />
 * 
 * // AI Agent avatar
 * <Avatar
 *   isAgent
 *   name="NOVA"
 *   agentAura
 *   auraColor="var(--copper-500)"
 *   sphere="business"
 * />
 * ```
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar(
    {
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      status = 'none',
      fallbackIcon,
      bgColor,
      textColor,
      ring = false,
      ringColor,
      loading = false,
      isAgent = false,
      agentAura = false,
      auraColor,
      sphere,
      className = '',
      style,
      ...props
    },
    ref
  ) {
    const [imgError, setImgError] = useState(false);
    const showImage = src && !imgError && !loading;
    const showInitials = name && !showImage;
    const showFallback = !showImage && !showInitials;

    // Memoize computed colors
    const computedBgColor = useMemo(() => {
      if (bgColor) return bgColor;
      if (sphere && SPHERE_COLORS[sphere]) return SPHERE_COLORS[sphere];
      if (name) return stringToColor(name);
      return 'var(--color-bg-tertiary)';
    }, [bgColor, sphere, name]);

    const computedAuraColor = useMemo(() => {
      if (auraColor) return auraColor;
      if (sphere && SPHERE_COLORS[sphere]) return SPHERE_COLORS[sphere];
      return 'var(--color-brand-primary)';
    }, [auraColor, sphere]);

    const sizeConfig = SIZE_CLASSES[size];

    return (
      <div
        ref={ref}
        className={`
          relative inline-flex items-center justify-center
          ${sizeConfig.container}
          ${SHAPE_CLASSES[shape]}
          ${ring ? `${sizeConfig.ring} ring-offset-[var(--color-bg-primary)]` : ''}
          ${className}
        `}
        style={{
          ...style,
          ...(ring && ringColor ? { '--tw-ring-color': ringColor } : {}),
        } as React.CSSProperties}
        {...props}
      >
        {/* Agent aura glow */}
        {isAgent && agentAura && (
          <div
            className={`
              absolute inset-0
              ${SHAPE_CLASSES[shape]}
              animate-pulse
            `}
            style={{
              boxShadow: `0 0 20px ${computedAuraColor}, 0 0 40px ${computedAuraColor}40`,
            }}
          />
        )}

        {/* Main avatar container */}
        <div
          className={`
            relative
            w-full h-full
            flex items-center justify-center
            ${SHAPE_CLASSES[shape]}
            overflow-hidden
            ${isAgent ? 'ring-2 ring-offset-1' : ''}
          `}
          style={{
            backgroundColor: showImage ? undefined : computedBgColor,
            ...(isAgent ? { '--tw-ring-color': computedAuraColor } : {}),
          } as React.CSSProperties}
        >
          {/* Loading state */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-tertiary)]">
              <div
                className={`
                  animate-spin rounded-full
                  border-2 border-[var(--color-border-default)]
                  border-t-[var(--color-brand-primary)]
                  ${size === 'xs' || size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'}
                `}
              />
            </div>
          )}

          {/* Image */}
          {showImage && (
            <img
              src={src}
              alt={alt || name || 'Avatar'}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}

          {/* Initials */}
          {showInitials && (
            <span
              className={`
                font-semibold
                ${sizeConfig.text}
                ${textColor ? '' : 'text-white'}
              `}
              style={textColor ? { color: textColor } : undefined}
            >
              {getInitials(name)}
            </span>
          )}

          {/* Fallback icon */}
          {showFallback && (
            fallbackIcon || (
              isAgent ? (
                <DefaultAgentIcon className={`w-1/2 h-1/2 text-[var(--color-text-tertiary)]`} />
              ) : (
                <DefaultUserIcon className={`w-1/2 h-1/2 text-[var(--color-text-tertiary)]`} />
              )
            )
          )}
        </div>

        {/* Status indicator */}
        {status !== 'none' && (
          <span
            className={`
              absolute
              ${shape === 'circle' ? 'bottom-0 right-0' : 'bottom-0 right-0'}
              ${sizeConfig.status}
              ${SHAPE_CLASSES.circle}
              ${STATUS_COLORS[status]}
              border-[var(--color-bg-primary)]
            `}
            aria-label={`Status: ${status}`}
          />
        )}

        {/* Agent badge */}
        {isAgent && size !== 'xs' && size !== 'sm' && (
          <span
            className={`
              absolute -bottom-1 -right-1
              flex items-center justify-center
              ${size === 'md' ? 'w-4 h-4 text-[8px]' : size === 'lg' ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-[10px]'}
              rounded-full
              bg-[var(--color-bg-secondary)]
              border-2 border-[var(--color-bg-primary)]
              text-[var(--color-brand-primary)]
              font-bold
            `}
            title="AI Agent"
          >
            AI
          </span>
        )}
      </div>
    );
  }
);

// =============================================================================
// AVATAR GROUP COMPONENT
// =============================================================================

/**
 * Avatar Group
 * 
 * Displays a group of avatars with overlap and +N indicator.
 * 
 * @example
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar name="John Doe" />
 *   <Avatar name="Jane Smith" />
 *   <Avatar name="Bob Wilson" />
 *   <Avatar name="Alice Brown" />
 *   <Avatar name="Charlie Green" />
 * </AvatarGroup>
 * ```
 */
export function AvatarGroup({
  max = 5,
  size = 'md',
  spacing = 'normal',
  className = '',
  children,
  ...props
}: AvatarGroupProps): JSX.Element {
  const avatars = React.Children.toArray(children);
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div
      className={`
        flex items-center
        ${SPACING_CLASSES[spacing]}
        ${className}
      `}
      {...props}
    >
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className="relative"
          style={{ zIndex: visibleAvatars.length - index }}
        >
          {React.isValidElement<AvatarProps>(avatar)
            ? React.cloneElement(avatar, {
                size,
                ring: true,
                ringColor: 'var(--color-bg-primary)',
              })
            : avatar}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            relative flex items-center justify-center
            ${SIZE_CLASSES[size].container}
            rounded-full
            bg-[var(--color-bg-tertiary)]
            border-2 border-[var(--color-bg-primary)]
            ${SIZE_CLASSES[size].text}
            font-medium
            text-[var(--color-text-secondary)]
          `}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// AVATAR WITH PRESENCE COMPONENT
// =============================================================================

export interface AvatarWithPresenceProps extends AvatarProps {
  /** Presence text (e.g., "Online", "Last seen 2h ago") */
  presenceText?: string;
  
  /** Primary label (name) */
  label?: string;
  
  /** Secondary label (role, title, etc.) */
  sublabel?: string;
  
  /** Layout direction */
  layout?: 'horizontal' | 'vertical';
}

/**
 * Avatar with Presence
 * 
 * Avatar with accompanying text for presence/identity display.
 * 
 * @example
 * ```tsx
 * <AvatarWithPresence
 *   src="/user.jpg"
 *   label="John Doe"
 *   sublabel="Product Manager"
 *   status="online"
 *   presenceText="Active now"
 * />
 * ```
 */
export function AvatarWithPresence({
  label,
  sublabel,
  presenceText,
  layout = 'horizontal',
  className = '',
  ...avatarProps
}: AvatarWithPresenceProps): JSX.Element {
  return (
    <div
      className={`
        flex items-center
        ${layout === 'vertical' ? 'flex-col text-center' : 'flex-row'}
        gap-3
        ${className}
      `}
    >
      <Avatar {...avatarProps} />
      {(label || sublabel || presenceText) && (
        <div className={`min-w-0 ${layout === 'vertical' ? '' : 'flex-1'}`}>
          {label && (
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {label}
            </p>
          )}
          {sublabel && (
            <p className="text-xs text-[var(--color-text-secondary)] truncate">
              {sublabel}
            </p>
          )}
          {presenceText && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              {presenceText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// AGENT AVATAR COMPONENT
// =============================================================================

export interface AgentAvatarProps extends Omit<AvatarProps, 'isAgent' | 'agentAura'> {
  /** Agent level (0-3) */
  level?: 0 | 1 | 2 | 3;
  
  /** Agent is active/processing */
  active?: boolean;
  
  /** Show level badge */
  showLevel?: boolean;
}

const LEVEL_LABELS: Record<number, string> = {
  0: 'L0 - Orchestrateur',
  1: 'L1 - Directeur',
  2: 'L2 - Spécialiste',
  3: 'L3 - Exécutant',
};

/**
 * Agent Avatar
 * 
 * Specialized avatar for AI agents with level indicators and active states.
 * 
 * @example
 * ```tsx
 * <AgentAvatar
 *   name="NOVA"
 *   sphere="business"
 *   level={0}
 *   active
 *   showLevel
 * />
 * ```
 */
export function AgentAvatar({
  level = 2,
  active = false,
  showLevel = false,
  size = 'md',
  className = '',
  ...avatarProps
}: AgentAvatarProps): JSX.Element {
  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <Avatar
        {...avatarProps}
        size={size}
        isAgent
        agentAura={active}
      />
      {showLevel && size !== 'xs' && size !== 'sm' && (
        <span
          className={`
            mt-1
            px-1.5 py-0.5
            text-[9px] font-semibold
            bg-[var(--color-bg-tertiary)]
            text-[var(--color-text-secondary)]
            rounded
            whitespace-nowrap
          `}
          title={LEVEL_LABELS[level]}
        >
          L{level}
        </span>
      )}
      {active && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-primary)] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-brand-primary)]" />
        </span>
      )}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Avatar;
