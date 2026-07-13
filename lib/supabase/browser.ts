"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseBrowserEnv } from "@/lib/env";
import type { Database } from "@/types/supabase";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    const { url, anonKey } = getSupabaseBrowserEnv();
    browserClient = createBrowserClient<Database>(url, anonKey);
  }

  return browserClient;
}
