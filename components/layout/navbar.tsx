"use client";

import { Heart, LayoutDashboard, Menu, Search, Settings, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const navItems = [
  { href: APP_ROUTES.search, label: "Search", icon: Search },
  { href: APP_ROUTES.favorites, label: "Favorites", icon: Heart },
  { href: APP_ROUTES.admin, label: "Admin", icon: LayoutDashboard },
  { href: APP_ROUTES.settings, label: "Settings", icon: Settings }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/78 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <BrandMark />
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      <div
        className={cn(
          "grid border-t border-border/70 transition-all md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
