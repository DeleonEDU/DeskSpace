import { apiFetch, parseJson } from "@/api/client";
import type { Space } from "@/hooks/use-booking";

export async function fetchSpaces(): Promise<Space[]> {
  const response = await apiFetch("/api/spaces/spaces/");
  return parseJson<Space[]>(response);
}
