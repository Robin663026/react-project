import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export type FilterDef = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

type Props = {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset?: () => void;
  right?: React.ReactNode;
};

export function FilterBar({ filters, values, onChange, onReset, right }: Props) {
  const activeCount = Object.values(values).filter((v) => v && v !== "all").length;
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-2 backdrop-blur">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Filter className="h-3.5 w-3.5" />
        筛选
        {activeCount > 0 && (
          <span className="ml-1 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            {activeCount}
          </span>
        )}
      </div>
      {filters.map((f) => (
        <Select key={f.key} value={values[f.key] ?? "all"} onValueChange={(v) => onChange(f.key, v)}>
          <SelectTrigger className="h-8 w-auto min-w-[110px] gap-1 text-xs">
            <SelectValue placeholder={f.label} />
          </SelectTrigger>
          <SelectContent>
            {f.options.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-xs">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {activeCount > 0 && onReset && (
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={onReset}>
          <X className="h-3 w-3" />
          清空
        </Button>
      )}
      <div className="ml-auto flex items-center gap-2">{right}</div>
    </div>
  );
}
