import { test, expect } from '../../fixtures/test-fixtures';
import { VALID_BOOKING, makeBooking } from '../../fixtures/bookings';
import { bookingCreatedSchema, bookingSchema } from '../../schemas/booking.schema';
import { expectMatchesSchema } from '../../schemas/validator';

test.describe('Booking lifecycle @smoke', () => {
  test('full CRUD: create → read → update → delete', async ({ bookingClient, authedBookingClient }) => {
    // 1. Create
    const createRes = await bookingClient.create(VALID_BOOKING);
    expect(createRes.status()).toBe(200);
    const created = await createRes.json();
    expectMatchesSchema(created, bookingCreatedSchema, 'create response');
    const { bookingid } = created as { bookingid: number };

    // 2. Read
    const readRes = await bookingClient.getById(bookingid);
    expect(readRes.status()).toBe(200);
    const fetched = await readRes.json();
    expectMatchesSchema(fetched, bookingSchema, 'fetched booking');
    expect((fetched as { firstname: string }).firstname).toBe(VALID_BOOKING.firstname);

    // 3. Update (PUT requires auth)
    const updated = makeBooking({ firstname: 'Updated' });
    const updateRes = await authedBookingClient.update(bookingid, updated);
    expect(updateRes.status()).toBe(200);
    const updatedBody = await updateRes.json();
    expect((updatedBody as { firstname: string }).firstname).toBe('Updated');

    // 4. Delete
    const deleteRes = await authedBookingClient.delete(bookingid);
    // restful-booker returns 201 on successful delete (also unusual — see BUG-002)
    expect([200, 201]).toContain(deleteRes.status());

    // 5. Confirm deletion: subsequent GET should 404
    const gone = await bookingClient.getById(bookingid);
    expect(gone.status()).toBe(404);
  });

  test('GET /booking returns an array of booking IDs', async ({ bookingClient }) => {
    const response = await bookingClient.list();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('bookingid');
  });
});
