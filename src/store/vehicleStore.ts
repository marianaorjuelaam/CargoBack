import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TruckType } from '@/domain/types';

export interface Vehicle {
  type: TruckType;
  capacityTons: number;
  plate: string;
  isRefrigerated: boolean;
}

interface VehicleState {
  vehicle: Vehicle | null;
  saveVehicle: (v: Vehicle) => void;
  clearVehicle: () => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      vehicle: null,
      saveVehicle: (vehicle) => set({ vehicle }),
      clearVehicle: () => set({ vehicle: null }),
    }),
    { name: 'cargoback-vehicle' }
  )
);
