import { Card } from "@/components/ui/Card";
import type { StatsInsightMetric } from "@/lib/types";

export function ReadStatGrid({ items }: { items: StatsInsightMetric[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="type-card-title-lg">阅读摘要</h3>
      <p className="type-caption mt-2">来自 readStat 的周期统计项。</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-baseline justify-between gap-3 border-2 border-[var(--ink)] bg-[var(--white)] px-4 py-3"
          >
            <span className="type-field-label">{item.label}</span>
            <span className="type-card-title shrink-0">{item.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
