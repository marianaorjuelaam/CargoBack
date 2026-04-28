import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Driver {
  id: string;
  name: string;
  phone: string;
}

interface AuthState {
  driver: Driver | null;
  setDriver: (driver: Driver) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      driver: null,
      setDriver: (driver: Driver) => set({ driver }),
      logout: () => set({ driver: null }),
    }),
    {
      name: 'auth-store-mobile',
    }
  )
);
