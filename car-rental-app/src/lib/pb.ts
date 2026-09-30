import AsyncStorage from '@react-native-async-storage/async-storage';
import PocketBase, { AsyncAuthStore } from 'pocketbase';

const AUTH_STORAGE_KEY = 'pb_auth';

// local instance; swap when the db moves to the cloud
export const POCKETBASE_URL = 'http://192.168.1.252:8090';

// the sdk defaults to localStorage, which react native lacks
const authStore = new AsyncAuthStore({
  save: (serialized) => AsyncStorage.setItem(AUTH_STORAGE_KEY, serialized),
  clear: () => AsyncStorage.removeItem(AUTH_STORAGE_KEY),
  initial: AsyncStorage.getItem(AUTH_STORAGE_KEY),
});

export const pb = new PocketBase(POCKETBASE_URL, authStore);

export async function checkConnection(): Promise<boolean> {
  try {
    // requestKey: null disables auto-cancellation
    const { code } = await pb.health.check({ requestKey: null });
    return code === 200;
  } catch {
    return false;
  }
}
