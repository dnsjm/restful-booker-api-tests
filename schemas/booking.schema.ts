import type { JSONSchemaType } from 'ajv';
import type {
  BookingPayload,
  BookingCreatedResponse,
} from '../api/BookingClient';

export const bookingDatesSchema = {
  type: 'object',
  properties: {
    checkin: { type: 'string', format: 'date' },
    checkout: { type: 'string', format: 'date' },
  },
  required: ['checkin', 'checkout'],
  additionalProperties: false,
} as const;

export const bookingSchema: JSONSchemaType<BookingPayload> = {
  type: 'object',
  properties: {
    firstname: { type: 'string', minLength: 1 },
    lastname: { type: 'string', minLength: 1 },
    totalprice: { type: 'number' },
    depositpaid: { type: 'boolean' },
    bookingdates: {
      type: 'object',
      properties: {
        checkin: { type: 'string' },
        checkout: { type: 'string' },
      },
      required: ['checkin', 'checkout'],
      additionalProperties: false,
    },
    additionalneeds: { type: 'string', nullable: true },
  },
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  additionalProperties: false,
};

export const bookingCreatedSchema: JSONSchemaType<BookingCreatedResponse> = {
  type: 'object',
  properties: {
    bookingid: { type: 'integer' },
    booking: bookingSchema,
  },
  required: ['bookingid', 'booking'],
  additionalProperties: false,
};

export interface BookingIdEntry {
  bookingid: number;
}

export const bookingIdListSchema: JSONSchemaType<BookingIdEntry[]> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      bookingid: { type: 'integer' },
    },
    required: ['bookingid'],
    additionalProperties: false,
  },
};
