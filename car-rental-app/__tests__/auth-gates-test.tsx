import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import App from '../App';
import { fixtureBookings } from '../src/api/fixtures';
import { FIXTURE_CARS } from '../src/api/fixtures/data';
import { addDays } from '../src/utils/searchInput';

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: { addEventListener: jest.fn(() => jest.fn()) },
}));

const mockLogin = jest.fn();

// Only auth is stubbed. The car and booking queries run against the real
// fixture implementation whatever DATA_SOURCE says, so these tests exercise the
// actual API layer without needing the server.
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
      auth: {
        ...actual.api.auth,
        // read lazily: this factory runs before `mockLogin` is initialised
        login: (identity: string, password: string) => mockLogin(identity, password),
      },
    },
  };
});

const TEST_USER = { id: 'user-1', name: 'admin', email: 'admin@testuser.com' };

/** cheapest car, which is what Home lists first */
const FIRST_OFFER = [...FIXTURE_CARS].sort((a, b) => a.pricePerDay - b.pricePerDay)[0];

async function logIn() {
  await fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), TEST_USER.email);
  await fireEvent.changeText(screen.getByPlaceholderText('Password'), '12345678');
  await fireEvent.press(screen.getByText('Log in'));
}

beforeEach(() => {
  mockLogin.mockReset();
  mockLogin.mockResolvedValue(TEST_USER);
});

describe('login screen', () => {
  it('stays put and shows an error when the credentials are refused', async () => {
    const { ApiError } = jest.requireActual('../src/api');
    mockLogin.mockRejectedValue(new ApiError('unauthorized', 'Wrong email or password.', 400));
    await render(<App />);

    await logIn();

    expect(await screen.findByText('Wrong email or password.')).toBeTruthy();
    // still on the login screen
    expect(screen.getByText('Continue as guest')).toBeTruthy();
  });

  it('goes to the tabs on a successful login', async () => {
    await render(<App />);

    await logIn();

    expect(await screen.findByText('Search cars')).toBeTruthy();
  });
});

describe('guarded tabs', () => {
  it('gates Bookings and Account behind login for a guest', async () => {
    await render(<App />);
    await fireEvent.press(screen.getByText('Continue as guest'));

    await waitFor(() => expect(screen.getByText('Search cars')).toBeTruthy());

    await fireEvent.press(screen.getByText('My Rentals'));
    expect(await screen.findByText('Log in to see your bookings.')).toBeTruthy();

    await fireEvent.press(screen.getByText('Profile'));
    expect(await screen.findByText('Log in to see your account.')).toBeTruthy();
  });
});

describe('profile', () => {
  it('shows the user, opens their details and logs out', async () => {
    await render(<App />);
    await logIn();
    await waitFor(() => expect(screen.getByText('Search cars')).toBeTruthy());

    await fireEvent.press(screen.getByText('Profile'));

    expect(await screen.findByText(TEST_USER.email)).toBeTruthy();
    // no bookings yet, once they have loaded: upcoming, completed and the My rentals row
    await waitFor(() => expect(screen.getAllByText('0')).toHaveLength(3));
    expect(screen.queryByText('Account ID')).toBeNull();

    await fireEvent.press(screen.getByText('Personal details'));
    expect(screen.getByText('Account ID')).toBeTruthy();
    expect(screen.getByText(TEST_USER.id)).toBeTruthy();

    await fireEvent.press(screen.getByText('Log out'));
    expect(await screen.findByText('Log in to see your account.')).toBeTruthy();
  });
});

// runs after 'profile', which expects no bookings yet: the fixture store is shared
describe('my rentals', () => {
  it('shows an empty state, then a booking as an upcoming card', async () => {
    await render(<App />);
    await logIn();
    await waitFor(() => expect(screen.getByText('Search cars')).toBeTruthy());

    await fireEvent.press(screen.getByText('My Rentals'));
    expect(await screen.findByText('No upcoming rentals')).toBeTruthy();

    await fixtureBookings.create({
      carId: FIRST_OFFER.id,
      startDate: addDays(new Date(), 3),
      endDate: addDays(new Date(), 5),
      fullName: 'Admin',
      phone: '12345678',
    });
    // the list refetches when the tab is focused again
    await fireEvent.press(screen.getByText('Profile'));
    await fireEvent.press(screen.getByText('My Rentals'));

    expect(await screen.findByText('Confirmed · in 3 days')).toBeTruthy();
    expect(screen.getByText(FIRST_OFFER.name)).toBeTruthy();
    expect(screen.getByLabelText(`Directions to ${FIRST_OFFER.location}`)).toBeTruthy();

    await fireEvent.press(screen.getByText('View car'));
    expect(await screen.findByLabelText(`${FIRST_OFFER.pricePerDay} kr per day`)).toBeTruthy();
  });
});

describe('booking gate', () => {
  it('redirects a guest to login and returns to the same car afterwards', async () => {
    await render(<App />);

    await fireEvent.press(screen.getByText('Continue as guest'));
    await waitFor(() => expect(screen.getByText('Search cars')).toBeTruthy());

    // Home -> Preview -> Actual booking
    await fireEvent.press(await screen.findByText(FIRST_OFFER.name));
    expect(await screen.findByLabelText(`${FIRST_OFFER.pricePerDay} kr per day`)).toBeTruthy();
    await fireEvent.press(screen.getByText('Book'));

    // the gate bounced us to login, with the reason shown
    expect(await screen.findByText('Log in to finish your booking.')).toBeTruthy();

    await logIn();

    // straight back to the booking form for the same car
    expect(await screen.findByText(`Booking ${FIRST_OFFER.name}`)).toBeTruthy();
  });
});
