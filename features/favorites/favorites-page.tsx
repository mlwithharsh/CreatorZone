"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CreatorCard } from "@/components/creators/creator-card";
import { CreatorGridSkeleton } from "@/components/creators/creator-grid-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";
import { useDeviceId } from "@/hooks/use-device-id";
import { queryKeys } from "@/lib/query-client";
import { getFavoriteCreators, removeFavorite } from "@/services/favorites";

export function FavoritesPage() {
  const deviceId = useDeviceId();
  const queryClient = useQueryClient();
  const favoritesQuery = useQuery({
    queryKey: queryKeys.favorites(deviceId),
    queryFn: () => getFavoriteCreators(deviceId),
    enabled: Boolean(deviceId)
  });
  const removeMutation = useMutation({
    mutationFn: (creatorId: string) => removeFavorite(deviceId, creatorId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.favorites(deviceId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.favoriteIds(deviceId) });
    }
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Favorites</h1>
        <p className="mt-2 text-muted-foreground">
          Synced to the Supabase `favorites` table by anonymous device id.
        </p>
      </div>

      {favoritesQuery.error ? <ErrorState message={(favoritesQuery.error as Error).message} /> : null}
      {favoritesQuery.isLoading ? <CreatorGridSkeleton /> : null}
      {!favoritesQuery.isLoading && !favoritesQuery.error && favoritesQuery.data?.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description="Save creators from search or profile pages to build a shortlist."
          action={
            <Link href={APP_ROUTES.search}>
              <Button>Browse creators</Button>
            </Link>
          }
        />
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(favoritesQuery.data ?? []).map((creator) => (
          <CreatorCard
            key={creator.id}
            creator={creator}
            favorite
            onFavorite={(creatorId) => removeMutation.mutate(creatorId)}
          />
        ))}
      </div>
    </main>
  );
}
