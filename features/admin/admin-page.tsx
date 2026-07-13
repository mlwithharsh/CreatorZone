"use client";

import { Activity, Database, FileClock, ShieldCheck, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { CreatorCard } from "@/components/creators/creator-card";
import { DistributionChart } from "@/components/dashboard/distribution-chart";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber, formatPercent } from "@/lib/format";
import { queryKeys } from "@/lib/query-client";
import { getCategoryDistribution, getDashboardStats, getImportLogs, getPlatformDistribution } from "@/services/admin";
import { searchCreators } from "@/services/creators";

export function AdminPage() {
  const statsQuery = useQuery({ queryKey: queryKeys.dashboardStats, queryFn: getDashboardStats });
  const platformQuery = useQuery({ queryKey: queryKeys.platformDistribution, queryFn: getPlatformDistribution });
  const categoryQuery = useQuery({ queryKey: queryKeys.categoryDistribution, queryFn: getCategoryDistribution });
  const importLogsQuery = useQuery({ queryKey: queryKeys.importLogs, queryFn: getImportLogs });
  const creatorsQuery = useQuery({
    queryKey: queryKeys.creatorSearch({ sortBy: "newest", page: 1, pageSize: 12 }),
    queryFn: () => searchCreators({ sortBy: "newest", page: 1, pageSize: 12 })
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Overview data comes from materialized views and creator management uses the same server-side search RPC.
        </p>
      </div>

      {statsQuery.error ? <ErrorState message={(statsQuery.error as Error).message} /> : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          icon={Users}
          label="Total creators"
          value={formatCompactNumber(statsQuery.data?.total_creators)}
          helper="mv_dashboard_stats"
        />
        <StatsCard
          icon={ShieldCheck}
          label="Verified creators"
          value={formatCompactNumber(statsQuery.data?.verified_creators)}
          helper="Indexed profile quality"
        />
        <StatsCard
          icon={Activity}
          label="Avg engagement"
          value={formatPercent(statsQuery.data?.avg_engagement_rate)}
          helper="Rounded in materialized view"
        />
        <StatsCard
          icon={Database}
          label="Avg followers"
          value={formatCompactNumber(statsQuery.data?.avg_followers)}
          helper="No raw COUNT scan"
        />
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <DistributionChart title="Platform distribution" data={platformQuery.data ?? []} />
        <DistributionChart title="Category distribution" data={categoryQuery.data ?? []} />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Creator management</CardTitle>
          </CardHeader>
          <CardContent>
            {creatorsQuery.error ? <ErrorState message={(creatorsQuery.error as Error).message} /> : null}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(creatorsQuery.data?.rows ?? []).map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileClock className="h-4 w-4" />
              Import logs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {importLogsQuery.error ? <ErrorState message={(importLogsQuery.error as Error).message} /> : null}
            {(importLogsQuery.data ?? []).map((log) => (
              <div key={log.id} className="rounded-lg border border-border bg-background/55 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{log.source}</p>
                  <Badge variant={log.status === "success" ? "success" : "outline"}>{log.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatCompactNumber(log.rows_imported)} rows · {new Date(log.created_at).toLocaleString()}
                </p>
                {log.notes ? <p className="mt-2 text-xs text-muted-foreground">{log.notes}</p> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
