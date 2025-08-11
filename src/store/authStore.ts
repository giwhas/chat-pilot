
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginForm, RegisterForm } from '@/types';
import { apiClient } from '@/lib/apiClient';
import { API_CONFIG } from '@/config/api';

interface AuthActions {
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginForm) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
          const { user, token } = response.data.data;
          
          localStorage.setItem('auth_token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Login failed'
          });
          throw error;
        }
      },

      register: async (userData: RegisterForm) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
          const { user, token } = response.data.data;
          
          localStorage.setItem('auth_token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Registration failed'
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post(API_CONFIG.ENDPOINTS.RESET_PASSWORD, { email });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Reset password failed'
          });
          throw error;
        }
      },

      setUser: (user: User) => set({ user }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
