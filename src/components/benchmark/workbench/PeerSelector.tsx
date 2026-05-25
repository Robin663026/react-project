import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { peers } from "@/lib/benchmark/peers";
import { dimensionOptions, type Dimension } from "@/lib/benchmark/metrics";

type Props = {
  peerIds: string[];
  dim: Dimension;
  onTogglePeer: (id: string) => void;
  onChangeDim: (dim: Dimension) => void;
};

export function PeerSelector({ peerIds, dim, onTogglePeer, onChangeDim }: Props) {
  return (
    <Card className="border-border/60">
      <CardContent className="space-y-4 p-3">
        <div>
          <div className="mb-2 text-[10px] font-semibold uppercase text-muted-foreground">
            对比维度
          </div>
          <ToggleGroup
            type="single"
            value={dim}
            onValueChange={(v) => v && onChangeDim(v as Dimension)}
            className="grid grid-cols-2 gap-1"
          >
            {dimensionOptions.map((d) => (
              <ToggleGroupItem
                key={d.key}
                value={d.key}
                className="h-7 text-xs data-[state=on]:bg-primary/15 data-[state=on]:text-primary"
              >
                {d.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase text-muted-foreground">
              对比对象
            </div>
            <Badge variant="secondary" className="h-4 px-1 text-[10px]">
              {peerIds.length}/{peers.length}
            </Badge>
          </div>
          {dim !== "company" ? (
            <div className="rounded-md border border-dashed border-border/60 p-3 text-[11px] text-muted-foreground">
              当前维度为「{dimensionOptions.find((d) => d.key === dim)?.label}」，
              对比对象由该维度自动展开。
            </div>
          ) : (
            <div className="space-y-1.5">
              {peers.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition ${
                    peerIds.includes(p.id)
                      ? "border-primary/30 bg-primary/[0.06]"
                      : "border-transparent hover:bg-accent/40"
                  }`}
                >
                  <Checkbox
                    checked={peerIds.includes(p.id)}
                    onCheckedChange={() => onTogglePeer(p.id)}
                  />
                  <div className="flex-1 truncate">
                    <div className="font-medium">
                      {p.name}
                      {p.self && (
                        <Badge
                          variant="secondary"
                          className="ml-1 h-4 bg-primary/15 px-1 text-[10px] text-primary"
                        >
                          本企业
                        </Badge>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {p.industry} · {p.marketCap}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-md border border-border/40 bg-muted/20 p-2 text-[10px] leading-relaxed text-muted-foreground">
          <Label className="text-[10px] font-semibold">数据口径</Label>
          <div className="mt-1">
            指标取自上市公司定期报告与 Wind / 巨潮资讯，统一按报告期口径汇总，海外公司汇率按期末折算。
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
