const requiredClientEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
] as const;

const requiredServerEnv = ["SUPABASE_SERVICE_ROLE_KEY"] as const;

function readEnv(name: string) {
  // NEXT_PUBLIC_* vars must be accessed with STATIC property syntax so
  // Next.js / Turbopack inlines them into the client bundle at build time.
  // Dynamic `process.env[name]` is NEVER replaced in client-side code.
  if (name === "NEXT_PUBLIC_SUPABASE_URL") return process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (name === "NEXT_PUBLIC_SUPABASE_ANON_KEY") return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return process.env[name]; // server-only vars (fine — not sent to browser)
}

function requireEnv(name: string) {
  const value = readEnv(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseBrowserEnv() {
  return {
    url: requireEnv(requiredClientEnv[0]),
    anonKey: requireEnv(requiredClientEnv[1])
  };
}

export function getSupabaseAdminEnv() {
  return {
    url: requireEnv(requiredClientEnv[0]),
    serviceRoleKey: requireEnv(requiredServerEnv[0])
  };
}
