'use client';

import { create } from 'zustand';
import { api } from '../api';

interface DashboardState {
  summary: { users: number; roles: number; notifications: number; permissions: number } | null;
  isLoading: boolean;
  error: string | null;
  loadSummary: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  isLoading: false,
  error: null,
  loadSummary: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get('/dashboard/summary');
      set({ summary: response.data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: 'Unable to load dashboard summary', isLoading: false });
    }
  },
}));
