import { test, expect } from '../../fixtures/test-fixtures';
import {
  INVALID_PAYLOADS,
  PERMISSIVELY_ACCEPTED_PAYLOADS,
  VALID_BOOKING,
  makeBooking,
} from '../../fixtures/bookings';
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
  for (const { case: scenario, payload, expectStatus } of INVALID_PAYLOADS) {
    test(`rejects: ${scenario}`, async ({ request }) => {
      const response = await request.post('/booking', { data: payload });
      expect(
        expectStatus,
        `expected one of ${expectStatus.join(', ')} but got ${response.status()}. ` +
          `If this is now a 200, restful-booker's input validation changed — document in BUGS-DISCOVERED.md.`,
      ).toContain(response.status());
    });
  }

  // These payloads SHOULD be rejected but the API currently accepts them with a 200
  // due to JavaScript-style type coercion. Tracked as BUG-007 in BUGS-DISCOVERED.md.
  //
  // `test.fail()` marks these as expected-to-fail: if the API ever fixes the bug
  // and starts returning a 4xx, the test will fail loudly to surface the change.
  for (const { case: scenario, payload } of PERMISSIVELY_ACCEPTED_PAYLOADS) {
    test(`should reject but currently accepts: ${scenario}`, async ({ request }) => {
      test.fail(
        true,
        'Known bug — API currently accepts malformed input with a 200 OK. See BUGS-DISCOVERED.md (BUG-007).',
      );
      const response = await request.post('/booking', { data: payload });
      expect([400, 422, 500]).toContain(response.status());
    });
  }
});
