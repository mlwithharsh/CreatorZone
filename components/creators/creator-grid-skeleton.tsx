import { Skeleton } from "@/components/ui/skeleton";

export function CreatorGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-border bg-card p-4">
          <Skeleton className="aspect-[4/3] w-full" />
          <Skeleton className="mt-4 h-5 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/3" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        </div>
      ))}
    </div>
  );
}
