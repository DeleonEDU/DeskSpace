import { apiFetch, parseJson } from "@/api/client";
import type { Booking } from "@/hooks/use-booking";

export interface CreateBookingPayload {
  space_id: number;
  start_time: string;
  end_time: string;
}

export async function fetchBookings(query: string): Promise<Booking[]> {
  const response = await apiFetch(`/api/bookings/${query}`);
  return parseJson<Booking[]>(response);
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const response = await apiFetch("/api/bookings/");
  return parseJson<Booking[]>(response);
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const response = await apiFetch("/api/bookings/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<Booking>(response);
}

export async function deleteBooking(bookingId: number): Promise<void> {
  const response = await apiFetch(`/api/bookings/${bookingId}/`, {
    method: "DELETE",
  });
  if (!response.ok && response.status !== 204) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      typeof errorBody === "object" && errorBody && "detail" in errorBody
        ? String((errorBody as { detail: string }).detail)
        : "Failed to delete booking",
    );
  }
}
