import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type DraftItem = {
  id: string;
  type: "policy" | "peer" | "track" | "metric" | "ai-summary";
  title: string;
  source?: string;
  addedAt: number;
};

type Ctx = {
  items: DraftItem[];
  add: (item: Omit<DraftItem, "addedAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const ReportDraftCtx = createContext<Ctx | null>(null);
const KEY = "benchmark.report.draft.v1";

export function ReportDraftProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<DraftItem[]>([]);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);
  const add = useCallback((item: Omit<DraftItem, "addedAt">) => {
    setItems((prev) =>
      prev.find((p) => p.id === item.id) ? prev : [...prev, { ...item, addedAt: Date.now() }],
    );
  }, []);
  const remove = useCallback((id: string) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, add, remove, clear }), [items, add, remove, clear]);
  return <ReportDraftCtx.Provider value={value}>{children}</ReportDraftCtx.Provider>;
}

export function useReportDraft() {
  const ctx = useContext(ReportDraftCtx);
  if (!ctx) throw new Error("useReportDraft must be used within ReportDraftProvider");
  return ctx;
}
