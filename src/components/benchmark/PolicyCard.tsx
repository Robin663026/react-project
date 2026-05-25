import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Link2,
  Heart,
  EyeOff,
  ChevronRight,
  ListPlus,
  Copy,
} from "lucide-react";
import { useEvidence } from "./EvidenceDrawer";
import { AddToReportButton } from "./AddToReportButton";
import { toast } from "sonner";
import type { PolicyCardData } from "@/lib/benchmark/policies";

const impactStyle: Record<string, string> = {
  good: "bg-success/15 text-success border-success/30",
  high: "bg-primary/15 text-primary border-primary/30",
  risk: "bg-destructive/15 text-destructive border-destructive/30",
  neutral: "bg-muted text-muted-foreground border-border",
};
const impactIcon: Record<string, typeof TrendingUp> = {
  good: TrendingUp,
  high: Sparkles,
  risk: AlertTriangle,
  neutral: Sparkles,
};

export function PolicyCard({ p }: { p: PolicyCardData }) {
  const Icon = impactIcon[p.impact];
  const { open } = useEvidence();
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${impactStyle[p.impact]}`}
          >
            <Icon className="h-3 w-3" />
            {p.impactLabel}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {p.org} · {p.publishDate}
          </span>
        </div>
        <h3 className="text-sm font-semibold leading-snug">{p.title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">{p.summary}</p>

        <div className="rounded-lg bg-accent/30 p-2">
          <div className="text-[10px] text-muted-foreground">关联指标</div>
          <div className="text-xs font-medium mt-0.5">{p.relatedKpi}</div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground mb-1.5">建议行动</div>
          <ul className="space-y-1">
            {p.actions.map((a) => (
              <li
                key={a}
                className="group flex items-start justify-between gap-2 rounded-md px-1.5 py-1 text-xs hover:bg-accent/30"
              >
                <div className="flex items-start gap-1.5">
                  <span className="mt-1 inline-block h-1 w-1 rounded-full bg-primary" />
                  {a}
                </div>
                <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-[10px] gap-1"
                    onClick={() => toast.success("已生成任务", { description: a })}
                  >
                    <ListPlus className="h-3 w-3" />
                    任务
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-[10px] gap-1"
                    onClick={() => toast("已复制到简报", { description: a })}
                  >
                    <Copy className="h-3 w-3" />
                    简报
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between border-t border-border/40 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1"
            onClick={() =>
              open({
                title: p.title,
                subject: `${p.org} · ${p.publishDate}`,
                links: p.sources,
                fetchedAt: p.fetchedAt,
                parsedAt: p.parsedAt,
                schema: `影响主题：${p.topic}；关联范围：${p.scope}`,
                relatedMetrics: p.relatedMetrics,
                confidence: p.confidence,
              })
            }
          >
            <Link2 className="h-3 w-3" />
            证据链
          </Button>
          <div className="flex items-center gap-0.5">
            <AddToReportButton
              item={{ id: p.id, type: "policy", title: p.title, source: p.org }}
              size="xs"
            />
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="收藏">
              <Heart className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="不感兴趣">
              <EyeOff className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-1.5 text-xs gap-0.5">
              详情 <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
