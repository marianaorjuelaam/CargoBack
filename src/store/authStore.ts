import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/authService';

type AuthStatus = 'idle' | 'loading' | 'otp_sent' | 'authenticated' | 'error';

export interface Driver {
  id: string;
  phone: string;
  name: string;
  truckType: 'general' | 'refrigerated' | 'tanker' | 'flatbed';
  capacityTons: number;
}

interface AuthState {
  status: AuthStatus;
  error: string | null;
  phone: string;
  verificationId: string | null;
  driver: Driver | null;
  token: string | null;

  // Actions
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (code: string) => Promise<{ isNewUser: boolean }>;
  saveProfile: (data: Omit<Driver, 'id' | 'phone'>) => Promise<void>;
  logout: () => void;
  resetError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      error: null,
      phone: '',
      verificationId: null,
      driver: null,
      token: null,

      sendOTP: async (phone: string) => {
        set({ status: 'loading', error: null, phone });
        try {
          const verificationId = await authService.sendOTP(phone);
          set({ status: 'otp_sent', verificationId });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'No pudimos enviar el código';
          set({ status: 'error', error: message });
          throw err;
        }
      },

      verifyOTP: async (code: string) => {
        set({ status: 'loading', error: null });
        try {
          const { isNewUser, driver, token } = await authService.verifyOTP(
            get().phone,
            code,
            get().verificationId || ''
          );
          set({ status: 'authenticated', driver, token });
          return { isNewUser };
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Ese código no es correcto';
          set({ status: 'error', error: message });
          throw err;
        }
      },

      saveProfile: async (data: Omit<Driver, 'id' | 'phone'>) => {
        try {
          const driver = await authService.saveProfile(get().phone, data);
          set({ driver });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Error al guardar perfil';
          set({ error: message });
          throw err;
        }
      },

      logout: () => {
        set({ status: 'idle', driver: null, token: null, phone: '', error: null });
      },

      resetError: () => set({ error: null }),
    }),
    {
      name: 'cargoback-auth',
      partialize: (state) => ({
        driver: state.driver,
        token: state.token,
        phone: state.phone,
      }),
    }
  )
);
