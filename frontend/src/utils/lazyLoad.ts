/**
 * CHE·NU™ - Enhanced Lazy Loading Utilities
 */
import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Lazy load with retry on failure
 */
export const lazyWithRetry = <T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  componentName: string,
  maxRetries = 3
): LazyExoticComponent<T> => {
  return lazy(async () => {
    let lastError: Error | undefined;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await componentImport();
      } catch (error) {
        lastError = error as Error;
        logger.warn(
          `Failed to load ${componentName} (attempt ${i + 1}/${maxRetries}):`,
          error
        );
        
        // Wait before retry (exponential backoff)
        if (i < maxRetries - 1) {
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, i) * 1000)
          );
        }
      }
    }
    
    throw lastError;
  });
};

/**
 * Preload component for faster rendering
 */
export const preloadComponent = (
  componentImport: () => Promise<any>
) => {
  return componentImport();
};

/**
 * Lazy load with prefetch on hover
 */
export const lazyWithPrefetch = <T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  componentName: string
) => {
  let component: Promise<{ default: T }> | null = null;
  
  const prefetch = () => {
    if (!component) {
      component = componentImport();
    }
    return component;
  };
  
  const LazyComponent = lazyWithRetry(
    () => component || componentImport(),
    componentName
  );
  
  return {
    Component: LazyComponent,
    prefetch
  };
};

// Example usage:
// const { Component: Avatar3D, prefetch: prefetchAvatar3D } = lazyWithPrefetch(
//   () => import('@/components/avatars/Avatar3D'),
//   'Avatar3D'
// );
// 
// <button onMouseEnter={prefetchAvatar3D}>Load Avatar</button>
