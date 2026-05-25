/**
 * 首页角色 / 配置 / Mock 数据（按 PRD V2.0 权限划分）
 * 仅前端 mock，不接后端。
 */
import {
  Activity, AlertTriangle, BarChart3, Building2, ClipboardList, Compass,
  FileText, Flag, GitCompare, Lightbulb, Megaphone, ScrollText, Target,
  TrendingDown, TrendingUp, Users, Workflow, Zap,
  type LucideIcon,
} from "lucide-react";

/* ---------------- 类型 ---------------- */
export type RoleType = "group_leader" | "office_specialist" | "subsidiary_user";
export type OfficeScope = "investment" | "performance" | "strategy" | "innovation";
export type SectorKey = "all" | "port" | "shipping" | "logistics" | "new_biz";
export type SubsidiaryKey = "cmport" | "cmshipping" | "sinotrans";

export type BoardMode = "global_summary" | "sector_metric_workspace" | "company_workspace";

export interface HomeRolePreset {
  key: string;
  label: string;
  shortLabel: string;
  roleType: RoleType;
  officeScope?: OfficeScope;
  subsidiary?: SubsidiaryKey;
  showNorthStar: boolean;
  showTimeMap: boolean;
  boardMode: BoardMode;
  defaultSector: SectorKey;
  scopeText: string;
  focusText: string;
}

export const SECTOR_OPTIONS: { value: SectorKey; label: string }[] = [
  { value: "all", label: "全部板块" },
  { value: "port", label: "港口" },
  { value: "shipping", label: "航运" },
  { value: "logistics", label: "物流" },
  { value: "new_biz", label: "新业务" },
];

export const SUBSIDIARY_OPTIONS: { value: SubsidiaryKey; label: string }[] = [
  { value: "cmport", label: "招商港口" },
  { value: "cmshipping", label: "招商轮船" },
  { value: "sinotrans", label: "中国外运" },
];

/* ---------------- 6 个角色预设 ---------------- */
export const ROLE_PRESETS: HomeRolePreset[] = [
  {
    key: "group_leader",
    label: "集团战发领导",
    shortLabel: "战发领导",
    roleType: "group_leader",
    showNorthStar: true,
    showTimeMap: true,
    boardMode: "global_summary",
    defaultSector: "all",
    scopeText: "集团全局",
    focusText: "北极星 · 异常 · 待决策事项",
  },
  {
    key: "office_investment",
    label: "投资-资本处专员",
    shortLabel: "投资-资本处",
    roleType: "office_specialist",
    officeScope: "investment",
    showNorthStar: false,
    showTimeMap: true,
    boardMode: "sector_metric_workspace",
    defaultSector: "port",
    scopeText: "全集团 / 投资专题",
    focusText: "板块投资指标 · 异常对象 · 我的待办",
  },
  {
    key: "office_performance",
    label: "业绩考核处专员",
    shortLabel: "业绩考核处",
    roleType: "office_specialist",
    officeScope: "performance",
    showNorthStar: false,
    showTimeMap: true,
    boardMode: "sector_metric_workspace",
    defaultSector: "all",
    scopeText: "全集团 / 考核专题",
    focusText: "考核进度 · 待催办对象 · 我的待办",
  },
  {
    key: "office_strategy",
    label: "战略管理处专员",
    shortLabel: "战略管理处",
    roleType: "office_specialist",
    officeScope: "strategy",
    showNorthStar: true,
    showTimeMap: true,
    boardMode: "sector_metric_workspace",
    defaultSector: "all",
    scopeText: "全集团 / 战略专题",
    focusText: "北极星偏差 · 重点事项 · 我的待办",
  },
  {
    key: "office_innovation",
    label: "科技创新处专员",
    shortLabel: "科技创新处",
    roleType: "office_specialist",
    officeScope: "innovation",
    showNorthStar: false,
    showTimeMap: true,
    boardMode: "sector_metric_workspace",
    defaultSector: "all",
    scopeText: "全集团 / 科创专题",
    focusText: "研发投入 · 项目延期 · 平台建设",
  },
  {
    key: "subsidiary_cmport",
    label: "招商港口（二级公司）",
    shortLabel: "招商港口",
    roleType: "subsidiary_user",
    subsidiary: "cmport",
    showNorthStar: false,
    showTimeMap: true,
    boardMode: "company_workspace",
    defaultSector: "port",
    scopeText: "本公司",
    focusText: "本公司指标 · 集团待办 · 异常预警",
  },
];

/* ---------------- AI 推荐问题 ---------------- */
export const AI_RECOMMENDATIONS: Record<string, string[]> = {
  group_leader: [
    "本月集团经营分析有哪些红灯？",
    "四个处室分别有哪些重点事项需要关注？",
    "哪些板块偏离年度目标？",
    "未来预测里有哪些潜在风险？",
  ],
  office_investment: [
    "当前板块有哪些投资指标异常？",
    "哪些项目 IRR 不达标？",
    "哪些对象需要本周跟进？",
  ],
  office_performance: [
    "当前板块清算推进到哪一步？",
    "哪些公司仍未完成确认？",
    "本周最需要催办哪些对象？",
  ],
  office_strategy: [
    "当前北极星指标有哪些偏差？",
    "哪些板块重点任务滞后？",
    "五年规划哪些目标承压？",
  ],
  office_innovation: [
    "哪些板块研发投入偏低？",
    "哪些科技项目延期？",
    "哪些平台建设进度落后？",
  ],
  subsidiary_cmport: [
    "本公司当前有哪些预警？",
    "集团下发的重点事项有哪些？",
    "本公司哪些指标偏离目标？",
  ],
};

/* ---------------- 指标卡（核心看板区） ---------------- */
export type Status = "normal" | "warning" | "danger";

export interface MetricCard {
  name: string;
  value: string;
  yoy: string;
  mom: string;
  up: boolean;
  status: Status;
  data: number[];
  threshold: string;
  sector?: SectorKey;
}

const mk = (
  name: string, value: string, yoy: string, mom: string, up: boolean,
  status: Status, data: number[], threshold: string, sector: SectorKey = "all",
): MetricCard => ({ name, value, yoy, mom, up, status, data, threshold, sector });

/** 投资-资本处指标 */
export const INVESTMENT_METRICS: MetricCard[] = [
  mk("年度投资计划完成率", "68.4%", "+5.2pt", "+2.1pt", true, "warning", [55, 58, 60, 62, 64, 66, 67, 68], "低于目标 6.6pt", "port"),
  mk("固定资产投资执行率", "72.1%", "+3.8pt", "+1.4pt", true, "normal", [60, 63, 65, 67, 69, 70, 71, 72], "高于目标 1.1pt", "shipping"),
  mk("股权投资执行率", "54.6%", "-2.1pt", "-0.6pt", false, "danger", [62, 60, 58, 57, 56, 55, 55, 54], "低于目标 8.4pt", "logistics"),
  mk("IRR 达标率", "81.2%", "+4.5pt", "+0.8pt", true, "normal", [70, 72, 74, 76, 78, 79, 80, 81], "高于目标 3.2pt", "all"),
  mk("重大项目超期数", "5 项", "+2", "+1", false, "danger", [2, 2, 3, 3, 4, 4, 4, 5], "高于阈值 3 项", "port"),
  mk("投后评价完成率", "63.7%", "+8.1pt", "+3.2pt", true, "warning", [40, 45, 50, 54, 58, 60, 62, 63], "低于目标 6.3pt", "new_biz"),
];

/** 业绩考核处指标 */
export const PERFORMANCE_METRICS: MetricCard[] = [
  mk("目标表制定完成率", "92.3%", "+6.4pt", "+1.2pt", true, "normal", [70, 75, 80, 84, 88, 90, 91, 92], "高于目标 2.3pt"),
  mk("基准值审批完成率", "78.1%", "+4.5pt", "+2.4pt", true, "warning", [60, 63, 67, 70, 73, 75, 77, 78], "低于目标 1.9pt"),
  mk("合同归档完成率", "85.6%", "+3.2pt", "+0.8pt", true, "normal", [70, 73, 76, 78, 81, 83, 84, 85], "高于目标 0.6pt"),
  mk("定性清算完成率", "62.4%", "+12.1pt", "+5.6pt", true, "warning", [40, 45, 50, 54, 56, 58, 60, 62], "低于目标 7.6pt"),
  mk("定量清算完成率", "48.2%", "+8.4pt", "+3.1pt", true, "danger", [25, 30, 34, 38, 42, 44, 46, 48], "低于目标 21.8pt"),
  mk("最终结果确认率", "35.1%", "+15.6pt", "+8.4pt", true, "danger", [10, 14, 18, 22, 26, 30, 33, 35], "低于目标 34.9pt"),
];

/** 战略管理处指标 */
export const STRATEGY_METRICS: MetricCard[] = [
  mk("战略任务完成率", "71.4%", "+5.6pt", "+1.8pt", true, "warning", [55, 60, 63, 65, 67, 69, 70, 71], "低于目标 3.6pt"),
  mk("重点事项按期完成率", "82.6%", "+3.4pt", "+0.6pt", true, "normal", [70, 73, 76, 78, 80, 81, 82, 82], "高于目标 1.6pt"),
  mk("战略任务延期数", "8 项", "-3", "-1", true, "warning", [12, 11, 11, 10, 9, 9, 8, 8], "高于阈值 2 项"),
  mk("战略合作推进情况", "良好", "+2 级", "—", true, "normal", [3, 3, 3, 4, 4, 4, 4, 4], "高于目标 1 级"),
  mk("改革事项完成率", "58.3%", "+8.2pt", "+2.4pt", true, "warning", [40, 44, 48, 51, 54, 56, 57, 58], "低于目标 11.7pt"),
  mk("上市公司质量提升完成率", "76.4%", "+6.8pt", "+1.5pt", true, "normal", [60, 64, 67, 70, 72, 74, 75, 76], "高于目标 1.4pt"),
];

/** 科技创新处指标 */
export const INNOVATION_METRICS: MetricCard[] = [
  mk("研发投入金额", "¥ 8.42 亿", "+18.4%", "+3.2%", true, "normal", [600, 650, 680, 720, 760, 800, 820, 842], "高于目标 4.2%"),
  mk("研发投入强度", "3.85%", "+0.42pt", "+0.06pt", true, "warning", [3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.85], "低于目标 0.15pt"),
  mk("科技项目按期完成率", "74.6%", "+4.8pt", "+1.4pt", true, "warning", [60, 63, 66, 68, 70, 72, 73, 74], "低于目标 5.4pt"),
  mk("平台数量", "42 个", "+5", "+1", true, "normal", [35, 36, 37, 38, 39, 40, 41, 42], "高于目标 2 个"),
  mk("国家级 / 省部级平台数", "18 个", "+3", "+1", true, "normal", [13, 14, 14, 15, 16, 17, 17, 18], "高于目标 1 个"),
  mk("成果产出数", "126 项", "+24.5%", "+4.8%", true, "normal", [80, 90, 98, 105, 112, 118, 122, 126], "高于目标 12 项"),
];

/** 二级公司本公司指标 */
export const COMPANY_METRICS: MetricCard[] = [
  mk("综合经营状态", "良好", "+1 级", "—", true, "normal", [3, 3, 3, 4, 4, 4, 4, 4], "高于阈值 1 级"),
  mk("年度目标达成率", "68.5%", "+5.4pt", "+1.6pt", true, "warning", [50, 54, 57, 60, 63, 65, 67, 68], "低于目标 6.5pt"),
  mk("当前异常指标数", "3 项", "+1", "+1", false, "danger", [1, 1, 2, 2, 2, 3, 3, 3], "高于阈值 1 项"),
  mk("重点任务按期完成率", "84.2%", "+3.6pt", "+0.8pt", true, "normal", [72, 75, 77, 79, 81, 82, 83, 84], "高于目标 0.2pt"),
];

/** 北极星摘要（领导 / 战略处） */
export interface NorthStarItem {
  name: string;
  value: string;
  delta: string;
  status: Status;
}
export const NORTH_STAR_SUMMARY: NorthStarItem[] = [
  { name: "经营健康指数", value: "78.4", delta: "+2.1", status: "normal" },
  { name: "营收完成率", value: "62.3%", delta: "-1.4pt", status: "warning" },
  { name: "净利完成率", value: "58.1%", delta: "-3.2pt", status: "danger" },
  { name: "战略任务进度", value: "71.4%", delta: "+1.8pt", status: "warning" },
];

/* ---------------- 时间地图（4×4） ---------------- */
export const TIMEMAP_ROWS = ["季度分析", "年度执行", "五年规划", "未来预测"] as const;
export const TIMEMAP_COLS = ["战略", "财务", "业务管理", "风控合规"] as const;
export type TimeMapRow = typeof TIMEMAP_ROWS[number];
export type TimeMapCol = typeof TIMEMAP_COLS[number];

/** 领导：异常象限红点 */
export const LEADER_ANOMALY_QUADRANTS: Array<[TimeMapRow, TimeMapCol]> = [
  ["季度分析", "财务"],
  ["年度执行", "业务管理"],
  ["未来预测", "风控合规"],
];

/** 处室关注列（专员） */
export const OFFICE_FOCUS_COLS: Record<OfficeScope, TimeMapCol[]> = {
  investment: ["财务", "业务管理"],
  performance: ["业务管理"],
  strategy: ["战略"],
  innovation: ["战略", "业务管理"],
};

/* ---------------- 异常与待办区 ---------------- */
export type TaskTone = "danger" | "warning" | "primary" | "muted";
export interface TaskGroup {
  key: string;
  title: string;
  icon: LucideIcon;
  tone: TaskTone;
  items: { text: string; meta: string; level?: "高" | "中" | "低" }[];
}

export const TASKS_BY_ROLE: Record<string, TaskGroup[]> = {
  group_leader: [
    {
      key: "anomaly", title: "重大异常公司 / 板块", icon: AlertTriangle, tone: "danger",
      items: [
        { text: "招商港口 · 应收账款激增 18.3%", meta: "已超预警线", level: "高" },
        { text: "航运板块 · 净利环比 -12%", meta: "持续 2 个月", level: "高" },
        { text: "新业务 · 毛利率 -2.4pt", meta: "本月恶化", level: "中" },
      ],
    },
    {
      key: "decide", title: "待领导拍板事项", icon: Flag, tone: "primary",
      items: [
        { text: "Q2 投资计划调整方案", meta: "战发部已上会", level: "高" },
        { text: "新业务孵化预算追加", meta: "今日截止", level: "中" },
      ],
    },
    {
      key: "cross", title: "跨处室协调问题", icon: Workflow, tone: "warning",
      items: [
        { text: "投资-业绩 KPI 口径冲突", meta: "投资处 + 业绩处", level: "中" },
      ],
    },
    {
      key: "risk", title: "重点风险摘要", icon: TrendingDown, tone: "danger",
      items: [
        { text: "汇率波动对航运营收影响", meta: "未来预测 · 高敏感", level: "高" },
      ],
    },
  ],
  office_investment: [
    {
      key: "abnormal", title: "板块异常对象池", icon: AlertTriangle, tone: "danger",
      items: [
        { text: "X 项目 IRR 跌至 5.4%（不达标）", meta: "港口板块", level: "高" },
        { text: "Y 项目超期 45 天", meta: "航运板块", level: "高" },
        { text: "Z 项目投后评价滞后", meta: "新业务", level: "中" },
      ],
    },
    {
      key: "todo", title: "我的待办流", icon: ClipboardList, tone: "primary",
      items: [
        { text: "审批 3 项股权投资变更", meta: "今日截止" },
        { text: "回复 2 项投后评价问询", meta: "本周内" },
      ],
    },
    {
      key: "overdue", title: "逾期未处理对象", icon: TrendingDown, tone: "warning",
      items: [
        { text: "A 子公司 Q1 投资执行报告", meta: "逾期 5 天", level: "中" },
      ],
    },
    {
      key: "remind", title: "高优先级催办对象", icon: Megaphone, tone: "warning",
      items: [
        { text: "B 子公司 IRR 复核材料", meta: "已催办 2 次", level: "高" },
      ],
    },
  ],
  office_performance: [
    {
      key: "abnormal", title: "板块异常对象池", icon: AlertTriangle, tone: "danger",
      items: [
        { text: "8 家公司未完成定量清算", meta: "全板块", level: "高" },
        { text: "3 家公司目标表未确认", meta: "港口板块", level: "中" },
      ],
    },
    {
      key: "todo", title: "我的待办流", icon: ClipboardList, tone: "primary",
      items: [
        { text: "审批 5 份基准值申请", meta: "今日截止" },
        { text: "回复 3 项清算口径问询", meta: "本周内" },
      ],
    },
    {
      key: "overdue", title: "逾期未处理对象", icon: TrendingDown, tone: "warning",
      items: [
        { text: "C 子公司定性清算材料", meta: "逾期 7 天", level: "高" },
      ],
    },
    {
      key: "remind", title: "高优先级催办对象", icon: Megaphone, tone: "warning",
      items: [
        { text: "D / E 子公司最终结果确认", meta: "已催办 3 次", level: "高" },
      ],
    },
  ],
  office_strategy: [
    {
      key: "abnormal", title: "板块异常对象池", icon: AlertTriangle, tone: "danger",
      items: [
        { text: "5 项重点事项滞后", meta: "战略板块", level: "高" },
        { text: "2 项改革任务延期", meta: "上市公司质量提升", level: "中" },
      ],
    },
    {
      key: "todo", title: "我的待办流", icon: ClipboardList, tone: "primary",
      items: [
        { text: "审核 Q1 战略执行简报", meta: "今日截止" },
        { text: "回复北极星偏差归因", meta: "本周内" },
      ],
    },
    {
      key: "overdue", title: "逾期未处理对象", icon: TrendingDown, tone: "warning",
      items: [
        { text: "F 子公司战略合作进度反馈", meta: "逾期 3 天", level: "中" },
      ],
    },
    {
      key: "remind", title: "高优先级催办对象", icon: Megaphone, tone: "warning",
      items: [
        { text: "G 子公司五年规划修订", meta: "已催办 1 次", level: "高" },
      ],
    },
  ],
  office_innovation: [
    {
      key: "abnormal", title: "板块异常对象池", icon: AlertTriangle, tone: "danger",
      items: [
        { text: "4 个研发项目延期", meta: "全板块", level: "高" },
        { text: "2 家公司研发投入强度低于阈值", meta: "新业务", level: "中" },
      ],
    },
    {
      key: "todo", title: "我的待办流", icon: ClipboardList, tone: "primary",
      items: [
        { text: "审批 2 项国家级平台申报", meta: "今日截止" },
        { text: "回复成果产出口径", meta: "本周内" },
      ],
    },
    {
      key: "overdue", title: "逾期未处理对象", icon: TrendingDown, tone: "warning",
      items: [
        { text: "H 子公司平台建设台账", meta: "逾期 4 天", level: "中" },
      ],
    },
    {
      key: "remind", title: "高优先级催办对象", icon: Megaphone, tone: "warning",
      items: [
        { text: "I 子公司科技项目结题", meta: "已催办 2 次", level: "高" },
      ],
    },
  ],
  subsidiary_cmport: [
    {
      key: "warn", title: "本公司预警事项", icon: AlertTriangle, tone: "danger",
      items: [
        { text: "应收账款 90+ 占比抬升 3pt", meta: "本月新增", level: "高" },
        { text: "X 项目 IRR 不达标", meta: "投资专题", level: "中" },
      ],
    },
    {
      key: "group", title: "集团待办要求", icon: Megaphone, tone: "primary",
      items: [
        { text: "上报 Q1 投资执行报告", meta: "今日截止", level: "高" },
        { text: "完成基准值二次审批", meta: "本周内" },
      ],
    },
    {
      key: "confirm", title: "本公司待确认事项", icon: ClipboardList, tone: "warning",
      items: [
        { text: "目标表第二版", meta: "业绩考核处下发" },
      ],
    },
    {
      key: "return", title: "已退回需补充事项", icon: TrendingDown, tone: "warning",
      items: [
        { text: "战略合作进度反馈", meta: "战略处退回 · 缺证据" },
      ],
    },
  ],
};

/* ---------------- 快捷入口 ---------------- */
export interface QuickEntry { label: string; icon: LucideIcon; to: string }

export const QUICK_ENTRIES: Record<string, QuickEntry[]> = {
  group_leader: [
    { label: "进入监控", icon: Activity, to: "/monitor" },
    { label: "查看北极星全景", icon: Target, to: "/monitor" },
    { label: "查看时间地图", icon: Compass, to: "/monitor" },
    { label: "查看待决策事项", icon: Flag, to: "/report" },
    { label: "打开最新经营分析报告", icon: FileText, to: "/report" },
  ],
  office_investment: [
    { label: "进入监控-投资视角", icon: Activity, to: "/monitor" },
    { label: "查看项目异常池", icon: AlertTriangle, to: "/monitor" },
    { label: "打开项目审批列表", icon: ClipboardList, to: "/monitor" },
    { label: "生成投资专题简报", icon: FileText, to: "/report" },
  ],
  office_performance: [
    { label: "进入监控-考核视角", icon: Activity, to: "/monitor" },
    { label: "打开目标表列表", icon: ClipboardList, to: "/monitor" },
    { label: "打开清算进度页", icon: BarChart3, to: "/monitor" },
    { label: "生成考核推进简报", icon: FileText, to: "/report" },
  ],
  office_strategy: [
    { label: "进入监控-战略视角", icon: Activity, to: "/monitor" },
    { label: "打开北极星详情", icon: Target, to: "/monitor" },
    { label: "打开重点事项列表", icon: Flag, to: "/monitor" },
    { label: "生成战略执行简报", icon: FileText, to: "/report" },
  ],
  office_innovation: [
    { label: "进入监控-科创视角", icon: Activity, to: "/monitor" },
    { label: "打开项目进度页", icon: ScrollText, to: "/monitor" },
    { label: "打开平台建设台账", icon: Building2, to: "/monitor" },
    { label: "生成科创分析简报", icon: FileText, to: "/report" },
  ],
  subsidiary_cmport: [
    { label: "查看本公司监控", icon: Activity, to: "/monitor" },
    { label: "打开本公司待办", icon: ClipboardList, to: "/monitor" },
    { label: "查看本公司异常对象", icon: AlertTriangle, to: "/monitor" },
    { label: "生成本公司经营摘要", icon: FileText, to: "/report" },
  ],
};

/* ---------------- helper ---------------- */
export function pickMetricsByOffice(office: OfficeScope): MetricCard[] {
  switch (office) {
    case "investment": return INVESTMENT_METRICS;
    case "performance": return PERFORMANCE_METRICS;
    case "strategy": return STRATEGY_METRICS;
    case "innovation": return INNOVATION_METRICS;
  }
}

export function filterBySector(list: MetricCard[], sector: SectorKey): MetricCard[] {
  if (sector === "all") return list;
  // 优先 sector 匹配，无匹配则回退全部
  const matched = list.filter((m) => m.sector === sector || m.sector === "all");
  return matched.length ? matched : list;
}

/** 推荐问题 fallback 处理 */
export function getRecommendations(roleKey: string): string[] {
  return AI_RECOMMENDATIONS[roleKey] ?? AI_RECOMMENDATIONS.group_leader;
}
export function getTasks(roleKey: string): TaskGroup[] {
  return TASKS_BY_ROLE[roleKey] ?? TASKS_BY_ROLE.group_leader;
}
export function getQuickEntries(roleKey: string): QuickEntry[] {
  return QUICK_ENTRIES[roleKey] ?? QUICK_ENTRIES.group_leader;
}
