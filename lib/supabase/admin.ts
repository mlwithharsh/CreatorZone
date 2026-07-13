import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminEnv } from "@/lib/env";
import type { Database } from "@/types/supabase";

let adminClient: SupabaseClient<Database> | null = null;

export function getSupabaseAdminClient() {
  if (!adminClient) {
    const { url, serviceRoleKey } = getSupabaseAdminEnv();

    adminClient = createClient<Database>(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return adminClient;
}
