import { cn } from "@/lib/utils";

export type Contribution = { name: string; value: number; scope?: string };

export function ContributionBars({ items, title }: { items: Contribution[]; title?: string }) {
  const max = Math.max(...items.map((i) => Math.abs(i.value)), 1);
  return (
    <div className="space-y-2.5">
      {title && <div className="text-xs font-medium text-muted-foreground">{title}</div>}
      {items.map((d) => {
        const abs = Math.abs(d.value);
        const positive = d.value > 0;
        return (
          <div key={d.name}>
            <div className="mb-1 flex justify-between text-xs">
              <span>
                {d.name}
                {d.scope && <span className="ml-1 text-muted-foreground">· {d.scope}</span>}
              </span>
              <span className={positive ? "text-success" : "text-destructive"}>
                {positive ? "+" : ""}
                {d.value}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className={cn("h-full", positive ? "bg-success" : "bg-destructive")} style={{ width: `${(abs / max) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
