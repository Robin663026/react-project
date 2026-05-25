import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceTag } from "@/components/SourceTag";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type Hypothesis = {
  id: string;
  title: string;
  reasoning: string;
  dataPoints: string[];
  // simulated verification result
  significance: number; // 0-1
  correlation: number; // -1 to 1
};

export function HypothesisCard({ hypothesis, rank }: { hypothesis: Hypothesis; rank: number }) {
  const [state, setState] = useState<"idle" | "loading" | "verified">("idle");

  const verify = () => {
    setState("loading");
    setTimeout(() => setState("verified"), 900);
  };

  const sigPct = Math.round(hypothesis.significance * 100);
  const corrPct = Math.round(Math.abs(hypothesis.correlation) * 100);
  const supported = hypothesis.significance >= 0.8;

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <div className="glass-chip flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
              {rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{hypothesis.title}</h4>
                <SourceTag type="ai">AI 假设</SourceTag>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{hypothesis.reasoning}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[11px] text-muted-foreground">待验证数据点</div>
          <div className="flex flex-wrap gap-1.5">
            {hypothesis.dataPoints.map((dp) => (
              <Badge key={dp} variant="secondary" className="px-1.5 py-0 text-[10px]">
                {dp}
              </Badge>
            ))}
          </div>
        </div>

        {state === "verified" && (
          <div className="space-y-2 rounded-lg border border-border/60 bg-accent/20 p-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <CheckCircle2 className={cn("h-4 w-4", supported ? "text-success" : "text-warning")} />
              {supported ? "假设成立" : "证据不足，需进一步验证"}
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <div className="mb-0.5 flex justify-between text-muted-foreground">
                  <span>显著性 p</span>
                  <span className="text-foreground">{sigPct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full", supported ? "bg-success" : "bg-warning")} style={{ width: `${sigPct}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-0.5 flex justify-between text-muted-foreground">
                  <span>相关性 r</span>
                  <span className="text-foreground">
                    {hypothesis.correlation > 0 ? "+" : ""}
                    {hypothesis.correlation.toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full", hypothesis.correlation > 0 ? "bg-success" : "bg-destructive")} style={{ width: `${corrPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button size="sm" variant={state === "verified" ? "outline" : "default"} className={cn("h-7", state !== "verified" && "gradient-primary text-primary-foreground")} onClick={verify} disabled={state === "loading"}>
            {state === "loading" ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> 验证中
              </>
            ) : state === "verified" ? (
              <>
                <Sparkles className="h-3 w-3" /> 重新验证
              </>
            ) : (
              "一键验证"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
