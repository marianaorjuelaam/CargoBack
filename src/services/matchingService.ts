import type { Driver, Load, LatLng } from '@/domain/types';
import type { RawLoad } from '@/data/mockLoads';
import { RAW_LOADS } from '@/data/mockLoads';
import { formatCOP } from '@/utils/formatters';

export const CITY_COORDS: Record<string, LatLng> = {
  'Bogotá':       { lat: 4.711,  lng: -74.072 },
  'Medellín':     { lat: 6.244,  lng: -75.574 },
  'Cali':         { lat: 3.451,  lng: -76.532 },
  'Cartagena':    { lat: 10.391, lng: -75.479 },
  'Barranquilla': { lat: 10.979, lng: -74.796 },
  'Buenaventura': { lat: 3.883,  lng: -77.031 },
  'Pereira':      { lat: 4.813,  lng: -75.696 },
  'Manizales':    { lat: 5.070,  lng: -75.521 },
  'Bucaramanga':  { lat: 7.119,  lng: -73.123 },
  'Santa Marta':  { lat: 11.240, lng: -74.199 },
};

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function bearing(from: LatLng, to: LatLng): number {
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const dLng  = toRad(to.lng - from.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function directionScore(b1: number, b2: number): number {
  const diff  = Math.abs(b1 - b2);
  const angle = diff > 180 ? 360 - diff : diff;
  return 1 - angle / 180;
}

function scoreLoad(driver: Driver, load: RawLoad): number {
  const driverFrom = CITY_COORDS[driver.currentCity];
  const driverTo   = CITY_COORDS[driver.destinationCity];
  const loadFrom   = CITY_COORDS[load.origin];
  const loadTo     = CITY_COORDS[load.destination];

  if (!driverFrom || !driverTo || !loadFrom || !loadTo) return 0;

  const direction  = directionScore(bearing(driverFrom, driverTo), bearing(loadFrom, loadTo));
  const detour     = Math.max(0, 1 - load.detourKm / 50);
  const pricePerKm = load.priceCOP / load.distanceKm;
  const price      = Math.min(pricePerKm / 5000, 1);
  const truckMatch = load.truckTypeRequired === driver.truckType ? 1 : 0.4;

  return direction * 0.35 + detour * 0.25 + price * 0.25 + truckMatch * 0.15;
}

function truckName(type: string): string {
  const names: Record<string, string> = {
    flatbed: 'plataforma',
    refrigerated: 'refrigerado',
    tanker: 'cisterna',
    general: 'general',
  };
  return names[type] ?? type;
}

function generateExplanation(driver: Driver, load: RawLoad): string {
  const pricePerKm = Math.round(load.priceCOP / load.distanceKm);
  const ppk        = formatCOP(pricePerKm);
  const goesHome   = load.destination === driver.destinationCity;
  const truckOk    = load.truckTypeRequired === driver.truckType;
  const noDetour   = load.detourKm === 0;
  const lowDetour  = load.detourKm > 0 && load.detourKm <= 12;
  const highPrice  = pricePerKm >= 4000;
  const goodPrice  = pricePerKm >= 3000;
  const lowPrice   = pricePerKm < 2000;

  // Perfect: goes to driver's destination with no detour
  if (goesHome && noDetour) {
    const priceNote = highPrice
      ? `y te paga muy bien: ${ppk}/km`
      : `pagando ${ppk}/km`;
    return `Carga perfecta — sale de ${load.origin} directo a ${driver.destinationCity} sin ningún desvío, ${priceNote}.`;
  }

  // Goes home with a small detour
  if (goesHome && lowDetour) {
    const priceNote = goodPrice ? ` — buen precio para esta ruta` : '';
    return `Te lleva hasta ${driver.destinationCity} con solo ${load.detourKm} km de desvío y paga ${ppk}/km${priceNote}.`;
  }

  // Goes home but larger detour
  if (goesHome) {
    return `Va hasta ${driver.destinationCity} — tu destino final. Desvío de ${load.detourKm} km, tarifa de ${ppk}/km.`;
  }

  // No detour with excellent price
  if (noDetour && highPrice) {
    return `Cero desvío desde ${load.origin} y tarifa excelente: ${ppk}/km. Ruta directa hacia ${load.destination}.`;
  }

  // No detour
  if (noDetour) {
    return `Sale directo desde ${load.origin} sin ningún desvío hacia ${load.destination}. Tarifa: ${ppk}/km.`;
  }

  // Truck type mismatch — most important thing to flag
  if (!truckOk) {
    return `Paga ${ppk}/km pero requiere camión tipo ${truckName(load.truckTypeRequired)}. Confirma si tu vehículo aplica antes de aceptar.`;
  }

  // Great price + low detour
  if (highPrice && lowDetour) {
    return `Tarifa excelente (${ppk}/km) con desvío mínimo de ${load.detourKm} km para cargar en ${load.origin}.`;
  }

  // Good price
  if (goodPrice) {
    const detourNote = lowDetour
      ? `con solo ${load.detourKm} km de desvío`
      : `y ${load.detourKm} km de desvío`;
    return `Buen precio: ${ppk}/km en la ruta ${load.origin}–${load.destination}, ${detourNote}.`;
  }

  // Below-average price — call it out so driver can evaluate
  if (lowPrice) {
    return `Va hacia ${load.destination} con ${load.detourKm} km de desvío. Tarifa baja (${ppk}/km) — evalúa si cubre el costo del viaje.`;
  }

  // Default
  return `Va en tu misma dirección hacia ${load.destination}, paga ${ppk}/km y te desvía ${load.detourKm} km.`;
}

export function findBestLoad(driver: Driver, rejectedIds: string[]): Load | null {
  const available = RAW_LOADS.filter((l) => !rejectedIds.includes(l.id));
  if (available.length === 0) return null;

  const best = available
    .map((load) => ({ load, score: scoreLoad(driver, load) }))
    .sort((a, b) => b.score - a.score)[0].load;

  return {
    ...best,
    explanation: generateExplanation(driver, best),
  };
}
