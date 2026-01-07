/**
 * ============================================================================
 * CHE·NU™ V70 — AUTH SERVICE
 * ============================================================================
 * Authentication service connecting to Backend V69 /auth endpoints
 * Principle: GOUVERNANCE > EXÉCUTION
 * ============================================================================
 */

import { httpClient, setTokens, clearTokens } from './http-client';
import { API_ENDPOINTS } from './config';
import type { 
  LoginRequest, 
  TokenResponse, 
  UserInfo 
} from '../../types/api.types';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
}

class AuthService {
  private currentUser: UserInfo | null = null;

  /**
   * Login with email and password
   */
  async login(request: LoginRequest): Promise<TokenResponse> {
    const response = await httpClient.post<TokenResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      request
    );
    
    // Store tokens
    setTokens(response.access_token, response.refresh_token);
    
    // Fetch user info
    await this.fetchCurrentUser();
    
    return response;
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      clearTokens();
      this.currentUser = null;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await httpClient.post<TokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken }
    );
    
    setTokens(response.access_token, response.refresh_token);
    
    return response;
  }

  /**
   * Get current user info
   */
  async fetchCurrentUser(): Promise<UserInfo> {
    const user = await httpClient.get<UserInfo>(API_ENDPOINTS.AUTH.ME);
    this.currentUser = user;
    return user;
  }

  /**
   * Get cached current user
   */
  getCurrentUser(): UserInfo | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  /**
   * Check if user has role
   */
  hasRole(role: string): boolean {
    return this.currentUser?.roles.includes(role) ?? false;
  }

  /**
   * Check if user has any of the roles
   */
  hasAnyRole(roles: string[]): boolean {
    if (!this.currentUser) return false;
    return roles.some(role => this.currentUser!.roles.includes(role));
  }
}

export const authService = new AuthService();
export default authService;
