import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginForm, RegisterForm } from '@/types';
import { mockApiResponses, mockDelay, DEFAULT_CREDENTIALS } from '@/mock/api';

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

// Mock mode flag - set to true to use mock data
const USE_MOCK = true;

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
        console.log('Login attempt with credentials:', credentials);
        set({ isLoading: true, error: null });
        
        try {
          if (USE_MOCK) {
            console.log('Using mock authentication');
            await mockDelay(800);
            
            // Validate credentials against default credentials
            const isValidAdmin = credentials.email === DEFAULT_CREDENTIALS.admin.email && 
                                credentials.password === DEFAULT_CREDENTIALS.admin.password;
            const isValidUser = credentials.email === DEFAULT_CREDENTIALS.user.email && 
                               credentials.password === DEFAULT_CREDENTIALS.user.password;
            
            if (!isValidAdmin && !isValidUser) {
              throw new Error('Invalid credentials');
            }
            
            const mockResponse = mockApiResponses['POST /api/auth/login'];
            const { token } = mockResponse;
            
            // Create complete user object with all required properties
            const currentDate = new Date().toISOString();
            const userWithRole: User = isValidAdmin 
              ? { 
                  id: '1',
                  name: 'Admin User',
                  email: credentials.email,
                  role: 'admin' as const,
                  isActive: true,
                  createdAt: currentDate,
                  updatedAt: currentDate
                }
              : { 
                  id: '2',
                  name: 'User Account',
                  email: credentials.email,
                  role: 'user' as const,
                  isActive: true,
                  createdAt: currentDate,
                  updatedAt: currentDate
                };
            
            localStorage.setItem('auth_token', token);
            set({
              user: userWithRole,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            console.log('Login successful, user set:', userWithRole);
          } else {
            // Real API call would go here
            console.log('Making API call to:', '/api/auth/login');
            throw new Error('Real API not implemented');
          }
        } catch (error: any) {
          console.error('Login error:', error);
          set({
            isLoading: false,
            error: error.message || 'Login failed'
          });
          throw error;
        }
      },

      register: async (userData: RegisterForm) => {
        set({ isLoading: true, error: null });
        try {
          if (USE_MOCK) {
            await mockDelay(800);
            const mockResponse = mockApiResponses['POST /api/auth/register'];
            
            // Create complete user object with all required properties
            const currentDate = new Date().toISOString();
            const user: User = { 
              id: '2', 
              name: userData.name, 
              email: userData.email, 
              role: 'user' as const,
              isActive: true,
              createdAt: currentDate,
              updatedAt: currentDate
            };
            const token = 'mock-jwt-token-new-user';
            
            localStorage.setItem('auth_token', token);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          } else {
            throw new Error('Real API not implemented');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Registration failed'
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
          if (USE_MOCK) {
            await mockDelay(800);
            const mockResponse = mockApiResponses['POST /api/auth/reset-password'];
            set({ isLoading: false });
          } else {
            throw new Error('Real API not implemented');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Reset password failed'
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
