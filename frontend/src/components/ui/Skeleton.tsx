/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — SKELETON COMPONENTS v39
   Professional loading states with smooth animations
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { type CSSProperties, type ReactNode } from 'react';

// ════════════════════════════════════════════════════════════════════════════════
// COLORS (CHE·NU Palette)
// ════════════════════════════════════════════════════════════════════════════════

const COLORS = {
  background: '#0c0a09',
  cardBg: '#111113',
  skeletonBase: 'rgba(141, 131, 113, 0.1)',
  skeletonHighlight: 'rgba(141, 131, 113, 0.2)',
  border: 'rgba(141, 131, 113, 0.15)',
};

// ════════════════════════════════════════════════════════════════════════════════
// KEYFRAMES (injected into document)
// ════════════════════════════════════════════════════════════════════════════════

const injectKeyframes = (): void => {
  if (typeof document === 'undefined') return;
  
  const styleId = 'chenu-skeleton-keyframes';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes chenu-skeleton-pulse {
      0% { opacity: 1; }
      50% { opacity: 0.4; }
      100% { opacity: 1; }
    }
    
    @keyframes chenu-skeleton-shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @media (prefers-reduced-motion: reduce) {
      .chenu-skeleton {
        animation: none !important;
      }
      .chenu-skeleton::after {
        animation: none !important;
      }
    }
  `;
  document.head.appendChild(style);
};

// Inject on module load
if (typeof window !== 'undefined') {
  injectKeyframes();
}

// ════════════════════════════════════════════════════════════════════════════════
// BASE SKELETON
// ════════════════════════════════════════════════════════════════════════════════

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'pulse' | 'shimmer';
  className?: string;
  style?: CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  variant = 'shimmer',
  className = '',
  style = {},
}) => {
  const baseStyle: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    backgroundColor: COLORS.skeletonBase,
    position: 'relative',
    overflow: 'hidden',
    animation: variant === 'pulse' ? 'chenu-skeleton-pulse 1.5s ease-in-out infinite' : 'none',
    ...style,
  };
  
  return (
    <div
      className={`chenu-skeleton ${className}`}
      style={baseStyle}
      role="status"
      aria-label="Loading..."
    >
      {variant === 'shimmer' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(
              90deg,
              transparent,
              ${COLORS.skeletonHighlight},
              transparent
            )`,
            animation: 'chenu-skeleton-shimmer 1.5s infinite',
          }}
        />
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// TEXT SKELETON
// ════════════════════════════════════════════════════════════════════════════════

interface TextSkeletonProps {
  lines?: number;
  lineHeight?: number;
  gap?: number;
  lastLineWidth?: string;
  variant?: 'pulse' | 'shimmer';
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  lineHeight = 16,
  gap = 8,
  lastLineWidth = '60%',
  variant = 'shimmer',
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height={lineHeight}
        width={i === lines - 1 ? lastLineWidth : '100%'}
        variant={variant}
      />
    ))}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// AVATAR SKELETON
// ════════════════════════════════════════════════════════════════════════════════

interface AvatarSkeletonProps {
  size?: number;
  variant?: 'pulse' | 'shimmer';
}

export const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
  size = 40,
  variant = 'shimmer',
}) => (
  <Skeleton
    width={size}
    height={size}
    borderRadius="50%"
    variant={variant}
  />
);

// ════════════════════════════════════════════════════════════════════════════════
// CARD SKELETON
// ════════════════════════════════════════════════════════════════════════════════

interface CardSkeletonProps {
  showImage?: boolean;
  imageHeight?: number;
  lines?: number;
  variant?: 'pulse' | 'shimmer';
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showImage = true,
  imageHeight = 160,
  lines = 3,
  variant = 'shimmer',
}) => (
  <div
    style={{
      backgroundColor: COLORS.cardBg,
      borderRadius: '12px',
      border: `1px solid ${COLORS.border}`,
      overflow: 'hidden',
    }}
  >
    {showImage && (
      <Skeleton
        height={imageHeight}
        borderRadius={0}
        variant={variant}
      />
    )}
    <div style={{ padding: '16px' }}>
      <Skeleton
        height={20}
        width="70%"
        style={{ marginBottom: '12px' }}
        variant={variant}
      />
      <TextSkeleton lines={lines} variant={variant} />
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// LIST ITEM SKELETON
// ════════════════════════════════════════════════════════════════════════════════

interface ListItemSkeletonProps {
  showAvatar?: boolean;
  avatarSize?: number;
  lines?: number;
  variant?: 'pulse' | 'shimmer';
}

export const ListItemSkeleton: React.FC<ListItemSkeletonProps> = ({
  showAvatar = true,
  avatarSize = 40,
  lines = 2,
  variant = 'shimmer',
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px',
      backgroundColor: COLORS.background,
      borderRadius: '8px',
    }}
  >
    {showAvatar && <AvatarSkeleton size={avatarSize} variant={variant} />}
    <div style={{ flex: 1 }}>
      <Skeleton
        height={16}
        width="40%"
        style={{ marginBottom: '8px' }}
        variant={variant}
      />
      <TextSkeleton lines={lines} lineHeight={14} variant={variant} />
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// BUREAU SECTION SKELETONS (CHE·NU Specific)
// ════════════════════════════════════════════════════════════════════════════════

export const QuickCaptureSkeleton: React.FC = () => (
  <div
    style={{
      backgroundColor: COLORS.cardBg,
      borderRadius: '12px',
      padding: '16px',
      border: `1px solid ${COLORS.border}`,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <Skeleton width={120} height={20} />
      <Skeleton width={80} height={32} borderRadius={6} />
    </div>
    <Skeleton height={80} borderRadius={8} style={{ marginBottom: '12px' }} />
    <div style={{ display: 'flex', gap: '8px' }}>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} width={60} height={32} borderRadius={6} />
      ))}
    </div>
  </div>
);

export const ThreadSkeleton: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      backgroundColor: COLORS.background,
      borderRadius: '8px',
    }}
  >
    <div style={{ flex: 1 }}>
      <Skeleton height={16} width="60%" style={{ marginBottom: '8px' }} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <Skeleton width={60} height={12} />
        <Skeleton width={40} height={12} />
      </div>
    </div>
    <Skeleton width={60} height={24} borderRadius={12} />
  </div>
);

export const AgentSkeleton: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      backgroundColor: COLORS.background,
      borderRadius: '8px',
    }}
  >
    <Skeleton width={32} height={32} borderRadius="50%" />
    <div style={{ flex: 1 }}>
      <Skeleton height={14} width="50%" style={{ marginBottom: '6px' }} />
      <Skeleton height={12} width="80%" />
    </div>
    <Skeleton width={50} height={20} borderRadius={4} />
  </div>
);

export const MeetingSkeleton: React.FC = () => (
  <div
    style={{
      padding: '12px',
      backgroundColor: COLORS.background,
      borderRadius: '8px',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <Skeleton height={16} width="50%" />
      <Skeleton width={60} height={20} borderRadius={4} />
    </div>
    <Skeleton height={12} width="70%" />
  </div>
);

export const BureauSectionSkeleton: React.FC<{ title: string }> = ({ title }) => (
  <div
    style={{
      backgroundColor: COLORS.cardBg,
      borderRadius: '12px',
      padding: '16px',
      border: `1px solid ${COLORS.border}`,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Skeleton width={24} height={24} borderRadius={4} />
        <Skeleton width={100} height={16} />
      </div>
      <Skeleton width={70} height={28} borderRadius={6} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <ListItemSkeleton showAvatar={false} lines={1} />
      <ListItemSkeleton showAvatar={false} lines={1} />
      <ListItemSkeleton showAvatar={false} lines={1} />
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// BUREAU GRID SKELETON
// ════════════════════════════════════════════════════════════════════════════════

export const BureauGridSkeleton: React.FC = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '16px',
      padding: '16px',
    }}
  >
    <QuickCaptureSkeleton />
    <BureauSectionSkeleton title="Resume" />
    <BureauSectionSkeleton title="Threads" />
    <BureauSectionSkeleton title="Data" />
    <BureauSectionSkeleton title="Agents" />
    <BureauSectionSkeleton title="Meetings" />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// TABLE SKELETON
// ════════════════════════════════════════════════════════════════════════════════

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  variant?: 'pulse' | 'shimmer';
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  variant = 'shimmer',
}) => (
  <div
    style={{
      backgroundColor: COLORS.cardBg,
      borderRadius: '8px',
      overflow: 'hidden',
      border: `1px solid ${COLORS.border}`,
    }}
  >
    {showHeader && (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '16px',
          padding: '12px 16px',
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={16} width="70%" variant={variant} />
        ))}
      </div>
    )}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '16px',
          padding: '12px 16px',
          borderBottom: rowIndex < rows - 1 ? `1px solid ${COLORS.border}` : 'none',
        }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            height={14}
            width={colIndex === 0 ? '80%' : '60%'}
            variant={variant}
          />
        ))}
      </div>
    ))}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// SKELETON WRAPPER (with loading state)
// ════════════════════════════════════════════════════════════════════════════════

interface SkeletonWrapperProps {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  minLoadingTime?: number;
}

export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  isLoading,
  skeleton,
  children,
  minLoadingTime = 0,
}) => {
  const [showSkeleton, setShowSkeleton] = React.useState(isLoading);
  const loadStartRef = React.useRef<number | null>(null);
  
  React.useEffect(() => {
    if (isLoading) {
      loadStartRef.current = Date.now();
      setShowSkeleton(true);
    } else {
      const elapsed = loadStartRef.current ? Date.now() - loadStartRef.current : 0;
      const remaining = Math.max(0, minLoadingTime - elapsed);
      
      if (remaining > 0) {
        const timer = setTimeout(() => setShowSkeleton(false), remaining);
        return () => clearTimeout(timer);
      } else {
        setShowSkeleton(false);
      }
    }
  }, [isLoading, minLoadingTime]);
  
  return <>{showSkeleton ? skeleton : children}</>;
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default Skeleton;
