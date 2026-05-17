import { test as base, expect } from '@playwright/test';
import { AuthClient } from '../api/AuthClient';
import { BookingClient } from '../api/BookingClient';
import { ADMIN_CREDENTIALS } from './auth';

type Fixtures = {
  authClient: AuthClient;
  bookingClient: BookingClient;
  authedBookingClient: BookingClient;
  token: string;
};

/**
 * Custom Playwright fixtures for API tests.
 * - `authClient` / `bookingClient` — plain unauthenticated clients
 * - `token` — fresh admin token, scoped per-test for isolation
 * - `authedBookingClient` — BookingClient pre-loaded with the admin token
 */
export const test = base.extend<Fixtures>({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },

  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  token: async ({ request }, use) => {
    const auth = new AuthClient(request);
    const token = await auth.login(ADMIN_CREDENTIALS);
    await use(token);
  },

  authedBookingClient: async ({ request, token }, use) => {
    const client = new BookingClient(request);
    client.setToken(token);
    await use(client);
  },
});

export { expect };
