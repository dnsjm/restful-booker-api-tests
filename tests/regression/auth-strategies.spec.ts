import { test, expect } from '../../fixtures/test-fixtures';
import { VALID_BOOKING } from '../../fixtures/bookings';
import { ADMIN_CREDENTIALS } from '../../fixtures/auth';

/**
 * restful-booker supports two auth strategies for mutating endpoints:
 *   1. Cookie header:    Cookie: token=<token>
 *   2. Basic auth:       Authorization: Basic base64(user:pass)
 *
 * Both should yield the same authorization outcome. Inconsistencies are
 * common in dual-strategy APIs, so we test both explicitly.
 */
test.describe('Auth strategies @regression', () => {
  test('Cookie-based auth is accepted on PUT', async ({ request, authClient, bookingClient }) => {
    const token = await authClient.login(ADMIN_CREDENTIALS);
    const created = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await created.json()) as { bookingid: number };

    const response = await request.put(`/booking/${bookingid}`, {
      data: { ...VALID_BOOKING, firstname: 'CookieAuth' },
      headers: { Cookie: `token=${token}` },
    });

    expect(response.status()).toBe(200);
  });

  test('Basic auth is accepted on PUT', async ({ request, bookingClient }) => {
    const created = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await created.json()) as { bookingid: number };

    const basic = Buffer.from(`${ADMIN_CREDENTIALS.username}:${ADMIN_CREDENTIALS.password}`).toString('base64');
    const response = await request.put(`/booking/${bookingid}`, {
      data: { ...VALID_BOOKING, firstname: 'BasicAuth' },
      headers: { Authorization: `Basic ${basic}` },
    });

    expect(response.status()).toBe(200);
  });
});
