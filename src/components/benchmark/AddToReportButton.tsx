import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { useReportDraft, type DraftItem } from "@/contexts/ReportDraftContext";
import { toast } from "sonner";

type Props = {
  item: Omit<DraftItem, "addedAt">;
  size?: "sm" | "xs";
  variant?: "ghost" | "outline";
  label?: string;
};

export function AddToReportButton({ item, size = "sm", variant = "ghost", label = "加入报告" }: Props) {
  const { items, add } = useReportDraft();
  const added = items.some((i) => i.id === item.id);
  return (
    <Button
      variant={variant}
      size="sm"
      className={size === "xs" ? "h-7 px-2 text-xs gap-1" : "h-8 px-2.5 text-xs gap-1"}
      onClick={(e) => {
        e.stopPropagation();
        if (added) return;
        add(item);
        toast.success("已加入报告草稿", { description: item.title });
      }}
    >
      {added ? <Check className="h-3 w-3 text-success" /> : <Plus className="h-3 w-3" />}
      {added ? "已加入" : label}
    </Button>
  );
}
