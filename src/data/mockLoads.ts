import type { Driver, TruckType } from '@/domain/types';

export interface RawLoad {
  id: string;
  origin: string;
  destination: string;
  priceCOP: number;
  detourKm: number;
  cargoType: string;
  truckTypeRequired: TruckType;
  distanceKm: number;
}

export const MOCK_DRIVER: Driver = {
  id: 'driver-001',
  name: 'Carlos',
  truckType: 'general',
  currentCity: 'Buenaventura',
  currentLocation: { lat: 3.883, lng: -77.031 },
  destinationCity: 'Bogotá',
};

// Loads scored against a driver returning from Buenaventura toward Bogotá.
// Sorted loosely from best to worst match so rejection order feels logical.
export const RAW_LOADS: RawLoad[] = [
  {
    id: 'load-001',
    origin: 'Buenaventura',
    destination: 'Bogotá',
    priceCOP: 2200000,
    detourKm: 0,
    cargoType: 'Electrodomésticos',
    truckTypeRequired: 'general',
    distanceKm: 520,
  },
  {
    id: 'load-002',
    origin: 'Cali',
    destination: 'Bogotá',
    priceCOP: 1800000,
    detourKm: 8,
    cargoType: 'Alimentos',
    truckTypeRequired: 'general',
    distanceKm: 470,
  },
  {
    id: 'load-003',
    origin: 'Cali',
    destination: 'Medellín',
    priceCOP: 950000,
    detourKm: 15,
    cargoType: 'Textiles',
    truckTypeRequired: 'general',
    distanceKm: 415,
  },
  {
    id: 'load-004',
    origin: 'Buenaventura',
    destination: 'Pereira',
    priceCOP: 700000,
    detourKm: 22,
    cargoType: 'Madera',
    truckTypeRequired: 'flatbed',
    distanceKm: 240,
  },
  {
    id: 'load-005',
    origin: 'Cali',
    destination: 'Cartagena',
    priceCOP: 1400000,
    detourKm: 45,
    cargoType: 'Materiales de construcción',
    truckTypeRequired: 'general',
    distanceKm: 960,
  },
];
