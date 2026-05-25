import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Link2, Clock, Database, Scale, Sparkles, ExternalLink } from "lucide-react";

export type EvidencePayload = {
  title: string;
  subject?: string;
  links: { name: string; url: string }[];
  fetchedAt?: string;
  parsedAt?: string;
  schema?: string;
  relatedMetrics?: string[];
  confidence?: number;
};

type Ctx = { open: (p: EvidencePayload) => void };
const EvidenceCtx = createContext<Ctx | null>(null);

export function EvidenceProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<EvidencePayload | null>(null);
  const open = useCallback((p: EvidencePayload) => setPayload(p), []);
  const value = useMemo(() => ({ open }), [open]);
  return (
    <EvidenceCtx.Provider value={value}>
      {children}
      <Sheet open={!!payload} onOpenChange={(o) => !o && setPayload(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {payload && (
            <>
              <SheetHeader>
                <SheetTitle className="text-base">证据链 · {payload.title}</SheetTitle>
                {payload.subject && (
                  <SheetDescription className="text-xs">{payload.subject}</SheetDescription>
                )}
              </SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <Section icon={<Link2 className="h-3.5 w-3.5" />} title="原始来源">
                  <div className="flex flex-col gap-1.5">
                    {payload.links.map((l) => (
                      <a
                        key={l.name}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {l.name}
                      </a>
                    ))}
                  </div>
                </Section>
                {(payload.fetchedAt || payload.parsedAt) && (
                  <Section icon={<Clock className="h-3.5 w-3.5" />} title="时间">
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {payload.fetchedAt && (
                        <div>
                          <div>抓取时间</div>
                          <div className="text-foreground">{payload.fetchedAt}</div>
                        </div>
                      )}
                      {payload.parsedAt && (
                        <div>
                          <div>解析时间</div>
                          <div className="text-foreground">{payload.parsedAt}</div>
                        </div>
                      )}
                    </div>
                  </Section>
                )}
                {payload.schema && (
                  <Section icon={<Scale className="h-3.5 w-3.5" />} title="口径说明">
                    <p className="text-xs text-muted-foreground leading-relaxed">{payload.schema}</p>
                  </Section>
                )}
                {payload.relatedMetrics && payload.relatedMetrics.length > 0 && (
                  <Section icon={<Database className="h-3.5 w-3.5" />} title="关联指标">
                    <div className="flex flex-wrap gap-1.5">
                      {payload.relatedMetrics.map((m) => (
                        <Badge key={m} variant="secondary" className="text-[10px]">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </Section>
                )}
                {typeof payload.confidence === "number" && (
                  <Section icon={<Sparkles className="h-3.5 w-3.5" />} title="AI 置信度">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full gradient-primary"
                          style={{ width: `${Math.round(payload.confidence * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">
                        {Math.round(payload.confidence * 100)}%
                      </span>
                    </div>
                  </Section>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </EvidenceCtx.Provider>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/60 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

export function useEvidence() {
  const ctx = useContext(EvidenceCtx);
  if (!ctx) throw new Error("useEvidence must be used within EvidenceProvider");
  return ctx;
}
