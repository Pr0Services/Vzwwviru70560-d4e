/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — TEST SETUP v39
   Global test configuration and mocks
   ═══════════════════════════════════════════════════════════════════════════════ */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// ════════════════════════════════════════════════════════════════════════════════
// CLEANUP AFTER EACH TEST
// ════════════════════════════════════════════════════════════════════════════════

afterEach(() => {
  cleanup();
});

// ════════════════════════════════════════════════════════════════════════════════
// GLOBAL MOCKS
// ════════════════════════════════════════════════════════════════════════════════

beforeAll(() => {
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    root: null,
    rootMargin: '',
    thresholds: [],
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(),
  }));

  // Mock scrollTo
  window.scrollTo = vi.fn();

  // Mock crypto for UUID generation
  Object.defineProperty(window, 'crypto', {
    value: {
      getRandomValues: (arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      },
      randomUUID: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      },
    },
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// CONSOLE SUPPRESSION (Optional)
// ════════════════════════════════════════════════════════════════════════════════

// Uncomment to suppress console.error/warn in tests
// const originalError = console.error;
// const originalWarn = console.warn;
// 
// beforeAll(() => {
//   console.error = (...args) => {
//     if (args[0]?.includes?.('Warning:')) return;
//     originalError.call(console, ...args);
//   };
//   console.warn = (...args) => {
//     if (args[0]?.includes?.('Warning:')) return;
//     originalWarn.call(console, ...args);
//   };
// });
// 
// afterAll(() => {
//   console.error = originalError;
//   console.warn = originalWarn;
// });

// ════════════════════════════════════════════════════════════════════════════════
// CUSTOM MATCHERS
// ════════════════════════════════════════════════════════════════════════════════

// Add any custom matchers here
// expect.extend({
//   toBeValidUUID(received: string) {
//     const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//     const pass = uuidRegex.test(received);
//     return {
//       message: () =>
//         pass
//           ? `expected ${received} not to be a valid UUID`
//           : `expected ${received} to be a valid UUID`,
//       pass,
//     };
//   },
// });

// ════════════════════════════════════════════════════════════════════════════════
// TEST UTILITIES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean,
  timeout: number = 1000,
  interval: number = 50
): Promise<void> {
  const startTime = Date.now();
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Create a mock function that returns a promise
 */
export function createAsyncMock<T>(resolveValue: T, delay: number = 0) {
  return vi.fn().mockImplementation(() =>
    new Promise((resolve) => {
      setTimeout(() => resolve(resolveValue), delay);
    })
  );
}

/**
 * Create a mock function that rejects with an error
 */
export function createRejectingMock(error: Error, delay: number = 0) {
  return vi.fn().mockImplementation(() =>
    new Promise((_, reject) => {
      setTimeout(() => reject(error), delay);
    })
  );
}
