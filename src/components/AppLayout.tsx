import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Activity,
  Lightbulb,
  FileText,
  GitCompare,
  BookOpen,
  Settings,
  Search,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";

const navItems = [
  { to: "/", label: "首页", icon: LayoutDashboard, exact: true, disabled: false },
  { to: "/monitor", label: "监控", icon: Activity, exact: false, disabled: false },
  { to: "/benchmark", label: "对标", icon: GitCompare, exact: false, disabled: false },
  { to: "/report", label: "报告", icon: FileText, exact: false, disabled: false },
  { to: "/insight", label: "洞察Why", icon: Lightbulb, exact: false, disabled: true },
  { to: "/knowledge", label: "园地", icon: BookOpen, exact: false, disabled: false },
] as const;

export function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="glass-sidebar hidden w-60 shrink-0 flex-col lg:flex">
        <div className="flex h-16 items-center gap-2 px-6">
          <div className="glass-chip flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden">
            <img src={logoImg} alt="AI经营分析 Logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-sm font-semibold text-sidebar-foreground">AI经营分析</div>
            <div className="text-[11px] text-muted-foreground">AI Business Insight</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "glass-tint text-sidebar-accent-foreground"
                    : item.disabled
                      ? "text-sidebar-foreground/40 hover:bg-white/20 hover:text-sidebar-foreground/60"
                      : "text-sidebar-foreground/80 hover:bg-white/30 hover:backdrop-blur-md hover:text-sidebar-accent-foreground",
                )}
                title={item.disabled ? "即将上线" : undefined}
              >
                <span className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-all",
                  active ? "glass-chip text-primary" : "text-current",
                )}>
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="flex-1">{item.label}</span>
                {item.disabled && (
                  <span className="rounded-full bg-muted/60 px-1.5 py-0.5 text-[9px] text-muted-foreground">
                    即将上线
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive("/admin")
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
            )}
          >
            <Settings className="h-4 w-4" />
            管理台
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-bar sticky top-0 z-10 flex h-16 items-center gap-4 px-6">
          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="问数：例如「上月华东销售同比变化」"
              className="glass h-10 rounded-full border-0 pl-10 pr-20"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full gradient-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-soft">
              ChatBI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="glass-chip rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-sm font-semibold text-primary-foreground shadow-soft ring-1 ring-white/40">
              李
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
