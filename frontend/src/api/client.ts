const TOKEN_KEY = "token";
const REFRESH_KEY = "refreshToken";

export function getStoredTokens(): { access: string | null; refresh: string | null } {
  return {
    access: localStorage.getItem(TOKEN_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
  };
}

export function storeTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function refreshAccessToken(refresh: string): Promise<string | null> {
  const response = await fetch("/api/auth/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  localStorage.setItem(TOKEN_KEY, data.access);
  return data.access as string;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<Response> {
  const { access, refresh } = getStoredTokens();
  let currentToken = token ?? access;

  const headers = new Headers(options.headers);
  if (currentToken) {
    headers.set("Authorization", `Bearer ${currentToken}`);
  }

  let response = await fetch(path, { ...options, headers });

  if (response.status === 401 && refresh) {
    const newToken = await refreshAccessToken(refresh);
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(path, { ...options, headers });
    }
  }

  return response;
}

export async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const detail =
      typeof errorBody === "object" && errorBody && "detail" in errorBody
        ? String((errorBody as { detail: string }).detail)
        : response.statusText;
    throw new Error(detail || "Request failed");
  }
  return response.json() as Promise<T>;
}
