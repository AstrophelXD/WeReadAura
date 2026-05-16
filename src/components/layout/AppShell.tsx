import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/bookshelf", label: "Bookshelf" },
  { href: "/stats", label: "Stats" },
  { href: "/notes", label: "Notes" },
  { href: "/discover", label: "Discover" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="neo-nav">
        <div className="container-shell flex min-h-[72px] items-center justify-between gap-4 py-3">
          <Link className="text-2xl font-black tracking-[-0.05em]" href="/">
            WeReadAura
          </Link>
          <nav className="hidden items-center gap-3 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} className="font-extrabold" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t-[3px] border-[var(--ink)] py-8">
        <div className="container-shell flex flex-col gap-2 text-sm font-semibold md:flex-row md:items-center md:justify-between">
          <p>Minimal MVP for personal WeRead analytics.</p>
          <p>Plain neo-brutalism, mock data first, real gateway later.</p>
        </div>
      </footer>
    </>
  );
}
