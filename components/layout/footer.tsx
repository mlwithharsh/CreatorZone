import Link from "next/link";

import { APP_ROUTES } from "@/constants/routes";

export function Footer() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>HashFame connects brand teams with indexed Indian creator intelligence.</p>
        <div className="flex flex-wrap gap-4">
          <Link href={APP_ROUTES.search} className="hover:text-foreground">
            Search
          </Link>
          <Link href={APP_ROUTES.favorites} className="hover:text-foreground">
            Favorites
          </Link>
          <Link href={APP_ROUTES.recentSearches} className="hover:text-foreground">
            Recent Searches
          </Link>
          <Link href={APP_ROUTES.settings} className="hover:text-foreground">
            Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
