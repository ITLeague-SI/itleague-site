import "server-only";
import crypto from "node:crypto";

const COOKIE_NAME = "itl_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const TOKEN_VERSION = "v2";
const MIN_SECRET_LENGTH = 32;

let warnedAboutDevSecret = false;

function secret(): string {
  const configured = process.env.ADMIN_SESSION_SECRET;
  if (configured && configured.length >= MIN_SECRET_LENGTH) return configured;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `ADMIN_SESSION_SECRET must be set to a value of at least ${MIN_SECRET_LENGTH} characters in production.`,
    );
  }

  if (!warnedAboutDevSecret) {
    warnedAboutDevSecret = true;
    console.warn(
      "[auth] ADMIN_SESSION_SECRET is missing or too short. Using a dev-only fallback. Set ADMIN_SESSION_SECRET before deploying.",
    );
  }
  return "dev-only-itleague-session-secret-do-not-use-in-production";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function issueSessionToken() {
  const issuedAt = Date.now().toString(36);
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${TOKEN_VERSION}.${issuedAt}.${nonce}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 4) return false;
  const [version, issuedAt, nonce, sig] = parts;
  if (version !== TOKEN_VERSION) return false;
  if (!/^[a-f0-9]{32}$/.test(nonce)) return false;
  const expected = sign(`${version}.${issuedAt}.${nonce}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  const issued = parseInt(issuedAt, 36);
  if (!Number.isFinite(issued)) return false;
  if (Date.now() - issued > MAX_AGE_SECONDS * 1000) return false;
  return true;
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
export const TOKEN_FORMAT_VERSION = TOKEN_VERSION;
