export type MetricDef = {
  key: string;
  label: string;
  unit?: string;
  better: "high" | "low";
  source: string;
};

export type MetricGroup = {
  key: string;
  label: string;
  metrics: MetricDef[];
};

export const metricCatalog: MetricGroup[] = [
  {
    key: "scale",
    label: "规模与成长",
    metrics: [
      { key: "revenue", label: "营业总收入", unit: "亿", better: "high", source: "年报-利润表" },
      { key: "netProfit", label: "归母净利润", unit: "亿", better: "high", source: "年报-利润表" },
      { key: "deductedNetProfit", label: "扣非净利润", unit: "亿", better: "high", source: "年报-利润表" },
      { key: "operatingCashFlow", label: "经营现金流净额", unit: "亿", better: "high", source: "现金流量表" },
      { key: "revenueYoy", label: "营收同比", unit: "%", better: "high", source: "年报-利润表" },
      { key: "netProfitYoy", label: "净利润同比", unit: "%", better: "high", source: "年报-利润表" },
      { key: "revenueCagr3y", label: "三年营收 CAGR", unit: "%", better: "high", source: "Wind" },
    ],
  },
  {
    key: "profitability",
    label: "盈利能力",
    metrics: [
      { key: "grossMargin", label: "毛利率", unit: "%", better: "high", source: "利润表测算" },
      { key: "netMargin", label: "净利率", unit: "%", better: "high", source: "利润表测算" },
      { key: "salesMargin", label: "销售净利率", unit: "%", better: "high", source: "利润表测算" },
      { key: "roe", label: "ROE(摊薄)", unit: "%", better: "high", source: "Wind" },
      { key: "roa", label: "ROA", unit: "%", better: "high", source: "Wind" },
      { key: "ebitdaMargin", label: "EBITDA Margin", unit: "%", better: "high", source: "Wind" },
    ],
  },
  {
    key: "efficiency",
    label: "运营效率",
    metrics: [
      { key: "inventoryDays", label: "存货周转天数", unit: "天", better: "low", source: "资产负债表" },
      { key: "arDays", label: "应收账款周转天数", unit: "天", better: "low", source: "资产负债表" },
      { key: "apDays", label: "应付账款周转天数", unit: "天", better: "high", source: "资产负债表" },
      { key: "assetTurnover", label: "总资产周转率", unit: "次", better: "high", source: "Wind" },
      { key: "cashCycle", label: "现金循环周期", unit: "天", better: "low", source: "Wind" },
    ],
  },
  {
    key: "health",
    label: "财务健康",
    metrics: [
      { key: "debtRatio", label: "资产负债率", unit: "%", better: "low", source: "资产负债表" },
      { key: "currentRatio", label: "流动比率", unit: "倍", better: "high", source: "资产负债表" },
      { key: "quickRatio", label: "速动比率", unit: "倍", better: "high", source: "资产负债表" },
      { key: "interestCover", label: "利息保障倍数", unit: "倍", better: "high", source: "Wind" },
      { key: "interestDebtRatio", label: "有息负债率", unit: "%", better: "low", source: "Wind" },
      { key: "cashRatio", label: "货币资金/总资产", unit: "%", better: "high", source: "资产负债表" },
    ],
  },
  {
    key: "investment",
    label: "投入与回报",
    metrics: [
      { key: "rdRatio", label: "研发费用率", unit: "%", better: "high", source: "年报-费用" },
      { key: "rdHeadcount", label: "研发人员占比", unit: "%", better: "high", source: "年报-员工" },
      { key: "capexRatio", label: "资本开支/营收", unit: "%", better: "high", source: "现金流量表" },
      { key: "eps", label: "每股收益 EPS", unit: "元", better: "high", source: "年报" },
      { key: "cashEps", label: "每股经营现金流", unit: "元", better: "high", source: "现金流量表" },
      { key: "dividendPayout", label: "股息支付率", unit: "%", better: "high", source: "分红预案" },
    ],
  },
];

export const allMetricsFlat: (MetricDef & { groupKey: string; group: string })[] =
  metricCatalog.flatMap((g) =>
    g.metrics.map((m) => ({ ...m, groupKey: g.key, group: g.label })),
  );

export function getMetricDef(key: string): MetricDef | undefined {
  return allMetricsFlat.find((m) => m.key === key);
}

export type Dimension = "company" | "region" | "businessLine" | "time";

export const dimensionOptions: { key: Dimension; label: string }[] = [
  { key: "company", label: "公司" },
  { key: "region", label: "区域" },
  { key: "businessLine", label: "业务线" },
  { key: "time", label: "时间" },
];

export type Row = { label: string; value: number; yoy: number };

// ---- Mock dataset ---------------------------------------------------------
// 用一个基于种子的伪随机生成，保证每个指标在不同维度下都有合理可对比数据。
const dimLabels: Record<Dimension, string[]> = {
  company: ["本企业", "行业龙头 A", "上市同行 B", "上市同行 C", "新兴黑马 D"],
  region: ["华东", "华南", "华北", "海外", "西南"],
  businessLine: ["智能制造", "传统装备", "服务业务", "海外项目"],
  time: ["Q1", "Q2", "Q3", "Q4"],
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

function genRow(metricKey: string, dim: Dimension, label: string, def: MetricDef): Row {
  const seed = hash(`${metricKey}|${dim}|${label}`);
  const unit = def.unit;
  let base: number;
  if (unit === "%") base = 4 + seed * 36; // 4-40%
  else if (unit === "天") base = 30 + seed * 90; // 30-120 天
  else if (unit === "倍") base = 0.6 + seed * 4; // 0.6-4.6
  else if (unit === "次") base = 0.3 + seed * 1.4;
  else if (unit === "元") base = 0.4 + seed * 6;
  else base = 1 + seed * 28; // 亿
  const value = Math.round(base * 100) / 100;
  const yoy = Math.round((seed * 40 - 15) * 10) / 10; // -15 ~ +25
  return { label, value, yoy };
}

export function getMetricRows(metricKey: string, dim: Dimension): Row[] {
  const def = getMetricDef(metricKey) ?? allMetricsFlat[0];
  return dimLabels[dim].map((label) => genRow(metricKey, dim, label, def));
}
