import { test, expect } from '../../fixtures/test-fixtures';
import { VALID_BOOKING, makeBooking } from '../../fixtures/bookings';
import { bookingIdListSchema, bookingSchema } from '../../schemas/booking.schema';
import { expectMatchesSchema } from '../../schemas/validator';

test.describe('GET /booking — listing and filters @regression', () => {
  test('GET /booking returns a schema-valid array', async ({ bookingClient }) => {
    const response = await bookingClient.list();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expectMatchesSchema(body, bookingIdListSchema, 'booking id list');
  });

  test('filters by firstname return matching bookings', async ({ bookingClient }) => {
    // Seed a booking with a known-unique name
    const uniqueName = `Test${Date.now()}`;
    await bookingClient.create(makeBooking({ firstname: uniqueName }));

    const response = await bookingClient.list({ firstname: uniqueName });
    expect(response.status()).toBe(200);
    const ids = (await response.json()) as Array<{ bookingid: number }>;
    expect(ids.length).toBeGreaterThan(0);
  });

  test('filters by lastname return matching bookings', async ({ bookingClient }) => {
    const uniqueName = `Last${Date.now()}`;
    await bookingClient.create(makeBooking({ lastname: uniqueName }));

    const response = await bookingClient.list({ lastname: uniqueName });
    expect(response.status()).toBe(200);
    const ids = (await response.json()) as Array<{ bookingid: number }>;
    expect(ids.length).toBeGreaterThan(0);
  });
});

test.describe('GET /booking/:id — single booking @regression', () => {
  test('returns a schema-valid booking for a real ID', async ({ bookingClient }) => {
    const createRes = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await createRes.json()) as { bookingid: number };

    const response = await bookingClient.getById(bookingid);
    expect(response.status()).toBe(200);
    expectMatchesSchema(await response.json(), bookingSchema, 'single booking');
  });

  test('returns 404 for non-existent ID', async ({ bookingClient }) => {
    const response = await bookingClient.getById(999_999_999);
    expect(response.status()).toBe(404);
  });
});
