export const queryConfig = {
  staleTime: 60_000,
  creatorPageSize: 24
} as const;

export const queryKeys = {
  dashboardStats: ["dashboard-stats"] as const,
  platformDistribution: ["platform-distribution"] as const,
  categoryDistribution: ["category-distribution"] as const,
  featuredCreators: ["featured-creators"] as const,
  creatorSearch: (filters: unknown) => ["creator-search", filters] as const,
  creatorProfile: (username: string) => ["creator-profile", username] as const,
  favorites: (deviceId: string) => ["favorites", deviceId] as const,
  favoriteIds: (deviceId: string) => ["favorite-ids", deviceId] as const,
  searchHistory: (deviceId: string) => ["search-history", deviceId] as const,
  popularSearches: ["popular-searches"] as const,
  importLogs: ["import-logs"] as const
};
