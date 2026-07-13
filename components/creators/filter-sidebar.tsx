"use client";

import { CATEGORY_OPTIONS, FOLLOWER_OPTIONS, GENDER_OPTIONS, LANGUAGE_OPTIONS, PLATFORM_OPTIONS } from "@/constants/filters";
import type { Category, CreatorSearchFilters, Gender, Platform } from "@/types/domain";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input, Select } from "../ui/input";

export function FilterSidebar({
  filters,
  onChange,
  onReset
}: {
  filters: CreatorSearchFilters;
  onChange: (filters: CreatorSearchFilters) => void;
  onReset: () => void;
}) {
  function toggleList<T extends string>(key: "platforms" | "categories", value: T) {
    const current = (filters[key] as T[] | undefined) ?? [];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next.length ? next : undefined, page: 1 });
  }

  return (
    <Card className="sticky top-20">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <FilterGroup title="Platform">
          <div className="grid grid-cols-2 gap-2">
            {PLATFORM_OPTIONS.map((option) => (
              <CheckButton
                key={option.value}
                active={filters.platforms?.includes(option.value) ?? false}
                label={option.label}
                onClick={() => toggleList<Platform>("platforms", option.value)}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Category">
          <div className="grid grid-cols-2 gap-2">
            {CATEGORY_OPTIONS.map((option) => (
              <CheckButton
                key={option.value}
                active={filters.categories?.includes(option.value) ?? false}
                label={option.label}
                onClick={() => toggleList<Category>("categories", option.value)}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Followers">
          <Select
            value={filters.minFollowers ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                minFollowers: event.target.value ? Number(event.target.value) : undefined,
                page: 1
              })
            }
          >
            <option value="">Any audience size</option>
            {FOLLOWER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup title="Engagement">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min="0"
              step="0.1"
              placeholder="Min %"
              value={filters.minEngagement ?? ""}
              onChange={(event) =>
                onChange({ ...filters, minEngagement: numericInput(event.target.value), page: 1 })
              }
            />
            <Input
              type="number"
              min="0"
              step="0.1"
              placeholder="Max %"
              value={filters.maxEngagement ?? ""}
              onChange={(event) =>
                onChange({ ...filters, maxEngagement: numericInput(event.target.value), page: 1 })
              }
            />
          </div>
        </FilterGroup>

        <FilterGroup title="Location">
          <div className="grid gap-2">
            <Input
              placeholder="Country"
              value={filters.country ?? ""}
              onChange={(event) => onChange({ ...filters, country: textInput(event.target.value), page: 1 })}
            />
            <Input
              placeholder="State"
              value={filters.state ?? ""}
              onChange={(event) => onChange({ ...filters, state: textInput(event.target.value), page: 1 })}
            />
            <Input
              placeholder="City"
              value={filters.city ?? ""}
              onChange={(event) => onChange({ ...filters, city: textInput(event.target.value), page: 1 })}
            />
          </div>
        </FilterGroup>

        <FilterGroup title="Audience">
          <div className="grid gap-2">
            <Select
              value={filters.language ?? ""}
              onChange={(event) => onChange({ ...filters, language: textInput(event.target.value), page: 1 })}
            >
              <option value="">Any language</option>
              {LANGUAGE_OPTIONS.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </Select>
            <Select
              value={filters.gender ?? ""}
              onChange={(event) =>
                onChange({
                  ...filters,
                  gender: event.target.value ? (event.target.value as Gender) : undefined,
                  page: 1
                })
              }
            >
              <option value="">Any gender</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={filters.verified ?? false}
                onChange={(event) =>
                  onChange({ ...filters, verified: event.target.checked ? true : undefined, page: 1 })
                }
              />
              Verified creators only
            </label>
          </div>
        </FilterGroup>

        <FilterGroup title="Price and performance">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min $"
              value={filters.minPrice ?? ""}
              onChange={(event) => onChange({ ...filters, minPrice: numericInput(event.target.value), page: 1 })}
            />
            <Input
              type="number"
              placeholder="Max $"
              value={filters.maxPrice ?? ""}
              onChange={(event) => onChange({ ...filters, maxPrice: numericInput(event.target.value), page: 1 })}
            />
            <Input
              type="number"
              placeholder="Min views"
              value={filters.minAvgViews ?? ""}
              onChange={(event) =>
                onChange({ ...filters, minAvgViews: numericInput(event.target.value), page: 1 })
              }
            />
            <Input
              type="number"
              placeholder="Min likes"
              value={filters.minAvgLikes ?? ""}
              onChange={(event) =>
                onChange({ ...filters, minAvgLikes: numericInput(event.target.value), page: 1 })
              }
            />
          </div>
        </FilterGroup>
      </CardContent>
    </Card>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

function CheckButton({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button variant={active ? "default" : "outline"} size="sm" className="justify-start" onClick={onClick}>
      {label}
    </Button>
  );
}

function numericInput(value: string) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function textInput(value: string) {
  return value.trim() || undefined;
}
