export function formatCOP(amount: number): string {
  return `$${amount.toLocaleString('es-CO')}`;
}

export function formatPricePerKm(priceCOP: number, distanceKm: number): string {
  const perKm = Math.round(priceCOP / distanceKm);
  return `${formatCOP(perKm)}/km`;
}
