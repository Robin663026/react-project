import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sparkline } from "@/components/Sparkline";
import { Badge } from "@/components/ui/badge";
import { SourceTag } from "@/components/SourceTag";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  MonitorRoleProvider,
  useMonitorRole,
  monitorRoleOptions,
  companyLabel,
  officeTitle,
  type CompanyKey,
} from "@/hooks/useMonitorRole";
import { OfficeWorkbench } from "@/components/monitor/OfficeWorkbench";
import { OfficeMetricsBand } from "@/components/monitor/OfficeMetricsBand";
import { CompanyTimeMapCard } from "@/components/monitor/CompanyTimeMapCard";
import { useQuadrantDrawer } from "@/components/monitor/QuadrantEvidenceDrawer";
import { ShieldCheck, UserCog } from "lucide-react";
import {
  TrendingDown,
  TrendingUp,
  Compass,
  Wallet,
  Scale,
  Briefcase,
  Sparkles,
  Maximize2,
  Download,
  ChevronRight,
  Handshake,
  Lightbulb,
  Globe2,
  Building2,
  Rocket,
  Landmark,
  Ship,
  Truck,
  Anchor,
  Target,
  Gauge,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/monitor")({
  head: () => ({
    meta: [
      { title: "监控驾驶舱 · AI经营分析" },
      { name: "description", content: "集团核心 KPI 大屏与时间×空间维度的时间地图。" },
    ],
  }),
  component: MonitorPage,
});

// ============ 经营健康指数（合成）============
// 公式：收入增速×20% + 利润增速×25% + ROE×25% + (100-资产负债率)×20% + 经营现金流增速×10%
// 各分项先标准化到 0-100
type HealthScope = "group" | "port" | "shipping" | "logistics";
type HealthPeriod = "year" | "quarter";

const healthFormula =
  "经营健康指数 = 收入增速×20% + 利润增速×25% + ROE×25% + (100-资产负债率)×20% + 经营现金流增速×10%";

const healthDataset: Record<
  HealthScope,
  Record<
    HealthPeriod,
    {
      score: number;
      delta: number;
      components: { key: string; label: string; weight: number; raw: string; norm: number }[];
    }
  >
> = {
  group: {
    year: {
      score: 82.6,
      delta: 3.2,
      components: [
        { key: "rev", label: "收入增速", weight: 20, raw: "+8.2%", norm: 82 },
        { key: "profit", label: "利润增速", weight: 25, raw: "+12.5%", norm: 88 },
        { key: "roe", label: "归母 ROE", weight: 25, raw: "14.8%", norm: 78 },
        { key: "lev", label: "100-资产负债率", weight: 20, raw: "41.8", norm: 84 },
        { key: "cash", label: "经营现金流增速", weight: 10, raw: "+5.8%", norm: 76 },
      ],
    },
    quarter: {
      score: 79.4,
      delta: -1.1,
      components: [
        { key: "rev", label: "收入增速", weight: 20, raw: "+6.4%", norm: 76 },
        { key: "profit", label: "利润增速", weight: 25, raw: "+9.8%", norm: 82 },
        { key: "roe", label: "归母 ROE", weight: 25, raw: "14.2%", norm: 76 },
        { key: "lev", label: "100-资产负债率", weight: 20, raw: "41.3", norm: 82 },
        { key: "cash", label: "经营现金流增速", weight: 10, raw: "+2.1%", norm: 68 },
      ],
    },
  },
  port: {
    year: { score: 84.6, delta: 3.8, components: [
      { key: "rev", label: "收入增速", weight: 20, raw: "+9.2%", norm: 86 },
      { key: "profit", label: "利润增速", weight: 25, raw: "+11.4%", norm: 86 },
      { key: "roe", label: "归母 ROE", weight: 25, raw: "15.6%", norm: 82 },
      { key: "lev", label: "100-资产负债率", weight: 20, raw: "44.0", norm: 84 },
      { key: "cash", label: "经营现金流增速", weight: 10, raw: "+7.2%", norm: 80 },
    ]},
    quarter: { score: 82.0, delta: 1.6, components: [
      { key: "rev", label: "收入增速", weight: 20, raw: "+7.8%", norm: 82 },
      { key: "profit", label: "利润增速", weight: 25, raw: "+9.6%", norm: 84 },
      { key: "roe", label: "归母 ROE", weight: 25, raw: "15.2%", norm: 80 },
      { key: "lev", label: "100-资产负债率", weight: 20, raw: "43.6", norm: 82 },
      { key: "cash", label: "经营现金流增速", weight: 10, raw: "+5.0%", norm: 74 },
    ]},
  },
  shipping: {
    year: { score: 71.4, delta: -2.6, components: [
      { key: "rev", label: "收入增速", weight: 20, raw: "+3.4%", norm: 64 },
      { key: "profit", label: "利润增速", weight: 25, raw: "+5.2%", norm: 70 },
      { key: "roe", label: "归母 ROE", weight: 25, raw: "13.6%", norm: 74 },
      { key: "lev", label: "100-资产负债率", weight: 20, raw: "42.0", norm: 82 },
      { key: "cash", label: "经营现金流增速", weight: 10, raw: "+1.6%", norm: 60 },
    ]},
    quarter: { score: 68.0, delta: -3.4, components: [
      { key: "rev", label: "收入增速", weight: 20, raw: "-8.5%", norm: 40 },
      { key: "profit", label: "利润增速", weight: 25, raw: "+3.8%", norm: 66 },
      { key: "roe", label: "归母 ROE", weight: 25, raw: "13.2%", norm: 72 },
      { key: "lev", label: "100-资产负债率", weight: 20, raw: "41.8", norm: 80 },
      { key: "cash", label: "经营现金流增速", weight: 10, raw: "+0.4%", norm: 56 },
    ]},
  },
  logistics: {
    year: { score: 78.8, delta: 2.4, components: [
      { key: "rev", label: "收入增速", weight: 20, raw: "+9.7%", norm: 86 },
      { key: "profit", label: "利润增速", weight: 25, raw: "+8.4%", norm: 80 },
      { key: "roe", label: "归母 ROE", weight: 25, raw: "14.0%", norm: 76 },
      { key: "lev", label: "100-资产负债率", weight: 20, raw: "40.0", norm: 78 },
      { key: "cash", label: "经营现金流增速", weight: 10, raw: "+5.4%", norm: 76 },
    ]},
    quarter: { score: 76.0, delta: 1.0, components: [
      { key: "rev", label: "收入增速", weight: 20, raw: "+8.2%", norm: 82 },
      { key: "profit", label: "利润增速", weight: 25, raw: "+6.8%", norm: 76 },
      { key: "roe", label: "归母 ROE", weight: 25, raw: "13.6%", norm: 74 },
      { key: "lev", label: "100-资产负债率", weight: 20, raw: "39.6", norm: 76 },
      { key: "cash", label: "经营现金流增速", weight: 10, raw: "+3.6%", norm: 70 },
    ]},
  },
};

const healthScopeOptions: { value: HealthScope; label: string }[] = [
  { value: "group", label: "集团合并" },
  { value: "port", label: "招商港口" },
  { value: "shipping", label: "招商轮船" },
  { value: "logistics", label: "中国外运" },
];

// 五年健康指数趋势（用于时间地图 finance/fiveYear 单元）
const healthFiveYearTrend = [68, 72, 75, 79, 82, 83];

// ============ 北极星指标 ============
const polarStars = [
  {
    name: "利润总额 / 归母净利润",
    primary: "¥ 2.34 亿",
    secondary: "归母 ¥ 1.92 亿",
    delta: "+12.5%",
    up: true,
    visual: "spark" as const,
    data: [20, 22, 21, 24, 26, 28, 27, 30],
    icon: Wallet,
  },
  {
    name: "年度计划完成率",
    primary: "71%",
    secondary: "全年计划 ¥18.0 亿",
    delta: "+6pt vs 上季",
    up: true,
    visual: "progress" as const,
    progress: 71,
    icon: Target,
  },
  {
    name: "归母 ROE",
    primary: "14.8%",
    secondary: "五年目标 18%",
    delta: "-0.4pt",
    up: false,
    visual: "spark" as const,
    data: [15, 15.2, 15, 14.8, 14.6, 14.7, 14.8, 14.8],
    icon: Gauge,
  },
  {
    name: "资产负债率",
    primary: "58.2%",
    secondary: "警戒线 65%",
    delta: "+1.1pt",
    up: false,
    invert: true,
    visual: "spark" as const,
    data: [56, 56.5, 57, 57.2, 57.5, 57.8, 58, 58.2],
    icon: Activity,
  },
];

// ============ 二级公司（集团下属三家上市平台）============
const subsidiaries = [
  { name: "招商港口", revenue: "98.40亿", yoy: "+9.2%", profit: "18.60亿", margin: "18.9%", up: true, trend: [80, 82, 85, 88, 90, 93, 95, 98] },
  { name: "招商轮船", revenue: "76.20亿", yoy: "+3.4%", profit: "12.80亿", margin: "16.8%", up: true, trend: [70, 72, 71, 73, 74, 75, 76, 76] },
  { name: "中国外运", revenue: "210.50亿", yoy: "+9.7%", profit: "21.40亿", margin: "10.2%", up: true, trend: [180, 188, 192, 196, 200, 204, 208, 210] },
];

// ============ 时间地图 ============
type CellStatus = "good" | "warn" | "risk" | "future";
type Cell = { label: string; detail: string; status: CellStatus };

const timeAxis = [
  { key: "quarter", label: "季度分析", sub: "Q1 2026" },
  { key: "year", label: "年度执行", sub: "2026 进度" },
  { key: "fiveYear", label: "五年规划", sub: "2024-2028" },
  { key: "forecast", label: "未来预测", sub: "AI 推演 · 2027" },
] as const;

// 文档顺序：战略/财务/业务管理/风控合规
const dimensions = [
  { key: "strategy", label: "战略发展", icon: Compass, color: "text-primary" },
  { key: "finance", label: "财务", icon: Wallet, color: "text-success" },
  { key: "ops", label: "业务管理", icon: Briefcase, color: "text-primary" },
  { key: "legal", label: "风控合规", icon: Scale, color: "text-warning-foreground" },
] as const;

const timeMap: Record<string, Record<string, Cell>> = {
  strategy: {
    year: { label: "执行 68%", detail: "6 大战略主题共 44 项任务，已完成 30 项", status: "good" },
    quarter: { label: "里程碑 92%", detail: "本季 12 个节点应完成 11 个，X3 系列提前上线", status: "good" },
    fiveYear: { label: "里程碑 3/5", detail: "数智化转型阶段二完成，国际化进入第三阶段", status: "good" },
    forecast: { label: "+4.2pt 增长贡献", detail: "AI 预测：海外+新品组合将贡献集团增长 4.2pt", status: "future" },
  },
  finance: {
    year: { label: "营收完成 71%", detail: "全年计划 ¥18.0 亿，累计 ¥12.8 亿，净利率 +0.6pt", status: "good" },
    quarter: { label: "现金流承压", detail: "应收账款 +18.3%，建议加强回款管理", status: "warn" },
    fiveYear: { label: "ROE 14.8%/18%", detail: "距五年目标 ROE 18% 仍差 3.2pt", status: "warn" },
    forecast: { label: "毛利率或下探", detail: "原材料成本上涨预期延续，建议对冲", status: "risk" },
  },
  ops: {
    year: { label: "OEE 87.4%", detail: "运营效率同比 +3.2pt，库存周转改善", status: "good" },
    quarter: { label: "华南区下滑", detail: "环比 -12%，渠道结构调整待落地", status: "risk" },
    fiveYear: { label: "数字化覆盖 78%", detail: "对标 2028 全面数字化目标，进度领先", status: "good" },
    forecast: { label: "供应链重构机会", detail: "AI 建议：东南亚二级供应商池可降本 6-8%", status: "future" },
  },
  legal: {
    year: { label: "0 重大风险", detail: "合规审计全部通过，新增专利 2 项", status: "good" },
    quarter: { label: "诉讼 3 起", detail: "其中 1 起涉及金额 ¥2,800 万，已计提", status: "warn" },
    fiveYear: { label: "知识产权 +42 项", detail: "对标五年规划目标 60 项，进度 70%", status: "good" },
    forecast: { label: "新规合规风险", detail: "AI 监测：欧盟新数据法规 7 月生效，需提前布局", status: "risk" },
  },
};

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

// ============ 集团总体经营指标 ============
const overviewMetrics = [
  { name: "营业收入", current: "12.84", lastYear: "11.86", yoy: 8.2, plan: "18.00", complete: 71, unit: "亿元" },
  { name: "利润总额", current: "2.27", lastYear: "2.19", yoy: 3.7, plan: "3.00", complete: 76, unit: "亿元" },
  { name: "归母净利润", current: "1.92", lastYear: "1.71", yoy: 12.5, plan: "2.40", complete: 80, unit: "亿元" },
  { name: "总资产", current: "134.90", lastYear: "124.50", yoy: 8.4, plan: "140.00", complete: 96, unit: "亿元" },
  { name: "归母净资产", current: "52.40", lastYear: "49.13", yoy: 6.7, plan: "53.50", complete: 98, unit: "亿元" },
  { name: "毛利率", current: "40.2", lastYear: "40.0", yoy: 0.2, plan: "42.0", complete: 96, unit: "%" },
  { name: "归母 ROE", current: "14.8", lastYear: "15.2", yoy: -0.4, plan: "18.0", complete: 82, unit: "%" },
  { name: "资产负债率", current: "60.8", lastYear: "61.2", yoy: -0.4, plan: "60.0", complete: 99, unit: "%" },
];

const specialWorks = [
  { name: "对外战略合作", count: 8, icon: Handshake },
  { name: "改革发展", count: 11, icon: Rocket },
  { name: "科技创新", count: 10, icon: Lightbulb },
  { name: "海外发展", count: 8, icon: Globe2 },
  { name: "深耕香港", count: 12, icon: Landmark },
  { name: "重大投资", count: 16, icon: Building2 },
];

// ============ 二级财务明细：6 个指标 ============
const financeMetrics = ["营业收入", "归母净利润", "毛利率", "资产负债率", "归母ROE", "有息债务余额"] as const;
type FinanceMetricKey = (typeof financeMetrics)[number];

const financeData: Record<FinanceMetricKey, { unit: string; rows: { name: string; current: number; lastYear: number }[] }> = {
  营业收入: {
    unit: "亿元",
    rows: [
      { name: "招商港口", current: 98.4, lastYear: 90.1 },
      { name: "招商轮船", current: 76.2, lastYear: 73.7 },
      { name: "中国外运", current: 210.5, lastYear: 191.9 },
    ],
  },
  归母净利润: {
    unit: "亿元",
    rows: [
      { name: "招商港口", current: 18.6, lastYear: 16.7 },
      { name: "招商轮船", current: 12.8, lastYear: 12.2 },
      { name: "中国外运", current: 21.4, lastYear: 19.5 },
    ],
  },
  毛利率: {
    unit: "%",
    rows: [
      { name: "招商港口", current: 18.9, lastYear: 18.2 },
      { name: "招商轮船", current: 16.8, lastYear: 16.4 },
      { name: "中国外运", current: 10.2, lastYear: 9.8 },
    ],
  },
  资产负债率: {
    unit: "%",
    rows: [
      { name: "招商港口", current: 56.0, lastYear: 56.8 },
      { name: "招商轮船", current: 58.0, lastYear: 57.6 },
      { name: "中国外运", current: 60.0, lastYear: 60.5 },
    ],
  },
  归母ROE: {
    unit: "%",
    rows: [
      { name: "招商港口", current: 15.6, lastYear: 14.8 },
      { name: "招商轮船", current: 13.6, lastYear: 13.2 },
      { name: "中国外运", current: 14.0, lastYear: 13.4 },
    ],
  },
  有息债务余额: {
    unit: "亿元",
    rows: [
      { name: "招商港口", current: 42.6, lastYear: 41.8 },
      { name: "招商轮船", current: 36.4, lastYear: 35.9 },
      { name: "中国外运", current: 28.5, lastYear: 29.4 },
    ],
  },
};

// ============ 专项工作 ============
const specialDetails: Record<string, { section: string; items: string[] }[]> = {
  对外战略合作: [
    {
      section: "战略协议签署",
      items: [
        "2026 年至今，集团共对外签署 8 份战略合作框架协议（含合作备忘录等）",
        "Q1 集团先后与上海科技大学、东方电气集团、长三角投资联盟签署战略合作框架协议",
        "集团与天津市人民政府、上海证券交易所、济南市人民政府签署战略合作框架协议",
      ],
    },
    {
      section: "战略合作管理",
      items: [
        "开展战略合作协议落地成效评估工作，强化战略合作闭环管理",
        "战略合作管理数字化系统已正式上线使用",
      ],
    },
  ],
  改革发展: [
    {
      section: "组织变革",
      items: [
        "完成 11 项改革任务里程碑，三项子公司治理结构优化方案落地",
        "推进二级公司经营授权清单 v2.0 修订，下放权限 14 项",
      ],
    },
    {
      section: "机制创新",
      items: ["新一轮经理层任期制契约化管理已签约 32 人", "市场化薪酬激励试点扩展至 4 家二级公司"],
    },
  ],
  科技创新: [
    {
      section: "研发投入",
      items: ["集团 Q1 研发投入 ¥0.72 亿，同比 +18.4%", "在研重点项目 10 项，其中战略级 4 项"],
    },
    {
      section: "成果转化",
      items: ["新增专利申请 12 项（其中发明专利 8 项）", "智慧物流平台 2.0 进入试运行阶段"],
    },
  ],
  海外发展: [
    {
      section: "区域拓展",
      items: ["东南亚区域 8 个重点项目稳步推进", "海外营收同比 +22.3%，超预期 5pt"],
    },
    {
      section: "本地化运营",
      items: ["新加坡区域中心完成本地化团队组建", "推进与马来西亚港务集团联营协议谈判"],
    },
  ],
  深耕香港: [
    {
      section: "重点项目",
      items: ["12 项深耕香港项目按节奏推进", "香港数字资产平台进入合规审查阶段"],
    },
    {
      section: "本地协同",
      items: ["与香港金管局达成监管沙盒合作", "联合本地高校设立创新实验室"],
    },
  ],
  重大投资: [
    {
      section: "投资落地",
      items: ["16 个重大投资项目跟踪管理中，累计投资 ¥48.6 亿", "新增并购项目 2 个，已完成交割 1 个"],
    },
    {
      section: "投后管理",
      items: ["建立投后管理评分卡，覆盖 100% 重大投资项目", "Q1 投资项目整体 ROI 达 11.2%，符合预期"],
    },
  ],
};

// ============ 主组件 ============
function MonitorPage() {
  return (
    <MonitorRoleProvider>
      <MonitorPageInner />
    </MonitorRoleProvider>
  );
}

function MonitorPageInner() {
  const { role } = useMonitorRole();
  const isSub = role.kind === "subsidiary";
  const isOffice = role.kind === "office";
  const { openWith, drawer } = useQuadrantDrawer();

  const titleText = isSub
    ? `监控 · ${companyLabel[role.company]}经营监控`
    : isOffice
      ? `监控 · ${officeTitle[role.office].title}`
      : "监控 · 集团领导驾驶舱";
  const subtitleText = isSub
    ? `当前视角：${role.name} · 仅展示本公司相关数据`
    : isOffice
      ? officeTitle[role.office].subtitle
      : "面向集团战发领导的经营、战略与风险一体化观察界面";

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{titleText}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitleText}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("已生成 AI 综合洞察简报")}>
            <Sparkles className="h-4 w-4 text-primary" />
            AI 综合洞察
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("已导出当前驾驶舱视图")}>
            <Download className="h-4 w-4" />
            导出
          </Button>
          <Button size="sm" variant="ghost" className="gap-1.5">
            <Maximize2 className="h-4 w-4" />
            全屏
          </Button>
        </div>
      </div>

      <GlobalFilterBar />

      {isSub && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-primary">
          <ShieldCheck className="h-4 w-4" />
          <span>
            数据权限范围：<b>{companyLabel[role.company]}</b>。其他二级公司及集团合并口径数据已按权限隐藏。
          </span>
        </div>
      )}

      {isOffice ? (
        <OfficeWorkbench office={role.office} />
      ) : isSub ? (
        <>
          <NorthStarSystem />
          <CompanyTimeMapCard company={role.company} onCellClick={openWith} />
          <FusedTabsCard />
          <BusinessDrilldownCard />
        </>
      ) : (
        <>
          <NorthStarSystem />
          <OfficeMetricsBand />
          <TimeMapCard onCellClick={openWith} />
          <FusedTabsCard />
          <BusinessDrilldownCard />
        </>
      )}

      {drawer}
    </div>
  );
}

// ============ 子组件 ============
function GlobalFilterBar() {
  const { roleKey, setRoleKey, role } = useMonitorRole();
  return (
    <Card className="border-0 shadow-soft gradient-soft">
      <CardContent className="flex flex-wrap items-center gap-3 p-3">
        <span className="text-xs font-medium text-muted-foreground">期间</span>
        <Select defaultValue="2026Q1">
          <SelectTrigger className="h-9 w-[160px] glass-chip border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026Q1">2026 Q1</SelectItem>
            <SelectItem value="2025FY">2025 全年</SelectItem>
            <SelectItem value="2025Q4">2025 Q4</SelectItem>
            <SelectItem value="2025Q3">2025 Q3</SelectItem>
            <SelectItem value="2024FY">2024 全年</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-[11px] text-muted-foreground">数据更新：2026-04-30 09:15</span>

        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <UserCog className="h-3.5 w-3.5" /> 视角（演示）
          </span>
          <Select value={roleKey} onValueChange={setRoleKey}>
            <SelectTrigger className="h-9 w-[200px] glass-chip border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monitorRoleOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge
            variant="secondary"
            className={
              role.kind === "leader"
                ? "bg-success/15 text-success"
                : role.kind === "office"
                  ? "bg-warning/20 text-warning-foreground"
                  : "bg-primary/15 text-primary"
            }
          >
            {role.kind === "leader" ? "集团领导权限" : role.kind === "office" ? "处室专员权限" : "本公司权限"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function TimeMapCard({ onCellClick }: { onCellClick: (dim: string, time: string) => void }) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex-row items-end justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base">时间地图 · 时间轴 × 空间维度</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            季度分析 / 年度执行 / 五年规划 / 未来预测 × 战略 · 财务 · 业务管理 · 风控合规
          </p>
        </div>
        <SourceTag type="ai">AI 综合洞察</SourceTag>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[140px_repeat(4,1fr)] gap-2 mb-2">
              <div className="text-xs font-medium text-muted-foreground px-2">维度 \ 时间</div>
              {timeAxis.map((t) => (
                <div key={t.key} className="rounded-lg gradient-soft px-3 py-2 text-center">
                  <div className="text-xs font-semibold">{t.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{t.sub}</div>
                </div>
              ))}
            </div>

            {dimensions.map((d) => (
              <div key={d.key} className="grid grid-cols-[140px_repeat(4,1fr)] gap-2 mb-2">
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2">
                  <d.icon className={`h-4 w-4 ${d.color}`} />
                  <span className="text-sm font-medium">{d.label}</span>
                </div>
                {timeAxis.map((t) => {
                  const cell = timeMap[d.key][t.key];
                  return (
                    <button
                      key={t.key}
                      onClick={() => onCellClick(d.key, t.key)}
                      className={`group relative rounded-lg border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft cursor-pointer ${statusStyle[cell.status]}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{cell.label}</span>
                        <span className="text-[9px] rounded-full bg-background/60 px-1.5 py-0.5 font-medium">
                          {statusLabel[cell.status]}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/75 line-clamp-2">
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

function FusedTabsCard() {
  const { role } = useMonitorRole();
  const isSub = role.kind === "subsidiary";
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {isSub ? `${companyLabel[role.company]} 经营总览` : "集团经营总览"}
        </CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          {isSub
            ? "本公司经营指标 / 财务明细 / 专项工作"
            : "经营总览 / 二级财务明细 / 专项工作 一体化视图"}
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">经营总览</TabsTrigger>
            <TabsTrigger value="finance">{isSub ? "财务明细" : "二级财务明细"}</TabsTrigger>
            <TabsTrigger value="special">专项工作</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <OverviewPane />
          </TabsContent>
          <TabsContent value="finance" className="mt-4">
            <FinancePane />
          </TabsContent>
          <TabsContent value="special" className="mt-4">
            <SpecialWorkPane />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// 二级公司视角下的"本公司经营指标"mock（按 financeData 推导）
const subsidiaryOverviewScale: Record<CompanyKey, number> = {
  port: 0.42,
  shipping: 0.32,
  logistics: 0.78,
};

function OverviewPane() {
  const { role } = useMonitorRole();
  const isSub = role.kind === "subsidiary";
  const scale = isSub ? subsidiaryOverviewScale[role.company] : 1;
  const metrics = isSub
    ? overviewMetrics.map((m) => {
        // 比率类指标(%)不缩放，金额类指标按 scale 缩放
        const isRatio = m.unit === "%";
        const scaleNum = (s: string) => (parseFloat(s) * scale).toFixed(2);
        return isRatio
          ? m
          : {
              ...m,
              current: scaleNum(m.current),
              lastYear: scaleNum(m.lastYear),
              plan: scaleNum(m.plan),
            };
      })
    : overviewMetrics;
  const title = isSub
    ? `${companyLabel[role.company]} 经营指标完成情况`
    : "集团总体经营指标完成情况";

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
      <div className="rounded-lg border border-border/60 bg-card/40">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-[11px] text-muted-foreground">单位：亿元 / %</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>指标</TableHead>
              <TableHead className="text-right">本期</TableHead>
              <TableHead className="text-right">上年同期</TableHead>
              <TableHead className="text-right">增长率</TableHead>
              <TableHead className="text-right">本年计划</TableHead>
              <TableHead>完成率</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((m) => {
              const up = m.yoy >= 0;
              return (
                <TableRow key={m.name}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{m.current}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{m.lastYear}</TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? "text-success" : "text-destructive"}`}>
                      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {up ? "+" : ""}
                      {m.yoy}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{m.plan}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${m.complete >= 90 ? "bg-success" : m.complete >= 70 ? "bg-primary" : "bg-warning"}`}
                          style={{ width: `${Math.min(m.complete, 100)}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs tabular-nums">{m.complete}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 右侧专项工作快捷入口 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-muted-foreground">专项工作</span>
          <SourceTag type="verified">加V</SourceTag>
        </div>
        {specialWorks.map((w) => (
          <button
            key={w.name}
            onClick={() => toast.info(`查看「${w.name}」专项工作`)}
            className="group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
              <w.icon className="h-4 w-4" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{w.name}</div>
              <div className="text-[11px] text-muted-foreground">{w.count} 项</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
}

function FinancePane() {
  const { role } = useMonitorRole();
  const [metric, setMetric] = useState<FinanceMetricKey>("营业收入");
  const raw = financeData[metric];
  const data = role.kind === "subsidiary"
    ? { ...raw, rows: raw.rows.filter((r) => r.name === companyLabel[role.company]) }
    : raw;
  const maxV = Math.max(...data.rows.map((r) => Math.max(r.current, r.lastYear)));

  return (
    <div className="space-y-4">
      {/* 指标切换 */}
      <div className="flex flex-wrap gap-2">
        {financeMetrics.map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              metric === m
                ? "gradient-primary text-primary-foreground border-transparent shadow-soft"
                : "border-border/60 bg-card hover:bg-accent"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* 对比表 */}
      <div className="rounded-lg border border-border/60 bg-card/40">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60">
          <span className="text-sm font-medium">二级公司财务指标对比 · {metric}</span>
          <span className="text-[11px] text-muted-foreground">单位：{data.unit}</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>二级公司</TableHead>
              <TableHead className="text-right">本期</TableHead>
              <TableHead className="text-right">上年同期</TableHead>
              <TableHead className="text-right">增长率</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((r) => {
              const yoy = r.lastYear === 0 ? 0 : ((r.current - r.lastYear) / r.lastYear) * 100;
              const up = yoy >= 0;
              return (
                <TableRow key={r.name}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.current.toFixed(1)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{r.lastYear.toFixed(1)}</TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? "text-success" : "text-destructive"}`}>
                      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {up ? "+" : ""}
                      {yoy.toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 同比柱图 */}
      <div className="rounded-lg border border-border/60 bg-card/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">本期 vs 上年同期</span>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" /> 本期
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary/30" /> 上年同期
            </span>
          </div>
        </div>
        <div className="flex h-44 items-end gap-4 px-2">
          {data.rows.map((r) => {
            const yoy = r.lastYear === 0 ? 0 : ((r.current - r.lastYear) / r.lastYear) * 100;
            const up = yoy >= 0;
            return (
              <div key={r.name} className="flex flex-1 flex-col items-center gap-1.5">
                <span
                  className={`text-[10px] font-medium ${up ? "text-success" : "text-destructive"}`}
                >
                  {up ? "▲" : "▼"} {yoy.toFixed(1)}%
                </span>
                <div className="flex h-32 w-full items-end justify-center gap-1">
                  <div
                    className="w-3 rounded-sm bg-primary transition-all"
                    style={{ height: `${(r.current / maxV) * 100}%` }}
                  />
                  <div
                    className="w-3 rounded-sm bg-primary/30 transition-all"
                    style={{ height: `${(r.lastYear / maxV) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{r.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SpecialWorkPane() {
  const themes = Object.keys(specialDetails);
  const [theme, setTheme] = useState(themes[0]);
  const sections = specialDetails[theme];
  const meta = specialWorks.find((w) => w.name === theme);

  return (
    <div className="space-y-4">
      {/* 6 大主题切换 */}
      <div className="flex flex-wrap gap-2">
        {specialWorks.map((w) => (
          <button
            key={w.name}
            onClick={() => setTheme(w.name)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              theme === w.name
                ? "gradient-primary text-primary-foreground border-transparent shadow-soft"
                : "border-border/60 bg-card hover:bg-accent"
            }`}
          >
            <w.icon className="h-3.5 w-3.5" />
            {w.name}
            <span className={`rounded-full px-1.5 text-[10px] ${theme === w.name ? "bg-white/25" : "bg-muted"}`}>
              {w.count}
            </span>
          </button>
        ))}
      </div>

      {/* 内容 */}
      <div className="rounded-lg border border-border/60 bg-card/40 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {meta && (
              <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                <meta.icon className="h-4 w-4" />
              </span>
            )}
            <h3 className="text-base font-semibold">{theme}</h3>
            <SourceTag type="verified">加V</SourceTag>
          </div>
          <Button size="sm" variant="ghost" className="h-7 gap-0.5 text-xs">
            历史回顾 <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="space-y-5">
          {sections.map((sec) => (
            <div key={sec.section}>
              <h4 className="mb-2 text-sm font-semibold text-foreground/90">{sec.section}</h4>
              <ul className="space-y-1.5">
                {sec.items.map((it, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ 经营健康指数大卡 ============
function NorthStarSystem() {
  return (
    <div className="relative isolate">
      {/* 装饰轨道层（仅 lg+ 显示） */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block" aria-hidden>
        {/* 中心光晕 */}
        <div className="absolute left-1/4 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--color-primary)_22%,transparent)_0%,transparent_60%)] blur-2xl" />
        {/* 同心椭圆轨道 */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 520" preserveAspectRatio="none">
          <defs>
            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="color-mix(in oklab, var(--color-primary) 0%, transparent)" />
              <stop offset="50%" stopColor="color-mix(in oklab, var(--color-primary) 55%, transparent)" />
              <stop offset="100%" stopColor="color-mix(in oklab, var(--color-primary) 0%, transparent)" />
            </linearGradient>
          </defs>
          <ellipse cx="600" cy="260" rx="540" ry="220" fill="none" stroke="url(#orbitGrad)" strokeWidth="1" className="orbit-dash" />
          <ellipse cx="600" cy="260" rx="430" ry="170" fill="none" stroke="url(#orbitGrad)" strokeWidth="1" className="orbit-dash-rev" opacity="0.6" />
        </svg>
      </div>

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-5">
        {/* 中心恒星：左侧大卡，跨两行 */}
        <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:row-span-2">
          <HealthIndexCard />
        </div>
        {/* 北极星 #1 右上左 */}
        <div className="lg:col-span-3 lg:col-start-7 lg:row-start-1">
          <PolarStarCard item={polarStars[0]} />
        </div>
        {/* 北极星 #2 右上右 */}
        <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1">
          <PolarStarCard item={polarStars[1]} />
        </div>
        {/* 北极星 #3 右下左 */}
        <div className="lg:col-span-3 lg:col-start-7 lg:row-start-2">
          <PolarStarCard item={polarStars[2]} />
        </div>
        {/* 北极星 #4 右下右 */}
        <div className="lg:col-span-3 lg:col-start-10 lg:row-start-2">
          <PolarStarCard item={polarStars[3]} />
        </div>
      </div>
    </div>
  );
}

function HealthIndexCard() {
  const { role } = useMonitorRole();
  const lockedScope: HealthScope | null = role.kind === "subsidiary" ? role.company : null;
  const [scope, setScope] = useState<HealthScope>(lockedScope ?? "group");
  const [period, setPeriod] = useState<HealthPeriod>("year");
  const effectiveScope = lockedScope ?? scope;
  const data = healthDataset[effectiveScope][period];
  const { score, delta, components } = data;
  const visibleScopeOptions = lockedScope
    ? healthScopeOptions.filter((o) => o.value === lockedScope)
    : healthScopeOptions;

  const tier =
    score >= 80
      ? { label: "健康", text: "text-success", ringClass: "text-success", chip: "bg-success/15 text-success" }
      : score >= 60
        ? { label: "良好", text: "text-primary", ringClass: "text-primary", chip: "bg-primary/15 text-primary" }
        : score >= 40
          ? { label: "关注", text: "text-warning-foreground", ringClass: "text-warning", chip: "bg-warning/20 text-warning-foreground" }
          : { label: "预警", text: "text-destructive", ringClass: "text-destructive", chip: "bg-destructive/15 text-destructive" };

  // SVG 环形参数
  const R = 56;
  const C = 2 * Math.PI * R;
  const dash = (score / 100) * C;

  const tierDot =
    score >= 80
      ? "bg-success"
      : score >= 60
        ? "bg-primary"
        : score >= 40
          ? "bg-warning"
          : "bg-destructive";

  return (
    <Card className="relative h-full overflow-hidden border-0 bg-card/70 backdrop-blur-xl ring-1 ring-border/50 shadow-glow">
      {/* 装饰性发光 blob（柔化） */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-primary-glow/15 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />

      <CardContent className="relative flex h-full flex-col gap-5 p-5">
        {/* 顶栏 */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary shadow-soft">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <h3 className="text-base font-semibold">经营健康指数</h3>
              <SourceTag type="ai">AI 合成</SourceTag>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              五维加权综合评分 · 0-100 分制
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={effectiveScope}
              onValueChange={(v) => setScope(v as HealthScope)}
              disabled={!!lockedScope}
            >
              <SelectTrigger className="h-8 w-[120px] glass-chip border-0 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {visibleScopeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={(v) => setPeriod(v as HealthPeriod)}>
              <SelectTrigger className="h-8 w-[80px] glass-chip border-0 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">年</SelectItem>
                <SelectItem value="quarter">季</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 主体：环形分数 + 分项条 */}
        <div className="flex flex-wrap items-center gap-6">
          {/* 环形 */}
          <div className="relative flex h-[160px] w-[160px] shrink-0 items-center justify-center">
            {/* 锥形装饰外环 */}
            <div className="absolute inset-0 rounded-full gradient-conic opacity-50 blur-md animate-spin-slow" />
            {/* 脉冲底圈 */}
            <div className="absolute inset-3 rounded-full bg-primary/10 animate-pulse-ring" />

            <svg width="160" height="160" viewBox="0 0 160 160" className="relative -rotate-90">
              <defs>
                <linearGradient id="healthRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-primary-glow)" />
                </linearGradient>
                <filter id="healthRingGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke="color-mix(in oklab, var(--color-primary) 12%, transparent)"
                strokeWidth="10"
              />
              <circle
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke="url(#healthRingGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C}`}
                filter="url(#healthRingGlow)"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-5xl font-semibold tracking-tight text-transparent">
                {score.toFixed(1)}
              </div>
              <span className={`mt-1 inline-flex items-center gap-1 rounded-full glass-chip px-2.5 py-0.5 text-[10px] font-medium ${tier.text}`}>
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${tierDot}`} />
                {tier.label}
              </span>
            </div>
          </div>

          {/* 右侧：副信息 + 分项条 */}
          <div className="flex-1 min-w-[240px] space-y-3">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1 rounded-full glass-chip px-2.5 py-1 text-xs font-medium ${
                  delta >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {delta >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {delta >= 0 ? "+" : ""}
                {delta.toFixed(1)} vs 上期
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={() => toast.info(healthFormula)}
              >
                查看公式
              </Button>
            </div>

            <div className="space-y-1.5">
              {components.map((c) => {
                const barColor =
                  c.norm >= 80
                    ? "from-success to-success/70"
                    : c.norm >= 60
                      ? "from-primary to-primary-glow"
                      : c.norm >= 40
                        ? "from-warning to-warning/70"
                        : "from-destructive to-destructive/70";
                const dotColor =
                  c.norm >= 80
                    ? "bg-success"
                    : c.norm >= 60
                      ? "bg-primary"
                      : c.norm >= 40
                        ? "bg-warning"
                        : "bg-destructive";
                return (
                  <div
                    key={c.key}
                    className="grid grid-cols-[88px_1fr_64px] items-center gap-2 rounded-lg px-2 py-1 transition-all hover:glass-subtle"
                    title={`原始值 ${c.raw} → 标准化 ${c.norm} 分 · 权重 ${c.weight}%`}
                  >
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor}`} />
                      {c.label}
                    </span>
                    <div className="relative h-2 overflow-hidden rounded-full bg-muted/70">
                      <div
                        className={`relative h-full rounded-full bg-gradient-to-r ${barColor}`}
                        style={{ width: `${c.norm}%` }}
                      >
                        <div className="absolute inset-0 animate-shimmer-x bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.55)_50%,transparent_100%)]" />
                      </div>
                    </div>
                    <span className="text-right text-[11px] tabular-nums text-foreground/80">
                      {c.norm}
                      <span className="ml-1 text-muted-foreground">×{c.weight}%</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ 北极星指标卡 ============
function PolarStarCard({
  item,
}: {
  item: (typeof polarStars)[number];
}) {
  const positive = item.up;
  const deltaText = positive ? "text-success" : "text-destructive";
  const deltaChip = positive
    ? "bg-success/15 text-success ring-1 ring-success/30"
    : "bg-destructive/15 text-destructive ring-1 ring-destructive/30";
  const blobColor = positive ? "bg-success/25" : "bg-destructive/20";
  const Icon = item.icon;
  return (
    <Card className="group relative h-full overflow-hidden border-0 bg-card/60 backdrop-blur-xl ring-1 ring-border/40 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/40 hover:shadow-glow">
      {/* 装饰 blob（更轻） */}
      <div className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full ${blobColor} blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-90`} />
      {/* 大号水印 icon（更淡） */}
      <Icon className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 text-primary/[0.05]" strokeWidth={1.5} />

      <CardContent className="relative flex h-full flex-col gap-1.5 p-4">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-md glass-chip">
            <Icon className="h-3 w-3 text-primary" />
          </span>
          <div className="text-xs font-medium text-muted-foreground">{item.name}</div>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
          {item.primary}
        </div>
        <div className="text-[11px] text-muted-foreground">{item.secondary}</div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${deltaChip}`}>
            {positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {item.delta}
          </span>
          <div className="flex-1">
            {item.visual === "spark" && item.data ? (
              <div className="flex justify-end">
                <Sparkline
                  data={item.data}
                  width={100}
                  height={30}
                  color={positive ? "var(--color-success)" : "var(--color-destructive)"}
                />
              </div>
            ) : item.visual === "progress" && typeof item.progress === "number" ? (
              <div className="relative h-2 overflow-hidden rounded-full bg-muted/70">
                <div
                  className="relative h-full rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-[0_0_8px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]"
                  style={{ width: `${item.progress}%` }}
                >
                  <div className="absolute inset-0 animate-shimmer-x bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.55)_50%,transparent_100%)]" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ 二级公司业务运营详情（去财务版）============
type CompanyType = "port" | "shipping" | "logistics";

type OpsMetric = {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  hint?: string;
};
type StructureItem = { name: string; value: number };
type ContribItem = { name: string; pp: number };
type BenchmarkItem = { name: string; value: number; median?: number };
type RegionItem = { name: string; value: string; yoy: string; up: boolean; trend: number[]; extra?: string };

type CompanyDetail = {
  type: CompanyType;
  name: string;
  enName: string;
  icon: typeof Anchor;
  tickers: { market: string; code: string }[];
  period: string;
  opsMetrics: OpsMetric[];
  structures: { title: string; items: StructureItem[] }[];
  contribution: { title: string; unit: string; items: ContribItem[] };
  benchmark: { title: string; unit: string; items: BenchmarkItem[] };
  regionAnalysis: { title: string; dimLabel: string; valueLabel: string; extraLabel?: string; rows: RegionItem[] };
  aiNote: string;
};

const companyDetails: Record<CompanyType, CompanyDetail> = {
  port: {
    type: "port",
    name: "招商港口",
    enName: "China Merchants Port",
    icon: Anchor,
    tickers: [
      { market: "A股", code: "001872" },
      { market: "H股", code: "00144" },
    ],
    period: "2026 Q1 累计",
    opsMetrics: [
      { label: "集装箱吞吐量", value: "681.7 万 TEU", delta: "+4.3%", up: true, hint: "主控码头" },
      { label: "散杂货吞吐量", value: "3217.2 万吨", delta: "+0.3%", up: true, hint: "主控码头" },
      { label: "平均装卸效率", value: "31.6 自然箱/小时", delta: "+1.2pp", up: true },
      { label: "增速 vs 行业中位数", value: "+1.8 pp", delta: "中位数 2.5%", up: true },
    ],
    structures: [
      {
        title: "业务结构占比",
        items: [
          { name: "港口业务", value: 99.5 },
          { name: "综合开发", value: 0.5 },
          { name: "其他", value: 0.0 },
        ],
      },
    ],
    contribution: {
      title: "区域增量贡献",
      unit: "pp",
      items: [
        { name: "华南区域", pp: 2.4 },
        { name: "海外港口", pp: 1.0 },
        { name: "华东区域", pp: 0.9 },
      ],
    },
    benchmark: {
      title: "码头全年增速对标",
      unit: "%",
      items: [
        { name: "HIPG", value: 67.7 },
        { name: "深西码头", value: 6.5 },
        { name: "TCP", value: 2.5 },
        { name: "CICT", value: 0.8 },
        { name: "LCT", value: -10.5 },
      ],
    },
    regionAnalysis: {
      title: "区域吞吐量完成情况",
      dimLabel: "区域",
      valueLabel: "吞吐量(万TEU)",
      extraLabel: "同比",
      rows: [
        { name: "华南", value: "421", yoy: "+6.4%", up: true, trend: [380, 390, 395, 405, 410, 415, 418, 421] },
        { name: "华东", value: "167", yoy: "-2.0%", up: false, trend: [175, 173, 172, 170, 169, 168, 168, 167] },
        { name: "海外", value: "94", yoy: "+0.9%", up: true, trend: [90, 91, 92, 92, 93, 93, 94, 94] },
      ],
    },
    aiNote: "增速领先行业中位数 1.8pp，华南为主增长引擎；LCT 增速大幅落后，建议 Q2 重点跟踪结构调整。",
  },
  shipping: {
    type: "shipping",
    name: "招商轮船",
    enName: "China Merchants Energy Shipping",
    icon: Ship,
    tickers: [{ market: "A股", code: "601872" }],
    period: "2026 Q1 累计",
    opsMetrics: [
      { label: "货运量", value: "7576.0 万吨", delta: "-8.5%", up: false },
      { label: "周转量", value: "4976.8 亿吨海里", delta: "+6.7%", up: true },
      { label: "营运率", value: "98.2%", delta: "-0.9pp", up: false },
      { label: "总运力", value: "1248 万 DWT", delta: "+2.6%", up: true },
      { label: "船舶周转率", value: "86.4%", delta: "+1.8pp", up: true },
      { label: "TCE 期租租金", value: "¥26,180/天", delta: "+4.3%", up: true, hint: "vs 中位数 +6.2%" },
    ],
    structures: [
      {
        title: "货种结构占比",
        items: [
          { name: "海宏", value: 81.1 },
          { name: "集运", value: 10.6 },
          { name: "其他", value: 6.3 },
          { name: "滚装", value: 2.0 },
        ],
      },
    ],
    contribution: {
      title: "货种增量贡献",
      unit: "pp",
      items: [
        { name: "集运", pp: 6.2 },
        { name: "海宏", pp: -1.1 },
        { name: "滚装", pp: -0.5 },
      ],
    },
    benchmark: {
      title: "船型营运率对标",
      unit: "%",
      items: [
        { name: "油轮", value: 97.8, median: 95.4 },
        { name: "散货", value: 95.1, median: 93.8 },
        { name: "滚装", value: 92.6, median: 91.1 },
      ],
    },
    regionAnalysis: {
      title: "船型运力效率分析",
      dimLabel: "船型",
      valueLabel: "营运率",
      extraLabel: "vs 中位数",
      rows: [
        { name: "油轮", value: "97.8%", yoy: "+2.4pp", up: true, trend: [95, 96, 96.5, 97, 97.2, 97.5, 97.6, 97.8] },
        { name: "散货", value: "95.1%", yoy: "+1.3pp", up: true, trend: [93, 93.5, 94, 94.2, 94.5, 94.8, 95, 95.1] },
        { name: "滚装", value: "92.6%", yoy: "+1.5pp", up: true, trend: [90, 90.5, 91, 91.4, 91.8, 92.2, 92.4, 92.6] },
      ],
    },
    aiNote: "货运量 -8.5% 但周转量 +6.7%，长航线占比与单船效率提升驱动；TCE 高于行业中位数 6.2%，运营效率领先。",
  },
  logistics: {
    type: "logistics",
    name: "中国外运",
    enName: "Sinotrans",
    icon: Truck,
    tickers: [
      { market: "A股", code: "601598" },
      { market: "H股", code: "00598" },
    ],
    period: "2026 Q1 累计",
    opsMetrics: [
      { label: "订单量", value: "128.4 万单", delta: "+9.7%", up: true },
      { label: "履约率", value: "96.8%", delta: "+1.1pp", up: true },
      { label: "单票毛利", value: "¥128.5", delta: "+2.4%", up: true },
      { label: "海外业务占比", value: "41.0%", delta: "+2.3pp", up: true },
      { label: "准时交付率", value: "95.7%", delta: "+0.8pp", up: true },
    ],
    structures: [
      {
        title: "业务线结构占比",
        items: [
          { name: "国际货代", value: 38 },
          { name: "合同物流", value: 27 },
          { name: "仓储与仓配", value: 18 },
          { name: "供应链服务", value: 11 },
          { name: "其他", value: 6 },
        ],
      },
      {
        title: "区域结构占比",
        items: [
          { name: "东南亚", value: 26 },
          { name: "欧洲", value: 24 },
          { name: "中东", value: 18 },
          { name: "美洲", value: 17 },
          { name: "其他", value: 15 },
        ],
      },
    ],
    contribution: {
      title: "业务线增量贡献",
      unit: "pp",
      items: [
        { name: "国际货代", pp: 2.7 },
        { name: "合同物流", pp: 1.8 },
        { name: "仓储与仓配", pp: 1.1 },
        { name: "供应链服务", pp: 0.6 },
      ],
    },
    benchmark: {
      title: "重点区域履约率对标",
      unit: "%",
      items: [
        { name: "东南亚", value: 97.4, median: 95.0 },
        { name: "欧洲", value: 95.8, median: 95.0 },
        { name: "美洲", value: 95.1, median: 95.0 },
        { name: "中东", value: 94.9, median: 95.0 },
      ],
    },
    regionAnalysis: {
      title: "区域订单与履约分析",
      dimLabel: "区域",
      valueLabel: "订单占比",
      extraLabel: "履约率",
      rows: [
        { name: "东南亚", value: "26%", yoy: "97.4%", up: true, trend: [22, 23, 23.5, 24, 25, 25.5, 26, 26], extra: "97.4%" },
        { name: "欧洲", value: "24%", yoy: "95.8%", up: true, trend: [21, 22, 22.5, 23, 23.5, 23.8, 24, 24] },
        { name: "中东", value: "18%", yoy: "94.9%", up: true, trend: [15, 15.5, 16, 16.5, 17, 17.5, 18, 18] },
        { name: "美洲", value: "17%", yoy: "95.1%", up: true, trend: [16, 16.2, 16.4, 16.6, 16.8, 16.9, 17, 17] },
      ],
    },
    aiNote: "海外业务占比 41% 且仍在扩张；东南亚履约率领先中位数 2.4pp，建议复制其网络化运营模式至中东。",
  },
};

function BusinessDrilldownCard() {
  const { role } = useMonitorRole();
  const lockedCompany = role.kind === "subsidiary" ? (role.company as CompanyType) : null;
  const [active, setActive] = useState<CompanyType>(lockedCompany ?? "port");
  const effective = lockedCompany ?? active;
  const detail = companyDetails[effective];
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <CardTitle className="text-base">板块下钻 · 二级公司业务运营</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              业务运营 / 结构拆解 / 增量贡献 / 行业对标 · 财务数据见上方「二级财务明细」
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => toast.info(`AI 解释 · ${detail.name}`, { description: detail.aiNote })}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI 解释
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5"
              onClick={() => toast.info(`跳转至 ${detail.name} 详情页`)}
            >
              详情 <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {lockedCompany ? (
          <div className="space-y-4">
            <CompanyProfileBar detail={detail} />
            <OpsSummaryGrid metrics={detail.opsMetrics} />
            <div className="grid gap-4 lg:grid-cols-2">
              <StructureCard structures={detail.structures} />
              <ContributionCard data={detail.contribution} />
            </div>
            <BenchmarkCard data={detail.benchmark} />
            <RegionAnalysisCard data={detail.regionAnalysis} />
          </div>
        ) : (
          <Tabs value={active} onValueChange={(v) => setActive(v as CompanyType)}>
            <TabsList>
              <TabsTrigger value="port">招商港口</TabsTrigger>
              <TabsTrigger value="shipping">招商轮船</TabsTrigger>
              <TabsTrigger value="logistics">中国外运</TabsTrigger>
            </TabsList>
            <TabsContent value={active} className="mt-4 space-y-4">
              <CompanyProfileBar detail={detail} />
              <OpsSummaryGrid metrics={detail.opsMetrics} />
              <div className="grid gap-4 lg:grid-cols-2">
                <StructureCard structures={detail.structures} />
                <ContributionCard data={detail.contribution} />
              </div>
              <BenchmarkCard data={detail.benchmark} />
              <RegionAnalysisCard data={detail.regionAnalysis} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

function CompanyProfileBar({ detail }: { detail: CompanyDetail }) {
  const Icon = detail.icon;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-0 gradient-soft shadow-soft p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">{detail.name}</span>
            <span className="text-xs text-muted-foreground">{detail.enName}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {detail.tickers.map((t) => (
              <Badge key={t.code} variant="secondary" className="bg-primary/10 text-primary">
                {t.market} · {t.code}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground">口径：{detail.period}</span>
        <SourceTag type="verified">已核验</SourceTag>
      </div>
    </div>
  );
}

function OpsSummaryGrid({ metrics }: { metrics: OpsMetric[] }) {
  const cols =
    metrics.length >= 6
      ? "sm:grid-cols-3 lg:grid-cols-6"
      : metrics.length === 5
      ? "sm:grid-cols-3 lg:grid-cols-5"
      : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div className={`grid gap-3 ${cols}`}>
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-xl border-0 gradient-soft shadow-soft p-3"
        >
          <div className="text-[11px] text-muted-foreground line-clamp-1">{m.label}</div>
          <div className="mt-1 text-lg font-semibold tracking-tight">{m.value}</div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
                m.up ? "text-success" : "text-destructive"
              }`}
            >
              {m.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {m.delta}
            </span>
            {m.hint && (
              <span className="text-[10px] text-muted-foreground line-clamp-1">{m.hint}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const STRUCTURE_COLORS = [
  "var(--color-primary)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-destructive)",
  "color-mix(in oklab, var(--color-primary) 50%, transparent)",
];

function StructureCard({ structures }: { structures: CompanyDetail["structures"] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="mb-3 text-sm font-medium">业务结构占比</div>
      <div className={`grid gap-4 ${structures.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {structures.map((s) => (
          <StructureDonut key={s.title} title={s.title} items={s.items} />
        ))}
      </div>
    </div>
  );
}

function StructureDonut({ title, items }: { title: string; items: StructureItem[] }) {
  const total = items.reduce((sum, i) => sum + i.value, 0) || 1;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div>
      <div className="mb-2 text-[11px] text-muted-foreground">{title}</div>
      <div className="flex items-center gap-3">
        <svg width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="var(--color-muted)" strokeWidth="14" />
          {items.map((item, idx) => {
            const len = (item.value / total) * circumference;
            const seg = (
              <circle
                key={item.name}
                cx="48"
                cy="48"
                r={radius}
                fill="none"
                stroke={STRUCTURE_COLORS[idx % STRUCTURE_COLORS.length]}
                strokeWidth="14"
                strokeDasharray={`${len} ${circumference - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 48 48)"
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        <div className="flex-1 space-y-1">
          {items.map((item, idx) => (
            <div key={item.name} className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ background: STRUCTURE_COLORS[idx % STRUCTURE_COLORS.length] }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </span>
              <span className="font-medium tabular-nums">{item.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContributionCard({ data }: { data: CompanyDetail["contribution"] }) {
  const max = Math.max(...data.items.map((i) => Math.abs(i.pp)), 1);
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium">{data.title}</span>
        <span className="text-[11px] text-muted-foreground">单位：{data.unit}</span>
      </div>
      <div className="space-y-2.5">
        {data.items.map((it) => {
          const positive = it.pp >= 0;
          const widthPct = (Math.abs(it.pp) / max) * 50;
          return (
            <div key={it.name} className="grid grid-cols-[80px_1fr_56px] items-center gap-2">
              <span className="text-xs text-muted-foreground line-clamp-1">{it.name}</span>
              <div className="relative h-5 rounded bg-muted/50">
                <div className="absolute inset-y-0 left-1/2 w-px bg-border/80" />
                <div
                  className={`absolute inset-y-0 ${positive ? "left-1/2 bg-success/70" : "right-1/2 bg-destructive/70"} rounded`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span
                className={`text-right text-xs font-medium tabular-nums ${
                  positive ? "text-success" : "text-destructive"
                }`}
              >
                {positive ? "+" : ""}
                {it.pp.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BenchmarkCard({ data }: { data: CompanyDetail["benchmark"] }) {
  const values = data.items.map((i) => i.value);
  const max = Math.max(...values.map(Math.abs), 1);
  const sorted = [...values].sort((a, b) => b - a);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  const median =
    data.items.find((i) => typeof i.median === "number")?.median ??
    sorted[Math.floor(sorted.length / 2)];
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium">{data.title}</span>
        <span className="text-[11px] text-muted-foreground">
          中位数 {median.toFixed(1)}{data.unit} · 单位 {data.unit}
        </span>
      </div>
      <div className="space-y-2.5">
        {data.items.map((it) => {
          const positive = it.value >= 0;
          const widthPct = (Math.abs(it.value) / max) * 100;
          const isTop = it.value === top;
          const isBottom = it.value === bottom;
          return (
            <div key={it.name} className="grid grid-cols-[100px_1fr_72px] items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground line-clamp-1">
                {it.name}
                {isTop && (
                  <Badge variant="secondary" className="h-4 bg-success/15 px-1 text-[9px] text-success">
                    Top
                  </Badge>
                )}
                {isBottom && it.value !== top && (
                  <Badge variant="secondary" className="h-4 bg-destructive/15 px-1 text-[9px] text-destructive">
                    Bottom
                  </Badge>
                )}
              </span>
              <div className="relative h-5 rounded bg-muted/50">
                <div
                  className={`absolute inset-y-0 left-0 rounded ${
                    positive ? "bg-primary/70" : "bg-destructive/70"
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
                <div
                  className="absolute inset-y-0 border-l border-dashed border-warning"
                  style={{ left: `${(Math.abs(median) / max) * 100}%` }}
                  title={`行业中位数 ${median}`}
                />
              </div>
              <span
                className={`text-right text-xs font-medium tabular-nums ${
                  positive ? "text-foreground" : "text-destructive"
                }`}
              >
                {positive ? "+" : ""}
                {it.value.toFixed(1)}
                {data.unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RegionAnalysisCard({ data }: { data: CompanyDetail["regionAnalysis"] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60">
        <span className="text-sm font-medium">{data.title}</span>
        <span className="text-[11px] text-muted-foreground">区域 / 业务线维度</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{data.dimLabel}</TableHead>
            <TableHead className="text-right">{data.valueLabel}</TableHead>
            {data.extraLabel && <TableHead className="text-right">{data.extraLabel}</TableHead>}
            <TableHead className="text-right">趋势</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((r) => (
            <TableRow key={r.name}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell className="text-right tabular-nums">{r.value}</TableCell>
              {data.extraLabel && (
                <TableCell className="text-right">
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                      r.up ? "text-success" : "text-destructive"
                    }`}
                  >
                    {r.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {r.yoy}
                  </span>
                </TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Sparkline data={r.trend} width={120} height={26} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
