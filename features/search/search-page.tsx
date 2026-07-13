"use client";

import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CreatorCard } from "@/components/creators/creator-card";
import { CreatorGridSkeleton } from "@/components/creators/creator-grid-skeleton";
import { FilterSidebar } from "@/components/creators/filter-sidebar";
import { SearchToolbar } from "@/components/creators/search-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useDeviceId } from "@/hooks/use-device-id";
import { filtersToSearchParams, parseSearchParams } from "@/lib/url-filters";
import { queryConfig, queryKeys } from "@/lib/query-client";
import { addFavorite, getFavoriteIds, removeFavorite } from "@/services/favorites";
import { searchCreators } from "@/services/creators";
import { saveSearchHistory } from "@/services/search-history";
import type { CreatorSearchFilters } from "@/types/domain";

export function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const deviceId = useDeviceId();
  const [filters, setFilters] = useState<CreatorSearchFilters>(() => parseSearchParams(searchParams));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const debouncedFilters = useDebouncedValue(filters, 300);

  useEffect(() => {
    const next = filtersToSearchParams(filters);
    const query = next.toString();
    router.replace((query ? `${pathname}?${query}` : pathname) as Route, { scroll: false });
  }, [filters, pathname, router]);

  const effectiveFilters = useMemo(
    () => ({ ...debouncedFilters, pageSize: queryConfig.creatorPageSize }),
    [debouncedFilters]
  );

  const searchQuery = useQuery({
    queryKey: queryKeys.creatorSearch(effectiveFilters),
    queryFn: () => searchCreators(effectiveFilters),
    placeholderData: (previous) => previous
  });

  const favoriteIdsQuery = useQuery({
    queryKey: queryKeys.favoriteIds(deviceId),
    queryFn: () => getFavoriteIds(deviceId),
    enabled: Boolean(deviceId)
  });

  const saveHistoryMutation = useMutation({
    mutationFn: () =>
      saveSearchHistory(deviceId, {
        queryText: effectiveFilters.query,
        filters: effectiveFilters,
        resultCount: searchQuery.data?.totalCount ?? 0
      })
  });

  const favoriteMutation = useMutation({
    mutationFn: async (creatorId: string) => {
      const isFavorite = favoriteIdsQuery.data?.has(creatorId);
      if (isFavorite) {
        await removeFavorite(deviceId, creatorId);
      } else {
        await addFavorite(deviceId, creatorId);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.favoriteIds(deviceId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.favorites(deviceId) });
    }
  });

  useEffect(() => {
    if (!deviceId || !searchQuery.data || searchQuery.isFetching) {
      return;
    }

    const timeout = window.setTimeout(() => {
      saveHistoryMutation.mutate();
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [deviceId, effectiveFilters, saveHistoryMutation, searchQuery.data, searchQuery.isFetching]);

  const totalPages = Math.max(1, Math.ceil((searchQuery.data?.totalCount ?? 0) / queryConfig.creatorPageSize));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Creator Search</h1>
        <p className="mt-2 text-muted-foreground">
          Filters run through the indexed `search_creators` RPC with one paginated round trip per search.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="hidden lg:block">
          <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters({ sortBy: "followers", page: 1 })} />
        </aside>

        <section className="space-y-5">
          <SearchToolbar
            filters={filters}
            totalCount={searchQuery.data?.totalCount ?? 0}
            onChange={setFilters}
          />

          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setMobileFiltersOpen((value) => !value)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          {mobileFiltersOpen ? (
            <div className="lg:hidden">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters({ sortBy: "followers", page: 1 })}
              />
            </div>
          ) : null}

          {searchQuery.error ? <ErrorState message={(searchQuery.error as Error).message} /> : null}

          {searchQuery.isLoading ? <CreatorGridSkeleton /> : null}

          {!searchQuery.isLoading && !searchQuery.error && searchQuery.data?.rows.length === 0 ? (
            <EmptyState
              title="No creators matched"
              description="Broaden filters or search a different category. The app has not fetched any fallback mock rows."
            />
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {(searchQuery.data?.rows ?? []).map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                favorite={favoriteIdsQuery.data?.has(creator.id)}
                onFavorite={deviceId ? (creatorId) => favoriteMutation.mutate(creatorId) : undefined}
              />
            ))}
          </div>

          <Card className="flex items-center justify-between gap-4 p-4">
            <Button
              variant="outline"
              disabled={(filters.page ?? 1) <= 1}
              onClick={() => setFilters({ ...filters, page: Math.max((filters.page ?? 1) - 1, 1) })}
            >
              Previous
            </Button>
            <p className="text-sm text-muted-foreground">
              Page {filters.page ?? 1} of {totalPages}
            </p>
            <Button
              variant="outline"
              disabled={(filters.page ?? 1) >= totalPages}
              onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) + 1 })}
            >
              Next
            </Button>
          </Card>
        </section>
      </div>
    </main>
  );
}
