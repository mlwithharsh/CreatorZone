import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="grid place-items-center p-8 text-center">
      <div className="max-w-md">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </Card>
  );
}
