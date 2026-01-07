/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — ACCESSIBILITY HOOKS v39
   WCAG AAA Compliant Accessibility Utilities
   ═══════════════════════════════════════════════════════════════════════════════ */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

// ════════════════════════════════════════════════════════════════════════════════
// FOCUS MANAGEMENT
// ════════════════════════════════════════════════════════════════════════════════

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
  'audio[controls]',
  'video[controls]',
  'details>summary:first-of-type',
  'details',
].join(',');

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1
  );
}

/**
 * Hook to trap focus within a container (for modals, dialogs)
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  isActive: boolean = true
): void {
  useEffect(() => {
    if (!isActive) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Store previously focused element
    const previouslyFocused = document.activeElement as HTMLElement;
    
    // Focus first element
    firstElement?.focus();
    
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
    
    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      // Restore focus when unmounting
      previouslyFocused?.focus?.();
    };
  }, [containerRef, isActive]);
}

/**
 * Hook to restore focus to previous element when component unmounts
 */
export function useFocusReturn(): void {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    return () => {
      previousFocusRef.current?.focus?.();
    };
  }, []);
}

/**
 * Hook to focus an element on mount
 */
export function useFocusOnMount<T extends HTMLElement>(
  ref: RefObject<T>,
  delay: number = 0
): void {
  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.focus();
    }, delay);
    
    return () => clearTimeout(timer);
  }, [ref, delay]);
}

// ════════════════════════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ════════════════════════════════════════════════════════════════════════════════

export type ArrowDirection = 'up' | 'down' | 'left' | 'right';

interface UseArrowNavigationOptions {
  onNavigate?: (index: number, direction: ArrowDirection) => void;
  onSelect?: (index: number) => void;
  onEscape?: () => void;
  wrap?: boolean;
  horizontal?: boolean;
}

/**
 * Hook for arrow key navigation in lists
 */
export function useArrowNavigation(
  items: unknown[],
  options: UseArrowNavigationOptions = {}
): {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  getKeyboardProps: () => {
    onKeyDown: (e: ReactKeyboardEvent) => void;
    role: string;
    tabIndex: number;
  };
} {
  const { onNavigate, onSelect, onEscape, wrap = true, horizontal = false } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
      
      switch (e.key) {
        case prevKey: {
          e.preventDefault();
          setActiveIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : wrap ? items.length - 1 : prev;
            onNavigate?.(newIndex, horizontal ? 'left' : 'up');
            return newIndex;
          });
          break;
        }
        case nextKey: {
          e.preventDefault();
          setActiveIndex((prev) => {
            const newIndex = prev < items.length - 1 ? prev + 1 : wrap ? 0 : prev;
            onNavigate?.(newIndex, horizontal ? 'right' : 'down');
            return newIndex;
          });
          break;
        }
        case 'Home': {
          e.preventDefault();
          setActiveIndex(0);
          onNavigate?.(0, 'up');
          break;
        }
        case 'End': {
          e.preventDefault();
          setActiveIndex(items.length - 1);
          onNavigate?.(items.length - 1, 'down');
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          onSelect?.(activeIndex);
          break;
        }
        case 'Escape': {
          e.preventDefault();
          onEscape?.();
          break;
        }
      }
    },
    [items.length, wrap, horizontal, activeIndex, onNavigate, onSelect, onEscape]
  );
  
  const getKeyboardProps = useCallback(
    () => ({
      onKeyDown: handleKeyDown,
      role: 'listbox',
      tabIndex: 0,
    }),
    [handleKeyDown]
  );
  
  return { activeIndex, setActiveIndex, getKeyboardProps };
}

/**
 * Hook for roving tabindex in component groups
 */
export function useRovingTabIndex(
  containerRef: RefObject<HTMLElement>,
  selector: string = 'button, [role="option"]'
): {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
} {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));
    
    elements.forEach((el, index) => {
      el.tabIndex = index === currentIndex ? 0 : -1;
    });
    
    function handleKeyDown(e: KeyboardEvent): void {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        return;
      }
      
      e.preventDefault();
      
      let newIndex = currentIndex;
      const maxIndex = elements.length - 1;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          newIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          newIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
          break;
        case 'Home':
          newIndex = 0;
          break;
        case 'End':
          newIndex = maxIndex;
          break;
      }
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        elements[newIndex]?.focus();
      }
    }
    
    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, currentIndex, selector]);
  
  return { currentIndex, setCurrentIndex };
}

// ════════════════════════════════════════════════════════════════════════════════
// REDUCED MOTION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Hook to detect user's reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent): void => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
}

// ════════════════════════════════════════════════════════════════════════════════
// SCREEN READER UTILITIES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Hook for managing live regions (announcements to screen readers)
 */
export function useAnnounce(): {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  clearAnnouncement: () => void;
} {
  const announcementRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Create live region element
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(liveRegion);
    announcementRef.current = liveRegion;
    
    return () => {
      document.body.removeChild(liveRegion);
    };
  }, []);
  
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementRef.current) return;
    
    announcementRef.current.setAttribute('aria-live', priority);
    announcementRef.current.textContent = '';
    
    // Small delay to ensure screen readers pick up the change
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = message;
      }
    }, 100);
  }, []);
  
  const clearAnnouncement = useCallback(() => {
    if (announcementRef.current) {
      announcementRef.current.textContent = '';
    }
  }, []);
  
  return { announce, clearAnnouncement };
}

// ════════════════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUT DETECTION
// ════════════════════════════════════════════════════════════════════════════════

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

/**
 * Hook for detecting keyboard shortcuts
 */
export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  callback: () => void,
  options: { enabled?: boolean; preventDefault?: boolean } = {}
): void {
  const { enabled = true, preventDefault = true } = options;
  
  useEffect(() => {
    if (!enabled) return;
    
    function handleKeyDown(e: KeyboardEvent): void {
      const matchesKey = e.key.toLowerCase() === shortcut.key.toLowerCase();
      const matchesCtrl = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
      const matchesAlt = shortcut.alt ? e.altKey : !e.altKey;
      const matchesShift = shortcut.shift ? e.shiftKey : !e.shiftKey;
      const matchesMeta = shortcut.meta ? e.metaKey : !e.metaKey;
      
      if (matchesKey && matchesCtrl && matchesAlt && matchesShift && matchesMeta) {
        if (preventDefault) {
          e.preventDefault();
        }
        callback();
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcut, callback, enabled, preventDefault]);
}

// ════════════════════════════════════════════════════════════════════════════════
// ARIA HELPERS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Generate unique IDs for ARIA relationships
 */
let idCounter = 0;
export function useUniqueId(prefix: string = 'chenu'): string {
  const [id] = useState(() => `${prefix}-${++idCounter}`);
  return id;
}

/**
 * Hook for managing aria-describedby relationships
 */
export function useAriaDescribedBy(
  description: string | null
): {
  id: string;
  descriptionProps: { id: string };
  targetProps: { 'aria-describedby': string } | Record<string, never>;
} {
  const id = useUniqueId('description');
  
  return {
    id,
    descriptionProps: { id },
    targetProps: description ? { 'aria-describedby': id } : {},
  };
}

/**
 * Hook for managing aria-expanded state
 */
export function useAriaExpanded(
  initialState: boolean = false
): {
  isExpanded: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  triggerProps: { 'aria-expanded': boolean };
  contentProps: { hidden: boolean };
} {
  const [isExpanded, setIsExpanded] = useState(initialState);
  
  const toggle = useCallback(() => setIsExpanded((prev) => !prev), []);
  const open = useCallback(() => setIsExpanded(true), []);
  const close = useCallback(() => setIsExpanded(false), []);
  
  return {
    isExpanded,
    toggle,
    open,
    close,
    triggerProps: { 'aria-expanded': isExpanded },
    contentProps: { hidden: !isExpanded },
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// SKIP LINK
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Skip link for keyboard navigation
 */
export const SkipLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    style={{
      position: 'absolute',
      left: '-10000px',
      top: 'auto',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    }}
    onFocus={(e) => {
      e.currentTarget.style.position = 'fixed';
      e.currentTarget.style.left = '16px';
      e.currentTarget.style.top = '16px';
      e.currentTarget.style.width = 'auto';
      e.currentTarget.style.height = 'auto';
      e.currentTarget.style.zIndex = '9999';
      e.currentTarget.style.padding = '8px 16px';
      e.currentTarget.style.backgroundColor = '#D8B26A';
      e.currentTarget.style.color = '#1E1F22';
      e.currentTarget.style.borderRadius = '4px';
      e.currentTarget.style.textDecoration = 'none';
      e.currentTarget.style.fontWeight = '600';
    }}
    onBlur={(e) => {
      e.currentTarget.style.position = 'absolute';
      e.currentTarget.style.left = '-10000px';
      e.currentTarget.style.width = '1px';
      e.currentTarget.style.height = '1px';
    }}
  >
    {children}
  </a>
);

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export const a11y = {
  // Focus
  getFocusableElements,
  useFocusTrap,
  useFocusReturn,
  useFocusOnMount,
  
  // Keyboard
  useArrowNavigation,
  useRovingTabIndex,
  useKeyboardShortcut,
  
  // Motion
  useReducedMotion,
  
  // Screen Reader
  useAnnounce,
  
  // ARIA
  useUniqueId,
  useAriaDescribedBy,
  useAriaExpanded,
  
  // Components
  SkipLink,
};

export default a11y;
