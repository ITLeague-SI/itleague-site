import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceEnv } from "./env";

let cached: SupabaseClient | null = null;

export function getAdminSupabase(): SupabaseClient {
  if (cached) return cached;
  const { url, key, configured } = getSupabaseServiceEnv();
  if (!configured) {
    throw new Error(
      "Supabase service-role credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
  }
  cached = createClient(url!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
