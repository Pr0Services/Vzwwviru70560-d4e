/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — useResponsive HOOK                          ║
 * ║                    Responsive Design Utilities                                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Features:
 * - Breakpoint detection
 * - Device type (mobile, tablet, desktop)
 * - Orientation detection
 * - Touch device detection
 * - Safe area detection (notch)
 */

import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export interface ResponsiveState {
  // Breakpoints
  breakpoint: Breakpoint;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
  
  // Device type
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // Orientation
  orientation: Orientation;
  isPortrait: boolean;
  isLandscape: boolean;
  
  // Touch
  isTouchDevice: boolean;
  
  // Dimensions
  width: number;
  height: number;
  
  // Safe areas (for notch devices)
  safeAreaInsets: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // Helpers
  isMobileOrTablet: boolean;
  isTabletOrDesktop: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.md) return 'mobile';
  if (width < BREAKPOINTS.lg) return 'tablet';
  return 'desktop';
}

function getOrientation(width: number, height: number): Orientation {
  return height > width ? 'portrait' : 'landscape';
}

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function getSafeAreaInsets(): ResponsiveState['safeAreaInsets'] {
  if (typeof window === 'undefined' || !window.getComputedStyle) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--sat') || '0', 10) || 0,
    right: parseInt(style.getPropertyValue('--sar') || '0', 10) || 0,
    bottom: parseInt(style.getPropertyValue('--sab') || '0', 10) || 0,
    left: parseInt(style.getPropertyValue('--sal') || '0', 10) || 0,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// useResponsive HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;
    const breakpoint = getBreakpoint(width);
    const deviceType = getDeviceType(width);
    const orientation = getOrientation(width, height);
    
    return {
      breakpoint,
      isXs: breakpoint === 'xs',
      isSm: breakpoint === 'sm',
      isMd: breakpoint === 'md',
      isLg: breakpoint === 'lg',
      isXl: breakpoint === 'xl',
      is2xl: breakpoint === '2xl',
      deviceType,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      orientation,
      isPortrait: orientation === 'portrait',
      isLandscape: orientation === 'landscape',
      isTouchDevice: isTouchDevice(),
      width,
      height,
      safeAreaInsets: getSafeAreaInsets(),
      isMobileOrTablet: deviceType !== 'desktop',
      isTabletOrDesktop: deviceType !== 'mobile',
    };
  });

  const updateState = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const breakpoint = getBreakpoint(width);
    const deviceType = getDeviceType(width);
    const orientation = getOrientation(width, height);
    
    setState({
      breakpoint,
      isXs: breakpoint === 'xs',
      isSm: breakpoint === 'sm',
      isMd: breakpoint === 'md',
      isLg: breakpoint === 'lg',
      isXl: breakpoint === 'xl',
      is2xl: breakpoint === '2xl',
      deviceType,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      orientation,
      isPortrait: orientation === 'portrait',
      isLandscape: orientation === 'landscape',
      isTouchDevice: isTouchDevice(),
      width,
      height,
      safeAreaInsets: getSafeAreaInsets(),
      isMobileOrTablet: deviceType !== 'desktop',
      isTabletOrDesktop: deviceType !== 'mobile',
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateState);
    window.addEventListener('orientationchange', updateState);
    
    // Initial update
    updateState();
    
    return () => {
      window.removeEventListener('resize', updateState);
      window.removeEventListener('orientationchange', updateState);
    };
  }, [updateState]);

  return state;
}

// ═══════════════════════════════════════════════════════════════════════════════
// useBreakpoint HOOK (simplified)
// ═══════════════════════════════════════════════════════════════════════════════

export function useBreakpoint(): Breakpoint {
  const { breakpoint } = useResponsive();
  return breakpoint;
}

// ═══════════════════════════════════════════════════════════════════════════════
// useIsMobile HOOK (simplified)
// ═══════════════════════════════════════════════════════════════════════════════

export function useIsMobile(): boolean {
  const { isMobile } = useResponsive();
  return isMobile;
}

// ═══════════════════════════════════════════════════════════════════════════════
// useMediaQuery HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    setMatches(mediaQuery.matches);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CSS HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate responsive class names based on breakpoint
 */
export function responsiveClass(
  classes: Partial<Record<Breakpoint, string>>,
  currentBreakpoint: Breakpoint
): string {
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  // Find the closest matching class (mobile-first approach)
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (classes[bp]) {
      return classes[bp]!;
    }
  }
  
  return '';
}

export default useResponsive;
