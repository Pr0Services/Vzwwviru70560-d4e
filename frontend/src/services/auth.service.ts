import apiClient, { ApiResponse } from './api.client';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/api.config';

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  preferred_language: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials { email: string; password: string; }
export interface RegisterData { email: string; password: string; display_name?: string; }
export interface AuthTokens { access_token: string; refresh_token: string; token_type: string; expires_in: number; }

class TokenManager {
  static getAccessToken(): string | null { return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN); }
  static getRefreshToken(): string | null { return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN); }
  static setTokens(access: string, refresh: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
  }
  static clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
  static isAuthenticated(): boolean { return !!this.getAccessToken(); }
}

class AuthService {
  async register(data: RegisterData): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post<AuthTokens>(API_ENDPOINTS.AUTH.REGISTER, data, { skipAuth: true });
    if (response.success && response.data) TokenManager.setTokens(response.data.access_token, response.data.refresh_token);
    return response;
  }
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post<AuthTokens>(API_ENDPOINTS.AUTH.LOGIN, credentials, { skipAuth: true });
    if (response.success && response.data) {
      TokenManager.setTokens(response.data.access_token, response.data.refresh_token);
      const userResponse = await this.getCurrentUser();
      if (userResponse.success && userResponse.data) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userResponse.data));
    }
    return response;
  }
  async logout(): Promise<void> {
    try { await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT); } catch {}
    TokenManager.clearTokens();
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }
  async getCurrentUser(): Promise<ApiResponse<User>> { return apiClient.get<User>(API_ENDPOINTS.USERS.ME); }
  isAuthenticated(): boolean { return TokenManager.isAuthenticated(); }
  getStoredUser(): User | null { const u = localStorage.getItem(STORAGE_KEYS.USER); return u ? JSON.parse(u) : null; }
}

export const authService = new AuthService();
export { TokenManager };
export default authService;
