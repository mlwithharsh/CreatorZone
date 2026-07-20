/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type {
  CreatorProfile,
  CreatorSearchFilters,
  CreatorSearchResult,
  CreatorSearchRow
} from "@/types/domain";

const creatorCardColumns =
  "id,name,username,bio,verified,location_country,location_state,location_city,followers,avg_views,avg_likes,engagement_rate,categories,platforms,profile_image_url";

export async function searchCreators(filters: CreatorSearchFilters): Promise<CreatorSearchResult> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;
  const supabase = getSupabaseBrowserClient() as any;

  const { data, error } = await supabase.rpc("search_creators", {
    p_query: filters.query ?? null,
    p_platforms: filters.platforms ?? null,
    p_categories: filters.categories ?? null,
    p_min_followers: filters.minFollowers ?? null,
    p_max_followers: filters.maxFollowers ?? null,
    p_min_engagement: filters.minEngagement ?? null,
    p_max_engagement: filters.maxEngagement ?? null,
    p_country: filters.country ?? null,
    p_state: filters.state ?? null,
    p_city: filters.city ?? null,
    p_language: filters.language ?? null,
    p_verified: filters.verified ?? null,
    p_gender: filters.gender ?? null,
    p_min_price: filters.minPrice ?? null,
    p_max_price: filters.maxPrice ?? null,
    p_min_avg_views: filters.minAvgViews ?? null,
    p_min_avg_likes: filters.minAvgLikes ?? null,
    p_sort_by: filters.sortBy ?? "followers",
    p_sort_dir: filters.sortDir ?? "desc",
    p_page: page,
    p_page_size: pageSize
  });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as CreatorSearchRow[];

  return {
    rows,
    totalCount: Number(rows[0]?.total_count ?? 0),
    page,
    pageSize
  };
}

export async function getFeaturedCreators() {
  const supabase = getSupabaseBrowserClient() as any;
  const { data, error } = await supabase
    .from("creators")
    .select(creatorCardColumns)
    .eq("verified", true)
    .order("followers", { ascending: false })
    .limit(8);

  if (error) {
    throw new Error(error.message);
  }

  const creatorRows = (data ?? []) as Omit<CreatorSearchRow, "total_count">[];
  return creatorRows.map((creator) => ({ ...creator, total_count: 0 })) as CreatorSearchRow[];
}

export async function getCreatorProfile(username: string): Promise<CreatorProfile | null> {
  const supabase = getSupabaseBrowserClient() as any;
  const { data, error } = await supabase
    .from("creators")
    .select(
      "id,name,username,bio,gender,verified,location_country,location_state,location_city,followers,following,avg_views,avg_likes,engagement_rate,categories,platforms,profile_image_url,cover_image_url,instagram_url,youtube_url,whatsapp_numbers,email,pricing_min,pricing_max,languages,audience_gender_split,audience_age_ranges,audience_top_countries,created_at,updated_at,recent_posts(id,creator_id,platform,thumbnail_url,caption,likes,comments,posted_at,created_at)"
    )
    .eq("username", username)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as CreatorProfile | null;
}
