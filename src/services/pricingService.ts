import type { TruckType } from '@/domain/types';
import { formatCOP } from '@/utils/formatters';

// Tarifa base por km según tipo de camión (COP)
const BASE_RATE_PER_KM: Record<TruckType, number> = {
  general:      1_800,
  refrigerated: 2_800,
  flatbed:      2_200,
  tanker:       2_500,
};

// Factor multiplicador según tipo de carga
const CARGO_FACTOR: Record<string, number> = {
  'Electrodomésticos':         1.15,
  'Alimentos':                 1.05,
  'Textiles':                  0.95,
  'Madera':                    1.00,
  'Materiales de construcción': 1.10,
  'Químicos':                  1.30,
  'Farmacéuticos':             1.25,
  'General':                   1.00,
};

// Factor por demanda simulado según hora del día
function getDemandFactor(): number {
  const hour = new Date().getHours();
  if (hour >= 6 && hour <= 9)   return 1.15; // Hora pico mañana
  if (hour >= 17 && hour <= 19) return 1.10; // Hora pico tarde
  if (hour >= 22 || hour <= 5)  return 0.90; // Noche → descuento
  return 1.00;
}

// Factor por capacidad: camiones más grandes = mejor precio por ton
function getCapacityFactor(capacityTons: number): number {
  if (capacityTons >= 20) return 1.10;
  if (capacityTons >= 10) return 1.05;
  return 1.00;
}

export interface PriceBreakdown {
  basePrice: number;
  finalPrice: number;
  pricePerKm: number;
  demandLabel: string;
  formatted: string;
  range: { min: string; max: string };
}

export function calculatePrice(params: {
  distanceKm: number;
  truckType: TruckType;
  capacityTons: number;
  cargoType?: string;
}): PriceBreakdown {
  const { distanceKm, truckType, capacityTons, cargoType = 'General' } = params;

  const baseTariff   = BASE_RATE_PER_KM[truckType];
  const cargoFactor  = CARGO_FACTOR[cargoType] ?? 1.0;
  const demandFactor = getDemandFactor();
  const capFactor    = getCapacityFactor(capacityTons);

  const basePrice  = distanceKm * baseTariff;
  const finalPrice = Math.round(basePrice * cargoFactor * demandFactor * capFactor);
  const pricePerKm = Math.round(finalPrice / distanceKm);

  // Etiqueta de demanda para mostrar al usuario
  const hour = new Date().getHours();
  let demandLabel = '';
  if (demandFactor > 1.10) demandLabel = '🔥 Alta demanda';
  else if (demandFactor > 1.0) demandLabel = '⚡ Demanda moderada';
  else if (demandFactor < 1.0) demandLabel = '💤 Baja demanda';

  return {
    basePrice,
    finalPrice,
    pricePerKm,
    demandLabel,
    formatted: formatCOP(finalPrice),
    range: {
      min: formatCOP(Math.round(finalPrice * 0.92)),
      max: formatCOP(Math.round(finalPrice * 1.08)),
    },
  };
}

// Precio rápido para mostrar en IdleCard sin parámetros específicos
export function getEstimatedPrice(truckType: TruckType, capacityTons: number): string {
  // Distancia promedio de una ruta típica en Colombia (~400 km)
  const avgDistance = 400;
  const result = calculatePrice({ distanceKm: avgDistance, truckType, capacityTons });
  return result.formatted;
}
