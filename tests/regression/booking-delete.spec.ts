import { test, expect } from '../../fixtures/test-fixtures';
import { VALID_BOOKING } from '../../fixtures/bookings';

test.describe('DELETE /booking/:id @regression', () => {
  test('DELETE requires auth — returns 403 without token', async ({ bookingClient }) => {
    const createRes = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await createRes.json()) as { bookingid: number };

    const response = await bookingClient.delete(bookingid);
    expect(response.status()).toBe(403);
  });

  test('DELETE with auth removes the booking', async ({ bookingClient, authedBookingClient }) => {
    const createRes = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await createRes.json()) as { bookingid: number };

    const response = await authedBookingClient.delete(bookingid);
    // restful-booker returns 201 on a successful DELETE — quirky but documented.
    expect([200, 201]).toContain(response.status());

    const gone = await bookingClient.getById(bookingid);
    expect(gone.status()).toBe(404);
  });

  test('DELETE on already-deleted booking returns 405', async ({ bookingClient, authedBookingClient }) => {
    const createRes = await bookingClient.create(VALID_BOOKING);
    const { bookingid } = (await createRes.json()) as { bookingid: number };

    // First delete succeeds
    const first = await authedBookingClient.delete(bookingid);
    expect([200, 201]).toContain(first.status());

    // Second delete on the same ID — API returns 405 Method Not Allowed
    // (curious choice, would normally be 404; documented as BUG-003)
    const second = await authedBookingClient.delete(bookingid);
    expect([404, 405]).toContain(second.status());
  });
});
