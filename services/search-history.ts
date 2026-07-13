/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { SearchHistory, SearchHistoryPayload } from "@/types/domain";

export async function saveSearchHistory(deviceId: string, payload: SearchHistoryPayload) {
  const supabase = getSupabaseBrowserClient() as any;
  const { error } = await supabase.from("search_history").insert({
    device_id: deviceId,
    query_text: payload.queryText ?? null,
    filters: payload.filters,
    result_count: payload.resultCount ?? null
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getRecentSearches(deviceId: string): Promise<SearchHistory[]> {
  const supabase = getSupabaseBrowserClient() as any;
  const { data, error } = await supabase
    .from("search_history")
    .select("id,device_id,query_text,filters,result_count,created_at")
    .eq("device_id", deviceId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SearchHistory[];
}

export async function getPopularSearches(): Promise<Pick<SearchHistory, "query_text" | "filters" | "result_count" | "created_at">[]> {
  const supabase = getSupabaseBrowserClient() as any;
  const { data, error } = await supabase
    .from("search_history")
    .select("query_text,filters,result_count,created_at")
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Pick<SearchHistory, "query_text" | "filters" | "result_count" | "created_at">[];
}
