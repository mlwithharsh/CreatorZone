/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { CreatorSearchRow } from "@/types/domain";

export async function getFavoriteIds(deviceId: string) {
  const supabase = getSupabaseBrowserClient() as any;
  const { data, error } = await supabase
    .from("favorites")
    .select("creator_id")
    .eq("device_id", deviceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const favoriteRows = (data ?? []) as { creator_id: string }[];
  return new Set(favoriteRows.map((row) => row.creator_id));
}

export async function getFavoriteCreators(deviceId: string) {
  const supabase = getSupabaseBrowserClient() as any;
  const { data, error } = await supabase
    .from("favorites")
    .select(
      "creator:creators(id,name,username,bio,verified,location_country,location_state,location_city,followers,avg_views,avg_likes,engagement_rate,categories,platforms,profile_image_url)"
    )
    .eq("device_id", deviceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  type FavoriteRow = { creator: Omit<CreatorSearchRow, "total_count"> | null };
  const favoriteCreatorRows = (data ?? []) as FavoriteRow[];
  return favoriteCreatorRows
    .map((row) => row.creator)
    .filter(Boolean)
    .map((creator) => ({ ...creator, total_count: 0 })) as CreatorSearchRow[];
}

export async function addFavorite(deviceId: string, creatorId: string) {
  const supabase = getSupabaseBrowserClient() as any;
  const { error } = await supabase
    .from("favorites")
    .upsert({ device_id: deviceId, creator_id: creatorId }, { onConflict: "device_id,creator_id" });

  if (error) {
    throw new Error(error.message);
  }
}

export async function removeFavorite(deviceId: string, creatorId: string) {
  const supabase = getSupabaseBrowserClient() as any;
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("device_id", deviceId)
    .eq("creator_id", creatorId);

  if (error) {
    throw new Error(error.message);
  }
}
