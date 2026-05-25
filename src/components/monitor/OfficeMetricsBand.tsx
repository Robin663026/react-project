import { Card, CardContent } from "@/components/ui/card";
import { SourceTag } from "@/components/SourceTag";
import { ChevronRight, TrendingDown, TrendingUp, Coins, ClipboardCheck, Compass, Lightbulb } from "lucide-react";
import { useMonitorRole, type OfficeKey } from "@/hooks/useMonitorRole";
import { officeData } from "@/lib/monitor/office";

type BandKpi = { label: string; value: string; yoy: number };
type BandCard = {
  office: OfficeKey;
  title: string;
  icon: typeof Coins;
  summary: string;
  kpis: BandKpi[];
};

const bandCards: BandCard[] = [
  {
    office: "investment",
    title: "投资-资本处",
    icon: Coins,
    summary: "项目执行整体偏慢，5 个重大项目超期需重点关注",
    kpis: [
      { label: "投资计划完成", value: "62%", yoy: 4.2 },
      { label: "IRR 达标率", value: "78%", yoy: 2.1 },
      { label: "重大超期数", value: "5", yoy: 25 },
      { label: "投后评价完成", value: "84%", yoy: 3.6 },
    ],
  },
  {
    office: "performance",
    title: "业绩考核处",
    icon: ClipboardCheck,
    summary: "清算与结果确认进度落后，需加快流程线上化",
    kpis: [
      { label: "目标表完成", value: "92%", yoy: 6.2 },
      { label: "定量清算完成", value: "65%", yoy: -4.0 },
      { label: "结果确认率", value: "58%", yoy: -3.2 },
      { label: "逾期对象数", value: "4", yoy: 33 },
    ],
  },
  {
    office: "strategy",
    title: "战略管理处",
    icon: Compass,
    summary: "战略推进总体平稳，上市公司质量提升任务承压",
    kpis: [
      { label: "战略任务完成", value: "68%", yoy: 5.4 },
      { label: "重点事项按期", value: "82%", yoy: 2.6 },
      { label: "改革事项完成", value: "73%", yoy: 4.1 },
      { label: "上市质量提升", value: "66%", yoy: -1.8 },
    ],
  },
  {
    office: "innovation",
    title: "科技创新处",
    icon: Lightbulb,
    summary: "研发投入与平台建设节奏稳健，部分重点项目延期",
    kpis: [
      { label: "研发投入强度", value: "3.6%", yoy: 0.4 },
      { label: "项目按期完成", value: "76%", yoy: -2.5 },
      { label: "平台数量", value: "12", yoy: 9.1 },
      { label: "成果产出数", value: "18", yoy: 12.5 },
    ],
  },
];

// Avoid circular import via hook label
const officeRoleKey: Record<OfficeKey, string> = {
  investment: "office_investment",
  performance: "office_performance",
  strategy: "office_strategy",
  innovation: "office_innovation",
};

export function OfficeMetricsBand() {
  const { setRoleKey } = useMonitorRole();
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-sm font-semibold">四处室关键指标带</div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              领导视角摘要 · 点击进入对应处室专题工作台
            </p>
          </div>
          <SourceTag type="ai">AI 摘要</SourceTag>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {bandCards.map((c) => {
            // ensure data parity
            void officeData[c.office];
            const Icon = c.icon;
            return (
              <button
                key={c.office}
                onClick={() => setRoleKey(officeRoleKey[c.office])}
                className="group relative overflow-hidden rounded-xl border border-border/60 gradient-soft p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary text-primary-foreground shadow-soft">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-semibold">{c.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-foreground/75 line-clamp-2">{c.summary}</p>
                <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5">
                  {c.kpis.map((k) => {
                    const up = k.yoy >= 0;
                    const positive = up; // visual only
                    return (
                      <div key={k.label} className="rounded-md bg-card/60 px-2 py-1.5">
                        <div className="text-[10px] text-muted-foreground truncate">{k.label}</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-semibold tabular-nums">{k.value}</span>
                          <span className={`inline-flex items-center text-[10px] ${positive ? "text-success" : "text-destructive"}`}>
                            {up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                            {up ? "+" : ""}{k.yoy}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
