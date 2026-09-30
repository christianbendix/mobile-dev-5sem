import { pb } from '../client';
import { COLLECTIONS } from '../config';
import type { BookingsApi, BookingStatus } from '../contract';
import { ApiError, toApiError } from '../errors';
import { BOOKING_EXPAND, toBooking, type BookingRecord } from './records';

export const backendBookings: BookingsApi = {
  async listForUser(userId) {
    try {
      const records = await pb.collection(COLLECTIONS.bookings).getFullList<BookingRecord>({
        filter: pb.filter('user = {:userId}', { userId }),
        expand: BOOKING_EXPAND,
        sort: '-start',
        requestKey: 'bookings-for-user',
      });
      return records.map(toBooking);
    } catch (cause) {
      throw toApiError(cause, 'Could not load bookings.');
    }
  },

  async create(input) {
    const userId = pb.authStore.record?.id;
    if (!userId) {
      throw new ApiError('unauthorized', 'You must be logged in to book.');
    }

    try {
      // totalPrice is deliberately not sent: pricing belongs to the backend, so
      // a client cannot name its own total.
      const record = await pb.collection(COLLECTIONS.bookings).create<BookingRecord>(
        {
          user: userId,
          vehicle: input.carId,
          start: input.startDate,
          end: input.endDate,
          status: 'active' satisfies BookingStatus,
          fullName: input.fullName,
          phone: input.phone,
        },
        { expand: BOOKING_EXPAND },
      );
      return toBooking(record);
    } catch (cause) {
      throw toApiError(cause, 'Could not create the booking.');
    }
  },
};
