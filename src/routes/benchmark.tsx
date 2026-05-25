import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceTag } from "@/components/SourceTag";
import { Sparkline } from "@/components/Sparkline";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Landmark,
  Building2,
  Rocket,
  BarChart3,
  Sparkles,
  Plus,
  Pin,
  Download,
  Save,
  GitCompare,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

import { policies } from "@/lib/benchmark/policies";
import { peers as allPeers, metricLabels, type PeerRow } from "@/lib/benchmark/peers";
import { tracks } from "@/lib/benchmark/tracks";

import { BenchmarkToolbar } from "@/components/benchmark/BenchmarkToolbar";
import { FilterBar, type FilterDef } from "@/components/benchmark/FilterBar";
import { PolicyCard } from "@/components/benchmark/PolicyCard";
import { EmptyState } from "@/components/benchmark/EmptyState";
import { AiSummaryCard } from "@/components/benchmark/AiSummaryCard";
import { PeerCompanyDrawer } from "@/components/benchmark/PeerCompanyDrawer";
import { TrackDetail } from "@/components/benchmark/TrackDetail";
import { TrackCompareDrawer } from "@/components/benchmark/TrackCompareDrawer";
import { MetricWorkbench } from "@/components/benchmark/workbench/MetricWorkbench";
import { useReportDraft } from "@/contexts/ReportDraftContext";
import { toast } from "sonner";

export const Route = createFileRoute("/benchmark")({
  head: () => ({
    meta: [
      { title: "对标 · 横向比较 | AI经营分析" },
      {
        name: "description",
        content:
          "对标横向比较工作台：政策雷达 · 同行经营 · 新赛道洞察 · 指标对标，统一证据链与 AI 结论。",
      },
    ],
  }),
  component: BenchmarkPage,
});

const policyFilters: FilterDef[] = [
  {
    key: "level",
    label: "政策级别",
    options: [
      { value: "all", label: "全部级别" },
      { value: "国务院", label: "国务院" },
      { value: "部委", label: "部委" },
      { value: "地方", label: "地方" },
      { value: "海外监管", label: "海外监管" },
    ],
  },
  {
    key: "impact",
    label: "影响类型",
    options: [
      { value: "all", label: "全部影响" },
      { value: "good", label: "利好" },
      { value: "high", label: "重大利好" },
      { value: "risk", label: "风险" },
      { value: "neutral", label: "中性" },
    ],
  },
  {
    key: "topic",
    label: "业务主题",
    options: [
      { value: "all", label: "全部主题" },
      { value: "数字化", label: "数字化" },
      { value: "工业自动化", label: "工业自动化" },
      { value: "数据合规", label: "数据合规" },
      { value: "金融", label: "金融" },
      { value: "ESG", label: "ESG" },
      { value: "储能", label: "储能" },
    ],
  },
  {
    key: "time",
    label: "时间",
    options: [
      { value: "all", label: "全部时间" },
      { value: "7", label: "近 7 天" },
      { value: "30", label: "近 30 天" },
      { value: "90", label: "近 90 天" },
    ],
  },
];

const peerFilters: FilterDef[] = [
  {
    key: "period",
    label: "时间口径",
    options: [
      { value: "all", label: "全部" },
      { value: "year", label: "年" },
      { value: "quarter", label: "季" },
      { value: "month", label: "月" },
      { value: "ttm", label: "TTM" },
    ],
  },
  {
    key: "group",
    label: "指标组",
    options: [
      { value: "all", label: "全部指标" },
      { value: "growth", label: "增长" },
      { value: "profit", label: "盈利" },
      { value: "efficiency", label: "效率" },
      { value: "rd", label: "研发" },
    ],
  },
  {
    key: "view",
    label: "范围",
    options: [
      { value: "all", label: "全部公司" },
      { value: "top5", label: "前五" },
      { value: "bottom5", label: "后五" },
    ],
  },
];

function BenchmarkPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader />

      <Tabs defaultValue="policy">
        <TabsList>
          <TabsTrigger value="policy" className="gap-1.5">
            <Landmark className="h-3.5 w-3.5" />
            政策雷达
          </TabsTrigger>
          <TabsTrigger value="peer" className="gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            同行经营
          </TabsTrigger>
          <TabsTrigger value="track" className="gap-1.5">
            <Rocket className="h-3.5 w-3.5" />
            新赛道洞察
          </TabsTrigger>
          <TabsTrigger value="metric" className="gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            指标对标
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policy" className="mt-4 space-y-4">
          <PolicyRadar />
        </TabsContent>
        <TabsContent value="peer" className="mt-4 space-y-4">
          <PeerSection />
        </TabsContent>
        <TabsContent value="track" className="mt-4 space-y-4">
          <TrackSection />
        </TabsContent>
        <TabsContent value="metric" className="mt-4">
          <MetricWorkbench />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PageHeader() {
  const [draftOpen, setDraftOpen] = useState(false);
  const { items, remove, clear } = useReportDraft();
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">对标 ｜ 横向比较</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            政策雷达 · 同行经营 · 新赛道洞察 · 指标对标 — 由外而内的可操作分析工作台
          </p>
        </div>
        <BenchmarkToolbar
          onOpenDraft={() => setDraftOpen(true)}
          onOpenEvidenceHelp={() =>
            toast("证据链规则", {
              description: "所有 AI 结论均带来源链接、抓取时间与置信度，可在抽屉中查看。",
            })
          }
        />
      </div>

      <Sheet open={draftOpen} onOpenChange={setDraftOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base">报告草稿 ({items.length})</SheetTitle>
            <SheetDescription className="text-xs">
              对标分析中加入草稿的内容，可一键生成报告章节。
            </SheetDescription>
          </SheetHeader>
          {items.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="草稿为空"
                description="在卡片或表格中点击「加入报告」即可。"
              />
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-2">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-start justify-between gap-2 rounded-lg border border-border/60 p-2.5"
                  >
                    <div>
                      <div className="text-xs font-medium">{it.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {labelOfType(it.type)} · {new Date(it.addedAt).toLocaleString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => remove(it.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  size="sm"
                  className="gap-1 text-xs gradient-primary text-primary-foreground"
                  onClick={() => toast.success("已生成报告章节草稿")}
                >
                  生成报告章节
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={clear}>
                  清空
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function labelOfType(t: string) {
  return (
    { policy: "政策", peer: "同行", track: "赛道", metric: "指标", "ai-summary": "AI 总结" } as Record<
      string,
      string
    >
  )[t] ?? t;
}

// ===================== 政策雷达 =====================

function PolicyRadar() {
  const [values, setValues] = useState<Record<string, string>>({});
  const onChange = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const filtered = useMemo(
    () =>
      policies.filter(
        (p) =>
          (!values.level || values.level === "all" || p.level === values.level) &&
          (!values.impact || values.impact === "all" || p.impact === values.impact) &&
          (!values.topic || values.topic === "all" || p.topic === values.topic),
      ),
    [values],
  );

  const total = policies.length;
  const hits = filtered.length;
  const major = policies.filter((p) => p.impact === "high" || p.impact === "risk").length;
  const goodCount = policies.filter((p) => p.impact === "good" || p.impact === "high").length;
  const riskCount = policies.filter((p) => p.impact === "risk").length;

  return (
    <div className="space-y-4">
      {/* A. 概览条 */}
      <Card className="border-0 shadow-soft gradient-soft">
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Overview label="本月扫描政策" value="1,284" sub={`+${total} 新增`} />
            <Overview label="命中相关政策" value={String(hits)} sub={`共 ${total} 条`} />
            <Overview label="重大影响" value={String(major)} sub="利好+风险" tone="primary" />
            <Overview
              label="AI 利好 / 风险"
              value={`${goodCount} / ${riskCount}`}
              sub="已分类"
              tone="balance"
            />
          </div>
        </CardContent>
      </Card>

      {/* B. 筛选条 */}
      <FilterBar
        filters={policyFilters}
        values={values}
        onChange={onChange}
        onReset={() => setValues({})}
        right={<SourceTag type="ai">AI 政策雷达</SourceTag>}
      />

      {/* D. AI 推送区 (高优先级) */}
      <Accordion type="single" collapsible defaultValue="ai-push">
        <AccordionItem value="ai-push" className="rounded-xl border border-primary/30 bg-primary/[0.04]">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">AI 高优先级推送</span>
              <Badge variant="secondary" className="bg-primary/15 text-primary text-[10px]">
                {policies.filter((p) => p.priority).length} 条待处理
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              {policies
                .filter((p) => p.priority)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-card/70 p-3"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{p.title}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{p.summary}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        已读
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        稍后
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs gradient-primary text-primary-foreground"
                      >
                        加入报告
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* C. 政策卡片流 */}
      {filtered.length === 0 ? (
        <EmptyState
          title="暂无命中相关政策"
          description="尝试调整筛选条件或扩大时间范围。"
          action={
            <Button variant="outline" size="sm" onClick={() => setValues({})}>
              清空筛选
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {filtered.map((p) => (
            <PolicyCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function Overview({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "primary" | "balance";
}) {
  return (
    <div className="rounded-lg bg-card/60 p-3 backdrop-blur">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div
        className={`mt-1 text-xl font-semibold ${tone === "primary" ? "text-primary" : ""}`}
      >
        {value}
      </div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

// ===================== 同行经营 =====================

function PeerSection() {
  const [pool, setPool] = useState<PeerRow[]>(allPeers);
  const [values, setValues] = useState<Record<string, string>>({ group: "all" });
  const [active, setActive] = useState<PeerRow | null>(null);
  const [sortKey, setSortKey] = useState<keyof PeerRow | null>("revenue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [highlightSelf, setHighlightSelf] = useState(true);

  const sorted = useMemo(() => {
    const list = [...pool];
    if (sortKey) {
      list.sort((a, b) => {
        const av = a[sortKey] as number;
        const bv = b[sortKey] as number;
        if (typeof av !== "number" || typeof bv !== "number") return 0;
        return sortDir === "asc" ? av - bv : bv - av;
      });
    }
    if (highlightSelf) {
      const self = list.find((p) => p.self);
      if (self) return [self, ...list.filter((p) => !p.self)];
    }
    return list;
  }, [pool, sortKey, sortDir, highlightSelf]);

  const cols: { key: keyof PeerRow; label: string; suffix?: string }[] = [
    { key: "revenue", label: "营收(亿)" },
    { key: "growth", label: "增长率", suffix: "%" },
    { key: "margin", label: "毛利率", suffix: "%" },
    { key: "roe", label: "ROE", suffix: "%" },
    { key: "rd", label: "研发占比", suffix: "%" },
  ];

  const sortBy = (k: keyof PeerRow) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("desc");
    }
  };

  return (
    <div className="space-y-4">
      {/* A. 样本池 */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">样本池</div>
            <SourceTag>来源 · Wind / 巨潮资讯</SourceTag>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pool.map((p) => (
              <Badge
                key={p.id}
                variant="secondary"
                className={`gap-1 ${p.self ? "bg-primary/15 text-primary" : ""}`}
              >
                {p.name}
                {!p.self && (
                  <button
                    onClick={() => setPool((prev) => prev.filter((x) => x.id !== p.id))}
                    className="opacity-60 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-6 gap-1 text-xs">
                  <Plus className="h-3 w-3" />
                  添加公司
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="搜索公司或股票代码" className="h-8 pl-7 text-xs" />
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {allPeers
                    .filter((p) => !pool.find((x) => x.id === p.id))
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPool((prev) => [...prev, p])}
                        className="block w-full rounded px-2 py-1 text-left hover:bg-accent/40"
                      >
                        {p.name}
                      </button>
                    ))}
                  {allPeers.every((p) => pool.find((x) => x.id === p.id)) && (
                    <div className="px-2 py-1">已全部加入</div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* B. 控制条 */}
      <FilterBar
        filters={peerFilters}
        values={values}
        onChange={(k, v) => setValues((p) => ({ ...p, [k]: v }))}
        onReset={() => setValues({})}
        right={
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={highlightSelf}
              onChange={(e) => setHighlightSelf(e.target.checked)}
              className="h-3 w-3"
            />
            高亮本企业
          </label>
        }
      />

      {/* C. 多维对比表 */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>公司</TableHead>
                {cols.map((c) => (
                  <TableHead
                    key={c.key as string}
                    className="cursor-pointer select-none"
                    onClick={() => sortBy(c.key)}
                    title={`点击排序 · ${metricLabels[c.key as string]?.label ?? c.label}`}
                  >
                    {c.label}
                    {sortKey === c.key && (
                      <span className="ml-1 text-[10px] text-primary">
                        {sortDir === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </TableHead>
                ))}
                <TableHead>营收趋势</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((p) => (
                <TableRow
                  key={p.id}
                  onClick={() => setActive(p)}
                  className={`cursor-pointer ${p.self && highlightSelf ? "bg-primary/5" : ""}`}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {p.self && highlightSelf && <Pin className="h-3 w-3 text-primary" />}
                      {p.name}
                      {p.self && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/15 text-primary text-[10px]"
                        >
                          本企业
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  {cols.map((c) => (
                    <TableCell
                      key={c.key as string}
                      className={p.self && c.key === sortKey ? "font-semibold text-primary" : ""}
                    >
                      {(p as any)[c.key]}
                      {c.suffix}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Sparkline data={p.trend} width={120} height={28} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 表格操作区 */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
          <Download className="h-3.5 w-3.5" />
          导出 CSV
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
          <Save className="h-3.5 w-3.5" />
          保存视图
        </Button>
        <Button
          size="sm"
          className="h-8 gap-1 text-xs gradient-primary text-primary-foreground"
          onClick={() => toast.success("已生成对标摘要")}
        >
          <Sparkles className="h-3.5 w-3.5" />
          生成对标摘要
        </Button>
      </div>

      {/* D. AI 总结 */}
      <AiSummaryCard
        id="peer-summary"
        title="AI 同行对标总结"
        evidence={{
          title: "同行对标 · AI 总结",
          links: [
            { name: "Wind", url: "#" },
            { name: "巨潮资讯", url: "#" },
          ],
          fetchedAt: "2026-04-30 22:00",
          parsedAt: "2026-04-30 22:03",
          schema: "样本池 5 家上市公司 2025 年报 + Q1 季报",
          relatedMetrics: ["营收", "ROE", "毛利率", "研发占比"],
          confidence: 0.86,
        }}
        footer={
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">重点跟踪推荐：</span>
            <Badge variant="secondary" className="text-[10px]">行业龙头 A</Badge>
            <Badge variant="secondary" className="text-[10px]">新兴黑马 D</Badge>
          </div>
        }
      >
        本企业营收规模位列样本池第 3，<span className="font-semibold text-success">毛利率高于行业均值 2.3pt</span>，
        但 ROE 落后龙头 3.4pt，主要差距在<span className="font-semibold">资产周转率</span>。
        研发投入 5.2%，<span className="font-semibold text-warning-foreground">距龙头 7.1% 仍有差距</span>，
        建议加大数字化转型投入。
      </AiSummaryCard>

      <PeerCompanyDrawer peer={active} onClose={() => setActive(null)} />
    </div>
  );
}

// ===================== 新赛道洞察 =====================

function TrackSection() {
  const [active, setActive] = useState(tracks[0].id);
  const [compareOpen, setCompareOpen] = useState(false);
  const current = tracks.find((t) => t.id === active)!;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                active === t.id
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border/60 text-muted-foreground hover:bg-accent/40"
              }`}
            >
              {t.name}
            </button>
          ))}
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-muted-foreground">
            <Plus className="h-3 w-3" />
            扩展赛道
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-xs"
          onClick={() => setCompareOpen(true)}
        >
          <GitCompare className="h-3.5 w-3.5" />
          对比赛道
        </Button>
      </div>

      {/* 摘要卡 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {tracks.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`text-left ${active === t.id ? "ring-2 ring-primary/50 rounded-2xl" : ""}`}
          >
            <Card className="border-border/60 shadow-sm overflow-hidden h-full">
              <div className="gradient-primary h-1" />
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.stage}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary leading-none">{t.score}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">机会评分</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <Mini label="CAGR" value={t.cagr} />
                  <Mini label="匹配度" value={t.fit} />
                  <Mini label="风险" value={t.risk} />
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* 详情 */}
      <TrackDetail t={current} />

      <TrackCompareDrawer open={compareOpen} onOpenChange={setCompareOpen} />
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-accent/30 px-1.5 py-1">
      <div className="text-[9px] text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold mt-0.5">{value}</div>
    </div>
  );
}
