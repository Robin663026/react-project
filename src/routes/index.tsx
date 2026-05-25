import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sparkline } from "@/components/Sparkline";
import { SourceTag } from "@/components/SourceTag";
import { cn } from "@/lib/utils";
import {
  ArrowRight, ArrowUp, ChevronRight, Sparkles,
  Target, TrendingDown, TrendingUp, UserCircle2,
} from "lucide-react";
import { HomeRoleProvider, useHomeRole } from "@/hooks/useHomeRole";
import {
  ROLE_PRESETS, SECTOR_OPTIONS,
  COMPANY_METRICS, NORTH_STAR_SUMMARY,
  filterBySector, getQuickEntries, getRecommendations, getTasks, pickMetricsByOffice,
  type MetricCard, type Status, type TaskGroup, type TaskTone,
} from "@/lib/home/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "首页 · AI经营分析工作台" },
      { name: "description", content: "按角色权限自动切换内容优先级的统一经营分析入口：领导看全局，专员看板块，二级公司看本公司。" },
    ],
  }),
  component: HomePage,
});

const TODAY = { date: "2026 年 5 月 13 日", updatedAt: "09:12" };

const TONE_CLS: Record<TaskTone, string> = {
  danger: "bg-destructive/15 text-destructive",
  warning: "bg-warning/20 text-warning-foreground",
  primary: "bg-primary/15 text-primary",
  muted: "bg-muted text-muted-foreground",
};

const STATUS_CLS: Record<Status, { label: string; cls: string }> = {
  normal: { label: "正常", cls: "bg-success/15 text-success" },
  warning: { label: "预警", cls: "bg-warning/20 text-warning-foreground" },
  danger: { label: "异常", cls: "bg-destructive/15 text-destructive" },
};

/* ============================================================ */
function HomePage() {
  return (
    <HomeRoleProvider>
      <HomeBody />
    </HomeRoleProvider>
  );
}

function HomeBody() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <TopStatusBar />
      <RoleSummaryBar />
      <AiEntry />
      <CoreBoard />
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><TasksPanel /></div>
        <div className="lg:col-span-1"><QuickEntries /></div>
      </section>
    </div>
  );
}

/* =================== ① 顶部状态栏 + 角色切换 =================== */
function TopStatusBar() {
  const { roleKey, setRoleKey, role } = useHomeRole();
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">首页</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {TODAY.date} · 更新于 {TODAY.updatedAt} ·{" "}
          <span className="text-foreground">当前视角：{role.label}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">切换角色</span>
        <Select value={roleKey} onValueChange={setRoleKey}>
          <SelectTrigger className="glass h-9 w-[200px] rounded-full border-0 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_PRESETS.map((r) => (
              <SelectItem key={r.key} value={r.key} className="text-sm">{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}

/* =================== ② 角色摘要区 =================== */
function RoleSummaryBar() {
  const { role, sector, setSector } = useHomeRole();
  const showSectorTabs = role.roleType === "office_specialist";
  return (
    <Card className="hover:translate-y-0">
      <CardContent className="flex flex-wrap items-center gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-soft">
            <UserCircle2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{role.label}</span>
              <Badge variant="secondary" className="rounded-md text-[10px]">{role.roleType === "group_leader" ? "领导视角" : role.roleType === "office_specialist" ? "专员视角" : "二级公司视角"}</Badge>
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              关注范围：{role.scopeText} · 当前重点：{role.focusText}
            </div>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {showSectorTabs && (
            <Tabs value={sector} onValueChange={(v) => setSector(v as typeof sector)}>
              <TabsList className="h-8">
                {SECTOR_OPTIONS.map((s) => (
                  <TabsTrigger key={s.value} value={s.value} className="text-xs px-3">{s.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          {role.roleType === "subsidiary_user" && (
            <Badge className="rounded-full bg-primary/15 text-primary">主体：{role.shortLabel}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* =================== ③ AI 总入口 =================== */
function AiEntry() {
  const { roleKey } = useHomeRole();
  const recs = getRecommendations(roleKey);
  return (
    <Card className="relative overflow-hidden hover:translate-y-0">
      <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-primary-glow/15 blur-3xl" />
      <div className="relative p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">让数据，自己开口说话</div>
            <div className="text-[11px] text-muted-foreground">问数 · 归因 · 生成报告 · 预测，一句话搞定</div>
          </div>
        </div>
        <div className="relative">
          <Textarea
            placeholder="向 AI 提问，例如：分析当前板块异常并生成简报…"
            className="min-h-[88px] resize-none rounded-xl border-border/60 bg-background/60 pr-14 text-sm shadow-sm focus-visible:ring-primary/40"
          />
          <Button
            size="icon"
            className="absolute bottom-3 right-3 h-9 w-9 rounded-lg gradient-primary text-primary-foreground shadow-soft"
            aria-label="发送"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {recs.map((text) => (
            <button
              key={text}
              type="button"
              className="group inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-accent/40 hover:text-foreground"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              {text}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* =================== ④ 核心看板区 =================== */
function CoreBoard() {
  const { role, sector } = useHomeRole();

  if (role.boardMode === "global_summary") {
    return (
      <section>
        <SectionHeader title="北极星看板" subtitle="集团牵引指标与战略目标达成状态" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NORTH_STAR_SUMMARY.map((n) => <NorthStarCard key={n.name} item={n} />)}
        </div>
      </section>
    );
  }

  if (role.boardMode === "company_workspace") {
    return (
      <section>
        <SectionHeader title="本公司重点指标" subtitle={`${role.shortLabel} · 综合经营状态摘要`} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMPANY_METRICS.map((m) => <MetricKpiCard key={m.name} kpi={m} />)}
        </div>
      </section>
    );
  }

  // sector_metric_workspace
  const office = role.officeScope!;
  const all = pickMetricsByOffice(office);
  const list = filterBySector(all, sector);
  const showNorthStarStrip = role.officeScope === "strategy";
  const sectorLabel = SECTOR_OPTIONS.find((s) => s.value === sector)?.label ?? "全部板块";

  return (
    <section className="space-y-4">
      {showNorthStarStrip && (
        <Card className="hover:translate-y-0">
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Target className="h-3.5 w-3.5 text-primary" />
              北极星摘要
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
              {NORTH_STAR_SUMMARY.map((n) => (
                <div key={n.name} className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{n.name}</span>
                  <span className="font-semibold tabular-nums">{n.value}</span>
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    STATUS_CLS[n.status].cls,
                  )}>{n.delta}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/monitor">北极星详情 <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="mb-1 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">板块指标工作台</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {role.shortLabel} · 当前板块：{sectorLabel} · 共 {list.length} 项指标
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/monitor">进入监控 <ChevronRight className="h-4 w-4" /></Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => <MetricKpiCard key={m.name} kpi={m} />)}
      </div>
    </section>
  );
}

function NorthStarCard({ item }: { item: typeof NORTH_STAR_SUMMARY[number] }) {
  const s = STATUS_CLS[item.status];
  return (
    <Card className="hover:translate-y-0">
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{item.name}</div>
          <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", s.cls)}>{s.label}</span>
        </div>
        <div className="text-2xl font-semibold tracking-tight tabular-nums">{item.value}</div>
        <div className="text-[11px] text-muted-foreground">较上期 {item.delta}</div>
      </CardContent>
    </Card>
  );
}

function MetricKpiCard({ kpi }: { kpi: MetricCard }) {
  const s = STATUS_CLS[kpi.status];
  return (
    <Card className="hover:translate-y-0">
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{kpi.name}</div>
          <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", s.cls)}>{s.label}</span>
        </div>
        <div className="text-xl font-semibold tracking-tight tabular-nums">{kpi.value}</div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className={kpi.up ? "text-success" : "text-destructive"}>
            {kpi.up ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />} YoY {kpi.yoy}
          </span>
          <span className="text-muted-foreground">MoM {kpi.mom}</span>
        </div>
        <div className="text-[10px] text-muted-foreground">{kpi.threshold}</div>
        <Sparkline data={kpi.data} width={180} height={32} />
        <div className="flex items-center gap-1 border-t border-border/60 pt-2 text-[11px]">
          <Link to="/monitor" className="text-primary hover:underline">查看详情</Link>
          <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

/* =================== ⑥ 异常与待办区 =================== */
function TasksPanel() {
  const { roleKey, role } = useHomeRole();
  const groups = useMemo(() => getTasks(roleKey), [roleKey]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <Card className="h-full hover:translate-y-0">
      <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">
            {role.roleType === "group_leader" ? "重点异常 · 待决策" :
             role.roleType === "subsidiary_user" ? "本公司预警 · 集团待办" :
             "板块异常 · 我的待办"}
          </CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">共 {total} 项需要关注</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/monitor">全部处理 <ChevronRight className="h-4 w-4" /></Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {groups.map((g) => <TaskGroupCard key={g.key} group={g} />)}
      </CardContent>
    </Card>
  );
}

function TaskGroupCard({ group }: { group: TaskGroup }) {
  const Icon = group.icon;
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", TONE_CLS[group.tone])}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="text-sm font-medium">{group.title}</div>
        <Badge variant="secondary" className="ml-auto rounded-md text-[10px]">{group.items.length}</Badge>
      </div>
      <ul className="space-y-1.5">
        {group.items.map((it) => (
          <li key={it.text} className="flex items-start gap-2 text-xs">
            <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-foreground">{it.text}</div>
              <div className="text-[10px] text-muted-foreground">{it.meta}</div>
            </div>
            {it.level && (
              <span className={cn(
                "shrink-0 rounded-full px-1.5 py-0.5 text-[10px]",
                it.level === "高" ? "bg-destructive/15 text-destructive" :
                it.level === "中" ? "bg-warning/20 text-warning-foreground" :
                "bg-muted text-muted-foreground",
              )}>{it.level}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =================== ⑦ 快捷入口区 =================== */
function QuickEntries() {
  const { roleKey } = useHomeRole();
  const entries = getQuickEntries(roleKey);
  return (
    <Card className="h-full hover:translate-y-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">快捷入口</CardTitle>
        <p className="mt-0.5 text-xs text-muted-foreground">缩短跳转路径</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.map((e) => (
          <Link
            key={e.label}
            to={e.to}
            className="group flex items-center justify-between rounded-lg border border-border/60 bg-card/60 p-3 transition-colors hover:bg-accent/40"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <e.icon className="h-4 w-4" />
              </span>
              <div className="text-sm font-medium">{e.label}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

/* =================== Helpers =================== */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
