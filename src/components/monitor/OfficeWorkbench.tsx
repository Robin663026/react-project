import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceTag } from "@/components/SourceTag";
import { Sparkline } from "@/components/Sparkline";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMonitorRole, officeTitle, type OfficeKey } from "@/hooks/useMonitorRole";
import { officeData, sectorOptions, northStarLite, type SectorKey } from "@/lib/monitor/office";
import { TrendingDown, TrendingUp, AlertTriangle, ListChecks, Sparkles, Download, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const statusChip: Record<"normal" | "warning" | "critical", string> = {
  normal: "bg-success/15 text-success ring-1 ring-success/30",
  warning: "bg-warning/20 text-warning-foreground ring-1 ring-warning/40",
  critical: "bg-destructive/15 text-destructive ring-1 ring-destructive/30",
};
const statusText = { normal: "正常", warning: "预警", critical: "严重" } as const;
const priorityText = { high: "高", mid: "中", low: "低" } as const;
const priorityChip = {
  high: "bg-destructive/15 text-destructive",
  mid: "bg-warning/20 text-warning-foreground",
  low: "bg-muted text-muted-foreground",
} as const;

export function OfficeWorkbench({ office }: { office: OfficeKey }) {
  const data = officeData[office];
  const meta = officeTitle[office];
  const [sector, setSector] = useState<SectorKey>("all");

  return (
    <div className="space-y-5">
      {/* OfficeContextBar */}
      <Card className="border-0 shadow-soft gradient-soft">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{meta.title}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{meta.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/15 text-primary">处室专员视角</Badge>
            <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => toast.success("已生成处室 AI 简报")}>
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI 简报
            </Button>
            <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => toast.success("已导出当前工作台")}>
              <Download className="h-3.5 w-3.5" />
              导出
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 战略管理处：轻量北极星 */}
      {office === "strategy" && (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">轻量北极星摘要</div>
              <SourceTag type="ai">AI 摘要</SourceTag>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {northStarLite.map((n) => (
                <div key={n.name} className="rounded-lg border border-border/60 bg-card/60 p-3">
                  <div className="text-[11px] text-muted-foreground">{n.name}</div>
                  <div className="mt-1 bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-xl font-semibold text-transparent">
                    {n.value}
                  </div>
                  <div className="mt-1 text-[11px] text-foreground/70">{n.delta}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SectorSwitcher */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">板块</span>
        {sectorOptions.map((s) => (
          <button
            key={s.key}
            onClick={() => setSector(s.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              sector === s.key
                ? "gradient-primary text-primary-foreground border-transparent shadow-soft"
                : "border-border/60 bg-card hover:bg-accent"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* OfficeMetricGrid */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{meta.title} · 指标卡组</div>
            <span className="text-[11px] text-muted-foreground">单位：见各卡 · 比较：vs 上期</span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {data.metrics.map((m) => {
              const up = m.yoy >= 0;
              return (
                <div key={m.key} className="rounded-xl border border-border/60 bg-card/60 p-3 transition-all hover:-translate-y-0.5 hover:shadow-soft">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground truncate">{m.label}</span>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${statusChip[m.status]}`}>
                      {statusText[m.status]}
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-2xl font-semibold tabular-nums text-transparent">
                      {m.value}
                    </span>
                    <span className={`inline-flex items-center text-[10px] font-medium ${up ? "text-success" : "text-destructive"}`}>
                      {up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      {up ? "+" : ""}{m.yoy}%
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">目标 {m.target}</div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${m.status === "normal" ? "bg-success" : m.status === "warning" ? "bg-warning" : "bg-destructive"}`}
                      style={{ width: `${Math.min(m.complete, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ExceptionObjectPool */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning-foreground" />
            <span className="text-sm font-semibold">异常对象池</span>
            <span className="text-[11px] text-muted-foreground">共 {data.exceptions.length} 项</span>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {data.exceptions.map((e, i) => (
              <div key={i} className="rounded-lg border border-border/60 bg-card/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{e.name}</span>
                  <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${statusChip[e.status]}`}>
                    {statusText[e.status]}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span>类型 · {e.type}</span>
                  <span>责任 · {e.owner}</span>
                  {e.due && <span>截止 · {e.due}</span>}
                </div>
                {e.note && <div className="mt-1 text-[11px] text-foreground/70">{e.note}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* TrendAndDetailPanel */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-lg border border-border/60 bg-card/40 p-3">
            <div className="mb-2 text-xs font-semibold">{data.trend.label}</div>
            <Sparkline data={data.trend.data} width={240} height={100} />
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>最近 5 期</span>
              <span>{data.trend.legend}</span>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-border/60 bg-card/40">
            <div className="border-b border-border/60 px-4 py-2.5 text-sm font-medium">明细</div>
            <Table>
              <TableHeader>
                <TableRow>
                  {data.detail.columns.map((c) => (
                    <TableHead key={c}>{c}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.detail.rows.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((cell, j) => (
                      <TableCell key={j} className="text-xs">{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ActionWorkbench */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">工作动作区</span>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {data.actions.map((a, i) => (
              <div key={i} className="rounded-lg border border-border/60 bg-card/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium">{a.title}</span>
                  <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${priorityChip[a.priority]}`}>
                    {priorityText[a.priority]}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span>截止 · {a.due}</span>
                  <span>归属 · {a.owner}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 h-7 gap-0.5 px-2 text-xs"
                  onClick={() => toast.success(`已分派：${a.title}`)}
                >
                  分派 <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
