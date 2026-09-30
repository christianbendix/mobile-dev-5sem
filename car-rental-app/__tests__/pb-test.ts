import { POCKETBASE_URL, checkConnection, pb } from '../src/lib/pb';

// fake /api/health response
const healthResponse = () =>
  new Response(JSON.stringify({ code: 200, message: 'API is healthy.', data: {} }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

describe('PocketBase connection', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('configures the client with the PocketBase base URL', () => {
    expect(pb.baseURL).toBe(POCKETBASE_URL);
  });

  it('reports a healthy instance as connected', async () => {
    const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(healthResponse());

    await expect(checkConnection()).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toBe(`${POCKETBASE_URL}/api/health`);
  });

  it('reports an unreachable instance as not connected', async () => {
    jest.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Network request failed'));

    await expect(checkConnection()).resolves.toBe(false);
  });
});
