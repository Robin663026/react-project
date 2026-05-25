import type { CompanyKey } from "@/hooks/useMonitorRole";

export type CellStatus = "good" | "warn" | "risk" | "future";
export type Cell = { label: string; detail: string; status: CellStatus };

export const subsidiaryTimeMap: Record<CompanyKey, Record<string, Record<string, Cell>>> = {
  port: {
    strategy: {
      quarter: { label: "港口布局推进", detail: "2 个新港区前期评估完成", status: "good" },
      year: { label: "国际化拓展 65%", detail: "海外港口运营公司年度任务进度 65%", status: "good" },
      fiveYear: { label: "五年港口网络 78%", detail: "全球港口网络规划完成 78%", status: "good" },
      forecast: { label: "区域协同 +3.4pt", detail: "AI 推演：粤港澳协同将贡献 +3.4pt 增长", status: "future" },
    },
    finance: {
      quarter: { label: "毛利率 18.9%", detail: "环比 +0.7pt，结构改善", status: "good" },
      year: { label: "净利完成 76%", detail: "归母净利润 ¥18.6 亿，完成 76%", status: "good" },
      fiveYear: { label: "ROE 15.6%/16%", detail: "距五年目标 ROE 16% 仍差 0.4pt", status: "good" },
      forecast: { label: "资本开支高位", detail: "AI 监测：未来两年资本开支保持高位", status: "warn" },
    },
    ops: {
      quarter: { label: "吞吐量 +9.2%", detail: "Q1 集装箱吞吐量同比 +9.2%", status: "good" },
      year: { label: "作业效率 +6%", detail: "港区平均作业效率提升 6%", status: "good" },
      fiveYear: { label: "智慧港口 70%", detail: "智慧港口建设五年覆盖率 70%", status: "good" },
      forecast: { label: "新港区上量", detail: "AI 预测：2027 新港区贡献吞吐量 +12%", status: "future" },
    },
    legal: {
      quarter: { label: "0 重大事件", detail: "本季无重大合规事件", status: "good" },
      year: { label: "区域风险可控", detail: "海外港区风险评级 A-", status: "good" },
      fiveYear: { label: "项目风险池 8 项", detail: "五年规划期内待化解项目风险 8 项", status: "warn" },
      forecast: { label: "海外合规收紧", detail: "AI 监测：欧盟港口运营合规要求收紧", status: "risk" },
    },
  },
  shipping: {
    strategy: {
      quarter: { label: "运力结构调整", detail: "VLCC 船型占比提升 2pt", status: "good" },
      year: { label: "业务布局 60%", detail: "年度业务布局优化任务 60%", status: "warn" },
      fiveYear: { label: "船队结构 68%", detail: "五年船队结构调整完成 68%", status: "good" },
      forecast: { label: "周期低谷预警", detail: "AI 推演：2027 上半年航运景气下行", status: "risk" },
    },
    finance: {
      quarter: { label: "净利率承压", detail: "Q1 净利率 16.8%，环比 -0.6pt", status: "warn" },
      year: { label: "ROE 13.6%", detail: "归母 ROE 13.6%，距目标 -1.4pt", status: "warn" },
      fiveYear: { label: "资产负债率 58%", detail: "五年内资产负债率维持 58% 左右", status: "warn" },
      forecast: { label: "回报率分化", detail: "AI 预测：船型间回报率分化加剧", status: "future" },
    },
    ops: {
      quarter: { label: "船舶利用率 92%", detail: "Q1 船舶利用率 92%，行业领先", status: "good" },
      year: { label: "周转效率 +4%", detail: "船队平均周转效率提升 4%", status: "good" },
      fiveYear: { label: "船型结构优化 70%", detail: "节能船型占比五年目标进度 70%", status: "good" },
      forecast: { label: "运价波动放大", detail: "AI 监测：BDI 波动加剧", status: "warn" },
    },
    legal: {
      quarter: { label: "1 起合规整改", detail: "1 起船舶合规整改已完成", status: "warn" },
      year: { label: "国际环境风险", detail: "红海航线持续受地缘风险影响", status: "warn" },
      fiveYear: { label: "合规体系 75%", detail: "国际合规体系建设完成 75%", status: "good" },
      forecast: { label: "环保新规风险", detail: "IMO 新排放规则 2027 生效", status: "risk" },
    },
  },
  logistics: {
    strategy: {
      quarter: { label: "通道能力 +8%", detail: "跨境通道运力同比 +8%", status: "good" },
      year: { label: "国际化经营 70%", detail: "年度国际化经营任务进度 70%", status: "good" },
      fiveYear: { label: "协同布局 65%", detail: "五年协同布局完成 65%", status: "good" },
      forecast: { label: "RCEP 红利", detail: "AI 推演：RCEP 通道贡献 +5pt 增长", status: "future" },
    },
    finance: {
      quarter: { label: "回款放缓", detail: "应收账款 +18%，DSO 延长 6 天", status: "warn" },
      year: { label: "利润完成 80%", detail: "归母净利润 ¥21.4 亿，完成 80%", status: "good" },
      fiveYear: { label: "现金回笼五年承压", detail: "现金回笼五年目标进度仅 58%", status: "warn" },
      forecast: { label: "利润结构改善", detail: "AI 预测：高毛利业务占比将提升", status: "future" },
    },
    ops: {
      quarter: { label: "网络效率 +5%", detail: "物流网络协同效率提升 5%", status: "good" },
      year: { label: "客户结构优化 62%", detail: "客户结构优化任务进度 62%", status: "warn" },
      fiveYear: { label: "数字化网络 80%", detail: "五年数字化物流网络完成 80%", status: "good" },
      forecast: { label: "重点业务集中度上升", detail: "AI 预测：Top 20 客户集中度上升至 45%", status: "warn" },
    },
    legal: {
      quarter: { label: "跨境合规 2 起", detail: "本季跨境合规事件 2 起", status: "warn" },
      year: { label: "合规体系建设 78%", detail: "全年合规体系建设进度 78%", status: "good" },
      fiveYear: { label: "业务稳定性提升", detail: "重点业务稳定性五年改善 12pt", status: "good" },
      forecast: { label: "海外合规收紧", detail: "AI 监测：欧盟海关数据新规 2027 生效", status: "risk" },
    },
  },
};

export const companyTimeMapFocus: Record<CompanyKey, string> = {
  port: "战略：港口布局 / 财务：利润现金流 / 业务：吞吐与港区运营 / 风控：区域与合规",
  shipping: "战略：运力调整 / 财务：利润与回报 / 业务：船队效率 / 风控：周期与合规",
  logistics: "战略：通道能力 / 财务：收入质量 / 业务：网络效率 / 风控：跨境与合规",
};
