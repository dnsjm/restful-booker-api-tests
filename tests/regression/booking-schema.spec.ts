import { test, expect } from '../../fixtures/test-fixtures';
import { VALID_BOOKING } from '../../fixtures/bookings';
import { bookingCreatedSchema, bookingSchema, bookingIdListSchema } from '../../schemas/booking.schema';
import { authTokenSchema } from '../../schemas/auth.schema';
import { expectMatchesSchema } from '../../schemas/validator';
import { ADMIN_CREDENTIALS } from '../../fixtures/auth';

/**
 * Contract-style tests. These exist purely to detect when the API's response
 * shape drifts away from the documented contract — a class of bug that
 * field-by-field assertions can miss.
 */
test.describe('Schema validation @regression', () => {
  test('auth response matches the documented schema', async ({ authClient }) => {
    const response = await authClient.createToken(ADMIN_CREDENTIALS);
    expectMatchesSchema(await response.json(), authTokenSchema, 'auth');
  });

  test('GET /booking response matches the booking-id list schema', async ({ bookingClient }) => {
    const response = await bookingClient.list();
    expectMatchesSchema(await response.json(), bookingIdListSchema, 'booking list');
  });

  test('POST /booking response matches the created-booking schema', async ({ bookingClient }) => {
    const response = await bookingClient.create(VALID_BOOKING);
    expectMatchesSchema(await response.json(), bookingCreatedSchema, 'create booking');
  });

  test('GET /booking/:id response matches the booking schema', async ({ bookingClient }) => {
    const createRes = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await createRes.json()) as { bookingid: number };
    const response = await bookingClient.getById(bookingid);
    expectMatchesSchema(await response.json(), bookingSchema, 'get booking');
  });
});
