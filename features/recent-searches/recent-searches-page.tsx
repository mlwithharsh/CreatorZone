"use client";

import { Clock, Search } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_ROUTES } from "@/constants/routes";
import { useDeviceId } from "@/hooks/use-device-id";
import { filtersToSearchParams } from "@/lib/url-filters";
import { queryKeys } from "@/lib/query-client";
import { getPopularSearches, getRecentSearches } from "@/services/search-history";
import type { CreatorSearchFilters } from "@/types/domain";

export function RecentSearchesPage() {
  const deviceId = useDeviceId();
  const recentQuery = useQuery({
    queryKey: queryKeys.searchHistory(deviceId),
    queryFn: () => getRecentSearches(deviceId),
    enabled: Boolean(deviceId)
  });
  const popularQuery = useQuery({
    queryKey: queryKeys.popularSearches,
    queryFn: getPopularSearches
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Recent Searches</h1>
        <p className="mt-2 text-muted-foreground">
          Query history is persisted in Supabase and replayed through URL filter state.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          {recentQuery.error ? <ErrorState message={(recentQuery.error as Error).message} /> : null}
          {!recentQuery.isLoading && !recentQuery.error && recentQuery.data?.length === 0 ? (
            <EmptyState title="No recent searches" description="Search activity will appear here after you run discovery queries." />
          ) : null}
          {(recentQuery.data ?? []).map((item) => (
            <SearchRow key={item.id} item={item} />
          ))}
        </section>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-foreground">Popular filters</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Latest aggregate-friendly sample from `search_history`.
          </p>
          <div className="mt-4 space-y-3">
            {(popularQuery.data ?? []).slice(0, 8).map((item, index) => (
              <div key={`${item.created_at}-${index}`} className="rounded-lg border border-border bg-background/55 p-3">
                <p className="text-sm font-medium text-foreground">{item.query_text || "Filtered search"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.result_count ?? 0} results</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

function SearchRow({ item }: { item: Awaited<ReturnType<typeof getRecentSearches>>[number] }) {
  const filters = item.filters as CreatorSearchFilters;
  const href = `${APP_ROUTES.search}?${filtersToSearchParams(filters).toString()}` as Route;

  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">{item.query_text || "Filtered creator search"}</h2>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline">{item.result_count ?? 0} results</Badge>
          <Badge variant="outline">{new Date(item.created_at).toLocaleString()}</Badge>
        </div>
      </div>
      <Link href={href}>
        <Button variant="outline">
          <Search className="h-4 w-4" />
          Reopen
        </Button>
      </Link>
    </Card>
  );
}
