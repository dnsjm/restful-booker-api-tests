import { test, expect } from '../../fixtures/test-fixtures';
import { INVALID_PAYLOADS, VALID_BOOKING, makeBooking } from '../../fixtures/bookings';
import { bookingCreatedSchema } from '../../schemas/booking.schema';
import { expectMatchesSchema } from '../../schemas/validator';

test.describe('POST /booking — happy paths @regression', () => {
  test('creates a booking with all required fields', async ({ bookingClient }) => {
    const response = await bookingClient.create(VALID_BOOKING);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expectMatchesSchema(body, bookingCreatedSchema, 'create booking');
    expect((body as { booking: { firstname: string } }).booking.firstname).toBe(VALID_BOOKING.firstname);
  });

  test('creates a booking without optional additionalneeds', async ({ bookingClient }) => {
    const booking = makeBooking({ additionalneeds: undefined });
    delete (booking as Partial<typeof booking>).additionalneeds;

    const response = await bookingClient.create(booking);
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { bookingid: number };
    expect(typeof body.bookingid).toBe('number');
  });

  test('handles large totalprice values', async ({ bookingClient }) => {
    const response = await bookingClient.create(makeBooking({ totalprice: 999999 }));
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { booking: { totalprice: number } };
    expect(body.booking.totalprice).toBe(999999);
  });
});

test.describe('POST /booking — input validation @regression', () => {
  // restful-booker is famously permissive — these tests document the *actual*
  // behavior (often a 500) rather than asserting an idealized 400. The point
  // is to catch any regression where the API silently starts accepting
  // malformed input as valid.
  for (const { case: scenario, payload, expectStatus } of INVALID_PAYLOADS) {
    test(`rejects: ${scenario}`, async ({ request }) => {
      const response = await request.post('/booking', { data: payload });
      expect(
        expectStatus,
        `expected one of ${expectStatus.join(', ')} but got ${response.status()} — ` +
          `if this is now a 200, restful-booker's input validation changed. ` +
          `Document in BUGS-DISCOVERED.md.`,
      ).toContain(response.status());
    });
  }
});
