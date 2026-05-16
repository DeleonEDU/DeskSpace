import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/api/client";

export function useApi() {
  const { token, logout } = useAuth();

  return async (url: string, options: RequestInit = {}) => {
    const response = await apiFetch(url, options, token);

    if (response.status === 401) {
      logout();
    }

    return response;
  };
}
