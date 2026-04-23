import { apiClient } from './client';
import type { AuthTokens, LoginRequest, RegisterRequest, User } from '../types';

export const authApi = {
  login: (payload: LoginRequest) =>
    apiClient.post<AuthTokens>('/api/auth/token/', payload).then((r) => r.data),

  register: (payload: RegisterRequest) =>
    apiClient.post<User>('/api/auth/register/', payload).then((r) => r.data),

  me: () =>
    apiClient.get<User>('/api/auth/me/').then((r) => r.data),

  refresh: (refresh: string) =>
    apiClient.post<{ access: string }>('/api/auth/token/refresh/', { refresh }).then((r) => r.data),
};
