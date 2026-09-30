import { pb } from '../client';
import { COLLECTIONS } from '../config';
import type { BookingsApi } from '../contract';
import { ApiError, toApiError } from '../errors';
import { rentalDays } from '../pricing';
import { BOOKING_EXPAND, toBooking, type BookingRecord, type ListingRecord } from './records';

export const backendBookings: BookingsApi = {
  async listForUser(userId) {
    try {
      const records = await pb.collection(COLLECTIONS.bookings).getFullList<BookingRecord>({
        filter: pb.filter('user_id = {:userId}', { userId }),
        expand: BOOKING_EXPAND,
        sort: '-start_date',
        requestKey: 'bookings-for-user',
      });
      return records.map((record) => toBooking(record));
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
      // `total_price` is required by the schema and there is no server hook to
      // compute it, so price from the listing as stored rather than from the
      // Car the screen passed around. The schema has no fields for the driver's
      // name and phone, so those are not persisted.
      const listing = await pb
        .collection(COLLECTIONS.listings)
        .getOne<ListingRecord>(input.carId, { requestKey: null });
      const totalPrice = (listing.daily_price ?? 0) * rentalDays(input.startDate, input.endDate);

      const record = await pb.collection(COLLECTIONS.bookings).create<BookingRecord>(
        {
          user_id: userId,
          listing_id: input.carId,
          start_date: input.startDate,
          end_date: input.endDate,
          total_price: totalPrice,
        },
        { expand: BOOKING_EXPAND },
      );
      return toBooking(record);
    } catch (cause) {
      throw toApiError(cause, 'Could not create the booking.');
    }
  },
};
