/**
 * CHE·NU - Hooks Types
 */

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NavigationState {
  currentPath: string;
  history: string[];
  canGoBack: boolean;
  canGoForward: boolean;
  params: Record<string, string>;
}

export interface NavigationAction {
  type: 'PUSH' | 'POP' | 'REPLACE' | 'GO_BACK' | 'GO_FORWARD' | 'RESET';
  payload?: string | NavigationPayload;
}

export interface NavigationPayload {
  path: string;
  params?: Record<string, string>;
  replace?: boolean;
}

export interface NavigationConfig {
  basePath: string;
  defaultRoute: string;
  preserveState: boolean;
  maxHistoryLength: number;
}

export interface NavigationContextValue {
  state: NavigationState;
  navigate: (path: string, options?: NavigationOptions) => void;
  goBack: () => void;
  goForward: () => void;
  reset: () => void;
}

export interface NavigationOptions {
  replace?: boolean;
  params?: Record<string, string>;
}

export interface TransitionConfig {
  duration: number;
  easing: string;
  direction: 'left' | 'right' | 'up' | 'down' | 'fade';
}

export interface NavigationPathSegment {
  path: string;
  label: string;
  icon?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAL HOOK TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export type HookResult<T> = [T, (value: T) => void];

export interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}
