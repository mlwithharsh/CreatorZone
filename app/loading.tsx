export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6">
      <div className="w-full space-y-5">
        <div className="h-8 w-44 animate-pulse rounded-md bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </main>
  );
}
