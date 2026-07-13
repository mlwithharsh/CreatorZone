const requiredClientEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
] as const;

const requiredServerEnv = ["SUPABASE_SERVICE_ROLE_KEY"] as const;

function readEnv(name: string) {
  return process.env[name];
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
