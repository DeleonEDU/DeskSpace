import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
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
  const { token, refreshToken, logout, login, user } = useAuth();
  
  const fetchWithRefresh = async (url: string, options: RequestInit = {}) => {
    let res = await fetch(url, options);
    
    if (res.status === 401 && refreshToken) {
      const refreshRes = await fetch("/api/auth/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (user) login(data.access, refreshToken, user); // update context & localstorage
        
        // Retry original request with new token
        const newOptions = {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${data.access}` }
        };
        res = await fetch(url, newOptions);
      } else {
        logout();
      }
    }
    return res;
  };

  return useQuery({
    queryKey: ["spaces"],
    queryFn: async () => {
      if (!token) return [];
      const res = await fetchWithRefresh("/api/spaces/spaces/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch spaces");
      return res.json() as Promise<Space[]>;
    },
    enabled: !!token,
  });
}

export function useMyBookings() {
  const { token, refreshToken, logout, login, user } = useAuth();
  
  const fetchWithRefresh = async (url: string, options: RequestInit = {}) => {
    let res = await fetch(url, options);
    
    if (res.status === 401 && refreshToken) {
      const refreshRes = await fetch("/api/auth/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (user) login(data.access, refreshToken, user);
        
        const newOptions = {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${data.access}` }
        };
        res = await fetch(url, newOptions);
      } else {
        logout();
      }
    }
    return res;
  };
  
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      if (!token) return [];
      const res = await fetchWithRefresh(`/api/bookings/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json() as Promise<Booking[]>;
    },
    enabled: !!token,
  });
}

export function useDeleteBooking() {
  const { token, refreshToken, logout, login, user } = useAuth();
  const queryClient = useQueryClient();

  const fetchWithRefresh = async (url: string, options: RequestInit = {}) => {
    let res = await fetch(url, options);
    
    if (res.status === 401 && refreshToken) {
      const refreshRes = await fetch("/api/auth/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (user) login(data.access, refreshToken, user);
        
        const newOptions = {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${data.access}` }
        };
        res = await fetch(url, newOptions);
      } else {
        logout();
      }
    }
    return res;
  };

  return useMutation({
    mutationFn: async (bookingId: number) => {
      if (!token) throw new Error("No token");
      const res = await fetchWithRefresh(`/api/bookings/${bookingId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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
  const { token, refreshToken, logout, login, user } = useAuth();
  
  const fetchWithRefresh = async (url: string, options: RequestInit = {}) => {
    let res = await fetch(url, options);
    
    if (res.status === 401 && refreshToken) {
      const refreshRes = await fetch("/api/auth/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (user) login(data.access, refreshToken, user);
        
        const newOptions = {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${data.access}` }
        };
        res = await fetch(url, newOptions);
      } else {
        logout();
      }
    }
    return res;
  };
  
  const startDateTime = new Date(date);
  startDateTime.setHours(startTime, 0, 0, 0);
  
  const endDateTime = new Date(date);
  endDateTime.setHours(endTime, 0, 0, 0);

  return useQuery({
    queryKey: ["bookings", startDateTime.toISOString(), endDateTime.toISOString()],
    queryFn: async () => {
      if (!token) return [];
      const res = await fetchWithRefresh(`/api/bookings/?start_time__gte=${startDateTime.toISOString()}&end_time__lte=${endDateTime.toISOString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json() as Promise<Booking[]>;
    },
    enabled: !!token,
  });
}
