import { useCallback, useEffect, useState } from "react";
import type { Dimension } from "@/lib/benchmark/metrics";

export type ChartType = "bar" | "heatmap" | "table" | "spark";

export type SelectedMetric = {
  key: string;
  chart: ChartType;
};

export type ViewState = {
  metrics: SelectedMetric[];
  peerIds: string[];
  dim: Dimension;
};

export type SavedView = ViewState & { id: string; name: string; savedAt: number };

const STORAGE_KEY = "benchmark-workbench-v1";
const SAVED_KEY = "benchmark-workbench-saved-v1";

const defaultState: ViewState = {
  metrics: [
    { key: "revenue", chart: "bar" },
    { key: "grossMargin", chart: "heatmap" },
    { key: "roe", chart: "table" },
  ],
  peerIds: ["self", "peer-a", "peer-b", "peer-c", "peer-d"],
  dim: "company",
};

function loadInitial(): ViewState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as ViewState;
    if (!parsed.metrics) return defaultState;
    return parsed;
  } catch {
    return defaultState;
  }
}

function loadSaved(): SavedView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as SavedView[]) : [];
  } catch {
    return [];
  }
}

export function useWorkbenchState() {
  const [state, setState] = useState<ViewState>(defaultState);
  const [saved, setSaved] = useState<SavedView[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadInitial());
    setSaved(loadSaved());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved, hydrated]);

  const addMetric = useCallback((key: string, chart: ChartType = "bar") => {
    setState((s) =>
      s.metrics.some((m) => m.key === key)
        ? s
        : { ...s, metrics: [...s.metrics, { key, chart }] },
    );
  }, []);

  const removeMetric = useCallback((key: string) => {
    setState((s) => ({ ...s, metrics: s.metrics.filter((m) => m.key !== key) }));
  }, []);

  const reorderMetrics = useCallback((from: number, to: number) => {
    setState((s) => {
      const next = [...s.metrics];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...s, metrics: next };
    });
  }, []);

  const setChart = useCallback((key: string, chart: ChartType) => {
    setState((s) => ({
      ...s,
      metrics: s.metrics.map((m) => (m.key === key ? { ...m, chart } : m)),
    }));
  }, []);

  const togglePeer = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      peerIds: s.peerIds.includes(id)
        ? s.peerIds.filter((x) => x !== id)
        : [...s.peerIds, id],
    }));
  }, []);

  const setDim = useCallback((dim: Dimension) => {
    setState((s) => ({ ...s, dim }));
  }, []);

  const loadPreset = useCallback((keys: string[]) => {
    setState((s) => ({
      ...s,
      metrics: keys.map((k) => ({ key: k, chart: "bar" as ChartType })),
    }));
  }, []);

  const clear = useCallback(() => setState((s) => ({ ...s, metrics: [] })), []);

  const saveView = useCallback(
    (name: string) => {
      const view: SavedView = {
        ...state,
        id: `view-${Date.now()}`,
        name,
        savedAt: Date.now(),
      };
      setSaved((prev) => [view, ...prev].slice(0, 12));
    },
    [state],
  );

  const applySavedView = useCallback((id: string) => {
    setSaved((prev) => {
      const v = prev.find((x) => x.id === id);
      if (v) setState({ metrics: v.metrics, peerIds: v.peerIds, dim: v.dim });
      return prev;
    });
  }, []);

  const removeSavedView = useCallback((id: string) => {
    setSaved((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return {
    state,
    saved,
    addMetric,
    removeMetric,
    reorderMetrics,
    setChart,
    togglePeer,
    setDim,
    loadPreset,
    clear,
    saveView,
    applySavedView,
    removeSavedView,
  };
}
