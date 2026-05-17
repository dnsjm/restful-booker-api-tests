import { APIResponse } from '@playwright/test';
import { BaseClient } from './BaseClient';

export interface BookingDates {
  checkin: string; // YYYY-MM-DD
  checkout: string;
}

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingPartial {
  firstname?: string;
  lastname?: string;
  totalprice?: number;
  depositpaid?: boolean;
  bookingdates?: BookingDates;
  additionalneeds?: string;
}

export interface BookingCreatedResponse {
  bookingid: number;
  booking: BookingPayload;
}

export interface BookingListFilters {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

export class BookingClient extends BaseClient {
  async list(filters?: BookingListFilters): Promise<APIResponse> {
    return this.request.get('/booking', { params: filters as Record<string, string> | undefined });
  }

  async getById(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async create(booking: BookingPayload): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  async update(id: number, booking: BookingPayload): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: this.authHeaders(),
    });
  }

  async patch(id: number, partial: BookingPartial): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      data: partial,
      headers: this.authHeaders(),
    });
  }

  async delete(id: number): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: this.authHeaders(),
    });
  }
}
