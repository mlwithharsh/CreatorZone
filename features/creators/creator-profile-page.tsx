"use client";

import { ArrowLeft, Heart, Instagram, Mail, MessageCircle, Play, Share2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DistributionChart } from "@/components/dashboard/distribution-chart";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_ROUTES } from "@/constants/routes";
import { useDeviceId } from "@/hooks/use-device-id";
import { formatCompactNumber, formatCurrencyRange, formatPercent, titleCase } from "@/lib/format";
import { queryKeys } from "@/lib/query-client";
import { getCreatorProfile } from "@/services/creators";
import { addFavorite, getFavoriteIds, removeFavorite } from "@/services/favorites";
import type { CreatorProfile } from "@/types/domain";

export function CreatorProfilePage({ username }: { username: string }) {
  const deviceId = useDeviceId();
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: queryKeys.creatorProfile(username),
    queryFn: () => getCreatorProfile(username)
  });
  const favoriteIdsQuery = useQuery({
    queryKey: queryKeys.favoriteIds(deviceId),
    queryFn: () => getFavoriteIds(deviceId),
    enabled: Boolean(deviceId)
  });
  const creatorId = profileQuery.data?.id;
  const isFavorite = creatorId ? favoriteIdsQuery.data?.has(creatorId) : false;
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!creatorId) return;
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

  if (profileQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="mt-6 h-32 w-full" />
      </main>
    );
  }

  if (profileQuery.error) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <ErrorState message={(profileQuery.error as Error).message} />
      </main>
    );
  }

  if (!profileQuery.data) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <EmptyState title="Creator not found" description="No indexed creator matched this username." />
      </main>
    );
  }

  const creator = profileQuery.data;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <Link href={APP_ROUTES.search} className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to search
      </Link>
      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="relative h-64 bg-muted">
          <Image
            src={creator.cover_image_url || `https://picsum.photos/seed/${creator.id}/1200/400`}
            alt={`${creator.name} cover`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="relative -mt-20 h-32 w-32 shrink-0 overflow-hidden rounded-lg border-4 border-card bg-muted shadow-lg">
              <Image
                src={creator.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}`}
                alt={creator.name}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold text-foreground">{creator.name}</h1>
                {creator.verified ? <ShieldCheck className="h-5 w-5 text-primary" /> : null}
              </div>
              <p className="mt-1 text-muted-foreground">@{creator.username}</p>
              <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{creator.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {creator.categories.map((category) => (
                  <Badge key={category} variant="outline">{titleCase(category)}</Badge>
                ))}
                {creator.platforms.map((platform) => (
                  <Badge key={platform}>{titleCase(platform)}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-2 lg:justify-end">
            <Button onClick={() => favoriteMutation.mutate()} disabled={!deviceId || favoriteMutation.isPending}>
              <Heart className={isFavorite ? "h-4 w-4 fill-current" : "h-4 w-4"} />
              {isFavorite ? "Saved" : "Save"}
            </Button>
            <ContactButton href={creator.instagram_url} label="Instagram" icon={Instagram} />
            <ContactButton href={creator.youtube_url} label="YouTube" icon={Play} />
            <ContactButton href={creator.email ? `mailto:${creator.email}` : undefined} label="Email" icon={Mail} />
            <ContactButton href={creator.whatsapp_number ? `https://wa.me/${creator.whatsapp_number}` : undefined} label="WhatsApp" icon={MessageCircle} />
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(window.location.href)}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-4">
        <ProfileMetric label="Followers" value={formatCompactNumber(creator.followers)} />
        <ProfileMetric label="Engagement" value={formatPercent(creator.engagement_rate)} />
        <ProfileMetric label="Avg views" value={formatCompactNumber(creator.avg_views)} />
        <ProfileMetric label="Pricing" value={formatCurrencyRange(creator.pricing_min, creator.pricing_max)} />
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground">Audience insights</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <AudienceBlock title="Gender split" value={creator.audience_gender_split} />
            <AudienceBlock title="Age ranges" value={creator.audience_age_ranges} />
            <AudienceBlock title="Top countries" value={creator.audience_top_countries} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-foreground">Profile details</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>{[creator.location_city, creator.location_state, creator.location_country].filter(Boolean).join(", ")}</p>
            <p>Languages: {creator.languages.join(", ") || "Not listed"}</p>
            <p>Following: {formatCompactNumber(creator.following)}</p>
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <RecentPosts creator={creator} />
        <DistributionChart title="Audience geography" data={audienceCountries(creator)} />
      </section>
    </main>
  );
}

function ContactButton({
  href,
  label,
  icon: Icon
}: {
  href?: string | null;
  label: string;
  icon: React.ElementType;
}) {
  if (!href) return null;

  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Button variant="outline">
        <Icon className="h-4 w-4" />
        {label}
      </Button>
    </a>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </Card>
  );
}

function AudienceBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="rounded-lg border border-border bg-background/55 p-4">
      <p className="font-medium text-foreground">{title}</p>
      <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
        {JSON.stringify(value ?? {}, null, 2)}
      </pre>
    </div>
  );
}

function RecentPosts({ creator }: { creator: CreatorProfile }) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-foreground">Recent posts</h2>
      <div className="mt-4 grid gap-3">
        {creator.recent_posts.length ? (
          creator.recent_posts.slice(0, 4).map((post) => (
            <div key={post.id} className="flex gap-3 rounded-lg border border-border bg-background/55 p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {post.thumbnail_url ? (
                  <Image src={post.thumbnail_url} alt="" fill sizes="64px" className="object-cover" />
                ) : null}
              </div>
              <div>
                <Badge variant="outline">{titleCase(post.platform)}</Badge>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.caption}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatCompactNumber(post.likes)} likes · {formatCompactNumber(post.comments)} comments
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No recent posts returned for this creator.</p>
        )}
      </div>
    </Card>
  );
}

function audienceCountries(creator: CreatorProfile) {
  if (!Array.isArray(creator.audience_top_countries)) {
    return [];
  }

  return creator.audience_top_countries
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const country = "country" in item ? String(item.country) : "Unknown";
      const pct = "pct" in item ? Number(item.pct) : 0;
      return { label: country, value: pct };
    })
    .filter((item): item is { label: string; value: number } => Boolean(item));
}
