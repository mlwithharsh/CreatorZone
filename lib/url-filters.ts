import type { Category, CreatorSearchFilters, CreatorSearchSort, Gender, Platform } from "@/types/domain";

function splitList<T extends string>(value: string | null): T[] | undefined {
  if (!value) {
    return undefined;
  }

  return value.split(",").filter(Boolean) as T[];
}

function numberValue(value: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseSearchParams(params: URLSearchParams): CreatorSearchFilters {
  return {
    query: params.get("q") || undefined,
    platforms: splitList<Platform>(params.get("platforms")),
    categories: splitList<Category>(params.get("categories")),
    minFollowers: numberValue(params.get("minFollowers")),
    maxFollowers: numberValue(params.get("maxFollowers")),
    minEngagement: numberValue(params.get("minEngagement")),
    maxEngagement: numberValue(params.get("maxEngagement")),
    country: params.get("country") || undefined,
    state: params.get("state") || undefined,
    city: params.get("city") || undefined,
    language: params.get("language") || undefined,
    verified: params.get("verified") === "true" ? true : undefined,
    gender: (params.get("gender") as Gender | null) || undefined,
    minPrice: numberValue(params.get("minPrice")),
    maxPrice: numberValue(params.get("maxPrice")),
    minAvgViews: numberValue(params.get("minAvgViews")),
    minAvgLikes: numberValue(params.get("minAvgLikes")),
    sortBy: (params.get("sortBy") as CreatorSearchSort | null) || "followers",
    sortDir: params.get("sortDir") === "asc" ? "asc" : "desc",
    page: numberValue(params.get("page")) ?? 1
  };
}

export function filtersToSearchParams(filters: CreatorSearchFilters) {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.platforms?.length) params.set("platforms", filters.platforms.join(","));
  if (filters.categories?.length) params.set("categories", filters.categories.join(","));
  if (filters.minFollowers) params.set("minFollowers", String(filters.minFollowers));
  if (filters.maxFollowers) params.set("maxFollowers", String(filters.maxFollowers));
  if (filters.minEngagement) params.set("minEngagement", String(filters.minEngagement));
  if (filters.maxEngagement) params.set("maxEngagement", String(filters.maxEngagement));
  if (filters.country) params.set("country", filters.country);
  if (filters.state) params.set("state", filters.state);
  if (filters.city) params.set("city", filters.city);
  if (filters.language) params.set("language", filters.language);
  if (filters.verified) params.set("verified", "true");
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.minAvgViews) params.set("minAvgViews", String(filters.minAvgViews));
  if (filters.minAvgLikes) params.set("minAvgLikes", String(filters.minAvgLikes));
  if (filters.sortBy && filters.sortBy !== "followers") params.set("sortBy", filters.sortBy);
  if (filters.sortDir === "asc") params.set("sortDir", "asc");
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  return params;
}
