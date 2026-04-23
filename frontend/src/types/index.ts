// ============================================
// Types mirroring the backend Django models
// ============================================

export interface Amenity {
  id: number;
  name: string;
  icon_name: string;
}

export type SpaceType = 'desk' | 'meeting_room' | 'private_office';

export interface Space {
  id: number;
  name: string;
  description: string;
  space_type: SpaceType;
  space_type_display: string;
  capacity: number;
  price_per_hour: number;
  svg_element_id: string;
  amenities: Amenity[];
  is_active: boolean;
  floor: number;
  status?: 'available' | 'booked' | 'closed'; // enriched on frontend
}

export interface Floor {
  id: number;
  location: number;
  level: number;
  name: string;
  map_image: string | null;
  spaces: Space[];
}

export interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  floors: Floor[];
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface Booking {
  id: number;
  space: number;
  space_name?: string;
  floor_level?: number;
  location_name?: string;
  user: number;
  date: string;         // YYYY-MM-DD
  start_time: string;   // HH:MM
  end_time: string;     // HH:MM
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface BookingRequest {
  space: number;
  date: string;
  start_time: string;
  end_time: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
}

// UI State
export interface SelectedSlot {
  space: Space;
  date: string;
  startTime: string;
  endTime: string;
}
