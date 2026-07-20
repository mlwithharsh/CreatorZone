import Link from "next/link";

import { APP_ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="cz-glass max-w-md rounded-2xl p-8 text-center">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This route is not part of the Creatorzone workspace yet.
        </p>
        <Link
          href={APP_ROUTES.home}
          className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
