'use client';

import { create } from 'zustand';
import { setAuthToken } from '../api';

interface AuthState {
  token: string | null;
  user: { id: string; email: string; name?: string; roles: string[]; permissions: string[] } | null;
  error: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const storedToken = typeof window !== 'undefined' ? window.localStorage.getItem('erp_token') : null;

export const useAuthStore = create<AuthState>((set) => {
  if (storedToken) {
    setAuthToken(storedToken);
  }

  return {
    token: storedToken,
    user: null,
    error: null,
    loading: false,
    login: async (email: string, password: string) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Login failed');
        }

        const data = await response.json();
        const accessToken = data.accessToken;
        const user = data.user;

        window.localStorage.setItem('erp_token', accessToken);
        setAuthToken(accessToken);
        set({ token: accessToken, user, loading: false });
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to login';
        set({ error: message, loading: false });
        return false;
      }
    },
    logout: () => {
      window.localStorage.removeItem('erp_token');
      setAuthToken(null);
      set({ token: null, user: null });
    },
  };
});
