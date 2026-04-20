import "server-only";
import crypto from "node:crypto";

const COOKIE_NAME = "itl_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  const s =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "itleague-dev-secret";
  return s;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function issueSessionToken() {
  const issuedAt = Date.now().toString(36);
  const payload = `v1.${issuedAt}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [version, issuedAt, sig] = parts;
  if (version !== "v1") return false;
  const expected = sign(`${version}.${issuedAt}`);
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
