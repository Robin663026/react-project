import { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sparkline } from "@/components/Sparkline";
import { GripVertical, X } from "lucide-react";
import {
  getMetricRows,
  getMetricDef,
  type Dimension,
  type Row,
} from "@/lib/benchmark/metrics";
import type { ChartType, SelectedMetric } from "./useWorkbenchState";

type Props = {
  metric: SelectedMetric;
  dim: Dimension;
  peerLabels: string[] | null; // null = no peer filtering
  onRemove: (key: string) => void;
  onChartChange: (key: string, chart: ChartType) => void;
};

export function MetricCard({ metric, dim, peerLabels, onRemove, onChartChange }: Props) {
  const def = getMetricDef(metric.key);
  const allRows = useMemo(() => getMetricRows(metric.key, dim), [metric.key, dim]);
  const rows = useMemo(() => {
    if (dim !== "company" || !peerLabels) return allRows;
    const filtered = allRows.filter((r) => peerLabels.includes(r.label));
    return filtered.length > 0 ? filtered : allRows;
  }, [allRows, peerLabels, dim]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: metric.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!def) return null;

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="border-border/60">
        <CardContent className="space-y-3 p-3">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab text-muted-foreground/60 hover:text-foreground active:cursor-grabbing"
              aria-label="拖动排序"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{def.label}</span>
                {def.unit && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    {def.unit}
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="h-4 bg-muted/40 px-1 text-[10px] text-muted-foreground"
                >
                  {def.source}
                </Badge>
              </div>
            </div>
            <Select value={metric.chart} onValueChange={(v) => onChartChange(metric.key, v as ChartType)}>
              <SelectTrigger className="h-7 w-[88px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">条形图</SelectItem>
                <SelectItem value="heatmap">热力图</SelectItem>
                <SelectItem value="table">表格</SelectItem>
                <SelectItem value="spark">趋势线</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onRemove(metric.key)}
              aria-label="移除"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          <ChartSwitch type={metric.chart} rows={rows} better={def.better} />
        </CardContent>
      </Card>
    </div>
  );
}

function ChartSwitch({
  type,
  rows,
  better,
}: {
  type: ChartType;
  rows: Row[];
  better: "high" | "low";
}) {
  if (rows.length === 0)
    return (
      <div className="rounded-md border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
        当前筛选下无数据
      </div>
    );

  if (type === "bar") {
    return (
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "heatmap") {
    const max = Math.max(...rows.map((r) => r.value));
    const min = Math.min(...rows.map((r) => r.value));
    return (
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${rows.length}, minmax(0,1fr))` }}
      >
        {rows.map((r) => {
          const ratio = (r.value - min) / (max - min || 1);
          const intensity = better === "high" ? ratio : 1 - ratio;
          return (
            <div
              key={r.label}
              className="rounded-md p-2 text-center"
              style={{
                background: `color-mix(in oklab, var(--color-primary) ${Math.round(intensity * 70 + 8)}%, transparent)`,
              }}
            >
              <div className="truncate text-[10px] text-muted-foreground">{r.label}</div>
              <div className="mt-0.5 text-sm font-semibold">{r.value}</div>
              <div
                className={`text-[10px] ${r.yoy >= 0 ? "text-success" : "text-destructive"}`}
              >
                {r.yoy >= 0 ? "+" : ""}
                {r.yoy}%
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="max-h-44 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-7 text-xs">对象</TableHead>
              <TableHead className="h-7 text-xs">数值</TableHead>
              <TableHead className="h-7 text-xs">同比</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell className="py-1 text-xs font-medium">{r.label}</TableCell>
                <TableCell className="py-1 text-xs">{r.value}</TableCell>
                <TableCell className="py-1">
                  <span
                    className={`text-xs ${r.yoy >= 0 ? "text-success" : "text-destructive"}`}
                  >
                    {r.yoy >= 0 ? "+" : ""}
                    {r.yoy}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // spark
  return (
    <div className="space-y-1.5">
      {rows.map((r) => {
        const trend = Array.from({ length: 8 }, (_, i) =>
          r.value * (0.85 + ((i * 7 + r.value) % 10) / 30),
        );
        return (
          <div key={r.label} className="flex items-center gap-2">
            <div className="w-20 truncate text-[11px] text-muted-foreground">{r.label}</div>
            <div className="flex-1">
              <Sparkline data={trend} width={180} height={24} />
            </div>
            <div className="w-12 text-right text-xs font-semibold">{r.value}</div>
            <div
              className={`w-12 text-right text-[10px] ${r.yoy >= 0 ? "text-success" : "text-destructive"}`}
            >
              {r.yoy >= 0 ? "+" : ""}
              {r.yoy}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
