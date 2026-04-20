import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

let cached: SupabaseClient | null = null;

export function getPublicSupabase(): SupabaseClient | null {
  if (cached) return cached;
  const { url, anon, configured } = getSupabaseEnv();
  if (!configured) return null;
  cached = createClient(url!, anon!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
