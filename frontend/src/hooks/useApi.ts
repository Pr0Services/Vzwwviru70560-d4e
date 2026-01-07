/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ — useApi Hook                                           ║
 * ║                                                                              ║
 * ║              React hook for API calls with loading and error states          ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '../services/api.client';

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface UseApiState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface UseApiOptions<T> {
  /** Initial data */
  initialData?: T | null;
  /** Auto-fetch on mount */
  immediate?: boolean;
  /** Callback on success */
  onSuccess?: (data: T) => void;
  /** Callback on error */
  onError?: (error: string) => void;
  /** Cache key for deduplication */
  cacheKey?: string;
  /** Cache TTL in ms */
  cacheTTL?: number;
}

export interface UseApiResult<T, P extends unknown[]> extends UseApiState<T> {
  /** Execute the API call */
  execute: (...params: P) => Promise<T | null>;
  /** Reset state */
  reset: () => void;
  /** Refetch with last params */
  refetch: () => Promise<T | null>;
}

// ══════════════════════════════════════════════════════════════════════════════
// CACHE
// ══════════════════════════════════════════════════════════════════════════════

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string, ttl: number): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > ttl) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN HOOK
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Generic hook for API calls.
 * 
 * @example
 * const { data, isLoading, execute } = useApi(
 *   (id: string) => api.get(`/users/${id}`),
 *   { immediate: false }
 * );
 * 
 * // Later
 * await execute('user-123');
 */
export function useApi<T, P extends unknown[] = []>(
  apiFunction: (...params: P) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T, P> {
  const {
    initialData = null,
    immediate = false,
    onSuccess,
    onError,
    cacheKey,
    cacheTTL = 60000, // 1 minute default
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    error: null,
    isLoading: immediate,
    isSuccess: false,
    isError: false,
  });

  const lastParamsRef = useRef<P | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      lastParamsRef.current = params;

      // Check cache first
      if (cacheKey) {
        const cached = getCached<T>(cacheKey, cacheTTL);
        if (cached) {
          setState({
            data: cached,
            error: null,
            isLoading: false,
            isSuccess: true,
            isError: false,
          });
          return cached;
        }
      }

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        isError: false,
      }));

      try {
        const result = await apiFunction(...params);

        if (!isMountedRef.current) return null;

        // Cache result
        if (cacheKey) {
          setCache(cacheKey, result);
        }

        setState({
          data: result,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        if (!isMountedRef.current) return null;

        const errorMessage = err instanceof Error ? err.message : 'An error occurred';

        setState({
          data: null,
          error: errorMessage,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });

        if (onError) {
          onError(errorMessage);
        }

        return null;
      }
    },
    [apiFunction, cacheKey, cacheTTL, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, [initialData]);

  const refetch = useCallback(async (): Promise<T | null> => {
    if (lastParamsRef.current) {
      return execute(...lastParamsRef.current);
    }
    return execute(...([] as unknown as P));
  }, [execute]);

  // Auto-fetch on mount if immediate
  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as P));
    }
  }, [immediate]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    execute,
    reset,
    refetch,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// SPECIALIZED HOOKS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Hook for GET requests.
 */
export function useGet<T>(
  url: string,
  options: UseApiOptions<T> & { params?: Record<string, unknown> } = {}
) {
  const { params, ...restOptions } = options;
  
  return useApi<T, []>(
    () => api.get<T>(url, { params }),
    {
      cacheKey: `GET:${url}:${JSON.stringify(params)}`,
      ...restOptions,
    }
  );
}

/**
 * Hook for POST requests.
 */
export function usePost<T, D = unknown>(
  url: string,
  options: UseApiOptions<T> = {}
) {
  return useApi<T, [D]>(
    (data: D) => api.post<T>(url, data),
    options
  );
}

/**
 * Hook for PUT requests.
 */
export function usePut<T, D = unknown>(
  url: string,
  options: UseApiOptions<T> = {}
) {
  return useApi<T, [D]>(
    (data: D) => api.put<T>(url, data),
    options
  );
}

/**
 * Hook for PATCH requests.
 */
export function usePatch<T, D = unknown>(
  url: string,
  options: UseApiOptions<T> = {}
) {
  return useApi<T, [D]>(
    (data: D) => api.patch<T>(url, data),
    options
  );
}

/**
 * Hook for DELETE requests.
 */
export function useDelete<T>(
  url: string,
  options: UseApiOptions<T> = {}
) {
  return useApi<T, []>(
    () => api.delete<T>(url),
    options
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MUTATION HOOK
// ══════════════════════════════════════════════════════════════════════════════

export interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  invalidateCache?: string[];
}

export interface UseMutationResult<T, V> {
  mutate: (variables: V) => Promise<T | null>;
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
}

/**
 * Hook for mutations (POST, PUT, DELETE).
 * 
 * @example
 * const { mutate, isLoading } = useMutation(
 *   (data: CreateUserData) => api.post('/users', data),
 *   { onSuccess: () => toast.success('User created!') }
 * );
 * 
 * // Later
 * await mutate({ name: 'John', email: 'john@example.com' });
 */
export function useMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options: UseMutationOptions<T> = {}
): UseMutationResult<T, V> {
  const { onSuccess, onError, invalidateCache } = options;

  const [state, setState] = useState({
    data: null as T | null,
    error: null as string | null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const mutate = useCallback(
    async (variables: V): Promise<T | null> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        isError: false,
      }));

      try {
        const result = await mutationFn(variables);

        setState({
          data: result,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });

        // Invalidate cache
        if (invalidateCache) {
          for (const key of invalidateCache) {
            cache.delete(key);
          }
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';

        setState({
          data: null,
          error: errorMessage,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });

        if (onError) {
          onError(errorMessage);
        }

        return null;
      }
    },
    [mutationFn, onSuccess, onError, invalidateCache]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return {
    mutate,
    ...state,
    reset,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════════════════════

export default useApi;
