/**
 * CHE·NU — useAuth Hook
 */

import { useState, useEffect, useCallback } from 'react';
import authService, { LoginCredentials, RegisterData } from '../services/auth.service';

interface User {
  id: string;
  email: string;
  email_verified: boolean;
}

interface Profile {
  first_name: string;
  last_name: string;
  display_name: string;
  onboarding_completed: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    const data = await authService.getCurrentUser();
    if (data) {
      setUser(data.user);
      setProfile(data.profile);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setProfile(data.profile);
    setIsAuthenticated(true);
    return data;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    return authService.register(data);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
}

export default useAuth;
