import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { tracks } from "@/lib/benchmark/tracks";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function TrackCompareDrawer({ open, onOpenChange }: Props) {
  const [a, setA] = useState(tracks[0].id);
  const [b, setB] = useState(tracks[1].id);
  const left = tracks.find((t) => t.id === a)!;
  const right = tracks.find((t) => t.id === b)!;
  const rows: { label: string; left: React.ReactNode; right: React.ReactNode }[] = [
    { label: "机会评分", left: left.score, right: right.score },
    { label: "CAGR", left: left.cagr, right: right.cagr },
    { label: "匹配度", left: `${left.fit} (${left.fitScore})`, right: `${right.fit} (${right.fitScore})` },
    { label: "风险", left: left.risk, right: right.risk },
    { label: "进入门槛", left: left.barrier, right: right.barrier },
    { label: "市场空间", left: left.marketSize, right: right.marketSize },
  ];
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-base">赛道对比</SheetTitle>
          <SheetDescription className="text-xs">最多选择 2 个赛道并排比较</SheetDescription>
        </SheetHeader>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Picker value={a} onChange={setA} />
          <Picker value={b} onChange={setB} />
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-border/60">
          <div className="grid grid-cols-3 bg-accent/20 px-3 py-2 text-[11px] font-semibold text-muted-foreground">
            <div>维度</div>
            <div>{left.name}</div>
            <div>{right.name}</div>
          </div>
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-3 border-t border-border/40 px-3 py-2 text-xs">
              <div className="text-muted-foreground">{r.label}</div>
              <div className="font-medium">{r.left}</div>
              <div className="font-medium">{r.right}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg gradient-soft p-3">
          <div className="text-xs font-semibold mb-1">AI 对比结论</div>
          <div className="text-xs text-foreground/85 leading-relaxed">
            {left.name} 在机会评分与匹配度上更优；{right.name} 增速更快但门槛更高。建议优先在
            <Badge variant="secondary" className="mx-1 text-[10px] bg-primary/15 text-primary">
              {left.score >= right.score ? left.name : right.name}
            </Badge>
            上启动 POC，{right.name} 通过战略投资跟踪。
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Picker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {tracks.map((t) => (
          <SelectItem key={t.id} value={t.id} className="text-xs">
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
