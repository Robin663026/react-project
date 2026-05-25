import { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Save, FolderOpen, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { MetricLibrary } from "./MetricLibrary";
import { MetricCanvas } from "./MetricCanvas";
import { PeerSelector } from "./PeerSelector";
import { useWorkbenchState } from "./useWorkbenchState";
import { AiSummaryCard } from "../AiSummaryCard";
import { peers } from "@/lib/benchmark/peers";
import { allMetricsFlat } from "@/lib/benchmark/metrics";

export function MetricWorkbench() {
  const wb = useWorkbenchState();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [viewName, setViewName] = useState("");

  const peerLabels = useMemo(
    () =>
      wb.state.peerIds
        .map((id) => peers.find((p) => p.id === id)?.name)
        .filter((x): x is string => Boolean(x)),
    [wb.state.peerIds],
  );

  const aiSummary = useMemo(() => {
    if (wb.state.metrics.length === 0) return "请先加入指标，AI 将基于已选指标自动生成对比洞察。";
    const labels = wb.state.metrics
      .map((m) => allMetricsFlat.find((x) => x.key === m.key)?.label)
      .filter(Boolean)
      .slice(0, 4)
      .join("、");
    return `当前对比维度为「${wb.state.dim === "company" ? "公司" : wb.state.dim}」，覆盖 ${peerLabels.length || "全部"} 个对象与 ${wb.state.metrics.length} 个指标（${labels} 等）。综合来看，本企业在效率指标上处于中位，盈利与研发投入低于行业龙头约 3-5 个百分点，建议优先关注存货周转与研发费用率两条改善路径。`;
  }, [wb.state, peerLabels]);

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const data = active.data.current as { type?: string; metricKey?: string } | undefined;

    // From library: drop to canvas → add
    if (data?.type === "library" && data.metricKey) {
      if (over.id === "canvas" || wb.state.metrics.some((m) => m.key === over.id)) {
        wb.addMetric(data.metricKey);
      }
      return;
    }

    // From canvas: drop to trash → remove
    if (over.id === "trash") {
      wb.removeMetric(active.id as string);
      return;
    }

    // Reorder within canvas
    if (active.id !== over.id) {
      const from = wb.state.metrics.findIndex((m) => m.key === active.id);
      const to = wb.state.metrics.findIndex((m) => m.key === over.id);
      if (from >= 0 && to >= 0) {
        const next = arrayMove(wb.state.metrics, from, to);
        // apply by reorderMetrics one step
        wb.reorderMetrics(from, to);
        void next;
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-2 backdrop-blur">
          <div className="text-xs text-muted-foreground">
            可拖拽指标对比工作台 · 支持自由组合上市公司公开财报指标
          </div>
          <div className="flex items-center gap-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                  <FolderOpen className="h-3.5 w-3.5" />
                  我的视图
                  {wb.saved.length > 0 && (
                    <span className="rounded-full bg-primary/15 px-1.5 text-[10px] text-primary">
                      {wb.saved.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                {wb.saved.length === 0 ? (
                  <div className="text-xs text-muted-foreground">暂无保存的视图。</div>
                ) : (
                  <div className="space-y-1">
                    {wb.saved.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between rounded-md border border-border/60 px-2 py-1.5"
                      >
                        <button
                          onClick={() => {
                            wb.applySavedView(v.id);
                            toast.success(`已加载视图：${v.name}`);
                          }}
                          className="flex-1 text-left"
                        >
                          <div className="text-xs font-medium">{v.name}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {v.metrics.length} 指标 · {new Date(v.savedAt).toLocaleDateString()}
                          </div>
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => wb.removeSavedView(v.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                  <Save className="h-3.5 w-3.5" />
                  保存视图
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64">
                <div className="space-y-2">
                  <div className="text-xs font-medium">命名当前视图</div>
                  <Input
                    value={viewName}
                    onChange={(e) => setViewName(e.target.value)}
                    placeholder="例：vs 行业龙头"
                    className="h-8 text-xs"
                  />
                  <Button
                    size="sm"
                    className="h-7 w-full gradient-primary text-xs text-primary-foreground"
                    disabled={!viewName.trim() || wb.state.metrics.length === 0}
                    onClick={() => {
                      wb.saveView(viewName.trim());
                      setViewName("");
                      toast.success("已保存视图");
                    }}
                  >
                    保存
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => toast.info("已导出 CSV", { description: "工作台数据已生成下载链接" })}
            >
              <Download className="h-3.5 w-3.5" />
              导出
            </Button>
          </div>
        </div>

        {/* Three columns */}
        <div className="grid gap-4 lg:grid-cols-[260px_1fr_260px]">
          <MetricLibrary
            selectedKeys={wb.state.metrics.map((m) => m.key)}
            onAdd={wb.addMetric}
            onLoadPreset={wb.loadPreset}
          />

          <MetricCanvas
            metrics={wb.state.metrics}
            dim={wb.state.dim}
            peerLabels={wb.state.dim === "company" ? peerLabels : null}
            onRemove={wb.removeMetric}
            onChartChange={wb.setChart}
            onLoadPreset={wb.loadPreset}
            onClear={wb.clear}
          />

          <PeerSelector
            peerIds={wb.state.peerIds}
            dim={wb.state.dim}
            onTogglePeer={wb.togglePeer}
            onChangeDim={wb.setDim}
          />
        </div>

        {/* AI summary */}
        <AiSummaryCard
          id={`workbench-${wb.state.metrics.map((m) => m.key).join("-")}`}
          title="AI 工作台综合洞察"
          evidence={{
            title: "工作台综合洞察",
            links: [{ name: "Wind / 巨潮资讯", url: "#" }],
            fetchedAt: "2026-04-30 22:00",
            parsedAt: "2026-04-30 22:01",
            schema: "按当前选定指标与对比对象进行同口径横向对比",
            relatedMetrics: wb.state.metrics.map((m) => m.key),
            confidence: 0.81,
          }}
        >
          {aiSummary}
        </AiSummaryCard>
      </div>
    </DndContext>
  );
}
