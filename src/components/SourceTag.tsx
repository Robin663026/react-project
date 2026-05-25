import { LinkIcon, Sparkles, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  type?: "source" | "ai" | "verified";
  children: React.ReactNode;
  className?: string;
};

export function SourceTag({ type = "source", children, className }: Props) {
  const Icon = type === "ai" ? Sparkles : type === "verified" ? BadgeCheck : LinkIcon;
  const styles =
    type === "ai"
      ? "bg-accent text-accent-foreground"
      : type === "verified"
        ? "gradient-primary text-primary-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
        styles,
        className,
      )}
    >
      <Icon className="h-2.5 w-2.5" />
      {children}
    </span>
  );
}
