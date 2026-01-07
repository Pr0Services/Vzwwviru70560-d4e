/**
 * CHE·NU™ Loading & Skeleton Components
 * 
 * Provides loading states and skeleton screens for improved perceived performance.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON BASE
// ═══════════════════════════════════════════════════════════════════════════

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className = '',
  animate = true,
}) => {
  return (
    <div
      className={`skeleton ${animate ? 'skeleton--animated' : ''} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON VARIANTS
// ═══════════════════════════════════════════════════════════════════════════

export const SkeletonText: React.FC<{
  lines?: number;
  lastLineWidth?: string;
  lineHeight?: number;
  gap?: number;
}> = ({
  lines = 3,
  lastLineWidth = '70%',
  lineHeight = 16,
  gap = 8,
}) => {
  return (
    <div className="skeleton-text" style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          borderRadius={4}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{
  size?: number;
  shape?: 'circle' | 'square';
}> = ({
  size = 40,
  shape = 'circle',
}) => {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={shape === 'circle' ? '50%' : 8}
    />
  );
};

export const SkeletonButton: React.FC<{
  width?: number | string;
  size?: 'sm' | 'md' | 'lg';
}> = ({
  width = 120,
  size = 'md',
}) => {
  const heights = { sm: 32, md: 40, lg: 48 };
  return <Skeleton width={width} height={heights[size]} borderRadius={8} />;
};

export const SkeletonCard: React.FC<{
  hasImage?: boolean;
  imageHeight?: number;
  hasAvatar?: boolean;
  lines?: number;
}> = ({
  hasImage = true,
  imageHeight = 180,
  hasAvatar = true,
  lines = 2,
}) => {
  return (
    <div className="skeleton-card">
      {hasImage && (
        <Skeleton height={imageHeight} borderRadius="12px 12px 0 0" />
      )}
      <div className="skeleton-card__body">
        {hasAvatar && (
          <div className="skeleton-card__header">
            <SkeletonAvatar size={36} />
            <div className="skeleton-card__meta">
              <Skeleton width="60%" height={14} borderRadius={4} />
              <Skeleton width="40%" height={12} borderRadius={4} />
            </div>
          </div>
        )}
        <SkeletonText lines={lines} lineHeight={14} gap={6} />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// THREAD SKELETON
// ═══════════════════════════════════════════════════════════════════════════

export const SkeletonThread: React.FC<{
  messages?: number;
}> = ({
  messages = 4,
}) => {
  return (
    <div className="skeleton-thread">
      {/* Thread header */}
      <div className="skeleton-thread__header">
        <SkeletonAvatar size={32} />
        <div className="skeleton-thread__title">
          <Skeleton width="50%" height={18} borderRadius={4} />
          <Skeleton width="30%" height={12} borderRadius={4} />
        </div>
        <Skeleton width={24} height={24} borderRadius={6} />
      </div>

      {/* Messages */}
      <div className="skeleton-thread__messages">
        {Array.from({ length: messages }).map((_, i) => (
          <div 
            key={i} 
            className={`skeleton-thread__message ${i % 2 === 0 ? 'skeleton-thread__message--left' : 'skeleton-thread__message--right'}`}
          >
            <Skeleton 
              width={i % 2 === 0 ? '70%' : '60%'} 
              height={i % 3 === 0 ? 60 : 40} 
              borderRadius={16} 
            />
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="skeleton-thread__input">
        <Skeleton height={48} borderRadius={24} />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SPHERE SKELETON
// ═══════════════════════════════════════════════════════════════════════════

export const SkeletonSphere: React.FC = () => {
  return (
    <div className="skeleton-sphere">
      {/* Header */}
      <div className="skeleton-sphere__header">
        <SkeletonAvatar size={48} shape="square" />
        <div className="skeleton-sphere__title">
          <Skeleton width="40%" height={24} borderRadius={4} />
          <Skeleton width="60%" height={14} borderRadius={4} />
        </div>
      </div>

      {/* Sections */}
      <div className="skeleton-sphere__sections">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-sphere__section">
            <Skeleton width={48} height={48} borderRadius={12} />
            <Skeleton width="70%" height={12} borderRadius={4} />
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="skeleton-sphere__grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} hasImage={false} hasAvatar={false} lines={3} />
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// LIST SKELETON
// ═══════════════════════════════════════════════════════════════════════════

export const SkeletonList: React.FC<{
  items?: number;
  hasAvatar?: boolean;
  hasAction?: boolean;
}> = ({
  items = 5,
  hasAvatar = true,
  hasAction = false,
}) => {
  return (
    <div className="skeleton-list">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="skeleton-list__item">
          {hasAvatar && <SkeletonAvatar size={40} />}
          <div className="skeleton-list__content">
            <Skeleton width="60%" height={16} borderRadius={4} />
            <Skeleton width="40%" height={12} borderRadius={4} />
          </div>
          {hasAction && <Skeleton width={32} height={32} borderRadius={8} />}
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TABLE SKELETON
// ═══════════════════════════════════════════════════════════════════════════

export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
}> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="skeleton-table">
      {/* Header */}
      <div className="skeleton-table__header">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={20} borderRadius={4} />
        ))}
      </div>
      
      {/* Rows */}
      <div className="skeleton-table__body">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="skeleton-table__row">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                height={16} 
                width={colIndex === 0 ? '80%' : '60%'}
                borderRadius={4} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// LOADING SPINNER
// ═══════════════════════════════════════════════════════════════════════════

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  className = '',
}) => {
  const sizes = {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };
  
  const s = sizes[size];
  
  return (
    <svg
      className={`spinner ${className}`}
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="spinner__track"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeOpacity="0.2"
        strokeWidth="3"
        fill="none"
      />
      <path
        className="spinner__head"
        d="M12 2C6.47715 2 2 6.47715 2 12"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// LOADING OVERLAY
// ═══════════════════════════════════════════════════════════════════════════

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  blur?: boolean;
  fullScreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Chargement...',
  blur = true,
  fullScreen = false,
}) => {
  if (!isLoading) return null;
  
  return (
    <div className={`loading-overlay ${fullScreen ? 'loading-overlay--fullscreen' : ''} ${blur ? 'loading-overlay--blur' : ''}`}>
      <div className="loading-overlay__content">
        <Spinner size="lg" color="#6366f1" />
        {message && <p className="loading-overlay__message">{message}</p>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════════════

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = '#6366f1',
  showLabel = false,
  animated = true,
}) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: 4, md: 8, lg: 12 };
  
  return (
    <div className="progress-bar">
      <div 
        className="progress-bar__track"
        style={{ height: heights[size] }}
      >
        <div 
          className={`progress-bar__fill ${animated ? 'progress-bar__fill--animated' : ''}`}
          style={{ 
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showLabel && (
        <span className="progress-bar__label">{Math.round(percent)}%</span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PULSING DOT
// ═══════════════════════════════════════════════════════════════════════════

export const PulsingDot: React.FC<{
  color?: string;
  size?: number;
}> = ({
  color = '#22c55e',
  size = 8,
}) => {
  return (
    <span 
      className="pulsing-dot"
      style={{ 
        width: size, 
        height: size,
        backgroundColor: color,
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const LoadingStyles: React.FC = () => (
  <style>{`
    /* Skeleton base */
    .skeleton {
      background: var(--color-skeleton, #e5e5e5);
    }

    .skeleton--animated {
      background: linear-gradient(
        90deg,
        var(--color-skeleton, #e5e5e5) 25%,
        var(--color-skeleton-highlight, #f5f5f5) 50%,
        var(--color-skeleton, #e5e5e5) 75%
      );
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.5s ease-in-out infinite;
    }

    @keyframes skeleton-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Skeleton text */
    .skeleton-text {
      display: flex;
      flex-direction: column;
    }

    /* Skeleton card */
    .skeleton-card {
      background: var(--color-bg-secondary, #fff);
      border: 1px solid var(--color-border, #e5e5e5);
      border-radius: 12px;
      overflow: hidden;
    }

    .skeleton-card__body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .skeleton-card__header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .skeleton-card__meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* Skeleton thread */
    .skeleton-thread {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .skeleton-thread__header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid var(--color-border, #e5e5e5);
    }

    .skeleton-thread__title {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .skeleton-thread__messages {
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .skeleton-thread__message {
      display: flex;
    }

    .skeleton-thread__message--right {
      justify-content: flex-end;
    }

    .skeleton-thread__input {
      padding: 16px;
      border-top: 1px solid var(--color-border, #e5e5e5);
    }

    /* Skeleton sphere */
    .skeleton-sphere {
      padding: 24px;
    }

    .skeleton-sphere__header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }

    .skeleton-sphere__title {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .skeleton-sphere__sections {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .skeleton-sphere__section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .skeleton-sphere__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    /* Skeleton list */
    .skeleton-list {
      display: flex;
      flex-direction: column;
    }

    .skeleton-list__item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--color-border, #e5e5e5);
    }

    .skeleton-list__item:last-child {
      border-bottom: none;
    }

    .skeleton-list__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* Skeleton table */
    .skeleton-table {
      width: 100%;
    }

    .skeleton-table__header {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 16px;
      padding: 12px 0;
      border-bottom: 2px solid var(--color-border, #e5e5e5);
    }

    .skeleton-table__body {
      display: flex;
      flex-direction: column;
    }

    .skeleton-table__row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid var(--color-border, #e5e5e5);
    }

    /* Spinner */
    .spinner {
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Loading overlay */
    .loading-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.8);
      z-index: 100;
    }

    .loading-overlay--fullscreen {
      position: fixed;
    }

    .loading-overlay--blur {
      backdrop-filter: blur(4px);
    }

    .loading-overlay__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .loading-overlay__message {
      font-size: 14px;
      color: var(--color-text-secondary, #666);
    }

    /* Progress bar */
    .progress-bar {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .progress-bar__track {
      flex: 1;
      background: var(--color-skeleton, #e5e5e5);
      border-radius: 999px;
      overflow: hidden;
    }

    .progress-bar__fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.3s ease;
    }

    .progress-bar__fill--animated {
      position: relative;
      overflow: hidden;
    }

    .progress-bar__fill--animated::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: progress-shimmer 1.5s ease-in-out infinite;
    }

    @keyframes progress-shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .progress-bar__label {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-secondary, #666);
      min-width: 40px;
      text-align: right;
    }

    /* Pulsing dot */
    .pulsing-dot {
      display: inline-block;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(0.8);
      }
    }

    /* Dark mode */
    [data-theme="dark"] .skeleton {
      background: #333;
    }

    [data-theme="dark"] .skeleton--animated {
      background: linear-gradient(
        90deg,
        #333 25%,
        #444 50%,
        #333 75%
      );
      background-size: 200% 100%;
    }

    [data-theme="dark"] .loading-overlay {
      background: rgba(0, 0, 0, 0.8);
    }

    [data-theme="dark"] .progress-bar__track {
      background: #333;
    }
  `}</style>
);

export default {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonThread,
  SkeletonSphere,
  SkeletonList,
  SkeletonTable,
  Spinner,
  LoadingOverlay,
  ProgressBar,
  PulsingDot,
  LoadingStyles,
};
