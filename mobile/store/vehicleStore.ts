import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TruckType = 'general' | 'refrigerated' | 'tanker' | 'flatbed';

export interface Vehicle {
  type: TruckType;
  capacityTons: number;
  plate: string;
  isRefrigerated: boolean;
}

interface VehicleState {
  vehicle: Vehicle | null;
  setVehicle: (vehicle: Vehicle) => void;
  clearVehicle: () => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      vehicle: null,
      setVehicle: (vehicle: Vehicle) => set({ vehicle }),
      clearVehicle: () => set({ vehicle: null }),
    }),
    {
      name: 'vehicle-store-mobile',
    }
  )
);
