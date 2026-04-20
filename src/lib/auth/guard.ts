import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./session";

export async function requireAdmin(nextPath?: string) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    const target = nextPath
      ? `/admin/login?next=${encodeURIComponent(nextPath)}`
      : "/admin/login";
    redirect(target);
  }
}

export async function isAdminLoggedIn() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
