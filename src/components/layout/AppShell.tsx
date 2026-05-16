import Link from "next/link";
import type { ReactNode } from "react";

import { DataStatusBanner } from "@/components/layout/DataStatusBanner";
import type { DataSourceInfo } from "@/server/services/reading-data";

const navItems = [
  { href: "/", label: "总览" },
  { href: "/bookshelf", label: "书架" },
  { href: "/stats", label: "统计" },
  { href: "/notes", label: "笔记" },
  { href: "/discover", label: "发现" },
  { href: "/settings", label: "设置" },
];

export function AppShell({
  children,
  dataSource,
}: {
  children: ReactNode;
  dataSource: DataSourceInfo;
}) {
  return (
    <>
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
      <main>{children}</main>
      <footer className="border-t-[3px] border-[var(--ink)] py-8">
        <div className="type-caption container-shell flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>微信读书个人阅读分析工具</p>
          <p>连接 Skill API · 书架 · 统计 · 划线 · 推荐</p>
        </div>
      </footer>
    </>
  );
}
