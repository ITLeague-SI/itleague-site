"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  issueSessionToken,
} from "@/lib/auth/session";
import {
  checkLoginRate,
  clearLoginRate,
  getClientKey,
  recordLoginFailure,
} from "@/lib/auth/rate-limit";

function safeNextPath(input: unknown): string {
  const raw = typeof input === "string" ? input : "";
  if (raw === "/admin" || raw.startsWith("/admin/")) return raw;
  return "/admin";
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  const clientKey = await getClientKey();
  const rate = checkLoginRate(clientKey);
  if (!rate.allowed) {
    const retrySec = Math.ceil(rate.retryAfterMs / 1000);
    redirect(
      `/admin/login?error=rate&retry=${retrySec}&next=${encodeURIComponent(next)}`,
    );
  }

  if (!checkPassword(password)) {
    recordLoginFailure(clientKey);
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  clearLoginRate(clientKey);
  const token = issueSessionToken();
  const isProd = process.env.NODE_ENV === "production";
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: isProd,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect(next);
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
