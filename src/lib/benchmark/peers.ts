export type PeerRow = {
  id: string;
  name: string;
  self?: boolean;
  industry: string;
  marketCap: string;
  revenue: number; // 亿
  growth: number; // %
  margin: number;
  roe: number;
  rd: number;
  inventory: number; // 周转天数
  cash: number; // 经营现金流亿
  trend: number[];
};

export const peers: PeerRow[] = [
  {
    id: "self",
    name: "本企业",
    self: true,
    industry: "工业制造",
    marketCap: "—",
    revenue: 12.84,
    growth: 8.2,
    margin: 32.4,
    roe: 14.8,
    rd: 5.2,
    inventory: 78,
    cash: 1.92,
    trend: [40, 42, 45, 48, 50, 52, 54, 55],
  },
  {
    id: "peer-a",
    name: "行业龙头 A",
    industry: "工业制造",
    marketCap: "¥820亿",
    revenue: 28.5,
    growth: 11.4,
    margin: 35.8,
    roe: 18.2,
    rd: 7.1,
    inventory: 52,
    cash: 4.6,
    trend: [70, 72, 75, 78, 82, 85, 88, 92],
  },
  {
    id: "peer-b",
    name: "上市同行 B",
    industry: "工业制造",
    marketCap: "¥320亿",
    revenue: 15.21,
    growth: 6.5,
    margin: 30.1,
    roe: 12.3,
    rd: 4.8,
    inventory: 65,
    cash: 2.1,
    trend: [50, 51, 52, 54, 55, 56, 57, 58],
  },
  {
    id: "peer-c",
    name: "上市同行 C",
    industry: "工业制造",
    marketCap: "¥210亿",
    revenue: 9.84,
    growth: 4.1,
    margin: 28.6,
    roe: 10.2,
    rd: 3.9,
    inventory: 84,
    cash: 1.3,
    trend: [42, 43, 44, 44, 45, 45, 46, 46],
  },
  {
    id: "peer-d",
    name: "新兴黑马 D",
    industry: "工业制造",
    marketCap: "¥150亿",
    revenue: 7.6,
    growth: 22.5,
    margin: 29.4,
    roe: 16.5,
    rd: 8.2,
    inventory: 60,
    cash: 0.95,
    trend: [20, 24, 28, 33, 39, 46, 54, 62],
  },
];

export const metricGroups = {
  growth: ["revenue", "growth"],
  profit: ["margin", "roe"],
  efficiency: ["inventory", "cash"],
  rd: ["rd"],
} as const;

export const metricLabels: Record<string, { label: string; suffix?: string; better: "high" | "low" }> = {
  revenue: { label: "营收(亿)", better: "high" },
  growth: { label: "增长率", suffix: "%", better: "high" },
  margin: { label: "毛利率", suffix: "%", better: "high" },
  roe: { label: "ROE", suffix: "%", better: "high" },
  rd: { label: "研发占比", suffix: "%", better: "high" },
  inventory: { label: "存货周转天数", better: "low" },
  cash: { label: "经营现金流(亿)", better: "high" },
};
