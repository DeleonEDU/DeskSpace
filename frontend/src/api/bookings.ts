import { apiClient } from './client';
import type { Booking, BookingRequest } from '../types';

export const bookingsApi = {
  // GET /api/bookings/bookings/
  getMyBookings: () =>
    apiClient.get<Booking[]>('/api/bookings/bookings/').then((r) => r.data),

  createBooking: (payload: BookingRequest) =>
    apiClient.post<Booking>('/api/bookings/bookings/', payload).then((r) => r.data),

  cancelBooking: (id: number) =>
    apiClient.patch<Booking>(`/api/bookings/bookings/${id}/`, { status: 'cancelled' }).then((r) => r.data),

  // Returns booked space IDs for a given date/floor — used to mark spaces as booked on the map
  getBookedSpaces: (floorId: number, date: string) =>
    apiClient
      .get<Booking[]>('/api/bookings/bookings/', { params: { floor: floorId, date } })
      .then((r) => r.data.map((b) => b.space)),
};
