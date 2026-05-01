import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/context/AuthContext";

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
  const fetchApi = useApi();
  const { token } = useAuth();

  return useQuery({
    queryKey: ["spaces"],
    queryFn: async () => {
      const res = await fetchApi("/api/spaces/spaces/");
      if (!res.ok) throw new Error("Failed to fetch spaces");
      return res.json() as Promise<Space[]>;
    },
    enabled: !!token,
  });
}

export function useMyBookings() {
  const fetchApi = useApi();
  const { token } = useAuth();

  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const res = await fetchApi(`/api/bookings/`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json() as Promise<Booking[]>;
    },
    enabled: !!token,
  });
}

export function useDeleteBooking() {
  const fetchApi = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: number) => {
      const res = await fetchApi(`/api/bookings/${bookingId}/`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to delete booking");
      }
      return bookingId;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useBookings(date: Date, startTime: number, endTime: number) {
  const fetchApi = useApi();
  const { token } = useAuth();

  const startDateTime = new Date(date);
  startDateTime.setHours(startTime, 0, 0, 0);

  const endDateTime = new Date(date);
  endDateTime.setHours(endTime, 0, 0, 0);

  return useQuery({
    queryKey: ["bookings", startDateTime.toISOString(), endDateTime.toISOString()],
    queryFn: async () => {
      const res = await fetchApi(
        `/api/bookings/?start_time__gte=${startDateTime.toISOString()}&end_time__lte=${endDateTime.toISOString()}`,
      );
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json() as Promise<Booking[]>;
    },
    enabled: !!token,
  });
}
