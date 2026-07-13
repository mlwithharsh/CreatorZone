import type { Route } from "next";

export const APP_ROUTES = {
  home: "/" as Route,
  search: "/search" as Route,
  favorites: "/favorites" as Route,
  recentSearches: "/recent-searches" as Route,
  admin: "/admin" as Route,
  settings: "/settings" as Route
} as const;