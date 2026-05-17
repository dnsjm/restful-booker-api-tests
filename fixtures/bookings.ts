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
 * Negative-test payloads. `case` describes the scenario, `payload` is the
 * intentionally-bad body, `expectStatus` documents what we expect from the API.
 *
 * Note: restful-booker is permissive with malformed input — many of these
 * still return 200 instead of 4xx. See docs/BUGS-DISCOVERED.md.
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
  {
    case: 'totalprice as string',
    payload: {
      ...VALID_BOOKING,
      totalprice: 'not-a-number',
    },
    expectStatus: [400, 500],
  },
  {
    case: 'depositpaid as string',
    payload: {
      ...VALID_BOOKING,
      depositpaid: 'yes',
    },
    expectStatus: [400, 500],
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
