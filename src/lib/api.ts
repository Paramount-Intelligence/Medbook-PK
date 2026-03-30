import { CONFIG } from "./config";

class APIError extends Error {
  status: number;
  responseBody: string;
  constructor(message: string, status = 0, responseBody = "") {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

const fetchWithTimeout = (url: string, options: RequestInit, timeoutMs: number) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
};

const fetchWithRetry = async (url: string, options: RequestInit, retries: number, delayMs: number) => {
  let lastError: Error = new Error("Unknown error");
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options, CONFIG.API.TIMEOUT_MS);
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new APIError(`Server returned ${res.status}`, res.status, body);
      }
      const text = await res.text();
      try { return { ok: true, data: JSON.parse(text), raw: text }; }
      catch { return { ok: true, data: null, raw: text }; }
    } catch (err) {
      lastError = err as Error;
      if ((err as Error).name === "AbortError") {
        lastError = new APIError("Request timed out.", 0);
        break;
      }
      if (err instanceof APIError && err.status >= 400 && err.status < 500) break;
      if (attempt < retries) await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
  throw lastError;
};

const post = (url: string, payload: unknown) =>
  fetchWithRetry(
    url,
    { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) },
    CONFIG.API.MAX_RETRIES,
    CONFIG.API.RETRY_DELAY
  );

export const submitBooking = async (payload: unknown): Promise<{ ok: boolean; bookingRef: string }> => {
  await post(CONFIG.N8N_BOOKING_WEBHOOK, payload);
  return { ok: true, bookingRef: (payload as { BookingRef: string }).BookingRef };
};

export const submitReschedule = async (payload: unknown): Promise<{ ok: boolean }> => {
  await post(CONFIG.N8N_RESCHEDULE_WEBHOOK, payload);
  return { ok: true };
};
