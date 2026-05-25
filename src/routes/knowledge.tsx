import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Sparkles,
  Users,
  Eye,
  FileText,
  Inbox,
  Plus,
  Copy,
  Globe,
  Lock,
  MoreHorizontal,
  ShieldCheck,
  Layers,
  HelpCircle,
  Library,
  Check,
  X,
  Send,
  Trash2,
  Pencil,
  ArrowUpRight,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceTag } from "@/components/SourceTag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "园地 · 企业知识空间" },
      {
        name: "description",
        content: "AI+人 模式的企业知识园地：官方加V库、公开共享与个人答案库一体化管理。",
      },
    ],
  }),
  component: KnowledgePage,
});

// ============================================================
// Types
// ============================================================
type Visibility = "official" | "public" | "personal";
type Role = "member" | "admin";

type FileItem = {
  id: string;
  name: string;
  updatedAt: string;
  size: string;
};

type Library = {
  id: string;
  title: string;
  summary: string;
  aiOverview: string;
  highlights: string[];
  owner: string;
  updatedAt: string;
  docCount: number;
  visibility: Visibility;
  category: "framework" | "questions" | "answers";
  files: FileItem[];
};

type AuditRequest = {
  id: string;
  fileName: string;
  fromLibrary: string;
  applicant: string;
  reason: string;
  submittedAt: string;
};

// ============================================================
// Mock Data
// ============================================================
const initialLibraries: Library[] = [
  {
    id: "off-1",
    title: "集团经营框架库",
    summary: "覆盖战略、财务、运营、人力四大维度的标准经营框架。",
    aiOverview:
      "本库系统梳理了集团核心经营分析框架，包含 12 个一级模块、48 个分析视角，适用于年度经营复盘与季度滚动预测。",
    highlights: ["战略-财务-运营-人力四维框架", "48 个标准分析视角", "对接 7 类常用报表口径"],
    owner: "战略发展部",
    updatedAt: "2025-09-12",
    docCount: 56,
    visibility: "official",
    category: "framework",
    files: [
      { id: "f1", name: "经营框架总纲 v3.2.pdf", updatedAt: "2025-09-12", size: "2.1 MB" },
      { id: "f2", name: "四维分析视角清单.xlsx", updatedAt: "2025-09-10", size: "480 KB" },
      { id: "f3", name: "框架应用案例集.docx", updatedAt: "2025-08-28", size: "1.6 MB" },
    ],
  },
  {
    id: "off-2",
    title: "集团核心问题库",
    summary: "AI+专家共建的 320 个标准经营问题，按主题分级管理。",
    aiOverview:
      "由 AI 自动抽取 + 业务专家校审形成的标准化问题集，支持按主题、紧急度、责任部门多维筛选。",
    highlights: ["320 个标准问题", "按主题/紧急度/部门分级", "季度更新一次"],
    owner: "战略发展部",
    updatedAt: "2025-09-30",
    docCount: 28,
    visibility: "official",
    category: "questions",
    files: [
      { id: "f4", name: "标准问题清单 Q3.xlsx", updatedAt: "2025-09-30", size: "640 KB" },
      { id: "f5", name: "问题分类规则.md", updatedAt: "2025-09-15", size: "32 KB" },
    ],
  },
  {
    id: "off-3",
    title: "集团官方答案库",
    summary: "基于官方问题库的标准答案与口径解释，权威性最高。",
    aiOverview:
      "对应核心问题库的标准答案，含数据口径、计算公式、参考来源；财务敏感数据已自动脱敏。",
    highlights: ["320 题标准答案", "财务数据脱敏", "全流程审计日志"],
    owner: "财务中心",
    updatedAt: "2025-10-08",
    docCount: 124,
    visibility: "official",
    category: "answers",
    files: [
      { id: "f6", name: "营收口径手册.pdf", updatedAt: "2025-10-08", size: "3.2 MB" },
      { id: "f7", name: "毛利计算示例.xlsx", updatedAt: "2025-10-05", size: "210 KB" },
      { id: "f8", name: "ROE 拆解模板.xlsx", updatedAt: "2025-09-28", size: "180 KB" },
    ],
  },
  {
    id: "pub-1",
    title: "渠道运营 SOP（华东）",
    summary: "华东大区线上线下渠道运营标准流程与关键节点说明。",
    aiOverview: "汇总华东大区近 2 年实操经验，包含 6 类渠道、19 个关键节点的标准动作。",
    highlights: ["6 类渠道全覆盖", "19 个关键节点", "含 12 个实战案例"],
    owner: "营销中心 · 张磊",
    updatedAt: "2025-10-02",
    docCount: 32,
    visibility: "public",
    category: "answers",
    files: [
      { id: "f9", name: "线上渠道 SOP.pdf", updatedAt: "2025-10-02", size: "1.8 MB" },
      { id: "f10", name: "线下门店巡检表.xlsx", updatedAt: "2025-09-20", size: "320 KB" },
    ],
  },
  {
    id: "pub-2",
    title: "财报快读 AI 模板",
    summary: "上市公司财报关键变化自动提取与解读模板。",
    aiOverview: "AI 模板可在 30 秒内完成 100 页财报的关键指标抽取与同环比对比。",
    highlights: ["30 秒解读财报", "自动同环比", "支持 A/H/美股"],
    owner: "财务中心 · 李婷",
    updatedAt: "2025-09-25",
    docCount: 18,
    visibility: "public",
    category: "answers",
    files: [
      { id: "f11", name: "财报模板 v2.docx", updatedAt: "2025-09-25", size: "520 KB" },
    ],
  },
  {
    id: "pub-3",
    title: "竞品监测周报模板",
    summary: "覆盖 8 家核心竞品的周度监测与变化预警模板。",
    aiOverview: "整合公开舆情 + 招聘 + 专利 + 财报四类信号，自动生成周报草稿。",
    highlights: ["8 家竞品", "4 类信号源", "周度自动生成"],
    owner: "战略发展部 · 王浩",
    updatedAt: "2025-10-10",
    docCount: 24,
    visibility: "public",
    category: "answers",
    files: [
      { id: "f12", name: "竞品监测周报模板.docx", updatedAt: "2025-10-10", size: "680 KB" },
    ],
  },
  {
    id: "my-1",
    title: "我的经营复盘笔记",
    summary: "个人维护的经营复盘草稿与思考备忘。",
    aiOverview: "本库含 6 篇月度复盘草稿，覆盖营收、成本、组织三个主题。",
    highlights: ["6 篇月度复盘", "三主题分类", "含联网检索引用"],
    owner: "我",
    updatedAt: "2025-10-15",
    docCount: 12,
    visibility: "personal",
    category: "answers",
    files: [
      { id: "f13", name: "9 月经营复盘.md", updatedAt: "2025-10-15", size: "48 KB" },
      { id: "f14", name: "组织效能思考.md", updatedAt: "2025-10-08", size: "22 KB" },
    ],
  },
  {
    id: "my-2",
    title: "新赛道调研草稿",
    summary: "AI 辅助生成的新能源储能赛道调研笔记。",
    aiOverview: "基于联网检索 + 深度思考生成的调研草稿，含 4 家标的初步对比。",
    highlights: ["新能源储能赛道", "4 家标的对比", "联网检索 + 深度思考"],
    owner: "我",
    updatedAt: "2025-10-12",
    docCount: 8,
    visibility: "personal",
    category: "answers",
    files: [
      { id: "f15", name: "储能赛道调研.docx", updatedAt: "2025-10-12", size: "1.2 MB" },
    ],
  },
];

const initialAudits: AuditRequest[] = [
  {
    id: "a1",
    fileName: "线上渠道 SOP.pdf",
    fromLibrary: "渠道运营 SOP（华东）",
    applicant: "张磊",
    reason: "已在华东大区试点 6 个月，建议沉淀为集团官方 SOP。",
    submittedAt: "2025-10-18",
  },
  {
    id: "a2",
    fileName: "财报模板 v2.docx",
    fromLibrary: "财报快读 AI 模板",
    applicant: "李婷",
    reason: "模板被 12 个部门复用，建议加V。",
    submittedAt: "2025-10-17",
  },
  {
    id: "a3",
    fileName: "竞品监测周报模板.docx",
    fromLibrary: "竞品监测周报模板",
    applicant: "王浩",
    reason: "周报已稳定运行 8 周，结构完善。",
    submittedAt: "2025-10-15",
  },
  {
    id: "a4",
    fileName: "组织效能思考.md",
    fromLibrary: "我的经营复盘笔记",
    applicant: "我",
    reason: "供管理层参考。",
    submittedAt: "2025-10-14",
  },
];

const stats = {
  weekVisitors: 1284,
  weekVisits: 5621,
  totalDocs: 326,
};

// ============================================================
// Page
// ============================================================
function KnowledgePage() {
  const [role, setRole] = useState<Role>("member");
  const [libraries, setLibraries] = useState<Library[]>(initialLibraries);
  const [audits, setAudits] = useState<AuditRequest[]>(initialAudits);
  const [detailLib, setDetailLib] = useState<Library | null>(null);
  const [editLib, setEditLib] = useState<Library | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const officials = useMemo(() => libraries.filter((l) => l.visibility === "official"), [libraries]);
  const publics = useMemo(() => libraries.filter((l) => l.visibility === "public"), [libraries]);
  const mine = useMemo(() => libraries.filter((l) => l.visibility === "personal"), [libraries]);

  // ----- Actions -----
  const copyToPersonal = (lib: Library) => {
    const copy: Library = {
      ...lib,
      id: `my-${Date.now()}`,
      title: `${lib.title}（我的副本）`,
      owner: "我",
      visibility: "personal",
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setLibraries((prev) => [copy, ...prev]);
    toast.success("已拷贝至我的答案库", { description: copy.title });
  };

  const togglePublic = (lib: Library) => {
    setLibraries((prev) =>
      prev.map((l) =>
        l.id === lib.id
          ? { ...l, visibility: l.visibility === "personal" ? "public" : "personal" }
          : l,
      ),
    );
    toast(lib.visibility === "personal" ? "已公开至共享空间" : "已收回至我的答案库");
  };

  const applyForOfficial = (lib: Library, file?: FileItem) => {
    const req: AuditRequest = {
      id: `a-${Date.now()}`,
      fileName: file?.name ?? `${lib.title}（整库）`,
      fromLibrary: lib.title,
      applicant: lib.owner,
      reason: "申请加入官方知识库。",
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    setAudits((prev) => [req, ...prev]);
    toast.success("已提交加入官方库申请", { description: "等待管理员审核" });
  };

  const approveAudit = (req: AuditRequest) => {
    setAudits((prev) => prev.filter((a) => a.id !== req.id));
    toast.success("🔔 已加V，文件移入官方库", {
      description: `已通知申请人 ${req.applicant}`,
    });
  };

  const rejectAudit = (req: AuditRequest) => {
    setAudits((prev) => prev.filter((a) => a.id !== req.id));
    toast(`已拒绝申请：${req.fileName}`, { description: `已通知申请人 ${req.applicant}` });
  };

  const upgradeToOfficial = (lib: Library) => {
    // 旧版回退逻辑：将同类目的现有官方版变为公开
    setLibraries((prev) =>
      prev.map((l) => {
        if (l.id === lib.id) return { ...l, visibility: "official" as Visibility };
        if (l.visibility === "official" && l.category === lib.category)
          return { ...l, visibility: "public" as Visibility, title: `${l.title}（已回退）` };
        return l;
      }),
    );
    toast.success("🔔 已加V发布", { description: "旧版本已自动回退为公开库" });
  };

  const saveLibrary = (data: { title: string; summary: string; isPublic: boolean }) => {
    if (editLib) {
      setLibraries((prev) =>
        prev.map((l) =>
          l.id === editLib.id
            ? {
                ...l,
                title: data.title,
                summary: data.summary,
                visibility: data.isPublic ? "public" : "personal",
              }
            : l,
        ),
      );
      toast.success("已保存");
      setEditLib(null);
    } else {
      const lib: Library = {
        id: `my-${Date.now()}`,
        title: data.title,
        summary: data.summary,
        aiOverview: "AI 将在文件入库后自动生成概览。",
        highlights: [],
        owner: "我",
        updatedAt: new Date().toISOString().slice(0, 10),
        docCount: 0,
        visibility: data.isPublic ? "public" : "personal",
        category: "answers",
        files: [],
      };
      setLibraries((prev) => [lib, ...prev]);
      toast.success("答案库已创建");
      setCreateOpen(false);
    }
  };

  const deleteLibrary = (id: string) => {
    setLibraries((prev) => prev.filter((l) => l.id !== id));
    setDeleteId(null);
    toast("答案库已删除");
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">园地 · 企业知识空间</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI + 人 共建：官方加V库 · 公开共享 · 个人答案库
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">演示角色</span>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="h-8 w-[148px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">普通成员</SelectItem>
              <SelectItem value="admin">单位管理员</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Board */}
      <StatsBoard pendingAudits={audits.length} />

      {/* Official Section */}
      <OfficialSection
        items={officials}
        role={role}
        onView={setDetailLib}
        onCopy={copyToPersonal}
      />

      {/* Tabs */}
      <Tabs defaultValue="public">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="public">公开答案库 · {publics.length}</TabsTrigger>
            <TabsTrigger value="mine">我的答案库 · {mine.length}</TabsTrigger>
            {role === "admin" && (
              <TabsTrigger value="audit">
                审核队列{audits.length > 0 && ` · ${audits.length}`}
              </TabsTrigger>
            )}
          </TabsList>
          <Button size="sm" className="gap-1" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            新建答案库
          </Button>
        </div>

        <TabsContent value="public" className="mt-4">
          <LibraryGrid
            items={publics}
            role={role}
            onView={setDetailLib}
            onCopy={copyToPersonal}
            onApply={(l) => applyForOfficial(l)}
            onUpgrade={upgradeToOfficial}
          />
        </TabsContent>

        <TabsContent value="mine" className="mt-4">
          <LibraryGrid
            items={mine}
            role={role}
            isMine
            onView={setDetailLib}
            onTogglePublic={togglePublic}
            onApply={(l) => applyForOfficial(l)}
            onEdit={setEditLib}
            onDelete={(id) => setDeleteId(id)}
          />
        </TabsContent>

        {role === "admin" && (
          <TabsContent value="audit" className="mt-4">
            <AuditQueue items={audits} onApprove={approveAudit} onReject={rejectAudit} />
          </TabsContent>
        )}
      </Tabs>

      {/* Detail Dialog */}
      <LibraryDetailDialog
        library={detailLib}
        role={role}
        onClose={() => setDetailLib(null)}
        onCopy={copyToPersonal}
        onApplyFile={(lib, file) => applyForOfficial(lib, file)}
      />

      {/* Create / Edit Dialog */}
      <CreateLibraryDialog
        open={createOpen || !!editLib}
        editing={editLib}
        onClose={() => {
          setCreateOpen(false);
          setEditLib(null);
        }}
        onSave={saveLibrary}
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该答案库？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后该答案库及其所有文件将无法恢复。如需保留，请改为收回至个人空间。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteLibrary(deleteId)}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// Stats Board
// ============================================================
function StatsBoard({ pendingAudits }: { pendingAudits: number }) {
  const items = [
    { icon: Users, label: "周访问人数", value: stats.weekVisitors.toLocaleString(), trend: "+12.4%" },
    { icon: Eye, label: "周访问次数", value: stats.weekVisits.toLocaleString(), trend: "+8.7%" },
    { icon: FileText, label: "文档总数", value: stats.totalDocs.toLocaleString(), trend: "+18" },
    { icon: Inbox, label: "待审申请", value: pendingAudits.toString(), trend: "实时" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <Card key={it.label} className="border-border/60 shadow-sm">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">{it.label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{it.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{it.trend}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-soft text-primary">
              <it.icon className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================
// Official Section
// ============================================================
function OfficialSection({
  items,
  role,
  onView,
  onCopy,
}: {
  items: Library[];
  role: Role;
  onView: (l: Library) => void;
  onCopy: (l: Library) => void;
}) {
  const categoryMeta = {
    framework: { icon: Layers, label: "经营框架库" },
    questions: { icon: HelpCircle, label: "问题库" },
    answers: { icon: Library, label: "答案库" },
  };

  return (
    <Card className="relative overflow-hidden border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-background to-accent/30 shadow-md">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-primary-foreground shadow-sm">
              <BadgeCheck className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">企业权威知识库</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                每个企业单位仅 1 个权威版本，由管理员认证发布
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            {role === "admin" ? "你是管理员，可发布加V" : "拷贝至个人库后可二次编辑"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3">
          {items.map((lib) => {
            const meta = categoryMeta[lib.category];
            return (
              <div
                key={lib.id}
                className="group relative rounded-lg border border-primary/20 bg-card/80 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md gradient-primary text-primary-foreground">
                      <meta.icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-primary">
                        {meta.label}
                      </p>
                      <p className="text-sm font-semibold leading-tight">{lib.title}</p>
                    </div>
                  </div>
                  <SourceTag type="verified">加V</SourceTag>
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {lib.summary}
                </p>
                <div className="mt-3 rounded-md bg-accent/40 p-2.5">
                  <div className="flex items-center gap-1 text-[10px] font-medium text-primary">
                    <Sparkles className="h-3 w-3" />
                    AI 概览
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                    {lib.aiOverview}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{lib.docCount} 文档 · {lib.updatedAt}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-[11px]"
                      onClick={() => onView(lib)}
                    >
                      查看
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-[11px]"
                      onClick={() => onCopy(lib)}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      拷贝
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Library Grid + Card
// ============================================================
function LibraryGrid({
  items,
  role,
  isMine,
  onView,
  onCopy,
  onApply,
  onTogglePublic,
  onEdit,
  onDelete,
  onUpgrade,
}: {
  items: Library[];
  role: Role;
  isMine?: boolean;
  onView: (l: Library) => void;
  onCopy?: (l: Library) => void;
  onApply?: (l: Library) => void;
  onTogglePublic?: (l: Library) => void;
  onEdit?: (l: Library) => void;
  onDelete?: (id: string) => void;
  onUpgrade?: (l: Library) => void;
}) {
  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <BookOpen className="h-8 w-8 opacity-40" />
          暂无答案库
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((lib) => (
        <LibraryCard
          key={lib.id}
          lib={lib}
          role={role}
          isMine={isMine}
          onView={onView}
          onCopy={onCopy}
          onApply={onApply}
          onTogglePublic={onTogglePublic}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpgrade={onUpgrade}
        />
      ))}
    </div>
  );
}

function LibraryCard({
  lib,
  role,
  isMine,
  onView,
  onCopy,
  onApply,
  onTogglePublic,
  onEdit,
  onDelete,
  onUpgrade,
}: {
  lib: Library;
  role: Role;
  isMine?: boolean;
  onView: (l: Library) => void;
  onCopy?: (l: Library) => void;
  onApply?: (l: Library) => void;
  onTogglePublic?: (l: Library) => void;
  onEdit?: (l: Library) => void;
  onDelete?: (id: string) => void;
  onUpgrade?: (l: Library) => void;
}) {
  return (
    <Card className="group flex flex-col border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-soft text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm leading-snug">{lib.title}</CardTitle>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {lib.owner} · {lib.updatedAt}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onView(lib)}>
                <Eye className="mr-2 h-4 w-4" />
                查看详情
              </DropdownMenuItem>
              {!isMine && onCopy && (
                <DropdownMenuItem onClick={() => onCopy(lib)}>
                  <Copy className="mr-2 h-4 w-4" />
                  拷贝至我的库
                </DropdownMenuItem>
              )}
              {isMine && onTogglePublic && (
                <DropdownMenuItem onClick={() => onTogglePublic(lib)}>
                  {lib.visibility === "personal" ? (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      公开至共享空间
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      收回至个人
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {onApply && (
                <DropdownMenuItem onClick={() => onApply(lib)}>
                  <Send className="mr-2 h-4 w-4" />
                  申请加入官方库
                </DropdownMenuItem>
              )}
              {role === "admin" && !isMine && onUpgrade && (
                <DropdownMenuItem onClick={() => onUpgrade(lib)}>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  加V发布为官方
                </DropdownMenuItem>
              )}
              {isMine && (onEdit || onDelete) && <DropdownMenuSeparator />}
              {isMine && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(lib)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  重命名/描述
                </DropdownMenuItem>
              )}
              {isMine && onDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(lib.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="text-xs leading-relaxed text-muted-foreground">{lib.summary}</p>
        <div className="mt-3 rounded-md bg-accent/40 p-2.5">
          <div className="flex items-center gap-1 text-[10px] font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            AI 概览
          </div>
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {lib.aiOverview}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {lib.highlights.slice(0, 3).map((h) => (
            <Badge key={h} variant="secondary" className="text-[10px] font-normal">
              {h}
            </Badge>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-[11px] text-muted-foreground">{lib.docCount} 文档</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 text-xs"
            onClick={() => onView(lib)}
          >
            打开
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Detail Dialog
// ============================================================
function LibraryDetailDialog({
  library,
  role,
  onClose,
  onCopy,
  onApplyFile,
}: {
  library: Library | null;
  role: Role;
  onClose: () => void;
  onCopy: (l: Library) => void;
  onApplyFile: (l: Library, f: FileItem) => void;
}) {
  if (!library) return null;
  const isOfficial = library.visibility === "official";
  return (
    <Dialog open={!!library} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-base">{library.title}</DialogTitle>
            {isOfficial && <SourceTag type="verified">加V</SourceTag>}
            {library.visibility === "public" && (
              <Badge variant="secondary" className="text-[10px]">
                公开
              </Badge>
            )}
            {library.visibility === "personal" && (
              <Badge variant="outline" className="text-[10px]">
                个人
              </Badge>
            )}
          </div>
          <DialogDescription>
            {library.owner} · 更新于 {library.updatedAt} · {library.docCount} 文档
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-accent/30 p-3">
          <div className="flex items-center gap-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI 概览
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {library.aiOverview}
          </p>
          {library.highlights.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {library.highlights.map((h) => (
                <Badge key={h} variant="secondary" className="text-[10px] font-normal">
                  {h}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">文件清单</p>
          <ScrollArea className="h-[240px] rounded-md border">
            <div className="divide-y">
              {library.files.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground">暂无文件</div>
              )}
              {library.files.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-accent/40"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{f.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {f.updatedAt} · {f.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]">
                      查看
                    </Button>
                    {!isOfficial && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-[11px]"
                        onClick={() => onApplyFile(library, f)}
                      >
                        <Send className="mr-1 h-3 w-3" />
                        申请加V
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          {role === "admin" && isOfficial && (
            <Badge variant="outline" className="mr-auto text-[10px]">
              <ShieldCheck className="mr-1 h-3 w-3" />
              官方版本，由管理员维护
            </Badge>
          )}
          <Button variant="outline" onClick={() => onCopy(library)}>
            <Copy className="mr-1 h-4 w-4" />
            拷贝至我的库
          </Button>
          <Button onClick={onClose}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Audit Queue (Admin)
// ============================================================
function AuditQueue({
  items,
  onApprove,
  onReject,
}: {
  items: AuditRequest[];
  onApprove: (r: AuditRequest) => void;
  onReject: (r: AuditRequest) => void;
}) {
  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Inbox className="h-8 w-8 opacity-40" />
          暂无待审申请
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-0">
        <div className="divide-y">
          {items.map((req) => (
            <div key={req.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-soft text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{req.fileName}</p>
                    <Badge variant="outline" className="text-[10px]">
                      来自：{req.fromLibrary}
                    </Badge>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{req.reason}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    申请人：{req.applicant} · 提交：{req.submittedAt}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="h-8">
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  查看
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={() => onReject(req)}
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  拒绝
                </Button>
                <Button size="sm" className="h-8" onClick={() => onApprove(req)}>
                  <Check className="mr-1 h-3.5 w-3.5" />
                  同意加V
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Create / Edit Dialog
// ============================================================
function CreateLibraryDialog({
  open,
  editing,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: Library | null;
  onClose: () => void;
  onSave: (data: { title: string; summary: string; isPublic: boolean }) => void;
}) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // Reset on open
  useEffect(() => {
    if (open) {
      setTitle(editing?.title ?? "");
      setSummary(editing?.summary ?? "");
      setIsPublic(editing?.visibility === "public");
    }
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "编辑答案库" : "新建答案库"}</DialogTitle>
          <DialogDescription>
            基于官方模板二次编辑，支持联网检索与深度思考。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="lib-title">名称</Label>
            <Input
              id="lib-title"
              placeholder="例如：华南渠道运营笔记"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lib-summary">描述</Label>
            <Textarea
              id="lib-summary"
              placeholder="简要描述本答案库的用途与覆盖范围"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="lib-public" className="text-sm">
                公开至共享空间
              </Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                公开后其他成员可查看与拷贝，仍可随时收回
              </p>
            </div>
            <Switch id="lib-public" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            disabled={!title.trim()}
            onClick={() => onSave({ title: title.trim(), summary: summary.trim(), isPublic })}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

