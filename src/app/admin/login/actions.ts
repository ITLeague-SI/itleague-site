"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  issueSessionToken,
} from "@/lib/auth/session";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const safeNext = next.startsWith("/admin") ? next : "/admin";

  if (!checkPassword(password)) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(safeNext)}`);
  }

  const token = issueSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect(safeNext);
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
