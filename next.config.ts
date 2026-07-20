import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,

  // Guarantee these are embedded in both server and client bundles.
  // NEXT_PUBLIC_* vars must be statically known at build time.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://pfpvfazrusjjigibnzva.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_urCuzGCAwyf4IBjMzXjUIA_3LjSb-Ap"
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com"
      }
    ]
  }
};

export default nextConfig;
