import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

export function StatsCard({
  label,
  value,
  icon: Icon,
  helper
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  helper?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
          {helper ? <p className="mt-1 text-xs text-muted-foreground">{helper}</p> : null}
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
