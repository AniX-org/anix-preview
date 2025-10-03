import { env } from "hono/adapter";
export const BASE_URLS = [
  "https://api-s.anixsekai.com",
  "https://api.anixsekai.com",
];

export type ANIXART_HEADERST = {
  "User-Agent": string;
  "Content-Type": string;
};

export const ANIXART_UA =
  "AnixartApp/9.0 BETA 5-25062213 (Android 9; SDK 28; arm64-v8a; samsung SM-G975N; en)";
export const ANIXART_HEADERS: ANIXART_HEADERST = {
  "User-Agent": ANIXART_UA,
  "Content-Type": "application/json; charset=UTF-8",
};

export function getApiBase(c: any) {
  let { API_BASE } = env<{ API_BASE: string }>(c);

  if (!API_BASE) {
    API_BASE = BASE_URLS[Math.floor(Math.random() * BASE_URLS.length)];
  }

  if (API_BASE.endsWith("/")) {
    API_BASE = API_BASE.slice(0, -1);
  }

  console.log(`API_BASE: ${API_BASE}`);
  return API_BASE;
}
