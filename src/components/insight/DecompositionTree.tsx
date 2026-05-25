import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type TreeNode = {
  name: string;
  value: number; // percent contribution
  children?: TreeNode[];
};

function NodeRow({ node, depth = 0, defaultOpen = false }: { node: TreeNode; depth?: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = !!node.children?.length;
  const positive = node.value > 0;
  return (
    <div>
      <div
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent/40",
          depth === 0 && "font-medium",
        )}
        style={{ paddingLeft: 8 + depth * 16 }}
        onClick={() => hasChildren && setOpen(!open)}
      >
        {hasChildren ? (
          open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <span className="h-3.5 w-3.5" />
        )}
        <span className="flex-1 truncate text-sm">{node.name}</span>
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full", positive ? "bg-success" : "bg-destructive")} style={{ width: `${Math.min(Math.abs(node.value) * 2, 100)}%` }} />
        </div>
        <span className={cn("w-12 text-right text-xs tabular-nums", positive ? "text-success" : "text-destructive")}>
          {positive ? "+" : ""}
          {node.value}%
        </span>
      </div>
      {open && hasChildren && (
        <div className="border-l border-dashed border-border/60" style={{ marginLeft: 8 + depth * 16 + 6 }}>
          {node.children!.map((c, i) => (
            <NodeRow key={i} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function DecompositionTree({ root }: { root: TreeNode }) {
  return (
    <div className="rounded-lg border border-border/60 p-2">
      <NodeRow node={root} defaultOpen />
    </div>
  );
}
