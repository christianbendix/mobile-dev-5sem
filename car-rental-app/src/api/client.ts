import AsyncStorage from '@react-native-async-storage/async-storage';
import PocketBase, { AsyncAuthStore } from 'pocketbase';

import { POCKETBASE_URL } from './config';

const AUTH_STORAGE_KEY = 'pb_auth';

// Session-scoped auth. Saves go to AsyncStorage so the token outlives the JS
// context being paused (backgrounding / soft close), but `initial` is
// deliberately omitted: nothing is read back on a cold start, so a full restart
// or an Expo reload always lands on the login screen.
const authStore = new AsyncAuthStore({
  save: (serialized) => AsyncStorage.setItem(AUTH_STORAGE_KEY, serialized),
  clear: () => AsyncStorage.removeItem(AUTH_STORAGE_KEY),
});

/**
 * The one PocketBase instance. Only modules inside src/api/backend/ should
 * import this — everything else goes through the `api` object in src/api.
 */
export const pb = new PocketBase(POCKETBASE_URL, authStore);

// drop whatever the previous run left behind, so no stale token sits at rest
void AsyncStorage.removeItem(AUTH_STORAGE_KEY);

export async function isReachable(): Promise<boolean> {
  try {
    // requestKey: null disables auto-cancellation
    const { code } = await pb.health.check({ requestKey: null });
    return code === 200;
  } catch {
    return false;
  }
}

export { POCKETBASE_URL };
