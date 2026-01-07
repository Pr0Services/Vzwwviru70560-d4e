/**
 * CHE·NU — Auth Types
 */

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  mfa_enabled: boolean;
  created_at: string;
  last_login?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  avatar_url?: string;
  avatar_thumbnail_url?: string;
  phone?: string;
  phone_verified: boolean;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  onboarding_completed: boolean;
  onboarding_step: number;
  profile_completion: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  accept_terms: boolean;
  accept_privacy: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export type OAuthProvider = 'google' | 'apple' | 'microsoft' | 'github';
