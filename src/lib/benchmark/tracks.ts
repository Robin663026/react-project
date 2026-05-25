export type TrackData = {
  id: string;
  name: string;
  stage: string;
  score: number;
  cagr: string;
  marketSize: string;
  fit: "高" | "中" | "低";
  fitScore: number;
  risk: "低" | "中" | "高";
  barrier: "低" | "中" | "高";
  summary: string;
  definition: string;
  policy: string;
  players: string[];
  model: string;
  relation: string;
  riskNote: string;
  entry: string;
  competitors: string[];
  sources: { name: string; url: string }[];
};

export const tracks: TrackData[] = [
  {
    id: "ai-agent",
    name: "AI Agent 工业自动化",
    stage: "早期 · 高增长",
    score: 92,
    cagr: "+38%",
    marketSize: "全球 ¥820 亿 / 2027E",
    fit: "高",
    fitScore: 88,
    risk: "中",
    barrier: "中",
    summary: "面向制造业的 AI Agent 已在 PCB、汽车零部件试点，自动化率提升 40%+。",
    definition: "在工业现场以 LLM + 工具链组合形成可执行的智能体，覆盖排产、质检、能耗优化等场景。",
    policy: "工信部《工业 AI Agent 应用指南》明确补贴与示范项目入选标准。",
    players: ["西门子 Industrial Copilot", "Cognex VisionPro AI", "国内头部集成商"],
    model: "软件订阅 + 项目集成 + 产线运营分成。",
    relation: "公司既有自动化产线 + 设备数据资产，与 AI Agent 落地场景天然契合。",
    riskNote: "模型准确性与现场可解释性仍存挑战；定制化程度高带来交付成本上升。",
    entry: "选择 1-2 条自有产线作为 POC，6 个月内验证 ROI 后规模化。",
    competitors: ["西门子", "Cognex", "国内 AI 平台厂商"],
    sources: [
      { name: "Gartner 2026 Hype Cycle", url: "#" },
      { name: "麦肯锡报告", url: "#" },
    ],
  },
  {
    id: "energy-storage",
    name: "储能集成与虚拟电厂",
    stage: "成长期",
    score: 81,
    cagr: "+24%",
    marketSize: "国内 ¥4,200 亿 / 2028E",
    fit: "中",
    fitScore: 65,
    risk: "中",
    barrier: "中",
    summary: "政策＋电价双驱动，工商业储能投资回报周期已缩短至 4-5 年。",
    definition: "面向工商业用户的储能系统集成，结合虚拟电厂参与电力市场调峰与需求响应。",
    policy: "国家能源局多项虚拟电厂试点文件，省级峰谷价差扩大。",
    players: ["宁德时代 EnerC", "阳光电源 PowerStack", "海博思创"],
    model: "EPC 一体化 + 售电分成 + 调度服务费。",
    relation: "公司在制造基地有用电与场地资源，可作为首批接入主体。",
    riskNote: "电价政策变动、电芯安全、并网审批周期较长。",
    entry: "先以自有园区为试点，再向同行业输出标准化解决方案。",
    competitors: ["宁德时代", "阳光电源", "海博思创"],
    sources: [
      { name: "CNESA 白皮书", url: "#" },
      { name: "国家能源局公告", url: "#" },
    ],
  },
  {
    id: "evtol",
    name: "低空经济 / eVTOL",
    stage: "概念验证",
    score: 68,
    cagr: "+45%",
    marketSize: "国内 ¥1,500 亿 / 2030E",
    fit: "低",
    fitScore: 32,
    risk: "高",
    barrier: "高",
    summary: "民航局首批适航证落地，物流＋低空旅游场景率先突破。",
    definition: "电动垂直起降飞行器，覆盖城市空中交通、物流、应急救援等场景。",
    policy: "民航局已发放首批 eVTOL 适航证，地方政府积极建设起降场。",
    players: ["亿航智能", "峰飞航空", "时的科技"],
    model: "整机销售 + 运营服务 + 基础设施建设。",
    relation: "公司无航空业务背景，进入需通过投资或合资。",
    riskNote: "适航周期长、基础设施未成熟、商业模式仍在摸索。",
    entry: "以战略投资形式参与头部企业，跟踪适航与场景落地。",
    competitors: ["亿航智能", "峰飞航空"],
    sources: [{ name: "民航局公告", url: "#" }],
  },
];
