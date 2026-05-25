export type Preset = {
  key: string;
  label: string;
  description: string;
  metrics: string[];
};

export const presets: Preset[] = [
  {
    key: "profitability",
    label: "盈利能力",
    description: "毛利 / 净利 / ROE / ROA",
    metrics: ["grossMargin", "netMargin", "roe", "roa", "ebitdaMargin"],
  },
  {
    key: "efficiency",
    label: "运营效率",
    description: "周转 / 现金循环",
    metrics: ["inventoryDays", "arDays", "assetTurnover", "cashCycle"],
  },
  {
    key: "health",
    label: "财务健康",
    description: "负债 / 流动性 / 利息覆盖",
    metrics: ["debtRatio", "currentRatio", "interestCover", "interestDebtRatio"],
  },
  {
    key: "growth",
    label: "成长动能",
    description: "收入 / 利润 / CAGR",
    metrics: ["revenue", "revenueYoy", "netProfitYoy", "revenueCagr3y"],
  },
  {
    key: "rd",
    label: "研发投入",
    description: "研发 / 资本开支",
    metrics: ["rdRatio", "rdHeadcount", "capexRatio"],
  },
];
