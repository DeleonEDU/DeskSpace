import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  createBooking,
  deleteBooking,
  fetchBookings,
  fetchMyBookings,
  type CreateBookingPayload,
} from "@/api/bookings";
import { fetchSpaces } from "@/api/spaces";

export interface Space {
  id: number;
  name: string;
  description: string;
  space_type: "desk" | "meeting_room" | "private_office";
  capacity: number;
  price_per_hour: string;
  svg_element_id: string;
  floor: number;
}

export interface Booking {
  id: number;
  space_id: number;
  start_time: string;
  end_time: string;
  status: string;
}

export function useSpaces() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["spaces"],
    queryFn: fetchSpaces,
    enabled: !!token,
  });
}

export function useMyBookings() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: fetchMyBookings,
    enabled: !!token,
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
}

export function useBookings(date: Date, startTime: number, endTime: number) {
  const { token } = useAuth();

  const startDateTime = new Date(date);
  startDateTime.setHours(startTime, 0, 0, 0);

  const endDateTime = new Date(date);
  endDateTime.setHours(endTime, 0, 0, 0);

  const query = `?start_time__gte=${startDateTime.toISOString()}&end_time__lte=${endDateTime.toISOString()}`;

  return useQuery({
    queryKey: ["bookings", startDateTime.toISOString(), endDateTime.toISOString()],
    queryFn: () => fetchBookings(query),
    enabled: !!token,
  });
}
