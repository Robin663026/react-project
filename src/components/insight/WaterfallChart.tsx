import { cn } from "@/lib/utils";

export type WaterfallItem = { name: string; value: number; type?: "start" | "end" | "delta" };

// Simple SVG-based waterfall to avoid recharts complexity
export function WaterfallChart({ items, height = 200 }: { items: WaterfallItem[]; height?: number }) {
  // compute running totals
  let running = 0;
  const bars = items.map((it) => {
    if (it.type === "start" || it.type === "end") {
      const bar = { name: it.name, base: 0, top: it.value, value: it.value, kind: it.type };
      running = it.value;
      return bar;
    }
    const base = running;
    running = running + it.value;
    return { name: it.name, base: Math.min(base, running), top: Math.max(base, running), value: it.value, kind: "delta" as const };
  });

  const maxV = Math.max(...bars.map((b) => b.top));
  const minV = Math.min(...bars.map((b) => b.base), 0);
  const range = maxV - minV || 1;

  const w = 100 / bars.length;

  return (
    <div className="w-full">
      <div className="relative" style={{ height }}>
        {bars.map((b, i) => {
          const topPct = ((maxV - b.top) / range) * 100;
          const heightPct = ((b.top - b.base) / range) * 100;
          const colorClass =
            b.kind === "start" || b.kind === "end"
              ? "bg-primary/70"
              : b.value > 0
                ? "bg-success"
                : "bg-destructive";
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${i * w}%`, width: `${w}%`, top: 0, height: "100%" }}
            >
              <div className="relative w-full flex-1">
                <div
                  className={cn("absolute left-1/2 w-[60%] -translate-x-1/2 rounded-sm", colorClass)}
                  style={{ top: `${topPct}%`, height: `${Math.max(heightPct, 1)}%` }}
                />
                <div
                  className="absolute left-1/2 -translate-x-1/2 text-[10px] font-medium"
                  style={{ top: `calc(${topPct}% - 14px)` }}
                >
                  {b.value > 0 && b.kind === "delta" ? "+" : ""}
                  {b.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex">
        {bars.map((b, i) => (
          <div key={i} className="text-center text-[10px] text-muted-foreground" style={{ width: `${w}%` }}>
            {b.name}
          </div>
        ))}
      </div>
    </div>
  );
}
