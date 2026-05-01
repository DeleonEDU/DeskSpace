import { useAuth } from "@/context/AuthContext";

export function useApi() {
  const { token, refreshToken, login, logout, user } = useAuth();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let currentToken = token;

    const headers = new Headers(options.headers);
    if (currentToken) {
      headers.set("Authorization", `Bearer ${currentToken}`);
    }

    let res = await fetch(url, { ...options, headers });

    if (res.status === 401 && refreshToken) {
      try {
        const refreshRes = await fetch("/api/auth/token/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          if (user) {
            login(data.access, refreshToken, user);
          }
          currentToken = data.access;

          // Retry with new token
          headers.set("Authorization", `Bearer ${currentToken}`);
          res = await fetch(url, { ...options, headers });
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    }

    return res;
  };

  return fetchWithAuth;
}
