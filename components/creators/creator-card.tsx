"use client";

import { Eye, Heart, Instagram, Mail, Play, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCompactNumber, formatPercent, titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CreatorSearchRow } from "@/types/domain";

export function CreatorCard({
  creator,
  favorite,
  onFavorite
}: {
  creator: CreatorSearchRow;
  favorite?: boolean;
  onFavorite?: (creatorId: string) => void;
}) {
  const profileHref = `/creators/${creator.username}` as Route;

  return (
    <Card className="group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          src={creator.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}`}
          alt={creator.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <button
          type="button"
          aria-label={favorite ? "Remove favorite" : "Add favorite"}
          onClick={() => onFavorite?.(creator.id)}
          className={cn(
            "absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition hover:scale-105",
            favorite && "text-primary"
          )}
        >
          <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
        </button>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="min-w-0 truncate text-lg font-semibold text-foreground">{creator.name}</h3>
            {creator.verified ? <ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> : null}
          </div>
          <p className="text-sm text-muted-foreground">@{creator.username}</p>
        </div>

        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
          {creator.bio || "Creator profile with audience and campaign performance signals."}
        </p>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <Metric label="Followers" value={formatCompactNumber(creator.followers)} />
          <Metric label="Engage" value={formatPercent(creator.engagement_rate)} />
          <Metric label="Views" value={formatCompactNumber(creator.avg_views)} />
        </div>

        <div className="flex flex-wrap gap-2">
          {creator.categories.slice(0, 2).map((category) => (
            <Badge key={category} variant="outline">
              {titleCase(category)}
            </Badge>
          ))}
          {creator.platforms.slice(0, 2).map((platform) => (
            <Badge key={platform}>{titleCase(platform)}</Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {[creator.location_city, creator.location_state, creator.location_country].filter(Boolean).join(", ")}
        </p>

        <div className="flex items-center gap-2">
          <Link href={profileHref} className="flex-1">
            <Button className="w-full">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>
          <IconLink label="Instagram" href={`https://instagram.com/${creator.username}`}>
            <Instagram className="h-4 w-4" />
          </IconLink>
          <IconLink label="YouTube" href={`https://youtube.com/@${creator.username}`}>
            <Play className="h-4 w-4" />
          </IconLink>
          <IconLink label="Email" href={`mailto:hello@${creator.username}.com`}>
            <Mail className="h-4 w-4" />
          </IconLink>
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/55 p-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}

function IconLink({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card/70 text-muted-foreground transition hover:bg-accent hover:text-foreground"
    >
      {children}
    </a>
  );
}
