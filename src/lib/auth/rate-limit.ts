import "server-only";
import { headers } from "next/headers";

type Entry = {
  attempts: number;
  windowStart: number;
  blockedUntil: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 15 * 60 * 1000;

const store = new Map<string, Entry>();

function prune(now: number) {
  if (store.size < 1000) return;
  for (const [key, entry] of store) {
    if (entry.blockedUntil < now && now - entry.windowStart > WINDOW_MS) {
      store.delete(key);
    }
  }
}

export async function getClientKey(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export type RateLimitState =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterMs: number };

export function checkLoginRate(key: string): RateLimitState {
  const now = Date.now();
  prune(now);

  const entry = store.get(key);
  if (entry && entry.blockedUntil > now) {
    return { allowed: false, retryAfterMs: entry.blockedUntil - now };
  }
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: BLOCK_MS };
  }
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.attempts - 1 };
}

export function recordLoginFailure(key: string): void {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    store.set(key, { attempts: 1, windowStart: now, blockedUntil: 0 });
    return;
  }
  const attempts = entry.attempts + 1;
  const blockedUntil = attempts >= MAX_ATTEMPTS ? now + BLOCK_MS : 0;
  store.set(key, { ...entry, attempts, blockedUntil });
}

export function clearLoginRate(key: string): void {
  store.delete(key);
}
