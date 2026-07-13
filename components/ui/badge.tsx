import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "outline" | "success";

const variants: Record<BadgeVariant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-border bg-card/70 text-foreground",
  success: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
};

export function Badge({
  className,
  variant = "secondary",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
