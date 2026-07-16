import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authHttpService } from '../services/httpService';
import { AuthResponse, AuthErrorResponse } from '../utils/authTypes';

const TOKEN_KEY = 'astromonk_auth_token';
const EMAIL_KEY = 'astromonk_auth_email';

type AuthState = {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  isSubmitting: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const persistSession = async (token: string, email: string) => {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, token),
    SecureStore.setItemAsync(EMAIL_KEY, email),
  ]);
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  email: null,
  isAuthenticated: false,
  isHydrating: true,
  isSubmitting: false,
  error: null,

  hydrate: async () => {
    const [token, email] = await Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(EMAIL_KEY),
    ]);
    set({ token, email, isAuthenticated: !!token, isHydrating: false });
  },

  login: async (email, password) => {
    set({ isSubmitting: true, error: null });

    try {
      const response = await authHttpService.post<AuthResponse & Partial<AuthErrorResponse>>(
        '/login',
        { email, password }
      );

      if (!response.ok) {
        set({ isSubmitting: false, error: response.data?.message ?? 'Invalid email or password' });
        return false;
      }

      await persistSession(response.data.token, response.data.email);
      set({
        token: response.data.token,
        email: response.data.email,
        isAuthenticated: true,
        isSubmitting: false,
        error: null,
      });
      return true;
    } catch {
      set({ isSubmitting: false, error: 'Unable to reach server. Please try again.' });
      return false;
    }
  },

  register: async (email, password) => {
    set({ isSubmitting: true, error: null });

    try {
      const response = await authHttpService.post<AuthResponse & Partial<AuthErrorResponse>>(
        '/register',
        { email, password }
      );

      if (!response.ok) {
        set({ isSubmitting: false, error: response.data?.message ?? 'Registration failed' });
        return false;
      }

      await persistSession(response.data.token, response.data.email);
      set({
        token: response.data.token,
        email: response.data.email,
        isAuthenticated: true,
        isSubmitting: false,
        error: null,
      });
      return true;
    } catch {
      set({ isSubmitting: false, error: 'Unable to reach server. Please try again.' });
      return false;
    }
  },

  logout: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(EMAIL_KEY),
    ]);
    set({ token: null, email: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
