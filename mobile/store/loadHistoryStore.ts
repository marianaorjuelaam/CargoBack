import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LoadAction {
  loadId: string;
  origin: string;
  destination: string;
  priceCOP: number;
  action: 'accepted' | 'rejected';
  timestamp: number;
  cargoType: string;
}

interface LoadHistoryState {
  history: LoadAction[];
  addAction: (action: LoadAction) => void;
  clearHistory: () => void;
  getStats: () => {
    totalAccepted: number;
    totalRejected: number;
    totalEarnings: number;
    acceptanceRate: number;
  };
}

export const useLoadHistoryStore = create<LoadHistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      addAction: (action: LoadAction) => {
        set((state) => ({
          history: [action, ...state.history],
        }));
      },

      clearHistory: () => set({ history: [] }),

      getStats: () => {
        const { history } = get();
        const accepted = history.filter((h) => h.action === 'accepted').length;
        const rejected = history.filter((h) => h.action === 'rejected').length;
        const total = accepted + rejected;
        const earnings = history
          .filter((h) => h.action === 'accepted')
          .reduce((sum, h) => sum + h.priceCOP, 0);

        return {
          totalAccepted: accepted,
          totalRejected: rejected,
          totalEarnings: earnings,
          acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
        };
      },
    }),
    {
      name: 'load-history-store',
    }
  )
);
