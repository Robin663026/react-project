import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceTag } from "@/components/SourceTag";
import { Sparkline } from "@/components/Sparkline";
import { quadrantEvidence, type QuadrantEvidence, type EvidenceStatus } from "@/lib/monitor/evidence";
import { Sparkles, FileText, Building2, Briefcase, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const statusChip: Record<EvidenceStatus, string> = {
  normal: "bg-success/15 text-success ring-1 ring-success/30",
  warning: "bg-warning/20 text-warning-foreground ring-1 ring-warning/40",
  critical: "bg-destructive/15 text-destructive ring-1 ring-destructive/30",
  future: "bg-primary/15 text-primary ring-1 ring-primary/30",
};
const statusText: Record<EvidenceStatus, string> = {
  normal: "正常",
  warning: "预警",
  critical: "严重",
  future: "预测",
};

type Trigger = { dim: string; time: string };

export function useQuadrantDrawer() {
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const evidence: QuadrantEvidence | null =
    trigger ? quadrantEvidence[trigger.dim]?.[trigger.time] ?? null : null;

  const openWith = (dim: string, time: string) => {
    setTrigger({ dim, time });
    setOpen(true);
  };

  const drawer = (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-[560px]">
        {evidence && (
          <div className="space-y-5">
            {/* 1. 象限摘要头部 */}
            <SheetHeader className="space-y-2 text-left">
              <div className="flex items-center justify-between gap-2">
                <SheetTitle className="text-base">
                  {evidence.timeAxis} × {evidence.dimensionAxis}
                </SheetTitle>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusChip[evidence.status]}`}>
                  {statusText[evidence.status]}
                </span>
              </div>
              <SheetDescription className="text-xs leading-relaxed">{evidence.summary}</SheetDescription>
              <div className="flex flex-wrap gap-1.5">
                {evidence.sectors.map((s) => (
                  <Badge key={s} variant="secondary" className="bg-muted/60 text-[10px]">
                    板块 · {s}
                  </Badge>
                ))}
                {evidence.subjects.map((s) => (
                  <Badge key={s} variant="secondary" className="bg-primary/10 text-primary text-[10px]">
                    主体 · {s}
                  </Badge>
                ))}
              </div>
            </SheetHeader>

            {/* 2. 触发原因 */}
            <Section title="触发原因" icon={<AlertTriangle className="h-3.5 w-3.5 text-warning-foreground" />}>
              <div className="space-y-2">
                {evidence.signalReasons.map((r, i) => (
                  <div key={i} className="rounded-lg border border-border/60 bg-card/40 p-3 text-xs">
                    <div className="font-medium">{r.rule}</div>
                    <div className="mt-1 flex flex-wrap gap-3 text-muted-foreground">
                      <span>阈值 <b className="text-foreground">{r.threshold}</b></span>
                      <span>实际 <b className="text-foreground">{r.actual}</b></span>
                      {r.trendNote && <span>{r.trendNote}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* 3. 指标证据链 */}
            <Section title="指标证据链">
              <div className="space-y-2">
                {evidence.metricEvidence.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{m.metricName}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        当前 <b className="text-foreground">{m.value}</b>
                        {m.target && <> · 目标 {m.target}</>}
                      </div>
                    </div>
                    {m.trend && <Sparkline data={m.trend} width={80} height={24} />}
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${statusChip[m.status]}`}>
                      {statusText[m.status]}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            {/* 4. 对象证据链 */}
            <Section title="对象证据链" icon={<Building2 className="h-3.5 w-3.5 text-primary" />}>
              <div className="space-y-2">
                {evidence.objectEvidence.map((o, i) => (
                  <div key={i} className="rounded-lg border border-border/60 bg-card/40 p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium">{o.objectName}</span>
                      <Badge variant="secondary" className="bg-muted/60 text-[10px]">{o.objectType}</Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                      <span>状态 · {o.status}</span>
                      {o.owner && <span>责任 · {o.owner}</span>}
                      {o.officeScope && <span>归口 · {o.officeScope}</span>}
                    </div>
                    {o.note && <div className="mt-1 text-[11px] text-foreground/70">{o.note}</div>}
                  </div>
                ))}
              </div>
            </Section>

            {/* 5. 原始材料 */}
            <Section title="原始材料 / 溯源" icon={<FileText className="h-3.5 w-3.5 text-primary" />}>
              <div className="space-y-2">
                {evidence.sourceMaterials.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => toast.info(`打开材料：${s.title}`)}
                    className="group block w-full rounded-lg border border-border/60 bg-card/40 p-2.5 text-left transition-all hover:bg-accent"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium truncate">{s.title}</span>
                      <SourceTag type="verified">{s.type}</SourceTag>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                      <span>{s.date}</span>
                      <span>· {s.source}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-foreground/70">{s.summary}</div>
                  </button>
                ))}
              </div>
            </Section>

            {/* 6. AI 解读 */}
            <Section title="AI 解读" icon={<Sparkles className="h-3.5 w-3.5 text-primary" />}>
              <div className="rounded-lg gradient-soft p-3 text-xs leading-relaxed text-foreground/85">
                {evidence.aiReasoning}
              </div>
            </Section>

            {/* 7. 后续动作 */}
            <Section title="后续动作" icon={<Briefcase className="h-3.5 w-3.5 text-primary" />}>
              <div className="flex flex-wrap gap-2">
                {evidence.actions.map((a) => (
                  <Button
                    key={a.label}
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-xs"
                    onClick={() => toast.success(`已触发：${a.label}`)}
                  >
                    {a.label}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                ))}
              </div>
            </Section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );

  return { openWith, drawer };
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground/90">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}
