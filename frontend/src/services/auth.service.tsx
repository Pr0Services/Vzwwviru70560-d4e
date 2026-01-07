/**
 * CHE·NU — Auth Service
 */

import { LoginCredentials, RegisterData, AuthTokens, OAuthProvider, User, UserProfile } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.loadTokens();
  }

  private loadTokens() {
    this.accessToken = localStorage.getItem('chenu_access_token');
    this.refreshToken = localStorage.getItem('chenu_refresh_token');
  }

  private saveTokens(tokens: AuthTokens) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    localStorage.setItem('chenu_access_token', tokens.access_token);
    localStorage.setItem('chenu_refresh_token', tokens.refresh_token);
    localStorage.setItem('chenu_token_expires', tokens.expires_at.toString());
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('chenu_access_token');
    localStorage.removeItem('chenu_refresh_token');
    localStorage.removeItem('chenu_token_expires');
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    if (!this.accessToken) return false;
    const expires = localStorage.getItem('chenu_token_expires');
    if (!expires) return false;
    return Date.now() < parseInt(expires) * 1000;
  }

  async register(data: RegisterData): Promise<{ user: User; requires_verification: boolean }> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; profile: UserProfile; tokens: AuthTokens }> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    this.saveTokens(data.tokens);
    return data;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
      });
    } finally {
      this.clearTokens();
    }
  }

  async verifyEmail(code: string): Promise<{ verified: boolean }> {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) throw new Error('Verification failed');
    return response.json();
  }

  async forgotPassword(email: string): Promise<void> {
    await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) throw new Error('Password reset failed');
  }

  getOAuthUrl(provider: OAuthProvider): string {
    return `${API_URL}/auth/oauth/${provider}`;
  }

  async handleOAuthCallback(provider: OAuthProvider, code: string): Promise<{ user: User; profile: UserProfile; tokens: AuthTokens }> {
    const response = await fetch(`${API_URL}/auth/oauth/${provider}/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) throw new Error('OAuth failed');

    const data = await response.json();
    this.saveTokens(data.tokens);
    return data;
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const tokens = await response.json();
      this.saveTokens(tokens);
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  async getCurrentUser(): Promise<{ user: User; profile: UserProfile } | null> {
    if (!this.accessToken) return null;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) return this.getCurrentUser();
        }
        return null;
      }

      return response.json();
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
