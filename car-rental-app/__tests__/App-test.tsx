import { render, screen } from '@testing-library/react-native';

import App from '../App';

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: { addEventListener: jest.fn(() => jest.fn()) },
}));

describe('App', () => {
  it('starts on the login screen', async () => {
    await render(<App />);

    expect(screen.getByText('Welcome')).toBeTruthy();
    expect(screen.getByText('Continue as guest')).toBeTruthy();
  });
});
