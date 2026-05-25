import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SourceTag } from "@/components/SourceTag";
import { BadgeCheck, Bookmark, AlertTriangle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export type Summary = {
  conclusion: string;
  evidence: string[];
  actions: string[];
  risks: string[];
};

export function RootCauseSummary({ summary }: { summary: Summary }) {
  return (
    <Card className="border-0 gradient-soft shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">根因分析小结</CardTitle>
          <SourceTag type="ai">AI 生成</SourceTag>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="rounded-lg border border-border/40 bg-background/40 p-3">
          <div className="text-[11px] font-medium text-muted-foreground">一句话结论</div>
          <p className="mt-1 leading-relaxed">{summary.conclusion}</p>
        </div>

        <div>
          <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">关键证据</div>
          <ul className="space-y-1 text-xs">
            {summary.evidence.map((e, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-muted-foreground">·</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-success">
            <Lightbulb className="h-3 w-3" /> 建议动作
          </div>
          <ul className="space-y-1 text-xs">
            {summary.actions.map((a, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-success">→</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-warning-foreground">
            <AlertTriangle className="h-3 w-3" /> 风险提示
          </div>
          <ul className="space-y-1 text-xs">
            {summary.risks.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-warning-foreground">!</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => toast.success("已保存为洞察条目")}>
            <Bookmark className="h-3 w-3" /> 保存为洞察
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("已提交官方结论评审")}>
            <BadgeCheck className="h-3 w-3" /> 沉淀为官方结论
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
