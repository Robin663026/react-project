import type { OfficeKey } from "@/hooks/useMonitorRole";

export type SectorKey = "all" | "port" | "shipping" | "logistics" | "new";
export const sectorOptions: { key: SectorKey; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "port", label: "港口" },
  { key: "shipping", label: "航运" },
  { key: "logistics", label: "物流" },
  { key: "new", label: "新业务" },
];

export type OfficeMetric = {
  key: string;
  label: string;
  value: string;
  target: string;
  complete: number; // 0-100
  yoy: number;
  status: "normal" | "warning" | "critical";
  unit?: string;
};

export type ExceptionObject = {
  name: string;
  type: string;
  status: "normal" | "warning" | "critical";
  owner: string;
  due?: string;
  note?: string;
};

export type OfficeAction = {
  title: string;
  due: string;
  owner: string;
  priority: "high" | "mid" | "low";
};

export type OfficeWorkbenchData = {
  metrics: OfficeMetric[];
  exceptions: ExceptionObject[];
  trend: { label: string; data: number[]; legend: string };
  detail: { columns: string[]; rows: (string | number)[][] };
  actions: OfficeAction[];
};

export const officeData: Record<OfficeKey, OfficeWorkbenchData> = {
  investment: {
    metrics: [
      { key: "annual", label: "年度投资计划完成率", value: "62%", target: "70%", complete: 62, yoy: 4.2, status: "warning" },
      { key: "fa", label: "固定资产投资执行率", value: "58%", target: "65%", complete: 58, yoy: -1.8, status: "warning" },
      { key: "eq", label: "股权投资执行率", value: "74%", target: "70%", complete: 74, yoy: 6.4, status: "normal" },
      { key: "irr", label: "IRR 达标率", value: "78%", target: "80%", complete: 78, yoy: 2.1, status: "warning" },
      { key: "delay", label: "重大项目超期数", value: "5", target: "≤3", complete: 40, yoy: 25, status: "critical" },
      { key: "review", label: "投后评价完成率", value: "84%", target: "80%", complete: 84, yoy: 3.6, status: "normal" },
    ],
    exceptions: [
      { name: "华南智能制造基地二期", type: "超期项目", status: "critical", owner: "投资二部 / 王勇", due: "2026-03-31", note: "实际进度落后 12%" },
      { name: "东南亚物流并购", type: "低 IRR 项目", status: "warning", owner: "投资一部 / 李丹", note: "IRR 7.2%，低于阈值 9%" },
      { name: "新能源平台二期增资", type: "超计划项目", status: "warning", owner: "资本运营部 / 张磊", note: "超计划 ¥0.8 亿" },
      { name: "海外港口运营公司", type: "未备案项目", status: "warning", owner: "投资一部 / 赵琳", note: "备案补录中" },
    ],
    trend: { label: "近 5 期投资计划完成率", data: [48, 52, 55, 58, 62], legend: "完成率 %" },
    detail: {
      columns: ["项目", "板块", "计划投资", "实际投资", "完成率", "状态"],
      rows: [
        ["华南智能制造基地二期", "新业务", "¥4.2 亿", "¥2.4 亿", "57%", "超期"],
        ["东南亚物流并购", "物流", "¥6.8 亿", "¥6.2 亿", "91%", "低 IRR"],
        ["新能源平台二期增资", "新业务", "¥3.0 亿", "¥3.8 亿", "127%", "超计划"],
        ["海外港口运营公司", "港口", "¥2.6 亿", "¥1.9 亿", "73%", "未备案"],
      ],
    },
    actions: [
      { title: "华南基地二期复盘会议", due: "2026-05-08", owner: "投资二部", priority: "high" },
      { title: "东南亚物流 IRR 重测", due: "2026-05-15", owner: "投资一部", priority: "mid" },
      { title: "投后评价模板 v2 评审", due: "2026-05-20", owner: "投资-资本处", priority: "mid" },
    ],
  },
  performance: {
    metrics: [
      { key: "kpi", label: "目标表制定完成率", value: "92%", target: "100%", complete: 92, yoy: 6.2, status: "warning" },
      { key: "base", label: "基准值审批完成率", value: "88%", target: "95%", complete: 88, yoy: 3.4, status: "warning" },
      { key: "doc", label: "合同归档完成率", value: "96%", target: "100%", complete: 96, yoy: 1.2, status: "normal" },
      { key: "qual", label: "定性清算完成率", value: "70%", target: "80%", complete: 70, yoy: -2.5, status: "warning" },
      { key: "quan", label: "定量清算完成率", value: "65%", target: "85%", complete: 65, yoy: -4.0, status: "critical" },
      { key: "final", label: "最终结果确认率", value: "58%", target: "75%", complete: 58, yoy: -3.2, status: "critical" },
    ],
    exceptions: [
      { name: "招商轮船 散运业务部", type: "逾期未提交目标表", status: "critical", owner: "考核处 / 周敏", due: "2026-04-30" },
      { name: "中国外运 跨境事业部", type: "清算未完成", status: "warning", owner: "考核处 / 张涛" },
      { name: "招商港口 海外子公司", type: "结果待确认", status: "warning", owner: "考核处 / 周敏" },
      { name: "新业务 X 公司", type: "评分未完成", status: "critical", owner: "考核处 / 林芳" },
    ],
    trend: { label: "近 5 期清算完成率", data: [80, 76, 72, 68, 65], legend: "清算 %" },
    detail: {
      columns: ["对象", "板块", "目标表", "清算", "结果确认"],
      rows: [
        ["招商港口", "港口", "已提交", "进行中 92%", "待确认"],
        ["招商轮船 · 散运", "航运", "未提交", "未启动", "—"],
        ["中国外运 · 跨境", "物流", "已提交", "进行中 70%", "—"],
        ["新业务 X", "新业务", "已提交", "已完成", "评分中"],
      ],
    },
    actions: [
      { title: "散运业务部目标表催办", due: "2026-05-05", owner: "业绩考核处", priority: "high" },
      { title: "跨境事业部清算专项会", due: "2026-05-12", owner: "业绩考核处", priority: "high" },
      { title: "结果确认流程线上化评审", due: "2026-05-18", owner: "业绩考核处", priority: "mid" },
    ],
  },
  strategy: {
    metrics: [
      { key: "task", label: "战略任务完成率", value: "68%", target: "75%", complete: 68, yoy: 5.4, status: "warning" },
      { key: "key", label: "重点事项按期完成率", value: "82%", target: "85%", complete: 82, yoy: 2.6, status: "warning" },
      { key: "delay", label: "战略任务延期数", value: "7", target: "≤5", complete: 60, yoy: 16.7, status: "warning" },
      { key: "coop", label: "战略合作推进数", value: "8", target: "10", complete: 80, yoy: 14.3, status: "normal" },
      { key: "reform", label: "改革事项完成率", value: "73%", target: "75%", complete: 73, yoy: 4.1, status: "warning" },
      { key: "list", label: "上市公司质量提升完成率", value: "66%", target: "80%", complete: 66, yoy: -1.8, status: "critical" },
    ],
    exceptions: [
      { name: "数智化转型阶段二 · 物流分支", type: "延期战略任务", status: "warning", owner: "战略处 / 陈宇", due: "2026-04-30" },
      { name: "海外品牌升级 · 二阶段评审", type: "重点事项卡点", status: "warning", owner: "战略处 / 顾倩" },
      { name: "招商港口 · 协同改革事项", type: "协同事项未推进", status: "critical", owner: "战略处 / 顾倩" },
      { name: "中国外运 · 上市公司质量提升", type: "改革任务滞后", status: "critical", owner: "战略处 / 陈宇" },
    ],
    trend: { label: "近 5 期战略任务完成率", data: [55, 58, 62, 65, 68], legend: "完成率 %" },
    detail: {
      columns: ["任务", "归属主题", "责任处室", "进度", "状态"],
      rows: [
        ["数智化转型阶段二", "数智化", "战略管理处", "82%", "延期"],
        ["海外品牌升级 二阶段", "国际化", "战略管理处", "55%", "卡点"],
        ["招商港口协同改革", "改革发展", "战略管理处", "40%", "未推进"],
        ["中国外运上市公司质量提升", "上市质量", "战略管理处", "66%", "滞后"],
      ],
    },
    actions: [
      { title: "数智化转型阶段二攻坚会", due: "2026-05-09", owner: "战略管理处", priority: "high" },
      { title: "海外品牌二阶段评审", due: "2026-05-14", owner: "战略管理处", priority: "high" },
      { title: "上市公司质量提升专项推进", due: "2026-05-22", owner: "战略管理处", priority: "mid" },
    ],
  },
  innovation: {
    metrics: [
      { key: "rdAmt", label: "研发投入金额", value: "¥0.72 亿", target: "¥0.80 亿", complete: 90, yoy: 18.4, status: "normal" },
      { key: "rdRate", label: "研发投入强度", value: "3.6%", target: "4.0%", complete: 90, yoy: 0.4, status: "warning" },
      { key: "prj", label: "科技项目按期完成率", value: "76%", target: "85%", complete: 76, yoy: -2.5, status: "warning" },
      { key: "platCount", label: "平台数量", value: "12", target: "15", complete: 80, yoy: 9.1, status: "normal" },
      { key: "platLevel", label: "国家级 / 省部级平台数", value: "5", target: "6", complete: 83, yoy: 25.0, status: "normal" },
      { key: "result", label: "成果产出数", value: "18", target: "20", complete: 90, yoy: 12.5, status: "normal" },
    ],
    exceptions: [
      { name: "智慧物流平台 2.0 · AI 模块", type: "项目延期", status: "warning", owner: "科创处 / 杨光", due: "2026-05-15" },
      { name: "招商轮船 · 智能调度项目", type: "研发投入偏低", status: "warning", owner: "科创处 / 顾远" },
      { name: "新能源研发平台二期", type: "平台建设滞后", status: "warning", owner: "科创处 / 杨光" },
      { name: "中国外运 · 知识产权转化", type: "成果转化偏弱", status: "critical", owner: "科创处 / 顾远" },
    ],
    trend: { label: "近 5 期研发投入强度 %", data: [3.0, 3.1, 3.3, 3.4, 3.6], legend: "强度 %" },
    detail: {
      columns: ["项目 / 平台", "类型", "板块", "进度", "状态"],
      rows: [
        ["智慧物流平台 2.0", "项目", "物流", "78%", "延期"],
        ["智能调度项目", "项目", "航运", "62%", "投入低"],
        ["新能源研发平台二期", "平台", "新业务", "55%", "滞后"],
        ["IP 转化加速器", "项目", "物流", "48%", "偏弱"],
      ],
    },
    actions: [
      { title: "AI 模块攻坚周会", due: "2026-05-10", owner: "科技创新处", priority: "high" },
      { title: "智能调度研发预算复核", due: "2026-05-16", owner: "科技创新处", priority: "mid" },
      { title: "新能源平台二期里程碑评审", due: "2026-05-25", owner: "科技创新处", priority: "mid" },
    ],
  },
};

// 战略管理处轻量北极星
export const northStarLite = [
  { name: "战略任务完成率", value: "68%", delta: "+5.4pt" },
  { name: "重点事项按期", value: "82%", delta: "+2.6pt" },
  { name: "改革事项完成率", value: "73%", delta: "+4.1pt" },
  { name: "上市公司质量", value: "66%", delta: "-1.8pt" },
];
