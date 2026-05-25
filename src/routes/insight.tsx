import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SourceTag } from "@/components/SourceTag";
import { AnomalyCard, type Anomaly, type AnomalyLevel, type DetectMethod } from "@/components/insight/AnomalyCard";
import { AnomalyFilters } from "@/components/insight/AnomalyFilters";
import { ContributionBars, type Contribution } from "@/components/insight/ContributionBars";
import { WaterfallChart, type WaterfallItem } from "@/components/insight/WaterfallChart";
import { DecompositionTree, type TreeNode } from "@/components/insight/DecompositionTree";
import { HypothesisCard, type Hypothesis } from "@/components/insight/HypothesisCard";
import { EvidenceChain, type Evidence } from "@/components/insight/EvidenceChain";
import { RootCauseSummary, type Summary } from "@/components/insight/RootCauseSummary";
import { BriefingPanel } from "@/components/insight/BriefingPanel";
import { Activity, AlertOctagon, Sparkles } from "lucide-react";

export const Route = createFileRoute("/insight")({
  head: () => ({
    meta: [
      { title: "洞察Why · 异常与根因" },
      { name: "description", content: "异常中心、根因工作台、洞察简报：从发现异常到可复核结论。" },
    ],
  }),
  component: InsightPage,
});

// ---------- Mock Data ----------
const mockAnomalies: Anomaly[] = [
  {
    id: "a1",
    title: "华南区销售环比 -12%",
    level: "P0",
    method: "同环比",
    metric: "销售额",
    caliberVersion: "v2.3",
    updatedAt: "2h 前",
    scope: "二级 · 华南区",
    intensity: 86,
    relatedDashboards: ["销售看板", "区域报告"],
    desc: "华南区周环比明显下滑，主要受零售渠道拖累。",
    cluster: [
      { id: "a1-1", title: "佛山门店 -18%", level: "P0", method: "同环比", metric: "销售额", caliberVersion: "v2.3", updatedAt: "2h", scope: "三级 · 佛山", intensity: 78, relatedDashboards: [], desc: "" },
      { id: "a1-2", title: "东莞门店 -14%", level: "P1", method: "同环比", metric: "销售额", caliberVersion: "v2.3", updatedAt: "2h", scope: "三级 · 东莞", intensity: 65, relatedDashboards: [], desc: "" },
    ],
  },
  {
    id: "a2",
    title: "原材料成本 +8.4%",
    level: "P0",
    method: "结构突变",
    metric: "采购成本",
    caliberVersion: "v1.8",
    updatedAt: "4h 前",
    scope: "集团 · 全品类",
    intensity: 78,
    relatedDashboards: ["成本看板", "供应链月报"],
    desc: "PVC 与铜价格上行，影响 Q2 毛利预测。",
  },
  {
    id: "a3",
    title: "毛利率跌破阈值 28%",
    level: "P0",
    method: "阈值",
    metric: "毛利率",
    caliberVersion: "v2.1",
    updatedAt: "6h 前",
    scope: "集团",
    intensity: 72,
    relatedDashboards: ["财务看板"],
    desc: "毛利率连续 3 周下行，已触发财务规则告警。",
  },
  {
    id: "a4",
    title: "电商退货率上升 2.1pt",
    level: "P1",
    method: "同环比",
    metric: "退货率",
    caliberVersion: "v1.5",
    updatedAt: "1d 前",
    scope: "业务 · 电商",
    intensity: 58,
    relatedDashboards: ["电商运营看板"],
    desc: "新品 X3 系列退货集中在尺码问题。",
  },
  {
    id: "a5",
    title: "应收账款 90+ 占比 +3pt",
    level: "P1",
    method: "业务规则",
    metric: "AR 90+ 占比",
    caliberVersion: "v2.0",
    updatedAt: "1d 前",
    scope: "集团 · 大客户",
    intensity: 54,
    relatedDashboards: ["财务看板"],
    desc: "建议加强大客户对账与催收节奏。",
  },
  {
    id: "a6",
    title: "库存周转天数升至 62 天",
    level: "P1",
    method: "分位数",
    metric: "库存周转",
    caliberVersion: "v1.9",
    updatedAt: "2d 前",
    scope: "集团 · 春装",
    intensity: 49,
    relatedDashboards: ["供应链看板"],
    desc: "春装尾货叠加 X3 备货，库存上行。",
  },
  {
    id: "a7",
    title: "北区客单价回落 -3.5%",
    level: "P2",
    method: "同环比",
    metric: "客单价",
    caliberVersion: "v2.3",
    updatedAt: "3d 前",
    scope: "二级 · 北区",
    intensity: 32,
    relatedDashboards: ["销售看板"],
    desc: "可能与竞品降价相关，需对标确认。",
  },
  {
    id: "a8",
    title: "门店坪效季节性走弱",
    level: "P2",
    method: "季节性",
    metric: "坪效",
    caliberVersion: "v1.7",
    updatedAt: "3d 前",
    scope: "业务 · 线下零售",
    intensity: 28,
    relatedDashboards: ["门店运营看板"],
    desc: "符合历史季节性回落模式，影响有限。",
  },
];

const contributions: Contribution[] = [
  { name: "渠道结构", value: -38, scope: "零售下滑" },
  { name: "促销折扣", value: -22, scope: "毛利压缩" },
  { name: "新品 X3", value: 28, scope: "新品贡献" },
  { name: "客单价", value: 18, scope: "会员复购" },
  { name: "门店数", value: 14, scope: "新开门店" },
];

const waterfall: WaterfallItem[] = [
  { name: "目标", value: 100, type: "start" },
  { name: "价格", value: -8 },
  { name: "量", value: -12 },
  { name: "结构", value: -6 },
  { name: "新品", value: 8 },
  { name: "实际", value: 82, type: "end" },
];

const tree: TreeNode = {
  name: "华南区营收 -12%",
  value: -12,
  children: [
    {
      name: "线下零售 -18%",
      value: -18,
      children: [
        { name: "佛山门店", value: -22 },
        { name: "东莞门店", value: -14 },
        { name: "广州门店", value: -8 },
      ],
    },
    {
      name: "电商渠道 +6%",
      value: 6,
      children: [
        { name: "天猫旗舰店", value: 8 },
        { name: "抖音直播", value: 12 },
        { name: "京东自营", value: -2 },
      ],
    },
    {
      name: "经销商 -4%",
      value: -4,
    },
  ],
};

const hypotheses: Hypothesis[] = [
  {
    id: "h1",
    title: "节后客流回落是华南区下滑的主要原因",
    reasoning: "佛山/东莞门店在春节后第 3-4 周客流环比下降 25%，与营收下滑窗口高度吻合。",
    dataPoints: ["门店客流", "时段销售", "去年同期对照"],
    significance: 0.92,
    correlation: 0.86,
  },
  {
    id: "h2",
    title: "促销折扣加深进一步压缩毛利",
    reasoning: "华南区折扣率从 12% 提升至 18%，且集中在销售拖累 Top10 SKU。",
    dataPoints: ["折扣率", "SKU 毛利", "促销活动表"],
    significance: 0.84,
    correlation: -0.78,
  },
  {
    id: "h3",
    title: "新品 X3 在华南渗透不足",
    reasoning: "X3 在华南区门店陈列覆盖率仅 42%，显著低于其他区域 68%。",
    dataPoints: ["陈列覆盖率", "新品销售占比", "区域对照"],
    significance: 0.71,
    correlation: 0.62,
  },
];

const evidences: Evidence[] = [
  { id: "e1", type: "chart", title: "华南区营收周趋势", source: "销售看板 / 周维度" },
  { id: "e2", type: "metric", title: "渠道贡献分解", source: "指标平台 v2.3" },
  { id: "e3", type: "filter", title: "时间窗口：W12-W14", source: "工作台筛选" },
  { id: "e4", type: "dataset", title: "门店客流数据集", source: "客流系统" },
  { id: "e5", type: "external", title: "行业零售大盘对标", source: "国家统计局月报" },
];

const summary: Summary = {
  conclusion: "华南区营收下滑主要由线下零售渠道驱动（贡献 -38%），叠加促销折扣加深压缩毛利；新品 X3 的正向贡献（+28%）尚未在华南区充分释放。",
  evidence: [
    "佛山/东莞门店节后客流环比 -25%，统计显著（p=0.92）",
    "华南区折扣率从 12% 提升至 18%，与毛利率呈强负相关（r=-0.78）",
    "X3 在华南陈列覆盖率 42%，显著低于其他区域 68%",
  ],
  actions: [
    "华南区加大 X3 陈列覆盖与会员复购券投放，目标 4 周内将覆盖率提升至 65%",
    "对 Top10 拖累 SKU 优化促销结构，控制折扣率回到 14% 以内",
    "对华南区门店启动客流恢复专项，结合本地化营销活动",
  ],
  risks: [
    "若节后客流持续走低，单纯陈列调整效果有限",
    "原材料成本上行可能进一步压缩毛利，需同步成本侧动作",
  ],
};

// ---------- Component ----------
function InsightPage() {
  const [tab, setTab] = useState("anomaly");
  const [levels, setLevels] = useState<AnomalyLevel[]>(["P0", "P1", "P2"]);
  const [methods, setMethods] = useState<DetectMethod[]>(["阈值", "同环比", "分位数", "季节性", "结构突变", "业务规则"]);
  const [cluster, setCluster] = useState(true);
  const [activeAnomaly, setActiveAnomaly] = useState<Anomaly | null>(null);

  const filtered = useMemo(() => {
    return mockAnomalies.filter((a) => levels.includes(a.level) && methods.includes(a.method));
  }, [levels, methods]);

  const displayed = useMemo(() => {
    if (cluster) return filtered;
    // ungrouped: flatten clusters
    return filtered.flatMap((a) => [{ ...a, cluster: undefined }, ...(a.cluster ?? []).map((c) => ({ ...c }))]);
  }, [filtered, cluster]);

  const handleInvestigate = (a: Anomaly) => {
    setActiveAnomaly(a);
    setTab("workbench");
  };

  const counts = {
    P0: mockAnomalies.filter((a) => a.level === "P0").length,
    P1: mockAnomalies.filter((a) => a.level === "P1").length,
    P2: mockAnomalies.filter((a) => a.level === "P2").length,
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">洞察Why · 异常与根因</h1>
          <p className="mt-1 text-sm text-muted-foreground">从发现异常到可复核根因结论，沉淀为可复用的洞察资产</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="w14">
            <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="w14">本周 W14</SelectItem>
              <SelectItem value="w13">上周 W13</SelectItem>
              <SelectItem value="m">本月</SelectItem>
              <SelectItem value="q">本季度</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="group">
            <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="group">集团</SelectItem>
              <SelectItem value="region">二级 · 区域</SelectItem>
              <SelectItem value="biz">业务线</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部指标域</SelectItem>
              <SelectItem value="sales">销售</SelectItem>
              <SelectItem value="finance">财务</SelectItem>
              <SelectItem value="ops">运营</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "P0 异常", value: counts.P0, icon: AlertOctagon, tone: "text-destructive" },
          { label: "P1 异常", value: counts.P1, icon: Activity, tone: "text-warning-foreground" },
          { label: "P2 异常", value: counts.P2, icon: Activity, tone: "text-muted-foreground" },
          { label: "AI 生成假设", value: hypotheses.length, icon: Sparkles, tone: "text-primary" },
        ].map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</div>
              </div>
              <s.icon className={`h-5 w-5 ${s.tone}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="anomaly">异常中心</TabsTrigger>
          <TabsTrigger value="workbench">根因工作台</TabsTrigger>
          <TabsTrigger value="briefing">洞察简报</TabsTrigger>
        </TabsList>

        {/* Tab 1: Anomaly Center */}
        <TabsContent value="anomaly" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <Card className="border-border/60 lg:sticky lg:top-20 lg:self-start">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">筛选</CardTitle>
              </CardHeader>
              <CardContent>
                <AnomalyFilters
                  levels={levels}
                  methods={methods}
                  cluster={cluster}
                  onLevelsChange={setLevels}
                  onMethodsChange={setMethods}
                  onClusterChange={setCluster}
                />
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">
                共 {displayed.length} 条异常 · {cluster ? "已聚类合并" : "全部展开"}
              </div>
              {displayed.map((a) => (
                <AnomalyCard key={a.id} anomaly={a} onInvestigate={handleInvestigate} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Root Cause Workbench */}
        <TabsContent value="workbench" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {/* Context */}
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">分析对象</CardTitle>
                    <SourceTag>从异常中心带入</SourceTag>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="font-medium">{activeAnomaly?.title ?? "华南区销售环比 -12%"}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    指标 · {activeAnomaly?.metric ?? "销售额"} · 口径 {activeAnomaly?.caliberVersion ?? "v2.3"} · 范围 {activeAnomaly?.scope ?? "二级 · 华南区"}
                  </div>
                </CardContent>
              </Card>

              {/* Step 1 */}
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Step 1 · 影响拆解（What changed）</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ContributionBars items={contributions} title="贡献 TopN（公司/业务/区域/产品）" />
                  <div>
                    <div className="mb-2 text-xs font-medium text-muted-foreground">瀑布拆解 · 目标 → 实际</div>
                    <WaterfallChart items={waterfall} />
                  </div>
                  <SourceTag>溯源 · 销售明细 · CRM · 库存系统</SourceTag>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Step 2 · 驱动定位（Where to look）</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-2 text-xs font-medium text-muted-foreground">分解树 · 按维度逐层下钻</div>
                    <DecompositionTree root={tree} />
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-medium text-muted-foreground">异常期 vs 基准期对比</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { name: "线下零售", a: -18, b: 2 },
                        { name: "电商", a: 6, b: 8 },
                        { name: "经销商", a: -4, b: 1 },
                      ].map((r) => (
                        <div key={r.name} className="rounded-lg border border-border/60 p-3">
                          <div className="font-medium">{r.name}</div>
                          <div className="mt-1.5 flex items-baseline justify-between">
                            <span className="text-muted-foreground">异常期</span>
                            <span className={r.a < 0 ? "text-destructive" : "text-success"}>
                              {r.a > 0 ? "+" : ""}
                              {r.a}%
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-muted-foreground">基准期</span>
                            <span className={r.b < 0 ? "text-destructive" : "text-success"}>
                              {r.b > 0 ? "+" : ""}
                              {r.b}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Step 3 · 假设生成与验证（Why it happened）</CardTitle>
                    <SourceTag type="ai">AI Top3 假设</SourceTag>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hypotheses.map((h, i) => (
                    <HypothesisCard key={h.id} hypothesis={h} rank={i + 1} />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
              <EvidenceChain items={evidences} required={6} />
              <RootCauseSummary summary={summary} />
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Briefing */}
        <TabsContent value="briefing" className="mt-4">
          <BriefingPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
