import { fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import * as Location from 'expo-location';

import App from '../App';
import { ApiError, sortByDistance } from '../src/api';
import { backendAddresses, toAddressSuggestion } from '../src/api/backend/addresses';
import { fixtureCars } from '../src/api/fixtures';
import { FIXTURE_CARS } from '../src/api/fixtures/data';
import { resolveOrigin } from '../src/utils/deviceLocation';
import { addDays, formatDay } from '../src/utils/searchInput';

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: { addEventListener: jest.fn(() => jest.fn()) },
}));

jest.mock('expo-location', () => ({
  Accuracy: { Balanced: 3 },
  requestForegroundPermissionsAsync: jest.fn(),
  hasServicesEnabledAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

const mockSuggest = jest.fn();

// Car queries run against the real fixture implementation, as in auth-gates-test.
// Address suggestions come from an outside service, so they are stubbed.
jest.mock('../src/api', () => {
  const actual = jest.requireActual('../src/api');
  const fixtures = jest.requireActual('../src/api/fixtures');
  return {
    ...actual,
    api: {
      ...actual.api,
      cars: fixtures.fixtureCars,
      locations: fixtures.fixtureLocations,
      bookings: fixtures.fixtureBookings,
      // read lazily: this factory runs before `mockSuggest` is initialised
      addresses: { suggest: (text: string) => mockSuggest(text) },
    },
  };
});

const location = jest.mocked(Location);

/** the fixture car at "Aarhus C" */
const AARHUS_C = { lat: 56.1541, lon: 10.2069 };
const ODENSE = { lat: 55.4017, lon: 10.387 };
/** the most expensive fixture car, so nearest-first can't pass by price order */
const AALBORG = { lat: 57.043, lon: 9.917 };

function position({ lat, lon }: { lat: number; lon: number }) {
  return { coords: { latitude: lat, longitude: lon } } as Location.LocationObject;
}

function permission(granted: boolean) {
  return { granted } as Location.LocationPermissionResponse;
}

beforeEach(() => {
  jest.clearAllMocks();
  location.requestForegroundPermissionsAsync.mockResolvedValue(permission(true));
  location.hasServicesEnabledAsync.mockResolvedValue(true);
  location.getLastKnownPositionAsync.mockResolvedValue(null);
  location.getCurrentPositionAsync.mockResolvedValue(position(AARHUS_C));
  mockSuggest.mockResolvedValue([]);
});

describe('sortByDistance', () => {
  it('puts the nearest first and cars without coordinates last', () => {
    const near = { id: 'near', coordinates: AARHUS_C };
    const far = { id: 'far', coordinates: ODENSE };
    const unknown: { id: string; coordinates?: typeof AARHUS_C } = { id: 'unknown' };

    expect(sortByDistance([unknown, far, near], AARHUS_C).map((c) => c.id)).toEqual([
      'near',
      'far',
      'unknown',
    ]);
  });
});

describe('fixture search near a point', () => {
  it('lists every car, nearest first, when no radius is given', async () => {
    const results = await fixtureCars.search({ near: AALBORG });

    expect(results).toHaveLength(FIXTURE_CARS.length);
    expect(results[0].location).toBe('Aalborg');
  });

  it('drops cars outside the radius when one is given', async () => {
    const results = await fixtureCars.search({ near: AARHUS_C, radiusKm: 10 });

    expect(results.map((car) => car.location)).toEqual(['Aarhus C', 'Aarhus N']);
  });
});

describe('resolveOrigin', () => {
  it('uses the coordinates a rental location or address already has', async () => {
    const place = { id: 'x', label: 'Odense', subtitle: '', ...ODENSE };

    await expect(resolveOrigin({ kind: 'place', place })).resolves.toEqual({
      coordinates: ODENSE,
    });
    await expect(
      resolveOrigin({ kind: 'address', label: 'Vestergade 1', coordinates: ODENSE }),
    ).resolves.toEqual({ coordinates: ODENSE });
    expect(location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it('prefers a recent last-known fix over a fresh one', async () => {
    location.getLastKnownPositionAsync.mockResolvedValue(position(ODENSE));

    await expect(resolveOrigin({ kind: 'current' })).resolves.toEqual({ coordinates: ODENSE });
    expect(location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it('says why when permission is denied', async () => {
    location.requestForegroundPermissionsAsync.mockResolvedValue(permission(false));

    await expect(resolveOrigin({ kind: 'current' })).resolves.toEqual({
      error: 'Location permission was denied.',
    });
  });

  it('says why when location services are off', async () => {
    location.hasServicesEnabledAsync.mockResolvedValue(false);

    await expect(resolveOrigin({ kind: 'current' })).resolves.toEqual({
      error: 'Location services are turned off on this device.',
    });
  });

  it('explains a browser geolocation error', async () => {
    // what a browser rejects with when the site is blocked from location
    location.getCurrentPositionAsync.mockRejectedValue({ code: 1, message: 'User denied' });

    await expect(resolveOrigin({ kind: 'current' })).resolves.toEqual({
      error: 'Location access is blocked for this site.',
    });
  });
});

describe('address suggestions (DAWA)', () => {
  const street = { type: 'vejnavn', tekst: 'Vestergade ', forslagstekst: 'Vestergade', data: {} };
  const address = {
    type: 'adgangsadresse',
    tekst: 'Vestergade 1, , 5000 Odense C',
    forslagstekst: 'Vestergade 1, 5000 Odense C',
    data: { id: 'a1', x: ODENSE.lon, y: ODENSE.lat },
  };

  it('maps streets to "keep typing" and addresses to coordinates (x is lon, y is lat)', () => {
    expect(toAddressSuggestion(street)).toEqual({
      kind: 'street',
      label: 'Vestergade',
      completion: 'Vestergade ',
    });
    expect(toAddressSuggestion(address)).toEqual({
      kind: 'address',
      id: 'a1',
      label: 'Vestergade 1, 5000 Odense C',
      coordinates: ODENSE,
    });
    expect(toAddressSuggestion({ ...address, data: { id: 'a2' } })).toBeNull();
  });

  describe('suggest', () => {
    const realFetch = global.fetch;
    afterEach(() => {
      global.fetch = realFetch;
    });

    it('asks for access addresses matching the text', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [street, address],
      });
      global.fetch = fetchMock;

      const suggestions = await backendAddresses.suggest(' vestergade 1 ');

      expect(suggestions.map((s) => s.kind)).toEqual(['street', 'address']);
      const url = new URL(fetchMock.mock.calls[0][0]);
      expect(url.searchParams.get('q')).toBe('vestergade 1');
      expect(url.searchParams.get('type')).toBe('adgangsadresse');
    });

    it('does not ask for empty text, and reports a failing service', async () => {
      const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 503 });
      global.fetch = fetchMock;

      await expect(backendAddresses.suggest('  ')).resolves.toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();

      await expect(backendAddresses.suggest('vesterg')).rejects.toThrow(ApiError);
    });
  });
});

/** the location on each result card, in order */
function resultLocations() {
  return screen.queryAllByTestId('car-location').map((node) => node.props.children);
}

async function openHomeAsGuest() {
  await render(<App />);
  await fireEvent.press(screen.getByText('Continue as guest'));
  await waitFor(() => expect(screen.getByText('Search cars')).toBeTruthy());
}

describe('search from home', () => {
  it('searches from the current location by default', async () => {
    await openHomeAsGuest();
    expect(screen.getByText('Current location')).toBeTruthy();

    await fireEvent.press(screen.getByText('Search cars'));

    expect(await screen.findByText('Closest to your current location')).toBeTruthy();
    await waitFor(() => expect(resultLocations()[0]).toBe('Aarhus C'));
    expect(resultLocations()).toHaveLength(FIXTURE_CARS.length);
    // every listing says how far it is from the selected location
    expect(screen.getAllByText(/ km away$/)).toHaveLength(FIXTURE_CARS.length);
    expect(screen.getByText('0.0 km away')).toBeTruthy();
  });

  it('autocompletes an address, street first, then searches nearest to it', async () => {
    mockSuggest.mockImplementation(async (text: string) =>
      text.includes('1')
        ? [
            {
              kind: 'address',
              id: 'a1',
              label: 'Boulevarden 1, 9000 Aalborg',
              coordinates: AALBORG,
            },
          ]
        : [{ kind: 'street', label: 'Boulevarden', completion: 'Boulevarden ' }],
    );
    await openHomeAsGuest();

    await fireEvent.press(screen.getByText('Current location'));
    const input = screen.getByPlaceholderText('Address, city, station or airport');
    await fireEvent.changeText(input, 'boulev');

    // picking the street fills it in, so the house number can be typed
    await fireEvent.press(await screen.findByText('Boulevarden …'));
    expect(input.props.value).toBe('Boulevarden ');

    await fireEvent.changeText(input, 'Boulevarden 1');
    await fireEvent.press(await screen.findByText('Boulevarden 1, 9000 Aalborg'));
    expect(screen.getByText('Boulevarden 1, 9000 Aalborg')).toBeTruthy(); // now in the field

    await fireEvent.press(screen.getByText('Search cars'));

    expect(await screen.findByText('Closest to Boulevarden 1, 9000 Aalborg')).toBeTruthy();
    await waitFor(() => expect(resultLocations()[0]).toBe('Aalborg'));
    expect(screen.getAllByText(/ km away$/)).toHaveLength(FIXTURE_CARS.length);
    // an address is already located, so the device location is never asked for
    expect(location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it('keeps the tab bar on the results, and the Booking tab goes back to the search', async () => {
    await openHomeAsGuest();
    await fireEvent.press(screen.getByText('Search cars'));
    await waitFor(() => expect(resultLocations()).toHaveLength(FIXTURE_CARS.length));

    expect(screen.getByText('My Rentals')).toBeTruthy();
    await fireEvent.press(screen.getByText('Booking'));

    await waitFor(() => expect(resultLocations()).toHaveLength(0));
    expect(screen.getByText('Search cars')).toBeTruthy();
  });

  it('only lists providers that accept the driver age', async () => {
    await openHomeAsGuest();
    // only Avis (18+) takes a 20-year-old; Europcar, Hertz and Sixt need 21+
    await fireEvent.changeText(screen.getByLabelText('Driver age'), '20');

    await fireEvent.press(screen.getByText('Search cars'));

    expect(await screen.findByText('Providers accepting a driver aged 20')).toBeTruthy();
    await waitFor(() => expect(resultLocations()).toEqual(['Aalborg']));
    expect(screen.getByText('Driver 18+')).toBeTruthy();
  });

  it('will not search with an invalid driver age', async () => {
    await openHomeAsGuest();

    await fireEvent.changeText(screen.getByLabelText('Driver age'), '17');

    expect(screen.getByText('Enter a driver age between 18 and 99.')).toBeTruthy();
    await fireEvent.press(screen.getByText('Search cars'));
    // still on Home: the results screen never opened
    expect(screen.queryByText(/^Finding /)).toBeNull();
    expect(location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it('picks the rental period in the calendar', async () => {
    await openHomeAsGuest();
    const pickupDate = screen.getByLabelText('Pick-up date');
    const returnDate = screen.getByLabelText('Return date');
    const day = (offset: number) => formatDay(addDays(new Date(), offset));

    // defaults: tomorrow and four days from now
    expect(within(pickupDate).getByText(day(1))).toBeTruthy();
    expect(within(returnDate).getByText(day(4))).toBeTruthy();

    await fireEvent.press(returnDate);
    expect(screen.getByText('3 days rental')).toBeTruthy();

    // yesterday cannot be picked (the calendar starts at this month, so on the
    // 1st yesterday is not shown at all)
    const yesterday = addDays(new Date(), -1);
    if (yesterday.slice(0, 7) === addDays(new Date(), 0).slice(0, 7)) {
      expect(screen.getByLabelText(day(-1))).toBeDisabled();
    }

    // first tap starts a new range, second tap ends it
    await fireEvent.press(screen.getByLabelText(day(2)));
    expect(screen.getByText('Select a return date')).toBeTruthy();
    // a day before the pick-up starts over instead of ending the range backwards
    await fireEvent.press(screen.getByLabelText(day(0)));
    await fireEvent.press(screen.getByLabelText(day(7)));
    expect(screen.getByText('7 days rental')).toBeTruthy();

    await fireEvent.press(screen.getByText('Confirm dates'));

    expect(within(pickupDate).getByText(day(0))).toBeTruthy();
    expect(within(returnDate).getByText(day(7))).toBeTruthy();
  });

  it('chooses times next to the dates in the calendar, without changing the day count', async () => {
    await openHomeAsGuest();
    const pickupBox = screen.getByLabelText('Pick-up date');
    const returnBox = screen.getByLabelText('Return date');
    const day = (offset: number) => formatDay(addDays(new Date(), offset));

    // the home boxes show each date with its time underneath
    expect(within(pickupBox).getByText('10:00')).toBeTruthy();
    expect(within(returnBox).getByText('10:00')).toBeTruthy();

    await fireEvent.press(pickupBox);
    // the time sits next to the date in the sheet; tapping it swaps in the slots
    await fireEvent.press(screen.getByLabelText('Pick-up time'));
    expect(screen.queryByText('Mo')).toBeNull(); // calendar is hidden meanwhile
    await fireEvent.press(screen.getByLabelText('14:30'));

    // back on the calendar, still counted in whole days
    expect(screen.getByText('Mo')).toBeTruthy();
    expect(within(screen.getByLabelText('Pick-up time')).getByText('14:30')).toBeTruthy();
    expect(screen.getByText('3 days rental')).toBeTruthy();

    // a same-day rental with return 10:00 before pick-up 14:30 is flagged
    await fireEvent.press(screen.getByLabelText(day(2)));
    await fireEvent.press(screen.getByLabelText(day(2)));
    expect(screen.getByText('1 day rental')).toBeTruthy();
    expect(screen.getByText('The return time is before the pick-up time.')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('Return time'));
    await fireEvent.press(screen.getByLabelText('18:00'));
    expect(screen.queryByText('The return time is before the pick-up time.')).toBeNull();

    await fireEvent.press(screen.getByText('Confirm dates'));

    expect(within(pickupBox).getByText(day(2))).toBeTruthy();
    expect(within(pickupBox).getByText('14:30')).toBeTruthy();
    expect(within(returnBox).getByText('18:00')).toBeTruthy();
  });

  it('drops unconfirmed changes when the calendar is closed', async () => {
    await openHomeAsGuest();
    const pickupBox = screen.getByLabelText('Pick-up date');

    await fireEvent.press(pickupBox);
    await fireEvent.press(screen.getByLabelText('Pick-up time'));
    await fireEvent.press(screen.getByLabelText('07:00'));
    await fireEvent.press(screen.getByLabelText('Close'));

    expect(within(pickupBox).getByText('10:00')).toBeTruthy();
  });

  it('filters the results on separate fields loaded from the api', async () => {
    await openHomeAsGuest();
    await fireEvent.press(screen.getByText('Search cars'));
    await waitFor(() => expect(resultLocations()).toHaveLength(FIXTURE_CARS.length));

    await waitFor(() => expect(screen.getByLabelText('Filters')).toBeEnabled());
    await fireEvent.press(screen.getByLabelText('Filters'));
    // every option comes from api.cars.filterOptions
    expect(await screen.findByLabelText('Brand: Volvo')).toBeTruthy();
    expect(screen.getByLabelText('Provider: Europcar')).toBeTruthy();
    expect(screen.getByLabelText('Car type: VAN')).toBeTruthy();
    expect(screen.getByText('210–810 kr on offer')).toBeTruthy();

    // two brands, and manual only: the Aygo and the Transit
    await fireEvent.press(screen.getByLabelText('Brand: Toyota'));
    await fireEvent.press(screen.getByLabelText('Brand: Ford'));
    expect(screen.getByLabelText('Brand: Toyota')).toBeChecked();
    await fireEvent.press(screen.getByLabelText('Transmission: Manual'));
    await fireEvent.press(screen.getByText('Apply filters'));

    await waitFor(() => expect(resultLocations().sort()).toEqual(['Aarhus N', 'Odense']));
    expect(screen.getByLabelText('Filters, 2 in use')).toBeTruthy();

    // add a price cap that only the Aygo (210 kr) fits
    await fireEvent.press(screen.getByLabelText('Filters, 2 in use'));
    await fireEvent.changeText(screen.getByLabelText('Maximum price per day'), '300');
    await fireEvent.press(screen.getByText('Apply filters'));
    await waitFor(() => expect(resultLocations()).toEqual(['Odense']));

    await fireEvent.press(screen.getByLabelText('Filters, 3 in use'));
    await fireEvent.press(screen.getByText('Reset'));
    await waitFor(() => expect(resultLocations()).toHaveLength(FIXTURE_CARS.length));
  });

  it('lists all cars, and says why, when the location cannot be had', async () => {
    location.requestForegroundPermissionsAsync.mockResolvedValue(permission(false));
    await openHomeAsGuest();

    await fireEvent.press(screen.getByText('Search cars'));

    expect(
      await screen.findByText('Location permission was denied. Showing all cars.'),
    ).toBeTruthy();
    await waitFor(() => expect(resultLocations()).toHaveLength(FIXTURE_CARS.length));
    // no location, so no distances
    expect(screen.queryAllByText(/ km away$/)).toHaveLength(0);
  });
});
