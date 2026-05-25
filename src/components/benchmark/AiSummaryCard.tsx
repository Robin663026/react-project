import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { SourceTag } from "@/components/SourceTag";
import { useEvidence, type EvidencePayload } from "./EvidenceDrawer";
import { AddToReportButton } from "./AddToReportButton";

type Props = {
  id: string;
  title: string;
  children: React.ReactNode;
  evidence?: EvidencePayload;
  footer?: React.ReactNode;
};

export function AiSummaryCard({ id, title, children, evidence, footer }: Props) {
  const { open } = useEvidence();
  return (
    <Card className="border-0 shadow-soft gradient-soft">
      <CardContent className="p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{title}</span>
            <SourceTag type="ai">AI 生成</SourceTag>
          </div>
          <div className="flex items-center gap-1">
            {evidence && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1"
                onClick={() => open(evidence)}
              >
                查看依据
              </Button>
            )}
            <AddToReportButton
              item={{ id: `ai-${id}`, type: "ai-summary", title }}
              size="xs"
            />
          </div>
        </div>
        <div className="text-sm text-foreground/85 leading-relaxed">{children}</div>
        {footer && <div className="mt-3">{footer}</div>}
      </CardContent>
    </Card>
  );
}
