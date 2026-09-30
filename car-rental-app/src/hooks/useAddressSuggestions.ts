/* ___ useAddressSuggestions hook _____________________
    Address autocomplete for the LocationPicker. Asks
    the api for suggestions a moment after the user
    stops typing, so every keystroke does not become
    a request, and drops answers that arrive after
    the text has changed again.
   ____________________________________________________*/

import { useEffect, useState } from 'react';

import { api, type AddressSuggestion } from '../api';

const DEBOUNCE_MS = 250;
// a single letter matches half the country, so wait for a bit more
const MIN_LENGTH = 2;

type Answer = { query: string; suggestions: AddressSuggestion[]; error: string | null };

export function useAddressSuggestions(text: string) {
  const [answer, setAnswer] = useState<Answer | null>(null);

  const query = text.trim();
  const shouldAsk = query.length >= MIN_LENGTH;

  useEffect(() => {
    if (!shouldAsk) return;
    let isActive = true;

    const timer = setTimeout(() => {
      api.addresses
        .suggest(query)
        .then((suggestions) => {
          if (isActive) setAnswer({ query, suggestions, error: null });
        })
        .catch((cause: unknown) => {
          if (!isActive) return;
          const error = cause instanceof Error ? cause.message : 'Could not look up addresses.';
          setAnswer({ query, suggestions: [], error });
        });
    }, DEBOUNCE_MS);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [query, shouldAsk]);

  // only show an answer for the text currently in the field
  const current = shouldAsk && answer?.query === query ? answer : null;
  return { suggestions: current?.suggestions ?? [], error: current?.error ?? null };
}
