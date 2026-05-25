import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SourceTag } from "@/components/SourceTag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, HelpCircle, Target } from "lucide-react";
import { toast } from "sonner";

type Section = { title: string; items: string[] };

const dailyBrief: Section[] = [
  { title: "本期关键变化", items: ["集团营收周环比 -4.2%，主要拖累来自华南区零售渠道", "毛利率 28.6%，较上周下降 0.8pt", "应收账款 90+ 占比上行至 12.4%"] },
  { title: "Top 异常", items: ["[P0] 华南区销售环比 -12%（零售渠道）", "[P0] 原材料 PVC/铜价 +8.4%", "[P1] 电商退货率 +2.1pt（X3 系列尺码）"] },
  { title: "已验证根因", items: ["华南区下滑 = 渠道结构(-38%) + 促销折扣(-22%)，新品 X3(+28%) 部分对冲", "毛利下降 = 原材料涨价 + 折扣加深"] },
  { title: "待验证假设", items: ["东莞门店客流下降是否与节后季节性相关", "X3 退货是否集中在 M/L 尺码"] },
  { title: "建议动作", items: ["华南区加大新品 X3 陈列与会员复购券投放", "锁价采购 PVC 30 天用量，降低成本敞口", "对 Top 20 大客户启动应收专项清理"] },
];

const weeklyBrief: Section[] = [
  { title: "本期关键变化", items: ["近 4 周营收同比 -2.1%，环比走势走弱", "新品 X3 渗透率突破 18%", "渠道结构持续向电商倾斜"] },
  { title: "Top 异常", items: ["[P0] 华南区连续两周下滑", "[P1] 库存周转天数升至 62 天", "[P2] 北区客单价小幅回落"] },
  { title: "已验证根因", items: ["华南区下滑驱动因子稳定（渠道+促销）", "库存上行主要由春装尾货 + X3 备货叠加"] },
  { title: "待验证假设", items: ["竞品 Y 系列降价是否影响北区客单价"] },
  { title: "建议动作", items: ["启动春装清货专项，目标 4 周内库存降至 55 天", "对竞品 Y 系列做价格带跟踪"] },
];

const meetingBrief: Section[] = [
  { title: "半年度关键趋势", items: ["营收同比 +6.3%，新品贡献占比从 8% 提升至 18%", "毛利率受原材料拖累累计下行 1.2pt", "电商渠道占比首次突破 35%"] },
  { title: "Top 异常（半年累计）", items: ["原材料成本累计 +12%", "华南区累计跑输大盘 5pt", "线下门店坪效同比 -3.2%"] },
  { title: "已验证根因", items: ["渠道结构调整 + 新品节奏带动整体增长", "原材料是毛利核心拖累，下半年敞口仍在"] },
  { title: "待验证假设", items: ["全年新品贡献能否突破 25%", "原材料价格是否在 Q3 见顶"] },
  { title: "外部对标串联", items: ["对标公司 A：营收同比 +4.8%，毛利率 30.1%（高于我司 1.5pt）", "对标公司 B：电商占比 42%，领先我司 7pt"] },
  { title: "建议动作", items: ["确认下半年新品节奏，确保 Q4 出 2 款重磅 SKU", "Q3 启动原材料对冲 + 替代供应商引入", "电商专项：会员复购 + 直播渠道扩容"] },
];

const sectionIcon = (i: number) => [TrendingDown, AlertTriangle, CheckCircle2, HelpCircle, Target, TrendingUp][i] ?? Target;

function SectionList({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-4">
      {sections.map((s, i) => {
        const Icon = sectionIcon(i);
        return (
          <div key={s.title} className="rounded-lg border border-border/60 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold">{s.title}</h4>
            </div>
            <ul className="space-y-1.5 text-sm">
              {s.items.map((it, j) => (
                <li key={j} className="flex gap-2 text-muted-foreground">
                  <span className="text-primary">·</span>
                  <span className="leading-relaxed">{it}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export function BriefingPanel() {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base">洞察简报</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">由异常中心 + 已完成根因分析自动汇总</p>
        </div>
        <div className="flex items-center gap-2">
          <SourceTag type="ai">AI 生成</SourceTag>
          <Button size="sm" variant="outline" className="h-7" onClick={() => toast.success("简报已导出")}>
            <Download className="h-3 w-3" /> 导出
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList>
            <TabsTrigger value="daily">日报</TabsTrigger>
            <TabsTrigger value="weekly">周报</TabsTrigger>
            <TabsTrigger value="meeting">
              会议模式
              <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[9px]">半年/年度</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="mt-4">
            <SectionList sections={dailyBrief} />
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <SectionList sections={weeklyBrief} />
          </TabsContent>
          <TabsContent value="meeting" className="mt-4">
            <SectionList sections={meetingBrief} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
