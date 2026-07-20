import Link from "next/link";

import { APP_ROUTES } from "@/constants/routes";

export function BrandMark() {
  return (
    <Link href={APP_ROUTES.home} className="inline-flex items-center gap-3">
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        className="h-10 w-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="12" fill="url(#hfLogoGradient)" />
        <path
          d="M12 11.5V28.5"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M27.5 11.5V28.5"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M13.5 20H26"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="hfLogoGradient" x1="4" y1="4" x2="36" y2="36">
            <stop stopColor="#F5B8C7" />
            <stop offset="0.5" stopColor="#C8A5FF" />
            <stop offset="1" stopColor="#E7C66B" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg font-semibold tracking-normal text-foreground">CreatorZone</span>
    </Link>
  );
}
