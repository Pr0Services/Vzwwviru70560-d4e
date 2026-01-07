// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — HOOKS
// Reusable hooks for common UI patterns
// ═══════════════════════════════════════════════════════════════════════════════

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type RefObject,
  type Dispatch,
  type SetStateAction,
} from 'react';

// =============================================================================
// useLocalStorage
// =============================================================================

/**
 * Sync state with localStorage
 * 
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // Get initial value from localStorage or use provided initial value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      logger.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          window.dispatchEvent(new Event('local-storage'));
        }
      } catch (error) {
        logger.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

// =============================================================================
// useMediaQuery
// =============================================================================

/**
 * Listen to media query changes
 * 
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// =============================================================================
// useBreakpoint
// =============================================================================

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

type Breakpoint = keyof typeof breakpoints;

/**
 * Get current breakpoint and check breakpoint conditions
 * 
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop, current } = useBreakpoint();
 * ```
 */
export function useBreakpoint() {
  const sm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  const md = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const lg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const xl = useMediaQuery(`(min-width: ${breakpoints.xl})`);
  const xxl = useMediaQuery(`(min-width: ${breakpoints['2xl']})`);

  const current = useMemo((): Breakpoint | 'xs' => {
    if (xxl) return '2xl';
    if (xl) return 'xl';
    if (lg) return 'lg';
    if (md) return 'md';
    if (sm) return 'sm';
    return 'xs';
  }, [sm, md, lg, xl, xxl]);

  return {
    current,
    isMobile: !md,
    isTablet: md && !lg,
    isDesktop: lg,
    isXs: !sm,
    isSm: sm && !md,
    isMd: md && !lg,
    isLg: lg && !xl,
    isXl: xl && !xxl,
    is2xl: xxl,
    isAbove: (breakpoint: Breakpoint) => {
      const order: (Breakpoint | 'xs')[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      return order.indexOf(current) >= order.indexOf(breakpoint);
    },
    isBelow: (breakpoint: Breakpoint) => {
      const order: (Breakpoint | 'xs')[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      return order.indexOf(current) < order.indexOf(breakpoint);
    },
  };
}

// =============================================================================
// useOnClickOutside
// =============================================================================

/**
 * Detect clicks outside of an element
 * 
 * @example
 * ```tsx
 * const ref = useRef(null);
 * useOnClickOutside(ref, () => setIsOpen(false));
 * ```
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// =============================================================================
// useDebounce
// =============================================================================

/**
 * Debounce a value
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   // API call with debouncedSearch
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// =============================================================================
// useThrottle
// =============================================================================

/**
 * Throttle a value
 * 
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 100);
 * ```
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

// =============================================================================
// useToggle
// =============================================================================

/**
 * Boolean toggle hook
 * 
 * @example
 * ```tsx
 * const [isOpen, toggle, setIsOpen] = useToggle(false);
 * ```
 */
export function useToggle(
  initialValue = false
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
}

// =============================================================================
// useDisclosure
// =============================================================================

/**
 * Disclosure hook for modals, drawers, etc.
 * 
 * @example
 * ```tsx
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
 * ```
 */
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, onOpen, onClose, onToggle, setIsOpen };
}

// =============================================================================
// usePrevious
// =============================================================================

/**
 * Get the previous value of a state
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// =============================================================================
// useKeyPress
// =============================================================================

/**
 * Detect key press
 * 
 * @example
 * ```tsx
 * const isEscapePressed = useKeyPress('Escape');
 * const isEnterPressed = useKeyPress('Enter');
 * ```
 */
export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}

// =============================================================================
// useHotkeys
// =============================================================================

type HotkeyCallback = (event: KeyboardEvent) => void;

/**
 * Register keyboard shortcuts
 * 
 * @example
 * ```tsx
 * useHotkeys('ctrl+s', (e) => {
 *   e.preventDefault();
 *   handleSave();
 * });
 * 
 * useHotkeys('ctrl+k', () => openCommandPalette());
 * ```
 */
export function useHotkeys(
  keys: string,
  callback: HotkeyCallback,
  deps: unknown[] = []
): void {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const keyParts = keys.toLowerCase().split('+');
      const key = keyParts.pop()!;
      const modifiers = keyParts;

      const ctrlRequired = modifiers.includes('ctrl') || modifiers.includes('control');
      const shiftRequired = modifiers.includes('shift');
      const altRequired = modifiers.includes('alt');
      const metaRequired = modifiers.includes('meta') || modifiers.includes('cmd');

      const keyMatches = event.key.toLowerCase() === key;
      const ctrlMatches = event.ctrlKey === ctrlRequired;
      const shiftMatches = event.shiftKey === shiftRequired;
      const altMatches = event.altKey === altRequired;
      const metaMatches = event.metaKey === metaRequired;

      if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, callback, ...deps]);
}

// =============================================================================
// useIntersectionObserver
// =============================================================================

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Observe element visibility
 * 
 * @example
 * ```tsx
 * const ref = useRef(null);
 * const entry = useIntersectionObserver(ref, { threshold: 0.5 });
 * const isVisible = entry?.isIntersecting;
 * ```
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: UseIntersectionObserverOptions = {}
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => setEntry(observerEntry),
      { threshold, root, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, frozen]);

  return entry;
}

// =============================================================================
// useScrollPosition
// =============================================================================

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Track scroll position
 * 
 * @example
 * ```tsx
 * const { x, y } = useScrollPosition();
 * const showBackToTop = y > 300;
 * ```
 */
export function useScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    // Initial value
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}

// =============================================================================
// useWindowSize
// =============================================================================

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Track window size
 * 
 * @example
 * ```tsx
 * const { width, height } = useWindowSize();
 * ```
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// =============================================================================
// useCopyToClipboard
// =============================================================================

/**
 * Copy text to clipboard
 * 
 * @example
 * ```tsx
 * const [copiedText, copy] = useCopyToClipboard();
 * 
 * <button onClick={() => copy('Hello!')}>
 *   {copiedText ? 'Copied!' : 'Copy'}
 * </button>
 * ```
 */
export function useCopyToClipboard(): [string | null, (text: string) => Promise<boolean>] {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      logger.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      logger.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copiedText, copy];
}

// =============================================================================
// useAsync
// =============================================================================

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Handle async operations
 * 
 * @example
 * ```tsx
 * const { data, error, isLoading, execute } = useAsync(fetchUser);
 * 
 * useEffect(() => {
 *   execute(userId);
 * }, [userId]);
 * ```
 */
export function useAsync<T, Args extends unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({
        data: null,
        error: null,
        isLoading: true,
        isError: false,
        isSuccess: false,
      });

      try {
        const result = await asyncFunction(...args);
        setState({
          data: result,
          error: null,
          isLoading: false,
          isError: false,
          isSuccess: true,
        });
        return result;
      } catch (error) {
        setState({
          data: null,
          error: error as Error,
          isLoading: false,
          isError: true,
          isSuccess: false,
        });
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  }, []);

  return { ...state, execute, reset };
}

// =============================================================================
// useInterval
// =============================================================================

/**
 * SetInterval as a hook
 * 
 * @example
 * ```tsx
 * useInterval(() => {
 *   setCount(count + 1);
 * }, 1000);
 * ```
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// =============================================================================
// useTimeout
// =============================================================================

/**
 * setTimeout as a hook
 * 
 * @example
 * ```tsx
 * useTimeout(() => {
 *   setVisible(false);
 * }, 3000);
 * ```
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  useLocalStorage,
  useMediaQuery,
  useBreakpoint,
  useOnClickOutside,
  useDebounce,
  useThrottle,
  useToggle,
  useDisclosure,
  usePrevious,
  useKeyPress,
  useHotkeys,
  useIntersectionObserver,
  useScrollPosition,
  useWindowSize,
  useCopyToClipboard,
  useAsync,
  useInterval,
  useTimeout,
};
