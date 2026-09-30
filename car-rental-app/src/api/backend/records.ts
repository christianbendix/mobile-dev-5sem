/**
 * The seam between PocketBase and the app's domain models.
 *
 * The record shapes below mirror the live schema. A `Car` in the app is a row
 * in `listings` (a vehicle offered by a brand at a location, at a daily price),
 * and a booking points at a listing. Nothing outside this file assumes a field
 * name.
 */
import type { Booking, BookingStatus, Car } from '../contract';

export const LISTING_EXPAND = 'vehicle_id,brand_id,location_id';
export const BOOKING_EXPAND = 'listing_id.vehicle_id,listing_id.brand_id,listing_id.location_id';

export type VehicleRecord = {
  id: string;
  make?: string;
  model?: string;
  category?: string;
  automatic?: boolean;
  airconditioning?: boolean;
  seats?: number;
  doors?: number;
  image?: string;
};

export type BrandRecord = {
  id: string;
  name?: string;
};

export type LocationRecord = {
  id: string;
  name?: string;
  city?: string;
};

export type ListingRecord = {
  id: string;
  vehicle_id: string;
  brand_id: string;
  location_id: string;
  daily_price?: number;
  currency?: string;
  expand?: {
    vehicle_id?: VehicleRecord;
    brand_id?: BrandRecord;
    location_id?: LocationRecord;
  };
};

export type BookingRecord = {
  id: string;
  user_id: string;
  listing_id: string;
  /** PocketBase datetime, e.g. "2026-10-01 00:00:00.000Z" */
  start_date: string;
  end_date: string;
  total_price?: number;
  expand?: {
    listing_id?: ListingRecord;
  };
};

export type UserRecord = {
  id: string;
  name?: string;
  email?: string;
};

/** PocketBase datetimes are "YYYY-MM-DD HH:mm:ss.sssZ"; the app uses the date part. */
function toIsoDate(value: string): string {
  return value.slice(0, 10);
}

export function toCar(record: ListingRecord): Car {
  const vehicle = record.expand?.vehicle_id;
  const location = record.expand?.location_id;
  const name = [vehicle?.make, vehicle?.model].filter(Boolean).join(' ');

  return {
    id: record.id,
    name: name || 'Unknown car',
    vendorName: record.expand?.brand_id?.name ?? 'Unknown vendor',
    type: vehicle?.category ?? '',
    pricePerDay: record.daily_price ?? 0,
    location: location?.name ?? location?.city ?? 'Unknown location',
  };
}

/** A booking is active until its return date has passed. */
export function bookingStatus(endDate: string, today = new Date()): BookingStatus {
  return endDate < today.toISOString().slice(0, 10) ? 'completed' : 'active';
}

export function toBooking(record: BookingRecord, today = new Date()): Booking {
  const listing = record.expand?.listing_id;
  const car = listing ? toCar(listing) : undefined;
  const endDate = toIsoDate(record.end_date);

  return {
    id: record.id,
    carId: record.listing_id,
    carName: car?.name ?? 'Unknown car',
    vendorName: car?.vendorName ?? 'Unknown vendor',
    startDate: toIsoDate(record.start_date),
    endDate,
    totalPrice: record.total_price ?? 0,
    status: bookingStatus(endDate, today),
  };
}
