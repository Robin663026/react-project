// 时间地图 4×4 证据链 mock
export type EvidenceStatus = "normal" | "warning" | "critical" | "future";

export type QuadrantEvidence = {
  quadrantId: string;
  timeAxis: string;
  dimensionAxis: string;
  status: EvidenceStatus;
  sectors: string[];
  subjects: string[];
  summary: string;
  signalReasons: { rule: string; threshold: string; actual: string; trendNote?: string }[];
  metricEvidence: { metricName: string; value: string; target?: string; trend?: number[]; status: EvidenceStatus }[];
  objectEvidence: { objectName: string; objectType: "company" | "project" | "task" | "platform"; status: string; owner?: string; officeScope?: string; note?: string }[];
  sourceMaterials: { title: string; type: string; date: string; source: string; summary: string }[];
  aiReasoning: string;
  actions: { label: string; target: string }[];
};

const TIME_LABEL: Record<string, string> = {
  quarter: "季度分析",
  year: "年度执行",
  fiveYear: "五年规划",
  forecast: "未来预测",
};
const DIM_LABEL: Record<string, string> = {
  strategy: "战略",
  finance: "财务",
  ops: "业务管理",
  legal: "风控合规",
};

function build(
  dim: string,
  time: string,
  status: EvidenceStatus,
  data: Partial<QuadrantEvidence>,
): QuadrantEvidence {
  return {
    quadrantId: `${dim}-${time}`,
    timeAxis: TIME_LABEL[time],
    dimensionAxis: DIM_LABEL[dim],
    status,
    sectors: [],
    subjects: [],
    summary: "",
    signalReasons: [],
    metricEvidence: [],
    objectEvidence: [],
    sourceMaterials: [],
    aiReasoning: "",
    actions: [
      { label: "查看相关公司", target: "company" },
      { label: "生成 AI 简报", target: "brief" },
      { label: "导出证据链摘要", target: "export" },
    ],
    ...data,
  };
}

export const quadrantEvidence: Record<string, Record<string, QuadrantEvidence>> = {
  strategy: {
    quarter: build("strategy", "quarter", "normal", {
      sectors: ["全集团"],
      subjects: ["X3 系列产品线"],
      summary: "本季 12 个战略里程碑应完成 11 个，X3 系列提前上线",
      signalReasons: [{ rule: "里程碑完成率", threshold: "≥80%", actual: "92%", trendNote: "连续 3 期上行" }],
      metricEvidence: [
        { metricName: "里程碑完成率", value: "92%", target: "80%", trend: [76, 82, 85, 88, 92], status: "normal" },
        { metricName: "战略任务完成率", value: "78%", target: "75%", trend: [60, 65, 70, 74, 78], status: "normal" },
      ],
      objectEvidence: [
        { objectName: "X3 智能产线", objectType: "project", status: "提前上线", owner: "张明", officeScope: "战略管理处" },
        { objectName: "海外品牌升级", objectType: "task", status: "进行中", owner: "李宁", officeScope: "战略管理处" },
      ],
      sourceMaterials: [
        { title: "Q1 战略执行月报", type: "经营分析报告", date: "2026-04-15", source: "战发系统", summary: "季度里程碑达成情况汇总" },
      ],
      aiReasoning: "本季战略推进整体超预期，主要受 X3 上线提前驱动，建议持续观察海外品牌升级节奏与协同事项推进。",
    }),
    year: build("strategy", "year", "normal", {
      sectors: ["全集团"],
      subjects: ["6 大战略主题"],
      summary: "6 大战略主题共 44 项任务，已完成 30 项",
      signalReasons: [{ rule: "战略任务完成率", threshold: "≥65%", actual: "68%" }],
      metricEvidence: [
        { metricName: "战略任务完成率", value: "68%", target: "65%", trend: [40, 50, 58, 65, 68], status: "normal" },
        { metricName: "重点事项按期完成率", value: "82%", target: "80%", status: "normal" },
      ],
      objectEvidence: [
        { objectName: "数智化转型阶段二", objectType: "project", status: "完成", officeScope: "战略管理处" },
      ],
      sourceMaterials: [
        { title: "2026 年度战略执行总结", type: "经营分析报告", date: "2026-04-30", source: "战发系统", summary: "全年战略任务推进汇总" },
      ],
      aiReasoning: "年度战略执行进度健康，需关注后 14 项任务排期与跨处室协同。",
    }),
    fiveYear: build("strategy", "fiveYear", "normal", {
      sectors: ["全集团"],
      subjects: ["数智化", "国际化"],
      summary: "里程碑 3/5，国际化进入第三阶段",
      signalReasons: [{ rule: "五年里程碑达成", threshold: "≥3", actual: "3" }],
      metricEvidence: [{ metricName: "五年里程碑", value: "3/5", status: "normal" }],
      objectEvidence: [{ objectName: "国际化阶段三", objectType: "project", status: "启动", officeScope: "战略管理处" }],
      sourceMaterials: [{ title: "2024-2028 五年规划中期评估", type: "规划文件", date: "2026-03-20", source: "战发系统", summary: "中期里程碑评估结果" }],
      aiReasoning: "五年规划进度领先，建议提前启动阶段四储备研究。",
    }),
    forecast: build("strategy", "forecast", "future", {
      sectors: ["海外", "新业务"],
      subjects: ["AI 推演 · 2027"],
      summary: "海外+新品组合预计将贡献集团增长 4.2pt",
      signalReasons: [{ rule: "AI 增长贡献预测", threshold: "≥3pt", actual: "+4.2pt" }],
      metricEvidence: [{ metricName: "增长贡献预测", value: "+4.2pt", status: "future" }],
      objectEvidence: [{ objectName: "海外+新品组合", objectType: "project", status: "推演中", officeScope: "战略管理处" }],
      sourceMaterials: [{ title: "AI 增长推演 · 2027", type: "AI 自动摘要", date: "2026-04-28", source: "AI 推演引擎", summary: "增长情景三套" }],
      aiReasoning: "若海外区域订单按预期落地，2027 集团增长贡献可上修；建议固化推演口径。",
    }),
  },
  finance: {
    quarter: build("finance", "quarter", "warning", {
      sectors: ["全集团", "物流"],
      subjects: ["招商轮船", "中国外运"],
      summary: "应收账款 +18.3%，现金流承压",
      signalReasons: [
        { rule: "应收账款增速", threshold: "≤10%", actual: "+18.3%", trendNote: "连续 2 期上行" },
        { rule: "经营现金流增速", threshold: "≥5%", actual: "+2.1%" },
      ],
      metricEvidence: [
        { metricName: "经营现金流增速", value: "+2.1%", target: "+5%", trend: [6.4, 5.8, 4.2, 3.0, 2.1], status: "warning" },
        { metricName: "应收账款增速", value: "+18.3%", target: "≤10%", trend: [8, 11, 14, 16, 18.3], status: "warning" },
        { metricName: "净利率", value: "10.4%", target: "10%", trend: [10.0, 10.1, 10.2, 10.3, 10.4], status: "normal" },
      ],
      objectEvidence: [
        { objectName: "招商轮船 散运业务线", objectType: "company", status: "回款放缓", officeScope: "业绩考核处", note: "回款 DSO 延长 6 天" },
        { objectName: "中国外运 跨境项目池", objectType: "project", status: "回款放缓", officeScope: "投资-资本处" },
      ],
      sourceMaterials: [
        { title: "Q1 现金流分析专报", type: "经营分析报告", date: "2026-04-22", source: "财务系统", summary: "三家公司现金流对比" },
        { title: "应收账款专项排查", type: "风险提示", date: "2026-04-25", source: "风控系统", summary: "Top 20 客户回款情况" },
      ],
      aiReasoning: "现金流承压主要由航运/物流回款放缓驱动，建议启动应收专项治理并联动业绩考核口径调整。",
    }),
    year: build("finance", "year", "normal", {
      sectors: ["全集团"],
      subjects: ["集团合并"],
      summary: "全年计划 ¥18.0 亿，累计 ¥12.8 亿，净利率 +0.6pt",
      signalReasons: [{ rule: "营收完成率", threshold: "≥70%", actual: "71%" }],
      metricEvidence: [
        { metricName: "营收完成率", value: "71%", target: "70%", trend: [25, 42, 58, 65, 71], status: "normal" },
        { metricName: "净利率", value: "10.4%", target: "10%", status: "normal" },
      ],
      objectEvidence: [{ objectName: "集团合并", objectType: "company", status: "节奏正常", officeScope: "业绩考核处" }],
      sourceMaterials: [{ title: "2026 年度预算执行月报", type: "预算文件", date: "2026-04-30", source: "财务系统", summary: "预算 vs 实际差异" }],
      aiReasoning: "年度收入完成率领先节奏，但需关注利润口径分化。",
    }),
    fiveYear: build("finance", "fiveYear", "warning", {
      sectors: ["全集团"],
      subjects: ["归母 ROE"],
      summary: "ROE 14.8%/18%，距五年目标仍差 3.2pt",
      signalReasons: [{ rule: "归母 ROE 距目标", threshold: "≥18%", actual: "14.8%" }],
      metricEvidence: [{ metricName: "归母 ROE", value: "14.8%", target: "18%", trend: [12, 13, 13.6, 14.2, 14.8], status: "warning" }],
      objectEvidence: [{ objectName: "集团合并", objectType: "company", status: "进度落后", officeScope: "业绩考核处" }],
      sourceMaterials: [{ title: "ROE 五年达标路径专报", type: "经营分析报告", date: "2026-03-30", source: "战发系统", summary: "ROE 提升路径分析" }],
      aiReasoning: "建议结合资本结构优化与高 ROE 业务结构倾斜，加速向 18% 目标收敛。",
    }),
    forecast: build("finance", "forecast", "critical", {
      sectors: ["航运", "新业务"],
      subjects: ["毛利率"],
      summary: "原材料成本上涨延续，毛利率或下探",
      signalReasons: [{ rule: "毛利率预测", threshold: "≥40%", actual: "38.6%" }],
      metricEvidence: [{ metricName: "毛利率预测", value: "38.6%", target: "40%", trend: [40.5, 40.2, 39.8, 39.2, 38.6], status: "critical" }],
      objectEvidence: [{ objectName: "新业务原料采购池", objectType: "project", status: "成本上行", officeScope: "投资-资本处" }],
      sourceMaterials: [{ title: "原材料价格监测周报", type: "风险提示", date: "2026-04-26", source: "风控系统", summary: "Top 5 原料价格走势" }],
      aiReasoning: "建议启动远期对冲与替代采购评估，避免毛利率持续下探。",
    }),
  },
  ops: {
    quarter: build("ops", "quarter", "critical", {
      sectors: ["华南区"],
      subjects: ["华南区域销售"],
      summary: "华南区环比 -12%，渠道结构调整待落地",
      signalReasons: [{ rule: "区域环比下滑", threshold: "≤-5%", actual: "-12%", trendNote: "连续 2 期下滑" }],
      metricEvidence: [
        { metricName: "华南区收入环比", value: "-12%", trend: [3, 0, -5, -10, -12], status: "critical" },
        { metricName: "渠道动销率", value: "63%", target: "75%", status: "warning" },
      ],
      objectEvidence: [
        { objectName: "华南区一级经销网络", objectType: "task", status: "调整中", officeScope: "战略管理处", note: "新分销策略待审批" },
      ],
      sourceMaterials: [
        { title: "华南区销售周报", type: "经营分析报告", date: "2026-04-28", source: "销售系统", summary: "区域销售情况" },
      ],
      aiReasoning: "渠道结构调整若 6 月落地，预计 Q3 可恢复至同比正向；建议优先推进。",
    }),
    year: build("ops", "year", "normal", {
      sectors: ["全集团"],
      subjects: ["运营效率"],
      summary: "OEE 87.4%，同比 +3.2pt",
      signalReasons: [{ rule: "OEE 年度", threshold: "≥85%", actual: "87.4%" }],
      metricEvidence: [{ metricName: "OEE", value: "87.4%", target: "85%", trend: [82, 84, 85, 86, 87.4], status: "normal" }],
      objectEvidence: [{ objectName: "智能产线集群", objectType: "platform", status: "稳定运行", officeScope: "科技创新处" }],
      sourceMaterials: [{ title: "运营效率年度回顾", type: "经营分析报告", date: "2026-04-15", source: "运营系统", summary: "全年 OEE 表现" }],
      aiReasoning: "运营效率稳健提升，建议沉淀最佳实践向轮船/外运推广。",
    }),
    fiveYear: build("ops", "fiveYear", "normal", {
      sectors: ["全集团"],
      subjects: ["数字化"],
      summary: "数字化覆盖 78%，对标 2028 全面数字化目标进度领先",
      signalReasons: [{ rule: "数字化覆盖率", threshold: "≥70%", actual: "78%" }],
      metricEvidence: [{ metricName: "数字化覆盖率", value: "78%", target: "100%", status: "normal" }],
      objectEvidence: [{ objectName: "智慧物流平台 2.0", objectType: "platform", status: "试运行", officeScope: "科技创新处" }],
      sourceMaterials: [{ title: "数字化建设五年评估", type: "规划文件", date: "2026-03-10", source: "科创系统", summary: "覆盖率与平台建设" }],
      aiReasoning: "进度领先，建议提前启动 100% 覆盖目标的最后 22% 难点攻关。",
    }),
    forecast: build("ops", "forecast", "future", {
      sectors: ["供应链"],
      subjects: ["东南亚二级供应商池"],
      summary: "AI 建议：东南亚二级供应商池可降本 6-8%",
      signalReasons: [{ rule: "AI 降本建议", threshold: "≥5%", actual: "6-8%" }],
      metricEvidence: [{ metricName: "潜在降本幅度", value: "6-8%", status: "future" }],
      objectEvidence: [{ objectName: "东南亚供应商池", objectType: "project", status: "评估中", officeScope: "投资-资本处" }],
      sourceMaterials: [{ title: "供应链重构推演报告", type: "AI 自动摘要", date: "2026-04-20", source: "AI 推演引擎", summary: "三套供应链重构方案" }],
      aiReasoning: "若 H2 启动试点，2027 可锁定年度降本 ¥0.8-1.1 亿。",
    }),
  },
  legal: {
    quarter: build("legal", "quarter", "warning", {
      sectors: ["全集团"],
      subjects: ["3 起诉讼"],
      summary: "诉讼 3 起，其中 1 起涉及金额 ¥2,800 万",
      signalReasons: [{ rule: "重大诉讼数", threshold: "≤2", actual: "3" }],
      metricEvidence: [{ metricName: "在诉案件数", value: "3", target: "≤2", status: "warning" }],
      objectEvidence: [{ objectName: "供应商合同纠纷案", objectType: "task", status: "已计提", officeScope: "战略管理处", note: "金额 ¥2,800 万" }],
      sourceMaterials: [{ title: "Q1 法务工作汇报", type: "合规通报", date: "2026-04-20", source: "法务系统", summary: "在诉案件清单" }],
      aiReasoning: "建议加强供应商合同前置审查与合规复核机制。",
    }),
    year: build("legal", "year", "normal", {
      sectors: ["全集团"],
      subjects: ["合规审计"],
      summary: "0 重大风险，新增专利 2 项",
      signalReasons: [{ rule: "重大风险数", threshold: "0", actual: "0" }],
      metricEvidence: [{ metricName: "重大风险数", value: "0", status: "normal" }],
      objectEvidence: [{ objectName: "年度合规审计", objectType: "task", status: "通过", officeScope: "战略管理处" }],
      sourceMaterials: [{ title: "2026 合规审计报告", type: "合规通报", date: "2026-04-15", source: "法务系统", summary: "审计结论" }],
      aiReasoning: "合规态势稳健，可沉淀今年合规模板向二级公司推广。",
    }),
    fiveYear: build("legal", "fiveYear", "normal", {
      sectors: ["全集团"],
      subjects: ["知识产权"],
      summary: "知识产权 +42 项，对标 60 项目标，进度 70%",
      signalReasons: [{ rule: "IP 进度", threshold: "≥60%", actual: "70%" }],
      metricEvidence: [{ metricName: "知识产权数", value: "42/60", target: "60", status: "normal" }],
      objectEvidence: [{ objectName: "核心 IP 储备库", objectType: "platform", status: "稳步增长", officeScope: "科技创新处" }],
      sourceMaterials: [{ title: "知识产权五年规划评估", type: "规划文件", date: "2026-03-25", source: "法务系统", summary: "进度评估" }],
      aiReasoning: "进度领先，建议提高高价值发明专利占比。",
    }),
    forecast: build("legal", "forecast", "critical", {
      sectors: ["海外"],
      subjects: ["欧盟新数据法规"],
      summary: "欧盟新数据法规 7 月生效，需提前布局",
      signalReasons: [{ rule: "新规合规风险", threshold: "高", actual: "高" }],
      metricEvidence: [{ metricName: "新规风险等级", value: "高", status: "critical" }],
      objectEvidence: [{ objectName: "欧盟业务合规改造", objectType: "project", status: "未启动", officeScope: "战略管理处" }],
      sourceMaterials: [{ title: "欧盟数据法规解读", type: "合规通报", date: "2026-04-12", source: "法务系统", summary: "影响范围与时间线" }],
      aiReasoning: "建议 5 月内组建跨部门工作组，分阶段完成数据治理改造。",
    }),
  },
};
