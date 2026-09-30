import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import App from '../App';
import { FIXTURE_CARS } from '../src/api/fixtures/data';

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

    await fireEvent.press(screen.getByText('Bookings'));
    expect(await screen.findByText('Log in to see your bookings.')).toBeTruthy();

    await fireEvent.press(screen.getByText('Account'));
    expect(await screen.findByText('Log in to see your account.')).toBeTruthy();
  });
});

describe('booking gate', () => {
  it('redirects a guest to login and returns to the same car afterwards', async () => {
    await render(<App />);

    await fireEvent.press(screen.getByText('Continue as guest'));
    await waitFor(() => expect(screen.getByText('Search cars')).toBeTruthy());

    // Home -> Preview -> Actual booking
    await fireEvent.press(await screen.findByText(FIRST_OFFER.name));
    expect(await screen.findByText(`Price: ${FIRST_OFFER.pricePerDay} kr / day`)).toBeTruthy();
    await fireEvent.press(screen.getByText('Book'));

    // the gate bounced us to login, with the reason shown
    expect(await screen.findByText('Log in to finish your booking.')).toBeTruthy();

    await logIn();

    // straight back to the booking form for the same car
    expect(await screen.findByText(`Booking ${FIRST_OFFER.name}`)).toBeTruthy();
  });
});
