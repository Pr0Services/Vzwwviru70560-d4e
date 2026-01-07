/**
 * CHE·NU™ Authentication API Client V72
 * 
 * Frontend authentication service with:
 * - JWT token management
 * - OAuth flows
 * - 2FA support
 * - Session management
 * 
 * @version V72.0
 * @phase Phase 2 - Authentication
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type AuthProvider = 'local' | 'google' | 'microsoft' | 'github';

export type SessionStatus = 'active' | 'expired' | 'revoked' | 'pending_2fa';

export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  authProvider: AuthProvider;
  createdAt: string;
  lastLogin?: string;
}

export interface Session {
  id: string;
  deviceId: string;
  deviceInfo: {
    name?: string;
    type?: string;
    os?: string;
    browser?: string;
  };
  ipAddress: string;
  createdAt: string;
  lastActivity: string;
  isCurrent: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  tokens?: AuthTokens;
  sessionId?: string;
  requires2FA?: boolean;
  twoFactorToken?: string;
  error?: string;
  errorCode?: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCodeUri: string;
  backupCodes: string[];
}

export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

export interface LinkedAccount {
  provider: AuthProvider;
  providerUserId: string;
  email?: string;
  linkedAt: string;
  isPrimary: boolean;
}


// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v2';
const TOKEN_REFRESH_THRESHOLD = 60; // Refresh token if expires in 60 seconds

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'chenu_access_token',
  REFRESH_TOKEN: 'chenu_refresh_token',
  USER: 'chenu_user',
  SESSION_ID: 'chenu_session_id',
  DEVICE_ID: 'chenu_device_id',
} as const;


// ═══════════════════════════════════════════════════════════════════════════
// TOKEN UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

interface JWTPayload {
  sub: string;
  type: string;
  session_id: string;
  iat: number;
  exp: number;
  jti: string;
  device_id?: string;
  scopes?: string[];
}

function parseJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string, thresholdSeconds = 0): boolean {
  const payload = parseJWT(token);
  if (!payload) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - thresholdSeconds <= now;
}

function getTokenExpiry(token: string): Date | null {
  const payload = parseJWT(token);
  if (!payload) return null;
  return new Date(payload.exp * 1000);
}


// ═══════════════════════════════════════════════════════════════════════════
// DEVICE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

function generateDeviceId(): string {
  const stored = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (stored) return stored;
  
  const deviceId = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  return deviceId;
}

function getDeviceInfo(): Record<string, string> {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';
  
  // Detect browser
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  // Detect OS
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';
  
  return {
    device_id: generateDeviceId(),
    name: `${browser} on ${os}`,
    type: /Mobile|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop',
    os,
    browser,
  };
}


// ═══════════════════════════════════════════════════════════════════════════
// PASSWORD UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  else feedback.push('Password must be at least 8 characters');
  
  if (password.length >= 12) score++;
  
  // Uppercase check
  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add an uppercase letter');
  
  // Lowercase check
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add a lowercase letter');
  
  // Number check
  if (/\d/.test(password)) score++;
  else feedback.push('Add a number');
  
  // Special character check
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++;
  else feedback.push('Add a special character');
  
  // Normalize score to 0-4
  score = Math.min(4, Math.floor(score * 0.67));
  
  return {
    score,
    feedback,
    isValid: score >= 2 && password.length >= 8,
  };
}


// ═══════════════════════════════════════════════════════════════════════════
// AUTH API CLIENT
// ═══════════════════════════════════════════════════════════════════════════

class AuthAPI {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<boolean> | null = null;
  private tokenRefreshTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.loadTokens();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Token Management
  // ─────────────────────────────────────────────────────────────────────────

  private loadTokens(): void {
    this.accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (this.accessToken && !isTokenExpired(this.accessToken)) {
      this.scheduleTokenRefresh();
    }
  }

  private saveTokens(tokens: AuthTokens): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    
    this.scheduleTokenRefresh();
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  private scheduleTokenRefresh(): void {
    if (!this.accessToken) return;
    
    const expiry = getTokenExpiry(this.accessToken);
    if (!expiry) return;
    
    const now = Date.now();
    const expiresIn = expiry.getTime() - now;
    const refreshIn = Math.max(0, expiresIn - TOKEN_REFRESH_THRESHOLD * 1000);
    
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }
    
    this.tokenRefreshTimer = setTimeout(() => {
      this.refreshTokens();
    }, refreshIn);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !isTokenExpired(this.accessToken);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HTTP Helpers
  // ─────────────────────────────────────────────────────────────────────────

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await this.refreshTokens();
      if (refreshed) {
        // Retry request with new token
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
        return retryResponse.json();
      }
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error || 'Request failed');
    }

    return response.json();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Authentication
  // ─────────────────────────────────────────────────────────────────────────

  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: request.email,
          password: request.password,
          device_info: getDeviceInfo(),
        }),
      });

      if (response.success && response.tokens) {
        this.saveTokens(response.tokens);
        
        if (response.user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        }
        if (response.sessionId) {
          localStorage.setItem(STORAGE_KEYS.SESSION_ID, response.sessionId);
        }
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
        errorCode: 'LOGIN_ERROR',
      };
    }
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      if (request.password !== request.confirmPassword) {
        return {
          success: false,
          error: 'Passwords do not match',
          errorCode: 'PASSWORD_MISMATCH',
        };
      }

      const strength = validatePasswordStrength(request.password);
      if (!strength.isValid) {
        return {
          success: false,
          error: strength.feedback.join('. '),
          errorCode: 'WEAK_PASSWORD',
        };
      }

      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: request.email,
          password: request.password,
          device_info: getDeviceInfo(),
        }),
      });

      if (response.success && response.tokens) {
        this.saveTokens(response.tokens);
        
        if (response.user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        }
        if (response.sessionId) {
          localStorage.setItem(STORAGE_KEYS.SESSION_ID, response.sessionId);
        }
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
        errorCode: 'REGISTER_ERROR',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
      if (sessionId) {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ session_id: sessionId }),
        });
      }
    } finally {
      this.clearTokens();
    }
  }

  async logoutAllDevices(): Promise<number> {
    const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    const response = await this.request<{ revoked_count: number }>(
      '/auth/logout-all',
      {
        method: 'POST',
        body: JSON.stringify({ except_session_id: sessionId }),
      }
    );
    return response.revoked_count;
  }

  async refreshTokens(): Promise<boolean> {
    // Prevent concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken || isTokenExpired(this.refreshToken)) {
      this.clearTokens();
      return false;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: this.refreshToken }),
        });

        if (!response.ok) {
          this.clearTokens();
          return false;
        }

        const data = await response.json();
        if (data.success && data.tokens) {
          this.saveTokens(data.tokens);
          return true;
        }

        this.clearTokens();
        return false;
      } catch {
        this.clearTokens();
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Two-Factor Authentication
  // ─────────────────────────────────────────────────────────────────────────

  async verify2FA(
    twoFactorToken: string,
    code: string,
    isBackupCode = false
  ): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({
          two_factor_token: twoFactorToken,
          code,
          is_backup_code: isBackupCode,
          device_info: getDeviceInfo(),
        }),
      });

      if (response.success && response.tokens) {
        this.saveTokens(response.tokens);
        
        if (response.user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        }
        if (response.sessionId) {
          localStorage.setItem(STORAGE_KEYS.SESSION_ID, response.sessionId);
        }
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed',
        errorCode: '2FA_ERROR',
      };
    }
  }

  async enable2FA(): Promise<TwoFactorSetup | null> {
    try {
      return await this.request<TwoFactorSetup>('/auth/2fa/enable', {
        method: 'POST',
      });
    } catch {
      return null;
    }
  }

  async confirm2FA(code: string): Promise<boolean> {
    try {
      const response = await this.request<{ success: boolean }>(
        '/auth/2fa/confirm',
        {
          method: 'POST',
          body: JSON.stringify({ code }),
        }
      );
      return response.success;
    } catch {
      return false;
    }
  }

  async disable2FA(password: string): Promise<boolean> {
    try {
      const response = await this.request<{ success: boolean }>(
        '/auth/2fa/disable',
        {
          method: 'POST',
          body: JSON.stringify({ password }),
        }
      );
      return response.success;
    } catch {
      return false;
    }
  }

  async regenerateBackupCodes(password: string): Promise<string[] | null> {
    try {
      const response = await this.request<{ backup_codes: string[] }>(
        '/auth/2fa/backup-codes',
        {
          method: 'POST',
          body: JSON.stringify({ password }),
        }
      );
      return response.backup_codes;
    } catch {
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // OAuth
  // ─────────────────────────────────────────────────────────────────────────

  async getOAuthUrl(provider: AuthProvider): Promise<string | null> {
    try {
      const response = await this.request<{ url: string; state: string }>(
        `/auth/oauth/${provider}/authorize`
      );
      
      // Store state for verification
      sessionStorage.setItem('oauth_state', response.state);
      
      return response.url;
    } catch {
      return null;
    }
  }

  async handleOAuthCallback(
    provider: AuthProvider,
    code: string,
    state: string
  ): Promise<AuthResponse> {
    try {
      // Verify state
      const storedState = sessionStorage.getItem('oauth_state');
      sessionStorage.removeItem('oauth_state');
      
      if (state !== storedState) {
        return {
          success: false,
          error: 'Invalid OAuth state',
          errorCode: 'INVALID_STATE',
        };
      }

      const response = await this.request<AuthResponse>(
        `/auth/oauth/${provider}/callback`,
        {
          method: 'POST',
          body: JSON.stringify({
            code,
            state,
            device_info: getDeviceInfo(),
          }),
        }
      );

      if (response.success && response.tokens) {
        this.saveTokens(response.tokens);
        
        if (response.user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        }
        if (response.sessionId) {
          localStorage.setItem(STORAGE_KEYS.SESSION_ID, response.sessionId);
        }
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OAuth failed',
        errorCode: 'OAUTH_ERROR',
      };
    }
  }

  async linkOAuthAccount(provider: AuthProvider): Promise<string | null> {
    try {
      const response = await this.request<{ url: string; state: string }>(
        `/auth/oauth/${provider}/link`
      );
      
      sessionStorage.setItem('oauth_link_state', response.state);
      return response.url;
    } catch {
      return null;
    }
  }

  async unlinkOAuthAccount(provider: AuthProvider): Promise<boolean> {
    try {
      const response = await this.request<{ success: boolean }>(
        `/auth/oauth/${provider}/unlink`,
        { method: 'POST' }
      );
      return response.success;
    } catch {
      return false;
    }
  }

  async getLinkedAccounts(): Promise<LinkedAccount[]> {
    try {
      const response = await this.request<{ accounts: LinkedAccount[] }>(
        '/auth/oauth/linked'
      );
      return response.accounts;
    } catch {
      return [];
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Session Management
  // ─────────────────────────────────────────────────────────────────────────

  async getSessions(): Promise<Session[]> {
    try {
      const currentSessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
      const response = await this.request<{ sessions: Session[] }>(
        '/auth/sessions'
      );
      
      return response.sessions.map(session => ({
        ...session,
        isCurrent: session.id === currentSessionId,
      }));
    } catch {
      return [];
    }
  }

  async revokeSession(sessionId: string): Promise<boolean> {
    try {
      const response = await this.request<{ success: boolean }>(
        `/auth/sessions/${sessionId}`,
        { method: 'DELETE' }
      );
      return response.success;
    } catch {
      return false;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Password Management
  // ─────────────────────────────────────────────────────────────────────────

  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const response = await this.request<{ success: boolean }>(
        '/auth/password/reset-request',
        {
          method: 'POST',
          body: JSON.stringify({ email }),
        }
      );
      return response.success;
    } catch {
      return false;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const strength = validatePasswordStrength(newPassword);
      if (!strength.isValid) {
        throw new Error(strength.feedback.join('. '));
      }

      const response = await this.request<{ success: boolean }>(
        '/auth/password/reset',
        {
          method: 'POST',
          body: JSON.stringify({ token, password: newPassword }),
        }
      );
      return response.success;
    } catch {
      return false;
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const strength = validatePasswordStrength(newPassword);
      if (!strength.isValid) {
        throw new Error(strength.feedback.join('. '));
      }

      const response = await this.request<{ success: boolean }>(
        '/auth/password/change',
        {
          method: 'POST',
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );
      return response.success;
    } catch {
      return false;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // User Profile
  // ─────────────────────────────────────────────────────────────────────────

  async getCurrentUser(): Promise<User | null> {
    try {
      // First check local storage
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored && this.isAuthenticated()) {
        return JSON.parse(stored);
      }

      // Fetch from server
      const response = await this.request<{ user: User }>('/auth/me');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      return response.user;
    } catch {
      return null;
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    try {
      const response = await this.request<{ user: User }>('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      return response.user;
    } catch {
      return null;
    }
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const authAPI = new AuthAPI();

export default authAPI;
