import type { BookingPayload } from '../api/BookingClient';

export const VALID_BOOKING: BookingPayload = {
  firstname: 'JM',
  lastname: 'Dionisio',
  totalprice: 250,
  depositpaid: true,
  bookingdates: {
    checkin: '2026-06-01',
    checkout: '2026-06-05',
  },
  additionalneeds: 'Late check-in',
};

export function makeBooking(overrides: Partial<BookingPayload> = {}): BookingPayload {
  return { ...VALID_BOOKING, ...overrides };
}

/**
 * Negative-test payloads the API *correctly* rejects.
 * These should always return a 4xx/5xx response.
 */
export const INVALID_PAYLOADS: Array<{
  case: string;
  payload: unknown;
  expectStatus: number[];
}> = [
  {
    case: 'missing firstname',
    payload: {
      lastname: 'Dionisio',
      totalprice: 100,
      depositpaid: true,
      bookingdates: { checkin: '2026-06-01', checkout: '2026-06-02' },
    },
    expectStatus: [400, 500],
  },
  {
    case: 'missing all required fields',
    payload: {},
    expectStatus: [400, 500],
  },
];

/**
 * Payloads the API *should* reject but currently accepts with a 200 OK.
 * Tracked as BUG-007 in docs/BUGS-DISCOVERED.md. Tests use `test.fail()`
 * so a future fix surfaces immediately as a regression-of-the-bug-fix.
 */
export const PERMISSIVELY_ACCEPTED_PAYLOADS: Array<{
  case: string;
  payload: unknown;
}> = [
  {
    case: 'totalprice as string (should be rejected, currently coerced)',
    payload: { ...VALID_BOOKING, totalprice: 'not-a-number' },
  },
  {
    case: 'depositpaid as string (should be rejected, currently coerced)',
    payload: { ...VALID_BOOKING, depositpaid: 'yes' },
  },
];

/**
 * Response-time budgets in milliseconds. The free Heroku instance can be
 * cold-started, so these are intentionally generous.
 */
export const PERFORMANCE_BUDGETS = {
  ping: 3000,
  auth: 4000,
  bookingRead: 4000,
  bookingCreate: 5000,
} as const;
