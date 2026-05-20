"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AssistantPanel } from "@/components/features/assistant/AssistantPanel";
import { DataStatusBanner } from "@/components/layout/DataStatusBanner";
import { cn } from "@/lib/cn";
import type { DataSourceInfo } from "@/server/services/reading-data";

const navItems = [
  { href: "/", label: "总览" },
  { href: "/bookshelf", label: "书架" },
  { href: "/stats", label: "统计" },
  { href: "/notes", label: "笔记" },
  { href: "/discover", label: "发现" },
  { href: "/assistant", label: "助手" },
  { href: "/settings", label: "设置" },
];

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShellChrome({
  children,
  dataSource,
  aiConfigured,
}: {
  children: React.ReactNode;
  dataSource: DataSourceInfo;
  aiConfigured: boolean;
}) {
  const pathname = usePathname();
  const isAssistantPage = pathname === "/assistant" || pathname.startsWith("/assistant/");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const showSidebar = assistantOpen && !isAssistantPage;

  useEffect(() => {
    if (isAssistantPage) {
      setAssistantOpen(false);
    }
  }, [isAssistantPage]);

  return (
    <div className={cn("app-shell", showSidebar && "app-shell--assistant-open")}>
      <div className="app-shell__main">
        <header className="neo-nav">
          <div className="container-shell flex min-h-[72px] items-center justify-between gap-4 py-3">
            <Link className="type-nav-brand" href="/">
              WeReadAura
            </Link>
            <nav className="hidden items-center gap-3 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isNavActive(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "type-nav-link",
                    isNavActive(pathname, item.href) && "type-nav-link--active",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <DataStatusBanner info={dataSource} />
        <div
          className={cn(
            "app-shell__main-scroll scrollbar",
            showSidebar ? "scrollbar--split-edge" : "scrollbar--page-gutter",
            isAssistantPage && "app-shell__main-scroll--assistant-page",
          )}
        >
          <main className={cn(isAssistantPage && "app-shell__main--assistant-page")}>
            {children}
          </main>
          {!isAssistantPage ? (
            <footer className="border-t-[3px] border-[var(--ink)] py-8">
              <div className="type-caption container-shell flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <p>微信读书个人阅读分析工具</p>
                <p>连接 Skill API · 书架 · 统计 · 划线 · 推荐</p>
              </div>
            </footer>
          ) : null}
        </div>
      </div>

      {showSidebar ? (
        <Suspense fallback={null}>
          <AssistantPanel
            dataSource={dataSource}
            aiConfigured={aiConfigured}
            onClose={() => setAssistantOpen(false)}
          />
        </Suspense>
      ) : null}

      {!isAssistantPage ? (
        <button
          type="button"
          aria-expanded={assistantOpen}
          aria-controls="assistant-panel"
          className="neo-button neo-button--primary neo-press app-shell__fab min-h-12 px-5 font-biao shadow-[var(--shadow)] motion-reduce:transform-none"
          onClick={() => setAssistantOpen((open) => !open)}
        >
          阅读助手
        </button>
      ) : null}
    </div>
  );
}
