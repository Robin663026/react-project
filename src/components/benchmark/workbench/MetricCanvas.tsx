import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Trash2 } from "lucide-react";
import { MetricCard } from "./MetricCard";
import type { ChartType, SelectedMetric } from "./useWorkbenchState";
import type { Dimension } from "@/lib/benchmark/metrics";
import { presets } from "./presets";

type Props = {
  metrics: SelectedMetric[];
  dim: Dimension;
  peerLabels: string[] | null;
  onRemove: (key: string) => void;
  onChartChange: (key: string, chart: ChartType) => void;
  onLoadPreset: (keys: string[]) => void;
  onClear: () => void;
};

export function MetricCanvas({
  metrics,
  dim,
  peerLabels,
  onRemove,
  onChartChange,
  onLoadPreset,
  onClear,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const trashDroppable = useDroppable({ id: "trash" });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          已选 <span className="font-semibold text-foreground">{metrics.length}</span> 个指标 · 拖动调整顺序
        </div>
        <div
          ref={trashDroppable.setNodeRef}
          className={`flex items-center gap-1.5 rounded-md border border-dashed px-2 py-1 text-xs transition ${
            trashDroppable.isOver
              ? "border-destructive bg-destructive/10 text-destructive"
              : "border-border/60 text-muted-foreground"
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          拖到此处移除
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[480px] space-y-3 rounded-2xl border-2 border-dashed p-3 transition ${
          isOver
            ? "border-primary bg-primary/[0.06]"
            : metrics.length === 0
              ? "border-border/60 bg-muted/10"
              : "border-transparent"
        }`}
      >
        {metrics.length === 0 ? (
          <div className="flex h-[420px] flex-col items-center justify-center gap-3 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <LayoutGrid className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">空白对比工作台</div>
              <div className="mt-1 text-xs text-muted-foreground">
                从左侧拖入指标，或直接载入预设模板
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {presets.slice(0, 4).map((p) => (
                <Button
                  key={p.key}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onLoadPreset(p.metrics)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <SortableContext
            items={metrics.map((m) => m.key)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {metrics.map((m) => (
                <MetricCard
                  key={m.key}
                  metric={m}
                  dim={dim}
                  peerLabels={peerLabels}
                  onRemove={onRemove}
                  onChartChange={onChartChange}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>

      {metrics.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground"
            onClick={onClear}
          >
            清空画布
          </Button>
        </div>
      )}
    </div>
  );
}
