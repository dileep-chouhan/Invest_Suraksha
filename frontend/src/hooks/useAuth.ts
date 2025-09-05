import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';
import { AuthService } from '../services/auth';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = useCallback(async () => {
    try {
      const token = await AuthService.getToken();
      if (token) {
        const profileResponse = await ApiService.getProfile();
        setAuthState({
          user: profileResponse.user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await AuthService.removeToken();
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await ApiService.login({ email, password });
      await AuthService.storeToken(response.token);
      setAuthState({
        user: response.user,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
      });
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }, []);

  const register = useCallback(async (userData: {
    email: string;
    password: string;
    name: string;
    phoneNumber?: string;
    preferredLanguage?: string;
  }) => {
    try {
      const response = await ApiService.register(userData);
      await AuthService.storeToken(response.token);
      setAuthState({
        user: response.user,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
      });
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.removeToken();
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateProfile = useCallback(async (updates: any) => {
    try {
      const response = await ApiService.updateProfile(updates);
      setAuthState(prev => ({
        ...prev,
        user: response.user,
      }));
      return { success: true };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Update failed' 
      };
    }
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    checkAuthState,
  };
};
