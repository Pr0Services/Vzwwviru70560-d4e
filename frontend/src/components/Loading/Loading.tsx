// CHE·NU™ Skeleton & Loading Components
// Comprehensive loading states and placeholders

import React, { ReactNode, CSSProperties, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
type SkeletonAnimation = 'pulse' | 'wave' | 'none';

interface SkeletonProps {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: number | string;
  height?: number | string;
  count?: number;
  gap?: number;
  className?: string;
  style?: CSSProperties;
}

interface SkeletonTextProps {
  lines?: number;
  lineHeight?: number;
  gap?: number;
  lastLineWidth?: number | string;
  animation?: SkeletonAnimation;
  className?: string;
}

interface SkeletonAvatarProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square' | 'rounded';
  animation?: SkeletonAnimation;
  className?: string;
}

interface SkeletonButtonProps {
  width?: number | string;
  height?: number;
  rounded?: boolean;
  animation?: SkeletonAnimation;
  className?: string;
}

interface SkeletonCardProps {
  hasImage?: boolean;
  imageHeight?: number;
  hasTitle?: boolean;
  hasSubtitle?: boolean;
  hasBody?: boolean;
  bodyLines?: number;
  hasFooter?: boolean;
  animation?: SkeletonAnimation;
  className?: string;
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  animation?: SkeletonAnimation;
  className?: string;
}

interface SkeletonListProps {
  items?: number;
  hasAvatar?: boolean;
  avatarSize?: number;
  hasTitle?: boolean;
  hasSubtitle?: boolean;
  hasAction?: boolean;
  animation?: SkeletonAnimation;
  className?: string;
}

interface LoadingSpinnerProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  thickness?: number;
  speed?: number;
  label?: string;
  className?: string;
}

interface LoadingDotsProps {
  size?: number;
  color?: string;
  count?: number;
  className?: string;
}

interface LoadingBarProps {
  height?: number;
  color?: string;
  indeterminate?: boolean;
  progress?: number;
  className?: string;
}

interface LoadingOverlayProps {
  visible: boolean;
  spinner?: ReactNode;
  text?: string;
  blur?: boolean;
  dark?: boolean;
  zIndex?: number;
  children?: ReactNode;
  className?: string;
}

interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  animated?: boolean;
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

const SPINNER_SIZES: Record<string, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const AVATAR_SIZES: Record<string, number> = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

// ============================================================
// STYLES
// ============================================================

const styles = {
  skeleton: {
    backgroundColor: BRAND.softSand,
    display: 'block',
  },

  skeletonPulse: {
    animation: 'skeletonPulse 1.5s ease-in-out infinite',
  },

  skeletonWave: {
    position: 'relative' as const,
    overflow: 'hidden',
  },

  skeletonWaveAfter: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transform: 'translateX(-100%)',
    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)`,
    animation: 'skeletonWave 1.5s ease-in-out infinite',
  },

  skeletonText: {
    borderRadius: '4px',
    height: '1em',
  },

  skeletonCircular: {
    borderRadius: '50%',
  },

  skeletonRectangular: {
    borderRadius: '0',
  },

  skeletonRounded: {
    borderRadius: '8px',
  },

  spinner: {
    display: 'inline-block',
    borderStyle: 'solid',
    borderColor: `${BRAND.ancientStone}30`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  spinnerContainer: {
    display: 'inline-flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },

  spinnerLabel: {
    fontSize: '14px',
    color: BRAND.ancientStone,
  },

  dots: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },

  dot: {
    borderRadius: '50%',
    animation: 'dotPulse 1.4s ease-in-out infinite',
  },

  loadingBar: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: '4px',
  },

  loadingBarTrack: {
    width: '100%',
    backgroundColor: `${BRAND.ancientStone}20`,
  },

  loadingBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },

  loadingBarIndeterminate: {
    width: '40%',
    animation: 'indeterminate 1.5s ease-in-out infinite',
  },

  overlay: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'opacity 0.2s, visibility 0.2s',
  },

  overlayBlur: {
    backdropFilter: 'blur(4px)',
  },

  overlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  overlayLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },

  overlayText: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
  },

  progressCircle: {
    transform: 'rotate(-90deg)',
  },

  progressCircleValue: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  cardImage: {
    width: '100%',
  },

  cardContent: {
    padding: '16px',
  },

  cardFooter: {
    padding: '12px 16px',
    borderTop: `1px solid ${BRAND.ancientStone}15`,
    display: 'flex',
    gap: '8px',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },

  tableCell: {
    padding: '12px 16px',
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
  },

  tableHeader: {
    backgroundColor: BRAND.softSand,
    fontWeight: 600,
  },

  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
  },

  listItemContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
};

// ============================================================
// BASE SKELETON COMPONENT
// ============================================================

export function Skeleton({
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  count = 1,
  gap = 8,
  className,
  style,
}: SkeletonProps): JSX.Element {
  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case 'circular':
        return {
          ...styles.skeletonCircular,
          width: width || height || 40,
          height: height || width || 40,
        };
      case 'rectangular':
        return {
          ...styles.skeletonRectangular,
          width: width || '100%',
          height: height || 120,
        };
      case 'rounded':
        return {
          ...styles.skeletonRounded,
          width: width || '100%',
          height: height || 40,
        };
      case 'text':
      default:
        return {
          ...styles.skeletonText,
          width: width || '100%',
          height: height || 16,
        };
    }
  };

  const skeletonStyle: CSSProperties = {
    ...styles.skeleton,
    ...getVariantStyles(),
    ...(animation === 'pulse' && styles.skeletonPulse),
    ...(animation === 'wave' && styles.skeletonWave),
    ...style,
  };

  const elements = Array.from({ length: count }, (_, index) => (
    <span key={index} style={skeletonStyle} className={className}>
      {animation === 'wave' && <span style={styles.skeletonWaveAfter} />}
    </span>
  ));

  if (count === 1) return elements[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {elements}
    </div>
  );
}

// ============================================================
// SKELETON TEXT COMPONENT
// ============================================================

export function SkeletonText({
  lines = 3,
  lineHeight = 16,
  gap = 8,
  lastLineWidth = '60%',
  animation = 'pulse',
  className,
}: SkeletonTextProps): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }} className={className}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          animation={animation}
          height={lineHeight}
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
}

// ============================================================
// SKELETON AVATAR COMPONENT
// ============================================================

export function SkeletonAvatar({
  size = 'md',
  shape = 'circle',
  animation = 'pulse',
  className,
}: SkeletonAvatarProps): JSX.Element {
  const sizeValue = typeof size === 'number' ? size : AVATAR_SIZES[size] || 40;
  const borderRadius = shape === 'circle' ? '50%' : shape === 'rounded' ? '8px' : '4px';

  return (
    <Skeleton
      variant="rectangular"
      animation={animation}
      width={sizeValue}
      height={sizeValue}
      style={{ borderRadius }}
      className={className}
    />
  );
}

// ============================================================
// SKELETON BUTTON COMPONENT
// ============================================================

export function SkeletonButton({
  width = 100,
  height = 36,
  rounded = false,
  animation = 'pulse',
  className,
}: SkeletonButtonProps): JSX.Element {
  return (
    <Skeleton
      variant="rounded"
      animation={animation}
      width={width}
      height={height}
      style={{ borderRadius: rounded ? '100px' : '6px' }}
      className={className}
    />
  );
}

// ============================================================
// SKELETON CARD COMPONENT
// ============================================================

export function SkeletonCard({
  hasImage = true,
  imageHeight = 160,
  hasTitle = true,
  hasSubtitle = true,
  hasBody = true,
  bodyLines = 3,
  hasFooter = false,
  animation = 'pulse',
  className,
}: SkeletonCardProps): JSX.Element {
  return (
    <div style={styles.card} className={className}>
      {hasImage && (
        <Skeleton
          variant="rectangular"
          animation={animation}
          height={imageHeight}
          style={styles.cardImage}
        />
      )}

      <div style={styles.cardContent}>
        {hasTitle && (
          <Skeleton
            variant="text"
            animation={animation}
            height={20}
            width="80%"
            style={{ marginBottom: 8 }}
          />
        )}

        {hasSubtitle && (
          <Skeleton
            variant="text"
            animation={animation}
            height={14}
            width="50%"
            style={{ marginBottom: 16 }}
          />
        )}

        {hasBody && (
          <SkeletonText
            lines={bodyLines}
            lineHeight={14}
            gap={8}
            animation={animation}
          />
        )}
      </div>

      {hasFooter && (
        <div style={styles.cardFooter}>
          <SkeletonButton width={80} height={32} animation={animation} />
          <SkeletonButton width={80} height={32} animation={animation} />
        </div>
      )}
    </div>
  );
}

// ============================================================
// SKELETON TABLE COMPONENT
// ============================================================

export function SkeletonTable({
  rows = 5,
  columns = 4,
  hasHeader = true,
  animation = 'pulse',
  className,
}: SkeletonTableProps): JSX.Element {
  return (
    <table style={styles.table} className={className}>
      {hasHeader && (
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, index) => (
              <th key={index} style={{ ...styles.tableCell, ...styles.tableHeader }}>
                <Skeleton variant="text" animation={animation} height={16} width="70%" />
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }, (_, colIndex) => (
              <td key={colIndex} style={styles.tableCell}>
                <Skeleton
                  variant="text"
                  animation={animation}
                  height={14}
                  width={colIndex === 0 ? '80%' : '60%'}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================================
// SKELETON LIST COMPONENT
// ============================================================

export function SkeletonList({
  items = 5,
  hasAvatar = true,
  avatarSize = 40,
  hasTitle = true,
  hasSubtitle = true,
  hasAction = false,
  animation = 'pulse',
  className,
}: SkeletonListProps): JSX.Element {
  return (
    <div className={className}>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} style={styles.listItem}>
          {hasAvatar && (
            <SkeletonAvatar size={avatarSize} animation={animation} />
          )}

          <div style={styles.listItemContent}>
            {hasTitle && (
              <Skeleton variant="text" animation={animation} height={16} width="70%" />
            )}
            {hasSubtitle && (
              <Skeleton variant="text" animation={animation} height={12} width="40%" />
            )}
          </div>

          {hasAction && (
            <Skeleton variant="rounded" animation={animation} width={60} height={28} />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// LOADING SPINNER COMPONENT
// ============================================================

export function LoadingSpinner({
  size = 'md',
  color = BRAND.cenoteTurquoise,
  thickness = 2,
  speed = 0.8,
  label,
  className,
}: LoadingSpinnerProps): JSX.Element {
  const sizeValue = typeof size === 'number' ? size : SPINNER_SIZES[size] || 24;

  const spinnerStyle: CSSProperties = {
    ...styles.spinner,
    width: sizeValue,
    height: sizeValue,
    borderWidth: thickness,
    borderTopColor: color,
    animationDuration: `${speed}s`,
  };

  if (label) {
    return (
      <div style={styles.spinnerContainer} className={className}>
        <span style={spinnerStyle} />
        <span style={styles.spinnerLabel}>{label}</span>
      </div>
    );
  }

  return <span style={spinnerStyle} className={className} />;
}

// ============================================================
// LOADING DOTS COMPONENT
// ============================================================

export function LoadingDots({
  size = 8,
  color = BRAND.cenoteTurquoise,
  count = 3,
  className,
}: LoadingDotsProps): JSX.Element {
  return (
    <div style={styles.dots} className={className}>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          style={{
            ...styles.dot,
            width: size,
            height: size,
            backgroundColor: color,
            animationDelay: `${index * 0.16}s`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// LOADING BAR COMPONENT
// ============================================================

export function LoadingBar({
  height = 4,
  color = BRAND.cenoteTurquoise,
  indeterminate = true,
  progress = 0,
  className,
}: LoadingBarProps): JSX.Element {
  return (
    <div style={{ ...styles.loadingBar, height }} className={className}>
      <div style={{ ...styles.loadingBarTrack, height }}>
        <div
          style={{
            ...styles.loadingBarFill,
            backgroundColor: color,
            ...(indeterminate
              ? styles.loadingBarIndeterminate
              : { width: `${Math.min(100, Math.max(0, progress))}%` }),
          }}
        />
      </div>
    </div>
  );
}

// ============================================================
// LOADING OVERLAY COMPONENT
// ============================================================

export function LoadingOverlay({
  visible,
  spinner,
  text,
  blur = true,
  dark = false,
  zIndex = 1000,
  children,
  className,
}: LoadingOverlayProps): JSX.Element {
  return (
    <div style={{ position: 'relative' }} className={className}>
      {children}
      <div
        style={{
          ...styles.overlay,
          ...(blur && styles.overlayBlur),
          ...(dark ? styles.overlayDark : styles.overlayLight),
          opacity: visible ? 1 : 0,
          visibility: visible ? 'visible' : 'hidden',
          zIndex,
        }}
      >
        {spinner || <LoadingSpinner size="lg" />}
        {text && <span style={{ ...styles.overlayText, color: dark ? '#fff' : BRAND.uiSlate }}>{text}</span>}
      </div>
    </div>
  );
}

// ============================================================
// PROGRESS CIRCLE COMPONENT
// ============================================================

export function ProgressCircle({
  progress,
  size = 60,
  strokeWidth = 4,
  color = BRAND.cenoteTurquoise,
  trackColor = `${BRAND.ancientStone}20`,
  showValue = true,
  valueFormatter = (v) => `${Math.round(v)}%`,
  animated = true,
  className,
}: ProgressCircleProps): JSX.Element {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }} className={className}>
      <svg width={size} height={size} style={styles.progressCircle}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={animated ? { transition: 'stroke-dashoffset 0.3s ease' } : undefined}
        />
      </svg>
      {showValue && (
        <span style={styles.progressCircleValue}>
          {valueFormatter(normalizedProgress)}
        </span>
      )}
    </div>
  );
}

// ============================================================
// CSS KEYFRAMES (injected once)
// ============================================================

const keyframes = `
  @keyframes skeletonPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @keyframes skeletonWave {
    0% { transform: translateX(-100%); }
    60%, 100% { transform: translateX(100%); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes dotPulse {
    0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }

  @keyframes indeterminate {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(350%); }
  }
`;

// Inject keyframes
if (typeof document !== 'undefined') {
  const styleId = 'chenu-loading-keyframes';
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = keyframes;
    document.head.appendChild(styleElement);
  }
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  SkeletonVariant,
  SkeletonAnimation,
  SkeletonProps,
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonButtonProps,
  SkeletonCardProps,
  SkeletonTableProps,
  SkeletonListProps,
  LoadingSpinnerProps,
  LoadingDotsProps,
  LoadingBarProps,
  LoadingOverlayProps,
  ProgressCircleProps,
};

export default {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  LoadingSpinner,
  LoadingDots,
  LoadingBar,
  LoadingOverlay,
  ProgressCircle,
};
