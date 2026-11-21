import { APIRequestContext, APIResponse } from '@playwright/test';
import { Booking } from '../helpers/data';

// Action class: wraps the Restful-Booker endpoints. No assertions here —
// tests decide what a response means, this class only knows how to call the API.
export class BookingApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async createToken(username: string, password: string): Promise<string> {
    const res = await this.request.post('/auth', { data: { username, password } });
    const body = await res.json();
    return body.token;
  }

  async createBooking(payload: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: payload });
  }

  async getBooking(bookingId: number): Promise<APIResponse> {
    return this.request.get(`/booking/${bookingId}`);
  }

  async updateBooking(bookingId: number, token: string, payload: Booking): Promise<APIResponse> {
    return this.request.put(`/booking/${bookingId}`, {
      data: payload,
      headers: { Cookie: `token=${token}` },
    });
  }

  async deleteBooking(bookingId: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
  }
}
