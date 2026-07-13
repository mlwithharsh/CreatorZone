/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { DashboardStats, DistributionPoint, ImportLog } from "@/types/domain";

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const supabase = getSupabaseBrowserClient() as any;
  const { data, error } = await supabase
    .from("mv_dashboard_stats")
    .select("total_creators,verified_creators,avg_engagement_rate,avg_followers")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPlatformDistribution(): Promise<DistributionPoint[]> {
  const supabase = getSupabaseBrowserClient() as any;
  const { data, error } = await supabase
    .from("mv_platform_distribution")
    .select("platform,creator_count")
    .order("creator_count", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const platformRows = (data ?? []) as { platform: string | null; creator_count: number | null }[];
  return platformRows.map((row) => ({
    label: row.platform ?? "unknown",
    value: Number(row.creator_count ?? 0)
  }));
}

export async function getCategoryDistribution(): Promise<DistributionPoint[]> {
  const supabase = getSupabaseBrowserClient() as any;
  const { data, error } = await supabase
    .from("mv_category_distribution")
    .select("category,creator_count")
    .order("creator_count", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const categoryRows = (data ?? []) as { category: string | null; creator_count: number | null }[];
  return categoryRows.map((row) => ({
    label: row.category ?? "unknown",
    value: Number(row.creator_count ?? 0)
  }));
}

export async function getImportLogs(): Promise<ImportLog[]> {
  const supabase = getSupabaseBrowserClient() as any;
  const { data, error } = await supabase
    .from("import_logs")
    .select("id,source,rows_imported,status,notes,created_at")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
