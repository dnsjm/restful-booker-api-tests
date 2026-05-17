import { test, expect } from '../../fixtures/test-fixtures';
import { VALID_BOOKING, makeBooking } from '../../fixtures/bookings';

test.describe('PUT /booking/:id @regression', () => {
  test('PUT requires auth — returns 403 without token', async ({ bookingClient }) => {
    const createRes = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await createRes.json()) as { bookingid: number };

    const updated = makeBooking({ firstname: 'NoAuth' });
    const response = await bookingClient.update(bookingid, updated);
    expect(response.status()).toBe(403);
  });

  test('PUT with auth fully replaces the booking', async ({ bookingClient, authedBookingClient }) => {
    const createRes = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await createRes.json()) as { bookingid: number };

    const replacement = makeBooking({
      firstname: 'Replaced',
      lastname: 'Booking',
      totalprice: 500,
      depositpaid: false,
    });

    const response = await authedBookingClient.update(bookingid, replacement);
    expect(response.status()).toBe(200);

    const body = (await response.json()) as typeof replacement;
    expect(body.firstname).toBe('Replaced');
    expect(body.lastname).toBe('Booking');
    expect(body.totalprice).toBe(500);
    expect(body.depositpaid).toBe(false);
  });
});

test.describe('PATCH /booking/:id @regression', () => {
  test('PATCH requires auth — returns 403 without token', async ({ bookingClient }) => {
    const createRes = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await createRes.json()) as { bookingid: number };

    const response = await bookingClient.patch(bookingid, { firstname: 'NoAuth' });
    expect(response.status()).toBe(403);
  });

  test('PATCH with auth updates only specified fields', async ({ bookingClient, authedBookingClient }) => {
    const createRes = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await createRes.json()) as { bookingid: number };

    const response = await authedBookingClient.patch(bookingid, { firstname: 'Patched' });
    expect(response.status()).toBe(200);

    const body = (await response.json()) as typeof VALID_BOOKING;
    expect(body.firstname).toBe('Patched');
    // Unchanged fields should remain
    expect(body.lastname).toBe(VALID_BOOKING.lastname);
    expect(body.totalprice).toBe(VALID_BOOKING.totalprice);
  });

  test('PATCH with empty body leaves the booking unchanged', async ({ bookingClient, authedBookingClient }) => {
    const createRes = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await createRes.json()) as { bookingid: number };

    const response = await authedBookingClient.patch(bookingid, {});
    expect(response.status()).toBe(200);

    const body = (await response.json()) as typeof VALID_BOOKING;
    expect(body.firstname).toBe(VALID_BOOKING.firstname);
    expect(body.lastname).toBe(VALID_BOOKING.lastname);
  });
});
