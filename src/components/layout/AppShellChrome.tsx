"use client";

import Link from "next/link";
import { Suspense, useState } from "react";

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
  { href: "/settings", label: "设置" },
];

export function AppShellChrome({
  children,
  dataSource,
  aiConfigured,
}: {
  children: React.ReactNode;
  dataSource: DataSourceInfo;
  aiConfigured: boolean;
}) {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div
      className={cn("app-shell", assistantOpen && "app-shell--assistant-open")}
      data-assistant-open={assistantOpen ? "" : undefined}
    >
      <div className="app-shell__main">
        <header className="neo-nav">
          <div className="container-shell flex min-h-[72px] items-center justify-between gap-4 py-3">
            <Link className="type-nav-brand" href="/">
              WeReadAura
            </Link>
            <nav className="hidden items-center gap-3 md:flex">
              {navItems.map((item) => (
                <Link key={item.href} className="type-nav-link" href={item.href}>
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
            assistantOpen ? "scrollbar--split-edge" : "scrollbar--page-gutter",
          )}
        >
          <main>{children}</main>
          <footer className="border-t-[3px] border-[var(--ink)] py-8">
            <div className="type-caption container-shell flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p>微信读书个人阅读分析工具</p>
              <p>连接 Skill API · 书架 · 统计 · 划线 · 推荐</p>
            </div>
          </footer>
        </div>
      </div>

      {assistantOpen ? (
        <Suspense fallback={null}>
          <AssistantPanel
            dataSource={dataSource}
            aiConfigured={aiConfigured}
            onClose={() => setAssistantOpen(false)}
          />
        </Suspense>
      ) : null}

      {!assistantOpen ? (
        <button
          type="button"
          aria-expanded={false}
          aria-controls="assistant-panel"
          className="neo-button neo-button--primary neo-press app-shell__fab min-h-12 px-5 font-biao shadow-[var(--shadow)] motion-reduce:transform-none"
          onClick={() => setAssistantOpen(true)}
        >
          阅读助手
        </button>
      ) : null}
    </div>
  );
}
