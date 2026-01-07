/**
 * CHE·NU™ — Performance Optimization Utilities v40
 * Sprint 1: Foundation - Task 1.13
 * 
 * Includes:
 * - Lazy loading
 * - Code splitting helpers
 * - Image optimization
 * - Virtualized lists
 * - Memoization
 * - Bundle optimization
 */

import React, { 
  lazy, 
  Suspense, 
  memo, 
  useMemo, 
  useCallback,
  useState,
  useEffect,
  useRef,
  ComponentType,
  ReactNode 
} from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY LOADING WITH RETRY
// ═══════════════════════════════════════════════════════════════════════════════

interface LazyOptions {
  maxRetries?: number;
  retryDelay?: number;
  fallback?: ReactNode;
}

/**
 * Enhanced lazy loading with automatic retry on failure
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyOptions = {}
): React.LazyExoticComponent<T> {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  
  return lazy(async () => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await importFn();
      } catch (error) {
        lastError = error as Error;
        logger.warn(`Lazy load attempt ${i + 1} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
      }
    }
    
    throw lastError;
  });
}

/**
 * Preload a lazy component
 */
export function preloadComponent(
  importFn: () => Promise<{ default: ComponentType<any> }>
): void {
  importFn().catch(() => {
    // Silently fail preload
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE LAZY LOADING
// ═══════════════════════════════════════════════════════════════════════════════

// Lazy load sphere components
export const LazySpheres = {
  Personal: lazyWithRetry(() => import('@/pages/spheres/Personal')),
  Business: lazyWithRetry(() => import('@/pages/spheres/Business')),
  Government: lazyWithRetry(() => import('@/pages/spheres/Government')),
  Creative: lazyWithRetry(() => import('@/pages/spheres/Creative')),
  Community: lazyWithRetry(() => import('@/pages/spheres/Community')),
  Social: lazyWithRetry(() => import('@/pages/spheres/Social')),
  Entertainment: lazyWithRetry(() => import('@/pages/spheres/Entertainment')),
  Team: lazyWithRetry(() => import('@/pages/spheres/Team')),
  Scholar: lazyWithRetry(() => import('@/pages/spheres/Scholar')),
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUSPENSE WRAPPER WITH LOADING STATES
// ═══════════════════════════════════════════════════════════════════════════════

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  minDelay?: number;
}

/**
 * Suspense wrapper with minimum delay to prevent flash
 */
export const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallback = <LoadingSpinner />,
  minDelay = 200,
}) => {
  const [showFallback, setShowFallback] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), minDelay);
    return () => clearTimeout(timer);
  }, [minDelay]);
  
  return (
    <Suspense fallback={showFallback ? fallback : null}>
      {children}
    </Suspense>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner" role="status" aria-label="Loading">
    <div className="spinner" />
    <span className="sr-only">Loading...</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════════════════

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  className?: string;
}

/**
 * Optimized image component with lazy loading and blur placeholder
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (priority && imgRef.current) {
      // Preload priority images
      const img = new Image();
      img.src = src;
    }
  }, [src, priority]);
  
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);
  
  return (
    <div 
      className={`optimized-image-wrapper ${className}`}
      style={{ 
        width, 
        height,
        backgroundColor: !isLoaded ? '#2a2a2a' : undefined,
      }}
    >
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="blur-placeholder"
          style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        style={{ 
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        decoding="async"
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// ═══════════════════════════════════════════════════════════════════════════════
// VIRTUALIZED LIST
// ═══════════════════════════════════════════════════════════════════════════════

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
}

/**
 * Virtualized list for large datasets (threads, messages, agents)
 */
export function VirtualizedList<T>({
  items,
  itemHeight,
  renderItem,
  overscan = 5,
  className = '',
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const observer = new ResizeObserver(entries => {
      setContainerHeight(entries[0].contentRect.height);
    });
    
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  
  return (
    <div
      ref={containerRef}
      className={`virtualized-list ${className}`}
      onScroll={handleScroll}
      style={{ overflow: 'auto', height: '100%' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEMOIZATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Deep comparison memo wrapper
 */
export function memoWithDeepCompare<P extends object>(
  Component: React.FC<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
): React.MemoExoticComponent<React.FC<P>> {
  return memo(Component, propsAreEqual ?? deepEqual);
}

function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  if (obj1 === null || obj2 === null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEBOUNCE & THROTTLE HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Debounce hook for search inputs, etc.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Throttle hook for scroll handlers, etc.
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());
  
  useEffect(() => {
    const now = Date.now();
    
    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - (now - lastUpdated.current));
      
      return () => clearTimeout(timer);
    }
  }, [value, interval]);
  
  return throttledValue;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERSECTION OBSERVER HOOK
// ═══════════════════════════════════════════════════════════════════════════════

interface UseIntersectionOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Intersection observer hook for lazy rendering
 */
export function useIntersection(
  options: UseIntersectionOptions = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const { threshold = 0, root = null, rootMargin = '0px', triggerOnce = false } = options;
  
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        if (triggerOnce && entry.isIntersecting) {
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, triggerOnce]);
  
  return [ref, isIntersecting];
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Performance metrics collector
 */
export const performanceMetrics = {
  /**
   * Measure component render time
   */
  measureRender(componentName: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      
      if (duration > 16) { // Longer than one frame
        logger.warn(`[Perf] ${componentName} took ${duration.toFixed(2)}ms to render`);
      }
      
      // Report to analytics
      if (typeof window !== 'undefined' && 'performance' in window) {
        performance.mark(`${componentName}-end`);
        performance.measure(componentName, {
          start,
          end: performance.now(),
        });
      }
    };
  },
  
  /**
   * Get Core Web Vitals
   */
  getWebVitals(): Promise<{
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
  }> {
    return new Promise((resolve) => {
      const metrics: unknown = {};
      
      // Use PerformanceObserver for web vitals
      if ('PerformanceObserver' in window) {
        // LCP
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          metrics.lcp = entries[entries.length - 1].startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        // FID
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          metrics.fid = (entries[0] as any).processingStart - entries[0].startTime;
        }).observe({ type: 'first-input', buffered: true });
        
        // CLS
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metrics.cls = clsValue;
        }).observe({ type: 'layout-shift', buffered: true });
      }
      
      // TTFB
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.requestStart;
      }
      
      // Resolve after a short delay to collect metrics
      setTimeout(() => resolve(metrics), 3000);
    });
  },
  
  /**
   * Report metrics to console
   */
  async reportToConsole(): Promise<void> {
    const metrics = await this.getWebVitals();
    
    console.group('🔧 CHE·NU Performance Metrics');
    logger.debug(`LCP: ${metrics.lcp?.toFixed(0) || 'N/A'}ms`);
    logger.debug(`FID: ${metrics.fid?.toFixed(0) || 'N/A'}ms`);
    logger.debug(`CLS: ${metrics.cls?.toFixed(3) || 'N/A'}`);
    logger.debug(`TTFB: ${metrics.ttfb?.toFixed(0) || 'N/A'}ms`);
    console.groupEnd();
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// BUNDLE SIZE ANALYZER CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export const bundleConfig = {
  // Maximum bundle sizes (KB)
  limits: {
    main: 250,
    vendor: 500,
    spheres: 100, // Per sphere
    total: 1000,
  },
  
  // Code splitting chunks
  chunks: {
    'vendor': ['react', 'react-dom', 'zustand'],
    'three': ['three', '@react-three/fiber', '@react-three/drei'],
    'charts': ['recharts', 'd3'],
    'editor': ['@tiptap/core', '@tiptap/react'],
  },
};

export default {
  lazyWithRetry,
  preloadComponent,
  LazySpheres,
  SuspenseWrapper,
  OptimizedImage,
  VirtualizedList,
  memoWithDeepCompare,
  useDebounce,
  useThrottle,
  useIntersection,
  performanceMetrics,
  bundleConfig,
};
