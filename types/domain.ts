import type { Enums, Tables } from "@/lib/supabase/types";
import type { Database, Json } from "@/types/supabase";

export type Platform = Enums<"platform_enum">;
export type Category = Enums<"category_enum">;
export type Gender = Enums<"gender_enum">;
export type Creator = Tables<"creators">;
export type RecentPost = Tables<"recent_posts">;
export type Favorite = Tables<"favorites">;
export type SearchHistory = Tables<"search_history">;
export type DashboardStats = Database["public"]["Views"]["mv_dashboard_stats"]["Row"];
export type DistributionPoint = {
  label: string;
  value: number;
};

export type CreatorSearchRow =
  Database["public"]["Functions"]["search_creators"]["Returns"][number];

export type CreatorSearchSort =
  | "newest"
  | "followers"
  | "engagement"
  | "popularity"
  | "alphabetical";

export type CreatorSearchFilters = {
  query?: string;
  platforms?: Platform[];
  categories?: Category[];
  minFollowers?: number;
  maxFollowers?: number;
  minEngagement?: number;
  maxEngagement?: number;
  country?: string;
  state?: string;
  city?: string;
  language?: string;
  verified?: boolean;
  gender?: Gender;
  minPrice?: number;
  maxPrice?: number;
  minAvgViews?: number;
  minAvgLikes?: number;
  sortBy?: CreatorSearchSort;
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type CreatorSearchResult = {
  rows: CreatorSearchRow[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type CreatorProfile = Creator & {
  recent_posts: RecentPost[];
};

export type SearchHistoryPayload = {
  queryText?: string;
  filters: Json;
  resultCount?: number;
};

export type ImportLog = Tables<"import_logs">;

