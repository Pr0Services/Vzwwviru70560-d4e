/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU™ — ASSET COMPONENTS                             ║
 * ║                       Composants avec Switch Midjourney                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Composants React qui gèrent automatiquement le switch entre:
 * - Emojis/Placeholders (développement)
 * - Images Midjourney (production)
 * 
 * @version 1.0.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  ASSET_MODE,
  ENABLE_FALLBACK,
  AssetConfig,
  NOVA_ASSETS,
  SPHERE_ASSETS,
  CHECKPOINT_ASSETS,
  BUREAU_SECTION_ASSETS,
  AGENT_ASSETS,
  UI_ASSETS,
  BACKGROUND_ASSETS,
  NovaState,
  SphereId,
  CheckpointState,
  BureauSectionId,
  isMidjourneyMode,
} from '../config/assets.config';

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK: useAsset
// ═══════════════════════════════════════════════════════════════════════════════

interface UseAssetResult {
  src: string;
  isImage: boolean;
  isLoading: boolean;
  hasError: boolean;
  fallback: string;
  color: string;
  alt: string;
}

/**
 * Hook pour gérer un asset avec fallback automatique
 */
export function useAsset(config: AssetConfig): UseAssetResult {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const isImage = isMidjourneyMode();
  const src = isImage ? config.midjourney : config.placeholder;
  
  // Précharger l'image en mode Midjourney
  useEffect(() => {
    if (isImage && config.midjourney) {
      setIsLoading(true);
      setHasError(false);
      
      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
      };
      img.onerror = () => {
        setIsLoading(false);
        setHasError(true);
      };
      img.src = config.midjourney;
    }
  }, [isImage, config.midjourney]);
  
  return {
    src: hasError && ENABLE_FALLBACK ? config.placeholder : src,
    isImage: isImage && !hasError,
    isLoading,
    hasError,
    fallback: config.placeholder,
    color: config.color,
    alt: config.alt,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: AssetIcon
// ═══════════════════════════════════════════════════════════════════════════════

interface AssetIconProps {
  config: AssetConfig;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Composant universel pour afficher un asset (emoji ou image)
 */
export const AssetIcon: React.FC<AssetIconProps> = ({
  config,
  size = 24,
  className,
  style,
}) => {
  const { src, isImage, isLoading, hasError, fallback, color, alt } = useAsset(config);
  
  // Loading state
  if (isLoading) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          backgroundColor: `${color}22`,
          borderRadius: '50%',
          ...style,
        }}
      >
        <span style={{ 
          width: size * 0.4, 
          height: size * 0.4, 
          borderRadius: '50%',
          border: `2px solid ${color}`,
          borderTopColor: 'transparent',
          animation: 'spin 1s linear infinite',
        }} />
      </span>
    );
  }
  
  // Image mode
  if (isImage) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          ...style,
        }}
        onError={(e) => {
          // Fallback to placeholder on error
          if (ENABLE_FALLBACK) {
            (e.target as HTMLImageElement).style.display = 'none';
          }
        }}
      />
    );
  }
  
  // Placeholder mode (emoji)
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        fontSize: size * 0.7,
        lineHeight: 1,
        ...style,
      }}
      role="img"
      aria-label={alt}
    >
      {src}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: NovaIcon
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaIconProps {
  state?: NovaState;
  size?: number;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const NovaIcon: React.FC<NovaIconProps> = ({
  state = 'idle',
  size = 32,
  animated = true,
  className,
  style,
}) => {
  const config = NOVA_ASSETS[state];
  const { src, isImage, color, alt } = useAsset(config);
  
  const animationStyle = animated && state === 'thinking' 
    ? { animation: 'pulse 2s ease-in-out infinite' }
    : {};
  
  if (isImage) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          filter: `drop-shadow(0 0 ${size * 0.2}px ${color}66)`,
          ...animationStyle,
          ...style,
        }}
      />
    );
  }
  
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        fontSize: size * 0.6,
        backgroundColor: `${color}22`,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        ...animationStyle,
        ...style,
      }}
      role="img"
      aria-label={alt}
    >
      {src}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: SphereIcon
// ═══════════════════════════════════════════════════════════════════════════════

interface SphereIconProps {
  sphereId: SphereId;
  size?: number;
  showGlow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SphereIcon: React.FC<SphereIconProps> = ({
  sphereId,
  size = 40,
  showGlow = false,
  className,
  style,
}) => {
  const config = SPHERE_ASSETS[sphereId];
  const { src, isImage, color, alt } = useAsset(config);
  
  const glowStyle = showGlow ? {
    filter: `drop-shadow(0 0 ${size * 0.3}px ${color}88)`,
  } : {};
  
  if (isImage) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          ...glowStyle,
          ...style,
        }}
      />
    );
  }
  
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        fontSize: size * 0.5,
        backgroundColor: `${color}22`,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        ...glowStyle,
        ...style,
      }}
      role="img"
      aria-label={alt}
    >
      {src}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: CheckpointIcon
// ═══════════════════════════════════════════════════════════════════════════════

interface CheckpointIconProps {
  state: CheckpointState;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CheckpointIcon: React.FC<CheckpointIconProps> = ({
  state,
  size = 24,
  className,
  style,
}) => {
  const config = CHECKPOINT_ASSETS[state];
  return <AssetIcon config={config} size={size} className={className} style={style} />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: SectionIcon
// ═══════════════════════════════════════════════════════════════════════════════

interface SectionIconProps {
  sectionId: BureauSectionId;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const SectionIcon: React.FC<SectionIconProps> = ({
  sectionId,
  size = 28,
  className,
  style,
}) => {
  const config = BUREAU_SECTION_ASSETS[sectionId];
  return <AssetIcon config={config} size={size} className={className} style={style} />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: AgentAvatar
// ═══════════════════════════════════════════════════════════════════════════════

interface AgentAvatarProps {
  agentId: string;
  size?: number;
  showLevel?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agentId,
  size = 40,
  showLevel = false,
  className,
  style,
}) => {
  const config = AGENT_ASSETS[agentId];
  
  // Fallback si agent inconnu
  if (!config) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          fontSize: size * 0.5,
          backgroundColor: '#3EB4A222',
          borderRadius: '50%',
          border: '2px solid #3EB4A2',
          ...style,
        }}
      >
        🤖
      </span>
    );
  }
  
  const { src, isImage, color, alt } = useAsset(config);
  
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {isImage ? (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            width: size,
            height: size,
            objectFit: 'cover',
            borderRadius: '50%',
            border: `2px solid ${color}`,
            ...style,
          }}
        />
      ) : (
        <span
          className={className}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size,
            height: size,
            fontSize: size * 0.5,
            backgroundColor: `${color}22`,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            ...style,
          }}
          role="img"
          aria-label={alt}
        >
          {src}
        </span>
      )}
      
      {/* Level badge */}
      {showLevel && config.level && (
        <span
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            fontSize: 9,
            fontWeight: 700,
            padding: '1px 4px',
            backgroundColor: color,
            color: '#0d0d0f',
            borderRadius: 4,
          }}
        >
          {config.level}
        </span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: BackgroundImage
// ═══════════════════════════════════════════════════════════════════════════════

interface BackgroundImageProps {
  type: 'universe' | 'bureau' | 'map' | 'landing';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({
  type,
  children,
  className,
  style,
}) => {
  const config = BACKGROUND_ASSETS[type];
  const { isImage } = useAsset(config);
  
  const backgroundStyle: React.CSSProperties = isImage
    ? {
        backgroundImage: `url(${config.midjourney})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        backgroundColor: config.color,
      };
  
  return (
    <div
      className={className}
      style={{
        ...backgroundStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: Logo
// ═══════════════════════════════════════════════════════════════════════════════

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'icon',
  size = 40,
  className,
  style,
}) => {
  const config = variant === 'icon' ? UI_ASSETS.appIcon : UI_ASSETS.logo;
  const { src, isImage, color, alt } = useAsset(config);
  
  if (isImage) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          ...style,
        }}
      />
    );
  }
  
  // Placeholder: CHE·NU text logo
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: size * 0.4,
        fontWeight: 700,
        color: color,
        letterSpacing: 2,
        ...style,
      }}
    >
      <span style={{ fontSize: size * 0.5 }}>{src}</span>
      {variant === 'full' && <span>CHE·NU</span>}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CSS ANIMATIONS (à inclure une fois dans l'app)
// ═══════════════════════════════════════════════════════════════════════════════

export const AssetAnimationsCSS = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  ASSET_MODE,
  isMidjourneyMode,
  NOVA_ASSETS,
  SPHERE_ASSETS,
  CHECKPOINT_ASSETS,
  BUREAU_SECTION_ASSETS,
  AGENT_ASSETS,
};
