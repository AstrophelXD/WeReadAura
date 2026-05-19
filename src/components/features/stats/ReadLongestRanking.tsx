import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { ReadLongestEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ReadLongestRanking({ items }: { items: ReadLongestEntry[] }) {
  if (items.length === 0) {
    return null;
  }

  const maxSeconds = Math.max(...items.map((item) => item.durationSeconds), 1);

  return (
    <Card>
      <h3 className="type-card-title-lg">读得最久</h3>
      <p className="type-caption mt-2">当前周期内阅读/收听时长排行（低于 5 分钟已过滤）。</p>
      <ol className="mt-5 space-y-4">
        {items.map((item, index) => {
          const width = Math.max(8, Math.round((item.durationSeconds / maxSeconds) * 100));
          const row = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="type-card-title truncate">
                    <span className="type-caption-muted mr-2">{index + 1}.</span>
                    {item.title}
                  </p>
                  {item.subtitle ? (
                    <p className="type-caption mt-1 truncate">{item.subtitle}</p>
                  ) : null}
                  {item.tags.length > 0 ? (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="type-caption rounded-[var(--radius-sm)] border border-[var(--ink)] bg-[var(--muted)] px-2 py-0.5"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <span className="type-caption shrink-0 font-medium">{item.durationLabel}</span>
              </div>
              <div className="mt-2 h-2 w-full bg-[color-mix(in_srgb,var(--ink)_10%,transparent)]">
                <div
                  className={cn(
                    "h-full",
                    item.kind === "album" ? "bg-[var(--pink)]" : "bg-[var(--blue)]",
                  )}
                  style={{ width: `${width}%` }}
                />
              </div>
            </>
          );

          return (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className="block transition-opacity hover:opacity-85">
                  {row}
                </Link>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
