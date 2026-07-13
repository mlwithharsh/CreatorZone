import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-card/80 px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-card/80 px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
