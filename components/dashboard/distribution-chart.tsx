import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { titleCase } from "@/lib/format";
import type { DistributionPoint } from "@/types/domain";

export function DistributionChart({ title, data }: { title: string; data: DistributionPoint[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length ? (
          data.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{titleCase(item.label)}</span>
                <span className="text-muted-foreground">{item.value.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${Math.max((item.value / max) * 100, 4)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No aggregate rows returned yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
