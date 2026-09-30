import { ADDRESS_AUTOCOMPLETE_URL } from '../config';
import type { AddressesApi, AddressSuggestion } from '../contract';
import { ApiError, toApiError } from '../errors';

const MAX_SUGGESTIONS = 8;

/** The parts of a DAWA /autocomplete result the app reads. */
export type DawaSuggestion = {
  type: 'vejnavn' | 'adgangsadresse' | 'adresse' | string;
  /** what to put in the field when the suggestion is picked */
  tekst: string;
  /** what to show in the list */
  forslagstekst: string;
  data: { id?: string; x?: number; y?: number };
};

/** Streets become "keep typing" suggestions; addresses carry coordinates (x = lon, y = lat). */
export function toAddressSuggestion(result: DawaSuggestion): AddressSuggestion | null {
  if (result.type === 'vejnavn') {
    return { kind: 'street', label: result.forslagstekst, completion: result.tekst };
  }
  const { id, x, y } = result.data;
  if (!id || x === undefined || y === undefined) return null;
  return {
    kind: 'address',
    id,
    label: result.forslagstekst,
    coordinates: { lat: y, lon: x },
  };
}

export const backendAddresses: AddressesApi = {
  async suggest(text) {
    const query = text.trim();
    if (!query) return [];

    // type=adgangsadresse: street + house number, which is precise enough to
    // find the nearest car and skips floor/door suggestions
    const params = new URLSearchParams({
      q: query,
      type: 'adgangsadresse',
      per_side: String(MAX_SUGGESTIONS),
    });

    try {
      const response = await fetch(`${ADDRESS_AUTOCOMPLETE_URL}?${params}`);
      if (!response.ok) {
        throw new ApiError('unknown', 'Could not look up addresses.', response.status);
      }
      const results = (await response.json()) as DawaSuggestion[];
      return results
        .map(toAddressSuggestion)
        .filter((suggestion): suggestion is AddressSuggestion => suggestion !== null);
    } catch (cause) {
      throw toApiError(cause, 'Could not look up addresses.');
    }
  },
};
