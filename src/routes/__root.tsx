import { createRootRoute, HeadContent, Link, Scripts } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { ReportDraftProvider } from "@/contexts/ReportDraftContext";
import { EvidenceProvider } from "@/components/benchmark/EvidenceDrawer";

import appCss from "../styles.css?url";

function RootComponent() {
  return (
    <ReportDraftProvider>
      <EvidenceProvider>
        <AppLayout />
      </EvidenceProvider>
    </ReportDraftProvider>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">页面不存在</h2>
        <p className="mt-2 text-sm text-muted-foreground">您访问的页面已被移除或暂未实现。</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AI经营分析 | AI 驱动的企业洞察平台" },
      { name: "description", content: "面向集团企业的 AI 经营分析平台：监控、洞察、报告、对标、知识。" },
      { property: "og:title", content: "AI经营分析 | AI 驱动的企业洞察平台" },
      { name: "twitter:title", content: "AI经营分析 | AI 驱动的企业洞察平台" },
      { property: "og:description", content: "面向集团企业的 AI 经营分析平台：监控、洞察、报告、对标、知识。" },
      { name: "twitter:description", content: "面向集团企业的 AI 经营分析平台：监控、洞察、报告、对标、知识。" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2eefe1bc-6226-4bc7-a235-0a6c4857520c" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2eefe1bc-6226-4bc7-a235-0a6c4857520c" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
