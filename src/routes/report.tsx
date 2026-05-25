import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceTag } from "@/components/SourceTag";
import { FileText, Sparkles, Layers, Wand2 } from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "报告工作台 · AI经营分析" },
      { name: "description", content: "AI 报告生成、模板库与共享管理。" },
    ],
  }),
  component: ReportPage,
});

const reports = [
  { title: "2026 Q1 集团经营分析报告", owner: "财务中心", time: "2 天前", status: "审批中", verified: true },
  { title: "华东事业部 3 月经营回顾", owner: "华东 BU", time: "5 天前", status: "已发布", verified: false },
  { title: "电商业务专项分析", owner: "数字化部", time: "1 周前", status: "草稿", verified: false },
  { title: "原材料成本预警简报", owner: "供应链", time: "1 周前", status: "已发布", verified: true },
];

function ReportPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">报告 · 工作台</h1>
          <p className="mt-1 text-sm text-muted-foreground">从模板到 AI 大纲再到一键填充</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-soft">
          <Sparkles className="h-4 w-4" />
          AI 新建报告
        </Button>
      </div>

      {/* Workflow */}
      <Card className="border-0 shadow-soft gradient-soft">
        <CardContent className="grid gap-4 p-5 md:grid-cols-3">
          {[
            { icon: Layers, title: "1. 选择模板", desc: "从官方模板库或历史报告开始" },
            { icon: Wand2, title: "2. AI 生成大纲", desc: "根据业务目标推荐章节与指标" },
            { icon: FileText, title: "3. 一键填充", desc: "AI 取数、解读并标注溯源" },
          ].map((s) => (
            <div key={s.title} className="rounded-xl border border-border/40 bg-card/80 p-4 backdrop-blur">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                <s.icon className="h-4 w-4" />
              </div>
              <h4 className="mt-3 text-sm font-semibold">{s.title}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">我的报告</TabsTrigger>
          <TabsTrigger value="shared">共享</TabsTrigger>
          <TabsTrigger value="official">官方加V</TabsTrigger>
        </TabsList>
        <TabsContent value="mine" className="mt-4">
          <ReportGrid items={reports} />
        </TabsContent>
        <TabsContent value="shared" className="mt-4">
          <ReportGrid items={reports.slice(1, 3)} />
        </TabsContent>
        <TabsContent value="official" className="mt-4">
          <ReportGrid items={reports.filter((r) => r.verified)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReportGrid({ items }: { items: typeof reports }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((r) => (
        <Card key={r.title} className="border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-sm leading-snug">{r.title}</CardTitle>
              {r.verified && <SourceTag type="verified">加V</SourceTag>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{r.owner} · {r.time}</span>
              <Badge variant="secondary" className="rounded-md">{r.status}</Badge>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">查看</Button>
              <Button size="sm" variant="ghost">分享</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
