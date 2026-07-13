"use client";

import { Search } from "lucide-react";

import { SORT_OPTIONS } from "@/constants/filters";
import type { CreatorSearchFilters, CreatorSearchSort } from "@/types/domain";

import { Input, Select } from "../ui/input";

export function SearchToolbar({
  filters,
  totalCount,
  onChange
}: {
  filters: CreatorSearchFilters;
  totalCount: number;
  onChange: (filters: CreatorSearchFilters) => void;
}) {
  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-border/70 bg-background/84 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-lg sm:border">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-12 pl-10"
            placeholder="Search creator name, username, bio, niche..."
            value={filters.query ?? ""}
            onChange={(event) => onChange({ ...filters, query: event.target.value || undefined, page: 1 })}
          />
        </div>
        <Select
          className="h-12"
          value={filters.sortBy ?? "followers"}
          onChange={(event) =>
            onChange({ ...filters, sortBy: event.target.value as CreatorSearchSort, page: 1 })
          }
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </Select>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {totalCount.toLocaleString()} creators found from the indexed Supabase search RPC.
      </p>
    </div>
  );
}
