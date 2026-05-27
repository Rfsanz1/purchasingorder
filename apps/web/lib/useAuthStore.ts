'use client';

import { create } from 'zustand';
import { api, setAuthToken } from './api';

export type UserRole = 'ADMIN' | 'OWNER' | 'SALES' | 'GUDANG' | 'DRIVER' | 'KASIR';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles: UserRole[];
  permissions: string[];
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  error: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadProfile: () => Promise<void>;
}

const storedToken = typeof window !== 'undefined' ? window.localStorage.getItem('erp_token') : null;
const storedRefresh = typeof window !== 'undefined' ? window.localStorage.getItem('erp_refresh_token') : null;

export const useAuthStore = create<AuthState>((set) => {
  if (storedToken) setAuthToken(storedToken);
  return {
    token: storedToken,
    refreshToken: storedRefresh,
    user: null,
    error: null,
    loading: false,
    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const res = await api.post('/auth/login', { email, password });
        const { accessToken, refreshToken, user } = res.data;
        window.localStorage.setItem('erp_token', accessToken);
        window.localStorage.setItem('erp_refresh_token', refreshToken);
        document.cookie = `erp_token=${accessToken}; path=/; SameSite=Strict`;
        document.cookie = `erp_roles=${JSON.stringify(user?.roles ?? [])}; path=/; SameSite=Strict`;
        setAuthToken(accessToken);
        set({ token: accessToken, refreshToken, user, loading: false });
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Login gagal';
        set({ error: msg, loading: false });
        return false;
      }
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('erp_token');
        window.localStorage.removeItem('erp_refresh_token');
        document.cookie = 'erp_token=; path=/; Max-Age=0';
        document.cookie = 'erp_roles=; path=/; Max-Age=0';
      }
      setAuthToken(null);
      set({ token: null, refreshToken: null, user: null, error: null });
    },
    loadProfile: async () => {
      const t = typeof window !== 'undefined' ? window.localStorage.getItem('erp_token') : null;
      if (!t) return;
      try {
        const res = await api.get('/auth/me');
        set({ user: res.data });
      } catch (err: unknown) {
        const e = err as { response?: { status: number } };
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          window.localStorage.removeItem('erp_token');
          window.localStorage.removeItem('erp_refresh_token');
          document.cookie = 'erp_token=; path=/; Max-Age=0';
          setAuthToken(null);
          set({ token: null, refreshToken: null, user: null });
        }
      }
    },
  };
});
