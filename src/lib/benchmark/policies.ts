export type PolicyCardData = {
  id: string;
  title: string;
  org: string;
  publishDate: string;
  level: "国务院" | "部委" | "地方" | "海外监管";
  topic: string;
  scope: string;
  impact: "good" | "high" | "risk" | "neutral";
  impactLabel: string;
  summary: string;
  relatedKpi: string;
  relatedMetrics: string[];
  actions: string[];
  confidence: number;
  sources: { name: string; url: string }[];
  fetchedAt: string;
  parsedAt: string;
  priority?: boolean;
};

export const policies: PolicyCardData[] = [
  {
    id: "p-001",
    title: "国务院《关于加快数字经济发展的指导意见》",
    org: "国务院",
    publishDate: "2026-04-15",
    level: "国务院",
    topic: "数字化",
    scope: "集团",
    impact: "high",
    impactLabel: "重大利好",
    summary: "明确制造业数字化转型补贴最高 30%，覆盖智能装备、工业互联网。",
    relatedKpi: "研发投入 / 数字化营收占比",
    relatedMetrics: ["研发投入", "数字化营收占比"],
    actions: ["申报补贴 ¥3,000 万", "Q2 启动智能产线二期", "与工信部对接试点"],
    confidence: 0.92,
    sources: [
      { name: "政府公报", url: "#" },
      { name: "工信部解读", url: "#" },
    ],
    fetchedAt: "2026-04-16 08:12",
    parsedAt: "2026-04-16 08:14",
    priority: true,
  },
  {
    id: "p-002",
    title: "欧盟数据隐私新规 (GDPR-II)",
    org: "European Commission",
    publishDate: "2026-03-28",
    level: "海外监管",
    topic: "数据合规",
    scope: "海外业务",
    impact: "risk",
    impactLabel: "合规风险",
    summary: "境外用户数据跨境传输须额外认证，违规罚金最高营收 4%。",
    relatedKpi: "海外业务营收 (¥1.12亿)",
    relatedMetrics: ["海外营收", "合规支出"],
    actions: ["7 月前完成 SCC 认证", "法务＋IT 联合排查", "海外子公司合规复盘"],
    confidence: 0.88,
    sources: [
      { name: "EUR-Lex 原文", url: "#" },
      { name: "中伦律师所简报", url: "#" },
    ],
    fetchedAt: "2026-03-29 09:01",
    parsedAt: "2026-03-29 09:05",
    priority: true,
  },
  {
    id: "p-003",
    title: "央行下调 5 年期 LPR 10bp",
    org: "中国人民银行",
    publishDate: "2026-04-10",
    level: "部委",
    topic: "金融",
    scope: "集团",
    impact: "good",
    impactLabel: "利好",
    summary: "融资成本下降，建议加快长期债务置换并锁定低利率。",
    relatedKpi: "财务费用 / 融资成本",
    relatedMetrics: ["财务费用", "融资成本"],
    actions: ["置换 ¥5 亿存量贷款", "测算节省利息 ¥500 万/年"],
    confidence: 0.95,
    sources: [{ name: "央行公告", url: "#" }],
    fetchedAt: "2026-04-10 16:33",
    parsedAt: "2026-04-10 16:34",
  },
  {
    id: "p-004",
    title: "工信部《工业 AI Agent 应用指南》",
    org: "工信部",
    publishDate: "2026-04-22",
    level: "部委",
    topic: "工业自动化",
    scope: "二级公司 · 智能制造",
    impact: "high",
    impactLabel: "重大利好",
    summary: "明确工业 AI Agent 应用补贴与示范项目入选标准，鼓励 PCB/汽车零部件行业试点。",
    relatedKpi: "智能制造营收 / 自动化率",
    relatedMetrics: ["自动化率", "智能制造营收"],
    actions: ["申报示范项目", "与 AI 供应商联合 POC"],
    confidence: 0.86,
    sources: [{ name: "工信部原文", url: "#" }],
    fetchedAt: "2026-04-22 11:00",
    parsedAt: "2026-04-22 11:02",
    priority: true,
  },
  {
    id: "p-005",
    title: "广东省《制造业绿色低碳转型行动计划》",
    org: "广东省工信厅",
    publishDate: "2026-04-05",
    level: "地方",
    topic: "ESG",
    scope: "二级公司 · 华南",
    impact: "good",
    impactLabel: "利好",
    summary: "对单位能耗下降 ≥10% 的制造企业给予电价补贴及绿色信贷支持。",
    relatedKpi: "单位能耗 / ESG 评级",
    relatedMetrics: ["单位能耗", "ESG 评级"],
    actions: ["申报电价补贴", "对接绿色信贷"],
    confidence: 0.83,
    sources: [{ name: "省政府公告", url: "#" }],
    fetchedAt: "2026-04-06 10:21",
    parsedAt: "2026-04-06 10:23",
  },
  {
    id: "p-006",
    title: "美国对部分锂电池产品加征关税",
    org: "USTR",
    publishDate: "2026-04-18",
    level: "海外监管",
    topic: "储能",
    scope: "海外业务",
    impact: "risk",
    impactLabel: "重大风险",
    summary: "对储能用锂电池加征 25% 关税，对北美出口业务造成直接影响。",
    relatedKpi: "北美营收 / 储能业务毛利",
    relatedMetrics: ["北美营收", "储能毛利"],
    actions: ["评估墨西哥产能转移", "复盘价格策略"],
    confidence: 0.81,
    sources: [{ name: "USTR 公告", url: "#" }],
    fetchedAt: "2026-04-19 07:45",
    parsedAt: "2026-04-19 07:48",
  },
];
