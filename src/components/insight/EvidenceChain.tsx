import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Database, Filter, Link2, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type Evidence = {
  id: string;
  type: "chart" | "metric" | "filter" | "dataset" | "external";
  title: string;
  source: string;
};

const iconMap = {
  chart: BarChart3,
  metric: Link2,
  filter: Filter,
  dataset: Database,
  external: FileText,
};

export function EvidenceChain({ items, required = 6 }: { items: Evidence[]; required?: number }) {
  const ratio = Math.min(items.length / required, 1);
  const pct = Math.round(ratio * 100);
  const tier = ratio >= 0.8 ? "充分" : ratio >= 0.5 ? "一般" : "不足";
  const tierColor = ratio >= 0.8 ? "bg-success" : ratio >= 0.5 ? "bg-warning" : "bg-destructive";
  const tierText = ratio >= 0.8 ? "text-success" : ratio >= 0.5 ? "text-warning-foreground" : "text-destructive";

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          证据链
          <span className={cn("text-xs font-medium", tierText)}>充分性 · {tier}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
            <span>已绑定 {items.length} / {required}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full transition-all", tierColor)} style={{ width: `${pct}%` }} />
          </div>
        </div>

        <ul className="space-y-1.5">
          {items.map((e) => {
            const Icon = iconMap[e.type];
            return (
              <li key={e.id} className="flex items-start gap-2 rounded-md border border-border/50 p-2 text-xs">
                <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{e.title}</div>
                  <div className="truncate text-[10px] text-muted-foreground">来源 · {e.source}</div>
                </div>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {e.type}
                </Badge>
              </li>
            );
          })}
        </ul>

        {ratio < 0.8 && (
          <div className="flex items-center gap-1.5 rounded-md bg-warning/15 p-2 text-[11px] text-warning-foreground">
            <AlertCircle className="h-3.5 w-3.5" />
            待补充数据 / 待确认口径
          </div>
        )}
      </CardContent>
    </Card>
  );
}
