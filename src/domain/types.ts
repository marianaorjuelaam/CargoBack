export interface LatLng {
  lat: number;
  lng: number;
}

export type TruckType = 'general' | 'refrigerated' | 'flatbed' | 'tanker';

export interface Load {
  id: string;
  origin: string;
  destination: string;
  priceCOP: number;
  detourKm: number;
  cargoType: string;
  truckTypeRequired: TruckType;
  distanceKm: number;
  explanation: string;
}

export interface Driver {
  id: string;
  name: string;
  truckType: TruckType;
  currentCity: string;
  currentLocation: LatLng;
  destinationCity: string;
}

export type AppState =
  | { status: 'idle' }
  | { status: 'searching'; rejectedIds: string[] }
  | { status: 'match'; load: Load; rejectedIds: string[] }
  | { status: 'validating'; load: Load; rejectedIds: string[] }
  | { status: 'active'; load: Load; startedAt: number }
  | { status: 'completed'; load: Load }
  | { status: 'no_match' };
