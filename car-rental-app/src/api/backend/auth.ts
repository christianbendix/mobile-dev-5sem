import { pb } from '../client';
import { COLLECTIONS } from '../config';
import type { AuthApi, AuthUser } from '../contract';
import { ApiError, toApiError } from '../errors';
import type { UserRecord } from './records';

function toAuthUser(record: UserRecord): AuthUser {
  return {
    id: record.id,
    name: record.name ?? '',
    email: record.email ?? '',
  };
}

/**
 * Real PocketBase auth. Unlike the car and booking queries this always runs
 * against the backend: the `users` collection works today.
 */
export const backendAuth: AuthApi = {
  async login(identity, password) {
    try {
      const { record } = await pb
        .collection(COLLECTIONS.users)
        .authWithPassword<UserRecord>(identity.trim(), password);
      return toAuthUser(record);
    } catch (cause) {
      // PocketBase answers 400 for both an unknown identity and a bad password,
      // so there is nothing more specific to tell the user than this
      const normalised = toApiError(cause, 'Could not log in.');
      if (normalised.kind === 'offline') throw normalised;
      throw new ApiError('unauthorized', 'Wrong email or password.', normalised.status, cause);
    }
  },

  logout() {
    pb.authStore.clear();
  },

  currentUser() {
    const record = pb.authStore.record;
    return record ? toAuthUser(record as UserRecord) : null;
  },
};
