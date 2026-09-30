/* ___ Mock recent searches ___________________________
    Fake data used until the backend stores recent
    searches. Only the hooks may import from
    data/mock - never screens. The ids and coordinates
    are real rows from the `locations` collection, so
    tapping one runs the same search again.
   ____________________________________________________*/

import { RecentSearch } from '../../types/search';

export const mockRecentSearches: RecentSearch[] = [
  {
    id: '1',
    place: {
      id: 'twp4esi7akxqsw2',
      label: 'Aarhus Central Station',
      subtitle: 'Aarhus C',
      lat: 56.1502,
      lon: 10.2045,
    },
    dateRange: '14 – 17 Nov',
    carSize: 'SUV',
  },
  {
    id: '2',
    place: {
      id: 'ljygved0i8vnmvr',
      label: 'Odense Station',
      subtitle: 'Odense C',
      lat: 55.4017,
      lon: 10.387,
    },
    dateRange: '7 – 14 Oct',
    carSize: 'Any size',
  },
];
