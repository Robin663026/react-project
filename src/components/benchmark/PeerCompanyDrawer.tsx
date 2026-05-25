import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/Sparkline";
import { Pin, Trash2 } from "lucide-react";
import { useReportDraft } from "@/contexts/ReportDraftContext";
import type { PeerRow } from "@/lib/benchmark/peers";
import { metricLabels } from "@/lib/benchmark/peers";

type Props = {
  peer: PeerRow | null;
  onClose: () => void;
};

export function PeerCompanyDrawer({ peer, onClose }: Props) {
  const { add } = useReportDraft();
  if (!peer) return null;
  return (
    <Sheet open={!!peer} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            {peer.name}
            {peer.self && <Badge variant="secondary" className="bg-primary/15 text-primary text-[10px]">本企业</Badge>}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {peer.industry} · 市值 {peer.marketCap}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {(["revenue", "growth", "margin", "roe", "rd", "inventory"] as const).map((k) => (
            <div key={k} className="rounded-lg bg-accent/30 p-2">
              <div className="text-[10px] text-muted-foreground">{metricLabels[k].label}</div>
              <div className="mt-0.5 text-sm font-semibold">
                {(peer as any)[k]}
                {metricLabels[k].suffix}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-border/60 p-3">
          <div className="mb-2 text-[11px] font-semibold text-muted-foreground">营收趋势 (近 8 期)</div>
          <Sparkline data={peer.trend} width={320} height={48} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <Pin className="h-3.5 w-3.5" />
            加入重点跟踪
          </Button>
          <Button
            size="sm"
            className="gap-1 text-xs gradient-primary text-primary-foreground"
            onClick={() => add({ id: `peer-${peer.id}`, type: "peer", title: peer.name, source: "同行经营" })}
          >
            加入报告
          </Button>
          {!peer.self && (
            <Button variant="ghost" size="sm" className="ml-auto h-8 px-2 text-xs gap-1 text-muted-foreground">
              <Trash2 className="h-3.5 w-3.5" />
              移出样本池
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
