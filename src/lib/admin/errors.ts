import "server-only";
import { redirect } from "next/navigation";

export const ADMIN_ERROR_CODES = [
  "missing",
  "upload",
  "db",
  "internal",
] as const;
export type AdminErrorCode = (typeof ADMIN_ERROR_CODES)[number];

export function logAdminError(scope: string, err: unknown): void {
  console.error(`[admin/${scope}]`, err);
}

export function failRedirect(
  scope: string,
  redirectPath: string,
  code: AdminErrorCode,
  err?: unknown,
): never {
  if (err !== undefined) logAdminError(scope, err);
  const separator = redirectPath.includes("?") ? "&" : "?";
  redirect(`${redirectPath}${separator}error=${code}`);
}
