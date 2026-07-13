import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseBrowserEnv } from "@/lib/env";
import type { Database } from "@/types/supabase";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseBrowserEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies; middleware/actions can.
        }
      }
    }
  });
}
