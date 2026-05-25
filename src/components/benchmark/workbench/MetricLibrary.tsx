import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, Search, Sparkles } from "lucide-react";
import { metricCatalog, allMetricsFlat, type MetricDef } from "@/lib/benchmark/metrics";
import { presets } from "./presets";

type Props = {
  selectedKeys: string[];
  onAdd: (key: string) => void;
  onLoadPreset: (keys: string[]) => void;
};

export function MetricLibrary({ selectedKeys, onAdd, onLoadPreset }: Props) {
  const [q, setQ] = useState("");

  const filteredFlat = q
    ? allMetricsFlat.filter((m) => m.label.includes(q) || m.source.includes(q))
    : allMetricsFlat;

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-3 p-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索指标 / 来源"
            className="h-8 pl-7 text-xs"
          />
        </div>

        <div className="rounded-lg border border-dashed border-primary/30 bg-primary/[0.04] p-2">
          <div className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase text-primary">
            <Sparkles className="h-3 w-3" />
            预设模板
          </div>
          <div className="flex flex-wrap gap-1">
            {presets.map((p) => (
              <button
                key={p.key}
                onClick={() => onLoadPreset(p.metrics)}
                title={p.description}
                className="rounded-md border border-border/60 bg-card/70 px-2 py-1 text-[11px] hover:border-primary/40 hover:bg-primary/10"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
          {metricCatalog.map((g) => {
            const items = filteredFlat.filter((m) => m.groupKey === g.key);
            if (items.length === 0) return null;
            return (
              <div key={g.key}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                    {g.label}
                  </div>
                  <Badge variant="secondary" className="h-4 bg-muted/40 px-1 text-[10px]">
                    {items.length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {items.map((m) => (
                    <DraggableMetricItem
                      key={m.key}
                      metric={m}
                      selected={selectedKeys.includes(m.key)}
                      onAdd={onAdd}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border/40 pt-2 text-[10px] text-muted-foreground">
          拖入中间画布 · 双击快速添加
        </div>
      </CardContent>
    </Card>
  );
}

function DraggableMetricItem({
  metric,
  selected,
  onAdd,
}: {
  metric: MetricDef;
  selected: boolean;
  onAdd: (key: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib-${metric.key}`,
    data: { type: "library", metricKey: metric.key },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onDoubleClick={() => onAdd(metric.key)}
      className={`group flex cursor-grab items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      } ${
        selected
          ? "border-primary/40 bg-primary/10"
          : "border-transparent hover:border-border/60 hover:bg-accent/40"
      }`}
    >
      <GripVertical className="h-3 w-3 text-muted-foreground/60" />
      <div className="flex-1 truncate">
        <div className="font-medium">{metric.label}</div>
        <div className="text-[10px] text-muted-foreground">
          {metric.unit ?? ""} · {metric.source}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdd(metric.key);
        }}
        className="opacity-0 transition group-hover:opacity-100"
        aria-label="添加"
      >
        <Plus className="h-3.5 w-3.5 text-primary" />
      </button>
    </div>
  );
}
