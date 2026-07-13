"use client";

import { ArrowRight, BarChart3, HeartHandshake, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useQuery } from "@tanstack/react-query";

import { CreatorCard } from "@/components/creators/creator-card";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CATEGORY_OPTIONS, PLATFORM_OPTIONS } from "@/constants/filters";
import { APP_ROUTES } from "@/constants/routes";
import { formatCompactNumber, formatPercent, titleCase } from "@/lib/format";
import { queryKeys } from "@/lib/query-client";
import { getCategoryDistribution, getDashboardStats, getPlatformDistribution } from "@/services/admin";
import { getFeaturedCreators } from "@/services/creators";

export function LandingPage() {
  const statsQuery = useQuery({ queryKey: queryKeys.dashboardStats, queryFn: getDashboardStats });
  const featuredQuery = useQuery({ queryKey: queryKeys.featuredCreators, queryFn: getFeaturedCreators });
  const platformQuery = useQuery({ queryKey: queryKeys.platformDistribution, queryFn: getPlatformDistribution });
  const categoryQuery = useQuery({ queryKey: queryKeys.categoryDistribution, queryFn: getCategoryDistribution });

  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_430px]">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-6">
            Free-tier creator intelligence
          </Badge>
          <h1 className="text-5xl font-semibold tracking-normal text-foreground sm:text-7xl">
            HashFame
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Discover Indian creators from Notion-synced profile data, indexed Postgres metrics,
            and a frontend that never loads the full dataset into the browser.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={APP_ROUTES.search}>
              <Button size="lg">
                <Search className="h-4 w-4" />
                Discover creators
              </Button>
            </Link>
            <Link href={APP_ROUTES.admin}>
              <Button variant="outline" size="lg">
                View analytics
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <Card className="cz-glass p-5">
          <div className="grid gap-3">
            <HeroStat
              icon={Users}
              label="Creators indexed"
              value={formatCompactNumber(statsQuery.data?.total_creators)}
            />
            <HeroStat
              icon={ShieldCheck}
              label="Verified profiles"
              value={formatCompactNumber(statsQuery.data?.verified_creators)}
            />
            <HeroStat
              icon={BarChart3}
              label="Avg engagement"
              value={formatPercent(statsQuery.data?.avg_engagement_rate)}
            />
          </div>
        </Card>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-10 md:grid-cols-3">
        <ValueCard icon={Sparkles} title="Indexed search" text="Search uses server-side indexes through Supabase today, with Meilisearch and Qdrant scaffolds ready." />
        <ValueCard icon={HeartHandshake} title="Notion-ready pipeline" text="The backend and ingestion layers are structured for incremental Notion syncs and safe reruns." />
        <ValueCard icon={BarChart3} title="Free-tier visibility" text="Dashboard cards read aggregate views instead of expensive row-by-row scans." />
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Featured creators</h2>
            <p className="mt-2 text-sm text-muted-foreground">A lightweight verified creator query limited to 8 rows.</p>
          </div>
          <Link href={APP_ROUTES.search} className="text-sm font-medium text-primary">
            Search all
          </Link>
        </div>
        {featuredQuery.error ? (
          <ErrorState message={(featuredQuery.error as Error).message} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(featuredQuery.data ?? []).map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-10 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-foreground">Trending categories</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(categoryQuery.data?.length ? categoryQuery.data : CATEGORY_OPTIONS.map((item) => ({ label: item.value, value: 0 }))).map((item) => (
              <Link key={item.label} href={`${APP_ROUTES.search}?categories=${item.label}` as Route}>
                <Badge variant="outline">
                  {titleCase(item.label)} {item.value ? `(${formatCompactNumber(item.value)})` : ""}
                </Badge>
              </Link>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-foreground">Popular platforms</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(platformQuery.data?.length ? platformQuery.data : PLATFORM_OPTIONS.map((item) => ({ label: item.value, value: 0 }))).map((item) => (
              <Link key={item.label} href={`${APP_ROUTES.search}?platforms=${item.label}` as Route}>
                <Badge>{titleCase(item.label)} {item.value ? `(${formatCompactNumber(item.value)})` : ""}</Badge>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <Card className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Build your next Indian creator shortlist</h2>
            <p className="mt-2 text-muted-foreground">Connect Supabase and Notion env vars when ready; the app and backend are wired for those services.</p>
          </div>
          <Link href={APP_ROUTES.search}>
            <Button size="lg">
              Start search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </section>
    </main>
  );
}

function HeroStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-background/60 p-4">
      <div className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ValueCard({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <Card className="p-5">
      <Icon className="h-5 w-5 text-primary" />
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </Card>
  );
}
