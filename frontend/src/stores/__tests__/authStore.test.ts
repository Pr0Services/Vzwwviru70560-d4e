// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — AUTH STORE TESTS
// Sprint 1 - Tâche 5: 10 tests pour authStore
// Authentication, session management, user preferences
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { useAuthStore } from '../authStore';

// Reset store before each test
beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  act(() => {
    useAuthStore.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastActivity: Date.now(),
    });
  });
});

afterEach(() => {
  vi.useRealTimers();
});

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Initial State', () => {
  it('should start with no user', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
  });

  it('should start not authenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should start with no tokens', () => {
    const state = useAuthStore.getState();
    expect(state.tokens).toBeNull();
  });

  it('should start not loading', () => {
    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
  });

  it('should start with no error', () => {
    const state = useAuthStore.getState();
    expect(state.error).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Login', () => {
  it('should set loading state during login', async () => {
    const loginPromise = useAuthStore.getState().login('test@chenu.ai', 'password123');
    
    // Should be loading immediately after call
    expect(useAuthStore.getState().isLoading).toBe(true);
    
    // Advance timers to complete the simulated API call
    await act(async () => {
      vi.advanceTimersByTime(2000);
      await loginPromise;
    });
  });

  it('should authenticate user on successful login', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).not.toBeNull();
    expect(state.user?.email).toBe('test@chenu.ai');
  });

  it('should generate tokens on login', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    const state = useAuthStore.getState();
    expect(state.tokens).not.toBeNull();
    expect(state.tokens?.accessToken).toBeDefined();
    expect(state.tokens?.refreshToken).toBeDefined();
  });

  it('should set token expiry to 1 hour', async () => {
    const beforeLogin = Date.now();
    
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    const state = useAuthStore.getState();
    // Token should expire ~1 hour after login
    expect(state.tokens?.expiresAt).toBeGreaterThan(beforeLogin + 3500000);
  });

  it('should update lastActivity on login', async () => {
    const beforeLogin = Date.now();
    
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    expect(useAuthStore.getState().lastActivity).toBeGreaterThanOrEqual(beforeLogin);
  });

  it('should create user with starting token balance', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    expect(useAuthStore.getState().user?.tokenBalance).toBe(10000);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTER TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Register', () => {
  it('should register new user', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().register({
        email: 'new@chenu.ai',
        password: 'password123',
        username: 'newuser',
        displayName: 'New User',
      });
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('new@chenu.ai');
    expect(state.user?.displayName).toBe('New User');
  });

  it('should return true on successful registration', async () => {
    let result: boolean = false;
    
    await act(async () => {
      const promise = useAuthStore.getState().register({
        email: 'new@chenu.ai',
        password: 'password123',
        username: 'newuser',
        displayName: 'New User',
      });
      vi.advanceTimersByTime(2000);
      result = await promise;
    });
    
    expect(result).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOGOUT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Logout', () => {
  it('should clear user on logout', async () => {
    // First login
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    // Then logout
    act(() => {
      useAuthStore.getState().logout();
    });
    
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('should clear tokens on logout', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    act(() => {
      useAuthStore.getState().logout();
    });
    
    expect(useAuthStore.getState().tokens).toBeNull();
  });

  it('should set isAuthenticated to false on logout', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    act(() => {
      useAuthStore.getState().logout();
    });
    
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('should clear error on logout', async () => {
    act(() => {
      useAuthStore.setState({ error: 'Some error' });
    });
    
    act(() => {
      useAuthStore.getState().logout();
    });
    
    expect(useAuthStore.getState().error).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION MANAGEMENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Session Management', () => {
  it('should check valid session', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    const isValid = useAuthStore.getState().checkSession();
    expect(isValid).toBe(true);
  });

  it('should return false for expired session', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    // Advance time past token expiry (1 hour)
    vi.advanceTimersByTime(3700000);
    
    const isValid = useAuthStore.getState().checkSession();
    expect(isValid).toBe(false);
  });

  it('should logout on expired session check', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    vi.advanceTimersByTime(3700000);
    useAuthStore.getState().checkSession();
    
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('should return false when not authenticated', () => {
    const isValid = useAuthStore.getState().checkSession();
    expect(isValid).toBe(false);
  });

  it('should refresh session', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    const oldToken = useAuthStore.getState().tokens?.accessToken;
    
    await act(async () => {
      const promise = useAuthStore.getState().refreshSession();
      vi.advanceTimersByTime(1000);
      await promise;
    });
    
    const newToken = useAuthStore.getState().tokens?.accessToken;
    expect(newToken).not.toBe(oldToken);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE UPDATE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Profile Updates', () => {
  it('should update user profile', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    await act(async () => {
      const promise = useAuthStore.getState().updateProfile({ displayName: 'Updated Name' });
      vi.advanceTimersByTime(1000);
      await promise;
    });
    
    expect(useAuthStore.getState().user?.displayName).toBe('Updated Name');
  });

  it('should return false when updating profile without login', async () => {
    const result = await useAuthStore.getState().updateProfile({ displayName: 'Test' });
    expect(result).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PREFERENCES TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('User Preferences', () => {
  it('should initialize with default preferences', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    const prefs = useAuthStore.getState().user?.preferences;
    expect(prefs?.theme).toBe('dark');
    expect(prefs?.language).toBe('en');
    expect(prefs?.defaultSphere).toBe('personal');
  });

  it('should update preferences', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    await act(async () => {
      await useAuthStore.getState().updatePreferences({ 
        theme: 'light',
        language: 'fr' 
      });
    });
    
    const prefs = useAuthStore.getState().user?.preferences;
    expect(prefs?.theme).toBe('light');
    expect(prefs?.language).toBe('fr');
  });

  it('should support French and Spanish languages', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    // Test French
    await act(async () => {
      await useAuthStore.getState().updatePreferences({ language: 'fr' });
    });
    expect(useAuthStore.getState().user?.preferences.language).toBe('fr');
    
    // Test Spanish
    await act(async () => {
      await useAuthStore.getState().updatePreferences({ language: 'es' });
    });
    expect(useAuthStore.getState().user?.preferences.language).toBe('es');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY ACTIONS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Utility Actions', () => {
  it('should clear error', () => {
    act(() => {
      useAuthStore.setState({ error: 'Test error' });
    });
    
    act(() => {
      useAuthStore.getState().clearError();
    });
    
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should set loading state', () => {
    act(() => {
      useAuthStore.getState().setLoading(true);
    });
    
    expect(useAuthStore.getState().isLoading).toBe(true);
    
    act(() => {
      useAuthStore.getState().setLoading(false);
    });
    
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// USER ROLES TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('User Roles', () => {
  it('should create user with default role', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    expect(useAuthStore.getState().user?.role).toBe('user');
  });

  it('should create user with free subscription', async () => {
    await act(async () => {
      const promise = useAuthStore.getState().login('test@chenu.ai', 'password123');
      vi.advanceTimersByTime(2000);
      await promise;
    });
    
    expect(useAuthStore.getState().user?.subscription).toBe('free');
  });
});
