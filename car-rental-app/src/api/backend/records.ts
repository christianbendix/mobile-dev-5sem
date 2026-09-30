/**
 * The seam between PocketBase and the app's domain models.
 *
 * The `vehicles` collection is superuser-only and `bookings` does not exist, so
 * the record shapes below are the contract this app *expects*, not one read off
 * a live schema. When the collections open up, correcting these two types and
 * their mappers is the whole job — nothing outside this file assumes a field
 * name.
 */
import type { Booking, BookingStatus, Car } from '../contract';

export const VEHICLE_EXPAND = 'brand,provider,location';
export const BOOKING_EXPAND = 'vehicle,vehicle.provider';

export type VehicleRecord = {
  id: string;
  name?: string;
  model?: string;
  type?: string;
  pricePerDay?: number;
  expand?: {
    brand?: { name?: string };
    provider?: { name?: string };
    location?: { name?: string; city?: string };
  };
};

export type BookingRecord = {
  id: string;
  vehicle: string;
  start: string;
  end: string;
  totalPrice?: number;
  status?: BookingStatus;
  expand?: {
    vehicle?: VehicleRecord;
  };
};

export type UserRecord = {
  id: string;
  name?: string;
  email?: string;
};

export function toCar(record: VehicleRecord): Car {
  const brand = record.expand?.brand?.name ?? '';
  const model = record.model ?? record.name ?? 'Unknown car';
  const location = record.expand?.location;

  return {
    id: record.id,
    name: [brand, model].filter(Boolean).join(' '),
    vendorName: record.expand?.provider?.name ?? 'Unknown vendor',
    type: record.type ?? '',
    pricePerDay: record.pricePerDay ?? 0,
    location: location?.name ?? location?.city ?? 'Unknown location',
  };
}

export function toBooking(record: BookingRecord): Booking {
  const vehicle = record.expand?.vehicle;

  return {
    id: record.id,
    carId: record.vehicle,
    carName: vehicle ? toCar(vehicle).name : 'Unknown car',
    vendorName: vehicle?.expand?.provider?.name ?? 'Unknown vendor',
    startDate: record.start,
    endDate: record.end,
    totalPrice: record.totalPrice ?? 0,
    status: record.status ?? 'active',
  };
}
