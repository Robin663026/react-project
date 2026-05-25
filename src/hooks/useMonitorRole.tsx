import { createContext, useContext, useState, type ReactNode } from "react";

export type CompanyKey = "port" | "shipping" | "logistics";

export const companyLabel: Record<CompanyKey, string> = {
  port: "招商港口",
  shipping: "招商轮船",
  logistics: "中国外运",
};

export type OfficeKey = "investment" | "performance" | "strategy" | "innovation";

export const officeLabel: Record<OfficeKey, string> = {
  investment: "投资-资本处",
  performance: "业绩考核处",
  strategy: "战略管理处",
  innovation: "科技创新处",
};

export const officeTitle: Record<OfficeKey, { title: string; subtitle: string }> = {
  investment: { title: "投资专题监控", subtitle: "按板块查看投资执行、回报与项目风险" },
  performance: { title: "考核专题监控", subtitle: "按板块查看目标制定、清算推进与结果确认" },
  strategy: { title: "战略专题监控", subtitle: "按板块查看战略任务推进、重点事项与协同卡点" },
  innovation: { title: "科创专题监控", subtitle: "按板块查看投入、项目、平台与成果产出" },
};

export type MonitorRole =
  | { kind: "leader"; name: string }
  | { kind: "office"; office: OfficeKey; name: string }
  | { kind: "subsidiary"; company: CompanyKey; name: string };

type Option = { value: string; label: string; group: string; role: MonitorRole };

export const monitorRoleOptions: Option[] = [
  { value: "leader", label: "集团战发领导", group: "集团领导", role: { kind: "leader", name: "集团战发领导" } },
  { value: "office_investment", label: "投资-资本处专员", group: "四处室专员", role: { kind: "office", office: "investment", name: "投资-资本处专员" } },
  { value: "office_performance", label: "业绩考核处专员", group: "四处室专员", role: { kind: "office", office: "performance", name: "业绩考核处专员" } },
  { value: "office_strategy", label: "战略管理处专员", group: "四处室专员", role: { kind: "office", office: "strategy", name: "战略管理处专员" } },
  { value: "office_innovation", label: "科技创新处专员", group: "四处室专员", role: { kind: "office", office: "innovation", name: "科技创新处专员" } },
  { value: "sub_port", label: "招商港口 · 战发部", group: "二级公司", role: { kind: "subsidiary", company: "port", name: "招商港口 · 战发部" } },
  { value: "sub_shipping", label: "招商轮船 · 战发部", group: "二级公司", role: { kind: "subsidiary", company: "shipping", name: "招商轮船 · 战发部" } },
  { value: "sub_logistics", label: "中国外运 · 战发部", group: "二级公司", role: { kind: "subsidiary", company: "logistics", name: "中国外运 · 战发部" } },
];

type Ctx = {
  role: MonitorRole;
  roleKey: string;
  setRoleKey: (k: string) => void;
};

const MonitorRoleContext = createContext<Ctx | null>(null);

export function MonitorRoleProvider({ children }: { children: ReactNode }) {
  const [roleKey, setRoleKey] = useState("leader");
  const role = (monitorRoleOptions.find((o) => o.value === roleKey) ?? monitorRoleOptions[0]).role;
  return (
    <MonitorRoleContext.Provider value={{ role, roleKey, setRoleKey }}>
      {children}
    </MonitorRoleContext.Provider>
  );
}

export function useMonitorRole() {
  const ctx = useContext(MonitorRoleContext);
  if (!ctx) throw new Error("useMonitorRole must be used within MonitorRoleProvider");
  return ctx;
}
