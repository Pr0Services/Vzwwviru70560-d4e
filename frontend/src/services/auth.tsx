/**
 * CHE·NU — Auth Service
 */

import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
  language?: string;
  accept_terms: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  email: string;
}

export interface RegisterResponse {
  user_id: string;
  email: string;
  message: string;
  requires_verification: boolean;
}

export interface User {
  id: string;
  email: string;
  status: string;
  role: string;
  email_verified: boolean;
  mfa_enabled: boolean;
  last_login_at: string | null;
  created_at: string;
  profile: UserProfile | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  title: string | null;
  phone: string | null;
  language: string;
  timezone: string;
  professional_status: string | null;
  company_name: string | null;
  industry: string | null;
  onboarding_completed: boolean;
  onboarding_step: string | null;
}

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    
    // Store tokens
    localStorage.setItem('chenu_access_token', response.access_token);
    localStorage.setItem('chenu_refresh_token', response.refresh_token);
    api.setToken(response.access_token);
    
    return response;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return api.post<RegisterResponse>('/auth/register', data);
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    await api.post('/auth/verify-email', { email, code });
  }

  async resendVerification(email: string): Promise<void> {
    await api.post('/auth/resend-verification', { email });
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string, password_confirm: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password, password_confirm });
  }

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('chenu_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await api.post<LoginResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    localStorage.setItem('chenu_access_token', response.access_token);
    localStorage.setItem('chenu_refresh_token', response.refresh_token);
    api.setToken(response.access_token);

    return response;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('chenu_access_token');
      localStorage.removeItem('chenu_refresh_token');
      api.setToken(null);
    }
  }

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/users/me');
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return api.patch<UserProfile>('/users/me/profile', data);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('chenu_access_token');
  }
}

export const authService = new AuthService();
export default authService;
