import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";

export const API_ORIGIN = "https://api.nzhussup.dev";
export const API_BASE_URL = `${API_ORIGIN}/v1`;

export const apiClient = createClient<paths>({ baseUrl: API_ORIGIN });

export function resolveApiAsset(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function assertData<T>(data: T | undefined, label: string): T {
  if (data === undefined) throw new Error(`${label} response did not include data`);
  return data;
}
