import { Button } from "@/components/ui/button";
import { Star, FileText, Link2 } from "lucide-react";
import { useReportDraft } from "@/contexts/ReportDraftContext";

type Props = {
  onOpenDraft: () => void;
  onOpenEvidenceHelp: () => void;
};

export function BenchmarkToolbar({ onOpenDraft, onOpenEvidenceHelp }: Props) {
  const { items } = useReportDraft();
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
        <Star className="h-3.5 w-3.5" />
        收藏夹
      </Button>
      <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={onOpenEvidenceHelp}>
        <Link2 className="h-3.5 w-3.5" />
        证据链规则
      </Button>
      <Button size="sm" className="h-8 gap-1.5 text-xs gradient-primary text-primary-foreground" onClick={onOpenDraft}>
        <FileText className="h-3.5 w-3.5" />
        报告草稿
        {items.length > 0 && (
          <span className="ml-0.5 rounded-full bg-primary-foreground/25 px-1.5 text-[10px] font-semibold">
            {items.length}
          </span>
        )}
      </Button>
    </div>
  );
}
