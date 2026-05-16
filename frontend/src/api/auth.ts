import { apiFetch, parseJson } from "@/api/client";
import type { AuthTokens, User } from "@/types/auth";

export async function login(email: string, password: string): Promise<AuthTokens> {
  const response = await apiFetch("/api/auth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJson<AuthTokens>(response);
}

export async function registerUser(payload: Record<string, string>) {
  const response = await apiFetch("/api/auth/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<User>(response);
}

export async function fetchProfile(token: string): Promise<User> {
  const response = await apiFetch(
    "/api/auth/profile/",
    {},
    token,
  );
  return parseJson<User>(response);
}
