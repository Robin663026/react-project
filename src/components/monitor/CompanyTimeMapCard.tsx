import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceTag } from "@/components/SourceTag";
import { Sparkles, Compass, Wallet, Briefcase, Scale } from "lucide-react";
import { subsidiaryTimeMap, companyTimeMapFocus, type Cell, type CellStatus } from "@/lib/monitor/subsidiaryTimeMap";
import { companyLabel, type CompanyKey } from "@/hooks/useMonitorRole";

const timeAxis = [
  { key: "quarter", label: "季度分析", sub: "Q1 2026" },
  { key: "year", label: "年度执行", sub: "2026 进度" },
  { key: "fiveYear", label: "五年规划", sub: "2024-2028" },
  { key: "forecast", label: "未来预测", sub: "AI 推演 · 2027" },
] as const;

const dimensions = [
  { key: "strategy", label: "战略发展", icon: Compass, color: "text-primary" },
  { key: "finance", label: "财务", icon: Wallet, color: "text-success" },
  { key: "ops", label: "业务管理", icon: Briefcase, color: "text-primary" },
  { key: "legal", label: "风控合规", icon: Scale, color: "text-warning-foreground" },
] as const;

const statusStyle: Record<CellStatus, string> = {
  good: "bg-success/10 border-success/30 text-success",
  warn: "bg-warning/15 border-warning/40 text-warning-foreground",
  risk: "bg-destructive/10 border-destructive/30 text-destructive",
  future: "bg-primary/10 border-primary/30 text-primary",
};
const statusLabel: Record<CellStatus, string> = {
  good: "良好",
  warn: "关注",
  risk: "风险",
  future: "预测",
};

export function CompanyTimeMapCard({
  company,
  onCellClick,
}: {
  company: CompanyKey;
  onCellClick: (dim: string, time: string) => void;
}) {
  const data = subsidiaryTimeMap[company];

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex-row items-end justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base">{companyLabel[company]} · 公司时间地图</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">{companyTimeMapFocus[company]}</p>
        </div>
        <SourceTag type="ai">公司专有视角</SourceTag>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="mb-2 grid grid-cols-[140px_repeat(4,1fr)] gap-2">
              <div className="px-2 text-xs font-medium text-muted-foreground">维度 \ 时间</div>
              {timeAxis.map((t) => (
                <div key={t.key} className="rounded-lg gradient-soft px-3 py-2 text-center">
                  <div className="text-xs font-semibold">{t.label}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{t.sub}</div>
                </div>
              ))}
            </div>

            {dimensions.map((d) => (
              <div key={d.key} className="mb-2 grid grid-cols-[140px_repeat(4,1fr)] gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2">
                  <d.icon className={`h-4 w-4 ${d.color}`} />
                  <span className="text-sm font-medium">{d.label}</span>
                </div>
                {timeAxis.map((t) => {
                  const cell: Cell = data[d.key][t.key];
                  return (
                    <button
                      key={t.key}
                      onClick={() => onCellClick(d.key, t.key)}
                      className={`group relative cursor-pointer rounded-lg border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft ${statusStyle[cell.status]}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{cell.label}</span>
                        <span className="rounded-full bg-background/60 px-1.5 py-0.5 text-[9px] font-medium">
                          {statusLabel[cell.status]}
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-foreground/75">
                        {cell.detail}
                      </p>
                      {cell.status === "future" && (
                        <Sparkles className="absolute right-2 top-2 h-3 w-3 text-primary opacity-60" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span>图例：</span>
          {(["good", "warn", "risk", "future"] as CellStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full border ${statusStyle[s]}`} />
              {statusLabel[s]}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
