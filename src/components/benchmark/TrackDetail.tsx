import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, FileText, ExternalLink } from "lucide-react";
import { useEvidence } from "./EvidenceDrawer";
import { AddToReportButton } from "./AddToReportButton";
import type { TrackData } from "@/lib/benchmark/tracks";

const fitColor = { 高: "text-success", 中: "text-warning-foreground", 低: "text-muted-foreground" };
const riskColor = { 低: "bg-success/15 text-success", 中: "bg-warning/20 text-warning-foreground", 高: "bg-destructive/15 text-destructive" };

export function TrackDetail({ t }: { t: TrackData }) {
  const { open } = useEvidence();
  const sections: { title: string; body: React.ReactNode }[] = [
    { title: "赛道定义", body: t.definition },
    { title: "市场空间", body: `${t.marketSize} · CAGR ${t.cagr}` },
    { title: "关键政策驱动", body: t.policy },
    {
      title: "关键玩家",
      body: (
        <div className="flex flex-wrap gap-1">
          {t.players.map((p) => (
            <Badge key={p} variant="secondary" className="text-[10px]">
              {p}
            </Badge>
          ))}
        </div>
      ),
    },
    { title: "商业模式", body: t.model },
    { title: "与本企业关联点", body: t.relation },
    { title: "风险点", body: t.riskNote },
    { title: "进入建议", body: t.entry },
  ];
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="text-base font-semibold">{t.name}</div>
            <div className="text-[11px] text-muted-foreground">{t.stage}</div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <MiniStat label="机会评分" value={String(t.score)} highlight />
            <MiniStat label="CAGR" value={t.cagr} />
            <div className="rounded-lg bg-accent/30 px-2 py-1 text-center">
              <div className="text-[10px] text-muted-foreground">匹配度</div>
              <div className={`text-sm font-semibold ${fitColor[t.fit]}`}>{t.fit}</div>
            </div>
            <div className="rounded-lg px-2 py-1 text-center">
              <div className="text-[10px] text-muted-foreground">风险</div>
              <Badge variant="secondary" className={`text-[10px] ${riskColor[t.risk]}`}>
                {t.risk}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {sections.map((s) => (
            <div key={s.title} className="rounded-lg border border-border/60 p-3">
              <div className="mb-1 text-[11px] font-semibold text-muted-foreground">{s.title}</div>
              <div className="text-xs leading-relaxed text-foreground/90">{s.body}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {t.sources.map((s) => (
              <a
                key={s.name}
                href={s.url}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-accent/40"
              >
                <Link2 className="h-2.5 w-2.5" />
                {s.name}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={() =>
                open({
                  title: t.name,
                  links: t.sources,
                  fetchedAt: "2026-04-20 09:00",
                  parsedAt: "2026-04-20 09:05",
                  schema: `机会评分综合 政策驱动 / 市场增速 / 玩家成熟度`,
                  relatedMetrics: ["机会评分", "CAGR", "匹配度"],
                  confidence: 0.84,
                })
              }
            >
              <Link2 className="h-3 w-3" />
              证据链
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1">
              <FileText className="h-3 w-3" />
              AI 深度报告
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1">
              <ExternalLink className="h-3 w-3" />
              外部报告
            </Button>
            <AddToReportButton item={{ id: `track-${t.id}`, type: "track", title: t.name }} size="xs" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-accent/30 px-2 py-1 text-center">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className={`text-sm font-semibold ${highlight ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}
