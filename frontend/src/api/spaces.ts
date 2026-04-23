import { apiClient } from './client';
import type { Location, Floor, Space } from '../types';

export const spacesApi = {
  // GET /api/spaces/locations/ — all locations with nested floors + spaces
  getLocations: () =>
    apiClient.get<Location[]>('/api/spaces/locations/').then((r) => r.data),

  getLocation: (id: number) =>
    apiClient.get<Location>(`/api/spaces/locations/${id}/`).then((r) => r.data),

  // GET /api/spaces/floors/?location=1
  getFloors: (locationId: number) =>
    apiClient
      .get<Floor[]>('/api/spaces/floors/', { params: { location: locationId } })
      .then((r) => r.data),

  getFloor: (id: number) =>
    apiClient.get<Floor>(`/api/spaces/floors/${id}/`).then((r) => r.data),

  // GET /api/spaces/spaces/?floor=3&space_type=desk
  getSpaces: (params?: Record<string, unknown>) =>
    apiClient.get<Space[]>('/api/spaces/spaces/', { params }).then((r) => r.data),

  getSpace: (id: number) =>
    apiClient.get<Space>(`/api/spaces/spaces/${id}/`).then((r) => r.data),
};
