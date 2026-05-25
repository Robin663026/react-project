import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "管理台 · AI经营分析" },
      { name: "description", content: "加V审核、指标口径版本、运营报表。" },
    ],
  }),
  component: AdminPage,
});

const queue = [
  { item: "客单价 v2.1 口径变更", submitter: "财务中心", time: "2h", type: "指标口径" },
  { item: "Q1 集团经营分析报告", submitter: "战略部", time: "5h", type: "报告" },
  { item: "供应链周报模板", submitter: "供应链", time: "1d", type: "模板" },
];

const versions = [
  { name: "营收", version: "v3.2", updated: "2026-04-10", owner: "财务" },
  { name: "毛利率", version: "v2.5", updated: "2026-03-28", owner: "财务" },
  { name: "活跃客户数", version: "v1.8", updated: "2026-04-02", owner: "营销" },
];

function AdminPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">管理台</h1>
        <p className="mt-1 text-sm text-muted-foreground">加V审核 · 口径治理 · 运营报表</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">加V 审核队列</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>对象</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>提交人</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((q) => (
                  <TableRow key={q.item}>
                    <TableCell className="font-medium">{q.item}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{q.type}</Badge>
                    </TableCell>
                    <TableCell>{q.submitter}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{q.time} 前</TableCell>
                    <TableCell>
                      <Button size="sm" className="gradient-primary text-primary-foreground">
                        审核
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">指标口径版本</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>指标</TableHead>
                  <TableHead>当前版本</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead>负责人</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((v) => (
                  <TableRow key={v.name}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{v.version}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{v.updated}</TableCell>
                    <TableCell>{v.owner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft gradient-soft lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">运营报表入口</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {["平台活跃用户", "AI 调用统计", "报告生成趋势"].map((m) => (
              <div key={m} className="rounded-xl border border-border/40 bg-card/80 p-4 backdrop-blur">
                <div className="text-xs text-muted-foreground">{m}</div>
                <div className="mt-2 text-2xl font-semibold">—</div>
                <Button size="sm" variant="ghost" className="mt-2 h-7 px-0 text-xs">
                  查看详情 →
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
