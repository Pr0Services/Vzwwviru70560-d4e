// CHE·NU™ Test Setup
// Global test configuration and mocks

import { vi, beforeAll, afterAll, afterEach } from 'vitest';

// ============================================================
// GLOBAL MOCKS
// ============================================================

// Mock window.matchMedia
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
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = ResizeObserverMock;

// Mock IntersectionObserver
class IntersectionObserverMock {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
}
window.IntersectionObserver = IntersectionObserverMock as any;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock fetch
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
beforeAll(() => {
  console.log = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
});

// ============================================================
// CHE·NU SPECIFIC MOCKS
// ============================================================

// Mock CHE·NU API
export const mockChenuApi = {
  auth: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
  },
  spheres: {
    list: vi.fn(),
    get: vi.fn(),
    getBureau: vi.fn(),
  },
  threads: {
    list: vi.fn(),
    create: vi.fn(),
    get: vi.fn(),
    sendMessage: vi.fn(),
  },
  tokens: {
    getBalance: vi.fn(),
    getUsage: vi.fn(),
    allocate: vi.fn(),
  },
  agents: {
    list: vi.fn(),
    execute: vi.fn(),
  },
  nova: {
    query: vi.fn(),
    getStatus: vi.fn(),
  },
  governance: {
    getLaws: vi.fn(),
    check: vi.fn(),
    getAudit: vi.fn(),
  },
  encoding: {
    encode: vi.fn(),
    decode: vi.fn(),
  },
};

// ============================================================
// CHE·NU CONSTANTS FOR TESTING
// ============================================================

export const TEST_CONSTANTS = {
  // 8 Spheres (FROZEN)
  SPHERES: [
    { code: 'personal', name: 'Personal', icon: '🏠' },
    { code: 'business', name: 'Business', icon: '💼' },
    { code: 'government', name: 'Government & Institutions', icon: '🏛️' },
    { code: 'design_studio', name: 'Studio de création', icon: '🎨' },
    { code: 'community', name: 'Community', icon: '👥' },
    { code: 'social', name: 'Social & Media', icon: '📱' },
    { code: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { code: 'my_team', name: 'My Team', icon: '🤝' },
  ],
  
  // 10 Bureau Sections (NON-NEGOTIABLE)
  BUREAU_SECTIONS: [
    { id: 1, name: 'Dashboard', icon: '📊' },
    { id: 2, name: 'Notes', icon: '📝' },
    { id: 3, name: 'Tasks', icon: '✅' },
    { id: 4, name: 'Projects', icon: '📁' },
    { id: 5, name: 'Threads (.chenu)', icon: '💬' },
    { id: 6, name: 'Meetings', icon: '📅' },
    { id: 7, name: 'Data / Database', icon: '🗄️' },
    { id: 8, name: 'Agents', icon: '🤖' },
    { id: 9, name: 'Reports / History', icon: '📈' },
    { id: 10, name: 'Budget & Governance', icon: '💰' },
  ],
  
  // 10 Laws of Governance
  GOVERNANCE_LAWS: [
    { number: 1, name: 'Consent Primacy' },
    { number: 2, name: 'Temporal Sovereignty' },
    { number: 3, name: 'Contextual Fidelity' },
    { number: 4, name: 'Hierarchical Respect' },
    { number: 5, name: 'Audit Completeness' },
    { number: 6, name: 'Encoding Transparency' },
    { number: 7, name: 'Agent Non-Autonomy' },
    { number: 8, name: 'Budget Accountability' },
    { number: 9, name: 'Cross-Sphere Isolation' },
    { number: 10, name: 'Deletion Completeness' },
  ],
  
  // Brand Colors
  BRAND_COLORS: {
    sacredGold: '#D8B26A',
    ancientStone: '#8D8371',
    jungleEmerald: '#3F7249',
    cenoteTurquoise: '#3EB4A2',
    shadowMoss: '#2F4C39',
    earthEmber: '#7A593A',
    uiSlate: '#1E1F22',
    softSand: '#E9E4D6',
  },
};

// ============================================================
// TEST UTILITIES
// ============================================================

export const createMockUser = (overrides = {}) => ({
  id: 'user-001',
  name: 'Test User',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockThread = (overrides = {}) => ({
  id: 'thread-001',
  title: 'Test Thread',
  description: 'Test description',
  sphere_code: 'business',
  status: 'active' as const,
  token_budget: 10000,
  tokens_used: 0,
  encoding_enabled: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockMessage = (overrides = {}) => ({
  id: 'msg-001',
  role: 'user' as const,
  content: 'Test message',
  tokens: 10,
  encoded: false,
  timestamp: new Date().toISOString(),
  ...overrides,
});

export const createMockAgent = (overrides = {}) => ({
  code: 'TEST_AGENT',
  name: 'Test Agent',
  description: 'A test agent',
  cost_per_execution: 50,
  scopes: ['business', 'personal'],
  encoding_compatible: true,
  category: 'utility',
  ...overrides,
});

export const createMockNotification = (overrides = {}) => ({
  id: 'notif-001',
  type: 'info' as const,
  priority: 'medium' as const,
  title: 'Test Notification',
  message: 'Test message',
  timestamp: new Date().toISOString(),
  read: false,
  dismissed: false,
  ...overrides,
});

// ============================================================
// ASSERTION HELPERS
// ============================================================

export const expectSphereCount = (spheres: unknown[]) => {
  if (spheres.length !== 8) {
    throw new Error(`Expected 8 spheres (FROZEN), got ${spheres.length}`);
  }
};

export const expectBureauSectionCount = (sections: unknown[]) => {
  if (sections.length !== 10) {
    throw new Error(`Expected 10 bureau sections (NON-NEGOTIABLE), got ${sections.length}`);
  }
};

export const expectGovernanceLawCount = (laws: unknown[]) => {
  if (laws.length !== 10) {
    throw new Error(`Expected 10 governance laws, got ${laws.length}`);
  }
};

export const expectTokensNotCrypto = (token: unknown) => {
  if (token.is_crypto === true) {
    throw new Error('Tokens must NOT be cryptocurrency (Memory Prompt violation)');
  }
};

export const expectNovaNotHired = (nova: unknown) => {
  if (nova.is_hired_agent === true) {
    throw new Error('Nova must NOT be a hired agent (Memory Prompt violation)');
  }
};
