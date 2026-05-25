import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceTag } from "@/components/SourceTag";
import { AlertTriangle, ChevronRight, ChevronDown, Layers, Clock, Target } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type AnomalyLevel = "P0" | "P1" | "P2";
export type DetectMethod = "阈值" | "同环比" | "分位数" | "季节性" | "结构突变" | "业务规则";

export type Anomaly = {
  id: string;
  title: string;
  level: AnomalyLevel;
  method: DetectMethod;
  metric: string;
  caliberVersion: string;
  updatedAt: string;
  scope: string;
  intensity: number; // 0-100
  relatedDashboards: string[];
  desc: string;
  cluster?: Anomaly[];
};

const levelStyles: Record<AnomalyLevel, string> = {
  P0: "bg-destructive/15 text-destructive border-destructive/30",
  P1: "bg-warning/20 text-warning-foreground border-warning/40",
  P2: "bg-muted text-muted-foreground border-border/60",
};

const intensityColor = (n: number) =>
  n >= 70 ? "bg-destructive" : n >= 40 ? "bg-warning" : "bg-muted-foreground/60";

export function AnomalyCard({
  anomaly,
  onInvestigate,
}: {
  anomaly: Anomaly;
  onInvestigate: (a: Anomaly) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasCluster = !!anomaly.cluster && anomaly.cluster.length > 0;

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                anomaly.level === "P0" ? "text-destructive" : anomaly.level === "P1" ? "text-warning" : "text-muted-foreground",
              )}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-medium">{anomaly.title}</h4>
                <Badge variant="outline" className={cn("h-5 border px-1.5 text-[10px]", levelStyles[anomaly.level])}>
                  {anomaly.level}
                </Badge>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {anomaly.method}
                </Badge>
                {hasCluster && (
                  <Badge variant="secondary" className="h-5 gap-1 px-1.5 text-[10px]">
                    <Layers className="h-3 w-3" />
                    聚合 {anomaly.cluster!.length + 1}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{anomaly.desc}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground sm:grid-cols-4">
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            <span className="truncate">{anomaly.metric}</span>
          </div>
          <div className="truncate">口径 {anomaly.caliberVersion}</div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {anomaly.updatedAt}
          </div>
          <div className="truncate">范围 · {anomaly.scope}</div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
            <span>异常强度</span>
            <span className="font-medium text-foreground">{anomaly.intensity}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full transition-all", intensityColor(anomaly.intensity))} style={{ width: `${anomaly.intensity}%` }} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {anomaly.relatedDashboards.map((d) => (
              <SourceTag key={d}>{d}</SourceTag>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {hasCluster && (
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                子异常
              </Button>
            )}
            <Button size="sm" className="h-7 gradient-primary text-primary-foreground" onClick={() => onInvestigate(anomaly)}>
              进入根因 <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {hasCluster && expanded && (
          <div className="space-y-2 rounded-lg border border-dashed border-border/60 p-2">
            {anomaly.cluster!.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between text-xs">
                <span className="truncate">
                  <span className="text-muted-foreground">[{sub.level}]</span> {sub.title}
                </span>
                <span className="text-muted-foreground">强度 {sub.intensity}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
