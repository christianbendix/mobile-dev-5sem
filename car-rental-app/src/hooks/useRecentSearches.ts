/* ___ useRecentSearches hook _________________________
    Gives screens the user's recent searches. Right
    now it returns mock data - when the backend can
    store searches, only this file changes (call the
    api), the screens stay untouched.
   ____________________________________________________*/

import { mockRecentSearches } from '../data/mock/recentSearches';

export function useRecentSearches() {
  return { recentSearches: mockRecentSearches, isLoading: false };
}
