import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AnomalyLevel, DetectMethod } from "./AnomalyCard";

const allLevels: AnomalyLevel[] = ["P0", "P1", "P2"];
const allMethods: DetectMethod[] = ["阈值", "同环比", "分位数", "季节性", "结构突变", "业务规则"];

export function AnomalyFilters({
  levels,
  methods,
  cluster,
  onLevelsChange,
  onMethodsChange,
  onClusterChange,
}: {
  levels: AnomalyLevel[];
  methods: DetectMethod[];
  cluster: boolean;
  onLevelsChange: (v: AnomalyLevel[]) => void;
  onMethodsChange: (v: DetectMethod[]) => void;
  onClusterChange: (v: boolean) => void;
}) {
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">异常分级</Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {allLevels.map((l) => {
            const active = levels.includes(l);
            return (
              <Badge
                key={l}
                variant="outline"
                className={cn(
                  "cursor-pointer border px-2 py-0.5 text-[11px] transition-colors",
                  active
                    ? l === "P0"
                      ? "border-destructive/40 bg-destructive/15 text-destructive"
                      : l === "P1"
                        ? "border-warning/40 bg-warning/20 text-warning-foreground"
                        : "border-foreground/30 bg-foreground/10 text-foreground"
                    : "border-border/60 text-muted-foreground hover:bg-accent/40",
                )}
                onClick={() => onLevelsChange(toggle(levels, l))}
              >
                {l}
              </Badge>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">检测方式</Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {allMethods.map((m) => {
            const active = methods.includes(m);
            return (
              <Badge
                key={m}
                variant="outline"
                className={cn(
                  "cursor-pointer border px-2 py-0.5 text-[11px] transition-colors",
                  active
                    ? "gradient-primary border-transparent text-primary-foreground"
                    : "border-border/60 text-muted-foreground hover:bg-accent/40",
                )}
                onClick={() => onMethodsChange(toggle(methods, m))}
              >
                {m}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
        <div>
          <Label className="text-xs font-medium">异常聚类</Label>
          <p className="mt-0.5 text-[11px] text-muted-foreground">同时间窗 + 同维度合并</p>
        </div>
        <Switch checked={cluster} onCheckedChange={onClusterChange} />
      </div>
    </div>
  );
}
