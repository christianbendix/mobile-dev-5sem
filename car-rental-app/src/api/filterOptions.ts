import type { Car, FilterOptions, Transmission } from './contract';

function sortedUnique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

/**
 * The filter choices a set of cars offers. Both implementations derive them
 * from the listings themselves, so every option matches at least one car.
 */
export function filterOptionsFor(cars: Car[]): FilterOptions {
  const prices = cars.map((car) => car.pricePerDay);
  const transmissions = new Set(cars.map((car) => car.transmission));

  return {
    brands: sortedUnique(cars.map((car) => car.make)),
    vendors: sortedUnique(cars.map((car) => car.vendorName)),
    carTypes: sortedUnique(cars.map((car) => car.type)),
    transmissions: (['automatic', 'manual'] as Transmission[]).filter((t) => transmissions.has(t)),
    priceRange: prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
  };
}
