import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, SelectedSlot } from '../types';

// ─── Auth Store ──────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setTokens: (access, refresh) => {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    { name: 'deskspace-auth', partialize: (s) => ({ accessToken: s.accessToken, refreshToken: s.refreshToken, user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
);

// ─── Booking Wizard Store ─────────────────────────────────────────────────────
interface BookingWizardState {
  selectedLocationId: number | null;
  selectedFloorId: number | null;
  selectedDate: string;          // YYYY-MM-DD
  selectedStartTime: string;     // HH:MM
  selectedEndTime: string;       // HH:MM
  activeSpaceTypes: string[];
  selectedSlot: SelectedSlot | null;

  setLocation: (id: number) => void;
  setFloor: (id: number) => void;
  setDate: (date: string) => void;
  setStartTime: (t: string) => void;
  setEndTime: (t: string) => void;
  setSpaceTypes: (types: string[]) => void;
  selectSlot: (slot: SelectedSlot | null) => void;
  reset: () => void;
}

const todayISO = () => new Date().toISOString().split('T')[0];

export const useBookingStore = create<BookingWizardState>()((set) => ({
  selectedLocationId: null,
  selectedFloorId: null,
  selectedDate: todayISO(),
  selectedStartTime: '09:00',
  selectedEndTime: '11:00',
  activeSpaceTypes: ['desk', 'meeting_room', 'private_office'],
  selectedSlot: null,

  setLocation: (id) => set({ selectedLocationId: id, selectedFloorId: null, selectedSlot: null }),
  setFloor: (id) => set({ selectedFloorId: id, selectedSlot: null }),
  setDate: (date) => set({ selectedDate: date, selectedSlot: null }),
  setStartTime: (t) => set({ selectedStartTime: t }),
  setEndTime: (t) => set({ selectedEndTime: t }),
  setSpaceTypes: (types) => set({ activeSpaceTypes: types }),
  selectSlot: (slot) => set({ selectedSlot: slot }),
  reset: () => set({ selectedSlot: null }),
}));
