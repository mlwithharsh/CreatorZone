import { AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/card";

export function ErrorState({ message }: { message: string }) {
  return (
    <Card className="flex items-start gap-3 border-destructive/35 bg-destructive/5 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <div>
        <p className="font-medium text-foreground">Data unavailable</p>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
}
